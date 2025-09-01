import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, getHSTSHeader } from '@/lib/security';

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get client IP for rate limiting
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!rateLimiter.isAllowed(ip, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }), 
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW_MS).toISOString(),
          },
        }
      );
    }
  }
  
  // Security headers (additional layer on top of next.config.js)
  response.headers.set('X-Robots-Tag', 'index, follow');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // HSTS header - force HTTPS (environment-aware)
  response.headers.set('Strict-Transport-Security', getHSTSHeader());
  
  // Additional security headers
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Block requests with suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /burpsuite/i,
    /dirb/i,
    /dirbuster/i,
    /gobuster/i,
    /masscan/i,
    /nmap/i,
    /zap/i,
    /acunetix/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block requests to sensitive paths
  const pathname = request.nextUrl.pathname;
  const blockedPaths = [
    '/.env',
    '/wp-admin',
    '/admin',
    '/phpmyadmin',
    '/mysql',
    '/config',
    '/backup',
    '/.git',
    '/node_modules',
  ];
  
  if (blockedPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // Validate content type for POST requests
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    const allowedContentTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain',
    ];
    
    if (!allowedContentTypes.some(type => contentType.includes(type))) {
      return new NextResponse('Unsupported Media Type', { status: 415 });
    }
  }
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, robots.txt, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};