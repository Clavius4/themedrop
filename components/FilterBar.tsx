'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { OS_INFO, CATEGORIES } from '@/lib/themes'
import { OS, Category } from '@/types'

const OS_FILTERS = Object.entries(OS_INFO).map(([os, info]) => ({ os: os as OS, ...info }))

interface FilterBarProps {
  activeOS?: OS | 'all'
  activeCategory?: Category | 'all'
}

export default function FilterBar({ activeOS = 'all', activeCategory = 'all' }: FilterBarProps) {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString())
    if (value === 'all') p.delete(key)
    else p.set(key, value)
    router.push(`/themes?${p.toString()}`, { scroll: false })
  }, [params, router])

  return (
    <div className="flex flex-col gap-4">
      {/* OS filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs uppercase tracking-widest self-center mr-2" style={{ color: 'var(--text-muted)' }}>OS</span>
        {([{ os: 'all' as const, label: 'All', icon: '◈' }, ...OS_FILTERS] as Array<{ os: string; label: string; icon: string }>).map(f => {
          const active = f.os === activeOS
          return (
            <button
              key={f.os}
              onClick={() => update('os', f.os)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(200,160,48,0.15)' : 'var(--bg-elevated)',
                color: active ? 'var(--gold)' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs uppercase tracking-widest self-center mr-2" style={{ color: 'var(--text-muted)' }}>Category</span>
        <button
          onClick={() => update('category', 'all')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeCategory === 'all' ? 'rgba(200,160,48,0.15)' : 'var(--bg-elevated)',
            color: activeCategory === 'all' ? 'var(--gold)' : 'var(--text-secondary)',
            border: `1px solid ${activeCategory === 'all' ? 'var(--gold)' : 'var(--border)'}`,
          }}
        >
          All
        </button>
        {CATEGORIES.map(cat => {
          const active = cat.slug === activeCategory
          return (
            <button
              key={cat.slug}
              onClick={() => update('category', cat.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(200,160,48,0.15)' : 'var(--bg-elevated)',
                color: active ? 'var(--gold)' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
              >
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
