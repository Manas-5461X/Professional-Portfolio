import type { ThemeMode } from './types';

export interface InkParams {
  /** Seconds for the spread (before the short fade onto the live DOM). */
  duration: number;
  /** Tendril reach multiplier, 0 = clean blob. */
  tendril: number;
  /** Noise frequency multiplier: lower = bigger, calmer shapes. */
  noiseScale: number;
  /** Frontier half-width in CSS px. */
  softness: number;
  /** Speed at which the organic frontier evolves during the spread. */
  drift: number;
}

export const inkParams: InkParams = {
  duration: 1.15,
  tendril: 1.05,
  noiseScale: 1.0,
  softness: 1.4,
  drift: 1.0
};

/**
 * Pigment rim colour pooled briefly along the ink front,
 * tuned to the portfolio's editorial light (#FAFAFA) and dark (#181818) surfaces.
 */
export const RIM_COLOR: Record<ThemeMode, [number, number, number]> = {
  dark: [0.071, 0.071, 0.063],
  light: [0.933, 0.918, 0.886]
};

