"use client";

import { useState } from "react";
import {
  SOLO_ANNUAL_RATE,
  PALM_ANNUAL_RATE,
  yearsToTarget,
  displayYears,
} from "@/lib/annuity";

export const CALC_TARGETS = [
  { value: 5_000_000, label: "AR$ 5M · Vacaciones", short: "Vacaciones" },
  { value: 14_000_000, label: "AR$ 14M · Auto 0km", short: "Auto 0km" },
  { value: 50_000_000, label: "AR$ 50M · Cuota inicial", short: "Cuota inicial" },
  { value: 100_000_000, label: "AR$ 100M · Departamento", short: "Departamento" },
];

const ar = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
export const fmtAR = (n: number) => "AR$ " + ar.format(Math.round(n));

/** Shared calculator state + derived years. Identical math to the home calc. */
export function useCalc(initialMonthly = 95_000, initialTarget = 14_000_000) {
  const [monthly, setMonthly] = useState(initialMonthly);
  const [target, setTarget] = useState(initialTarget);

  const solo = displayYears(yearsToTarget(target, monthly, SOLO_ANNUAL_RATE));
  const palm = displayYears(yearsToTarget(target, monthly, PALM_ANNUAL_RATE));
  const saved = Math.max(0, solo - palm);

  return { monthly, setMonthly, target, setTarget, solo, palm, saved };
}
