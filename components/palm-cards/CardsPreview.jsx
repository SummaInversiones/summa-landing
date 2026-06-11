'use client'

import CardsGrid from './CardsGrid.jsx'
import BentoCards from './BentoCards.jsx'

/**
 * CardsPreview — página interna /cards-nuevas. Renderiza los dos grupos
 * que usa la home: el grid Explore (producto) y el bento de Comparativa
 * (confianza), con headers propios.
 */
export default function CardsPreview() {
  return (
    <section className="pv-explore">
      <div className="pv-explore__container">
        <header className="pv-explore__head">
          <span className="pv-explore__eyebrow">Preview interno — sección Explore</span>
          <h2>
            Las herramientas que te <span className="pv-kw">acompañan</span>.
          </h2>
        </header>
        <CardsGrid />

        <header className="pv-explore__head" style={{ marginTop: 96 }}>
          <span className="pv-explore__eyebrow">Preview interno — bento Comparativa</span>
          <h2>
            ¿Por qué <span className="pv-kw">Palm</span>?
          </h2>
        </header>
        <BentoCards />
      </div>
    </section>
  )
}
