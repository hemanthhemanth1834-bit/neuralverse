import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'
import Magnetic from '../components/Magnetic.jsx'
import { IconLinkedIn, IconMail, IconPhone, IconPin, IconArrowUpRight } from '../components/icons.jsx'

const Scene3D = lazy(() => import('../components/Scene3D.jsx'))

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.21, 0.65, 0.25, 1] } }
}

function useCompact() {
  const [compact, setCompact] = useState(
    () => window.matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setCompact(mq.matches || navigator.hardwareConcurrency <= 4)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return compact
}

export default function Hero({ started }) {
  const compact = useCompact()
  const reduce = useReducedMotion()

  return (
    <section id="home" className="hero" aria-label="Introduction">
      {!reduce && (
        <Suspense fallback={null}>
          <Scene3D key={compact ? 'm' : 'd'} compact={compact} />
        </Suspense>
      )}

      <motion.div
        className="container hero-content"
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        animate={reduce || started ? 'show' : 'hidden'}
      >
        <motion.p className="eyebrow" variants={item} style={{ marginTop: '0.6rem' }}>
          AI / ML · Software · Technology
        </motion.p>

        <motion.h1 variants={item}>
          <span className="line">Muchakarla</span>
          <span className="line grad-text">Hemanth Kumar</span>
        </motion.h1>

        <motion.p className="hero-role" variants={item}>
          <b>{profile.role}</b> — Rajahmundry, India
        </motion.p>

        <motion.p className="hero-intro" variants={item}>
          {profile.headline}
        </motion.p>

        <motion.div className="hero-ctas" variants={item}>
          <Magnetic strength={0.25}>
            <a href="#work" className="btn btn-primary">
              View My Work <IconArrowUpRight width={16} height={16} />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <a href="#contact" className="btn btn-ghost">
              Contact Me
            </a>
          </Magnetic>
        </motion.div>

        <motion.div className="hero-socials" variants={item}>
          <a
            className="icon-btn"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`LinkedIn — ${profile.linkedinLabel}`}
          >
            <IconLinkedIn />
          </a>
          <a className="icon-btn" href={`mailto:${profile.email}`} aria-label={`Email — ${profile.email}`}>
            <IconMail />
          </a>
          <a className="icon-btn" href={`tel:${profile.phone.replace(/-/g, '')}`} aria-label={`Phone — ${profile.phone}`}>
            <IconPhone />
          </a>
          <span className="divider" aria-hidden="true" />
          <span className="hero-location">
            <IconPin width={13} height={13} /> {profile.location}
          </span>
        </motion.div>
      </motion.div>

      <button
        type="button"
        className="scroll-cue mono"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down to About section"
      >
        Scroll
        <span className="track" aria-hidden="true">
          <i />
        </span>
      </button>
    </section>
  )
}
