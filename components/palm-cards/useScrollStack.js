import { useEffect } from 'react'

/**
 * useScrollStack — depth-based scale para cards apiladas en mobile.
 *
 * Reproduce el patrón vanilla del index.html original:
 *  - CSS `position: sticky; top: 80px` hace el pin (no Lenis).
 *  - JS computa "depth" sumando la fracción de "pinned-ness" de cada card siguiente.
 *  - Escribe `style.scale` (standalone, no transform) → compose con framer-motion translate.
 *  - Sólo activo en ≤768px y no reduce-motion. Listener no se monta fuera de eso.
 *
 * Uso: llamarlo en el componente que contiene las cards (App).
 * Recibe un ref al contenedor del grid (.explore__grid).
 */
export default function useScrollStack(gridRef) {
  useEffect(() => {
    const PIN_TOP = 80
    const TRANSITION_DIST = 220
    const ITEM_SCALE = 0.02
    const BASE_SCALE = 0.95

    const mq = window.matchMedia('(max-width: 768px)')
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)')

    let active = false
    let rafPending = false
    let cards = []

    const refreshCards = () => {
      const grid = gridRef.current
      cards = grid ? Array.from(grid.querySelectorAll('.pv-pcard')) : []
    }

    const update = () => {
      for (let i = 0; i < cards.length; i++) {
        let depth = 0
        for (let j = i + 1; j < cards.length; j++) {
          const gap = Math.max(0, cards[j].getBoundingClientRect().top - PIN_TOP)
          const p = Math.max(0, Math.min(1, (TRANSITION_DIST - gap) / TRANSITION_DIST))
          depth += p
        }
        const scale = Math.max(BASE_SCALE, 1 - depth * ITEM_SCALE)
        cards[i].style.scale = scale.toFixed(4)
      }
    }

    const onScroll = () => {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(() => {
        rafPending = false
        update()
      })
    }
    const onResize = () => update()

    const enable = () => {
      if (active) return
      active = true
      refreshCards()
      document.body.classList.add('pv-scroll-stack-on')
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      update()
    }

    const disable = () => {
      if (!active) return
      active = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('pv-scroll-stack-on')
      cards.forEach((c) => {
        c.style.scale = ''
      })
    }

    if (reduceMQ.matches) return () => {}

    if (mq.matches) enable()

    const onMQ = (e) => {
      if (e.matches) enable()
      else disable()
    }
    const onReduce = (e) => {
      if (e.matches) disable()
    }

    mq.addEventListener('change', onMQ)
    reduceMQ.addEventListener('change', onReduce)

    return () => {
      mq.removeEventListener('change', onMQ)
      reduceMQ.removeEventListener('change', onReduce)
      disable()
    }
  }, [gridRef])
}
