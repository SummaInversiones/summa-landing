import { useCallback, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import PCard from '../PCard.jsx'
import './CardCCV2.css'

// Concepto: la claridad emerge del ruido. Un resaltador dorado recorre el
// resumen ilegible ($$$); donde se detiene, la línea se vuelve legible:
// el insight concreto que Palm identifica para vos.

const NOISE = [
  'tus números $$$$$$$$$$ tus números $$$$',
  '$$$$ tus números $$$$$$$ tus números $$',
  'números $$$$$$$ tus números $$$$$$$$$$',
  'tus números $$$$$$$$ ros $$$$ tus núme',
  '$$$ tus números $$$$$ tus números $$$$',
  'ros $$$$ tus números $$$ tus números $',
  'tus números $$$$$$$$ tus números $$$$$',
]

// Hallazgos que rota el loop: línea destino + texto claro.
const FINDS = [
  { line: 2, text: 'acá podés ahorrar $32.000' },
  { line: 4, text: 'este gasto se repite cada mes' },
  { line: 1, text: 'esto te conviene invertirlo' },
]

const LINE_H = 22 // px — sincronizado con .pv-p2-line en CSS

const BLOBS = [
  { cx: 6, cy: 38, rot: -28 },
  { cx: 98, cy: 58, rot: 42 },
]

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000))

export default function CardCCV2({ index = 1 }) {
  const hlRef = useRef(null)
  const lineRefs = useRef([])
  const findRef = useRef(null)
  const findTextRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const onReveal = useCallback(() => {
    const hl = hlRef.current
    const find = findRef.current
    const findText = findTextRef.current

    // ── Reduce-motion: highlight quieto sobre el primer hallazgo, ya legible ──
    if (reduceMotion) {
      const f = FINDS[0]
      if (hl) {
        hl.style.opacity = '1'
        hl.style.transform = `translateY(${f.line * LINE_H}px)`
      }
      if (find && findText) {
        findText.textContent = f.text
        find.style.opacity = '1'
        find.style.top = `${18 + f.line * LINE_H}px`
      }
      const noisy = lineRefs.current[f.line]
      if (noisy) noisy.style.opacity = '0.15'
      return
    }
    if (!hl || !find || !findText) return

    let cancelled = false
    const anims = []
    const tr = (a) => { anims.push(a); return a }

    // Barre desde una línea a otra pasando por las intermedias.
    const scanTo = async (fromLine, toLine) => {
      const steps = []
      const dir = toLine > fromLine ? 1 : -1
      for (let l = fromLine; l !== toLine + dir; l += dir) steps.push(l * LINE_H)
      if (steps.length < 2) steps.push(toLine * LINE_H)
      await tr(animate(
        hl,
        { y: steps },
        { duration: steps.length * 0.28, ease: 'easeInOut' },
      )).finished
    }

    ;(async () => {
      try {
        // Entrance: el resaltador aparece en la línea 0.
        hl.style.transform = 'translateY(0px)'
        await tr(animate(hl, { opacity: [0, 1] }, { duration: 0.4, ease: 'easeOut' })).finished
        if (cancelled) return

        let current = 0
        let fi = 0
        while (!cancelled) {
          const f = FINDS[fi]
          await scanTo(current, f.line)
          if (cancelled) break
          current = f.line

          // Lock: pulso del resaltador + la línea ruidosa cede al texto claro.
          tr(animate(hl, { scaleX: [1, 1.03, 1] }, { duration: 0.35, ease: 'easeOut' }))
          const noisy = lineRefs.current[f.line]
          findText.textContent = f.text
          // Posicionar por `top` (no transform): motion anima scale en este
          // mismo elemento y reconstruiría el transform.
          find.style.top = `${18 + f.line * LINE_H}px`
          if (noisy) tr(animate(noisy, { opacity: [0.55, 0.12] }, { duration: 0.3, ease: 'easeOut' }))
          await tr(animate(
            find,
            { opacity: [0, 1], scale: [0.96, 1] },
            { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          )).finished
          if (cancelled) break

          await sleep(2.1)
          if (cancelled) break

          // El hallazgo vuelve al ruido; el barrido sigue.
          tr(animate(find, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeIn' }))
          if (noisy) tr(animate(noisy, { opacity: [0.12, 0.55] }, { duration: 0.4, ease: 'easeOut' }))
          await sleep(0.35)
          fi = (fi + 1) % FINDS.length
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
      variant="cc2"
      index={index}
      blobs={BLOBS}
      onReveal={onReveal}
      headline={<>Cuentas claras, problemas claros. Identificamos que es lo mejor para vos.</>}
    >
      <div className="pv-p2-stage">
        <div className="pv-p2-doc" aria-hidden="true">
          <div ref={hlRef} className="pv-p2-hl" />
          {NOISE.map((l, i) => (
            <span
              key={i}
              ref={(el) => { lineRefs.current[i] = el }}
              className="pv-p2-line"
            >
              {l}
            </span>
          ))}
          <div ref={findRef} className="pv-p2-find">
            <span ref={findTextRef} className="pv-p2-find-text" />
          </div>
        </div>
      </div>
    </PCard>
  )
}
