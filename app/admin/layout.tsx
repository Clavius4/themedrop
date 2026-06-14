import type { Metadata } from 'next'
import AdminNav from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: { default: 'Admin — ThemeDrop', template: '%s — Admin' },
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
    </div>
  )
}
