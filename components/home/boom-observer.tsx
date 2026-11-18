'use client';
import { useEffect } from 'react';

// Dispara la animación de los pasos (.boom-step) una sola vez, cuando entran en pantalla.
export function BoomObserver() {
  useEffect(() => {
    const steps = document.querySelectorAll<HTMLElement>('.boom-step');
    if (!steps.length || !('IntersectionObserver' in window)) return;
    document.querySelectorAll('.boom-pin').forEach((s) => s.classList.add('boom-ready'));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-on');
        e.target.closest('.boom-pin')?.classList.add('is-on');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.5 });
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
