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
 * r3f Canvas wrapper: static fallback when WebGL is unavailable,
 * dpr capped for performance. Every scene uses it.
 */
export default function SceneShell({ children, camera, ...props }) {
  if (!webglOK()) {
    return (
      <div className="no-webgl">
        WebGL is not available in this browser — the 3D prototype is skipped.
        <br />
        (The concept can still be explored through the content & motion below.)
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
