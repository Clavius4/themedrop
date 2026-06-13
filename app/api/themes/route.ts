import { NextResponse } from 'next/server'
import { THEMES } from '@/lib/themes'

export async function GET() {
  return NextResponse.json(THEMES)
}
