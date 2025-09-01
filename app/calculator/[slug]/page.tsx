import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCalculatorBySlug, getCategoryBySlug } from '@/lib/calculator-categories';
import BMICalculator from './calculators/BMICalculator';
import CalculatorLayout from './components/CalculatorLayout';

interface CalculatorPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata dynamically based on calculator
export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const calculator = getCalculatorBySlug(params.slug);
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found | Calcverse',
      description: 'The calculator you are looking for could not be found.',
    };
  }

  const category = getCategoryBySlug(calculator.category);
  
  return {
    title: `Free Online ${calculator.name} - No Sign Up - No Login Required | Calcverse`,
    description: `${calculator.description}. Free Online ${calculator.name} - instant, accurate, and completely free to use. No registration required.`,
    keywords: `free ${calculator.name.toLowerCase()}, ${calculator.tags.join(', ')}, online calculator, free calculator tool, no registration`,
    openGraph: {
      title: `Free Online ${calculator.name} - No Sign Up Required`,
      description: `${calculator.description}. Free and instant calculations with no registration required.`,
      url: `/calculator/${calculator.slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `/calculator/${calculator.slug}`,
    },
  };
}

// This would ideally be generated from a CMS or database
const calculatorComponents: { [key: string]: React.ComponentType<any> } = {
  'bmi-calculator': BMICalculator,
  // Add more calculators as we create them
  // 'mortgage-payment-calculator': MortgageCalculator,
  // 'loan-payment-calculator': LoanCalculator,
  // etc.
};

export default function CalculatorPage({ params }: CalculatorPageProps) {
  const calculator = getCalculatorBySlug(params.slug);
  
  if (!calculator) {
    notFound();
  }

  const category = getCategoryBySlug(calculator.category);
  const CalculatorComponent = calculatorComponents[calculator.slug];
  
  // If we haven't implemented this calculator yet, show a coming soon message
  if (!CalculatorComponent) {
    return (
      <CalculatorLayout calculator={calculator} category={category}>
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
                <li>Browse our <a href="/popular" className="text-primary hover:underline">popular calculators</a></li>
                <li>Explore the <a href={`/category/${calculator.category}`} className="text-primary hover:underline">{category?.name}</a> category</li>
                <li>View <a href="/all-online-calculators" className="text-primary hover:underline">all available calculators</a></li>
              </ul>
            </div>
          </div>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout calculator={calculator} category={category}>
      <CalculatorComponent />
    </CalculatorLayout>
  );
}