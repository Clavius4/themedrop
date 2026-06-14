'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, LayoutDashboard, PlusCircle, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/upload', label: 'Upload Theme', icon: PlusCircle },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)' }}>
              <Zap size={15} style={{ color: 'var(--bg-base)' }} strokeWidth={2.5} />
            </div>
            <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>
              ThemeDrop <span style={{ color: 'var(--gold)' }}>Admin</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: active ? 'rgba(200,160,48,0.15)' : 'transparent',
                    color: active ? 'var(--gold)' : 'var(--text-muted)',
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            View Site ↗
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
