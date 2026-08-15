import { ALL } from './concepts'

function Gallery() {
  return (
    <div className="gallery">
      <div className="mast">
        <div className="mono">Design Lab · Portofolio Sigit Adi Irianto · 10 Konsep Futuristik</div>
        <h1>Sepuluh arah, satu orang: SecOps, Applied AI, 24 tahun operasi.</h1>
        <p className="sub">
          Prototipe interaktif berbasis <b>react-three-fiber + drei</b> (WebGL) dan <b>framer-motion</b> (UI).
          Setiap konsep punya satu "wajah gerak" — 3D centerpiece + bahasa transisi yang konsisten
          dengan karakter portofolio: radar, latent space, mission control, registry Docker, identitas
          holografik, orbit karier, forensik, vault log, ATC proyek, dan konsol yang bisa di-prompt.
        </p>
      </div>

      <div className="run-note">
        RUN: <code>cd design-lab && npm run dev</code> → buka http://localhost:5173 ·<br />
        Klik konsep mana pun untuk melihat prototipe 3D + motion-nya. Back ke sini lewat tombol ← GALERI.
        Semua konsep menghormati <code>prefers-reduced-motion</code> dan punya fallback tanpa WebGL.
      </div>

      {ALL.map((c, i) => (
        <a key={c.id} className="gcard" href={`#/concept/${c.id}`} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="top">
            <span className="n">KONSEP {c.id} / 10</span>
            <span className="open">BUKA PROTOTIPE →</span>
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
        Prototipe lab — bukan pengganti index.html produksi. Gate produksi (a11y/BP/SEO 100, perf, CSP) tetap berlaku saat konsep terpilih diimplementasikan.
      </div>
    </div>
  )
}

export default Gallery
