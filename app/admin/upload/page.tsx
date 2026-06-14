'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/admin/FileUpload'
import { OS, Category } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'tv-shows', label: 'TV Shows' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'anime', label: 'Anime' },
  { value: 'nature', label: 'Nature' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'movies', label: 'Movies' },
  { value: 'sports', label: 'Sports' },
]

const OS_CONFIGS: { os: OS; label: string; defaultInstall: string }[] = [
  { os: 'windows', label: 'Windows 10 / 11', defaultInstall: 'Double-click .deskthemepack' },
  { os: 'macos', label: 'macOS 12–15', defaultInstall: 'chmod +x install.sh && ./install.sh' },
  { os: 'gnome', label: 'Ubuntu / GNOME', defaultInstall: 'chmod +x install.sh && ./install.sh' },
  { os: 'kde', label: 'Kali / KDE Plasma', defaultInstall: 'chmod +x install.sh && ./install.sh' },
]

interface DownloadState {
  url: string
  size: string
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="px-6 py-4" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div className="p-6 flex flex-col gap-5" style={{ background: 'var(--bg-base)' }}>{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {label}{required && <span style={{ color: 'var(--gold)' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '0.75rem',
  padding: '0.625rem 1rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
}

export default function UploadThemePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [description, setDescription] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [category, setCategory] = useState<Category>('tv-shows')
  const [tags, setTags] = useState('')
  const [color, setColor] = useState('#C8A030')
  const [wallpaperCount, setWallpaperCount] = useState(10)
  const [featured, setFeatured] = useState(false)

  // Previews: up to 3
  const [previews, setPreviews] = useState<{ url: string; size: string }[]>([
    { url: '', size: '' }, { url: '', size: '' }, { url: '', size: '' },
  ])

  // Downloads per OS
  const [downloads, setDownloads] = useState<Record<OS, DownloadState>>({
    windows: { url: '', size: '' },
    macos: { url: '', size: '' },
    gnome: { url: '', size: '' },
    kde: { url: '', size: '' },
  })

  useEffect(() => {
    if (!slugManual) setSlug(slugify(name))
  }, [name, slugManual])

  function updatePreview(i: number, url: string, size: string) {
    setPreviews(prev => prev.map((p, idx) => idx === i ? { url, size } : p))
  }

  function updateDownload(os: OS, url: string, size: string) {
    setDownloads(prev => ({ ...prev, [os]: { url, size } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || !description) {
      setError('Name, slug, and short description are required.')
      return
    }
    setSaving(true)
    setError('')

    const previewUrls = previews.map(p => p.url).filter(Boolean)

    const osDownloads = OS_CONFIGS
      .filter(cfg => downloads[cfg.os].url)
      .map(cfg => ({
        os: cfg.os,
        label: cfg.label,
        size: downloads[cfg.os].size || '—',
        file: downloads[cfg.os].url,
        installCmd: cfg.defaultInstall,
      }))

    const payload = {
      slug,
      name,
      description,
      long_description: longDesc || description,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      wallpaper_count: wallpaperCount,
      color,
      featured,
      release_date: new Date().toISOString().split('T')[0],
      previews: previewUrls,
      downloads: osDownloads,
    }

    try {
      const res = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save theme')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} /> Dashboard
        </Link>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>New Theme</p>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Upload Theme Pack</h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: 'var(--gold)', color: 'var(--bg-base)', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Publishing…' : 'Publish Theme'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
          {error}
        </div>
      )}

      {/* Section 1: Info */}
      <Section title="Theme Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Theme Name" required>
            <input
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Breaking Bad"
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Slug (URL)" required>
            <input
              style={inputStyle}
              value={slug}
              onChange={e => { setSlug(slugify(e.target.value)); setSlugManual(true) }}
              placeholder="breaking-bad"
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
        </div>

        <Field label="Short Description" required>
          <textarea
            style={{ ...inputStyle, resize: 'none', minHeight: 72 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="One-line hook shown on theme cards (max 120 chars)"
            maxLength={120}
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{description.length}/120</p>
        </Field>

        <Field label="Long Description">
          <textarea
            style={{ ...inputStyle, resize: 'none', minHeight: 120 }}
            value={longDesc}
            onChange={e => setLongDesc(e.target.value)}
            placeholder="Full description shown on the theme detail page…"
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Category" required>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Wallpaper Count">
            <input
              type="number"
              min={1}
              max={50}
              style={inputStyle}
              value={wallpaperCount}
              onChange={e => setWallpaperCount(Number(e.target.value))}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Accent Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
                style={{ background: 'var(--bg-elevated)', padding: 2 }}
              />
              <input
                style={inputStyle}
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="#C8A030"
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </Field>
        </div>

        <Field label="Tags">
          <input
            style={inputStyle}
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="dark, moody, gold, vintage (comma-separated)"
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: featured ? 'var(--gold)' : 'var(--border)' }}
            onClick={() => setFeatured(f => !f)}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
              style={{ left: featured ? '1.25rem' : '0.125rem', background: 'white' }}
            />
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured (shown on homepage)</span>
        </label>
      </Section>

      {/* Section 2: Preview Images */}
      <Section title="Preview Images">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Upload 3 JPG wallpaper screenshots (1920×1080 recommended). These appear on the theme card and detail page.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previews.map((p, i) => (
            <FileUpload
              key={i}
              label={`Preview ${i + 1}${i === 0 ? ' (main)' : ''}`}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              bucket="previews"
              storagePath={`${slug || 'theme'}-${i + 1}.jpg`}
              value={p.url}
              onChange={(url, size) => updatePreview(i, url, size)}
              preview
            />
          ))}
        </div>
      </Section>

      {/* Section 3: Download Files */}
      <Section title="Download Files (ZIP)">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Upload the packaged ZIP for each platform. File size is auto-detected. At least one platform is recommended.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OS_CONFIGS.map(cfg => (
            <div key={cfg.os} className="flex flex-col gap-1">
              <FileUpload
                label={cfg.label}
                accept=".zip,application/zip"
                bucket="downloads"
                storagePath={`${slug || 'theme'}-${cfg.os}.zip`}
                value={downloads[cfg.os].url}
                onChange={(url, size) => updateDownload(cfg.os, url, size)}
              />
              {downloads[cfg.os].size && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Size: {downloads[cfg.os].size}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/admin" className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
          style={{ background: 'var(--gold)', color: 'var(--bg-base)', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Publishing…' : 'Publish Theme'}
        </button>
      </div>
    </form>
  )
}
