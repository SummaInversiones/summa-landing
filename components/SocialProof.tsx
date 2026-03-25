import { CheckCircle } from 'lucide-react'

const quotes = [
  {
    body: '"Por fin una app que me explica dónde poner mis ahorros sin que parezca que necesito un título en economía."',
    author: 'Usuario beta, Buenos Aires',
  },
  {
    body: '"Empecé con poco y Summa me ayudó a entender que no importa el monto, sino el plan."',
    author: 'Usuario beta, Córdoba',
  },
]

const trustItems = ['Regulado', 'Seguro', 'Transparente']

export function SocialProof() {
  return (
    <section className="bg-brand-white py-24 px-6 border-t border-muted">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col gap-8 w-full">
          {quotes.map((q) => (
            <blockquote
              key={q.author}
              className="reveal text-center text-brand-dark/70 text-lg leading-relaxed italic"
            >
              <p>{q.body}</p>
              <footer className="mt-3 text-sm not-italic text-muted-fg">— {q.author}</footer>
            </blockquote>
          ))}
        </div>

        <div className="reveal flex flex-wrap justify-center gap-6">
          {trustItems.map(item => (
            <span key={item} className="flex items-center gap-2 text-brand-dark font-medium text-sm">
              <CheckCircle size={16} color="var(--brand-green)" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
