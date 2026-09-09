import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { projects } from '../data/projects';
import { GithubIcon } from '../components/BrandIcons';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const p = projects[index];

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + projects.length) % projects.length);
  };

  return (
    <section id="projects" aria-label="Project showcase" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          scene="SCENE 08 — PROJECT ARCHIVE"
          title={<>Cinematic <span className="holo-text">transmissions.</span></>}
          lede="Not cards — scenes. Each project is a frequency. Traverse the archive with the controls, or jump by index."
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050a1c]">
          {/* scene backdrop */}
          <div className="tech-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute inset-0 transition-all duration-1000"
            aria-hidden="true"
            style={{ background: `radial-gradient(ellipse 70% 60% at 30% 30%, ${p.accent}26, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, ${p.accent}14, transparent 60%)` }}
          />
          {/* giant index */}
          <div className="display-font pointer-events-none absolute -right-4 top-2 select-none text-[26vw] font-bold leading-none text-white/[0.04] sm:text-[10rem]" aria-hidden="true">
            {p.index}
          </div>

          <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
            {/* visual */}
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:min-h-[360px]" aria-hidden="true">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={p.id}
                  custom={dir}
                  initial={{ opacity: 0, x: 60 * dir, scale: 1.06, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -60 * dir, scale: 0.98, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* procedural scene per project */}
                  <div className="absolute inset-0" style={{ background: `conic-gradient(from 120deg at 50% 50%, transparent, ${p.accent}22, transparent 40%, ${p.accent}11, transparent)` }} />
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${p.accent}cc, transparent 65%)`, filter: 'blur(30px)', opacity: 0.5 }} />
                  <div className="absolute inset-0 grid place-items-center">
                    <p className="display-font px-6 text-center text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">{p.title}</p>
                  </div>
                  <div className="mono-font absolute bottom-3 left-4 right-4 flex justify-between text-[10px] tracking-[0.25em] text-slate-400">
                    <span>SIGNAL {p.index}/05</span><span style={{ color: p.accent }}>● LIVE RENDER</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* info */}
            <div>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={p.id + '-info'}
                  custom={dir}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mono-font text-[11px] tracking-[0.4em]" style={{ color: p.accent }}>{p.index} // {p.subtitle.toUpperCase()}</p>
                  <h3 className="display-font mt-2 text-4xl font-bold text-white sm:text-5xl">{p.title}</h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">{p.description}</p>
                  <p className="mono-font mt-4 text-[11px] italic tracking-[0.1em] text-slate-500">“{p.scene}”</p>
                  <div className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
                    {p.stack.map((s) => (
                      <span key={s} className="mono-font rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-[0.12em] text-slate-200">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-6" aria-label="Project metrics">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <p className="mono-font text-[10px] tracking-[0.3em] text-slate-500">{s.label}</p>
                        <p className="display-font text-lg font-bold text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="OPEN"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-bold tracking-[0.25em] text-[#02040c] transition hover:brightness-90"
                    >
                      <GithubIcon className="h-3 w-3" /> GITHUB
                    </a>
                    {p.demo ? (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" data-cursor="VIEW" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[11px] tracking-[0.25em] text-white transition hover:border-cyan-300/50">
                        <ExternalLink className="h-3 w-3" aria-hidden="true" /> LIVE DEMO
                      </a>
                    ) : (
                      <span className="mono-font inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-[10px] tracking-[0.25em] text-slate-500">DEMO ON REQUEST</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* controls */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <div className="flex gap-2" role="tablist" aria-label="Projects">
                  {projects.map((pr, i) => (
                    <button
                      key={pr.id}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Project ${pr.title}`}
                      onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                      className={`h-1.5 rounded-full transition-all duration-400 ${i === index ? 'w-10' : 'w-4 bg-white/15 hover:bg-white/30'}`}
                      style={i === index ? { background: p.accent } : undefined}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => go(-1)} aria-label="Previous project" className="grid h-9 w-9 place-items-center rounded-full border border-white/12 text-white transition hover:border-cyan-300/50">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => go(1)} aria-label="Next project" data-cursor="VIEW" className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#02040c] transition hover:brightness-90">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
