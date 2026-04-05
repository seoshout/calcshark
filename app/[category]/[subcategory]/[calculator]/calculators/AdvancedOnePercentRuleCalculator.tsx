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
  Gauge,
  Info,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  MessageSquare,
  Percent,
  RefreshCw,
  Route,
  Shield,
  Target,
  TrendingDown,
  Wallet,
  Wrench,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type Status = 'excellent' | 'strong' | 'pass' | 'borderline' | 'weak';

interface Inputs {
  purchasePrice: string;
  rehabCosts: string;
  monthlyRent: string;
  vacancyRate: string;
  monthlyOperatingExpenses: string;
  closingCostsPercent: string;
  downPaymentPercent: string;
  interestRatePercent: string;
  loanTermYears: string;
}

interface Result {
  totalBasis: number;
  totalAcquisitionCost: number;
  rulePercent: number;
  status: Status;
  targetOne: number;
  targetTwo: number;
  gapToOne: number;
  effectiveRent: number;
  monthlyNoi: number;
  capRate: number;
  debtService: number;
  cashFlowAfterDebt: number;
  dscr: number | null;
  cashNeeded: number;
  cashOnCash: number | null;
  stressCashFlow: number;
  notes: string[];
  warnings: string[];
}

const DEFAULTS: Inputs = {
  purchasePrice: '225000',
  rehabCosts: '15000',
  monthlyRent: '2400',
  vacancyRate: '6',
  monthlyOperatingExpenses: '850',
  closingCostsPercent: '3',
  downPaymentPercent: '25',
  interestRatePercent: '7.00',
  loanTermYears: '30'
};

const FAQS: FAQItem[] = [
  { question: 'What is the 1% rule?', answer: 'It is a quick rental screening rule. Monthly gross rent should be at least 1% of the purchase price plus rehab budget.', category: 'Basics' },
  { question: 'Does passing the 1% rule guarantee a good deal?', answer: 'No. It is only a first-pass filter. Taxes, insurance, repairs, reserves, financing, and capex still matter.', category: 'Risk' },
  { question: 'Why include rehab costs?', answer: 'Value-add deals should be screened on total project basis, not just contract price, so the rent target stays realistic.', category: 'Assumptions' },
  { question: 'Are closing costs part of the rule?', answer: 'Usually no for the classic rule, but they still affect cash invested and return metrics, so this calculator tracks them separately.', category: 'Assumptions' },
  { question: 'Why show DSCR and cash-on-cash return?', answer: 'Many live tools stop at pass or fail. These extra outputs make the screen more decision-ready while keeping the same page structure.', category: 'Features' },
  { question: 'Can a property below 1% still work?', answer: 'Yes, especially in appreciation-led or premium markets. It just means you should not treat it as a simple cash-flow deal.', category: 'Strategy' },
  { question: 'What vacancy rate should I use?', answer: 'Use a number that matches your market and turnover pattern. Many investors screen with something in the 3% to 8% range, but weaker submarkets or heavier tenant churn may justify a higher figure.', category: 'Operations' },
  { question: 'What should be included in monthly operating expenses?', answer: 'Typical items include taxes, insurance, repairs, maintenance, management, HOA dues, utilities paid by the owner, lawn care, bookkeeping, and recurring operating reserves.', category: 'Operations' },
  { question: 'Why does this calculator show a 2% target too?', answer: 'The 2% target is not a universal requirement. It is shown as a stronger benchmark so you can quickly see how far the current deal is from a high-cash-flow scenario.', category: 'Features' },
  { question: 'What should I do after this screen?', answer: 'Move into full underwriting. Validate rent with comps, tighten expense assumptions, review financing quotes, estimate capex and reserves, and test downside scenarios before making an offer.', category: 'Next Steps' }
];


const quickReferenceRows = [
  { category: 'Rent-to-Price Ratio', range: 'Below 0.80%', unit: 'screening band', notes: 'Usually weak for pure cash-flow investing unless there is a clear value-add or appreciation story.' },
  { category: 'Rent-to-Price Ratio', range: '0.80% to 0.99%', unit: 'screening band', notes: 'Borderline zone that usually needs stronger pricing, rent upside, or better financing.' },
  { category: 'Rent-to-Price Ratio', range: '1.00% to 1.19%', unit: 'screening band', notes: 'Classic pass range for a first-pass rental screen.' },
  { category: 'Vacancy Assumption', range: '3% to 8%', unit: 'annualized vacancy', notes: 'Common planning range depending on market tightness and tenant turnover.' },
  { category: 'Operating Expense Ratio', range: '35% to 50%', unit: 'of gross rent', notes: 'Broad residential planning range before financing and capex.' },
  { category: 'Buyer Closing Costs', range: '2% to 5%', unit: 'of purchase price', notes: 'Typical buyer-side planning range depending on lender, taxes, and prepaid items.' }
];
const parse = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const usd = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const pct = (value: number, digits = 2) => `${value.toFixed(digits)}%`;

const payment = (principal: number, annualRate: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
};

const getStatus = (rulePercent: number): Status => {
  if (rulePercent >= 1.5) return 'excellent';
  if (rulePercent >= 1.2) return 'strong';
  if (rulePercent >= 1.0) return 'pass';
  if (rulePercent >= 0.8) return 'borderline';
  return 'weak';
};

const badgeClass: Record<Status, string> = {
  excellent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  strong: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  pass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  borderline: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  weak: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
};

const badgeLabel: Record<Status, string> = {
  excellent: 'Exceptional Screening Ratio',
  strong: 'Strong Screening Ratio',
  pass: 'Passes the 1% Rule',
  borderline: 'Borderline Screening Ratio',
  weak: 'Below the 1% Rule'
};

export default function AdvancedOnePercentRuleCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

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
    const purchasePrice = parse(inputs.purchasePrice);
    const rehabCosts = parse(inputs.rehabCosts);
    const monthlyRent = parse(inputs.monthlyRent);
    const vacancyRate = Math.min(Math.max(parse(inputs.vacancyRate), 0), 50);
    const monthlyOperatingExpenses = parse(inputs.monthlyOperatingExpenses);
    const closingCostsPercent = Math.min(Math.max(parse(inputs.closingCostsPercent), 0), 15);
    const downPaymentPercent = Math.min(Math.max(parse(inputs.downPaymentPercent), 0), 100);
    const interestRatePercent = Math.max(parse(inputs.interestRatePercent), 0);
    const loanTermYears = Math.max(parse(inputs.loanTermYears), 0);

    if (purchasePrice <= 0 || monthlyRent <= 0) {
      alert('Please enter a purchase price and monthly rent greater than zero.');
      return;
    }

    const totalBasis = purchasePrice + rehabCosts;
    const closingCosts = purchasePrice * (closingCostsPercent / 100);
    const totalAcquisitionCost = totalBasis + closingCosts;
    const targetOne = totalBasis * 0.01;
    const targetTwo = totalBasis * 0.02;
    const gapToOne = targetOne - monthlyRent;
    const rulePercent = (monthlyRent / totalBasis) * 100;
    const effectiveRent = monthlyRent * (1 - vacancyRate / 100);
    const monthlyNoi = effectiveRent - monthlyOperatingExpenses;
    const annualNoi = monthlyNoi * 12;
    const capRate = (annualNoi / totalBasis) * 100;
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = Math.max(purchasePrice - downPayment, 0);
    const debtService = isAdvancedMode ? payment(loanAmount, interestRatePercent, loanTermYears * 12) : 0;
    const annualDebtService = debtService * 12;
    const cashFlowAfterDebt = monthlyNoi - debtService;
    const dscr = annualDebtService > 0 ? annualNoi / annualDebtService : null;
    const cashNeeded = (isAdvancedMode ? downPayment : purchasePrice) + rehabCosts + closingCosts;
    const cashOnCash = cashNeeded > 0 ? ((cashFlowAfterDebt * 12) / cashNeeded) * 100 : null;
    const stressCashFlow = (monthlyRent * 0.95 * (1 - Math.min(vacancyRate + 3, 50) / 100)) - (monthlyOperatingExpenses * 1.1) - debtService;
    const status = getStatus(rulePercent);

    const notes: string[] = [];
    const warnings: string[] = [];

    notes.push(status === 'pass' || status === 'strong' || status === 'excellent'
      ? 'The headline rent screen is supportive. Move to full underwriting next.'
      : 'The property misses or barely clears the classic screen. Strategy fit matters more here.');
    notes.push('Use the gap-to-1% output as a pricing, rent-up, or rehab-planning signal.');
    notes.push('Financing outputs are included so the page behaves more like stronger live calculators, not just a one-line rule check.');

    if (monthlyOperatingExpenses / monthlyRent > 0.5) warnings.push('Operating expenses are heavy versus gross rent. Recheck taxes, insurance, management, and repair assumptions.');
    if (isAdvancedMode && dscr !== null && dscr < 1.2) warnings.push('Debt coverage is thin. This deal may fail your internal financing guardrails.');
    if (cashFlowAfterDebt < 0) warnings.push('Current financing assumptions produce negative monthly cash flow after debt service.');
    if (stressCashFlow < 0) warnings.push('The downside case goes negative quickly, which suggests limited margin for error.');

    setResult({
      totalBasis,
      totalAcquisitionCost,
      rulePercent,
      status,
      targetOne,
      targetTwo,
      gapToOne,
      effectiveRent,
      monthlyNoi,
      capRate,
      debtService,
      cashFlowAfterDebt,
      dscr,
      cashNeeded,
      cashOnCash,
      stressCashFlow,
      notes,
      warnings
    });
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
            <h2 className="text-2xl font-bold text-foreground">Rental Deal Screening and Cash Flow Snapshot</h2>
            <p className="text-sm text-muted-foreground mt-1">Built to keep the live car-payment structure while adding the best features seen in stronger 1% rule tools online.</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{isAdvancedMode ? 'Adds debt service, DSCR, cash needed, cash-on-cash return, and a downside check.' : 'Keeps the tool focused on the classic rule plus operating reality.'}</p>
          </div>
          <button onClick={() => setIsAdvancedMode((prev) => !prev)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
            {isAdvancedMode ? <><ChevronUp className="h-4 w-4 mr-2" />Switch to Simple</> : <><ChevronDown className="h-4 w-4 mr-2" />Advanced Options</>}
          </button>
        </div>

        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <button onClick={() => setShowModeDropdown((prev) => !prev)} className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between">
              <span className="font-medium">Acquisition + Financing Screening Mode</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">This mode keeps the page simple while adding financing context that many basic 1% rule widgets skip.</div>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">Purchase Price ($)</label><input type="number" min="0" value={inputs.purchasePrice} onChange={(e) => onChange('purchasePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Rehab Costs ($)</label><input type="number" min="0" value={inputs.rehabCosts} onChange={(e) => onChange('rehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Rent ($)</label><input type="number" min="0" value={inputs.monthlyRent} onChange={(e) => onChange('monthlyRent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Vacancy Rate (%)</label><input type="number" min="0" max="50" step="0.1" value={inputs.vacancyRate} onChange={(e) => onChange('vacancyRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Operating Expenses ($)</label><input type="number" min="0" value={inputs.monthlyOperatingExpenses} onChange={(e) => onChange('monthlyOperatingExpenses', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Closing Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.closingCostsPercent} onChange={(e) => onChange('closingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          {isAdvancedMode && <><div><label className="block text-sm font-medium text-foreground mb-2">Down Payment (%)</label><input type="number" min="0" max="100" step="0.1" value={inputs.downPaymentPercent} onChange={(e) => onChange('downPaymentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Interest Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.interestRatePercent} onChange={(e) => onChange('interestRatePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Loan Term (years)</label><input type="number" min="1" value={inputs.loanTermYears} onChange={(e) => onChange('loanTermYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Analyze 1% Rule</button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label="1% Rule results dashboard">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div><h3 className="text-xl font-bold text-foreground">1% Rule Results Dashboard</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved live-page pattern.</p></div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', badgeClass[result.status])}>{badgeLabel[result.status]}</span>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><div className="text-xs text-muted-foreground">Rent-to-Price Ratio</div><div className="text-3xl font-bold">{pct(result.rulePercent)}</div></div>
                  <div><div className="text-xs text-muted-foreground">1% Target Rent</div><div className="text-2xl font-semibold">{usd(result.targetOne)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Gap to 1%</div><div className="text-2xl font-semibold">{result.gapToOne > 0 ? usd(result.gapToOne) : `${usd(Math.abs(result.gapToOne))} ahead`}</div></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Effective Monthly Rent</div><div className="text-2xl font-bold mt-1">{usd(result.effectiveRent)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Monthly NOI</div><div className="text-2xl font-bold mt-1">{usd(result.monthlyNoi)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Estimated Cap Rate</div><div className="text-2xl font-bold mt-1">{pct(result.capRate)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Monthly Debt Service</div><div className="text-2xl font-bold mt-1">{usd(result.debtService)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Cash Flow After Debt</div><div className="text-2xl font-bold mt-1">{usd(result.cashFlowAfterDebt)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">DSCR / Cash-on-Cash</div><div className="text-lg font-bold mt-1">{result.dscr === null ? 'All-Cash' : `${result.dscr.toFixed(2)}x`} / {result.cashOnCash === null ? 'N/A' : pct(result.cashOnCash)}</div></div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul>
                </div>
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but full underwriting is still required.</li>}</ul>
                  <div className="mt-4 text-sm"><span className="font-medium">Stress-case monthly cash flow:</span> {usd(result.stressCashFlow)}</div>
                  <div className="mt-1 text-sm"><span className="font-medium">Cash needed up front:</span> {usd(result.cashNeeded)}</div>
                </div>
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
          This 1% Rule Calculator is designed for real rental-property screening, not just a one-line ratio check. It combines the classic rent-to-price benchmark with vacancy drag, operating pressure, financing impact, and a quick downside scenario so you can move from headline math to practical decision context.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          Use it when your goal is to decide whether a listing deserves deeper underwriting, whether the asking price needs to move, or whether the deal only works under a different strategy such as appreciation, house hacking, or value-add repositioning.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-6">
          The page is most useful when you feed it realistic rent comps, current financing quotes, and honest operating assumptions. Strong screening math can still hide a weak deal if the inputs are overly optimistic.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Percent className="h-4 w-4 text-primary" />Rule Screening Metrics</div>Targets for 1% and 2%, exact rent gap, and a clear pass-or-fail style status.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" />Operating Reality Check</div>Vacancy-adjusted rent, monthly NOI, and cap-rate context so the screen is not overly optimistic.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" />Financing Impact</div>Debt service, DSCR, cash needed, and cash-on-cash return in advanced mode.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" />Stress Test</div>A quick downside view using lower rent, higher vacancy, and higher operating expenses.</div>
        </div>
        <div className="mt-6 p-5 bg-muted rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            What This Advanced Version Adds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Percent className="h-4 w-4 mt-0.5 text-primary" />Classic 1% and stretch 2% target-rent benchmarks</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Target className="h-4 w-4 mt-0.5 text-primary" />Exact rent gap for pricing or rent-up planning</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Wallet className="h-4 w-4 mt-0.5 text-primary" />Vacancy-adjusted rent and monthly NOI before debt</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Landmark className="h-4 w-4 mt-0.5 text-primary" />Debt service, DSCR, cash needed, and cash-on-cash return</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><BarChart3 className="h-4 w-4 mt-0.5 text-primary" />Estimated cap-rate context for a faster first-pass review</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-primary" />A simple downside case to highlight fragile deals early</div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online 1% Rule Calculator
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1. Build the acquisition baseline</h4>
                Start with a realistic purchase price and rehab budget based on actual contractor quotes, inspection findings, and the work needed to make the property rent-ready. This creates the basis for the 1% and 2% target-rent checks.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-blue-600 dark:text-blue-400" />2. Enter market-backed rent assumptions</h4>
                Use rent comps, current competing listings, and property-manager feedback rather than best-case guesses. If the rent is uncertain, rerun the tool with a conservative case before trusting the result.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />3. Add vacancy and operating drag</h4>
                Vacancy and recurring expenses are what separate a clean-looking ratio from a practical rental plan. Use taxes, insurance, management, maintenance, and utilities that reflect the actual property, not a generic placeholder.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />4. Switch on financing context when needed</h4>
                Advanced mode overlays closing costs, debt service, DSCR, cash needed, and cash-on-cash return. This helps you see whether the property still works once real leverage is layered onto the deal.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />5. Calculate and review the popup dashboard</h4>
                The results modal summarizes the screening ratio, target-rent gap, effective rent, NOI, cap-rate context, financing pressure, and downside stress case without changing the page layout.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />6. Treat the result as a screening decision, not a final approval</h4>
                A strong result means the property deserves deeper underwriting. A weak result may still be viable, but only if you intentionally classify it as a different kind of investment strategy.
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Results Dashboard (Popup Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Rule Status and Screening Band</h4>
                <p className="text-xs text-muted-foreground">Shows whether the current rent profile is weak, borderline, passing, strong, or exceptional.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-green-600 dark:text-green-400" />Target Rent and Ratio Gap</h4>
                <p className="text-xs text-muted-foreground">Displays the 1% and 2% benchmarks plus the exact gap to the classic 1% threshold.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Operating Performance Snapshot</h4>
                <p className="text-xs text-muted-foreground">Summarizes effective rent after vacancy, monthly NOI, and cap-rate context for a more realistic read.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-green-600 dark:text-green-400" />Financing Pressure View</h4>
                <p className="text-xs text-muted-foreground">Adds debt service, DSCR, cash needed, and cash-on-cash return in advanced mode.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Downside Stress Signal</h4>
                <p className="text-xs text-muted-foreground">Highlights deals that break quickly when rent softens, vacancy rises, or expenses creep up.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />Notes and Warning Flags</h4>
                <p className="text-xs text-muted-foreground">Ends with action-oriented notes and warning flags that tell you what to validate next.</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Why Use This Version?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Calculator className="h-4 w-4 text-orange-600 dark:text-orange-400" />Beyond a basic rule-of-thumb widget</h4>
                <p className="text-sm text-muted-foreground">Most 1% rule tools stop at a single ratio. This version shows what happens after vacancy, expenses, and financing start pressuring the deal.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />Useful for pricing and negotiation</h4>
                <p className="text-sm text-muted-foreground">The gap-to-1% output gives you a practical way to think about asking-price cuts, rent-up goals, or whether the property belongs in your buy box at all.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />Financing-aware screening</h4>
                <p className="text-sm text-muted-foreground">A passing ratio can still produce thin or negative cash flow once debt is added. The financing overlay helps surface that immediately.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />Better downside visibility</h4>
                <p className="text-sm text-muted-foreground">The simple stress case is useful when you want to know whether a deal is merely acceptable on paper or resilient enough to survive normal variance.</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              1% Rule Advanced Features
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>All-in acquisition context that separates rule basis from total cash needed.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Target-rent outputs for both 1% and 2% benchmarks so strong and weak deals are easier to classify.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Vacancy-adjusted effective rent, monthly NOI, cap-rate context, and financing-aware cash-flow math.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>DSCR, cash-on-cash return, and stress-case outputs designed for better first-pass decision quality.</span></div>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              1% Rule Decision Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set approval limits before browsing listings</h4>
                <p className="text-muted-foreground">Decide your minimum acceptable ratio, DSCR floor, and downside cash-flow tolerance before the property emotionally pulls you in.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Treat the gap-to-1% as a lever</h4>
                <p className="text-muted-foreground">The gap can be closed through price, rent, or cost assumptions. Knowing which lever matters most improves negotiation discipline.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Separate strategy types clearly</h4>
                <p className="text-muted-foreground">A property that fails the rule may still belong in an appreciation or redevelopment bucket. The mistake is pretending it is a simple cash-flow deal.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Re-run after every real quote change</h4>
                <p className="text-muted-foreground">Updated taxes, insurance, lender terms, contractor bids, or rent comps can change the decision quickly, especially on thin deals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Understanding 1% Rule Investment Screening</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5" />Core Concept and Decision Context</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">The 1% rule is a screening shortcut used by rental-property investors to decide which listings deserve more attention. It compares monthly gross rent against the property basis used for acquisition, often purchase price plus rehab for value-add deals.</p>
            <p className="text-blue-800 dark:text-blue-200 mb-3">Its real value is speed. Instead of underwriting every listing in full detail, you can quickly filter for properties that are obviously weak, close enough to revisit, or strong enough to justify a deeper model.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Best used for early deal triage, not final approval.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Works best when paired with realistic rent, vacancy, and expense assumptions.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Useful for turnkey, house-hack, and value-add screening.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Should always be followed by a full underwriting pass.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors Affecting Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Acquisition price discipline and whether the asking price already assumes perfect execution.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Rehab scope and whether the budget is truly enough to reach the target rent.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">True market rent, concessions, lease-up speed, and tenant turnover patterns.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Taxes, insurance, management, maintenance, utilities, and recurring reserves.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Debt structure, especially rate, amortization, and down payment.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Submarket quality, which often explains why some very high ratios are riskier than they first appear.</div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Comparison Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Baseline case: today&apos;s purchase price, rehab budget, and current market rent.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Negotiation case: the price needed to bring the property into your preferred band.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Rent-up case: the rent required after renovations or operational changes.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Financed case: whether leverage still leaves enough room after NOI and debt service.</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Target className="h-5 w-5" />Threshold and Timing Guidance</h3>
            <ul className="space-y-2">
              <li>- Below 0.80% often signals weak cash-flow economics unless the deal has a strong alternative thesis.</li>
              <li>- Around 0.80% to 0.99% can still work with stronger financing, lower expenses, or clear rent upside.</li>
              <li>- Around 1.00% is the classic first-pass benchmark, but the deal still needs a full operating review.</li>
              <li>- Ratios above 1.20% deserve extra due diligence because unusually high headline returns can hide quality or stability issues.</li>
              <li>- Recalculate after lender quotes, inspection findings, insurance updates, or rent-comp changes.</li>
            </ul>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><Wallet className="h-5 w-5" />Practical Use and Strategy Fit</h3>
            <p className="text-cyan-800 dark:text-cyan-200 mb-3">Use the ratio to decide which properties deserve deeper time, not to force every good investment into a single rule. Cash-flow buyers, appreciation buyers, house hackers, and redevelopment investors may all use the same tool differently.</p>
            <p className="text-cyan-800 dark:text-cyan-200">The most important mistake to avoid is confusing a strategy mismatch with a bad calculation. Sometimes a deal is not wrong; it is simply a different kind of investment than the one you intended to buy.</p>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: 1% Rule Benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-3 px-4 font-semibold text-foreground">Planning Category</th><th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th><th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th><th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th></tr></thead>
            <tbody>{quickReferenceRows.map((row) => <tr key={`${row.category}-${row.range}`} className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">{row.category}</td><td className="py-3 px-4">{row.range}</td><td className="py-3 px-4">{row.unit}</td><td className="py-3 px-4 text-muted-foreground">{row.notes}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-primary" />Scientific References & Resources</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.huduser.gov/portal/datasets/fmr.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">HUD Fair Market Rents</a> - public rent benchmark context for market-rent sense checks.</li>
              <li>- <a href="https://www.irs.gov/taxtopics/tc414" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Topic No. 414</a> - rental income and expense basics for U.S. tax context.</li>
              <li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - useful context on buyer-side closing cost categories.</li>
              <li>- <a href="https://www.bls.gov/data/inflation_calculator.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI Inflation Calculator</a> - helpful when pressure-testing costs or rent growth in real terms.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.biggerpockets.com/blog/one-percent-rule-real-estate-evaluate-rentals" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BiggerPockets on the One Percent Rule</a> - a widely used investor explanation of how the rule is applied in practice.</li>
              <li>- <a href="https://propertyanalysistools.com/calculators/rent-to-price-ratio/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Property Analysis Tools 1% Rule Calculator</a> - useful feature reference for ratio, target-rent, and gap analysis patterns.</li>
              <li>- <a href="https://rentredi.com/blog/financial-considerations-for-a-rental-property/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">RentRedi on rental property financial considerations</a> - useful context for why rule-based screening should be followed by deeper analysis.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3>
            <p>Prioritize current rent comps, realistic expense assumptions, and lender terms when validating results. The ratio itself is simple, but the quality of the decision comes from the quality of the assumptions behind it.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace lender disclosures, tax advice, legal review, or a full rental-property underwriting model.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2>
        <FAQAccordion faqs={FAQS} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="1% Rule Calculator" />
      </div>
    </div>
  );
}



