'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronUp,
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
  Truck,
  Wallet,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode = 'basic' | 'commuter' | 'heavy-use' | 'towing' | 'fleet';

interface Inputs {
  calculationMode: CalculationMode;
  annualMiles: string;
  dieselPricePerGallon: string;
  gasPricePerGallon: string;
  dieselMpg: string;
  gasMpg: string;
  dieselMaintenancePerMile: string;
  gasMaintenancePerMile: string;
  dieselDepreciationPerMile: string;
  gasDepreciationPerMile: string;
  dieselInsurancePerMonth: string;
  gasInsurancePerMonth: string;
  dieselRepairReservePerMonth: string;
  gasRepairReservePerMonth: string;
  annualDieselExhaustFluidCost: string;
  upfrontDieselPremium: string;
  ownershipYears: string;
  includeResaleAdjustment: boolean;
  estimatedResaleRecoveryPercent: string;
}

interface PowertrainBreakdown {
  fuelAnnual: number;
  maintenanceAnnual: number;
  depreciationAnnual: number;
  insuranceAnnual: number;
  reserveAnnual: number;
  extraFluidAnnual: number;
}

interface Scenario {
  label: string;
  dieselAnnual: number;
  gasAnnual: number;
  annualDelta: number;
  notes: string;
}

interface Result {
  annualMiles: number;
  dieselAnnualCost: number;
  gasAnnualCost: number;
  dieselCostPerMile: number;
  gasCostPerMile: number;
  annualDelta: number;
  monthlyDelta: number;
  upfrontDieselPremiumNet: number;
  breakEvenMilesPerYear: number | null;
  breakEvenYears: number | null;
  largestCostSwing: string;
  dieselBreakdown: PowertrainBreakdown;
  gasBreakdown: PowertrainBreakdown;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedDieselVsGasCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'heavy-use',
    annualMiles: '18000',
    dieselPricePerGallon: '4.05',
    gasPricePerGallon: '3.55',
    dieselMpg: '31',
    gasMpg: '24',
    dieselMaintenancePerMile: '0.11',
    gasMaintenancePerMile: '0.09',
    dieselDepreciationPerMile: '0.18',
    gasDepreciationPerMile: '0.22',
    dieselInsurancePerMonth: '175',
    gasInsurancePerMonth: '165',
    dieselRepairReservePerMonth: '85',
    gasRepairReservePerMonth: '60',
    annualDieselExhaustFluidCost: '110',
    upfrontDieselPremium: '4200',
    ownershipYears: '6',
    includeResaleAdjustment: true,
    estimatedResaleRecoveryPercent: '42'
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

  const findLargestCostSwing = (diesel: PowertrainBreakdown, gas: PowertrainBreakdown): string => {
    const swings: Array<[string, number]> = [
      ['Fuel', Math.abs(diesel.fuelAnnual - gas.fuelAnnual)],
      ['Maintenance', Math.abs(diesel.maintenanceAnnual - gas.maintenanceAnnual)],
      ['Depreciation', Math.abs(diesel.depreciationAnnual - gas.depreciationAnnual)],
      ['Insurance', Math.abs(diesel.insuranceAnnual - gas.insuranceAnnual)],
      ['Repair Reserve', Math.abs(diesel.reserveAnnual - gas.reserveAnnual)],
      ['Diesel Fluid/Extras', Math.abs(diesel.extraFluidAnnual - gas.extraFluidAnnual)]
    ];

    return swings.sort((a, b) => b[1] - a[1])[0][0];
  };

  const buildRecommendations = (
    annualDelta: number,
    breakEvenMilesPerYear: number | null,
    breakEvenYears: number | null,
    largestCostSwing: string
  ): string[] => {
    const recommendations: string[] = [];

    if (annualDelta > 0) {
      recommendations.push('Diesel is currently cheaper on annual operating cost. Validate this advantage quarterly against fuel-price spreads and maintenance trends.');
    } else if (annualDelta < 0) {
      recommendations.push('Gas is currently cheaper on annual operating cost. Recheck MPG assumptions and annual-mile estimates before paying a diesel premium.');
    } else {
      recommendations.push('Annual operating costs are nearly equal. Upfront purchase premium and resale assumptions become the key decision variables.');
    }

    if (largestCostSwing === 'Fuel') {
      recommendations.push('Fuel is the largest swing category. Prioritize realistic MPG from real-world logs and route profile, not brochure values.');
    }
    if (largestCostSwing === 'Depreciation') {
      recommendations.push('Depreciation is driving the gap. Compare 3- to 6-year residual value data for your exact trim and mileage tier.');
    }
    if (largestCostSwing === 'Maintenance' || largestCostSwing === 'Repair Reserve') {
      recommendations.push('Service and repair assumptions are decisive. Use local shop labor rates and known model-specific maintenance patterns.');
    }

    if (breakEvenMilesPerYear && breakEvenMilesPerYear > 0) {
      recommendations.push(`Estimated diesel break-even usage is about ${Math.round(breakEvenMilesPerYear).toLocaleString()} miles/year under current assumptions.`);
    }

    if (breakEvenYears && breakEvenYears > 0) {
      recommendations.push(`At the current annual savings rate, net upfront diesel premium break-even is about ${breakEvenYears.toFixed(1)} years.`);
    }

    recommendations.push('Run scenario mode before purchase: test low-mile, high-mile, and fuel-spread stress cases to avoid one-assumption decisions.');

    return recommendations;
  };

  const buildWarnings = (annualMiles: number): string[] => {
    const warnings: string[] = [];

    const dieselMpg = parseNonNegative(inputs.dieselMpg);
    const gasMpg = parseNonNegative(inputs.gasMpg);

    if (dieselMpg > 0 && dieselMpg < 12) {
      warnings.push('Diesel MPG appears very low. Verify assumptions if this is not a towing or heavy-haul profile.');
    }

    if (gasMpg > 0 && gasMpg < 12) {
      warnings.push('Gas MPG appears very low. Confirm this is a realistic mixed-driving value.');
    }

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so cost-per-mile and break-even comparisons are not decision-grade.');
    }

    if (annualMiles > 45000) {
      warnings.push('Very high annual mileage entered. Consider adding downtime risk and replacement-cycle assumptions for heavy-use planning.');
    }

    warnings.push('This is a planning model. Actual outcomes vary by driving cycle, regional fuel prices, model-specific reliability, and resale market timing.');

    return warnings;
  };

  const buildNextSteps = (): string[] => [
    'Save this baseline and date-stamp all assumptions used in the calculation.',
    'Run three scenarios: conservative, expected, and high-use/towing case.',
    'Collect local quotes for insurance and service intervals for both powertrains.',
    'Compare 3-year and 5-year resale expectations by mileage bracket.',
    'Recalculate before purchase and every quarter after ownership starts.'
  ];

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const dieselPricePerGallon = parseNonNegative(inputs.dieselPricePerGallon);
    const gasPricePerGallon = parseNonNegative(inputs.gasPricePerGallon);
    const dieselMpg = Math.max(1, parseNonNegative(inputs.dieselMpg));
    const gasMpg = Math.max(1, parseNonNegative(inputs.gasMpg));
    const dieselMaintenancePerMile = parseNonNegative(inputs.dieselMaintenancePerMile);
    const gasMaintenancePerMile = parseNonNegative(inputs.gasMaintenancePerMile);
    const dieselDepreciationPerMile = parseNonNegative(inputs.dieselDepreciationPerMile);
    const gasDepreciationPerMile = parseNonNegative(inputs.gasDepreciationPerMile);
    const dieselInsurancePerMonth = parseNonNegative(inputs.dieselInsurancePerMonth);
    const gasInsurancePerMonth = parseNonNegative(inputs.gasInsurancePerMonth);
    const dieselRepairReservePerMonth = parseNonNegative(inputs.dieselRepairReservePerMonth);
    const gasRepairReservePerMonth = parseNonNegative(inputs.gasRepairReservePerMonth);
    const annualDieselExhaustFluidCost = parseNonNegative(inputs.annualDieselExhaustFluidCost);
    const upfrontDieselPremium = parseNonNegative(inputs.upfrontDieselPremium);
    const ownershipYears = Math.max(1, parseNonNegative(inputs.ownershipYears));
    const estimatedResaleRecoveryPercent = Math.min(100, parseNonNegative(inputs.estimatedResaleRecoveryPercent));

    const dieselFuelPerMile = dieselPricePerGallon / dieselMpg;
    const gasFuelPerMile = gasPricePerGallon / gasMpg;

    const dieselBreakdown: PowertrainBreakdown = {
      fuelAnnual: annualMiles * dieselFuelPerMile,
      maintenanceAnnual: annualMiles * dieselMaintenancePerMile,
      depreciationAnnual: annualMiles * dieselDepreciationPerMile,
      insuranceAnnual: dieselInsurancePerMonth * 12,
      reserveAnnual: dieselRepairReservePerMonth * 12,
      extraFluidAnnual: annualDieselExhaustFluidCost
    };

    const gasBreakdown: PowertrainBreakdown = {
      fuelAnnual: annualMiles * gasFuelPerMile,
      maintenanceAnnual: annualMiles * gasMaintenancePerMile,
      depreciationAnnual: annualMiles * gasDepreciationPerMile,
      insuranceAnnual: gasInsurancePerMonth * 12,
      reserveAnnual: gasRepairReservePerMonth * 12,
      extraFluidAnnual: 0
    };

    const dieselAnnualCost =
      dieselBreakdown.fuelAnnual +
      dieselBreakdown.maintenanceAnnual +
      dieselBreakdown.depreciationAnnual +
      dieselBreakdown.insuranceAnnual +
      dieselBreakdown.reserveAnnual +
      dieselBreakdown.extraFluidAnnual;

    const gasAnnualCost =
      gasBreakdown.fuelAnnual +
      gasBreakdown.maintenanceAnnual +
      gasBreakdown.depreciationAnnual +
      gasBreakdown.insuranceAnnual +
      gasBreakdown.reserveAnnual +
      gasBreakdown.extraFluidAnnual;

    const annualDelta = gasAnnualCost - dieselAnnualCost;
    const monthlyDelta = annualDelta / 12;

    const variableDieselPerMile = dieselFuelPerMile + dieselMaintenancePerMile + dieselDepreciationPerMile;
    const variableGasPerMile = gasFuelPerMile + gasMaintenancePerMile + gasDepreciationPerMile;
    const variableAdvantagePerMile = variableGasPerMile - variableDieselPerMile;

    const fixedDieselAnnual =
      dieselBreakdown.insuranceAnnual + dieselBreakdown.reserveAnnual + dieselBreakdown.extraFluidAnnual;
    const fixedGasAnnual = gasBreakdown.insuranceAnnual + gasBreakdown.reserveAnnual + gasBreakdown.extraFluidAnnual;

    const fixedPenaltyAnnual = fixedDieselAnnual - fixedGasAnnual;

    const breakEvenMilesPerYear =
      variableAdvantagePerMile > 0 ? Math.max(0, fixedPenaltyAnnual / variableAdvantagePerMile) : null;

    const resaleRecovery = inputs.includeResaleAdjustment
      ? upfrontDieselPremium * (estimatedResaleRecoveryPercent / 100)
      : 0;

    const upfrontDieselPremiumNet = Math.max(0, upfrontDieselPremium - resaleRecovery);

    const breakEvenYears = annualDelta > 0 ? upfrontDieselPremiumNet / annualDelta : null;

    const largestCostSwing = findLargestCostSwing(dieselBreakdown, gasBreakdown);

    const scenarioFuelSpread = {
      dieselPrice: dieselPricePerGallon * 1.1,
      gasPrice: gasPricePerGallon * 1.18
    };

    const dieselAnnualFuelSpread =
      annualMiles * (scenarioFuelSpread.dieselPrice / dieselMpg) +
      dieselBreakdown.maintenanceAnnual +
      dieselBreakdown.depreciationAnnual +
      dieselBreakdown.insuranceAnnual +
      dieselBreakdown.reserveAnnual +
      dieselBreakdown.extraFluidAnnual;

    const gasAnnualFuelSpread =
      annualMiles * (scenarioFuelSpread.gasPrice / gasMpg) +
      gasBreakdown.maintenanceAnnual +
      gasBreakdown.depreciationAnnual +
      gasBreakdown.insuranceAnnual +
      gasBreakdown.reserveAnnual;

    const dieselAnnualLowMiles = dieselAnnualCost * 0.82;
    const gasAnnualLowMiles = gasAnnualCost * 0.82;

    const dieselAnnualMpgGain =
      annualMiles * (dieselPricePerGallon / (dieselMpg * 1.12)) +
      dieselBreakdown.maintenanceAnnual +
      dieselBreakdown.depreciationAnnual +
      dieselBreakdown.insuranceAnnual +
      dieselBreakdown.reserveAnnual +
      dieselBreakdown.extraFluidAnnual;

    const gasAnnualMpgGain =
      annualMiles * (gasPricePerGallon / (gasMpg * 1.1)) +
      gasBreakdown.maintenanceAnnual +
      gasBreakdown.depreciationAnnual +
      gasBreakdown.insuranceAnnual +
      gasBreakdown.reserveAnnual;

    const dieselAnnualHighMaintenance = dieselAnnualCost + dieselBreakdown.maintenanceAnnual * 0.22;
    const gasAnnualHighMaintenance = gasAnnualCost + gasBreakdown.maintenanceAnnual * 0.12;

    const scenarios: Scenario[] = [
      {
        label: 'Wider Fuel Spread (Gas +18%, Diesel +10%)',
        dieselAnnual: dieselAnnualFuelSpread,
        gasAnnual: gasAnnualFuelSpread,
        annualDelta: gasAnnualFuelSpread - dieselAnnualFuelSpread,
        notes: 'Common stress case during regional fuel volatility.'
      },
      {
        label: 'Lower Annual Mileage (-18%)',
        dieselAnnual: dieselAnnualLowMiles,
        gasAnnual: gasAnnualLowMiles,
        annualDelta: gasAnnualLowMiles - dieselAnnualLowMiles,
        notes: 'Useful when commute pattern changes or remote-work adoption rises.'
      },
      {
        label: 'Efficiency Improvement Scenario',
        dieselAnnual: dieselAnnualMpgGain,
        gasAnnual: gasAnnualMpgGain,
        annualDelta: gasAnnualMpgGain - dieselAnnualMpgGain,
        notes: 'Assumes driving-pattern and maintenance optimization for both vehicles.'
      },
      {
        label: 'Higher Diesel Service Burden',
        dieselAnnual: dieselAnnualHighMaintenance,
        gasAnnual: gasAnnualHighMaintenance,
        annualDelta: gasAnnualHighMaintenance - dieselAnnualHighMaintenance,
        notes: 'Stress case for high-labor regions or model-specific maintenance risk.'
      }
    ].sort((a, b) => b.annualDelta - a.annualDelta);

    setResult({
      annualMiles,
      dieselAnnualCost,
      gasAnnualCost,
      dieselCostPerMile: annualMiles > 0 ? dieselAnnualCost / annualMiles : 0,
      gasCostPerMile: annualMiles > 0 ? gasAnnualCost / annualMiles : 0,
      annualDelta,
      monthlyDelta,
      upfrontDieselPremiumNet,
      breakEvenMilesPerYear,
      breakEvenYears,
      largestCostSwing,
      dieselBreakdown,
      gasBreakdown,
      scenarios,
      recommendations: buildRecommendations(annualDelta, breakEvenMilesPerYear, breakEvenYears, largestCostSwing),
      warningsAndConsiderations: buildWarnings(annualMiles),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'heavy-use',
      annualMiles: '18000',
      dieselPricePerGallon: '4.05',
      gasPricePerGallon: '3.55',
      dieselMpg: '31',
      gasMpg: '24',
      dieselMaintenancePerMile: '0.11',
      gasMaintenancePerMile: '0.09',
      dieselDepreciationPerMile: '0.18',
      gasDepreciationPerMile: '0.22',
      dieselInsurancePerMonth: '175',
      gasInsurancePerMonth: '165',
      dieselRepairReservePerMonth: '85',
      gasRepairReservePerMonth: '60',
      annualDieselExhaustFluidCost: '110',
      upfrontDieselPremium: '4200',
      ownershipYears: '6',
      includeResaleAdjustment: true,
      estimatedResaleRecoveryPercent: '42'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'When is diesel cheaper than gas overall?',
      answer:
        'Diesel tends to win when annual mileage is high, highway usage is significant, and real-world diesel MPG advantage is sustained over time. Low-mile users often struggle to recover upfront diesel premium.',
      category: 'Basics'
    },
    {
      question: 'Why is fuel price alone not enough to decide?',
      answer:
        'Fuel is only one part of ownership economics. Maintenance, depreciation, insurance, repair reserve, and purchase/resale assumptions can reverse the decision even when one fuel is cheaper per gallon.',
      category: 'Method'
    },
    {
      question: 'How do I estimate break-even mileage?',
      answer:
        'Break-even mileage compares per-mile variable advantage against annual fixed-cost penalty. If diesel has better per-mile economics but higher fixed burden, higher annual miles are needed to offset that penalty.',
      category: 'Break-even'
    },
    {
      question: 'Should I include diesel exhaust fluid (DEF) cost?',
      answer:
        'Yes. DEF and diesel-specific consumables should be modeled as annual costs for realistic comparison, especially for heavy-use profiles.',
      category: 'Inputs'
    },
    {
      question: 'How important is depreciation in diesel vs gas decisions?',
      answer:
        'Very important. Depreciation can be one of the largest ownership costs. Model-specific resale behavior often changes the outcome more than short-term fuel swings.',
      category: 'Depreciation'
    },
    {
      question: 'Is diesel always better for towing and hauling?',
      answer:
        'Diesel often provides torque and efficiency benefits in towing conditions, but total cost depends on service intervals, parts/labor rates, and acquisition premium.',
      category: 'Use case'
    },
    {
      question: 'How often should I re-run this analysis?',
      answer:
        'Quarterly is recommended, and immediately before purchase decisions. Re-run whenever fuel spreads, insurance rates, or expected mileage changes materially.',
      category: 'Workflow'
    },
    {
      question: 'Can I use this for fleet procurement screening?',
      answer:
        'Yes. It is useful for planning and scenario screening. For procurement, pair it with downtime assumptions, financing terms, and residual-value policy data.',
      category: 'Fleet'
    },
    {
      question: 'What inputs cause the largest errors?',
      answer:
        'Unrealistic annual mileage, optimistic MPG assumptions, and outdated maintenance/depreciation numbers are the most common error drivers.',
      category: 'Accuracy'
    },
    {
      question: 'What does a negative annual delta mean?',
      answer:
        'A negative annual delta means diesel is more expensive than gas in your current assumptions. Review mileage and cost structure before choosing diesel premium models.',
      category: 'Interpretation'
    }
  ];

  const comparisonEntries = result
    ? [
        { label: 'Fuel', diesel: result.dieselBreakdown.fuelAnnual, gas: result.gasBreakdown.fuelAnnual, icon: Fuel, color: 'bg-blue-500' },
        { label: 'Maintenance', diesel: result.dieselBreakdown.maintenanceAnnual, gas: result.gasBreakdown.maintenanceAnnual, icon: Wrench, color: 'bg-emerald-500' },
        { label: 'Depreciation', diesel: result.dieselBreakdown.depreciationAnnual, gas: result.gasBreakdown.depreciationAnnual, icon: TrendingDown, color: 'bg-rose-500' },
        { label: 'Insurance', diesel: result.dieselBreakdown.insuranceAnnual, gas: result.gasBreakdown.insuranceAnnual, icon: Shield, color: 'bg-cyan-500' },
        { label: 'Reserve & Extras', diesel: result.dieselBreakdown.reserveAnnual + result.dieselBreakdown.extraFluidAnnual, gas: result.gasBreakdown.reserveAnnual + result.gasBreakdown.extraFluidAnnual, icon: Wallet, color: 'bg-violet-500' }
      ]
    : [];

  const maxComparisonValue = Math.max(...(comparisonEntries.flatMap((entry) => [entry.diesel, entry.gas]) || [1]));

  return (
    <div className="w-full space-y-8">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Diesel vs Gas Calculator</h2>
            <p className="text-muted-foreground">Advanced ownership-cost comparison with break-even and scenario analysis</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes per-mile + fixed-cost comparison, diesel premium break-even, and stress scenarios'
                : 'Uses core mileage, MPG, and fuel-price assumptions for quick comparison'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Fast fuel + MPG comparison'}
                  {inputs.calculationMode === 'commuter' && 'Commuter - Daily-use decision support'}
                  {inputs.calculationMode === 'heavy-use' && 'Heavy Use - High mileage optimization'}
                  {inputs.calculationMode === 'towing' && 'Towing - High-load usage planning'}
                  {inputs.calculationMode === 'fleet' && 'Fleet - Multi-vehicle screening context'}
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
                          ['basic', 'Basic', 'Fast fuel + MPG comparison'],
                          ['commuter', 'Commuter', 'Daily-use decision support'],
                          ['heavy-use', 'Heavy Use', 'High mileage optimization'],
                          ['towing', 'Towing', 'High-load usage planning'],
                          ['fleet', 'Fleet', 'Multi-vehicle screening context']
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
            <label className="block text-sm font-medium text-foreground mb-2">Diesel Price ($/gallon)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.dieselPricePerGallon}
              onChange={(e) => handleInputChange('dieselPricePerGallon', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Gas Price ($/gallon)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.gasPricePerGallon}
              onChange={(e) => handleInputChange('gasPricePerGallon', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Diesel MPG</label>
            <input
              type="number"
              min="1"
              value={inputs.dieselMpg}
              onChange={(e) => handleInputChange('dieselMpg', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Gas MPG</label>
            <input
              type="number"
              min="1"
              value={inputs.gasMpg}
              onChange={(e) => handleInputChange('gasMpg', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ownership Years</label>
            <input
              type="number"
              min="1"
              value={inputs.ownershipYears}
              onChange={(e) => handleInputChange('ownershipYears', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Per-Mile Variable Cost Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diesel Maintenance ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.dieselMaintenancePerMile} onChange={(e) => handleInputChange('dieselMaintenancePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Maintenance ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.gasMaintenancePerMile} onChange={(e) => handleInputChange('gasMaintenancePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diesel Depreciation ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.dieselDepreciationPerMile} onChange={(e) => handleInputChange('dieselDepreciationPerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Depreciation ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.gasDepreciationPerMile} onChange={(e) => handleInputChange('gasDepreciationPerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Fixed and Ownership Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diesel Insurance ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.dieselInsurancePerMonth} onChange={(e) => handleInputChange('dieselInsurancePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Insurance ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.gasInsurancePerMonth} onChange={(e) => handleInputChange('gasInsurancePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diesel DEF/Extras ($/year)</label>
              <input type="number" min="0" step="0.01" value={inputs.annualDieselExhaustFluidCost} onChange={(e) => handleInputChange('annualDieselExhaustFluidCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Diesel Repair Reserve ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.dieselRepairReservePerMonth} onChange={(e) => handleInputChange('dieselRepairReservePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Repair Reserve ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.gasRepairReservePerMonth} onChange={(e) => handleInputChange('gasRepairReservePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Upfront Diesel Premium ($)</label>
              <input type="number" min="0" step="0.01" value={inputs.upfrontDieselPremium} onChange={(e) => handleInputChange('upfrontDieselPremium', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
                  checked={inputs.includeResaleAdjustment}
                  onChange={(e) => handleInputChange('includeResaleAdjustment', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Resale Recovery on Diesel Premium</strong>
                  <br />
                  Adjust net upfront premium by expected resale recovery percentage.
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Estimated Resale Recovery (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.estimatedResaleRecoveryPercent}
                  onChange={(e) => handleInputChange('estimatedResaleRecoveryPercent', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
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
            Compare Diesel vs Gas
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
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced powertrain economics for U.S. vehicle buyers, commuters, and fleet planners</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator compares diesel and gas ownership economics using full annual cost logic, not just fuel spend.
          It models fuel, maintenance, depreciation, insurance, repair reserve, diesel-specific extras, and net upfront premium recovery.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is designed around real buyer questions: "At what mileage does diesel make sense?", "How long to recover
          diesel premium?", and "Which assumptions most often flip the decision?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Break-Even Logic</h3>
            </div>
            <p className="text-sm text-muted-foreground">Calculates mileage and years needed to recover diesel premium under your assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Full Cost Breakdown</h3>
            </div>
            <p className="text-sm text-muted-foreground">Compares category-level annual costs so you can identify the true decision drivers.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Scenario Prioritization</h3>
            </div>
            <p className="text-sm text-muted-foreground">Stress-tests fuel spread, mileage change, and maintenance risk to avoid single-case decisions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Use-Case Modes</h3>
            </div>
            <p className="text-sm text-muted-foreground">Supports commuter, high-mile, towing, and fleet screening decision workflows.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Break-Even Analysis</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario Stress Testing</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Diesel vs Gas Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Diesel Annual Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.dieselAnnualCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Gas Annual Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.gasAnnualCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Annual Delta (Gas - Diesel)</p>
                <p className="text-2xl font-bold text-foreground">${result.annualDelta.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Net Diesel Premium</p>
                <p className="text-2xl font-bold text-foreground">${result.upfrontDieselPremiumNet.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest cost swing category: <strong>{result.largestCostSwing}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Diesel cost per mile: <strong>${result.dieselCostPerMile.toFixed(3)}</strong> | Gas cost per mile: <strong>${result.gasCostPerMile.toFixed(3)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">
                Break-even mileage: <strong>{result.breakEvenMilesPerYear ? `${Math.round(result.breakEvenMilesPerYear).toLocaleString()} mi/year` : 'Not reached with current assumptions'}</strong>
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Breakdown Comparison
              </h4>
              <div className="space-y-4">
                {comparisonEntries.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <div key={entry.label} className="p-3 rounded-lg border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Icon className="h-4 w-4" />
                          {entry.label}
                        </div>
                        <div className="text-xs text-muted-foreground">Diesel ${entry.diesel.toFixed(0)} | Gas ${entry.gas.toFixed(0)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className={cn('h-full', entry.color)} style={{ width: `${(entry.diesel / maxComparisonValue) * 100}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Diesel</p>
                        </div>
                        <div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className={cn('h-full', entry.color)} style={{ width: `${(entry.gas / maxComparisonValue) * 100}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Gas</p>
                        </div>
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
                Scenario Comparison (Highest Diesel Advantage First)
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
                        <p className="font-semibold text-foreground">${scenario.annualDelta.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">annual delta</p>
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
          How to Use This Free Online Diesel vs Gas Calculator
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
                1) Set realistic annual mileage and ownership horizon
              </h4>
              Use your expected yearly usage and ownership years first. Break-even logic is highly sensitive to these two assumptions.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                2) Enter fuel prices and real-world MPG
              </h4>
              Use local prices and observed MPG by driving profile. Avoid optimistic estimates from marketing specs.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                3) Add maintenance and depreciation per mile
              </h4>
              Include model-specific maintenance patterns and realistic depreciation rates to avoid fuel-only bias.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                4) Add fixed monthly costs and diesel-specific extras
              </h4>
              Capture insurance differences, repair reserve assumptions, and diesel fluid/extras for realistic annual totals.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                5) Include upfront premium and resale recovery assumptions
              </h4>
              This converts purchase-price differences into a decision-grade break-even horizon.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                6) Review popup output and run scenario stress tests
              </h4>
              Focus on cost-swing categories and scenario results before choosing a powertrain or fleet mix.
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
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Annual Cost Comparison</h4>
                <p className="text-xs text-muted-foreground">Side-by-side diesel and gas annual totals with net delta for quick decision framing.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gauge className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Cost-Per-Mile Metrics</h4>
                <p className="text-xs text-muted-foreground">Per-mile economics for both powertrains to support mileage-sensitive decisions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Break-Even and Scenario View</h4>
                <p className="text-xs text-muted-foreground">Break-even mileage/years plus ranked scenarios for robust decision quality.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400" />Recommendations and Next Steps</h4>
                <p className="text-xs text-muted-foreground">Actionable guidance tied to the largest cost-swing assumptions in your model.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Full-Economics Comparison</h4>
              <p className="text-xs text-muted-foreground">Combines fuel, service, depreciation, and fixed costs into one decision framework.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Truck className="h-4 w-4" />Use-Case Sensitivity</h4>
              <p className="text-xs text-muted-foreground">Works for commuter, high-mileage, towing, and fleet screening cases.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4" />Break-Even Clarity</h4>
              <p className="text-xs text-muted-foreground">Shows mileage and years needed to recover diesel premium under current assumptions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Risk-Aware Planning</h4>
              <p className="text-xs text-muted-foreground">Scenario modeling reduces decision risk from volatile fuel and service costs.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Powertrain-level category breakdown with direct diesel vs gas comparison.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Net upfront premium analysis with optional resale-recovery adjustment.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario stress tests for fuel spread, mileage shifts, and maintenance variation.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Diesel vs Gas Ownership Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Why Fuel-Only Comparisons Mislead Buyers
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Fuel price and MPG matter, but they are not the whole decision. Maintenance, depreciation, insurance,
              and purchase-price differences can outweigh fuel savings, especially at lower annual mileage.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Major Cost Drivers That Flip the Decision
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Higher annual miles increase the value of per-mile efficiency differences.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">High local diesel prices can erase MPG advantages quickly.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Depreciation assumptions often create larger impact than short-term fuel changes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Repair and maintenance differences become decisive over longer ownership periods.</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Advanced Comparison: Commuter vs Towing vs Fleet Use
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Commuter profiles with moderate mileage may favor gas when diesel premium is high.</li>
              <li>- Towing/high-load profiles can favor diesel if MPG gap is persistent and annual usage is high.</li>
              <li>- Fleet screening should include downtime and labor-rate risk in addition to direct cost-per-mile.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Break-Even Timing and Threshold Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If break-even mileage exceeds your realistic annual use, diesel premium is usually hard to justify financially.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If break-even years exceed your likely ownership window, prioritize lower upfront cost models.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">When annual delta is close to zero, resale and reliability assumptions become primary decision drivers.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use ranges, not single numbers, for decision confidence under volatile market conditions.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Financial Optimization and Assistance Angles
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Compare financing rates by powertrain, not just sticker price.</li>
              <li>- Evaluate insurance quotes by VIN class before purchase commitment.</li>
              <li>- Use employer mileage reimbursement structures for business-use scenarios.</li>
              <li>- Reassess replacement cycle strategy if depreciation dominates ownership cost.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk and Decision-Quality Considerations
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Fuel spread volatility can change annual outcome quickly.</li>
              <li>- Maintenance-event timing causes year-to-year variance versus model averages.</li>
              <li>- Residual-value assumptions should be verified with recent local market data.</li>
              <li>- Scenario outputs are planning ranges, not guaranteed forecasts.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Diesel vs Gas Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">Fuel Price Spread</td>
                <td className="py-3 px-4">$0.20 - $0.90</td>
                <td className="py-3 px-4">diesel minus gas</td>
                <td className="py-3 px-4 text-muted-foreground">Regional volatility can materially shift annual deltas</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">MPG Advantage</td>
                <td className="py-3 px-4">10% - 35%</td>
                <td className="py-3 px-4">diesel vs gas</td>
                <td className="py-3 px-4 text-muted-foreground">Real-world gap depends on load, speed, and route profile</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Upfront Premium</td>
                <td className="py-3 px-4">$2,000 - $8,000+</td>
                <td className="py-3 px-4">purchase cost</td>
                <td className="py-3 px-4 text-muted-foreground">Must be assessed against usage and recovery horizon</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Maintenance Burden</td>
                <td className="py-3 px-4">$0.08 - $0.16</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Model-specific maintenance profile drives long-term variance</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Break-Even Mileage</td>
                <td className="py-3 px-4">12,000 - 28,000+</td>
                <td className="py-3 px-4">miles/year</td>
                <td className="py-3 px-4 text-muted-foreground">Higher when fixed diesel premium and service burden are large</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          These are planning benchmarks only. Always validate assumptions with local pricing, actual driving profile, and model-specific service data.
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
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Gasoline and Diesel Data</a> - price trend context</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - vehicle efficiency references</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI Transportation Data</a> - cost trend context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Cost Studies</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Research</a> - ownership-cost methodology</li>
              <li>- <a href="https://afdc.energy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Alternative Fuels Data Center</a> - technology and operational context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Market and Financial Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and financing context</li>
              <li>- <a href="https://www.consumerfinance.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Consumer Resources</a> - financing and budgeting guidance</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Educational and Planning Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.transportation.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. Department of Transportation</a> - transportation planning context</li>
              <li>- <a href="https://www.nhtsa.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA</a> - safety and ownership-related guidance context</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is for planning and educational use. It is not tax, legal, or financial advice and should be paired with local quotes and model-specific service data before purchase decisions.
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
        <CalculatorReview calculatorName="Diesel vs Gas Calculator" />
      </div>
    </div>
  );
};

export default AdvancedDieselVsGasCalculator;
