import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Line, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp } from '../components/ui'

const NAVY = '#1c2a44'
const CREAM = '#efe6d5'
const GOLD = '#e8c87a'
const CYAN = '#7dd3fc'

/* milestone: year → percent along 2002-2026 */
const MILESTONES = [
  { y: 2002, p: 0.0, t: 'Arya Mobile', d: 'Helpdesk & hardware', active: false },
  { y: 2009, p: 0.29, t: 'Laju Karunia Jaya', d: 'Enterprise systems', active: false },
  { y: 2014, p: 0.5, t: 'Dipta Safari Jaya', d: 'IT Manager · 6 th', active: false },
  { y: 2020, p: 0.75, t: 'PUPR · Nippon Koei', d: 'Project Office Mgr', active: false },
  { y: 2023, p: 0.875, t: 'ACE Ltd', d: 'IT & Ops Manager', active: false },
  { y: 2024, p: 0.917, t: 'SOC · Kemendagri', d: 'IR / Shift Lead', active: false },
  { y: 2025, p: 0.958, t: 'SOC Analyst · Prospera', d: 'Wazuh · NIST', active: false },
  { y: 2026, p: 1.0, t: 'BPDLH · MoE', d: 'Web Admin · Docker', active: true },
]

function Satellite({ m }) {
  const ref = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.1 + m.p * 7) * 0.35
  })
  const angle = m.p * Math.PI * 2
  const r = 2.35
  return (
    <group position={[Math.cos(angle) * r, Math.sin(angle) * 0.25, Math.sin(angle) * r]}>
      <mesh ref={ref}>
        <sphereGeometry args={[m.active ? 0.085 : 0.055, 16, 16]} />
        <meshBasicMaterial color={m.active ? GOLD : CYAN} />
      </mesh>
      <Html center distanceFactor={11} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center', transform: 'translateY(16px)', pointerEvents: 'none' }}>
          <div style={{ font: '10px ui-monospace, monospace', color: m.active ? GOLD : '#cfd8e3', letterSpacing: '0.12em', background: 'rgba(8,12,18,0.85)', border: '1px solid ' + (m.active ? GOLD : '#2a3a55'), padding: '3px 8px', whiteSpace: 'nowrap' }}>
            {m.y} · {m.t}
          </div>
        </div>
      </Html>
    </group>
  )
}

function circle3d(r, tilt, seg = 100) {
  const pts = []
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    pts.push([x, Math.sin(a * 1) * tilt, z])
  }
  return pts
}

function OrbitScene({ progress }) {
  const { camera } = useThree()
  const p = useSpring(progress, { stiffness: 50, damping: 22 })
  const planet = useRef()
  const reduced = useReducedMotion()
  useFrame(() => {
    if (!reduced) planet.current.rotation.y += 0.002
    const t = p.get()
    const ang = t * Math.PI * 2
    camera.position.lerp(new THREE.Vector3(Math.sin(ang) * 8.6, 1.6 + Math.sin(t * Math.PI) * 1.4, Math.cos(ang) * 8.6), 0.06)
    camera.lookAt(0, 0, 0)
  })
  const ring1 = useMemo(() => circle3d(2.35, 0.0), [])
  const ring2 = useMemo(() => circle3d(3.1, 0.35), [])
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 4]} intensity={60} color="#cfe0ff" />
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[1.25, 48, 48]} />
          <meshStandardMaterial color={NAVY} roughness={0.75} metalness={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.28, 24, 16]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.16} />
        </mesh>
        {/* stylized landmass — a few small circles as contours */}
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{ font: '10px ui-monospace, monospace', color: CREAM, letterSpacing: '0.2em', textAlign: 'center', transform: 'translateY(-8px)', opacity: 0.85 }}>
            2002 → 2026
          </div>
        </Html>
      </group>
      <Line points={ring1} color={CYAN} lineWidth={1} transparent opacity={0.45} />
      <Line points={ring2} color={GOLD} lineWidth={1} transparent opacity={0.3} />
      {MILESTONES.map((m, i) => <Satellite key={i} m={m} />)}
      <Sparkles count={140} scale={14} size={1.8} speed={0.3} opacity={0.4} color="#cfe0ff" />
    </>
  )
}

function OrbitPage() {
  const { scrollYProgress } = useScroll()
  const progress = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  return (
    <ConceptLayout
      num="06"
      name="ORBIT"
      tag="24-Year Career Trajectory"
      theme={{ accent: GOLD, accent2: CYAN, bg: '#0a0f1c', line: '#24304a', dim: '#aab6c8', faint: '#5a6678' }}
      scene={<OrbitScene progress={progress} />}
    >
      <section className="hero">
        <div className="kicker">Orbit — a 24-year career, from 2002 to 2026</div>
        <h1>
          <motion.span
            initial={{ opacity: 0, scale: 1.4, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            ORBIT
          </motion.span>
        </h1>
        <p className="sub">
          Every milestone = a satellite in its own orbit. Scroll — the camera circles the planet
          along 24 years of the journey: from helpdesk, to IT management, to SOC, to applied AI.
        </p>
        <div className="actions">
          <a className="btn solid" href="#timeline">FLY THE ORBIT ↓</a>
        </div>
        <div className="scroll-hint">▾ scroll — the camera orbits the planet</div>
      </section>

      <section id="timeline" className="section" style={{ paddingTop: 30 }}>
        <div className="mono">// INSERTION BURNS</div>
        <h2>Eight orbits, one trajectory</h2>
        <p className="lede">Each phase enters orbit with an "insertion burn" — appearing small, then stabilizing in place.</p>
        <div style={{ maxWidth: 700 }}>
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.y}
              initial={{ opacity: 0, scale: 0.6, x: -18 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.04 }}
              className="readout"
              style={{ padding: '11px 0', borderColor: m.active ? GOLD : undefined }}
            >
              <b style={{ color: m.active ? GOLD : CYAN, width: 52 }}>{m.y}</b>
              <span style={{ color: '#e8ecef', fontWeight: 600 }}>{m.t}</span>
              <span style={{ marginLeft: 'auto', textAlign: 'right' }}>{m.d}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">ORBIT · concept 06/10</span>
        <span>gold satellite = active 2026 orbit (BPDLH)</span>
        <a href="#/">← back to gallery</a>
      </footer>
    </ConceptLayout>
  )
}

export default OrbitPage
