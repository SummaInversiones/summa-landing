import { useCallback, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardMassV2.css'

// Concepto: número → nombre. Una pila de credenciales grises idénticas
// ("cliente #…"); la del medio se adelanta, se enciende en gradiente y
// deja de ser un número: dice "vos.". Para ellos sos uno más; acá no.

const IDS = ['cliente #28.391', 'cliente #28.392', 'cliente #28.393', 'cliente #28.394', 'cliente #28.395']
const CENTER = 2

const BLOBS = [
  { cx: 6,  cy: 40,  rot: -24 },
  { cx: 95, cy: 65,  rot: 30 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardMassV2({ index = 0 }) {
  const [centerText, setCenterText] = useState(IDS[CENTER])
  const [isYou, setIsYou] = useState(false)
  const cardRefs = useRef([])
  const gradientRef = useRef(null)
  const textRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final — la del medio ya sos vos ──
    if (reduceMotion) {
      setCenterText('vos.')
      setIsYou(true)
      cardRefs.current.forEach((c, i) => {
        if (!c) return
        c.style.opacity = i === CENTER ? '1' : '0.35'
        if (i === CENTER) c.style.transform = 'scale(1.1)'
      })
      if (gradientRef.current) gradientRef.current.style.opacity = '1'
      return
    }

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    const crossfadeText = async (next, you) => {
      const txt = textRef.current
      if (txt) {
        try {
          await tr(animate(txt, { opacity: [1, 0] }, { duration: 0.2, ease: 'easeOut' })).finished
        } catch { return }
      }
      setCenterText(next)
      setIsYou(you)
      await sleep(0.03)
      if (txt) tr(animate(txt, { opacity: [0, 1] }, { duration: 0.25, ease: 'easeIn' }))
    }

    const resetForLoopStart = () => {
      setCenterText(IDS[CENTER])
      setIsYou(false)
      cardRefs.current.forEach((c) => {
        if (!c) return
        c.style.opacity = '0'
        c.style.transform = 'translateY(14px)'
      })
      if (gradientRef.current) gradientRef.current.style.opacity = '0'
    }

    // ── Fase 1 — la pila entra: todos iguales, todos grises ──
    const phase1 = async () => {
      const enters = cardRefs.current.map((c, i) => {
        if (!c) return null
        return tr(animate(
          c,
          { opacity: [0, 1], y: [14, 0] },
          { duration: 0.4, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
        ))
      }).filter(Boolean)
      await Promise.all(enters.map((a) => a.finished))
      if (cancelled) return
      await sleep(1.1)
    }

    // ── Fase 2 — la del medio se adelanta y se enciende ──
    const phase2 = async () => {
      const center = cardRefs.current[CENTER]
      const gradient = gradientRef.current
      cardRefs.current.forEach((c, i) => {
        if (!c || i === CENTER) return
        tr(animate(c, { opacity: [1, 0.3] }, { duration: 0.5, ease: 'easeOut' }))
      })
      if (center) {
        tr(animate(center, { scale: [1, 1.1] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] }))
      }
      if (gradient) {
        tr(animate(gradient, {
          opacity: [0, 1],
          boxShadow: ['0 0 0px #9747FF66', '0 0 42px #9747FF66'],
        }, { duration: 0.5, ease: 'easeOut' }))
      }
      await sleep(0.3)
      if (cancelled) return
      await crossfadeText('vos.', true)
      await sleep(2.4)
    }

    // ── Fase 3 — vuelve a la fila (y el loop recuerda el contraste) ──
    const phase3 = async () => {
      const center = cardRefs.current[CENTER]
      const gradient = gradientRef.current
      await crossfadeText(IDS[CENTER], false)
      if (cancelled) return
      cardRefs.current.forEach((c, i) => {
        if (!c || i === CENTER) return
        tr(animate(c, { opacity: [0.3, 1] }, { duration: 0.5, ease: 'easeOut' }))
      })
      if (center) tr(animate(center, { scale: [1.1, 1] }, { duration: 0.5, ease: 'easeInOut' }))
      if (gradient) {
        tr(animate(gradient, {
          opacity: [1, 0],
          boxShadow: ['0 0 42px #9747FF66', '0 0 0px #9747FF66'],
        }, { duration: 0.5, ease: 'easeOut' }))
      }
      await sleep(1.5)
    }

    ;(async () => {
      try {
        resetForLoopStart()
        await sleep(0.05)
        await phase1()
        while (!cancelled) {
          await phase2(); if (cancelled) break
          await phase3()
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
      variant="mass2"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Para ellos, sos uno más. Para nosotros, no.</>}
    >
      <div className="pv-p5-stage">
        {IDS.map((id, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            className={`pv-p5-id${i === CENTER ? ' pv-p5-id--center' : ''}`}
            style={{ top: `${i * 19}%` }}
            aria-hidden="true"
          >
            {i === CENTER && (
              <div ref={gradientRef} className="pv-p5-id-gradient" />
            )}
            <span
              ref={i === CENTER ? textRef : undefined}
              className={`pv-p5-id-text${i === CENTER && isYou ? ' pv-p5-id-text--you' : ''}`}
            >
              {i === CENTER ? centerText : id}
            </span>
          </div>
        ))}
      </div>
    </PCard>
  )
}
