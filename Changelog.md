# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **What I Offer Layout Streamlining**: Removed top stat cards block (*10+ Years IT & SecOps Track Record*, *Applied AI & SecOps*) to transition cleanly into the 4 core capability cards.

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

### 🔧 Changed
- **Empirical Title Realignment**: Standardized professional title to `IT & SecOps Specialist | Applied AI Practitioner` across HTML head metadata, OpenGraph, Schema.org JSON-LD, Hero header, and bio narratives.
- **Pragmatic Architectural Descriptions**: Overhauled feature text for interactive demos to reflect true underlying algorithms:
  - Demo 1: Naive Bayes NLP + Regex currency parsing.
  - Demo 4: Word-frequency Extractive Text Summarizer.
  - Demo 5: Array-matching Heuristic Skill Matcher.
  - Demo 6: Mathematical Password Entropy Calculator.
- **Career Timeline Normalization**: Added explicit `Short-Term Contract` and `Project-Based` badges to short-tenure roles (*Senior Programmer*, *Shift Leader*) and highlighted *AI Trainer & LLM Evaluator* as a sustained technical anchor bridging contract gaps.
- **Sticky Top Header**: Converted main navigation header to a fixed sticky bar (`fixed top-0 z-50`) with backdrop blur styling for persistent screen visibility.
- **DOM Selector Bug Fix**: Fixed Project grid category filter query selector (`#projects-grid`) to ensure seamless dynamic card filtering across **ALL_PROJECTS**, **AI_ML_CORE**, **SECOPS_TRIAGE**, and **WEB_APPS**.

### 🛡️ Security & Quality Fixes
- Added `target="_blank" rel="noopener noreferrer"` security attributes to all external anchor links (LinkedIn, Medium, Live Apps).
- Applied explicit `type="button"` and `return false;` event handlers across all interactive preset buttons to prevent touch event interference on mobile devices.