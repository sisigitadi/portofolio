import { Canvas } from '@react-three/fiber'

function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/**
 * Wrapper r3f Canvas: fallback statis kalau WebGL tidak tersedia,
 * dpr dibatasi untuk performa. Semua scene memakainya.
 */
export default function SceneShell({ children, camera, ...props }) {
  if (!webglOK()) {
    return (
      <div className="no-webgl">
        WebGL tidak tersedia di browser ini — prototipe 3D dilewati.
        <br />
        (Konsep tetap bisa dilihat dari konten & motion di bawah.)
      </div>
    )
  }
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={camera || { fov: 45, position: [0, 0, 8], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      {...props}
    >
      {children}
    </Canvas>
  )
}
