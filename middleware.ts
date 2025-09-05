import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, getHSTSHeader } from '@/lib/security';

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle URL redirects first
  // Redirect old calculator URLs to new format
  if (pathname.startsWith('/calculator/')) {
    const calculatorSlug = pathname.replace('/calculator/', '').replace('/', '');
    
    if (calculatorSlug) {
      // Map common calculator slugs to their new URLs
      const redirectMap: { [key: string]: string } = {
        'bmi-calculator': '/health-fitness/body-metrics/bmi-calculator/',
        'mortgage-payment-calculator': '/finance-personal-finance/mortgages/mortgage-payment-calculator/',
        'loan-payment-calculator': '/finance-personal-finance/loans-debt/loan-payment-calculator/',
        'compound-interest-calculator': '/finance-personal-finance/investment-returns/compound-interest-calculator/',
        'percentage-calculator': '/mathematics-science/basic-math/percentage-calculator/',
        'tip-calculator': '/finance-personal-finance/budget-expenses/tip-calculator/',
        'calorie-calculator': '/health-fitness/nutrition-diet/calorie-calculator/',
      };

      if (redirectMap[calculatorSlug]) {
        return NextResponse.redirect(new URL(redirectMap[calculatorSlug], request.url), 301);
      }
    }
  }

  // Redirect old category URLs to new format
  if (pathname.startsWith('/category/')) {
    const categorySlug = pathname.replace('/category/', '').replace('/', '');
    
    if (categorySlug) {
      return NextResponse.redirect(new URL(`/${categorySlug}/`, request.url), 301);
    }
  }

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