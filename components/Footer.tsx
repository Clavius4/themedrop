'use client'

import Link from 'next/link'
import { Zap, GitBranch, Share2 } from 'lucide-react'

const LINKS = {
  Themes: [
    { href: '/category/tv-shows', label: 'TV & Film' },
    { href: '/category/gaming',   label: 'Gaming' },
    { href: '/category/anime',    label: 'Anime' },
    { href: '/category/minimal',  label: 'Minimal' },
    { href: '/category/nature',   label: 'Nature' },
  ],
  Platform: [
    { href: '/os/windows', label: 'Windows' },
    { href: '/os/macos',   label: 'macOS' },
    { href: '/os/gnome',   label: 'Ubuntu / GNOME' },
    { href: '/os/kde',     label: 'Kali / KDE' },
  ],
  Info: [
    { href: '/about',   label: 'About' },
    { href: '/submit',  label: 'Submit a Theme' },
    { href: '/privacy', label: 'Privacy' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
              >
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Theme<span style={{ color: 'var(--gold)' }}>Drop</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Premium cross-platform OS themes. Free forever. Windows, macOS, GNOME, and KDE — one download, one click install.
            </p>
            <div className="flex gap-3">
              {[GitBranch, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--gold)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--gold)' }}
              >
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <p>© 2026 ThemeDrop. All theme packs are free for personal use.</p>
          <p>Built with Next.js · Deployed on Vercel · Themes hosted on Cloudflare R2</p>
        </div>
      </div>
    </footer>
  )
}
