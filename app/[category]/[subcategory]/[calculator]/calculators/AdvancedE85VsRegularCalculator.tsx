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
  Droplets,
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

type CalculationMode = 'basic' | 'daily-driver' | 'performance' | 'high-mileage' | 'station-access';

interface Inputs {
  calculationMode: CalculationMode;
  annualMiles: string;
  regularPricePerGallon: string;
  e85PricePerGallon: string;
  regularMpg: string;
  e85MpgLossPercent: string;
  tankSizeGallons: string;
  maintenanceDifferencePerMile: string;
  includeStationOverhead: boolean;
  extraDetourMilesPerFill: string;
  extraMinutesPerFill: string;
  includeTimeCost: boolean;
  valueOfTimePerHour: string;
  ethanolContentPercent: string;
}

interface Scenario {
  label: string;
  netAnnualSavings: number;
  notes: string;
}

interface Result {
  annualMiles: number;
  regularMpg: number;
  e85Mpg: number;
  regularFuelCostPerMile: number;
  e85FuelCostPerMile: number;
  annualRegularFuelCost: number;
  annualE85FuelCost: number;
  annualFuelSavingsBeforeOverhead: number;
  annualDetourFuelCost: number;
  annualTimeCost: number;
  annualMaintenanceDelta: number;
  netAnnualSavings: number;
  monthlyNetSavings: number;
  requiredE85PriceToBreakEven: number;
  requiredDiscountPercent: number;
  effectiveE85DiscountPercent: number;
  regularRangePerTank: number;
  e85RangePerTank: number;
  extraFillUpsPerYear: number;
  breakEvenMessage: string;
  largestDecisionDriver: string;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedE85VsRegularCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'daily-driver',
    annualMiles: '15000',
    regularPricePerGallon: '3.45',
    e85PricePerGallon: '2.75',
    regularMpg: '25',
    e85MpgLossPercent: '22',
    tankSizeGallons: '18',
    maintenanceDifferencePerMile: '0.00',
    includeStationOverhead: true,
    extraDetourMilesPerFill: '1.5',
    extraMinutesPerFill: '4',
    includeTimeCost: true,
    valueOfTimePerHour: '28',
    ethanolContentPercent: '70'
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

  const determineDriver = (
    fuelSavingsBeforeOverhead: number,
    detourFuelCost: number,
    timeCost: number,
    maintenanceDelta: number
  ): string => {
    const entries: Array<[string, number]> = [
      ['Fuel Price + MPG Tradeoff', Math.abs(fuelSavingsBeforeOverhead)],
      ['Station Detour Overhead', Math.abs(detourFuelCost)],
      ['Time Overhead', Math.abs(timeCost)],
      ['Maintenance Difference', Math.abs(maintenanceDelta)]
    ];

    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  const buildRecommendations = (
    netAnnualSavings: number,
    requiredDiscountPercent: number,
    effectiveDiscountPercent: number,
    largestDecisionDriver: string
  ): string[] => {
    const recommendations: string[] = [];

    if (netAnnualSavings > 0) {
      recommendations.push('E85 is currently favorable under your assumptions. Re-check monthly because regional fuel spreads can change quickly.');
    } else if (netAnnualSavings < 0) {
      recommendations.push('Regular gasoline is currently more economical. Revisit only if local E85 discount widens or station overhead drops.');
    } else {
      recommendations.push('The comparison is near break-even. Small changes in MPG loss or station convenience can flip the outcome.');
    }

    if (effectiveDiscountPercent >= requiredDiscountPercent) {
      recommendations.push(`Current E85 discount (${effectiveDiscountPercent.toFixed(1)}%) meets or exceeds the required break-even discount (${requiredDiscountPercent.toFixed(1)}%).`);
    } else {
      recommendations.push(`Current E85 discount (${effectiveDiscountPercent.toFixed(1)}%) is below required break-even discount (${requiredDiscountPercent.toFixed(1)}%).`);
    }

    if (largestDecisionDriver === 'Fuel Price + MPG Tradeoff') {
      recommendations.push('Fuel spread and MPG loss dominate this decision. Track actual dollar-per-mile over two full tanks before changing routine usage.');
    }
    if (largestDecisionDriver === 'Station Detour Overhead' || largestDecisionDriver === 'Time Overhead') {
      recommendations.push('Access friction is meaningful in your model. Only use E85 when stations align with existing commute routes.');
    }
    if (largestDecisionDriver === 'Maintenance Difference') {
      recommendations.push('Maintenance assumptions drive this outcome. Use model-specific service history rather than generic values.');
    }

    recommendations.push('Use cost-per-mile, not MPG alone, as the primary metric for E85 decisions.');
    return recommendations;
  };

  const buildWarnings = (annualMiles: number, e85MpgLossPercent: number): string[] => {
    const warnings: string[] = [];

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so annual savings and break-even estimates are not meaningful.');
    }

    if (e85MpgLossPercent < 5) {
      warnings.push('MPG loss is unusually low. Verify with real tank-to-tank data before relying on this assumption.');
    }

    if (e85MpgLossPercent > 35) {
      warnings.push('MPG loss is very high. Confirm fuel quality, driving profile, and powertrain tuning assumptions.');
    }

    const ethanolContentPercent = parseNonNegative(inputs.ethanolContentPercent);
    if (ethanolContentPercent < 51 || ethanolContentPercent > 83) {
      warnings.push('E85 ethanol content typically ranges by season/region; out-of-range values may reduce estimate quality.');
    }

    warnings.push('Only use E85 in flex-fuel-compatible vehicles. Misfueling can damage non-FFV engines and components.');
    warnings.push('This model is for budgeting decisions and does not replace manufacturer guidance or warranty requirements.');

    return warnings;
  };

  const buildNextSteps = (): string[] => [
    'Track two tanks on regular and two tanks on E85 using the same route profile.',
    'Record real cost-per-mile and compare against model assumptions.',
    'Update local station prices monthly and rerun break-even threshold.',
    'If station detours are significant, split strategy: E85 only on convenient fills.',
    'Recalculate after seasonal blend changes or major commute pattern shifts.'
  ];

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const regularPricePerGallon = parseNonNegative(inputs.regularPricePerGallon);
    const e85PricePerGallon = parseNonNegative(inputs.e85PricePerGallon);
    const regularMpg = Math.max(1, parseNonNegative(inputs.regularMpg));
    const e85MpgLossPercent = Math.min(80, parseNonNegative(inputs.e85MpgLossPercent));
    const tankSizeGallons = Math.max(1, parseNonNegative(inputs.tankSizeGallons));
    const maintenanceDifferencePerMile = parseNonNegative(inputs.maintenanceDifferencePerMile);
    const extraDetourMilesPerFill = parseNonNegative(inputs.extraDetourMilesPerFill);
    const extraMinutesPerFill = parseNonNegative(inputs.extraMinutesPerFill);
    const valueOfTimePerHour = parseNonNegative(inputs.valueOfTimePerHour);

    const e85Mpg = Math.max(1, regularMpg * (1 - e85MpgLossPercent / 100));

    const regularFuelCostPerMile = regularPricePerGallon / regularMpg;
    const e85FuelCostPerMile = e85PricePerGallon / e85Mpg;

    const annualRegularFuelCost = annualMiles * regularFuelCostPerMile;
    const annualE85FuelCost = annualMiles * e85FuelCostPerMile;
    const annualFuelSavingsBeforeOverhead = annualRegularFuelCost - annualE85FuelCost;

    const regularRangePerTank = regularMpg * tankSizeGallons;
    const e85RangePerTank = e85Mpg * tankSizeGallons;

    const regularFillUps = annualMiles > 0 ? annualMiles / Math.max(1, regularRangePerTank) : 0;
    const e85FillUps = annualMiles > 0 ? annualMiles / Math.max(1, e85RangePerTank) : 0;
    const extraFillUpsPerYear = Math.max(0, e85FillUps - regularFillUps);

    const annualDetourMiles = inputs.includeStationOverhead ? e85FillUps * extraDetourMilesPerFill : 0;
    const annualDetourFuelCost = annualDetourMiles * e85FuelCostPerMile;

    const annualTimeHours = inputs.includeStationOverhead ? (e85FillUps * extraMinutesPerFill) / 60 : 0;
    const annualTimeCost = inputs.includeTimeCost ? annualTimeHours * valueOfTimePerHour : 0;

    const annualMaintenanceDelta = annualMiles * maintenanceDifferencePerMile;

    const netAnnualSavings =
      annualFuelSavingsBeforeOverhead - annualDetourFuelCost - annualTimeCost - annualMaintenanceDelta;

    const monthlyNetSavings = netAnnualSavings / 12;

    const overheadPerMile =
      annualMiles > 0 ? (annualDetourFuelCost + annualTimeCost + annualMaintenanceDelta) / annualMiles : 0;

    const requiredE85PriceToBreakEven = Math.max(0, (regularFuelCostPerMile - overheadPerMile) * e85Mpg);

    const requiredDiscountPercent =
      regularPricePerGallon > 0
        ? Math.max(0, (1 - requiredE85PriceToBreakEven / regularPricePerGallon) * 100)
        : 0;

    const effectiveDiscountPercent =
      regularPricePerGallon > 0 ? Math.max(0, (1 - e85PricePerGallon / regularPricePerGallon) * 100) : 0;

    const breakEvenMessage =
      e85PricePerGallon <= requiredE85PriceToBreakEven
        ? 'Current E85 price is at or below break-even threshold.'
        : 'Current E85 price is above break-even threshold.';

    const largestDecisionDriver = determineDriver(
      annualFuelSavingsBeforeOverhead,
      annualDetourFuelCost,
      annualTimeCost,
      annualMaintenanceDelta
    );

    const scenarioPriceTight = regularPricePerGallon * 0.9;
    const scenarioPriceWide = regularPricePerGallon * 0.72;

    const scenarioTightSavings =
      annualRegularFuelCost - annualMiles * (scenarioPriceTight / e85Mpg) - annualDetourFuelCost - annualTimeCost - annualMaintenanceDelta;

    const scenarioWideSavings =
      annualRegularFuelCost - annualMiles * (scenarioPriceWide / e85Mpg) - annualDetourFuelCost - annualTimeCost - annualMaintenanceDelta;

    const scenarioWinterLossMpg = Math.max(1, regularMpg * (1 - Math.min(80, e85MpgLossPercent + 6) / 100));

    const scenarioWinterSavings =
      annualRegularFuelCost - annualMiles * (e85PricePerGallon / scenarioWinterLossMpg) - annualDetourFuelCost - annualTimeCost - annualMaintenanceDelta;

    const scenarioNoDetourSavings = annualFuelSavingsBeforeOverhead - annualMaintenanceDelta;

    const scenarios: Scenario[] = [
      {
        label: 'Narrow E85 Discount (10% below regular)',
        netAnnualSavings: scenarioTightSavings,
        notes: 'Common in regions with weak ethanol supply advantage.'
      },
      {
        label: 'Wide E85 Discount (28% below regular)',
        netAnnualSavings: scenarioWideSavings,
        notes: 'Often seen where local ethanol supply is strong.'
      },
      {
        label: 'Winter Blend / Higher MPG Loss',
        netAnnualSavings: scenarioWinterSavings,
        notes: 'Stress test for seasonal blend and colder-weather efficiency drop.'
      },
      {
        label: 'No Station Overhead Scenario',
        netAnnualSavings: scenarioNoDetourSavings,
        notes: 'Assumes E85 station access is on-route with no added time or detour.'
      }
    ].sort((a, b) => b.netAnnualSavings - a.netAnnualSavings);

    setResult({
      annualMiles,
      regularMpg,
      e85Mpg,
      regularFuelCostPerMile,
      e85FuelCostPerMile,
      annualRegularFuelCost,
      annualE85FuelCost,
      annualFuelSavingsBeforeOverhead,
      annualDetourFuelCost,
      annualTimeCost,
      annualMaintenanceDelta,
      netAnnualSavings,
      monthlyNetSavings,
      requiredE85PriceToBreakEven,
      requiredDiscountPercent,
      effectiveE85DiscountPercent: effectiveDiscountPercent,
      regularRangePerTank,
      e85RangePerTank,
      extraFillUpsPerYear,
      breakEvenMessage,
      largestDecisionDriver,
      scenarios,
      recommendations: buildRecommendations(
        netAnnualSavings,
        requiredDiscountPercent,
        effectiveDiscountPercent,
        largestDecisionDriver
      ),
      warningsAndConsiderations: buildWarnings(annualMiles, e85MpgLossPercent),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'daily-driver',
      annualMiles: '15000',
      regularPricePerGallon: '3.45',
      e85PricePerGallon: '2.75',
      regularMpg: '25',
      e85MpgLossPercent: '22',
      tankSizeGallons: '18',
      maintenanceDifferencePerMile: '0.00',
      includeStationOverhead: true,
      extraDetourMilesPerFill: '1.5',
      extraMinutesPerFill: '4',
      includeTimeCost: true,
      valueOfTimePerHour: '28',
      ethanolContentPercent: '70'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How much cheaper must E85 be to break even?',
      answer:
        'A common rule is that E85 needs to be discounted by roughly the same percentage as your MPG loss. If MPG drops 20%, E85 generally needs about a 20% price discount before overhead costs.',
      category: 'Break-even'
    },
    {
      question: 'Why do I get lower MPG on E85?',
      answer:
        'E85 has lower energy content per gallon than regular gasoline, so FFVs typically consume more fuel volume per mile to produce similar usable power output.',
      category: 'Basics'
    },
    {
      question: 'Should I compare MPG or cost per mile?',
      answer:
        'Use cost per mile. MPG alone can be misleading because lower pump price can still produce equal or lower cost per mile depending on local fuel spread.',
      category: 'Method'
    },
    {
      question: 'Can I run E85 in any gasoline vehicle?',
      answer:
        'No. E85 should only be used in flex-fuel vehicles designed for high ethanol blends. Using E85 in non-FFV vehicles can damage fuel-system components and void warranties.',
      category: 'Safety'
    },
    {
      question: 'Why can E85 feel more powerful in some setups?',
      answer:
        'E85 has higher octane potential, which can support different tuning strategies in compatible setups. However, power potential does not automatically mean lower operating cost.',
      category: 'Performance'
    },
    {
      question: 'How does station availability affect savings?',
      answer:
        'If E85 requires detours or longer fill time, overhead can reduce or eliminate savings. Include these logistics in your break-even math.',
      category: 'Logistics'
    },
    {
      question: 'Why does E85 performance vary by season?',
      answer:
        'E85 ethanol content can vary by region and season, which changes energy content and can shift real-world MPG loss versus regular gasoline.',
      category: 'Seasonality'
    },
    {
      question: 'Is E85 better for emissions?',
      answer:
        'Lifecycle and tailpipe impacts vary by context, feedstock, and methodology. For most drivers here, this calculator focuses on direct budgeting economics, not compliance accounting.',
      category: 'Emissions'
    },
    {
      question: 'How often should I update this analysis?',
      answer:
        'Monthly price checks are ideal for active E85 users. Recalculate immediately when your commute, station access, or seasonal blend shifts materially.',
      category: 'Workflow'
    },
    {
      question: 'Why does this calculator include time cost?',
      answer:
        'Some drivers report meaningful extra time for E85 access. Time cost helps estimate full decision impact when convenience tradeoffs are real.',
      category: 'Advanced'
    }
  ];

  const breakdownEntries = result
    ? [
        { label: 'Fuel Savings Before Overhead', value: Math.abs(result.annualFuelSavingsBeforeOverhead), icon: Fuel, color: 'bg-blue-500' },
        { label: 'Detour Fuel Overhead', value: result.annualDetourFuelCost, icon: Route, color: 'bg-emerald-500' },
        { label: 'Time Overhead', value: result.annualTimeCost, icon: Clock3, color: 'bg-rose-500' },
        { label: 'Maintenance Difference', value: result.annualMaintenanceDelta, icon: Wrench, color: 'bg-violet-500' }
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
            <h2 className="text-2xl font-bold text-foreground">E85 vs Regular Calculator</h2>
            <p className="text-muted-foreground">Advanced cost-per-mile and break-even analysis for flex-fuel vehicle owners</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes station-detour/time overhead, break-even discount threshold, and seasonal stress scenarios'
                : 'Uses basic fuel-price and MPG assumptions for quick comparison'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Fuel price and MPG comparison'}
                  {inputs.calculationMode === 'daily-driver' && 'Daily Driver - Routine commute economics'}
                  {inputs.calculationMode === 'performance' && 'Performance - Higher octane/tune context'}
                  {inputs.calculationMode === 'high-mileage' && 'High Mileage - Cost-per-mile optimization'}
                  {inputs.calculationMode === 'station-access' && 'Station Access - Detour/time burden focus'}
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
                          ['basic', 'Basic', 'Fuel price and MPG comparison'],
                          ['daily-driver', 'Daily Driver', 'Routine commute economics'],
                          ['performance', 'Performance', 'Higher octane/tune context'],
                          ['high-mileage', 'High Mileage', 'Cost-per-mile optimization'],
                          ['station-access', 'Station Access', 'Detour/time burden focus']
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
            <label className="block text-sm font-medium text-foreground mb-2">Regular Price ($/gallon)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.regularPricePerGallon}
              onChange={(e) => handleInputChange('regularPricePerGallon', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">E85 Price ($/gallon)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.e85PricePerGallon}
              onChange={(e) => handleInputChange('e85PricePerGallon', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Regular MPG</label>
            <input
              type="number"
              min="1"
              value={inputs.regularMpg}
              onChange={(e) => handleInputChange('regularMpg', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Expected MPG Loss on E85 (%)</label>
            <input
              type="number"
              min="0"
              max="80"
              value={inputs.e85MpgLossPercent}
              onChange={(e) => handleInputChange('e85MpgLossPercent', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tank Size (gallons)</label>
            <input
              type="number"
              min="1"
              value={inputs.tankSizeGallons}
              onChange={(e) => handleInputChange('tankSizeGallons', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel and Blend Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Estimated Ethanol Content in E85 (%)</label>
              <input type="number" min="51" max="83" value={inputs.ethanolContentPercent} onChange={(e) => handleInputChange('ethanolContentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Maintenance Difference on E85 ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.maintenanceDifferencePerMile} onChange={(e) => handleInputChange('maintenanceDifferencePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Station Access and Time Overhead
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-background">
              <input
                type="checkbox"
                checked={inputs.includeStationOverhead}
                onChange={(e) => handleInputChange('includeStationOverhead', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Include Station Detour Overhead</strong>
                <br />
                Adds extra detour miles and fill-time overhead to the E85 scenario.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 border border-cyan-200 dark:border-cyan-700 rounded-lg bg-background">
              <input
                type="checkbox"
                checked={inputs.includeTimeCost}
                onChange={(e) => handleInputChange('includeTimeCost', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Include Time Cost</strong>
                <br />
                Applies value-of-time to added fueling minutes.
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Extra Detour Miles per Fill</label>
              <input type="number" min="0" step="0.1" value={inputs.extraDetourMilesPerFill} onChange={(e) => handleInputChange('extraDetourMilesPerFill', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Extra Minutes per Fill</label>
              <input type="number" min="0" step="1" value={inputs.extraMinutesPerFill} onChange={(e) => handleInputChange('extraMinutesPerFill', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Value of Time ($/hour)</label>
              <input type="number" min="0" step="0.01" value={inputs.valueOfTimePerHour} onChange={(e) => handleInputChange('valueOfTimePerHour', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={calculate}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate E85 vs Regular
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
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced E85 vs regular fuel economics for U.S. flex-fuel vehicle owners</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator estimates whether E85 actually saves money in your real driving context by combining price spread,
          MPG loss, and practical station-access overhead. It focuses on cost per mile and annual budget impact, not pump price alone.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is designed for the most common owner questions from forums: "How much cheaper must E85 be?", "Does detour/time kill savings?",
          and "Why did MPG drop but cost-per-mile still improve in some regions?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Cost-Per-Mile First</h3>
            </div>
            <p className="text-sm text-muted-foreground">Compares E85 and regular using dollar-per-mile, the metric that actually decides savings.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Break-Even Discount</h3>
            </div>
            <p className="text-sm text-muted-foreground">Calculates required E85 price threshold based on MPG loss and overhead assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Station Overhead Model</h3>
            </div>
            <p className="text-sm text-muted-foreground">Includes detour mileage and extra fueling time that many simple calculators ignore.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Scenario Stress Tests</h3>
            </div>
            <p className="text-sm text-muted-foreground">Tests narrow/wide discount environments and seasonal MPG-loss changes.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Break-Even Thresholds</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Forum-Informed Overhead Inputs</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                E85 vs Regular Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Net Annual Savings (E85 vs Regular)</p>
                <p className="text-2xl font-bold text-foreground">${result.netAnnualSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Net Savings</p>
                <p className="text-2xl font-bold text-foreground">${result.monthlyNetSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Regular Cost Per Mile</p>
                <p className="text-2xl font-bold text-foreground">${result.regularFuelCostPerMile.toFixed(3)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">E85 Cost Per Mile</p>
                <p className="text-2xl font-bold text-foreground">${result.e85FuelCostPerMile.toFixed(3)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Break-even E85 price threshold: <strong>${result.requiredE85PriceToBreakEven.toFixed(3)}/gal</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Required discount: <strong>{result.requiredDiscountPercent.toFixed(1)}%</strong> | Current discount: <strong>{result.effectiveE85DiscountPercent.toFixed(1)}%</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">{result.breakEvenMessage}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Savings vs Overhead Breakdown
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
                Scenario Planning (Highest Savings First)
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
                        <p className="font-semibold text-foreground">${scenario.netAnnualSavings.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">net/yr</p>
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
          How to Use This Free Online E85 vs Regular Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Set annual mileage and baseline MPG</h4>
              Start with realistic yearly miles and observed MPG on regular gas from recent tank-to-tank history.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Enter local regular and E85 prices</h4>
              Use current local station prices, not national averages, because regional spread drives most outcomes.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Add realistic E85 MPG-loss estimate</h4>
              Use measured or conservative loss assumptions and adjust for seasonal blend changes where relevant.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Include station detour and fill-time overhead</h4>
              Add detour miles and extra minutes per fill if E85 access is not on your normal route.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Add optional time value and maintenance delta</h4>
              Include opportunity cost and maintenance differences if you want full economics instead of fuel-only math.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Review popup results and scenario comparisons</h4>
              Focus on required discount threshold and scenario stability before changing your fueling strategy.
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
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Annual and Monthly Net Savings</h4>
                <p className="text-xs text-muted-foreground">Budget-level view of whether E85 helps or hurts after all modeled overhead.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Cost-Per-Mile Comparison</h4>
                <p className="text-xs text-muted-foreground">Direct economic comparison between regular and E85 on a per-mile basis.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Target className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Break-Even Price Threshold</h4>
                <p className="text-xs text-muted-foreground">Shows the E85 price required for break-even under your exact assumptions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Scenario Sensitivity</h4>
                <p className="text-xs text-muted-foreground">Ranked scenarios help assess if your strategy survives realistic market changes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Practical Decision Metric</h4>
              <p className="text-xs text-muted-foreground">Built around dollar-per-mile and net annual impact, not MPG headlines.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />Real-World Access Effects</h4>
              <p className="text-xs text-muted-foreground">Includes station-detour and fill-time penalties often mentioned by drivers.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Fuel className="h-4 w-4" />Seasonality Awareness</h4>
              <p className="text-xs text-muted-foreground">Supports blend and MPG-loss sensitivity testing for non-static fuel conditions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Risk-Aware Planning</h4>
              <p className="text-xs text-muted-foreground">Identifies largest decision driver so you can improve assumptions where it matters most.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Break-even E85 price and required discount percentage calculations.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Station-access detour and time-overhead modeling for practical usage patterns.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario stress tests for narrow/wide price spreads and seasonal MPG changes.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding E85 vs Regular Fuel Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />Why Lower Pump Price Can Still Cost More Per Mile</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              E85 is often cheaper per gallon, but MPG loss increases gallons consumed per mile. Net value depends on the balance between price discount and efficiency loss.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors That Change the Outcome</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Local price spread between E85 and regular fuel</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Real MPG loss for your exact vehicle and route profile</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Station availability and detour/time convenience penalty</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Seasonal blend variation and weather-related efficiency shifts</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced Comparison: Daily Driver vs Performance Use</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Daily drivers usually prioritize stable cost-per-mile and route convenience.</li>
              <li>- Performance setups may accept weaker fuel economy for octane and power benefits.</li>
              <li>- Your optimal fueling strategy can differ by trip type and station access pattern.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Break-Even Threshold and Timing Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If current discount is below required threshold, regular is usually more economical.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If discount is above threshold consistently, E85 may be a durable savings option.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Borderline cases should be managed with split strategy (E85 only on convenient fills).</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Recalculate monthly because regional price spread can move quickly.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />Budget Optimization Options</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Track pump prices at 2-3 stations and fuel where spread is strongest.</li>
              <li>- Use route-based fueling plans to reduce detour/time overhead.</li>
              <li>- Compare annual savings to maintenance and convenience tradeoffs before full adoption.</li>
              <li>- Keep a simple cost-per-mile log to detect assumption drift early.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Risk and Decision-Quality Considerations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Never use E85 in non-flex-fuel vehicles.</li>
              <li>- Seasonal blends can change observed MPG and shift break-even thresholds.</li>
              <li>- One-tank comparisons are noisy; use multiple tank cycles for decisions.</li>
              <li>- Scenario planning is stronger than single-number assumptions in volatile markets.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: E85 vs Regular Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">E85 MPG Loss</td>
                <td className="py-3 px-4">15% - 27%</td>
                <td className="py-3 px-4">vs regular</td>
                <td className="py-3 px-4 text-muted-foreground">Varies by vehicle, route, and seasonal blend</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Required Discount</td>
                <td className="py-3 px-4">15% - 25%+</td>
                <td className="py-3 px-4">price below regular</td>
                <td className="py-3 px-4 text-muted-foreground">Needs to exceed efficiency loss and overhead</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">E85 Ethanol Content</td>
                <td className="py-3 px-4">51% - 83%</td>
                <td className="py-3 px-4">ethanol fraction</td>
                <td className="py-3 px-4 text-muted-foreground">Changes by geography and season</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Range Drop Per Tank</td>
                <td className="py-3 px-4">10% - 30%</td>
                <td className="py-3 px-4">miles per tank</td>
                <td className="py-3 px-4 text-muted-foreground">More fill-ups can increase convenience penalty</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Public E85 Availability</td>
                <td className="py-3 px-4">4,000+ stations</td>
                <td className="py-3 px-4">U.S. public network</td>
                <td className="py-3 px-4 text-muted-foreground">Coverage varies heavily by region</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are directional planning values. Use local station prices and your own tank data as the primary decision basis.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official and Government Data</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.energy.gov/energysaver/articles/e85-fuel-right-you" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. DOE Energy Saver - E85 Overview</a> - FFV guidance and MPG context</li>
              <li>- <a href="https://www.epa.gov/renewable-fuel-standard/e85-fuel" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EPA E85 Fuel Page</a> - E85 definition and FFV compatibility</li>
              <li>- <a href="https://afdc.energy.gov/fuels/ethanol-e85" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AFDC E85 Fuel Data</a> - station network and blend range</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.energy.gov/eere/vehicles/maximizing-alternative-fuel-vehicle-efficiency" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE VTO Alternative Fuel Efficiency</a> - FFV efficiency and E85 tradeoff context</li>
              <li>- <a href="https://afdc.energy.gov/fuels/ethanol-blends" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AFDC Ethanol Blends</a> - approved use and blend information</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Market and Price Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Fuel Price Data</a> - gasoline and diesel market references</li>
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and fuel-spend trend context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Community and Driver Experience Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/f150/comments/13nj4cu/e85_worth_it_on_flexfuel_50/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit: E85 worth it on flex-fuel F-150?</a> - driver cost-per-mile discussions</li>
              <li>- <a href="https://www.f150forum.com/f2/e85-524352/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">F150Forum: E85 User MPG Experiences</a> - real-world MPG/price anecdotes</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is for planning and budgeting decisions. It is not mechanical, legal, or warranty advice. Follow manufacturer guidance and verify FFV compatibility before fueling.
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
        <CalculatorReview calculatorName="E85 vs Regular Calculator" />
      </div>
    </div>
  );
};

export default AdvancedE85VsRegularCalculator;
