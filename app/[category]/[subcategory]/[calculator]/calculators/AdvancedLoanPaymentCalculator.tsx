'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target,
  Activity, TrendingUp, User, DollarSign, CreditCard, Shield,
  BarChart3, PieChart, LineChart, Calendar, Award, Clock,
  Percent, TrendingDown, Building, Coins, Zap, Download,
  Heart, Users, Star, Settings, FileText, Plus, Minus,
  PlayCircle, PauseCircle, RotateCcw, HelpCircle, BookOpen,
  ArrowUpCircle, ArrowDownCircle, Banknote, Receipt, Wallet,
  AlertTriangle, Scale, Brain, CheckSquare,
  XCircle, ArrowRight, ArrowRightCircle, PlusCircle,
  ChevronDown, ChevronUp, Eye, EyeOff, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

// Advanced interfaces for comprehensive loan calculations
interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
  totalLoanCost: number;
  paymentBreakdown: PaymentBreakdown;
  amortizationSchedule: AmortizationEntry[];
  extraPaymentAnalysis: ExtraPaymentAnalysis;
  comparisonScenarios: LoanComparison[];
  affordabilityAnalysis: AffordabilityAnalysis;
  recommendations: LoanRecommendation[];
  taxAnalysis: TaxAnalysis;
  refinancingAnalysis: RefinancingAnalysis;
  balloonPaymentAnalysis?: BalloonAnalysis;
  interestOnlyAnalysis?: InterestOnlyAnalysis;
}

interface PaymentBreakdown {
  principal: number;
  interest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
}

interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: string;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  endingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  remainingYears: number;
}

interface ExtraPaymentAnalysis {
  monthlyExtra: ExtraPaymentScenario;
  yearlyExtra: ExtraPaymentScenario;
  oneTimeExtra: ExtraPaymentScenario;
  biweeklyPayments: BiweeklyAnalysis;
}

interface ExtraPaymentScenario {
  extraAmount: number;
  newTerm: number;
  interestSavings: number;
  timeSavings: number;
  newMonthlyPayment: number;
  payoffDate: string;
}

interface BiweeklyAnalysis {
  biweeklyPayment: number;
  paymentsPerYear: number;
  newTerm: number;
  interestSavings: number;
  timeSavings: number;
  totalPayments: number;
}

interface LoanComparison {
  scenario: string;
  term: number;
  rate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  savings?: number;
  recommendation: string;
}

interface AffordabilityAnalysis {
  recommendedIncome: number;
  debtToIncomeRatio: number;
  paymentToIncomeRatio: number;
  affordabilityScore: number;
  maxAffordableLoan: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  recommendations: string[];
}

interface LoanRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  potentialSavings?: number;
}

interface TaxAnalysis {
  annualInterest: number;
  taxDeductibleInterest: number;
  estimatedTaxSavings: number;
  effectiveRate: number;
  afterTaxCost: number;
  applicableScenarios: string[];
}

interface RefinancingAnalysis {
  currentLoanBalance: number;
  newLoanAmount: number;
  refinancingCosts: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenPoint: number;
  totalSavingsOverLife: number;
  recommendation: string;
  netPresentValue: number;
}

interface BalloonAnalysis {
  regularPayments: number;
  balloonAmount: number;
  balloonDate: string;
  totalInterestRegular: number;
  balloonRefinanceOptions: RefinanceOption[];
  riskAssessment: string;
}

interface RefinanceOption {
  option: string;
  newRate: number;
  newTerm: number;
  newPayment: number;
  totalCost: number;
  comparison: string;
}

interface InterestOnlyAnalysis {
  interestOnlyPeriod: number;
  interestOnlyPayment: number;
  principalPaymentStart: number;
  principalPaymentAmount: number;
  totalInterestPaid: number;
  equityBuilding: EquityProgression[];
  riskFactors: string[];
}

interface EquityProgression {
  year: number;
  principalPaid: number;
  remainingBalance: number;
  equityBuilt: number;
  equityPercentage: number;
}

// Loan calculation utility functions
const calculateLoanPayment = (principal: number, rate: number, term: number): number => {
  if (rate === 0) return principal / term / 12;
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

const calculateAmortizationSchedule = (
  principal: number, 
  rate: number, 
  term: number, 
  startDate: Date,
  extraMonthly: number = 0,
  extraYearly: number = 0,
  oneTimeExtra: { amount: number; month: number } | null = null
): AmortizationEntry[] => {
  const monthlyRate = rate / 100 / 12;
  const basePayment = calculateLoanPayment(principal, rate, term);
  let remainingBalance = principal;
  const schedule: AmortizationEntry[] = [];
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let paymentNumber = 1;
  
  while (remainingBalance > 0.01) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + paymentNumber - 1);
    
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = basePayment - interestPayment;
    
    // Add extra payments
    let extraPayment = extraMonthly;
    if (paymentNumber % 12 === 0) extraPayment += extraYearly;
    if (oneTimeExtra && paymentNumber === oneTimeExtra.month) {
      extraPayment += oneTimeExtra.amount;
    }
    
    // Ensure we don't overpay
    if (principalPayment + extraPayment > remainingBalance) {
      extraPayment = remainingBalance - principalPayment;
      principalPayment = remainingBalance;
    }
    
    const totalPayment = Math.min(basePayment + extraPayment, remainingBalance + interestPayment);
    const beginningBalance = remainingBalance;
    
    remainingBalance -= (principalPayment + extraPayment);
    cumulativeInterest += interestPayment;
    cumulativePrincipal += (principalPayment + extraPayment);
    
    schedule.push({
      paymentNumber,
      paymentDate: currentDate.toLocaleDateString(),
      beginningBalance,
      payment: totalPayment,
      principal: principalPayment,
      interest: interestPayment,
      extraPayment,
      endingBalance: Math.max(0, remainingBalance),
      cumulativeInterest,
      cumulativePrincipal,
      remainingYears: Math.max(0, (term * 12 - paymentNumber) / 12)
    });
    
    paymentNumber++;
    
    // Prevent infinite loops
    if (paymentNumber > term * 12 + 120) break;
  }
  
  return schedule;
};

const calculateBiweeklyPayments = (principal: number, rate: number, term: number): BiweeklyAnalysis => {
  const monthlyPayment = calculateLoanPayment(principal, rate, term);
  const biweeklyPayment = monthlyPayment / 2;
  const biweeklyRate = rate / 100 / 26;
  
  // Calculate actual payoff with bi-weekly payments
  let balance = principal;
  let payments = 0;
  let totalInterest = 0;
  
  while (balance > 0.01 && payments < term * 26) {
    const interestPayment = balance * biweeklyRate;
    const principalPayment = Math.min(biweeklyPayment - interestPayment, balance);
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    payments++;
  }
  
  const newTermYears = payments / 26;
  const monthlyTotalInterest = calculateLoanPayment(principal, rate, term) * term * 12 - principal;
  
  return {
    biweeklyPayment,
    paymentsPerYear: 26,
    newTerm: newTermYears,
    interestSavings: monthlyTotalInterest - totalInterest,
    timeSavings: term - newTermYears,
    totalPayments: payments
  };
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCurrencyPrecise = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(3)}%`;
};

export default function AdvancedLoanPaymentCalculator() {
  // Core loan parameters
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loanType, setLoanType] = useState<'standard' | 'interest-only' | 'balloon'>('standard');
  
  // Advanced parameters
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState('');
  const [extraYearlyPayment, setExtraYearlyPayment] = useState('');
  const [oneTimeExtraAmount, setOneTimeExtraAmount] = useState('');
  const [oneTimeExtraMonth, setOneTimeExtraMonth] = useState('');
  
  // Balloon and Interest-Only parameters
  const [balloonAmount, setBalloonAmount] = useState('');
  const [balloonTerm, setBalloonTerm] = useState('');
  const [interestOnlyPeriod, setInterestOnlyPeriod] = useState('');
  
  // Affordability parameters
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [creditScore, setCreditScore] = useState('');
  
  // Refinancing parameters
  const [currentBalance, setCurrentBalance] = useState('');
  const [newRate, setNewRate] = useState('');
  const [refinanceCosts, setRefinanceCosts] = useState('');
  const [taxBracket, setTaxBracket] = useState('');
  
  // UI state
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showAffordabilityInputs, setShowAffordabilityInputs] = useState(false);
  const [showRefinancingInputs, setShowRefinancingInputs] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationView, setAmortizationView] = useState<'monthly' | 'yearly'>('monthly');
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'summary' | 'schedule' | 'analysis' | 'comparison'>('summary');
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input formatting helpers
  const formatNumberInput = (value: string) => {
    // Remove non-numeric characters except decimal points
    const cleaned = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  };

  const handleAmountChange = (value: string, setter: (value: string) => void) => {
    const formatted = formatNumberInput(value);
    setter(formatted);
  };

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Core validation
    if (!loanAmount || isNaN(parseFloat(loanAmount)) || parseFloat(loanAmount) <= 0) {
      newErrors.loanAmount = 'Please enter a valid loan amount';
    }
    if (!interestRate || isNaN(parseFloat(interestRate)) || parseFloat(interestRate) < 0) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    }
    if (!loanTerm || isNaN(parseFloat(loanTerm)) || parseFloat(loanTerm) <= 0) {
      newErrors.loanTerm = 'Please enter a valid loan term';
    }
    
    // Advanced validation
    if (extraMonthlyPayment && (isNaN(parseFloat(extraMonthlyPayment)) || parseFloat(extraMonthlyPayment) < 0)) {
      newErrors.extraMonthlyPayment = 'Please enter a valid extra payment amount';
    }
    if (oneTimeExtraAmount && (isNaN(parseFloat(oneTimeExtraAmount)) || parseFloat(oneTimeExtraAmount) < 0)) {
      newErrors.oneTimeExtraAmount = 'Please enter a valid one-time payment amount';
    }
    
    // Loan type specific validation
    if (loanType === 'balloon') {
      if (!balloonAmount || isNaN(parseFloat(balloonAmount)) || parseFloat(balloonAmount) <= 0) {
        newErrors.balloonAmount = 'Please enter a valid balloon amount';
      }
      if (!balloonTerm || isNaN(parseFloat(balloonTerm)) || parseFloat(balloonTerm) <= 0) {
        newErrors.balloonTerm = 'Please enter a valid balloon term';
      }
    }
    
    if (loanType === 'interest-only') {
      if (!interestOnlyPeriod || isNaN(parseFloat(interestOnlyPeriod)) || parseFloat(interestOnlyPeriod) <= 0) {
        newErrors.interestOnlyPeriod = 'Please enter a valid interest-only period';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [loanAmount, interestRate, loanTerm, loanType, extraMonthlyPayment, oneTimeExtraAmount, balloonAmount, balloonTerm, interestOnlyPeriod]);

  const performCalculation = useCallback(() => {
    if (!validateInputs()) return;
    
    setIsCalculating(true);
    
    // Parse inputs
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm);
    const extraMonthly = parseFloat(extraMonthlyPayment) || 0;
    const extraYearly = parseFloat(extraYearlyPayment) || 0;
    const oneTimeExtra = oneTimeExtraAmount && oneTimeExtraMonth ? {
      amount: parseFloat(oneTimeExtraAmount),
      month: parseInt(oneTimeExtraMonth)
    } : null;
    
    try {
      // Calculate base loan payment
      const monthlyPayment = calculateLoanPayment(principal, rate, term);
      const totalPayments = monthlyPayment * term * 12;
      const totalInterest = totalPayments - principal;
      
      // Generate amortization schedule
      const schedule = calculateAmortizationSchedule(
        principal, 
        rate, 
        term, 
        new Date(startDate),
        extraMonthly,
        extraYearly,
        oneTimeExtra
      );
      
      // Calculate payment breakdown
      const paymentBreakdown: PaymentBreakdown = {
        principal: monthlyPayment * (principal / totalPayments),
        interest: monthlyPayment * (totalInterest / totalPayments),
        totalPayment: monthlyPayment,
        principalPercentage: (principal / totalPayments) * 100,
        interestPercentage: (totalInterest / totalPayments) * 100
      };
      
      // Calculate extra payment analysis
      const biweeklyAnalysis = calculateBiweeklyPayments(principal, rate, term);
      
      const scheduleInterest = schedule.reduce((sum, entry) => sum + entry.interest, 0);
      const actualTerm = schedule.length / 12;
      
      const extraPaymentAnalysis: ExtraPaymentAnalysis = {
        monthlyExtra: {
          extraAmount: extraMonthly,
          newTerm: actualTerm,
          interestSavings: totalInterest - scheduleInterest,
          timeSavings: term - actualTerm,
          newMonthlyPayment: monthlyPayment + extraMonthly,
          payoffDate: schedule[schedule.length - 1]?.paymentDate || ''
        },
        yearlyExtra: {
          extraAmount: extraYearly,
          newTerm: term,
          interestSavings: 0,
          timeSavings: 0,
          newMonthlyPayment: monthlyPayment,
          payoffDate: ''
        },
        oneTimeExtra: {
          extraAmount: oneTimeExtra?.amount || 0,
          newTerm: term,
          interestSavings: 0,
          timeSavings: 0,
          newMonthlyPayment: monthlyPayment,
          payoffDate: ''
        },
        biweeklyPayments: biweeklyAnalysis
      };
      
      // Calculate comparison scenarios
      const comparisonScenarios: LoanComparison[] = [
        {
          scenario: 'Current Loan',
          term,
          rate,
          monthlyPayment,
          totalInterest,
          totalCost: totalPayments,
          recommendation: 'Base scenario for comparison'
        }
      ];
      
      // Add 15-year vs 30-year comparison if applicable
      if (term === 30) {
        const fifteenYearPayment = calculateLoanPayment(principal, rate, 15);
        const fifteenYearTotal = fifteenYearPayment * 15 * 12;
        const fifteenYearInterest = fifteenYearTotal - principal;
        
        comparisonScenarios.push({
          scenario: '15-Year Term',
          term: 15,
          rate,
          monthlyPayment: fifteenYearPayment,
          totalInterest: fifteenYearInterest,
          totalCost: fifteenYearTotal,
          savings: totalInterest - fifteenYearInterest,
          recommendation: 'Save on interest but higher monthly payments'
        });
      }
      
      // Calculate affordability analysis
      const income = parseFloat(monthlyIncome) || 0;
      const debts = parseFloat(monthlyDebts) || 0;
      const debtToIncome = income > 0 ? ((debts + monthlyPayment) / income) * 100 : 0;
      const paymentToIncome = income > 0 ? (monthlyPayment / income) * 100 : 0;
      
      const affordabilityAnalysis: AffordabilityAnalysis = {
        recommendedIncome: monthlyPayment * 3, // 33% rule
        debtToIncomeRatio: debtToIncome,
        paymentToIncomeRatio: paymentToIncome,
        affordabilityScore: Math.max(0, 100 - debtToIncome - paymentToIncome),
        maxAffordableLoan: income * 0.28 * term * 12 / (1 + rate/100),
        riskLevel: debtToIncome > 43 ? 'very-high' : debtToIncome > 36 ? 'high' : debtToIncome > 28 ? 'moderate' : 'low',
        recommendations: []
      };
      
      // Generate recommendations
      const recommendations: LoanRecommendation[] = [];
      
      if (extraMonthly === 0) {
        recommendations.push({
          category: 'Payment Strategy',
          title: 'Consider Extra Monthly Payments',
          description: `Adding just $${Math.round(monthlyPayment * 0.1)} monthly could save ${formatCurrency(biweeklyAnalysis.interestSavings)} in interest.`,
          priority: 'high',
          potentialSavings: biweeklyAnalysis.interestSavings
        });
      }
      
      if (biweeklyAnalysis.interestSavings > 1000) {
        recommendations.push({
          category: 'Payment Frequency',
          title: 'Switch to Bi-weekly Payments',
          description: `Bi-weekly payments could save ${formatCurrency(biweeklyAnalysis.interestSavings)} and pay off your loan ${biweeklyAnalysis.timeSavings.toFixed(1)} years early.`,
          priority: 'high',
          potentialSavings: biweeklyAnalysis.interestSavings
        });
      }
      
      if (debtToIncome > 36) {
        recommendations.push({
          category: 'Affordability',
          title: 'Consider a Longer Term',
          description: 'Your debt-to-income ratio is high. A longer loan term could reduce monthly payments.',
          priority: 'medium'
        });
      }
      
      // Calculate tax analysis
      const annualInterest = (schedule.slice(0, 12).reduce((sum, entry) => sum + entry.interest, 0));
      const taxBracketRate = parseFloat(taxBracket) || 0;
      const taxAnalysis: TaxAnalysis = {
        annualInterest,
        taxDeductibleInterest: annualInterest, // Simplified - would depend on loan type
        estimatedTaxSavings: annualInterest * (taxBracketRate / 100),
        effectiveRate: rate * (1 - taxBracketRate / 100),
        afterTaxCost: totalPayments - (totalInterest * taxBracketRate / 100),
        applicableScenarios: ['Mortgage', 'Business Loan', 'Investment Property']
      };
      
      // Calculate refinancing analysis
      const currentBalanceAmount = parseFloat(currentBalance) || principal;
      const newRateValue = parseFloat(newRate) || rate;
      const refinanceCostValue = parseFloat(refinanceCosts) || 0;
      
      const newMonthlyPayment = calculateLoanPayment(currentBalanceAmount, newRateValue, term);
      const monthlySavings = monthlyPayment - newMonthlyPayment;
      const breakEvenMonths = refinanceCostValue / Math.max(monthlySavings, 1);
      
      const refinancingAnalysis: RefinancingAnalysis = {
        currentLoanBalance: currentBalanceAmount,
        newLoanAmount: currentBalanceAmount + refinanceCostValue,
        refinancingCosts: refinanceCostValue,
        newMonthlyPayment,
        monthlySavings,
        breakEvenPoint: breakEvenMonths,
        totalSavingsOverLife: monthlySavings * term * 12 - refinanceCostValue,
        recommendation: breakEvenMonths < 24 ? 'Refinancing recommended' : 'Consider keeping current loan',
        netPresentValue: 0 // Would need discount rate for proper calculation
      };
      
      const loanResult: LoanResult = {
        monthlyPayment,
        totalInterest,
        totalPayments: schedule.length,
        totalLoanCost: totalPayments,
        paymentBreakdown,
        amortizationSchedule: schedule,
        extraPaymentAnalysis,
        comparisonScenarios,
        affordabilityAnalysis,
        recommendations,
        taxAnalysis,
        refinancingAnalysis
      };
      
      setResult(loanResult);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [validateInputs, loanAmount, interestRate, loanTerm, startDate, extraMonthlyPayment, extraYearlyPayment, oneTimeExtraAmount, oneTimeExtraMonth, monthlyIncome, monthlyDebts, currentBalance, newRate, refinanceCosts, taxBracket]);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loanAmount && interestRate && loanTerm) {
        performCalculation();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [loanAmount, interestRate, loanTerm, performCalculation]);

  const resetCalculator = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setExtraMonthlyPayment('');
    setExtraYearlyPayment('');
    setOneTimeExtraAmount('');
    setOneTimeExtraMonth('');
    setBalloonAmount('');
    setBalloonTerm('');
    setInterestOnlyPeriod('');
    setMonthlyIncome('');
    setMonthlyDebts('');
    setCreditScore('');
    setCurrentBalance('');
    setNewRate('');
    setRefinanceCosts('');
    setTaxBracket('');
    setResult(null);
    setErrors({});
    setShowAdvancedOptions(false);
    setShowAffordabilityInputs(false);
    setShowRefinancingInputs(false);
    setShowAmortization(false);
  };

  const downloadAmortizationSchedule = () => {
    if (!result?.amortizationSchedule) return;
    
    const csvContent = [
      ['Payment #', 'Date', 'Payment', 'Principal', 'Interest', 'Extra Payment', 'Balance'],
      ...result.amortizationSchedule.map(entry => [
        entry.paymentNumber,
        entry.paymentDate,
        entry.payment.toFixed(2),
        entry.principal.toFixed(2),
        entry.interest.toFixed(2),
        entry.extraPayment.toFixed(2),
        entry.endingBalance.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-amortization-schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Loan Payment Calculator
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Calculate loan payments, compare scenarios, and optimize your borrowing strategy
        </p>
      </div>

      <div className="space-y-6 lg:space-y-8">
        {/* Input Panel */}
        <div className="xl:col-span-2">
          <div className="bg-background border rounded-xl p-3 md:p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  Loan Details
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={loanAmount}
                      onChange={(e) => handleAmountChange(e.target.value, setLoanAmount)}
                      placeholder="100,000"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg text-lg font-medium transition-colors',
                        'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        errors.loanAmount
                          ? 'border-destructive bg-destructive/5'
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                    />
                  </div>
                  {errors.loanAmount && (
                    <p className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.loanAmount}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={interestRate}
                        onChange={(e) => handleAmountChange(e.target.value, setInterestRate)}
                        placeholder="6.5"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border rounded-lg font-medium transition-colors',
                          'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          errors.interestRate
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-background hover:border-primary/50'
                        )}
                      />
                    </div>
                    {errors.interestRate && (
                      <p className="text-destructive text-sm mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.interestRate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Term (Years)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={loanTerm}
                        onChange={(e) => handleAmountChange(e.target.value, setLoanTerm)}
                        placeholder="30"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border rounded-lg font-medium transition-colors',
                          'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          errors.loanTerm
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-background hover:border-primary/50'
                        )}
                      />
                    </div>
                    {errors.loanTerm && (
                      <p className="text-destructive text-sm mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.loanTerm}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Advanced Options Toggle */}
              <div className="border-t border-border pt-6">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium text-foreground flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Options
                  </span>
                  {showAdvancedOptions ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>

                {showAdvancedOptions && (
                  <div className="mt-4 space-y-4">
                    {/* Loan Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Loan Type
                      </label>
                      <select
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value as 'standard' | 'interest-only' | 'balloon')}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="standard">Standard Amortizing</option>
                        <option value="interest-only">Interest-Only</option>
                        <option value="balloon">Balloon Payment</option>
                      </select>
                    </div>

                    {/* Extra Payments */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Extra Monthly Payment
                      </label>
                      <div className="relative">
                        <Plus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={extraMonthlyPayment}
                          onChange={(e) => handleAmountChange(e.target.value, setExtraMonthlyPayment)}
                          placeholder="Additional monthly payment"
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Affordability Analysis Toggle */}
                    <div>
                      <button
                        onClick={() => setShowAffordabilityInputs(!showAffordabilityInputs)}
                        className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <span className="font-medium text-blue-900 dark:text-blue-100 flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Affordability Analysis
                        </span>
                        {showAffordabilityInputs ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>

                      {showAffordabilityInputs && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Monthly Income
                            </label>
                            <input
                              type="text"
                              value={monthlyIncome}
                              onChange={(e) => handleAmountChange(e.target.value, setMonthlyIncome)}
                              placeholder="Gross income"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Other Debts
                            </label>
                            <input
                              type="text"
                              value={monthlyDebts}
                              onChange={(e) => handleAmountChange(e.target.value, setMonthlyDebts)}
                              placeholder="Monthly debts"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Refinancing Analysis Toggle */}
                    <div>
                      <button
                        onClick={() => setShowRefinancingInputs(!showRefinancingInputs)}
                        className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <span className="font-medium text-green-900 dark:text-green-100 flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refinancing Analysis
                        </span>
                        {showRefinancingInputs ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>

                      {showRefinancingInputs && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Current Balance
                            </label>
                            <input
                              type="text"
                              value={currentBalance}
                              onChange={(e) => handleAmountChange(e.target.value, setCurrentBalance)}
                              placeholder="Remaining balance"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                New Rate (%)
                              </label>
                              <input
                                type="text"
                                value={newRate}
                                onChange={(e) => handleAmountChange(e.target.value, setNewRate)}
                                placeholder="New rate"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Closing Costs
                              </label>
                              <input
                                type="text"
                                value={refinanceCosts}
                                onChange={(e) => handleAmountChange(e.target.value, setRefinanceCosts)}
                                placeholder="Costs"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions moved below Advanced Options */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={performCalculation}
                    className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Payment
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-3">
          {result ? (
            <div className="space-y-6">
              {/* Key Results Summary */}
              <div className="bg-background border rounded-xl p-6">
                <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 text-primary mr-2" />
                  Payment Summary
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded">
                        MONTHLY
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                      {formatCurrencyPrecise(result.monthlyPayment)}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                      Monthly Payment
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <Percent className="h-5 w-5 text-orange-600" />
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-800/50 px-2 py-1 rounded">
                        TOTAL
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                      {formatCurrency(result.totalInterest)}
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-300">
                      Total Interest
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200 dark:border-green-800 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                      <Receipt className="h-5 w-5 text-green-600" />
                      <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-800/50 px-2 py-1 rounded">
                        LIFETIME
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                      {formatCurrency(result.totalLoanCost)}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">
                      Total Cost
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown Chart */}
                <div className="mt-6 bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <PieChart className="h-4 w-4 mr-2" />
                    Payment Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Principal</span>
                        <span className="font-medium text-sm">
                          {formatCurrencyPrecise(result.paymentBreakdown.principal)} 
                          ({result.paymentBreakdown.principalPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-1000"
                          style={{ width: `${result.paymentBreakdown.principalPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Interest</span>
                        <span className="font-medium text-sm">
                          {formatCurrencyPrecise(result.paymentBreakdown.interest)}
                          ({result.paymentBreakdown.interestPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-orange-500 rounded-full h-2 transition-all duration-1000"
                          style={{ width: `${result.paymentBreakdown.interestPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Navigation */}
              <div className="bg-background border rounded-xl">
                <div className="border-b border-border">
                  <div className="flex flex-wrap gap-1 p-1">
                    {[
                      { id: 'summary', label: 'Summary', icon: BarChart3 },
                      { id: 'analysis', label: 'Analysis', icon: TrendingUp },
                      { id: 'schedule', label: 'Schedule', icon: Calendar },
                      { id: 'comparison', label: 'Compare', icon: Scale }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveResultTab(id as any)}
                        className={cn(
                          'flex items-center px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                          activeResultTab === id
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* Summary Tab */}
                  {activeResultTab === 'summary' && (
                    <div className="space-y-6">
                      {/* Extra Payment Analysis */}
                      {(parseFloat(extraMonthlyPayment) > 0 || result.extraPaymentAnalysis.biweeklyPayments.interestSavings > 0) && (
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                            Payment Optimization
                          </h4>
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            {parseFloat(extraMonthlyPayment) > 0 && (
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                                  Extra Monthly Payments
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Interest Savings:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(result.extraPaymentAnalysis.monthlyExtra.interestSavings)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time Savings:</span>
                                    <span className="font-medium">{result.extraPaymentAnalysis.monthlyExtra.timeSavings.toFixed(1)} years</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                Bi-Weekly Payments
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Payment:</span>
                                  <span className="font-medium">{formatCurrency(result.extraPaymentAnalysis.biweeklyPayments.biweeklyPayment)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Interest Savings:</span>
                                  <span className="font-medium text-blue-600">{formatCurrency(result.extraPaymentAnalysis.biweeklyPayments.interestSavings)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Time Savings:</span>
                                  <span className="font-medium">{result.extraPaymentAnalysis.biweeklyPayments.timeSavings.toFixed(1)} years</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {result.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                            Recommendations
                          </h4>
                          
                          <div className="space-y-3">
                            {result.recommendations.slice(0, 3).map((rec, index) => (
                              <div 
                                key={index}
                                className={cn(
                                  "p-4 rounded-lg border",
                                  rec.priority === 'high' 
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                    : rec.priority === 'medium'
                                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-foreground mb-1">{rec.title}</h5>
                                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                                  </div>
                                  {rec.potentialSavings && (
                                    <div className="ml-4 text-right">
                                      <div className="text-sm font-semibold text-green-600">
                                        Save {formatCurrency(rec.potentialSavings)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analysis Tab */}
                  {activeResultTab === 'analysis' && (
                    <div className="space-y-6">
                      {/* Affordability Analysis */}
                      {parseFloat(monthlyIncome) > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Shield className="h-5 w-5 text-orange-600 mr-2" />
                            Affordability Analysis
                          </h4>
                          
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">Debt-to-Income Ratio</span>
                                  <span className={cn(
                                    "text-sm font-bold",
                                    result.affordabilityAnalysis.debtToIncomeRatio <= 28 ? "text-green-600" :
                                    result.affordabilityAnalysis.debtToIncomeRatio <= 36 ? "text-yellow-600" :
                                    result.affordabilityAnalysis.debtToIncomeRatio <= 43 ? "text-orange-600" : "text-red-600"
                                  )}>
                                    {result.affordabilityAnalysis.debtToIncomeRatio.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3">
                                  <div 
                                    className={cn(
                                      "rounded-full h-3 transition-all duration-1000",
                                      result.affordabilityAnalysis.debtToIncomeRatio <= 28 ? "bg-green-500" :
                                      result.affordabilityAnalysis.debtToIncomeRatio <= 36 ? "bg-yellow-500" :
                                      result.affordabilityAnalysis.debtToIncomeRatio <= 43 ? "bg-orange-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${Math.min(result.affordabilityAnalysis.debtToIncomeRatio, 100)}%` }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Risk Level:</span>
                                  <span className={cn(
                                    "font-medium capitalize",
                                    result.affordabilityAnalysis.riskLevel === 'low' ? "text-green-600" :
                                    result.affordabilityAnalysis.riskLevel === 'moderate' ? "text-yellow-600" :
                                    result.affordabilityAnalysis.riskLevel === 'high' ? "text-orange-600" : "text-red-600"
                                  )}>
                                    {result.affordabilityAnalysis.riskLevel.replace('-', ' ')}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Recommended Income:</span>
                                  <span className="font-medium">{formatCurrency(result.affordabilityAnalysis.recommendedIncome)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className={cn(
                              "p-4 rounded-lg border",
                              result.affordabilityAnalysis.riskLevel === 'low' 
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : result.affordabilityAnalysis.riskLevel === 'moderate'
                                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                                : result.affordabilityAnalysis.riskLevel === 'high'
                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                            )}>
                              <div className="flex items-start">
                                {result.affordabilityAnalysis.riskLevel === 'low' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                ) : result.affordabilityAnalysis.riskLevel === 'moderate' ? (
                                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                  <h5 className="font-semibold mb-1">
                                    {result.affordabilityAnalysis.riskLevel === 'low' ? 'Excellent Affordability' :
                                     result.affordabilityAnalysis.riskLevel === 'moderate' ? 'Moderate Risk' :
                                     result.affordabilityAnalysis.riskLevel === 'high' ? 'High Risk' : 'Very High Risk'}
                                  </h5>
                                  <p className="text-sm opacity-90">
                                    {result.affordabilityAnalysis.riskLevel === 'low' 
                                      ? 'This loan fits comfortably within recommended debt ratios.'
                                      : result.affordabilityAnalysis.riskLevel === 'moderate'
                                      ? 'This loan is manageable but leaves limited financial flexibility.'
                                      : result.affordabilityAnalysis.riskLevel === 'high'
                                      ? 'This loan may strain your budget. Consider alternatives.'
                                      : 'This loan significantly exceeds safe debt ratios.'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Refinancing Analysis */}
                      {showRefinancingInputs && currentBalance && newRate && (
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <RefreshCw className="h-5 w-5 text-primary mr-2" />
                            Refinancing Analysis
                          </h4>
                          
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h5 className="font-semibold text-foreground mb-4">Current vs. New Loan</h5>
                              <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-border">
                                  <span className="text-muted-foreground">Current Payment:</span>
                                  <span className="font-medium">{formatCurrencyPrecise(result.monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                  <span className="text-muted-foreground">New Payment:</span>
                                  <span className="font-medium">{formatCurrencyPrecise(result.refinancingAnalysis.newMonthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                  <span className="text-muted-foreground">Monthly Savings:</span>
                                  <span className={cn(
                                    "font-medium",
                                    result.refinancingAnalysis.monthlySavings > 0 ? "text-green-600" : "text-red-600"
                                  )}>
                                    {result.refinancingAnalysis.monthlySavings > 0 ? '+' : ''}{formatCurrencyPrecise(result.refinancingAnalysis.monthlySavings)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className={cn(
                              "p-4 rounded-lg border",
                              result.refinancingAnalysis.breakEvenPoint <= 24 
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : result.refinancingAnalysis.breakEvenPoint <= 60
                                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                            )}>
                              <h5 className="font-semibold mb-3 flex items-center">
                                {result.refinancingAnalysis.breakEvenPoint <= 24 ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                                )}
                                Break-Even Analysis
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Break-even point:</span>
                                  <span className="font-medium">{result.refinancingAnalysis.breakEvenPoint.toFixed(0)} months</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Total lifetime savings:</span>
                                  <span className={cn(
                                    "font-medium",
                                    result.refinancingAnalysis.totalSavingsOverLife > 0 ? "text-green-600" : "text-red-600"
                                  )}>
                                    {formatCurrency(Math.abs(result.refinancingAnalysis.totalSavingsOverLife))}
                                  </span>
                                </div>
                                <p className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded text-xs">
                                  <strong>Recommendation:</strong> {result.refinancingAnalysis.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schedule Tab */}
                  {activeResultTab === 'schedule' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-foreground flex items-center">
                          <LineChart className="h-5 w-5 text-primary mr-2" />
                          Amortization Schedule
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded-lg p-1">
                            <button
                              onClick={() => setAmortizationView('monthly')}
                              className={cn(
                                'px-3 py-1 text-sm rounded transition-colors',
                                amortizationView === 'monthly' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              Monthly
                            </button>
                            <button
                              onClick={() => setAmortizationView('yearly')}
                              className={cn(
                                'px-3 py-1 text-sm rounded transition-colors',
                                amortizationView === 'yearly' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'text-muted-foreground hover:text-foreground'
                              )}
                            >
                              Yearly
                            </button>
                          </div>
                          <button
                            onClick={downloadAmortizationSchedule}
                            className="flex items-center px-3 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export CSV
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                                {amortizationView === 'yearly' ? 'Year' : 'Payment #'}
                              </th>
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Payment</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Principal</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Interest</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(amortizationView === 'yearly' 
                              ? result.amortizationSchedule.filter((_, index) => (index + 1) % 12 === 0 || index === result.amortizationSchedule.length - 1)
                              : result.amortizationSchedule.slice(0, showAmortization ? undefined : 24)
                            ).map((entry, index) => (
                              <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-2 font-medium">
                                  {amortizationView === 'yearly' ? Math.ceil(entry.paymentNumber / 12) : entry.paymentNumber}
                                </td>
                                <td className="py-3 px-2">{entry.paymentDate}</td>
                                <td className="py-3 px-2 text-right font-mono">{formatCurrencyPrecise(entry.payment)}</td>
                                <td className="py-3 px-2 text-right font-mono text-green-600">{formatCurrencyPrecise(entry.principal)}</td>
                                <td className="py-3 px-2 text-right font-mono text-orange-600">{formatCurrencyPrecise(entry.interest)}</td>
                                <td className="py-3 px-2 text-right font-mono">{formatCurrency(entry.endingBalance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {!showAmortization && result.amortizationSchedule.length > 24 && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => setShowAmortization(true)}
                            className="px-6 py-3 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                          >
                            Show Full Schedule ({result.amortizationSchedule.length} payments)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comparison Tab */}
                  {activeResultTab === 'comparison' && (
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Scale className="h-5 w-5 text-primary mr-2" />
                        Scenario Comparison
                      </h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Scenario</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Term</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Rate</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Monthly Payment</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total Interest</th>
                              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Savings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.comparisonScenarios.map((scenario, index) => (
                              <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-2 font-medium">{scenario.scenario}</td>
                                <td className="py-3 px-2 text-right">{scenario.term} years</td>
                                <td className="py-3 px-2 text-right">{scenario.rate}%</td>
                                <td className="py-3 px-2 text-right font-mono">{formatCurrencyPrecise(scenario.monthlyPayment)}</td>
                                <td className="py-3 px-2 text-right font-mono">{formatCurrency(scenario.totalInterest)}</td>
                                <td className="py-3 px-2 text-right font-mono">
                                  {scenario.savings ? (
                                    <span className="text-green-600">
                                      {formatCurrency(scenario.savings)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Comparison Insights
                        </h5>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Shorter terms save significant interest but increase monthly payments</li>
                          <li>• Consider your cash flow and other financial goals when choosing</li>
                          <li>• Extra payments can achieve similar savings with more flexibility</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-background border rounded-xl p-12 text-center">
              <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Calculate</h3>
              <p className="text-muted-foreground mb-6">
                Enter your loan details to see comprehensive payment analysis, 
                amortization schedules, and optimization recommendations.
              </p>
              <div className="text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                  <div>
                    <div className="font-medium mb-1">✨ Core Features:</div>
                    <ul className="space-y-1">
                      <li>• Payment breakdowns</li>
                      <li>• Amortization schedules</li>
                      <li>• Extra payment analysis</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-1">🚀 Advanced Tools:</div>
                    <ul className="space-y-1">
                      <li>• Affordability assessment</li>
                      <li>• Refinancing analysis</li>
                      <li>• Scenario comparisons</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-16 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Loan Payment Guide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential information about loan payments, interest rates, and smart borrowing strategies
          </p>
        </div>

        {/* Overview */}
        <div className="bg-background border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">How Loan Payments Work (Fixed-Rate)</h3>
          <p className="text-muted-foreground mb-4">
            Most personal, auto, and mortgage loans use <strong className="text-foreground">amortized fixed monthly payments</strong>. Each month you pay the same amount, but the mix of
            <em> interest</em> and <em>principal</em> changes over time. Early on, more goes to interest; later, more goes to principal. Extra payments directly reduce the balance and can
            save years and thousands in interest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Monthly Payment</div>
              <p className="text-sm text-blue-800 dark:text-blue-200">Calculated from loan amount, APR, and term. Stays constant with fixed-rate loans.</p>
            </div>
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">Principal vs. Interest</div>
              <p className="text-sm text-green-800 dark:text-green-200">Early payments: more interest. Later payments: more principal. Extra payments speed up principal reduction.</p>
            </div>
            <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <div className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">Total Cost</div>
              <p className="text-sm text-orange-800 dark:text-orange-200">Total interest is the main driver of lifetime cost. Reducing rate, term, or balance reduces interest.</p>
            </div>
          </div>
        </div>

        {/* How to Use This Tool */}
        <div className="bg-background border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">How to Use This Calculator</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Enter <strong className="text-foreground">Loan Amount</strong>, <strong className="text-foreground">Interest Rate (APR)</strong>, and <strong className="text-foreground">Term (Years)</strong>.</li>
            <li>Open <strong className="text-foreground">Advanced Options</strong> to add <em>extra payments</em>, affordability inputs, or refinancing details.</li>
            <li>Click <strong className="text-foreground">Calculate Payment</strong> (or start typing—results auto-update).</li>
            <li>Review tabs: <em>Summary</em> (key numbers), <em>Analysis</em> (affordability/refinance), <em>Schedule</em> (amortization table), and <em>Compare</em> (scenario table).</li>
            <li>Use <strong className="text-foreground">Export CSV</strong> in the Schedule tab to download your amortization table.</li>
          </ol>
        </div>

        {/* Inputs & Options Explained */}
        <div className="bg-background border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Inputs and Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Core Inputs</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li><strong className="text-foreground">Loan Amount:</strong> Total you borrow. Higher amounts increase payment and interest.</li>
                <li><strong className="text-foreground">Interest Rate (APR):</strong> Annual percentage rate. Lower APR reduces monthly payment and total interest.</li>
                <li><strong className="text-foreground">Term (Years):</strong> Length of the loan. Longer terms lower payment but increase total interest.</li>
                <li><strong className="text-foreground">Loan Type (Advanced):</strong> Standard amortizing is supported; interest-only and balloon are UI options here (full engine support coming soon).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Optimization</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li><strong className="text-foreground">Extra Monthly Payment:</strong> Adds to principal each month. Shows interest and time savings in Summary.</li>
                <li><strong className="text-foreground">Bi-weekly Payments:</strong> Simulates 26 payments/year (≈ 13 monthly). Often saves 4–6 years on a 30-year loan.</li>
                <li><strong className="text-foreground">One-time / Yearly Extras:</strong> Apply windfalls or annual bonuses to reduce balance sooner.</li>
                <li><strong className="text-foreground">Start Date:</strong> Sets schedule dates for each payment.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Affordability</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li><strong className="text-foreground">Monthly Income & Debts:</strong> Computes debt-to-income (DTI) and payment-to-income ratios.</li>
                <li><strong className="text-foreground">Risk Bands:</strong> DTI ≤ 28%: low risk; ≤ 36%: moderate; ≤ 43%: high; &gt; 43%: very high.</li>
                <li><strong className="text-foreground">Recommended Income:</strong> Rough target using a 33% rule of thumb.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Refinancing</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li><strong className="text-foreground">New Rate & Closing Costs:</strong> Compares current vs. new payment and estimates monthly savings.</li>
                <li><strong className="text-foreground">Break-even Point:</strong> Months to recover closing costs via savings. Shorter is better.</li>
                <li><strong className="text-foreground">Lifetime Savings:</strong> Estimated savings over the term (does not yet account for remaining vs. new term differences).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reading the Results */}
        <div className="bg-background border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Reading Your Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground mb-2">Shows monthly payment, total interest, total cost, and breakdown of principal vs. interest. Optimization cards display savings from extra or bi-weekly payments.</p>
              <h4 className="font-semibold mb-2">Schedule</h4>
              <p className="text-sm text-muted-foreground">Amortization table by month (or yearly view). Export CSV to share or analyze further.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground mb-2">Affordability and refinancing modules provide DTI risk, recommended income, break-even months, and estimated savings.</p>
              <h4 className="font-semibold mb-2">Compare</h4>
              <p className="text-sm text-muted-foreground">Compares scenarios like 30-year vs 15-year. Use this to weigh interest savings vs. cashflow.</p>
            </div>
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="bg-background border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Tips for Smart Borrowing</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Keep <strong className="text-foreground">DTI under 36%</strong> for flexibility and resilience.</li>
            <li>Even small <strong className="text-foreground">extra payments</strong> early save large amounts of interest.</li>
            <li>Consider <strong className="text-foreground">bi-weekly</strong> if your lender supports it or self-manage by paying extra monthly.</li>
            <li>Refinance when your <strong className="text-foreground">rate drops ~0.5–1%</strong> and you’ll stay beyond break-even.</li>
            <li>Build an emergency fund before committing to aggressive payoff plans.</li>
          </ul>
        </div>

        {/* Limitations / Notes */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Important Notes</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
            <li>This tool models fixed-rate amortized loans. Interest-only and balloon types are displayed as options but not fully simulated yet.</li>
            <li>Taxes, insurance, PMI, and fees are not included in monthly payment figures.</li>
            <li>Refinance lifetime savings assume same total term; remaining-term modeling and NPV are planned enhancements.</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <FAQAccordion faqs={loanPaymentFAQs} />

        {/* Review Section */}
        <CalculatorReview
          calculatorName="Loan Payment Calculator"
          className="mt-6"
        />
      </div>
    </div>
  );
}

// FAQ Data
const loanPaymentFAQs: FAQItem[] = [
  {
    question: "How is my monthly loan payment calculated?",
    answer: "Your monthly payment is calculated using the loan payment formula that considers your principal amount, interest rate, and loan term. The formula ensures that you pay the same amount each month, with the proportion of principal and interest changing over time. Early payments go mostly toward interest, while later payments go mostly toward principal."
  },
  {
    question: "What is an amortization schedule and why is it important?",
    answer: "An amortization schedule is a table that shows each payment over the life of your loan, breaking down how much goes toward principal and interest. It's important because it shows you exactly how much equity you're building over time, how much interest you'll pay, and how extra payments can significantly impact your loan."
  },
  {
    question: "How much can I save with bi-weekly payments?",
    answer: "Bi-weekly payments can save substantial money because you make 26 payments per year (equivalent to 13 monthly payments instead of 12). This extra payment goes directly toward principal, typically saving 4-6 years on a 30-year loan and thousands in interest. The exact savings depend on your loan amount and interest rate."
  },
  {
    question: "Should I make extra principal payments or invest the money?",
    answer: "This depends on your loan's interest rate versus potential investment returns. If your loan rate is higher than what you can safely earn investing, pay down the loan. If you can earn more investing (accounting for risk), investing may be better. Consider your risk tolerance, tax implications, and overall financial situation."
  },
  {
    question: "What debt-to-income ratio is considered safe?",
    answer: "Generally, lenders prefer a total debt-to-income ratio below 36%, with housing payments below 28% of gross income. However, some loans allow up to 43%. Lower ratios provide more financial flexibility and reduce risk of financial stress during income changes or unexpected expenses."
  },
  {
    question: "When does refinancing make sense?",
    answer: "Refinancing typically makes sense when you can lower your interest rate by at least 0.5-1%, plan to stay in the property beyond the break-even point, and the closing costs don't outweigh the benefits. Our calculator shows your break-even point and total savings to help you decide."
  },
  {
    question: "What's the difference between loan types (standard, interest-only, balloon)?",
    answer: "Standard loans have fixed monthly payments that include both principal and interest. Interest-only loans initially require only interest payments, with principal payments starting later. Balloon loans have lower initial payments but require a large lump sum payment at the end. Each has different risk profiles and use cases."
  },
  {
    question: "How do I determine how much loan I can afford?",
    answer: "Use the 28/36 rule: housing payments should be no more than 28% of gross income, and total debt payments no more than 36%. Consider your other financial goals, emergency fund, and comfort level with debt. Our affordability analysis helps you understand the risk level of different loan amounts."
  },
  {
    question: "What factors affect my loan's interest rate?",
    answer: "Interest rates depend on credit score, down payment, loan term, loan type, debt-to-income ratio, employment history, and market conditions. Generally, higher credit scores, larger down payments, and shorter terms result in lower rates. Shop around with multiple lenders to compare offers."
  },
  {
    question: "How can I pay off my loan faster?",
    answer: "Several strategies can accelerate payoff: make extra principal payments, switch to bi-weekly payments, apply windfalls (bonuses, tax refunds) to principal, or refinance to a shorter term. Even small extra payments early in the loan can save years and thousands in interest due to compound effects."
  }
];