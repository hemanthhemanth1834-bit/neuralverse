import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Magnetic — wraps a single child and gently pulls it toward the
 * cursor while hovered. Disabled on touch devices and when the
 * user prefers reduced motion.
 */
export default function Magnetic({ children, strength = 0.32, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })

  const disabled =
    reduce ||
    typeof window === 'undefined' ||
    !window.matchMedia('(pointer: fine)').matches

  const onMove = (e) => {
    if (disabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (disabled) {
    return (
      <span className={className} style={{ display: 'inline-flex' }}>
        {children}
      </span>
    )
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  )
}
