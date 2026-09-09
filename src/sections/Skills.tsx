import { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import SceneCanvas from '../components/SceneCanvas';
import WebGLFallback from '../components/WebGLFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDevice } from '../hooks/useDevice';
import { skills } from '../data/universe';

const SkillsConstellation = lazy(() => import('../scenes/SkillsConstellation'));

const LEVEL_LABEL: Record<string, string> = {
  Advanced: 'Deep practice · production use',
  Proficient: 'Confident · project-proven',
  Foundational: 'Solid base · growing',
  Exploring: 'Actively learning',
};

export default function Skills() {
  const { webgl, reducedMotion, tier } = useDevice();
  const [active, setActive] = useState<string | null>('Python');
  const shown = skills.find((s) => s.name === active);

  return (
    <section id="skills" aria-label="Skills constellation" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SKILLS CONSTELLATION"
          title={<>Fourteen stars, <span className="holo-text">one orbit.</span></>}
          lede="No fake percentages — only honest signal: category, story and depth. Hover the constellation to inspect each star."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass glow-border relative h-[420px] overflow-hidden rounded-3xl sm:h-[540px]" data-cursor="EXPLORE">
            {webgl ? (
              <ErrorBoundary label="Skills constellation">
                <Suspense fallback={<div className="mono-font absolute inset-0 grid place-items-center text-xs tracking-[0.3em] text-slate-500">MAPPING CONSTELLATION…</div>}>
                  <SceneCanvas bloom={tier !== 'low'} label="Interactive 3D skills constellation">
                    <SkillsConstellation reducedMotion={reducedMotion} active={active} onHover={setActive} />
                  </SceneCanvas>
                </Suspense>
              </ErrorBoundary>
            ) : (
              <div className="absolute inset-0 grid place-items-center p-8"><WebGLFallback label="Skills constellation" /></div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Skills">
              {skills.map((s) => (
                <button
                  key={s.name}
                  onMouseEnter={() => setActive(s.name)}
                  onFocus={() => setActive(s.name)}
                  onClick={() => setActive(s.name)}
                  data-cursor="VIEW"
                  aria-pressed={active === s.name}
                  className={`mono-font rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.12em] transition ${active === s.name ? 'border-cyan-300/60 bg-cyan-400/10 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <div className="mt-5 min-h-[190px]" aria-live="polite">
              <AnimatePresence mode="wait">
                {shown && (
                  <motion.div
                    key={shown.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="glass rounded-2xl p-6"
                  >
                    <p className="mono-font text-[10px] tracking-[0.35em] text-cyan-300">{shown.category.toUpperCase()} // {shown.level.toUpperCase()}</p>
                    <h3 className="display-font mt-1 text-2xl font-bold text-white">{shown.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{shown.description}</p>
                    <p className="mono-font mt-3 text-[11px] tracking-[0.1em] text-slate-500">{LEVEL_LABEL[shown.level]}</p>
                    <div className="mt-4 flex gap-1.5" aria-hidden="true">
                      {['Foundational', 'Proficient', 'Advanced'].map((l) => {
                        const order = ['Foundational', 'Proficient', 'Advanced', 'Exploring'];
                        const on = order.indexOf(shown.level) >= order.indexOf(l) || (shown.level === 'Exploring' && l === 'Foundational');
                        return <span key={l} className={`h-1.5 flex-1 rounded-full ${on ? 'bg-gradient-to-r from-cyan-400 to-violet-400' : 'bg-white/10'}`} />;
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
