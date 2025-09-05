import { promises as fs } from 'fs';
import path from 'path';

export interface DiscoveredRoute {
  url: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
  type: 'static' | 'calculator' | 'category' | 'dynamic';
}

// Cache for route discovery to improve performance
let routeCache: DiscoveredRoute[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function discoverAllWebsiteRoutes(): Promise<DiscoveredRoute[]> {
  // Return cached results if still valid
  if (routeCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return routeCache;
  }

  const routes: DiscoveredRoute[] = [];
  const currentDate = new Date().toISOString();

  try {
    // 1. Discover static pages by scanning app directory
    const staticRoutes = await discoverStaticPages();
    routes.push(...staticRoutes);

    // 2. Discover calculator pages by scanning actual calculator components
    const calculatorRoutes = await discoverActualCalculators();
    routes.push(...calculatorRoutes);

    // 3. Discover category pages
    const categoryRoutes = await discoverCategoryPages();
    routes.push(...categoryRoutes);

    // 4. Remove duplicates and sort by priority
    const uniqueRoutes = removeDuplicateRoutes(routes);
    const sortedRoutes = uniqueRoutes.sort((a, b) => b.priority - a.priority);

    // Update cache
    routeCache = sortedRoutes.map(route => ({
      ...route,
      lastmod: currentDate
    }));
    cacheTimestamp = Date.now();

    return routeCache;
  } catch (error) {
    console.error('Error discovering website routes:', error);
    return getFallbackRoutes();
  }
}

async function discoverStaticPages(): Promise<DiscoveredRoute[]> {
  const routes: DiscoveredRoute[] = [];
  
  try {
    const appDir = path.join(process.cwd(), 'app');
    const entries = await fs.readdir(appDir, { withFileTypes: true });

    // Always include homepage
    routes.push({
      url: '',
      priority: 1.0,
      changefreq: 'daily',
      type: 'static'
    });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('[') && !entry.name.startsWith('_')) {
        const pagePath = path.join(appDir, entry.name, 'page.tsx');
        
        if (await fileExists(pagePath)) {
          const priority = getPagePriority(entry.name);
          const changefreq = getPageChangeFreq(entry.name);

          routes.push({
            url: `/${entry.name}`,
            priority,
            changefreq,
            type: 'static'
          });
        }
      }
    }
  } catch (error) {
    console.warn('Could not discover static pages:', error instanceof Error ? error.message : String(error));
  }

  return routes;
}

async function discoverActualCalculators(): Promise<DiscoveredRoute[]> {
  const routes: DiscoveredRoute[] = [];
  
  try {
    const calculatorsDir = path.join(process.cwd(), 'app', 'calculator', '[slug]', 'calculators');
    
    if (await fileExists(calculatorsDir)) {
      const calculatorFiles = await fs.readdir(calculatorsDir);
      
      const calculatorComponents = calculatorFiles
        .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
        .map(file => {
          const componentName = file.replace('.tsx', '');
          const slug = componentNameToSlug(componentName);
          const isPopular = isPopularCalculator(slug);
          
          return {
            url: `/calculator/${slug}`,
            priority: isPopular ? 0.9 : 0.7,
            changefreq: 'monthly' as const,
            type: 'calculator' as const
          };
        });

      routes.push(...calculatorComponents);
    }
  } catch (error) {
    console.warn('Could not discover calculator components:', error instanceof Error ? error.message : String(error));
  }

  return routes;
}

async function discoverCategoryPages(): Promise<DiscoveredRoute[]> {
  const routes: DiscoveredRoute[] = [];
  
  try {
    // Check if category pages exist by looking for the dynamic route
    const categoryPagePath = path.join(process.cwd(), 'app', 'category', '[slug]', 'page.tsx');
    
    if (await fileExists(categoryPagePath)) {
      // Import calculator categories to get actual category slugs
      const { calculatorCategories } = await import('./calculator-categories');
      
      calculatorCategories.forEach(category => {
        routes.push({
          url: `/category/${category.slug}`,
          priority: 0.8,
          changefreq: 'weekly',
          type: 'category'
        });
      });
    }
  } catch (error) {
    console.warn('Could not discover category pages:', error instanceof Error ? error.message : String(error));
  }

  return routes;
}

// Helper functions
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function componentNameToSlug(componentName: string): string {
  // Handle specific known mappings first
  const knownMappings: { [key: string]: string } = {
    'BMICalculator': 'bmi',
    'AdvancedBMICalculator': 'bmi',
    'AdvancedMortgageCalculator': 'mortgage-payment',
    'AdvancedCompoundInterestCalculator': 'compound-interest'
  };

  if (knownMappings[componentName]) {
    return knownMappings[componentName];
  }

  // Fallback to automatic conversion
  return componentName
    .replace(/Calculator$/, '') // Remove Calculator suffix
    .replace(/Advanced/, '') // Remove Advanced prefix
    .replace(/([A-Z])/g, '-$1') // Add hyphens before capital letters
    .toLowerCase()
    .replace(/^-/, '') // Remove leading hyphen
    .replace(/--+/g, '-'); // Replace multiple hyphens with single
}

function isPopularCalculator(slug: string): boolean {
  const popularSlugs = [
    'bmi', 'mortgage-payment', 'loan-payment', 'compound-interest',
    'percentage', 'tip', 'calorie', 'gpa', 'age', 'discount'
  ];
  return popularSlugs.includes(slug);
}

function getPagePriority(pageName: string): number {
  const priorities: { [key: string]: number } = {
    'all-online-calculators': 0.9,
    'categories': 0.9,
    'popular': 0.8,
    'about': 0.6,
    'contact': 0.6,
    'privacy': 0.5,
    'terms': 0.5
  };
  
  return priorities[pageName] || 0.6;
}

function getPageChangeFreq(pageName: string): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  const frequencies: { [key: string]: 'daily' | 'weekly' | 'monthly' | 'yearly' } = {
    'all-online-calculators': 'daily',
    'popular': 'daily',
    'categories': 'weekly',
    'about': 'monthly',
    'contact': 'monthly',
    'privacy': 'yearly',
    'terms': 'yearly'
  };
  
  return frequencies[pageName] || 'weekly';
}

function removeDuplicateRoutes(routes: DiscoveredRoute[]): DiscoveredRoute[] {
  const seen = new Set<string>();
  return routes.filter(route => {
    if (seen.has(route.url)) {
      return false;
    }
    seen.add(route.url);
    return true;
  });
}

function getFallbackRoutes(): DiscoveredRoute[] {
  // Fallback routes if discovery fails
  return [
    { url: '', priority: 1.0, changefreq: 'daily', type: 'static' },
    { url: '/all-online-calculators', priority: 0.9, changefreq: 'daily', type: 'static' },
    { url: '/categories', priority: 0.9, changefreq: 'weekly', type: 'static' },
    { url: '/popular', priority: 0.8, changefreq: 'daily', type: 'static' },
  ];
}

// Export function to clear cache (useful for development)
export function clearRouteCache(): void {
  routeCache = null;
  cacheTimestamp = 0;
}