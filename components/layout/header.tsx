'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Calculator, Sun, Moon, ChevronDown, DollarSign, GraduationCap, Heart, Home, Hammer, Car, Briefcase, Baby, Dog, Gamepad, Clock, UtensilsCrossed, Leaf, Trophy, Sprout } from 'lucide-react';
import { calculatorCategories } from '@/lib/calculator-categories';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/all-online-calculators?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/all-online-calculators?search=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Icon mapping for mega menu
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calcverse
            </span>
            <span className="text-xs text-muted-foreground -mt-1">735+ Calculators</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            Home
          </Link>
          
          {/* Categories Mega Menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <span>Categories</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {/* Mega Menu */}
            <div 
              className={cn(
                "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[1100px] bg-background border rounded-xl shadow-2xl transition-all duration-300",
                isCategoriesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
              )}
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {calculatorCategories.map((category, index) => {
                    const IconComponent = getIcon(category.icon);
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
                        className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-all duration-200"
                      >
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br group-hover:scale-110 transition-transform duration-200", colorClass)}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {category.name}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/popular" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            Popular
          </Link>
          
          <Link 
            href="/all-online-calculators" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            All Calculators
          </Link>
          
          <Link 
            href="/about" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            About
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <div className="relative hidden md:block">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-accent rounded-full hover:bg-accent/80 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
            </button>
            
            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-background border rounded-xl shadow-2xl p-4 z-50">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search calculators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                {searchQuery && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Popular suggestions:</p>
                    <div className="space-y-1">
                      {['Mortgage Calculator', 'BMI Calculator', 'Percentage Calculator', 'Loan Calculator'].map((suggestion) => (
                        <button
                          key={suggestion}
                          className="block w-full text-left text-sm p-2 hover:bg-accent rounded-md transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (!isMenuOpen) {
                setIsMobileCategoriesOpen(false);
              }
            }}
            className="lg:hidden p-2 rounded-full hover:bg-accent transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-6 space-y-6">
            {/* Mobile Search */}
            <div className="flex items-center space-x-2 px-4 py-3 bg-accent rounded-full">
              <Search className="h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search calculators..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            
            {/* Mobile Search Results */}
            {searchQuery && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Popular suggestions:</p>
                <div className="space-y-1">
                  {['Mortgage Calculator', 'BMI Calculator', 'Percentage Calculator', 'Loan Calculator'].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="block w-full text-left text-sm p-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => {
                        handleSuggestionClick(suggestion);
                        setIsMenuOpen(false);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/popular"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Popular Calculators
              </Link>
              
              <Link 
                href="/all-online-calculators"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Calculators
              </Link>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-lg font-semibold text-foreground">Categories</h4>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    isMobileCategoriesOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              
              {isMobileCategoriesOpen && (
                <div className="max-h-80 overflow-y-auto scrollbar-hide-mobile">
                  <div className="grid grid-cols-1 gap-3 pb-2">
                    {calculatorCategories.map((category, index) => {
                  const IconComponent = getIcon(category.icon);
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
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-accent transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileCategoriesOpen(false);
                      }}
                    >
                      <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorClass)}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm">{category.name}</span>
                        <p className="text-xs text-muted-foreground">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Link 
                href="/about"
                className="block text-lg font-medium hover:text-primary transition-colors mb-4"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}