export default function Comparativa() {
  return (
    <section className="security section" id="seguridad" aria-labelledby="seguridad-title">
      <div className="container">
        <h2 id="seguridad-title" className="security__title" data-split-words>
          ¿Por qué <span className="kw">Palm</span>?
        </h2>

        <div className="security-bento reveal" data-delay="300">

          {/* Bento hero — fees + growth divergence */}
          <article className="bento-card bento-card--hero">
            <span className="bento-card__shine" aria-hidden="true"></span>
            <span className="bento-card__eyebrow">Comisiones + crecimiento</span>
            <h3 className="bento-card__title">Hasta <span className="kw">+$4,2M</span> en tu bolsillo a 10 años.</h3>

            <div className="bento-card__chart" aria-label="Broker X 2-6 por ciento vs Palm 0 por ciento">
              <div className="bento-chart-row">
                <span className="bento-chart-label">Broker X</span>
                <div className="bento-chart-track">
                  <div className="bento-chart-bar bento-chart-bar--range" style={{ "--bar-w": "100%", transitionDelay: "0.15s" } as React.CSSProperties}></div>
                </div>
                <span className="bento-chart-pct">2–6%</span>
              </div>
              <div className="bento-chart-row bento-chart-row--palm">
                <span className="bento-chart-label">Palm</span>
                <div className="bento-chart-track">
                  <div className="bento-chart-bar bento-chart-bar--palm" style={{ "--bar-w": "2%", transitionDelay: "0.35s" } as React.CSSProperties}></div>
                </div>
                <span className="bento-chart-pct bento-chart-pct--palm">0%</span>
              </div>
            </div>

            <div className="bento-card__divergence" aria-label="Crecimiento comparativo a 10 años">
              <svg viewBox="0 0 360 110" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="bento-gap-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="#F0C14D" stopOpacity={0.32}/>
                    <stop offset="100%" stopColor="#F0C14D" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                {/* gap area between Palm (top) and competitor (bottom) */}
                <path className="bento-div-gap"
                      d="M 0 88 C 60 80 120 64 180 48 C 240 32 300 18 360 8
                         L 360 60 C 300 52 240 48 180 50 C 120 52 60 60 0 70 Z"
                      fill="url(#bento-gap-grad)" />
                {/* competitor line */}
                <path className="bento-div-line bento-div-line--comp"
                      d="M 0 88 C 60 80 120 76 180 70 C 240 64 300 60 360 60"
                      fill="none" stroke="rgba(255,107,107,0.85)" strokeWidth={2} strokeDasharray="4 4"/>
                {/* palm line */}
                <path className="bento-div-line bento-div-line--palm"
                      d="M 0 88 C 60 70 120 50 180 36 C 240 22 300 12 360 8"
                      fill="none" stroke="var(--gold)" strokeWidth={2.5}/>
                {/* endpoint dots */}
                <circle className="bento-div-endpoint" cx={360} cy={8}  r={3.5} fill="var(--gold)"/>
                <circle cx={360} cy={60} r={3}   fill="rgba(255,107,107,0.85)"/>
              </svg>
              <div className="bento-div-legend">
                <span className="bento-div-legend__item bento-div-legend__item--palm">Palm</span>
                <span className="bento-div-legend__item bento-div-legend__item--comp">Broker X</span>
                <span className="bento-div-legend__years">10 años</span>
              </div>
            </div>
          </article>

          {/* Bento card — gratis = producto */}
          <article className="bento-card">
            <span className="bento-card__shine" aria-hidden="true"></span>
            <span className="bento-card__eyebrow bento-card__eyebrow--warn">El precio del &quot;gratis&quot;</span>
            <h3 className="bento-card__title">Si es gratis, sos el <span className="kw">producto</span>.</h3>

            <div className="bento-card__donut" aria-label="73 por ciento de las apps gratis monetizan tus datos">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx={60} cy={60} r={48} fill="none" stroke="rgba(255,252,245,0.06)" strokeWidth={14}/>
                <circle className="bento-donut-arc"
                        cx={60} cy={60} r={48} fill="none"
                        stroke="var(--gold)" strokeWidth={14}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        strokeDasharray="220 302" strokeDashoffset={0}/>
              </svg>
              <div className="bento-donut-center">
                <span className="bento-donut-num"><span data-count="73" data-prefix="">0</span><small>%</small></span>
                <span className="bento-donut-cap">apps gratis venden tu data</span>
              </div>
            </div>
          </article>

          {/* Bento card — sin plan personalizado */}
          <article className="bento-card">
            <span className="bento-card__shine" aria-hidden="true"></span>
            <span className="bento-card__eyebrow bento-card__eyebrow--warn">El otro modelo</span>
            <h3 className="bento-card__title">Tu cartera, no <span className="kw">la de todos</span>.</h3>

            <div className="bento-card__split" aria-label="Comparación de carteras ofrecidas">
              <div className="bento-split__half bento-split__half--other">
                <span className="bento-split__big num"><span data-count="5" data-prefix="">0</span></span>
                <span className="bento-split__lbl">carteras<br/>para todos</span>
              </div>
              <div className="bento-split__div" aria-hidden="true"></div>
              <div className="bento-split__half bento-split__half--palm">
                <span className="bento-split__big num"><span data-count="1" data-prefix="">0</span></span>
                <span className="bento-split__lbl">cartera<br/>para vos</span>
              </div>
            </div>
          </article>

          {/* Comisiones ocultas — 0% + drifting fee-pills, as a bento tile */}
          <article className="pcard pcard--zero bento-card--fees" data-card="zero" style={{ "--i": 0 } as React.CSSProperties}>
            <h3 className="pcard__headline">Las comisiones escondidas acá no existen.</h3>
            <div className="pcard__visual">
              <div className="g4-stage">
                <div className="g4-zero">0%</div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-7deg" } as React.CSSProperties}>comisión de mantenimiento</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "5deg" } as React.CSSProperties}>costo de custodia</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-3deg" } as React.CSSProperties}>cargo oculto</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
