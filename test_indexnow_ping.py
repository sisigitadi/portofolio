# -*- coding: utf-8 -*-
"""Unit test indexnow-ping.py (pytest).

Menguji fungsi-fungsi murni indexnow-ping.py tanpa mengirim ping jaringan:
  - auto-discover file key `{KEY}.txt` (nama = isi, pola 8-128 alfanumerik/hyphen)
  - pembangunan payload IndexNow (host, key, keyLocation, urlList)
  - fallback CRLF -> LF pada deployed_content_hash (perilaku lintas-platform)
  - logika wait_until_deployed (tanpa jaringan; _fetch_live_sha di-mock)
  - parsing argumen CLI & exit code

Catatan: nama file ber-tanda hubung (indexnow-ping.py) tidak bisa di-import
dengan `import` biasa, jadi dimuat lewat importlib.util.

Jalankan: python -m pytest test_indexnow_ping.py -v
"""

import hashlib
import importlib.util
import subprocess
from pathlib import Path

import pytest

# Subprocess di-import lokal di dalam deployed_content_hash(); mem-patch
# subprocess.run global sama efektifnya karena keduanya objek modul yang sama.
NO_GIT = lambda *a, **k: None  # noqa: E731 — menggagalkan `git show` di test

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "indexnow-ping.py"

# ---------------------------------------------------------------------------
# Load module (nama file ber-tanda hubung -> importlib)
# ---------------------------------------------------------------------------
@pytest.fixture(scope="module")
def mod():
    if not MODULE_PATH.exists():
        pytest.skip("indexnow-ping.py tidak ditemukan di root proyek")
    spec = importlib.util.spec_from_file_location("indexnow_ping_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def no_sleep(monkeypatch, mod):
    """Netralkan time.sleep agar test wait_until_deployed tidak melambat."""
    monkeypatch.setattr(mod.time, "sleep", lambda s: None)


# ---------------------------------------------------------------------------
# Auto-discover file key
# ---------------------------------------------------------------------------
def _write_key(tmp_path, name, content):
    p = tmp_path / name
    p.write_text(content, encoding="utf-8")
    return p


def test_discover_key_finds_valid(tmp_path, mod):
    """File `{KEY}.txt` dengan isi == nama ditemukan oleh auto-discover."""
    _write_key(tmp_path, "6605868618dc4f34b628743b70f6d7c9.txt", "6605868618dc4f34b628743b70f6d7c9")
    found = mod.discover_key_file(tmp_path)
    assert found is not None
    assert found.name == "6605868618dc4f34b628743b70f6d7c9.txt"


def test_discover_key_ignores_content_mismatch(tmp_path, mod):
    """Nama valid tapi isi != nama -> dilewati (bukan key IndexNow)."""
    _write_key(tmp_path, "6605868618dc4f34b628743b70f6d7c9.txt", "beda-key")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_short_name(tmp_path, mod):
    """Nama < 8 karakter -> dilewati (di bawah batas spesifikasi)."""
    _write_key(tmp_path, "abc.txt", "abc")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_invalid_chars(tmp_path, mod):
    """Nama dengan karakter di luar [A-Za-z0-9-] -> dilewati."""
    _write_key(tmp_path, "key_under_score_123.txt", "key_under_score_123")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_plain_txt(tmp_path, mod):
    """File .txt biasa (README, notes) bukan key -> dilewati."""
    _write_key(tmp_path, "catatan.txt", "ini bukan key")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_picks_among_multiple(tmp_path, mod):
    """Satu key valid di antara banyak file -> hanya key valid yang dipilih."""
    _write_key(tmp_path, "catatan.txt", "bukan key")
    _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    found = mod.discover_key_file(tmp_path)
    assert found is not None
    assert found.name == "abc1234567890.txt"


def test_load_key_explicit(tmp_path, mod):
    """--key-file eksplisit menang, auto-discover tidak diperlukan."""
    p = _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    loaded = mod.load_key(tmp_path, str(p))
    assert loaded is not None
    key, path = loaded
    assert key == "abc1234567890"
    assert path == p


def test_load_key_missing_file(tmp_path, mod, capsys):
    """--key-file menunjuk file tak ada -> None + pesan error."""
    loaded = mod.load_key(tmp_path, "tidak-ada.txt")
    assert loaded is None
    assert "tidak ditemukan" in capsys.readouterr().out


def test_load_key_invalid_name(tmp_path, mod, capsys):
    """--key-file dengan nama tak valid -> None."""
    p = _write_key(tmp_path, "key_under_score_123.txt", "key_under_score_123")
    loaded = mod.load_key(tmp_path, str(p))
    assert loaded is None
    assert "tidak valid" in capsys.readouterr().out


def test_load_key_auto_discovers(tmp_path, mod):
    """Tanpa --key-file: key ditemukan otomatis dari root."""
    _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    loaded = mod.load_key(tmp_path, None)
    assert loaded is not None
    key, _ = loaded
    assert key == "abc1234567890"


def test_load_key_none_when_no_key(tmp_path, mod, capsys):
    """Tanpa key sama sekali -> None + pesan error yang jelas."""
    loaded = mod.load_key(tmp_path, None)
    assert loaded is None
    out = capsys.readouterr().out
    assert "tidak ditemukan" in out


# ---------------------------------------------------------------------------
# Payload IndexNow
# ---------------------------------------------------------------------------
def test_build_payload_shape(mod):
    payload = mod.build_payload(
        "sisigitadi.github.io",
        "6605868618dc4f34b628743b70f6d7c9",
        "https://sisigitadi.github.io/portofolio/6605868618dc4f34b628743b70f6d7c9.txt",
        ["https://sisigitadi.github.io/portofolio/", "https://sisigitadi.github.io/portofolio/sitemap.xml"],
    )
    assert payload["host"] == "sisigitadi.github.io"
    assert payload["key"] == "6605868618dc4f34b628743b70f6d7c9"
    assert payload["keyLocation"] == "https://sisigitadi.github.io/portofolio/6605868618dc4f34b628743b70f6d7c9.txt"
    assert payload["urlList"] == [
        "https://sisigitadi.github.io/portofolio/",
        "https://sisigitadi.github.io/portofolio/sitemap.xml",
    ]


def test_build_payload_json_serializable(mod):
    import json

    payload = mod.build_payload("h", "k", "l", ["u1", "u2"])
    parsed = json.loads(json.dumps(payload))  # harus tidak error & round-trip
    assert parsed == payload


def test_ping_dry_run_returns_true(mod, capsys):
    """--dry-run: tidak mengirim jaringan, selalu True + mencetak payload."""
    payload = mod.build_payload("h", "k", "l", ["u1"])
    ok = mod.ping_indexnow(payload, dry_run=True, verbose=False)
    assert ok is True
    assert "DRY-RUN" in capsys.readouterr().out


def test_ping_http_errors(mod, monkeypatch, capsys):
    """Kode status HTTP tidak valid -> False (tanpa jaringan sungguhan)."""
    import urllib.error

    class FakeResp:
        def getcode(self):
            return 200

        def read(self):
            return b""

    class FakeURL:
        def __enter__(self):
            return FakeResp()

        def __exit__(self, *a):
            return False

    def fake_urlopen(req, timeout=30):
        return FakeURL()

    monkeypatch.setattr(mod.urllib.request, "urlopen", fake_urlopen)
    ok = mod.ping_indexnow({"host": "h"}, dry_run=False, verbose=False)
    assert ok is True


def test_ping_http_403_fails(mod, monkeypatch, capsys):
    """HTTP 403 (key invalid) -> False + pesan jelas."""
    import urllib.error

    def fake_urlopen(req, timeout=30):
        raise urllib.error.HTTPError("", 403, "Forbidden", None, None)

    monkeypatch.setattr(mod.urllib.request, "urlopen", fake_urlopen)
    ok = mod.ping_indexnow({"host": "h"}, dry_run=False, verbose=False)
    assert ok is False
    assert "403" in capsys.readouterr().out


def test_ping_network_error_fails(mod, monkeypatch, capsys):
    """Error jaringan -> False (tidak crash)."""

    def fake_urlopen(req, timeout=30):
        raise OSError("network down")

    monkeypatch.setattr(mod.urllib.request, "urlopen", fake_urlopen)
    ok = mod.ping_indexnow({"host": "h"}, dry_run=False, verbose=False)
    assert ok is False
    assert "ERROR jaringan" in capsys.readouterr().out


# ---------------------------------------------------------------------------
# deployed_content_hash — fallback CRLF (perilaku Windows checkout)
# ---------------------------------------------------------------------------
def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def test_crlf_fallback_normalizes(tmp_path, mod, monkeypatch):
    """Fallback (tanpa git) menormalkan CRLF -> LF sebelum hashing.

    Simulasi repo non-git (tmp_path) sehingga git show gagal -> fallback.
    File lokal ber-format CRLF harus menghasilkan hash yang SAMA dengan
    konten LF murni — inilah inti perbaikan wait-sha di Windows.
    """
    lf_content = b"<html>\n<body>\nok\n</body>\n</html>\n"
    crlf_content = lf_content.replace(b"\n", b"\r\n")

    target = tmp_path / "index.html"
    target.write_bytes(crlf_content)

    # Pastikan fallback yang dipakai (bukan git): patok subprocess.run agar gagal.
    monkeypatch.setattr(subprocess, "run", NO_GIT)

    result = mod.deployed_content_hash(tmp_path, "index.html")
    assert result == _sha256_bytes(lf_content)
    assert result != _sha256_bytes(crlf_content)  # bukti CRLF benar-benar dinormalisasi


def test_crlf_fallback_lf_unchanged(tmp_path, mod, monkeypatch):
    """Konten LF murni tetap menghasilkan hash LF yang sama."""
    lf_content = b"<html>\nok\n</html>\n"
    target = tmp_path / "index.html"
    target.write_bytes(lf_content)
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.deployed_content_hash(tmp_path, "index.html") == _sha256_bytes(lf_content)


def test_deployed_content_hash_missing_file(tmp_path, mod, monkeypatch):
    """File tidak ada -> None (tanpa crash)."""
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.deployed_content_hash(tmp_path, "tidak-ada.html") is None


# ---------------------------------------------------------------------------
# wait_until_deployed — logika polling (tanpa jaringan)
# ---------------------------------------------------------------------------
def test_wait_until_deployed_match(tmp_path, mod, monkeypatch, no_sleep):
    """Konten live cocok -> True segera (tanpa menunggu timeout)."""
    target = tmp_path / "index.html"
    target.write_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    expected = _sha256_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(mod, "_fetch_live_sha", lambda url: expected)
    assert mod.wait_until_deployed(tmp_path, "index.html", timeout=60) is True


def test_wait_until_deployed_timeout(tmp_path, mod, monkeypatch, no_sleep):
    """Konten live tidak pernah cocok -> False (timeout, ping best-effort)."""
    target = tmp_path / "index.html"
    target.write_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    monkeypatch.setattr(mod, "_fetch_live_sha", lambda url: "hash-tak-cocok")
    assert mod.wait_until_deployed(tmp_path, "index.html", timeout=0.01) is False


def test_wait_until_deployed_missing_file(tmp_path, mod, monkeypatch, no_sleep):
    """File --wait-sha tak ada -> dilewati (True, ping tetap dilanjutkan)."""
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.wait_until_deployed(tmp_path, "tidak-ada.html", timeout=1) is True


# ---------------------------------------------------------------------------
# CLI parsing & main()
# ---------------------------------------------------------------------------
def test_parse_args_defaults(mod):
    args = mod.parse_args([])
    assert args.host == mod.DEFAULT_HOST
    assert args.base_path == mod.DEFAULT_BASE_PATH
    assert args.dry_run is False
    assert args.wait_sha is None
    assert args.wait_timeout == 360


@pytest.mark.parametrize("argv,expected", [
    (["--dry-run"], (True, None)),
    (["--wait-sha", "index.html"], (False, "index.html")),
    (["--wait-timeout", "120"], (False, None)),
    (["--key-file", "k.txt"], (False, None)),
])
def test_parse_args_flags(mod, argv, expected):
    args = mod.parse_args(argv)
    assert (args.dry_run, args.wait_sha) == expected


def test_main_missing_key_returns_1(tmp_path, mod, capsys):
    """main() tanpa file key -> exit code 1 (root disuntikkan ke dir kosong)."""
    assert mod.main(["--dry-run"], root=tmp_path) == 1
    assert "tidak ditemukan" in capsys.readouterr().out


def test_main_dry_run_returns_0(tmp_path, mod, capsys):
    """main() dengan key valid + --dry-run -> exit code 0, tanpa jaringan."""
    p = tmp_path / "abc1234567890.txt"
    p.write_text("abc1234567890", encoding="utf-8")
    assert mod.main(["--dry-run"], root=tmp_path) == 0
    out = capsys.readouterr().out
    assert "abc1234567890" in out
    assert "DRY-RUN" in out


def test_main_real_run_payload_paths(tmp_path, mod, capsys):
    """main() --dry-run memakai base path & keyLocation subpath yang benar."""
    p = tmp_path / "abc1234567890.txt"
    p.write_text("abc1234567890", encoding="utf-8")
    assert mod.main(["--dry-run"], root=tmp_path) == 0
    out = capsys.readouterr().out
    assert "https://sisigitadi.github.io/portofolio/abc1234567890.txt" in out
    assert "https://sisigitadi.github.io/portofolio/" in out
    assert "https://sisigitadi.github.io/portofolio/sitemap.xml" in out


def test_key_filename_re(mod):
    """Pola nama file key: alfanumerik + hyphen, 8-128 karakter."""
    ok = ["6605868618dc4f34b628743b70f6d7c9.txt", "abcd-1234.txt", "a" * 8 + ".txt", "A-Z0-123.txt"]
    bad = ["abc.txt", "a" * 7 + ".txt", "under_score.txt", "a" * 129 + ".txt", "key with space.txt"]
    for name in ok:
        assert mod.KEY_FILENAME_RE.match(name), name
    for name in bad:
        assert not mod.KEY_FILENAME_RE.match(name), name
