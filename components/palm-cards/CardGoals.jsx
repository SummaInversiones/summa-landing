import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardGoals.css'

const TRAIL_COUNT = 6
const SMALL_GOAL = { x: 36, y: 55 }   // % of card
const LARGE_GOAL = { x: 78, y: 37 }

// X linear, Y parabólico con peak. Física en la curva, no en el ease.
const arcPos = (t, x1, y1, x2, y2, peak) => ({
  x: x1 + (x2 - x1) * t,
  y: (1 - t) * y1 + t * y2 - 4 * peak * t * (1 - t),
})

export default function CardGoals({ index = 1 }) {
  const ballRef = useRef(null)
  const trailRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const ball = ballRef.current
    if (!ball) return
    const trailDots = trailRefs.current.filter(Boolean)

    const setBall = (x, y) => {
      ball.style.left = x.toFixed(2) + '%'
      ball.style.top = y.toFixed(2) + '%'
    }

    setBall(SMALL_GOAL.x, SMALL_GOAL.y)

    if (reduceMotion) return

    let cancelled = false
    const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

    const jump = (from, to, duration, peak) => {
      const N = trailDots.length
      // Pre-place dots at fixed t along the arc; only fade opacity as ball passes.
      trailDots.forEach((dot, i) => {
        const dotT = (i + 1) / (N + 1)
        const p = arcPos(dotT, from.x, from.y, to.x, to.y, peak)
        dot.style.left = p.x.toFixed(2) + '%'
        dot.style.top = p.y.toFixed(2) + '%'
        dot.style.opacity = '0'
      })

      return animate(0, 1, {
        duration,
        ease: 'linear',
        onUpdate: (t) => {
          const p = arcPos(t, from.x, from.y, to.x, to.y, peak)
          setBall(p.x, p.y)
          trailDots.forEach((dot, i) => {
            const dotT = (i + 1) / (N + 1)
            if (t >= dotT) {
              const age = t - dotT
              dot.style.opacity = Math.max(0, 0.85 - age * 1.6).toFixed(3)
            }
          })
        },
      }).finished
    }

    const fadeBall = (from, to, duration) =>
      animate(from, to, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => {
          ball.style.opacity = v.toFixed(3)
        },
      }).finished

    const clearTrail = () =>
      trailDots.forEach((d) => {
        d.style.opacity = '0'
      })

    ;(async () => {
      try {
        while (!cancelled) {
          await sleep(0.45)
          if (cancelled) break
          await jump(SMALL_GOAL, LARGE_GOAL, 1.6, 14)
          if (cancelled) break
          await sleep(0.75)
          if (cancelled) break
          await fadeBall(1, 0, 0.35)
          if (cancelled) break
          clearTrail()
          setBall(SMALL_GOAL.x, SMALL_GOAL.y)
          await fadeBall(0, 1, 0.5)
        }
      } catch {
        /* animate rechaza al cancelar — silencioso */
      }
    })()

    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="goals"
      index={index}
      onReveal={onReveal}
      headline={
        <>
          Que tu dinero trabaje
          <br />
          en base a tus
          <br />
          objetivos.
        </>
      }
    >
      <img className="pv-g2-bg" src="/Card%202/Objetivos.png" alt="" aria-hidden="true" />
      <div className="pv-g2-trail" aria-hidden="true">
        {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el
            }}
            className="pv-g2-trail-dot"
          />
        ))}
      </div>
      <div className="pv-g2-ball" ref={ballRef} aria-hidden="true" />
    </PCard>
  )
}
