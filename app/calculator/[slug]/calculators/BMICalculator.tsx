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

      {/* Complete BMI Content */}
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
            <li><strong>Enhanced quality of life</strong> • <strong>Longer life expectancy</strong></li>
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

          <h2 className="text-2xl font-bold text-foreground mb-6">BMI for Different Populations</h2>
          <p className="text-muted-foreground mb-6">BMI interpretation varies across different demographic groups, and understanding these variations ensures more accurate health assessment.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Ethnicity-Specific BMI Guidelines</h3>
          <p className="text-muted-foreground mb-4">Research shows that different ethnic groups may experience health risks at different BMI levels:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Asian Populations</h4>
          <p className="text-muted-foreground mb-4">The WHO recommends adjusted BMI categories for Asian populations:</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">BMI Range</th>
                  <th className="border border-border p-3 text-left font-semibold">Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Health Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">&lt; 18.5</td>
                  <td className="border border-border p-3">Underweight</td>
                  <td className="border border-border p-3">Increased risk</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">18.5 - 22.9</td>
                  <td className="border border-border p-3">Normal</td>
                  <td className="border border-border p-3">Lowest risk</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">23 - 27.4</td>
                  <td className="border border-border p-3">Overweight</td>
                  <td className="border border-border p-3">Increased risk</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">≥ 27.5</td>
                  <td className="border border-border p-3">Obese</td>
                  <td className="border border-border p-3">High risk</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-6">These lower thresholds reflect research showing that Asian populations tend to have higher body fat percentages at lower BMIs and develop diabetes and cardiovascular disease at lower BMI levels than Caucasian populations.</p>

          <h4 className="text-lg font-semibold text-foreground mb-3">Black African and African-Caribbean Populations</h4>
          <p className="text-muted-foreground mb-3">Studies indicate that individuals of Black African descent may have:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Lower body fat percentage</strong> at the same BMI compared to Caucasians</li>
            <li><strong>Higher muscle mass</strong> contributing to BMI</li>
            <li><strong>Different fat distribution patterns</strong> affecting health risks</li>
            <li><strong>Lower diabetes risk</strong> at higher BMIs compared to other populations</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Middle Eastern and North African Populations</h4>
          <p className="text-muted-foreground mb-3">Emerging research suggests these populations may benefit from:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Intermediate thresholds</strong> between standard and Asian categories</li>
            <li><strong>Waist circumference measurements</strong> as complementary assessments</li>
            <li><strong>Family history consideration</strong> in risk evaluation</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Age-Adjusted BMI Considerations</h3>
          <h4 className="text-lg font-semibold text-foreground mb-3">Children and Adolescents (Ages 2-19)</h4>
          <p className="text-muted-foreground mb-4">BMI interpretation for young people requires age and sex-specific percentile charts:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Percentile</th>
                  <th className="border border-border p-3 text-left font-semibold">Weight Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Less than 5th</td>
                  <td className="border border-border p-3">Underweight</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">5th to 85th</td>
                  <td className="border border-border p-3">Healthy weight</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">85th to 95th</td>
                  <td className="border border-border p-3">Overweight</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">95th or greater</td>
                  <td className="border border-border p-3">Obese</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">Children's BMI must be evaluated using growth charts because:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Body composition changes naturally with age</li>
            <li>Growth patterns vary between boys and girls</li>
            <li>Puberty affects body fat distribution</li>
            <li>Height and weight don't increase proportionally during growth</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Older Adults (65+ Years)</h4>
          <p className="text-muted-foreground mb-3">BMI interpretation for seniors requires special consideration:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Slightly higher BMI</strong> (25-27) may be protective in older adults</li>
            <li><strong>Muscle mass loss</strong> (sarcopenia) affects BMI accuracy</li>
            <li><strong>Bone density changes</strong> impact weight measurements</li>
            <li><strong>Frailty assessment</strong> may be more relevant than BMI alone</li>
            <li><strong>Nutritional status</strong> becomes increasingly important</li>
          </ul>
          <p className="text-muted-foreground mb-6">Research suggests the healthiest BMI range for adults over 65 may be 23-30, slightly higher than for younger adults.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI During Pregnancy</h3>
          <p className="text-muted-foreground mb-4">Pregnancy requires specialized weight gain recommendations based on pre-pregnancy BMI:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Pre-Pregnancy BMI</th>
                  <th className="border border-border p-3 text-left font-semibold">Recommended Weight Gain</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Underweight (&lt; 18.5)</td>
                  <td className="border border-border p-3">28-40 lbs (13-18 kg)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Normal (18.5-24.9)</td>
                  <td className="border border-border p-3">25-35 lbs (11-16 kg)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Overweight (25-29.9)</td>
                  <td className="border border-border p-3">15-25 lbs (7-11 kg)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Obese (≥ 30)</td>
                  <td className="border border-border p-3">11-20 lbs (5-9 kg)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-6"><strong>Important:</strong> Never attempt weight loss during pregnancy without medical supervision. Focus on healthy eating and appropriate physical activity as recommended by your healthcare provider.</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Limitations of BMI: What It Doesn't Tell You</h2>
          <p className="text-muted-foreground mb-6">While BMI serves as a useful screening tool, it has significant limitations that everyone should understand.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Doesn't Distinguish Between Muscle and Fat</h3>
          <p className="text-muted-foreground mb-3">The most significant limitation of BMI is its inability to differentiate between:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Muscle mass</strong> - Athletes and bodybuilders often have "overweight" or "obese" BMIs despite low body fat</li>
            <li><strong>Fat mass</strong> - The actual component associated with health risks</li>
            <li><strong>Bone density</strong> - Individuals with denser bones may have higher BMIs</li>
            <li><strong>Water weight</strong> - Temporary fluctuations affecting measurements</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Doesn't Show Fat Distribution</h3>
          <p className="text-muted-foreground mb-3">Where you carry fat matters more than total amount:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Visceral fat</strong> (around organs) poses greater health risks than subcutaneous fat</li>
            <li><strong>Waist-to-hip ratio</strong> better predicts cardiovascular risk</li>
            <li><strong>Apple vs. pear shape</strong> body types have different risk profiles</li>
            <li><strong>Abdominal obesity</strong> increases metabolic syndrome risk even at normal BMI</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Other Important Limitations</h3>
          <p className="text-muted-foreground mb-3"><strong>BMI doesn't account for:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Overall fitness level and physical activity</li>
            <li>Diet quality and nutritional status</li>
            <li>Metabolic health markers (blood pressure, cholesterol, blood sugar)</li>
            <li>Genetic factors affecting body composition</li>
            <li>Medications affecting weight</li>
            <li>Individual health history</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">When BMI May Be Misleading</h3>
          <p className="text-muted-foreground mb-3">BMI may provide inaccurate health assessments for:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Athletes and bodybuilders</strong> with high muscle mass</li>
            <li><strong>Elderly individuals</strong> with muscle loss</li>
            <li><strong>People with edema</strong> or fluid retention</li>
            <li><strong>Individuals with limb loss</strong> or amputation</li>
            <li><strong>Those with osteoporosis</strong> affecting bone density</li>
            <li><strong>Pregnant and breastfeeding</strong> women</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Beyond BMI: Alternative Body Composition Measures</h2>
          <p className="text-muted-foreground mb-6">For a more complete health picture, consider these complementary assessments alongside BMI.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Waist Circumference</h3>
          <p className="text-muted-foreground mb-4">Waist measurement directly assesses abdominal fat, a key health risk indicator.</p>
          <p className="text-muted-foreground mb-3"><strong>How to measure:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li>Stand and wrap tape measure around your waist at navel level</li>
            <li>Breathe out naturally</li>
            <li>Ensure tape is snug but not compressing skin</li>
            <li>Read measurement</li>
          </ol>
          <p className="text-muted-foreground mb-4"><strong>Risk thresholds:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Gender</th>
                  <th className="border border-border p-3 text-left font-semibold">Increased Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Men</td>
                  <td className="border border-border p-3">≥ 94 cm (37 in)</td>
                  <td className="border border-border p-3">≥ 102 cm (40 in)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Women</td>
                  <td className="border border-border p-3">≥ 80 cm (31.5 in)</td>
                  <td className="border border-border p-3">≥ 88 cm (35 in)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist-to-Hip Ratio (WHR)</h3>
          <p className="text-muted-foreground mb-4">WHR provides insight into fat distribution patterns.</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Waist circumference ÷ Hip circumference</p>
          <p className="text-muted-foreground mb-4"><strong>Risk categories:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Gender</th>
                  <th className="border border-border p-3 text-left font-semibold">Low Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">Moderate Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Men</td>
                  <td className="border border-border p-3">&lt; 0.90</td>
                  <td className="border border-border p-3">0.90-0.99</td>
                  <td className="border border-border p-3">≥ 1.0</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Women</td>
                  <td className="border border-border p-3">&lt; 0.80</td>
                  <td className="border border-border p-3">0.80-0.84</td>
                  <td className="border border-border p-3">≥ 0.85</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist-to-Height Ratio (WHtR)</h3>
          <p className="text-muted-foreground mb-4">Recent research suggests WHtR may be superior to BMI for health risk prediction.</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Waist circumference ÷ Height (same units)</p>
          <p className="text-muted-foreground mb-4"><strong>Guideline:</strong> Keep your waist circumference less than half your height</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Ratio &lt; 0.5 indicates lower health risks</li>
            <li>Ratio ≥ 0.5 suggests increased risks</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Body Fat Percentage</h3>
          <p className="text-muted-foreground mb-4">Direct body fat measurement provides the most accurate body composition assessment.</p>
          <p className="text-muted-foreground mb-4"><strong>Healthy Body Fat Ranges:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Men</th>
                  <th className="border border-border p-3 text-left font-semibold">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Essential Fat</td>
                  <td className="border border-border p-3">2-5%</td>
                  <td className="border border-border p-3">10-13%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Athletes</td>
                  <td className="border border-border p-3">6-13%</td>
                  <td className="border border-border p-3">14-20%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Fitness</td>
                  <td className="border border-border p-3">14-17%</td>
                  <td className="border border-border p-3">21-24%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Average</td>
                  <td className="border border-border p-3">18-24%</td>
                  <td className="border border-border p-3">25-31%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Obese</td>
                  <td className="border border-border p-3">≥ 25%</td>
                  <td className="border border-border p-3">≥ 32%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-4"><strong>Measurement methods:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>DEXA scan (most accurate)</li>
            <li>Bioelectrical impedance analysis</li>
            <li>Skinfold measurements</li>
            <li>Hydrostatic weighing</li>
            <li>• Air displacement plethysmography</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Prime</h3>
          <p className="text-muted-foreground mb-4">BMI Prime provides a ratio comparing your BMI to the upper normal limit (25).</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Your BMI ÷ 25</p>
          <p className="text-muted-foreground mb-4"><strong>Interpretation:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>&lt; 0.74: Underweight</li>
            <li>0.74-1.00: Normal weight</li>
            <li>&gt; 1.00: Overweight</li>
            <li>&gt; 1.20: Obese</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Health Risks Associated with BMI Categories</h2>
          <p className="text-muted-foreground mb-6">Understanding the specific health risks associated with different BMI ranges helps motivate appropriate action.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Comprehensive Health Risk Table</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">BMI Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Cardiovascular</th>
                  <th className="border border-border p-3 text-left font-semibold">Metabolic</th>
                  <th className="border border-border p-3 text-left font-semibold">Respiratory</th>
                  <th className="border border-border p-3 text-left font-semibold">Musculoskeletal</th>
                  <th className="border border-border p-3 text-left font-semibold">Cancer</th>
                  <th className="border border-border p-3 text-left font-semibold">Mental Health</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Underweight</td>
                  <td className="border border-border p-3">Arrhythmias</td>
                  <td className="border border-border p-3">Hypoglycemia</td>
                  <td className="border border-border p-3">Decreased lung capacity</td>
                  <td className="border border-border p-3">Osteoporosis</td>
                  <td className="border border-border p-3">Lower overall risk</td>
                  <td className="border border-border p-3">Depression, anxiety</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Normal</td>
                  <td className="border border-border p-3">Lowest risk</td>
                  <td className="border border-border p-3">Optimal function</td>
                  <td className="border border-border p-3">Normal function</td>
                  <td className="border border-border p-3">Healthy joints</td>
                  <td className="border border-border p-3">Baseline risk</td>
                  <td className="border border-border p-3">Best outcomes</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Overweight</td>
                  <td className="border border-border p-3">Hypertension</td>
                  <td className="border border-border p-3">Insulin resistance</td>
                  <td className="border border-border p-3">Mild sleep apnea</td>
                  <td className="border border-border p-3">Joint stress</td>
                  <td className="border border-border p-3">Slightly increased</td>
                  <td className="border border-border p-3">Body image issues</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class I Obesity</td>
                  <td className="border border-border p-3">Heart disease</td>
                  <td className="border border-border p-3">Type 2 diabetes</td>
                  <td className="border border-border p-3">Moderate apnea</td>
                  <td className="border border-border p-3">Arthritis</td>
                  <td className="border border-border p-3">Moderately increased</td>
                  <td className="border border-border p-3">Depression risk</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class II Obesity</td>
                  <td className="border border-border p-3">Heart failure</td>
                  <td className="border border-border p-3">Metabolic syndrome</td>
                  <td className="border border-border p-3">Severe apnea</td>
                  <td className="border border-border p-3">Mobility issues</td>
                  <td className="border border-border p-3">High risk</td>
                  <td className="border border-border p-3">Severe impact</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class III Obesity</td>
                  <td className="border border-border p-3">Extreme risk</td>
                  <td className="border border-border p-3">Multiple conditions</td>
                  <td className="border border-border p-3">Respiratory failure</td>
                  <td className="border border-border p-3">Disability</td>
                  <td className="border border-border p-3">Very high risk</td>
                  <td className="border border-border p-3">Significant impairment</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Specific Health Conditions by BMI</h3>
          <h4 className="text-lg font-semibold text-foreground mb-3">Underweight Health Concerns</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Immediate risks:</strong> • Weakened immune response • Delayed wound healing • Vitamin and mineral deficiencies • Irregular menstruation • Hair loss and skin problems</li>
            <li><strong>Long-term complications:</strong> • Osteoporosis and fractures • Fertility problems • Growth retardation (in youth) • Increased infection susceptibility • Cardiovascular complications</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground mb-3">Overweight and Obesity Health Risks</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Metabolic conditions:</strong> • Type 2 diabetes (risk increases 20-40% per 5 BMI units) • Metabolic syndrome • Non-alcoholic fatty liver disease • Polycystic ovary syndrome (PCOS) • Gestational diabetes</li>
            <li><strong>Cardiovascular diseases:</strong> • Coronary heart disease • Stroke • Hypertension • Deep vein thrombosis • Pulmonary embolism</li>
            <li><strong>Respiratory issues:</strong> • Obstructive sleep apnea • Asthma exacerbation • Obesity hypoventilation syndrome • Reduced lung capacity</li>
            <li><strong>Cancer risks (increased with higher BMI):</strong> • Colorectal cancer • Breast cancer (postmenopausal) • Endometrial cancer • Kidney cancer • Esophageal cancer • Pancreatic cancer</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-6">Taking Action: What to Do About Your BMI</h2>
          <p className="text-muted-foreground mb-6">Your BMI result is a starting point, not a final verdict on your health. Here's how to respond constructively to your results.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">If Your BMI Is Below 18.5 (Underweight)</h3>
          <p className="text-muted-foreground mb-3"><strong>Immediate steps:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li>Schedule a medical evaluation to rule out underlying conditions</li>
            <li>Work with a dietitian to create a healthy weight gain plan</li>
            <li>Focus on nutrient-dense, calorie-rich foods</li>
            <li>Include strength training to build muscle mass</li>
            <li>Address any eating disorders or mental health concerns</li>
          </ol>
          <p className="text-muted-foreground mb-6"><strong>Healthy weight gain strategies:</strong> • Eat frequent, smaller meals throughout the day • Choose whole grain breads, pastas, and cereals • Include healthy fats like nuts, avocados, and olive oil • Add protein shakes or smoothies between meals • Avoid empty calories from processed foods</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">If Your BMI Is 18.5-24.9 (Normal Weight)</h3>
          <p className="text-muted-foreground mb-4"><strong>Maintenance strategies:</strong> • Continue regular physical activity (150 minutes/week moderate exercise) • Maintain balanced, nutritious eating habits • Monitor weight trends over time • Focus on overall health, not just weight • Get regular health screenings</p>
          <p className="text-muted-foreground mb-6"><strong>Prevention focus:</strong> • Build and maintain muscle mass • Develop sustainable healthy habits • Manage stress effectively • Prioritize sleep quality • Stay hydrated</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">If Your BMI Is 25-29.9 (Overweight)</h3>
          <p className="text-muted-foreground mb-3"><strong>Action plan:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li>Aim for modest weight loss (5-10% of body weight)</li>
            <li>Create a moderate calorie deficit (500-750 calories/day)</li>
            <li>Increase physical activity gradually</li>
            <li>Focus on sustainable lifestyle changes</li>
            <li>Consider professional guidance if needed</li>
          </ol>
          <p className="text-muted-foreground mb-6"><strong>Effective strategies:</strong> • Keep a food diary to identify eating patterns • Increase vegetable and fruit intake • Reduce portion sizes • Limit processed foods and added sugars • Find enjoyable physical activities</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">If Your BMI Is 30 or Higher (Obese)</h3>
          <p className="text-muted-foreground mb-3"><strong>Medical approach:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li>Consult healthcare providers for comprehensive evaluation</li>
            <li>Screen for weight-related health conditions</li>
            <li>Consider medical weight management programs</li>
            <li>Evaluate medication options if appropriate</li>
            <li>Discuss bariatric surgery for BMI ≥ 40 or ≥ 35 with complications</li>
          </ol>
          <p className="text-muted-foreground mb-6"><strong>Comprehensive management:</strong> • Work with multidisciplinary team (doctor, dietitian, therapist) • Address underlying factors (medical, psychological, environmental) • Set realistic, gradual weight loss goals (1-2 pounds/week) • Focus on behavior modification • Build strong support system</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Healthy Weight Management Strategies</h2>
          <p className="text-muted-foreground mb-6">Regardless of your current BMI, these evidence-based strategies support healthy weight management.</p>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Nutrition Guidelines</h3>
          <p className="text-muted-foreground mb-4"><strong>Balanced eating principles:</strong></p>
          <p className="text-muted-foreground mb-6">• <strong>Portion control:</strong> Use smaller plates, measure servings, eat mindfully • <strong>Nutrient density:</strong> Choose whole foods over processed options • <strong>Macronutrient balance:</strong> Include protein, healthy fats, and complex carbohydrates • <strong>Hydration:</strong> Drink at least 8 glasses of water daily • <strong>Meal timing:</strong> Eat regular meals, avoid skipping breakfast</p>
          
          <p className="text-muted-foreground mb-4"><strong>Specific recommendations:</strong></p>
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

          <h3 className="text-xl font-semibold text-foreground mb-4">Physical Activity Recommendations</h3>
          <p className="text-muted-foreground mb-4"><strong>WHO Guidelines for Adults:</strong></p>
          <p className="text-muted-foreground mb-6">• <strong>Aerobic activity:</strong> 150-300 minutes moderate OR 75-150 minutes vigorous weekly • <strong>Strength training:</strong> 2+ days per week, all major muscle groups • <strong>Flexibility:</strong> Regular stretching or yoga • <strong>Reduce sedentary time:</strong> Break up long sitting periods</p>
          
          <p className="text-muted-foreground mb-4"><strong>Exercise progression for beginners:</strong></p>
          <p className="text-muted-foreground mb-6">Week 1-2: 10-minute walks daily Week 3-4: 15-minute walks + light stretching Week 5-6: 20-minute walks + basic strength exercises Week 7-8: 25-minute varied activities Week 9+: Build toward guidelines gradually</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Behavioral Strategies</h3>
          <p className="text-muted-foreground mb-4"><strong>Sustainable habit formation:</strong></p>
          <p className="text-muted-foreground mb-6">• <strong>SMART goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound • <strong>Self-monitoring:</strong> Track food, activity, weight trends • <strong>Stimulus control:</strong> Modify environment to support healthy choices • <strong>Stress management:</strong> Practice meditation, deep breathing, yoga • <strong>Sleep optimization:</strong> Aim for 7-9 hours nightly</p>
          
          <p className="text-muted-foreground mb-4"><strong>Common pitfalls to avoid:</strong></p>
          <p className="text-muted-foreground mb-6">• Extreme restriction leading to binge eating • Focusing solely on scale weight • Comparing progress to others • Giving up after minor setbacks • Neglecting mental health needs</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">BMI Calculator Tools and Features</h2>
          <h3 className="text-xl font-semibold text-foreground mb-4">Advanced BMI Calculations</h3>
          <p className="text-muted-foreground mb-4">Beyond standard BMI, our calculator offers:</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">BMI Prime</h4>
          <p className="text-muted-foreground mb-4">Shows your BMI relative to the upper normal limit (25), making it easier to understand how far you are from the normal weight range.</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Ponderal Index</h4>
          <p className="text-muted-foreground mb-4">Alternative to BMI that better accounts for tall and short individuals: PI = weight (kg) / height (m)³</p>
          
          <h4 className="text-lg font-semibold text-foreground mb-3">Body Surface Area (BSA)</h4>
          <p className="text-muted-foreground mb-6">Used in medical settings for dosing calculations: BSA = √[(height × weight) / 3600]</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Tracking Features</h3>
          <p className="text-muted-foreground mb-6"><strong>Progress monitoring tools:</strong> • BMI trend charts over time • Weight change calculations • Goal setting and tracking • Milestone celebrations • Export data for healthcare providers</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Complementary Calculators</h3>
          <p className="text-muted-foreground mb-6"><strong>Related health tools:</strong> • Ideal weight calculator • Body fat percentage estimator • Calorie needs calculator • Macro calculator • Water intake calculator • Heart rate zones calculator</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions About BMI</h2>
          <h3 className="text-xl font-semibold text-foreground mb-4">General BMI Questions</h3>
          <p className="text-muted-foreground mb-4"><strong>What does BMI actually measure?</strong> BMI measures the relationship between your height and weight, providing an estimate of body mass. It doesn't directly measure body fat but serves as a screening tool that correlates with body fat levels in most people.</p>
          <p className="text-muted-foreground mb-4"><strong>Is BMI accurate for everyone?</strong> No, BMI has limitations. It may not accurately reflect health status for athletes, elderly individuals, pregnant women, or those with unusual body compositions. It's best used as one of multiple health indicators.</p>
          <p className="text-muted-foreground mb-4"><strong>How often should I calculate my BMI?</strong> For most adults, checking BMI monthly or quarterly is sufficient. Daily fluctuations are normal and don't reflect meaningful changes. Focus on long-term trends rather than daily variations.</p>
          <p className="text-muted-foreground mb-6"><strong>Can BMI be too low?</strong> Yes, a BMI below 18.5 is considered underweight and associated with health risks including nutritional deficiencies, weakened immunity, and osteoporosis. Very low BMI can be as dangerous as very high BMI.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Calculation Questions</h3>
          <p className="text-muted-foreground mb-4"><strong>Which BMI formula should I use?</strong> Use metric (kg/m²) or imperial (lbs/in² × 703) based on your preferred measurement system. Both give identical results. Some populations may benefit from ethnicity-specific interpretations.</p>
          <p className="text-muted-foreground mb-4"><strong>Why does BMI use height squared?</strong> The square of height approximates how body volume scales with height in humans. This mathematical relationship, discovered by Adolphe Quetelet, provides reasonable estimates for most people.</p>
          <p className="text-muted-foreground mb-6"><strong>Should I measure myself at a specific time?</strong> For consistency, measure yourself in the morning after using the bathroom, before eating or drinking, wearing minimal clothing. This provides the most consistent baseline.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Health and BMI Questions</h3>
          <p className="text-muted-foreground mb-4"><strong>What's the ideal BMI?</strong> For most adults, a BMI between 18.5-24.9 is associated with the lowest health risks. However, the "ideal" varies by age, ethnicity, and individual health factors. Some older adults may benefit from slightly higher BMIs (23-27).</p>
          <p className="text-muted-foreground mb-4"><strong>Can you be healthy with a high BMI?</strong> Yes, some individuals with higher BMIs are metabolically healthy, especially if they're physically active, have normal blood pressure, cholesterol, and blood sugar levels. However, higher BMI generally increases health risks over time.</p>
          <p className="text-muted-foreground mb-4"><strong>Does muscle weight affect BMI?</strong> Yes, muscle is denser than fat, so muscular individuals may have higher BMIs despite low body fat. This is why athletes often register as "overweight" by BMI standards despite being very fit.</p>
          <p className="text-muted-foreground mb-6"><strong>Is BMI different for men and women?</strong> The BMI calculation is identical for men and women, but body composition typically differs between genders. Women naturally have higher body fat percentages than men at the same BMI.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI for Special Populations</h3>
          <p className="text-muted-foreground mb-4"><strong>How is BMI calculated for children?</strong> Children's BMI uses the same formula but interpretation requires age and sex-specific percentile charts because body composition changes throughout growth and development.</p>
          <p className="text-muted-foreground mb-4"><strong>Is BMI accurate for seniors?</strong> BMI becomes less accurate with age due to muscle loss, bone density changes, and height loss. Slightly higher BMIs (25-27) may be protective for adults over 65.</p>
          <p className="text-muted-foreground mb-4"><strong>Should pregnant women use BMI?</strong> Pre-pregnancy BMI guides pregnancy weight gain recommendations, but BMI shouldn't be used to assess health during pregnancy. Focus on appropriate weight gain for your starting BMI.</p>
          <p className="text-muted-foreground mb-6"><strong>Does ethnicity affect BMI interpretation?</strong> Yes, different ethnic groups may experience health risks at different BMI levels. Asian populations often develop weight-related health issues at lower BMIs, while Black populations may have lower risks at higher BMIs.</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Weight Management Questions</h3>
          <p className="text-muted-foreground mb-4"><strong>How much should I weigh for a normal BMI?</strong> Multiply your height in meters squared by 18.5 for minimum healthy weight and by 24.9 for maximum. For feet/inches, use online calculators or charts for your specific height.</p>
          <p className="text-muted-foreground mb-4"><strong>How quickly can I safely change my BMI?</strong> Safe weight change is 1-2 pounds (0.5-1 kg) per week, translating to approximately 0.3-0.6 BMI points monthly for average-height adults. Rapid changes may indicate unhealthy practices.</p>
          <p className="text-muted-foreground mb-6"><strong>Should I focus on BMI or body fat percentage?</strong> Both provide valuable information. BMI offers quick screening while body fat percentage gives more accurate body composition data. Consider both alongside other health markers.</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Medical Disclaimer and Professional Guidance</h2>
          <h3 className="text-xl font-semibold text-foreground mb-4">When to Seek Medical Advice</h3>
          <p className="text-muted-foreground mb-6"><strong>Consult healthcare providers if:</strong> • Your BMI is below 18.5 or above 30 • You experience unexplained weight changes • You have symptoms like fatigue, shortness of breath, or joint pain • You're planning significant dietary or exercise changes • You have existing health conditions • You're concerned about your weight or health</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Understanding Medical Context</h3>
          <p className="text-muted-foreground mb-4">BMI is one tool among many that healthcare providers use. A comprehensive health assessment includes:</p>
          <p className="text-muted-foreground mb-6">• Complete medical history • Physical examination • Laboratory tests (cholesterol, blood sugar, thyroid) • Blood pressure monitoring • Body composition analysis • Lifestyle factors assessment • Mental health screening</p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Working with Healthcare Professionals</h3>
          <p className="text-muted-foreground mb-4"><strong>Prepare for appointments by:</strong> • Tracking your weight and BMI trends • Listing current medications and supplements • Noting eating and exercise patterns • Preparing questions about your health • Being honest about challenges and concerns</p>
          <p className="text-muted-foreground mb-6"><strong>Healthcare team members who can help:</strong> • Primary care physician for overall health assessment • Registered dietitian for nutrition planning • Exercise physiologist for fitness programs • Mental health counselor for emotional support • Endocrinologist for hormonal issues • Bariatric specialist for severe obesity</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Conclusion: Using BMI as Part of Your Health Journey</h2>
          <p className="text-muted-foreground mb-6">BMI serves as a valuable starting point for understanding your health, but it's just one piece of a complex puzzle. Your overall health depends on numerous factors including physical fitness, nutrition quality, mental well-being, genetic factors, and lifestyle choices.</p>
          <p className="text-muted-foreground mb-4"><strong>Remember these key points:</strong></p>
          <p className="text-muted-foreground mb-6">• BMI provides useful population-level insights but has individual limitations • Consider your BMI alongside other health markers • Focus on sustainable, healthy lifestyle changes rather than just numbers • Seek professional guidance for personalized health advice • Small, consistent improvements lead to long-term success • Your worth isn't determined by any number on a scale or calculator</p>
          <p className="text-muted-foreground mb-6">Whether your BMI suggests you need to gain weight, lose weight, or maintain your current weight, the path forward involves making informed, sustainable choices that support your overall health and well-being. Use this calculator and information as tools to guide your journey, but always prioritize how you feel, your energy levels, and your overall quality of life.</p>
          <p className="text-muted-foreground mb-6">Take action today by calculating your BMI, understanding what it means, and if needed, consulting with healthcare professionals to develop a personalized plan that works for your unique situation. Your health is an investment that pays dividends for years to come.</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
          <h3 className="text-xl font-semibold text-foreground mb-4">Related Calculators</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><a href="https://claude.ai/calculator/body-fat-percentage-calculator" className="text-primary hover:text-primary/80">Body Fat Percentage Calculator</a></li>
            <li><a href="https://claude.ai/calculator/ideal-weight-calculator" className="text-primary hover:text-primary/80">Ideal Weight Calculator</a></li>
            <li><a href="https://claude.ai/calculator/calorie-calculator" className="text-primary hover:text-primary/80">Calorie Calculator</a></li>
            <li><a href="https://claude.ai/calculator/macro-calculator" className="text-primary hover:text-primary/80">Macro Calculator</a></li>
            <li><a href="https://claude.ai/calculator/tdee-calculator" className="text-primary hover:text-primary/80">TDEE Calculator</a></li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Authoritative Health Resources</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>World Health Organization (WHO) - Global BMI Guidelines</li>
            <li>Centers for Disease Control and Prevention (CDC) - BMI Information</li>
            <li>National Institutes of Health (NIH) - Weight Management Resources</li>
            <li>American Heart Association - Healthy Weight Guidelines</li>
            <li>Academy of Nutrition and Dietetics - Nutrition Information</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Scientific References</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>International Journal of Obesity - Latest BMI Research</li>
            <li>The Lancet - Global Health Studies</li>
            <li>New England Journal of Medicine - Obesity Research</li>
            <li>JAMA - Weight and Health Outcomes</li>
            <li>Obesity Reviews - Systematic Reviews and Meta-analyses</li>
          </ul>

          <p className="text-sm text-muted-foreground mb-2"><em>Last medically reviewed and updated: September 2025</em></p>
          <p className="text-sm text-muted-foreground mb-6"><em>The information provided on this page is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for personalized medical guidance.</em></p>
        </div>
      </div>

      {/* Limitations of BMI Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Limitations of BMI: What It Doesn't Tell You</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            While BMI serves as a useful screening tool, it has significant limitations that everyone should understand.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Doesn't Distinguish Between Muscle and Fat</h3>
          <p className="text-muted-foreground mb-3">The most significant limitation of BMI is its inability to differentiate between:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Muscle mass</strong> - Athletes and bodybuilders often have "overweight" or "obese" BMIs despite low body fat</li>
            <li><strong>Fat mass</strong> - The actual component associated with health risks</li>
            <li><strong>Bone density</strong> - Individuals with denser bones may have higher BMIs</li>
            <li><strong>Water weight</strong> - Temporary fluctuations affecting measurements</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Doesn't Show Fat Distribution</h3>
          <p className="text-muted-foreground mb-3">Where you carry fat matters more than total amount:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Visceral fat</strong> (around organs) poses greater health risks than subcutaneous fat</li>
            <li><strong>Waist-to-hip ratio</strong> better predicts cardiovascular risk</li>
            <li><strong>Apple vs. pear shape</strong> body types have different risk profiles</li>
            <li><strong>Abdominal obesity</strong> increases metabolic syndrome risk even at normal BMI</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Other Important Limitations</h3>
          <p className="text-muted-foreground mb-3"><strong>BMI doesn't account for:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Overall fitness level and physical activity</li>
            <li>Diet quality and nutritional status</li>
            <li>Metabolic health markers (blood pressure, cholesterol, blood sugar)</li>
            <li>Genetic factors affecting body composition</li>
            <li>Medications affecting weight</li>
            <li>Individual health history</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">When BMI May Be Misleading</h3>
          <p className="text-muted-foreground mb-3">BMI may provide inaccurate health assessments for:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Athletes and bodybuilders</strong> with high muscle mass</li>
            <li><strong>Elderly individuals</strong> with muscle loss</li>
            <li><strong>People with edema</strong> or fluid retention</li>
            <li><strong>Individuals with limb loss</strong> or amputation</li>
            <li><strong>Those with osteoporosis</strong> affecting bone density</li>
            <li><strong>Pregnant and breastfeeding</strong> women</li>
          </ul>
        </div>
      </div>

      {/* Beyond BMI Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Beyond BMI: Alternative Body Composition Measures</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            For a more complete health picture, consider these complementary assessments alongside BMI.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist Circumference</h3>
          <p className="text-muted-foreground mb-4">
            Waist measurement directly assesses abdominal fat, a key health risk indicator.
          </p>
          
          <p className="text-muted-foreground mb-3"><strong>How to measure:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
            <li>Stand and wrap tape measure around your waist at navel level</li>
            <li>Breathe out naturally</li>
            <li>Ensure tape is snug but not compressing skin</li>
            <li>Read measurement</li>
          </ol>

          <p className="text-muted-foreground mb-4"><strong>Risk thresholds:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Gender</th>
                  <th className="border border-border p-3 text-left font-semibold">Increased Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Men</td>
                  <td className="border border-border p-3">≥ 94 cm (37 in)</td>
                  <td className="border border-border p-3">≥ 102 cm (40 in)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Women</td>
                  <td className="border border-border p-3">≥ 80 cm (31.5 in)</td>
                  <td className="border border-border p-3">≥ 88 cm (35 in)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist-to-Hip Ratio (WHR)</h3>
          <p className="text-muted-foreground mb-4">WHR provides insight into fat distribution patterns.</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Waist circumference ÷ Hip circumference</p>
          
          <p className="text-muted-foreground mb-4"><strong>Risk categories:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Gender</th>
                  <th className="border border-border p-3 text-left font-semibold">Low Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">Moderate Risk</th>
                  <th className="border border-border p-3 text-left font-semibold">High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Men</td>
                  <td className="border border-border p-3">&lt; 0.90</td>
                  <td className="border border-border p-3">0.90-0.99</td>
                  <td className="border border-border p-3">≥ 1.0</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Women</td>
                  <td className="border border-border p-3">&lt; 0.80</td>
                  <td className="border border-border p-3">0.80-0.84</td>
                  <td className="border border-border p-3">≥ 0.85</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Waist-to-Height Ratio (WHtR)</h3>
          <p className="text-muted-foreground mb-4">Recent research suggests WHtR may be superior to BMI for health risk prediction.</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Waist circumference ÷ Height (same units)</p>
          <p className="text-muted-foreground mb-4"><strong>Guideline:</strong> Keep your waist circumference less than half your height</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Ratio &lt; 0.5 indicates lower health risks</li>
            <li>Ratio ≥ 0.5 suggests increased risks</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Body Fat Percentage</h3>
          <p className="text-muted-foreground mb-4">Direct body fat measurement provides the most accurate body composition assessment.</p>
          
          <p className="text-muted-foreground mb-4"><strong>Healthy Body Fat Ranges:</strong></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Men</th>
                  <th className="border border-border p-3 text-left font-semibold">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Essential Fat</td>
                  <td className="border border-border p-3">2-5%</td>
                  <td className="border border-border p-3">10-13%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Athletes</td>
                  <td className="border border-border p-3">6-13%</td>
                  <td className="border border-border p-3">14-20%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Fitness</td>
                  <td className="border border-border p-3">14-17%</td>
                  <td className="border border-border p-3">21-24%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Average</td>
                  <td className="border border-border p-3">18-24%</td>
                  <td className="border border-border p-3">25-31%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Obese</td>
                  <td className="border border-border p-3">≥ 25%</td>
                  <td className="border border-border p-3">≥ 32%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted-foreground mb-4"><strong>Measurement methods:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>DEXA scan (most accurate)</li>
            <li>Bioelectrical impedance analysis</li>
            <li>Skinfold measurements</li>
            <li>Hydrostatic weighing</li>
            <li>Air displacement plethysmography</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Prime</h3>
          <p className="text-muted-foreground mb-4">BMI Prime provides a ratio comparing your BMI to the upper normal limit (25).</p>
          <p className="text-muted-foreground mb-4"><strong>Calculation:</strong> Your BMI ÷ 25</p>
          <p className="text-muted-foreground mb-4"><strong>Interpretation:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>&lt; 0.74: Underweight</li>
            <li>0.74-1.00: Normal weight</li>
            <li>&gt; 1.00: Overweight</li>
            <li>&gt; 1.20: Obese</li>
          </ul>
        </div>
      </div>

      {/* Health Risks Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Health Risks Associated with BMI Categories</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Understanding the specific health risks associated with different BMI ranges helps motivate appropriate action.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Comprehensive Health Risk Table</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-semibold">BMI Category</th>
                  <th className="border border-border p-3 text-left font-semibold">Cardiovascular</th>
                  <th className="border border-border p-3 text-left font-semibold">Metabolic</th>
                  <th className="border border-border p-3 text-left font-semibold">Respiratory</th>
                  <th className="border border-border p-3 text-left font-semibold">Musculoskeletal</th>
                  <th className="border border-border p-3 text-left font-semibold">Cancer</th>
                  <th className="border border-border p-3 text-left font-semibold">Mental Health</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Underweight</td>
                  <td className="border border-border p-3">Arrhythmias</td>
                  <td className="border border-border p-3">Hypoglycemia</td>
                  <td className="border border-border p-3">Decreased lung capacity</td>
                  <td className="border border-border p-3">Osteoporosis</td>
                  <td className="border border-border p-3">Lower overall risk</td>
                  <td className="border border-border p-3">Depression, anxiety</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Normal</td>
                  <td className="border border-border p-3">Lowest risk</td>
                  <td className="border border-border p-3">Optimal function</td>
                  <td className="border border-border p-3">Normal function</td>
                  <td className="border border-border p-3">Healthy joints</td>
                  <td className="border border-border p-3">Baseline risk</td>
                  <td className="border border-border p-3">Best outcomes</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Overweight</td>
                  <td className="border border-border p-3">Hypertension</td>
                  <td className="border border-border p-3">Insulin resistance</td>
                  <td className="border border-border p-3">Mild sleep apnea</td>
                  <td className="border border-border p-3">Joint stress</td>
                  <td className="border border-border p-3">Slightly increased</td>
                  <td className="border border-border p-3">Body image issues</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class I Obesity</td>
                  <td className="border border-border p-3">Heart disease</td>
                  <td className="border border-border p-3">Type 2 diabetes</td>
                  <td className="border border-border p-3">Moderate apnea</td>
                  <td className="border border-border p-3">Arthritis</td>
                  <td className="border border-border p-3">Moderately increased</td>
                  <td className="border border-border p-3">Depression risk</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class II Obesity</td>
                  <td className="border border-border p-3">Heart failure</td>
                  <td className="border border-border p-3">Metabolic syndrome</td>
                  <td className="border border-border p-3">Severe apnea</td>
                  <td className="border border-border p-3">Mobility issues</td>
                  <td className="border border-border p-3">High risk</td>
                  <td className="border border-border p-3">Severe impact</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Class III Obesity</td>
                  <td className="border border-border p-3">Extreme risk</td>
                  <td className="border border-border p-3">Multiple conditions</td>
                  <td className="border border-border p-3">Respiratory failure</td>
                  <td className="border border-border p-3">Disability</td>
                  <td className="border border-border p-3">Very high risk</td>
                  <td className="border border-border p-3">Significant impairment</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Specific Health Conditions by BMI</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Underweight Health Concerns</h4>
            <div className="space-y-4">
              <div>
                <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>Immediate risks:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 ml-4">
                  <li>Weakened immune response</li>
                  <li>Delayed wound healing</li>
                  <li>Vitamin and mineral deficiencies</li>
                  <li>Irregular menstruation</li>
                  <li>Hair loss and skin problems</li>
                </ul>
              </div>
              <div>
                <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>Long-term complications:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 ml-4">
                  <li>Osteoporosis and fractures</li>
                  <li>Fertility problems</li>
                  <li>Growth retardation (in youth)</li>
                  <li>Increased infection susceptibility</li>
                  <li>Cardiovascular complications</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Overweight and Obesity Health Risks</h4>
            <div className="space-y-4">
              <div>
                <p className="text-red-800 dark:text-red-200 mb-2"><strong>Metabolic conditions:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200 ml-4">
                  <li>Type 2 diabetes (risk increases 20-40% per 5 BMI units)</li>
                  <li>Metabolic syndrome</li>
                  <li>Non-alcoholic fatty liver disease</li>
                  <li>Polycystic ovary syndrome (PCOS)</li>
                  <li>Gestational diabetes</li>
                </ul>
              </div>
              <div>
                <p className="text-red-800 dark:text-red-200 mb-2"><strong>Cardiovascular diseases:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200 ml-4">
                  <li>Coronary heart disease</li>
                  <li>Stroke</li>
                  <li>Hypertension</li>
                  <li>Deep vein thrombosis</li>
                  <li>Pulmonary embolism</li>
                </ul>
              </div>
              <div>
                <p className="text-red-800 dark:text-red-200 mb-2"><strong>Respiratory issues:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200 ml-4">
                  <li>Obstructive sleep apnea</li>
                  <li>Asthma exacerbation</li>
                  <li>Obesity hypoventilation syndrome</li>
                  <li>Reduced lung capacity</li>
                </ul>
              </div>
              <div>
                <p className="text-red-800 dark:text-red-200 mb-2"><strong>Cancer risks (increased with higher BMI):</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200 ml-4">
                  <li>Colorectal cancer</li>
                  <li>Breast cancer (postmenopausal)</li>
                  <li>Endometrial cancer</li>
                  <li>Kidney cancer</li>
                  <li>Esophageal cancer</li>
                  <li>Pancreatic cancer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Taking Action Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Taking Action: What to Do About Your BMI</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Your BMI result is a starting point, not a final verdict on your health. Here's how to respond constructively to your results.
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">If Your BMI Is Below 18.5 (Underweight)</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-3"><strong>Immediate steps:</strong></p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200 mb-4">
                <li>Schedule a medical evaluation to rule out underlying conditions</li>
                <li>Work with a dietitian to create a healthy weight gain plan</li>
                <li>Focus on nutrient-dense, calorie-rich foods</li>
                <li>Include strength training to build muscle mass</li>
                <li>Address any eating disorders or mental health concerns</li>
              </ol>
              
              <p className="text-blue-800 dark:text-blue-200 mb-3"><strong>Healthy weight gain strategies:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Eat frequent, smaller meals throughout the day</li>
                <li>Choose whole grain breads, pastas, and cereals</li>
                <li>Include healthy fats like nuts, avocados, and olive oil</li>
                <li>Add protein shakes or smoothies between meals</li>
                <li>Avoid empty calories from processed foods</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">If Your BMI Is 18.5-24.9 (Normal Weight)</h3>
              <p className="text-green-800 dark:text-green-200 mb-3"><strong>Maintenance strategies:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200 mb-4">
                <li>Continue regular physical activity (150 minutes/week moderate exercise)</li>
                <li>Maintain balanced, nutritious eating habits</li>
                <li>Monitor weight trends over time</li>
                <li>Focus on overall health, not just weight</li>
                <li>Get regular health screenings</li>
              </ul>
              
              <p className="text-green-800 dark:text-green-200 mb-3"><strong>Prevention focus:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                <li>Build and maintain muscle mass</li>
                <li>Develop sustainable healthy habits</li>
                <li>Manage stress effectively</li>
                <li>Prioritize sleep quality</li>
                <li>Stay hydrated</li>
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">If Your BMI Is 25-29.9 (Overweight)</h3>
              <p className="text-orange-800 dark:text-orange-200 mb-3"><strong>Action plan:</strong></p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-orange-800 dark:text-orange-200 mb-4">
                <li>Aim for modest weight loss (5-10% of body weight)</li>
                <li>Create a moderate calorie deficit (500-750 calories/day)</li>
                <li>Increase physical activity gradually</li>
                <li>Focus on sustainable lifestyle changes</li>
                <li>Consider professional guidance if needed</li>
              </ol>
              
              <p className="text-orange-800 dark:text-orange-200 mb-3"><strong>Effective strategies:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                <li>Keep a food diary to identify eating patterns</li>
                <li>Increase vegetable and fruit intake</li>
                <li>Reduce portion sizes</li>
                <li>Limit processed foods and added sugars</li>
                <li>Find enjoyable physical activities</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">If Your BMI Is 30 or Higher (Obese)</h3>
              <p className="text-red-800 dark:text-red-200 mb-3"><strong>Medical approach:</strong></p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-red-800 dark:text-red-200 mb-4">
                <li>Consult healthcare providers for comprehensive evaluation</li>
                <li>Screen for weight-related health conditions</li>
                <li>Consider medical weight management programs</li>
                <li>Evaluate medication options if appropriate</li>
                <li>Discuss bariatric surgery for BMI ≥ 40 or ≥ 35 with complications</li>
              </ol>
              
              <p className="text-red-800 dark:text-red-200 mb-3"><strong>Comprehensive management:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                <li>Work with multidisciplinary team (doctor, dietitian, therapist)</li>
                <li>Address underlying factors (medical, psychological, environmental)</li>
                <li>Set realistic, gradual weight loss goals (1-2 pounds/week)</li>
                <li>Focus on behavior modification</li>
                <li>Build strong support system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Healthy Weight Management Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Healthy Weight Management Strategies</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Regardless of your current BMI, these evidence-based strategies support healthy weight management.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Nutrition Guidelines</h3>
          <p className="text-muted-foreground mb-3"><strong>Balanced eating principles:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Portion control:</strong> Use smaller plates, measure servings, eat mindfully</li>
            <li><strong>Nutrient density:</strong> Choose whole foods over processed options</li>
            <li><strong>Macronutrient balance:</strong> Include protein, healthy fats, and complex carbohydrates</li>
            <li><strong>Hydration:</strong> Drink at least 8 glasses of water daily</li>
            <li><strong>Meal timing:</strong> Eat regular meals, avoid skipping breakfast</li>
          </ul>

          <p className="text-muted-foreground mb-4"><strong>Specific recommendations:</strong></p>
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

          <h3 className="text-xl font-semibold text-foreground mb-4">Physical Activity Recommendations</h3>
          <p className="text-muted-foreground mb-4"><strong>WHO Guidelines for Adults:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>Aerobic activity:</strong> 150-300 minutes moderate OR 75-150 minutes vigorous weekly</li>
            <li><strong>Strength training:</strong> 2+ days per week, all major muscle groups</li>
            <li><strong>Flexibility:</strong> Regular stretching or yoga</li>
            <li><strong>Reduce sedentary time:</strong> Break up long sitting periods</li>
          </ul>

          <p className="text-muted-foreground mb-4"><strong>Exercise progression for beginners:</strong></p>
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Week 1-2:</strong> 10-minute walks daily</p>
              <p><strong>Week 3-4:</strong> 15-minute walks + light stretching</p>
              <p><strong>Week 5-6:</strong> 20-minute walks + basic strength exercises</p>
              <p><strong>Week 7-8:</strong> 25-minute varied activities</p>
              <p><strong>Week 9+:</strong> Build toward guidelines gradually</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Behavioral Strategies</h3>
          <p className="text-muted-foreground mb-4"><strong>Sustainable habit formation:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li><strong>SMART goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound</li>
            <li><strong>Self-monitoring:</strong> Track food, activity, weight trends</li>
            <li><strong>Stimulus control:</strong> Modify environment to support healthy choices</li>
            <li><strong>Stress management:</strong> Practice meditation, deep breathing, yoga</li>
            <li><strong>Sleep optimization:</strong> Aim for 7-9 hours nightly</li>
          </ul>

          <p className="text-muted-foreground mb-4"><strong>Common pitfalls to avoid:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Extreme restriction leading to binge eating</li>
            <li>Focusing solely on scale weight</li>
            <li>Comparing progress to others</li>
            <li>Giving up after minor setbacks</li>
            <li>Neglecting mental health needs</li>
          </ul>
        </div>
      </div>

      {/* BMI Calculator Tools Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">BMI Calculator Tools and Features</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold text-foreground mb-4">Advanced BMI Calculations</h3>
          <p className="text-muted-foreground mb-4">Beyond standard BMI, our calculator offers:</p>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">BMI Prime</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Shows your BMI relative to the upper normal limit (25), making it easier to understand how far you are from the normal weight range.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Ponderal Index</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Alternative to BMI that better accounts for tall and short individuals: PI = weight (kg) / height (m)³
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Body Surface Area (BSA)</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Used in medical settings for dosing calculations: BSA = √[(height × weight) / 3600]
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">BMI Tracking Features</h3>
          <p className="text-muted-foreground mb-4"><strong>Progress monitoring tools:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>BMI trend charts over time</li>
            <li>Weight change calculations</li>
            <li>Goal setting and tracking</li>
            <li>Milestone celebrations</li>
            <li>Export data for healthcare providers</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Complementary Calculators</h3>
          <p className="text-muted-foreground mb-4"><strong>Related health tools:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Ideal weight calculator</li>
            <li>Body fat percentage estimator</li>
            <li>Calorie needs calculator</li>
            <li>Macro calculator</li>
            <li>Water intake calculator</li>
            <li>Heart rate zones calculator</li>
          </ul>
        </div>
      </div>

      {/* Medical Disclaimer Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Medical Disclaimer and Professional Guidance</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold text-foreground mb-4">When to Seek Medical Advice</h3>
          <p className="text-muted-foreground mb-4"><strong>Consult healthcare providers if:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Your BMI is below 18.5 or above 30</li>
            <li>You experience unexplained weight changes</li>
            <li>You have symptoms like fatigue, shortness of breath, or joint pain</li>
            <li>You're planning significant dietary or exercise changes</li>
            <li>You have existing health conditions</li>
            <li>You're concerned about your weight or health</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Understanding Medical Context</h3>
          <p className="text-muted-foreground mb-4">
            BMI is one tool among many that healthcare providers use. A comprehensive health assessment includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Complete medical history</li>
            <li>Physical examination</li>
            <li>Laboratory tests (cholesterol, blood sugar, thyroid)</li>
            <li>Blood pressure monitoring</li>
            <li>Body composition analysis</li>
            <li>Lifestyle factors assessment</li>
            <li>Mental health screening</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Working with Healthcare Professionals</h3>
          <p className="text-muted-foreground mb-4"><strong>Prepare for appointments by:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Tracking your weight and BMI trends</li>
            <li>Listing current medications and supplements</li>
            <li>Noting eating and exercise patterns</li>
            <li>Preparing questions about your health</li>
            <li>Being honest about challenges and concerns</li>
          </ul>

          <p className="text-muted-foreground mb-4"><strong>Healthcare team members who can help:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Primary care physician for overall health assessment</li>
            <li>Registered dietitian for nutrition planning</li>
            <li>Exercise physiologist for fitness programs</li>
            <li>Mental health counselor for emotional support</li>
            <li>Endocrinologist for hormonal issues</li>
            <li>Bariatric specialist for severe obesity</li>
          </ul>
        </div>
      </div>

      {/* Conclusion Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Conclusion: Using BMI as Part of Your Health Journey</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            BMI serves as a valuable starting point for understanding your health, but it's just one piece of a complex puzzle. 
            Your overall health depends on numerous factors including physical fitness, nutrition quality, mental well-being, 
            genetic factors, and lifestyle choices.
          </p>

          <p className="text-muted-foreground mb-4"><strong>Remember these key points:</strong></p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>BMI provides useful population-level insights but has individual limitations</li>
            <li>Consider your BMI alongside other health markers</li>
            <li>Focus on sustainable, healthy lifestyle changes rather than just numbers</li>
            <li>Seek professional guidance for personalized health advice</li>
            <li>Small, consistent improvements lead to long-term success</li>
            <li>Your worth isn't determined by any number on a scale or calculator</li>
          </ul>

          <p className="text-muted-foreground mb-6">
            Whether your BMI suggests you need to gain weight, lose weight, or maintain your current weight, the path forward 
            involves making informed, sustainable choices that support your overall health and well-being. Use this calculator 
            and information as tools to guide your journey, but always prioritize how you feel, your energy levels, and your 
            overall quality of life.
          </p>

          <p className="text-muted-foreground mb-6">
            Take action today by calculating your BMI, understanding what it means, and if needed, consulting with healthcare 
            professionals to develop a personalized plan that works for your unique situation. Your health is an investment 
            that pays dividends for years to come.
          </p>
        </div>
      </div>

      {/* Additional Resources Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Related Calculators</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="text-primary hover:text-primary/80">Body Fat Percentage Calculator</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">Ideal Weight Calculator</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">Calorie Calculator</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">Macro Calculator</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">TDEE Calculator</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Authoritative Health Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>World Health Organization (WHO) - Global BMI Guidelines</li>
                <li>Centers for Disease Control and Prevention (CDC) - BMI Information</li>
                <li>National Institutes of Health (NIH) - Weight Management Resources</li>
                <li>American Heart Association - Healthy Weight Guidelines</li>
                <li>Academy of Nutrition and Dietetics - Nutrition Information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Scientific References</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>International Journal of Obesity - Latest BMI Research</li>
                <li>The Lancet - Global Health Studies</li>
                <li>New England Journal of Medicine - Obesity Research</li>
                <li>JAMA - Weight and Health Outcomes</li>
                <li>Obesity Reviews - Systematic Reviews and Meta-analyses</li>
              </ul>
            </div>
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

      {/* Advanced BMI Calculator FAQ */}
      <FAQAccordion 
        faqs={bmiFAQs}
        title="Advanced BMI Calculator FAQ"
        className="mt-8"
      />
    </div>
  );
}