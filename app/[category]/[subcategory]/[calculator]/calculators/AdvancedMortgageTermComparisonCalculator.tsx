'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
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
  TrendingUp,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

interface Inputs {
  homePrice: string;
  downPayment: string;
  rate30: string;
  rate15: string;
  propertyTaxAnnual: string;
  insuranceAnnual: string;
  hoaMonthly: string;
  pmiRate: string;
  annualIncome: string;
  investmentReturn: string;
  extraTo30: string;
}

interface LoanScenario {
  termYears: number;
  monthlyPI: number;
  totalInterest: number;
  totalPayments: number;
  monthlyEscrow: number;
  monthlyPMI: number;
  totalMonthlyHousing: number;
  payoffMonths: number;
  pmiEndMonth: number | null;
  housingRatio: number | null;
}

interface Result {
  loanAmount: number;
  downPaymentPercent: number;
  thirtyYear: LoanScenario;
  fifteenYear: LoanScenario;
  paymentDifference: number;
  interestSaved: number;
  yearsSaved: number;
  investedDifferenceValue: number;
  acceleratedThirtyPayoffMonths: number | null;
  acceleratedThirtyInterestSaved: number | null;
  notes: string[];
  warnings: string[];
}

const DEFAULTS: Inputs = {
  homePrice: '425000',
  downPayment: '85000',
  rate30: '6.75',
  rate15: '6.10',
  propertyTaxAnnual: '5100',
  insuranceAnnual: '1650',
  hoaMonthly: '0',
  pmiRate: '0.55',
  annualIncome: '120000',
  investmentReturn: '7',
  extraTo30: '250',
};

const FAQS: FAQItem[] = [
  {
    question: 'Is a 15-year mortgage always better because it saves interest?',
    answer:
      'Not always. A 15-year mortgage usually saves a large amount of interest, but it also raises the required monthly payment. The better choice depends on payment flexibility, reserves, and how aggressively you want to build equity.',
    category: 'Basics',
  },
  {
    question: 'Why compare the 30-year option with an extra monthly payment?',
    answer:
      'Because many borrowers want to know whether a 30-year loan gives them useful flexibility while still allowing faster payoff when cash flow is strong. The extra-payment scenario shows what that middle path can look like.',
    category: 'Strategy',
  },
  {
    question: 'Does this calculator include taxes, insurance, HOA, and PMI?',
    answer:
      'Yes. It compares principal and interest, then layers in escrow-style housing costs and PMI assumptions so the monthly comparison is more realistic than a principal-and-interest-only screen.',
    category: 'Inputs',
  },
  {
    question: 'When is PMI likely to matter most in this comparison?',
    answer:
      'PMI matters most when your down payment is below 20 percent. The shorter 15-year term often reaches the 80 percent loan-to-value threshold earlier, which can reduce the total time PMI stays in the payment.',
    category: 'PMI',
  },
];

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number, digits = 2) => `${value.toFixed(digits)}%`;

const monthlyPayment = (principal: number, annualRate: number, totalMonths: number) => {
  if (principal <= 0 || totalMonths <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / totalMonths;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

function futureValueOfMonthlyInvestments(monthlyContribution: number, annualReturn: number, months: number) {
  if (monthlyContribution <= 0 || months <= 0) return 0;
  const monthlyRate = annualReturn / 100 / 12;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function buildScenario(
  principal: number,
  annualRate: number,
  termYears: number,
  monthlyEscrow: number,
  monthlyPMI: number,
  annualIncome: number,
  extraPayment = 0,
  homePrice = 0
): LoanScenario {
  const totalMonths = termYears * 12;
  const basePayment = monthlyPayment(principal, annualRate, totalMonths);
  const monthlyPI = basePayment + extraPayment;
  const monthlyRate = annualRate / 100 / 12;
  let remainingBalance = principal;
  let totalInterest = 0;
  let month = 0;
  let pmiEndMonth: number | null = monthlyPMI > 0 ? null : 0;

  while (remainingBalance > 0.01 && month < totalMonths + 600) {
    month += 1;
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = Math.min(monthlyPI - interestPayment, remainingBalance);
    totalInterest += Math.max(interestPayment, 0);
    remainingBalance -= principalPayment;

    if (monthlyPMI > 0 && pmiEndMonth === null && homePrice > 0 && remainingBalance / homePrice <= 0.8) {
      pmiEndMonth = month;
    }
  }

  const housingRatio = annualIncome > 0 ? ((basePayment + monthlyEscrow + monthlyPMI) * 12) / annualIncome * 100 : null;

  return {
    termYears,
    monthlyPI: basePayment,
    totalInterest,
    totalPayments: principal + totalInterest,
    monthlyEscrow,
    monthlyPMI,
    totalMonthlyHousing: basePayment + monthlyEscrow + monthlyPMI,
    payoffMonths: month,
    pmiEndMonth,
    housingRatio,
  };
}

export default function AdvancedMortgageTermComparisonCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<Result | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (field: keyof Inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const resetCalculator = () => {
    setInputs(DEFAULTS);
    setResult(null);
    setShowModal(false);
  };

  const calculateComparison = () => {
    const homePrice = parse(inputs.homePrice);
    const downPayment = parse(inputs.downPayment);
    const rate30 = parse(inputs.rate30);
    const rate15 = parse(inputs.rate15);
    const propertyTaxAnnual = parse(inputs.propertyTaxAnnual);
    const insuranceAnnual = parse(inputs.insuranceAnnual);
    const hoaMonthly = parse(inputs.hoaMonthly);
    const pmiRate = parse(inputs.pmiRate);
    const annualIncome = parse(inputs.annualIncome);
    const investmentReturn = parse(inputs.investmentReturn);
    const extraTo30 = parse(inputs.extraTo30);

    if (homePrice <= 0 || downPayment < 0 || homePrice <= downPayment || rate30 < 0 || rate15 < 0) {
      alert('Please enter a valid home price, down payment, and interest rates.');
      return;
    }

    const loanAmount = homePrice - downPayment;
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const monthlyEscrow = propertyTaxAnnual / 12 + insuranceAnnual / 12 + hoaMonthly;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * (pmiRate / 100)) / 12 : 0;

    const thirtyYear = buildScenario(loanAmount, rate30, 30, monthlyEscrow, monthlyPMI, annualIncome, 0, homePrice);
    const fifteenYear = buildScenario(loanAmount, rate15, 15, monthlyEscrow, monthlyPMI, annualIncome, 0, homePrice);
    const acceleratedThirty = extraTo30 > 0 ? buildScenario(loanAmount, rate30, 30, monthlyEscrow, monthlyPMI, annualIncome, extraTo30, homePrice) : null;

    const paymentDifference = fifteenYear.totalMonthlyHousing - thirtyYear.totalMonthlyHousing;
    const interestSaved = Math.max(thirtyYear.totalInterest - fifteenYear.totalInterest, 0);
    const yearsSaved = (thirtyYear.payoffMonths - fifteenYear.payoffMonths) / 12;
    const investedDifferenceValue = futureValueOfMonthlyInvestments(Math.max(-paymentDifference, 0), investmentReturn, fifteenYear.payoffMonths);

    const notes = [
      'The 15-year option usually wins on interest cost and faster equity build, but it does so by demanding a higher monthly commitment.',
      'The 30-year option can preserve monthly flexibility and reserves, especially if you value optionality more than forced payoff speed.',
      'Comparing the extra-payment strategy helps show whether a 30-year loan could still support faster principal reduction without locking you into the 15-year payment every month.',
    ];

    const warnings: string[] = [];
    if (fifteenYear.housingRatio !== null && fifteenYear.housingRatio > 28) warnings.push('The 15-year housing payment looks heavy relative to the income entered.');
    if (downPaymentPercent < 20) warnings.push('A down payment below 20% may trigger PMI and raise the true monthly comparison.');
    if (paymentDifference > 750) warnings.push('The 15-year option creates a large monthly payment jump, so reserve planning matters.');
    if (acceleratedThirty && acceleratedThirty.payoffMonths <= fifteenYear.payoffMonths + 24) warnings.push('A 30-year loan plus extra payments may get close to 15-year payoff timing while preserving flexibility.');

    setResult({
      loanAmount,
      downPaymentPercent,
      thirtyYear,
      fifteenYear,
      paymentDifference,
      interestSaved,
      yearsSaved,
      investedDifferenceValue,
      acceleratedThirtyPayoffMonths: acceleratedThirty ? acceleratedThirty.payoffMonths : null,
      acceleratedThirtyInterestSaved: acceleratedThirty ? Math.max(thirtyYear.totalInterest - acceleratedThirty.totalInterest, 0) : null,
      notes,
      warnings,
    });

    setShowModal(true);
  };

  const quickStats = useMemo(
    () => [
      { label: 'Loan Amount', value: formatCurrency(Math.max(parse(inputs.homePrice) - parse(inputs.downPayment), 0)) },
      { label: '30-Year Rate', value: formatPercent(parse(inputs.rate30), 2) },
      { label: '15-Year Rate', value: formatPercent(parse(inputs.rate15), 2) },
      { label: 'Down Payment', value: formatPercent((parse(inputs.downPayment) / Math.max(parse(inputs.homePrice), 1)) * 100, 1) },
    ],
    [inputs]
  );

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">15 vs 30 Year Mortgage Comparison Calculator</h2>
            <p className="text-sm text-muted-foreground mt-1">Compare the monthly cost, interest burden, PMI timing, and payoff speed of two classic mortgage terms in one place.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((item) => (
            <div key={item.label} className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">{item.label}</div><div className="text-lg font-semibold mt-1">{item.value}</div></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-foreground mb-2">Home Price ($)</label><input type="number" min="0" value={inputs.homePrice} onChange={(e) => handleInputChange('homePrice', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Down Payment ($)</label><input type="number" min="0" value={inputs.downPayment} onChange={(e) => handleInputChange('downPayment', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">30-Year Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.rate30} onChange={(e) => handleInputChange('rate30', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">15-Year Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.rate15} onChange={(e) => handleInputChange('rate15', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Annual Property Tax ($)</label><input type="number" min="0" value={inputs.propertyTaxAnnual} onChange={(e) => handleInputChange('propertyTaxAnnual', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Annual Insurance ($)</label><input type="number" min="0" value={inputs.insuranceAnnual} onChange={(e) => handleInputChange('insuranceAnnual', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">HOA per Month ($)</label><input type="number" min="0" value={inputs.hoaMonthly} onChange={(e) => handleInputChange('hoaMonthly', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">PMI Rate (%)</label><input type="number" min="0" step="0.01" value={inputs.pmiRate} onChange={(e) => handleInputChange('pmiRate', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Annual Income ($)</label><input type="number" min="0" value={inputs.annualIncome} onChange={(e) => handleInputChange('annualIncome', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Invested Difference Return (%)</label><input type="number" min="0" step="0.1" value={inputs.investmentReturn} onChange={(e) => handleInputChange('investmentReturn', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-2">Extra Monthly to 30-Year ($)</label><input type="number" min="0" value={inputs.extraTo30} onChange={(e) => handleInputChange('extraTo30', e.target.value)} className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground" /></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={calculateComparison} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Calculator className="h-4 w-4 mr-2" />Compare Mortgage Terms</button>
          <button onClick={resetCalculator} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium"><RefreshCw className="h-4 w-4 mr-2" />Reset Inputs</button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label="Mortgage term comparison results">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div><h3 className="text-xl font-bold text-foreground">Mortgage Term Comparison Results</h3><p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p></div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><div className="text-xs text-muted-foreground">Interest Saved with 15-Year</div><div className="text-3xl font-bold">{formatCurrency(result.interestSaved)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Monthly Payment Difference</div><div className="text-2xl font-semibold">{formatCurrency(result.paymentDifference)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Approximate Time Saved</div><div className="text-2xl font-semibold">{result.yearsSaved.toFixed(1)} years</div></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[result.thirtyYear, result.fifteenYear].map((scenario) => (
                  <div key={scenario.termYears} className="border rounded-xl p-5">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-primary" />{scenario.termYears}-Year Mortgage</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><div className="text-muted-foreground">Principal + Interest</div><div className="font-semibold mt-1">{formatCurrency(scenario.monthlyPI)}</div></div>
                      <div><div className="text-muted-foreground">Total Housing Cost</div><div className="font-semibold mt-1">{formatCurrency(scenario.totalMonthlyHousing)}</div></div>
                      <div><div className="text-muted-foreground">Total Interest</div><div className="font-semibold mt-1">{formatCurrency(scenario.totalInterest)}</div></div>
                      <div><div className="text-muted-foreground">Payoff Time</div><div className="font-semibold mt-1">{(scenario.payoffMonths / 12).toFixed(1)} years</div></div>
                      <div><div className="text-muted-foreground">PMI per Month</div><div className="font-semibold mt-1">{formatCurrency(scenario.monthlyPMI)}</div></div>
                      <div><div className="text-muted-foreground">Housing Ratio</div><div className="font-semibold mt-1">{scenario.housingRatio === null ? 'N/A' : formatPercent(scenario.housingRatio, 1)}</div></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Future Value of Investing the Monthly Difference</div><div className="text-xl font-bold mt-1">{formatCurrency(result.investedDifferenceValue)}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">30-Year Extra Payment Payoff</div><div className="text-xl font-bold mt-1">{result.acceleratedThirtyPayoffMonths ? `${(result.acceleratedThirtyPayoffMonths / 12).toFixed(1)} years` : 'Not used'}</div></div>
                <div className="border rounded-xl p-4"><div className="text-xs text-muted-foreground">Interest Saved by Extra-Paying the 30-Year</div><div className="text-xl font-bold mt-1">{formatCurrency(result.acceleratedThirtyInterestSaved ?? 0)}</div></div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />What This Run Tells You</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.notes.map((item, index) => <li key={index}>- {item}</li>)}</ul></div>
                <div className="border rounded-xl p-5"><h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Risk Flags</h4><ul className="space-y-2 text-sm text-muted-foreground">{result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major warnings were triggered by the current assumptions, but lender-specific underwriting still matters.</li>}</ul></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" />About This Calculator</h2>
        <p className="text-base text-foreground leading-relaxed mb-4">This calculator is built for one of the most important mortgage decisions most buyers make: whether to prioritize lower required payments with a 30-year term or faster equity build with a 15-year term.</p>
        <p className="text-base text-foreground leading-relaxed mb-4">Basic comparison tools often stop at monthly principal and interest. This version goes further by layering in taxes, insurance, HOA, PMI, housing-ratio context, and an optional extra-payment strategy for the 30-year loan.</p>
        <p className="text-base text-foreground leading-relaxed mb-6">That makes the comparison more useful in the real world, where the best mortgage term is rarely just about the lowest lifetime interest cost. It is about flexibility, reserves, risk tolerance, and how you want cash flow to work for you over time.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4">Side-by-side 15-year and 30-year payment comparison</div>
          <div className="border rounded-xl p-4">Escrow-aware monthly housing cost instead of PI-only math</div>
          <div className="border rounded-xl p-4">PMI timing and housing-ratio context for more realistic screening</div>
          <div className="border rounded-xl p-4">Extra-payment and investing-the-difference strategy overlays</div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />How to Use This Free Online 15 vs 30 Year Mortgage Comparison Calculator</h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2"><Route className="h-5 w-5" />Step-by-Step Guide</h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">1. Enter the home price and down payment so the comparison starts from the actual loan amount you would finance.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">2. Use separate 30-year and 15-year interest rates if your quotes differ, because term-specific pricing often changes the comparison meaningfully.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">3. Add taxes, insurance, HOA, and PMI assumptions so the monthly payment comparison reflects actual housing cost instead of principal and interest alone.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">4. Use the popup dashboard to compare required payment, interest cost, payoff speed, and the middle-ground strategy of a 30-year loan with extra monthly payments.</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Your Results Dashboard (Popup Only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Monthly principal-and-interest and total housing payment for both loan terms</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Lifetime interest comparison and payoff-speed difference</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">PMI and housing-ratio context so the payment comparison stays practical</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Extra-payment and invest-the-difference strategy insights for decision support</div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2"><Info className="h-5 w-5" />Why Use This Calculator?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-200">
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">See whether the lower required payment of a 30-year loan is worth the added interest cost.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Understand how much faster the 15-year term builds equity and eliminates debt.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Test whether a 30-year mortgage plus optional extra payments might fit your cash-flow style better.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Keep lifestyle flexibility, reserves, and affordability visible instead of chasing interest savings blindly.</div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2"><Zap className="h-5 w-5" />Mortgage Term Comparison Advanced Features</h3>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
              <p>This version is meant to function like a real mortgage-term planning tool, not just a payment shortcut.</p>
              <ul className="space-y-2">
                <li>- Separate term-specific rates for the 15-year and 30-year loan.</li>
                <li>- Full monthly housing cost view including tax, insurance, HOA, and PMI assumptions.</li>
                <li>- Housing-ratio context using your income to show the payment burden more clearly.</li>
                <li>- Optional 30-year extra-payment strategy so you can compare flexibility versus forced payoff speed.</li>
                <li>- Invest-the-difference estimate to illustrate the opportunity-cost side of the decision.</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/40 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Mortgage Decision Playbook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="border rounded-lg p-4 bg-background">Choose the 15-year path when the higher payment still fits comfortably and rapid equity build matters more than flexibility.</div>
              <div className="border rounded-lg p-4 bg-background">Lean toward the 30-year path when liquidity, reserve strength, career variability, or optionality matters more than forced amortization.</div>
              <div className="border rounded-lg p-4 bg-background">Use the extra-payment scenario if you want the ability to prepay aggressively without being locked into the 15-year minimum every month.</div>
              <div className="border rounded-lg p-4 bg-background">Review the invested-difference output if you are comparing debt payoff speed against alternative long-term capital allocation.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-primary" />Understanding Mortgage Term Planning</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 mb-3">A 15-year mortgage compresses the repayment timeline, which usually raises the monthly payment but dramatically reduces total interest and accelerates equity growth.</p>
            <p className="text-blue-800 dark:text-blue-200">A 30-year mortgage stretches repayment over a longer schedule, which usually lowers the required payment and improves monthly flexibility, but it keeps debt in place longer and often costs much more in interest over the life of the loan.</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5" />Where the 15-Year Option Usually Wins</h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>- Lower lifetime interest paid</li>
              <li>- Faster principal reduction and earlier equity growth</li>
              <li>- Quicker payoff horizon and earlier debt freedom</li>
              <li>- Often a slightly lower interest rate than the 30-year alternative</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2"><Wallet className="h-5 w-5" />Where the 30-Year Option Usually Wins</h3>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li>- Lower required payment and more monthly breathing room</li>
              <li>- Easier reserve building and lower payment stress during uneven income periods</li>
              <li>- More optionality if you want to prepay some months but not all months</li>
              <li>- Potential room to invest the payment difference elsewhere, if that fits your plan and risk tolerance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Quick Reference: Mortgage Term Benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b"><th className="text-left py-3 px-4 font-semibold text-foreground">Planning Area</th><th className="text-left py-3 px-4 font-semibold text-foreground">Common Benchmark</th><th className="text-left py-3 px-4 font-semibold text-foreground">Why It Matters</th></tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">Down payment target</td><td className="py-3 px-4">20%+</td><td className="py-3 px-4 text-muted-foreground">Often avoids PMI and improves the long-term comparison.</td></tr>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">Housing ratio comfort zone</td><td className="py-3 px-4">~28% or lower</td><td className="py-3 px-4 text-muted-foreground">Helps keep the required mortgage payment from crowding out the rest of the budget.</td></tr>
              <tr className="border-b hover:bg-muted/50"><td className="py-3 px-4 font-medium">PMI trigger area</td><td className="py-3 px-4">Below 20% down</td><td className="py-3 px-4 text-muted-foreground">PMI can raise the real payment and change how attractive each term looks.</td></tr>
              <tr className="hover:bg-muted/50"><td className="py-3 px-4 font-medium">30-year extra-payment strategy</td><td className="py-3 px-4">Varies by borrower</td><td className="py-3 px-4 text-muted-foreground">Works best when you value optionality but still want a credible faster-payoff path.</td></tr>
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
              <li>- <a href="https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: How do mortgage lenders calculate monthly payments?</a> - official context for amortized principal-and-interest calculations.</li>
              <li>- <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-to-value-ratio-and-how-does-it-relate-to-my-costs-en-121/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: What is a loan-to-value ratio?</a> - useful for down payment and PMI context.</li>
              <li>- <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: What is private mortgage insurance?</a> - official PMI background for low-down-payment scenarios.</li>
              <li>- <a href="https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: When can I remove PMI from my loan?</a> - official guidance for PMI timing assumptions.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Market and educational sources</h3>
            <ul className="space-y-1">
              <li>- <a href="https://myhome.freddiemac.com/resources/calculators/15-or-30-year-term" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Freddie Mac: 15-Year vs. 30-Year Term Mortgage Calculator</a> - public comparison tool used for feature research.</li>
              <li>- <a href="https://myhome.freddiemac.com/buying/mortgage-rates" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Freddie Mac: Mortgage Rates and Affordability</a> - term-rate context and payment sensitivity examples.</li>
              <li>- <a href="https://www.consumerfinance.gov/owning-a-home/explore-rates/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CFPB: Explore Interest Rates</a> - lender quote and rate-comparison context.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-primary" />Research focus for this calculator</h3>
            <p>Prioritize payment burden, PMI exposure, reserve flexibility, and opportunity cost. Those are usually the four areas that decide whether the 15-year or 30-year path is actually better for a specific borrower.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational screening and planning. It does not replace lender Loan Estimates, underwriting decisions, tax advice, or personal financial planning.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" />Frequently Asked Questions</h2>
        <FAQAccordion faqs={FAQS} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="15 vs 30 Year Mortgage Comparison Calculator" />
      </div>
    </div>
  );
}
