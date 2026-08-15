import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, Line, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { CountUp, FadeUp } from '../components/ui'

const CYAN = '#22d3ee'
const AMBER = '#fbbf24'
const EMERALD = '#34d399'

function circle(r, seg = 80, y = 0) {
  const pts = []
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2
    pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
  }
  return pts
}

/* lokasi: Tangerang + proyek-proyek */
const MARKS = [
  { lat: -6.2, lon: 106.6, label: 'TANGERANG · HQ', c: CYAN },     // Tangerang
  { lat: -6.2, lon: 106.85, label: 'BPDLH · MoE', c: EMERALD },    // Jakarta (proyek saat ini)
  { lat: -7.25, lon: 110.3, label: 'PUPR · PROYEK', c: AMBER },    // Jawa Tengah (Waduk Bener dll)
  { lat: 3.1, lon: 101.6, label: 'KL · REMOTE', c: '#a78bfa' },    // Kuala Lumpur (contoh remote global)
]

function latLonToVec(lat, lon, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), -r * Math.sin(phi) * Math.sin(theta)]
}

function Globe() {
  const g = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (g.current && !reduced) g.current.rotation.y = clock.getElapsedTime() * 0.12
  })
  const ring = useMemoCircle(1.9)
  return (
    <group position={[2.6, 0.4, 0]}>
      <group ref={g}>
        <mesh>
          <sphereGeometry args={[1.15, 40, 40]} />
          <meshStandardMaterial color="#0c1a26" emissive="#12344d" emissiveIntensity={0.35} roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.16, 28, 16]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.22} />
        </mesh>
        {MARKS.map((m, i) => (
          <group key={i} position={latLonToVec(m.lat, m.lon, 1.2)}>
            <mesh>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color={m.c} />
            </mesh>
            <Html center distanceFactor={12} style={{ pointerEvents: 'none' }}>
              <div style={{ font: '9px ui-monospace, monospace', letterSpacing: '0.1em', color: '#e8ecef', background: 'rgba(6,10,14,0.85)', border: '1px solid ' + m.c, padding: '3px 7px', whiteSpace: 'nowrap' }}>
                {m.label}
              </div>
            </Html>
          </group>
        ))}
      </group>
      <Line points={ring} color={CYAN} lineWidth={1} transparent opacity={0.3} />
    </group>
  )
}

function useMemoCircle(r) {
  return useMemo(() => circle(r), [r])
}

const PANELS = [
  { pos: [-3.4, 1.5, -0.6], rot: [0.15, 0.5, -0.06], w: 2.0, h: 1.15, title: 'WAZUH TELEMETRY', lines: ['ALERTS/24H: 312', 'TRIAGED: 100%', 'MTTR Δ: −45%'], c: EMERALD },
  { pos: [-3.2, -0.4, 0.4], rot: [-0.08, 0.35, 0.05], w: 1.9, h: 1.0, title: 'UPTIME', lines: ['SYSADMIN SINCE 2002', 'TEAMS: 50+ STAFF', 'MODUS: REMOTE-FIRST'], c: CYAN },
  { pos: [-3.1, -1.9, -0.2], rot: [0.1, 0.45, 0.02], w: 1.8, h: 0.9, title: 'AI / LLM', lines: ['OLLAMA · BYOK', 'PROMPT EVAL', 'GEMINI PIPELINE'], c: AMBER },
]

function Panel({ p }) {
  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
      <group position={p.pos} rotation={p.rot}>
        <RoundedBox args={[p.w, p.h, 0.06]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#0a1520" emissive="#0f2b3f" emissiveIntensity={0.5} transparent opacity={0.92} side={THREE.DoubleSide} />
        </RoundedBox>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[p.w - 0.06, p.h - 0.06]} />
          <meshBasicMaterial color="#0a1520" transparent opacity={0.4} depthWrite={false} />
        </mesh>
        <Html center distanceFactor={14} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ width: p.w * 90, font: '10px ui-monospace, monospace', color: p.c }}>
            <div style={{ letterSpacing: '0.14em', borderBottom: '1px solid ' + p.c, paddingBottom: 3, marginBottom: 5, whiteSpace: 'nowrap' }}>■ {p.title}</div>
            {p.lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.5, duration: 0.4 }}
                style={{ color: '#b7c4cf', whiteSpace: 'nowrap', margin: '2px 0' }}
              >
                {l}
              </motion.div>
            ))}
          </div>
        </Html>
      </group>
    </Float>
  )
}

function CommandScene() {
  const core = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (core.current && !reduced) core.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.6
  })
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 6]} intensity={50} color={CYAN} />
      <pointLight position={[-5, -2, 3]} intensity={25} color={AMBER} />
      {/* inti holografik */}
      <group ref={core} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#0e2a3a" emissive={CYAN} emissiveIntensity={0.7} wireframe transparent opacity={0.85} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshBasicMaterial color={CYAN} />
        </mesh>
      </group>
      <Globe />
      {PANELS.map((p, i) => <Panel key={i} p={p} />)}
      <Sparkles count={120} scale={[10, 6, 10]} size={2} speed={0.4} opacity={0.35} color={CYAN} />
    </>
  )
}

const BOOT = [
  { t: 'POWER ON', d: 0 },
  { t: 'SENSOR CHECK .......... OK', d: 0.5 },
  { t: 'WAZUH SIEM ......... ONLINE', d: 1.0 },
  { t: 'FORTIWEB WAF ....... ARMED', d: 1.5 },
  { t: 'ALL SYSTEMS NOMINAL', d: 2.0 },
]

function CommandPage() {
  return (
    <ConceptLayout
      num="03"
      name="COMMAND"
      tag="Mission Control Deck"
      theme={{ accent: CYAN, accent2: AMBER, bg: '#060a12', line: '#16222e', dim: '#8ba3b5', faint: '#4a5d6b' }}
      scene={<CommandScene />}
    >
      <section className="hero">
        <div className="kicker">Mission control — 24 tahun operasi, satu dek</div>
        <h1>
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '-0.03em' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            COMMAND
          </motion.span>
        </h1>
        <div style={{ maxWidth: 560, marginTop: 18 }}>
          {BOOT.map((b, i) => (
            <motion.div
              key={i}
              className="readout"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: b.d + 0.3, duration: 0.35 }}
            >
              <span style={{ color: '#4a5d6b' }}>[{String(b.d).padStart(4, '0')}]</span>
              <span style={{ color: i === BOOT.length - 1 ? EMERALD : '#8ba3b5' }}>{b.t}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.5 }}
        >
          <a className="btn solid" href="#phase">LIHAT FASE MISI ↓</a>
        </motion.div>
        <div className="scroll-hint">▾ scroll — panel telemetri mengambang di layar</div>
      </section>

      <section id="phase" className="section" style={{ paddingTop: 40 }}>
        <div className="mono">// FASE MISI</div>
        <h2>Track record, bukan daftar</h2>
        <p className="lede">Setiap fase = misi yang saya jalankan sampai selesai. Panel mengambang di layar: hover untuk membaca telemetri.</p>
        <div className="grid">
          {[
            { t: 'Web Administrator · BPDLH', d: 'Docker/Ubuntu + Wazuh untuk platform pemerintah.', v: 45, s: 'AKTIF 2026', c: EMERALD },
            { t: 'AI Trainer & LLM Evaluator', d: 'Prompt multi-variabel, eval format, BYOK.', v: 100, s: '2024→SEKARANG', c: CYAN },
            { t: 'SOC Analyst · Prospera', d: 'Playbook IR NIST, gap analysis ISO 27001.', v: 78, s: '2025', c: AMBER },
            { t: 'IT & Ops Manager · ACE', d: 'SQL pipeline otomatis, tim 50+ orang.', v: 62, s: '2023–2024', c: '#a78bfa' },
            { t: 'Project Office Manager · PUPR', d: '4 proyek infrastruktur paralel.', v: 88, s: '2020–2023', c: EMERALD },
            { t: 'IT Manager · Dipta Safari Jaya', d: 'Enterprise network & backup-recovery.', v: 71, s: '2014–2020', c: CYAN },
          ].map((m, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="tile" style={{ borderTop: '3px solid ' + m.c }}>
                <span className="meta" style={{ color: m.c }}>{m.s}</span>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
                <div className="bar">
                  <motion.i
                    style={{ background: m.c }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="meta" style={{ marginTop: 8 }}><CountUp to={m.v} suffix="%" /></span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">COMMAND · konsep 03/10</span>
        <span>boot sequence → fase misi dengan progress telemetri</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default CommandPage
