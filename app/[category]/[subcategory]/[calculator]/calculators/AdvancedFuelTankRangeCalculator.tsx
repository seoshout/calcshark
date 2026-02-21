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
  | 'road-trip'
  | 'commuter'
  | 'towing-load'
  | 'fleet-lite';

type TerrainType = 'flat' | 'rolling' | 'hilly' | 'mountain';
type WeatherType = 'mild' | 'hot-ac' | 'cold-winter';

interface Inputs {
  calculationMode: CalculationMode;
  tankCapacityGallons: string;
  currentFuelPercent: string;
  reserveFuelPercent: string;

  includeDrivingMix: boolean;
  cityMpg: string;
  highwayMpg: string;
  combinedMpg: string;
  cityDrivingPercent: string;

  terrainType: TerrainType;
  weatherType: WeatherType;
  payloadPenaltyPercent: string;
  tirePressurePenaltyPercent: string;

  includeIdlePenalty: boolean;
  expectedIdleHours: string;
  idleBurnRateGph: string;

  includeSafetyBuffer: boolean;
  safetyBufferMiles: string;

  fuelPricePerGallon: string;
  annualMiles: string;

  annualFuelPriceGrowthPercent: string;
  annualMilesGrowthPercent: string;
  planningYears: string;
}

interface Scenario {
  label: string;
  estimatedRangeMiles: number;
  annualFuelCost: number;
  notes: string;
}

interface ProjectionRow {
  year: number;
  annualMiles: number;
  fuelPrice: number;
  annualFuelCost: number;
  estimatedRangeMiles: number;
}

interface Result {
  effectiveMpg: number;
  usableGallons: number;
  idleFuelGallons: number;
  estimatedRangeMiles: number;
  conservativeRangeMiles: number;
  rangeAtQuarterTankMiles: number;
  milesToRefuelNow: number;

  costPerMile: number;
  costPerFullTank: number;
  annualFuelCost: number;
  fillUpsPerYear: number;

  annualFuelConsumedGallons: number;
  annualEmissionsLbs: number;
  projectedTotalFuelCost: number;
  projectionRows: ProjectionRow[];

  breakEvenMpgFor10PercentMoreRange: number;
  largestRangeDriver: string;
  scenarios: Scenario[];

  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const terrainMultipliers: Record<TerrainType, number> = {
  flat: 1,
  rolling: 0.95,
  hilly: 0.9,
  mountain: 0.82
};

const weatherMultipliers: Record<WeatherType, number> = {
  mild: 1,
  'hot-ac': 0.94,
  'cold-winter': 0.87
};

const AdvancedFuelTankRangeCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'road-trip',
    tankCapacityGallons: '16.5',
    currentFuelPercent: '70',
    reserveFuelPercent: '12',

    includeDrivingMix: true,
    cityMpg: '24',
    highwayMpg: '33',
    combinedMpg: '28',
    cityDrivingPercent: '45',

    terrainType: 'rolling',
    weatherType: 'mild',
    payloadPenaltyPercent: '4',
    tirePressurePenaltyPercent: '2',

    includeIdlePenalty: true,
    expectedIdleHours: '2.5',
    idleBurnRateGph: '0.28',

    includeSafetyBuffer: true,
    safetyBufferMiles: '25',

    fuelPricePerGallon: '3.65',
    annualMiles: '15000',

    annualFuelPriceGrowthPercent: '3',
    annualMilesGrowthPercent: '1',
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
    conservativeRangeMiles: number,
    milesToRefuelNow: number,
    breakEvenMpgFor10PercentMoreRange: number,
    largestRangeDriver: string
  ) => {
    const recommendations: string[] = [];

    if (conservativeRangeMiles < 180) {
      recommendations.push('Conservative range is relatively short. Consider earlier refueling triggers and tighter route planning.');
    } else if (conservativeRangeMiles > 350) {
      recommendations.push('Conservative range is strong under current assumptions. Continue using reserve and buffer discipline for reliability.');
    } else {
      recommendations.push('Conservative range is mid-band. Maintain buffer and monitor fuel efficiency variance by route and season.');
    }

    if (milesToRefuelNow < 60) {
      recommendations.push('Current tank status suggests near-term refuel planning to avoid reserve-zone driving.');
    }

    recommendations.push(`To gain about 10% more range at current tank use, effective MPG target is ~${breakEvenMpgFor10PercentMoreRange.toFixed(1)} MPG.`);

    if (largestRangeDriver === 'Weather Penalty') {
      recommendations.push('Weather conditions are the largest range driver. Use seasonal assumptions and winter/summer scenario planning.');
    }
    if (largestRangeDriver === 'Terrain Penalty') {
      recommendations.push('Terrain has major range impact. Add route elevation context before long-trip planning.');
    }
    if (largestRangeDriver === 'Load/Payload Penalty') {
      recommendations.push('Payload and rolling resistance are limiting range. Reduce load and optimize tire pressure where practical.');
    }

    recommendations.push('Recalculate before long trips and after major fuel-price or route-profile changes.');

    return recommendations;
  };

  const buildWarnings = (effectiveMpg: number, usableGallons: number, annualMiles: number) => {
    const warnings: string[] = [];

    if (effectiveMpg < 12) {
      warnings.push('Effective MPG is very low. Verify efficiency assumptions for terrain, weather, and payload.');
    }

    if (usableGallons <= 0) {
      warnings.push('Usable fuel is zero or negative due to reserve settings. Increase current fuel or lower reserve percentage.');
    }

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so annual fuel cost and fill-up estimates are not meaningful.');
    }

    if (parseNonNegative(inputs.reserveFuelPercent) > 25) {
      warnings.push('Reserve percentage is high and can materially reduce available range estimates.');
    }

    warnings.push('This tool is a planning estimate. Real range varies with speed, traffic, weather, elevation, and vehicle condition.');

    return warnings;
  };

  const buildNextSteps = () => {
    return [
      'Track observed full-tank range over 2-4 fill cycles to calibrate effective MPG assumptions.',
      'Set a practical refuel trigger mileage based on conservative range output and your route risk tolerance.',
      'Update seasonal assumptions (weather, idle usage, terrain) before long-distance trips.',
      'Use fuel-price updates monthly for annual budget and route cost planning.',
      'Re-run scenarios after major maintenance, tire changes, or payload pattern shifts.'
    ];
  };

  const calculate = () => {
    const tankCapacityGallons = parseNonNegative(inputs.tankCapacityGallons);
    const currentFuelPercent = Math.min(100, parseNonNegative(inputs.currentFuelPercent));
    const reserveFuelPercent = Math.min(90, parseNonNegative(inputs.reserveFuelPercent));

    const cityMpg = Math.max(1, parseNonNegative(inputs.cityMpg));
    const highwayMpg = Math.max(1, parseNonNegative(inputs.highwayMpg));
    const combinedMpg = Math.max(1, parseNonNegative(inputs.combinedMpg));
    const cityDrivingPercent = Math.min(100, parseNonNegative(inputs.cityDrivingPercent));

    const payloadPenaltyPercent = parseNonNegative(inputs.payloadPenaltyPercent);
    const tirePressurePenaltyPercent = parseNonNegative(inputs.tirePressurePenaltyPercent);

    const expectedIdleHours = parseNonNegative(inputs.expectedIdleHours);
    const idleBurnRateGph = parseNonNegative(inputs.idleBurnRateGph);

    const safetyBufferMiles = parseNonNegative(inputs.safetyBufferMiles);
    const fuelPricePerGallon = parseNonNegative(inputs.fuelPricePerGallon);
    const annualMiles = parseNonNegative(inputs.annualMiles);

    const annualFuelPriceGrowthPercent = parseNonNegative(inputs.annualFuelPriceGrowthPercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parseNonNegative(inputs.planningYears));

    const cityShare = cityDrivingPercent / 100;
    const highwayShare = 1 - cityShare;

    const weightedMpg = inputs.includeDrivingMix
      ? 1 / (cityShare / cityMpg + highwayShare / highwayMpg)
      : combinedMpg;

    const terrainMultiplier = terrainMultipliers[inputs.terrainType];
    const weatherMultiplier = weatherMultipliers[inputs.weatherType];
    const payloadMultiplier = 1 - payloadPenaltyPercent / 100;
    const tireMultiplier = 1 - tirePressurePenaltyPercent / 100;

    const effectiveMpg = Math.max(
      1,
      weightedMpg * terrainMultiplier * weatherMultiplier * payloadMultiplier * tireMultiplier
    );

    const totalFuelGallonsNow = tankCapacityGallons * (currentFuelPercent / 100);
    const reserveGallons = tankCapacityGallons * (reserveFuelPercent / 100);
    const usableGallons = Math.max(0, totalFuelGallonsNow - reserveGallons);

    const idleFuelGallons = inputs.includeIdlePenalty
      ? expectedIdleHours * idleBurnRateGph
      : 0;

    const estimatedRangeMiles = Math.max(0, (usableGallons - idleFuelGallons) * effectiveMpg);
    const conservativeRangeMiles = Math.max(
      0,
      estimatedRangeMiles - (inputs.includeSafetyBuffer ? safetyBufferMiles : 0)
    );

    const rangeAtQuarterTankMiles = Math.max(
      0,
      (tankCapacityGallons * 0.25 - reserveGallons) * effectiveMpg
    );

    const milesToRefuelNow = conservativeRangeMiles;

    const annualFuelConsumedGallons = annualMiles / effectiveMpg;
    const annualFuelCost = annualFuelConsumedGallons * fuelPricePerGallon;
    const fillUpsPerYear = tankCapacityGallons > 0
      ? annualFuelConsumedGallons / tankCapacityGallons
      : 0;

    const costPerMile = effectiveMpg > 0 ? fuelPricePerGallon / effectiveMpg : 0;
    const costPerFullTank = tankCapacityGallons * fuelPricePerGallon;

    const annualEmissionsLbs = annualFuelConsumedGallons * 19.6;

    const breakEvenMpgFor10PercentMoreRange = effectiveMpg * 1.1;

    const largestRangeDriver = findLargestDriver([
      ['Weather Penalty', 1 - weatherMultiplier],
      ['Terrain Penalty', 1 - terrainMultiplier],
      ['Load/Payload Penalty', 1 - payloadMultiplier],
      ['Tire Pressure Penalty', 1 - tireMultiplier]
    ]);

    const highwayRange = Math.max(0, (usableGallons - idleFuelGallons) * (highwayMpg * terrainMultiplier * weatherMultiplier));
    const cityRange = Math.max(0, (usableGallons - idleFuelGallons) * (cityMpg * terrainMultiplier * weatherMultiplier));
    const winterRange = Math.max(0, (usableGallons - idleFuelGallons) * (weightedMpg * terrainMultiplier * weatherMultipliers['cold-winter'] * payloadMultiplier * tireMultiplier));
    const heavyLoadRange = Math.max(0, (usableGallons - idleFuelGallons) * (weightedMpg * terrainMultiplier * weatherMultiplier * (1 - (payloadPenaltyPercent + 8) / 100) * tireMultiplier));

    const scenarios: Scenario[] = [
      {
        label: 'Highway-Heavy Usage',
        estimatedRangeMiles: highwayRange,
        annualFuelCost: (annualMiles / Math.max(1, highwayMpg)) * fuelPricePerGallon,
        notes: 'Longer freeway segments often improve realized range.'
      },
      {
        label: 'City-Heavy Usage',
        estimatedRangeMiles: cityRange,
        annualFuelCost: (annualMiles / Math.max(1, cityMpg)) * fuelPricePerGallon,
        notes: 'Stop-and-go usage usually reduces tank range and raises annual fuel spend.'
      },
      {
        label: 'Cold-Weather Scenario',
        estimatedRangeMiles: winterRange,
        annualFuelCost: (annualMiles / Math.max(1, effectiveMpg * weatherMultipliers['cold-winter'])) * fuelPricePerGallon,
        notes: 'Winter operation and warm-up behavior often compress range.'
      },
      {
        label: 'Higher Payload Scenario',
        estimatedRangeMiles: heavyLoadRange,
        annualFuelCost: (annualMiles / Math.max(1, effectiveMpg * 0.92)) * fuelPricePerGallon,
        notes: 'Extra load and accessory drag can reduce real-world range.'
      }
    ].sort((a, b) => b.estimatedRangeMiles - a.estimatedRangeMiles);

    const projectionRows: ProjectionRow[] = [];
    let projectedMiles = annualMiles;
    let projectedFuelPrice = fuelPricePerGallon;
    let projectedTotalFuelCost = 0;

    for (let year = 1; year <= planningYears; year++) {
      const projectedAnnualFuelCost = (projectedMiles / effectiveMpg) * projectedFuelPrice;
      projectionRows.push({
        year,
        annualMiles: projectedMiles,
        fuelPrice: projectedFuelPrice,
        annualFuelCost: projectedAnnualFuelCost,
        estimatedRangeMiles
      });

      projectedTotalFuelCost += projectedAnnualFuelCost;
      projectedMiles *= 1 + annualMilesGrowthPercent / 100;
      projectedFuelPrice *= 1 + annualFuelPriceGrowthPercent / 100;
    }

    setResult({
      effectiveMpg,
      usableGallons,
      idleFuelGallons,
      estimatedRangeMiles,
      conservativeRangeMiles,
      rangeAtQuarterTankMiles,
      milesToRefuelNow,

      costPerMile,
      costPerFullTank,
      annualFuelCost,
      fillUpsPerYear,

      annualFuelConsumedGallons,
      annualEmissionsLbs,
      projectedTotalFuelCost,
      projectionRows,

      breakEvenMpgFor10PercentMoreRange,
      largestRangeDriver,
      scenarios,

      recommendations: buildRecommendations(
        conservativeRangeMiles,
        milesToRefuelNow,
        breakEvenMpgFor10PercentMoreRange,
        largestRangeDriver
      ),
      warningsAndConsiderations: buildWarnings(effectiveMpg, usableGallons, annualMiles),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'road-trip',
      tankCapacityGallons: '16.5',
      currentFuelPercent: '70',
      reserveFuelPercent: '12',

      includeDrivingMix: true,
      cityMpg: '24',
      highwayMpg: '33',
      combinedMpg: '28',
      cityDrivingPercent: '45',

      terrainType: 'rolling',
      weatherType: 'mild',
      payloadPenaltyPercent: '4',
      tirePressurePenaltyPercent: '2',

      includeIdlePenalty: true,
      expectedIdleHours: '2.5',
      idleBurnRateGph: '0.28',

      includeSafetyBuffer: true,
      safetyBufferMiles: '25',

      fuelPricePerGallon: '3.65',
      annualMiles: '15000',

      annualFuelPriceGrowthPercent: '3',
      annualMilesGrowthPercent: '1',
      planningYears: '5'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How is fuel tank range calculated?',
      answer:
        'Range is estimated from usable fuel gallons multiplied by effective MPG, then optionally reduced by idle-use assumptions and safety buffer miles.',
      category: 'Formula'
    },
    {
      question: 'Why is conservative range lower than estimated range?',
      answer:
        'Conservative range subtracts a safety margin so planning does not rely on near-empty operation or optimistic assumptions.',
      category: 'Safety'
    },
    {
      question: 'Should I include reserve fuel in usable range?',
      answer:
        'Most drivers should keep a reserve to avoid risk. This calculator treats reserve fuel as unavailable for planned travel.',
      category: 'Best Practice'
    },
    {
      question: 'How does city vs highway driving affect range?',
      answer:
        'City-heavy driving generally reduces MPG and range due to stops, acceleration, and idle time. Highway-heavy usage often extends range.',
      category: 'Driving Mix'
    },
    {
      question: 'Do weather and terrain really matter for range?',
      answer:
        'Yes. Cold weather, steep grades, and hilly routes can materially reduce real-world fuel economy and tank range.',
      category: 'Conditions'
    },
    {
      question: 'Why include idle fuel burn?',
      answer:
        'Idling consumes fuel without adding miles, so including idle usage improves practical trip-range planning accuracy.',
      category: 'Idle Impact'
    },
    {
      question: 'How often should I update range assumptions?',
      answer:
        'Update quarterly at minimum, and before long trips or seasonal/weather transitions.',
      category: 'Workflow'
    },
    {
      question: 'Can this help with annual fuel budgeting too?',
      answer:
        'Yes. The tool estimates annual fuel consumption, annual cost, fill-up frequency, and multi-year cost projections.',
      category: 'Budgeting'
    },
    {
      question: 'What is a practical refuel trigger?',
      answer:
        'A common strategy is refueling before entering reserve zone, using conservative range and route access constraints.',
      category: 'Planning'
    },
    {
      question: 'Is this range estimate exact?',
      answer:
        'No. It is a planning estimate. Actual range varies with traffic, speed, load, road grade, weather, and vehicle condition.',
      category: 'Limits'
    }
  ];

  const breakdownEntries = result
    ? [
        {
          label: 'Terrain Penalty',
          value: Math.abs(1 - terrainMultipliers[inputs.terrainType]) * 100,
          icon: Route,
          color: 'bg-blue-500'
        },
        {
          label: 'Weather Penalty',
          value: Math.abs(1 - weatherMultipliers[inputs.weatherType]) * 100,
          icon: CloudyIcon,
          color: 'bg-violet-500'
        },
        {
          label: 'Load + Tire Penalty',
          value: parseNonNegative(inputs.payloadPenaltyPercent) + parseNonNegative(inputs.tirePressurePenaltyPercent),
          icon: Wrench,
          color: 'bg-emerald-500'
        },
        {
          label: 'Idle Fuel Use',
          value: result.idleFuelGallons,
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
            <h2 className="text-2xl font-bold text-foreground">Fuel Tank Range Calculator</h2>
            <p className="text-muted-foreground">Advanced real-world tank range, refuel planning, and annual fuel-cost modeling</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes weighted MPG, reserve strategy, terrain/weather/load penalties, scenarios, and projections'
                : 'Uses core tank size, fuel level, and MPG assumptions'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Quick tank-range estimate'}
                  {inputs.calculationMode === 'road-trip' && 'Road Trip - Buffer-based route planning'}
                  {inputs.calculationMode === 'commuter' && 'Commuter - Daily reliability planning'}
                  {inputs.calculationMode === 'towing-load' && 'Towing/Load - Heavy-use penalty analysis'}
                  {inputs.calculationMode === 'fleet-lite' && 'Fleet Lite - Standardized range planning'}
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
                          ['basic', 'Basic', 'Quick tank-range estimate'],
                          ['road-trip', 'Road Trip', 'Buffer-based route planning'],
                          ['commuter', 'Commuter', 'Daily reliability planning'],
                          ['towing-load', 'Towing/Load', 'Heavy-use penalty analysis'],
                          ['fleet-lite', 'Fleet Lite', 'Standardized range planning']
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
            <label className="block text-sm font-medium text-foreground mb-2">Tank Capacity (gallons)</label>
            <input type="number" min="0" step="0.1" value={inputs.tankCapacityGallons} onChange={(e) => handleInputChange('tankCapacityGallons', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Fuel (%)</label>
            <input type="number" min="0" max="100" value={inputs.currentFuelPercent} onChange={(e) => handleInputChange('currentFuelPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Reserve Fuel (%)</label>
            <input type="number" min="0" max="90" value={inputs.reserveFuelPercent} onChange={(e) => handleInputChange('reserveFuelPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Efficiency Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City MPG</label>
              <input type="number" min="1" value={inputs.cityMpg} onChange={(e) => handleInputChange('cityMpg', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Highway MPG</label>
              <input type="number" min="1" value={inputs.highwayMpg} onChange={(e) => handleInputChange('highwayMpg', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Combined MPG</label>
              <input type="number" min="1" value={inputs.combinedMpg} onChange={(e) => handleInputChange('combinedMpg', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City Driving (%)</label>
              <input type="number" min="0" max="100" value={inputs.cityDrivingPercent} onChange={(e) => handleInputChange('cityDrivingPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <label className="flex items-start gap-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-background md:col-span-2">
              <input
                type="checkbox"
                checked={inputs.includeDrivingMix}
                onChange={(e) => handleInputChange('includeDrivingMix', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Use City/Highway Weighted MPG</strong>
                <br />
                Uses route-profile weighting instead of only combined MPG.
              </span>
            </label>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Real-World Condition Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Terrain</label>
              <select value={inputs.terrainType} onChange={(e) => handleInputChange('terrainType', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground">
                <option value="flat">Flat</option>
                <option value="rolling">Rolling</option>
                <option value="hilly">Hilly</option>
                <option value="mountain">Mountain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Weather</label>
              <select value={inputs.weatherType} onChange={(e) => handleInputChange('weatherType', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground">
                <option value="mild">Mild</option>
                <option value="hot-ac">Hot / A/C Heavy</option>
                <option value="cold-winter">Cold / Winter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payload Penalty (%)</label>
              <input type="number" min="0" max="40" value={inputs.payloadPenaltyPercent} onChange={(e) => handleInputChange('payloadPenaltyPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tire Pressure Penalty (%)</label>
              <input type="number" min="0" max="20" value={inputs.tirePressurePenaltyPercent} onChange={(e) => handleInputChange('tirePressurePenaltyPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Idle, Buffer, and Cost Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeIdlePenalty}
                  onChange={(e) => handleInputChange('includeIdlePenalty', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Include Idle Fuel Burn</strong>
                  <br />
                  Deducts idle fuel from usable trip range.
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expected Idle Hours</label>
                <input type="number" min="0" step="0.1" value={inputs.expectedIdleHours} onChange={(e) => handleInputChange('expectedIdleHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Idle Burn Rate (gal/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.idleBurnRateGph} onChange={(e) => handleInputChange('idleBurnRateGph', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>

              <label className="flex items-start gap-3 p-3 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-background">
                <input
                  type="checkbox"
                  checked={inputs.includeSafetyBuffer}
                  onChange={(e) => handleInputChange('includeSafetyBuffer', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  <strong>Use Safety Buffer</strong>
                  <br />
                  Subtracts planning buffer from range output.
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Safety Buffer (miles)</label>
                <input type="number" min="0" value={inputs.safetyBufferMiles} onChange={(e) => handleInputChange('safetyBufferMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gallon)</label>
                <input type="number" min="0" step="0.01" value={inputs.fuelPricePerGallon} onChange={(e) => handleInputChange('fuelPricePerGallon', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Miles</label>
                <input type="number" min="0" value={inputs.annualMiles} onChange={(e) => handleInputChange('annualMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualFuelPriceGrowthPercent} onChange={(e) => handleInputChange('annualFuelPriceGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Miles Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualMilesGrowthPercent} onChange={(e) => handleInputChange('annualMilesGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Planning Years</label>
                <input type="number" min="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
            Calculate Tank Range
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
            <p className="text-muted-foreground mt-1">Advanced tank-range and refuel-risk planning for U.S. driving conditions</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator estimates practical tank range using fuel level, reserve strategy, weighted MPG, and real-world penalties
          such as terrain, weather, payload, tire-pressure drag, and idle usage.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          It is built for planning decisions where reliability matters: long-trip refuel planning, commuter route resilience,
          and avoiding late refueling in low-availability fuel corridors.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          The model also provides annual fuel budgeting context and multi-year projection ranges so users can align daily operation
          with cost expectations and risk thresholds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Range with Reserve Logic</h3>
            </div>
            <p className="text-sm text-muted-foreground">Separates total fuel from usable fuel to avoid risky near-empty planning assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Refuel Trigger Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground">Provides conservative range and immediate refuel distance guidance under selected conditions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Condition-Adjusted Range</h3>
            </div>
            <p className="text-sm text-muted-foreground">Adjusts range for terrain, weather, payload, tire effects, and optional idle fuel usage.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Budget and Projection Layer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Estimates annual fuel cost, fill-up frequency, and multi-year spend exposure.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Condition-Aware Range Modeling</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Safety Buffer + Reserve Strategy</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Fuel Tank Range Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Estimated Range</p>
                <p className="text-2xl font-bold text-foreground">{result.estimatedRangeMiles.toFixed(1)} mi</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Conservative Range</p>
                <p className="text-2xl font-bold text-foreground">{result.conservativeRangeMiles.toFixed(1)} mi</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cost per Full Tank</p>
                <p className="text-2xl font-bold text-foreground">${result.costPerFullTank.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Annual Fuel Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.annualFuelCost.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest range driver: <strong>{result.largestRangeDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Effective MPG: <strong>{result.effectiveMpg.toFixed(2)}</strong> | Usable gallons: <strong>{result.usableGallons.toFixed(2)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Miles to planned refuel point: <strong>{result.milesToRefuelNow.toFixed(1)} mi</strong></p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Range Driver Breakdown
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
                        <div className="text-sm text-muted-foreground">{entry.value.toFixed(2)}</div>
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
                        <p className="font-semibold text-foreground">{scenario.estimatedRangeMiles.toFixed(1)} mi</p>
                        <p className="text-xs text-muted-foreground">range</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 mb-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Multi-Year Fuel Cost Projection
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-3">Year</th>
                      <th className="text-left py-2 pr-3">Annual Miles</th>
                      <th className="text-left py-2 pr-3">Fuel Price</th>
                      <th className="text-left py-2">Annual Fuel Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projectionRows.map((row) => (
                      <tr key={row.year} className="border-b last:border-b-0">
                        <td className="py-2 pr-3">{row.year}</td>
                        <td className="py-2 pr-3">{Math.round(row.annualMiles).toLocaleString()}</td>
                        <td className="py-2 pr-3">${row.fuelPrice.toFixed(2)}</td>
                        <td className="py-2">${row.annualFuelCost.toFixed(2)}</td>
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
          How to Use This Free Online Fuel Tank Range Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Enter tank and fuel-level baseline</h4>
              Input tank capacity, current fuel percentage, and planned reserve so usable fuel is separated from emergency buffer.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Set realistic MPG assumptions</h4>
              Use observed MPG values and weighted city/highway split when route profile is known.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Add terrain and weather conditions</h4>
              Select route terrain and seasonal/weather profile to reduce optimistic range bias.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Include load, tire, and idle penalties</h4>
              Enter practical penalties for payload, tire condition, and idle usage when relevant.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Configure safety buffer and refuel strategy</h4>
              Set a planning buffer so conservative range supports risk-aware refuel timing.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Review popup results and scenarios</h4>
              Use conservative range, scenario outputs, and projection tables for route and budget decisions.
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
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Target className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Estimated and Conservative Range</h4>
                <p className="text-xs text-muted-foreground">Shows both raw range and safety-buffered planning range.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Effective MPG and Usable Fuel</h4>
                <p className="text-xs text-muted-foreground">Explains how assumptions translate into practical travel distance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><DollarSign className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Fuel Cost Metrics</h4>
                <p className="text-xs text-muted-foreground">Includes cost per mile, cost per full tank, annual spend, and fill-up frequency.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Scenario and Projection Outputs</h4>
                <p className="text-xs text-muted-foreground">Compares alternative conditions and forward cost exposure across years.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Reserve-Aware Trip Reliability</h4>
              <p className="text-xs text-muted-foreground">Helps avoid overestimating range and entering high-risk low-fuel zones.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />Condition-Based Accuracy</h4>
              <p className="text-xs text-muted-foreground">Incorporates route, climate, and load conditions that basic range tools ignore.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Wallet className="h-4 w-4" />Range + Budget in One Tool</h4>
              <p className="text-xs text-muted-foreground">Connects immediate range planning with annual fuel-cost management.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4" />Decision Stress Testing</h4>
              <p className="text-xs text-muted-foreground">Scenario outputs improve planning resilience under uncertain conditions.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Weighted MPG and condition multipliers for realistic range estimation.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Reserve and safety-buffer strategy for practical refuel risk control.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Annual fuel budgeting and multi-year price/mileage projection layer.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Fuel Tank Range Planning
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />Core Concept: Usable Fuel vs Total Fuel</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Planning with total tank fuel can create risky assumptions. This tool separates reserve fuel from usable fuel,
              then applies effective MPG to estimate practical travel distance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Total fuel indicates inventory, not safe usable distance.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Conservative range helps manage uncertainty and station availability risk.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors Affecting Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Driving profile: city-heavy routes usually reduce MPG and range.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Terrain and elevation can materially reduce realized range.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Weather and HVAC load often reduce fuel economy in hot/cold extremes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Payload, tire condition, and idle habits influence usable distance.</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced Comparison: Optimistic vs Conservative Range</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Optimistic range uses fewer penalties and no buffer, useful for best-case awareness only.</li>
              <li>- Conservative range includes practical deductions and safety margin, better for route commitment decisions.</li>
              <li>- Planning should generally rely on conservative range for reliability under uncertainty.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Threshold and Refuel Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Set reserve and buffer thresholds before trip departure, not mid-route.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use lower threshold for routes with sparse station density.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">When conservative range falls below planned segment length, refuel early.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Recalculate for seasonal changes and heavy-load travel segments.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />Cost and Efficiency Optimization</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Keep tires properly inflated and maintain routine service intervals for MPG retention.</li>
              <li>- Reduce avoidable idling and route inefficiencies to preserve effective range.</li>
              <li>- Align fueling strategy with price and route convenience to reduce annual spend variance.</li>
              <li>- Track real-world tank-to-tank outcomes and recalibrate assumptions periodically.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Practical Risks and Limits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Extreme weather and stop-and-go traffic can rapidly erode expected range.</li>
              <li>- Underestimated reserve needs raise risk in low-station corridors.</li>
              <li>- Payload shifts and seasonal tires can alter efficiency baseline materially.</li>
              <li>- Modeled outputs are planning estimates and should be validated with observed data.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Fuel Tank Range Benchmarks
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
                <td className="py-3 px-4 font-medium">Tank Capacity</td>
                <td className="py-3 px-4">12 - 26+</td>
                <td className="py-3 px-4">gallons</td>
                <td className="py-3 px-4 text-muted-foreground">Vehicle class and trim influence capacity materially</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Reserve Strategy</td>
                <td className="py-3 px-4">8% - 20%</td>
                <td className="py-3 px-4">of tank</td>
                <td className="py-3 px-4 text-muted-foreground">Higher reserve improves reliability but reduces usable range</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Effective MPG</td>
                <td className="py-3 px-4">16 - 40+</td>
                <td className="py-3 px-4">mpg</td>
                <td className="py-3 px-4 text-muted-foreground">Real-world route and weather often reduce sticker MPG</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Safety Buffer</td>
                <td className="py-3 px-4">15 - 40+</td>
                <td className="py-3 px-4">miles</td>
                <td className="py-3 px-4 text-muted-foreground">Buffer should increase with route uncertainty</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Idle Fuel Burn</td>
                <td className="py-3 px-4">0.2 - 0.6</td>
                <td className="py-3 px-4">gallons/hour</td>
                <td className="py-3 px-4 text-muted-foreground">Urban and winter warm-up patterns raise idle impact</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmarks are for orientation only. Use real fill-up and trip data for decision-grade calibration.
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
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - MPG and fuel-use reference</li>
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Fuel Prices</a> - fuel-price market context</li>
              <li>- <a href="https://www.epa.gov/greenvehicles" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA Green Vehicle Resources</a> - fuel-efficiency context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.nhtsa.gov/road-safety/fuel-economy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA Fuel Economy Resources</a> - driving behavior and efficiency effects</li>
              <li>- <a href="https://afdc.energy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE AFDC</a> - transportation fuel and efficiency data context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Cost and Budgeting Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Context</a> - operating cost framing</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. BLS CPI</a> - inflation and consumer budget context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Community and Practical Experience Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/cars</a> - practical range and fuel-economy experiences</li>
              <li>- <a href="https://www.reddit.com/r/roadtrip/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/roadtrip</a> - route and fueling planning discussions</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is for planning and educational use. It does not replace route safety judgment or professional advice.
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
        <CalculatorReview calculatorName="Fuel Tank Range Calculator" />
      </div>
    </div>
  );
};

const CloudyIcon = ({ className }: { className?: string }) => {
  return <Leaf className={className} />;
};

export default AdvancedFuelTankRangeCalculator;
