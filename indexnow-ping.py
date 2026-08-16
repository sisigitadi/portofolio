#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
indexnow-ping.py — Send an IndexNow ping after content goes live on GitHub Pages.

IndexNow is an open protocol that tells search engines (Bing, Yandex,
Seznam, Naver, Yep, etc.) that a URL changed, so it is crawled right away
instead of waiting for the next scheduled crawl.

Script flow:
  1. Find the `{KEY}.txt` key file in the repo root (file content = the KEY itself,
     per the IndexNow spec: https://www.indexnow.org/documentation).
  2. Optional: wait until the live page actually serves the latest content
     (--wait-sha) — prevents pinging before GitHub Pages finishes building.
  3. POST JSON to https://api.indexnow.org/indexnow with host, key,
     keyLocation, and urlList.

Usage examples:
  python indexnow-ping.py                     # auto-discover key, ping right away
  python indexnow-ping.py --dry-run           # print the payload without sending
  python indexnow-ping.py --key-file abc.txt  # explicit key file
  python indexnow-ping.py --wait-sha index.html   # wait for deploy, then ping

Exit code: 0 = success (or dry-run), 1 = failure (key not found / ping rejected).
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
# Constants
# ---------------------------------------------------------------------------
API_ENDPOINT = "https://api.indexnow.org/indexnow"
DEFAULT_HOST = "sisigitadi.github.io"
DEFAULT_BASE_PATH = "/portofolio"
KEY_FILENAME_RE = re.compile(r"^[A-Za-z0-9-]{8,128}\.txt$")
LIVE_URL = "https://{host}{base_path}/index.html"


# ---------------------------------------------------------------------------
# Key file discovery
# ---------------------------------------------------------------------------
def discover_key_file(root: Path) -> Path | None:
    """Find the IndexNow key file in the repo root.

    Per the spec, the file is named `{KEY}.txt` and its content is exactly the KEY
    itself. Scan every *.txt in the root and match name/content + character pattern
    (alphanumeric & hyphen, 8-128 characters).
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
    """Load the key + key-file path. The --key-file argument wins, then auto-discover."""
    if key_file:
        p = Path(key_file)
        if not p.is_absolute():
            p = root / p
        if not p.exists():
            print(f"[indexnow] ERROR: key file not found: {p}")
            return None
        key = p.name[: -len(".txt")] if p.name.lower().endswith(".txt") else p.read_text(encoding="utf-8").strip()
        if not KEY_FILENAME_RE.match(p.name):
            print(f"[indexnow] ERROR: invalid key filename (must match {KEY_FILENAME_RE.pattern}): {p.name}")
            return None
        return key, p

    found = discover_key_file(root)
    if found is None:
        print("[indexnow] ERROR: no IndexNow key file found in the repo root.")
        print("[indexnow]         Create a `{KEY}.txt` file (content = KEY) from Bing Webmaster Tools -> Configuration -> IndexNow,")
        print("[indexnow]         or generate your own key (8-128 alphanumeric chars + hyphens) and register it.")
        return None
    key = found.name[: -len(".txt")]
    return key, found


# ---------------------------------------------------------------------------
# Wait until live content == local content (verify the deploy finished)
# ---------------------------------------------------------------------------
def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def deployed_content_hash(root: Path, rel_path: str) -> str | None:
    """Hash the EXACT content that will be deployed from the repo (git HEAD), not the
    local working file.

    Why: Windows checkouts normalize line endings to CRLF (core.autocrlf),
    so the sha256 of the local file != sha256 of the GitHub/Live content (LF). Since
    the deployed content is the commit content (LF), the hash must come from `git show
    HEAD:file`. Fallback when git is unavailable: read the local file and normalize
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

    # Fallback: normalize CRLF -> LF so it is comparable to the deployed content.
    try:
        raw = (root / rel_path).read_bytes()
        return _sha256(raw.replace(b"\r\n", b"\n"))
    except OSError:
        return None


def _fetch_live_sha(url: str) -> str | None:
    """Fetch the live content and return its sha256 (no Accept-Encoding so the
    server sends the plain body, so the hash is comparable to the local file)."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (IndexNow ping script)"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read()
        return hashlib.sha256(body).hexdigest()
    except Exception:
        return None


def wait_until_deployed(root: Path, wait_sha: str, timeout: int) -> bool:
    """Poll the live page until its sha256 matches the local file.

    GitHub Pages takes ±1-3 minutes to rebuild after a push; pinging before it is live
    just wastes the signal (Bing crawls the old content). Returns True when the
    content is live before the timeout, False on timeout (the caller still runs
    the ping best-effort).
    """
    rel_path = wait_sha
    target = deployed_content_hash(root, rel_path)
    if target is None:
        print(f"[indexnow] WARN: file for --wait-sha could not be read: {rel_path} — skipped.")
        return True

    url = LIVE_URL.format(host=DEFAULT_HOST, base_path=DEFAULT_BASE_PATH)
    print(f"[indexnow] Waiting for the deploy to finish (target sha256: {target[:12]}...) - max {timeout}s")
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        live = _fetch_live_sha(url)
        if live == target:
            print("[indexnow] [OK] Live content is up to date (sha256 matches).")
            return True
        time.sleep(15)
    print(f"[indexnow] [WARN] Timeout {timeout}s - live content still differs from the repo. Ping continues anyway (best-effort).")
    return False


# ---------------------------------------------------------------------------
# IndexNow ping
# ---------------------------------------------------------------------------
def build_payload(host: str, key: str, key_location: str, urls: list[str]) -> dict:
    return {"host": host, "key": key, "keyLocation": key_location, "urlList": urls}


def ping_indexnow(payload: dict, dry_run: bool, verbose: bool) -> bool:
    if dry_run:
        print("[indexnow] [DRY-RUN] payload that would be sent:")
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
            print(f"[indexnow] response detail ({status}): {detail}")
    except Exception as e:
        print(f"[indexnow] network ERROR: {e}")
        return False

    if status in (200, 202):
        note = " (accepted, key validation awaits first fetch)" if status == 202 else ""
        print(f"[indexnow] [OK] IndexNow ping successful - HTTP {status}{note}")
        return True
    if status == 403:
        print("[indexnow] [FAIL] HTTP 403 - invalid key. Make sure `{KEY}.txt` is live on the site and its content == the filename.")
    elif status == 422:
        print("[indexnow] [FAIL] HTTP 422 - URL does not match the host/keyLocation.")
    elif status == 429:
        print("[indexnow] [FAIL] HTTP 429 - rate limited. Try again later.")
    else:
        print(f"[indexnow] [FAIL] Ping failed - HTTP {status}.")
    return False


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Send an IndexNow ping after a GitHub Pages deploy.")
    p.add_argument("--key-file", default=None, help="Path to the `{KEY}.txt` key file (default: auto-discover in the repo root)")
    p.add_argument("--host", default=DEFAULT_HOST, help=f"Host situs (default: {DEFAULT_HOST})")
    p.add_argument("--base-path", default=DEFAULT_BASE_PATH, help=f"Site subpath (default: {DEFAULT_BASE_PATH})")
    p.add_argument("--key-location", default=None, help="Full URL of the key file (default: https://{host}{base_path}/{key}.txt)")
    p.add_argument("--urls", nargs="*", default=None, help="URLs to ping (default: homepage + sitemap)")
    p.add_argument("--wait-sha", default=None, metavar="FILE", help="Wait until the live content == FILE (e.g. index.html) before pinging")
    p.add_argument("--wait-timeout", type=int, default=360, help="Deploy wait timeout in seconds (default: 360)")
    p.add_argument("--dry-run", action="store_true", help="Print the payload without sending")
    p.add_argument("--verbose", action="store_true", help="Show error response details")
    return p.parse_args(argv)


def main(argv: list[str] | None = None, root: Path | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    root = root or Path(__file__).resolve().parent

    loaded = load_key(root, args.key_file)
    if loaded is None:
        return 1
    key, key_file = loaded
    print(f"[indexnow] Key found: {key_file.name}")

    # Wait for the deploy (optional) — best-effort, does not fail the ping
    if args.wait_sha:
        wait_until_deployed(root, args.wait_sha, args.wait_timeout)

    base = f"https://{args.host}{args.base_path}"
    key_location = args.key_location or f"{base}/{key_file.name}"
    urls = args.urls or [
        base + "/",
        base + "/ai-engineer.html",
        base + "/secops-specialist.html",
        base + "/sitemap.xml",
    ]

    payload = build_payload(args.host, key, key_location, urls)
    print(f"[indexnow] Host: {args.host} | keyLocation: {key_location}")
    print(f"[indexnow] URL ({len(urls)}):")
    for u in urls:
        print(f"           - {u}")

    ok = ping_indexnow(payload, args.dry_run, args.verbose)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
