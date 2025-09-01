'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Calculator, TrendingUp, Users, Zap, ChevronRight, Star, BarChart3, Globe, Grid3X3, DollarSign, GraduationCap, Heart, Home, Hammer, Car, Briefcase, Baby, Dog, Gamepad, Clock, UtensilsCrossed, Leaf, Trophy, Sprout } from 'lucide-react';
import { calculatorCategories, popularCalculators } from '@/lib/calculator-categories';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/all-online-calculators?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
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
  
  const stats = [
    { 
      label: 'Calculators Available', 
      value: '735+', 
      icon: Calculator,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      label: 'Categories Covered', 
      value: '17', 
      icon: Globe,
      gradient: 'from-green-500 to-teal-600'
    },
    { 
      label: 'Free Forever', 
      value: '💯', 
      icon: Heart,
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      label: 'Instant Results', 
      value: '⚡', 
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Comprehensive Collection',
      description: 'Access 735+ calculators across 17 major categories, from finance to health, construction to cooking.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant results with our optimized calculators. No downloads, no registration required.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'User-Friendly Design',
      description: 'Clean, intuitive interfaces designed for both beginners and professionals.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: TrendingUp,
      title: 'Always Accurate',
      description: 'All calculations use industry-standard formulas and are regularly updated for accuracy.',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/10 dark:via-purple-900/20 dark:to-pink-900/20 py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Star className="mr-1 h-4 w-4" />
                #1 Calculator Collection
              </span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              The Ultimate{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Calculator
              </span>{' '}
              Collection
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground lg:text-2xl">
              Discover 735+ free online calculators across 17 categories including finance, health, 
              construction, education, business, and much more. Fast, accurate, and always free.
            </p>

            {/* Search Bar */}
            <div className="mb-12 mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search calculators... (e.g., mortgage, BMI, percentage)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-full border bg-background/50 pl-12 pr-6 py-4 text-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-sm"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/all-online-calculators"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse All Calculators
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-8 py-4 text-lg font-medium hover:bg-accent transition-colors backdrop-blur-sm"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-pink-500/20 to-primary/20 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background/50 backdrop-blur-sm border-y">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-4 group-hover:scale-110 transition-transform duration-200", stat.gradient)}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Most Popular Calculators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with our most-used calculators, trusted by millions of users worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {popularCalculators.slice(0, 6).map((calc, index) => {
              const gradients = [
                'from-blue-500 to-purple-600',
                'from-green-500 to-teal-600', 
                'from-orange-500 to-red-600',
                'from-pink-500 to-violet-600',
                'from-yellow-500 to-orange-600',
                'from-cyan-500 to-blue-600'
              ];
              return (
                <Link
                  key={calc}
                  href={`/calculator/${calc}`}
                  className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-br group-hover:scale-110 transition-transform duration-200", gradients[index])}>
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 capitalize">
                    {calc.replace('-', ' ')} Calculator
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quick and accurate {calc.replace('-', ' ')} calculations with detailed results
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/all-online-calculators"
              className="inline-flex items-center justify-center rounded-full border border-primary bg-primary/5 px-8 py-3 font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              View All Popular Calculators
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Calculator Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore all 17 comprehensive categories with 735+ calculators for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calculatorCategories.map((category, index) => {
              const IconComponent = getIcon(category.icon);
              // Use blue/purple color scheme like original design
              const blueColorVariants = [
                'from-blue-500 to-purple-600',
                'from-indigo-500 to-blue-600', 
                'from-purple-500 to-indigo-600',
                'from-cyan-500 to-blue-600',
                'from-blue-600 to-indigo-700',
                'from-slate-500 to-indigo-600',
                'from-violet-500 to-purple-600',
                'from-blue-400 to-indigo-600',
                'from-indigo-400 to-purple-600',
                'from-sky-500 to-blue-600',
                'from-blue-500 to-cyan-600',
                'from-purple-400 to-blue-600',
                'from-indigo-600 to-purple-700',
                'from-blue-300 to-indigo-500',
                'from-cyan-400 to-blue-500',
                'from-slate-600 to-blue-700',
                'from-purple-500 to-blue-700'
              ];
              const colorClass = blueColorVariants[index % blueColorVariants.length];
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group p-6 rounded-xl bg-background border hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-br group-hover:scale-110 transition-transform duration-200", colorClass)}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                <h3 className="font-semibold text-lg mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <div className="text-sm text-primary font-medium">
                  {category.subcategories.length} subcategories
                </div>
              </Link>
              );
            })}
          </div>

          {/* View All Categories Button */}
          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg"
            >
              <Grid3X3 className="h-5 w-5 mr-2" />
              View All Categories
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Calcverse?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for professionals, students, and anyone who needs reliable calculations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-4 group-hover:scale-110 transition-transform duration-200", feature.gradient)}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Calculating?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join millions of users who trust Calcverse for their daily calculations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/all-online-calculators"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Calculating Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-4 font-medium hover:bg-accent transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}