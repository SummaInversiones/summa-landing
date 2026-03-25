'use client'

export function ProblemSolution() {
  return (
    <section className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-[760px] mx-auto">

        <p className="text-xs font-semibold tracking-widest text-muted-fg uppercase mb-6">
          El Problema
        </p>

        <h2 className="reveal font-bold leading-tight text-brand-dark mb-8 text-[28px] lg:text-[40px]">
          Lamentablemente, lo normal es que uno esté desesperado por saber qué hacer con su dinero.
        </h2>

        <p className="reveal text-[18px] text-brand-dark/70 leading-relaxed mb-12" style={{ transitionDelay: '100ms' }}>
          Sabemos que tenemos que invertir, pero el mundo financiero parece diseñado literalmente para confundirte. ¿Qué nos pasa? terminamos dejando la plata en el banco o saltando a opciones riesgosas por desesperación.
        </p>

        <hr className="w-16 border-t-2 border-brand-green mx-auto my-12" />

        <p className="text-xs font-semibold tracking-widest text-muted-fg uppercase mb-6">
          La Solución
        </p>

        <p className="reveal text-[18px] text-brand-dark leading-relaxed" style={{ transitionDelay: '200ms' }}>
          Ahora los argentinos tienen otra opción: democratizamos el asesoramiento que se guardaba para unos pocos. Usamos Inteligencia Artificial para darte la mejor estrategia, pero adaptada a tu bolsillo y tus objetivos. ¿Por qué? Porque la plata es tuya y elegís vos que hacer con ella.
        </p>

      </div>
    </section>
  )
}
