import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardPrivacy.css'

// Concepto: el corte. En el modelo "gratis", tus datos viajan por
// cablecitos hacia los compradores (cubos rojos). El escudo se apoya
// sobre el recuadro que protege "tus datos" y el flujo se corta.

const CENTER = { x: 50, y: 66 }
const BUYERS = [
  { label: 'anunciantes',  x: 16, y: 22 },
  { label: 'data brokers', x: 50, y: 14 },
  { label: 'terceros',     x: 84, y: 22 },
]

// Cablecitos doblados (viewBox 100×100), como los de CardPortfolio:
// M centro L codo L comprador.
const LINES = [
  { d: 'M 50 66 L 30 46 L 16 22', pts: [[50, 66], [30, 46], [16, 22]] },
  { d: 'M 50 66 L 56 38 L 50 14', pts: [[50, 66], [56, 38], [50, 14]] },
  { d: 'M 50 66 L 70 46 L 84 22', pts: [[50, 66], [70, 46], [84, 22]] },
]

// Posición t∈[0,1] a lo largo de un path multi-segmento — uniforme por
// longitud (igual que en CardPortfolio).
const interpolatePath = (pts, t) => {
  const lens = []
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0]
    const dy = pts[i][1] - pts[i - 1][1]
    lens.push(Math.hypot(dx, dy))
  }
  const total = lens.reduce((a, b) => a + b, 0) || 1
  const target = t * total
  let acc = 0
  for (let i = 0; i < lens.length; i++) {
    if (acc + lens[i] >= target) {
      const lt = lens[i] === 0 ? 0 : (target - acc) / lens[i]
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * lt,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * lt,
      ]
    }
    acc += lens[i]
  }
  return pts[pts.length - 1]
}

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

// Sin blobs (founder): el fondo queda navy limpio para que los cables lean.

// Cubo de Palm (Magic box) en rojo plano — mismo trazado, otro color.
function CuboRojo() {
  return (
    <svg className="pv-p6-cubo" viewBox="0 0 368 415" fill="none" aria-hidden="true">
      <path
        d="M352.38 308.719L183.675 406.061V233.315C183.675 214.839 173.816 197.768 157.813 188.534L28.5888 113.972C19.5143 108.736 19.5144 95.639 28.5888 90.403L167.964 9.98413C172.172 7.55616 177.355 7.55616 181.563 9.98414L352.38 108.545C356.591 110.975 359.185 115.467 359.185 120.329V296.934C359.185 301.796 356.591 306.289 352.38 308.719Z"
        fill="#FF6B6B"
      />
      <path
        d="M183.675 406.061L352.38 308.719C356.591 306.289 359.185 301.796 359.185 296.934V120.329C359.185 115.467 356.591 110.975 352.38 108.545L181.563 9.98414C177.355 7.55616 172.172 7.55616 167.964 9.98413L28.5888 90.403C19.5144 95.639 19.5143 108.736 28.5888 113.972L157.813 188.534C173.816 197.768 183.675 214.839 183.675 233.315V406.061ZM183.675 406.061L8.16504 304.792"
        stroke="#FF6B6B"
        strokeWidth="16.3265"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CardPrivacy({ index = 1 }) {
  const lineRefs = useRef([])
  const dotRefs = useRef([])   // [línea][0|1] — dos pulsos por cable
  const buyerRefs = useRef([])
  const escudoRef = useRef(null)
  const haloRef = useRef(null)
  const ringRef = useRef(null)
  const tagRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final — flujo cortado, escudo de guardia ──
    if (reduceMotion) {
      lineRefs.current.forEach((l) => l && (l.style.opacity = '0.35'))
      dotRefs.current.flat().forEach((d) => d && d.setAttribute('opacity', '0'))
      buyerRefs.current.forEach((b) => b && (b.style.opacity = '0.3'))
      if (escudoRef.current) {
        escudoRef.current.style.opacity = '1'
        escudoRef.current.style.transform = 'none'
      }
      if (haloRef.current) haloRef.current.style.opacity = '1'
      if (tagRef.current) tagRef.current.style.opacity = '1'
      return
    }

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }
    const dotAnims = []

    // Opacidad de los cables SIEMPRE por style inline (driver): motion
    // escribe atributos en elementos SVG y el `opacity: 0` del CSS le
    // gana al atributo — los cables quedaban invisibles.
    const fadeLine = (l, from, to, duration, delay = 0) =>
      tr(animate(from, to, {
        duration,
        delay,
        ease: 'easeOut',
        onUpdate: (v) => { l.style.opacity = v.toFixed(3) },
      }))

    // Pulsos que viajan del centro hacia un comprador POR EL CABLE, en loop.
    // Dos por cable, a media vuelta de distancia → flujo continuo y visible.
    const startDotFlow = (i, delay) => {
      const dots = dotRefs.current[i] || []
      dots.forEach((dot, k) => {
        if (!dot) return
        const a = animate(0, 1, {
          duration: 2.0,
          delay: delay + k * 1.0,
          repeat: Infinity,
          ease: 'linear',
          onUpdate: (t) => {
            const [x, y] = interpolatePath(LINES[i].pts, t)
            dot.setAttribute('cx', x.toFixed(2))
            dot.setAttribute('cy', y.toFixed(2))
            const fadeIn = Math.min(1, t * 8)
            const fadeOut = t < 0.85 ? 1 : (1 - t) * 6.67
            dot.setAttribute('opacity', Math.min(fadeIn, fadeOut).toFixed(2))
          },
        })
        dotAnims.push(a)
      })
    }
    const stopDotFlows = () => {
      dotAnims.forEach((a) => a.stop?.())
      dotAnims.length = 0
      dotRefs.current.flat().forEach((d) => d && d.setAttribute('opacity', '0'))
    }

    const resetForLoopStart = () => {
      lineRefs.current.forEach((l) => l && (l.style.opacity = '0'))
      buyerRefs.current.forEach((b) => {
        if (!b) return
        b.style.opacity = '0'
        b.style.transform = ''
      })
      const escudo = escudoRef.current
      if (escudo) { escudo.style.opacity = '0'; escudo.style.transform = '' }
      if (haloRef.current) { haloRef.current.style.opacity = '0'; haloRef.current.style.transform = '' }
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (tagRef.current) tagRef.current.style.opacity = '0'
    }

    // ── Fase 1 — el mundo "gratis": cables y compradores; tus datos viajan ──
    const phase1 = async () => {
      const buyersIn = buyerRefs.current.map((b, i) => {
        if (!b) return null
        return tr(animate(b, { opacity: [0, 0.95] }, { duration: 0.4, delay: i * 0.12, ease: 'easeOut' }))
      }).filter(Boolean)
      lineRefs.current.forEach((l, i) => {
        if (!l) return
        fadeLine(l, 0, 0.95, 0.6, i * 0.12)
      })
      await Promise.all(buyersIn.map((a) => a.finished))
      if (cancelled) return

      BUYERS.forEach((_, i) => startDotFlow(i, i * 0.5))
      await sleep(3.2)
      if (cancelled) return
    }

    // ── Fase 2 — el corte: recuadro + escudo sobre la línea; el flujo se apaga ──
    const phase2 = async () => {
      const escudo = escudoRef.current
      const halo = haloRef.current
      const ring = ringRef.current
      // El recuadro se cierra alrededor de "tus datos" y SE QUEDA.
      if (halo) {
        await tr(animate(
          halo,
          { opacity: [0, 1], scale: [1.25, 1] },
          { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        )).finished
      }
      if (cancelled) return
      // El escudo se apoya sobre la línea superior del recuadro.
      if (escudo) {
        await tr(animate(
          escudo,
          { opacity: [0, 1], y: [-22, 0], scale: [0.7, 1] },
          { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        )).finished
      }
      if (cancelled) return
      if (ring) {
        ring.style.opacity = '1'
        tr(animate(ring, { scale: [1, 1.25], opacity: [0.8, 0] }, { duration: 0.6, ease: 'easeOut' }))
      }
      stopDotFlows()
      lineRefs.current.forEach((l, i) => {
        if (!l) return
        fadeLine(l, 0.95, 0.35, 0.5, i * 0.08)
      })
      buyerRefs.current.forEach((b) => {
        if (!b) return
        tr(animate(b, { opacity: [0.95, 0.3] }, { duration: 0.5, ease: 'easeOut' }))
      })
      if (tagRef.current) {
        tr(animate(tagRef.current, { opacity: [0, 1] }, { duration: 0.4, delay: 0.3, ease: 'easeOut' }))
      }
      await sleep(2.8)
    }

    // ── Fase 3 — salida silenciosa ──
    const phase3 = async () => {
      const outs = []
      if (escudoRef.current) outs.push(tr(animate(escudoRef.current, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      if (haloRef.current) outs.push(tr(animate(haloRef.current, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      if (tagRef.current) outs.push(tr(animate(tagRef.current, { opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      buyerRefs.current.forEach((b) => {
        if (!b) return
        outs.push(tr(animate(b, { opacity: [0.3, 0] }, { duration: 0.35, ease: 'easeIn' })).finished)
      })
      lineRefs.current.forEach((l) => {
        if (!l) return
        outs.push(fadeLine(l, 0.35, 0, 0.35).finished)
      })
      await Promise.all(outs.map((p) => p.catch(() => {})))
    }

    ;(async () => {
      try {
        while (!cancelled) {
          resetForLoopStart()
          await sleep(0.05)
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
      dotAnims.forEach((a) => a.stop?.())
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="privacy2"
      index={index}
      onReveal={onReveal}
      headline={<>Si es gratis, alguien lo paga.</>}
    >
      <div className="pv-p6-stage">
        <svg className="pv-p6-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {LINES.map((l, i) => (
            <path
              key={'l' + i}
              ref={(el) => { lineRefs.current[i] = el }}
              className="pv-p6-line"
              d={l.d}
            />
          ))}
          {LINES.map((l, i) =>
            [0, 1].map((k) => (
              <circle
                key={`d${i}-${k}`}
                ref={(el) => {
                  if (!dotRefs.current[i]) dotRefs.current[i] = []
                  dotRefs.current[i][k] = el
                }}
                className="pv-p6-dot"
                cx={l.pts[0][0]} cy={l.pts[0][1]} r="1.9"
                opacity="0"
              />
            )),
          )}
        </svg>

        {BUYERS.map((b, i) => (
          <div
            key={b.label}
            ref={(el) => { buyerRefs.current[i] = el }}
            className="pv-p6-buyer"
            style={{ left: b.x + '%', top: b.y + '%' }}
            aria-hidden="true"
          >
            <CuboRojo />
            <span className="pv-p6-buyer-label">{b.label}</span>
          </div>
        ))}

        <div className="pv-p6-data" aria-hidden="true">tus datos</div>

        <div ref={haloRef} className="pv-p6-halo" aria-hidden="true" />
        <div ref={ringRef} className="pv-p6-ring" aria-hidden="true" />
        <img
          ref={escudoRef}
          className="pv-p6-escudo"
          src="/Card%20Privacy/escudo.svg"
          alt=""
          aria-hidden="true"
        />

        <div ref={tagRef} className="pv-p6-tag" aria-hidden="true">
          acá no se venden
        </div>
      </div>
    </PCard>
  )
}
