import { useEffect, useRef, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, isReducedMotion, isCoarsePointer } from './smooth';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useHeroEntrance(scopeRef: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span');
      const items = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
      if (!lines.length && !items.length) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (lines.length) {
        tl.from(lines, {
          yPercent: 105,
          duration: 0.75,
          stagger: 0.05,
          clearProps: 'transform'
        });
      }
      if (items.length) {
        tl.from(
          items,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.04,
            clearProps: 'transform,opacity'
          },
          lines.length ? '-=0.35' : 0
        );
      }
    },
    { scope: scopeRef }
  );
}

export function useScrollReveals(scopeRef: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;
      const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      blocks.forEach((el) => {
        const delay = parseFloat(el.dataset.delay || '0');
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        });
      });
    },
    { scope: scopeRef }
  );
}

/**
 * Subtle magnetic button interaction strictly on desktop fine pointers.
 * Degrades cleanly to zero motion on touch devices or reduced-motion settings.
 */
export function useMagnetic<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion() || isCoarsePointer()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
      xTo(dx);
      yTo(dy);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  return ref;
}
