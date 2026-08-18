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
  asn          INTEGER,                    -- Autonomous System Number, e.g. 15169 (Google)
  as_org       TEXT,                       -- company / org name, e.g. 'Google LLC' (request.cf.asOrganization)
  region       TEXT,                       -- first-level region name, e.g. 'West Java' (request.cf.region)
  region_code  TEXT,                       -- ISO 3166-2 region code, e.g. 'JB' (request.cf.regionCode)
  continent    TEXT,                       -- 2-letter continent, e.g. 'AS' (request.cf.continent)
  is_bot       INTEGER NOT NULL DEFAULT 0, -- 1 = crawler/bot detected via UA or ASN
  user_agent   TEXT,
  referrer     TEXT,
  path         TEXT,
  is_unique    INTEGER NOT NULL DEFAULT 0, -- 1 = first visit of this visitor on that UTC day
  created_at   INTEGER NOT NULL            -- Unix epoch milliseconds (UTC)
);

CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_hash    ON visits(ip_hash);

-- ============================================================
-- CSP violation reports (report-uri endpoint)
-- Browser sends a POST when a Content Security Policy rule is violated.
-- Useful for detecting stale CSP hashes, unexpected script sources,
-- or injection attempts.
-- ============================================================

CREATE TABLE IF NOT EXISTS csp_reports (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  document_url   TEXT NOT NULL,            -- page where the violation occurred
  violated_directive TEXT NOT NULL,         -- e.g. "script-src 'self' 'sha256-...'"
  blocked_uri    TEXT,                      -- the resource that was blocked
  source_file    TEXT,                      -- JS file that triggered the violation
  line_number    INTEGER,
  column_number  INTEGER,
  user_agent     TEXT,                      -- browser UA string
  referrer       TEXT,
  created_at     INTEGER NOT NULL           -- Unix epoch milliseconds (UTC)
);

CREATE INDEX IF NOT EXISTS idx_csp_created ON csp_reports(created_at);
