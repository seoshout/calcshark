'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Leaf,
  MessageSquare,
  RefreshCw,
  Route,
  Shield,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

export type DealAcquisitionVariant = 'fix-and-flip' | 'wholesale';

interface Props {
  variant: DealAcquisitionVariant;
}

interface Inputs {
  afterRepairValue: string;
  rehabCosts: string;
  contractPrice: string;
  customRulePercent: string;
  contingencyPercent: string;
  buyingCostsPercent: string;
  sellingCostsPercent: string;
  holdingMonths: string;
  monthlyHoldingCosts: string;
  monthlyFinancingCost: string;
  assignmentFee: string;
  desiredProfit: string;
}

interface ResultMetric {
  label: string;
  value: number;
  currency?: boolean;
  suffix?: string;
}

interface Result {
  primaryLabel: string;
  primaryValue: number;
  primaryCurrency?: boolean;
  metrics: ResultMetric[];
  notes: string[];
  warnings: string[];
}

interface Config {
  title: string;
  subtitle: string;
  cta: string;
  reviewName: string;
  focus: string;
  researchFocus: string;
  understandingTitle: string;
}

const CONFIG: Record<DealAcquisitionVariant, Config> = {
  'fix-and-flip': {
    title: 'Fix and Flip Calculator',
    subtitle: 'Advanced flip-deal analysis across offer pricing, full costs, and projected profit',
    cta: 'Analyze Fix and Flip',
    reviewName: 'Fix and Flip Calculator',
    focus: 'projected flip profit and offer discipline',
    researchFocus: 'ARV, rehab scope, hold time, financing, and selling friction',
    understandingTitle: 'Understanding Fix and Flip Planning',
  },
  wholesale: {
    title: 'Wholesale Calculator',
    subtitle: 'Advanced wholesale-deal analysis across investor MAO, assignment spread, and contract positioning',
    cta: 'Analyze Wholesale Deal',
    reviewName: 'Wholesale Calculator',
    focus: 'assignment spread and investor-buyer fit',
    researchFocus: 'investor MAO, assignment fee, ARV, rehab, and contract spread',
    understandingTitle: 'Understanding Wholesale Deal Planning',
  },
};

const DEFAULTS: Inputs = {
  afterRepairValue: '325000',
  rehabCosts: '55000',
  contractPrice: '165000',
  customRulePercent: '70',
  contingencyPercent: '10',
  buyingCostsPercent: '2.5',
  sellingCostsPercent: '8',
  holdingMonths: '6',
  monthlyHoldingCosts: '950',
  monthlyFinancingCost: '1800',
  assignmentFee: '15000',
  desiredProfit: '30000',
};

const FAQS: FAQItem[] = [
  {
    question: 'Why use a custom rule percentage?',
    answer:
      'Many operators adjust their rule percentage based on market speed, financing costs, and execution risk. The custom rule lets you test your real buy-box instead of assuming 70% is universal.',
    category: 'Basics',
  },
  {
    question: 'What is the difference between fix-and-flip and wholesale analysis?',
    answer:
      'A flip model cares about full project profit after rehab, carry, and resale. A wholesale model cares about whether the investor-buyer can still hit a workable MAO after your assignment fee is added.',
    category: 'Method',
  },
  {
    question: 'Why does assignment fee sizing matter so much in a wholesale deal?',
    answer:
      'Because the assignment fee sits on top of the investor-buyer economics. A wholesale contract only stays attractive when the end buyer still has room for rehab, resale friction, and profit after your fee is included.',
    category: 'Wholesale',
  },
  {
    question: 'What should I validate after this screen?',
    answer:
      'Validate ARV comps, rehab scope, hold assumptions, closing costs, financing terms, and real buyer appetite before trusting the deal.',
    category: 'Next Steps',
  },
];

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const usd = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatMetric = (metric: ResultMetric) =>
  metric.currency
    ? usd(metric.value)
    : metric.suffix
      ? `${metric.value.toFixed(2)}${metric.suffix}`
      : `${metric.value.toFixed(2)}%`;

function buildResult(variant: DealAcquisitionVariant, inputs: Inputs): Result {
  const arv = parse(inputs.afterRepairValue);
  const rehab = parse(inputs.rehabCosts);
  const contract = parse(inputs.contractPrice);
  const rulePercent = Math.min(Math.max(parse(inputs.customRulePercent), 40), 90);
  const contingency = rehab * (parse(inputs.contingencyPercent) / 100);
  const buyCosts = contract * (parse(inputs.buyingCostsPercent) / 100);
  const sellCosts = arv * (parse(inputs.sellingCostsPercent) / 100);
  const holdCosts = parse(inputs.holdingMonths) * parse(inputs.monthlyHoldingCosts);
  const financing = parse(inputs.holdingMonths) * parse(inputs.monthlyFinancingCost);
  const assignmentFee = parse(inputs.assignmentFee);
  const investorMao = arv * (rulePercent / 100) - rehab;
  const maxWholesaleContract = investorMao - assignmentFee;

  if (variant === 'wholesale') {
    const spread = maxWholesaleContract - contract;
    const notes = [
      'This run centers on whether the end buyer can still fit the deal after your assignment fee is layered in.',
      'A wholesale deal gets stronger when the buyer still has clear room after rehab, resale friction, and your fee.',
      'Use the contract spread as a negotiation signal, not just a vanity number.',
    ];
    const warnings: string[] = [];

    if (spread < 0) warnings.push('Current contract price is above the modeled wholesale ceiling.');
    if (assignmentFee > investorMao * 0.12) {
      warnings.push('Assignment fee may be too aggressive for the modeled investor spread.');
    }

    return {
      primaryLabel: 'Max Wholesale Contract Price',
      primaryValue: maxWholesaleContract,
      primaryCurrency: true,
      metrics: [
        { label: 'Investor MAO', value: investorMao, currency: true },
        { label: 'Assignment Fee', value: assignmentFee, currency: true },
        { label: 'Contract Spread', value: spread, currency: true },
        { label: 'Rule Percent', value: rulePercent },
      ],
      notes,
      warnings,
    };
  }

  const totalCost = contract + rehab + contingency + buyCosts + sellCosts + holdCosts + financing;
  const profit = arv - totalCost;
  const margin = arv > 0 ? (profit / arv) * 100 : 0;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const maoGap = investorMao - contract;
  const notes = [
    'This run combines maximum-offer discipline with a fuller flip cost model so the deal is not judged by MAO alone.',
    'Use profit and margin alongside the rule gap before deciding the project really fits your operation.',
    'If profit only survives under optimistic ARV or light contingency, the acquisition is thinner than it first appears.',
  ];
  const warnings: string[] = [];

  if (profit < 0) warnings.push('Detailed cost modeling produces a projected loss.');
  if (maoGap < 0) warnings.push('Current contract price is above the modeled maximum allowable offer.');
  if (margin < 10) warnings.push('Projected margin is thin for a renovation project.');
  if (contingency < rehab * 0.1) warnings.push('Contingency may be too light for the rehab scope.');

  return {
    primaryLabel: 'Projected Net Profit',
    primaryValue: profit,
    primaryCurrency: true,
    metrics: [
      { label: 'Max Allowable Offer', value: investorMao, currency: true },
      { label: 'Contract Gap', value: maoGap, currency: true },
      { label: 'Profit Margin', value: margin },
      { label: 'ROI on Cost', value: roi },
    ],
    notes,
    warnings,
  };
}

export default function AdvancedDealAcquisitionSuiteCalculator({ variant }: Props) {
  const config = CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const resultTitle = useMemo(() => `${config.title} Results Dashboard`, [config.title]);

  const onChange = (field: keyof Inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onReset = () => {
    setInputs(DEFAULTS);
    setIsAdvancedMode(true);
    setShowModeDropdown(false);
    setShowModal(false);
    setResult(null);
  };

  const onCalculate = () => {
    if (parse(inputs.afterRepairValue) <= 0 || parse(inputs.contractPrice) <= 0) {
      alert('Please enter ARV and contract price greater than zero.');
      return;
    }

    setResult(buildResult(variant, inputs));
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Includes custom rule %, cost stack, and spread/profit context.'
                : 'Keeps the tool focused on the primary acquisition screen.'}
            </p>
          </div>
          <button
            onClick={() => setIsAdvancedMode((prev) => !prev)}
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
            <button
              onClick={() => setShowModeDropdown((prev) => !prev)}
              className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between"
            >
              <span className="font-medium">Acquisition Pricing + Margin Screen</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform',
                  showModeDropdown && 'rotate-180'
                )}
              />
            </button>
            {showModeDropdown && (
              <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">
                This mode connects rule-based offer discipline with real project or assignment economics.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">After Repair Value ($)</label>
            <input type="number" min="0" value={inputs.afterRepairValue} onChange={(e) => onChange('afterRepairValue', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rehab Costs ($)</label>
            <input type="number" min="0" value={inputs.rehabCosts} onChange={(e) => onChange('rehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contract / Offer Price ($)</label>
            <input type="number" min="0" value={inputs.contractPrice} onChange={(e) => onChange('contractPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" />
          </div>

          {isAdvancedMode && (
            <>
              <div><label className="block text-sm font-medium text-foreground mb-2">Custom Rule (%)</label><input type="number" min="40" max="90" step="0.1" value={inputs.customRulePercent} onChange={(e) => onChange('customRulePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Contingency (% of rehab)</label><input type="number" min="0" max="50" step="0.1" value={inputs.contingencyPercent} onChange={(e) => onChange('contingencyPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Buying Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.buyingCostsPercent} onChange={(e) => onChange('buyingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Selling Costs (%)</label><input type="number" min="0" max="20" step="0.1" value={inputs.sellingCostsPercent} onChange={(e) => onChange('sellingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Holding Months</label><input type="number" min="0" value={inputs.holdingMonths} onChange={(e) => onChange('holdingMonths', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Holding Costs ($)</label><input type="number" min="0" value={inputs.monthlyHoldingCosts} onChange={(e) => onChange('monthlyHoldingCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Financing Cost ($)</label><input type="number" min="0" value={inputs.monthlyFinancingCost} onChange={(e) => onChange('monthlyFinancingCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Assignment Fee ($)</label><input type="number" min="0" value={inputs.assignmentFee} onChange={(e) => onChange('assignmentFee', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Desired Profit ($)</label><input type="number" min="0" value={inputs.desiredProfit} onChange={(e) => onChange('desiredProfit', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />{config.cta}</button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label={`${config.title} results dashboard`}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div>
                <h3 className="text-xl font-bold text-foreground">{resultTitle}</h3>
                <p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{result.primaryLabel}</div>
                    <div className="text-3xl font-bold">{result.primaryCurrency ? usd(result.primaryValue) : `${result.primaryValue.toFixed(2)}%`}</div>
                  </div>
                  {result.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-2xl font-semibold">{formatMetric(metric)}</div></div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {result.metrics.map((metric) => (
                  <div key={metric.label} className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-xl font-bold mt-1">{formatMetric(metric)}</div></div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul></div>
                <div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but full deal analysis is still required.</li>}</ul></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          About This Calculator
        </h2>
        <p className="text-base text-foreground leading-relaxed mb-4">
          This tool focuses on acquisition pricing discipline. For fix-and-flip deals it pairs
          MAO logic with a fuller project-profit model. For wholesale deals it centers on whether
          the end buyer still has room after your assignment fee is layered in.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          That structure helps you avoid a common mistake: judging the deal only on a shortcut
          while ignoring the cost stack or the buyer spread that actually determines whether the
          project still works.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-6">
          In practice, acquisition math is about more than &quot;what is the max offer.&quot; It is
          about whether the real contract price, real costs, and real buyer or operator margin
          still fit your model after the headline rule is applied.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4">Rule-based offer discipline paired with real-world cost friction</div>
          <div className="border rounded-xl p-4">Variant-specific logic for operator profit or wholesale spread quality</div>
          <div className="border rounded-xl p-4">Popup dashboard with practical notes and risk flags for fast screening</div>
          <div className="border rounded-xl p-4">Decision support for renegotiation, pass, or deeper underwriting</div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online {config.title}
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                1. Build the deal around conservative ARV and rehab assumptions so the opportunity
                is being judged on realistic resale potential, not optimistic upside.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                2. Enter the real contract or offer price you are considering, because acquisition
                math only becomes useful when it is tied to a price you may actually pay or assign.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                3. Add the extra cost layers or assignment spread that decide whether the
                acquisition still fits once project friction and buyer economics are made visible.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                4. Use the popup dashboard as a screening decision before you negotiate further. If
                the contract only works under a fragile spread, the dashboard should make that easy
                to spot quickly.
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Results Dashboard (Popup Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Primary acquisition output: projected net profit for flips or max wholesale contract price for assignments</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supporting metrics that show rule-based offer discipline, spread strength, and buyer/operator margin</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Notes that explain what the current run is really saying about the acquisition</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Warning flags for thin spread, weak margin, aggressive assignment fee, or weak rule fit</div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why Use This Calculator?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-200">
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Translate headline rule shortcuts into a more realistic acquisition decision.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">See whether the contract price still fits once rehab uncertainty and closing friction are added.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Evaluate whether your assignment fee still leaves a workable deal for the end buyer.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Avoid negotiating hard on a deal that only works under fragile, overly optimistic assumptions.</div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {config.title} Advanced Features
            </h3>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
              <p>
                This version is intentionally more than a single max-offer output. It is designed
                to help you screen a deal the way an operator or investor-buyer actually
                experiences it.
              </p>
              <ul className="space-y-2">
                <li>- Adjustable rule percentage so you can model your real buy box instead of a generic market shortcut.</li>
                <li>- Cost-layer inputs for contingency, closing friction, carry, financing, and resale pressure.</li>
                <li>- Variant logic that adapts the interpretation for either a flip operator or a wholesale assignment model.</li>
                <li>- Result notes and warnings that turn the output into a negotiation or pass decision, not just a number.</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/40 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Acquisition Decision Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="border rounded-lg p-4 bg-background">If the contract price is above the modeled ceiling, your next move is usually renegotiation, not rationalization.</div>
              <div className="border rounded-lg p-4 bg-background">If projected profit only looks acceptable before contingency or carry is added, the deal is thinner than it first appears.</div>
              <div className="border rounded-lg p-4 bg-background">If a wholesale spread disappears after assignment fee, the contract may not be attractive enough for a serious cash buyer.</div>
              <div className="border rounded-lg p-4 bg-background">If the deal still works with conservative inputs, you likely have a stronger acquisition than headline rules alone can show.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />{config.understandingTitle}</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 mb-3">The core job of acquisition analysis is to translate rough pricing rules into a decision that can survive real deal friction. That means testing the contract against rehab, timing, resale drag, and buyer or operator margin instead of relying on shortcut math alone.</p>
            <p className="text-blue-800 dark:text-blue-200">In strong markets, weak acquisition discipline can be hidden for a while. In slower or more expensive markets, that same discipline gap usually shows up fast through lower margin, harder exits, or a deal that no buyer wants at the contract price.</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5" />Variant-Specific Interpretation</h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>- Fix-and-flip mode asks whether the operator still earns enough projected profit after rehab, carry, financing, and resale friction.</li>
              <li>- Wholesale mode asks whether the end buyer still receives a workable deal after your assignment fee is layered in.</li>
              <li>- In both cases, the contract price has to fit the economics after all the invisible friction becomes visible.</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Common Acquisition Mistakes</h3>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li>- Using inflated ARV comps to justify a contract that only works on paper.</li>
              <li>- Underestimating rehab scope or assuming contingency is optional.</li>
              <li>- Ignoring selling costs, financing drag, or hold time when judging flip profitability.</li>
              <li>- Taking an aggressive assignment fee that removes the last bit of spread the buyer needed.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: Acquisition Benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Planning Area</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">Rule percentage</td><td className="py-3 px-4">65% to 75%</td><td className="py-3 px-4 text-muted-foreground">Higher percentages can work in strong markets, but they leave less room for error.</td></tr>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">Rehab contingency</td><td className="py-3 px-4">10% to 15%</td><td className="py-3 px-4 text-muted-foreground">Useful when the scope includes unknowns, deferred maintenance, or older systems.</td></tr>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">Selling cost drag</td><td className="py-3 px-4">6% to 10%</td><td className="py-3 px-4 text-muted-foreground">Combines agent fees, seller concessions, transfer costs, and disposition friction.</td></tr>
              <tr className="hover:bg-muted/50"><td className="py-3 px-4 font-medium">Wholesale spread quality</td><td className="py-3 px-4">Varies by market</td><td className="py-3 px-4 text-muted-foreground">The buyer still needs enough room after your fee to view the deal as worth closing.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-primary" />Scientific References & Resources</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - acquisition closing-cost context for buy and sell planning.</li>
              <li>- <a href="https://www.bls.gov/data/inflation_calculator.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI Inflation Calculator</a> - useful when adjusting older rehab or resale assumptions to current-dollar context.</li>
              <li>- <a href="https://www.fhfa.gov/reports/house-price-index" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FHFA House Price Index</a> - broader home-price trend context for resale assumptions.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://calculatehome.com/calculators/70-percent-rule.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CalculateHome 70% Rule Calculator</a> - common MAO shortcut reference for acquisition pricing.</li>
              <li>- <a href="https://www.flipperforce.com/how-to-flip-houses-curriculum" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FlipperForce House Flipping Curriculum</a> - practical flip-operator guidance on budgeting and execution.</li>
              <li>- <a href="https://dealcheck.io/features/house-flipping-calculator/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck House Flipping Calculator</a> - cost-stack context for deal-screening workflows.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3>
            <p>Prioritize {config.researchFocus}. Those are the assumptions that usually separate a clean acquisition from a deal that only works in a spreadsheet.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace comp analysis, title review, contractor bids, legal advice, or lender terms.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2>
        <FAQAccordion faqs={FAQS} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName={config.reviewName} />
      </div>
    </div>
  );
}
