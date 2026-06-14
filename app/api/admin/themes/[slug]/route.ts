import { NextResponse } from 'next/server'
import { getTheme, updateTheme, deleteTheme, ThemeInput } from '@/lib/db'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const theme = await getTheme(slug)
  if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(theme)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body: Partial<ThemeInput> = await request.json()
  const { error } = await updateTheme(slug, body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { error } = await deleteTheme(slug)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
