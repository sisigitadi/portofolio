/**
 * Route-level tests for the visitor-tracker Cloudflare Worker (worker.js).
 * Zero dependencies — Node's built-in test runner (Node 20+):
 *
 *   node --test worker-visitor/worker.test.js
 *   # or, from worker-visitor/: npm test
 *
 * Covers every route: /count, /hit, /pixel, /api/stats, /api/export,
 * /dashboard — including auth, rate limiting, the 10 KB body guard, the
 * fail-closed IP_HASH_SALT check, and CORS.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';

const BASE = 'https://tracker.example';

/* ------------------------------- fakes ------------------------------- */

/**
 * Minimal in-memory D1 fake. All queries are recorded in `calls`; inserts
 * land in `rows`. `first`/`all` can be overridden per test (the worker only
 * ever runs COUNT(*) ... first(), SELECT ... all(), and one INSERT ... run()).
 */
function makeDB(overrides = {}) {
  const rows = [];
  const calls = [];
  return {
    rows,
    calls,
    prepare(sql) {
      const q = {
        sql,
        args: [],
        bind(...args) {
          q.args = args;
          return q;
        },
        async first() {
          calls.push(['first', q.sql, [...q.args]]);
          return overrides.first ? overrides.first(q.sql, q.args) : { c: 0 };
        },
        async all() {
          calls.push(['all', q.sql, [...q.args]]);
          return overrides.all ? overrides.all(q.sql, q.args) : { results: [] };
        },
        async run() {
          calls.push(['run', q.sql, [...q.args]]);
          rows.push([...q.args]);
          return { success: true };
        },
      };
      return q;
    },
  };
}

/** Minimal KV fake matching the three methods the worker uses. */
function makeKV(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    async get(k, type) {
      const val = store.has(k) ? store.get(k) : null;
      if (val && type === 'json') {
        try { return JSON.parse(val); } catch { return null; }
      }
      return val;
    },
    async put(k, v) {
      store.set(k, v);
    },
    async delete(k) {
      store.delete(k);
    },
    has(k) {
      return store.has(k);
    },
  };
}

/** Standard env; override any binding per test via opts. */
function makeEnv(db, opts = {}) {
  return {
    DB: db,
    VISITS: 'visits' in opts ? opts.visits : makeKV(),
    IP_HASH_SALT: 'ipHashSalt' in opts ? opts.ipHashSalt : 'test-salt',
    DASHBOARD_KEY: 'dashboardKey' in opts ? opts.dashboardKey : 'secret-key',
  };
}

/** Fire a request at the worker and return the raw Response. */
function request(method, path, { env, body, headers = {}, duplex } = {}) {
  const init = { method, headers };
  if (body !== undefined) init.body = body;
  if (duplex) init.duplex = duplex;
  return worker.fetch(new Request(BASE + path, init), env);
}

/** sha256 hex of a string — mirrors the worker's IP hashing. */
async function sha256(str) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------- /hit -------------------------------- */

describe('POST /hit', () => {
  test('records a visit: salted IP hash + truncated fields', async () => {
    const db = makeDB();
    const res = await request('POST', '/hit', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0' },
      body: JSON.stringify({ path: '/portofolio', referrer: 'https://example.com/ref' }),
    });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).ok, true);

    assert.equal(db.rows.length, 1);
    const [ipHash, city, cc, lat, lon, tz, asn, asOrg, region, regionCode, continent, isBot, ua, referrer, path, isUnique, createdAt] = db.rows[0];
    assert.equal(ipHash, await sha256('test-salt' + 'unknown')); // no CF-Connecting-IP in tests -> 'unknown'
    assert.equal(city, '');   // null geo fields are stored as '' via truncate()
    assert.equal(cc, '');
    assert.equal(lat, null);  // lat/lon pass through untouched
    assert.equal(lon, null);
    assert.equal(isBot, 0);
    assert.ok(ua.includes('Chrome'));
    assert.equal(referrer, 'https://example.com/ref');
    assert.equal(path, '/portofolio');
    assert.equal(isUnique, 1);
    assert.ok(typeof createdAt === 'number' && createdAt <= Date.now());
  });

  test('invalidates the /count KV cache after recording', async () => {
    const kv = makeKV({ count_cache: JSON.stringify({ count: 3, uniq: 1, today: 0, uniq_today: 0 }) });
    const db = makeDB();
    const res = await request('POST', '/hit', { env: makeEnv(db, { visits: kv }), headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(res.status, 200);
    assert.equal(kv.has('count_cache'), false);
  });

  test('rejects oversized body via Content-Length with 413, no DB write', async () => {
    const db = makeDB();
    const res = await request('POST', '/hit', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'x'.repeat(20 * 1024) }),
    });
    assert.equal(res.status, 413);
    assert.deepEqual(await res.json(), { error: 'payload_too_large' });
    assert.equal(db.rows.length, 0);
  });

  test('rejects oversized chunked body mid-stream with 413, no DB write', async () => {
    const db = makeDB();
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode('{"path":"' + 'a'.repeat(8000)));
        c.enqueue(new TextEncoder().encode('b'.repeat(8000) + '"}'));
        c.close();
      },
    });
    const res = await request('POST', '/hit', { env: makeEnv(db), headers: { 'Content-Type': 'application/json' }, body: stream, duplex: 'half' });
    assert.equal(res.status, 413);
    assert.deepEqual(await res.json(), { error: 'payload_too_large' });
    assert.equal(db.rows.length, 0);
  });

  test('rate-limits at 20 hits/minute per IP hash', async () => {
    const db = makeDB({ first: (sql) => (/ip_hash/.test(sql) ? { c: 20 } : { c: 0 }) });
    const res = await request('POST', '/hit', { env: makeEnv(db), headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(res.status, 429);
    assert.deepEqual(await res.json(), { error: 'rate_limited' });
    assert.equal(db.rows.length, 0);
  });

  test('fails closed when IP_HASH_SALT is missing', async () => {
    const db = makeDB();
    const res = await request('POST', '/hit', { env: makeEnv(db, { ipHashSalt: undefined }), headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(res.status, 500);
    assert.equal(db.rows.length, 0);
  });

  test('fails closed when IP_HASH_SALT is a CHANGE_ME_ placeholder', async () => {
    const db = makeDB();
    const res = await request('POST', '/hit', { env: makeEnv(db, { ipHashSalt: 'CHANGE_ME_salt' }), headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(res.status, 500);
    assert.equal(db.rows.length, 0);
  });

  test('treats empty and malformed bodies as {} and still records', async () => {
    for (const body of [undefined, '{not json']) {
      const db = makeDB();
      const res = await request('POST', '/hit', { env: makeEnv(db), headers: { 'Content-Type': 'application/json' }, body });
      assert.equal(res.status, 200);
      assert.equal(db.rows.length, 1);
    }
  });
});

/* ------------------------------ /count ------------------------------- */

describe('GET /count', () => {
  test('returns totals from D1 and caches in KV', async () => {
    const db = makeDB({ first: () => ({ c: 7 }) });
    const kv = makeKV();
    const res = await request('GET', '/count', { env: makeEnv(db, { visits: kv }) });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { count: 7, uniq: 7, today: 7, uniq_today: 7 });
    assert.equal(kv.has('count_cache'), true);
  });

  test('serves the KV cache when present without touching D1', async () => {
    const db = makeDB();
    const kv = makeKV({ count_cache: JSON.stringify({ count: 5, uniq: 2, today: 1, uniq_today: 0 }) });
    const res = await request('GET', '/count', { env: makeEnv(db, { visits: kv }) });
    assert.deepEqual(await res.json(), { count: 5, uniq: 2, today: 1, uniq_today: 0 });
    assert.equal(db.calls.length, 0);
  });

  test('works without KV bound', async () => {
    const db = makeDB();
    const res = await request('GET', '/count', { env: makeEnv(db, { visits: null }) });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { count: 0, uniq: 0, today: 0, uniq_today: 0 });
  });
});

/* ---------------------------- /api/stats ----------------------------- */

describe('GET /api/stats', () => {
  test('403 without a key', async () => {
    const res = await request('GET', '/api/stats', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 403);
  });

  test('403 with a wrong key', async () => {
    const res = await request('GET', '/api/stats?key=wrong', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 403);
  });

  test('403 when DASHBOARD_KEY is a CHANGE_ME_ placeholder, even with a matching key', async () => {
    const res = await request('GET', '/api/stats?key=CHANGE_ME_x', { env: makeEnv(makeDB(), { dashboardKey: 'CHANGE_ME_x' }) });
    assert.equal(res.status, 403);
  });

  test('200 with the correct key: stats + rows + limit', async () => {
    const rows = [{ created_at: 1, ip_hash: 'a'.repeat(64), city: 'Jakarta', country_code: 'ID' }];
    const db = makeDB({ all: () => ({ results: rows }) });
    const res = await request('GET', '/api/stats?key=secret-key', { env: makeEnv(db) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.rows.length, 1);
    assert.equal(data.rows[0].city, 'Jakarta');
    assert.equal(data.limit, 2000); // DASHBOARD_ROWS default
    assert.deepEqual(data.stats, { count: 0, uniq: 0, today: 0, uniq_today: 0 });
  });
});

/* ---------------------------- /api/export ---------------------------- */

describe('GET /api/export', () => {
  test('403 without a key', async () => {
    const res = await request('GET', '/api/export', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 403);
  });

  test('200 with the correct key: CSV with proper quoting', async () => {
    const rows = [{
      created_at: 123, ip_hash: 'h', city: 'Jakarta', country_code: 'ID', region: 'Banten',
      region_code: 'BT', continent: 'AS', timezone: 'Asia/Jakarta', asn: 15169,
      as_org: 'ACME, Inc', is_bot: 0, path: '/x', referrer: 'https://a.b/"q"',
      user_agent: 'ua', is_unique: 1,
    }];
    const db = makeDB({ all: () => ({ results: rows }) });
    const res = await request('GET', '/api/export?key=secret-key', { env: makeEnv(db) });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'text/csv; charset=utf-8');
    assert.match(res.headers.get('Content-Disposition'), /attachment/);
    const lines = (await res.text()).split('\n');
    assert.equal(lines[0], 'created_at,ip_hash,city,country_code,region,region_code,continent,timezone,asn,as_org,is_bot,path,referrer,user_agent,is_unique');
    assert.ok(lines[1].includes('"ACME, Inc"'), 'comma cell quoted');
    assert.ok(lines[1].includes('"https://a.b/""q"""'), 'embedded quotes doubled');
  });
});

/* ---------------------------- /dashboard ----------------------------- */

describe('GET /dashboard', () => {
  test('serves the login page without a key, with no-referrer policy', async () => {
    const res = await request('GET', '/dashboard', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Referrer-Policy'), 'no-referrer');
    assert.match(await res.text(), /Visitor Dashboard/);
  });

  test('serves the dashboard with the correct key', async () => {
    const db = makeDB({ all: () => ({ results: [] }) });
    const res = await request('GET', '/dashboard?key=secret-key', { env: makeEnv(db) });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Referrer-Policy'), 'no-referrer');
    assert.match(await res.text(), /private dashboard/);
  });

  test('serves the login page for a wrong key', async () => {
    const res = await request('GET', '/dashboard?key=wrong', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Visitor Dashboard/);
  });
});

/* ------------------------------ /pixel ------------------------------- */

describe('GET /pixel', () => {
  test('returns a 1x1 GIF and records a hit (bots flagged)', async () => {
    const db = makeDB();
    const res = await request('GET', '/pixel?path=/portofolio', { env: makeEnv(db), headers: { 'User-Agent': 'curl/8.0' } });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'image/gif');
    const buf = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual([...buf.slice(0, 6)], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // "GIF89a"
    assert.equal(db.rows.length, 1);
    assert.equal(db.rows[0][14], '/portofolio'); // path
    assert.equal(db.rows[0][11], 1);             // is_bot (curl UA)
  });

  test('still returns the GIF when rate-limited (silent drop)', async () => {
    const db = makeDB({ first: (sql) => (/ip_hash/.test(sql) ? { c: 120 } : { c: 0 }) });
    const res = await request('GET', '/pixel?path=/x', { env: makeEnv(db) });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'image/gif');
    assert.equal(db.rows.length, 0);
  });

  test('fails closed when IP_HASH_SALT is missing', async () => {
    const db = makeDB();
    const res = await request('GET', '/pixel?path=/x', { env: makeEnv(db, { ipHashSalt: undefined }) });
    assert.equal(res.status, 500);
    assert.equal(db.rows.length, 0);
  });
});

/* ----------------------------- /csp-report ------------------------------ */

describe('POST /csp-report', () => {
  const cspReportPayload = {
    'csp-report': {
      'document-uri': 'https://sisigitadi.github.io/portofolio/',
      'referrer': '',
      'violated-directive': "script-src 'self' 'sha256-ABC123'",
      'blocked-uri': 'inline',
      'source-file': 'https://sisigitadi.github.io/portofolio/index.html',
      'line-number': 42,
      'column-number': 10,
    },
  };

  test('stores a CSP report in D1', async () => {
    const db = makeDB();
    const res = await request('POST', '/csp-report', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/csp-report' },
      body: JSON.stringify(cspReportPayload),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.stored, 1);
    assert.equal(db.rows.length, 1);
    // INSERT order: document_url, violated_directive, blocked_uri, source_file, line_number, ...
    assert.equal(db.rows[0][0], 'https://sisigitadi.github.io/portofolio/'); // document_url
    assert.equal(db.rows[0][1], "script-src 'self' 'sha256-ABC123'"); // violated_directive
    assert.equal(db.rows[0][4], 42); // line_number
  });

  test('accepts application/reports+json format', async () => {
    const db = makeDB();
    const payload = [{
      type: 'csp-violation',
      'document-url': 'https://sisigitadi.github.io/portofolio/',
      'violated-directive': "style-src 'self'",
      'blocked-uri': 'https://evil.com/style.css',
    }];
    const res = await request('POST', '/csp-report', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/reports+json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.stored, 1);
    assert.equal(db.rows.length, 1);
  });

  test('returns 429 when rate-limited', async () => {
    const db = makeDB();
    const env = makeEnv(db);
    // Pre-fill the rate limit key for the default IP (no CF-Connecting-IP -> 'unknown')
    await env.VISITS.put('csp:unknown', JSON.stringify({ ts: Date.now(), n: 10 }));
    const res = await request('POST', '/csp-report', {
      env,
      headers: { 'Content-Type': 'application/csp-report' },
      body: JSON.stringify(cspReportPayload),
    });
    assert.equal(res.status, 429);
  });

  test('handles malformed JSON gracefully', async () => {
    const db = makeDB();
    const res = await request('POST', '/csp-report', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/csp-report' },
      body: 'not valid json{{{',
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    // readJsonBody returns {} for malformed JSON, so no valid reports are found
    assert.equal(json.skipped, 'no_reports');
  });

  test('skips when no valid reports in payload', async () => {
    const db = makeDB();
    const res = await request('POST', '/csp-report', {
      env: makeEnv(db),
      headers: { 'Content-Type': 'application/csp-report' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.skipped, 'no_reports');
  });
});

/* -------------------------- routing & CORS --------------------------- */

describe('routing & CORS', () => {
  test('OPTIONS returns 204 with CORS headers', async () => {
    const res = await request('OPTIONS', '/hit', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
  });

  test('unknown routes return 404 JSON', async () => {
    const res = await request('GET', '/nope', { env: makeEnv(makeDB()) });
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  });

  test('returns 500 when D1 is not bound', async () => {
    const res = await request('GET', '/count', { env: { DB: null } });
    assert.equal(res.status, 500);
  });
});
