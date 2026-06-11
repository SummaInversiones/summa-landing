import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import './PCard.css'

/**
 * PCard — shell reusable. Compone:
 *  - entrance fade+lift on inView, stagger por `index`
 *  - blobs decorativos data-driven con idle drift
 *  - headline + visual slot
 *
 * Props:
 *  variant     'cc' | 'goals' | 'portfolio' | 'zero' | string  (clase .pv-pcard--<variant>)
 *  index       posición en el grid → delay del stagger (index * 0.1s)
 *  blobs       Array<{cx:number, cy:number, rot?:number}>  (%; rot en deg)
 *  headline    ReactNode  (string o JSX con <span className="pv-kw">…</span>)
 *  onReveal    callback() invocado cuando termina el entrance — la card lo usa
 *              para arrancar su loop interno
 *  children    el visual focal (lo que va dentro de .pv-pcard__visual)
 */
export default function PCard({
  variant,
  index = 0,
  blobs = [],
  headline,
  onReveal,
  className = '',
  children,
}) {
  const cardRef = useRef(null)
  const blobsRef = useRef([])
  const reduceMotion = useReducedMotion()
  const inView = useInView(cardRef, { margin: '-80px 0px', once: true })

  useEffect(() => {
    if (!inView) return
    const card = cardRef.current
    if (!card) return

    if (reduceMotion) {
      // Estado final visible inmediato.
      card.style.opacity = '1'
      card.style.transform = 'none'
      onReveal?.()
      return
    }

    let cancelled = false
    const blobAnims = []

    const run = async () => {
      // Entrance — fade + lift, stagger via index
      const entrance = animate(
        card,
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] },
      )
      try {
        await entrance.finished
      } catch {
        return
      }
      if (cancelled) return

      // Idle: blobs derivan suave (solo translate — rotate haría override del --rot estático).
      blobsRef.current.forEach((blob, bi) => {
        if (!blob) return
        const a = animate(
          blob,
          {
            x: [0, bi % 2 ? -10 : 12, 0],
            y: [0, bi % 2 ? 8 : -10, 0],
          },
          { duration: 22 + bi * 3.5, repeat: Infinity, ease: 'easeInOut' },
        )
        blobAnims.push(a)
      })

      onReveal?.()
    }

    run()

    return () => {
      cancelled = true
      blobAnims.forEach((a) => a.stop?.())
    }
  }, [inView, reduceMotion, index, onReveal])

  // Initial style: si reduce-motion, render directo en estado final (sin flash).
  const initialStyle = reduceMotion
    ? { opacity: 1 }
    : { opacity: 0, transform: 'translateY(24px)' }

  return (
    <motion.article
      ref={cardRef}
      className={`pv-pcard pv-pcard--${variant} ${className}`.trim()}
      style={initialStyle}
    >
      {blobs.length > 0 && (
        <div className="pv-pcard__bg" aria-hidden="true">
          {blobs.map((b, i) => (
            <span
              key={i}
              ref={(el) => {
                blobsRef.current[i] = el
              }}
              className="pv-pcard__blob"
              style={{
                '--cx': `${b.cx}%`,
                '--cy': `${b.cy}%`,
                '--rot': `${b.rot ?? 0}deg`,
              }}
            />
          ))}
        </div>
      )}
      <h3 className="pv-pcard__headline">{headline}</h3>
      <div className="pv-pcard__visual">{children}</div>
    </motion.article>
  )
}
