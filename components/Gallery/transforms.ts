export interface SlideTransform {
  scale: number;
  opacity: number;
  rotateY: number;
}

/**
 * Map a slide's signed distance from the focused slide (in slide units —
 * 0 = centered, ±1 = one slide away) to a coverflow transform.
 * Symmetric falloff, clamped at 2 slides so far cards don't vanish/invert.
 */
export function slideTransform(distance: number): SlideTransform {
  const ad = Math.min(Math.abs(distance), 2);
  const scale = 1 - 0.18 * ad; // 1 → 0.82 (±1) → 0.64 (±2)
  const opacity = 1 - 0.45 * ad; // 1 → 0.55 (±1) → 0.10 (±2)
  const rotateY = -Math.sign(distance) * Math.min(ad, 1) * 18 || 0; // 0 → ∓18° (|| 0 normalizes -0)
  return { scale, opacity, rotateY };
}
