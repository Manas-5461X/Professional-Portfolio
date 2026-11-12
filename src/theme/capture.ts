import type { ThemeMode } from './types';

export interface Snapshot {
  theme: ThemeMode;
  canvas: HTMLCanvasElement;
  scale: number;
  scrollX: number;
  scrollY: number;
  width: number;
  height: number;
}

const BACKGROUND: Record<ThemeMode, string> = {
  light: '#EEEAE2',
  dark: '#121210'
};

export function renderScale(): number {
  const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const cap = isCoarse ? 1.25 : 1.5;
  return Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, cap);
}

export function viewportSize(): { width: number; height: number } {
  const el = document.documentElement;
  return {
    width: Math.max(1, el.clientWidth),
    height: Math.max(1, el.clientHeight)
  };
}

/**
 * Captures the live visible viewport window in the specified theme by cloning
 * the current DOM via html2canvas-pro (`import` is lazy-loaded so there is zero
 * initial bundle cost). Off-screen sections outside the viewport are height-stubbed
 * inside the clone so layout height stays exact while capture stays fast (~100ms).
 */
export async function captureViewport(
  theme: ThemeMode,
  scale: number,
  maxTextureSize: number
): Promise<Snapshot> {
  const { width, height } = viewportSize();
  const scrollX = Math.round(window.scrollX);
  const scrollY = Math.round(window.scrollY);
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  // Record off-screen section/article/footer boxes before cloning so offscreen
  // content (and off-screen project screenshots) does not burn CPU inside
  // html2canvas-pro while keeping exact layout height and scroll offsets.
  const offscreenStubs = new Map<number, number>();
  const candidates = document.querySelectorAll('main section, main section article, footer');
  candidates.forEach((el, idx) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && (r.bottom < -4 || r.top > height + 4)) {
      offscreenStubs.set(idx, r.height);
    }
  });

  const { default: html2canvas } = await import('html2canvas-pro');

  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme],
    x: scrollX,
    y: scrollY,
    width,
    height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: width,
    windowHeight: height,
    logging: false,
    useCORS: true,
    ignoreElements: (el) => el.hasAttribute('data-html2canvas-ignore'),
    onclone: (doc) => {
      doc.documentElement.dataset.theme = theme;
      doc.documentElement.classList.toggle('dark', theme === 'dark');
      doc.documentElement.classList.remove('theme-fade');

      // Copy rendered bitmap from live canvases (like Three.js FieldBackground) to cloned canvases
      const liveCanvases = document.querySelectorAll('canvas:not(.ink-canvas)');
      const clonedCanvases = doc.querySelectorAll('canvas:not(.ink-canvas)');
      liveCanvases.forEach((live, idx) => {
        const cloned = clonedCanvases[idx] as HTMLCanvasElement;
        if (cloned && live instanceof HTMLCanvasElement && live.width > 0 && live.height > 0) {
          try {
            cloned.width = live.width;
            cloned.height = live.height;
            const ctx2d = cloned.getContext('2d');
            if (ctx2d) {
              ctx2d.drawImage(live, 0, 0);
            }
          } catch {}
        }
      });

      // Replace off-screen sections/articles with exact-height empty spacers
      if (offscreenStubs.size > 0) {
        const clonedCandidates = doc.querySelectorAll<HTMLElement>('main section, main section article, footer');
        offscreenStubs.forEach((boxHeight, idx) => {
          const target = clonedCandidates[idx];
          if (target) {
            target.innerHTML = '';
            target.style.height = `${boxHeight}px`;
            target.style.minHeight = `${boxHeight}px`;
            target.style.paddingTop = '0';
            target.style.paddingBottom = '0';
            target.style.boxSizing = 'border-box';
          }
        });
      }

      // Ensure sticky header paints at the exact scrolled viewport top in the clone.
      const header = doc.querySelector<HTMLElement>('header');
      if (header && scrollY > 0) {
        header.style.position = 'relative';
        header.style.transform = `translateY(${scrollY}px)`;
      }

      // Force style recalculation in the cloned document before reading computed SVG colors
      const view = doc.defaultView;
      void doc.documentElement.offsetHeight;
      if (view) {
        doc.querySelectorAll<SVGElement>('svg').forEach((svg) => {
          const targetColor = view.getComputedStyle(svg).color || view.getComputedStyle(svg.parentElement || svg).color;
          if (!targetColor) return;
          svg.style.color = targetColor;
          if (svg.getAttribute('fill') === 'currentColor') {
            svg.setAttribute('fill', targetColor);
          }
          if (svg.getAttribute('stroke') === 'currentColor') {
            svg.setAttribute('stroke', targetColor);
          }
        });
      }
    }
  });

  return {
    theme,
    canvas,
    scale: safeScale,
    scrollX,
    scrollY,
    width,
    height
  };
}

