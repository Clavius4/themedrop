'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteThemeButton({ slug, name }: { slug: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/themes/${slug}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) router.refresh()
    else alert('Delete failed')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
      style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Delete
    </button>
  )
}
