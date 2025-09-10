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

      {/* Comprehensive BMI Educational Content */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-6">What Is BMI and Why Does It Matter?</h2>
          <p className="text-muted-foreground mb-4">Body Mass Index (BMI) is a widely-used screening tool that estimates body fat based on your height and weight. Developed by Belgian mathematician Adolphe Quetelet in the 1830s, BMI provides a quick assessment of whether your weight falls within a healthy range for your height.</p>
          <p className="text-muted-foreground mb-4"><strong>BMI = weight (kg) / height (m)²</strong></p>
          <p className="text-muted-foreground mb-4">For those using imperial measurements: <strong>BMI = (weight in pounds × 703) / (height in inches)²</strong></p>
          <p className="text-muted-foreground mb-4">While BMI isn't a perfect measure of health, it remains one of the most practical tools for initial health screening.</p>
          <p className="text-muted-foreground mb-6">Healthcare providers worldwide use BMI alongside other assessments to evaluate potential health risks associated with weight.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Why Healthcare Professionals Use BMI</h3>
          <p className="text-muted-foreground mb-4">Despite its limitations, BMI continues to be valuable because it:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Provides standardized measurements</strong> across different populations</li>
            <li><strong>Requires only basic information</strong> - no special equipment needed</li>
            <li><strong>Correlates with health risks</strong> at population levels</li>
            <li><strong>Offers quick screening</strong> for potential weight-related health issues</li>
            <li><strong>Tracks changes over time</strong> to monitor health trends</li>
            <li><strong>Guides initial conversations</strong> about weight and health</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">BMI Categories and What They Mean</h2>
          <p className="text-muted-foreground mb-6">Understanding your BMI category helps you interpret your results and take appropriate action for your health.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Standard BMI Classification Table</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">BMI Range</th>
                  <th className="border border-border p-3 text-left font-semibold">Weight Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Health Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Below 18.5</td>
                  <td className="border border-border p-3">Underweight</td>
                  <td className="border border-border p-3">Increased health risks</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">18.5 - 24.9</td>
                  <td className="border border-border p-3">Normal weight</td>
                  <td className="border border-border p-3">Lowest health risks</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">25.0 - 29.9</td>
                  <td className="border border-border p-3">Overweight</td>
                  <td className="border border-border p-3">Moderately increased risks</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">30.0 - 34.9</td>
                  <td className="border border-border p-3">Class I Obesity</td>
                  <td className="border border-border p-3">High health risks</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">35.0 - 39.9</td>
                  <td className="border border-border p-3">Class II Obesity</td>
                  <td className="border border-border p-3">Very high health risks</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">40.0 and above</td>
                  <td className="border border-border p-3">Class III Obesity</td>
                  <td className="border border-border p-3">Extremely high health risks</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Detailed Category Explanations</h3>
          <h4 className="text-lg font-semibold text-foreground mb-3">Underweight (BMI &lt; 18.5)</h4>
          <p className="text-muted-foreground mb-3">Being underweight can signal nutritional deficiencies or underlying health conditions. Associated health risks include:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Nutritional deficiencies</strong> leading to anemia and vitamin shortages</li>
            <li><strong>Weakened immune system</strong> making you more susceptible to infections</li>
            <li><strong>Osteoporosis</strong> and increased fracture risk</li>
            <li><strong>Fertility problems</strong> in both men and women</li>
            <li><strong>Growth and development issues</strong> in children and adolescents</li>
            <li><strong>Decreased muscle mass</strong> affecting strength and mobility</li>
          </ul>
          <p className="text-muted-foreground mb-6">If your BMI indicates you're underweight, consider consulting a healthcare provider to rule out underlying conditions and develop a healthy weight gain plan.</p>

          <h4 className="text-lg font-semibold text-foreground mb-3">Normal Weight (BMI 18.5-24.9)</h4>
          <p className="text-muted-foreground mb-3">This range is associated with the lowest risk of weight-related health problems. Maintaining a BMI within this range typically indicates:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Optimal metabolic function</strong></li>
            <li><strong>Lower risk of chronic diseases</strong></li>
            <li><strong>Better physical mobility</strong></li>
            <li><strong>Improved mental health outcomes</strong></li>
            <li><strong>Enhanced quality of life</strong></li>
            <li><strong>Longer life expectancy</strong></li>
          </ul>
          <p className="text-muted-foreground mb-6">Even within the normal range, maintaining healthy lifestyle habits remains crucial for overall well-being.</p>

          <h4 className="text-lg font-semibold text-foreground mb-3">Overweight (BMI 25-29.9)</h4>
          <p className="text-muted-foreground mb-3">Being overweight increases your risk for several health conditions, though the risk level varies based on other factors like waist circumference, physical activity, and overall health status.</p>
          <p className="text-muted-foreground mb-3">Potential health concerns include:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Increased risk of type 2 diabetes</strong></li>
            <li><strong>Higher blood pressure</strong></li>
            <li><strong>Elevated cholesterol levels</strong></li>
            <li><strong>Greater strain on joints</strong></li>
            <li><strong>Sleep apnea development</strong></li>
            <li><strong>Increased inflammation markers</strong></li>
          </ul>
          <p className="text-muted-foreground mb-6">Many people in this category can significantly improve their health through modest weight loss of 5-10% of body weight.</p>

          <h4 className="text-lg font-semibold text-foreground mb-3">Obesity (BMI ≥ 30)</h4>
          <p className="text-muted-foreground mb-3">Obesity significantly increases health risks and is classified into three categories:</p>
          
          <p className="text-muted-foreground mb-3"><strong>Class I Obesity (BMI 30-34.9):</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4">
            <li>Substantially increased risk of metabolic syndrome</li>
            <li>Higher likelihood of cardiovascular disease</li>
            <li>Greater risk of certain cancers</li>
            <li>Increased joint problems and arthritis</li>
          </ul>

          <p className="text-muted-foreground mb-3"><strong>Class II Obesity (BMI 35-39.9):</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4 ml-4">
            <li>Very high risk of type 2 diabetes</li>
            <li>Severe sleep apnea</li>
            <li>Significant cardiovascular strain</li>
            <li>Reduced life expectancy by 2-4 years</li>
          </ul>

          <p className="text-muted-foreground mb-3"><strong>Class III Obesity (BMI ≥ 40):</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6 ml-4">
            <li>Extreme health risks requiring immediate medical attention</li>
            <li>Life expectancy reduced by 8-10 years</li>
            <li>Severe mobility limitations</li>
            <li>Qualification for bariatric surgery consideration</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">How to Calculate BMI Manually</h2>
          <p className="text-muted-foreground mb-6">While our calculator provides instant results, understanding the manual calculation helps you verify results and calculate BMI anywhere.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Step-by-Step BMI Calculation</h3>
          <h4 className="text-lg font-semibold text-foreground mb-3">Metric System Method:</h4>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Measure your weight</strong> in kilograms (kg)</li>
            <li><strong>Measure your height</strong> in meters (m)</li>
            <li><strong>Square your height</strong> (multiply height by itself)</li>
            <li><strong>Divide weight by height squared</strong></li>
          </ol>
          
          <p className="text-muted-foreground mb-2"><strong>Example:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6 ml-4">
            <li>Weight: 70 kg</li>
            <li>Height: 1.75 m</li>
            <li>Calculation: 70 ÷ (1.75 × 1.75) = 70 ÷ 3.06 = 22.9 BMI</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Imperial System Method:</h4>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Measure your weight</strong> in pounds (lbs)</li>
            <li><strong>Measure your height</strong> in inches</li>
            <li><strong>Square your height</strong> (multiply height by itself)</li>
            <li><strong>Divide weight by height squared</strong></li>
            <li><strong>Multiply by 703</strong></li>
          </ol>
          
          <p className="text-muted-foreground mb-2"><strong>Example:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6 ml-4">
            <li>Weight: 154 lbs</li>
            <li>Height: 69 inches</li>
            <li>Calculation: (154 ÷ (69 × 69)) × 703 = (154 ÷ 4761) × 703 = 22.7 BMI</li>
          </ul>

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

          <h2 className="text-2xl font-bold text-foreground mb-6">Understanding BMI Limitations and Considerations</h2>
          <p className="text-muted-foreground mb-6">While BMI is a useful screening tool, it's important to understand its limitations to interpret results correctly.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">When BMI May Not Be Accurate</h3>
          <p className="text-muted-foreground mb-4">BMI may provide misleading results for certain populations:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Athletes and Bodybuilders</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>High muscle mass</strong> can result in elevated BMI despite low body fat</li>
            <li><strong>Muscle tissue is denser</strong> than fat tissue</li>
            <li><strong>Body fat percentage</strong> may be more accurate for this population</li>
            <li><strong>DEXA scans</strong> or hydrostatic weighing provide better body composition data</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Elderly Adults</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Natural muscle loss</strong> (sarcopenia) with age</li>
            <li><strong>Bone density changes</strong> affect overall weight</li>
            <li><strong>Higher BMI</strong> may actually be protective in older adults</li>
            <li><strong>Functional capacity</strong> may be more important than BMI</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Children and Adolescents</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Growth spurts</strong> affect height-to-weight ratios temporarily</li>
            <li><strong>Age and sex-specific percentiles</strong> are more appropriate</li>
            <li><strong>Development stages</strong> influence body composition</li>
            <li><strong>Pediatric BMI charts</strong> should be used instead of adult categories</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Pregnant and Breastfeeding Women</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Natural weight gain</strong> during pregnancy</li>
            <li><strong>Fluid retention</strong> and increased blood volume</li>
            <li><strong>Pre-pregnancy BMI</strong> is more relevant for health assessment</li>
            <li><strong>Healthcare provider guidance</strong> is essential during this period</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Ethnic and Racial Considerations</h3>
          <p className="text-muted-foreground mb-4">Research suggests that BMI categories may need adjustment for different ethnic groups:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Asian Populations</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Lower BMI thresholds</strong> may be more appropriate</li>
            <li><strong>Higher risk at lower BMI</strong> for type 2 diabetes and cardiovascular disease</li>
            <li><strong>WHO Asian BMI categories:</strong> Overweight ≥23, Obese ≥27.5</li>
            <li><strong>Abdominal obesity</strong> is particularly concerning in Asian populations</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Other Ethnic Groups</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>African Americans</strong> may have higher BMI with similar health risks</li>
            <li><strong>Hispanic/Latino populations</strong> show varying patterns by subgroup</li>
            <li><strong>Individual assessment</strong> remains crucial regardless of ethnicity</li>
            <li><strong>Family history</strong> and genetic factors should be considered</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Better Health Assessment Methods</h2>
          <p className="text-muted-foreground mb-6">For a more comprehensive health assessment, consider these additional measurements alongside BMI:</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Waist Circumference</h3>
          <p className="text-muted-foreground mb-4">Waist circumference is a strong predictor of health risks, particularly cardiovascular disease and type 2 diabetes.</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Measurement Guidelines:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Measure at the natural waist</strong> (narrowest point between ribs and hips)</li>
            <li><strong>Use a flexible tape measure</strong></li>
            <li><strong>Measure while standing</strong> and breathing normally</li>
            <li><strong>Take measurement at the end of normal expiration</strong></li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Risk Categories:</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Gender</th>
                  <th className="border border-border p-3 text-left font-semibold">Low Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">Increased Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Men</td>
                  <td className="border border-border p-3">&lt; 94 cm (37 in)</td>
                  <td className="border border-border p-3">94-102 cm (37-40 in)</td>
                  <td className="border border-border p-3">&gt; 102 cm (40 in)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Women</td>
                  <td className="border border-border p-3">&lt; 80 cm (31.5 in)</td>
                  <td className="border border-border p-3">80-88 cm (31.5-34.6 in)</td>
                  <td className="border border-border p-3">&gt; 88 cm (34.6 in)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist-to-Hip Ratio</h3>
          <p className="text-muted-foreground mb-4">This ratio helps identify body fat distribution patterns and associated health risks.</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Calculation:</h4>
          <p className="text-muted-foreground mb-4"><strong>Waist-to-Hip Ratio = Waist Circumference ÷ Hip Circumference</strong></p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Risk Categories:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Men:</strong> &gt;0.90 indicates increased health risk</li>
            <li><strong>Women:</strong> &gt;0.85 indicates increased health risk</li>
            <li><strong>Apple vs. Pear shape:</strong> Higher ratios indicate more abdominal fat (apple shape), which carries greater health risks</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Body Fat Percentage</h3>
          <p className="text-muted-foreground mb-4">Body fat percentage provides direct measurement of fat versus lean tissue.</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Healthy Body Fat Ranges:</h4>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Age Group</th>
                  <th className="border border-border p-3 text-left font-semibold">Men</th>
                  <th className="border border-border p-3 text-left font-semibold">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">20-39 years</td>
                  <td className="border border-border p-3">8-20%</td>
                  <td className="border border-border p-3">21-33%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">40-59 years</td>
                  <td className="border border-border p-3">11-22%</td>
                  <td className="border border-border p-3">23-35%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">60-79 years</td>
                  <td className="border border-border p-3">13-25%</td>
                  <td className="border border-border p-3">24-36%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-semibold text-foreground mb-3">Measurement Methods:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>DEXA Scan:</strong> Most accurate, measures bone density, lean mass, and fat mass</li>
            <li><strong>Hydrostatic Weighing:</strong> Highly accurate underwater weighing method</li>
            <li><strong>Bod Pod:</strong> Air displacement plethysmography</li>
            <li><strong>Bioelectrical Impedance:</strong> Quick but less accurate, affected by hydration</li>
            <li><strong>Skinfold Calipers:</strong> Inexpensive but requires skill for accuracy</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Health Implications by BMI Category</h2>
          <p className="text-muted-foreground mb-6">Understanding the specific health risks associated with each BMI category helps you make informed decisions about your health.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Underweight Health Risks</h3>
          <p className="text-muted-foreground mb-4">Being underweight (BMI &lt; 18.5) can be as concerning as being overweight and may indicate:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Immediate Health Concerns:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Malnutrition:</strong> Insufficient calories and essential nutrients</li>
            <li><strong>Anemia:</strong> Low iron levels leading to fatigue and weakness</li>
            <li><strong>Vitamin deficiencies:</strong> Particularly B vitamins, vitamin D, and fat-soluble vitamins</li>
            <li><strong>Protein deficiency:</strong> Leading to muscle wasting and poor healing</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Long-term Health Risks:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Osteoporosis:</strong> Increased risk of bone fractures and low bone density</li>
            <li><strong>Compromised immune function:</strong> Higher susceptibility to infections</li>
            <li><strong>Fertility issues:</strong> Irregular menstruation in women, low testosterone in men</li>
            <li><strong>Delayed wound healing:</strong> Poor recovery from injuries and surgeries</li>
            <li><strong>Increased mortality risk:</strong> Higher death rates from various causes</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Potential Underlying Causes:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Eating disorders:</strong> Anorexia nervosa, bulimia, or restrictive eating patterns</li>
            <li><strong>Medical conditions:</strong> Hyperthyroidism, inflammatory bowel disease, celiac disease</li>
            <li><strong>Mental health issues:</strong> Depression, anxiety affecting appetite and eating</li>
            <li><strong>Medications:</strong> Side effects causing loss of appetite or nausea</li>
            <li><strong>Socioeconomic factors:</strong> Limited access to adequate nutrition</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Normal Weight Health Benefits</h3>
          <p className="text-muted-foreground mb-4">Maintaining a normal BMI (18.5-24.9) is associated with optimal health outcomes:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Physical Health Benefits:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Optimal cardiovascular function:</strong> Lower blood pressure and healthy cholesterol levels</li>
            <li><strong>Reduced diabetes risk:</strong> Better insulin sensitivity and glucose metabolism</li>
            <li><strong>Lower cancer risk:</strong> Reduced risk of obesity-related cancers</li>
            <li><strong>Better joint health:</strong> Less stress on weight-bearing joints</li>
            <li><strong>Improved respiratory function:</strong> Better lung capacity and breathing</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Mental and Social Benefits:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Enhanced self-esteem:</strong> Greater body satisfaction and confidence</li>
            <li><strong>Better sleep quality:</strong> Reduced risk of sleep apnea and better rest</li>
            <li><strong>Increased energy levels:</strong> Better physical stamina and vitality</li>
            <li><strong>Improved mobility:</strong> Greater ease in physical activities and exercise</li>
            <li><strong>Longevity:</strong> Associated with longer life expectancy</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Overweight Health Implications</h3>
          <p className="text-muted-foreground mb-4">Being overweight (BMI 25-29.9) increases health risks, but many can be reduced with lifestyle modifications:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Metabolic Risks:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Prediabetes:</strong> Elevated blood sugar levels leading to type 2 diabetes risk</li>
            <li><strong>Insulin resistance:</strong> Reduced cellular response to insulin</li>
            <li><strong>Metabolic syndrome:</strong> Cluster of conditions increasing heart disease risk</li>
            <li><strong>Dyslipidemia:</strong> Abnormal cholesterol and triglyceride levels</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Cardiovascular Risks:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Hypertension:</strong> High blood pressure increasing heart disease risk</li>
            <li><strong>Coronary artery disease:</strong> Plaque buildup in heart arteries</li>
            <li><strong>Stroke risk:</strong> Increased cerebrovascular events</li>
            <li><strong>Heart failure:</strong> Reduced cardiac function over time</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Other Health Concerns:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Sleep apnea:</strong> Breathing interruptions during sleep</li>
            <li><strong>Gallbladder disease:</strong> Increased risk of gallstones</li>
            <li><strong>Osteoarthritis:</strong> Joint pain and stiffness from excess weight</li>
            <li><strong>Fatty liver disease:</strong> Non-alcoholic liver fat accumulation</li>
            <li><strong>Gastroesophageal reflux:</strong> Acid reflux and heartburn</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Obesity Health Complications</h3>
          <p className="text-muted-foreground mb-4">Obesity (BMI ≥ 30) significantly increases the risk of serious health complications:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Severe Health Conditions:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Type 2 diabetes:</strong> Dramatically increased risk requiring medication management</li>
            <li><strong>Cardiovascular disease:</strong> Heart attacks, strokes, and heart failure</li>
            <li><strong>Cancer:</strong> Increased risk of breast, colon, endometrial, kidney, and liver cancers</li>
            <li><strong>Severe sleep apnea:</strong> Potentially life-threatening breathing disruptions</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Quality of Life Issues:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Physical limitations:</strong> Difficulty with daily activities and exercise</li>
            <li><strong>Mental health challenges:</strong> Depression, anxiety, and social isolation</li>
            <li><strong>Work limitations:</strong> Reduced productivity and increased sick days</li>
            <li><strong>Reproductive health:</strong> Fertility problems and pregnancy complications</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Class III Obesity (BMI ≥ 40) Complications:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Severe mobility issues:</strong> Wheelchair dependence and immobility</li>
            <li><strong>Multiple organ dysfunction:</strong> Heart, liver, kidney, and lung problems</li>
            <li><strong>Dramatically reduced lifespan:</strong> 8-10 year reduction in life expectancy</li>
            <li><strong>Surgical candidacy:</strong> May qualify for bariatric surgery intervention</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Practical Tips for Healthy Weight Management</h2>
          <p className="text-muted-foreground mb-6">Regardless of your current BMI category, these evidence-based strategies can help you achieve and maintain a healthy weight.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Sustainable Weight Loss Strategies</h3>
          <p className="text-muted-foreground mb-4">For those needing to lose weight, focus on gradual, sustainable changes rather than rapid weight loss:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Nutritional Approaches:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Create a moderate calorie deficit:</strong> 500-750 calories per day for 1-2 pounds weekly loss</li>
            <li><strong>Focus on whole foods:</strong> Vegetables, fruits, lean proteins, whole grains, healthy fats</li>
            <li><strong>Control portion sizes:</strong> Use smaller plates, measure servings, practice mindful eating</li>
            <li><strong>Stay hydrated:</strong> Drink water before meals, limit sugary beverages</li>
            <li><strong>Plan meals:</strong> Prepare healthy options in advance to avoid impulsive choices</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Physical Activity Guidelines:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Aim for 150-300 minutes</strong> of moderate aerobic activity weekly</li>
            <li><strong>Include strength training</strong> 2-3 times per week for all major muscle groups</li>
            <li><strong>Start gradually:</strong> Begin with 10-minute sessions if you're sedentary</li>
            <li><strong>Find enjoyable activities:</strong> Dancing, swimming, hiking, sports you enjoy</li>
            <li><strong>Increase daily movement:</strong> Take stairs, park farther, walk during breaks</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Behavioral Changes:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Set realistic goals:</strong> Small, achievable targets that build momentum</li>
            <li><strong>Track progress:</strong> Food diary, weight log, or fitness app</li>
            <li><strong>Get adequate sleep:</strong> 7-9 hours per night for optimal metabolism</li>
            <li><strong>Manage stress:</strong> Meditation, yoga, or other stress-reduction techniques</li>
            <li><strong>Seek support:</strong> Family, friends, or professional guidance</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Healthy Weight Gain for Underweight Individuals</h3>
          <p className="text-muted-foreground mb-4">Those who are underweight need a different approach focused on healthy weight gain:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Nutrition Strategies:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Increase calorie density:</strong> Add healthy fats like nuts, avocado, olive oil</li>
            <li><strong>Eat frequent meals:</strong> 5-6 smaller meals throughout the day</li>
            <li><strong>Choose nutrient-dense foods:</strong> Whole grains, lean proteins, healthy fats</li>
            <li><strong>Drink calories:</strong> Smoothies, milk, protein shakes between meals</li>
            <li><strong>Don't fill up on water:</strong> Drink beverages after meals, not before</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Exercise for Weight Gain:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Focus on strength training:</strong> Build lean muscle mass through resistance exercises</li>
            <li><strong>Limit excessive cardio:</strong> Too much can burn calories needed for weight gain</li>
            <li><strong>Progressive overload:</strong> Gradually increase weights and intensity</li>
            <li><strong>Allow recovery time:</strong> Rest between strength training sessions</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Weight Maintenance Strategies</h3>
          <p className="text-muted-foreground mb-4">For those in the normal BMI range, focus on maintaining your healthy weight:</p>
          
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Regular monitoring:</strong> Weekly weigh-ins to catch changes early</li>
            <li><strong>Consistent eating patterns:</strong> Regular meal times and balanced nutrition</li>
            <li><strong>Stay active:</strong> Maintain regular exercise routine</li>
            <li><strong>Adjust as needed:</strong> Modify intake based on activity level changes</li>
            <li><strong>Plan for challenges:</strong> Holidays, vacations, stress periods</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">When to Consult Healthcare Professionals</h2>
          <p className="text-muted-foreground mb-6">While BMI is a useful starting point, professional medical assessment provides personalized health guidance.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Situations Requiring Medical Consultation</h3>
          <p className="text-muted-foreground mb-4">Consult with healthcare providers in these situations:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">BMI-Related Concerns:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>BMI below 18.5 or above 30:</strong> Outside normal range requiring assessment</li>
            <li><strong>Rapid weight changes:</strong> Unexplained weight loss or gain</li>
            <li><strong>Difficulty reaching healthy weight:</strong> Despite diet and exercise efforts</li>
            <li><strong>Weight cycling:</strong> Repeated weight loss and regain patterns</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Health Symptoms:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Metabolic symptoms:</strong> High blood pressure, blood sugar, or cholesterol</li>
            <li><strong>Sleep disturbances:</strong> Snoring, sleep apnea, or poor sleep quality</li>
            <li><strong>Joint pain:</strong> Knee, hip, or back pain related to weight</li>
            <li><strong>Breathing difficulties:</strong> Shortness of breath during activities</li>
            <li><strong>Mental health concerns:</strong> Depression, anxiety about weight or body image</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Special Populations:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Athletes:</strong> High muscle mass affecting BMI accuracy</li>
            <li><strong>Elderly adults:</strong> Age-related changes in body composition</li>
            <li><strong>Children and teens:</strong> Growth and development considerations</li>
            <li><strong>Pregnant women:</strong> Pre-pregnancy BMI and weight gain guidance</li>
            <li><strong>Chronic conditions:</strong> Medical conditions affecting weight or metabolism</li>
          </ul>

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
        faqs={bmiFAQs}
        className="mt-8"
      />
    </div>
  );
}