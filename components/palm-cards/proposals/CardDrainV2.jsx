import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardDrainV2.css'

// Concepto: el tanque. Tu plata como nivel de líquido; cada comisión
// oculta es una fuga etiquetada que la drena, gota a gota. El escudo de
// Palm baja fuga por fuga y ECHA cada comisión de un golpe; el nivel
// se recupera. "Drenar", literal.

// Fugas: posición vertical (% del stage), etiqueta, nivel al que deja el tanque.
const LEAKS = [
  { y: 30, label: 'mantenimiento −$',  levelTo: 0.68 },
  { y: 48, label: 'custodia −$$',      levelTo: 0.42 },
  { y: 66, label: 'cargos ocultos −$$$', levelTo: 0.14 },
]

// El escudo se centra en la fila de cada fuga (offset = ~media altura del escudo).
const escudoTop = (leakY) => leakY - 7

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardDrainV2({ index = 2 }) {
  const fillRef = useRef(null)
  const labelRefs = useRef([])
  const dripRefs = useRef([])
  const escudoRef = useRef(null)
  const shineRef = useRef(null)
  const dripAnimsRef = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: tanque lleno, comisiones echadas, escudo de guardia ──
    if (reduceMotion) {
      if (fillRef.current) fillRef.current.style.height = '100%'
      labelRefs.current.forEach((l) => l && (l.style.opacity = '0'))
      dripRefs.current.forEach((d) => d && (d.style.opacity = '0'))
      const escudo = escudoRef.current
      if (escudo) {
        escudo.style.opacity = '1'
        escudo.style.top = escudoTop(LEAKS[1].y) + '%'
      }
      return
    }

    const fill = fillRef.current
    const escudo = escudoRef.current
    if (!fill || !escudo) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    const startDrip = (i) => {
      const drip = dripRefs.current[i]
      if (!drip) return
      dripAnimsRef.current[i]?.stop?.()
      dripAnimsRef.current[i] = animate(
        drip,
        { y: [0, 30], opacity: [0, 0.9, 0] },
        { duration: 0.8, repeat: Infinity, ease: 'easeIn' },
      )
    }
    const stopDrip = (i) => {
      dripAnimsRef.current[i]?.stop?.()
      dripAnimsRef.current[i] = null
      const drip = dripRefs.current[i]
      if (drip) drip.style.opacity = '0'
    }
    const stopDrips = () => LEAKS.forEach((_, i) => stopDrip(i))

    const setLevel = (v) => { fill.style.height = (v * 100).toFixed(2) + '%' }

    const drainTo = (from, to) =>
      tr(animate(from, to, {
        duration: 0.7,
        ease: 'easeOut',
        onUpdate: setLevel,
      })).finished

    // Mueve el escudo (top en %) hasta la fila de una fuga.
    const escudoMoveTo = (leakY, duration = 0.4) => {
      const fromTop = parseFloat(escudo.style.top || escudoTop(LEAKS[0].y))
      const toTop = escudoTop(leakY)
      return tr(animate(fromTop, toTop, {
        duration,
        ease: 'easeInOut',
        onUpdate: (v) => { escudo.style.top = v.toFixed(2) + '%' },
      })).finished
    }

    const resetForLoopStart = () => {
      setLevel(1)
      fill.style.opacity = '1'
      labelRefs.current.forEach((l) => {
        if (!l) return
        l.style.opacity = '0'
        l.style.transform = ''
      })
      escudo.style.opacity = '0'
      escudo.style.top = escudoTop(LEAKS[0].y) + '%'
      escudo.style.transform = ''
      if (shineRef.current) shineRef.current.style.opacity = '0'
      stopDrips()
    }

    // ── Fase 1 — las fugas se abren una a una; el nivel baja ──
    const phase1 = async () => {
      let level = 1
      for (let i = 0; i < LEAKS.length; i++) {
        if (cancelled) return
        const label = labelRefs.current[i]
        if (label) {
          await tr(animate(label, { opacity: [0, 1], x: [-8, 0] }, { duration: 0.35, ease: 'easeOut' })).finished
        }
        if (cancelled) return
        startDrip(i)
        await drainTo(level, LEAKS[i].levelTo)
        level = LEAKS[i].levelTo
        if (cancelled) return
        await sleep(0.35)
      }
      await sleep(0.6)
    }

    // ── Fase 2 — el escudo baja fuga por fuga y echa cada comisión ──
    const phase2 = async () => {
      // Entra a la altura de la primera fuga.
      await tr(animate(
        escudo,
        { opacity: [0, 1], x: [-22, 0], scale: [0.8, 1] },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      )).finished
      if (cancelled) return

      for (let i = 0; i < LEAKS.length; i++) {
        if (cancelled) return
        if (i > 0) {
          await escudoMoveTo(LEAKS[i].y)
          if (cancelled) return
        }
        // Embiste: el escudo golpea y la comisión sale volando de la card.
        const label = labelRefs.current[i]
        tr(animate(escudo, { x: [0, 28, 0] }, { duration: 0.3, ease: 'easeIn' }))
        await sleep(0.12) // el golpe conecta a mitad de la embestida
        if (cancelled) return
        stopDrip(i)
        if (label) {
          tr(animate(
            label,
            { x: [0, 260], rotate: [0, 24], opacity: [1, 1, 0] },
            { duration: 0.5, ease: 'easeIn' },
          ))
        }
        await sleep(0.45)
      }
    }

    // ── Fase 3 — el nivel se recupera + brillo; el escudo queda de guardia ──
    const phase3 = async () => {
      tr(animate(escudo, { scale: [1, 1.1, 1] }, { duration: 0.5, ease: 'easeInOut' }))
      await tr(animate(0.14, 1, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: setLevel,
      })).finished
      if (cancelled) return
      const shine = shineRef.current
      if (shine) {
        shine.style.opacity = '1'
        await tr(animate(shine, { x: ['-120%', '220%'] }, { duration: 0.8, ease: 'easeInOut' })).finished
        shine.style.opacity = '0'
      }
      await sleep(2.2)
    }

    // ── Fase 4 — salida silenciosa ──
    const phase4 = async () => {
      await tr(animate(escudo, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished
    }

    ;(async () => {
      try {
        while (!cancelled) {
          resetForLoopStart()
          await sleep(0.7)
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
      dripAnimsRef.current.forEach((a) => a?.stop?.())
      dripAnimsRef.current = []
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="drain2"
      index={index}
      onReveal={onReveal}
      headline={<>Las comisiones ocultas que te drenan.</>}
    >
      <div className="pv-p7-stage">
        <div className="pv-p7-tank-wrap" aria-hidden="true">
          <span className="pv-p7-tank-label">tu plata</span>
          <div className="pv-p7-tank">
            <div ref={fillRef} className="pv-p7-fill">
              <div ref={shineRef} className="pv-p7-shine" />
            </div>
          </div>
        </div>

        {LEAKS.map((l, i) => (
          <div key={i} className="pv-p7-leak" style={{ top: l.y + '%' }} aria-hidden="true">
            <span
              ref={(el) => { dripRefs.current[i] = el }}
              className="pv-p7-drip"
            />
            <span
              ref={(el) => { labelRefs.current[i] = el }}
              className="pv-p7-fee"
            >
              {l.label}
            </span>
          </div>
        ))}

        <img
          ref={escudoRef}
          className="pv-p7-escudo"
          src="/Card%20Privacy/escudo.svg"
          alt=""
          aria-hidden="true"
          style={{ top: escudoTop(LEAKS[0].y) + '%' }}
        />
      </div>
    </PCard>
  )
}
