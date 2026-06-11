import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardZero.css'

const PILLS = [
  { rot: -7, text: 'comisión de mantenimiento' },
  { rot: 5, text: 'costo de custodia' },
  { rot: -3, text: 'cargo oculto' },
]

// Random punto fuera del stage, sobre 1 de los 4 bordes.
const pickEdge = () => {
  const side = Math.floor(Math.random() * 4)
  const along = 18 + Math.random() * 64
  switch (side) {
    case 0:  return { x: along, y: -12 }
    case 1:  return { x: 112,   y: along }
    case 2:  return { x: along, y: 112 }
    default: return { x: -12,   y: along }
  }
}
// Punto end cerca pero NO sobre el 0%.
const pickEnd = () => ({
  x: 48 + Math.random() * 4,
  y: 48 + Math.random() * 4,
})
// Control point bezier — mid + offset perpendicular a la cuerda.
const pickControl = (start, end) => {
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.hypot(dx, dy) || 1
  const perpX = -dy / len
  const perpY = dx / len
  const offset = (Math.random() - 0.5) * 30
  return { x: midX + perpX * offset, y: midY + perpY * offset }
}

export default function CardZero({ index = 3 }) {
  const zeroRef = useRef(null)
  const wrapRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const zero = zeroRef.current
    const wraps = wrapRefs.current.filter(Boolean)

    if (reduceMotion) {
      if (zero) {
        zero.style.opacity = '1'
        zero.style.transform = 'scale(1)'
      }
      return
    }
    if (!zero || wraps.length === 0) return

    let cancelled = false
    const anims = []
    const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

    const cycle = async (wrap, bob, pill) => {
      const start = pickEdge()
      const end = pickEnd()
      const control = pickControl(start, end)
      const duration = 3 + Math.random() * 1.5

      const bobAnim = animate(
        bob,
        { y: [0, -3, 2, 0] },
        { duration: 1.5 + Math.random() * 0.7, repeat: Infinity, ease: 'easeInOut' },
      )
      anims.push(bobAnim)

      try {
        const driver = animate(0, 1, {
          duration,
          ease: 'linear',
          onUpdate: (t) => {
            const it = 1 - t
            const x = it * it * start.x + 2 * it * t * control.x + t * t * end.x
            const y = it * it * start.y + 2 * it * t * control.y + t * t * end.y
            wrap.style.left = x.toFixed(2) + '%'
            wrap.style.top = y.toFixed(2) + '%'

            let op
            if (t < 0.15) op = t / 0.15
            else if (t < 0.6) op = 1
            else op = (1 - t) / 0.4
            pill.style.opacity = op.toFixed(3)

            const dt = Math.max(0, (t - 0.6) / 0.4)
            const scale = 1 - dt * 0.18
            const blur = dt * 5
            pill.style.transform = `scale(${scale.toFixed(3)})`
            pill.style.filter = `blur(${blur.toFixed(2)}px)`
          },
        })
        anims.push(driver)
        await driver.finished
      } finally {
        bobAnim.stop?.()
        bob.style.transform = ''
      }
    }

    const pillLoop = async (wrap, initialDelay) => {
      const bob = wrap.querySelector('.pv-g4-pill-bob')
      const pill = wrap.querySelector('.pv-g4-pill')
      await sleep(initialDelay)
      try {
        while (!cancelled) {
          await cycle(wrap, bob, pill)
          if (cancelled) break
          await sleep(Math.random() * 0.4)
        }
      } catch {
        /* aborted — silencioso */
      }
    }

    ;(async () => {
      // Pop el 0% una vez y queda quieto.
      const zeroAnim = animate(
        zero,
        { opacity: [0, 1], scale: [0.7, 1] },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      )
      anims.push(zeroAnim)
      try { await zeroAnim.finished } catch { return }
      if (cancelled) return

      // 3 loops independientes, stagger inicial 0 / 1.4 / 2.8s.
      wraps.forEach((wrap, idx) => {
        pillLoop(wrap, idx * 1.4)
      })
    })()

    return () => {
      cancelled = true
      anims.forEach((a) => a.stop?.())
    }
  }, [reduceMotion])

  return (
    <PCard
      variant="zero"
      index={index}
      onReveal={onReveal}
      headline={<>Las comisiones escondidas acá no existen.</>}
    >
      <div className="pv-g4-stage">
        <div className="pv-g4-zero" ref={zeroRef}>0%</div>
        {PILLS.map((p, i) => (
          <div
            key={i}
            ref={(el) => { wrapRefs.current[i] = el }}
            className="pv-g4-pill-wrap"
          >
            <div className="pv-g4-pill-bob">
              <div className="pv-g4-pill" style={{ '--rot': `${p.rot}deg` }}>
                {p.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PCard>
  )
}
