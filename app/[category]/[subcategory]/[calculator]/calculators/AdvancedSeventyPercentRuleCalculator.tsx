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
  afterRepairValue: string;
  estimatedRehabCosts: string;
  actualOfferPrice: string;
  customRulePercent: string;
  contingencyPercent: string;
  buyingCostsPercent: string;
  sellingCostsPercent: string;
  holdingMonths: string;
  monthlyHoldingCosts: string;
  loanPointsPercent: string;
  monthlyFinancingCost: string;
  desiredProfit: string;
}

interface Result {
  standardMaxOffer: number;
  customMaxOffer: number;
  actualOffer: number;
  offerGapVs70: number;
  offerGapVsCustom: number;
  contingencyReserve: number;
  buyingCosts: number;
  sellingCosts: number;
  holdingCosts: number;
  financingCosts: number;
  totalProjectCost: number;
  projectedNetProfit: number;
  profitMargin: number;
  roiOnTotalCost: number;
  breakEvenSalePrice: number;
  status: Status;
  notes: string[];
  warnings: string[];
}

const DEFAULTS: Inputs = {
  afterRepairValue: '325000',
  estimatedRehabCosts: '55000',
  actualOfferPrice: '165000',
  customRulePercent: '70',
  contingencyPercent: '10',
  buyingCostsPercent: '2.5',
  sellingCostsPercent: '8',
  holdingMonths: '6',
  monthlyHoldingCosts: '950',
  loanPointsPercent: '2',
  monthlyFinancingCost: '1800',
  desiredProfit: '30000'
};

const FAQS: FAQItem[] = [
  { question: 'What is the 70% rule in house flipping?', answer: 'It is a quick fix-and-flip screening rule. A common version says the maximum offer should be about 70% of the after-repair value minus rehab costs.', category: 'Basics' },
  { question: 'What does ARV mean?', answer: 'ARV means After Repair Value. It is the estimated market value of the property once the renovation is complete and the home is ready for resale.', category: 'Basics' },
  { question: 'Why does this calculator include a custom rule percentage?', answer: 'Many experienced investors adjust the rule for their market, financing, and risk tolerance. Hot markets might stretch above 70%, while slower or riskier markets may require a lower percentage.', category: 'Features' },
  { question: 'Does the 70% rule include holding and selling costs?', answer: 'The simple shortcut assumes there is enough room for those costs, but it does not calculate them explicitly. This advanced version makes them visible so you can compare the shortcut with a fuller flip model.', category: 'Method' },
  { question: 'Can a deal above the 70% rule still work?', answer: 'Yes. Some flippers can offer more because of lower financing costs, faster turns, lower commissions, or stronger local pricing. That does not make the shortcut useless; it means your personalized rule may differ from 70%.', category: 'Strategy' },
  { question: 'What costs are easy to miss in a flip?', answer: 'Common misses include contingency, utilities during the rehab, taxes, insurance, lender points, loan interest, resale commissions, seller concessions, and timeline slippage.', category: 'Operations' },
  { question: 'What is a good profit margin on a flip?', answer: 'There is no universal number, but many flippers want a meaningful cushion because unexpected repairs and timeline delays can erase thin margins quickly.', category: 'Profitability' },
  { question: 'Why include desired profit if projected profit is already shown?', answer: 'Desired profit gives you a personal deal standard. A property can show a nominal profit and still fail your actual buy-box once effort, risk, and capital use are considered.', category: 'Features' },
  { question: 'How should I estimate ARV more accurately?', answer: 'Use recent comparable sales of renovated properties with similar size, condition, location, and buyer appeal. Conservative ARV estimates are usually better than optimistic ones when screening flips.', category: 'ARV' },
  { question: 'What should I do after this screen?', answer: 'Move into a full flip analysis. Validate comps, lock down contractor bids, check permit or code issues, verify carrying costs, and pressure-test the resale timeline before making an offer.', category: 'Next Steps' }
];

const quickReferenceRows = [
  { category: 'Rule Percentage', range: '65% to 80%', unit: 'of ARV', notes: 'Common field range depending on market heat, cost structure, and investor model.' },
  { category: 'Buying Costs', range: '1% to 4%', unit: 'of purchase price', notes: 'Typical planning range for acquisition-side costs in many markets.' },
  { category: 'Selling Costs', range: '6% to 10%', unit: 'of resale price', notes: 'Often includes commissions, closing costs, and buyer incentives.' },
  { category: 'Contingency Reserve', range: '10% to 20%', unit: 'of rehab budget', notes: 'Useful for protecting against unknown repairs and scope creep.' },
  { category: 'Hold Length', range: '4 to 9+', unit: 'months', notes: 'Longer holds can materially change flip economics through carrying costs.' },
  { category: 'Profit Cushion', range: 'Deal-specific', unit: 'net profit target', notes: 'Your minimum acceptable profit should reflect risk, market speed, and capital use.' }
];

const parse = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const pct = (value: number, digits = 2) => `${value.toFixed(digits)}%`;

const getStatus = (offerGapVs70: number, projectedNetProfit: number, desiredProfit: number): Status => {
  if (offerGapVs70 >= 15000 && projectedNetProfit >= desiredProfit) return 'excellent';
  if (offerGapVs70 >= 0 && projectedNetProfit >= desiredProfit) return 'strong';
  if (offerGapVs70 >= -10000 && projectedNetProfit > 0) return 'pass';
  if (projectedNetProfit > 0) return 'borderline';
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
  excellent: 'Strong 70% Rule Position',
  strong: 'Within 70% Rule Range',
  pass: 'Slightly Above the Rule',
  borderline: 'Thin Flip Margin',
  weak: 'Offer Looks Too Aggressive'
};

export default function AdvancedSeventyPercentRuleCalculator() {
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
    const afterRepairValue = parse(inputs.afterRepairValue);
    const estimatedRehabCosts = parse(inputs.estimatedRehabCosts);
    const actualOffer = parse(inputs.actualOfferPrice);
    const customRulePercent = Math.min(Math.max(parse(inputs.customRulePercent), 40), 90);
    const contingencyPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.contingencyPercent), 0), 50) : 0;
    const buyingCostsPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.buyingCostsPercent), 0), 15) : 0;
    const sellingCostsPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.sellingCostsPercent), 0), 20) : 0;
    const holdingMonths = isAdvancedMode ? Math.max(parse(inputs.holdingMonths), 0) : 0;
    const monthlyHoldingCosts = isAdvancedMode ? Math.max(parse(inputs.monthlyHoldingCosts), 0) : 0;
    const loanPointsPercent = isAdvancedMode ? Math.min(Math.max(parse(inputs.loanPointsPercent), 0), 10) : 0;
    const monthlyFinancingCost = isAdvancedMode ? Math.max(parse(inputs.monthlyFinancingCost), 0) : 0;
    const desiredProfit = isAdvancedMode ? Math.max(parse(inputs.desiredProfit), 0) : 0;

    if (afterRepairValue <= 0 || estimatedRehabCosts < 0 || actualOffer <= 0) {
      alert('Please enter an ARV, rehab cost, and actual offer price greater than zero.');
      return;
    }

    const standardMaxOffer = (afterRepairValue * 0.7) - estimatedRehabCosts;
    const customMaxOffer = (afterRepairValue * (customRulePercent / 100)) - estimatedRehabCosts;
    const contingencyReserve = estimatedRehabCosts * (contingencyPercent / 100);
    const buyingCosts = actualOffer * (buyingCostsPercent / 100);
    const sellingCosts = afterRepairValue * (sellingCostsPercent / 100);
    const holdingCosts = holdingMonths * monthlyHoldingCosts;
    const financingCosts = (actualOffer * (loanPointsPercent / 100)) + (holdingMonths * monthlyFinancingCost);
    const totalProjectCost = actualOffer + estimatedRehabCosts + contingencyReserve + buyingCosts + sellingCosts + holdingCosts + financingCosts;
    const projectedNetProfit = afterRepairValue - totalProjectCost;
    const profitMargin = afterRepairValue > 0 ? (projectedNetProfit / afterRepairValue) * 100 : 0;
    const roiOnTotalCost = totalProjectCost > 0 ? (projectedNetProfit / totalProjectCost) * 100 : 0;
    const offerGapVs70 = standardMaxOffer - actualOffer;
    const offerGapVsCustom = customMaxOffer - actualOffer;
    const breakEvenSalePrice = totalProjectCost;
    const status = getStatus(offerGapVs70, projectedNetProfit, desiredProfit);

    const notes: string[] = [];
    const warnings: string[] = [];

    notes.push(offerGapVs70 >= 0 ? 'The current offer is inside the classic 70% rule range before you even look at your detailed cost model.' : 'The current offer is above the classic 70% rule range, so the shortcut is already asking for a stronger justification.');
    notes.push('This version compares the standard 70% rule against a custom market rule so you can see whether your buy box needs to be tighter or looser.');
    notes.push(isAdvancedMode ? 'Detailed holding, selling, financing, and contingency costs are included so the projected profit is more realistic than a simple MAO-only widget.' : 'Simple mode keeps the focus on maximum allowable offer and the rule comparison.');

    if (projectedNetProfit < 0) warnings.push('The detailed cost model produces a projected loss at the current offer price.');
    if (offerGapVs70 < 0) warnings.push('The offer price is above the classic 70% rule maximum. Recheck ARV, rehab, and your market-specific rule percentage.');
    if (profitMargin < 10) warnings.push('Projected margin is thin. Small timeline or rehab overruns could erase the deal.');
    if (holdingMonths >= 9) warnings.push('Long hold duration can materially change flip economics. Make sure the timeline is realistic.');
    if (contingencyPercent < 10 && isAdvancedMode) warnings.push('Contingency may be light for a renovation deal. Hidden repair risk deserves a bigger buffer on many projects.');

    setResult({
      standardMaxOffer,
      customMaxOffer,
      actualOffer,
      offerGapVs70,
      offerGapVsCustom,
      contingencyReserve,
      buyingCosts,
      sellingCosts,
      holdingCosts,
      financingCosts,
      totalProjectCost,
      projectedNetProfit,
      profitMargin,
      roiOnTotalCost,
      breakEvenSalePrice,
      status,
      notes,
      warnings
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fix-and-Flip Offer Screening and Profit Buffer Check</h2>
            <p className="text-sm text-muted-foreground mt-1">Built to keep the approved page structure while turning the 70% rule into a more decision-ready flip screen.</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">{isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{isAdvancedMode ? 'Adds custom rule %, contingency, buying/selling costs, hold costs, financing costs, and projected profit context.' : 'Keeps the tool focused on the classic MAO check with offer comparison.'}</p>
          </div>
          <button onClick={() => setIsAdvancedMode((prev) => !prev)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
            {isAdvancedMode ? <><ChevronUp className="h-4 w-4 mr-2" />Switch to Simple</> : <><ChevronDown className="h-4 w-4 mr-2" />Advanced Options</>}
          </button>
        </div>

        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <button onClick={() => setShowModeDropdown((prev) => !prev)} className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-background text-foreground hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between">
              <span className="font-medium">Maximum Offer + Detailed Flip Model</span>
              <ChevronDown className={cn('h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform', showModeDropdown && 'rotate-180')} />
            </button>
            {showModeDropdown && <div className="mt-2 px-4 py-3 rounded-lg bg-background border border-indigo-200 dark:border-indigo-700 text-sm text-muted-foreground">This mode lets you compare the classic 70% shortcut against a more detailed cost stack with contingency, resale, carrying, and financing pressure.</div>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">After Repair Value (ARV) ($)</label><input type="number" min="0" value={inputs.afterRepairValue} onChange={(e) => onChange('afterRepairValue', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Estimated Rehab Costs ($)</label><input type="number" min="0" value={inputs.estimatedRehabCosts} onChange={(e) => onChange('estimatedRehabCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Actual Offer Price ($)</label><input type="number" min="0" value={inputs.actualOfferPrice} onChange={(e) => onChange('actualOfferPrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          {isAdvancedMode && <><div><label className="block text-sm font-medium text-foreground mb-2">Custom Rule (%)</label><input type="number" min="40" max="90" step="0.1" value={inputs.customRulePercent} onChange={(e) => onChange('customRulePercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Contingency (% of rehab)</label><input type="number" min="0" max="50" step="0.1" value={inputs.contingencyPercent} onChange={(e) => onChange('contingencyPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Buying Costs (%)</label><input type="number" min="0" max="15" step="0.1" value={inputs.buyingCostsPercent} onChange={(e) => onChange('buyingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Selling Costs (%)</label><input type="number" min="0" max="20" step="0.1" value={inputs.sellingCostsPercent} onChange={(e) => onChange('sellingCostsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Holding Months</label><input type="number" min="0" step="1" value={inputs.holdingMonths} onChange={(e) => onChange('holdingMonths', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Monthly Holding Costs ($)</label><input type="number" min="0" value={inputs.monthlyHoldingCosts} onChange={(e) => onChange('monthlyHoldingCosts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Loan Points (%)</label><input type="number" min="0" max="10" step="0.1" value={inputs.loanPointsPercent} onChange={(e) => onChange('loanPointsPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Monthly Financing Cost ($)</label><input type="number" min="0" value={inputs.monthlyFinancingCost} onChange={(e) => onChange('monthlyFinancingCost', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div><div><label className="block text-sm font-medium text-foreground mb-2">Desired Profit ($)</label><input type="number" min="0" value={inputs.desiredProfit} onChange={(e) => onChange('desiredProfit', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div></>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Analyze 70% Rule</button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label="70 percent rule results dashboard">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div><h3 className="text-xl font-bold text-foreground">70% Rule Results Dashboard</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', badgeClass[result.status])}>{badgeLabel[result.status]}</span>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><div className="text-xs text-muted-foreground">70% Max Offer</div><div className="text-3xl font-bold">{usd(result.standardMaxOffer)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Actual Offer</div><div className="text-2xl font-semibold">{usd(result.actualOffer)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Gap vs 70% Rule</div><div className="text-2xl font-semibold">{result.offerGapVs70 >= 0 ? `${usd(result.offerGapVs70)} below` : `${usd(Math.abs(result.offerGapVs70))} above`}</div></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Custom Max Offer</div><div className="text-2xl font-bold mt-1">{usd(result.customMaxOffer)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Projected Net Profit</div><div className="text-2xl font-bold mt-1">{usd(result.projectedNetProfit)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Profit Margin</div><div className="text-2xl font-bold mt-1">{pct(result.profitMargin)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">ROI on Total Cost</div><div className="text-2xl font-bold mt-1">{pct(result.roiOnTotalCost)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Total Project Cost</div><div className="text-2xl font-bold mt-1">{usd(result.totalProjectCost)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Break-even Sale Price</div><div className="text-2xl font-bold mt-1">{usd(result.breakEvenSalePrice)}</div></div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Contingency</div><div className="font-semibold">{usd(result.contingencyReserve)}</div></div>
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Buying + Selling</div><div className="font-semibold">{usd(result.buyingCosts + result.sellingCosts)}</div></div>
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Holding Costs</div><div className="font-semibold">{usd(result.holdingCosts)}</div></div>
                    <div className="border rounded-lg p-3"><div className="text-xs text-muted-foreground">Financing Costs</div><div className="font-semibold">{usd(result.financingCosts)}</div></div>
                  </div>
                </div>
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but a full flip analysis is still required.</li>}</ul>
                  <div className="mt-4 text-sm"><span className="font-medium">Gap vs custom rule:</span> {result.offerGapVsCustom >= 0 ? `${usd(result.offerGapVsCustom)} below` : `${usd(Math.abs(result.offerGapVsCustom))} above`}</div>
                  <div className="mt-1 text-sm"><span className="font-medium">Offer cushion to 70% rule:</span> {usd(result.standardMaxOffer - result.actualOffer)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" />About This Calculator</h2>
        <p className="text-base text-foreground leading-relaxed mb-4">This 70% Rule Calculator is designed for real fix-and-flip screening, not just a one-line maximum-offer formula. It combines the classic MAO shortcut with actual-offer comparison, market-rule flexibility, and a fuller cost stack so you can see whether the flip still works after reality is layered on top.</p>
        <p className="text-base text-foreground leading-relaxed mb-4">Use it when you need to decide whether an asking price belongs inside your flip buy box, whether the deal only works under an aggressive rule percentage, or whether the headline ARV spread disappears once carry, selling, and financing costs show up.</p>
        <p className="text-base text-foreground leading-relaxed mb-6">The best inputs for this page come from recent renovated comps, real contractor bids, realistic hold timelines, and conservative resale assumptions. The 70% rule is powerful because it creates discipline, but only if the assumptions feeding it are honest.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Percent className="h-4 w-4 text-primary" />Standard and Custom MAO</div>Compare the classic 70% rule against a market-adjusted custom rule instead of treating one percentage as universal.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Actual Offer Positioning</div>See instantly whether your real offer sits below, near, or above the rule-based maximum.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" />Detailed Profit Check</div>Layer contingency, buying, selling, holding, and financing costs onto the flip instead of trusting the shortcut alone.</div>
          <div className="border rounded-xl p-4"><div className="font-medium text-foreground mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" />Margin Fragility Detection</div>Spot when a deal only works because ARV is optimistic, rehab is light, or timeline assumptions are too friendly.</div>
        </div>
        <div className="mt-6 p-5 bg-muted rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" />What This Advanced Version Adds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Percent className="h-4 w-4 mt-0.5 text-primary" />Classic 70% maximum offer and custom-rule maximum offer in the same run</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Target className="h-4 w-4 mt-0.5 text-primary" />Actual-offer gap analysis for both standard and custom thresholds</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Wallet className="h-4 w-4 mt-0.5 text-primary" />Projected net profit, profit margin, ROI on total cost, and break-even sale price</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><Landmark className="h-4 w-4 mt-0.5 text-primary" />Contingency, buying, selling, holding, and financing cost layers</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><BarChart3 className="h-4 w-4 mt-0.5 text-primary" />Custom market-rule controls for stronger deal filtering</div>
            <div className="bg-background border rounded-lg p-3 flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-primary" />Warnings for thin margins, aggressive pricing, and unrealistic hold assumptions</div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />How to Use This Free Online 70% Rule Calculator</h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><Route className="h-5 w-5" />Step-by-Step Guide</h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />1. Build a conservative ARV first</h4>Use recent sold comparables for renovated properties, not listing prices or best-case resale hopes. A weak ARV assumption breaks the entire screen.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-blue-600 dark:text-blue-400" />2. Estimate rehab with discipline</h4>Use contractor bids, material estimates, scope details, and realistic contingency instead of soft round numbers that make the deal look cleaner than it is.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />3. Enter the actual offer you are considering</h4>That allows the tool to show the real pricing gap versus both the standard 70% rule and your custom market rule.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />4. Adjust the rule percentage for your market if needed</h4>Some flips require a lower percentage for safety, while very competitive or very efficient operators may justify a higher one. The key is being explicit.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />5. Add the full cost stack in advanced mode</h4>Buying, selling, holding, financing, and contingency costs are where many flips quietly lose their margin. Use advanced mode to expose that pressure.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700"><h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />6. Use the popup dashboard as a screening decision</h4>The modal shows whether the offer fits the shortcut and whether the detailed model still leaves enough profit to justify the flip.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Your Results Dashboard (Popup Only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-green-600 dark:text-green-400" />70% Rule Position</h4><p className="text-xs text-muted-foreground">Shows whether the actual offer sits inside, near, or above the classic 70% maximum.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-green-600 dark:text-green-400" />Custom Rule Comparison</h4><p className="text-xs text-muted-foreground">Lets you compare the deal against your personalized market rule instead of 70% only.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />Profitability Snapshot</h4><p className="text-xs text-muted-foreground">Displays projected net profit, margin, ROI, and break-even sale price in one view.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><Landmark className="h-4 w-4 text-green-600 dark:text-green-400" />Cost Stack Breakdown</h4><p className="text-xs text-muted-foreground">Shows how contingency, carry, resale, and financing costs affect the deal after the headline rule check.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />Margin Fragility View</h4><p className="text-xs text-muted-foreground">Highlights how quickly the deal can weaken when the offer is too close to the rule line.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium text-sm mb-1 flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />Notes and Warning Flags</h4><p className="text-xs text-muted-foreground">Ends with action-focused notes telling you which assumptions are most likely to need review.</p></div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><Target className="h-5 w-5" />Why Use This Version?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Calculator className="h-4 w-4 text-orange-600 dark:text-orange-400" />Beyond a basic MAO widget</h4><p className="text-sm text-muted-foreground">Most 70% tools stop at ARV, rehab, and a maximum offer. This version shows whether the flip still works after carry and exit costs are included.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />Market-rule flexibility</h4><p className="text-sm text-muted-foreground">The custom percentage lets you test whether your market or operating model justifies a tighter or looser rule.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />Profit-aware screening</h4><p className="text-sm text-muted-foreground">Projected net profit and ROI make the tool more decision-ready than a simple offer cap alone.</p></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg"><h4 className="font-medium mb-2 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />Thin-margin detection</h4><p className="text-sm text-muted-foreground">The warning system helps catch deals that only work if timeline, ARV, or rehab assumptions go perfectly.</p></div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Wrench className="h-5 w-5" />70% Rule Advanced Features</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Standard 70% rule and custom-rule analysis in the same tool.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Actual-offer comparison so you can screen live deals instead of theoretical ones only.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Contingency, resale, holding, and financing costs to surface margin compression early.</span></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-purple-600 dark:text-purple-400" /><span>Projected profit and break-even sale price so you can see how much room the flip actually has.</span></div>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><Lightbulb className="h-5 w-5" />70% Rule Decision Playbook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Set your rule before you shop</h4><p className="text-muted-foreground">Decide whether your operation really supports 70%, or whether your market and financing require a lower number.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Pressure-test margin killers</h4><p className="text-muted-foreground">ARV, rehab, time, and resale friction are the four biggest ways a flip that looked fine stops working.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Wallet className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Use desired profit as a deal filter</h4><p className="text-muted-foreground">A deal that technically makes money may still be too thin once your time, capital, and execution risk are considered.</p></div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg"><h4 className="font-medium mb-1 text-foreground flex items-center gap-2"><Route className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />Update the model after every new quote</h4><p className="text-muted-foreground">Contractor revisions, comp changes, lender terms, or longer hold times can quickly change whether the offer still fits your rule.</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Understanding 70% Rule Flip Screening</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5" />Core Concept and Decision Context</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-3">The 70% rule is a fast fix-and-flip screening shortcut that tries to protect margin by limiting how much you pay relative to ARV and rehab. Its job is to create discipline before a project turns into a costly emotional buy.</p>
            <p className="text-blue-800 dark:text-blue-200 mb-3">Its real value is speed and consistency. You can evaluate more opportunities quickly and reserve deeper underwriting for deals that survive the first screen.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Best used for early flip deal triage, not final offer approval.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Most useful when ARV and rehab assumptions are conservative.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Works as a buy-box rule for single-family and cosmetic-heavy flips.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Should be followed by a full project budget and timeline model.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><TrendingDown className="h-5 w-5" />Major Factors Affecting Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">ARV accuracy and whether renovated comp selection is realistic.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Rehab scope depth, permits, surprises behind walls, and contractor reliability.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Hold duration, because taxes, utilities, insurance, and interest continue while the project runs.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Selling friction, including commissions, buyer concessions, and closing costs.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Financing structure, especially points, interest, and draws.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Market speed and buyer demand, which determine how much margin you really need.</div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Comparison Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Standard 70% case: the classic shortcut used as a first-pass maximum offer.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Custom rule case: your personal or market-specific percentage layered onto the same deal.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Detailed cost case: add contingency, carry, resale, and financing costs to see what the shortcut hides.</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Offer comparison case: evaluate the real price you may pay, not just the theoretical maximum.</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Target className="h-5 w-5" />Threshold and Timing Guidance</h3>
            <ul className="space-y-2">
              <li>- Around 70% is the classic benchmark for many beginner-friendly flip screens.</li>
              <li>- Lower percentages can make sense in slower markets or heavier rehab projects.</li>
              <li>- Higher percentages may only work when execution is fast, costs are controlled, and ARV confidence is strong.</li>
              <li>- Recalculate the deal after every scope, lender, or comp update.</li>
              <li>- If the detailed profit model is thin, the shortcut alone is not enough to save the deal.</li>
            </ul>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2"><Wallet className="h-5 w-5" />Practical Use and Strategy Fit</h3>
            <p className="text-cyan-800 dark:text-cyan-200 mb-3">Use the rule to create a disciplined offer ceiling before negotiation starts. That is especially useful when multiple projects are competing for the same capital and management attention.</p>
            <p className="text-cyan-800 dark:text-cyan-200">The most important mistake to avoid is treating the shortcut as a substitute for a real flip budget. A flip can pass the rule and still fail the project once scope creep, sale friction, or longer hold time shows up.</p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Benefits, Risks, and Impact Summary</h3>
            <ul className="space-y-2">
              <li>- Benefit: faster deal screening and less emotional overbidding.</li>
              <li>- Benefit: clearer understanding of how much room a flip actually has before profit disappears.</li>
              <li>- Risk: optimistic ARV or rehab assumptions can make a weak deal look acceptable.</li>
              <li>- Risk: longer holds and resale friction can quietly destroy thin margins.</li>
              <li>- Impact: combining rule discipline with cost realism improves offer quality and capital protection.</li>
              <li>- Impact: custom rule percentages help align your buy box with your actual operating model.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: 70% Rule Benchmarks</h3>
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
              <li>- <a href="https://www.consumerfinance.gov/owning-a-home/closing-disclosure" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB Closing Disclosure Explainer</a> - useful context for acquisition and resale closing-cost categories.</li>
              <li>- <a href="https://www.bls.gov/data/inflation_calculator.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">BLS CPI Inflation Calculator</a> - helpful for pressure-testing cost inflation over longer rehab timelines.</li>
              <li>- <a href="https://www.fhfa.gov/reports/house-price-index" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FHFA House Price Index</a> - useful context for broader house-price movement and market sensitivity.</li>
              <li>- <a href="https://www.irs.gov/pub/irs-prior/p551--2022.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Publication 551</a> - reference context for cost basis concepts and capital improvements.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://calculatehome.com/calculators/70-percent-rule.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CalculateHome 70% Rule Calculator</a> - useful reference for core MAO, custom rule, and offer-comparison patterns.</li>
              <li>- <a href="https://www.flipperforce.com/how-to-flip-houses-curriculum" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FlipperForce House Flipping Curriculum</a> - practical reference context for 70% rule thinking, deal analysis, and flip execution.</li>
              <li>- <a href="https://dealcheck.io/features/house-flipping-calculator/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DealCheck House Flipping Calculator</a> - useful reference for why holding, financing, and selling costs matter beyond MAO.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3>
            <p>Prioritize conservative ARV comps, reliable rehab budgets, hold-time realism, and resale friction when validating results. The 70% rule is only a first-pass pricing discipline; the actual deal quality lives inside the detailed cost assumptions.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace appraiser review, contractor bids, lender terms, tax advice, legal review, or a full fix-and-flip project model.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2>
        <FAQAccordion faqs={FAQS} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="70% Rule Calculator" />
      </div>
    </div>
  );
}
