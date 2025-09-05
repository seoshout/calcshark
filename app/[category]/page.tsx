import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getCalculatorURL } from '@/lib/calculator-categories';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Users, TrendingUp } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found | Calcshark',
      description: 'The category you are looking for could not be found.',
    };
  }

  const title = `${category.name} Calculators - Free Online Tools | Calcshark`;
  const description = `${category.description}. Browse our comprehensive collection of ${category.name.toLowerCase()} calculators and tools.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://calcshark.com/${category.slug}/`,
      type: 'website',
    },
    alternates: {
      canonical: `https://calcshark.com/${category.slug}/`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }

  const totalCalculators = category.subcategories.reduce((total, sub) => total + sub.calculators.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {category.name} Calculators
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {category.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                <span>{totalCalculators} Calculators</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                <span>Updated Regularly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((subcategory) => (
            <Card key={subcategory.slug} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link 
                      href={`/${category.slug}/${subcategory.slug}/`}
                      className="hover:text-primary transition-colors"
                    >
                      {subcategory.name}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {subcategory.description}
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    {subcategory.calculators.length} calculators available
                  </div>
                </div>

                {/* Show first few calculators */}
                <div className="space-y-2">
                  {subcategory.calculators.slice(0, 4).map((calculator) => (
                    <Link
                      key={calculator.slug}
                      href={getCalculatorURL(calculator)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      • {calculator.name}
                    </Link>
                  ))}
                  {subcategory.calculators.length > 4 && (
                    <Link
                      href={`/${category.slug}/${subcategory.slug}/`}
                      className="block text-sm text-primary hover:underline"
                    >
                      + {subcategory.calculators.length - 4} more calculators
                    </Link>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/${category.slug}/${subcategory.slug}/`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View all {subcategory.name.toLowerCase()} calculators →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}