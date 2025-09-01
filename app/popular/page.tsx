import Link from 'next/link';
import { ChevronRight, Star, Calculator, TrendingUp, Heart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculatorCategories, getAllCalculators, popularCalculators } from '@/lib/calculator-categories';

export const metadata = {
  title: 'Popular Calculators - Most Used Online Calculators | Calcverse',
  description: 'Discover the most popular and frequently used calculators on Calcverse. From BMI and mortgage calculators to GPA and percentage calculators.',
  keywords: 'popular calculators, most used calculators, trending calculators, BMI calculator, mortgage calculator, GPA calculator',
  openGraph: {
    title: 'Popular Calculators - Most Used Online Calculators',
    description: 'Discover the most popular and frequently used calculators on Calcverse.',
    url: '/popular',
  }
};

export default function PopularCalculatorsPage() {
  // Get all calculators and filter for popular ones
  const allCalculators = getAllCalculators();
  const popularCalcs = allCalculators.filter(calc => calc.popular);
  
  // Get category data for each popular calculator
  const popularWithCategories = popularCalcs.map(calc => {
    const category = calculatorCategories.find(cat => cat.slug === calc.category);
    return {
      ...calc,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || 'from-blue-500 to-purple-600'
    };
  });

  // Group popular calculators by category for better organization
  const groupedByCategory = popularWithCategories.reduce((acc, calc) => {
    if (!acc[calc.category]) {
      acc[calc.category] = {
        name: calc.categoryName,
        color: calc.categoryColor,
        calculators: []
      };
    }
    acc[calc.category].calculators.push(calc);
    return acc;
  }, {} as Record<string, any>);

  const iconMap: { [key: string]: any } = {
    'DollarSign': DollarSign,
    'Calculator': Calculator,
    'Heart': Heart,
    'TrendingUp': TrendingUp,
  };

  const getIconForCalculator = (calculatorName: string) => {
    if (calculatorName.toLowerCase().includes('mortgage') || calculatorName.toLowerCase().includes('loan') || calculatorName.toLowerCase().includes('finance')) {
      return DollarSign;
    }
    if (calculatorName.toLowerCase().includes('bmi') || calculatorName.toLowerCase().includes('health')) {
      return Heart;
    }
    if (calculatorName.toLowerCase().includes('investment') || calculatorName.toLowerCase().includes('return')) {
      return TrendingUp;
    }
    return Calculator;
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
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Popular Calculators</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-orange-50 to-yellow-50 dark:from-primary/10 dark:via-orange-900/20 dark:to-yellow-900/20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Most Popular
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Popular
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"> Calculators</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the most frequently used calculators by millions of users. These are the essential tools that help people make important calculations every day.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                <span>{popularCalcs.length} Popular Calculators</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-orange-500" />
                <span>Most Used Tools</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-orange-500" />
                <span>User Favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Calculators Grid */}
      <div className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularCalcs.map((calculator, index) => {
            const IconComponent = getIconForCalculator(calculator.name);
            const category = calculatorCategories.find(cat => cat.slug === calculator.category);
            
            return (
              <Link
                key={calculator.id}
                href={`/calculator/${calculator.slug}`}
                className="group relative p-6 bg-background border rounded-xl hover:shadow-lg transition-all duration-200 hover:border-primary/50 hover:-translate-y-1"
              >
                {/* Popular Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Popular
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-lg bg-gradient-to-br",
                    category?.color || 'from-blue-500 to-purple-600'
                  )}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {calculator.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {calculator.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {category?.name || 'Calculator'}
                  </span>
                  <div className="flex items-center text-xs text-orange-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Trending</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories with Popular Calculators */}
      <div className="bg-muted/30">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the most popular calculators organized by category to find exactly what you need.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedByCategory).map(([categorySlug, categoryData]) => (
              <div key={categorySlug} className="bg-background rounded-xl p-6 border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", categoryData.color)}>
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{categoryData.name}</h3>
                </div>
                
                <div className="space-y-3">
                  {categoryData.calculators.slice(0, 3).map((calc: any) => (
                    <Link
                      key={calc.id}
                      href={`/calculator/${calc.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {calc.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                  
                  {categoryData.calculators.length > 3 && (
                    <Link
                      href={`/category/${categorySlug}`}
                      className="flex items-center text-sm text-primary hover:underline mt-2"
                    >
                      View all {categoryData.calculators.length} popular calculators
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Browse all {allCalculators.length}+ calculators across 17 categories to find the perfect tool for your needs.
          </p>
          <Link
            href="/all-online-calculators"
            className="inline-flex items-center px-6 py-3 bg-background text-primary rounded-lg hover:bg-background/90 transition-colors font-medium"
          >
            View All Calculators
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}