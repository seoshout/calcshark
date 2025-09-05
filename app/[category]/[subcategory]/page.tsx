import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getSubcategoryBySlug, getCalculatorURL } from '@/lib/calculator-categories';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Star, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  const subcategory = getSubcategoryBySlug(params.category, params.subcategory);
  
  if (!category || !subcategory) {
    return {
      title: 'Page Not Found | Calcshark',
      description: 'The page you are looking for could not be found.',
    };
  }

  const title = `${subcategory.name} Calculators - ${category.name} | Calcshark`;
  const description = `${subcategory.description}. Explore our collection of ${subcategory.calculators.length} professional ${subcategory.name.toLowerCase()} calculators.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://calcshark.com/${category.slug}/${subcategory.slug}/`,
      type: 'website',
    },
    alternates: {
      canonical: `https://calcshark.com/${category.slug}/${subcategory.slug}/`,
    },
  };
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  const subcategory = getSubcategoryBySlug(params.category, params.subcategory);
  
  if (!category || !subcategory) {
    notFound();
  }

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link 
              href={`/${category.slug}/`} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{subcategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {subcategory.name} Calculators
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              {subcategory.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-primary" />
                <span>{subcategory.calculators.length} Calculators</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculators Grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategory.calculators.map((calculator) => (
            <Card key={calculator.slug} className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {calculator.popular && (
                          <div className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Popular
                          </div>
                        )}
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getBadgeColor(calculator.difficulty))}>
                          {calculator.difficulty.charAt(0).toUpperCase() + calculator.difficulty.slice(1)}
                        </span>
                      </div>
                      
                      <h2 className="text-lg font-semibold mb-2">
                        <Link 
                          href={getCalculatorURL(calculator)}
                          className="hover:text-primary transition-colors"
                        >
                          {calculator.name}
                        </Link>
                      </h2>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {calculator.description}
                      </p>
                    </div>
                  </div>
                  
                  {calculator.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {calculator.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {calculator.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                          +{calculator.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <Link
                    href={getCalculatorURL(calculator)}
                    className="inline-flex items-center text-sm text-primary hover:underline font-medium"
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Use Calculator
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {subcategory.calculators.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Calculators Yet</h3>
            <p className="text-muted-foreground">
              We're working on adding calculators to this category. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}