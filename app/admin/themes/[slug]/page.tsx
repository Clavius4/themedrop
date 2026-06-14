'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/admin/FileUpload'
import DeleteThemeButton from '@/components/admin/DeleteThemeButton'
import { OS, Category, Theme } from '@/types'

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

export default function EditThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [category, setCategory] = useState<Category>('tv-shows')
  const [tags, setTags] = useState('')
  const [color, setColor] = useState('#C8A030')
  const [wallpaperCount, setWallpaperCount] = useState(10)
  const [featured, setFeatured] = useState(false)
  const [previews, setPreviews] = useState([
    { url: '', size: '' }, { url: '', size: '' }, { url: '', size: '' },
  ])
  const [downloads, setDownloads] = useState<Record<OS, { url: string; size: string }>>({
    windows: { url: '', size: '' }, macos: { url: '', size: '' },
    gnome: { url: '', size: '' }, kde: { url: '', size: '' },
  })

  useEffect(() => {
    fetch(`/api/admin/themes/${slug}`)
      .then(r => r.json())
      .then((t: Theme) => {
        setTheme(t)
        setName(t.name)
        setDescription(t.description)
        setLongDesc(t.longDescription)
        setCategory(t.category)
        setTags(t.tags.join(', '))
        setColor(t.color)
        setWallpaperCount(t.wallpaperCount)
        setFeatured(t.featured)
        setPreviews([
          { url: t.previews[0] ?? '', size: '' },
          { url: t.previews[1] ?? '', size: '' },
          { url: t.previews[2] ?? '', size: '' },
        ])
        const dl: Record<OS, { url: string; size: string }> = {
          windows: { url: '', size: '' }, macos: { url: '', size: '' },
          gnome: { url: '', size: '' }, kde: { url: '', size: '' },
        }
        t.downloads.forEach(d => { dl[d.os] = { url: d.file, size: d.size } })
        setDownloads(dl)
      })
      .catch(() => setError('Failed to load theme'))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name,
      description,
      long_description: longDesc || description,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      wallpaper_count: wallpaperCount,
      color,
      featured,
      previews: previews.map(p => p.url).filter(Boolean),
      downloads: OS_CONFIGS
        .filter(cfg => downloads[cfg.os].url)
        .map(cfg => ({
          os: cfg.os,
          label: cfg.label,
          size: downloads[cfg.os].size || '—',
          file: downloads[cfg.os].url,
          installCmd: cfg.defaultInstall,
        })),
    }

    try {
      const res = await fetch(`/api/admin/themes/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Save failed'); return }
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--gold)' }} />
    </div>
  )

  if (!theme) return (
    <div className="py-20 text-center">
      <p style={{ color: '#F87171' }}>Theme not found or is a built-in (not editable from admin).</p>
      <Link href="/admin" className="mt-4 inline-block text-sm" style={{ color: 'var(--gold)' }}>← Dashboard</Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} /> Dashboard
        </Link>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--gold)' }}>Edit Theme</p>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{theme.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <DeleteThemeButton slug={slug} name={theme.name} />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--gold)', color: 'var(--bg-base)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
          {error}
        </div>
      )}

      <Section title="Theme Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Theme Name <span style={{ color: 'var(--gold)' }}>*</span></label>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Slug</label>
            <input style={{ ...inputStyle, opacity: 0.5 }} value={slug} readOnly />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Short Description</label>
          <textarea style={{ ...inputStyle, resize: 'none', minHeight: 72 }} value={description} onChange={e => setDescription(e.target.value)}
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Long Description</label>
          <textarea style={{ ...inputStyle, resize: 'none', minHeight: 120 }} value={longDesc} onChange={e => setLongDesc(e.target.value)}
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={e => setCategory(e.target.value as Category)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Wallpaper Count</label>
            <input type="number" min={1} style={inputStyle} value={wallpaperCount} onChange={e => setWallpaperCount(Number(e.target.value))}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" style={{ background: 'var(--bg-elevated)', padding: 2 }} />
              <input style={inputStyle} value={color} onChange={e => setColor(e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Tags</label>
          <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="dark, moody, gold (comma-separated)"
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative w-10 h-5 rounded-full transition-colors" style={{ background: featured ? 'var(--gold)' : 'var(--border)' }} onClick={() => setFeatured(f => !f)}>
            <div className="absolute top-0.5 w-4 h-4 rounded-full transition-transform" style={{ left: featured ? '1.25rem' : '0.125rem', background: 'white' }} />
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured</span>
        </label>
      </Section>

      <Section title="Preview Images">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previews.map((p, i) => (
            <FileUpload key={i} label={`Preview ${i + 1}`} accept="image/*" bucket="previews"
              storagePath={`${slug}-${i + 1}.jpg`} value={p.url}
              onChange={(url, size) => setPreviews(prev => prev.map((x, idx) => idx === i ? { url, size } : x))}
              preview />
          ))}
        </div>
      </Section>

      <Section title="Download Files (ZIP)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OS_CONFIGS.map(cfg => (
            <FileUpload key={cfg.os} label={cfg.label} accept=".zip,application/zip" bucket="downloads"
              storagePath={`${slug}-${cfg.os}.zip`} value={downloads[cfg.os].url}
              onChange={(url, size) => setDownloads(prev => ({ ...prev, [cfg.os]: { url, size } }))} />
          ))}
        </div>
      </Section>

      <div className="flex items-center justify-between pt-2">
        <Link href="/admin" className="text-sm" style={{ color: 'var(--text-muted)' }}>Cancel</Link>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
          style={{ background: 'var(--gold)', color: 'var(--bg-base)', opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
