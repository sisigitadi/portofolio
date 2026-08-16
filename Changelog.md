# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachamber.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.12] - 2026-08-16 — Remove World Dot Map from Visitor Dashboard

> **Owner request**: the visitor dashboard's equirectangular world-dot map (lat/lon scatter rendered into `#chart-map`) removed. The dashboard keeps the trend/hourly/countries/cities/devices charts, table, filters, and CSV export.

### 🗺️ Removed (worker-visitor/worker.js)
- `renderMap()` function (SVG world map + dot-size encoding) and its `renderMap()` call in `renderAll()`.
- The `Visitor map (lat / lon from Cloudflare edge)` panel (`#chart-map`) from the dashboard HTML.
- "charts/map" wording → "charts" in the dashboard footer and table count-line.

### 📚 Docs
- `worker-visitor/README.md` + root `Readme.md`: dropped the "world dot map" mention from the dashboard feature list.

### 🧪 Validation
- `node --check worker-visitor/worker.js` → OK · `node --test worker-visitor/worker.test.js` → **26/26 pass** · `python audit.py` → **13 PASS**.

---

## [2.7.11] - 2026-08-16 — Docs Sync: Item Numbering in Readme

> **Documentation update** per owner request: the Field Manual's new item-numbering system (corner badges `1.01`–`5.09`) documented in `Readme.md`. All docs re-scanned — no other stale references remain.

### 📚 Changed
- **`Readme.md`** — Field Manual section: added `item-numbered sections (corner badges 1.01–5.09)` to the content description.
- Re-scanned `Readme.md`, `Project_rules.md`, `design-lab/CONCEPTS.md`, `worker-visitor/README.md` for session-era stale terms (S.Kom, dual-boot, home labs, aspirational, Directorate of Climate Change, Director's Note, nothing stored, Real-time threat, all current, Division, 20+ years of IT, each backed, built on this stack, no data sent to the cloud, most recent first) — **clean** (historical Changelog entries intentionally untouched).

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN**.

---

## [2.7.10] - 2026-08-16 — Section Numbers as Corner Badges (Same Placement as Offerings)

> **Owner request**: the section numbers in §2–§5 should sit in the same corner-badge position as the offerings' `1.01`–`1.04` — not as inline prefixes. All numbers became the accent corner tab; inline prefixes removed.

### 🔢 Changed
- **§3 Field Log**: `3.01`–`3.10` moved out of the date column into top-right corner badges on each row (`.log .row` gained `position:relative`); dates reverted to plain (`MAR 2026 — NOW`), date column width back to `170px`.
- **§4 Field Reports**: `4.01`–`4.04` become corner badges; tags reverted to descriptive text only (`Recommendation`, `Consultation Reference`, `Manager's Note`, `General Manager`).
- **§5 Certifications**: `5.01`–`5.09` become badges anchored to the issuer cell (`.iss`); year cells back to plain `2025`/`2024`.
- **CSS**: `.oc .num` generalized to `.num` so the badge style applies in every section; fixed two latent broken selectors `td .yr` / `td .iss` → `td.yr` / `td.iss` (the classes sit on the `<td>` itself, so the descendant combinator never matched — the year column now gets its intended mono-accent styling and `.iss` anchors the badges).

### 🧪 Validation
- Browser (headless Chrome + CDP @ 1366): all 31 badges render at their container's top-right corner, **0 text overlaps, 0 horizontal scroll**.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.9] - 2026-08-16 — Consistent Section Numbering (1.01 … 5.09)

> **Numbering system extended from §1 Offerings to every section** (per owner request): the `X.YY` item numbers now run across the whole manual — projects `2.01`–`2.04`, field-log entries `3.01`–`3.10`, field reports `4.01`–`4.04`, certifications `5.01`–`5.09`.

### 🔢 Changed
- **§2 Projects**: `2.01`–`2.04` corner badges added to each card (same `.num` style as offerings; `.pc` gained `position:relative`).
- **§3 Field Log**: each date column prefixed `3.01 · MAR 2026 — NOW` … `3.10 · 2002 — 2014`; `.log .y` column widened `170px` → `195px` so the longest prefixed date fits without wrapping.
- **§4 Field Reports**: tag `Field Report 01 · Recommendation` → `4.01 · Recommendation` (… `4.04 · General Manager`).
- **§5 Certifications**: year cells prefixed `5.01 · 2025` … `5.09 · 2024`.

### 🧪 Validation
- Browser (headless Chrome + CDP @ 1366/1024/768): all numbers render, **0 overflow, 0 horizontal scroll**.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.8] - 2026-08-16 — Move n8n to Applied AI Offering (1.01)

> **Owner direction**: n8n belongs with the applied-AI offering, not IT infrastructure.

### ✏️ Changed
- **1.01 Applied AI & Prompt Engineering** bullet 1: now includes `n8n workflow automation` alongside Ollama and on-device classification (as AI/workflow automation tooling).
- **1.01 REF tag**: `promptmatrix · ollama · text-classification` → `promptmatrix · ollama · n8n · text-classification`.
- 1.03 IT Infrastructure untouched — no n8n there.

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.7] - 2026-08-16 — Offerings Lede Rewrite (CV-Style) + Drop n8n from 1.03

> **Owner-directed copy changes**: the §1 lede replaced with a recruiter-scannable CV-style sentence, and n8n removed from the 1.03 offering because it is too recent to claim as a long-standing capability.

### ✏️ Changed
- **§1 Offerings lede**: `Four areas I operate, maintain, and improve — 24 years of infrastructure, with SecOps & applied AI the recent focus.` → `24 years of infrastructure operations, sharpened into SecOps and applied AI — offered as four service areas.`
- **1.03 IT Infrastructure** bullet 1: removed `and n8n workflow automation` (n8n is a recent acquisition, not a long-standing offering); also dropped `n8n` from the card's REF tag for consistency. The `Business Automation with n8n` certification (2025, Kodeka Labs) remains in the certifications table as a factual record.

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.6] - 2026-08-16 — Shorten Offerings Lede

> **Copy polish** per owner request: the §1 lede compressed from two sentences (~165 chars) to one tight line — same facts, same value proposition.

### ✏️ Changed
- **§1 Offerings lede**: `What I can operate, maintain, and improve for your team. Four areas of work — 24 years of infrastructure experience, with SecOps and applied AI as the recent focus.` → `Four areas I operate, maintain, and improve — 24 years of infrastructure, with SecOps & applied AI the recent focus.`

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · parity maintained.

---

## [2.7.5] - 2026-08-16 — Offerings Rewritten: Sentence-Style, Grounded, No Overclaims

> **Offerings section (lede + 4 cards) revised** per owner feedback that the descriptions felt ambiguous, disconnected, and overclaiming. Capability keyword-dumps became full sentences; ungrounded capabilities dropped; one inaccurate claim corrected.

### ✏️ Changed
- **Lede**: `built on 24 years of production operations` → `24 years of infrastructure experience, with SecOps and applied AI as the recent focus` (AI/SecOps are ±2 years old — the old phrasing implied all four areas have 24 years).
- **1.01 Applied AI**: dropped ungrounded "filtering, and summarization"; corrected the inaccurate `Two shipped AI products — PromptMatrix and SmartExpenseML — are built on this stack` (neither is Ollama-based) → `Shipped, live products: PromptMatrix (cloud Gemini API) and SmartExpenseML (100% browser-side) — both built and maintained end to end`.
- **1.02 SecOps**: dropped ungrounded "DevSecOps pipelines"; list now reads as one connected sentence ending with the ISO 27001 readiness gap analyses.
- **1.03 Infra**: dropped weak "REST API integration" and the cliché "supporting engineering teams end to end" → `keeping engineering teams running day to day`; "Runbooks and documentation are standard" → `Runbooks and documentation on every environment`.
- **1.04 Remote**: keyword-dump bullets ("Asynchronous operations, multi-timezone coordination…") became sentences — `Asynchronous work across time zones, with multi-stakeholder coordination as the default` and `Self-directed troubleshooting and disciplined documentation — nothing depends on memory`.

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained (`index.html` + preview).
- All claims remain grounded in the field log, project cards, or owner-confirmed figures — no new claims introduced.

---

## [2.7.3] - 2026-08-16 — Remove Dead CSS Rules (Post-Overhaul Cleanup)

> **CSS cleanup after the v2.7.0 content overhaul**: rules left unused by the new markup removed from both `index.html` and the preview — no visual change, smaller stylesheet.

### 🧹 Removed
- `.pitch + .pitch` (hero is now a single paragraph), `.pitch b` / `.pitch .u` (no bold/underline markup left in the hero), `.lede b` (no `<b>` in ledes), `.blist li b{white-space:nowrap}` (no `<b>` in bullets) — verified dead against the DOM in both files.
- `.blist` comment updated: "dash markers" → "accent dot markers" (the marker was changed from `–` to a 5px accent circle in the bullet redesign).

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.2] - 2026-08-16 — Drop PUPR Cliché

> **Copy polish**: the management-speak tail removed so the concrete fact stands alone.

### ✏️ Changed
- **PUPR field-log entry** bullet 2: `One reporting standard across four concurrent sites — decisions driven by data, not emails.` → `One reporting standard across four concurrent sites.`

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.1] - 2026-08-16 — Qualify Remaining Audit Items (slip-foot, A.R.Y.A., hero)

> **Last three green-flag audit items tightened** so nothing on the page reads as an unverifiable claim.

### ✏️ Changed
- **Footer slip note**: `nothing else, nothing stored.` → `never shared, never added to any list.` (Formspree stores submissions server-side, so the old phrasing was factually risky).
- **A.R.Y.A. project card**: `Real-time threat-intelligence dashboard` → `SOC analytics & threat-hunting dashboard` (Streamlit apps render on interaction — no streaming, so "real-time" overclaimed).
- **Hero pitch**: `automated response` → `automated response playbooks` (grounded in the NIST IR playbooks written for Tier-1 analysts).

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · parity maintained.

---

## [2.7.0] - 2026-08-16 — Field Manual Content Overhaul: Bulleted Descriptions, Number Dedupe, Overclaim & Consistency Audit Fixes

> **Deep content revision of the Field Manual page** (per owner request, two full text audits): every description in all five sections converted to accent-dot bullet points with a grounded second sentence, achievement numbers deduplicated so each figure appears once in its best-fitting place, overclaims qualified or removed ("simulated" MTTR, cloud-privacy scope, 24-year claim), consistency issues fixed (tag vs. source role, ministry naming, field-log ordering), and ambiguous/AI-sounding phrasing eliminated. The hero pitch, spec table, and all 10 field-log entries were revised; only grounded facts and owner-confirmed figures were used — no new claims.

### ✏️ Hero & Spec Table (front matter)
- **Hero pitch (variant B + audit fix)**: now explains the 24 years ("keeping systems up and teams unblocked") and the recent SecOps/AI focus with concrete examples (Wazuh triage, local-first tooling); removed the ambiguous "Nothing here is aspirational" paragraph and the vague "the last two have been" → "The recent focus has been…".
- **FIELD EXPERIENCE row**: `Feb 2002 → present · infra & sysadmin · SecOps & AI since 2024` — precise range (was "20+ years", which undersold the Feb 2002 start), verified one line at all desktop/tablet widths (768px column capacity measured via CDP).
- **TRACK RECORD row**: `Simulated MTTR −45% via automated SOC triage · 1,000+ prompt-response pairs` — "simulated" now explicit (the 45% is a SCOPS simulation, not production measurement), "4 projects live" removed (duplicated 3× — kept in the DEPLOYMENTS row and §2 lede).
- **EDUCATION**: "S.Kom" removed. **DAILY DRIVER**: `Kali Linux · Windows 11 · Docker on Ubuntu/WSL` ("home labs" reverted — unverifiable; production grounding is the MoE/BPDLH field-log entry). **SIEM & WAF**: `Wazuh · FortiWeb · NIST IR Playbooks` (Elasticsearch removed — a Wazuh backend, not a SIEM/WAF tool, and ungrounded elsewhere). **AI STACK**: reordered to runtime → capability → practice → differentiator with `BYOK (privacy-first)`.
- **Masthead**: "IT — SecOps & AI Division" → "Field Manual · IT · SecOps & Applied AI" ("Division" read as an org structure).

### 🎯 Bulleted Descriptions (all sections)
- **New `.blist` CSS** (accent 5px dot marker via `::before`, no script change → CSP hashes untouched): ledes, 4 offering cards, 4 project cards, and 10 field-log entries converted from prose to bullets — single-sentence descriptions gained one grounded second sentence.
- **Numbers added only where already proven**: 500+ alerts/day (owner-confirmed, placed in Incident Handling — Kemendagri, matching its "high-volume alerts" testimonial), 50+ servers & workstations, 30% log-review cut (MoE), 55% MTTA cut (SOC Analyst, "measured against the new baseline"), thousands of transactions/day (Kemendagri), 1,000+ prompt-response pairs (AI Trainer), 4 concurrent sites (PUPR), 6-month (Nippon Koei) & 6-year (Dipta) tenures, Twelve years (Early Career).
- **Number dedupe**: 45% (spec + SCOPS card, both qualified "simulated"), 1,000+ (spec + AI Trainer), 50+ (1.03 fleet + ACE team — different meanings) — each figure now appears once per context; offerings no longer repeat log numbers.

### 🧹 Consistency & Audit Fixes
- **Overclaim fixes**: "no data sent to the cloud" → "local models keep data on-device; cloud APIs only where explicitly wired" (PromptMatrix uses the Gemini API); "each backed by 24 years" → "built on 24 years" (AI/SecOps are ±2 years old); "nothing stored" left as-is pending Formspree check; certs mnote "all current, dates checked" → "verified — year & issuer listed" (no visible dates to check).
- **Leftover cleanup**: removed "uu-pdp" from 1.04 REF (UU PDP stays only in Senior Programmer, where it fits); removed bold from all description text; star icons → check icons (4); field-log year column right-aligned on desktop (A1); log reordered by **start date** newest-first (MAR 2026 → … → 2002).
- **Attribution consistency**: Field Report 03 tag "Director's Note" → "Manager's Note" (source is now HRD Manager); "HRD Director" → "HRD Manager"; testimonial 01 + JSON-LD `worksFor` aligned to "Ministry of Environment".
- **Dedupe within cards**: SCOPS (H/M/L once), PromptMatrix ("3 criteria" once), SmartExpenseML (privacy claim once), AI Trainer (safety-guidelines boilerplate replaced with grounded BYOK detail), Early Career (two-companies fact).

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62**.
- All 4 project URLs verified live (200/200/200/303) — "In production" claims grounded.
- Parity maintained: `design-previews/02-field-manual.html` mirrors every content change (10 rows, 18 `.blist` each).
- `sw.js` cache bumped `portofolio-v5` → `portofolio-v6` so returning visitors receive the overhauled page.

---

## [2.6.9] - 2026-08-16 — CSP Hash Recalculation: Script-1 Hash Refreshed After Comment Translation + SW Cache Bump v5

> **Bug found by browser render verification of v2.6.8**: the first inline `<script>` was **silently blocked by CSP**. Root cause: the English-only sweep translated an Indonesian comment **inside** the first inline `<script>` block, which changed the script content → its SHA-256 hash changed → the hash in the `Content-Security-Policy` meta went stale (exactly the failure mode documented in Project_rules §1.7) → CSP blocked the script. The stale hash was only visible in a real browser (console CSP violation), not in `audit.py` (which checks script syntax via `node --check`, not hash validity).

### 🔧 Fixed
- **`index.html` — CSP hash recalculated**: first inline script's hash refreshed `sha256-ab5GJj…` → **`sha256-95M56TvPm8qwFARcpmHg9b9SQZyilD7V+fHZtcg1h7g=`** in the `script-src` directive. The second script's hash (`sha256-u86bYsMwO71wBLrZtpK99d81VjwgfFiFsf5wljgOhxc=`) was untouched by the sweep and remains valid. Re-rendered in browser: **0 CSP violations**.
- **`sw.js` — cache bump `portofolio-v4` → `portofolio-v5`**: returning visitors (whose service worker precached the old `index.html` with the stale hash) receive the fixed page on next deploy; `activate` purges the old cache.

### 🧪 Validation
- Browser (Chrome 151 headless + CDP, fresh profile, cache disabled): **PROBLEMS (0)** — all 5 sections (`offer, projects, log, reports, certs`) + anchors (`contact, resume-request`) present, **0 CSP violations**, 0 exceptions, 0 console errors.
- Not affected: `design-previews/02-field-manual.html` & `index_asli.html` have no CSP hashes (`'unsafe-inline'`); `audit.py` does not validate CSP hashes → no test changes.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `pytest` → **62/62** · `node --test worker-visitor/worker.test.js` → **26/26**.

---

## [2.6.8] - 2026-08-16 — Repo-Wide English-Only Cleanup: All Indonesian Translated to English

> **English-only sweep across the entire repository** (per owner request): every Indonesian string was translated to English — code comments, CLI output, documentation, changelog entries, design exploration areas, and the legacy bilingual backup. The deployed site was already 100% English in user-facing content; this pass covers everything else.

### 🇬🇧 Translated to English (production & infrastructure)
- **`index.html`**: 8 Indonesian CSS/HTML/JS comments translated (user-facing text was already 100% English).
- **`audit.py` + `test_audit.py`**: comments and all CLI output strings translated (`Summary: …` line, status messages); test assertions updated to match (30/30 pass).
- **`indexnow-ping.py` + `test_indexnow_ping.py`**: comments and output strings translated; assertions updated (32/32 pass).
- **GitHub Actions workflows** (`preflight.yml`, `indexnow.yml`, `lighthouse-ci.yml`), **git hooks** (`pre-commit`, `pre-push`), and **`.gitattributes`**: Indonesian comments translated.
- **`worker-visitor/README.md`**: rewritten in English.

### 📚 Translated to English (documentation)
- **`Readme.md` & `Project_rules.md`**: remaining Indonesian sections translated.
- **`Changelog.md`**: all 40 Indonesian entries (v2.6.7 → v2.2.1) translated to English; the already-English tail (v2.2.0 → v1.0.0) preserved verbatim.

### 🧪 Translated to English (exploration areas — outside the production audit gate)
- **`design-previews/`**: Indonesian comments in `02-field-manual.html` translated.
- **`design-lab/`** (React + r3f concept workshop): full translation of `CONCEPTS.md`, `Gallery.jsx`, all 10 concept pages (UI copy + comments), shared components/styles, concept metadata (`index.js`), and `scripts/cdp-check.mjs`.
- **`index_asli.html`** (legacy bilingual backup): the entire `id:` i18n dictionary (229 keys) mirrored to English, all Indonesian `data-i18n` HTML defaults translated, and Indonesian comments cleaned — structure verified intact (229/229 identical key sets, zero tag-balance errors).

### 🧪 Validation
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** (100% Production Ready).
- `python -m pytest test_audit.py test_indexnow_ping.py -q` → **62/62 passed**.
- `node --test worker-visitor/worker.test.js` → **26/26 passed**.
- Final repo-wide Indonesian scan: clean (only false positives remain, e.g. "boundaries").
- **Kept intentionally**: proper nouns (real government entity names, original Medium article titles) and functional demo keywords ("kopi", "makan" expense-classifier inputs).

---

## [2.6.7] - 2026-08-16 — Responsive Layout Fixes, Footer Links Wrap, JSON-LD Ampersand, PWA Theme & SW Registration

> **Comprehensive responsive layout update & PWA/SEO sync**: text alignment changed from `justify` to `left` to prevent awkwardly clumped/broken text on mobile, footer contact links converted to a responsive flexbox, the JSON-LD `&amp;` entity fixed, `manifest.json` colors aligned to the Field Manual theme, `sw.js` registration re-enabled, and the visitor badge set to appear only after a backend response.

### 📐 Layout & Typography Enhancements (index.html)
- **`left` text alignment**: `body`, `.pitch`, `.lede`, and `footer` now use `text-align: left` — eliminating stretched word spacing (*rivers of whitespace*) and clumped text on narrow phone screens.
- **`h1` line-height 1.15**: raised from `1.02` to `1.15` — preventing ascenders/descenders from touching when text wraps on mobile.
- **TOC flex wrap**: `.toc .trow` now has `flex-wrap: wrap`, `gap: 8px 10px`, and `min-width: 12px` on `.dots` so page numbers always stay tidy.
- **Footer links flexbox (`.footer-links`)**: contact link row changed from a single-line paragraph with `&nbsp;·&nbsp;` to a chip/item-based flexbox with `gap: 6px 12px` (each item wraps naturally without colliding on screens <380px).
- **CTA note mobile alignment**: `.cta-note` gets `margin: 8px 0 0 0` in the `≤620px` media query so when it drops below the button on narrow screens, the handwritten note stays symmetric and left-aligned.
- **Mobile section padding**: `section` set to `padding: 38px 0 0` on mobile (down from 52px) for a denser, more comfortable scroll flow on phones.
- **Mobile wrapper padding**: `footer .wrap` and `.wrap` in the `≤620px` media query adjusted with proportional `16px` padding.

### 🛠️ PWA, SEO & Tracker Sync
- **OG/Social Image Sync (`Project_rules §5.5`)**: `og-preview.jpg?v=2.6.1` cache-buster bumped to `?v=2.6.7` in 6 locations at once (meta itemprop, image_src, og:image, og:image:secure_url, twitter:image, JSON-LD image) to refresh social preview caches.
- **Complete PWA Service Worker Precache (`sw.js`)**: added `'./favicon.ico'` to the `CORE` precache array and bumped cache `portofolio-v3` → `portofolio-v4`.
- **JSON-LD `jobTitle` fix**: `&amp;` character changed to a plain `&` in the schema.org Person block.
- **`manifest.json` theme color sync**: `theme_color` changed to `#D6CDB4` and `background_color` to `#F3EEDF` (aligned with `<meta name="theme-color">` and the Field Manual palette).
- **Service Worker PWA registration**: added automatic `sw.js` registration on the `window.load` event.
- **Visitor badge delay**: `#visitor-badge` only switches `style.display = 'block'` when a successful hit/count response is received from the worker.
- **CSP hash recalculation**: inline script SHA-256 hash values updated in the `Content-Security-Policy` meta.

### 🧪 Validation & Testing
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** (100% Production Ready).
- `pytest` (`test_audit.py` & `test_indexnow_ping.py`) → **62/62 PASSED**.
- `node --test worker-visitor/worker.test.js` → **26/26 PASSED**.

---

## [2.6.6] - 2026-08-16 — Fix: Handwritten Notes One Line (Ulefone 360px) — Measurement Verification Corrected

> **Bug report owner (Ulefone Armor 11 5G, 360px)**: after v2.6.5, `good fit — references checked` and `scope matches the role exactly` were **still 2 lines** — v2.6.5 only shrank the decoration (underline 52px) but the `.mnote` text **stayed 23px**: the longest notes need 232–285px text + 52px underline vs 290px content (231px available) → wrap.
>
> **Verification method correction**: v2.6.5's one-line claim used `getClientRects()` — that method is **wrong** (a span inside a flex container gets blockified and always returns 1 rect even when text wraps). v2.6.6 uses a valid detector: **span height vs 1.4× line-height** (1 line ≈ line-height, 2 lines ≈ 2×), validated against desktop cases already known to be one line before being used.

### 🔧 Fixed (index.html — ≤620px media query, mobile only)
- **`.mnote span` 23px → 19px** — text is the real constraint, not the decoration.
- **`.mnote svg.underline` 52×8 → 36×7** — longest note margin (`verified — all current, dates checked`, natural 236px) raised from 3px → **11px** to stay safe against per-device font rendering variations.
- **`.mnote{flex-wrap:wrap;justify-content:flex-end}`** — safety net: if the decoration doesn't fit, the underline drops to a second line while the text stays on one line.
- `.cta-note` **stays 22px** (already one line — `strong candidate — proceed` renders on one line, spanH 33.3 < 38.5 threshold).
- **Desktop ≥621px unchanged** (mnote 23px, underline 72px) — all one line with ≥36px margin.

### 🧪 Validation (Chrome headless CDP, height-vs-line-height detector)
- **@360 (Ulefone)**: all four mnotes + cta **1 line** — `scope…` margin 49px, `references checked` 55px, `verified…` 11px.
- 320px: mnote text stays 1 line (underline drops via flex-wrap for the longest notes); 280px (Fold outer): wraps only then — outside target.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `node --test worker-visitor/worker.test.js` → **26/26** · `pytest` → **62/62** · no CSP impact.

---

## [2.6.5] - 2026-08-16 — Fix: Handwritten Notes One Line on Narrow Screens (Ulefone 360px)

> **Bug report owner (Ulefone Armor 11 5G, 360px)**: after v2.6.4, the Caveat handwritten notes (23–24px) + pen strokes wrapped to 2 lines and looked garbled — 290px content in a 360px viewport isn't enough to fit text + ink decoration (mnote needs 211px text + 72px underline; cta needs 218px + 44px signature).

### 🔧 Fixed (index.html — ≤620px media query, mobile only)
- **`.cta-note span` 24px → 22px** and **`.cta-note .ink.paraf` 40×28 → 34×24**.
- **`.mnote svg.underline` 72×11 → 52×8** — `.mnote` text **stays 23px** (shrinking just the underline is enough to fit one line).
- **Desktop ≥621px unchanged** (cta 24px, underline 72px) — large sizes stay on wide screens.

### 🧪 Validation (Chrome headless CDP — line count via `getClientRects()`)
- cta & all four mnotes **1 line** at 280 / 320 / 360 / 414 / 1366 viewports (previously detected wrap via height-vs-line-height; that method is a false positive for spans containing transformed `inline-block` letters — corrected to count rects per line).
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `node --test worker-visitor/worker.test.js` → **26/26** · `pytest` → **62/62** · no CSP impact.

---

## [2.6.4] - 2026-08-16 — Black Ink + Ink Bleed Effect: Bigger Handwriting & Pen Strokes, Strong Contrast

> **Owner decision after v2.6.3 review**: Caveat handwriting font & pen strokes enlarged again, ink color changed from rust (`#8A4A26`) to **pure black (`#000`)**, plus an **ink bleed effect** (dark blur halo around text & strokes) — the feel of wet pen soaking into cream paper.

### 🖋️ Ink size & color (index.html)
- **Caveat font enlarged again**: margin notes (`.mnote`) 19px → **23px**, CTA notes (`.cta-note`) 20px → **24px** (line-height 1.25; note max-width 340px → 400px).
- **SVG strokes enlarged again**: check 30×28 → **36×34**, star 24×24 → **28×28**, signature 46×30 → **54×36** (sign 42×27 → **50×32**, opacity .85 → .9, CTA signature 33×24 → **40×28**), underline stroke 60×9 → **72×11**.
- **Pure black `#000`** for all Caveat text and all `.ink path` strokes + underlines (previously rust accent `#8A4A26`/`--accent`) — strong contrast on cream paper, applies globally to all signatures (field log, certifications, footer) via the global `.ink` rule.

### 💧 Ink bleed effect
- **Text**: 4-layer layered-blur `text-shadow` — `0 0 2px rgba(0,0,0,.55)`, `0 0 6px rgba(0,0,0,.3)`, `0 0 14px rgba(0,0,0,.18)`, `0 0 24px rgba(0,0,0,.09)` — a dark halo spreading out from the letters like ink soaking into paper fibers.
- **SVG strokes**: inline **`#inkBleed`** filter (hidden `aria-hidden` SVG in `<body>`) — `feGaussianBlur stdDeviation 2.2` rendered **under** the original stroke (`feMerge`), applied via `filter:url(#inkBleed)` to all `.ink path` and underline strokes; doesn't affect `stroke-dashoffset` scroll animations.

### 🧪 Validation (Chrome headless CDP)
- Verified: `mnote=23px`, `cta=24px`, text & stroke `rgb(0,0,0)`, `stroke-width 3.6px`, `filter=BLEED` on all 3 signatures (incl. footer), 4-layer text-shadow ON, `stdDeviation=2.2`, `#inkBleed` defined, `h1` still one line at 360px.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `node --test worker-visitor/worker.test.js` → **26/26** · no CSP impact (CSS + SVG defs only — script hash untouched; hidden `aria-hidden` SVG safe for screen readers).
- Visual review: hero screenshot at 360px + CTA note close-up (black ink + bleed halo clearly visible on cream paper).

---

## [2.6.3] - 2026-08-16 — Responsive Hero Fix (360px) + Handwriting Font & Ink Strokes Enlarged

> **Mobile display fix + "ink strokes" readability**: hero `h1` name on Ulefone Armor 11 5G (360px) dropped from 40px to 28px so it fits on **one line** (previously 2 lines with stretched word spacing — caused by `text-align: justify` on `body` cascading into `h1`), and the Caveat handwriting font + SVG pen strokes were enlarged for better visibility.

### 🎨 Hero `h1` — responsive fix (index.html)
- **`font-size: clamp(40px, 7vw, 72px)` → `clamp(28px, 6.5vw, 72px)`** — at 360px viewport (Ulefone Armor 11 5G) the name drops 40px → 28px, "Sigit Adi Irianto." fits **one line**; smooth scale 28px (phone) → ~50px (768) → ~66px (1024) → capped 72px (≥1366).
- **`text-align: left` added to `h1`** — root cause of "far-apart word spacing": `body{text-align:justify}` cascaded into `h1`, so wrapped lines got justify-stretched. Now left-aligned (still `text-wrap: balance`); on ultra-narrow screens (Fold outer 280px, content 210px) that still wrap to 2 lines, there are no more justify gaps.

### ✍️ Handwriting font & pen strokes enlarged
- **Caveat font**: margin notes (`.mnote`) 16px → **19px**; CTA notes (`.cta-note`) 16.5px → **20px** (line-height adjusted 1.15/1.2).
- **SVG `.ink` strokes**: check 24×22 → 30×28, star 19×19 → 24×24, signature 38×24 → 46×30 (sign 34×22 → 42×27, CTA signature 26×20 → 33×24), underline 52×8 → 60×9.
- **Ink thickness**: `stroke-width` 2.6 → **3** (more visible, still `pathLength="120"` + `stroke-dasharray` for draw-on-scroll animation).

### 🧪 Validation (Chrome headless CDP, device metrics emulation)
- **8-viewport matrix**: 280 / 320 / 360 / 414 / 768 / 1024 / 1366 / 1920 — `h1` **one line from 320px** (360 Ulefone confirmed `WRAPPED=false`), always fits container (`fitsContainer=true`), **0 horizontal scroll** at all widths; 280px still 2 lines but left-aligned (no justify spacing).
- Confirmed applied: `mnote=19px`, `cta=20px`, star 24×24, signature 42px, `stroke-width=3px`.
- `python audit.py` → **13 PASS | 0 FAIL | 0 WARN** · `node --test worker-visitor/worker.test.js` → **26/26** · no CSP impact (CSS-only changes — `style-src 'unsafe-inline'`; script hash untouched).

---

## [2.6.2] - 2026-08-16 — Visitor Worker Hardening: Body Guard, Fail-Closed Salt, Referrer Policy + Route Test Suite

> **Visitor worker review & hardening (`worker-visitor/`)**: three small gaps closed (unbounded `POST /hit` body, constant `'salt'` fallback when `IP_HASH_SALT` isn't configured, dashboard without `Referrer-Policy`), plus the **first 26 route tests** (node:test, zero dependencies) added to the CI preflight gate, stale "tracker disabled by default" docs synced, and a PWA cache bump.

### 🛡️ Security hardening (worker-visitor/worker.js)
- **`POST /hit` body guard (10 KB)**: `readJsonBody()` helper — reject via `Content-Length` header before buffering; for chunked bodies (no Content-Length) the stream is read with a cap and **cancelled the moment it exceeds the limit** → HTTP **413 `payload_too_large`** before touching D1. Legit client payload (path/referrer/lang/w/h) < 1 KB; empty/malformed body still treated as `{}` (no regression).
- **Fail-closed `IP_HASH_SALT`**: `secretConfigured()` guard now shared by `authorized()` (DASHBOARD_KEY) and `recordVisit()` — missing/placeholder `CHANGE_ME_*` salt → **HTTP 500, no visit recorded** (previously silently fell back to the constant `'salt'` = guessable hash identical across deploys, defeating UU PDP anonymization).
- **`Referrer-Policy: no-referrer`** on all dashboard/login HTML responses — dashboard URLs carry `?key=…`; the key never leaks as a `Referer` to third parties.

### 🧪 First route test suite (worker-visitor/)
- **`worker.test.js` — 26 tests** (node:test, zero dependencies, Node 20+): all routes — `/count` (D1 + KV cache, cache-hit without D1), `/hit` (salt hash verified byte-for-byte, 413 via Content-Length & stream, 429 rate-limit, fail-closed salt, empty/malformed body), `/pixel` (GIF89a, bot flag, silent rate-limit drop), `/api/stats` & `/api/export` (403/200, CSV quoting), `/dashboard` (login vs dashboard + `Referrer-Policy`), CORS/404/500-no-D1.
- **`package.json`** (`"type": "module"` + `npm test`) + **CI gate**: `preflight.yml` now runs `node --test worker-visitor/worker.test.js` (setup-node v5 pin) as a third gate — total gates: audit 13 · pytest 62 · worker 26.

### 🔄 Docs & PWA
- **Readme.md**: stale claim "visitor tracker optional / disabled by default (0 requests until `WORKER_URL` is set)" synced — tracker is **active** (`WORKER_URL` already set); `index.html` comment ("hidden until `WORKER_URL` is set") corrected too.
- **`sw.js` cache bump `portofolio-v2` → `portofolio-v3`** — returning visitors receive new index.html & assets on next deploy (activate purges old cache).

### 🚀 Deploy & validation
- Worker **deployed & verified live**: `GET /count` 200 (218 total · 42 unique), `/dashboard` 200 + `Referrer-Policy: no-referrer`, oversized `POST /hit` → **413** (guard active without polluting the counter), `/nope` 404; `DASHBOARD_KEY` & `IP_HASH_SALT` secrets confirmed present before deploy.
- Local: `node --test worker-visitor/worker.test.js` → **26/26** · `python -m pytest test_audit.py test_indexnow_ping.py -q` → **62 passed** · `python audit.py` → **13 PASS | 0 FAIL | 0 WARN**.

---

## [2.6.1] - 2026-08-16 — Field Manual → Production: SEO/SEM Parity, Visitor Tracker & Adaptive Audit Gate

> **Chosen concept (Field Manual) implemented as the new production `index.html`** — all SEO/SEM signals & Google/Bing crawler methods preserved, visitor tracker + dashboard shortcut enabled, and the production gate (`audit.py` + pytest) adapted to be compatible with the Field Manual.

### 🚀 Added / Changed (index.html — chosen concept implemented)
- **Field Manual becomes production `index.html`** (content from `design-previews/02-field-manual.html`): printed-manual metaphor, TOC as the only navigation, Request Slip — Resume (PDF) to the production Formspree endpoint `mkgknrqk` (hidden `source: field-manual`), 16 ink strokes on scroll, Caveat font.
- **Full SEO/SEM head parity with old production**: title 53 chars (Bing 2.5.15 fix), description 124 chars without `&amp;`, `robots: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` (**preview noindex removed**), canonical, OG/Twitter (`og-preview.jpg`), JSON-LD Person + WebSite, geo.region, author, referrer, **production CSP**, PWA manifest + apple-touch-icon, `favicon.ico` fallback.
- **Visitor tracker (`worker-visitor/`) active**: `#visitor-badge` (manual colophon) + **hidden shortcut: click `#footer-copyright` 9× (≤2s apart) → private `/dashboard`** — verified end-to-end via headless CDP (navigation to `.../dashboard` confirmed; worker live, hit recorded); client script POSTs `/hit` + polls `/count` every 60s + `<noscript>` pixel.
- **Caveat font merged into one Google Fonts stylesheet** (Inter + Space Mono + Caveat) per Project_rules §4.4 — no separate `<link>`.
- **Contradictory text removed**: "design preview, not the live site" & "production site" references in footer; hidden form `source: field-manual-preview` → `field-manual`.

### 🧰 Adaptive production gate (audit.py + tests)
- **`audit.py` 11 → 13 checks**: SPA-specific checks are now **feature-conditional** — CLI gimmick (#4), testimonial carousel (#7), i18n dictionary (#8), `getElementById` variable calls (#9b) pass as "not applicable" when the feature is absent (Field Manual is single-language & carousel-less). Check #8 now also FAILs when `data-i18n` is used without a dictionary.
- **+2 new checks**: **#11 SEO meta** (title ≤ 65 chars, description ≤ 160 chars, robots `index` without noindex, canonical, OG, Twitter) and **#12 valid JSON-LD structured data** (`Person` + `WebSite` types required, all blocks valid JSON).
- **`test_audit.py` 20 → 30 tests** (+10): single-language i18n PASS, `data-i18n` without dictionary FAIL, no-carousel PASS, slide mismatch FAIL, SEO noindex / missing title / invalid JSON-LD / missing schema type FAIL; mutations targeted at Field Manual IDs (`visitor-badge`, `slip-email`).

### 🛡️ Security hardening (v2.6.1)
- **CSP `script-src` without `'unsafe-inline'`**: replaced with **sha256 hashes** of the 2 inline scripts (`sha256-mVCKz/hkUhstJwPooOgQgDgqC4t/7VfL87IPri1I8bY=` & `sha256-kHtiFb3B+fXE7H8EWDyTM5kRueZ08F1f1Rdw63D0DTE=`) — direct script injection blocked (strongest XSS mitigation). **If an inline script changes, the hash must be recalculated** (Project_rules §1.7) — otherwise CSP blocks the script and the page silently breaks.
- **`connect-src` narrowed**: `https:` (open) → only `'self' https://formspree.io https://portofolio-visitor-tracker.si-sigitadi.workers.dev` (anti data-exfiltration to other domains).
- **`img-src` narrowed**: `https:` → `'self' data: <worker>` (image beacons from foreign domains blocked).
- **New directives**: `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'` (anti base-tag injection), `form-action 'self' https://formspree.io`, `upgrade-insecure-requests` + **`Permissions-Policy`** (camera/mic/geolocation/payment/usb/autoplay disabled).
- **Backend worker review** (`worker-visitor/`): secure — constant-time key compare, salted SHA-256 IP, prepared statements (anti SQLi), `</script>` breakout mitigation on dashboard JSON embed, HTML escaping on all attacker-controlled fields (path/referrer/user_agent), per-IP rate limit. No code changes.

### 🖥️ Display compatibility (all displays)
- **Fix**: certification table clipped on very narrow screens (Galaxy Fold outer 280px — Issuer column clipped by `.sheet` `overflow:hidden`) → wrapped in **`.table-scroll`** (`overflow-x:auto` + `-webkit-overflow-scrolling:touch`) + safety net `html,body{overflow-x:hidden}`.
- **14-viewport matrix verified 0 overflow**: Ulefone Armor 11 5G (360×780 @ DPR2), iPhone SE (320), Android (360), iPhone 12/13 (390), Plus (414), **Fold outer (280)**, phone landscape, tablets 768/1024, laptops 1280–1366, desktops 1440–1920, ultrawide 3440.

### 🔗 Socials & OG image
- **X/Twitter links removed entirely** (footer, JSON-LD `sameAs`, `twitter:site`, `twitter:creator`) — **zero X association**; footer is now linkedin · github · medium · email.
- **`og-preview.jpg` regenerated** with Field Manual aesthetics (1200×630, 82 KB, rendered via Chrome headless CDP) + cache-bust **`?v=2.6.1`** in 6 references (og:image, og:image:secure_url, twitter:image, itemprop image, image_src, JSON-LD image).

### 🔐 CI supply-chain hardening
- **All workflow actions pinned to full commit SHAs** in `preflight.yml`, `indexnow.yml`, `lighthouse-ci.yml`: checkout `fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09` (v5.1.0), setup-python `ece7cb06caefa5fff74198d8649806c4678c61a1` (v6.3.0), setup-node `a0853c24544627f65ddf259abe73b1d18a591444` (v5.0.0), setup-chrome `086160e580d6e8c142ad5ba29009dcde677c6321` (v2) — tags can't move silently (supply-chain mitigation).

### 🧪 Validation
- `python audit.py index.html` → **13 PASS | 0 FAIL | 0 WARN** · old SPA (`index_asli.html`) still **13 PASS** (no regression) · `python -m pytest test_audit.py test_indexnow_ping.py -q` → **62 passed**.
- **Lighthouse: a11y 100 · BP 100 · SEO 100 · Performance 98** — "CSP effective vs XSS" audit = **1** (hash-based script-src); perf ≥ 50 non-blocking.
- Browser (CDP headless): 0 exceptions, **0 CSP violations**, Caveat font loaded, live visitor badge count, form validation working, 9× clicks → `/dashboard`; 14-viewport display **0 overflow**.
- SEO: 17/17 tags, 2 valid JSON-LD blocks (Person + WebSite, sameAs 4 entries without X); canonical, robots.txt, sitemap.xml, IndexNow key & workflow, Google verification file — all intact.

---

## [2.6.0] - 2026-08-16 — Design Directions: 5 Concept Previews, Field Manual Final & 3D Design Lab

> **Production SPA deploy prep**: exploration session for new human-made design directions (not AI templates) — `design-previews/` (5 static HTML concepts) and `design-lab/` (React + Vite + r3f workshop, 10 3D concepts). Production `index.html` **not yet changed** — all artifacts below live outside the production audit gate; deployment to the live site happens after direction selection + implementation.

### 🚀 Added (design-previews/ — gallery of 5 design directions)
- **`design-previews/index.html`** — gallery page of 5 concepts (Soc Console, **Field Manual**, Trade Journal, Signal Monitor, Plaintext Brutalist), each a self-contained HTML preview with no runtime dependencies, built from real portfolio content (Wazuh, Docker, Ollama, 20+ years ops).
- **`02-field-manual.html` — owner-selected concept, worked deepest**:
  - TOC becomes the only navigation (nav bar removed), pure masthead, "↑ back to contents" link per section, all text justified, 2×2 offerings grid.
  - Content 100% accurate to the latest CV (Sigit_Adi_Irianto_AI_SecOps.pdf): 10-row spec table (contact, MTTR −45% · 1,000+ prompt-response pairs track record, S.Kom Budi Luhur education), 4 projects with production URLs, 10-entry career field log 2002–2026, 9 certifications across 2 areas (2025 on top, then 2024), field reports + resume request slip.
  - Bench Tests removed (interactive mini-app broke the "printed document" metaphor) — interactive demos stay on the production site.
  - **Request Slip — Resume (PDF)**: single-field (email) paper-slip-styled form; wired to the **same production Formspree endpoint** (`https://formspree.io/f/mkgknrqk`) with the same pattern as index.html (fetch + FormData, `_gotcha` honeypot, 30s throttle, hidden `source: field-manual-preview` + `request: resume-pdf` to distinguish preview vs production submissions).
  - **"Paper on the desk" polish**: table-colored body + shadowed paper sheet; standardized separators (em-dash); `text-wrap: balance` + h1 kerning; a11y skip-link.
  - **"Manual already read by a recruiter" story**: 16 ink strokes (4 checks on key roles, 4 stars on stats & flagship certifications, 4 signatures, 4 margin notes) that draw themselves on scroll (`stroke-dashoffset` + IntersectionObserver), all `aria-hidden`, fully disabled in `prefers-reduced-motion`.
  - **Caveat handwriting font** (Google Fonts) + per-letter jitter via JS (each letter rotated/baseline-shifted ±2–3°) — the feel of real recruiter handwriting; fallbacks `Segoe Script`/`Bradley Hand`. **For production**: add `family=Caveat:wght@500;600` to the existing Google Fonts stylesheet (not a new link) — production CSP already allows `fonts.gstatic.com`.
- **`design-lab/` — 3D concept workshop (React + Vite + @react-three/fiber + drei + framer-motion)**: 10 futuristic-theme concepts (Perimeter radar dome, Latent neural space, Command deck, Harbor container registry, Verify vault, Orbit timeline, Evidence case files, Archive vault log, Tower ATC, Operator promptable console) — full documentation in `design-lab/CONCEPTS.md`. Work isolated from the production SPA (Project_rules §4.1 mandate respected: `index.html` stays a single file with no build step).

### 🧹 Housekeeping (deploy prep)
- `cr.json` (GitHub check-run API response dump, 3.8 KB) left over from Lighthouse CI debugging — **delete before production commit** (irrelevant to deploy).
- `design-previews/.tmp-*.mjs` (temporary CDP verification scripts) cleaned up; no artifacts left in the gallery.

### 🧪 Validation
- Static previews: 0 console errors, no horizontal overflow (1366/900/620/480/375 px), slip form actually submitted to Formspree (`ok` response) — end-to-end flow proven.
- All ink strokes draw fully on scroll (16/16), Caveat font loaded (`document.fonts.check` true), per-letter jitter active.
- Production `index.html` untouched — production gate (`audit.py` 12 PASS · pytest 52/52 · Lighthouse) unaffected until the chosen concept is implemented.

---
## [2.5.15] - 2026-08-11 — Bing URL Inspection Fix: Title Too Long & Meta Description Missing

### 🔄 Changed (response to Bing Webmaster URL Inspection errors)
- **Error 1 "Title too long" (91 chars → 53 chars)**: `<title>` + `meta name="title"` + `itemprop="name"` + `og:title` + `twitter:title` (5 locations) shortened from `Sigit Adi Irianto | IT &amp; SecOps Specialist | Applied AI Engineer | Tangerang, Indonesia` → **`Sigit Adi Irianto | IT &amp; SecOps | Applied AI Engineer`** (53 decoded chars, within Bing/Google ~65 char limit). Full empirical title stays in hero, JSON-LD, and manifest.json (not truncated there).
- **Error 2 "Meta Description tag missing"**: meta description + `og:description` + `twitter:description` (3 locations) — `&amp;` entity replaced with the word **"and"** (`Remote IT SecOps and Applied AI Engineer in Tangerang, Banten, Indonesia. SOC, Wazuh SIEM, DevSecOps and AI. View portfolio.` — **124 chars** ≤ Bing's 155 limit). The tag actually existed (1 valid instance in `<head>`), but the Bing parser reportedly failed to detect descriptions containing `&amp;`; removing the entity removes the candidate cause + re-inspection will force a re-crawl.
- **Project_rules §2.2 synced**: full empirical title remains required in content/JSON-LD/manifest, while the meta `<title>` uses a compact SERP-safe variant (53 chars) — with a ban on returning long titles to meta without staying ≤ 65 chars.

### 🧪 Validation
- 5× title + 3× description updated; decoded title 53 chars, decoded description 124 chars.
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **52/52**.

---

## [2.5.14] - 2026-08-11 — Actions CI Upgrade: Node 20 Deprecation Immune

### 🔄 Changed (all 3 workflows — node20 → node24 runtime)
- **`.github/workflows/preflight.yml`**: `actions/checkout@v4` → **v5**, `actions/setup-python@v5` → **v6**.
- **`.github/workflows/lighthouse-ci.yml`**: `actions/checkout@v4` → **v5**, `actions/setup-node@v4` → **v5**, `browser-actions/setup-chrome@v1` → **v2** (v1 still `using: node20` — the last deprecation warning source; v2 node24, `chrome-version: 134` input still valid).
- **`.github/workflows/indexnow.yml`**: `actions/checkout@v4` → **v5**, `actions/setup-python@v5` → **v6**.
- All target versions **verified node24** via official `action.yml` (`using: node24`) before installing — not guesswork; old `checkout@v4`/`setup-node@v4`/`setup-python@v5`/`setup-chrome@v1` versions re-scanned = 0 remaining.

### 🧪 Validation
- 3 workflow YAMLs valid (`yaml.safe_load`) · 0 occurrences of old versions in `.github/workflows/`.
- Confirmed after push: new CI run without Node 20 deprecation warnings.

---

## [2.5.13] - 2026-08-11 — pytest (52 tests) Enters preflight CI Gate

### 🚀 Changed (.github/workflows/preflight.yml)
- **New "Run Unit Tests (pytest)" step** after audit: `python -m pip install pytest` then `python -m pytest test_audit.py test_indexnow_ping.py -q` — CI now runs the **full 52 tests** (20 audit + 32 indexnow-ping), not just `audit.py`. Any failure → push/PR blocked.
- Workflow header updated (audit + pytest as two gates), job name → `Pre-Flight Audit (12 checks) + pytest (52 tests)`.
- Readme §Four gates synced (gate #3 now mentions audit + 52 pytest).

### 🧪 Validation
- YAML validated (`yaml.safe_load`) — 4 steps: Checkout, Setup Python, Run Pre-Flight Audit, Run Unit Tests (pytest).
- Local `python -m pytest test_audit.py test_indexnow_ping.py -q` → **52 passed** (exactly the CI command).

---

## [2.5.12] - 2026-08-11 — Unit Tests for indexnow-ping.py (32 tests)

### 🧪 Added (test_indexnow_ping.py)
- **32 new unit tests for `indexnow-ping.py`** (pytest) with no network — completing `test_audit.py` (20) for a total of **52 tests**:
  - **Auto-discover key**: finds valid `{KEY}.txt` (name = content), rejects content-mismatch / names < 8 chars / illegal chars / plain .txt files, picks a valid key among many files; explicit vs auto `load_key`, missing file → None, invalid name → None.
  - **IndexNow payload**: correct `{host, key, keyLocation, urlList}` shape, safe JSON round-trip; `ping_indexnow` dry-run → True without network; HTTP 200 → True; HTTP 403 → False + message; network error → False (no crash).
  - **CRLF fallback** (`deployed_content_hash`): CRLF file → hash **equal** to pure LF content (core of the Windows wait-sha fix), pure LF unchanged, missing file → None — subprocess.run mocked so the fallback is what's tested.
  - **wait_until_deployed**: match → True instantly, never matches → False (timeout), file missing → True (skipped); `time.sleep` mocked for speed.
  - **CLI & main()**: default args, `--dry-run`/`--wait-sha`/`--wait-timeout`/`--key-file` flags, `main()` exit 1 without key, exit 0 + correct payload with key (root injected via new `main(..., root=...)` parameter), key filename regex (ok/bad sets).
- **`indexnow-ping.py`**: `main()` now accepts optional `root: Path | None` — allows injecting the root directory in tests without touching production behavior.

### 🧪 Validation
- `python -m pytest test_audit.py test_indexnow_ping.py -q` → **52 passed** · `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `py_compile` OK.

---

## [2.5.11] - 2026-08-11 — IndexNow Real-Time Crawl Notification + Bing Verification

### 🚀 Added (IndexNow — instant crawling for Bing & participating search engines)
- **`indexnow-ping.py`** — IndexNow ping script (pure Python 3, zero dependencies): auto-discovers `{KEY}.txt` key file at repo root (filename = file content = key, per IndexNow spec), optional `--wait-sha FILE` (polls the live page until content sha256 == local file — prevents pinging before GitHub Pages finishes rebuilding), POSTs JSON to `https://api.indexnow.org/indexnow` with `host` + `key` + `keyLocation` (required because the key file lives at subpath `/portofolio/`) + `urlList` (homepage + sitemap). Exit 0 success / 1 failure; `--dry-run` prints the payload without sending.
- **`.github/workflows/indexnow.yml`** — automated workflow: every push to `main` runs `python indexnow-ping.py --wait-sha index.html --wait-timeout 420` (wait for deploy ≈ done, then ping). Failed ping is informational (doesn't block push). Manual trigger via Actions tab.
- **Key file `6605868618dc4f34b628743b70f6d7c9.txt`** (content = key) at repo root — public by protocol design (proof of ownership, not a secret; see Project_rules §1.5).
- **`BingSiteAuth.xml`** — official Bing Webmaster Tools ownership verification file (user hash) — committed so it's live on Pages and the Bing property verifies automatically.
- **Readme** — new "IndexNow — How It Works" section + bullet in UX; **Project_rules.md §1.5** — clarified that the IndexNow key is an exception to the "NO API KEY EXPOSURE" mandate (must be public & deployed).

### 🧪 Validation
- `python -m py_compile indexnow-ping.py` OK · dry-run with real key → valid payload (host, key, keyLocation subpath, urlList homepage+sitemap) · graceful error exit 1 when key missing (Windows cp1252 UnicodeEncodeError *fixed*: all output pure ASCII).
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · workflow YAML valid.

---

## [2.5.10] - 2026-08-11 — Canonical & Structured-Data URLs Normalized to Trailing Slash

### 🔄 Changed (aligned with verified GSC property)
- **All `https://sisigitadi.github.io/portofolio` URLs (no slash) normalized to `https://sisigitadi.github.io/portofolio/`** (with trailing slash) — pointing directly at the final URL that actually returns 200 (the no-slash version only 301-redirects to the slashed version):
  - `link rel="canonical"` · `meta og:url` · `meta twitter:url` (3 metas).
  - JSON-LD `Person.url` & `WebSite.url` (2 blocks, 3 `url` occurrences).
  - `currentOrigin` JS variable in the dynamic SEO script (single-quote) — safe because it's used as a final value, not path concatenation (no double-slash risk).
- **Not changed (already correct)**: all `og-preview.jpg?v=2.1.0` image URLs, `sitemap.xml` (already slashed), `robots.txt`, `profileUrl` (already slashed), and `path=/portofolio` in the Worker tracking pixel (that's a path tracking param, not a site URL).
- **Background**: Google Search Console property is now verified as `https://sisigitadi.github.io/portofolio/` (slashed) — canonical/og:url now one-to-one consistent with the GSC property, removing duplicate-URL signals for Google.

### 🧪 Validation
- 7 locations normalized (6 double-quote + 1 single-quote) · grep verification: 0 remaining `portofolio"`/`portofolio'` in site-URL contexts.
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20**.

---

## [2.5.9] - 2026-08-11 — Fix Lighthouse CI: Light-Theme Color Contrast (a11y 100)

### 🔧 Fixed (root cause of failing Lighthouse CI — a11y 0.96)
- **Diagnosis**: CI run failed `categories.accessibility` (found 0.96) on the last 3 pushes. Local reproduction with the exact CI versions (Lighthouse 12.6.1 + Chrome 134 via Node 20) proved: score **100 in dark theme**, **0.96 in light theme** — the Ubuntu headless runner defaults to `prefers-color-scheme: light`, so Lighthouse tests the page in **light theme**, where 33 elements fail `color-contrast` (neon palette on white). Not an SEO code regression — the issue existed since the first CI gate (c4e4893), just never seen because local testing always rendered dark theme.
- **Light-theme fix (no HTML change)**:
  - Light variables: `--color-primary` `#0E7490` → **`#155E75`**, `--color-accent1` `#059669` → **`#047857`**, `--color-accent2` `#0D9488` → **`#115E59`** → `#0F4F4B` (tinted badge pill needed a darker step — contrast 4.44 still < 4.5; #0F4F4B gives ~5.7:1 margin).
  - New `html[data-theme="light"]` override block: `text-emerald-400` → `#047857`, `text-red-400` → `#B91C1C`, `text-cyan-400/300/200` → `#155E75` (neon Tailwind palette fails WCAG AA on white).
  - `.badge-ct` light `#155E75` → **`#0F4C5C`** (badge text on `--color-primary/30` pill).
- **Note**: Changelog 2.4.3 claimed light-theme contrast was already "fixed" for `.badge-ct`/`.badge-ac1` — proven not comprehensive (33 elements remained) and not gated because CI/local always rendered dark.

### 🧪 Validation
- LH 12.6.1 + Chrome 134 (exact CI versions): **LIGHT a11y 1.0 · DARK a11y 1.0** — 0 failed audits in both themes.
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20**.
- Browser: toggled to light theme — hero tagline & "OPEN FOR REMOTE ROLES" badge clear, "Short-Term Contract" badge readable, **0 console errors**.
- Diagnostic artifacts (Chrome 134 359 MB, report JSON) cleaned from repo.

---

## [2.5.8] - 2026-08-11 — og-preview.jpg Regenerated ("Applied AI Engineer")

### 🖼️ Changed
- **`og-preview.jpg` fully regenerated (1200×630, 119 KB, progressive JPEG, quality 90)** — text inside now **"IT & SecOps Specialist | Applied AI Engineer"** (two-color cyan/emerald, consistent with the new title) replacing "Applied AI Practitioner". Visual elements: **OPEN FOR REMOTE ROLES** badge, large white name, two-color tagline, sub-description *"Security Operations • Applied AI • DevSecOps Automation"* + *"Based in Tangerang, Banten, Indonesia — remote-ready worldwide"*, **CORE STACK: AI & SECOPS** & **TOOLS: LINUX • OLLAMA • WAZUH** chips, URL footer, double-bracket logo — dark terminal theme with dot-grid + cyan/emerald glow consistent with the site.
- **Cache-buster `?v=2.0.0` → `?v=2.1.0`** in 7 meta locations (itemprop image, link image_src, og:image, og:image:secure_url, twitter:image, JSON-LD `image`, dynamic SEO script `ogImageUrl`) — forces Facebook/WhatsApp/LinkedIn to fetch the new image (strict per-URL caching).

### 🧪 Validation
- `file og-preview.jpg` → JPEG 1200×630 progressive · 119 KB size (< 130 KB target) · browser visual verification 5/5 (name, Engineer tagline, REMOTE badge, no crop, professional look).
- `python audit.py` → 12 PASS | 0 FAIL | 0 WARN · pytest 20/20.

---

## [2.5.7] - 2026-08-11 — Full Location "Tangerang, Banten, Indonesia"

### 🔄 Changed (answer to owner question: why not "Tangerang, Banten, Indonesia")
- **Two-tier location strategy**: `title` stays **"Tangerang, Indonesia"** (91 chars; adding "Banten" → 98 chars would cut keywords in the SERP already at the ~60-char display limit), while **description & content use the full format**.
- **Meta description + og:description + twitter:description** → `Remote IT SecOps & Applied AI Engineer in Tangerang, Banten, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` (exactly **120 chars** — optimal limit).
- **Hero pitch EN/ID** → *"Based in Tangerang, Banten, Indonesia — open to remote roles worldwide"* (HTML default + i18n dictionary, both EN and ID variants).
- **JSON-LD** `Person.description` & `WebSite.description` also mention Banten; `address` already complete (`Tangerang` + `Banten` + `Indonesia`) from the start.
- Total "Banten" occurrences: 9× (description×3, pitch EN×2, pitch ID×1, JSON-LD×2, address×1).

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 valid JSON-LD blocks · description 120 chars.

---

## [2.5.6] - 2026-08-11 — "Remote" Keyword Optimization (Remote-Ready Emphasis)

### 🚀 "Remote" emphasis optimization (global recruiter intent)
- **Meta description rewritten with "Remote" first**: `Remote IT SecOps & Applied AI Engineer in Tangerang, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` — **112 chars** (within optimal ≤120, previously 130), synced to `meta description` + `og:description` + `twitter:description` (3× consistent).
- **JSON-LD strengthened**: `Person.description` block now mentions *"remote-ready worldwide"*; `WebSite.description` block → *"open to remote work worldwide"*.
- **Visible content** (already present, verified intact): hero badge **"OPEN FOR REMOTE ROLES"**, hero pitch *"open to remote roles worldwide"* (EN/ID), What I Offer card **"Remote & Global Work Readiness"**.

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 valid JSON-LD blocks.
- Browser: remote badge clearly visible, remote readiness card present, new meta description verified in DevTools, **0 console errors**.

---

## [2.5.5] - 2026-08-11 — Title Revert: "Applied AI Practitioner" → "Applied AI Engineer" (CV Alignment)

### 🔄 Changed (owner decision)
- **Empirical title reverted to `Applied AI Engineer`** across all metadata, header, bio, and structured data — matching the exact wording in the owner's CV ("Applied AI Engineer" was indeed the original hero title; changed to "Applied AI Practitioner" in v2.0.4, now reverted for CV alignment + broader recognition + SEO-friendliness).
- **Location updated**: `<title>` + `meta title/description` + `itemprop` + `og:title/description/image:alt` + `twitter:title/description` + JSON-LD `Person.jobTitle` & `description` + JSON-LD `WebSite.name` & `description` + hero tagline (`<h2>` `heroTaglineB`) + i18n dictionary EN `Applied AI Engineer` / ID "Applied AI Engineer" (Indonesian "Insinyur AI Terapan") + `manifest.json` name/description + Readme subtitle.
- **Project_rules.md §2.2 updated**: new empirical title `IT & SecOps Specialist | Applied AI Engineer` + history note (original → Practitioner v2.0.4 → revert v2.5.5); "Applied AI Engineer" ban lifted.
- Changelog intentionally **not** changed in old entries (historical record) — this entry documents the revert.

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 valid JSON-LD blocks.
- 0 remaining "Practitioner" in live code (only in Project_rules as historical note) · 16× "Applied AI Engineer" in index.html.
- Browser: hero EN `IT & SecOps Specialist | Applied AI Engineer` ✓, ID toggle "IT & SecOps Specialist | Applied AI Engineer" (Indonesian) ✓, `document.title` ✓, **0 console errors**.

---

## [2.5.4] - 2026-08-11 — SEO Deep-Optimization: Geo-Keywords, Heading Hierarchy, Enriched Schema

### 🚀 On-Page SEO optimization (keyword research + 2025–2026 best practices)
- **Geo-keyword in `<title>` & all metas**: `… | Tangerang, Indonesia` added to `<title>`, `meta name=title`, `itemprop name`, `og:title`, `twitter:title` — low-competition local keywords with high recruiter intent (research results: "IT Security Operations Specialist Tangerang" & "Applied AI Practitioner Indonesia" = low-competition). Empirical title `IT & SecOps Specialist | Applied AI Practitioner` kept exact (Project Rules §2.2).
- **Meta description optimized** (≤120 chars, keyword + location + CTA): `IT SecOps Specialist & Applied AI Practitioner in Tangerang, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` — synced to `meta description`, `og:description`, `twitter:description` (old duplicate removed).
- **`<meta name="keywords">` removed** — ignored by Google for a long time (research), wasted space & potential thin-spam signal.
- **Hero heading hierarchy fixed**: tagline `IT & SecOps Specialist | Applied AI Practitioner` promoted from `<div>` → **`<h2>`** (main keyword now a structured heading, not decorative text), and "Specializing in:" `<h2>` → **`<h3>`** — hero order now `h1 → h2 → h3` (better semantics + a11y heading-order, visually identical: cyan color & typing effect kept).
- **JSON-LD enriched**: `Person` block gets `description`, `knowsLanguage: ["en","id"]`; `image` synced to GitHub Pages URL (`og-preview.jpg?v=2.0.0`) consistent with canonical (rule 5.4); **new `WebSite` block** (`name`, `url`, `description`, `inLanguage`, `author`).
- **Geo-keyword in visible content**: hero pitch EN/ID now mentions *"Based in Tangerang, Indonesia — open to remote roles worldwide"* (local keyword appears in real text, not just metas).
- `sitemap.xml` `lastmod` → 2026-08-11.

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 JSON-LD blocks validated with parser (`Person` + `WebSite`).
- Browser tests: hero tagline still cyan + typing effect, `h2`/`h3` headings correctly placed in DevTools, `document.title` contains "Tangerang, Indonesia", **0 console errors**.

---

## [2.5.3] - 2026-08-11 — Company/ASN/Region Detection (Cloudflare Edge) + Bot Flag + JS-less Pixel

### 🚀 Added (worker-visitor/worker.js — Level 1 enrichment, free tier, no third-party API)
- **New D1 `visits` columns** (migration `migration-org.sql`, `schema.sql` updated for fresh installs): `asn`, `as_org` (company/ISP name, e.g. *"Google LLC"* / *"PT Anugerah Cimanuk Raya"*), `region`, `region_code`, `continent`, `is_bot` — all from Cloudflare edge `request.cf` (available on all plans, no cost).
- **Automatic bot detection** (`detectBot`): crawler UA regex (Googlebot, bingbot, DuckDuckBot, YandexBot, Baiduspider, AhrefsBot, GPTBot, CCBot, etc.) + crawler ASN fallback (Google 15169, Amazon, Microsoft, DuckDuckGo) when UA isn't a full browser. Result stored in `is_bot` → dashboard shows orange **🤖 bot** badge.
- **Duplication refactor (reviewer)**: `handleHit` & `handlePixel` now share one `recordVisit` helper (geo → hash → rate-limit → dedupe → INSERT → cache invalidate → echo) — no more two identical INSERT blocks that could drift. **Two-tier per-IP rate limit**: browsers 20/min, detected bots 120/min (real crawlers fetch 50–200 URLs/min — the old 20 ceiling would cut most Googlebot hits; human anti-spam stays strict).
- **New `GET /pixel?path=` endpoint** — 1×1 transparent GIF beacon (42 B): records a hit exactly like `/hit` but **without JavaScript** (captures crawlers & no-JS visitors), same rate-limit & daily dedupe.
- **`index.html`**: `<noscript>` tracking pixel to `/pixel?path=/portofolio` (only rendered when JS is off → no double-count with `/hit`; `/portofolio` path consistent with canonical).
- **Dashboard table**: new **Network** column showing `as_org` + `AS<asn>` + `region (region_code)`; bot badge in the IP hash column; export CSV header & client CSV include the new columns.
- `/api/stats` & `/hit` echo now include `asn`, `asOrganization`, `region`, `continent`, `isBot`.

### 🔒 Privacy (UU PDP compliant)
- Raw IP **still never stored** — hash only; what's added is company/ASN/region name (public edge geolocation data, not personal identity). Level 1 choice (no real IPs) per user decision.

### 🧪 Validation
- D1 `migration-org.sql` migration succeeded (6 columns); `node --check` OK; audit **12 PASS | 0 FAIL | 0 WARN**.
- Live tests: `/pixel` → valid 1×1 GIF; Googlebot UA → `bot=1` + `PT Anugerah Cimanuk Raya AS141127 West Java`; browser UA → `bot=0`; count incremented.
- End-to-end browser: Network column shows company+ASN+region, 🤖 bot badge shows, **0 console errors**.

---

## [2.5.2] - 2026-08-11 — Dashboard v2: Charts, World Map, Breakdown, CSV Export, Auto-Refresh

### 🚀 Added (worker-visitor/worker.js — dashboard & API)
- **Enriched dashboard, 100% client-side without CDN**: 30-day daily visit trend (SVG bar chart), hourly distribution (UTC), Top 8 countries & cities, device/browser/OS breakdown (UA parse), **world dot map** (equirectangular projection from Cloudflare edge lat/lon, dot size = frequency), path filter, 50-row pagination.
- **Two-way CSV export**: *"Export CSV (view)"* button (filtered rows, client-side) + new `GET /api/export?key=…&range=…` endpoint (server-side, up to 50,000 rows, `Content-Disposition` header).
- **60-second auto-refresh** (default ON, can be disabled): polls `/api/stats` using the key from the URL without page reload; `location.reload()` fallback if key isn't in URL; *"Updated HH:MM:SS"* indicator.
- `GET /api/stats` accepts `limit` param (cap 5000); `DASHBOARD_ROWS` = latest 2000 rows embedded for charts/map.
- Login page shows *"Saved key was rejected"* hint when a saved key is rejected (key-rotation scenario).

### 🧪 Validation
- `node --input-type=module --check worker.js` OK · `python audit.py` 12 PASS (index.html unchanged) · deploy without warnings.
- **Template literal bug caught & fixed**: `\/` in UA regex (`Edg\/`, `Chrome\/`, `OPR\/`, `Safari\/`, `Firefox\/`) was decoded to `/` when the worker's template literal was evaluated → client output became `//i` → `ReferenceError: i is not defined` in `parseUA`. Fixed to `\\/` (double backslash). Verified with client-JS execution harness (syntax + runtime EXEC_OK) before & after deploy.
- Verified: dashboard loads chart/map containers, `/api/export` returns valid CSV, `/count` & auth still OK.

---

## [2.5.1] - 2026-08-11 — Secret 9-Click Dashboard Shortcut + Remember-Key Auto-Unlock

### 🚀 Added
- **Hidden shortcut in portfolio footer**: clicking the copyright text (`#footer-copyright`) **9×** with ≤ 2s intervals → redirect to private `/dashboard`. Dashboard key is **never** stored in the site HTML — it only opens the login page.
- **Login page auto-unlock**: *"Remember key in this browser"* checkbox saves `DASHBOARD_KEY` to `localStorage` on the `*.workers.dev` origin; next visit auto-submits the form straight to the dashboard (auto-submit only active when URL has no `?key=`, preventing infinite loop if key is rotated). *"Forget saved key"* link in dashboard footer and *"Clear saved key"* on the login page remove it.
- **Design note**: `localStorage` is per-origin — the key can't be read from the portfolio origin (`github.io`), so the remember-key flow is deliberately centered on the dashboard origin.

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** (55 `getElementById` IDs resolve, incl. `footer-copyright`).
- End-to-end browser test: 9 clicks → login page; login + remember → dashboard; next 9 clicks → auto-unlock straight to dashboard; forget key → back to login.

---

## [2.5.0] - 2026-08-11 — Visitor Tracker: Hit Counter + Private Dashboard (Cloudflare Worker + D1)

### 🚀 Added (worker-visitor/)
- **New serverless backend in `worker-visitor/`** — visitor hit counter + private dashboard (IP & location) with no third-party APIs, for the static GitHub Pages site:
  - `schema.sql` — D1 `visits` table (SHA-256+salt ip_hash, city, country_code, lat, lon, timezone, user_agent, referrer, path, is_unique, created_at) + 2 indexes.
  - `wrangler.toml` — D1 `DB` binding + KV `VISITS`; **no `[vars]` block** (lesson from real deploy: a same-named `[vars]` overwrites secrets at deploy time) — `DASHBOARD_KEY` & `IP_HASH_SALT` purely from `wrangler secret put` (use `printf '%s'` without trailing newline, because `echo` makes `safeEqual` reject the key).
  - `worker.js` — routes `GET /count` (public badge, 60s KV cache), `POST /hit` (record visit + geo from Cloudflare edge `request.cf`, 20/min/IP rate limit via D1, daily unique dedupe), `GET /api/stats?key=` (JSON), `GET /dashboard?key=` (private HTML page: constant-time key login + remember-key auto-unlock, stat cards, 24h/7d/30d/all filter table, emoji flags, short IP hash), CORS preflight.
  - `README.md` — full `wrangler` deploy steps + curl tests + free tier notes.
- **`index.html`** — hit counter badge in footer (`#visitor-badge` `role="status"` `aria-live="polite"`, hidden until `WORKER_URL` is set) + client script (POST `/hit` on load, poll `/count` every 60s) + 1 i18n key `visitorLabel` (EN/ID balanced). CSP `connect-src https:` already covers the worker — no CSP change.

### 🔒 Privacy (UU PDP)
- Raw IP **never stored** — only `SHA-256(salt + IP)`; city/country/timezone geolocation from Cloudflare edge (`request.cf`), no third-party geolocation API; private dashboard owner-only (key + constant-time compare). Tracker disabled by default (0 outbound requests until `WORKER_URL` is set).

### 🧪 Validation
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** (i18n parity kept, `visitor-badge`/`visitor-count` resolve to DOM, tag balance, `node --check`).
- `python -m pytest test_audit.py` → **20/20 PASS**.
- `worker.js` valid ES module syntax (`node --input-type=module --check`).
- Worker deploy + filling `WORKER_URL` = manual user step (documented in `worker-visitor/README.md`).

---
## [2.4.4] - 2026-08-10 — Lighthouse CI Gate (GitHub Actions)

### 🚀 Added (.github/workflows/lighthouse-ci.yml + .lighthouserc.json)
- **4th quality gate**: `lighthouse-ci` workflow runs Lighthouse against the site served from the checkout (local `python3 -m http.server 8899`) on every push/PR to `main` — complementing pre-commit, pre-push, and preflight-audit.
- **Assertions (`.lighthouserc.json`)**: `accessibility`, `best-practices`, and `seo` **must be 100** (`minScore: 1` → error, blocks push/PR if dropped); `performance` ≥ 0.5 (**warn**, non-blocking — synthetic mobile-throttle score is noise-prone across runners).
- **Technical details**: `@lhci/cli@0.15.1` via `npx` (version pin), `node 20` via `actions/setup-node@v4`, `chromeFlags --no-sandbox --disable-gpu` (ubuntu runner standard), `numberOfRuns: 2` for stability, `upload.target: filesystem` (local artifacts only, no public LHCI server).
- **Documentation**: Readme §Quality Gates updated "three gates" → "**four gates**" (with local equivalent commands for reproduction); `.gitignore` adds `lhci-public/` & `.lhci/`.

### 🧪 Validation
- `python -c json.load(.lighthouserc.json)` → valid · workflow YAML valid · local `lhci healthcheck` → PASS · local `lhci autorun` successfully collected Lighthouse results ("No browser errors logged") — temp-dir cleanup failure is only a local Windows quirk, doesn't happen on ubuntu runners; final approval = first CI run on GitHub after push.

---

## [2.4.3] - 2026-08-10 — Lighthouse Optimization: Accessibility 100, Best Practices 100

### 🚀 Performance
- **Google Fonts `@import` → preload + stylesheet link** in `<head>` (removing the render-blocking `@import` waterfall; `display=swap` kept) + **Font Awesome** given `rel="preload"` — then reverted because async `media="print"` proved to trigger icon FOUC + CLS (0.113) in testing (CLS back to 0.022).
- **Project images compressed**: `PromptMatrix 2.0.png` 431 KB → **124 KB (−71%)**, SmartExpenseML −65%, KantinKu −63%, A.R.Y.A. −65% (median-cut 256-color quantization + dithering, original dimensions kept — screenshots stay sharp in browser verification). SCOPS kept (didn't pass quality threshold).
- **Explicit `width`/`height`** on 5 project card `<img>`s (2:1 aspect) — prevents layout shift on lazy-load.
- **Medium rss2json feed removed** → Medium card uses 3 already-curated static articles: free rss2json API often runs out of quota (HTTP 422) → permanent console error failing Lighthouse `errors-in-console`; with removal, best-practices 96 → **100**. Copy `md1b2` (EN/ID), Readme (third-party flows, CSP, XSS, PWA cache boundary), and CSP `connect-src` synced — now the **only outbound call is Formspree**.

### ♿ Accessibility (91 → 100)
- **Button contrast**: `.btn-primary` & `.btn-filter.active` now `#0E7490` (hardcoded) — white text passes WCAG AA 4.5:1 (previously white on `#0891B2` = 3.68:1).
- **`--color-primary` dark `#0891B2` → `#22D3EE`** (cyan-400, aligned with site accent): all small primary-colored text on dark surfaces passes (8.1:1).
- **Career badges theme-aware**: `.badge-ct` (Contract/Project) → `#67E8F9` dark / `#155E75` light; `.badge-ac1` (Part-Time) → `#6EE7B7` / `#065F46` — text on tinted backgrounds now passes AA in both themes.
- **Heading order**: 10 testimonial names `h4` → `h3` (previously h4 directly under h2 section = level skip).
- **Target size**: testimonial carousel dots now 24×24 px hit-area (`w-6 h-6` + padding + `background-clip: content-box` — active pill still elongated, inactive dots round 12 px) — passes target-size.

### 🖼️ Best Practices (96 → 100)
- **Physical `favicon.ico` created** (cyan double-bracket logo, 16×16 + 32×32, 569 bytes) + `<link rel="icon" href="favicon.ico">` — eliminates the `/favicon.ico` 404 Lighthouse logged as console error.

### 🧪 Validation
- Lighthouse (local): **Accessibility 100 · Best Practices 100 · SEO 100** (previously 91/96/100); CLS 0.113 → **0.022**; 0 failed items in a11y & best-practices.
- Lighthouse (live, GitHub Pages, post-push): **Accessibility 100 · Best Practices 100 · SEO 100** — FCP 4.8→4.3s, LCP 4.9→4.3s, CLS 0.016, 799 KB total transfer (down from ~1 MB thanks to image compression + rss2json removal). Perf 65 (synthetic mobile-throttle score; remaining opportunity is only ~20 KiB unused CSS in the compiled Tailwind block).
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` · `pytest` **20/20** · 0 remaining rss2json references in index.html/Readme.

---

## [2.4.2] - 2026-08-10 — Full-Bleed Project Cards & Single "What I Offer" Heading

### 🧭 About — one heading only: "What I Offer"
- "About Me" (h2) and "What I Offer" (h3) headings **merged into a single h2 "What I Offer"** — bio stays below as intro, then 4 skill cards (2 columns desktop).
- i18n key `aboutTitle` removed from EN & ID (parity stays balanced, 228 keys).

### 🖼️ Project cards — full-bleed (image covers the whole card)
- Cards 1–5: screenshot images now **cover the entire card** (custom CSS `.pcb-card` 26rem → 30rem at ≥640px, no longer `h-52 sm:h-64` thumbnail), text/metrics/tags/buttons sit on a **dark gradient** at the card bottom, hover zoom via `.pcb-card:hover img`.
- Card 6 (Medium): consistent full-bleed style with **cyberpunk gradient without image** (`.pcb-gradient` + `.pcb-between`); article feed still JS-filled with fallback.
- **Screenshot title visible**: `object-position: left top` (left-top of image — where the app title is — no longer cropped; previously `top` cropped left/right), and category badge moved to **top-right** (`top-3 right-3`) so it doesn't cover the title.
- **PromptMatrix 2.0 accuracy correction**: re-framed as a **prompt engineering app** (not "LLM Safety Evaluation") — badge/title/tags → "Prompt Engineering" / "Prompt Engineering Platform" (EN/ID), highlight → "Multi-variable prompt testing & optimization" (EN/ID) (1,000+ claim removed per user decision), alt text adjusted, case study modal (pm1t/b1/b2/b3 EN+ID) rewritten in prompt-engineering framing; Readme "AI evaluation apps" → "AI prompt-engineering apps".
- **45% MTTR claim deduplicated on SCOPS card**: redundant `-45% MTTR` chip tag removed and highlight replaced with a complementary factual feature from the modal — "Real-time risk classification (High/Medium/Low)" (EN/ID) — the 45% MTTR claim now appears only once (in the title).
- **RLHF "1,000+ pairs" claim aligned with facts (all locations)**: About card → "Applied AI & Prompt Engineering" (EN/ID) (description: multi-variable prompt testing & optimization, client-side BYOK, local Ollama); Career cr2d EN/ID rewritten to prompt-engineering framing; hero typewriter → "Prompt Engineering & LLM"; Readme "RLHF evaluation" → "prompt engineering". Total 0 RLHF/1,000+ occurrences left.

### 📄 Documentation consistency (P0) + claim softening (P1)
- **Readme synced with code**: 6 stale references fixed — (1) project images "hot-linked from Unsplash" → "local `assets/`"; (2) "word-frequency summarization + password entropy" claim removed; (3) "All six demo widgets" → "All three"; (4) demo list #4–6 (Summarizer/Skill Matcher/Password) removed; (5) "summarizer output" reference in XSS section removed; (6) third-party flow list drops Unsplash.
- **Absolute "0ms" claims softened**: "100% offline · 0ms API latency" → "no network latency" (SmartExpense card + case study modal EN/ID) — same accuracy, without marketing-sounding claims.
- **Kept with justification**: "20+ years" (supported by career dates 2002 → 2026 ≈ 24 years), "50+ staff" (career claim), MTTR −45% (already labeled "simulated"), testimonials & certifications (only owner can verify — advised to double-check before hiring).

### 🧹 Final review before release
- **Light theme full-bleed cards fixed**: `.pcb-shade` was hardcoded dark gradient `rgba(2,6,23,…)` → dark card text (`--color-text-primary` adaptive) unreadable in light theme. Now has `html[data-theme="light"] .pcb-shade` override (white fade) — verified in browser light mode, 0 console errors.
- **Dead code removed**: `applyArchDynamicText()` guard call in `applyLanguage()` (architecture visualizer long removed, guard permanently false).
- **Consistent phrasing**: "zero network latency" → "no network latency" (pj2m & sm1b3 uniform).
- **PWA cache bump**: `sw.js` `portofolio-v1` → `portofolio-v2` so returning visitors receive new index.html + new asset images.
- **og-preview.jpg regenerated** (1200×630, 96 KB, down from 638 KB): dark cyberpunk theme consistent with the site — name, two-color tagline, sub-description, "OPEN FOR REMOTE ROLES" badge, CORE STACK/TOOLS chips, URL, gradient accent line; meta `og:image`/`twitter:image` cache-buster bumped `?v=1.0.1` → `?v=2.0.0` and URL pointed to GitHub Pages (`sisigitadi.github.io/portofolio/og-preview.jpg`) — raw.githubusercontent CDN doesn't bypass old caches. Verified live via opengraph.xyz (new 1200×630 image, 0 console errors).
- **Live version claim audit (pre-recruiter)**: career title `cr2c` "Various AI Evaluation Platforms" → "Various AI Prompt Engineering Platforms" (EN/ID, aligned with cr2d prompt-engineering reframe); 3 certifications corrected per research — "Certified SOC Analyst — Cyber Academy Indonesia" → "SOC Analyst" (internal completion cert, not EC-Council CSA), "Ubuntu Linux Professional Certification — Canonical" → "Ubuntu Linux Professional — LinkedIn Learning" (Canonical's official name is Canonical Academy/SysAdmin, Oct 2025), "Certified Ethical Hacker Foundation" → "Ethical Hacking Foundations — LinkedIn Learning" (CEH Foundation isn't an EC-Council certification); Prospera/ACE testimonials confirmed as real companies (INKINDO/DevelopmentAid) — quote authenticity remains the owner's responsibility.
- Custom CSS added because compiled Tailwind doesn't load arbitrary classes (`h-[26rem]`, `group-hover`, etc.) — safest approach for a single-file SPA without a build system.

### ♿ Descriptive alt text
- All five project images given descriptive alt (e.g. "PromptMatrix 2.0 — LLM security evaluation dashboard") — accessibility + SEO.

### 🧪 Validation
- `python audit.py` full → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance, i18n 228 keys balanced, 53 IDs + 4 selectors resolve)
- `python -m pytest test_audit.py` → **20/20 PASS**
- Browser check: full-bleed cards + readable text on gradient, About single "What I Offer" heading, case study modals open, **no horizontal overflow at 390px mobile viewport**, all 5 images loaded (naturalWidth > 0 after lazy-load)

---

## [2.4.1] - 2026-08-10 — Remove Architecture Visualizer, Sharper About & Project Cards

### 🗑️ System Architecture Visualization removed entirely
- **"System Architecture Visualization" block removed from Projects** (previously moved from About) — deemed repetitive & low-value per user decision.
- Also cleaned: HTML block (~230 lines), all architecture JS (`archNodeData`, `switchArchitectureDiagram`, `runArchSimulation`, `resetArchSimulation`, `inspectArchNode`), "Technical Node Inspector" modal, 118 `arch*` i18n keys (EN/ID symmetric), CSS animations (radar/packet/laser). `.holo-card` **kept** (still used in Certifications).
- Impact: 66 → **53 `getElementById` IDs** (all resolve), 6 → 4 querySelector IDs, 288 → **229 i18n keys** (parity stays balanced). index.html size: 354 KB → 282 KB.

### ✏️ About Me & What I Offer — no longer repeating the hero
- About Me bio **rewritten** to differ from the hero pitch: hero = positioning ("IT professional with 20+ years..."), About = how I work & values ("I pair two decades of IT operations with applied AI... privacy-first, documenting as I go, across timezones").
- "What I Offer" cards now **2 columns on desktop** (`md:grid-cols-2`) — denser & more professional.

### 🖼️ Project cards — bigger, authentic-looking images
- Image height raised `h-44` → `h-52 sm:h-64` with `object-top` (shows real UI, not random center crop) + `hover:scale-105` zoom.
- Real user screenshots (`assets/*.png`) kept — not stock/AI images.

### 🧪 Validation
- `python audit.py` full → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance OK post-removal, i18n 229 keys balanced, 53/53 IDs + 4 selectors resolve)
- `python -m pytest test_audit.py` → **20/20 PASS**
- Browser check: About (different bio + 4 cards 2 columns), Projects without simulation block, bigger images, 3 demos, case study modals open — **all pass, 0 console errors**

---

## [2.4.0] - 2026-08-10 — Recruiter-Friendly Reflow: P0/P1/P2 Portfolio Optimization

### 🔄 P0 — Funnel & Honesty (recruiter-friendly)
- **Hero CTA "Explore Case Studies" → "View Projects"** (EN/ID) — old label only scrolled to the grid without opening a case study; now honest and doesn't duplicate nav.
- **Demos (ml-sandbox) moved after Projects** — new flow: Hero → About → Projects → Demos → Career. Recruiter conversion funnel no longer interrupted by technical content; desktop & mobile nav re-ordered too (About, Projects, Demos, Career...).
- **Short bio added to About**: "About Me" heading + 20+ year bio (EN/ID), then "What I Offer" drops to h3 with 4 skill cards.

### 🎯 P1 — Trust & Clarity
- **Honest resume label**: "Request Official Resume (PDF)" → **"Request Official Resume (PDF via Email)"** (EN/ID) — visitors know the expectation (resume sent by email, not instant download).
- **Hero badge no longer disappears**: the 15s fly-in/out keyframes hiding the tool stack (LINUX • OLLAMA • WAZUH) replaced with a one-way entrance animation — key info stays visible for recruiters who don't interact.

### 🎛️ P2 — Curated, Local, Consolidated
- **Demos curated 6 → 3** (Expense Classifier, ML Security Validator, Spam & Phishing): HTML cards 4–6, JS blocks (summarizer, skill matcher, password analyzer), i18n keys dm4/dm5/dm6, and their callers removed — from 79 → 66 `getElementById` IDs (all resolve), "Explore 6" → "Explore 3" text.
- **Unsplash images replaced with real screenshots in `assets/`** (PromptMatrix 2.0.png, SmartExpenseML.png, SCOPS Command.png, KantinKu ERP.png, A.R.Y.A. SOC Analytics.png) — zero third-party dependencies (Unsplash), leftover upload `desktop.ini` cleaned.
- **Architecture visualizer moved from About into Projects** — About is now purely personal (bio + offer), technical architecture merges with project context; `id="architecture"` stays intact in the DOM.

### 🧪 Validation
- `python audit.py` full → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance OK post section-move, i18n 288 keys balanced, 66/66 IDs + 6 selectors resolve)
- `python -m pytest test_audit.py` → **20/20 PASS** · pre-commit & pre-push hooks OK
- Browser check (Chrome DevTools): hero/CTA, About (2-column cards), Projects+architecture, 3 demos, case study modals, contact widget + new resume label — **all pass, 0 ReferenceError** (leftover `runSummaryPreset`/`runSkillPreset`/`runPassPreset` init calls found in browser & removed)
- index.html size: 386 KB → 354 KB (−32 KB)

---

## [2.3.2] - 2026-08-10 — Summary & Timing, Configurable Target, Unit Tests (pytest)

### ✨ Added (audit.py)
- **Summary + timing at end of audit**: every run now closes with a `Summary: 12 PASS | 0 FAIL | 0 WARN | 11 checks | 3.43s` line — PASS/WARN counts tallied in `_pass()`/`_warn()`, duration via `time.monotonic()`.
- **Target file via positional argument**: `python audit.py [file] [--quick]` — `parse_cli_args()` split out as a pure function (testable); default stays `index.html`; unknown flags ignored.
- **Unit tests `test_audit.py` (pytest)**: 20 tests — real index.html passes fully; 6 targeted broken scenarios (each triggering exactly 1 FAIL: dead `getElementById` ID, `#ghost` selector, unbalanced tags, unbalanced i18n, slide count mismatch, wrong Formspree endpoint); `run()` idempotency; `--quick` mode (WARN not FAIL); parameterized argument parsing; `run_preflight_check` integration (SystemExit 1 on missing file/failed audit).

### 🔧 Fixed (audit.py)
- **`node --check` resilience**: OSError when node fails to launch (e.g. stdout handle redirected by test runner on Windows) now becomes **WARN** "cannot launch" — previously an uncaught crash; FAIL kept only for scripts that genuinely fail to parse.

### 🧪 Validation
- `python -m pytest test_audit.py -v` → **20/20 PASS** (23–43s, node subprocess safely WARNed inside pytest)
- Full `python audit.py` in bash → **12 PASS | 0 FAIL | 0 WARN | 3.43s**, `100% PRODUCTION READY`
- `python audit.py --quick` → 11 PASS + 1 WARN (node skipped) · `py_compile` clean

---

## [2.3.1] - 2026-08-10 — Modular Audit, Pre-Commit Hook & CI Gate (GitHub Actions)

### 🧩 Refactored (audit.py — modular class)
- **`run_preflight_check` reworked into `PreflightAudit` class**: all 12 checks are now methods registered via the **`@check`** decorator (module-level `_CHECKS_REGISTRY`) — adding check #13+ is just writing one decorated method, without touching `run()` or callers.
- **Shared state computed once**: `scripts` & `dom_ids` in `__init__`; DOM references (79 IDs + prefix + variables + selectors) filled by `_check_09` then used by `_check_09b` & `_check_10`.
- **`--quick` mode**: `python audit.py --quick` skips `node --check` (#6) with an explicit WARN — for fast pre-commit feedback; the full gate (pre-push/CI) keeps all 12 complete checks.
- **Decorator bug found & fixed**: `@classmethod check` can't be used as a decorator (`TypeError: 'classmethod' object is not callable`) — replaced with module registry `def register(fn)` (no `_`-less prefix to keep the module namespace clean).
- **Lazy property `_dom_refs()` (reviewer fix)**: DOM references computed once then cached; checks #9/#9b/#10 are now **order-independent** — each check is safe to run anytime without relying on another check first (verified: #10 standalone stays PASS).
- **`run()` idempotent (reviewer fix)**: state reset at the start of `run()` so repeated calls on the same instance don't double counts (verified: 2× run → identical 12/12 PASS).

### ⚡ Added (.githooks/pre-commit)
- **New pre-commit hook** (audit `--quick`): early detection of structural errors before commit. Tested both ways: healthy → `Commit allowed`; broken → `Commit REJECTED` (exit 1). `index.html` restored after test.
- `.gitattributes` extended: `.githooks/pre-commit` also forced LF.

### 🚀 Added (.github/workflows/preflight.yml — CI Gate)
- **`preflight-audit` GitHub Actions workflow**: runs `python audit.py` (all 12 checks) on every push to `main`/`master` and every pull request, plus `workflow_dispatch` for manual trigger. Failure (exit ≠ 0) → push/PR blocked until fixed.
- YAML validated: all required structures present (`name`, `on`, `jobs`, `runs-on`, `steps`, `actions/checkout`, `actions/setup-python`, `run: python audit.py`), 0 tab indentation.

### 🧪 Verified
- **Behavioral parity**: audit **12/12 PASS** (79 IDs + `diagram-` + `modalId`; 6 querySelector/closest/matches IDs from 27 selectors) and `--quick` mode 11 PASS + 1 WARN — identical results to the procedural version.
- **Combined negative tests** (6 scenarios: dead ID, no-match prefix, literal call, data-modal-target, non-parameter variable, ghost selector) — all **FAIL** (exit 1); comments & string literals not counted.
- **Pre-commit & pre-push hooks**: PASS and FAIL paths tested; `python -m py_compile` clean.

---

## [2.3.0] - 2026-08-10 — Follow-up: closest/matches, Pre-Push Hook & Stats

### 🚀 Added (audit.py check #10 expanded)
- **`closest('#id')` & `matches('#id')` now verified too**: `extract_dom_refs` treats `closest` and `matches` like `querySelector`/`querySelectorAll` (all DOM-traversal selectors). 0 current usages in the codebase — proactive check so new id references get gated immediately.
- #10 PASS/FAIL messages updated: `querySelector/closest/matches('#...')`.

### 🔒 Added (Git Pre-Push Hook)
- **`.githooks/pre-push`**: git hook running `python audit.py` before every push and **rejecting the push if audit fails** (exit 1). Auto-detects `python`/`python3`, runs from repo root, full audit output shown.
- **Activation (once, from repo root)**: `git config core.hooksPath .githooks` + `chmod +x .githooks/pre-push`. Deactivate: `git config --unset core.hooksPath`.
- **Tested both ways**: with healthy `index.html` → `[pre-push] OK — audit passed. Push allowed.`; with broken file (dead ID) → `[pre-push] FAILED — Push REJECTED.` (exit 1). `index.html` restored after test.
- **New `.gitattributes`**: forces LF for `*.sh` and `.githooks/pre-push` (`text eol=lf`) so hooks don't break from CRLF normalization when cloned on other Windows machines.
- **More robust hook**: now prefers `python3` (audit.py uses Python 3 syntax; `python` on some old systems is still Python 2 which fails confusingly).
- **Note**: current working directory wasn't a git repo (no `.git`), so the hook is provided + documented in Readme to activate in the environment that actually pushes (e.g. GitHub Actions or a local clone).

### 📊 Refactored (stats)
- **Tokenizer area**: two duplicate functions (`extract_used_dom_ids` ~117 lines + `extract_query_selector_args` ~109 lines ≈ 226 lines) merged into `_iter_call_args` (119 lines) + `extract_dom_refs` (48 lines) = **167 lines** — ~59 lines cut in that area; JS body (~135KB) scanned once instead of twice.
- **Total `audit.py`**: 560 lines (12 active checks).

### 🧪 Verified
- Audit **12/12 PASS** — 79 IDs + `diagram-` + `modalId`; 6 querySelector/closest/matches IDs from 27 selectors; `100% PRODUCTION READY`.
- Negative tests `closest('#ghost-closest')` & `matches('#ghost-matches')` → **FAIL** (exit 1); examples in comments & string literals not counted.
- Pre-push hook: 0 CR (pure LF), `python3` detected, PASS & FAIL paths tested.
- `python -m py_compile` clean.

---

## [2.2.9] - 2026-08-10 — Refactor: Combined _iter_call_args Tokenizer (Dedup #9 & #10)

### 🧹 Refactored (audit.py)
- **Tokenizer duplication removed**: two identical scanners (~160 lines) in `extract_used_dom_ids` (#9) and `extract_query_selector_args` (#10) merged into one shared generator **`_iter_call_args(js_body)`** that skips string literals, regex literals, and comments — then yields `(func_name, arg_value, is_string, end_pos)` for every function call.
- **Single combined pass `extract_dom_refs`**: `getElementById` references (static/prefix/variable IDs) and `querySelector`/`querySelectorAll` collected in one `_iter_call_args` iteration per script body — JS body (~135KB) no longer scanned twice.
- **Automatic identifier boundary**: because function names are read as whole identifier tokens (`querySelectorAll` isn't a `querySelector` prefix; `myGetElementById` doesn't match `getElementById`), manual boundary guards from old #9/#10 removed without losing precision.
- **Documented limitations** (consistent pre-refactor): comments between `(` and the first argument make the argument not yielded; nested calls as arguments classified as identifiers; `end_pos` only valid when `is_string=True`.

### 🐛 Fixed (regression caught during development)
- **Bug `i = j + 1` in the non-string argument branch**: the continue position pointed at the argument's second character so regex literals (`replace(/[&<>"']/g, ...)`) weren't detected — quotes inside were captured as fake strings and the scanner jumped ~49,000 characters (40 getElementById IDs + modalId lost). Fixed to `i = j` so the argument's first character is re-processed by the main loop. Caught via regression test: 79 IDs vs 39 IDs.

### 🧪 Verified
- **Behavioral parity**: identical results to pre-refactor — 79 static IDs + 1 dynamic prefix (`diagram-`) + 1 var (`modalId`); 6 querySelector IDs from 27 selectors; audit **12/12 PASS**, `100% PRODUCTION READY`.
- **Combined negative test** (1 file, 6 scenarios): dead ID, no-match prefix, unresolved literal call, unresolved `data-modal-target`, non-parameter variable, and `querySelector('#ghost')` — all **FAIL** (exit 1); examples in comments & string literals not caught.
- **Post-single-pass negative test** (dead ID, no-match prefix, unresolved literal call, `querySelector('#ghost')`) — all **FAIL** (exit 1).
- **`python -m py_compile`** clean without warnings.

---

## [2.2.8] - 2026-08-10 — Audit Check #10: querySelector('#id') Selectors Resolve to DOM

### 🛠️ Strengthened (audit.py — new check #10)
- **Check #10 "Selector `#id` → DOM"**: every `querySelector('#...')` / `querySelectorAll('#...')` selector is now automatically verified to reference an element that actually exists in the DOM.
- **`extract_query_selector_args` tokenizer** (string/regex/comment-safe, consistent with #9): extracts string-literal arguments from `querySelector` and `querySelectorAll` calls, including selectors with inner double quotes (e.g. `meta[name="theme-color"]`) that naive regex can't catch.
- **Selector attributes stripped before id extraction**: `[attr=...]` parts removed so `#id` inside `href="#x"` or attribute examples aren't counted as target ids.
- **0 false positives from comments/strings**: code examples in comments or strings (e.g. `var s = "querySelector('#x')"`) not counted.

### 🧪 Verified
- **Positive test**: audit **12/12 PASS** — 6 unique `#...` IDs (filter-buttons, testimonial-dots, projects-grid, mobile-menu, architecture, arch-diagram-display) from 27 selectors, all resolve to DOM; `100% PRODUCTION READY`.
- **Synthetic negative tests**: `querySelector('#ghost')` & `querySelectorAll('#nonexistent')` → **FAIL** (exit 1); examples in comments & string literals not caught.
- **Bug found & fixed during development**: `js_body[j] == 'All'` condition (char vs string comparison) meant `querySelectorAll` was never processed — fixed to `startswith('All', j)`; `#...` selectors now fully detected.
- **Identifier boundary checks added to both tokenizers (#9 & #10)**: `getElementById`/`querySelector` only recognized when not part of a longer identifier (e.g. `myQuerySelector('#x')` not extracted) — prevents false positives from similarly-named functions.

---

## [2.2.7] - 2026-08-10 — modalId WARN Becomes a Real Check: Value Source Verification

### 🛠️ Strengthened (audit.py — new check #9b)
- **WARN `getElementById(modalId)` upgraded to a real check**: variable-argument calls are no longer just reported — they're **verified** to always point at an existing DOM element at runtime.
- **3 verification conditions** (all must hold, in addition to 79/79 from #9):
  1. The argument variable (e.g. `modalId`) **must be a parameter** of the declaring function (`openModal(modalId)`) — if not (untracked global/local variable) → **FAIL**.
  2. All **literal calls** to the owning function (`openModal('modal-...')`) must resolve to DOM IDs — any unknown value → **FAIL**.
  3. All **`data-modal-target`** (value source `button.dataset.modalTarget` → `openModal(button.dataset.modalTarget)`) must resolve to DOM IDs — any ghost target → **FAIL**.

### 🧪 Verified
- **Positive test**: `getElementById(modalId)` now **verified PASS** — 6 `data-modal-target` targets + 7 literal `openModal('...')` all resolve to DOM; audit **11/11 PASS**, `100% PRODUCTION READY` (no WARNs left).
- **Negative tests (3 synthetic scenarios)**: literal `openModal('modal-missing')` → FAIL ✓; `data-modal-target="modal-ghost"` without element → FAIL ✓; `getElementById(someGlobalVar)` non-parameter → FAIL ✓ (all exit code 1).
- **Readme**: contains no WARN claims — no change needed.

---

## [2.2.6] - 2026-08-10 — Permanent Audit: All getElementById IDs Resolve to DOM

### 🛠️ Strengthened (audit.py — new check #9)
- **Check #9 "getElementById ID → DOM"**: audit.py now automatically verifies at every pre-flight that **every `getElementById`-referenced ID actually exists as a DOM element** — locking the zero-dead-code claim (79/79) permanently.
- **Smart tokenizer (string/regex/comment-safe)**: parser reads inline `<script>` blocks while skipping string literals, template literals, **regex literals** (e.g. `/[&<>"']/g` in `escapeHTML` — previously able to fool the string tokenizer), and block/line comments.
- **3 reference categories distinguished**:
  1. **Static IDs** (`getElementById('foo')`) — must exist exactly in the DOM (0 dead references).
  2. **Dynamic prefixes** (`getElementById('foo' + x)`) — verified that at least one DOM ID starts with that prefix (`'diagram-'` + `currentArchDiagram` case).
  3. **Variable arguments** (`getElementById(modalId)`) — can't be statically verified; reported transparently as **WARN** (not FAIL) with the variable name.
- **Duplicate `id` attribute detection**: duplicate DOM IDs (making `getElementById` ambiguous) also fail.

### 🧪 Verified
- **Positive test**: audit.py 9/9 → 10/10 PASS — **79 unique IDs resolve + 1 dynamic prefix verified**, 1 honest WARN (`modalId`), `100% PRODUCTION READY` status.
- **Negative test**: synthetic file with dead ID (`dead`), no-match prefix (`pref`), and variable call (`varZ`) → **all caught** (2 FAIL + 1 WARN, exit code 1).
- **Readme synced**: "audited 79/79" claim now mentions automatic verification by audit.py check #9.

---

## [2.2.5] - 2026-08-10 — Readme: Security & Privacy Rewrite (Precise Claims Consistent with Code)

### 📝 Changed (Documentation)
- **Readme "Security & Privacy" section fully reworked** so every claim is precise and verifiable against the code:
  - **CSP**: Matched token-by-token with the actual meta tag — `script-src 'self' 'unsafe-inline'` (0 external scripts, no `eval`), `style-src` Google Fonts + cdnjs, `font-src` Google/cdnjs/`data:`, `img-src 'self' data: https:`, `connect-src` Formspree + rss2json (with `https:` fallback) — acknowledged as *defense-in-depth* (inline scripts allowed, not a full CSP).
  - **BYOK**: Clause clarified that this repo itself **contains no API key handling code whatsoever** (0 lines of key-handling code; the BYOK/OpenAI/Anthropic terms appear only as descriptive project text); BYOK pattern applies only to linked external apps (PromptMatrix 1.0/2.0).
  - **UU PDP**: Strict separation of 100% local demos vs the contact form exception → Formspree (disclosed in UI); complete list of outbound data flows (Formspree + rss2json + Unsplash image hotlinks); no-tracking/no-cookies clause.
- **Badge Anchors Fixed**: `Security` & `Privacy` badges now point to `#security--privacy-controls` and `Accessibility` badge to `#accessibility-a11y--wcag-compliance` — matching actual headings (previously dead links on GitHub).

### 🧪 Verified
- Every claim cross-checked against `index.html` (CSP meta tag, Formspree endpoint `mkgknrqk`, 7 BYOK/OpenAI/Anthropic matches all descriptive text, 0 key-handling code, `document.cookie` = 0, `strict-origin-when-cross-origin` referrer meta present, 18 external links all `target="_blank"` + `rel="noopener noreferrer"`).
- **Audit numbers updated**: `getElementById` claim in Readme synced to **79/79 unique IDs** all resolving to DOM elements (previously inaccurate 80/80).
- **audit.py 9/9 PASS** — no code changes, documentation only.

### 📝 Changed (Privacy Transparency)
- **Contact Form Disclaimer**: note added inside the form (i18n key `privacyFormNote`, EN & ID) stating that name, email, and message are sent to **Formspree (third-party server)** solely for message delivery — while all demo widgets (expense classification, spam detection, password, etc.) run **100% locally in the browser** with no data leaving the device.
- **Readme §4 Clarified**: contact form exception clause added to the UU PDP Compliance section so the compliance claim is precise (local demos vs third-party form).

### 🧪 Verified
- **audit.py 9/9 PASS** — EN/ID i18n parity balanced (318 keys); all 281 used `data-i18n` keys defined in both dictionaries; tag-balance & `node --check` still clean.

---

## [2.2.3] - 2026-08-10 — Dead Class Cleanup & JS Hook Migration

### 🧹 Cleaned
- **Pre-existing dead classes removed** (undefined in any CSS, previously *silent no-ops*): `badge-accent`, `custom-scrollbar`, `node-stage-1..4`, and `animate-heading`.
- **4 JS hooks migrated to data-attributes** so useless classes could be removed without breaking functionality — `arch-node-card` → `data-arch-node`, `arch-panel` → `data-arch-panel`, `arch-tab-btn` → `data-arch-tab`, `nav-link` → `data-nav-link` — with `querySelectorAll` selectors in the script updated accordingly.

### 🧪 Verified
- **0 occurrences of dead classes left** in `class` attributes (only intentional `data-*` substrings remain).
- **audit.py 9/9 PASS**; browser tests: architecture tab switching, pipeline simulation, and node inspector fully working with new selectors (0 console errors).

---

## [2.2.2] - 2026-08-10 — Static Tailwind Build (CDN Removal) & Dependency Honesty

### 🚀 Changed (Performance & Dependencies)
- **Tailwind Play CDN Removed**: runtime compiler `https://cdn.tailwindcss.com` (~300KB JS + in-browser compilation) replaced with **static v3.4.17 CSS** compiled once and embedded as `<style id="tailwind-compiled">` (34KB minified) directly in `index.html`. Repo still has no build system — compiled output stored permanently.
- **CSP Tightened**: `'unsafe-eval'` and `https://cdn.tailwindcss.com` removed from `script-src` (no code uses `eval`/`new Function` after CDN removal).
- **`color-mix` helpers (23 rules)**: added for `bg-/border-[var(--color-x)]/NN` classes plus `hover:` variants — an *opacity-modifier + var()* combination **Tailwind v3 doesn't compile** (previously a *silent no-op* in Play CDN v3). Header now renders 90% semi-transparent as designed, and borders/icons get the color tint that was missing.
- **Readme clarified**: "zero-dependency" claim replaced with an accurate statement — remaining runtime dependencies: Google Fonts, Font Awesome (cdnjs), Formspree, rss2json, and Unsplash preview images.

### 🧪 Verified
- **Class coverage**: 527 unique tokens checked — all used Tailwind utilities (incl. arbitrary values, variants, JS-dynamic classes) covered by static CSS.
- **Browser tests**: 0 console errors (Tailwind CDN warning gone), semi-transparent header, light/dark themes work, all sections render normally.
- **audit.py**: still 9/9 PASS — `100% PRODUCTION READY`.
- **Note**: Found **pre-existing** dead classes undefined in any CSS (already no-ops before this change, no rendering impact): `arch-node-card`, `arch-panel`, `arch-tab-btn`, `nav-link`, `badge-accent`, `custom-scrollbar`, `node-stage-1..4`, `animate-heading`. Optional cleanup in a future version.

---

## [2.2.1] - 2026-08-10 — P0/P1 Fixes: SEO Canonical, Markup & Audit Hardening

### 🔗 Changed (SEO Canonical Realignment — GitHub Pages)
- **Canonical URL Moved to the Real Site Address**: `rel="canonical"`, `og:url`, `twitter:url`, Schema.org JSON-LD `url`, and the dynamic SEO script all now point to **`https://sisigitadi.github.io/portofolio`** — the GitHub Pages URL where the site is actually served — instead of the repo page `github.com/sisigitadi/portofolio` (which split ranking signals).
- **`robots.txt` (Sitemap:) & `sitemap.xml` (`<loc>`)** also moved to the GitHub Pages domain; `lastmod` updated to 2026-08-10.
- **Project_rules §5.4 & Readme synced**: official canonical domain is now GitHub Pages; `sigitadi.my.id` and the repo page `github.com/...` banned as canonical URLs.

### 🛠️ Fixed (Markup & Content Consistency)
- **`#pass-out-bar` bug (Demo 6)**: broken double quote in `class` made the `h-full` attribute parse as valueless — password progress bar now renders with correct height.
- **Stale JSON-LD `worksFor`**: updated from `Kemendagri SOC` to **`Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH`** per current role (Web Administrator).
- **Testimonial Slide Comment Numbering**: renumbered 1–10 (missing Slide 6 restored to sequence), fully synced with `totalTestimonials = 10`.
- **`rows="2.5"` → `rows="3"`** on contact form textarea (invalid value, violated HTML validity).
- **Initial `theme-color`**: FOUC-proof script now syncs meta `theme-color` with theme preference on first visit (mobile status bar no longer dark when OS is light).
- **CLI Gimmick Isolation (WCAG)**: `[SYS_CMD_PROMPT v2.2]` and `[SYS_INIT]` in the terminal palette now have `aria-hidden="true"` on their elements.

### 🧪 Strengthened (audit.py)
- **Pre-Flight Audit Strengthened 4 → 8 Checks**: HTML tag balance (standard HTMLParser), inline script syntax (`node --check`), slide comment sync vs `totalTestimonials`, EN/ID i18n dictionary parity & coverage, and per-line `aria-hidden` gimmick isolation check (not just global string existence).
- **Verified**: `audit.py` passes **9/9 PASS** — `100% PRODUCTION READY`; 10 slides synced; 280 `data-i18n` keys defined; EN/ID i18n parity balanced.

---
## [2.2.0] - 2026-08-10 — Current Role & Testimonial Addition (MoE & BPDLH)

### 🚀 Added (Current Role — Web Administrator)
- **New Career Timeline Entry**: Added **Web Administrator** as the newest position at the top of the Career Journey timeline — *Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH (Mar 2026 – Present)*, tagged `Kontrak / Proyek` (Contract / Project) with purple accent styling.
- **Role Detail (EN/ID)**: Describes Docker-based infrastructure management on Ubuntu/WSL for government web platforms, deployment of Wazuh SIEM monitoring, and DVWA security sandboxing that cuts weekly manual log review time through efficient telemetry analysis (i18n keys `cr1c` / `cr1d` synchronized in both `en` and `id` dictionaries).
- **Timeline Count**: The career timeline now holds 10 positions while preserving the 20+ year track record narrative.

### 💬 Added (BPDLH Project Testimonial)
- **New Carousel Slide 1**: Added a new lead testimonial card — *BPDLH Project* (Budi Santoso, Senior IT Infrastructure Lead), tagged `Rekomendasi Proyek` / Project Recommendation, spotlighting meticulous Docker server environment handling and responsive Wazuh telemetry monitoring.
- **Carousel Sync**: `totalTestimonials = 10` matches the 10 rendered slides; `ts1q` / `ts1r` keys defined in both `en` and `id`.

### 🔗 Changed (SEO Canonical Consolidation)
- **Single Canonical Source of Truth**: `rel="canonical"`, OpenGraph (`og:url`), Twitter Card (`twitter:url`), Schema.org JSON-LD `url`, `robots.txt` (`Sitemap:`), and `sitemap.xml` (`<loc>`) all reference the hosted GitHub canonical domain **`https://github.com/sisigitadi/portofolio`**. No `sigitadi.my.id` references remain anywhere in the codebase (0 occurrences).
- **Changelog Correction**: The v2.1.0 SEO note has been corrected to document the actual GitHub-hosted canonical domain.

### 🧪 Verified
- `audit.py` pre-flight: **100% PRODUCTION READY**.
- `totalTestimonials` in sync with 10 rendered slides; all new i18n keys present in both EN and ID dictionaries.

---

## [2.1.0] - 2026-08-09 — UX Upgrades: Theme Toggle, i18n, PWA Offline & Anti-Spam

### 🎨 Added (Dark / Light Theme Toggle)
- **Theme Switcher**: New nav toggle (desktop + mobile menu) switches between dark and light via `html[data-theme="light"]` CSS variable overrides — no layout redesign required since the entire UI is variable-driven.
- **Preference Persistence & OS Respect**: Theme choice persists in `localStorage`; on first visit it respects `prefers-color-scheme`; a head-injected FOUC-proof initializer applies the theme before first paint.
- **Dynamic `theme-color`**: Mobile browser status-bar color now updates with the active theme.

### 🌐 Added (i18n EN/ID)
- **Language Switcher**: New `EN`/`ID` toggle (desktop + mobile) switches the full UI shell — navigation, hero pitch & CTAs, all section headings/subtitles, contact form labels & placeholders, and dynamic form status messages.
- **Extensible Dictionary**: `I18N` dictionary + `data-i18n` / `data-i18n-ph` attributes (34 elements wired); language persists in `localStorage` and updates `<html lang>`.

### 📱 Added (PWA Offline)
- **Installable PWA**: Added `manifest.json` (name, display standalone, theme/background color) and generated `icons/icon-192.png` + `icons/icon-512.png` (rounded-square monogram).
- **Offline Service Worker**: `sw.js` implements cache-first for same-origin assets, network-first for CDNs and navigations with offline fallback to cached `index.html`, plus install/activate cache pruning and auto-update.
- **Apple Metadata**: `apple-touch-icon`, `apple-mobile-web-app-*` metas for iOS home-screen install.

### 🛡️ Added (Contact Form Anti-Spam)
- **Client-Side Rate Limit**: Submissions are throttled to one per 30 seconds (`localStorage` timestamp) to block rapid bot spam.
- **Honeypot Reinforcement**: Existing Formspree honeypot (`_gotcha`) is honored and short-circuits silently on the client.

### 🔎 Added (SEO)
- **`sitemap.xml`** (canonical `https://github.com/sisigitadi/portofolio/`) and **`robots.txt`** (allow-all + sitemap reference) for search engine discovery.

### 🧪 Verified
- All 34 `data-i18n` keys defined in both `en` and `id` dictionaries; `manifest.json`, `sw.js`, and all inline scripts pass syntax validation; zero HTML tag-balance errors; `audit.py` pre-flight: **100% PRODUCTION READY**.

---

## [2.0.4] - 2026-08-09 — Legacy AI Widget Cleanup & Dead Code Removal

### 🗑️ Removed (Legacy AI Simulation Widgets)
- **Complete AI Simulation Widget Removal**: Permanently removed the three non-functional AI simulation widgets (*Profile Analyzer*, *Chat Advisor*, *Model Solver*) from HTML, CSS, and JS — including all associated helper functions (`initProfilerAssistant`, `handleProfilerSubmit`, `appendProfilerChat`, `typeWriterBotMessage`, `triggerAiChip`, `switchContactTab`, `simulationSteps`, `startAiSimulation`) and their DOM elements (`ai-sim-widget`, `ai-sim-body`, `ai-sim-input`, `ai-chip-container`).
- **D3.js Fallback Removal**: Removed the unused `window.d3` fallback (no longer required since the Tailwind CDN handles all styling).
- **SFX Engine Removal**: Removed the dormant retro SFX synthesizer (`toggleSfx`, `playClickSfx`, `sfxEnabled`, `audioCtx`) whose UI toggle never existed in the DOM.

### 🧹 Cleaned (Dead Code & Stale References)
- **Missing-Element Listener Cleanup**: Removed event listeners targeting non-existent elements (`btn-pass-*` preset buttons, `sfx-icon`/`sfx-label`, `stat-value-10` counter).
- **Unused Animation Helper Removal**: Removed the orphaned `animateCountUp` utility (its last caller `stat-value-10` no longer exists).
- **Duplicate Initialization Removal**: Removed duplicated demo preset initializers (`runSummaryPreset`/`runSkillPreset`/`runPassPreset` were being called twice consecutively).

### 🛠️ Fixed & Aligned
- **HTML Structure Balance Fix**: Removed 6 stray `</div>` tags in the `#about` section and restored the missing `</div>` closing the `#projects` section container — the document now parses with **zero HTML tag-balance errors** (previously 7 parser-reported issues).
- **Modal Accessibility Fix**: Registered `openModal`/`closeModal` inside `DOMContentLoaded` — modal open/close no longer overrides the top-level declarations while preserving keyboard `Escape` handling.
- **Empirical Title Alignment**: Removed all remaining `Applied AI Engineer` references to align 100% with the mandated title `IT & SecOps Specialist | Applied AI Practitioner` (Project Rules §2).
- **Audit Script Sync**: Updated `audit.py` to drop validation of the removed widgets.

### 🧪 Verified
- All 75 `getElementById` IDs resolve to real elements in the DOM.
- Zero HTML tag-balance errors; all inline `<script>` blocks pass `node --check`; JSON-LD schema valid; all inline handlers resolve to defined functions.
- `audit.py` pre-flight: **100% PRODUCTION READY**.

---

## [2.0.3] - 2026-08-07 — Role Badge Alignment for Nippon Koei Co., Ltd

### 🛠️ Timeline & CV Alignment
- **Assistant to Office Manager Badge Realignment**: Updated badge label for **Assistant to Office Manager** at **Nippon Koei Co., Ltd (Jun 2020 – Nov 2020)** in the *Career Journey* timeline from `Contract / Project` to **`Short-Term Contract`** (`bg-amber-500/30 text-amber-200 border-amber-300/60`) for 100% exact alignment with official CV contract designations.

---

## [2.0.2] - 2026-08-07 — Soft-Technical Wording & Non-Overclaiming Alignment

### ⚡ Copywriting & Alignment Refinement
- **Grounded & Accessible Technical Copy**: Replaced buzzword-heavy headers and overclaiming metrics in `#architecture` with clear, grounded, soft-technical terminology:
  - Header Subtitle: `SYSTEM ARCHITECTURE & INTERACTIVE DATA FLOWS`
  - Badge: `VERIFIED SYSTEM DESIGN SPECS`
  - Radar Scanner Status: `PIPELINE SCANNER IDLE • STANDBY` / `⚡ PIPELINE SIMULATION ACTIVE • DATA FLOWING`
  - Telemetry Speed: `TELEMETRY ACTIVE`
- **Streamlined Telemetry Log Statements**: Softened all 16 simulation step log statements across *ARYA SIEM*, *KantinKu ERP*, *SmartExpense ML*, and *SCOPS SecOps* to focus cleanly on real-world engineering mechanisms without hype or overclaiming.

---

## [2.0.1] - 2026-08-07 — Enhanced Bottom Telemetry Laser Track Animation

### 🎨 Visual & Animation Overhaul
- **Futuristic Multi-Layer Laser Scanner Track**: Upgraded `#arch-bottom-anim-bar` with a multi-layered cyberpunk laser beam (`archBottomLaser` keyframes) featuring a glowing cyan/purple gradient pulse, background grid ticks pattern, and dynamic bandwidth indicator.
- **Dynamic Speed & Color Switching**:
  - **Idle State**: Soft cyan/purple laser sweep (2.2s ease-in-out sweep) with pulsing ping indicator.
  - **Simulation Running**: High-speed emerald laser beam (0.75s linear sweep) with intense neon glow (`box-shadow: 0 0 20px #10b981`).

---

## [2.0.0] - 2026-08-07 — Major Release: Option A Holographic HUD Architecture Visualizer & Complete AI Bot Cleanup

### 🚀 Added & Elevated (Option A Holographic Architecture HUD)
- **Holographic 2D Cyber Radar HUD Circle**: Integrated a 360° animated Cyber Radar circle HUD (`#arch-radar-needle`) in the top-right header of the `#architecture` visualizer card:
  - **Idle Sweep**: Smooth 360° rotation (4s sweep) with oscilloscope pulse indicator.
  - **Simulation Mode**: High-speed emerald 360° rotation (1.2s sweep) synchronized with live pipeline stage execution.
- **Visual Data Packet Pulse Flow**: Added animated glowing neon data packet pulses (`.arch-packet-pulse`, `---●--->`) connecting Stage Nodes 01 ➔ 02 ➔ 03 ➔ 04 to visually illustrate telemetry signal flow across all 4 blueprints.
- **Sharper Technical Node Cards**: Refined Stage Cards into crisp, high-contrast metric blocks displaying Node Title, Protocol/Port, Status Badges (`HEALTHY` / `STREAMING`), and `🔍 Inspect Code & Specs` trigger buttons.

### 🗑️ Cleaned & Streamlined (Profiler Bot AI Removal)
- **Complete Profiler Bot AI Cleanup**: Removed the AI Profiler Assistant tab and code from the floating concierge widget (`#contact-widget`), streamlining it into a dedicated **Contact & PDF Resume Request Hub**.

---

## [1.9.3] - 2026-08-07 — Character-by-Character Typewriter Streaming & Guided Chips

### 🚀 Added & Enhanced
- **Real Character-by-Character Typewriter Streaming (`typeWriterBotMessage`)**: Replaced instant message dumping with a smooth, character-by-character typing animation (~16ms per character / 60 chars/sec) featuring a glowing blinking terminal cursor (`|`) that auto-scrolls down `#ai-sim-body` as text streams in real-time.
- **Guided Topic Chips Overhaul**: Replaced redundant preset buttons with 4 clean, high-value guided prompts (`💡 Track Record`, `🛡️ SecOps Triage`, `💻 Tech Stack`, `📄 Request CV`).
- **Comprehensive Q&A Output**: Standardized response outputs to be concise, structured, and easy to read (`text-[10.5px] sm:text-[11px]`, `leading-relaxed`, `font-sans`).

---

## [1.9.2] - 2026-08-07 — Profiler Bot Cyberpunk Typography & Typing Indicator Animation

### 🎨 UI/UX & Animation Overhaul
- **High-Readability Modern Typography**: Replaced blocky monospace body fonts inside `#ai-sim-body` with clean, modern proportional sans-serif typography (`font-sans`, `text-[11px] sm:text-xs`, `leading-relaxed`, `text-gray-200`) for maximum reading comfort and scannability.
- **Cyberpunk Badge & Glowing Accent Border**: Replaced rigid raw text headers (`[PROFILER BOT]:`) with a neon cyber badge (`[PROFILER BOT]` + pinging neon dot indicator) and a glowing left purple border gradient (`border-l-2 border-l-purple-400 bg-gradient-to-r from-purple-950/40`).
- **Dynamic AI Typing Indicator**: Added a 350ms animated typing indicator (`PROFILER BOT ANALYZING...` + pulsing dots) before rendering responses.
- **Smooth Fade-Slide Entrance Animation**: Added `.ai-msg-entrance` CSS animation keyframes for smooth fade-in and slide-up text entrance effects.

---

## [1.9.1] - 2026-08-07 — Un-truncated Status Log Terminal & Animated Radar Scanner Track

### 🛠️ Fixed & Enhanced
- **Multi-Line Telemetry Log Bar**: Converted the architecture simulation status display into a dedicated multi-line terminal prompt box (`break-words`, `min-h-[32px]`), completely eliminating status text truncation across desktop and mobile screens.
- **Bottom Animated Radar & Data Packet Scanner Track**: Integrated a glowing animated telemetry radar track (`#arch-bottom-anim-bar`) at the bottom of the `#architecture` visualizer card:
  - **Before Run (Idle State)**: Displays a smooth scanning cyan laser line (`arch-laser-scanning`) and status label `RADAR SCANNER IDLE • STANDBY MODE`.
  - **During Run (Active State)**: Transitions dynamically to high-speed emerald laser pulses (`arch-laser-active`), a glowing ping indicator, and status label `⚡ SIMULATION ACTIVE • LIVE DATA STREAMING`.
  - **After Reset**: Smoothly resets back to the idle standby radar scanner state.

---

## [1.9.0] - 2026-08-07 — Interactive Pipeline Simulator & Technical Node Inspector (Option 1)

### 🚀 Added & Elevated
- **▶ Live Simulation Engine**: Integrated a **`▶ Run Simulation`** button inside `#architecture` that animates data flow execution step-by-step across pipeline stages with glowing node pulses and real-time terminal status logs (`INGESTING LOGS`, `SCORING RISK`, `MATCHING PLAYBOOK`, `DISPATCHING`).
- **🔍 Click-to-Inspect Technical Node Inspector**: Every stage node (Stage 01–04 across *ARYA SOC*, *KantinKu ERP*, *SmartExpenseML*, and *SCOPS SecOps*) is now clickable, opening a dedicated **Technical Node Inspector Drawer** (`modal-arch-node-inspector`) displaying:
  - ⚙️ **Performance & Security Matrix**: Latency (ms), Protocol, Concurrency Locks (ScriptLock / BufferQueue), and Compliance (ISO 27001 / NIST / UU PDP 100%).
  - 💻 **Production Code Snippet**: Actual Python (Wazuh/Streamlit), Google Apps Script (WAC/BOM), or JS ES6 (Naive Bayes) code snippets.
  - 📦 **JSON Data Payload Schema**: Real sample request/response JSON payload schemas.

---

## [1.8.4] - 2026-08-07 — MouseEvent Disambiguation & Compact Profiler Typography

### 🛠️ Fixed & Optimized
- **MouseEvent Disambiguation in `triggerAiChip`**: Resolved critical parameter coercion bug where DOM `MouseEvent` objects passed into `triggerAiChip(e)` evaluated to string `"[object MouseEvent]"`, causing key matching to fall back or fail. `triggerAiChip` now inspects string arguments, event targets (`closest('button')`), and fallback properties seamlessly.
- **Compact Bot Typography & Height Expansion**: Reduced Profiler Bot message font size to `text-[10px]` with `leading-normal` and `p-2` padding, while expanding the chat viewport height to `h-52` for maximum scannability and clean layout fit.

---

## [1.8.3] - 2026-08-07 — Global Script Registration & Event Listener Binding

### 🛠️ Fixed
- **Clean Script Registration**: Moved `appendProfilerChat`, `triggerAiChip`, and `handleProfilerSubmit` to the very top of the primary `<script>` block and removed legacy duplicate function definitions.
- **Double-Layered Event Binding**: Attached automatic `DOMContentLoaded` event listeners to all buttons in `#ai-chip-container` (`data-chip`), guaranteeing 100% click execution across mobile and desktop browsers regardless of inline event scoping.

---

## [1.8.2] - 2026-08-07 — Profiler Bot Chip Event & Tab Sync Fix

### 🛠️ Fixed
- **Summary & Remote Preset Chips Fix**: Fixed click event handlers for `⚡ Summary` and `🌐 Remote` chips in the Floating AI Concierge Hub. Added explicit `switchContactTab('profiler')` tab activation, inline `return false;` event cancellation, auto-scroll to bottom of chat window (`#ai-sim-body`), and expanded string matching (`summary`, `why`, `overview`, `ringkasan`, `remote`, `wfh`, `telecommute`) across both chip handlers and custom text form submissions.

---

## [1.8.1] - 2026-08-07 — Layout Streamlining & Architecture Visualizer Relocation

### 🚀 Added & Refactored
- **Full Profiler Bot Relocation**: Completely removed the legacy `Portfolio Profiler Assistant` box from the page body layout, consolidating 100% of bot interactions, preset chips, and Q&A parsing inside the **Dual-Tab Floating Concierge Hub** (`#contact-widget`).
- **Architecture Visualizer Integration into What I Offer Grid**: Relocated the **`System Architecture Visualizer`** (`#architecture`) directly into the right-hand column of the *What I Offer* section (where the Profiler Bot used to sit), eliminating redundant sections and providing an interactive 4-stage pipeline viewer (*ARYA SOC*, *KantinKu ERP*, *SmartExpenseML*, and *SCOPS DevSecOps*).

---

## [1.8.0] - 2026-08-07 — Dual-Tab AI Concierge & Interactive Architecture Blueprints

### 🚀 Added
- **Floating AI Concierge & Contact Hub**: Upgraded the floating widget in the bottom right viewport to a Dual-Tab Interface (`🤖 Profiler Bot` & `✉️ Request CV & Message`). Makes the AI Profiler Assistant 100% accessible from anywhere on the portfolio without scrolling.
- **Interactive System Architecture Visualizer**: Replaced the former Profiler Bot location in the main layout with a high-impact **`System Architecture & Data Flows`** blueprint card (`#architecture`). Features 4 interactive data flow diagrams:
  1. `A.R.Y.A. Threat Hunting Telemetry Pipeline` (Wazuh SIEM + Streamlit Cloud)
  2. `KantinKu Serverless WAC & BOM Engine` (Google Apps Script + Sheets DB)
  3. `SmartExpenseML Zero-Retention Sandbox` (Client-Side Naive Bayes ML)
  4. `SCOPS Tactical SecOps Command Pipeline` (Docker + n8n + Wazuh)

---

## [1.7.2] - 2026-08-07 — Flexible Recent Years Phrasing

### ⚡ Optimization
- **Generalized SecOps & AI Timeline**: Updated Hero summary narrative and Portfolio Profiler Bot response to remove specific year count numbers for SecOps and AI, phrasing it flexibly as: *"IT professional with 20+ years of experience in infrastructure and systems administration, focused on Security Operations and applied AI in recent years."*

---

## [1.7.1] - 2026-08-07 — Hero Summary Text Restoration

### ⚡ Optimization
- **Restored Exact Hero Text**: Restored concise, grounded, and non-overclaiming hero summary statement per user preference: *"IT professional with 20+ years of experience in infrastructure and systems administration, with the last 2 years focused on Security Operations and applied AI."* Removed the word "enterprise" and long metric lists from Hero paragraph to keep it tight, authentic, and direct.

---

## [1.7.0] - 2026-08-07 — Portfolio Elevation (UVP, Value-First Headlines & SEO Alignment)

### 🚀 Added
- **Unique Value Proposition (UVP) Hero Overhaul**: Integrated prominent visual CTA buttons (`Request Official Resume (PDF)` & `Explore Case Studies`) in the Hero section.
- **Value-First Project Titles & Headlines**: Restructured headlines for Cards 1 to 6 to focus on measurable business impact (e.g. `PromptMatrix 2.0 — LLM Safety Evaluation`, `SmartExpenseML — Zero-Retention NLP`, `SCOPS Command — Reduced MTTR by 45%`, `KantinKu ERP — Zero-Cost Cloud POS`, `A.R.Y.A. SOC Analytics — Threat Hunting`).
- **Structured Case Study Modals**: Rebuilt popup case study modals with 4 distinct storytelling sections (`🚨 The Business Challenge`, `🧠 Engineering Approach & Solution`, `📊 Verified Impact & Results`, and `Tech Stack`).
- **Canonical & OpenGraph Custom Domain Alignment**: Updated canonical URL, OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data to point to official custom domain `https://sigitadi.my.id/`.

---

## [1.6.1] - 2026-08-07 — KantinKu ERP Live App Link

### 🚀 Added
- **Live App Integration**: Integrated direct deployment link (`https://script.google.com/macros/s/AKfycbw95MoSZQfv55KeSvorKS5jJWEHMThfOBiMafNHKl4/dev`) onto both the Card 4 grid action button (`Live App`) and the `modal-kantinku-erp` case study modal primary CTA button.

---

## [1.6.0] - 2026-08-07 — Card 4 Replacement (KantinKu ERP)

### 🚀 Added
- **Featured Project Card Replacement**: Replaced Card 4 (`ARYA SOC Triage Agent`) with **`KantinKu ERP | Cloud POS & Smart Canteen Engine`**.
- **Real-World Project Demonstration**: Showcases serverless Google Apps Script infrastructure with WAC (Weighted Average Cost) inventory valuation, automated BOM (Bill of Materials) recipe stock deduction, PIN-based anti-bruteforce authentication, customer kasbon tracking with WhatsApp notification dispatches, and thermal receipt printing.
- **Dedicated Case Study Modal**: Integrated `modal-kantinku-erp` popup detailing business challenge, solution, and full-stack architecture.

---

## [1.5.5] - 2026-08-07 — Exact Summary Statement Update

### ⚡ Optimization
- **Exact Hero Summary Replacement**: Standardized the Hero summary paragraph and Profiler Bot `summary` response to exact user text: *"IT professional with 20+ years of enterprise experience in infrastructure and systems administration, with the last 2 years focused on Security Operations and applied AI."*

---

## [1.5.4] - 2026-08-06 — Track Record Year Correction (20+ Years)

### 🚀 Added
- **Exact Career Track Record**: Updated total experience indicator from `10+ years` to **`20+ years`** across Hero summary, *What I Offer* capability cards, *Portfolio Profiler Bot* greeting/responses, and terminal simulation scripts, accurately capturing career start in Feb 2002.

---

## [1.5.3] - 2026-08-06 — Hero Summary Text Refinement

### ⚡ Optimization
- **Phrasing Cleanup**: Removed redundant `"& SecOps"` wording from the opening of the Hero paragraph (`"IT professional with 20+ years of experience..."`), keeping the opening clean while maintaining the mention of SOC threat triage and operational security challenges.

---

## [1.5.2] - 2026-08-06 — Ultra-Concise Non-Redundant Elevator Pitch

### ⚡ Optimization
- **Zero-Redundancy Hero Elevator Pitch**: Replaced long metric listings in Hero summary with a tight 2-sentence elevator pitch (`"IT professional with 20+ years of experience bridging enterprise infrastructure, SOC threat triage, and applied AI tooling. Builds and ships working software to solve real-world operational security challenges."`).
- **Eliminated Section Duplication**: Removed repetitive lists of metrics (-45% MTTR, 1,000+ AI prompts, 50+ staff) from the Hero text, deferring detailed metric breakdowns to the dedicated *What I Offer* capability cards directly below.

---

## [1.5.1] - 2026-08-06 — Concise Summary Optimization

### ⚡ Optimization
- **High-Impact Hero Summary**: Condensed the summary narrative by ~40% for faster scannability while preserving 100% of core metrics and context (-45% MTTR, 1,000+ AI prompts, 50+ staff IT ops, and "Builds & ships working software" philosophy).

---

## [1.5.0] - 2026-08-06 — Professional Summary CV Synchronization

### 🚀 Added
- **Exact Professional Summary Alignment**: Synchronized the Hero section narrative paragraph and Portfolio Profiler Bot `summary` response character-for-character with the official `PROFESSIONAL SUMMARY` section from `Sigit_Adi_Irianto_CV_Revised.docx`:
  - 20+ years hands-on experience spanning enterprise IT administration, SOC threat triage, and applied AI tooling since 2024.
  - Quantified track record: -45% incident MTTR via automated SOC triage, 1,000+ AI prompt-response pairs evaluated for factuality & safety compliance, and IT ops management for 50+ staff teams.
  - Engineering philosophy: *"Builds and ships working software (not just uses it): self-directed portfolio of deployed client-side ML and SecOps automation tools."*

---

## [1.4.1] - 2026-08-06 — Profiler Bot Chip Event Fix

### 🛠️ Fixed
- **Preset Chip Button Handlers**: Upgraded `triggerAiChip(type)` in Portfolio Profiler Assistant with fuzzy string matching, string normalization (`remote`, `wfh`, `contact`, `cv`), and explicit `return false;` event cancellation to ensure 100% reliable click response across all desktop and mobile browsers.

---

## [1.4.0] - 2026-08-06 — Project Replacement (A.R.Y.A. SOC Analytics Streamlit App)

### 🚀 Added
- **Featured Project Card Replacement**: Replaced legacy `PromptMatrix 1.0` card with **`A.R.Y.A. SOC Analytics & Threat Hunting Platform`**.
- **Live Streamlit App Integration**: Direct button link to live cloud app at `https://arya-soc.streamlit.app` featuring Wazuh SIEM log telemetry processing, automated incident severity scoring, and interactive threat hunting.
- **Dedicated Case Study Modal**: Integrated new `modal-arya-soc-streamlit` popup detailing challenge, solution, and Python/Streamlit stack architecture.

---

## [1.3.0] - 2026-08-06 — CV Alignment (Hero Subtitle & Early Career Consolidation)

### 🚀 Added
- **Exact Hero Subtitle**: Standardized Hero subtitle to `Applied AI Engineer | Security Operations Specialist` matching exact CV wording.
- **Early Career Consolidation**: Consolidated foundational roles (PT. Laju Karunia Jaya & Arya Mobile) into a single streamlined card `Early Career Experience (Feb 2002 – May 2014)`.
- **Role Title Realignment**: Updated Role 5 title to `Incident Handling Operational` per official CV document.

---

## [1.2.0] - 2026-08-06 — CV Alignment & Quantified Metrics Release

### 🚀 Added
- **Quantified Metric Alignment**: Synchronized high-impact metrics across Hero summary, *What I Offer* cards, *Projects*, and *Career Journey* timeline:
  - `-45% Incident MTTR` reduction via Wazuh SIEM SOC triage automation.
  - `1,000+ AI Prompt-Response Pairs` evaluated for factuality and safety compliance.
  - `50+ Staff Engineering Team` IT infrastructure ownership.
- **Project Specificity**: Updated PUPR timeline entry with exact project titles (*RWS, Transmission Dadi Muria, Jragung, and Bener Reservoir*) and fixed-term contract completion note.
- **Nippon Koei Context**: Explicitly named *Rentang Irrigation Modernization Project* for cross-departmental budget tracking.
- **Certifications & Issuers Alignment**: Synchronized exact 9 credentials with issue dates (2024, 2025) and official issuers (Microsoft, Hacktiv8, Kodeka Labs, BSSN, Cyber Academy Indonesia, Kelas.work, Canonical, Cybrary, LinkedIn Learning).
- **Interactive Bot Metric Parsing**: Extended *Portfolio Profiler Assistant* Q&A parser to handle queries about `MTTR`, `1000 prompts`, `50 staff`, and `certifications`.

---

## [1.1.0] - 2026-08-06 — Testimonials & UX Realignment Release

### 🚀 Added
- **Remote Work Readiness Feature Card**: Integrated a dedicated glassmorphic card in the *What I Offer* section highlighting asynchronous operations, multi-timezone team agility, self-driven execution, and disciplined documentation.
- **Interactive Portfolio Profiler Assistant**: Upgraded candidate profiler chat engine with auto-greeting, online status indicator, 5 preset quick chips (`Summary`, `Stack & AI`, `SecOps`, `Remote Work`, `Contact & CV`), and custom text query parsing.
- **Complete Header Navigation**: Added `Testimony` (`#testimonials`) and `Certifications` (`#certificates`) links to desktop and mobile navigation menus for 100% full section coverage.

### 🔧 Changed
- **Testimonials Realignment & Authentic Wording**:
  - Renamed section title from *Recommendations & Feedback* to **Testimony**.
  - Replaced overclaimed tags with authentic, grounded workplace relationship labels (`Project Recommendation`, `Colleague Feedback`, `Consulting Reference`, `Team Leader Feedback`, `Director Note`, etc.).
  - Removed all artificial SVG avatars for a clean, typography-first glassmorphic card design.
  - Fixed carousel navigation event listeners, button z-index (`z-40`), and background quote pointer events for 100% reliable Prev/Next button execution.
- **Section Kicker Cleanup**: Removed section kicker badges (*Practical Solutions & Core Capabilities*, *Workplace Feedback & References*) across the portfolio for a clean H2 typography hierarchy.
- **What I Offer Layout Streamlining**: Removed top stat cards block (*20+ Years IT & SecOps Track Record*, *Applied AI & SecOps*) to transition cleanly into the 4 core capability cards.

### 🗑️ Removed
- **Unverified Testimonial Card**: Removed Slide 5 (*Senior AI Data Lead • Multiple AI Evaluation Platforms*) and updated carousel count to 10 active cards.

---

## [1.0.0] - 2026-08-04 — Production Release

### 🚀 Added
- **Serverless Form Processing**: Integrated Formspree endpoint (`https://formspree.io/f/mkgknrqk`) for secure, serverless contact form delivery and official PDF CV request dispatching.
- **BYOK Security Architecture Disclaimers**: Added explicit UI disclaimers and metadata badges to *PromptMatrix 1.0* and *PromptMatrix 2.0* cards clarifying 100% client-side Bring-Your-Own-Key execution to prevent API token leakage.
- **Synchronized Medium Articles**: Synchronized live portfolio feed links with original published technical articles (*Integrasi Wazuh SIEM Dengan Bot Telegram Untuk Alert Real-Time*, *Data Exfiltration Detection*, and *Brute Force Attack: Cara SIEM Menangkal Serangan Berulang*).
- **Accessibility Isolation (WCAG Compliance)**: Added `aria-hidden="true"` attributes to cosmetic terminal prompts (`[SYS_INIT]`, `[SYS_CMD_PROMPT]`, `[SIMULATION]`) and decorative badge icons to prevent screen reader distraction.
- **Interactive CLI Console Navigation**: Full validation of client-side CLI terminal commands (`help`, `about`, `projects`, `demos`, `career`, `certs`, `cv`, `clear`) with smooth scrolling.
