import FooterNewsletter from "@/components/FooterNewsletter";

const NAV = [
  {
    header: "Producto",
    links: [
      { label: "Cómo funciona", href: "/#explore-wip" },
      { label: "Calculadora", href: "/#calculadora" },
      { label: "Planes", href: "/#pilares" },
      { label: "Seguridad", href: "/#seguridad" },
    ],
  },
  {
    header: "Recursos",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Bajate la app", href: "/#download" },
    ],
  },
  {
    header: "Compañía",
    links: [
      { label: "Contacto", href: "mailto:dev@palminversiones.com" },
      { label: "Términos de uso", href: "#" },
      { label: "Privacidad", href: "#" },
    ],
  },
];

// NOTE: X and LinkedIn URLs are best-guesses from the brand handle — confirm/replace.
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/palm.inversiones",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/palminversiones",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/palm-inversiones/",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main floating card */}
      <div className="footer-card">
        <aside className="footer-aside">
          <a href="/" className="footer-logo" aria-label="Palm — inicio">
            <img src="/mockups/palm-logo-blue.png" alt="Palm" />
          </a>
        </aside>

        <div className="footer-main">
          <FooterNewsletter />

          <nav className="footer-nav" aria-label="Enlaces del pie">
            {NAV.map((col) => (
              <div key={col.header} className="footer-col">
                <h3 className="footer-col__head">{col.header}</h3>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} className="footer-col__link">
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
            <div className="footer-col">
              <h3 className="footer-col__head">Redes</h3>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-col__link footer-social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="footer-social__icon">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Global footer line, outside the card */}
      <div className="footer-legal">
        <p className="footer-legal__copy">
          © 2026 Palm Inversiones · Regulado por CNV · Hecho en Argentina 🇦🇷
        </p>
        <p className="footer-legal__links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Cookies</a>
        </p>
      </div>
    </footer>
  );
}
