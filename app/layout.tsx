import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://imagine.engineering'),
  title: 'imagineering | Copper and Groovy development tools',
  description: 'Explore Copper for Rust editing, Cargo, tests, debugging, Git, terminal, agents, and change review. Groovy JVM tools are in development. More language products are planned.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'imagineering | Copper and Groovy development tools',
    description: 'Rust development in Copper. Groovy JVM tools are in development. More language products are planned.',
    url: 'https://imagine.engineering',
    siteName: 'imagineering',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'imagineering — Copper for Rust; Groovy JVM tools in development' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'imagineering | Copper and Groovy development tools',
    description: 'Rust development in Copper. Groovy JVM tools are in development. More language products are planned.',
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: '/imagineering-icon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/imagineering-icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/imagineering-icon-48.png', type: 'image/png', sizes: '48x48' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/imagineering-apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
