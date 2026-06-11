import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos de uso del sitio de Palm Inversiones: alcance informativo, calculadora orientativa, lista de espera y propiedad intelectual.",
  alternates: { canonical: "/terminos" },
};

// TODO(founder): cuando esté definida la razón social / entidad legal de Palm,
// agregarla en "Sobre este sitio" y pasar el texto por revisión legal.
export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="section legal-page">
        <div className="container">
          <h1 className="legal-page__title">Términos de uso</h1>
          <p className="legal-page__updated">Última actualización: 11 de junio de 2026</p>

          <div className="legal-body">
            <h2>Sobre este sitio</h2>
            <p>
              palminversiones.com es el sitio informativo de Palm Inversiones (&quot;Palm&quot;).
              La app de Palm todavía no está disponible: cuando la lancemos va a tener sus
              propios términos y condiciones de servicio, que vas a tener que aceptar para usarla.
            </p>

            <h2>Información, no asesoramiento</h2>
            <p>
              El contenido de este sitio es informativo y general. No constituye asesoramiento
              financiero personalizado, ni una recomendación u oferta de compra o venta de ningún
              instrumento. Las inversiones tienen riesgo: el valor de un portafolio puede subir o bajar.
            </p>

            <h2>La calculadora es orientativa</h2>
            <p>
              La calculadora del sitio hace un cálculo orientativo: asume 0% de rendimiento sobre el
              ahorro sin invertir y 15% anual con Palm. Los resultados son una proyección ilustrativa,
              no una promesa de rendimiento. Los rendimientos pasados o proyectados no garantizan
              rendimientos futuros.
            </p>

            <h2>Lista de espera</h2>
            <p>
              Al anotarte en la lista de espera nos das tu email para que te avisemos cuando Palm
              abra. Cómo lo guardamos y usamos está explicado en la{" "}
              <a href="/privacidad">Política de privacidad</a>.
            </p>

            <h2>Propiedad intelectual</h2>
            <p>
              La marca Palm, los textos, el diseño y las imágenes de este sitio pertenecen a Palm
              Inversiones. No los reproduzcas ni los uses con fines comerciales sin nuestro permiso.
            </p>

            <h2>Cambios</h2>
            <p>
              Podemos actualizar estos términos. La versión vigente es siempre la publicada en esta
              página, con su fecha de última actualización.
            </p>

            <h2>Contacto</h2>
            <p>
              Si tenés dudas sobre estos términos, escribinos a{" "}
              <a href="mailto:dev@palminversiones.com">dev@palminversiones.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
