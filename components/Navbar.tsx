'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Download, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/themes',         label: 'All Themes' },
  { href: '/os/windows',    label: 'Windows' },
  { href: '/os/macos',      label: 'macOS' },
  { href: '/os/gnome',      label: 'Linux' },
  { href: '/category/gaming', label: 'Gaming' },
  { href: '/category/tv-shows', label: 'TV & Film' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(8,8,9,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center glow-gold"
              style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
            >
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Theme<span style={{ color: 'var(--gold)' }}>Drop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  pathname === href
                    ? 'text-[var(--gold)] bg-[rgba(200,160,48,0.1)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/themes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: 'var(--gold)',
                color: 'var(--bg-base)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-bright)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
            >
              <Download size={14} />
              Free Download
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="p-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{ color: pathname === href ? 'var(--gold)' : 'var(--text-secondary)' }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/themes"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-center"
              style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
            >
              Free Download
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
