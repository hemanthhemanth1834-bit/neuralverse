import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const PHASES = ['INITIALIZING', 'COMPILING EXPERIENCE', 'LINKING SKILL GRAPHS', 'RENDERING']

/**
 * Premium loader — animated MHK monogram inside counter-rotating
 * hexagons, progress bar and phase readout. Resolves quickly
 * (~1.2s) and lifts away to reveal the hero.
 */
export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)
  const reduce = useReducedMotion()
  const doneRef = useRef(false)

  useEffect(() => {
    let raf
    let p = 0
    if (reduce) {
      setProgress(100)
      onDone?.()
      setGone(true)
      return undefined
    }
    const step = () => {
      p += Math.max(1.4, (100 - p) * 0.055) + Math.random() * 2.2
      if (p >= 100) {
        setProgress(100)
        setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true
            onDone?.()
          }
          setGone(true)
        }, 260)
        return
      }
      setProgress(p)
      raf = requestAnimationFrame(step)
    }
    const start = setTimeout(() => {
      raf = requestAnimationFrame(step)
    }, 300)
    return () => {
      clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [onDone, reduce])

  const phase = PHASES[Math.min(Math.floor((progress / 100) * PHASES.length), PHASES.length - 1)]

  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
      animate={gone ? { y: '-100%', opacity: 0.4 } : { y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.65, ease: [0.76, 0, 0.24, 1] }}
      style={gone ? { pointerEvents: 'none' } : undefined}
      onAnimationComplete={() => gone && document.querySelector('.loader')?.remove()}
    >
      <div className="loader-inner">
        <div className="loader-mark" aria-hidden="true">
          <svg viewBox="0 0 108 118" fill="none">
            <polygon
              className="hex-outer"
              points="54,6 98,31 98,87 54,112 10,87 10,31"
              stroke="#38bdf8"
              strokeWidth="1.4"
              strokeDasharray="6 5"
              opacity="0.85"
            />
            <polygon
              className="hex-inner"
              points="54,26 81,41 81,77 54,92 27,77 27,41"
              stroke="#a78bfa"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
          <span className="loader-initials">MHK</span>
        </div>
        <p className="loader-name">Muchakarla Hemanth Kumar</p>
        <div className="loader-bar" role="progressbar" aria-valuenow={Math.floor(progress)} aria-valuemin="0" aria-valuemax="100" aria-label="Loading progress">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-meta">
          <span>{phase}</span>
          <span aria-hidden="true">{String(Math.floor(progress)).padStart(3, '0')}%</span>
        </div>
      </div>
    </motion.div>
  )
}
