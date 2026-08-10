-- ============================================================
-- portofolio-visitor-tracker · D1 migration: company/ASN fields
-- Run once on an EXISTING database (fresh installs use schema.sql):
--   npx wrangler d1 execute portofolio-visits --remote --file=migration-org.sql
-- ============================================================

ALTER TABLE visits ADD COLUMN asn         INTEGER;
ALTER TABLE visits ADD COLUMN as_org      TEXT;
ALTER TABLE visits ADD COLUMN region      TEXT;
ALTER TABLE visits ADD COLUMN region_code TEXT;
ALTER TABLE visits ADD COLUMN continent   TEXT;
ALTER TABLE visits ADD COLUMN is_bot      INTEGER NOT NULL DEFAULT 0;
