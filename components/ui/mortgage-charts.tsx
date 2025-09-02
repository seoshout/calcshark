'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart3, PieChart, LineChart, DollarSign, Home, Shield, Zap } from 'lucide-react';

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

interface MortgageChartsProps {
  monthlyBreakdown: MonthlyBreakdown[];
  amortizationSchedule: AmortizationEntry[];
  totalLoanAmount: number;
  totalInterest: number;
  totalMonthlyPayment: number;
  loanTerm: number;
  className?: string;
}

export default function MortgageCharts({ 
  monthlyBreakdown,
  amortizationSchedule,
  totalLoanAmount,
  totalInterest,
  totalMonthlyPayment,
  loanTerm,
  className 
}: MortgageChartsProps) {
  const [activeChart, setActiveChart] = useState<'amortization' | 'payment' | 'equity' | 'comparison'>('amortization');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  // Generate extended amortization data for visualization (yearly data points)
  const generateAmortizationData = () => {
    const yearlyData = [];
    const monthlyRate = 0.075 / 12; // Example rate - would be calculated from props
    const totalPayments = loanTerm * 12;
    let remainingBalance = totalLoanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;
    
    const monthlyPI = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

    for (let year = 1; year <= loanTerm; year++) {
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPI - interestPayment;
        
        remainingBalance -= principalPayment;
        cumulativeInterest += interestPayment;
        cumulativePrincipal += principalPayment;

        if (month === 12) { // End of year
          yearlyData.push({
            year,
            balance: Math.max(0, remainingBalance),
            cumulativeInterest,
            cumulativePrincipal,
            equityBuilt: totalLoanAmount - remainingBalance
          });
        }

        if (remainingBalance <= 0) break;
      }
      if (remainingBalance <= 0) break;
    }

    return yearlyData;
  };

  const yearlyData = generateAmortizationData();
  const maxBalance = totalLoanAmount;

  // Amortization Schedule Chart
  const AmortizationChart = () => {
    return (
      <div className="h-80 relative">
        <div className="absolute inset-0 flex flex-col">
          {/* Y-axis labels */}
          <div className="flex-1 flex flex-col justify-between text-xs text-muted-foreground py-2">
            {[1, 0.75, 0.5, 0.25, 0].map((ratio, index) => (
              <div key={index} className="flex items-center">
                <span className="w-12 text-right mr-2">
                  {formatCompactCurrency(maxBalance * ratio)}
                </span>
                <div className="flex-1 h-px bg-border opacity-30" />
              </div>
            ))}
          </div>
          
          {/* Chart area */}
          <div className="h-full relative mt-4">
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 300">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  y1={300 - (ratio * 300)}
                  x2="800"
                  y2={300 - (ratio * 300)}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              
              {/* Remaining Balance Line */}
              <path
                d={`M ${yearlyData.map((d, i) => 
                  `${(i * 800) / (yearlyData.length - 1)},${300 - (d.balance / maxBalance * 300)}`
                ).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {/* Principal Paid Area */}
              <path
                d={`M ${yearlyData.map((d, i) => {
                  const x = (i * 800) / (yearlyData.length - 1);
                  const y = 300 - ((totalLoanAmount - d.balance) / maxBalance * 300);
                  return `${x},${y}`;
                }).join(' L ')} L 800,300 L 0,300 Z`}
                fill="rgb(34 197 94 / 0.1)" // green
              />
              
              {/* Interest Paid Area */}
              <path
                d={`M ${yearlyData.map((d, i) => {
                  const x = (i * 800) / (yearlyData.length - 1);
                  const y = 300 - (d.cumulativeInterest / maxBalance * 300);
                  return `${x},${y}`;
                }).join(' L ')} L 800,300 L 0,300 Z`}
                fill="rgb(239 68 68 / 0.1)" // red
              />
              
              {/* Data points */}
              {yearlyData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={(i * 800) / (yearlyData.length - 1)}
                    cy={300 - (d.balance / maxBalance * 300)}
                    r="4"
                    fill="hsl(var(--primary))"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                </g>
              ))}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
            <span>Year 1</span>
            <span>Year {Math.floor(loanTerm/2)}</span>
            <span>Year {loanTerm}</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border rounded-lg p-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-primary mr-2 rounded"></div>
              <span>Remaining Balance</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-green-500/30 mr-2 rounded"></div>
              <span>Principal Paid</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-red-500/30 mr-2 rounded"></div>
              <span>Interest Paid</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Payment Breakdown Chart
  const PaymentBreakdownChart = () => {
    const firstYearData = monthlyBreakdown.slice(0, 12);
    
    return (
      <div className="h-80 flex flex-col">
        <div className="flex-1">
          <h4 className="font-medium mb-4 text-center">Monthly Payment Components (First Year)</h4>
          
          {/* Stacked Bar Chart */}
          <div className="space-y-3">
            {firstYearData.slice(0, 6).map((month, index) => {
              const maxPayment = Math.max(...firstYearData.map(m => m.payment));
              const principalWidth = (month.principal / maxPayment) * 100;
              const interestWidth = (month.interest / maxPayment) * 100;
              const taxesWidth = (month.taxes / maxPayment) * 100;
              const insuranceWidth = (month.insurance / maxPayment) * 100;
              const pmiWidth = (month.pmi / maxPayment) * 100;
              const hoaWidth = (month.hoa / maxPayment) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-16 text-sm font-medium">Month {month.month}</div>
                  <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                    {/* Principal */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-center"
                      style={{ width: `${principalWidth}%` }}
                    >
                      {principalWidth > 15 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.principal)}</span>}
                    </div>
                    {/* Interest */}
                    <div 
                      className="absolute top-0 h-full bg-red-500 flex items-center justify-center"
                      style={{ left: `${principalWidth}%`, width: `${interestWidth}%` }}
                    >
                      {interestWidth > 15 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.interest)}</span>}
                    </div>
                    {/* Taxes */}
                    <div 
                      className="absolute top-0 h-full bg-blue-500 flex items-center justify-center"
                      style={{ left: `${principalWidth + interestWidth}%`, width: `${taxesWidth}%` }}
                    >
                      {taxesWidth > 10 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.taxes)}</span>}
                    </div>
                    {/* Insurance */}
                    <div 
                      className="absolute top-0 h-full bg-purple-500 flex items-center justify-center"
                      style={{ left: `${principalWidth + interestWidth + taxesWidth}%`, width: `${insuranceWidth}%` }}
                    >
                      {insuranceWidth > 8 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.insurance)}</span>}
                    </div>
                    {/* PMI */}
                    {month.pmi > 0 && (
                      <div 
                        className="absolute top-0 h-full bg-orange-500 flex items-center justify-center"
                        style={{ left: `${principalWidth + interestWidth + taxesWidth + insuranceWidth}%`, width: `${pmiWidth}%` }}
                      >
                        {pmiWidth > 5 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.pmi)}</span>}
                      </div>
                    )}
                    {/* HOA */}
                    {month.hoa > 0 && (
                      <div 
                        className="absolute top-0 h-full bg-teal-500 flex items-center justify-center"
                        style={{ left: `${principalWidth + interestWidth + taxesWidth + insuranceWidth + pmiWidth}%`, width: `${hoaWidth}%` }}
                      >
                        {hoaWidth > 5 && <span className="text-white text-xs font-medium">{formatCompactCurrency(month.hoa)}</span>}
                      </div>
                    )}
                  </div>
                  <div className="w-20 text-sm font-medium text-right">
                    {formatCurrency(month.payment)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Principal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Interest</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Taxes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span>Insurance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span>PMI</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded mr-2"></div>
            <span>HOA</span>
          </div>
        </div>
      </div>
    );
  };

  // Equity Building Chart
  const EquityBuildingChart = () => {
    return (
      <div className="h-80 relative">
        <h4 className="font-medium mb-4 text-center">Equity Building Over Time</h4>
        
        <div className="h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line 
                key={y}
                x1="0" 
                y1={y * 2} 
                x2="400" 
                y2={y * 2} 
                stroke="currentColor" 
                strokeOpacity="0.1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Equity Growth Area */}
            <path
              fill="rgba(34, 197, 94, 0.2)"
              stroke="rgb(34, 197, 94)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              d={`M 0,200 ${yearlyData.map((d, i) => 
                `L ${(i / (yearlyData.length - 1)) * 400},${200 - ((d.equityBuilt / totalLoanAmount) * 200)}`
              ).join(' ')} L 400,200 Z`}
            />

            {/* Loan Balance Area */}
            <path
              fill="rgba(239, 68, 68, 0.2)"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              d={`M 0,0 ${yearlyData.map((d, i) => 
                `L ${(i / (yearlyData.length - 1)) * 400},${200 - ((d.balance / totalLoanAmount) * 200)}`
              ).join(' ')} L 400,0 Z`}
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
            <span>{formatCompactCurrency(totalLoanAmount)}</span>
            <span>{formatCompactCurrency(totalLoanAmount * 0.75)}</span>
            <span>{formatCompactCurrency(totalLoanAmount * 0.5)}</span>
            <span>{formatCompactCurrency(totalLoanAmount * 0.25)}</span>
            <span>$0</span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-12">
            <span>Year 0</span>
            <span>Year {Math.floor(loanTerm/2)}</span>
            <span>Year {loanTerm}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-12 right-4 bg-background/80 backdrop-blur-sm border rounded-lg p-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-green-500 mr-2 rounded"></div>
              <span>Home Equity</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-red-500 mr-2 rounded"></div>
              <span>Loan Balance</span>
            </div>
          </div>
        </div>

        {/* Key Milestones */}
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div className="font-medium">20% Equity</div>
              <div className="text-muted-foreground">Year {Math.ceil(loanTerm * 0.3)}</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <div className="font-medium">50% Equity</div>
              <div className="text-muted-foreground">Year {Math.ceil(loanTerm * 0.7)}</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-1"></div>
              <div className="font-medium">Paid Off</div>
              <div className="text-muted-foreground">Year {loanTerm}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Comparison Analysis Chart
  const ComparisonChart = () => {
    // Sample data for different scenarios
    const scenarios = [
      { name: '30-Year Fixed', payment: totalMonthlyPayment, totalInterest: totalInterest, color: 'bg-blue-500' },
      { name: '15-Year Fixed', payment: totalMonthlyPayment * 1.4, totalInterest: totalInterest * 0.4, color: 'bg-green-500' },
      { name: 'Biweekly Payments', payment: totalMonthlyPayment * 1.08, totalInterest: totalInterest * 0.7, color: 'bg-purple-500' },
      { name: '+$200 Extra', payment: totalMonthlyPayment + 200, totalInterest: totalInterest * 0.75, color: 'bg-orange-500' }
    ];

    const maxPayment = Math.max(...scenarios.map(s => s.payment));
    const maxInterest = Math.max(...scenarios.map(s => s.totalInterest));

    return (
      <div className="h-80 flex flex-col">
        <h4 className="font-medium mb-4 text-center">Payment Strategy Comparison</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* Monthly Payment Comparison */}
          <div>
            <h5 className="text-sm font-medium mb-3">Monthly Payment</h5>
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{scenario.name}</span>
                    <span className="font-medium">{formatCurrency(scenario.payment)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={cn("h-3 transition-all duration-1000 ease-out", scenario.color)}
                      style={{ width: `${(scenario.payment / maxPayment) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Interest Comparison */}
          <div>
            <h5 className="text-sm font-medium mb-3">Total Interest Paid</h5>
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{scenario.name}</span>
                    <span className="font-medium">{formatCompactCurrency(scenario.totalInterest)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={cn("h-3 transition-all duration-1000 ease-out", scenario.color)}
                      style={{ width: `${(scenario.totalInterest / maxInterest) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-primary text-lg">{loanTerm}y</div>
              <div className="text-muted-foreground">Loan Term</div>
            </div>
            <div>
              <div className="font-bold text-green-600 text-lg">
                {((totalLoanAmount / totalInterest) * 100).toFixed(0)}%
              </div>
              <div className="text-muted-foreground">Principal Ratio</div>
            </div>
            <div>
              <div className="font-bold text-blue-600 text-lg">
                {formatCompactCurrency(totalMonthlyPayment * 12)}
              </div>
              <div className="text-muted-foreground">Annual Payment</div>
            </div>
            <div>
              <div className="font-bold text-purple-600 text-lg">
                {((totalInterest / totalLoanAmount) * 100).toFixed(0)}%
              </div>
              <div className="text-muted-foreground">Interest Cost</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("bg-background border rounded-xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Mortgage Analysis Visualizations</h3>
        
        {/* Chart Type Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          {[
            { key: 'amortization', label: 'Amortization', icon: LineChart },
            { key: 'payment', label: 'Payments', icon: BarChart3 },
            { key: 'equity', label: 'Equity', icon: TrendingUp },
            { key: 'comparison', label: 'Compare', icon: PieChart }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeChart === key 
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
      
      {/* Chart Content */}
      <div className="min-h-[320px]">
        {activeChart === 'amortization' && <AmortizationChart />}
        {activeChart === 'payment' && <PaymentBreakdownChart />}
        {activeChart === 'equity' && <EquityBuildingChart />}
        {activeChart === 'comparison' && <ComparisonChart />}
      </div>
      
      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{formatCompactCurrency(totalLoanAmount)}</div>
            <div className="text-sm text-muted-foreground">Loan Amount</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCompactCurrency(totalInterest)}
            </div>
            <div className="text-sm text-muted-foreground">Total Interest</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalMonthlyPayment)}
            </div>
            <div className="text-sm text-muted-foreground">Monthly Payment</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {loanTerm} years
            </div>
            <div className="text-sm text-muted-foreground">Loan Term</div>
          </div>
        </div>
      </div>
    </div>
  );
}