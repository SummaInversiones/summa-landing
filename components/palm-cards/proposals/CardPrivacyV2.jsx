import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardPrivacyV2.css'

// Concepto: el corte. En el modelo "gratis", tus datos fluyen hacia
// terceros (líneas + puntos que viajan hacia afuera). El escudo cae
// sobre tus datos y corta el flujo: acá no se venden.

const CENTER = { x: 50, y: 66 }
const BUYERS = [
  { label: 'anunciantes',  x: 16, y: 14 },
  { label: 'data brokers', x: 50, y: 6 },
  { label: 'terceros',     x: 84, y: 14 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

const BLOBS = [
  { cx: 8,  cy: 95,  rot: -20 },
  { cx: 96, cy: 50,  rot: 38 },
]

export default function CardPrivacyV2({ index = 1 }) {
  const lineRefs = useRef([])
  const dotRefs = useRef([])
  const buyerRefs = useRef([])
  const escudoRef = useRef(null)
  const ringRef = useRef(null)
  const tagRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final — flujo cortado, escudo puesto ──
    if (reduceMotion) {
      lineRefs.current.forEach((l) => l && (l.style.opacity = '0.15'))
      dotRefs.current.forEach((d) => d && (d.style.opacity = '0'))
      buyerRefs.current.forEach((b) => b && (b.style.opacity = '0.3'))
      if (escudoRef.current) {
        escudoRef.current.style.opacity = '1'
        escudoRef.current.style.transform = 'none'
      }
      if (tagRef.current) tagRef.current.style.opacity = '1'
      return
    }

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }
    const dotAnims = []

    // Punto que viaja del centro hacia un comprador, en loop.
    const startDotFlow = (i, delay) => {
      const dot = dotRefs.current[i]
      if (!dot) return
      const b = BUYERS[i]
      const a = animate(0, 1, {
        duration: 1.6,
        delay,
        repeat: Infinity,
        ease: 'easeIn',
        onUpdate: (t) => {
          dot.setAttribute('cx', (CENTER.x + (b.x - CENTER.x) * t).toFixed(2))
          dot.setAttribute('cy', (CENTER.y + (b.y - CENTER.y) * t).toFixed(2))
          dot.setAttribute('opacity', (t < 0.85 ? 0.9 : (1 - t) * 6).toFixed(2))
        },
      })
      dotAnims.push(a)
    }
    const stopDotFlows = () => {
      dotAnims.forEach((a) => a.stop?.())
      dotAnims.length = 0
      dotRefs.current.forEach((d) => d && d.setAttribute('opacity', '0'))
    }

    const resetForLoopStart = () => {
      lineRefs.current.forEach((l) => {
        if (!l) return
        l.style.opacity = '0'
        l.style.strokeDashoffset = '100'
      })
      buyerRefs.current.forEach((b) => {
        if (!b) return
        b.style.opacity = '0'
        b.style.transform = ''
      })
      const escudo = escudoRef.current
      if (escudo) { escudo.style.opacity = '0'; escudo.style.transform = '' }
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (tagRef.current) tagRef.current.style.opacity = '0'
    }

    // ── Fase 1 — el mundo "gratis": el flujo se arma y tus datos viajan ──
    const phase1 = async () => {
      // Solo opacity: el centrado estático de las pills vive en transform (CSS).
      const buyersIn = buyerRefs.current.map((b, i) => {
        if (!b) return null
        return tr(animate(b, { opacity: [0, 0.9] }, { duration: 0.4, delay: i * 0.12, ease: 'easeOut' }))
      }).filter(Boolean)
      lineRefs.current.forEach((l, i) => {
        if (!l) return
        l.style.opacity = '0.5'
        tr(animate(l, { strokeDashoffset: [100, 0] }, { duration: 0.7, delay: i * 0.12, ease: 'easeOut' }))
      })
      await Promise.all(buyersIn.map((a) => a.finished))
      if (cancelled) return

      BUYERS.forEach((_, i) => startDotFlow(i, i * 0.5))
      await sleep(3.2)
      if (cancelled) return
    }

    // ── Fase 2 — el corte: escudo + el flujo se apaga ──
    const phase2 = async () => {
      const escudo = escudoRef.current
      const ring = ringRef.current
      if (escudo) {
        await tr(animate(
          escudo,
          { opacity: [0, 1], y: [-26, 0], scale: [0.7, 1] },
          { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        )).finished
      }
      if (cancelled) return
      if (ring) {
        ring.style.opacity = '1'
        tr(animate(ring, { scale: [0.8, 1.7], opacity: [0.8, 0] }, { duration: 0.6, ease: 'easeOut' }))
      }
      stopDotFlows()
      lineRefs.current.forEach((l, i) => {
        if (!l) return
        tr(animate(l, { strokeDashoffset: [0, 100], opacity: [0.5, 0.15] }, { duration: 0.5, delay: i * 0.08, ease: 'easeIn' }))
      })
      buyerRefs.current.forEach((b) => {
        if (!b) return
        tr(animate(b, { opacity: [0.9, 0.3] }, { duration: 0.5, ease: 'easeOut' }))
      })
      if (tagRef.current) {
        tr(animate(tagRef.current, { opacity: [0, 1] }, { duration: 0.4, delay: 0.3, ease: 'easeOut' }))
      }
      await sleep(2.8)
    }

    // ── Fase 3 — salida silenciosa ──
    const phase3 = async () => {
      const outs = []
      if (escudoRef.current) outs.push(tr(animate(escudoRef.current, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      if (tagRef.current) outs.push(tr(animate(tagRef.current, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      buyerRefs.current.forEach((b) => {
        if (!b) return
        outs.push(tr(animate(b, { opacity: [0.3, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      })
      lineRefs.current.forEach((l) => {
        if (!l) return
        outs.push(tr(animate(l, { opacity: [0.15, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      })
      await Promise.all(outs.map((p) => p.catch(() => {})))
    }

    ;(async () => {
      try {
        while (!cancelled) {
          resetForLoopStart()
          await sleep(0.05)
          await phase1(); if (cancelled) break
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
      dotAnims.forEach((a) => a.stop?.())
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="privacy2"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Si es gratis, alguien lo paga.</>}
    >
      <div className="pv-p6-stage">
        <svg className="pv-p6-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {BUYERS.map((b, i) => (
            <line
              key={'l' + i}
              ref={(el) => { lineRefs.current[i] = el }}
              className="pv-p6-line"
              x1={CENTER.x} y1={CENTER.y}
              x2={b.x} y2={b.y}
              pathLength="100"
            />
          ))}
          {BUYERS.map((b, i) => (
            <circle
              key={'d' + i}
              ref={(el) => { dotRefs.current[i] = el }}
              className="pv-p6-dot"
              cx={CENTER.x} cy={CENTER.y} r="1.4"
              opacity="0"
            />
          ))}
        </svg>

        {BUYERS.map((b, i) => (
          <span
            key={b.label}
            ref={(el) => { buyerRefs.current[i] = el }}
            className="pv-p6-buyer"
            style={{ left: b.x + '%', top: b.y + '%' }}
            aria-hidden="true"
          >
            {b.label}
          </span>
        ))}

        <div className="pv-p6-data" aria-hidden="true">tus datos</div>

        <img
          ref={escudoRef}
          className="pv-p6-escudo"
          src="/Card%20Privacy/escudo.svg"
          alt=""
          aria-hidden="true"
        />
        <div ref={ringRef} className="pv-p6-ring" aria-hidden="true" />

        <div ref={tagRef} className="pv-p6-tag" aria-hidden="true">
          acá no se venden
        </div>
      </div>
    </PCard>
  )
}
