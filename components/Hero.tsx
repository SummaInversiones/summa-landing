import Image from 'next/image'
import { WaitlistForm } from './WaitlistForm'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-brand-dark flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
      <div id="hero-sentinel" className="absolute bottom-0 left-0 w-full h-px" />

      <div className="flex flex-col items-center text-center max-w-2xl z-10">
        <h1 className="font-bold leading-[1.1] mb-6 text-[40px] sm:text-[52px] lg:text-[72px]">
          <span className="text-white block">Invertí con inteligencia.</span>
          <span className="text-brand-green block">Sin ser experto.</span>
        </h1>

        <p className="text-muted-fg text-base sm:text-lg max-w-[560px] mb-10 leading-relaxed">
          Summa analiza tu situación y te arma un plan de inversión personalizado.
          Simple, seguro, para todos.
        </p>

        <div id="waitlist-form" className="relative w-full flex justify-center">
          <WaitlistForm variant="dark" />
        </div>
      </div>

      <div className="mt-16 lg:mt-20 animate-float">
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            position: 'relative',
            width: 'clamp(220px, 28vw, 280px)',
            aspectRatio: '9 / 19.5',
            borderRadius: '40px',
            border: '8px solid rgba(255,255,255,0.12)',
            background: '#000',
            boxShadow: '0 0 120px 20px rgba(144,226,77,0.15)',
          }}
        >
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black z-10"
            style={{ width: 90, height: 28, borderRadius: 14 }}
          />
          <Image
            src="/mockup.png"
            alt="Summa app"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}
