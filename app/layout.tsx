import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito, Inter } from 'next/font/google'
import { cookies } from 'next/headers'
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
    default: 'Playlio — The World of Educational Games',
    template: '%s | Playlio',
  },
  description:
    'A colorful and safe world where kids aged 3–10 explore, build, learn and play — no ads, no dangers.',
  keywords: [
    'educational games for kids',
    'educational platform',
    'learning through play',
    'safe games for kids',
    'letters numbers kids',
    'virtual adventure kids',
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
    locale: 'en_US',
    url: 'https://playlio.fun',
    siteName: 'Playlio',
    title: 'Playlio — The World of Educational Games',
    description:
      'A colorful and safe world where kids explore, build, learn and play — no ads, no dangers.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Playlio — The World of Educational Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playlio — The World of Educational Games',
    description:
      'A colorful and safe world where kids explore, build, learn and play — no ads, no dangers.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('playlio_lang')?.value === 'en' ? 'en' : 'ro'

  return (
    <html lang={lang} className={`${fredoka.variable} ${nunito.variable} ${inter.variable}`}>
      <body className="font-nunito antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
