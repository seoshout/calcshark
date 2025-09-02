'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';

interface MonthlyBreakdown {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
  realBalance: number;
}

interface CompoundInterestChartsProps {
  monthlyBreakdown: MonthlyBreakdown[];
  totalContributions: number;
  totalInterest: number;
  futureValue: number;
  realValue: number;
  years: number;
  className?: string;
}

export default function CompoundInterestCharts({ 
  monthlyBreakdown,
  totalContributions,
  totalInterest,
  futureValue,
  realValue,
  years
}: CompoundInterestChartsProps) {
  const [activeChart, setActiveChart] = useState<'growth' | 'breakdown' | 'comparison' | 'inflation'>('growth');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Growth Timeline Chart
  const GrowthTimelineChart = () => {
    // Sample data points for visualization (every 5 years)
    const yearlyData = [];
    for (let year = 1; year <= years; year++) {
      const monthIndex = (year * 12) - 1;
      if (monthlyBreakdown[monthIndex]) {
        yearlyData.push({
          year,
          balance: monthlyBreakdown[monthIndex].balance,
          realBalance: monthlyBreakdown[monthIndex].realBalance,
          contributions: monthlyBreakdown[monthIndex].contribution * year * 12,
          interest: monthlyBreakdown[monthIndex].balance - (monthlyBreakdown[monthIndex].contribution * year * 12)
        });
      }
    }

    const maxValue = Math.max(...yearlyData.map(d => d.balance));

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <LineChart className="h-4 w-4 mr-2 text-primary" />
          Investment Growth Over Time
        </h3>
        
        <div className="relative h-64 bg-muted/20 rounded-lg p-4">
          <div className="absolute inset-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(maxValue)}</span>
              <span>{formatCurrency(maxValue * 0.75)}</span>
              <span>{formatCurrency(maxValue * 0.5)}</span>
              <span>{formatCurrency(maxValue * 0.25)}</span>
              <span>$0</span>
            </div>

            {/* Chart area */}
            <div className="ml-16 h-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                  <line 
                    key={y}
                    x1="0" 
                    y1={y} 
                    x2="100" 
                    y2={y} 
                    stroke="currentColor" 
                    strokeOpacity="0.1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* Growth line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  points={yearlyData.map((d, i) => 
                    `${(i / (yearlyData.length - 1)) * 100},${100 - (d.balance / maxValue) * 100}`
                  ).join(' ')}
                />

                {/* Real value line */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  vectorEffect="non-scaling-stroke"
                  points={yearlyData.map((d, i) => 
                    `${(i / (yearlyData.length - 1)) * 100},${100 - (d.realBalance / maxValue) * 100}`
                  ).join(' ')}
                />
              </svg>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                <span>Year 1</span>
                <span>Year {Math.floor(years/2)}</span>
                <span>Year {years}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span>Nominal Value</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 mr-2"></div>
            <span>Real Value (Inflation-Adjusted)</span>
          </div>
        </div>
      </div>
    );
  };

  // Principal vs Interest Breakdown
  const BreakdownChart = () => {
    const principalPercentage = (totalContributions / futureValue) * 100;
    const interestPercentage = (totalInterest / futureValue) * 100;

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <PieChart className="h-4 w-4 mr-2 text-primary" />
          Principal vs Interest Breakdown
        </h3>
        
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-muted stroke-current"
                fill="transparent"
                strokeWidth="2"
                strokeDasharray="100, 100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Principal portion */}
              <path
                className="text-blue-600 stroke-current"
                fill="transparent"
                strokeWidth="2"
                strokeDasharray={`${principalPercentage}, 100`}
                strokeLinecap="round"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Interest portion */}
              <path
                className="text-green-600 stroke-current"
                fill="transparent"
                strokeWidth="2"
                strokeDasharray={`${interestPercentage}, 100`}
                strokeDashoffset={`-${principalPercentage}`}
                strokeLinecap="round"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{formatCurrency(futureValue)}</div>
                <div className="text-xs text-muted-foreground">Total Value</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              <span className="font-medium">Your Contributions</span>
            </div>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(totalContributions)}</div>
            <div className="text-sm text-muted-foreground">{principalPercentage.toFixed(1)}% of total</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
              <span className="font-medium">Interest Earned</span>
            </div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalInterest)}</div>
            <div className="text-sm text-muted-foreground">{interestPercentage.toFixed(1)}% of total</div>
          </div>
        </div>
      </div>
    );
  };

  // Compounding Frequency Comparison
  const ComparisonChart = () => {
    const principal = totalContributions;
    const rate = 0.07; // Example 7% rate
    const time = years;

    const compoundingScenarios = [
      { frequency: 'Annually', periods: 1, value: principal * Math.pow(1 + rate / 1, 1 * time) },
      { frequency: 'Quarterly', periods: 4, value: principal * Math.pow(1 + rate / 4, 4 * time) },
      { frequency: 'Monthly', periods: 12, value: principal * Math.pow(1 + rate / 12, 12 * time) },
      { frequency: 'Daily', periods: 365, value: principal * Math.pow(1 + rate / 365, 365 * time) },
      { frequency: 'Continuous', periods: 0, value: principal * Math.exp(rate * time) }
    ];

    const maxValue = Math.max(...compoundingScenarios.map(s => s.value));

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-primary" />
          Compounding Frequency Comparison
        </h3>
        
        <div className="space-y-3">
          {compoundingScenarios.map((scenario, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium">{scenario.frequency}</div>
              <div className="flex-1 bg-muted rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                  style={{ width: `${(scenario.value / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {formatCurrency(scenario.value)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This comparison shows the effect of compounding frequency on a single lump sum. 
            The difference becomes more pronounced over longer time periods and with higher interest rates.
          </p>
        </div>
      </div>
    );
  };

  // Inflation Impact Chart
  const InflationImpactChart = () => {
    const inflationLoss = futureValue - realValue;
    const inflationRate = ((inflationLoss / futureValue) * 100);

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          Inflation Impact Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(futureValue)}</div>
            <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Nominal Value</div>
            <div className="text-xs text-green-700 dark:text-green-300">Face value of your investment</div>
          </div>
          
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(realValue)}</div>
            <div className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">Real Value</div>
            <div className="text-xs text-orange-700 dark:text-orange-300">Purchasing power in today's dollars</div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(inflationLoss)}</div>
            <div className="text-sm font-medium text-red-800 dark:text-red-200">Purchasing Power Lost to Inflation</div>
          </div>
          
          <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-4">
            <div 
              className="bg-red-600 h-4 rounded-full transition-all duration-1000 flex items-center justify-center"
              style={{ width: `${inflationRate}%` }}
            >
              <span className="text-white text-xs font-medium">
                {inflationRate.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <p className="text-sm text-red-800 dark:text-red-200 mt-2 text-center">
            Inflation reduces your purchasing power over {years} years
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Investment Visualization</h2>
        <div className="flex bg-muted rounded-lg p-1">
          {[
            { key: 'growth', label: 'Growth', icon: LineChart },
            { key: 'breakdown', label: 'Breakdown', icon: PieChart },
            { key: 'comparison', label: 'Comparison', icon: BarChart3 },
            { key: 'inflation', label: 'Inflation', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={cn(
                "flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                activeChart === key 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeChart === 'growth' && <GrowthTimelineChart />}
        {activeChart === 'breakdown' && <BreakdownChart />}
        {activeChart === 'comparison' && <ComparisonChart />}
        {activeChart === 'inflation' && <InflationImpactChart />}
      </div>
    </div>
  );
}