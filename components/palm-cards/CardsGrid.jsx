'use client'

import { useRef } from 'react'
import CardGastos from './CardGastos.jsx'
import CardCC from './CardCC.jsx'
import CardGoals from './CardGoals.jsx'
import CardPortfolio from './CardPortfolio.jsx'
import useScrollStack from './useScrollStack.js'
import './CardsGrid.css'

/**
 * CardsGrid — fila de 4 cards "producto" de la sección Explore de la home
 * (snapshot utils/palm-react/cards-export, clases prefijadas pv-).
 * Las 4 cards "confianza" (mass / privacy / drain / zero) viven en
 * BentoCards.jsx, dentro del bento de Comparativa.
 * En ≤768px useScrollStack apila las cards con sticky + scale.
 */
export default function CardsGrid() {
  const gridRef = useRef(null)
  useScrollStack(gridRef)

  return (
    <div className="pv-explore__grid" ref={gridRef}>
      <CardGastos index={0} />
      <CardCC index={1} />
      <CardGoals index={2} />
      <CardPortfolio index={3} />
    </div>
  )
}
