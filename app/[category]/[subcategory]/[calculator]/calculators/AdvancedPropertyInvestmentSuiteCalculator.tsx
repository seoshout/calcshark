'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, BookOpen, Calculator, CheckCircle, ChevronDown, ChevronUp, Info, Leaf, Lightbulb, MessageSquare, RefreshCw, Route, Shield, Target, Wallet, Wrench, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

export type PropertyInvestmentVariant = 'rental-property' | 'cash-flow' | 'cap-rate' | 'roi' | 'cash-on-cash-return' | 'noi' | 'gross-rent-multiplier' | 'rental-yield' | 'property-appreciation';
interface Props { variant: PropertyInvestmentVariant; }
interface Inputs { purchasePrice: string; rehabCosts: string; monthlyRent: string; otherMonthlyIncome: string; vacancyRate: string; monthlyOperatingExpenses: string; annualTaxes: string; annualInsurance: string; annualHoa: string; closingCostsPercent: string; downPaymentPercent: string; interestRatePercent: string; loanTermYears: string; annualAppreciationPercent: string; holdingYears: string; sellingCostsPercent: string; }
interface Metric { label: string; value: number; currency?: boolean; suffix?: string; }
interface Result { status: 'strong' | 'balanced' | 'thin' | 'weak'; primaryLabel: string; primaryValue: number; primaryCurrency?: boolean; primarySuffix?: string; metrics: Metric[]; notes: string[]; warnings: string[]; }
interface Config { title: string; subtitle: string; cta: string; reviewName: string; primaryLabel: string; focus: string; researchFocus: string; }

const CONFIG: Record<PropertyInvestmentVariant, Config> = {
  'rental-property': { title: 'Rental Property Calculator', subtitle: 'Advanced rental deal analysis across income, expenses, financing, and hold-period return', cta: 'Analyze Rental Property', reviewName: 'Rental Property Calculator', primaryLabel: 'Annual Cash Flow', focus: 'all-in rental performance', researchFocus: 'rent comps, expense assumptions, financing terms, and hold-period return drivers' },
  'cash-flow': { title: 'Cash Flow Calculator', subtitle: 'Advanced rental cash-flow analysis with vacancy, operating drag, and debt service', cta: 'Calculate Cash Flow', reviewName: 'Cash Flow Calculator', primaryLabel: 'Annual Cash Flow', focus: 'annual cash generation', researchFocus: 'cash-flow durability, vacancy planning, and realistic expense layering' },
  'cap-rate': { title: 'Cap Rate Calculator', subtitle: 'Advanced capitalization-rate analysis with vacancy and expense realism', cta: 'Calculate Cap Rate', reviewName: 'Cap Rate Calculator', primaryLabel: 'Cap Rate', focus: 'unlevered operating yield', researchFocus: 'NOI accuracy, market cap-rate context, and acquisition pricing discipline' },
  roi: { title: 'ROI Calculator', subtitle: 'Advanced property ROI analysis including cash flow, appreciation, and exit friction', cta: 'Calculate ROI', reviewName: 'ROI Calculator', primaryLabel: 'Total ROI', focus: 'hold-period total return', researchFocus: 'hold-period assumptions, appreciation realism, and exit-cost sensitivity' },
  'cash-on-cash-return': { title: 'Cash-on-Cash Return Calculator', subtitle: 'Advanced annual cash-yield analysis for leveraged rental properties', cta: 'Calculate Cash-on-Cash', reviewName: 'Cash-on-Cash Return Calculator', primaryLabel: 'Cash-on-Cash Return', focus: 'annual cash yield on invested cash', researchFocus: 'cash invested, debt structure, and annual cash-flow quality' },
  noi: { title: 'NOI Calculator', subtitle: 'Advanced net operating income analysis with vacancy and expense structure', cta: 'Calculate NOI', reviewName: 'NOI Calculator', primaryLabel: 'Annual NOI', focus: 'net operating performance before debt', researchFocus: 'effective income, operating expense classification, and NOI reliability' },
  'gross-rent-multiplier': { title: 'Gross Rent Multiplier Calculator', subtitle: 'Advanced GRM screening with rent and pricing context', cta: 'Calculate GRM', reviewName: 'Gross Rent Multiplier Calculator', primaryLabel: 'Gross Rent Multiplier', focus: 'price-to-gross-rent screening', researchFocus: 'purchase-price discipline, gross-rent quality, and screening context' },
  'rental-yield': { title: 'Rental Yield Calculator', subtitle: 'Advanced gross and net rental-yield analysis with operating realism', cta: 'Calculate Rental Yield', reviewName: 'Rental Yield Calculator', primaryLabel: 'Net Rental Yield', focus: 'gross and net income yield', researchFocus: 'gross-vs-net yield differences and realistic operating assumptions' },
  'property-appreciation': { title: 'Property Appreciation Calculator', subtitle: 'Advanced future-value and appreciation-gain analysis with exit-cost context', cta: 'Calculate Appreciation', reviewName: 'Property Appreciation Calculator', primaryLabel: 'Future Property Value', focus: 'future value and appreciation gain', researchFocus: 'hold period, appreciation rate realism, and exit-cost impact on net gains' }
};

const DEFAULTS: Inputs = { purchasePrice: '245000', rehabCosts: '15000', monthlyRent: '2200', otherMonthlyIncome: '50', vacancyRate: '5', monthlyOperatingExpenses: '375', annualTaxes: '3600', annualInsurance: '1450', annualHoa: '0', closingCostsPercent: '3', downPaymentPercent: '25', interestRatePercent: '7.00', loanTermYears: '30', annualAppreciationPercent: '3.5', holdingYears: '5', sellingCostsPercent: '7' };
const FAQS: FAQItem[] = [
  { question: 'Why do these calculators share similar inputs?', answer: 'The same income, expense, financing, and hold-period assumptions drive many core property-investment metrics. The variant changes which output is emphasized, not the underlying property economics.', category: 'Basics' },
  { question: 'What is the difference between NOI and cash flow?', answer: 'NOI is effective gross income after operating expenses but before debt. Cash flow is what remains after debt service is removed from NOI.', category: 'Method' },
  { question: 'Why include appreciation and selling costs for ROI?', answer: 'Hold-period ROI depends on both operating performance and the eventual exit. Appreciation assumptions and selling friction can materially change total return.', category: 'ROI' },
  { question: 'What should I do after this screen?', answer: 'Move into a deeper property model with deal-specific rent comps, tax records, insurance quotes, lender terms, reserve planning, and scenario testing.', category: 'Next Steps' }
];
const quickReferenceRows = [
  { category: 'Vacancy Planning', range: '3% to 8%', unit: 'annualized vacancy', notes: 'Common starting range for many rental screens.' },
  { category: 'Closing Costs', range: '2% to 5%', unit: 'of purchase price', notes: 'Common acquisition-side planning range.' },
  { category: 'Selling Costs', range: '6% to 10%', unit: 'of sale price', notes: 'Useful for ROI and appreciation screens.' },
  { category: 'GRM Interpretation', range: 'lower is stronger', unit: 'multiple', notes: 'GRM is market-sensitive and should not be used alone.' }
];

const parse = (value: string) => { const n = Number.parseFloat(value); return Number.isFinite(n) ? n : 0; };
const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const formatMetric = (metric: Metric) => metric.currency ? usd(metric.value) : metric.suffix ? `${metric.value.toFixed(2)}${metric.suffix}` : `${metric.value.toFixed(2)}%`;
const payment = (principal: number, annualRate: number, months: number) => { if (principal <= 0 || months <= 0) return 0; const r = annualRate / 100 / 12; if (r === 0) return principal / months; const factor = Math.pow(1 + r, months); return (principal * r * factor) / (factor - 1); };
const statusLabel: Record<Result['status'], string> = { strong: 'Strong Investment Read', balanced: 'Balanced Investment Read', thin: 'Thin Margin or Return', weak: 'Weak Investment Read' };

function buildResult(variant: PropertyInvestmentVariant, inputs: Inputs): Result {
  const purchasePrice = parse(inputs.purchasePrice); const rehabCosts = parse(inputs.rehabCosts); const monthlyRent = parse(inputs.monthlyRent); const otherMonthlyIncome = parse(inputs.otherMonthlyIncome); const vacancyRate = Math.min(Math.max(parse(inputs.vacancyRate), 0), 50); const monthlyOperatingExpenses = parse(inputs.monthlyOperatingExpenses); const annualTaxes = parse(inputs.annualTaxes); const annualInsurance = parse(inputs.annualInsurance); const annualHoa = parse(inputs.annualHoa); const closingCostsPercent = Math.min(Math.max(parse(inputs.closingCostsPercent), 0), 15); const downPaymentPercent = Math.min(Math.max(parse(inputs.downPaymentPercent), 0), 100); const interestRatePercent = Math.max(parse(inputs.interestRatePercent), 0); const loanTermYears = Math.max(parse(inputs.loanTermYears), 0); const annualAppreciationPercent = parse(inputs.annualAppreciationPercent); const holdingYears = Math.max(parse(inputs.holdingYears), 0); const sellingCostsPercent = Math.min(Math.max(parse(inputs.sellingCostsPercent), 0), 20);
  const totalBasis = purchasePrice + rehabCosts; const closingCosts = purchasePrice * (closingCostsPercent / 100); const annualGrossIncome = (monthlyRent + otherMonthlyIncome) * 12; const annualVacancyLoss = annualGrossIncome * (vacancyRate / 100); const effectiveGrossIncome = annualGrossIncome - annualVacancyLoss; const operatingExpenses = (monthlyOperatingExpenses * 12) + annualTaxes + annualInsurance + annualHoa; const noi = effectiveGrossIncome - operatingExpenses; const downPayment = purchasePrice * (downPaymentPercent / 100); const loanAmount = Math.max(purchasePrice - downPayment, 0); const annualDebtService = payment(loanAmount, interestRatePercent, loanTermYears * 12) * 12; const annualCashFlow = noi - annualDebtService; const totalCashInvested = downPayment + rehabCosts + closingCosts; const capRate = totalBasis > 0 ? (noi / totalBasis) * 100 : 0; const cashOnCash = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0; const grm = annualGrossIncome > 0 ? purchasePrice / annualGrossIncome : 0; const grossYield = totalBasis > 0 ? (annualGrossIncome / totalBasis) * 100 : 0; const netYield = totalBasis > 0 ? (noi / totalBasis) * 100 : 0; const futureValue = totalBasis * Math.pow(1 + annualAppreciationPercent / 100, holdingYears); const appreciationGain = futureValue - totalBasis; const sellingCosts = futureValue * (sellingCostsPercent / 100); const totalCashFlowOverHold = annualCashFlow * holdingYears; const totalReturn = appreciationGain - sellingCosts + totalCashFlowOverHold; const totalRoi = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;
  const primaryLabel = CONFIG[variant].primaryLabel; let primaryValue = annualCashFlow; let primaryCurrency = true; let primarySuffix: string | undefined; let metrics: Metric[] = [];
  if (variant === 'cap-rate') { primaryValue = capRate; primaryCurrency = false; metrics = [{ label: 'Annual NOI', value: noi, currency: true }, { label: 'Annual Cash Flow', value: annualCashFlow, currency: true }, { label: 'Gross Yield', value: grossYield }, { label: 'Net Yield', value: netYield }]; }
  else if (variant === 'roi') { primaryValue = totalRoi; primaryCurrency = false; metrics = [{ label: 'Future Value', value: futureValue, currency: true }, { label: 'Appreciation Gain', value: appreciationGain, currency: true }, { label: 'Total Cash Flow', value: totalCashFlowOverHold, currency: true }, { label: 'Selling Costs', value: sellingCosts, currency: true }]; }
  else if (variant === 'cash-on-cash-return') { primaryValue = cashOnCash; primaryCurrency = false; metrics = [{ label: 'Annual Cash Flow', value: annualCashFlow, currency: true }, { label: 'Cash Invested', value: totalCashInvested, currency: true }, { label: 'Cap Rate', value: capRate }, { label: 'Annual NOI', value: noi, currency: true }]; }
  else if (variant === 'noi') { primaryValue = noi; primaryCurrency = true; metrics = [{ label: 'Effective Gross Income', value: effectiveGrossIncome, currency: true }, { label: 'Operating Expenses', value: operatingExpenses, currency: true }, { label: 'Cap Rate', value: capRate }, { label: 'Annual Cash Flow', value: annualCashFlow, currency: true }]; }
  else if (variant === 'gross-rent-multiplier') { primaryValue = grm; primaryCurrency = false; primarySuffix = 'x'; metrics = [{ label: 'Annual Gross Income', value: annualGrossIncome, currency: true }, { label: 'Net Yield', value: netYield }, { label: 'Cap Rate', value: capRate }, { label: 'Annual NOI', value: noi, currency: true }]; }
  else if (variant === 'rental-yield') { primaryValue = netYield; primaryCurrency = false; metrics = [{ label: 'Gross Yield', value: grossYield }, { label: 'Annual NOI', value: noi, currency: true }, { label: 'Cap Rate', value: capRate }, { label: 'Annual Cash Flow', value: annualCashFlow, currency: true }]; }
  else if (variant === 'property-appreciation') { primaryValue = futureValue; primaryCurrency = true; metrics = [{ label: 'Appreciation Gain', value: appreciationGain, currency: true }, { label: 'Annual Appreciation', value: annualAppreciationPercent }, { label: 'Holding Years', value: holdingYears, suffix: 'y' }, { label: 'Net Exit Gain', value: appreciationGain - sellingCosts, currency: true }]; }
  else if (variant === 'rental-property') { metrics = [{ label: 'Cap Rate', value: capRate }, { label: 'Cash-on-Cash', value: cashOnCash }, { label: 'Annual NOI', value: noi, currency: true }, { label: 'Total ROI', value: totalRoi }]; }
  else { metrics = [{ label: 'Monthly Cash Flow', value: annualCashFlow / 12, currency: true }, { label: 'Annual NOI', value: noi, currency: true }, { label: 'Debt Service', value: annualDebtService, currency: true }, { label: 'Cash-on-Cash', value: cashOnCash }]; }
  let status: Result['status'] = 'balanced'; const benchmark = primaryCurrency ? (variant === 'property-appreciation' ? appreciationGain : annualCashFlow) : primaryValue; if (variant === 'gross-rent-multiplier') { if (primaryValue <= 8) status = 'strong'; else if (primaryValue <= 12) status = 'balanced'; else if (primaryValue <= 16) status = 'thin'; else status = 'weak'; } else if (benchmark >= 12 || (benchmark > 0 && variant === 'property-appreciation')) status = 'strong'; else if (benchmark >= 6 || benchmark > 0) status = 'balanced'; else if (benchmark >= 0) status = 'thin'; else status = 'weak';
  const notes = [`This run centers on ${CONFIG[variant].focus}, but the dashboard keeps supporting metrics visible so the decision is not made in isolation.`, 'Vacancy, operating drag, and financing terms are often more important than the headline metric alone.', variant === 'property-appreciation' ? 'Appreciation should be screened conservatively because exit value is highly assumption-sensitive.' : 'Use this result as a screening step, then move into deeper underwriting with property-specific numbers.'];
  const warnings: string[] = []; if (annualCashFlow < 0 && variant !== 'property-appreciation') warnings.push('Cash flow is negative under the current assumptions.'); if (capRate < 4 && ['cap-rate', 'rental-property', 'rental-yield', 'cash-on-cash-return'].includes(variant)) warnings.push('Cap rate is low enough that pricing and expense assumptions deserve another review.'); if (vacancyRate > 8) warnings.push('Vacancy is relatively high. Make sure the leasing-risk assumption is intentional.'); if (totalRoi < 0 && ['roi', 'rental-property'].includes(variant)) warnings.push('Total ROI is negative under the current hold-period assumptions.');
  return { status, primaryLabel, primaryValue, primaryCurrency, primarySuffix, metrics, notes, warnings };
}

export default function AdvancedPropertyInvestmentSuiteCalculator({ variant }: Props) {
  const config = CONFIG[variant]; const [inputs, setInputs] = useState<Inputs>(DEFAULTS); const [isAdvancedMode, setIsAdvancedMode] = useState(true); const [showModeDropdown, setShowModeDropdown] = useState(false); const [showModal, setShowModal] = useState(false); const [result, setResult] = useState<Result | null>(null);
  const showRentInputs = variant !== 'property-appreciation'; const showDebtInputs = !['cap-rate', 'noi', 'gross-rent-multiplier', 'rental-yield', 'property-appreciation'].includes(variant); const isGrowthVariant = variant === 'property-appreciation' || variant === 'roi' || variant === 'rental-property'; const resultTitle = useMemo(() => `${config.title} Results Dashboard`, [config.title]);
  const onChange = (field: keyof Inputs, value: string) => setInputs((prev) => ({ ...prev, [field]: value }));
  const onReset = () => { setInputs(DEFAULTS); setIsAdvancedMode(true); setShowModeDropdown(false); setShowModal(false); setResult(null); };
  const onCalculate = () => { if (parse(inputs.purchasePrice) <= 0) { alert('Please enter a purchase price greater than zero.'); return; } if (showRentInputs && parse(inputs.monthlyRent) <= 0) { alert('Please enter monthly rent greater than zero.'); return; } setResult(buildResult(variant, inputs)); setShowModal(true); };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
          <div><h2 className="text-2xl font-bold text-foreground">{config.title}</h2><p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p></div>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1"><h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3><p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{isAdvancedMode ? 'Includes financing, hold-period, and exit planning context where relevant.' : 'Keeps the tool focused on the core metric and its nearest supporting inputs.'}</p></div>
          <button onClick={() => setIsAdvancedMode((prev) => !prev)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">{isAdvancedMode ? <><ChevronUp className="h-4 w-4 mr-2" />Switch to Simple</> : <><ChevronDown className="h-4 w-4 mr-2" />Advanced Options</>}</button>
        </div>
        {isAdvancedMode && <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"><button onClick={() => setShowModeDropdown((prev) => !prev)} className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between"><span className="font-medium">Income + Expense + Financing Context</span><ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} /></button>{showModeDropdown && <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">This suite shifts the primary output depending on which investment metric you are evaluating.</div>}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">Purchase Price ($)</label><input type="number" min="0" value={inputs.purchasePrice} onChange={(e) => onChange('purchasePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Rehab / Initial Improvements ($)</label><input type="number" min="0" value={inputs.rehabCosts} onChange={(e) => onChange('rehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          {showRentInputs ? <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Rent ($)</label><input type="number" min="0" value={inputs.monthlyRent} onChange={(e) => onChange('monthlyRent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div> : <div><label className="block text-sm font-medium text-foreground mb-2">Annual Appreciation (%)</label><input type="number" step="0.1" value={inputs.annualAppreciationPercent} onChange={(e) => onChange('annualAppreciationPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>}
          {showRentInputs && <><div><label className="block text-sm font-medium text-foreground mb-2">Other Monthly Income ($)</label><input type="number" min="0" value={inputs.otherMonthlyIncome} onChange={(e) => onChange('otherMonthlyIncome', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Vacancy Rate (%)</label><input type="number" min="0" max="50" step="0.1" value={inputs.vacancyRate} onChange={(e) => onChange('vacancyRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Monthly Operating Expenses ($)</label><input type="number" min="0" value={inputs.monthlyOperatingExpenses} onChange={(e) => onChange('monthlyOperatingExpenses', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual Taxes ($)</label><input type="number" min="0" value={inputs.annualTaxes} onChange={(e) => onChange('annualTaxes', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual Insurance ($)</label><input type="number" min="0" value={inputs.annualInsurance} onChange={(e) => onChange('annualInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual HOA ($)</label><input type="number" min="0" value={inputs.annualHoa} onChange={(e) => onChange('annualHoa', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}
          {isAdvancedMode && <><div><label className="block text-sm font-medium text-foreground mb-2">Closing Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.closingCostsPercent} onChange={(e) => onChange('closingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>{showDebtInputs && <><div><label className="block text-sm font-medium text-foreground mb-2">Down Payment (%)</label><input type="number" min="0" max="100" step="0.1" value={inputs.downPaymentPercent} onChange={(e) => onChange('downPaymentPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Interest Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.interestRatePercent} onChange={(e) => onChange('interestRatePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Loan Term (years)</label><input type="number" min="1" value={inputs.loanTermYears} onChange={(e) => onChange('loanTermYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}{isGrowthVariant && <><div><label className="block text-sm font-medium text-foreground mb-2">Annual Appreciation (%)</label><input type="number" step="0.1" value={inputs.annualAppreciationPercent} onChange={(e) => onChange('annualAppreciationPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Holding Years</label><input type="number" min="1" value={inputs.holdingYears} onChange={(e) => onChange('holdingYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Selling Costs (%)</label><input type="number" min="0" max="20" step="0.1" value={inputs.sellingCostsPercent} onChange={(e) => onChange('sellingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}</>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3"><button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />{config.cta}</button><button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button></div>
      </div>
      {showModal && result && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label={`${config.title} results dashboard`}><div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl"><div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background"><div><h3 className="text-xl font-bold text-foreground">{resultTitle}</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div><button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-6"><div className="border rounded-xl p-6"><span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', result.status === 'strong' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : result.status === 'balanced' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' : result.status === 'thin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200')}>{statusLabel[result.status]}</span><div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4"><div><div className="text-xs text-muted-foreground">{result.primaryLabel}</div><div className="text-3xl font-bold">{result.primaryCurrency ? usd(result.primaryValue) : result.primarySuffix ? `${result.primaryValue.toFixed(2)}${result.primarySuffix}` : `${result.primaryValue.toFixed(2)}%`}</div></div>{result.metrics.slice(0, 2).map((metric) => <div key={metric.label}><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-2xl font-semibold">{formatMetric(metric)}</div></div>)}</div></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{result.metrics.map((metric) => <div key={metric.label} className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-xl font-bold mt-1">{formatMetric(metric)}</div></div>)}</div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul></div><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but full underwriting is still recommended.</li>}</ul></div></div></div></div></div>}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          About This Calculator
        </h2>
        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator is part of our advanced property-investment suite. It keeps the same
          rental inputs in view while shifting the main decision output depending on whether you
          are screening cash flow, cap rate, ROI, cash-on-cash return, NOI, GRM, rental yield,
          appreciation, or the full rental-property picture.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          That shared structure matters because strong real-estate decisions rarely come from one
          metric alone. A property can look attractive on gross rent, weak on cap rate, healthy on
          cash flow, or thin on hold-period ROI depending on how vacancy, expenses, leverage, and
          resale assumptions are layered into the model.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-6">
          The goal of this suite is to let you choose the metric that matches the decision you are
          making while still seeing the surrounding context that keeps the result honest. That is
          what turns a calculator into a useful screening tool rather than a vanity metric widget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4">
            <div className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Primary Metric Focus
            </div>
            This version emphasizes {config.focus} while still surfacing the surrounding numbers
            that support the decision.
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Real-World Inputs
            </div>
            Vacancy, operating drag, financing, and hold-period assumptions are what make the
            result usable instead of theoretical.
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-medium text-foreground mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Multi-Metric Context
            </div>
            The page keeps related metrics visible so you can avoid over-optimizing around one
            number and missing what actually changes the investment outcome.
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-medium text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Stronger Screening Discipline
            </div>
            The goal is not just a result, but a better first-pass decision before you move into
            deeper underwriting and market-specific scenario work.
          </div>
        </div>
        <div className="mt-6 p-5 bg-muted rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            What This Advanced Version Adds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-primary" />
              Variant-specific primary output built from the same investment base
            </div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <Wallet className="h-4 w-4 mt-0.5 text-primary" />
              Income, expense, debt, and hold-period context in one tool
            </div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <BarChart3 className="h-4 w-4 mt-0.5 text-primary" />
              Popup-only dashboard with supporting KPIs and warnings
            </div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-primary" />
              Signals for thin cash flow, low cap rate, weak yield, or weak hold-period return
            </div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-primary" />
              Better alignment between the metric you are screening and the strategy you are using
            </div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 text-primary" />
              A reusable framework that makes metric-to-metric comparison much easier on the same deal
            </div>
          </div>
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
                1. Build the acquisition baseline with realistic purchase price, rent, and upfront
                improvement assumptions that reflect the actual opportunity.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                2. Make vacancy and operating drag explicit so the result reflects how the property
                actually behaves after collection loss, taxes, insurance, and recurring expenses.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                3. Add financing and hold-period assumptions where they materially change the
                metric, especially for cash flow, cash-on-cash return, rental-property analysis,
                and hold-period ROI.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                4. Use the popup dashboard as a screening decision, not a substitute for full
                underwriting. The supporting KPIs and warning flags are often what explain whether
                the headline answer is actually trustworthy.
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
                Primary decision metric for this specific calculator variant
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Supporting KPIs that show how the surrounding investment picture behaves
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Notes that explain what the current run is really saying about the deal
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Warning flags for thin cash flow, low yield, or weak hold-period return where relevant
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
                <h4 className="font-medium mb-2 text-foreground">Beyond a single-number tool</h4>
                <p className="text-sm text-muted-foreground">
                  Most online tools stop at one answer. This version keeps the surrounding
                  investment context visible so the metric is harder to misuse.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">Better underwriting discipline</h4>
                <p className="text-sm text-muted-foreground">
                  The warning system helps catch situations where the headline metric is technically
                  fine but the deal still looks fragile under the supporting numbers.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">Metric-to-metric comparison</h4>
                <p className="text-sm text-muted-foreground">
                  You can evaluate the same deal through several lenses without rebuilding the
                  entire input stack from scratch every time.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">Stronger decision speed</h4>
                <p className="text-sm text-muted-foreground">
                  The suite helps you decide faster which properties deserve deeper underwriting
                  and which ones are already too weak to prioritize.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {config.title} Advanced Features
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>One shared investment base powering multiple related property metrics.</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Hold-period and exit assumptions included where they materially change the result.</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Primary metric plus nearby KPIs so the answer remains decision-ready.</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" />
                <span>Built-in screening logic that encourages comparison, not metric worship.</span>
              </div>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Decision Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground">Set your metric priority first</h4>
                <p className="text-muted-foreground">
                  Know whether the current decision is about cash flow, yield, operating
                  efficiency, unlevered value, or long-run return.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground">Refresh the numbers as real quotes arrive</h4>
                <p className="text-muted-foreground">
                  Updated comps, tax records, lender terms, and insurance quotes should replace
                  placeholder assumptions quickly.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground">Pressure-test the weak point</h4>
                <p className="text-muted-foreground">
                  If the deal is fragile, it usually shows up through vacancy, taxes, insurance,
                  financing, or exit assumptions before it shows up in the headline metric.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1 text-foreground">Compare nearby metrics before acting</h4>
                <p className="text-muted-foreground">
                  A good primary metric does not always mean the surrounding investment picture is
                  strong enough to support the deal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding {config.title}
        </h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Core Concept and Decision Context
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              This tool is meant for fast but grounded property-investment screening. It lets you
              focus on {config.focus} without losing sight of the assumptions behind the answer.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              The right metric depends on the decision you are making. Cap rate, cash flow, NOI,
              yield, ROI, GRM, and appreciation all answer slightly different questions about the
              same property, which is exactly why they should be compared rather than isolated.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Major Factors Affecting Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Rent quality, vacancy, and the depth of the local leasing market
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Taxes, insurance, management, maintenance, and owner-paid utilities
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Acquisition price discipline and whether the basis includes early improvements
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                Financing structure and the amount of cash actually committed to the deal
              </div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Practical Use and Strategy Fit
            </h3>
            <p className="text-orange-800 dark:text-orange-200 mb-3">
              Use this calculator to decide which opportunities deserve more time and which ones
              are already too weak to prioritize. That is especially useful when you are screening
              multiple properties with different financing and hold assumptions.
            </p>
            <p className="text-orange-800 dark:text-orange-200">
              The biggest mistake is trusting the headline number without checking how vacancy,
              expense drag, leverage, or exit friction are shaping it.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Threshold and Timing Guidance
            </h3>
            <ul className="space-y-2">
              <li>- Use local market context before treating any single benchmark as universal.</li>
              <li>- Recalculate whenever comps, taxes, insurance, financing, or hold assumptions materially change.</li>
              <li>- Compare nearby metrics before trusting the headline number completely.</li>
              <li>- Let the metric you are screening match the strategy you are actually trying to execute.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 shadow-sm"><h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: Property Investment Benchmarks</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-3 px-4 font-semibold text-foreground">Planning Category</th><th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th><th className="text-left py-3 px-4 font-semibold text-foreground">Unit</th><th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th></tr></thead><tbody>{quickReferenceRows.map((row) => <tr key={`${row.category}-${row.range}`} className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">{row.category}</td><td className="py-3 px-4">{row.range}</td><td className="py-3 px-4">{row.unit}</td><td className="py-3 px-4 text-muted-foreground">{row.notes}</td></tr>)}</tbody></table></div></div>
      <div className="bg-background border rounded-xl p-6 sm:p-8"><h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-primary" />Scientific References & Resources</h2><div className="space-y-3 text-sm text-muted-foreground"><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official sources</h3><ul className="space-y-1"><li>- <a href="https://www.huduser.gov/portal/datasets/fmr.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">HUD Fair Market Rents</a> - public rent benchmark context for income assumptions.</li><li>- <a href="https://www.irs.gov/taxtopics/tc414" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Topic No. 414</a> - rental income and expense context for U.S. investors.</li><li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - useful context for acquisition-side cost planning.</li><li>- <a href="https://www.fhfa.gov/reports/house-price-index" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FHFA House Price Index</a> - useful context for appreciation and resale sensitivity.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3><ul className="space-y-1"><li>- <a href="https://www.stessa.com/blog/cap-rate/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stessa Cap Rate Guide</a> - practical context for cap-rate interpretation.</li><li>- <a href="https://www.stessa.com/blog/cash-on-cash-return/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stessa Cash-on-Cash Return Guide</a> - practical context for leveraged return screening.</li><li>- <a href="https://dealcheck.io/blog/rental-property-expenses-guide/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck Rental Property Expenses Guide</a> - useful context for expense classification and reserve planning.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3><p>Prioritize {config.researchFocus}. The more accurate those assumptions are, the more useful the primary metric becomes.</p></div></div><p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace appraisals, lender terms, tax advice, legal review, or a property-specific underwriting model.</p></div>
      <div className="bg-background border rounded-xl p-6"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2><FAQAccordion faqs={FAQS} showTitle={false} /></div>
      <div className="bg-background border rounded-xl p-6"><CalculatorReview calculatorName={config.reviewName} /></div>
    </div>
  );
}
