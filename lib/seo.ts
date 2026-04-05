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
  '15-vs-30-year-mortgage-comparison': {
    title: '15 vs 30 Year Mortgage Comparison Calculator - Free Online Tool | Calcshark',
    description: 'Compare 15-year and 30-year mortgage payments, total interest, PMI timing, housing cost, and extra-payment scenarios with our free online calculator.',
    keywords: ['15 vs 30 year mortgage calculator', 'mortgage comparison calculator', '15 year mortgage vs 30 year mortgage', 'mortgage term comparison', 'mortgage payment comparison', 'extra payment mortgage calculator'],
  },
  'retirement-savings': {
    title: 'Retirement Savings Calculator - Free Online Nest Egg Tool | Calcshark',
    description: 'Project your retirement nest egg, inflation-adjusted value, and annual income support with our free online retirement savings calculator.',
    keywords: ['retirement savings calculator', 'nest egg calculator', 'retirement planning calculator', 'retirement income support calculator', 'future retirement value', 'retirement readiness tool'],
  },
  '401k': {
    title: '401(k) Calculator - Free Online Employer Match Tool | Calcshark',
    description: 'Estimate 401(k) growth, employer match, 2026 contribution-limit context, and retirement income support with our free calculator.',
    keywords: ['401k calculator', '401(k) calculator', 'employer match calculator', 'retirement plan calculator', '401k contribution calculator', '401k growth calculator'],
  },
  'ira': {
    title: 'IRA Calculator - Free Online Contribution Growth Tool | Calcshark',
    description: 'Project IRA growth, annual contribution use, and retirement income support with our free online IRA calculator.',
    keywords: ['IRA calculator', 'traditional IRA calculator', 'retirement account calculator', 'IRA contribution calculator', 'IRA growth calculator', 'retirement income calculator'],
  },
  'roth-ira-conversion': {
    title: 'Roth IRA Conversion Calculator - Free Online Tax Comparison Tool | Calcshark',
    description: 'Compare conversion tax today with potential after-tax value later using our free Roth IRA conversion calculator.',
    keywords: ['roth ira conversion calculator', 'roth conversion calculator', 'traditional ira to roth calculator', 'roth tax calculator', 'retirement tax planning calculator'],
  },
  'social-security-estimator': {
    title: 'Social Security Estimator Calculator - Free Online Claiming Tool | Calcshark',
    description: 'Estimate a planning-range Social Security benefit using earnings and claim-age assumptions with our free online calculator.',
    keywords: ['social security estimator calculator', 'social security calculator', 'claim age calculator', 'retirement benefit estimator', 'social security planning tool'],
  },
  'retirement-income': {
    title: 'Retirement Income Calculator - Free Online Cash Flow Tool | Calcshark',
    description: 'Blend portfolio withdrawals, Social Security, pension, and other income sources with our free retirement income calculator.',
    keywords: ['retirement income calculator', 'retirement cash flow calculator', 'portfolio withdrawal calculator', 'retirement budget calculator', 'retirement income planning'],
  },
  'catch-up-contribution': {
    title: 'Catch-up Contribution Calculator - Free Online 2026 Limit Tool | Calcshark',
    description: 'Estimate age-based catch-up contribution room for 2026 across workplace plans and IRAs with our free calculator.',
    keywords: ['catch up contribution calculator', '2026 retirement limits', '401k catch up calculator', 'IRA catch up calculator', 'retirement contribution room'],
  },
  'required-minimum-distribution': {
    title: 'RMD Calculator - Free Online Required Minimum Distribution Tool | Calcshark',
    description: 'Estimate your annual required minimum distribution, monthly equivalent, and distribution rate using our free RMD calculator.',
    keywords: ['RMD calculator', 'required minimum distribution calculator', 'retirement distribution calculator', 'IRS RMD calculator', 'uniform lifetime table calculator'],
  },
  'pension': {
    title: 'Pension Calculator - Free Online Benefit Estimate Tool | Calcshark',
    description: 'Estimate pension income from salary, years of service, and multiplier assumptions with our free pension calculator.',
    keywords: ['pension calculator', 'defined benefit calculator', 'pension estimate calculator', 'pension income calculator', 'retirement pension tool'],
  },
  'annuity': {
    title: 'Annuity Calculator - Free Online Retirement Income Tool | Calcshark',
    description: 'Estimate annuity payouts from principal, rate, and payout horizon assumptions with our free annuity calculator.',
    keywords: ['annuity calculator', 'annuity payout calculator', 'retirement annuity calculator', 'monthly annuity payment calculator', 'income annuity estimator'],
  },
  'early-retirement': {
    title: 'Early Retirement Calculator - Free Online FI Timeline Tool | Calcshark',
    description: 'Test whether your savings pace can support an earlier retirement date with our free online early retirement calculator.',
    keywords: ['early retirement calculator', 'financial independence calculator', 'retire early calculator', 'retirement age calculator', 'FI timeline calculator'],
  },
  'fire': {
    title: 'FIRE Calculator - Free Online Financial Independence Tool | Calcshark',
    description: 'Estimate your FIRE number, savings-rate impact, and timeline to financial independence with our free online calculator.',
    keywords: ['FIRE calculator', 'financial independence calculator', 'fire number calculator', 'retire early calculator', 'savings rate calculator'],
  },
  'retirement-withdrawal': {
    title: 'Retirement Withdrawal Calculator - Free Online Sustainability Tool | Calcshark',
    description: 'Project retirement withdrawal sustainability, depletion timing, and inflation pressure with our free online calculator.',
    keywords: ['retirement withdrawal calculator', 'portfolio withdrawal calculator', 'retirement drawdown calculator', 'depletion calculator', 'retirement spending calculator'],
  },
  'life-expectancy': {
    title: 'Life Expectancy Calculator - Free Online Retirement Horizon Tool | Calcshark',
    description: 'Estimate a retirement-planning life expectancy horizon using age and simple longevity adjustments with our free calculator.',
    keywords: ['life expectancy calculator', 'retirement life expectancy calculator', 'longevity calculator', 'retirement horizon calculator', 'planning horizon estimator'],
  },
  'retirement-gap': {
    title: 'Retirement Gap Calculator - Free Online Readiness Tool | Calcshark',
    description: 'Compare projected retirement assets with the portfolio your spending target may require using our free retirement gap calculator.',
    keywords: ['retirement gap calculator', 'retirement shortfall calculator', 'retirement readiness calculator', 'retirement target calculator', 'retirement funding gap'],
  },
  'mortgage-affordability': {
    title: 'Mortgage Affordability Calculator - Free Online Home Budget Tool | Calcshark',
    description: 'Estimate how much house you can afford using income, debts, taxes, insurance, HOA fees, PMI, and monthly payment comfort assumptions.',
    keywords: ['mortgage affordability calculator', 'how much house can i afford', 'home affordability calculator', 'debt to income mortgage calculator', 'house budget calculator', 'housing affordability tool'],
  },
  'mortgage-refinance': {
    title: 'Mortgage Refinance Calculator - Free Online Break-Even Tool | Calcshark',
    description: 'Compare your current mortgage with a refinance scenario using payment savings, closing costs, break-even timing, and long-term interest tradeoffs.',
    keywords: ['mortgage refinance calculator', 'refinance break even calculator', 'mortgage savings calculator', 'refinance payment calculator', 'should i refinance calculator', 'mortgage refinance analysis'],
  },
  'mortgage-amortization': {
    title: 'Mortgage Amortization Calculator - Free Online Payoff Tool | Calcshark',
    description: 'Project your mortgage payment structure, remaining interest, balance milestones, and payoff timing with our free amortization calculator.',
    keywords: ['mortgage amortization calculator', 'amortization schedule calculator', 'mortgage payoff calculator', 'remaining mortgage balance calculator', 'mortgage interest calculator', 'loan amortization tool'],
  },
  'down-payment': {
    title: 'Down Payment Calculator - Free Online Cash-to-Close Tool | Calcshark',
    description: 'See how different down payment amounts affect loan size, monthly housing cost, PMI exposure, and total cash needed to close.',
    keywords: ['down payment calculator', 'cash to close calculator', 'house down payment calculator', 'mortgage down payment calculator', 'PMI down payment calculator', 'home buying calculator'],
  },
  'private-mortgage-insurance-pmi': {
    title: 'PMI Calculator - Free Online Private Mortgage Insurance Tool | Calcshark',
    description: 'Estimate monthly PMI, annual PMI cost, loan-to-value, and potential PMI removal timing with our free online calculator.',
    keywords: ['PMI calculator', 'private mortgage insurance calculator', 'monthly PMI calculator', 'PMI removal calculator', 'mortgage insurance calculator', 'loan to value calculator'],
  },
  'mortgage-points': {
    title: 'Mortgage Points Calculator - Free Online Break-Even Tool | Calcshark',
    description: 'Compare mortgage discount point costs with rate reduction, payment savings, and break-even timing before you buy points.',
    keywords: ['mortgage points calculator', 'discount points calculator', 'buy points calculator', 'mortgage break even calculator', 'loan points calculator', 'rate buydown calculator'],
  },
  'arm-vs-fixed-rate': {
    title: 'ARM vs Fixed Rate Calculator - Free Online Mortgage Comparison Tool | Calcshark',
    description: 'Compare ARM introductory savings, adjusted-rate payment risk, and fixed-rate stability with our free mortgage comparison calculator.',
    keywords: ['ARM vs fixed calculator', 'adjustable rate mortgage calculator', 'fixed rate mortgage calculator', 'ARM payment calculator', 'mortgage comparison tool', 'ARM risk calculator'],
  },
  'extra-payment': {
    title: 'Extra Payment Calculator - Free Online Mortgage Payoff Tool | Calcshark',
    description: 'See how extra mortgage payments can shorten payoff time, reduce interest, and change your long-term repayment path.',
    keywords: ['extra payment calculator', 'mortgage payoff calculator', 'extra principal payment calculator', 'mortgage interest savings calculator', 'early payoff calculator', 'loan prepayment calculator'],
  },
  'bi-weekly-mortgage': {
    title: 'Bi-Weekly Mortgage Calculator - Free Online Payoff Tool | Calcshark',
    description: 'Estimate bi-weekly mortgage payments, payoff acceleration, and interest savings from making half-payments every two weeks.',
    keywords: ['bi weekly mortgage calculator', 'biweekly payment calculator', 'mortgage payoff acceleration', 'extra mortgage payment calculator', 'bi weekly amortization calculator', 'mortgage interest savings'],
  },
  'home-equity': {
    title: 'Home Equity Calculator - Free Online CLTV Tool | Calcshark',
    description: 'Calculate home equity, combined loan-to-value, total secured debt, and available room before taking on new borrowing.',
    keywords: ['home equity calculator', 'equity calculator', 'CLTV calculator', 'combined loan to value calculator', 'house equity calculator', 'home borrowing calculator'],
  },
  'heloc-payment': {
    title: 'HELOC Payment Calculator - Free Online Draw vs Repay Tool | Calcshark',
    description: 'Estimate HELOC draw-period payments, repayment-period payments, and combined leverage with our free online calculator.',
    keywords: ['HELOC payment calculator', 'home equity line of credit calculator', 'HELOC draw payment calculator', 'HELOC repayment calculator', 'HELOC interest calculator', 'home equity loan tool'],
  },
  'closing-cost': {
    title: 'Closing Cost Calculator - Free Online Cash-to-Close Tool | Calcshark',
    description: 'Estimate lender fees, title and settlement costs, prepaids, and total cash needed to close on a home purchase.',
    keywords: ['closing cost calculator', 'cash to close calculator', 'mortgage closing cost calculator', 'home buying closing costs', 'settlement cost calculator', 'title fees calculator'],
  },
  'rent-vs-buy': {
    title: 'Rent vs Buy Calculator - Free Online Housing Decision Tool | Calcshark',
    description: 'Compare renting and buying with stay horizon, appreciation, maintenance, selling costs, and long-term net housing cost analysis.',
    keywords: ['rent vs buy calculator', 'renting vs buying calculator', 'should i rent or buy calculator', 'homeownership cost calculator', 'housing decision calculator', 'buying vs renting analysis'],
  },
  '1-rule': {
    title: '1% Rule Calculator - Free Online Rental Property Screening Tool | Calcshark',
    description: 'Analyze rental-property deals with our free 1% Rule Calculator. Check target rent, gap to 1%, vacancy-adjusted income, debt service, DSCR, and cash-on-cash return in one place.',
    keywords: ['1% rule calculator', 'one percent rule calculator', 'rental property calculator', 'real estate investment calculator', 'rent to price ratio', 'property investment screening'],
  },
  '50-rule': {
    title: '50% Rule Calculator - Free Online Rental Expense Screen Tool | Calcshark',
    description: 'Use our free 50% Rule Calculator to compare the classic rental expense rule against vacancy-adjusted income, itemized operating expenses, debt service, DSCR, and break-even rent.',
    keywords: ['50% rule calculator', '50 percent rule calculator', 'rental property expense calculator', 'real estate investment calculator', 'property investment screening', 'rental operating expense rule'],
  },
  '70-rule': {
    title: '70% Rule Calculator - Free Online Fix and Flip Offer Tool | Calcshark',
    description: 'Use our free 70% Rule Calculator to compare standard and custom MAO, actual offer pricing, projected flip profit, holding costs, financing costs, and break-even sale price.',
    keywords: ['70% rule calculator', '70 percent rule calculator', 'fix and flip calculator', 'maximum allowable offer calculator', 'ARV calculator', 'house flip deal analyzer'],
  },
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
  'cat-age': {
    title: 'Free Online Cat Age Calculator - No Login - 50+ Breeds',
    description: 'Calculate your cat\'s age in human years with our advanced cat age calculator. Uses 2024 scientific research, supports 50+ breeds, includes health assessment and lifestyle analysis. Free and accurate.',
    keywords: [
      'cat age calculator', 'cat years to human years', 'pet age calculator', 'cat human age converter',
      'kitten age calculator', 'cat life expectancy calculator', 'feline age calculator', 'cat years calculator',
      'how old is my cat in human years', 'cat aging calculator', 'pet health calculator', 'cat breed age calculator',
      'cat lifespan calculator', 'cat health assessment', 'feline health calculator', 'cat body condition score',
      'cat weight calculator', 'pet care calculator', 'cat wellness calculator', 'veterinary age calculator',
      'cat aging research', 'epigenetic cat age', 'scientific cat age calculator', 'accurate cat age calculator',
      'indoor cat age', 'outdoor cat age', 'purebred cat lifespan', 'mixed breed cat age'
    ],
  },
  'cooldown-reduction': {
    title: 'Free Online Cooldown Reduction Calculator - No Login - Calcshark',
    description: 'Advanced cooldown reduction calculator for League of Legends, Dota 2, WoW, Diablo 4, and more. Calculate CDR, optimize builds, and master skill rotations. Free gaming tool.',
    keywords: [
      'cooldown reduction calculator', 'CDR calculator', 'gaming calculator', 'ability haste calculator',
      'league of legends CDR', 'dota 2 cooldown', 'wow haste calculator', 'diablo 4 CDR',
      'path of exile cooldown', 'skill rotation optimizer', 'gaming build calculator', 'CDR efficiency',
      'ability cooldown calculator', 'gaming optimization tool', 'MOBA calculator', 'RPG calculator',
      'skill calculator', 'gaming performance tool', 'cooldown optimizer', 'game mechanics calculator',
      'esports calculator', 'gaming math', 'CDR build optimizer', 'cooldown timer calculator'
    ],
  },
  'crop-rotation': {
    title: 'Free Online Crop Rotation Calculator - No Login - Garden Planner',
    description: 'Advanced crop rotation calculator with plant families, companion planting, succession schedules, and soil management. Plan multi-year rotations for maximum garden productivity.',
    keywords: [
      'crop rotation calculator', 'garden rotation planner', 'succession planting calculator', 'companion planting guide',
      'plant family rotation', 'soil management calculator', 'vegetable garden planner', 'organic gardening tool',
      'brassicas rotation', 'nightshades rotation', 'legumes planting', 'garden bed planner',
      'soil amendment calculator', 'cover crop planner', 'garden planning tool', 'sustainable gardening',
      'square foot garden planner', 'harvest scheduling', 'garden yield optimizer', 'permaculture planner',
      'organic farming calculator', 'home garden planner', 'vegetable succession planting', 'garden design tool'
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
      ratingCount: '7',
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
