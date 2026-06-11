import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardPrivacy.css'

const BLOBS = [
  { cx: 8,  cy: 35,  rot: -25 },
  { cx: 96, cy: 55,  rot: 38  },
  { cx: 42, cy: 102, rot: 10  },
]

// 6 dots distribuidos alrededor del mobile/escudo (% del stage, centro del dot).
const DOTS = [
  { cx: 50, cy: 10 },  // top
  { cx: 82, cy: 28 },  // upper-right
  { cx: 88, cy: 65 },  // lower-right
  { cx: 56, cy: 92 },  // bottom
  { cx: 14, cy: 65 },  // lower-left
  { cx: 18, cy: 28 },  // upper-left
]

const RED  = '#FF6B6B'
const GOLD = '#F0C14D'

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

// Punto de exit radial — extiende cada dot desde el centro hacia su dirección.
const exitPos = (cx, cy, distance = 60) => {
  const dx = cx - 50
  const dy = cy - 50
  const len = Math.hypot(dx, dy) || 1
  return { x: cx + (dx / len) * distance, y: cy + (dy / len) * distance }
}

export default function CardPrivacy({ index = 5 }) {
  const mobileRef = useRef(null)
  const escudoRef = useRef(null)
  const ringRef = useRef(null)
  const tagRef = useRef(null)
  const statNumRef = useRef(null)
  const statTxtRef = useRef(null)
  const dotRefs = useRef([])
  const idleDotAnimsRef = useRef([])
  const reduceMotion = useReducedMotion()

  const stopIdleFloat = useCallback(() => {
    idleDotAnimsRef.current.forEach((a) => a.stop?.())
    idleDotAnimsRef.current = []
  }, [])

  const startIdleFloat = useCallback(() => {
    stopIdleFloat()
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const a = animate(
        dot,
        { y: [0, -6, 0, 6, 0] },
        { duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' },
      )
      idleDotAnimsRef.current.push(a)
    })
  }, [stopIdleFloat])

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final estático (escudo + dots gold visibles) ──
    if (reduceMotion) {
      const mobile = mobileRef.current
      const escudo = escudoRef.current
      const ring = ringRef.current
      const tag = tagRef.current
      const statNum = statNumRef.current
      const statTxt = statTxtRef.current
      if (mobile) mobile.style.opacity = '0'
      if (escudo) {
        escudo.style.opacity = '1'
        escudo.style.transform = 'none'
      }
      if (ring) ring.style.opacity = '0'
      if (tag) {
        tag.style.opacity = '1'
        tag.style.transform = 'none'
      }
      if (statNum) statNum.style.opacity = '0'
      if (statTxt) statTxt.style.opacity = '0'
      DOTS.forEach((p, i) => {
        const dot = dotRefs.current[i]
        if (!dot) return
        dot.style.left = p.cx + '%'
        dot.style.top = p.cy + '%'
        dot.style.backgroundColor = GOLD
        dot.style.opacity = '1'
        dot.style.transform = 'none'
      })
      return
    }

    let cancelled = false
    const tracked = new Set()
    const track = (a) => { tracked.add(a); return a }

    const placeDotsAt = (color) => {
      DOTS.forEach((p, i) => {
        const dot = dotRefs.current[i]
        if (!dot) return
        dot.style.left = p.cx + '%'
        dot.style.top = p.cy + '%'
        dot.style.backgroundColor = color
        dot.style.opacity = '1'
        dot.style.transform = ''
      })
    }

    const resetForLoopStart = () => {
      const mobile = mobileRef.current
      const escudo = escudoRef.current
      const ring = ringRef.current
      const tag = tagRef.current
      const statNum = statNumRef.current
      const statTxt = statTxtRef.current
      if (mobile) {
        mobile.style.opacity = '0.7'
        mobile.style.transform = ''
      }
      if (escudo) {
        escudo.style.opacity = '0'
        escudo.style.transform = ''
      }
      if (ring) {
        ring.style.opacity = '0'
        ring.style.transform = ''
      }
      if (tag) {
        tag.style.opacity = '0'
        tag.style.transform = ''
      }
      if (statNum) {
        statNum.style.opacity = '0'
        statNum.style.transform = ''
        statNum.textContent = '0%'
      }
      if (statTxt) {
        statTxt.style.opacity = '0'
      }
      placeDotsAt(RED)
      startIdleFloat()
    }

    // ── Fase 1 — Leak (datos huyen + count-up 73%) ────────────────────
    const phase1 = async () => {
      stopIdleFloat()
      const mobile = mobileRef.current
      const statNum = statNumRef.current
      const statTxt = statTxtRef.current

      // Dots vuelan radialmente hacia afuera con stagger 0.08s.
      const dotAnims = dotRefs.current.map((dot, i) => {
        if (!dot) return null
        const { cx, cy } = DOTS[i]
        const ex = exitPos(cx, cy, 60)
        return track(animate(
          dot,
          {
            left: [cx + '%', ex.x + '%'],
            top:  [cy + '%', ex.y + '%'],
            opacity: [1, 0],
            scale: [1, 0.4],
          },
          { duration: 0.6, delay: i * 0.08, ease: 'easeIn' },
        ))
      }).filter(Boolean)

      // Mobile shake
      if (mobile) {
        track(animate(mobile, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.5, ease: 'easeOut' }))
      }

      // 73% appear + count-up
      let countPromise = Promise.resolve()
      if (statNum) {
        track(animate(statNum, { opacity: [0, 1] }, { duration: 0.3, ease: 'easeOut' }))
        const countAnim = track(animate(0, 73, {
          duration: 1.2,
          ease: 'easeOut',
          onUpdate: (v) => { statNum.textContent = Math.round(v) + '%' },
        }))
        countPromise = countAnim.finished
      }
      try { await countPromise } catch { return }
      if (cancelled) return

      // Subtext fades in after count
      if (statTxt) {
        try {
          await track(animate(statTxt, { opacity: [0, 1] }, { duration: 0.4, ease: 'easeOut' })).finished
        } catch { return }
      }
      // Esperar a que los dots terminen su salida (probablemente ya lo hicieron).
      await Promise.all(dotAnims.map((a) => a.finished)).catch(() => {})
    }

    // ── Fase 2 — Hold del problema + mobile fade out ─────────────────
    const phase2 = async () => {
      const mobile = mobileRef.current
      if (mobile) {
        track(animate(mobile, { opacity: [0.7, 0] }, { duration: 0.5, ease: 'easeOut' }))
      }
      await sleep(1.8)
    }

    // ── Fase 3 — Resolución Palm (escudo + ring + gold dots) ─────────
    const phase3 = async () => {
      const escudo = escudoRef.current
      const ring = ringRef.current
      const statNum = statNumRef.current
      const statTxt = statTxtRef.current

      // 73% + subtexto fade/scale out
      if (statNum) {
        track(animate(statNum, { opacity: [1, 0], scale: [1, 0.8] }, { duration: 0.4, ease: 'easeIn' }))
      }
      if (statTxt) {
        track(animate(statTxt, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' }))
      }
      await sleep(0.4)
      if (cancelled) return

      // Escudo enters from below
      if (escudo) {
        try {
          await track(animate(
            escudo,
            { y: [50, 0], opacity: [0, 1], scale: [0.8, 1] },
            { duration: 0.6, ease: 'easeOut' },
          )).finished
        } catch { return }
        if (cancelled) return

        // Pulse del escudo
        track(animate(escudo, { scale: [1, 1.12, 1] }, { duration: 0.4, ease: 'easeInOut' }))
      }

      // Ring expand + fade simultáneo
      if (ring) {
        track(animate(
          ring,
          { opacity: [0.8, 0], scale: [0.8, 1.6] },
          { duration: 0.6, ease: 'easeOut' },
        ))
      }

      // Dots vuelven en gold con scale-up
      const dotEnter = dotRefs.current.map((dot, i) => {
        if (!dot) return null
        const { cx, cy } = DOTS[i]
        dot.style.left = cx + '%'
        dot.style.top = cy + '%'
        dot.style.backgroundColor = GOLD
        dot.style.transform = 'scale(0)'
        dot.style.opacity = '0'
        return track(animate(
          dot,
          { opacity: [0, 1], scale: [0, 1] },
          { duration: 0.3, delay: i * 0.1, ease: 'easeOut' },
        ))
      }).filter(Boolean)

      await Promise.all(dotEnter.map((a) => a.finished)).catch(() => {})
      if (cancelled) return

      // "te cuidamos" — cierra la fase con el tagline
      const tag = tagRef.current
      if (tag) {
        try {
          await track(animate(
            tag,
            { opacity: [0, 1], y: [10, 0] },
            { duration: 0.45, ease: 'easeOut' },
          )).finished
        } catch { return }
        if (cancelled) return
      }

      // Gold idle float
      startIdleFloat()
    }

    // ── Fase 4 — Hold resolución + reset (fade out all) ──────────────
    const phase4 = async () => {
      const escudo = escudoRef.current
      const tag = tagRef.current
      await sleep(2.8)
      if (cancelled) return
      stopIdleFloat()

      const fades = []
      if (escudo) {
        fades.push(track(animate(escudo, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
      }
      if (tag) {
        fades.push(track(animate(tag, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
      }
      dotRefs.current.forEach((dot) => {
        if (!dot) return
        fades.push(track(animate(dot, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeIn' })).finished)
      })
      await Promise.all(fades).catch(() => {})
    }

    ;(async () => {
      try {
        resetForLoopStart()
        // Mostrar la Fase 0 (idle inicial) un par de segundos antes de comenzar el ciclo.
        await sleep(2.0)
        while (!cancelled) {
          await phase1(); if (cancelled) break
          await phase2(); if (cancelled) break
          await phase3(); if (cancelled) break
          await phase4(); if (cancelled) break
          resetForLoopStart()
        }
      } catch {
        /* cancelled — silencioso */
      }
    })()

    return () => {
      cancelled = true
      tracked.forEach((a) => a.stop?.())
      tracked.clear()
      stopIdleFloat()
    }
  }, [reduceMotion, startIdleFloat, stopIdleFloat])

  return (
    <PCard
      variant="privacy"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Si es gratis, alguien lo paga.</>}
    >
      <div className="pv-g6-stage">
        <img
          ref={mobileRef}
          className="pv-g6-mobile"
          src="/Card%20Privacy/mobile.svg"
          alt=""
          aria-hidden="true"
        />
        {DOTS.map((p, i) => (
          <span
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            className="pv-g6-dot"
            style={{ left: p.cx + '%', top: p.cy + '%' }}
          />
        ))}
        <div className="pv-g6-stat" aria-hidden="true">
          <div ref={statNumRef} className="pv-g6-stat-number">0%</div>
          <div ref={statTxtRef} className="pv-g6-stat-text">
            de las apps gratis venden tus datos
          </div>
        </div>
        <img
          ref={escudoRef}
          className="pv-g6-escudo"
          src="/Card%20Privacy/escudo.svg"
          alt=""
          aria-hidden="true"
        />
        <div ref={tagRef} className="pv-g6-tag" aria-hidden="true">te cuidamos</div>
        <div ref={ringRef} className="pv-g6-ring" aria-hidden="true" />
      </div>
    </PCard>
  )
}
