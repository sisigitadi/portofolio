# 📐 Enterprise Technical Rules & Repository Mandates

This document establishes the mandatory engineering standards, security protocols, and copywriting rules governing the **Sigit Adi Irianto Portfolio SPA** codebase.

---

## 🔒 1. Security & Credentials Mandate

1. **NO API KEY EXPOSURE**: Never hardcode, commit, or log third-party API keys (OpenAI, Gemini, Azure, Anthropic) in client-side HTML, CSS, or JS files.
2. **BRING-YOUR-OWN-KEY (BYOK) PATTERN**: All AI evaluation tools requiring API calls must request keys dynamically from the user and store them strictly in transient client memory.
3. **SECURE EXTERNAL LINKS**: Every `<a>` element referencing an external domain must specify `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnabbing vulnerabilities.
4. **SERVERLESS FORM SUBMISSION**: Contact forms must submit exclusively through secure HTTPS POST endpoints (`https://formspree.io/f/...`) without backend server dependencies.

---

## 🏛️ 2. Architectural Honesty & Copywriting Standards

1. **NO MISLEADING AI BUZZWORDS**: Never use terms like "Artificial Intelligence", "Smart LLM", or "AI Magic" to describe features implemented using basic mathematics, regular expressions, or array matching algorithms.
   - *Naive Bayes NLP + Regex*: Describe explicitly as NLP text classification and Regular Expression parsing.
   - *Extractive Summarization*: Describe as word-frequency statistical extraction.
   - *Skill Matching*: Describe as heuristic array matching.
   - *Password Strength*: Describe as mathematical entropy calculation.
2. **EMPIRICAL PROFESSIONAL TITLES**: Maintain the empirical title `IT & SecOps Specialist | Applied AI Practitioner` across all metadata, headers, and bio narratives. Do not use unanchored titles like "Applied AI Engineer".
3. **NON-MILITARY LANGUAGE**: Do not use the word "veteran". Use professional alternatives such as `"experienced IT & SecOps specialist"` or `"seasoned IT infrastructure manager"`.

---

## ♿ 3. Web Accessibility (a11y) & WCAG Standards

1. **COSMETIC GIMMICK ISOLATION**: All decorative or cosmetic CLI elements (e.g., `[SYS_INIT]`, `[SYS_CMD_PROMPT]`, `[SIMULATION]` headers) MUST include `aria-hidden="true"` so screen readers ignore cosmetic syntax.
2. **DYNAMIC LIVE REGIONS**: Interactive widgets outputting dynamic content must be wrapped with `aria-live="polite"` to ensure clean assistive audio announcements.
3. **TOUCH TARGET COMPLIANCE**: Interactive buttons must maintain a minimum touch target size of 44px (`min-height: 2.75rem`), with explicit `type="button"` and `touch-action: manipulation`.

---

## 🛠️ 4. Single-Page Application (SPA) Architectural Integrity

1. **SINGLE-FILE INTEGRITY**: The primary application resides in `index.html`. Do not introduce node build tools, Webpack, or bundlers without explicit architectural authorization.
2. **PROTECTED DOM IDs**: Never alter or delete protected DOM IDs (`typing-dynamic`, `filter-buttons`, `projects-grid`, `contact-widget`, `modal-backdrop`, `ml-input`, `sec-input`, `spam-input`, `summary-input`, `skill-input`, `pass-input`) bound to core script execution.

---

## 📊 5. Content Synchronization & SEO Canonical Mandates

1. **TESTIMONIAL CAROUSEL SYNC**: Every added or removed testimonial slide MUST be reflected in the `totalTestimonials` variable (currently `10`) and numbered with `<!-- Slide N: -->` comments. Never let the rendered slide count drift from the JS counter.
2. **BILINGUAL PARITY (i18n)**: Every new career timeline entry or testimonial using `data-i18n` MUST define its keys in BOTH the `en` AND `id` dictionaries (e.g., a new position = `cr#c` / `cr#d`; a new slide = `ts#q` / `ts#r`). Single-language keys are prohibited.
3. **CAREER TIMELINE ORDER & BADGING**: The most recent / current role must occupy Position 1 at the top of the timeline, with status badges following the contract-type color mapping (Contract/Project = purple, Part-Time = emerald, Short-Term Contract = amber, Full-Time = cyan).
4. **SINGLE SEO CANONICAL SOURCE OF TRUTH**: `rel="canonical"`, `og:url`, `twitter:url`, Schema.org JSON-LD `url`, `robots.txt` (`Sitemap:`), and `sitemap.xml` (`<loc>`) MUST all reference the identical canonical domain `https://sisigitadi.github.io/portofolio` (the GitHub Pages URL where the site is actually served). Do not reintroduce `sigitadi.my.id`, the `github.com/sisigitadi/portofolio` repository page, or any divergent URL across these files.
