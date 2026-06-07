export default function CtaFinal() {
  return (
    <section className="cta-final section" id="download">
      <div className="container">
        <h2 data-split-words>Tu futuro comienza <span className="kw">hoy</span>.</h2>
        <p className="reveal" data-delay="100">El primer paso es saber dónde estás parado. Cuanto antes empieces, antes llegás a tu objetivo.</p>
        <hr className="cta-final__rule reveal" data-delay="200" aria-hidden="true" />
        <div className="cta-buttons reveal" data-delay="250">
          <a href="#" className="store-btn" aria-label="Próximamente en App Store">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.365 1.43c.058 1.35-.495 2.7-1.27 3.66-.81 1.02-2.16 1.83-3.48 1.71-.108-1.32.555-2.7 1.32-3.6.84-1.02 2.31-1.83 3.43-1.77zM21 17.31c-.555 1.23-.825 1.785-1.545 2.88-1.005 1.53-2.43 3.435-4.185 3.45-1.56.015-1.965-1.02-4.08-1.005-2.115.015-2.565 1.02-4.125 1.005C5.31 23.625 3.96 21.9 2.955 20.37 0.15 16.08-.15 11.04 1.59 8.355c1.23-1.905 3.18-3.015 5.01-3.015 1.86 0 3.03 1.02 4.575 1.02 1.5 0 2.415-1.02 4.575-1.02 1.62 0 3.345.885 4.575 2.415-4.02 2.205-3.36 7.95.675 9.555z"/></svg>
            <span>
              <span className="label-small">Próximamente en</span>
              <span className="label-big">App Store</span>
            </span>
          </a>
          <a href="#" className="store-btn ghost" aria-label="Próximamente en Google Play">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3.6 1.6c-.36.39-.6.96-.6 1.71v17.38c0 .75.24 1.32.6 1.71l.09.09 9.72-9.72v-.23L3.69 1.51l-.09.09zm12.81 14.39l-3-3v-.23l3-3 .06.04 3.555 2.025c1.02.57 1.02 1.515 0 2.085l-3.555 2.04-.06.04zm.06-.04L5.115 22.445c-.63.36-1.185.315-1.515-.045l9.81-9.81 3 3.06zm0-7.9L5.115 1.555C4.485 1.195 3.93 1.24 3.6 1.6l9.81 9.81 3.06-3.36z"/></svg>
            <span>
              <span className="label-small">Próximamente en</span>
              <span className="label-big">Google Play</span>
            </span>
          </a>
        </div>

      </div>
    </section>
  )
}
