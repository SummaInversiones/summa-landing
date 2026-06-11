'use client'

import { useRef } from 'react'
import CardMass from './CardMass.jsx'
import CardPrivacy from './CardPrivacy.jsx'
import CardDrain from './CardDrain.jsx'
import CardZero from './CardZero.jsx'
import useScrollStack from './useScrollStack.js'
import './CardsGrid.css'

/**
 * BentoCards — fila de 4 cards "confianza" de la sección Comparativa
 * ("¿Por qué Palm?"): mass, privacy, drain y zero. Misma estructura que
 * CardsGrid en Explore (fila 4-up alineada, sticky-stack en ≤768px).
 */
export default function BentoCards() {
  const gridRef = useRef(null)
  useScrollStack(gridRef)

  return (
    <div className="pv-explore__grid" ref={gridRef}>
      <CardMass index={0} />
      <CardPrivacy index={1} />
      <CardDrain index={2} />
      <CardZero index={3} />
    </div>
  )
}
