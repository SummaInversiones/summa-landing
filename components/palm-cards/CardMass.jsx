import { useCallback, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardMass.css'

// Concepto: número → nombre. Un listado de clientes scrollea rápido,
// FRENA, y ahí se selecciona el cliente: el marco dorado lo encuadra,
// se enciende en gradiente y deja de ser un número — dice "vos.".

const ROW_PITCH = 54 // px — alto de fila (44) + gap (10); sincronizado con CSS
const TARGET = 9     // fila que queda seleccionada al frenar

const IDS = Array.from({ length: 14 }, (_, i) => `cliente #28.${384 + i}`)

// y del roster para centrar la fila i en el stage (roster anclado a top 50%).
const yFor = (i) => -(i * ROW_PITCH + 22)

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardMass({ index = 0 }) {
  const [centerText, setCenterText] = useState(IDS[TARGET])
  const [isYou, setIsYou] = useState(false)
  const rosterRef = useRef(null)
  const rowRefs = useRef([])
  const gradientRef = useRef(null)
  const textRef = useRef(null)
  const frameRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const roster = rosterRef.current
    const frame = frameRef.current

    // ── Reduce-motion: scroll ya frenado, cliente seleccionado ──
    if (reduceMotion) {
      setCenterText('vos.')
      setIsYou(true)
      if (roster) {
        roster.style.opacity = '1'
        roster.style.transform = `translateY(${yFor(TARGET)}px)`
      }
      if (frame) frame.style.opacity = '1'
      if (gradientRef.current) gradientRef.current.style.opacity = '1'
      rowRefs.current.forEach((r, i) => {
        if (r && i !== TARGET) r.style.opacity = '0.35'
      })
      return
    }
    if (!roster) return

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
      setCenterText(IDS[TARGET])
      setIsYou(false)
      roster.style.transform = `translateY(${yFor(0)}px)`
      rowRefs.current.forEach((r) => r && (r.style.opacity = '1'))
      if (gradientRef.current) gradientRef.current.style.opacity = '0'
      if (frame) frame.style.opacity = '0'
    }

    // ── Fase 1 — el scroll: la lista pasa rápido y FRENA ──
    const phase1 = async () => {
      await sleep(0.5)
      if (cancelled) return
      // Pasa de largo unas filas y clava el freno…
      await tr(animate(
        roster,
        { y: [yFor(0), yFor(TARGET) - 18] },
        { duration: 1.5, ease: [0.15, 0.65, 0.25, 1] },
      )).finished
      if (cancelled) return
      // …y asienta de vuelta sobre la fila (el "clic" del freno).
      await tr(animate(
        roster,
        { y: [yFor(TARGET) - 18, yFor(TARGET)] },
        { duration: 0.3, ease: 'easeOut' },
      )).finished
    }

    // ── Fase 2 — la selección: marco dorado + la fila se enciende ──
    const phase2 = async () => {
      if (frame) {
        tr(animate(frame, { opacity: [0, 1], scale: [1.06, 1] }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] }))
      }
      rowRefs.current.forEach((r, i) => {
        if (!r || i === TARGET) return
        tr(animate(r, { opacity: [1, 0.35] }, { duration: 0.45, ease: 'easeOut' }))
      })
      const gradient = gradientRef.current
      if (gradient) {
        tr(animate(gradient, {
          opacity: [0, 1],
          boxShadow: ['0 0 0px #9747FF66', '0 0 36px #9747FF66'],
        }, { duration: 0.45, ease: 'easeOut' }))
      }
      await sleep(0.3)
      if (cancelled) return
      await crossfadeText('vos.', true)
      await sleep(2.4)
    }

    // ── Fase 3 — suelta y vuelve a girar la lista ──
    const phase3 = async () => {
      await crossfadeText(IDS[TARGET], false)
      if (cancelled) return
      const outs = []
      if (frame) outs.push(tr(animate(frame, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
      if (gradientRef.current) {
        outs.push(tr(animate(gradientRef.current, {
          opacity: [1, 0],
          boxShadow: ['0 0 36px #9747FF66', '0 0 0px #9747FF66'],
        }, { duration: 0.35, ease: 'easeOut' })).finished)
      }
      await Promise.all(outs.map((p) => p.catch(() => {})))
      if (cancelled) return
      // Reset silencioso del scroll (con la lista apagada un instante).
      await tr(animate(roster, { opacity: [1, 0] }, { duration: 0.25, ease: 'easeIn' })).finished
      if (cancelled) return
      roster.style.transform = `translateY(${yFor(0)}px)`
      rowRefs.current.forEach((r) => r && (r.style.opacity = '1'))
      tr(animate(roster, { opacity: [0, 1] }, { duration: 0.3, ease: 'easeOut' }))
      await sleep(0.3)
    }

    ;(async () => {
      try {
        resetForLoopStart()
        await tr(animate(roster, { opacity: [0, 1] }, { duration: 0.4, ease: 'easeOut' })).finished
        while (!cancelled) {
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
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="mass2"
      index={index}
      onReveal={onReveal}
      headline={<>Para ellos, sos uno más. Para nosotros, no.</>}
    >
      <div className="pv-p5-stage">
        <div
          ref={rosterRef}
          className="pv-p5-roster"
          style={{ transform: `translateY(${yFor(0)}px)`, opacity: 0 }}
          aria-hidden="true"
        >
          {IDS.map((id, i) => (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el }}
              className={`pv-p5-id${i === TARGET ? ' pv-p5-id--center' : ''}`}
            >
              {i === TARGET && (
                <div ref={gradientRef} className="pv-p5-id-gradient" />
              )}
              <span
                ref={i === TARGET ? textRef : undefined}
                className={`pv-p5-id-text${i === TARGET && isYou ? ' pv-p5-id-text--you' : ''}`}
              >
                {i === TARGET ? centerText : id}
              </span>
            </div>
          ))}
        </div>

        {/* Marco de selección — aparece cuando el scroll frena. */}
        <div ref={frameRef} className="pv-p5-frame" aria-hidden="true" />
      </div>
    </PCard>
  )
}
