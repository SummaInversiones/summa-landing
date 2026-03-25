import { WaitlistForm } from './WaitlistForm'

export function FooterCTA() {
  return (
    <section className="bg-brand-dark py-24 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-10">
        <h2 className="font-medium text-white text-[28px] lg:text-[40px]">
          Sé el primero en invertir con Summa.
        </h2>
        <WaitlistForm variant="dark" />
      </div>

      <div className="mt-16 flex justify-center gap-8">
        {[
          { label: 'Términos', href: '#' },
          { label: 'Privacidad', href: '#' },
          { label: 'Contacto', href: 'mailto:hola@summa.app' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-white/50 text-sm hover:text-white/80 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  )
}
