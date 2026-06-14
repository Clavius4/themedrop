'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Login failed')
        return
      }
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold)' }}>
            <Zap size={18} style={{ color: 'var(--bg-base)' }} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl" style={{ color: 'var(--text-primary)' }}>
            Theme<span style={{ color: 'var(--gold)' }}>Drop</span>{' '}
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Admin</span>
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--gold)' }}>
              Admin Portal
            </p>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Sign in</h1>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-opacity"
            style={{
              background: 'var(--gold)',
              color: 'var(--bg-base)',
              opacity: loading || !password ? 0.6 : 1,
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
