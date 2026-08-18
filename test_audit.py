# -*- coding: utf-8 -*-
"""Unit tests for audit.py (pytest).

Strategy: every broken scenario uses the real index.html as a baseline and
mutates it at exactly one point, so only the targeted check fails (delta
errors = 1). This way the tests verify pure detection, not synthetic fixtures
that might trigger many FAILs at once.

Run: python -m pytest test_audit.py -v
"""
import io
import contextlib
from pathlib import Path

import pytest

import audit

ROOT = Path(__file__).resolve().parent
INDEX_HTML = ROOT / "index.html"


def run_audit(content, quick=False):
    """Run PreflightAudit and return (errors, output)."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        instance = audit.PreflightAudit(content, quick=quick)
        errors = instance.run()
    return errors, buf.getvalue(), instance


@pytest.fixture(scope="module")
def valid_html():
    if not INDEX_HTML.exists():
        pytest.skip("index.html not found in the project root")
    return INDEX_HTML.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Valid fixture
# ---------------------------------------------------------------------------
def test_valid_index_production_ready(valid_html):
    """The real index.html passes every check. Full mode (node --check): the
    #6 result depends on the environment (PASS / WARN node missing / WARN
    cannot launch) — none of them add errors, so errors stays 0."""
    errors, out, _ = run_audit(valid_html)
    assert errors == 0
    assert "[FAIL]" not in out
    node_lines = ("All" in out, "Quick mode" in out,
                  "could not be launched" in out,
                  "node.js not found" in out)
    assert any(node_lines)  # one of the node outcomes must appear


def test_valid_ai_engineer_production_ready():
    """ai-engineer.html passes every check with 0 errors."""
    target = ROOT / "ai-engineer.html"
    if not target.exists():
        pytest.skip("ai-engineer.html not found")
    errors, out, _ = run_audit(target.read_text(encoding="utf-8"))
    assert errors == 0
    assert "[FAIL]" not in out


def test_valid_secops_specialist_production_ready():
    """secops-specialist.html passes every check with 0 errors."""
    target = ROOT / "secops-specialist.html"
    if not target.exists():
        pytest.skip("secops-specialist.html not found")
    errors, out, _ = run_audit(target.read_text(encoding="utf-8"))
    assert errors == 0
    assert "[FAIL]" not in out


def test_summary_counts_present(valid_html):
    """The final summary includes PASS/FAIL/WARN counts + timing."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        audit.run_preflight_check(str(INDEX_HTML), quick=True)
    out = buf.getvalue()
    assert "Summary:" in out
    assert "PASS" in out and "FAIL" in out and "WARN" in out


# ---------------------------------------------------------------------------
# 6 broken scenarios (targeted mutations of index.html)
# ---------------------------------------------------------------------------
def test_broken_getelementbyid_dead(valid_html):
    """#9: getElementById points to an id not in the DOM -> FAIL.

    Replace EVERY occurrence of getElementById('visitor-badge') (a Field Manual
    id) with a fake id so the dead reference is detected.
    """
    content = valid_html.replace(
        "getElementById('visitor-badge')",
        "getElementById('id-palsu-tak-ada')")
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out
    assert "not present in the DOM" in out


def test_broken_queryselector_ghost(valid_html):
    """#10: querySelector('#ghost') points to a nonexistent element -> FAIL."""
    content = valid_html.replace(
        "</body>",
        "<script>document.querySelector('#ghost-selector');</script></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out
    assert "querySelector" in out


def test_broken_tag_unbalanced(valid_html):
    """#5: a <div> without a closing tag -> tag-balance FAIL."""
    content = valid_html.replace("</body>", "<div class=\"unclosed\"></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out


def test_broken_i18n_mismatch(valid_html):
    """#8: unbalanced EN/ID dictionary -> FAIL (the dictionary is injected
    because the Field Manual is single-language; bilingual pages must still
    keep parity)."""
    content = valid_html.replace(
        "</body>",
        '<script>var I18N = {en: {hello: "Hi"}, id: {}};</script></body>', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "i18n" in out or "dictionary" in out


def test_broken_slide_count_mismatch(valid_html):
    """#7: totalTestimonials exists but the number of slide comments does not
    match -> FAIL (the variable is injected because the Field Manual has no
    carousel)."""
    content = valid_html.replace(
        "</body>",
        "<script>var totalTestimonials = 2;</script></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out


def test_broken_formspree_endpoint(valid_html):
    """#1: wrong Formspree endpoint -> FAIL."""
    content = valid_html.replace(
        'action="https://formspree.io/f/mkgknrqk"',
        'action="https://formspree.io/f/PALSU"', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "Formspree" in out


# ---------------------------------------------------------------------------
# Conditional features: Field Manual (no legacy SPA) must not trigger FAIL
# ---------------------------------------------------------------------------
def test_single_language_page_passes_i18n(valid_html):
    """#8: single-language page (no dictionary & no data-i18n) -> PASS "not
    applicable", not WARN/FAIL — compatible with the Field Manual."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "i18n parity check not applicable" in out


def test_data_i18n_without_dict_fails(valid_html):
    """#8: data-i18n used but the en/id dictionary is missing -> FAIL."""
    content = valid_html.replace(
        "</body>",
        '<span data-i18n="lang-switch">EN</span></body>', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "data-i18n" in out and "dictionary" in out


def test_no_testimonial_carousel_passes(valid_html):
    """#7: no totalTestimonials & no slide comments -> PASS "not applicable"
    (the Field Manual has no testimonial carousel)."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "testimonial carousel" in out


def test_testimonial_slides_mismatch_fails(valid_html):
    """#7: totalTestimonials exists but the number of slide comments does not
    match -> FAIL."""
    content = valid_html.replace(
        "</body>",
        "<!-- Slide 1: a --><!-- Slide 2: b --><script>var totalTestimonials = 3;</script></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "totalTestimonials" in out


# ---------------------------------------------------------------------------
# SEO meta & structured data (#11 & #12)
# ---------------------------------------------------------------------------
def test_seo_meta_passes(valid_html):
    """#11: complete Field Manual SEO head (title ≤ 65, description ≤ 160,
    robots index, canonical, OG, Twitter) -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "SEO meta complete" in out


def test_seo_noindex_fails(valid_html):
    """#11: robots contains noindex -> FAIL (page will not be indexed)."""
    content = valid_html.replace(
        'content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"',
        'content="noindex, nofollow"', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "noindex" in out


def test_seo_missing_title_fails(valid_html):
    """#11: <title> missing -> FAIL."""
    content = valid_html.replace(
        "<title>Sigit Adi Irianto | IT &amp; SecOps | Applied AI Engineer</title>", "", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "title" in out.lower()


def test_jsonld_valid_passes(valid_html):
    """#12: 2 valid JSON-LD blocks (Person + WebSite) -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "JSON-LD structured data valid" in out
    assert "Person" in out and "WebSite" in out


def test_jsonld_invalid_fails(valid_html):
    """#12: a JSON-LD block is not valid JSON -> FAIL."""
    content = valid_html.replace(
        '"@type": "Person",', '"@type": "Person", broken:', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "JSON-LD" in out


def test_jsonld_missing_type_fails(valid_html):
    """#12: Person/WebSite type missing from JSON-LD -> FAIL."""
    content = valid_html.replace(
        '"@type": "Person",', '"@type": "Organization",', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "missing schema.org types" in out


def test_ats_print_passes(valid_html):
    """#13: Standard ATS print stylesheet -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "ATS Print Mode verified" in out


def test_ats_print_missing_media_fails(valid_html):
    """#13: Missing @media print -> FAIL."""
    content = valid_html.replace("@media print", "@media screen-only")
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "No @media print stylesheet found" in out


def test_ats_print_missing_arial_fails(valid_html):
    """#13: Print font without Arial -> FAIL."""
    content = valid_html.replace("font-family: Arial", "font-family: ComicSans")
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "must specify Arial" in out


# ---------------------------------------------------------------------------
# Idempotency & quick mode
# ---------------------------------------------------------------------------
def test_run_idempotent(valid_html):
    """run() twice on the same instance: identical results & counts."""
    instance = audit.PreflightAudit(valid_html, quick=True)
    e1, p1, w1 = instance.run(), instance.pass_count, instance.warn_count
    e2, p2, w2 = instance.run(), instance.pass_count, instance.warn_count
    assert (e1, p1, w1) == (e2, p2, w2)
    assert e1 == 0


def test_quick_mode_skips_node(valid_html):
    """--quick: node --check is skipped (explicit WARN), not FAIL."""
    errors, out, instance = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "Quick mode" in out
    assert instance.warn_count >= 1


def test_node_env_error_is_warn_not_crash(monkeypatch, valid_html):
    """#6: OSError while launching node --check -> resilience WARN, not crash.

    shutil.which is patched so a node path "exists" (environment-independent),
    then subprocess.run is forced to raise OSError — the audit must WARN, not
    crash.
    """
    monkeypatch.setattr(audit.shutil, "which", lambda name: "C:/fake/node.exe")

    def boom(*args, **kwargs):
        raise OSError("WinError 6: handle invalid")
    monkeypatch.setattr(audit.subprocess, "run", boom)
    errors, out, _ = run_audit(valid_html)
    assert errors == 0
    assert "could not be launched" in out


# ---------------------------------------------------------------------------
# CLI argument parsing
# ---------------------------------------------------------------------------
@pytest.mark.parametrize("argv,expected", [
    (["index.html"], ("index.html", False)),
    (["--quick"], ("index.html", True)),
    (["page.html", "--quick"], ("page.html", True)),
    (["--quick", "page.html"], ("page.html", True)),
    (["folder/file.html"], ("folder/file.html", False)),
    ([], ("index.html", False)),
])
def test_parse_cli_args(argv, expected):
    assert audit.parse_cli_args(argv) == expected


# ---------------------------------------------------------------------------
# run_preflight_check integration
# ---------------------------------------------------------------------------
def test_run_preflight_check_missing_file():
    with pytest.raises(SystemExit) as exc_info:
        audit.run_preflight_check("file-that-does-not-exist.html", quick=True)
    assert exc_info.value.code == 1


def test_run_preflight_check_custom_target(tmp_path, valid_html):
    """A non-default target file can be audited (positional argument)."""
    target = tmp_path / "custom.html"
    target.write_text(valid_html, encoding="utf-8")
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        audit.run_preflight_check(str(target), quick=True)
    out = buf.getvalue()
    assert "PRODUCTION READY" in out
    assert "Summary:" in out


def test_run_preflight_check_fail_exits(tmp_path):
    """Failed audit -> SystemExit(1) (for the pre-push/CI gate)."""
    bad = tmp_path / "bad.html"
    bad.write_text(
        "<html><body><script>document.getElementById('dead-id');</script></body></html>",
        encoding="utf-8")
    with pytest.raises(SystemExit) as exc_info:
        audit.run_preflight_check(str(bad), quick=True)
    assert exc_info.value.code == 1


# ---------------------------------------------------------------------------
# CSP script-src hash sync (#14)
# ---------------------------------------------------------------------------
def test_csp_hash_sync_passes(valid_html):
    """#14: CSP script-src hashes match all inline scripts -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "CSP script-src hashes in sync" in out


def test_csp_hash_mismatch_fails(valid_html):
    """#14: a CSP hash does not match the inline script -> FAIL with the
    correct hash to paste."""
    # Replace one CSP hash with a fake value
    content = valid_html.replace(
        "sha256-414fiFHNqF/qBWVFvll1l1uXkQWMVfZe2VCowPfPFG4=",
        "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "CSP script-src hash mismatch" in out
    assert "SHA-256" in out or "sha256-" in out


def test_csp_no_meta_warns(valid_html):
    """#14: no CSP meta tag (e.g. ai-engineer.html) -> WARN, not FAIL."""
    # Remove the CSP meta tag entirely
    csp_line = next(
        line for line in valid_html.splitlines()
        if 'Content-Security-Policy' in line)
    content = valid_html.replace(csp_line, "")
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors == 0
    assert "CSP script-src hash sync check not applicable" in out


def test_csp_no_script_src_hashes_warns(valid_html):
    """#14: CSP exists but script-src has no sha256 hashes -> WARN."""
    import re as _re
    content = _re.sub(
        r"script-src 'self' 'sha256-[A-Za-z0-9+/=]+(?:' 'sha256-[A-Za-z0-9+/=]+)*",
        "script-src 'self' 'unsafe-inline'",
        valid_html, count=1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors == 0
    assert "no sha256 hashes" in out


def test_csp_orphaned_hash_fails(valid_html):
    """#14: CSP has a hash that doesn't match any inline script -> FAIL."""
    # Insert an extra fake hash into the CSP
    content = valid_html.replace(
        "script-src 'self' 'sha256-",
        "script-src 'self' 'sha256-FAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKE= 'sha256-", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "CSP script-src hash mismatch" in out
