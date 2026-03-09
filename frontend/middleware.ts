import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/restaurants', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
