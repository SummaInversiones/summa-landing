"use client";

import { useState } from "react";
import {
  SOLO_ANNUAL_RATE,
  PALM_ANNUAL_RATE,
  yearsToTarget,
  displayYears,
} from "@/lib/annuity";

const ar = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const fmtAR = (n: number) => "AR$ " + ar.format(Math.round(n));

const TARGETS = [
  { value: 5_000_000, label: "AR$ 5M · Vacaciones" },
  { value: 14_000_000, label: "AR$ 14M · Auto 0km" },
  { value: 50_000_000, label: "AR$ 50M · Cuota inicial" },
  { value: 100_000_000, label: "AR$ 100M · Apartamento" },
];

export default function Calculator() {
  const [monthly, setMonthly] = useState(95_000);
  const [target, setTarget] = useState(14_000_000);

  const solo = displayYears(yearsToTarget(target, monthly, SOLO_ANNUAL_RATE));
  const palm = displayYears(yearsToTarget(target, monthly, PALM_ANNUAL_RATE));
  const saved = Math.max(0, solo - palm);

  return (
    <section className="calc-section section" id="calculadora" aria-labelledby="calc-section-title">
      <div className="container">
        <div className="calc-section__head">
          <p className="calc-section__eyebrow reveal">Probálo en vivo</p>
          <h2 id="calc-section-title" className="calc-section__title" data-split-words>
            Hacé el <span className="kw">cálculo</span>.
          </h2>
          <p className="calc-section__lede reveal" data-delay="200">
            Movés el aporte mensual y elegís un objetivo. Te mostramos en cuántos años llegás solo y cuántos te ahorrás con Palm.
          </p>
        </div>

        <div className="calc reveal" data-delay="300" id="vs-calc">
          <div className="calc-field">
            <div className="calc-label-row">
              <label htmlFor="calc-monthly">Aporte mensual</label>
              <output className="calc-out" id="calc-monthly-out" htmlFor="calc-monthly">
                {fmtAR(monthly)}
              </output>
            </div>
            <input
              type="range"
              id="calc-monthly"
              min={20000}
              max={500000}
              step={5000}
              value={monthly}
              onChange={(e) => setMonthly(+e.target.value)}
              aria-label="Aporte mensual en pesos"
            />
          </div>

          <div className="calc-field">
            <label htmlFor="calc-target">Tu objetivo</label>
            <select
              id="calc-target"
              value={target}
              onChange={(e) => setTarget(+e.target.value)}
              aria-label="Objetivo financiero"
            >
              {TARGETS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="calc-rule" />

          <div className="calc-results">
            <div className="calc-col">
              <span className="calc-col-label">Vos solo</span>
              <span className="calc-years num" id="calc-years-solo">{solo}</span>
              <span className="calc-col-unit">años</span>
            </div>
            <div className="calc-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="calc-col">
              <span className="calc-col-label">Con Palm</span>
              <span className="calc-years num gold" id="calc-years-palm">{palm}</span>
              <span className="calc-col-unit">años</span>
            </div>
          </div>

          <p className="calc-savings">
            Te ahorrás{" "}
            <strong id="calc-saved-years">
              <span className="num">{saved} {saved === 1 ? "año" : "años"}</span>
            </strong>{" "}
            de tu vida.
          </p>

          <p className="calc-disclaimer">
            Cálculo orientativo. Asume <span className="num">0%</span> sobre el ahorro y{" "}
            <span className="num">15%</span> anual con Palm. Las inversiones tienen riesgo.
          </p>
        </div>
      </div>
    </section>
  );
}
