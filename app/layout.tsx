import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito, Inter } from 'next/font/google'
import ServiceWorkerRegister from '@/components/shared/ServiceWorkerRegister'
import './globals.css'

// FIX 13: latin-ext necesar pentru ă, î, â, ș, ț românești
const fredoka = Fredoka({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-fredoka',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Playlio — Lumea Jocurilor Educative',
    template: '%s | Playlio',
  },
  description:
    'O lume colorată și sigură unde copiii cu vârste între 3 și 10 ani explorează, construiesc, învață și se joacă — fără reclame, fără pericole.',
  keywords: [
    'jocuri educative copii',
    'platforma educativa',
    'invatare prin joc',
    'jocuri sigure copii',
    'litere cifre copii',
    'aventura virtuala copii',
    'Playlio',
  ],
  authors: [{ name: 'Playlio', url: 'https://playlio.fun' }],
  creator: 'Playlio',
  publisher: 'Playlio',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://playlio.fun'
  ),
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://playlio.fun',
    siteName: 'Playlio',
    title: 'Playlio — Lumea Jocurilor Educative',
    description:
      'O lume colorată și sigură unde copiii explorează, construiesc, învață și se joacă.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Playlio — Lumea Jocurilor Educative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playlio — Lumea Jocurilor Educative',
    description:
      'O lume colorată și sigură unde copiii explorează, construiesc, învață și se joacă.',
    images: ['/images/og-image.png'],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#4FC3F7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${fredoka.variable} ${nunito.variable} ${inter.variable}`}>
      <body className="font-nunito antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
