'use client'

import CardMass from './CardMass.jsx'
import CardPrivacy from './CardPrivacy.jsx'
import CardDrain from './CardDrain.jsx'
import CardZero from './CardZero.jsx'
import './BentoCards.css'

/**
 * BentoCards — bento de la sección Comparativa ("¿Por qué Palm?") con las
 * 4 cards "confianza" del export del diseñador. Reemplaza los tiles viejos
 * (hero chart, donut 73%, split de carteras y el .pcard--zero legacy):
 * estas cards cuentan lo mismo — masa vs foco, el precio del gratis,
 * comisiones ocultas y 0% — con las animaciones nuevas.
 */
export default function BentoCards() {
  return (
    <div className="pv-bento">
      <CardMass index={0} />
      <CardPrivacy index={1} />
      <CardDrain index={2} />
      <CardZero index={3} />
    </div>
  )
}
