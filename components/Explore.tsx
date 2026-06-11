import CardsGrid from "@/components/palm-cards/CardsGrid";

// Sección Explore — cards nuevas del diseñador (components/palm-cards).
// El shell viejo (.pcard de sections.css) sigue vivo solo en el tile
// "0% comisiones" del bento de Comparativa.
export default function Explore() {
  return (
    <section className="explore section" id="explore-wip">
      <div className="container">
        <div className="explore__head">
          <h2 data-split-words>Las herramientas que te <span className="kw">acompañan</span>.</h2>
        </div>
        <CardsGrid />
      </div>
    </section>
  )
}
