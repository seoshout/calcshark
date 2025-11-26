'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Calculator, RefreshCw, Info, CheckCircle, DollarSign,
  TrendingUp, AlertTriangle, Calendar, Droplet, Settings,
  BarChart3, Clock, Award, Zap, Shield, TrendingDown, X, Check, Users,
  ChevronDown, ChevronUp, Gauge, ThermometerSun, Car, Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

interface OilChangeInputs {
  // Basic Inputs (Simple Mode)
  currentMileage: number;
  lastOilChangeMileage: number;
  oilType: 'conventional' | 'synthetic-blend' | 'full-synthetic' | 'high-mileage';
  avgMilesPerYear: number;

  // Advanced Inputs
  vehicleYear: number;
  engineType: 'gasoline' | 'diesel' | 'turbocharged' | 'hybrid';
  engineSize: number;

  // Driving Conditions
  drivingStyle: 'gentle' | 'normal' | 'aggressive';
  primaryDriving: 'highway' | 'city' | 'mixed' | 'stop-and-go';
  climate: 'cold' | 'moderate' | 'hot' | 'extreme';
  dustyConditions: boolean;
  shortTrips: boolean; // Most trips under 10 miles
  towing: boolean;
  idling: boolean; // Frequent idling

  // Maintenance History
  oilFilterQuality: 'economy' | 'standard' | 'premium' | 'synthetic';
  lastOilChangeDate: string;

  // Cost Analysis
  oilChangeCost: number;
  doItYourself: boolean;
}

interface Results {
  // Next Oil Change
  nextOilChangeMileage: number;
  nextOilChangeDate: string;
  milesUntilChange: number;
  monthsUntilChange: number;
  daysUntilChange: number;

  // Interval Analysis
  recommendedIntervalMiles: number;
  recommendedIntervalMonths: number;
  severeDrivingAdjustment: number;

  // Multiple Calculation Methods
  manufacturerInterval: number;
  oilTypeInterval: number;
  conditionBasedInterval: number;
  timeBasedInterval: number;

  // Status
  changeStatus: 'current' | 'due-soon' | 'overdue' | 'severely-overdue';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  percentageUsed: number;

  // Cost Analysis
  annualOilChanges: number;
  annualCost: number;
  costPerMile: number;
  potentialSavings: number;

  // Recommendations
  recommendations: string[];
  maintenanceReminders: string[];

  // Scores
  maintenanceScore: number;
  conditionSeverityScore: number;
}

export default function OilChangeIntervalCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [inputs, setInputs] = useState<OilChangeInputs>({
    currentMileage: 35000,
    lastOilChangeMileage: 30000,
    oilType: 'full-synthetic',
    avgMilesPerYear: 12000,
    vehicleYear: 2020,
    engineType: 'gasoline',
    engineSize: 2.0,
    drivingStyle: 'normal',
    primaryDriving: 'mixed',
    climate: 'moderate',
    dustyConditions: false,
    shortTrips: false,
    towing: false,
    idling: false,
    oilFilterQuality: 'standard',
    lastOilChangeDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    oilChangeCost: 75,
    doItYourself: false,
  });

  const [results, setResults] = useState<Results | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const calculateOilChangeInterval = useCallback((): Results => {
    // Base intervals by oil type (in miles)
    const baseIntervals: Record<string, number> = {
      'conventional': 3000,
      'synthetic-blend': 5000,
      'full-synthetic': 7500,
      'high-mileage': 5000,
    };

    // Extended intervals for newer vehicles with full synthetic
    const extendedIntervals: Record<string, number> = {
      'conventional': 5000,
      'synthetic-blend': 7500,
      'full-synthetic': 10000,
      'high-mileage': 7500,
    };

    // Determine base interval
    const isNewerVehicle = inputs.vehicleYear >= 2010;
    let baseInterval = isNewerVehicle ?
      extendedIntervals[inputs.oilType] :
      baseIntervals[inputs.oilType];

    // Time-based interval (months)
    const timeBasedIntervalMonths = inputs.oilType === 'full-synthetic' ? 12 : 6;

    // Calculate severe driving condition multiplier
    let severityMultiplier = 1.0;
    let severityFactors: string[] = [];

    if (inputs.shortTrips) {
      severityMultiplier *= 0.75;
      severityFactors.push('frequent short trips');
    }
    if (inputs.dustyConditions) {
      severityMultiplier *= 0.85;
      severityFactors.push('dusty conditions');
    }
    if (inputs.towing) {
      severityMultiplier *= 0.70;
      severityFactors.push('towing/heavy loads');
    }
    if (inputs.idling) {
      severityMultiplier *= 0.80;
      severityFactors.push('excessive idling');
    }
    if (inputs.primaryDriving === 'stop-and-go' || inputs.primaryDriving === 'city') {
      severityMultiplier *= 0.85;
      severityFactors.push('stop-and-go traffic');
    }
    if (inputs.climate === 'extreme' || inputs.climate === 'hot') {
      severityMultiplier *= 0.90;
      severityFactors.push('extreme temperatures');
    }
    if (inputs.drivingStyle === 'aggressive') {
      severityMultiplier *= 0.85;
      severityFactors.push('aggressive driving');
    }
    if (inputs.engineType === 'turbocharged') {
      severityMultiplier *= 0.90;
      severityFactors.push('turbocharged engine');
    }

    // Apply severity multiplier
    const conditionBasedInterval = Math.round(baseInterval * severityMultiplier);
    const severeDrivingAdjustment = Math.round((1 - severityMultiplier) * 100);

    // Manufacturer interval (general)
    const manufacturerInterval = isNewerVehicle ? 7500 : 5000;

    // Oil type specific interval
    const oilTypeInterval = baseInterval;

    // Recommended interval (most conservative)
    const recommendedIntervalMiles = Math.min(
      conditionBasedInterval,
      manufacturerInterval,
      baseInterval
    );

    // Calculate next oil change
    const milesSinceLastChange = inputs.currentMileage - inputs.lastOilChangeMileage;
    const nextOilChangeMileage = inputs.lastOilChangeMileage + recommendedIntervalMiles;
    const milesUntilChange = nextOilChangeMileage - inputs.currentMileage;

    // Time-based calculations
    const lastChangeDate = new Date(inputs.lastOilChangeDate);
    const today = new Date();
    const monthsSinceChange = (today.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const monthsUntilChange = Math.max(0, timeBasedIntervalMonths - monthsSinceChange);
    const daysUntilChange = Math.round(monthsUntilChange * 30.44);

    const nextOilChangeByTime = new Date(lastChangeDate);
    nextOilChangeByTime.setMonth(nextOilChangeByTime.getMonth() + timeBasedIntervalMonths);

    // Determine which comes first: mileage or time
    const timeBasedDue = today >= nextOilChangeByTime;
    const mileageBasedDue = milesUntilChange <= 0;

    const nextOilChangeDate = nextOilChangeByTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Determine status
    let changeStatus: 'current' | 'due-soon' | 'overdue' | 'severely-overdue';
    let urgency: 'low' | 'medium' | 'high' | 'critical';

    if (mileageBasedDue || timeBasedDue) {
      if (milesUntilChange < -1000 || monthsSinceChange > timeBasedIntervalMonths + 3) {
        changeStatus = 'severely-overdue';
        urgency = 'critical';
      } else {
        changeStatus = 'overdue';
        urgency = 'high';
      }
    } else if (milesUntilChange < 500 || monthsUntilChange < 1) {
      changeStatus = 'due-soon';
      urgency = 'medium';
    } else {
      changeStatus = 'current';
      urgency = 'low';
    }

    // Calculate percentage used
    const percentageUsed = Math.min(100, Math.round((milesSinceLastChange / recommendedIntervalMiles) * 100));

    // Cost analysis
    const annualOilChanges = inputs.avgMilesPerYear / recommendedIntervalMiles;
    const annualCost = annualOilChanges * inputs.oilChangeCost;
    const costPerMile = inputs.oilChangeCost / recommendedIntervalMiles;

    // Potential savings with full synthetic
    let potentialSavings = 0;
    if (inputs.oilType !== 'full-synthetic') {
      const syntheticInterval = extendedIntervals['full-synthetic'];
      const syntheticCost = inputs.doItYourself ? 45 : 85;
      const syntheticAnnualChanges = inputs.avgMilesPerYear / syntheticInterval;
      const syntheticAnnualCost = syntheticAnnualChanges * syntheticCost;
      potentialSavings = annualCost - syntheticAnnualCost;
    }

    // Generate recommendations
    const recommendations: string[] = [];
    const maintenanceReminders: string[] = [];

    if (changeStatus === 'overdue' || changeStatus === 'severely-overdue') {
      recommendations.push('Schedule an oil change immediately to prevent engine damage');
    } else if (changeStatus === 'due-soon') {
      recommendations.push('Plan to change your oil within the next 2-4 weeks');
    }

    if (severeDrivingAdjustment > 20) {
      recommendations.push(`Your severe driving conditions reduce oil life by ${severeDrivingAdjustment}%`);
      recommendations.push(`Consider changing oil more frequently: every ${conditionBasedInterval.toLocaleString()} miles`);
    }

    if (inputs.oilType === 'conventional' && inputs.vehicleYear >= 2010) {
      recommendations.push('Switch to synthetic oil for better protection and longer intervals');
      if (potentialSavings > 0) {
        recommendations.push(`You could save $${potentialSavings.toFixed(0)}/year with full synthetic oil`);
      }
    }

    if (inputs.oilFilterQuality === 'economy') {
      recommendations.push('Upgrade to a premium oil filter for better engine protection');
    }

    if (inputs.engineType === 'turbocharged') {
      recommendations.push('Turbocharged engines benefit significantly from full synthetic oil');
    }

    // Maintenance reminders
    maintenanceReminders.push('Check oil level monthly between changes');
    maintenanceReminders.push('Inspect for oil leaks during each oil change');
    maintenanceReminders.push('Replace oil filter with every oil change');

    if (inputs.climate === 'extreme' || inputs.climate === 'cold') {
      maintenanceReminders.push('Use the correct oil viscosity for your climate');
    }

    // Calculate scores
    const maintenanceScore = Math.max(0, Math.min(100,
      100 - (percentageUsed * 0.7) - (severeDrivingAdjustment * 0.3)
    ));

    const conditionSeverityScore = Math.round((1 - severityMultiplier) * 100);

    return {
      nextOilChangeMileage,
      nextOilChangeDate,
      milesUntilChange,
      monthsUntilChange,
      daysUntilChange,
      recommendedIntervalMiles,
      recommendedIntervalMonths: timeBasedIntervalMonths,
      severeDrivingAdjustment,
      manufacturerInterval,
      oilTypeInterval,
      conditionBasedInterval,
      timeBasedInterval: timeBasedIntervalMonths,
      changeStatus,
      urgency,
      percentageUsed,
      annualOilChanges: Math.round(annualOilChanges * 10) / 10,
      annualCost,
      costPerMile,
      potentialSavings: Math.max(0, potentialSavings),
      recommendations,
      maintenanceReminders,
      maintenanceScore: Math.round(maintenanceScore),
      conditionSeverityScore,
    };
  }, [inputs]);

  const handleCalculate = () => {
    const calculatedResults = calculateOilChangeInterval();
    setResults(calculatedResults);
    setShowModal(true);
  };

  const handleReset = () => {
    setInputs({
      currentMileage: 35000,
      lastOilChangeMileage: 30000,
      oilType: 'full-synthetic',
      avgMilesPerYear: 12000,
      vehicleYear: 2020,
      engineType: 'gasoline',
      engineSize: 2.0,
      drivingStyle: 'normal',
      primaryDriving: 'mixed',
      climate: 'moderate',
      dustyConditions: false,
      shortTrips: false,
      towing: false,
      idling: false,
      oilFilterQuality: 'standard',
      lastOilChangeDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      oilChangeCost: 75,
      doItYourself: false,
    });
    setResults(null);
    setShowModal(false);
  };

  const updateInput = (field: keyof OilChangeInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: "How often should I change my oil?",
      answer: "Modern vehicles with synthetic oil typically need oil changes every 7,500-10,000 miles or every 6-12 months, whichever comes first. Conventional oil should be changed every 3,000-5,000 miles or every 3-6 months. However, severe driving conditions like frequent short trips, extreme temperatures, dusty conditions, or towing can reduce these intervals by 25-50%. Always consult your owner's manual for manufacturer-specific recommendations.",
      category: "General"
    },
    {
      question: "What's the difference between synthetic and conventional oil?",
      answer: "Synthetic oil is chemically engineered to provide superior lubrication, better performance in extreme temperatures, and longer service life compared to conventional oil. Full synthetic oil can last 10,000-15,000 miles between changes, while conventional oil typically requires changes every 3,000-5,000 miles. Synthetic oil offers better engine protection, improved fuel economy, and reduced engine wear, making it ideal for modern engines, turbocharged vehicles, and severe driving conditions.",
      category: "General"
    },
    {
      question: "Can I go longer between oil changes with synthetic oil?",
      answer: "Yes, full synthetic oil can safely extend oil change intervals to 7,500-10,000 miles or even 15,000 miles in some modern vehicles, compared to 3,000-5,000 miles for conventional oil. However, even with synthetic oil, you should still change it at least once every 12 months due to time-based degradation. The actual interval depends on your vehicle's make/model, driving conditions, and manufacturer recommendations. Severe driving conditions may require more frequent changes regardless of oil type.",
      category: "Advanced"
    },
    {
      question: "What qualifies as 'severe' driving conditions?",
      answer: "Severe driving conditions include: frequent short trips (less than 10 miles), stop-and-go city traffic, extreme hot or cold temperatures, dusty or dirty environments, towing or hauling heavy loads, excessive idling, and off-road driving. According to industry surveys, about 80% of drivers actually fall into the 'severe' category. These conditions can reduce recommended oil change intervals by 25-50% because they cause faster oil degradation and increased engine stress.",
      category: "Advanced"
    },
    {
      question: "Should I change oil based on mileage or time?",
      answer: "You should change your oil based on whichever comes first: mileage OR time. Even if you don't drive many miles, oil can degrade over time due to moisture accumulation, oxidation, and additive breakdown. A good rule is to change conventional oil every 6 months and synthetic oil every 12 months, regardless of mileage. For most drivers, the 'whichever comes first' approach ensures optimal engine protection.",
      category: "General"
    },
    {
      question: "Is the 3,000-mile oil change rule still valid?",
      answer: "No, the 3,000-mile rule is largely outdated for modern vehicles. This recommendation originated decades ago when engines and oils were less advanced. Today's synthetic oils and improved engine technology allow most vehicles to safely go 5,000-10,000 miles between changes. However, the 3,000-mile interval may still apply to older vehicles (pre-2000), vehicles using conventional oil, or those operating under severe conditions. Always check your owner's manual for specific guidance.",
      category: "General"
    },
    {
      question: "Can I mix synthetic and conventional oil?",
      answer: "Yes, synthetic and conventional oils can be mixed safely in an emergency, as they're chemically compatible. However, mixing them dilutes the performance benefits of synthetic oil. If you mix oils, you should follow the shorter oil change interval of conventional oil (3,000-5,000 miles). For optimal performance, it's best to use one type consistently. If switching from conventional to synthetic, it's recommended to do a complete oil change rather than topping off with different oil types.",
      category: "Advanced"
    },
    {
      question: "What happens if I wait too long to change my oil?",
      answer: "Delaying oil changes can cause serious engine damage. Old oil loses its lubricating properties, leading to increased friction, heat, and wear on engine components. This can result in: reduced fuel economy, increased emissions, sludge buildup, overheating, premature engine wear, and potentially catastrophic engine failure requiring expensive repairs. If you're severely overdue (more than 1,000 miles or 3+ months past the interval), schedule an oil change immediately and consider having a mechanic inspect for potential damage.",
      category: "General"
    },
    {
      question: "How do I know what type of oil my car needs?",
      answer: "Check your owner's manual for the manufacturer-recommended oil type and viscosity (like 5W-30). The oil cap under your hood may also display this information. Modern vehicles (2010+) typically benefit from full synthetic oil, while older vehicles may use conventional or synthetic blend. High-mileage vehicles (75,000+ miles) may benefit from high-mileage formula oils. When in doubt, consult with a trusted mechanic or your vehicle dealership. Using the wrong oil type or viscosity can reduce engine efficiency and potentially cause damage.",
      category: "General"
    },
    {
      question: "Does my vehicle have an oil life monitoring system?",
      answer: "Most vehicles manufactured after 2010 include an Oil Life Monitoring System (OLMS) that tracks driving conditions, engine temperature, miles driven, and time to predict optimal oil change timing. This appears as a percentage or indicator light on your dashboard. These systems are generally accurate and account for your specific driving patterns. However, they're not perfect—you should still check your oil level monthly and change oil at least annually regardless of what the monitor shows.",
      category: "Advanced"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Main Calculator Card */}
      <div className="bg-background border rounded-xl p-4 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Droplet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Oil Change Interval Calculator</h2>
            <p className="text-muted-foreground text-sm">Calculate your optimal oil change schedule based on driving conditions</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode ? 'Comprehensive analysis with detailed driving conditions' : 'Quick calculation with essential inputs only'}
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

        {/* Input Form */}
        <div className="space-y-6">
          {/* Simple Mode Inputs - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Odometer Reading (miles)
                <Tooltip text="Enter your vehicle's current total mileage as shown on the odometer.">
                  <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={inputs.currentMileage}
                onChange={(e) => updateInput('currentMileage', Number(e.target.value))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Last Oil Change Mileage
                <Tooltip text="Enter the odometer reading when you last changed your oil. Check your service sticker or maintenance records.">
                  <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={inputs.lastOilChangeMileage}
                onChange={(e) => updateInput('lastOilChangeMileage', Number(e.target.value))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Oil Type
                <Tooltip text="Select the type of oil currently in your engine. Synthetic lasts longer than conventional. Check your owner's manual if unsure.">
                  <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                </Tooltip>
              </label>
              <select
                value={inputs.oilType}
                onChange={(e) => updateInput('oilType', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="conventional">Conventional</option>
                <option value="synthetic-blend">Synthetic Blend</option>
                <option value="full-synthetic">Full Synthetic</option>
                <option value="high-mileage">High Mileage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Average Miles Driven Per Year
                <Tooltip text="Estimate your typical annual mileage. Average US driver: 12,000-15,000 miles/year.">
                  <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                </Tooltip>
              </label>
              <input
                type="number"
                value={inputs.avgMilesPerYear}
                onChange={(e) => updateInput('avgMilesPerYear', Number(e.target.value))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* Advanced Mode Inputs - Conditionally Visible */}
          {isAdvancedMode && (
            <>
              {/* Vehicle Information */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-primary" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vehicle Year
                      <Tooltip text="Newer vehicles (2010+) typically have longer recommended oil change intervals.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.vehicleYear}
                      onChange={(e) => updateInput('vehicleYear', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      min="1980"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Engine Type
                      <Tooltip text="Turbocharged, diesel, and hybrid engines may have specific oil requirements and intervals.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.engineType}
                      onChange={(e) => updateInput('engineType', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="turbocharged">Turbocharged</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Engine Size (Liters)
                      <Tooltip text="Your engine displacement in liters. Typically ranges from 1.0L to 6.0L for passenger vehicles.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.engineSize}
                      onChange={(e) => updateInput('engineSize', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      min="0.5"
                      max="10"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Oil Change Date
                      <Tooltip text="Select when you last changed your oil. Time matters even if you haven't driven many miles.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="date"
                      value={inputs.lastOilChangeDate}
                      onChange={(e) => updateInput('lastOilChangeDate', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Driving Conditions */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-primary" />
                  Driving Conditions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Driving Style
                      <Tooltip text="Aggressive driving (rapid acceleration, hard braking) increases engine stress and oil degradation.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.drivingStyle}
                      onChange={(e) => updateInput('drivingStyle', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="gentle">Gentle</option>
                      <option value="normal">Normal</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Primary Driving Type
                      <Tooltip text="Stop-and-go city driving is harder on oil than steady highway cruising.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.primaryDriving}
                      onChange={(e) => updateInput('primaryDriving', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="highway">Mostly Highway</option>
                      <option value="city">Mostly City</option>
                      <option value="mixed">Mixed Highway/City</option>
                      <option value="stop-and-go">Stop-and-Go Traffic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Climate
                      <Tooltip text="Extreme hot or cold temperatures accelerate oil breakdown and require more frequent changes.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.climate}
                      onChange={(e) => updateInput('climate', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="moderate">Moderate</option>
                      <option value="cold">Cold (Below 32°F)</option>
                      <option value="hot">Hot (Above 90°F)</option>
                      <option value="extreme">Extreme Temperatures</option>
                    </select>
                  </div>
                </div>

                {/* Severe Driving Condition Checkboxes */}
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-3">
                    Severe Driving Conditions (Check all that apply)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex items-center space-x-2 text-sm text-amber-800 dark:text-amber-200">
                      <input
                        type="checkbox"
                        checked={inputs.shortTrips}
                        onChange={(e) => updateInput('shortTrips', e.target.checked)}
                        className="rounded border-amber-300"
                      />
                      <span>Frequent short trips (under 10 miles)</span>
                      <Tooltip text="Short trips don't allow oil to reach optimal temperature, causing moisture buildup and faster degradation.">
                        <Info className="h-3 w-3 text-amber-600" />
                      </Tooltip>
                    </label>

                    <label className="flex items-center space-x-2 text-sm text-amber-800 dark:text-amber-200">
                      <input
                        type="checkbox"
                        checked={inputs.dustyConditions}
                        onChange={(e) => updateInput('dustyConditions', e.target.checked)}
                        className="rounded border-amber-300"
                      />
                      <span>Dusty or dirty roads</span>
                      <Tooltip text="Dust contamination can clog filters and contaminate oil faster.">
                        <Info className="h-3 w-3 text-amber-600" />
                      </Tooltip>
                    </label>

                    <label className="flex items-center space-x-2 text-sm text-amber-800 dark:text-amber-200">
                      <input
                        type="checkbox"
                        checked={inputs.towing}
                        onChange={(e) => updateInput('towing', e.target.checked)}
                        className="rounded border-amber-300"
                      />
                      <span>Towing or heavy loads</span>
                      <Tooltip text="Towing increases engine stress and heat, breaking down oil faster.">
                        <Info className="h-3 w-3 text-amber-600" />
                      </Tooltip>
                    </label>

                    <label className="flex items-center space-x-2 text-sm text-amber-800 dark:text-amber-200">
                      <input
                        type="checkbox"
                        checked={inputs.idling}
                        onChange={(e) => updateInput('idling', e.target.checked)}
                        className="rounded border-amber-300"
                      />
                      <span>Excessive idling</span>
                      <Tooltip text="Extended idling time counts against oil life without adding mileage to the odometer.">
                        <Info className="h-3 w-3 text-amber-600" />
                      </Tooltip>
                    </label>
                  </div>
                </div>
              </div>

              {/* Maintenance & Cost */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-primary" />
                  Maintenance & Cost
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Oil Filter Quality
                      <Tooltip text="Premium filters last longer and provide better protection. Match filter quality to your oil type.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <select
                      value={inputs.oilFilterQuality}
                      onChange={(e) => updateInput('oilFilterQuality', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="economy">Economy</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="synthetic">Synthetic-Rated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Oil Change Cost ($)
                      <Tooltip text="Enter your typical oil change cost. This helps calculate annual maintenance expenses.">
                        <Info className="inline h-4 w-4 ml-1 text-muted-foreground" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={inputs.oilChangeCost}
                      onChange={(e) => updateInput('oilChangeCost', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      min="0"
                      step="5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={inputs.doItYourself}
                        onChange={(e) => updateInput('doItYourself', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span>I change my own oil (DIY)</span>
                      <Tooltip text="DIY oil changes cost less but require proper disposal of used oil at recycling centers.">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Tooltip>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              onClick={handleCalculate}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Oil Change Schedule
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && results && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-2xl font-bold text-foreground">Oil Change Analysis Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Status Alert */}
              <div className={cn(
                "p-6 rounded-lg border-2",
                results.changeStatus === 'current' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                results.changeStatus === 'due-soon' && "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
                results.changeStatus === 'overdue' && "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
                results.changeStatus === 'severely-overdue' && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              )}>
                <div className="flex items-start">
                  {results.changeStatus === 'current' && <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 mt-1" />}
                  {results.changeStatus === 'due-soon' && <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1" />}
                  {results.changeStatus === 'overdue' && <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 mt-1" />}
                  {results.changeStatus === 'severely-overdue' && <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 mt-1" />}

                  <div className="flex-1">
                    <h4 className={cn(
                      "text-lg font-semibold mb-2",
                      results.changeStatus === 'current' && "text-green-900 dark:text-green-100",
                      results.changeStatus === 'due-soon' && "text-yellow-900 dark:text-yellow-100",
                      results.changeStatus === 'overdue' && "text-orange-900 dark:text-orange-100",
                      results.changeStatus === 'severely-overdue' && "text-red-900 dark:text-red-100"
                    )}>
                      {results.changeStatus === 'current' && 'Oil is Current'}
                      {results.changeStatus === 'due-soon' && 'Oil Change Due Soon'}
                      {results.changeStatus === 'overdue' && 'Oil Change Overdue'}
                      {results.changeStatus === 'severely-overdue' && 'Oil Change Severely Overdue!'}
                    </h4>
                    <p className={cn(
                      "text-sm",
                      results.changeStatus === 'current' && "text-green-800 dark:text-green-200",
                      results.changeStatus === 'due-soon' && "text-yellow-800 dark:text-yellow-200",
                      results.changeStatus === 'overdue' && "text-orange-800 dark:text-orange-200",
                      results.changeStatus === 'severely-overdue' && "text-red-800 dark:text-red-200"
                    )}>
                      {results.milesUntilChange > 0
                        ? `${results.milesUntilChange.toLocaleString()} miles remaining until next oil change`
                        : `You are ${Math.abs(results.milesUntilChange).toLocaleString()} miles overdue for an oil change`
                      }
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={cn(
                      "font-medium",
                      results.changeStatus === 'current' && "text-green-700 dark:text-green-300",
                      results.changeStatus === 'due-soon' && "text-yellow-700 dark:text-yellow-300",
                      results.changeStatus === 'overdue' && "text-orange-700 dark:text-orange-300",
                      results.changeStatus === 'severely-overdue' && "text-red-700 dark:text-red-300"
                    )}>
                      Oil Life Used
                    </span>
                    <span className={cn(
                      "font-medium",
                      results.changeStatus === 'current' && "text-green-700 dark:text-green-300",
                      results.changeStatus === 'due-soon' && "text-yellow-700 dark:text-yellow-300",
                      results.changeStatus === 'overdue' && "text-orange-700 dark:text-orange-300",
                      results.changeStatus === 'severely-overdue' && "text-red-700 dark:text-red-300"
                    )}>
                      {results.percentageUsed}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all rounded-full",
                        results.percentageUsed < 80 && "bg-green-500",
                        results.percentageUsed >= 80 && results.percentageUsed < 100 && "bg-yellow-500",
                        results.percentageUsed >= 100 && results.percentageUsed < 120 && "bg-orange-500",
                        results.percentageUsed >= 120 && "bg-red-500"
                      )}
                      style={{ width: `${Math.min(100, results.percentageUsed)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Next Oil Change Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-2">
                    <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Next Oil Change Mileage</h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.nextOilChangeMileage.toLocaleString()}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">miles on odometer</p>
                </div>

                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Next Oil Change Date</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.nextOilChangeDate}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    {results.monthsUntilChange > 0
                      ? `in ${results.monthsUntilChange.toFixed(1)} months (${results.daysUntilChange} days)`
                      : 'Time limit exceeded'
                    }
                  </p>
                </div>
              </div>

              {/* Recommended Interval */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Your Recommended Oil Change Interval
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Mileage Interval</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {results.recommendedIntervalMiles.toLocaleString()} miles
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Time Interval</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {results.recommendedIntervalMonths} months
                    </p>
                  </div>
                </div>
                {results.severeDrivingAdjustment > 0 && (
                  <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-300 dark:border-amber-700">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      <strong>Severe Driving Adjustment:</strong> Your interval has been reduced by {results.severeDrivingAdjustment}% due to driving conditions.
                    </p>
                  </div>
                )}
              </div>

              {/* Calculation Methods Comparison */}
              <div className="bg-background border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Interval Calculation Methods
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-accent/50 rounded">
                    <span className="text-sm text-muted-foreground">Oil Type Based:</span>
                    <span className="font-semibold text-foreground">{results.oilTypeInterval.toLocaleString()} mi</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/50 rounded">
                    <span className="text-sm text-muted-foreground">Manufacturer Standard:</span>
                    <span className="font-semibold text-foreground">{results.manufacturerInterval.toLocaleString()} mi</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/50 rounded">
                    <span className="text-sm text-muted-foreground">Condition Adjusted:</span>
                    <span className="font-semibold text-foreground">{results.conditionBasedInterval.toLocaleString()} mi</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded border-2 border-primary">
                    <span className="text-sm font-medium text-primary">Recommended:</span>
                    <span className="font-bold text-primary">{results.recommendedIntervalMiles.toLocaleString()} mi</span>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Annual Cost Analysis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">Oil Changes/Year</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.annualOilChanges}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">Annual Cost</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${results.annualCost.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">Cost per Mile</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${results.costPerMile.toFixed(3)}</p>
                  </div>
                </div>
                {results.potentialSavings > 0 && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-300 dark:border-green-700">
                    <p className="text-sm text-green-900 dark:text-green-100 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <strong>Potential Annual Savings with Full Synthetic:</strong> ${results.potentialSavings.toFixed(0)}
                    </p>
                  </div>
                )}
              </div>

              {/* Performance Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-background border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Maintenance Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "text-4xl font-bold",
                      results.maintenanceScore >= 80 && "text-green-600",
                      results.maintenanceScore >= 60 && results.maintenanceScore < 80 && "text-yellow-600",
                      results.maintenanceScore < 60 && "text-red-600"
                    )}>
                      {results.maintenanceScore}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            results.maintenanceScore >= 80 && "bg-green-500",
                            results.maintenanceScore >= 60 && results.maintenanceScore < 80 && "bg-yellow-500",
                            results.maintenanceScore < 60 && "bg-red-500"
                          )}
                          style={{ width: `${results.maintenanceScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {results.maintenanceScore >= 80 && 'Excellent maintenance'}
                        {results.maintenanceScore >= 60 && results.maintenanceScore < 80 && 'Good maintenance'}
                        {results.maintenanceScore < 60 && 'Needs attention'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-background border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                    Driving Severity
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "text-4xl font-bold",
                      results.conditionSeverityScore < 20 && "text-green-600",
                      results.conditionSeverityScore >= 20 && results.conditionSeverityScore < 40 && "text-yellow-600",
                      results.conditionSeverityScore >= 40 && "text-red-600"
                    )}>
                      {results.conditionSeverityScore}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            results.conditionSeverityScore < 20 && "bg-green-500",
                            results.conditionSeverityScore >= 20 && results.conditionSeverityScore < 40 && "bg-yellow-500",
                            results.conditionSeverityScore >= 40 && "bg-red-500"
                          )}
                          style={{ width: `${results.conditionSeverityScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {results.conditionSeverityScore < 20 && 'Normal conditions'}
                        {results.conditionSeverityScore >= 20 && results.conditionSeverityScore < 40 && 'Moderate severity'}
                        {results.conditionSeverityScore >= 40 && 'Severe conditions'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start text-sm text-blue-800 dark:text-blue-200">
                        <Check className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Maintenance Reminders */}
              {results.maintenanceReminders.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    Maintenance Reminders
                  </h4>
                  <ul className="space-y-2">
                    {results.maintenanceReminders.map((reminder, idx) => (
                      <li key={idx} className="flex items-start text-sm text-purple-800 dark:text-purple-200">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span>{reminder}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Online Oil Change Interval Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Choose Your Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Start with <strong>Simple Mode</strong> for a quick calculation using just your current mileage, last oil change, oil type, and annual driving.
                Switch to <strong>Advanced Mode</strong> for a comprehensive analysis that factors in vehicle age, engine type, driving conditions, climate, and maintenance history for the most accurate recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Basic Information</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input your current odometer reading and the mileage when you last changed your oil (check your service sticker or maintenance records).
                Select your oil type—<strong>full synthetic</strong> lasts longest (7,500-10,000 mi), <strong>synthetic blend</strong> is mid-range (5,000-7,500 mi),
                and <strong>conventional</strong> requires more frequent changes (3,000-5,000 mi). Enter your average annual mileage to calculate time-based intervals.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Add Driving Conditions (Advanced Mode)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                In Advanced Mode, specify your driving style, primary driving type (highway vs city), and climate.
                Check the boxes for severe driving conditions that apply to you: <strong>frequent short trips under 10 miles</strong>, <strong>dusty roads</strong>,
                <strong>towing/heavy loads</strong>, or <strong>excessive idling</strong>. These factors can reduce your oil change interval by 25-50% from the standard recommendation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Review Your Personalized Schedule</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click "Calculate" to see your next oil change mileage and date based on <strong>whichever comes first</strong>—mileage or time.
                The calculator compares multiple calculation methods (oil type, manufacturer standard, and condition-adjusted) to recommend the most conservative interval for your engine protection.
                You'll also see your annual maintenance cost, cost per mile, and a maintenance score showing how well you're caring for your vehicle.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Oil Change Schedule," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Oil Change Status</h4>
                <p className="text-xs text-muted-foreground">Immediate assessment: Current, Due Soon, Overdue, or Severely Overdue</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📏</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Next Service Mileage & Date</h4>
                <p className="text-xs text-muted-foreground">Multiple calculation methods: oil type-based, manufacturer standard, and condition-adjusted intervals</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Cost Analysis</h4>
                <p className="text-xs text-muted-foreground">Annual maintenance cost, cost per mile, and potential savings from synthetic oil upgrades</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Maintenance Score</h4>
                <p className="text-xs text-muted-foreground">Comprehensive scoring (0-100) showing how well you're maintaining your engine</p>
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
                <li>Avoid unnecessary oil changes</li>
                <li>Prevent expensive engine repairs</li>
                <li>Optimize oil type selection for cost/value</li>
                <li>Track annual maintenance budgets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛡️ Protect Your Engine</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Prevent oil breakdown and sludge</li>
                <li>Maintain proper lubrication</li>
                <li>Extend engine lifespan</li>
                <li>Get timely replacement alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📈 Data-Driven Decisions</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Multi-method calculation comparison</li>
                <li>Severe condition adjustments</li>
                <li>Time vs mileage-based tracking</li>
                <li>Personalized recommendations</li>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Instant Status Alerts</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Real-time oil change status assessment</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">No Registration</h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">Calculate anonymously, no account needed</p>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Pro Tips for Accurate Results
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Check your oil level monthly between changes—low oil damages engines faster than old oil</li>
            <li>• Save your oil change receipts or use a maintenance app to track your service history accurately</li>
            <li>• If you drive less than 7,500 miles/year, time-based changes (every 6-12 months) matter more than mileage</li>
            <li>• Consult your owner's manual for manufacturer-specific recommendations—some vehicles require special intervals</li>
            <li>• Consider upgrading to full synthetic if you have severe driving conditions—it pays for itself in longer intervals</li>
          </ul>
        </div>
      </div>

      {/* Scientific References & Data Sources */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-primary" />
          Scientific References & Data Sources
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <p className="text-blue-900 dark:text-blue-100">
            Our oil change interval calculator is based on industry standards from automotive manufacturers, petroleum institutes,
            and comprehensive scientific research on engine oil degradation, lubrication science, and vehicle maintenance best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Research Sources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-3 pb-2 border-b">Primary Research & Standards</h3>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Society of Automotive Engineers (SAE International)</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                Oil viscosity standards, synthetic oil specifications, and lubrication engineering guidelines
              </p>
              <a href="https://www.sae.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                www.sae.org →
              </a>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">American Petroleum Institute (API)</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                Motor oil performance standards, certification programs, and service category classifications
              </p>
              <a href="https://www.api.org/oil-and-natural-gas/consumer-information/motor-oil" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                www.api.org/motor-oil →
              </a>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Car and Driver - Oil Change Research</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                Comprehensive testing and analysis of modern oil change intervals and synthetic oil benefits
              </p>
              <a href="https://www.caranddriver.com/shopping-advice/a27078539/synthetic-oil-change-interval/" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                Car & Driver Oil Change Intervals →
              </a>
            </div>
          </div>

          {/* Additional Data Sources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-3 pb-2 border-b">Additional Data Sources</h3>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">AAA Automotive Research</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                Independent testing of conventional vs synthetic oils and maintenance recommendations
              </p>
              <a href="https://www.aaa.com/autorepair/articles/how-often-should-you-change-your-oil" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                AAA Oil Change Guide →
              </a>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Mobil Motor Oils Technical Resources</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                Synthetic oil technology, lubrication science, and maintenance schedule recommendations
              </p>
              <a href="https://www.mobil.com/en/lubricants/for-personal-vehicles/auto-care/all-about-oil" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                Mobil Oil Education →
              </a>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Consumer Reports - Oil Change Testing</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                Long-term testing of oil change intervals and analysis of manufacturer recommendations
              </p>
              <a href="https://www.consumerreports.org/cars/car-maintenance/" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                Consumer Reports Auto Maintenance →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-900 dark:text-green-100">
            <strong>Data Accuracy:</strong> All calculation methods and intervals are based on current industry standards,
            manufacturer specifications, and peer-reviewed research. The calculator applies conservative recommendations
            to ensure engine protection across varying conditions. Always consult your vehicle's owner's manual for manufacturer-specific guidance.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion
        faqs={faqs}
        title="Oil Change Interval Calculator FAQ"
      />

      {/* Review Section */}
      <CalculatorReview calculatorName="Oil Change Interval Calculator" />
    </div>
  );
}
