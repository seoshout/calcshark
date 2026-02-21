'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Building2,
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
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

export type MaintenanceSuiteVariant =
  | 'battery-life'
  | 'brake-pad-life'
  | 'diagnostic-time'
  | 'diy-savings'
  | 'fleet-maintenance'
  | 'labor-rate'
  | 'maintenance-schedule'
  | 'parts-markup'
  | 'repair-vs-replace'
  | 'service-cost-estimator'
  | 'tire-pressure'
  | 'tire-size'
  | 'warranty-coverage';

interface AdvancedMaintenanceSuiteCalculatorProps {
  variant: MaintenanceSuiteVariant;
}

interface Inputs {
  annualMiles: string;
  fuelPrice: string;
  mpgCurrent: string;

  laborRate: string;
  serviceHours: string;
  partsCost: string;
  partsMarkupPercent: string;
  miscFees: string;

  batteryAgeYears: string;
  batteryWarrantyYears: string;
  batteryReplacementCost: string;

  padThicknessMm: string;
  minimumPadThicknessMm: string;
  wearPer10kMilesMm: string;

  baseDiagnosticHours: string;
  diagnosticComplexityMultiplier: string;

  diyHours: string;
  shopHours: string;
  valueOfTimeRate: string;

  fleetVehicleCount: string;
  maintenanceEventsPerYear: string;

  baseTechWage: string;
  shopOverheadPercent: string;
  targetMarginPercent: string;

  currentOdometer: string;
  lastServiceOdometer: string;
  serviceIntervalMiles: string;

  repairCostNow: string;
  replacementCostNow: string;
  expectedYearsHorizon: string;
  annualRepairGrowthPercent: string;

  claimAmount: string;
  deductible: string;
  warrantyCoveragePercent: string;

  tirePressureCurrentPsi: string;
  tirePressureRecommendedPsi: string;

  tireWidthMm: string;
  tireAspectRatio: string;
  tireRimDiameterIn: string;
  oldTireWidthMm: string;
  oldTireAspectRatio: string;
  oldTireRimDiameterIn: string;

  downtimeHours: string;
  downtimeCostPerHour: string;
  includeDowntimeCosts: boolean;

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

interface MaintenanceVariantNarrative {
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

const VARIANT_CONFIG: Record<MaintenanceSuiteVariant, VariantConfig> = {
  'battery-life': {
    title: 'Battery Life Calculator',
    subtitle: 'Advanced battery remaining-life and replacement planning',
    calculateButtonLabel: 'Calculate Battery Life',
    topicLabel: 'Battery Life',
    focusLabel: 'remaining battery life and replacement budget timing'
  },
  'brake-pad-life': {
    title: 'Brake Pad Life Calculator',
    subtitle: 'Advanced pad wear, miles remaining, and service timing',
    calculateButtonLabel: 'Calculate Brake Pad Life',
    topicLabel: 'Brake Pad Life',
    focusLabel: 'remaining pad distance and safety-oriented service timing'
  },
  'diagnostic-time': {
    title: 'Diagnostic Time Calculator',
    subtitle: 'Advanced diagnostic hour and labor-cost estimation',
    calculateButtonLabel: 'Calculate Diagnostic Time',
    topicLabel: 'Diagnostic Time',
    focusLabel: 'diagnostic labor hours and shop capacity planning'
  },
  'diy-savings': {
    title: 'DIY Savings Calculator',
    subtitle: 'Advanced DIY vs shop cost comparison and net savings',
    calculateButtonLabel: 'Calculate DIY Savings',
    topicLabel: 'DIY Savings',
    focusLabel: 'DIY versus professional service cost tradeoffs'
  },
  'fleet-maintenance': {
    title: 'Fleet Maintenance Calculator',
    subtitle: 'Advanced multi-vehicle maintenance budget and variance planning',
    calculateButtonLabel: 'Calculate Fleet Maintenance',
    topicLabel: 'Fleet Maintenance',
    focusLabel: 'fleet-wide maintenance spend and schedule exposure'
  },
  'labor-rate': {
    title: 'Labor Rate Calculator',
    subtitle: 'Advanced fully burdened labor-rate and margin modeling',
    calculateButtonLabel: 'Calculate Labor Rate',
    topicLabel: 'Labor Rate',
    focusLabel: 'fully burdened labor-rate sustainability and margin'
  },
  'maintenance-schedule': {
    title: 'Maintenance Schedule Calculator',
    subtitle: 'Advanced next-service mileage and interval risk planning',
    calculateButtonLabel: 'Calculate Maintenance Schedule',
    topicLabel: 'Maintenance Schedule',
    focusLabel: 'next service timing and interval risk management'
  },
  'parts-markup': {
    title: 'Parts Markup Calculator',
    subtitle: 'Advanced markup, margin, and service-ticket contribution analysis',
    calculateButtonLabel: 'Calculate Parts Markup',
    topicLabel: 'Parts Markup',
    focusLabel: 'parts pricing strategy and gross margin quality'
  },
  'repair-vs-replace': {
    title: 'Repair vs Replace Calculator',
    subtitle: 'Advanced lifecycle-cost comparison for repair decisions',
    calculateButtonLabel: 'Calculate Repair vs Replace',
    topicLabel: 'Repair vs Replace',
    focusLabel: 'repair escalation risk versus replacement economics'
  },
  'service-cost-estimator': {
    title: 'Service Cost Estimator Calculator',
    subtitle: 'Advanced service ticket estimate with labor, parts, and overhead',
    calculateButtonLabel: 'Estimate Service Cost',
    topicLabel: 'Service Cost Estimation',
    focusLabel: 'complete service ticket costing and pricing'
  },
  'tire-pressure': {
    title: 'Tire Pressure Calculator',
    subtitle: 'Advanced pressure deviation impact on fuel and wear costs',
    calculateButtonLabel: 'Calculate Tire Pressure Impact',
    topicLabel: 'Tire Pressure',
    focusLabel: 'pressure deviation, efficiency loss, and wear risk'
  },
  'tire-size': {
    title: 'Tire Size Calculator',
    subtitle: 'Advanced tire diameter and fitment variance analysis',
    calculateButtonLabel: 'Calculate Tire Size',
    topicLabel: 'Tire Size',
    focusLabel: 'diameter change, fitment variance, and speed impact context'
  },
  'warranty-coverage': {
    title: 'Warranty Coverage Calculator',
    subtitle: 'Advanced covered vs out-of-pocket service claim analysis',
    calculateButtonLabel: 'Calculate Warranty Coverage',
    topicLabel: 'Warranty Coverage',
    focusLabel: 'warranty claim coverage and out-of-pocket exposure'
  }
};

const MAINTENANCE_VARIANT_NARRATIVE: Record<MaintenanceSuiteVariant, MaintenanceVariantNarrative> = {
  'battery-life': {
    keyInputs: 'battery age, warranty horizon, replacement cost, and usage intensity',
    decisionGoal: 'time battery replacement before failure risk and emergency costs spike',
    stressCase: 'cold-weather degradation, short-trip usage, and charging-system volatility',
    thresholdGuidance: 'schedule replacement when remaining-life confidence drops below your reliability threshold',
    optimizationLevers: 'preventive testing cadence, parasitic-load checks, and warranty-timing strategy',
    benchmarkLabel: 'Remaining Battery Window',
    benchmarkRange: '3 - 24',
    benchmarkUnit: 'months',
    benchmarkNote: 'Supports proactive replacement scheduling.',
    researchFocus: 'battery degradation behavior and preventive replacement timing standards'
  },
  'brake-pad-life': {
    keyInputs: 'current pad thickness, minimum safe thickness, wear rate, and annual miles',
    decisionGoal: 'estimate safe service window and avoid late brake interventions',
    stressCase: 'aggressive stop-go driving, heavy loads, and accelerated wear rates',
    thresholdGuidance: 'book service once projected safe-mile buffer falls below your risk tolerance',
    optimizationLevers: 'braking-style coaching, tire/rotor condition checks, and inspection frequency tuning',
    benchmarkLabel: 'Pad Safety Buffer',
    benchmarkRange: '1,000 - 8,000+',
    benchmarkUnit: 'miles remaining',
    benchmarkNote: 'Helps plan service before safety margin narrows.',
    researchFocus: 'brake wear progression and safety-threshold maintenance practices'
  },
  'diagnostic-time': {
    keyInputs: 'base diagnostic hours, complexity multipliers, and fully burdened labor rate',
    decisionGoal: 'scope diagnostic effort and control labor-variance risk',
    stressCase: 'multi-system faults, intermittent symptoms, and extended test cycles',
    thresholdGuidance: 'approve expanded diagnostic scope only if expected value exceeds added labor exposure',
    optimizationLevers: 'structured symptom capture, staged diagnostics, and escalation checkpoints',
    benchmarkLabel: 'Diagnostic Complexity',
    benchmarkRange: '1.0x - 2.5x+',
    benchmarkUnit: 'base labor multiplier',
    benchmarkNote: 'Converts complexity into planning hours.',
    researchFocus: 'automotive diagnostic workflow standards and labor-time variance management'
  },
  'diy-savings': {
    keyInputs: 'DIY labor hours, shop hours, parts costs, and personal time valuation',
    decisionGoal: 'determine when DIY truly saves money after time-cost adjustments',
    stressCase: 'tool purchases, rework probability, and longer-than-expected completion time',
    thresholdGuidance: 'choose DIY only when net adjusted savings remain positive under conservative assumptions',
    optimizationLevers: 'task selection discipline, prep planning, and post-job quality checks',
    benchmarkLabel: 'Net DIY Savings',
    benchmarkRange: '-$200 to +$1,200+',
    benchmarkUnit: 'per job',
    benchmarkNote: 'Negative values indicate professional service is more efficient.',
    researchFocus: 'DIY economics, rework risk, and time-valuation tradeoff analysis'
  },
  'fleet-maintenance': {
    keyInputs: 'vehicle count, maintenance frequency, labor and parts layers, and downtime assumptions',
    decisionGoal: 'forecast fleet-wide maintenance exposure and service-capacity needs',
    stressCase: 'parts lead-time shocks, labor shortages, and synchronized service peaks',
    thresholdGuidance: 'set fleet reserve thresholds that absorb high-variance quarters without service delays',
    optimizationLevers: 'preventive batching, vendor diversification, and uptime-priority scheduling',
    benchmarkLabel: 'Fleet Cost per Vehicle',
    benchmarkRange: '$900 - $4,500+',
    benchmarkUnit: 'annualized per unit',
    benchmarkNote: 'Useful for cross-fleet benchmarking.',
    researchFocus: 'fleet maintenance cost normalization and uptime-risk planning frameworks'
  },
  'labor-rate': {
    keyInputs: 'technician wage base, overhead allocation, target margin, and utilization assumptions',
    decisionGoal: 'set sustainable labor rates without margin erosion',
    stressCase: 'utilization dips, wage inflation, and overhead expansion',
    thresholdGuidance: 'reprice when fully burdened labor cost approaches target-margin floor',
    optimizationLevers: 'utilization improvement, overhead discipline, and tiered service pricing',
    benchmarkLabel: 'Burdened Labor Multiple',
    benchmarkRange: '1.6x - 2.8x',
    benchmarkUnit: 'wage-to-bill rate',
    benchmarkNote: 'Shows pricing resilience against cost inflation.',
    researchFocus: 'shop labor economics and fully burdened rate construction'
  },
  'maintenance-schedule': {
    keyInputs: 'current odometer, last service mileage, interval standards, and duty cycle',
    decisionGoal: 'predict service due windows and reduce missed-interval risk',
    stressCase: 'high-mile months, severe-duty use, and deferred maintenance backlog',
    thresholdGuidance: 'treat interval overruns as risk triggers, not optional deferrals',
    optimizationLevers: 'calendar-plus-mileage scheduling, severe-duty adjustments, and reminder automation',
    benchmarkLabel: 'Interval Compliance',
    benchmarkRange: '90% - 105%',
    benchmarkUnit: 'of target interval',
    benchmarkNote: 'Values above 100% indicate overdue risk.',
    researchFocus: 'preventive maintenance intervals and severe-duty adjustment practices'
  },
  'parts-markup': {
    keyInputs: 'parts acquisition cost, markup policy, expected volume, and margin requirements',
    decisionGoal: 'optimize parts pricing for margin without damaging close rates',
    stressCase: 'supplier price spikes, low-volume jobs, and competitive pricing pressure',
    thresholdGuidance: 'adjust markup bands when margin or conversion metrics drift outside policy',
    optimizationLevers: 'markup tiering, supplier negotiations, and quote transparency strategy',
    benchmarkLabel: 'Gross Margin on Parts',
    benchmarkRange: '18% - 45%+',
    benchmarkUnit: 'after discounts',
    benchmarkNote: 'Tracks profitability sustainability of parts pricing.',
    researchFocus: 'parts pricing strategy, markup elasticity, and service-ticket margin health'
  },
  'repair-vs-replace': {
    keyInputs: 'current repair cost, replacement alternative, escalation rate, and planning horizon',
    decisionGoal: 'compare lifecycle economics before committing to repeat repairs',
    stressCase: 'repair recurrence, cost escalation, and reliability deterioration',
    thresholdGuidance: 'replace when cumulative risk-adjusted repair path exceeds replacement value',
    optimizationLevers: 'failure-history tracking, staged replacement planning, and resale-timing alignment',
    benchmarkLabel: 'Repair-Replacement Crossover',
    benchmarkRange: '12 - 48+',
    benchmarkUnit: 'months',
    benchmarkNote: 'Estimated point where replacement becomes economically superior.',
    researchFocus: 'repair escalation modeling and replacement crossover decision frameworks'
  },
  'service-cost-estimator': {
    keyInputs: 'labor time, labor rate, parts package, fees, and downtime exposure',
    decisionGoal: 'build full-scope estimates that reflect true ticket economics',
    stressCase: 'scope creep, extra parts demand, and unexpected labor extension',
    thresholdGuidance: 'include contingency bands before presenting final customer or internal approvals',
    optimizationLevers: 'scope definition quality, parts pre-verification, and estimate variance tracking',
    benchmarkLabel: 'Estimate Variance Band',
    benchmarkRange: '5% - 20%',
    benchmarkUnit: 'actual vs estimate',
    benchmarkNote: 'Lower variance signals stronger estimating process control.',
    researchFocus: 'service estimate accuracy, scope control, and cost-variance reduction methods'
  },
  'tire-pressure': {
    keyInputs: 'current PSI, recommended PSI, usage profile, and fuel/tires impact assumptions',
    decisionGoal: 'quantify efficiency and wear penalties from pressure deviation',
    stressCase: 'seasonal pressure swings, underinflation persistence, and high-speed operation',
    thresholdGuidance: 'correct pressure deviation immediately when efficiency or wear loss exceeds policy tolerance',
    optimizationLevers: 'routine pressure checks, seasonal adjustment cadence, and TPMS validation',
    benchmarkLabel: 'Pressure Deviation',
    benchmarkRange: '0 - 8+',
    benchmarkUnit: 'PSI from target',
    benchmarkNote: 'Higher deviation increases wear and fuel penalties.',
    researchFocus: 'tire pressure efficiency effects and tread-wear risk progression'
  },
  'tire-size': {
    keyInputs: 'new and baseline tire dimensions, diameter variance, and speedometer impact',
    decisionGoal: 'evaluate fitment and performance implications before tire changes',
    stressCase: 'large diameter deviations, clearance issues, and gearing/speed offset effects',
    thresholdGuidance: 'keep diameter variance within acceptable band before approving size changes',
    optimizationLevers: 'fitment checks, load-index validation, and alignment with manufacturer guidance',
    benchmarkLabel: 'Diameter Variance',
    benchmarkRange: '-3% to +3%',
    benchmarkUnit: 'vs OEM baseline',
    benchmarkNote: 'Outside this band may affect calibration and drivability.',
    researchFocus: 'tire fitment geometry, speedometer variance, and compatibility constraints'
  },
  'warranty-coverage': {
    keyInputs: 'claim amount, deductible, covered percentage, and policy exclusions',
    decisionGoal: 'estimate covered payout and expected out-of-pocket exposure',
    stressCase: 'partial denials, deductible stacking, and excluded component failure',
    thresholdGuidance: 'treat high residual out-of-pocket outcomes as a signal to revisit coverage structure',
    optimizationLevers: 'coverage-scope audit, deductible strategy, and claim documentation readiness',
    benchmarkLabel: 'Out-of-Pocket Residual',
    benchmarkRange: '$0 - $2,500+',
    benchmarkUnit: 'per claim event',
    benchmarkNote: 'Captures claim cost that remains after policy response.',
    researchFocus: 'warranty claim mechanics, coverage limits, and residual-risk planning'
  }
};

const defaultInputs: Inputs = {
  annualMiles: '15000',
  fuelPrice: '3.65',
  mpgCurrent: '27',

  laborRate: '145',
  serviceHours: '2.5',
  partsCost: '280',
  partsMarkupPercent: '35',
  miscFees: '45',

  batteryAgeYears: '3.2',
  batteryWarrantyYears: '5',
  batteryReplacementCost: '310',

  padThicknessMm: '7',
  minimumPadThicknessMm: '3',
  wearPer10kMilesMm: '1.4',

  baseDiagnosticHours: '1.2',
  diagnosticComplexityMultiplier: '1.6',

  diyHours: '4.5',
  shopHours: '2.7',
  valueOfTimeRate: '45',

  fleetVehicleCount: '18',
  maintenanceEventsPerYear: '3',

  baseTechWage: '42',
  shopOverheadPercent: '65',
  targetMarginPercent: '18',

  currentOdometer: '68240',
  lastServiceOdometer: '63120',
  serviceIntervalMiles: '7500',

  repairCostNow: '1400',
  replacementCostNow: '5600',
  expectedYearsHorizon: '5',
  annualRepairGrowthPercent: '12',

  claimAmount: '1850',
  deductible: '150',
  warrantyCoveragePercent: '75',

  tirePressureCurrentPsi: '30',
  tirePressureRecommendedPsi: '35',

  tireWidthMm: '235',
  tireAspectRatio: '45',
  tireRimDiameterIn: '18',
  oldTireWidthMm: '225',
  oldTireAspectRatio: '50',
  oldTireRimDiameterIn: '17',

  downtimeHours: '6',
  downtimeCostPerHour: '95',
  includeDowntimeCosts: true,

  annualCostInflationPercent: '3.5',
  annualMilesGrowthPercent: '1',
  planningYears: '5'
};

const parseNumber = (value: string, floor = 0): number => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    return floor;
  }
  return parsed;
};

const parseNonNegative = (value: string): number => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
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

const tireDiameterMm = (width: number, aspect: number, rimIn: number): number => {
  return rimIn * 25.4 + 2 * width * (aspect / 100);
};

const buildFaqItems = (variant: MaintenanceSuiteVariant): FAQItem[] => {
  const common: FAQItem[] = [
    {
      question: 'How often should I update assumptions in this calculator?',
      answer: 'Quarterly updates are a practical baseline, with immediate updates after major cost, usage, or policy changes.',
      category: 'Workflow'
    },
    {
      question: 'Is this calculator sufficient for final legal or warranty decisions?',
      answer: 'No. It is a planning tool. Always verify legal, policy, and warranty terms with official documentation.',
      category: 'Limitations'
    },
    {
      question: 'Can this be used for both household and business planning?',
      answer: 'Yes. It supports personal and professional planning, but business decisions should include broader overhead and compliance factors.',
      category: 'Use Cases'
    }
  ];

  const variantFaqs: Record<MaintenanceSuiteVariant, FAQItem[]> = {
    'battery-life': [
      {
        question: 'How is remaining battery life estimated here?',
        answer: 'It estimates remaining life against warranty horizon and age assumptions, then converts to planning and budget context.',
        category: 'Method'
      },
      {
        question: 'Does climate affect battery lifespan?',
        answer: 'Yes. Temperature extremes can affect real-world battery degradation and replacement timing.',
        category: 'Conditions'
      },
      {
        question: 'Should replacement cost be annualized?',
        answer: 'Annualizing replacement cost helps budgeting and reserve planning before actual replacement timing.',
        category: 'Budgeting'
      },
      {
        question: 'Can maintenance habits change battery life?',
        answer: 'Yes. Electrical load management and charging system health influence battery longevity.',
        category: 'Maintenance'
      },
      {
        question: 'When should I treat replacement as urgent?',
        answer: 'When remaining life margin narrows and reliability risk rises, schedule proactive replacement windows.',
        category: 'Decision'
      },
      {
        question: 'Is warranty period equal to actual lifespan?',
        answer: 'Not always. Warranty period is a coverage boundary, not a guarantee of actual lifespan.',
        category: 'Warranty'
      },
      {
        question: 'How can I reduce sudden battery-failure risk?',
        answer: 'Use periodic inspection and age-based replacement planning rather than waiting for failure.',
        category: 'Risk'
      }
    ],
    'brake-pad-life': [
      {
        question: 'How is brake pad life estimated?',
        answer: 'It uses current thickness, minimum allowable thickness, and wear rate assumptions to estimate miles remaining.',
        category: 'Formula'
      },
      {
        question: 'Why can pad wear rate vary widely?',
        answer: 'Driving style, traffic profile, vehicle weight, and route elevation materially affect wear rates.',
        category: 'Variance'
      },
      {
        question: 'Is miles remaining enough for safety decisions?',
        answer: 'No. Use miles remaining with inspection findings and braking performance indicators.',
        category: 'Safety'
      },
      {
        question: 'Can city driving shorten pad life?',
        answer: 'Yes. Frequent stop-and-go operation generally increases brake-pad wear.',
        category: 'Conditions'
      },
      {
        question: 'Should pad and rotor planning be linked?',
        answer: 'Yes. Coordinating pad and rotor service can reduce repeat labor exposure.',
        category: 'Optimization'
      },
      {
        question: 'How often should wear assumptions be refreshed?',
        answer: 'Refresh after inspections or when usage pattern changes significantly.',
        category: 'Workflow'
      },
      {
        question: 'What margin is prudent before replacement?',
        answer: 'Use conservative thresholds rather than running near minimum thickness limits.',
        category: 'Risk'
      }
    ],
    'diagnostic-time': [
      {
        question: 'How is diagnostic time estimated?',
        answer: 'Diagnostic time is modeled from baseline hours adjusted by complexity multipliers.',
        category: 'Formula'
      },
      {
        question: 'Why include complexity multiplier?',
        answer: 'Complexity captures variability in fault isolation effort and diagnostic workflow depth.',
        category: 'Method'
      },
      {
        question: 'Can diagnostic overruns be planned?',
        answer: 'Yes. Use scenario buffers for high-complexity and multi-system faults.',
        category: 'Planning'
      },
      {
        question: 'Should labor rate be linked to diagnostic planning?',
        answer: 'Yes. Labor rate directly affects cost impact of diagnostic-time variance.',
        category: 'Cost'
      },
      {
        question: 'How can shops reduce diagnostic variance?',
        answer: 'Structured intake, historical job libraries, and standardized diagnostic flow can help.',
        category: 'Operations'
      },
      {
        question: 'Can this be used for quote preparation?',
        answer: 'Yes for planning; final quotes should include scope and authorization terms.',
        category: 'Business'
      },
      {
        question: 'What is a useful monitoring cadence?',
        answer: 'Track planned vs actual diagnostic hours weekly or monthly by job type.',
        category: 'Workflow'
      }
    ],
    'diy-savings': [
      {
        question: 'How are DIY savings calculated?',
        answer: 'DIY savings compare shop labor+markup costs against DIY parts and time-value assumptions.',
        category: 'Formula'
      },
      {
        question: 'Why include value-of-time in DIY math?',
        answer: 'Ignoring time value can overstate apparent DIY savings for complex jobs.',
        category: 'Method'
      },
      {
        question: 'When can DIY be riskier financially?',
        answer: 'High-complexity jobs with rework risk can erase expected savings.',
        category: 'Risk'
      },
      {
        question: 'Should tool costs be included?',
        answer: 'Yes. Tool and consumable costs should be included for realistic first-time DIY comparisons.',
        category: 'Cost'
      },
      {
        question: 'How can I improve DIY decision quality?',
        answer: 'Classify jobs by complexity and include downside scenarios before starting.',
        category: 'Decision'
      },
      {
        question: 'Is DIY always cheaper?',
        answer: 'Not always. Time, tools, and rework probability can change total economics.',
        category: 'Tradeoffs'
      },
      {
        question: 'Can this support household budgeting?',
        answer: 'Yes. It helps compare annual maintenance strategy costs under different job mixes.',
        category: 'Budgeting'
      }
    ],
    'fleet-maintenance': [
      {
        question: 'What does fleet maintenance output represent?',
        answer: 'It estimates annual fleet maintenance spend from per-event costs, event frequency, and vehicle count.',
        category: 'Basics'
      },
      {
        question: 'Why does event frequency matter?',
        answer: 'Frequency multiplies per-event cost across the fleet and often dominates total spend.',
        category: 'Drivers'
      },
      {
        question: 'Should downtime be included?',
        answer: 'Yes. Downtime can materially affect total maintenance economics beyond direct invoice costs.',
        category: 'Total Cost'
      },
      {
        question: 'How can fleets reduce maintenance variance?',
        answer: 'Use preventative schedules, standardized parts strategy, and exception tracking.',
        category: 'Optimization'
      },
      {
        question: 'Can this model support annual budget setting?',
        answer: 'Yes. It is suitable for budget planning with scenario ranges and refresh cadence.',
        category: 'Budgeting'
      },
      {
        question: 'How often should fleet assumptions be revisited?',
        answer: 'At least quarterly and after major usage or supplier-cost changes.',
        category: 'Workflow'
      },
      {
        question: 'What is a common planning mistake?',
        answer: 'Ignoring downtime and only tracking invoice costs often understates total fleet impact.',
        category: 'Pitfalls'
      }
    ],
    'labor-rate': [
      {
        question: 'How is fully burdened labor rate estimated?',
        answer: 'It combines base wage with overhead and target margin assumptions.',
        category: 'Formula'
      },
      {
        question: 'Why separate wage and overhead?',
        answer: 'Separating them clarifies cost structure and improves pricing transparency.',
        category: 'Method'
      },
      {
        question: 'How does margin target affect recommended rate?',
        answer: 'Higher margin targets increase calculated rate to maintain business sustainability.',
        category: 'Pricing'
      },
      {
        question: 'Can labor-rate mispricing harm operations?',
        answer: 'Yes. Underpricing can compress margins and reduce reinvestment capacity.',
        category: 'Risk'
      },
      {
        question: 'Should labor rates be reviewed periodically?',
        answer: 'Yes. Rate reviews should align with wage, overhead, and market condition changes.',
        category: 'Workflow'
      },
      {
        question: 'Can this help with quote standardization?',
        answer: 'Yes. It provides a structured baseline for consistent labor-pricing policy.',
        category: 'Operations'
      },
      {
        question: 'What is a practical check after setting rates?',
        answer: 'Compare projected vs realized gross margin on completed jobs monthly.',
        category: 'Validation'
      }
    ],
    'maintenance-schedule': [
      {
        question: 'How is next service point calculated?',
        answer: 'It compares miles since last service to interval miles to estimate miles remaining to next service.',
        category: 'Formula'
      },
      {
        question: 'Why convert miles to months?',
        answer: 'Month conversion helps calendar-based planning and service-window scheduling.',
        category: 'Planning'
      },
      {
        question: 'Can interval assumptions change?',
        answer: 'Yes. Driving severity and manufacturer guidance can require interval adjustments.',
        category: 'Conditions'
      },
      {
        question: 'Should overdue service be handled differently?',
        answer: 'Yes. Overdue windows should trigger priority actions and risk mitigation.',
        category: 'Risk'
      },
      {
        question: 'Can this support fleet schedule coordination?',
        answer: 'Yes. It can guide service staggering to reduce simultaneous downtime.',
        category: 'Fleet'
      },
      {
        question: 'How often should schedule inputs be refreshed?',
        answer: 'Refresh monthly or whenever mileage trends materially shift.',
        category: 'Workflow'
      },
      {
        question: 'What is a common scheduling error?',
        answer: 'Using fixed dates without mileage context can misalign actual service needs.',
        category: 'Pitfalls'
      }
    ],
    'parts-markup': [
      {
        question: 'How is parts markup calculated?',
        answer: 'Markup is based on parts cost multiplied by markup percentage to derive selling price.',
        category: 'Formula'
      },
      {
        question: 'How is margin different from markup?',
        answer: 'Markup is based on cost; margin is based on selling price.',
        category: 'Definitions'
      },
      {
        question: 'Why should margin be monitored with markup?',
        answer: 'Markup alone can hide margin quality under varying supplier costs.',
        category: 'Method'
      },
      {
        question: 'Can aggressive markup hurt close rates?',
        answer: 'Yes. Excessive markup may reduce conversion and trust in competitive markets.',
        category: 'Pricing'
      },
      {
        question: 'Should parts strategy be standardized?',
        answer: 'Yes. Standardization reduces pricing inconsistency and quote variance.',
        category: 'Operations'
      },
      {
        question: 'How often should markup assumptions be updated?',
        answer: 'Update with supplier cost changes and periodic margin review cycles.',
        category: 'Workflow'
      },
      {
        question: 'What is a practical control metric?',
        answer: 'Track realized gross margin by part category monthly.',
        category: 'Validation'
      }
    ],
    'repair-vs-replace': [
      {
        question: 'What does repair vs replace compare?',
        answer: 'It compares projected repair path costs against replacement cost over a planning horizon.',
        category: 'Basics'
      },
      {
        question: 'Why include repair-cost growth?',
        answer: 'Escalating repair costs can shift economics quickly over multiple years.',
        category: 'Drivers'
      },
      {
        question: 'Should downtime be included?',
        answer: 'Yes. Downtime can be a major hidden cost in repeated repair scenarios.',
        category: 'Total Cost'
      },
      {
        question: 'Can replacement be justified before failure?',
        answer: 'Yes. Replacement can be economically rational when repair risk and variance are high.',
        category: 'Decision'
      },
      {
        question: 'How can uncertainty be handled?',
        answer: 'Use scenario ranges for repair growth, downtime, and horizon assumptions.',
        category: 'Risk'
      },
      {
        question: 'How often should this decision be revisited?',
        answer: 'Revisit after major repairs, usage shifts, or material cost changes.',
        category: 'Workflow'
      },
      {
        question: 'What is a common mistake?',
        answer: 'Comparing only immediate invoice amounts without lifecycle context.',
        category: 'Pitfalls'
      }
    ],
    'service-cost-estimator': [
      {
        question: 'How is service ticket cost estimated?',
        answer: 'It combines labor, parts with markup, and additional fees into a total estimate.',
        category: 'Formula'
      },
      {
        question: 'Why include parts markup and misc fees?',
        answer: 'Excluding either can materially understate actual ticket totals.',
        category: 'Method'
      },
      {
        question: 'Can this support quote preparation?',
        answer: 'Yes, as a planning baseline before final scope confirmation.',
        category: 'Operations'
      },
      {
        question: 'How can quote variance be reduced?',
        answer: 'Standardize labor assumptions and fee treatment across service categories.',
        category: 'Optimization'
      },
      {
        question: 'Should downtime be factored for business clients?',
        answer: 'Yes. Downtime can materially change client-side economics.',
        category: 'Business'
      },
      {
        question: 'How often should rate inputs be reviewed?',
        answer: 'Review monthly or quarterly depending on supplier and wage volatility.',
        category: 'Workflow'
      },
      {
        question: 'What should be validated after completion?',
        answer: 'Compare estimated vs actual labor and parts realization for continuous improvement.',
        category: 'Validation'
      }
    ],
    'tire-pressure': [
      {
        question: 'How does tire pressure affect costs?',
        answer: 'Pressure deviation can impact fuel efficiency, wear rates, and replacement cadence.',
        category: 'Basics'
      },
      {
        question: 'How is pressure deviation treated in this tool?',
        answer: 'Deviation from recommended PSI is translated into estimated efficiency and annual cost impact.',
        category: 'Method'
      },
      {
        question: 'Does underinflation always increase fuel cost?',
        answer: 'Generally yes, because rolling resistance tends to increase with underinflation.',
        category: 'Efficiency'
      },
      {
        question: 'Can pressure planning reduce tire replacement risk?',
        answer: 'Yes. Consistent pressure management supports more even wear and better tire life.',
        category: 'Maintenance'
      },
      {
        question: 'How often should tire pressure be checked?',
        answer: 'Regularly and before long trips, with seasonal checks as temperature changes.',
        category: 'Workflow'
      },
      {
        question: 'Is one PSI adjustment meaningful?',
        answer: 'Small PSI shifts can compound over annual mileage and should not be ignored.',
        category: 'Sensitivity'
      },
      {
        question: 'What is a practical best practice?',
        answer: 'Use manufacturer recommendations and maintain a periodic check schedule.',
        category: 'Best Practice'
      }
    ],
    'tire-size': [
      {
        question: 'How is tire size difference estimated?',
        answer: 'The tool compares old and new tire diameter from width, aspect ratio, and rim diameter inputs.',
        category: 'Formula'
      },
      {
        question: 'Why does diameter difference matter?',
        answer: 'Diameter changes can affect speedometer behavior, fitment, and gearing context.',
        category: 'Impact'
      },
      {
        question: 'Can larger tires always improve performance?',
        answer: 'Not always. Larger tires may alter handling, efficiency, and clearance requirements.',
        category: 'Tradeoffs'
      },
      {
        question: 'Should fitment be verified beyond diameter math?',
        answer: 'Yes. Clearance and manufacturer guidance should be validated before purchase.',
        category: 'Safety'
      },
      {
        question: 'Can tire size changes affect costs?',
        answer: 'Yes. Size changes can influence fuel use, replacement pricing, and wear profile.',
        category: 'Cost'
      },
      {
        question: 'How often should size planning be revisited?',
        answer: 'Before each replacement cycle or performance setup change.',
        category: 'Workflow'
      },
      {
        question: 'What is a common planning mistake?',
        answer: 'Evaluating only appearance without checking fitment and efficiency implications.',
        category: 'Pitfalls'
      }
    ],
    'warranty-coverage': [
      {
        question: 'How is covered amount estimated?',
        answer: 'Covered amount is calculated from eligible claim amount after deductible, multiplied by coverage percentage.',
        category: 'Formula'
      },
      {
        question: 'Why include deductible in planning?',
        answer: 'Deductible directly affects out-of-pocket exposure and claim economics.',
        category: 'Drivers'
      },
      {
        question: 'Can high coverage still leave large out-of-pocket costs?',
        answer: 'Yes. Deductibles, exclusions, and non-covered scope can materially increase exposure.',
        category: 'Risk'
      },
      {
        question: 'Should coverage assumptions be validated against policy terms?',
        answer: 'Always. Policy language and exclusions control actual claim outcomes.',
        category: 'Compliance'
      },
      {
        question: 'How can this support service decision timing?',
        answer: 'It helps evaluate expected coverage and out-of-pocket impact before authorizing work.',
        category: 'Decision'
      },
      {
        question: 'How often should warranty assumptions be updated?',
        answer: 'Update when policy terms, coverage windows, or deductible conditions change.',
        category: 'Workflow'
      },
      {
        question: 'What is a practical next step after estimate?',
        answer: 'Confirm pre-authorization requirements and covered scope with warranty provider.',
        category: 'Operations'
      }
    ]
  };

  return [...variantFaqs[variant], ...common].slice(0, 10);
};

const AdvancedMaintenanceSuiteCalculator = ({ variant }: AdvancedMaintenanceSuiteCalculatorProps) => {
  const config = VARIANT_CONFIG[variant];
  const narrative = MAINTENANCE_VARIANT_NARRATIVE[variant];
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

  const calculate = () => {
    const annualMiles = parseNonNegative(inputs.annualMiles);
    const fuelPrice = parseNonNegative(inputs.fuelPrice);
    const mpgCurrent = Math.max(1, parseNonNegative(inputs.mpgCurrent));

    const laborRate = parseNonNegative(inputs.laborRate);
    const serviceHours = parseNonNegative(inputs.serviceHours);
    const partsCost = parseNonNegative(inputs.partsCost);
    const partsMarkupPercent = parseNonNegative(inputs.partsMarkupPercent);
    const miscFees = parseNonNegative(inputs.miscFees);

    const batteryAgeYears = parseNonNegative(inputs.batteryAgeYears);
    const batteryWarrantyYears = Math.max(0.1, parseNonNegative(inputs.batteryWarrantyYears));
    const batteryReplacementCost = parseNonNegative(inputs.batteryReplacementCost);

    const padThicknessMm = parseNonNegative(inputs.padThicknessMm);
    const minimumPadThicknessMm = parseNonNegative(inputs.minimumPadThicknessMm);
    const wearPer10kMilesMm = Math.max(0.01, parseNonNegative(inputs.wearPer10kMilesMm));

    const baseDiagnosticHours = parseNonNegative(inputs.baseDiagnosticHours);
    const diagnosticComplexityMultiplier = Math.max(0.5, parseNonNegative(inputs.diagnosticComplexityMultiplier));

    const diyHours = parseNonNegative(inputs.diyHours);
    const shopHours = parseNonNegative(inputs.shopHours);
    const valueOfTimeRate = parseNonNegative(inputs.valueOfTimeRate);

    const fleetVehicleCount = parseNonNegative(inputs.fleetVehicleCount);
    const maintenanceEventsPerYear = parseNonNegative(inputs.maintenanceEventsPerYear);

    const baseTechWage = parseNonNegative(inputs.baseTechWage);
    const shopOverheadPercent = parseNonNegative(inputs.shopOverheadPercent);
    const targetMarginPercent = parseNonNegative(inputs.targetMarginPercent);

    const currentOdometer = parseNonNegative(inputs.currentOdometer);
    const lastServiceOdometer = parseNonNegative(inputs.lastServiceOdometer);
    const serviceIntervalMiles = Math.max(1, parseNonNegative(inputs.serviceIntervalMiles));

    const repairCostNow = parseNonNegative(inputs.repairCostNow);
    const replacementCostNow = parseNonNegative(inputs.replacementCostNow);
    const expectedYearsHorizon = Math.max(1, parseNonNegative(inputs.expectedYearsHorizon));
    const annualRepairGrowthPercent = parseNonNegative(inputs.annualRepairGrowthPercent);

    const claimAmount = parseNonNegative(inputs.claimAmount);
    const deductible = parseNonNegative(inputs.deductible);
    const warrantyCoveragePercent = Math.min(100, parseNonNegative(inputs.warrantyCoveragePercent));

    const tirePressureCurrentPsi = parseNonNegative(inputs.tirePressureCurrentPsi);
    const tirePressureRecommendedPsi = Math.max(1, parseNonNegative(inputs.tirePressureRecommendedPsi));

    const tireWidthMm = Math.max(1, parseNonNegative(inputs.tireWidthMm));
    const tireAspectRatio = Math.max(1, parseNonNegative(inputs.tireAspectRatio));
    const tireRimDiameterIn = Math.max(1, parseNonNegative(inputs.tireRimDiameterIn));
    const oldTireWidthMm = Math.max(1, parseNonNegative(inputs.oldTireWidthMm));
    const oldTireAspectRatio = Math.max(1, parseNonNegative(inputs.oldTireAspectRatio));
    const oldTireRimDiameterIn = Math.max(1, parseNonNegative(inputs.oldTireRimDiameterIn));

    const downtimeHours = parseNonNegative(inputs.downtimeHours);
    const downtimeCostPerHour = parseNonNegative(inputs.downtimeCostPerHour);
    const includeDowntimeCosts = inputs.includeDowntimeCosts;

    const annualCostInflationPercent = parseNonNegative(inputs.annualCostInflationPercent);
    const annualMilesGrowthPercent = parseNonNegative(inputs.annualMilesGrowthPercent);
    const planningYears = Math.max(1, parseNonNegative(inputs.planningYears));

    const downtimeCost = includeDowntimeCosts ? downtimeHours * downtimeCostPerHour : 0;

    let primaryLabel = 'Primary Result';
    let primaryValue = 0;
    let primaryIsCurrency = false;
    let primarySuffix: string | undefined;
    let kpis: KPI[] = [];
    let breakdown: BreakdownItem[] = [];
    let scenarios: Scenario[] = [];
    let baselineAnnualCost = 0;
    let largestDriver = 'Labor Cost';

    if (variant === 'battery-life') {
      const remainingYears = Math.max(0, batteryWarrantyYears - batteryAgeYears);
      const replacementRiskPercent = Math.min(100, (batteryAgeYears / batteryWarrantyYears) * 100);
      const annualReserve = remainingYears > 0 ? batteryReplacementCost / remainingYears : batteryReplacementCost;

      primaryLabel = 'Estimated Remaining Life';
      primaryValue = remainingYears;
      primarySuffix = ' years';

      kpis = [
        { label: 'Replacement Risk', value: replacementRiskPercent, decimals: 1, suffix: '%' },
        { label: 'Battery Replacement Cost', value: batteryReplacementCost, isCurrency: true },
        { label: 'Annual Reserve Target', value: annualReserve, isCurrency: true },
        { label: 'Current Battery Age', value: batteryAgeYears, decimals: 1, suffix: ' years' }
      ];

      breakdown = [
        { label: 'Age vs Warranty', value: replacementRiskPercent, icon: Clock3, color: 'bg-blue-500' },
        { label: 'Replacement Budget', value: batteryReplacementCost, icon: Wallet, color: 'bg-emerald-500' },
        { label: 'Reserve Need', value: annualReserve, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'High Temperature Stress', value: Math.max(0, remainingYears * 0.75), notes: 'Accelerated degradation scenario.' },
        { label: 'Conservative Usage', value: remainingYears * 1.1, notes: 'Milder stress and better maintenance scenario.' },
        { label: 'Replacement Cost +20%', value: annualReserve * 1.2, notes: 'Cost inflation stress scenario.' },
        { label: 'Warranty Window Ends Early', value: Math.max(0, remainingYears - 0.8), notes: 'Coverage downside case.' }
      ];

      baselineAnnualCost = annualReserve;
      largestDriver = findLargestDriver([
        ['Battery Age', batteryAgeYears],
        ['Warranty Window', batteryWarrantyYears],
        ['Replacement Cost', batteryReplacementCost]
      ]);
    }

    if (variant === 'brake-pad-life') {
      const usableThickness = Math.max(0, padThicknessMm - minimumPadThicknessMm);
      const milesRemaining = (usableThickness / wearPer10kMilesMm) * 10000;
      const monthsRemaining = annualMiles > 0 ? (milesRemaining / annualMiles) * 12 : 0;
      const annualizedBrakeReserve = annualMiles > 0 ? (annualMiles / Math.max(1, milesRemaining)) * (partsCost + laborRate * serviceHours) : 0;

      primaryLabel = 'Estimated Miles Remaining';
      primaryValue = milesRemaining;
      primarySuffix = ' mi';

      kpis = [
        { label: 'Months Remaining', value: monthsRemaining, decimals: 1, suffix: ' months' },
        { label: 'Current Pad Thickness', value: padThicknessMm, decimals: 1, suffix: ' mm' },
        { label: 'Minimum Threshold', value: minimumPadThicknessMm, decimals: 1, suffix: ' mm' },
        { label: 'Annual Brake Budget Reserve', value: annualizedBrakeReserve, isCurrency: true }
      ];

      breakdown = [
        { label: 'Wear Rate Pressure', value: wearPer10kMilesMm, icon: TrendingDown, color: 'bg-blue-500' },
        { label: 'Usage Demand', value: annualMiles, icon: Route, color: 'bg-emerald-500' },
        { label: 'Service Cost Layer', value: partsCost + laborRate * serviceHours, icon: Wrench, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Aggressive City Driving', value: milesRemaining * 0.75, notes: 'Higher braking intensity case.' },
        { label: 'Highway-Heavy Use', value: milesRemaining * 1.15, notes: 'Lower wear intensity case.' },
        { label: 'Wear Rate +20%', value: (usableThickness / (wearPer10kMilesMm * 1.2)) * 10000, notes: 'Faster wear downside case.' },
        { label: 'Wear Rate -15%', value: (usableThickness / (wearPer10kMilesMm * 0.85)) * 10000, notes: 'Lower wear upside case.' }
      ];

      baselineAnnualCost = annualizedBrakeReserve;
      largestDriver = findLargestDriver([
        ['Wear Rate', wearPer10kMilesMm],
        ['Annual Miles', annualMiles],
        ['Service Cost', partsCost + laborRate * serviceHours]
      ]);
    }

    if (variant === 'diagnostic-time') {
      const diagnosticHours = baseDiagnosticHours * diagnosticComplexityMultiplier;
      const diagnosticLaborCost = diagnosticHours * laborRate;
      const diagnosticTotalCost = diagnosticLaborCost + miscFees;

      primaryLabel = 'Estimated Diagnostic Time';
      primaryValue = diagnosticHours;
      primarySuffix = ' hrs';

      kpis = [
        { label: 'Diagnostic Labor Cost', value: diagnosticLaborCost, isCurrency: true },
        { label: 'Diagnostic Total Cost', value: diagnosticTotalCost, isCurrency: true },
        { label: 'Base Hours', value: baseDiagnosticHours, decimals: 2, suffix: ' hrs' },
        { label: 'Complexity Multiplier', value: diagnosticComplexityMultiplier, decimals: 2, suffix: 'x' }
      ];

      breakdown = [
        { label: 'Labor Time', value: diagnosticHours, icon: Clock3, color: 'bg-blue-500' },
        { label: 'Labor Rate', value: laborRate, icon: DollarSign, color: 'bg-emerald-500' },
        { label: 'Complexity Weight', value: diagnosticComplexityMultiplier, icon: Target, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Complexity +25%', value: baseDiagnosticHours * diagnosticComplexityMultiplier * 1.25, notes: 'Escalation case.' },
        { label: 'Complexity -15%', value: baseDiagnosticHours * diagnosticComplexityMultiplier * 0.85, notes: 'Simplified case.' },
        { label: 'Labor Rate +10%', value: diagnosticHours * laborRate * 1.1 + miscFees, notes: 'Rate inflation case.' },
        { label: 'Base Hours +20%', value: baseDiagnosticHours * 1.2 * diagnosticComplexityMultiplier, notes: 'Scope creep case.' }
      ];

      baselineAnnualCost = diagnosticTotalCost * maintenanceEventsPerYear;
      largestDriver = findLargestDriver([
        ['Complexity', diagnosticComplexityMultiplier],
        ['Labor Rate', laborRate],
        ['Base Hours', baseDiagnosticHours]
      ]);
    }

    if (variant === 'diy-savings') {
      const shopLaborCost = shopHours * laborRate;
      const shopPartsCost = partsCost * (1 + partsMarkupPercent / 100);
      const shopTotal = shopLaborCost + shopPartsCost + miscFees;

      const diyPartsCost = partsCost;
      const diyTimeCost = diyHours * valueOfTimeRate;
      const diyTotal = diyPartsCost + diyTimeCost;

      const netSavings = shopTotal - diyTotal;

      primaryLabel = 'Estimated Net DIY Savings';
      primaryValue = netSavings;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Shop Total Cost', value: shopTotal, isCurrency: true },
        { label: 'DIY Total Cost', value: diyTotal, isCurrency: true },
        { label: 'DIY Time Cost', value: diyTimeCost, isCurrency: true },
        { label: 'Parts Markup Effect', value: shopPartsCost - partsCost, isCurrency: true }
      ];

      breakdown = [
        { label: 'Labor Avoidance', value: shopLaborCost, icon: Wrench, color: 'bg-blue-500' },
        { label: 'Parts Markup Avoidance', value: shopPartsCost - partsCost, icon: TrendingDown, color: 'bg-emerald-500' },
        { label: 'DIY Time Cost', value: diyTimeCost, icon: Clock3, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'DIY Time +30%', value: shopTotal - (diyPartsCost + diyTimeCost * 1.3), notes: 'Longer DIY duration case.' },
        { label: 'Shop Rate +15%', value: (shopLaborCost * 1.15 + shopPartsCost + miscFees) - diyTotal, notes: 'Higher shop-rate case.' },
        { label: 'Parts Cost +20%', value: (shopLaborCost + shopPartsCost * 1.2 + miscFees) - (diyPartsCost * 1.2 + diyTimeCost), notes: 'Parts inflation case.' },
        { label: 'Rework Penalty +$180', value: shopTotal - (diyTotal + 180), notes: 'DIY downside rework case.' }
      ];

      baselineAnnualCost = diyTotal * maintenanceEventsPerYear;
      largestDriver = findLargestDriver([
        ['Labor Rate', laborRate],
        ['Shop Hours', shopHours],
        ['Time Value', valueOfTimeRate]
      ]);
    }

    if (variant === 'fleet-maintenance') {
      const perEventCost = serviceHours * laborRate + partsCost * (1 + partsMarkupPercent / 100) + miscFees;
      const annualFleetMaintenanceCost = perEventCost * maintenanceEventsPerYear * fleetVehicleCount;
      const annualFleetDowntimeCost = downtimeCost * maintenanceEventsPerYear * fleetVehicleCount;
      const annualFleetTotalCost = annualFleetMaintenanceCost + annualFleetDowntimeCost;

      primaryLabel = 'Annual Fleet Maintenance Cost';
      primaryValue = annualFleetTotalCost;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Per Event Cost / Vehicle', value: perEventCost, isCurrency: true },
        { label: 'Maintenance Events / Year', value: maintenanceEventsPerYear, decimals: 1, suffix: ' events' },
        { label: 'Fleet Maintenance Spend', value: annualFleetMaintenanceCost, isCurrency: true },
        { label: 'Fleet Downtime Cost', value: annualFleetDowntimeCost, isCurrency: true }
      ];

      breakdown = [
        { label: 'Labor Layer', value: serviceHours * laborRate * maintenanceEventsPerYear * fleetVehicleCount, icon: Wrench, color: 'bg-blue-500' },
        { label: 'Parts Layer', value: partsCost * (1 + partsMarkupPercent / 100) * maintenanceEventsPerYear * fleetVehicleCount, icon: Car, color: 'bg-emerald-500' },
        { label: 'Downtime Layer', value: annualFleetDowntimeCost, icon: Clock3, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Fleet Size +20%', value: annualFleetTotalCost * 1.2, notes: 'Expansion case.' },
        { label: 'Event Frequency +25%', value: annualFleetTotalCost * 1.25, notes: 'Higher service cadence case.' },
        { label: 'Labor Rate +12%', value: annualFleetTotalCost + (serviceHours * laborRate * 0.12 * maintenanceEventsPerYear * fleetVehicleCount), notes: 'Labor inflation case.' },
        { label: 'Downtime -30%', value: annualFleetMaintenanceCost + annualFleetDowntimeCost * 0.7, notes: 'Scheduling optimization case.' }
      ];

      baselineAnnualCost = annualFleetTotalCost;
      largestDriver = findLargestDriver([
        ['Fleet Size', fleetVehicleCount],
        ['Event Frequency', maintenanceEventsPerYear],
        ['Per Event Cost', perEventCost],
        ['Downtime Cost', annualFleetDowntimeCost]
      ]);
    }

    if (variant === 'labor-rate') {
      const overheadMultiplier = 1 + shopOverheadPercent / 100;
      const marginMultiplier = 1 + targetMarginPercent / 100;
      const recommendedLaborRate = baseTechWage * overheadMultiplier * marginMultiplier;
      const hourlyGrossBuffer = recommendedLaborRate - baseTechWage * overheadMultiplier;

      primaryLabel = 'Recommended Labor Rate';
      primaryValue = recommendedLaborRate;
      primaryIsCurrency = true;
      primarySuffix = '/hr';

      kpis = [
        { label: 'Base Tech Wage', value: baseTechWage, isCurrency: true, suffix: '/hr' },
        { label: 'Overhead Applied Rate', value: baseTechWage * overheadMultiplier, isCurrency: true, suffix: '/hr' },
        { label: 'Target Margin Buffer', value: hourlyGrossBuffer, isCurrency: true, suffix: '/hr' },
        { label: 'Effective Margin Target', value: targetMarginPercent, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'Wage Core', value: baseTechWage, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Overhead Effect', value: baseTechWage * (overheadMultiplier - 1), icon: Building2, color: 'bg-emerald-500' },
        { label: 'Margin Buffer', value: hourlyGrossBuffer, icon: TrendingDown, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Overhead +10 points', value: baseTechWage * (1 + (shopOverheadPercent + 10) / 100) * marginMultiplier, notes: 'Overhead escalation case.' },
        { label: 'Margin +5 points', value: baseTechWage * overheadMultiplier * (1 + (targetMarginPercent + 5) / 100), notes: 'Higher margin target case.' },
        { label: 'Wage +8%', value: baseTechWage * 1.08 * overheadMultiplier * marginMultiplier, notes: 'Wage inflation case.' },
        { label: 'Overhead Optimization -8 points', value: baseTechWage * (1 + Math.max(0, shopOverheadPercent - 8) / 100) * marginMultiplier, notes: 'Efficiency improvement case.' }
      ];

      baselineAnnualCost = recommendedLaborRate * serviceHours * maintenanceEventsPerYear;
      largestDriver = findLargestDriver([
        ['Base Wage', baseTechWage],
        ['Overhead %', shopOverheadPercent],
        ['Margin %', targetMarginPercent]
      ]);
    }

    if (variant === 'maintenance-schedule') {
      const milesSinceLastService = Math.max(0, currentOdometer - lastServiceOdometer);
      const milesToNextService = serviceIntervalMiles - milesSinceLastService;
      const monthsToNextService = annualMiles > 0 ? (milesToNextService / annualMiles) * 12 : 0;
      const isOverdue = milesToNextService < 0;

      primaryLabel = isOverdue ? 'Service Overdue By' : 'Miles to Next Service';
      primaryValue = Math.abs(milesToNextService);
      primarySuffix = ' mi';

      kpis = [
        { label: 'Miles Since Last Service', value: milesSinceLastService, decimals: 0, suffix: ' mi' },
        { label: 'Service Interval', value: serviceIntervalMiles, decimals: 0, suffix: ' mi' },
        { label: 'Months to Service', value: monthsToNextService, decimals: 1, suffix: ' months' },
        { label: 'Estimated Service Ticket', value: serviceHours * laborRate + partsCost * (1 + partsMarkupPercent / 100) + miscFees, isCurrency: true }
      ];

      breakdown = [
        { label: 'Interval Consumption', value: milesSinceLastService, icon: Route, color: 'bg-blue-500' },
        { label: 'Remaining Window', value: Math.max(0, milesToNextService), icon: Clock3, color: 'bg-emerald-500' },
        { label: 'Overdue Risk', value: Math.max(0, -milesToNextService), icon: AlertTriangle, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Mileage +20%', value: milesToNextService - annualMiles * 0.2, notes: 'Higher usage case.' },
        { label: 'Interval -15%', value: (serviceIntervalMiles * 0.85) - milesSinceLastService, notes: 'Conservative interval case.' },
        { label: 'Mileage -15%', value: milesToNextService + annualMiles * 0.15, notes: 'Lower usage case.' },
        { label: 'Immediate Service Window', value: Math.max(0, milesToNextService), notes: 'Current baseline trigger case.' }
      ];

      baselineAnnualCost = (serviceHours * laborRate + partsCost * (1 + partsMarkupPercent / 100) + miscFees) * Math.max(1, annualMiles / serviceIntervalMiles);
      largestDriver = findLargestDriver([
        ['Mileage Since Service', milesSinceLastService],
        ['Interval Size', serviceIntervalMiles],
        ['Annual Miles', annualMiles]
      ]);
    }

    if (variant === 'parts-markup') {
      const salePrice = partsCost * (1 + partsMarkupPercent / 100);
      const grossProfit = salePrice - partsCost;
      const marginPercent = salePrice > 0 ? (grossProfit / salePrice) * 100 : 0;

      primaryLabel = 'Parts Selling Price';
      primaryValue = salePrice;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Parts Cost', value: partsCost, isCurrency: true },
        { label: 'Gross Profit', value: grossProfit, isCurrency: true },
        { label: 'Margin %', value: marginPercent, decimals: 2, suffix: '%' },
        { label: 'Markup %', value: partsMarkupPercent, decimals: 1, suffix: '%' }
      ];

      breakdown = [
        { label: 'Cost Base', value: partsCost, icon: Wallet, color: 'bg-blue-500' },
        { label: 'Markup Add', value: grossProfit, icon: TrendingDown, color: 'bg-emerald-500' },
        { label: 'Final Price', value: salePrice, icon: DollarSign, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Markup +10 points', value: partsCost * (1 + (partsMarkupPercent + 10) / 100), notes: 'Higher pricing case.' },
        { label: 'Markup -8 points', value: partsCost * (1 + Math.max(0, partsMarkupPercent - 8) / 100), notes: 'Competitive pricing case.' },
        { label: 'Supplier Cost +15%', value: partsCost * 1.15 * (1 + partsMarkupPercent / 100), notes: 'Supplier inflation case.' },
        { label: 'Cost -10%', value: partsCost * 0.9 * (1 + partsMarkupPercent / 100), notes: 'Procurement efficiency case.' }
      ];

      baselineAnnualCost = salePrice * maintenanceEventsPerYear;
      largestDriver = findLargestDriver([
        ['Parts Cost', partsCost],
        ['Markup %', partsMarkupPercent],
        ['Volume', maintenanceEventsPerYear]
      ]);
    }

    if (variant === 'repair-vs-replace') {
      let projectedRepairPathCost = 0;
      for (let y = 0; y < expectedYearsHorizon; y++) {
        projectedRepairPathCost += repairCostNow * Math.pow(1 + annualRepairGrowthPercent / 100, y);
      }
      const projectedDowntimePathCost = downtimeCost * expectedYearsHorizon;
      const totalRepairPathCost = projectedRepairPathCost + projectedDowntimePathCost;
      const totalReplacePathCost = replacementCostNow;
      const costDelta = totalReplacePathCost - totalRepairPathCost;

      primaryLabel = 'Repair vs Replace Delta';
      primaryValue = costDelta;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Projected Repair Path Cost', value: totalRepairPathCost, isCurrency: true },
        { label: 'Replacement Cost', value: totalReplacePathCost, isCurrency: true },
        { label: 'Repair Growth %', value: annualRepairGrowthPercent, decimals: 1, suffix: '%' },
        { label: 'Downtime Path Cost', value: projectedDowntimePathCost, isCurrency: true }
      ];

      breakdown = [
        { label: 'Repair Escalation', value: projectedRepairPathCost, icon: Wrench, color: 'bg-blue-500' },
        { label: 'Downtime Exposure', value: projectedDowntimePathCost, icon: Clock3, color: 'bg-emerald-500' },
        { label: 'Replacement Option', value: replacementCostNow, icon: Car, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Repair Growth +5 points', value: totalRepairPathCost * 1.18, notes: 'Higher escalation downside case.' },
        { label: 'Repair Growth -5 points', value: totalRepairPathCost * 0.88, notes: 'Stabilization case.' },
        { label: 'Replacement Cost +12%', value: replacementCostNow * 1.12 - totalRepairPathCost, notes: 'Replacement inflation case.' },
        { label: 'Downtime Doubles', value: replacementCostNow - (projectedRepairPathCost + projectedDowntimePathCost * 2), notes: 'Operational risk case.' }
      ];

      baselineAnnualCost = totalRepairPathCost / expectedYearsHorizon;
      largestDriver = findLargestDriver([
        ['Repair Cost Base', repairCostNow],
        ['Repair Growth %', annualRepairGrowthPercent],
        ['Downtime Cost', projectedDowntimePathCost],
        ['Replacement Cost', replacementCostNow]
      ]);
    }

    if (variant === 'service-cost-estimator') {
      const laborCost = serviceHours * laborRate;
      const markedParts = partsCost * (1 + partsMarkupPercent / 100);
      const totalServiceCost = laborCost + markedParts + miscFees + downtimeCost;

      primaryLabel = 'Estimated Service Ticket';
      primaryValue = totalServiceCost;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Labor Cost', value: laborCost, isCurrency: true },
        { label: 'Parts + Markup', value: markedParts, isCurrency: true },
        { label: 'Fees', value: miscFees, isCurrency: true },
        { label: 'Downtime Cost', value: downtimeCost, isCurrency: true }
      ];

      breakdown = [
        { label: 'Labor', value: laborCost, icon: Wrench, color: 'bg-blue-500' },
        { label: 'Parts', value: markedParts, icon: Wallet, color: 'bg-emerald-500' },
        { label: 'Fees + Downtime', value: miscFees + downtimeCost, icon: Clock3, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Labor +10%', value: laborCost * 1.1 + markedParts + miscFees + downtimeCost, notes: 'Rate inflation case.' },
        { label: 'Parts +15%', value: laborCost + markedParts * 1.15 + miscFees + downtimeCost, notes: 'Parts inflation case.' },
        { label: 'Scope Creep +1.2 hrs', value: (serviceHours + 1.2) * laborRate + markedParts + miscFees + downtimeCost, notes: 'Additional labor scope case.' },
        { label: 'Downtime Eliminated', value: laborCost + markedParts + miscFees, notes: 'Operational efficiency case.' }
      ];

      baselineAnnualCost = totalServiceCost * maintenanceEventsPerYear;
      largestDriver = findLargestDriver([
        ['Labor Cost', laborCost],
        ['Parts Cost', markedParts],
        ['Downtime', downtimeCost]
      ]);
    }

    if (variant === 'tire-pressure') {
      const pressureDelta = tirePressureRecommendedPsi - tirePressureCurrentPsi;
      const underInflationPsi = Math.max(0, pressureDelta);
      const estimatedMpgPenaltyPercent = underInflationPsi * 0.4;
      const adjustedMpg = Math.max(1, mpgCurrent * (1 - estimatedMpgPenaltyPercent / 100));
      const annualFuelCostCurrent = annualMiles / mpgCurrent * fuelPrice;
      const annualFuelCostAdjusted = annualMiles / adjustedMpg * fuelPrice;
      const annualFuelImpact = annualFuelCostAdjusted - annualFuelCostCurrent;

      primaryLabel = 'Estimated Annual Fuel Impact';
      primaryValue = annualFuelImpact;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Pressure Delta', value: pressureDelta, decimals: 1, suffix: ' psi' },
        { label: 'Estimated MPG Penalty', value: estimatedMpgPenaltyPercent, decimals: 2, suffix: '%' },
        { label: 'Adjusted MPG', value: adjustedMpg, decimals: 2, suffix: ' mpg' },
        { label: 'Annual Fuel Cost at Current Pressure', value: annualFuelCostAdjusted, isCurrency: true }
      ];

      breakdown = [
        { label: 'Pressure Gap', value: Math.abs(pressureDelta), icon: Gauge, color: 'bg-blue-500' },
        { label: 'Fuel Penalty', value: Math.abs(annualFuelImpact), icon: Fuel, color: 'bg-emerald-500' },
        { label: 'Mileage Exposure', value: annualMiles, icon: Route, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Pressure Corrected', value: annualFuelCostCurrent, notes: 'Recommended pressure baseline case.' },
        { label: 'Pressure -3 PSI More', value: annualMiles / Math.max(1, mpgCurrent * (1 - (estimatedMpgPenaltyPercent + 1.2) / 100)) * fuelPrice, notes: 'Further underinflation downside case.' },
        { label: 'Fuel Price +20%', value: annualFuelCostAdjusted * 1.2, notes: 'Fuel inflation stress case.' },
        { label: 'Annual Miles +15%', value: annualFuelCostAdjusted * 1.15, notes: 'Higher utilization case.' }
      ];

      baselineAnnualCost = annualFuelCostAdjusted;
      largestDriver = findLargestDriver([
        ['Pressure Delta', Math.abs(pressureDelta)],
        ['Annual Miles', annualMiles],
        ['Fuel Price', fuelPrice]
      ]);
    }

    if (variant === 'tire-size') {
      const newDiameter = tireDiameterMm(tireWidthMm, tireAspectRatio, tireRimDiameterIn);
      const oldDiameter = tireDiameterMm(oldTireWidthMm, oldTireAspectRatio, oldTireRimDiameterIn);
      const diameterDeltaMm = newDiameter - oldDiameter;
      const diameterDeltaPercent = oldDiameter > 0 ? (diameterDeltaMm / oldDiameter) * 100 : 0;
      const circumferenceDeltaPercent = diameterDeltaPercent;
      const speedometerShiftPercent = diameterDeltaPercent;

      primaryLabel = 'Tire Diameter Change';
      primaryValue = diameterDeltaPercent;
      primarySuffix = '%';

      kpis = [
        { label: 'New Diameter', value: newDiameter, decimals: 1, suffix: ' mm' },
        { label: 'Old Diameter', value: oldDiameter, decimals: 1, suffix: ' mm' },
        { label: 'Diameter Delta', value: diameterDeltaMm, decimals: 1, suffix: ' mm' },
        { label: 'Speedometer Shift (est.)', value: speedometerShiftPercent, decimals: 2, suffix: '%' }
      ];

      breakdown = [
        { label: 'Diameter Delta', value: Math.abs(diameterDeltaMm), icon: Gauge, color: 'bg-blue-500' },
        { label: 'Percent Shift', value: Math.abs(diameterDeltaPercent), icon: TrendingDown, color: 'bg-emerald-500' },
        { label: 'Circumference Shift', value: Math.abs(circumferenceDeltaPercent), icon: Route, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Width +10mm', value: tireDiameterMm(tireWidthMm + 10, tireAspectRatio, tireRimDiameterIn), notes: 'Wider tire variation case.' },
        { label: 'Aspect +5 points', value: tireDiameterMm(tireWidthMm, tireAspectRatio + 5, tireRimDiameterIn), notes: 'Higher sidewall case.' },
        { label: 'Rim +1 inch', value: tireDiameterMm(tireWidthMm, tireAspectRatio, tireRimDiameterIn + 1), notes: 'Larger rim fitment case.' },
        { label: 'Reference Old Size', value: oldDiameter, notes: 'Original baseline size.' }
      ];

      baselineAnnualCost = Math.abs(diameterDeltaPercent) * 25;
      largestDriver = findLargestDriver([
        ['Width Change', Math.abs(tireWidthMm - oldTireWidthMm)],
        ['Aspect Change', Math.abs(tireAspectRatio - oldTireAspectRatio)],
        ['Rim Change', Math.abs(tireRimDiameterIn - oldTireRimDiameterIn)]
      ]);
    }

    if (variant === 'warranty-coverage') {
      const eligibleAmount = Math.max(0, claimAmount - deductible);
      const coveredAmount = eligibleAmount * (warrantyCoveragePercent / 100);
      const outOfPocket = claimAmount - coveredAmount;
      const coverageEfficiency = claimAmount > 0 ? (coveredAmount / claimAmount) * 100 : 0;

      primaryLabel = 'Estimated Out-of-Pocket';
      primaryValue = outOfPocket;
      primaryIsCurrency = true;

      kpis = [
        { label: 'Claim Amount', value: claimAmount, isCurrency: true },
        { label: 'Covered Amount', value: coveredAmount, isCurrency: true },
        { label: 'Deductible', value: deductible, isCurrency: true },
        { label: 'Coverage Efficiency', value: coverageEfficiency, decimals: 2, suffix: '%' }
      ];

      breakdown = [
        { label: 'Covered Portion', value: coveredAmount, icon: Shield, color: 'bg-blue-500' },
        { label: 'Deductible Layer', value: deductible, icon: DollarSign, color: 'bg-emerald-500' },
        { label: 'Out-of-Pocket Layer', value: outOfPocket, icon: Wallet, color: 'bg-violet-500' }
      ];

      scenarios = [
        { label: 'Coverage -10 points', value: claimAmount - (eligibleAmount * ((warrantyCoveragePercent - 10) / 100)), notes: 'Lower coverage downside case.' },
        { label: 'Deductible +$100', value: claimAmount - (Math.max(0, claimAmount - (deductible + 100)) * (warrantyCoveragePercent / 100)), notes: 'Higher deductible case.' },
        { label: 'Claim +20%', value: claimAmount * 1.2 - (Math.max(0, claimAmount * 1.2 - deductible) * (warrantyCoveragePercent / 100)), notes: 'Larger claim case.' },
        { label: 'Coverage 100%', value: claimAmount - Math.max(0, claimAmount - deductible), notes: 'Full eligible coverage reference case.' }
      ];

      baselineAnnualCost = outOfPocket;
      largestDriver = findLargestDriver([
        ['Claim Amount', claimAmount],
        ['Coverage %', warrantyCoveragePercent],
        ['Deductible', deductible]
      ]);
    }

    const projectionRows: ProjectionRow[] = [];
    let projectedMiles = annualMiles;
    let projectedCost = baselineAnnualCost;

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
      `${config.title} indicates ${config.focusLabel} as the dominant planning focus under your assumptions.`,
      `Largest driver detected: ${largestDriver}. Validate this input first for better decision confidence.`,
      'Use conservative and downside scenarios before locking maintenance budgets or service decisions.',
      'Refresh assumptions quarterly and after major supplier, mileage, or policy changes.',
      'Track estimated vs actual outcomes to improve future planning precision.'
    ];

    const warningsAndConsiderations = [
      'This calculator provides planning estimates, not guaranteed outcomes.',
      'Actual costs and timing vary with usage patterns, vendor pricing, environmental conditions, and policy terms.',
      'Single-snapshot assumptions may understate volatility; use scenario ranges when decisions are material.',
      'For safety-critical decisions, follow manufacturer and professional inspection guidance.'
    ];

    const nextSteps = [
      'Capture current baseline metrics (costs, hours, and usage) from recent records.',
      'Run conservative, expected, and stress assumptions and compare outcomes.',
      'Select a planning baseline and define threshold triggers for reassessment.',
      'Set a monthly or quarterly variance review cadence.',
      'Recalculate before major repairs, replacements, or pricing updates.'
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
                ? 'Includes lifecycle economics, scenario stress tests, and multi-year projections'
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
              <span className="font-medium">Lifecycle Planning Mode</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">
                Advanced mode includes sensitivity deltas, projection rows, and decision-support recommendations.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Annual Miles</label>
            <input type="number" min="0" value={inputs.annualMiles} onChange={(e) => handleInputChange('annualMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Labor Rate ($/hr)</label>
            <input type="number" min="0" step="0.01" value={inputs.laborRate} onChange={(e) => handleInputChange('laborRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Service Hours</label>
            <input type="number" min="0" step="0.1" value={inputs.serviceHours} onChange={(e) => handleInputChange('serviceHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Parts Cost ($)</label>
            <input type="number" min="0" step="0.01" value={inputs.partsCost} onChange={(e) => handleInputChange('partsCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
        </div>

        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Core Service Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parts Markup (%)</label>
              <input type="number" min="0" step="0.1" value={inputs.partsMarkupPercent} onChange={(e) => handleInputChange('partsMarkupPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Misc Fees ($)</label>
              <input type="number" min="0" step="0.01" value={inputs.miscFees} onChange={(e) => handleInputChange('miscFees', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Planning Years</label>
              <input type="number" min="1" value={inputs.planningYears} onChange={(e) => handleInputChange('planningYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
            </div>
            <label className="flex items-start gap-3 p-3 border border-orange-200 dark:border-orange-700 rounded-lg bg-background">
              <input type="checkbox" checked={inputs.includeDowntimeCosts} onChange={(e) => handleInputChange('includeDowntimeCosts', e.target.checked)} className="mt-1" />
              <span className="text-sm">
                <strong>Include Downtime Costs</strong>
                <br />
                Adds operational downtime impact to cost outputs.
              </span>
            </label>
          </div>
        </div>

        <div className="p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            Variant-Specific Inputs
          </h3>

          {(variant === 'battery-life' || variant === 'warranty-coverage') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Battery Age (years)</label>
                <input type="number" min="0" step="0.1" value={inputs.batteryAgeYears} onChange={(e) => handleInputChange('batteryAgeYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Battery Warranty (years)</label>
                <input type="number" min="0.1" step="0.1" value={inputs.batteryWarrantyYears} onChange={(e) => handleInputChange('batteryWarrantyYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Battery Replacement Cost ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.batteryReplacementCost} onChange={(e) => handleInputChange('batteryReplacementCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'brake-pad-life') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Pad Thickness (mm)</label>
                <input type="number" min="0" step="0.1" value={inputs.padThicknessMm} onChange={(e) => handleInputChange('padThicknessMm', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Minimum Thickness (mm)</label>
                <input type="number" min="0" step="0.1" value={inputs.minimumPadThicknessMm} onChange={(e) => handleInputChange('minimumPadThicknessMm', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Wear per 10k miles (mm)</label>
                <input type="number" min="0.01" step="0.01" value={inputs.wearPer10kMilesMm} onChange={(e) => handleInputChange('wearPer10kMilesMm', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'diagnostic-time') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Base Diagnostic Hours</label>
                <input type="number" min="0" step="0.1" value={inputs.baseDiagnosticHours} onChange={(e) => handleInputChange('baseDiagnosticHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Complexity Multiplier</label>
                <input type="number" min="0.5" step="0.1" value={inputs.diagnosticComplexityMultiplier} onChange={(e) => handleInputChange('diagnosticComplexityMultiplier', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'diy-savings') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">DIY Hours</label>
                <input type="number" min="0" step="0.1" value={inputs.diyHours} onChange={(e) => handleInputChange('diyHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shop Hours</label>
                <input type="number" min="0" step="0.1" value={inputs.shopHours} onChange={(e) => handleInputChange('shopHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Value of Time ($/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.valueOfTimeRate} onChange={(e) => handleInputChange('valueOfTimeRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'fleet-maintenance') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fleet Vehicle Count</label>
                <input type="number" min="0" step="1" value={inputs.fleetVehicleCount} onChange={(e) => handleInputChange('fleetVehicleCount', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Maintenance Events / Year</label>
                <input type="number" min="0" step="0.1" value={inputs.maintenanceEventsPerYear} onChange={(e) => handleInputChange('maintenanceEventsPerYear', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'labor-rate') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Base Tech Wage ($/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.baseTechWage} onChange={(e) => handleInputChange('baseTechWage', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shop Overhead (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.shopOverheadPercent} onChange={(e) => handleInputChange('shopOverheadPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Margin (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.targetMarginPercent} onChange={(e) => handleInputChange('targetMarginPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'maintenance-schedule') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Odometer</label>
                <input type="number" min="0" step="1" value={inputs.currentOdometer} onChange={(e) => handleInputChange('currentOdometer', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Service Odometer</label>
                <input type="number" min="0" step="1" value={inputs.lastServiceOdometer} onChange={(e) => handleInputChange('lastServiceOdometer', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Service Interval Miles</label>
                <input type="number" min="1" step="1" value={inputs.serviceIntervalMiles} onChange={(e) => handleInputChange('serviceIntervalMiles', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'repair-vs-replace') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Repair Cost Now ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.repairCostNow} onChange={(e) => handleInputChange('repairCostNow', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Replacement Cost ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.replacementCostNow} onChange={(e) => handleInputChange('replacementCostNow', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Repair Growth (%)</label>
                <input type="number" min="0" step="0.1" value={inputs.annualRepairGrowthPercent} onChange={(e) => handleInputChange('annualRepairGrowthPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Horizon (years)</label>
                <input type="number" min="1" step="1" value={inputs.expectedYearsHorizon} onChange={(e) => handleInputChange('expectedYearsHorizon', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'warranty-coverage') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Claim Amount ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.claimAmount} onChange={(e) => handleInputChange('claimAmount', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Deductible ($)</label>
                <input type="number" min="0" step="0.01" value={inputs.deductible} onChange={(e) => handleInputChange('deductible', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Coverage (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={inputs.warrantyCoveragePercent} onChange={(e) => handleInputChange('warrantyCoveragePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'tire-pressure') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current PSI</label>
                <input type="number" min="0" step="0.1" value={inputs.tirePressureCurrentPsi} onChange={(e) => handleInputChange('tirePressureCurrentPsi', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recommended PSI</label>
                <input type="number" min="1" step="0.1" value={inputs.tirePressureRecommendedPsi} onChange={(e) => handleInputChange('tirePressureRecommendedPsi', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fuel Price ($/gal)</label>
                <input type="number" min="0" step="0.01" value={inputs.fuelPrice} onChange={(e) => handleInputChange('fuelPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Baseline MPG</label>
                <input type="number" min="1" step="0.1" value={inputs.mpgCurrent} onChange={(e) => handleInputChange('mpgCurrent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'tire-size') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Width (mm)</label>
                <input type="number" min="1" value={inputs.tireWidthMm} onChange={(e) => handleInputChange('tireWidthMm', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Aspect Ratio</label>
                <input type="number" min="1" value={inputs.tireAspectRatio} onChange={(e) => handleInputChange('tireAspectRatio', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Rim (in)</label>
                <input type="number" min="1" value={inputs.tireRimDiameterIn} onChange={(e) => handleInputChange('tireRimDiameterIn', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Old Width (mm)</label>
                <input type="number" min="1" value={inputs.oldTireWidthMm} onChange={(e) => handleInputChange('oldTireWidthMm', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Old Aspect Ratio</label>
                <input type="number" min="1" value={inputs.oldTireAspectRatio} onChange={(e) => handleInputChange('oldTireAspectRatio', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Old Rim (in)</label>
                <input type="number" min="1" value={inputs.oldTireRimDiameterIn} onChange={(e) => handleInputChange('oldTireRimDiameterIn', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
            </div>
          )}

          {(variant === 'fleet-maintenance' || variant === 'repair-vs-replace' || variant === 'service-cost-estimator') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Downtime Hours</label>
                <input type="number" min="0" step="0.1" value={inputs.downtimeHours} onChange={(e) => handleInputChange('downtimeHours', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Downtime Cost ($/hr)</label>
                <input type="number" min="0" step="0.01" value={inputs.downtimeCostPerHour} onChange={(e) => handleInputChange('downtimeCostPerHour', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
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
          <button
            onClick={calculate}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {config.calculateButtonLabel}
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
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Advanced maintenance economics for {config.focusLabel}</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-4">
          This {config.topicLabel.toLowerCase()} workflow is designed for practical maintenance planning and combines {narrative.keyInputs}
          with scenario sensitivity and projection context.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          The objective is to {narrative.decisionGoal}. Results are structured to highlight the largest driver and produce action-ready guidance.
        </p>
        <p className="text-base text-foreground leading-relaxed">
          Use it to stress-test {narrative.stressCase} and maintain a repeatable maintenance decision process as conditions change.
        </p>
        <p className="text-base text-foreground leading-relaxed mt-4">
          For strongest outcomes, set policy rules first: {narrative.thresholdGuidance}. Then validate with conservative labor, parts, and downtime assumptions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Multi-Mode Calculations</h3>
            </div>
            <p className="text-sm text-muted-foreground">Modes are tuned for {config.topicLabel.toLowerCase()} and assumptions like {narrative.keyInputs}.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground">Scenario Capability</h3>
            </div>
            <p className="text-sm text-muted-foreground">Scenario tests focus on {narrative.stressCase} to expose realistic planning risk.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Largest Driver Detection</h3>
            </div>
            <p className="text-sm text-muted-foreground">Highlights the highest-impact factor so you can execute {narrative.decisionGoal} with less guesswork.</p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground">Projection Depth</h3>
            </div>
            <p className="text-sm text-muted-foreground">Projection rows enforce policy rules such as {narrative.thresholdGuidance}.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Advanced Calculator</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Popup-Only Detailed Results</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"><CheckCircle className="h-3 w-3" />Scenario + Projection Layers</span>
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
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">Validate this factor first; it has the highest impact on output sensitivity.</p>
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
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1) Establish baseline {topicLower} service assumptions</h4>
              Capture current cost, labor, parts, and usage assumptions from recent records before modeling decisions.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />2) Enter {topicLower} variant-specific technical inputs</h4>
              Prioritize assumptions for this tool: {narrative.keyInputs}.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />3) Add full {topicLower} cost layers</h4>
              Include labor, parts markup, fees, and downtime when relevant to avoid underestimating total impact.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />4) Configure advanced {topicLower} projection assumptions</h4>
              Set inflation and usage growth assumptions so multi-year outputs match your planning context.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />5) Review {topicLower} scenario and driver analysis</h4>
              Focus scenario review on {narrative.stressCase} to understand sensitivity and downside exposure.
            </div>
            <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6) Convert {topicLower} output into maintenance actions</h4>
              Convert outputs into policies such as {narrative.thresholdGuidance}.
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
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Primary Decision Metric</h4>
                <p className="text-xs text-muted-foreground">Highlights the central output for the selected maintenance decision.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Gauge className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Supporting KPIs</h4>
                <p className="text-xs text-muted-foreground">Provides complementary metrics needed for interpretation and planning.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingDown className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Scenario Deltas</h4>
                <p className="text-xs text-muted-foreground">Quantifies downside and upside shifts under alternate assumptions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><BookOpen className="h-3 w-3 text-white" /></div>
              <div>
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />{topic} Projection Grid</h4>
                <p className="text-xs text-muted-foreground">Adds time-based context for budget and schedule planning windows.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This {topic} Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Calculator className="h-4 w-4" />Beyond Basic {topic} Estimates</h4>
              <p className="text-xs text-muted-foreground">Built to {narrative.decisionGoal} using full-scope assumptions instead of quick estimates.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Shield className="h-4 w-4" />{topic} Risk-Aware Planning</h4>
              <p className="text-xs text-muted-foreground">Risk models are centered on {narrative.stressCase} instead of optimistic single-point assumptions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Wallet className="h-4 w-4" />{topic} Cost Visibility</h4>
              <p className="text-xs text-muted-foreground">Surfaces direct and indirect costs needed to enforce {narrative.thresholdGuidance}.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Route className="h-4 w-4" />{topic} Actionable Outcomes</h4>
              <p className="text-xs text-muted-foreground">Outputs practical levers for execution: {narrative.optimizationLevers}.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            {topic} Advanced Features
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Tool-specific formulas built around {narrative.keyInputs}.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Scenario and projection testing focused on {narrative.stressCase}.</span></div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Decision guardrails tied to {narrative.thresholdGuidance}.</span></div>
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {topic} Maintenance Action Playbook
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set {topic} Approval Bands</h4>
              <p className="text-xs text-muted-foreground">{narrative.thresholdGuidance} before authorizing scope.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Stress {topic} Downtime Risk</h4>
              <p className="text-xs text-muted-foreground">Stress-test {narrative.stressCase} so contingency budgets remain realistic.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Align {topic} With Budget Cycles</h4>
              <p className="text-xs text-muted-foreground">Translate annualized outputs into reserve targets and apply {narrative.optimizationLevers}.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Define {topic} Recheck Rules</h4>
              <p className="text-xs text-muted-foreground">Re-run estimates whenever assumptions tied to {narrative.keyInputs} materially change.</p>
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
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Wrench className="h-5 w-5" />{topic} Core Concept and Decision Context</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              This tool turns maintenance assumptions into planning-grade outputs. It is built for real decisions where timing,
              reliability, and lifecycle cost quality matter.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              It supports one-time and recurring maintenance decisions where the main objective is to {narrative.decisionGoal}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Connects technical condition with financial outcomes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supports repeated recalculation as assumptions evolve.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Translates repair complexity into decision thresholds and timing signals.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Improves consistency by using one framework across vehicle/service types.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major {topic} Factors Affecting Results</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Real-world variance for this tool is most sensitive to {narrative.keyInputs} and related execution delays.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Labor-rate and service-hour assumptions</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Parts cost and markup strategy</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Usage intensity and annual mileage profile</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Downtime exposure and policy coverage constraints</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Shop scheduling delays and part lead-time variability</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Warranty terms and exclusions that alter out-of-pocket burden</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Car className="h-5 w-5" />Advanced {topic} Comparison and Scenario Logic</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Baseline result starts with {narrative.keyInputs} and current operating context.</li>
              <li>- Scenario outputs quantify exposure under {narrative.stressCase}.</li>
              <li>- Projection rows validate whether you can {narrative.decisionGoal} over the selected horizon.</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Target className="h-5 w-5" />{topic} Threshold and Timing Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Define action thresholds before variance appears.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Prioritize mitigation where largest-driver sensitivity is highest.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use conservative assumptions for commitment decisions.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Reassess when assumptions move materially.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Set repair-vs-replace trigger points by total projected spend and reliability risk.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Use mileage and age milestones to schedule preventive interventions earlier.</div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center gap-2"><Wallet className="h-5 w-5" />{topic} Optimization and Cost Control Levers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Improve input quality by tracking {narrative.keyInputs} from real records.</li>
              <li>- Apply threshold governance: {narrative.thresholdGuidance}.</li>
              <li>- Execute levers: {narrative.optimizationLevers}.</li>
              <li>- Include downtime and indirect impacts for full-cost visibility.</li>
              <li>- Track estimate-versus-actual variance and recalibrate assumptions regularly.</li>
              <li>- Prioritize interventions with the highest modeled cost-risk impact first.</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />{topic} Risks and Modeling Boundaries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Inputs can become stale quickly under changing supplier and labor markets.</li>
              <li>- One-time estimates may misstate lifecycle exposure.</li>
              <li>- Policy and warranty constraints can alter practical outcomes.</li>
              <li>- Use this as a structured planning aid, not a contractual guarantee.</li>
              <li>- Unexpected diagnostic findings can move final scope significantly from estimates.</li>
              <li>- Regional labor-capacity constraints can cause schedule and cost overruns.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: {config.topicLabel} Benchmarks
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
          Benchmarks are planning references only. Validate with current vendor quotes, inspection data, and policy documents.
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References and Resources
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official and Standards Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.nhtsa.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA</a> - safety and vehicle guidance context</li>
              <li>- <a href="https://www.epa.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">EPA</a> - efficiency and emissions context</li>
              <li>- <a href="https://www.fueleconomy.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FuelEconomy.gov</a> - fuel-use context</li>
              <li>- <a href="https://www.ftc.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FTC</a> - consumer guidance context for service and warranty disclosures</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Research and Technical Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.sae.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">SAE International</a> - engineering and automotive technical context</li>
              <li>- <a href="https://www.nhtsa.gov/vehicle" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NHTSA Vehicle Resources</a> - maintenance and safety references</li>
              <li>- <a href="https://www.nist.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NIST</a> - standards and measurement context for technical maintenance workflows</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Cost and Market Context</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.aaa.com/autorepair/articles/what-does-it-cost-to-own-and-operate-a-car" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AAA Driving Cost Context</a> - ownership and maintenance cost framing</li>
              <li>- <a href="https://www.bls.gov/cpi/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. BLS CPI</a> - inflation context for planning assumptions</li>
              <li>- <a href="https://fred.stlouisfed.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FRED Economic Data</a> - labor and inflation trend context for maintenance cost planning</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Educational and Community References</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>- <a href="https://www.reddit.com/r/MechanicAdvice/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/MechanicAdvice</a> - practical maintenance problem patterns</li>
              <li>- <a href="https://www.reddit.com/r/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Reddit r/cars</a> - ownership and maintenance decision context</li>
              <li>- <a href="https://www.consumerreports.org/cars/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Consumer Reports Cars</a> - consumer-focused maintenance and reliability education context</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Tool-Specific Research Focus</h3>
            <p className="text-muted-foreground">
              For {config.title}, prioritize references on {narrative.researchFocus} to keep your assumptions aligned with this decision model.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator is for maintenance planning and educational use. For this tool, validate assumptions with sources focused on {narrative.researchFocus}. It does not replace professional inspection or contractual guidance.
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

export default AdvancedMaintenanceSuiteCalculator;
