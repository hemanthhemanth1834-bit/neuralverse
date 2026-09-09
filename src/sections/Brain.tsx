import { Suspense, lazy, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import SceneCanvas from '../components/SceneCanvas';
import WebGLFallback from '../components/WebGLFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDevice } from '../hooks/useDevice';
import { brainRegions } from '../data/universe';
import { ScanEye, MessageSquare, Network, Database, Sparkles } from 'lucide-react';

const BrainScene = lazy(() => import('../scenes/BrainScene'));

const ICONS: Record<string, typeof ScanEye> = {
  vision: ScanEye,
  language: MessageSquare,
  reasoning: Network,
  memory: Database,
  generative: Sparkles,
};

export default function Brain() {
  const { tier, webgl, reducedMotion, touch } = useDevice();
  const [activeId, setActiveId] = useState<string | null>('language');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const shown = brainRegions.find((r) => r.id === (hoverId || activeId)) || brainRegions[1];

  return (
    <section id="brain" aria-label="Interactive AI brain" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SCENE 04 — THE AI BRAIN"
          title={<>A mind you can <span className="holo-text">touch.</span></>}
          lede="Five cognitive regions, grown procedurally from noise and light. Hover to illuminate a faculty — click to dive the camera toward it."
        />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="glass glow-border relative min-h-[420px] overflow-hidden rounded-3xl sm:min-h-[560px]" data-cursor="EXPLORE">
            {webgl ? (
              <ErrorBoundary label="AI brain">
                <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-slate-500 mono-font text-xs tracking-[0.3em]">SYNTHESIZING CORTEX…</div>}>
                  <SceneCanvas bloom={tier !== 'low'} label="Procedural AI brain with five hoverable regions">
                    <BrainScene tier={tier} reducedMotion={reducedMotion} activeId={activeId} onHover={setHoverId} onSelect={setActiveId} />
                  </SceneCanvas>
                </Suspense>
              </ErrorBoundary>
            ) : (
              <div className="absolute inset-0 grid place-items-center p-8"><WebGLFallback label="AI brain" /></div>
            )}
            <div className="mono-font pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] tracking-[0.3em] text-cyan-200/80">
              {touch ? 'TAP A REGION' : 'HOVER · CLICK TO ZOOM'}
            </div>
          </div>

          <div className="flex flex-col gap-3" role="tablist" aria-label="Brain regions">
            {brainRegions.map((r) => {
              const Icon = ICONS[r.id] || Network;
              const isOn = shown.id === r.id;
              return (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={isOn}
                  onMouseEnter={() => setHoverId(r.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(r.id)}
                  onBlur={() => setHoverId(null)}
                  onClick={() => setActiveId(r.id)}
                  data-cursor="VIEW"
                  className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${isOn ? 'border-transparent bg-gradient-to-br from-cyan-400/10 to-violet-500/10 shadow-[0_0_30px_rgba(34,211,238,.12)]' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}
                  style={isOn ? { boxShadow: `0 0 40px ${r.color}22, inset 0 0 0 1px ${r.color}44` } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl border" style={{ borderColor: `${r.color}55`, background: `${r.color}11` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: r.color }} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="mono-font text-[10px] tracking-[0.35em]" style={{ color: r.color }}>{r.label}</p>
                      <p className="display-font text-lg font-bold text-white">{r.title}</p>
                    </div>
                  </div>
                  <div className={`grid transition-all duration-500 ${isOn ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-slate-400">{r.blurb}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.items.map((it) => (
                          <span key={it} className="mono-font rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.15em] text-slate-300">{it}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
