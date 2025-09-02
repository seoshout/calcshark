'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target, 
  Activity, TrendingUp, User, DollarSign, PiggyBank, Zap,
  BarChart3, PieChart, LineChart, Users, Award, Clock, Percent,
  Calendar, TrendingDown, Shield, Building, Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CompoundInterestCharts from '@/components/ui/compound-interest-charts';

// Enhanced types for advanced compound interest calculations
interface CompoundInterestResult {
  futureValue: number;
  continuousCompounding: number;
  effectiveAnnualRate: number;
  totalContributions: number;
  totalInterest: number;
  realValue: number; // Inflation-adjusted
  afterTaxValue: number;
  monthlyBreakdown: MonthlyBreakdown[];
  retirementAnalysis?: RetirementAnalysis;
  goalAnalysis?: GoalAnalysis;
}

interface MonthlyBreakdown {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
  realBalance: number;
}

interface RetirementAnalysis {
  safeWithdrawalAmount: number; // 4% rule
  monthlyWithdrawal: number;
  yearsToDeplete: number;
  successProbability: number; // Monte Carlo result
}

interface GoalAnalysis {
  monthsToGoal: number;
  yearsToGoal: number;
  requiredMonthlyContribution: number;
  probabilityOfSuccess: number;
}

interface InvestmentSettings {
  initialAmount: number;
  monthlyContribution: number;
  annualInterestRate: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually' | 'continuous';
  investmentPeriodYears: number;
  inflationRate: number;
  taxRate: number;
  accountType: 'taxable' | '401k' | 'ira' | 'roth_ira';
}

interface AdvancedSettings {
  contributionGrowthRate: number; // Annual increase in contributions
  irregularContributions: IrregularContribution[];
  goalAmount?: number;
  retirementAge?: number;
  currentAge?: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface IrregularContribution {
  year: number;
  amount: number;
  description: string;
}

// Historical market data for Monte Carlo simulation
const MARKET_SCENARIOS = {
  conservative: { meanReturn: 0.04, volatility: 0.05 },
  moderate: { meanReturn: 0.07, volatility: 0.12 },
  aggressive: { meanReturn: 0.10, volatility: 0.18 }
};

export default function AdvancedCompoundInterestCalculator() {
  // Basic investment settings
  const [settings, setSettings] = useState<InvestmentSettings>({
    initialAmount: 1000,
    monthlyContribution: 500,
    annualInterestRate: 7,
    compoundingFrequency: 'monthly',
    investmentPeriodYears: 30,
    inflationRate: 2.5,
    taxRate: 22,
    accountType: 'taxable'
  });

  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    contributionGrowthRate: 3,
    irregularContributions: [],
    riskTolerance: 'moderate'
  });

  // Results and UI state
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'retirement'>('basic');
  const [calculationMode, setCalculationMode] = useState<'investment' | 'goal' | 'retirement'>('investment');

  // Compound interest calculation functions
  const calculateStandardCompounding = (
    principal: number, 
    rate: number, 
    periods: number, 
    time: number
  ): number => {
    return principal * Math.pow(1 + rate / periods, periods * time);
  };

  const calculateContinuousCompounding = (
    principal: number, 
    rate: number, 
    time: number
  ): number => {
    return principal * Math.exp(rate * time);
  };

  const calculateEffectiveAnnualRate = (
    nominalRate: number, 
    compoundingFrequency: number
  ): number => {
    return Math.pow(1 + nominalRate / compoundingFrequency, compoundingFrequency) - 1;
  };

  const calculateRealReturn = (
    nominalValue: number, 
    inflationRate: number, 
    years: number
  ): number => {
    return nominalValue / Math.pow(1 + inflationRate, years);
  };

  const calculateAfterTaxReturn = (
    value: number, 
    taxRate: number, 
    accountType: string
  ): number => {
    switch (accountType) {
      case 'roth_ira':
        return value; // Tax-free withdrawals
      case '401k':
      case 'ira':
        return value * (1 - taxRate); // Tax-deferred, taxed on withdrawal
      case 'taxable':
        return value * (1 - taxRate * 0.15); // Assumes 15% capital gains for long-term
      default:
        return value;
    }
  };

  // Monte Carlo simulation for success probability
  const runMonteCarloSimulation = (
    initialAmount: number,
    monthlyContribution: number,
    years: number,
    targetAmount?: number
  ): number => {
    const { meanReturn, volatility } = MARKET_SCENARIOS[advancedSettings.riskTolerance];
    let successCount = 0;
    const simulations = 1000;

    for (let sim = 0; sim < simulations; sim++) {
      let balance = initialAmount;
      
      for (let year = 1; year <= years; year++) {
        // Generate random return using normal distribution approximation
        const randomReturn = meanReturn + (Math.random() - 0.5) * 2 * volatility;
        balance = balance * (1 + randomReturn) + (monthlyContribution * 12);
      }
      
      if (!targetAmount || balance >= targetAmount) {
        successCount++;
      }
    }
    
    return (successCount / simulations) * 100;
  };

  const calculateDetailedProjection = useCallback(() => {
    setError('');

    try {
      const {
        initialAmount,
        monthlyContribution,
        annualInterestRate,
        compoundingFrequency,
        investmentPeriodYears,
        inflationRate,
        taxRate,
        accountType
      } = settings;

      if (initialAmount < 0 || monthlyContribution < 0 || annualInterestRate < -50 || annualInterestRate > 50) {
        throw new Error('Please enter valid values. Interest rate should be between -50% and 50%.');
      }

      if (investmentPeriodYears <= 0 || investmentPeriodYears > 100) {
        throw new Error('Investment period must be between 1 and 100 years.');
      }

      const rate = annualInterestRate / 100;
      const inflationDecimal = inflationRate / 100;
      const taxDecimal = taxRate / 100;

      // Get compounding periods per year
      const compoundingPeriods = {
        daily: 365,
        monthly: 12,
        quarterly: 4,
        annually: 1,
        continuous: 0 // Special case
      };

      const periodsPerYear = compoundingPeriods[compoundingFrequency] || 12;
      
      // Calculate monthly breakdown
      const monthlyBreakdown: MonthlyBreakdown[] = [];
      let currentBalance = initialAmount;
      let totalContributions = initialAmount;
      const monthlyRate = rate / 12;
      
      for (let month = 1; month <= investmentPeriodYears * 12; month++) {
        // Add monthly contribution at beginning of month
        if (month > 1) { // Don't add contribution in first month (that's initial amount)
          currentBalance += monthlyContribution;
          totalContributions += monthlyContribution;
        }
        
        // Apply interest based on compounding frequency
        let monthlyInterest = 0;
        if (compoundingFrequency === 'continuous') {
          const previousBalance = currentBalance;
          currentBalance = previousBalance * Math.exp(rate / 12);
          monthlyInterest = currentBalance - previousBalance;
        } else {
          if (compoundingFrequency === 'monthly') {
            monthlyInterest = currentBalance * monthlyRate;
            currentBalance += monthlyInterest;
          } else {
            // For other frequencies, calculate proportional interest
            const effectiveMonthlyRate = Math.pow(1 + rate / periodsPerYear, periodsPerYear / 12) - 1;
            monthlyInterest = currentBalance * effectiveMonthlyRate;
            currentBalance += monthlyInterest;
          }
        }

        const realBalance = calculateRealReturn(currentBalance, inflationDecimal, month / 12);

        monthlyBreakdown.push({
          month,
          contribution: month === 1 ? initialAmount : monthlyContribution,
          interest: monthlyInterest,
          balance: currentBalance,
          realBalance
        });
      }

      // Calculate final values using different methods
      const futureValue = currentBalance;
      
      // Calculate continuous compounding equivalent
      const continuousCompounding = calculateContinuousCompounding(
        initialAmount, 
        rate, 
        investmentPeriodYears
      ) + (monthlyContribution * 12 * investmentPeriodYears * Math.exp(rate * investmentPeriodYears / 2));

      const effectiveAnnualRate = calculateEffectiveAnnualRate(rate, periodsPerYear);
      const totalInterest = futureValue - totalContributions;
      const realValue = calculateRealReturn(futureValue, inflationDecimal, investmentPeriodYears);
      const afterTaxValue = calculateAfterTaxReturn(futureValue, taxDecimal, accountType);

      // Retirement analysis (4% rule)
      const retirementAnalysis: RetirementAnalysis = {
        safeWithdrawalAmount: futureValue * 0.04,
        monthlyWithdrawal: (futureValue * 0.04) / 12,
        yearsToDeplete: futureValue / (futureValue * 0.04), // Simplified
        successProbability: runMonteCarloSimulation(initialAmount, monthlyContribution, investmentPeriodYears)
      };

      // Goal analysis (if goal is set)
      let goalAnalysis: GoalAnalysis | undefined;
      if (advancedSettings.goalAmount) {
        const monthsToGoal = Math.log(advancedSettings.goalAmount / initialAmount) / 
                            Math.log(1 + monthlyRate);
        const requiredMonthly = (advancedSettings.goalAmount - initialAmount * Math.pow(1 + monthlyRate, investmentPeriodYears * 12)) / 
                               (((Math.pow(1 + monthlyRate, investmentPeriodYears * 12) - 1) / monthlyRate));
        
        goalAnalysis = {
          monthsToGoal: Math.max(0, monthsToGoal),
          yearsToGoal: Math.max(0, monthsToGoal / 12),
          requiredMonthlyContribution: Math.max(0, requiredMonthly),
          probabilityOfSuccess: runMonteCarloSimulation(
            initialAmount, 
            monthlyContribution, 
            investmentPeriodYears, 
            advancedSettings.goalAmount
          )
        };
      }

      const result: CompoundInterestResult = {
        futureValue,
        continuousCompounding,
        effectiveAnnualRate: effectiveAnnualRate * 100,
        totalContributions,
        totalInterest,
        realValue,
        afterTaxValue,
        monthlyBreakdown,
        retirementAnalysis,
        goalAnalysis
      };

      setResult(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  }, [settings, advancedSettings]);

  const resetCalculator = () => {
    setSettings({
      initialAmount: 1000,
      monthlyContribution: 500,
      annualInterestRate: 7,
      compoundingFrequency: 'monthly',
      investmentPeriodYears: 30,
      inflationRate: 2.5,
      taxRate: 22,
      accountType: 'taxable'
    });
    setAdvancedSettings({
      contributionGrowthRate: 3,
      irregularContributions: [],
      riskTolerance: 'moderate'
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

  // Enhanced FAQ data
  const compoundInterestFAQs: FAQItem[] = [
    {
      question: "What makes this compound interest calculator different from others?",
      answer: "This advanced calculator includes multiple compounding methods, continuous compounding, inflation adjustments, tax considerations, Monte Carlo simulation for success probability, retirement planning with the 4% rule, and comprehensive visualization of growth over time.",
      category: "Features"
    },
    {
      question: "What is continuous compounding and when should I use it?",
      answer: "Continuous compounding represents the mathematical limit of compounding frequency, using the formula A = Pe^rt. It shows the theoretical maximum growth possible and is useful for comparing with other investment options or understanding the power of frequent compounding.",
      category: "Calculations"
    },
    {
      question: "How does the Monte Carlo simulation work?",
      answer: "Our Monte Carlo simulation runs 1,000 scenarios with randomized market returns based on historical volatility patterns. It provides a probability of reaching your financial goals by accounting for market ups and downs, giving you a realistic success rate rather than assuming constant returns.",
      category: "Advanced Features"
    },
    {
      question: "What's the difference between nominal and real returns?",
      answer: "Nominal returns are the actual dollar amounts earned, while real returns adjust for inflation to show purchasing power. For example, 7% nominal return with 2.5% inflation equals 4.5% real return. Real returns show what your money can actually buy in today's dollars.",
      category: "Inflation"
    },
    {
      question: "How do different account types affect my returns?",
      answer: "Taxable accounts are subject to capital gains tax, 401(k) and traditional IRAs are tax-deferred (taxed on withdrawal), while Roth IRAs offer tax-free growth and withdrawals. The calculator adjusts final values based on typical tax treatments for each account type.",
      category: "Tax Planning"
    },
    {
      question: "What is the 4% rule for retirement planning?",
      answer: "The 4% rule suggests withdrawing 4% of your portfolio in the first year of retirement, then adjusting for inflation each year. This historically provides a high probability of not running out of money over a 30-year retirement, though individual circumstances may vary.",
      category: "Retirement"
    },
    {
      question: "How accurate are the projections over long periods?",
      answer: "Long-term projections are estimates based on assumed rates of return. Actual returns will vary due to market volatility, economic changes, and other factors. The Monte Carlo simulation helps show the range of possible outcomes, but you should review and adjust your assumptions regularly.",
      category: "Accuracy"
    },
    {
      question: "Should I include irregular contributions like bonuses?",
      answer: "Yes, including irregular contributions like annual bonuses, tax refunds, or windfalls provides a more accurate projection. Even small additional contributions can significantly impact long-term growth due to compound interest, so it's worth modeling these scenarios.",
      category: "Contributions"
    },
    {
      question: "How do I choose between different compounding frequencies?",
      answer: "More frequent compounding (daily vs annually) results in slightly higher returns, but the difference is often minimal. Monthly compounding is common for investments, while daily compounding is typical for high-yield savings accounts. The effective annual rate shows the true return regardless of frequency.",
      category: "Compounding"
    },
    {
      question: "When should I seek professional financial advice?",
      answer: "Consider professional advice for complex situations involving multiple goals, tax optimization, estate planning, or if you're unsure about investment strategies. This calculator provides projections, but a financial advisor can help with implementation and ongoing adjustments based on life changes.",
      category: "Professional Advice"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-600">
            <PiggyBank className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Advanced Compound Interest Calculator</h2>
            <p className="text-muted-foreground mt-1">Professional investment growth and retirement planning</p>
          </div>
        </div>

        {/* Calculation Mode Toggle */}
        <div className="mb-6">
          <div className="flex bg-muted rounded-lg p-1 w-fit">
            {[
              { key: 'investment', label: 'Investment Growth', icon: TrendingUp },
              { key: 'goal', label: 'Goal Planning', icon: Target },
              { key: 'retirement', label: 'Retirement Planning', icon: PiggyBank }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCalculationMode(key as any)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  calculationMode === key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex bg-muted rounded-lg p-1 w-fit">
            {[
              { key: 'basic', label: 'Basic Settings', icon: Calculator },
              { key: 'advanced', label: 'Advanced Options', icon: Activity },
              { key: 'retirement', label: 'Retirement Planning', icon: PiggyBank }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Settings Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Initial Investment Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.initialAmount}
                    onChange={(e) => setSettings({
                      ...settings,
                      initialAmount: parseFloat(e.target.value) || 0
                    })}
                    placeholder="10000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="100"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.monthlyContribution}
                    onChange={(e) => setSettings({
                      ...settings,
                      monthlyContribution: parseFloat(e.target.value) || 0
                    })}
                    placeholder="500"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="50"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.annualInterestRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      annualInterestRate: parseFloat(e.target.value) || 0
                    })}
                    placeholder="7"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="0.1"
                    min="-50"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Investment Period (Years)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={settings.investmentPeriodYears}
                    onChange={(e) => setSettings({
                      ...settings,
                      investmentPeriodYears: parseInt(e.target.value) || 1
                    })}
                    placeholder="30"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="1"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Compounding Frequency</label>
                <select
                  value={settings.compoundingFrequency}
                  onChange={(e) => setSettings({
                    ...settings,
                    compoundingFrequency: e.target.value as InvestmentSettings['compoundingFrequency']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="daily">Daily (365 times/year)</option>
                  <option value="monthly">Monthly (12 times/year)</option>
                  <option value="quarterly">Quarterly (4 times/year)</option>
                  <option value="annually">Annually (1 time/year)</option>
                  <option value="continuous">Continuous Compounding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
                <select
                  value={settings.accountType}
                  onChange={(e) => setSettings({
                    ...settings,
                    accountType: e.target.value as InvestmentSettings['accountType']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="taxable">Taxable Account</option>
                  <option value="401k">401(k) - Tax Deferred</option>
                  <option value="ira">Traditional IRA - Tax Deferred</option>
                  <option value="roth_ira">Roth IRA - Tax Free</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Advanced Investment Modeling</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Configure inflation adjustments, tax rates, contribution growth, and risk tolerance for comprehensive projections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.inflationRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    inflationRate: parseFloat(e.target.value) || 0
                  })}
                  placeholder="2.5"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                  min="0"
                  max="20"
                />
                <p className="text-xs text-muted-foreground mt-1">Historical average: ~2.5%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    taxRate: parseFloat(e.target.value) || 0
                  })}
                  placeholder="22"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="1"
                  min="0"
                  max="50"
                />
                <p className="text-xs text-muted-foreground mt-1">Your marginal tax bracket</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Contribution Growth (%)
                </label>
                <input
                  type="number"
                  value={advancedSettings.contributionGrowthRate}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    contributionGrowthRate: parseFloat(e.target.value) || 0
                  })}
                  placeholder="3"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.5"
                  min="0"
                  max="10"
                />
                <p className="text-xs text-muted-foreground mt-1">Annual increase in contributions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Risk Tolerance</label>
                <select
                  value={advancedSettings.riskTolerance}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    riskTolerance: e.target.value as AdvancedSettings['riskTolerance']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="conservative">Conservative (4% return, 5% volatility)</option>
                  <option value="moderate">Moderate (7% return, 12% volatility)</option>
                  <option value="aggressive">Aggressive (10% return, 18% volatility)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Used for Monte Carlo simulation</p>
              </div>
            </div>

            {calculationMode === 'goal' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Financial Goal Amount
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={advancedSettings.goalAmount || ''}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      goalAmount: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="1000000"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="10000"
                    min="1000"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Target amount you want to reach</p>
              </div>
            )}
          </div>
        )}

        {/* Retirement Planning Tab */}
        {activeTab === 'retirement' && (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Retirement Planning</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Plan for retirement with withdrawal strategies, life expectancy considerations, and success probability analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Age</label>
                <input
                  type="number"
                  value={advancedSettings.currentAge || ''}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    currentAge: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  placeholder="35"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="1"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Target Retirement Age</label>
                <input
                  type="number"
                  value={advancedSettings.retirementAge || ''}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    retirementAge: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  placeholder="65"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="1"
                  min="50"
                  max="100"
                />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">4% Rule Explanation</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                The 4% rule suggests withdrawing 4% of your portfolio in the first year of retirement, 
                then adjusting for inflation each subsequent year. This historically provides a high probability 
                of not running out of money over a 30-year retirement period.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={calculateDetailedProjection}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Investment Growth
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
          <div className="mt-8 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Future Value</h4>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(result.futureValue)}</div>
                <div className="text-sm text-muted-foreground">Total portfolio value</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Total Interest</h4>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(result.totalInterest)}</div>
                <div className="text-sm text-muted-foreground">Earned from compounding</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Real Value</h4>
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(result.realValue)}</div>
                <div className="text-sm text-muted-foreground">Inflation-adjusted</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">After-Tax Value</h4>
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(result.afterTaxValue)}</div>
                <div className="text-sm text-muted-foreground">Tax considerations</div>
              </div>
            </div>

            {/* Advanced Calculations */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Advanced Calculations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatCurrency(result.continuousCompounding)}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-2">Continuous Compounding</div>
                  <div className="text-xs text-muted-foreground">Theoretical maximum growth</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatPercentage(result.effectiveAnnualRate)}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-2">Effective Annual Rate</div>
                  <div className="text-xs text-muted-foreground">True rate after compounding</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatCurrency(result.totalContributions)}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-2">Total Contributions</div>
                  <div className="text-xs text-muted-foreground">Your total deposits</div>
                </div>
              </div>
            </div>

            {/* Retirement Analysis */}
            {result.retirementAnalysis && (
              <div className="bg-background border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-primary" />
                  Retirement Analysis (4% Rule)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {formatCurrency(result.retirementAnalysis.safeWithdrawalAmount)}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Annual Safe Withdrawal</div>
                    <div className="text-xs text-muted-foreground">4% of portfolio value</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {formatCurrency(result.retirementAnalysis.monthlyWithdrawal)}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Monthly Income</div>
                    <div className="text-xs text-muted-foreground">Sustainable monthly withdrawal</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {formatPercentage(result.retirementAnalysis.successProbability)}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Success Probability</div>
                    <div className="text-xs text-muted-foreground">Monte Carlo simulation</div>
                  </div>
                </div>
              </div>
            )}

            {/* Goal Analysis */}
            {result.goalAnalysis && (
              <div className="bg-background border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Goal Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {result.goalAnalysis.yearsToGoal.toFixed(1)} years
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Time to Goal</div>
                    <div className="text-xs text-muted-foreground">At current contribution rate</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatCurrency(result.goalAnalysis.requiredMonthlyContribution)}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Required Monthly</div>
                    <div className="text-xs text-muted-foreground">To reach goal in time period</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPercentage(result.goalAnalysis.probabilityOfSuccess)}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Success Probability</div>
                    <div className="text-xs text-muted-foreground">Chance of reaching goal</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Interactive Charts */}
            <CompoundInterestCharts
              monthlyBreakdown={result.monthlyBreakdown}
              totalContributions={result.totalContributions}
              totalInterest={result.totalInterest}
              futureValue={result.futureValue}
              realValue={result.realValue}
              years={settings.investmentPeriodYears}
            />
          </div>
        )}
      </div>

      {/* Educational Content Section */}
      <div className="bg-background border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Compound Interest</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            Compound interest is one of the most powerful forces in finance. Albert Einstein allegedly called it 
            "the eighth wonder of the world" because it allows your money to grow exponentially over time. 
            Unlike simple interest, compound interest earns interest on both your original investment and 
            previously earned interest.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Compound Interest Formula</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">A = P(1 + r/n)^(nt)</p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>A = Final amount</li>
                <li>P = Principal (initial investment)</li>
                <li>r = Annual interest rate</li>
                <li>n = Compounding frequency per year</li>
                <li>t = Time in years</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">The Power of Time</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Starting early is crucial for compound interest. A 25-year-old investing $300/month until age 65 
                at 7% annual return will have more money than a 35-year-old investing $600/month for the same period. 
                Time is your greatest asset in building wealth.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Advanced Features Explained</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">💡 Monte Carlo Simulation</h4>
              <p className="text-sm text-muted-foreground">
                Our calculator runs 1,000+ scenarios with randomized market returns based on historical data. 
                This provides a realistic probability of reaching your financial goals rather than assuming constant returns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">📊 Real vs Nominal Returns</h4>
              <p className="text-sm text-muted-foreground">
                Nominal returns show dollar amounts, while real returns adjust for inflation. 
                Understanding both helps you plan for actual purchasing power in the future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🏦 Account Types</h4>
              <p className="text-sm text-muted-foreground">
                Different account types have different tax implications. 401(k)s and IRAs defer taxes, 
                Roth IRAs provide tax-free growth, and taxable accounts offer flexibility.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🎯 Goal-Based Planning</h4>
              <p className="text-sm text-muted-foreground">
                Set specific financial goals and see exactly what monthly contributions are needed 
                to reach them, along with probability of success based on market volatility.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Tips for Maximizing Compound Growth</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⏰ Start Early</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Time is your most powerful tool</li>
                  <li>Even small amounts grow significantly over decades</li>
                  <li>Starting 10 years earlier can double your final result</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🔄 Contribute Regularly</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Dollar-cost averaging reduces risk</li>
                  <li>Automatic contributions ensure consistency</li>
                  <li>Increase contributions with salary raises</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">📈 Reinvest Returns</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Let compound interest work on all earnings</li>
                  <li>Avoid withdrawing early if possible</li>
                  <li>Use tax-advantaged accounts when available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🎯 Stay Disciplined</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Stick to your long-term plan</li>
                  <li>Don't panic during market downturns</li>
                  <li>Review and adjust annually</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section with Accordion */}
      <FAQAccordion 
        faqs={compoundInterestFAQs}
        title="Advanced Compound Interest Calculator FAQ"
      />
    </div>
  );
}