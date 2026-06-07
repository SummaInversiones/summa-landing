export default function Explore() {
  return (
    <section className="explore section" id="explore-wip">
      <div className="container">
        <div className="explore__head">
          <h2 data-split-words>Un diagnóstico real. Un plan concreto.<br />Sin vueltas.</h2>
        </div>

        <div className="explore__grid">
          {/* Card 1 — Análisis / Cuentas claras */}
          <article className="pcard pcard--cc" data-card="cc" style={{ "--i": 0 } as React.CSSProperties}>
            <div className="pcard__bg" aria-hidden="true">
              {/* Blob array — each span = one blob.
                  --cx / --cy place the BLOB CENTER at (x%, y%) of the card.
                  --rot tilts the ellipse so the row doesn't look identical.
                  Color and size are global (in .pcard__blob CSS rule). */}
              <span className="pcard__blob" style={{ "--cx": "6%", "--cy": "38%", "--rot": "-28deg" } as React.CSSProperties}></span>
              <span className="pcard__blob" style={{ "--cx": "98%", "--cy": "58%", "--rot": "42deg" } as React.CSSProperties}></span>
              <span className="pcard__blob" style={{ "--cx": "40%", "--cy": "97%", "--rot": "14deg" } as React.CSSProperties}></span>
            </div>
            <h3 className="pcard__headline">
              Cuentas claras, problemas claros. Identificamos que es lo mejor para vos.
            </h3>
            <div className="pcard__visual">
              <div className="cc-frame">
                <div className="cc-coins" aria-hidden="true">
                  <img className="cc-spark" src="/Card 1/Estrellas card.png" alt="" />
                  <img className="cc-coin" src="/Card 1/Decorative circles card.png" alt="" />
                  <img className="cc-coin" src="/Card 1/Decorative circles card.png" alt="" />
                  <img className="cc-coin" src="/Card 1/Decorative circles card.png" alt="" />
                  <img className="cc-coin" src="/Card 1/Decorative circles card.png" alt="" />
                </div>
                <div className="cc-canvas">
                  <div className="cc-doc" aria-hidden="true">
                    <span className="cc-doc__line">tus números $$$$$$$$$$ tus números $$$$$$$$</span>
                    <span className="cc-doc__line">ros $$$$ tus números $$$$$$$ tus números $$$</span>
                    <span className="cc-doc__line">tus números $$$$$$$$ tus números $$$$$$$$$$</span>
                    <span className="cc-doc__line">$$$$$$$$ tus números $$$$$$ tus números $$$$</span>
                    <span className="cc-doc__line">números $$$$$$$ tus números $$$$$$$$$$ tus n</span>
                    <span className="cc-doc__line">tus números $$$$$$$$ ros $$$$ tus números $$</span>
                    <span className="cc-doc__line">$$$ tus números $$$$$ tus números $$$$$$$$$$</span>
                    <span className="cc-doc__line">ros $$$$ tus números $$$ tus números $$$$$$$</span>
                    <span className="cc-doc__line">tus números $$$$$$$$ tus números $$$$$$ tu n</span>
                    <span className="cc-doc__line">$$$$$$ tus números $$$$$$$$ tus números $$$$</span>
                    <span className="cc-doc__line">tus números $$$$$$$ ros $$$ tus números $$$$</span>
                    <span className="cc-doc__line">$$ tus números $$$$$$$$$$ tus números $$$$$$</span>
                  </div>
                  <div className="cc-doc-mag" aria-hidden="true">
                    <span className="cc-doc-mag__line">tus números $$$$$$$$$$ tus números $$$$$$$$</span>
                    <span className="cc-doc-mag__line">ros $$$$ tus números $$$$$$$ tus números $$$</span>
                    <span className="cc-doc-mag__line">tus números $$$$$$$$ tus números $$$$$$$$$$</span>
                    <span className="cc-doc-mag__line">$$$$$$$$ tus números $$$$$$ tus números $$$$</span>
                    <span className="cc-doc-mag__line">números $$$$$$$ tus números $$$$$$$$$$ tus n</span>
                    <span className="cc-doc-mag__line">tus números $$$$$$$$ ros $$$$ tus números $$</span>
                    <span className="cc-doc-mag__line">$$$ tus números $$$$$ tus números $$$$$$$$$$</span>
                    <span className="cc-doc-mag__line">ros $$$$ tus números $$$ tus números $$$$$$$</span>
                    <span className="cc-doc-mag__line">tus números $$$$$$$$ tus números $$$$$$ tu n</span>
                    <span className="cc-doc-mag__line">$$$$$$ tus números $$$$$$$$ tus números $$$$</span>
                    <span className="cc-doc-mag__line">tus números $$$$$$$ ros $$$ tus números $$$$</span>
                    <span className="cc-doc-mag__line">$$ tus números $$$$$$$$$$ tus números $$$$$$</span>
                  </div>
                  <img className="cc-lupa" src="/Card 1/Lupa pelada.png" alt="" aria-hidden="true" />
                </div>
              </div>
            </div>
          </article>

          {/* Card 2 — Objetivos / "Que tu dinero trabaje"
              Background art (mountain + goals only, transparent corners) lives in
              Card 2/Objetivos.png. Headline is a real HTML element overlaid on
              top-left. Only the white ball + dot trail animate, positioned in % of card. */}
          <article className="pcard pcard--goals" data-card="goals" style={{ "--i": 1 } as React.CSSProperties}>
            <h3 className="pcard__headline">Que tu trabaje<br />en base a tus<br />objetivos.</h3>
            <div className="pcard__visual">
              <img className="g2-bg" src="/Card 2/Objetivos.png" alt="" aria-hidden="true" />
              <div className="g2-trail" aria-hidden="true">
                <span className="g2-trail-dot"></span>
                <span className="g2-trail-dot"></span>
                <span className="g2-trail-dot"></span>
                <span className="g2-trail-dot"></span>
                <span className="g2-trail-dot"></span>
                <span className="g2-trail-dot"></span>
              </div>
              <div className="g2-ball" aria-hidden="true"></div>
            </div>
          </article>

          {/* Card 3 — Portafolio / "Tu portafolio. Armado solo para vos."
              Same shell (navy bg, blob system, headline class). Visual is a 4-segment
              donut built with circles + pathLength="100" + dasharray/offset.
              Initial state in HTML is the FINAL visible state — JS knocks it back to
              hidden right after page load so reduceMotion users see the donut correctly. */}
          <article className="pcard pcard--portfolio" data-card="portfolio" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="pcard__bg" aria-hidden="true">
              <span className="pcard__blob" style={{ "--cx": "4%", "--cy": "30%", "--rot": "-22deg" } as React.CSSProperties}></span>
              <span className="pcard__blob" style={{ "--cx": "96%", "--cy": "42%", "--rot": "34deg" } as React.CSSProperties}></span>
              <span className="pcard__blob" style={{ "--cx": "38%", "--cy": "104%", "--rot": "8deg" } as React.CSSProperties}></span>
            </div>
            <h3 className="pcard__headline">Tu <span className="kw">portafolio</span>. Armado solo para vos.</h3>
            <div className="pcard__visual">
              <svg className="g3-scene" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Outer <g>: static positioning (translate to donut centre).
                    Inner <g>: JS writes rotate() to it for the idle loop.
                    Arcs live inside the inner <g> with their own rotate() so
                    each segment's dash starts at the right angle. */}
                <g className="g3-donut-pos" transform="translate(150 110)">
                  <g className="g3-donut-rot">
                    {/* 40% lila — starts at 12 o'clock (rotate -90) */}
                    <circle className="g3-arc" r={75} pathLength={100} fill="none"
                            stroke="#7B8BD4" strokeWidth={28}
                            strokeDasharray="40 60" strokeDashoffset={0}
                            transform="rotate(-90)"/>
                    {/* 25% gold — starts at 40% mark (-90 + 40 × 3.6 = 54) */}
                    <circle className="g3-arc" r={75} pathLength={100} fill="none"
                            stroke="#F2C44D" strokeWidth={28}
                            strokeDasharray="25 75" strokeDashoffset={0}
                            transform="rotate(54)"/>
                    {/* 20% cream — starts at 65% mark (-90 + 65 × 3.6 = 144) */}
                    <circle className="g3-arc" r={75} pathLength={100} fill="none"
                            stroke="#FBF3DC" strokeWidth={28}
                            strokeDasharray="20 80" strokeDashoffset={0}
                            transform="rotate(144)"/>
                    {/* 15% white — starts at 85% mark (-90 + 85 × 3.6 = 216) */}
                    <circle className="g3-arc" r={75} pathLength={100} fill="none"
                            stroke="#FFFFFF" strokeWidth={28}
                            strokeDasharray="15 85" strokeDashoffset={0}
                            transform="rotate(216)"/>
                  </g>
                  {/* Balance text — JS overwrites textContent during count-up.
                      Default 100% is the FINAL value (so reduceMotion shows it). */}
                  <text className="g3-balance" x={0} y={0}
                        textAnchor="middle" dominantBaseline="central"
                        fill="#FFFCF5" fontSize={42} fontWeight={700}>100%</text>
                </g>
              </svg>
            </div>
          </article>

          {/* Card 4 — Cero comisiones / "Las comisiones escondidas acá no existen."
              Lila bg (matches Card 2). Visual: a big static 0% + 3 fee-pills that
              pop in, hold, and dissolve. No blobs — bg is already lila. */}
          <article className="pcard pcard--zero" data-card="zero" style={{ "--i": 3 } as React.CSSProperties}>
            <h3 className="pcard__headline">Las comisiones escondidas acá no existen.</h3>
            <div className="pcard__visual">
              <div className="g4-stage">
                <div className="g4-zero">0%</div>
                {/* Each pill = 3 layers (wrap / bob / pill). JS positions the wrap,
                    Motion bobs the middle, JS dissolves the inner. */}
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
