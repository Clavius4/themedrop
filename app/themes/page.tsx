import { Suspense } from 'react'
import type { Metadata } from 'next'
import ThemeCard from '@/components/ThemeCard'
import FilterBar from '@/components/FilterBar'
import { THEMES } from '@/lib/themes'
import { OS, Category } from '@/types'

export const metadata: Metadata = {
  title: 'All Themes',
  description: 'Browse all free cross-platform OS theme packs. Filter by OS and category.',
}

interface SearchParams { os?: string; category?: string }

export default async function ThemesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { os, category } = await searchParams

  const filtered = THEMES.filter(t => {
    const matchOS = !os || os === 'all' || t.downloads.some(d => d.os === os)
    const matchCat = !category || category === 'all' || t.category === category
    return matchOS && matchCat
  })

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--gold)' }}>
            Browse
          </p>
          <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
            All Themes
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} theme pack{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Suspense fallback={<div style={{ color: 'var(--text-muted)' }}>Loading filters...</div>}>
            <FilterBar
              activeOS={(os as OS) || 'all'}
              activeCategory={(category as Category) || 'all'}
            />
          </Suspense>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((theme, i) => (
              <ThemeCard key={theme.slug} theme={theme} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No themes found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try a different OS or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
