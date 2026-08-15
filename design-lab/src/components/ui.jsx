import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useReducedMotion } from 'framer-motion'

/* ---------- muncul dengan fade + naik saat masuk viewport ---------- */
export function FadeUp({ children, delay = 0, y = 24, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- teks diketik per karakter ---------- */
export function TypeLine({ text, speed = 22, start = true, className = '', cursor = '▊' }) {
  const [n, setN] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!start || reduced) { setN(text.length); return }
    let i = 0
    const t = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text, speed, start, reduced])
  return (
    <span className={className}>
      {text.slice(0, n)}
      <span className="caret">{n < text.length ? cursor : ''}</span>
    </span>
  )
}

/* ---------- angka count-up saat terlihat ---------- */
export function CountUp({ to, prefix = '', suffix = '', duration = 1.4, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!inView) return
    if (reduced) { setVal(to); return }
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to, duration, reduced])
  return (
    <b ref={ref} className={className}>
      {prefix}{val}{suffix}
    </b>
  )
}

/* ---------- judul masuk dengan sapuan scan (clip-path) ---------- */
export function ScanTitle({ children, delay = 0, className = '' }) {
  return (
    <motion.h1
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }}
      animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h1>
  )
}

/* ---------- anak-anak muncul berurutan (stagger) ---------- */
export function Stagger({ children, delay = 0, gap = 0.12, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/* ---------- huruf "di-dekripsi" satu per satu (konsep VERIFY) ---------- */
export function DecryptText({ text, speed = 30, start = true, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)
  const reduced = useReducedMotion()
  const go = start || inView
  useEffect(() => {
    if (!go || reduced) { setN(text.length); return }
    let i = 0
    let timeout
    const timer = setTimeout(() => {
      const t = setInterval(() => {
        i += 1
        setN(i)
        if (i >= text.length) clearInterval(t)
      }, speed)
      timeout = t
    }, delay)
    return () => { clearTimeout(timer); clearInterval(timeout) }
  }, [text, speed, go, reduced, delay])
  return (
    <span ref={ref} className={className}>
      {text.slice(0, n).split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15, filter: 'blur(2px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.25 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}
