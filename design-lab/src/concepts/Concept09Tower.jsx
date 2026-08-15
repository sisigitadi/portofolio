import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp, ScanTitle } from '../components/ui'

const RADAR = '#4ade80'
const WHITE = '#e8ecef'
const AMBER = '#fbbf24'

const FLIGHTS = [
  { id: 'SAI-2026', t: 'Web Admin · BPDLH', status: 'ON APPROACH', speed: 0.16, curve: 0.9, c: RADAR },
  { id: 'SAI-2025', t: 'SOC Analyst · Prospera', status: 'ON APPROACH', speed: 0.1, curve: -0.7, c: WHITE },
  { id: 'SAI-2024', t: 'Threat Hunting · Kemendagri', status: 'HOLDING', speed: 0.05, curve: 1.3, c: AMBER },
  { id: 'SAI-2023', t: 'IT & Ops Manager · ACE', status: 'PARKED', speed: 0, curve: -1.1, c: WHITE },
  { id: 'SAI-2020', t: 'Project Office · PUPR x4', status: 'PARKED', speed: 0, curve: 0.5, c: WHITE },
]

function pathPoints(curve, r = 5) {
  const pts = []
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const a = t * Math.PI * 1.15
    pts.push([
      Math.cos(a) * r * (1 - t * 0.55),
      Math.sin(a * 1.6) * curve * 0.7 + 0.6 - t * 0.7,
      Math.sin(a) * r * 0.8,
    ])
  }
  return pts
}

function Aircraft({ f, i }) {
  const ref = useRef()
  const prog = useRef(0)
  const reduced = useReducedMotion()
  const pts = useMemo(() => pathPoints(f.curve), [f.curve])
  useFrame((_, delta) => {
    if (!ref.current) return
    if (!reduced && f.speed > 0) prog.current = (prog.current + delta * f.speed) % 1
    const t = prog.current
    const idx = Math.min(pts.length - 1, Math.floor(t * (pts.length - 1)))
    const p = pts[idx]
    ref.current.position.set(p[0], p[1], p[2])
    ref.current.rotation.z = Math.sin(t * Math.PI * 4) * 0.08
  })
  return (
    <group ref={ref}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <coneGeometry args={[0.12, 0.5, 4]} />
          <meshStandardMaterial color={f.c} emissive={f.c} emissiveIntensity={f.speed > 0 ? 0.7 : 0.2} />
        </mesh>
      </group>
      <Html center distanceFactor={10} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ font: '10px ui-monospace, monospace', color: f.c, background: 'rgba(4,10,8,0.88)', border: '1px solid ' + f.c, padding: '3px 8px', whiteSpace: 'nowrap', transform: 'translateY(-16px)' }}>
          {f.id} · {f.status}
        </div>
      </Html>
    </group>
  )
}

function TowerScene() {
  const radar = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (radar.current && !reduced) radar.current.rotation.y = clock.getElapsedTime() * 2.2
  })
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 6, 4]} intensity={40} color={RADAR} />
      <group position={[0, -1.1, 0]}>
        <gridHelper args={[14, 18, '#1d3a2a', '#12241a']} />
        {FLIGHTS.map((f, i) => (
          <group key={i}>
            <Line points={pathPoints(f.curve)} color={f.c} lineWidth={1} transparent opacity={0.4} />
            <Aircraft f={f} i={i} />
          </group>
        ))}
      </group>
      {/* menara kontrol */}
      <group position={[0, -1.4, -5.2]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 1.8, 12]} />
          <meshStandardMaterial color="#16231c" />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.5, 12]} />
          <meshBasicMaterial color="#0b1410" wireframe transparent opacity={0.7} />
        </mesh>
        {/* antena radar berputar */}
        <group ref={radar} position={[0, 2.45, 0]}>
          <mesh>
            <boxGeometry args={[0.06, 0.02, 0.7]} />
            <meshBasicMaterial color={RADAR} />
          </mesh>
        </group>
      </group>
    </>
  )
}

const BOARD = [
  { f: 'SAI-2026', dest: 'BPDLH · MoE', gate: 'G1', time: 'NOW', st: 'ON APPROACH', c: RADAR },
  { f: 'SAI-2025', dest: 'PROSPERA SOC', gate: 'G2', time: 'NOW', st: 'ON APPROACH', c: WHITE },
  { f: 'SAI-2024', dest: 'KEMENDAGRI', gate: 'G3', time: 'HOLD', st: 'HOLDING', c: AMBER },
  { f: 'SAI-2023', dest: 'ACE LTD', gate: 'G4', time: '—', st: 'PARKED', c: WHITE },
  { f: 'SAI-2020', dest: 'PUPR x4', gate: 'G5', time: '—', st: 'PARKED', c: WHITE },
]

function TowerPage() {
  return (
    <ConceptLayout
      num="09"
      name="TOWER"
      tag="Project Air-Traffic Control"
      theme={{ accent: RADAR, accent2: AMBER, bg: '#060d0a', line: '#1a2d23', dim: '#93a89c', faint: '#4d6355' }}
      scene={<TowerScene />}
    >
      <section className="hero">
        <div className="kicker">Project control tower — mengatur beberapa proyek sekaligus</div>
        <ScanTitle>TOWER</ScanTitle>
        <p className="sub">
          Pernah memegang 4 proyek infrastruktur paralel (PUPR). Di sini, tiap proyek = penerbangan:
          ada yang on approach, holding, atau sudah parkir. Semua punya slot, semua terkoordinasi.
        </p>
        <div className="actions">
          <a className="btn solid" href="#board">LIHAT DEPARTURE BOARD ↓</a>
        </div>
        <div className="scroll-hint">▾ scroll — pesawat bergerak di jalur approach-nya</div>
      </section>

      <section id="board" className="section" style={{ paddingTop: 20 }}>
        <div className="mono">// DEPARTURE BOARD</div>
        <h2>Lalu lintas proyek</h2>
        <p className="lede">Status real-time dalam metafora ATC — tidak ada proyek yang saling menabrak.</p>
        <div className="tile" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ font: '11px ui-monospace, monospace', padding: '10px 16px', borderBottom: '1px solid #1a2d23', color: '#93a89c', letterSpacing: '0.08em', display: 'grid', gridTemplateColumns: '90px 1fr 60px 70px 110px', gap: 8 }}>
            <span>FLIGHT</span><span>DESTINATION</span><span>GATE</span><span>TIME</span><span>STATUS</span>
          </div>
          {BOARD.map((b, i) => (
            <motion.div
              key={b.f}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              style={{ font: '12px ui-monospace, monospace', padding: '10px 16px', borderBottom: i < BOARD.length - 1 ? '1px solid #1a2d23' : 'none', display: 'grid', gridTemplateColumns: '90px 1fr 60px 70px 110px', gap: 8, alignItems: 'center' }}
            >
              <span style={{ color: b.c }}>{b.f}</span>
              <span>{b.dest}</span>
              <span style={{ color: '#93a89c' }}>{b.gate}</span>
              <span style={{ color: '#93a89c' }}>{b.time}</span>
              <span style={{ color: b.c, letterSpacing: '0.06em' }}>{b.st}</span>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 26, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {FLIGHTS.map((f, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="tile" style={{ borderTop: '3px solid ' + f.c }}>
                <span className="meta" style={{ color: f.c }}>{f.id} · {f.status}</span>
                <h3>{f.t}</h3>
                <p>Proyek berjalan dengan slot & jalur approach sendiri — koordinasi lintas tim dan timezone.</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">TOWER · konsep 09/10</span>
        <span>pesawat bergerak = proyek aktif; parkir = selesai</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default TowerPage
