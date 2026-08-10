# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachamber.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.10] - 2026-08-11 — Canonical & Structured-Data URLs Normalized to Trailing Slash

### 🔄 Changed (selaras dengan properti GSC terverifikasi)
- **Semua URL `https://sisigitadi.github.io/portofolio` (tanpa slash) dinormalisasi ke `https://sisigitadi.github.io/portofolio/`** (dengan trailing slash) — menunjuk langsung ke URL final yang benar-benar 200 (versi tanpa slash hanya 301-redirect ke versi ber-slash):
  - `link rel="canonical"` · `meta og:url` · `meta twitter:url` (3 meta).
  - JSON-LD `Person.url` & `WebSite.url` (2 blok, 3 kemunculan `url`).
  - Variabel JS `currentOrigin` di script SEO dinamis (single-quote) — aman karena dipakai sebagai nilai final, bukan concatenation path (tidak ada risiko double slash).
- **Tidak diubah (sudah benar)**: semua URL gambar `og-preview.jpg?v=2.1.0`, `sitemap.xml` (sudah ber-slash), `robots.txt`, `profileUrl` (sudah ber-slash), dan `path=/portofolio` di pixel tracker Worker (itu parameter path tracking, bukan URL situs).
- **Latar belakang**: properti Google Search Console kini terverifikasi sebagai `https://sisigitadi.github.io/portofolio/` (ber-slash) — canonical/og:url kini konsisten satu-ke-satu dengan properti GSC, menghilangkan sinyal URL ganda bagi Google.

### 🧪 Validasi
- 7 lokasi ternormalisasi (6 double-quote + 1 single-quote) · verifikasi grep: 0 sisa `portofolio"`/`portofolio'` di konteks URL situs.
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20**.

---

## [2.5.9] - 2026-08-11 — Fix Lighthouse CI: Light-Theme Color Contrast (a11y 100)

### 🔧 Fixed (akar masalah Lighthouse CI gagal — a11y 0.96)
- **Diagnosis**: CI run gagal `categories.accessibility` (found 0.96) pada 3 push terakhir. Reproduksi lokal dengan versi persis CI (Lighthouse 12.6.1 + Chrome 134 via Node 20) membuktikan: skor **100 di tema dark**, **0.96 di tema light** — runner Ubuntu headless default `prefers-color-scheme: light`, sehingga Lighthouse menguji halaman dalam **tema terang**, tempat 33 elemen gagal `color-contrast` (palet neon di atas putih). Bukan regresi kode SEO — masalah ini sudah ada sejak gate CI pertama (c4e4893), hanya tidak pernah terlihat karena pengujian lokal selalu render tema dark.
- **Perbaikan tema terang (tanpa ubah HTML)**:
  - Variabel light: `--color-primary` `#0E7490` → **`#155E75`**, `--color-accent1` `#059669` → **`#047857`**, `--color-accent2` `#0D9488` → **`#115E59`** → `#0F4F4B` (badge pill tinted membutuhkan langkah lebih gelap — kontras 4.44 masih < 4.5; #0F4F4B memberi margin ~5.7:1).
  - Blok override baru `html[data-theme="light"]`: `text-emerald-400` → `#047857`, `text-red-400` → `#B91C1C`, `text-cyan-400/300/200` → `#155E75` (palet neon Tailwind gagal WCAG AA di atas putih).
  - `.badge-ct` light `#155E75` → **`#0F4C5C`** (teks badge pada pill `--color-primary/30`).
- **Catatan**: Changelog 2.4.3 menyebut light-theme contrast sudah "fixed" untuk `.badge-ct`/`.badge-ac1` — terbukti belum menyeluruh (33 elemen tersisa) dan tidak ter-gate karena CI/lokal selalu render dark.

### 🧪 Validasi
- LH 12.6.1 + Chrome 134 (versi CI persis): **LIGHT a11y 1.0 · DARK a11y 1.0** — 0 audit gagal di kedua tema.
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20**.
- Browser: toggle ke tema terang — hero tagline & badge "OPEN FOR REMOTE ROLES" jelas, badge "Short-Term Contract" terbaca, **0 console error**.
- Artefak diagnosis (Chrome 134 359 MB, report JSON) dibersihkan dari repo.

---

## [2.5.8] - 2026-08-11 — og-preview.jpg Regenerated ("Applied AI Engineer")

### 🖼️ Changed
- **`og-preview.jpg` diregenerasi penuh (1200×630, 119 KB, progressive JPEG, quality 90)** — teks di dalamnya kini **"IT & SecOps Specialist | Applied AI Engineer"** (dua warna cyan/emerald, konsisten judul baru) menggantikan "Applied AI Practitioner". Elemen visual: badge **OPEN FOR REMOTE ROLES**, nama besar putih, tagline dua warna, sub deskripsi *"Security Operations • Applied AI • DevSecOps Automation"* + *"Based in Tangerang, Banten, Indonesia — remote-ready worldwide"*, chip **CORE STACK: AI & SECOPS** & **TOOLS: LINUX • OLLAMA • WAZUH**, URL footer, logo double-bracket — tema dark terminal dengan dot-grid + glow cyan/emerald konsisten situs.
- **Cache-buster `?v=2.0.0` → `?v=2.1.0`** di 7 lokasi meta (itemprop image, link image_src, og:image, og:image:secure_url, twitter:image, JSON-LD `image`, script SEO dinamis `ogImageUrl`) — memaksa Facebook/WhatsApp/LinkedIn mengambil gambar baru (cache ketat per URL).

### 🧪 Validasi
- `file og-preview.jpg` → JPEG 1200×630 progressive · ukuran 119 KB (< 130 KB target) · verifikasi visual browser 5/5 (nama, tagline Engineer, badge REMOTE, tanpa crop, tampilan profesional).
- `python audit.py` → 12 PASS | 0 FAIL | 0 WARN · pytest 20/20.

---

## [2.5.7] - 2026-08-11 — Lokasi Lengkap "Tangerang, Banten, Indonesia"

### 🔄 Changed (jawaban atas pertanyaan owner: kenapa bukan "Tangerang, Banten, Indonesia")
- **Strategi lokasi dua tingkat**: `title` tetap **"Tangerang, Indonesia"** (91 char; menambah "Banten" → 98 char akan memotong keyword di SERP yang sudah di batas ~60 char tampilan), sedangkan **deskripsi & konten memakai format lengkap**.
- **Meta description + og:description + twitter:description** → `Remote IT SecOps & Applied AI Engineer in Tangerang, Banten, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` (tepat **120 char** — batas optimal).
- **Hero pitch EN/ID** → *"Based in Tangerang, Banten, Indonesia — open to remote roles worldwide"* / *"Berbasis di Tangerang, Banten, Indonesia — terbuka untuk peran remote di seluruh dunia"* (HTML default + kamus i18n).
- **JSON-LD** `Person.description` & `WebSite.description` ikut menyebut Banten; `address` sudah lengkap (`Tangerang` + `Banten` + `Indonesia`) sejak awal.
- Total kemunculan "Banten": 9× (description×3, pitch EN×2, pitch ID×1, JSON-LD×2, address×1).

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 blok JSON-LD valid · description 120 char.

---

## [2.5.6] - 2026-08-11 — "Remote" Keyword Optimization (Remote-Ready Emphasis)

### 🚀 Optimasi penekanan "Remote" (intent recruiter global)
- **Meta description** ditulis ulang dengan **"Remote" di posisi pertama**: `Remote IT SecOps & Applied AI Engineer in Tangerang, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` — **112 char** (dalam batas optimal ≤120, sebelumnya 130), disinkronkan ke `meta description` + `og:description` + `twitter:description` (3× konsisten).
- **JSON-LD diperkuat**: blok `Person.description` kini menyebut *"remote-ready worldwide"*; blok `WebSite.description` → *"open to remote work worldwide"*.
- **Konten terlihat** (sudah ada, diverifikasi tetap): badge hero **"OPEN FOR REMOTE ROLES"**, hero pitch *"open to remote roles worldwide"* / *"terbuka untuk peran remote di seluruh dunia"* (EN/ID), kartu What I Offer **"Remote & Global Work Readiness"**.

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 blok JSON-LD valid.
- Browser: badge remote tampil jelas, kartu remote readiness ada, meta description baru terverifikasi di DevTools, **0 console error**.

---

## [2.5.5] - 2026-08-11 — Title Revert: "Applied AI Practitioner" → "Applied AI Engineer" (CV Alignment)

### 🔄 Changed (keputusan owner)
- **Judul empiris dikembalikan ke `Applied AI Engineer`** di seluruh metadata, header, bio, dan structured data — sesuai kata persis di CV owner ("Applied AI Engineer" memang judul hero asli; diubah ke "Applied AI Practitioner" di v2.0.4, kini dikembalikan untuk alignment CV + lebih umum + SEO-friendly).
- **Lokasi diperbarui**: `<title>` + `meta title/description` + `itemprop` + `og:title/description/image:alt` + `twitter:title/description` + JSON-LD `Person.jobTitle` & `description` + JSON-LD `WebSite.name` & `description` + hero tagline (`<h2>` `heroTaglineB`) + kamus i18n EN `Applied AI Engineer` / ID `Insinyur AI Terapan` + `manifest.json` name/description + Readme subtitle.
- **Project_rules.md §2.2 diperbarui**: judul empiris baru `IT & SecOps Specialist | Applied AI Engineer` + catatan riwayat (asli → Practitioner v2.0.4 → revert v2.5.5); larangan "Applied AI Engineer" dicabut.
- Changelog sengaja **tidak** diubah di entri lama (catatan sejarah) — entri ini mendokumentasikan revert.

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 blok JSON-LD valid.
- 0 sisa "Practitioner" di kode live (hanya di Project_rules sebagai catatan sejarah) · 16× "Applied AI Engineer" di index.html.
- Browser: hero EN `IT & SecOps Specialist | Applied AI Engineer` ✓, toggle ID `Spesialis IT & SecOps | Insinyur AI Terapan` ✓, `document.title` ✓, **0 console error**.

---

## [2.5.4] - 2026-08-11 — SEO Deep-Optimization: Geo-Keywords, Heading Hierarchy, Enriched Schema

### 🚀 Optimasi SEO On-Page (berbasis riset keyword + best practices 2025–2026)
- **Geo-keyword di `<title>` & semua meta**: `… | Tangerang, Indonesia` ditambahkan ke `<title>`, `meta name=title`, `itemprop name`, `og:title`, `twitter:title` — keyword lokal kompetisi rendah ber-intent recruiter tinggi (hasil riset: "IT Security Operations Specialist Tangerang" & "Applied AI Practitioner Indonesia" = low-competition). Judul empiris `IT & SecOps Specialist | Applied AI Practitioner` tetap dipertahankan persis (Project Rules §2.2).
- **Meta description dioptimasi** (≤120 char, keyword + lokasi + CTA): `IT SecOps Specialist & Applied AI Practitioner in Tangerang, Indonesia. SOC, Wazuh SIEM, DevSecOps & AI. View portfolio.` — disinkronkan ke `meta description`, `og:description`, `twitter:description` (duplikat lama dihapus).
- **`<meta name="keywords">` dihapus** — diabaikan Google sejak lama (riset), membuang ruang & berpotensi sinyal spam tipis.
- **Heading hierarchy hero diperbaiki**: tagline `IT & SecOps Specialist | Applied AI Practitioner` dipromosikan dari `<div>` → **`<h2>`** (keyword utama kini jadi heading terstruktur, bukan teks dekoratif), dan "Specializing in:" `<h2>` → **`<h3>`** — urutan hero kini `h1 → h2 → h3` (semantik + a11y heading-order lebih baik, visual identik: warna cyan & typing effect tetap).
- **JSON-LD diperkaya**: blok `Person` ditambah `description`, `knowsLanguage: ["en","id"]`; `image` disinkronkan ke URL GitHub Pages (`og-preview.jpg?v=2.0.0`) konsisten canonical (rule 5.4); **blok `WebSite` baru** (`name`, `url`, `description`, `inLanguage`, `author`).
- **Geo-keyword di konten terlihat**: hero pitch EN/ID kini menyebut *"Based in Tangerang, Indonesia — open to remote roles worldwide"* / *"Berbasis di Tangerang, Indonesia — terbuka untuk peran remote"* (keyword lokal muncul di teks nyata, bukan hanya meta).
- `sitemap.xml` `lastmod` → 2026-08-11.

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** · `pytest` **20/20** · 2 blok JSON-LD tervalidasi parser (`Person` + `WebSite`).
- Uji browser: hero tagline tetap cyan + typing effect, heading `h2`/`h3` terpasang benar di DevTools, `document.title` memuat "Tangerang, Indonesia", **0 console error**.

---

## [2.5.3] - 2026-08-11 — Company/ASN/Region Detection (Cloudflare Edge) + Bot Flag + JS-less Pixel

### 🚀 Added (worker-visitor/worker.js — Level 1 enrichment, free tier, no third-party API)
- **Kolom baru di D1 `visits`** (migrasi `migration-org.sql`, `schema.sql` diperbarui untuk fresh install): `asn`, `as_org` (nama perusahaan/ISP, mis. *"Google LLC"* / *"PT Anugerah Cimanuk Raya"*), `region`, `region_code`, `continent`, `is_bot` — semua dari `request.cf` edge Cloudflare (tersedia di semua plan, tanpa biaya).
- **Deteksi bot otomatis** (`detectBot`): regex UA crawler (Googlebot, bingbot, DuckDuckBot, YandexBot, Baiduspider, AhrefsBot, GPTBot, CCBot, dsb.) + fallback ASN crawler (Google 15169, Amazon, Microsoft, DuckDuckGo) bila UA bukan browser penuh. Hasil disimpan di `is_bot` → dashboard menampilkan badge **🤖 bot** oranye.
- **Refactor duplikasi (reviewer)**: `handleHit` & `handlePixel` kini memakai satu helper `recordVisit` (geo → hash → rate-limit → dedupe → INSERT → invalidate cache → echo) — tidak ada lagi dua blok INSERT identik yang bisa melenceng. **Rate limit per-IP dua tingkat**: browser 20/menit, bot terdeteksi 120/menit (crawler sungguhan fetch 50–200 URL/menit — ceiling 20 lama akan memotong sebagian besar hit Googlebot; anti-spam untuk manusia tetap ketat).
- **Endpoint baru `GET /pixel?path=`** — beacon 1×1 transparent GIF (42 B): mencatat hit persis seperti `/hit` tapi **tanpa JavaScript** (menangkap crawler & pengunjung no-JS), rate-limit & dedupe harian sama.
- **`index.html`**: `<noscript>` tracking pixel ke `/pixel?path=/portofolio` (hanya dirender saat JS mati → tanpa double-count dengan `/hit`; path `/portofolio` konsisten dengan canonical).
- **Dashboard tabel**: kolom baru **Network** menampilkan `as_org` + `AS<asn>` + `region (region_code)`; badge bot di kolom IP hash; header export CSV & client CSV ikut menyertakan kolom baru.
- `/api/stats` & `/hit` echo kini menyertakan `asn`, `asOrganization`, `region`, `continent`, `isBot`.

### 🔒 Privasi (tetap UU PDP)
- IP mentah **tetap tidak pernah disimpan** — hanya hash; yang ditambah adalah nama perusahaan/ASN/region (data publik geolokasi edge, bukan identitas pribadi). Pilihan Level 1 (tanpa IP asli) sesuai keputusan user.

### 🧪 Validasi
- Migrasi D1 `migration-org.sql` sukses (6 kolom); `node --check` OK; audit **12 PASS | 0 FAIL | 0 WARN**.
- Uji live: `/pixel` → GIF 1×1 valid; UA Googlebot → `bot=1` + `PT Anugerah Cimanuk Raya AS141127 West Java`; browser UA → `bot=0`; count naik.
- Browser end-to-end: kolom Network menampilkan perusahaan+ASN+region, badge 🤖 bot tampil, **0 console error**.

---

## [2.5.2] - 2026-08-11 — Dashboard v2: Charts, World Map, Breakdown, CSV Export, Auto-Refresh

### 🚀 Added (worker-visitor/worker.js — dashboard & API)
- **Dashboard diperkaya, 100% client-side tanpa CDN**: tren kunjungan harian 30 hari (bar chart SVG), distribusi per jam (UTC), Top 8 negara & kota, breakdown device/browser/OS (parse UA), **peta dunia dot** (proyeksi equirectangular dari lat/lon edge Cloudflare, ukuran dot = frekuensi), filter path, pagination 50 baris/halaman.
- **Ekspor CSV dua jalur**: tombol *"Export CSV (view)"* (baris hasil filter, sisi-klien) + endpoint baru `GET /api/export?key=…&range=…` (server-side, hingga 50.000 baris, header `Content-Disposition`).
- **Auto-refresh 60 detik** (default ON, bisa dimatikan): polling `/api/stats` memakai key dari URL tanpa reload halaman; fallback `location.reload()` jika key tidak ada di URL; indikator *"Updated HH:MM:SS"*.
- `GET /api/stats` menerima param `limit` (cap 5000); `DASHBOARD_ROWS` = 2000 baris terbaru di-embed untuk chart/peta.
- Login page menampilkan hint *"Saved key was rejected"* bila key tersimpan ditolak (skenario key dirotasi).

### 🧪 Validasi
- `node --input-type=module --check worker.js` OK · `python audit.py` 12 PASS (index.html tidak berubah) · deploy tanpa warning.
- **Bug template literal tertangkap & diperbaiki**: `\/` di regex UA (`Edg\/`, `Chrome\/`, `OPR\/`, `Safari\/`, `Firefox\/`) ter-decode jadi `/` saat template literal worker dievaluasi → output client menjadi `//i` → `ReferenceError: i is not defined` di `parseUA`. Diperbaiki jadi `\\/` (backslash ganda). Terverifikasi dengan harness eksekusi client JS (syntax + runtime EXEC_OK) sebelum & sesudah deploy.
- Verifikasi: dashboard memuat container chart/map, `/api/export` mengembalikan CSV valid, `/count` & auth tetap OK.

---

## [2.5.1] - 2026-08-11 — Secret 9-Click Dashboard Shortcut + Remember-Key Auto-Unlock

### 🚀 Added
- **Shortcut tersembunyi di footer portofolio**: klik teks copyright (`#footer-copyright`) **9×** dengan selang ≤ 2 dtk → redirect ke `/dashboard` privat. Kunci dashboard **tidak pernah** disimpan di HTML situs — hanya membuka halaman login.
- **Login page auto-unlock**: checkbox *"Remember key in this browser"* menyimpan `DASHBOARD_KEY` di `localStorage` origin `*.workers.dev`; kunjungan berikutnya form auto-submit langsung ke dashboard (auto-submit hanya aktif saat URL tanpa `?key=`, mencegah infinite loop jika key dirotasi). Tautan *"Forget saved key"* di footer dashboard dan *"Clear saved key"* di halaman login menghapusnya.
- **Catatan desain**: `localStorage` per-origin — kunci tidak bisa dibaca dari origin portofolio (`github.io`), jadi alur ingat-kunci sengaja dipusatkan di origin dashboard.

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** (55 ID `getElementById` resolve, termasuk `footer-copyright`).
- Uji browser end-to-end: 9-klik → halaman login; login + remember → dashboard; 9-klik berikutnya → auto-unlock langsung ke dashboard; forget key → kembali ke login.

---

## [2.5.0] - 2026-08-11 — Visitor Tracker: Hit Counter + Private Dashboard (Cloudflare Worker + D1)

### 🚀 Added (worker-visitor/)
- **Backend serverless baru di `worker-visitor/`** — hit counter + dashboard privat pengunjung (IP & lokasi) tanpa API pihak ketiga, untuk situs statis GitHub Pages:
  - `schema.sql` — tabel D1 `visits` (ip_hash SHA-256+salt, city, country_code, lat, lon, timezone, user_agent, referrer, path, is_unique, created_at) + 2 index.
  - `wrangler.toml` — binding D1 `DB` + KV `VISITS`; **tanpa blok `[vars]`** (pelajaran dari deploy nyata: `[vars]` bernama sama akan menimpa secret saat deploy) — `DASHBOARD_KEY` & `IP_HASH_SALT` murni dari `wrangler secret put` (pakai `printf '%s'` tanpa trailing newline, karena `echo` membuat `safeEqual` menolak key).
  - `worker.js` — rute `GET /count` (badge publik, cache KV 60s), `POST /hit` (catat kunjungan + geo dari edge Cloudflare `request.cf`, rate-limit 20/menit/IP via D1, dedupe unik harian), `GET /api/stats?key=` (JSON), `GET /dashboard?key=` (halaman HTML privat: login key constant-time + remember-key auto-unlock, kartu statistik, tabel filter 24h/7d/30d/all, flag emoji, hash IP pendek), CORS preflight.
  - `README.md` — langkah deploy `wrangler` lengkap + uji curl + catatan free tier.
- **`index.html`** — badge hit counter di footer (`#visitor-badge` `role="status"` `aria-live="polite"`, tersembunyi hingga `WORKER_URL` diisi) + client script (POST `/hit` saat load, poll `/count` tiap 60s) + 1 key i18n `visitorLabel` (EN/ID seimbang). CSP `connect-src https:` sudah mencakup worker — tanpa perubahan CSP.

### 🔒 Privasi (UU PDP)
- IP mentah **tidak pernah disimpan** — hanya `SHA-256(salt + IP)`; geolokasi kota/negara/timezone dari edge Cloudflare (`request.cf`), tanpa API geolokasi pihak ketiga; dashboard privat hanya pemilik (key + constant-time compare). Tracker nonaktif default (0 request keluar sampai `WORKER_URL` diisi).

### 🧪 Validasi
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN** (i18n parity tetap, `visitor-badge`/`visitor-count` resolve ke DOM, tag balance, `node --check`).
- `python -m pytest test_audit.py` → **20/20 PASS**.
- `worker.js` valid syntax ES module (`node --input-type=module --check`).
- Deploy worker + isi `WORKER_URL` = langkah manual pengguna (dokumentasi di `worker-visitor/README.md`).

---

## [2.4.4] - 2026-08-10 — Lighthouse CI Gate (GitHub Actions)

### 🚀 Added (.github/workflows/lighthouse-ci.yml + .lighthouserc.json)
- **Gerbang kualitas ke-4**: workflow `lighthouse-ci` menjalankan Lighthouse terhadap situs yang di-serve dari hasil checkout (server lokal `python3 -m http.server 8899`) di setiap push/PR ke `main` — melengkapi pre-commit, pre-push, dan preflight-audit.
- **Assertions (`.lighthouserc.json`)**: `accessibility`, `best-practices`, dan `seo` **wajib 100** (`minScore: 1` → error, memblokir push/PR jika turun); `performance` ≥ 0.5 (**warn**, non-blocking — skor sintetis mobile-throttle rentan noise lintas runner).
- **Detail teknis**: `@lhci/cli@0.15.1` via `npx` (pin versi), `node 20` via `actions/setup-node@v4`, `chromeFlags --no-sandbox --disable-gpu` (standar runner ubuntu), `numberOfRuns: 2` untuk stabilitas, `upload.target: filesystem` (artefak lokal saja, tanpa server LHCI publik).
- **Dokumentasi**: Readme §Quality Gates diperbarui "three gates" → "**four gates**" (dengan perintah ekivalen lokal untuk reproduksi); `.gitignore` menambah `lhci-public/` & `.lhci/`.

### 🧪 Validasi
- `python -c json.load(.lighthouserc.json)` → valid · YAML workflow valid · `lhci healthcheck` lokal → PASS · `lhci autorun` lokal berhasil mengumpulkan hasil Lighthouse ("No browser errors logged") — kegagalan pembersihan temp dir hanya quirk Windows lokal, tidak terjadi di runner ubuntu; pengesahan akhir = run CI pertama di GitHub setelah push.

---

## [2.4.3] - 2026-08-10 — Lighthouse Optimization: Accessibility 100, Best Practices 100

### 🚀 Performance
- **Google Fonts `@import` → preload + stylesheet link** di `<head>` (menghapus render-blocking waterfall `@import`; `display=swap` tetap) + **Font Awesome** diberi `rel="preload"` — tetap render-blocking karena async `media="print"` terbukti memicu FOUC ikon + CLS (0.113) di pengujian, lalu dikembalikan (CLS kembali 0.022).
- **Gambar proyek dikompresi**: `PromptMatrix 2.0.png` 431 KB → **124 KB (−71%)**, SmartExpenseML −65%, KantinKu −63%, A.R.Y.A. −65% (kuantisasi 256 warna median-cut + dithering, dimensi asli dipertahankan — screenshot tetap tajam di verifikasi browser). SCOPS dipertahankan (tidak lolos ambang kualitas).
- **`width`/`height` eksplisit** pada 5 `<img>` kartu proyek (aspek 2:1) — mencegah layout shift saat lazy-load.
- **Feed Medium rss2json dihapus** → kartu Medium memakai 3 artikel statis terkurasi yang sudah ada: API gratis rss2json sering kehabisan kuota (HTTP 422) → error konsol permanen yang membuat Lighthouse `errors-in-console` gagal; dengan penghapusan, best-practices 96 → **100**. Copy `md1b2` (EN/ID), Readme (third-party flows, CSP, XSS, PWA cache boundary), dan CSP `connect-src` ikut disinkronkan — kini **satu-satunya panggilan keluar adalah Formspree**.

### ♿ Accessibility (91 → 100)
- **Kontras tombol**: `.btn-primary` & `.btn-filter.active` kini `#0E7490` (hardcode) — teks putih lolos WCAG AA 4.5:1 (sebelumnya putih di `#0891B2` = 3.68:1).
- **`--color-primary` dark `#0891B2` → `#22D3EE`** (cyan-400, selaras aksen situs): semua teks kecil berwarna primary di permukaan gelap lolos (8.1:1).
- **Badge karir theme-aware**: `.badge-ct` (Kontrak/Proyek) → `#67E8F9` dark / `#155E75` light; `.badge-ac1` (Paruh Waktu) → `#6EE7B7` / `#065F46` — teks pada latar tinted sekarang lolos AA di kedua tema.
- **Heading order**: 10 nama testimonial `h4` → `h3` (sebelumnya h4 langsung di bawah h2 section = lompat level).
- **Target size**: dot carousel testimonial kini 24×24 px hit-area (`w-6 h-6` + padding + `background-clip: content-box` — pill aktif tetap terlihat memanjang, dot non-aktif bulat 12 px) — lolos target-size.

### 🖼️ Best Practices (96 → 100)
- **`favicon.ico` fisik dibuat** (logo double-bracket cyan, 16×16 + 32×32, 569 bytes) + `<link rel="icon" href="favicon.ico">` — menghilangkan 404 `/favicon.ico` yang dicatat Lighthouse sebagai console error.

### 🧪 Validasi
- Lighthouse (lokal): **Accessibility 100 · Best Practices 100 · SEO 100** (sebelumnya 91/96/100); CLS 0.113 → **0.022**; 0 item gagal di a11y & best-practices.
- Lighthouse (live, GitHub Pages, pasca-push): **Accessibility 100 · Best Practices 100 · SEO 100** — FCP 4.8→4.3s, LCP 4.9→4.3s, CLS 0.016, total transfer 799 KB (turun dari ~1 MB berkat kompresi gambar + hapus rss2json). Perf 65 (skor sintetis mobile-throttle; sisa peluang hanya ~20 KiB CSS tak terpakai di blok Tailwind terkompilasi).
- `python audit.py` → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` · `pytest` **20/20** · 0 sisa referensi rss2json di index.html/Readme.

---

## [2.4.2] - 2026-08-10 — Full-Bleed Project Cards & Single "What I Offer" Heading

### 🧭 About — satu judul saja: "What I Offer"
- Heading "About Me" (h2) dan "What I Offer" (h3) **digabung menjadi satu h2 "What I Offer"** — bio tetap di bawahnya sebagai intro, lalu 4 kartu keahlian (2 kolom desktop).
- i18n keys `aboutTitle` dihapus dari EN & ID (parity tetap seimbang, 228 keys).

### 🖼️ Project cards — full-bleed (gambar menutupi seluruh kartu)
- Kartu 1–5: gambar screenshot kini **menutupi seluruh kartu** (custom CSS `.pcb-card` 26rem → 30rem di ≥640px, bukan lagi thumbnail `h-52 sm:h-64`), teks/metrik/tag/tombol diletakkan di atas **gradient gelap** di bagian bawah kartu, hover zoom via `.pcb-card:hover img`.
- Kartu 6 (Medium): gaya konsisten full-bleed dengan **gradient cyberpunk tanpa gambar** (`.pcb-gradient` + `.pcb-between`); feed artikel tetap diisi JS dengan fallback.
- **Judul screenshot tampil**: `object-position: left top` (sisi kiri-atas gambar — tempat judul aplikasi — tidak lagi ter-crop, sebelumnya `top` yang memotong kiri/kanan), dan badge kategori dipindah ke **kanan-atas** (`top-3 right-3`) agar tidak menutupi judul.
- **Koreksi akurasi PromptMatrix 2.0**: digambarkan ulang sebagai **aplikasi prompt engineering** (bukan "LLM Safety Evaluation") — badge/judul/tag → "Rekayasa Prompt" / "Prompt Engineering Platform", highlight → "Pengujian & optimasi prompt multi-variabel" (klaim 1.000+ dihapus sesuai keputusan user), alt text disesuaikan, modal case study (pm1t/b1/b2/b3 EN+ID) ditulis ulang ke framing prompt engineering; Readme "AI evaluation apps" → "AI prompt-engineering apps".
- **Deduplikasi klaim 45% MTTR di kartu SCOPS**: tag chip redundan `-45% MTTR` dihapus dan highlight diganti fitur komplementer yang faktual dari modal — "Klasifikasi risiko real-time (Tinggi/Sedang/Rendah)" / "Real-time risk classification (High/Medium/Low)" — klaim 45% MTTR kini hanya muncul sekali (di judul).
- **Klaim RLHF "1.000+ pasangan" diselaraskan dengan fakta (semua lokasi)**: kartu About → "Applied AI & Prompt Engineering" / "AI Terapan & Rekayasa Prompt" (deskripsi: pengujian & optimasi prompt multi-variabel, BYOK sisi-klien, Ollama lokal); Career cr2d EN/ID ditulis ulang ke framing prompt engineering; hero typewriter → "Prompt Engineering & LLM"; Readme "RLHF evaluation" → "prompt engineering". Total 0 kemunculan RLHF/1.000+ tersisa.

### 📄 Konsistensi dokumentasi (P0) + pelunakan klaim (P1)
- **Readme disinkronkan dengan kode**: 6 referensi usang diperbaiki — (1) gambar proyek "hot-linked dari Unsplash" → "local `assets/`"; (2) klaim "word-frequency summarization + password entropy" dihapus; (3) "All six demo widgets" → "All three"; (4) daftar demo #4–6 (Summarizer/Skill Matcher/Password) dihapus; (5) referensi "summarizer output" di bagian XSS dihapus; (6) daftar third-party flow menghapus Unsplash.
- **Pelunakan klaim absolut "0ms"**: "100% offline · 0ms API latency" → "no network latency" / "tanpa latensi jaringan" (kartu SmartExpense + modal case study EN/ID) — wording yang sama akurat tapi tidak terdengar seperti klaim pemasaran.
- **Dipertahankan dengan alasan**: "20+ years" (didukung tanggal karir 2002 → 2026 ≈ 24 tahun), "50+ staff" (klaim karir), MTTR −45% (sudah berlabel "simulated"), testimonial & sertifikasi (hanya pemilik yang dapat memverifikasi — disarankan cek ulang sebelum direkrut).

### 🧹 Review akhir sebelum release
- **Light theme full-bleed cards diperbaiki**: `.pcb-shade` sebelumnya hardcoded gradient gelap `rgba(2,6,23,…)` → teks kartu gelap (`--color-text-primary` adaptif) jadi tidak terbaca di light theme. Kini ada override `html[data-theme="light"] .pcb-shade` (white fade) — diverifikasi di browser light mode, 0 console error.
- **Dead code dihapus**: panggilan guard `applyArchDynamicText()` di `applyLanguage()` (visualizer arsitektur sudah lama dihapus, guard permanen false).
- **Frasa konsisten**: "zero network latency" → "no network latency" / "latensi jaringan nol" (pj2m & sm1b3 seragam).
- **PWA cache bump**: `sw.js` `portofolio-v1` → `portofolio-v2` agar pengunjung lama menerima index.html + gambar assets baru.
- **og-preview.jpg digenerasi ulang** (1200×630, 96 KB, turun dari 638 KB): tema cyberpunk gelap konsisten dengan situs — nama, tagline dua warna, sub deskripsi, badge "OPEN FOR REMOTE ROLES", chip CORE STACK/TOOLS, URL, garis aksen gradient; meta `og:image`/`twitter:image` cache-buster dibump `?v=1.0.1` → `?v=2.0.0` dan URL diarahkan ke GitHub Pages (`sisigitadi.github.io/portofolio/og-preview.jpg`) — raw.githubusercontent CDN tidak melewati cache lama. Terverifikasi live via opengraph.xyz (gambar baru 1200×630, 0 console error).
- **Audit klaim versi live (pra-recruiter)**: judul karir `cr2c` "Various AI Evaluation Platforms" → "Various AI Prompt Engineering Platforms" / "Berbagai Platform Rekayasa Prompt AI" (selaras dengan reframe prompt engineering cr2d); 3 sertifikasi dikoreksi berdasar riset — "Certified SOC Analyst — Cyber Academy Indonesia" → "SOC Analyst" (sertifikat kelulusan internal, bukan CSA EC-Council), "Ubuntu Linux Professional Certification — Canonical" → "Ubuntu Linux Professional — LinkedIn Learning" (nama resmi Canonical adalah Canonical Academy/SysAdmin, Okt 2025), "Certified Ethical Hacker Foundation" → "Ethical Hacking Foundations — LinkedIn Learning" (CEH Foundation bukan sertifikasi EC-Council); testimonial Prospera/ACE terkonfirmasi perusahaan nyata (INKINDO/DevelopmentAid) — keaslian kutipan tetap tanggung jawab pemilik.
- CSS custom ditambahkan karena Tailwind terkompilasi tidak memuat class arbitrary (`h-[26rem]`, `group-hover`, dst.) — pendekatan paling aman untuk SPA satu-file tanpa build system.

### ♿ Alt text deskriptif
- Kelima gambar proyek diberi alt deskriptif (mis. "PromptMatrix 2.0 — dasbor evaluasi keamanan LLM") — aksesibilitas + SEO.

### 🧪 Validasi
- `python audit.py` penuh → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance, i18n 228 key seimbang, 53 ID + 4 selector resolve)
- `python -m pytest test_audit.py` → **20/20 PASS**
- Browser check: kartu full-bleed + teks terbaca di gradient, About satu judul "What I Offer", modal case study terbuka, **tidak ada overflow horizontal di viewport mobile 390px**, semua 5 gambar termuat (naturalWidth > 0 setelah lazy-load)

---

## [2.4.1] - 2026-08-10 — Remove Architecture Visualizer, Sharper About & Project Cards

### 🗑️ System Architecture Visualization dihapus total
- **Blok "System Architecture Visualization" dihapus dari Projects** (yang sebelumnya dipindah dari About) — dianggap berulang & tidak memberi nilai, sesuai keputusan user.
- Ikut dibersihkan: blok HTML (~230 baris), seluruh JS arsitektur (`archNodeData`, `switchArchitectureDiagram`, `runArchSimulation`, `resetArchSimulation`, `inspectArchNode`), modal "Technical Node Inspector", 118 i18n keys `arch*` (EN/ID simetris), CSS animasi (radar/packet/laser). `.holo-card` **dipertahankan** karena masih dipakai di Certifications.
- Dampak: 66 → **53 ID getElementById** (semua resolve), 6 → 4 ID querySelector, 288 → **229 i18n keys** (parity tetap seimbang). Ukuran index.html: 354 KB → 282 KB.

### ✏️ About Me & What I Offer — tidak lagi berulang dengan hero
- Bio About Me **ditulis ulang** agar berbeda dari hero pitch: hero = positioning ("IT professional with 20+ years..."), About = cara kerja & nilai ("I pair two decades of IT operations with applied AI... privacy-first, documenting as I go, across timezones").
- Kartu "What I Offer" kini **2 kolom di desktop** (`md:grid-cols-2`) — lebih padat & profesional.

### 🖼️ Project cards — gambar lebih besar & tampak asli
- Tinggi gambar dinaikkan `h-44` → `h-52 sm:h-64` dengan `object-top` (menampilkan UI asli, bukan crop tengah acak) + `hover:scale-105` zoom.
- Screenshot asli user (`assets/*.png`) tetap dipakai — bukan gambar stok/AI.

### 🧪 Validasi
- `python audit.py` penuh → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance OK pasca penghapusan, i18n 229 key seimbang, 53/53 ID + 4 selector resolve)
- `python -m pytest test_audit.py` → **20/20 PASS**
- Browser check: About (bio beda + 4 kartu 2 kolom), Projects tanpa blok simulasi, gambar lebih besar, 3 demo, modal case study terbuka — **semua lolos, 0 console error**

---

## [2.4.0] - 2026-08-10 — Recruiter-Friendly Reflow: P0/P1/P2 Portfolio Optimization

### 🔄 P0 — Funnel & Honesty (recruiter-friendly)
- **CTA hero "Explore Case Studies" → "View Projects"** (EN/ID) — label lama hanya scroll ke grid tanpa membuka case study; kini jujur dan tidak menduplikasi nav.
- **Demos (ml-sandbox) dipindah setelah Projects** — alur baru: Hero → About → Projects → Demos → Career. Funnel konversi recruiter tidak lagi disela konten teknis; nav desktop & mobile ikut diurutkan ulang (About, Projects, Demos, Career...).
- **Biografi singkat ditambahkan di About**: heading "About Me" + bio 20+ tahun (EN/ID), lalu "What I Offer" turun ke h3 dengan 4 kartu keahlian.

### 🎯 P1 — Trust & Clarity
- **Label resume jujur**: "Request Official Resume (PDF)" → **"Request Official Resume (PDF via Email)"** (EN/ID) — pengunjung tahu ekspektasinya (resume dikirim lewat email, bukan unduhan instan).
- **Badge hero tidak lagi menghilang**: keyframes fly-in/out 15s yang menyembunyikan stack tools (LINUX • OLLAMA • WAZUH) diganti animasi masuk sekali jalan — info kunci tetap terlihat untuk recruiter yang tidak berinteraksi.

### 🎛️ P2 — Curated, Local, Consolidated
- **Demo dikurasi 6 → 3** (Expense Classifier, ML Security Validator, Spam & Phishing): HTML kartu 4–6, blok JS (summarizer, skill matcher, password analyzer), i18n keys dm4/dm5/dm6, dan pemanggilnya dihapus — dari 79 → 66 ID getElementById (semua resolve), teks "Explore 6" → "Explore 3".
- **Gambar Unsplash diganti screenshot asli di `assets/`** (PromptMatrix 2.0.png, SmartExpenseML.png, SCOPS Command.png, KantinKu ERP.png, A.R.Y.A. SOC Analytics.png) — nol dependensi pihak ketiga (Unsplash), `desktop.ini` sisa upload dibersihkan.
- **Visualizer arsitektur dipindah dari About ke dalam Projects** — About kini murni personal (bio + offer), arsitektur teknis menyatu dengan konteks proyek; `id="architecture"` tetap utuh di DOM.

### 🧪 Validasi
- `python audit.py` penuh → **12 PASS | 0 FAIL | 0 WARN**, `100% PRODUCTION READY` (tag balance OK pasca pemindahan section, i18n 288 key seimbang, 66/66 ID + 6 selector resolve)
- `python -m pytest test_audit.py` → **20/20 PASS** · pre-commit & pre-push hook OK
- Browser check (Chrome DevTools): hero/CTA, About (kartu 2 kolom), Projects+arsitektur, 3 demo, modal case study, widget kontak + label resume baru — **semua lolos, 0 ReferenceError** (sisa panggilan `runSummaryPreset`/`runSkillPreset`/`runPassPreset` di init ditemukan browser & dihapus)
- Ukuran index.html: 386 KB → 354 KB (−32 KB)

---

## [2.3.2] - 2026-08-10 — Summary & Timing, Configurable Target, Unit Tests (pytest)

### ✨ Added (audit.py)
- **Ringkasan + timing di akhir audit**: setiap run kini menutup dengan baris `Ringkasan: 12 PASS | 0 FAIL | 0 WARN | 11 pemeriksaan | 3.43s` — hitungan PASS/WARN dihitung di `_pass()`/`_warn()`, durasi memakai `time.monotonic()`.
- **Target file via argumen posisi**: `python audit.py [file] [--quick]` — `parse_cli_args()` dipisahkan sebagai fungsi murni (testable); default tetap `index.html`; flag tak dikenal diabaikan.
- **Unit test `test_audit.py` (pytest)**: 20 test — index.html asli lolos penuh; 6 skenario rusak terarah (masing-masing memicu tepat 1 FAIL: ID getElementById mati, selector `#ghost`, tag tak seimbang, i18n tak seimbang, slide count mismatch, endpoint Formspree salah); idempotensi `run()`; mode `--quick` (WARN bukan FAIL); parsing argumen parametrized; integrasi `run_preflight_check` (SystemExit 1 saat file hilang/audit gagal).

### 🔧 Fixed (audit.py)
- **Ketahanan `node --check`**: OSError saat node gagal diluncurkan (mis. handle stdout yang di-redirect test runner di Windows) kini menjadi **WARN** "tidak dapat diluncurkan" — sebelumnya crash tidak tertangkap; FAIL tetap dipakai hanya untuk script yang benar-benar gagal parse.

### 🧪 Validasi
- `python -m pytest test_audit.py -v` → **20/20 PASS** (23–43s, subprocess node di dalam pytest di-WARN-kan dengan aman)
- `python audit.py` penuh di bash → **12 PASS | 0 FAIL | 0 WARN | 3.43s**, `100% PRODUCTION READY`
- `python audit.py --quick` → 11 PASS + 1 WARN (node dilewati) · `py_compile` bersih

---

## [2.3.1] - 2026-08-10 — Audit Modular, Pre-Commit Hook & CI Gate (GitHub Actions)

### 🧩 Refactored (audit.py — modular class)
- **`run_preflight_check` dirombak menjadi class `PreflightAudit`**: ke-12 pemeriksaan kini adalah metode terdaftar lewat dekorator **`@check`** (registry level modul `_CHECKS_REGISTRY`) — menambah pemeriksaan #13+ cukup menulis satu metode dengan dekorator, tanpa menyentuh `run()` atau pemanggil.
- **State bersama dihitung sekali**: `scripts` & `dom_ids` di `__init__`; referensi DOM (79 ID + prefix + variabel + selector) diisi `_check_09` lalu dipakai `_check_09b` & `_check_10`.
- **Mode `--quick`**: `python audit.py --quick` melewati `node --check` (#6) dengan WARN eksplisit — untuk umpan balik cepat di pre-commit; gerbang penuh (pre-push/CI) tetap 12 pemeriksaan lengkap.
- **Bug dekorator ditemukan & diperbaiki**: `@classmethod check` tidak bisa dipakai sebagai dekorator (`TypeError: 'classmethod' object is not callable`) — diganti registry modul `def register(fn)` (prefix `_`-less dihindari agar tidak mengotori namespace modul).
- **Lazy property `_dom_refs()` (perbaikan reviewer)**: referensi DOM dihitung sekali lalu di-cache; check #9/#9b/#10 kini **order-independent** — tiap check aman dijalankan kapan pun tanpa mengandalkan check lain lebih dulu (terverifikasi: #10 standalone tetap PASS).
- **`run()` idempotent (perbaikan reviewer)**: state di-reset di awal `run()` sehingga pemanggilan berulang pada instance yang sama tidak menggandakan hitungan (terverifikasi: 2× run → 12/12 PASS identik).

### ⚡ Added (.githooks/pre-commit)
- **Pre-commit hook baru** (audit `--quick`): deteksi dini error struktural sebelum commit. Teruji dua arah: sehat → `Commit diizinkan`; rusak → `Commit DIBATALKAN` (exit 1). File `index.html` di-restore setelah uji.
- `.gitattributes` diperluas: `.githooks/pre-commit` juga dipaksa LF.

### 🚀 Added (.github/workflows/preflight.yml — CI Gate)
- **GitHub Actions workflow `preflight-audit`**: menjalankan `python audit.py` (12 pemeriksaan penuh) di setiap push ke `main`/`master` dan setiap pull request, plus `workflow_dispatch` untuk trigger manual. Gagal (exit ≠ 0) → push/PR diblokir sampai diperbaiki.
- YAML tervalidasi: semua struktur wajib ada (`name`, `on`, `jobs`, `runs-on`, `steps`, `actions/checkout`, `actions/setup-python`, `run: python audit.py`), 0 indentasi tab.

### 🧪 Verified
- **Paritas perilaku**: audit **12/12 PASS** (79 ID + `diagram-` + `modalId`; 6 ID querySelector/closest/matches dari 27 selector) dan mode `--quick` 11 PASS + 1 WARN — hasil identik dengan versi prosedural.
- **Uji negatif gabungan** (6 skenario: ID mati, prefix tanpa cocok, literal call, data-modal-target, variabel non-parameter, selector ghost) — semuanya **FAIL** (exit 1); komentar & string literal tak dihitung.
- **Pre-commit & pre-push hooks**: PASS dan FAIL path teruji; `python -m py_compile` bersih.

---

## [2.3.0] - 2026-08-10 — Follow-up: closest/matches, Pre-Push Hook & Statistik

### 🚀 Added (audit.py pemeriksaan #10 diperluas)
- **`closest('#id')` & `matches('#id')` kini ikut diverifikasi**: `extract_dom_refs` memperlakukan `closest` dan `matches` seperti `querySelector`/`querySelectorAll` (semua selector DOM-traversal). 0 pemakaian di kodebase saat ini — cek bersifat proaktif agar referensi id baru langsung ter-gate.
- Pesan PASS/FAIL #10 diperbarui: `querySelector/closest/matches('#...')`.

### 🔒 Added (Git Pre-Push Hook)
- **`.githooks/pre-push`**: hook git yang menjalankan `python audit.py` sebelum setiap push dan **menolak push jika audit gagal** (exit 1). Menggunakan `python`/`python3` otomatis, berjalan dari root repo, output audit ditampilkan penuh.
- **Aktivasi (sekali, dari root repo)**: `git config core.hooksPath .githooks` + `chmod +x .githooks/pre-push`. Nonaktif: `git config --unset core.hooksPath`.
- **Teruji dua arah**: dengan `index.html` sehat → `[pre-push] OK — audit lulus. Push diizinkan.`; dengan file rusak (ID mati) → `[pre-push] GAGAL — Push DIBATALKAN.` (exit 1). File `index.html` di-restore setelah uji.
- **`.gitattributes` baru**: memaksa LF untuk `*.sh` dan `.githooks/pre-push` (`text eol=lf`) agar hook tidak rusak oleh normalisasi CRLF saat diklone di mesin Windows lain.
- **Hook lebih robust**: kini mengutamakan `python3` (audit.py memakai sintaks Python 3; `python` di sebagian sistem lama masih Python 2 yang gagal menyesatkan).
- **Catatan**: direktori kerja saat ini bukan repo git (tidak ada `.git`), jadi hook disediakan + didokumentasikan di Readme untuk diaktifkan di environment yang benar-benar melakukan push (mis. GitHub Actions atau clone lokal).

### 📊 Refactored (statistik)
- **Area tokenizer**: dua fungsi duplikat (`extract_used_dom_ids` ~117 baris + `extract_query_selector_args` ~109 baris ≈ 226 baris) digabung menjadi `_iter_call_args` (119 baris) + `extract_dom_refs` (48 baris) = **167 baris** — pengurangan ~59 baris di area tersebut; body JS (~135KB) dipindai sekali, bukan dua kali.
- **Total `audit.py`**: 560 baris (12 pemeriksaan aktif).

### 🧪 Verified
- Audit **12/12 PASS** — 79 ID + `diagram-` + `modalId`; 6 ID querySelector/closest/matches dari 27 selector; `100% PRODUCTION READY`.
- Uji negatif `closest('#ghost-closest')` & `matches('#ghost-matches')` → **FAIL** (exit 1); contoh di komentar & string literal tak dihitung.
- Hook pre-push: 0 CR (LF murni), `python3` terdeteksi, jalur PASS & FAIL teruji.
- `python -m py_compile` bersih.

---

## [2.2.9] - 2026-08-10 — Refactor: Tokenizer Gabungan _iter_call_args (Deduplikasi #9 & #10)

### 🧹 Refactored (audit.py)
- **Duplikasi tokenizer dihapus**: dua scanner identik (~160 baris) di `extract_used_dom_ids` (#9) dan `extract_query_selector_args` (#10) digabung menjadi satu generator bersama **`_iter_call_args(js_body)`** yang melewati string literal, regex literal, dan komentar — lalu me-yield `(func_name, arg_value, is_string, end_pos)` untuk setiap panggilan fungsi.
- **Satu pass gabungan `extract_dom_refs`**: referensi `getElementById` (ID statis/prefix/variabel) dan `querySelector`/`querySelectorAll` dikumpulkan dalam satu iterasi `_iter_call_args` per body script — body JS (~135KB) tidak lagi dipindai dua kali.
- **Boundary identifier otomatis**: karena nama fungsi dibaca sebagai token identifier utuh (`querySelectorAll` bukan prefix `querySelector`; `myGetElementById` tidak cocok `getElementById`), penjagaan boundary manual dari #9/#10 lama terhapus tanpa kehilangan ketelitian.
- **Batasan terdokumentasi** (konsisten pra-refactor): komentar antara `(` dan argumen pertama membuat argumen tak di-yield; call bersarang sebagai argumen terklasifikasi sebagai identifier; `end_pos` hanya valid bila `is_string=True`.

### 🐛 Fixed (regresi yang tertangkap saat pengembangan)
- **Bug `i = j + 1` pada cabang argumen non-string**: posisi lanjut menunjuk karakter kedua dari argumen sehingga regex literal (`replace(/[&<>"']/g, ...)`) tidak terdeteksi — kutip di dalamnya ditangkap sebagai string palsu dan scanner melompat ~49.000 karakter (40 ID getElementById + modalId hilang). Diperbaiki menjadi `i = j` agar karakter pertama argumen diproses ulang oleh loop utama. Terdeteksi lewat uji regresi: 79 ID vs 39 ID.

### 🧪 Verified
- **Paritas perilaku**: hasil identik dengan pra-refactor — 79 ID statis + 1 prefix dinamis (`diagram-`) + 1 var (`modalId`); 6 ID querySelector dari 27 selector; audit **12/12 PASS**, `100% PRODUCTION READY`.
- **Uji negatif gabungan** (1 file, 6 skenario): ID mati, prefix tanpa cocok, literal call tak resolve, `data-modal-target` tak resolve, variabel non-parameter, dan `querySelector('#ghost')` — semuanya **FAIL** (exit 1); contoh di komentar & string literal tidak ditangkap.
- **Uji negatif pasca single-pass** (ID mati, prefix tanpa cocok, literal call tak resolve, `querySelector('#ghost')`) — semua **FAIL** (exit 1).
- **`python -m py_compile`** bersih tanpa warning.

---

## [2.2.8] - 2026-08-10 — Audit Pemeriksaan #10: Selector querySelector('#id') Resolve ke DOM

### 🛠️ Strengthened (audit.py — pemeriksaan #10 baru)
- **Pemeriksaan #10 "Selector `#id` → DOM"**: setiap selector `querySelector('#...')` / `querySelectorAll('#...')` kini diverifikasi otomatis bahwa id yang direferensikan benar-benar ada sebagai elemen DOM.
- **Tokenizer `extract_query_selector_args`** (aman string/regex/komentar, konsisten dengan #9): mengekstrak argumen string literal dari panggilan `querySelector` dan `querySelectorAll`, termasuk selector dengan kutip ganda di dalamnya (mis. `meta[name="theme-color"]`) yang tidak bisa ditangkap regex naif.
- **Atribut selector dibuang sebelum ekstraksi id**: bagian `[attr=...]` dihapus agar `#id` di dalam `href="#x"` atau contoh atribut tidak ikut terhitung sebagai target id.
- **0 false positive dari komentar/string**: contoh kode di komentar atau string (mis. `var s = "querySelector('#x')"`) tidak dihitung.

### 🧪 Verified
- **Uji positif**: audit **12/12 PASS** — 6 ID `#...` unik (filter-buttons, testimonial-dots, projects-grid, mobile-menu, architecture, arch-diagram-display) dari 27 selector, semuanya resolve ke DOM; `100% PRODUCTION READY`.
- **Uji negatif sintetis**: `querySelector('#ghost')` & `querySelectorAll('#nonexistent')` → **FAIL** (exit 1); contoh di komentar & string literal tidak ditangkap.
- **Bug ditemukan & diperbaiki selama pengembangan**: kondisi `js_body[j] == 'All'` (perbandingan char vs string) membuat `querySelectorAll` tak pernah diproses — diperbaiki menjadi `startswith('All', j)`; hasilnya selector #... kini terdeteksi penuh.
- **Boundary check identifier** ditambahkan di kedua tokenizer (#9 & #10): `getElementById`/`querySelector` hanya dikenali bila bukan bagian identifier lebih panjang (mis. `myQuerySelector('#x')` tidak ikut diekstrak) — mencegah false positive dari nama fungsi yang mirip.

---

## [2.2.7] - 2026-08-10 — WARN modalId Menjadi Cek Nyata: Verifikasi Sumber Nilai

### 🛠️ Strengthened (audit.py — pemeriksaan #9b baru)
- **WARN `getElementById(modalId)` ditingkatkan menjadi cek nyata**: panggilan berargumen variabel kini tidak lagi sekadar dilaporkan, tetapi **diverifikasi** bahwa nilai runtime-nya selalu menunjuk elemen DOM yang ada.
- **3 syarat verifikasi** (semua harus terpenuhi, selain syarat 79/79 dari #9):
  1. Variabel argumen (mis. `modalId`) **wajib menjadi parameter** dari fungsi deklarasi (`openModal(modalId)`) — jika bukan (variabel global/lokal tak terlacak) → **FAIL**.
  2. Semua **literal call** ke fungsi pemilik (`openModal('modal-...')`) wajib resolve ke ID DOM → jika ada nilai tak dikenal → **FAIL**.
  3. Semua **`data-modal-target`** (sumber nilai `button.dataset.modalTarget` → `openModal(button.dataset.modalTarget)`) wajib resolve ke ID DOM → jika ada target hantu → **FAIL**.

### 🧪 Verified
- **Uji positif**: `getElementById(modalId)` kini **PASS terverifikasi** — 6 target `data-modal-target` + 7 literal `openModal('...')` semuanya resolve ke DOM; audit **11/11 PASS**, `100% PRODUCTION READY` (tidak ada lagi WARN yang tersisa).
- **Uji negatif (3 skenario sintetis)**: literal `openModal('modal-tidak-ada')` → FAIL ✓; `data-modal-target="modal-ghost"` tanpa elemen → FAIL ✓; `getElementById(someGlobalVar)` non-parameter → FAIL ✓ (semua exit code 1).
- **Readme**: tidak memuat klaim WARN apa pun — tidak perlu perubahan.

---

## [2.2.6] - 2026-08-10 — Audit Permanen: Semua ID getElementById Resolve ke DOM

### 🛠️ Strengthened (audit.py — pemeriksaan #9 baru)
- **Pemeriksaan #9 "ID getElementById → DOM"**: audit.py kini memverifikasi otomatis di setiap pre-flight bahwa **setiap ID yang dirujuk `getElementById` benar-benar ada sebagai elemen DOM** — mengunci klaim zero-dead-code (79/79) secara permanen.
- **Tokenizer cerdas (aman string/regex/komentar)**: parser membaca blok `<script>` inline sambil melewati string literal, template literal, **regex literal** (mis. `/[&<>"']/g` di `escapeHTML` — yang sebelumnya bisa menipu tokenizer string), serta komentar blok/baris.
- **3 kategori referensi dibedakan**:
  1. **ID statis** (`getElementById('foo')`) — wajib ada persis di DOM (0 rujukan mati).
  2. **Prefix dinamis** (`getElementById('foo' + x)`) — diverifikasi bahwa minimal satu ID DOM diawali prefix tersebut (kasus `'diagram-'` + `currentArchDiagram`).
  3. **Argumen variabel** (`getElementById(modalId)`) — tak dapat diverifikasi statis; dilaporkan transparan sebagai **WARN** (bukan FAIL) beserta nama variabelnya.
- **Deteksi duplikat atribut `id`**: ID DOM duplikat (yang membuat `getElementById` ambigu) ikut digagalkan.

### 🧪 Verified
- **Uji positif**: audit.py 9/9 → 10/10 PASS — **79 ID unik resolve + 1 prefix dinamis terverifikasi**, 1 WARN jujur (`modalId`), status `100% PRODUCTION READY`.
- **Uji negatif**: file sintetis dengan ID mati (`mati`), prefix tanpa kecocokan (`pref`), dan panggilan variabel (`variabelZ`) → **tertangkap semua** (2 FAIL + 1 WARN, exit code 1).
- **Readme disinkronkan**: klaim "audited 79/79" kini menyebut verifikasi otomatis oleh audit.py check #9.

---

## [2.2.5] - 2026-08-10 — Readme: Security & Privacy Rewrite (Klaim Presisi & Konsisten dengan Kode)

### 📝 Changed (Dokumentasi)
- **Bagian "Security & Privacy" Readme dirombak menyeluruh** agar setiap klaim presisi dan terverifikasi terhadap kode:
  - **CSP**: Dicocokkan token demi token dengan meta tag aktual — `script-src 'self' 'unsafe-inline'` (0 script eksternal, tanpa `eval`), `style-src` Google Fonts + cdnjs, `font-src` Google/cdnjs/`data:`, `img-src 'self' data: https:`, `connect-src` Formspree + rss2json (dengan fallback `https:`) — serta diakui sebagai *defense-in-depth* (inline script diizinkan, bukan CSP penuh).
  - **BYOK**: Klausul diperjelas bahwa repo ini sendiri **tidak memuat kode handling API key apa pun** (0 baris kode handling key; istilah BYOK/OpenAI/Anthropic hanya muncul sebagai teks deskriptif proyek); pola BYOK berlaku hanya untuk aplikasi eksternal yang ditautkan (PromptMatrix 1.0/2.0).
  - **UU PDP**: Pemisahan tegas demo 100% lokal vs pengecualian form kontak → Formspree (diungkap di UI); daftar lengkap aliran data keluar (Formspree + rss2json + hotlink gambar Unsplash); klausul no-tracking/no-cookies.
- **Anchor Badge Diperbaiki**: Badge `Security` & `Privacy` kini menunjuk ke `#security--privacy-controls` dan badge `Accessibility` ke `#accessibility-a11y--wcag-compliance` — cocok dengan heading aktual (sebelumnya link mati di GitHub).

### 🧪 Verified
- Setiap klaim dicek silang terhadap `index.html` (CSP meta tag, endpoint Formspree `mkgknrqk`, 7 match BYOK/OpenAI/Anthropic semuanya teks deskriptif, 0 kode handling key, `document.cookie` = 0, referrer meta `strict-origin-when-cross-origin` ada, 18 link eksternal semuanya `target="_blank"` + `rel="noopener noreferrer"`).
- **Angka audit diperbarui**: Klaim `getElementById` di Readme disinkronkan ke **79/79 ID unik** yang semua resolve ke elemen DOM (sebelumnya tertulis 80/80 yang tidak akurat).
- **audit.py 9/9 PASS** — tidak ada perubahan kode, hanya dokumentasi.

### 📝 Changed (Transparansi Privasi)
- **Disclaimer Form Kontak**: Ditambahkan catatan di dalam form (key i18n `privacyFormNote`, EN & ID) yang menyatakan bahwa nama, email, dan pesan dikirim ke **Formspree (server pihak ketiga)** semata untuk pengiriman pesan — sedangkan seluruh widget demo (klasifikasi pengeluaran, deteksi spam, password, dsb.) berjalan **100% lokal di browser** tanpa data meninggalkan perangkat.
- **Readme §4 Diperjelas**: Klausul pengecualian form kontak ditambahkan pada bagian UU PDP Compliance agar klaim kepatuhan presisi (demo lokal vs form pihak ketiga).

### 🧪 Verified
- **audit.py 9/9 PASS** — parity i18n EN/ID seimbang (318 key); semua 281 key `data-i18n` yang dipakai terdefinisi di kedua kamus; tag-balance & `node --check` tetap bersih.

---

## [2.2.3] - 2026-08-10 — Dead Class Cleanup & JS Hook Migration

### 🧹 Cleaned
- **Class mati pra-eksisting dihapus** (tidak terdefinisi di CSS mana pun, sebelumnya *silent no-op*): `badge-accent`, `custom-scrollbar`, `node-stage-1..4`, dan `animate-heading`.
- **4 hook JS dimigrasi ke data-attribute** agar class tak berguna bisa dihapus tanpa merusak fungsionalitas — `arch-node-card` → `data-arch-node`, `arch-panel` → `data-arch-panel`, `arch-tab-btn` → `data-arch-tab`, `nav-link` → `data-nav-link` — dengan selector `querySelectorAll` di script diperbarui menyesuaikan.

### 🧪 Verified
- **0 kemunculan class mati tersisa** di atribut `class` (hanya tersisa sebagai substring `data-*` yang disengaja).
- **audit.py 9/9 PASS**; uji browser: perpindahan tab arsitektur, simulasi pipeline, dan inspector node berfungsi penuh dengan selector baru (0 error konsol).

---

## [2.2.2] - 2026-08-10 — Static Tailwind Build (CDN Removal) & Dependency Honesty

### 🚀 Changed (Performance & Dependencies)
- **Tailwind Play CDN Dihapus**: Compiler runtime `https://cdn.tailwindcss.com` (~300KB JS + kompilasi di browser) diganti **CSS statis v3.4.17** yang dikompilasi sekali dan di-embed sebagai `<style id="tailwind-compiled">` (34KB minified) langsung di `index.html`. Repo tetap tanpa build system — hasil kompilasi disimpan permanen.
- **CSP Diperketat**: `'unsafe-eval'` dan `https://cdn.tailwindcss.com` dicabut dari `script-src` (tidak ada kode yang memakai `eval`/`new Function` setelah CDN dihapus).
- **Helper `color-mix` (23 rule)**: Ditambahkan untuk class `bg-/border-[var(--color-x)]/NN` beserta variant `hover:` — kombinasi *opacity-modifier + var()* yang **tidak dikompilasi Tailwind v3** (dan sebelumnya *silent no-op* di Play CDN v3). Kini header ter-render semi-transparan 90% sesuai niat desain, dan border/ikon mendapat tint warna yang selama ini hilang.
- **Readme Diperjelas**: Klaim "zero-dependency" diganti dengan pernyataan akurat — dependensi runtime tersisa: Google Fonts, Font Awesome (cdnjs), Formspree, rss2json, dan gambar preview Unsplash.

### 🧪 Verified
- **Coverage class**: 527 token unik dicek — semua utility Tailwind yang dipakai (termasuk arbitrary values, variants, JS-dynamic classes) tertutup oleh CSS statis.
- **Uji browser**: 0 error konsol (peringatan Tailwind CDN hilang), header semi-transparan, tema light/dark berfungsi, seluruh section render normal.
- **audit.py**: tetap 9/9 PASS — `100% PRODUCTION READY`.
- **Catatan**: Ditemukan class mati **pra-eksisting** yang tidak terdefinisi di CSS mana pun (sudah no-op sebelum perubahan ini, tidak memengaruhi rendering): `arch-node-card`, `arch-panel`, `arch-tab-btn`, `nav-link`, `badge-accent`, `custom-scrollbar`, `node-stage-1..4`, `animate-heading`. Pembersihan opsional di versi mendatang.

---

## [2.2.1] - 2026-08-10 — P0/P1 Fixes: SEO Canonical, Markup & Audit Hardening

### 🔗 Changed (SEO Canonical Realignment — GitHub Pages)
- **Canonical URL Dipindah ke Alamat Asli Situs**: `rel="canonical"`, `og:url`, `twitter:url`, Schema.org JSON-LD `url`, dan script SEO dinamis semuanya kini menunjuk ke **`https://sisigitadi.github.io/portofolio`** — URL GitHub Pages tempat situs sebenarnya dilayani — bukan lagi halaman repo `github.com/sisigitadi/portofolio` (yang memecah sinyal ranking).
- **`robots.txt` (Sitemap:) & `sitemap.xml` (`<loc>`)** ikut dipindah ke domain GitHub Pages; `lastmod` diperbarui ke 2026-08-10.
- **Project_rules §5.4 & Readme** disinkronkan: canonical domain resmi kini GitHub Pages; `sigitadi.my.id` dan halaman repo `github.com/...` dilarang sebagai URL canonical.

### 🛠️ Fixed (Markup & Konsistensi Konten)
- **Bug `#pass-out-bar` (Demo 6)**: Kutip ganda rusak pada `class` membuat atribut `h-full` terurai tak bernilai — progress bar password kini dirender dengan tinggi yang benar.
- **JSON-LD `worksFor` Usang**: Diperbarui dari `Kemendagri SOC` menjadi **`Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH`** sesuai peran saat ini (Web Administrator).
- **Penomoran Komentar Slide Testimonial**: Direnumurkan ulang 1–10 (Slide 6 yang hilang dikembalikan urutannya), sinkron penuh dengan `totalTestimonials = 10`.
- **`rows="2.5"` → `rows="3"`** pada textarea form kontak (nilai invalid, melanggar validitas HTML).
- **`theme-color` Inisial**: Script FOUC-proof kini menyinkronkan meta `theme-color` dengan preferensi tema di kunjungan pertama (status bar mobile tidak lagi gelap saat OS light).
- **Isolasi Gimmick CLI (WCAG)**: `[SYS_CMD_PROMPT v2.2]` dan `[SYS_INIT]` di terminal palette kini memiliki `aria-hidden="true"` pada elemennya.

### 🧪 Strengthened (audit.py)
- **Pre-Flight Audit Diperkuat 4 → 8 Pemeriksaan**: keseimbangan tag HTML (HTMLParser standar), sintaks inline script (`node --check`), sinkronisasi komentar slide vs `totalTestimonials`, parity & coverage kamus i18n EN/ID, dan cek isolasi `aria-hidden` gimmick **per baris** (bukan sekadar keberadaan string global).
- **Verified**: `audit.py` lolos **9/9 PASS** — `100% PRODUCTION READY`; 10 slide sinkron; 280 key `data-i18n` terdefinisi; parity i18n EN/ID seimbang.

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