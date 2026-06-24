import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { slug, os } = await req.json()
  if (!slug || !os) return NextResponse.json({ error: 'Missing slug or os' }, { status: 400 })
  return NextResponse.json({ success: true, count: 0 })
}

export async function GET() {
  return NextResponse.json({})
}
