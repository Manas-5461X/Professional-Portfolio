import gsap from 'gsap';
import { captureViewport, renderScale, viewportSize, type Snapshot } from './capture';
import { inkParams } from './params';
import { InkRenderer, type InkFrame, type InkSource } from './renderer';
import type { Point, ThemeMode } from './types';

const EASE = 'power3.out';
const FADE_OUT_S = 0.14;
const CSS_FADE_S = 0.42;

export const SPREAD = {
  growth: 0.7,
  cleanupFrom: 0.45,
  cleanupReach: 0.4,
  cleanupPow: 2
} as const;

type ActiveFrame = Omit<InkFrame, 'progress' | 'radius' | 'time' | 'cleanup'>;

export interface InkControllerOptions {
  webgl?: boolean;
  getTheme?: () => ThemeMode;
}

export interface InkToggleOptions {
  currentTheme: ThemeMode;
  point?: Point;
  toggleButton?: HTMLButtonElement | null;
  onApplyTheme: (next: ThemeMode) => void;
}

interface WarmState {
  scrollX: number;
  scrollY: number;
  width: number;
  height: number;
  scale: number;
}

function getReducedMotionQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

function otherTheme(theme: ThemeMode): ThemeMode {
  return theme === 'dark' ? 'light' : 'dark';
}

function farthestCorner(p: Point): number {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return (
    Math.max(
      Math.hypot(p.x, p.y),
      Math.hypot(w - p.x, p.y),
      Math.hypot(p.x, h - p.y),
      Math.hypot(w - p.x, h - p.y)
    ) + 4
  );
}

function randomSeed(): InkFrame['seed'] {
  return {
    x: Math.random() * 64 - 32,
    y: Math.random() * 64 - 32,
    angle: Math.random() * Math.PI * 2
  };
}

function releaseSnapshotCanvas(snap: Snapshot): void {
  snap.canvas.width = 0;
  snap.canvas.height = 0;
}

/**
 * Orchestrates organic WebGL2 ink-bleed transitions for theme toggles, with
 * background viewport pre-warming for instant click response, synchronous FBO
 * freezing for rapid interruptions, viewport resizing, WebGL context-loss
 * recovery, reduced-motion respect, and CSS cross-fade fallback.
 */
export class InkTransitionController {
  private readonly renderer: InkRenderer | null;
  private readonly getThemeFn?: () => ThemeMode;
  private readonly state = { progress: 0, time: 0 };
  private tween: gsap.core.Tween | null = null;
  private fade: gsap.core.Tween | null = null;
  private frame: ActiveFrame | null = null;
  private cssFadeTimer = 0;
  private warmTimer = 0;
  private captureGen = 0;
  private warmGen = 0;
  private capturing = false;
  private warming = false;
  private warm: WarmState | null = null;
  private destroyed = false;

  private handleResize = () => {
    if (!this.renderer || this.renderer.isLost) return;
    this.renderer.resize(renderScale());
    if (this.frame) {
      this.draw();
      return;
    }
    this.invalidateWarm();
    this.scheduleWarm(280);
  };

  private handleScroll = () => {
    if (this.destroyed || !this.renderer || this.renderer.isLost || this.frame) return;
    if (this.warm && Math.abs(this.warm.scrollX - window.scrollX) <= 2 && Math.abs(this.warm.scrollY - window.scrollY) <= 2) {
      return;
    }
    this.invalidateWarm();
    this.scheduleWarm(280);
  };

  private handleRouteOrDomChange = () => {
    if (this.destroyed || !this.renderer || this.renderer.isLost || this.frame) return;
    this.invalidateWarm();
    this.scheduleWarm(220);
  };

  private handleDocumentClick = (e: MouseEvent) => {
    if (this.destroyed || !this.renderer || this.renderer.isLost || this.frame) return;
    const target = e.target as Element | null;
    if (target?.closest?.('[data-theme-toggle], button[aria-label*="Switch to"]')) {
      return;
    }
    this.invalidateWarm();
    this.scheduleWarm(250);
  };

  constructor(canvas: HTMLCanvasElement, opts: InkControllerOptions = {}) {
    this.getThemeFn = opts.getTheme;
    this.renderer = opts.webgl === false ? null : InkRenderer.create(canvas);
    if (!this.renderer) {
      document.documentElement.dataset.ink = 'css';
      return;
    }

    document.documentElement.dataset.ink = 'webgl';
    this.renderer.resize(renderScale());
    this.renderer.watchContext(
      () => {
        this.invalidateWarm();
        this.cancel();
      },
      () => {
        this.scheduleWarm(180);
      }
    );

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('popstate', this.handleRouteOrDomChange, { passive: true });
    window.addEventListener('hashchange', this.handleRouteOrDomChange, { passive: true });
    document.addEventListener('click', this.handleDocumentClick, { capture: true, passive: true });
  }

  get isWebGL(): boolean {
    return this.renderer !== null && !this.renderer.isLost;
  }

  get isAnimating(): boolean {
    return this.frame !== null;
  }

  scheduleWarm(delayMs = 150): void {
    if (this.destroyed || !this.renderer || this.renderer.isLost) return;
    if (getReducedMotionQuery()?.matches) return;
    if (this.frame || this.capturing) return;

    window.clearTimeout(this.warmTimer);
    this.warmTimer = window.setTimeout(() => {
      this.warmTimer = 0;
      void this.prewarm();
    }, delayMs);
  }

  private invalidateWarm(): void {
    window.clearTimeout(this.warmTimer);
    this.warmTimer = 0;
    this.warmGen++;
    this.warm = null;
  }

  private resolveCurrentTheme(): ThemeMode {
    if (this.getThemeFn) return this.getThemeFn();
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  private isWarmForViewport(renderer: InkRenderer, currentTheme: ThemeMode, to: ThemeMode, scale: number): boolean {
    if (!this.warm || renderer.isLost) return false;
    if (!renderer.hasTheme(currentTheme) || !renderer.hasTheme(to)) return false;
    if (Math.abs(this.warm.scrollX - window.scrollX) > 1 || Math.abs(this.warm.scrollY - window.scrollY) > 1) {
      return false;
    }
    const { width, height } = viewportSize();
    return this.warm.width === width && this.warm.height === height && this.warm.scale === scale;
  }

  private async prewarm(): Promise<void> {
    const renderer = this.renderer;
    if (this.destroyed || !renderer || renderer.isLost || document.hidden) return;
    if (this.frame || this.capturing || this.warming) return;
    if (getReducedMotionQuery()?.matches) return;

    const currentTheme = this.resolveCurrentTheme();
    const to = otherTheme(currentTheme);
    const scale = renderScale();
    if (this.isWarmForViewport(renderer, currentTheme, to, scale)) return;

    const gen = ++this.warmGen;
    this.warming = true;

    let fromSnap: Snapshot | null = null;
    let toSnap: Snapshot | null = null;

    try {
      fromSnap = await captureViewport(currentTheme, scale, renderer.maxTextureSize);
      if (this.destroyed || gen !== this.warmGen || this.frame || this.capturing || renderer.isLost) {
        return;
      }

      toSnap = await captureViewport(to, scale, renderer.maxTextureSize);
      if (this.destroyed || gen !== this.warmGen || this.frame || this.capturing || renderer.isLost) {
        return;
      }

      if (Math.abs(window.scrollX - toSnap.scrollX) > 2 || Math.abs(window.scrollY - toSnap.scrollY) > 2) {
        return;
      }

      renderer.resize(scale);
      renderer.upload(fromSnap);
      renderer.upload(toSnap);
      this.warm = {
        scrollX: toSnap.scrollX,
        scrollY: toSnap.scrollY,
        width: toSnap.width,
        height: toSnap.height,
        scale
      };
    } catch {
      // Pre-warming is best-effort; fallback capture runs on demand if needed.
    } finally {
      if (fromSnap) releaseSnapshotCanvas(fromSnap);
      if (toSnap) releaseSnapshotCanvas(toSnap);
      if (gen === this.warmGen) {
        this.warming = false;
      } else {
        this.warming = false;
      }
    }
  }

  async toggle(opts: InkToggleOptions): Promise<void> {
    if (this.destroyed) return;

    const { currentTheme, point, toggleButton, onApplyTheme } = opts;
    const to = otherTheme(currentTheme);
    const reduced = getReducedMotionQuery()?.matches ?? false;
    const center = this.resolveOrigin(point, toggleButton);
    const renderer = this.renderer;

    window.clearTimeout(this.warmTimer);
    this.warmTimer = 0;

    if (reduced) {
      this.invalidateWarm();
      this.cancel();
      onApplyTheme(to);
      return;
    }

    if (!renderer || renderer.isLost) {
      this.invalidateWarm();
      this.cancel();
      this.crossFade(to, onApplyTheme);
      return;
    }

    const interrupting = this.frame !== null && renderer.hasTheme(to);
    if (interrupting) {
      this.warmGen++;
      this.warm = null;
      this.startInterruptTransition(renderer, currentTheme, to, center, onApplyTheme);
      return;
    }

    // If a rapid second click arrives while async viewport capture is still running,
    // abort stale WebGL capture generation and flip cleanly with CSS fallback so state
    // stays deterministic without overlapping captures.
    if (this.capturing) {
      this.captureGen++;
      this.capturing = false;
      this.invalidateWarm();
      this.cancel();
      this.crossFade(to, onApplyTheme);
      return;
    }

    const scale = renderScale();
    if (this.isWarmForViewport(renderer, currentTheme, to, scale)) {
      this.captureGen++;
      this.warmGen++;
      this.warm = null;
      renderer.resize(scale);
      this.beginSpread(renderer, currentTheme, to, center, onApplyTheme);
      return;
    }

    this.invalidateWarm();
    const gen = ++this.captureGen;
    this.capturing = true;

    let fromSnap: Snapshot | null = null;
    let toSnap: Snapshot | null = null;

    try {
      fromSnap = await captureViewport(currentTheme, scale, renderer.maxTextureSize);
      if (this.destroyed || gen !== this.captureGen) return;

      toSnap = await captureViewport(to, scale, renderer.maxTextureSize);
      if (this.destroyed || gen !== this.captureGen) return;

      if (renderer.isLost) {
        this.crossFade(to, onApplyTheme);
        return;
      }

      renderer.resize(scale);
      renderer.upload(fromSnap);
      renderer.upload(toSnap);

      this.beginSpread(renderer, currentTheme, to, center, onApplyTheme);
    } catch {
      if (!this.destroyed && gen === this.captureGen) {
        this.cancel();
        this.crossFade(to, onApplyTheme);
      }
    } finally {
      if (fromSnap) releaseSnapshotCanvas(fromSnap);
      if (toSnap) releaseSnapshotCanvas(toSnap);
      if (gen === this.captureGen) {
        this.capturing = false;
      }
    }
  }

  private startInterruptTransition(
    renderer: InkRenderer,
    currentTheme: ThemeMode,
    to: ThemeMode,
    center: Point,
    onApplyTheme: (next: ThemeMode) => void
  ): void {
    this.tween?.kill();
    this.fade?.kill();
    this.tween = null;
    this.fade = null;

    renderer.resize(renderScale());
    const frozen = this.currentFrame();
    const from: InkSource = frozen && renderer.freeze(frozen) ? 'composite' : currentTheme;
    this.beginSpread(renderer, from, to, center, onApplyTheme);
  }

  private beginSpread(
    renderer: InkRenderer,
    from: InkSource,
    to: ThemeMode,
    center: Point,
    onApplyTheme: (next: ThemeMode) => void
  ): void {
    const maxDist = farthestCorner(center);
    this.frame = { from, to, center, maxDist, seed: randomSeed() };
    this.state.progress = 0;
    this.state.time = 0;

    if (!this.draw()) {
      this.cancel();
      this.crossFade(to, onApplyTheme);
      return;
    }

    gsap.set(renderer.canvas, { opacity: 1 });
    renderer.canvas.classList.add('is-active');
    onApplyTheme(to);

    const duration = inkParams.duration;
    this.tween = gsap.to(this.state, {
      progress: 1,
      duration,
      ease: EASE,
      onUpdate: () => {
        this.state.time = this.tween?.time() ?? 0;
        this.draw();
      },
      onComplete: () => this.finish()
    });
  }

  private resolveOrigin(point?: Point, toggleButton?: HTMLButtonElement | null): Point {
    if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
      return point;
    }
    const rect = toggleButton?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  private currentFrame(): InkFrame | null {
    if (!this.frame) return null;
    const { progress, time } = this.state;
    const { maxDist } = this.frame;
    const linear = Math.min(1, time / inkParams.duration);
    const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
    const cleanup =
      ramp ** SPREAD.cleanupPow * maxDist * SPREAD.cleanupReach +
      Math.max(0, (linear - 0.97) / 0.03) * maxDist;

    return {
      ...this.frame,
      progress,
      time,
      radius: progress * maxDist * SPREAD.growth,
      cleanup
    };
  }

  private draw(): boolean {
    const frame = this.currentFrame();
    if (!this.renderer || !frame) return false;
    return this.renderer.draw(frame);
  }

  private finish(): void {
    const canvas = this.renderer?.canvas;
    this.tween = null;
    if (!canvas) {
      this.hide(true);
      return;
    }
    this.fade = gsap.to(canvas, {
      opacity: 0,
      duration: FADE_OUT_S,
      ease: 'none',
      onComplete: () => this.hide(true)
    });
  }

  private hide(rewarm = false): void {
    this.fade = null;
    this.frame = null;
    this.warm = null;
    this.renderer?.canvas.classList.remove('is-active');
    this.renderer?.releaseTransientResources();
    if (rewarm && !this.destroyed) {
      this.scheduleWarm(180);
    }
  }

  private cancel(): void {
    this.tween?.kill();
    this.fade?.kill();
    this.tween = null;
    this.fade = null;
    this.hide(false);
  }

  private crossFade(to: ThemeMode, onApplyTheme: (next: ThemeMode) => void): void {
    const root = document.documentElement;
    const reduced = getReducedMotionQuery()?.matches ?? false;
    if (reduced) {
      root.classList.remove('theme-fade');
      onApplyTheme(to);
      return;
    }

    root.classList.add('theme-fade');
    root.style.setProperty('--theme-fade', `${CSS_FADE_S}s`);
    onApplyTheme(to);

    window.clearTimeout(this.cssFadeTimer);
    this.cssFadeTimer = window.setTimeout(() => {
      root.classList.remove('theme-fade');
    }, CSS_FADE_S * 1000 + 40);
  }

  destroy(): void {
    this.destroyed = true;
    this.captureGen++;
    this.invalidateWarm();
    window.clearTimeout(this.cssFadeTimer);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('popstate', this.handleRouteOrDomChange);
    window.removeEventListener('hashchange', this.handleRouteOrDomChange);
    document.removeEventListener('click', this.handleDocumentClick, { capture: true });
    this.cancel();
    document.documentElement.classList.remove('theme-fade');
    this.renderer?.destroy();
  }
}
