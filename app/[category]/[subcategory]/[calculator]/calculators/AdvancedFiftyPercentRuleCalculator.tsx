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
  otherMonthlyIncome: string;
  vacancyRate: string;
  monthlyTaxes: string;
  monthlyInsurance: string;
  monthlyHoa: string;
  monthlyUtilities: string;
  otherMonthlyExpenses: string;
  closingCostsPercent: string;
  managementPercent: string;
  maintenancePercent: string;
  capexPercent: string;
  downPaymentPercent: string;
  interestRatePercent: string;
  loanTermYears: string;
}

interface Result {
  totalBasis: number;
  totalAcquisitionCost: number;
  grossScheduledIncome: number;
  vacancyLoss: number;
  effectiveOperatingIncome: number;
  ruleEstimatedExpenses: number;
  actualOperatingExpenses: number;
  ruleGap: number;
  actualExpenseRatio: number;
  ruleBasedNoi: number;
  actualNoi: number;
  debtService: number;
  actualCashFlow: number;
  ruleCashFlow: number;
  dscr: number | null;
  breakEvenRent: number;
  cashNeeded: number;
  managementCost: number;
  maintenanceReserve: number;
  capexReserve: number;
  status: Status;
  notes: string[];
  warnings: string[];
}

const DEFAULTS: Inputs = {
  purchasePrice: '245000',
  rehabCosts: '10000',
  monthlyRent: '2350',
  otherMonthlyIncome: '75',
  vacancyRate: '5',
  monthlyTaxes: '260',
  monthlyInsurance: '115',
  monthlyHoa: '0',
  monthlyUtilities: '60',
  otherMonthlyExpenses: '90',
  closingCostsPercent: '3',
  managementPercent: '8',
  maintenancePercent: '6',
  capexPercent: '5',
  downPaymentPercent: '25',
  interestRatePercent: '7.00',
  loanTermYears: '30'
};

const FAQS: FAQItem[] = [
  { question: 'What is the 50% rule in real estate investing?', answer: 'It is a fast rental-property screening shortcut. The rule assumes operating expenses will consume about half of operating income before mortgage payments, so the other half is what remains for NOI and debt-service planning.', category: 'Basics' },
  { question: 'Does the 50% rule include the mortgage payment?', answer: 'No. The classic rule is used to estimate non-debt operating expenses. Mortgage payments are layered on afterward to see whether the property still cash flows.', category: 'Basics' },
  { question: 'Does this calculator use gross rent or income after vacancy?', answer: 'This version makes vacancy explicit first and then applies the 50% estimate to effective operating income. That keeps the vacancy assumption visible instead of burying it inside one blended shortcut.', category: 'Method' },
  { question: 'Why compare the rule estimate to itemized expenses?', answer: 'The rule is only a shortcut. Comparing it against taxes, insurance, utilities, reserves, management, and other actual assumptions tells you whether the shortcut is understating or overstating the deal.', category: 'Features' },
  { question: 'Can a property above 50% still be a good investment?', answer: 'Yes, but it usually means you need a stronger explanation such as below-market acquisition, value-add upside, appreciation, or unusual income stability. It should trigger deeper underwriting, not automatic rejection.', category: 'Strategy' },
  { question: 'What should be included in operating expenses?', answer: 'Typical items include taxes, insurance, HOA dues, owner-paid utilities, management, routine maintenance, capital-expenditure reserves, bookkeeping, lawn care, pest control, and other recurring owner obligations.', category: 'Operations' },
  { question: 'Why does the calculator include maintenance and capex reserve percentages?', answer: 'Those reserves are frequently ignored in simple worksheets. Including them helps avoid overestimating cash flow just because major repairs are not due this month.', category: 'Operations' },
  { question: 'What is a good DSCR for a rental screen?', answer: 'Many investors and lenders want at least 1.20x to 1.25x, but the right threshold depends on the property, lender, and your own risk tolerance.', category: 'Financing' },
  { question: 'What does break-even rent mean here?', answer: 'It is the approximate monthly rent needed to cover vacancy-adjusted operating expenses plus debt service, based on the current assumptions and any other income entered.', category: 'Results' },
  { question: 'What should I do after this rule-based screen?', answer: 'Move into full underwriting. Validate rent comps, confirm taxes and insurance, inspect deferred maintenance, tighten reserve assumptions, and rerun financing scenarios before making an offer.', category: 'Next Steps' }
];

const quickReferenceRows = [
  { category: 'Actual Expense Ratio', range: 'Below 45%', unit: 'of effective operating income', notes: 'Usually signals stronger operating margin than the classic rule assumes.' },
  { category: 'Actual Expense Ratio', range: '45% to 50%', unit: 'of effective operating income', notes: 'Typical target zone for a deal that broadly aligns with the 50% shortcut.' },
  { category: 'Actual Expense Ratio', range: '50% to 60%+', unit: 'of effective operating income', notes: 'More fragile range that deserves tighter underwriting and stress testing.' },
  { category: 'Vacancy Planning', range: '3% to 8%', unit: 'annualized vacancy', notes: 'Common planning range depending on market tightness and turnover.' },
  { category: 'Management Fee', range: '6% to 12%', unit: 'of collected rent', notes: 'Typical third-party property-management planning band in many U.S. markets.' },
  { category: 'Maintenance + CapEx', range: '8% to 15%', unit: 'of scheduled income', notes: 'Useful reserve range when screening older or less predictable rental stock.' }
];

const parse = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const pct = (value: number, digits = 2) => `${value.toFixed(digits)}%`;

const payment = (principal: number, annualRate: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
};

const getStatus = (actualExpenseRatio: number): Status => {
  if (actualExpenseRatio <= 40) return 'excellent';
  if (actualExpenseRatio <= 50) return 'strong';
  if (actualExpenseRatio <= 55) return 'pass';
  if (actualExpenseRatio <= 60) return 'borderline';
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
  excellent: 'Far Better Than the 50% Rule',
  strong: 'At or Better Than the 50% Rule',
  pass: 'Slightly Above the 50% Rule',
  borderline: 'Borderline Expense Burden',
  weak: 'Heavy Operating Expense Burden'
};

export default function AdvancedFiftyPercentRuleCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onChange = (field: keyof Inputs, value: string) => setInputs((prev) => ({ ...prev, [field]: value }));

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
    const otherMonthlyIncome = parse(inputs.otherMonthlyIncome);
    const vacancyRate = Math.min(Math.max(parse(inputs.vacancyRate), 0), 50);
    const monthlyTaxes = parse(inputs.monthlyTaxes);
    const monthlyInsurance = parse(inputs.monthlyInsurance);
    const monthlyHoa = parse(inputs.monthlyHoa);
    const monthlyUtilities = parse(inputs.monthlyUtilities);
    const otherMonthlyExpenses = parse(inputs.otherMonthlyExpenses);
    const closingCostsPercent = Math.min(Math.max(parse(inputs.closingCostsPercent), 0), 15);
    const managementPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.managementPercent), 0), 25) : 0;
    const maintenancePercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.maintenancePercent), 0), 25) : 0;
    const capexPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.capexPercent), 0), 25) : 0;
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
    const grossScheduledIncome = monthlyRent + otherMonthlyIncome;
    const vacancyLoss = grossScheduledIncome * (vacancyRate / 100);
    const effectiveOperatingIncome = grossScheduledIncome - vacancyLoss;
    const managementCost = effectiveOperatingIncome * (managementPercent / 100);
    const maintenanceReserve = grossScheduledIncome * (maintenancePercent / 100);
    const capexReserve = grossScheduledIncome * (capexPercent / 100);
    const fixedExpenses = monthlyTaxes + monthlyInsurance + monthlyHoa + monthlyUtilities + otherMonthlyExpenses;
    const actualOperatingExpenses = fixedExpenses + managementCost + maintenanceReserve + capexReserve;
    const ruleEstimatedExpenses = effectiveOperatingIncome * 0.5;
    const ruleGap = ruleEstimatedExpenses - actualOperatingExpenses;
    const actualExpenseRatio = effectiveOperatingIncome > 0 ? (actualOperatingExpenses / effectiveOperatingIncome) * 100 : 0;
    const ruleBasedNoi = effectiveOperatingIncome - ruleEstimatedExpenses;
    const actualNoi = effectiveOperatingIncome - actualOperatingExpenses;
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = Math.max(purchasePrice - downPayment, 0);
    const debtService = isAdvancedMode ? payment(loanAmount, interestRatePercent, loanTermYears * 12) : 0;
    const actualCashFlow = actualNoi - debtService;
    const ruleCashFlow = ruleBasedNoi - debtService;
    const dscr = debtService > 0 ? actualNoi / debtService : null;
    const denominator = 1 - vacancyRate / 100;
    const breakEvenGrossIncome = denominator > 0 ? (actualOperatingExpenses + debtService) / denominator : 0;
    const breakEvenRent = Math.max(breakEvenGrossIncome - otherMonthlyIncome, 0);
    const cashNeeded = (isAdvancedMode ? downPayment : purchasePrice) + rehabCosts + closingCosts;
    const status = getStatus(actualExpenseRatio);

    const notes: string[] = [];
    const warnings: string[] = [];
    notes.push(ruleGap >= 0 ? 'Your current expense stack is at or below the 50% rule estimate, which supports the initial screen.' : 'Your current assumptions are heavier than the 50% rule estimate, so the shortcut is probably too optimistic for this deal.');
    notes.push('This calculator separates vacancy from operating expenses first, so the result behaves more like a real underwriting screen than a napkin-only shortcut.');
    notes.push(isAdvancedMode ? 'Debt-service outputs are included so you can see whether the property still works after leverage is layered onto the deal.' : 'Simple mode keeps the focus on operating structure before financing is introduced.');

    if (actualExpenseRatio > 50) warnings.push('Actual operating expenses are above the classic 50% guide. Recheck taxes, insurance, reserves, and management assumptions.');
    if (actualCashFlow < 0 && isAdvancedMode) warnings.push('Current financing assumptions produce negative monthly cash flow after debt service.');
    if (dscr !== null && dscr < 1.2) warnings.push('Debt coverage is thin. This deal may not fit common internal or lender guardrails.');
    if (vacancyRate > 8) warnings.push('Vacancy is set at a relatively high level. That may be appropriate, but it suggests leasing or location risk deserves extra attention.');
    if (managementPercent + maintenancePercent + capexPercent < 10 && isAdvancedMode) warnings.push('Reserve percentages may be light for a long-term hold. Make sure maintenance and capex are not understated.');

    setResult({ totalBasis, totalAcquisitionCost, grossScheduledIncome, vacancyLoss, effectiveOperatingIncome, ruleEstimatedExpenses, actualOperatingExpenses, ruleGap, actualExpenseRatio, ruleBasedNoi, actualNoi, debtService, actualCashFlow, ruleCashFlow, dscr, breakEvenRent, cashNeeded, managementCost, maintenanceReserve, capexReserve, status, notes, warnings });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rental Expense Screening and Cash Flow Pressure Check</h2>
            <p className="text-sm text-muted-foreground mt-1">Built to keep the approved tool-page structure while turning the 50% rule into a financing-aware operating screen.</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{isAdvancedMode ? 'Adds management, maintenance, capex reserves, debt service, DSCR, break-even rent, and cash-needed context.' : 'Keeps the tool focused on the classic operating-expense screen before financing and reserve overlays.'}</p>
          </div>
          <button onClick={() => setIsAdvancedMode((prev) => !prev)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
            {isAdvancedMode ? <><ChevronUp className="h-4 w-4 mr-2" />Switch to Simple</> : <><ChevronDown className="h-4 w-4 mr-2" />Advanced Options</>}
          </button>
        </div>

        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <button onClick={() => setShowModeDropdown((prev) => !prev)} className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between">
              <span className="font-medium">Operating Expense + Financing Mode</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">This mode makes vacancy, reserves, and financing visible separately so you can compare the shortcut against a more realistic operating model.</div>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">Purchase Price ($)</label><input type="number" min="0" value={inputs.purchasePrice} onChange={(e) => onChange('purchasePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Rehab Costs ($)</label><input type="number" min="0" value={inputs.rehabCosts} onChange={(e) => onChange('rehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Rent ($)</label><input type="number" min="0" value={inputs.monthlyRent} onChange={(e) => onChange('monthlyRent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Other Monthly Income ($)</label><input type="number" min="0" value={inputs.otherMonthlyIncome} onChange={(e) => onChange('otherMonthlyIncome', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Vacancy Rate (%)</label><input type="number" min="0" max="50" step="0.1" value={inputs.vacancyRate} onChange={(e) => onChange('vacancyRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Closing Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.closingCostsPercent} onChange={(e) => onChange('closingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Taxes ($)</label><input type="number" min="0" value={inputs.monthlyTaxes} onChange={(e) => onChange('monthlyTaxes', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Insurance ($)</label><input type="number" min="0" value={inputs.monthlyInsurance} onChange={(e) => onChange('monthlyInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly HOA ($)</label><input type="number" min="0" value={inputs.monthlyHoa} onChange={(e) => onChange('monthlyHoa', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Utilities ($)</label><input type="number" min="0" value={inputs.monthlyUtilities} onChange={(e) => onChange('monthlyUtilities', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Other Monthly Expenses ($)</label><input type="number" min="0" value={inputs.otherMonthlyExpenses} onChange={(e) => onChange('otherMonthlyExpenses', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          {isAdvancedMode && <><div><label className="block text-sm font-medium text-foreground mb-2">Management (% of collected rent)</label><input type="number" min="0" max="25" step="0.1" value={inputs.managementPercent} onChange={(e) => onChange('managementPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Maintenance Reserve (%)</label><input type="number" min="0" max="25" step="0.1" value={inputs.maintenancePercent} onChange={(e) => onChange('maintenancePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">CapEx Reserve (%)</label><input type="number" min="0" max="25" step="0.1" value={inputs.capexPercent} onChange={(e) => onChange('capexPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Down Payment (%)</label><input type="number" min="0" max="100" step="0.1" value={inputs.downPaymentPercent} onChange={(e) => onChange('downPaymentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Interest Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.interestRatePercent} onChange={(e) => onChange('interestRatePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Loan Term (years)</label><input type="number" min="1" value={inputs.loanTermYears} onChange={(e) => onChange('loanTermYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Analyze 50% Rule</button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label="50 percent rule results dashboard">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div><h3 className="text-xl font-bold text-foreground">50% Rule Results Dashboard</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', badgeClass[result.status])}>{badgeLabel[result.status]}</span>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><div className="text-xs text-muted-foreground">Actual Expense Ratio</div><div className="text-3xl font-bold">{pct(result.actualExpenseRatio)}</div></div>
                  <div><div className="text-xs text-muted-foreground">50% Rule Expense Estimate</div><div className="text-2xl font-semibold">{usd(result.ruleEstimatedExpenses)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Gap vs Rule</div><div className="text-2xl font-semibold">{result.ruleGap >= 0 ? `${usd(result.ruleGap)} below` : `${usd(Math.abs(result.ruleGap))} above`}</div></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Effective Operating Income</div><div className="text-2xl font-bold mt-1">{usd(result.effectiveOperatingIncome)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Actual Operating Expenses</div><div className="text-2xl font-bold mt-1">{usd(result.actualOperatingExpenses)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Actual NOI</div><div className="text-2xl font-bold mt-1">{usd(result.actualNoi)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Monthly Debt Service</div><div className="text-2xl font-bold mt-1">{usd(result.debtService)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Actual Cash Flow After Debt</div><div className="text-2xl font-bold mt-1">{usd(result.actualCashFlow)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">DSCR / Break-even Rent</div><div className="text-lg font-bold mt-1">{result.dscr === null ? 'All-Cash' : `${result.dscr.toFixed(2)}x`} / {usd(result.breakEvenRent)}</div></div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Management</div><div className="font-semibold">{usd(result.managementCost)}</div></div>
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Maintenance</div><div className="font-semibold">{usd(result.maintenanceReserve)}</div></div>
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">CapEx</div><div className="font-semibold">{usd(result.capexReserve)}</div></div>
                  </div>
                </div>
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but full underwriting is still required.</li>}</ul>
                  <div className="mt-4 text-sm"><span className="font-medium">Rule-based cash flow after debt:</span> {usd(result.ruleCashFlow)}</div>
                  <div className="mt-1 text-sm"><span className="font-medium">Cash needed up front:</span> {usd(result.cashNeeded)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" />About This Calculator</h2>
        <p className="text-base text-foreground leading-relaxed mb-4">This 50% Rule Calculator is built for investors who want more than a fast napkin check. It turns the classic operating-expense rule into a clearer screen by separating vacancy, itemized expenses, reserve planning, and financing pressure in one place.</p>
        <p className="text-base text-foreground leading-relaxed mb-4">Use it when your goal is to decide whether a listing deserves a full underwriting model, whether the property only works under overly optimistic assumptions, or whether a deal that looks fine on gross rent falls apart once real operating drag is introduced.</p>
        <p className="text-base text-foreground leading-relaxed mb-6">The most useful way to run this page is with current rent comps, tax records, insurance quotes, local utility assumptions, and realistic reserve settings. The rule itself is simple. The decision quality comes from the quality of the assumptions behind it.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Percent className="h-4 w-4 text-primary" />Rule Estimate vs Reality</div>Compare the 50% shortcut against your actual operating assumptions instead of treating the rule as unquestioned truth.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" />Operating Margin Visibility</div>See effective operating income, actual expense burden, and NOI in the same screen.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" />Financing Overlay</div>Add debt service, DSCR, break-even rent, and cash-needed context in advanced mode.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" />Fragility Detection</div>Spot when a deal only works under light reserves, weak vacancy assumptions, or unrealistic cost control.</div>
        </div>
        <div className="mt-6 p-5 bg-muted rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" />What This Advanced Version Adds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Percent className="h-4 w-4 mt-0.5 text-primary" />Side-by-side rule estimate and itemized actual expense comparison</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Target className="h-4 w-4 mt-0.5 text-primary" />Rule-gap output that shows how far above or below the shortcut the deal lands</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Wallet className="h-4 w-4 mt-0.5 text-primary" />Effective operating income, actual NOI, and rule-based NOI in one place</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Landmark className="h-4 w-4 mt-0.5 text-primary" />Debt service, DSCR, break-even rent, and up-front cash context</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><BarChart3 className="h-4 w-4 mt-0.5 text-primary" />Itemized reserve layers for management, maintenance, and capex planning</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-primary" />Warning flags designed to catch fragile deals early</div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />How to Use This Free Online 50% Rule Calculator</h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><Route className="h-5 w-5" />Step-by-Step Guide</h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1. Build the acquisition and income baseline</h4>Start with realistic purchase price, rehab, monthly rent, and any recurring non-rent income. This creates the income base the rule is evaluating.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-blue-600 dark:text-blue-400" />2. Set vacancy intentionally instead of guessing it away</h4>Vacancy is one of the biggest reasons quick rental screens go wrong. Use a number that matches turnover, market depth, and the quality of the unit.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />3. Add the fixed operating-cost layer</h4>Taxes, insurance, HOA dues, utilities, and other recurring owner-paid items determine whether the classic shortcut is too generous or too conservative.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />4. Turn on reserve and management planning</h4>Advanced mode adds management, maintenance, and capex reserve percentages so you can test a more realistic long-hold operating profile.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />5. Layer financing onto the operating result</h4>Debt service should come after the operating screen, not instead of it. Use the financing inputs to see whether a deal that passes the rule still cash flows.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />6. Treat the result as a first-pass decision only</h4>If the page flags a heavy expense burden, move into deeper underwriting before you trust the deal. If it passes, that means the listing deserves more time, not blind approval.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Your Results Dashboard (Popup Only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />Expense-Ratio Status</h4><p className="text-xs text-muted-foreground">Shows how your actual expense burden compares with the classic 50% guide.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-green-600 dark:text-green-400" />Rule Estimate and Gap</h4><p className="text-xs text-muted-foreground">Displays the rule-based expense estimate and the exact amount you are above or below it.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Operating Performance Snapshot</h4><p className="text-xs text-muted-foreground">Combines effective operating income, actual opex, and NOI so you can see where the margin really is.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-green-600 dark:text-green-400" />Financing Pressure View</h4><p className="text-xs text-muted-foreground">Adds debt service, DSCR, cash needed, and break-even rent in advanced mode.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Rule vs Reality Comparison</h4><p className="text-xs text-muted-foreground">Shows whether the shortcut is understating the operating burden on the deal.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />Notes and Warning Flags</h4><p className="text-xs text-muted-foreground">Ends with action-oriented notes telling you what to verify next.</p></div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Version?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Calculator className="h-4 w-4 text-orange-600 dark:text-orange-400" />Beyond a napkin-only shortcut</h4><p className="text-sm text-muted-foreground">Most 50% rule writeups stop at one assumption. This version shows whether your real inputs actually support that shortcut.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />Better underwriting discipline</h4><p className="text-sm text-muted-foreground">The rule-gap output helps you catch deals where taxes, insurance, reserves, or vacancy make the shortcut misleading.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />Financing-aware screening</h4><p className="text-sm text-muted-foreground">A property can look acceptable on operating logic and still fail once debt is added. The financing overlay exposes that quickly.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />Faster deal triage</h4><p className="text-sm text-muted-foreground">You can decide faster which properties deserve a full model and which ones are already too fragile.</p></div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Wrench className="h-5 w-5" />50% Rule Advanced Features</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Vacancy is made explicit before the rule estimate is applied, so the result is more underwriting-friendly.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Fixed operating costs and reserve percentages can be mixed together instead of relying on one flat assumption.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Debt service, DSCR, rule-based cash flow, and break-even rent show what happens after financing pressure is applied.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Warning flags are included to catch thin reserves, heavy expense stacks, and fragile cash-flow outcomes.</span></div>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><Lightbulb className="h-5 w-5" />50% Rule Decision Playbook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set acceptable expense bands before shopping</h4><p className="text-muted-foreground">Decide the maximum expense ratio and minimum DSCR you will tolerate before a listing starts to look attractive.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Re-run with conservative vacancy and reserves</h4><p className="text-muted-foreground">Thin deals often only work because vacancy, maintenance, or capex assumptions are too optimistic.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Separate an operating problem from a financing problem</h4><p className="text-muted-foreground">If the property fails before debt is added, leverage is not the main issue. If it fails only after debt, the structure may need to change.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Replace assumptions with real quotes as soon as possible</h4><p className="text-muted-foreground">Taxes, insurance, utilities, and repair reserves should become deal-specific before you trust the result.</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Understanding 50% Rule Investment Screening</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5" />Core Concept and Decision Context</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">The 50% rule exists to help investors screen rental properties quickly. Instead of forecasting every line item for every listing, it assumes operating expenses will take roughly half of operating income before debt.</p>
            <p className="text-blue-800 dark:text-blue-200 mb-3">The value of the rule is speed, not precision. It is most useful when you need to decide whether a property deserves a full model, not when you are ready to rely on a shortcut as final underwriting.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Best used for early deal triage rather than final approval.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Stronger when vacancy and reserves are made explicit.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Useful for small rentals, value-add holds, and first-pass buy-box screening.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Should always be followed by deeper property-specific underwriting.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors Affecting Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">The true market rent and whether it includes stable or temporary premium pricing.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Vacancy and turnover, especially in weaker leasing submarkets.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Taxes, insurance, HOA dues, and utility responsibility.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Management, maintenance, and capex reserves that are easy to understate.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Financing structure, especially rate, amortization, and down payment.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Asset age and deferred maintenance, which often explain why some deals exceed the rule so quickly.</div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Comparison Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Baseline case: current rent, vacancy, and today&apos;s best expense assumptions.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Conservative case: higher vacancy, stronger reserves, and confirmed insurance or tax pressure.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Financing case: whether leverage turns a passable operating deal into a weak cash-flow profile.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Negotiation case: the rent, price, or reserve adjustment needed to get back into a safer band.</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Target className="h-5 w-5" />Threshold and Timing Guidance</h3>
            <ul className="space-y-2">
              <li>- Below 45% often signals stronger operating margin than the 50% rule assumes.</li>
              <li>- Around 50% is the classic planning zone for a quick screen.</li>
              <li>- Above 55% usually deserves tighter underwriting before you trust the deal.</li>
              <li>- Above 60% often means the shortcut is no longer enough to justify the property.</li>
              <li>- Recalculate after tax updates, insurance quotes, inspection findings, or lender changes.</li>
            </ul>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><Wallet className="h-5 w-5" />Practical Use and Strategy Fit</h3>
            <p className="text-cyan-800 dark:text-cyan-200 mb-3">Use the 50% rule to decide which properties deserve more time. It is especially useful for buy-and-hold screening, but it can also help value-add and house-hack investors decide whether a deal is structurally sound before deeper work begins.</p>
            <p className="text-cyan-800 dark:text-cyan-200">The biggest mistake is treating the rule as exact underwriting. It is a fast guide, not a replacement for real tax, insurance, reserve, and financing analysis.</p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Benefits, Risks, and Impact Summary</h3>
            <ul className="space-y-2">
              <li>- Benefit: faster first-pass screening without ignoring vacancy and reserves.</li>
              <li>- Benefit: clearer separation between operating problems and financing problems.</li>
              <li>- Risk: stale assumptions can make a shortcut look more reliable than it is.</li>
              <li>- Risk: unusually old, deferred, or unstable properties often break the rule.</li>
              <li>- Impact: better quote comparison and reserve planning improves acquisition discipline.</li>
              <li>- Impact: knowing the rule gap helps with pricing, negotiation, and hold-strategy classification.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: 50% Rule Benchmarks</h3>
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
              <li>- <a href="https://www.huduser.gov/portal/datasets/fmr.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">HUD Fair Market Rents</a> - public rent benchmark context for screening market assumptions.</li>
              <li>- <a href="https://www.irs.gov/taxtopics/tc414" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Topic No. 414</a> - rental income and expense context for U.S. investors.</li>
              <li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - useful context for buyer-side closing-cost planning.</li>
              <li>- <a href="https://www.bls.gov/data/inflation_calculator.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI Inflation Calculator</a> - helpful when pressure-testing reserve and expense assumptions in real terms.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.stessa.com/blog/50-percent-rule" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stessa on the 50% Rule</a> - investor-focused explanation of how the shortcut is used in rental screening.</li>
              <li>- <a href="https://help.dealcheck.io/en/articles/2023045-50-rule-rental-properties" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck 50% Rule Guide</a> - useful for understanding rule interpretation and operating-income framing.</li>
              <li>- <a href="https://www.dealcheck.io/blog/rental-property-expenses-guide/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck Rental Property Expenses Guide</a> - helpful context for itemizing reserves and recurring cost categories.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3>
            <p>Prioritize rent comps, tax records, insurance quotes, reserve planning, and lender terms when validating results. The 50% rule is only a first-pass screen, so the quality of the assumptions matters more than the shortcut itself.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace lender disclosures, tax advice, legal review, or a full rental-property underwriting model.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2>
        <FAQAccordion faqs={FAQS} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="50% Rule Calculator" />
      </div>
    </div>
  );
}
