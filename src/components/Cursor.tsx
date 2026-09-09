import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/device';

/**
 * HUD targeting-reticle cursor — glowing core, rotating tick ring, lagging halo.
 * Morphs over interactive targets and shows mission labels
 * (EXPLORE / OPEN / VIEW / ENTER). Disabled on touch / reduced-motion.
 */
export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [live, setLive] = useState(false);
  const [label, setLabel] = useState('');
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Require a real mouse/trackpad — but allow touchscreen laptops that have one.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  // Runs only AFTER the cursor DOM exists, so refs are guaranteed to be set.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('custom-cursor');
    const core = coreRef.current;
    const ring = ringRef.current;
    const halo = haloRef.current;
    if (!core || !ring || !halo) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my, hx = mx, hy = my;
    let scale = 1, targetScale = 1, pressScale = 1;
    let raf = 0;
    let shown = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        rx = hx = mx;
        ry = hy = my;
        setLive(true);
      }
      const t = (e.target as HTMLElement | null)?.closest?.('[data-cursor], a, button') as HTMLElement | null;
      const next = t?.getAttribute('data-cursor') ?? '';
      setLabel((prev) => (prev === next ? prev : next));
      setHot((prev) => {
        const h = !!t;
        return prev === h ? prev : h;
      });
      targetScale = next ? 1.9 : t ? 1.45 : 1;
    };
    const onDown = () => { pressScale = 0.8; };
    const onUp = () => { pressScale = 1; };
    const loop = () => {
      rx += (mx - rx) * 0.4;
      ry += (my - ry) * 0.4;
      hx += (mx - hx) * 0.14;
      hy += (my - hy) * 0.14;
      scale += (targetScale * pressScale - scale) * 0.22;
      const s = scale.toFixed(3);
      core.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${s})`;
      halo.style.transform = `translate3d(${hx}px,${hy}px,0) translate(-50%,-50%) scale(${s})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
      document.body.classList.remove('custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[120] transition-opacity duration-300 ${live ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      {/* lagging halo */}
      <div ref={haloRef} className="absolute left-0 top-0 h-14 w-14 rounded-full border border-cyan-300/20" />
      {/* reticle ring */}
      <div ref={ringRef} className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center">
        <span className={`absolute inset-0 rounded-full border transition-colors duration-200 ${hot ? 'border-cyan-200/90 shadow-[0_0_18px_rgba(34,211,238,.45)]' : 'border-white/30'}`} />
        <span className="reticle-spin absolute inset-0">
          <i className="absolute left-1/2 top-[-3px] h-[7px] w-px -translate-x-1/2 bg-cyan-200/90" />
          <i className="absolute bottom-[-3px] left-1/2 h-[7px] w-px -translate-x-1/2 bg-cyan-200/90" />
          <i className="absolute left-[-3px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-cyan-200/90" />
          <i className="absolute right-[-3px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-cyan-200/90" />
        </span>
        {label !== '' && (
          <span className="mono-font absolute top-full mt-2 whitespace-nowrap text-[8px] font-medium tracking-[0.25em] text-cyan-100 drop-shadow-[0_0_6px_rgba(34,211,238,.8)]">
            {label}
          </span>
        )}
      </div>
      {/* core */}
      <div ref={coreRef} className="absolute left-0 top-0 h-1 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(165,243,252,1),0_0_16px_rgba(34,211,238,.8)]" />
    </div>
  );
}
