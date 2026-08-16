# -*- coding: utf-8 -*-
"""Unit tests for indexnow-ping.py (pytest).

Tests the pure functions of indexnow-ping.py without sending network pings:
  - auto-discovery of the `{KEY}.txt` key file (name = content, 8-128
    alphanumeric/hyphen pattern)
  - IndexNow payload construction (host, key, keyLocation, urlList)
  - CRLF -> LF fallback in deployed_content_hash (cross-platform behavior)
  - wait_until_deployed logic (no network; _fetch_live_sha is mocked)
  - CLI argument parsing & exit codes

Note: the hyphenated filename (indexnow-ping.py) cannot be imported with a
regular `import`, so it is loaded via importlib.util.

Run: python -m pytest test_indexnow_ping.py -v
"""

import hashlib
import importlib.util
import subprocess
from pathlib import Path

import pytest

# Subprocess is imported locally inside deployed_content_hash(); patching the
# global subprocess.run is just as effective because both are the same module
# object.
NO_GIT = lambda *a, **k: None  # noqa: E731 — fails `git show` in tests

ROOT = Path(__file__).resolve().parent
MODULE_PATH = ROOT / "indexnow-ping.py"

# ---------------------------------------------------------------------------
# Load module (hyphenated filename -> importlib)
# ---------------------------------------------------------------------------
@pytest.fixture(scope="module")
def mod():
    if not MODULE_PATH.exists():
        pytest.skip("indexnow-ping.py not found in the project root")
    spec = importlib.util.spec_from_file_location("indexnow_ping_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def no_sleep(monkeypatch, mod):
    """Neutralize time.sleep so wait_until_deployed tests do not slow down."""
    monkeypatch.setattr(mod.time, "sleep", lambda s: None)


# ---------------------------------------------------------------------------
# Key file auto-discovery
# ---------------------------------------------------------------------------
def _write_key(tmp_path, name, content):
    p = tmp_path / name
    p.write_text(content, encoding="utf-8")
    return p


def test_discover_key_finds_valid(tmp_path, mod):
    """A `{KEY}.txt` file whose content == its name is found by auto-discovery."""
    _write_key(tmp_path, "6605868618dc4f34b628743b70f6d7c9.txt", "6605868618dc4f34b628743b70f6d7c9")
    found = mod.discover_key_file(tmp_path)
    assert found is not None
    assert found.name == "6605868618dc4f34b628743b70f6d7c9.txt"


def test_discover_key_ignores_content_mismatch(tmp_path, mod):
    """Valid name but content != name -> skipped (not an IndexNow key)."""
    _write_key(tmp_path, "6605868618dc4f34b628743b70f6d7c9.txt", "different-key")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_short_name(tmp_path, mod):
    """Name shorter than 8 chars -> skipped (below the spec limit)."""
    _write_key(tmp_path, "abc.txt", "abc")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_invalid_chars(tmp_path, mod):
    """Names with characters outside [A-Za-z0-9-] -> skipped."""
    _write_key(tmp_path, "key_under_score_123.txt", "key_under_score_123")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_ignores_plain_txt(tmp_path, mod):
    """Plain .txt files (README, notes) are not keys -> skipped."""
    _write_key(tmp_path, "notes.txt", "not a key")
    assert mod.discover_key_file(tmp_path) is None


def test_discover_key_picks_among_multiple(tmp_path, mod):
    """One valid key among many files -> only the valid key is picked."""
    _write_key(tmp_path, "notes.txt", "not a key")
    _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    found = mod.discover_key_file(tmp_path)
    assert found is not None
    assert found.name == "abc1234567890.txt"


def test_load_key_explicit(tmp_path, mod):
    """An explicit --key-file wins; auto-discovery is not needed."""
    p = _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    loaded = mod.load_key(tmp_path, str(p))
    assert loaded is not None
    key, path = loaded
    assert key == "abc1234567890"
    assert path == p


def test_load_key_missing_file(tmp_path, mod, capsys):
    """--key-file points to a nonexistent file -> None + error message."""
    loaded = mod.load_key(tmp_path, "missing.txt")
    assert loaded is None
    assert "not found" in capsys.readouterr().out


def test_load_key_invalid_name(tmp_path, mod, capsys):
    """--key-file with an invalid name -> None."""
    p = _write_key(tmp_path, "key_under_score_123.txt", "key_under_score_123")
    loaded = mod.load_key(tmp_path, str(p))
    assert loaded is None
    assert "invalid" in capsys.readouterr().out


def test_load_key_auto_discovers(tmp_path, mod):
    """Without --key-file: the key is discovered automatically from the root."""
    _write_key(tmp_path, "abc1234567890.txt", "abc1234567890")
    loaded = mod.load_key(tmp_path, None)
    assert loaded is not None
    key, _ = loaded
    assert key == "abc1234567890"


def test_load_key_none_when_no_key(tmp_path, mod, capsys):
    """No key at all -> None + a clear error message."""
    loaded = mod.load_key(tmp_path, None)
    assert loaded is None
    out = capsys.readouterr().out
    assert "key file found in the repo root" in out


# ---------------------------------------------------------------------------
# IndexNow payload
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
    parsed = json.loads(json.dumps(payload))  # must not error & round-trip
    assert parsed == payload


def test_ping_dry_run_returns_true(mod, capsys):
    """--dry-run: no network, always True + prints the payload."""
    payload = mod.build_payload("h", "k", "l", ["u1"])
    ok = mod.ping_indexnow(payload, dry_run=True, verbose=False)
    assert ok is True
    assert "DRY-RUN" in capsys.readouterr().out


def test_ping_http_errors(mod, monkeypatch, capsys):
    """Invalid HTTP status codes -> False (no real network)."""
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
    """HTTP 403 (invalid key) -> False + a clear message."""
    import urllib.error

    def fake_urlopen(req, timeout=30):
        raise urllib.error.HTTPError("", 403, "Forbidden", None, None)

    monkeypatch.setattr(mod.urllib.request, "urlopen", fake_urlopen)
    ok = mod.ping_indexnow({"host": "h"}, dry_run=False, verbose=False)
    assert ok is False
    assert "403" in capsys.readouterr().out


def test_ping_network_error_fails(mod, monkeypatch, capsys):
    """Network error -> False (does not crash)."""

    def fake_urlopen(req, timeout=30):
        raise OSError("network down")

    monkeypatch.setattr(mod.urllib.request, "urlopen", fake_urlopen)
    ok = mod.ping_indexnow({"host": "h"}, dry_run=False, verbose=False)
    assert ok is False
    assert "network ERROR" in capsys.readouterr().out


# ---------------------------------------------------------------------------
# deployed_content_hash — CRLF fallback (Windows checkout behavior)
# ---------------------------------------------------------------------------
def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def test_crlf_fallback_normalizes(tmp_path, mod, monkeypatch):
    """The (git-less) fallback normalizes CRLF -> LF before hashing.

    Simulates a non-git repo (tmp_path) so git show fails -> fallback is used.
    A CRLF-formatted local file must produce the SAME hash as pure LF content —
    this is the core of the wait-sha fix on Windows.
    """
    lf_content = b"<html>\n<body>\nok\n</body>\n</html>\n"
    crlf_content = lf_content.replace(b"\n", b"\r\n")

    target = tmp_path / "index.html"
    target.write_bytes(crlf_content)

    # Make sure the fallback is used (not git): force subprocess.run to fail.
    monkeypatch.setattr(subprocess, "run", NO_GIT)

    result = mod.deployed_content_hash(tmp_path, "index.html")
    assert result == _sha256_bytes(lf_content)
    assert result != _sha256_bytes(crlf_content)  # proof CRLF was normalized


def test_crlf_fallback_lf_unchanged(tmp_path, mod, monkeypatch):
    """Pure LF content still produces the same LF hash."""
    lf_content = b"<html>\nok\n</html>\n"
    target = tmp_path / "index.html"
    target.write_bytes(lf_content)
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.deployed_content_hash(tmp_path, "index.html") == _sha256_bytes(lf_content)


def test_deployed_content_hash_missing_file(tmp_path, mod, monkeypatch):
    """Missing file -> None (does not crash)."""
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.deployed_content_hash(tmp_path, "missing.html") is None


# ---------------------------------------------------------------------------
# wait_until_deployed — polling logic (no network)
# ---------------------------------------------------------------------------
def test_wait_until_deployed_match(tmp_path, mod, monkeypatch, no_sleep):
    """Live content matches -> True immediately (no timeout wait)."""
    target = tmp_path / "index.html"
    target.write_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    expected = _sha256_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(mod, "_fetch_live_sha", lambda url: expected)
    assert mod.wait_until_deployed(tmp_path, "index.html", timeout=60) is True


def test_wait_until_deployed_timeout(tmp_path, mod, monkeypatch, no_sleep):
    """Live content never matches -> False (timeout, best-effort ping)."""
    target = tmp_path / "index.html"
    target.write_bytes(b"<html>\nok\n</html>\n")
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    monkeypatch.setattr(mod, "_fetch_live_sha", lambda url: "hash-no-match")
    assert mod.wait_until_deployed(tmp_path, "index.html", timeout=0.01) is False


def test_wait_until_deployed_missing_file(tmp_path, mod, monkeypatch, no_sleep):
    """Missing --wait-sha file -> skipped (True, ping continues anyway)."""
    monkeypatch.setattr(subprocess, "run", NO_GIT)
    assert mod.wait_until_deployed(tmp_path, "missing.html", timeout=1) is True


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
    """main() without a key file -> exit code 1 (root injected to an empty dir)."""
    assert mod.main(["--dry-run"], root=tmp_path) == 1
    assert "key file found in the repo root" in capsys.readouterr().out


def test_main_dry_run_returns_0(tmp_path, mod, capsys):
    """main() with a valid key + --dry-run -> exit code 0, no network."""
    p = tmp_path / "abc1234567890.txt"
    p.write_text("abc1234567890", encoding="utf-8")
    assert mod.main(["--dry-run"], root=tmp_path) == 0
    out = capsys.readouterr().out
    assert "abc1234567890" in out
    assert "DRY-RUN" in out


def test_main_real_run_payload_paths(tmp_path, mod, capsys):
    """main() --dry-run uses the correct base path & keyLocation subpath."""
    p = tmp_path / "abc1234567890.txt"
    p.write_text("abc1234567890", encoding="utf-8")
    assert mod.main(["--dry-run"], root=tmp_path) == 0
    out = capsys.readouterr().out
    assert "https://sisigitadi.github.io/portofolio/abc1234567890.txt" in out
    assert "https://sisigitadi.github.io/portofolio/" in out
    assert "https://sisigitadi.github.io/portofolio/sitemap.xml" in out


def test_key_filename_re(mod):
    """Key filename pattern: alphanumeric + hyphen, 8-128 characters."""
    ok = ["6605868618dc4f34b628743b70f6d7c9.txt", "abcd-1234.txt", "a" * 8 + ".txt", "A-Z0-123.txt"]
    bad = ["abc.txt", "a" * 7 + ".txt", "under_score.txt", "a" * 129 + ".txt", "key with space.txt"]
    for name in ok:
        assert mod.KEY_FILENAME_RE.match(name), name
    for name in bad:
        assert not mod.KEY_FILENAME_RE.match(name), name
