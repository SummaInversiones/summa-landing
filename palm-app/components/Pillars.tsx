export default function Pillars() {
  return (
    <section className="pillars section" id="pilares">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow reveal">Dos herramientas. Un solo lugar.</span>
          <h2 data-split-words>Elegí por dónde <span className="kw">empezar</span>.</h2>
        </div>

        <div className="pillars-grid">
          <article className="pillar-card pillar-card--gold reveal" data-tilt>
            <span className="pillar-badge free">Gratuito</span>
            <h3 className="pillar-title">Gestión financiera <span className="kw">inteligente</span></h3>
            <p className="pillar-desc">Subí tu resumen bancario y Palm organiza tus gastos, identifica oportunidades de ahorro y te muestra exactamente en qué va tu plata. Sin costo, para siempre.</p>
            <ul className="pillar-features gold">
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Análisis de gastos por categoría</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Calendario de gastos mensual</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Recomendaciones de ahorro personalizadas</li>
            </ul>
            <a href="#download" className="pillar-cta gold">Descargar gratis →</a>
          </article>

          <article className="pillar-card pillar-card--shiny reveal" data-delay="100" data-tilt>
            <span className="pillar-badge paid"><span className="num">USD 12.50</span> / mes</span>
            <h3 className="pillar-title">Asesoramiento <span className="kw">personalizado</span> de inversiones</h3>
            <p className="pillar-desc">Te armamos un portfolio a medida según tus objetivos y tu perfil de riesgo. Sin letra chica, sin sorpresas. Solo un plan claro para que tu plata trabaje para vos.</p>
            <ul className="pillar-features violet">
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Perfil de inversor en 4 minutos</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Portfolio optimizado por objetivos</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Seguimiento y rebalanceo continuo</li>
            </ul>
            <a href="#download" className="shiny-cta"><span>Quiero invertir →</span></a>
            <p className="pillar-note">* Acceso por invitación. Los primeros cupos ya están abiertos.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
