# 10 Futuristic Theme Concepts — Sigit Adi Irianto Portfolio

> Stack: **React + Vite** · **@react-three/fiber + drei** (3D) · **framer-motion** (UI motion)
> All concepts are built from real portfolio content: Wazuh SIEM, Docker/Ubuntu, Ollama & prompt engineering, UU PDP / BYOK, simulated MTTR −45%, 20+ year career 2002→2026, 4 parallel infrastructure projects (PUPR), SOC & IR playbooks, BSSN/DevSecOps/pen-test certifications.

---

## Review Summary (Code & Content)

### Code — what's already strong
- **Layered quality gates**: `audit.py` (12 checks), 52 pytest unit tests, pre-commit/pre-push hooks, CI Lighthouse (a11y/BP/SEO must be 100, perf ≥ 50 warn) — rare and highly professional.
- **100% client-side architecture**: statically compiled Tailwind, CSP, PWA + service worker, EN/ID i18n, FOUC-proof dark/light theme, credible BYOK & UU PDP privacy story.
- **SEO**: JSON-LD Person + WebSite, OG/Twitter, sitemap, IndexNow, consistent canonical.

### Code — what could move toward "futuristic"
- A single `index.html` of 3,581 lines (HTML+CSS+JS). Migrating to React/r3f automatically breaks this into modules.
- Visuals still feel "AI-template adjacent": cyan/emerald glassmorphism, 2D particle canvas, scanline overlay, gradient text. The `design-previews/` previews clearly try to move away from that — these 10 concepts continue that direction with real 3D (WebGL), not CSS effects.
- **Performance note (Lighthouse perf ≥ 50 gate)**: r3f must be lazy-loaded only on the hero (or `frameloop="demand"`), `dpr={[1, 1.5]}`, disable WebGL when `prefers-reduced-motion`, and provide a full static fallback (Canvas rendered only if WebGL is available).

### Content — what's already strong
- The "20+ years ops + SOC + applied AI" narrative is consistent across hero, about, experience, testimonials, certifications.
- **Concrete metrics** (simulated MTTR −45%, 50+ staff teams) and **Challenge → Approach → Result case studies** in modals — gold for the "operational console" theme.
- Real projects with production links; relevant Medium articles (Wazuh+Telegram, data exfil, brute force).

### Content — gaps these concepts can fill
- No visualization of the **24-year timeline** as a "story" yet (current timeline is linear & long).
- No "skill map" — skills are scattered in badges; a 3D theme could turn them into an interactive map.
- The "4 parallel projects" story (PUPR) & remote multi-timezone work aren't exploited visually yet.

---

## Shared Motion Principles (all concepts)

1. **One "signature motion" per theme** — don't mix: if it's radar, all sections rotate/scan; if it's a console, everything enters as a log line.
2. **Motion = data, not decoration**: numbers count up (MTTR 45%) with `useSpring`/`animate`; pulsing LED status = uptime facts; lines = real logs.
3. **Section transitions** use `useScroll` + `useTransform` (scroll-scrubbed), not random animations. Sections exit as "scanned", "archived", "takeoff", etc. — consistent with the theme's metaphor.
4. **Accessibility & performance stay enforced** (non-negotiable in this repo): `prefers-reduced-motion` disables WebGL + motion, `AnimatePresence` for important content never uses `display:none` on focused elements, Canvas `frameloop="demand"` unless there's continuous animation.

---

## CONCEPT 01 — PERIMETER (Threat Radar Dome)
**Character**: SOC analyst guarding the perimeter. The portfolio is a 3D radar screen.

- **3D centerpiece (r3f/drei)**: radar dome — wireframe `Sphere` + `Line` (drei) for scan rings, `Float` for floating "blips". Each blip = a project/domain (Wazuh, Ollama, Docker, PromptMatrix…). Hover a blip → `Html` (drei) tooltip showing the project card.
- **Framer-motion**: radar sweep (rotating sweep) driven by `useMotionValue`; sections enter via "scan reveal" (clip-path ring sweeping across text). Statistics appear like telemetry readouts.
- **Transition**: sections swept by a left→right scan line; footer "signal lost" → hero "signal acquired".
- **Palette/Type**: black #0A0E13, phosphor amber #FFB454, green #3FB950; mono (JetBrains Mono).
- **Why it fits**: this is his day job — the site feels like the tools he uses, not decoration.

## CONCEPT 02 — LATENT (Neural Weight-Space Flight)
**Character**: AI engineer flying the camera through an LLM's embedding space.

- **3D centerpiece**: `Points` + custom `BufferGeometry` (hundreds of "token" points) colored per cluster (prompt/security/privacy); `CameraRig` (drei pattern) = camera gliding along a curve through the point space on scroll (`useScroll` → camera position). Projects = "checkpoints" — hovering moves the camera closer to the cluster.
- **Framer-motion**: hero text appears as tokens "attached" one by one; section titles = dimension labels (axes).
- **Transition**: fade between clusters + smooth `scale`; "traversal" between sections.
- **Palette/Type**: deep violet-black + cold cyan + gold highlights; geometric sans (Space Grotesk).
- **Why it fits**: PromptMatrix, LLM eval, Ollama — the latent-space metaphor fits the applied-AI profile best.

## CONCEPT 03 — COMMAND (Mission Control Deck)
**Character**: 20+ years of operations = mission commander; the site is a holographic command deck.

- **3D centerpiece**: 3D desk/deck — `RoundedBox` (drei) holo panels rotating slowly (`Float` + slow `OrbitControls`, autoRotate), a `Sphere` globe labeled with locations (Tangerang, BPDLH project, remote global).
- **Framer-motion**: boot sequence on load (log "POWER ON → SENSOR CHECK → ALL SYSTEMS NOMINAL"), then statistic panels appear staggered like telemetry; mission progress bars per section.
- **Transition**: sections = mission "phases"; big counters (simulated MTTR −45%, 20+ yrs, 50+ staff) count up with `animate`.
- **Palette/Type**: graphite + cyan + amber; large screens, experimental display typography for titles (Chakra Petch).
- **Why it fits**: captures the career scale (IT Manager, Project Office Manager) without sounding boastful.

## CONCEPT 04 — HARBOR (Container Registry Digital Twin)
**Character**: Docker/DevSecOps admin — the portfolio is a living container registry.

- **3D centerpiece**: 3D server rack — each project is a "container image" (`RoundedBox` + `Html` layer labels); LED status (running/healthy) pulses; `useFrame` pulse animation; hovering a container expands its image layers (build steps). Stack = `Registry`/`Repository` inside the scene.
- **Framer-motion**: containers get "pulled" into the scene on scroll; tech tags = image tags (`:latest`, `:2.0.0`); animated pipeline progress bar in the footer.
- **Transition**: sections swap like a `docker ps` table; "docker inspect" for project details.
- **Palette/Type**: deep navy + aqua + terminal white; mono.
- **Why it fits**: he actually manages Docker in production (BPDLH, WSL/Ubuntu) — a digital twin of the infrastructure he runs.

## CONCEPT 05 — VERIFY (Holographic Identity Vault)
**Character**: Credentials + privacy (UU PDP, BYOK) — the portfolio is a verifiable holographic identity vault.

- **3D centerpiece**: rotating holographic "ID card" at center (`RoundedBox` + transparent material, `Float`); a scan line sweeps the card periodically (shader or thin plane), each field (NAME, ROLE, LOCATION, STATUS: AVAILABLE) lights up in sequence.
- **Framer-motion**: card fields "decrypt" character by character; certifications = "seals" appearing with a stamp effect (fast scale + opacity); verification badges on every section.
- **Transition**: the contact section = "handshake" (card flips to the QR/contact side).
- **Palette/Type**: ice white + black + a single gold/cyan accent; clean, institutional.
- **Why it fits**: his BYOK & UU PDP story is strong — this theme turns "privacy & verification" into the visual identity, not a small footnote.

## CONCEPT 06 — ORBIT (24-Year Career Trajectory)
**Character**: A long career = satellite orbits; remote global = crossing timezones.

- **3D centerpiece**: planet + orbit rings (`Sphere` + `Torus` rings); each career milestone = a satellite on an orbit with its year; scroll moves the camera around the planet (`useScroll` → camera angle) — 2002 to 2026.
- **Framer-motion**: satellite labels appear as they approach; timeline = "insertion burn" (satellite entering orbit) — very cinematic.
- **Transition**: between career periods = camera moves to another orbit; time is the motion theme.
- **Palette/Type**: deep space (deep navy + dim violet) + paper cream for text (grounded, human).
- **Why it fits**: solves the "10-position timeline is too long" problem as one memorable visual motion.

## CONCEPT 07 — EVIDENCE (Forensics Case Files)
**Character**: Incident responder & pen-tester — the portfolio is a digital evidence locker.

- **3D centerpiece**: "evidence locker" — case file cards floating in a 3D grid (`RoundedBox` + `Html`), some redacted (black bars whose width animates via framer-motion — the classic classified-document motif). Each project = a case file with a number (CASE-2026-001).
- **Framer-motion**: redaction bars open on hover; chain of custody for the career timeline; "stamp" CLASSIFIED/VERIFIED on documents.
- **Transition**: sections = "opening a file" (fold-open or slide from the stack).
- **Palette/Type**: cream paper + black ink + stamp red; serif/typewriter for contrast with the futuristic theme.
- **Why it fits**: NIST IR playbooks, pen-test certs, incident handling — a credible, out-of-the-box forensics metaphor.

## CONCEPT 08 — ARCHIVE (Syslog Time Capsule 2002→2026)
**Character**: 24 years of sysadmin — the portfolio is a log archive vault.

- **3D centerpiece**: vertical vault lobby — "year" shelves (each decade = one shelf level, `RoundedBox`); vertical scroll = camera descending/ascending through the vault (`useScroll` → camera Y). Real log lines (wazuh, docker ps, uptime) flow in the HUD.
- **Framer-motion**: log lines get "typed" as a decade enters the viewport; years as large markers.
- **Transition**: between eras = switching vault floors; footer = "ARCHIVE CLOSED — back to 2026".
- **Palette/Type**: monochrome phosphor green (terminal) + cream accent for year labels.
- **Why it fits**: documentation & history are his strengths (docs discipline, runbooks) — a log vault = a "neatly archived" portfolio.

## CONCEPT 09 — TOWER (Project Air-Traffic Control)
**Character**: Project Office Manager juggling 4 parallel infrastructure projects — the portfolio is a project traffic-control tower.

- **3D centerpiece**: 3D airport radar/screen — projects as aircraft on approach paths; active projects = in the air (moving via `useFrame`), finished = parked. `Line` for approach paths; tower HUD with per-project status.
- **Framer-motion**: project cards = "flight strips" (paper ATC strips) that slide; statistics = departure board.
- **Transition**: between sections like a "clearance" change — brief air-traffic control messages.
- **Palette/Type**: radar green + black + white; bold mono.
- **Why it fits**: multi-project experience (RWS, Dadi Muria, Jragung, Waduk Bener) and cross-team coordination become a visual story rarely seen in portfolios.

## CONCEPT 10 — OPERATOR (Promptable AI Console)
**Character**: Prompt engineer & LLM evaluator — the portfolio is a "promptable" console.

- **3D centerpiece**: AI "core" — an energized `MeshDistortMaterial` icosahedron (drei) behind the hero; reacts (pulses/changes color) as the user types in the command bar.
- **Framer-motion**: navigation = chat/console: the user types an intent ("projects", "experience", "certifications") → the section switches with `AnimatePresence` like an assistant's response; answers get "typed" token by token.
- **Transition**: `mode="wait"` + horizontal slide for section changes — feels like a conversation.
- **Palette/Type**: black + dim cyan/violet; mono; `$` prompt prefix everywhere.
- **Why it fits**: he trains LLMs and evaluates prompts — a portfolio that "can be prompted" is a live demo of the skill, not just a claim.

---

## Recommendations

- **Start with CONCEPT 01 PERIMETER** — closest to the SecOps identity, easiest to execute with drei (`Sphere`/`Line`/`Float`/`Html` without external assets), and most distinct from the existing 2D previews.
- **CONCEPT 02 LATENT** is the most "wow" for AI recruiters, but needs Points performance tuning (pick 3–6k points, simple shader).
- All concepts must keep: a full static fallback (no-WebGL), `prefers-reduced-motion`, the Lighthouse a11y/BP/SEO 100 gate, and the BYOK/UU PDP story in the contact section.

---

## Technical Implementation Notes (used by all concepts)

```jsx
// Lazy-load Canvas only on the hero — keep the bundle & Lighthouse perf in check
const Scene = lazy(() => import('./three/Scene'))
// <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 45, position: [0, 0, 8] }} />
// disable WebGL & motion under reduced-motion:
const { reducedMotion } = useReducedMotion() // framer-motion
```
