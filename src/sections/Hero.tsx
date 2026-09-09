import { Suspense, lazy, useEffect, useRef } from 'react';
import { gsap, initGsap } from '../lib/gsap-setup';
import { scrollToTarget } from '../lib/smooth-scroll';
import { useDevice } from '../hooks/useDevice';
import SceneCanvas from '../components/SceneCanvas';
import WebGLFallback from '../components/WebGLFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import MagneticButton from '../components/MagneticButton';
import { ChevronDown, Radio } from 'lucide-react';
import { prefersReducedMotion } from '../utils/device';

const NeuralCore = lazy(() => import('../scenes/NeuralCore'));

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { tier, webgl, reducedMotion } = useDevice();

  useEffect(() => {
    initGsap();
    if (!started) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.hero-line'), { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.15,
      });
      gsap.fromTo(el.querySelectorAll('.hero-fade'), { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.6,
      });
      if (!prefersReducedMotion()) {
        gsap.to(el.querySelector('.hero-scroll-hint'), { y: 8, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut' });
      }
    }, el);
    return () => ctx.revert();
  }, [started]);

  return (
    <section ref={ref} id="core" aria-label="Neural core hero" className="scanlines relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* 3D */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="tech-grid absolute inset-0" />
        {webgl ? (
          <ErrorBoundary label="Neural core">
            <Suspense fallback={null}>
              <SceneCanvas bloom={tier !== 'low'} label="Interactive neural network core">
                <NeuralCore tier={tier} reducedMotion={reducedMotion} />
              </SceneCanvas>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <div className="absolute inset-0 grid place-items-center"><WebGLFallback label="Neural core" /></div>
        )}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 45%, transparent 40%, #030612 88%)' }} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-28 text-center">
        <p className="hero-fade mono-font inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/5 px-4 py-1.5 text-[10px] tracking-[0.4em] text-cyan-200/90">
          <Radio className="h-2.5 w-2.5 animate-pulse" aria-hidden="true" /> SCENE 02 — NEURAL PARTICLES
        </p>
        <h1 className="display-font mt-6 text-[13vw] font-bold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
          <span className="reveal-mask"><span className="hero-line">ENTER THE</span></span>
          <span className="reveal-mask"><span className="hero-line holo-text">NEURAL CORE</span></span>
        </h1>
        <p className="hero-fade mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-slate-300/90 sm:text-lg">
          You are inside an artificial intelligence system. Thousands of neurons fire around you —
          move, and the network notices.
        </p>
        <div className="hero-fade mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticButton strength={0.35}>
            <button
              onClick={() => scrollToTarget('#brain')}
              data-cursor="ENTER"
              className="glow-border group rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-9 py-4 text-[12px] font-bold tracking-[0.3em] text-[#02040c] transition hover:brightness-110"
            >
              ENTER THE NEURAL CORE
            </button>
          </MagneticButton>
          <button onClick={() => scrollToTarget('#ask')} data-cursor="OPEN" className="mono-font rounded-full border border-white/15 px-7 py-3.5 text-[11px] tracking-[0.3em] text-slate-300 transition hover:border-cyan-300/50 hover:text-white">
            ASK THE CORE
          </button>
        </div>
        <div className="hero-fade mono-font mt-10 flex items-center gap-6 text-[10px] tracking-[0.3em] text-slate-500">
          <span>1,284 NODES</span><span className="h-1 w-1 rounded-full bg-cyan-400/60" /><span>24.8 TB/S</span><span className="h-1 w-1 rounded-full bg-cyan-400/60" /><span>ONLINE</span>
        </div>
      </div>

      <button
        onClick={() => scrollToTarget('#brain')}
        className="hero-scroll-hint hero-fade absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-slate-500 transition hover:text-cyan-200"
        aria-label="Scroll to AI brain"
      >
        <span className="mono-font text-[10px] tracking-[0.4em]">DESCEND</span>
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>
    </section>
  );
}
