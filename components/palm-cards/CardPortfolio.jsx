import { useCallback, useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardPortfolio.css'

const BLOBS = [
  { cx: 4, cy: 30, rot: -22 },
  { cx: 96, cy: 42, rot: 34 },
  { cx: 38, cy: 104, rot: 8 },
]

// 3 satellite nodes — triángulo equilátero centrado en el donut.
// Las 3 usan marginLeft -28px (56÷2) para simular translate(-50%, 0)
// horizontalmente — así el transform queda libre para el breathe scale.
const NODES = [
  { top: '4%',  left: '50%', marginLeft: '-28px' }, // A — arriba centro
  { top: '68%', left: '18%', marginLeft: '-28px' }, // B — abajo izquierda
  { top: '68%', left: '82%', marginLeft: '-28px' }, // C — abajo derecha
]

// Bent paths (viewBox 0 0 100 100). Cada path: M start L corner L center.
// Coords sincronizadas con las nuevas posiciones simétricas de las cajas.
const LINES = [
  { d: 'M 50 10 L 58 30 L 50 50', pts: [[50, 10], [58, 30], [50, 50]] }, // A
  { d: 'M 20 72 L 32 58 L 50 50', pts: [[20, 72], [32, 58], [50, 50]] }, // B
  { d: 'M 80 72 L 68 58 L 50 50', pts: [[80, 72], [68, 58], [50, 50]] }, // C
]

const PROFILES = [
  { segments: [40, 25, 20, 15], value: 100 },
  { segments: [55, 20, 15, 10], value:  88 },
  { segments: [30, 30, 25, 15], value:  94 },
  { segments: [20, 20, 30, 30], value:  76 },
]
const SEG_COLORS = ['#7B8BD4', '#F2C44D', '#FBF3DC', '#FFFFFF']
const HOLD_SEC = 1.7
const TRANSITION_SEC = 0.7
const ENTRANCE_PER_ARC = 0.18
const ENTRANCE_DUR = 0.6

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

// Posición t∈[0,1] a lo largo de un path multi-segmento — uniforme por longitud.
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

export default function CardPortfolio({ index = 2 }) {
  const arcRefs = useRef([])
  const balanceRef = useRef(null)
  const donutAuraRef = useRef(null)
  const nodeRefs = useRef([])
  const linesSvgRef = useRef(null)
  const pathRefs = useRef([])
  const pulseRefs = useRef([])
  const breatheAnimsRef = useRef([])
  const pulseAnimsRef = useRef([])
  const donutAuraAnimRef = useRef(null)
  const reduceMotion = useReducedMotion()

  // ── Mount: knock donut a hidden + arrancar aura pulse + box breathe ──
  useEffect(() => {
    if (reduceMotion) return undefined

    // Donut a estado inicial oculto (igual que la versión original).
    arcRefs.current.forEach((arc, i) => {
      if (!arc) return
      const dash = PROFILES[0].segments[i]
      arc.setAttribute('stroke-dashoffset', String(dash))
    })
    if (balanceRef.current) balanceRef.current.textContent = '0%'

    // Donut aura pulse — mount-time, antes de onReveal.
    const aura = donutAuraRef.current
    if (aura) {
      donutAuraAnimRef.current = animate(
        aura,
        { scale: [0.9, 1.15], opacity: [0.6, 1.0] },
        { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
      )
    }

    // Boxes breathe — mount-time, antes de onReveal.
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const a = animate(
        node,
        { scale: [1.0, 1.04, 1.0] },
        {
          duration: 3,
          delay: i * 0.8,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
      )
      breatheAnimsRef.current.push(a)
    })

    return () => {
      donutAuraAnimRef.current?.stop?.()
      donutAuraAnimRef.current = null
      breatheAnimsRef.current.forEach((a) => a?.stop?.())
      breatheAnimsRef.current = []
    }
  }, [reduceMotion])

  const onReveal = useCallback(() => {
    // ── Reduce-motion: estado final estático ──
    if (reduceMotion) {
      nodeRefs.current.forEach((n) => {
        if (!n) return
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
      if (linesSvgRef.current) linesSvgRef.current.style.opacity = '0.7'
      if (donutAuraRef.current) donutAuraRef.current.style.opacity = '0.8'
      return
    }

    const arcs = arcRefs.current.filter(Boolean)
    const balanceTxt = balanceRef.current
    if (!balanceTxt || arcs.length === 0) return

    let cancelled = false
    const anims = []
    const track = (a) => { anims.push(a); return a }

    // Pulse loop por línea — duration 1.4s, infinito, stagger 0.5s entre las 3.
    const startPulse = (i, initialDelay = 0) => {
      const pulse = pulseRefs.current[i]
      if (!pulse) return
      const a = animate(0, 1, {
        duration: 1.4,
        repeat: Infinity,
        ease: 'linear',
        delay: initialDelay,
        onUpdate: (t) => {
          const [x, y] = interpolatePath(LINES[i].pts, t)
          pulse.setAttribute('cx', x.toFixed(2))
          pulse.setAttribute('cy', y.toFixed(2))
        },
      })
      pulseAnimsRef.current[i] = a
    }

    // Flash de las 3 líneas al cerrar cada rebalanceo — opacity 0.7→1→0.7.
    const flashLines = () => {
      pathRefs.current.forEach((path) => {
        if (!path) return
        track(animate(
          path,
          { opacity: [0.7, 1.0, 0.7] },
          { duration: 0.4, ease: 'easeInOut' },
        ))
      })
    }

    ;(async () => {
      try {
        // ── 1. Cajas entran con stagger 0.2s ──
        const nodeEnter = nodeRefs.current.map((node, i) => {
          if (!node) return null
          return track(animate(
            node,
            { scale: [0, 1], opacity: [0, 1] },
            { duration: 0.45, delay: i * 0.2, ease: 'easeOut' },
          ))
        }).filter(Boolean)
        await Promise.all(nodeEnter.map((a) => a.finished))
        if (cancelled) return

        // ── 2. Líneas SVG fade-in a 0.7 ──
        if (linesSvgRef.current) {
          await track(animate(
            linesSvgRef.current,
            { opacity: [0, 0.7] },
            { duration: 0.6, ease: 'easeOut' },
          )).finished
        }
        if (cancelled) return

        // ── 3. Pulsos viajeros arrancan ──
        LINES.forEach((_, i) => startPulse(i, i * 0.5))

        // ── 4. Donut entrance — sequential arc draw + count-up ──
        const arcPromises = arcs.map((arc, idx) =>
          track(animate(
            arc,
            { strokeDashoffset: 0 },
            { duration: ENTRANCE_DUR, delay: idx * ENTRANCE_PER_ARC, ease: [0.16, 1, 0.3, 1] },
          )).finished,
        )
        const totalDuration = (arcs.length - 1) * ENTRANCE_PER_ARC + ENTRANCE_DUR
        const countA = animate(0, 100, {
          duration: totalDuration,
          ease: 'easeOut',
          onUpdate: (v) => { balanceTxt.textContent = Math.round(v) + '%' },
        })
        anims.push(countA)
        await Promise.all([...arcPromises, countA.finished])
        if (cancelled) return

        // ── 5. Rebalance loop (lógica del donut intacta) ──
        const transitionTo = (from, to, duration) =>
          animate(0, 1, {
            duration,
            ease: 'easeInOut',
            onUpdate: (t) => {
              let cumStart = 0
              for (let i = 0; i < arcs.length; i++) {
                const len = from.segments[i] + (to.segments[i] - from.segments[i]) * t
                const gap = 100 - len
                arcs[i].setAttribute('stroke-dasharray', `${len.toFixed(3)} ${gap.toFixed(3)}`)
                arcs[i].setAttribute(
                  'transform',
                  `rotate(${(-90 + cumStart * 3.6).toFixed(3)})`,
                )
                cumStart += len
              }
              const num = from.value + (to.value - from.value) * t
              balanceTxt.textContent = Math.round(num) + '%'
            },
          })

        let currentIdx = 0
        while (!cancelled) {
          await sleep(HOLD_SEC)
          if (cancelled) break
          const nextIdx = (currentIdx + 1) % PROFILES.length
          const trans = transitionTo(PROFILES[currentIdx], PROFILES[nextIdx], TRANSITION_SEC)
          anims.push(trans)
          await trans.finished
          if (cancelled) break
          // Flash líneas al cerrar el rebalanceo
          flashLines()
          currentIdx = nextIdx
        }
      } catch {
        /* silent */
      }
    })()

    return () => {
      cancelled = true
      anims.forEach((a) => a.stop?.())
      pulseAnimsRef.current.forEach((a) => a?.stop?.())
      pulseAnimsRef.current = []
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="portfolio"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Tu portfolio hecho a medida.</>}
    >
      <div className="pv-g3-stage">
        {/* Donut aura — radial pulsante, detrás de todo */}
        <div ref={donutAuraRef} className="pv-g3-aura" aria-hidden="true" />

        {/* Líneas SVG (paths + pulsos viajeros) */}
        <svg
          ref={linesSvgRef}
          className="pv-g3-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {LINES.map((l, i) => (
            <path
              key={'p' + i}
              ref={(el) => { pathRefs.current[i] = el }}
              className="pv-g3-line"
              d={l.d}
            />
          ))}
          {LINES.map((l, i) => (
            <circle
              key={'c' + i}
              ref={(el) => { pulseRefs.current[i] = el }}
              className="pv-g3-pulse"
              cx={l.pts[0][0]}
              cy={l.pts[0][1]}
              r="1.2"
              fill="#F0C14D"
            />
          ))}
        </svg>

        {/* 3 satellite nodes — Magic box yellow + aura */}
        {NODES.map((n, i) => (
          <div
            key={i}
            ref={(el) => { nodeRefs.current[i] = el }}
            className="pv-g3-node"
            style={{ top: n.top, left: n.left, marginLeft: n.marginLeft }}
          >
            <div className="pv-g3-node-aura" aria-hidden="true" />
            <img
              className="pv-g3-node-img"
              src="/Magic%20box%20yellow.svg"
              alt=""
              aria-hidden="true"
            />
          </div>
        ))}

        {/* Donut SVG — centrado 75% del stage */}
        <svg
          className="pv-g3-scene"
          viewBox="0 0 300 220"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g className="pv-g3-donut-pos" transform="translate(150 110)">
            <g className="pv-g3-donut-rot">
              {PROFILES[0].segments.map((seg, i) => {
                const startAngle = -90 + PROFILES[0].segments.slice(0, i).reduce((a, b) => a + b, 0) * 3.6
                return (
                  <circle
                    key={i}
                    ref={(el) => { arcRefs.current[i] = el }}
                    className="pv-g3-arc"
                    r="75"
                    pathLength="100"
                    fill="none"
                    stroke={SEG_COLORS[i]}
                    strokeWidth="28"
                    strokeDasharray={`${seg} ${100 - seg}`}
                    strokeDashoffset="0"
                    transform={`rotate(${startAngle})`}
                  />
                )
              })}
            </g>
            <text
              ref={balanceRef}
              className="pv-g3-balance"
              x="0" y="0"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFFCF5"
              fontSize="42"
              fontWeight="700"
            >
              100%
            </text>
          </g>
        </svg>
      </div>
    </PCard>
  )
}
