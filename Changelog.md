# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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