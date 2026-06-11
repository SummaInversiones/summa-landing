import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardGastosV2.css'

// Concepto: caos → orden. Los gastos sueltos (chips desordenados) vuelan
// solos a su categoría; las barras crecen y los totales cuentan al recibirlos.
// La velocidad de la animación ES el mensaje ("menos de 5 minutos").

const ROWS = [
  { label: 'comida',     total: 200000, width: 100 },
  { label: 'transporte', total: 178000, width: 75 },
  { label: 'salidas',    total: 78000,  width: 50 },
]

// Chips sueltos: posición scatter (% del stage) + tilt + fila destino.
const CHIPS = [
  { text: '$120.000', x: 22, y: 10, rot: -9,  row: 0 },
  { text: '$80.000',  x: 68, y: 6,  rot: 6,   row: 0 },
  { text: '$96.000',  x: 44, y: 22, rot: -4,  row: 1 },
  { text: '$82.000',  x: 80, y: 28, rot: 8,   row: 1 },
  { text: '$46.000',  x: 14, y: 30, rot: 5,   row: 2 },
  { text: '$32.000',  x: 56, y: 40, rot: -7,  row: 2 },
]

// Centro (y en %) de cada fila destino — sincronizado con .pv-p1-rows en CSS.
const ROW_Y = [62, 76, 90]
const ROW_X = 50

const fmt = (v) => '$' + Math.round(v).toLocaleString('en-US')
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardGastosV2({ index = 0 }) {
  const chipRefs = useRef([])
  const wrapRefs = useRef([])
  const rowRefs = useRef([])
  const barRefs = useRef([])
  const amountRefs = useRef([])
  const badgeRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final ordenado, sin chips ──
    if (reduceMotion) {
      wrapRefs.current.forEach((w) => w && (w.style.opacity = '0'))
      rowRefs.current.forEach((r, i) => {
        if (!r) return
        r.style.opacity = '1'
        if (barRefs.current[i]) barRefs.current[i].style.width = ROWS[i].width + '%'
        if (amountRefs.current[i]) amountRefs.current[i].textContent = fmt(ROWS[i].total)
      })
      if (badgeRef.current) {
        badgeRef.current.style.opacity = '1'
        badgeRef.current.style.transform = 'none'
      }
      return
    }

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    // Estado vivo por fila: cuánto lleva acumulado (los chips suman de a uno).
    const rowState = ROWS.map(() => ({ pct: 0, amount: 0 }))

    const resetForLoopStart = () => {
      CHIPS.forEach((c, i) => {
        const wrap = wrapRefs.current[i]
        const chip = chipRefs.current[i]
        if (!wrap || !chip) return
        wrap.style.left = c.x + '%'
        wrap.style.top = c.y + '%'
        chip.style.opacity = '0'
        chip.style.transform = 'scale(0.6)'
      })
      ROWS.forEach((_, i) => {
        rowState[i] = { pct: 0, amount: 0 }
        const row = rowRefs.current[i]
        const bar = barRefs.current[i]
        const amt = amountRefs.current[i]
        if (row) { row.style.opacity = '1'; row.style.transform = '' }
        if (bar) bar.style.width = '14%'
        if (amt) amt.textContent = '$0'
      })
      const badge = badgeRef.current
      if (badge) {
        badge.style.opacity = '0'
        badge.style.transform = 'scale(0.7)'
      }
    }

    // ── Fase 1 — los gastos sueltos aparecen (el caos) ──
    const phase1 = async () => {
      const pops = CHIPS.map((_, i) => {
        const chip = chipRefs.current[i]
        if (!chip) return null
        return tr(animate(
          chip,
          { opacity: [0, 1], scale: [0.6, 1] },
          { duration: 0.35, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
        ))
      }).filter(Boolean)
      await Promise.all(pops.map((a) => a.finished))
      if (cancelled) return
      await sleep(0.7)
    }

    // ── Fase 2 — cada chip vuela a su fila; la barra lo absorbe ──
    const chipFly = (i) => {
      const c = CHIPS[i]
      const wrap = wrapRefs.current[i]
      const chip = chipRefs.current[i]
      if (!wrap || !chip) return Promise.resolve()
      const peak = 8 + Math.abs(c.x - ROW_X) * 0.1
      return tr(animate(0, 1, {
        duration: 0.55,
        ease: 'easeIn',
        onUpdate: (t) => {
          // Arco suave hacia la fila (X lineal, Y con leve parábola).
          const x = c.x + (ROW_X - c.x) * t
          const y = (1 - t) * c.y + t * ROW_Y[c.row] - 4 * peak * t * (1 - t)
          wrap.style.left = x.toFixed(2) + '%'
          wrap.style.top = y.toFixed(2) + '%'
          const fade = t < 0.7 ? 1 : (1 - t) / 0.3
          chip.style.opacity = fade.toFixed(3)
          chip.style.transform = `scale(${(1 - t * 0.45).toFixed(3)})`
        },
      })).finished
    }

    const rowAbsorb = (rowIdx) => {
      const target = ROWS[rowIdx]
      const from = { ...rowState[rowIdx] }
      const half = { pct: from.pct + target.width / 2, amount: from.amount + target.total / 2 }
      rowState[rowIdx] = half
      const bar = barRefs.current[rowIdx]
      const amt = amountRefs.current[rowIdx]
      const row = rowRefs.current[rowIdx]
      if (row) tr(animate(row, { scale: [1, 1.04, 1] }, { duration: 0.3, ease: 'easeOut' }))
      return tr(animate(0, 1, {
        duration: 0.4,
        ease: 'easeOut',
        onUpdate: (t) => {
          const pct = Math.max(14, from.pct + (half.pct - from.pct) * t)
          if (bar) bar.style.width = pct.toFixed(2) + '%'
          if (amt) amt.textContent = fmt(from.amount + (half.amount - from.amount) * t)
        },
      })).finished
    }

    const phase2 = async () => {
      for (let i = 0; i < CHIPS.length; i++) {
        if (cancelled) return
        const fly = chipFly(i)
        // El absorb arranca cuando el chip está por llegar (overlap).
        sleep(0.38).then(() => { if (!cancelled) rowAbsorb(CHIPS[i].row) })
        await fly
        await sleep(0.08)
      }
      await sleep(0.45)
    }

    // ── Fase 3 — sello "menos de 5 min" + hold ──
    const phase3 = async () => {
      const badge = badgeRef.current
      if (badge) {
        await tr(animate(
          badge,
          { opacity: [0, 1], scale: [0.7, 1] },
          { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        )).finished
      }
      await sleep(2.6)
    }

    // ── Fase 4 — salida silenciosa ──
    const phase4 = async () => {
      const outs = []
      rowRefs.current.forEach((r, i) => {
        if (!r) return
        outs.push(tr(animate(r, { opacity: [1, 0], y: [0, 8] }, { duration: 0.3, delay: i * 0.08, ease: 'easeIn' })).finished)
      })
      if (badgeRef.current) {
        outs.push(tr(animate(badgeRef.current, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
      }
      await Promise.all(outs)
      // limpiar el translateY residual de las rows antes del próximo loop
      rowRefs.current.forEach((r) => r && (r.style.transform = ''))
    }

    ;(async () => {
      try {
        while (!cancelled) {
          resetForLoopStart()
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
      variant="gastos2"
      index={index}
      onReveal={onReveal}
      headline={<>Conocé tus gastos en menos de 5 minutos</>}
    >
      <div className="pv-p1-stage">
        {CHIPS.map((c, i) => (
          <div
            key={i}
            ref={(el) => { wrapRefs.current[i] = el }}
            className="pv-p1-chip-wrap"
            style={{ left: c.x + '%', top: c.y + '%' }}
            aria-hidden="true"
          >
            <span
              ref={(el) => { chipRefs.current[i] = el }}
              className="pv-p1-chip"
              style={{ '--rot': `${c.rot}deg` }}
            >
              {c.text}
            </span>
          </div>
        ))}

        <div className="pv-p1-rows" aria-hidden="true">
          {ROWS.map((r, i) => (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el }}
              className="pv-p1-row"
            >
              <span className="pv-p1-label">{r.label}</span>
              <div className="pv-p1-track">
                <div
                  ref={(el) => { barRefs.current[i] = el }}
                  className="pv-p1-bar"
                >
                  <span
                    ref={(el) => { amountRefs.current[i] = el }}
                    className="pv-p1-amount"
                  >
                    $0
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={badgeRef} className="pv-p1-badge" aria-hidden="true">
          menos de 5 min
        </div>
      </div>
    </PCard>
  )
}
