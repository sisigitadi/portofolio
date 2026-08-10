/**
 * portofolio-visitor-tracker — Cloudflare Worker
 * ============================================================
 * Hit counter + private visitor dashboard (IP + location) for a
 * static portfolio hosted on GitHub Pages. No third-party analytics.
 *
 * Endpoints
 * ---------
 *   GET  /count                    → { count, uniq, today, uniq_today }  (public badge)
 *   POST /hit                      → records a visit; echoes visitor's own geolocation
 *   GET  /pixel?path=…             → 1×1 transparent GIF beacon; records a hit (JS-less visitors / bots)
 *   GET  /api/stats?key=…[&range=][&limit=] → JSON stats + rows for the dashboard
 *   GET  /api/export?key=…[&range=]        → CSV export (server-side, all matching rows)
 *   GET  /dashboard?key=…          → private HTML dashboard (owner only)
 *   OPTIONS …                      → CORS preflight
 *
 * Privacy (UU PDP)
 * ----------------
 * Raw IP addresses are NEVER persisted — only SHA-256(salt + IP) is stored,
 * so visitors can be deduped without retaining personal data. City / country /
 * timezone / lat / lon come from Cloudflare's edge geolocation (request.cf);
 * no third-party geolocation API is called. NOTE: request.cf is not populated
 * in `wrangler dev` previews — test against the deployed *.workers.dev URL.
 *
 * Deploy: see README.md in this folder.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const MAX_HITS_PER_MINUTE = 20;        // per-IP anti-spam ceiling (human visitors)
const BOT_MAX_HITS_PER_MINUTE = 120;   // crawlers legitimately fetch many URLs/min — higher ceiling, still finite
const COUNT_CACHE_TTL_SECONDS = 60;    // KV minimum TTL for the /count cache
const DASHBOARD_ROWS = 2000;           // rows embedded in the dashboard page / fetched on refresh
const EXPORT_MAX_ROWS = 50000;         // hard cap for the server-side CSV export

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (!env.DB) {
      return json({ error: 'D1 database not configured (see wrangler.toml + README.md)' }, 500);
    }

    const route = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (route === '/count' && request.method === 'GET') return await handleCount(env);
      if (route === '/hit' && request.method === 'POST') return await handleHit(request, env);
      if (route === '/pixel' && request.method === 'GET') return await handlePixel(request, env, url);
      if (route === '/api/stats' && request.method === 'GET') return await handleStats(request, env, url);
      if (route === '/api/export' && request.method === 'GET') return await handleExport(request, env, url);
      if (route === '/dashboard' && request.method === 'GET') return await handleDashboard(request, env, url);
      return json({ error: 'not_found' }, 404);
    } catch (err) {
      console.error('visitor-tracker error:', err && err.stack ? err.stack : String(err));
      return json({ error: 'internal_error' }, 500);
    }
  },
};

/* ------------------------------- helpers ------------------------------- */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, 'Cache-Control': 'no-store' },
  });
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS, 'Cache-Control': 'no-store' },
  });
}

function escapeHTML(value) {
  return String(value == null ? '' : value)
    .replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/** Constant-time string comparison (anti timing-attack). */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(salt, input) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function startOfTodayUTC(now = Date.now()) {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function truncate(value, max) {
  const s = String(value == null ? '' : value);
  return s.length > max ? s.slice(0, max) : s;
}

function rangeSince(range) {
  if (range === 'all') return null;
  const map = { '24h': 86400000, '7d': 7 * 86400000, '30d': 30 * 86400000 };
  const ms = map[range];
  return ms ? Date.now() - ms : null;
}

/** Total + unique counts (all-time and today), from D1. */
async function computeStats(env) {
  const dayStart = startOfTodayUTC();
  const [total, uniq, today, uniqToday] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) AS c FROM visits').first(),
    env.DB.prepare('SELECT COUNT(DISTINCT ip_hash) AS c FROM visits').first(),
    env.DB.prepare('SELECT COUNT(*) AS c FROM visits WHERE created_at >= ?').bind(dayStart).first(),
    env.DB.prepare('SELECT COUNT(DISTINCT ip_hash) AS c FROM visits WHERE created_at >= ?').bind(dayStart).first(),
  ]);
  return {
    count: total.c || 0,
    uniq: uniq.c || 0,
    today: today.c || 0,
    uniq_today: uniqToday.c || 0,
  };
}

/** Visitor geolocation straight from the Cloudflare edge — no third-party API. */
function clientGeo(request) {
  const cf = request.cf || {};
  const num = (v) => (typeof v === 'number' ? v : (typeof v === 'string' && v !== '' ? parseFloat(v) : null));
  const lat = num(cf.latitude);
  const lon = num(cf.longitude);
  return {
    ip: request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown',
    city: typeof cf.city === 'string' && cf.city ? cf.city : null,
    countryCode: typeof cf.country === 'string' && cf.country ? cf.country
      : (request.headers.get('CF-IPCountry') || null),
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    timezone: typeof cf.timezone === 'string' && cf.timezone ? cf.timezone : null,
    // Company / network info straight from the Cloudflare edge (all plans, no API call):
    asn: Number.isInteger(cf.asn) ? cf.asn : null,
    asOrganization: typeof cf.asOrganization === 'string' && cf.asOrganization ? cf.asOrganization : null,
    region: typeof cf.region === 'string' && cf.region ? cf.region : null,
    regionCode: typeof cf.regionCode === 'string' && cf.regionCode ? cf.regionCode : null,
    continent: typeof cf.continent === 'string' && cf.continent ? cf.continent : null,
  };
}

/** Heuristic bot detection — UA tokens + known crawler ASNs (e.g. Google AS15169). */
const BOT_UA_RE = /bot|crawl|spider|slurp|bingpreview|headless|Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|AhrefsBot|SemrushBot|MJ12bot|Bytespider|GPTBot|CCBot|ia_archiver|petalbot|applebot|facebookexternalhit|twitterbot|curl|wget|python-requests|Go-http-client|monitoring|uptimerobot|pingdom/i;
const BOT_ASNS = new Set([15169, 396982, 30243, 8075, 8068, 8069, 16509, 16625, 53755, 209242]); // Google, Amazon, Microsoft, DuckDuckGo etc.

function detectBot(userAgent, asn) {
  const ua = String(userAgent || '');
  if (BOT_UA_RE.test(ua)) return true;
  // ASN fallback: a request from a known crawler ASN is treated as a bot,
  // unless it carries a full browser UA (which would mean a real user on that network).
  if (asn && BOT_ASNS.has(asn) && !/Mozilla\/5\.0.*(Chrome|Safari|Firefox)/.test(ua)) return true;
  return false;
}

function authorized(request, env, url) {
  const provided = url.searchParams.get('key') || request.headers.get('x-dashboard-key') || '';
  const expected = env.DASHBOARD_KEY;
  // Reject unconfigured dev placeholders so a deploy without `wrangler secret put`
  // can never expose the dashboard behind a committed value.
  if (!expected || expected.indexOf('CHANGE_ME_') === 0) return false;
  return safeEqual(provided, expected);
}

function recentRowsQuery(env, since, limit) {
  const cols = 'ip_hash, city, country_code, lat, lon, timezone, asn, as_org, region, region_code, continent, is_bot, user_agent, referrer, path, is_unique, created_at';
  return since === null
    ? env.DB.prepare('SELECT ' + cols + ' FROM visits ORDER BY created_at DESC LIMIT ?').bind(limit).all()
    : env.DB.prepare('SELECT ' + cols + ' FROM visits WHERE created_at >= ? ORDER BY created_at DESC LIMIT ?').bind(since, limit).all();
}

/* ------------------------------ endpoints ------------------------------ */

async function handleCount(env) {
  // Serve from the KV cache when possible (cheap + fast for the public badge).
  if (env.VISITS) {
    const cached = await env.VISITS.get('count_cache').catch(() => null);
    if (cached) {
      try { return json(JSON.parse(cached)); } catch (e) { /* fall through to a fresh read */ }
    }
  }
  const stats = await computeStats(env);
  if (env.VISITS) {
    // KV write throttling / failures must never break the public endpoint.
    await env.VISITS.put('count_cache', JSON.stringify(stats), { expirationTtl: COUNT_CACHE_TTL_SECONDS }).catch(() => {});
  }
  return json(stats);
}

/**
 * Shared visit-recording pipeline for POST /hit and GET /pixel.
 * Returns { rateLimited } or the full echo object on success.
 */
async function recordVisit(request, env, info) {
  const geo = clientGeo(request);
  const ipHash = await sha256Hex(env.IP_HASH_SALT || 'salt', geo.ip);
  const ua = request.headers.get('User-Agent') || '';
  const isBot = detectBot(ua, geo.asn) ? 1 : 0;

  // Rate limit (authoritative via D1 — avoids KV write throttling). Crawlers get a
  // much higher ceiling so real Googlebot/Bingbot traffic (50–200 req/min) is captured.
  const limit = isBot ? BOT_MAX_HITS_PER_MINUTE : MAX_HITS_PER_MINUTE;
  const recent = await env.DB.prepare('SELECT COUNT(*) AS c FROM visits WHERE ip_hash = ? AND created_at >= ?')
    .bind(ipHash, Date.now() - 60000).first();
  if ((recent.c || 0) >= limit) {
    return { rateLimited: true };
  }

  const now = Date.now();
  const dup = await env.DB.prepare('SELECT COUNT(*) AS c FROM visits WHERE ip_hash = ? AND created_at >= ?')
    .bind(ipHash, startOfTodayUTC(now)).first();
  const isUnique = (dup.c || 0) === 0 ? 1 : 0;

  await env.DB.prepare(
    'INSERT INTO visits (ip_hash, city, country_code, lat, lon, timezone, asn, as_org, region, region_code, continent, is_bot, user_agent, referrer, path, is_unique, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    ipHash,
    truncate(geo.city, 100),
    truncate(geo.countryCode, 4),
    geo.lat,
    geo.lon,
    truncate(geo.timezone, 64),
    geo.asn,
    truncate(geo.asOrganization, 128),
    truncate(geo.region, 128),
    truncate(geo.regionCode, 16),
    truncate(geo.continent, 8),
    isBot,
    truncate(ua, 500),
    truncate(info.referrer || '', 500),
    truncate(info.path || '/', 300),
    isUnique,
    now
  ).run();

  if (env.VISITS) {
    await env.VISITS.delete('count_cache').catch(() => {});
  }

  const stats = await computeStats(env);
  return {
    count: stats.count,
    uniq: stats.uniq,
    today: stats.today,
    uniq_today: stats.uniq_today,
    // The visitor's OWN geolocation + network info, echoed back for optional personalization.
    ip: geo.ip,
    city: geo.city,
    country: geo.countryCode,
    timezone: geo.timezone,
    asn: geo.asn,
    asOrganization: geo.asOrganization,
    region: geo.region,
    continent: geo.continent,
    isBot: isBot === 1,
  };
}

async function handleHit(request, env) {
  // Request body is optional; every field is length-truncated before storage.
  let body = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === 'object') body = parsed;
  } catch (e) { /* no body — fine */ }

  const rec = await recordVisit(request, env, { path: body.path, referrer: body.referrer });
  if (rec.rateLimited) return json({ error: 'rate_limited' }, 429);
  return json({ ok: true, ...rec });
}

/** 1×1 transparent GIF (base64) — served by GET /pixel. */
const PIXEL_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * GET /pixel — JS-less tracking beacon (also catches crawlers/bots that don't
 * execute JavaScript). Records a hit exactly like POST /hit and returns a 1×1
 * transparent GIF. Query params: path (page), ref (referrer fallback).
 */
async function handlePixel(request, env, url) {
  const gif = () => new Response(Uint8Array.from(atob(PIXEL_GIF), (c) => c.charCodeAt(0)), {
    status: 200,
    headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store', ...CORS_HEADERS },
  });
  const rec = await recordVisit(request, env, {
    path: url.searchParams.get('path') || '/',
    referrer: request.headers.get('Referer') || url.searchParams.get('ref') || '',
  });
  // Rate-limited hits still get a valid GIF — silently dropped, no signal to bots.
  return gif();
}

async function handleStats(request, env, url) {
  if (!authorized(request, env, url)) return json({ error: 'unauthorized' }, 403);
  const since = rangeSince(url.searchParams.get('range') || '30d');
  const limitParam = parseInt(url.searchParams.get('limit') || '', 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 5000) : DASHBOARD_ROWS;
  const rows = await recentRowsQuery(env, since, limit);
  return json({ stats: await computeStats(env), rows: rows.results, limit });
}

async function handleExport(request, env, url) {
  if (!authorized(request, env, url)) return json({ error: 'unauthorized' }, 403);
  const since = rangeSince(url.searchParams.get('range') || 'all');
  const rows = await recentRowsQuery(env, since, EXPORT_MAX_ROWS);
  const esc = (v) => {
    const s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = ['created_at,ip_hash,city,country_code,region,region_code,continent,timezone,asn,as_org,is_bot,path,referrer,user_agent,is_unique'];
  for (const r of rows.results) {
    lines.push([r.created_at, r.ip_hash, r.city, r.country_code, r.region, r.region_code, r.continent, r.timezone, r.asn, r.as_org, r.is_bot, r.path, r.referrer, r.user_agent, r.is_unique].map(esc).join(','));
  }
  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="visitors.csv"',
      ...CORS_HEADERS,
    },
  });
}

async function handleDashboard(request, env, url) {
  if (!authorized(request, env, url)) {
    return htmlResponse(loginPage(url.pathname));
  }
  const since = rangeSince(url.searchParams.get('range') || 'all');
  const rows = await recentRowsQuery(env, since, DASHBOARD_ROWS);
  const stats = await computeStats(env);
  return htmlResponse(dashboardPage(stats, rows.results));
}

/* ---------------------------- dashboard HTML --------------------------- */

function loginPage(action) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visitor Dashboard — unlock</title>
<style>
  :root { --bg:#111827; --surface:#1F2937; --border:#374151; --primary:#22D3EE; --text:#F9FAFB; --muted:#9CA3AF; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; background:var(--bg); color:var(--text); }
  .login { max-width:420px; margin:12vh auto; background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:2rem; }
  h1 { margin-top:0; font-size:1.05rem; }
  .muted { color:var(--muted); font-size:0.8rem; }
  input { width:100%; background:var(--bg); border:1px solid var(--border); border-radius:8px; color:var(--text); padding:0.55rem 0.7rem; font-family:inherit; margin:0.75rem 0; }
  button { width:100%; background:var(--bg); color:var(--primary); border:1px solid var(--primary); border-radius:8px; padding:0.55rem; font-family:inherit; cursor:pointer; }
  .remember { display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:var(--muted); margin:0 0 0.75rem; cursor:pointer; }
  .remember input { width:auto; margin:0; }
  .hint-error { color:#FCA5A5; font-size:0.75rem; margin:0 0 0.75rem; }
  .note { font-size:0.7rem; color:var(--muted); margin-top:1rem; }
  code { color:var(--primary); }
</style>
</head>
<body>
  <div class="login">
    <h1>🔒 Visitor Dashboard</h1>
    <p class="muted">Owner-only view. Enter the <code>DASHBOARD_KEY</code> secret configured with <code>wrangler secret put</code>.</p>
    <p class="hint-error" id="login-hint" style="display:none">⚠️ Saved key was rejected — re-enter it or use <em>Clear saved key</em>.</p>
    <form method="get" action="${escapeHTML(action)}" id="login-form">
      <input type="password" name="key" id="login-key" placeholder="Dashboard key" required autofocus autocomplete="off">
      <label class="remember"><input type="checkbox" id="remember-key"> Remember key in this browser (localStorage)</label>
      <button type="submit">Unlock dashboard</button>
    </form>
    <p class="note">Raw IP addresses are never stored — only salted SHA-256 hashes (UU&nbsp;PDP friendly). <a href="#" id="clear-key" style="color:var(--muted);">Clear saved key</a></p>
<script>
  (function () {
    var form = document.getElementById('login-form');
    var keyInput = document.getElementById('login-key');
    var remember = document.getElementById('remember-key');
    var clearBtn = document.getElementById('clear-key');
    if (!form || !keyInput) return;
    var saved = '';
    try { saved = localStorage.getItem('vtr_dash_key') || ''; } catch (e) {}
    // Auto-submit ONLY when arriving without a key in the URL — prevents an infinite
    // login loop when the saved key is stale (URL already carries a wrong key).
    var hasKeyInUrl = /[?&]key=/.test(window.location.search);
    if (hasKeyInUrl) {
      var hint = document.getElementById('login-hint');
      if (hint) hint.style.display = 'block';
    }
    if (saved && !hasKeyInUrl) {
      keyInput.value = saved;
      if (remember) remember.checked = true;
      form.submit();
    } else {
      if (saved) keyInput.value = saved; // prefill for convenience
      if (clearBtn) clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.removeItem('vtr_dash_key'); } catch (e2) {}
        window.location.href = window.location.pathname;
      });
      form.addEventListener('submit', function () {
        if (remember && remember.checked && keyInput.value) {
          try { localStorage.setItem('vtr_dash_key', keyInput.value); } catch (e) {}
        }
      });
    }
  })();
</script>
  </div>
</body>
</html>`;
}

function dashboardPage(stats, rows) {
  const statsJson = JSON.stringify(stats).replace(/<\//g, '<\\/');
  const rowsJson = JSON.stringify(rows).replace(/<\//g, '<\\/');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visitor Dashboard — portofolio</title>
<style>
  :root { --bg:#111827; --surface:#1F2937; --border:#374151; --primary:#22D3EE; --accent:#10B981; --text:#F9FAFB; --muted:#9CA3AF; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; background:var(--bg); color:var(--text); line-height:1.6; }
  header { padding:1.5rem 1.5rem 0.5rem; border-bottom:1px solid var(--border); }
  header h1 { margin:0; font-size:1.15rem; letter-spacing:0.05em; }
  header h1 span { color:var(--primary); }
  header p { margin:0.25rem 0 0; color:var(--muted); font-size:0.75rem; }
  main { padding:1rem 1.5rem 3rem; max-width:1200px; margin:0 auto; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:0.75rem; margin:1rem 0 1.5rem; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:0.9rem 1rem; }
  .card .n { font-size:1.7rem; font-weight:700; color:var(--primary); }
  .card .l { font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; }
  .charts { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:0.75rem; margin-bottom:1.5rem; }
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:0.9rem 1rem; }
  .panel-wide { grid-column:1 / -1; }
  .panel h2 { margin:0 0 0.6rem; font-size:0.78rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; }
  .panel svg { width:100%; height:auto; display:block; }
  .hbar { margin-bottom:0.55rem; }
  .hbar-row { display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.15rem; }
  .hbar-label { color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .hbar-val { color:var(--primary); font-weight:700; margin-left:0.5rem; }
  .hbar-track { height:6px; background:var(--bg); border-radius:999px; overflow:hidden; }
  .hbar-fill { height:100%; background:linear-gradient(90deg,var(--primary),var(--accent)); border-radius:999px; }
  .dev-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:0.75rem; }
  .toolbar { display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center; margin-bottom:1rem; }
  .toolbar label { color:var(--muted); font-size:0.75rem; }
  select, button, a.btn { background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:8px; padding:0.4rem 0.7rem; font-family:inherit; font-size:0.8rem; text-decoration:none; }
  button { cursor:pointer; color:var(--primary); border-color:var(--primary); }
  a.btn { display:inline-block; color:var(--text); cursor:pointer; }
  a.btn:hover { color:var(--primary); border-color:var(--primary); }
  .auto { display:inline-flex; align-items:center; gap:0.4rem; cursor:pointer; }
  .auto input { width:auto; }
  .table-wrap { overflow-x:auto; border:1px solid var(--border); border-radius:12px; }
  table { width:100%; border-collapse:collapse; font-size:0.78rem; }
  th, td { text-align:left; padding:0.5rem 0.75rem; border-bottom:1px solid var(--border); vertical-align:top; }
  th { color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; font-size:0.68rem; background:var(--surface); }
  tr:last-child td { border-bottom:none; }
  .badge-u { display:inline-block; background:rgba(16,185,129,0.15); color:var(--accent); border:1px solid rgba(16,185,129,0.4); border-radius:999px; font-size:0.62rem; padding:0.05rem 0.45rem; }
  .badge-bot { display:inline-block; background:rgba(249,115,22,0.15); color:#FB923C; border:1px solid rgba(249,115,22,0.45); border-radius:999px; font-size:0.62rem; padding:0.05rem 0.45rem; }
  .muted { color:var(--muted); }
  .empty { text-align:center; padding:2.5rem 1rem; color:var(--muted); }
  .pager { display:flex; align-items:center; justify-content:center; gap:0.75rem; padding:0.6rem; }
  .pager button { background:var(--bg); }
  .pager button:disabled { opacity:0.4; cursor:default; }
  footer { padding:0 1.5rem 2rem; color:var(--muted); font-size:0.68rem; max-width:1200px; margin:0 auto; }
  code { color:var(--primary); }
</style>
</head>
<body>
<header>
  <h1>🛡️ <span>visitor-tracker</span> · private dashboard</h1>
  <p>Owner-only view · raw IPs are never stored (salted SHA-256 hash only) · geolocation + company/ASN via Cloudflare edge</p>
</header>
<main>
  <div class="cards">
    <div class="card"><div class="n" id="c-total">–</div><div class="l">Total visits</div></div>
    <div class="card"><div class="n" id="c-uniq">–</div><div class="l">Unique visitors</div></div>
    <div class="card"><div class="n" id="c-today">–</div><div class="l">Visits today</div></div>
    <div class="card"><div class="n" id="c-utoday">–</div><div class="l">Unique today</div></div>
  </div>
  <div class="charts">
    <div class="panel panel-wide"><h2>Daily visits — last 30 days (UTC)</h2><div id="chart-trend"></div></div>
    <div class="panel"><h2>Visits by hour (UTC)</h2><div id="chart-hour"></div></div>
    <div class="panel"><h2>Top countries</h2><div id="chart-countries"></div></div>
    <div class="panel"><h2>Top cities</h2><div id="chart-cities"></div></div>
    <div class="panel"><h2>Devices · Browsers · OS</h2><div id="chart-devices"></div></div>
    <div class="panel panel-wide"><h2>Visitor map (lat / lon from Cloudflare edge)</h2><div id="chart-map"></div></div>
  </div>
  <div class="toolbar">
    <label for="range">Range</label>
    <select id="range">
      <option value="24h">Last 24 hours</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="all" selected>All time</option>
    </select>
    <label for="path-filter">Path</label>
    <select id="path-filter"><option value="">All paths</option></select>
    <button type="button" id="refresh">Refresh now</button>
    <label class="auto"><input type="checkbox" id="auto-refresh" checked> Auto-refresh 60s</label>
    <button type="button" id="export-csv">Export CSV (view)</button>
    <a class="btn" href="#" id="export-all">Export CSV (all)</a>
    <span class="muted" id="count-line"></span>
    <span class="muted" id="updated"></span>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>When</th><th>IP (hash)</th><th>Network</th><th>Location</th><th>Timezone</th><th>Page</th><th>Referrer</th><th>User-Agent</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table>
    <div class="pager">
      <button type="button" id="prev">← Prev</button>
      <span class="muted" id="page-info"></span>
      <button type="button" id="next">Next →</button>
    </div>
  </div>
  <div class="empty" id="empty" style="display:none">No visits in this range yet.</div>
</main>
<footer>Data source: D1 (<code>visits</code>) · charts/map use the latest ${DASHBOARD_ROWS} visits · clear all rows with <code>npx wrangler d1 execute portofolio-visits --remote --command "DELETE FROM visits"</code> · <a href="#" id="forget-key" style="color:var(--muted);">Forget saved key</a></footer>
<script>
  var STATS = ${statsJson};
  var ROWS = ${rowsJson};
  var LIMIT = ${DASHBOARD_ROWS};
  var RANGE_MS = { '24h': 86400000, '7d': 7 * 86400000, '30d': 30 * 86400000, 'all': Infinity };
  var PAGE_SIZE = 50;
  var page = 1;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]; }); }
  function flag(code) { if (!code || code.length !== 2) return '🌐'; return String.fromCodePoint(127397 + code.charCodeAt(0), 127397 + code.charCodeAt(1)); }
  function shortHash(h) { return h ? esc(h.slice(0,8)) + '…' + esc(h.slice(-2)) : '—'; }
  function p2(n) { return n < 10 ? '0' + n : String(n); }
  function fmtTime(ms) { try { return new Date(ms).toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); } catch (e) { return esc(ms); } }
  function fmtNum(n) { return Number(n || 0).toLocaleString(); }
  function refDomain(r) { if (!r) return '<span class="muted">—</span>'; try { return esc(new URL(r).hostname); } catch (e) { return '<span class="muted">direct</span>'; } }
  function uaShort(ua) { var s = String(ua || ''); return s ? esc(s.length > 44 ? s.slice(0,44) + '…' : s) : '<span class="muted">—</span>'; }
  function keyFromUrl() { var m = location.search.match(/[?&]key=([^&]+)/); return m ? decodeURIComponent(m[1]) : ''; }

  /* ---------- UA parsing ---------- */
  function parseUA(ua) {
    ua = String(ua || '');
    var device = /iPad|Tablet/i.test(ua) ? 'Tablet' : (/Mobile|Android|iPhone|iPod/i.test(ua) ? 'Mobile' : 'Desktop');
    var os = 'Other';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    var browser = 'Other';
    if (/Edg\\//i.test(ua)) browser = 'Edge';
    else if (/OPR\\//i.test(ua) || /Opera/i.test(ua)) browser = 'Opera';
    else if (/Chrome\\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\\//i.test(ua)) browser = 'Safari';
    else if (/Firefox\\//i.test(ua)) browser = 'Firefox';
    else if (/MSIE|Trident/i.test(ua)) browser = 'IE';
    return { device: device, os: os, browser: browser };
  }

  /* ---------- aggregation ---------- */
  function groupBy(rows, keyFn) {
    var m = {};
    rows.forEach(function (r) { var k = keyFn(r); m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).map(function (k) { return { key: k, count: m[k] }; }).sort(function (a, b) { return b.count - a.count; });
  }
  function renderTopList(el, items, limit) {
    var max = 1;
    items.forEach(function (it) { if (it.count > max) max = it.count; });
    var html = items.slice(0, limit).map(function (it) {
      var pct = Math.round((it.count / max) * 100);
      return '<div class="hbar"><div class="hbar-row"><span class="hbar-label">' + it.html + '</span><span class="hbar-val">' + it.count + '</span></div><div class="hbar-track"><div class="hbar-fill" style="width:' + pct + '%"></div></div></div>';
    }).join('');
    el.innerHTML = html || '<p class="muted">No data yet.</p>';
  }

  /* ---------- SVG bar chart ---------- */
  function renderBars(el, data, opts) {
    var W = 900, H = opts.height || 120, pad = 20;
    var max = 1;
    data.forEach(function (d) { if (d.count > max) max = d.count; });
    var n = data.length;
    var bw = (W - pad * 2) / Math.max(n, 1);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + (H + 22) + '" role="img" aria-label="bar chart">';
    for (var i = 0; i < n; i++) {
      var d = data[i];
      var bh = Math.max(2, (d.count / max) * H);
      var x = pad + i * bw;
      svg += '<rect x="' + x + '" y="' + (H - bh + 2) + '" width="' + Math.max(1, bw - 1) + '" height="' + bh + '" fill="rgba(34,211,238,0.85)"><title>' + esc(d.label) + ': ' + d.count + '</title></rect>';
      if (opts.labelEvery && i % opts.labelEvery === 0) {
        svg += '<text x="' + (x + bw / 2) + '" y="' + (H + 15) + '" font-size="9" fill="#9CA3AF" text-anchor="middle">' + esc(d.label) + '</text>';
      }
    }
    svg += '</svg>';
    el.innerHTML = svg;
  }

  /* ---------- render: stat cards ---------- */
  function renderStats() {
    document.getElementById('c-total').textContent = fmtNum(STATS.count);
    document.getElementById('c-uniq').textContent = fmtNum(STATS.uniq);
    document.getElementById('c-today').textContent = fmtNum(STATS.today);
    document.getElementById('c-utoday').textContent = fmtNum(STATS.uniq_today);
  }

  /* ---------- render: charts (from ALL embedded rows) ---------- */
  function renderTrend() {
    var now = new Date();
    var utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    var days = [];
    for (var i = 29; i >= 0; i--) {
      var d = new Date(utcNow - i * 86400000);
      days.push({ key: d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()), label: p2(d.getUTCMonth() + 1) + '/' + p2(d.getUTCDate()), count: 0 });
    }
    var idx = {};
    days.forEach(function (d, i) { idx[d.key] = i; });
    ROWS.forEach(function (r) {
      var d = new Date(r.created_at);
      var key = d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate());
      if (idx[key] !== undefined) days[idx[key]].count++;
    });
    renderBars(document.getElementById('chart-trend'), days, { height: 130, labelEvery: 5 });
  }

  function renderHour() {
    var hours = [];
    for (var h = 0; h < 24; h++) hours.push({ label: p2(h), count: 0 });
    ROWS.forEach(function (r) { hours[new Date(r.created_at).getUTCHours()].count++; });
    renderBars(document.getElementById('chart-hour'), hours, { height: 130, labelEvery: 3 });
  }

  function renderCountries() {
    var items = groupBy(ROWS, function (r) { return r.country_code || '?'; })
      .map(function (g) { return { count: g.count, html: flag(g.key) + ' ' + esc(g.key) }; });
    renderTopList(document.getElementById('chart-countries'), items, 8);
  }

  function renderCities() {
    var items = groupBy(ROWS, function (r) { return (r.city ? r.city + ', ' : '') + (r.country_code || '?'); })
      .map(function (g) { return { count: g.count, html: esc(g.key) }; });
    renderTopList(document.getElementById('chart-cities'), items, 8);
  }

  function renderDevices() {
    var parsed = ROWS.map(function (r) { return parseUA(r.user_agent); });
    var byDevice = groupBy(parsed, function (p) { return p.device; }).map(function (g) { return { count: g.count, html: esc(g.key) }; });
    var byBrowser = groupBy(parsed, function (p) { return p.browser; }).map(function (g) { return { count: g.count, html: esc(g.key) }; });
    var byOs = groupBy(parsed, function (p) { return p.os; }).map(function (g) { return { count: g.count, html: esc(g.key) }; });
    var el = document.getElementById('chart-devices');
    var panel = function (title, items) {
      var max = 1;
      items.forEach(function (it) { if (it.count > max) max = it.count; });
      var html = items.slice(0, 5).map(function (it) {
        var pct = Math.round((it.count / max) * 100);
        return '<div class="hbar"><div class="hbar-row"><span class="hbar-label">' + it.html + '</span><span class="hbar-val">' + it.count + '</span></div><div class="hbar-track"><div class="hbar-fill" style="width:' + pct + '%"></div></div></div>';
      }).join('');
      return '<div><h3 class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.4rem;">' + title + '</h3>' + (html || '<p class="muted">No data</p>') + '</div>';
    };
    el.innerHTML = '<div class="dev-grid">' + panel('Device', byDevice) + panel('Browser', byBrowser) + panel('OS', byOs) + '</div>';
  }

  function renderMap() {
    var W = 900, H = 450;
    var points = {};
    ROWS.forEach(function (r) {
      if (typeof r.lat !== 'number' || typeof r.lon !== 'number' || !isFinite(r.lat) || !isFinite(r.lon)) return;
      var k = Math.round(r.lat * 2) + ',' + Math.round(r.lon * 2);
      points[k] = (points[k] || 0) + 1;
    });
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="visitor world map">';
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#0F172A" rx="10"/>';
    for (var gx = 0; gx <= 360; gx += 30) { var x = (gx / 360) * W; svg += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="rgba(255,255,255,0.05)"/>'; }
    for (var gy = -60; gy <= 60; gy += 30) { var y = ((90 - gy) / 180) * H; svg += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="rgba(255,255,255,0.05)"/>'; }
    svg += '<text x="8" y="18" font-size="11" fill="#9CA3AF">equirectangular projection · dot size = visit count</text>';
    var keys = Object.keys(points);
    keys.forEach(function (k) {
      var parts = k.split(',');
      var lat = parseFloat(parts[0]) / 2, lon = parseFloat(parts[1]) / 2;
      var x = ((lon + 180) / 360) * W, y = ((90 - lat) / 180) * H;
      var c = points[k];
      var r = Math.min(3 + Math.sqrt(c) * 1.5, 12);
      svg += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(34,211,238,0.55)" stroke="#22D3EE" stroke-width="1"><title>' + lat.toFixed(1) + ', ' + lon.toFixed(1) + ' · ' + c + ' visits</title></circle>';
    });
    svg += '</svg>';
    document.getElementById('chart-map').innerHTML = keys.length ? svg : '<p class="muted">No geolocated visits yet.</p>';
  }

  /* ---------- render: table (range + path filter + pagination) ---------- */
  function filteredRows() {
    var range = document.getElementById('range').value;
    var since = Date.now() - RANGE_MS[range];
    var path = document.getElementById('path-filter').value;
    return ROWS.filter(function (r) { return r.created_at >= since && (!path || r.path === path); });
  }

  function buildPathOptions() {
    var sel = document.getElementById('path-filter');
    var prev = sel.value;
    var items = groupBy(ROWS, function (r) { return r.path || '/'; }).map(function (g) { return g.key; });
    var html = '<option value="">All paths</option>';
    items.forEach(function (p) { html += '<option value="' + esc(p) + '"' + (p === prev ? ' selected' : '') + '>' + esc(p) + '</option>'; });
    sel.innerHTML = html;
  }

  function renderTable() {
    var rows = filteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    var slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    var tbody = document.getElementById('tbody');
    tbody.innerHTML = slice.map(function (r) {
      var loc = (flag(r.country_code) + ' ' + esc(r.city || '') + ' ' + esc(r.country_code || '')).trim();
      var net = '';
      if (r.as_org) net += esc(r.as_org);
      if (r.asn) net += ' <span class="muted">AS' + esc(String(r.asn)) + '</span>';
      if (r.region) net += ' <span class="muted">· ' + esc(r.region) + (r.region_code ? ' (' + esc(r.region_code) + ')' : '') + '</span>';
      return '<tr>' +
        '<td>' + fmtTime(r.created_at) + '</td>' +
        '<td>' + shortHash(r.ip_hash) + (r.is_unique ? ' <span class="badge-u">unique</span>' : '') + (r.is_bot ? ' <span class="badge-bot">🤖 bot</span>' : '') + '</td>' +
        '<td>' + (net || '<span class="muted">—</span>') + '</td>' +
        '<td>' + (loc || '<span class="muted">—</span>') + '</td>' +
        '<td class="muted">' + esc(r.timezone || '—') + '</td>' +
        '<td>' + esc(r.path || '/') + '</td>' +
        '<td>' + refDomain(r.referrer) + '</td>' +
        '<td title="' + esc(r.user_agent || '') + '">' + uaShort(r.user_agent) + '</td>' +
      '</tr>';
    }).join('');
    document.getElementById('empty').style.display = rows.length ? 'none' : 'block';
    document.getElementById('page-info').textContent = 'Page ' + page + ' of ' + totalPages + ' · ' + fmtNum(rows.length) + ' rows';
    document.getElementById('count-line').textContent = 'Table: ' + fmtNum(rows.length) + ' of ' + fmtNum(ROWS.length) + ' visits (filtered) · charts/map: latest ' + fmtNum(ROWS.length);
    document.getElementById('prev').disabled = page <= 1;
    document.getElementById('next').disabled = page >= totalPages;
  }

  /* ---------- export ---------- */
  function exportCSV() {
    var rows = filteredRows();
    var escCell = function (v) { var s = String(v == null ? '' : v); return /[",\\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    var lines = ['created_at,ip_hash,city,country_code,region,region_code,continent,timezone,asn,as_org,is_bot,path,referrer,user_agent,is_unique'];
    rows.forEach(function (r) {
      lines.push([r.created_at, r.ip_hash, r.city, r.country_code, r.region, r.region_code, r.continent, r.timezone, r.asn, r.as_org, r.is_bot, r.path, r.referrer, r.user_agent, r.is_unique].map(escCell).join(','));
    });
    var blob = new Blob([lines.join('\\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'visitors.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  /* ---------- auto refresh ---------- */
  function setUpdated() {
    var el = document.getElementById('updated');
    if (el) el.textContent = 'Updated ' + new Date().toLocaleTimeString();
  }
  function scheduleRefresh() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
    if (document.getElementById('auto-refresh').checked) {
      refreshTimer = setInterval(doRefresh, 60000);
    }
  }
  function doRefresh() {
    var key = keyFromUrl();
    if (!key) { location.reload(); return; }
    fetch(location.origin + '/api/stats?key=' + encodeURIComponent(key) + '&range=all&limit=' + LIMIT)
      .then(function (res) { return res.json(); })
      .then(function (d) {
        if (!d || !d.stats || !d.rows) return;
        STATS = d.stats;
        ROWS = d.rows;
        renderAll();
      }).catch(function () {});
  }
  var refreshTimer = null;

  /* ---------- boot ---------- */
  function renderAll() {
    renderStats();
    buildPathOptions();
    renderTrend();
    renderHour();
    renderCountries();
    renderCities();
    renderDevices();
    renderMap();
    renderTable();
    setUpdated();
  }

  document.getElementById('range').addEventListener('change', function () { page = 1; renderTable(); });
  document.getElementById('path-filter').addEventListener('change', function () { page = 1; renderTable(); });
  document.getElementById('refresh').addEventListener('click', function () { location.reload(); });
  document.getElementById('auto-refresh').addEventListener('change', scheduleRefresh);
  document.getElementById('export-csv').addEventListener('click', exportCSV);
  document.getElementById('export-all').addEventListener('click', function (e) {
    e.preventDefault();
    var key = keyFromUrl();
    if (!key) { location.reload(); return; }
    window.location.href = location.origin + '/api/export?key=' + encodeURIComponent(key) + '&range=' + document.getElementById('range').value;
  });
  document.getElementById('prev').addEventListener('click', function () { if (page > 1) { page--; renderTable(); } });
  document.getElementById('next').addEventListener('click', function () { page++; renderTable(); });
  var forgetBtn = document.getElementById('forget-key');
  if (forgetBtn) forgetBtn.addEventListener('click', function (e) {
    e.preventDefault();
    try { localStorage.removeItem('vtr_dash_key'); } catch (e2) {}
    window.location.href = window.location.pathname;
  });

  renderAll();
  scheduleRefresh();
</script>
</body>
</html>`;
}
