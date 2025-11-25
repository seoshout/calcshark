'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target, 
  Activity, TrendingUp, User, Scale, Heart, Brain, Zap,
  BarChart3, PieChart, LineChart, Users, Award, Clock,
  AlertTriangle, Shield, BookOpen, TrendingDown, Apple
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import BMICharts from '@/components/ui/bmi-charts';
import CalculatorReview from '@/components/ui/calculator-review';

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
      question: "What does BMI actually measure?",
      answer: "BMI measures the relationship between your height and weight, providing an estimate of body mass. It doesn't directly measure body fat but serves as a screening tool that correlates with body fat levels in most people.",
      category: "General BMI Questions"
    },
    {
      question: "Is BMI accurate for everyone?",
      answer: "No, BMI has limitations. It may not accurately reflect health status for athletes, elderly individuals, pregnant women, or those with unusual body compositions. It's best used as one of multiple health indicators.",
      category: "General BMI Questions"
    },
    {
      question: "How often should I calculate my BMI?",
      answer: "For most adults, checking BMI monthly or quarterly is sufficient. Daily fluctuations are normal and don't reflect meaningful changes. Focus on long-term trends rather than daily variations.",
      category: "General BMI Questions"
    },
    {
      question: "Can BMI be too low?",
      answer: "Yes, a BMI below 18.5 is considered underweight and associated with health risks including nutritional deficiencies, weakened immunity, and osteoporosis. Very low BMI can be as dangerous as very high BMI.",
      category: "General BMI Questions"
    },
    {
      question: "Which BMI formula should I use?",
      answer: "Use metric (kg/m²) or imperial (lbs/in² × 703) based on your preferred measurement system. Both give identical results. Some populations may benefit from ethnicity-specific interpretations.",
      category: "BMI Calculation Questions"
    },
    {
      question: "Why does BMI use height squared?",
      answer: "The square of height approximates how body volume scales with height in humans. This mathematical relationship, discovered by Adolphe Quetelet, provides reasonable estimates for most people.",
      category: "BMI Calculation Questions"
    },
    {
      question: "Should I measure myself at a specific time?",
      answer: "For consistency, measure yourself in the morning after using the bathroom, before eating or drinking, wearing minimal clothing. This provides the most consistent baseline.",
      category: "BMI Calculation Questions"
    },
    {
      question: "What's the ideal BMI?",
      answer: "For most adults, a BMI between 18.5-24.9 is associated with the lowest health risks. However, the 'ideal' varies by age, ethnicity, and individual health factors. Some older adults may benefit from slightly higher BMIs (23-27).",
      category: "Health and BMI Questions"
    },
    {
      question: "Can you be healthy with a high BMI?",
      answer: "Yes, some individuals with higher BMIs are metabolically healthy, especially if they're physically active, have normal blood pressure, cholesterol, and blood sugar levels. However, higher BMI generally increases health risks over time.",
      category: "Health and BMI Questions"
    },
    {
      question: "Does muscle weight affect BMI?",
      answer: "Yes, muscle is denser than fat, so muscular individuals may have higher BMIs despite low body fat. This is why athletes often register as 'overweight' by BMI standards despite being very fit.",
      category: "Health and BMI Questions"
    },
    {
      question: "Is BMI different for men and women?",
      answer: "The BMI calculation is identical for men and women, but body composition typically differs between genders. Women naturally have higher body fat percentages than men at the same BMI.",
      category: "Health and BMI Questions"
    },
    {
      question: "How is BMI calculated for children?",
      answer: "Children's BMI uses the same formula but interpretation requires age and sex-specific percentile charts because body composition changes throughout growth and development.",
      category: "BMI for Special Populations"
    },
    {
      question: "Is BMI accurate for seniors?",
      answer: "BMI becomes less accurate with age due to muscle loss, bone density changes, and height loss. Slightly higher BMIs (25-27) may be protective for adults over 65.",
      category: "BMI for Special Populations"
    },
    {
      question: "Should pregnant women use BMI?",
      answer: "Pre-pregnancy BMI guides pregnancy weight gain recommendations, but BMI shouldn't be used to assess health during pregnancy. Focus on appropriate weight gain for your starting BMI.",
      category: "BMI for Special Populations"
    },
    {
      question: "Does ethnicity affect BMI interpretation?",
      answer: "Yes, different ethnic groups may experience health risks at different BMI levels. Asian populations often develop weight-related health issues at lower BMIs, while Black populations may have lower risks at higher BMIs.",
      category: "BMI for Special Populations"
    },
    {
      question: "How much should I weigh for a normal BMI?",
      answer: "Multiply your height in meters squared by 18.5 for minimum healthy weight and by 24.9 for maximum. For feet/inches, use online calculators or charts for your specific height.",
      category: "Weight Management Questions"
    },
    {
      question: "How quickly can I safely change my BMI?",
      answer: "Safe weight change is 1-2 pounds (0.5-1 kg) per week, translating to approximately 0.3-0.6 BMI points monthly for average-height adults. Rapid changes may indicate unhealthy practices.",
      category: "Weight Management Questions"
    },
    {
      question: "Should I focus on BMI or body fat percentage?",
      answer: "Both provide valuable information. BMI offers quick screening while body fat percentage gives more accurate body composition data. Consider both alongside other health markers.",
      category: "Weight Management Questions"
    }
  ];

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-3 md:p-6">
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
          <div className="flex gap-1 bg-muted rounded-lg p-1 overflow-x-auto scrollbar-hide">
            {[
              { key: 'basic', label: 'Basic Info', icon: User },
              { key: 'advanced', label: 'Body Measurements', icon: Scale },
              { key: 'demographics', label: 'Demographics', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "flex items-center px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center min-w-0",
                  activeTab === key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">{label}</span>
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
              <div className="flex bg-accent rounded-lg p-1 w-full overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setUnit('metric')}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-1",
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
                    "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-1",
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
        <div className="flex flex-wrap gap-3 mt-8 justify-center sm:justify-start">
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

      {/* Comprehensive BMI Educational Content */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="flex items-center mb-6">
            <Info className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">What Is BMI and Why Does It Matter?</h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p className="text-blue-800 dark:text-blue-200 mb-4">Body Mass Index (BMI) is a widely-used screening tool that estimates body fat based on your height and weight. Developed by Belgian mathematician Adolphe Quetelet in the 1830s, BMI provides a quick assessment of whether your weight falls within a healthy range for your height.</p>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-300 dark:border-blue-700 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Standard BMI Formula</div>
                <div className="text-xl font-mono text-primary"><strong>BMI = weight (kg) / height (m)²</strong></div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-2">For Imperial: <strong>BMI = (weight in pounds × 703) / (height in inches)²</strong></div>
              </div>
            </div>
            
            <p className="text-blue-800 dark:text-blue-200 mb-2">While BMI isn't a perfect measure of health, it remains one of the most practical tools for initial health screening.</p>
            <p className="text-blue-800 dark:text-blue-200">Healthcare providers worldwide use BMI alongside other assessments to evaluate potential health risks associated with weight.</p>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Why Healthcare Professionals Use BMI
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <p className="text-green-800 dark:text-green-200 mb-4">Despite its limitations, BMI continues to be valuable because it:</p>
            <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
              <li><strong>Provides standardized measurements</strong> across different populations</li>
              <li><strong>Requires only basic information</strong> - no special equipment needed</li>
              <li><strong>Correlates with health risks</strong> at population levels</li>
              <li><strong>Offers quick screening</strong> for potential weight-related health issues</li>
              <li><strong>Tracks changes over time</strong> to monitor health trends</li>
              <li><strong>Guides initial conversations</strong> about weight and health</li>
            </ul>
          </div>

          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">BMI Categories and What They Mean</h2>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
            <p className="text-purple-800 dark:text-purple-200">Understanding your BMI category helps you interpret your results and take appropriate action for your health.</p>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Scale className="h-5 w-5 text-primary mr-2" />
            Standard BMI Classification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Underweight</h4>
              <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300 mb-1">Below 18.5</div>
              <p className="text-sm text-cyan-800 dark:text-cyan-200">Increased health risks</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Normal Weight</h4>
              <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">18.5 - 24.9</div>
              <p className="text-sm text-green-800 dark:text-green-200">Lowest health risks</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Overweight</h4>
              <div className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-1">25.0 - 29.9</div>
              <p className="text-sm text-orange-800 dark:text-orange-200">Moderately increased risks</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Class I Obesity</h4>
              <div className="text-lg font-bold text-red-700 dark:text-red-300 mb-1">30.0 - 34.9</div>
              <p className="text-sm text-red-800 dark:text-red-200">High health risks</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Class II Obesity</h4>
              <div className="text-lg font-bold text-red-800 dark:text-red-200 mb-1">35.0 - 39.9</div>
              <p className="text-sm text-red-800 dark:text-red-200">Very high health risks</p>
            </div>
            <div className="bg-red-200 dark:bg-red-900/40 p-4 rounded-lg border border-red-400 dark:border-red-600">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Class III Obesity</h4>
              <div className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">40.0 and above</div>
              <p className="text-sm text-red-800 dark:text-red-200">Extremely high health risks</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            Detailed Category Explanations
          </h3>
          <div className="space-y-6">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Underweight (BMI &lt; 18.5)
              </h4>
              <p className="text-cyan-800 dark:text-cyan-200 mb-3">Being underweight can signal nutritional deficiencies or underlying health conditions. Associated health risks include:</p>
              <ul className="list-disc list-inside space-y-2 text-cyan-800 dark:text-cyan-200 mb-4">
                <li><strong>Nutritional deficiencies</strong> leading to anemia and vitamin shortages</li>
                <li><strong>Weakened immune system</strong> making you more susceptible to infections</li>
                <li><strong>Osteoporosis</strong> and increased fracture risk</li>
                <li><strong>Fertility problems</strong> in both men and women</li>
                <li><strong>Growth and development issues</strong> in children and adolescents</li>
                <li><strong>Decreased muscle mass</strong> affecting strength and mobility</li>
              </ul>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border border-cyan-300 dark:border-cyan-700">
                <p className="text-cyan-800 dark:text-cyan-200 text-sm"><strong>Recommendation:</strong> If your BMI indicates you're underweight, consider consulting a healthcare provider to rule out underlying conditions and develop a healthy weight gain plan.</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Normal Weight (BMI 18.5-24.9)
              </h4>
              <p className="text-green-800 dark:text-green-200 mb-3">This range is associated with the lowest risk of weight-related health problems. Maintaining a BMI within this range typically indicates:</p>
              <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200 mb-4">
                <li><strong>Optimal metabolic function</strong></li>
                <li><strong>Lower risk of chronic diseases</strong></li>
                <li><strong>Better physical mobility</strong></li>
                <li><strong>Improved mental health outcomes</strong></li>
                <li><strong>Enhanced quality of life</strong></li>
                <li><strong>Longer life expectancy</strong></li>
              </ul>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700">
                <p className="text-green-800 dark:text-green-200 text-sm"><strong>Note:</strong> Even within the normal range, maintaining healthy lifestyle habits remains crucial for overall well-being.</p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Overweight (BMI 25-29.9)
              </h4>
              <p className="text-orange-800 dark:text-orange-200 mb-3">Being overweight increases your risk for several health conditions, though the risk level varies based on other factors like waist circumference, physical activity, and overall health status.</p>
              <p className="text-orange-800 dark:text-orange-200 mb-3">Potential health concerns include:</p>
              <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200 mb-4">
                <li><strong>Increased risk of type 2 diabetes</strong></li>
                <li><strong>Higher blood pressure</strong></li>
                <li><strong>Elevated cholesterol levels</strong></li>
                <li><strong>Greater strain on joints</strong></li>
                <li><strong>Sleep apnea development</strong></li>
                <li><strong>Increased inflammation markers</strong></li>
              </ul>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border border-orange-300 dark:border-orange-700">
                <p className="text-orange-800 dark:text-orange-200 text-sm"><strong>Good News:</strong> Many people in this category can significantly improve their health through modest weight loss of 5-10% of body weight.</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Obesity (BMI ≥ 30)
              </h4>
              <p className="text-red-800 dark:text-red-200 mb-4">Obesity significantly increases health risks and is classified into three categories:</p>
              
              <div className="space-y-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded border border-red-300 dark:border-red-700">
                  <p className="text-red-900 dark:text-red-100 mb-2 font-semibold">Class I Obesity (BMI 30-34.9):</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm">
                    <li>Substantially increased risk of metabolic syndrome</li>
                    <li>Higher likelihood of cardiovascular disease</li>
                    <li>Greater risk of certain cancers</li>
                    <li>Increased joint problems and arthritis</li>
                  </ul>
                </div>

                <div className="bg-red-200 dark:bg-red-900/40 p-4 rounded border border-red-400 dark:border-red-600">
                  <p className="text-red-900 dark:text-red-100 mb-2 font-semibold">Class II Obesity (BMI 35-39.9):</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm">
                    <li>Very high risk of type 2 diabetes</li>
                    <li>Severe sleep apnea</li>
                    <li>Significant cardiovascular strain</li>
                    <li>Reduced life expectancy by 2-4 years</li>
                  </ul>
                </div>

                <div className="bg-red-300 dark:bg-red-900/50 p-4 rounded border border-red-500 dark:border-red-500">
                  <p className="text-red-900 dark:text-red-100 mb-2 font-semibold">Class III Obesity (BMI ≥ 40):</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm">
                    <li>Extreme health risks requiring immediate medical attention</li>
                    <li>Life expectancy reduced by 8-10 years</li>
                    <li>Severe mobility limitations</li>
                    <li>Qualification for bariatric surgery consideration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">How to Calculate BMI Manually</h2>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <p className="text-indigo-800 dark:text-indigo-200">While our calculator provides instant results, understanding the manual calculation helps you verify results and calculate BMI anywhere.</p>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Target className="h-5 w-5 text-primary mr-2" />
            Step-by-Step BMI Calculation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Metric System Method
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200 mb-4">
                <li><strong>Measure your weight</strong> in kilograms (kg)</li>
                <li><strong>Measure your height</strong> in meters (m)</li>
                <li><strong>Square your height</strong> (multiply height by itself)</li>
                <li><strong>Divide weight by height squared</strong></li>
              </ol>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-blue-300 dark:border-blue-700">
                <p className="text-blue-900 dark:text-blue-100 font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                  <div>Weight: <span className="font-mono">70 kg</span></div>
                  <div>Height: <span className="font-mono">1.75 m</span></div>
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                    <strong>Calculation:</strong> <span className="font-mono">70 ÷ (1.75 × 1.75) = 70 ÷ 3.06 = 22.9 BMI</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Imperial System Method
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-purple-800 dark:text-purple-200 mb-4">
                <li><strong>Measure your weight</strong> in pounds (lbs)</li>
                <li><strong>Measure your height</strong> in inches</li>
                <li><strong>Square your height</strong> (multiply height by itself)</li>
                <li><strong>Divide weight by height squared</strong></li>
                <li><strong>Multiply by 703</strong></li>
              </ol>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-purple-300 dark:border-purple-700">
                <p className="text-purple-900 dark:text-purple-100 font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                  <div>Weight: <span className="font-mono">154 lbs</span></div>
                  <div>Height: <span className="font-mono">69 inches</span></div>
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                    <strong>Calculation:</strong> <span className="font-mono">(154 ÷ (69 × 69)) × 703 = 22.7 BMI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Reference Formulas</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">System</th>
                  <th className="border border-border p-3 text-left font-semibold">Formula</th>
                  <th className="border border-border p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Metric</td>
                  <td className="border border-border p-3">BMI = kg/m²</td>
                  <td className="border border-border p-3">70kg ÷ (1.75m)² = 22.9</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Imperial</td>
                  <td className="border border-border p-3">BMI = (lbs/in²) × 703</td>
                  <td className="border border-border p-3">(154lbs ÷ 69in²) × 703 = 22.7</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Alternative Metric</td>
                  <td className="border border-border p-3">BMI = kg ÷ (cm ÷ 100)²</td>
                  <td className="border border-border p-3">70kg ÷ (175cm ÷ 100)² = 22.9</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center mb-6">
            <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">Understanding BMI Limitations and Considerations</h2>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <p className="text-amber-800 dark:text-amber-200">While BMI is a useful screening tool, it's important to understand its limitations to interpret results correctly.</p>
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            When BMI May Not Be Accurate
          </h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200">BMI may provide misleading results for certain populations:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Athletes and Bodybuilders
              </h4>
              <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200 text-sm">
                <li><strong>High muscle mass</strong> can result in elevated BMI despite low body fat</li>
                <li><strong>Muscle tissue is denser</strong> than fat tissue</li>
                <li><strong>Body fat percentage</strong> may be more accurate for this population</li>
                <li><strong>DEXA scans</strong> or hydrostatic weighing provide better body composition data</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Elderly Adults
              </h4>
              <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200 text-sm">
                <li><strong>Natural muscle loss</strong> (sarcopenia) with age</li>
                <li><strong>Bone density changes</strong> affect overall weight</li>
                <li><strong>Higher BMI</strong> may actually be protective in older adults</li>
                <li><strong>Functional capacity</strong> may be more important than BMI</li>
              </ul>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Children and Adolescents
              </h4>
              <ul className="list-disc list-inside space-y-2 text-teal-800 dark:text-teal-200 text-sm">
                <li><strong>Growth spurts</strong> affect height-to-weight ratios temporarily</li>
                <li><strong>Age and sex-specific percentiles</strong> are more appropriate</li>
                <li><strong>Development stages</strong> influence body composition</li>
                <li><strong>Pediatric BMI charts</strong> should be used instead of adult categories</li>
              </ul>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
              <h4 className="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Pregnant and Breastfeeding Women
              </h4>
              <ul className="list-disc list-inside space-y-2 text-pink-800 dark:text-pink-200 text-sm">
                <li><strong>Natural weight gain</strong> during pregnancy</li>
                <li><strong>Fluid retention</strong> and increased blood volume</li>
                <li><strong>Pre-pregnancy BMI</strong> is more relevant for health assessment</li>
                <li><strong>Healthcare provider guidance</strong> is essential during this period</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            Ethnic and Racial Considerations
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p className="text-blue-800 dark:text-blue-200">Research suggests that BMI categories may need adjustment for different ethnic groups:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Asian Populations
              </h4>
              <ul className="list-disc list-inside space-y-2 text-indigo-800 dark:text-indigo-200 text-sm">
                <li><strong>Lower BMI thresholds</strong> may be more appropriate</li>
                <li><strong>Higher risk at lower BMI</strong> for type 2 diabetes and cardiovascular disease</li>
                <li><strong>WHO Asian BMI categories:</strong> Overweight ≥23, Obese ≥27.5</li>
                <li><strong>Abdominal obesity</strong> is particularly concerning in Asian populations</li>
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Other Ethnic Groups
              </h4>
              <ul className="list-disc list-inside space-y-2 text-emerald-800 dark:text-emerald-200 text-sm">
                <li><strong>African Americans</strong> may have higher BMI with similar health risks</li>
                <li><strong>Hispanic/Latino populations</strong> show varying patterns by subgroup</li>
                <li><strong>Individual assessment</strong> remains crucial regardless of ethnicity</li>
                <li><strong>Family history</strong> and genetic factors should be considered</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <div className="flex items-center mb-6">
              <Activity className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Better Health Assessment Methods</h2>
            </div>
            <p className="text-blue-700 dark:text-blue-200 mb-6">
              For a more comprehensive health assessment, consider these additional measurements alongside BMI:
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800 mb-6">
            <h3 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Waist Circumference
            </h3>
            
            <p className="text-teal-700 dark:text-teal-200 mb-4">
              Waist circumference is a strong predictor of health risks, particularly cardiovascular disease and type 2 diabetes.
            </p>

            <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3">Measurement Guidelines:</h4>
            <ul className="list-disc list-inside space-y-2 text-teal-700 dark:text-teal-300 mb-4">
              <li><strong>Measure at the natural waist</strong> (narrowest point between ribs and hips)</li>
              <li><strong>Use a flexible tape measure</strong></li>
              <li><strong>Measure while standing</strong> and breathing normally</li>
              <li><strong>Take measurement at the end of normal expiration</strong></li>
            </ul>

            <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3">Risk Categories:</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-teal-300 dark:border-teal-700 rounded-lg">
                <thead>
                  <tr className="bg-teal-100 dark:bg-teal-800/50">
                    <th className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-left font-semibold text-teal-900 dark:text-teal-100">Gender</th>
                    <th className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center font-semibold text-teal-900 dark:text-teal-100">Low Risk</th>
                    <th className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center font-semibold text-teal-900 dark:text-teal-100">Increased Risk</th>
                    <th className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center font-semibold text-teal-900 dark:text-teal-100">High Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 font-medium text-teal-900 dark:text-teal-100">Men</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">&lt; 94 cm (37 in)</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">94-102 cm (37-40 in)</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">&gt; 102 cm (40 in)</td>
                  </tr>
                  <tr>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 font-medium text-teal-900 dark:text-teal-100">Women</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">&lt; 80 cm (31.5 in)</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">80-88 cm (31.5-34.6 in)</td>
                    <td className="border border-teal-300 dark:border-teal-700 px-4 py-3 text-center text-teal-800 dark:text-teal-200">&gt; 88 cm (34.6 in)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Waist-to-Hip Ratio
            </h3>
            
            <p className="text-purple-700 dark:text-purple-200 mb-4">
              This ratio helps identify body fat distribution patterns and associated health risks.
            </p>

            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Calculation:</h4>
            <p className="text-purple-700 dark:text-purple-300 text-lg font-mono bg-white/60 dark:bg-gray-800/60 p-3 rounded border border-purple-300 dark:border-purple-700 mb-4">
              <strong>Waist-to-Hip Ratio = Waist Circumference ÷ Hip Circumference</strong>
            </p>

            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Risk Categories:</h4>
            <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
              <li><strong>Men:</strong> &gt;0.90 indicates increased health risk</li>
              <li><strong>Women:</strong> &gt;0.85 indicates increased health risk</li>
              <li><strong>Apple vs. Pear shape:</strong> Higher ratios indicate more abdominal fat (apple shape), which carries greater health risks</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Body Fat Percentage
            </h3>
            
            <p className="text-orange-700 dark:text-orange-200 mb-4">
              Body fat percentage provides direct measurement of fat versus lean tissue.
            </p>

            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Healthy Body Fat Ranges:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-orange-300 dark:border-orange-700 rounded-lg">
                <thead>
                  <tr className="bg-orange-100 dark:bg-orange-800/50">
                    <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left font-semibold text-orange-900 dark:text-orange-100">Age Group</th>
                    <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center font-semibold text-orange-900 dark:text-orange-100">Men</th>
                    <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center font-semibold text-orange-900 dark:text-orange-100">Women</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 font-medium text-orange-900 dark:text-orange-100">20-39 years</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">8-20%</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">21-33%</td>
                  </tr>
                  <tr>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 font-medium text-orange-900 dark:text-orange-100">40-59 years</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">11-22%</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">23-35%</td>
                  </tr>
                  <tr>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 font-medium text-orange-900 dark:text-orange-100">60-79 years</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">13-25%</td>
                    <td className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-center text-orange-800 dark:text-orange-200">24-36%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Measurement Methods:</h4>
            <ul className="list-disc list-inside space-y-2 text-orange-700 dark:text-orange-300">
              <li><strong>DEXA Scan:</strong> Most accurate, measures bone density, lean mass, and fat mass</li>
              <li><strong>Hydrostatic Weighing:</strong> Highly accurate underwater weighing method</li>
              <li><strong>Bod Pod:</strong> Air displacement plethysmography</li>
              <li><strong>Bioelectrical Impedance:</strong> Quick but less accurate, affected by hydration</li>
              <li><strong>Skinfold Calipers:</strong> Inexpensive but requires skill for accuracy</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Waist-to-Height Ratio (WHtR)
            </h3>
            
            <p className="text-indigo-700 dark:text-indigo-200 font-medium mb-2">Advanced Health Predictor</p>
            <p className="text-indigo-700 dark:text-indigo-200 mb-4">Recent research suggests WHtR may be superior to BMI for health risk prediction.</p>
            
            <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Calculation Formula:</h4>
            <p className="text-indigo-700 dark:text-indigo-300 text-lg font-mono bg-white/60 dark:bg-gray-800/60 p-3 rounded border border-indigo-300 dark:border-indigo-700 mb-4">
              Waist circumference ÷ Height (same units)
            </p>
            
            <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Key Guideline:</h4>
            <p className="text-indigo-700 dark:text-indigo-200 mb-3">Keep your waist circumference less than half your height</p>
            <ul className="list-disc list-inside space-y-2 text-indigo-700 dark:text-indigo-200">
              <li><strong>Ratio &lt; 0.5:</strong> Lower health risks</li>
              <li><strong>Ratio ≥ 0.5:</strong> Increased health risks</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-6">
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Enhanced Body Fat Percentage Ranges
            </h3>
            
            <p className="text-emerald-700 dark:text-emerald-200 mb-4">More detailed body fat percentage ranges by category and gender:</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-emerald-300 dark:border-emerald-700 rounded-lg">
                <thead>
                  <tr className="bg-emerald-100 dark:bg-emerald-800/50">
                    <th className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-left font-semibold text-emerald-900 dark:text-emerald-100">Category</th>
                    <th className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center font-semibold text-emerald-900 dark:text-emerald-100">Men</th>
                    <th className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center font-semibold text-emerald-900 dark:text-emerald-100">Women</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">Essential Fat</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">2-5%</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">10-13%</td>
                  </tr>
                  <tr className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">Athletes</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">6-13%</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">14-20%</td>
                  </tr>
                  <tr className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">Fitness</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">14-17%</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">21-24%</td>
                  </tr>
                  <tr className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">Average</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">18-24%</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">25-31%</td>
                  </tr>
                  <tr className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">Obese</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">≥ 25%</td>
                    <td className="border border-emerald-300 dark:border-emerald-700 px-4 py-3 text-center text-emerald-800 dark:text-emerald-200">≥ 32%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              BMI Prime
            </h3>
            
            <p className="text-blue-700 dark:text-blue-200 font-medium mb-4">BMI Prime provides a ratio comparing your BMI to the upper normal limit (25).</p>
            
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Calculation Formula:</h4>
            <p className="text-blue-700 dark:text-blue-300 text-lg font-mono bg-white/60 dark:bg-gray-800/60 p-3 rounded border border-blue-300 dark:border-blue-700 mb-4">Your BMI ÷ 25</p>
            
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Interpretation Categories:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-md">
                <p className="text-blue-900 dark:text-blue-100 font-medium">&lt; 0.74</p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">Underweight</p>
              </div>
              <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-md">
                <p className="text-green-900 dark:text-green-100 font-medium">0.74-1.00</p>
                <p className="text-green-700 dark:text-green-300 text-sm">Normal weight</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-md">
                <p className="text-yellow-900 dark:text-yellow-100 font-medium">&gt; 1.00</p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">Overweight</p>
              </div>
              <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-md">
                <p className="text-red-900 dark:text-red-100 font-medium">&gt; 1.20</p>
                <p className="text-red-700 dark:text-red-300 text-sm">Obese</p>
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">Comprehensive Health Risk Analysis</h2>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-8">
            <p className="text-red-800 dark:text-red-200 font-medium mb-4 flex items-start">
              <Heart className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              Understanding the specific health risks associated with different BMI ranges helps motivate appropriate action.
            </p>
                
                <div className="bg-white dark:bg-red-950/50 rounded-lg border border-red-300 dark:border-red-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-red-100 dark:bg-red-800/50">
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">BMI Category</th>
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">Cardiovascular</th>
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">Metabolic</th>
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">Respiratory</th>
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">Musculoskeletal</th>
                          <th className="border-b border-red-300 dark:border-red-600 p-4 text-left font-semibold text-red-900 dark:text-red-100">Mental Health</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-red-50 dark:hover:bg-red-900/30">
                          <td className="border-b border-red-200 dark:border-red-700 p-4 font-medium text-red-900 dark:text-red-100">Underweight</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Arrhythmias</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Hypoglycemia</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Decreased lung capacity</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Osteoporosis</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Depression, anxiety</td>
                        </tr>
                        <tr className="hover:bg-green-50 dark:hover:bg-green-900/30">
                          <td className="border-b border-red-200 dark:border-red-700 p-4 font-medium text-green-900 dark:text-green-100">Normal</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-green-800 dark:text-green-200">Lowest risk</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-green-800 dark:text-green-200">Optimal function</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-green-800 dark:text-green-200">Normal function</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-green-800 dark:text-green-200">Healthy joints</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-green-800 dark:text-green-200">Best outcomes</td>
                        </tr>
                        <tr className="hover:bg-yellow-50 dark:hover:bg-yellow-900/30">
                          <td className="border-b border-red-200 dark:border-red-700 p-4 font-medium text-yellow-900 dark:text-yellow-100">Overweight</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-yellow-800 dark:text-yellow-200">Hypertension</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-yellow-800 dark:text-yellow-200">Insulin resistance</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-yellow-800 dark:text-yellow-200">Mild sleep apnea</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-yellow-800 dark:text-yellow-200">Joint stress</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-yellow-800 dark:text-yellow-200">Body image issues</td>
                        </tr>
                        <tr className="hover:bg-orange-50 dark:hover:bg-orange-900/30">
                          <td className="border-b border-red-200 dark:border-red-700 p-4 font-medium text-orange-900 dark:text-orange-100">Class I Obesity</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-orange-800 dark:text-orange-200">Heart disease</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-orange-800 dark:text-orange-200">Type 2 diabetes</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-orange-800 dark:text-orange-200">Moderate apnea</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-orange-800 dark:text-orange-200">Arthritis</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-orange-800 dark:text-orange-200">Depression risk</td>
                        </tr>
                        <tr className="hover:bg-red-50 dark:hover:bg-red-900/30">
                          <td className="border-b border-red-200 dark:border-red-700 p-4 font-medium text-red-900 dark:text-red-100">Class II Obesity</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Heart failure</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Metabolic syndrome</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Severe apnea</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Mobility issues</td>
                          <td className="border-b border-red-200 dark:border-red-700 p-4 text-sm text-red-800 dark:text-red-200">Severe impact</td>
                        </tr>
                        <tr className="hover:bg-red-50 dark:hover:bg-red-900/30">
                          <td className="p-4 font-medium text-red-900 dark:text-red-100">Class III Obesity</td>
                          <td className="p-4 text-sm text-red-800 dark:text-red-200">Extreme risk</td>
                          <td className="p-4 text-sm text-red-800 dark:text-red-200">Multiple conditions</td>
                          <td className="p-4 text-sm text-red-800 dark:text-red-200">Respiratory failure</td>
                          <td className="p-4 text-sm text-red-800 dark:text-red-200">Disability</td>
                          <td className="p-4 text-sm text-red-800 dark:text-red-200">Significant impairment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
          </div>

          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">Taking Action: What to Do About Your BMI</h2>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <p className="text-green-800 dark:text-green-200">Your BMI result is a starting point, not a final verdict on your health. Here's how to respond constructively to your results.</p>
          </div>

          <div className="space-y-8 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                If Your BMI Is Below 18.5 (Underweight)
              </h3>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Immediate steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200 mb-4">
                <li>Schedule a medical evaluation to rule out underlying conditions</li>
                <li>Work with a dietitian to create a healthy weight gain plan</li>
                <li>Focus on nutrient-dense, calorie-rich foods</li>
                <li>Include strength training to build muscle mass</li>
                <li>Address any eating disorders or mental health concerns</li>
              </ol>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Healthy weight gain strategies:</h4>
              <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                <li>Eat frequent, smaller meals throughout the day</li>
                <li>Choose whole grain breads, pastas, and cereals</li>
                <li>Include healthy fats like nuts, avocados, and olive oil</li>
                <li>Add protein shakes or smoothies between meals</li>
                <li>Avoid empty calories from processed foods</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                If Your BMI Is 18.5-24.9 (Normal Weight)
              </h3>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Maintenance strategies:</h4>
              <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200 mb-4">
                <li>Continue regular physical activity (150 minutes/week moderate exercise)</li>
                <li>Maintain balanced, nutritious eating habits</li>
                <li>Monitor weight trends over time</li>
                <li>Focus on overall health, not just weight</li>
                <li>Get regular health screenings</li>
              </ul>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Prevention focus:</h4>
              <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
                <li>Build and maintain muscle mass</li>
                <li>Develop sustainable healthy habits</li>
                <li>Manage stress effectively</li>
                <li>Prioritize sleep quality</li>
                <li>Stay hydrated</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                If Your BMI Is 25-29.9 (Overweight)
              </h3>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Action plan:</h4>
              <ol className="list-decimal list-inside space-y-2 text-amber-800 dark:text-amber-200 mb-4">
                <li>Aim for modest weight loss (5-10% of body weight)</li>
                <li>Create a moderate calorie deficit (500-750 calories/day)</li>
                <li>Increase physical activity gradually</li>
                <li>Focus on sustainable lifestyle changes</li>
                <li>Consider professional guidance if needed</li>
              </ol>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Effective strategies:</h4>
              <ul className="list-disc list-inside space-y-2 text-amber-800 dark:text-amber-200">
                <li>Keep a food diary to identify eating patterns</li>
                <li>Increase vegetable and fruit intake</li>
                <li>Reduce portion sizes</li>
                <li>Limit processed foods and added sugars</li>
                <li>Find enjoyable physical activities</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                If Your BMI Is 30 or Higher (Obese)
              </h3>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Medical approach:</h4>
              <ol className="list-decimal list-inside space-y-2 text-red-800 dark:text-red-200 mb-4">
                <li>Consult healthcare providers for comprehensive evaluation</li>
                <li>Screen for weight-related health conditions</li>
                <li>Consider medical weight management programs</li>
                <li>Evaluate medication options if appropriate</li>
                <li>Discuss bariatric surgery for BMI ≥ 40 or ≥ 35 with complications</li>
              </ol>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Comprehensive management:</h4>
              <ul className="list-disc list-inside space-y-2 text-red-800 dark:text-red-200">
                <li>Work with multidisciplinary team (doctor, dietitian, therapist)</li>
                <li>Address underlying factors (medical, psychological, environmental)</li>
                <li>Set realistic, gradual weight loss goals (1-2 pounds/week)</li>
                <li>Focus on behavior modification</li>
                <li>Build strong support system</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <Activity className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">Healthy Weight Management Strategies</h2>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
            <p className="text-purple-800 dark:text-purple-200">Regardless of your current BMI, these evidence-based strategies support healthy weight management.</p>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Zap className="h-5 w-5 text-primary mr-2" />
            Nutrition Guidelines
          </h3>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <p className="text-amber-800 dark:text-amber-200 font-medium mb-4 flex items-start">
              <Heart className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
              Balanced eating principles:
            </p>
                
            
            <div className="bg-white dark:bg-amber-950/50 p-4 rounded-lg border border-amber-300 dark:border-amber-700">
              <ul className="list-disc list-inside space-y-3 text-amber-800 dark:text-amber-200">
                <li><strong>Portion control:</strong> Use smaller plates, measure servings, eat mindfully</li>
                <li><strong>Nutrient density:</strong> Choose whole foods over processed options</li>
                <li><strong>Macronutrient balance:</strong> Include protein, healthy fats, and complex carbohydrates</li>
                <li><strong>Hydration:</strong> Drink at least 8 glasses of water daily</li>
                <li><strong>Meal timing:</strong> Eat regular meals, avoid skipping breakfast</li>
              </ul>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-foreground mb-3">Specific recommendations:</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Food Group</th>
                  <th className="border border-border p-3 text-left font-semibold">Daily Servings</th>
                  <th className="border border-border p-3 text-left font-semibold">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Vegetables</td>
                  <td className="border border-border p-3">5-9 servings</td>
                  <td className="border border-border p-3">Leafy greens, broccoli, peppers</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Fruits</td>
                  <td className="border border-border p-3">2-4 servings</td>
                  <td className="border border-border p-3">Berries, apples, citrus</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Whole grains</td>
                  <td className="border border-border p-3">6-8 servings</td>
                  <td className="border border-border p-3">Oats, quinoa, brown rice</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Lean protein</td>
                  <td className="border border-border p-3">2-3 servings</td>
                  <td className="border border-border p-3">Fish, poultry, legumes</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Healthy fats</td>
                  <td className="border border-border p-3">2-3 servings</td>
                  <td className="border border-border p-3">Nuts, avocado, olive oil</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Dairy/alternatives</td>
                  <td className="border border-border p-3">2-3 servings</td>
                  <td className="border border-border p-3">Low-fat milk, yogurt, fortified soy</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Activity className="h-5 w-5 text-primary mr-2" />
            Physical Activity Recommendations
          </h3>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <p className="text-green-800 dark:text-green-200 font-medium mb-4 flex items-start">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              WHO Guidelines for Adults:
            </p>
                
            
            <div className="bg-white dark:bg-green-950/50 p-4 rounded-lg border border-green-300 dark:border-green-700 mb-4">
              <ul className="list-disc list-inside space-y-3 text-green-800 dark:text-green-200">
                <li><strong>Aerobic activity:</strong> 150-300 minutes moderate OR 75-150 minutes vigorous weekly</li>
                <li><strong>Strength training:</strong> 2+ days per week, all major muscle groups</li>
                <li><strong>Flexibility:</strong> Regular stretching or yoga</li>
                <li><strong>Reduce sedentary time:</strong> Break up long sitting periods</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-green-950/50 p-4 rounded-lg border border-green-300 dark:border-green-700">
              <p className="text-green-800 dark:text-green-200 font-medium mb-3">Exercise progression for beginners:</p>
              <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
                <li>Week 1-2: 10-minute walks daily</li>
                <li>Week 3-4: 15-minute walks + light stretching</li>
                <li>Week 5-6: 20-minute walks + basic strength exercises</li>
                <li>Week 7-8: 25-minute varied activities</li>
                <li>Week 9+: Build toward guidelines gradually</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <AlertCircle className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">Health Implications by BMI Category</h2>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
            <p className="text-orange-800 dark:text-orange-200">Understanding the specific health risks associated with each BMI category helps you make informed decisions about your health.</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Underweight Health Risks
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-6">Being underweight (BMI &lt; 18.5) can be as concerning as being overweight and may indicate:</p>
                
                <div className="space-y-6">
                  <div className="bg-white dark:bg-blue-950/50 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Immediate Health Concerns
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                      <li><strong>Malnutrition:</strong> Insufficient calories and essential nutrients</li>
                      <li><strong>Anemia:</strong> Low iron levels leading to fatigue and weakness</li>
                      <li><strong>Vitamin deficiencies:</strong> Particularly B vitamins, vitamin D, and fat-soluble vitamins</li>
                      <li><strong>Protein deficiency:</strong> Leading to muscle wasting and poor healing</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-blue-950/50 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Long-term Health Risks
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                      <li><strong>Osteoporosis:</strong> Increased risk of bone fractures and low bone density</li>
                      <li><strong>Compromised immune function:</strong> Higher susceptibility to infections</li>
                      <li><strong>Fertility issues:</strong> Irregular menstruation in women, low testosterone in men</li>
                      <li><strong>Delayed wound healing:</strong> Poor recovery from injuries and surgeries</li>
                      <li><strong>Increased mortality risk:</strong> Higher death rates from various causes</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-blue-950/50 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Potential Underlying Causes
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                      <li><strong>Eating disorders:</strong> Anorexia nervosa, bulimia, or restrictive eating patterns</li>
                      <li><strong>Medical conditions:</strong> Hyperthyroidism, inflammatory bowel disease, celiac disease</li>
                      <li><strong>Mental health issues:</strong> Depression, anxiety affecting appetite and eating</li>
                      <li><strong>Medications:</strong> Side effects causing loss of appetite or nausea</li>
                      <li><strong>Socioeconomic factors:</strong> Limited access to adequate nutrition</li>
                    </ul>
                  </div>
                </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-8">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Normal Weight Health Benefits
            </h3>
            <p className="text-green-700 dark:text-green-200 mb-6">
              Maintaining a normal BMI (18.5-24.9) is associated with optimal health outcomes:
            </p>
                
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-green-100 dark:border-green-700">
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Physical Health Benefits:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-300">
                      <li><strong>Optimal cardiovascular function:</strong> Lower blood pressure and healthy cholesterol levels</li>
                      <li><strong>Reduced diabetes risk:</strong> Better insulin sensitivity and glucose metabolism</li>
                      <li><strong>Lower cancer risk:</strong> Reduced risk of obesity-related cancers</li>
                      <li><strong>Better joint health:</strong> Less stress on weight-bearing joints</li>
                      <li><strong>Improved respiratory function:</strong> Better lung capacity and breathing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-green-100 dark:border-green-700">
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Mental and Social Benefits:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-300">
                      <li><strong>Enhanced self-esteem:</strong> Greater body satisfaction and confidence</li>
                      <li><strong>Better sleep quality:</strong> Reduced risk of sleep apnea and better rest</li>
                      <li><strong>Increased energy levels:</strong> Better physical stamina and vitality</li>
                      <li><strong>Improved mobility:</strong> Greater ease in physical activities and exercise</li>
                      <li><strong>Longevity:</strong> Associated with longer life expectancy</li>
                    </ul>
                  </div>
                </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800 mb-8">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Overweight Health Implications
            </h3>
            <p className="text-orange-700 dark:text-orange-200 mb-6">
              Being overweight (BMI 25-29.9) increases health risks, but many can be reduced with lifestyle modifications:
            </p>
                
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-orange-100 dark:border-orange-700">
                    <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Metabolic Risks:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-orange-700 dark:text-orange-300">
                      <li><strong>Prediabetes:</strong> Elevated blood sugar levels leading to type 2 diabetes risk</li>
                      <li><strong>Insulin resistance:</strong> Reduced cellular response to insulin</li>
                      <li><strong>Metabolic syndrome:</strong> Cluster of conditions increasing heart disease risk</li>
                      <li><strong>Dyslipidemia:</strong> Abnormal cholesterol and triglyceride levels</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-orange-100 dark:border-orange-700">
                    <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Cardiovascular Risks:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-orange-700 dark:text-orange-300">
                      <li><strong>Hypertension:</strong> High blood pressure increasing heart disease risk</li>
                      <li><strong>Coronary artery disease:</strong> Plaque buildup in heart arteries</li>
                      <li><strong>Stroke risk:</strong> Increased cerebrovascular events</li>
                      <li><strong>Heart failure:</strong> Reduced cardiac function over time</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-orange-100 dark:border-orange-700">
                    <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Other Health Concerns:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-orange-700 dark:text-orange-300">
                      <li><strong>Sleep apnea:</strong> Breathing interruptions during sleep</li>
                      <li><strong>Gallbladder disease:</strong> Increased risk of gallstones</li>
                      <li><strong>Osteoarthritis:</strong> Joint pain and stiffness from excess weight</li>
                      <li><strong>Fatty liver disease:</strong> Non-alcoholic liver fat accumulation</li>
                      <li><strong>Gastroesophageal reflux:</strong> Acid reflux and heartburn</li>
                    </ul>
                  </div>
                </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-8">
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Obesity Health Complications
            </h3>
            <p className="text-red-700 dark:text-red-200 mb-6">
              Obesity (BMI ≥ 30) significantly increases the risk of serious health complications:
            </p>
                
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-red-100 dark:border-red-700">
                    <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Severe Health Conditions:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                      <li><strong>Type 2 diabetes:</strong> Dramatically increased risk requiring medication management</li>
                      <li><strong>Cardiovascular disease:</strong> Heart attacks, strokes, and heart failure</li>
                      <li><strong>Cancer:</strong> Increased risk of breast, colon, endometrial, kidney, and liver cancers</li>
                      <li><strong>Severe sleep apnea:</strong> Potentially life-threatening breathing disruptions</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-red-100 dark:border-red-700">
                    <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Quality of Life Issues:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                      <li><strong>Physical limitations:</strong> Difficulty with daily activities and exercise</li>
                      <li><strong>Mental health challenges:</strong> Depression, anxiety, and social isolation</li>
                      <li><strong>Work limitations:</strong> Reduced productivity and increased sick days</li>
                      <li><strong>Reproductive health:</strong> Fertility problems and pregnancy complications</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-red-100 dark:border-red-700">
                    <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Class III Obesity (BMI ≥ 40) Complications:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                      <li><strong>Severe mobility issues:</strong> Wheelchair dependence and immobility</li>
                      <li><strong>Multiple organ dysfunction:</strong> Heart, liver, kidney, and lung problems</li>
                      <li><strong>Dramatically reduced lifespan:</strong> 8-10 year reduction in life expectancy</li>
                      <li><strong>Surgical candidacy:</strong> May qualify for bariatric surgery intervention</li>
                    </ul>
                  </div>
                </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
              <Target className="h-6 w-6 mr-2" />
              Practical Tips for Healthy Weight Management
            </h2>
            <p className="text-purple-700 dark:text-purple-200 mb-6">
              Regardless of your current BMI category, these evidence-based strategies can help you achieve and maintain a healthy weight.
            </p>

                <div className="bg-white/60 dark:bg-gray-800/60 p-5 rounded-lg border border-purple-100 dark:border-purple-700 mb-6">
                  <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2" />
                    Sustainable Weight Loss Strategies
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">
                    For those needing to lose weight, focus on gradual, sustainable changes rather than rapid weight loss:
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-700">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                        <Apple className="h-4 w-4 mr-2" />
                        Nutritional Approaches:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
                        <li><strong>Create a moderate calorie deficit:</strong> 500-750 calories per day for 1-2 pounds weekly loss</li>
                        <li><strong>Focus on whole foods:</strong> Vegetables, fruits, lean proteins, whole grains, healthy fats</li>
                        <li><strong>Control portion sizes:</strong> Use smaller plates, measure servings, practice mindful eating</li>
                        <li><strong>Stay hydrated:</strong> Drink water before meals, limit sugary beverages</li>
                        <li><strong>Plan meals:</strong> Prepare healthy options in advance to avoid impulsive choices</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-700">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Physical Activity Guidelines:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
                        <li><strong>Aim for 150-300 minutes</strong> of moderate aerobic activity weekly</li>
                        <li><strong>Include strength training</strong> 2-3 times per week for all major muscle groups</li>
                        <li><strong>Start gradually:</strong> Begin with 10-minute sessions if you're sedentary</li>
                        <li><strong>Find enjoyable activities:</strong> Dancing, swimming, hiking, sports you enjoy</li>
                        <li><strong>Increase daily movement:</strong> Take stairs, park farther, walk during breaks</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-700">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Behavioral Changes:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
                        <li><strong>Set realistic goals:</strong> Small, achievable targets that build momentum</li>
                        <li><strong>Track progress:</strong> Food diary, weight log, or fitness app</li>
                        <li><strong>Get adequate sleep:</strong> 7-9 hours per night for optimal metabolism</li>
                        <li><strong>Manage stress:</strong> Meditation, yoga, or other stress-reduction techniques</li>
                        <li><strong>Seek support:</strong> Family, friends, or professional guidance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 p-5 rounded-lg border border-purple-100 dark:border-purple-700">
                  <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Healthy Weight Gain for Underweight Individuals
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">
                    Those who are underweight need a different approach focused on healthy weight gain:
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-700">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                        <Apple className="h-4 w-4 mr-2" />
                        Nutrition Strategies:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
                        <li><strong>Increase calorie density:</strong> Add healthy fats like nuts, avocado, olive oil</li>
                        <li><strong>Eat frequent meals:</strong> 5-6 smaller meals throughout the day</li>
                        <li><strong>Choose nutrient-dense foods:</strong> Whole grains, lean proteins, healthy fats</li>
                        <li><strong>Drink calories:</strong> Smoothies, milk, protein shakes between meals</li>
                        <li><strong>Don't fill up on water:</strong> Drink beverages after meals, not before</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-700">
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Exercise for Weight Gain:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700 dark:text-purple-300">
                        <li><strong>Focus on strength training:</strong> Build lean muscle mass through resistance exercises</li>
                        <li><strong>Limit excessive cardio:</strong> Too much can burn calories needed for weight gain</li>
                        <li><strong>Progressive overload:</strong> Gradually increase weights and intensity</li>
                        <li><strong>Allow recovery time:</strong> Rest between strength training sessions</li>
                      </ul>
                    </div>
                  </div>
                </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800 mb-8">
            <h3 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Weight Maintenance Strategies
            </h3>
            <p className="text-teal-700 dark:text-teal-200 mb-6">
              For those in the normal BMI range, focus on maintaining your healthy weight:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-teal-700 dark:text-teal-300">
              <li><strong>Regular monitoring:</strong> Weekly weigh-ins to catch changes early</li>
              <li><strong>Consistent eating patterns:</strong> Regular meal times and balanced nutrition</li>
              <li><strong>Stay active:</strong> Maintain regular exercise routine</li>
              <li><strong>Adjust as needed:</strong> Modify intake based on activity level changes</li>
              <li><strong>Plan for challenges:</strong> Holidays, vacations, stress periods</li>
            </ul>
          </div>

          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-foreground mb-0">When to Consult Healthcare Professionals</h2>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              Important Medical Advice
            </p>
            <p className="text-red-800 dark:text-red-200">While BMI is a useful starting point, professional medical assessment provides personalized health guidance.</p>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-primary mr-2" />
            Situations Requiring Medical Consultation
          </h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <p className="text-blue-800 dark:text-blue-200">Consult with healthcare providers in these situations:</p>
          </div>
          
          <div className="space-y-6 mb-8">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                BMI-Related Concerns
              </h4>
              <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200">
                <li><strong>BMI below 18.5 or above 30:</strong> Outside normal range requiring assessment</li>
                <li><strong>Rapid weight changes:</strong> Unexplained weight loss or gain</li>
                <li><strong>Difficulty reaching healthy weight:</strong> Despite diet and exercise efforts</li>
                <li><strong>Weight cycling:</strong> Repeated weight loss and regain patterns</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Health Symptoms
              </h4>
              <ul className="list-disc list-inside space-y-2 text-red-800 dark:text-red-200">
                <li><strong>Metabolic symptoms:</strong> High blood pressure, blood sugar, or cholesterol</li>
                <li><strong>Sleep disturbances:</strong> Snoring, sleep apnea, or poor sleep quality</li>
                <li><strong>Joint pain:</strong> Knee, hip, or back pain related to weight</li>
                <li><strong>Breathing difficulties:</strong> Shortness of breath during activities</li>
                <li><strong>Mental health concerns:</strong> Depression, anxiety about weight or body image</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Special Populations
              </h4>
              <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200">
                <li><strong>Athletes:</strong> High muscle mass affecting BMI accuracy</li>
                <li><strong>Elderly adults:</strong> Age-related changes in body composition</li>
                <li><strong>Children and teens:</strong> Growth and development considerations</li>
                <li><strong>Pregnant women:</strong> Pre-pregnancy BMI and weight gain guidance</li>
                <li><strong>Chronic conditions:</strong> Medical conditions affecting weight or metabolism</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Types of Healthcare Professionals</h3>
          <p className="text-muted-foreground mb-4">Different specialists can help with various aspects of weight and health management:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Primary Care Physicians:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Initial assessment:</strong> Overall health evaluation and BMI interpretation</li>
            <li><strong>Basic guidance:</strong> General diet and exercise recommendations</li>
            <li><strong>Health screening:</strong> Blood tests, blood pressure, other vital signs</li>
            <li><strong>Referrals:</strong> Connect you with appropriate specialists</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Registered Dietitians:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Nutritional assessment:</strong> Detailed analysis of eating patterns</li>
            <li><strong>Meal planning:</strong> Personalized nutrition plans</li>
            <li><strong>Education:</strong> Teaching about healthy eating principles</li>
            <li><strong>Behavior modification:</strong> Strategies for changing eating habits</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Exercise Physiologists:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Fitness assessment:</strong> Current fitness level evaluation</li>
            <li><strong>Exercise prescription:</strong> Safe, effective workout plans</li>
            <li><strong>Progress monitoring:</strong> Adjusting programs as fitness improves</li>
            <li><strong>Special populations:</strong> Exercise for medical conditions</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Mental Health Professionals:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Eating disorders:</strong> Specialized treatment for disordered eating</li>
            <li><strong>Body image issues:</strong> Addressing negative self-perception</li>
            <li><strong>Behavioral therapy:</strong> Changing patterns related to food and exercise</li>
            <li><strong>Stress management:</strong> Coping strategies for emotional eating</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">BMI in Different Life Stages</h2>
          <p className="text-muted-foreground mb-6">BMI interpretation and healthy weight ranges can vary throughout different life stages.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Children and Adolescents (2-19 years)</h3>
          <p className="text-muted-foreground mb-4">BMI for children is interpreted differently than adult BMI:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Percentile-Based System:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Underweight:</strong> Below 5th percentile for age and sex</li>
            <li><strong>Normal weight:</strong> 5th to 84th percentile</li>
            <li><strong>Overweight:</strong> 85th to 94th percentile</li>
            <li><strong>Obese:</strong> 95th percentile and above</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Special Considerations:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Growth spurts:</strong> Temporary changes in BMI during rapid growth</li>
            <li><strong>Puberty timing:</strong> Early or late developers may have different patterns</li>
            <li><strong>Family involvement:</strong> Whole family approach to healthy habits</li>
            <li><strong>Avoid dieting:</strong> Focus on healthy eating, not weight loss</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Young Adults (20-39 years)</h3>
          <p className="text-muted-foreground mb-4">Standard adult BMI categories typically apply, with attention to:</p>
          
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Establishing healthy habits:</strong> Building lifelong patterns</li>
            <li><strong>Career stress:</strong> Managing work-related eating and activity changes</li>
            <li><strong>Social influences:</strong> Navigating social eating and drinking</li>
            <li><strong>Reproductive health:</strong> Weight effects on fertility and pregnancy</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Middle Age (40-64 years)</h3>
          <p className="text-muted-foreground mb-4">Metabolic changes and life circumstances affect weight management:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Physiological Changes:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Slower metabolism:</strong> Decreased calorie needs with age</li>
            <li><strong>Muscle loss:</strong> Gradual sarcopenia starting in 30s-40s</li>
            <li><strong>Hormonal changes:</strong> Menopause, andropause affecting body composition</li>
            <li><strong>Chronic conditions:</strong> Higher risk of diabetes, heart disease</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Lifestyle Factors:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Work demands:</strong> Sedentary jobs, long hours, stress eating</li>
            <li><strong>Family responsibilities:</strong> Less time for self-care</li>
            <li><strong>Financial stress:</strong> Budget constraints affecting food choices</li>
            <li><strong>Medication effects:</strong> Some medications cause weight gain</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Older Adults (65+ years)</h3>
          <p className="text-muted-foreground mb-4">BMI interpretation may need adjustment for older adults:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Modified BMI Ranges:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Some research suggests</strong> BMI 25-29.9 may be protective in older adults</li>
            <li><strong>Unintentional weight loss</strong> is often more concerning than stable higher weight</li>
            <li><strong>Muscle preservation</strong> becomes more important than weight loss</li>
            <li><strong>Individual assessment</strong> is crucial for this age group</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Health Priorities:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Functional capacity:</strong> Ability to perform daily activities</li>
            <li><strong>Fall prevention:</strong> Maintaining strength and balance</li>
            <li><strong>Nutritional adequacy:</strong> Preventing malnutrition</li>
            <li><strong>Social engagement:</strong> Maintaining quality of life</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-3" />
              Medical Disclaimer and Professional Guidance
            </h2>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800 mb-6">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              When to Seek Medical Advice
            </h3>
            <p className="text-cyan-700 dark:text-cyan-200 font-medium mb-3">Consult healthcare providers if:</p>
            <ul className="list-disc list-inside space-y-2 text-cyan-700 dark:text-cyan-200">
              <li>Your BMI is below 18.5 or above 30</li>
              <li>You experience unexplained weight changes</li>
              <li>You have symptoms like fatigue, shortness of breath, or joint pain</li>
              <li>You're planning significant dietary or exercise changes</li>
              <li>You have existing health conditions</li>
              <li>You're concerned about your weight or health</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Understanding Medical Context
            </h3>
            <p className="text-indigo-700 dark:text-indigo-200 font-medium mb-3">BMI is one tool among many that healthcare providers use. A comprehensive health assessment includes:</p>
            <ul className="list-disc list-inside space-y-2 text-indigo-700 dark:text-indigo-200">
              <li>Complete medical history</li>
              <li>Physical examination</li>
              <li>Laboratory tests (cholesterol, blood sugar, thyroid)</li>
              <li>Blood pressure monitoring</li>
              <li>Body composition analysis</li>
              <li>Lifestyle factors assessment</li>
              <li>Mental health screening</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-violet-200 dark:border-violet-800 mb-6">
            <h3 className="text-xl font-semibold text-violet-900 dark:text-violet-100 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Working with Healthcare Professionals
            </h3>
            <h4 className="text-lg font-semibold text-violet-800 dark:text-violet-200 mb-3">Prepare for appointments by:</h4>
            <ul className="list-disc list-inside space-y-2 text-violet-700 dark:text-violet-200 mb-4">
              <li>Tracking your weight and BMI trends</li>
              <li>Listing current medications and supplements</li>
              <li>Noting eating and exercise patterns</li>
              <li>Preparing questions about your health</li>
              <li>Being honest about challenges and concerns</li>
            </ul>
            <h4 className="text-lg font-semibold text-violet-800 dark:text-violet-200 mb-3">Healthcare team members who can help:</h4>
            <ul className="list-disc list-inside space-y-2 text-violet-700 dark:text-violet-200">
              <li><strong>Primary care physician</strong> for overall health assessment</li>
              <li><strong>Registered dietitian</strong> for nutrition planning</li>
              <li><strong>Exercise physiologist</strong> for fitness programs</li>
              <li><strong>Mental health counselor</strong> for emotional support</li>
              <li><strong>Endocrinologist</strong> for hormonal issues</li>
              <li><strong>Bariatric specialist</strong> for severe obesity</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-8">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3" />
              Conclusion: Using BMI as Part of Your Health Journey
            </h2>
            
            <p className="text-green-700 dark:text-green-200 font-medium mb-6">BMI serves as a valuable starting point for understanding your health, but it's just one piece of a complex puzzle. Your overall health depends on numerous factors including physical fitness, nutrition quality, mental well-being, genetic factors, and lifestyle choices.</p>

            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Remember these key points:</h3>
            <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-200 mb-6">
              <li>BMI provides useful population-level insights but has individual limitations</li>
              <li>Consider your BMI alongside other health markers</li>
              <li>Focus on sustainable, healthy lifestyle changes rather than just numbers</li>
              <li>Seek professional guidance for personalized health advice</li>
              <li>Small, consistent improvements lead to long-term success</li>
              <li>Your worth isn't determined by any number on a scale or calculator</li>
            </ul>

            <p className="text-green-700 dark:text-green-200 mb-4">Whether your BMI suggests you need to gain weight, lose weight, or maintain your current weight, the path forward involves making informed, sustainable choices that support your overall health and well-being. Use this calculator and information as tools to guide your journey, but always prioritize how you feel, your energy levels, and your overall quality of life.</p>

            <p className="text-green-700 dark:text-green-200">Take action today by calculating your BMI, understanding what it means, and if needed, consulting with healthcare professionals to develop a personalized plan that works for your unique situation. Your health is an investment that pays dividends for years to come.</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
              <Info className="h-6 w-6 mr-3" />
              Additional Resources
            </h2>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-6 rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Related Calculators
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200">
              <li><a href="/health-fitness/body-metrics/body-fat-percentage-calculator/" className="text-primary hover:underline font-medium">Body Fat Percentage Calculator</a></li>
              <li><a href="/health-fitness/body-metrics/ideal-weight-calculator/" className="text-primary hover:underline font-medium">Ideal Weight Calculator</a></li>
              <li><a href="/health-fitness/nutrition-diet/calorie-calculator/" className="text-primary hover:underline font-medium">Calorie Calculator</a></li>
              <li><a href="/health-fitness/nutrition-diet/macro-calculator/" className="text-primary hover:underline font-medium">Macro Calculator</a></li>
              <li><a href="/health-fitness/fitness-exercise/tdee-calculator/" className="text-primary hover:underline font-medium">TDEE Calculator</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Authoritative Health Resources
            </h3>
            <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-200">
              <li>World Health Organization (WHO) - Global BMI Guidelines</li>
              <li>Centers for Disease Control and Prevention (CDC) - BMI Information</li>
              <li>National Institutes of Health (NIH) - Weight Management Resources</li>
              <li>American Heart Association - Healthy Weight Guidelines</li>
              <li>Academy of Nutrition and Dietetics - Nutrition Information</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Scientific References
            </h3>
            <ul className="list-disc list-inside space-y-2 text-amber-700 dark:text-amber-200">
              <li>International Journal of Obesity - Latest BMI Research</li>
              <li>The Lancet - Global Health Studies</li>
              <li>New England Journal of Medicine - Obesity Research</li>
              <li>JAMA - Weight and Health Outcomes</li>
              <li>Obesity Reviews - Systematic Reviews and Meta-analyses</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-muted-foreground mb-2">
              <em>Last medically reviewed and updated: September 2025</em>
            </p>
            <p className="text-sm text-muted-foreground">
              <em>The information provided on this page is for educational purposes only and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for personalized medical guidance.</em>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section with Accordion */}
      <FAQAccordion
        faqs={advancedBMIFAQs}
        title="Advanced BMI Calculator FAQ"
      />

      {/* Review Section */}
      <CalculatorReview
        calculatorName="BMI Calculator"
        className="mt-6"
      />
    </div>
  );
}