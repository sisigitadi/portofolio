# 🛡️ Sigit Adi Irianto — Enterprise IT & SecOps Portfolio

[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-blue.svg)](https://sisigitadi.github.io/portofolio/)
[![Security: BYOK API](https://img.shields.io/badge/Security-Bring--Your--Own--Key%20(BYOK)-emerald.svg)](#security--privacy-controls)
[![Privacy: UU PDP Compliant](https://img.shields.io/badge/Privacy-UU%20PDP%20Compliant-purple.svg)](#security--privacy-controls)
[![Accessibility: WCAG Standard](https://img.shields.io/badge/Accessibility-WCAG%20Compliant-green.svg)](#accessibility-a11y--wcag-compliance)

> **Official Web Portfolio of Sigit Adi Irianto**  
> *IT & SecOps Specialist | Applied AI Practitioner*

This repository contains the single-page application (SPA) portfolio showcasing 20+ years of operational experience across IT infrastructure management, Security Operations Center (SOC) threat triage, DevSecOps automation pipelines, and practical applied AI engineering.

> **Current Role**: Web Administrator — *Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH* (Mar 2026 – Present), managing Docker-based infrastructure on Ubuntu/WSL for government web platforms with Wazuh SIEM monitoring and DVWA security sandboxing.

---

## 🏛️ Key Architectural Pillars

### 1. 100% Client-Side Architecture
- **Zero Server Overhead**: Built as a standalone SPA with no server, no framework runtime, and no build step required at deploy time — everything executes in the visitor's browser.
- **No Runtime Styling CDN**: Tailwind CSS is compiled once (v3.4.17) into a single static inline `<style>` block inside `index.html` — the ~300KB Tailwind Play CDN runtime compiler no longer ships to production. Remaining third-party assets are limited to CDN-hosted fonts/icons (Google Fonts, Font Awesome via cdnjs) and external services (Formspree form delivery, rss2json Medium feed); project preview images are served from local `assets/`. All documented under Security & Privacy below.
- **Client-Side Algorithms & Heuristics**: Features local rule-based keyword & Regex text classification, rule-based security input sanitization, and pattern-based spam/phishing detection without external API reliance.
- **Lean, Zero-Dead-Code Codebase**: Legacy AI simulation widgets, the unused D3.js fallback, and the dormant SFX synthesizer have been fully removed — every `getElementById` reference resolves to a real element (**53/53 unique IDs, auto-verified by `audit.py` checks #9/#9b/#10 at every pre-flight**) and the document parses with zero HTML tag-balance errors, keeping the SPA light and maintainable.
- **Pre-Flight Audit & Git Gate**: `audit.py` runs **11 registered checks** emitting **12 PASS lines** (form endpoint, external-link safety, relative paths, WCAG gimmick isolation, HTML tag balance, inline-script syntax via `node --check`, testimonial sync, i18n parity — this one emits two lines, `getElementById`/`querySelector`/`closest`/`matches` DOM resolution, duplicate-id detection) — each check is a registered method (`@check`), so adding #12+ is one method, no plumbing. Modes: `python audit.py` (full), `python audit.py --quick` (skips `node --check` for fast pre-commit feedback), and `python audit.py path/to/file.html` (audit any target; default `index.html`). Every run ends with a **summary line**: `Ringkasan: 12 PASS | 0 FAIL | 0 WARN | 11 pemeriksaan | 3.4s`.
- **Unit tests (`test_audit.py`, pytest)**: 20 tests lock in the audit's own behavior — valid `index.html` passes, all 6 targeted breakages (dead `getElementById`, ghost `querySelector`, unbalanced tag, i18n mismatch, testimonial mismatch, wrong Formspree endpoint) are each caught with exactly one FAIL, `run()` is idempotent, `--quick` warns (never fails) when `node` is skipped, CLI arg parsing is parametrized, and `node --check` failing to launch (e.g. OSError under a Windows test runner) degrades to a resilience WARN instead of crashing. Run with `python -m pytest test_audit.py -v`.
- **Three gates, defense in depth**: (1) `.githooks/pre-commit` runs the audit in `--quick` mode for early detection; (2) `.githooks/pre-push` runs the full audit and **blocks the push** on any failure; (3) `.github/workflows/preflight.yml` runs the full audit on every push/PR to `main` as a CI gate. Activate hooks once with `git config core.hooksPath .githooks` (then `chmod +x .githooks/pre-push .githooks/pre-commit` on Unix); `.gitattributes` keeps all hook scripts LF.

### 2. Applied AI & SecOps Engineering
- **Pragmatic AI Focus**: Bridges enterprise infrastructure with applied AI integration. Emphasizes prompt pipeline stability, prompt engineering, and local model deployment (Ollama/Naive Bayes) rather than unanchored foundation model claims.
- **SOC & Threat Triage**: Showcases hands-on experience managing Wazuh SIEM threat hunting, FortiWeb WAF telemetries, and automated incident triage workflows.

### 3. Bring-Your-Own-Key (BYOK) — Linked AI Apps
- **Scope Clarification**: This portfolio repository itself contains **no API-key handling code** — no OpenAI / Gemini / Anthropic keys are ever requested, stored, transmitted, or logged by this site.
- **BYOK Pattern (Linked Apps)**: The external AI prompt-engineering apps linked from the *Projects* section (PromptMatrix 1.0 / 2.0) operate under a strict **Bring-Your-Own-Key (BYOK)** pattern: API keys (OpenAI / Gemini) are entered by the user, held transiently in local browser memory, and are never transmitted to or logged on third-party servers. Because keys live only in the visitor's browser session, token leakage is eliminated by construction.

### 4. UU PDP / Privacy-First Data Protection
- **Local Demo Processing**: All three interactive demo widgets (expense classification, input sanitization, spam detection) run **100% locally in the browser** — no input ever leaves the device, so sandbox calculations involve no personal-data transfer.
- **Disclosed Form Transmission (Exception)**: The contact / CV request form intentionally transmits the visitor's name, email & message to **Formspree** (a third-party processor) solely for message delivery — disclosed directly in the form UI. Formspree's own handling of the submitted data is governed by its privacy policy.
- **No Tracking, No Cookies**: The site ships no analytics, no advertising, and no tracking scripts, and sets no cookies. Browser `localStorage` is used only for device-local preferences (theme, language, submit-rate timestamp) and never contains personal data.
- **Third-Party Data Flows (complete list)**: The only outbound network calls are (a) the contact form → Formspree (`https://formspree.io/f/mkgknrqk`) and (b) the Medium articles feed → `api.rss2json.com` (public feed content, no visitor data). Project preview images are served from local `assets/` (no third-party image CDN).

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

---

## 🔒 Security & Privacy Controls

- **Content Security Policy (meta tag)**: The page ships a CSP that **blocks all external scripts** (`script-src 'self' 'unsafe-inline'` — no third-party JS, no `eval`); allows first-party + inline styles plus Google Fonts / Font Awesome (cdnjs); fonts from Google / cdnjs / `data:`; images from `self`, `data:` or any `https:` source; and restricts network connections to Formspree & rss2json (with a broad `https:` fallback). Inline scripts are permitted, so this is defense-in-depth rather than a fully strict CSP.
- **XSS Prevention**: User-supplied text is rendered via `textContent` or passed through an `escapeHTML()` entity-escaping helper before any `innerHTML` insertion (terminal palette, Medium feed titles).
- **Serverless Form Processing**: Contact & CV forms submit over HTTPS POST directly to Formspree (`https://formspree.io/f/mkgknrqk`) with no backend server; the Formspree `_gotcha` honeypot is honored client-side, and a 30-second submit throttle (`localStorage`) acts as an additional deterrent — a convenience layer, not a security guarantee.
- **External Link Protection**: Every external `<a>` uses `target="_blank"` with `rel="noopener noreferrer"` to prevent tabnabbing; a `strict-origin-when-cross-origin` referrer policy is set.
- **PWA Cache Boundary**: The service worker caches only same-origin assets plus network-first CDN responses (Font Awesome, fonts, Medium feed) — it never stores or transmits form data or user input.

---

## ♿ Accessibility (a11y) & WCAG Compliance

- **Screen Reader Isolation**: All cosmetic ornaments (terminal brackets, prompt prefixes like `[SIMULATION]`, decorative status indicators) are isolated using `aria-hidden="true"`.
- **Live Regions**: Interactive widgets use `aria-live="polite"` to ensure assistive technologies announce dynamic updates cleanly.

---

## 📄 License & Contact

- **Author**: Sigit Adi Irianto
- **LinkedIn**: [linkedin.com/in/sigitadi](https://www.linkedin.com/in/sigitadi/)
- **Medium**: [medium.com/@si.sigitadi](https://medium.com/@si.sigitadi)
- **Email**: [si.sigitadi@gmail.com](mailto:si.sigitadi@gmail.com)