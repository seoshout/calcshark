'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Bookmark, Share2, Calculator, TrendingUp, Users, Clock, Check, Copy, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { secureStorage, validateCalculatorInput, sanitizeInput } from '@/lib/security';

interface CalculatorLayoutProps {
  calculator: any;
  category: any;
  children: React.ReactNode;
}

export default function CalculatorLayout({ calculator, category, children }: CalculatorLayoutProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Helper function to convert CAPITAL CASE to Title Case
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSave = () => {
    // Get saved calculators from secure storage
    const savedData = secureStorage.getItem('savedCalculators');
    const saved = savedData ? JSON.parse(savedData) : [];
    
    if (isSaved) {
      // Remove from saved
      const filtered = saved.filter((slug: string) => slug !== calculator.slug);
      secureStorage.setItem('savedCalculators', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      // Add to saved
      const sanitizedSlug = sanitizeInput(calculator.slug);
      if (!saved.includes(sanitizedSlug)) {
        saved.push(sanitizedSlug);
        secureStorage.setItem('savedCalculators', JSON.stringify(saved));
      }
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/calculator/${calculator.slug}`;
    
    if (navigator.share) {
      // Use native sharing if available
      try {
        await navigator.share({
          title: `Free Online ${calculator.name}`,
          text: calculator.description,
          url: url,
        });
      } catch (err) {
        // Fallback to copying URL
        copyToClipboard(url);
      }
    } else {
      // Fallback to copying URL
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleWriteReview = () => {
    // Scroll to the review section at the bottom of the page
    const reviewSection = document.getElementById('calculator-review-section');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus on the review form after scrolling
      setTimeout(() => {
        const reviewForm = reviewSection.querySelector('form');
        if (reviewForm) {
          const firstInput = reviewForm.querySelector('input, textarea') as HTMLElement;
          firstInput?.focus();
        }
      }, 500);
    }
  };

  // Check if calculator is saved on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = secureStorage.getItem('savedCalculators');
      const saved = savedData ? JSON.parse(savedData) : [];
      const sanitizedSlug = sanitizeInput(calculator.slug);
      setIsSaved(saved.includes(sanitizedSlug));
    }
  }, [calculator.slug]);

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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link 
              href={`/category/${calculator.category}/`} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category?.name ? toTitleCase(category.name) : ''}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{calculator.name}</span>
          </nav>
        </div>
      </div>

      {/* Calculator Header */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {calculator.popular && (
                    <div className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Popular
                    </div>
                  )}
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getBadgeColor(calculator.difficulty))}>
                    {calculator.difficulty.charAt(0).toUpperCase() + calculator.difficulty.slice(1)}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {calculator.slug === 'smart-thermostat-savings-calculator'
                    ? 'Free Online Smart Thermostat Savings Calculator & ROI Estimator (2026 Edition)'
                    : `Free Online ${calculator.name}`}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  {calculator.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-primary" />
                    <span>Free to Use</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>No Registration</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  className={cn(
                    "inline-flex items-center px-4 py-2 border rounded-lg transition-colors",
                    isSaved
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent border-border"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4 mr-2", isSaved && "fill-current")} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors relative"
                >
                  {showCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </button>
                <button
                  onClick={handleWriteReview}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="container py-12 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Calculator Area */}
            <div className="lg:col-span-2">
              {children}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-background border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Link 
                      href={`/category/${calculator.category}/`}
                      className="text-primary hover:underline"
                    >
                      {category?.name ? toTitleCase(category.name) : ''}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{calculator.difficulty.charAt(0).toUpperCase() + calculator.difficulty.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">Free Tool</span>
                  </div>
                </div>
              </div>

              {/* Related Calculators */}
              <div className="bg-background border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Related Calculators</h3>
                <div className="space-y-3">
                  {/* This would be dynamically generated based on the same category */}
                  <Link 
                    href="/calculator/body-fat-percentage-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">Body Fat Percentage Calculator</div>
                    <div className="text-xs text-muted-foreground">Health & Fitness</div>
                  </Link>
                  <Link 
                    href="/calculator/ideal-weight-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">Ideal Weight Calculator</div>
                    <div className="text-xs text-muted-foreground">Health & Fitness</div>
                  </Link>
                  <Link 
                    href="/calculator/calorie-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">Calorie Calculator</div>
                    <div className="text-xs text-muted-foreground">Health & Fitness</div>
                  </Link>
                </div>
                <Link 
                  href={`/category/${calculator.category}/`}
                  className="block mt-4 text-sm text-primary hover:underline"
                >
                  View all {category?.name ? toTitleCase(category.name) : ''} calculators →
                </Link>
              </div>

              {/* Popular Calculators */}
              <div className="bg-background border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  <TrendingUp className="h-5 w-5 inline mr-2" />
                  Popular Calculators
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/calculator/mortgage-payment-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-orange-500 mr-2 fill-current" />
                      <span className="font-medium text-sm">Mortgage Payment Calculator</span>
                    </div>
                  </Link>
                  <Link 
                    href="/calculator/percentage-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-orange-500 mr-2 fill-current" />
                      <span className="font-medium text-sm">Percentage Calculator</span>
                    </div>
                  </Link>
                  <Link 
                    href="/calculator/loan-payment-calculator/"
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-orange-500 mr-2 fill-current" />
                      <span className="font-medium text-sm">Loan Payment Calculator</span>
                    </div>
                  </Link>
                </div>
                <Link 
                  href="/popular/"
                  className="block mt-4 text-sm text-primary hover:underline"
                >
                  View all popular calculators →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}