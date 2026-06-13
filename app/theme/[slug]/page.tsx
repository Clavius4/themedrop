'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, ImageIcon, Tag, Calendar } from 'lucide-react'
import { getTheme, THEMES } from '@/lib/themes'
import { detectOS } from '@/lib/utils'
import DownloadButton from '@/components/DownloadButton'
import OSBadge from '@/components/OSBadge'
import ThemeCard from '@/components/ThemeCard'
import { useEffect, useState } from 'react'
import { OS } from '@/types'

export default function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const theme = getTheme(slug)
  const [userOS, setUserOS] = useState<OS>('windows')

  useEffect(() => { setUserOS(detectOS()) }, [])

  if (!theme) notFound()

  const related = THEMES.filter(t => t.slug !== slug && t.category === theme.category).slice(0, 3)

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/themes"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back to themes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: preview + info */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Main preview */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              {theme.previews[0] ? (
                <Image
                  src={theme.previews[0]}
                  alt={`${theme.name} wallpaper`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Preview thumbnails */}
            {theme.previews.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {theme.previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-xl overflow-hidden"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>About this theme</h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {theme.longDescription}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Wallpapers', value: theme.wallpaperCount },
                  { label: 'Platforms', value: theme.downloads.length },
                  { label: 'Rating', value: `${theme.rating}/5` },
                  { label: 'Released', value: new Date(theme.releaseDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    <div className="font-bold" style={{ color: 'var(--gold)' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {theme.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: download panel */}
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  {theme.name}
                </h1>
                {theme.featured && (
                  <span
                    className="shrink-0 text-xs px-2 py-0.5 rounded-md font-semibold"
                    style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
                  >
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{theme.description}</p>
              <div className="flex items-center gap-2">
                <Star size={14} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{theme.rating}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>rating</span>
              </div>
            </div>

            {/* Download buttons */}
            <div className="p-6 rounded-2xl flex flex-col gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Download for your OS
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(125,158,107,0.15)', color: '#7D9E6B' }}
                >
                  100% Free
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                Your OS detected: <strong style={{ color: 'var(--gold)' }}>{userOS}</strong>
              </p>
              {theme.downloads.map(d => (
                <DownloadButton
                  key={d.os}
                  download={d}
                  themeSlug={theme.slug}
                  highlighted={d.os === userOS}
                />
              ))}
            </div>

            {/* Install tip */}
            <div
              className="p-4 rounded-xl text-xs leading-relaxed"
              style={{ background: 'rgba(200,160,48,0.06)', border: '1px solid rgba(200,160,48,0.2)', color: 'var(--text-secondary)' }}
            >
              <strong style={{ color: 'var(--gold)' }}>Quick install:</strong>
              {' '}Extract the ZIP, then follow the README inside.
              Linux/macOS: <code className="font-mono" style={{ color: 'var(--gold)' }}>chmod +x install.sh && ./install.sh</code>.
              Windows: double-click the <code className="font-mono" style={{ color: 'var(--gold)' }}>.deskthemepack</code> file.
            </div>

            {/* OS badges */}
            <div className="flex flex-wrap gap-2">
              {theme.downloads.map(d => (
                <OSBadge key={d.os} os={d.os} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* Related themes */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--gold)' }}>More like this</p>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Related themes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(t => <ThemeCard key={t.slug} theme={t} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
