import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import ConceptLayout from '../components/ConceptLayout'
import { DecryptText, FadeUp, Stagger, item } from '../components/ui'

const GOLD = '#e8c87a'
const CYAN = '#7dd3fc'
const INK = '#eef2f5'

function IdCard({ progress }) {
  const group = useRef()
  const scan = useRef()
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (scan.current) {
      const y = reduced ? 0 : ((t * 0.5) % 2.2) - 1.1
      scan.current.position.y = y
    }
    if (group.current) {
      const target = hover ? 0 : reduced ? 0 : Math.sin(t * 0.6) * 0.18
      group.current.rotation.y += (target - group.current.rotation.y) * 0.05
    }
  })
  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.5}>
        <group ref={group} position={[0, 0.15, 0]}>
          {/* kartu holografik */}
          <RoundedBox args={[2.4, 1.5, 0.07]} radius={0.05} smoothness={4}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
            onPointerOut={() => setHover(false)}>
            <meshStandardMaterial
              color={hover ? '#12222e' : '#0b1a26'}
              emissive={CYAN}
              emissiveIntensity={hover ? 0.3 : 0.14}
              metalness={0.6}
              roughness={0.35}
              transparent
              opacity={0.92}
            />
          </RoundedBox>
          {/* tepi wireframe */}
          <mesh>
            <boxGeometry args={[2.44, 1.54, 0.09]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.35} />
          </mesh>
          {/* garis scan */}
          <mesh ref={scan} position={[0, 0, 0.08]}>
            <planeGeometry args={[2.28, 0.05]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.85} />
          </mesh>
          <pointLight position={[0, 1.6, 1.4]} intensity={8} color={CYAN} />
        </group>
      </Float>
      <Sparkles count={70} scale={[5, 3.5, 3]} size={1.8} speed={0.5} opacity={0.5} color={GOLD} />
    </group>
  )
}

const FIELDS = [
  { k: 'NAME', v: 'SIGIT ADI IRIANTO', delay: 0.4 },
  { k: 'ROLE', v: 'IT & SECOPS | APPLIED AI', delay: 0.9 },
  { k: 'LOCATION', v: 'TANGERANG · UTC+7 · REMOTE', delay: 1.4 },
  { k: 'VERIFIED', v: '20+ YEARS · WCAG · CSP', delay: 1.9 },
  { k: 'STATUS', v: 'OPEN FOR REMOTE ROLES', delay: 2.4 },
]

const CERTS = [
  'SOC ANALYST · CYBER ACADEMY', 'DEVSEOPS · KELAS.WORK', 'AZURE AI-900', 'BSSN CYBER EX #9', 'PENTEST PRO · CYBRARY', 'ETHICAL HACKING · LI',
]

function VerifyPage() {
  return (
    <ConceptLayout
      num="05"
      name="VERIFY"
      tag="Holographic Identity Vault"
      theme={{ accent: GOLD, accent2: CYAN, bg: '#0a0d11', line: '#26292e', dim: '#9aa3ad', faint: '#565e67' }}
      scene={<IdCard />}
    >
      <section className="hero">
        <div className="kicker">Holographic identity vault — kredensial yang bisa diverifikasi</div>
        <h1 style={{ fontSize: 'clamp(30px, 5.6vw, 60px)' }}>
          <DecryptText text="HUMAN.FILE — SIGIT ADI IRIANTO" />
        </h1>
        <Stagger className="sub" gap={0.2}>
          <motion.p variants={item}>
            BYOK, UU PDP, 100% client-side — privasi bukan hiasan di portofolio ini, tapi arsitekturnya.
            Kartu di layar dipindai ulang terus-menerus: bukti verifikasi setiap detik.
          </motion.p>
          <motion.div variants={item} className="actions">
            <a className="btn solid" href="#fields">BUKA FILE ↓</a>
            <a className="btn" href="mailto:si.sigitadi@gmail.com">si.sigitadi@gmail.com ↗</a>
          </motion.div>
        </Stagger>
        <div className="scroll-hint">▾ scroll — field file di-dekripsi satu per satu</div>
      </section>

      <section id="fields" className="section" style={{ paddingTop: 20 }}>
        <div className="mono">// FIELD VERIFIED</div>
        <h2>Data pribadi, ditampilkan dengan kontrol</h2>
        <p className="lede">Seperti onboarding kartu akses: setiap field terbuka berurutan, dan hanya data yang perlu ditampilkan.</p>
        <div style={{ maxWidth: 620 }}>
          {FIELDS.map((f, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="readout">
                <span style={{ color: GOLD, letterSpacing: '0.14em' }}>{f.k}</span>
                <b style={{ marginLeft: 'auto', color: '#e8ecef' }}>
                  <DecryptText text={f.v} delay={f.delay} start={false} />
                </b>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="mono">// SEALS & STAMPS</div>
        <h2>Sertifikasi terverifikasi</h2>
        <div className="grid">
          {CERTS.map((c, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="tile" style={{ textAlign: 'center', padding: '20px 12px' }}>
                <motion.div
                  initial={{ scale: 1.8, opacity: 0, rotate: -14 }}
                  whileInView={{ scale: 1, opacity: 1, rotate: -5 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: i * 0.06 }}
                  style={{
                    width: 74, height: 74, margin: '0 auto 12px', borderRadius: '50%',
                    border: '2px solid ' + GOLD, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    font: '10px ui-monospace, monospace', letterSpacing: '0.12em', textAlign: 'center', lineHeight: 1.3,
                  }}
                >
                  VERIFIED
                </motion.div>
                <h3 style={{ fontSize: 13, textAlign: 'center' }}>{c}</h3>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="demo">
        <span className="mono-up">VERIFY · konsep 05/10</span>
        <span>kartu holo dipindai terus · stamp VERIFIED pada tiap sertifikat</span>
        <a href="#/">← kembali ke galeri</a>
      </footer>
    </ConceptLayout>
  )
}

export default VerifyPage
