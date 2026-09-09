import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { prefersReducedMotion } from '../utils/device';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
  label?: string;
}

/** Magnetic wrapper — element gravitates toward cursor within ~120px. */
export default function MagneticButton({ children, className = '', strength = 0.3, as = 'div', href, onClick, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    let queued = false;
    let lastX = 0, lastY = 0;
    const apply = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = lastX - cx, dy = lastY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = 'translate(0,0)';
      }
    };
    const onMove = (e: globalThis.MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    };
    const onLeave = () => { el.style.transform = 'translate(0,0)'; };
    el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)';
    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  const inner = (
    <div ref={ref} className={className} onClick={onClick} role={as === 'div' && onClick ? 'button' : undefined} aria-label={label} tabIndex={as === 'div' && onClick ? 0 : undefined}>
      {children}
    </div>
  );
  if (as === 'a' && href) {
    return <a href={href} aria-label={label} onClick={(e: MouseEvent) => { if (onClick) { e.preventDefault(); onClick(); } }}>{inner}</a>;
  }
  return inner;
}
