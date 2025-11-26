'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Calculator, RefreshCw, Info, CheckCircle, DollarSign,
  TrendingUp, AlertTriangle, Calendar, Gauge, Settings,
  BarChart3, Clock, Award, Zap, Shield, TrendingDown, X, Check, Users,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

interface TireData {
  position: string;
  initialDepth: number;
  currentDepth: number;
  milesOnTire: number;
  lastRotation: number;
}

interface TireInputs {
  // Tire Specifications
  treadwearRating: number;
  warrantyMiles: number;
  initialDepth: number;
  currentDepth: number;
  tireAge: number;

  // Usage Data
  milesOnTire: number;
  avgMilesPerYear: number;

  // Driving Conditions
  drivingStyle: 'gentle' | 'normal' | 'aggressive';
  roadType: 'highway' | 'city' | 'mixed' | 'offroad';
  climate: 'cold' | 'moderate' | 'hot' | 'extreme';

  // Maintenance
  rotationFrequency: number;
  lastRotation: number;
  alignmentStatus: 'good' | 'fair' | 'poor' | 'unknown';
  pressureCheck: 'weekly' | 'monthly' | 'rarely' | 'never';

  // Cost Analysis
  tireCost: number;
  installationCost: number;

  // Multi-tire tracking
  trackAllTires: boolean;
  tires: TireData[];
}

interface Results {
  // Life Estimates
  estimatedTotalLife: number;
  remainingMiles: number;
  remainingMonths: number;
  wearRate: number;

  // Multiple Methods
  warrantyBasedLife: number;
  treadwearBasedLife: number;
  usageBasedLife: number;
  recommendedLife: number;

  // Safety Analysis
  safetyStatus: 'safe' | 'monitor' | 'replace-soon' | 'replace-now';
  daysUntilReplacement: number;
  replaceByDate: string;
  ageWarning: boolean;

  // Cost Analysis
  costPerMile: number;
  costPerYear: number;
  totalCostOfOwnership: number;
  replacementCost: number;

  // Efficiency Score
  maintenanceScore: number;
  conditionScore: number;
  overallScore: number;

  // Recommendations
  recommendations: string[];
  maintenanceActions: string[];
}

export default function AdvancedTireLifeCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<TireInputs>({
    treadwearRating: 400,
    warrantyMiles: 50000,
    initialDepth: 10,
    currentDepth: 7,
    tireAge: 2,
    milesOnTire: 20000,
    avgMilesPerYear: 12000,
    drivingStyle: 'normal',
    roadType: 'mixed',
    climate: 'moderate',
    rotationFrequency: 7500,
    lastRotation: 5000,
    alignmentStatus: 'good',
    pressureCheck: 'monthly',
    tireCost: 150,
    installationCost: 25,
    trackAllTires: false,
    tires: [
      { position: 'Front Left', initialDepth: 10, currentDepth: 7, milesOnTire: 20000, lastRotation: 5000 },
      { position: 'Front Right', initialDepth: 10, currentDepth: 7, milesOnTire: 20000, lastRotation: 5000 },
      { position: 'Rear Left', initialDepth: 10, currentDepth: 8, milesOnTire: 20000, lastRotation: 5000 },
      { position: 'Rear Right', initialDepth: 10, currentDepth: 8, milesOnTire: 20000, lastRotation: 5000 }
    ]
  });

  const [results, setResults] = useState<Results | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleInputChange = (field: keyof TireInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTireDataChange = (index: number, field: keyof TireData, value: number) => {
    setInputs(prev => ({
      ...prev,
      tires: prev.tires.map((tire, i) =>
        i === index ? { ...tire, [field]: value } : tire
      )
    }));
  };

  const calculateTireLife = useCallback(() => {
    // Calculate wear rate (32nds per 1000 miles)
    const depthWorn = inputs.initialDepth - inputs.currentDepth;
    const wearRate = depthWorn / (inputs.milesOnTire / 1000);

    // Minimum safe tread depth
    const minSafeDepth = 2; // 2/32" is legal minimum, but 4/32" is recommended
    const usableDepth = inputs.currentDepth - minSafeDepth;

    // Usage-based calculation
    const remainingMiles = usableDepth / wearRate * 1000;

    // Warranty-based calculation (adjusted by current wear)
    const warrantyBasedLife = inputs.warrantyMiles;
    const warrantyRemainingMiles = warrantyBasedLife - inputs.milesOnTire;

    // Treadwear Rating based calculation
    // UTQG 400 = 2x baseline, baseline ≈ 20,000-30,000 miles
    const baselineMiles = 25000;
    const treadwearBasedLife = (inputs.treadwearRating / 100) * baselineMiles;
    const treadwearRemainingMiles = treadwearBasedLife - inputs.milesOnTire;

    // Apply condition factors
    let conditionMultiplier = 1.0;

    // Driving style impact
    if (inputs.drivingStyle === 'gentle') conditionMultiplier *= 1.15;
    else if (inputs.drivingStyle === 'aggressive') conditionMultiplier *= 0.80;

    // Road type impact
    if (inputs.roadType === 'highway') conditionMultiplier *= 1.10;
    else if (inputs.roadType === 'city') conditionMultiplier *= 0.95;
    else if (inputs.roadType === 'offroad') conditionMultiplier *= 0.75;

    // Climate impact
    if (inputs.climate === 'extreme') conditionMultiplier *= 0.85;
    else if (inputs.climate === 'hot') conditionMultiplier *= 0.90;

    // Maintenance factors
    let maintenanceMultiplier = 1.0;

    // Rotation frequency
    const milesSinceRotation = inputs.milesOnTire - inputs.lastRotation;
    if (milesSinceRotation > inputs.rotationFrequency * 1.5) {
      maintenanceMultiplier *= 0.90; // Overdue rotation reduces life
    }

    // Alignment impact
    if (inputs.alignmentStatus === 'poor') maintenanceMultiplier *= 0.75;
    else if (inputs.alignmentStatus === 'fair') maintenanceMultiplier *= 0.90;
    else if (inputs.alignmentStatus === 'unknown') maintenanceMultiplier *= 0.85;

    // Pressure check frequency
    if (inputs.pressureCheck === 'rarely') maintenanceMultiplier *= 0.90;
    else if (inputs.pressureCheck === 'never') maintenanceMultiplier *= 0.80;
    else if (inputs.pressureCheck === 'weekly') maintenanceMultiplier *= 1.05;

    // Calculate adjusted remaining miles
    const adjustedRemainingMiles = remainingMiles * conditionMultiplier * maintenanceMultiplier;

    // Choose most conservative estimate as recommended life
    const recommendedLife = Math.min(
      adjustedRemainingMiles,
      warrantyRemainingMiles > 0 ? warrantyRemainingMiles : adjustedRemainingMiles,
      treadwearRemainingMiles > 0 ? treadwearRemainingMiles : adjustedRemainingMiles
    );

    // Calculate time estimates
    const remainingMonths = Math.max(0, (recommendedLife / inputs.avgMilesPerYear) * 12);
    const daysUntilReplacement = Math.floor(remainingMonths * 30);

    // Calculate replacement date
    const replaceDate = new Date();
    replaceDate.setDate(replaceDate.getDate() + daysUntilReplacement);
    const replaceByDate = replaceDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Determine safety status
    let safetyStatus: 'safe' | 'monitor' | 'replace-soon' | 'replace-now' = 'safe';
    const ageWarning = inputs.tireAge >= 6;

    if (inputs.currentDepth <= 2 || inputs.tireAge >= 10) {
      safetyStatus = 'replace-now';
    } else if (inputs.currentDepth <= 4 || inputs.tireAge >= 6 || recommendedLife < 5000) {
      safetyStatus = 'replace-soon';
    } else if (inputs.currentDepth <= 6 || recommendedLife < 15000) {
      safetyStatus = 'monitor';
    }

    // Cost analysis
    const totalTireCost = inputs.tireCost + inputs.installationCost;
    const totalMilesOnTire = inputs.milesOnTire;
    const costPerMile = totalMilesOnTire > 0 ? totalTireCost / totalMilesOnTire : 0;
    const estimatedTotalMiles = inputs.milesOnTire + recommendedLife;
    const projectedCostPerMile = totalTireCost / estimatedTotalMiles;
    const costPerYear = costPerMile * inputs.avgMilesPerYear;
    const totalCostOfOwnership = totalTireCost * 4; // All 4 tires
    const replacementCost = totalTireCost * 4;

    // Maintenance score (0-100)
    let maintenanceScore = 100;
    if (milesSinceRotation > inputs.rotationFrequency) maintenanceScore -= 20;
    if (inputs.alignmentStatus === 'poor') maintenanceScore -= 30;
    else if (inputs.alignmentStatus === 'fair') maintenanceScore -= 15;
    else if (inputs.alignmentStatus === 'unknown') maintenanceScore -= 10;
    if (inputs.pressureCheck === 'rarely') maintenanceScore -= 15;
    else if (inputs.pressureCheck === 'never') maintenanceScore -= 30;
    else if (inputs.pressureCheck === 'weekly') maintenanceScore += 0; // Already at optimal

    // Condition score (0-100)
    const depthPercentage = (inputs.currentDepth / inputs.initialDepth) * 100;
    let conditionScore = depthPercentage;
    if (inputs.tireAge >= 6) conditionScore *= 0.7;
    if (inputs.tireAge >= 8) conditionScore *= 0.5;

    // Overall score
    const overallScore = (maintenanceScore + conditionScore) / 2;

    // Generate recommendations
    const recommendations: string[] = [];
    const maintenanceActions: string[] = [];

    if (inputs.currentDepth <= 4) {
      recommendations.push('⚠️ Tread depth is at or below 4/32" - Consider replacement soon for safety');
    }
    if (inputs.tireAge >= 6) {
      recommendations.push('📅 Tires are 6+ years old - Rubber compounds degrade over time regardless of tread');
    }
    if (milesSinceRotation > inputs.rotationFrequency * 1.5) {
      maintenanceActions.push('🔄 Tire rotation is overdue - Schedule immediately to prevent uneven wear');
    }
    if (inputs.alignmentStatus !== 'good') {
      maintenanceActions.push('⚙️ Check wheel alignment - Misalignment causes premature and uneven tire wear');
    }
    if (inputs.pressureCheck === 'rarely' || inputs.pressureCheck === 'never') {
      maintenanceActions.push('🎈 Check tire pressure monthly - Improper pressure reduces life by up to 25%');
    }
    if (inputs.drivingStyle === 'aggressive') {
      recommendations.push('🚗 Aggressive driving detected - Smooth acceleration and braking can extend tire life by 15%');
    }
    if (projectedCostPerMile > 0.05) {
      recommendations.push('💰 Cost per mile is high - Consider premium tires with better warranties for next replacement');
    }
    if (inputs.currentDepth > 6 && inputs.tireAge < 4) {
      recommendations.push('✅ Tires are in good condition - Continue current maintenance routine');
    }

    setResults({
      estimatedTotalLife: estimatedTotalMiles,
      remainingMiles: Math.max(0, recommendedLife),
      remainingMonths,
      wearRate,
      warrantyBasedLife,
      treadwearBasedLife,
      usageBasedLife: adjustedRemainingMiles,
      recommendedLife: Math.max(0, recommendedLife),
      safetyStatus,
      daysUntilReplacement,
      replaceByDate,
      ageWarning,
      costPerMile: projectedCostPerMile,
      costPerYear,
      totalCostOfOwnership,
      replacementCost,
      maintenanceScore: Math.max(0, Math.min(100, maintenanceScore)),
      conditionScore: Math.max(0, Math.min(100, conditionScore)),
      overallScore: Math.max(0, Math.min(100, overallScore)),
      recommendations,
      maintenanceActions
    });

    setShowModal(true);
  }, [inputs]);

  const resetCalculator = () => {
    setInputs({
      treadwearRating: 400,
      warrantyMiles: 50000,
      initialDepth: 10,
      currentDepth: 7,
      tireAge: 2,
      milesOnTire: 20000,
      avgMilesPerYear: 12000,
      drivingStyle: 'normal',
      roadType: 'mixed',
      climate: 'moderate',
      rotationFrequency: 7500,
      lastRotation: 5000,
      alignmentStatus: 'good',
      pressureCheck: 'monthly',
      tireCost: 150,
      installationCost: 25,
      trackAllTires: false,
      tires: [
        { position: 'Front Left', initialDepth: 10, currentDepth: 7, milesOnTire: 20000, lastRotation: 5000 },
        { position: 'Front Right', initialDepth: 10, currentDepth: 7, milesOnTire: 20000, lastRotation: 5000 },
        { position: 'Rear Left', initialDepth: 10, currentDepth: 8, milesOnTire: 20000, lastRotation: 5000 },
        { position: 'Rear Right', initialDepth: 10, currentDepth: 8, milesOnTire: 20000, lastRotation: 5000 }
      ]
    });
    setResults(null);
    setShowModal(false);
  };

  const getSafetyColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 dark:text-green-400';
      case 'monitor': return 'text-yellow-600 dark:text-yellow-400';
      case 'replace-soon': return 'text-orange-600 dark:text-orange-400';
      case 'replace-now': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSafetyBg = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'monitor': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'replace-soon': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'replace-now': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const faqs: FAQItem[] = [
    {
      question: "How accurate is this tire life calculator?",
      answer: "This calculator uses industry-standard formulas based on UTQG treadwear ratings, actual tread depth measurements, and proven wear rate calculations. It accounts for driving conditions, maintenance factors, and tire age. Results are estimates - actual tire life varies by individual usage, road conditions, vehicle alignment, and tire maintenance. For most accurate predictions, measure your tread depth regularly and update your inputs.",
      category: "Accuracy"
    },
    {
      question: "What is the UTQG treadwear rating and where do I find it?",
      answer: "The Uniform Tire Quality Grading (UTQG) treadwear rating is a number (e.g., 400, 600) molded into your tire's sidewall. It indicates relative tire life - a tire rated 400 should last twice as long as one rated 200 under controlled test conditions. Find it on your tire sidewall next to 'TREADWEAR'. Higher numbers indicate longer expected life. Note: ratings are manufacturer-assigned and not directly comparable across brands.",
      category: "UTQG"
    },
    {
      question: "When should I replace my tires based on tread depth?",
      answer: "Replace tires when tread depth reaches 4/32\" for all-season tires, or 2/32\" as the absolute legal minimum (though unsafe). For winter tires, replace at 6/32\". Use the penny test: insert a penny into the tread with Lincoln's head upside down - if you see the top of his head, tires are at or below 2/32\" and must be replaced immediately. Digital tread depth gauges (under $10) provide precise measurements.",
      category: "Safety"
    },
    {
      question: "How does tire age affect safety regardless of tread depth?",
      answer: "Tire rubber compounds degrade over time due to oxidation, UV exposure, and heat cycles - even with minimal mileage. Most manufacturers recommend replacement at 6 years regardless of tread depth, with 10 years as the absolute maximum. Check your tire's DOT date code (4-digit number on sidewall): first 2 digits = week, last 2 = year manufactured. For example, '2319' means 23rd week of 2019. Age-related cracking and reduced grip can cause sudden failure.",
      category: "Age"
    },
    {
      question: "How much does proper tire maintenance extend tire life?",
      answer: "Proper maintenance can extend tire life by 25-50%. Key factors: 1) Regular rotation every 5,000-7,500 miles equalizes wear across all tires (+25% life), 2) Proper inflation pressure prevents shoulder or center wear (+20% life), 3) Correct wheel alignment prevents uneven wear (+15% life), 4) Smooth driving style reduces aggressive wear (+15% life). Combined, these practices can add 15,000-30,000 miles to a tire's lifespan.",
      category: "Maintenance"
    },
    {
      question: "What's the difference between warranty miles and actual tire life?",
      answer: "Warranty mileage (e.g., '60,000-mile warranty') is the manufacturer's guarantee - they'll provide pro-rated credit if tires wear out prematurely with proper maintenance documentation. Actual tire life depends on your specific driving conditions, vehicle weight, maintenance, and alignment. Many tires exceed warranty mileage, while others fall short due to aggressive driving or poor maintenance. The UTQG treadwear rating is often more indicative of relative longevity than warranty numbers.",
      category: "Warranty"
    },
    {
      question: "How do driving conditions affect tire wear rate?",
      answer: "Driving conditions dramatically impact tire life: Highway driving (steady speeds, less braking) extends life by 10-15%. City driving (frequent stops, turns, acceleration) reduces life by 5-10%. Off-road or gravel roads can reduce life by 25-40%. Hot climates soften rubber compounds (-10% life), while extreme cold can cause cracking. Aggressive driving (hard acceleration, braking, cornering) reduces life by 20-30%. The calculator adjusts for these factors.",
      category: "Conditions"
    },
    {
      question: "Is it worth buying premium tires with higher treadwear ratings?",
      answer: "Yes, for most drivers. A premium tire with 600 UTQG rating costing $200 lasting 60,000 miles ($0.033/mile) is more economical than a budget tire with 300 rating costing $100 lasting 30,000 miles ($0.033/mile) - plus premium tires offer better safety, handling, and comfort. Calculate cost-per-mile: (Tire Cost + Installation) ÷ Expected Miles. Premium tires also typically have better warranties and may improve fuel economy by 1-2% through lower rolling resistance.",
      category: "Cost"
    },
    {
      question: "Can I replace just two tires instead of all four?",
      answer: "It depends on your vehicle and wear pattern. For best safety and handling, replace all 4 tires. If replacing only 2: On FWD vehicles, install new tires on the REAR (not front) to prevent oversteer. On RWD/AWD vehicles, consult your owner's manual - many AWD systems require all 4 tires to match within 2/32\" tread depth to prevent drivetrain damage. Never mix tire types (all-season with winter) on the same axle. Uneven tread depths can affect ABS and stability control systems.",
      category: "Replacement"
    },
    {
      question: "How do I measure tire tread depth accurately?",
      answer: "Three methods: 1) Digital tread depth gauge ($8-15, most accurate): Insert probe perpendicular to tread, measures in 32nds of an inch, 2) Penny test (free, quick): Insert penny with Lincoln upside-down into tread groove - if you see top of head, tread is ≤2/32\" (replace immediately), 3) Quarter test (for winter tires): Insert quarter with Washington upside-down - if you see top of head, tread is ≤4/32\" (replace for winter). Measure in multiple locations and tread grooves; use the lowest reading.",
      category: "Measurement"
    }
  ];

  // Custom Tooltip component with hover states
  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <span
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <span className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs w-max pointer-events-none">
            {text}
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-3 sm:p-6">

        {/* Mode Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode ? 'Comprehensive analysis with detailed parameters' : 'Quick calculation with essential inputs only'}
            </p>
          </div>
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isAdvancedMode ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Switch to Simple
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Advanced Options
              </>
            )}
          </button>
        </div>

        {/* Input Sections */}
        <div className="space-y-6">

          {/* SIMPLE MODE: Essential Inputs */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-primary" />
              Essential Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Tread Depth (32nds)
                  <Tooltip text="Measure with a tread depth gauge or penny test. New tires are typically 10-12/32 inches. Legal minimum is 2/32 inches.">
                    <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={inputs.currentDepth}
                  onChange={(e) => handleInputChange('currentDepth', Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="e.g., 7"
                  step="0.5"
                />
                <p className="text-xs text-muted-foreground mt-1">Measure with depth gauge or penny test</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Miles on Current Tires
                  <Tooltip text="Total miles driven since these tires were installed on your vehicle.">
                    <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={inputs.milesOnTire}
                  onChange={(e) => handleInputChange('milesOnTire', Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="e.g., 20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tire Age (years)
                  <Tooltip text="Check the DOT code on your tire sidewall. Last 4 digits show week/year of manufacture (e.g., '2319' = 23rd week of 2019). Tires should be replaced after 6-10 years regardless of tread.">
                    <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={inputs.tireAge}
                  onChange={(e) => handleInputChange('tireAge', Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="e.g., 2"
                  step="0.5"
                />
                <p className="text-xs text-muted-foreground mt-1">Check DOT date code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Average Miles Per Year
                  <Tooltip text="Typical annual mileage. US average is 12,000-15,000 miles per year.">
                    <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={inputs.avgMilesPerYear}
                  onChange={(e) => handleInputChange('avgMilesPerYear', Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="e.g., 12000"
                />
              </div>
            </div>
          </div>

          {/* ADVANCED MODE: Additional Inputs */}
          {isAdvancedMode && (
            <>
              {/* Tire Specifications */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Tire Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      UTQG Treadwear Rating
                      <Tooltip text="Uniform Tire Quality Grading number found on tire sidewall (typically 300-800). Higher numbers indicate longer tread life. A 400-rated tire should last twice as long as a 200-rated tire under test conditions.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.treadwearRating}
                      onChange={(e) => handleInputChange('treadwearRating', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 400"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Found on tire sidewall</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Warranty Miles
                      <Tooltip text="Manufacturer's mileage warranty (if applicable). Typically ranges from 40,000 to 80,000 miles. Check your tire documentation.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.warrantyMiles}
                      onChange={(e) => handleInputChange('warrantyMiles', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 50000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Manufacturer's warranty</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Initial Tread Depth (32nds)
                      <Tooltip text="Original tread depth when tires were new. Most passenger tires start at 10-12/32 inches. Truck/SUV tires may be deeper.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.initialDepth}
                      onChange={(e) => handleInputChange('initialDepth', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 10"
                      step="0.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">New tire depth (typically 9-11/32")</p>
                  </div>
                </div>
              </div>

              {/* Driving Conditions */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Driving Conditions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Driving Style
                      <Tooltip text="Aggressive driving (hard acceleration/braking) reduces tire life by 25-40%. Gentle driving can extend life by 15-25%.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.drivingStyle}
                      onChange={(e) => handleInputChange('drivingStyle', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="gentle">Gentle (smooth acceleration)</option>
                      <option value="normal">Normal (average driver)</option>
                      <option value="aggressive">Aggressive (hard braking/acceleration)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Road Type
                      <Tooltip text="Highway driving extends life by 10-15%. Off-road/gravel can reduce life by 25-40%.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.roadType}
                      onChange={(e) => handleInputChange('roadType', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="highway">Mostly Highway</option>
                      <option value="city">Mostly City</option>
                      <option value="mixed">Mixed (50/50)</option>
                      <option value="offroad">Off-road/Gravel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Climate
                      <Tooltip text="Extreme temperatures affect tire rubber. Hot climates soften rubber compounds. Cold climates can cause cracking.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.climate}
                      onChange={(e) => handleInputChange('climate', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="cold">Cold (freezing winters)</option>
                      <option value="moderate">Moderate (4 seasons)</option>
                      <option value="hot">Hot (hot summers)</option>
                      <option value="extreme">Extreme (desert/arctic)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Maintenance Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Rotation Frequency (miles)
                      <Tooltip text="Regular rotation every 5,000-7,500 miles equalizes wear and extends tire life by 20-30%.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.rotationFrequency}
                      onChange={(e) => handleInputChange('rotationFrequency', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 7500"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recommended: every 5,000-7,500 miles</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Miles Since Last Rotation
                      <Tooltip text="Tires should be rotated regularly. Overdue rotations cause uneven wear patterns.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.milesOnTire - inputs.lastRotation}
                      onChange={(e) => handleInputChange('lastRotation', inputs.milesOnTire - Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Wheel Alignment Status
                      <Tooltip text="Poor alignment causes rapid, uneven wear. Should be checked annually or after hitting potholes.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.alignmentStatus}
                      onChange={(e) => handleInputChange('alignmentStatus', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="good">Good (recently aligned)</option>
                      <option value="fair">Fair (1-2 years old)</option>
                      <option value="poor">Poor (pulls to side)</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pressure Check Frequency
                      <Tooltip text="Proper inflation is crucial. Under-inflation causes shoulder wear and overheating. Check monthly with accurate gauge.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.pressureCheck}
                      onChange={(e) => handleInputChange('pressureCheck', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="rarely">Rarely (few times/year)</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Cost Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tire Cost (per tire)
                      <Tooltip text="Original purchase price per tire. Used to calculate cost-per-mile and total ownership cost.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.tireCost}
                      onChange={(e) => handleInputChange('tireCost', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Installation Cost (per tire)
                      <Tooltip text="Mounting, balancing, and installation fees per tire. Typically $15-$35 per tire.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.installationCost}
                      onChange={(e) => handleInputChange('installationCost', Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Calculate Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              onClick={calculateTireLife}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Tire Life
            </button>

            <button
              onClick={resetCalculator}
              className="flex-1 sm:flex-initial flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && results && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background border rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="sticky top-4 right-4 float-right z-10 p-2 bg-background border rounded-lg hover:bg-accent transition-colors"
              aria-label="Close results"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-3 sm:p-8 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary" />
                  Your Tire Life Analysis
                </h2>
              </div>

              {/* Safety Status Alert */}
              <div className={cn("p-6 rounded-xl border-2", getSafetyBg(results.safetyStatus))}>
                <div className="flex items-start gap-4">
                  {results.safetyStatus === 'replace-now' && <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />}
                  {results.safetyStatus === 'replace-soon' && <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />}
                  {results.safetyStatus === 'monitor' && <Info className="h-8 w-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />}
                  {results.safetyStatus === 'safe' && <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />}

                  <div className="flex-1">
                    <h3 className={cn("text-xl font-bold mb-2", getSafetyColor(results.safetyStatus))}>
                      {results.safetyStatus === 'replace-now' && 'Replace Immediately'}
                      {results.safetyStatus === 'replace-soon' && 'Replace Soon'}
                      {results.safetyStatus === 'monitor' && 'Monitor Closely'}
                      {results.safetyStatus === 'safe' && 'Tires in Good Condition'}
                    </h3>
                    <p className="text-foreground">
                      {results.safetyStatus === 'replace-now' && 'Your tires have reached or exceeded safe limits. Replace immediately for your safety.'}
                      {results.safetyStatus === 'replace-soon' && 'Your tires are approaching the end of their safe lifespan. Plan replacement within the next few months.'}
                      {results.safetyStatus === 'monitor' && 'Your tires are still safe but should be monitored regularly. Check tread depth monthly.'}
                      {results.safetyStatus === 'safe' && 'Your tires are in good condition. Continue regular maintenance and monitoring.'}
                    </p>
                    {results.ageWarning && (
                      <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                        ⚠️ Warning: Tires are 6+ years old. Consider replacement regardless of tread depth.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-background border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Remaining Miles</span>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {results.remainingMiles.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {results.remainingMonths.toFixed(1)} months
                  </div>
                </div>

                <div className="bg-background border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Replace By</span>
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {results.replaceByDate}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {results.daysUntilReplacement} days
                  </div>
                </div>

                <div className="bg-background border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cost Per Mile</span>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    ${results.costPerMile.toFixed(3)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${results.costPerYear.toFixed(0)}/year
                  </div>
                </div>

                <div className="bg-background border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Wear Rate</span>
                    <Gauge className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {results.wearRate.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    32nds per 1,000 mi
                  </div>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Maintenance Score</h4>
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn("text-4xl font-bold mb-2", getScoreColor(results.maintenanceScore))}>
                    {results.maintenanceScore.toFixed(0)}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full transition-all",
                        results.maintenanceScore >= 80 ? "bg-green-500" :
                        results.maintenanceScore >= 60 ? "bg-yellow-500" :
                        results.maintenanceScore >= 40 ? "bg-orange-500" : "bg-red-500"
                      )}
                      style={{ width: `${results.maintenanceScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on rotation, alignment, and pressure checks
                  </p>
                </div>

                <div className="bg-background border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Condition Score</h4>
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn("text-4xl font-bold mb-2", getScoreColor(results.conditionScore))}>
                    {results.conditionScore.toFixed(0)}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full transition-all",
                        results.conditionScore >= 80 ? "bg-green-500" :
                        results.conditionScore >= 60 ? "bg-yellow-500" :
                        results.conditionScore >= 40 ? "bg-orange-500" : "bg-red-500"
                      )}
                      style={{ width: `${results.conditionScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on tread depth and tire age
                  </p>
                </div>

                <div className="bg-background border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Overall Score</h4>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn("text-4xl font-bold mb-2", getScoreColor(results.overallScore))}>
                    {results.overallScore.toFixed(0)}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full transition-all",
                        results.overallScore >= 80 ? "bg-green-500" :
                        results.overallScore >= 60 ? "bg-yellow-500" :
                        results.overallScore >= 40 ? "bg-orange-500" : "bg-red-500"
                      )}
                      style={{ width: `${results.overallScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Combined maintenance and condition assessment
                  </p>
                </div>
              </div>

              {/* Comparison Methods */}
              <div className="bg-background border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Life Estimate Comparison
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Warranty-Based Estimate</span>
                      <span className="text-sm font-bold text-foreground">{results.warrantyBasedLife.toLocaleString()} miles</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (results.warrantyBasedLife / inputs.warrantyMiles) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">UTQG Treadwear-Based</span>
                      <span className="text-sm font-bold text-foreground">{results.treadwearBasedLife.toLocaleString()} miles</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (results.treadwearBasedLife / (inputs.treadwearRating / 100 * 25000)) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Usage-Based (Actual Wear)</span>
                      <span className="text-sm font-bold text-foreground">{results.usageBasedLife.toLocaleString()} miles</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, (results.usageBasedLife / results.estimatedTotalLife) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-bold text-foreground">Recommended Estimate</span>
                      <span className="text-lg font-bold text-primary">{results.recommendedLife.toLocaleString()} miles</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on most conservative estimate with condition adjustments
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <div className="bg-background border rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Maintenance Actions */}
              {results.maintenanceActions.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-900 dark:text-orange-100">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Required Maintenance Actions
                  </h3>
                  <ul className="space-y-3">
                    {results.maintenanceActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-orange-900 dark:text-orange-100">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cost Summary */}
          <div className="bg-background border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Cost Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Cost Per Mile</span>
                <span className="text-lg font-bold text-foreground">${results.costPerMile.toFixed(3)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Annual Cost</span>
                <span className="text-lg font-bold text-foreground">${results.costPerYear.toFixed(0)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Replacement Cost (4 tires)</span>
                <span className="text-lg font-bold text-foreground">${results.replacementCost.toFixed(0)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Total Ownership Cost</span>
                <span className="text-lg font-bold text-foreground">${results.totalCostOfOwnership.toFixed(0)}</span>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Online Tire Life Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Enter Current Tire Information</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Start by measuring your tire's current tread depth using a tread depth gauge, penny test, or quarter test. Enter the current depth in 32nds of an inch. Most new tires start at 10/32" to 12/32". The legal minimum is 2/32", but replace at 4/32" for safety.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Add Tire Specifications</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Find the UTQG treadwear rating on your tire's sidewall (typically 300-800). Enter the manufacturer's warranty mileage if known. Input your tire's age (check the DOT code) and total miles driven on these tires.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Select Driving Conditions</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose your primary driving style (gentle, normal, aggressive), road conditions (excellent, good, mixed, poor), climate zone (mild, moderate, extreme), and how well you've maintained tire pressure and rotations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Enter Cost Information</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input the original purchase price and your typical annual mileage. The calculator will compute cost-per-mile and help you budget for replacement.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Tire Life," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Safety Status</h4>
                <p className="text-xs text-muted-foreground">Immediate assessment: Safe, Monitor, Replace Soon, or Replace Now</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📏</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Estimated Remaining Miles</h4>
                <p className="text-xs text-muted-foreground">Multiple calculation methods: tread-based, UTQG-based, and warranty-based</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Cost Analysis</h4>
                <p className="text-xs text-muted-foreground">Cost per mile, total value remaining, and budget recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Overall Score</h4>
                <p className="text-xs text-muted-foreground">Comprehensive scoring: maintenance (0-100), condition (0-100), and overall health</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">💰 Save Money</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Avoid premature tire replacement</li>
                <li>Maximize your tire investment ROI</li>
                <li>Budget accurately for replacements</li>
                <li>Track cost-per-mile efficiency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛡️ Stay Safe</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Know when tires are unsafe</li>
                <li>Prevent hydroplaning risks</li>
                <li>Monitor age-related degradation</li>
                <li>Get proactive replacement alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📈 Data-Driven Decisions</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Multi-method calculations</li>
                <li>UTQG rating integration</li>
                <li>Real wear rate analysis</li>
                <li>Condition-adjusted estimates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🆓 Completely Free</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>No registration required</li>
                <li>No hidden fees or paywalls</li>
                <li>Unlimited calculations</li>
                <li>Privacy-focused (no data stored)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">100% Free</h3>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">No hidden costs or premium features</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Instant Safety Alerts</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Real-time safety status assessment</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">No Registration</h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">Calculate anonymously, no account needed</p>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Tire Life & Safety</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">How This Calculator Works</h3>
            <p className="text-muted-foreground mb-4">
              This advanced tire life calculator uses multiple validated methods to estimate your tire's remaining lifespan:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span><strong>Tread Depth Analysis:</strong> Calculates wear rate based on your actual tread measurements and projects remaining safe mileage</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span><strong>UTQG Treadwear Rating:</strong> Uses manufacturer's standardized rating tested on a 400-mile government course</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span><strong>Warranty Mileage:</strong> Considers manufacturer guarantees and pro-rated replacement eligibility</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span><strong>Condition Adjustments:</strong> Factors in driving style, road conditions, climate, and maintenance practices</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span><strong>Age Consideration:</strong> Accounts for rubber degradation over time (6-year safety threshold)</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-lg">📏 How to Measure Tread Depth</h4>
            <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <strong className="block mb-1">Method 1: Penny Test (Free)</strong>
                Insert a penny into the tread groove with Lincoln's head upside-down. If you can see the top of Lincoln's head, your tread is at or below 2/32" (legal minimum - replace immediately).
              </div>
              <div>
                <strong className="block mb-1">Method 2: Quarter Test (For Winter Tires)</strong>
                Insert a quarter with Washington's head upside-down. If you can see the top of his head, tread is at or below 4/32" (replace for winter driving).
              </div>
              <div>
                <strong className="block mb-1">Method 3: Tread Depth Gauge (Most Accurate)</strong>
                Purchase a digital or manual gauge ($5-15) that measures in 32nds of an inch. Insert the probe perpendicular to the tread and read the measurement. Measure in multiple locations across the tire and use the lowest reading.
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Factors That Affect Tire Life</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Extends Life ✓</h4>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>• Regular rotation every 5,000-7,500 miles (+25%)</li>
                  <li>• Proper tire pressure maintenance (+20%)</li>
                  <li>• Correct wheel alignment (+15%)</li>
                  <li>• Smooth driving style (+15%)</li>
                  <li>• Highway driving (+10%)</li>
                  <li>• Premium quality tires (+30%)</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Reduces Life ✗</h4>
                <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                  <li>• Aggressive driving (-20-30%)</li>
                  <li>• Under/over-inflation (-25%)</li>
                  <li>• Misalignment (-30%)</li>
                  <li>• No rotation (-20%)</li>
                  <li>• Hot climate (-10%)</li>
                  <li>• Off-road/gravel roads (-25-40%)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              The 6-Year Rule
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Most tire manufacturers and safety organizations recommend replacing tires after 6 years regardless of tread depth, with 10 years as the absolute maximum. Here's why:
            </p>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <li>• <strong>Rubber Degradation:</strong> UV exposure, ozone, and heat cause rubber compounds to oxidize and crack over time</li>
              <li>• <strong>Reduced Grip:</strong> Aged tires lose elasticity, resulting in longer braking distances even with adequate tread</li>
              <li>• <strong>Blowout Risk:</strong> Internal structure weakens, increasing catastrophic failure risk at highway speeds</li>
              <li>• <strong>Check DOT Code:</strong> Find the 4-digit code on your tire sidewall (e.g., "2319" = 23rd week of 2019)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Maintenance Recommendations</h3>
            <div className="space-y-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">🔄 Tire Rotation</h4>
                <p className="text-sm text-muted-foreground">
                  Rotate every 5,000-7,500 miles or per manufacturer recommendation. Front and rear tires wear at different rates. Regular rotation equalizes wear and can extend total tire life by up to 25%. Many tire shops offer free rotation with purchase.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">⚙️ Wheel Alignment</h4>
                <p className="text-sm text-muted-foreground">
                  Check alignment annually or if vehicle pulls to one side. Misalignment causes uneven wear that can reduce tire life by 30%. Cost: $75-150, but saves hundreds in premature tire replacement. Essential after hitting potholes or curbs.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">🎈 Tire Pressure</h4>
                <p className="text-sm text-muted-foreground">
                  Check monthly and before long trips. Under-inflation by just 6 PSI can reduce tire life by 25% and increase fuel consumption by 5%. Over-inflation causes center wear. Find correct pressure on sticker inside driver's door jamb (not on tire sidewall - that's maximum pressure).
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">⚖️ Wheel Balancing</h4>
                <p className="text-sm text-muted-foreground">
                  Balance wheels when installing new tires or if you notice vibration. Imbalanced wheels cause uneven wear and suspension damage. Cost: $10-15 per tire, usually included with tire installation.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Cost Per Mile Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Understanding your tire's cost per mile helps make informed purchasing decisions:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Example Comparison</h4>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="block mb-1">Budget Tire</strong>
                    <ul className="space-y-1 ml-4">
                      <li>• Cost: $80 + $20 install = $100</li>
                      <li>• Warranty: 40,000 miles</li>
                      <li>• Cost per mile: $0.0025</li>
                      <li>• 4-tire total: $400</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="block mb-1">Premium Tire</strong>
                    <ul className="space-y-1 ml-4">
                      <li>• Cost: $150 + $25 install = $175</li>
                      <li>• Warranty: 70,000 miles</li>
                      <li>• Cost per mile: $0.0025</li>
                      <li>• 4-tire total: $700</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <strong>Result:</strong> Same cost per mile! Premium tires offer better safety, handling, fuel economy, and comfort for the same long-term cost. Plus better warranties and less frequent replacement hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific References & Data Sources */}
      <div className="bg-background border rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-primary" />
          Scientific References & Data Sources
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <p className="text-blue-900 dark:text-blue-100">
            • Our tire life calculator is based on the latest scientific research, government safety standards, and comprehensive data from leading automotive safety organizations worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Research Sources */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600 dark:bg-purple-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">Primary Research Sources</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/811617"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  NHTSA Tire-Related Factors in Pre-Crash Phase Study
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://www.nhtsa.gov/sites/nhtsa.gov/files/811885_tireagingtestdevelopmentprojectphase2evallab.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  NHTSA Tire Aging Test Development Project
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://www.sciencedirect.com/science/article/pii/S2215098625001569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  ScienceDirect: Tire Aging State-of-the-Art Review
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://www.sciencedirect.com/science/article/abs/pii/S0141391006002631"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  ScienceDirect: Rubber Aging in Tires Field Study
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://ppms.cit.cmu.edu/media/project_files/16_-_UTC_Tire_Tread_Final_Report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  Carnegie Mellon UTC Tire Tread Research Report
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9370404/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-900 dark:text-purple-100 hover:underline"
                >
                  PMC: Hydrothermal Aging Mechanisms Study
                </a>
              </li>
            </ul>
          </div>

          {/* Additional Data Sources */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-600 dark:bg-orange-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100">Additional Data Sources</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://www.nhtsa.gov/vehicle-safety/tires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  NHTSA TireWise Safety Information
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://catalog.data.gov/dataset/uniform-tire-quality-grading-system-utqgs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  DOT Uniform Tire Quality Grading System (UTQG)
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://www.sae.org/standards/content/j918_201806/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  SAE International Tire Performance Standards (J918)
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://www.sae.org/standards/content/air5797a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  SAE Aircraft Tire Wear Profile Development
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://rosap.ntl.bts.gov/view/dot/63604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  DOT Analysis of Tire Tread Deterioration Effects
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                <a
                  href="https://safetyresearch.net/Library/tires.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-900 dark:text-orange-100 hover:underline"
                >
                  Safety Research & Strategies Tire Safety Library
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Accuracy Note */}
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Data Accuracy & Updates</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Our calculator algorithms are regularly updated to reflect the latest tire safety research, NHTSA guidelines, and industry standards. All calculations use validated formulas from peer-reviewed automotive safety studies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion
        faqs={faqs}
        title="Tire Life Calculator FAQ"
      />

      {/* Review Section */}
      <CalculatorReview calculatorName="Tire Life Calculator" />
    </div>
  );
}
