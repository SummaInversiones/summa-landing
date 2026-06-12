'use client'

import CardGastosV2 from './CardGastosV2.jsx'
import CardGoalsV2 from './CardGoalsV2.jsx'
import CardPortfolioV2 from './CardPortfolioV2.jsx'
import CardToallaV2 from './CardToallaV2.jsx'
import '../CardsGrid.css'

/**
 * ProposalsPreview — página interna /cards-propuestas. Quedan acá las
 * propuestas NO promovidas. Las promovidas (2026-06-11, founder) ya son
 * las cards de producción en components/palm-cards/: CC ("el
 * resaltador") en Explore, y las 4 de confianza (scroll que frena, el
 * corte, el tanque, el ticket) en Comparativa — verlas en la home o en
 * /cards-nuevas. Si se promueve otra: mover el componente al nivel de
 * palm-cards/ y cablearla en CardsGrid.
 */

const PENDIENTES = [
  {
    Card: CardGastosV2,
    concept: 'Caos → orden',
    note: 'Los gastos sueltos vuelan solos a su categoría; la velocidad es el mensaje. (Hoy: file → caja mágica → rows.)',
  },
  {
    Card: CardGoalsV2,
    concept: 'Se llena solo',
    note: 'Los aportes suben sin que nadie toque nada; objetivo cumplido → siguiente. (Hoy: pelota que salta entre arcos.)',
  },
  {
    Card: CardPortfolioV2,
    concept: 'El sastre',
    note: 'Tu perfil mueve los controles y la mezcla responde: causa→efecto de "a medida". (Hoy: donut que rebalancea.)',
  },
  {
    Card: CardToallaV2,
    concept: 'La toalla — extra, a modo de prueba',
    note: 'Dos manos escurren la toalla y gotea tu plata. "Te exprimen hasta la última gota."',
  },
]

export default function ProposalsPreview() {
  return (
    <section className="pvp-page">
      <div className="pvp-container">
        <header className="pvp-head">
          <span className="pvp-eyebrow">Preview interno — propuestas de animación</span>
          <h1>Propuestas pendientes.</h1>
          <p className="pvp-intro">
            Las promovidas (CC y las cuatro de confianza) ya son las cards de
            producción — verlas en la home o en <code>/cards-nuevas</code>.
            Estas siguen en evaluación contra sus versiones actuales.
          </p>
        </header>

        <div className="pv-explore__grid">
          {PENDIENTES.map(({ Card, concept, note }, i) => (
            <div key={concept} className="pvp-cell">
              <Card index={i} />
              <p className="pvp-note">
                <strong>{concept}.</strong> {note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
