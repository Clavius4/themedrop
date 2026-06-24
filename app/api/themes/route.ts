import { NextResponse } from 'next/server'
import { getThemes } from '@/lib/db'

export const runtime = 'edge'
export const revalidate = 60

export async function GET() {
  const themes = await getThemes()
  return NextResponse.json(themes)
}
