import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Protect authenticated routes
  const protectedRoutes = [
    '/dashboard',
    '/studio',
    '/history',
    '/workflows',
    '/templates',
    '/prompt-guides',
    '/tools/image-composer' // AI Composer requires auth (costs credits)
  ]

  const isProtected = protectedRoutes.some(route => path.startsWith(route))

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/studio/:path*',
    '/history/:path*',
    '/workflows/:path*',
    '/templates/:path*',
    '/prompt-guides/:path*',
    '/tools/:path*',
    '/api/:path*'
  ]
}
