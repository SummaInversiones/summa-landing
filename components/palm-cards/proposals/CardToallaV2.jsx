import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardToallaV2.css'

// Concepto (extra, a modo de prueba): la toalla. Las comisiones ocultas
// te escurren como a una toalla — dos manos la retuercen y gotea tu
// plata. Mismo título que Drain; otra manera de decir "te exprimen".

const DROPS = [
  { x: 138, delay: 0 },
  { x: 152, delay: 0.25 },
  { x: 144, delay: 0.5 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardToallaV2({ index = 0 }) {
  const handLRef = useRef(null)
  const handRRef = useRef(null)
  const towelRef = useRef(null)
  const creasesRef = useRef(null)
  const dropRefs = useRef([])
  const tagRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: toalla retorcida, estática, sin gotas ──
    if (reduceMotion) {
      if (handLRef.current) handLRef.current.style.transform = 'rotate(-16deg)'
      if (handRRef.current) handRRef.current.style.transform = 'rotate(16deg)'
      if (towelRef.current) towelRef.current.style.transform = 'scaleY(0.78)'
      if (creasesRef.current) creasesRef.current.style.opacity = '1'
      if (tagRef.current) tagRef.current.style.opacity = '1'
      return
    }

    const handL = handLRef.current
    const handR = handRRef.current
    const towel = towelRef.current
    const creases = creasesRef.current
    if (!handL || !handR || !towel) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    ;(async () => {
      try {
        // El tag de las comisiones aparece una vez y queda.
        if (tagRef.current) {
          tr(animate(tagRef.current, { opacity: [0, 1] }, { duration: 0.4, ease: 'easeOut' }))
        }
        while (!cancelled) {
          // ── Fase 1 — agarre (pausa con la toalla floja) ──
          await sleep(0.7)
          if (cancelled) break

          // ── Fase 2 — escurrida: las manos retuercen, la toalla se tensa ──
          tr(animate(handL, { rotate: [0, -16] }, { duration: 0.6, ease: 'easeInOut' }))
          tr(animate(handR, { rotate: [0, 16] }, { duration: 0.6, ease: 'easeInOut' }))
          tr(animate(towel, { scaleY: [1, 0.78] }, { duration: 0.6, ease: 'easeInOut' }))
          if (creases) tr(animate(creases, { opacity: [0, 1] }, { duration: 0.5, ease: 'easeIn' }))
          await sleep(0.6)
          if (cancelled) break

          // ── Fase 3 — gotea tu plata (dos tandas de gotas) ──
          for (let wave = 0; wave < 2 && !cancelled; wave++) {
            const falls = DROPS.map((d, i) => {
              const drop = dropRefs.current[i]
              if (!drop) return null
              return tr(animate(
                drop,
                { y: [0, 56], opacity: [0, 1, 1, 0] },
                { duration: 0.75, delay: d.delay, ease: 'easeIn' },
              ))
            }).filter(Boolean)
            await Promise.all(falls.map((a) => a.finished))
          }
          if (cancelled) break
          await sleep(0.4)

          // ── Fase 4 — soltar: la toalla vuelve a quedar floja ──
          tr(animate(handL, { rotate: [-16, 0] }, { duration: 0.5, ease: 'easeInOut' }))
          tr(animate(handR, { rotate: [16, 0] }, { duration: 0.5, ease: 'easeInOut' }))
          tr(animate(towel, { scaleY: [0.78, 1] }, { duration: 0.5, ease: 'easeInOut' }))
          if (creases) tr(animate(creases, { opacity: [1, 0] }, { duration: 0.4, ease: 'easeOut' }))
          await sleep(0.5)
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
      variant="toalla"
      index={index}
      onReveal={onReveal}
      headline={<>Las comisiones ocultas que te drenan.</>}
    >
      <div className="pv-p9-stage">
        <span ref={tagRef} className="pv-p9-tag" aria-hidden="true">
          comisiones ocultas
        </span>
        <svg className="pv-p9-scene" viewBox="0 0 300 190" aria-hidden="true">
          {/* Toalla — floja por defecto; se tensa al escurrir (scaleY). */}
          <g ref={towelRef} className="pv-p9-towel">
            <path
              d="M 52 88 Q 150 116 248 88"
              fill="none"
              stroke="#FBF3DC"
              strokeWidth="30"
              strokeLinecap="round"
            />
            {/* Pliegues — aparecen al retorcer. */}
            <g ref={creasesRef} className="pv-p9-creases" opacity="0">
              <path d="M 122 86 L 134 106" stroke="#7B8BD4" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 146 90 L 158 108" stroke="#7B8BD4" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 170 86 L 182 104" stroke="#7B8BD4" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>

          {/* Manos — mitones planos navy que retuercen los extremos. */}
          <g ref={handLRef} className="pv-p9-hand">
            <rect x="22" y="70" width="52" height="34" rx="17" fill="#2B3A8C" />
            <ellipse cx="68" cy="66" rx="11" ry="8" fill="#2B3A8C" />
          </g>
          <g ref={handRRef} className="pv-p9-hand">
            <rect x="226" y="70" width="52" height="34" rx="17" fill="#2B3A8C" />
            <ellipse cx="232" cy="66" rx="11" ry="8" fill="#2B3A8C" />
          </g>

          {/* Gotas de plata. */}
          {DROPS.map((d, i) => (
            <g
              key={i}
              ref={(el) => { dropRefs.current[i] = el }}
              className="pv-p9-drop"
              opacity="0"
            >
              <circle cx={d.x} cy="118" r="8.5" fill="#F0C14D" />
              <text
                x={d.x}
                y="118"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontWeight="700"
                fill="#101B3B"
              >
                $
              </text>
            </g>
          ))}
        </svg>
      </div>
    </PCard>
  )
}
