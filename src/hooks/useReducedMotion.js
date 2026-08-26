import { useEffect, useState } from 'react'

const MEDIA = '(prefers-reduced-motion: reduce)'

/** Tiny SSR-safe subscription to prefers-reduced-motion. */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MEDIA).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(MEDIA)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
