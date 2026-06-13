'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Download, Star, ImageIcon } from 'lucide-react'
import { Theme } from '@/types'
import { OS_INFO } from '@/lib/themes'
import { formatDownloads } from '@/lib/utils'

interface ThemeCardProps {
  theme: Theme
  priority?: boolean
}

export default function ThemeCard({ theme, priority = false }: ThemeCardProps) {
  const hasPreview = theme.previews.length > 0

  return (
    <Link href={`/theme/${theme.slug}`} className="block group">
      <article
        className="glass card-hover rounded-2xl overflow-hidden h-full flex flex-col"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Preview image */}
        <div
          className="relative aspect-video overflow-hidden"
          style={{ background: 'var(--bg-elevated)' }}
        >
          {hasPreview ? (
            <Image
              src={theme.previews[0]}
              alt={`${theme.name} wallpaper preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Wallpaper count badge */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            {theme.wallpaperCount} wallpapers
          </div>

          {/* Featured badge */}
          {theme.featured && (
            <div
              className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-xs font-semibold"
              style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
            >
              FEATURED
            </div>
          )}

          {/* Accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          {/* Title row */}
          <div>
            <h3
              className="font-bold text-lg leading-tight group-hover:text-[var(--gold)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {theme.name}
            </h3>
            <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {theme.description}
            </p>
          </div>

          {/* OS badges */}
          <div className="flex flex-wrap gap-1.5">
            {theme.downloads.map(d => {
              const info = OS_INFO[d.os]
              if (!info) return null
              return (
                <span
                  key={d.os}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: info.bg, color: info.color }}
                >
                  {info.icon} {info.label.split('/')[0].trim()}
                </span>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <Star size={12} fill="currentColor" style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {theme.rating.toFixed(1)}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(200,160,48,0.1)', color: 'var(--gold)', border: '1px solid rgba(200,160,48,0.2)' }}
            >
              <Download size={12} />
              Free Download
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
