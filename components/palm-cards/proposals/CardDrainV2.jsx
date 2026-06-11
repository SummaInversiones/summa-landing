import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardDrainV2.css'

// Concepto: el tanque. Tu plata como nivel de líquido; cada comisión
// oculta es una fuga etiquetada que la drena, gota a gota. Palm sella
// las fugas (parches dorados) y el nivel se recupera. "Drenar", literal.

// Fugas: posición vertical (% del stage), etiqueta, nivel al que deja el tanque.
const LEAKS = [
  { y: 30, label: 'mantenimiento −$',  levelTo: 0.68 },
  { y: 48, label: 'custodia −$$',      levelTo: 0.42 },
  { y: 66, label: 'cargos ocultos −$$$', levelTo: 0.14 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardDrainV2({ index = 2 }) {
  const fillRef = useRef(null)
  const labelRefs = useRef([])
  const dripRefs = useRef([])
  const patchRefs = useRef([])
  const shineRef = useRef(null)
  const dripAnimsRef = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: tanque lleno y fugas selladas, estático ──
    if (reduceMotion) {
      if (fillRef.current) fillRef.current.style.height = '100%'
      labelRefs.current.forEach((l) => l && (l.style.opacity = '0'))
      dripRefs.current.forEach((d) => d && (d.style.opacity = '0'))
      patchRefs.current.forEach((p) => {
        if (!p) return
        p.style.opacity = '1'
        p.style.transform = 'none'
      })
      return
    }

    const fill = fillRef.current
    if (!fill) return

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
    const stopDrips = () => {
      dripAnimsRef.current.forEach((a) => a?.stop?.())
      dripAnimsRef.current = []
      dripRefs.current.forEach((d) => d && (d.style.opacity = '0'))
    }

    const setLevel = (v) => { fill.style.height = (v * 100).toFixed(2) + '%' }

    const drainTo = (from, to) =>
      tr(animate(from, to, {
        duration: 0.7,
        ease: 'easeOut',
        onUpdate: setLevel,
      })).finished

    const resetForLoopStart = () => {
      setLevel(1)
      fill.style.opacity = '1'
      labelRefs.current.forEach((l) => l && (l.style.opacity = '0'))
      patchRefs.current.forEach((p) => {
        if (!p) return
        p.style.opacity = '0'
        p.style.transform = 'scale(0)'
      })
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

    // ── Fase 2 — Palm sella: parches dorados, las gotas paran ──
    const phase2 = async () => {
      const seals = patchRefs.current.map((p, i) => {
        if (!p) return null
        return tr(animate(
          p,
          { opacity: [0, 1], scale: [0, 1] },
          { duration: 0.35, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
        ))
      }).filter(Boolean)
      // Cada parche apaga su fuga al aterrizar.
      LEAKS.forEach((_, i) => {
        sleep(0.2 + i * 0.15).then(() => {
          if (cancelled) return
          dripAnimsRef.current[i]?.stop?.()
          const drip = dripRefs.current[i]
          if (drip) drip.style.opacity = '0'
          const label = labelRefs.current[i]
          if (label) tr(animate(label, { opacity: [1, 0.25] }, { duration: 0.4, ease: 'easeOut' }))
        })
      })
      await Promise.all(seals.map((a) => a.finished))
      if (cancelled) return
      await sleep(0.25)
    }

    // ── Fase 3 — el nivel se recupera + brillo ──
    const phase3 = async () => {
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
      const outs = []
      patchRefs.current.forEach((p) => {
        if (!p) return
        outs.push(tr(animate(p, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
      })
      labelRefs.current.forEach((l) => {
        if (!l) return
        outs.push(tr(animate(l, { opacity: [0.25, 0] }, { duration: 0.3, ease: 'easeIn' })).finished)
      })
      await Promise.all(outs.map((pr) => pr.catch(() => {})))
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
              ref={(el) => { patchRefs.current[i] = el }}
              className="pv-p7-patch"
            />
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
      </div>
    </PCard>
  )
}
