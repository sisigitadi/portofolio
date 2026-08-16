import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp, TypeLine } from '../components/ui'

const PHOSPHOR = '#39d353'
const DIM = '#1f6b3a'
const CREAM = '#efe6d5'

/* vault levels: each decade has a log shelf */
const LEVELS = [
  { y: 8.5, era: '2020s', label: 'SECOPS & AI', count: 26 },
  { y: 5.2, era: '2010s', label: 'IT MANAGEMENT', count: 30 },
  { y: 1.9, era: '2000s', label: 'SYSADMIN ROOTS', count: 24 },
]

function LogbookRow({ x, z, i }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.5, 0.34, 0.34]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color="#10250f" roughness={0.8} />
      </RoundedBox>
      {/* book spine label */}
      <mesh position={[0, 0, 0.18]}>
        <planeGeometry args={[0.5, 0.34]} />
        <meshBasicMaterial color={PHOSPHOR} transparent opacity={0.5 + (i % 3) * 0.15} />
      </mesh>
    </group>
  )
}

function VaultShelf({ level }) {
  const books = useMemo(() => {
    const arr = []
    for (let i = 0; i < level.count; i++) {
      const row = Math.floor(i / 8)
      const col = i % 8
      arr.push([-3.5 + col * 1.0, 0, -2.2 + row * 0.75])
    }
    return arr
  }, [level.count])
  return (
    <group position={[0, level.y, 0]}>
      <RoundedBox args={[9.5, 0.16, 4.6]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#12210f" metalness={0.3} roughness={0.6} />
      </RoundedBox>
      {books.map((b, i) => <LogbookRow key={i} x={b[0]} z={b[2]} i={i} />)}
      <Html center distanceFactor={9} position={[0, 0.9, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ font: '10px ui-monospace, monospace', letterSpacing: '0.26em', color: PHOSPHOR, background: 'rgba(4,10,6,0.9)', border: '1px solid ' + PHOSPHOR, padding: '4px 10px', whiteSpace: 'nowrap' }}>
          [{level.era}] {level.label} · {level.count} LOGBOOKS
        </div>
      </Html>
    </group>
  )
}

function ArchiveScene({ progress }) {
  const { camera } = useThree()
  const p = useSpring(progress, { stiffness: 55, damping: 24 })
  const reduced = useReducedMotion()
  const targetY = useRef(new THREE.Vector3())
  const eye = useRef(new THREE.Vector3())
  useFrame(() => {
    const t = p.get()
    const y = 8.6 - t * 8.8 // descend from the top level to the bottom
    if (reduced) return
    targetY.current.set(0, y, 8.4)
    eye.current.set(0, y + 1.2, 0)
    camera.position.lerp(targetY.current, 0.08)
    camera.lookAt(eye.current)
  })
  const rail = useMemo(() => [[-5.2, 0, 0], [5.2, 0, 0]], [])
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 10, 6]} intensity={40} color={PHOSPHOR} />
      {/* left/right walls */}
      <Line points={[[-5.4, 10.5, -2.6], [-5.4, -1.2, -2.6]]} color={DIM} lineWidth={1} transparent opacity={0.5} />
      <Line points={[[5.4, 10.5, -2.6], [5.4, -1.2, -2.6]]} color={DIM} lineWidth={1} transparent opacity={0.5} />
      <Line points={[[-5.4, 10.5, 2.6], [-5.4, -1.2, 2.6]]} color={DIM} lineWidth={1} transparent opacity={0.5} />
      <Line points={[[5.4, 10.5, 2.6], [5.4, -1.2, 2.6]]} color={DIM} lineWidth={1} transparent opacity={0.5} />
      {LEVELS.map((l, i) => <VaultShelf key={i} level={l} />)}
      {/* floor */}
      <Line points={rail} color={PHOSPHOR} lineWidth={1} transparent opacity={0.4} />
      <fog attach="fog" args={['#050a06', 6, 20]} />
    </>
  )
}

const ERAS = [
  { era: '2000s', lines: ['[2002] boot.helpdesk — ARYA MOBILE', '[2009] sys.enterprise — LAJU KARUNIA', '[2013] dr.rehearsal — BACKUP OK'] },
  { era: '2010s', lines: ['[2014] mgr.it — DIPTA SAFARI JAYA', '[2018] net.uptime — 99.9%', '[2020] ops.project — PUPR x4'] },
  { era: '2020s', lines: ['[2024] soc.analyst — PROSPERA', '[2025] triage.wazuh — MTTR −45%', '[2026] web.admin — BPDLH · DOCKER'] },
]

function ArchivePage() {
  const { scrollYProgress } = useScroll()
  const progress = useTransform(scrollYProgress, [0, 0.7], [0, 1])
  return (
    <ConceptLayout
      num="08"
      name="ARCHIVE"
      tag="Syslog Time Capsule"
      theme={{ accent: PHOSPHOR, accent2: CREAM, bg: '#050a06', line: '#17331c', dim: '#7fa88a', faint: '#3f5c47' }}
      scene={<ArchiveScene progress={progress} />}
    >
      <section className="hero">
        <div className="kicker">Syslog archive — a time vault 2002 → 2026</div>
        <h1>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            ARCHIVE
          </motion.span>
        </h1>
        <p className="sub">
          Three decades of logs, three vault floors. Scroll — the camera descends past logbook shelves,
          from sysadmin roots to today's SOC & AI. All recorded, all archived.
        </p>
        <div className="actions">
          <a className="btn solid" href="#decades">DESCEND INTO THE VAULT ↓</a>
        </div>
        <div className="scroll-hint">▾ scroll — the camera descends past levels 2020s → 2000s</div>
      </section>

      <section id="decades" className="section" style={{ paddingTop: 30 }}>
        <div className="mono">// LOG DECADES</div>
        <h2>Three decades, three floors</h2>
        <p className="lede">Real log lines — retyped as each era enters the viewport.</p>
        {ERAS.map((e, i) => (
          <div key={i} style={{ marginBottom: 26 }}>
            <FadeUp delay={0.05}>
              <div style={{ font: '11px ui-monospace, monospace', letterSpacing: '0.2em', color: PHOSPHOR, marginBottom: 8 }}>
                // {e.era}
              </div>
            </FadeUp>
            {e.lines.map((l, j) => (
              <div key={j} className="readout" style={{ borderBottom: '1px dashed #17331c', padding: '5px 0' }}>
                <TypeLine text={l} speed={12} start={false} className="" />
              </div>
            ))}
          </div>
        ))}
      </section>

      <footer className="demo">
        <span className="mono-up">ARCHIVE · concept 08/10</span>
        <span>vault levels = career decades, logs = real evidence</span>
        <a href="#/">← back to gallery</a>
      </footer>
    </ConceptLayout>
  )
}

export default ArchivePage
