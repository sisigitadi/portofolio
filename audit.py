import re
import sys
import os
import shutil
import subprocess
import tempfile
import time
from collections import Counter
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# Helper: tokenizer untuk mengekstrak key kamus i18n (aman terhadap string)
# ---------------------------------------------------------------------------
def extract_dict_keys(body):
    """Ekstrak key objek dari body dict dengan melewati string (tanda kutip).

    Catatan: tokenizer mengasumsikan nilai string tidak memakai template literal
    backtick berinterpolasi (${...}) dan semua string tersambung dengan benar.
    """
    keys = []
    i = 0
    n = len(body)
    while i < n:
        c = body[i]
        if c in '\'"`':
            quote = c
            i += 1
            while i < n:
                if body[i] == '\\':
                    i += 2
                    continue
                if body[i] == quote:
                    break
                i += 1
            i += 1
        elif c == ':':
            j = i - 1
            while j >= 0 and (body[j].isalnum() or body[j] == '_'):
                j -= 1
            key = body[j + 1:i]
            if key:
                keys.append(key)
            i += 1
        else:
            i += 1
    return set(keys)


# ---------------------------------------------------------------------------
# Helper: scanner JS bersama — melewati string/regex/komentar dan me-yield
# panggilan fungsi dengan argumen pertamanya (dipakai #9 dan #10).
# ---------------------------------------------------------------------------
_REGEX_PRECEDING_KEYWORDS = {'return', 'typeof', 'instanceof', 'in', 'new',
                             'delete', 'void', 'yield', 'case', 'do', 'else'}


def _looks_like_regex_start(js_body, i):
    """Heuristik: '/' di posisi i memulai regex literal (bukan pembagian).

    RegEx literal sering memuat karakter kutip (mis. /[&<>"']/g) yang bisa
    menipu tokenizer string; heuristik ini memakai konteks karakter sebelumnya
    (operator, tanda kurung, atau kata kunci seperti return).

    Batasan yang diketahui (tidak terjadi di kodebase saat ini): regex yang
    muncul tepat setelah ')' (mis. if (x) /re/.test(y)) salah diklasifikasi
    sebagai pembagian; kasus patologis x = "a" / "b" atau x++ / 2 dianggap
    regex. Cukup aman untuk konteks audit kode ini."""
    j = i - 1
    while j >= 0 and js_body[j] in ' \t\r\n':
        j -= 1
    if j < 0:
        return True
    c = js_body[j]
    if c.isalnum() or c in '_)]}':
        # Cek apakah kata sebelumnya adalah keyword yang mendahului regex
        start = j
        while start >= 0 and (js_body[start].isalnum() or js_body[start] in '_$'):
            start -= 1
        word = js_body[start + 1:j + 1]
        return word in _REGEX_PRECEDING_KEYWORDS
    return True


def _iter_call_args(js_body):
    """Generator: yield (func_name, arg_value, is_string, end_pos) untuk tiap
    panggilan `func(<arg1>)` di dalam JS.

    - is_string=True  bila arg1 string literal (arg_value = isinya, end_pos =
      posisi tepat setelah kutip penutup — untuk cek '+' / ')').
    - is_string=False bila arg1 identifier (arg_value = namanya, end_pos =
      posisi setelah identifier).
    - arg_value=None  bila arg1 bukan keduanya (tetap diyield agar konsisten).

    Aman terhadap string literal (', ", `), regex literal, dan komentar
    (/* */, //) sehingga teks contoh dalam komentar/string tidak menghasilkan
    false positive. Nama fungsi yang diyield adalah identifier utuh
    (mis. querySelectorAll, bukan prefix 'querySelector') sehingga boundary
    identifier (myGetElementById, myQuerySelector) otomatis tertangani.

    Batasan: template literal berinterpolasi (getElementById(`foo-${x}`))
    dibaca utuh sebagai string "statis" — pola ini tidak dipakai di kodebase.
    """
    i = 0
    n = len(js_body)
    while i < n:
        c = js_body[i]
        # Komentar blok /* ... */
        if c == '/' and i + 1 < n and js_body[i + 1] == '*':
            end = js_body.find('*/', i + 2)
            i = end + 2 if end != -1 else n
            continue
        # Komentar baris // ...
        if c == '/' and i + 1 < n and js_body[i + 1] == '/':
            end = js_body.find('\n', i + 2)
            i = end + 1 if end != -1 else n
            continue
        # RegEx literal (mis. /[&<>"']/g) — lewati sampai '/' penutup
        if c == '/' and _looks_like_regex_start(js_body, i):
            j = i + 1
            in_class = False
            while j < n:
                ch = js_body[j]
                if ch == '\\':
                    j += 2
                    continue
                if ch == '[':
                    in_class = True
                elif ch == ']':
                    in_class = False
                elif ch == '/' and not in_class:
                    break
                j += 1
            i = j + 1
            continue
        # String literal / template literal
        if c in '\'"`':
            quote = c
            i += 1
            while i < n:
                if js_body[i] == '\\':
                    i += 2
                    continue
                if js_body[i] == quote:
                    break
                i += 1
            i += 1
            continue
        # Identifier — kemungkinan nama fungsi diikuti '(' argumen pertama
        if c.isalpha() or c in '_$':
            start = i
            while i < n and (js_body[i].isalnum() or js_body[i] in '_$'):
                i += 1
            func_name = js_body[start:i]
            j = i
            while j < n and js_body[j] in ' \t\r\n':
                j += 1
            if j < n and js_body[j] == '(':
                j += 1
                while j < n and js_body[j] in ' \t\r\n':
                    j += 1
                if j < n and js_body[j] in '\'"`':
                    # Argumen pertama = string literal
                    quote = js_body[j]
                    j += 1
                    buf = []
                    while j < n:
                        if js_body[j] == '\\':
                            if j + 1 < n:
                                buf.append(js_body[j + 1])
                                j += 2
                                continue
                            break
                        if js_body[j] == quote:
                            break
                        buf.append(js_body[j])
                        j += 1
                    yield (func_name, ''.join(buf), True, j + 1)
                    i = j + 1
                    continue
                if j < n and (js_body[j].isalpha() or js_body[j] in '_$'):
                    # Argumen pertama = identifier (mis. getElementById(modalId))
                    k = j
                    while k < n and (js_body[k].isalnum() or js_body[k] in '_$'):
                        k += 1
                    yield (func_name, js_body[j:k], False, k)
                    i = k
                    continue
                # Argumen pertama bukan string/identifier — tetap diyield.
                # PENTING: i = j (bukan j + 1) agar karakter pertama argumen
                # diproses ulang oleh loop (mis. regex literal /.../ yang
                # memuat kutip tidak lolos terdeteksi sebagai string palsu).
                yield (func_name, None, False, j + 1)
                i = j
                continue
            continue
        i += 1


# ---------------------------------------------------------------------------
# Helper #9+#10: satu pass _iter_call_args -> referensi DOM (getElementById
# dan querySelector/All sekaligus, tanpa memindai body JS dua kali)
# ---------------------------------------------------------------------------
def extract_dom_refs(js_body):
    """Satu pass: ekstrak referensi getElementById dan querySelector sekaligus.

    Mengembalikan (ids_statis, prefix_dinamis, var_calls, selectors):
      - ids_statis:  getElementById('foo') -> 'foo'
      - prefix_dinamis: getElementById('foo' + x) -> 'foo' (diverifikasi hanya
        awalan/prefix-nya terhadap DOM)
      - var_calls:   getElementById(modalId) -> 'modalId' (argumen variabel;
        diverifikasi pemeriksa lewat sumber nilainya)
      - selectors:   argumen string dari querySelector(All), closest, dan
        matches ('...') — semuanya selector yang mereferensikan elemen DOM

    Catatan batasan (konsisten pra-refactor): komentar antara '(' dan argumen
    pertama (foo(/* c */ 'x')) membuat argumen tak di-yield; call bersarang
    sebagai argumen (foo(bar('x'))) terklasifikasi sebagai identifier 'bar'.
    end_pos pada _iter_call_args hanya valid bila is_string=True."""
    ids = []
    prefixes = []
    var_calls = []
    selectors = []
    # Fungsi DOM-traversal yang menerima selector string; argumennya diperlakukan
    # sama dengan querySelector/All oleh pemeriksa #10.
    selector_funcs = {'querySelector', 'querySelectorAll', 'closest', 'matches'}
    for func_name, arg_value, is_string, end_pos in _iter_call_args(js_body):
        if func_name == 'getElementById':
            if is_string:
                # Setelah string literal: '+' => prefix dinamis; selain itu ID statis
                k = end_pos
                while k < len(js_body) and js_body[k] in ' \t\r\n':
                    k += 1
                if k < len(js_body) and js_body[k] == '+':
                    prefixes.append(arg_value)
                else:
                    ids.append(arg_value)
            elif arg_value is not None:
                var_calls.append(arg_value)
        elif func_name in selector_funcs and is_string:
            selectors.append(arg_value)
    return ids, prefixes, var_calls, selectors


# ---------------------------------------------------------------------------
# Helper: pemeriksa keseimbangan tag HTML (HTMLParser standar)
# ---------------------------------------------------------------------------
VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
             'link', 'meta', 'param', 'source', 'track', 'wbr'}


class TagBalanceParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID_TAGS:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        pass  # self-closing (mis. <path />) — tidak perlu ditutup

    def handle_endtag(self, tag):
        if tag in VOID_TAGS:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append((tag, self.getpos()))


# ---------------------------------------------------------------------------
# Audit pre-flight modular: setiap pemeriksaan adalah metode terdaftar lewat
# dekorator @check. Menambah pemeriksaan baru cukup menulis satu metode dengan
# dekorator — tanpa menyentuh run() atau pemanggil.
# ---------------------------------------------------------------------------
# Registry level modul: dekorator dieksekusi saat class body dievaluasi, jadi
# tidak boleh mereferensikan PreflightAudit (belum terikat).
_CHECKS_REGISTRY = []


def register(fn):
    """Dekorator: daftarkan metode sebagai pemeriksaan (urutan = urutan kode)."""
    _CHECKS_REGISTRY.append(fn)
    return fn


class PreflightAudit:
    """Audit pre-flight modular (12 pemeriksaan).

    State bersama dihitung sekali di __init__ (scripts, dom_ids) dan di
    pemeriksaan #9 (referensi DOM) — lalu dipakai oleh #9b dan #10.
    quick=True melewati node --check (#6) untuk gerbang cepat (pre-commit);
    gerbang penuh (pre-push / CI) tetap menjalankan 12 pemeriksaan lengkap.
    """

    def __init__(self, content, quick=False):
        self.content = content
        self.quick = quick
        self.errors = 0
        self.pass_count = 0
        self.warn_count = 0
        # State bersama (dihitung sekali, dipakai banyak pemeriksaan)
        self.scripts = re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*\btype=)[^>]*>(.*?)</script>',
                                  content, re.S)
        self.dom_ids = re.findall(r'id="([^"]+)"', content)
        self._dom_refs_cache = None  # lazy cache, di-reset di run() agar idempotent

    def _dom_refs(self):
        """Referensi DOM (getElementById + selector) dihitung sekali lalu di-cache.

        Check #9, #9b, dan #10 memakai hasil ini — karena lazy + cached, urutan
        deklarasi check tidak lagi menentukan: setiap check aman dipanggil kapan
        pun tanpa mengandalkan check lain berjalan lebih dulu.
        """
        if self._dom_refs_cache is None:
            used_ids, used_prefixes, var_calls, qs_selectors = [], [], [], []
            for script_body in self.scripts:
                ids_part, prefixes_part, var_calls_part, sel_part = extract_dom_refs(script_body)
                used_ids += ids_part
                used_prefixes += prefixes_part
                var_calls += var_calls_part
                qs_selectors += sel_part
            self._dom_refs_cache = (used_ids, used_prefixes, var_calls, qs_selectors)
        return self._dom_refs_cache

    # -- helper output ------------------------------------------------------
    def _pass(self, msg):
        self.pass_count += 1
        print(f"[PASS] {msg}")

    def _fail(self, msg):
        self.errors += 1
        print(f"[FAIL] {msg}")

    def _warn(self, msg):
        self.warn_count += 1
        print(f"[WARN] {msg}")

    # -- 1. Form Endpoint (Formspree ID mkgknrqk) ---------------------------
    @register
    def _check_01_form(self):
        if '<form' in self.content:
            if ('action="https://formspree.io/f/mkgknrqk"' not in self.content
                    or 'method="POST"' not in self.content):
                self._fail("Form Kontak tidak terkonfigurasi dengan endpoint Formspree yang benar atau tidak menggunakan POST.")
            else:
                self._pass("Form Kontak terhubung ke Formspree (Endpoint: mkgknrqk).")
        else:
            self._warn("Tidak ditemukan elemen <form> di dalam file.")

    # -- 2. Keamanan Tautan Eksternal (anti tabnabbing) ---------------------
    @register
    def _check_02_external_links(self):
        external_links = re.findall(r'<a[^>]+href=["\']http[^>]+>', self.content)
        missing_target = [link for link in external_links
                          if 'target="_blank"' not in link or 'noopener' not in link]
        if missing_target:
            self._fail(f"Ditemukan {len(missing_target)} tautan eksternal yang rentan tabnabbing "
                       f"(tanpa target='_blank' & rel='noopener noreferrer').")
        else:
            self._pass("Tautan eksternal aman dari tabnabbing.")

    # -- 3. Absolute Path Lokal (aset rusak di GitHub Pages) ----------------
    @register
    def _check_03_local_paths(self):
        local_paths = re.findall(r'(?:src|href)=["\'](?:file://|[A-Z]:/|/Users/|C:/)', self.content)
        if local_paths:
            self._fail(f"Ditemukan Absolute Path lokal (Aset akan rusak di Production): {local_paths}")
        else:
            self._pass("Semua asset path menggunakan relative path yang valid.")

    # -- 4. Isolasi Gimmick CLI dari Screen Reader (per baris) --------------
    @register
    def _check_04_gimmick_isolation(self):
        gimmick_markers = ['SYS_CMD_PROMPT', '[SYS_INIT]']
        gimmick_violations = []
        for lineno, line in enumerate(self.content.splitlines(), 1):
            if any(m in line for m in gimmick_markers) and 'aria-hidden' not in line:
                gimmick_violations.append((lineno, line.strip()[:80]))
        if gimmick_violations:
            self._fail(f"Gimmick terminal belum diisolasi dari Screen Reader (aria-hidden hilang): {gimmick_violations}")
        else:
            self._pass("Elemen UI/UX (Gimmick CLI) telah diisolasi per-baris (WCAG compliant).")

    # -- 5. Keseimbangan Tag HTML (HTMLParser standar) ----------------------
    @register
    def _check_05_tag_balance(self):
        parser = TagBalanceParser()
        parser.feed(self.content)
        if parser.errors:
            self._fail(f"Ditemukan {len(parser.errors)} ketidakseimbangan tag HTML: {parser.errors[:10]}")
        elif parser.stack:
            self._fail(f"Tag HTML belum tertutup: {parser.stack}")
        else:
            self._pass("Dokumen HTML seimbang (zero tag-balance errors).")

    # -- 6. Sintaks Inline Script (node --check) ----------------------------
    @register
    def _check_06_scripts(self):
        if self.quick:
            self._warn("Mode cepat (--quick): pemeriksaan sintaks node --check dilewati "
                       "(dijalankan penuh oleh pre-push / CI).")
            return
        if shutil.which('node'):
            script_errors = []
            node_env_error = None
            for idx, script_body in enumerate(self.scripts):
                tmp_path = None
                try:
                    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
                        f.write(script_body)
                        tmp_path = f.name
                    try:
                        result = subprocess.run(['node', '--check', tmp_path],
                                                capture_output=True, text=True)
                    except OSError as e:
                        # Environment (mis. handle stdout yang di-redirect oleh
                        # test runner/pytest di Windows) membuat node gagal
                        # diluncurkan — audit memilih WARN, bukan crash.
                        node_env_error = e
                        break
                    if result.returncode != 0:
                        script_errors.append((idx, result.stderr[:200]))
                finally:
                    if tmp_path:
                        try:
                            os.unlink(tmp_path)
                        except OSError:
                            pass
            if node_env_error:
                self._warn(f"node --check tidak dapat diluncurkan (OSError: {node_env_error}) - "
                           "pemeriksaan sintaks dilewati.")
            elif script_errors:
                self._fail(f"{len(script_errors)} inline script gagal node --check: {script_errors}")
            else:
                self._pass(f"Semua {len(self.scripts)} inline script lolos node --check.")
        else:
            self._warn("node.js tidak ditemukan - pemeriksaan sintaks inline script dilewati.")

    # -- 7. Sinkronisasi Carousel Testimonial -------------------------------
    @register
    def _check_07_testimonials(self):
        slide_comments = re.findall(r'<!--\s*Slide\s+(\d+)\s*:', self.content)
        slide_nums = [int(s) for s in slide_comments]
        total_match = re.search(r'var\s+totalTestimonials\s*=\s*(\d+);', self.content)
        total = int(total_match.group(1)) if total_match else None
        if total is None:
            self._fail("Variabel totalTestimonials tidak ditemukan di script.")
        elif len(slide_nums) != total:
            self._fail(f"Komentar slide ({len(slide_nums)}) tidak sama dengan totalTestimonials ({total}).")
        elif slide_nums != list(range(1, total + 1)):
            self._fail(f"Penomoran komentar slide tidak berurutan: {slide_nums}")
        else:
            self._pass(f"{total} slide testimonial sinkron dengan totalTestimonials ({slide_nums}).")

    # -- 8. Parity & Coverage Kamus i18n (EN/ID) ----------------------------
    @register
    def _check_08_i18n(self):
        dict_match = re.search(r'en:\s*\{(.*?)\},\s*id:\s*\{(.*?)\}\s*\};', self.content, re.S)
        if dict_match:
            en_keys = extract_dict_keys(dict_match.group(1))
            id_keys = extract_dict_keys(dict_match.group(2))
            used_keys = (set(re.findall(r'data-i18n="([^"]+)"', self.content))
                         | set(re.findall(r'data-i18n-ph="([^"]+)"', self.content)))

            if en_keys != id_keys:
                self._fail(f"Kamus i18n tidak seimbang: {len(en_keys)} key EN vs {len(id_keys)} key ID. "
                           f"Hanya-EN: {sorted(en_keys - id_keys)[:5]} | Hanya-ID: {sorted(id_keys - en_keys)[:5]}")
            else:
                self._pass(f"Parity i18n EN/ID seimbang ({len(en_keys)} key).")

            missing_usage = sorted(used_keys - en_keys)
            if missing_usage:
                self._fail(f"Key data-i18n dipakai di HTML tapi tidak ada di kamus: {missing_usage}")
            else:
                self._pass(f"Semua {len(used_keys)} key data-i18n yang dipakai terdefinisi di kamus EN/ID.")
        else:
            self._warn("Kamus i18n (en/id) tidak ditemukan - pemeriksaan i18n dilewati.")

    # -- 9. Semua ID getElementById resolve ke elemen DOM -------------------
    @register
    def _check_09_dom_ids(self):
        used_ids, used_prefixes, _, _ = self._dom_refs()
        used_unique = sorted(set(used_ids))
        missing_ids = sorted(set(used_ids) - set(self.dom_ids))

        dom_counter = Counter(self.dom_ids)
        dup_ids = sorted(i for i, n in dom_counter.items() if n > 1)

        # Prefix dinamis (getElementById('prefix' + var)) harus punya minimal
        # satu ID DOM yang diawali prefix tersebut agar rujukan runtime tidak
        # kosong. Catatan: jaminan "setidaknya satu elemen cocok prefix",
        # bukan bahwa setiap nilai runtime pasti resolve.
        unmatched_prefixes = sorted({p for p in used_prefixes
                                     if not any(d.startswith(p) for d in self.dom_ids)})

        id_issues = []
        if missing_ids:
            id_issues.append(f"{len(missing_ids)} ID getElementById tidak ada di DOM: {missing_ids[:10]}")
        if unmatched_prefixes:
            id_issues.append(f"{len(unmatched_prefixes)} prefix ID dinamis getElementById tidak cocok dengan ID DOM mana pun: {unmatched_prefixes[:10]}")
        if dup_ids:
            id_issues.append(f"{len(dup_ids)} atribut id duplikat (getElementById ambigu): {dup_ids[:10]}")

        if id_issues:
            self._fail(f"Referensi elemen tidak sehat: {'; '.join(id_issues)}")
        else:
            detail = f" + {len(set(used_prefixes))} prefix dinamis terverifikasi" if used_prefixes else ""
            self._pass(f"Semua {len(used_unique)} ID getElementById unik resolve ke elemen DOM{detail} (0 rujukan mati, 0 id duplikat).")

    # -- 9b. Panggilan variabel getElementById(modalId): sumber nilai --------
    @register
    def _check_09b_modal_var(self):
        _, _, var_calls, _ = self._dom_refs()
        unique_vars = sorted(set(var_calls))
        if not unique_vars:
            return
        dom_set = set(self.dom_ids)
        var_issues = []
        # Catatan batasan: regex hanya mengenali function declaration
        # (function nama(params)); arrow/method shorthand tidak terdeteksi dan
        # akan memicu FAIL "bukan parameter fungsi mana pun" — konsisten dengan
        # gaya function declaration yang dipakai di kodebase ini.
        func_defs = re.findall(r'function\s+(\w+)\s*\(([^)]*)\)', self.content)
        data_targets = set(re.findall(r'data-modal-target="([^"]+)"', self.content))

        # Fungsi pemilik variabel + seluruh literal call-nya (dihitung sekali)
        owner_funcs = sorted({fn for fn, params in func_defs
                              for v in unique_vars
                              if re.search(r'\b' + re.escape(v) + r'\b', params)})
        lit_calls = set(lc for fn in owner_funcs
                        for lc in re.findall(r'\b' + re.escape(fn) + r"\(\s*'([^']+)'\s*\)", self.content))

        # Catatan batasan: call ber-argumen gabungan (openModal('modal-' + id))
        # tidak cocok pola literal; asimetris dengan #9 yang menangani prefix.
        # Tidak dipakai di kodebase saat ini.

        for var_name in unique_vars:
            if not any(re.search(r'\b' + re.escape(var_name) + r'\b', params)
                       for _, params in func_defs):
                var_issues.append(
                    f"{var_name} bukan parameter fungsi mana pun (referensi tak terlacak)")
                continue
            # Semua literal call ke fungsi pemilik harus menunjuk elemen DOM
            bad_calls = sorted(lit_calls - dom_set)
            if bad_calls:
                var_issues.append(
                    f"{var_name} -> literal call memuat nilai tanpa elemen DOM: {bad_calls}")
            # Semua data-modal-target (dibaca via dataset.modalTarget) resolve
            bad_targets = sorted(data_targets - dom_set)
            if bad_targets:
                var_issues.append(
                    f"{var_name} -> data-modal-target tanpa elemen DOM: {bad_targets}")

        if var_issues:
            self._fail(f"Panggilan variabel getElementById tak terverifikasi: {'; '.join(var_issues)}")
        else:
            self._pass(f"Panggilan variabel getElementById({', '.join(unique_vars)}) terverifikasi: "
                       f"argumen berasal dari {', '.join(owner_funcs)}('...') & data-modal-target "
                       f"({len(data_targets)} target, {len(lit_calls)} literal call) - semuanya resolve ke DOM.")

    # -- 10. Selector querySelector/All, closest, matches ('#id') -> DOM -----
    @register
    def _check_10_selectors(self):
        _, _, _, qs_selectors = self._dom_refs()
        qs_ids = set()
        for sel in qs_selectors:
            # Buang attribute selector [attr=...] — id di dalamnya bukan id target
            no_attrs = re.sub(r'\[[^\]]*\]', '', sel)
            for iid in re.findall(r'#([A-Za-z][\w-]*)', no_attrs):
                qs_ids.add(iid)

        missing_qs_ids = sorted(qs_ids - set(self.dom_ids))
        if missing_qs_ids:
            self._fail(f"Selector querySelector/closest/matches('#id') menunjuk elemen yang tidak ada di DOM: {missing_qs_ids}")
        else:
            self._pass(f"Semua {len(qs_ids)} ID querySelector/closest/matches('#...') unik resolve ke elemen DOM "
                       f"(dari {len(set(qs_selectors))} selector).")

    # -- Eksekusi -----------------------------------------------------------
    def run(self):
        # Reset state agar run() idempotent (aman dipanggil berulang pada
        # instance yang sama tanpa menggandakan hitungan referensi DOM).
        self.errors = 0
        self.pass_count = 0
        self.warn_count = 0
        self._dom_refs_cache = None
        for fn in _CHECKS_REGISTRY:
            fn(self)
        return self.errors


def run_preflight_check(file_path, quick=False):
    """Baca file, jalankan seluruh pemeriksaan terdaftar, cetak hasil akhir."""
    print("[SYS_INIT] Memulai Audit Pre-Flight untuk Deployment GitHub...\n")

    if not os.path.exists(file_path):
        print(f"[ERROR] Fatal: File {file_path} tidak ditemukan di direktori saat ini.")
        sys.exit(1)

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"[ERROR] Gagal membaca file: {e}")
        sys.exit(1)

    started = time.monotonic()
    audit = PreflightAudit(content, quick=quick)
    errors = audit.run()
    elapsed = time.monotonic() - started

    print("\n" + "=" * 30)
    print("HASIL AUDIT PRE-FLIGHT")
    print("=" * 30)
    print(f"Ringkasan: {audit.pass_count} PASS | {errors} FAIL | {audit.warn_count} WARN "
          f"| {len(_CHECKS_REGISTRY)} pemeriksaan | {elapsed:.2f}s")
    if errors == 0:
        print("[STATUS]: 100% PRODUCTION READY. Silakan eksekusi Git Commit dan Push.")
    else:
        print(f"[STATUS]: GAGAL. Ditemukan {errors} isu arsitektural. Perbaiki sebelum push ke GitHub.")
        sys.exit(1)


def parse_cli_args(argv):
    """Parse argumen CLI -> (target_file, quick).

    Argumen posisi pertama (bila ada) adalah file target; --quick menonaktifkan
    node --check. Argumen yang diawali '-' (single atau double dash) tidak pernah
    dianggap file target, jadi flag seperti --help/-q diabaikan dengan aman
    (bukan menjadi nama file yang bingung "tidak ditemukan").
    """
    quick = '--quick' in argv
    positional = [a for a in argv if not a.startswith('-')]
    target_file = positional[0] if positional else 'index.html'
    return target_file, quick


if __name__ == "__main__":
    # Target file dapat dikonfigurasi sebagai argumen posisi pertama:
    #   python audit.py                 -> audit index.html (default, 12 pemeriksaan)
    #   python audit.py path/to/x.html  -> audit file lain
    #   python audit.py --quick         -> tanpa node --check (untuk pre-commit)
    #   python audit.py file.html --quick -> kombinasi keduanya
    target_file, quick = parse_cli_args(sys.argv[1:])
    run_preflight_check(target_file, quick=quick)
