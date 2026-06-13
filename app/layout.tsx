import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ThemeDrop — Free Cross-Platform OS Themes',
    template: '%s | ThemeDrop',
  },
  description: 'Premium free theme packs for Windows, macOS, Ubuntu/GNOME, and KDE Plasma. One-click install. TV shows, gaming, anime, minimal — new drops every week.',
  keywords: ['desktop theme', 'wallpaper pack', 'Windows theme', 'macOS theme', 'Linux theme', 'GNOME theme', 'KDE theme', 'free download'],
  authors: [{ name: 'ThemeDrop' }],
  creator: 'ThemeDrop',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://themedrop.vercel.app',
    siteName: 'ThemeDrop',
    title: 'ThemeDrop — Free Cross-Platform OS Themes',
    description: 'Premium free theme packs for Windows, macOS, Ubuntu/GNOME, and KDE Plasma. One-click install.',
    images: [{ url: '/previews/peaky-blinders-1.jpg', width: 1920, height: 1080, alt: 'ThemeDrop Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThemeDrop — Free Cross-Platform OS Themes',
    description: 'Premium free theme packs. One-click install for Windows, macOS, GNOME, KDE.',
    images: ['/previews/peaky-blinders-1.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://themedrop.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
