import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardDrain.css'

// Pills como proyectiles. Cada uno:
//  - pos: CSS estática del WRAPPER (target = posición de impacto en la barra)
//  - initial: offset inicial del wrapper via transform (desde el target)
//  - fly: duración de la fly + barra contrae a este % al impactar
const PILLS = [
  // A — viene desde la izquierda, impacta lado izquierdo de la barra
  {
    text: '-$',
    pos: { left: 0, top: '2px' },
    initial: { x: -60, y: 0 },
    flyDuration: 0.7,
    barTo: 0.65,
    flashIntensity: 1,
    boxShadowPulse: false,
  },
  // B — viene desde la derecha, impacta lado derecho de la barra
  {
    text: '-$$',
    pos: { right: 0, top: '2px' },
    initial: { x: 60, y: 0 },
    flyDuration: 0.7,
    barTo: 0.35,
    flashIntensity: 1,
    boxShadowPulse: false,
  },
  // C — viene desde arriba-izquierda en diagonal (golpe final, más intenso)
  {
    text: '-$$$',
    pos: { left: 0, top: '2px' },
    initial: { x: -60, y: -20 },
    flyDuration: 0.6,
    barTo: 0.08,
    flashIntensity: 1.5,
    boxShadowPulse: true,
  },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardDrain({ index = 6 }) {
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const pillRefs = useRef([])
  const pillIdleAnimsRef = useRef([])
  const escudoRef = useRef(null)
  const ringRef = useRef(null)
  const fillPctRef = useRef(1)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final visible directo ──
    if (reduceMotion) {
      const fill = fillRef.current
      const escudo = escudoRef.current
      if (fill) fill.style.width = '100%'
      if (escudo) {
        escudo.style.opacity = '1'
        escudo.style.transform = 'none'
      }
      pillRefs.current.forEach((p) => p && (p.style.opacity = '0'))
      return
    }

    const track = trackRef.current
    const fill = fillRef.current
    const escudo = escudoRef.current
    const ring = ringRef.current
    if (!track || !fill || !escudo) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    // ── Idle bob de cada pill (cerca de su origen) ──
    const startIdleBob = (i) => {
      const pill = pillRefs.current[i]
      if (!pill) return
      pillIdleAnimsRef.current[i]?.stop?.()
      pillIdleAnimsRef.current[i] = animate(
        pill,
        { y: [0, -6, 0] },
        { duration: 1.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      )
    }
    const stopIdleBob = (i) => {
      pillIdleAnimsRef.current[i]?.stop?.()
      pillIdleAnimsRef.current[i] = null
    }
    const startAllIdleBobs = () => PILLS.forEach((_, i) => startIdleBob(i))
    const stopAllIdleBobs = () => PILLS.forEach((_, i) => stopIdleBob(i))

    // ── Pill ataca: vuela desde el offset inicial al target (0, 0 relative al wrapper) ──
    // El wrapper tiene translate(initial.x, initial.y) estático.
    // El pill anima x/y hacia (-initial.x, -initial.y) para que en pantalla termine en target.
    const flyPill = (i) => {
      const p = PILLS[i]
      const pill = pillRefs.current[i]
      if (!pill) return null
      stopIdleBob(i)
      return tr(animate(
        pill,
        {
          x: [0, -p.initial.x],
          y: [0, -p.initial.y],
          opacity: [0, 1, 1, 0],
        },
        { duration: p.flyDuration, ease: 'easeIn' },
      ))
    }

    // ── Bar contract — actualiza width + fillPctRef en sync ──
    const contractBar = (from, to, duration) =>
      tr(animate(from, to, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => {
          fillPctRef.current = v
          fill.style.width = (v * 100).toFixed(2) + '%'
        },
      }))

    // ── Flash rojo: brightness + hue-rotate hacia rojo, ramp up + down ──
    const flashRed = (intensity = 1) =>
      tr(animate(0, 1, {
        duration: 0.3,
        ease: 'easeInOut',
        onUpdate: (t) => {
          const ramp = t < 0.5 ? t * 2 : (1 - t) * 2
          const brightness = (1 + ramp * 0.4 * intensity).toFixed(2)
          const hue = (ramp * 30 * intensity).toFixed(0)
          fill.style.filter = `brightness(${brightness}) hue-rotate(-${hue}deg)`
        },
      }))

    // ── Box-shadow pulse rojo en el track (golpe final) ──
    const boxShadowPulse = () =>
      tr(animate(0, 1, {
        duration: 0.8,
        ease: 'easeInOut',
        onUpdate: (t) => {
          const ramp = t < 0.5 ? t * 2 : (1 - t) * 2
          track.style.boxShadow = `0 0 ${(ramp * 20).toFixed(1)}px #FF4444`
        },
      }))

    // ── Reset para el siguiente loop ──
    const resetForLoopStart = () => {
      fill.style.width = '100%'
      fill.style.opacity = '1'
      fill.style.filter = ''
      fillPctRef.current = 1
      escudo.style.opacity = '0'
      escudo.style.transform = ''
      if (ring) {
        ring.style.opacity = '0'
        ring.style.transform = ''
      }
      track.style.boxShadow = '0 0 0px #FF4444'
      // Pills: visibles en idle (opacity 1, transform reset → wrapper provee offset)
      pillRefs.current.forEach((pill) => {
        if (!pill) return
        pill.style.opacity = '1'
        pill.style.transform = ''
      })
      startAllIdleBobs()
    }

    // ── Fase 1 — 3 oleadas de pills atacantes ──
    const phase1 = async () => {
      let currentPct = 1
      for (let i = 0; i < PILLS.length; i++) {
        if (cancelled) return
        const p = PILLS[i]
        // Pill ataca
        const fly = flyPill(i)
        if (!fly) continue
        await fly.finished                                 // espera el fly completo
        if (cancelled) return
        // Al impactar — contraer barra + flash rojo (en paralelo)
        contractBar(currentPct, p.barTo, 0.4)
        flashRed(p.flashIntensity)
        currentPct = p.barTo
        // Golpe final: además box-shadow pulse + sleep largo para que termine
        if (p.boxShadowPulse) {
          boxShadowPulse()
          await sleep(0.8)
        } else {
          await sleep(0.3)                                 // gap antes del próximo pill
        }
      }
    }

    // ── Fase 2 — estado crítico (sin cambios funcionales: el pulse final
    //    ya quedó disparado en fase 1 cuando golpeó pill C; acá solo
    //    sostenemos el momento brevemente para que el espectador asimile). ──
    const phase2 = async () => {
      await sleep(0.6)
      stopAllIdleBobs()
    }

    // ── Fase 3 — Escudo aparece + pulse + ring ──────────────────────
    const phase3 = async () => {
      // (Pill exit eliminada — las pills ya están en opacity 0 tras su ataque.)
      await sleep(0.3)
      if (cancelled) return

      // Escudo entra desde abajo
      await tr(animate(
        escudo,
        { y: [40, 0], opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.55, ease: 'easeOut' },
      )).finished
      if (cancelled) return

      // Pulse activación + ring expand simultáneos
      tr(animate(escudo, { scale: [1, 1.15, 1] }, { duration: 0.4, ease: 'easeInOut' }))
      if (ring) {
        tr(animate(
          ring,
          { scale: [0.8, 1.8], opacity: [0.8, 0] },
          { duration: 0.6, ease: 'easeOut' },
        ))
      }
    }

    // ── Fase 4 — Restoration (barra recupera 100%) + escudo pulse suave ──
    const phase4 = async () => {
      const restore = tr(animate(0.08, 1, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (v) => {
          fillPctRef.current = v
          fill.style.width = (v * 100).toFixed(2) + '%'
        },
      }))
      await restore.finished
      if (cancelled) return

      // Reset del filter (flash residual) cuando la barra ya está restaurada
      fill.style.filter = ''

      await tr(animate(
        escudo,
        { scale: [1, 1.08, 1] },
        { duration: 0.5, ease: 'easeInOut' },
      )).finished
    }

    // ── Fase 5 — Hold + reset ────────────────────────────────────────
    const phase5 = async () => {
      await sleep(2.5)
      if (cancelled) return

      await tr(animate(
        escudo,
        { opacity: [1, 0], scale: [1, 0.9] },
        { duration: 0.4, ease: 'easeIn' },
      )).finished
      if (cancelled) return

      fill.style.opacity = '0'
      fill.style.width = '100%'
      fillPctRef.current = 1
      await sleep(0.1)
      fill.style.opacity = '1'
      track.style.boxShadow = '0 0 0px #FF4444'
    }

    ;(async () => {
      try {
        resetForLoopStart()
        await sleep(0.8)
        while (!cancelled) {
          await phase1(); if (cancelled) break
          await phase2(); if (cancelled) break
          await phase3(); if (cancelled) break
          await phase4(); if (cancelled) break
          await phase5(); if (cancelled) break
        }
      } catch {
        /* cancelled — silencioso */
      }
    })()

    return () => {
      cancelled = true
      anims.forEach((a) => a.stop?.())
      pillIdleAnimsRef.current.forEach((a) => a?.stop?.())
      pillIdleAnimsRef.current = []
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="drain"
      index={index}
      onReveal={onReveal}
      headline={<>Las comisiones ocultas que te drenan.</>}
    >
      <div className="pv-gd-stage">
        <div className="pv-gd-bar-wrap">
          <span className="pv-gd-bar-label">tu plata</span>
          <div ref={trackRef} className="pv-gd-bar-track">
            <div ref={fillRef} className="pv-gd-bar-fill" />
          </div>
          {/* Pills proyectiles — wrappers con offset estático, hijos animables */}
          {PILLS.map((p, i) => (
            <div
              key={i}
              className="pv-gd-fee-pos"
              style={{
                ...p.pos,
                transform: `translate(${p.initial.x}px, ${p.initial.y}px)`,
              }}
              aria-hidden="true"
            >
              <div
                ref={(el) => { pillRefs.current[i] = el }}
                className="pv-gd-fee"
              >
                {p.text}
              </div>
            </div>
          ))}
        </div>

        <img
          ref={escudoRef}
          className="pv-gd-escudo"
          src="/Card%20Privacy/escudo.svg"
          alt=""
          aria-hidden="true"
        />
        <div ref={ringRef} className="pv-gd-ring" aria-hidden="true" />
      </div>
    </PCard>
  )
}
