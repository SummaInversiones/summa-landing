import { useCallback, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardPortfolioV2.css'

// Concepto: el sastre. Tu perfil mueve los controles (riesgo, plazo,
// liquidez) y la mezcla del portafolio se re-proporciona EN RESPUESTA.
// Causa → efecto: eso es "a medida", no una torta genérica.

const SLIDERS = ['riesgo', 'plazo', 'liquidez']
const SEG_COLORS = ['#7B8BD4', '#F2C44D', '#FBF3DC', '#FFFFFF']

// Por perfil: posición de cada knob (%) + proporción de los 4 segmentos.
const PROFILES = [
  { name: 'conservador', knobs: [18, 72, 85], segs: [55, 15, 20, 10] },
  { name: 'moderado',    knobs: [50, 50, 55], segs: [35, 30, 20, 15] },
  { name: 'audaz',       knobs: [85, 30, 25], segs: [15, 55, 20, 10] },
]

const BLOBS = [
  { cx: 4,  cy: 32, rot: -22 },
  { cx: 96, cy: 88, rot: 34 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardPortfolioV2({ index = 3 }) {
  const [profileName, setProfileName] = useState(PROFILES[0].name)
  const chipRef = useRef(null)
  const knobRefs = useRef([])
  const segRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const applyProfile = (p) => {
    p.knobs.forEach((k, i) => {
      const knob = knobRefs.current[i]
      if (knob) knob.style.left = k + '%'
    })
    p.segs.forEach((s, i) => {
      const seg = segRefs.current[i]
      if (seg) seg.style.width = s + '%'
    })
  }

  const onReveal = useCallback(() => {
    // ── Reduce-motion: perfil moderado, estático ──
    if (reduceMotion) {
      setProfileName(PROFILES[1].name)
      applyProfile(PROFILES[1])
      return
    }

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    // Un solo driver interpola knobs + segmentos juntos: la mezcla responde
    // al perfil en el mismo gesto.
    const morphTo = (from, to) =>
      tr(animate(0, 1, {
        duration: 0.9,
        ease: 'easeInOut',
        onUpdate: (t) => {
          from.knobs.forEach((k, i) => {
            const knob = knobRefs.current[i]
            if (knob) knob.style.left = (k + (to.knobs[i] - k) * t).toFixed(2) + '%'
          })
          from.segs.forEach((s, i) => {
            const seg = segRefs.current[i]
            if (seg) seg.style.width = (s + (to.segs[i] - s) * t).toFixed(2) + '%'
          })
        },
      })).finished

    const swapChip = async (name) => {
      const chip = chipRef.current
      if (chip) {
        try {
          await tr(animate(chip, { opacity: [1, 0] }, { duration: 0.2, ease: 'easeOut' })).finished
        } catch { return }
      }
      setProfileName(name)
      await sleep(0.03)
      if (chip) tr(animate(chip, { opacity: [0, 1] }, { duration: 0.25, ease: 'easeIn' }))
    }

    ;(async () => {
      try {
        applyProfile(PROFILES[0])
        let cur = 0
        while (!cancelled) {
          await sleep(2.0)
          if (cancelled) break
          const next = (cur + 1) % PROFILES.length
          // El chip anuncia el perfil; los controles y la mezcla responden.
          await swapChip(PROFILES[next].name)
          if (cancelled) break
          await morphTo(PROFILES[cur], PROFILES[next])
          cur = next
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
      variant="portfolio2"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Tu portfolio hecho a medida.</>}
    >
      <div className="pv-p4-stage">
        <div ref={chipRef} className="pv-p4-profile" aria-hidden="true">
          <span className="pv-p4-profile-label">perfil</span>
          <span className="pv-p4-profile-name">{profileName}</span>
        </div>

        <div className="pv-p4-sliders" aria-hidden="true">
          {SLIDERS.map((s, i) => (
            <div key={s} className="pv-p4-slider">
              <span className="pv-p4-slider-label">{s}</span>
              <div className="pv-p4-slider-track">
                <span
                  ref={(el) => { knobRefs.current[i] = el }}
                  className="pv-p4-knob"
                  style={{ left: PROFILES[0].knobs[i] + '%' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pv-p4-mix" aria-hidden="true">
          <span className="pv-p4-mix-label">tu portafolio</span>
          <div className="pv-p4-mix-bar">
            {SEG_COLORS.map((c, i) => (
              <div
                key={i}
                ref={(el) => { segRefs.current[i] = el }}
                className="pv-p4-seg"
                style={{ background: c, width: PROFILES[0].segs[i] + '%' }}
              />
            ))}
          </div>
        </div>
      </div>
    </PCard>
  )
}
