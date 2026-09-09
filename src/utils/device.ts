export type DeviceTier = 'low' | 'medium' | 'high';

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'medium';
  const cores = (navigator as any).hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  const w = window.innerWidth;
  const touch = isTouchDevice();
  // low: small screens, few cores, low memory, or coarse pointer phones
  if (w < 640 || cores <= 4 || mem <= 4) {
    // tablets with bigger screens get medium
    if (w >= 768 && w < 1280 && cores >= 4) return 'medium';
    if (touch && w < 768) return 'low';
    if (cores <= 2) return 'low';
  }
  if (w >= 1280 && cores >= 6 && mem >= 6) return 'high';
  return 'medium';
}

export function particleBudget(tier: DeviceTier): { nodes: number; links: number; data: number; bloom: boolean; dpr: [number, number] } {
  switch (tier) {
    case 'low':
      return { nodes: 320, links: 0, data: 60, bloom: false, dpr: [0.6, 1] };
    case 'medium':
      return { nodes: 900, links: 0, data: 160, bloom: true, dpr: [0.8, 1.5] };
    case 'high':
      return { nodes: 1800, links: 0, data: 320, bloom: true, dpr: [1, 2] };
  }
}

export function announce(msg: string) {
  const el = document.getElementById('announcer');
  if (el) el.textContent = msg;
}
