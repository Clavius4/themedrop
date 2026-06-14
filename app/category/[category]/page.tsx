import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ThemeCard from '@/components/ThemeCard'
import { CATEGORIES } from '@/lib/themes'
import { getThemes } from '@/lib/db'

export const revalidate = 60

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) return {}
  return {
    title: `${cat.label} Themes`,
    description: `Free ${cat.label.toLowerCase()} OS theme packs for Windows, macOS, GNOME, and KDE Plasma.`,
  }
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }))
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) notFound()

  const allThemes = await getThemes()
  const themes = allThemes.filter(t => t.category === category)

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14">
          <div className="text-5xl mb-4">{cat.icon}</div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>
            Category
          </p>
          <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {cat.label} Themes
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {themes.length} theme pack{themes.length !== 1 ? 's' : ''} in {cat.label}.
            All available for Windows, macOS, GNOME, and KDE.
          </p>
        </div>

        {themes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((t, i) => <ThemeCard key={t.slug} theme={t} priority={i < 3} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{cat.icon}</p>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {cat.label} themes coming soon
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>New drops every week</p>
          </div>
        )}
      </div>
    </div>
  )
}
