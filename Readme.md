# 🛡️ Sigit Adi Irianto — Enterprise IT & SecOps Portfolio

[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-blue.svg)](https://sisigitadi.github.io/portofolio/)
[![Security: BYOK API](https://img.shields.io/badge/Security-Bring--Your--Own--Key%20(BYOK)-emerald.svg)](#security--privacy-architecture)
[![Privacy: UU PDP Compliant](https://img.shields.io/badge/Privacy-UU%20PDP%20Compliant-purple.svg)](#security--privacy-architecture)
[![Accessibility: WCAG Standard](https://img.shields.io/badge/Accessibility-WCAG%20Compliant-green.svg)](#accessibility--a11y)

> **Official Web Portfolio of Sigit Adi Irianto**  
> *IT & SecOps Specialist | Applied AI Practitioner*

This repository contains the single-page application (SPA) portfolio showcasing 20+ years of operational experience across IT infrastructure management, Security Operations Center (SOC) threat triage, DevSecOps automation pipelines, and practical applied AI engineering.

> **Current Role**: Web Administrator — *Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH* (Mar 2026 – Present), managing Docker-based infrastructure on Ubuntu/WSL for government web platforms with Wazuh SIEM monitoring and DVWA security sandboxing.

---

## 🏛️ Key Architectural Pillars

### 1. 100% Client-Side Architecture
- **Zero Server Overhead**: Built as a standalone, zero-dependency SPA running entirely in the visitor's browser.
- **Client-Side Algorithms & Heuristics**: Features local rule-based keyword & Regex text classification, word-frequency extractive summarization, rule-based security input sanitization, and mathematical password entropy calculators without external API reliance.
- **Lean, Zero-Dead-Code Codebase**: Legacy AI simulation widgets, the unused D3.js fallback, and the dormant SFX synthesizer have been fully removed — every `getElementById` reference resolves to a real element (audited 75/75) and the document parses with zero HTML tag-balance errors, keeping the SPA light and maintainable.

### 2. Applied AI & SecOps Engineering
- **Pragmatic AI Focus**: Bridges enterprise infrastructure with applied AI integration. Emphasizes prompt pipeline stability, RLHF evaluation, and local model deployment (Ollama/Naive Bayes) rather than unanchored foundation model claims.
- **SOC & Threat Triage**: Showcases hands-on experience managing Wazuh SIEM threat hunting, FortiWeb WAF telemetries, and automated incident triage workflows.

### 3. Bring-Your-Own-Key (BYOK) Security Protocol
- **Zero Token Leakage**: Applications like *PromptMatrix 1.0* and *PromptMatrix 2.0* operate under a strict **Bring-Your-Own-Key (BYOK)** pattern. API keys (OpenAI / Gemini) are stored transiently in local browser memory and are never transmitted to or logged on third-party servers.

### 4. UU PDP Compliance (Privacy-First Data Protection)
- **Local Data Processing**: Strictly complies with Indonesian Personal Data Protection laws (UU PDP No. 27/2022). All sandbox calculations (expense categorization, password strength, prompt sanitization) run offline locally to ensure zero data exfiltration.

---

## ⚡ Interactive Modules & Demos

1. **Live Expense Classifier**: Client-side rule-based keyword + Regex text classification combined with informal Indonesian currency parsing ("25rb", "5.5jt").
2. **ML Security & Input Tester**: L1 static rule-based input sanitization, XSS escaping, and prompt injection detection.
3. **Spam & Phishing Detector**: Pattern-matching keyword frequency NLP classifier for detecting phishing urgency.
4. **Extractive Text Summarizer**: Word-frequency extractive summarization algorithm computing instant key takeaways.
5. **Heuristic Skill Matcher**: Array-matching heuristic calculator computing technical qualification match scores.
6. **Password Health & Entropy Analyzer**: Mathematical entropy calculator estimating offline brute-force crack time.

---

## ✨ UX & Modern Web Upgrades (v2.1.0)

- **🌗 Dark / Light Theme Toggle**: Variable-driven theme switcher (desktop + mobile) that persists in `localStorage`, respects `prefers-color-scheme` on first visit, is FOUC-proof, and syncs the mobile `theme-color` bar.
- **🌐 i18n EN/ID**: Full UI-shell translation — navigation, hero, section headings, contact form, and dynamic status messages — via an extensible `I18N` dictionary + `data-i18n` attributes.
- **📱 Installable PWA**: `manifest.json` + generated icons make the portfolio installable; `sw.js` service worker delivers offline caching (cache-first for same-origin, network-first for CDNs/navigation with offline fallback).
- **🛡️ Anti-Spam Form**: Client-side 30-second submit rate limit layered on top of the Formspree honeypot.
- **🔎 SEO**: `sitemap.xml` and `robots.txt` published for search-engine discovery, with `rel="canonical"`, OpenGraph, Twitter Cards, and JSON-LD all consolidated on the GitHub-hosted canonical domain (`https://github.com/sisigitadi/portofolio`).

---

## 🔒 Security & Privacy Controls

- **CSP Hardening**: Enforces strict Content Security Policy meta tags restricting script origins and object loading.
- **XSS Prevention**: Implements HTML entity escaping for user-supplied inputs before rendering.
- **Serverless Form Processing**: Contact and CV request forms communicate securely via HTTPS POST directly to Formspree serverless endpoints (`https://formspree.io/f/mkgknrqk`).

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