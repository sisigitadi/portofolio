# 10 Konsep Tema Futuristik — Portofolio Sigit Adi Irianto

> Stack: **React + Vite** · **@react-three/fiber + drei** (3D) · **framer-motion** (UI motion)
> Semua konsep dibangun dari konten nyata portofolio: Wazuh SIEM, Docker/Ubuntu, Ollama & prompt engineering, UU PDP / BYOK, MTTR −45%, 20+ tahun karier 2002→2026, 4 proyek infrastruktur paralel (PUPR), SOC & IR playbooks, sertifikasi BSSN/DevSecOps/pen-test.

---

## Ringkasan Review (Code & Konten)

### Kode — yang sudah kuat
- **Gerbang kualitas berlapis**: `audit.py` (12 check), 52 unit test pytest, pre-commit/pre-push hook, CI Lighthouse (a11y/BP/SEO wajib 100, perf ≥ 50 warn) — langka dan sangat profesional.
- **Arsitektur 100% client-side**: Tailwind ter-compile statis, CSP, PWA + service worker, i18n EN/ID, dark/light theme FOUC-proof, BYOK & UU PDP privacy story yang kredibel.
- **SEO**: JSON-LD Person + WebSite, OG/Twitter, sitemap, IndexNow, canonical konsisten.

### Kode — yang bisa ditingkatkan menuju "futuristik"
- Satu file `index.html` 3.581 baris (HTML+CSS+JS). Migrasi ke React/r3f otomatis memecah ini jadi modul.
- Visual masih "AI-template adjacent": glassmorphism cyan/emerald, particle canvas 2D, scanline overlay, gradient text. Preview `design-previews/` jelas mencoba kabur dari itu — 10 konsep ini melanjutkan arah tersebut dengan 3D sungguhan (WebGL), bukan efek CSS.
- **Catatan performa (gate Lighthouse perf ≥ 50)**: r3f harus di-lazy-load hanya di hero (atau frameloop `demand`), `dpr={[1, 1.5]}`, matikan WebGL saat `prefers-reduced-motion`, dan beri fallback statis penuh (Canvas di-render hanya jika WebGL tersedia).

### Konten — yang sudah kuat
- Narasi "20+ tahun ops + SOC + applied AI" konsisten di hero, about, experience, testimonial, sertifikat.
- **Metrik konkret** (MTTR −45%, tim 50+ staf) dan **case study berformat Challenge → Approach → Result** di modal — ini emas untuk tema "operational console".
- Proyek nyata + link produksi; tulisan Medium relevan (Wazuh+Telegram, data exfil, brute force).

### Konten — gap yang bisa diisi konsep-konsep ini
- Belum ada visualisasi **garis waktu 24 tahun** sebagai "cerita" (timeline sekarang linear & panjang).
- Belum ada "peta keterampilan" — skill tersebar di badge; tema 3D bisa menjadikannya peta interaktif.
- Cerita "4 proyek paralel" (PUPR) & remote multi-timezone belum dieksploitasi secara visual.

---

## Prinsip Gerak Bersama (semua konsep)

1. **Satu "wajah gerak" per tema** — jangan campur: kalau radar, semua section berputar/seperti scan; kalau konsol, semua masuk sebagai log line.
2. **Motion = data, bukan hiasan**: angka naik (MTTR 45%) dengan `useSpring`/`animate` count-up; status LED berdenyut = fakta uptime; line = log asli.
3. **Transisi antar section** memakai `useScroll` + `useTransform` (scroll-scrubbed), bukan animasi acak. Section keluar = "di-scan", "di-archive", "takeoff", dst — konsisten dengan metafora tema.
4. **Aksesibilitas & kinerja tetap dijaga** (ini harga mati di repo ini): `prefers-reduced-motion` mematikan WebGL + gerak, `AnimatePresence` untuk konten penting tidak pernah `display:none` pada elemen fokus, Canvas `frameloop="demand"` kecuali ada animasi kontinu.

---

## KONSEP 01 — PERIMETER (Threat Radar Dome)
**Karakter**: Analis SOC menjaga perimeter. Portofolio = layar radar 3D.

- **3D centerpiece (r3f/drei)**: kubah radar — `Sphere` wireframe + `Line` (drei) untuk ring scan, `Float` untuk "blip" yang melayang. Tiap blip = proyek/domain (Wazuh, Ollama, Docker, PromptMatrix…). Hover blip → tooltip `Html` (drei) menampilkan kartu proyek.
- **Framer-motion**: sapuan radar (rotating sweep) dikontrol `useMotionValue`; section masuk via "scan reveal" (clip-path ring menyapu teks). Angka statistik muncul seperti readout telemetri.
- **Transisi**: antar section disapu garis scan kiri→kanan; footer "signal lost" → hero "signal acquired".
- **Palet/Type**: hitam #0A0E13, amber fosfor #FFB454, hijau #3FB950; mono (JetBrains Mono).
- **Kenapa cocok**: ini pekerjaannya sehari-hari — site terasa seperti tools yang dia pakai, bukan dekorasi.

## KONSEP 02 — LATENT (Neural Weight-Space Flight)
**Karakter**: AI engineer menerbangkan kamera menembus ruang embedding model LLM.

- **3D centerpiece**: `Points` + custom `BufferGeometry` (ratusan titik "token") dengan warna per cluster (prompt/security/privacy); `CameraRig` (drei pattern) = kamera menyusuri kurva melalui ruang titik saat scroll (`useScroll` → kamera posisi). Proyek = "checkpoint" — hover membuat kamera bergeser mendekati cluster.
- **Framer-motion**: teks hero muncul sebagai token yang "ditempelkan" satu-satu; judul section = label dimensi (axis).
- **Transisi**: fade antar cluster + `scale` halus; "traversal" antar section.
- **Palet/Type**: deep violet-hitam + cyan dingin + emas untuk highlight; sans geometris (Space Grotesk).
- **Kenapa cocok**: PromptMatrix, LLM eval, Ollama — metafora latent space paling pas untuk profil applied-AI.

## KONSEP 03 — COMMAND (Mission Control Deck)
**Karakter**: 20+ tahun operasi = komandan misi; site = dek komando holografik.

- **3D centerpiece**: meja/dek 3D — `RoundedBox` (drei) panel holo yang berputar pelan (`Float` + `OrbitControls` slow, autoRotate), globe `Sphere` ber-label lokasi (Tangerang, proyek BPDLH, remote global).
- **Framer-motion**: boot sequence saat load (log "POWER ON → SENSOR CHECK → ALL SYSTEMS NOMINAL"), lalu panel statistik muncul staggered seperti telemetry; progress bar misi untuk tiap section.
- **Transisi**: section = "phase" misi; counter besar (MTTR −45%, 20+ yrs, 50+ staff) count-up dengan `animate`.
- **Palet/Type**: grafit + cyan + amber; layar besar, tipografi eksperimental di judul (Chakra Petch).
- **Kenapa cocok**: menangkap skala karier (IT Manager, Project Office Manager) tanpa terdengar sombong.

## KONSEP 04 — HARBOR (Container Registry Digital Twin)
**Karakter**: Admin Docker/DevSecOps — portofolio = registri container hidup.

- **3D centerpiece**: rak server 3D — tiap proyek adalah "container image" (`RoundedBox` + label layer `Html`); status LED (running/healthy) berdenyut; `useFrame` animasi denyut; hover container → expand layer-layer image (build steps). Stack = `Registry`/`Repository` dalam scene.
- **Framer-motion**: container "pulled" masuk scene saat scroll; tag tech = image tags (`:latest`, `:2.0.0`); pipeline progress bar animasi di footer.
- **Transisi**: section diganti seperti `docker ps` tabel; "docker inspect" untuk detail proyek.
- **Palet/Type**: biru laut tua + aqua + putih terminal; mono.
- **Kenapa cocok**: dia benar-benar mengelola Docker di produksi (BPDLH, WSL/Ubuntu) — digital twin infrastruktur yang ia kelola.

## KONSEP 05 — VERIFY (Holographic Identity Vault)
**Karakter**: Kredensial + privasi (UU PDP, BYOK) — portofolio = vault identitas holografik yang bisa diverifikasi.

- **3D centerpiece**: "ID card" holografik berputar di tengah (`RoundedBox` + material transparent, `Float`); garis scan menyapu kartu secara berkala (shader atau plane tipis), tiap field (NAME, ROLE, LOCATION, STATUS: AVAILABLE) menyala berurutan.
- **Framer-motion**: field kartu "didekripsi" teks per karakter; sertifikat = "seal" yang muncul dengan stamp effect (scale + opacity cepat); badge verifikasi di tiap section.
- **Transisi**: bagian kontak = "handshake" (kartu berbalik ke sisi QR/contact).
- **Palet/Type**: putih es + hitam + satu aksen emas/cyan; bersih, institusional.
- **Kenapa cocok**: cerita BYOK & UU PDP-nya kuat — tema ini menjadikan "privasi & verifikasi" sebagai identitas visual, bukan sekadar catatan kecil.

## KONSEP 06 — ORBIT (24-Year Career Trajectory)
**Karakter**: Karier panjang = orbit satelit; remote global = lintas timezone.

- **3D centerpiece**: planet + ring orbit (`Sphere` + `Torus` ring); tiap milestone karier = satelit pada orbit dengan tahun; scroll menggerakkan kamera mengelilingi planet (`useScroll` → camera angle) — 2002 sampai 2026.
- **Framer-motion**: label satelit muncul saat mendekat; timeline = "insertion burn" (satelit masuk orbit) — sangat sinematik.
- **Transisi**: antar periode karier = kamera berpindah orbit; waktu = tema gerak.
- **Palet/Type**: ruang angkasa (deep navy + ungu redup) + krem kertas untuk teks (membumi, manusiawi).
- **Kenapa cocok**: memecahkan masalah "timeline 10 posisi terlalu panjang" jadi satu gerakan visual yang berkesan.

## KONSEP 07 — EVIDENCE (Forensics Case Files)
**Karakter**: Incident responder & pen-tester — portofolio = lemari bukti digital.

- **3D centerpiece**: "evidence locker" — kartu case file melayang dalam grid 3D (`RoundedBox` + `Html`), sebagian ter-redaksi (kotak hitam yang animasi lebarnya dengan framer-motion — motif klasik dokumen rahasia). Tiap proyek = case file dengan nomor (CASE-2026-001).
- **Framer-motion**: redaction bar membuka saat hover; chain-of-custody untuk timeline karier; "stamp" CLASSIFIED/VERIFIED di dokumen.
- **Transisi**: section = "dibuka berkas" (fold-open atau slide dari tumpukan).
- **Palet/Type**: kertas krem + tinta hitam + merah stempel; serif/typewriter untuk kontras dengan tema futuristik.
- **Kenapa cocok**: IR playbooks NIST, pen-test cert, incident handling — metafora forensik yang kredibel dan out-of-the-box.

## KONSEP 08 — ARCHIVE (Syslog Time Capsule 2002→2026)
**Karakter**: 24 tahun sysadmin — portofolio = vault arsip log.

- **3D centerpiece**: lobi vault vertikal — rak-rak "tahun" (tiap dekade = satu tingkat rak `RoundedBox`); scroll vertikal = kamera turun/naik melalui vault (`useScroll` → kamera Y). Log line asli (wazuh, docker ps, uptime) mengalir di HUD.
- **Framer-motion**: baris log "diketik" saat dekade masuk viewport; tahun sebagai marker besar.
- **Transisi**: antar era = berganti lantai vault; footer = "ARCHIVE CLOSED — kembali ke 2026".
- **Palet/Type**: hijau fosfor monokrom (terminal) + aksen krem untuk label tahun.
- **Kenapa cocok**: dokumentasi & sejarah adalah kekuatannya (disiplin docs, runbook) — vault log = portofolio yang "terarsipkan dengan rapi".

## KONSEP 09 — TOWER (Project Air-Traffic Control)
**Karakter**: Project Office Manager yang mengelola 4 proyek infrastruktur paralel — portofolio = menara pengatur lalu lintas proyek.

- **3D centerpiece**: radar/layar bandara 3D — proyek sebagai pesawat pada approach path; proyek aktif = di udara (bergerak `useFrame`), selesai = parked. `Line` untuk jalur pendekatan; HUD tower dengan status tiap proyek.
- **Framer-motion**: kartu proyek = "flight strip" (stip kertas ATC) yang geser; statistik = departure board.
- **Transisi**: antar section seperti pergantian "clearance" — pesan kontrol lalu lintas singkat.
- **Palet/Type**: hijau radar + hitam + putih; mono tebal.
- **Kenapa cocok**: pengalaman multi-proyek (RWS, Dadi Muria, Jragung, Waduk Bener) dan koordinasi lintas tim jadi cerita visual yang langka di portofolio.

## KONSEP 10 — OPERATOR (Promptable AI Console)
**Karakter**: Prompt engineer & LLM evaluator — portofolio = konsol yang bisa "di-prompt".

- **3D centerpiece**: "core" AI — icosahedron `MeshDistortMaterial` (drei) berenergi di belakang hero; bereaksi (berdenyut/berubah warna) saat user mengetik di command bar.
- **Framer-motion**: navigasi = chat/console: user ketik intent ("projects", "experience", "certifications") → section berpindah dengan `AnimatePresence` seperti respons asisten; jawaban "diketik" token-per-token.
- **Transisi**: `mode="wait"` + slide horizontal untuk pergantian section — terasa seperti percakapan.
- **Palet/Type**: hitam + cyan/ungu redup; mono; prompt prefix `$` di mana-mana.
- **Kenapa cocok**: dia melatih LLM dan mengevaluasi prompt — portofolio yang "bisa diprompt" adalah demo langsung keahliannya, bukan sekadar klaim.

---

## Rekomendasi

- **Mulai dari KONSEP 01 PERIMETER** — paling dekat dengan identitas SecOps, paling mudah dieksekusi dengan drei (`Sphere`/`Line`/`Float`/`Html` tanpa asset eksternal), dan paling beda dari preview 2D yang sudah ada.
- **KONSEP 02 LATENT** paling "wow" untuk rekruter AI, tapi butuh tuning performa Points (pilih 3–6k titik, shader sederhana).
- Semua konsep wajib mempertahankan: fallback statis penuh (no-WebGL), `prefers-reduced-motion`, Lighthouse gate a11y/BP/SEO 100, dan cerita BYOK/UU PDP di bagian kontak.

---

## Catatan Teknis Implementasi (dipakai semua konsep)

```jsx
// Lazy-load Canvas hanya di hero — jaga bundle & Lighthouse perf
const Scene = lazy(() => import('./three/Scene'))
// <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 45, position: [0, 0, 8] }} />
// matikan WebGL & gerak saat reduced-motion:
const { reducedMotion } = useReducedMotion() // framer-motion
```
