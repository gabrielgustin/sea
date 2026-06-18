import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LoadingProvider } from '@/context/LoadingContext'
import GlobalPreloader from '@/components/global-preloader'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Secretaría de Extensión Académica - Portal SEA',
  description: 'Portal de formaciones y extensión académica de la Secretaría de Extensión Académica',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background overflow-x-hidden">
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        <LoadingProvider>
          <GlobalPreloader />
          {children}
        </LoadingProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
// Force redeploy
// Turso migration finalized
