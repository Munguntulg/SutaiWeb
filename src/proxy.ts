import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/checkout', '/orders', '/profile'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const routerConfig = {
  matcher: ['/checkout', '/orders/:path*', '/profile'],
};
