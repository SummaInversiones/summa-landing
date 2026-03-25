import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Summa — Invertí con inteligencia',
  description: 'Summa analiza tu situación y te arma un plan de inversión personalizado. Simple, seguro, para todos.',
  openGraph: {
    title: 'Summa — Invertí con inteligencia',
    description: 'Tu plata, trabajando para vos.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
