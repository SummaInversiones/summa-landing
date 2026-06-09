"use client";

import React from "react";
import { useCalc, fmtAR, CALC_TARGETS } from "@/components/CalcGallery/useCalc";

export default function Calculator() {
  const c = useCalc();
  const palmW = c.solo > 0 ? Math.max(8, Math.round((c.palm / c.solo) * 100)) : 100;
  const yrs = (n: number) => (n === 1 ? "año" : "años");

  return (
    <section className="calc-section section" id="calculadora" aria-labelledby="calc-section-title">
      <div className="container">
        <div className="calc-section__head">
          <h2 id="calc-section-title" className="calc-section__title" data-split-words>
            Hacé el <span className="kw">cálculo</span>.
          </h2>
        </div>

        <article className="calc-card calc-card--home reveal" data-delay="300">
          <div className="calc-sky" aria-hidden="true">
            <span className="calc-cloud" style={{ "--x": "16%", "--y": "18%", "--s": 1.1 } as React.CSSProperties}></span>
            <span className="calc-cloud" style={{ "--x": "88%", "--y": "40%", "--s": 0.8 } as React.CSSProperties}></span>
            <span className="calc-cloud" style={{ "--x": "62%", "--y": "86%", "--s": 1.35 } as React.CSSProperties}></span>
            <span className="calc-cloud" style={{ "--x": "30%", "--y": "60%", "--s": 0.7 } as React.CSSProperties}></span>
          </div>

          <div className="calc-card__body">
            <div className="cc-field">
              <div className="cc-label-row">
                <label htmlFor="home-calc-monthly">Aporte mensual</label>
                <output htmlFor="home-calc-monthly" className="cc-out">{fmtAR(c.monthly)}</output>
              </div>
              <input
                type="range"
                id="home-calc-monthly"
                min={20000}
                max={500000}
                step={5000}
                value={c.monthly}
                onChange={(e) => c.setMonthly(+e.target.value)}
                aria-label="Aporte mensual en pesos"
              />
            </div>

            <div className="cc-field">
              <label htmlFor="home-calc-target">Tu objetivo</label>
              <select
                id="home-calc-target"
                value={c.target}
                onChange={(e) => c.setTarget(+e.target.value)}
                aria-label="Objetivo financiero"
              >
                {CALC_TARGETS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cc-bars">
              <div className="cc-bar-row cc-bar-row--solo">
                <span className="cc-bar-label">Vos solo</span>
                <div className="cc-bar-track">
                  <div className="cc-bar cc-bar--solo" style={{ width: "100%" }} />
                </div>
                <span className="cc-bar-val">{c.solo} a</span>
              </div>
              <div className="cc-bar-row cc-bar-row--palm">
                <span className="cc-bar-label">Con Palm</span>
                <div className="cc-bar-track">
                  <div className="cc-bar cc-bar--palm" style={{ width: palmW + "%" }} />
                </div>
                <span className="cc-bar-val">{c.palm} a</span>
              </div>
            </div>

            <p className="cc-savings">
              Te ahorrás <strong>{c.saved} {yrs(c.saved)}</strong> de tu vida.
            </p>

            <p className="calc-disclaimer">
              Cálculo orientativo. Asume <span className="num">0%</span> sobre el ahorro y{" "}
              <span className="num">15%</span> anual con Palm. Las inversiones tienen riesgo.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
