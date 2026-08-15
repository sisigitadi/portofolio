import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, Line, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp, ScanTitle, Stagger, item, CountUp } from '../components/ui'

const AMBER = '#ffb454'
const GREEN = '#3fb950'

function circle(r, seg = 64, y = 0.02) {
  const pts = []
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2
    pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
  }
  return pts
}

/* glow sprite texture dibuat sekali, di-cache per warna */
const glowCache = {}
function makeGlow(color) {
  if (glowCache[color]) return glowCache[color]
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 32)
  grad.addColorStop(0, color)
  grad.addColorStop(0.35, color + '55')
  grad.addColorStop(1, 'transparent')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  glowCache[color] = tex
  return tex
}

const BLIPS = [
  { a: 0.4, r: 1.1, y: 0.35, label: 'WAZUH SIEM', s: 0.045, c: GREEN, kind: 'SecOps' },
  { a: 1.6, r: 1.9, y: 0.25, label: 'OLLAMA / LLM', s: 0.035, c: AMBER, kind: 'AI' },
  { a: 2.6, r: 1.4, y: 0.42, label: 'DOCKER / UBUNTU', s: 0.04, c: '#58a6ff', kind: 'Infra' },
  { a: 3.7, r: 2.2, y: 0.2, label: 'PROMPTMATRIX 2.0', s: 0.03, c: '#d2a8ff', kind: 'Proyek' },
  { a: 4.9, r: 0.9, y: 0.5, label: 'FORTIWEB WAF', s: 0.035, c: '#ff7b72', kind: 'SecOps' },
  { a: 5.6, r: 1.7, y: 0.3, label: 'SCOPS · MTTR −45%', s: 0.04, c: GREEN, kind: 'Proyek' },
]

function Blip({ b }) {
  const ref = useRef()
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return
    ref.current.position.y = b.y + Math.sin(clock.getElapsedTime() * 1.4 + b.a * 3) * 0.12
  })
  return (
    <group position={[Math.cos(b.a) * b.r, b.y, Math.sin(b.a) * b.r]}>
      <mesh
        ref={ref}
        scale={hover ? b.s * 2.2 : b.s}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={b.c} transparent opacity={0.95} />
      </mesh>
      <sprite scale={hover ? 1.6 : 1} renderOrder={2}>
        <spriteMaterial map={makeGlow(b.c)} transparent depthWrite={false} opacity={0.85} />
      </sprite>
      {hover && (
        <Html center distanceFactor={9} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ font: '10px ui-monospace, monospace', color: '#e8ecef', background: 'rgba(8,12,14,0.92)', border: '1px solid ' + b.c, padding: '5px 9px', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
            {b.label} <span style={{ color: b.c }}>●</span>
          </div>
        </Html>
      )}
    </group>
  )
}

function PerimeterScene() {
  const reduced = useReducedMotion()
  const sweep = useRef()
  const dome = useRef()
  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.getElapsedTime()
    if (sweep.current) {
      sweep.current.rotation.y = t * 0.9
      sweep.current.children[0].material.opacity = 0.16 + Math.sin(t * 2) * 0.05
    }
    if (dome.current) dome.current.rotation.y = Math.sin(t * 0.15) * 0.15
  })
  const ring1 = useMemo(() => circle(0.9), [])
  const ring2 = useMemo(() => circle(1.5), [])
  const ring3 = useMemo(() => circle(2.2), [])
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 4, 2]} intensity={40} color={AMBER} />
      <group ref={dome} position={[0, -0.4, 0]}>
        <mesh>
          <sphereGeometry args={[2.6, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.28} />
        </mesh>
        <Line points={ring1} color={AMBER} lineWidth={1} transparent opacity={0.55} />
        <Line points={ring2} color={AMBER} lineWidth={1} transparent opacity={0.4} />
        <Line points={ring3} color={AMBER} lineWidth={1} transparent opacity={0.28} />
        <Line points={[[-2.6, 0.02, 0], [2.6, 0.02, 0]]} color={AMBER} lineWidth={1} transparent opacity={0.25} />
        <Line points={[[0, 0.02, -2.6], [0, 0.02, 2.6]]} color={AMBER} lineWidth={1} transparent opacity={0.25} />
        {/* sapuan radar */}
        <group ref={sweep}>
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.6, 48, 0, Math.PI * 1.15]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
        {BLIPS.map((b, i) => <Blip key={i} b={b} />)}
      </group>
      <Sparkles count={90} scale={[9, 4, 9]} size={1.6} speed={0.35} opacity={0.4} color={AMBER} />
    </>
  )
}

function PerimeterPage() {
  return (
    <ConceptLayout
      num="01"
      name="PERIMETER"
      tag="Threat Radar Dome"
      theme={{ accent: AMBER, accent2: GREEN, bg: '#0a0e13', line: '#232b33', dim: '#8a939c', faint: '#4c555e' }}
      scene={<PerimeterScene />}
    >
      <section className="hero">
        <div className="kicker">Threat Radar Dome — SOC perimeter scan</div>
        <ScanTitle>PERIMETER</ScanTitle>
        <Stagger className="sub" gap={0.14}>
          <motion.p variants={item} className="sub">
            Selama <CountUp to={24} suffix=" tahun" /> saya menjaga perimeter — sistem, SIEM, dan manusia di baliknya.
            Portofolio ini adalah layar radar: setiap blip = proyek atau domain yang saya operasikan.
          </motion.p>
          <motion.div variants={item} className="actions">
            <a className="btn solid" href="#scan">MULAI SCAN ↓</a>
            <a className="btn" href="https://www.linkedin.com/in/sigitadi/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
          </motion.div>
        </Stagger>
        <div style={{ marginTop: 44, maxWidth: 620 }}>
          <FadeUp delay={0.1}><div className="readout"><span>WAZUH SIEM</span><b style={{ marginLeft: 'auto', color: GREEN }}>● ONLINE</b></div></FadeUp>
          <FadeUp delay={0.2}><div className="readout"><span>MTTR REDUCTION</span><b style={{ marginLeft: 'auto' }}>−45%</b></div></FadeUp>
          <FadeUp delay={0.3}><div className="readout"><span>STATUS</span><b style={{ marginLeft: 'auto' }}>OPEN FOR REMOTE ROLES</b></div></FadeUp>
        </div>
        <div className="scroll-hint">▾ scroll — sapuan radar menandai tiap sektor</div>
      </section>

      <section id="scan" className="section" style={{ paddingTop: 20 }}>
        <div className="mono">// SEKTOR TERPANTAU</div>
        <h2>Blip di layar radar</h2>
        <p className="lede">Hover blip di layar di atas — atau telusuri sektor di bawah. Semua bernyawa: saya yang mengoperasikannya di produksi.</p>
        <div className="radar-grid">
          {[
            { tag: 'SECOPS', t: 'SCOPS Command', d: 'Triage SIEM real-time, MTTR −45%.', m: 'Wazuh · NIST · FortiWeb' },
            { tag: 'AI / LLM', t: 'PromptMatrix 2.0', d: 'Platform uji prompt multi-variabel, BYOK penuh.', m: 'Next.js · Gemini · LangChain' },
            { tag: 'PRIVACY-FIRST', t: 'SmartExpenseML', d: 'Klasifikasi pengeluaran 100% offline, tanpa retensi data.', m: 'Rules + Regex · UU PDP' },
            { tag: 'INFRA', t: 'Docker Harbor', d: 'Infrastruktur Ubuntu/WSL + Wazuh untuk platform pemerintah.', m: 'Docker · Ubuntu · DVWA' },
            { tag: 'THREAT HUNTING', t: 'A.R.Y.A. SOC Analytics', d: 'Telemetri & penilaian keparahan insiden otomatis.', m: 'Python · Streamlit' },
            { tag: 'TULISAN', t: 'Wazuh + Telegram', d: 'Alert real-time ke Telegram, data exfiltration, brute force.', m: 'Medium · SIEM' },
          ].map((c, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="radar-tile">
                <span className="tag">◉ {c.tag}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <span className="meta">{c.m}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">PERIMETER · konsep 01/10</span>
        <span>hover blip di radar — tooltip proyek</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default PerimeterPage
