import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Calculator, ArrowLeft, TrendingUp, Shield, Clock, CreditCard, Home, BarChart3, PiggyBank, DollarSign, Wallet, GraduationCap, BookOpen, School, Heart, Activity, Utensils, Building, Wrench, Paintbrush, Car, Fuel, Settings, Briefcase, Users, Target, Plus, Minus, Triangle, BarChart, Baby, Scale, PawPrint, Gamepad, User, ShoppingCart, Plane, ChefHat, Scale as KitchenScale, Leaf, Zap, Trophy, Medal, Sprout, TreePine, Flower } from 'lucide-react';
import { calculatorCategories, getCategoryBySlug, getCalculatorsBySubcategory } from '@/lib/calculator-categories';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { cn, slugify } from '@/lib/utils';
import { FAQAccordion } from './components/faq-accordion';
import { generateBreadcrumbSchema } from '@/lib/schemas';

// Icons mapping for categories
const iconMap: { [key: string]: any } = {
  DollarSign: () => <span>💰</span>,
  GraduationCap: () => <span>🎓</span>,
  Heart: () => <span>❤️</span>,
  Home: () => <span>🏠</span>,
  Hammer: () => <span>🔨</span>,
  Car: () => <span>🚗</span>,
  Briefcase: () => <span>💼</span>,
  Calculator: () => <span>🧮</span>,
  Baby: () => <span>👶</span>,
  Dog: () => <span>🐕</span>,
  Gamepad2: () => <span>🎮</span>,
  Clock: () => <span>⏰</span>,
  ChefHat: () => <span>🍴</span>,
  Leaf: () => <span>🌿</span>,
  Trophy: () => <span>🏆</span>,
  Sprout: () => <span>🌱</span>,
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found | Calcshark',
      description: 'The requested calculator category could not be found.',
    };
  }

  return generateSEOMetadata({
    title: `Free ${category.name} Online Calculators - No Sign Up - Calcshark`,
    description: `Discover ${category.name.toLowerCase()} calculators. ${category.description} All tools are free, instant, and accurate.`,
    canonical: `https://calcshark.com/category/${category.slug}`,
    keywords: [
      category.name.toLowerCase(),
      'calculator',
      'free online calculator',
      'math tools',
      ...category.subcategories.map(sub => sub.name.toLowerCase()),
    ],
  });
}

// Calculator data is now imported from the generated file

// Function to get relevant icons for subcategories
const getSubcategoryIcon = (subcategorySlug: string) => {
  const iconMap: { [key: string]: any } = {
    // Finance subcategories
    'loans-debt': CreditCard,
    'mortgages': Home,
    'investments': BarChart3,
    'retirement': PiggyBank,
    'budgeting-savings': Wallet,
    
    // Education subcategories
    'gpa-grades': GraduationCap,
    'test-preparation': BookOpen,
    'college-planning': School,
    
    // Health subcategories
    'body-metrics': Scale,
    'nutrition-diet': Utensils,
    'exercise-performance': Activity,
    
    // Real Estate subcategories
    'property-investment': BarChart3,
    'property-management': Building,
    'home-buying-selling': Home,
    
    // Construction subcategories
    'materials-quantities': Calculator,
    'flooring': Building,
    'roofing-siding': Home,
    'paint-wall-covering': Paintbrush,
    
    // Automotive subcategories
    'vehicle-costs': Car,
    'fuel-efficiency': Fuel,
    'maintenance-parts': Settings,
    
    // Business subcategories
    'business-finance': Briefcase,
    'sales-marketing': Target,
    'human-resources': Users,
    'productivity-efficiency': BarChart,
    
    // Mathematics subcategories
    'basic-math': Plus,
    'algebra': Calculator,
    'geometry': Triangle,
    'statistics': BarChart,
    
    // Pregnancy & Parenting subcategories
    'pregnancy': Baby,
    'baby-child-development': Baby,
    'family-planning': Users,
    
    // Pet Care subcategories
    'pet-health-nutrition': PawPrint,
    'pet-care-costs': DollarSign,
    
    // Gaming subcategories
    'gaming-performance': Gamepad,
    'character-build-planning': User,
    
    // Lifestyle subcategories
    'time-date': Clock,
    'shopping-savings': ShoppingCart,
    'travel': Plane,
    
    // Cooking subcategories
    'recipe-calculations': ChefHat,
    'kitchen-measurements': KitchenScale,
    
    // Environmental subcategories
    'energy-utilities': Zap,
    'carbon-waste': Leaf,
    
    // Sports subcategories
    'sports-performance': Trophy,
    'outdoor-activities': Medal,
    
    // Gardening subcategories
    'garden-planning': Sprout,
    'lawn-landscaping': TreePine,
    
    // Wedding subcategories
    'wedding-planning': Heart,
    'party-event-planning': Flower,
    
    // Default fallback
    'default': Calculator
  };
  
  return iconMap[subcategorySlug] || iconMap['default'];
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const IconComponent = iconMap[category.icon] || (() => <span>🧮</span>);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category.name, url: `/category/${category.slug}` }
  ]);
  
  // Calculate total number of calculators for this category
  const totalCalculators = category.subcategories.reduce((total, subcategory) => {
    return total + subcategory.calculators.length;
  }, 0);
  
  // Color variants for gradient backgrounds
  const blueColorVariants = [
    'from-blue-500 to-purple-600',
    'from-indigo-500 to-blue-600', 
    'from-purple-500 to-indigo-600',
    'from-cyan-500 to-blue-600',
    'from-blue-600 to-indigo-700',
    'from-slate-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-blue-400 to-indigo-600',
  ];

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
              <Link href="/categories/" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

      {/* Category Header */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/10 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/categories/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </div>

          <div className="flex flex-col items-center text-center space-y-6 mb-8 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-6">
            <div className={cn("p-4 rounded-2xl bg-gradient-to-br", category.color)}>
              <div className="text-4xl">
                <IconComponent />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {category.name} Online Calculators
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl md:max-w-none">
                {category.description}
              </p>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {category.subcategories.length}
              </div>
              <div className="text-sm text-muted-foreground">Subcategories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {totalCalculators}
              </div>
              <div className="text-sm text-muted-foreground">Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                💯
              </div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                ⚡
              </div>
              <div className="text-sm text-muted-foreground">Instant Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories and Calculators */}
      <div className="container py-8">
        <div className="space-y-12">
          {category.subcategories.map((subcategory, index) => {
            const colorClass = blueColorVariants[index % blueColorVariants.length];
            const SubcategoryIcon = getSubcategoryIcon(subcategory.slug);
            
            return (
              <div key={subcategory.slug} className="space-y-8">
                {/* Subcategory Header */}
                <div className="flex flex-col items-center text-center space-y-4 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-4">
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br", colorClass)}>
                    <SubcategoryIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {subcategory.name}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {subcategory.description}
                    </p>
                  </div>
                </div>

                {/* Calculator Cards */}
                <div className="relative">
                  {/* Mobile scroll hint */}
                  <div className="md:hidden text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Swipe to explore more calculators →
                    </p>
                  </div>
                  
                  <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 flex md:flex-none overflow-x-auto gap-4 pb-4 md:pb-0 pt-1 md:pt-4 md:px-2 scrollbar-hide snap-x snap-mandatory">
                    {subcategory.calculators.map((calculator, calcIndex) => (
                    <div
                      key={calcIndex}
                      className="group relative p-6 bg-background border rounded-xl hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex-shrink-0 w-80 md:w-auto snap-start mt-3 mb-3"
                    >
                      {calculator.popular && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-sm">
                            Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorClass)}>
                          <Calculator className="h-5 w-5 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {calculator.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-medium">
                          Free • Instant Results
                        </span>
                        <Link 
                          href={`/calculator/${calculator.slug}/`}
                          className="text-sm text-primary hover:underline"
                        >
                          Calculate →
                        </Link>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Content Section */}
      <div className="py-12">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Why Choose Our {category.name} Calculators?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {category.slug === 'finance' && 'Our comprehensive suite of financial calculators helps you make informed decisions about your money, investments, and financial future. All tools are free, accurate, and designed by financial experts.'}
              {category.slug === 'education' && 'Professional academic calculators for students, educators, and institutions. Calculate GPAs, test scores, college costs, and academic planning tools with precision and ease.'}
              {category.slug === 'health' && 'Comprehensive health and fitness calculators for body metrics, nutrition planning, and exercise performance. Make informed decisions about your health and wellness goals.'}
              {category.slug === 'real-estate' && 'Professional real estate calculators for investors, agents, buyers, and sellers. Analyze investment properties, calculate cash flow, affordability, and make informed real estate decisions.'}
              {category.slug === 'construction' && 'Professional construction calculators for contractors, builders, and DIY enthusiasts. Calculate materials, quantities, costs, and measurements for any construction or home improvement project.'}
              {category.slug === 'automotive' && 'Comprehensive automotive calculators for car owners, buyers, and transportation planning. Calculate vehicle costs, fuel efficiency, maintenance expenses, and make smart automotive decisions.'}
              {category.slug === 'business' && 'Professional business calculators for entrepreneurs, managers, and business professionals. Calculate finances, sales metrics, HR costs, productivity, and make data-driven business decisions.'}
              {category.slug === 'mathematics' && 'Comprehensive mathematics calculators for students, teachers, engineers, and professionals. Solve equations, calculate geometry, analyze statistics, and perform complex mathematical operations with precision.'}
              {category.slug !== 'finance' && category.slug !== 'education' && category.slug !== 'health' && category.slug !== 'real-estate' && category.slug !== 'construction' && category.slug !== 'automotive' && category.slug !== 'business' && category.slug !== 'mathematics' && `Discover our comprehensive collection of ${category.name.toLowerCase()} calculators designed to help you make informed decisions. All tools are free, accurate, and easy to use.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accurate Results</h3>
              <p className="text-muted-foreground">
                All calculations use industry-standard formulas and are regularly updated to reflect current financial standards and regulations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your financial information stays private. All calculations are performed in your browser without storing personal data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
              <p className="text-muted-foreground">
                Get immediate calculations without waiting. Our optimized tools provide real-time results as you adjust parameters.
              </p>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="bg-gradient-to-br from-primary/5 to-purple-100/50 dark:from-primary/10 dark:to-purple-900/20 rounded-2xl p-8 lg:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Professional Calculator Tools
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Access industry-standard calculation tools designed for accuracy and ease of use. 
                All calculators use proven formulas and provide instant results for your planning needs.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-muted-foreground">Free to Use</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">⚡</div>
                  <div className="text-muted-foreground">Instant Results</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">🔒</div>
                  <div className="text-muted-foreground">Privacy Protected</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">📱</div>
                  <div className="text-muted-foreground">Mobile Friendly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion category={category} />

      {/* Related Categories */}
      <div className="bg-muted/30 py-12">
        <div className="container">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatorCategories
              .filter(cat => cat.slug !== category.slug)
              .slice(0, 6)
              .map((relatedCategory, index) => {
                const RelatedIcon = iconMap[relatedCategory.icon] || (() => <span>🧮</span>);
                const colorClass = blueColorVariants[index % blueColorVariants.length];
                
                return (
                  <Link
                    key={relatedCategory.slug}
                    href={`/category/${relatedCategory.slug}/`}
                    className="group p-6 bg-background border rounded-xl hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={cn("p-3 rounded-lg bg-gradient-to-br group-hover:scale-110 transition-transform duration-200", colorClass)}>
                        <div className="text-xl">
                          <RelatedIcon />
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                      {relatedCategory.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {relatedCategory.subcategories.length} subcategories
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

