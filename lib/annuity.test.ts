import { describe, it, expect } from "vitest";
import {
  SOLO_ANNUAL_RATE,
  PALM_ANNUAL_RATE,
  yearsToTarget,
  displayYears,
} from "./annuity";

describe("annuity rates", () => {
  it("locks the disclosed assumptions", () => {
    expect(SOLO_ANNUAL_RATE).toBe(0);
    expect(PALM_ANNUAL_RATE).toBe(0.15);
  });
});

describe("yearsToTarget", () => {
  it("uses linear division when the rate is 0", () => {
    // 12,000,000 / 100,000 = 120 months = exactly 10 years
    expect(yearsToTarget(12_000_000, 100_000, 0)).toBe(10);
  });

  it("uses the compound-annuity formula when the rate is positive", () => {
    const years = yearsToTarget(14_000_000, 95_000, PALM_ANNUAL_RATE);
    expect(years).toBeGreaterThan(6.8);
    expect(years).toBeLessThan(7.2);
  });
});

describe("displayYears", () => {
  it("rounds to a whole number", () => {
    expect(displayYears(7.0082)).toBe(7);
  });
  it("never returns less than 1", () => {
    expect(displayYears(0.3)).toBe(1);
  });
  it("reproduces the section-map default: solo 12, Palm 7, saved 5", () => {
    const solo = displayYears(yearsToTarget(14_000_000, 95_000, SOLO_ANNUAL_RATE));
    const palm = displayYears(yearsToTarget(14_000_000, 95_000, PALM_ANNUAL_RATE));
    expect(solo).toBe(12);
    expect(palm).toBe(7);
    expect(Math.max(0, solo - palm)).toBe(5);
  });
});
