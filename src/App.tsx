import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import CinematicIntro from './components/CinematicIntro';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import Hero from './sections/Hero';
import Brain from './sections/Brain';
import Universe from './sections/Universe';
import Assistant from './sections/Assistant';
import Projects from './sections/Projects';
import MissionControl from './sections/MissionControl';
import Future from './sections/Future';
import Skills from './sections/Skills';
import About from './sections/About';
import Contact from './sections/Contact';
import Finale from './sections/Finale';
import { initGsap, gsap } from './lib/gsap-setup';
import { initLenis, destroyLenis } from './lib/smooth-scroll';
import { prefersReducedMotion } from './utils/device';
import './styles/globals.css';

/** Cinematic interstitial — the continuous scroll-story tissue between scenes. */
function Interstitial({ scene, text }: { scene: string; text: string }) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-6 py-6 text-center" aria-hidden="true">
      <div className="interstitial-line mx-auto h-16 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
      <p className="mono-font mt-4 text-[10px] tracking-[0.5em] text-cyan-300/50">{scene}</p>
      <p className="display-font mt-2 text-sm font-medium tracking-[0.2em] text-slate-500">{text}</p>
    </div>
  );
}

function NarrativeRail() {
  const [current, setCurrent] = useState('CORE');
  useEffect(() => {
    const ids = ['core', 'brain', 'universe', 'ask', 'projects', 'mission', 'future', 'skills', 'about', 'contact'];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id.toUpperCase());
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <div className="mono-font pointer-events-none fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-2 xl:flex" aria-hidden="true">
      <span className="text-[9px] tracking-[0.4em] text-cyan-300/60">{current}</span>
      <span className="block h-20 w-px bg-white/10"><span className="block w-px animate-pulse bg-cyan-300/70" style={{ height: '40%' }} /></span>
      <span className="text-[9px] tracking-[0.3em] text-slate-600">NV—11</span>
    </div>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const onDone = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    initGsap();
    const reduced = prefersReducedMotion();
    if (introDone && !reduced) initLenis(false);
    return () => destroyLenis();
  }, [introDone]);

  // cinematic scroll: gentle parallax + section fade choreography
  useEffect(() => {
    if (!introDone || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('section').forEach((sec) => {
        gsap.fromTo(sec, { opacity: 0.55 }, {
          opacity: 1, ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 35%', scrub: 1 },
        });
      });
    });
    return () => ctx.revert();
  }, [introDone]);

  // lock scroll during intro
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [introDone]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-[#030612] text-slate-100">
        <div className="sr-only" aria-live="polite" aria-atomic="true" id="announcer" />
        {!introDone && <CinematicIntro onDone={onDone} />}
        <Cursor />
        <Navigation ready={introDone} />
        <NarrativeRail />

        {/* persistent cinematic atmosphere */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #02040c 0%, #050b22 30%, #030612 60%, #0a0618 85%, #02040c 100%)' }} />
          <div className="tech-grid absolute inset-0 opacity-50" />
        </div>

        <main id="main" className="relative z-10">
          <Hero started={introDone} />
          <Interstitial scene="SCENE 03 — THE NETWORK WAKES" text="DARKNESS LEARNS TO CONNECT" />
          <ErrorBoundary label="Brain section"><Brain /></ErrorBoundary>
          <Interstitial scene="SCENE 05 — METAMORPHOSIS" text="THOUGHT BECOMES TOPOLOGY" />
          <ErrorBoundary label="Universe section"><Universe /></ErrorBoundary>
          <ErrorBoundary label="Assistant section"><Assistant /></ErrorBoundary>
          <ErrorBoundary label="Projects section"><Projects /></ErrorBoundary>
          <ErrorBoundary label="Mission control section"><MissionControl /></ErrorBoundary>
          <ErrorBoundary label="Future section"><Future /></ErrorBoundary>
          <ErrorBoundary label="Skills section"><Skills /></ErrorBoundary>
          <ErrorBoundary label="About section"><About /></ErrorBoundary>
          <ErrorBoundary label="Contact section"><Contact /></ErrorBoundary>
        </main>
        <div className="relative z-10">
          <Finale />
        </div>
      </div>
    </MotionConfig>
  );
}
