import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardZeroV2.css'

// Concepto: el ticket. La prueba impresa de que acá no hay letra chica:
// un recibo sale de la impresora con cada comisión en $0 y recibe el
// sello dorado "0%". Después se corta y se imprime otro — siempre $0.

const LINES = [
  { label: 'mantenimiento',  amount: '$0' },
  { label: 'custodia',       amount: '$0' },
  { label: 'cargos ocultos', amount: '$0' },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardZeroV2({ index = 3 }) {
  const receiptRef = useRef(null)
  const amountRefs = useRef([])
  const totalRef = useRef(null)
  const stampRef = useRef(null)
  const ringRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const receipt = receiptRef.current
    const stamp = stampRef.current

    // ── Reduce-motion: ticket impreso y sellado, estático ──
    if (reduceMotion) {
      if (receipt) {
        receipt.style.opacity = '1'
        receipt.style.transform = 'none'
      }
      if (stamp) {
        stamp.style.opacity = '1'
        stamp.style.transform = 'none'
      }
      return
    }
    if (!receipt) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    const resetForLoopStart = () => {
      receipt.style.opacity = '1'
      receipt.style.transform = 'translateY(-105%)'
      if (stamp) {
        stamp.style.opacity = '0'
        stamp.style.transform = 'scale(1.6)'
      }
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    // ── Fase 1 — el ticket se imprime (baja desde la ranura) ──
    const phase1 = async () => {
      await tr(animate(
        receipt,
        { y: ['-105%', '0%'] },
        { duration: 1.5, ease: [0.3, 0.8, 0.4, 1] },
      )).finished
      if (cancelled) return
      await sleep(0.3)
    }

    // ── Fase 2 — cada $0 se afirma (pulso staggered) ──
    const phase2 = async () => {
      const pulses = [...amountRefs.current, totalRef.current].map((a, i) => {
        if (!a) return null
        return tr(animate(
          a,
          { scale: [1, 1.25, 1] },
          { duration: 0.35, delay: i * 0.18, ease: 'easeOut' },
        ))
      }).filter(Boolean)
      await Promise.all(pulses.map((a) => a.finished))
      if (cancelled) return
      await sleep(0.2)
    }

    // ── Fase 3 — el sello "0%" cae + ring ──
    const phase3 = async () => {
      if (stamp) {
        await tr(animate(
          stamp,
          { opacity: [0, 1], scale: [1.6, 1] },
          { duration: 0.35, ease: 'easeIn' },
        )).finished
      }
      if (cancelled) return
      const ring = ringRef.current
      if (ring) {
        ring.style.opacity = '1'
        tr(animate(ring, { scale: [0.8, 1.6], opacity: [0.8, 0] }, { duration: 0.6, ease: 'easeOut' }))
      }
      await sleep(2.4)
    }

    // ── Fase 4 — corte: el ticket cae y se imprime el próximo ──
    const phase4 = async () => {
      const drop = tr(animate(
        receipt,
        { y: ['0%', '8%', '130%'], opacity: [1, 1, 0] },
        { duration: 0.7, ease: 'easeIn' },
      ))
      if (stamp) tr(animate(stamp, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' }))
      await drop.finished
    }

    ;(async () => {
      try {
        while (!cancelled) {
          resetForLoopStart()
          await sleep(0.4)
          await phase1(); if (cancelled) break
          await phase2(); if (cancelled) break
          await phase3(); if (cancelled) break
          await phase4()
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
      variant="zero2"
      index={index}
      onReveal={onReveal}
      headline={<>Las comisiones escondidas acá no existen.</>}
    >
      <div className="pv-p8-stage">
        <div className="pv-p8-slot" aria-hidden="true" />
        <div className="pv-p8-window" aria-hidden="true">
          <div ref={receiptRef} className="pv-p8-receipt">
            {LINES.map((l, i) => (
              <div key={i} className="pv-p8-line">
                <span className="pv-p8-line-label">{l.label}</span>
                <span className="pv-p8-line-dots" />
                <span
                  ref={(el) => { amountRefs.current[i] = el }}
                  className="pv-p8-line-amount"
                >
                  {l.amount}
                </span>
              </div>
            ))}
            <div className="pv-p8-rule" />
            <div className="pv-p8-line pv-p8-line--total">
              <span className="pv-p8-line-label">total comisiones</span>
              <span className="pv-p8-line-dots" />
              <span ref={totalRef} className="pv-p8-line-amount">$0</span>
            </div>
          </div>
        </div>
        <div ref={stampRef} className="pv-p8-stamp" aria-hidden="true">0%</div>
        <div ref={ringRef} className="pv-p8-ring" aria-hidden="true" />
      </div>
    </PCard>
  )
}
