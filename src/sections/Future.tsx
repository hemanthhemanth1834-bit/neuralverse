import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import SceneCanvas from '../components/SceneCanvas';
import WebGLFallback from '../components/WebGLFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDevice } from '../hooks/useDevice';
import { Bot, Cloud, Eye, Boxes, Cpu, Sparkles, Orbit } from 'lucide-react';

const FutureScene = lazy(() => import('../scenes/FutureScene'));

const DOMAINS = [
  { icon: Cpu, label: 'AI', text: 'Foundation models that reason across text, code and tools.' },
  { icon: Bot, label: 'ROBOTICS', text: 'Embodied loops — perception fused with control.' },
  { icon: Orbit, label: 'AUTONOMOUS SYSTEMS', text: 'Agents that plan, verify and act with oversight.' },
  { icon: Sparkles, label: 'GENERATIVE AI', text: 'Diffusion and language models as creative instruments.' },
  { icon: Cloud, label: 'CLOUD', text: 'Elastic substrates for training and inference at scale.' },
  { icon: Eye, label: 'COMPUTER VISION', text: 'Machines that parse the visual world in real time.' },
  { icon: Boxes, label: 'SPATIAL COMPUTING', text: 'Interfaces dissolved into space itself.' },
];

export default function Future() {
  const { webgl, reducedMotion, tier } = useDevice();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const k = 1 - Math.min(Math.max((r.bottom - window.innerHeight * 0.4) / (r.height || 1), 0), 1);
      setProgress(k);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={ref} id="future" aria-label="Future technology" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SCENE 10 — FUTURE TECHNOLOGY"
          title={<>Fly through <span className="holo-text">tomorrow.</span></>}
          lede="Scroll pilots the camera through a ring tunnel of emerging disciplines. Each monolith is a field — glowing, humming, waiting."
        />
      </div>
      <div className="glass relative mx-auto h-[440px] max-w-7xl overflow-hidden rounded-3xl border border-white/10 sm:h-[560px] sm:mx-8 lg:mx-auto" data-cursor="EXPLORE">
        {webgl ? (
          <ErrorBoundary label="Future tunnel">
            <Suspense fallback={<div className="mono-font absolute inset-0 grid place-items-center text-xs tracking-[0.3em] text-slate-500">CALIBRATING TRAJECTORY…</div>}>
              <SceneCanvas bloom={tier !== 'low'} label="Flight through future technology tunnel">
                <FutureScene reducedMotion={reducedMotion} progress={progress} />
              </SceneCanvas>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-8"><WebGLFallback label="Future tunnel" /></div>
        )}
        <div className="mono-font pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-[10px] tracking-[0.35em] text-cyan-100">
          TRAJECTORY {Math.round(progress * 100)}%
        </div>
        <div className="absolute bottom-4 left-1/2 z-10 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-7xl gap-3 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {DOMAINS.map((d) => (
          <div key={d.label} className="glass group rounded-2xl p-5 transition hover:border-cyan-300/30">
            <d.icon className="h-3.5 w-3.5 text-cyan-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" aria-hidden="true" />
            <p className="mono-font mt-3 text-[11px] tracking-[0.3em] text-white">{d.label}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{d.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
