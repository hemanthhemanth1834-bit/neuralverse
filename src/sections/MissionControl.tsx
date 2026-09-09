import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { Activity, Cpu, Database, Bot, Network, Gauge } from 'lucide-react';

function useAnimatedNumber(target: number, duration = 1600, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setVal(target); return; }
    let start: number | null = null;
    let visible = false;
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    const tick = (t: number) => {
      if (start === null) start = t;
      const k = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(parseFloat((target * eased).toFixed(decimals)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    const iv = window.setInterval(() => { if (visible && start === null) { start = performance.now(); raf = requestAnimationFrame(tick); } }, 300);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); obs.disconnect(); };
  }, [target, duration, decimals]);
  return { val, ref };
}

function Sparkline({ color = '#22d3ee', seed = 1 }: { color?: string; seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const data = Array.from({ length: 60 }, (_, i) => 0.5 + 0.4 * Math.sin(i * 0.3 + seed) + Math.random() * 0.2);
    let offset = 0;
    const draw = () => {
      const W = (c.width = c.offsetWidth * 2), H = (c.height = 64);
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v + Math.sin(offset * 0.05 + i * 0.2) * 0.08) * H * 0.85 + 4);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      if (!reduced) { offset++; raf = requestAnimationFrame(draw); }
    };
    draw();
    // live drift
    const iv = window.setInterval(() => {
      data.shift();
      data.push(0.4 + Math.random() * 0.5);
      if (reduced) draw();
    }, 900);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, [color, seed]);
  return <canvas ref={ref} className="h-8 w-full" aria-hidden="true" />;
}

function MetricCard({ icon: Icon, label, value, suffix, color, seed, bars }: { icon: typeof Cpu; label: string; value: string; suffix?: string; color: string; seed: number; bars?: boolean }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="mono-font text-[10px] tracking-[0.3em] text-slate-400">{label}</p>
        <Icon className="h-3 w-3" style={{ color }} aria-hidden="true" />
      </div>
      <p className="display-font mt-2 text-3xl font-bold text-white">
        {value}{suffix && <span className="ml-1 text-sm font-medium" style={{ color }}>{suffix}</span>}
      </p>
      {bars ? (
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="h-5 w-full rounded-sm" style={{ background: i < 11 ? color : 'rgba(255,255,255,.08)', opacity: i < 11 ? 0.9 - i * 0.03 : 1 }} />
          ))}
        </div>
      ) : (
        <div className="mt-2"><Sparkline color={color} seed={seed} /></div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} aria-hidden="true" />
    </div>
  );
}

export default function MissionControl() {
  const proc = useAnimatedNumber(87, 1800);
  const nodes = useAnimatedNumber(1284, 2000);
  const flow = useAnimatedNumber(24.8, 2000, 1);

  return (
    <section id="mission" aria-label="Mission control" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SCENE 09 — MISSION CONTROL"
          title={<>Command <span className="holo-text">deck.</span></>}
          lede="An experience/demo visualization — playful telemetry inspired by spacecraft interfaces. These figures illustrate the fiction, not real infrastructure."
        />
        <div className="glass glow-border scanlines relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="mono-font inline-flex items-center gap-2 text-[11px] tracking-[0.35em] text-emerald-300">
              <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-300" /></span>
              NEURAL CORE — ONLINE · DEMO TELEMETRY
            </p>
            <p className="mono-font text-[10px] tracking-[0.3em] text-slate-500">SESSION 042 · SECTOR 7G</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard icon={Activity} label="AI ACTIVITY" value="▮▮▮▮▮▮▮▮▮▮" color="#22d3ee" seed={1} bars />
            <div className="glass relative overflow-hidden rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="mono-font text-[10px] tracking-[0.3em] text-slate-400">PROCESSING</p>
                <Gauge className="h-3 w-3 text-violet-300" aria-hidden="true" />
              </div>
              <p className="display-font mt-2 text-3xl font-bold text-white"><span ref={proc.ref}>{Math.round(proc.val)}</span><span className="ml-1 text-sm text-violet-300">%</span></p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8" role="progressbar" aria-valuenow={Math.round(proc.val)} aria-valuemin={0} aria-valuemax={100} aria-label="Processing load">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${proc.val}%` }} />
              </div>
              <div className="mt-2"><Sparkline color="#a78bfa" seed={4} /></div>
            </div>
            <MetricCard icon={Network} label="ACTIVE NODES" value={nodes.val.toLocaleString('en-US')} color="#38bdf8" seed={2} />
            <MetricCard icon={Database} label="DATA FLOW" value={String(flow.val)} suffix="TB/s" color="#67e8f9" seed={3} />
            <MetricCard icon={Bot} label="ACTIVE AGENTS" value="12" color="#e879f9" seed={5} />
            <div className="glass relative overflow-hidden rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="mono-font text-[10px] tracking-[0.3em] text-slate-400">CORE TEMP</p>
                <Cpu className="h-3 w-3 text-amber-300" aria-hidden="true" />
              </div>
              <p className="display-font mt-2 text-3xl font-bold text-white">36.6<span className="ml-1 text-sm text-amber-300">°K STABLE</span></p>
              <p className="mono-font mt-3 text-[10px] leading-relaxed tracking-[0.15em] text-slate-500">COOLANT LOOP NOMINAL<br />QUANTUM LATTICE ALIGNED</p>
            </div>
          </div>
          <p className="mono-font mt-5 text-center text-[10px] tracking-[0.25em] text-slate-600">ALL METRICS ARE STYLIZED DEMO VISUALS FOR IMMERSION — NOT REAL SYSTEM DATA</p>
        </div>
      </div>
    </section>
  );
}
