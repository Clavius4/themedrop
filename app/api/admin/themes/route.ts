import { NextResponse } from 'next/server'
import { getDBThemes, createTheme, ThemeInput } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  const themes = await getDBThemes()
  return NextResponse.json(themes)
}

export async function POST(request: Request) {
  const body: ThemeInput = await request.json()

  if (!body.slug || !body.name) {
    return NextResponse.json({ error: 'slug and name are required' }, { status: 400 })
  }

  const { error } = await createTheme(body)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
