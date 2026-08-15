# 📐 Enterprise Technical Rules & Repository Mandates

This document establishes the mandatory engineering standards, security protocols, and copywriting rules governing the **Sigit Adi Irianto Portfolio SPA** codebase.

---

## 🔒 1. Security & Credentials Mandate

1. **NO API KEY EXPOSURE**: Never hardcode, commit, or log third-party API keys (OpenAI, Gemini, Azure, Anthropic) in client-side HTML, CSS, or JS files.
2. **BRING-YOUR-OWN-KEY (BYOK) PATTERN**: All AI evaluation tools requiring API calls must request keys dynamically from the user and store them strictly in transient client memory.
3. **SECURE EXTERNAL LINKS**: Every `<a>` element referencing an external domain must specify `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnabbing vulnerabilities.
4. **SERVERLESS FORM SUBMISSION**: Contact forms must submit exclusively through secure HTTPS POST endpoints (`https://formspree.io/f/...`) without backend server dependencies.
5. **INDEXNOW KEY IS PUBLIC BY DESIGN (EXCEPTION TO RULE 1)**: The IndexNow key file (`{KEY}.txt` at repo root, content = key) is an ownership-verification token that **must be publicly reachable** on the deployed site per the IndexNow protocol — it is not a third-party API key. Keep it committed & deployed; never treat it as a secret or gitignore it. The ping script is `indexnow-ping.py`, triggered automatically by `.github/workflows/indexnow.yml` on push to `main` (waits for Pages redeploy via sha256 comparison before pinging).
6. **CONNECT/IMG-SRC RESTRICTED (v2.6.1)**: `connect-src` pada CSP meta `index.html` dilarang memakai wildcard `https:` — hanya origin yang benar-benar dipakai yang boleh (saat ini `https://formspree.io` + worker visitor `https://portofolio-visitor-tracker.si-sigitadi.workers.dev`); `img-src` dibatasi ke `'self' data:` + worker visitor. Menambah origin baru ke halaman (fetch, beacon, script) WAJIB mendaftarkan origin tersebut ke direktif CSP terkait — jika tidak, request diblokir.
7. **CSP SCRIPT-SRC HASH MANDATE (v2.6.1)**: `script-src` dilarang memakai `'unsafe-inline'` — setiap inline `<script>` hanya diizinkan via hash `sha256-...` yang persis. **Jika inline script diubah (isi, format, atau urutan), hash WAJIB dihitung ulang** (hash konten script persis apa adanya, mis. via `node -e` + `crypto.createHash('sha256')`) dan diperbarui di meta CSP — kalau tidak, CSP memblokir script dan halaman rusak diam-diam.
8. **CI ACTIONS SHA-PINNED (v2.6.1)**: semua `uses:` di `.github/workflows/` wajib memakai commit SHA penuh (40 char) + komentar versi tag (mis. `# v5.1.0`) — tag mayor (`@v5`) dilarang karena bisa bergerak diam-diam (supply-chain). Upgrade action = ganti SHA secara sadar + perbarui komentar.

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
4. **HORIZONTAL OVERFLOW GUARD (v2.6.1)**: `html, body { overflow-x: hidden }` wajib ada; konten lebar bawaan (tabel, blok kode) di viewport sempit wajib dibungkus wrapper scroll horizontal (`.table-scroll` dengan `overflow-x: auto` + `-webkit-overflow-scrolling: touch`) — dilarang membiarkan kolom terpotong oleh `overflow: hidden` tanpa akses scroll (kasus: tabel sertifikasi di Galaxy Fold outer 280px, diperbaiki v2.6.1).

---

## 🛠️ 4. Single-Page Application (SPA) Architectural Integrity

1. **SINGLE-FILE INTEGRITY**: The primary application resides in `index.html`. Do not introduce node build tools, Webpack, or bundlers without explicit architectural authorization.
2. **EXPLORATION WORKSPACES ARE OUTSIDE THE PRODUCTION GATE (v2.6.0)**: `design-previews/` (5 konsep HTML statis — `index.html` galeri + `0N-*.html`) dan `design-lab/` (workshop React + Vite + r3f, 10 konsep 3D) adalah area eksplorasi desain yang **tidak** di-audit oleh `audit.py`/pytest/Lighthouse dan **tidak** menjadi bagian dari SPA produksi sampai arah terpilih diimplementasikan ke `index.html`. Jangan menyalin konsep ke produksi tanpa melewati gate: audit 13 PASS, pytest 62/62, Lighthouse a11y/BP/SEO 100, `rel="noopener noreferrer"` pada semua link eksternal, dan i18n EN/ID seimbang (wajib hanya untuk halaman dwibahasa).
3. **FEATURE-CONDITIONAL AUDIT (v2.6.1)**: pemeriksaan spesifik-SPA di `audit.py` (gimmick CLI #4, carousel testimonial #7, kamus i18n #8, panggilan variabel `getElementById` #9b) melewati sebagai PASS "tidak berlaku" saat fitur tidak ada di halaman — sehingga gate kompatibel dengan SPA lama maupun Field Manual satu-bahasa sebagai `index.html` baru. Dua pemeriksaan baru wajib: **#11 SEO meta** (title ≤ 65 char, description ≤ 160 char, robots `index`, canonical, OG, Twitter) dan **#12 structured data JSON-LD valid** (tipe `Person` + `WebSite` wajib ada).
4. **WEBSITE FONT PRODUCTION (v2.6.0)**: jika konsep terpilih (Field Manual) diimplementasikan, font tulisan tangan **Caveat** (wght 500;600) harus ditambahkan ke stylesheet Google Fonts yang **sudah ada** di `index.html` (`family=Inter...&family=Space+Mono...&family=Caveat:wght@500;600`) — dilarang menambah `<link>` stylesheet font baru terpisah (CSP `style-src` & `font-src` sudah mengizinkan `fonts.googleapis.com`/`fonts.gstatic.com`); semua teks dekoratif tinta wajib `aria-hidden="true"` + mati total di `prefers-reduced-motion`.
5. **PROTECTED DOM IDs**: Never alter or delete protected DOM IDs (`typing-dynamic`, `filter-buttons`, `projects-grid`, `contact-widget`, `modal-backdrop`, `ml-input`, `sec-input`, `spam-input`, `summary-input`, `skill-input`, `pass-input`) bound to core script execution.

---

## 📊 5. Content Synchronization & SEO Canonical Mandates

1. **TESTIMONIAL CAROUSEL SYNC**: Every added or removed testimonial slide MUST be reflected in the `totalTestimonials` variable (currently `10`) and numbered with `<!-- Slide N: -->` comments. Never let the rendered slide count drift from the JS counter.
2. **BILINGUAL PARITY (i18n)**: Every new career timeline entry or testimonial using `data-i18n` MUST define its keys in BOTH the `en` AND `id` dictionaries (e.g., a new position = `cr#c` / `cr#d`; a new slide = `ts#q` / `ts#r`). Single-language keys are prohibited.
3. **CAREER TIMELINE ORDER & BADGING**: The most recent / current role must occupy Position 1 at the top of the timeline, with status badges following the contract-type color mapping (Contract/Project = purple, Part-Time = emerald, Short-Term Contract = amber, Full-Time = cyan).
4. **SINGLE SEO CANONICAL SOURCE OF TRUTH**: `rel="canonical"`, `og:url`, `twitter:url`, Schema.org JSON-LD `url`, `robots.txt` (`Sitemap:`), and `sitemap.xml` (`<loc>`) MUST all reference the identical canonical domain `https://sisigitadi.github.io/portofolio` (the GitHub Pages URL where the site is actually served). Do not reintroduce `sigitadi.my.id`, the `github.com/sisigitadi/portofolio` repository page, or any divergent URL across these files.
5. **OG/SOCIAL IMAGE SYNC (v2.6.1)**: `og-preview.jpg` (1200×630) harus mencerminkan desain aktif situs. Saat desain/identitas berubah, gambar diregenerasi dan cache-buster `?v=X.Y.Z` dibump **di semua** referensi sekaligus — og:image, og:image:secure_url, twitter:image, itemprop image, image_src, JSON-LD `image` (saat ini 6 lokasi). Jumlah referensi harus konsisten; jangan pernah membiarkan sebagian referensi tertinggal di versi lama.
