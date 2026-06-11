'use client'

import CardGastosV2 from './CardGastosV2.jsx'
import CardCCV2 from './CardCCV2.jsx'
import CardGoalsV2 from './CardGoalsV2.jsx'
import CardPortfolioV2 from './CardPortfolioV2.jsx'
import CardMassV2 from './CardMassV2.jsx'
import CardPrivacyV2 from './CardPrivacyV2.jsx'
import CardDrainV2 from './CardDrainV2.jsx'
import CardZeroV2 from './CardZeroV2.jsx'
import '../CardsGrid.css'

/**
 * ProposalsPreview — página interna /cards-propuestas. Animaciones
 * alternativas para los mismos 8 títulos: cada una construida alrededor
 * de UNA metáfora causa→efecto distinta de la versión en producción.
 * Las captions explican qué transmite cada propuesta — son chrome de
 * preview, no van a la home.
 */

const PRODUCTO = [
  {
    Card: CardGastosV2,
    concept: 'Caos → orden',
    note: 'Los gastos sueltos vuelan solos a su categoría; la velocidad es el mensaje. (Hoy: file → caja mágica → rows.)',
  },
  {
    Card: CardCCV2,
    concept: 'El resaltador',
    note: 'Del ruido $$$ emerge una línea legible: el insight concreto que Palm encuentra. (Hoy: lupa que magnifica.)',
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
]

const CONFIANZA = [
  {
    Card: CardMassV2,
    concept: 'Número → nombre',
    note: 'Una pila de "cliente #…" idénticos; la del medio se enciende y dice "vos.". (Hoy: zoom out a la masa de puntos.)',
  },
  {
    Card: CardPrivacyV2,
    concept: 'El corte',
    note: 'Tus datos fluyen hacia anunciantes/terceros hasta que el escudo corta las líneas. (Hoy: teléfono sifoneado.)',
  },
  {
    Card: CardDrainV2,
    concept: 'El tanque',
    note: 'Tu plata gotea por fugas etiquetadas; los parches dorados las sellan y el nivel vuelve. (Hoy: barra atacada por pills.)',
  },
  {
    Card: CardZeroV2,
    concept: 'El ticket',
    note: 'Un recibo se imprime con todo en $0 y recibe el sello. La prueba, impresa. (Hoy: 0% que disuelve pills.)',
  },
]

function Group({ items }) {
  return (
    <div className="pv-explore__grid">
      {items.map(({ Card, concept, note }, i) => (
        <div key={concept} className="pvp-cell">
          <Card index={i} />
          <p className="pvp-note">
            <strong>{concept}.</strong> {note}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function ProposalsPreview() {
  return (
    <section className="pvp-page">
      <div className="pvp-container">
        <header className="pvp-head">
          <span className="pvp-eyebrow">Preview interno — propuestas de animación</span>
          <h1>Mismos títulos, otra metáfora por card.</h1>
          <p className="pvp-intro">
            Cada propuesta toma el título de una card en producción y lo cuenta
            con una animación distinta. Comparar contra <code>/cards-nuevas</code>.
          </p>
        </header>

        <h2 className="pvp-group-title">Explore — producto</h2>
        <Group items={PRODUCTO} />

        <h2 className="pvp-group-title" style={{ marginTop: 72 }}>
          Comparativa — confianza
        </h2>
        <Group items={CONFIANZA} />
      </div>
    </section>
  )
}
