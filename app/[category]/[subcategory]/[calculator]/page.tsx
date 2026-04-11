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
  const routeScopedCalculatorSlugs = new Set([
    'cash-flow-calculator',
    'roi-calculator',
    'down-payment-calculator',
  ]);

  if (nestedCalculatorComponents[nestedCalculatorKey]) {
    return nestedCalculatorComponents[nestedCalculatorKey];
  }

  if (routeScopedCalculatorSlugs.has(calculatorSlug)) {
    return undefined;
  }

  return calculatorComponents[calculatorSlug];
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
import AdvancedAlgebraSuiteCalculator from '@/components/advanced-algebra-suite-calculator';
import AdvancedBusinessFinanceSuiteCalculator from '@/components/advanced-business-finance-suite-calculator';
import AdvancedHumanResourcesSuiteCalculator from '@/components/advanced-human-resources-suite-calculator';
import AdvancedProductivityEfficiencySuiteCalculator from '@/components/advanced-productivity-efficiency-suite-calculator';
import AdvancedSalesMarketingSuiteCalculator from '@/components/advanced-sales-marketing-suite-calculator';
import AdvancedFlooringSuiteCalculator from '@/components/advanced-flooring-suite-calculator';
import AdvancedMaterialsQuantitiesSuiteCalculator from '@/components/advanced-materials-quantities-suite-calculator';
import AdvancedPaintWallCoveringSuiteCalculator from '@/components/advanced-paint-wall-covering-suite-calculator';
import AdvancedRoofingSidingSuiteCalculator from '@/components/advanced-roofing-siding-suite-calculator';
import AdvancedKitchenMeasurementsSuiteCalculator from '@/components/advanced-kitchen-measurements-suite-calculator';
import AdvancedRecipeCalculationsSuiteCalculator from '@/components/advanced-recipe-calculations-suite-calculator';
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
  'quadratic-formula-calculator': () => <AdvancedAlgebraSuiteCalculator variant="quadratic-formula" />,
  'slope-calculator': () => <AdvancedAlgebraSuiteCalculator variant="slope" />,
  'distance-formula-calculator': () => <AdvancedAlgebraSuiteCalculator variant="distance-formula" />,
  'midpoint-calculator': () => <AdvancedAlgebraSuiteCalculator variant="midpoint" />,
  'linear-equation-calculator': () => <AdvancedAlgebraSuiteCalculator variant="linear-equation" />,
  'system-of-equations-calculator': () => <AdvancedAlgebraSuiteCalculator variant="system-of-equations" />,
  'polynomial-calculator': () => <AdvancedAlgebraSuiteCalculator variant="polynomial" />,
  'factoring-calculator': () => <AdvancedAlgebraSuiteCalculator variant="factoring" />,
  'exponent-calculator': () => <AdvancedAlgebraSuiteCalculator variant="exponent" />,
  'logarithm-calculator': () => <AdvancedAlgebraSuiteCalculator variant="logarithm" />,
  'scientific-notation-calculator': () => <AdvancedAlgebraSuiteCalculator variant="scientific-notation" />,
  'square-root-calculator': () => <AdvancedAlgebraSuiteCalculator variant="square-root" />,
  'cube-root-calculator': () => <AdvancedAlgebraSuiteCalculator variant="cube-root" />,
  'nth-root-calculator': () => <AdvancedAlgebraSuiteCalculator variant="nth-root" />,
  'absolute-value-calculator': () => <AdvancedAlgebraSuiteCalculator variant="absolute-value" />,
  'break-even-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="break-even" />,
  'profit-margin-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="profit-margin" />,
  'markup-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="markup" />,
  'gross-profit-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="gross-profit" />,
  'net-profit-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="net-profit" />,
  'payback-period-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="payback-period" />,
  'npv-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="npv" />,
  'irr-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="irr" />,
  'working-capital-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="working-capital" />,
  'burn-rate-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="burn-rate" />,
  'customer-acquisition-cost-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="customer-acquisition-cost" />,
  'customer-lifetime-value-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="customer-lifetime-value" />,
  'business-valuation-calculator': () => <AdvancedBusinessFinanceSuiteCalculator variant="business-valuation" />,
  'salary-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="salary" />,
  'hourly-wage-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="hourly-wage" />,
  'overtime-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="overtime" />,
  'payroll-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="payroll" />,
  'employee-cost-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="employee-cost" />,
  'pto-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="pto" />,
  'sick-leave-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="sick-leave" />,
  'holiday-pay-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="holiday-pay" />,
  'severance-pay-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="severance-pay" />,
  'employee-turnover-cost-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="employee-turnover-cost" />,
  'recruitment-cost-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="recruitment-cost" />,
  'training-roi-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="training-roi" />,
  'benefits-cost-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="benefits-cost" />,
  'workers-comp-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="workers-comp" />,
  'fte-calculator': () => <AdvancedHumanResourcesSuiteCalculator variant="fte" />,
  'time-tracking-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="time-tracking" />,
  'billable-hours-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="billable-hours" />,
  'utilization-rate-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="utilization-rate" />,
  'productivity-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="productivity" />,
  'efficiency-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="efficiency" />,
  'oee-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="oee" />,
  'cycle-time-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="cycle-time" />,
  'takt-time-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="takt-time" />,
  'lead-time-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="lead-time" />,
  'throughput-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="throughput" />,
  'capacity-planning-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="capacity-planning" />,
  'resource-allocation-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="resource-allocation" />,
  'project-roi-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="project-roi" />,
  'meeting-cost-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="meeting-cost" />,
  'deadline-calculator': () => <AdvancedProductivityEfficiencySuiteCalculator variant="deadline" />,
  'sales-commission-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="sales-commission" />,
  'sales-tax-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="sales-tax" />,
  'discount-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="discount" />,
  'price-increase-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="price-increase" />,
  'conversion-rate-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="conversion-rate" />,
  'lead-generation-roi-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="lead-generation-roi" />,
  'marketing-roi-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="marketing-roi" />,
  'email-marketing-roi-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="email-marketing-roi" />,
  'cost-per-click-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="cost-per-click" />,
  'cost-per-acquisition-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="cost-per-acquisition" />,
  'click-through-rate-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="click-through-rate" />,
  'engagement-rate-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="engagement-rate" />,
  'ab-test-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="ab-test" />,
  'sample-size-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="sample-size" />,
  'market-share-calculator': () => <AdvancedSalesMarketingSuiteCalculator variant="market-share" />,
  'flooring-calculator': () => <AdvancedFlooringSuiteCalculator variant="flooring" />,
  'tile-calculator': () => <AdvancedFlooringSuiteCalculator variant="tile" />,
  'grout-calculator': () => <AdvancedFlooringSuiteCalculator variant="grout" />,
  'thinset-calculator': () => <AdvancedFlooringSuiteCalculator variant="thinset" />,
  'hardwood-flooring-calculator': () => <AdvancedFlooringSuiteCalculator variant="hardwood" />,
  'laminate-calculator': () => <AdvancedFlooringSuiteCalculator variant="laminate" />,
  'vinyl-flooring-calculator': () => <AdvancedFlooringSuiteCalculator variant="vinyl" />,
  'carpet-calculator': () => <AdvancedFlooringSuiteCalculator variant="carpet" />,
  'underlayment-calculator': () => <AdvancedFlooringSuiteCalculator variant="underlayment" />,
  'subfloor-calculator': () => <AdvancedFlooringSuiteCalculator variant="subfloor" />,
  'baseboard-calculator': () => <AdvancedFlooringSuiteCalculator variant="baseboard" />,
  'transition-strip-calculator': () => <AdvancedFlooringSuiteCalculator variant="transition-strip" />,
  'floor-joist-calculator': () => <AdvancedFlooringSuiteCalculator variant="floor-joist" />,
  'floor-leveling-calculator': () => <AdvancedFlooringSuiteCalculator variant="floor-leveling" />,
  'floor-heating-calculator': () => <AdvancedFlooringSuiteCalculator variant="floor-heating" />,
  'concrete-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="concrete" />,
  'concrete-block-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="concrete-block" />,
  'concrete-column-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="concrete-column" />,
  'concrete-slab-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="concrete-slab" />,
  'concrete-stairs-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="concrete-stairs" />,
  'gravel-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="gravel" />,
  'sand-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="sand" />,
  'topsoil-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="topsoil" />,
  'mulch-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="mulch" />,
  'aggregate-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="aggregate" />,
  'asphalt-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="asphalt" />,
  'rebar-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="rebar" />,
  'brick-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="brick" />,
  'paver-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="paver" />,
  'stone-calculator': () => <AdvancedMaterialsQuantitiesSuiteCalculator variant="stone" />,
  'paint-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="paint" />,
  'ceiling-paint-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="ceiling-paint" />,
  'primer-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="primer" />,
  'wallpaper-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="wallpaper" />,
  'wall-area-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="wall-area" />,
  'texture-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="texture" />,
  'stain-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="stain" />,
  'deck-stain-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="deck-stain" />,
  'spray-paint-coverage-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="spray-paint-coverage" />,
  'paint-mixing-ratio-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="paint-mixing-ratio" />,
  'number-of-coats-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="number-of-coats" />,
  'trim-paint-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="trim-paint" />,
  'cabinet-paint-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="cabinet-paint" />,
  'epoxy-coverage-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="epoxy-coverage" />,
  'touch-up-paint-calculator': () => <AdvancedPaintWallCoveringSuiteCalculator variant="touch-up-paint" />,
  'roof-area-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="roof-area" />,
  'shingle-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="shingle" />,
  'metal-roofing-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="metal-roofing" />,
  'roof-pitch-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="roof-pitch" />,
  'rafter-length-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="rafter-length" />,
  'ridge-cap-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="ridge-cap" />,
  'roof-ventilation-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="roof-ventilation" />,
  'gutter-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="gutter" />,
  'downspout-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="downspout" />,
  'fascia-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="fascia" />,
  'soffit-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="soffit" />,
  'siding-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="siding" />,
  'vinyl-siding-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="vinyl-siding" />,
  'board-and-batten-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="board-and-batten" />,
  'house-wrap-calculator': () => <AdvancedRoofingSidingSuiteCalculator variant="house-wrap" />,
  'cups-to-grams-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="cups-to-grams" />,
  'ounces-to-grams-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="ounces-to-grams" />,
  'tablespoon-to-cup-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="tablespoon-to-cup" />,
  'metric-to-imperial-converter-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="metric-to-imperial-converter" />,
  'temperature-conversion-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="temperature-conversion" />,
  'baking-pan-conversion-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="baking-pan-conversion" />,
  'egg-size-substitution-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="egg-size-substitution" />,
  'butter-conversion-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="butter-conversion" />,
  'sugar-substitution-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="sugar-substitution" />,
  'flour-weight-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="flour-weight" />,
  'liquid-measurement-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="liquid-measurement" />,
  'dry-measurement-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="dry-measurement" />,
  'kitchen-timer-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="kitchen-timer" />,
  'proof-time-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="proof-time" />,
  'fermentation-calculator': () => <AdvancedKitchenMeasurementsSuiteCalculator variant="fermentation" />,
  'recipe-converter-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="recipe-converter" />,
  'serving-size-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="serving-size" />,
  'recipe-scaling-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="recipe-scaling" />,
  'ingredient-substitution-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="ingredient-substitution" />,
  'cooking-time-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="cooking-time" />,
  'meat-cooking-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="meat-cooking" />,
  'baking-ratio-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="baking-ratio" />,
  'yeast-conversion-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="yeast-conversion" />,
  'recipe-cost-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="recipe-cost" />,
  'nutrition-label-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="nutrition-label" />,
  'menu-pricing-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="menu-pricing" />,
  'food-waste-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="food-waste" />,
  'batch-cooking-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="batch-cooking" />,
  'freezer-storage-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="freezer-storage" />,
  'pantry-inventory-calculator': () => <AdvancedRecipeCalculationsSuiteCalculator variant="pantry-inventory" />,
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
  'automotive-transportation/vehicle-costs/down-payment-calculator': AdvancedDownPaymentCalculator,
  'real-estate-property/property-investment/cash-flow-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="cash-flow" />,
  'real-estate-property/property-investment/roi-calculator': () => <AdvancedPropertyInvestmentSuiteCalculator variant="roi" />,
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

