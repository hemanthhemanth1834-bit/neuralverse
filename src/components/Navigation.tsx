import { useEffect, useState } from 'react';
import { Menu, X, Hexagon } from 'lucide-react';
import { navLinks } from '../data/universe';
import { scrollToTarget } from '../lib/smooth-scroll';

export default function Navigation({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? y / h : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToTarget(href), 60);
  };

  return (
    <>
      <a href="#core" className="skip-link">Skip to content</a>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${ready ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${scrolled ? 'py-2' : 'py-4'}`}>
          <div className={`glass flex w-full items-center justify-between rounded-2xl px-4 py-3 sm:px-5 ${scrolled ? 'shadow-[0_8px_40px_rgba(34,211,238,.12)]' : ''}`}>
            <button onClick={() => go('#core')} className="group flex items-center gap-2.5" aria-label="Neuralverse home" data-cursor="ENTER">
              <span className="relative grid h-7 w-7 place-items-center">
                <Hexagon className="h-5 w-5 text-cyan-300 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
                <span className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(34,211,238,1)]" />
              </span>
              <span className="display-font text-sm font-bold tracking-[0.25em] text-white">NEURALVERSE</span>
            </button>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.href)}
                  className="mono-font rounded-full px-3.5 py-2 text-[11px] tracking-[0.25em] text-slate-400 transition hover:bg-white/5 hover:text-cyan-200"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => go('#ask')}
                data-cursor="OPEN"
                className="mono-font ml-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 text-[11px] font-semibold tracking-[0.2em] text-[#02040c] transition hover:brightness-110"
              >
                ENTER CORE
              </button>
            </nav>

            <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-8" aria-hidden="true">
          <div className="h-px w-full bg-white/5">
            <div className="h-px bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div className={`fixed inset-0 z-[75] flex flex-col justify-center bg-[#02040c]/95 px-8 backdrop-blur-xl transition-all duration-500 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <p className="mono-font mb-6 text-[11px] tracking-[0.4em] text-cyan-300/70">NAVIGATION MATRIX</p>
        <div className="space-y-2">
          {navLinks.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.href)}
              className={`display-font block text-left text-4xl font-bold text-white transition-all duration-500 hover:text-cyan-200 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="mono-font mr-4 text-xs text-cyan-400/60">0{i + 1}</span>{l.label}
            </button>
          ))}
        </div>
        <p className="mono-font mt-10 text-[10px] tracking-[0.3em] text-slate-500">HEMANTH KUMAR · AI/ML · 2024–2028</p>
      </div>
    </>
  );
}
