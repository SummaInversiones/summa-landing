'use client'

import { WaitlistForm } from './WaitlistForm'

function Sparkline() {
  const points = '20,60 50,45 80,50 110,30 140,35 170,15 200,20'
  return (
    <svg viewBox="0 0 220 75" className="w-full h-16" fill="none" aria-hidden="true">
      <polyline points={points} stroke="#90e24d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Sentinel for Nav scroll detection — must be at bottom of section */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 w-full h-px" />

      {/* Mesh gradient background blob */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(255,100,150,0.18), transparent 55%), radial-gradient(ellipse at 85% 70%, rgba(144,226,77,0.12), transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(255,160,80,0.1), transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left column — copy */}
        <div className="flex flex-col items-start gap-6">
          <span className="bg-brand-green/15 text-brand-green border border-brand-green/30 text-xs font-medium px-3 py-1 rounded-full">
            IA para inversiones
          </span>

          <h1 className="font-bold leading-[1.1] text-[44px] sm:text-[60px] lg:text-[72px] text-white">
            Invertir debería ser para la gente, arrancá ahora por lo mismo que pagás Netflix.
          </h1>

          <p className="text-lg text-white/60 max-w-[480px] leading-relaxed">
            Summa es tu asesor financiero que realmente es tuyo. Con IA que logra manejar tus inversiones de forma inteligente, segura y adaptada a tus necesidades. Sin complicaciones, sin letra chica.
          </p>

          <button
            type="button"
            onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-green text-brand-dark font-bold text-base px-8 py-4 rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150"
          >
            Quiero mi asesor →
          </button>

          <p className="text-white/40 text-sm">
            +847 personas ya están en la lista de espera
          </p>

          <WaitlistForm id="waitlist-form" variant="dark" />
        </div>

        {/* Right column — glassmorphic visual */}
        <div className="relative flex justify-center items-center min-h-[400px]">

          {/* Main portfolio card */}
          <div
            className="animate-float rounded-3xl p-6 w-[300px] flex flex-col gap-4"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Portafolio Total</p>
              <p className="text-white font-bold text-[32px] leading-none">$12,450.00</p>
            </div>
            <span className="self-start bg-brand-green/20 text-brand-green text-xs font-semibold px-3 py-1 rounded-full">
              +18.4% este año
            </span>
            <Sparkline />
          </div>

          {/* Floating notification card */}
          <div
            className="animate-float-b absolute top-8 right-0 rounded-2xl px-4 py-3 flex items-center gap-2"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="text-brand-green text-sm font-bold">✓</span>
            <span className="text-white text-sm font-medium">Portafolio optimizado</span>
          </div>
        </div>
      </div>
    </section>
  )
}
