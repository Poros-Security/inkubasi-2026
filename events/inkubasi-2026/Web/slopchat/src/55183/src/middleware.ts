import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const method = request.method;
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '-';
  
  const date = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${months[date.getMonth()]}/${date.getFullYear()}:${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} +0000`;

  console.log(`${ip} - - [${formattedDate}] "${method} ${path} HTTP/1.1" 200 - "-" "${userAgent}"`);

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
