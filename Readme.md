# 🛡️ Sigit Adi Irianto — Enterprise IT & SecOps Portfolio

[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Client--Side-blue.svg)](https://sisigitadi.github.io/portofolio/)
[![Security: BYOK API](https://img.shields.io/badge/Security-Bring--Your--Own--Key%20(BYOK)-emerald.svg)](#security--privacy-architecture)
[![Privacy: UU PDP Compliant](https://img.shields.io/badge/Privacy-UU%20PDP%20Compliant-purple.svg)](#security--privacy-architecture)
[![Accessibility: WCAG Standard](https://img.shields.io/badge/Accessibility-WCAG%20Compliant-green.svg)](#accessibility--a11y)

> **Official Web Portfolio of Sigit Adi Irianto**  
> *IT & SecOps Specialist | Applied AI Practitioner*

This repository contains the single-page application (SPA) portfolio showcasing 10+ years of operational experience across IT infrastructure management, Security Operations Center (SOC) threat triage, DevSecOps automation pipelines, and practical applied AI engineering.

---

## 🏛️ Key Architectural Pillars

### 1. 100% Client-Side Architecture
- **Zero Server Overhead**: Built as a standalone, zero-dependency SPA running entirely in the visitor's browser.
- **Client-Side ML & Heuristics**: Features local Naive Bayes NLP text classification, extractive summarization algorithms, rule-based security input sanitization, and mathematical password entropy calculators without external API reliance.

### 2. Applied AI & SecOps Engineering
- **Pragmatic AI Focus**: Bridges enterprise infrastructure with applied AI integration. Emphasizes prompt pipeline stability, RLHF evaluation, and local model deployment (Ollama/Naive Bayes) rather than unanchored foundation model claims.
- **SOC & Threat Triage**: Showcases hands-on experience managing Wazuh SIEM threat hunting, FortiWeb WAF telemetries, and automated incident triage workflows.

### 3. Bring-Your-Own-Key (BYOK) Security Protocol
- **Zero Token Leakage**: Applications like *PromptMatrix 1.0* and *PromptMatrix 2.0* operate under a strict **Bring-Your-Own-Key (BYOK)** pattern. API keys (OpenAI / Gemini) are stored transiently in local browser memory and are never transmitted to or logged on third-party servers.

### 4. UU PDP Compliance (Privacy-First Data Protection)
- **Local Data Processing**: Strictly complies with Indonesian Personal Data Protection laws (UU PDP No. 27/2022). All sandbox calculations (expense categorization, password strength, prompt sanitization) run offline locally to ensure zero data exfiltration.

---

## ⚡ Interactive Modules & Demos

1. **Live ML Sandbox (Naive Bayes)**: Client-side Naive Bayes text classification combined with Regular Expression (Regex) currency parsing.
2. **ML Security & Input Tester**: L1 static rule-based input sanitization, XSS escaping, and prompt injection detection.
3. **Spam & Phishing Detector**: Pattern-matching keyword frequency NLP classifier for detecting phishing urgency.
4. **Extractive Text Summarizer**: Word-frequency extractive summarization algorithm computing instant key takeaways.
5. **Heuristic Skill Matcher**: Array-matching heuristic calculator computing technical qualification match scores.
6. **Password Health & Entropy Analyzer**: Mathematical entropy calculator estimating offline brute-force crack time.

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