export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <a href="#" className="logo" aria-label="Palm">
          <img className="logo-mark" src="/mockups/palm-logo.png" alt="Palm" />
          <span className="wordmark">Palm</span>
        </a>
        <p>© 2025 Palm · Regulado por CNV · Hecho en Argentina 🇦🇷</p>
        <p className="footer-contact">
          Contacto · <a href="mailto:dev@palminversiones.com">dev@palminversiones.com</a> · Instagram: <a href="https://instagram.com/palm.inversiones" target="_blank" rel="noopener noreferrer">@palm.inversiones</a>
        </p>
        <p className="footer-links">
          <a href="/preguntas-frecuentes">Preguntas frecuentes</a> · <a href="#">Términos de uso</a> · <a href="#">Política de privacidad</a>
        </p>
      </div>
    </footer>
  )
}
