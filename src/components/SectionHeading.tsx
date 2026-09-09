import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, initGsap } from '../lib/gsap-setup';
import { prefersReducedMotion } from '../utils/device';

interface Props {
  scene: string;
  title: ReactNode;
  lede?: string;
  align?: 'left' | 'center';
  id?: string;
}

/** Cinematic scene heading — SCENE label + big display title + reveal choreography. */
export default function SectionHeading({ scene, title, lede, align = 'left', id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGsap();
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.sh-line'), { yPercent: 110 }, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
      gsap.fromTo(el.querySelectorAll('.sh-fade'), { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} id={id} className={`relative z-10 mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      <p className="sh-fade mono-font inline-flex items-center gap-3 text-[11px] tracking-[0.45em] text-cyan-300/80">
        <span className="inline-block h-px w-10 bg-gradient-to-r from-transparent to-cyan-300/70" aria-hidden="true" />
        {scene}
        {align === 'center' && <span className="inline-block h-px w-10 bg-gradient-to-l from-transparent to-cyan-300/70" aria-hidden="true" />}
      </p>
      <h2 className="display-font mt-4 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl">
        <span className="reveal-mask"><span className="sh-line">{title}</span></span>
      </h2>
      {lede && <p className={`sh-fade mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400 ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>}
    </div>
  );
}
