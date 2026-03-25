const steps = [
  {
    n: '01',
    title: 'Contás tu situación',
    body: 'Ingresos, ahorros y objetivos en minutos.',
  },
  {
    n: '02',
    title: 'Summa arma tu plan',
    body: 'Un portafolio personalizado según tu perfil.',
  },
  {
    n: '03',
    title: 'Empezás a invertir',
    body: 'Con claridad y sin sorpresas.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-brand-white py-24 px-6 border-t border-muted">
      <div className="max-w-5xl mx-auto">
        <h2 className="reveal text-center font-medium text-brand-dark mb-16 text-[28px] lg:text-[40px]">
          Cómo funciona
        </h2>

        <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="hidden lg:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] border-t-2 border-dashed border-muted z-0" />

          {steps.map(({ n, title, body }) => (
            <div key={n} className="reveal relative z-10 flex-1 flex flex-col items-center text-center px-6">
              <span
                className="font-bold text-brand-green mb-4 leading-none select-none"
                style={{ fontSize: 64 }}
              >
                {n}
              </span>
              <h3 className="font-semibold text-brand-dark text-lg mb-2">{title}</h3>
              <p className="text-muted-fg text-[15px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
