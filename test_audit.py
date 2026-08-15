# -*- coding: utf-8 -*-
"""Unit test audit.py (pytest).

Strategi: setiap skenario rusak memakai index.html asli sebagai baseline lalu
memutasinya pada satu titik saja, sehingga hanya pemeriksaan target yang gagal
(delta errors = 1). Dengan begitu test menguji deteksi murni, bukan fixture
sintetis yang mungkin memicu banyak FAIL sekaligus.

Jalankan: python -m pytest test_audit.py -v
"""
import io
import contextlib
from pathlib import Path

import pytest

import audit

ROOT = Path(__file__).resolve().parent
INDEX_HTML = ROOT / "index.html"


def run_audit(content, quick=False):
    """Jalankan PreflightAudit dan kembalikan (errors, output)."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        instance = audit.PreflightAudit(content, quick=quick)
        errors = instance.run()
    return errors, buf.getvalue(), instance


@pytest.fixture(scope="module")
def valid_html():
    if not INDEX_HTML.exists():
        pytest.skip("index.html tidak ditemukan di root proyek")
    return INDEX_HTML.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Fixture valid
# ---------------------------------------------------------------------------
def test_valid_index_production_ready(valid_html):
    """index.html asli lolos semua pemeriksaan. Mode penuh (node --check): hasil
    #6 bergantung environment (PASS / WARN node tidak ada / WARN tak dapat
    diluncurkan) — ketiganya tidak menambah errors, jadi errors tetap 0."""
    errors, out, _ = run_audit(valid_html)
    assert errors == 0
    assert "[FAIL]" not in out
    node_lines = ("Semua" in out, "Mode cepat" in out,
                  "tidak dapat diluncurkan" in out,
                  "node.js tidak ditemukan" in out)
    assert any(node_lines)  # salah satu outcome node pasti muncul


def test_summary_counts_present(valid_html):
    """Ringkasan akhir memuat hitungan PASS/FAIL/WARN + timing."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        audit.run_preflight_check(str(INDEX_HTML), quick=True)
    out = buf.getvalue()
    assert "Ringkasan:" in out
    assert "PASS" in out and "FAIL" in out and "WARN" in out


# ---------------------------------------------------------------------------
# 6 skenario rusak (mutasi terarah pada index.html)
# ---------------------------------------------------------------------------
def test_broken_getelementbyid_dead(valid_html):
    """#9: getElementById menunjuk id yang tidak ada di DOM -> FAIL.

    Ganti SEMUA kemunculan getElementById('visitor-badge') (id Field Manual)
    dengan id palsu sehingga referensi mati terdeteksi.
    """
    content = valid_html.replace(
        "getElementById('visitor-badge')",
        "getElementById('id-palsu-tak-ada')")
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out
    assert "tidak ada di DOM" in out


def test_broken_queryselector_ghost(valid_html):
    """#10: querySelector('#ghost') menunjuk elemen tak ada -> FAIL."""
    content = valid_html.replace(
        "</body>",
        "<script>document.querySelector('#ghost-selector');</script></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out
    assert "querySelector" in out


def test_broken_tag_unbalanced(valid_html):
    """#5: tag <div> tanpa penutup -> FAIL keseimbangan tag."""
    content = valid_html.replace("</body>", "<div class=\"unclosed\"></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out


def test_broken_i18n_mismatch(valid_html):
    """#8: kamus EN/ID tidak seimbang -> FAIL (kamus di-injeksi karena Field
    Manual satu-bahasa; halaman dua-bahasa tetap wajib parity)."""
    content = valid_html.replace(
        "</body>",
        '<script>var I18N = {en: {hello: "Hi"}, id: {}};</script></body>', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "i18n" in out or "Kamus" in out


def test_broken_slide_count_mismatch(valid_html):
    """#7: totalTestimonials ada tetapi jumlah komentar slide tidak cocok ->
    FAIL (variabel di-injeksi karena Field Manual tidak punya carousel)."""
    content = valid_html.replace(
        "</body>",
        "<script>var totalTestimonials = 2;</script></body>", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "[FAIL]" in out


def test_broken_formspree_endpoint(valid_html):
    """#1: endpoint Formspree salah -> FAIL."""
    content = valid_html.replace(
        'action="https://formspree.io/f/mkgknrqk"',
        'action="https://formspree.io/f/PALSU"', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "Formspree" in out


# ---------------------------------------------------------------------------
# Fitur kondisional: Field Manual (tanpa SPA lama) tidak memicu FAIL
# ---------------------------------------------------------------------------
def test_single_language_page_passes_i18n(valid_html):
    """#8: halaman satu-bahasa (tanpa kamus & tanpa data-i18n) -> PASS "tidak
    berlaku", bukan WARN/FAIL — kompatibel dengan Field Manual."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "parity i18n tidak berlaku" in out


def test_data_i18n_without_dict_fails(valid_html):
    """#8: data-i18n dipakai tetapi kamus en/id tidak ada -> FAIL."""
    content = valid_html.replace(
        "</body>",
        '<span data-i18n="lang-switch">EN</span></body>', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "data-i18n" in out and "kamus" in out


def test_no_testimonial_carousel_passes(valid_html):
    """#7: tanpa totalTestimonials & tanpa komentar slide -> PASS "tidak
    berlaku" (Field Manual tidak punya carousel testimonial)."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "carousel testimonial" in out


def test_testimonial_slides_mismatch_fails(valid_html):
    """#7: totalTestimonials ada tapi jumlah komentar slide tidak cocok -> FAIL."""
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
    """#11: head SEO Field Manual lengkap (title ≤ 65, description ≤ 160, robots
    index, canonical, OG, Twitter) -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "SEO meta lengkap" in out


def test_seo_noindex_fails(valid_html):
    """#11: robots memuat noindex -> FAIL (halaman tidak akan terindeks)."""
    content = valid_html.replace(
        'content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"',
        'content="noindex, nofollow"', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "noindex" in out


def test_seo_missing_title_fails(valid_html):
    """#11: <title> hilang -> FAIL."""
    content = valid_html.replace(
        "<title>Sigit Adi Irianto | IT &amp; SecOps | Applied AI Engineer</title>", "", 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "title" in out.lower()


def test_jsonld_valid_passes(valid_html):
    """#12: 2 blok JSON-LD (Person + WebSite) valid -> PASS."""
    errors, out, _ = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "JSON-LD valid" in out
    assert "Person" in out and "WebSite" in out


def test_jsonld_invalid_fails(valid_html):
    """#12: blok JSON-LD bukan JSON valid -> FAIL."""
    content = valid_html.replace(
        '"@type": "Person",', '"@type": "Person", broken:', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "JSON-LD" in out


def test_jsonld_missing_type_fails(valid_html):
    """#12: tipe Person/WebSite hilang dari JSON-LD -> FAIL."""
    content = valid_html.replace(
        '"@type": "Person",', '"@type": "Organization",', 1)
    assert content != valid_html
    errors, out, _ = run_audit(content, quick=True)
    assert errors >= 1
    assert "kekurangan tipe" in out


# ---------------------------------------------------------------------------
# Idempotensi & mode cepat
# ---------------------------------------------------------------------------
def test_run_idempotent(valid_html):
    """run() dua kali pada instance sama: hasil & hitungan identik."""
    instance = audit.PreflightAudit(valid_html, quick=True)
    e1, p1, w1 = instance.run(), instance.pass_count, instance.warn_count
    e2, p2, w2 = instance.run(), instance.pass_count, instance.warn_count
    assert (e1, p1, w1) == (e2, p2, w2)
    assert e1 == 0


def test_quick_mode_skips_node(valid_html):
    """--quick: node --check dilewati (WARN eksplisit), bukan FAIL."""
    errors, out, instance = run_audit(valid_html, quick=True)
    assert errors == 0
    assert "Mode cepat" in out
    assert instance.warn_count >= 1


def test_node_env_error_is_warn_not_crash(monkeypatch, valid_html):
    """#6: OSError saat node --check diluncurkan -> WARN ketahanan, bukan crash.

    shutil.which di-patch agar path node "ada" (environment-independent), lalu
    subprocess.run dipaksa OSError — audit harus WARN, bukan crash.
    """
    monkeypatch.setattr(audit.shutil, "which", lambda name: "C:/fake/node.exe")

    def boom(*args, **kwargs):
        raise OSError("WinError 6: handle invalid")
    monkeypatch.setattr(audit.subprocess, "run", boom)
    errors, out, _ = run_audit(valid_html)
    assert errors == 0
    assert "tidak dapat diluncurkan" in out


# ---------------------------------------------------------------------------
# Parsing argumen CLI
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
# Integrasi run_preflight_check
# ---------------------------------------------------------------------------
def test_run_preflight_check_missing_file():
    with pytest.raises(SystemExit) as exc_info:
        audit.run_preflight_check("file-yang-tidak-ada.html", quick=True)
    assert exc_info.value.code == 1


def test_run_preflight_check_custom_target(tmp_path, valid_html):
    """Target file non-default bisa diaudit (argumen posisi)."""
    target = tmp_path / "custom.html"
    target.write_text(valid_html, encoding="utf-8")
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        audit.run_preflight_check(str(target), quick=True)
    out = buf.getvalue()
    assert "PRODUCTION READY" in out
    assert "Ringkasan:" in out


def test_run_preflight_check_fail_exits(tmp_path):
    """Audit gagal -> SystemExit(1) (untuk gerbang pre-push/CI)."""
    bad = tmp_path / "bad.html"
    bad.write_text(
        "<html><body><script>document.getElementById('mati');</script></body></html>",
        encoding="utf-8")
    with pytest.raises(SystemExit) as exc_info:
        audit.run_preflight_check(str(bad), quick=True)
    assert exc_info.value.code == 1
