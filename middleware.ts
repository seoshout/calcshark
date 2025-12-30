import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, getHSTSHeader } from '@/lib/security';

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPath = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // Handle URL redirects first
  // Redirect old calculator URLs to new format
  if (normalizedPath.startsWith('/calculator/')) {
    const calculatorSlugPath = normalizedPath.replace('/calculator/', '');
    const slugKey = calculatorSlugPath.replace(/\//g, '');

    if (calculatorSlugPath) {
      // Map common calculator slugs to their new URLs
      const redirectMap: { [key: string]: string } = {
        'bmi-calculator': '/health-fitness/body-metrics/bmi-calculator/',
        'mortgage-payment-calculator': '/finance-personal-finance/mortgages/mortgage-payment-calculator/',
        'loan-payment-calculator': '/finance-personal-finance/loans-debt/loan-payment-calculator/',
        'compound-interest-calculator': '/finance-personal-finance/loans-debt/compound-interest-calculator/',
        'percentage-calculator': '/mathematics-science/basic-math/percentage-calculator/',
        'tip-calculator': '/lifestyle-daily-life/shopping-savings/tip-calculator/',
        'calorie-calculator': '/health-fitness/nutrition-diet/calorie-calculator/',
        'bmi': '/health-fitness/body-metrics/bmi-calculator/',
        'mortgage-payment': '/finance-personal-finance/mortgages/mortgage-payment-calculator/',
        'loan-payment': '/finance-personal-finance/loans-debt/loan-payment-calculator/',
        'compound-interest': '/finance-personal-finance/loans-debt/compound-interest-calculator/',
        'percentage': '/mathematics-science/basic-math/percentage-calculator/',
        'tip': '/lifestyle-daily-life/shopping-savings/tip-calculator/',
        'private-mortgage-insurance-(pmi)-calculator': '/finance-personal-finance/mortgages/private-mortgage-insurance-pmi-calculator/',
        '401(k)-calculator': '/finance-personal-finance/retirement/401k-calculator/',
        'passfail-calculator': '/education-academic/test-preparation/passfail-calculator/',
        'truefalse-score-calculator': '/education-academic/test-preparation/truefalse-score-calculator/',
        'ab-test-calculator': '/business-professional/sales-marketing/ab-test-calculator/',
        'skisnowboard-size-calculator': '/sports-recreation/outdoor-activities/skisnowboard-size-calculator/',
        'maternitypaternity-leave-budget-calculator': '/pregnancy-parenting/family-planning/maternitypaternity-leave-budget-calculator/',
      };

      if (redirectMap[calculatorSlugPath]) {
        return NextResponse.redirect(new URL(redirectMap[calculatorSlugPath], request.url), 301);
      }

      if (redirectMap[slugKey]) {
        return NextResponse.redirect(new URL(redirectMap[slugKey], request.url), 301);
      }
    }
  }

  // Redirect legacy category structure
  if (normalizedPath === '/finance-business/loans-mortgages/mortgage-payment-calculator') {
    return NextResponse.redirect(
      new URL('/finance-personal-finance/mortgages/mortgage-payment-calculator/', request.url),
      301
    );
  }

  if (normalizedPath === '/health-fitness/fitness-exercise/tdee-calculator') {
    return NextResponse.redirect(
      new URL('/health-fitness/nutrition-diet/tdee-calculator/', request.url),
      301
    );
  }

  // Redirect old category URLs to new format
  if (normalizedPath.startsWith('/category/')) {
    const categorySlug = normalizedPath.replace('/category/', '').replace('/', '');

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

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
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

  if (blockedPaths.some((path) => pathname.startsWith(path))) {
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

    if (!allowedContentTypes.some((type) => contentType.includes(type))) {
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
