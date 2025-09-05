'use client';

import { useState, useCallback, useEffect } from 'react';
import { Calculator, RefreshCw, Info, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import { validateCalculatorInput, sanitizeInput } from '@/lib/security';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
  recommendations: string[];
  healthRisk: string;
}

// BMI FAQ data
const bmiFAQs: FAQItem[] = [
  {
    question: "What is a good BMI?",
    answer: "A BMI between 18.5 and 24.9 is generally considered normal or healthy for most adults. However, what's 'good' can vary based on individual factors like age, muscle mass, bone density, and overall health. It's best to consult with a healthcare provider for personalized advice.",
    category: "Health Ranges"
  },
  {
    question: "How accurate is BMI?",
    answer: "BMI is a useful screening tool but not a perfect measure of health. It doesn't account for muscle mass, bone density, or body composition. For example, athletes with high muscle mass may have a high BMI but low body fat. Other measurements like waist circumference, body fat percentage, and overall health markers provide a more complete picture.",
    category: "Accuracy"
  },
  {
    question: "Is BMI different for men and women?",
    answer: "The BMI formula is the same for both men and women, but interpretation can vary. Women typically have more body fat than men at the same BMI due to biological differences. Some health experts suggest that BMI ranges might need gender-specific adjustments, but the standard categories are currently used for both sexes.",
    category: "Gender Differences"
  },
  {
    question: "Can I use BMI for children?",
    answer: "BMI can be used for children and teenagers, but it's interpreted differently. Instead of fixed categories, children's BMI is compared to other children of the same age and sex using percentiles. A pediatric BMI calculator or consultation with a pediatrician is recommended for accurate assessment in children.",
    category: "Age Groups"
  },
  {
    question: "What should I do if my BMI is too high or too low?",
    answer: "If your BMI falls outside the normal range, consider consulting with a healthcare provider or registered dietitian. They can help assess your overall health, discuss potential risks, and create a personalized plan. Focus on sustainable lifestyle changes including balanced nutrition, regular physical activity, and adequate sleep rather than quick fixes.",
    category: "Action Steps"
  },
  {
    question: "How often should I calculate my BMI?",
    answer: "For general health monitoring, calculating BMI monthly or quarterly is usually sufficient. If you're actively working on weight management, weekly calculations might be helpful to track progress. Remember that weight naturally fluctuates, so focus on trends over time rather than daily changes.",
    category: "Frequency"
  },
  {
    question: "Are there alternatives to BMI?",
    answer: "Yes, several alternatives can provide additional insights: waist circumference, waist-to-hip ratio, body fat percentage, DEXA scans, and bioelectrical impedance analysis. These methods can give a more complete picture of body composition and health risks. Many healthcare providers use multiple measurements together.",
    category: "Alternatives"
  },
  {
    question: "Is this BMI calculator accurate?",
    answer: "Our BMI calculator uses the standard WHO formula (weight in kg / height in m²) and provides accurate mathematical results. The calculator includes both metric and imperial units with proper conversions. However, remember that BMI is just one health indicator, and the results should be considered alongside other health factors and professional medical advice.",
    category: "Tool Accuracy"
  },
  {
    question: "What causes BMI to be inaccurate?",
    answer: "BMI may be less accurate for: athletes and bodybuilders (high muscle mass), elderly adults (muscle loss), pregnant or breastfeeding women, people with certain medical conditions affecting weight or muscle mass, and individuals with different bone densities. In these cases, additional health assessments are recommended.",
    category: "Limitations"
  },
  {
    question: "How do I interpret my BMI results?",
    answer: "BMI results should be interpreted as part of overall health assessment. Consider factors like your activity level, muscle mass, health conditions, and family history. A healthcare provider can help you understand what your BMI means in the context of your individual health profile and goals.",
    category: "Interpretation"
  }
];

export default function BMICalculator() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateBMI = useCallback(() => {
    setError('');
    
    let heightInMeters: number;
    let weightInKg: number;

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
        
        if (heightValue > 300) {
          throw new Error('Height seems too high. Please check your input');
        }
        
        if (weightValue > 500) {
          throw new Error('Weight seems too high. Please check your input');
        }
        
        heightInMeters = heightValue / 100; // Convert cm to meters
        weightInKg = weightValue;
      } else {
        const feetValue = validateCalculatorInput(feet);
        const inchesValue = validateCalculatorInput(inches) || 0;
        const weightValue = validateCalculatorInput(weight);
        
        if (feetValue === null || inchesValue === null || weightValue === null) {
          throw new Error('Please enter valid numbers for height and weight');
        }
        
        if (feetValue <= 0 || weightValue <= 0) {
          throw new Error('Height and weight must be greater than zero');
        }
        
        if (feetValue > 10) {
          throw new Error('Height seems too high. Please check your input');
        }
        
        if (weightValue > 1000) {
          throw new Error('Weight seems too high. Please check your input');
        }
        
        // Convert feet and inches to meters
        const totalInches = (feetValue * 12) + inchesValue;
        heightInMeters = totalInches * 0.0254;
        
        // Convert pounds to kg
        weightInKg = weightValue * 0.453592;
      }

      const bmi = weightInKg / (heightInMeters * heightInMeters);
      
      let category: string;
      let color: string;
      let description: string;
      let recommendations: string[];
      let healthRisk: string;

      if (bmi < 18.5) {
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
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = 'text-green-600 bg-green-50 border-green-200';
        description = 'Healthy weight range';
        healthRisk = 'Lowest risk of weight-related health problems';
        recommendations = [
          'Maintain current lifestyle with balanced diet',
          'Continue regular physical activity',
          'Monitor weight periodically',
          'Focus on overall health and wellness'
        ];
      } else if (bmi >= 25 && bmi < 30) {
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

      setResult({
        bmi: Math.round(bmi * 10) / 10,
        category,
        color,
        description,
        recommendations,
        healthRisk
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  }, [height, weight, unit, feet, inches]);

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setFeet('');
    setInches('');
    setResult(null);
    setError('');
  };

  const getBMIChart = () => {
    const ranges = [
      { min: 0, max: 18.5, label: 'Underweight', color: 'bg-blue-500' },
      { min: 18.5, max: 25, label: 'Normal', color: 'bg-green-500' },
      { min: 25, max: 30, label: 'Overweight', color: 'bg-orange-500' },
      { min: 30, max: 40, label: 'Obese', color: 'bg-red-500' },
    ];

    return (
      <div className="mt-6">
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

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">BMI Calculator</h2>
        </div>

        {/* Unit Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Units</label>
          <div className="flex bg-accent rounded-lg p-1 w-full sm:w-fit overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setUnit('metric')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
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
                "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                unit === 'imperial' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Imperial (ft, lbs)
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                min="0"
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
                  min="0"
                  max="10"
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
              min="0"
              max={unit === 'metric' ? '500' : '1000'}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={calculateBMI}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* BMI Score */}
            <div className={cn("p-6 rounded-xl border-2", result.color)}>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2">{result.bmi}</div>
                <div className="text-xl font-semibold mb-1">{result.category}</div>
                <div className="text-sm opacity-80">{result.description}</div>
              </div>
              
              {/* Visual BMI Scale */}
              <div className="relative mt-6">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="flex-1 bg-blue-500"></div>
                  <div className="flex-1 bg-green-500"></div>
                  <div className="flex-1 bg-orange-500"></div>
                  <div className="flex-1 bg-red-500"></div>
                </div>
                <div className="flex justify-between text-xs mt-2 opacity-70">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                </div>
                {/* BMI Indicator */}
                <div 
                  className="absolute top-0 w-2 h-3 bg-gray-800 rounded-sm transform -translate-x-1/2"
                  style={{ 
                    left: `${Math.min(Math.max((result.bmi - 15) / (40 - 15) * 100, 0), 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Health Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Health Risk */}
              <div className="bg-background border rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Info className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Health Risk</h3>
                </div>
                <p className="text-sm text-muted-foreground">{result.healthRisk}</p>
              </div>

              {/* Target Range */}
              <div className="bg-background border rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Healthy BMI Range</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The healthy BMI range is <strong>18.5 - 24.9</strong>. This range is associated with the lowest health risks.
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Recommendations</h3>
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
        </div>
      </div>

      {/* FAQ Section with Accordion */}
      <FAQAccordion 
        faqs={bmiFAQs}
        className="mt-8"
      />
    </div>
  );
}