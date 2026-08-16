# 🛡️ Sigit Adi Irianto — Enterprise IT & SecOps Portfolio

[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-blue.svg)](https://sisigitadi.github.io/portofolio/)
[![Security: BYOK API](https://img.shields.io/badge/Security-Bring--Your--Own--Key%20(BYOK)-emerald.svg)](#security--privacy-controls)
[![Privacy: UU PDP Compliant](https://img.shields.io/badge/Privacy-UU%20PDP%20Compliant-purple.svg)](#security--privacy-controls)
[![Accessibility: WCAG Standard](https://img.shields.io/badge/Accessibility-WCAG%20Compliant-green.svg)](#accessibility-a11y--wcag-compliance)

> **Official Web Portfolio of Sigit Adi Irianto**  
> *IT & SecOps Specialist | Applied AI Engineer*

This repository contains the single-page application (SPA) portfolio showcasing 20+ years of operational experience across IT infrastructure management, Security Operations Center (SOC) threat triage, DevSecOps automation pipelines, and practical applied AI engineering.

> **Current Role**: Web Administrator — *Ministry of Environment (BPDLH Project)* (Mar 2026 – Present), managing Docker-based infrastructure on Ubuntu/WSL for a government web platform with Wazuh SIEM monitoring and DVWA security sandboxing.

---

## 🏛️ Key Architectural Pillars

### 1. 100% Client-Side Architecture
- **Zero Server Overhead**: Built as a standalone SPA with no server, no framework runtime, and no build step required at deploy time — everything executes in the visitor's browser.
- **No Runtime Styling CDN**: Tailwind CSS is compiled once (v3.4.17) into a single static inline `<style>` block inside `index.html` — the ~300KB Tailwind Play CDN runtime compiler no longer ships to production. Remaining third-party assets are limited to CDN-hosted fonts/icons (Google Fonts, Font Awesome via cdnjs) and external services (Formspree form delivery); project preview images are served from local `assets/`. All documented under Security & Privacy below.
- **Client-Side Algorithms & Heuristics**: Features local rule-based keyword & Regex text classification, rule-based security input sanitization, and pattern-based spam/phishing detection without external API reliance.
- **Lean, Zero-Dead-Code Codebase**: Legacy AI simulation widgets, the unused D3.js fallback, and the dormant SFX synthesizer have been fully removed — every `getElementById` reference resolves to a real element (unique IDs auto-verified by `audit.py` checks #9/#9b/#10 at every pre-flight) and the document parses with zero HTML tag-balance errors, keeping the page light and maintainable.
- **Pre-Flight Audit & Git Gate**: `audit.py` runs **13 registered checks** (form endpoint, external-link safety, relative paths, WCAG gimmick isolation, HTML tag balance, inline-script syntax via `node --check`, testimonial sync, i18n parity, `getElementById`/`querySelector`/`closest`/`matches` DOM resolution, duplicate-id detection, **SEO meta** — title ≤ 65 / description ≤ 160 / robots `index` / canonical / OG / Twitter — and **JSON-LD structured-data validity** — `Person` + `WebSite` required) — each check is a registered method (`@register`), so adding #14+ is one method, no plumbing. Feature-specific checks (gimmick CLI #4, testimonial carousel #7, i18n dictionary #8, variable `getElementById` #9b) are **feature-conditional**: when the feature is absent they pass as "not applicable", so the gate is compatible with both the legacy SPA and the single-language Field Manual as `index.html`. Modes: `python audit.py` (full), `python audit.py --quick` (skips `node --check` for fast pre-commit feedback), and `python audit.py path/to/file.html` (audit any target; default `index.html`). Every run ends with a **summary line**: `Summary: 13 PASS | 0 FAIL | 0 WARN | 13 checks | 0.3s`.
- **Unit tests (`test_audit.py`, pytest)**: 30 tests lock in the audit's own behavior — valid `index.html` passes, every targeted breakage (dead `getElementById`, ghost `querySelector`, unbalanced tag, i18n mismatch, testimonial mismatch, wrong Formspree endpoint, `data-i18n` without dictionary, testimonial count drift, SEO noindex / missing title, invalid JSON-LD / missing schema type) is caught with exactly one FAIL, single-language pages pass the i18n/feature checks as "not applicable", `run()` is idempotent, `--quick` warns (never fails) when `node` is skipped, CLI arg parsing is parametrized, and `node --check` failing to launch (e.g. OSError under a Windows test runner) degrades to a resilience WARN instead of crashing. Run with `python -m pytest test_audit.py -v`.
- **Four gates, defense in depth**: (1) `.githooks/pre-commit` runs the audit in `--quick` mode for early detection; (2) `.githooks/pre-push` runs the full audit and **blocks the push** on any failure; (3) `.github/workflows/preflight.yml` runs the full audit **plus the full pytest suite (62 tests: `test_audit.py` 30 + `test_indexnow_ping.py` 32) plus the visitor-worker route tests (26, `node --test worker-visitor/worker.test.js`)** on every push/PR to `main` as a CI gate; (4) `.github/workflows/lighthouse-ci.yml` runs **Lighthouse CI** on every push/PR — **accessibility, best-practices & SEO must be 100** (error, blocks push/PR), performance ≥ 50 (warn, non-blocking — synthetic mobile-throttle score is noisy). Config in `.lighthouserc.json`; local equivalent: `python -m http.server 8899 --bind 127.0.0.1 &` then `npx --yes @lhci/cli@0.15.1 autorun --config=.lighthouserc.json`. Activate hooks once with `git config core.hooksPath .githooks` (then `chmod +x .githooks/pre-push .githooks/pre-commit` on Unix); `.gitattributes` keeps all hook scripts LF.

### 2. Applied AI & SecOps Engineering
- **Pragmatic AI Focus**: Bridges enterprise infrastructure with applied AI integration. Emphasizes prompt pipeline stability, prompt engineering, and local model deployment (Ollama/Naive Bayes) rather than unanchored foundation model claims.
- **SOC & Threat Triage**: Showcases hands-on experience managing Wazuh SIEM threat hunting, FortiWeb WAF telemetries, and automated incident triage workflows.

### 3. Bring-Your-Own-Key (BYOK) — Linked AI Apps
- **Scope Clarification**: This portfolio repository itself contains **no API-key handling code** — no OpenAI / Gemini / Anthropic keys are ever requested, stored, transmitted, or logged by this site.
- **BYOK Pattern (Linked Apps)**: The external AI prompt-engineering apps linked from the *Projects* section (PromptMatrix 1.0 / 2.0) operate under a strict **Bring-Your-Own-Key (BYOK)** pattern: API keys (OpenAI / Gemini) are entered by the user, held transiently in local browser memory, and are never transmitted to or logged on third-party servers. Because keys live only in the visitor's browser session, token leakage is eliminated by construction.

### 4. UU PDP / Privacy-First Data Protection
- **Local Demo Processing**: All three interactive demo widgets (expense classification, input sanitization, spam detection) run **100% locally in the browser** — no input ever leaves the device, so sandbox calculations involve no personal-data transfer.
- **Disclosed Form Transmission (Exception)**: The contact / CV request form intentionally transmits the visitor's name, email & message to **Formspree** (a third-party processor) solely for message delivery — disclosed directly in the form UI. Formspree's own handling of the submitted data is governed by its privacy policy.
- **No Tracking, No Cookies**: The site ships no analytics, no advertising, and no tracking scripts, and sets no cookies. Browser `localStorage` is used only for device-local preferences (theme, language, submit-rate timestamp) and never contains personal data. **Visitor tracker** (`worker-visitor/`), **active**: a self-hosted Cloudflare Worker hit counter + private owner dashboard — stores only salted SHA-256 IP hashes (raw IPs are never persisted, UU PDP friendly) and reads geolocation from the Cloudflare edge.
- **Third-Party Data Flows (complete list)**: The only outbound network call is the contact form → Formspree (`https://formspree.io/f/mkgknrqk`). Project preview images are served from local `assets/` (no third-party image CDN). The visitor tracker is enabled: the page sends one anonymous page-view ping to **your own** Cloudflare Worker (`POST /hit`) and polls `GET /count` every 60s — no third-party analytics involved.

---

## ⚡ Interactive Modules & Demos

1. **Live Expense Classifier**: Client-side rule-based keyword + Regex text classification combined with informal Indonesian currency parsing ("25rb", "5.5jt").
2. **ML Security & Input Tester**: L1 static rule-based input sanitization, XSS escaping, and prompt injection detection.
3. **Spam & Phishing Detector**: Pattern-matching keyword frequency NLP classifier for detecting phishing urgency.

---

## ✨ UX & Modern Web Upgrades (v2.1.0)

- **🌗 Dark / Light Theme Toggle**: Variable-driven theme switcher (desktop + mobile) that persists in `localStorage`, respects `prefers-color-scheme` on first visit, is FOUC-proof, and syncs the mobile `theme-color` bar.
- **🌐 i18n EN/ID**: Full UI-shell translation — navigation, hero, section headings, contact form, and dynamic status messages — via an extensible `I18N` dictionary + `data-i18n` attributes.
- **📱 Installable PWA**: `manifest.json` + generated icons make the portfolio installable; `sw.js` service worker delivers offline caching (cache-first for same-origin, network-first for CDNs/navigation with offline fallback).
- **🛡️ Anti-Spam Form**: Client-side 30-second submit rate limit layered on top of the Formspree honeypot.
- **🔎 SEO**: `sitemap.xml` and `robots.txt` published for search-engine discovery, with `rel="canonical"`, OpenGraph, Twitter Cards, and JSON-LD all consolidated on the GitHub Pages canonical domain (`https://sisigitadi.github.io/portofolio`).
- **⚡ IndexNow (real-time crawl notification)**: after every push to `main`, GitHub Actions runs `indexnow-ping.py`, which waits until GitHub Pages has actually redeployed (sha256 of the live page vs local `index.html`), then POSTs an IndexNow ping to `https://api.indexnow.org/indexnow` so Bing & other participating engines crawl immediately. The ownership key lives in a `{KEY}.txt` file at the repo root (auto-discovered by the script; content must equal the filename, per the IndexNow spec). Manual: `python indexnow-ping.py` (or `--dry-run` to preview the payload; `--key-file` to point at a specific key file).
- **🛰️ Visitor Tracker (active)**: hit-counter badge in the footer plus a private owner-only dashboard (IP hash, city/country/timezone, referrer, page, user-agent) powered by `worker-visitor/` (Cloudflare Worker + D1). The dashboard ships charts (30-day trend, hourly), top countries/cities, device/browser/OS breakdown, CSV export, path filter, pagination and 60s auto-refresh — all client-side, no CDN. No cookies; raw IPs never stored. Owner access: click the footer copyright text **9×** to open the dashboard (key never embedded in the site; the login page can remember it in the owner's browser for auto-unlock).

---

## 🎨 Design Directions — Preview Konsep & Workshop 3D (v2.6.0)

> **Design exploration archive — separate from the live site.** **Status v2.6.1: the Field Manual is implemented as the production `index.html`** (a single file with no build step, passing the gate: audit 13 PASS · pytest 62/62 · Lighthouse a11y/BP/SEO 100). The `design-previews/` and `design-lab/` galleries below remain a design reference archive outside the audit gate — future design changes flow into `index.html` through the same gate.

- **`design-previews/` — 5 static HTML design directions** (open `design-previews/index.html` as the gallery): `01-soc-console` (dark, amber phosphor, log lines), `02-field-manual` (**chosen concept** — cream paper/ink/rust accent, printed manual document), `03-trade-journal` (editorial print), `04-signal-monitor` (instrument panel), `05-plaintext-brutalist` (man page, zero gradients). All built from real portfolio content, no runtime styling CDN, no AI-template look.
- **Field Manual (`02-field-manual.html`) — chosen concept, implemented into production v2.6.1**: 100% CV-accurate content (spec table, 4 projects + production URLs, field log 2002–2026, 9 certifications, field reports), item-numbered sections (corner badges `1.01`–`5.09`), TOC as the only navigation, paper sheet on a desk, a11y skip-link, and **Request Slip — Resume (PDF)** — a single-field (email) form **connected to the production Formspree endpoint** (`https://formspree.io/f/mkgknrqk`, honeypot + 30s throttle, hidden `source: field-manual`).
- **Ink scribbles "a manual a recruiter actually reads"**: 16 ink marks (checks/paraphs/underlines) draw on scroll via `stroke-dashoffset` + IntersectionObserver, handwritten font **Caveat** (Google Fonts) + per-letter jitter — all `aria-hidden`, disabled under `prefers-reduced-motion`. **When implementing into production**: add `family=Caveat:wght@500;600` to the existing Google Fonts stylesheet (no new link).
- **`design-lab/` — 3D concept workshop (React + Vite + @react-three/fiber + drei + framer-motion)**: 10 futuristic theme concepts (radar dome, neural space, mission deck, container registry, identity vault, career orbit, forensics files, syslog vault, ATC tower, promptable console) — full documentation in `design-lab/CONCEPTS.md`.

---

## 🔒 Security & Privacy Controls

- **Content Security Policy (meta tag) — hardened (v2.6.1)**: The page ships a strict CSP that **blocks all external scripts and any inline script not covered by an exact `sha256-…` hash** (`script-src 'self' 'sha256-…' 'sha256-…'` — no third-party JS, no `eval`, no `'unsafe-inline'` for scripts); allows first-party + inline styles plus Google Fonts / Font Awesome (cdnjs); fonts from Google / cdnjs / `data:`; images restricted to `'self'`, `data:` and the visitor-tracker Worker; and **network connections restricted to Formspree + the visitor-tracker Worker only** (`connect-src 'self' https://formspree.io https://portofolio-visitor-tracker.si-sigitadi.workers.dev` — no wildcard `https:` fallback, so data cannot be exfiltrated to unknown origins). Additional directives: `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'`, `form-action 'self' https://formspree.io`, `upgrade-insecure-requests`, plus a **`Permissions-Policy`** disabling camera/mic/geolocation/payment/usb/autoplay. **Maintenance (important)**: any change to an inline `<script>` invalidates its hash — recompute it and update the CSP (Project_rules §1.7), otherwise the script is silently blocked and the page breaks.
- **XSS Prevention**: User-supplied text is rendered via `textContent` or passed through an `escapeHTML()` entity-escaping helper before any `innerHTML` insertion (terminal palette, demo output values).
- **Serverless Form Processing**: Contact & CV forms submit over HTTPS POST directly to Formspree (`https://formspree.io/f/mkgknrqk`) with no backend server; the Formspree `_gotcha` honeypot is honored client-side, and a 30-second submit throttle (`localStorage`) acts as an additional deterrent — a convenience layer, not a security guarantee.
- **External Link Protection**: Every external `<a>` uses `target="_blank"` with `rel="noopener noreferrer"` to prevent tabnabbing; a `strict-origin-when-cross-origin` referrer policy is set.
- **Supply-Chain Hardened CI (v2.6.1)**: all GitHub Actions across the three workflows (`actions/checkout`, `actions/setup-python`, `actions/setup-node`, `browser-actions/setup-chrome`) are **pinned to full commit SHAs** with version comments (e.g. `# v5.1.0`) — tags cannot move silently, so no action code changes without an explicit, reviewed upgrade.
- **PWA Cache Boundary**: The service worker caches only same-origin assets plus network-first CDN responses (Font Awesome, fonts) — it never stores or transmits form data or user input.

---

## ♿ Accessibility (a11y) & WCAG Compliance

- **Screen Reader Isolation**: All cosmetic ornaments (terminal brackets, prompt prefixes like `[SIMULATION]`, decorative status indicators) are isolated using `aria-hidden="true"`.
- **Live Regions**: Interactive widgets use `aria-live="polite"` to ensure assistive technologies announce dynamic updates cleanly.

---

## ⚡ IndexNow — How It Works

- **What**: [IndexNow](https://www.indexnow.org/) is an open protocol that tells search engines a URL changed, so they re-crawl immediately instead of waiting for their next scheduled crawl.
- **Key file**: `{KEY}.txt` at the repo root, content = the key itself (8–128 chars, alphanumeric + hyphens). Get a key from Bing Webmaster Tools → **Configuration → IndexNow**, or generate your own and register it there. The file **must be committed and deployed** — it is a public ownership-proof file, exactly like the Google verification file; it is *not* a secret.
- **Automatic ping**: `.github/workflows/indexnow.yml` runs `python indexnow-ping.py --wait-sha index.html` on every push to `main` (and manually via *Actions* tab). The `--wait-sha` flag polls `https://sisigitadi.github.io/portofolio/index.html` until its sha256 matches the local `index.html` — so the ping never fires before Pages finishes rebuilding. Status 200/202 = success; failures are informative only and never block the push.
- **keyLocation**: because the site is a GitHub Pages *project* site at a subpath, the ping payload includes `keyLocation: https://sisigitadi.github.io/portofolio/{KEY}.txt` (required by the spec for non-root key files).
- **Manual use**: `python indexnow-ping.py --dry-run` previews the payload; `python indexnow-ping.py` sends it. Exit 0 = OK, 1 = failure.

---

## 📄 License & Contact

- **Author**: Sigit Adi Irianto
- **LinkedIn**: [linkedin.com/in/sigitadi](https://www.linkedin.com/in/sigitadi/)
- **Medium**: [medium.com/@si.sigitadi](https://medium.com/@si.sigitadi)
- **Email**: [si.sigitadi@gmail.com](mailto:si.sigitadi@gmail.com)