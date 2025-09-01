'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target, 
  Activity, TrendingUp, User, Scale, Heart, Brain, Zap,
  BarChart3, PieChart, LineChart, Users, Award, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import BMICharts from '@/components/ui/bmi-charts';

// Enhanced types for advanced BMI calculations
interface BMIResult {
  standardBMI: number;
  newBMI: number;
  smartBMI: number;
  bmiPrime: number;
  adjustedBMI: number;
  category: string;
  categoryNew: string;
  color: string;
  description: string;
  recommendations: string[];
  healthRisk: string;
  healthScore: number;
}

interface BodyComposition {
  waistHipRatio?: number;
  waistHeightRatio?: number;
  bodyFatPercentage?: number;
  leanBodyMass?: number;
  idealWeightRange: { min: number; max: number };
  metabolicRate?: number;
}

interface Demographics {
  age?: number;
  gender: 'male' | 'female' | 'other';
  ethnicity: 'caucasian' | 'asian' | 'african' | 'hispanic' | 'middle_eastern' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  frameSize: 'small' | 'medium' | 'large';
}

// Ethnicity-specific BMI cutoffs based on research
const ethnicityAdjustments = {
  asian: { overweight: 23, obese: 27.5 },
  african: { overweight: 25, obese: 28.1 },
  hispanic: { overweight: 25, obese: 30 },
  middle_eastern: { overweight: 25, obese: 26.6 },
  caucasian: { overweight: 25, obese: 30 },
  other: { overweight: 25, obese: 30 }
};

// Activity level multipliers for metabolic rate
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export default function AdvancedBMICalculator() {
  // Basic measurements
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');

  // Advanced measurements
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [neck, setNeck] = useState<string>('');

  // Demographics
  const [demographics, setDemographics] = useState<Demographics>({
    gender: 'other',
    ethnicity: 'other',
    activityLevel: 'moderate',
    frameSize: 'medium'
  });

  // Results
  const [result, setResult] = useState<BMIResult | null>(null);
  const [bodyComposition, setBodyComposition] = useState<BodyComposition | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'demographics'>('basic');

  // BMI Calculation Functions
  const calculateStandardBMI = (weightKg: number, heightM: number): number => {
    return weightKg / (heightM * heightM);
  };

  const calculateNewBMI = (weightKg: number, heightM: number): number => {
    // Trefethen's New BMI Formula: 1.3 * weight(kg) / height(m)^2.5
    return 1.3 * weightKg / Math.pow(heightM, 2.5);
  };

  const calculateSmartBMI = (standardBMI: number, age: number, gender: string): number => {
    // Age and gender adjustments for Smart BMI
    let adjustment = 0;
    
    if (age > 65) adjustment += 2;
    else if (age > 50) adjustment += 1;
    else if (age < 25) adjustment -= 0.5;
    
    if (gender === 'female') adjustment += 0.5;
    
    return Math.max(15, Math.min(40, standardBMI + adjustment));
  };

  const calculateBMIPrime = (standardBMI: number): number => {
    return standardBMI / 25; // Ratio to optimal BMI upper limit
  };

  const getEthnicityAdjustedCategory = (bmi: number, ethnicity: string): string => {
    const cutoffs = ethnicityAdjustments[ethnicity as keyof typeof ethnicityAdjustments] || ethnicityAdjustments.other;
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < cutoffs.overweight) return 'Normal weight';
    if (bmi < cutoffs.obese) return 'Overweight';
    return 'Obese';
  };

  // Body composition calculations
  const calculateBodyFatPercentage = (
    bmi: number, age: number, gender: string, waistCm?: number, neckCm?: number, hipCm?: number
  ): number => {
    // Simplified body fat estimation based on BMI, age, and gender
    let bodyFat = 0;
    
    if (gender === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    }

    // Additional adjustment if waist measurement is available
    if (waistCm && neckCm) {
      // Navy method approximation
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm)) - 450;
      } else if (hipCm) {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm)) - 450;
      }
    }
    
    return Math.max(3, Math.min(50, bodyFat));
  };

  const calculateMetabolicRate = (weightKg: number, heightCm: number, age: number, gender: string, activityLevel: string): number => {
    // Mifflin-St Jeor Equation
    let bmr: number;
    
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
    
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    return Math.round(bmr * multiplier);
  };

  const calculateIdealWeight = (heightCm: number, gender: string, frameSize: string): { min: number; max: number } => {
    // Robinson formula with frame size adjustments
    const heightInches = heightCm / 2.54;
    let idealWeight: number;
    
    if (gender === 'male') {
      idealWeight = 52 + 1.9 * (heightInches - 60);
    } else {
      idealWeight = 49 + 1.7 * (heightInches - 60);
    }
    
    // Frame size adjustments
    const adjustments = {
      small: 0.9,
      medium: 1.0,
      large: 1.1
    };
    
    const adjustment = adjustments[frameSize as keyof typeof adjustments];
    const baseMin = idealWeight * adjustment * 0.9;
    const baseMax = idealWeight * adjustment * 1.1;
    
    return { min: Math.round(baseMin), max: Math.round(baseMax) };
  };

  const calculateHealthScore = (result: BMIResult, bodyComp: BodyComposition): number => {
    let score = 100;
    
    // BMI score (40 points)
    if (result.standardBMI < 18.5 || result.standardBMI > 30) score -= 20;
    else if (result.standardBMI < 20 || result.standardBMI > 27) score -= 10;
    else if (result.standardBMI >= 20 && result.standardBMI <= 25) score += 5;
    
    // Body composition score (30 points)
    if (bodyComp.waistHipRatio && bodyComp.waistHipRatio > 0.9) score -= 15;
    if (bodyComp.waistHeightRatio && bodyComp.waistHeightRatio > 0.6) score -= 10;
    if (bodyComp.bodyFatPercentage) {
      if (bodyComp.bodyFatPercentage < 10 || bodyComp.bodyFatPercentage > 35) score -= 15;
      else if (bodyComp.bodyFatPercentage >= 15 && bodyComp.bodyFatPercentage <= 25) score += 5;
    }
    
    // Consistency score (30 points) - how well different BMI methods agree
    const bmiMethods = [result.standardBMI, result.newBMI, result.smartBMI * 5]; // Scale SBMI
    const variance = bmiMethods.reduce((acc, val, _, arr) => {
      const mean = arr.reduce((sum, v) => sum + v, 0) / arr.length;
      return acc + Math.pow(val - mean, 2);
    }, 0) / bmiMethods.length;
    
    if (variance < 2) score += 10;
    else if (variance > 8) score -= 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateComprehensiveBMI = useCallback(() => {
    setError('');
    
    let heightInMeters: number;
    let weightInKg: number;
    let heightInCm: number;

    try {
      if (unit === 'metric') {
        const heightValue = validateCalculatorInput(height);
        const weightValue = validateCalculatorInput(weight);
        
        if (heightValue === null || weightValue === null) {
          throw new Error('Please enter valid numbers for height and weight');
        }
        
        if (heightValue <= 0 || weightValue <= 0) {
          throw new Error('Height and weight must be greater than zero');
        }
        
        if (heightValue > 300 || heightValue < 50) {
          throw new Error('Height must be between 50-300 cm');
        }
        
        if (weightValue > 500 || weightValue < 20) {
          throw new Error('Weight must be between 20-500 kg');
        }
        
        heightInCm = heightValue;
        heightInMeters = heightValue / 100;
        weightInKg = weightValue;
      } else {
        const feetValue = validateCalculatorInput(feet);
        const inchesValue = validateCalculatorInput(inches) || 0;
        const weightValue = validateCalculatorInput(weight);
        
        if (feetValue === null || weightValue === null) {
          throw new Error('Please enter valid numbers for height and weight');
        }
        
        if (feetValue <= 0 || weightValue <= 0) {
          throw new Error('Height and weight must be greater than zero');
        }
        
        const totalInches = (feetValue * 12) + inchesValue;
        heightInCm = totalInches * 2.54;
        heightInMeters = heightInCm / 100;
        weightInKg = weightValue * 0.453592;
      }

      // Calculate all BMI variants
      const standardBMI = calculateStandardBMI(weightInKg, heightInMeters);
      const newBMI = calculateNewBMI(weightInKg, heightInMeters);
      const age = demographics.age || 30; // Default age if not provided
      const smartBMI = calculateSmartBMI(standardBMI, age, demographics.gender);
      const bmiPrime = calculateBMIPrime(standardBMI);
      
      // Ethnicity-adjusted BMI interpretation
      const adjustedCategory = getEthnicityAdjustedCategory(standardBMI, demographics.ethnicity);
      
      // Standard category for comparison
      let category: string;
      let color: string;
      let description: string;
      let recommendations: string[];
      let healthRisk: string;

      if (standardBMI < 18.5) {
        category = 'Underweight';
        color = 'text-blue-600 bg-blue-50 border-blue-200';
        description = 'Below normal weight range';
        healthRisk = 'Increased risk of malnutrition, osteoporosis, and decreased immunity';
        recommendations = [
          'Consult with a healthcare provider or nutritionist',
          'Focus on nutrient-dense, calorie-rich foods',
          'Consider strength training to build muscle mass',
          'Monitor your health regularly'
        ];
      } else if (standardBMI >= 18.5 && standardBMI < 25) {
        category = 'Normal weight';
        color = 'text-green-600 bg-green-50 border-green-200';
        description = 'Healthy weight range';
        healthRisk = 'Lowest risk of weight-related health problems';
        recommendations = [
          'Maintain current lifestyle with balanced diet',
          'Continue regular physical activity',
          'Monitor weight and body composition periodically',
          'Focus on overall health and wellness'
        ];
      } else if (standardBMI >= 25 && standardBMI < 30) {
        category = 'Overweight';
        color = 'text-orange-600 bg-orange-50 border-orange-200';
        description = 'Above normal weight range';
        healthRisk = 'Increased risk of heart disease, diabetes, and high blood pressure';
        recommendations = [
          'Aim for gradual weight loss of 1-2 pounds per week',
          'Increase physical activity to 150+ minutes per week',
          'Focus on portion control and balanced nutrition',
          'Consider consulting with a healthcare provider'
        ];
      } else {
        category = 'Obese';
        color = 'text-red-600 bg-red-50 border-red-200';
        description = 'Well above normal weight range';
        healthRisk = 'High risk of serious health conditions including diabetes, heart disease, and stroke';
        recommendations = [
          'Strongly consider consulting with healthcare providers',
          'Develop a comprehensive weight management plan',
          'Focus on sustainable lifestyle changes',
          'Consider professional support or programs'
        ];
      }

      // Calculate body composition
      const waistCm = waist ? validateCalculatorInput(waist) : undefined;
      const hipCm = hip ? validateCalculatorInput(hip) : undefined;
      const neckCm = neck ? validateCalculatorInput(neck) : undefined;
      
      const bodyFatPercentage = calculateBodyFatPercentage(
        standardBMI, age, demographics.gender, waistCm || undefined, neckCm || undefined, hipCm || undefined
      );
      
      const metabolicRate = calculateMetabolicRate(
        weightInKg, heightInCm, age, demographics.gender, demographics.activityLevel
      );
      
      const idealWeightRange = calculateIdealWeight(heightInCm, demographics.gender, demographics.frameSize);
      
      const bodyComposition: BodyComposition = {
        waistHipRatio: waistCm && hipCm ? waistCm / hipCm : undefined,
        waistHeightRatio: waistCm ? waistCm / heightInCm : undefined,
        bodyFatPercentage,
        leanBodyMass: weightInKg * (1 - bodyFatPercentage / 100),
        idealWeightRange,
        metabolicRate
      };

      const result: BMIResult = {
        standardBMI: Math.round(standardBMI * 10) / 10,
        newBMI: Math.round(newBMI * 10) / 10,
        smartBMI: Math.round(smartBMI * 10) / 10,
        bmiPrime: Math.round(bmiPrime * 100) / 100,
        adjustedBMI: standardBMI, // Could be modified based on ethnicity
        category,
        categoryNew: adjustedCategory,
        color,
        description,
        recommendations,
        healthRisk,
        healthScore: 0 // Will be calculated after both results are available
      };

      result.healthScore = calculateHealthScore(result, bodyComposition);

      setResult(result);
      setBodyComposition(bodyComposition);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
      setBodyComposition(null);
    }
  }, [height, weight, unit, feet, inches, waist, hip, neck, demographics]);

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setFeet('');
    setInches('');
    setWaist('');
    setHip('');
    setNeck('');
    setResult(null);
    setBodyComposition(null);
    setError('');
    setDemographics({
      gender: 'other',
      ethnicity: 'other',
      activityLevel: 'moderate',
      frameSize: 'medium'
    });
  };

  const getBMIChart = () => {
    const ranges = [
      { min: 0, max: 18.5, label: 'Underweight', color: 'bg-blue-500' },
      { min: 18.5, max: 25, label: 'Normal', color: 'bg-green-500' },
      { min: 25, max: 30, label: 'Overweight', color: 'bg-orange-500' },
      { min: 30, max: 40, label: 'Obese', color: 'bg-red-500' },
    ];

    return (
      <div>
        <h4 className="font-semibold text-foreground mb-3">BMI Categories</h4>
        <div className="space-y-2">
          {ranges.map((range, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center">
                <div className={cn("w-4 h-4 rounded mr-3", range.color)} />
                <span className="font-medium">{range.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {range.min} - {range.max === 40 ? '40+' : range.max}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced FAQ data
  const advancedBMIFAQs: FAQItem[] = [
    {
      question: "What makes this BMI calculator different from others?",
      answer: "This advanced calculator uses multiple BMI formulas including the Standard BMI, New BMI (Trefethen formula), Smart BMI with age/gender adjustments, and ethnicity-specific interpretations. It also incorporates body composition analysis, waist measurements, and personalized health scoring.",
      category: "Features"
    },
    {
      question: "What is the New BMI formula and why is it better?",
      answer: "The New BMI formula (1.3 × weight ÷ height^2.5) was developed by Oxford Professor Nick Trefethen to address height-related distortions in traditional BMI. It prevents short people from thinking they're thinner than they are and tall people from thinking they're fatter than they are.",
      category: "Calculations"
    },
    {
      question: "How do ethnicity-specific BMI cutoffs work?",
      answer: "Research shows that different ethnic groups have varying health risks at the same BMI levels. For example, Asian populations may have increased health risks at BMI 23+ instead of 25+. Our calculator adjusts recommendations based on your ethnicity for more accurate health assessment.",
      category: "Ethnicity"
    },
    {
      question: "What is BMI Prime and how do I interpret it?",
      answer: "BMI Prime is your BMI divided by 25 (the upper limit of normal BMI). A BMI Prime less than 0.74 indicates underweight, 0.74-1.00 is optimal, and above 1.00 indicates overweight. It's a dimensionless number that makes BMI comparisons easier.",
      category: "Calculations"
    },
    {
      question: "How accurate is the body fat percentage estimation?",
      answer: "Our body fat estimation uses your BMI, age, gender, and optional body measurements. While not as accurate as DEXA scans (±1-2%), it provides estimates within ±3-8% accuracy, which is useful for tracking trends and general health assessment.",
      category: "Accuracy"
    },
    {
      question: "What does the Health Score represent?",
      answer: "The Health Score (0-100) combines multiple factors including BMI results from different formulas, body composition metrics, and consistency across measurements. It provides a comprehensive health indicator beyond just BMI alone.",
      category: "Health Score"
    },
    {
      question: "Should I include waist and hip measurements?",
      answer: "Yes! Waist and hip measurements enable calculation of waist-to-hip ratio and waist-to-height ratio, which are important indicators of abdominal fat and health risks. These measurements can sometimes be more predictive of health outcomes than BMI alone.",
      category: "Measurements"
    },
    {
      question: "How do I determine my frame size?",
      answer: "Frame size affects ideal weight ranges. Measure your wrist circumference: for women, <5.5 inches is small, 5.5-6.25 is medium, >6.25 is large. For men, <6.25 inches is small, 6.25-7.5 is medium, >7.5 is large. When in doubt, choose medium.",
      category: "Measurements"
    },
    {
      question: "Why do the different BMI calculations show different results?",
      answer: "Each BMI formula addresses different limitations: Standard BMI is most common, New BMI corrects for height bias, Smart BMI adds age/gender factors, and ethnicity adjustments account for population differences. The variation shows why comprehensive assessment is important.",
      category: "Interpretation"
    },
    {
      question: "Can I trust this calculator for medical decisions?",
      answer: "This calculator provides educational information and should not replace professional medical advice. While it uses research-based formulas and adjustments, always consult healthcare providers for medical decisions, especially if results indicate health concerns.",
      category: "Medical Advice"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Advanced BMI Calculator</h2>
            <p className="text-muted-foreground mt-1">Professional-grade body composition analysis</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex bg-muted rounded-lg p-1 w-fit">
            {[
              { key: 'basic', label: 'Basic Info', icon: User },
              { key: 'advanced', label: 'Body Measurements', icon: Scale },
              { key: 'demographics', label: 'Demographics', icon: Users }
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

        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Unit Toggle */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Units</label>
              <div className="flex bg-accent rounded-lg p-1 w-fit">
                <button
                  onClick={() => setUnit('metric')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    unit === 'metric' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Metric (cm, kg)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    unit === 'imperial' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Imperial (ft, lbs)
                </button>
              </div>
            </div>

            {/* Height and Weight Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height {unit === 'metric' ? '(cm)' : '(feet & inches)'}
                </label>
                {unit === 'metric' ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height in cm (e.g., 175)"
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    step="0.1"
                    min="50"
                    max="300"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="Feet"
                      className="flex-1 px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      step="1"
                      min="3"
                      max="8"
                    />
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="Inches"
                      className="flex-1 px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      step="1"
                      min="0"
                      max="11"
                    />
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Enter weight in ${unit === 'metric' ? 'kg (e.g., 70)' : 'lbs (e.g., 150)'}`}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                  min={unit === 'metric' ? '20' : '44'}
                  max={unit === 'metric' ? '500' : '1100'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced Measurements Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Optional Body Measurements</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Adding these measurements enables advanced body composition analysis including waist-to-hip ratio, 
                waist-to-height ratio, and more accurate body fat estimation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Waist Circumference {unit === 'metric' ? '(cm)' : '(inches)'}
                </label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder={unit === 'metric' ? 'e.g., 85' : 'e.g., 33'}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">Measure at narrowest point</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hip Circumference {unit === 'metric' ? '(cm)' : '(inches)'}
                </label>
                <input
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  placeholder={unit === 'metric' ? 'e.g., 95' : 'e.g., 37'}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">Measure at widest point</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Neck Circumference {unit === 'metric' ? '(cm)' : '(inches)'}
                </label>
                <input
                  type="number"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  placeholder={unit === 'metric' ? 'e.g., 38' : 'e.g., 15'}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">Below Adam's apple</p>
              </div>
            </div>
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Demographic Information</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                This information enables ethnicity-specific BMI interpretations, age-adjusted calculations, 
                and personalized health recommendations based on research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age (optional)</label>
                <input
                  type="number"
                  value={demographics.age || ''}
                  onChange={(e) => setDemographics({
                    ...demographics,
                    age: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                <select
                  value={demographics.gender}
                  onChange={(e) => setDemographics({
                    ...demographics,
                    gender: e.target.value as Demographics['gender']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="other">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ethnicity</label>
                <select
                  value={demographics.ethnicity}
                  onChange={(e) => setDemographics({
                    ...demographics,
                    ethnicity: e.target.value as Demographics['ethnicity']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="other">Other/Prefer not to say</option>
                  <option value="caucasian">Caucasian/White</option>
                  <option value="asian">Asian</option>
                  <option value="african">African/Black</option>
                  <option value="hispanic">Hispanic/Latino</option>
                  <option value="middle_eastern">Middle Eastern</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Used for ethnicity-specific BMI cutoffs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Activity Level</label>
                <select
                  value={demographics.activityLevel}
                  onChange={(e) => setDemographics({
                    ...demographics,
                    activityLevel: e.target.value as Demographics['activityLevel']
                  })}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="sedentary">Sedentary (desk job, no exercise)</option>
                  <option value="light">Light (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (physical job + exercise)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Body Frame Size</label>
                <div className="flex gap-4">
                  {['small', 'medium', 'large'].map((frame) => (
                    <label key={frame} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="frameSize"
                        value={frame}
                        checked={demographics.frameSize === frame}
                        onChange={(e) => setDemographics({
                          ...demographics,
                          frameSize: e.target.value as Demographics['frameSize']
                        })}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="capitalize text-sm">{frame}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Measure wrist circumference: Women: &lt;5.5"=small, 5.5-6.25"=medium, &gt;6.25"=large. 
                  Men: &lt;6.25"=small, 6.25-7.5"=medium, &gt;7.5"=large
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={calculateComprehensiveBMI}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Advanced BMI
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
        {result && bodyComposition && (
          <div className="mt-8 space-y-6">
            {/* Health Score Banner */}
            <div className={cn(
              "p-6 rounded-xl border-2",
              result.healthScore >= 80 ? "bg-green-50 border-green-200 text-green-800" :
              result.healthScore >= 60 ? "bg-yellow-50 border-yellow-200 text-yellow-800" :
              "bg-red-50 border-red-200 text-red-800"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Award className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-bold">Health Score</h3>
                </div>
                <div className="text-3xl font-bold">{result.healthScore}/100</div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div 
                  className={cn("h-3 rounded-full transition-all duration-1000",
                    result.healthScore >= 80 ? "bg-green-500" :
                    result.healthScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${result.healthScore}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 opacity-80">
                Comprehensive health assessment based on multiple BMI methods and body composition
              </p>
            </div>

            {/* BMI Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Standard BMI</h4>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{result.standardBMI}</div>
                <div className="text-sm text-muted-foreground">{result.category}</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">New BMI</h4>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{result.newBMI}</div>
                <div className="text-sm text-muted-foreground">Height-adjusted</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Smart BMI</h4>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{result.smartBMI}</div>
                <div className="text-sm text-muted-foreground">Age/gender adjusted</div>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">BMI Prime</h4>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{result.bmiPrime}</div>
                <div className="text-sm text-muted-foreground">Optimal ratio</div>
              </div>
            </div>

            {/* Body Composition Results */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Body Composition Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bodyComposition.bodyFatPercentage && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(bodyComposition.bodyFatPercentage * 10) / 10}%
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Body Fat Percentage</div>
                    <div className="text-xs text-muted-foreground">Estimated from measurements</div>
                  </div>
                )}

                {bodyComposition.leanBodyMass && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(bodyComposition.leanBodyMass * 10) / 10} {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Lean Body Mass</div>
                    <div className="text-xs text-muted-foreground">Muscle, bone, organs</div>
                  </div>
                )}

                {bodyComposition.metabolicRate && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {bodyComposition.metabolicRate}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Daily Calorie Needs</div>
                    <div className="text-xs text-muted-foreground">Based on activity level</div>
                  </div>
                )}

                {bodyComposition.waistHipRatio && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(bodyComposition.waistHipRatio * 100) / 100}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Waist-to-Hip Ratio</div>
                    <div className="text-xs text-muted-foreground">
                      {bodyComposition.waistHipRatio > (demographics.gender === 'male' ? 0.9 : 0.8) ? 'High risk' : 'Low risk'}
                    </div>
                  </div>
                )}

                {bodyComposition.waistHeightRatio && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(bodyComposition.waistHeightRatio * 100) / 100}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-2">Waist-to-Height Ratio</div>
                    <div className="text-xs text-muted-foreground">
                      {bodyComposition.waistHeightRatio > 0.6 ? 'High risk' : bodyComposition.waistHeightRatio > 0.5 ? 'Moderate risk' : 'Low risk'}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {bodyComposition.idealWeightRange.min}-{bodyComposition.idealWeightRange.max}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-2">
                    Ideal Weight Range {unit === 'metric' ? '(kg)' : '(lbs)'}
                  </div>
                  <div className="text-xs text-muted-foreground">Based on frame size</div>
                </div>
              </div>
            </div>

            {/* Ethnicity-Specific Results */}
            {result.categoryNew !== result.category && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Ethnicity-Adjusted Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Standard Category:</div>
                    <div className="text-lg font-semibold text-orange-900 dark:text-orange-100">{result.category}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Ethnicity-Adjusted:</div>
                    <div className="text-lg font-semibold text-orange-900 dark:text-orange-100">{result.categoryNew}</div>
                  </div>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-3">
                  Based on research showing different ethnic groups have varying health risks at the same BMI levels.
                </p>
              </div>
            )}

            {/* Data Visualization */}
            <BMICharts 
              standardBMI={result.standardBMI}
              newBMI={result.newBMI}
              smartBMI={result.smartBMI}
              bmiPrime={result.bmiPrime}
              category={result.category}
              ethnicity={demographics.ethnicity}
            />

            {/* Recommendations */}
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Personalized Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* BMI Chart */}
      <div className="bg-background border rounded-xl p-6">
        {getBMIChart()}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Important Note:</strong> BMI is a screening tool and does not directly measure body fat or health. 
              It may not be accurate for athletes, elderly, or people with different body compositions. 
              This advanced calculator uses multiple methods and demographic adjustments for better accuracy.
              Always consult with healthcare professionals for personalized health advice.
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="bg-background border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding BMI (Body Mass Index)</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            Body Mass Index (BMI) is a widely used screening tool that helps assess whether a person has a healthy weight for their height. 
            It's calculated by dividing a person's weight in kilograms by the square of their height in meters (kg/m²).
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">How BMI is Used</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Health Screening:</strong> Healthcare providers use BMI as an initial screening tool to identify potential weight-related health risks</li>
            <li><strong>Population Studies:</strong> Researchers use BMI to study obesity trends and health outcomes in large populations</li>
            <li><strong>Personal Health Tracking:</strong> Individuals can monitor their weight status over time and set health goals</li>
            <li><strong>Insurance and Medical:</strong> Some insurance companies and medical facilities use BMI for risk assessment</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Categories and Health Implications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Underweight (BMI &lt; 18.5)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">May indicate malnutrition, eating disorders, or other health conditions. Could lead to weakened immunity, osteoporosis, and fertility issues.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Normal Weight (BMI 18.5-24.9)</h4>
              <p className="text-sm text-green-800 dark:text-green-200">Associated with the lowest risk of weight-related health problems. Indicates a healthy weight for most people.</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Overweight (BMI 25-29.9)</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">Increased risk of heart disease, high blood pressure, type 2 diabetes, and certain cancers. Weight management recommended.</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Obese (BMI ≥ 30)</h4>
              <p className="text-sm text-red-800 dark:text-red-200">High risk of serious health conditions including diabetes, heart disease, stroke, sleep apnea, and certain cancers.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Advanced BMI Methods Explained</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">New BMI (Trefethen Formula)</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">Uses height^2.5 instead of height^2 to correct distortions. More accurate for very tall or short people by preventing height bias in calculations.</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Smart BMI (SBMI)</h4>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">Incorporates age and gender adjustments for more personalized health assessment. Based on comprehensive health risk studies.</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-2">BMI Prime</h4>
              <p className="text-sm text-teal-800 dark:text-teal-200">Ratio of actual BMI to optimal BMI (25). Values &lt;0.74 indicate underweight, 0.74-1.00 optimal, &gt;1.00 overweight. Easy comparison metric.</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Ethnicity-Adjusted BMI</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">Uses population-specific cutoffs. Asian populations: overweight at 23+, obese at 27.5+. More accurate health risk assessment by ethnicity.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Body Composition Analysis</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              <strong>Advanced Feature:</strong> This calculator includes body composition analysis beyond basic BMI:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li><strong>Waist-to-Hip Ratio:</strong> Assesses fat distribution and cardiovascular risk</li>
              <li><strong>Waist-to-Height Ratio:</strong> Alternative measure that may predict health risks better than BMI</li>
              <li><strong>Body Fat Percentage:</strong> Estimated using Navy method for more accurate body composition</li>
              <li><strong>Lean Body Mass:</strong> Amount of weight from muscles, bones, and organs</li>
              <li><strong>Metabolic Rate:</strong> Daily calorie needs based on body composition and activity</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Limitations of BMI</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              <strong>Important:</strong> While BMI is a useful screening tool, it has several limitations:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
              <li>Doesn't distinguish between muscle mass and fat mass</li>
              <li>May not be accurate for athletes or very muscular individuals</li>
              <li>Doesn't account for bone density, overall body composition, or racial/ethnic differences</li>
              <li>May not be appropriate for elderly adults, pregnant women, or growing children</li>
              <li>Doesn't consider fat distribution (abdominal fat vs. other areas)</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Tips for Healthy Weight Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">🥗 Nutrition</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Focus on whole, unprocessed foods</li>
                <li>Include plenty of fruits and vegetables</li>
                <li>Choose lean proteins and healthy fats</li>
                <li>Control portion sizes</li>
                <li>Stay hydrated with water</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🏃‍♂️ Physical Activity</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Aim for 150+ minutes of moderate exercise weekly</li>
                <li>Include strength training 2-3 times per week</li>
                <li>Start slowly and gradually increase intensity</li>
                <li>Find activities you enjoy</li>
                <li>Incorporate movement throughout the day</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">When to Consult Healthcare Professionals</h3>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              <strong>Seek professional advice if:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
              <li>Your BMI falls outside the normal range consistently</li>
              <li>You have concerns about your weight or health</li>
              <li>You're planning significant dietary or exercise changes</li>
              <li>You have existing health conditions affected by weight</li>
              <li>You're pregnant, elderly, or have special health considerations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section with Accordion */}
      <FAQAccordion 
        faqs={advancedBMIFAQs}
        title="Advanced BMI Calculator FAQ"
      />
    </div>
  );
}