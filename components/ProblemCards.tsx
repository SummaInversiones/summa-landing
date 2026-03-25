import { TrendingUp, Banknote, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Card {
  Icon: LucideIcon
  heading: string
  body: string
}

const cards: Card[] = [
  {
    Icon: TrendingUp,
    heading: 'No sé por dónde empezar',
    body: 'Summa te guía paso a paso, sin tecnicismos.',
  },
  {
    Icon: Banknote,
    heading: 'Tengo poco para invertir',
    body: 'Empezás con lo que tenés. Sin mínimos.',
  },
  {
    Icon: Shield,
    heading: 'Le tengo miedo al riesgo',
    body: 'Vos elegís tu perfil. Nosotros cuidamos tu plata.',
  },
]

export function ProblemCards() {
  return (
    <section className="bg-brand-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
                [&>*:last-child]:sm:col-span-2 [&>*:last-child]:lg:col-span-1
                [&>*:last-child]:sm:max-w-[50%] [&>*:last-child]:sm:mx-auto
                [&>*:last-child]:lg:max-w-none [&>*:last-child]:lg:mx-0">
          {cards.map(({ Icon, heading, body }) => (
            <div
              key={heading}
              className="reveal bg-white rounded-2xl p-7 border border-black/[0.08] shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
                style={{ background: 'rgba(144,226,77,0.1)' }}
              >
                <Icon size={24} color="var(--brand-green)" />
              </div>
              <h3 className="font-semibold text-brand-dark text-lg mb-2">{heading}</h3>
              <p className="text-muted-fg text-[15px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
