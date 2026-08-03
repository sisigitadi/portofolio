# Changelog

All notable changes to the **Sigit Adi Irianto Portfolio** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.0] - 2026-08-03

### 🚀 Added
- **Retro Terminal Command Palette (`Ctrl + K`)**: Built-in CRT phosphor overlay console supporting interactive CLI commands (`help`, `projects`, `demos`, `career`, `certs`, `cv`, `contact`, `clear`).
- **AI Profiler Quick-Action Chips**: Added interactive quick prompt chips (`💬 Why Sigit?`, `⚙️ Tech Stack`, `🛡️ SecOps Exp`) under the AI Assistant chat simulator.
- **Illuminated LED Project Filter Switches**: Integrated hardware rack switches (`ALL_PROJECTS`, `AI_ML_CORE`, `SECOPS_TRIAGE`, `WEB_APPS`) with active neon glow indicators.
- **Cyberpunk Holographic Credentials Sheen (`.holo-card`)**: Applied metallic gradient shimmer on hover over Education & Certifications.
- **Live SecOps Telemetry Status Bar**: Added real-time telemetry status badges in Hero (`CORE: ONLINE`, `LATENCY: 0ms`, `PRIVACY: UU PDP`, `STACK: GEMINI // WAZUH`).
- **5-Pillar Web Audit Optimization**:
  - *SEO*: Schema.org `Person` JSON-LD rich snippets, `robots` meta tag, canonical URL, and regional geo tags (`ID-BT` / `Tangerang`).
  - *Social Media*: Crisp 1200x630px OpenGraph and Twitter Card (`summary_large_image`) previews.
  - *Security*: Meta Content Security Policy (CSP), `strict-origin-when-cross-origin` referrer policy, and Anti-XSS `escapeHTML()` sanitization.
  - *Compatibility*: Enhanced mobile/tablet/desktop viewport responsiveness and overflow protection (`overflow-x: hidden !important`).
  - *Speed*: Google Fonts preconnect, DNS-prefetch, `display=swap`, and native image `loading="lazy"`.

### 🎨 Changed
- **Hero Section Headline Layout**: Refactored title (`Sigit Adi Irianto`), role subtitle (`AI Engineer`), static `"SPECIALIZING IN:"` heading, and dynamic typing skills on the same line with zero layout shift.
- **Hero Paragraph**: Streamlined into 1 concise sentence explaining 10+ years of IT management, government project operations, cybersecurity, and AI engineering focus.
- **About Me Section**: Re-arranged into a balanced 2-column side-by-side grid (`grid-cols-1 lg:grid-cols-2 gap-8 items-stretch`).
- **Projects Section**: Simplified heading to **`Projects`** and updated section subtitles to 1 concise sentence line.
- **Project Filtering**: Upgraded filter script parser (`cat.split(' ').indexOf(filter) !== -1`) to cleanly handle space-separated category tags.

### 🛠️ Fixed
- **Global Event Handler Exports**: Exported all handler functions (`filterProjects`, `toggleContactWidget`, `openTerminalPalette`, `forceCloseTerminal`, `handleTerminalCmd`, `triggerAiChip`) to global `window` scope, eliminating `ReferenceError` crashes.
- **Connect & Request CV Widget**: Fixed FAB trigger open/close toggle and added close `X` button inside form header.
- **CSS Default Visibility**: Set `.fade-in-up` base CSS rule to `opacity: 1` to guarantee immediate content visibility across offline/webview environments.