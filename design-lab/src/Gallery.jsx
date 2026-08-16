import { ALL } from './concepts'

function Gallery() {
  return (
    <div className="gallery">
      <div className="mast">
        <div className="mono">Design Lab · Sigit Adi Irianto Portfolio · 10 Futuristic Concepts</div>
        <h1>Ten directions, one person: SecOps, Applied AI, 24 years of operations.</h1>
        <p className="sub">
          Interactive prototypes built with <b>react-three-fiber + drei</b> (WebGL) and <b>framer-motion</b> (UI).
          Each concept has one "signature motion" — a 3D centerpiece + a transition language consistent
          with the portfolio's character: radar, latent space, mission control, Docker registry, holographic
          identity, career orbit, forensics, vault log, project ATC, and a promptable console.
        </p>
      </div>

      <div className="run-note">
        RUN: <code>cd design-lab && npm run dev</code> → open http://localhost:5173 ·<br />
        Click any concept to see its 3D prototype + motion. Get back here via the ← GALLERY button.
        All concepts respect <code>prefers-reduced-motion</code> and have a no-WebGL fallback.
      </div>

      {ALL.map((c, i) => (
        <a key={c.id} className="gcard" href={`#/concept/${c.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="top">
            <span className="n">CONCEPT {c.id} / 10</span>
            <span className="open">OPEN PROTOTYPE →</span>
          </div>
          <h2>{c.name} <span style={{ color: '#7fb3d9', fontSize: 14 }}>— {c.tag}</span></h2>
          <p className="why">{c.why}</p>
          <div>
            {c.swatches.map((s, j) => (
              <span key={j} className="swatch" style={{ background: s }} title={s} />
            ))}
            {c.tags.map((t, j) => (
              <span key={j} className="tag">{t}</span>
            ))}
          </div>
        </a>
      ))}

      <div className="foot" style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid var(--lab-line)', font: '12px var(--mono)', color: 'var(--lab-dim)' }}>
        Lab prototype — not a replacement for the production index.html. The production gate (a11y/BP/SEO 100, perf, CSP) still applies once the chosen concept is implemented.
      </div>
    </div>
  )
}

export default Gallery
