'use client'

import CardsGrid from './CardsGrid.jsx'

/**
 * CardsPreview — página interna /cards-nuevas. Renderiza el mismo
 * CardsGrid que la home (sección Explore) con un header propio.
 */
export default function CardsPreview() {
  return (
    <section className="pv-explore">
      <div className="pv-explore__container">
        <header className="pv-explore__head">
          <span className="pv-explore__eyebrow">Preview interno — cards nuevas</span>
          <h2>
            Las herramientas que te <span className="pv-kw">acompañan</span>.
          </h2>
        </header>
        <CardsGrid />
      </div>
    </section>
  )
}
