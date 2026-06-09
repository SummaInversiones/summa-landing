import Waitlist from "@/components/Waitlist";

export default function CtaFinal() {
  return (
    <section className="cta-final section" id="download">
      <div className="container">
        <h2 data-split-words>Tu futuro comienza <span className="kw">hoy</span>.</h2>
        <p className="reveal" data-delay="100">El primer paso es saber dónde estás parado. Dejanos tu email y te avisamos apenas abramos el acceso.</p>
        <hr className="cta-final__rule reveal" data-delay="200" aria-hidden="true" />
        <p className="cta-final__cue reveal" data-delay="220">Sumate a la <span className="kw">lista de espera</span>!</p>
        <Waitlist />
      </div>
    </section>
  )
}
