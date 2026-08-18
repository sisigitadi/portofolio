# 📐 Enterprise Technical Rules & Repository Mandates

This document establishes the mandatory engineering standards, security protocols, and copywriting rules governing the **Sigit Adi Irianto Portfolio SPA** codebase.

---

## 🔒 1. Security & Credentials Mandate

1. **NO API KEY EXPOSURE**: Never hardcode, commit, or log third-party API keys (OpenAI, Gemini, Azure, Anthropic) in client-side HTML, CSS, or JS files.
2. **BRING-YOUR-OWN-KEY (BYOK) PATTERN**: All AI evaluation tools requiring API calls must request keys dynamically from the user and store them strictly in transient client memory.
3. **SECURE EXTERNAL LINKS**: Every `<a>` element referencing an external domain must specify `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnabbing vulnerabilities.
4. **SERVERLESS FORM SUBMISSION**: Contact forms must submit exclusively through secure HTTPS POST endpoints (`https://formspree.io/f/...`) without backend server dependencies.
5. **INDEXNOW KEY IS PUBLIC BY DESIGN (EXCEPTION TO RULE 1)**: The IndexNow key file (`{KEY}.txt` at repo root, content = key) is an ownership-verification token that **must be publicly reachable** on the deployed site per the IndexNow protocol — it is not a third-party API key. Keep it committed & deployed; never treat it as a secret or gitignore it. The ping script is `indexnow-ping.py`, triggered automatically by `.github/workflows/indexnow.yml` on push to `main` (waits for Pages redeploy via sha256 comparison before pinging).
6. **CONNECT/IMG-SRC RESTRICTED (v2.6.1)**: the `connect-src` directive in the `index.html` CSP meta must not use the `https:` wildcard — only origins actually used are allowed (currently `https://formspree.io` + the visitor worker `https://portofolio-visitor-tracker.si-sigitadi.workers.dev`); `img-src` is restricted to `'self' data:` + the visitor worker. Adding a new origin to the page (fetch, beacon, script) MUST register that origin in the relevant CSP directive — otherwise the request is blocked.
7. **CSP SCRIPT-SRC HASH MANDATE (v2.6.1)**: `script-src` must not use `'unsafe-inline'` — every inline `<script>` is allowed only via its exact `sha256-...` hash. **If an inline script changes (content, formatting, or order), the hash MUST be recalculated** (hash the script content exactly as-is, e.g. via `node -e` + `crypto.createHash('sha256')`) and updated in the CSP meta — otherwise CSP blocks the script and the page silently breaks.
8. **CI ACTIONS SHA-PINNED (v2.6.1)**: every `uses:` in `.github/workflows/` MUST use a full commit SHA (40 chars) + a tag-version comment (e.g. `# v5.1.0`) — major tags (`@v5`) are forbidden because they can move silently (supply-chain). Upgrading an action = intentionally changing the SHA + updating the comment.
9. **WORKER VISITOR — SECRETS & GUARD INVARIANTS (v2.6.2)**: `DASHBOARD_KEY` and `IP_HASH_SALT` are Cloudflare Worker secrets (`worker-visitor/`), set **only** via `npx wrangler secret put` (use `printf '%s'` without a trailing newline — `echo` adds a newline and makes the constant-time `safeEqual` comparison reject the key). **Using a `[vars]` block in `wrangler.toml` for either is forbidden** — a `[vars]` value with the same name **overwrites the secret** at deploy time (confirmed on first deploy). Worker security invariants that must be preserved: (a) **fail-closed `IP_HASH_SALT`** — `recordVisit()` refuses to record a visit (HTTP 500, no insert) when the salt is missing/placeholder `CHANGE_ME_*`; returning a constant fallback salt like `'salt'` is forbidden (the hash becomes guessable & identical across deploys, defeating UU PDP anonymization); (b) **`POST /hit` 10 KB body guard** — `readJsonBody()` rejects larger payloads (HTTP 413 `payload_too_large`) via `Content-Length` or chunked stream; (c) **`Referrer-Policy: no-referrer`** on all dashboard/login HTML responses (their URLs carry `?key=…`). Every `worker-visitor/worker.js` change MUST pass `node --test worker-visitor/worker.test.js` (26 route tests — the third preflight CI gate alongside audit 14 & pytest 67).
10. **WORKER VISITOR — DEPLOY IS A SEPARATE STEP (v2.7.14)**: committing/pushing `worker-visitor/worker.js` to `main` does **NOT** update the live worker — Cloudflare Workers are deployed independently of GitHub Pages. After any worker code change, run `npx wrangler deploy` from `worker-visitor/` (worker name `portofolio-visitor-tracker`); the deployed version lags the repo until then. Incident that established this rule: v2.7.12/2.7.13 (map removal + 2×2 dashboard grid) showed no effect on the live dashboard until the worker was redeployed. Secrets (`DASHBOARD_KEY`, `IP_HASH_SALT`) survive redeploys — there is intentionally no `[vars]` block in `wrangler.toml` (see rule 9).

---

## 🏛️ 2. Architectural Honesty & Copywriting Standards

1. **NO MISLEADING AI BUZZWORDS**: Never use terms like "Artificial Intelligence", "Smart LLM", or "AI Magic" to describe features implemented using basic mathematics, regular expressions, or array matching algorithms.
   - *Naive Bayes NLP + Regex*: Describe explicitly as NLP text classification and Regular Expression parsing.
   - *Extractive Summarization*: Describe as word-frequency statistical extraction.
   - *Skill Matching*: Describe as heuristic array matching.
   - *Password Strength*: Describe as mathematical entropy calculation.
2. **EMPIRICAL PROFESSIONAL TITLES**: Maintain the empirical title `IT & SecOps Specialist | Applied AI Engineer` across headers, bio narratives, JSON-LD, and manifest.json. This matches the owner's CV wording exactly ("Applied AI Engineer" was the original hero title; it was briefly renamed to "Applied AI Practitioner" in v2.0.4, then restored in v2.5.5 per owner decision for CV alignment & better SEO). Do not use unanchored titles like "Applied AI Practitioner" or invented variants.
   - **SERP-safe meta title (v2.5.15)**: the `<title>` + `meta name="title"` + `itemprop="name"` + `og:title` + `twitter:title` use the compact variant `Sigit Adi Irianto | IT & SecOps | Applied AI Engineer` (53 chars) — Bing/Google truncate titles past ~60-65 chars, so the long empirical title is reserved for on-page content & structured data where length is not truncated. Re-introducing `| Tangerang, Indonesia` or the full title into the meta `<title>` is prohibited unless the total stays ≤ 65 chars.
3. **NON-MILITARY LANGUAGE**: Do not use the word "veteran". Use professional alternatives such as `"experienced IT & SecOps specialist"` or `"seasoned IT infrastructure manager"`.

---

## ♿ 3. Web Accessibility (a11y) & WCAG Standards

1. **COSMETIC GIMMICK ISOLATION**: All decorative or cosmetic CLI elements (e.g., `[SYS_INIT]`, `[SYS_CMD_PROMPT]`, `[SIMULATION]` headers) MUST include `aria-hidden="true"` so screen readers ignore cosmetic syntax.
2. **DYNAMIC LIVE REGIONS**: Interactive widgets outputting dynamic content must be wrapped with `aria-live="polite"` to ensure clean assistive audio announcements.
3. **TOUCH TARGET COMPLIANCE**: Interactive buttons must maintain a minimum touch target size of 44px (`min-height: 2.75rem`), with explicit `type="button"` and `touch-action: manipulation`.
4. **HORIZONTAL OVERFLOW GUARD (v2.6.1)**: `html, body { overflow-x: hidden }` is required; inherently wide content (tables, code blocks) on narrow viewports MUST be wrapped in a horizontal scroll wrapper (`.table-scroll` with `overflow-x: auto` + `-webkit-overflow-scrolling: touch`) — do not let columns get clipped by `overflow: hidden` without scroll access (case: the certification table on the Galaxy Fold outer 280px, fixed in v2.6.1).

---

## 🛠️ 4. Single-Page Application (SPA) Architectural Integrity

1. **SINGLE-FILE INTEGRITY**: The primary application resides in `index.html`. Do not introduce node build tools, Webpack, or bundlers without explicit architectural authorization.
2. **EXPLORATION WORKSPACES ARE OUTSIDE THE PRODUCTION GATE (v2.6.0)**: `design-previews/` (5 static HTML concepts — `index.html` gallery + `0N-*.html`) and `design-lab/` (React + Vite + r3f workshop, 10 3D concepts) are design exploration areas that are **not** audited by `audit.py`/pytest/Lighthouse and are **not** part of the production SPA until a chosen direction is implemented into `index.html`. Do not copy a concept into production without passing the gate: audit 14 PASS, pytest 67/67, Lighthouse a11y/BP/SEO 100, `rel="noopener noreferrer"` on all external links, and balanced EN/ID i18n (required only for bilingual pages).
3. **FEATURE-CONDITIONAL AUDIT (v2.6.1)**: SPA-specific checks in `audit.py` (CLI gimmick #4, testimonial carousel #7, i18n dictionary #8, variable `getElementById` call #9b) pass as "not applicable" when the feature is absent from the page — so the gate works with both the legacy SPA and the single-language Field Manual as the new `index.html`. Two new mandatory checks: **#11 SEO meta** (title ≤ 65 chars, description ≤ 160 chars, robots `index`, canonical, OG, Twitter) and **#12 valid JSON-LD structured data** (`Person` + `WebSite` types required).
4. **WEBSITE FONT PRODUCTION (v2.6.0)**: if the chosen concept (Field Manual) is implemented, the handwritten **Caveat** font (wght 500;600) must be added to the **existing** Google Fonts stylesheet in `index.html` (`family=Inter...&family=Space+Mono...&family=Caveat:wght@500;600`) — adding a separate new font `<link>` stylesheet is forbidden (the CSP `style-src` & `font-src` already allow `fonts.googleapis.com`/`fonts.gstatic.com`); all decorative ink text must be `aria-hidden="true"` and fully disabled under `prefers-reduced-motion`.
5. **PROTECTED DOM IDs**: Never alter or delete protected DOM IDs (`typing-dynamic`, `filter-buttons`, `projects-grid`, `contact-widget`, `modal-backdrop`, `ml-input`, `sec-input`, `spam-input`, `summary-input`, `skill-input`, `pass-input`) bound to core script execution.

---

## 📊 5. Content Synchronization & SEO Canonical Mandates

1. **TESTIMONIAL CAROUSEL SYNC**: Every added or removed testimonial slide MUST be reflected in the `totalTestimonials` variable (currently `10`) and numbered with `<!-- Slide N: -->` comments. Never let the rendered slide count drift from the JS counter.
2. **BILINGUAL PARITY (i18n)**: Every new career timeline entry or testimonial using `data-i18n` MUST define its keys in BOTH the `en` AND `id` dictionaries (e.g., a new position = `cr#c` / `cr#d`; a new slide = `ts#q` / `ts#r`). Single-language keys are prohibited.
3. **CAREER TIMELINE ORDER & BADGING**: The most recent / current role must occupy Position 1 at the top of the timeline, with status badges following the contract-type color mapping (Contract/Project = purple, Part-Time = emerald, Short-Term Contract = amber, Full-Time = cyan).
4. **SINGLE SEO CANONICAL SOURCE OF TRUTH**: `rel="canonical"`, `og:url`, `twitter:url`, Schema.org JSON-LD `url`, `robots.txt` (`Sitemap:`), and `sitemap.xml` (`<loc>`) MUST all reference the identical canonical domain `https://sisigitadi.github.io/portofolio` (the GitHub Pages URL where the site is actually served). Do not reintroduce `sigitadi.my.id`, the `github.com/sisigitadi/portofolio` repository page, or any divergent URL across these files.
5. **OG/SOCIAL IMAGE SYNC (v2.6.1)**: `og-preview.jpg` (1200×630) must reflect the site's active design. When the design/identity changes, regenerate the image and bump the `?v=X.Y.Z` cache-buster across **all** references at once — og:image, og:image:secure_url, twitter:image, itemprop image, image_src, JSON-LD `image` (currently 6 locations). The reference count must stay consistent; never leave some references on the old version.

---

## 📑 6. Tri-Document Portfolio, SEO & Social Media Mandate (v2.8.0)

1. **TRI-DOCUMENT INTEGRITY & SYNCHRONIZATION**: The repository maintains three standalone static portfolio & ATS CV documents:
   - `index.html` (Master Portfolio & Hybrid Database CV)
   - `ai-engineer.html` (Applied AI Engineer & LLM Specialist Target Weapon)
   - `secops-specialist.html` (SecOps & Threat Monitoring Specialist Target Weapon)
   Any global architectural, typographic, print stylesheet (`@media print`), core career chronology (2002–2026), education, or script change applied to `index.html` MUST be immediately propagated to both `ai-engineer.html` and `secops-specialist.html`.
2. **ROLE-SPECIFIC POSITIONING & SECTION PRIORITIZATION**:
   - `ai-engineer.html`: Role title `Applied AI Engineer & LLM Specialist`, AI & Automation certifications first, PromptMatrix & SmartExpenseML at #2.01/#2.02, AI Trainer experience prioritized.
   - `secops-specialist.html`: Role title `SecOps & Threat Monitoring Specialist`, Cybersecurity & SecOps certifications first, SCOPS & A.R.Y.A. at #2.01/#2.02, SecOps/SOC experience prioritized.
   - `index.html`: Retains balanced master profile (ATS 9.2/10) with full chronological breadth.
3. **STRICT 2-PAGE ATS PRINT PARITY**: The `@media print` rules in all three files must remain 100% mathematically and structurally identical (font-size 10px, line-height 1.35, linear single-line career rows, and single-line certifications) to ensure all three files produce a pristine 2-page A4 PDF output without page-spill.
4. **SERP TITLE & META LENGTH LIMITS**:
   - Meta `<title>` must not exceed 65 characters to prevent SERP truncation across Google/Bing.
   - Meta `description` must stay strictly between 120 and 160 characters with dense empirical keywords.
5. **CANONICAL & SOCIAL GRAPH (OG / TWITTER / WHATSAPP)**:
   - Each page must define its exact unique canonical URL in `<link rel="canonical">`, `og:url`, `twitter:url`, and JSON-LD `url`.
   - Open Graph images must use high-resolution 1200×630 banners (`og-preview.jpg`) with matching `?v=X.Y.Z` cache-busters across all 3 pages.
   - Twitter card must specify `summary_large_image`. WhatsApp microdata fallback tags (`itemprop="image"`, `link rel="image_src"`) must remain present.
6. **STRUCTURED DATA (JSON-LD)**: Each page must include two verified JSON-LD blocks (`Person` and `WebSite`) with valid schema, accurate `jobTitle`, role-aligned `knowsAbout` taxonomy, and valid external author links.
7. **MULTI-PAGE DISCOVERY & SYNC**: All three documents must remain registered in `sw.js` CORE cache (`portofolio-vXX`), `sitemap.xml`, `indexnow-ping.py`, and the Private Dashboard Resume Hub launcher in `worker-visitor/worker.js`.
