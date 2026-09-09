import SectionHeading from '../components/SectionHeading';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

export default function About() {
  return (
    <section id="about" aria-label="About" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 55% 40% at 20% 60%, rgba(34,211,238,.07), transparent 70%)' }} />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeading
            scene="THE ARCHITECT"
            title={<>Hemanth Kumar <span className="holo-text">Muchakarla.</span></>}
            lede="B.Tech CSE — AI/ML · 2024–2028 · SRK Institute of Technology. An AI/ML-focused developer building intelligent systems and immersive digital experiences."
          />
          <div className="max-w-xl space-y-4 text-[15px] leading-relaxed text-slate-300">
            <p>
              I work where models meet meaning — designing ML pipelines, retrieval systems and
              generative prototypes, then rendering them as experiences people can <em className="text-white not-italic">feel</em>.
            </p>
            <p className="text-slate-400">
              My practice spans Python and full-stack web, classical ML through LLMs and RAG,
              embedded sensing with Arduino, and aerial survey thinking with drones — unified by
              a single obsession: intelligence, made interactive.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: GraduationCap, text: 'SRK Institute of Technology' },
              { icon: Calendar, text: 'B.Tech CSE · 2024–2028' },
              { icon: MapPin, text: 'India · Open to remote' },
            ].map((b) => (
              <span key={b.text} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] text-slate-300">
                <b.icon className="h-3 w-3 text-cyan-300" aria-hidden="true" /> {b.text}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="glass glow-border scanlines relative overflow-hidden rounded-3xl p-8">
            <p className="mono-font text-[10px] tracking-[0.4em] text-cyan-300/80">IDENTITY FILE // 042</p>
            <div className="mt-6 space-y-4" aria-label="Profile details">
              {[
                ['DESIGNATION', 'AI/ML Developer'],
                ['FOCUS', 'Intelligent systems · Immersive web'],
                ['CORE LOOP', 'Data → Model → Experience'],
                ['STATUS', 'Building NEURALVERSE'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-3">
                  <span className="mono-font text-[10px] tracking-[0.3em] text-slate-500">{k}</span>
                  <span className="display-font text-right text-[15px] font-semibold text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center" aria-label="Principles">
              {[['CINEMATIC', 'Every pixel earns its place'], ['HONEST', 'No hype metrics'], ['SYSTEMIC', 'Think in loops']].map(([t, s]) => (
                <div key={t} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <p className="mono-font text-[10px] tracking-[0.2em] text-cyan-200">{t}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
