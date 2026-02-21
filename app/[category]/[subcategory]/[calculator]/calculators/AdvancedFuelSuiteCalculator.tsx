'use client';

import React, { useMemo, useState } from 'react';
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
  Wrench,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

export type FuelSuiteVariant =
  | 'gas-mileage'
  | 'gas-savings'
  | 'hybrid-savings'
  | 'mpg'
  | 'octane'
  | 'trip-fuel';

interface AdvancedFuelSuiteCalculatorProps {
  variant: FuelSuiteVariant;
}

interface Inputs {
  annualMiles: string;
  fuelPrice: string;
  tripDistance: string;
  gallonsUsed: string;
  mpgCurrent: string;
  mpgAlternative: string;
  cityMpg: string;
  highwayMpg: string;
  cityDrivingPercent: string;
  includeReturnTrip: boolean;
  tankCapacity: string;
  regularPrice: string;
  premiumPrice: string;
  premiumMpgGainPercent: string;
  hybridPricePremium: string;
  annualMaintenanceSavings: string;
  annualInsuranceDelta: string;
  annualFuelPriceGrowthPercent: string;
  annualMilesGrowthPercent: string;
  planningYears: string;
}

interface KPI {
  label: string;
  value: number;
  isCurrency?: boolean;
  decimals?: number;
  suffix?: string;
}

interface BreakdownItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface Scenario {
  label: string;
  value: number;
  notes: string;
}

interface ProjectionRow {
  year: number;
  annualMiles: number;
  fuelPrice: number;
  annualCost: number;
}

interface CalculationResult {
  primaryLabel: string;
  primaryValue: number;
  primaryIsCurrency: boolean;
  primarySuffix?: string;
  kpis: KPI[];
  breakdown: BreakdownItem[];
  scenarios: Scenario[];
  projectionRows: ProjectionRow[];
  largestDriver: string;
  recommendations: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
}

interface VariantConfig {
  title: string;
  subtitle: string;
  calculateButtonLabel: string;
  topicLabel: string;
  focusLabel: string;
  referencesFocus: string;
}

interface FuelVariantNarrative {
  keyInputs: string;
  decisionGoal: string;
  stressCase: string;
  thresholdGuidance: string;
  optimizationLevers: string;
  benchmarkLabel: string;
  benchmarkRange: string;
  benchmarkUnit: string;
  benchmarkNote: string;
  researchFocus: string;
}

const VARIANT_CONFIG: Record<FuelSuiteVariant, VariantConfig> = {
  'gas-mileage': {
    title: 'Gas Mileage Calculator',
    subtitle: 'Advanced observed MPG, annual fuel budget, and scenario planning',
    calculateButtonLabel: 'Calculate Gas Mileage',
    topicLabel: 'Gas Mileage',
    focusLabel: 'observed MPG and annual fuel burden',
    referencesFocus: 'MPG and fuel-cost planning'
  },
  'gas-savings': {
    title: 'Gas Savings Calculator',
    subtitle: 'Advanced fuel-efficiency upgrade savings and sensitivity modeling',
    calculateButtonLabel: 'Calculate Gas Savings',
    topicLabel: 'Gas Savings',
    focusLabel: 'annual fuel savings and payback quality',
    referencesFocus: 'fuel savings and household budgeting'
  },
  'hybrid-savings': {
    title: 'Hybrid Savings Calculator',
    subtitle: 'Advanced hybrid vs gas cost comparison with payback timeline',
    calculateButtonLabel: 'Calculate Hybrid Savings',
    topicLabel: 'Hybrid Savings',
    focusLabel: 'hybrid economics and premium recovery',
    referencesFocus: 'hybrid ownership cost analysis'
  },
  mpg: {
    title: 'MPG Calculator',
    subtitle: 'Advanced weighted MPG and fuel-cost planning workflow',
    calculateButtonLabel: 'Calculate MPG',
    topicLabel: 'MPG',
    focusLabel: 'effective MPG and per-mile cost control',
    referencesFocus: 'fuel economy methodology'
  },
  octane: {
    title: 'Octane Calculator',
    subtitle: 'Advanced regular vs premium cost-per-mile and performance assumptions',
    calculateButtonLabel: 'Calculate Octane Economics',
    topicLabel: 'Octane',
    focusLabel: 'octane pricing tradeoffs and break-even math',
    referencesFocus: 'fuel grade economics'
  },
  'trip-fuel': {
    title: 'Trip Fuel Calculator',
    subtitle: 'Advanced trip fuel cost, tank-stop planning, and risk-aware range checks',
    calculateButtonLabel: 'Calculate Trip Fuel',
    topicLabel: 'Trip Fuel',
    focusLabel: 'trip fuel cost and refuel-stop strategy',
    referencesFocus: 'trip fuel and route planning'
  }
};

const FUEL_VARIANT_NARRATIVE: Record<FuelSuiteVariant, FuelVariantNarrative> = {
  'gas-mileage': {
    keyInputs: 'observed miles, gallons consumed, route mix, and seasonal driving behavior',
    decisionGoal: 'measure real MPG and avoid budgeting from sticker assumptions',
    stressCase: 'winter efficiency drops, traffic-heavy weeks, and mileage spikes',
    thresholdGuidance: 'set a minimum observed MPG floor that triggers route or driving-style adjustments',
    optimizationLevers: 'trip consolidation, speed/idle control, and real-world MPG tracking cadence',
    benchmarkLabel: 'Observed MPG Drift',
    benchmarkRange: '-2 to +3',
    benchmarkUnit: 'MPG vs prior baseline',
    benchmarkNote: 'Useful for spotting efficiency decay early.',
    researchFocus: 'observed MPG methodology and real-world efficiency variance drivers'
  },
  'gas-savings': {
    keyInputs: 'current MPG, target MPG, annual miles, and local fuel-price assumptions',
    decisionGoal: 'estimate upgrade savings and validate realistic payback quality',
    stressCase: 'fuel-price drops, lower-than-expected efficiency gains, and usage changes',
    thresholdGuidance: 'commit only when expected savings survive conservative fuel-price and mileage cases',
    optimizationLevers: 'efficiency upgrade prioritization, usage smoothing, and periodic payback recalibration',
    benchmarkLabel: 'Annual Fuel Savings',
    benchmarkRange: '$150 - $1,800+',
    benchmarkUnit: 'per year',
    benchmarkNote: 'Supports upgrade and retrofit screening.',
    researchFocus: 'fuel-savings payback modeling and efficiency-upgrade sensitivity testing'
  },
  'hybrid-savings': {
    keyInputs: 'hybrid price premium, fuel delta, mileage profile, and non-fuel ownership deltas',
    decisionGoal: 'test whether hybrid premium recovery is achievable in your driving pattern',
    stressCase: 'lower annual miles, fuel-price softness, and smaller efficiency spread',
    thresholdGuidance: 'select hybrid only when premium recovery fits your ownership horizon and risk tolerance',
    optimizationLevers: 'horizon-based model selection, total-cost normalization, and insurance/maintenance netting',
    benchmarkLabel: 'Hybrid Premium Payback',
    benchmarkRange: '2 - 9+',
    benchmarkUnit: 'years',
    benchmarkNote: 'Shorter payback windows improve decision resilience.',
    researchFocus: 'hybrid premium recovery analysis and total-ownership delta validation'
  },
  mpg: {
    keyInputs: 'city/highway efficiency, weighted drive mix, and annual demand assumptions',
    decisionGoal: 'compute effective MPG for realistic cost-per-mile planning',
    stressCase: 'city-share increases, route pattern changes, and seasonal efficiency drag',
    thresholdGuidance: 'maintain cost-per-mile thresholds tied to weighted MPG rather than brochure values',
    optimizationLevers: 'drive-mix management, maintenance discipline, and fuel-quality consistency',
    benchmarkLabel: 'Weighted MPG Band',
    benchmarkRange: '18 - 42+',
    benchmarkUnit: 'effective MPG',
    benchmarkNote: 'Captures blended efficiency under your actual route profile.',
    researchFocus: 'weighted MPG modeling and route-mix-adjusted fuel planning'
  },
  octane: {
    keyInputs: 'regular vs premium pricing spread, measurable MPG gain, and annual mileage',
    decisionGoal: 'determine if premium fuel economics are justified for your use case',
    stressCase: 'wider pump spreads, negligible MPG gains, and high-mileage periods',
    thresholdGuidance: 'use premium only when cost-per-mile remains favorable after verified real-world gains',
    optimizationLevers: 'station spread tracking, A/B fuel logs, and manufacturer requirement alignment',
    benchmarkLabel: 'Octane Break-even Gain',
    benchmarkRange: '2% - 8%+',
    benchmarkUnit: 'MPG improvement needed',
    benchmarkNote: 'Shows required efficiency gain for premium to pay off.',
    researchFocus: 'octane cost-per-mile economics and break-even efficiency improvement analysis'
  },
  'trip-fuel': {
    keyInputs: 'trip distance, effective MPG, fuel price, tank capacity, and return-trip assumptions',
    decisionGoal: 'plan fuel budget and refuel strategy before long or variable-distance trips',
    stressCase: 'headwind/elevation effects, detours, and higher-than-expected consumption',
    thresholdGuidance: 'carry buffer stops and contingency budget when projected range margin is thin',
    optimizationLevers: 'route-aware refuel planning, buffer range policy, and pre-trip efficiency checks',
    benchmarkLabel: 'Range Safety Buffer',
    benchmarkRange: '10% - 25%',
    benchmarkUnit: 'of usable tank range',
    benchmarkNote: 'Protects against route and condition volatility.',
    researchFocus: 'trip fuel forecasting, range-risk management, and stop optimization'
  }
};

const defaultInputs: Inputs = {
  annualMiles: '15000',
  fuelPrice: '3.65',
  tripDistance: '180',
  gallonsUsed: '6.5',
  mpgCurrent: '27',
  mpgAlternative: '34',
  cityMpg: '24',
  highwayMpg: '33',
  cityDrivingPercent: '50',
  includeReturnTrip: true,
  tankCapacity: '16',
  regularPrice: '3.45',
  premiumPrice: '4.05',
  premiumMpgGainPercent: '3',
  hybridPricePremium: '4200',
  annualMaintenanceSavings: '280',
  annualInsuranceDelta: '-120',
  annualFuelPriceGrowthPercent: '3',
  annualMilesGrowthPercent: '1',
  planningYears: '5'
};

const parseNonNegative = (value: string): number => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

const formatMetric = (kpi: KPI): string => {
  const decimals = kpi.decimals ?? 2;
  const core = kpi.value.toFixed(decimals);
  if (kpi.isCurrency) {
    return `$${core}${kpi.suffix ?? ''}`;
  }
  return `${core}${kpi.suffix ?? ''}`;
};

const findLargestDriver = (entries: Array<[string, number]>): string => {
  return [...entries].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0][0];
};

const buildFaqItems = (variant: FuelSuiteVariant): FAQItem[] => {
  const common: FAQItem[] = [
    {
      question: 'Why should I avoid using only one input snapshot for decisions?',
      answer: 'Single-input snapshots can hide volatility. Use scenario ranges and periodic updates for more reliable planning.',
      category: 'Planning'
    },
    {
      question: 'How often should assumptions be updated?',
      answer: 'Quarterly is a practical minimum, with monthly refreshes during high fuel-price volatility.',
      category: 'Workflow'
    },
    {
      question: 'Can this be used for household budgeting?',
      answer: 'Yes. The tool provides annual and multi-year estimates to support budget planning and variance checks.',
      category: 'Budgeting'
    }
  ];

  const byVariant: Record<FuelSuiteVariant, FAQItem[]> = {
    'gas-mileage': [
      {
        question: 'How is gas mileage calculated?',
        answer: 'Observed MPG is computed as miles driven divided by gallons used over the same period.',
        category: 'Formula'
      },
      {
        question: 'Why is observed MPG better than sticker MPG for budgeting?',
        answer: 'Observed MPG reflects your actual route, driving behavior, weather, and load conditions.',
        category: 'Accuracy'
      },
      {
        question: 'What causes MPG to drift month to month?',
        answer: 'Traffic, weather, tire pressure, route mix, and idle time can all shift realized MPG.',
        category: 'Variance'
      },
      {
        question: 'How many fill cycles should I track?',
        answer: 'At least 2 to 4 complete fill cycles provide a more stable baseline than one trip.',
        category: 'Method'
      },
      {
        question: 'Should I include idle fuel in MPG analysis?',
        answer: 'Yes for urban and stop-and-go usage, because idling consumes fuel without adding miles.',
        category: 'Method'
      },
      {
        question: 'How does MPG affect annual cost?',
        answer: 'Small MPG changes can materially impact annual fuel spend, especially at higher annual mileage.',
        category: 'Cost'
      },
      {
        question: 'What is a good way to reduce fuel cost per mile?',
        answer: 'Improve route efficiency, minimize aggressive acceleration, and keep maintenance current.',
        category: 'Optimization'
      }
    ],
    'gas-savings': [
      {
        question: 'How are annual gas savings calculated?',
        answer: 'Annual savings are estimated from the difference between baseline and improved annual fuel costs.',
        category: 'Formula'
      },
      {
        question: 'Do higher annual miles increase savings potential?',
        answer: 'Yes. More miles generally amplify fuel-efficiency savings and shorten payback periods.',
        category: 'Sensitivity'
      },
      {
        question: 'Can fuel-price drops eliminate savings?',
        answer: 'Fuel-price declines can reduce dollar savings, which is why scenario testing is important.',
        category: 'Risk'
      },
      {
        question: 'Is MPG improvement alone enough for final decisions?',
        answer: 'No. Include maintenance, insurance, and financing impacts for full ownership decisions.',
        category: 'Total Cost'
      },
      {
        question: 'What is a realistic savings validation method?',
        answer: 'Track fuel receipts and odometer deltas monthly, then compare against baseline assumptions.',
        category: 'Validation'
      },
      {
        question: 'Can this model support fleet fuel programs?',
        answer: 'Yes for planning. Fleet decisions should also include downtime and policy constraints.',
        category: 'Fleet'
      },
      {
        question: 'How should savings be communicated to stakeholders?',
        answer: 'Use scenario bands (conservative/base/stress) rather than a single point estimate.',
        category: 'Reporting'
      }
    ],
    'hybrid-savings': [
      {
        question: 'What does hybrid savings compare?',
        answer: 'It compares gas-vehicle operating cost versus hybrid operating cost plus annual maintenance and insurance assumptions.',
        category: 'Basics'
      },
      {
        question: 'How is payback period estimated?',
        answer: 'Payback is estimated by dividing upfront hybrid premium by annual net savings when savings are positive.',
        category: 'Payback'
      },
      {
        question: 'Can a hybrid save fuel but still cost more?',
        answer: 'Yes. Higher insurance or financing can offset fuel savings depending on your mileage and rates.',
        category: 'Tradeoffs'
      },
      {
        question: 'Why does annual mileage matter for hybrid economics?',
        answer: 'Higher annual mileage tends to improve hybrid payback because fuel savings compound faster.',
        category: 'Mileage'
      },
      {
        question: 'Should maintenance differences be included?',
        answer: 'Yes. Maintenance assumptions are often a major driver in hybrid total-cost comparisons.',
        category: 'Method'
      },
      {
        question: 'How should incentives be treated?',
        answer: 'Include verified incentives only and check eligibility criteria at purchase time.',
        category: 'Incentives'
      },
      {
        question: 'What is a prudent decision process?',
        answer: 'Use annual savings, payback horizon, and scenario risk together before committing.',
        category: 'Decision'
      }
    ],
    mpg: [
      {
        question: 'How is weighted MPG calculated?',
        answer: 'Weighted MPG uses city/highway shares and their MPG values to estimate an effective blended MPG.',
        category: 'Formula'
      },
      {
        question: 'Why not always use combined MPG?',
        answer: 'Combined MPG may misstate costs when your real route profile differs from test assumptions.',
        category: 'Accuracy'
      },
      {
        question: 'How can I improve weighted MPG?',
        answer: 'Focus on traffic-aware routing, smoother speed control, and maintenance consistency.',
        category: 'Optimization'
      },
      {
        question: 'How does weighted MPG affect annual budgeting?',
        answer: 'It improves annual cost estimates by aligning fuel-use assumptions to your actual driving mix.',
        category: 'Budgeting'
      },
      {
        question: 'What if city share changes seasonally?',
        answer: 'Recalculate periodically with updated city/highway mix to maintain planning quality.',
        category: 'Workflow'
      },
      {
        question: 'Can weighted MPG support reimbursement planning?',
        answer: 'It helps estimate internal costs, but reimbursement policy may use other standards.',
        category: 'Business Use'
      },
      {
        question: 'How should I validate MPG assumptions?',
        answer: 'Use multi-tank observed data and compare with modeled assumptions monthly or quarterly.',
        category: 'Validation'
      }
    ],
    octane: [
      {
        question: 'How is octane cost-per-mile compared?',
        answer: 'Cost per mile is compared using fuel price and effective MPG for each fuel grade assumption.',
        category: 'Formula'
      },
      {
        question: 'When can premium fuel make economic sense?',
        answer: 'Only when performance or efficiency gains offset higher per-gallon premium pricing.',
        category: 'Economics'
      },
      {
        question: 'Does premium always improve MPG?',
        answer: 'No. MPG impact varies by engine design, tuning, and operating conditions.',
        category: 'Performance'
      },
      {
        question: 'How should I estimate MPG gain assumptions?',
        answer: 'Use conservative assumptions and validate with controlled real-world measurement.',
        category: 'Method'
      },
      {
        question: 'Can octane choice affect annual budget materially?',
        answer: 'Yes, especially at higher annual mileage and larger price spreads between fuel grades.',
        category: 'Budgeting'
      },
      {
        question: 'Should manufacturer fuel recommendations be ignored?',
        answer: 'No. Follow manufacturer guidance first, then evaluate economics where choices are allowed.',
        category: 'Safety'
      },
      {
        question: 'What is a practical octane decision workflow?',
        answer: 'Validate fuel-grade compatibility, measure observed MPG impact, then compare annual cost deltas.',
        category: 'Decision'
      }
    ],
    'trip-fuel': [
      {
        question: 'How is trip fuel cost estimated?',
        answer: 'Trip fuel cost is estimated from trip miles divided by MPG, multiplied by fuel price per gallon.',
        category: 'Formula'
      },
      {
        question: 'Why include return distance?',
        answer: 'Round-trip planning prevents underestimation when both outbound and return segments are expected.',
        category: 'Planning'
      },
      {
        question: 'How are fuel stops estimated?',
        answer: 'Stops are estimated from trip fuel demand relative to tank capacity, adjusted for reserve strategy.',
        category: 'Logistics'
      },
      {
        question: 'What can distort trip fuel estimates?',
        answer: 'Traffic, speed, elevation, weather, and load changes can materially shift realized trip fuel use.',
        category: 'Risk'
      },
      {
        question: 'Should I plan with conservative range?',
        answer: 'Yes, especially for routes with uncertain station availability or high congestion risk.',
        category: 'Safety'
      },
      {
        question: 'Can trip planning improve annual budget control?',
        answer: 'Yes. Frequent route-level decisions compound into annual spend outcomes.',
        category: 'Budgeting'
      },
      {
        question: 'What is a best-practice pre-trip check?',
        answer: 'Update fuel price, verify route profile assumptions, and confirm refuel thresholds before departure.',
        category: 'Workflow'
      }
    ]
  };

  return [...byVariant[variant], ...common].slice(0, 10);
};

const AdvancedFuelSuiteCalculator = ({ variant }: AdvancedFuelSuiteCalculatorProps) => {
  const config = VARIANT_CONFIG[variant];
  const narrative = FUEL_VARIANT_NARRATIVE[variant];
  const topic = config.topicLabel;
  const topicLower = topic.toLowerCase();
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const [inputs, setInputs] = useState<Inputs>(defaultInputs);

  const handleInputChange = (field: keyof Inputs, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const modeLabel = useMemo(() => {
    if (variant === 'trip-fuel') return 'Trip Mode - Segment cost and stop planning';
    if (variant === 'octane') return 'Fuel Grade Mode - Cost per mile and break-even';
    if (variant === 'hybrid-savings') return 'Ownership Mode - Annual savings and payback';
    if (variant === 'gas-savings') return 'Savings Mode - Baseline vs improved efficiency';
    if (variant === 'mpg') return 'Efficiency Mode - Weighted MPG planning';
    return 'Mileage Mode - Observed MPG and budget view';
  }, [variant]);

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const fuelPrice = parseNonNegative(inputs.fuelPrice);
    const tripDistance = parseNonNegative(inputs.tripDistance);
    const gallonsUsed = Math.max(0.0001, parseNonNegative(inputs.gallonsUsed));
    const mpgCurrent = Math.max(1, parseNonNegative(inputs.mpgCurrent));
    const mpgAlternative = Math.max(1, parseNonNegative(inputs.mpgAlternative));
    const cityMpg = Math.max(1, parseNonNegative(inputs.cityMpg));
    const highwayMpg = Math.max(1, parseNonNegative(inputs.highwayMpg));
    const cityDrivingPercent = Math.min(100, parseNonNegative(inputs.cityDrivingPercent));
    const cityShare = cityDrivingPercent / 100;
    const highwayShare = 1 - cityShare;
    const includeReturnTrip = inputs.includeReturnTrip;
    const tankCapacity = Math.max(0, parseNonNegative(inputs.tankCapacity));
    const regularPrice = parseNonNegative(inputs.regularPrice);
    const premiumPrice = parseNonNegative(inputs.premiumPrice);
    const premiumMpgGainPercent = parseNonNegative(inputs.premiumMpgGainPercent);
    const hybridPricePremium = parseNonNegative(inputs.hybridPricePremium);
    const annualMaintenanceSavings = parseNonNegative(inputs.annualMaintenanceSavings);
    const annualInsuranceDelta = parseFloat(inputs.annualInsuranceDelta) || 0;
    const annualFuelPriceGrowthPercent = parseNonNegative(inputs.annualFuelPriceGrowthPercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parseNonNegative(inputs.planningYears));

    let primaryLabel = 'Primary Result';
    let primaryValue = 0;
    let primaryIsCurrency = false;
    let primarySuffix: string | undefined;
    let kpis: KPI[] = [];
    let breakdown: BreakdownItem[] = [];
    let scenarios: Scenario[] = [];

    let annualCostForProjection = 0;
    let largestDriver = 'Fuel Cost';

    if (variant === 'gas-mileage') {
      const observedMpg = tripDistance > 0 ? tripDistance / gallonsUsed : mpgCurrent;
      const annualFuelCost = annualMiles / Math.max(1, observedMpg) * fuelPrice;
      const costPerMile = fuelPrice / Math.max(1, observedMpg);
      const annualGallons = annualMiles / Math.max(1, observedMpg);

      primaryLabel = 'Observed MPG';
      primaryValue = observedMpg;
      primaryIsCurrency = false;
      primarySuffix = ' mpg';

      kpis = [
        { label: 'Annual Fuel Cost', value: annualFuelCost, isCurrency: true },
        { label: 'Cost Per Mile', value: costPerMile, isCurrency: true, decimals: 3 },
        { label: 'Annual Gallons', value: annualGallons, decimals: 1, suffix: ' gal' },
        { label: 'Monthly Fuel Cost', value: annualFuelCost / 12, isCurrency: true }
      ];

      breakdown = [
        { label: 'Fuel Spend', value: annualFuelCost, icon: Fuel, color: 'bg-blue-500' },
        { label: 'Mileage Demand', value: annualMiles, icon: Route, color: 'bg-emerald-500' },
        { label: 'Price Effect', value: fuelPrice * 100, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        {
          label: 'Fuel Price +20%',
          value: annualFuelCost * 1.2,
          notes: 'Stress case for fuel-price spikes.'
        },
        {
          label: 'MPG -10%',
          value: annualMiles / Math.max(1, observedMpg * 0.9) * fuelPrice,
          notes: 'Efficiency downside case under adverse conditions.'
        },
        {
          label: 'Annual Miles +15%',
          value: annualFuelCost * 1.15,
          notes: 'Higher utilization demand case.'
        },
        {
          label: 'MPG +12%',
          value: annualMiles / Math.max(1, observedMpg * 1.12) * fuelPrice,
          notes: 'Improved efficiency case via route/behavior optimization.'
        }
      ];

      annualCostForProjection = annualFuelCost;
      largestDriver = findLargestDriver([
        ['Fuel Price', fuelPrice],
        ['Annual Miles', annualMiles],
        ['MPG Assumption', observedMpg]
      ]);
    }

    if (variant === 'mpg') {
      const weightedMpg = 1 / (cityShare / cityMpg + highwayShare / highwayMpg);
      const annualFuelCost = annualMiles / Math.max(1, weightedMpg) * fuelPrice;
      const costPerMile = fuelPrice / Math.max(1, weightedMpg);
      const gallonsPerWeek = annualMiles / Math.max(1, weightedMpg) / 52;

      primaryLabel = 'Weighted MPG';
      primaryValue = weightedMpg;
      primaryIsCurrency = false;
      primarySuffix = ' mpg';

      kpis = [
        { label: 'Annual Fuel Cost', value: annualFuelCost, isCurrency: true },
        { label: 'Cost Per Mile', value: costPerMile, isCurrency: true, decimals: 3 },
        { label: 'Weekly Gallons', value: gallonsPerWeek, decimals: 2, suffix: ' gal' },
        { label: 'Monthly Fuel Cost', value: annualFuelCost / 12, isCurrency: true }
      ];

      breakdown = [
        { label: 'City Share Effect', value: cityDrivingPercent, icon: MapPin, color: 'bg-blue-500' },
        { label: 'Fuel Spend', value: annualFuelCost, icon: Fuel, color: 'bg-emerald-500' },
        { label: 'Efficiency Yield', value: weightedMpg, icon: Gauge, color: 'bg-violet-500' }
      ];

      scenarios = [
        {
          label: 'City Share +20 points',
          value: annualMiles / Math.max(1, 1 / ((Math.min(1, cityShare + 0.2) / cityMpg) + ((1 - Math.min(1, cityShare + 0.2)) / highwayMpg))) * fuelPrice,
          notes: 'More stop-and-go route mix.'
        },
        {
          label: 'Fuel Price +20%',
          value: annualFuelCost * 1.2,
          notes: 'Fuel inflation stress case.'
        },
        {
          label: 'Highway-Heavy Mix (30% city)',
          value: annualMiles / Math.max(1, 1 / ((0.3 / cityMpg) + (0.7 / highwayMpg))) * fuelPrice,
          notes: 'Freeway-biased usage case.'
        },
        {
          label: 'Efficiency +10%',
          value: annualMiles / Math.max(1, weightedMpg * 1.1) * fuelPrice,
          notes: 'Behavior and maintenance optimization case.'
        }
      ];

      annualCostForProjection = annualFuelCost;
      largestDriver = findLargestDriver([
        ['Driving Mix', cityDrivingPercent],
        ['Fuel Price', fuelPrice],
        ['Annual Miles', annualMiles]
      ]);
    }

    if (variant === 'trip-fuel') {
      const tripMiles = includeReturnTrip ? tripDistance * 2 : tripDistance;
      const tripGallons = tripMiles / Math.max(1, mpgCurrent);
      const tripCost = tripGallons * fuelPrice;
      const rangePerTank = tankCapacity * Math.max(1, mpgCurrent);
      const estimatedStops = tankCapacity > 0 ? Math.max(0, Math.ceil(tripGallons / tankCapacity) - 1) : 0;
      const annualFuelCost = annualMiles / Math.max(1, mpgCurrent) * fuelPrice;

      primaryLabel = 'Trip Fuel Cost';
      primaryValue = tripCost;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Trip Distance Used', value: tripMiles, decimals: 1, suffix: ' mi' },
        { label: 'Trip Gallons', value: tripGallons, decimals: 2, suffix: ' gal' },
        { label: 'Estimated Fuel Stops', value: estimatedStops, decimals: 0, suffix: ' stops' },
        { label: 'Range per Tank', value: rangePerTank, decimals: 1, suffix: ' mi' }
      ];

      breakdown = [
        { label: 'Trip Cost', value: tripCost, icon: Fuel, color: 'bg-blue-500' },
        { label: 'Distance Load', value: tripMiles, icon: Route, color: 'bg-emerald-500' },
        { label: 'Fuel Stop Pressure', value: estimatedStops + 1, icon: MapPin, color: 'bg-violet-500' }
      ];

      scenarios = [
        {
          label: 'Traffic Case (MPG -15%)',
          value: (tripMiles / Math.max(1, mpgCurrent * 0.85)) * fuelPrice,
          notes: 'Congestion and stop-and-go downside case.'
        },
        {
          label: 'Highway Smooth Case (MPG +10%)',
          value: (tripMiles / Math.max(1, mpgCurrent * 1.1)) * fuelPrice,
          notes: 'Steady-speed highway case.'
        },
        {
          label: 'Fuel Price +20%',
          value: tripCost * 1.2,
          notes: 'Fuel-price shock case.'
        },
        {
          label: 'Shorter Route (-12%)',
          value: ((tripMiles * 0.88) / Math.max(1, mpgCurrent)) * fuelPrice,
          notes: 'Route-optimization case.'
        }
      ];

      annualCostForProjection = annualFuelCost;
      largestDriver = findLargestDriver([
        ['Trip Distance', tripMiles],
        ['Fuel Price', fuelPrice],
        ['MPG', mpgCurrent]
      ]);
    }

    if (variant === 'gas-savings') {
      const annualCostCurrent = annualMiles / Math.max(1, mpgCurrent) * fuelPrice;
      const annualCostImproved = annualMiles / Math.max(1, mpgAlternative) * fuelPrice;
      const annualSavings = annualCostCurrent - annualCostImproved;
      const gallonsSaved = annualMiles / Math.max(1, mpgCurrent) - annualMiles / Math.max(1, mpgAlternative);

      primaryLabel = 'Annual Gas Savings';
      primaryValue = annualSavings;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Monthly Savings', value: annualSavings / 12, isCurrency: true },
        { label: 'Annual Gallons Saved', value: gallonsSaved, decimals: 1, suffix: ' gal' },
        { label: 'Current Annual Fuel Cost', value: annualCostCurrent, isCurrency: true },
        { label: 'Improved Annual Fuel Cost', value: annualCostImproved, isCurrency: true }
      ];

      breakdown = [
        { label: 'Fuel Savings', value: Math.abs(annualSavings), icon: TrendingDown, color: 'bg-blue-500' },
        { label: 'Efficiency Gap', value: Math.abs(mpgAlternative - mpgCurrent), icon: Gauge, color: 'bg-emerald-500' },
        { label: 'Price Exposure', value: fuelPrice * 100, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        {
          label: 'Fuel Price +20%',
          value: annualMiles / Math.max(1, mpgCurrent) * fuelPrice * 1.2 - annualMiles / Math.max(1, mpgAlternative) * fuelPrice * 1.2,
          notes: 'High-price market case.'
        },
        {
          label: 'Annual Miles +20%',
          value: annualSavings * 1.2,
          notes: 'Higher utilization case.'
        },
        {
          label: 'Efficiency Gap Narrows 30%',
          value: annualMiles / Math.max(1, mpgCurrent) * fuelPrice - annualMiles / Math.max(1, mpgCurrent + (mpgAlternative - mpgCurrent) * 0.7) * fuelPrice,
          notes: 'Conservative improvement case.'
        },
        {
          label: 'Efficiency Gap Widens 20%',
          value: annualMiles / Math.max(1, mpgCurrent) * fuelPrice - annualMiles / Math.max(1, mpgCurrent + (mpgAlternative - mpgCurrent) * 1.2) * fuelPrice,
          notes: 'Higher-performance improvement case.'
        }
      ];

      annualCostForProjection = annualCostImproved;
      largestDriver = findLargestDriver([
        ['MPG Improvement', mpgAlternative - mpgCurrent],
        ['Annual Miles', annualMiles],
        ['Fuel Price', fuelPrice]
      ]);
    }

    if (variant === 'hybrid-savings') {
      const annualCostGas = annualMiles / Math.max(1, mpgCurrent) * fuelPrice;
      const annualCostHybridFuel = annualMiles / Math.max(1, mpgAlternative) * fuelPrice;
      const annualCostHybrid = annualCostHybridFuel - annualMaintenanceSavings + annualInsuranceDelta;
      const annualSavings = annualCostGas - annualCostHybrid;
      const breakEvenYears = annualSavings > 0 ? hybridPricePremium / annualSavings : null;

      primaryLabel = 'Annual Hybrid Savings';
      primaryValue = annualSavings;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Gas Vehicle Annual Cost', value: annualCostGas, isCurrency: true },
        { label: 'Hybrid Annual Cost', value: annualCostHybrid, isCurrency: true },
        { label: 'Upfront Premium', value: hybridPricePremium, isCurrency: true },
        { label: 'Estimated Payback', value: breakEvenYears ?? 0, decimals: 1, suffix: breakEvenYears ? ' yrs' : ' not reached' }
      ];

      breakdown = [
        { label: 'Fuel Cost Gap', value: Math.abs(annualCostGas - annualCostHybridFuel), icon: Fuel, color: 'bg-blue-500' },
        { label: 'Maintenance Delta', value: Math.abs(annualMaintenanceSavings), icon: Wrench, color: 'bg-emerald-500' },
        { label: 'Insurance Delta', value: Math.abs(annualInsuranceDelta), icon: Shield, color: 'bg-violet-500' },
        { label: 'Upfront Premium', value: hybridPricePremium, icon: Wallet, color: 'bg-rose-500' }
      ];

      scenarios = [
        {
          label: 'Fuel Price +20%',
          value: (annualMiles / Math.max(1, mpgCurrent) * fuelPrice * 1.2) - ((annualMiles / Math.max(1, mpgAlternative) * fuelPrice * 1.2) - annualMaintenanceSavings + annualInsuranceDelta),
          notes: 'Fuel volatility stress case.'
        },
        {
          label: 'Lower Annual Miles (-25%)',
          value: (annualCostGas * 0.75) - ((annualCostHybridFuel * 0.75) - annualMaintenanceSavings + annualInsuranceDelta),
          notes: 'Lower-utilization case.'
        },
        {
          label: 'Maintenance Savings Cut 40%',
          value: annualCostGas - (annualCostHybridFuel - annualMaintenanceSavings * 0.6 + annualInsuranceDelta),
          notes: 'Conservative service-cost assumption case.'
        },
        {
          label: 'Insurance Delta Worsens +$250',
          value: annualCostGas - (annualCostHybridFuel - annualMaintenanceSavings + annualInsuranceDelta + 250),
          notes: 'Quote downside risk case.'
        }
      ];

      annualCostForProjection = annualCostHybrid;
      largestDriver = findLargestDriver([
        ['Fuel Savings', annualCostGas - annualCostHybridFuel],
        ['Maintenance Savings', annualMaintenanceSavings],
        ['Insurance Delta', annualInsuranceDelta],
        ['Upfront Premium', hybridPricePremium]
      ]);
    }

    if (variant === 'octane') {
      const effectivePremiumMpg = mpgCurrent * (1 + premiumMpgGainPercent / 100);
      const costPerMileRegular = regularPrice / Math.max(1, mpgCurrent);
      const costPerMilePremium = premiumPrice / Math.max(1, effectivePremiumMpg);
      const annualCostRegular = annualMiles * costPerMileRegular;
      const annualCostPremium = annualMiles * costPerMilePremium;
      const annualSavings = annualCostRegular - annualCostPremium;
      const premiumBreakEvenPrice = regularPrice * (effectivePremiumMpg / Math.max(1, mpgCurrent));

      primaryLabel = 'Annual Savings vs Regular';
      primaryValue = annualSavings;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Regular Cost per Mile', value: costPerMileRegular, isCurrency: true, decimals: 3 },
        { label: 'Premium Cost per Mile', value: costPerMilePremium, isCurrency: true, decimals: 3 },
        { label: 'Premium MPG Assumption', value: effectivePremiumMpg, decimals: 2, suffix: ' mpg' },
        { label: 'Premium Break-even Price', value: premiumBreakEvenPrice, isCurrency: true }
      ];

      breakdown = [
        { label: 'Price Spread', value: Math.abs(premiumPrice - regularPrice), icon: DollarSign, color: 'bg-blue-500' },
        { label: 'MPG Gain Assumption', value: premiumMpgGainPercent, icon: Gauge, color: 'bg-emerald-500' },
        { label: 'Annual Cost Delta', value: Math.abs(annualSavings), icon: TrendingDown, color: 'bg-violet-500' }
      ];

      scenarios = [
        {
          label: 'MPG Gain = 0%',
          value: annualMiles * (regularPrice / Math.max(1, mpgCurrent) - premiumPrice / Math.max(1, mpgCurrent)),
          notes: 'No performance benefit case.'
        },
        {
          label: 'Premium Price +15%',
          value: annualMiles * (costPerMileRegular - ((premiumPrice * 1.15) / Math.max(1, effectivePremiumMpg))),
          notes: 'Higher premium-price spread case.'
        },
        {
          label: 'MPG Gain +50%',
          value: annualMiles * (costPerMileRegular - (premiumPrice / Math.max(1, mpgCurrent * (1 + (premiumMpgGainPercent * 1.5) / 100)))),
          notes: 'Higher performance gain case.'
        },
        {
          label: 'Annual Miles +20%',
          value: annualSavings * 1.2,
          notes: 'Higher utilization case.'
        }
      ];

      annualCostForProjection = annualCostPremium;
      largestDriver = findLargestDriver([
        ['Price Spread', premiumPrice - regularPrice],
        ['MPG Gain Assumption', premiumMpgGainPercent],
        ['Annual Miles', annualMiles]
      ]);
    }

    const projectionRows: ProjectionRow[] = [];
    let projectedMiles = annualMiles;
    let projectedFuelPrice = fuelPrice;

    for (let year = 1; year <= planningYears; year++) {
      const projectedAnnualCost = annualCostForProjection * (projectedMiles / Math.max(1, annualMiles || 1)) * (projectedFuelPrice / Math.max(0.0001, fuelPrice || 0.0001));
      projectionRows.push({
        year,
        annualMiles: projectedMiles,
        fuelPrice: projectedFuelPrice,
        annualCost: projectedAnnualCost
      });
      projectedMiles *= 1 + annualMilesGrowthPercent / 100;
      projectedFuelPrice *= 1 + annualFuelPriceGrowthPercent / 100;
    }

    const recommendations = [
      `${config.title} currently indicates ${config.focusLabel} as the key decision driver under your assumptions.`,
      `Largest driver identified: ${largestDriver}. Prioritize validating this input first for decision quality.`,
      'Use conservative, expected, and stress scenarios before making spend or purchase commitments.',
      'Update assumptions quarterly or after major changes in fuel prices, mileage, or vehicle usage pattern.',
      'Keep a rolling log of observed MPG and fuel receipts to improve model calibration.'
    ];

    const warningsAndConsiderations = [
      'This tool is a planning model and not a guarantee of realized outcomes.',
      'Real-world results vary with route profile, traffic, weather, load, maintenance, and driving behavior.',
      'Single-trip or short-window assumptions can produce noisy outputs; use repeated observations where possible.',
      'For tax, legal, or policy-specific decisions, verify requirements from official sources before action.'
    ];

    const nextSteps = [
      'Capture observed data for at least 2-4 fuel cycles and rerun the calculator.',
      'Review scenario outputs and choose a planning baseline plus downside buffer.',
      'Set monthly checkpoints for fuel price and variance from expected cost.',
      'Recalculate before long trips, purchase decisions, or policy changes.',
      'Document assumptions used in decisions for future comparison and adjustment.'
    ];

    setResult({
      primaryLabel,
      primaryValue,
      primaryIsCurrency,
      primarySuffix,
      kpis,
      breakdown,
      scenarios,
      projectionRows,
      largestDriver,
      recommendations,
      warningsAndConsiderations,
      nextSteps
    });

    setShowModal(true);
  };

  const reset = () => {
    setInputs(defaultInputs);
    setResult(null);
    setShowModal(false);
  };

  const faqItems = useMemo(() => buildFaqItems(variant), [variant]);

  return (
    <div className="w-full space-y-8">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? `${modeLabel}; includes scenarios, projections, and decision-grade guidance`
                : 'Core assumptions only for quick initial estimate'}
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
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center justify-between"
            >
              <span className="font-medium">{modeLabel}</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">
                Advanced mode uses risk-aware assumptions, scenario deltas, and projection outputs. Collapse this panel if you only need quick baseline estimates.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Annual Miles</label>
            <input type="number" min="0" value={inputs.annualMiles} onChange={(e) => handleInputChange('annualMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gal)</label>
            <input type="number" min="0" step="0.01" value={inputs.fuelPrice} onChange={(e) => handleInputChange('fuelPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Planning Horizon (years)</label>
            <input type="number" min="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
        </div>

        {(variant === 'gas-mileage' || variant === 'trip-fuel') && (
          <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Distance and Fuel Use Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Trip Distance (miles)</label>
                <input type="number" min="0" value={inputs.tripDistance} onChange={(e) => handleInputChange('tripDistance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gallons Used</label>
                <input type="number" min="0" step="0.01" value={inputs.gallonsUsed} onChange={(e) => handleInputChange('gallonsUsed', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">MPG Assumption</label>
                <input type="number" min="1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <label className="flex items-start gap-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-background">
                <input type="checkbox" checked={inputs.includeReturnTrip} onChange={(e) => handleInputChange('includeReturnTrip', e.target.checked)} className="mt-1" />
                <span className="text-sm">
                  <strong>Include Return Trip</strong>
                  <br />
                  Doubles segment distance for round-trip planning.
                </span>
              </label>
            </div>
          </div>
        )}

        {variant === 'mpg' && (
          <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Weighted MPG Inputs
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Combined MPG (reference)</label>
                <input type="number" min="1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          </div>
        )}

        {(variant === 'gas-savings' || variant === 'hybrid-savings') && (
          <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
            <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Baseline vs Alternative Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current MPG</label>
                <input type="number" min="1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Alternative MPG</label>
                <input type="number" min="1" value={inputs.mpgAlternative} onChange={(e) => handleInputChange('mpgAlternative', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gal)</label>
                <input type="number" min="0" step="0.01" value={inputs.fuelPrice} onChange={(e) => handleInputChange('fuelPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              {variant === 'hybrid-savings' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Hybrid Premium ($)</label>
                    <input type="number" min="0" value={inputs.hybridPricePremium} onChange={(e) => handleInputChange('hybridPricePremium', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Maintenance Savings ($/yr)</label>
                    <input type="number" min="0" value={inputs.annualMaintenanceSavings} onChange={(e) => handleInputChange('annualMaintenanceSavings', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Insurance Delta ($/yr)</label>
                    <input type="number" step="0.01" value={inputs.annualInsuranceDelta} onChange={(e) => handleInputChange('annualInsuranceDelta', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {variant === 'octane' && (
          <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
            <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Regular vs Premium Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Regular Price ($/gal)</label>
                <input type="number" min="0" step="0.01" value={inputs.regularPrice} onChange={(e) => handleInputChange('regularPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Premium Price ($/gal)</label>
                <input type="number" min="0" step="0.01" value={inputs.premiumPrice} onChange={(e) => handleInputChange('premiumPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Baseline MPG</label>
                <input type="number" min="1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Premium MPG Gain (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.premiumMpgGainPercent} onChange={(e) => handleInputChange('premiumMpgGainPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          </div>
        )}

        {variant === 'trip-fuel' && (
          <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
            <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trip Logistics Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tank Capacity (gal)</label>
                <input type="number" min="0" step="0.1" value={inputs.tankCapacity} onChange={(e) => handleInputChange('tankCapacity', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">MPG Assumption</label>
                <input type="number" min="1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gal)</label>
                <input type="number" min="0" step="0.01" value={inputs.fuelPrice} onChange={(e) => handleInputChange('fuelPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          </div>
        )}

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Projection Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Fuel Price Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualFuelPriceGrowthPercent} onChange={(e) => handleInputChange('annualFuelPriceGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Miles Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualMilesGrowthPercent} onChange={(e) => handleInputChange('annualMilesGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Planning Horizon (years)</label>
                <input type="number" min="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={calculate} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Calculator className="h-4 w-4 mr-2" />
            {config.calculateButtonLabel}
          </button>

          <button onClick={reset} className="inline-flex items-center px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
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
            <p className="text-muted-foreground mt-1">Advanced U.S. planning tool focused on {config.focusLabel}</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This {config.topicLabel.toLowerCase()} calculator is built for practical U.S. planning decisions and combines {narrative.keyInputs}
          with scenario analysis and projection modeling.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          The objective is to {narrative.decisionGoal}. The workflow supports repeat use as prices, mileage, and route patterns change.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Results are delivered in a detailed popup dashboard with KPI summaries, scenario deltas, and next-step actions you can use directly for budgeting and comparisons.
        </p>
        <p className="text-base text-foreground leading-relaxed mt-4">
          The best use pattern is iterative: baseline first, then stress-test {narrative.stressCase}, then lock in rules such as {narrative.thresholdGuidance}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Calculation Modes</h3>
            </div>
            <p className="text-sm text-muted-foreground">Modes are tuned to {config.topicLabel.toLowerCase()} planning and the key inputs: {narrative.keyInputs}.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Comparison Capability</h3>
            </div>
            <p className="text-sm text-muted-foreground">Comparison views are built to help you {narrative.decisionGoal} under realistic constraints.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Assumption Support</h3>
            </div>
            <p className="text-sm text-muted-foreground">Assumptions are stress-tested around {narrative.stressCase} instead of a single baseline.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Advanced Output Depth</h3>
            </div>
            <p className="text-sm text-muted-foreground">Outputs enforce planning discipline through {narrative.thresholdGuidance} and next-step actions.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario + Projection Modeling</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Decision Guidance</span>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-5xl bg-background border rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                {config.title} Results and Detailed Calculations
              </h3>
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded-lg text-sm hover:bg-accent">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-4 border bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{result.primaryLabel}</p>
                <p className="text-2xl font-bold text-foreground">
                  {result.primaryIsCurrency ? `$${result.primaryValue.toFixed(2)}` : `${result.primaryValue.toFixed(2)}${result.primarySuffix ?? ''}`}
                </p>
              </div>
              {result.kpis.slice(0, 3).map((kpi) => (
                <div key={kpi.label} className="p-4 border bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{formatMetric(kpi)}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">Largest driver: <strong>{result.largestDriver}</strong></p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">This driver should be validated first because it has the greatest impact on your output sensitivity.</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Breakdown
              </h4>
              <div className="space-y-4">
                {result.breakdown.map((entry) => {
                  const Icon = entry.icon;
                  const max = Math.max(...result.breakdown.map((i) => Math.abs(i.value)), 1);
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
                        <div className={cn('h-full', entry.color)} style={{ width: `${(Math.abs(entry.value) / max) * 100}%` }} />
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
                {result.scenarios.map((scenario) => (
                  <div key={scenario.label} className="p-3 rounded-lg bg-background border border-cyan-200 dark:border-cyan-700">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{scenario.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{scenario.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${scenario.value.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">scenario output</p>
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
                      <th className="text-left py-2">Annual Output</th>
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
          How to Use This Free Online {config.title}
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5" />
            {topic} Step-by-Step Guide
          </h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Set your {topicLower} baseline inputs</h4>
              Enter realistic mileage, fuel prices, and variant-specific assumptions to establish a reliable starting point.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Add {topicLower} fuel and efficiency details</h4>
              Focus on {narrative.keyInputs} and prefer observed values over brochure assumptions.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Configure advanced {topicLower} controls</h4>
              Activate advanced assumptions such as mix effects, deltas, and planning horizon for stronger decision context.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Run initial {topicLower} baseline calculation</h4>
              Generate a baseline result first before evaluating upside and downside scenarios.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Evaluate {topicLower} scenarios and projections</h4>
              Review scenario outputs focused on {narrative.stressCase} to test robustness.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Convert {topicLower} insights into actions</h4>
              Apply recommendations, enforce {narrative.thresholdGuidance}, and rerun when assumptions move materially.
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your {topic} Results Dashboard (Popup Only)
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Target className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Primary KPI</h4>
                <p className="text-xs text-muted-foreground">Highlights the core decision metric for this tool variant.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Supporting Metrics</h4>
                <p className="text-xs text-muted-foreground">Displays companion indicators needed to interpret the primary result correctly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Scenario Deltas</h4>
                <p className="text-xs text-muted-foreground">Compares upside/downside cases to reveal sensitivity and planning risk.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><BookOpen className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Projection Table</h4>
                <p className="text-xs text-muted-foreground">Provides a year-by-year planning view under your growth assumptions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This {topic} Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />{topic} Decision-Grade Estimation</h4>
              <p className="text-xs text-muted-foreground">Built to {narrative.decisionGoal} using structured modeling instead of one-line estimates.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />{topic} Risk Visibility</h4>
              <p className="text-xs text-muted-foreground">Risk blocks are tailored to {narrative.stressCase} and market-usage volatility.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Wallet className="h-4 w-4" />{topic} Budget Alignment</h4>
              <p className="text-xs text-muted-foreground">Links model output to enforceable limits, including {narrative.thresholdGuidance}.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />{topic} Actionable Next Steps</h4>
              <p className="text-xs text-muted-foreground">Highlights practical levers: {narrative.optimizationLevers}.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            {topic} Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Variant-specific formulas focused on {narrative.keyInputs}.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario engine centered on {narrative.stressCase} and trend exposure.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Policy-ready outputs using rules like {narrative.thresholdGuidance}.</span></div>
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {topic} Practical Implementation Playbook
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set {topic} Control Limits</h4>
              <p className="text-xs text-muted-foreground">{narrative.thresholdGuidance} before finalizing a fuel or vehicle decision.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Stress {topic} Price Risk</h4>
              <p className="text-xs text-muted-foreground">Stress-test {narrative.stressCase} to verify the plan survives high-volatility periods.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />{topic} Budget Integration</h4>
              <p className="text-xs text-muted-foreground">Translate annual outputs into monthly buffers and apply {narrative.optimizationLevers}.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />{topic} Recalculation Triggers</h4>
              <p className="text-xs text-muted-foreground">Refresh assumptions tied to {narrative.keyInputs} after route, market, or usage changes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding {topic} Economics
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Fuel className="h-5 w-5" />{topic} Core Concept and Decision Context</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              The core purpose of this calculator is to translate fuel-related assumptions into decision-useful outputs. It focuses on practical
              planning rather than theoretical maximums so users can make grounded choices.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              It is especially useful when your goal is to {narrative.decisionGoal} across multiple years and changing market conditions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Links fuel math to cost and planning outcomes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supports repeatable updates as conditions change.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Turns raw usage data into threshold-ready planning metrics.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Improves decision quality by forcing like-for-like comparisons.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major {topic} Factors That Affect Results</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Results for this tool are especially sensitive to {narrative.keyInputs}; keep these assumptions current to avoid planning drift.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Fuel price level and volatility</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Mileage demand and route profile</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Efficiency assumptions and real-world variance</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Operational deltas (maintenance, insurance, or usage constraints)</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Seasonality, traffic behavior, and idling share in urban routes</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Driver behavior and load effects that shift real-world efficiency</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced {topic} Comparison Logic</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Baseline output starts from {narrative.keyInputs} for this exact tool.</li>
              <li>- Scenario outputs test {narrative.stressCase} under downside and upside assumptions.</li>
              <li>- Projection rows validate whether you can {narrative.decisionGoal} over time.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />{topic} Threshold and Timing Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use threshold rules to define acceptable cost/risk boundaries.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Re-evaluate decisions whenever assumptions move materially.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Prefer conservative assumptions for commitment decisions.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Maintain a planning buffer when uncertainty is elevated.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Set trigger points for vehicle-switch, route-switch, or policy changes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Track realized vs modeled values monthly and update baseline if drift persists.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />{topic} Optimization Levers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Improve assumption quality by tracking {narrative.keyInputs} consistently.</li>
              <li>- Apply threshold control: {narrative.thresholdGuidance}.</li>
              <li>- Implement operational levers: {narrative.optimizationLevers}.</li>
              <li>- Revisit related ownership layers when scenario drift persists.</li>
              <li>- Track monthly variance and recalibrate baseline proactively.</li>
              <li>- Use projection rows to prioritize highest-impact interventions first.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />{topic} Risks and Modeling Limits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Short-term data windows can overfit temporary conditions.</li>
              <li>- Market shocks can invalidate static assumptions quickly.</li>
              <li>- Operational behavior changes can materially alter outcomes.</li>
              <li>- Use model outputs as planning inputs, not guarantees.</li>
              <li>- Retail fuel spreads by neighborhood can materially change realized costs.</li>
              <li>- Weather and seasonal driving patterns can create non-linear monthly variance.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: {config.topicLabel} Planning Benchmarks
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
                <td className="py-3 px-4 font-medium">{config.topicLabel} Focus Driver</td>
                <td className="py-3 px-4">Tool-specific</td>
                <td className="py-3 px-4">input cluster</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.keyInputs}</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{topic} Primary Decision Goal</td>
                <td className="py-3 px-4">Outcome-driven</td>
                <td className="py-3 px-4">planning target</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.decisionGoal}</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{topic} Stress-Case Priority</td>
                <td className="py-3 px-4">Scenario-driven</td>
                <td className="py-3 px-4">downside focus</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.stressCase}</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{topic} Threshold Rule</td>
                <td className="py-3 px-4">Policy-based</td>
                <td className="py-3 px-4">approval logic</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.thresholdGuidance}</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{topic} Optimization Levers</td>
                <td className="py-3 px-4">Execution-driven</td>
                <td className="py-3 px-4">action set</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.optimizationLevers}</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{narrative.benchmarkLabel}</td>
                <td className="py-3 px-4">{narrative.benchmarkRange}</td>
                <td className="py-3 px-4">{narrative.benchmarkUnit}</td>
                <td className="py-3 px-4 text-muted-foreground">{narrative.benchmarkNote}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Benchmark values are for planning context only. Use real receipts, local prices, and observed usage for high-confidence decisions.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Government and Official Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.eia.gov/petroleum/gasdiesel/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. EIA Gasoline and Diesel Prices</a> - market price context</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - fuel economy reference data</li>
              <li>- <a href="https://www.epa.gov/greenvehicles" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA Green Vehicle Resources</a> - emissions and efficiency context</li>
              <li>- <a href="https://www.energy.gov/eere/vehicles" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE Vehicle Technologies Office</a> - vehicle energy policy and efficiency context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.nhtsa.gov/road-safety/fuel-economy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA Fuel Economy Resources</a> - efficiency behavior context</li>
              <li>- <a href="https://afdc.energy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE Alternative Fuels Data Center</a> - transportation fuel references</li>
              <li>- <a href="https://www.epa.gov/automotive-trends" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA Automotive Trends Report</a> - long-term efficiency and emissions trend context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Cost and Market Data Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Context</a> - ownership-cost framing</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. BLS CPI</a> - inflation context for planning assumptions</li>
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - macro trend context for fuel and consumer-price assumptions</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Educational and Community Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/cars</a> - practical driver experiences</li>
              <li>- <a href="https://www.reddit.com/r/personalfinance/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/personalfinance</a> - household transport budgeting discussions</li>
              <li>- <a href="https://www.consumerreports.org/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Consumer Reports Cars</a> - consumer-focused vehicle ownership guidance context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Tool-Specific Research Focus</h3>
            <p className="text-muted-foreground">
              For {config.title}, prioritize references on {narrative.researchFocus} to keep assumptions aligned with this exact decision model.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is intended for {config.referencesFocus}. For this tool, validate assumptions using sources on {narrative.researchFocus}. It is not tax, legal, insurance, or investment advice.
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
        <CalculatorReview calculatorName={config.title} />
      </div>
    </div>
  );
};

export default AdvancedFuelSuiteCalculator;
