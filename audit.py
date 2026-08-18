import json
import re
import sys
import os
import shutil
import subprocess
import tempfile
import time
from collections import Counter
from html import unescape
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# Helper: tokenizer to extract keys from an i18n dictionary (string-safe)
# ---------------------------------------------------------------------------
def extract_dict_keys(body):
    """Extract object keys from a dict body, skipping quoted strings.

    Note: the tokenizer assumes string values do not use interpolated template
    literals (${...}) and that all strings are properly closed.
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
# Helper: shared JS scanner — skips strings/regex/comments and yields function
# calls with their first argument (used by checks #9 and #10).
# ---------------------------------------------------------------------------
_REGEX_PRECEDING_KEYWORDS = {'return', 'typeof', 'instanceof', 'in', 'new',
                             'delete', 'void', 'yield', 'case', 'do', 'else'}


def _looks_like_regex_start(js_body, i):
    """Heuristic: does '/' at position i start a regex literal (not division)?

    Regex literals often contain quote characters (e.g. /[&<>"']/g) that could
    fool the string tokenizer; this heuristic uses the preceding character
    context (operator, parenthesis, or a keyword such as return).

    Known limitations (not present in the current codebase): a regex appearing
    right after ')' (e.g. if (x) /re/.test(y)) is misclassified as division;
    pathological cases like x = "a" / "b" or x++ / 2 are treated as regex.
    Safe enough for auditing this codebase."""
    j = i - 1
    while j >= 0 and js_body[j] in ' \t\r\n':
        j -= 1
    if j < 0:
        return True
    c = js_body[j]
    if c.isalnum() or c in '_)]}':
        # Check whether the previous word is a keyword that precedes a regex
        start = j
        while start >= 0 and (js_body[start].isalnum() or js_body[start] in '_$'):
            start -= 1
        word = js_body[start + 1:j + 1]
        return word in _REGEX_PRECEDING_KEYWORDS
    return True


def _iter_call_args(js_body):
    """Generator: yield (func_name, arg_value, is_string, end_pos) for each
    `func(<arg1>)` call inside the JS.

    - is_string=True  when arg1 is a string literal (arg_value = its contents,
      end_pos = position right after the closing quote — for checking '+' / ')').
    - is_string=False when arg1 is an identifier (arg_value = its name, end_pos =
      the position after the identifier).
    - arg_value=None  when arg1 is neither (still yielded for consistency).

    Safe against string literals (', ", `), regex literals, and comments
    (/* */, //) so example text inside comments/strings does not produce false
    positives. Yielded function names are full identifiers (e.g.
    querySelectorAll, not the prefix 'querySelector') so identifier boundaries
    (myGetElementById, myQuerySelector) are handled automatically.

    Limitation: interpolated template literals (getElementById(`foo-${x}`)) are
    read whole as "static" strings — this pattern is not used in the codebase.
    """
    i = 0
    n = len(js_body)
    while i < n:
        c = js_body[i]
        # Block comment /* ... */
        if c == '/' and i + 1 < n and js_body[i + 1] == '*':
            end = js_body.find('*/', i + 2)
            i = end + 2 if end != -1 else n
            continue
        # Line comment // ...
        if c == '/' and i + 1 < n and js_body[i + 1] == '/':
            end = js_body.find('\n', i + 2)
            i = end + 1 if end != -1 else n
            continue
        # Regex literal (e.g. /[&<>"']/g) — skip to the closing '/'
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
        # Identifier — possibly a function name followed by '(' first argument
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
                    # First argument = string literal
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
                    # First argument = identifier (e.g. getElementById(modalId))
                    k = j
                    while k < n and (js_body[k].isalnum() or js_body[k] in '_$'):
                        k += 1
                    yield (func_name, js_body[j:k], False, k)
                    i = k
                    continue
                # First argument is neither string nor identifier — still yielded.
                # IMPORTANT: i = j (not j + 1) so the first character of the
                # argument is reprocessed by the loop (e.g. a regex literal
                # /.../ containing quotes is not falsely detected as a string).
                yield (func_name, None, False, j + 1)
                i = j
                continue
            continue
        i += 1


# ---------------------------------------------------------------------------
# Helper #9+#10: single _iter_call_args pass -> DOM references (getElementById
# and querySelector/All together, without scanning the JS body twice)
# ---------------------------------------------------------------------------
def extract_dom_refs(js_body):
    """Single pass: extract getElementById and querySelector references.

    Returns (static_ids, dynamic_prefixes, var_calls, selectors):
      - static_ids:  getElementById('foo') -> 'foo'
      - dynamic_prefixes: getElementById('foo' + x) -> 'foo' (verified only as a
        prefix against the DOM)
      - var_calls:   getElementById(modalId) -> 'modalId' (variable argument;
        verified by the checker through the source of its value)
      - selectors:   string arguments of querySelector(All), closest, and
        matches ('...') — all selectors that reference DOM elements

    Known limitation (consistent pre-refactor): a comment between '(' and the
    first argument (foo(/* c */ 'x')) makes the argument not yielded; nested
    calls as arguments (foo(bar('x'))) are classified as identifier 'bar'.
    end_pos in _iter_call_args is only valid when is_string=True."""
    ids = []
    prefixes = []
    var_calls = []
    selectors = []
    # DOM-traversal functions that accept a selector string; their arguments are
    # treated the same as querySelector/All by check #10.
    selector_funcs = {'querySelector', 'querySelectorAll', 'closest', 'matches'}
    for func_name, arg_value, is_string, end_pos in _iter_call_args(js_body):
        if func_name == 'getElementById':
            if is_string:
                # After a string literal: '+' => dynamic prefix; otherwise static ID
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
# Helper: HTML tag-balance checker (standard HTMLParser)
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
        pass  # self-closing (e.g. <path />) — does not need closing

    def handle_endtag(self, tag):
        if tag in VOID_TAGS:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append((tag, self.getpos()))


# ---------------------------------------------------------------------------
# Modular pre-flight audit: each check is a method registered via the @check
# decorator. Adding a new check is just one decorated method — no changes to
# run() or the callers.
# ---------------------------------------------------------------------------
# Module-level registry: the decorator runs while the class body is being
# evaluated, so it must not reference PreflightAudit (not yet bound).
_CHECKS_REGISTRY = []


def register(fn):
    """Decorator: register a method as a check (order = source order)."""
    _CHECKS_REGISTRY.append(fn)
    return fn


class PreflightAudit:
    """Modular pre-flight audit (14 checks).

    Shared state is computed once in __init__ (scripts, dom_ids) and in check
    #9 (DOM references) — then reused by #9b and #10.
    quick=True skips node --check (#6) for fast gates (pre-commit); the full
    gate (pre-push / CI) still runs all 14 checks.

    Some checks are conditional on features present on the page (CLI gimmick
    #4, testimonial carousel #7, i18n dictionary #8, variable getElementById
    call #9b): when the feature is absent, the check passes as "not applicable"
    — so the gate works for both the legacy SPA and the Field Manual as the
    new index.html.
    """

    def __init__(self, content, quick=False):
        self.content = content
        self.quick = quick
        self.errors = 0
        self.pass_count = 0
        self.warn_count = 0
        # Shared state (computed once, used by many checks)
        self.scripts = re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*\btype=)[^>]*>(.*?)</script>',
                                  content, re.S)
        self.dom_ids = re.findall(r'id="([^"]+)"', content)
        self._dom_refs_cache = None  # lazy cache, reset in run() to stay idempotent

    def _dom_refs(self):
        """DOM references (getElementById + selectors) computed once, then cached.

        Checks #9, #9b, and #10 use this result — because it is lazy + cached,
        check declaration order no longer matters: each check is safe to call at
        any time without relying on another check having run first.
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
                self._fail("Contact form is not configured with the correct Formspree endpoint or does not use POST.")
            else:
                self._pass("Contact form connected to Formspree (Endpoint: mkgknrqk).")
        else:
            self._warn("No <form> element found in the file.")

    # -- 2. External Link Safety (anti tabnabbing) --------------------------
    @register
    def _check_02_external_links(self):
        external_links = re.findall(r'<a[^>]+href=["\']http[^>]+>', self.content)
        missing_target = [link for link in external_links
                          if 'target="_blank"' not in link or 'noopener' not in link]
        if missing_target:
            self._fail(f"Found {len(missing_target)} external links vulnerable to tabnabbing "
                       f"(missing target='_blank' & rel='noopener noreferrer').")
        else:
            self._pass("External links are safe from tabnabbing.")

    # -- 3. Local Absolute Paths (broken assets on GitHub Pages) ------------
    @register
    def _check_03_local_paths(self):
        local_paths = re.findall(r'(?:src|href)=["\'](?:file://|[A-Z]:/|/Users/|C:/)', self.content)
        if local_paths:
            self._fail(f"Found local Absolute Paths (assets will break in Production): {local_paths}")
        else:
            self._pass("All asset paths use valid relative paths.")

    # -- 4. CLI Gimmick Isolation from Screen Reader (per line) -------------
    @register
    def _check_04_gimmick_isolation(self):
        gimmick_markers = ['SYS_CMD_PROMPT', '[SYS_INIT]']
        if not any(m in self.content for m in gimmick_markers):
            self._pass("No CLI terminal gimmick - screen-reader isolation check not applicable.")
            return
        gimmick_violations = []
        for lineno, line in enumerate(self.content.splitlines(), 1):
            if any(m in line for m in gimmick_markers) and 'aria-hidden' not in line:
                gimmick_violations.append((lineno, line.strip()[:80]))
        if gimmick_violations:
            self._fail(f"Terminal gimmick not isolated from Screen Reader (aria-hidden missing): {gimmick_violations}")
        else:
            self._pass("UI/UX elements (CLI gimmick) are isolated per line (WCAG compliant).")

    # -- 5. HTML Tag Balance (standard HTMLParser) --------------------------
    @register
    def _check_05_tag_balance(self):
        parser = TagBalanceParser()
        parser.feed(self.content)
        if parser.errors:
            self._fail(f"Found {len(parser.errors)} HTML tag-balance errors: {parser.errors[:10]}")
        elif parser.stack:
            self._fail(f"Unclosed HTML tags: {parser.stack}")
        else:
            self._pass("HTML document is balanced (zero tag-balance errors).")

    # -- 6. Inline Script Syntax (node --check) -----------------------------
    @register
    def _check_06_scripts(self):
        if self.quick:
            self._warn("Quick mode (--quick): node --check syntax check skipped "
                       "(run in full by pre-push / CI).")
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
                        # Environment issues (e.g. stdout redirected by the test
                        # runner/pytest on Windows) prevent node from launching —
                        # the audit chooses WARN instead of crashing.
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
                self._warn(f"node --check could not be launched (OSError: {node_env_error}) - "
                           "syntax check skipped.")
            elif script_errors:
                self._fail(f"{len(script_errors)} inline scripts failed node --check: {script_errors}")
            else:
                self._pass(f"All {len(self.scripts)} inline scripts passed node --check.")
        else:
            self._warn("node.js not found - inline script syntax check skipped.")

    # -- 7. Testimonial Carousel Sync ---------------------------------------
    @register
    def _check_07_testimonials(self):
        slide_comments = re.findall(r'<!--\s*Slide\s+(\d+)\s*:', self.content)
        slide_nums = [int(s) for s in slide_comments]
        total_match = re.search(r'var\s+totalTestimonials\s*=\s*(\d+);', self.content)
        total = int(total_match.group(1)) if total_match else None
        if total_match is None and not slide_comments:
            self._pass("No testimonial carousel (totalTestimonials) - slide-sync check not applicable.")
            return
        if total is None:
            self._fail("Slide comments found but the totalTestimonials variable is missing from the script.")
        elif len(slide_nums) != total:
            self._fail(f"Slide comments ({len(slide_nums)}) do not match totalTestimonials ({total}).")
        elif slide_nums != list(range(1, total + 1)):
            self._fail(f"Slide comment numbering is out of order: {slide_nums}")
        else:
            self._pass(f"{total} testimonial slides in sync with totalTestimonials ({slide_nums}).")

    # -- 8. i18n Dictionary Parity & Coverage (EN/ID) -----------------------
    @register
    def _check_08_i18n(self):
        dict_match = re.search(r'en:\s*\{(.*?)\},\s*id:\s*\{(.*?)\}\s*\};', self.content, re.S)
        used_keys = (set(re.findall(r'data-i18n="([^"]+)"', self.content))
                     | set(re.findall(r'data-i18n-ph="([^"]+)"', self.content)))

        if not dict_match:
            if used_keys:
                self._fail(f"Found {len(used_keys)} data-i18n attributes used in the HTML but the "
                           f"en/id dictionary is missing: {sorted(used_keys)[:5]}")
            else:
                self._pass("Single-language page (no en/id dictionary & no data-i18n) - i18n parity check not applicable.")
            return

        en_keys = extract_dict_keys(dict_match.group(1))
        id_keys = extract_dict_keys(dict_match.group(2))

        if en_keys != id_keys:
            self._fail(f"i18n dictionary unbalanced: {len(en_keys)} EN keys vs {len(id_keys)} ID keys. "
                       f"EN-only: {sorted(en_keys - id_keys)[:5]} | ID-only: {sorted(id_keys - en_keys)[:5]}")
        else:
            self._pass(f"i18n EN/ID parity balanced ({len(en_keys)} keys).")

        missing_usage = sorted(used_keys - en_keys)
        if missing_usage:
            self._fail(f"data-i18n keys used in the HTML but missing from the dictionary: {missing_usage}")
        else:
            self._pass(f"All {len(used_keys)} used data-i18n keys are defined in the EN/ID dictionary.")

    # -- 9. All getElementById IDs resolve to DOM elements ------------------
    @register
    def _check_09_dom_ids(self):
        used_ids, used_prefixes, _, _ = self._dom_refs()
        used_unique = sorted(set(used_ids))
        missing_ids = sorted(set(used_ids) - set(self.dom_ids))

        dom_counter = Counter(self.dom_ids)
        dup_ids = sorted(i for i, n in dom_counter.items() if n > 1)

        # Dynamic prefixes (getElementById('prefix' + var)) must have at least
        # one DOM ID starting with that prefix so runtime references are not
        # empty. Note: this guarantees "at least one element matches the
        # prefix", not that every runtime value resolves.
        unmatched_prefixes = sorted({p for p in used_prefixes
                                     if not any(d.startswith(p) for d in self.dom_ids)})

        id_issues = []
        if missing_ids:
            id_issues.append(f"{len(missing_ids)} getElementById IDs not present in the DOM: {missing_ids[:10]}")
        if unmatched_prefixes:
            id_issues.append(f"{len(unmatched_prefixes)} dynamic getElementById ID prefixes do not match any DOM ID: {unmatched_prefixes[:10]}")
        if dup_ids:
            id_issues.append(f"{len(dup_ids)} duplicate id attributes (ambiguous getElementById): {dup_ids[:10]}")

        if id_issues:
            self._fail(f"Unhealthy element references: {'; '.join(id_issues)}")
        else:
            detail = f" + {len(set(used_prefixes))} verified dynamic prefixes" if used_prefixes else ""
            self._pass(f"All {len(used_unique)} unique getElementById IDs resolve to DOM elements{detail} (0 dead references, 0 duplicate ids).")

    # -- 9b. Variable getElementById(modalId) calls: value source -----------
    @register
    def _check_09b_modal_var(self):
        _, _, var_calls, _ = self._dom_refs()
        unique_vars = sorted(set(var_calls))
        if not unique_vars:
            self._pass("No variable getElementById calls - value-source check not applicable.")
            return
        dom_set = set(self.dom_ids)
        var_issues = []
        # Note: the regex only recognizes function declarations
        # (function name(params)); arrow/method shorthand is not detected and
        # would trigger a FAIL "not a parameter of any function" — consistent
        # with the function-declaration style used in this codebase.
        func_defs = re.findall(r'function\s+(\w+)\s*\(([^)]*)\)', self.content)
        data_targets = set(re.findall(r'data-modal-target="([^"]+)"', self.content))

        # Functions owning the variable + all their literal calls (computed once)
        owner_funcs = sorted({fn for fn, params in func_defs
                              for v in unique_vars
                              if re.search(r'\b' + re.escape(v) + r'\b', params)})
        lit_calls = set(lc for fn in owner_funcs
                        for lc in re.findall(r'\b' + re.escape(fn) + r"\(\s*'([^']+)'\s*\)", self.content))

        # Note: calls with combined arguments (openModal('modal-' + id)) do not
        # match the literal pattern; asymmetric with #9 which handles prefixes.
        # Not used in the current codebase.

        for var_name in unique_vars:
            if not any(re.search(r'\b' + re.escape(var_name) + r'\b', params)
                       for _, params in func_defs):
                var_issues.append(
                    f"{var_name} is not a parameter of any function (untracked reference)")
                continue
            # All literal calls to the owning function must point to a DOM element
            bad_calls = sorted(lit_calls - dom_set)
            if bad_calls:
                var_issues.append(
                    f"{var_name} -> literal calls contain values without a DOM element: {bad_calls}")
            # All data-modal-target (read via dataset.modalTarget) resolve
            bad_targets = sorted(data_targets - dom_set)
            if bad_targets:
                var_issues.append(
                    f"{var_name} -> data-modal-target without a DOM element: {bad_targets}")

        if var_issues:
            self._fail(f"Unverified variable getElementById calls: {'; '.join(var_issues)}")
        else:
            self._pass(f"Variable getElementById({', '.join(unique_vars)}) calls verified: "
                       f"arguments come from {', '.join(owner_funcs)}('...') & data-modal-target "
                       f"({len(data_targets)} targets, {len(lit_calls)} literal calls) - all resolve to the DOM.")

    # -- 10. querySelector/All, closest, matches ('#id') selectors -> DOM ----
    @register
    def _check_10_selectors(self):
        _, _, _, qs_selectors = self._dom_refs()
        qs_ids = set()
        for sel in qs_selectors:
            # Strip attribute selectors [attr=...] — ids inside them are not targets
            no_attrs = re.sub(r'\[[^\]]*\]', '', sel)
            for iid in re.findall(r'#([A-Za-z][\w-]*)', no_attrs):
                qs_ids.add(iid)

        missing_qs_ids = sorted(qs_ids - set(self.dom_ids))
        if missing_qs_ids:
            self._fail(f"querySelector/closest/matches('#id') selectors point to elements not in the DOM: {missing_qs_ids}")
        else:
            self._pass(f"All {len(qs_ids)} unique querySelector/closest/matches('#...') IDs resolve to DOM elements "
                       f"(from {len(set(qs_selectors))} selectors).")

    # -- 11. Basic SEO meta (Google & Bing SERP) ----------------------------
    @register
    def _check_11_seo_meta(self):
        issues = []
        title_len = None
        title_match = re.search(r'<title>([^<]*)</title>', self.content)
        if not title_match or not title_match.group(1).strip():
            issues.append("Tag <title> not found or empty")
        else:
            title_len = len(unescape(title_match.group(1)))
            if title_len > 65:
                issues.append(f"Tag <title> too long ({title_len} char > 65 SERP limit)")
        if 'rel="canonical"' not in self.content:
            issues.append("Link rel='canonical' not found")
        robots = re.search(r'name="robots"\s+content="([^"]+)"', self.content)
        if not robots:
            issues.append("Meta robots not found")
        elif 'noindex' in robots.group(1):
            issues.append("Meta robots contains noindex (page will not be indexed)")
        desc = re.search(r'name="description"\s+content="([^"]*)"', self.content)
        if not desc or not desc.group(1).strip():
            issues.append("Meta description not found or empty")
        else:
            desc_len = len(unescape(desc.group(1)))
            if desc_len > 160:
                issues.append(f"Meta description too long ({desc_len} char > 160)")
        for prop in ('og:title', 'og:description', 'og:image'):
            if f'property="{prop}"' not in self.content:
                issues.append(f"Open Graph {prop} not found")
        if 'name="twitter:card"' not in self.content:
            issues.append("Twitter Card (twitter:card) not found")
        if issues:
            self._fail("SEO meta unhealthy: " + "; ".join(issues))
        else:
            detail = f"title {title_len} char" if title_len else "title ok"
            self._pass(f"SEO meta complete ({detail}, description, robots index, canonical, OG, Twitter).")

    # -- 12. Valid JSON-LD structured data (schema.org) ---------------------
    @register
    def _check_12_jsonld(self):
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', self.content, re.S)
        if not blocks:
            self._fail("No JSON-LD structured data block (schema.org) found.")
            return
        errors = []
        types = []
        for i, body in enumerate(blocks, 1):
            try:
                data = json.loads(body)
            except json.JSONDecodeError as e:
                errors.append(f"block {i} is not valid JSON ({e})")
                continue
            if isinstance(data, dict) and isinstance(data.get('@type'), str):
                types.append(data['@type'])
        required_types = {'Person', 'WebSite'}
        missing_types = sorted(required_types - set(types))
        if missing_types:
            errors.append(f"JSON-LD missing schema.org types: {missing_types}")
        if errors:
            self._fail("JSON-LD structured data unhealthy: " + "; ".join(errors))
        else:
            self._pass(f"JSON-LD structured data valid ({len(blocks)} blocks, types: {', '.join(types)}).")

    # -- 13. ATS Print Mode Architecture & Standards -------------------------
    @register
    def _check_13_ats_print_architecture(self):
        """Verify @media print exists, enforces single-column layout, Arial font,
        page size A4, and pagination break rules."""
        if '@media print' not in self.content:
            self._fail("No @media print stylesheet found in document.")
            return

        idx = self.content.find('@media print')
        end_idx = self.content.find('</style>', idx)
        print_css = self.content[idx:end_idx] if (idx != -1 and end_idx != -1) else self.content

        errors = []
        if 'Arial' not in print_css:
            errors.append("Print font must specify Arial (universal ATS-safe font)")
        if 'size: a4' not in print_css.lower():
            errors.append("@page rule must declare A4 size")
        if 'break-inside: avoid' not in print_css:
            errors.append("Missing break-inside: avoid pagination protection")

        if errors:
            self._fail("ATS Print stylesheet non-compliant: " + "; ".join(errors))
        else:
            self._pass("ATS Print Mode verified (Single-column, Arial typography, A4 pagination, break-inside protection).")

    # -- Execution ----------------------------------------------------------
    def run(self):
        # Reset state so run() is idempotent (safe to call repeatedly on the
        # same instance without double-counting DOM reference hits).
        self.errors = 0
        self.pass_count = 0
        self.warn_count = 0
        self._dom_refs_cache = None
        for fn in _CHECKS_REGISTRY:
            fn(self)
        return self.errors


def run_preflight_check(file_path, quick=False):
    """Read the file, run every registered check, print the final result."""
    print("[SYS_INIT] Starting Pre-Flight Audit for GitHub Deployment...\n")

    if not os.path.exists(file_path):
        print(f"[ERROR] Fatal: File {file_path} not found in the current directory.")
        sys.exit(1)

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"[ERROR] Failed to read file: {e}")
        sys.exit(1)

    started = time.monotonic()
    audit = PreflightAudit(content, quick=quick)
    errors = audit.run()
    elapsed = time.monotonic() - started

    print("\n" + "=" * 30)
    print("PRE-FLIGHT AUDIT RESULTS")
    print("=" * 30)
    print(f"Summary: {audit.pass_count} PASS | {errors} FAIL | {audit.warn_count} WARN "
          f"| {len(_CHECKS_REGISTRY)} checks | {elapsed:.2f}s")
    if errors == 0:
        print("[STATUS]: 100% PRODUCTION READY. Proceed with Git Commit and Push.")
    else:
        print(f"[STATUS]: FAILED. Found {errors} architectural issues. Fix them before pushing to GitHub.")
        sys.exit(1)


def parse_cli_args(argv):
    """Parse CLI arguments -> (target_file, quick).

    The first positional argument (if any) is the target file; --quick disables
    node --check. Arguments starting with '-' (single or double dash) are never
    treated as the target file, so flags like --help/-q are safely ignored
    (rather than becoming a confusing "not found" filename).
    """
    quick = '--quick' in argv
    positional = [a for a in argv if not a.startswith('-')]
    target_file = positional[0] if positional else 'index.html'
    return target_file, quick


if __name__ == "__main__":
    # The target file can be configured as the first positional argument:
    #   python audit.py                 -> audit index.html (default, 14 checks)
    #   python audit.py path/to/x.html  -> audit another file
    #   python audit.py --quick         -> without node --check (for pre-commit)
    #   python audit.py file.html --quick -> combination of both
    target_file, quick = parse_cli_args(sys.argv[1:])
    run_preflight_check(target_file, quick=quick)
