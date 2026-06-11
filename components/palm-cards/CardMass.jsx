import { useCallback, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardMass.css'

const BLOBS = [
  { cx: 5,  cy: 32,  rot: -20 },
  { cx: 94, cy: 60,  rot: 35 },
  { cx: 45, cy: 105, rot: 8 },
]

// ── Grid params ─────────────────────────────────────────────
const COLS = 11
const ROWS = 10
const TOTAL = COLS * ROWS              // 110
const GAP_X = 18                       // px entre centros horizontalmente
const GAP_Y = 18                       // px entre centros verticalmente
const START_Y_PCT = 40                 // % from top of stage (row 0)
const START_X_OFFSET_PX = ((COLS - 1) * GAP_X) / 2   // = 90px — para centrar la grid
const CENTER_IDX = 49                  // row 4, col 5 — slot real central de 11×10
const CENTER_COL = CENTER_IDX % COLS   // = 5
const CENTER_ROW = Math.floor(CENTER_IDX / COLS)     // = 4

// Posición CSS calc para un dot en índice i (centro en left/top)
const dotPos = (i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    left: `calc(50% - ${START_X_OFFSET_PX}px + ${col * GAP_X}px)`,
    top: `calc(${START_Y_PCT}% + ${row * GAP_Y}px)`,
  }
}

// Posición del palm = mismo slot que CENTER_IDX
const PALM_POS = {
  left: `calc(50% - ${START_X_OFFSET_PX}px + ${CENTER_COL * GAP_X}px)`,
  top: `calc(${START_Y_PCT}% + ${CENTER_ROW * GAP_Y}px)`,
}

// Float label = 80px arriba del centro del palm
const FLOAT_LABEL_TOP = `calc(${START_Y_PCT}% + ${CENTER_ROW * GAP_Y - 80}px)`

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardMass({ index = 7 }) {
  // Main label — 2 textos ("Para ellos..." y "Para nosotros..."), mismo estilo siempre.
  const [mainText, setMainText] = useState('Para ellos, sos uno más.')
  // Float label — texto + variant ('welcome' o 'palm') para color/weight.
  const [floatLabel, setFloatLabel] = useState({ text: 'Bienvenido.', variant: 'welcome' })

  const mainLabelRef = useRef(null)
  const floatLabelRef = useRef(null)
  const palmWrapRef = useRef(null)
  const palmGreyRef = useRef(null)
  const palmGradientRef = useRef(null)
  const ringRef = useRef(null)
  const dotRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final estático (palm grande gradient + float "Bienvenido a Palm." gold + main "Para nosotros") ──
    if (reduceMotion) {
      setMainText('Para nosotros, sos el foco.')
      setFloatLabel({ text: 'Bienvenido a Palm.', variant: 'palm' })
      const wrap = palmWrapRef.current
      if (wrap) wrap.style.transform = 'scale(4)'
      if (palmGreyRef.current) palmGreyRef.current.style.opacity = '0'
      if (palmGradientRef.current) {
        palmGradientRef.current.style.opacity = '1'
        palmGradientRef.current.style.boxShadow = '0 0 16px #9747FF88'
      }
      if (mainLabelRef.current) mainLabelRef.current.style.opacity = '1'
      if (floatLabelRef.current) floatLabelRef.current.style.opacity = '1'
      return
    }

    const main = mainLabelRef.current
    const float = floatLabelRef.current
    const wrap = palmWrapRef.current
    const grey = palmGreyRef.current
    const gradient = palmGradientRef.current
    const ring = ringRef.current
    if (!wrap || !grey || !gradient) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    const resetForLoopStart = () => {
      // Fase 0 inicial — palm grey scale 5 en el slot center, main "Para ellos" oculto, float "Bienvenido" oculto
      setMainText('Para ellos, sos uno más.')
      setFloatLabel({ text: 'Bienvenido.', variant: 'welcome' })
      wrap.style.transform = 'scale(5)'
      grey.style.opacity = '1'
      gradient.style.opacity = '0'
      gradient.style.boxShadow = '0 0 0px #9747FF88'
      if (ring) {
        ring.style.opacity = '0'
        ring.style.transform = 'scale(1)'
      }
      if (main) main.style.opacity = '0'
      if (float) float.style.opacity = '0'
      dotRefs.current.forEach((d) => {
        if (!d) return
        d.style.opacity = '0'
      })
    }

    // Crossfade del main label — duration 0.3s, mismo estilo, solo cambia texto.
    const crossfadeMain = async (newText, totalDur = 0.3) => {
      if (!main) {
        setMainText(newText)
        return
      }
      const half = totalDur / 2
      try {
        await tr(animate(main, { opacity: [1, 0] }, { duration: half, ease: 'easeOut' })).finished
      } catch { return }
      setMainText(newText)
      await sleep(0.03)
      try {
        await tr(animate(main, { opacity: [0, 1] }, { duration: half, ease: 'easeIn' })).finished
      } catch { /* silent */ }
    }

    // ── Fase 0 — Bienvenido (palm grey scale 5, float label fade in, main fade in) ──
    const phase0 = async () => {
      // Main label fade in con "Para ellos, sos uno más." en paralelo con float "Bienvenido."
      const mainFadeIn = main ? tr(animate(main, { opacity: [0, 1] }, { duration: 0.5, ease: 'easeOut' })) : null
      const floatFadeIn = float ? tr(animate(float, { opacity: [0, 1] }, { duration: 0.5, ease: 'easeOut' })) : null
      await Promise.all([
        mainFadeIn?.finished.catch(() => {}),
        floatFadeIn?.finished.catch(() => {}),
      ])
      await sleep(1.4)
    }

    // ── Fase 1 — Zoom out + float label fade out + dots fade in ──
    const phase1 = async () => {
      // Float label desaparece al arrancar el zoom out
      if (float) {
        tr(animate(float, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeOut' }))
      }
      // Palm scale 5 → 1
      const palmZoom = tr(animate(wrap, { scale: [5, 1] }, { duration: 1.6, ease: 'easeInOut' }))
      // Dots fade in a partir de t=0.8s
      sleep(0.8).then(() => {
        if (cancelled) return
        dotRefs.current.forEach((d) => {
          if (!d) return
          tr(animate(d, { opacity: [0, 0.55] }, { duration: 0.6, ease: 'easeOut' }))
        })
      })
      await palmZoom.finished.catch(() => {})
    }

    // ── Fase 2 — Hold en la masa (idle pulse en los 110) ──
    const phase2 = async () => {
      const pulses = dotRefs.current.map((d, i) => {
        if (!d) return null
        return tr(animate(
          d,
          { opacity: [0.55, 0.65, 0.55] },
          { duration: 1.6, ease: 'easeInOut', delay: (i % COLS) * 0.015 },
        ))
      }).filter(Boolean)
      await sleep(1.6)
      pulses.forEach((a) => a.stop?.())
    }

    // ── Fase 3 — Palm grey → gradient + crossfade main label ──
    const phase3 = async () => {
      // Crossfade main label a "Para nosotros, sos el foco."
      crossfadeMain('Para nosotros, sos el foco.', 0.3)
      // Palm grey opacity 1→0 + gradient 0→1 + glow grows
      tr(animate(grey, { opacity: [1, 0] }, { duration: 0.6, ease: 'easeOut' }))
      tr(animate(gradient, {
        opacity: [0, 1],
        boxShadow: ['0 0 0px #9747FF88', '0 0 16px #9747FF88'],
      }, { duration: 0.6, ease: 'easeOut' }))
      await sleep(0.6)
      if (cancelled) return
      await sleep(0.8)   // hold con palm iluminado en la masa
    }

    // ── Fase 4 — Palm grow + dots fade out + ring expand ──
    const phase4 = async () => {
      const palmGrow = tr(animate(wrap, { scale: [1, 6] }, { duration: 1.2, ease: 'easeOut' }))
      sleep(0.3).then(() => {
        if (cancelled) return
        dotRefs.current.forEach((d) => {
          if (!d) return
          const cur = parseFloat(d.style.opacity || '0.55')
          tr(animate(d, { opacity: [cur, 0] }, { duration: 0.7, ease: 'easeOut' }))
        })
      })
      if (ring) {
        ring.style.opacity = '1'
        tr(animate(
          ring,
          { scale: [1, 8], opacity: [1, 0] },
          { duration: 0.9, ease: 'easeOut' },
        ))
      }
      await palmGrow.finished.catch(() => {})
    }

    // ── Fase 5 — Float label "Bienvenido a Palm." gold + glow pulse ──
    const phase5 = async () => {
      // Cambiar text/variant del float label antes del fade in
      setFloatLabel({ text: 'Bienvenido a Palm.', variant: 'palm' })
      await sleep(0.03)   // dejar que React commitee el nuevo text/className
      if (float) {
        tr(animate(float, { opacity: [0, 1] }, { duration: 0.4, ease: 'easeIn' }))
      }
      // Glow pulse
      tr(animate(gradient, {
        boxShadow: [
          '0 0 16px #9747FF',
          '0 0 32px #F0C14D',
          '0 0 16px #9747FF',
        ],
      }, { duration: 2.2, ease: 'easeInOut' }))
      await sleep(2.5)
    }

    // ── Fase 6 — Reset silencioso ──
    const phase6 = async () => {
      const fades = []
      if (main) fades.push(tr(animate(main, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeOut' })).finished)
      if (float) fades.push(tr(animate(float, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeOut' })).finished)
      fades.push(tr(animate(gradient, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeOut' })).finished)
      await Promise.all(fades.map((p) => p.catch(() => {})))
      if (cancelled) return
      // Instant reset
      setMainText('Para ellos, sos uno más.')
      setFloatLabel({ text: 'Bienvenido.', variant: 'welcome' })
      await sleep(0.03)
      wrap.style.transform = 'scale(5)'
      grey.style.opacity = '1'
      gradient.style.opacity = '0'
      gradient.style.boxShadow = '0 0 0px #9747FF88'
      if (ring) {
        ring.style.opacity = '0'
        ring.style.transform = 'scale(1)'
      }
      dotRefs.current.forEach((d) => {
        if (!d) return
        d.style.opacity = '0'
      })
    }

    ;(async () => {
      try {
        resetForLoopStart()
        await sleep(0.05)
        while (!cancelled) {
          await phase0(); if (cancelled) break
          await phase1(); if (cancelled) break
          await phase2(); if (cancelled) break
          await phase3(); if (cancelled) break
          await phase4(); if (cancelled) break
          await phase5(); if (cancelled) break
          await phase6(); if (cancelled) break
        }
      } catch {
        /* cancelled */
      }
    })()

    return () => {
      cancelled = true
      anims.forEach((a) => a.stop?.())
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="mass"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Para ellos, sos uno más. Para nosotros, no.</>}
    >
      <div className="pv-gm-stage">
        {/* Main label — top headline (siempre mismo estilo) */}
        <div ref={mainLabelRef} className="pv-gm-label" aria-hidden="true">
          {mainText}
        </div>

        {/* Float label sobre el palm — solo Fase 0 y Fase 5 */}
        <div
          ref={floatLabelRef}
          className={`pv-gm-float-label pv-gm-float-label--${floatLabel.variant}`}
          style={{ top: FLOAT_LABEL_TOP }}
          aria-hidden="true"
        >
          {floatLabel.text}
        </div>

        {/* Palm — wrap en el slot center exacto */}
        <div
          ref={palmWrapRef}
          className="pv-gm-palm-wrap"
          style={PALM_POS}
          aria-hidden="true"
        >
          <div ref={palmGreyRef} className="pv-gm-palm pv-gm-palm--grey" />
          <div ref={palmGradientRef} className="pv-gm-palm pv-gm-palm--gradient" />
        </div>

        {/* Ring — mismo slot que palm */}
        <div
          ref={ringRef}
          className="pv-gm-ring"
          style={PALM_POS}
          aria-hidden="true"
        />

        {/* 110 dots */}
        {Array.from({ length: TOTAL }).map((_, i) => {
          if (i === CENTER_IDX) return null   // omitir el slot del palm — el palm lo ocupa
          return (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el }}
              className="pv-gm-dot"
              style={dotPos(i)}
              aria-hidden="true"
            />
          )
        })}
      </div>
    </PCard>
  )
}
