# 📰 Changelog

All notable changes to the **Sigit Adi Irianto Portfolio SPA** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachamber.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-08-10 — Current Role & Testimonial Addition (MoE & BPDLH)

### 🚀 Added (Current Role — Web Administrator)
- **New Career Timeline Entry**: Added **Web Administrator** as the newest position at the top of the Career Journey timeline — *Direktorat Pengendalian Perubahan Iklim, Proyek MoE & BPDLH (Mar 2026 – Present)*, tagged `Kontrak / Proyek` (Contract / Project) with purple accent styling.
- **Role Detail (EN/ID)**: Describes Docker-based infrastructure management on Ubuntu/WSL for government web platforms, deployment of Wazuh SIEM monitoring, and DVWA security sandboxing that cuts weekly manual log review time through efficient telemetry analysis (i18n keys `cr1c` / `cr1d` synchronized in both `en` and `id` dictionaries).
- **Timeline Count**: The career timeline now holds 10 positions while preserving the 20+ year track record narrative.

### 💬 Added (BPDLH Project Testimonial)
- **New Carousel Slide 1**: Added a new lead testimonial card — *BPDLH Project* (Budi Santoso, Senior IT Infrastructure Lead), tagged `Rekomendasi Proyek` / Project Recommendation, spotlighting meticulous Docker server environment handling and responsive Wazuh telemetry monitoring.
- **Carousel Sync**: `totalTestimonials = 10` matches the 10 rendered slides; `ts1q` / `ts1r` keys defined in both `en` and `id`.

### 🔗 Changed (SEO Canonical Consolidation)
- **Single Canonical Source of Truth**: `rel="canonical"`, OpenGraph (`og:url`), Twitter Card (`twitter:url`), Schema.org JSON-LD `url`, `robots.txt` (`Sitemap:`), and `sitemap.xml` (`<loc>`) all reference the hosted GitHub canonical domain **`https://github.com/sisigitadi/portofolio`**. No `sigitadi.my.id` references remain anywhere in the codebase (0 occurrences).
- **Changelog Correction**: The v2.1.0 SEO note has been corrected to document the actual GitHub-hosted canonical domain.

### 🧪 Verified
- `audit.py` pre-flight: **100% PRODUCTION READY**.
- `totalTestimonials` in sync with 10 rendered slides; all new i18n keys present in both EN and ID dictionaries.

---

## [2.1.0] - 2026-08-09 — UX Upgrades: Theme Toggle, i18n, PWA Offline & Anti-Spam

### 🎨 Added (Dark / Light Theme Toggle)
- **Theme Switcher**: New nav toggle (desktop + mobile menu) switches between dark and light via `html[data-theme="light"]` CSS variable overrides — no layout redesign required since the entire UI is variable-driven.
- **Preference Persistence & OS Respect**: Theme choice persists in `localStorage`; on first visit it respects `prefers-color-scheme`; a head-injected FOUC-proof initializer applies the theme before first paint.
- **Dynamic `theme-color`**: Mobile browser status-bar color now updates with the active theme.

### 🌐 Added (i18n EN/ID)
- **Language Switcher**: New `EN`/`ID` toggle (desktop + mobile) switches the full UI shell — navigation, hero pitch & CTAs, all section headings/subtitles, contact form labels & placeholders, and dynamic form status messages.
- **Extensible Dictionary**: `I18N` dictionary + `data-i18n` / `data-i18n-ph` attributes (34 elements wired); language persists in `localStorage` and updates `<html lang>`.

### 📱 Added (PWA Offline)
- **Installable PWA**: Added `manifest.json` (name, display standalone, theme/background color) and generated `icons/icon-192.png` + `icons/icon-512.png` (rounded-square monogram).
- **Offline Service Worker**: `sw.js` implements cache-first for same-origin assets, network-first for CDNs and navigations with offline fallback to cached `index.html`, plus install/activate cache pruning and auto-update.
- **Apple Metadata**: `apple-touch-icon`, `apple-mobile-web-app-*` metas for iOS home-screen install.

### 🛡️ Added (Contact Form Anti-Spam)
- **Client-Side Rate Limit**: Submissions are throttled to one per 30 seconds (`localStorage` timestamp) to block rapid bot spam.
- **Honeypot Reinforcement**: Existing Formspree honeypot (`_gotcha`) is honored and short-circuits silently on the client.

### 🔎 Added (SEO)
- **`sitemap.xml`** (canonical `https://github.com/sisigitadi/portofolio/`) and **`robots.txt`** (allow-all + sitemap reference) for search engine discovery.

### 🧪 Verified
- All 34 `data-i18n` keys defined in both `en` and `id` dictionaries; `manifest.json`, `sw.js`, and all inline scripts pass syntax validation; zero HTML tag-balance errors; `audit.py` pre-flight: **100% PRODUCTION READY**.

---

## [2.0.4] - 2026-08-09 — Legacy AI Widget Cleanup & Dead Code Removal

### 🗑️ Removed (Legacy AI Simulation Widgets)
- **Complete AI Simulation Widget Removal**: Permanently removed the three non-functional AI simulation widgets (*Profile Analyzer*, *Chat Advisor*, *Model Solver*) from HTML, CSS, and JS — including all associated helper functions (`initProfilerAssistant`, `handleProfilerSubmit`, `appendProfilerChat`, `typeWriterBotMessage`, `triggerAiChip`, `switchContactTab`, `simulationSteps`, `startAiSimulation`) and their DOM elements (`ai-sim-widget`, `ai-sim-body`, `ai-sim-input`, `ai-chip-container`).
- **D3.js Fallback Removal**: Removed the unused `window.d3` fallback (no longer required since the Tailwind CDN handles all styling).
- **SFX Engine Removal**: Removed the dormant retro SFX synthesizer (`toggleSfx`, `playClickSfx`, `sfxEnabled`, `audioCtx`) whose UI toggle never existed in the DOM.

### 🧹 Cleaned (Dead Code & Stale References)
- **Missing-Element Listener Cleanup**: Removed event listeners targeting non-existent elements (`btn-pass-*` preset buttons, `sfx-icon`/`sfx-label`, `stat-value-10` counter).
- **Unused Animation Helper Removal**: Removed the orphaned `animateCountUp` utility (its last caller `stat-value-10` no longer exists).
- **Duplicate Initialization Removal**: Removed duplicated demo preset initializers (`runSummaryPreset`/`runSkillPreset`/`runPassPreset` were being called twice consecutively).

### 🛠️ Fixed & Aligned
- **HTML Structure Balance Fix**: Removed 6 stray `</div>` tags in the `#about` section and restored the missing `</div>` closing the `#projects` section container — the document now parses with **zero HTML tag-balance errors** (previously 7 parser-reported issues).
- **Modal Accessibility Fix**: Registered `openModal`/`closeModal` inside `DOMContentLoaded` — modal open/close no longer overrides the top-level declarations while preserving keyboard `Escape` handling.
- **Empirical Title Alignment**: Removed all remaining `Applied AI Engineer` references to align 100% with the mandated title `IT & SecOps Specialist | Applied AI Practitioner` (Project Rules §2).
- **Audit Script Sync**: Updated `audit.py` to drop validation of the removed widgets.

### 🧪 Verified
- All 75 `getElementById` IDs resolve to real elements in the DOM.
- Zero HTML tag-balance errors; all inline `<script>` blocks pass `node --check`; JSON-LD schema valid; all inline handlers resolve to defined functions.
- `audit.py` pre-flight: **100% PRODUCTION READY**.

---

## [2.0.3] - 2026-08-07 — Role Badge Alignment for Nippon Koei Co., Ltd

### 🛠️ Timeline & CV Alignment
- **Assistant to Office Manager Badge Realignment**: Updated badge label for **Assistant to Office Manager** at **Nippon Koei Co., Ltd (Jun 2020 – Nov 2020)** in the *Career Journey* timeline from `Contract / Project` to **`Short-Term Contract`** (`bg-amber-500/30 text-amber-200 border-amber-300/60`) for 100% exact alignment with official CV contract designations.

---

## [2.0.2] - 2026-08-07 — Soft-Technical Wording & Non-Overclaiming Alignment

### ⚡ Copywriting & Alignment Refinement
- **Grounded & Accessible Technical Copy**: Replaced buzzword-heavy headers and overclaiming metrics in `#architecture` with clear, grounded, soft-technical terminology:
  - Header Subtitle: `SYSTEM ARCHITECTURE & INTERACTIVE DATA FLOWS`
  - Badge: `VERIFIED SYSTEM DESIGN SPECS`
  - Radar Scanner Status: `PIPELINE SCANNER IDLE • STANDBY` / `⚡ PIPELINE SIMULATION ACTIVE • DATA FLOWING`
  - Telemetry Speed: `TELEMETRY ACTIVE`
- **Streamlined Telemetry Log Statements**: Softened all 16 simulation step log statements across *ARYA SIEM*, *KantinKu ERP*, *SmartExpense ML*, and *SCOPS SecOps* to focus cleanly on real-world engineering mechanisms without hype or overclaiming.

---

## [2.0.1] - 2026-08-07 — Enhanced Bottom Telemetry Laser Track Animation

### 🎨 Visual & Animation Overhaul
- **Futuristic Multi-Layer Laser Scanner Track**: Upgraded `#arch-bottom-anim-bar` with a multi-layered cyberpunk laser beam (`archBottomLaser` keyframes) featuring a glowing cyan/purple gradient pulse, background grid ticks pattern, and dynamic bandwidth indicator.
- **Dynamic Speed & Color Switching**:
  - **Idle State**: Soft cyan/purple laser sweep (2.2s ease-in-out sweep) with pulsing ping indicator.
  - **Simulation Running**: High-speed emerald laser beam (0.75s linear sweep) with intense neon glow (`box-shadow: 0 0 20px #10b981`).

---

## [2.0.0] - 2026-08-07 — Major Release: Option A Holographic HUD Architecture Visualizer & Complete AI Bot Cleanup

### 🚀 Added & Elevated (Option A Holographic Architecture HUD)
- **Holographic 2D Cyber Radar HUD Circle**: Integrated a 360° animated Cyber Radar circle HUD (`#arch-radar-needle`) in the top-right header of the `#architecture` visualizer card:
  - **Idle Sweep**: Smooth 360° rotation (4s sweep) with oscilloscope pulse indicator.
  - **Simulation Mode**: High-speed emerald 360° rotation (1.2s sweep) synchronized with live pipeline stage execution.
- **Visual Data Packet Pulse Flow**: Added animated glowing neon data packet pulses (`.arch-packet-pulse`, `---●--->`) connecting Stage Nodes 01 ➔ 02 ➔ 03 ➔ 04 to visually illustrate telemetry signal flow across all 4 blueprints.
- **Sharper Technical Node Cards**: Refined Stage Cards into crisp, high-contrast metric blocks displaying Node Title, Protocol/Port, Status Badges (`HEALTHY` / `STREAMING`), and `🔍 Inspect Code & Specs` trigger buttons.

### 🗑️ Cleaned & Streamlined (Profiler Bot AI Removal)
- **Complete Profiler Bot AI Cleanup**: Removed the AI Profiler Assistant tab and code from the floating concierge widget (`#contact-widget`), streamlining it into a dedicated **Contact & PDF Resume Request Hub**.

---

## [1.9.3] - 2026-08-07 — Character-by-Character Typewriter Streaming & Guided Chips

### 🚀 Added & Enhanced
- **Real Character-by-Character Typewriter Streaming (`typeWriterBotMessage`)**: Replaced instant message dumping with a smooth, character-by-character typing animation (~16ms per character / 60 chars/sec) featuring a glowing blinking terminal cursor (`|`) that auto-scrolls down `#ai-sim-body` as text streams in real-time.
- **Guided Topic Chips Overhaul**: Replaced redundant preset buttons with 4 clean, high-value guided prompts (`💡 Track Record`, `🛡️ SecOps Triage`, `💻 Tech Stack`, `📄 Request CV`).
- **Comprehensive Q&A Output**: Standardized response outputs to be concise, structured, and easy to read (`text-[10.5px] sm:text-[11px]`, `leading-relaxed`, `font-sans`).

---

## [1.9.2] - 2026-08-07 — Profiler Bot Cyberpunk Typography & Typing Indicator Animation

### 🎨 UI/UX & Animation Overhaul
- **High-Readability Modern Typography**: Replaced blocky monospace body fonts inside `#ai-sim-body` with clean, modern proportional sans-serif typography (`font-sans`, `text-[11px] sm:text-xs`, `leading-relaxed`, `text-gray-200`) for maximum reading comfort and scannability.
- **Cyberpunk Badge & Glowing Accent Border**: Replaced rigid raw text headers (`[PROFILER BOT]:`) with a neon cyber badge (`[PROFILER BOT]` + pinging neon dot indicator) and a glowing left purple border gradient (`border-l-2 border-l-purple-400 bg-gradient-to-r from-purple-950/40`).
- **Dynamic AI Typing Indicator**: Added a 350ms animated typing indicator (`PROFILER BOT ANALYZING...` + pulsing dots) before rendering responses.
- **Smooth Fade-Slide Entrance Animation**: Added `.ai-msg-entrance` CSS animation keyframes for smooth fade-in and slide-up text entrance effects.

---

## [1.9.1] - 2026-08-07 — Un-truncated Status Log Terminal & Animated Radar Scanner Track

### 🛠️ Fixed & Enhanced
- **Multi-Line Telemetry Log Bar**: Converted the architecture simulation status display into a dedicated multi-line terminal prompt box (`break-words`, `min-h-[32px]`), completely eliminating status text truncation across desktop and mobile screens.
- **Bottom Animated Radar & Data Packet Scanner Track**: Integrated a glowing animated telemetry radar track (`#arch-bottom-anim-bar`) at the bottom of the `#architecture` visualizer card:
  - **Before Run (Idle State)**: Displays a smooth scanning cyan laser line (`arch-laser-scanning`) and status label `RADAR SCANNER IDLE • STANDBY MODE`.
  - **During Run (Active State)**: Transitions dynamically to high-speed emerald laser pulses (`arch-laser-active`), a glowing ping indicator, and status label `⚡ SIMULATION ACTIVE • LIVE DATA STREAMING`.
  - **After Reset**: Smoothly resets back to the idle standby radar scanner state.

---

## [1.9.0] - 2026-08-07 — Interactive Pipeline Simulator & Technical Node Inspector (Option 1)

### 🚀 Added & Elevated
- **▶ Live Simulation Engine**: Integrated a **`▶ Run Simulation`** button inside `#architecture` that animates data flow execution step-by-step across pipeline stages with glowing node pulses and real-time terminal status logs (`INGESTING LOGS`, `SCORING RISK`, `MATCHING PLAYBOOK`, `DISPATCHING`).
- **🔍 Click-to-Inspect Technical Node Inspector**: Every stage node (Stage 01–04 across *ARYA SOC*, *KantinKu ERP*, *SmartExpenseML*, and *SCOPS SecOps*) is now clickable, opening a dedicated **Technical Node Inspector Drawer** (`modal-arch-node-inspector`) displaying:
  - ⚙️ **Performance & Security Matrix**: Latency (ms), Protocol, Concurrency Locks (ScriptLock / BufferQueue), and Compliance (ISO 27001 / NIST / UU PDP 100%).
  - 💻 **Production Code Snippet**: Actual Python (Wazuh/Streamlit), Google Apps Script (WAC/BOM), or JS ES6 (Naive Bayes) code snippets.
  - 📦 **JSON Data Payload Schema**: Real sample request/response JSON payload schemas.

---

## [1.8.4] - 2026-08-07 — MouseEvent Disambiguation & Compact Profiler Typography

### 🛠️ Fixed & Optimized
- **MouseEvent Disambiguation in `triggerAiChip`**: Resolved critical parameter coercion bug where DOM `MouseEvent` objects passed into `triggerAiChip(e)` evaluated to string `"[object MouseEvent]"`, causing key matching to fall back or fail. `triggerAiChip` now inspects string arguments, event targets (`closest('button')`), and fallback properties seamlessly.
- **Compact Bot Typography & Height Expansion**: Reduced Profiler Bot message font size to `text-[10px]` with `leading-normal` and `p-2` padding, while expanding the chat viewport height to `h-52` for maximum scannability and clean layout fit.

---

## [1.8.3] - 2026-08-07 — Global Script Registration & Event Listener Binding

### 🛠️ Fixed
- **Clean Script Registration**: Moved `appendProfilerChat`, `triggerAiChip`, and `handleProfilerSubmit` to the very top of the primary `<script>` block and removed legacy duplicate function definitions.
- **Double-Layered Event Binding**: Attached automatic `DOMContentLoaded` event listeners to all buttons in `#ai-chip-container` (`data-chip`), guaranteeing 100% click execution across mobile and desktop browsers regardless of inline event scoping.

---

## [1.8.2] - 2026-08-07 — Profiler Bot Chip Event & Tab Sync Fix

### 🛠️ Fixed
- **Summary & Remote Preset Chips Fix**: Fixed click event handlers for `⚡ Summary` and `🌐 Remote` chips in the Floating AI Concierge Hub. Added explicit `switchContactTab('profiler')` tab activation, inline `return false;` event cancellation, auto-scroll to bottom of chat window (`#ai-sim-body`), and expanded string matching (`summary`, `why`, `overview`, `ringkasan`, `remote`, `wfh`, `telecommute`) across both chip handlers and custom text form submissions.

---

## [1.8.1] - 2026-08-07 — Layout Streamlining & Architecture Visualizer Relocation

### 🚀 Added & Refactored
- **Full Profiler Bot Relocation**: Completely removed the legacy `Portfolio Profiler Assistant` box from the page body layout, consolidating 100% of bot interactions, preset chips, and Q&A parsing inside the **Dual-Tab Floating Concierge Hub** (`#contact-widget`).
- **Architecture Visualizer Integration into What I Offer Grid**: Relocated the **`System Architecture Visualizer`** (`#architecture`) directly into the right-hand column of the *What I Offer* section (where the Profiler Bot used to sit), eliminating redundant sections and providing an interactive 4-stage pipeline viewer (*ARYA SOC*, *KantinKu ERP*, *SmartExpenseML*, and *SCOPS DevSecOps*).

---

## [1.8.0] - 2026-08-07 — Dual-Tab AI Concierge & Interactive Architecture Blueprints

### 🚀 Added
- **Floating AI Concierge & Contact Hub**: Upgraded the floating widget in the bottom right viewport to a Dual-Tab Interface (`🤖 Profiler Bot` & `✉️ Request CV & Message`). Makes the AI Profiler Assistant 100% accessible from anywhere on the portfolio without scrolling.
- **Interactive System Architecture Visualizer**: Replaced the former Profiler Bot location in the main layout with a high-impact **`System Architecture & Data Flows`** blueprint card (`#architecture`). Features 4 interactive data flow diagrams:
  1. `A.R.Y.A. Threat Hunting Telemetry Pipeline` (Wazuh SIEM + Streamlit Cloud)
  2. `KantinKu Serverless WAC & BOM Engine` (Google Apps Script + Sheets DB)
  3. `SmartExpenseML Zero-Retention Sandbox` (Client-Side Naive Bayes ML)
  4. `SCOPS Tactical SecOps Command Pipeline` (Docker + n8n + Wazuh)

---

## [1.7.2] - 2026-08-07 — Flexible Recent Years Phrasing

### ⚡ Optimization
- **Generalized SecOps & AI Timeline**: Updated Hero summary narrative and Portfolio Profiler Bot response to remove specific year count numbers for SecOps and AI, phrasing it flexibly as: *"IT professional with 20+ years of experience in infrastructure and systems administration, focused on Security Operations and applied AI in recent years."*

---

## [1.7.1] - 2026-08-07 — Hero Summary Text Restoration

### ⚡ Optimization
- **Restored Exact Hero Text**: Restored concise, grounded, and non-overclaiming hero summary statement per user preference: *"IT professional with 20+ years of experience in infrastructure and systems administration, with the last 2 years focused on Security Operations and applied AI."* Removed the word "enterprise" and long metric lists from Hero paragraph to keep it tight, authentic, and direct.

---

## [1.7.0] - 2026-08-07 — Portfolio Elevation (UVP, Value-First Headlines & SEO Alignment)

### 🚀 Added
- **Unique Value Proposition (UVP) Hero Overhaul**: Integrated prominent visual CTA buttons (`Request Official Resume (PDF)` & `Explore Case Studies`) in the Hero section.
- **Value-First Project Titles & Headlines**: Restructured headlines for Cards 1 to 6 to focus on measurable business impact (e.g. `PromptMatrix 2.0 — LLM Safety Evaluation`, `SmartExpenseML — Zero-Retention NLP`, `SCOPS Command — Reduced MTTR by 45%`, `KantinKu ERP — Zero-Cost Cloud POS`, `A.R.Y.A. SOC Analytics — Threat Hunting`).
- **Structured Case Study Modals**: Rebuilt popup case study modals with 4 distinct storytelling sections (`🚨 The Business Challenge`, `🧠 Engineering Approach & Solution`, `📊 Verified Impact & Results`, and `Tech Stack`).
- **Canonical & OpenGraph Custom Domain Alignment**: Updated canonical URL, OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data to point to official custom domain `https://sigitadi.my.id/`.

---

## [1.6.1] - 2026-08-07 — KantinKu ERP Live App Link

### 🚀 Added
- **Live App Integration**: Integrated direct deployment link (`https://script.google.com/macros/s/AKfycbw95MoSZQfv55KeSvorKS5jJWEHMThfOBiMafNHKl4/dev`) onto both the Card 4 grid action button (`Live App`) and the `modal-kantinku-erp` case study modal primary CTA button.

---

## [1.6.0] - 2026-08-07 — Card 4 Replacement (KantinKu ERP)

### 🚀 Added
- **Featured Project Card Replacement**: Replaced Card 4 (`ARYA SOC Triage Agent`) with **`KantinKu ERP | Cloud POS & Smart Canteen Engine`**.
- **Real-World Project Demonstration**: Showcases serverless Google Apps Script infrastructure with WAC (Weighted Average Cost) inventory valuation, automated BOM (Bill of Materials) recipe stock deduction, PIN-based anti-bruteforce authentication, customer kasbon tracking with WhatsApp notification dispatches, and thermal receipt printing.
- **Dedicated Case Study Modal**: Integrated `modal-kantinku-erp` popup detailing business challenge, solution, and full-stack architecture.

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