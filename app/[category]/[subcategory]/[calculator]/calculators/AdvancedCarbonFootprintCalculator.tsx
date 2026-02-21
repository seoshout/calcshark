'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cloud,
  Factory,
  Gauge,
  Globe,
  Home,
  Leaf,
  Lightbulb,
  MessageSquare,
  Plane,
  RefreshCw,
  Scale,
  Shield,
  ShoppingBag,
  Target,
  Train,
  Trash2,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode =
  | 'basic'
  | 'comprehensive'
  | 'comparison'
  | 'reduction-planner'
  | 'lifestyle-audit';

type VehicleType = 'gasoline' | 'hybrid' | 'diesel' | 'ev';
type DietType = 'omnivore' | 'low-meat' | 'pescatarian' | 'vegetarian' | 'vegan';

interface CarbonInputs {
  calculationMode: CalculationMode;
  vehicleType: VehicleType;
  dietType: DietType;

  electricityKwhPerYear: string;
  naturalGasThermsPerYear: string;
  heatingOilGallonsPerYear: string;
  propaneGallonsPerYear: string;
  renewableElectricityPercent: string;

  annualVehicleMiles: string;
  vehicleMpg: string;
  publicTransitMilesPerYear: string;
  shortFlightsPerYear: string;
  longFlightsPerYear: string;
  workFromHomeDaysPerWeek: string;

  shoppingSpendPerMonth: string;
  wasteLbsPerWeek: string;
  recyclingRatePercent: string;

  householdSize: string;
  includeUncertaintyRange: boolean;
  includeConsumptionCategory: boolean;
  showPerPersonView: boolean;
}

interface CarbonBreakdown {
  homeEnergyKg: number;
  transportationKg: number;
  flightsKg: number;
  foodKg: number;
  consumptionKg: number;
  wasteKg: number;
}

interface ReductionScenario {
  label: string;
  annualSavingsKg: number;
  annualSavingsTons: number;
  implementationNotes: string;
}

interface CarbonResult {
  totalKg: number;
  totalTons: number;
  perPersonKg: number;
  perPersonTons: number;
  nationalAveragePerPersonTons: number;
  parisAlignedPerPersonTons: number;
  vsUSAveragePercent: number;
  vsParisTargetPercent: number;
  breakdown: CarbonBreakdown;
  largestContributor: string;
  treesNeededForOffset: number;
  drivingMilesEquivalent: number;
  confidenceLowKg?: number;
  confidenceHighKg?: number;
  recommendations: string[];
  tips: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
  reductionScenarios: ReductionScenario[];
}

const AdvancedCarbonFootprintCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [result, setResult] = useState<CarbonResult | null>(null);

  const [inputs, setInputs] = useState<CarbonInputs>({
    calculationMode: 'comprehensive',
    vehicleType: 'gasoline',
    dietType: 'omnivore',

    electricityKwhPerYear: '10600',
    naturalGasThermsPerYear: '410',
    heatingOilGallonsPerYear: '0',
    propaneGallonsPerYear: '0',
    renewableElectricityPercent: '0',

    annualVehicleMiles: '12000',
    vehicleMpg: '26',
    publicTransitMilesPerYear: '1200',
    shortFlightsPerYear: '2',
    longFlightsPerYear: '1',
    workFromHomeDaysPerWeek: '1',

    shoppingSpendPerMonth: '450',
    wasteLbsPerWeek: '28',
    recyclingRatePercent: '25',

    householdSize: '2',
    includeUncertaintyRange: true,
    includeConsumptionCategory: true,
    showPerPersonView: true
  });

  const emissionFactors = {
    electricityKgPerKwh: 0.367,
    naturalGasKgPerTherm: 5.27,
    heatingOilKgPerGallon: 10.21,
    propaneKgPerGallon: 5.74,
    gasolineKgPerGallon: 8.89,
    dieselKgPerGallon: 10.18,
    evKgPerMile: 0.12,
    transitKgPerMile: 0.089,
    shortFlightKgEach: 300,
    longFlightKgEach: 1100,
    wasteKgPerLb: 0.24,
    shoppingKgPerDollar: 0.32,
    treeOffsetKgPerYear: 21.77,
    drivingKgPerMile: 0.404
  };

  const dietAnnualKg: Record<DietType, number> = {
    omnivore: 2500,
    'low-meat': 1900,
    pescatarian: 1700,
    vegetarian: 1400,
    vegan: 1000
  };

  const parseNonNegative = (value: string): number => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      return 0;
    }
    return parsed;
  };

  const handleInputChange = (field: keyof CarbonInputs, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const getVehicleDisplayName = (type: VehicleType): string => {
    const map: Record<VehicleType, string> = {
      gasoline: 'Gasoline Vehicle',
      hybrid: 'Hybrid Vehicle',
      diesel: 'Diesel Vehicle',
      ev: 'Electric Vehicle'
    };
    return map[type];
  };

  const getDietDisplayName = (type: DietType): string => {
    const map: Record<DietType, string> = {
      omnivore: 'Omnivore',
      'low-meat': 'Low-Meat',
      pescatarian: 'Pescatarian',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan'
    };
    return map[type];
  };

  const getVehicleKgPerMile = (type: VehicleType, mpg: number): number => {
    if (type === 'ev') return emissionFactors.evKgPerMile;
    if (type === 'hybrid') return emissionFactors.gasolineKgPerGallon / Math.max(50, mpg || 0);
    if (type === 'diesel') return emissionFactors.dieselKgPerGallon / Math.max(mpg || 0, 1);
    return emissionFactors.gasolineKgPerGallon / Math.max(mpg || 0, 1);
  };

  const getLargestContributorLabel = (breakdown: CarbonBreakdown): string => {
    const labeled: Array<[string, number]> = [
      ['Home Energy', breakdown.homeEnergyKg],
      ['Transportation', breakdown.transportationKg],
      ['Flights', breakdown.flightsKg],
      ['Food', breakdown.foodKg],
      ['Consumption', breakdown.consumptionKg],
      ['Waste', breakdown.wasteKg]
    ];

    return [...labeled].sort((a, b) => b[1] - a[1])[0][0];
  };

  const generateRecommendations = (breakdown: CarbonBreakdown, perPersonTons: number): string[] => {
    const recs: string[] = [];

    if (breakdown.transportationKg > 3500) {
      recs.push(
        'Transportation is your largest emissions driver. Prioritize fewer car miles, higher MPG choices, and transit substitution.'
      );
    }

    if (breakdown.homeEnergyKg > 4000) {
      recs.push(
        'Home energy emissions are elevated. Focus on insulation, thermostat optimization, and appliance efficiency upgrades.'
      );
    }

    if (inputs.renewableElectricityPercent === '0') {
      recs.push(
        'You currently use 0% renewable electricity in this model. Community solar or green utility plans can lower electricity emissions quickly.'
      );
    }

    if (inputs.shortFlightsPerYear !== '0' || inputs.longFlightsPerYear !== '0') {
      recs.push(
        'Flight emissions are concentrated and high-impact. Replace one long trip with rail/domestic alternatives where possible.'
      );
    }

    if (inputs.dietType === 'omnivore') {
      recs.push(
        'Diet is modeled at omnivore intensity. A shift toward low-meat or pescatarian patterns can produce meaningful annual reductions.'
      );
    }

    if (perPersonTons > 16) {
      recs.push(
        'Your per-person estimate is above the U.S. average baseline. Set a 12-month reduction target by category and track quarterly progress.'
      );
    } else if (perPersonTons > 8) {
      recs.push(
        'Your per-person emissions are moderate. A category-by-category reduction plan can likely move you below 8 tons/year.'
      );
    } else {
      recs.push('Your per-person estimate is already relatively efficient. Maintain performance and focus on the largest category first.');
    }

    return recs;
  };

  const generateTips = (): string[] => {
    return [
      'Use country-specific or region-adjusted factors where possible. Grid electricity intensity differs materially by state and utility.',
      'Track both household total and per-person emissions to avoid misleading comparisons between different household sizes.',
      'Use annual values for major categories (energy, transport, flights) to reduce month-to-month noise in estimates.',
      'Prioritize actions by absolute tons reduced, not by number of actions completed.',
      'Refresh assumptions annually because emission factors and personal behavior patterns change over time.',
      'Keep a saved baseline and compare against it every quarter for measurable progress.'
    ];
  };

  const generateWarnings = (): string[] => {
    const warnings: string[] = [];

    const householdSize = parseNonNegative(inputs.householdSize);
    if (householdSize === 0) {
      warnings.push('Household size cannot be zero; results default to 1 person when needed.');
    }

    const mpg = parseNonNegative(inputs.vehicleMpg);
    if ((inputs.vehicleType === 'gasoline' || inputs.vehicleType === 'diesel') && mpg < 12) {
      warnings.push('Vehicle MPG appears very low. Verify the MPG input for realistic transportation results.');
    }

    const recyclingRate = parseNonNegative(inputs.recyclingRatePercent);
    if (recyclingRate > 100) {
      warnings.push('Recycling rate above 100% is not valid; values above 100 are capped in calculations.');
    }

    if (inputs.shortFlightsPerYear === '0' && inputs.longFlightsPerYear === '0') {
      warnings.push('Flight emissions are set to zero. If you travel occasionally, include those trips for a more complete estimate.');
    }

    warnings.push(
      'This calculator is an estimation tool. Variance between calculators is normal due to scope, boundaries, and factor updates.'
    );

    return warnings;
  };

  const generateNextSteps = (): string[] => {
    return [
      'Save this baseline estimate and note the date used for your inputs.',
      'Pick the top two emitting categories and set one concrete reduction action per category.',
      'Recalculate after 60-90 days using updated usage values.',
      'Compare household and per-person progress separately.',
      'Use the reduction scenarios below to prioritize high-impact actions first.'
    ];
  };

  const generateReductionScenarios = (breakdown: CarbonBreakdown): ReductionScenario[] => {
    const renewableScenario = parseNonNegative(inputs.electricityKwhPerYear) * emissionFactors.electricityKgPerKwh * 0.3;
    const drivingScenario = breakdown.transportationKg * 0.2;
    const flightsScenario = breakdown.flightsKg * 0.4;
    const dietScenario = Math.max(0, dietAnnualKg[inputs.dietType] - 1400);
    const wasteScenario = breakdown.wasteKg * 0.35;

    return [
      {
        label: 'Move 30% of Electricity to Renewable Supply',
        annualSavingsKg: renewableScenario,
        annualSavingsTons: renewableScenario / 1000,
        implementationNotes: 'Green utility tariff, community solar, or rooftop generation.'
      },
      {
        label: 'Cut Personal Vehicle Miles by 20%',
        annualSavingsKg: drivingScenario,
        annualSavingsTons: drivingScenario / 1000,
        implementationNotes: 'Transit substitution, trip bundling, and hybrid work scheduling.'
      },
      {
        label: 'Reduce Flight Activity by 40%',
        annualSavingsKg: flightsScenario,
        annualSavingsTons: flightsScenario / 1000,
        implementationNotes: 'Replace one long-haul or multiple short-haul trips annually.'
      },
      {
        label: 'Shift Diet Toward Lower-Emission Pattern',
        annualSavingsKg: dietScenario,
        annualSavingsTons: dietScenario / 1000,
        implementationNotes: 'Omnivore to low-meat/pescatarian progression usually yields clear reductions.'
      },
      {
        label: 'Reduce Waste Emissions by 35%',
        annualSavingsKg: wasteScenario,
        annualSavingsTons: wasteScenario / 1000,
        implementationNotes: 'Food waste prevention and higher diversion rates.'
      }
    ].sort((a, b) => b.annualSavingsKg - a.annualSavingsKg);
  };

  const calculateFootprint = () => {
    const electricityKwh = parseNonNegative(inputs.electricityKwhPerYear);
    const naturalGasTherms = parseNonNegative(inputs.naturalGasThermsPerYear);
    const heatingOilGallons = parseNonNegative(inputs.heatingOilGallonsPerYear);
    const propaneGallons = parseNonNegative(inputs.propaneGallonsPerYear);
    const renewablePercent = Math.min(100, parseNonNegative(inputs.renewableElectricityPercent));

    const annualMiles = parseNonNegative(inputs.annualVehicleMiles);
    const mpg = parseNonNegative(inputs.vehicleMpg);
    const transitMiles = parseNonNegative(inputs.publicTransitMilesPerYear);
    const shortFlights = parseNonNegative(inputs.shortFlightsPerYear);
    const longFlights = parseNonNegative(inputs.longFlightsPerYear);
    const workFromHomeDays = Math.min(5, parseNonNegative(inputs.workFromHomeDaysPerWeek));

    const shoppingSpendMonthly = parseNonNegative(inputs.shoppingSpendPerMonth);
    const wasteLbsWeekly = parseNonNegative(inputs.wasteLbsPerWeek);
    const recyclingRate = Math.min(100, parseNonNegative(inputs.recyclingRatePercent));

    const householdSize = Math.max(1, parseNonNegative(inputs.householdSize));

    const homeElectricityKgRaw = electricityKwh * emissionFactors.electricityKgPerKwh;
    const homeElectricityKg = homeElectricityKgRaw * (1 - renewablePercent / 100);
    const naturalGasKg = naturalGasTherms * emissionFactors.naturalGasKgPerTherm;
    const heatingOilKg = heatingOilGallons * emissionFactors.heatingOilKgPerGallon;
    const propaneKg = propaneGallons * emissionFactors.propaneKgPerGallon;
    const homeEnergyKg = homeElectricityKg + naturalGasKg + heatingOilKg + propaneKg;

    const vehicleKgPerMile = getVehicleKgPerMile(inputs.vehicleType, mpg);
    const commuteMilesAvoided = workFromHomeDays * 48 * 20;
    const effectiveAnnualMiles = Math.max(0, annualMiles - commuteMilesAvoided);
    const vehicleKg = effectiveAnnualMiles * vehicleKgPerMile;
    const transitKg = transitMiles * emissionFactors.transitKgPerMile;
    const transportationKg = vehicleKg + transitKg;

    const flightsKg =
      shortFlights * emissionFactors.shortFlightKgEach +
      longFlights * emissionFactors.longFlightKgEach;

    const foodKg = dietAnnualKg[inputs.dietType];

    const consumptionKg = inputs.includeConsumptionCategory
      ? shoppingSpendMonthly * 12 * emissionFactors.shoppingKgPerDollar
      : 0;

    const grossWasteKg = wasteLbsWeekly * 52 * emissionFactors.wasteKgPerLb;
    const wasteKg = grossWasteKg * (1 - recyclingRate / 100);

    const breakdown: CarbonBreakdown = {
      homeEnergyKg,
      transportationKg,
      flightsKg,
      foodKg,
      consumptionKg,
      wasteKg
    };

    const totalKg =
      breakdown.homeEnergyKg +
      breakdown.transportationKg +
      breakdown.flightsKg +
      breakdown.foodKg +
      breakdown.consumptionKg +
      breakdown.wasteKg;

    const perPersonKg = totalKg / householdSize;

    const totalTons = totalKg / 1000;
    const perPersonTons = perPersonKg / 1000;

    const nationalAveragePerPersonTons = 16;
    const parisAlignedPerPersonTons = 2;

    const vsUSAveragePercent =
      ((perPersonTons - nationalAveragePerPersonTons) / nationalAveragePerPersonTons) * 100;

    const vsParisTargetPercent =
      ((perPersonTons - parisAlignedPerPersonTons) / parisAlignedPerPersonTons) * 100;

    const treesNeededForOffset = totalKg / emissionFactors.treeOffsetKgPerYear;
    const drivingMilesEquivalent = totalKg / emissionFactors.drivingKgPerMile;

    const recommendations = generateRecommendations(breakdown, perPersonTons);
    const tips = generateTips();
    const warningsAndConsiderations = generateWarnings();
    const nextSteps = generateNextSteps();
    const reductionScenarios = generateReductionScenarios(breakdown);

    const uncertaintyBand = inputs.includeUncertaintyRange ? 0.15 : 0;
    const confidenceLowKg = inputs.includeUncertaintyRange ? totalKg * (1 - uncertaintyBand) : undefined;
    const confidenceHighKg = inputs.includeUncertaintyRange ? totalKg * (1 + uncertaintyBand) : undefined;

    setResult({
      totalKg,
      totalTons,
      perPersonKg,
      perPersonTons,
      nationalAveragePerPersonTons,
      parisAlignedPerPersonTons,
      vsUSAveragePercent,
      vsParisTargetPercent,
      breakdown,
      largestContributor: getLargestContributorLabel(breakdown),
      treesNeededForOffset,
      drivingMilesEquivalent,
      confidenceLowKg,
      confidenceHighKg,
      recommendations,
      tips,
      warningsAndConsiderations,
      nextSteps,
      reductionScenarios
    });

    setShowModal(true);
  };

  const resetCalculator = () => {
    setInputs({
      calculationMode: 'comprehensive',
      vehicleType: 'gasoline',
      dietType: 'omnivore',
      electricityKwhPerYear: '10600',
      naturalGasThermsPerYear: '410',
      heatingOilGallonsPerYear: '0',
      propaneGallonsPerYear: '0',
      renewableElectricityPercent: '0',
      annualVehicleMiles: '12000',
      vehicleMpg: '26',
      publicTransitMilesPerYear: '1200',
      shortFlightsPerYear: '2',
      longFlightsPerYear: '1',
      workFromHomeDaysPerWeek: '1',
      shoppingSpendPerMonth: '450',
      wasteLbsPerWeek: '28',
      recyclingRatePercent: '25',
      householdSize: '2',
      includeUncertaintyRange: true,
      includeConsumptionCategory: true,
      showPerPersonView: true
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'Why do different carbon footprint calculators give different results?',
      answer:
        'Different tools use different boundaries, factor libraries, and assumptions. Some include only direct household emissions, while others include consumption, food, and embedded emissions. Variance across tools is expected.',
      category: 'Accuracy'
    },
    {
      question: 'Is this calculator designed for U.S. users?',
      answer:
        'Yes. Inputs and baseline assumptions are aligned for U.S.-style household energy and transportation patterns. You can still use it outside the U.S., but country-specific factors may differ.',
      category: 'Scope'
    },
    {
      question: 'Should I track total household emissions or per-person emissions?',
      answer:
        'Track both. Total household emissions help with operational planning, while per-person emissions make comparisons across households more meaningful.',
      category: 'Method'
    },
    {
      question: 'How are transportation emissions calculated?',
      answer:
        'Vehicle emissions are estimated from annual miles, vehicle type, and MPG (or default intensity for EV mode). Transit emissions use an average per-mile factor and are added separately.',
      category: 'Transportation'
    },
    {
      question: 'Does work-from-home reduce transportation emissions?',
      answer:
        'Yes. The calculator applies a commuting-mile reduction proxy based on work-from-home days per week, capped to prevent unrealistic over-reduction.',
      category: 'Transportation'
    },
    {
      question: 'How are flight emissions represented?',
      answer:
        'Flights are estimated using short-haul and long-haul per-trip factors. This is an estimate and does not include cabin class, routing inefficiency, or high-altitude multiplier variations.',
      category: 'Flights'
    },
    {
      question: 'What does the uncertainty range mean?',
      answer:
        'The uncertainty range gives a practical confidence band to reflect factor variability and incomplete behavior data. It is not a statistical confidence interval, but a planning range.',
      category: 'Uncertainty'
    },
    {
      question: 'Why include a consumption category based on spending?',
      answer:
        'User forums frequently ask for hidden or indirect emissions. Consumption spending provides a rough proxy for embodied emissions from goods and services.',
      category: 'Consumption'
    },
    {
      question: 'How should I use the reduction scenarios?',
      answer:
        'Treat them as prioritization guidance. Start with the top two savings opportunities by annual tons reduced, then re-run the calculator after implementing changes.',
      category: 'Planning'
    },
    {
      question: 'Can this calculator be used for regulatory reporting?',
      answer:
        'No. This tool is for planning and education. Regulatory inventories require formal boundary definitions, auditable data, and approved methodologies.',
      category: 'Compliance'
    },
    {
      question: 'What is a strong long-term personal target?',
      answer:
        'A commonly cited climate-aligned target is around 2 tons CO2e per person per year. Households typically transition toward that target in phases, not all at once.',
      category: 'Targets'
    },
    {
      question: 'What should I update first when recalculating?',
      answer:
        'Update electricity use, annual miles, flights, and household size first. Those inputs usually drive the largest changes in annual results.',
      category: 'Workflow'
    }
  ];

  const breakdownEntries = result
    ? [
        { label: 'Home Energy', value: result.breakdown.homeEnergyKg, icon: Home, color: 'bg-blue-500' },
        { label: 'Transportation', value: result.breakdown.transportationKg, icon: Car, color: 'bg-emerald-500' },
        { label: 'Flights', value: result.breakdown.flightsKg, icon: Plane, color: 'bg-orange-500' },
        { label: 'Food', value: result.breakdown.foodKg, icon: Scale, color: 'bg-rose-500' },
        { label: 'Consumption', value: result.breakdown.consumptionKg, icon: ShoppingBag, color: 'bg-violet-500' },
        { label: 'Waste', value: result.breakdown.wasteKg, icon: Trash2, color: 'bg-cyan-500' }
      ]
    : [];

  const maxBreakdownValue = Math.max(...(breakdownEntries.map((entry) => entry.value) || [1]));

  return (
    <div className="w-full space-y-8">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Carbon Footprint Calculator</h2>
            <p className="text-muted-foreground">Estimate annual household and per-person CO2e emissions</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Use full modeling inputs, reduction scenarios, and confidence ranges'
                : 'Quick estimate using core household activity data'}
            </p>
          </div>
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {isAdvancedMode ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Switch to Simple
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Advanced Options
              </>
            )}
          </button>
        </div>

        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Calculation Mode
            </label>
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg bg-background text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">
                  {inputs.calculationMode === 'basic' && 'Basic Estimator - Core categories only'}
                  {inputs.calculationMode === 'comprehensive' && 'Comprehensive - Full household model'}
                  {inputs.calculationMode === 'comparison' && 'Comparison - Benchmark against targets'}
                  {inputs.calculationMode === 'reduction-planner' && 'Reduction Planner - Prioritized savings actions'}
                  {inputs.calculationMode === 'lifestyle-audit' && 'Lifestyle Audit - Detailed behavior assumptions'}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform',
                    showModeDropdown && 'rotate-180'
                  )}
                />
              </button>

              {showModeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowModeDropdown(false)} />

                  <div className="absolute z-20 w-full mt-2 bg-background border border-purple-300 dark:border-purple-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-1">
                      {(
                        [
                          ['basic', 'Basic Estimator', 'Core categories only'],
                          ['comprehensive', 'Comprehensive', 'Full household model'],
                          ['comparison', 'Comparison', 'Benchmark against targets'],
                          ['reduction-planner', 'Reduction Planner', 'Prioritized savings actions'],
                          ['lifestyle-audit', 'Lifestyle Audit', 'Detailed behavior assumptions']
                        ] as [CalculationMode, string, string][]
                      ).map((option) => (
                        <button
                          key={option[0]}
                          onClick={() => {
                            handleInputChange('calculationMode', option[0]);
                            setShowModeDropdown(false);
                          }}
                          className={cn(
                            'w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800 first:border-t-0',
                            inputs.calculationMode === option[0] && 'bg-purple-100 dark:bg-purple-900/40 font-semibold'
                          )}
                        >
                          <div className="font-medium">{option[1]}</div>
                          <div className="text-sm text-muted-foreground">{option[2]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Household Electricity (kWh/year)</label>
            <input
              type="number"
              min="0"
              value={inputs.electricityKwhPerYear}
              onChange={(e) => handleInputChange('electricityKwhPerYear', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Renewable Electricity Share (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={inputs.renewableElectricityPercent}
              onChange={(e) => handleInputChange('renewableElectricityPercent', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Natural Gas (therms/year)</label>
            <input
              type="number"
              min="0"
              value={inputs.naturalGasThermsPerYear}
              onChange={(e) => handleInputChange('naturalGasThermsPerYear', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Household Size (people)</label>
            <input
              type="number"
              min="1"
              value={inputs.householdSize}
              onChange={(e) => handleInputChange('householdSize', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transportation Inputs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle Type</label>
              <select
                value={inputs.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value as VehicleType)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option value="gasoline">Gasoline</option>
                <option value="hybrid">Hybrid</option>
                <option value="diesel">Diesel</option>
                <option value="ev">Electric Vehicle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle Miles (annual)</label>
              <input
                type="number"
                min="0"
                value={inputs.annualVehicleMiles}
                onChange={(e) => handleInputChange('annualVehicleMiles', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle MPG</label>
              <input
                type="number"
                min="1"
                value={inputs.vehicleMpg}
                onChange={(e) => handleInputChange('vehicleMpg', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Public Transit Miles (annual)</label>
              <input
                type="number"
                min="0"
                value={inputs.publicTransitMilesPerYear}
                onChange={(e) => handleInputChange('publicTransitMilesPerYear', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Short Flights (annual)</label>
              <input
                type="number"
                min="0"
                value={inputs.shortFlightsPerYear}
                onChange={(e) => handleInputChange('shortFlightsPerYear', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Long Flights (annual)</label>
              <input
                type="number"
                min="0"
                value={inputs.longFlightsPerYear}
                onChange={(e) => handleInputChange('longFlightsPerYear', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Lifestyle and Consumption
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diet Profile</label>
              <select
                value={inputs.dietType}
                onChange={(e) => handleInputChange('dietType', e.target.value as DietType)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option value="omnivore">Omnivore</option>
                <option value="low-meat">Low-Meat</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Shopping Spend ($/month)</label>
              <input
                type="number"
                min="0"
                value={inputs.shoppingSpendPerMonth}
                onChange={(e) => handleInputChange('shoppingSpendPerMonth', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Waste (lbs/week)</label>
              <input
                type="number"
                min="0"
                value={inputs.wasteLbsPerWeek}
                onChange={(e) => handleInputChange('wasteLbsPerWeek', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Recycling Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.recyclingRatePercent}
                onChange={(e) => handleInputChange('recyclingRatePercent', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Advanced Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeUncertaintyRange}
                  onChange={(e) => handleInputChange('includeUncertaintyRange', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Uncertainty Band</strong>
                  <br />
                  Add planning range around estimated total.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeConsumptionCategory}
                  onChange={(e) => handleInputChange('includeConsumptionCategory', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Consumption Category</strong>
                  <br />
                  Add embodied-emissions proxy from monthly spend.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.showPerPersonView}
                  onChange={(e) => handleInputChange('showPerPersonView', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Show Per-Person Focus</strong>
                  <br />
                  Prioritize per-person benchmark insights.
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Work-from-Home Days / Week</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={inputs.workFromHomeDaysPerWeek}
                  onChange={(e) => handleInputChange('workFromHomeDaysPerWeek', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={calculateFootprint}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Carbon Footprint
          </button>

          <button
            onClick={resetCalculator}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Cloud className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced household emissions planning for U.S.-style activity patterns</p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          This calculator is built for planning and behavior change, not regulatory reporting. It combines direct household
          emissions (electricity, heating fuels, and transport) with commonly ignored categories (diet, goods consumption,
          and waste) so you can prioritize by annual tons reduced.
        </p>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          The model includes practical features requested repeatedly in community discussions: per-person normalization,
          transparent factors, uncertainty ranges, and ranked reduction scenarios that estimate annual savings in tons.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              <h3 className="font-semibold text-foreground">5 Calculation Modes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Basic, comprehensive, comparison, reduction planner, and lifestyle audit modes for different analysis depth.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="h-4 w-4 text-green-700 dark:text-green-300" />
              <h3 className="font-semibold text-foreground">Category-Level Breakdown</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Home energy, transportation, flights, food, consumption, and waste are modeled separately for clear prioritization.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-700 dark:text-purple-300" />
              <h3 className="font-semibold text-foreground">Action-Oriented Output</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Includes ranked reduction scenarios, category recommendations, warnings, and next-step planning.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-cyan-50 dark:bg-cyan-900/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
              <h3 className="font-semibold text-foreground">Benchmark Context</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Compare against the U.S. per-person baseline and a long-run climate-aligned per-person reference target.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Advanced Calculator
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Per-Person + Household View
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Uncertainty + Scenario Planning
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Forum-Informed Feature Set
          </span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Carbon Footprint Results and Detailed Calculations
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Household Emissions</p>
                <p className="text-2xl font-bold text-foreground">{result.totalTons.toFixed(2)} tCO2e/year</p>
              </div>

              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Per-Person Emissions</p>
                <p className="text-2xl font-bold text-foreground">{result.perPersonTons.toFixed(2)} tCO2e/year</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tree Offset (1 year)</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(result.treesNeededForOffset).toLocaleString()}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Driving Equivalent</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(result.drivingMilesEquivalent).toLocaleString()} mi</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Largest contributor: <strong>{result.largestContributor}</strong>
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">
                Vs U.S. average per person: <strong>{result.vsUSAveragePercent > 0 ? '+' : ''}{result.vsUSAveragePercent.toFixed(1)}%</strong>
              </p>
            </div>

            {inputs.includeUncertaintyRange && result.confidenceLowKg && result.confidenceHighKg && (
              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20 mb-4">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  Planning range: {(result.confidenceLowKg / 1000).toFixed(2)} to {(result.confidenceHighKg / 1000).toFixed(2)} tCO2e/year
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 mb-4">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Current profile: {getVehicleDisplayName(inputs.vehicleType)} | Diet: {getDietDisplayName(inputs.dietType)}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Category Breakdown
              </h4>
              <div className="space-y-4">
                {breakdownEntries.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <div key={entry.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Icon className="h-4 w-4" />
                          {entry.label}
                        </div>
                        <div className="text-sm text-muted-foreground">{(entry.value / 1000).toFixed(2)} tons</div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={cn('h-full', entry.color)} style={{ width: `${(entry.value / maxBreakdownValue) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {inputs.showPerPersonView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg border bg-indigo-50 dark:bg-indigo-900/20">
                  <p className="text-sm text-indigo-900 dark:text-indigo-100 mb-1">U.S. Average Comparison</p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.vsUSAveragePercent > 0 ? '+' : ''}
                    {result.vsUSAveragePercent.toFixed(1)}% vs U.S. per-person baseline
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-rose-50 dark:bg-rose-900/20">
                  <p className="text-sm text-rose-900 dark:text-rose-100 mb-1">Climate Target Comparison</p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.vsParisTargetPercent > 0 ? '+' : ''}
                    {result.vsParisTargetPercent.toFixed(1)}% vs 2-ton target
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.recommendations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings and Considerations
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.warningsAndConsiderations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-cyan-50 dark:bg-cyan-900/20 mb-6">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Reduction Scenarios (Highest Impact First)
              </h4>
              <div className="space-y-3">
                {result.reductionScenarios.map((scenario, index) => (
                  <div key={index} className="p-3 rounded-lg bg-background border border-cyan-200 dark:border-cyan-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{scenario.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{scenario.implementationNotes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{scenario.annualSavingsTons.toFixed(2)} t</p>
                        <p className="text-xs text-muted-foreground">saved/yr</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border bg-violet-50 dark:bg-violet-900/20">
                <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Practical Tips
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.tips.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Next Steps
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.nextSteps.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            How to Use This Free Online Carbon Footprint Calculator
          </h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                1. Enter Home Energy
              </h4>
              <p>Add annual electricity and natural gas values from utility bills or annual account summaries.</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                2. Enter Mobility Data
              </h4>
              <p>Provide annual vehicle miles, MPG, transit miles, and flight count for short and long trips.</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                3. Add Lifestyle Inputs
              </h4>
              <p>Set diet profile, shopping spend proxy, waste generation, and recycling rate.</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                4. Calculate and Review
              </h4>
              <p>Review total emissions, per-person metrics, category breakdown, and reduction scenarios.</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Results Dashboard (Displayed In Popup)
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Household total in annual tons CO2e</li>
            <li>• Per-person emissions for fair comparison across households</li>
            <li>• Largest category driver and priority reduction path</li>
            <li>• U.S. average and climate-target comparisons</li>
            <li>• Ranked reduction scenarios by annual tons saved</li>
            <li>• Warnings, assumptions, and practical next-step checklist</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-700 dark:text-purple-300" />
              Why Use This Calculator?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Structured for household planning rather than abstract scoring</li>
              <li>• Designed around recurring user pain points from public forums</li>
              <li>• Transparent assumptions and factor references</li>
              <li>• Practical quarterly progress tracking workflow</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-orange-700 dark:text-orange-300" />
              Advanced Features
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Five calculation modes</li>
              <li>• Optional uncertainty range</li>
              <li>• Optional consumption emissions module</li>
              <li>• Work-from-home commute adjustment</li>
              <li>• Reduction scenario prioritization</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/20 p-5 rounded-lg border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pre-Calculation Data Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="p-3 rounded-lg bg-background border">
              12 months of electricity and fuel usage totals
            </div>
            <div className="p-3 rounded-lg bg-background border">
              Annual vehicle miles and realistic MPG values
            </div>
            <div className="p-3 rounded-lg bg-background border">
              Flight count separated by short and long routes
            </div>
            <div className="p-3 rounded-lg bg-background border">
              Household size and major behavior changes in the last year
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Globe className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
          </div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
            Understanding Carbon Footprint Results
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Why Calculator Results Differ
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              User discussions consistently highlight confusion when two calculators produce different totals. This is usually due to
              different boundaries (direct vs indirect emissions), different factor years, and different assumptions for flights,
              electricity intensity, and consumption.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-background border">Boundary scope differences</div>
              <div className="p-3 rounded-lg bg-background border">Emission factor year mismatch</div>
              <div className="p-3 rounded-lg bg-background border">Different transport/flight assumptions</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Highest-Impact Reduction Levers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Home Energy
                </h4>
                <p className="text-muted-foreground">Efficiency upgrades, insulation, and renewable electricity procurement.</p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Transportation
                </h4>
                <p className="text-muted-foreground">Lower total vehicle miles, higher MPG, and transit substitution.</p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Flights
                </h4>
                <p className="text-muted-foreground">Reduce trip frequency and prefer lower-emission alternatives when feasible.</p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Food and Consumption
                </h4>
                <p className="text-muted-foreground">Lower-emission dietary mix and reduced high-turnover discretionary consumption.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Benchmarks and Interpretation
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Use per-person benchmarks to compare households of different sizes. Household total is best for operational planning;
              per-person values are best for fairness and progress tracking.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• U.S. per-person baseline used here: 16 tons/year</li>
              <li>• Long-run climate-aligned target reference: 2 tons/person/year</li>
              <li>• Priority should be annual tons reduced, not number of actions completed</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Data Quality Issues
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Using monthly values as annual values (or vice versa)</li>
              <li>• Outdated MPG and stale utility consumption assumptions</li>
              <li>• Omitting flights or assigning zero transit emissions</li>
              <li>• Comparing different calculator scopes as if they were equivalent</li>
            </ul>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <Train className="h-5 w-5" />
              Forum-Informed Modeling Decisions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-background border">
                Added explicit transit miles because users report car-only models understate choices.
              </div>
              <div className="p-3 rounded-lg bg-background border">
                Added short/long flight split because forum users said annual flight totals were too vague.
              </div>
              <div className="p-3 rounded-lg bg-background border">
                Added per-person view because shared households need fairer comparison.
              </div>
              <div className="p-3 rounded-lg bg-background border">
                Added uncertainty band because exactness is often overstated in consumer tools.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Emission Factors Used
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Factor</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Electricity</td>
                <td className="py-3 px-4">0.367</td>
                <td className="py-3 px-4">kg CO2e / kWh</td>
                <td className="py-3 px-4 text-muted-foreground">Based on EPA average conversion from household calculator values</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Natural Gas</td>
                <td className="py-3 px-4">5.27</td>
                <td className="py-3 px-4">kg CO2e / therm</td>
                <td className="py-3 px-4 text-muted-foreground">Derived from U.S. fuel combustion emission factors</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Gasoline</td>
                <td className="py-3 px-4">8.89</td>
                <td className="py-3 px-4">kg CO2 / gallon</td>
                <td className="py-3 px-4 text-muted-foreground">EPA mobile-source emission estimate</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Diesel</td>
                <td className="py-3 px-4">10.18</td>
                <td className="py-3 px-4">kg CO2 / gallon</td>
                <td className="py-3 px-4 text-muted-foreground">EPA mobile-source emission estimate</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Transit</td>
                <td className="py-3 px-4">0.089</td>
                <td className="py-3 px-4">kg CO2e / passenger-mile</td>
                <td className="py-3 px-4 text-muted-foreground">Planning-level average transit intensity</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Short Flight</td>
                <td className="py-3 px-4">300</td>
                <td className="py-3 px-4">kg CO2e / trip</td>
                <td className="py-3 px-4 text-muted-foreground">Simplified trip-based estimate</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Long Flight</td>
                <td className="py-3 px-4">1100</td>
                <td className="py-3 px-4">kg CO2e / trip</td>
                <td className="py-3 px-4 text-muted-foreground">Simplified trip-based estimate</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Waste</td>
                <td className="py-3 px-4">0.24</td>
                <td className="py-3 px-4">kg CO2e / lb waste</td>
                <td className="py-3 px-4 text-muted-foreground">Adjusted by recycling diversion rate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Values are intended for educational planning and may differ from formal inventory methodologies or region-specific datasets.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              U.S. Government Data and Methods
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                •{' '}
                <a
                  href="https://www.epa.gov/carbon-footprint-calculator"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  U.S. EPA Household Carbon Footprint Calculator
                </a>{' '}
                - household category structure and baseline assumptions
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  U.S. EPA Greenhouse Gas Equivalencies Calculator
                </a>{' '}
                - conversion benchmarks and contextual equivalents
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.eia.gov/environment/emissions/co2_vol_mass.php"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  U.S. EIA CO2 Emissions Coefficients
                </a>{' '}
                - fuel combustion coefficient references
              </li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Major Public Calculators Reviewed (USA-facing)
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                •{' '}
                <a
                  href="https://coolclimate.berkeley.edu/calculator"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CoolClimate Calculator (UC Berkeley)
                </a>{' '}
                - broad category granularity and household profiling
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.nature.org/en-us/get-involved/how-to-help/carbon-footprint-calculator/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Nature Conservancy Carbon Footprint Calculator
                </a>{' '}
                - lifestyle category inputs and educational framing
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.terrapass.com/carbon-footprint-calculator"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terrapass Carbon Footprint Calculator
                </a>{' '}
                - activity-to-offset linkage and reduction context
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.conservation.org/act/carbon-footprint-calculator"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conservation International Footprint Tool
                </a>{' '}
                - personal footprint framing and action pathway
              </li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Community Research Sources (Problems and Queries)
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                •{' '}
                <a
                  href="https://sustainability.stackexchange.com/questions/4840/how-can-one-accurately-estimate-their-carbon-footprint"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sustainable Living Stack Exchange
                </a>{' '}
                - recurring concerns about uncertainty and scope differences
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.reddit.com/r/Anticonsumption/comments/1bt5eko/footprint_calculator/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reddit: r/Anticonsumption footprint calculator thread
                </a>{' '}
                - demand for less fluffy and more transparent tools
              </li>
              <li>
                •{' '}
                <a
                  href="https://www.reddit.com/r/SideProject/comments/1k5njke/built_a_satirical_emissions_calculator/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reddit: emissions calculator feature feedback thread
                </a>{' '}
                - request for simpler and more concrete transport inputs
              </li>
              <li>• Quora query patterns were reviewed conceptually, but direct page access is blocked in this environment.</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is intended for decision support and personal planning. For audited or compliance-grade carbon accounting,
          use formal inventory standards and jurisdiction-specific reporting protocols.
        </p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={faqItems} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="Carbon Footprint Calculator" />
      </div>
    </div>
  );
};

export default AdvancedCarbonFootprintCalculator;
