import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, RoundedBox } from '@react-three/drei'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp, TypeLine } from '../components/ui'

const PAPER = '#e9e2d3'
const INK = '#1c1a16'
const RED = '#b02a23'
const RED2 = '#d04a40'

const CASES = [
  { id: 'CASE-2026-001', t: 'SCOPS Command', d: 'Triage SIEM · MTTR −45%', redact: 'WAZUH · NIST · FORTIWEB', rot: -0.08, x: -2.2, y: 0.9 },
  { id: 'CASE-2025-014', t: 'PromptMatrix 2.0', d: 'Prompt eval multi-variabel', redact: 'GEMINI · LANGCHAIN · BYOK', rot: 0.1, x: 0, y: 1.1 },
  { id: 'CASE-2025-009', t: 'SOC Analysis', d: 'ISO 27001 gap analysis', redact: 'WAZUH · MTTA BASELINE', rot: -0.05, x: 2.2, y: 0.85 },
  { id: 'CASE-2024-032', t: 'Threat Hunting', d: 'Shift lead · Kemendagri', redact: 'FORTIWEB · ESCALATION', rot: 0.12, x: -1.4, y: -0.9 },
  { id: 'CASE-2024-007', t: 'AI Trainer', d: 'LLM eval & format control', redact: 'PROMPT PIPELINES', rot: -0.1, x: 1.5, y: -1.0 },
]

function CaseCard({ c }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (ref.current && !reduced) ref.current.rotation.z = c.rot + Math.sin(clock.getElapsedTime() * 0.5 + c.x) * 0.02
  })
  return (
    <group position={[c.x, c.y, 0]} ref={ref}>
      <Float speed={1.4} rotationIntensity={0.06} floatIntensity={0.35}>
        <group
          onPointerOver={(e) => { e.stopPropagation(); setOpen(true) }}
          onPointerOut={() => setOpen(false)}
          scale={open ? 1.12 : 1}
        >
          <RoundedBox args={[1.9, 1.25, 0.045]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color={open ? '#f2ecdf' : PAPER} roughness={0.85} />
          </RoundedBox>
          <Html center distanceFactor={11} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{ width: 168, font: '11px ui-monospace, monospace', color: INK, transform: 'translateY(-4px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontWeight: 700 }}>{c.id}</span>
                <span style={{ color: RED, fontWeight: 700, fontSize: 10, border: '1px solid ' + RED, padding: '1px 5px', transform: 'rotate(-4deg)' }}>SEALED</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{c.t}</div>
              <div style={{ fontSize: 10.5, marginBottom: 6 }}>{c.d}</div>
              {/* redaction bar */}
              <div style={{ position: 'relative', height: 15, background: INK, overflow: 'hidden' }}>
                <motion.div
                  initial={false}
                  animate={{ width: open ? '0%' : '100%' }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: 0, background: RED2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, letterSpacing: '0.08em' }}
                >
                  {open ? '' : 'REDACTED'}
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontSize: 9, letterSpacing: '0.05em' }}
                >
                  {c.redact}
                </motion.div>
              </div>
            </div>
          </Html>
        </group>
      </Float>
    </group>
  )
}

function EvidenceScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 4]} intensity={20} color="#ffe9c4" />
      {CASES.map((c, i) => <CaseCard key={i} c={c} />)}
    </>
  )
}

const CHAIN = [
  { y: '2002–2014', t: 'Hardware & Enterprise Systems', d: 'Two companies, one discipline: keep systems alive.', st: 'ARCHIVED' },
  { y: '2014–2020', t: 'IT Manager · Dipta Safari Jaya', d: 'Network enterprise, backup-recovery, 6 tahun uptime.', st: 'ARCHIVED' },
  { y: '2020–2023', t: 'Project Office Manager · PUPR', d: '4 parallel infrastructure projects, standardized reporting.', st: 'ARCHIVED' },
  { y: '2024–2025', t: 'Incident Handling → SOC Analyst', d: 'NIST playbooks, MTTA baseline, real-time threat hunting.', st: 'CLOSED' },
  { y: '2026', t: 'Web Admin · BPDLH', d: 'Docker + Wazuh for government platforms.', st: 'OPEN' },
]

function EvidencePage() {
  return (
    <ConceptLayout
      num="07"
      name="EVIDENCE"
      tag="Forensics Case Files"
      theme={{ accent: RED, accent2: RED2, bg: '#0e0c0a', line: '#2a2520', dim: '#b5ab9c', faint: '#6b6154' }}
      scene={<EvidenceScene />}
    >
      <section className="hero">
        <div className="kicker">Forensics case files — evidence of work, not claims</div>
        <h1 style={{ fontSize: 'clamp(30px, 6vw, 64px)' }}>
          <TypeLine text="EVIDENCE LOCKER" speed={40} />
        </h1>
        <p className="sub">
          Every project = an evidence file: case number, results, and chain of custody.
          Hover the card on screen to open its redacted bars.
        </p>
        <div className="actions">
          <a className="btn solid" href="#chain">OPEN CHAIN OF CUSTODY ↓</a>
        </div>
        <div className="scroll-hint">▾ scroll — files are redacted, except the ones you open</div>
      </section>

      <section id="chain" className="section" style={{ paddingTop: 20 }}>
        <div className="mono">// CHAIN OF CUSTODY</div>
        <h2>Chain of custody 2002 → 2026</h2>
        <p className="lede">Hover each row: redacted parts open like a real forensics file.</p>
        <div style={{ maxWidth: 720 }}>
          {CHAIN.map((c, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="tile" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ font: '11px ui-monospace, monospace', color: RED, width: 96, flexShrink: 0 }}>{c.y}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 2 }}>{c.t}</h3>
                  <p style={{ fontSize: 12 }}>{c.d}</p>
                </div>
                <span
                  style={{
                    font: '10px ui-monospace, monospace', letterSpacing: '0.12em',
                    color: c.st === 'OPEN' ? RED : '#8d8272', border: '1px solid ' + (c.st === 'OPEN' ? RED : '#4a4238'),
                    padding: '2px 8px', transform: 'rotate(-3deg)',
                  }}
                >
                  {c.st}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">EVIDENCE · concept 07/10</span>
        <span>hover 3D card → redaction bar opens</span>
        <a href="#/">← back to gallery</a>
      </footer>
    </ConceptLayout>
  )
}

export default EvidencePage
