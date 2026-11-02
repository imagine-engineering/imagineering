import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://imagine.engineering'),
  title: 'imagineering | Made development tools',
  description: 'Made’s shared editing, language tools, agents, terminal, Git, debugging and review. Explore Copper, the Groovy candidate and opt-in Sim workflows.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'imagineering | Made development tools',
    description: 'Made’s shared developer tools. Copper for Rust, Groovy JVM development and opt-in Sim visual workflows.',
    url: 'https://imagine.engineering',
    siteName: 'imagineering',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'imagineering — Made, Copper, Groovy and Sim' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'imagineering | Made development tools',
    description: 'Made’s shared developer tools. Copper for Rust, Groovy JVM development and opt-in Sim visual workflows.',
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
