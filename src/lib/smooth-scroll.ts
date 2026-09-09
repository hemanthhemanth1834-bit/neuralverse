import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initLenis(reducedMotion: boolean): Lenis | null {
  if (typeof window === 'undefined') return null;
  destroyLenis();
  if (reducedMotion) return null;
  lenis = new Lenis({
    duration: 1.25,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis() {
  try {
    lenis?.destroy();
  } catch {}
  lenis = null;
}

export function scrollToTarget(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.6 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
