import { useEffect, useState, type RefObject } from 'react';

/** Tracks whether an element is inside (or near) the viewport. */
export function useInViewport<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = '700px'
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
