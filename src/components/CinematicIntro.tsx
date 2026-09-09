import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../lib/gsap-setup';
import { prefersReducedMotion } from '../utils/device';

interface Props {
  onDone: () => void;
}

/**
 * Cinematic intro — 9-beat sequence:
 * darkness → particles → motion → links → network → dolly → logo → tagline → activation.
 * Pure 2D canvas for cheap, reliable boot even on low GPUs.
 */
export default function CinematicIntro({ onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('DARKNESS');
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    const root = rootRef.current;
    if (root) {
      gsap.to(root, {
        opacity: 0,
        scale: 1.06,
        filter: 'blur(12px)',
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: onDone,
      });
    } else {
      onDone();
    }
  }, [onDone]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let raf = 0;
    let start = performance.now();
    const DURATION = reduced ? 1200 : 6800;

    interface P { x: number; y: number; vx: number; vy: number; r: number; }
    const N = reduced ? 40 : 130;
    const parts: P[] = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0009,
      vy: (Math.random() - 0.5) * 0.0009,
      r: 0.8 + Math.random() * 1.8,
    }));

    const resize = () => {
      if (!canvas) return;
      canvas.width = Math.min(window.innerWidth, 1600);
      canvas.height = Math.min(window.innerHeight, 1000);
    };
    resize();
    window.addEventListener('resize', resize);

    const phases = ['DARKNESS', 'PARTICLES', 'CONNECTION', 'NEURAL NET', 'APPROACH', 'AWAKENING', 'ACTIVATION'];

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round(t * 100));
      setPhase(phases[Math.min(Math.floor(t * phases.length), phases.length - 1)]);
      if (ctx && canvas) {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        // vignette drift
        const zoom = 1 + t * 0.22;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);
        const alpha = Math.min(1, t * 3);
        // links fade in during phase 2+
        const linkAlpha = Math.max(0, Math.min(1, (t - 0.28) * 2.4)) * 0.5;
        ctx.lineWidth = 0.7;
        for (let i = 0; i < parts.length; i++) {
          const a = parts[i];
          const speed = 0.3 + t * 1.4;
          a.x += a.vx * speed * 16;
          a.y += a.vy * speed * 16;
          if (a.x < 0) a.x = 1; if (a.x > 1) a.x = 0;
          if (a.y < 0) a.y = 1; if (a.y > 1) a.y = 0;
          for (let j = i + 1; j < parts.length; j++) {
            const b = parts[j];
            const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
            const d = Math.hypot(dx, dy);
            if (d < 130 && linkAlpha > 0.01) {
              ctx.strokeStyle = `rgba(56,189,248,${(1 - d / 130) * linkAlpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x * W, a.y * H);
              ctx.lineTo(b.x * W, b.y * H);
              ctx.stroke();
            }
          }
        }
        for (const p of parts) {
          const pulse = 0.6 + 0.4 * Math.sin(now * 0.004 + p.x * 20);
          ctx.fillStyle = `rgba(140,220,255,${alpha * pulse})`;
          ctx.beginPath();
          ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 350);
      }
    };
    raf = requestAnimationFrame(tick);

    // GSAP text choreography
    const q = gsap.utils.selector(rootRef);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(q('.intro-logo'), { opacity: 0, scale: 0.92, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: reduced ? 0.3 : 1.6, delay: reduced ? 0.1 : 2.6 })
      .fromTo(q('.intro-line'), { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0.2 : 1.1, stagger: 0.12 }, '-=1.0')
      .fromTo(q('.intro-meta'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter') finish(); };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      tl.kill();
    };
  }, [finish]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Neuralverse cinematic intro"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02040c]"
      style={{ opacity: exiting ? 0 : 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="tech-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(14,60,120,.35), transparent 70%)' }} aria-hidden="true" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center">
        <p className="intro-meta mono-font text-[11px] tracking-[0.5em] text-cyan-300/70">NEURAL SYSTEMS // BOOT SEQUENCE</p>
        <h1 className="intro-logo display-font mt-5 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          NEURAL<span className="holo-text">VERSE</span>
        </h1>
        <div className="mt-5 space-y-1 overflow-hidden">
          <span className="reveal-mask"><span className="intro-line display-font text-sm tracking-[0.3em] text-slate-300 sm:text-base">WHERE INTELLIGENCE BECOMES AN EXPERIENCE.</span></span>
        </div>
        <div className="intro-meta mt-8 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          <p className="mono-font text-[11px] tracking-[0.35em] text-slate-400">INITIALIZING NEURAL CORE… {progress}%</p>
        </div>
        <div className="intro-meta mt-4 h-[3px] w-56 overflow-hidden rounded-full bg-white/10 sm:w-72" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Loading progress">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="intro-meta mono-font mt-3 text-[10px] tracking-[0.3em] text-slate-500">PHASE: {phase}</p>
        <button
          onClick={finish}
          className="intro-meta mono-font mt-8 rounded-full border border-white/15 px-6 py-2 text-[11px] tracking-[0.3em] text-slate-300 transition hover:border-cyan-300/50 hover:text-white"
        >
          SKIP INTRO →
        </button>
      </div>
    </div>
  );
}
