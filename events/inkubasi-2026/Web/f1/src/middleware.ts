import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  const date = new Date()
  const day = String(date.getUTCDate()).padStart(2, '0')
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const timestamp = `[${day}/${month}/${year}:${hours}:${minutes}:${seconds} +0000]`

  const method = request.method
  const url = request.nextUrl.pathname
  const status = response.status
  const userAgent = request.headers.get('user-agent') || '-'
  
  const bytes = 512; 

  console.log(`${ip} - - ${timestamp} "${method} ${url} HTTP/1.1" ${status} ${bytes} "-" "${userAgent}"`)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
