import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Loader from './components/Loader.jsx'
import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Background from './components/Background.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Journey from './sections/Journey.jsx'
import Work from './sections/Work.jsx'
import Certifications from './sections/Certifications.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="skip-link">
        Skip to content
      </a>

      {/* Live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" id="announcer" />

      <Loader onDone={onDone} />
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />

      <Background />

      <main id="top">
        <Hero started={ready} />
        <About />
        <Skills />
        <Journey />
        <Work />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  )
}
