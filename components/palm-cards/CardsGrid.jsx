'use client'

import { useRef } from 'react'
import CardCC from './CardCC.jsx'
import CardGoals from './CardGoals.jsx'
import CardPortfolio from './CardPortfolio.jsx'
import CardGastos from './CardGastos.jsx'
import CardPrivacy from './CardPrivacy.jsx'
import CardDrain from './CardDrain.jsx'
import CardMass from './CardMass.jsx'
import useScrollStack from './useScrollStack.js'
import './CardsGrid.css'

/**
 * CardsGrid — grid de producción con las cards del diseñador
 * (snapshot utils/palm-react/cards-export, clases prefijadas pv-).
 * Monta las 7 cards que montaba el App.jsx del export; CardZero quedó
 * afuera ahí también (su mensaje lo cubre CardDrain) pero vive en este
 * folder por si se suma. En ≤768px useScrollStack apila las cards con
 * sticky + scale (el patrón del export).
 */
export default function CardsGrid() {
  const gridRef = useRef(null)
  useScrollStack(gridRef)

  return (
    <div className="pv-explore__grid" ref={gridRef}>
      <CardCC index={0} />
      <CardGoals index={1} />
      <CardPortfolio index={2} />
      <CardGastos index={3} />
      <CardPrivacy index={4} />
      <CardDrain index={5} />
      <CardMass index={6} />
    </div>
  )
}
