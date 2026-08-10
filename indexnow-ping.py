#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
indexnow-ping.py — Kirim ping IndexNow setelah konten live di GitHub Pages.

IndexNow adalah protokol terbuka yang memberi tahu mesin pencari (Bing, Yandex,
Seznam, Naver, Yep, dsb.) bahwa URL berubah, sehingga crawl dilakukan segera
alih-alih menunggu jadwal crawl berikutnya.

Alur script:
  1. Temukan file key `{KEY}.txt` di root repo (isi file = KEY itu sendiri,
     sesuai spesifikasi IndexNow: https://www.indexnow.org/documentation).
  2. Opsional: tunggu sampai halaman live benar-benar memuat konten terbaru
     (--wait-sha) — mencegah ping sebelum GitHub Pages selesai build.
  3. POST JSON ke https://api.indexnow.org/indexnow berisi host, key,
     keyLocation, dan urlList.

Contoh pemakaian:
  python indexnow-ping.py                     # auto-discover key, langsung ping
  python indexnow-ping.py --dry-run           # cetak payload tanpa mengirim
  python indexnow-ping.py --key-file abc.txt  # tentukan file key eksplisit
  python indexnow-ping.py --wait-sha index.html   # tunggu deploy, baru ping

Exit code: 0 = sukses (atau dry-run), 1 = gagal (key tak ditemukan / ping ditolak).
"""

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# Konstanta
# ---------------------------------------------------------------------------
API_ENDPOINT = "https://api.indexnow.org/indexnow"
DEFAULT_HOST = "sisigitadi.github.io"
DEFAULT_BASE_PATH = "/portofolio"
KEY_FILENAME_RE = re.compile(r"^[A-Za-z0-9-]{8,128}\.txt$")
LIVE_URL = "https://{host}{base_path}/index.html"


# ---------------------------------------------------------------------------
# Penemuan file key
# ---------------------------------------------------------------------------
def discover_key_file(root: Path) -> Path | None:
    """Temukan file key IndexNow di root repo.

    Sesuai spesifikasi, file bernama `{KEY}.txt` dan isinya persis KEY itu
    sendiri. Pindai semua *.txt di root dan cocokkan nama/isi + pola karakter
    (alfanumerik & tanda hubung, 8-128 karakter).
    """
    for candidate in sorted(root.glob("*.txt")):
        name = candidate.name
        if not KEY_FILENAME_RE.match(name):
            continue
        key = name[: -len(".txt")]
        try:
            content = candidate.read_text(encoding="utf-8").strip()
        except OSError:
            continue
        if content == key:
            return candidate
    return None


def load_key(root: Path, key_file: str | None) -> tuple[str, Path] | None:
    """Muat key + path file key. Prioritas argumen --key-file, lalu auto-discover."""
    if key_file:
        p = Path(key_file)
        if not p.is_absolute():
            p = root / p
        if not p.exists():
            print(f"[indexnow] ERROR: file key tidak ditemukan: {p}")
            return None
        key = p.name[: -len(".txt")] if p.name.lower().endswith(".txt") else p.read_text(encoding="utf-8").strip()
        if not KEY_FILENAME_RE.match(p.name):
            print(f"[indexnow] ERROR: nama file key tidak valid (harus {KEY_FILENAME_RE.pattern}): {p.name}")
            return None
        return key, p

    found = discover_key_file(root)
    if found is None:
        print("[indexnow] ERROR: file key IndexNow tidak ditemukan di root repo.")
        print("[indexnow]         Buat file `{KEY}.txt` (isi = KEY) dari Bing Webmaster Tools -> Configuration -> IndexNow,")
        print("[indexnow]         atau generate key sendiri (8-128 char alfanumerik + tanda hubung) lalu daftarkan.")
        return None
    key = found.name[: -len(".txt")]
    return key, found


# ---------------------------------------------------------------------------
# Tunggu sampai konten live == konten lokal (verifikasi deploy selesai)
# ---------------------------------------------------------------------------
def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def deployed_content_hash(root: Path, rel_path: str) -> str | None:
    """Hash konten PERSIS yang akan di-deploy dari repo (git HEAD), bukan file
    kerja lokal.

    Alasan: checkout Windows menormalkan baris baru menjadi CRLF (core.autocrlf),
    sehingga sha256 file lokal != sha256 konten di GitHub/Live (LF). Karena yang
    di-deploy adalah konten commit (LF), hash harus dihitung dari `git show
    HEAD:file`. Fallback bila git tidak tersedia: baca file lokal lalu normalisasi
    CRLF -> LF.
    """
    try:
        import subprocess

        out = subprocess.run(
            ["git", "show", f"HEAD:{rel_path}"],
            cwd=root,
            capture_output=True,
            timeout=15,
        )
        if out.returncode == 0:
            return _sha256(out.stdout)
    except Exception:
        pass

    # Fallback: normalisasi CRLF -> LF agar sebanding dengan konten deployed.
    try:
        raw = (root / rel_path).read_bytes()
        return _sha256(raw.replace(b"\r\n", b"\n"))
    except OSError:
        return None


def _fetch_live_sha(url: str) -> str | None:
    """Ambil konten live dan kembalikan sha256-nya (tanpa Accept-Encoding agar
    server mengirim body polos, sehingga hash sebanding dengan file lokal)."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (IndexNow ping script)"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read()
        return hashlib.sha256(body).hexdigest()
    except Exception:
        return None


def wait_until_deployed(root: Path, wait_sha: str, timeout: int) -> bool:
    """Polling halaman live sampai sha256-nya sama dengan file lokal.

    GitHub Pages butuh ±1-3 menit rebuild setelah push; ping sebelum live hanya
    membuang sinyal (Bing crawl melihat konten lama). Mengembalikan True bila
    konten sudah live sebelum timeout, False bila timeout (ping tetap dijalankan
    best-effort oleh pemanggil).
    """
    rel_path = wait_sha
    target = deployed_content_hash(root, rel_path)
    if target is None:
        print(f"[indexnow] WARN: file untuk --wait-sha tidak bisa dibaca: {rel_path} — dilewati.")
        return True

    url = LIVE_URL.format(host=DEFAULT_HOST, base_path=DEFAULT_BASE_PATH)
    print(f"[indexnow] Menunggu deploy selesai (target sha256: {target[:12]}...) - max {timeout}s")
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        live = _fetch_live_sha(url)
        if live == target:
            print("[indexnow] [OK] Konten live sudah mutakhir (sha256 cocok).")
            return True
        time.sleep(15)
    print(f"[indexnow] [WARN] Timeout {timeout}s - konten live belum sama dengan repo. Ping tetap dilanjutkan (best-effort).")
    return False


# ---------------------------------------------------------------------------
# Ping IndexNow
# ---------------------------------------------------------------------------
def build_payload(host: str, key: str, key_location: str, urls: list[str]) -> dict:
    return {"host": host, "key": key, "keyLocation": key_location, "urlList": urls}


def ping_indexnow(payload: dict, dry_run: bool, verbose: bool) -> bool:
    if dry_run:
        print("[indexnow] [DRY-RUN] payload yang akan dikirim:")
        print(json.dumps(payload, indent=2))
        return True

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "Mozilla/5.0 (IndexNow ping script)"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.getcode()
    except urllib.error.HTTPError as e:
        status = e.code
        detail = e.read().decode("utf-8", "replace")[:200]
        if verbose:
            print(f"[indexnow] detail respon ({status}): {detail}")
    except Exception as e:
        print(f"[indexnow] ERROR jaringan: {e}")
        return False

    if status in (200, 202):
        note = " (diterima, validasi key menunggu fetch pertama)" if status == 202 else ""
        print(f"[indexnow] [OK] Ping IndexNow sukses - HTTP {status}{note}")
        return True
    if status == 403:
        print("[indexnow] [FAIL] HTTP 403 - key tidak valid. Pastikan `{KEY}.txt` live di situs dan isinya == nama file.")
    elif status == 422:
        print("[indexnow] [FAIL] HTTP 422 - URL tidak cocok dengan host/keyLocation.")
    elif status == 429:
        print("[indexnow] [FAIL] HTTP 429 - rate limit. Coba lagi nanti.")
    else:
        print(f"[indexnow] [FAIL] Ping gagal - HTTP {status}.")
    return False


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Kirim ping IndexNow setelah deploy GitHub Pages.")
    p.add_argument("--key-file", default=None, help="Path file key `{KEY}.txt` (default: auto-discover di root repo)")
    p.add_argument("--host", default=DEFAULT_HOST, help=f"Host situs (default: {DEFAULT_HOST})")
    p.add_argument("--base-path", default=DEFAULT_BASE_PATH, help=f"Subpath situs (default: {DEFAULT_BASE_PATH})")
    p.add_argument("--key-location", default=None, help="URL lengkap file key (default: https://{host}{base_path}/{key}.txt)")
    p.add_argument("--urls", nargs="*", default=None, help="Daftar URL yang di-ping (default: homepage + sitemap)")
    p.add_argument("--wait-sha", default=None, metavar="FILE", help="Tunggu hingga konten live == FILE (mis. index.html) sebelum ping")
    p.add_argument("--wait-timeout", type=int, default=360, help="Timeout tunggu deploy dalam detik (default: 360)")
    p.add_argument("--dry-run", action="store_true", help="Cetak payload tanpa mengirim")
    p.add_argument("--verbose", action="store_true", help="Tampilkan detail respon error")
    return p.parse_args(argv)


def main(argv: list[str] | None = None, root: Path | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    root = root or Path(__file__).resolve().parent

    loaded = load_key(root, args.key_file)
    if loaded is None:
        return 1
    key, key_file = loaded
    print(f"[indexnow] Key ditemukan: {key_file.name}")

    # Tunggu deploy (opsional) — best-effort, tidak menggagalkan ping
    if args.wait_sha:
        wait_until_deployed(root, args.wait_sha, args.wait_timeout)

    base = f"https://{args.host}{args.base_path}"
    key_location = args.key_location or f"{base}/{key_file.name}"
    urls = args.urls or [base + "/", base + "/sitemap.xml"]

    payload = build_payload(args.host, key, key_location, urls)
    print(f"[indexnow] Host: {args.host} | keyLocation: {key_location}")
    print(f"[indexnow] URL ({len(urls)}):")
    for u in urls:
        print(f"           - {u}")

    ok = ping_indexnow(payload, args.dry_run, args.verbose)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
