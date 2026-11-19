import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard': ['administrator', 'supervisor', 'viewer'],
  '/live-monitoring': ['administrator', 'supervisor', 'viewer'],
  '/alerts': ['administrator', 'supervisor', 'viewer'],
  '/event-logs': ['administrator', 'supervisor', 'viewer'],
  '/reports': ['administrator', 'supervisor', 'viewer'],
  '/cameras': ['administrator', 'supervisor'],
  '/zones': ['administrator', 'supervisor'],
  '/users': ['administrator'],
  '/settings': ['administrator'],
};

function decodeTokenPayload(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  let token: string | null = null;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    const cookieToken =
      request.cookies.get('texvision_auth_token')?.value ||
      request.cookies.get('token')?.value ||
      null;
    token = cookieToken;
  }

  const isAuthenticated = !!token;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Redirect authenticated users away from login
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login (except public paths like /login)
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const payload = token ? decodeTokenPayload(token) : null;
  const userRole = payload?.role || null;

  const allowedRoles = ROLE_ROUTES[pathname];
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
