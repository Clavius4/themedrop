import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = process.env.ADMIN_TOKEN
  if (!token) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('themedrop-admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('themedrop-admin', '', { maxAge: 0, path: '/' })
  return res
}
