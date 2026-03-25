'use client'

import { useState } from 'react'

const items = [
  {
    q: '¿Necesito saber de finanzas?',
    a: 'No, Summa está diseñada para que no tengas que ser un experto. Te guiamos en cada paso con un lenguaje claro y simple.',
  },
  {
    q: '¿Puedo retirar mi dinero?',
    a: 'Sí, tus inversiones tienen liquidez para que dispongas de tu plata cuando la necesites.',
  },
  {
    q: '¿Es seguro?',
    a: 'Absolutamente. Tus datos están encriptados y tus fondos regulados por la Comisión Nacional de Valores.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Un solo pago mensual, sin costos ocultos ni estructuras complejas. El precio es claro desde el principio.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-[680px] mx-auto">

        <h2 className="text-center font-bold text-brand-dark text-[28px] lg:text-[36px] mb-12">
          Preguntas Frecuentes.
        </h2>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={item.q}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-semibold text-brand-dark pr-4">{item.q}</span>
                <span className="text-brand-green text-xl font-bold flex-shrink-0 leading-none">
                  {open === i ? '−' : '+'}
                </span>
              </button>

              <div
                id={`faq-answer-${i}`}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '500px' : '0px' }}
              >
                <p className="px-6 pb-5 text-muted-fg text-[15px] leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
