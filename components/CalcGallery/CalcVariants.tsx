"use client";

import React from "react";
import { useCalc, fmtAR, CALC_TARGETS } from "./useCalc";

/* ── Shared controls ──────────────────────────────────────────────────── */

function MonthlySlider({
  id,
  monthly,
  setMonthly,
}: {
  id: string;
  monthly: number;
  setMonthly: (n: number) => void;
}) {
  return (
    <div className="cc-field">
      <div className="cc-label-row">
        <label htmlFor={id}>Aporte mensual</label>
        <output htmlFor={id} className="cc-out">
          {fmtAR(monthly)}
        </output>
      </div>
      <input
        type="range"
        id={id}
        min={20000}
        max={500000}
        step={5000}
        value={monthly}
        onChange={(e) => setMonthly(+e.target.value)}
        aria-label="Aporte mensual en pesos"
      />
    </div>
  );
}

function GoalSelect({
  id,
  target,
  setTarget,
}: {
  id: string;
  target: number;
  setTarget: (n: number) => void;
}) {
  return (
    <div className="cc-field">
      <label htmlFor={id}>Tu objetivo</label>
      <select
        id={id}
        value={target}
        onChange={(e) => setTarget(+e.target.value)}
        aria-label="Objetivo financiero"
      >
        {CALC_TARGETS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function GoalPills({
  target,
  setTarget,
}: {
  target: number;
  setTarget: (n: number) => void;
}) {
  return (
    <div className="cc-pills" role="group" aria-label="Tu objetivo">
      {CALC_TARGETS.map((t) => (
        <button
          key={t.value}
          type="button"
          className={"cc-pill" + (t.value === target ? " is-active" : "")}
          aria-pressed={t.value === target}
          onClick={() => setTarget(t.value)}
        >
          {t.short}
        </button>
      ))}
    </div>
  );
}

function CalcCard({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <article className="calc-card">
      <div className="calc-sky" aria-hidden="true">
        <span className="calc-cloud" style={{ "--x": "16%", "--y": "18%", "--s": 1.1 } as React.CSSProperties}></span>
        <span className="calc-cloud" style={{ "--x": "88%", "--y": "40%", "--s": 0.8 } as React.CSSProperties}></span>
        <span className="calc-cloud" style={{ "--x": "62%", "--y": "86%", "--s": 1.35 } as React.CSSProperties}></span>
        <span className="calc-cloud" style={{ "--x": "30%", "--y": "60%", "--s": 0.7 } as React.CSSProperties}></span>
      </div>
      <span className="calc-card__tag">{tag}</span>
      <div className="calc-card__body">{children}</div>
    </article>
  );
}

const yrs = (n: number) => (n === 1 ? "año" : "años");

/* ── Variant 1 — Clásica (vertical, two-column result) ────────────────── */

export function CalcClassic() {
  const c = useCalc();
  return (
    <CalcCard tag="01 · Clásica">
      <MonthlySlider id="v1-m" monthly={c.monthly} setMonthly={c.setMonthly} />
      <GoalSelect id="v1-g" target={c.target} setTarget={c.setTarget} />
      <hr className="cc-rule" />
      <div className="cc-results">
        <div className="cc-col">
          <span className="cc-col-label">Vos solo</span>
          <span className="cc-years">{c.solo}</span>
          <span className="cc-col-unit">años</span>
        </div>
        <div className="cc-arrow" aria-hidden="true">→</div>
        <div className="cc-col">
          <span className="cc-col-label">Con Palm</span>
          <span className="cc-years cc-gold">{c.palm}</span>
          <span className="cc-col-unit">años</span>
        </div>
      </div>
      <p className="cc-savings">
        Te ahorrás <strong>{c.saved} {yrs(c.saved)}</strong> de tu vida.
      </p>
    </CalcCard>
  );
}

/* ── Variant 2 — Resultado protagonista (giant saved-years hero) ──────── */

export function CalcHero() {
  const c = useCalc();
  return (
    <CalcCard tag="02 · Resultado protagonista">
      <div className="cc-hero">
        <span className="cc-hero-num cc-gold">{c.saved}</span>
        <span className="cc-hero-unit">{yrs(c.saved)} de tu vida, ahorrados con Palm</span>
      </div>
      <MonthlySlider id="v2-m" monthly={c.monthly} setMonthly={c.setMonthly} />
      <GoalSelect id="v2-g" target={c.target} setTarget={c.setTarget} />
      <p className="cc-subline">
        Solo: <strong>{c.solo}</strong> años · Con Palm: <strong className="cc-gold">{c.palm}</strong> años
      </p>
    </CalcCard>
  );
}

/* ── Variant 3 — Comparación visual (proportional bars) ───────────────── */

export function CalcBars() {
  const c = useCalc();
  const palmW = c.solo > 0 ? Math.max(8, Math.round((c.palm / c.solo) * 100)) : 100;
  return (
    <CalcCard tag="03 · Comparación visual">
      <MonthlySlider id="v3-m" monthly={c.monthly} setMonthly={c.setMonthly} />
      <GoalSelect id="v3-g" target={c.target} setTarget={c.setTarget} />
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
        Te ahorrás <strong>{c.saved} {yrs(c.saved)}</strong>.
      </p>
    </CalcCard>
  );
}

/* ── Variant 4 — Objetivo en pills (goal-forward) ─────────────────────── */

export function CalcPills() {
  const c = useCalc();
  return (
    <CalcCard tag="04 · Objetivo en pills">
      <GoalPills target={c.target} setTarget={c.setTarget} />
      <MonthlySlider id="v4-m" monthly={c.monthly} setMonthly={c.setMonthly} />
      <div className="cc-pill-result">
        <span className="cc-pill-result-num cc-gold">{c.palm}</span>
        <span className="cc-pill-result-unit">años con Palm</span>
        <span className="cc-pill-result-saved">
          Te ahorrás {c.saved} {yrs(c.saved)} vs. solo ({c.solo})
        </span>
      </div>
    </CalcCard>
  );
}
