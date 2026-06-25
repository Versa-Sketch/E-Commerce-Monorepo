import type { BargainTheme } from '../types/theme';

export type ProbabilityTone = 'high' | 'medium' | 'low';

export function getProbabilityTone(probability: number): ProbabilityTone {
  if (probability > 60) return 'high';
  if (probability >= 30) return 'medium';
  return 'low';
}

export function getProbabilityColors(theme: BargainTheme, probability: number) {
  const tone = getProbabilityTone(probability);
  if (tone === 'high') return { bar: theme.colors.success, text: theme.colors.success };
  if (tone === 'medium') return { bar: theme.colors.warning, text: theme.colors.warning };
  return { bar: theme.colors.danger, text: theme.colors.danger };
}

/** Simple linear fallback used when the host hasn't supplied real negotiation odds yet. */
export function estimateLinearProbability(price: number, min: number, max: number): number {
  if (max <= min) return 0;
  const clamped = Math.min(Math.max(price, min), max);
  return Math.round(((clamped - min) / (max - min)) * 100);
}
