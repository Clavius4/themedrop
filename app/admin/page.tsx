import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Edit2, Trash2, Star, Download, Package } from 'lucide-react'
import { getDBThemes } from '@/lib/db'
import { THEMES } from '@/lib/themes'
import DeleteThemeButton from '@/components/admin/DeleteThemeButton'

export const revalidate = 0

export default async function AdminDashboard() {
  const dbThemes = await getDBThemes()
  const dbSlugs = new Set(dbThemes.map(t => t.slug))
  const staticThemes = THEMES.filter(t => !dbSlugs.has(t.slug))
  const allThemes = [...dbThemes, ...staticThemes]
  const totalDownloads = allThemes.reduce((a, t) => a + t.totalDownloads, 0)

  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--gold)' }}>
            Overview
          </p>
          <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        </div>
        <Link
          href="/admin/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: 'var(--gold)', color: 'var(--bg-base)' }}
        >
          <PlusCircle size={16} />
          Upload Theme
        </Link>
      </div>

      {/* Supabase warning */}
      {!supabaseConfigured && (
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#FBD827' }}>
          <strong>Supabase not configured.</strong> Dynamic theme uploads are disabled. Add{' '}
          <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
            NEXT_PUBLIC_SUPABASE_URL
          </code>,{' '}
          <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>, and{' '}
          <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
            SUPABASE_SERVICE_ROLE_KEY
          </code>{' '}
          to your environment. See <code>scripts/supabase-setup.sql</code> for the schema.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Total Themes', value: allThemes.length },
          { icon: Package, label: 'DB Themes', value: dbThemes.length },
          { icon: Download, label: 'Downloads', value: totalDownloads },
          { icon: Star, label: 'Featured', value: allThemes.filter(t => t.featured).length },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-5 rounded-2xl flex flex-col gap-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <Icon size={15} style={{ color: 'var(--gold)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Theme table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>All Themes</h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{allThemes.length} total</span>
        </div>

        <div style={{ background: 'var(--bg-base)' }}>
          {allThemes.map(theme => {
            const isDB = dbSlugs.has(theme.slug)
            return (
              <div
                key={theme.slug}
                className="flex items-center gap-4 px-6 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {/* Preview */}
                <div
                  className="w-16 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                  style={{ background: theme.color + '33', border: '1px solid var(--border)' }}
                >
                  {theme.previews[0] && (
                    <Image
                      src={theme.previews[0]}
                      alt={theme.name}
                      width={64}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {theme.name}
                    </p>
                    {theme.featured && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(200,160,48,0.2)', color: 'var(--gold)' }}>
                        Featured
                      </span>
                    )}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isDB ? 'rgba(99,102,241,0.15)' : 'rgba(100,100,100,0.15)',
                        color: isDB ? '#818CF8' : 'var(--text-muted)',
                      }}
                    >
                      {isDB ? 'DB' : 'Static'}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {theme.category} · {theme.wallpaperCount} wallpapers · {theme.downloads.length} OS
                  </p>
                </div>

                {/* Downloads */}
                <div className="hidden md:flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Download size={12} />
                  {theme.totalDownloads}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isDB ? (
                    <>
                      <Link
                        href={`/admin/themes/${theme.slug}`}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        <Edit2 size={12} /> Edit
                      </Link>
                      <DeleteThemeButton slug={theme.slug} name={theme.name} />
                    </>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Built-in</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
