# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.5] - 2026-08-07 — Exact Summary Statement Update

### ⚡ Optimization
- **Exact Hero Summary Replacement**: Standardized the Hero summary paragraph and Profiler Bot `summary` response to exact user text: *"IT professional with 20+ years of enterprise experience in infrastructure and systems administration, with the last 2 years focused on Security Operations and applied AI."*

---

## [1.5.4] - 2026-08-06 — Track Record Year Correction (20+ Years)

### 🚀 Added
- **Exact Career Track Record**: Updated total experience indicator from `10+ years` to **`20+ years`** across Hero summary, *What I Offer* capability cards, *Portfolio Profiler Bot* greeting/responses, and terminal simulation scripts, accurately capturing career start in Feb 2002.

---

## [1.5.3] - 2026-08-06 — Hero Summary Text Refinement

### ⚡ Optimization
- **Phrasing Cleanup**: Removed redundant `"& SecOps"` wording from the opening of the Hero paragraph (`"IT professional with 20+ years of experience..."`), keeping the opening clean while maintaining the mention of SOC threat triage and operational security challenges.

---

## [1.5.2] - 2026-08-06 — Ultra-Concise Non-Redundant Elevator Pitch

### ⚡ Optimization
- **Zero-Redundancy Hero Elevator Pitch**: Replaced long metric listings in Hero summary with a tight 2-sentence elevator pitch (`"IT professional with 20+ years of experience bridging enterprise infrastructure, SOC threat triage, and applied AI tooling. Builds and ships working software to solve real-world operational security challenges."`).
- **Eliminated Section Duplication**: Removed repetitive lists of metrics (-45% MTTR, 1,000+ AI prompts, 50+ staff) from the Hero text, deferring detailed metric breakdowns to the dedicated *What I Offer* capability cards directly below.

---

## [1.5.1] - 2026-08-06 — Concise Summary Optimization

### ⚡ Optimization
- **High-Impact Hero Summary**: Condensed the summary narrative by ~40% for faster scannability while preserving 100% of core metrics and context (-45% MTTR, 1,000+ AI prompts, 50+ staff IT ops, and "Builds & ships working software" philosophy).

---

## [1.5.0] - 2026-08-06 — Professional Summary CV Synchronization

### 🚀 Added
- **Exact Professional Summary Alignment**: Synchronized the Hero section narrative paragraph and Portfolio Profiler Bot `summary` response character-for-character with the official `PROFESSIONAL SUMMARY` section from `Sigit_Adi_Irianto_CV_Revised.docx`:
  - 20+ years hands-on experience spanning enterprise IT administration, SOC threat triage, and applied AI tooling since 2024.
  - Quantified track record: -45% incident MTTR via automated SOC triage, 1,000+ AI prompt-response pairs evaluated for factuality & safety compliance, and IT ops management for 50+ staff teams.
  - Engineering philosophy: *"Builds and ships working software (not just uses it): self-directed portfolio of deployed client-side ML and SecOps automation tools."*

---

## [1.4.1] - 2026-08-06 — Profiler Bot Chip Event Fix

### 🛠️ Fixed
- **Preset Chip Button Handlers**: Upgraded `triggerAiChip(type)` in Portfolio Profiler Assistant with fuzzy string matching, string normalization (`remote`, `wfh`, `contact`, `cv`), and explicit `return false;` event cancellation to ensure 100% reliable click response across all desktop and mobile browsers.

---

## [1.4.0] - 2026-08-06 — Project Replacement (A.R.Y.A. SOC Analytics Streamlit App)

### 🚀 Added
- **Featured Project Card Replacement**: Replaced legacy `PromptMatrix 1.0` card with **`A.R.Y.A. SOC Analytics & Threat Hunting Platform`**.
- **Live Streamlit App Integration**: Direct button link to live cloud app at `https://arya-soc.streamlit.app` featuring Wazuh SIEM log telemetry processing, automated incident severity scoring, and interactive threat hunting.
- **Dedicated Case Study Modal**: Integrated new `modal-arya-soc-streamlit` popup detailing challenge, solution, and Python/Streamlit stack architecture.

---

## [1.3.0] - 2026-08-06 — CV Alignment (Hero Subtitle & Early Career Consolidation)

### 🚀 Added
- **Exact Hero Subtitle**: Standardized Hero subtitle to `Applied AI Engineer | Security Operations Specialist` matching exact CV wording.
- **Early Career Consolidation**: Consolidated foundational roles (PT. Laju Karunia Jaya & Arya Mobile) into a single streamlined card `Early Career Experience (Feb 2002 – May 2014)`.
- **Role Title Realignment**: Updated Role 5 title to `Incident Handling Operational` per official CV document.

---

## [1.2.0] - 2026-08-06 — CV Alignment & Quantified Metrics Release

### 🚀 Added
- **Quantified Metric Alignment**: Synchronized high-impact metrics across Hero summary, *What I Offer* cards, *Projects*, and *Career Journey* timeline:
  - `-45% Incident MTTR` reduction via Wazuh SIEM SOC triage automation.
  - `1,000+ AI Prompt-Response Pairs` evaluated for factuality and safety compliance.
  - `50+ Staff Engineering Team` IT infrastructure ownership.
- **Project Specificity**: Updated PUPR timeline entry with exact project titles (*RWS, Transmission Dadi Muria, Jragung, and Bener Reservoir*) and fixed-term contract completion note.
- **Nippon Koei Context**: Explicitly named *Rentang Irrigation Modernization Project* for cross-departmental budget tracking.
- **Certifications & Issuers Alignment**: Synchronized exact 9 credentials with issue dates (2024, 2025) and official issuers (Microsoft, Hacktiv8, Kodeka Labs, BSSN, Cyber Academy Indonesia, Kelas.work, Canonical, Cybrary, LinkedIn Learning).
- **Interactive Bot Metric Parsing**: Extended *Portfolio Profiler Assistant* Q&A parser to handle queries about `MTTR`, `1000 prompts`, `50 staff`, and `certifications`.

---

## [1.1.0] - 2026-08-06 — Testimonials & UX Realignment Release

### 🚀 Added
- **Remote Work Readiness Feature Card**: Integrated a dedicated glassmorphic card in the *What I Offer* section highlighting asynchronous operations, multi-timezone team agility, self-driven execution, and disciplined documentation.
- **Interactive Portfolio Profiler Assistant**: Upgraded candidate profiler chat engine with auto-greeting, online status indicator, 5 preset quick chips (`Summary`, `Stack & AI`, `SecOps`, `Remote Work`, `Contact & CV`), and custom text query parsing.
- **Complete Header Navigation**: Added `Testimony` (`#testimonials`) and `Certifications` (`#certificates`) links to desktop and mobile navigation menus for 100% full section coverage.

### 🔧 Changed
- **Testimonials Realignment & Authentic Wording**:
  - Renamed section title from *Recommendations & Feedback* to **Testimony**.
  - Replaced overclaimed tags with authentic, grounded workplace relationship labels (`Project Recommendation`, `Colleague Feedback`, `Consulting Reference`, `Team Leader Feedback`, `Director Note`, etc.).
  - Removed all artificial SVG avatars for a clean, typography-first glassmorphic card design.
  - Fixed carousel navigation event listeners, button z-index (`z-40`), and background quote pointer events for 100% reliable Prev/Next button execution.
- **Section Kicker Cleanup**: Removed section kicker badges (*Practical Solutions & Core Capabilities*, *Workplace Feedback & References*) across the portfolio for a clean H2 typography hierarchy.
- **What I Offer Layout Streamlining**: Removed top stat cards block (*20+ Years IT & SecOps Track Record*, *Applied AI & SecOps*) to transition cleanly into the 4 core capability cards.

### 🗑️ Removed
- **Unverified Testimonial Card**: Removed Slide 5 (*Senior AI Data Lead • Multiple AI Evaluation Platforms*) and updated carousel count to 10 active cards.

---

## [1.0.0] - 2026-08-04 — Production Release

### 🚀 Added
- **Serverless Form Processing**: Integrated Formspree endpoint (`https://formspree.io/f/mkgknrqk`) for secure, serverless contact form delivery and official PDF CV request dispatching.
- **BYOK Security Architecture Disclaimers**: Added explicit UI disclaimers and metadata badges to *PromptMatrix 1.0* and *PromptMatrix 2.0* cards clarifying 100% client-side Bring-Your-Own-Key execution to prevent API token leakage.
- **Synchronized Medium Articles**: Synchronized live portfolio feed links with original published technical articles (*Integrasi Wazuh SIEM Dengan Bot Telegram Untuk Alert Real-Time*, *Data Exfiltration Detection*, and *Brute Force Attack: Cara SIEM Menangkal Serangan Berulang*).
- **Accessibility Isolation (WCAG Compliance)**: Added `aria-hidden="true"` attributes to cosmetic terminal prompts (`[SYS_INIT]`, `[SYS_CMD_PROMPT]`, `[SIMULATION]`) and decorative badge icons to prevent screen reader distraction.
- **Interactive CLI Console Navigation**: Full validation of client-side CLI terminal commands (`help`, `about`, `projects`, `demos`, `career`, `certs`, `cv`, `clear`) with smooth scrolling.