'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

const HERO_WORDS = ['Windows', 'macOS', 'GNOME', 'KDE Plasma']

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % HERO_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,160,48,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,160,48,0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,30,38,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,30,38,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
          style={{
            background: 'rgba(200,160,48,0.1)',
            border: '1px solid rgba(200,160,48,0.3)',
            color: 'var(--gold)',
          }}
        >
          <Zap size={14} strokeWidth={2.5} />
          Cross-platform · Free · One-click install
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up delay-100"
          style={{ color: 'var(--text-primary)' }}
        >
          Premium themes<br />
          for{' '}
          <span
            className="shimmer inline-block min-w-[280px]"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {HERO_WORDS[wordIdx]}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          Complete theme packs — wallpapers, colour schemes, Terminal profiles — built for
          your OS and installed in one click. Forever free.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/themes"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all glow-gold"
            style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold-bright)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold)')}
          >
            Browse Themes
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/theme/peaky-blinders"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--gold)'
              el.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.color = 'var(--text-secondary)'
            }}
          >
            See Peaky Blinders →
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="mt-16 inline-flex flex-wrap justify-center gap-8 animate-fade-in-up delay-400"
          style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}
        >
          {[
            { value: '4', label: 'Platforms' },
            { value: '6+', label: 'Theme Packs' },
            { value: '100%', label: 'Free' },
            { value: '1-click', label: 'Install' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black" style={{ color: 'var(--gold)' }}>{value}</div>
              <div className="text-xs uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }}
      />
    </section>
  )
}
