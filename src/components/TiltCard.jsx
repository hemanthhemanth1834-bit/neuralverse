import { useCallback, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const MAX_TILT = 7

/**
 * TiltCard — glass card with cursor-tracked 3D tilt, moving glare
 * highlight and animated gradient edge. Falls back to a plain card
 * on touch devices / reduced motion.
 */
export default function TiltCard({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const reduce = useReducedMotion()

  const onMove = useCallback(
    (e) => {
      if (reduce || !ref.current) return
      const el = ref.current
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * MAX_TILT}deg) rotateY(${
          (px - 0.5) * MAX_TILT
        }deg)`
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      })
    },
    [reduce]
  )

  const onLeave = useCallback(() => {
    if (!ref.current) return
    cancelAnimationFrame(frame.current)
    ref.current.style.transform = ''
  }, [])

  // On touch devices, skip tilt entirely
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  return (
    <Tag
      ref={ref}
      className={`glass-card ${className}`}
      onPointerMove={isTouch ? undefined : onMove}
      onPointerLeave={isTouch ? undefined : onLeave}
      {...rest}
    >
      {children}
      <span className="glare" aria-hidden="true" />
      <span className="edge" aria-hidden="true" />
    </Tag>
  )
}
