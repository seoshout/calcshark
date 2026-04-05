import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCalculatorByNestedSlug, getCategoryBySlug, getSubcategoryBySlug, getCalculatorBySlug } from '@/lib/calculator-categories';
import BMICalculator from './calculators/BMICalculator';
import AdvancedBMICalculator from './calculators/AdvancedBMICalculator';
import CalculatorLayout from './components/CalculatorLayout';
import { generateSoftwareSchema, generateBreadcrumbSchema, generateSmartThermostatSchema, generateTireLifeSchema, generateOilChangeSchema, generateDogAgeSchema, generateCatAgeSchema, generateMortgageSchema, generateLoanPaymentSchema, generateCompoundInterestSchema, generateWeddingAlcoholSchema, generateCropRotationSchema, generateCooldownSchema, generatePondVolumeSchema, generateDPSCalculatorSchema, generateBreastmilkStorageCalculatorSchema, generateRecipeConverterCalculatorSchema, generateSpayNeuterCalculatorSchema, generateBoardingCostCalculatorSchema, generateFishingLineCapacityCalculatorSchema, generateQuarterbackRatingCalculatorSchema, generatePriceComparisonCalculatorSchema, generateDaysOnMarketCalculatorSchema, generateCarbonFootprintSchema, generateCommuteCostSchema, generateCostPerMileSchema, generateDieselVsGasSchema, generateE85VsRegularSchema, generateElectricVehicleSavingsSchema, generateFuelCostSchema, generateFuelEconomyComparisonSchema, generateFuelTankRangeSchema, generateGasMileageSchema, generateGasSavingsSchema, generateHybridSavingsSchema, generateMPGSchema, generateOctaneSchema, generateTripFuelSchema, generateMaintenanceSuiteSchema, generateVehicleCostsSuiteSchema } from '@/lib/schemas';
import { calculatorSEO } from '@/lib/seo';

interface CalculatorPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    calculator: string;
  }>;
}

function getCalculatorComponentForRoute(
  categorySlug: string,
  subcategorySlug: string,
  calculatorSlug: string
) {
  const nestedCalculatorKey = `${categorySlug}/${subcategorySlug}/${calculatorSlug}`;

  return (
    nestedCalculatorComponents[nestedCalculatorKey] ??
    calculatorComponents[calculatorSlug]
  );
}

// Generate metadata dynamically based on calculator
export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug, calculator: calculatorSlug } = await params;
  const calculator =
    getCalculatorByNestedSlug(categorySlug, subcategorySlug, calculatorSlug) ??
    getCalculatorBySlug(calculatorSlug);
  const CalculatorComponent = getCalculatorComponentForRoute(categorySlug, subcategorySlug, calculatorSlug);
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found | Calcshark',
      description: 'The calculator you are looking for could not be found.',
    };
  }

  // Get specific SEO data if available, otherwise use defaults
  const slug = calculator.slug.replace('-calculator', '');
  const seoData = calculatorSEO[slug as keyof typeof calculatorSEO];
  
  const title = seoData?.title || `Free Online ${calculator.name} - No Sign Up - No Login Required | Calcshark`;
  const description = seoData?.description || `${calculator.description}. Free Online ${calculator.name} - instant, accurate, and completely free to use. No registration required.`;
  const keywords = seoData?.keywords || [`free ${calculator.name.toLowerCase()}`, ...calculator.tags, 'online calculator', 'free calculator tool', 'no registration'];
  
  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    openGraph: {
      title,
      description,
      url: `https://calcshark.com/${categorySlug}/${subcategorySlug}/${calculator.slug}/`,
      type: 'website',
      images: [
        {
          url: `https://calcshark.com/og-calculator-${calculator.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: calculator.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://calcshark.com/og-calculator-${calculator.slug}.jpg`],
      creator: '@calcshark',
      site: '@calcshark',
    },
    alternates: {
      canonical: `https://calcshark.com/${categorySlug}/${subcategorySlug}/${calculator.slug}/`,
    },
    robots: {
      index: !!CalculatorComponent,
      follow: !!CalculatorComponent,
      googleBot: {
        index: !!CalculatorComponent,
        follow: !!CalculatorComponent,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'theme-color': '#8b5cf6',
      'apple-mobile-web-app-title': `${calculator.name} | Calcshark`,
    },
  };
}

// Import calculators
import AdvancedCompoundInterestCalculator from './calculators/AdvancedCompoundInterestCalculator';
import AdvancedMortgageCalculator from './calculators/AdvancedMortgageCalculator';
import AdvancedMortgageTermComparisonCalculator from './calculators/AdvancedMortgageTermComparisonCalculator';
import AdvancedMortgagePlanningSuiteCalculator from './calculators/AdvancedMortgagePlanningSuiteCalculator';
import AdvancedMortgageStrategySuiteCalculator from './calculators/AdvancedMortgageStrategySuiteCalculator';
import AdvancedMortgageEquitySuiteCalculator from './calculators/AdvancedMortgageEquitySuiteCalculator';
import AdvancedRetirementSuiteCalculator from './calculators/AdvancedRetirementSuiteCalculator';
import AdvancedOnePercentRuleCalculator from './calculators/AdvancedOnePercentRuleCalculator';
import AdvancedFiftyPercentRuleCalculator from './calculators/AdvancedFiftyPercentRuleCalculator';
import AdvancedSeventyPercentRuleCalculator from './calculators/AdvancedSeventyPercentRuleCalculator';
import AdvancedPropertyInvestmentSuiteCalculator from './calculators/AdvancedPropertyInvestmentSuiteCalculator';
import AdvancedBRRRRCalculator from './calculators/AdvancedBRRRRCalculator';
import AdvancedDealAcquisitionSuiteCalculator from './calculators/AdvancedDealAcquisitionSuiteCalculator';
import AdvancedLoanPaymentCalculator from './calculators/AdvancedLoanPaymentCalculator';
import AdvancedDogAgeCalculator from './calculators/AdvancedDogAgeCalculator';
import AdvancedCatAgeCalculator from './calculators/AdvancedCatAgeCalculator';
import AdvancedCooldownCalculator from './calculators/AdvancedCooldownCalculator';
import AdvancedCropRotationCalculator from './calculators/AdvancedCropRotationCalculator';
import AdvancedWeddingAlcoholCalculator from './calculators/AdvancedWeddingAlcoholCalculator';
import AdvancedSmartThermostatSavingsCalculator from './calculators/AdvancedSmartThermostatSavingsCalculator';
import AdvancedTireLifeCalculator from './calculators/AdvancedTireLifeCalculator';
import OilChangeIntervalCalculator from './calculators/OilChangeIntervalCalculator';
import AdvancedPondVolumeCalculator from './calculators/AdvancedPondVolumeCalculator';
import AdvancedDPSCalculator from './calculators/AdvancedDPSCalculator';
import AdvancedBreastmilkStorageCalculator from './calculators/AdvancedBreastmilkStorageCalculator';
import AdvancedRecipeConverterCalculator from './calculators/AdvancedRecipeConverterCalculator';
import AdvancedSpayNeuterCalculator from './calculators/AdvancedSpayNeuterCalculator';
import AdvancedBoardingCostCalculator from './calculators/AdvancedBoardingCostCalculator';
import AdvancedFishingLineCapacityCalculator from './calculators/AdvancedFishingLineCapacityCalculator';
import AdvancedQuarterbackRatingCalculator from './calculators/AdvancedQuarterbackRatingCalculator';
import AdvancedPriceComparisonCalculator from './calculators/AdvancedPriceComparisonCalculator';
import AdvancedDaysOnMarketCalculator from './calculators/AdvancedDaysOnMarketCalculator';
import AdvancedCarbonFootprintCalculator from './calculators/AdvancedCarbonFootprintCalculator';
import AdvancedCommuteCostCalculator from './calculators/AdvancedCommuteCostCalculator';
import AdvancedCostPerMileCalculator from './calculators/AdvancedCostPerMileCalculator';
import AdvancedDieselVsGasCalculator from './calculators/AdvancedDieselVsGasCalculator';
import AdvancedE85VsRegularCalculator from './calculators/AdvancedE85VsRegularCalculator';
import AdvancedElectricVehicleSavingsCalculator from './calculators/AdvancedElectricVehicleSavingsCalculator';
import AdvancedFuelCostCalculator from './calculators/AdvancedFuelCostCalculator';
import AdvancedFuelEconomyComparisonCalculator from './calculators/AdvancedFuelEconomyComparisonCalculator';
import AdvancedFuelTankRangeCalculator from './calculators/AdvancedFuelTankRangeCalculator';
import AdvancedGasMileageCalculator from './calculators/AdvancedGasMileageCalculator';
import AdvancedGasSavingsCalculator from './calculators/AdvancedGasSavingsCalculator';
import AdvancedHybridSavingsCalculator from './calculators/AdvancedHybridSavingsCalculator';
import AdvancedMPGCalculator from './calculators/AdvancedMPGCalculator';
import AdvancedOctaneCalculator from './calculators/AdvancedOctaneCalculator';
import AdvancedTripFuelCalculator from './calculators/AdvancedTripFuelCalculator';
import AdvancedBatteryLifeCalculator from './calculators/AdvancedBatteryLifeCalculator';
import AdvancedBrakePadLifeCalculator from './calculators/AdvancedBrakePadLifeCalculator';
import AdvancedDiagnosticTimeCalculator from './calculators/AdvancedDiagnosticTimeCalculator';
import AdvancedDiySavingsCalculator from './calculators/AdvancedDiySavingsCalculator';
import AdvancedFleetMaintenanceCalculator from './calculators/AdvancedFleetMaintenanceCalculator';
import AdvancedLaborRateCalculator from './calculators/AdvancedLaborRateCalculator';
import AdvancedMaintenanceScheduleCalculator from './calculators/AdvancedMaintenanceScheduleCalculator';
import AdvancedPartsMarkupCalculator from './calculators/AdvancedPartsMarkupCalculator';
import AdvancedRepairVsReplaceCalculator from './calculators/AdvancedRepairVsReplaceCalculator';
import AdvancedServiceCostEstimatorCalculator from './calculators/AdvancedServiceCostEstimatorCalculator';
import AdvancedTirePressureCalculator from './calculators/AdvancedTirePressureCalculator';
import AdvancedTireSizeCalculator from './calculators/AdvancedTireSizeCalculator';
import AdvancedWarrantyCoverageCalculator from './calculators/AdvancedWarrantyCoverageCalculator';
import AdvancedAutoLoanCalculator from './calculators/AdvancedAutoLoanCalculator';
import AdvancedCarDepreciationCalculator from './calculators/AdvancedCarDepreciationCalculator';
import AdvancedCarInsuranceCalculator from './calculators/AdvancedCarInsuranceCalculator';
import AdvancedCarLeaseCalculator from './calculators/AdvancedCarLeaseCalculator';
import AdvancedCarPaymentCalculator from './calculators/AdvancedCarPaymentCalculator';
import AdvancedDownPaymentCalculator from './calculators/AdvancedDownPaymentCalculator';
import AdvancedEarlyPayoffCalculator from './calculators/AdvancedEarlyPayoffCalculator';
import AdvancedExtendedWarrantyCalculator from './calculators/AdvancedExtendedWarrantyCalculator';
import AdvancedGapInsuranceCalculator from './calculators/AdvancedGapInsuranceCalculator';
import AdvancedInterestRateCalculator from './calculators/AdvancedInterestRateCalculator';
import AdvancedLeaseVsBuyCalculator from './calculators/AdvancedLeaseVsBuyCalculator';
import AdvancedRefinanceCalculator from './calculators/AdvancedRefinanceCalculator';
import AdvancedRegistrationFeeEstimatorCalculator from './calculators/AdvancedRegistrationFeeEstimatorCalculator';
import AdvancedTotalCostOfOwnershipCalculator from './calculators/AdvancedTotalCostOfOwnershipCalculator';
import AdvancedTradeInValueCalculator from './calculators/AdvancedTradeInValueCalculator';

// This would ideally be generated from a CMS or database
const calculatorComponents: { [key: string]: React.ComponentType<any> } = {
  'bmi-calculator': AdvancedBMICalculator, // Use the advanced version
  'basic-bmi-calculator': BMICalculator,   // Keep basic version available
  'compound-interest-calculator': AdvancedCompoundInterestCalculator,
  'mortgage-payment-calculator': AdvancedMortgageCalculator,
  '15-vs-30-year-mortgage-comparison-calculator': AdvancedMortgageTermComparisonCalculator,
  'mortgage-affordability-calculator': () => <AdvancedMortgagePlanningSuiteCalculator variant="mortgage-affordability" />,
  'mortgage-refinance-calculator': () => <AdvancedMortgageStrategySuiteCalculator variant="mortgage-refinance" />,
  'mortgage-amortization-calculator': () => <AdvancedMortgageStrategySuiteCalculator variant="mortgage-amortization" />,
  'private-mortgage-insurance-pmi-calculator': () => <AdvancedMortgagePlanningSuiteCalculator variant="pmi" />,
  'mortgage-points-calculator': () => <AdvancedMortgagePlanningSuiteCalculator variant="mortgage-points" />,
  'arm-vs-fixed-rate-calculator': () => <AdvancedMortgageStrategySuiteCalculator variant="arm-vs-fixed-rate" />,
  'extra-payment-calculator': () => <AdvancedMortgageStrategySuiteCalculator variant="extra-payment" />,
  'bi-weekly-mortgage-calculator': () => <AdvancedMortgageStrategySuiteCalculator variant="bi-weekly-mortgage" />,
  'home-equity-calculator': () => <AdvancedMortgageEquitySuiteCalculator variant="home-equity" />,
  'heloc-payment-calculator': () => <AdvancedMortgageEquitySuiteCalculator variant="heloc-payment" />,
  'closing-cost-calculator': () => <AdvancedMortgagePlanningSuiteCalculator variant="closing-cost" />,
  'rent-vs-buy-calculator': () => <AdvancedMortgageEquitySuiteCalculator variant="rent-vs-buy" />,
  'retirement-savings-calculator': () => <AdvancedRetirementSuiteCalculator variant="retirement-savings" />,
  '401k-calculator': () => <AdvancedRetirementSuiteCalculator variant="401k" />,
  'ira-calculator': () => <AdvancedRetirementSuiteCalculator variant="ira" />,
  'roth-ira-conversion-calculator': () => <AdvancedRetirementSuiteCalculator variant="roth-ira-conversion" />,
  'social-security-estimator-calculator': () => <AdvancedRetirementSuiteCalculator variant="social-security-estimator" />,
  'retirement-income-calculator': () => <AdvancedRetirementSuiteCalculator variant="retirement-income" />,
  'catch-up-contribution-calculator': () => <AdvancedRetirementSuiteCalculator variant="catch-up-contribution" />,
  'required-minimum-distribution-calculator': () => <AdvancedRetirementSuiteCalculator variant="required-minimum-distribution" />,
  'pension-calculator': () => <AdvancedRetirementSuiteCalculator variant="pension" />,
  'annuity-calculator': () => <AdvancedRetirementSuiteCalculator variant="annuity" />,
  'early-retirement-calculator': () => <AdvancedRetirementSuiteCalculator variant="early-retirement" />,
  'fire-calculator': () => <AdvancedRetirementSuiteCalculator variant="fire" />,
  'retirement-withdrawal-calculator': () => <AdvancedRetirementSuiteCalculator variant="retirement-withdrawal" />,
  'life-expectancy-calculator': () => <AdvancedRetirementSuiteCalculator variant="life-expectancy" />,
  'retirement-gap-calculator': () => <AdvancedRetirementSuiteCalculator variant="retirement-gap" />,
  'rental-property-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="rental-property" />,
  'cash-flow-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="cash-flow" />,
  'cap-rate-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="cap-rate" />,
  'roi-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="roi" />,
  'cash-on-cash-return-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="cash-on-cash-return" />,
  'noi-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="noi" />,
  'gross-rent-multiplier-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="gross-rent-multiplier" />,
  'property-appreciation-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="property-appreciation" />,
  'rental-yield-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="rental-yield" />,
  '1-rule-calculator': AdvancedOnePercentRuleCalculator,
  '50-rule-calculator': AdvancedFiftyPercentRuleCalculator,
  '70-rule-calculator': AdvancedSeventyPercentRuleCalculator,
  'brrrr-calculator': AdvancedBRRRRCalculator,
  'fix-and-flip-calculator': () => <AdvancedDealAcquisitionSuiteCalculator variant="fix-and-flip" />,
  'wholesale-calculator': () => <AdvancedDealAcquisitionSuiteCalculator variant="wholesale" />,
  'loan-payment-calculator': AdvancedLoanPaymentCalculator,
  'dog-age-calculator': AdvancedDogAgeCalculator,
  'cat-age-calculator': AdvancedCatAgeCalculator,
  'cooldown-reduction-calculator': AdvancedCooldownCalculator,
  'crop-rotation-calculator': AdvancedCropRotationCalculator,
  'wedding-alcohol-calculator': AdvancedWeddingAlcoholCalculator,
  'smart-thermostat-savings-calculator': AdvancedSmartThermostatSavingsCalculator,
  'tire-life-calculator': AdvancedTireLifeCalculator,
  'oil-change-interval-calculator': OilChangeIntervalCalculator,
  'pond-volume-calculator': AdvancedPondVolumeCalculator,
  'dps-calculator': AdvancedDPSCalculator,
  'breastmilk-storage-calculator': AdvancedBreastmilkStorageCalculator,
  'recipe-converter-calculator': AdvancedRecipeConverterCalculator,
  'spayneuter-cost-calculator': AdvancedSpayNeuterCalculator,
  'boarding-cost-calculator': AdvancedBoardingCostCalculator,
  'fishing-line-capacity-calculator': AdvancedFishingLineCapacityCalculator,
  'quarterback-rating-calculator': AdvancedQuarterbackRatingCalculator,
  'price-comparison-calculator': AdvancedPriceComparisonCalculator,
  'days-on-market-calculator': AdvancedDaysOnMarketCalculator,
  'carbon-footprint-calculator': AdvancedCarbonFootprintCalculator,
  'commute-cost-calculator': AdvancedCommuteCostCalculator,
  'cost-per-mile-calculator': AdvancedCostPerMileCalculator,
  'diesel-vs-gas-calculator': AdvancedDieselVsGasCalculator,
  'e85-vs-regular-calculator': AdvancedE85VsRegularCalculator,
  'electric-vehicle-savings-calculator': AdvancedElectricVehicleSavingsCalculator,
  'fuel-cost-calculator': AdvancedFuelCostCalculator,
  'fuel-economy-comparison-calculator': AdvancedFuelEconomyComparisonCalculator,
  'fuel-tank-range-calculator': AdvancedFuelTankRangeCalculator,
  'gas-mileage-calculator': AdvancedGasMileageCalculator,
  'gas-savings-calculator': AdvancedGasSavingsCalculator,
  'hybrid-savings-calculator': AdvancedHybridSavingsCalculator,
  'mpg-calculator': AdvancedMPGCalculator,
  'octane-calculator': AdvancedOctaneCalculator,
  'trip-fuel-calculator': AdvancedTripFuelCalculator,
  'battery-life-calculator': AdvancedBatteryLifeCalculator,
  'brake-pad-life-calculator': AdvancedBrakePadLifeCalculator,
  'diagnostic-time-calculator': AdvancedDiagnosticTimeCalculator,
  'diy-savings-calculator': AdvancedDiySavingsCalculator,
  'fleet-maintenance-calculator': AdvancedFleetMaintenanceCalculator,
  'labor-rate-calculator': AdvancedLaborRateCalculator,
  'maintenance-schedule-calculator': AdvancedMaintenanceScheduleCalculator,
  'parts-markup-calculator': AdvancedPartsMarkupCalculator,
  'repair-vs-replace-calculator': AdvancedRepairVsReplaceCalculator,
  'service-cost-estimator-calculator': AdvancedServiceCostEstimatorCalculator,
  'tire-pressure-calculator': AdvancedTirePressureCalculator,
  'tire-size-calculator': AdvancedTireSizeCalculator,
  'warranty-coverage-calculator': AdvancedWarrantyCoverageCalculator,
  'auto-loan-calculator': AdvancedAutoLoanCalculator,
  'car-depreciation-calculator': AdvancedCarDepreciationCalculator,
  'car-insurance-calculator': AdvancedCarInsuranceCalculator,
  'car-lease-calculator': AdvancedCarLeaseCalculator,
  'car-payment-calculator': AdvancedCarPaymentCalculator,
  'down-payment-calculator': AdvancedDownPaymentCalculator,
  'early-payoff-calculator': AdvancedEarlyPayoffCalculator,
  'extended-warranty-calculator': AdvancedExtendedWarrantyCalculator,
  'gap-insurance-calculator': AdvancedGapInsuranceCalculator,
  'interest-rate-calculator': AdvancedInterestRateCalculator,
  'lease-vs-buy-calculator': AdvancedLeaseVsBuyCalculator,
  'refinance-calculator': AdvancedRefinanceCalculator,
  'registration-fee-estimator-calculator': AdvancedRegistrationFeeEstimatorCalculator,
  'total-cost-of-ownership-calculator': AdvancedTotalCostOfOwnershipCalculator,
  'trade-in-value-calculator': AdvancedTradeInValueCalculator,
  // Add more calculators as we create them
  // etc.
};

const nestedCalculatorComponents: { [key: string]: React.ComponentType<any> } = {
  'finance-personal-finance/mortgages/down-payment-calculator': () => <AdvancedMortgagePlanningSuiteCalculator variant="down-payment" />,
};

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug, calculator: calculatorSlug } = await params;
  const calculatorFromLookup =
    getCalculatorByNestedSlug(categorySlug, subcategorySlug, calculatorSlug) ??
    getCalculatorBySlug(calculatorSlug);
  const CalculatorComponentFromSlug = getCalculatorComponentForRoute(categorySlug, subcategorySlug, calculatorSlug);
  const calculator = calculatorFromLookup ?? (
    CalculatorComponentFromSlug
      ? {
          id: calculatorSlug,
          name: calculatorSlug
            .replace(/-calculator$/, '')
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ') + ' Calculator',
          description: 'Quick and accurate calculations',
          slug: calculatorSlug,
          category: categorySlug,
          subcategory: subcategorySlug,
          tags: [],
          icon: 'Calculator',
          difficulty: 'advanced',
          popular: false
        }
      : undefined
  );
  
  if (!calculator) {
    notFound();
  }

  const category = getCategoryBySlug(categorySlug);
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
  const CalculatorComponent = calculatorComponents[calculator.slug] ?? CalculatorComponentFromSlug;

  // Prepare breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: category?.name || 'Category', url: `/${categorySlug}/` },
    { name: subcategory?.name || 'Subcategory', url: `/${categorySlug}/${subcategorySlug}/` },
    { name: calculator.name, url: `/${categorySlug}/${subcategorySlug}/${calculator.slug}/` }
  ];

  // Check if this calculator has a special comprehensive schema
  const hasComprehensiveSchema = [
    'smart-thermostat-savings-calculator',
    'tire-life-calculator',
    'oil-change-interval-calculator',
    'dog-age-calculator',
    'cat-age-calculator',
    'mortgage-payment-calculator',
    'loan-payment-calculator',
    'compound-interest-calculator',
    'wedding-alcohol-calculator',
    'crop-rotation-calculator',
    'cooldown-reduction-calculator',
    'pond-volume-calculator',
    'dps-calculator',
    'breastmilk-storage-calculator',
    'recipe-converter-calculator',
    'spayneuter-cost-calculator',
    'boarding-cost-calculator',
    'fishing-line-capacity-calculator',
    'quarterback-rating-calculator',
    'price-comparison-calculator',
    'days-on-market-calculator',
    'carbon-footprint-calculator',
    'commute-cost-calculator',
    'cost-per-mile-calculator',
    'diesel-vs-gas-calculator',
    'e85-vs-regular-calculator',
    'electric-vehicle-savings-calculator',
    'fuel-cost-calculator',
    'fuel-economy-comparison-calculator',
    'fuel-tank-range-calculator',
    'gas-mileage-calculator',
    'gas-savings-calculator',
    'hybrid-savings-calculator',
    'mpg-calculator',
    'octane-calculator',
    'trip-fuel-calculator',
    'battery-life-calculator',
    'brake-pad-life-calculator',
    'diagnostic-time-calculator',
    'diy-savings-calculator',
    'fleet-maintenance-calculator',
    'labor-rate-calculator',
    'maintenance-schedule-calculator',
    'parts-markup-calculator',
    'repair-vs-replace-calculator',
    'service-cost-estimator-calculator',
    'tire-pressure-calculator',
    'tire-size-calculator',
    'warranty-coverage-calculator',
    'auto-loan-calculator',
    'car-depreciation-calculator',
    'car-insurance-calculator',
    'car-lease-calculator',
    'car-payment-calculator',
    'down-payment-calculator',
    'early-payoff-calculator',
    'extended-warranty-calculator',
    'gap-insurance-calculator',
    'interest-rate-calculator',
    'lease-vs-buy-calculator',
    'refinance-calculator',
    'registration-fee-estimator-calculator',
    'total-cost-of-ownership-calculator',
    'trade-in-value-calculator'
  ].includes(calculator.slug);

  // Generate schemas based on calculator type
  let combinedSchema;
  if (calculator.slug === 'smart-thermostat-savings-calculator') {
    combinedSchema = generateSmartThermostatSchema(breadcrumbItems);
  } else if (calculator.slug === 'tire-life-calculator') {
    combinedSchema = generateTireLifeSchema(breadcrumbItems);
  } else if (calculator.slug === 'oil-change-interval-calculator') {
    combinedSchema = generateOilChangeSchema(breadcrumbItems);
  } else if (calculator.slug === 'dog-age-calculator') {
    combinedSchema = generateDogAgeSchema(breadcrumbItems);
  } else if (calculator.slug === 'cat-age-calculator') {
    combinedSchema = generateCatAgeSchema(breadcrumbItems);
  } else if (calculator.slug === 'mortgage-payment-calculator') {
    combinedSchema = generateMortgageSchema(breadcrumbItems);
  } else if (calculator.slug === 'loan-payment-calculator') {
    combinedSchema = generateLoanPaymentSchema(breadcrumbItems);
  } else if (calculator.slug === 'compound-interest-calculator') {
    combinedSchema = generateCompoundInterestSchema(breadcrumbItems);
  } else if (calculator.slug === 'wedding-alcohol-calculator') {
    combinedSchema = generateWeddingAlcoholSchema(breadcrumbItems);
  } else if (calculator.slug === 'crop-rotation-calculator') {
    combinedSchema = generateCropRotationSchema(breadcrumbItems);
  } else if (calculator.slug === 'cooldown-reduction-calculator') {
    combinedSchema = generateCooldownSchema(breadcrumbItems);
  } else if (calculator.slug === 'pond-volume-calculator') {
    combinedSchema = generatePondVolumeSchema(breadcrumbItems);
  } else if (calculator.slug === 'dps-calculator') {
    combinedSchema = generateDPSCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'breastmilk-storage-calculator') {
    combinedSchema = generateBreastmilkStorageCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'recipe-converter-calculator') {
    combinedSchema = generateRecipeConverterCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'spayneuter-cost-calculator') {
    combinedSchema = generateSpayNeuterCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'boarding-cost-calculator') {
    combinedSchema = generateBoardingCostCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'fishing-line-capacity-calculator') {
    combinedSchema = generateFishingLineCapacityCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'quarterback-rating-calculator') {
    combinedSchema = generateQuarterbackRatingCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'price-comparison-calculator') {
    combinedSchema = generatePriceComparisonCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'days-on-market-calculator') {
    combinedSchema = generateDaysOnMarketCalculatorSchema(breadcrumbItems);
  } else if (calculator.slug === 'carbon-footprint-calculator') {
    combinedSchema = generateCarbonFootprintSchema(breadcrumbItems);
  } else if (calculator.slug === 'commute-cost-calculator') {
    combinedSchema = generateCommuteCostSchema(breadcrumbItems);
  } else if (calculator.slug === 'cost-per-mile-calculator') {
    combinedSchema = generateCostPerMileSchema(breadcrumbItems);
  } else if (calculator.slug === 'diesel-vs-gas-calculator') {
    combinedSchema = generateDieselVsGasSchema(breadcrumbItems);
  } else if (calculator.slug === 'e85-vs-regular-calculator') {
    combinedSchema = generateE85VsRegularSchema(breadcrumbItems);
  } else if (calculator.slug === 'electric-vehicle-savings-calculator') {
    combinedSchema = generateElectricVehicleSavingsSchema(breadcrumbItems);
  } else if (calculator.slug === 'fuel-cost-calculator') {
    combinedSchema = generateFuelCostSchema(breadcrumbItems);
  } else if (calculator.slug === 'fuel-economy-comparison-calculator') {
    combinedSchema = generateFuelEconomyComparisonSchema(breadcrumbItems);
  } else if (calculator.slug === 'fuel-tank-range-calculator') {
    combinedSchema = generateFuelTankRangeSchema(breadcrumbItems);
  } else if (calculator.slug === 'gas-mileage-calculator') {
    combinedSchema = generateGasMileageSchema(breadcrumbItems);
  } else if (calculator.slug === 'gas-savings-calculator') {
    combinedSchema = generateGasSavingsSchema(breadcrumbItems);
  } else if (calculator.slug === 'hybrid-savings-calculator') {
    combinedSchema = generateHybridSavingsSchema(breadcrumbItems);
  } else if (calculator.slug === 'mpg-calculator') {
    combinedSchema = generateMPGSchema(breadcrumbItems);
  } else if (calculator.slug === 'octane-calculator') {
    combinedSchema = generateOctaneSchema(breadcrumbItems);
  } else if (calculator.slug === 'trip-fuel-calculator') {
    combinedSchema = generateTripFuelSchema(breadcrumbItems);
  } else if (
    [
      'battery-life-calculator',
      'brake-pad-life-calculator',
      'diagnostic-time-calculator',
      'diy-savings-calculator',
      'fleet-maintenance-calculator',
      'labor-rate-calculator',
      'maintenance-schedule-calculator',
      'parts-markup-calculator',
      'repair-vs-replace-calculator',
      'service-cost-estimator-calculator',
      'tire-pressure-calculator',
      'tire-size-calculator',
      'warranty-coverage-calculator'
    ].includes(calculator.slug)
  ) {
    combinedSchema = generateMaintenanceSuiteSchema(calculator.slug, breadcrumbItems);
  } else if (
    [
      'auto-loan-calculator',
      'car-depreciation-calculator',
      'car-insurance-calculator',
      'car-lease-calculator',
      'car-payment-calculator',
      'down-payment-calculator',
      'early-payoff-calculator',
      'extended-warranty-calculator',
      'gap-insurance-calculator',
      'interest-rate-calculator',
      'lease-vs-buy-calculator',
      'refinance-calculator',
      'registration-fee-estimator-calculator',
      'total-cost-of-ownership-calculator',
      'trade-in-value-calculator'
    ].includes(calculator.slug)
  ) {
    combinedSchema = generateVehicleCostsSuiteSchema(calculator.slug, breadcrumbItems);
  } else {
    // Use standard schemas for other calculators
    const softwareSchema = generateSoftwareSchema(
      calculator.name,
      calculator.description,
      category?.name || 'Calculator'
    );
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    // Keep both schemas separate for other calculators
    combinedSchema = { software: softwareSchema, breadcrumb: breadcrumbSchema };
  }
  
  // If we haven't implemented this calculator yet, show a coming soon message
  if (!CalculatorComponent) {
    return (
      <CalculatorLayout calculator={calculator} category={category}>
        {/* Schemas */}
        {hasComprehensiveSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(combinedSchema),
            }}
          />
        ) : (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify((combinedSchema as any).software),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify((combinedSchema as any).breadcrumb),
              }}
            />
          </>
        )}
          <div className="bg-background border rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                This calculator is currently under development. We're working hard to bring you the best calculation experience.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>In the meantime, you can:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Browse our <a href="/popular/" className="text-primary hover:underline">popular calculators</a></li>
                  <li>Explore the <a href={`/${categorySlug}/`} className="text-primary hover:underline">{category?.name}</a> category</li>
                  <li>View <a href="/all-online-calculators/" className="text-primary hover:underline">all available calculators</a></li>
                </ul>
              </div>
            </div>
          </div>
        </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout calculator={calculator} category={category}>
      {/* Schemas */}
      {hasComprehensiveSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema),
          }}
        />
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify((combinedSchema as any).software),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify((combinedSchema as any).breadcrumb),
            }}
          />
        </>
      )}

      <CalculatorComponent />
    </CalculatorLayout>
  );
}

