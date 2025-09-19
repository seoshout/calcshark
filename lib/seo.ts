import { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function generateMetadata({
  title,
  description,
  canonical,
  keywords = [],
  ogImage = '/og-default.jpg',
  noIndex = false,
}: SEOProps): Metadata {
  const siteName = 'Calcshark';
  const siteUrl = 'https://calcshark.com';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    
    // Favicon and icons
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180' },
      ],
      shortcut: '/favicon.ico',
    },
    
    // Web App Manifest
    manifest: '/manifest.json',
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || siteUrl,
      siteName,
      images: [
        {
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${siteUrl}${ogImage}`],
      creator: '@calcshark',
      site: '@calcshark',
    },
    
    // Canonical URL and alternates
    alternates: {
      canonical: canonical || siteUrl,
      languages: {
        'x-default': siteUrl,
        'en': siteUrl,
        'hi': `${siteUrl}/hi/`,
      },
    },
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Additional meta tags
    authors: [{ name: 'Calcshark Team' }],
    creator: 'Calcshark',
    publisher: 'Calcshark',
    category: 'Calculators',
    
    // Verification
    verification: {
      google: 'your-google-site-verification',
      yandex: 'your-yandex-verification',
      yahoo: 'your-yahoo-site-verification',
    },
    
    // Additional metadata
    other: {
      'theme-color': '#8b5cf6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'application-name': 'Calcshark',
      'apple-mobile-web-app-title': 'Calcshark',
    },
  };
}

export const defaultSEO: SEOProps = {
  title: 'Calcshark - The Ultimate Calculator Collection',
  description: 'Discover 898+ free online calculators for finance, health, construction, education, business, and more. Fast, accurate, and easy-to-use tools for all your calculation needs.',
  keywords: [
    'calculators',
    'online calculator',
    'free calculator',
    'financial calculator',
    'mortgage calculator',
    'loan calculator',
    'health calculator',
    'BMI calculator',
    'math calculator',
    'construction calculator',
    'business calculator',
    'percentage calculator',
    'compound interest calculator',
    'calcshark'
  ],
};

export const calculatorSEO = {
  mortgage: {
    title: 'Mortgage Payment Calculator - Free Online Tool',
    description: 'Calculate your monthly mortgage payments with our free online mortgage calculator. Includes principal, interest, taxes, and insurance (PITI). Get accurate results instantly.',
    keywords: ['mortgage calculator', 'home loan calculator', 'monthly payment calculator', 'PITI calculator', 'mortgage payment'],
  },
  bmi: {
    title: 'Free BMI Calculator - Body Mass Index Calculator Online | Calcshark',
    description: 'Calculate your Body Mass Index (BMI) instantly with our free online BMI calculator. Get accurate results for both metric and imperial units. Includes health recommendations, BMI categories, and detailed analysis. No registration required.',
    keywords: [
      'BMI calculator', 'body mass index calculator', 'free BMI calculator', 'online BMI calculator',
      'BMI checker', 'weight calculator', 'health calculator', 'obesity calculator', 'BMI chart',
      'body mass index checker', 'BMI scale', 'BMI categories', 'underweight calculator',
      'overweight calculator', 'obesity BMI', 'healthy weight calculator', 'BMI metric imperial',
      'BMI kg cm', 'BMI lbs feet inches', 'WHO BMI calculator', 'adult BMI calculator'
    ],
  },
  loan: {
    title: 'Loan Payment Calculator - Monthly Payment Calculator',
    description: 'Calculate your monthly loan payments with our free loan calculator. Works for auto loans, personal loans, student loans, and more. Get payment schedules and total interest.',
    keywords: ['loan calculator', 'monthly payment calculator', 'auto loan calculator', 'personal loan calculator', 'loan payment'],
  },
  percentage: {
    title: 'Percentage Calculator - Calculate Percentages Online',
    description: 'Calculate percentages, percentage increase/decrease, percentage of a number, and percentage difference with our free online percentage calculator.',
    keywords: ['percentage calculator', 'percent calculator', 'percentage increase', 'percentage decrease', 'percentage change'],
  },
  'dog-age': {
    title: 'Free Online Dog Age Calculator - No Login - 189 Breeds',
    description: 'Calculate your dog\'s age in human years with our advanced dog age calculator. Uses 2025 scientific research, supports 189 breeds, includes health assessment and life expectancy analysis. Free and accurate.',
    keywords: [
      'dog age calculator', 'dog years to human years', 'pet age calculator', 'dog human age converter',
      'puppy age calculator', 'dog life expectancy calculator', 'canine age calculator', 'dog years calculator',
      'how old is my dog in human years', 'dog aging calculator', 'pet health calculator', 'dog breed age calculator',
      'dog lifespan calculator', 'dog health assessment', 'canine health calculator', 'dog body condition score',
      'dog weight calculator', 'pet care calculator', 'dog wellness calculator', 'veterinary age calculator',
      'dog aging project', 'epigenetic dog age', 'scientific dog age calculator', 'accurate dog age calculator'
    ],
  },
};

export function generateCalculatorStructuredData(calculator: {
  name: string;
  description: string;
  category: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    description: calculator.description,
    category: calculator.category,
    url: calculator.url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    permissions: 'No special permissions required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Calcshark',
    url: 'https://calcshark.com',
    logo: 'https://calcshark.com/logo.png',
    description: 'The ultimate collection of free online calculators for all your calculation needs.',
    sameAs: [
      'https://twitter.com/calcshark',
      'https://github.com/calcshark',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@calcshark.com',
      availableLanguage: 'English',
    },
  };
}