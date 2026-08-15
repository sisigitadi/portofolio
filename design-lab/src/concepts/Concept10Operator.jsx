import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial, Sparkles, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { TypeLine } from '../components/ui'

const CYAN = '#00d4ff'
const VIOLET = '#8b5cf6'
const DIM = '#5f6b7a'

const SECTIONS = {
  intro: {
    title: 'OPERATOR — résumé yang bisa di-prompt',
    lines: [
      'Sigit Adi Irianto · IT & SecOps · Applied AI.',
      'Ketik perintah di bawah — ini portofolio yang merespons.',
    ],
    hints: ['coba: projects', 'coba: experience', 'coba: certifications', 'coba: contact'],
  },
  projects: {
    title: '// projects',
    lines: [
      'PromptMatrix 2.0 — prompt testing, BYOK (Next.js · Gemini).',
      'SCOPS Command — triage SIEM, MTTR −45% (Wazuh · NIST).',
      'SmartExpenseML — klasifikasi 100% offline (UU PDP).',
      'A.R.Y.A. SOC Analytics — threat hunting (Streamlit).',
      'KantinKu ERP — POS serverless (Apps Script · WA).',
    ],
    hints: ['ketik experience untuk lanjut', 'ketik help'],
  },
  experience: {
    title: '// experience',
    lines: [
      '2026 — Web Administrator · BPDLH/MoE (Docker · Wazuh).',
      '2025 — SOC Analyst · Prospera (playbook NIST · ISO 27001).',
      '2024 — Incident Handling · Kemendagri (threat hunting).',
      '2023 — IT & Ops Manager · ACE (tim 50+).',
      '2020 — Project Office Manager · PUPR (4 proyek paralel).',
      '2014 — IT Manager · Dipta Safari Jaya (6 tahun).',
      '2002 — Akar: helpdesk & enterprise systems.',
    ],
    hints: ['ketik certifications', 'ketik projects'],
  },
  certifications: {
    title: '// certifications',
    lines: [
      'Azure AI Fundamentals (AI-900) — Microsoft 2025.',
      'SOC Analyst — Cyber Academy Indonesia 2024.',
      'BSSN Indonesia Cross-Sectoral Cyber Exercise #9.',
      'DevSecOps for Software Security — Kelas.work.',
      'Penetration Testing Professional — Cybrary.',
      'Ethical Hacking Foundations — LinkedIn Learning.',
    ],
    hints: ['ketik contact', 'ketik help'],
  },
  contact: {
    title: '// contact',
    lines: [
      'Email: si.sigitadi@gmail.com',
      'LinkedIn: /in/sigitadi',
      'GitHub: /sisigitadi',
      'Medium: @si.sigitadi',
      'Lokasi: Tangerang · UTC+7 · open to remote worldwide.',
    ],
    hints: ['ketik projects', 'ketik help'],
  },
  help: {
    title: '// help',
    lines: ['Perintah: projects · experience · certifications · contact · intro'],
    hints: ['coba ketik salah satu di atas'],
  },
}

function Core({ intensity }) {
  const mat = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (!mat.current || reduced) return
    const t = clock.getElapsedTime()
    mat.current.distort = 0.28 + intensity.current * 0.5 + Math.sin(t * 1.4) * 0.06
    mat.current.emissiveIntensity = 0.5 + intensity.current * 1.1
  })
  return (
    <group position={[0, 0, 0]}>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1.1, 48]} />
        <MeshDistortMaterial ref={mat} color="#0b1a2a" emissive={CYAN} emissiveIntensity={0.6} roughness={0.15} metalness={0.4} distort={0.3} speed={2.4} />
      </mesh>
      <Torus args={[1.75, 0.012, 12, 100]} rotation={[Math.PI / 2.4, 0, 0]}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.7} />
      </Torus>
      <Torus args={[2.05, 0.008, 12, 100]} rotation={[Math.PI / 1.7, 0.6, 0]}>
        <meshBasicMaterial color={VIOLET} transparent opacity={0.55} />
      </Torus>
      <Sparkles count={140} scale={[6, 5, 6]} size={2.2} speed={0.5} opacity={0.55} color={CYAN} />
      <Html center distanceFactor={9} position={[0, 2.1, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ font: '10px ui-monospace, monospace', letterSpacing: '0.24em', color: CYAN, whiteSpace: 'nowrap' }}>
          CORE: ONLINE
        </div>
      </Html>
    </group>
  )
}

function OperatorScene({ intensity }) {
  const group = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (group.current && !reduced) group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.35
  })
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 5, 4]} intensity={45} color={CYAN} />
      <pointLight position={[-4, -2, 3]} intensity={25} color={VIOLET} />
      <group ref={group}>
        <Core intensity={intensity} />
      </group>
    </>
  )
}

function OperatorPage() {
  const [section, setSection] = useState('intro')
  const [typed, setTyped] = useState('')
  const [log, setLog] = useState([])
  const intensity = useRef(0)
  const reduced = useReducedMotion()

  const run = (cmd) => {
    const c = cmd.trim().toLowerCase()
    const map = {
      projects: 'projects', experience: 'experience', certifications: 'certifications',
      contact: 'contact', help: 'help', intro: 'intro', '': 'intro',
    }
    const target = map[c] || 'help'
    setSection(target)
    setTyped('')
    setLog((l) => [...l.slice(-4), `$ ${cmd.trim() || '(enter)'} → ${target}`])
    intensity.current = target === 'intro' ? 0 : 0.8
    if (reduced) intensity.current = 0
    setTimeout(() => { intensity.current = 0.25 }, 1200)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') run(typed)
  }

  return (
    <ConceptLayout
      num="10"
      name="OPERATOR"
      tag="Promptable AI Console"
      theme={{ accent: CYAN, accent2: VIOLET, bg: '#070a12', line: '#1b2436', dim: '#93a0b8', faint: '#4c5668' }}
      scene={<OperatorScene intensity={intensity} />}
    >
      <section className="hero" style={{ paddingBottom: 190 }}>
        <div className="kicker">Promptable résumé — ketik, dan portofolio menjawab</div>
        <h1>
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
          >
            OPERATOR
          </motion.span>
        </h1>
        <p className="sub">
          Saya melatih LLM dan mengevaluasi prompt setiap hari — jadi portofolio ini pun bisa di-prompt.
          Inti 3D di layar bereaksi setiap kali Anda mengetik. Coba konsol di bawah.
        </p>
        <div className="scroll-hint">▾ scroll — lalu ketik di konsol OPERATOR</div>
      </section>

      <section className="section" style={{ paddingTop: 10, paddingBottom: 260 }}>
        <div className="mono">// RESPONS</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 style={{ font: '15px ui-monospace, monospace', color: CYAN, letterSpacing: '0.06em' }}>{SECTIONS[section].title}</h2>
            <div style={{ maxWidth: 720, marginTop: 14 }}>
              {SECTIONS[section].lines.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="readout"
                  style={{ borderBottom: '1px dashed #1b2436' }}
                >
                  <span style={{ color: DIM }}>↳</span>
                  <span>{l}</span>
                </motion.div>
              ))}
            </div>
            <p style={{ marginTop: 16, font: '11px ui-monospace, monospace', color: DIM, letterSpacing: '0.06em' }}>
              {SECTIONS[section].hints.map((h, i) => <span key={i} style={{ marginRight: 14 }}>{h}</span>)}
            </p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* konsol fixed di bawah */}
      <div className="console">
        <div className="head">
          <span>OPERATOR@SIGIT ~ bash</span>
          <span>{log.length ? 'SESSION: ACTIVE' : 'SESSION: READY'}</span>
        </div>
        <div className="resp">
          {log.map((l, i) => <div key={i}><span className="k">history&gt;</span> {l}</div>)}
          {log.length === 0 && <div><span className="k">hint&gt;</span> portofolio ini merespons perintah Anda</div>}
        </div>
        <div className="line">
          <span className="prompt">$</span>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={onKey}
            placeholder="ketik projects / experience / certifications / contact / help"
            aria-label="Perintah konsol portofolio"
          />
          <button className="btn" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => run(typed)}>RUN</button>
        </div>
        <div className="hint">ENTER = jalankan · ESC = bersihkan</div>
      </div>

      <footer className="demo" style={{ paddingBottom: 30 }}>
        <span className="mono-up">OPERATOR · konsep 10/10</span>
        <span>inti 3D bereaksi terhadap ketikan Anda</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default OperatorPage
