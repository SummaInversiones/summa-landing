import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import "./sections.css";
import "./calc-gallery.css";

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://palminversiones.com";
const TITLE = "Palm Inversiones — Tu asesor financiero personal en Argentina";
const DESCRIPTION =
  "Palm convierte ahorristas en inversores: organizá tus gastos, recibí un portafolio personalizado según tus objetivos y empezá a invertir. Sin letra chica, sin comisiones ocultas. Regulado por la CNV. Hecho en Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Palm Inversiones",
  },
  description: DESCRIPTION,
  applicationName: "Palm Inversiones",
  authors: [{ name: "Palm Inversiones" }],
  creator: "Palm Inversiones",
  publisher: "Palm Inversiones",
  category: "finance",
  keywords: [
    "invertir en Argentina",
    "app de inversiones",
    "asesor financiero personal",
    "portafolio personalizado",
    "ahorro e inversión",
    "gestión financiera",
    "invertir sin comisiones ocultas",
    "fintech argentina",
    "CNV",
    "Palm Inversiones",
  ],
  // NOTE: el canonical NO va acá — en el layout lo heredaría toda página que
  // no lo pise (p. ej. las noindex /animaciones y /cards-nuevas apuntarían a
  // la home). Cada page.tsx declara el suyo; la home lo hace en app/page.tsx.
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Palm Inversiones",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#101B3B",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${ibmPlex.variable} antialiased`}>
      <body>
        {/* Sin JS, los títulos [data-split-words] quedarían en visibility:hidden
            esperando la clase .split-ready — este fallback los muestra. */}
        <noscript>
          <style>{`[data-split-words]{visibility:visible}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
