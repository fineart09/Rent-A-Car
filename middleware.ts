import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ เพิ่ม pathname === '/signin' เข้าไปในเงื่อนไข เพื่อไม่ให้หน้าล็อกอินโดนรีไดเรกต์วนลูป
  if (
    pathname === '/signin' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // 💡 ป้องกันเพิ่มเติม: ถ้ามีโทเคนแล้ว แต่ดันพยายามจะเข้าหน้า /signin ให้เด้งไปหน้าหลัก (เช่น /dashboard)
  if (token && pathname === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!token) {
    const signInUrl = new URL('/signin', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // TODO: add role-based checks per-path here

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
}
