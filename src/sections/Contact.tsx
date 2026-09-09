import SectionHeading from '../components/SectionHeading';
import MagneticButton from '../components/MagneticButton';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import { Mail, FileText, Send, Terminal } from 'lucide-react';

const LINKS = [
  { icon: Mail, label: 'EMAIL', value: 'hemanthhemanth1834@gmail.com', href: 'mailto:hemanthhemanth1834@gmail.com', cursor: 'OPEN' },
  { icon: GithubIcon, label: 'GITHUB', value: 'hemanthhemanth1834-bit', href: 'https://github.com/hemanthhemanth1834-bit', cursor: 'OPEN' },
  { icon: LinkedinIcon, label: 'LINKEDIN', value: 'hemanth-kumar-muchakarla', href: 'https://www.linkedin.com/in/hemanth-kumar-muchakarla-7974002a7/', cursor: 'OPEN' },
];

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact terminal" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          scene="UPLINK TERMINAL"
          title={<>Open a <span className="holo-text">channel.</span></>}
          lede="A futuristic communication terminal. Every link is live — choose your frequency."
        />
        <div className="glass glow-border scanlines relative overflow-hidden rounded-3xl">
          <div className="flex items-center gap-2 border-b border-white/8 px-6 py-4" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
            <span className="mono-font ml-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-slate-500"><Terminal className="h-3 w-3" /> NEURAL-LINK v2.4 — SECURE</span>
          </div>
          <div className="grid gap-2 p-6 sm:p-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-cursor={l.cursor}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-cyan-400/5"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/40 transition group-hover:border-cyan-300/40">
                    <l.icon className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="mono-font block text-[10px] tracking-[0.35em] text-slate-500">{l.label}</span>
                    <span className="block max-w-[46vw] truncate text-[15px] font-medium text-white sm:max-w-none">{l.value}</span>
                  </span>
                </span>
                <span className="mono-font text-[11px] tracking-[0.25em] text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200">OPEN →</span>
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <MagneticButton strength={0.3} className="flex-1">
                <a
                  href="mailto:hemanthhemanth1834@gmail.com?subject=NEURALVERSE%20Contact&body=Hello%20Hemanth%2C"
                  data-cursor="ENTER"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-4 text-[12px] font-bold tracking-[0.3em] text-[#02040c] transition hover:brightness-110"
                >
                  <Send className="h-3 w-3" aria-hidden="true" /> CONTACT ME
                </a>
              </MagneticButton>
              <MagneticButton strength={0.3} className="flex-1">
                <a
                  href="mailto:hemanthhemanth1834@gmail.com?subject=Resume%20Request%20—%20NEURALVERSE"
                  data-cursor="VIEW"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-[12px] tracking-[0.3em] text-white transition hover:border-cyan-300/50"
                >
                  <FileText className="h-3 w-3" aria-hidden="true" /> VIEW RESUME
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
