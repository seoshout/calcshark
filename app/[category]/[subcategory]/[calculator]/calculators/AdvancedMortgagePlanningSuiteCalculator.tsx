'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  Home,
  Info,
  Leaf,
  MessageSquare,
  RefreshCw,
  Route,
  Shield,
  Target,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

export type MortgagePlanningVariant =
  | 'mortgage-affordability'
  | 'down-payment'
  | 'pmi'
  | 'mortgage-points'
  | 'closing-cost';

interface Props { variant: MortgagePlanningVariant; }
interface Inputs {
  homePrice: string;
  downPayment: string;
  interestRate: string;
  loanTermYears: string;
  annualIncome: string;
  monthlyDebts: string;
  monthlyBudget: string;
  propertyTaxRate: string;
  insuranceAnnual: string;
  hoaMonthly: string;
  pmiRate: string;
  pointsPurchased: string;
  rateReductionPerPoint: string;
  closingCostPercent: string;
}
interface ResultMetric { label: string; value: number; currency?: boolean; suffix?: string; }
interface Result { primaryLabel: string; primaryValue: number; primaryCurrency?: boolean; metrics: ResultMetric[]; notes: string[]; warnings: string[]; }
interface QuickRow { category: string; range: string; notes: string; }
interface Config {
  title: string;
  subtitle: string;
  reviewName: string;
  focus: string;
  researchFocus: string;
  quickRows: QuickRow[];
  faqs: FAQItem[];
}

const CONFIG: Record<MortgagePlanningVariant, Config> = {
  'mortgage-affordability': {
    title: 'Mortgage Affordability Calculator',
    subtitle: 'Estimate a workable home budget using income, debts, and real housing-cost assumptions',
    reviewName: 'Mortgage Affordability Calculator',
    focus: 'max home price and payment comfort',
    researchFocus: 'income, debts, taxes, insurance, PMI, and payment burden',
    quickRows: [
      { category: 'Front-end housing ratio', range: 'Around 28%', notes: 'A common affordability benchmark for housing cost relative to gross income.' },
      { category: 'Back-end debt ratio', range: 'Around 36% to 43%', notes: 'Helps show whether total debt load stays manageable once housing is added.' },
      { category: 'PMI trigger zone', range: 'Below 20% down', notes: 'Low down payments can meaningfully raise the real monthly cost.' },
      { category: 'Reserve mindset', range: 'Varies', notes: 'Affordability is stronger when cash reserves survive after closing.' },
    ],
    faqs: [
      { question: 'Why does affordability change when I add taxes and insurance?', answer: 'Because the real housing payment is usually larger than principal and interest alone. Taxes, insurance, HOA fees, and PMI can materially change what feels affordable month to month.', category: 'Basics' },
      { question: 'Should I use lender maximums as my personal target?', answer: 'Not necessarily. Many buyers choose a payment below what a lender may technically allow so they can protect savings, flexibility, and long-term lifestyle goals.', category: 'Strategy' },
      { question: 'Why include monthly debts?', answer: 'Because existing debt obligations reduce how much room you have for housing. That is why debt-to-income ratios remain a core mortgage-screening concept.', category: 'Inputs' },
    ],
  },
  'down-payment': {
    title: 'Down Payment Calculator',
    subtitle: 'See how your down payment changes loan size, PMI exposure, and monthly housing cost',
    reviewName: 'Down Payment Calculator',
    focus: 'down payment percent and payment impact',
    researchFocus: 'loan amount, PMI avoidance, payment reduction, and cash-to-close planning',
    quickRows: [
      { category: 'Low-down-payment programs', range: '3% to 5%', notes: 'Can reduce upfront cash needs, but may increase PMI or other loan costs.' },
      { category: 'Mid-range down payment', range: '10%', notes: 'Often meaningfully lowers the loan amount while still preserving more liquidity than 20% down.' },
      { category: 'PMI avoidance target', range: '20%', notes: 'A common milestone because it often removes private mortgage insurance.' },
      { category: 'Cash-to-close planning', range: 'Varies', notes: 'The down payment is only one piece of the upfront cash picture.' },
    ],
    faqs: [
      { question: 'Is 20% down always the best move?', answer: 'Not always. Putting 20% down can reduce PMI and lower the payment, but some buyers prefer a smaller down payment if it preserves emergency reserves or avoids over-concentrating cash in the home.', category: 'Basics' },
      { question: 'Why does this calculator show both down payment and total cash to close thinking?', answer: 'Because buyers often focus on the down payment alone and forget that closing costs and reserves still matter. A strong plan needs the full upfront cash picture.', category: 'Planning' },
      { question: 'Can a higher down payment improve more than the monthly payment?', answer: 'Yes. It can lower PMI exposure, reduce loan-to-value ratio, and sometimes improve pricing or approval strength.', category: 'Strategy' },
    ],
  },
  pmi: {
    title: 'Private Mortgage Insurance (PMI) Calculator',
    subtitle: 'Estimate monthly PMI cost, annual PMI burden, and how long PMI may stay in your payment',
    reviewName: 'Private Mortgage Insurance (PMI) Calculator',
    focus: 'PMI cost and cancellation timing',
    researchFocus: 'loan-to-value, monthly PMI, annual PMI, and amortization-based PMI removal timing',
    quickRows: [
      { category: 'Typical PMI range', range: 'Varies by profile', notes: 'PMI often depends on down payment, credit, and lender-specific pricing.' },
      { category: 'PMI trigger area', range: 'Below 20% down', notes: 'PMI is commonly required when the initial loan-to-value ratio is above 80%.' },
      { category: 'Cancellation milestone', range: 'Around 80% LTV', notes: 'Borrowers often focus on when the loan balance reaches this area.' },
      { category: 'Affordability impact', range: 'Monthly', notes: 'PMI can materially change the real cost of a low-down-payment mortgage.' },
    ],
    faqs: [
      { question: 'What does PMI actually do?', answer: 'PMI protects the lender, not the borrower. It is commonly required on conventional loans with low down payments and increases the borrower’s monthly housing cost.', category: 'Basics' },
      { question: 'Can PMI go away later?', answer: 'Often yes. Many borrowers track the point at which the loan balance reaches roughly 80% of the home value or original purchase price, subject to lender and loan rules.', category: 'Removal' },
      { question: 'Why compare PMI to the extra cash needed for 20% down?', answer: 'Because buyers often want to know whether paying PMI for a while is worth preserving liquidity or buying sooner.', category: 'Strategy' },
    ],
  },
  'mortgage-points': {
    title: 'Mortgage Points Calculator',
    subtitle: 'Compare upfront point costs with estimated monthly savings and break-even timing',
    reviewName: 'Mortgage Points Calculator',
    focus: 'points cost versus monthly savings',
    researchFocus: 'points purchased, rate reduction, upfront cost, and break-even horizon',
    quickRows: [
      { category: 'One point', range: '1% of loan amount', notes: 'A standard reference point when evaluating mortgage discount points.' },
      { category: 'Break-even focus', range: 'Months', notes: 'Points tend to make more sense when you expect to keep the loan long enough to recover the upfront cost.' },
      { category: 'Rate reduction per point', range: 'Varies', notes: 'Actual pricing depends on market conditions and lender-specific offers.' },
      { category: 'Refinance risk', range: 'Case by case', notes: 'Future refinancing or an early move can shorten the time you have to recover point costs.' },
    ],
    faqs: [
      { question: 'What are mortgage points?', answer: 'Mortgage points are upfront fees paid to reduce the interest rate. One point typically equals 1% of the loan amount, though pricing and rate reduction vary by lender and market.', category: 'Basics' },
      { question: 'How do I know if points are worth it?', answer: 'The key screen is usually break-even timing. If the monthly savings recover the upfront cost within the time you expect to keep the loan, points may be worth deeper review.', category: 'Strategy' },
      { question: 'Can points still be a bad choice even if they lower the payment?', answer: 'Yes. If you may refinance, move, or prepay the loan early, you may not keep the mortgage long enough to fully recover the upfront cost.', category: 'Risk' },
    ],
  },
  'closing-cost': {
    title: 'Closing Cost Calculator',
    subtitle: 'Estimate settlement costs, lender fees, prepaids, and total cash-to-close needs',
    reviewName: 'Closing Cost Calculator',
    focus: 'settlement cost and cash-to-close planning',
    researchFocus: 'origination fees, title and settlement costs, prepaids, and upfront cash needs',
    quickRows: [
      { category: 'Common closing-cost range', range: 'Around 2% to 5%', notes: 'Actual closing costs vary by lender, loan type, state, and prepaid items.' },
      { category: 'Prepaids and escrows', range: 'Variable', notes: 'Taxes and insurance reserves can materially change cash-to-close needs.' },
      { category: 'Cash to close', range: 'Down payment + closing costs', notes: 'A strong plan accounts for both, not just one or the other.' },
      { category: 'Seller credits', range: 'Case by case', notes: 'Negotiated credits can offset some settlement costs in certain transactions.' },
    ],
    faqs: [
      { question: 'Why can closing costs differ so much between loans?', answer: 'Closing costs depend on the loan type, lender pricing, location, prepaid items, discount points, and the services required to complete the transaction.', category: 'Basics' },
      { question: 'What is the difference between closing costs and down payment?', answer: 'The down payment reduces the amount you borrow, while closing costs cover lender fees, title work, settlement services, and prepaid items. Buyers need to plan for both.', category: 'Planning' },
      { question: 'Why are prepaids important?', answer: 'Prepaids such as homeowners insurance and property tax escrows can make cash-to-close meaningfully higher than the lender-fee subtotal alone.', category: 'Inputs' },
    ],
  },
};

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
const formatMetric = (metric: ResultMetric) => metric.currency ? usd(metric.value) : metric.suffix ? `${metric.value.toFixed(2)}${metric.suffix}` : pct(metric.value);

function buildResult(variant: MortgagePlanningVariant, inputs: Inputs): Result {
  const homePrice = parse(inputs.homePrice);
  const downPayment = parse(inputs.downPayment);
  const interestRate = parse(inputs.interestRate);
  const loanTermYears = Math.max(parse(inputs.loanTermYears), 1);
  const annualIncome = parse(inputs.annualIncome);
  const monthlyDebts = parse(inputs.monthlyDebts);
  const monthlyBudget = parse(inputs.monthlyBudget);
  const propertyTaxRate = parse(inputs.propertyTaxRate);
  const insuranceAnnual = parse(inputs.insuranceAnnual);
  const hoaMonthly = parse(inputs.hoaMonthly);
  const pmiRate = parse(inputs.pmiRate);
  const pointsPurchased = parse(inputs.pointsPurchased);
  const rateReductionPerPoint = parse(inputs.rateReductionPerPoint);
  const closingCostPercent = parse(inputs.closingCostPercent);

  const enteredLoanAmount = Math.max(homePrice - downPayment, 0);
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const propertyTaxMonthly = homePrice * (propertyTaxRate / 100) / 12;
  const monthlyPMI = downPaymentPercent < 20 ? (enteredLoanAmount * (pmiRate / 100)) / 12 : 0;
  const monthlyPI = payment(enteredLoanAmount, interestRate, loanTermYears * 12);
  const totalHousing = monthlyPI + propertyTaxMonthly + insuranceAnnual / 12 + hoaMonthly + monthlyPMI;

  if (variant === 'mortgage-affordability') {
    const frontEndBudget = annualIncome > 0 ? (annualIncome / 12) * 0.28 : 0;
    const backEndBudget = annualIncome > 0 ? Math.max((annualIncome / 12) * 0.36 - monthlyDebts, 0) : 0;
    const paymentBudget = monthlyBudget > 0 ? Math.min(monthlyBudget, frontEndBudget || monthlyBudget, backEndBudget || monthlyBudget) : Math.min(frontEndBudget || Number.MAX_VALUE, backEndBudget || Number.MAX_VALUE);
    const usableBudget = Number.isFinite(paymentBudget) ? paymentBudget : 0;
    const nonPiMonthly = insuranceAnnual / 12 + hoaMonthly + propertyTaxMonthly + monthlyPMI;
    const availablePi = Math.max(usableBudget - nonPiMonthly, 0);
    const affordableLoan = interestRate === 0 ? availablePi * loanTermYears * 12 : (() => {
      const r = interestRate / 100 / 12;
      const months = loanTermYears * 12;
      const factor = Math.pow(1 + r, months);
      return availablePi * (factor - 1) / (r * factor);
    })();
    const maxHomePrice = affordableLoan + downPayment;
    const notes = [
      'This run blends income-based affordability guardrails with real monthly housing-cost assumptions instead of relying on principal-and-interest alone.',
      'A payment that is technically lender-allowable can still feel too tight if reserves, lifestyle spending, or income variability matter to you.',
      'Use the max-home-price output as a screening guide, not a signal that you must spend that much.'
    ];
    const warnings: string[] = [];
    if (usableBudget <= 0) warnings.push('The entered budget and debt assumptions leave little room for a workable housing payment.');
    if (downPaymentPercent < 20) warnings.push('Low down payment assumptions may understate real payment pressure if PMI or higher rates apply.');
    return { primaryLabel: 'Estimated Affordable Home Price', primaryValue: maxHomePrice, primaryCurrency: true, metrics: [
      { label: 'Estimated Affordable Loan', value: affordableLoan, currency: true },
      { label: 'Monthly Housing Budget', value: usableBudget, currency: true },
      { label: 'Front-End Ratio Budget', value: frontEndBudget, currency: true },
      { label: 'Back-End Ratio Budget', value: backEndBudget, currency: true }
    ], notes, warnings };
  }

  if (variant === 'down-payment') {
    const targetTwentyPercent = homePrice * 0.2;
    const targetTenPercent = homePrice * 0.1;
    const targetFivePercent = homePrice * 0.05;
    const closingCosts = homePrice * (closingCostPercent / 100);
    const totalCashNeed = downPayment + closingCosts;
    const notes = [
      'The down payment changes far more than the loan amount. It can affect PMI, cash to close, lender comfort, and your post-closing reserve position.',
      'This run helps show the tradeoff between lowering the payment and preserving liquidity for emergencies or move-in costs.',
      'Use the comparison targets to judge whether your current down payment is a deliberate strategy or just a placeholder.'
    ];
    const warnings: string[] = [];
    if (downPaymentPercent < 20) warnings.push('A down payment below 20% may lead to PMI and a meaningfully higher monthly payment.');
    if (totalCashNeed > downPayment * 1.2) warnings.push('Closing costs materially increase the total upfront cash needed beyond the down payment alone.');
    return { primaryLabel: 'Down Payment Percent', primaryValue: downPaymentPercent, metrics: [
      { label: 'Loan Amount', value: enteredLoanAmount, currency: true },
      { label: 'Monthly Housing Cost', value: totalHousing, currency: true },
      { label: '20% Down Target', value: targetTwentyPercent, currency: true },
      { label: '10% Down Target', value: targetTenPercent, currency: true },
      { label: '5% Down Target', value: targetFivePercent, currency: true },
      { label: 'Cash to Close Estimate', value: totalCashNeed, currency: true }
    ], notes, warnings };
  }

  if (variant === 'pmi') {
    let balance = enteredLoanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPrincipalAndInterest = payment(enteredLoanAmount, interestRate, loanTermYears * 12);
    let pmiMonths: number | null = downPaymentPercent < 20 ? null : 0;
    for (let month = 1; month <= loanTermYears * 12; month += 1) {
      const interestPortion = monthlyRate === 0 ? 0 : balance * monthlyRate;
      const principalPortion = Math.max(monthlyPrincipalAndInterest - interestPortion, 0);
      balance = Math.max(balance - principalPortion, 0);
      if (pmiMonths === null && homePrice > 0 && balance / homePrice <= 0.8) {
        pmiMonths = month;
        break;
      }
    }
    const annualPMI = monthlyPMI * 12;
    const totalPmiUntil80 = pmiMonths && pmiMonths > 0 ? monthlyPMI * pmiMonths : 0;
    const notes = [
      'PMI is often the hidden cost that changes a low-down-payment mortgage from manageable to uncomfortable.',
      'This run helps show both the ongoing monthly cost and the possible time horizon before PMI may no longer be needed.',
      'Use it to compare whether buying sooner with PMI still fits your plan better than waiting to increase the down payment.'
    ];
    const warnings: string[] = [];
    if (downPaymentPercent >= 20) warnings.push('With a 20%+ down payment, PMI may not apply under many conventional scenarios.');
    if ((pmiMonths ?? 0) > 84) warnings.push('PMI may remain in the payment for a long stretch under the current assumptions.');
    return { primaryLabel: 'Estimated Monthly PMI', primaryValue: monthlyPMI, primaryCurrency: true, metrics: [
      { label: 'Annual PMI', value: annualPMI, currency: true },
      { label: 'Estimated PMI Months', value: pmiMonths ?? 0, suffix: ' mo' },
      { label: 'Estimated PMI to 80% LTV', value: totalPmiUntil80, currency: true },
      { label: 'Initial LTV', value: 100 - downPaymentPercent }
    ], notes, warnings };
  }

  if (variant === 'mortgage-points') {
    const pointCost = enteredLoanAmount * (pointsPurchased / 100);
    const reducedRate = Math.max(interestRate - pointsPurchased * rateReductionPerPoint, 0);
    const lowerPayment = payment(enteredLoanAmount, reducedRate, loanTermYears * 12);
    const monthlySavings = Math.max(monthlyPI - lowerPayment, 0);
    const breakEvenMonths = monthlySavings > 0 ? pointCost / monthlySavings : 0;
    const notes = [
      'Discount points can make sense when you expect to keep the loan long enough to recover the upfront cost through payment savings.',
      'The key screen is usually break-even timing, not just whether the new payment is lower.',
      'Use this result to compare points against other cash uses like reserves, a larger down payment, or keeping liquidity.'
    ];
    const warnings: string[] = [];
    if (breakEvenMonths > 84) warnings.push('The break-even timeline is long, so a move or refinance could keep the points from paying off.');
    if (monthlySavings <= 0) warnings.push('The points scenario does not create a meaningful monthly savings under the current assumptions.');
    return { primaryLabel: 'Estimated Point Cost', primaryValue: pointCost, primaryCurrency: true, metrics: [
      { label: 'New Rate After Points', value: reducedRate },
      { label: 'Monthly Savings', value: monthlySavings, currency: true },
      { label: 'Break-Even Timeline', value: breakEvenMonths, suffix: ' mo' },
      { label: 'Payment After Points', value: lowerPayment, currency: true }
    ], notes, warnings };
  }

  const lenderFees = homePrice * (closingCostPercent / 100) * 0.45;
  const titleSettlement = homePrice * (closingCostPercent / 100) * 0.3;
  const prepaids = homePrice * (closingCostPercent / 100) * 0.25;
  const totalClosingCosts = lenderFees + titleSettlement + prepaids;
  const cashToClose = totalClosingCosts + downPayment;
  const notes = [
    'Closing costs are usually a collection of lender fees, title and settlement charges, and prepaid items rather than a single line item.',
    'This run helps translate a percentage estimate into a more concrete cash-to-close picture.',
    'Use it to pressure-test whether the mortgage plan still leaves adequate reserves after the transaction is complete.'
  ];
  const warnings: string[] = [];
  if (closingCostPercent < 2 || closingCostPercent > 5) warnings.push('The closing-cost percentage entered is outside the common rough-estimate range for many purchase scenarios.');
  return { primaryLabel: 'Estimated Closing Costs', primaryValue: totalClosingCosts, primaryCurrency: true, metrics: [
    { label: 'Estimated Lender Fees', value: lenderFees, currency: true },
    { label: 'Title + Settlement', value: titleSettlement, currency: true },
    { label: 'Prepaids + Escrows', value: prepaids, currency: true },
    { label: 'Estimated Cash to Close', value: cashToClose, currency: true }
  ], notes, warnings };
}

export default function AdvancedMortgagePlanningSuiteCalculator({ variant }: Props) {
  const config = CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>({
    homePrice: '420000', downPayment: '84000', interestRate: '6.5', loanTermYears: '30', annualIncome: '120000', monthlyDebts: '850', monthlyBudget: '3200', propertyTaxRate: '1.2', insuranceAnnual: '1650', hoaMonthly: '0', pmiRate: '0.55', pointsPurchased: '1', rateReductionPerPoint: '0.25', closingCostPercent: '3'
  });
  const [result, setResult] = useState<Result | null>(null);
  const [showModal, setShowModal] = useState(false);

  const quickStats = useMemo(() => {
    const homePrice = parse(inputs.homePrice);
    const downPayment = parse(inputs.downPayment);
    return [
      { label: 'Home Price', value: usd(homePrice) },
      { label: 'Down Payment', value: usd(downPayment) },
      { label: 'Loan Amount', value: usd(Math.max(homePrice - downPayment, 0)) },
      { label: 'Rate', value: pct(parse(inputs.interestRate), 2) },
    ];
  }, [inputs]);

  const onChange = (field: keyof Inputs, value: string) => setInputs((prev) => ({ ...prev, [field]: value }));
  const onReset = () => { setResult(null); setShowModal(false); setInputs({ homePrice: '420000', downPayment: '84000', interestRate: '6.5', loanTermYears: '30', annualIncome: '120000', monthlyDebts: '850', monthlyBudget: '3200', propertyTaxRate: '1.2', insuranceAnnual: '1650', hoaMonthly: '0', pmiRate: '0.55', pointsPurchased: '1', rateReductionPerPoint: '0.25', closingCostPercent: '3' }); };
  const onCalculate = () => { if (parse(inputs.homePrice) <= 0) { alert('Please enter a valid home price greater than zero.'); return; } setResult(buildResult(variant, inputs)); setShowModal(true); };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
          <div><h2 className="text-2xl font-bold text-foreground">{config.title}</h2><p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((item) => <div key={item.label} className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">{item.label}</div><div className="text-lg font-semibold mt-1">{item.value}</div></div>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">Home Price ($)</label><input type="number" min="0" value={inputs.homePrice} onChange={(e) => onChange('homePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Down Payment ($)</label><input type="number" min="0" value={inputs.downPayment} onChange={(e) => onChange('downPayment', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Interest Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.interestRate} onChange={(e) => onChange('interestRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Loan Term (years)</label><input type="number" min="1" value={inputs.loanTermYears} onChange={(e) => onChange('loanTermYears', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Annual Income ($)</label><input type="number" min="0" value={inputs.annualIncome} onChange={(e) => onChange('annualIncome', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Debts ($)</label><input type="number" min="0" value={inputs.monthlyDebts} onChange={(e) => onChange('monthlyDebts', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Monthly Housing Budget ($)</label><input type="number" min="0" value={inputs.monthlyBudget} onChange={(e) => onChange('monthlyBudget', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Property Tax Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.propertyTaxRate} onChange={(e) => onChange('propertyTaxRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Insurance per Year ($)</label><input type="number" min="0" value={inputs.insuranceAnnual} onChange={(e) => onChange('insuranceAnnual', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">HOA per Month ($)</label><input type="number" min="0" value={inputs.hoaMonthly} onChange={(e) => onChange('hoaMonthly', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">PMI Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.pmiRate} onChange={(e) => onChange('pmiRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Points Purchased</label><input type="number" min="0" step="0.25" value={inputs.pointsPurchased} onChange={(e) => onChange('pointsPurchased', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Rate Reduction per Point (%)</label><input type="number" min="0" step="0.01" value={inputs.rateReductionPerPoint} onChange={(e) => onChange('rateReductionPerPoint', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Closing Cost Estimate (%)</label><input type="number" min="0" step="0.1" value={inputs.closingCostPercent} onChange={(e) => onChange('closingCostPercent', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Analyze {config.title}</button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label={`${config.title} results`}><div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl"><div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background"><div><h3 className="text-xl font-bold text-foreground">{config.title} Results Dashboard</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div><button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-6"><div className="border rounded-xl p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><div className="text-xs text-muted-foreground">{result.primaryLabel}</div><div className="text-3xl font-bold">{result.primaryCurrency ? usd(result.primaryValue) : pct(result.primaryValue)}</div></div>{result.metrics.slice(0, 2).map((metric) => <div key={metric.label}><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-2xl font-semibold">{formatMetric(metric)}</div></div>)}</div></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{result.metrics.map((metric) => <div key={metric.label} className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">{metric.label}</div><div className="text-xl font-bold mt-1">{formatMetric(metric)}</div></div>)}</div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul></div><div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Planning Flags</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but lender-specific pricing and closing details still matter.</li>}</ul></div></div></div></div></div>}
      <div className="bg-background border rounded-xl p-6 shadow-sm"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" />About This Calculator</h2><p className="text-base text-foreground leading-relaxed mb-4">This tool is designed to make one specific part of mortgage planning clearer: {config.focus}. Instead of stopping at a headline number, it connects the decision to the broader cash-flow and loan-structure context that usually matters in the real world.</p><p className="text-base text-foreground leading-relaxed mb-4">That matters because mortgage planning is rarely just about one line item. Upfront cash, monthly payment burden, PMI, lender fees, and the tradeoff between flexibility and cost often move together.</p><p className="text-base text-foreground leading-relaxed mb-6">This version keeps those relationships visible so the output works as a planning screen, not just a formula answer.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground"><div className="border rounded-xl p-4">Variant-specific outputs matched to the actual mortgage planning question</div><div className="border rounded-xl p-4">Cash-flow-aware results instead of isolated one-number math</div><div className="border rounded-xl p-4">Popup dashboard with practical notes and planning flags</div><div className="border rounded-xl p-4">Long-form educational content in the same approved page rhythm</div></div></div>

      <div className="bg-background border rounded-xl p-6 shadow-sm"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />How to Use This Free Online {config.title}</h2><div className="space-y-6"><div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"><h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><Route className="h-5 w-5" />Step-by-Step Guide</h3><div className="space-y-4 text-sm text-blue-800 dark:text-blue-200"><div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">1. Start with the property and financing assumptions that anchor the mortgage decision: home price, down payment, interest rate, and term.</div><div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">2. Add the cost layers that often change the practical outcome, such as taxes, insurance, HOA, PMI, or closing-cost assumptions.</div><div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">3. Use the variant-specific inputs like debts, points, or payment budget only where they sharpen the planning question you are trying to answer.</div><div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">4. Review the popup dashboard as a planning screen rather than a final commitment. The right next step is usually lender quotes, Loan Estimates, or deeper underwriting.</div></div></div><div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"><h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Your Results Dashboard (Popup Only)</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground"><div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Primary planning output matched to the mortgage question you are screening</div><div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supporting metrics that show cash impact, payment effect, or timing impact more clearly</div><div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Notes that explain what the current assumptions actually mean in practical terms</div><div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Warnings that highlight thin affordability, long break-even periods, or hidden cost pressure</div></div></div><div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800"><h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Info className="h-5 w-5" />Why Use This Calculator?</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-200"><div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Translate common mortgage planning questions into measurable, decision-ready outputs.</div><div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Make hidden costs more visible before they surprise you during the loan process.</div><div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Compare strategy choices like paying points, increasing the down payment, or accepting PMI.</div><div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Keep affordability and cash-to-close context in the same screen as the headline result.</div></div></div><div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800"><h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2"><Zap className="h-5 w-5" />{config.title} Advanced Features</h3><div className="space-y-3 text-sm text-amber-800 dark:text-amber-200"><p>This version is designed to behave like a real planning tool, not just a quick mortgage widget.</p><ul className="space-y-2"><li>- Shared mortgage-cost inputs so the math stays grounded in realistic housing assumptions.</li><li>- Variant-specific logic for affordability, PMI, points, closing cost, or down-payment decisions.</li><li>- Dashboard outputs designed to support the next decision, not just produce a raw number.</li><li>- A content framework that explains tradeoffs, not just formulas.</li></ul></div></div><div className="bg-muted/40 p-6 rounded-lg border"><h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Planning Decision Playbook</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground"><div className="border rounded-lg p-4 bg-background">If a result only works with very thin reserves, the mortgage plan may still be fragile even if it looks acceptable on paper.</div><div className="border rounded-lg p-4 bg-background">If PMI or closing costs are much larger than expected, review whether a bigger down payment or a delayed purchase changes the outcome materially.</div><div className="border rounded-lg p-4 bg-background">If points take too long to break even, preserving cash may be the more flexible choice.</div><div className="border rounded-lg p-4 bg-background">If affordability is tight even before move-in costs, the safer plan may be lowering the target price rather than stretching the mortgage structure.</div></div></div></div></div>

      <div className="bg-background border rounded-xl p-6 shadow-sm"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Understanding {config.title}</h2><div className="space-y-6 text-sm text-muted-foreground"><div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"><p className="text-blue-800 dark:text-blue-200 mb-3">Mortgage planning decisions are connected. Changing one variable such as the down payment, rate, or closing-cost estimate can affect monthly payment, cash reserves, PMI exposure, and long-term flexibility all at once.</p><p className="text-blue-800 dark:text-blue-200">That is why this calculator keeps the wider housing-cost picture visible instead of isolating a single formula result from the rest of the mortgage decision.</p></div><div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"><h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><Home className="h-5 w-5" />What Strong Mortgage Planning Usually Looks Like</h3><ul className="space-y-2 text-green-800 dark:text-green-200"><li>- The housing payment fits not only the lender screen, but also the borrower’s reserves and lifestyle goals.</li><li>- Upfront cash planning accounts for both down payment and closing costs, not just one of them.</li><li>- PMI, points, or fee decisions are made deliberately instead of by accident.</li><li>- The mortgage strategy still looks workable under real-world housing costs, not a stripped-down PI-only payment.</li></ul></div><div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800"><h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><Wallet className="h-5 w-5" />Common Mortgage Planning Mistakes</h3><ul className="space-y-2 text-orange-800 dark:text-orange-200"><li>- Focusing only on the loan amount while ignoring taxes, insurance, HOA, and PMI.</li><li>- Treating a lender maximum as a personal comfort target.</li><li>- Underestimating the total cash needed to close.</li><li>- Paying points or choosing a low down payment without comparing the long-term tradeoffs clearly.</li></ul></div></div></div>

      <div className="bg-background border rounded-xl p-6 shadow-sm"><h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: Mortgage Planning Benchmarks</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-3 px-4 font-semibold text-foreground">Planning Area</th><th className="text-left py-3 px-4 font-semibold text-foreground">Common Range</th><th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th></tr></thead><tbody>{config.quickRows.map((row) => <tr key={row.category} className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">{row.category}</td><td className="py-3 px-4">{row.range}</td><td className="py-3 px-4 text-muted-foreground">{row.notes}</td></tr>)}</tbody></table></div></div>

      <div className="bg-background border rounded-xl p-6 sm:p-8"><h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-primary" />Scientific References & Resources</h2><div className="space-y-3 text-sm text-muted-foreground"><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Official sources</h3><ul className="space-y-1"><li>- <a href="https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: How do mortgage lenders calculate monthly payments?</a> - official context for amortized mortgage payment structure.</li><li>- <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-to-value-ratio-and-how-does-it-relate-to-my-costs-en-121/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: Loan-to-value ratio basics</a> - useful for down payment and PMI planning.</li><li>- <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: What is private mortgage insurance?</a> - official PMI context for conventional low-down-payment scenarios.</li><li>- <a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: Loan Estimate overview</a> - useful for understanding how lenders present closing costs and rate terms.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3><ul className="space-y-1"><li>- <a href="https://myhome.freddiemac.com/resources/calculators/how-much-can-you-afford" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Freddie Mac: How Much Can You Afford?</a> - affordability feature research and ratio context.</li><li>- <a href="https://myhome.freddiemac.com/resources/calculators/how-much-down-payment" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Freddie Mac: Down Payment Calculator</a> - public planning workflow used for feature comparison.</li><li>- <a href="https://myhome.freddiemac.com/resources/calculators/pay-points" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Freddie Mac: Pay Points Calculator</a> - public break-even and points feature reference.</li></ul></div><div className="p-4 bg-muted rounded-lg"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3><p>Prioritize {config.researchFocus}. Those are the assumptions that usually decide whether a mortgage plan feels workable after closing, not just before it.</p></div></div><p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace Loan Estimates, lender underwriting, tax advice, or legal advice.</p></div>

      <div className="bg-background border rounded-xl p-6"><h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2><FAQAccordion faqs={config.faqs} showTitle={false} /></div>
      <div className="bg-background border rounded-xl p-6"><CalculatorReview calculatorName={config.reviewName} /></div>
    </div>
  );
}
