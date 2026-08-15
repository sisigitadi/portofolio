import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, PointMaterial, Points, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { FadeUp } from '../components/ui'

const CLUSTERS = [
  { c: new THREE.Color('#6ee7ff'), n: 900, label: 'PROMPT ENGINEERING', key: 'PromptMatrix 2.0' },
  { c: new THREE.Color('#a78bfa'), n: 700, label: 'SECURITY / SIEM', key: 'SCOPS · A.R.Y.A.' },
  { c: new THREE.Color('#34d399'), n: 700, label: 'PRIVACY / UU PDP', key: 'SmartExpenseML' },
  { c: new THREE.Color('#fbbf24'), n: 600, label: 'INFRA / OPS', key: 'Docker · Ubuntu' },
]

/* titik token dalam ruang embedding — 4 cluster di sekitar pusat */
function buildPoints() {
  const positions = []
  const colors = []
  CLUSTERS.forEach((cl, ci) => {
    const base = new THREE.Vector3(
      Math.cos((ci / CLUSTERS.length) * Math.PI * 2) * 3.4,
      (ci - CLUSTERS.length / 2) * 1.15,
      Math.sin((ci / CLUSTERS.length) * Math.PI * 2) * 3.4
    )
    for (let i = 0; i < cl.n; i++) {
      const v = base.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 1.7,
        (Math.random() - 0.5) * 1.3,
        (Math.random() - 0.5) * 1.7
      ))
      positions.push(v.x, v.y, v.z)
      const tint = cl.c.clone().multiplyScalar(0.55 + Math.random() * 0.45)
      colors.push(tint.r, tint.g, tint.b)
    }
  })
  return { positions: new Float32Array(positions), colors: new Float32Array(colors) }
}

const CAMERA_PATHS = [
  { pos: [0, 0, 9.5], look: [0, 0, 0] },
  { pos: [6.5, 2.2, 4.5], look: [0, -0.4, 0] },
  { pos: [-5.5, -1.8, 6], look: [0, 0.2, 0] },
  { pos: [0, 4.5, -4.5], look: [0, 0, 0] },
  { pos: [0, 0, 10], look: [0, 0, 0] },
]

function CameraRig({ progress }) {
  const { camera } = useThree()
  const reduced = useReducedMotion()
  const p = useSpring(progress, { stiffness: 60, damping: 20 })
  const target = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  useFrame(() => {
    const t = reduced ? 0 : p.get()
    const seg = t * (CAMERA_PATHS.length - 1)
    const i = Math.min(Math.floor(seg), CAMERA_PATHS.length - 2)
    const f = THREE.MathUtils.clamp(seg - i, 0, 1)
    const a = CAMERA_PATHS[i], b = CAMERA_PATHS[i + 1]
    target.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], f),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], f),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], f)
    )
    look.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], f),
      THREE.MathUtils.lerp(a.look[1], b.look[1], f),
      THREE.MathUtils.lerp(a.look[2], b.look[2], f)
    )
    camera.position.lerp(target.current, 0.05)
    camera.lookAt(look.current)
  })
  return null
}

function RotatingCloud() {
  const ref = useRef()
  const reduced = useReducedMotion()
  const data = useMemo(buildPoints, [])
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.05
  })
  return (
    <group ref={ref}>
      <Points positions={data.positions} colors={data.colors} stride={3} frustumCulled>
        <PointMaterial size={0.05} sizeAttenuation transparent depthWrite={false} vertexColors />
      </Points>
      {/* checkpoint proyek */}
      {CLUSTERS.map((cl, i) => {
        const a = (i / CLUSTERS.length) * Math.PI * 2
        const pos = [Math.cos(a) * 3.4, (i - CLUSTERS.length / 2) * 1.15, Math.sin(a) * 3.4]
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshBasicMaterial color={cl.c} />
            </mesh>
            <Html center distanceFactor={9} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
              <div style={{ font: '9px ui-monospace, monospace', letterSpacing: '0.12em', color: '#dfe8ef', background: 'rgba(6,8,12,0.8)', border: '1px solid ' + cl.c.getStyle(), padding: '3px 7px', whiteSpace: 'nowrap' }}>
                {cl.label}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function LatentScene({ progress }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <RotatingCloud />
      <Sparkles count={200} scale={12} size={2} speed={0.25} opacity={0.35} color="#8ecbff" />
      <CameraRig progress={progress} />
    </>
  )
}

function LatentPage() {
  const { scrollYProgress } = useScroll()
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const heading = ['L', 'A', 'T', 'E', 'N', 'T']
  return (
    <ConceptLayout
      num="02"
      name="LATENT"
      tag="Neural Weight-Space"
      theme={{ accent: '#6ee7ff', accent2: '#a78bfa', bg: '#070910', line: '#1d2433', dim: '#93a0b3', faint: '#4c5668' }}
      scene={<LatentScene progress={progress} />}
    >
      <section className="hero">
        <div className="kicker">Neural weight-space — terbang menembus embedding</div>
        <h1 style={{ display: 'flex', gap: '0.06em' }}>
          {heading.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Setiap titik = token dalam ruang embedding model yang saya uji & optimalkan
          (PromptMatrix, eval LLM, Ollama). Setiap cluster = proyek. Scroll untuk terbang.
        </motion.p>
        <div className="scroll-hint">▾ scroll — kamera menyusuri ruang laten</div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="mono">// DIMENSI KEAHLIAN</div>
        <h2>Empat cluster di ruang laten</h2>
        <p className="lede">Titik di layar dikelompokkan oleh warna — sama seperti pipeline yang saya bangun: prompt → keamanan → privasi → infrastruktur.</p>
        <div className="grid">
          {[
            { c: '#6ee7ff', t: 'Applied AI & Prompt', d: 'Uji multi-variabel, kontrol format output, eval sadar-keamanan.' },
            { c: '#a78bfa', t: 'SecOps & Threat', d: 'Wazuh triage, NIST IR playbooks, MTTA/MTTR baseline.' },
            { c: '#34d399', t: 'Privacy-First', d: 'BYOK, 100% client-side, kepatuhan UU PDP.' },
            { c: '#fbbf24', t: 'Infra & Ops', d: 'Linux/Docker, SQL pipeline, tim 50+ orang.' },
          ].map((d, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="tile" style={{ borderTop: '3px solid ' + d.c }}>
                <span className="meta" style={{ color: d.c }}>CLUSTER 0{i + 1}</span>
                <h3>{d.t}</h3>
                <p>{d.d}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">LATENT · konsep 02/10</span>
        <span>scroll menggerakkan kamera — 4 cluster warna = 4 domain</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default LatentPage
