import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'downloads.json')

async function readData(): Promise<Record<string, Record<string, number>>> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, Record<string, number>>) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function POST(req: NextRequest) {
  try {
    const { slug, os } = await req.json()
    if (!slug || !os) return NextResponse.json({ error: 'Missing slug or os' }, { status: 400 })

    const data = await readData()
    if (!data[slug]) data[slug] = {}
    data[slug][os] = (data[slug][os] || 0) + 1

    await writeData(data)

    return NextResponse.json({ success: true, count: data[slug][os] })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}
