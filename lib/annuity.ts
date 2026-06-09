/**
 * Compound-annuity time-to-target math for the calculator.
 * Ported verbatim from index.html (the mathjs and Math.log paths there are
 * mathematically identical, so no mathjs dependency is needed).
 * Assumptions are disclosed in the calculator disclaimer and locked here.
 */

export const SOLO_ANNUAL_RATE = 0; // pure savings, no real return
export const PALM_ANNUAL_RATE = 0.15; // implied advisory product return

/** Years for monthly contributions PMT to reach future value FV at an annual rate. */
export function yearsToTarget(
  futureValue: number,
  monthlyContribution: number,
  annualRate: number,
): number {
  if (annualRate === 0) {
    return futureValue / monthlyContribution / 12;
  }
  const r = annualRate / 12;
  const months =
    Math.log(1 + (futureValue * r) / monthlyContribution) / Math.log(1 + r);
  return months / 12;
}

/** What the UI shows: whole years, never below 1 (matches index.html). */
export function displayYears(years: number): number {
  return Math.max(1, Math.round(years));
}
