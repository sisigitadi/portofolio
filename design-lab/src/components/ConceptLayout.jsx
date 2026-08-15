import { Link } from './Link'
import SceneShell from './SceneShell'

/**
 * Kerangka halaman konsep:
 *  - Scene dibungkus SceneShell (Canvas + fallback WebGL), fixed di belakang (z-0)
 *  - Konten scroll di atasnya (z-5)
 *  - Topbar fixed (z-60)
 * CSS vars (--c-accent, --c-bg, ...) di-set per konsep lewat props.theme.
 */
export default function ConceptLayout({ num, name, tag, status = 'PROTOTYPE', theme, scene, children }) {
  const vars = {
    '--c-accent': theme.accent,
    '--c-accent2': theme.accent2 || theme.accent,
    '--c-bg': theme.bg,
    '--c-text': theme.text || '#e8ecef',
    '--c-dim': theme.dim || '#8a939c',
    '--c-faint': theme.faint || '#545d66',
    '--c-line': theme.line || '#2a3138',
  }
  return (
    <div className="concept-page" style={vars}>
      <div className="concept-canvas">
        <SceneShell camera={{ fov: 45, position: [0, 0, 8], near: 0.1, far: 200 }}>{scene}</SceneShell>
      </div>
      <div className="topbar">
        <Link href="#/" className="back">← GALERI</Link>
        <span className="id">KONSEP <b>{num}</b> — {name}</span>
        <span className="status"><span className="dot" /> {status}</span>
      </div>
      <div className="concept-scroll">{children}</div>
    </div>
  )
}
