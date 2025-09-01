'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ChevronRight, Search, Calculator, TrendingUp, Users, Star, Filter, Grid3X3, DollarSign, GraduationCap, Heart, Home, Hammer, Car, Briefcase, Baby, Dog, Gamepad, Clock, UtensilsCrossed, Leaf, Trophy, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculatorCategories, getAllCalculators } from '@/lib/calculator-categories';
import { generateBreadcrumbSchema } from '@/lib/schemas';

// Icon mapping for categories
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'DollarSign': return DollarSign;
    case 'GraduationCap': return GraduationCap;
    case 'Heart': return Heart;
    case 'Home': return Home;
    case 'Hammer': return Hammer;
    case 'Car': return Car;
    case 'Briefcase': return Briefcase;
    case 'Calculator': return Calculator;
    case 'Baby': return Baby;
    case 'Dog': return Dog;
    case 'Gamepad2': return Gamepad;
    case 'Clock': return Clock;
    case 'ChefHat': return UtensilsCrossed;
    case 'Leaf': return Leaf;
    case 'Trophy': return Trophy;
    case 'Sprout': return Sprout;
    default: return Calculator;
  }
};

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'calculators' | 'popular'>('name');

  const allCalculators = getAllCalculators();
  const totalCalculators = allCalculators.length;
  const popularCalculators = allCalculators.filter(calc => calc.popular).length;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Calculator Categories', url: '/categories' }
  ]);

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = calculatorCategories;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.subcategories.some(sub => 
          sub.name.toLowerCase().includes(query) ||
          sub.calculators.some(calc => calc.name.toLowerCase().includes(query))
        )
      );
    }

    // Sort categories
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'calculators':
          const aCount = a.subcategories.reduce((sum, sub) => sum + sub.calculators.length, 0);
          const bCount = b.subcategories.reduce((sum, sub) => sum + sub.calculators.length, 0);
          return bCount - aCount;
        case 'popular':
          const aPopular = a.subcategories.reduce((sum, sub) => sum + sub.calculators.filter(calc => calc.popular).length, 0);
          const bPopular = b.subcategories.reduce((sum, sub) => sum + sub.calculators.filter(calc => calc.popular).length, 0);
          return bPopular - aPopular;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [searchQuery, sortBy]);

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
            <span className="text-foreground font-medium">Calculator Categories</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-indigo-50 to-purple-50 dark:from-primary/10 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Complete Collection
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Calculator
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"> Categories</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our comprehensive collection of calculators organized by category. From finance to health, construction to education - find the perfect tool for every calculation need.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Grid3X3 className="h-4 w-4 mr-2 text-indigo-500" />
                <span>{calculatorCategories.length} Categories</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-indigo-500" />
                <span>{totalCalculators} Total Calculators</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-indigo-500" />
                <span>{popularCalculators} Popular Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-background border-b">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search categories or calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="name">Name (A-Z)</option>
                <option value="calculators">Most Calculators</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedCategories.length} of {calculatorCategories.length} categories
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container py-12">
        {filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-12">
            <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredAndSortedCategories.map((category, categoryIndex) => {
              const IconComponent = getIcon(category.icon);
              const totalCategoryCalculators = category.subcategories.reduce(
                (sum, sub) => sum + sub.calculators.length, 0
              );
              const popularCategoryCalculators = category.subcategories.reduce(
                (sum, sub) => sum + sub.calculators.filter(calc => calc.popular).length, 0
              );

              // Color gradients for each category
              const colorVariants = [
                'from-blue-500 to-purple-600',
                'from-green-500 to-teal-600', 
                'from-orange-500 to-red-600',
                'from-pink-500 to-violet-600',
                'from-yellow-500 to-orange-600',
                'from-cyan-500 to-blue-600',
                'from-indigo-500 to-blue-600',
                'from-purple-500 to-indigo-600',
                'from-slate-500 to-indigo-600',
                'from-violet-500 to-purple-600',
                'from-blue-400 to-indigo-600',
                'from-sky-500 to-blue-600',
                'from-blue-500 to-cyan-600',
                'from-purple-400 to-blue-600',
                'from-indigo-600 to-purple-700',
                'from-cyan-400 to-blue-500',
                'from-slate-600 to-blue-700'
              ];
              const colorClass = colorVariants[categoryIndex % colorVariants.length];

              return (
                <div key={category.slug} className="space-y-6">
                  {/* Main Category Header */}
                  <div className="bg-gradient-to-r from-background to-muted/30 rounded-xl p-4 md:p-6 border">
                    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div className="flex items-start md:items-center space-x-3 md:space-x-4">
                        <div className={cn(
                          "p-3 md:p-4 rounded-xl bg-gradient-to-br flex-shrink-0",
                          colorClass
                        )}>
                          <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                            {category.name}
                          </h2>
                          <p className="text-sm md:text-base text-muted-foreground mb-2 line-clamp-2 md:line-clamp-none md:max-w-2xl">
                            {category.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calculator className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              <span>{totalCategoryCalculators}</span>
                            </div>
                            <div className="flex items-center">
                              <Grid3X3 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              <span>{category.subcategories.length}</span>
                            </div>
                            {popularCategoryCalculators > 0 && (
                              <div className="flex items-center text-orange-600">
                                <Star className="h-3 w-3 md:h-4 md:w-4 mr-1 fill-current" />
                                <span>{popularCategoryCalculators}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/category/${category.slug}`}
                        className="flex items-center justify-center px-3 py-2 md:px-4 md:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm md:text-base flex-shrink-0"
                      >
                        View All
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Subcategory Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category.subcategories.map((subcategory, subIndex) => {
                      const subcategoryColorVariants = [
                        'from-blue-400/20 to-purple-500/20',
                        'from-green-400/20 to-teal-500/20',
                        'from-orange-400/20 to-red-500/20',
                        'from-pink-400/20 to-violet-500/20',
                        'from-yellow-400/20 to-orange-500/20',
                        'from-cyan-400/20 to-blue-500/20',
                        'from-indigo-400/20 to-blue-500/20',
                        'from-purple-400/20 to-indigo-500/20',
                        'from-slate-400/20 to-indigo-500/20',
                        'from-violet-400/20 to-purple-500/20'
                      ];
                      const subColorClass = subcategoryColorVariants[subIndex % subcategoryColorVariants.length];
                      const popularSubcategoryCalculators = subcategory.calculators.filter(calc => calc.popular).length;

                      return (
                        <Link
                          key={subcategory.slug}
                          href={`/category/${category.slug}#${subcategory.slug}`}
                          className="group bg-background border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={cn(
                              "p-2 rounded-lg bg-gradient-to-br",
                              subColorClass
                            )}>
                              <Calculator className="h-5 w-5 text-primary" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>

                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {subcategory.name}
                          </h3>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calculator className="h-3 w-3 mr-1" />
                              <span>{subcategory.calculators.length} tools</span>
                            </div>
                            {popularSubcategoryCalculators > 0 && (
                              <div className="flex items-center text-orange-600">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                <span>{popularSubcategoryCalculators}</span>
                              </div>
                            )}
                          </div>

                          {/* Preview of top calculators */}
                          {subcategory.calculators.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex flex-wrap gap-1">
                                {subcategory.calculators.slice(0, 2).map((calc) => (
                                  <span 
                                    key={calc.slug}
                                    className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-full"
                                  >
                                    {calc.name}
                                  </span>
                                ))}
                                {subcategory.calculators.length > 2 && (
                                  <span className="text-xs text-muted-foreground px-2 py-1">
                                    +{subcategory.calculators.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-muted/30">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Need Something Specific?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find the calculator category you're looking for? Browse our complete collection 
              or explore our most popular tools used by millions of users worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/all-online-calculators"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Browse All {totalCalculators} Calculators
              </Link>
              <Link
                href="/popular"
                className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular Calculators
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}