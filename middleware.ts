import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const cookie = request.cookies.get('themedrop-admin')
  const token = process.env.ADMIN_TOKEN

  if (!cookie || !token || cookie.value !== token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }
