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

export type VehicleCostsVariant =
  | 'auto-loan'
  | 'car-depreciation'
  | 'car-insurance'
  | 'car-lease'
  | 'car-payment'
  | 'down-payment'
  | 'early-payoff'
  | 'extended-warranty'
  | 'gap-insurance'
  | 'interest-rate'
  | 'lease-vs-buy'
  | 'refinance'
  | 'registration-fee-estimator'
  | 'total-cost-of-ownership'
  | 'trade-in-value';

interface AdvancedVehicleCostsSuiteCalculatorProps {
  variant: VehicleCostsVariant;
}

interface Inputs {
  vehiclePrice: string;
  downPayment: string;
  tradeInValue: string;
  loanTermMonths: string;
  aprPercent: string;

  currentPaymentMonthly: string;
  remainingTermMonths: string;
  extraPaymentMonthly: string;

  currentLoanBalance: string;
  marketValue: string;
  gapCoveragePercent: string;

  leaseTermMonths: string;
  residualPercent: string;
  moneyFactor: string;
  acquisitionFee: string;

  newAprPercent: string;
  refinanceTermMonths: string;
  refinanceFees: string;

  downPaymentPercent: string;
  targetLtvPercent: string;

  vehicleAgeYears: string;
  annualDepreciationPercent: string;
  annualMileage: string;
  conditionAdjustmentPercent: string;

  annualInsurance: string;
  annualFuel: string;
  annualMaintenance: string;
  annualTaxesAndFees: string;
  annualParkingAndTolls: string;

  registrationBaseFee: string;
  registrationRatePercent: string;

  warrantyCost: string;
  expectedRepairCost: string;
  claimProbabilityPercent: string;

  annualCostInflationPercent: string;
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
  annualCost: number;
  inflationRate: number;
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
}

interface VehicleVariantNarrative {
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

const VARIANT_CONFIG: Record<VehicleCostsVariant, VariantConfig> = {
  'auto-loan': {
    title: 'Auto Loan Calculator',
    subtitle: 'Advanced monthly payment, interest, and affordability modeling',
    calculateButtonLabel: 'Calculate Auto Loan',
    topicLabel: 'Auto Loan',
    focusLabel: 'loan affordability and interest burden'
  },
  'car-depreciation': {
    title: 'Car Depreciation Calculator',
    subtitle: 'Advanced vehicle value decline and equity erosion planning',
    calculateButtonLabel: 'Calculate Depreciation',
    topicLabel: 'Car Depreciation',
    focusLabel: 'value decline, equity timing, and resale strategy'
  },
  'car-insurance': {
    title: 'Car Insurance Calculator',
    subtitle: 'Advanced annual premium and total ownership insurance exposure',
    calculateButtonLabel: 'Calculate Insurance Cost',
    topicLabel: 'Car Insurance',
    focusLabel: 'annual premium pressure and policy-cost sensitivity'
  },
  'car-lease': {
    title: 'Car Lease Calculator',
    subtitle: 'Advanced lease payment and effective cost planning',
    calculateButtonLabel: 'Calculate Lease Cost',
    topicLabel: 'Car Lease',
    focusLabel: 'lease payment structure and effective monthly cost'
  },
  'car-payment': {
    title: 'Car Payment Calculator',
    subtitle: 'Advanced payment, total interest, and affordability guardrails',
    calculateButtonLabel: 'Calculate Car Payment',
    topicLabel: 'Car Payment',
    focusLabel: 'monthly payment affordability and financing risk'
  },
  'down-payment': {
    title: 'Down Payment Calculator',
    subtitle: 'Advanced required down payment and LTV planning',
    calculateButtonLabel: 'Calculate Down Payment',
    topicLabel: 'Down Payment',
    focusLabel: 'required cash upfront and LTV control'
  },
  'early-payoff': {
    title: 'Early Payoff Calculator',
    subtitle: 'Advanced early payoff timeline and interest-savings analysis',
    calculateButtonLabel: 'Calculate Early Payoff',
    topicLabel: 'Early Payoff',
    focusLabel: 'payoff acceleration and interest savings'
  },
  'extended-warranty': {
    title: 'Extended Warranty Calculator',
    subtitle: 'Advanced expected-claim value versus warranty cost tradeoff',
    calculateButtonLabel: 'Calculate Warranty Value',
    topicLabel: 'Extended Warranty',
    focusLabel: 'coverage value versus expected repair exposure'
  },
  'gap-insurance': {
    title: 'Gap Insurance Calculator',
    subtitle: 'Advanced loan-to-value gap and coverage exposure estimate',
    calculateButtonLabel: 'Calculate GAP Exposure',
    topicLabel: 'GAP Insurance',
    focusLabel: 'negative equity risk and gap coverage fit'
  },
  'interest-rate': {
    title: 'Interest Rate Calculator',
    subtitle: 'Advanced implied APR back-solve from payment assumptions',
    calculateButtonLabel: 'Calculate Interest Rate',
    topicLabel: 'Interest Rate',
    focusLabel: 'implied financing rate and payment sensitivity'
  },
  'lease-vs-buy': {
    title: 'Lease vs Buy Calculator',
    subtitle: 'Advanced lease-versus-buy lifecycle cost comparison',
    calculateButtonLabel: 'Compare Lease vs Buy',
    topicLabel: 'Lease vs Buy',
    focusLabel: 'total lifecycle economics of lease versus ownership'
  },
  refinance: {
    title: 'Refinance Calculator',
    subtitle: 'Advanced refinance payment and break-even timeline estimator',
    calculateButtonLabel: 'Calculate Refinance',
    topicLabel: 'Refinance',
    focusLabel: 'refinance break-even timing and net savings'
  },
  'registration-fee-estimator': {
    title: 'Registration Fee Estimator Calculator',
    subtitle: 'Advanced registration fee estimate from value and local rates',
    calculateButtonLabel: 'Estimate Registration Fee',
    topicLabel: 'Registration Fee',
    focusLabel: 'registration and statutory fee planning'
  },
  'total-cost-of-ownership': {
    title: 'Total Cost of Ownership Calculator',
    subtitle: 'Advanced all-in annual ownership cost and projection analysis',
    calculateButtonLabel: 'Calculate Total Ownership Cost',
    topicLabel: 'Total Cost of Ownership',
    focusLabel: 'all-in annual vehicle cost and long-term budget impact'
  },
  'trade-in-value': {
    title: 'Trade-in Value Calculator',
    subtitle: 'Advanced trade-in estimate from age, mileage, and condition',
    calculateButtonLabel: 'Calculate Trade-in Value',
    topicLabel: 'Trade-in Value',
    focusLabel: 'trade-in valuation and negotiation baseline'
  }
};

const VEHICLE_VARIANT_NARRATIVE: Record<VehicleCostsVariant, VehicleVariantNarrative> = {
  'auto-loan': {
    keyInputs: 'financed principal, APR, term length, and lender fees',
    decisionGoal: 'compare lender offers and reduce lifetime interest drag',
    stressCase: 'rate markups, term extensions, and reduced down-payment scenarios',
    thresholdGuidance: 'approve only if monthly payment and total interest both remain inside your policy limits',
    optimizationLevers: 'pre-approval rate shopping, fee negotiation, and targeted principal reduction',
    benchmarkLabel: 'Interest Burden',
    benchmarkRange: '12% - 55%',
    benchmarkUnit: 'of financed amount',
    benchmarkNote: 'Tracks how much financing cost is paid above principal.',
    researchFocus: 'consumer auto lending disclosures, amortization behavior, and quote-comparison methodology'
  },
  'car-depreciation': {
    keyInputs: 'purchase value, annual depreciation rate, mileage profile, and condition adjustments',
    decisionGoal: 'project value erosion and time resale/trade decisions more precisely',
    stressCase: 'faster depreciation curves, mileage spikes, and adverse condition adjustments',
    thresholdGuidance: 'set value-floor triggers that prompt review before equity erosion accelerates',
    optimizationLevers: 'mileage governance, reconditioning timing, and market-aware resale windows',
    benchmarkLabel: 'Annual Value Decline',
    benchmarkRange: '8% - 22%+',
    benchmarkUnit: 'per year',
    benchmarkNote: 'Helps estimate equity decay and replacement timing risk.',
    researchFocus: 'used-vehicle pricing behavior, depreciation curves, and condition-based valuation adjustments'
  },
  'car-insurance': {
    keyInputs: 'base premium, vehicle-value sensitivity, mileage exposure, and coverage settings',
    decisionGoal: 'forecast premium pressure and choose sustainable coverage structures',
    stressCase: 'carrier repricing cycles, mileage growth, and deductible/limit changes',
    thresholdGuidance: 'flag plans where annual premium growth outpaces budget and ownership assumptions',
    optimizationLevers: 'carrier quote rotation, deductible optimization, and usage-profile adjustments',
    benchmarkLabel: 'Insurance-to-TCO Share',
    benchmarkRange: '10% - 35%+',
    benchmarkUnit: 'of annual ownership cost',
    benchmarkNote: 'Shows when insurance becomes the dominant recurring cost layer.',
    researchFocus: 'U.S. premium trend data, underwriting drivers, and coverage design tradeoffs'
  },
  'car-lease': {
    keyInputs: 'capitalized cost, residual percentage, money factor, term, and acquisition fees',
    decisionGoal: 'assess effective lease economics beyond headline monthly payment',
    stressCase: 'residual compression, money-factor drift, and fee-heavy contract structures',
    thresholdGuidance: 'accept leases only when effective monthly cost beats buy-path downside cases',
    optimizationLevers: 'cap-cost negotiation, fee control, and residual-aware term selection',
    benchmarkLabel: 'Finance Charge Share',
    benchmarkRange: '8% - 32%',
    benchmarkUnit: 'of total lease path cost',
    benchmarkNote: 'Separates depreciation charge from financing and fee load.',
    researchFocus: 'lease contract math, residual risk, and money-factor-to-effective-rate comparisons'
  },
  'car-payment': {
    keyInputs: 'vehicle price, upfront cash, APR, and amortization term assumptions',
    decisionGoal: 'validate payment affordability without ignoring full ownership impact',
    stressCase: 'term extension dependence, APR deterioration, and add-on fee stacking',
    thresholdGuidance: 'set maximum combined payment-plus-operating-cost thresholds before signing',
    optimizationLevers: 'principal reduction, shorter terms, and fee-elimination strategy',
    benchmarkLabel: 'Payment-to-Income Guardrail',
    benchmarkRange: '8% - 18%',
    benchmarkUnit: 'of monthly take-home pay',
    benchmarkNote: 'Useful for affordability screening and stress-case budgeting.',
    researchFocus: 'payment affordability guidance and rate/term sensitivity in consumer auto finance'
  },
  'down-payment': {
    keyInputs: 'target LTV, purchase value, cash available, and trade-in assumptions',
    decisionGoal: 'calculate required upfront capital to control borrowing risk',
    stressCase: 'trade-in downgrades, higher price points, and stricter lender LTV policy',
    thresholdGuidance: 'move forward only when required down payment is met without weakening reserves',
    optimizationLevers: 'LTV target tuning, trade-in strategy, and staged purchase timing',
    benchmarkLabel: 'Target Down Payment',
    benchmarkRange: '10% - 25%',
    benchmarkUnit: 'of vehicle price',
    benchmarkNote: 'Supports lender-fit planning and negative-equity prevention.',
    researchFocus: 'LTV underwriting standards, negative-equity prevention, and cash-reserve tradeoffs'
  },
  'early-payoff': {
    keyInputs: 'current balance, APR, required payment, and extra principal contributions',
    decisionGoal: 'quantify payoff acceleration and validate interest-savings quality',
    stressCase: 'variable extra-payment consistency and competing cash-priority scenarios',
    thresholdGuidance: 'prioritize payoff only when savings justify liquidity and opportunity-cost tradeoffs',
    optimizationLevers: 'scheduled extra principal, payment automation, and milestone-based prepayment',
    benchmarkLabel: 'Payoff Acceleration',
    benchmarkRange: '6 - 36+',
    benchmarkUnit: 'months saved',
    benchmarkNote: 'Captures timeline compression from steady extra principal.',
    researchFocus: 'loan amortization acceleration behavior and prepayment prioritization strategies'
  },
  'extended-warranty': {
    keyInputs: 'warranty premium, expected repair exposure, and claim-probability assumptions',
    decisionGoal: 'evaluate expected-value and risk-tolerance fit for coverage decisions',
    stressCase: 'low-claim frequency, claim exclusions, and high-variance repair events',
    thresholdGuidance: 'purchase only when claim-adjusted value aligns with your volatility tolerance',
    optimizationLevers: 'contract scope review, deductible alignment, and exclusion risk screening',
    benchmarkLabel: 'Expected Value Delta',
    benchmarkRange: '-$1,500 to +$1,500+',
    benchmarkUnit: 'claim value minus premium',
    benchmarkNote: 'Frames warranty as a risk-transfer decision, not just a cost line.',
    researchFocus: 'service-contract claim behavior, repair-cost variance, and risk-transfer economics'
  },
  'gap-insurance': {
    keyInputs: 'current loan balance, market value estimate, and coverage-percentage limits',
    decisionGoal: 'measure negative-equity exposure after total-loss events',
    stressCase: 'accelerated depreciation, lower claim valuation, and partial-coverage policies',
    thresholdGuidance: 'maintain coverage while negative equity remains material under downside assumptions',
    optimizationLevers: 'principal reduction, valuation refresh cycles, and policy limit verification',
    benchmarkLabel: 'Negative Equity Gap',
    benchmarkRange: '$0 - $10,000+',
    benchmarkUnit: 'uncovered exposure',
    benchmarkNote: 'Quantifies the shortfall risk between payoff and claim value.',
    researchFocus: 'total-loss settlement gaps, depreciation timing, and loan-to-value risk management'
  },
  'interest-rate': {
    keyInputs: 'payment amount, principal assumptions, remaining term, and financed fees',
    decisionGoal: 'back-solve implied APR and validate quote consistency',
    stressCase: 'hidden fee financing, payment step changes, and term misalignment',
    thresholdGuidance: 'challenge quotes when implied rate materially exceeds disclosed expectation',
    optimizationLevers: 'fee unbundling, quote normalization, and payment-term recalibration',
    benchmarkLabel: 'Implied APR Variance',
    benchmarkRange: '0.25% - 2.50%+',
    benchmarkUnit: 'vs quoted APR',
    benchmarkNote: 'Highlights mismatch risk between headline quote and effective financing.',
    researchFocus: 'APR disclosure validation, payment back-solving, and hidden-cost detection'
  },
  'lease-vs-buy': {
    keyInputs: 'lease structure, buy financing path, depreciation assumptions, and holding horizon',
    decisionGoal: 'compare lifecycle economics of access-based vs ownership-based paths',
    stressCase: 'residual erosion, maintenance escalation, and financing-rate divergence',
    thresholdGuidance: 'select path that remains favorable under conservative horizon assumptions',
    optimizationLevers: 'horizon alignment, residual realism, and financing/fee normalization',
    benchmarkLabel: 'Lease vs Buy Delta',
    benchmarkRange: '-$8,000 to +$8,000+',
    benchmarkUnit: 'lease path minus buy path',
    benchmarkNote: 'Negative values favor leasing; positive values favor buying.',
    researchFocus: 'lease-versus-ownership lifecycle modeling and horizon-sensitive decision framing'
  },
  refinance: {
    keyInputs: 'current rate, proposed rate, remaining balance, new term, and refinance fees',
    decisionGoal: 'estimate monthly savings and time-to-fee recovery',
    stressCase: 'rate slippage, fee inflation, and excessive term extension',
    thresholdGuidance: 'execute only when break-even occurs within your planned ownership window',
    optimizationLevers: 'fee negotiation, term discipline, and payment-neutral refinance structures',
    benchmarkLabel: 'Break-even Window',
    benchmarkRange: '4 - 24+',
    benchmarkUnit: 'months',
    benchmarkNote: 'Shorter recovery windows improve refinance decision quality.',
    researchFocus: 'refinance break-even analysis, term-risk control, and fee-adjusted savings validation'
  },
  'registration-fee-estimator': {
    keyInputs: 'base fee schedules, value-based rates, and local surcharge assumptions',
    decisionGoal: 'plan statutory and renewal costs before finalizing ownership budget',
    stressCase: 'jurisdictional surcharges, valuation updates, and renewal-cycle changes',
    thresholdGuidance: 'include conservative fee buffers where local schedules change frequently',
    optimizationLevers: 'jurisdiction verification, valuation timing, and renewal planning',
    benchmarkLabel: 'Registration Load',
    benchmarkRange: '$120 - $900+',
    benchmarkUnit: 'annualized estimate',
    benchmarkNote: 'Useful for avoiding fee underestimation in total-cost planning.',
    researchFocus: 'DMV fee schedules, jurisdictional variance, and ownership compliance cost planning'
  },
  'total-cost-of-ownership': {
    keyInputs: 'insurance, fuel, maintenance, taxes/fees, parking, and depreciation assumptions',
    decisionGoal: 'measure true annual ownership burden across all recurring and economic costs',
    stressCase: 'fuel spikes, insurance repricing, and accelerated depreciation environments',
    thresholdGuidance: 'approve vehicle plans only when all-in annual cost fits long-term budget policy',
    optimizationLevers: 'cost-layer optimization, usage strategy, and periodic assumption calibration',
    benchmarkLabel: 'All-In Annual TCO',
    benchmarkRange: '$6,000 - $20,000+',
    benchmarkUnit: 'per year',
    benchmarkNote: 'Aggregates cash and non-cash economic costs for full visibility.',
    researchFocus: 'ownership cost benchmarking, inflation-adjusted projections, and budget risk management'
  },
  'trade-in-value': {
    keyInputs: 'age, mileage, baseline depreciation, and condition adjustment assumptions',
    decisionGoal: 'establish a data-grounded negotiation floor before dealer appraisal',
    stressCase: 'condition downgrades, high-mileage penalties, and fast-moving market repricing',
    thresholdGuidance: 'set minimum acceptable offer bands before entering negotiations',
    optimizationLevers: 'pre-sale conditioning, mileage timing, and multi-offer appraisal strategy',
    benchmarkLabel: 'Trade-in Variance Band',
    benchmarkRange: '$1,000 - $5,000+',
    benchmarkUnit: 'offer spread',
    benchmarkNote: 'Represents common spread between baseline and high-quality offers.',
    researchFocus: 'trade-in valuation methodology, condition premiums, and negotiation anchoring'
  }
};

const defaultInputs: Inputs = {
  vehiclePrice: '42000',
  downPayment: '6000',
  tradeInValue: '3500',
  loanTermMonths: '72',
  aprPercent: '6.9',

  currentPaymentMonthly: '665',
  remainingTermMonths: '54',
  extraPaymentMonthly: '120',

  currentLoanBalance: '29800',
  marketValue: '26200',
  gapCoveragePercent: '90',

  leaseTermMonths: '36',
  residualPercent: '58',
  moneyFactor: '0.0022',
  acquisitionFee: '995',

  newAprPercent: '5.1',
  refinanceTermMonths: '48',
  refinanceFees: '850',

  downPaymentPercent: '12',
  targetLtvPercent: '90',

  vehicleAgeYears: '3.5',
  annualDepreciationPercent: '14',
  annualMileage: '15000',
  conditionAdjustmentPercent: '-4',

  annualInsurance: '2100',
  annualFuel: '2350',
  annualMaintenance: '980',
  annualTaxesAndFees: '820',
  annualParkingAndTolls: '540',

  registrationBaseFee: '185',
  registrationRatePercent: '1.35',

  warrantyCost: '2400',
  expectedRepairCost: '3300',
  claimProbabilityPercent: '42',

  annualCostInflationPercent: '3.2',
  annualMilesGrowthPercent: '1.1',
  planningYears: '5'
};

const parseNonNegative = (value: string): number => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
};

const parsePositive = (value: string, fallback = 1): number => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const findLargestDriver = (entries: Array<[string, number]>): string => {
  return [...entries].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0][0];
};

const formatMetric = (kpi: KPI): string => {
  const decimals = kpi.decimals ?? 2;
  const core = kpi.value.toFixed(decimals);
  if (kpi.isCurrency) {
    return `$${core}${kpi.suffix ?? ''}`;
  }
  return `${core}${kpi.suffix ?? ''}`;
};

const pmt = (monthlyRate: number, months: number, principal: number): number => {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const impliedAprFromPayment = (payment: number, principal: number, months: number): number => {
  if (payment <= 0 || principal <= 0 || months <= 0) return 0;
  let low = 0;
  let high = 0.5;

  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const guessPayment = pmt(mid, months, principal);
    if (guessPayment > payment) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return ((low + high) / 2) * 12 * 100;
};

const buildFaqItems = (variant: VehicleCostsVariant): FAQItem[] => {
  const common: FAQItem[] = [
    {
      question: 'How often should I refresh assumptions in this calculator?',
      answer: 'Refresh assumptions quarterly, or sooner after major price, rate, insurance, or mileage changes.',
      category: 'Workflow'
    },
    {
      question: 'Which assumptions should I validate first?',
      answer: 'Validate the largest driver shown in results first, then confirm financing and depreciation assumptions.',
      category: 'Prioritization'
    },
    {
      question: 'Can I use this for pre-purchase negotiation planning?',
      answer: 'Yes. Use outputs as a structured baseline before negotiating pricing, terms, and add-ons.',
      category: 'Use Cases'
    },
    {
      question: 'Should I compare multiple scenarios before deciding?',
      answer: 'Yes. Compare conservative, expected, and stress scenarios for better decision resilience.',
      category: 'Scenario Planning'
    },
    {
      question: 'Are outputs guaranteed values?',
      answer: 'No. This is a planning tool. Real contract terms, taxes, fees, and market pricing can differ.',
      category: 'Limitations'
    },
    {
      question: 'Do taxes, fees, and add-ons materially change results?',
      answer: 'Yes. Fees and add-ons can materially change effective cost even when headline rates look attractive.',
      category: 'Cost Drivers'
    },
    {
      question: 'How should I use this with lender or dealer quotes?',
      answer: 'Use this as a validation layer and compare quote details line-by-line before signing.',
      category: 'Validation'
    },
    {
      question: 'Can I use this for household and fleet planning?',
      answer: 'Yes. It works for personal budgeting and business planning with scenario updates.',
      category: 'Use Cases'
    }
  ];

  const byVariant: Record<VehicleCostsVariant, FAQItem[]> = {
    'auto-loan': [
      { question: 'How is monthly payment calculated?', answer: 'It uses principal, APR, and term with standard amortization math.', category: 'Formula' },
      { question: 'What drives total interest most?', answer: 'APR and term length typically drive the largest total-interest changes.', category: 'Drivers' },
      { question: 'Should I focus only on monthly payment?', answer: 'No. Include total cost, interest, and opportunity cost of cash used upfront.', category: 'Decision' }
    ],
    'car-depreciation': [
      { question: 'How is depreciation estimated?', answer: 'Depreciation is modeled as compounded annual percentage value loss.', category: 'Formula' },
      { question: 'Why include condition adjustment?', answer: 'Condition materially impacts trade-in and resale values against baseline curves.', category: 'Drivers' },
      { question: 'Can mileage distort depreciation assumptions?', answer: 'Yes. Higher annual mileage usually accelerates effective value decline.', category: 'Risk' }
    ],
    'car-insurance': [
      { question: 'What is included in insurance output?', answer: 'The model uses baseline annual insurance with risk adjustments and monthly conversion.', category: 'Scope' },
      { question: 'Can coverage choices change costs significantly?', answer: 'Yes, deductible and coverage limits can materially change annual premium.', category: 'Drivers' },
      { question: 'Should insurance be modeled with TCO?', answer: 'Yes, insurance is often one of the largest recurring ownership costs.', category: 'Planning' }
    ],
    'car-lease': [
      { question: 'What drives lease payment most?', answer: 'Capitalized cost, residual value, money factor, and lease term drive payment.', category: 'Drivers' },
      { question: 'Is money factor the same as APR?', answer: 'Not exactly; money factor is a lease finance metric that can be approximated to APR.', category: 'Definitions' },
      { question: 'Should fees be included in lease comparison?', answer: 'Yes, acquisition and upfront fees are required for realistic comparisons.', category: 'Method' }
    ],
    'car-payment': [
      { question: 'Does this include taxes and fees?', answer: 'You can include additional cost layers via ownership and fee inputs.', category: 'Scope' },
      { question: 'How to assess affordability?', answer: 'Use payment with total ownership costs rather than payment alone.', category: 'Decision' },
      { question: 'Do longer terms always help?', answer: 'They lower monthly payment but often increase total interest paid.', category: 'Tradeoff' }
    ],
    'down-payment': [
      { question: 'How is required down payment estimated?', answer: 'Required down payment is based on target LTV and selected down-payment percent.', category: 'Formula' },
      { question: 'Why does LTV matter?', answer: 'LTV influences lender risk profile, rates, and negative-equity exposure.', category: 'Drivers' },
      { question: 'Can larger down payment reduce long-term cost?', answer: 'Usually yes, by reducing financed principal and interest burden.', category: 'Cost' }
    ],
    'early-payoff': [
      { question: 'How are interest savings estimated?', answer: 'The model compares amortization with and without extra monthly payments.', category: 'Formula' },
      { question: 'What input matters most for payoff speed?', answer: 'Extra payment amount and remaining balance are primary payoff-speed drivers.', category: 'Drivers' },
      { question: 'Should I prioritize early payoff always?', answer: 'Compare payoff benefits against alternative cash uses and emergency reserves.', category: 'Decision' }
    ],
    'extended-warranty': [
      { question: 'How is warranty value measured?', answer: 'Expected claims are estimated from repair exposure and claim probability versus warranty cost.', category: 'Method' },
      { question: 'Can warranty be negative expected value?', answer: 'Yes, if expected claim value is lower than warranty premium.', category: 'Risk' },
      { question: 'When can warranty still be useful?', answer: 'Risk-averse planning and high repair volatility can justify lower expected value.', category: 'Decision' }
    ],
    'gap-insurance': [
      { question: 'What is GAP exposure?', answer: 'It is the difference between loan balance and vehicle market value.', category: 'Definition' },
      { question: 'When is GAP risk highest?', answer: 'Early loan years with low down payment and high depreciation risk.', category: 'Drivers' },
      { question: 'Does coverage percent remove all risk?', answer: 'Not always; policy limits and exclusions can leave residual exposure.', category: 'Limitations' }
    ],
    'interest-rate': [
      { question: 'How is implied rate calculated?', answer: 'The calculator back-solves APR from payment, principal, and term assumptions.', category: 'Formula' },
      { question: 'Why use implied APR checks?', answer: 'It helps validate loan quote consistency and hidden-cost assumptions.', category: 'Validation' },
      { question: 'Can fees distort implied APR?', answer: 'Yes, financed fees and add-ons can increase effective rate materially.', category: 'Risk' }
    ],
    'lease-vs-buy': [
      { question: 'What does lease vs buy compare?', answer: 'It compares modeled net lifecycle cost for leasing versus ownership paths.', category: 'Scope' },
      { question: 'What often changes the result?', answer: 'Depreciation, residual assumptions, mileage profile, and financing terms.', category: 'Drivers' },
      { question: 'Should I include expected resale value?', answer: 'Yes, ownership economics require residual/trade-in assumptions.', category: 'Method' }
    ],
    refinance: [
      { question: 'How is refinance break-even estimated?', answer: 'Break-even is estimated from monthly savings versus refinance fees.', category: 'Formula' },
      { question: 'Can refinance lower payment but raise total cost?', answer: 'Yes, term extension can reduce payment while increasing lifetime interest.', category: 'Tradeoff' },
      { question: 'What should I verify before refinancing?', answer: 'Confirm fees, prepayment terms, and the true effective rate.', category: 'Checklist' }
    ],
    'registration-fee-estimator': [
      { question: 'How are registration fees estimated?', answer: 'Estimated fees combine base fee with a value-based percentage component.', category: 'Formula' },
      { question: 'Why can estimates vary by state?', answer: 'Fee schedules differ by jurisdiction, weight class, and local surcharges.', category: 'Variance' },
      { question: 'Should this be treated as exact?', answer: 'No, use as planning baseline and confirm with local DMV schedules.', category: 'Limitations' }
    ],
    'total-cost-of-ownership': [
      { question: 'What costs are included in TCO?', answer: 'Insurance, fuel, maintenance, taxes/fees, parking/tolls, and depreciation are included.', category: 'Scope' },
      { question: 'Why include depreciation in annual cost?', answer: 'Depreciation is a major economic ownership cost even if non-cash monthly.', category: 'Method' },
      { question: 'How often should TCO assumptions be refreshed?', answer: 'Quarterly refresh is useful under changing rates, fuel, and insurance costs.', category: 'Workflow' }
    ],
    'trade-in-value': [
      { question: 'How is trade-in value estimated?', answer: 'Value is modeled from depreciation baseline plus condition and mileage adjustments.', category: 'Formula' },
      { question: 'Can this replace dealer appraisals?', answer: 'No, it provides a negotiation baseline but not a final offer.', category: 'Limitations' },
      { question: 'Why model condition explicitly?', answer: 'Condition has direct impact on spread between average and top-quartile offers.', category: 'Drivers' }
    ]
  };

  return [...byVariant[variant], ...common].slice(0, 10);
};

const AdvancedVehicleCostsSuiteCalculator = ({ variant }: AdvancedVehicleCostsSuiteCalculatorProps) => {
  const config = VARIANT_CONFIG[variant];
  const narrative = VEHICLE_VARIANT_NARRATIVE[variant];
  const topic = config.topicLabel;
  const topicLower = topic.toLowerCase();

  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);

  const handleInputChange = (field: keyof Inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    const vehiclePrice = parseNonNegative(inputs.vehiclePrice);
    const downPayment = parseNonNegative(inputs.downPayment);
    const tradeInValue = parseNonNegative(inputs.tradeInValue);
    const loanTermMonths = Math.max(1, parsePositive(inputs.loanTermMonths));
    const aprPercent = parseNonNegative(inputs.aprPercent);

    const currentPaymentMonthly = parseNonNegative(inputs.currentPaymentMonthly);
    const remainingTermMonths = Math.max(1, parsePositive(inputs.remainingTermMonths));
    const extraPaymentMonthly = parseNonNegative(inputs.extraPaymentMonthly);

    const currentLoanBalance = parseNonNegative(inputs.currentLoanBalance);
    const marketValue = parseNonNegative(inputs.marketValue);
    const gapCoveragePercent = Math.min(100, parseNonNegative(inputs.gapCoveragePercent));

    const leaseTermMonths = Math.max(1, parsePositive(inputs.leaseTermMonths));
    const residualPercent = Math.min(100, parseNonNegative(inputs.residualPercent));
    const moneyFactor = parseNonNegative(inputs.moneyFactor);
    const acquisitionFee = parseNonNegative(inputs.acquisitionFee);

    const newAprPercent = parseNonNegative(inputs.newAprPercent);
    const refinanceTermMonths = Math.max(1, parsePositive(inputs.refinanceTermMonths));
    const refinanceFees = parseNonNegative(inputs.refinanceFees);

    const downPaymentPercent = Math.min(100, parseNonNegative(inputs.downPaymentPercent));
    const targetLtvPercent = Math.min(100, parsePositive(inputs.targetLtvPercent));

    const vehicleAgeYears = parseNonNegative(inputs.vehicleAgeYears);
    const annualDepreciationPercent = Math.min(95, parseNonNegative(inputs.annualDepreciationPercent));
    const annualMileage = parseNonNegative(inputs.annualMileage);
    const conditionAdjustmentPercent = parseNonNegative(inputs.conditionAdjustmentPercent);

    const annualInsurance = parseNonNegative(inputs.annualInsurance);
    const annualFuel = parseNonNegative(inputs.annualFuel);
    const annualMaintenance = parseNonNegative(inputs.annualMaintenance);
    const annualTaxesAndFees = parseNonNegative(inputs.annualTaxesAndFees);
    const annualParkingAndTolls = parseNonNegative(inputs.annualParkingAndTolls);

    const registrationBaseFee = parseNonNegative(inputs.registrationBaseFee);
    const registrationRatePercent = parseNonNegative(inputs.registrationRatePercent);

    const warrantyCost = parseNonNegative(inputs.warrantyCost);
    const expectedRepairCost = parseNonNegative(inputs.expectedRepairCost);
    const claimProbabilityPercent = Math.min(100, parseNonNegative(inputs.claimProbabilityPercent));

    const annualCostInflationPercent = parseNonNegative(inputs.annualCostInflationPercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parsePositive(inputs.planningYears));

    const financedPrincipal = Math.max(0, vehiclePrice - downPayment - tradeInValue);
    const monthlyRate = aprPercent / 1200;
    const baseMonthlyPayment = pmt(monthlyRate, loanTermMonths, financedPrincipal);
    const baseTotalPaid = baseMonthlyPayment * loanTermMonths;
    const baseTotalInterest = Math.max(0, baseTotalPaid - financedPrincipal);

    const annualOwnershipCost = annualInsurance + annualFuel + annualMaintenance + annualTaxesAndFees + annualParkingAndTolls;

    let primaryLabel = 'Primary Result';
    let primaryValue = 0;
    let primaryIsCurrency = false;
    let primarySuffix: string | undefined;
    let kpis: KPI[] = [];
    let breakdown: BreakdownItem[] = [];
    let scenarios: Scenario[] = [];
    let baselineAnnualCost = annualOwnershipCost;
    let largestDriver = 'Vehicle Price';

    if (variant === 'car-payment' || variant === 'auto-loan') {
      primaryLabel = 'Estimated Monthly Payment';
      primaryValue = baseMonthlyPayment;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Financed Principal', value: financedPrincipal, isCurrency: true },
        { label: 'Total Interest', value: baseTotalInterest, isCurrency: true },
        { label: 'Total Paid', value: baseTotalPaid, isCurrency: true },
        { label: 'APR', value: aprPercent, decimals: 2, suffix: '%' }
      ];

      breakdown = [
        { label: 'Principal', value: financedPrincipal, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Interest', value: baseTotalInterest, icon: TrendingDown, color: 'bg-emerald-500' },
        { label: 'Down Payment + Trade-in', value: downPayment + tradeInValue, icon: Target, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'APR +1.5%', value: pmt((aprPercent + 1.5) / 1200, loanTermMonths, financedPrincipal), notes: 'Rate stress case.' },
        { label: 'APR -1.0%', value: pmt(Math.max(0, aprPercent - 1.0) / 1200, loanTermMonths, financedPrincipal), notes: 'Rate improvement case.' },
        { label: 'Term -12 months', value: pmt(monthlyRate, Math.max(12, loanTermMonths - 12), financedPrincipal), notes: 'Faster payoff case.' },
        { label: 'Term +12 months', value: pmt(monthlyRate, loanTermMonths + 12, financedPrincipal), notes: 'Cash-flow easing case.' }
      ];

      baselineAnnualCost = baseMonthlyPayment * 12 + annualOwnershipCost;
      largestDriver = findLargestDriver([
        ['Vehicle Price', vehiclePrice],
        ['APR', aprPercent],
        ['Loan Term', loanTermMonths]
      ]);
    }

    if (variant === 'down-payment') {
      const requiredDownByLtv = Math.max(0, vehiclePrice * (1 - targetLtvPercent / 100));
      const targetDownByPercent = vehiclePrice * (downPaymentPercent / 100);
      const requiredDown = Math.max(requiredDownByLtv, targetDownByPercent);
      const shortfall = Math.max(0, requiredDown - (downPayment + tradeInValue));

      primaryLabel = 'Estimated Required Down Payment';
      primaryValue = requiredDown;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Current Down + Trade-in', value: downPayment + tradeInValue, isCurrency: true },
        { label: 'Estimated Shortfall', value: shortfall, isCurrency: true },
        { label: 'Target LTV', value: targetLtvPercent, decimals: 1, suffix: '%' },
        { label: 'Target Down %', value: downPaymentPercent, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'LTV Requirement', value: requiredDownByLtv, icon: Shield, color: 'bg-blue-500' },
        { label: 'Percent Rule', value: targetDownByPercent, icon: Calculator, color: 'bg-emerald-500' },
        { label: 'Current Cash Position', value: downPayment + tradeInValue, icon: Wallet, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Vehicle Price +10%', value: Math.max(0, vehiclePrice * 1.1 * (1 - targetLtvPercent / 100)), notes: 'Higher vehicle cost case.' },
        { label: 'Target LTV to 85%', value: Math.max(0, vehiclePrice * 0.15), notes: 'More conservative lender policy.' },
        { label: 'Trade-in +$2,000', value: Math.max(0, requiredDown - (downPayment + tradeInValue + 2000)), notes: 'Improved trade-in case.' },
        { label: 'Trade-in -$2,000', value: Math.max(0, requiredDown - (downPayment + Math.max(0, tradeInValue - 2000))), notes: 'Downside valuation case.' }
      ];

      baselineAnnualCost = shortfall;
      largestDriver = findLargestDriver([
        ['Vehicle Price', vehiclePrice],
        ['Target LTV', targetLtvPercent],
        ['Trade-in Value', tradeInValue]
      ]);
    }

    if (variant === 'interest-rate') {
      const impliedApr = impliedAprFromPayment(currentPaymentMonthly, Math.max(1, financedPrincipal), remainingTermMonths);

      primaryLabel = 'Implied APR';
      primaryValue = impliedApr;
      primarySuffix = '%';

      kpis = [
        { label: 'Current Monthly Payment', value: currentPaymentMonthly, isCurrency: true },
        { label: 'Remaining Months', value: remainingTermMonths, decimals: 0, suffix: ' months' },
        { label: 'Principal Used', value: financedPrincipal, isCurrency: true },
        { label: 'Quoted APR Input', value: aprPercent, decimals: 2, suffix: '%' }
      ];

      breakdown = [
        { label: 'Payment Level', value: currentPaymentMonthly, icon: DollarSign, color: 'bg-blue-500' },
        { label: 'Principal Size', value: financedPrincipal, icon: Wallet, color: 'bg-emerald-500' },
        { label: 'Remaining Term', value: remainingTermMonths, icon: Clock3, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Payment +$50', value: impliedAprFromPayment(currentPaymentMonthly + 50, Math.max(1, financedPrincipal), remainingTermMonths), notes: 'Higher payment scenario.' },
        { label: 'Payment -$50', value: impliedAprFromPayment(Math.max(1, currentPaymentMonthly - 50), Math.max(1, financedPrincipal), remainingTermMonths), notes: 'Lower payment scenario.' },
        { label: 'Term +12 months', value: impliedAprFromPayment(currentPaymentMonthly, Math.max(1, financedPrincipal), remainingTermMonths + 12), notes: 'Extended term scenario.' },
        { label: 'Principal -$3,000', value: impliedAprFromPayment(currentPaymentMonthly, Math.max(1, financedPrincipal - 3000), remainingTermMonths), notes: 'Lower financed amount scenario.' }
      ];

      baselineAnnualCost = currentPaymentMonthly * 12;
      largestDriver = findLargestDriver([
        ['Monthly Payment', currentPaymentMonthly],
        ['Principal', financedPrincipal],
        ['Term', remainingTermMonths]
      ]);
    }

    if (variant === 'early-payoff') {
      const baseRate = aprPercent / 1200;
      const basePayment = Math.max(1, currentPaymentMonthly || baseMonthlyPayment);
      const acceleratedPayment = basePayment + extraPaymentMonthly;

      let balanceBase = Math.max(1, currentLoanBalance || financedPrincipal);
      let balanceAccel = Math.max(1, currentLoanBalance || financedPrincipal);
      let baseMonths = 0;
      let accelMonths = 0;
      let baseInterest = 0;
      let accelInterest = 0;

      while (balanceBase > 0.01 && baseMonths < 1000) {
        const interest = balanceBase * baseRate;
        const principalPaid = Math.max(0, basePayment - interest);
        baseInterest += interest;
        balanceBase = Math.max(0, balanceBase - principalPaid);
        baseMonths++;
      }

      while (balanceAccel > 0.01 && accelMonths < 1000) {
        const interest = balanceAccel * baseRate;
        const principalPaid = Math.max(0, acceleratedPayment - interest);
        accelInterest += interest;
        balanceAccel = Math.max(0, balanceAccel - principalPaid);
        accelMonths++;
      }

      const monthsSaved = Math.max(0, baseMonths - accelMonths);
      const interestSaved = Math.max(0, baseInterest - accelInterest);

      primaryLabel = 'Estimated Interest Saved';
      primaryValue = interestSaved;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Months Saved', value: monthsSaved, decimals: 0, suffix: ' months' },
        { label: 'Base Payoff Timeline', value: baseMonths, decimals: 0, suffix: ' months' },
        { label: 'Accelerated Timeline', value: accelMonths, decimals: 0, suffix: ' months' },
        { label: 'Extra Payment', value: extraPaymentMonthly, isCurrency: true, suffix: '/mo' }
      ];

      breakdown = [
        { label: 'Base Interest Path', value: baseInterest, icon: TrendingDown, color: 'bg-blue-500' },
        { label: 'Accelerated Interest Path', value: accelInterest, icon: Route, color: 'bg-emerald-500' },
        { label: 'Interest Savings', value: interestSaved, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Extra +$50/mo', value: Math.max(0, interestSaved * 1.28), notes: 'Faster acceleration case.' },
        { label: 'Extra -$50/mo', value: Math.max(0, interestSaved * 0.72), notes: 'Lower acceleration case.' },
        { label: 'APR +1%', value: Math.max(0, interestSaved * 1.17), notes: 'Higher-rate environment case.' },
        { label: 'Balance +$4,000', value: Math.max(0, interestSaved * 1.15), notes: 'Higher balance case.' }
      ];

      baselineAnnualCost = basePayment * 12;
      largestDriver = findLargestDriver([
        ['Current Balance', currentLoanBalance || financedPrincipal],
        ['APR', aprPercent],
        ['Extra Payment', extraPaymentMonthly]
      ]);
    }

    if (variant === 'refinance') {
      const balance = Math.max(1, currentLoanBalance || financedPrincipal);
      const oldMonthly = pmt(aprPercent / 1200, remainingTermMonths, balance);
      const newMonthly = pmt(newAprPercent / 1200, refinanceTermMonths, balance + refinanceFees);
      const monthlySavings = oldMonthly - newMonthly;
      const breakEvenMonths = monthlySavings > 0 ? refinanceFees / monthlySavings : 0;
      const netFiveYear = monthlySavings * Math.min(60, refinanceTermMonths) - refinanceFees;

      primaryLabel = 'Estimated Monthly Refinance Savings';
      primaryValue = monthlySavings;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Current Monthly Payment', value: oldMonthly, isCurrency: true },
        { label: 'Refinanced Monthly Payment', value: newMonthly, isCurrency: true },
        { label: 'Break-even Timeline', value: breakEvenMonths, decimals: 1, suffix: ' months' },
        { label: '5-Year Net Impact', value: netFiveYear, isCurrency: true }
      ];

      breakdown = [
        { label: 'Rate Reduction Effect', value: Math.max(0, oldMonthly - pmt(newAprPercent / 1200, remainingTermMonths, balance)), icon: TrendingDown, color: 'bg-blue-500' },
        { label: 'Term Adjustment Effect', value: Math.abs(pmt(newAprPercent / 1200, refinanceTermMonths, balance) - pmt(newAprPercent / 1200, remainingTermMonths, balance)), icon: Clock3, color: 'bg-emerald-500' },
        { label: 'Refinance Fees', value: refinanceFees, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'New APR +0.75%', value: oldMonthly - pmt((newAprPercent + 0.75) / 1200, refinanceTermMonths, balance + refinanceFees), notes: 'Rate slippage case.' },
        { label: 'Fees +$500', value: monthlySavings > 0 ? (refinanceFees + 500) / monthlySavings : 0, notes: 'Higher fees break-even case.' },
        { label: 'Term -12 months', value: oldMonthly - pmt(newAprPercent / 1200, Math.max(12, refinanceTermMonths - 12), balance + refinanceFees), notes: 'Faster payoff case.' },
        { label: 'Balance -$4,000', value: oldMonthly - pmt(newAprPercent / 1200, refinanceTermMonths, Math.max(1, balance - 4000) + refinanceFees), notes: 'Lower balance case.' }
      ];

      baselineAnnualCost = newMonthly * 12 + annualOwnershipCost;
      largestDriver = findLargestDriver([
        ['Current APR', aprPercent],
        ['New APR', newAprPercent],
        ['Refinance Fees', refinanceFees]
      ]);
    }

    if (variant === 'car-lease') {
      const capCost = Math.max(0, vehiclePrice - downPayment - tradeInValue + acquisitionFee);
      const residualValue = vehiclePrice * (residualPercent / 100);
      const depreciationCharge = (capCost - residualValue) / leaseTermMonths;
      const financeCharge = (capCost + residualValue) * moneyFactor;
      const monthlyLeasePayment = depreciationCharge + financeCharge;
      const totalLeaseCost = monthlyLeasePayment * leaseTermMonths + downPayment + acquisitionFee;

      primaryLabel = 'Estimated Monthly Lease Payment';
      primaryValue = monthlyLeasePayment;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Residual Value', value: residualValue, isCurrency: true },
        { label: 'Cap Cost', value: capCost, isCurrency: true },
        { label: 'Depreciation Charge / Mo', value: depreciationCharge, isCurrency: true },
        { label: 'Total Lease Path Cost', value: totalLeaseCost, isCurrency: true }
      ];

      breakdown = [
        { label: 'Depreciation Portion', value: depreciationCharge, icon: TrendingDown, color: 'bg-blue-500' },
        { label: 'Finance Portion', value: financeCharge, icon: DollarSign, color: 'bg-emerald-500' },
        { label: 'Upfront Costs', value: downPayment + acquisitionFee, icon: Wallet, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Money Factor +0.0005', value: depreciationCharge + (capCost + residualValue) * (moneyFactor + 0.0005), notes: 'Higher financing cost case.' },
        { label: 'Residual -4 points', value: ((capCost - vehiclePrice * Math.max(0, residualPercent - 4) / 100) / leaseTermMonths) + (capCost + vehiclePrice * Math.max(0, residualPercent - 4) / 100) * moneyFactor, notes: 'Lower residual case.' },
        { label: 'Lease Term 48 mo', value: ((capCost - residualValue) / 48) + financeCharge, notes: 'Longer term cash-flow case.' },
        { label: 'Upfront +$1,500', value: totalLeaseCost + 1500, notes: 'Higher upfront cost case.' }
      ];

      baselineAnnualCost = monthlyLeasePayment * 12 + annualOwnershipCost;
      largestDriver = findLargestDriver([
        ['Vehicle Price', vehiclePrice],
        ['Residual %', residualPercent],
        ['Money Factor', moneyFactor]
      ]);
    }

    if (variant === 'lease-vs-buy') {
      const capCost = Math.max(0, vehiclePrice - downPayment - tradeInValue + acquisitionFee);
      const residualValue = vehiclePrice * (residualPercent / 100);
      const leasePayment = ((capCost - residualValue) / leaseTermMonths) + (capCost + residualValue) * moneyFactor;
      const leasePathCost = leasePayment * leaseTermMonths + downPayment + acquisitionFee;

      const buyMonthly = baseMonthlyPayment;
      const horizonMonths = Math.min(loanTermMonths, leaseTermMonths);
      const buyPaymentsToHorizon = buyMonthly * horizonMonths + downPayment;
      const projectedValueAtHorizon = vehiclePrice * Math.pow(1 - annualDepreciationPercent / 100, leaseTermMonths / 12);
      const buyNetCost = buyPaymentsToHorizon + annualMaintenance * (leaseTermMonths / 12) - projectedValueAtHorizon;
      const delta = leasePathCost - buyNetCost;

      primaryLabel = 'Lease vs Buy Delta (Lease - Buy)';
      primaryValue = delta;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Lease Path Cost', value: leasePathCost, isCurrency: true },
        { label: 'Buy Net Cost at Horizon', value: buyNetCost, isCurrency: true },
        { label: 'Projected Value at Horizon', value: projectedValueAtHorizon, isCurrency: true },
        { label: 'Horizon Length', value: leaseTermMonths, decimals: 0, suffix: ' months' }
      ];

      breakdown = [
        { label: 'Lease Payments + Upfront', value: leasePathCost, icon: Car, color: 'bg-blue-500' },
        { label: 'Buy Payments', value: buyPaymentsToHorizon, icon: Wallet, color: 'bg-emerald-500' },
        { label: 'Residual Equity Benefit', value: projectedValueAtHorizon, icon: Target, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Depreciation +4 points', value: leasePathCost - (buyPaymentsToHorizon + annualMaintenance * (leaseTermMonths / 12) - vehiclePrice * Math.pow(1 - (annualDepreciationPercent + 4) / 100, leaseTermMonths / 12)), notes: 'Higher depreciation case.' },
        { label: 'Money Factor +0.0004', value: (leasePathCost + (capCost + residualValue) * 0.0004 * leaseTermMonths) - buyNetCost, notes: 'Lease financing stress case.' },
        { label: 'APR -1%', value: leasePathCost - ((pmt(Math.max(0, aprPercent - 1) / 1200, loanTermMonths, financedPrincipal) * horizonMonths + downPayment + annualMaintenance * (leaseTermMonths / 12)) - projectedValueAtHorizon), notes: 'Cheaper loan rate case.' },
        { label: 'Maintenance +25%', value: leasePathCost - (buyPaymentsToHorizon + annualMaintenance * 1.25 * (leaseTermMonths / 12) - projectedValueAtHorizon), notes: 'Higher maintenance case.' }
      ];

      baselineAnnualCost = (delta + annualOwnershipCost) / Math.max(1, leaseTermMonths / 12);
      largestDriver = findLargestDriver([
        ['Residual Value', residualValue],
        ['Depreciation', annualDepreciationPercent],
        ['Money Factor', moneyFactor],
        ['APR', aprPercent]
      ]);
    }

    if (variant === 'car-depreciation' || variant === 'trade-in-value') {
      const depreciationFactor = Math.pow(1 - annualDepreciationPercent / 100, vehicleAgeYears);
      const baselineValue = vehiclePrice * depreciationFactor;
      const mileageAdjustmentPercent = -Math.max(0, (annualMileage - 12000) / 1000) * 0.35;
      const adjustedValue = baselineValue * (1 + (conditionAdjustmentPercent + mileageAdjustmentPercent) / 100);
      const valueLost = Math.max(0, vehiclePrice - adjustedValue);

      primaryLabel = variant === 'car-depreciation' ? 'Estimated Current Vehicle Value' : 'Estimated Trade-in Value';
      primaryValue = adjustedValue;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Total Value Lost', value: valueLost, isCurrency: true },
        { label: 'Vehicle Age', value: vehicleAgeYears, decimals: 1, suffix: ' years' },
        { label: 'Annual Depreciation', value: annualDepreciationPercent, decimals: 1, suffix: '%' },
        { label: 'Mileage Adjustment', value: mileageAdjustmentPercent, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'Original Price', value: vehiclePrice, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Current/Trade-in Value', value: adjustedValue, icon: Car, color: 'bg-emerald-500' },
        { label: 'Depreciation Loss', value: valueLost, icon: TrendingDown, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Condition +5%', value: baselineValue * (1 + (conditionAdjustmentPercent + 5 + mileageAdjustmentPercent) / 100), notes: 'Better condition case.' },
        { label: 'Condition -5%', value: baselineValue * (1 + (conditionAdjustmentPercent - 5 + mileageAdjustmentPercent) / 100), notes: 'Worse condition case.' },
        { label: 'Depreciation +3 points', value: vehiclePrice * Math.pow(1 - (annualDepreciationPercent + 3) / 100, vehicleAgeYears), notes: 'Faster depreciation case.' },
        { label: 'Mileage 20k/yr', value: baselineValue * (1 + (conditionAdjustmentPercent - Math.max(0, (20000 - 12000) / 1000) * 0.35) / 100), notes: 'High mileage case.' }
      ];

      baselineAnnualCost = valueLost / Math.max(1, vehicleAgeYears);
      largestDriver = findLargestDriver([
        ['Vehicle Price', vehiclePrice],
        ['Depreciation %', annualDepreciationPercent],
        ['Vehicle Age', vehicleAgeYears],
        ['Condition', conditionAdjustmentPercent]
      ]);
    }

    if (variant === 'car-insurance') {
      const valueLoad = vehiclePrice * 0.008;
      const mileageLoad = Math.max(0, annualMileage - 12000) * 0.03;
      const adjustedPremium = annualInsurance + valueLoad + mileageLoad;

      primaryLabel = 'Estimated Annual Insurance Cost';
      primaryValue = adjustedPremium;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Monthly Equivalent', value: adjustedPremium / 12, isCurrency: true },
        { label: 'Base Annual Insurance', value: annualInsurance, isCurrency: true },
        { label: 'Vehicle Value Load', value: valueLoad, isCurrency: true },
        { label: 'Mileage Load', value: mileageLoad, isCurrency: true }
      ];

      breakdown = [
        { label: 'Base Premium', value: annualInsurance, icon: Shield, color: 'bg-blue-500' },
        { label: 'Value Risk Load', value: valueLoad, icon: Car, color: 'bg-emerald-500' },
        { label: 'Usage Load', value: mileageLoad, icon: Route, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Premium +12%', value: adjustedPremium * 1.12, notes: 'Market hardening case.' },
        { label: 'Premium -8%', value: adjustedPremium * 0.92, notes: 'Carrier optimization case.' },
        { label: 'Mileage +20%', value: annualInsurance + valueLoad + Math.max(0, annualMileage * 1.2 - 12000) * 0.03, notes: 'Higher usage case.' },
        { label: 'Vehicle price -$8,000', value: annualInsurance + Math.max(0, vehiclePrice - 8000) * 0.008 + mileageLoad, notes: 'Lower value case.' }
      ];

      baselineAnnualCost = adjustedPremium;
      largestDriver = findLargestDriver([
        ['Base Premium', annualInsurance],
        ['Vehicle Price', vehiclePrice],
        ['Annual Mileage', annualMileage]
      ]);
    }

    if (variant === 'gap-insurance') {
      const gapAmount = Math.max(0, currentLoanBalance - marketValue);
      const coveredAmount = gapAmount * (gapCoveragePercent / 100);
      const outOfPocket = Math.max(0, gapAmount - coveredAmount);

      primaryLabel = 'Estimated GAP Exposure';
      primaryValue = gapAmount;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Covered by GAP', value: coveredAmount, isCurrency: true },
        { label: 'Potential Out-of-Pocket', value: outOfPocket, isCurrency: true },
        { label: 'Coverage Percent', value: gapCoveragePercent, decimals: 1, suffix: '%' },
        { label: 'Current Loan-to-Value', value: marketValue > 0 ? (currentLoanBalance / marketValue) * 100 : 0, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'Loan Balance', value: currentLoanBalance, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Market Value', value: marketValue, icon: Car, color: 'bg-emerald-500' },
        { label: 'Negative Equity Gap', value: gapAmount, icon: AlertTriangle, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Market value -10%', value: Math.max(0, currentLoanBalance - marketValue * 0.9), notes: 'Faster depreciation case.' },
        { label: 'Balance -$3,000', value: Math.max(0, Math.max(0, currentLoanBalance - 3000) - marketValue), notes: 'Paydown progress case.' },
        { label: 'Coverage to 100%', value: gapAmount, notes: 'Full coverage reference.' },
        { label: 'Coverage to 70%', value: Math.max(0, gapAmount - gapAmount * 0.7), notes: 'Lower coverage case.' }
      ];

      baselineAnnualCost = outOfPocket;
      largestDriver = findLargestDriver([
        ['Loan Balance', currentLoanBalance],
        ['Market Value', marketValue],
        ['Coverage %', gapCoveragePercent]
      ]);
    }

    if (variant === 'extended-warranty') {
      const expectedClaimValue = expectedRepairCost * (claimProbabilityPercent / 100);
      const netValue = expectedClaimValue - warrantyCost;

      primaryLabel = 'Expected Net Warranty Value';
      primaryValue = netValue;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Warranty Cost', value: warrantyCost, isCurrency: true },
        { label: 'Expected Claim Value', value: expectedClaimValue, isCurrency: true },
        { label: 'Expected Repair Exposure', value: expectedRepairCost, isCurrency: true },
        { label: 'Claim Probability', value: claimProbabilityPercent, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'Warranty Premium', value: warrantyCost, icon: Shield, color: 'bg-blue-500' },
        { label: 'Expected Claim Recoveries', value: expectedClaimValue, icon: Wrench, color: 'bg-emerald-500' },
        { label: 'Net Position', value: netValue, icon: Target, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Claim Probability +15 points', value: expectedRepairCost * (Math.min(100, claimProbabilityPercent + 15) / 100) - warrantyCost, notes: 'Higher repair incidence case.' },
        { label: 'Expected Repairs +30%', value: expectedRepairCost * 1.3 * (claimProbabilityPercent / 100) - warrantyCost, notes: 'Higher severity case.' },
        { label: 'Warranty Cost -$500', value: expectedClaimValue - Math.max(0, warrantyCost - 500), notes: 'Better pricing case.' },
        { label: 'Warranty Cost +$500', value: expectedClaimValue - (warrantyCost + 500), notes: 'Higher premium case.' }
      ];

      baselineAnnualCost = Math.max(0, warrantyCost - expectedClaimValue);
      largestDriver = findLargestDriver([
        ['Repair Exposure', expectedRepairCost],
        ['Claim Probability', claimProbabilityPercent],
        ['Warranty Cost', warrantyCost]
      ]);
    }

    if (variant === 'registration-fee-estimator') {
      const valueBasedFee = vehiclePrice * (registrationRatePercent / 100);
      const estimatedFee = registrationBaseFee + valueBasedFee;

      primaryLabel = 'Estimated Registration Fee';
      primaryValue = estimatedFee;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Base Fee', value: registrationBaseFee, isCurrency: true },
        { label: 'Value-Based Portion', value: valueBasedFee, isCurrency: true },
        { label: 'Vehicle Price', value: vehiclePrice, isCurrency: true },
        { label: 'Rate Used', value: registrationRatePercent, decimals: 2, suffix: '%' }
      ];

      breakdown = [
        { label: 'Base Amount', value: registrationBaseFee, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Value-Based Fee', value: valueBasedFee, icon: Calculator, color: 'bg-emerald-500' },
        { label: 'Total Estimate', value: estimatedFee, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Vehicle price +10%', value: registrationBaseFee + vehiclePrice * 1.1 * (registrationRatePercent / 100), notes: 'Higher price case.' },
        { label: 'Rate +0.5 points', value: registrationBaseFee + vehiclePrice * ((registrationRatePercent + 0.5) / 100), notes: 'Higher statutory rate case.' },
        { label: 'Base fee +$50', value: estimatedFee + 50, notes: 'Local surcharge case.' },
        { label: 'Vehicle price -10%', value: registrationBaseFee + vehiclePrice * 0.9 * (registrationRatePercent / 100), notes: 'Lower value case.' }
      ];

      baselineAnnualCost = estimatedFee;
      largestDriver = findLargestDriver([
        ['Vehicle Price', vehiclePrice],
        ['Registration Rate', registrationRatePercent],
        ['Base Fee', registrationBaseFee]
      ]);
    }

    if (variant === 'total-cost-of-ownership') {
      const depreciationAnnual = vehiclePrice * (annualDepreciationPercent / 100);
      const totalAnnual = annualOwnershipCost + depreciationAnnual;

      primaryLabel = 'Estimated Annual Total Cost';
      primaryValue = totalAnnual;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Insurance', value: annualInsurance, isCurrency: true },
        { label: 'Fuel', value: annualFuel, isCurrency: true },
        { label: 'Maintenance', value: annualMaintenance, isCurrency: true },
        { label: 'Depreciation (annualized)', value: depreciationAnnual, isCurrency: true }
      ];

      breakdown = [
        { label: 'Operating Costs', value: annualOwnershipCost, icon: Car, color: 'bg-blue-500' },
        { label: 'Depreciation', value: depreciationAnnual, icon: TrendingDown, color: 'bg-emerald-500' },
        { label: 'Taxes/Fees/Tolls', value: annualTaxesAndFees + annualParkingAndTolls, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Fuel +20%', value: totalAnnual + annualFuel * 0.2, notes: 'Fuel inflation case.' },
        { label: 'Insurance +15%', value: totalAnnual + annualInsurance * 0.15, notes: 'Insurance hardening case.' },
        { label: 'Depreciation +3 points', value: annualOwnershipCost + vehiclePrice * ((annualDepreciationPercent + 3) / 100), notes: 'Faster value-loss case.' },
        { label: 'Maintenance +30%', value: totalAnnual + annualMaintenance * 0.3, notes: 'Higher maintenance case.' }
      ];

      baselineAnnualCost = totalAnnual;
      largestDriver = findLargestDriver([
        ['Insurance', annualInsurance],
        ['Fuel', annualFuel],
        ['Depreciation', depreciationAnnual],
        ['Maintenance', annualMaintenance]
      ]);
    }

    if (variant === 'car-payment' || variant === 'auto-loan' || variant === 'down-payment' || variant === 'early-payoff' || variant === 'interest-rate' || variant === 'lease-vs-buy' || variant === 'refinance' || variant === 'car-lease' || variant === 'car-insurance' || variant === 'gap-insurance' || variant === 'extended-warranty' || variant === 'registration-fee-estimator' || variant === 'total-cost-of-ownership' || variant === 'car-depreciation' || variant === 'trade-in-value') {
      const projectionRows: ProjectionRow[] = [];
      let projectedMiles = annualMileage;
      let projectedCost = Math.max(0, baselineAnnualCost);

      for (let year = 1; year <= planningYears; year++) {
        projectionRows.push({
          year,
          annualMiles: projectedMiles,
          annualCost: projectedCost,
          inflationRate: annualCostInflationPercent
        });
        projectedMiles *= 1 + annualMilesGrowthPercent / 100;
        projectedCost *= 1 + annualCostInflationPercent / 100;
      }

      const recommendations = [
        `${config.title} indicates ${config.focusLabel} as the dominant planning priority under your assumptions.`,
        `Largest driver detected: ${largestDriver}. Validate this assumption first for better decision reliability.`,
        'Review downside scenarios before committing to financing, leasing, or ownership strategy.',
        'Use quarterly refresh cycles for rates, fees, insurance, and depreciation assumptions.',
        'Track planned versus realized costs to improve future model quality.'
      ];

      const warningsAndConsiderations = [
        'This calculator provides planning estimates and not lending, legal, or tax advice.',
        'Actual contract terms, fees, and market values can materially differ from assumptions.',
        'Single-scenario outputs can hide downside exposure; evaluate multiple cases before decisions.',
        'For binding terms, confirm final numbers with lender, dealer, insurer, and local authority sources.'
      ];

      const nextSteps = [
        'Confirm base assumptions using current quotes and statements.',
        'Run conservative, expected, and stress cases and compare deltas.',
        'Choose threshold triggers for reassessment (rate, value, or cost changes).',
        'Schedule monthly or quarterly variance reviews.',
        'Recalculate before refinancing, trading in, or major purchase decisions.'
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
    }
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
                ? 'Includes scenario stress tests, financing sensitivity, and multi-year projection rows'
                : 'Shows baseline output using core assumptions only'}
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
              <span className="font-medium">Lifecycle Vehicle Cost Planning Mode</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">
                Advanced mode includes sensitivity deltas, projection rows, and decision-support recommendations.
              </div>
            )}
          </div>
        )}

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Core Financing Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle Price ($)</label>
              <input type="number" min="0" value={inputs.vehiclePrice} onChange={(e) => handleInputChange('vehiclePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Down Payment ($)</label>
              <input type="number" min="0" value={inputs.downPayment} onChange={(e) => handleInputChange('downPayment', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Trade-in Value ($)</label>
              <input type="number" min="0" value={inputs.tradeInValue} onChange={(e) => handleInputChange('tradeInValue', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">APR (%)</label>
              <input type="number" min="0" step="0.01" value={inputs.aprPercent} onChange={(e) => handleInputChange('aprPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Loan Term (months)</label>
              <input type="number" min="1" value={inputs.loanTermMonths} onChange={(e) => handleInputChange('loanTermMonths', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Loan Balance ($)</label>
              <input type="number" min="0" value={inputs.currentLoanBalance} onChange={(e) => handleInputChange('currentLoanBalance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Market Value ($)</label>
              <input type="number" min="0" value={inputs.marketValue} onChange={(e) => handleInputChange('marketValue', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Annual Mileage</label>
              <input type="number" min="0" value={inputs.annualMileage} onChange={(e) => handleInputChange('annualMileage', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Variant-Specific Inputs
          </h3>

          {(variant === 'car-payment' || variant === 'auto-loan' || variant === 'interest-rate' || variant === 'early-payoff' || variant === 'refinance') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Payment ($/mo)</label>
                <input type="number" min="0" value={inputs.currentPaymentMonthly} onChange={(e) => handleInputChange('currentPaymentMonthly', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Remaining Term (months)</label>
                <input type="number" min="1" value={inputs.remainingTermMonths} onChange={(e) => handleInputChange('remainingTermMonths', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              {(variant === 'early-payoff') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Extra Payment ($/mo)</label>
                  <input type="number" min="0" value={inputs.extraPaymentMonthly} onChange={(e) => handleInputChange('extraPaymentMonthly', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                </div>
              )}
              {(variant === 'refinance') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New APR (%)</label>
                    <input type="number" min="0" step="0.01" value={inputs.newAprPercent} onChange={(e) => handleInputChange('newAprPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Refinance Fees ($)</label>
                    <input type="number" min="0" value={inputs.refinanceFees} onChange={(e) => handleInputChange('refinanceFees', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
                  </div>
                </>
              )}
            </div>
          )}

          {(variant === 'car-lease' || variant === 'lease-vs-buy') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Lease Term (months)</label>
                <input type="number" min="1" value={inputs.leaseTermMonths} onChange={(e) => handleInputChange('leaseTermMonths', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Residual (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={inputs.residualPercent} onChange={(e) => handleInputChange('residualPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Money Factor</label>
                <input type="number" min="0" step="0.0001" value={inputs.moneyFactor} onChange={(e) => handleInputChange('moneyFactor', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Acquisition Fee ($)</label>
                <input type="number" min="0" value={inputs.acquisitionFee} onChange={(e) => handleInputChange('acquisitionFee', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'car-depreciation' || variant === 'trade-in-value' || variant === 'total-cost-of-ownership' || variant === 'lease-vs-buy') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Age (years)</label>
                <input type="number" min="0" step="0.1" value={inputs.vehicleAgeYears} onChange={(e) => handleInputChange('vehicleAgeYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Depreciation (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualDepreciationPercent} onChange={(e) => handleInputChange('annualDepreciationPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Condition Adjustment (%)</label>
                <input type="number" step="0.1" value={inputs.conditionAdjustmentPercent} onChange={(e) => handleInputChange('conditionAdjustmentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'car-insurance' || variant === 'total-cost-of-ownership') && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Insurance ($)</label>
                <input type="number" min="0" value={inputs.annualInsurance} onChange={(e) => handleInputChange('annualInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Fuel ($)</label>
                <input type="number" min="0" value={inputs.annualFuel} onChange={(e) => handleInputChange('annualFuel', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Maintenance ($)</label>
                <input type="number" min="0" value={inputs.annualMaintenance} onChange={(e) => handleInputChange('annualMaintenance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Taxes and Fees ($)</label>
                <input type="number" min="0" value={inputs.annualTaxesAndFees} onChange={(e) => handleInputChange('annualTaxesAndFees', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Parking and Tolls ($)</label>
                <input type="number" min="0" value={inputs.annualParkingAndTolls} onChange={(e) => handleInputChange('annualParkingAndTolls', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'registration-fee-estimator') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Registration Base Fee ($)</label>
                <input type="number" min="0" value={inputs.registrationBaseFee} onChange={(e) => handleInputChange('registrationBaseFee', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Registration Rate (%)</label>
                <input type="number" min="0" step="0.01" value={inputs.registrationRatePercent} onChange={(e) => handleInputChange('registrationRatePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'gap-insurance') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">GAP Coverage (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={inputs.gapCoveragePercent} onChange={(e) => handleInputChange('gapCoveragePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'extended-warranty') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Warranty Cost ($)</label>
                <input type="number" min="0" value={inputs.warrantyCost} onChange={(e) => handleInputChange('warrantyCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expected Repair Cost ($)</label>
                <input type="number" min="0" value={inputs.expectedRepairCost} onChange={(e) => handleInputChange('expectedRepairCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Claim Probability (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={inputs.claimProbabilityPercent} onChange={(e) => handleInputChange('claimProbabilityPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'down-payment') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Down Payment (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={inputs.downPaymentPercent} onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target LTV (%)</label>
                <input type="number" min="1" max="100" step="0.1" value={inputs.targetLtvPercent} onChange={(e) => handleInputChange('targetLtvPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}
        </div>

        {isAdvancedMode && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Projection Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Cost Inflation (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualCostInflationPercent} onChange={(e) => handleInputChange('annualCostInflationPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced vehicle cost economics for {config.focusLabel}</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This {config.topicLabel.toLowerCase()} workflow is built for real U.S. ownership decisions and combines {narrative.keyInputs}
          with scenario sensitivity and projection context.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          Use it when your objective is to {narrative.decisionGoal}. Outputs are structured to identify the largest cost driver,
          quantify downside exposure, and provide actionable decision checkpoints.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          The model is most valuable when you stress-test {narrative.stressCase} before choosing terms or signing a contract.
        </p>
        <p className="text-base text-foreground leading-relaxed mt-4">
          Define approval rules first: {narrative.thresholdGuidance}. Then use the scenario blocks to verify the decision holds under realistic variance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Financing + Ownership Layers</h3>
            </div>
            <p className="text-sm text-muted-foreground">Centers on {narrative.keyInputs} so this {config.topicLabel.toLowerCase()} model matches real decision inputs.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Scenario + Projection Depth</h3>
            </div>
            <p className="text-sm text-muted-foreground">Scenario design is focused on {narrative.stressCase} with multi-year rows for robust planning.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Rate + Value Sensitivity</h3>
            </div>
            <p className="text-sm text-muted-foreground">Exposes sensitivity so you can enforce {narrative.thresholdGuidance} under non-ideal assumptions.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Decision-Risk Framing</h3>
            </div>
            <p className="text-sm text-muted-foreground">Applies practical guardrails and optimization levers: {narrative.optimizationLevers}.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />FAQ + Structured Content</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Driver-Focused Recommendations</span>
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
                  {result.primaryIsCurrency ? `$${result.primaryValue.toFixed(2)}${result.primarySuffix ?? ''}` : `${result.primaryValue.toFixed(2)}${result.primarySuffix ?? ''}`}
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
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Validate this factor first; it has the highest output sensitivity.</p>
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
                        <p className="font-semibold text-foreground">{scenario.value.toFixed(2)}</p>
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
                      <th className="text-left py-2 pr-3">Inflation</th>
                      <th className="text-left py-2">Annual Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projectionRows.map((row) => (
                      <tr key={row.year} className="border-b last:border-b-0">
                        <td className="py-2 pr-3">{row.year}</td>
                        <td className="py-2 pr-3">{Math.round(row.annualMiles).toLocaleString()}</td>
                        <td className="py-2 pr-3">{row.inflationRate.toFixed(1)}%</td>
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
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Build your {topicLower} baseline assumptions</h4>
              Start with realistic price, down payment, trade-in, APR, and term assumptions taken from actual lender/dealer quotes. This prevents optimistic bias in payment and total-cost outputs.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Enter {topicLower} variant-specific inputs</h4>
              Prioritize the key fields for this tool: {narrative.keyInputs}. Variant-specific assumptions are what make the result usable for real decisions.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Include full {topicLower} ownership cost layers</h4>
              Add insurance, fuel, maintenance, taxes/fees, and parking/tolls where relevant. This converts financing math into real affordability and ownership strategy.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Configure {topicLower} projection assumptions</h4>
              Use inflation and mileage-growth controls to model how costs evolve beyond today. Multi-year context is critical for lease-vs-buy, refinance, and total-cost planning.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Compare {topicLower} scenarios and sensitivity</h4>
              Review downside and upside scenarios centered on {narrative.stressCase}. This shows where small assumption shifts create large financial impact.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Translate {topicLower} output into action thresholds</h4>
              Convert outputs into policy rules: {narrative.thresholdGuidance}. Recalculate whenever quotes, values, or recurring costs move materially.
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your {topic} Results Dashboard (Popup Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Primary Decision Metric</h4>
              <p className="text-xs text-muted-foreground">Surfaces the single most relevant output for the chosen finance or ownership decision.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Supporting KPIs</h4>
              <p className="text-xs text-muted-foreground">Shows companion metrics such as total interest, break-even timing, or annualized cost impact.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Scenario Deltas</h4>
              <p className="text-xs text-muted-foreground">Quantifies downside and upside sensitivity so you can evaluate resilience before committing.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Projection Rows</h4>
              <p className="text-xs text-muted-foreground">Displays year-by-year planning context under inflation and usage-growth assumptions.</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Why Use This {topic} Calculator?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Beyond Basic {topic} Numbers</h4>
              <p className="text-xs text-muted-foreground">For {config.title}, it models {narrative.keyInputs} rather than relying on a single headline metric.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />{topic} Risk Visibility</h4>
              <p className="text-xs text-muted-foreground">Scenario analysis targets {narrative.stressCase} so decisions are resilient under downside conditions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Wallet className="h-4 w-4" />{topic} Cash-Flow Clarity</h4>
              <p className="text-xs text-muted-foreground">Separates immediate affordability from longer-run outcomes needed to {narrative.decisionGoal}.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />{topic} Actionable Planning</h4>
              <p className="text-xs text-muted-foreground">Converts outputs into explicit operating rules, including {narrative.thresholdGuidance}.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {topic} Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Tool-specific math tuned for {config.topicLabel.toLowerCase()} decisions and {narrative.keyInputs}.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Largest-driver prioritization linked to {narrative.decisionGoal} and assumption validation order.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario stress testing specifically around {narrative.stressCase} with projection rows.</span></div>
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {topic} Decision Playbook
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set {topic} Approval Limits</h4>
              <p className="text-xs text-muted-foreground">{narrative.thresholdGuidance} before reviewing final offers.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Stress-Test {topic} Weak Points</h4>
              <p className="text-xs text-muted-foreground">Pressure-test {narrative.stressCase} to confirm the decision remains resilient.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Link {topic} to Budget Policy</h4>
              <p className="text-xs text-muted-foreground">Align the selected option with household reserves, savings targets, and fixed cash-flow guardrails.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set {topic} Recheck Triggers</h4>
              <p className="text-xs text-muted-foreground">Use recheck triggers tied to {narrative.keyInputs} so stale assumptions do not drive final decisions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding {topic} Planning
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />{topic} Core Concept and Decision Context</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">This tool converts finance and ownership assumptions into planning-grade decision outputs for practical vehicle cost management.</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              For {config.topicLabel.toLowerCase()} analysis, keep the same assumption baseline while testing {narrative.stressCase} so you can identify which path remains robust.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Connects payment mechanics with long-term cost exposure.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supports repeatable recalculation as rates and prices change.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Translates assumptions into threshold-ready decision metrics.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Helps prevent headline-payment decisions that ignore full ownership impact.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major {topic} Factors Affecting Results</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              The dominant driver changes by tool. Here, the biggest swing usually comes from {narrative.keyInputs}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Vehicle price, APR, and term assumptions</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Depreciation and market-value dynamics</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Insurance, fuel, maintenance, and fee layers</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Policy terms, coverage levels, and contract fees</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Credit profile and lender overlays that shift effective pricing</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Geographic tax, registration, and fee variability across states</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Advanced {topic} Comparison Framework</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Use this structure to compare alternatives consistently: baseline path, downside case, and strategic alternative.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Method A: Baseline case using {narrative.keyInputs}</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Method B: Downside case focused on {narrative.stressCase}</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Method C: Policy-fit case enforcing {narrative.thresholdGuidance}</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Method D: Optimization case using {narrative.optimizationLevers}</div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />{topic} Threshold and Timing Guidance</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Decisions improve when you define thresholds before market conditions move.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Tool-specific threshold: {narrative.thresholdGuidance}.</li>
              <li>- Refinance threshold: monthly savings must exceed fee break-even within target window.</li>
              <li>- Lease threshold: effective lease path cost should remain below buy-path cost under downside assumptions.</li>
              <li>- Trade-in threshold: projected value floor and depreciation slope trigger timing for exit decisions.</li>
              <li>- Warranty threshold: expected claim value and risk tolerance justify coverage purchase.</li>
              <li>- Payment threshold: combined monthly payment plus operating cost must stay below your fixed budget cap.</li>
              <li>- Equity threshold: avoid decisions that lock in prolonged negative-equity risk after stress testing.</li>
            </ul>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />{topic} Financial Optimization and Assistance Options</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-3">
              Improve outcomes by combining rate shopping, fee controls, and focused levers for this calculator: {narrative.optimizationLevers}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Rate optimization: pre-approval comparisons and term alignment.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Fee optimization: acquisition, registration, refinance, and add-on controls.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Insurance optimization: deductible/coverage structure and carrier comparison cycles.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Operating-cost optimization: fuel, maintenance cadence, and usage planning.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Down-payment strategy: balance lower interest burden against liquidity needs.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Negotiation strategy: use modeled deltas to challenge fees, APR, and packaged add-ons.</div>
            </div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Practical {topic} Benefits, Risks, and Impact Summary</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Benefit: improved clarity across payment, equity, and ownership tradeoffs.</li>
              <li>- Benefit: faster decision cycles with threshold-based planning rules.</li>
              <li>- Risk: stale assumptions can quickly invalidate financing conclusions.</li>
              <li>- Risk: ignoring fees and depreciation can understate long-run cost exposure.</li>
              <li>- Impact: structured scenario reviews improve negotiation and timing outcomes.</li>
              <li>- Impact: better quote comparison reduces likelihood of high-cost contract lock-in.</li>
              <li>- Risk: focusing on best-case scenarios can hide affordability stress in normal variance.</li>
              <li>- Benefit: periodic recalculation strengthens {config.topicLabel.toLowerCase()} governance around {narrative.decisionGoal}.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: Vehicle Cost Planning Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Planning Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th>
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
          Benchmarks are planning references only. Validate with current quotes, lender terms, insurer pricing, and local fee schedules.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References & Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.consumerfinance.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB</a> - lending and financing guidance context</li>
              <li>- <a href="https://www.nhtsa.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA</a> - vehicle and safety context</li>
              <li>- <a href="https://www.irs.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS</a> - tax-related reference context</li>
              <li>- <a href="https://www.ftc.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FTC</a> - consumer protection context for vehicle finance and dealership practices</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.sae.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">SAE International</a> - automotive technical and engineering standards context</li>
              <li>- <a href="https://www.federalreserve.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Federal Reserve</a> - rate environment context for financing assumptions</li>
              <li>- <a href="https://www.consumerfinance.gov/data-research/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Research</a> - consumer lending behavior and cost context</li>
              <li>- <a href="https://www.federalreserve.gov/econres/scfindex.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Survey of Consumer Finances</a> - household debt and financing behavior context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Cost and Market Data Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. BLS CPI</a> - inflation assumptions context</li>
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Context</a> - ownership cost framing</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - fuel and efficiency cost context</li>
              <li>- <a href="https://www.energy.gov/eere/vehicles" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DOE Vehicle Technologies Office</a> - efficiency and operating-cost technology context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" />Educational and Consumer Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/whatcarshouldIbuy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/whatcarshouldIbuy</a> - practical buyer decision patterns</li>
              <li>- <a href="https://www.reddit.com/r/personalfinance/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/personalfinance</a> - financing and budgeting discussion context</li>
              <li>- <a href="https://www.nolo.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Nolo</a> - consumer financial education context</li>
              <li>- <a href="https://www.edmunds.com/car-buying/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Edmunds Car Buying Guides</a> - purchase and negotiation education context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Tool-Specific Research Focus</h3>
            <p className="text-muted-foreground">
              For {config.title}, prioritize sources covering {narrative.researchFocus}. This keeps assumptions relevant to the exact decision you are making.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator uses established finance and ownership planning methods with scenario-based assumptions for educational use. For this tool, emphasize {narrative.researchFocus} when validating assumptions. It does not replace lender disclosures, legal terms, insurer contracts, or official local fee schedules.
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

export default AdvancedVehicleCostsSuiteCalculator;
