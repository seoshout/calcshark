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
  const currentDate = '2025-09-01T00:00:00.000Z';

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
    // First, check which calculator components actually exist
    const calculatorsDir = path.join(process.cwd(), 'app', '[category]', '[subcategory]', '[calculator]', 'calculators');
    
    if (await fileExists(calculatorsDir)) {
      const calculatorFiles = await fs.readdir(calculatorsDir);
      const existingComponents = calculatorFiles
        .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
        .map(file => componentNameToSlug(file.replace('.tsx', '')));
      const registeredCalculatorSlugs = await discoverRegisteredCalculatorSlugs();
      const implementedSlugs = new Set([
        ...existingComponents,
        ...registeredCalculatorSlugs,
      ]);
      
      // Import calculator categories to get the actual structure
      const { calculatorCategories, popularCalculators } = await import('./calculator-categories');
      
      for (const category of calculatorCategories) {
        for (const subcategory of category.subcategories) {
          for (const calculator of subcategory.calculators) {
            // Only include calculators that have actual component files
            if (implementedSlugs.has(calculator.slug)) {
              const isPopular = popularCalculators.includes(calculator.slug);
              
              routes.push({
                url: `/${category.slug}/${subcategory.slug}/${calculator.slug}/`,
                priority: isPopular ? 0.9 : 0.7,
                changefreq: 'monthly' as const,
                type: 'calculator' as const
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Could not discover calculator routes:', error instanceof Error ? error.message : String(error));
  }

  return routes;
}

async function discoverRegisteredCalculatorSlugs(): Promise<string[]> {
  try {
    const calculatorPagePath = path.join(
      process.cwd(),
      'app',
      '[category]',
      '[subcategory]',
      '[calculator]',
      'page.tsx'
    );

    if (!(await fileExists(calculatorPagePath))) {
      return [];
    }

    const pageSource = await fs.readFile(calculatorPagePath, 'utf8');
    const matches = pageSource.matchAll(/'([^']+-calculator)'(?=\s*:)/g);

    return Array.from(new Set(Array.from(matches, (match) => match[1])));
  } catch (error) {
    console.warn('Could not discover registered calculator slugs:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

async function discoverCategoryPages(): Promise<DiscoveredRoute[]> {
  const routes: DiscoveredRoute[] = [];
  
  try {
    // Import calculator categories to get actual category and subcategory slugs
    const { calculatorCategories } = await import('./calculator-categories');
    
    for (const category of calculatorCategories) {
      // Add category page
      routes.push({
        url: `/${category.slug}/`,
        priority: 0.8,
        changefreq: 'weekly',
        type: 'category'
      });
      
      // Add subcategory pages
      for (const subcategory of category.subcategories) {
        routes.push({
          url: `/${category.slug}/${subcategory.slug}/`,
          priority: 0.7,
          changefreq: 'weekly',
          type: 'category'
        });
      }
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
  // Handle specific known mappings to match actual calculator slugs
  const knownMappings: { [key: string]: string } = {
    'BMICalculator': 'bmi-calculator',
    'AdvancedBMICalculator': 'bmi-calculator',
    'AdvancedMortgageCalculator': 'mortgage-payment-calculator',
    'AdvancedCompoundInterestCalculator': 'compound-interest-calculator',
    'AdvancedPondVolumeCalculator': 'pond-volume-calculator',
    'AdvancedDPSCalculator': 'dps-calculator',
    'AdvancedBreastmilkStorageCalculator': 'breastmilk-storage-calculator',
    'AdvancedRecipeConverterCalculator': 'recipe-converter-calculator',
    'AdvancedSpayNeuterCalculator': 'spayneuter-cost-calculator',
    'AdvancedBoardingCostCalculator': 'boarding-cost-calculator',
    'AdvancedFishingLineCapacityCalculator': 'fishing-line-capacity-calculator',
    'AdvancedQuarterbackRatingCalculator': 'quarterback-rating-calculator',
    'AdvancedPriceComparisonCalculator': 'price-comparison-calculator',
    'AdvancedDaysOnMarketCalculator': 'days-on-market-calculator',
    'AdvancedCarbonFootprintCalculator': 'carbon-footprint-calculator',
    'AdvancedCommuteCostCalculator': 'commute-cost-calculator',
    'AdvancedCostPerMileCalculator': 'cost-per-mile-calculator',
    'AdvancedDieselVsGasCalculator': 'diesel-vs-gas-calculator',
    'AdvancedE85VsRegularCalculator': 'e85-vs-regular-calculator',
    'AdvancedElectricVehicleSavingsCalculator': 'electric-vehicle-savings-calculator',
    'AdvancedFuelCostCalculator': 'fuel-cost-calculator',
    'AdvancedFuelEconomyComparisonCalculator': 'fuel-economy-comparison-calculator',
    'AdvancedFuelTankRangeCalculator': 'fuel-tank-range-calculator',
    'AdvancedGasMileageCalculator': 'gas-mileage-calculator',
    'AdvancedGasSavingsCalculator': 'gas-savings-calculator',
    'AdvancedHybridSavingsCalculator': 'hybrid-savings-calculator',
    'AdvancedMPGCalculator': 'mpg-calculator',
    'AdvancedOctaneCalculator': 'octane-calculator',
    'AdvancedTripFuelCalculator': 'trip-fuel-calculator',
    'AdvancedBatteryLifeCalculator': 'battery-life-calculator',
    'AdvancedBrakePadLifeCalculator': 'brake-pad-life-calculator',
    'AdvancedDiagnosticTimeCalculator': 'diagnostic-time-calculator',
    'AdvancedDiySavingsCalculator': 'diy-savings-calculator',
    'AdvancedFleetMaintenanceCalculator': 'fleet-maintenance-calculator',
    'AdvancedLaborRateCalculator': 'labor-rate-calculator',
    'AdvancedMaintenanceScheduleCalculator': 'maintenance-schedule-calculator',
    'AdvancedPartsMarkupCalculator': 'parts-markup-calculator',
    'AdvancedRepairVsReplaceCalculator': 'repair-vs-replace-calculator',
    'AdvancedServiceCostEstimatorCalculator': 'service-cost-estimator-calculator',
    'AdvancedTirePressureCalculator': 'tire-pressure-calculator',
    'AdvancedTireSizeCalculator': 'tire-size-calculator',
    'AdvancedWarrantyCoverageCalculator': 'warranty-coverage-calculator',
    'AdvancedAutoLoanCalculator': 'auto-loan-calculator',
    'AdvancedCarDepreciationCalculator': 'car-depreciation-calculator',
    'AdvancedCarInsuranceCalculator': 'car-insurance-calculator',
    'AdvancedCarLeaseCalculator': 'car-lease-calculator',
    'AdvancedCarPaymentCalculator': 'car-payment-calculator',
    'AdvancedDownPaymentCalculator': 'down-payment-calculator',
    'AdvancedEarlyPayoffCalculator': 'early-payoff-calculator',
    'AdvancedExtendedWarrantyCalculator': 'extended-warranty-calculator',
    'AdvancedGapInsuranceCalculator': 'gap-insurance-calculator',
    'AdvancedInterestRateCalculator': 'interest-rate-calculator',
    'AdvancedLeaseVsBuyCalculator': 'lease-vs-buy-calculator',
    'AdvancedRefinanceCalculator': 'refinance-calculator',
    'AdvancedRegistrationFeeEstimatorCalculator': 'registration-fee-estimator-calculator',
    'AdvancedTotalCostOfOwnershipCalculator': 'total-cost-of-ownership-calculator',
    'AdvancedTradeInValueCalculator': 'trade-in-value-calculator'
  };

  if (knownMappings[componentName]) {
    return knownMappings[componentName];
  }

  // Fallback to automatic conversion that keeps the -calculator suffix
  return componentName
    .replace(/Advanced/, '') // Remove Advanced prefix
    .replace(/([A-Z])/g, '-$1') // Add hyphens before capital letters
    .toLowerCase()
    .replace(/^-/, '') // Remove leading hyphen
    .replace(/--+/g, '-'); // Replace multiple hyphens with single
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
