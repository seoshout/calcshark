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
  Clock3,
  DollarSign,
  Fuel,
  Gauge,
  Info,
  Leaf,
  Lightbulb,
  MapPin,
  MessageSquare,
  RefreshCw,
  Route,
  Shield,
  Target,
  TrendingDown,
  Wallet,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode =
  | 'basic'
  | 'commuter'
  | 'mixed-driving'
  | 'high-mileage'
  | 'fleet-lite';

interface Inputs {
  calculationMode: CalculationMode;
  annualMiles: string;
  cityDrivingPercent: string;
  includeDrivingMix: boolean;

  fuelPriceA: string;
  fuelPriceB: string;
  cityMpgA: string;
  highwayMpgA: string;
  combinedMpgA: string;
  cityMpgB: string;
  highwayMpgB: string;
  combinedMpgB: string;

  annualMaintenanceA: string;
  annualMaintenanceB: string;
  annualInsuranceA: string;
  annualInsuranceB: string;
  annualRegistrationA: string;
  annualRegistrationB: string;

  vehiclePriceA: string;
  vehiclePriceB: string;

  includeIdleCost: boolean;
  idleHoursPerMonth: string;
  idleFuelBurnA: string;
  idleFuelBurnB: string;

  includeEmissionsContext: boolean;
  co2PerGallon: string;

  annualFuelPriceGrowthPercent: string;
  annualMilesGrowthPercent: string;
  planningYears: string;
}

interface ProjectionRow {
  year: number;
  annualMiles: number;
  fuelPriceA: number;
  fuelPriceB: number;
  annualCostA: number;
  annualCostB: number;
  annualSavingsWithB: number;
}

interface Scenario {
  label: string;
  annualSavingsWithB: number;
  notes: string;
}

interface Result {
  effectiveMpgA: number;
  effectiveMpgB: number;
  annualFuelCostA: number;
  annualFuelCostB: number;
  annualIdleFuelCostA: number;
  annualIdleFuelCostB: number;
  annualOperatingCostA: number;
  annualOperatingCostB: number;
  annualSavingsWithB: number;
  monthlySavingsWithB: number;
  weeklyFuelCostA: number;
  weeklyFuelCostB: number;
  costPerMileA: number;
  costPerMileB: number;
  fuelBreakEvenPriceB: number;
  upfrontDeltaBMinusA: number;
  breakEvenYears: number | null;
  projectedTotalCostA: number;
  projectedTotalCostB: number;
  projectedTotalSavingsWithB: number;
  projectionRows: ProjectionRow[];
  annualEmissionsA: number;
  annualEmissionsB: number;
  annualEmissionsReductionWithB: number;
  largestCostDriver: string;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedFuelEconomyComparisonCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'mixed-driving',
    annualMiles: '15000',
    cityDrivingPercent: '55',
    includeDrivingMix: true,

    fuelPriceA: '3.65',
    fuelPriceB: '3.65',
    cityMpgA: '24',
    highwayMpgA: '32',
    combinedMpgA: '27',
    cityMpgB: '31',
    highwayMpgB: '40',
    combinedMpgB: '35',

    annualMaintenanceA: '980',
    annualMaintenanceB: '820',
    annualInsuranceA: '1820',
    annualInsuranceB: '1950',
    annualRegistrationA: '210',
    annualRegistrationB: '240',

    vehiclePriceA: '32000',
    vehiclePriceB: '36500',

    includeIdleCost: true,
    idleHoursPerMonth: '5',
    idleFuelBurnA: '0.28',
    idleFuelBurnB: '0.22',

    includeEmissionsContext: true,
    co2PerGallon: '19.6',

    annualFuelPriceGrowthPercent: '3',
    annualMilesGrowthPercent: '1.2',
    planningYears: '5'
  });

  const parseNonNegative = (value: string): number => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      return 0;
    }
    return parsed;
  };

  const handleInputChange = (field: keyof Inputs, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const findLargestDriver = (entries: Array<[string, number]>) => {
    return [...entries].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0][0];
  };

  const buildRecommendations = (
    annualSavingsWithB: number,
    breakEvenYears: number | null,
    fuelBreakEvenPriceB: number,
    largestCostDriver: string
  ) => {
    const recommendations: string[] = [];

    if (annualSavingsWithB > 0) {
      recommendations.push('Vehicle B is currently lower-cost on annual operating economics under your assumptions.');
    } else if (annualSavingsWithB < 0) {
      recommendations.push('Vehicle A currently remains lower-cost on annual operating economics under your assumptions.');
    } else {
      recommendations.push('Operating economics are near parity. Small input shifts can flip the result.');
    }

    if (breakEvenYears && breakEvenYears > 0) {
      recommendations.push(`Estimated payback of Vehicle B upfront premium is about ${breakEvenYears.toFixed(1)} years.`);
    } else {
      recommendations.push('Upfront premium payback is not reached under current assumptions. Recheck mileage, fuel prices, and maintenance delta.');
    }

    recommendations.push(`Vehicle B break-even fuel price threshold is about $${fuelBreakEvenPriceB.toFixed(2)}/gal under current assumptions.`);

    if (largestCostDriver === 'Fuel Cost Gap') {
      recommendations.push('Fuel efficiency and fuel price spread are dominant drivers. Prioritize real-world MPG verification and local station-price tracking.');
    }

    if (largestCostDriver === 'Insurance Delta') {
      recommendations.push('Insurance difference is material. Compare matched-coverage quotes before committing to a vehicle switch.');
    }

    if (largestCostDriver === 'Maintenance Delta') {
      recommendations.push('Maintenance assumptions are heavily influencing outcomes. Validate with service history and model-specific maintenance schedules.');
    }

    recommendations.push('Run conservative and high-volatility scenarios before final purchase or fleet-standardization decisions.');

    return recommendations;
  };

  const buildWarnings = (annualMiles: number, effectiveMpgA: number, effectiveMpgB: number) => {
    const warnings: string[] = [];

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so operating-cost outputs are not decision-grade.');
    }

    if (effectiveMpgA < 12 || effectiveMpgB < 12) {
      warnings.push('One or both MPG values appear very low. Confirm real-world efficiency assumptions before planning.');
    }

    if (parseNonNegative(inputs.idleHoursPerMonth) > 25) {
      warnings.push('Idle-hours assumption is high and can materially skew total-cost comparisons. Validate this against actual usage logs.');
    }

    warnings.push('This tool is a planning model. Actual outcomes vary with driving style, traffic, weather, terrain, load, and local fuel-market changes.');

    return warnings;
  };

  const buildNextSteps = () => {
    return [
      'Capture real MPG from at least 2-4 full-tank cycles for both vehicle types.',
      'Update local fuel prices monthly and refresh comparison outputs quarterly.',
      'Validate maintenance and insurance assumptions with real quotes and service records.',
      'Run scenario mode for higher fuel volatility and changing annual mileage.',
      'Recalculate before major purchase, replacement, or fleet-policy decisions.'
    ];
  };

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const cityDrivingPercent = Math.min(100, parseNonNegative(inputs.cityDrivingPercent));
    const cityShare = cityDrivingPercent / 100;
    const highwayShare = 1 - cityShare;

    const fuelPriceA = parseNonNegative(inputs.fuelPriceA);
    const fuelPriceB = parseNonNegative(inputs.fuelPriceB);

    const cityMpgA = Math.max(1, parseNonNegative(inputs.cityMpgA));
    const highwayMpgA = Math.max(1, parseNonNegative(inputs.highwayMpgA));
    const combinedMpgA = Math.max(1, parseNonNegative(inputs.combinedMpgA));

    const cityMpgB = Math.max(1, parseNonNegative(inputs.cityMpgB));
    const highwayMpgB = Math.max(1, parseNonNegative(inputs.highwayMpgB));
    const combinedMpgB = Math.max(1, parseNonNegative(inputs.combinedMpgB));

    const annualMaintenanceA = parseNonNegative(inputs.annualMaintenanceA);
    const annualMaintenanceB = parseNonNegative(inputs.annualMaintenanceB);
    const annualInsuranceA = parseNonNegative(inputs.annualInsuranceA);
    const annualInsuranceB = parseNonNegative(inputs.annualInsuranceB);
    const annualRegistrationA = parseNonNegative(inputs.annualRegistrationA);
    const annualRegistrationB = parseNonNegative(inputs.annualRegistrationB);

    const vehiclePriceA = parseNonNegative(inputs.vehiclePriceA);
    const vehiclePriceB = parseNonNegative(inputs.vehiclePriceB);

    const idleHoursPerMonth = parseNonNegative(inputs.idleHoursPerMonth);
    const idleFuelBurnA = parseNonNegative(inputs.idleFuelBurnA);
    const idleFuelBurnB = parseNonNegative(inputs.idleFuelBurnB);

    const co2PerGallon = parseNonNegative(inputs.co2PerGallon);

    const annualFuelPriceGrowthPercent = parseNonNegative(inputs.annualFuelPriceGrowthPercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parseNonNegative(inputs.planningYears));

    const effectiveMpgA = inputs.includeDrivingMix
      ? 1 / (cityShare / cityMpgA + highwayShare / highwayMpgA)
      : combinedMpgA;

    const effectiveMpgB = inputs.includeDrivingMix
      ? 1 / (cityShare / cityMpgB + highwayShare / highwayMpgB)
      : combinedMpgB;

    const annualFuelCostA = (annualMiles / effectiveMpgA) * fuelPriceA;
    const annualFuelCostB = (annualMiles / effectiveMpgB) * fuelPriceB;

    const annualIdleFuelCostA = inputs.includeIdleCost
      ? idleHoursPerMonth * 12 * idleFuelBurnA * fuelPriceA
      : 0;

    const annualIdleFuelCostB = inputs.includeIdleCost
      ? idleHoursPerMonth * 12 * idleFuelBurnB * fuelPriceB
      : 0;

    const annualOperatingCostA =
      annualFuelCostA +
      annualIdleFuelCostA +
      annualMaintenanceA +
      annualInsuranceA +
      annualRegistrationA;

    const annualOperatingCostB =
      annualFuelCostB +
      annualIdleFuelCostB +
      annualMaintenanceB +
      annualInsuranceB +
      annualRegistrationB;

    const annualSavingsWithB = annualOperatingCostA - annualOperatingCostB;
    const monthlySavingsWithB = annualSavingsWithB / 12;

    const weeklyFuelCostA = annualFuelCostA / 52;
    const weeklyFuelCostB = annualFuelCostB / 52;

    const costPerMileA = annualMiles > 0 ? annualOperatingCostA / annualMiles : 0;
    const costPerMileB = annualMiles > 0 ? annualOperatingCostB / annualMiles : 0;

    const fuelBreakEvenPriceB = effectiveMpgB * (fuelPriceA / effectiveMpgA);

    const upfrontDeltaBMinusA = vehiclePriceB - vehiclePriceA;
    const breakEvenYears = annualSavingsWithB > 0 && upfrontDeltaBMinusA > 0
      ? upfrontDeltaBMinusA / annualSavingsWithB
      : upfrontDeltaBMinusA <= 0
        ? 0
        : null;

    const annualEmissionsA = inputs.includeEmissionsContext
      ? (annualMiles / effectiveMpgA) * co2PerGallon
      : 0;

    const annualEmissionsB = inputs.includeEmissionsContext
      ? (annualMiles / effectiveMpgB) * co2PerGallon
      : 0;

    const annualEmissionsReductionWithB = annualEmissionsA - annualEmissionsB;

    const largestCostDriver = findLargestDriver([
      ['Fuel Cost Gap', annualFuelCostA - annualFuelCostB],
      ['Maintenance Delta', annualMaintenanceA - annualMaintenanceB],
      ['Insurance Delta', annualInsuranceA - annualInsuranceB],
      ['Idle Cost Gap', annualIdleFuelCostA - annualIdleFuelCostB],
      ['Registration Delta', annualRegistrationA - annualRegistrationB]
    ]);

    const scenarios: Scenario[] = [
      {
        label: 'Fuel Price +20% (Both Vehicles)',
        annualSavingsWithB:
          (annualMiles / effectiveMpgA) * fuelPriceA * 1.2 + (annualOperatingCostA - annualFuelCostA) -
          ((annualMiles / effectiveMpgB) * fuelPriceB * 1.2 + (annualOperatingCostB - annualFuelCostB)),
        notes: 'Stress test under higher fuel market volatility.'
      },
      {
        label: 'Higher Mileage (+25%)',
        annualSavingsWithB:
          ((annualMiles * 1.25) / effectiveMpgA) * fuelPriceA + (annualOperatingCostA - annualFuelCostA) -
          (((annualMiles * 1.25) / effectiveMpgB) * fuelPriceB + (annualOperatingCostB - annualFuelCostB)),
        notes: 'Useful for commute expansion or increased fleet utilization.'
      },
      {
        label: 'City-Heavy Driving (75% City)',
        annualSavingsWithB:
          ((annualMiles / (1 / (0.75 / cityMpgA + 0.25 / highwayMpgA))) * fuelPriceA + (annualOperatingCostA - annualFuelCostA)) -
          ((annualMiles / (1 / (0.75 / cityMpgB + 0.25 / highwayMpgB))) * fuelPriceB + (annualOperatingCostB - annualFuelCostB)),
        notes: 'Tests stop-and-go urban profile where MPG spread can widen.'
      },
      {
        label: 'Highway-Heavy Driving (75% Highway)',
        annualSavingsWithB:
          ((annualMiles / (1 / (0.25 / cityMpgA + 0.75 / highwayMpgA))) * fuelPriceA + (annualOperatingCostA - annualFuelCostA)) -
          ((annualMiles / (1 / (0.25 / cityMpgB + 0.75 / highwayMpgB))) * fuelPriceB + (annualOperatingCostB - annualFuelCostB)),
        notes: 'Tests longer freeway usage where efficiency advantage may shift.'
      }
    ].sort((a, b) => b.annualSavingsWithB - a.annualSavingsWithB);

    const projectionRows: ProjectionRow[] = [];
    let projectedMiles = annualMiles;
    let projectedFuelPriceA = fuelPriceA;
    let projectedFuelPriceB = fuelPriceB;
    let projectedTotalCostA = 0;
    let projectedTotalCostB = 0;

    for (let year = 1; year <= planningYears; year++) {
      const projectedFuelA = (projectedMiles / effectiveMpgA) * projectedFuelPriceA;
      const projectedFuelB = (projectedMiles / effectiveMpgB) * projectedFuelPriceB;

      const projectedIdleA = inputs.includeIdleCost
        ? idleHoursPerMonth * 12 * idleFuelBurnA * projectedFuelPriceA
        : 0;

      const projectedIdleB = inputs.includeIdleCost
        ? idleHoursPerMonth * 12 * idleFuelBurnB * projectedFuelPriceB
        : 0;

      const annualCostA =
        projectedFuelA +
        projectedIdleA +
        annualMaintenanceA +
        annualInsuranceA +
        annualRegistrationA;

      const annualCostB =
        projectedFuelB +
        projectedIdleB +
        annualMaintenanceB +
        annualInsuranceB +
        annualRegistrationB;

      projectionRows.push({
        year,
        annualMiles: projectedMiles,
        fuelPriceA: projectedFuelPriceA,
        fuelPriceB: projectedFuelPriceB,
        annualCostA,
        annualCostB,
        annualSavingsWithB: annualCostA - annualCostB
      });

      projectedTotalCostA += annualCostA;
      projectedTotalCostB += annualCostB;

      projectedMiles *= 1 + annualMilesGrowthPercent / 100;
      projectedFuelPriceA *= 1 + annualFuelPriceGrowthPercent / 100;
      projectedFuelPriceB *= 1 + annualFuelPriceGrowthPercent / 100;
    }

    setResult({
      effectiveMpgA,
      effectiveMpgB,
      annualFuelCostA,
      annualFuelCostB,
      annualIdleFuelCostA,
      annualIdleFuelCostB,
      annualOperatingCostA,
      annualOperatingCostB,
      annualSavingsWithB,
      monthlySavingsWithB,
      weeklyFuelCostA,
      weeklyFuelCostB,
      costPerMileA,
      costPerMileB,
      fuelBreakEvenPriceB,
      upfrontDeltaBMinusA,
      breakEvenYears,
      projectedTotalCostA,
      projectedTotalCostB,
      projectedTotalSavingsWithB: projectedTotalCostA - projectedTotalCostB,
      projectionRows,
      annualEmissionsA,
      annualEmissionsB,
      annualEmissionsReductionWithB,
      largestCostDriver,
      scenarios,
      recommendations: buildRecommendations(
        annualSavingsWithB,
        breakEvenYears,
        fuelBreakEvenPriceB,
        largestCostDriver
      ),
      warningsAndConsiderations: buildWarnings(annualMiles, effectiveMpgA, effectiveMpgB),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'mixed-driving',
      annualMiles: '15000',
      cityDrivingPercent: '55',
      includeDrivingMix: true,

      fuelPriceA: '3.65',
      fuelPriceB: '3.65',
      cityMpgA: '24',
      highwayMpgA: '32',
      combinedMpgA: '27',
      cityMpgB: '31',
      highwayMpgB: '40',
      combinedMpgB: '35',

      annualMaintenanceA: '980',
      annualMaintenanceB: '820',
      annualInsuranceA: '1820',
      annualInsuranceB: '1950',
      annualRegistrationA: '210',
      annualRegistrationB: '240',

      vehiclePriceA: '32000',
      vehiclePriceB: '36500',

      includeIdleCost: true,
      idleHoursPerMonth: '5',
      idleFuelBurnA: '0.28',
      idleFuelBurnB: '0.22',

      includeEmissionsContext: true,
      co2PerGallon: '19.6',

      annualFuelPriceGrowthPercent: '3',
      annualMilesGrowthPercent: '1.2',
      planningYears: '5'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'What is the best way to compare two vehicles for fuel economy cost?',
      answer:
        'Use annual operating cost comparison, not MPG alone. Include fuel price, real MPG, maintenance, insurance, and other recurring costs for decision-quality output.',
      category: 'Comparison Basics'
    },
    {
      question: 'Why can a higher-MPG car still cost more annually?',
      answer:
        'If insurance, maintenance, registration, or upfront cost differences are large, they can offset fuel savings. Total operating cost is the correct metric.',
      category: 'Total Cost'
    },
    {
      question: 'Should I use city/highway weighted MPG?',
      answer:
        'Yes, when your route mix is known. Weighted MPG generally reflects real usage better than generic combined MPG.',
      category: 'Accuracy'
    },
    {
      question: 'How does annual mileage affect comparison results?',
      answer:
        'Higher annual mileage magnifies fuel-cost differences and can shorten payback for a more efficient vehicle.',
      category: 'Mileage Sensitivity'
    },
    {
      question: 'What is fuel break-even price threshold?',
      answer:
        'It is the fuel-price point where both vehicles have equal fuel-only cost per mile under current MPG assumptions.',
      category: 'Break-even'
    },
    {
      question: 'How do idle hours impact fuel comparison?',
      answer:
        'Idle fuel use can materially change annual cost in urban and stop-and-go profiles. Including idle assumptions improves realism.',
      category: 'Idle Costs'
    },
    {
      question: 'Should insurance be included in fuel economy comparison?',
      answer:
        'For purchase decisions, yes. Insurance differences can be large enough to alter which option is truly lower cost.',
      category: 'Insurance'
    },
    {
      question: 'How often should I update assumptions?',
      answer:
        'Quarterly updates are practical, and monthly updates are better during high fuel-price volatility.',
      category: 'Workflow'
    },
    {
      question: 'Can this tool be used for fleet standardization planning?',
      answer:
        'Yes for first-pass planning. Fleet decisions should also include downtime, depreciation, financing, and policy constraints.',
      category: 'Fleet Use'
    },
    {
      question: 'Are emissions numbers exact?',
      answer:
        'No. Emissions are planning estimates based on gallons consumed and a chosen CO2-per-gallon factor, not compliance-grade inventories.',
      category: 'Emissions'
    }
  ];

  const breakdownEntries = result
    ? [
        {
          label: 'Fuel Cost Gap',
          value: Math.abs(result.annualFuelCostA - result.annualFuelCostB),
          icon: Fuel,
          color: 'bg-blue-500'
        },
        {
          label: 'Maintenance Delta',
          value: Math.abs(parseNonNegative(inputs.annualMaintenanceA) - parseNonNegative(inputs.annualMaintenanceB)),
          icon: Wrench,
          color: 'bg-emerald-500'
        },
        {
          label: 'Insurance Delta',
          value: Math.abs(parseNonNegative(inputs.annualInsuranceA) - parseNonNegative(inputs.annualInsuranceB)),
          icon: Shield,
          color: 'bg-violet-500'
        },
        {
          label: 'Idle Cost Gap',
          value: Math.abs(result.annualIdleFuelCostA - result.annualIdleFuelCostB),
          icon: Clock3,
          color: 'bg-rose-500'
        }
      ]
    : [];

  const maxBreakdownValue = Math.max(...(breakdownEntries.map((entry) => entry.value) || [1]));

  return (
    <div className="w-full space-y-8">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fuel Economy Comparison Calculator</h2>
            <p className="text-muted-foreground">Advanced Vehicle A vs Vehicle B operating-cost and payback analysis</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes weighted MPG, idle costs, maintenance/insurance deltas, projection, and payback'
                : 'Uses core annual miles, MPG, and fuel-price assumptions'}
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
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <label className="block text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">Calculation Mode</label>
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">
                  {inputs.calculationMode === 'basic' && 'Basic - Quick A vs B fuel-cost check'}
                  {inputs.calculationMode === 'commuter' && 'Commuter - Daily driving economics'}
                  {inputs.calculationMode === 'mixed-driving' && 'Mixed Driving - Weighted city/highway analysis'}
                  {inputs.calculationMode === 'high-mileage' && 'High Mileage - Utilization-heavy scenario'}
                  {inputs.calculationMode === 'fleet-lite' && 'Fleet Lite - Standardization baseline'}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform',
                    showModeDropdown && 'rotate-180'
                  )}
                />
              </button>

              {showModeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowModeDropdown(false)} />
                  <div className="absolute z-20 w-full mt-2 bg-background border border-indigo-300 dark:border-indigo-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-1">
                      {(
                        [
                          ['basic', 'Basic', 'Quick A vs B fuel-cost check'],
                          ['commuter', 'Commuter', 'Daily driving economics'],
                          ['mixed-driving', 'Mixed Driving', 'Weighted city/highway analysis'],
                          ['high-mileage', 'High Mileage', 'Utilization-heavy scenario'],
                          ['fleet-lite', 'Fleet Lite', 'Standardization baseline']
                        ] as [CalculationMode, string, string][]
                      ).map((option) => (
                        <button
                          key={option[0]}
                          onClick={() => {
                            handleInputChange('calculationMode', option[0]);
                            setShowModeDropdown(false);
                          }}
                          className={cn(
                            'w-full px-4 py-3 text-left hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors border-t border-indigo-200 dark:border-indigo-800 first:border-t-0',
                            inputs.calculationMode === option[0] && 'bg-indigo-100 dark:bg-indigo-900/40 font-semibold'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Annual Miles</label>
            <input
              type="number"
              min="0"
              value={inputs.annualMiles}
              onChange={(e) => handleInputChange('annualMiles', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City Driving (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={inputs.cityDrivingPercent}
              onChange={(e) => handleInputChange('cityDrivingPercent', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mt-8">
            <input
              type="checkbox"
              checked={inputs.includeDrivingMix}
              onChange={(e) => handleInputChange('includeDrivingMix', e.target.checked)}
            />
            Use weighted city/highway MPG
          </label>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle A (Baseline)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fuel Price A ($/gal)</label>
              <input type="number" min="0" step="0.01" value={inputs.fuelPriceA} onChange={(e) => handleInputChange('fuelPriceA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City MPG A</label>
              <input type="number" min="1" value={inputs.cityMpgA} onChange={(e) => handleInputChange('cityMpgA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Highway MPG A</label>
              <input type="number" min="1" value={inputs.highwayMpgA} onChange={(e) => handleInputChange('highwayMpgA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Combined MPG A</label>
              <input type="number" min="1" value={inputs.combinedMpgA} onChange={(e) => handleInputChange('combinedMpgA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle B (Alternative)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fuel Price B ($/gal)</label>
              <input type="number" min="0" step="0.01" value={inputs.fuelPriceB} onChange={(e) => handleInputChange('fuelPriceB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City MPG B</label>
              <input type="number" min="1" value={inputs.cityMpgB} onChange={(e) => handleInputChange('cityMpgB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Highway MPG B</label>
              <input type="number" min="1" value={inputs.highwayMpgB} onChange={(e) => handleInputChange('highwayMpgB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Combined MPG B</label>
              <input type="number" min="1" value={inputs.combinedMpgB} onChange={(e) => handleInputChange('combinedMpgB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Advanced Cost and Projection Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Maintenance A ($)</label>
                <input type="number" min="0" value={inputs.annualMaintenanceA} onChange={(e) => handleInputChange('annualMaintenanceA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Maintenance B ($)</label>
                <input type="number" min="0" value={inputs.annualMaintenanceB} onChange={(e) => handleInputChange('annualMaintenanceB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Insurance A ($)</label>
                <input type="number" min="0" value={inputs.annualInsuranceA} onChange={(e) => handleInputChange('annualInsuranceA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Insurance B ($)</label>
                <input type="number" min="0" value={inputs.annualInsuranceB} onChange={(e) => handleInputChange('annualInsuranceB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Registration A ($)</label>
                <input type="number" min="0" value={inputs.annualRegistrationA} onChange={(e) => handleInputChange('annualRegistrationA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Registration B ($)</label>
                <input type="number" min="0" value={inputs.annualRegistrationB} onChange={(e) => handleInputChange('annualRegistrationB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Price A ($)</label>
                <input type="number" min="0" value={inputs.vehiclePriceA} onChange={(e) => handleInputChange('vehiclePriceA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Price B ($)</label>
                <input type="number" min="0" value={inputs.vehiclePriceB} onChange={(e) => handleInputChange('vehiclePriceB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mt-8">
                <input
                  type="checkbox"
                  checked={inputs.includeIdleCost}
                  onChange={(e) => handleInputChange('includeIdleCost', e.target.checked)}
                />
                Include idle fuel cost
              </label>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Idle Hours / Month</label>
                <input type="number" min="0" step="0.1" value={inputs.idleHoursPerMonth} onChange={(e) => handleInputChange('idleHoursPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Idle Burn A (gal/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.idleFuelBurnA} onChange={(e) => handleInputChange('idleFuelBurnA', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Idle Burn B (gal/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.idleFuelBurnB} onChange={(e) => handleInputChange('idleFuelBurnB', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualFuelPriceGrowthPercent} onChange={(e) => handleInputChange('annualFuelPriceGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mileage Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualMilesGrowthPercent} onChange={(e) => handleInputChange('annualMilesGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Planning Years</label>
                <input type="number" min="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mt-8">
                <input
                  type="checkbox"
                  checked={inputs.includeEmissionsContext}
                  onChange={(e) => handleInputChange('includeEmissionsContext', e.target.checked)}
                />
                Include emissions context
              </label>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">CO2 per Gallon (lbs)</label>
                <input type="number" min="0" step="0.1" value={inputs.co2PerGallon} onChange={(e) => handleInputChange('co2PerGallon', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={calculate}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Compare Fuel Economy
          </button>

          <button
            onClick={reset}
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
            <Fuel className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced Vehicle A vs Vehicle B fuel economy and total operating-cost comparison for U.S. drivers</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator compares two vehicle options using full operating economics, not MPG alone. It combines fuel spend,
          idle fuel use, maintenance, insurance, registration, and projected multi-year trends.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          It is designed for practical decisions such as replacement timing, commuter vehicle choice, and household or fleet
          standardization where total annual cost and payback matter more than headline efficiency values.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Use it to answer common planning questions: "Will better MPG actually save money after insurance and maintenance?",
          "How many years to recover upfront price difference?", and "How sensitive are results to fuel price and mileage changes?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Operating Cost Stack</h3>
            </div>
            <p className="text-sm text-muted-foreground">Compares annual fuel, idle, maintenance, insurance, and registration totals side by side.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Payback Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">Estimates break-even years for a higher-upfront vehicle under current assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Weighted MPG Logic</h3>
            </div>
            <p className="text-sm text-muted-foreground">Uses city/highway driving mix for more realistic effective MPG comparisons.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Leaf className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Emissions Context</h3>
            </div>
            <p className="text-sm text-muted-foreground">Optionally estimates annual emissions differences to support broader decision goals.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario + Projection Model</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Weighted MPG Comparison</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Fuel Economy Comparison Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Annual Savings with Vehicle B</p>
                <p className="text-2xl font-bold text-foreground">${result.annualSavingsWithB.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Savings with Vehicle B</p>
                <p className="text-2xl font-bold text-foreground">${result.monthlySavingsWithB.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Vehicle A Annual Operating Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.annualOperatingCostA.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Vehicle B Annual Operating Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.annualOperatingCostB.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest cost driver: <strong>{result.largestCostDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Effective MPG A: <strong>{result.effectiveMpgA.toFixed(2)}</strong> | Effective MPG B: <strong>{result.effectiveMpgB.toFixed(2)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Break-even timeline: <strong>{result.breakEvenYears === null ? 'Not reached under current assumptions' : `${result.breakEvenYears.toFixed(1)} years`}</strong></p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Driver Breakdown
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
                        <div className="text-sm text-muted-foreground">${entry.value.toFixed(2)}</div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={cn('h-full', entry.color)} style={{ width: `${(entry.value / maxBreakdownValue) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.recommendations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span>-</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings and Considerations
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.warningsAndConsiderations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span>-</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-cyan-50 dark:bg-cyan-900/20 mb-6">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Scenario Comparison
              </h4>
              <div className="space-y-3">
                {result.scenarios.map((scenario, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background border border-cyan-200 dark:border-cyan-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{scenario.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{scenario.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${scenario.annualSavingsWithB.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">savings/yr with B</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 mb-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Multi-Year Projection
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-3">Year</th>
                      <th className="text-left py-2 pr-3">Annual Miles</th>
                      <th className="text-left py-2 pr-3">Cost A</th>
                      <th className="text-left py-2 pr-3">Cost B</th>
                      <th className="text-left py-2">Savings with B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projectionRows.map((row) => (
                      <tr key={row.year} className="border-b last:border-b-0">
                        <td className="py-2 pr-3">{row.year}</td>
                        <td className="py-2 pr-3">{Math.round(row.annualMiles).toLocaleString()}</td>
                        <td className="py-2 pr-3">${row.annualCostA.toFixed(2)}</td>
                        <td className="py-2 pr-3">${row.annualCostB.toFixed(2)}</td>
                        <td className="py-2">${row.annualSavingsWithB.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Next Steps
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {result.nextSteps.map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span>-</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online Fuel Economy Comparison Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Define annual mileage and route mix</h4>
              Enter annual miles and city/highway share so the model reflects your actual driving profile, not generic averages.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Add Vehicle A and B fuel inputs</h4>
              Input current fuel prices and MPG values for both vehicles. Use observed values when possible for higher accuracy.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Configure weighted MPG mode</h4>
              Enable weighted city/highway MPG to avoid distortion from combined MPG assumptions when your route is unbalanced.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Add annual non-fuel cost layers</h4>
              Include maintenance, insurance, and registration for a true operating-cost comparison between options.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Add idle and projection assumptions</h4>
              Include idle fuel use and future trends (fuel inflation and mileage growth) for decision-grade planning.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Review popup results and scenarios</h4>
              Use annual savings, payback timeline, and scenario outputs to validate whether Vehicle B is financially better.
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Results Dashboard (Popup Only)
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><DollarSign className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Annual and Monthly Savings</h4>
                <p className="text-xs text-muted-foreground">Shows net operating-cost difference between Vehicle A and Vehicle B.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Effective MPG and Cost per Mile</h4>
                <p className="text-xs text-muted-foreground">Compares real efficiency and per-mile economics using selected route assumptions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Target className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Payback and Break-even Metrics</h4>
                <p className="text-xs text-muted-foreground">Estimates whether and when Vehicle B recovers any upfront price premium.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Scenario and Projection Panels</h4>
                <p className="text-xs text-muted-foreground">Highlights sensitivity to mileage and fuel-price volatility across planning horizons.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Total Cost Over MPG Myths</h4>
              <p className="text-xs text-muted-foreground">Prevents wrong decisions caused by focusing on MPG alone without full annual cost context.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />Route-Profile Accuracy</h4>
              <p className="text-xs text-muted-foreground">Uses weighted city/highway modeling for more realistic real-world comparisons.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Risk-Adjusted Planning</h4>
              <p className="text-xs text-muted-foreground">Scenario tests improve confidence before vehicle replacement or policy changes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Wallet className="h-4 w-4" />Payback Visibility</h4>
              <p className="text-xs text-muted-foreground">Clarifies whether higher upfront price can be justified by operating savings.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Vehicle A vs Vehicle B full operating-cost comparison with fuel and non-fuel deltas.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Weighted driving mix + idle fuel controls for improved planning realism.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario stress tests and multi-year projections for decision robustness.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Fuel Economy Comparison Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />Core Concept: MPG vs Total Annual Cost</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              MPG is only one variable in vehicle economics. True comparison requires combining fuel efficiency with annual mileage,
              fuel price, non-fuel operating costs, and potential upfront price differences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Fuel-only comparison can overstate savings if insurance is higher.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Operating-cost models improve purchase and replacement decisions.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors Affecting Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Annual mileage and route mix (city vs highway)</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Local fuel price spread and volatility over time</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Maintenance, insurance, and registration differences</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Idle patterns and real-world efficiency vs sticker values</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced Comparison: Vehicle A vs Vehicle B</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Vehicle A may have lower purchase cost but higher recurring fuel burden.</li>
              <li>- Vehicle B may have better MPG but potentially higher insurance or upfront price.</li>
              <li>- The correct choice depends on annual mileage, real fuel spread, and payback horizon.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Threshold and Timing Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If annual miles are low, fuel savings may not justify higher upfront cost.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If annual miles are high, fuel efficiency gains usually compound faster.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If insurance delta is large, quote comparisons become critical.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use multi-year projections for purchase decisions, not one-year snapshots.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />Optimization and Savings Strategies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Validate real MPG through full-tank tracking before deciding.</li>
              <li>- Re-shop insurance with matched deductibles and coverage terms.</li>
              <li>- Reduce idle time and improve route efficiency to enhance realized savings.</li>
              <li>- Use fuel-price monitoring and station strategy to reduce volatility impact.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Risks, Limits, and Planning Boundaries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Fuel-market shocks can rapidly change annual comparison outcomes.</li>
              <li>- Seasonal weather and traffic can reduce expected MPG gains.</li>
              <li>- Maintenance costs vary by model, service region, and parts availability.</li>
              <li>- Estimates are planning-grade, not guarantees of realized ownership cost.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Fuel Economy Comparison Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Planning Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Annual Miles</td>
                <td className="py-3 px-4">8,000 - 22,000+</td>
                <td className="py-3 px-4">miles/year</td>
                <td className="py-3 px-4 text-muted-foreground">Higher miles amplify fuel-economy differences</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Fuel Price</td>
                <td className="py-3 px-4">$2.80 - $5.20+</td>
                <td className="py-3 px-4">$/gallon</td>
                <td className="py-3 px-4 text-muted-foreground">Regional spread can materially shift outcomes</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Effective MPG Gap</td>
                <td className="py-3 px-4">3 - 12+</td>
                <td className="py-3 px-4">mpg difference</td>
                <td className="py-3 px-4 text-muted-foreground">Larger gap usually improves fuel savings potential</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Fuel Inflation Assumption</td>
                <td className="py-3 px-4">2% - 7%</td>
                <td className="py-3 px-4">annual growth</td>
                <td className="py-3 px-4 text-muted-foreground">Use scenario ranges for planning resilience</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Idle Fuel Burn</td>
                <td className="py-3 px-4">0.2 - 0.6</td>
                <td className="py-3 px-4">gallons/hour</td>
                <td className="py-3 px-4 text-muted-foreground">Urban and stop-and-go patterns increase idle impact</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are for planning context only. Use local prices, observed MPG, and real ownership expenses for final decisions.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Government and Official Guidance</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Gasoline and Diesel Prices</a> - fuel-price trend context</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - MPG data and fuel-use guidance</li>
              <li>- <a href="https://www.epa.gov/greenvehicles" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA Green Vehicle Resources</a> - vehicle efficiency and emissions context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.nhtsa.gov/road-safety/fuel-economy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA Fuel Economy Resources</a> - driving behavior and efficiency considerations</li>
              <li>- <a href="https://afdc.energy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE Alternative Fuels Data Center</a> - fuel and efficiency reference data</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Financial and Cost Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Context</a> - ownership operating-cost framing</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. BLS CPI</a> - inflation and cost-planning context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Community and Driver Experience Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/cars</a> - real-world MPG and ownership comparisons</li>
              <li>- <a href="https://www.reddit.com/r/personalfinance/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/personalfinance</a> - household transport budgeting discussions</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is for planning and educational use. It does not replace personalized financial, tax, insurance, or legal advice.
        </p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={faqItems} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="Fuel Economy Comparison Calculator" />
      </div>
    </div>
  );
};

export default AdvancedFuelEconomyComparisonCalculator;
