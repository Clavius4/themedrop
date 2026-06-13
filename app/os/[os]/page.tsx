import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ThemeCard from '@/components/ThemeCard'
import { THEMES, OS_INFO } from '@/lib/themes'
import { OS } from '@/types'

interface Props { params: Promise<{ os: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { os } = await params
  const info = OS_INFO[os]
  if (!info) return {}
  return {
    title: `${info.label} Themes`,
    description: `Free theme packs for ${info.label}. One-click install wallpapers, colour schemes, and more.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(OS_INFO).map(os => ({ os }))
}

export default async function OSPage({ params }: Props) {
  const { os } = await params
  const info = OS_INFO[os]
  if (!info) notFound()

  const themes = THEMES.filter(t => t.downloads.some(d => d.os === os))

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-6"
            style={{ background: info.bg, border: `1px solid ${info.color}30` }}
          >
            <span className="text-3xl">{info.icon}</span>
            <span className="text-2xl font-black" style={{ color: info.color }}>{info.label}</span>
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {info.label} Themes
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {themes.length} complete theme pack{themes.length !== 1 ? 's' : ''} built specifically for {info.label}.
            Each one includes wallpapers, colour schemes, and one-click install.
          </p>
        </div>

        {themes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme, i) => <ThemeCard key={theme.slug} theme={theme} priority={i < 3} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{info.icon}</p>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              More {info.label} themes dropping soon
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Check back weekly for new drops
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
