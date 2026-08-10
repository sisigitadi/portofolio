-- ============================================================
-- portofolio-visitor-tracker · D1 schema
-- Apply once with:
--   npx wrangler d1 execute portofolio-visits --remote --file=schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS visits (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash      TEXT NOT NULL,              -- SHA-256(salt + IP); raw IP is NEVER stored (UU PDP)
  city         TEXT,                       -- from request.cf.city (Cloudflare edge geolocation)
  country_code TEXT,                       -- ISO 3166-1 alpha-2, e.g. 'ID'
  lat          REAL,
  lon          REAL,
  timezone     TEXT,                       -- IANA tz name, e.g. 'Asia/Jakarta'
  user_agent   TEXT,
  referrer     TEXT,
  path         TEXT,
  is_unique    INTEGER NOT NULL DEFAULT 0, -- 1 = first visit of this visitor on that UTC day
  created_at   INTEGER NOT NULL            -- Unix epoch milliseconds (UTC)
);

CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_hash    ON visits(ip_hash);
