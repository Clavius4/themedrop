'use client'

import { useState } from 'react'
import { Download, CheckCircle, Loader2 } from 'lucide-react'
import { OSDownload } from '@/types'
import { OS_INFO } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface DownloadButtonProps {
  download: OSDownload
  themeSlug: string
  highlighted?: boolean
}

export default function DownloadButton({ download, themeSlug, highlighted = false }: DownloadButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const info = OS_INFO[download.os]

  const handleDownload = async () => {
    if (download.file === '#') {
      alert('This theme is coming soon! Subscribe to get notified.')
      return
    }

    setState('loading')

    try {
      // Track the download
      await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: themeSlug, os: download.os }),
      }).catch(() => {}) // non-blocking

      // Trigger file download
      const a = document.createElement('a')
      a.href = download.file
      a.download = download.file.split('/').pop() || 'theme.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setState('done')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('idle')
    }
  }

  if (!info) return null

  return (
    <button
      onClick={handleDownload}
      className={cn(
        'w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left',
        highlighted
          ? 'ring-2 ring-[var(--gold)] bg-[rgba(200,160,48,0.08)]'
          : 'bg-[var(--bg-elevated)] hover:bg-[rgba(200,160,48,0.05)]'
      )}
      style={{ border: `1px solid ${highlighted ? 'var(--gold)' : 'var(--border)'}` }}
    >
      {/* OS icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ background: info.bg }}
      >
        {info.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {info.label}
          </span>
          {highlighted && (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
            >
              YOUR OS
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {download.size} · {download.installCmd}
        </span>
      </div>

      {/* Download icon */}
      <div style={{ color: highlighted ? 'var(--gold)' : 'var(--text-muted)' }}>
        {state === 'loading' && <Loader2 size={18} className="animate-spin" />}
        {state === 'done'    && <CheckCircle size={18} style={{ color: '#7D9E6B' }} />}
        {state === 'idle'    && <Download size={18} />}
      </div>
    </button>
  )
}
