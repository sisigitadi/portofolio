import Concept01Perimeter from './Concept01Perimeter'
import Concept02Latent from './Concept02Latent'
import Concept03Command from './Concept03Command'
import Concept04Harbor from './Concept04Harbor'
import Concept05Verify from './Concept05Verify'
import Concept06Orbit from './Concept06Orbit'
import Concept07Evidence from './Concept07Evidence'
import Concept08Archive from './Concept08Archive'
import Concept09Tower from './Concept09Tower'
import Concept10Operator from './Concept10Operator'

export const Concept01 = Concept01Perimeter
export const Concept02 = Concept02Latent
export const Concept03 = Concept03Command
export const Concept04 = Concept04Harbor
export const Concept05 = Concept05Verify
export const Concept06 = Concept06Orbit
export const Concept07 = Concept07Evidence
export const Concept08 = Concept08Archive
export const Concept09 = Concept09Tower
export const Concept10 = Concept10Operator

export const ALL = [
  { id: '01', name: 'PERIMETER', tag: 'Threat Radar Dome', C: Concept01Perimeter,
    why: 'SOC analyst guarding the perimeter — project blips on a 3D radar, scan sweep as the transition.',
    swatches: ['#ffb454', '#3fb950', '#0a0e13'], tags: ['SecOps', 'radar', 'scan-reveal'] },
  { id: '02', name: 'LATENT', tag: 'Neural Weight-Space', C: Concept02Latent,
    why: 'Fly through the LLM embedding space — token points per project cluster, camera driven by scroll.',
    swatches: ['#6ee7ff', '#a78bfa', '#070910'], tags: ['AI/LLM', 'points', 'camera-rig'] },
  { id: '03', name: 'COMMAND', tag: 'Mission Control Deck', C: Concept03Command,
    why: 'Holographic command deck — boot sequence, floating telemetry panels, career mission phases.',
    swatches: ['#22d3ee', '#fbbf24', '#060a12'], tags: ['ops', 'hologram', 'boot'] },
  { id: '04', name: 'HARBOR', tag: 'Container Registry Twin', C: Concept04Harbor,
    why: 'Infrastructure digital twin — projects as container images with LEDs & layers, docker ps style.',
    swatches: ['#67e8f9', '#4ade80', '#070d12'], tags: ['Docker', 'devsecops', 'registry'] },
  { id: '05', name: 'VERIFY', tag: 'Holographic Identity Vault', C: Concept05Verify,
    why: 'Credentials & privacy as identity — holo cards scanned, certificates stamped VERIFIED.',
    swatches: ['#e8c87a', '#7dd3fc', '#0a0d11'], tags: ['UU PDP', 'BYOK', 'stamp'] },
  { id: '06', name: 'ORBIT', tag: '24-Year Career Trajectory', C: Concept06Orbit,
    why: 'The 2002→2026 career as a satellite orbiting a planet — scroll moves the camera.',
    swatches: ['#e8c87a', '#7dd3fc', '#0a0f1c'], tags: ['career', 'orbit', 'scroll-scrub'] },
  { id: '07', name: 'EVIDENCE', tag: 'Forensics Case Files', C: Concept07Evidence,
    why: 'Investigation evidence files — redaction bars open on hover, chain of custody.',
    swatches: ['#b02a23', '#e9e2d3', '#0e0c0a'],    tags: ['forensics', 'IR', 'redaction'] },
  { id: '08', name: 'ARCHIVE', tag: 'Syslog Time Capsule', C: Concept08Archive,
    why: 'A 3-decade log vault — the camera descends past logbook shelves, log lines retyped.',
    swatches: ['#39d353', '#efe6d5', '#050a06'], tags: ['sysadmin', 'vault', 'log'] },
  { id: '09', name: 'TOWER', tag: 'Project Air-Traffic Control', C: Concept09Tower,
    why: 'Projects as flights on approach paths — ATC board, real-time status, 4 parallel projects.',
    swatches: ['#4ade80', '#fbbf24', '#060d0a'],    tags: ['multi-project', 'ATC', 'board'] },
  { id: '10', name: 'OPERATOR', tag: 'Promptable AI Console', C: Concept10Operator,
    why: 'A promptable résumé — the 3D core reacts as you type, navigation via commands.',
    swatches: ['#00d4ff', '#8b5cf6', '#070a12'], tags: ['prompt', 'console', 'chat'] },
]
