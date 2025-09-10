import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCalculatorByNestedSlug, getCategoryBySlug, getSubcategoryBySlug } from '@/lib/calculator-categories';
import BMICalculator from './calculators/BMICalculator';
import AdvancedBMICalculator from './calculators/AdvancedBMICalculator';
import CalculatorLayout from './components/CalculatorLayout';
import { generateSoftwareSchema, generateBreadcrumbSchema } from '@/lib/schemas';
import { calculatorSEO } from '@/lib/seo';

interface CalculatorPageProps {
  params: {
    category: string;
    subcategory: string;
    calculator: string;
  };
}

// Generate metadata dynamically based on calculator
export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const calculator = getCalculatorByNestedSlug(params.category, params.subcategory, params.calculator);
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found | Calcshark',
      description: 'The calculator you are looking for could not be found.',
    };
  }

  const category = getCategoryBySlug(params.category);
  const subcategory = getSubcategoryBySlug(params.category, params.subcategory);
  
  // Get specific SEO data if available, otherwise use defaults
  const slug = calculator.slug.replace('-calculator', '');
  const seoData = calculatorSEO[slug as keyof typeof calculatorSEO];
  
  const title = seoData?.title || `Free Online ${calculator.name} - No Sign Up - No Login Required | Calcshark`;
  const description = seoData?.description || `${calculator.description}. Free Online ${calculator.name} - instant, accurate, and completely free to use. No registration required.`;
  const keywords = seoData?.keywords || [`free ${calculator.name.toLowerCase()}`, ...calculator.tags, 'online calculator', 'free calculator tool', 'no registration'];
  
  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    openGraph: {
      title,
      description,
      url: `https://calcshark.com/${params.category}/${params.subcategory}/${calculator.slug}/`,
      type: 'website',
      images: [
        {
          url: `https://calcshark.com/og-calculator-${calculator.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: calculator.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://calcshark.com/og-calculator-${calculator.slug}.jpg`],
      creator: '@calcshark',
      site: '@calcshark',
    },
    alternates: {
      canonical: `https://calcshark.com/${params.category}/${params.subcategory}/${calculator.slug}/`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'theme-color': '#8b5cf6',
      'apple-mobile-web-app-title': `${calculator.name} | Calcshark`,
    },
  };
}

// Import calculators
import AdvancedCompoundInterestCalculator from './calculators/AdvancedCompoundInterestCalculator';
import AdvancedMortgageCalculator from './calculators/AdvancedMortgageCalculator';
import AdvancedLoanPaymentCalculator from './calculators/AdvancedLoanPaymentCalculator';

// This would ideally be generated from a CMS or database
const calculatorComponents: { [key: string]: React.ComponentType<any> } = {
  'bmi-calculator': AdvancedBMICalculator, // Use the advanced version
  'basic-bmi-calculator': BMICalculator,   // Keep basic version available
  'compound-interest-calculator': AdvancedCompoundInterestCalculator,
  'mortgage-payment-calculator': AdvancedMortgageCalculator,
  'loan-payment-calculator': AdvancedLoanPaymentCalculator,
  // Add more calculators as we create them
  // etc.
};

export default function CalculatorPage({ params }: CalculatorPageProps) {
  const calculator = getCalculatorByNestedSlug(params.category, params.subcategory, params.calculator);
  
  if (!calculator) {
    notFound();
  }

  const category = getCategoryBySlug(params.category);
  const subcategory = getSubcategoryBySlug(params.category, params.subcategory);
  const CalculatorComponent = calculatorComponents[calculator.slug];

  // Generate schemas
  const softwareSchema = generateSoftwareSchema(
    calculator.name,
    calculator.description,
    category?.name || 'Calculator'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category?.name || 'Category', url: `/${params.category}/` },
    { name: subcategory?.name || 'Subcategory', url: `/${params.category}/${params.subcategory}/` },
    { name: calculator.name, url: `/${params.category}/${params.subcategory}/${calculator.slug}/` }
  ]);
  
  // If we haven't implemented this calculator yet, show a coming soon message
  if (!CalculatorComponent) {
    return (
      <CalculatorLayout calculator={calculator} category={category}>
        {/* Software Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
          <div className="bg-background border rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                This calculator is currently under development. We're working hard to bring you the best calculation experience.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>In the meantime, you can:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Browse our <a href="/popular/" className="text-primary hover:underline">popular calculators</a></li>
                  <li>Explore the <a href={`/${params.category}/`} className="text-primary hover:underline">{category?.name}</a> category</li>
                  <li>View <a href="/all-online-calculators/" className="text-primary hover:underline">all available calculators</a></li>
                </ul>
              </div>
            </div>
          </div>
        </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout calculator={calculator} category={category}>
      {/* Software Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <CalculatorComponent />
    </CalculatorLayout>
  );
}