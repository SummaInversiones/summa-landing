import { useCallback, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardGoalsV2.css'

// Concepto: tu plata trabaja sola hacia cada objetivo. Los aportes "+$"
// suben por su cuenta a la barra del objetivo; al llegar al 100% el
// objetivo se cumple y aparece el siguiente. Nadie toca nada: trabaja.

const GOALS = [
  { name: 'Viaje',  target: '$3.5M' },
  { name: 'Auto',   target: '$18M' },
  { name: 'Depto',  target: '$90M' },
]

const COINS_PER_GOAL = 3

const BLOBS = [
  { cx: 8,  cy: 30,  rot: -22 },
  { cx: 95, cy: 70,  rot: 36 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardGoalsV2({ index = 2 }) {
  const [goal, setGoal] = useState(GOALS[0])
  const chipRef = useRef(null)
  const fillRef = useRef(null)
  const pctRef = useRef(null)
  const doneRef = useRef(null)
  const ringRef = useRef(null)
  const coinRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: primer objetivo cumplido, estático ──
    if (reduceMotion) {
      if (fillRef.current) fillRef.current.style.width = '100%'
      if (pctRef.current) pctRef.current.textContent = '100%'
      if (doneRef.current) {
        doneRef.current.style.opacity = '1'
        doneRef.current.style.transform = 'none'
      }
      coinRefs.current.forEach((c) => c && (c.style.opacity = '0'))
      return
    }

    const chip = chipRef.current
    const fill = fillRef.current
    const pct = pctRef.current
    const done = doneRef.current
    const ring = ringRef.current
    if (!fill || !pct) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    const setProgress = (v) => {
      fill.style.width = (v * 100).toFixed(2) + '%'
      pct.textContent = Math.round(v * 100) + '%'
    }

    // Un aporte sube desde abajo y se funde en la barra; la barra crece.
    const coinRise = async (ci, from, to) => {
      const coin = coinRefs.current[ci]
      if (coin) {
        const rise = tr(animate(
          coin,
          { y: [44, 0], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.6] },
          { duration: 0.7, ease: 'easeOut' },
        ))
        await sleep(0.45) // el fill arranca cuando el aporte está llegando
        if (cancelled) return
        tr(animate(from, to, {
          duration: 0.5,
          ease: 'easeOut',
          onUpdate: setProgress,
        }))
        await rise.finished
      }
    }

    // Crossfade del chip de objetivo (texto via state, como CardMass).
    const swapGoal = async (next) => {
      if (chip) {
        try {
          await tr(animate(chip, { opacity: [1, 0], y: [0, -6] }, { duration: 0.25, ease: 'easeIn' })).finished
        } catch { return }
      }
      setGoal(next)
      await sleep(0.03)
      if (chip) {
        tr(animate(chip, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3, ease: 'easeOut' }))
      }
    }

    ;(async () => {
      try {
        let gi = 0
        while (!cancelled) {
          setProgress(0)
          if (done) done.style.opacity = '0'
          if (ring) { ring.style.opacity = '0'; ring.style.transform = '' }
          await sleep(0.6)
          if (cancelled) break

          // Los aportes llegan solos, uno tras otro.
          for (let c = 0; c < COINS_PER_GOAL; c++) {
            if (cancelled) break
            await coinRise(c, c / COINS_PER_GOAL, (c + 1) / COINS_PER_GOAL)
            await sleep(0.35)
          }
          if (cancelled) break

          // Objetivo cumplido: ring + tag dorado.
          if (ring) {
            ring.style.opacity = '1'
            tr(animate(ring, { scale: [0.9, 1.5], opacity: [0.8, 0] }, { duration: 0.7, ease: 'easeOut' }))
          }
          if (done) {
            tr(animate(done, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 0.4, ease: [0.16, 1, 0.3, 1] }))
          }
          await sleep(2.2)
          if (cancelled) break

          // Siguiente objetivo.
          const fadeOuts = []
          if (done) fadeOuts.push(tr(animate(done, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
          fadeOuts.push(tr(animate(fill, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
          await Promise.all(fadeOuts.map((p) => p.catch(() => {})))
          if (cancelled) break
          gi = (gi + 1) % GOALS.length
          await swapGoal(GOALS[gi])
          setProgress(0)
          fill.style.opacity = '1'
        }
      } catch {
        /* cancelled — silencioso */
      }
    })()

    return () => {
      cancelled = true
      anims.forEach((a) => a.stop?.())
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="goals2"
      index={index}
      blobs={BLOBS}
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
      <div className="pv-p3-stage">
        <div ref={chipRef} className="pv-p3-goal" aria-hidden="true">
          <span className="pv-p3-goal-name">{goal.name}</span>
          <span className="pv-p3-goal-target">{goal.target}</span>
        </div>

        <div className="pv-p3-bar-wrap" aria-hidden="true">
          <div className="pv-p3-track">
            <div ref={fillRef} className="pv-p3-fill" />
          </div>
          <span ref={pctRef} className="pv-p3-pct">0%</span>
          <div ref={ringRef} className="pv-p3-ring" />
        </div>

        <div className="pv-p3-coins" aria-hidden="true">
          {Array.from({ length: COINS_PER_GOAL }).map((_, i) => (
            <span
              key={i}
              ref={(el) => { coinRefs.current[i] = el }}
              className="pv-p3-coin"
              style={{ left: `${28 + i * 22}%` }}
            >
              +$
            </span>
          ))}
        </div>

        <div ref={doneRef} className="pv-p3-done" aria-hidden="true">
          objetivo cumplido
        </div>
      </div>
    </PCard>
  )
}
