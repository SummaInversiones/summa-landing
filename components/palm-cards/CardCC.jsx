import { useCallback, useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from './PCard.jsx'
import './CardCC.css'

const DOC_LINES = [
  'tus números $$$$$$$$$$ tus números $$$$$$$$',
  'ros $$$$ tus números $$$$$$$ tus números $$$',
  'tus números $$$$$$$$ tus números $$$$$$$$$$',
  '$$$$$$$$ tus números $$$$$$ tus números $$$$',
  'números $$$$$$$ tus números $$$$$$$$$$ tus n',
  'tus números $$$$$$$$ ros $$$$ tus números $$',
  '$$$ tus números $$$$$ tus números $$$$$$$$$$',
  'ros $$$$ tus números $$$ tus números $$$$$$$',
  'tus números $$$$$$$$ tus números $$$$$$ tu n',
  '$$$$$$ tus números $$$$$$$$ tus números $$$$',
  'tus números $$$$$$$ ros $$$ tus números $$$$',
  '$$ tus números $$$$$$$$$$ tus números $$$$$$',
]

const BLOBS = [
  { cx: 6, cy: 38, rot: -28 },
  { cx: 98, cy: 58, rot: 42 },
  { cx: 40, cy: 97, rot: 14 },
]

export default function CardCC({ index = 0 }) {
  const frameRef = useRef(null)
  const canvasRef = useRef(null)
  const lupaRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    if (reduceMotion) return
    const frame = frameRef.current
    const canvas = canvasRef.current
    const lupa = lupaRef.current
    if (!frame || !canvas) return

    const anims = []

    anims.push(
      animate(
        frame,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      ),
    )

    if (lupa) {
      anims.push(
        animate(
          lupa,
          { opacity: [0, 1], x: [28, 0], y: [28, 0] },
          { duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
        ),
      )
    }

    // Scan loop — animate CSS vars on canvas; mask + lupa leen estos mismos vars.
    // Start === end → seam invisible.
    anims.push(
      animate(
        canvas,
        {
          '--scan-x': ['60%', '26%', '60%', '76%', '60%'],
          '--scan-y': ['52%', '42%', '58%', '46%', '52%'],
        },
        {
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.9,
        },
      ),
    )

    if (lupa) {
      anims.push(
        animate(
          lupa,
          { scale: [1, 1.018, 1] },
          { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
        ),
      )
    }

    return () => anims.forEach((a) => a.stop?.())
  }, [reduceMotion])

  // Cleanup en unmount
  useEffect(() => () => {}, [])

  return (
    <PCard
      variant="cc"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Cuentas claras, problemas claros. Identificamos que es lo mejor para vos.</>}
    >
      <div className="pv-cc-frame" ref={frameRef} style={{ opacity: reduceMotion ? 1 : 0 }}>
        <div className="pv-cc-coins" aria-hidden="true">
          <img className="pv-cc-spark" src="/Card%201/Estrellas%20card.png" alt="" />
          <img className="pv-cc-coin" src="/Card%201/Decorative%20circles%20card.png" alt="" />
          <img className="pv-cc-coin" src="/Card%201/Decorative%20circles%20card.png" alt="" />
          <img className="pv-cc-coin" src="/Card%201/Decorative%20circles%20card.png" alt="" />
          <img className="pv-cc-coin" src="/Card%201/Decorative%20circles%20card.png" alt="" />
        </div>
        <div className="pv-cc-canvas" ref={canvasRef}>
          <div className="pv-cc-doc" aria-hidden="true">
            {DOC_LINES.map((l, i) => (
              <span key={i} className="pv-cc-doc__line">{l}</span>
            ))}
          </div>
          <div className="pv-cc-doc-mag" aria-hidden="true">
            {DOC_LINES.map((l, i) => (
              <span key={i} className="pv-cc-doc-mag__line">{l}</span>
            ))}
          </div>
          <img
            ref={lupaRef}
            className="pv-cc-lupa"
            src="/Card%201/Lupa%20pelada.png"
            alt=""
            aria-hidden="true"
            style={{ opacity: reduceMotion ? 1 : 0 }}
          />
        </div>
      </div>
    </PCard>
  )
}
