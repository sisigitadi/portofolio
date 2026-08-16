# 🛰️ worker-visitor — Hit Counter + Private Visitor Dashboard

Cloudflare Worker backend untuk `index.html` (portfolio GitHub Pages):

- **`POST /hit`** — mencatat kunjungan: IP (di-hash, tidak pernah disimpan mentah), kota/negara/timezone **+ perusahaan/ASN/region/continent** dari edge Cloudflare (`request.cf`), flag bot, user-agent, referrer, path. Body dibatasi 10 KB (payload lebih besar ditolak 413 `payload_too_large`); jika `IP_HASH_SALT` tidak dikonfigurasi, hit ditolak 500 fail-closed (tidak ada yang direkam).
- **`GET /pixel?path=…`** — beacon 1×1 transparent GIF tanpa JavaScript (menangkap crawler/no-JS); mencatat hit sama seperti `/hit` (rate-limit + dedupe harian sama).
- **`GET /count`** — total kunjungan & unik (badge publik di footer, cache KV 60 detik).
- **`GET /dashboard?key=…`** — dashboard HTML privat (login key, kartu statistik, tabel filter 24h / 7d / 30d / all).
- **`GET /api/stats?key=…&range=…`** — JSON mentah untuk integrasi/ekspor.
- **`GET /api/export?key=…&range=…`** — CSV server-side (hingga 50.000 baris).

Tanpa API pihak ketiga: geolokasi **dan nama perusahaan/ASN** (`request.cf.asOrganization`, `request.cf.asn`, `request.cf.region`) berasal dari edge Cloudflare (semua plan, gratis). Privasi UU PDP: IP mentah **tidak pernah disimpan** — hanya `SHA-256(salt + IP)`; kolom `as_org`/`asn`/`region` adalah data publik geolokasi edge, bukan identitas pribadi.

---

## 🚀 Deploy (sekali saja)

Dari folder ini (`worker-visitor/`):

```bash
# 1) Buat database D1 → salin database_id ke wrangler.toml
npx wrangler d1 create portofolio-visits

# 2) Terapkan skema tabel
npx wrangler d1 execute portofolio-visits --remote --file=schema.sql

# 3) Buat namespace KV → salin id ke wrangler.toml
npx wrangler kv namespace create VISITS

# 4) Set secret (jangan pernah commit nilai asli)
#    PAKAI printf ('%s' tanpa newline) ATAU mode interaktif — trailing newline dari
#    `echo` membuat perbandingan key di worker gagal (safeEqual menolak panjang berbeda).
printf '%s' 'RANDOM_STRING_PANJANG' | npx wrangler secret put DASHBOARD_KEY  # kunci dashboard
printf '%s' 'RANDOM_SALT'           | npx wrangler secret put IP_HASH_SALT   # salt hash IP

# 5) Deploy
npx wrangler deploy
```

> ⚠️ **JANGAN pakai `[vars]` di `wrangler.toml` untuk DASHBOARD_KEY/IP_HASH_SALT**: deploy dengan `[vars]` akan **menimpa secret** yang sama namanya (terkonfirmasi saat deploy pertama — worker `authorized()` menolak `DASHBOARD_KEY` yang missing/placeholder `CHANGE_ME_*`, dan `recordVisit` fail-closed (HTTP 500, tidak merekam apa pun) jika `IP_HASH_SALT` tidak dikonfigurasi). Secret adalah satu-satunya sumber nilai produksi.

## 🔌 Hubungkan ke index.html

1. **Sudah terhubung**: `WORKER_URL` di `index.html` sudah diisi `https://portofolio-visitor-tracker.si-sigitadi.workers.dev`, CSP `connect-src`/`img-src` sudah mengizinkan origin worker, dan badge "Site Visits" muncul di footer setelah fetch pertama berhasil.
2. Jika suatu saat URL worker berubah: buka `index.html`, isi `var WORKER_URL = '<url-baru>';` di blok `<!-- Visitor Tracker Client ... -->` (dekat `</body>`), perbarui juga CSP `connect-src`/`img-src` di meta, lalu commit & push.

## 🔐 Akses dashboard privat

- `https://<worker-url>/dashboard?key=<DASHBOARD_KEY>` → halaman HTML.
- `https://<worker-url>/api/stats?key=<DASHBOARD_KEY>&range=30d` → JSON.
- Tanpa key (atau key salah) → 403 / halaman login. Perbandingan key memakai constant-time compare. **Anti-bocor key via referrer**: semua respons HTML dashboard/login mengirim header `Referrer-Policy: no-referrer` — jika Anda membuka link eksternal dari halaman dashboard (yang URL-nya memuat `?key=…`), key tidak pernah ikut terkirim sebagai `Referer`.
- **Shortcut tersembunyi**: di footer portofolio, klik teks copyright **9×** (selang antar-klik ≤ 2 dtk) → langsung membuka `/dashboard`. Kunci **tidak pernah** tersemat di HTML portofolio; di halaman login centang *"Remember key in this browser"* sekali, dan kunjungan berikutnya **auto-unlock** (kunci tersimpan di localStorage browser pemilik, satu origin dengan dashboard). Tautan *"Forget saved key"* di footer dashboard menghapusnya.

## 🧪 Uji

```bash
# Ping /count (tanpa auth)
curl "https://<worker-url>/count"

# Simulasikan kunjungan (dari IP Anda; request.cf hanya terisi saat sudah deployed)
curl -X POST "https://<worker-url>/hit" -H "Content-Type: application/json" \
     -d '{"path":"/","referrer":"https://example.com/"}'

# JSON dashboard
curl "https://<worker-url>/api/stats?key=<DASHBOARD_KEY>&range=7d"

# Body guard: payload > 10 KB ditolak 413 (tidak dicatat)
python -c "print('{\"path\":\"' + 'x'*20000 + '\"}')" | curl -s -w "\n[HTTP %{http_code}]\n" -X POST -H "Content-Type: application/json" --data-binary @- "https://<worker-url>/hit"
```

## 🧪 Route test suite (26 test, tanpa dependensi)

```bash
node --test worker-visitor/worker.test.js
```

Menutupi semua rute (`/count`, `/hit`, `/pixel`, `/api/stats`, `/api/export`, `/dashboard`): auth (403/200), rate-limit 429, body guard 413 (Content-Length & stream chunked), fail-closed `IP_HASH_SALT` (500), cache KV, quoting CSV, CORS. WAJIB hijau di setiap perubahan `worker.js` (gerbang CI preflight ketiga + Project_rules §1.9).

## ⚠️ Catatan & batas free tier

- **`request.cf` tidak terisi di preview `wrangler dev`** — uji geolokasi terhadap URL deployed.
- **KV**: TTL minimum 60 detik; tulis >1×/detik ke key yang sama dapat menolak — di sini cache `/count` 60s dan semua kegagalan KV di-swallow (tidak pernah memecah endpoint).
- **Rate limit**: maks 20 hit/menit per IP (via D1) — anti-spam.
- **Body guard `/hit` 10 KB**: payload lebih besar ditolak 413 sebelum parsing (via `Content-Length` maupun stream chunked) — anti-DoS body besar.
- **Dedupe unik harian**: berbasis query D1 per-kunjungan; dua kunjungan pertama simultan dari IP sama bisa sama-sama terhitung unik (race kosmetik, dampak nol di skala portfolio).
- **Free tier**: Worker 100k request/hari; D1 5 GB / 100k tulis & 5 juta baca per hari; KV 100k baca / 1k tulis per hari — jauh di atas kebutuhan portfolio.
- **Reset data**: `npx wrangler d1 execute portofolio-visits --remote --command "DELETE FROM visits"` (hati-hati, permanen).

## 📊 Fitur dashboard (sudah aktif)

Semua dirender sisi-klien tanpa CDN, dari 2.000 kunjungan terbaru:

- **Kartu statistik** (total, unik, hari ini) + **tren harian 30 hari** & **distribusi per jam (UTC)** — bar chart SVG.
- **Top 8 negara & kota** (flag emoji), **breakdown device/browser/OS** (parse UA), **peta dunia dot** (proyeksi equirectangular dari lat/lon edge).
- **Tabel** dengan filter rentang, **filter path**, pagination 50 baris/halaman.
- **Ekspor CSV**: tombol *Export CSV (view)* (hasil filter, sisi-klien) + `GET /api/export?key=…&range=…` (server-side, hingga 50.000 baris).
- **Auto-refresh 60 detik** (default ON, toggle di toolbar; polling `/api/stats` tanpa reload, fallback reload jika key tidak ada di URL).

## 🧩 Menambah fitur dashboard

Dashboard 100% dikode di `worker.js` (fungsi `dashboardPage`/`loginPage` + query D1). Alur menambah fitur:

1. Edit `worker-visitor/worker.js`.
2. Jalankan route test: `node --test worker-visitor/worker.test.js` (26 test — wajib hijau, Project_rules §1.9).
3. `npx wrangler deploy` (dari folder ini).
4. Muat ulang dashboard.

Data mentah per kunjungan sudah lengkap (ip_hash, city, country_code, lat, lon, timezone, asn, as_org, region, region_code, continent, is_bot, user_agent, referrer, path, is_unique, created_at) — sebagian besar fitur baru cukup agregasi sisi-klien.

## 🧹 File

| File | Fungsi |
|---|---|
| `worker.js` | Worker lengkap (rute, CORS, rate-limit, body guard 10 KB, hash IP, dashboard HTML) |
| `worker.test.js` | 26 route test (node:test, tanpa dependensi) |
| `package.json` | `type: module` + script `npm test` |
| `schema.sql` | Skema tabel D1 `visits` + index (fresh install) |
| `migration-org.sql` | Migrasi D1: tambah kolom asn/as_org/region/continent/is_bot ke tabel yang sudah ada |
| `wrangler.toml` | Konfigurasi deploy (binding D1/KV; tanpa `[vars]` — secret via `wrangler secret put`) |
