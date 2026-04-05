'use client';

import React, { useState } from 'react';
import { AlertTriangle, BarChart3, BookOpen, Calculator, CheckCircle, ChevronDown, ChevronUp, Info, Leaf, MessageSquare, RefreshCw, Route, Shield, Target, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

interface Inputs { purchasePrice: string; rehabCosts: string; afterRepairValue: string; monthlyRent: string; vacancyRate: string; monthlyOperatingExpenses: string; annualTaxes: string; annualInsurance: string; annualHoa: string; closingCostsPercent: string; refinanceLtvPercent: string; refinanceRatePercent: string; refinanceTermYears: string; }
interface Result { totalProjectCost: number; maxRefiLoan: number; cashRecovered: number; cashLeftInDeal: number; annualNoi: number; annualDebtService: number; annualCashFlow: number; cashRecoveryRate: number; dscr: number | null; equityCreated: number; notes: string[]; warnings: string[]; }
const DEFAULTS: Inputs = { purchasePrice: '185000', rehabCosts: '45000', afterRepairValue: '315000', monthlyRent: '2450', vacancyRate: '5', monthlyOperatingExpenses: '425', annualTaxes: '3800', annualInsurance: '1500', annualHoa: '0', closingCostsPercent: '3', refinanceLtvPercent: '75', refinanceRatePercent: '7.25', refinanceTermYears: '30' };
const FAQS: FAQItem[] = [
  { question: 'What does BRRRR stand for?', answer: 'Buy, Rehab, Rent, Refinance, Repeat. It is a strategy focused on forcing equity through rehab, stabilizing rent, refinancing, and recycling capital into the next deal.', category: 'Basics' },
  { question: 'What is cash left in the deal?', answer: 'It is the amount of your project capital that is still tied up after the refinance loan pays you back at the chosen refinance LTV.', category: 'Results' },
  { question: 'Why show DSCR?', answer: 'Because a BRRRR deal can create equity and still struggle under the refinance debt load if the stabilized rent is not strong enough.', category: 'Financing' },
  { question: 'Does a high cash recovery rate mean the deal is automatically good?', answer: 'No. High cash recovery is helpful, but it does not replace stabilized cash flow, refinance feasibility, or execution quality. The repeat stage only works when the rental remains healthy after the new debt is in place.', category: 'Results' },
  { question: 'What should I validate after this screen?', answer: 'Validate ARV, final rehab scope, stabilized rent, lender LTV terms, seasoning rules, rent-ready timeline, and final refinance costs before trusting the outcome.', category: 'Next Steps' }
];
const parse = (value: string) => { const n = Number.parseFloat(value); return Number.isFinite(n) ? n : 0; };
const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const pct = (value: number, digits = 2) => `${value.toFixed(digits)}%`;
const payment = (principal: number, annualRate: number, months: number) => { if (principal <= 0 || months <= 0) return 0; const r = annualRate / 100 / 12; if (r === 0) return principal / months; const factor = Math.pow(1 + r, months); return (principal * r * factor) / (factor - 1); };

export default function AdvancedBRRRRCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS); const [isAdvancedMode, setIsAdvancedMode] = useState(true); const [showModeDropdown, setShowModeDropdown] = useState(false); const [showModal, setShowModal] = useState(false); const [result, setResult] = useState<Result | null>(null);
  const onChange = (field: keyof Inputs, value: string) => setInputs((prev) => ({ ...prev, [field]: value }));
  const onReset = () => { setInputs(DEFAULTS); setIsAdvancedMode(true); setShowModeDropdown(false); setShowModal(false); setResult(null); };
  const onCalculate = () => {
    const purchasePrice = parse(inputs.purchasePrice); const rehabCosts = parse(inputs.rehabCosts); const afterRepairValue = parse(inputs.afterRepairValue); const monthlyRent = parse(inputs.monthlyRent); const vacancyRate = Math.min(Math.max(parse(inputs.vacancyRate), 0), 50); const monthlyOperatingExpenses = parse(inputs.monthlyOperatingExpenses); const annualTaxes = parse(inputs.annualTaxes); const annualInsurance = parse(inputs.annualInsurance); const annualHoa = parse(inputs.annualHoa); const closingCostsPercent = Math.min(Math.max(parse(inputs.closingCostsPercent), 0), 15); const refinanceLtvPercent = Math.min(Math.max(parse(inputs.refinanceLtvPercent), 0), 90); const refinanceRatePercent = Math.max(parse(inputs.refinanceRatePercent), 0); const refinanceTermYears = Math.max(parse(inputs.refinanceTermYears), 0);
    if (purchasePrice <= 0 || afterRepairValue <= 0 || monthlyRent <= 0) { alert('Please enter purchase price, ARV, and monthly rent greater than zero.'); return; }
    const closingCosts = purchasePrice * (closingCostsPercent / 100); const totalProjectCost = purchasePrice + rehabCosts + closingCosts; const annualGrossIncome = monthlyRent * 12; const effectiveGrossIncome = annualGrossIncome * (1 - vacancyRate / 100); const annualOperatingExpenses = (monthlyOperatingExpenses * 12) + annualTaxes + annualInsurance + annualHoa; const annualNoi = effectiveGrossIncome - annualOperatingExpenses; const maxRefiLoan = afterRepairValue * (refinanceLtvPercent / 100); const annualDebtService = payment(maxRefiLoan, refinanceRatePercent, refinanceTermYears * 12) * 12; const annualCashFlow = annualNoi - annualDebtService; const cashRecovered = Math.min(maxRefiLoan, totalProjectCost); const cashLeftInDeal = Math.max(totalProjectCost - maxRefiLoan, 0); const cashRecoveryRate = totalProjectCost > 0 ? (cashRecovered / totalProjectCost) * 100 : 0; const dscr = annualDebtService > 0 ? annualNoi / annualDebtService : null; const equityCreated = Math.max(afterRepairValue - totalProjectCost, 0); const notes = ['This run shows how much capital the refinance can recycle back to you while keeping the stabilized rental in view.', 'A BRRRR deal is strongest when equity creation, rent stability, and refinance terms all support each other.', 'Use the cash-left-in-deal output to decide whether the project still fits your capital-recycling goals.']; const warnings: string[] = []; if (annualCashFlow < 0) warnings.push('Post-refinance cash flow is negative under the current assumptions.'); if (cashLeftInDeal > totalProjectCost * 0.35) warnings.push('A large amount of cash remains trapped in the deal after refinance.'); if (dscr !== null && dscr < 1.2) warnings.push('DSCR is thin for a refinance-backed rental hold.'); if (afterRepairValue <= totalProjectCost) warnings.push('The project is not creating enough equity from rehab under the current ARV.'); setResult({ totalProjectCost, maxRefiLoan, cashRecovered, cashLeftInDeal, annualNoi, annualDebtService, annualCashFlow, cashRecoveryRate, dscr, equityCreated, notes, warnings }); setShowModal(true); };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm"><div className="mb-6 flex items-start gap-3"><div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div><div><h2 className="text-2xl font-bold text-foreground">BRRRR Calculator</h2><p className="text-sm text-muted-foreground mt-1">Advanced BRRRR screening across acquisition cost, refinance recovery, and stabilized rental performance.</p></div></div><div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"><div className="flex-1"><h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3><p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{isAdvancedMode ? 'Includes refinance, DSCR, cash-recovery, and post-refi cash-flow context.' : 'Keeps the tool focused on the core BRRRR capital-recovery screen.'}</p></div><button onClick={() => setIsAdvancedMode((prev) => !prev)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">{isAdvancedMode ? <><ChevronUp className="h-4 w-4 mr-2" />Switch to Simple</> : <><ChevronDown className="h-4 w-4 mr-2" />Advanced Options</>}</button></div>{isAdvancedMode && <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"><button onClick={() => setShowModeDropdown((prev) => !prev)} className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between"><span className="font-medium">Buy + Rehab + Refinance + Rent Screen</span><ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} /></button>{showModeDropdown && <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">This mode connects total project cost, ARV, stabilized rent, and refinance terms so the capital-recycling story stays grounded.</div>}</div>}<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div><label className="block text-sm font-medium text-foreground mb-2">Purchase Price ($)</label><input type="number" min="0" value={inputs.purchasePrice} onChange={(e) => onChange('purchasePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Rehab Costs ($)</label><input type="number" min="0" value={inputs.rehabCosts} onChange={(e) => onChange('rehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">After Repair Value ($)</label><input type="number" min="0" value={inputs.afterRepairValue} onChange={(e) => onChange('afterRepairValue', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Monthly Rent ($)</label><input type="number" min="0" value={inputs.monthlyRent} onChange={(e) => onChange('monthlyRent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Vacancy Rate (%)</label><input type="number" min="0" max="50" step="0.1" value={inputs.vacancyRate} onChange={(e) => onChange('vacancyRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Monthly Operating Expenses ($)</label><input type="number" min="0" value={inputs.monthlyOperatingExpenses} onChange={(e) => onChange('monthlyOperatingExpenses', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual Taxes ($)</label><input type="number" min="0" value={inputs.annualTaxes} onChange={(e) => onChange('annualTaxes', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual Insurance ($)</label><input type="number" min="0" value={inputs.annualInsurance} onChange={(e) => onChange('annualInsurance', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Annual HOA ($)</label><input type="number" min="0" value={inputs.annualHoa} onChange={(e) => onChange('annualHoa', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>{isAdvancedMode && <><div><label className="block text-sm font-medium text-foreground mb-2">Closing Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.closingCostsPercent} onChange={(e) => onChange('closingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Refinance LTV (%)</label><input type="number" min="0" max="90" step="0.1" value={inputs.refinanceLtvPercent} onChange={(e) => onChange('refinanceLtvPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Refinance Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.refinanceRatePercent} onChange={(e) => onChange('refinanceRatePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Refinance Term (years)</label><input type="number" min="1" value={inputs.refinanceTermYears} onChange={(e) => onChange('refinanceTermYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}</div><div className="flex flex-col sm:flex-row gap-3"><button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Analyze BRRRR Deal</button><button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button></div></div>
      {showModal && result && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label="BRRRR results dashboard"><div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl"><div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background"><div><h3 className="text-xl font-bold text-foreground">BRRRR Results Dashboard</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div><button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-6"><div className="border rounded-xl p-6"><div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4"><div><div className="text-xs text-muted-foreground">Cash Left in Deal</div><div className="text-3xl font-bold">{usd(result.cashLeftInDeal)}</div></div><div><div className="text-xs text-muted-foreground">Cash Recovery Rate</div><div className="text-2xl font-semibold">{pct(result.cashRecoveryRate)}</div></div><div><div className="text-xs text-muted-foreground">Equity Created</div><div className="text-2xl font-semibold">{usd(result.equityCreated)}</div></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"><div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Total Project Cost</div><div className="text-xl font-bold mt-1">{usd(result.totalProjectCost)}</div></div><div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Max Refinance Loan</div><div className="text-xl font-bold mt-1">{usd(result.maxRefiLoan)}</div></div><div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Annual NOI</div><div className="text-xl font-bold mt-1">{usd(result.annualNoi)}</div></div><div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Annual Cash Flow</div><div className="text-xl font-bold mt-1">{usd(result.annualCashFlow)}</div></div></div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul></div><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but a full BRRRR underwriting pass is still required.</li>}</ul><div className="mt-4 text-sm"><span className="font-medium">DSCR:</span> {result.dscr === null ? 'N/A' : `${result.dscr.toFixed(2)}x`}</div><div className="mt-1 text-sm"><span className="font-medium">Annual Debt Service:</span> {usd(result.annualDebtService)}</div></div></div></div></div></div>}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          About This Calculator
        </h2>
        <p className="text-base text-foreground leading-relaxed mb-4">
          This BRRRR Calculator connects the two sides of the strategy that matter most: how much
          equity the project creates and how the stabilized rental performs after the refinance.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          That combination helps you avoid a common BRRRR mistake: celebrating the refinance
          proceeds without checking whether the permanent debt load still leaves a healthy rental
          behind. A deal that recovers capital but produces weak post-refi cash flow can still slow
          the repeat part of the strategy.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-6">
          This version is designed to act like a real BRRRR screen rather than a refinance-only
          widget. It balances project cost, refinance proceeds, stabilized rent, annual NOI, debt
          coverage, and cash left in the deal so the entire capital-recycling story stays visible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4">Cash recovery and cash left in the deal after refinance</div>
          <div className="border rounded-xl p-4">Post-refi cash flow and DSCR under stabilized rental assumptions</div>
          <div className="border rounded-xl p-4">Equity creation from rehab and ARV spread</div>
          <div className="border rounded-xl p-4">Popup dashboard with notes, warnings, and refinance-risk context</div>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online BRRRR Calculator
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                1. Build the total project cost with purchase, rehab, and closing assumptions that
                reflect the full upfront capital needed to get the property stabilized.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                2. Estimate stabilized rent and operating drag honestly. A BRRRR deal only becomes
                repeatable if the permanent rental phase stands on its own after the rehab is done.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                3. Set the refinance LTV, rate, and term using realistic lender expectations,
                because the refinance assumptions determine how much capital actually comes back out.
              </div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">
                4. Use cash-left-in-deal and post-refi cash flow together before calling the
                project a win. The best BRRRR deals recover capital and still produce a durable
                rental.
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Results Dashboard (Popup Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Cash-left-in-deal and cash-recovery rate so you can see how much capital is still tied up</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Post-refinance annual cash flow and DSCR to measure rental durability after the refinance</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Equity created through ARV spread and project-cost discipline</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Warning flags for weak refinance terms, weak equity creation, and negative stabilized cash flow</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why Use This Calculator?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-200">
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">See whether the refinance actually returns enough capital to keep your acquisition pipeline moving.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Pressure-test stabilized rent assumptions against real operating drag instead of looking at gross rent alone.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Measure whether the permanent debt load still leaves the rental with acceptable cash flow and DSCR.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Spot weak projects early, before time and rehab capital are committed to a deal that cannot truly repeat.</div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              BRRRR Advanced Features
            </h3>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
              <p>This version is built for screening the strategy as a full loop, not just a refinance event. It keeps the operational side of the hold visible so you can decide whether the deal really deserves another cycle.</p>
              <ul className="space-y-2">
                <li>- Total project cost including closing friction, not only purchase plus rehab.</li>
                <li>- Refinance proceeds modeled from ARV and lender LTV instead of an assumed cash-out number.</li>
                <li>- NOI, debt service, annual cash flow, and DSCR after the property is stabilized.</li>
                <li>- Capital recycling outputs like cash recovered, cash left in deal, and cash recovery rate.</li>
                <li>- Warning flags when the deal creates equity but still leaves the long-term rental too thin.</li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/40 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              BRRRR Decision Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="border rounded-lg p-4 bg-background">If cash recovery looks strong but annual cash flow is weak, the refinance may be too aggressive for the rent level.</div>
              <div className="border rounded-lg p-4 bg-background">If cash left in the deal is still large, ask whether the equity creation is enough to justify the slower capital turnover.</div>
              <div className="border rounded-lg p-4 bg-background">If DSCR is thin, test a lower refinance LTV or more conservative rent before assuming the hold is financeable.</div>
              <div className="border rounded-lg p-4 bg-background">If equity created is small, review ARV and rehab scope first because the entire BRRRR cycle depends on forced appreciation being real.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding BRRRR Strategy Planning
        </h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              BRRRR works best when equity creation, refinance terms, and stabilized rental cash
              flow all support each other. If one of those three breaks, the repeat part of the
              strategy weakens quickly.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              That is why this calculator does not stop at refinance proceeds. It keeps the
              permanent-rental stage visible so you can decide whether the project is truly
              repeatable, not just temporarily impressive.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Why This Matters
            </h3>
            <ul className="space-y-2">
              <li>- High refinance proceeds do not guarantee a strong long-term rental.</li>
              <li>- Weak DSCR can turn a capital-recycling win into an operating headache.</li>
              <li>- A healthy BRRRR deal creates equity, preserves cash flow, and keeps enough liquidity for the next project.</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              What Strong BRRRR Inputs Usually Have in Common
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>- Rehab scope that is large enough to create real value but still predictable enough to budget with confidence.</li>
              <li>- A rent level that is supported by local comps rather than optimistic post-renovation hopes.</li>
              <li>- Refinance assumptions that reflect seasoning rules, appraisal risk, and lender DSCR expectations.</li>
              <li>- Enough remaining monthly cash flow after debt service to hold the property without stressing reserves.</li>
            </ul>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common BRRRR Failure Points
            </h3>
            <div className="space-y-3 text-orange-800 dark:text-orange-200">
              <p>BRRRR often breaks at the transition between rehab optimism and refinance reality. That usually shows up in one of four places:</p>
              <ul className="space-y-2">
                <li>- ARV comes in lower than expected, shrinking the refinance ceiling.</li>
                <li>- Final rehab costs grow, which increases the capital tied up in the project.</li>
                <li>- Stabilized rent is lower than planned, weakening NOI and DSCR.</li>
                <li>- Refinance rates or fees are worse than expected, reducing post-refi cash flow.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Quick Reference: BRRRR Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Planning Area</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Typical Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Vacancy assumption</td>
                <td className="py-3 px-4">3% to 8%</td>
                <td className="py-3 px-4 text-muted-foreground">Controls how much of projected rent survives into effective gross income.</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Refinance LTV</td>
                <td className="py-3 px-4">70% to 80%</td>
                <td className="py-3 px-4 text-muted-foreground">A higher LTV improves cash recovery but can weaken DSCR and monthly cash flow.</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">DSCR comfort zone</td>
                <td className="py-3 px-4">1.20x to 1.35x+</td>
                <td className="py-3 px-4 text-muted-foreground">Helps show whether the stabilized rental can carry the permanent loan with margin.</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Cash recovery goal</td>
                <td className="py-3 px-4">Varies by operator</td>
                <td className="py-3 px-4 text-muted-foreground">The right target depends on whether you optimize for velocity, yield, or reserve strength.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-background border rounded-xl p-6 sm:p-8"><h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-primary" />Scientific References & Resources</h2><div className="space-y-3 text-sm text-muted-foreground"><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official sources</h3><ul className="space-y-1"><li>- <a href="https://www.huduser.gov/portal/datasets/fmr.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">HUD Fair Market Rents</a> - rent benchmark context for stabilized-income assumptions.</li><li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - acquisition and refinance closing-cost context.</li><li>- <a href="https://www.fhfa.gov/reports/house-price-index" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FHFA House Price Index</a> - market context for value growth and sale assumptions.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3><ul className="space-y-1"><li>- <a href="https://www.stessa.com/blog/brrrr-strategy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stessa BRRRR Strategy Guide</a> - operating overview of the buy, rehab, rent, refinance, repeat framework.</li><li>- <a href="https://dealcheck.io/blog/brrrr-calculator/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck BRRRR Calculator Guide</a> - underwriting context for refinance and rental-stage planning.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3><p>Prioritize ARV confidence, rehab scope realism, stabilized rent quality, and lender refinance constraints. Those four variables usually decide whether a BRRRR project is repeatable or just temporarily attractive.</p></div></div><p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace lender underwriting, contractor bids, appraisals, tax advice, or local legal review.</p></div>
      <div className="bg-background border rounded-xl p-6"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2><FAQAccordion faqs={FAQS} showTitle={false} /></div>
      <div className="bg-background border rounded-xl p-6"><CalculatorReview calculatorName="BRRRR Calculator" /></div>
    </div>
  );
}
