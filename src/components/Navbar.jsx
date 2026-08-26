import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Magnetic from './Magnetic.jsx'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Work' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' }
]

function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <g className="logo-hex">
        <polygon
          points="16,2.5 28,9.25 28,22.75 16,29.5 4,22.75 4,9.25"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="1.7"
        />
        <circle cx="16" cy="16" r="3.6" fill="url(#logo-g)" opacity="0.9" />
      </g>
    </svg>
  )
}

export default function Navbar({ ready }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')
  const burgerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!sections.length) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-38% 0px -55% 0px' }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [ready])

  // Mobile menu open/close + body lock + focus management
  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open')
      // Focus first link in mobile menu after animation
      const timer = setTimeout(() => {
        const firstLink = menuRef.current?.querySelector('a')
        firstLink?.focus()
      }, 80)
      return () => clearTimeout(timer)
    }
    document.body.classList.remove('menu-open')
  }, [open])

  // Focus trap inside mobile menu
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        burgerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = menuRef.current?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('mhk-theme', next)
    } catch {
      /* storage unavailable */
    }
  }

  const goTo = useCallback(
    (id) => (e) => {
      e.preventDefault()
      setOpen(false)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    },
    []
  )

  return (
    <>
      <motion.header
        className={`navbar${scrolled ? ' is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.21, 0.65, 0.25, 1], delay: 0.15 }}
      >
        <nav className="nav-shell" aria-label="Primary">
          <a href="#home" className="nav-logo" onClick={goTo('home')} aria-label="Hemanth Kumar — home">
            <Logo />
            <span>
              MHK<span style={{ color: 'var(--accent-primary)' }}>.</span>
            </span>
          </a>

          <ul className="nav-links" role="list">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={active === l.id ? 'active' : ''} onClick={goTo(l.id)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle theme"
            >
              <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
              </svg>
            </button>

            <Magnetic className="nav-cta-desktop" strength={0.25}>
              <a href="#contact" className="btn btn-primary btn-sm" onClick={goTo('contact')}>
                Let&apos;s Talk
              </a>
            </Magnetic>

            <button
              ref={burgerRef}
              type="button"
              className="nav-burger"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setOpen(false)
                burgerRef.current?.focus()
              }}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              ref={menuRef}
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  className={active === l.id ? 'active' : ''}
                  onClick={goTo(l.id)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <p className="mm-meta">Rajahmundry · India — AI/ML Engineering</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
