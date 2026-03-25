'use client'

function SpreadsheetCrossedOut() {
  return (
    <div className="relative mt-4 w-fit">
      <div
        className="rounded-xl p-3 text-white/40 text-xs font-mono leading-relaxed"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>A1: rendimiento_YTD</div>
        <div>B1: volatilidad_anual</div>
        <div>{'C1: => SUMPRODUCT(...)'}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-brand-green text-4xl font-bold drop-shadow-lg">✓</span>
      </div>
    </div>
  )
}

function PricingMock() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div
        className="rounded-xl p-4"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2">Summa</p>
        <p className="text-brand-green font-bold text-xl">$X/mes</p>
        <p className="text-white/50 text-xs mt-1">Todo incluido</p>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 line-through">Otros</p>
        <p className="text-white/30 text-xs line-through">Comisión entrada</p>
        <p className="text-white/30 text-xs line-through">Fee gestión</p>
        <p className="text-white/30 text-xs line-through">Spread oculto</p>
      </div>
    </div>
  )
}

export function Benefits() {
  return (
    <section id="beneficios" className="px-6 py-32" style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto">

        <h2 className="text-center font-bold text-white text-[28px] lg:text-[40px] mb-12">
          La libertad de que tu plata trabaje para vos.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">

          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px] lg:col-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #1a0a40, #0d1a4e)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Libertad Total</h3>
              <p className="text-white/60 text-sm mt-1">Nosotros gestionamos, vos disfrutás.</p>
              <SpreadsheetCrossedOut />
            </div>
            <p className="text-white/50 text-sm mt-4">Olvidate de las planillas.</p>
          </div>

          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px] lg:col-span-1 lg:row-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a1a)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Inversión sin Mínimos</h3>
              <p className="text-brand-green font-bold leading-none mt-6" style={{ fontSize: 96 }}>$0</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Accedé a fondos de clase mundial sin importar cuánto capital tengas hoy.
            </p>
          </div>

          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px] lg:col-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a3a)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Transparencia Radical</h3>
              <p className="text-white/60 text-sm mt-1">Un solo pago mensual, claro y bajo.</p>
              <PricingMock />
            </div>
            <p className="text-white/50 text-sm mt-4">Sin comisiones ocultas ni estructuras complejas.</p>
          </div>

        </div>
      </div>
    </section>
  )
}
