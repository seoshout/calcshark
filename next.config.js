/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    domains: ['calcshark.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://vercel.live https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          // HSTS - HTTP Strict Transport Security
          // Only applies when served over HTTPS
          {
            key: 'Strict-Transport-Security',
            value: process.env.NODE_ENV === 'production' 
              ? 'max-age=63072000; includeSubDomains; preload' // 2 years in production
              : 'max-age=31536000; includeSubDomains' // 1 year in development (no preload)
          }
        ]
      }
    ];
  },

  // Redirects for security and legacy URLs
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://calcshark.com/:path*',
        permanent: true,
      },
      // Redirect old calculator URL format to new nested format
      {
        source: '/calculator/spayneuter-cost-calculator',
        destination: '/pet-care/pet-health-nutrition/spayneuter-cost-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/spayneuter-cost-calculator/',
        destination: '/pet-care/pet-health-nutrition/spayneuter-cost-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/tire-life-calculator',
        destination: '/automotive-transportation/maintenance-parts/tire-life-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/tire-life-calculator/',
        destination: '/automotive-transportation/maintenance-parts/tire-life-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/dps-calculator',
        destination: '/gaming-entertainment/gaming-performance/dps-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/dps-calculator/',
        destination: '/gaming-entertainment/gaming-performance/dps-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/smart-thermostat-savings-calculator',
        destination: '/environmental-sustainability/energy-utilities/smart-thermostat-savings-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/smart-thermostat-savings-calculator/',
        destination: '/environmental-sustainability/energy-utilities/smart-thermostat-savings-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/oil-change-interval-calculator',
        destination: '/automotive-transportation/maintenance-parts/oil-change-interval-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/oil-change-interval-calculator/',
        destination: '/automotive-transportation/maintenance-parts/oil-change-interval-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/breastmilk-storage-calculator',
        destination: '/pregnancy-parenting/baby-child-development/breastmilk-storage-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/breastmilk-storage-calculator/',
        destination: '/pregnancy-parenting/baby-child-development/breastmilk-storage-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/cat-age-calculator',
        destination: '/pet-care/pet-health-nutrition/cat-age-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/cat-age-calculator/',
        destination: '/pet-care/pet-health-nutrition/cat-age-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/crop-rotation-calculator',
        destination: '/gardening-landscaping/garden-planning/crop-rotation-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/crop-rotation-calculator/',
        destination: '/gardening-landscaping/garden-planning/crop-rotation-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/pond-volume-calculator',
        destination: '/gardening-landscaping/lawn-landscaping/pond-volume-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/pond-volume-calculator/',
        destination: '/gardening-landscaping/lawn-landscaping/pond-volume-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/wedding-alcohol-calculator',
        destination: '/wedding-events/wedding-planning/wedding-alcohol-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/wedding-alcohol-calculator/',
        destination: '/wedding-events/wedding-planning/wedding-alcohol-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/loan-payment-calculator',
        destination: '/finance-personal-finance/loans-debt/loan-payment-calculator/',
        permanent: true,
      },
      {
        source: '/calculator/loan-payment-calculator/',
        destination: '/finance-personal-finance/loans-debt/loan-payment-calculator/',
        permanent: true,
      },
    ];
  },

  // Optimize production build
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // Better HTML output formatting
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Cleaner development output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  
  // Development configuration for cleaner HTML
  ...(process.env.NODE_ENV === 'development' ? {
    compress: false,
  } : {
    compress: true,
  }),
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
