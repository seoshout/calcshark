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
  Lightbulb,
  MapPin,
  RefreshCw,
  Shield,
  Target,
  Train,
  TrendingDown,
  Wallet,
  MessageSquare,
  Route,
  Building2,
  Info,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode =
  | 'basic'
  | 'comprehensive'
  | 'mode-comparison'
  | 'remote-work'
  | 'transit-switch';

interface CommuteInputs {
  calculationMode: CalculationMode;
  oneWayMiles: string;
  commuteDaysPerWeek: string;
  commuteWeeksPerYear: string;
  vehicleMpg: string;
  fuelPricePerGallon: string;
  parkingPerDay: string;
  tollsPerDay: string;
  maintenancePerMile: string;
  depreciationPerMile: string;
  insurancePerMonth: string;
  transitFarePerTrip: string;
  transitTripsPerDay: string;
  remoteDaysPerWeek: string;
  commuteMinutesOneWay: string;
  hourlyValueOfTime: string;
  includeTimeCost: boolean;
}

interface CommuteBreakdown {
  fuelCost: number;
  maintenanceCost: number;
  depreciationCost: number;
  parkingCost: number;
  tollCost: number;
  insuranceAllocationCost: number;
  timeCost: number;
}

interface CommuteScenario {
  label: string;
  annualCost: number;
  annualSavings: number;
  notes: string;
}

interface CommuteResult {
  annualMiles: number;
  annualTrips: number;
  annualHours: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  costPerMile: number;
  costPerTrip: number;
  breakdown: CommuteBreakdown;
  transitAnnualCost: number;
  transitAnnualSavings: number;
  remoteWorkAnnualSavings: number;
  largestCostDriver: string;
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
  scenarios: CommuteScenario[];
}

const AdvancedCommuteCostCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [result, setResult] = useState<CommuteResult | null>(null);

  const [inputs, setInputs] = useState<CommuteInputs>({
    calculationMode: 'comprehensive',
    oneWayMiles: '14',
    commuteDaysPerWeek: '5',
    commuteWeeksPerYear: '48',
    vehicleMpg: '28',
    fuelPricePerGallon: '3.75',
    parkingPerDay: '8',
    tollsPerDay: '4',
    maintenancePerMile: '0.12',
    depreciationPerMile: '0.22',
    insurancePerMonth: '150',
    transitFarePerTrip: '3.25',
    transitTripsPerDay: '2',
    remoteDaysPerWeek: '1',
    commuteMinutesOneWay: '35',
    hourlyValueOfTime: '30',
    includeTimeCost: true
  });

  const parseNonNegative = (value: string): number => {
    const n = parseFloat(value);
    if (Number.isNaN(n) || n < 0) return 0;
    return n;
  };

  const handleInputChange = (field: keyof CommuteInputs, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const getLargestDriver = (breakdown: CommuteBreakdown): string => {
    const entries: Array<[string, number]> = [
      ['Fuel', breakdown.fuelCost],
      ['Maintenance', breakdown.maintenanceCost],
      ['Depreciation', breakdown.depreciationCost],
      ['Parking', breakdown.parkingCost],
      ['Tolls', breakdown.tollCost],
      ['Insurance Allocation', breakdown.insuranceAllocationCost],
      ['Time Value', breakdown.timeCost]
    ];

    return [...entries].sort((a, b) => b[1] - a[1])[0][0];
  };

  const generateRecommendations = (annualCost: number, costPerMile: number, largestDriver: string): string[] => {
    const recs: string[] = [];

    if (largestDriver === 'Depreciation') {
      recs.push('Depreciation is your largest commuting cost category. Fewer office-days and shorter routes usually create the biggest reduction.');
    }
    if (largestDriver === 'Fuel') {
      recs.push('Fuel is your top driver. Improve MPG, reduce idle time, and optimize route timing to cut recurring expense.');
    }
    if (largestDriver === 'Time Value') {
      recs.push('Time-value dominates your total commute burden. Hybrid scheduling can outperform small fuel-price optimizations.');
    }
    if (costPerMile > 0.75) {
      recs.push('Cost per mile is elevated. Review parking/tolls and compare partial transit substitution before major vehicle decisions.');
    }
    if (annualCost > 12000) {
      recs.push('Annual commute spend is high. Build a 90-day reduction plan with one measurable action per major cost category.');
    }

    recs.push('Recalculate quarterly with real usage and current prices so budgeting decisions do not rely on stale assumptions.');

    return recs;
  };

  const generateWarnings = (): string[] => {
    const warnings: string[] = [];

    const mpg = parseNonNegative(inputs.vehicleMpg);
    if (mpg > 0 && mpg < 12) {
      warnings.push('Vehicle MPG appears very low. Verify this value to avoid overstating fuel cost.');
    }

    const weeks = parseNonNegative(inputs.commuteWeeksPerYear);
    if (weeks > 52) {
      warnings.push('Commute weeks above 52 are not realistic. Values are capped internally for annual modeling.');
    }

    const commuteDays = parseNonNegative(inputs.commuteDaysPerWeek);
    if (commuteDays > 7) {
      warnings.push('Commute days above 7 are not realistic and can distort scenario comparisons.');
    }

    warnings.push('This is a decision-support estimator. Actual costs vary with route conditions, seasonality, vehicle state, and local price changes.');

    return warnings;
  };

  const generateNextSteps = (): string[] => {
    return [
      'Save this baseline estimate with date and assumptions.',
      'Choose the top two cost drivers and define one action per driver.',
      'Re-run after 60-90 days with observed expenses.',
      'Track annual cost and cost-per-mile trends together.',
      'Use scenario outputs before changing commute mode or office schedule.'
    ];
  };

  const calculateCommuteCost = () => {
    const oneWayMiles = parseNonNegative(inputs.oneWayMiles);
    const commuteDaysPerWeek = Math.min(7, parseNonNegative(inputs.commuteDaysPerWeek));
    const commuteWeeksPerYear = Math.min(52, parseNonNegative(inputs.commuteWeeksPerYear));
    const vehicleMpg = Math.max(1, parseNonNegative(inputs.vehicleMpg));
    const fuelPricePerGallon = parseNonNegative(inputs.fuelPricePerGallon);
    const parkingPerDay = parseNonNegative(inputs.parkingPerDay);
    const tollsPerDay = parseNonNegative(inputs.tollsPerDay);
    const maintenancePerMile = parseNonNegative(inputs.maintenancePerMile);
    const depreciationPerMile = parseNonNegative(inputs.depreciationPerMile);
    const insurancePerMonth = parseNonNegative(inputs.insurancePerMonth);
    const transitFarePerTrip = parseNonNegative(inputs.transitFarePerTrip);
    const transitTripsPerDay = parseNonNegative(inputs.transitTripsPerDay);
    const remoteDaysPerWeek = Math.min(5, parseNonNegative(inputs.remoteDaysPerWeek));
    const commuteMinutesOneWay = parseNonNegative(inputs.commuteMinutesOneWay);
    const hourlyValueOfTime = parseNonNegative(inputs.hourlyValueOfTime);

    const effectiveCommuteDaysPerWeek = Math.max(0, commuteDaysPerWeek - remoteDaysPerWeek);
    const annualTrips = effectiveCommuteDaysPerWeek * commuteWeeksPerYear;
    const annualMiles = oneWayMiles * 2 * annualTrips;

    const fuelCost = (annualMiles / vehicleMpg) * fuelPricePerGallon;
    const maintenanceCost = annualMiles * maintenancePerMile;
    const depreciationCost = annualMiles * depreciationPerMile;
    const parkingCost = annualTrips * parkingPerDay;
    const tollCost = annualTrips * tollsPerDay;
    const insuranceAllocationCost = insurancePerMonth * 12 * 0.65;

    const annualHours = (commuteMinutesOneWay * 2 * annualTrips) / 60;
    const timeCost = inputs.includeTimeCost ? annualHours * hourlyValueOfTime : 0;

    const annualCost =
      fuelCost +
      maintenanceCost +
      depreciationCost +
      parkingCost +
      tollCost +
      insuranceAllocationCost +
      timeCost;

    const monthlyCost = annualCost / 12;
    const dailyCost = annualTrips > 0 ? annualCost / annualTrips : 0;
    const costPerMile = annualMiles > 0 ? annualCost / annualMiles : 0;
    const costPerTrip = annualTrips > 0 ? annualCost / annualTrips : 0;

    const transitAnnualCost = annualTrips * transitTripsPerDay * transitFarePerTrip;
    const transitAnnualSavings = Math.max(0, annualCost - transitAnnualCost);

    const baseAnnualTrips = commuteDaysPerWeek * commuteWeeksPerYear;
    const baseAnnualMiles = oneWayMiles * 2 * baseAnnualTrips;
    const baseFuel = (baseAnnualMiles / vehicleMpg) * fuelPricePerGallon;
    const baseMaint = baseAnnualMiles * maintenancePerMile;
    const baseDep = baseAnnualMiles * depreciationPerMile;
    const baseParking = baseAnnualTrips * parkingPerDay;
    const baseTolls = baseAnnualTrips * tollsPerDay;
    const baseTimeHours = (commuteMinutesOneWay * 2 * baseAnnualTrips) / 60;
    const baseTimeCost = inputs.includeTimeCost ? baseTimeHours * hourlyValueOfTime : 0;
    const noRemoteAnnualCost =
      baseFuel +
      baseMaint +
      baseDep +
      baseParking +
      baseTolls +
      insuranceAllocationCost +
      baseTimeCost;

    const remoteWorkAnnualSavings = Math.max(0, noRemoteAnnualCost - annualCost);

    const breakdown: CommuteBreakdown = {
      fuelCost,
      maintenanceCost,
      depreciationCost,
      parkingCost,
      tollCost,
      insuranceAllocationCost,
      timeCost
    };

    const largestCostDriver = getLargestDriver(breakdown);

    const scenarios: CommuteScenario[] = [
      {
        label: 'Add One Remote Day Per Week',
        annualCost: Math.max(0, annualCost - (annualCost / Math.max(1, effectiveCommuteDaysPerWeek)) * 0.9),
        annualSavings: Math.max(0, (annualCost / Math.max(1, effectiveCommuteDaysPerWeek)) * 0.9),
        notes: 'Usually high impact where parking, tolls, and commute-time burden are large.'
      },
      {
        label: 'Improve MPG by 20%',
        annualCost: annualCost - fuelCost + ((annualMiles / (vehicleMpg * 1.2)) * fuelPricePerGallon),
        annualSavings: fuelCost - ((annualMiles / (vehicleMpg * 1.2)) * fuelPricePerGallon),
        notes: 'Represents efficiency improvements from vehicle, route, and driving behavior.'
      },
      {
        label: 'Transit for 40% of Commute Days',
        annualCost: annualCost * 0.6 + transitAnnualCost * 0.4,
        annualSavings: Math.max(0, annualCost - (annualCost * 0.6 + transitAnnualCost * 0.4)),
        notes: 'Use when transit reliability and travel-time profile are acceptable.'
      },
      {
        label: 'Cut Parking + Tolls by 30%',
        annualCost: annualCost - (parkingCost + tollCost) * 0.3,
        annualSavings: (parkingCost + tollCost) * 0.3,
        notes: 'Combines route optimization, scheduling shifts, and subsidy opportunities.'
      }
    ].sort((a, b) => b.annualSavings - a.annualSavings);

    setResult({
      annualMiles,
      annualTrips,
      annualHours,
      dailyCost,
      monthlyCost,
      annualCost,
      costPerMile,
      costPerTrip,
      breakdown,
      transitAnnualCost,
      transitAnnualSavings,
      remoteWorkAnnualSavings,
      largestCostDriver,
      recommendations: generateRecommendations(annualCost, costPerMile, largestCostDriver),
      warningsAndConsiderations: generateWarnings(),
      nextSteps: generateNextSteps(),
      scenarios
    });

    setShowModal(true);
  };

  const resetCalculator = () => {
    setInputs({
      calculationMode: 'comprehensive',
      oneWayMiles: '14',
      commuteDaysPerWeek: '5',
      commuteWeeksPerYear: '48',
      vehicleMpg: '28',
      fuelPricePerGallon: '3.75',
      parkingPerDay: '8',
      tollsPerDay: '4',
      maintenancePerMile: '0.12',
      depreciationPerMile: '0.22',
      insurancePerMonth: '150',
      transitFarePerTrip: '3.25',
      transitTripsPerDay: '2',
      remoteDaysPerWeek: '1',
      commuteMinutesOneWay: '35',
      hourlyValueOfTime: '30',
      includeTimeCost: true
    });
    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'What costs are included besides gas?',
      answer: 'This tool models fuel, maintenance, depreciation, parking, tolls, insurance allocation, and optional commute-time value.',
      category: 'Method'
    },
    {
      question: 'Why is depreciation often the largest commuting cost?',
      answer: 'For frequent commuters, value-loss per mile can exceed fuel cost, especially with newer vehicles and high annual mileage.',
      category: 'Costs'
    },
    {
      question: 'How should I estimate maintenance and depreciation per mile?',
      answer: 'Use your service records and resale-value trend over time. Start with planning values, then recalibrate quarterly.',
      category: 'Inputs'
    },
    {
      question: 'Does remote work materially lower commuting cost?',
      answer: 'Yes. One fewer commute day per week often cuts variable costs significantly, especially parking/tolls and time burden.',
      category: 'Savings'
    },
    {
      question: 'Is transit always cheaper?',
      answer: 'Not always. It depends on fare structure, parking burden, distance, and travel-time tradeoffs. Compare using your local assumptions.',
      category: 'Comparison'
    },
    {
      question: 'Should I include time value in decision making?',
      answer: 'For strategic choices, yes. Time value often changes the ranking between driving and transit/hybrid options.',
      category: 'Decision'
    },
    {
      question: 'Can this calculator be used for tax filing?',
      answer: 'No. This tool is for planning. Use official IRS guidance and records for tax and reimbursement compliance.',
      category: 'Compliance'
    },
    {
      question: 'How often should I update assumptions?',
      answer: 'Quarterly updates are recommended because fuel prices, insurance costs, and schedule patterns frequently change.',
      category: 'Workflow'
    },
    {
      question: 'Why compare annual and per-mile metrics together?',
      answer: 'Annual cost helps budgeting while cost-per-mile helps compare route and mode efficiency across changing travel volumes.',
      category: 'Analysis'
    },
    {
      question: 'What if my commute varies by season?',
      answer: 'Run multiple scenarios (winter/summer or peak/off-peak) and compare annualized averages for better planning accuracy.',
      category: 'Scenarios'
    }
  ];

  const breakdownEntries = result
    ? [
        { label: 'Fuel', value: result.breakdown.fuelCost, icon: Car, color: 'bg-blue-500' },
        { label: 'Maintenance', value: result.breakdown.maintenanceCost, icon: Gauge, color: 'bg-emerald-500' },
        { label: 'Depreciation', value: result.breakdown.depreciationCost, icon: TrendingDown, color: 'bg-rose-500' },
        { label: 'Parking', value: result.breakdown.parkingCost, icon: MapPin, color: 'bg-violet-500' },
        { label: 'Tolls', value: result.breakdown.tollCost, icon: Target, color: 'bg-orange-500' },
        { label: 'Insurance Allocation', value: result.breakdown.insuranceAllocationCost, icon: Shield, color: 'bg-cyan-500' },
        { label: 'Time Value', value: result.breakdown.timeCost, icon: Clock3, color: 'bg-slate-500' }
      ]
    : [];

  const maxBreakdownValue = Math.max(...(breakdownEntries.map((entry) => entry.value) || [1]));

  return (
    <div className="w-full space-y-8">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Commute Cost Calculator</h2>
            <p className="text-muted-foreground">Advanced annual commuting cost estimator with drive vs transit and hybrid schedule analysis</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes full cost stack: fuel, maintenance, depreciation, fixed allocation, and optional time value'
                : 'Quick estimate using fuel, parking, tolls, and distance'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Fuel and daily fees'}
                  {inputs.calculationMode === 'comprehensive' && 'Comprehensive - Full commute economics'}
                  {inputs.calculationMode === 'mode-comparison' && 'Mode Comparison - Drive vs transit'}
                  {inputs.calculationMode === 'remote-work' && 'Remote Work - Hybrid schedule impact'}
                  {inputs.calculationMode === 'transit-switch' && 'Transit Switch - Scenario modeling'}
                </span>
                <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
              </button>

              {showModeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowModeDropdown(false)} />
                  <div className="absolute z-20 w-full mt-2 bg-background border border-indigo-300 dark:border-indigo-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-1">
                      {(
                        [
                          ['basic', 'Basic', 'Fuel and daily fees'],
                          ['comprehensive', 'Comprehensive', 'Full commute economics'],
                          ['mode-comparison', 'Mode Comparison', 'Drive vs transit'],
                          ['remote-work', 'Remote Work', 'Hybrid schedule impact'],
                          ['transit-switch', 'Transit Switch', 'Scenario modeling']
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
            <label className="block text-sm font-medium text-foreground mb-2">One-Way Distance (miles)</label>
            <input type="number" min="0" value={inputs.oneWayMiles} onChange={(e) => handleInputChange('oneWayMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Commute Days / Week</label>
            <input type="number" min="0" max="7" value={inputs.commuteDaysPerWeek} onChange={(e) => handleInputChange('commuteDaysPerWeek', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Commute Weeks / Year</label>
            <input type="number" min="0" max="52" value={inputs.commuteWeeksPerYear} onChange={(e) => handleInputChange('commuteWeeksPerYear', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Driving Cost Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle MPG</label>
              <input type="number" min="1" value={inputs.vehicleMpg} onChange={(e) => handleInputChange('vehicleMpg', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gallon)</label>
              <input type="number" min="0" step="0.01" value={inputs.fuelPricePerGallon} onChange={(e) => handleInputChange('fuelPricePerGallon', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parking ($/day)</label>
              <input type="number" min="0" step="0.01" value={inputs.parkingPerDay} onChange={(e) => handleInputChange('parkingPerDay', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tolls ($/day)</label>
              <input type="number" min="0" step="0.01" value={inputs.tollsPerDay} onChange={(e) => handleInputChange('tollsPerDay', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Maintenance ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.maintenancePerMile} onChange={(e) => handleInputChange('maintenancePerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Depreciation ($/mile)</label>
              <input type="number" min="0" step="0.01" value={inputs.depreciationPerMile} onChange={(e) => handleInputChange('depreciationPerMile', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Train className="h-5 w-5" />
            Transit and Schedule Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Transit Fare ($/trip)</label>
              <input type="number" min="0" step="0.01" value={inputs.transitFarePerTrip} onChange={(e) => handleInputChange('transitFarePerTrip', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Transit Trips / Day</label>
              <input type="number" min="0" value={inputs.transitTripsPerDay} onChange={(e) => handleInputChange('transitTripsPerDay', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Remote Days / Week</label>
              <input type="number" min="0" max="5" value={inputs.remoteDaysPerWeek} onChange={(e) => handleInputChange('remoteDaysPerWeek', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Insurance ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.insurancePerMonth} onChange={(e) => handleInputChange('insurancePerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Commute Minutes (one-way)</label>
              <input type="number" min="0" value={inputs.commuteMinutesOneWay} onChange={(e) => handleInputChange('commuteMinutesOneWay', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time Value ($/hour)</label>
              <input type="number" min="0" step="0.01" value={inputs.hourlyValueOfTime} onChange={(e) => handleInputChange('hourlyValueOfTime', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Advanced Controls
            </h3>
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
                Adds annual commute-time burden using your hourly value assumption.
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={calculateCommuteCost} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Commute Cost
          </button>
          <button onClick={resetCalculator} className="inline-flex items-center px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
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
            <p className="text-muted-foreground mt-1">Comprehensive commute planning for realistic annual cost decisions</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          Most commute calculators only estimate fuel. This advanced tool models the full economic burden of commuting:
          fuel, maintenance, depreciation, parking, tolls, insurance allocation, and optional time-value burden.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is designed to answer practical questions seen repeatedly in commuter forums: "Is transit actually cheaper?",
          "How much does one remote day save?", and "What cost category should I reduce first?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Full Cost Stack</h3>
            </div>
            <p className="text-sm text-muted-foreground">Covers direct, indirect, and time-cost factors that simple fuel-only tools miss.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Scenario Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground">Prioritizes annual savings scenarios so you can act on highest-impact changes first.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Drive vs Transit Context</h3>
            </div>
            <p className="text-sm text-muted-foreground">Compares driving economics with transit assumptions for practical mode-switch evaluation.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Clock3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Time-Value Layer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Optional time valuation highlights tradeoffs that pure cash models cannot capture.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Mode + Hybrid Analysis</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Forum-Informed Features</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Commute Cost Results and Detailed Calculations
              </h3>
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded-lg text-sm hover:bg-accent">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-4 border bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Annual Commute Cost</p><p className="text-2xl font-bold text-foreground">${result.annualCost.toFixed(2)}</p></div>
              <div className="p-4 border bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Monthly Commute Cost</p><p className="text-2xl font-bold text-foreground">${result.monthlyCost.toFixed(2)}</p></div>
              <div className="p-4 border bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Cost per Mile</p><p className="text-2xl font-bold text-foreground">${result.costPerMile.toFixed(2)}</p></div>
              <div className="p-4 border bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Annual Commute Hours</p><p className="text-2xl font-bold text-foreground">{result.annualHours.toFixed(0)} hrs</p></div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest cost driver: <strong>{result.largestCostDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Transit alternative annual savings potential: <strong>${result.transitAnnualSavings.toFixed(2)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Remote-work annual savings potential: <strong>${result.remoteWorkAnnualSavings.toFixed(2)}</strong></p>
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
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Icon className="h-4 w-4" />{entry.label}</div>
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
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><CheckCircle className="h-4 w-4" />Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.recommendations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span>-</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Warnings and Considerations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.warningsAndConsiderations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span>-</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-cyan-50 dark:bg-cyan-900/20 mb-6">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><TrendingDown className="h-4 w-4" />Scenario Planning (Highest Impact First)</h4>
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
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4" />Next Steps</h4>
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
          How to Use This Free Online Commute Cost Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-blue-600" />1) Add commute distance and frequency</h4>
              Use one-way miles, office days per week, and commute weeks per year so annual trip volume is realistic.
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><Car className="h-4 w-4 text-blue-600" />2) Enter vehicle cost assumptions</h4>
              Add MPG, fuel price, parking, tolls, maintenance, depreciation, and insurance allocation for full-cost modeling.
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><Train className="h-4 w-4 text-blue-600" />3) Add transit and schedule variables</h4>
              Enter transit fare/trips and remote-days per week for mode-switch and hybrid schedule planning.
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600" />4) Include time value if needed</h4>
              Set one-way commute minutes and hourly value to quantify opportunity cost alongside out-of-pocket spend.
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600" />5) Calculate and inspect popup results</h4>
              Review cost breakdown, largest cost driver, annual hours, and ranked savings scenarios.
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <h4 className="font-medium text-foreground mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600" />6) Execute top actions and recalculate</h4>
              Implement 1-2 high-impact changes and rerun quarterly to track measurable progress.
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Results Dashboard (Popup Only)
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <DollarSign className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Annual + Monthly Spend
                </h4>
                <p className="text-xs text-muted-foreground">See total recurring commute burden with budget-ready monthly view.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gauge className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Efficiency Metrics
                </h4>
                <p className="text-xs text-muted-foreground">Cost per mile and commute-hour burden to compare route and mode efficiency.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Driver and Scenario Insights
                </h4>
                <p className="text-xs text-muted-foreground">Largest cost driver + ranked savings scenarios for high-impact prioritization.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Actionable Recommendations
                </h4>
                <p className="text-xs text-muted-foreground">Specific next steps, warnings, and execution checklist based on your inputs.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-orange-700" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Full-Economics Modeling</h4>
              <p className="text-sm text-muted-foreground">Captures full commute economics, not just fuel-only estimates.</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Bus className="h-4 w-4" />Mode-Comparison Ready</h4>
              <p className="text-sm text-muted-foreground">Supports drive, transit, and hybrid schedule comparison with consistent assumptions.</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4" />Savings Prioritization</h4>
              <p className="text-sm text-muted-foreground">Uses scenario ranking so you can focus on highest annual dollar impact first.</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4" />Time-Burden Awareness</h4>
              <p className="text-sm text-muted-foreground">Includes optional time-value layer for better work-life tradeoff decisions.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Gauge className="h-5 w-5" />Advanced Features</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="p-2 rounded bg-white dark:bg-gray-800">Five calculation modes for different planning needs.</div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">Commute-time valuation toggle for strategic decision support.</div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">Transit substitution scenario modeling by annual savings impact.</div>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Info className="h-5 w-5" />Execution Tips</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="p-2 rounded bg-white dark:bg-gray-800">Validate annual miles from odometer deltas, not rough monthly guesses.</div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">Use current insurer premiums and recent maintenance costs for realism.</div>
              <div className="p-2 rounded bg-white dark:bg-gray-800">Re-run after route, schedule, or fare policy changes.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Commute Economics
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Why Fuel-Only Calculators Underestimate Cost</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Public forum questions repeatedly show this issue: fuel-only tools can miss major categories like depreciation,
              maintenance, and recurring parking/tolls. For many commuters, those costs materially exceed fuel.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Highest-Impact Reduction Levers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-background border">Reduce office commute frequency where role permits</div>
              <div className="p-3 rounded-lg bg-background border">Target parking/toll optimization before minor categories</div>
              <div className="p-3 rounded-lg bg-background border">Improve MPG via route, maintenance, and driving profile</div>
              <div className="p-3 rounded-lg bg-background border">Pilot partial transit substitution for high-cost days</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Clock3 className="h-5 w-5" />Time-Value Interpretation</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Time valuation is optional but useful for strategic choices. In metro commutes, annual hours can represent a
              meaningful burden even when direct cash outflow seems moderate.
            </p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" />Forum-Informed Design Decisions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Added depreciation and insurance allocation because users report fuel-only estimates are misleading.</li>
              <li>- Added remote-day modeling because hybrid work schedule questions are frequent.</li>
              <li>- Added drive vs transit comparison because "is transit really cheaper?" is a recurring request.</li>
              <li>- Added scenario ranking because users ask which single change provides best annual savings.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Remote Work and Schedule Optimization</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Small schedule changes can produce large annual savings. One fewer commute day per week cuts variable costs and often reduces stress/time burden.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-background border">Remote-day savings scale with distance and parking/toll exposure.</div>
              <div className="p-3 rounded-lg bg-background border">Compressed schedules can reduce total trip count without changing role scope.</div>
              <div className="p-3 rounded-lg bg-background border">Off-peak commute windows may lower tolls/parking and improve travel time consistency.</div>
              <div className="p-3 rounded-lg bg-background border">Hybrid planning should be reviewed quarterly as fuel and policy assumptions shift.</div>
            </div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><Shield className="h-5 w-5" />Risk, Uncertainty, and Planning Boundaries</h3>
            <p className="text-sm text-pink-800 dark:text-pink-200 mb-3">
              Commute costs are volatile. Fuel, insurance, maintenance events, and route changes can materially alter annual totals.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Use scenarios as planning ranges, not exact forecasts.</li>
              <li>- Keep assumptions date-stamped to avoid stale budget decisions.</li>
              <li>- Validate maintenance and depreciation estimates against real annual totals.</li>
              <li>- Reassess mode economics whenever parking, toll, or fare structures change.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Commute Cost Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Maintenance</td>
                <td className="py-3 px-4">$0.08 - $0.20</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Varies by vehicle age, tire profile, and service schedule</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Depreciation</td>
                <td className="py-3 px-4">$0.15 - $0.35</td>
                <td className="py-3 px-4">per mile</td>
                <td className="py-3 px-4 text-muted-foreground">Often larger than fuel for high-mileage commuters</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Parking</td>
                <td className="py-3 px-4">$0 - $25</td>
                <td className="py-3 px-4">per commute day</td>
                <td className="py-3 px-4 text-muted-foreground">Urban cores usually drive the high end</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Tolls</td>
                <td className="py-3 px-4">$0 - $15</td>
                <td className="py-3 px-4">per commute day</td>
                <td className="py-3 px-4 text-muted-foreground">Peak-hour routing can materially increase costs</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Transit Fare</td>
                <td className="py-3 px-4">$2 - $8</td>
                <td className="py-3 px-4">per trip</td>
                <td className="py-3 px-4 text-muted-foreground">Check pass discounts and employer subsidy eligibility</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are planning references only. Local prices, vehicle type, and commute profile can differ materially.
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
              Government and Official Data
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.bts.gov/archive/publications/transportation_statistics_annual_report/2007/html/chapter_01/entire" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Bureau of Transportation Statistics</a> - commute and transportation context</li>
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Fuel Price Data</a> - gasoline pricing references</li>
              <li>- <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Standard Mileage Rates</a> - per-mile planning benchmark</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Research and Industry Cost Studies
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Research</a> - ownership and operating cost structure</li>
              <li>- <a href="https://www.transit.dot.gov/funding/grants/urbanized-area-formula-grants" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FTA Transit Funding Resources</a> - transit ecosystem context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Market and Financial Context
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and cost trend context for transport spending</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI</a> - consumer transportation price trends</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Educational and Commuter Planning Resources
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.transportation.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. Department of Transportation</a> - mobility policy and commuter guidance context</li>
              <li>- <a href="https://www.apta.com/research-technical-resources/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">American Public Transportation Association</a> - public transport planning references</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is intended for budgeting and commute-planning decisions. It is not tax, payroll, or reimbursement compliance advice.
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
        <CalculatorReview calculatorName="Commute Cost Calculator" />
      </div>
    </div>
  );
};

export default AdvancedCommuteCostCalculator;
