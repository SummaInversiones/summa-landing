import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardZeroV2.css'

// Concepto: el ticket. La prueba escrita de que acá no hay letra chica:
// el recibo sale de la impresora UNA vez y queda; cada comisión se va
// ESCRIBIENDO en orden con su $0, y al completarse se estampa el sello
// grande de 0%. Después se borra la tinta y se vuelve a escribir.

const LINES = [
  { label: 'mantenimiento',  amount: '$0' },
  { label: 'custodia',       amount: '$0' },
  { label: 'cargos ocultos', amount: '$0' },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardZeroV2({ index = 3 }) {
  const receiptRef = useRef(null)
  const labelRefs = useRef([])      // 0..2 líneas + 3 = total
  const dotsRefs = useRef([])
  const amountRefs = useRef([])
  const ruleRef = useRef(null)
  const stampRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const receipt = receiptRef.current
    const stamp = stampRef.current

    // ── Reduce-motion: ticket completo y sellado, estático ──
    if (reduceMotion) {
      if (receipt) {
        receipt.style.opacity = '1'
        receipt.style.transform = 'none'
      }
      labelRefs.current.forEach((l) => l && (l.style.clipPath = 'none'))
      dotsRefs.current.forEach((d) => d && (d.style.opacity = '1'))
      amountRefs.current.forEach((a) => {
        if (!a) return
        a.style.opacity = '1'
        a.style.transform = 'none'
      })
      if (ruleRef.current) ruleRef.current.style.transform = 'none'
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

    // Borra la "tinta" (el papel queda).
    const clearInk = () => {
      labelRefs.current.forEach((l) => l && (l.style.clipPath = 'inset(0 100% 0 0)'))
      dotsRefs.current.forEach((d) => d && (d.style.opacity = '0'))
      amountRefs.current.forEach((a) => {
        if (!a) return
        a.style.opacity = '0'
        a.style.transform = 'scale(0.5)'
      })
      if (ruleRef.current) ruleRef.current.style.transform = 'scaleX(0)'
      if (stamp) {
        stamp.style.opacity = '0'
        stamp.style.transform = 'scale(1.8)'
      }
    }

    // Una línea "se escribe": el texto se revela de izquierda a derecha,
    // los puntitos guía aparecen y el $0 se asienta con un pop.
    const writeLine = async (i) => {
      const label = labelRefs.current[i]
      const dots = dotsRefs.current[i]
      const amount = amountRefs.current[i]
      if (label) {
        await tr(animate(0, 1, {
          duration: 0.4,
          ease: 'linear',
          onUpdate: (t) => {
            label.style.clipPath = `inset(0 ${(100 - t * 100).toFixed(1)}% 0 0)`
          },
        })).finished
      }
      if (cancelled) return
      if (dots) tr(animate(dots, { opacity: [0, 1] }, { duration: 0.2, ease: 'easeOut' }))
      if (amount) {
        await tr(animate(
          amount,
          { opacity: [0, 1], scale: [0.5, 1.18, 1] },
          { duration: 0.3, ease: 'easeOut' },
        )).finished
      }
    }

    ;(async () => {
      try {
        // ── Impresión (una sola vez): el papel baja en blanco y queda ──
        clearInk()
        await tr(animate(
          receipt,
          { y: ['-105%', '0%'] },
          { duration: 1.0, ease: [0.3, 0.8, 0.4, 1] },
        )).finished
        if (cancelled) return

        while (!cancelled) {
          // ── Fase 1 — cada comisión se escribe en orden, con su $0 ──
          await sleep(0.4)
          for (let i = 0; i < LINES.length; i++) {
            if (cancelled) return
            await writeLine(i)
            await sleep(0.25)
          }
          if (cancelled) break

          // La línea de cierre y el total.
          if (ruleRef.current) {
            await tr(animate(
              ruleRef.current,
              { scaleX: [0, 1] },
              { duration: 0.3, ease: 'easeOut' },
            )).finished
          }
          if (cancelled) break
          await writeLine(3)
          if (cancelled) break
          await sleep(0.4)

          // ── Fase 2 — el sello GRANDE de 0% se estampa sobre el ticket ──
          if (stamp) {
            await tr(animate(
              stamp,
              { opacity: [0, 1], scale: [1.8, 1] },
              { duration: 0.35, ease: 'easeIn' },
            )).finished
          }
          if (cancelled) break

          // ── Fase 3 — hold largo: el ticket sellado ES la card ──
          await sleep(9)
          if (cancelled) break

          // ── Fase 4 — la tinta se borra (el papel queda) y se reescribe ──
          const fades = []
          labelRefs.current.forEach((l) => {
            if (!l) return
            fades.push(tr(animate(l, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
          })
          dotsRefs.current.forEach((d) => {
            if (!d) return
            fades.push(tr(animate(d, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
          })
          amountRefs.current.forEach((a) => {
            if (!a) return
            fades.push(tr(animate(a, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
          })
          if (ruleRef.current) fades.push(tr(animate(ruleRef.current, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
          if (stamp) fades.push(tr(animate(stamp, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
          await Promise.all(fades.map((p) => p.catch(() => {})))
          if (cancelled) break
          clearInk()
          // Restaurar las opacities que el fade dejó en 0 (clipPath y
          // scale ya quedaron reseteados por clearInk).
          labelRefs.current.forEach((l) => l && (l.style.opacity = '1'))
          if (ruleRef.current) ruleRef.current.style.opacity = '1'
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
                <span
                  ref={(el) => { labelRefs.current[i] = el }}
                  className="pv-p8-line-label"
                >
                  {l.label}
                </span>
                <span
                  ref={(el) => { dotsRefs.current[i] = el }}
                  className="pv-p8-line-dots"
                />
                <span
                  ref={(el) => { amountRefs.current[i] = el }}
                  className="pv-p8-line-amount"
                >
                  {l.amount}
                </span>
              </div>
            ))}
            <div ref={ruleRef} className="pv-p8-rule" />
            <div className="pv-p8-line pv-p8-line--total">
              <span
                ref={(el) => { labelRefs.current[3] = el }}
                className="pv-p8-line-label"
              >
                total comisiones
              </span>
              <span
                ref={(el) => { dotsRefs.current[3] = el }}
                className="pv-p8-line-dots"
              />
              <span
                ref={(el) => { amountRefs.current[3] = el }}
                className="pv-p8-line-amount"
              >
                $0
              </span>
            </div>
            {/* El sello vive DENTRO del ticket, estampado sobre la tinta. */}
            <div ref={stampRef} className="pv-p8-stamp" aria-hidden="true">0%</div>
          </div>
        </div>
      </div>
    </PCard>
  )
}
