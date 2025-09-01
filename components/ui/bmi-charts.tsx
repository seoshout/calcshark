'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface BMIChartsProps {
  standardBMI: number;
  newBMI: number;
  smartBMI: number;
  bmiPrime: number;
  category: string;
  ethnicity?: string;
}

export default function BMICharts({ 
  standardBMI, 
  newBMI, 
  smartBMI, 
  bmiPrime, 
  category,
  ethnicity = 'other'
}: BMIChartsProps) {
  const [activeChart, setActiveChart] = useState<'comparison' | 'scale' | 'percentile'>('comparison');

  // BMI ranges for different ethnicities
  const ethnicRanges = {
    asian: { underweight: 18.5, normal: 23, overweight: 27.5, obese: 35 },
    african: { underweight: 18.5, normal: 25, overweight: 28.1, obese: 35 },
    caucasian: { underweight: 18.5, normal: 25, overweight: 30, obese: 35 },
    hispanic: { underweight: 18.5, normal: 25, overweight: 30, obese: 35 },
    middle_eastern: { underweight: 18.5, normal: 25, overweight: 26.6, obese: 35 },
    other: { underweight: 18.5, normal: 25, overweight: 30, obese: 35 }
  };

  const ranges = ethnicRanges[ethnicity as keyof typeof ethnicRanges] || ethnicRanges.other;

  const BMIComparisonChart = () => {
    const maxBMI = Math.max(standardBMI, newBMI, smartBMI) + 5;
    const bmiData = [
      { name: 'Standard BMI', value: standardBMI, color: 'bg-blue-500' },
      { name: 'New BMI', value: newBMI, color: 'bg-purple-500' },
      { name: 'Smart BMI', value: smartBMI, color: 'bg-green-500' }
    ];

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-primary" />
          BMI Method Comparison
        </h3>
        {bmiData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.value.toFixed(1)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={cn("h-3 rounded-full transition-all duration-1000", item.color)}
                style={{ width: `${(item.value / maxBMI) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Different BMI formulas can show varying results. 
            Standard BMI is most common, New BMI corrects height bias, Smart BMI adds demographic factors.
          </p>
        </div>
      </div>
    );
  };

  const BMIScaleVisualization = () => {
    const scaleSegments = [
      { range: `<${ranges.underweight}`, label: 'Underweight', color: 'bg-blue-500', width: 15 },
      { range: `${ranges.underweight}-${ranges.normal}`, label: 'Normal', color: 'bg-green-500', width: 35 },
      { range: `${ranges.normal}-${ranges.overweight}`, label: 'Overweight', color: 'bg-yellow-500', width: 25 },
      { range: `${ranges.overweight}+`, label: 'Obese', color: 'bg-red-500', width: 25 }
    ];

    const getCurrentPosition = () => {
      if (standardBMI < ranges.underweight) return 7.5;
      if (standardBMI < ranges.normal) return 15 + ((standardBMI - ranges.underweight) / (ranges.normal - ranges.underweight)) * 35;
      if (standardBMI < ranges.overweight) return 50 + ((standardBMI - ranges.normal) / (ranges.overweight - ranges.normal)) * 25;
      return Math.min(95, 75 + ((standardBMI - ranges.overweight) / 10) * 25);
    };

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          BMI Scale Position
        </h3>
        <div className="relative">
          <div className="flex h-8 rounded-full overflow-hidden">
            {scaleSegments.map((segment, index) => (
              <div
                key={index}
                className={cn("flex items-center justify-center text-xs font-medium text-white", segment.color)}
                style={{ width: `${segment.width}%` }}
              >
                {segment.width > 20 && segment.label}
              </div>
            ))}
          </div>
          
          {/* BMI Indicator */}
          <div 
            className="absolute -top-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-800 transform -translate-x-1/2"
            style={{ left: `${getCurrentPosition()}%` }}
          />
          <div 
            className="absolute top-8 transform -translate-x-1/2 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded"
            style={{ left: `${getCurrentPosition()}%` }}
          >
            {standardBMI.toFixed(1)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {scaleSegments.map((segment, index) => (
            <div key={index} className="text-center">
              <div className={cn("w-4 h-4 rounded mx-auto mb-1", segment.color)}></div>
              <div className="text-xs font-medium">{segment.label}</div>
              <div className="text-xs text-muted-foreground">{segment.range}</div>
            </div>
          ))}
        </div>

        {ethnicity !== 'other' && ethnicity !== 'caucasian' && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-orange-800 dark:text-orange-200">
              <strong>Ethnicity-Adjusted Scale:</strong> This scale uses {ethnicity} population-specific BMI cutoffs 
              based on health research showing different ethnic groups have varying risks at the same BMI levels.
            </p>
          </div>
        )}
      </div>
    );
  };

  const BMIPercentileChart = () => {
    // Simplified percentile estimation (would normally use population data)
    const getPercentile = (bmi: number) => {
      if (bmi < 18.5) return Math.max(5, (bmi / 18.5) * 15);
      if (bmi < 25) return 15 + ((bmi - 18.5) / (25 - 18.5)) * 50;
      if (bmi < 30) return 65 + ((bmi - 25) / (30 - 25)) * 25;
      return Math.min(95, 90 + ((bmi - 30) / 10) * 5);
    };

    const percentile = Math.round(getPercentile(standardBMI));

    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <PieChart className="h-4 w-4 mr-2 text-primary" />
          Population Percentile
        </h3>
        
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                fill="none"
                strokeWidth="2"
                strokeDasharray="100, 100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current"
                fill="none"
                strokeWidth="2"
                strokeDasharray={`${percentile}, 100`}
                strokeLinecap="round"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{percentile}%</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Your BMI is higher than <strong>{percentile}%</strong> of the population
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-primary">{getPercentile(newBMI).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">New BMI</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-primary">{(bmiPrime * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">BMI Prime</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-bold text-primary">{getPercentile(smartBMI).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Smart BMI</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-800 dark:text-green-200">
            <strong>Percentile Interpretation:</strong> This shows where your BMI falls relative to the general population. 
            Remember that BMI alone doesn't determine health status.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">BMI Visualization</h2>
        <div className="flex bg-muted rounded-lg p-1">
          {[
            { key: 'comparison', label: 'Compare', icon: BarChart3 },
            { key: 'scale', label: 'Scale', icon: TrendingUp },
            { key: 'percentile', label: 'Percentile', icon: PieChart }
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
        {activeChart === 'comparison' && <BMIComparisonChart />}
        {activeChart === 'scale' && <BMIScaleVisualization />}
        {activeChart === 'percentile' && <BMIPercentileChart />}
      </div>
    </div>
  );
}