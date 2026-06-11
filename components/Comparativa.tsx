import BentoCards from "@/components/palm-cards/BentoCards";

// Sección "¿Por qué Palm?" — bento con las 4 cards "confianza" del
// diseñador (components/palm-cards): mass, privacy, drain y zero.
export default function Comparativa() {
  return (
    <section className="security section" id="seguridad" aria-labelledby="seguridad-title">
      <div className="container">
        <h2 id="seguridad-title" className="security__title" data-split-words>
          ¿Por qué <span className="kw">Palm</span>?
        </h2>
        <BentoCards />
      </div>
    </section>
  )
}
