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
  Wrench,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode =
  | 'basic'
  | 'commuter'
  | 'home-charging'
  | 'mixed-charging'
  | 'high-mileage';

interface Inputs {
  calculationMode: CalculationMode;
  annualMiles: string;
  gasPricePerGallon: string;
  gasVehicleMpg: string;
  homeElectricityRate: string;
  publicChargingRate: string;
  homeChargingPercent: string;
  evMilesPerKwh: string;
  annualGasMaintenance: string;
  annualEVMaintenance: string;
  annualGasInsurance: string;
  annualEVInsurance: string;
  gasVehiclePrice: string;
  evVehiclePrice: string;
  incentives: string;
  ownershipYears: string;
  includeChargingLoss: boolean;
  chargingLossPercent: string;
  includePublicSessionOverhead: boolean;
  publicSessionsPerMonth: string;
  overheadPerPublicSession: string;
  includeTimeCost: boolean;
  minutesPerPublicSession: string;
  valueOfTimePerHour: string;
  gridCo2LbsPerKwh: string;
}

interface Scenario {
  label: string;
  annualSavings: number;
  notes: string;
}

interface Result {
  annualMiles: number;
  annualGasFuelCost: number;
  annualEVChargingCost: number;
  annualFuelSavings: number;
  annualMaintenanceSavings: number;
  annualInsuranceDelta: number;
  annualPublicOverhead: number;
  annualTimeCost: number;
  netAnnualSavings: number;
  monthlySavings: number;
  ownershipSavings: number;
  netUpfrontPremium: number;
  breakEvenYears: number | null;
  breakEvenMiles: number | null;
  requiredEVRateBreakEven: number;
  gasCostPerMile: number;
  evEnergyCostPerMile: number;
  largestSavingsDriver: string;
  annualGasEmissionsLbs: number;
  annualEVEmissionsLbs: number;
  annualEmissionsReductionLbs: number;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedElectricVehicleSavingsCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'mixed-charging',
    annualMiles: '14000',
    gasPricePerGallon: '3.55',
    gasVehicleMpg: '28',
    homeElectricityRate: '0.16',
    publicChargingRate: '0.42',
    homeChargingPercent: '72',
    evMilesPerKwh: '3.4',
    annualGasMaintenance: '980',
    annualEVMaintenance: '520',
    annualGasInsurance: '1900',
    annualEVInsurance: '2100',
    gasVehiclePrice: '34000',
    evVehiclePrice: '47000',
    incentives: '7500',
    ownershipYears: '6',
    includeChargingLoss: true,
    chargingLossPercent: '12',
    includePublicSessionOverhead: true,
    publicSessionsPerMonth: '4',
    overheadPerPublicSession: '3',
    includeTimeCost: true,
    minutesPerPublicSession: '18',
    valueOfTimePerHour: '30',
    gridCo2LbsPerKwh: '0.82'
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
    netAnnualSavings: number,
    breakEvenYears: number | null,
    largestDriver: string,
    requiredEVRateBreakEven: number
  ): string[] => {
    const recommendations: string[] = [];

    if (netAnnualSavings > 0) {
      recommendations.push('EV is currently favorable on annual operating economics under your assumptions. Track utility and public charging rates monthly.');
    } else if (netAnnualSavings < 0) {
      recommendations.push('Operating economics currently favor gas. Recheck charging mix and public charging reliance before final purchase decisions.');
    } else {
      recommendations.push('Operating economics are near parity. Small shifts in gas price, charging mix, or insurance can flip the result.');
    }

    if (breakEvenYears && breakEvenYears > 0) {
      recommendations.push(`Estimated upfront premium recovery is about ${breakEvenYears.toFixed(1)} years at current assumptions.`);
    } else {
      recommendations.push('Upfront premium break-even is not reached with current assumptions. Consider lower EV purchase price, higher incentives, or lower charging cost mix.');
    }

    recommendations.push(`Your break-even blended EV charging rate is about $${requiredEVRateBreakEven.toFixed(3)}/kWh for operating parity.`);

    if (largestDriver === 'Fuel/Charging Cost Gap') {
      recommendations.push('Energy price spread is your largest driver. Prioritize home/off-peak charging and reduce public fast-charge dependency where possible.');
    }
    if (largestDriver === 'Insurance Delta') {
      recommendations.push('Insurance delta is significant. Compare carrier quotes by VIN and deductible strategy before purchase.');
    }
    if (largestDriver === 'Public/Time Overhead') {
      recommendations.push('Public charging overhead is material. Charging convenience strategy may matter as much as nominal energy rates.');
    }

    recommendations.push('Use scenario mode before purchase: run conservative, expected, and high-volatility energy price cases.');

    return recommendations;
  };

  const buildWarnings = (annualMiles: number, homeChargingPercent: number): string[] => {
    const warnings: string[] = [];

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so savings and break-even outputs are not decision-grade.');
    }

    if (homeChargingPercent < 30) {
      warnings.push('Home charging share is low. Heavy public fast charging can materially reduce expected EV savings.');
    }

    const evMilesPerKwh = parseNonNegative(inputs.evMilesPerKwh);
    if (evMilesPerKwh < 2) {
      warnings.push('EV efficiency appears low. Verify this value against real-world driving conditions and climate.');
    }

    const chargingLossPercent = parseNonNegative(inputs.chargingLossPercent);
    if (chargingLossPercent > 20) {
      warnings.push('Charging loss assumption is high. Confirm charger type and charging pattern assumptions.');
    }

    warnings.push('This tool is an estimate model for planning. Real outcomes vary by climate, driving behavior, charging access, insurance market, and vehicle trim.');
    warnings.push('For tax credit eligibility and compliance, verify current federal/state rules at purchase time.');

    return warnings;
  };

  const buildNextSteps = (): string[] => {
    return [
      'Capture local utility tariff and off-peak charging rates before final comparison.',
      'Model two charging mixes: expected routine usage and public-heavy backup case.',
      'Collect real insurance quotes for both EV and gas alternatives with matched coverage.',
      'Validate incentives and eligibility with current federal/state guidance before purchase.',
      'Recalculate quarterly after fuel, electricity, or insurance changes.'
    ];
  };

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const gasPricePerGallon = parseNonNegative(inputs.gasPricePerGallon);
    const gasVehicleMpg = Math.max(1, parseNonNegative(inputs.gasVehicleMpg));
    const homeElectricityRate = parseNonNegative(inputs.homeElectricityRate);
    const publicChargingRate = parseNonNegative(inputs.publicChargingRate);
    const homeChargingPercent = Math.min(100, parseNonNegative(inputs.homeChargingPercent));
    const evMilesPerKwh = Math.max(1, parseNonNegative(inputs.evMilesPerKwh));
    const annualGasMaintenance = parseNonNegative(inputs.annualGasMaintenance);
    const annualEVMaintenance = parseNonNegative(inputs.annualEVMaintenance);
    const annualGasInsurance = parseNonNegative(inputs.annualGasInsurance);
    const annualEVInsurance = parseNonNegative(inputs.annualEVInsurance);
    const gasVehiclePrice = parseNonNegative(inputs.gasVehiclePrice);
    const evVehiclePrice = parseNonNegative(inputs.evVehiclePrice);
    const incentives = parseNonNegative(inputs.incentives);
    const ownershipYears = Math.max(1, parseNonNegative(inputs.ownershipYears));
    const chargingLossPercent = Math.min(50, parseNonNegative(inputs.chargingLossPercent));
    const publicSessionsPerMonth = parseNonNegative(inputs.publicSessionsPerMonth);
    const overheadPerPublicSession = parseNonNegative(inputs.overheadPerPublicSession);
    const minutesPerPublicSession = parseNonNegative(inputs.minutesPerPublicSession);
    const valueOfTimePerHour = parseNonNegative(inputs.valueOfTimePerHour);
    const gridCo2LbsPerKwh = parseNonNegative(inputs.gridCo2LbsPerKwh);

    const homeShare = homeChargingPercent / 100;
    const publicShare = 1 - homeShare;

    const blendedElectricityRate = homeElectricityRate * homeShare + publicChargingRate * publicShare;

    const effectiveEvMilesPerKwh = inputs.includeChargingLoss
      ? evMilesPerKwh * (1 - chargingLossPercent / 100)
      : evMilesPerKwh;

    const gasCostPerMile = gasPricePerGallon / gasVehicleMpg;
    const evEnergyCostPerMile = blendedElectricityRate / Math.max(0.1, effectiveEvMilesPerKwh);

    const annualGasFuelCost = annualMiles * gasCostPerMile;
    const annualEVChargingCost = annualMiles * evEnergyCostPerMile;

    const annualFuelSavings = annualGasFuelCost - annualEVChargingCost;
    const annualMaintenanceSavings = annualGasMaintenance - annualEVMaintenance;
    const annualInsuranceDelta = annualGasInsurance - annualEVInsurance;

    const annualPublicOverhead = inputs.includePublicSessionOverhead
      ? publicSessionsPerMonth * 12 * overheadPerPublicSession
      : 0;

    const annualTimeCost = inputs.includeTimeCost
      ? (publicSessionsPerMonth * 12 * minutesPerPublicSession / 60) * valueOfTimePerHour
      : 0;

    const netAnnualSavings =
      annualFuelSavings +
      annualMaintenanceSavings +
      annualInsuranceDelta -
      annualPublicOverhead -
      annualTimeCost;

    const monthlySavings = netAnnualSavings / 12;

    const netUpfrontPremium = Math.max(0, evVehiclePrice - incentives - gasVehiclePrice);

    const breakEvenYears = netAnnualSavings > 0 ? netUpfrontPremium / netAnnualSavings : null;
    const breakEvenMiles = breakEvenYears ? breakEvenYears * annualMiles : null;

    const ownershipSavings = netAnnualSavings * ownershipYears - netUpfrontPremium;

    const requiredEVRateBreakEven = Math.max(
      0,
      (gasCostPerMile + (annualMaintenanceSavings + annualInsuranceDelta - annualPublicOverhead - annualTimeCost) / Math.max(1, annualMiles)) *
        Math.max(0.1, effectiveEvMilesPerKwh)
    );

    const annualGasEmissionsLbs = (annualMiles / gasVehicleMpg) * 19.6;
    const annualEVEmissionsLbs = (annualMiles / Math.max(0.1, effectiveEvMilesPerKwh)) * gridCo2LbsPerKwh;
    const annualEmissionsReductionLbs = annualGasEmissionsLbs - annualEVEmissionsLbs;

    const largestSavingsDriver = findLargestDriver([
      ['Fuel/Charging Cost Gap', annualFuelSavings],
      ['Maintenance Savings', annualMaintenanceSavings],
      ['Insurance Delta', annualInsuranceDelta],
      ['Public/Time Overhead', annualPublicOverhead + annualTimeCost]
    ]);

    const highGasSavings =
      annualMiles * ((gasPricePerGallon * 1.2) / gasVehicleMpg - evEnergyCostPerMile) +
      annualMaintenanceSavings +
      annualInsuranceDelta -
      annualPublicOverhead -
      annualTimeCost;

    const publicHeavyBlend = homeElectricityRate * 0.35 + publicChargingRate * 0.65;
    const publicHeavySavings =
      annualMiles * (gasCostPerMile - publicHeavyBlend / Math.max(0.1, effectiveEvMilesPerKwh)) +
      annualMaintenanceSavings +
      annualInsuranceDelta -
      annualPublicOverhead -
      annualTimeCost;

    const offPeakBlend = homeElectricityRate * 0.75 * homeShare + publicChargingRate * publicShare;
    const offPeakSavings =
      annualMiles * (gasCostPerMile - offPeakBlend / Math.max(0.1, effectiveEvMilesPerKwh)) +
      annualMaintenanceSavings +
      annualInsuranceDelta -
      annualPublicOverhead -
      annualTimeCost;

    const lowMileageSavings =
      annualMiles * 0.7 * (gasCostPerMile - evEnergyCostPerMile) +
      annualMaintenanceSavings * 0.8 +
      annualInsuranceDelta -
      annualPublicOverhead * 0.8 -
      annualTimeCost * 0.8;

    const scenarios: Scenario[] = [
      {
        label: 'Gas Price +20%',
        annualSavings: highGasSavings,
        notes: 'Stress case for fuel-price spikes that often improve EV operating economics.'
      },
      {
        label: 'Public Charging Heavy Mix',
        annualSavings: publicHeavySavings,
        notes: 'Models higher reliance on public charging, common for apartment or travel-heavy usage.'
      },
      {
        label: 'Off-Peak Home Charging Strategy',
        annualSavings: offPeakSavings,
        notes: 'Assumes home charging shifted toward lower tariff windows.'
      },
      {
        label: 'Lower Annual Mileage (-30%)',
        annualSavings: lowMileageSavings,
        notes: 'Tests lower-utilization case where fixed-cost differences can dominate.'
      }
    ].sort((a, b) => b.annualSavings - a.annualSavings);

    setResult({
      annualMiles,
      annualGasFuelCost,
      annualEVChargingCost,
      annualFuelSavings,
      annualMaintenanceSavings,
      annualInsuranceDelta,
      annualPublicOverhead,
      annualTimeCost,
      netAnnualSavings,
      monthlySavings,
      ownershipSavings,
      netUpfrontPremium,
      breakEvenYears,
      breakEvenMiles,
      requiredEVRateBreakEven,
      gasCostPerMile,
      evEnergyCostPerMile,
      largestSavingsDriver,
      annualGasEmissionsLbs,
      annualEVEmissionsLbs,
      annualEmissionsReductionLbs,
      scenarios,
      recommendations: buildRecommendations(
        netAnnualSavings,
        breakEvenYears,
        largestSavingsDriver,
        requiredEVRateBreakEven
      ),
      warningsAndConsiderations: buildWarnings(annualMiles, homeChargingPercent),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'mixed-charging',
      annualMiles: '14000',
      gasPricePerGallon: '3.55',
      gasVehicleMpg: '28',
      homeElectricityRate: '0.16',
      publicChargingRate: '0.42',
      homeChargingPercent: '72',
      evMilesPerKwh: '3.4',
      annualGasMaintenance: '980',
      annualEVMaintenance: '520',
      annualGasInsurance: '1900',
      annualEVInsurance: '2100',
      gasVehiclePrice: '34000',
      evVehiclePrice: '47000',
      incentives: '7500',
      ownershipYears: '6',
      includeChargingLoss: true,
      chargingLossPercent: '12',
      includePublicSessionOverhead: true,
      publicSessionsPerMonth: '4',
      overheadPerPublicSession: '3',
      includeTimeCost: true,
      minutesPerPublicSession: '18',
      valueOfTimePerHour: '30',
      gridCo2LbsPerKwh: '0.82'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How much can an EV save per year compared to gas?',
      answer:
        'Savings vary by mileage, local electricity and gas prices, charging mix, maintenance differences, and insurance. High-mileage drivers with strong home charging access usually see stronger operating savings.',
      category: 'Basics'
    },
    {
      question: 'Why does charging mix matter so much?',
      answer:
        'Home charging is often materially cheaper than public fast charging. A public-heavy charging profile can reduce or eliminate expected EV operating savings.',
      category: 'Charging'
    },
    {
      question: 'What is EV operating break-even rate?',
      answer:
        'It is the blended electricity rate at which EV operating cost equals gas operating cost under your current assumptions. Rates below that threshold generally favor EV operation.',
      category: 'Break-even'
    },
    {
      question: 'Should charging losses be included?',
      answer:
        'Yes. Real-world charging losses make delivered energy per mile higher than ideal battery-only assumptions, so including them improves planning accuracy.',
      category: 'Method'
    },
    {
      question: 'Do EVs always have lower maintenance costs?',
      answer:
        'Many EVs have lower routine maintenance categories, but actual differences vary by model, tire wear profile, and service pricing in your area.',
      category: 'Maintenance'
    },
    {
      question: 'How should I treat tax credits and incentives?',
      answer:
        'Use current eligible incentive amounts only, and verify qualification criteria at purchase time because rules can change and may include income/vehicle limits.',
      category: 'Incentives'
    },
    {
      question: 'Why can EV insurance sometimes be higher?',
      answer:
        'Insurance pricing can differ by repair cost assumptions, trim level, and carrier underwriting models. Always compare matched coverage quotes by VIN.',
      category: 'Insurance'
    },
    {
      question: 'How is emissions reduction estimated here?',
      answer:
        'The model compares estimated gas emissions from gallons consumed against grid-based electricity emissions from charging energy usage. It is a planning estimate, not compliance accounting.',
      category: 'Emissions'
    },
    {
      question: 'What if I drive fewer miles than expected?',
      answer:
        'Lower mileage generally reduces annual operating savings and can extend upfront premium recovery periods. Scenario mode helps test this sensitivity.',
      category: 'Sensitivity'
    },
    {
      question: 'How often should I update this model?',
      answer:
        'Quarterly is a practical cadence, and immediately after major fuel/electricity price shifts, insurance renewals, or charging pattern changes.',
      category: 'Workflow'
    }
  ];

  const breakdownEntries = result
    ? [
        {
          label: 'Fuel/Charging Gap',
          value: Math.abs(result.annualFuelSavings),
          icon: Fuel,
          color: 'bg-blue-500'
        },
        {
          label: 'Maintenance Savings',
          value: Math.abs(result.annualMaintenanceSavings),
          icon: Wrench,
          color: 'bg-emerald-500'
        },
        {
          label: 'Insurance Delta',
          value: Math.abs(result.annualInsuranceDelta),
          icon: Shield,
          color: 'bg-violet-500'
        },
        {
          label: 'Public/Time Overhead',
          value: Math.abs(result.annualPublicOverhead + result.annualTimeCost),
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
            <h2 className="text-2xl font-bold text-foreground">Electric Vehicle Savings Calculator</h2>
            <p className="text-muted-foreground">Advanced EV vs gas ownership-economics and break-even analysis</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes charging mix, overhead, insurance, incentives, break-even timeline, and emissions context'
                : 'Uses core mileage, fuel price, and charging-rate assumptions'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Quick EV vs gas operating view'}
                  {inputs.calculationMode === 'commuter' && 'Commuter - Routine household commute economics'}
                  {inputs.calculationMode === 'home-charging' && 'Home Charging - Max home-rate dependence'}
                  {inputs.calculationMode === 'mixed-charging' && 'Mixed Charging - Balanced home/public profile'}
                  {inputs.calculationMode === 'high-mileage' && 'High Mileage - Strong utilization scenario'}
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
                          ['basic', 'Basic', 'Quick EV vs gas operating view'],
                          ['commuter', 'Commuter', 'Routine household commute economics'],
                          ['home-charging', 'Home Charging', 'Max home-rate dependence'],
                          ['mixed-charging', 'Mixed Charging', 'Balanced home/public profile'],
                          ['high-mileage', 'High Mileage', 'Strong utilization scenario']
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
            <label className="block text-sm font-medium text-foreground mb-2">Gas Vehicle MPG</label>
            <input
              type="number"
              min="1"
              value={inputs.gasVehicleMpg}
              onChange={(e) => handleInputChange('gasVehicleMpg', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">EV Efficiency (mi/kWh)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={inputs.evMilesPerKwh}
              onChange={(e) => handleInputChange('evMilesPerKwh', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Home Charging Rate ($/kWh)</label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={inputs.homeElectricityRate}
              onChange={(e) => handleInputChange('homeElectricityRate', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Public Charging Rate ($/kWh)</label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={inputs.publicChargingRate}
              onChange={(e) => handleInputChange('publicChargingRate', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Charging Mix and Efficiency Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Home Charging Share (%)</label>
              <input type="number" min="0" max="100" value={inputs.homeChargingPercent} onChange={(e) => handleInputChange('homeChargingPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Charging Loss (%)</label>
              <input type="number" min="0" max="50" value={inputs.chargingLossPercent} onChange={(e) => handleInputChange('chargingLossPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <label className="flex items-start gap-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-background">
              <input
                type="checkbox"
                checked={inputs.includeChargingLoss}
                onChange={(e) => handleInputChange('includeChargingLoss', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Include Charging Losses</strong>
                <br />
                Adds real-world charging inefficiency to energy-use estimates.
              </span>
            </label>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Annual Cost and Purchase Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Maintenance ($/year)</label>
              <input type="number" min="0" step="0.01" value={inputs.annualGasMaintenance} onChange={(e) => handleInputChange('annualGasMaintenance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">EV Maintenance ($/year)</label>
              <input type="number" min="0" step="0.01" value={inputs.annualEVMaintenance} onChange={(e) => handleInputChange('annualEVMaintenance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Insurance ($/year)</label>
              <input type="number" min="0" step="0.01" value={inputs.annualGasInsurance} onChange={(e) => handleInputChange('annualGasInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">EV Insurance ($/year)</label>
              <input type="number" min="0" step="0.01" value={inputs.annualEVInsurance} onChange={(e) => handleInputChange('annualEVInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gas Vehicle Price ($)</label>
              <input type="number" min="0" step="0.01" value={inputs.gasVehiclePrice} onChange={(e) => handleInputChange('gasVehiclePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">EV Vehicle Price ($)</label>
              <input type="number" min="0" step="0.01" value={inputs.evVehiclePrice} onChange={(e) => handleInputChange('evVehiclePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Incentives ($)</label>
              <input type="number" min="0" step="0.01" value={inputs.incentives} onChange={(e) => handleInputChange('incentives', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ownership Years</label>
              <input type="number" min="1" value={inputs.ownershipYears} onChange={(e) => handleInputChange('ownershipYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Grid Emissions (lbs CO2/kWh)</label>
              <input type="number" min="0" step="0.01" value={inputs.gridCo2LbsPerKwh} onChange={(e) => handleInputChange('gridCo2LbsPerKwh', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Public Charging Overhead Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includePublicSessionOverhead}
                  onChange={(e) => handleInputChange('includePublicSessionOverhead', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Public Session Overhead</strong>
                  <br />
                  Add parking/session fees and related non-energy costs.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeTimeCost}
                  onChange={(e) => handleInputChange('includeTimeCost', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Time Cost</strong>
                  <br />
                  Quantify time burden from public charging sessions.
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Public Sessions / Month</label>
                <input type="number" min="0" step="1" value={inputs.publicSessionsPerMonth} onChange={(e) => handleInputChange('publicSessionsPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Overhead per Session ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.overheadPerPublicSession} onChange={(e) => handleInputChange('overheadPerPublicSession', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Minutes per Session</label>
                <input type="number" min="0" step="1" value={inputs.minutesPerPublicSession} onChange={(e) => handleInputChange('minutesPerPublicSession', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Value of Time ($/hour)</label>
                <input type="number" min="0" step="0.01" value={inputs.valueOfTimePerHour} onChange={(e) => handleInputChange('valueOfTimePerHour', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
            Calculate EV Savings
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
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced EV vs gas ownership planning for U.S. drivers and households</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator estimates EV savings using a full cost stack: energy costs, maintenance, insurance deltas,
          charging overhead, and upfront purchase premium after incentives.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is built to address common buyer questions: "How much does charging mix matter?", "When do savings offset higher upfront cost?",
          and "What happens if public charging reliance is higher than planned?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Operating Economics</h3>
            </div>
            <p className="text-sm text-muted-foreground">Calculates annual and monthly savings using real energy-cost and usage assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Break-Even Timeline</h3>
            </div>
            <p className="text-sm text-muted-foreground">Estimates years and miles required to recover upfront EV premium under current assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Charging Mix Sensitivity</h3>
            </div>
            <p className="text-sm text-muted-foreground">Models home/public charging split and public-session overhead impact.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Leaf className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Emissions Context</h3>
            </div>
            <p className="text-sm text-muted-foreground">Provides annual estimated tailpipe/grid emissions comparison for planning context.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Charging Mix + Overhead Model</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Break-Even + Scenario Planning</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                EV Savings Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Net Annual Savings</p>
                <p className="text-2xl font-bold text-foreground">${result.netAnnualSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold text-foreground">${result.monthlySavings.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Ownership-Period Net Savings</p>
                <p className="text-2xl font-bold text-foreground">${result.ownershipSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Net Upfront EV Premium</p>
                <p className="text-2xl font-bold text-foreground">${result.netUpfrontPremium.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest savings driver: <strong>{result.largestSavingsDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Gas cost per mile: <strong>${result.gasCostPerMile.toFixed(3)}</strong> | EV energy cost per mile: <strong>${result.evEnergyCostPerMile.toFixed(3)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Break-even timeline: <strong>{result.breakEvenYears ? `${result.breakEvenYears.toFixed(1)} years` : 'Not reached under current assumptions'}</strong></p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Savings Driver Breakdown
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
                        <p className="font-semibold text-foreground">${scenario.annualSavings.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">net/yr</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 mb-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Emissions Context
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded bg-background border">
                  <p className="text-muted-foreground">Annual Gas Emissions</p>
                  <p className="font-semibold text-foreground">{result.annualGasEmissionsLbs.toFixed(0)} lbs CO2</p>
                </div>
                <div className="p-3 rounded bg-background border">
                  <p className="text-muted-foreground">Annual EV Emissions</p>
                  <p className="font-semibold text-foreground">{result.annualEVEmissionsLbs.toFixed(0)} lbs CO2</p>
                </div>
                <div className="p-3 rounded bg-background border">
                  <p className="text-muted-foreground">Estimated Reduction</p>
                  <p className="font-semibold text-foreground">{result.annualEmissionsReductionLbs.toFixed(0)} lbs CO2</p>
                </div>
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
          How to Use This Free Online EV Savings Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Enter annual mileage and gas baseline</h4>
              Start with realistic annual miles and your current gas vehicle efficiency to anchor the comparison.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Add local gas and charging rates</h4>
              Use your local utility and charging-network prices because regional rate differences can dominate outcomes.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Set charging mix and loss assumptions</h4>
              Define home/public charging split and charging inefficiency for realistic EV energy-use calculations.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Include maintenance, insurance, and purchase economics</h4>
              Enter annual maintenance/insurance deltas and upfront price/incentive assumptions.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Add public charging overhead if relevant</h4>
              Include session fees and optional time value if your usage relies on public charging.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Review popup results and scenario robustness</h4>
              Focus on net annual savings, break-even timeline, and scenario durability before decision-making.
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
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Net Annual + Monthly Savings</h4>
                <p className="text-xs text-muted-foreground">Primary budget output for household planning and ownership forecasting.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Target className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Break-Even Timeline</h4>
                <p className="text-xs text-muted-foreground">Shows if and when upfront EV premium is recovered under current assumptions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Route className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-green-600 dark:text-green-400" />Charging Mix Impact</h4>
                <p className="text-xs text-muted-foreground">Highlights savings sensitivity to home/public charging ratio and overhead burden.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Leaf className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />Emissions Comparison</h4>
                <p className="text-xs text-muted-foreground">Estimated annual emissions reduction context for sustainability planning.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />All-In Economics</h4>
              <p className="text-xs text-muted-foreground">Combines energy, maintenance, insurance, and purchase assumptions in one framework.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Zap className="h-4 w-4" />Charging Reality Model</h4>
              <p className="text-xs text-muted-foreground">Accounts for charging losses and public charging dependency, not idealized-only charging.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4" />Scenario Robustness</h4>
              <p className="text-xs text-muted-foreground">Stress-tests assumptions to improve confidence before spending decisions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Decision Quality</h4>
              <p className="text-xs text-muted-foreground">Identifies the largest economic driver so you know which inputs to verify first.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Break-even timeline and ownership-period net savings modeling.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Public charging overhead and optional time-cost inclusion.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario stress tests for fuel-price, charging-mix, and utilization changes.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding EV Savings Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />Why Fuel-Only EV Comparisons Miss Important Costs</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Fuel/charging differences are central, but maintenance, insurance, charging overhead, and purchase-premium recovery can materially change total ownership outcomes.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Drivers That Shift EV Savings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Home vs public charging ratio and local utility rate structure</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Gas-price volatility and sustained annual mileage</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Insurance pricing differences by model and location</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Incentive eligibility and up-front purchase gap</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced Comparison: Home-Charging Household vs Public-Charging Heavy User</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Home-charging-heavy profiles often capture stronger and more stable savings.</li>
              <li>- Public-charging-heavy profiles can see reduced savings due to rate and overhead differences.</li>
              <li>- Split-strategy charging plans can materially improve outcomes in mixed-access situations.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Break-Even Thresholds and Decision Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If break-even timeline exceeds expected ownership period, EV premium recovery may be difficult on economics alone.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If annual net savings are strong and consistent, premium recovery can accelerate with higher utilization.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If insurance delta is adverse, quote optimization can materially improve payback.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use conservative assumptions before final purchase decisions involving long financing terms.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />Financial Optimization Options</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Shift charging to off-peak windows where tariff structure allows.</li>
              <li>- Compare insurance across carriers before and after VIN-specific underwriting checks.</li>
              <li>- Validate public charging subscriptions or memberships for effective rate reduction.</li>
              <li>- Reassess financing terms and incentive eligibility before purchase execution.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Risk and Planning Boundaries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Utility and charging-network prices can change quickly by region.</li>
              <li>- Winter efficiency and climate-control load can reduce miles/kWh.</li>
              <li>- Incentive availability and qualification rules can change over time.</li>
              <li>- Treat scenario outputs as planning ranges, not deterministic forecasts.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: EV Savings Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">Home Charging Rate</td>
                <td className="py-3 px-4">$0.10 - $0.25</td>
                <td className="py-3 px-4">per kWh</td>
                <td className="py-3 px-4 text-muted-foreground">Local tariff and time-of-use windows drive variation</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Public Fast Charging</td>
                <td className="py-3 px-4">$0.30 - $0.65</td>
                <td className="py-3 px-4">per kWh</td>
                <td className="py-3 px-4 text-muted-foreground">High reliance can materially reduce operating savings</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Charging Loss</td>
                <td className="py-3 px-4">8% - 16%</td>
                <td className="py-3 px-4">energy overhead</td>
                <td className="py-3 px-4 text-muted-foreground">Depends on charger type, battery temperature, and charge speed</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">EV Efficiency</td>
                <td className="py-3 px-4">2.5 - 4.2</td>
                <td className="py-3 px-4">mi/kWh</td>
                <td className="py-3 px-4 text-muted-foreground">Varies by vehicle, speed, climate, and route profile</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Upfront Premium</td>
                <td className="py-3 px-4">$2,000 - $15,000+</td>
                <td className="py-3 px-4">net after incentives</td>
                <td className="py-3 px-4 text-muted-foreground">Key variable in ownership-period economic outcome</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are contextual references only. Use local rates, actual driving behavior, and vehicle-specific data for final planning decisions.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Government and Official Data</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.fueleconomy.gov/feg/savemoney.jsp" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov Savings Tool Context</a> - federal vehicle energy-use and savings framework</li>
              <li>- <a href="https://afdc.energy.gov/calc/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AFDC Vehicle Cost Calculator</a> - alternative fuel planning reference</li>
              <li>- <a href="https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA Vehicle Emissions Factors</a> - gas emissions context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Industry Studies</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Research</a> - ownership and operating cost methodology</li>
              <li>- <a href="https://www.nrel.gov/transportation/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NREL Transportation Research</a> - EV performance and infrastructure research context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Market and Financial Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.eia.gov/electricity/monthly/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EIA Electricity Data</a> - utility rate context</li>
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EIA Gasoline Price Data</a> - fuel-price volatility context</li>
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and financing context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Community and Buyer Experience Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/electricvehicles/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/electricvehicles</a> - charging cost and ownership-experience discussions</li>
              <li>- <a href="https://www.reddit.com/r/TeslaLounge/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/TeslaLounge</a> - real-world charging and operating-cost anecdotes</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator supports planning and budgeting. It is not tax or legal advice. Verify incentive eligibility, utility rates, and insurance quotes before committing capital.
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
        <CalculatorReview calculatorName="Electric Vehicle Savings Calculator" />
      </div>
    </div>
  );
};

export default AdvancedElectricVehicleSavingsCalculator;
