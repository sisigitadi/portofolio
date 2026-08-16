# 🛰️ worker-visitor — Hit Counter + Private Visitor Dashboard

Cloudflare Worker backend for `index.html` (GitHub Pages portfolio):

- **`POST /hit`** — records a visit: IP (hashed, never stored raw), city/country/timezone **+ company/ASN/region/continent** from the Cloudflare edge (`request.cf`), bot flag, user-agent, referrer, path. Body limited to 10 KB (larger payloads are rejected 413 `payload_too_large`); if `IP_HASH_SALT` is not configured, the hit is rejected 500 fail-closed (nothing is recorded).
- **`GET /pixel?path=…`** — 1×1 transparent GIF beacon without JavaScript (captures crawlers/no-JS); records a hit the same way as `/hit` (same rate-limit + daily dedupe).
- **`GET /count`** — total & unique visits (public footer badge, 60s KV cache).
- **`GET /dashboard?key=…`** — private HTML dashboard (login key, stat cards, table with 24h / 7d / 30d / all filters).
- **`GET /api/stats?key=…&range=…`** — raw JSON for integration/export.
- **`GET /api/export?key=…&range=…`** — server-side CSV (up to 50,000 rows).

No third-party API: geolocation **and company/ASN name** (`request.cf.asOrganization`, `request.cf.asn`, `request.cf.region`) come from the Cloudflare edge (all plans, free). UU PDP privacy: raw IPs are **never stored** — only `SHA-256(salt + IP)`; the `as_org`/`asn`/`region` columns are public edge geolocation data, not personal identity.

---

## 🚀 Deploy (once)

From this folder (`worker-visitor/`):

```bash
# 1) Create the D1 database → copy database_id into wrangler.toml
npx wrangler d1 create portofolio-visits

# 2) Apply the table schema
npx wrangler d1 execute portofolio-visits --remote --file=schema.sql

# 3) Create the KV namespace → copy the id into wrangler.toml
npx wrangler kv namespace create VISITS

# 4) Set secrets (never commit the real values)
#    USE printf ('%s' without a newline) OR interactive mode — a trailing newline
#    from `echo` makes the key comparison in the worker fail (safeEqual rejects
#    different lengths).
printf '%s' 'LONG_RANDOM_STRING' | npx wrangler secret put DASHBOARD_KEY  # dashboard key
printf '%s' 'RANDOM_SALT'        | npx wrangler secret put IP_HASH_SALT   # IP hash salt

# 5) Deploy
npx wrangler deploy
```

> ⚠️ **Do NOT use `[vars]` in `wrangler.toml` for DASHBOARD_KEY/IP_HASH_SALT**: deploying with `[vars]` **overwrites** secrets with the same name (confirmed on first deploy — the worker `authorized()` rejects a missing/placeholder `CHANGE_ME_*` `DASHBOARD_KEY`, and `recordVisit` fails closed (HTTP 500, records nothing) when `IP_HASH_SALT` is not configured). Secrets are the only source of production values.

## 🔌 Connect to index.html

1. **Already connected**: `WORKER_URL` in `index.html` is set to `https://portofolio-visitor-tracker.si-sigitadi.workers.dev`, the CSP `connect-src`/`img-src` already allow the worker origin, and the "Site Visits" badge appears in the footer after the first fetch succeeds.
2. If the worker URL ever changes: open `index.html`, set `var WORKER_URL = '<new-url>';` in the `<!-- Visitor Tracker Client ... -->` block (near `</body>`), also update the CSP `connect-src`/`img-src` in the meta tag, then commit & push.

## 🔐 Private dashboard access

- `https://<worker-url>/dashboard?key=<DASHBOARD_KEY>` → HTML page.
- `https://<worker-url>/api/stats?key=<DASHBOARD_KEY>&range=30d` → JSON.
- Without a key (or a wrong key) → 403 / login page. Key comparison uses constant-time compare. **Key-leak protection via referrer**: all dashboard/login HTML responses send the `Referrer-Policy: no-referrer` header — if you open an external link from the dashboard page (whose URL carries `?key=…`), the key is never sent along as `Referer`.
- **Hidden shortcut**: in the portfolio footer, click the copyright text **9×** (interval between clicks ≤ 2s) → opens `/dashboard` directly. The key is **never** embedded in the portfolio HTML; on the login page check *"Remember key in this browser"* once, and subsequent visits **auto-unlock** (the key lives in the owner's browser localStorage, same origin as the dashboard). The *"Forget saved key"* link in the dashboard footer removes it.

## 🧪 Test

```bash
# Ping /count (no auth)
curl "https://<worker-url>/count"

# Simulate a visit (from your IP; request.cf only populates once deployed)
curl -X POST "https://<worker-url>/hit" -H "Content-Type: application/json" \
     -d '{"path":"/","referrer":"https://example.com/"}'

# Dashboard JSON
curl "https://<worker-url>/api/stats?key=<DASHBOARD_KEY>&range=7d"

# Body guard: payload > 10 KB rejected 413 (not recorded)
python -c "print('{\"path\":\"' + 'x'*20000 + '\"}')" | curl -s -w "\n[HTTP %{http_code}]\n" -X POST -H "Content-Type: application/json" --data-binary @- "https://<worker-url>/hit"
```

## 🧪 Route test suite (26 tests, zero dependencies)

```bash
node --test worker-visitor/worker.test.js
```

Covers every route (`/count`, `/hit`, `/pixel`, `/api/stats`, `/api/export`, `/dashboard`): auth (403/200), rate-limit 429, body guard 413 (Content-Length & chunked stream), fail-closed `IP_HASH_SALT` (500), KV cache, CSV quoting, CORS. MUST stay green on every `worker.js` change (third preflight CI gate + Project_rules §1.9).

## ⚠️ Notes & free-tier limits

- **`request.cf` is not populated in `wrangler dev` previews** — test geolocation against the deployed URL.
- **KV**: minimum TTL 60s; writing >1×/second to the same key can be rejected — here the `/count` cache is 60s and all KV failures are swallowed (they never break an endpoint).
- **Rate limit**: max 20 hits/minute per IP (via D1) — anti-spam.
- **`/hit` 10 KB body guard**: larger payloads are rejected 413 before parsing (via `Content-Length` or chunked stream) — anti-DoS for large bodies.
- **Daily unique dedupe**: based on a per-visit D1 query; two simultaneous first visits from the same IP can both count as unique (cosmetic race, zero impact at portfolio scale).
- **Free tier**: Worker 100k requests/day; D1 5 GB / 100k writes & 5 million reads per day; KV 100k reads / 1k writes per day — far above portfolio needs.
- **Reset data**: `npx wrangler d1 execute portofolio-visits --remote --command "DELETE FROM visits"` (careful, permanent).

## 📊 Dashboard features (live)

Everything renders client-side with no CDN, from the latest 2,000 visits:

- **Stat cards** (total, unique, today) + **30-day daily trend** & **per-hour (UTC) distribution** — SVG bar charts.
- **Top 8 countries & cities** (emoji flags), **device/browser/OS breakdown** (UA parsing), **world dot map** (equirectangular projection from edge lat/lon).
- **Table** with range filter, **path filter**, 50 rows/page pagination.
- **CSV export**: *Export CSV (view)* button (filtered results, client-side) + `GET /api/export?key=…&range=…` (server-side, up to 50,000 rows).
- **60s auto-refresh** (default ON, toolbar toggle; polls `/api/stats` without reload, falls back to reload if the key is not in the URL).

## 🧩 Adding dashboard features

The dashboard is 100% coded in `worker.js` (the `dashboardPage`/`loginPage` functions + D1 queries). Workflow for adding a feature:

1. Edit `worker-visitor/worker.js`.
2. Run the route tests: `node --test worker-visitor/worker.test.js` (26 tests — must be green, Project_rules §1.9).
3. `npx wrangler deploy` (from this folder).
4. Reload the dashboard.

Raw per-visit data is already complete (ip_hash, city, country_code, lat, lon, timezone, asn, as_org, region, region_code, continent, is_bot, user_agent, referrer, path, is_unique, created_at) — most new features only need client-side aggregation.

## 🧹 Files

| File | Purpose |
|---|---|
| `worker.js` | Full worker (routes, CORS, rate-limit, 10 KB body guard, IP hashing, dashboard HTML) |
| `worker.test.js` | 26 route tests (node:test, zero dependencies) |
| `package.json` | `type: module` + `npm test` script |
| `schema.sql` | D1 `visits` table schema + index (fresh install) |
| `migration-org.sql` | D1 migration: add asn/as_org/region/continent/is_bot columns to an existing table |
| `wrangler.toml` | Deploy configuration (D1/KV bindings; no `[vars]` — secrets via `wrangler secret put`) |
