import { describe, it, expect } from "vitest";
import { slideTransform } from "./transforms";

describe("slideTransform", () => {
  it("is the identity at the center (distance 0)", () => {
    expect(slideTransform(0)).toEqual({ scale: 1, opacity: 1, rotateY: 0 });
  });

  it("shrinks and dims with distance", () => {
    const near = slideTransform(1);
    expect(near.scale).toBeCloseTo(0.82, 5);
    expect(near.opacity).toBeCloseTo(0.55, 5);
    expect(Math.abs(near.rotateY)).toBeCloseTo(18, 5);
  });

  it("is symmetric in scale/opacity and opposite in rotateY", () => {
    const l = slideTransform(-1);
    const r = slideTransform(1);
    expect(l.scale).toBeCloseTo(r.scale, 5);
    expect(l.opacity).toBeCloseTo(r.opacity, 5);
    expect(l.rotateY).toBeCloseTo(-r.rotateY, 5);
  });

  it("clamps beyond 2 slides away (no runaway shrink)", () => {
    expect(slideTransform(5)).toEqual(slideTransform(2));
  });
});
