# Sigit Adi Irianto — AI Engineer & SecOps Specialist Portfolio

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Status-100%25%20Single--Page%20Application-emerald.svg)
![SEO](https://img.shields.io/badge/SEO-Schema.org%20JSON--LD-purple.svg)
![Security](https://img.shields.io/badge/Security-CSP%20%2B%20Anti--XSS-red.svg)

> **Live Portfolio Demo**: [https://sisigitadi.github.io/portofolio/](https://sisigitadi.github.io/portofolio/)

---

## 📌 Executive Overview

This repository contains the official source code for **Sigit Adi Irianto's** professional portfolio website. Built as a high-performance, privacy-first **Single-Page Application (SPA)**, the website showcases 10+ years of IT management, government project operations, and cybersecurity expertise, combined with modern AI Engineering.

The entire web application is self-contained within a single, highly-optimized `index.html` file, requiring zero build steps or heavy node frameworks while delivering a state-of-the-art **Retro Cybersecurity + Futuristic AI** user interface.

---

## ⭐ Key Technical Features & Highlights

### 1. 🎯 Dynamic Hero Section & Typing Skills
* **Headline Layout**: Split title (`Sigit Adi Irianto`), prominent role subtitle (`AI Engineer`), and a static `"SPECIALIZING IN:"` heading.
* **Same-Line Typing Engine**: Dynamic skill typewriter animation (`Machine Learning`, `NLP & Text Classification`, `LLM Evaluation & RLHF`, `Wazuh SIEM Threat Intelligence`, `Prompt Engineering`, `Docker & SecOps Automation`) on the same line with zero layout shift.
* **Live SecOps Telemetry Status Bar**: Displays real-time status badges:
  `[ 🟢 CORE: ONLINE ] [ ⚡ LATENCY: 0ms ] [ 🛡️ PRIVACY: UU PDP ] [ 🤖 STACK: GEMINI // WAZUH ]`

### 2. 🧪 Interactive Client-Side ML & Security Demos (`#ml-sandbox`)
Includes 6 live interactive web applications running 100% locally in the browser:
1. **Live Machine Learning Sandbox**: Real-time Naive Bayes text classifier for expense & category prediction.
2. **ML Security Input Tester**: Adversarial prompt injection & XSS payload testing sandbox.
3. **Spam & Phishing Detector**: Rule-based & heuristic email/SMS threat classifier.
4. **Smart Text Summarizer**: Local NLP text summarization engine with length controls.
5. **AI Job Skill Matcher**: Real-time skill parser with **automatic target position detection** (*AI Engineer*, *Cybersecurity Analyst*, *Data Scientist*).
6. **Password Health Analyzer**: Entropy calculation and dictionary check engine.

### 3. 🕹️ Retro Terminal Command Palette (`Ctrl + K`)
* **Interactive CLI Overlay**: Built-in hacker/SecOps phosphor terminal console accessible via **`Ctrl + K`** or the top navigation bar **`[ 💻 CLI Console ]`** button.
* **Commands Supported**:
  * `help`: Lists available terminal commands.
  * `projects`: Smooth scrolls to Projects section.
  * `demos`: Smooth scrolls to Interactive ML Demos.
  * `career`: Smooth scrolls to Career Journey timeline.
  * `certs`: Smooth scrolls to Education & Certifications.
  * `cv`: Opens the official CV request form widget.
  * `contact`: Opens the contact form.
  * `clear`: Clears terminal history.

### 4. 🎛️ Illuminated LED Project Filtering (`#projects`)
* **Hardware Rack Filter Switches**: Illuminated LED category switches (`ALL_PROJECTS`, `AI_ML_CORE`, `SECOPS_TRIAGE`, `WEB_APPS`) with active neon glow effects.
* **Instant Filtering**: Space-separated keyword parser supporting instant card sorting without page reloads.

### 5. 🤖 AI Profiler Chat Simulator (`#about`)
* **Balanced 2-Column Grid**: Side-by-side layout featuring **About Me Narrative & Core Principles** on the left and **AI Assistant Chat Simulator** on the right.
* **Quick-Action Chips**: Clickable prompt tags (`💬 Why Sigit?`, `⚙️ Tech Stack`, `🛡️ SecOps Exp`) for immediate dialogue responses.

### 6. 🏆 Cyberpunk Holographic Credentials (`#certificates`)
* **Holographic Sheen (`.holo-card`)**: Cyberpunk metallic gradient shimmer effect on hover over certification credentials.

---

## 🛡️ 5-Pillar Web Engineering Audit Standards

The application adheres to 5 rigorous web audit standards:

1. **SEO (Search Engine Optimization)**:
   * Google Rich Snippets via Schema.org `Person` JSON-LD structured data.
   * `robots` meta tag with `max-image-preview:large`.
   * Regional Geo tags (`ID-BT` / `Tangerang`).
   * Canonical URL declaration.
2. **Sosmed (Social Media OpenGraph & Twitter Cards)**:
   * Crisp 1200x630px social cards (`og:image`, `twitter:card="summary_large_image"`).
   * Rich preview generation across LinkedIn, WhatsApp, Telegram, and Twitter/X.
3. **Security (CSP & Web Hardening)**:
   * Meta Content Security Policy (CSP) restricting resource origin.
   * Anti-XSS `escapeHTML()` sanitization across all interactive inputs.
   * `rel="noopener noreferrer"` on all external links.
4. **Compatibility (Display All Devices)**:
   * Cross-device mobile/tablet/desktop/ultrawide responsive breakpoints.
   * Mobile touch optimization and overflow protection (`overflow-x: hidden !important`).
5. **Speed & Performance Optimization**:
   * Resource `preconnect` and `dns-prefetch` for Google Fonts & FontAwesome.
   * `display=swap` parameter for zero FOUT text rendering.
   * Native lazy loading (`loading="lazy"`) and asynchronous decoding (`decoding="async"`) on all images.

---

## 📂 Project Structure

```
portofolio-main/
├── index.html        # Primary Single-Page Application (HTML, CSS, JS)
├── README.md         # Comprehensive Project Documentation
└── Changelog.md      # Detailed Version Release History
```

---

## 📄 License

&copy; 2026 Sigit Adi Irianto. All Rights Reserved. Released under the MIT License.