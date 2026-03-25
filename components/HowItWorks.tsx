'use client'

function RiskProfileMock() {
  return (
    <div className="flex gap-2 mt-4">
      {['Conservador', 'Moderado', 'Agresivo'].map((label) => (
        <span
          key={label}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            label === 'Moderado'
              ? 'bg-brand-green text-brand-dark'
              : 'bg-white/10 text-white/60 border border-white/15'
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

function ChartMock() {
  const points = '10,50 30,40 50,45 70,25 90,30 110,15 130,20'
  return (
    <div
      className="mt-4 rounded-2xl p-3"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2">Rendimiento global</p>
      <svg viewBox="0 0 140 60" className="w-full h-10" fill="none" aria-hidden="true">
        <polyline points={points} stroke="#90e24d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ToastsMock() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {['Mercado ajustado ✓', 'Portafolio rebalanceado ✓'].map((msg) => (
        <div
          key={msg}
          className="px-4 py-2 rounded-xl text-sm text-white font-medium"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {msg}
        </div>
      ))}
    </div>
  )
}

const cards = [
  {
    n: '01',
    title: 'Definimos tu situación',
    label: 'Tu perfil de riesgo y metas en 5 minutos.',
    gradient: 'linear-gradient(135deg, #1a1040, #0d2b4e)',
    Mock: RiskProfileMock,
  },
  {
    n: '02',
    title: 'Optimización Global',
    label: 'Fondos internacionales con historial probado.',
    gradient: 'linear-gradient(135deg, #0d2b1a, #0a2a2a)',
    Mock: ChartMock,
  },
  {
    n: '03',
    title: 'Piloto Automático',
    label: 'Vos solo mirás cómo crece desde la App.',
    gradient: 'linear-gradient(135deg, #3d1a06, #3d0620)',
    Mock: ToastsMock,
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-6 py-32" style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <span className="bg-white/10 text-white/60 border border-white/15 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            El proceso
          </span>
          <h2 className="mt-4 font-bold text-white text-[28px] lg:text-[40px]">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ n, title, label, gradient, Mock }) => (
            <div
              key={n}
              className="reveal relative rounded-[28px] min-h-[380px] p-8 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-default"
              style={{ background: gradient }}
            >
              <span
                className="absolute bottom-4 right-4 font-bold leading-none select-none text-white/5"
                style={{ fontSize: 120 }}
              >
                {n}
              </span>

              <div className="relative z-10">
                <p className="text-brand-green font-bold text-sm mb-2">{n}</p>
                <h3 className="text-white font-bold text-xl leading-tight">{title}</h3>
                <Mock />
              </div>

              <p className="relative z-10 text-white/60 text-sm leading-relaxed mt-4">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
