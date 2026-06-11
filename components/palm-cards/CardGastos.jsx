import { useCallback, useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardGastos.css'

const ROWS = [
  { emoji: '🍔', amount: '$200,000', width: 100 },
  { emoji: '⛽', amount: '$178,000', width: 75 },
  { emoji: '⚽', amount: '$78,000',  width: 50 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardGastos({ index = 4 }) {
  const boxRef = useRef(null)
  const glowRef = useRef(null)
  const glowFlashRef = useRef(null)
  const fileRef = useRef(null)
  const pillRefs = useRef([])
  const rowRefs = useRef([])
  const pulseRef = useRef(null)            // handle al loop infinito del glow idle
  const reduceMotion = useReducedMotion()

  // ── Persistent idle (corre desde mount, no espera onReveal) ────────────
  useEffect(() => {
    if (reduceMotion) return
    const box = boxRef.current
    const glow = glowRef.current
    if (!box || !glow) return undefined

    const startGlowPulse = () => {
      pulseRef.current?.stop?.()
      pulseRef.current = animate(
        glow,
        { scale: [1.0, 1.3], opacity: [0.75, 1.0] },
        { duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      )
    }
    startGlowPulse()

    const boxAnim = animate(
      box,
      { scale: [1, 1.03, 1] },
      { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    )

    return () => {
      pulseRef.current?.stop?.()
      pulseRef.current = null
      boxAnim.stop?.()
    }
  }, [reduceMotion])

  // ── Loop principal (4 fases) ───────────────────────────────────────────
  const onReveal = useCallback(() => {
    if (reduceMotion) {
      // Estado final visible directo: rows mostradas, file y pills ocultos.
      const file = fileRef.current
      if (file) file.style.opacity = '0'
      pillRefs.current.forEach((p) => p && (p.style.opacity = '0'))
      rowRefs.current.forEach((r) => {
        if (!r) return
        r.style.opacity = '1'
        r.style.transform = 'none'
      })
      return
    }

    const file = fileRef.current
    const glow = glowRef.current
    const glowFlash = glowFlashRef.current
    if (!file || !glow) return

    let cancelled = false
    const liveAnims = new Set()
    const track = (a) => { liveAnims.add(a); return a }

    const startGlowPulse = () => {
      pulseRef.current?.stop?.()
      pulseRef.current = animate(
        glow,
        { scale: [1.0, 1.3], opacity: [0.75, 1.0] },
        { duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      )
    }
    const stopGlowPulse = () => {
      pulseRef.current?.stop?.()
      pulseRef.current = null
    }

    const resetForLoopStart = () => {
      // File visible at start position, identity transform.
      file.style.opacity = '1'
      file.style.transform = ''
      // Pills hidden, escala 0 para que el entrance scale 0→1 quede limpio.
      pillRefs.current.forEach((p) => {
        if (!p) return
        p.style.opacity = '0'
        p.style.transform = 'scale(0)'
      })
      // Rows hidden, debajo de su posición final (cerca de la caja) + scale 0.85.
      rowRefs.current.forEach((r) => {
        if (!r) return
        r.style.opacity = '0'
        r.style.transform = 'translateY(60px) scale(0.85)'
      })
    }

    // ── Fase 1 — File vuela hacia la caja + flash ──
    const phase1 = async () => {
      const fileAnim = track(animate(
        file,
        {
          y: [0, -16, 92],         // sube 16px, baja 92px hacia la caja
          scale: [1, 0.95, 0.3],
          opacity: [1, 1, 0],
          rotate: [-12, -8, 0],
        },
        { duration: 0.9, ease: 'easeIn' },
      ))
      await fileAnim.finished
      if (cancelled) return

      if (glowFlash) {
        const flashAnim = track(animate(
          glowFlash,
          { opacity: [0, 0.9, 0], scale: [1.1, 1.6, 1.1] },
          { duration: 0.3, ease: 'easeOut' },
        ))
        await flashAnim.finished
      }
    }

    // ── Fase 2 — Pills aparecen + shimmer + glow se intensifica ──
    const phase2 = async () => {
      const pills = pillRefs.current.filter(Boolean)

      // Glow se intensifica (pausamos el pulse para que no pelee).
      stopGlowPulse()
      track(animate(
        glow,
        { scale: 1.4, opacity: 1.0 },
        { duration: 0.6, ease: 'easeOut' },
      ))

      // Pills entrance — staggered.
      const appearAnims = pills.map((p, i) => track(animate(
        p,
        { scale: [0, 1], opacity: [0, 1] },
        { duration: 0.35, delay: i * 0.15, ease: 'easeOut' },
      )))
      await Promise.all(appearAnims.map((a) => a.finished))
      if (cancelled) return

      // Shimmer infinito mientras "procesa".
      const shimmerAnims = pills.map((p, i) => track(animate(
        p,
        { opacity: [1, 0.5, 1] },
        { duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' },
      )))

      await sleep(1.5)
      shimmerAnims.forEach((a) => a.stop?.())
    }

    // ── Fase 3 — Pills exit + glow burst + rows emergen desde la caja ──
    const phase3 = async () => {
      const pills = pillRefs.current.filter(Boolean)
      const rows = rowRefs.current.filter(Boolean)

      const exitAnims = pills.map((p, i) => track(animate(
        p,
        { scale: [1, 0], opacity: [1, 0] },
        { duration: 0.25, delay: i * 0.08, ease: 'easeIn' },
      )))

      // Glow burst — al arrancar la fase 3, antes del primer stagger.
      // Reemplaza el "return to idle" anterior. Después restartGlowPulse.
      const glowBurst = track(animate(
        glow,
        { scale: [1.0, 1.8, 1.2], opacity: [1.0, 1.0, 1.0] },
        { duration: 0.5, ease: 'easeOut' },
      ))

      // Pequeño overlap — empezar a entrar rows antes de que pills terminen.
      await sleep(0.15)
      if (cancelled) return

      // Rows entrance — emergen DESDE la posición de la caja (y +60) con scale-up.
      const rowAnims = rows.map((r, i) => track(animate(
        r,
        { y: [60, 0], opacity: [0, 1], scale: [0.85, 1] },
        { duration: 0.45, delay: i * 0.28, ease: 'easeOut' },
      )))

      await Promise.all([
        ...exitAnims.map((a) => a.finished),
        ...rowAnims.map((a) => a.finished),
        glowBurst.finished,
      ])
      if (cancelled) return

      startGlowPulse()
    }

    // ── Fase 4 — Hold + rows salen + reset silencioso ──
    const phase4 = async () => {
      const rows = rowRefs.current.filter(Boolean)

      await sleep(3.2)
      if (cancelled) return

      const exitAnims = rows.map((r, i) => track(animate(
        r,
        { opacity: [1, 0], y: [0, 8] },
        { duration: 0.3, delay: i * 0.1, ease: 'easeIn' },
      )))
      await Promise.all(exitAnims.map((a) => a.finished))
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
      liveAnims.forEach((a) => a.stop?.())
      liveAnims.clear()
      // El pulse persistente NO lo paramos acá — vive con el mount-effect.
      // Pero si quedó pausado tras una fase 2, lo reanudamos para que el
      // estado idle quede limpio cuando la card vuelva a viewport.
      if (!pulseRef.current && !reduceMotion) startGlowPulse()
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="gastos"
      index={index}
      onReveal={onReveal}
      headline={<>Conocé tus gastos en menos de 5 minutos</>}
    >
      <div className="pv-g5-stage">
        <div className="pv-g5-glow" ref={glowRef} aria-hidden="true" />
        <div className="pv-g5-glow-flash" ref={glowFlashRef} aria-hidden="true" />
        <img
          ref={boxRef}
          className="pv-g5-box"
          src="/Card%20Gastos/Magic%20box.png"
          alt=""
          aria-hidden="true"
        />
        <img
          ref={fileRef}
          className="pv-g5-file"
          src="/Card%20Gastos/File.svg"
          alt=""
          aria-hidden="true"
        />
        <div className="pv-g5-pills" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => { pillRefs.current[i] = el }}
              className="pv-g5-pill"
            />
          ))}
        </div>
        <div className="pv-g5-rows" aria-hidden="true">
          {ROWS.map((r, i) => (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el }}
              className="pv-g5-row"
            >
              <span className="pv-g5-emoji">{r.emoji}</span>
              <div className="pv-g5-bar" style={{ '--w': `${r.width}%` }}>
                <span className="pv-g5-amount">{r.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PCard>
  )
}
