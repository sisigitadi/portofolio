import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp, ScanTitle } from '../components/ui'

const AQUA = '#67e8f9'
const GREEN = '#4ade80'
const AMBER = '#fbbf24'

const CONTAINERS = [
  { x: 0, y: 1.35, name: 'promptmatrix2', img: 'prompt-matrix:2.0.0', status: 'UP', layers: ['node:20-slim', 'next:build', 'runtime'], c: AQUA },
  { x: 1.4, y: 1.35, name: 'scops-command', img: 'scops:1.4.0', status: 'UP', layers: ['python:3.12', 'wazuh-agent', 'app'], c: GREEN },
  { x: -1.4, y: 1.35, name: 'smartexpense', img: 'expense-ml:latest', status: 'UP', layers: ['static', 'rules-engine'], c: AMBER },
  { x: 0, y: 0, name: 'arya-soc', img: 'arya:0.9.2', status: 'UP', layers: ['streamlit', 'wazuh-api'], c: AQUA },
  { x: 1.4, y: 0, name: 'kantinku-erp', img: 'kantinku:serverless', status: 'UP', layers: ['apps-script', 'wa-bot'], c: GREEN },
  { x: -1.4, y: 0, name: 'wazuh-stack', img: 'wazuh:4.11', status: 'UP', layers: ['manager', 'indexer', 'dashboard'], c: AMBER },
]

function Led({ color, phase = 0 }) {
  const m = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (!m.current || reduced) return
    m.current.material.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 2.2 + phase) * 0.45
  })
  return (
    <mesh ref={m} position={[0.62, 0.28, 0.041]}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  )
}

function ContainerUnit({ c, i }) {
  const [hover, setHover] = useState(false)
  const ref = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (ref.current && !reduced) {
      const t = clock.getElapsedTime() * 0.8 + i
      ref.current.position.y = c.y + Math.sin(t) * 0.03
    }
  })
  return (
    <group position={[c.x, c.y, 0]} ref={ref}>
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
        onPointerOut={() => setHover(false)}
      >
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <RoundedBox args={[1.15, 0.62, 0.9]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={hover ? '#12202b' : '#0d1a24'}
              emissive={c.c}
              emissiveIntensity={hover ? 0.35 : 0.12}
              metalness={0.4}
              roughness={0.5}
            />
          </RoundedBox>
        </Float>
        <Led color={c.c} phase={i} />
        {hover && (
          <Html center distanceFactor={11} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{ font: '10px ui-monospace, monospace', color: '#e8ecef', background: 'rgba(6,10,14,0.94)', border: '1px solid ' + c.c, padding: '8px 10px', whiteSpace: 'nowrap' }}>
              <div style={{ color: c.c, letterSpacing: '0.12em', marginBottom: 4 }}>{c.name}</div>
              {c.layers.map((l, j) => (
                <div key={j} style={{ color: '#9fb2c2', margin: '1px 0', paddingLeft: 10 }}>└─ {l}</div>
              ))}
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

function HarborScene() {
  const rack = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (rack.current && !reduced) rack.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.5
  })
  const rail = useMemoRail(1.6)
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 4, 5]} intensity={40} color={AQUA} />
      <group ref={rack} position={[0, 0, 0]}>
        {CONTAINERS.map((c, i) => <ContainerUnit key={i} c={c} i={i} />)}
        {/* racks & floor grid */}
        <Line points={rail} color={AQUA} lineWidth={1} transparent opacity={0.3} />
        <Line points={[[-2.6, 1.72, -1.2], [2.6, 1.72, -1.2]]} color={AQUA} lineWidth={1} transparent opacity={0.25} />
        <Line points={[[-2.6, 1.72, 1.2], [2.6, 1.72, 1.2]]} color={AQUA} lineWidth={1} transparent opacity={0.25} />
        <gridHelper args={[10, 14, '#123a4a', '#0d2530']} position={[0, -1.4, 0]} />
      </group>
    </>
  )
}

function useMemoRail(r) {
  return useMemo(() => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * Math.PI * 2
      pts.push([Math.cos(a) * r, -1.35, Math.sin(a) * r])
    }
    return pts
  }, [r])
}

const ROWS = [
  { id: 'a1f2', name: 'promptmatrix2', img: 'prompt-matrix:2.0.0', s: 'UP', ports: '0.0.0.0:3000', c: AQUA },
  { id: 'b7c3', name: 'scops-command', img: 'scops:1.4.0', s: 'UP', ports: '8443', c: GREEN },
  { id: 'c9e1', name: 'smartexpense', img: 'expense-ml:latest', s: 'UP', ports: 'static', c: AMBER },
  { id: 'd2a8', name: 'arya-soc', img: 'arya:0.9.2', s: 'UP', ports: '8501', c: AQUA },
  { id: 'e5f0', name: 'kantinku-erp', img: 'kantinku:serverless', s: 'UP', ports: 'wa-api', c: GREEN },
  { id: 'f8b4', name: 'wazuh-stack', img: 'wazuh:4.11', s: 'UP', ports: '55000', c: AMBER },
]

function HarborPage() {
  return (
    <ConceptLayout
      num="04"
      name="HARBOR"
      tag="Container Registry Twin"
      theme={{ accent: AQUA, accent2: GREEN, bg: '#070d12', line: '#12252f', dim: '#8fb3c4', faint: '#49606d' }}
      scene={<HarborScene />}
    >
      <section className="hero">
        <div className="kicker">Container registry — the digital twin of the infrastructure I manage</div>
        <ScanTitle>HARBOR</ScanTitle>
        <p className="sub">
          Each project = a container image on the production rack. Green LED = running. Hover a container to
          open its image layers — just like `docker inspect`, which I run every day on Ubuntu/WSL.
        </p>
        <div className="actions">
          <a className="btn solid" href="#ps">docker ps ↓</a>
          <a className="btn" href="https://github.com/sisigitadi/scops" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </div>
        <div className="scroll-hint">▾ scroll — the rack rotates, LEDs pulse</div>
      </section>

      <section id="ps" className="section" style={{ paddingTop: 20 }}>
        <div className="mono">// docker ps --format portofolio</div>
        <h2>The real working registry</h2>
        <p className="lede">Six images I build, deploy, and maintain. No placeholders — all of them link to production.</p>
        <div className="tile" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ font: '11px ui-monospace, monospace', padding: '10px 16px', borderBottom: '1px solid #12252f', color: '#8fb3c4', letterSpacing: '0.08em', display: 'grid', gridTemplateColumns: '70px 1fr 1fr 60px 120px', gap: 8 }}>
            <span>CONTAINER</span><span>IMAGE</span><span>NAME</span><span>STATUS</span><span>PORTS</span>
          </div>
          {ROWS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              style={{ font: '12px ui-monospace, monospace', padding: '10px 16px', borderBottom: i < ROWS.length - 1 ? '1px solid #12252f' : 'none', display: 'grid', gridTemplateColumns: '70px 1fr 1fr 60px 120px', gap: 8, alignItems: 'center' }}
            >
              <span style={{ color: '#49606d' }}>{r.id.slice(0, 4)}</span>
              <span style={{ color: r.c }}>{r.img}</span>
              <span>{r.name}</span>
              <span style={{ color: r.s === 'UP' ? GREEN : AMBER, display: 'flex', alignItems: 'center', gap: 5 }}>
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: r.s === 'UP' ? GREEN : AMBER, display: 'inline-block' }}
                />
                {r.s}
              </span>
              <span style={{ color: '#8fb3c4' }}>{r.ports}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">HARBOR · concept 04/10</span>
        <span>hover 3D container → inspect image layers</span>
        <a href="#/">← back to gallery</a>
      </footer>
    </ConceptLayout>
  )
}

export default HarborPage
