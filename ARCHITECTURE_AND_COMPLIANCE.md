# 🏛️ PANDUAN ARSITEKTUR, KEPATUHAN & TATA KELOLA PLATFORM
### Sigit Adi Irianto — Personal Digital Platform
*Dokumen Kepatuhan Resmi untuk Pengembangan, Perubahan, dan Akuntabilitas Berkelanjutan.*

---

## 1. Prinsip Utama & Single Source of Truth (SSOT)

Platform ini dirancang dengan pendekatan **Clean Architecture & Zero Fabrication**, di mana seluruh klaim profesional, angka metrik, proyek, dan sertifikasi terikat pada basis data terverifikasi:

* **Canonical Ledger**: [`src/data/verified_ledger.json`](file:///d:/Projects/portofolio-main/src/data/verified_ledger.json)
* **Master CV**: [`master_cv_v2.md`](file:///d:/Projects/portofolio-main/master_cv_v2.md)
* **Matriks Bukti Klaim**: [`evidence_and_claim_matrix.md`](file:///d:/Projects/portofolio-main/evidence_and_claim_matrix.md)
* **Single Master Document**: [`index.html`](file:///d:/Projects/portofolio-main/index.html)

---

## 2. Prosedur Perubahan & Migrasi Hosting (How-to Guide)

Untuk memudahkan pengembangan di masa depan tanpa memerlukan panel kontrol eksternal, seluruh perubahan dilakukan secara langsung dan transparan pada berkas sumber:

### A. Migrasi Tautan Proyek (Live Demo & Source Code)
Saat Anda memindahkan proyek dari GitHub Pages (`sisigitadi.github.io/...`) ke VPS mandiri atau custom domain baru:
1. Buka [`src/data/verified_ledger.json`](file:///d:/Projects/portofolio-main/src/data/verified_ledger.json).
2. Perbarui `liveUrl` atau `repoUrl` pada objek proyek yang bersangkutan.
3. Buka [`index.html`](file:///d:/Projects/portofolio-main/index.html) dan perbarui tautan `<a href="...">` pada section proyek.
4. Jalankan audit: `python audit.py index.html`.

### B. Mengganti Screenshot / Media Proyek
1. Simpan berkas gambar baru beresolusi tinggi di folder `assets/` (misal: `assets/proyek-baru.png`).
2. Perbarui tag `<img src="assets/proyek-baru.png" ...>` pada [`index.html`](file:///d:/Projects/portofolio-main/index.html).
3. Pastikan path relatif valid (tanpa leading slash) agar kompatibel dengan GitHub Pages maupun hosting mandiri.

### C. Menambahkan Riwayat Karir atau Sertifikasi Baru
1. Tambahkan entri pada array `tenures` atau `certifications` di `src/data/verified_ledger.json`.
2. Masukkan baris baru di section `Experience` atau `Certifications` pada `index.html`.
3. Pastikan format cetak tetap memenuhi **ATS 2-Page Print Parity** (tidak meluap ke halaman ke-3).

---

## 3. Standar Kepatuhan Cetak (ATS 2-Page Print Parity)

Platform wajib menghasilkan **Resume Eksekutif 2 Halaman Standar ATS** yang presisi saat dicetak atau diekspor ke PDF (`Ctrl + P`):

* **Ukuran Kertas**: A4 Portrait (`margin: 10mm 12mm`).
* **Tipografi Print**: Arial / Helvetica / Sans-serif (`9pt`, line-height `1.3`).
* **Layout**: *Single-Column* tanpa elemen web dekoratif (gambar, navbar, footer, form, dan tombol disembunyikan via `@media print`).
* **Pemisahan Halaman (*Page Break*)**:
  * **Halaman 1**: Header, Ringkasan Eksekutif, Kontak, dan 4 Proyek Unggulan.
  * **Halaman 2**: Linimasa Karir (2002–2026), Sertifikasi, Pendidikan, dan Bahasa.

---

## 4. Kepatuhan Keamanan & Content Security Policy (CSP)

Setiap script inline pada `index.html` dilindungi oleh **Content Security Policy (CSP)** berbasis hash SHA-256 untuk mencegah serangan XSS:

### Prosedur Sinkronisasi Hash CSP:
Jika Anda memodifikasi script JavaScript inline di dalam `index.html`:
1. Jalankan engine audit:
   ```powershell
   python audit.py index.html
   ```
2. Jika ada perubahan karakter script, audit akan memberikan pesan `[FAIL]` beserta nilai hash SHA-256 yang dihitung.
3. Salin nilai hash tersebut (format: `'sha256-...'`) dan perbarui tag `<meta http-equiv="Content-Security-Policy">` pada bagian `script-src`.
4. Jalankan kembali `python audit.py index.html` hingga menghasilkan **15 PASS | 0 FAIL**.

---

## 5. Kepatuhan Privasi (UU Perlindungan Data Pribadi - UU PDP)

1. **Zero Cookie Tracking**: Platform tidak menggunakan cookie pihak ketiga atau script pelacak yang mengumpulkan data pribadi pengunjung.
2. **Salted IP Anonymization**: Sistem penghitung kunjungan pada Cloudflare Worker (`worker-visitor/`) mengenkripsi alamat IP dengan **Salted SHA-256** dan tidak pernah menyimpan IP mentah di basis data D1.
3. **Form Transmisi Kontak**: Formulir kontak dihubungkan langsung ke Formspree HTTPS (`https://formspree.io/f/mkgknrqk`) dengan proteksi honeypot anti-bot (`name="_gotcha"`).

---

## 6. Verifikasi & Otomasi Pengujian

Sebelum mempublikasikan perubahan ke repositori produksi:

```powershell
# 1. Audit Kepatuhan HTML, SEO, JSON-LD, ATS Print & CSP
python audit.py index.html

# 2. Pengujian Unit Audit & Crawler Ping Engine
python -m pytest test_audit.py test_indexnow_ping.py -v

# 3. Pengujian Integritas Data Ledger & Cloudflare Worker
node --test tests/test_platform_core.js worker-visitor/worker.test.js
```
*(Seluruh pengujian wajib berstatus **PASS 100%** sebelum melakukan git push).*
