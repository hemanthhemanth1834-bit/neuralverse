import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor — precise dot plus a lagging ring that expands over
 * interactive elements and shows an optional label via
 * `data-cursor-label`. Only mounts on fine pointers with motion
 * allowed; the native cursor stays available for form fields.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-on')

    const pos = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let raf = 0
    let visible = false

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
      if (!visible) {
        visible = true
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
    }

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    const onOver = (e) => {
      const t = e.target
      const labelled = t.closest?.('[data-cursor-label]')
      const interactive = t.closest?.('a, button, [role="button"], input, textarea, label')
      if (ringRef.current) {
        ringRef.current.classList.toggle('has-label', Boolean(labelled))
        ringRef.current.classList.toggle('is-hover', Boolean(interactive) && !labelled)
        const labelEl = ringRef.current.querySelector('.cursor-label')
        if (labelEl && labelled) labelEl.textContent = labelled.getAttribute('data-cursor-label')
      }
    }

    const onLeaveWindow = () => {
      visible = false
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (dotRef.current) dotRef.current.style.opacity = '0'
    }

    const onEnterWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    document.documentElement.addEventListener('pointerenter', onEnterWindow)
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('custom-cursor-on')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      document.documentElement.removeEventListener('pointerenter', onEnterWindow)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true">
        <span className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  )
}
