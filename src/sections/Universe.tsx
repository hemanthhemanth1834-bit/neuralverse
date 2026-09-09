import { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import SceneCanvas from '../components/SceneCanvas';
import WebGLFallback from '../components/WebGLFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDevice } from '../hooks/useDevice';
import { universeNodes } from '../data/universe';
import { X } from 'lucide-react';

const UniverseScene = lazy(() => import('../scenes/UniverseScene'));

export default function Universe() {
  const { webgl, reducedMotion, tier } = useDevice();
  const [selectedId, setSelectedId] = useState<string | null>('llms');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const selected = universeNodes.find((n) => n.id === selectedId);

  return (
    <section id="universe" aria-label="AI universe" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(139,92,246,.08), transparent 70%)' }} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SCENE 06 — KNOWLEDGE NETWORK"
          title={<>The brain becomes <span className="holo-text">a universe.</span></>}
          lede="Eleven disciplines orbit as living stars. Energy travels the links between them. Click any node to open its dossier."
        />
        <div className="glass glow-border relative h-[480px] overflow-hidden rounded-3xl sm:h-[600px]" data-cursor="EXPLORE">
          {webgl ? (
            <ErrorBoundary label="AI universe">
              <Suspense fallback={<div className="mono-font absolute inset-0 grid place-items-center text-xs tracking-[0.3em] text-slate-500">EXPANDING UNIVERSE…</div>}>
                <SceneCanvas bloom={tier !== 'low'} label="Interactive AI knowledge universe">
                  <UniverseScene reducedMotion={reducedMotion} selectedId={selectedId} onSelect={setSelectedId} onHover={setHoverId} />
                </SceneCanvas>
              </Suspense>
            </ErrorBoundary>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-8"><WebGLFallback label="AI universe" /></div>
          )}
          {/* node quick-nav */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2" role="toolbar" aria-label="Universe nodes">
            {universeNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                data-cursor="OPEN"
                aria-pressed={selectedId === n.id}
                className={`mono-font rounded-full border px-3 py-1.5 text-[10px] tracking-[0.2em] backdrop-blur-md transition ${selectedId === n.id || hoverId === n.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                style={{
                  borderColor: selectedId === n.id ? `${n.color}aa` : 'rgba(255,255,255,.1)',
                  background: selectedId === n.id ? `${n.color}22` : 'rgba(3,6,18,.6)',
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* cinematic dossier */}
        <div className="mt-6 min-h-[150px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.article
                key={selected.id}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8"
              >
                <div className="absolute inset-y-0 left-0 w-1" style={{ background: selected.color }} aria-hidden="true" />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mono-font text-[10px] tracking-[0.4em]" style={{ color: selected.color }}>{selected.group.toUpperCase()} // NODE {selected.id.toUpperCase()}</p>
                    <h3 className="display-font mt-2 text-3xl font-bold text-white">{selected.label}</h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-300">{selected.description}</p>
                    {selected.links.length > 0 && (
                      <p className="mono-font mt-3 text-[11px] tracking-[0.2em] text-slate-500">
                        LINKED: {selected.links.map((l) => universeNodes.find((n) => n.id === l)?.label).join(' · ')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setSelectedId(null)} className="rounded-full border border-white/10 p-2 text-slate-400 hover:text-white" aria-label="Close dossier">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
