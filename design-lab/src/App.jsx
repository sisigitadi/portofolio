import { useEffect, useState } from 'react'
import Gallery from './Gallery'
import * as Concepts from './concepts'

function parseHash() {
  const m = window.location.hash.match(/^#\/concept\/(\d{1,2})\/?$/)
  return m ? m[1] : null
}

export default function App() {
  const [active, setActive] = useState(parseHash())

  useEffect(() => {
    const onHash = () => setActive(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Comp = active && Concepts[`Concept${active}`]
  if (!Comp) return <Gallery />
  return <Comp key={active} />
}
