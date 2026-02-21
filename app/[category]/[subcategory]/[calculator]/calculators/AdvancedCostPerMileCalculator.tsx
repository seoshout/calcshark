'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bus,
  Calculator,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock3,
  DollarSign,
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
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode =
  | 'basic'
  | 'vehicle-operations'
  | 'business-mileage'
  | 'delivery-analysis'
  | 'scenario-planning';

interface Inputs {
  calculationMode: CalculationMode;
  annualMiles: string;
  fuelPricePerGallon: string;
  vehicleMpg: string;
  maintenancePerMile: string;
  depreciationPerMile: string;
  tirePerMile: string;
  insurancePerMonth: string;
  financingPerMonth: string;
  parkingPerMonth: string;
  tollsPerMonth: string;
  otherMonthlyCosts: string;
  includeTimeCost: boolean;
  driveHoursPerMonth: string;
  hourlyValueOfTime: string;
  transitAlternativePerMonth: string;
}

interface Breakdown {
  fuelAnnual: number;
  maintenanceAnnual: number;
  depreciationAnnual: number;
  tireAnnual: number;
  insuranceAnnual: number;
  financingAnnual: number;
  parkingAnnual: number;
  tollsAnnual: number;
  otherAnnual: number;
  timeAnnual: number;
}

interface Scenario {
  label: string;
  annualCost: number;
  annualSavings: number;
  notes: string;
}

interface Result {
  annualMiles: number;
  annualCost: number;
  monthlyCost: number;
  costPerMile: number;
  costPerMonthPerVehicle: number;
  costPerWorkDay: number;
  transitAlternativeAnnual: number;
  transitSavingsAnnual: number;
  largestCostDriver: string;
  breakdown: Breakdown;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedCostPerMileCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'vehicle-operations',
    annualMiles: '14000',
    fuelPricePerGallon: '3.75',
    vehicleMpg: '27',
    maintenancePerMile: '0.11',
    depreciationPerMile: '0.21',
    tirePerMile: '0.02',
    insurancePerMonth: '155',
    financingPerMonth: '290',
    parkingPerMonth: '120',
    tollsPerMonth: '85',
    otherMonthlyCosts: '45',
    includeTimeCost: true,
    driveHoursPerMonth: '30',
    hourlyValueOfTime: '30',
    transitAlternativePerMonth: '260'
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

  const findLargestDriver = (breakdown: Breakdown): string => {
    const entries: Array<[string, number]> = [
      ['Fuel', breakdown.fuelAnnual],
      ['Maintenance', breakdown.maintenanceAnnual],
      ['Depreciation', breakdown.depreciationAnnual],
      ['Tires', breakdown.tireAnnual],
      ['Insurance', breakdown.insuranceAnnual],
      ['Financing', breakdown.financingAnnual],
      ['Parking', breakdown.parkingAnnual],
      ['Tolls', breakdown.tollsAnnual],
      ['Other', breakdown.otherAnnual],
      ['Time Value', breakdown.timeAnnual]
    ];

    return [...entries].sort((a, b) => b[1] - a[1])[0][0];
  };

  const buildRecommendations = (costPerMile: number, annualCost: number, largestCostDriver: string): string[] => {
    const recommendations: string[] = [];

    if (largestCostDriver === 'Depreciation') {
      recommendations.push('Depreciation is your top cost driver. Reducing annual miles and extending vehicle replacement cycles can lower total cost-per-mile materially.');
    }
    if (largestCostDriver === 'Financing') {
      recommendations.push('Financing is a major component. Refinance options, term optimization, or lower principal exposure may improve per-mile economics.');
    }
    if (largestCostDriver === 'Fuel') {
      recommendations.push('Fuel is a dominant cost. Route timing, smoother driving behavior, and MPG improvements usually produce immediate savings.');
    }
    if (largestCostDriver === 'Time Value') {
      recommendations.push('Time-value burden is high. Focus on route reliability, trip batching, and schedule redesign before minor expense categories.');
    }
    if (costPerMile > 1.2) {
      recommendations.push('Cost per mile is high versus common planning benchmarks. Audit fixed costs first, then variable costs by annual impact.');
    }
    if (annualCost > 18000) {
      recommendations.push('Annual operating burden is elevated. Set a 90-day cost reduction target and track actual vs planned savings monthly.');
    }

    recommendations.push('Recalculate quarterly with updated price assumptions to maintain decision-quality planning.');

    return recommendations;
  };

  const buildWarnings = (annualMiles: number): string[] => {
    const warnings: string[] = [];

    const mpg = parseNonNegative(inputs.vehicleMpg);
    if (mpg > 0 && mpg < 12) {
      warnings.push('MPG appears very low. Verify fuel-efficiency input to avoid overstated operating costs.');
    }

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so cost-per-mile cannot be computed accurately.');
    }

    const driveHours = parseNonNegative(inputs.driveHoursPerMonth);
    if (inputs.includeTimeCost && driveHours === 0) {
      warnings.push('Time-cost is enabled but monthly drive-hours are zero. Time-value contribution will be understated.');
    }

    warnings.push('This tool is an estimation model. Actual costs vary based on maintenance events, regional pricing, and vehicle condition changes.');

    return warnings;
  };

  const buildNextSteps = (): string[] => {
    return [
      'Save this baseline with date-stamped assumptions.',
      'Identify the top two cost drivers and assign one reduction action per driver.',
      'Track actual monthly expenses against model assumptions.',
      'Recalculate after insurance, financing, fuel, or route changes.',
      'Use scenario output before vehicle replacement or mode-switch decisions.'
    ];
  };

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const fuelPricePerGallon = parseNonNegative(inputs.fuelPricePerGallon);
    const vehicleMpg = Math.max(1, parseNonNegative(inputs.vehicleMpg));
    const maintenancePerMile = parseNonNegative(inputs.maintenancePerMile);
    const depreciationPerMile = parseNonNegative(inputs.depreciationPerMile);
    const tirePerMile = parseNonNegative(inputs.tirePerMile);
    const insurancePerMonth = parseNonNegative(inputs.insurancePerMonth);
    const financingPerMonth = parseNonNegative(inputs.financingPerMonth);
    const parkingPerMonth = parseNonNegative(inputs.parkingPerMonth);
    const tollsPerMonth = parseNonNegative(inputs.tollsPerMonth);
    const otherMonthlyCosts = parseNonNegative(inputs.otherMonthlyCosts);
    const driveHoursPerMonth = parseNonNegative(inputs.driveHoursPerMonth);
    const hourlyValueOfTime = parseNonNegative(inputs.hourlyValueOfTime);
    const transitAlternativePerMonth = parseNonNegative(inputs.transitAlternativePerMonth);

    const fuelPerMile = fuelPricePerGallon / vehicleMpg;

    const breakdown: Breakdown = {
      fuelAnnual: annualMiles * fuelPerMile,
      maintenanceAnnual: annualMiles * maintenancePerMile,
      depreciationAnnual: annualMiles * depreciationPerMile,
      tireAnnual: annualMiles * tirePerMile,
      insuranceAnnual: insurancePerMonth * 12,
      financingAnnual: financingPerMonth * 12,
      parkingAnnual: parkingPerMonth * 12,
      tollsAnnual: tollsPerMonth * 12,
      otherAnnual: otherMonthlyCosts * 12,
      timeAnnual: inputs.includeTimeCost ? driveHoursPerMonth * 12 * hourlyValueOfTime : 0
    };

    const annualCost =
      breakdown.fuelAnnual +
      breakdown.maintenanceAnnual +
      breakdown.depreciationAnnual +
      breakdown.tireAnnual +
      breakdown.insuranceAnnual +
      breakdown.financingAnnual +
      breakdown.parkingAnnual +
      breakdown.tollsAnnual +
      breakdown.otherAnnual +
      breakdown.timeAnnual;

    const monthlyCost = annualCost / 12;
    const costPerMile = annualMiles > 0 ? annualCost / annualMiles : 0;
    const costPerWorkDay = annualCost / 260;

    const transitAlternativeAnnual = transitAlternativePerMonth * 12;
    const transitSavingsAnnual = Math.max(0, annualCost - transitAlternativeAnnual);

    const largestCostDriver = findLargestDriver(breakdown);

    const fuelImprovementAnnual =
      annualCost - breakdown.fuelAnnual + annualMiles * (fuelPricePerGallon / (vehicleMpg * 1.15));

    const mileageReductionAnnual = annualCost * 0.85;

    const fixedCostReductionAnnual =
      annualCost - (breakdown.insuranceAnnual + breakdown.financingAnnual + breakdown.otherAnnual) * 0.18;

    const parkingTollReductionAnnual =
      annualCost - (breakdown.parkingAnnual + breakdown.tollsAnnual) * 0.35;

    const mixedTransitAnnual = annualCost * 0.65 + transitAlternativeAnnual * 0.35;

    const scenarios: Scenario[] = [
      {
        label: 'Improve MPG by 15%',
        annualCost: fuelImprovementAnnual,
        annualSavings: Math.max(0, annualCost - fuelImprovementAnnual),
        notes: 'Higher impact for high-mileage drivers and low-MPG vehicles.'
      },
      {
        label: 'Reduce Annual Miles by 15%',
        annualCost: mileageReductionAnnual,
        annualSavings: Math.max(0, annualCost - mileageReductionAnnual),
        notes: 'Trip consolidation and route optimization usually drive this outcome.'
      },
      {
        label: 'Reduce Fixed Cost Stack by 18%',
        annualCost: fixedCostReductionAnnual,
        annualSavings: Math.max(0, annualCost - fixedCostReductionAnnual),
        notes: 'Applies to insurance, financing, and recurring monthly non-mile costs.'
      },
      {
        label: 'Reduce Parking + Tolls by 35%',
        annualCost: parkingTollReductionAnnual,
        annualSavings: Math.max(0, annualCost - parkingTollReductionAnnual),
        notes: 'Based on route/schedule adjustments and subsidy opportunities.'
      },
      {
        label: 'Transit Substitution (35% of travel)',
        annualCost: mixedTransitAnnual,
        annualSavings: Math.max(0, annualCost - mixedTransitAnnual),
        notes: 'Useful for evaluating blended mode strategy without full replacement.'
      }
    ].sort((a, b) => b.annualSavings - a.annualSavings);

    setResult({
      annualMiles,
      annualCost,
      monthlyCost,
      costPerMile,
      costPerMonthPerVehicle: monthlyCost,
      costPerWorkDay,
      transitAlternativeAnnual,
      transitSavingsAnnual,
      largestCostDriver,
      breakdown,
      scenarios,
      recommendations: buildRecommendations(costPerMile, annualCost, largestCostDriver),
      warningsAndConsiderations: buildWarnings(annualMiles),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'vehicle-operations',
      annualMiles: '14000',
      fuelPricePerGallon: '3.75',
      vehicleMpg: '27',
      maintenancePerMile: '0.11',
      depreciationPerMile: '0.21',
      tirePerMile: '0.02',
      insurancePerMonth: '155',
      financingPerMonth: '290',
      parkingPerMonth: '120',
      tollsPerMonth: '85',
      otherMonthlyCosts: '45',
      includeTimeCost: true,
      driveHoursPerMonth: '30',
      hourlyValueOfTime: '30',
      transitAlternativePerMonth: '260'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'What is cost per mile and why does it matter?',
      answer: 'Cost per mile is total operating cost divided by total miles. It helps compare vehicle efficiency, route economics, and transportation mode options on a consistent basis.',
      category: 'Basics'
    },
    {
      question: 'Why is fuel-only cost per mile inaccurate?',
      answer: 'Fuel-only estimates ignore maintenance, depreciation, insurance, financing, parking, and tolls. Full-cost modeling is required for realistic planning.',
      category: 'Accuracy'
    },
    {
      question: 'Should depreciation be included?',
      answer: 'Yes. For many drivers, depreciation is one of the largest per-mile costs and can exceed fuel costs in newer vehicles.',
      category: 'Method'
    },
    {
      question: 'How do I estimate maintenance per mile?',
      answer: 'Use annual maintenance spend divided by annual miles over the last 12 months. Update quarterly to account for service variability.',
      category: 'Inputs'
    },
    {
      question: 'How does financing change cost-per-mile?',
      answer: 'Monthly financing increases fixed-cost burden. At lower annual miles, fixed costs push cost-per-mile up significantly.',
      category: 'Financing'
    },
    {
      question: 'Can this help with business mileage planning?',
      answer: 'Yes. It is useful for budgeting and pricing decisions, but tax reporting should follow official IRS rules and documentation.',
      category: 'Business'
    },
    {
      question: 'Is transit comparison included?',
      answer: 'Yes. You can enter a monthly transit alternative and compare annual differences against your modeled driving cost.',
      category: 'Comparison'
    },
    {
      question: 'Should I include time value?',
      answer: 'Include time value for strategic decisions where opportunity cost matters. Exclude it for strict cash-only budgeting.',
      category: 'Decision'
    },
    {
      question: 'How often should I update this model?',
      answer: 'Quarterly updates are recommended due to fuel-price volatility, insurance changes, and route/schedule adjustments.',
      category: 'Workflow'
    },
    {
      question: 'What is a good cost-per-mile target?',
      answer: 'Targets vary by location and vehicle type. Use this tool to benchmark your own baseline and reduce by the highest-impact categories first.',
      category: 'Targets'
    }
  ];

  const breakdownEntries = result
    ? [
        { label: 'Fuel', value: result.breakdown.fuelAnnual, icon: Car, color: 'bg-blue-500' },
        { label: 'Maintenance', value: result.breakdown.maintenanceAnnual, icon: Gauge, color: 'bg-emerald-500' },
        { label: 'Depreciation', value: result.breakdown.depreciationAnnual, icon: TrendingDown, color: 'bg-rose-500' },
        { label: 'Tires', value: result.breakdown.tireAnnual, icon: Route, color: 'bg-violet-500' },
        { label: 'Insurance', value: result.breakdown.insuranceAnnual, icon: Shield, color: 'bg-cyan-500' },
        { label: 'Financing', value: result.breakdown.financingAnnual, icon: Wallet, color: 'bg-amber-500' },
        { label: 'Parking + Tolls', value: result.breakdown.parkingAnnual + result.breakdown.tollsAnnual, icon: MapPin, color: 'bg-slate-500' },
        { label: 'Time Value', value: result.breakdown.timeAnnual, icon: Clock3, color: 'bg-pink-500' }
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
            <h2 className="text-2xl font-bold text-foreground">Cost Per Mile Calculator</h2>
            <p className="text-muted-foreground">Advanced full-cost operating analysis for vehicle, business, and commute planning</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes full variable and fixed costs, time value, and scenario modeling'
                : 'Uses core annual miles and baseline operating assumptions'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Core annual cost model'}
                  {inputs.calculationMode === 'vehicle-operations' && 'Vehicle Operations - Full private-use stack'}
                  {inputs.calculationMode === 'business-mileage' && 'Business Mileage - Planning and reimbursement context'}
                  {inputs.calculationMode === 'delivery-analysis' && 'Delivery Analysis - High-mileage optimization'}
                  {inputs.calculationMode === 'scenario-planning' && 'Scenario Planning - Compare savings strategies'}
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
                          ['basic', 'Basic', 'Core annual cost model'],
                          ['vehicle-operations', 'Vehicle Operations', 'Full private-use stack'],
                          ['business-mileage', 'Business Mileage', 'Planning and reimbursement context'],
                          ['delivery-analysis', 'Delivery Analysis', 'High-mileage optimization'],
                          ['scenario-planning', 'Scenario Planning', 'Compare savings strategies']
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
            <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gallon)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.fuelPricePerGallon}
              onChange={(e) => handleInputChange('fuelPricePerGallon', e.target.value)}
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

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Variable Cost Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Maintenance ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.maintenancePerMile} onChange={(e) => handleInputChange('maintenancePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Depreciation ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.depreciationPerMile} onChange={(e) => handleInputChange('depreciationPerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tire Cost ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.tirePerMile} onChange={(e) => handleInputChange('tirePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Fixed and Alternative Cost Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Insurance ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.insurancePerMonth} onChange={(e) => handleInputChange('insurancePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Financing ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.financingPerMonth} onChange={(e) => handleInputChange('financingPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parking ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.parkingPerMonth} onChange={(e) => handleInputChange('parkingPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tolls ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.tollsPerMonth} onChange={(e) => handleInputChange('tollsPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Other Costs ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.otherMonthlyCosts} onChange={(e) => handleInputChange('otherMonthlyCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Transit Alternative ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.transitAlternativePerMonth} onChange={(e) => handleInputChange('transitAlternativePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Advanced Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeTimeCost}
                  onChange={(e) => handleInputChange('includeTimeCost', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Time Value in Total Cost</strong>
                  <br />
                  Adds monthly drive-hours × hourly value as annual opportunity cost.
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Drive Hours / Month</label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.driveHoursPerMonth}
                    onChange={(e) => handleInputChange('driveHoursPerMonth', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time Value ($/hour)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputs.hourlyValueOfTime}
                    onChange={(e) => handleInputChange('hourlyValueOfTime', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
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
            Calculate Cost Per Mile
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
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced operating-cost framework for private, business, and high-mileage vehicle use</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator estimates your true vehicle cost per mile by combining variable cost categories
          (fuel, maintenance, depreciation, tires) with fixed cost categories (insurance, financing, recurring fees)
          and optional time-value burden.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is designed to solve common planning problems from forums and operator communities: setting delivery pricing floors,
          evaluating reimbursement adequacy, comparing transit alternatives, and prioritizing the highest-impact savings actions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Five Calculation Modes</h3>
            </div>
            <p className="text-sm text-muted-foreground">Basic, operations, business mileage, delivery analysis, and scenario planning modes.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Full Cost Breakdown</h3>
            </div>
            <p className="text-sm text-muted-foreground">Category-level visibility to identify what actually drives your per-mile burden.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Bus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Alternative Comparison</h3>
            </div>
            <p className="text-sm text-muted-foreground">Includes transit-alternative comparison and mixed-mode scenario economics.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Clock3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Time-Value Layer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Optional opportunity-cost integration for strategic transport decisions.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario Prioritization</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Business-Use Context</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Cost Per Mile Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Total Annual Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.annualCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cost Per Mile</p>
                <p className="text-2xl font-bold text-foreground">${result.costPerMile.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.monthlyCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Transit Alternative Savings</p>
                <p className="text-2xl font-bold text-foreground">${result.transitSavingsAnnual.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest cost driver: <strong>{result.largestCostDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Annual miles modeled: <strong>{Math.round(result.annualMiles).toLocaleString()}</strong></p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Breakdown
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
                Savings Scenarios (Highest Impact First)
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
                        <p className="font-semibold text-foreground">${scenario.annualSavings.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">saved/yr</p>
                      </div>
                    </div>
                  </div>
                ))}
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
          How to Use This Free Online Cost Per Mile Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                1) Enter annual mileage baseline
              </h4>
              Set realistic annual miles first. This is the denominator that drives all per-mile outputs.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                2) Add fuel and efficiency assumptions
              </h4>
              Input local fuel price and realistic MPG based on observed performance, not brochure estimates.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                3) Add variable per-mile costs
              </h4>
              Include maintenance, depreciation, and tire cost-per-mile for full operating realism.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                4) Add fixed monthly costs
              </h4>
              Add insurance, financing, parking, tolls, and other recurring expenses.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                5) Enable time-value if strategic
              </h4>
              Use drive-hours and hourly value to include opportunity-cost burden.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                6) Review popup output and action scenarios
              </h4>
              Focus on largest cost drivers and implement the highest annual savings scenarios first.
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
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <DollarSign className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Annual and Monthly Cost Totals
                </h4>
                <p className="text-xs text-muted-foreground">Budget-ready total cost view for planning and forecasting.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gauge className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Cost Per Mile Core Metric
                </h4>
                <p className="text-xs text-muted-foreground">Primary efficiency metric for vehicle, route, and pricing decisions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Category Cost Breakdown
                </h4>
                <p className="text-xs text-muted-foreground">Shows cost composition and the largest annual burden category.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Ranked Savings Scenarios
                </h4>
                <p className="text-xs text-muted-foreground">Action list sorted by annual dollar impact for prioritization.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Comprehensive Planning
              </h4>
              <p className="text-xs text-muted-foreground">Uses full operating-cost stack instead of single-category estimates.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Business Decision Utility
              </h4>
              <p className="text-xs text-muted-foreground">Useful for pricing floors, reimbursement checks, and fleet planning.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Actionable Output
              </h4>
              <p className="text-xs text-muted-foreground">Recommendations and scenarios are prioritized by annual savings impact.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Alternative Comparison
              </h4>
              <p className="text-xs text-muted-foreground">Transit alternative comparison helps mode-choice planning.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
              <span>Five calculation modes covering private-use, business, and scenario workflows.</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
              <span>Optional time-value integration for opportunity-cost aware analysis.</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
              <span>Savings scenario ranking to focus implementation on highest-value actions.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Cost Per Mile Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Why Fuel-Only Cost Per Mile Understates Reality
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Fuel is visible and variable, but total vehicle economics include maintenance cycles, depreciation, financing, insurance,
              and recurring local fees. Ignoring those categories can lead to underpricing and budget drift.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Major Cost Drivers and How They Shift
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">High-mileage drivers usually see fuel + maintenance dominate variable costs.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Low-mileage drivers often carry higher fixed cost per mile due to financing/insurance spread.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Newer vehicles commonly have higher depreciation burden but lower maintenance in early years.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Urban profiles are often sensitive to parking/tolls more than fuel efficiency alone.</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Advanced Comparison: Driving vs Transit Alternative
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Transit comparison can be meaningful when parking/toll burden is high. However, total decision quality improves when
              you include reliability, transfer complexity, and schedule flexibility alongside dollar cost.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Use blended-mode scenarios before all-or-nothing mode decisions.</li>
              <li>- Compare annual totals and monthly volatility separately.</li>
              <li>- Reevaluate assumptions after fare or route policy changes.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Thresholds and Planning Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If cost-per-mile rises above internal pricing assumptions, refresh rate cards and reimbursement logic.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If fixed costs dominate, utilization strategy (more efficient mileage) may outperform fuel optimization alone.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If variable costs dominate, focus on miles, MPG, and route quality first.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If time burden is high, scenario planning should include schedule redesign.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Financial Optimization Options
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Insurance repricing and deductible strategy review</li>
              <li>- Financing refinance or term optimization analysis</li>
              <li>- Employer parking/toll subsidy utilization and route scheduling</li>
              <li>- Preventive maintenance scheduling to avoid reactive cost spikes</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk and Decision Quality Considerations
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Fuel-price volatility can change model output quickly.</li>
              <li>- Irregular maintenance events create short-term variance from plan.</li>
              <li>- Depreciation assumptions should be reviewed against market conditions.</li>
              <li>- Treat scenario outputs as planning ranges, not deterministic forecasts.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Cost Per Mile Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">Maintenance</td>
                <td className="py-3 px-4">$0.08 - $0.20</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Higher with age, heavy load, and stop-go exposure</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Depreciation</td>
                <td className="py-3 px-4">$0.12 - $0.35</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Can dominate total cost in newer vehicles</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Fuel Component</td>
                <td className="py-3 px-4">$0.08 - $0.25</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Depends on local fuel price and realized MPG</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Parking + Tolls</td>
                <td className="py-3 px-4">$0 - $0.20+</td>
                <td className="py-3 px-4">per mile equivalent</td>
                <td className="py-3 px-4 text-muted-foreground">Urban commutes often show highest variability</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Total Cost Per Mile</td>
                <td className="py-3 px-4">$0.45 - $1.40+</td>
                <td className="py-3 px-4">all-in estimate</td>
                <td className="py-3 px-4 text-muted-foreground">Use your own assumptions as primary decision basis</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are contextual planning ranges, not fixed standards. Local market and vehicle profile differences are expected.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Official and Government Data
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Fuel Data</a> - gasoline and diesel pricing context</li>
              <li>- <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Standard Mileage Rates</a> - reference for mileage-cost frameworks</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI</a> - transportation cost trend context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Research and Cost Studies
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Research</a> - ownership and operating-cost methodology context</li>
              <li>- <a href="https://afdc.energy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Alternative Fuels Data Center</a> - transportation operating context and energy references</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Market and Financial Context
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and transport-spend trend baselining</li>
              <li>- <a href="https://www.consumerfinance.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB</a> - consumer financing and budgeting context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Educational and Planning Resources
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.transportation.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. DOT</a> - transportation planning and public guidance context</li>
              <li>- <a href="https://www.bts.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Bureau of Transportation Statistics</a> - mobility and usage context for scenario assumptions</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is designed for planning and budgeting decisions. It is not tax, legal, or accounting advice and should be paired with local records for compliance use.
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
        <CalculatorReview calculatorName="Cost Per Mile Calculator" />
      </div>
    </div>
  );
};

export default AdvancedCostPerMileCalculator;
