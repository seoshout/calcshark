'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target,
  Activity, TrendingUp, User, DollarSign, Home, Shield,
  BarChart3, PieChart, LineChart, MapPin, Award, Clock,
  Percent, Calendar, TrendingDown, Building, Coins, Zap,
  Heart, Users, Star, Settings, FileText, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import MortgageCharts from '@/components/ui/mortgage-charts';

// Advanced interfaces for comprehensive mortgage calculations
interface MortgageResult {
  monthlyPayment: number;
  principalAndInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalLoanAmount: number;
  totalInterest: number;
  totalPayments: number;
  loanToValue: number;
  monthlyBreakdown: MonthlyBreakdown[];
  amortizationSchedule: AmortizationEntry[];
  costAnalysis: CostAnalysis;
  affordabilityScore: number;
  riskAssessment: RiskAssessment;
  comparison: ComparisonAnalysis;
  recommendations: string[];
}

interface MonthlyBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  taxes: number;
  insurance: number;
  pmi: number;
  hoa: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  equityBuilt: number;
}

interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: string;
  beginningBalance: number;
  monthlyPayment: number;
  principal: number;
  interest: number;
  endingBalance: number;
  cumulativeInterest: number;
}

interface CostAnalysis {
  closingCosts: number;
  totalCashNeeded: number;
  monthlyMaintenanceReserve: number;
  annualPropertyCosts: number;
  fiveYearTotalCost: number;
  breakEvenPoint: number;
  rentVsBuyAnalysis: RentVsBuy;
}

interface RentVsBuy {
  monthlyRent: number;
  buyingAdvantageYear: number;
  fiveYearBuyingCost: number;
  fiveYearRentingCost: number;
  netAdvantage: number;
}

interface RiskAssessment {
  paymentToIncomeRatio: number;
  debtToIncomeRatio: number;
  stressTestResults: StressTestResult[];
  appraisalGapRisk: number;
  rateRiskExposure: number;
  overallRiskLevel: 'low' | 'moderate' | 'high';
}

interface StressTestResult {
  scenario: string;
  newPayment: number;
  paymentIncrease: number;
  affordabilityImpact: number;
}

interface ComparisonAnalysis {
  fifteenVsThirtyYear: LoanComparison;
  biweeklyPayments: BiweeklyAnalysis;
  extraPaymentScenarios: ExtraPaymentScenario[];
}

interface LoanComparison {
  thirtyYearPayment: number;
  fifteenYearPayment: number;
  interestSaved: number;
  paymentDifference: number;
}

interface BiweeklyAnalysis {
  monthlyPayment: number;
  biweeklyPayment: number;
  interestSaved: number;
  timeReduced: number; // months
}

interface ExtraPaymentScenario {
  extraAmount: number;
  newPayoffTime: number;
  interestSaved: number;
  breakEvenMonth: number;
}

interface MortgageSettings {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // years
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  pmiRate: number;
  hoaMonthly: number;
  zipCode: string;
  creditScore: number;
  annualIncome: number;
  monthlyDebts: number;
  cashReserves: number;
}

interface AdvancedSettings {
  includePMI: boolean;
  pmiRemovalLTV: number;
  propertyAppreciation: number;
  maintenanceRate: number;
  utilityEstimate: number;
  closingCostRate: number;
  lenderType: 'bank' | 'credit_union' | 'online' | 'broker';
  loanType: 'conventional' | 'fha' | 'va' | 'usda';
  occupancyType: 'primary' | 'secondary' | 'investment';
}

interface RegionalData {
  averagePropertyTax: number;
  averageInsurance: number;
  averageUtilities: number;
  marketAppreciation: number;
  averageHOA: number;
}

// Regional data for major markets (simplified - would normally come from API)
const REGIONAL_DATA: Record<string, RegionalData> = {
  '90210': { averagePropertyTax: 1.25, averageInsurance: 1800, averageUtilities: 280, marketAppreciation: 4.2, averageHOA: 450 },
  '10001': { averagePropertyTax: 2.1, averageInsurance: 2200, averageUtilities: 320, marketAppreciation: 3.8, averageHOA: 650 },
  '33101': { averagePropertyTax: 0.95, averageInsurance: 3800, averageUtilities: 220, marketAppreciation: 5.1, averageHOA: 380 },
  'default': { averagePropertyTax: 1.2, averageInsurance: 1200, averageUtilities: 150, marketAppreciation: 3.5, averageHOA: 200 }
};

export default function AdvancedMortgageCalculator() {
  // Main mortgage settings
  const [settings, setSettings] = useState<MortgageSettings>({
    homePrice: 400000,
    downPayment: 80000,
    loanAmount: 320000,
    interestRate: 7.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
    pmiRate: 0.5,
    hoaMonthly: 0,
    zipCode: '',
    creditScore: 740,
    annualIncome: 80000,
    monthlyDebts: 500,
    cashReserves: 20000
  });

  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    includePMI: true,
    pmiRemovalLTV: 80,
    propertyAppreciation: 3.5,
    maintenanceRate: 1.0,
    utilityEstimate: 150,
    closingCostRate: 3.0,
    lenderType: 'bank',
    loanType: 'conventional',
    occupancyType: 'primary'
  });

  // Results and UI state
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'analysis'>('basic');
  const [calculationMode, setCalculationMode] = useState<'payment' | 'affordability' | 'comparison'>('payment');

  // Update loan amount when home price or down payment changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      loanAmount: Math.max(0, prev.homePrice - prev.downPayment)
    }));
  }, [settings.homePrice, settings.downPayment]);

  // Calculate monthly payment components
  const calculateMonthlyPayment = useCallback((
    loanAmount: number,
    monthlyRate: number,
    totalPayments: number
  ): number => {
    if (monthlyRate === 0) return loanAmount / totalPayments;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    return monthlyPayment;
  }, []);

  // Generate amortization schedule
  const generateAmortizationSchedule = useCallback((
    loanAmount: number,
    monthlyRate: number,
    totalPayments: number,
    monthlyPayment: number
  ): AmortizationEntry[] => {
    const schedule: AmortizationEntry[] = [];
    let remainingBalance = loanAmount;
    let cumulativeInterest = 0;
    const startDate = new Date();

    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      cumulativeInterest += interestPayment;
      remainingBalance -= principalPayment;

      const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);

      schedule.push({
        paymentNumber: i,
        paymentDate: paymentDate.toISOString().split('T')[0],
        beginningBalance: remainingBalance + principalPayment,
        monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        endingBalance: Math.max(0, remainingBalance),
        cumulativeInterest
      });

      if (remainingBalance <= 0) break;
    }

    return schedule;
  }, []);

  // Calculate comprehensive mortgage analysis
  const calculateMortgage = useCallback(() => {
    setError('');

    try {
      const {
        homePrice,
        downPayment,
        loanAmount,
        interestRate,
        loanTerm,
        propertyTaxRate,
        homeInsuranceAnnual,
        pmiRate,
        hoaMonthly,
        creditScore,
        annualIncome,
        monthlyDebts
      } = settings;

      // Validation
      if (homePrice <= 0 || downPayment < 0 || interestRate < 0 || loanTerm <= 0) {
        throw new Error('Please enter valid positive values for all required fields.');
      }

      if (downPayment >= homePrice) {
        throw new Error('Down payment cannot be greater than or equal to home price.');
      }

      if (interestRate > 20) {
        throw new Error('Interest rate seems unusually high. Please verify the rate.');
      }

      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = loanTerm * 12;
      const downPaymentPercent = (downPayment / homePrice) * 100;
      const loanToValue = ((loanAmount) / homePrice) * 100;

      // Calculate basic monthly payment (P&I)
      const principalAndInterest = calculateMonthlyPayment(loanAmount, monthlyRate, totalPayments);

      // Calculate other monthly costs
      const monthlyTaxes = (homePrice * (propertyTaxRate / 100)) / 12;
      const monthlyInsurance = homeInsuranceAnnual / 12;
      const monthlyPMI = (advancedSettings.includePMI && downPaymentPercent < 20) 
        ? (loanAmount * (pmiRate / 100)) / 12 
        : 0;

      const totalMonthlyPayment = principalAndInterest + monthlyTaxes + monthlyInsurance + monthlyPMI + hoaMonthly;

      // Generate amortization schedule
      const amortizationSchedule = generateAmortizationSchedule(
        loanAmount, 
        monthlyRate, 
        totalPayments, 
        principalAndInterest
      );

      // Calculate totals
      const totalInterest = (principalAndInterest * totalPayments) - loanAmount;
      const totalPayments_amount = principalAndInterest * totalPayments;

      // Generate monthly breakdown (first 12 months)
      const monthlyBreakdown: MonthlyBreakdown[] = [];
      let remainingBalance = loanAmount;
      let cumulativeInterest = 0;
      let cumulativePrincipal = 0;

      for (let month = 1; month <= Math.min(12, totalPayments); month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = principalAndInterest - interestPayment;
        
        remainingBalance -= principalPayment;
        cumulativeInterest += interestPayment;
        cumulativePrincipal += principalPayment;

        monthlyBreakdown.push({
          month,
          payment: totalMonthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          taxes: monthlyTaxes,
          insurance: monthlyInsurance,
          pmi: monthlyPMI,
          hoa: hoaMonthly,
          remainingBalance: Math.max(0, remainingBalance),
          cumulativeInterest,
          cumulativePrincipal,
          equityBuilt: downPayment + cumulativePrincipal
        });
      }

      // Cost Analysis
      const closingCosts = homePrice * (advancedSettings.closingCostRate / 100);
      const totalCashNeeded = downPayment + closingCosts;
      const monthlyMaintenanceReserve = homePrice * (advancedSettings.maintenanceRate / 100) / 12;
      const annualPropertyCosts = (monthlyTaxes + monthlyInsurance + monthlyPMI + hoaMonthly) * 12;

      const costAnalysis: CostAnalysis = {
        closingCosts,
        totalCashNeeded,
        monthlyMaintenanceReserve,
        annualPropertyCosts,
        fiveYearTotalCost: totalMonthlyPayment * 60 + closingCosts,
        breakEvenPoint: closingCosts / (monthlyMaintenanceReserve * 12), // Simplified
        rentVsBuyAnalysis: {
          monthlyRent: totalMonthlyPayment * 0.75, // Estimate
          buyingAdvantageYear: 5,
          fiveYearBuyingCost: totalMonthlyPayment * 60 + closingCosts,
          fiveYearRentingCost: (totalMonthlyPayment * 0.75) * 60,
          netAdvantage: 0
        }
      };

      // Risk Assessment
      const paymentToIncomeRatio = (totalMonthlyPayment * 12) / annualIncome * 100;
      const debtToIncomeRatio = ((totalMonthlyPayment + monthlyDebts) * 12) / annualIncome * 100;

      const stressTestResults: StressTestResult[] = [
        {
          scenario: '+1% Interest Rate',
          newPayment: calculateMonthlyPayment(loanAmount, (interestRate + 1) / 100 / 12, totalPayments) + monthlyTaxes + monthlyInsurance + monthlyPMI + hoaMonthly,
          paymentIncrease: 0,
          affordabilityImpact: 0
        },
        {
          scenario: '+2% Interest Rate',
          newPayment: calculateMonthlyPayment(loanAmount, (interestRate + 2) / 100 / 12, totalPayments) + monthlyTaxes + monthlyInsurance + monthlyPMI + hoaMonthly,
          paymentIncrease: 0,
          affordabilityImpact: 0
        }
      ];

      // Calculate payment increases
      stressTestResults.forEach(test => {
        test.paymentIncrease = test.newPayment - totalMonthlyPayment;
        test.affordabilityImpact = (test.paymentIncrease * 12) / annualIncome * 100;
      });

      const riskAssessment: RiskAssessment = {
        paymentToIncomeRatio,
        debtToIncomeRatio,
        stressTestResults,
        appraisalGapRisk: homePrice > 500000 ? 15 : 5, // Simplified risk assessment
        rateRiskExposure: interestRate < 5 ? 25 : 10,
        overallRiskLevel: debtToIncomeRatio > 43 ? 'high' : debtToIncomeRatio > 35 ? 'moderate' : 'low'
      };

      // Affordability Score (0-100)
      let affordabilityScore = 100;
      if (paymentToIncomeRatio > 28) affordabilityScore -= 20;
      if (debtToIncomeRatio > 36) affordabilityScore -= 20;
      if (downPaymentPercent < 20) affordabilityScore -= 10;
      if (creditScore < 740) affordabilityScore -= 15;
      affordabilityScore = Math.max(0, affordabilityScore);

      // Comparison Analysis
      const fifteenYearPayment = calculateMonthlyPayment(loanAmount, monthlyRate, 15 * 12);
      const fifteenYearTotalInterest = (fifteenYearPayment * 15 * 12) - loanAmount;

      const biweeklyPayment = principalAndInterest / 2;
      // Simplified biweekly calculation
      const biweeklyMonths = totalPayments * 0.75; // Approximate time reduction
      const biweeklyTotalInterest = totalInterest * 0.75; // Approximate interest savings

      const comparison: ComparisonAnalysis = {
        fifteenVsThirtyYear: {
          thirtyYearPayment: principalAndInterest,
          fifteenYearPayment,
          interestSaved: totalInterest - fifteenYearTotalInterest,
          paymentDifference: fifteenYearPayment - principalAndInterest
        },
        biweeklyPayments: {
          monthlyPayment: principalAndInterest,
          biweeklyPayment,
          interestSaved: totalInterest - biweeklyTotalInterest,
          timeReduced: totalPayments - biweeklyMonths
        },
        extraPaymentScenarios: [
          {
            extraAmount: 100,
            newPayoffTime: totalPayments - 48, // Approximate
            interestSaved: totalInterest * 0.15, // Approximate
            breakEvenMonth: 1
          },
          {
            extraAmount: 200,
            newPayoffTime: totalPayments - 84, // Approximate
            interestSaved: totalInterest * 0.28, // Approximate
            breakEvenMonth: 1
          }
        ]
      };

      // Generate recommendations
      const recommendations: string[] = [];
      if (downPaymentPercent < 20) {
        recommendations.push('Consider saving for a 20% down payment to eliminate PMI and reduce monthly costs.');
      }
      if (paymentToIncomeRatio > 28) {
        recommendations.push('Your payment-to-income ratio is high. Consider a less expensive home or larger down payment.');
      }
      if (creditScore < 740) {
        recommendations.push('Improving your credit score could qualify you for better interest rates.');
      }
      if (riskAssessment.overallRiskLevel === 'high') {
        recommendations.push('Consider building larger cash reserves before purchasing to improve financial stability.');
      }

      const result: MortgageResult = {
        monthlyPayment: principalAndInterest,
        principalAndInterest,
        monthlyTaxes,
        monthlyInsurance,
        monthlyPMI,
        monthlyHOA: hoaMonthly,
        totalMonthlyPayment,
        totalLoanAmount: loanAmount,
        totalInterest,
        totalPayments: totalPayments_amount,
        loanToValue,
        monthlyBreakdown,
        amortizationSchedule: amortizationSchedule.slice(0, 12), // First year for display
        costAnalysis,
        affordabilityScore,
        riskAssessment,
        comparison,
        recommendations
      };

      setResult(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
      setResult(null);
    }
  }, [settings, advancedSettings, calculateMonthlyPayment, generateAmortizationSchedule]);

  const resetCalculator = () => {
    setSettings({
      homePrice: 400000,
      downPayment: 80000,
      loanAmount: 320000,
      interestRate: 7.5,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsuranceAnnual: 1200,
      pmiRate: 0.5,
      hoaMonthly: 0,
      zipCode: '',
      creditScore: 740,
      annualIncome: 80000,
      monthlyDebts: 500,
      cashReserves: 20000
    });
    setAdvancedSettings({
      includePMI: true,
      pmiRemovalLTV: 80,
      propertyAppreciation: 3.5,
      maintenanceRate: 1.0,
      utilityEstimate: 150,
      closingCostRate: 3.0,
      lenderType: 'bank',
      loanType: 'conventional',
      occupancyType: 'primary'
    });
    setResult(null);
    setError('');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number): string => {
    return `${rate.toFixed(2)}%`;
  };

  // Comprehensive FAQ data
  const mortgageFAQs: FAQItem[] = [
    {
      question: "How is my monthly mortgage payment calculated?",
      answer: "Your monthly mortgage payment includes Principal & Interest (P&I), property taxes, homeowner's insurance, and possibly Private Mortgage Insurance (PMI) if your down payment is less than 20%. We also factor in HOA fees if applicable. The P&I is calculated using the formula: M = P[r(1+r)^n]/[(1+r)^n-1] where P = loan amount, r = monthly interest rate, n = number of payments.",
      category: "Payments"
    },
    {
      question: "What is PMI and when can I remove it?",
      answer: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's value. It protects the lender if you default. PMI can typically be removed when your loan-to-value ratio reaches 80% through payments or home appreciation. Some loans automatically cancel PMI at 78% LTV.",
      category: "PMI"
    },
    {
      question: "How much house can I afford based on my income?",
      answer: "Generally, your total monthly housing payment shouldn't exceed 28% of your gross monthly income, and total debt payments shouldn't exceed 36-43% (debt-to-income ratio). Our affordability calculator considers your income, debts, credit score, and down payment to provide a personalized recommendation.",
      category: "Affordability"
    },
    {
      question: "What's the difference between 15-year and 30-year mortgages?",
      answer: "15-year mortgages have higher monthly payments but significantly lower total interest costs and faster equity building. 30-year mortgages have lower monthly payments but higher total interest. A 15-year loan typically saves $100,000+ in interest but increases monthly payments by $500-800 depending on loan amount.",
      category: "Loan Terms"
    },
    {
      question: "How do biweekly payments save money?",
      answer: "Biweekly payments (half your monthly payment every two weeks) result in 26 payments per year, equivalent to 13 monthly payments instead of 12. This extra payment goes directly to principal, potentially saving 4-6 years off your loan term and tens of thousands in interest.",
      category: "Payment Strategies"
    },
    {
      question: "What closing costs should I expect?",
      answer: "Closing costs typically range from 2-5% of the home's purchase price. They include loan origination fees, appraisal, title insurance, attorney fees, inspection, and prepaid items like property taxes and insurance. Our calculator estimates closing costs at 3% of the home price.",
      category: "Closing Costs"
    },
    {
      question: "How does my credit score affect my mortgage rate?",
      answer: "Credit scores significantly impact your interest rate. Excellent credit (740+) gets the best rates, while scores below 620 may require FHA loans or higher rates. A 1% rate difference on a $300,000 loan costs about $175 more per month and $63,000 more over 30 years.",
      category: "Credit Score"
    },
    {
      question: "What's included in total homeownership costs?",
      answer: "Beyond your mortgage payment, budget for maintenance (1% of home value annually), utilities, homeowner's association fees, and potential special assessments. Property taxes and insurance can also increase over time. Our calculator includes these factors for a complete cost picture.",
      category: "Total Costs"
    },
    {
      question: "Should I pay points to lower my interest rate?",
      answer: "Discount points cost 1% of your loan amount to reduce your rate by typically 0.25%. Points make sense if you'll keep the loan long enough to break even (usually 5-7 years). Calculate the monthly savings versus upfront cost to determine if points are worthwhile for your situation.",
      category: "Points"
    },
    {
      question: "When should I consider refinancing?",
      answer: "Consider refinancing when rates drop 0.5-1% below your current rate, you want to change loan terms, eliminate PMI, or tap home equity. Factor in closing costs (typically 2-3% of loan amount) and how long you plan to stay in the home. Our calculator can model refinancing scenarios.",
      category: "Refinancing"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-3 sm:p-6">
        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex bg-muted rounded-lg p-1 w-full overflow-x-auto">
            {[
              { key: 'basic', label: 'Loan Details', shortLabel: 'Loan', icon: Home },
              { key: 'advanced', label: 'Advanced Settings', shortLabel: 'Advanced', icon: Settings },
              { key: 'analysis', label: 'Financial Analysis', shortLabel: 'Analysis', icon: BarChart3 }
            ].map(({ key, label, shortLabel, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "flex items-center justify-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex-1 min-w-0",
                  activeTab === key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate sm:hidden">{shortLabel}</span>
                <span className="truncate hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Settings Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.homePrice}
                    onChange={(e) => setSettings({
                      ...settings,
                      homePrice: parseFloat(e.target.value) || 0
                    })}
                    placeholder="400000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="1000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.downPayment}
                    onChange={(e) => setSettings({
                      ...settings,
                      downPayment: parseFloat(e.target.value) || 0
                    })}
                    placeholder="80000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="1000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.homePrice > 0 ? `${((settings.downPayment / settings.homePrice) * 100).toFixed(1)}% of home price` : ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.interestRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      interestRate: parseFloat(e.target.value) || 0
                    })}
                    placeholder="7.5"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="0.125"
                    min="0"
                    max="20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (Years)
                </label>
                <select
                  value={settings.loanTerm}
                  onChange={(e) => setSettings({
                    ...settings,
                    loanTerm: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={30}>30 Years</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Loan Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-blue-800 dark:text-blue-200">Loan Amount</div>
                  <div className="font-bold text-blue-900 dark:text-blue-100">{formatCurrency(settings.loanAmount)}</div>
                </div>
                <div>
                  <div className="text-blue-800 dark:text-blue-200">Down Payment %</div>
                  <div className="font-bold text-blue-900 dark:text-blue-100">
                    {settings.homePrice > 0 ? `${((settings.downPayment / settings.homePrice) * 100).toFixed(1)}%` : '0%'}
                  </div>
                </div>
                <div>
                  <div className="text-blue-800 dark:text-blue-200">Loan-to-Value</div>
                  <div className="font-bold text-blue-900 dark:text-blue-100">
                    {settings.homePrice > 0 ? `${((settings.loanAmount / settings.homePrice) * 100).toFixed(1)}%` : '0%'}
                  </div>
                </div>
                <div>
                  <div className="text-blue-800 dark:text-blue-200">PMI Required</div>
                  <div className="font-bold text-blue-900 dark:text-blue-100">
                    {(settings.downPayment / settings.homePrice) < 0.20 ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Additional Costs & Settings</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Configure property taxes, insurance, PMI, and other costs for accurate payment calculations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Property Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.propertyTaxRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    propertyTaxRate: parseFloat(e.target.value) || 0
                  })}
                  placeholder="1.2"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                  min="0"
                  max="5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Monthly: {formatCurrency((settings.homePrice * (settings.propertyTaxRate / 100)) / 12)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Home Insurance
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.homeInsuranceAnnual}
                    onChange={(e) => setSettings({
                      ...settings,
                      homeInsuranceAnnual: parseFloat(e.target.value) || 0
                    })}
                    placeholder="1200"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="100"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Monthly: {formatCurrency(settings.homeInsuranceAnnual / 12)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  PMI Rate (% annually)
                </label>
                <input
                  type="number"
                  value={settings.pmiRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    pmiRate: parseFloat(e.target.value) || 0
                  })}
                  placeholder="0.5"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                  min="0"
                  max="2"
                  disabled={(settings.downPayment / settings.homePrice) >= 0.20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(settings.downPayment / settings.homePrice) >= 0.20 ? 'Not required (20%+ down payment)' : 
                   `Monthly: ${formatCurrency((settings.loanAmount * (settings.pmiRate / 100)) / 12)}`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly HOA Fees
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.hoaMonthly}
                    onChange={(e) => setSettings({
                      ...settings,
                      hoaMonthly: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="25"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loan Type</label>
                <select
                  value={advancedSettings.loanType}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    loanType: e.target.value as AdvancedSettings['loanType']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="usda">USDA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Occupancy Type</label>
                <select
                  value={advancedSettings.occupancyType}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    occupancyType: e.target.value as AdvancedSettings['occupancyType']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="primary">Primary Residence</option>
                  <option value="secondary">Second Home</option>
                  <option value="investment">Investment Property</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Financial Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Financial Profile</h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Enter your financial information for affordability analysis and personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Gross Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.annualIncome}
                    onChange={(e) => setSettings({
                      ...settings,
                      annualIncome: parseFloat(e.target.value) || 0
                    })}
                    placeholder="80000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="1000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Before taxes and deductions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly Debt Payments
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.monthlyDebts}
                    onChange={(e) => setSettings({
                      ...settings,
                      monthlyDebts: parseFloat(e.target.value) || 0
                    })}
                    placeholder="500"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="50"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Credit cards, auto loans, student loans</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Credit Score
                </label>
                <select
                  value={settings.creditScore}
                  onChange={(e) => setSettings({
                    ...settings,
                    creditScore: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value={800}>Excellent (800+)</option>
                  <option value={740}>Very Good (740-799)</option>
                  <option value={670}>Good (670-739)</option>
                  <option value={620}>Fair (620-669)</option>
                  <option value={580}>Poor (580-619)</option>
                  <option value={500}>Very Poor (&lt;580)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cash Reserves
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.cashReserves}
                    onChange={(e) => setSettings({
                      ...settings,
                      cashReserves: parseFloat(e.target.value) || 0
                    })}
                    placeholder="20000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="1000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available after down payment and closing costs</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={calculateMortgage}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Mortgage
          </button>
          <button
            onClick={resetCalculator}
            className="flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 overflow-hidden">
            {/* Calculation Mode Toggle - Appears only after results */}
            <div className="bg-background border rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Analysis Mode</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to view your analysis</p>
                </div>
                <div className="flex flex-col sm:flex-row bg-muted rounded-lg p-1 gap-1 sm:gap-0">
                  {[
                    { key: 'payment', label: 'Payment', icon: Calculator },
                    { key: 'affordability', label: 'Affordability', icon: Target },
                    { key: 'comparison', label: 'Comparison', icon: BarChart3 }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setCalculationMode(key as any)}
                      className={cn(
                        "flex items-center justify-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors min-w-0 flex-1 sm:flex-none",
                        calculationMode === key 
                          ? "bg-background text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Calculator Mode */}
            {calculationMode === 'payment' && (
              <>
                {/* Main Payment Summary */}
                <div className="bg-background border rounded-xl p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Monthly Payment Breakdown
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                    <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{formatCurrency(result.totalMonthlyPayment)}</div>
                      <div className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200">Total Monthly Payment</div>
                    </div>
                    
                    <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{formatCurrency(result.principalAndInterest)}</div>
                      <div className="text-xs md:text-sm font-medium text-green-800 dark:text-green-200">Principal & Interest</div>
                    </div>
                    
                    <div className="text-center p-3 md:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">{formatCurrency(result.totalInterest)}</div>
                      <div className="text-xs md:text-sm font-medium text-orange-800 dark:text-orange-200">Total Interest</div>
                    </div>
                    
                    <div className="text-center p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{result.affordabilityScore}</div>
                      <div className="text-xs md:text-sm font-medium text-purple-800 dark:text-purple-200">Affordability Score</div>
                    </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Payment Components</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Principal & Interest</span>
                      <span className="font-medium">{formatCurrency(result.principalAndInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property Taxes</span>
                      <span className="font-medium">{formatCurrency(result.monthlyTaxes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Home Insurance</span>
                      <span className="font-medium">{formatCurrency(result.monthlyInsurance)}</span>
                    </div>
                    {result.monthlyPMI > 0 && (
                      <div className="flex justify-between">
                        <span>PMI</span>
                        <span className="font-medium">{formatCurrency(result.monthlyPMI)}</span>
                      </div>
                    )}
                    {result.monthlyHOA > 0 && (
                      <div className="flex justify-between">
                        <span>HOA Fees</span>
                        <span className="font-medium">{formatCurrency(result.monthlyHOA)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Monthly Payment</span>
                      <span>{formatCurrency(result.totalMonthlyPayment)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Loan Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Loan Amount</span>
                      <span className="font-medium">{formatCurrency(result.totalLoanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan-to-Value</span>
                      <span className="font-medium">{formatPercentage(result.loanToValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Payments</span>
                      <span className="font-medium">{formatCurrency(result.totalPayments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest</span>
                      <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment-to-Income</span>
                      <span className="font-medium">{formatPercentage(result.riskAssessment.paymentToIncomeRatio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debt-to-Income</span>
                      <span className="font-medium">{formatPercentage(result.riskAssessment.debtToIncomeRatio)}</span>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </>
            )}

            {/* Affordability Analysis Mode */}
            {calculationMode === 'affordability' && (
              <>
                {/* Affordability Score Overview */}
                <div className="bg-background border rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Affordability Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{result.affordabilityScore}/100</div>
                      <div className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-1">Affordability Score</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        {result.affordabilityScore >= 80 ? "Excellent" : 
                         result.affordabilityScore >= 60 ? "Good" : 
                         result.affordabilityScore >= 40 ? "Fair" : "Poor"}
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-green-600 mb-2">{formatPercentage(result.riskAssessment.paymentToIncomeRatio)}</div>
                      <div className="text-lg font-medium text-green-800 dark:text-green-200 mb-1">Payment-to-Income</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Recommended: &lt;28%</div>
                    </div>
                    
                    <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-4xl font-bold text-orange-600 mb-2">{formatPercentage(result.riskAssessment.debtToIncomeRatio)}</div>
                      <div className="text-lg font-medium text-orange-800 dark:text-orange-200 mb-1">Debt-to-Income</div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Recommended: &lt;36%</div>
                    </div>
                  </div>
                  
                  {/* Detailed Affordability Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Monthly Budget Impact</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gross Monthly Income</span>
                          <span className="font-medium">{formatCurrency(settings.annualIncome / 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Housing Payment</span>
                          <span className="font-medium">{formatCurrency(result.totalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Existing Debt Payments</span>
                          <span className="font-medium">{formatCurrency(settings.monthlyDebts)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Income</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency((settings.annualIncome / 12) - result.totalMonthlyPayment - settings.monthlyDebts)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Affordability Factors</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Credit Score Impact</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(settings.creditScore - 300) / 550 * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{settings.creditScore}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Down Payment %</span>
                          <span className="font-medium">{formatPercentage(settings.downPayment / settings.homePrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cash Reserves</span>
                          <span className="font-medium">{formatCurrency(settings.cashReserves)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Loan Comparison Mode */}
            {calculationMode === 'comparison' && (
              <>
                {/* Loan Term Comparison */}
                <div className="bg-background border rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Loan Comparison Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 15-Year vs 30-Year Comparison */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">15-Year Fixed</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Payment (P&I)</span>
                          <span className="font-medium">{formatCurrency(calculateMonthlyPayment(result.totalLoanAmount, settings.interestRate / 100 / 12, 15 * 12))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Interest</span>
                          <span className="font-medium">{formatCurrency(calculateMonthlyPayment(result.totalLoanAmount, settings.interestRate / 100 / 12, 15 * 12) * 180 - result.totalLoanAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Savings</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(result.totalInterest - (calculateMonthlyPayment(result.totalLoanAmount, settings.interestRate / 100 / 12, 15 * 12) * 180 - result.totalLoanAmount))}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">30-Year Fixed (Current)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Payment (P&I)</span>
                          <span className="font-medium">{formatCurrency(result.principalAndInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Interest</span>
                          <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lower Monthly Payment</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency(calculateMonthlyPayment(result.totalLoanAmount, settings.interestRate / 100 / 12, 15 * 12) - result.principalAndInterest)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Strategy Comparison */}
                  <div>
                    <h4 className="font-semibold mb-3">Payment Optimization Strategies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Bi-weekly Payments</h5>
                        <div className="text-sm space-y-1">
                          <div>Payment: {formatCurrency(result.principalAndInterest / 2)}</div>
                          <div>Time Savings: ~6 years</div>
                          <div className="text-green-600 font-medium">Interest Savings: ~{formatCurrency(result.totalInterest * 0.23)}</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Extra $100/month</h5>
                        <div className="text-sm space-y-1">
                          <div>Payment: {formatCurrency(result.principalAndInterest + 100)}</div>
                          <div>Time Savings: ~4.5 years</div>
                          <div className="text-green-600 font-medium">Interest Savings: ~{formatCurrency(result.totalInterest * 0.15)}</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Annual Extra Payment</h5>
                        <div className="text-sm space-y-1">
                          <div>Extra: {formatCurrency(result.principalAndInterest)}</div>
                          <div>Time Savings: ~5 years</div>
                          <div className="text-green-600 font-medium">Interest Savings: ~{formatCurrency(result.totalInterest * 0.18)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Shared Risk Assessment for All Modes */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Risk Assessment & Stress Testing
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={cn(
                  "p-4 rounded-lg text-center",
                  result.riskAssessment.overallRiskLevel === 'low' && "bg-green-50 dark:bg-green-900/20",
                  result.riskAssessment.overallRiskLevel === 'moderate' && "bg-yellow-50 dark:bg-yellow-900/20",
                  result.riskAssessment.overallRiskLevel === 'high' && "bg-red-50 dark:bg-red-900/20"
                )}>
                  <div className={cn(
                    "text-2xl font-bold mb-1",
                    result.riskAssessment.overallRiskLevel === 'low' && "text-green-600",
                    result.riskAssessment.overallRiskLevel === 'moderate' && "text-yellow-600",
                    result.riskAssessment.overallRiskLevel === 'high' && "text-red-600"
                  )}>
                    {result.riskAssessment.overallRiskLevel.toUpperCase()}
                  </div>
                  <div className="text-sm font-medium">Overall Risk Level</div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{formatPercentage(result.riskAssessment.paymentToIncomeRatio)}</div>
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Payment-to-Income</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Target: &lt;28%</div>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{formatPercentage(result.riskAssessment.debtToIncomeRatio)}</div>
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Debt-to-Income</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">Target: &lt;36%</div>
                </div>
              </div>

              {/* Stress Test Results */}
              <div>
                <h4 className="font-semibold mb-3">Interest Rate Stress Test</h4>
                <div className="space-y-2">
                  {result.riskAssessment.stressTestResults.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <span className="font-medium">{test.scenario}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          (+{formatCurrency(test.paymentIncrease)}/month)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(test.newPayment)}</div>
                        <div className="text-xs text-muted-foreground">
                          +{formatPercentage(test.affordabilityImpact)} of income
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loan Comparison Analysis */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Loan Comparison & Optimization
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 15 vs 30 Year */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">15-Year vs 30-Year Loan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>30-Year Payment</span>
                      <span className="font-medium">{formatCurrency(result.comparison.fifteenVsThirtyYear.thirtyYearPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15-Year Payment</span>
                      <span className="font-medium">{formatCurrency(result.comparison.fifteenVsThirtyYear.fifteenYearPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Difference</span>
                      <span className="font-medium text-red-600">+{formatCurrency(result.comparison.fifteenVsThirtyYear.paymentDifference)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Interest Saved</span>
                      <span className="font-bold text-green-600">{formatCurrency(result.comparison.fifteenVsThirtyYear.interestSaved)}</span>
                    </div>
                  </div>
                </div>

                {/* Biweekly Payments */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Biweekly Payment Strategy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Payment</span>
                      <span className="font-medium">{formatCurrency(result.comparison.biweeklyPayments.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biweekly Payment</span>
                      <span className="font-medium">{formatCurrency(result.comparison.biweeklyPayments.biweeklyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Reduced</span>
                      <span className="font-medium text-blue-600">{(result.comparison.biweeklyPayments.timeReduced / 12).toFixed(1)} years</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Interest Saved</span>
                      <span className="font-bold text-blue-600">{formatCurrency(result.comparison.biweeklyPayments.interestSaved)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Payment Scenarios */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Extra Payment Scenarios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.comparison.extraPaymentScenarios.map((scenario, index) => (
                    <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-lg font-bold text-orange-600 mb-2">
                        +{formatCurrency(scenario.extraAmount)}/month
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Payoff Time</span>
                          <span className="font-medium">{(scenario.newPayoffTime / 12).toFixed(1)} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Saved</span>
                          <span className="font-medium text-orange-600">{formatCurrency(scenario.interestSaved)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-background border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Personalized Recommendations
                </h3>
                
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Charts */}
            <div className="overflow-hidden">
              <MortgageCharts
                monthlyBreakdown={result.monthlyBreakdown}
                amortizationSchedule={result.amortizationSchedule}
                totalLoanAmount={result.totalLoanAmount}
                totalInterest={result.totalInterest}
                totalMonthlyPayment={result.totalMonthlyPayment}
                loanTerm={settings.loanTerm}
              />
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions Section */}
      <div className="bg-background border rounded-xl p-2 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Advanced Mortgage Calculator</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">🏠 Step-by-Step Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">1️⃣ Loan Details</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li><strong>Home Price:</strong> Total purchase price</li>
                  <li><strong>Down Payment:</strong> Upfront payment (20% = no PMI)</li>
                  <li><strong>Interest Rate:</strong> Current mortgage rate (5-8% typical)</li>
                  <li><strong>Loan Term:</strong> 15, 20, 25, or 30 years</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">2️⃣ Advanced Settings</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li><strong>Property Tax Rate:</strong> Annual % of home value</li>
                  <li><strong>Home Insurance:</strong> Annual premium amount</li>
                  <li><strong>PMI Rate:</strong> If down payment &lt; 20%</li>
                  <li><strong>HOA Fees:</strong> Monthly homeowner association</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">3️⃣ Financial Analysis</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li><strong>Annual Income:</strong> Gross yearly income</li>
                  <li><strong>Monthly Debts:</strong> All existing debt payments</li>
                  <li><strong>Credit Score:</strong> Impact on interest rate</li>
                  <li><strong>Cash Reserves:</strong> Emergency fund remaining</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 How the Three Calculation Modes Work</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Payment Calculator</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">Calculate monthly payments with all costs included</p>
                <p className="text-xs text-green-700 dark:text-green-300 italic">Click this button to see detailed payment breakdown including principal, interest, taxes, insurance, PMI, and HOA fees.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Affordability Analysis</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">Risk assessment and debt-to-income ratios</p>
                <p className="text-xs text-green-700 dark:text-green-300 italic">Click this button to see your affordability score, budget impact analysis, and detailed risk assessment.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Loan Comparison</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">15 vs 30 year, biweekly payments, strategies</p>
                <p className="text-xs text-green-700 dark:text-green-300 italic">Click this button to compare different loan terms, payment strategies, and see potential interest savings.</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>💡 How to Use:</strong> First click "Calculate Mortgage" to generate results, then use the three mode buttons above the results to switch between different analysis views. Each mode shows specialized information about your mortgage.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">📈 Advanced Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">🔬 Risk Assessment</h4>
                <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                  <li><strong>Affordability Score:</strong> 0-100 rating based on income ratios</li>
                  <li><strong>Stress Testing:</strong> Payment impact of rate increases</li>
                  <li><strong>DTI Analysis:</strong> Debt-to-income ratio monitoring</li>
                  <li><strong>Risk Level:</strong> Low, moderate, or high classification</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">📊 Interactive Charts</h4>
                <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                  <li><strong>Amortization:</strong> Balance paydown over time</li>
                  <li><strong>Payment Breakdown:</strong> Principal, interest, taxes, insurance</li>
                  <li><strong>Equity Building:</strong> Home equity accumulation</li>
                  <li><strong>Strategy Comparison:</strong> Different payment options</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">💡 Getting Started Tips</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🚀 Quick Start</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  <li>Begin with default values for immediate results</li>
                  <li>Use <strong>Payment Calculator</strong> mode first</li>
                  <li>Enter your actual home price and down payment</li>
                  <li>Check current mortgage rates online for accuracy</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Best Practices</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  <li>Fill in <strong>Financial Analysis</strong> for affordability insights</li>
                  <li>Use <strong>Advanced Settings</strong> for accurate total costs</li>
                  <li>Try <strong>Loan Comparison</strong> for optimization strategies</li>
                  <li>Review <strong>Risk Assessment</strong> before purchasing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mt-6">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ Important Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
              <li>This calculator provides estimates only - actual terms may vary</li>
              <li>Property taxes and insurance rates vary by location</li>
              <li>Interest rates change daily - verify current rates with lenders</li>
              <li>Consider all costs including maintenance, utilities, and closing costs</li>
              <li>Consult with mortgage professionals before making decisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="bg-background border rounded-xl p-2 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Your Mortgage</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            A mortgage is likely the largest financial commitment you'll ever make. Our advanced calculator goes beyond 
            basic payment calculations to provide comprehensive analysis including total cost of ownership, risk assessment, 
            and optimization strategies to help you make the best decision for your financial future.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🏠 Total Cost Analysis</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Beyond principal and interest, we calculate property taxes, insurance, PMI, HOA fees, 
                maintenance reserves, and closing costs for a complete financial picture.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📊 Risk Assessment</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Our affordability score and stress testing analyze your payment-to-income ratio, 
                debt levels, and resilience to interest rate changes.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">⚡ Payment Optimization</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Compare 15 vs 30-year loans, biweekly payments, and extra payment scenarios 
                to find the strategy that saves you the most money.
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">📈 Advanced Analytics</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Interactive visualizations show amortization schedules, equity building, 
                and payment breakdowns over the life of your loan.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Smart Money Tips</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">💡 Down Payment Strategy</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>20% down eliminates PMI (typically $200-400/month savings)</li>
                  <li>Consider opportunity cost of larger down payments</li>
                  <li>First-time buyer programs may allow lower down payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🎯 Interest Rate Impact</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>1% rate difference = ~10% payment difference</li>
                  <li>Improve credit score for better rates</li>
                  <li>Consider rate locks during volatile markets</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⏰ Timing Considerations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Budget for 6 months of housing payments in reserves</li>
                  <li>Consider seasonal market patterns</li>
                  <li>Plan for rate changes if using ARM</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">💰 Long-term Wealth</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Principal payments build forced savings</li>
                  <li>Real estate typically appreciates with inflation</li>
                  <li>Tax advantages for homeowners</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion 
        faqs={mortgageFAQs}
        title="Ultimate Mortgage Calculator FAQ"
      />
    </div>
  );
}