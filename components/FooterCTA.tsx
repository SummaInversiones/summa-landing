'use client'

import { WaitlistForm } from './WaitlistForm'

export function FooterCTA() {
  return (
    <section className="px-6 py-24" style={{ background: '#111111' }}>
      <div className="max-w-[800px] mx-auto">

        <div
          className="relative rounded-[32px] px-8 sm:px-12 py-16 overflow-hidden flex flex-col items-center text-center gap-8"
          style={{
            background: '#1a1a1a',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(144,226,77,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,100,150,0.1), transparent 50%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="font-bold text-white text-[28px] lg:text-[40px] leading-tight max-w-[600px]">
              Abrile la puerta a tu futuro, el de tus hijos y el de tus nietos.
            </h2>
            <p className="text-white/50 text-lg max-w-[480px]">
              No te quedes afuera. Sumate a la lista de espera y obtené beneficios únicos por 6 meses.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-white/40 font-bold text-base">SUMMA</span>

          <div className="flex gap-6">
            {[
              { label: 'Términos', href: '#' },
              { label: 'Privacidad', href: '#' },
              { label: 'Contacto', href: 'mailto:hola@summa.app' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/40 text-sm hover:text-white/70 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <span className="text-white/30 text-sm">
            © {new Date().getFullYear()} Summa
          </span>
        </div>

      </div>
    </section>
  )
}
