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
  | 'annual-budget'
  | 'road-trip'
  | 'price-sensitivity'
  | 'fleet-lite';

interface Inputs {
  calculationMode: CalculationMode;
  tripDistance: string;
  includeReturnTrip: boolean;
  annualMiles: string;
  fuelPricePerGallon: string;
  vehicleMpg: string;
  cityMpg: string;
  highwayMpg: string;
  cityDrivingPercent: string;
  includeDrivingMix: boolean;
  idleHoursPerMonth: string;
  fuelBurnPerIdleHour: string;
  tollsPerMonth: string;
  parkingPerMonth: string;
  passengersPerTrip: string;
  annualFuelPriceIncreasePercent: string;
  annualMilesGrowthPercent: string;
  planningYears: string;
}

interface Scenario {
  label: string;
  annualCost: number;
  annualDelta: number;
  notes: string;
}

interface ProjectionRow {
  year: number;
  annualMiles: number;
  fuelPrice: number;
  annualCost: number;
}

interface Result {
  effectiveMpg: number;
  tripMiles: number;
  tripGallons: number;
  tripFuelCost: number;
  annualMiles: number;
  annualFuelCost: number;
  annualIdleFuelCost: number;
  annualFixedRoadCost: number;
  annualTotalCost: number;
  monthlyTotalCost: number;
  weeklyFuelCost: number;
  costPerMile: number;
  costPerPassengerMile: number;
  mpgForTenPercentSavings: number;
  totalProjectedCost: number;
  projectionRows: ProjectionRow[];
  largestCostDriver: string;
  scenarios: Scenario[];
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

const AdvancedFuelCostCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    calculationMode: 'annual-budget',
    tripDistance: '18',
    includeReturnTrip: true,
    annualMiles: '14000',
    fuelPricePerGallon: '3.65',
    vehicleMpg: '27',
    cityMpg: '23',
    highwayMpg: '33',
    cityDrivingPercent: '55',
    includeDrivingMix: true,
    idleHoursPerMonth: '6',
    fuelBurnPerIdleHour: '0.28',
    tollsPerMonth: '45',
    parkingPerMonth: '60',
    passengersPerTrip: '1',
    annualFuelPriceIncreasePercent: '3.5',
    annualMilesGrowthPercent: '1.5',
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
    annualTotalCost: number,
    costPerMile: number,
    largestCostDriver: string,
    mpgForTenPercentSavings: number
  ): string[] => {
    const recommendations: string[] = [];

    if (largestCostDriver === 'Fuel Spend') {
      recommendations.push('Fuel spend is your largest driver. Route planning, smoother acceleration, and speed discipline usually provide immediate savings.');
    }

    if (largestCostDriver === 'Fixed Road Costs') {
      recommendations.push('Non-fuel road costs are significant. Review toll route strategy and parking policy before focusing on marginal MPG changes.');
    }

    if (largestCostDriver === 'Idle Fuel Waste') {
      recommendations.push('Idle fuel waste is high. Reducing warm-up and parked-idle habits can cut annual spend without changing route volume.');
    }

    if (costPerMile > 0.8) {
      recommendations.push('Cost per mile is elevated under current assumptions. Audit fixed monthly charges and verify real-world MPG baseline.');
    }

    if (annualTotalCost > 7000) {
      recommendations.push('Annual fuel-related burden is substantial. Set quarterly fuel budget targets and monitor variance monthly.');
    }

    recommendations.push(`A target MPG of about ${mpgForTenPercentSavings.toFixed(1)} would reduce fuel-only annual spend by roughly 10% under current assumptions.`);
    recommendations.push('Recalculate when fuel prices move materially or when commute pattern changes (remote days, route changes, seasonal driving).');

    return recommendations;
  };

  const buildWarnings = (annualMiles: number, effectiveMpg: number): string[] => {
    const warnings: string[] = [];

    if (annualMiles === 0) {
      warnings.push('Annual miles are zero, so annual budgeting and cost-per-mile results are not meaningful.');
    }

    if (effectiveMpg < 12) {
      warnings.push('Effective MPG appears very low. Confirm vehicle efficiency and driving-mix assumptions.');
    }

    const idleHours = parseNonNegative(inputs.idleHoursPerMonth);
    if (idleHours > 25) {
      warnings.push('Idle hours are high and can materially skew annual fuel cost. Validate this assumption with actual logs.');
    }

    warnings.push('This calculator is a planning tool. Real outcomes vary with traffic, weather, terrain, load, and local fuel market volatility.');

    return warnings;
  };

  const buildNextSteps = (): string[] => [
    'Log 2-4 full tanks and compute observed MPG before finalizing budgets.',
    'Track fuel price weekly and update assumptions monthly.',
    'Split commuting and non-commuting miles if your usage pattern changes seasonally.',
    'Test at least two savings scenarios: MPG improvement and fixed-road-cost reduction.',
    'Re-run projection before annual budget planning and after major fuel-price shifts.'
  ];

  const calculate = () => {
    const tripDistance = parseNonNegative(inputs.tripDistance);
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const fuelPricePerGallon = parseNonNegative(inputs.fuelPricePerGallon);
    const vehicleMpg = Math.max(1, parseNonNegative(inputs.vehicleMpg));
    const cityMpg = Math.max(1, parseNonNegative(inputs.cityMpg));
    const highwayMpg = Math.max(1, parseNonNegative(inputs.highwayMpg));
    const cityDrivingPercent = Math.min(100, parseNonNegative(inputs.cityDrivingPercent));
    const idleHoursPerMonth = parseNonNegative(inputs.idleHoursPerMonth);
    const fuelBurnPerIdleHour = parseNonNegative(inputs.fuelBurnPerIdleHour);
    const tollsPerMonth = parseNonNegative(inputs.tollsPerMonth);
    const parkingPerMonth = parseNonNegative(inputs.parkingPerMonth);
    const passengersPerTrip = Math.max(1, parseNonNegative(inputs.passengersPerTrip));
    const annualFuelPriceIncreasePercent = parseNonNegative(inputs.annualFuelPriceIncreasePercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parseNonNegative(inputs.planningYears));

    const cityShare = cityDrivingPercent / 100;
    const highwayShare = 1 - cityShare;

    const effectiveMpg = inputs.includeDrivingMix
      ? 1 / (cityShare / cityMpg + highwayShare / highwayMpg)
      : vehicleMpg;

    const tripMiles = inputs.includeReturnTrip ? tripDistance * 2 : tripDistance;
    const tripGallons = tripMiles / effectiveMpg;
    const tripFuelCost = tripGallons * fuelPricePerGallon;

    const annualFuelCost = (annualMiles / effectiveMpg) * fuelPricePerGallon;
    const annualIdleFuelCost = idleHoursPerMonth * 12 * fuelBurnPerIdleHour * fuelPricePerGallon;
    const annualFixedRoadCost = (tollsPerMonth + parkingPerMonth) * 12;

    const annualTotalCost = annualFuelCost + annualIdleFuelCost + annualFixedRoadCost;
    const monthlyTotalCost = annualTotalCost / 12;
    const weeklyFuelCost = annualFuelCost / 52;

    const costPerMile = annualMiles > 0 ? annualTotalCost / annualMiles : 0;
    const costPerPassengerMile = costPerMile / passengersPerTrip;

    const mpgForTenPercentSavings = effectiveMpg / 0.9;

    const projectionRows: ProjectionRow[] = [];
    let projectedMiles = annualMiles;
    let projectedFuelPrice = fuelPricePerGallon;
    let totalProjectedCost = 0;

    for (let year = 1; year <= planningYears; year++) {
      const projectedFuelCost = (projectedMiles / effectiveMpg) * projectedFuelPrice;
      const projectedIdleCost = idleHoursPerMonth * 12 * fuelBurnPerIdleHour * projectedFuelPrice;
      const projectedAnnualCost = projectedFuelCost + projectedIdleCost + annualFixedRoadCost;

      projectionRows.push({
        year,
        annualMiles: projectedMiles,
        fuelPrice: projectedFuelPrice,
        annualCost: projectedAnnualCost
      });

      totalProjectedCost += projectedAnnualCost;
      projectedMiles *= 1 + annualMilesGrowthPercent / 100;
      projectedFuelPrice *= 1 + annualFuelPriceIncreasePercent / 100;
    }

    const fuelUp20 = annualMiles / effectiveMpg * (fuelPricePerGallon * 1.2) + annualIdleFuelCost * 1.2 + annualFixedRoadCost;
    const fuelDown15 = annualMiles / effectiveMpg * (fuelPricePerGallon * 0.85) + annualIdleFuelCost * 0.85 + annualFixedRoadCost;
    const mpgUp12 = annualMiles / (effectiveMpg * 1.12) * fuelPricePerGallon + annualIdleFuelCost + annualFixedRoadCost;
    const milesDown10 = annualMiles * 0.9 / effectiveMpg * fuelPricePerGallon + annualIdleFuelCost + annualFixedRoadCost;
    const idleDown50 = annualFuelCost + annualIdleFuelCost * 0.5 + annualFixedRoadCost;

    const scenarios: Scenario[] = [
      {
        label: 'Fuel Price +20%',
        annualCost: fuelUp20,
        annualDelta: fuelUp20 - annualTotalCost,
        notes: 'Stress case for fuel market volatility and inflation spikes.'
      },
      {
        label: 'Fuel Price -15%',
        annualCost: fuelDown15,
        annualDelta: fuelDown15 - annualTotalCost,
        notes: 'Downside price scenario with lower fuel-market pressure.'
      },
      {
        label: 'Effective MPG +12%',
        annualCost: mpgUp12,
        annualDelta: mpgUp12 - annualTotalCost,
        notes: 'Represents route/behavior optimization and improved efficiency.'
      },
      {
        label: 'Annual Miles -10%',
        annualCost: milesDown10,
        annualDelta: milesDown10 - annualTotalCost,
        notes: 'Useful for remote-work, trip consolidation, or schedule changes.'
      },
      {
        label: 'Idle Hours -50%',
        annualCost: idleDown50,
        annualDelta: idleDown50 - annualTotalCost,
        notes: 'Captures savings potential from idle reduction habits.'
      }
    ].sort((a, b) => a.annualDelta - b.annualDelta);

    const largestCostDriver = findLargestDriver([
      ['Fuel Spend', annualFuelCost],
      ['Idle Fuel Waste', annualIdleFuelCost],
      ['Fixed Road Costs', annualFixedRoadCost]
    ]);

    setResult({
      effectiveMpg,
      tripMiles,
      tripGallons,
      tripFuelCost,
      annualMiles,
      annualFuelCost,
      annualIdleFuelCost,
      annualFixedRoadCost,
      annualTotalCost,
      monthlyTotalCost,
      weeklyFuelCost,
      costPerMile,
      costPerPassengerMile,
      mpgForTenPercentSavings,
      totalProjectedCost,
      projectionRows,
      largestCostDriver,
      scenarios,
      recommendations: buildRecommendations(
        annualTotalCost,
        costPerMile,
        largestCostDriver,
        mpgForTenPercentSavings
      ),
      warningsAndConsiderations: buildWarnings(annualMiles, effectiveMpg),
      nextSteps: buildNextSteps()
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs({
      calculationMode: 'annual-budget',
      tripDistance: '18',
      includeReturnTrip: true,
      annualMiles: '14000',
      fuelPricePerGallon: '3.65',
      vehicleMpg: '27',
      cityMpg: '23',
      highwayMpg: '33',
      cityDrivingPercent: '55',
      includeDrivingMix: true,
      idleHoursPerMonth: '6',
      fuelBurnPerIdleHour: '0.28',
      tollsPerMonth: '45',
      parkingPerMonth: '60',
      passengersPerTrip: '1',
      annualFuelPriceIncreasePercent: '3.5',
      annualMilesGrowthPercent: '1.5',
      planningYears: '5'
    });

    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How do I calculate fuel cost for a trip?',
      answer:
        'Trip fuel cost is estimated as trip miles divided by effective MPG, multiplied by local fuel price per gallon. Add return trip distance where relevant.',
      category: 'Trip Math'
    },
    {
      question: 'Why should I use effective MPG instead of sticker MPG?',
      answer:
        'Sticker MPG often differs from real usage. Effective MPG based on your city/highway mix is usually more accurate for budgeting.',
      category: 'Accuracy'
    },
    {
      question: 'How much does idling affect annual fuel spend?',
      answer:
        'Idle fuel use can be meaningful for urban and delivery profiles. Including monthly idle hours helps avoid underestimating total annual cost.',
      category: 'Idle Cost'
    },
    {
      question: 'Should tolls and parking be included in fuel budgeting?',
      answer:
        'If your goal is total travel-cost planning, yes. These fixed road costs often rival pure fuel savings from small MPG improvements.',
      category: 'Budgeting'
    },
    {
      question: 'How often should I update fuel assumptions?',
      answer:
        'Monthly updates are recommended during volatile fuel markets. Quarterly updates are a practical minimum for stable planning cycles.',
      category: 'Workflow'
    },
    {
      question: 'Can this calculator help with reimbursement planning?',
      answer:
        'It supports planning and budgeting, but reimbursement policies may use separate standards (e.g., IRS rates) and should be checked independently.',
      category: 'Business Use'
    },
    {
      question: 'What is cost per passenger mile used for?',
      answer:
        'It helps evaluate shared rides, carpool economics, and transport allocation decisions where occupancy changes the effective cost burden.',
      category: 'Metric'
    },
    {
      question: 'How do price changes affect multi-year fuel budgets?',
      answer:
        'Even modest annual fuel-price increases can significantly raise total cost over several years, especially at higher annual mileage.',
      category: 'Projection'
    },
    {
      question: 'What inputs cause the biggest estimate errors?',
      answer:
        'Unrealistic MPG assumptions, outdated fuel prices, and missing idle/fixed-road costs are the most common causes of budgeting error.',
      category: 'Common Errors'
    },
    {
      question: 'Is this model suitable for fleet decisions?',
      answer:
        'It is useful for initial planning. Fleet decisions should additionally include depreciation, downtime, labor, and vehicle replacement policy factors.',
      category: 'Fleet'
    }
  ];

  const breakdownEntries = result
    ? [
        {
          label: 'Fuel Spend',
          value: result.annualFuelCost,
          icon: Fuel,
          color: 'bg-blue-500'
        },
        {
          label: 'Idle Fuel Waste',
          value: result.annualIdleFuelCost,
          icon: Clock3,
          color: 'bg-rose-500'
        },
        {
          label: 'Fixed Road Costs',
          value: result.annualFixedRoadCost,
          icon: Wallet,
          color: 'bg-violet-500'
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
            <h2 className="text-2xl font-bold text-foreground">Fuel Cost Calculator</h2>
            <p className="text-muted-foreground">Advanced trip, annual budget, and fuel-price sensitivity analysis</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes city/highway mix, idle fuel waste, fixed road costs, and multi-year projection'
                : 'Uses core trip distance, fuel price, and MPG assumptions'}
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
                  {inputs.calculationMode === 'basic' && 'Basic - Trip and annual fuel estimate'}
                  {inputs.calculationMode === 'annual-budget' && 'Annual Budget - Full-year spending plan'}
                  {inputs.calculationMode === 'road-trip' && 'Road Trip - Trip-focused scenario mode'}
                  {inputs.calculationMode === 'price-sensitivity' && 'Price Sensitivity - Fuel volatility planning'}
                  {inputs.calculationMode === 'fleet-lite' && 'Fleet Lite - Multi-vehicle planning baseline'}
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
                          ['basic', 'Basic', 'Trip and annual fuel estimate'],
                          ['annual-budget', 'Annual Budget', 'Full-year spending plan'],
                          ['road-trip', 'Road Trip', 'Trip-focused scenario mode'],
                          ['price-sensitivity', 'Price Sensitivity', 'Fuel volatility planning'],
                          ['fleet-lite', 'Fleet Lite', 'Multi-vehicle planning baseline']
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
            <label className="block text-sm font-medium text-foreground mb-2">Trip Distance (one-way miles)</label>
            <input
              type="number"
              min="0"
              value={inputs.tripDistance}
              onChange={(e) => handleInputChange('tripDistance', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
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
            <label className="block text-sm font-medium text-foreground mb-2">Vehicle MPG (combined)</label>
            <input
              type="number"
              min="1"
              value={inputs.vehicleMpg}
              onChange={(e) => handleInputChange('vehicleMpg', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground mt-7 md:mt-0">
              <input
                type="checkbox"
                checked={inputs.includeReturnTrip}
                onChange={(e) => handleInputChange('includeReturnTrip', e.target.checked)}
              />
              Include return trip distance in trip calculations
            </label>
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Efficiency and Driving Mix Inputs
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
              <label className="block text-sm font-medium text-foreground mb-2">City Driving (%)</label>
              <input type="number" min="0" max="100" value={inputs.cityDrivingPercent} onChange={(e) => handleInputChange('cityDrivingPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <label className="flex items-start gap-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-background">
              <input
                type="checkbox"
                checked={inputs.includeDrivingMix}
                onChange={(e) => handleInputChange('includeDrivingMix', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <strong>Use City/Highway Mix MPG</strong>
                <br />
                Uses weighted effective MPG instead of combined MPG.
              </span>
            </label>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Additional Cost Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Idle Hours / Month</label>
              <input type="number" min="0" step="0.1" value={inputs.idleHoursPerMonth} onChange={(e) => handleInputChange('idleHoursPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fuel Burn at Idle (gal/hour)</label>
              <input type="number" min="0" step="0.01" value={inputs.fuelBurnPerIdleHour} onChange={(e) => handleInputChange('fuelBurnPerIdleHour', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Passengers / Trip</label>
              <input type="number" min="1" step="1" value={inputs.passengersPerTrip} onChange={(e) => handleInputChange('passengersPerTrip', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tolls ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.tollsPerMonth} onChange={(e) => handleInputChange('tollsPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parking ($/month)</label>
              <input type="number" min="0" step="0.01" value={inputs.parkingPerMonth} onChange={(e) => handleInputChange('parkingPerMonth', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Projection Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Fuel Price Increase (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualFuelPriceIncreasePercent} onChange={(e) => handleInputChange('annualFuelPriceIncreasePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Miles Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualMilesGrowthPercent} onChange={(e) => handleInputChange('annualMilesGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Planning Horizon (years)</label>
                <input type="number" min="1" step="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
            Calculate Fuel Cost
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
            <p className="text-muted-foreground mt-1">Advanced fuel budgeting for trip, monthly, annual, and multi-year planning</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator estimates true fuel-related travel cost by combining fuel spend, idle consumption,
          and recurring road costs such as tolls and parking.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          It is designed for practical planning questions: "What will this trip cost?", "What is my annual transport fuel burden?",
          and "How sensitive is my budget to fuel-price changes?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Route className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Trip + Annual Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">Handles one-trip and annual budget planning in one workflow.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Sensitivity Scenarios</h3>
            </div>
            <p className="text-sm text-muted-foreground">Tests fuel volatility, MPG improvement, miles reduction, and idle reduction cases.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Clock3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Idle Cost Layer</h3>
            </div>
            <p className="text-sm text-muted-foreground">Includes idle fuel waste for more realistic urban or delivery-style usage profiles.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Projection Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground">Projects multi-year fuel budget under price inflation and mileage growth assumptions.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario Planning</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Projection Mode</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Fuel Cost Results and Detailed Calculations
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
                <p className="text-sm text-muted-foreground">Trip Fuel Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.tripFuelCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Annual Total Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.annualTotalCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Total Cost</p>
                <p className="text-2xl font-bold text-foreground">${result.monthlyTotalCost.toFixed(2)}</p>
              </div>
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cost Per Mile</p>
                <p className="text-2xl font-bold text-foreground">${result.costPerMile.toFixed(3)}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest cost driver: <strong>{result.largestCostDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Effective MPG used: <strong>{result.effectiveMpg.toFixed(2)}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Projected {result.projectionRows.length}-year total cost: <strong>${result.totalProjectedCost.toFixed(2)}</strong></p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Component Breakdown
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
                Scenario Comparison (Best Savings First)
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
                        <p className="text-xs text-muted-foreground">delta/yr</p>
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
                      <th className="text-left py-2 pr-3">Fuel Price</th>
                      <th className="text-left py-2">Annual Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projectionRows.map((row) => (
                      <tr key={row.year} className="border-b last:border-b-0">
                        <td className="py-2 pr-3">{row.year}</td>
                        <td className="py-2 pr-3">{Math.round(row.annualMiles).toLocaleString()}</td>
                        <td className="py-2 pr-3">${row.fuelPrice.toFixed(2)}</td>
                        <td className="py-2">${row.annualCost.toFixed(2)}</td>
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
          How to Use This Free Online Fuel Cost Calculator
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Enter trip and annual mileage baseline</h4>
              Define both one-way trip distance and annual mileage so outputs cover immediate and long-range budgeting needs.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Add local fuel price and MPG assumptions</h4>
              Use current local fuel prices and realistic observed MPG values to avoid planning bias.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Configure driving mix if needed</h4>
              Add city/highway split for weighted MPG when your route profile differs from simple combined values.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Include idle and fixed road costs</h4>
              Add idle fuel waste, tolls, and parking for a realistic total-cost model beyond pump spend.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Set projection assumptions</h4>
              Input annual fuel-price and mileage growth to estimate multi-year budget exposure.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Review popup output and prioritize actions</h4>
              Focus on largest cost driver and scenario deltas before committing budget or route decisions.
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
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />Trip and Annual Cost Totals</h4>
                <p className="text-xs text-muted-foreground">Immediate trip estimate plus annual and monthly budgeting outputs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Cost Per Mile Metrics</h4>
                <p className="text-xs text-muted-foreground">Shows per-mile and per-passenger-mile economics for transport planning.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Scenario Deltas</h4>
                <p className="text-xs text-muted-foreground">Quantifies annual cost impact from price, mileage, and efficiency shifts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><BookOpen className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />Projection Table</h4>
                <p className="text-xs text-muted-foreground">Year-by-year view for fuel budget planning under trend assumptions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Trip + Budget in One Tool</h4>
              <p className="text-xs text-muted-foreground">Bridges immediate trip planning and annual budget control in a single model.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Clock3 className="h-4 w-4" />Idle-Aware Economics</h4>
              <p className="text-xs text-muted-foreground">Captures idle fuel burden often missed by basic calculators.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />Driving-Mix Accuracy</h4>
              <p className="text-xs text-muted-foreground">Uses city/highway weighted MPG when combined estimates are insufficient.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />Scenario Resilience</h4>
              <p className="text-xs text-muted-foreground">Stress testing improves decision quality under volatile fuel conditions.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Weighted city/highway efficiency model for better real-world accuracy.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Idle and fixed-road-cost layers for full travel-cost planning.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Multi-year projection with fuel inflation and mileage growth assumptions.</span></div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding Fuel Cost Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />Why Fuel Price Alone Is Not Enough</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Per-gallon price is visible, but total mobility spend also reflects efficiency, annual miles, idle behavior, and non-fuel travel costs.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Drivers That Shift Annual Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Fuel price volatility across months and regions</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Real effective MPG under your actual route profile</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Idle-time fuel waste in urban stop-and-go routines</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Recurring toll and parking stack</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced Comparison: Highway-Heavy vs City-Heavy Profiles</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Highway-heavy driving often yields stronger MPG and lower per-mile fuel spend.</li>
              <li>- City-heavy profiles usually face lower MPG and higher idle-related losses.</li>
              <li>- Mixed-route drivers benefit most from weighted MPG assumptions over generic averages.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Thresholds and Planning Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If cost-per-mile rises above your budget tolerance, validate fuel and fixed-cost assumptions first.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If fixed road costs dominate, toll/parking strategy can outperform small MPG improvements.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">If fuel dominates, route and driving behavior improvements usually provide fastest payback.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use multi-year projections before setting annual transport budget commitments.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />Financial Optimization Options</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Use weekly fuel-price monitoring and preferred-station strategy.</li>
              <li>- Reduce avoidable idling and route inefficiencies.</li>
              <li>- Reassess parking/toll passes and alternative route tradeoffs.</li>
              <li>- Pair fuel planning with periodic vehicle maintenance checks for sustained MPG performance.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Risk and Planning Boundaries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Fuel markets can shift quickly and create large monthly budget variance.</li>
              <li>- Seasonal weather and traffic changes impact real-world efficiency.</li>
              <li>- One-time trip data is noisy; multi-tank averages improve planning quality.</li>
              <li>- Scenario outputs are planning ranges, not guaranteed outcomes.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Fuel Cost Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">Fuel Price</td>
                <td className="py-3 px-4">$2.80 - $5.20+</td>
                <td className="py-3 px-4">per gallon</td>
                <td className="py-3 px-4 text-muted-foreground">Region and season can materially shift monthly spend</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Effective MPG</td>
                <td className="py-3 px-4">16 - 40+</td>
                <td className="py-3 px-4">miles per gallon</td>
                <td className="py-3 px-4 text-muted-foreground">Depends on route mix, speed profile, and load</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Idle Fuel Burn</td>
                <td className="py-3 px-4">0.2 - 0.6</td>
                <td className="py-3 px-4">gallons/hour</td>
                <td className="py-3 px-4 text-muted-foreground">Urban and delivery routes typically see higher idle burden</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Fuel Inflation Assumption</td>
                <td className="py-3 px-4">2% - 7%</td>
                <td className="py-3 px-4">annual growth</td>
                <td className="py-3 px-4 text-muted-foreground">Use conservative planning range for multi-year budgets</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Cost Per Mile</td>
                <td className="py-3 px-4">$0.20 - $1.00+</td>
                <td className="py-3 px-4">total travel estimate</td>
                <td className="py-3 px-4 text-muted-foreground">Includes fuel, idle, toll, and parking assumptions here</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          These are planning references only. Use actual receipts, odometer deltas, and local prices for decision-grade budgeting.
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
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Gasoline and Diesel Prices</a> - fuel price trend context</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - MPG and fuel-use reference context</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI</a> - transportation inflation context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Cost Studies</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Research</a> - operating-cost methodology context</li>
              <li>- <a href="https://www.nhtsa.gov/road-safety/fuel-economy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA Fuel Economy Guidance Context</a> - efficiency and driving behavior context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Market and Financial Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - inflation and household spending context</li>
              <li>- <a href="https://www.consumerfinance.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Consumer Resources</a> - budgeting and consumer finance context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Community and Driver Experience Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/personalfinance/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/personalfinance</a> - transport budget planning discussions</li>
              <li>- <a href="https://www.reddit.com/r/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/cars</a> - real-world MPG and fuel-cost experience context</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is intended for budgeting and planning use. It is not tax, legal, or accounting advice and should be paired with real expense records.
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
        <CalculatorReview calculatorName="Fuel Cost Calculator" />
      </div>
    </div>
  );
};

export default AdvancedFuelCostCalculator;
