import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}

export const scrollState = { velocity: 0, scroll: 0 };

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined' || isReducedMotion() || isCoarsePointer()) {
    return () => {};
  }

  if (!isReducedMotion()) {
    document.documentElement.classList.add('motion-ready');
  }

  if (lenisInstance) {
    return () => {};
  }

  lenisInstance = new Lenis({
    lerp: 0.085,
    smoothWheel: true
  });

  lenisInstance.on('scroll', (e: { velocity: number; scroll: number }) => {
    scrollState.velocity = e.velocity || 0;
    scrollState.scroll = e.scroll || 0;
    ScrollTrigger.update();
  });

  tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    lenisInstance?.destroy();
    lenisInstance = null;
  };
}

export function scrollToTopImmediate(): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

export function scrollToElement(target: string | HTMLElement, offset = -84): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenisInstance && !isReducedMotion()) {
    lenisInstance.scrollTo(el, {
      offset,
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 4)
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: isReducedMotion() ? 'auto' : 'smooth'
    });
  }
}

export const stopScroll = () => {
  lenisInstance?.stop();
  document.documentElement.style.overflow = 'hidden';
};
export const startScroll = () => {
  lenisInstance?.start();
  document.documentElement.style.overflow = '';
};

export { gsap, ScrollTrigger };
