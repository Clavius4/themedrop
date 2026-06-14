import Link from 'next/link'
import { ArrowRight, Zap, Globe, Monitor, Terminal, Layers } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import ThemeCard from '@/components/ThemeCard'
import { CATEGORIES, OS_INFO } from '@/lib/themes'
import { getThemes } from '@/lib/db'

export const revalidate = 60

const FEATURES = [
  { icon: Globe,    title: 'Cross-Platform',  desc: 'Every theme ships for Windows, macOS, Ubuntu/GNOME, and KDE Plasma. One download per OS — everything included.' },
  { icon: Zap,      title: 'One-Click Install', desc: 'Windows: double-click .deskthemepack. Linux/macOS: run install.sh. No manual config, no hunting for files.' },
  { icon: Layers,   title: 'Complete Packs',  desc: 'Not just wallpapers. Each pack includes colour schemes, Terminal profiles, accent colours, and dark mode settings.' },
  { icon: Monitor,  title: 'OS Detection',    desc: 'Your platform is auto-detected. The right download button is always shown first — no guessing.' },
  { icon: Terminal, title: 'Terminal Themes', desc: 'Built-in Terminal.app (macOS) and shell colour profiles so your coding environment matches your desktop.' },
  { icon: ArrowRight, title: 'More Every Week', desc: 'New theme drops weekly — TV shows, gaming, anime, minimal, cyberpunk. Submit your own coming soon.' },
]

export default async function HomePage() {
  const THEMES = await getThemes()
  const featured = THEMES.filter(t => t.featured)
  const recent   = THEMES.slice(0, 6)

  return (
    <>
      <HeroSection />

      {/* Featured themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>Featured</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Staff picks</h2>
          </div>
          <Link href="/themes" className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((theme, i) => <ThemeCard key={theme.slug} theme={theme} priority={i < 2} />)}
        </div>
      </section>

      {/* Why ThemeDrop */}
      <section className="border-y py-20" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>Why ThemeDrop</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Theming done right</h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Other wallpaper sites give you a JPG. We give you a complete OS experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl flex flex-col gap-3 card-hover"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200,160,48,0.12)' }}>
                  <Icon size={20} style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All recent themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>Latest Drops</p>
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>All themes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map(t => <ThemeCard key={t.slug} theme={t} />)}
        </div>
      </section>

      {/* Browse by OS */}
      <section className="border-t py-20" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>Browse by OS</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Pick your platform</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(OS_INFO).map(([os, info]) => (
              <Link key={os} href={`/os/${os}`}
                className="p-6 rounded-2xl text-center card-hover flex flex-col items-center gap-3"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span className="text-4xl">{info.icon}</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{info.label}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{THEMES.length} themes</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>By Category</p>
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>What are you into?</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium card-hover"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
              {cat.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(200,160,48,0.15)', color: 'var(--gold)' }}>
                  {cat.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(200,160,48,.15) 0%,rgba(200,160,48,.05) 50%,transparent 100%)', border: '1px solid rgba(200,160,48,.3)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(200,160,48,.08),transparent)' }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Make your desktop yours.</h2>
            <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Free forever. No account. No nonsense. Just great themes.
            </p>
            <Link href="/themes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base"
              style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}>
              Get Started — It&apos;s Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
