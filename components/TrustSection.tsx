'use client'

import { Shield, Lock, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const cards: { Icon: LucideIcon; heading: string; body: string }[] = [
  {
    Icon: Shield,
    heading: 'Regulados por la CNV',
    body: 'Operamos bajo estándares oficiales para que tu capital esté siempre protegido.',
  },
  {
    Icon: Lock,
    heading: 'Custodia Segura',
    body: 'Tus activos se mantienen en cuentas segregadas bajo las normativas vigentes junto a nuestro partner Allaria.',
  },
  {
    Icon: Sparkles,
    heading: 'IA + Expertise Humano',
    body: 'No es solo un algoritmo; es tecnología de punta supervisada por expertos en finanzas locales, porque sabemos que trabajamos en un mundo humano.',
  },
]

export function TrustSection() {
  return (
    <section className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="font-bold text-brand-dark text-[28px] lg:text-[36px]">
            Tu capital, siempre protegido.
          </h2>
          <p className="text-muted-fg text-lg mt-4 max-w-[560px] mx-auto">
            Operamos bajo los más altos estándares regulatorios del mercado argentino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ Icon, heading, body }) => (
            <div
              key={heading}
              className="reveal bg-white rounded-2xl p-8 border shadow-sm"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <Icon size={22} color="var(--color-brand-green, #90e24d)" />
              </div>
              <h3 className="font-bold text-brand-dark text-lg mb-3">{heading}</h3>
              <p className="text-muted-fg text-[15px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center items-center gap-10 opacity-50">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-brand-dark/60 mb-1">Regulado por</p>
            <p className="font-bold text-brand-dark text-lg">CNV</p>
          </div>
          <div className="w-px h-10 bg-brand-dark/20" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-brand-dark/60 mb-1">Partner</p>
            <p className="font-bold text-brand-dark text-lg">Allaria</p>
          </div>
        </div>

      </div>
    </section>
  )
}
