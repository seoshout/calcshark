'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Calculator, Search, Filter, Grid3X3, List, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculatorCategories, getAllCalculators, getCategoryBySlug, getCalculatorURL } from '@/lib/calculator-categories';
import { generateBreadcrumbSchema } from '@/lib/schemas';

// Icon mapping for different calculator types
const getCalculatorIcon = (calculatorName: string, categorySlug: string) => {
  const name = calculatorName.toLowerCase();
  const category = categorySlug.toLowerCase();
  
  if (name.includes('mortgage') || name.includes('loan') || category.includes('finance')) {
    return '💰';
  }
  if (name.includes('bmi') || name.includes('health') || name.includes('fitness')) {
    return '❤️';
  }
  if (name.includes('gpa') || name.includes('grade') || category.includes('education')) {
    return '🎓';
  }
  if (name.includes('construction') || name.includes('material') || name.includes('paint')) {
    return '🔨';
  }
  if (name.includes('car') || name.includes('vehicle') || name.includes('automotive')) {
    return '🚗';
  }
  if (name.includes('business') || name.includes('sales') || name.includes('profit')) {
    return '💼';
  }
  if (name.includes('percentage') || name.includes('math') || name.includes('algebra')) {
    return '📊';
  }
  if (name.includes('baby') || name.includes('pregnancy') || name.includes('child')) {
    return '👶';
  }
  if (name.includes('pet') || name.includes('dog') || name.includes('cat')) {
    return '🐕';
  }
  if (name.includes('recipe') || name.includes('cooking') || name.includes('food')) {
    return '👨‍🍳';
  }
  if (name.includes('wedding') || name.includes('party') || name.includes('event')) {
    return '💒';
  }
  if (name.includes('garden') || name.includes('plant') || name.includes('lawn')) {
    return '🌱';
  }
  if (name.includes('game') || name.includes('gaming') || name.includes('character')) {
    return '🎮';
  }
  if (name.includes('environment') || name.includes('carbon') || name.includes('energy')) {
    return '🌍';
  }
  if (name.includes('sport') || name.includes('running') || name.includes('fitness')) {
    return '🏆';
  }
  if (name.includes('travel') || name.includes('trip') || name.includes('vacation')) {
    return '✈️';
  }
  if (name.includes('real estate') || name.includes('property') || name.includes('rent')) {
    return '🏠';
  }
  
  return '🧮';
};

function AllCalculatorsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const allCalculators = getAllCalculators();
  
  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(decodeURIComponent(urlSearchQuery));
    }
  }, [searchParams]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'All Calculators', url: '/all-online-calculators' }
  ]);

  // Filter calculators based on search and filters
  const filteredCalculators = useMemo(() => {
    let filtered = allCalculators;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(calc => 
        calc.name.toLowerCase().includes(query) ||
        calc.description.toLowerCase().includes(query) ||
        calc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(calc => calc.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(calc => calc.difficulty === selectedDifficulty);
    }

    // Popular only filter
    if (showPopularOnly) {
      filtered = filtered.filter(calc => calc.popular);
    }

    return filtered;
  }, [allCalculators, searchQuery, selectedCategory, selectedDifficulty, showPopularOnly]);

  // Group calculators by category for better organization
  const calculatorsByCategory = useMemo(() => {
    const grouped = filteredCalculators.reduce((acc, calc) => {
      const category = getCategoryBySlug(calc.category);
      const categoryName = category?.name || 'Other';
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          slug: calc.category,
          calculators: []
        };
      }
      acc[categoryName].calculators.push(calc);
      return acc;
    }, {} as Record<string, { slug: string; calculators: any[] }>);

    // Sort categories by calculator count (descending)
    return Object.entries(grouped).sort((a, b) => b[1].calculators.length - a[1].calculators.length);
  }, [filteredCalculators]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setShowPopularOnly(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">All Online Calculators</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Calculator className="h-4 w-4 mr-2" />
              Complete Collection
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              All Online
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Calculators</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse our complete collection of 735+ free online calculators across 17 categories. Find the perfect calculator for any calculation you need.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-blue-500" />
                <span>{allCalculators.length} Total Calculators</span>
              </div>
              <div className="flex items-center">
                <Grid3X3 className="h-4 w-4 mr-2 text-blue-500" />
                <span>17 Categories</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-blue-500" />
                <span>{allCalculators.filter(c => c.popular).length} Popular Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-background border-b">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Categories</option>
                {calculatorCategories.map(category => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Difficulty</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <button
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className={cn(
                  "flex items-center px-3 py-2 border rounded-lg transition-colors",
                  showPopularOnly 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-accent"
                )}
              >
                <Star className="h-4 w-4 mr-2" />
                Popular Only
              </button>

              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || showPopularOnly) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredCalculators.length} of {allCalculators.length} calculators
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>
      </div>

      {/* Calculators Display */}
      <div className="container py-12">
        {filteredCalculators.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No calculators found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="space-y-12">
            {calculatorsByCategory.map(([categoryName, categoryData]) => (
              <div key={categoryName}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {categoryName}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({categoryData.calculators.length} calculators)
                    </span>
                  </h2>
                  <Link
                    href={`/category/${categoryData.slug}/`}
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View category
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryData.calculators.map((calculator) => (
                    <Link
                      key={calculator.id}
                      href={getCalculatorURL(calculator)}
                      className="group relative p-4 bg-background border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/50"
                    >
                      {calculator.popular && (
                        <div className="absolute -top-1 -right-1">
                          <Star className="h-4 w-4 text-orange-500 fill-current" />
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getCalculatorIcon(calculator.name, calculator.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {calculator.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {calculator.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              calculator.difficulty === 'basic' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                              calculator.difficulty === 'intermediate' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                              calculator.difficulty === 'advanced' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            )}>
                              {calculator.difficulty}
                            </span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-8">
            {calculatorsByCategory.map(([categoryName, categoryData]) => (
              <div key={categoryName}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {categoryName}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({categoryData.calculators.length})
                    </span>
                  </h2>
                  <Link
                    href={`/category/${categoryData.slug}/`}
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View category
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>

                <div className="space-y-2">
                  {categoryData.calculators.map((calculator) => (
                    <Link
                      key={calculator.id}
                      href={getCalculatorURL(calculator)}
                      className="group flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="text-lg">
                          {getCalculatorIcon(calculator.name, calculator.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {calculator.name}
                            </h3>
                            {calculator.popular && (
                              <Star className="h-3 w-3 text-orange-500 fill-current" />
                            )}
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              calculator.difficulty === 'basic' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                              calculator.difficulty === 'intermediate' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                              calculator.difficulty === 'advanced' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            )}>
                              {calculator.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {calculator.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-muted/30">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Need Help Finding the Right Calculator?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our calculators are organized by category and difficulty level to help you find exactly what you need. 
              Start with our most popular calculators or browse by category.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/popular/"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular Calculators
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllOnlineCalculatorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AllCalculatorsContent />
    </Suspense>
  );
}