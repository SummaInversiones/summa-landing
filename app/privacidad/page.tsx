import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad del sitio de Palm Inversiones: qué datos recopilamos (solo tu email en la lista de espera), para qué los usamos y tus derechos.",
  alternates: { canonical: "/privacidad" },
};

// TODO(founder): cuando esté definida la razón social / entidad legal de Palm,
// agregarla como responsable de los datos y pasar el texto por revisión legal.
export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="section legal-page">
        <div className="container">
          <h1 className="legal-page__title">Política de privacidad</h1>
          <p className="legal-page__updated">Última actualización: 11 de junio de 2026</p>

          <div className="legal-body">
            <h2>Qué datos recopilamos</h2>
            <p>
              Solo tu dirección de email, y solo si te anotás en la lista de espera. Este sitio no
              usa cookies de seguimiento ni herramientas de analytics, y no recopila ningún otro
              dato personal mientras lo navegás.
            </p>

            <h2>Para qué lo usamos</h2>
            <p>
              Para avisarte cuando Palm abra y contarte novedades del lanzamiento. Sin spam. No
              vendemos tu email ni lo compartimos con terceros con fines comerciales.
            </p>

            <h2>Dónde se guarda</h2>
            <p>
              El sitio corre sobre infraestructura de Cloudflare y los emails de la lista de espera
              se almacenan en Upstash, un servicio de almacenamiento seguro. Solo el equipo de Palm
              accede a esa lista.
            </p>

            <h2>Tus derechos</h2>
            <p>
              De acuerdo con la Ley 25.326 de Protección de los Datos Personales, podés pedir el
              acceso, la corrección o la eliminación de tus datos cuando quieras: escribinos a{" "}
              <a href="mailto:dev@palminversiones.com">dev@palminversiones.com</a> y lo resolvemos.
              La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326,
              atiende las denuncias y reclamos por incumplimiento de las normas de protección de
              datos personales.
            </p>

            <h2>Cambios</h2>
            <p>
              Si esta política cambia, actualizamos esta página y su fecha de última actualización.
              Cuando la app esté disponible va a tener su propia política de privacidad, más
              completa, porque va a manejar más datos que este sitio.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
