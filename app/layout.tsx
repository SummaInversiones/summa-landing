import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Palm Inversiones",
  description: "Tu asesor financiero personal. Sin letra chica, sin sorpresas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${ibmPlex.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
