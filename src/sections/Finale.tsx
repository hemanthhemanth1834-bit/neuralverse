import { useEffect, useRef, useState } from 'react';
import { gsap, initGsap } from '../lib/gsap-setup';
import { scrollToTarget } from '../lib/smooth-scroll';
import { FileText, Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';

/** Final cinematic scene — universe collapses into one glowing point. */
export default function Finale() {
  const ref = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    initGsap();
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(dotRef.current, { scale: 6, opacity: 0.15 }, {
        scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%' },
        onComplete: () => setCollapsed(true),
      });
      gsap.fromTo(el.querySelectorAll('.fin-line'), { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 55%' },
      });
      gsap.fromTo(el.querySelectorAll('.fin-fade'), { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 50%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} aria-label="Finale" className="relative overflow-hidden pb-14 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 50% 35% at 50% 30%, rgba(34,211,238,.1), transparent 70%)' }} />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <p className="fin-fade mono-font text-[11px] tracking-[0.5em] text-slate-500">SCENE 11 — COLLAPSE</p>
        <div ref={dotRef} className="mt-8 h-20 w-20 rounded-full" aria-hidden="true" style={{ background: 'radial-gradient(circle, #fff, #67e8f9 35%, #8b5cf6 60%, transparent 72%)', boxShadow: '0 0 80px rgba(34,211,238,.6), 0 0 160px rgba(139,92,246,.35)' }} />
        <h2 className="display-font mt-8 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          <span className="reveal-mask"><span className="fin-line">NEURALVERSE</span></span>
          <span className="reveal-mask"><span className="fin-line holo-text">BUILD THE FUTURE.</span></span>
        </h2>
        <p className={`fin-fade mono-font mt-4 text-[11px] tracking-[0.35em] text-slate-500 transition-opacity ${collapsed ? 'opacity-100' : 'opacity-0'}`}>
          ALL SYSTEMS DIMMED · ONE POINT REMAINS
        </p>
        <nav className="fin-fade mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="Final links">
          {[
            { label: 'EXPLORE', icon: ArrowUp, href: '#core' },
            { label: 'GITHUB', icon: GithubIcon, href: 'https://github.com/hemanthhemanth1834-bit', ext: true },
            { label: 'LINKEDIN', icon: LinkedinIcon, href: 'https://www.linkedin.com/in/hemanth-kumar-muchakarla-7974002a7/', ext: true },
            { label: 'RESUME', icon: FileText, href: 'mailto:hemanthhemanth1834@gmail.com?subject=Resume%20Request' },
            { label: 'CONTACT', icon: Mail, href: 'mailto:hemanthhemanth1834@gmail.com' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={l.href.startsWith('#') ? (e) => { e.preventDefault(); scrollToTarget(l.href); } : undefined}
              data-cursor="OPEN"
              className="mono-font inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[11px] tracking-[0.3em] text-slate-300 transition hover:border-cyan-300/50 hover:text-white"
            >
              <l.icon className="h-3 w-3" aria-hidden="true" /> {l.label}
            </a>
          ))}
        </nav>
        <p className="fin-fade mono-font mt-12 text-[10px] leading-relaxed tracking-[0.2em] text-slate-600">
          © 2026 MUCHAKARLA HEMANTH KUMAR · B.TECH CSE — AI/ML · SRK INSTITUTE OF TECHNOLOGY<br />
          <span className="text-slate-700">CRAFTED WITH REACT · THREE.JS · GSAP · FREE & OPEN-SOURCE ONLY</span>
        </p>
      </div>
    </footer>
  );
}
