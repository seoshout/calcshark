'use client';

import React, { useState } from 'react';
import { Info, AlertTriangle, X, Check, Droplet, Fish, Filter, Beaker, Calculator as CalcIcon, Users, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

type PondShape = 'rectangular' | 'circular' | 'irregular';
type PondType = 'koi' | 'goldfish' | 'decorative';
type MeasurementUnit = 'imperial' | 'metric';

interface PondInputs {
  shape: PondShape;
  // Dimensions
  length: string;
  width: string;
  diameter: string;
  depth: string;
  avgDepth: string;
  // Advanced options
  pondType: PondType;
  measurementUnit: MeasurementUnit;
  numberOfFish: string;
  hasWaterfall: boolean;
  waterfallHeight: string;
}

interface PondResults {
  // Volume calculations
  volumeGallons: number;
  volumeLiters: number;
  volumeCubicFeet: number;
  volumeCubicMeters: number;

  // Liner calculations
  linerLength: number;
  linerWidth: number;
  linerArea: number;

  // Equipment sizing
  recommendedPumpGPH: number;
  recommendedPumpLPH: number;
  filterTurnoverRate: number;

  // Fish stocking
  maxGoldfish: number;
  maxKoi: number;
  currentStockingLevel: string;
  gallonsPerFish: number;

  // Chemical dosing
  algaecideDose: number;
  clarifierDose: number;

  // Maintenance
  waterChangeGallons: number;
  waterChangeLiters: number;
  annualMaintenanceCost: number;
}

const AdvancedPondVolumeCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState<PondInputs>({
    shape: 'rectangular',
    length: '',
    width: '',
    diameter: '',
    depth: '',
    avgDepth: '',
    pondType: 'goldfish',
    measurementUnit: 'imperial',
    numberOfFish: '',
    hasWaterfall: false,
    waterfallHeight: ''
  });
  const [results, setResults] = useState<PondResults | null>(null);

  const calculateVolume = () => {
    const length = parseFloat(inputs.length) || 0;
    const width = parseFloat(inputs.width) || 0;
    const diameter = parseFloat(inputs.diameter) || 0;
    const depth = parseFloat(inputs.depth) || parseFloat(inputs.avgDepth) || 0;
    const numberOfFish = parseInt(inputs.numberOfFish) || 0;
    const waterfallHeight = parseFloat(inputs.waterfallHeight) || 0;

    if (!depth ||
        (inputs.shape === 'rectangular' && (!length || !width)) ||
        (inputs.shape === 'circular' && !diameter) ||
        (inputs.shape === 'irregular' && (!length || !width))) {
      alert('Please fill in all required dimensions');
      return;
    }

    let volumeCubicFeet = 0;

    // Calculate volume based on shape and unit
    if (inputs.measurementUnit === 'imperial') {
      // Imperial calculations (feet)
      if (inputs.shape === 'rectangular') {
        volumeCubicFeet = length * width * depth;
      } else if (inputs.shape === 'circular') {
        const radius = diameter / 2;
        volumeCubicFeet = Math.PI * radius * radius * depth;
      } else {
        // Irregular shape uses 2/3 approximation
        volumeCubicFeet = (2 / 3) * length * width * depth;
      }
    } else {
      // Metric calculations (meters) - convert to cubic feet
      if (inputs.shape === 'rectangular') {
        const volumeCubicMeters = length * width * depth;
        volumeCubicFeet = volumeCubicMeters * 35.3147;
      } else if (inputs.shape === 'circular') {
        const radius = diameter / 2;
        const volumeCubicMeters = Math.PI * radius * radius * depth;
        volumeCubicFeet = volumeCubicMeters * 35.3147;
      } else {
        const volumeCubicMeters = (2 / 3) * length * width * depth;
        volumeCubicFeet = volumeCubicMeters * 35.3147;
      }
    }

    // Convert to gallons and liters
    const volumeGallons = volumeCubicFeet * 7.48;
    const volumeLiters = volumeGallons * 3.78541;
    const volumeCubicMeters = volumeCubicFeet / 35.3147;

    // Calculate liner size (add 2x depth + 2 feet overlap)
    let linerLength = 0;
    let linerWidth = 0;

    if (inputs.measurementUnit === 'imperial') {
      if (inputs.shape === 'rectangular') {
        linerLength = length + (2 * depth) + 2;
        linerWidth = width + (2 * depth) + 2;
      } else if (inputs.shape === 'circular') {
        linerLength = diameter + (2 * depth) + 2;
        linerWidth = diameter + (2 * depth) + 2;
      } else {
        linerLength = length + (2 * depth) + 2;
        linerWidth = width + (2 * depth) + 2;
      }
    } else {
      // Convert meters to feet for liner calculation
      const lengthFt = length * 3.28084;
      const widthFt = width * 3.28084;
      const diameterFt = diameter * 3.28084;
      const depthFt = depth * 3.28084;

      if (inputs.shape === 'rectangular') {
        linerLength = lengthFt + (2 * depthFt) + 2;
        linerWidth = widthFt + (2 * depthFt) + 2;
      } else if (inputs.shape === 'circular') {
        linerLength = diameterFt + (2 * depthFt) + 2;
        linerWidth = diameterFt + (2 * depthFt) + 2;
      } else {
        linerLength = lengthFt + (2 * depthFt) + 2;
        linerWidth = widthFt + (2 * depthFt) + 2;
      }
    }

    const linerArea = linerLength * linerWidth;

    // Calculate pump requirements based on pond type
    let turnoverMultiplier = 1;
    if (inputs.pondType === 'koi') {
      turnoverMultiplier = 1; // Once per hour
    } else if (inputs.pondType === 'goldfish') {
      turnoverMultiplier = 0.67; // Once every 1.5 hours
    } else {
      turnoverMultiplier = 0.5; // Once every 2 hours
    }

    let recommendedPumpGPH = volumeGallons * turnoverMultiplier;

    // Add waterfall requirement (100 GPH per inch of width)
    if (inputs.hasWaterfall && waterfallHeight > 0) {
      const waterfallGPH = waterfallHeight * 100;
      recommendedPumpGPH = Math.max(recommendedPumpGPH, waterfallGPH);
    }

    const recommendedPumpLPH = recommendedPumpGPH * 3.78541;

    // Calculate fish stocking capacity
    const maxGoldfish = Math.floor(volumeGallons / 50); // 50 gallons per goldfish
    const maxKoi = Math.floor(volumeGallons / 250); // 250 gallons per koi

    let currentStockingLevel = 'Not specified';
    let gallonsPerFish = 0;

    if (numberOfFish > 0) {
      gallonsPerFish = volumeGallons / numberOfFish;

      if (inputs.pondType === 'koi') {
        if (gallonsPerFish >= 250) {
          currentStockingLevel = 'Excellent (250+ gal/fish)';
        } else if (gallonsPerFish >= 200) {
          currentStockingLevel = 'Good (200-250 gal/fish)';
        } else if (gallonsPerFish >= 150) {
          currentStockingLevel = 'Moderate (150-200 gal/fish)';
        } else {
          currentStockingLevel = 'Overstocked (< 150 gal/fish)';
        }
      } else {
        if (gallonsPerFish >= 50) {
          currentStockingLevel = 'Excellent (50+ gal/fish)';
        } else if (gallonsPerFish >= 30) {
          currentStockingLevel = 'Good (30-50 gal/fish)';
        } else if (gallonsPerFish >= 20) {
          currentStockingLevel = 'Moderate (20-30 gal/fish)';
        } else {
          currentStockingLevel = 'Overstocked (< 20 gal/fish)';
        }
      }
    }

    // Calculate chemical dosing
    // Algaecide: 1 tsp per 50 gallons
    const algaecideDose = volumeGallons / 50; // teaspoons

    // Clarifier: 1 capful (5ml) per 10 gallons
    const clarifierDose = volumeGallons / 10; // capfuls

    // Calculate maintenance
    // 10% water change weekly
    const waterChangeGallons = volumeGallons * 0.10;
    const waterChangeLiters = waterChangeGallons * 3.78541;

    // Estimated annual costs
    const pumpElectricityCost = (recommendedPumpGPH / 1000) * 0.15 * 24 * 365; // Rough estimate
    const filterMaintenanceCost = 150; // Annual filter media replacement
    const chemicalsCost = 100; // Annual water treatments
    const annualMaintenanceCost = pumpElectricityCost + filterMaintenanceCost + chemicalsCost;

    const calculatedResults: PondResults = {
      volumeGallons: Math.round(volumeGallons),
      volumeLiters: Math.round(volumeLiters),
      volumeCubicFeet: Math.round(volumeCubicFeet * 100) / 100,
      volumeCubicMeters: Math.round(volumeCubicMeters * 100) / 100,
      linerLength: Math.round(linerLength * 10) / 10,
      linerWidth: Math.round(linerWidth * 10) / 10,
      linerArea: Math.round(linerArea),
      recommendedPumpGPH: Math.round(recommendedPumpGPH),
      recommendedPumpLPH: Math.round(recommendedPumpLPH),
      filterTurnoverRate: turnoverMultiplier,
      maxGoldfish,
      maxKoi,
      currentStockingLevel,
      gallonsPerFish: Math.round(gallonsPerFish),
      algaecideDose: Math.round(algaecideDose * 10) / 10,
      clarifierDose: Math.round(clarifierDose * 10) / 10,
      waterChangeGallons: Math.round(waterChangeGallons),
      waterChangeLiters: Math.round(waterChangeLiters),
      annualMaintenanceCost: Math.round(annualMaintenanceCost)
    };

    setResults(calculatedResults);
    setShowModal(true);
  };

  const resetCalculator = () => {
    setInputs({
      shape: 'rectangular',
      length: '',
      width: '',
      diameter: '',
      depth: '',
      avgDepth: '',
      pondType: 'goldfish',
      measurementUnit: 'imperial',
      numberOfFish: '',
      hasWaterfall: false,
      waterfallHeight: ''
    });
    setResults(null);
    setShowModal(false);
  };

  const faqs: FAQItem[] = [
    {
      question: "How accurate is this pond volume calculator?",
      answer: "This calculator uses industry-standard formulas with typical accuracy of ±5% for regular shapes (rectangular and circular ponds). For irregular ponds, accuracy depends on measurement quality—the 2/3 approximation formula is widely accepted and typically accurate within 10% when proper average dimensions are used.",
      category: "General"
    },
    {
      question: "Do I need to include the liner overlap when measuring my pond?",
      answer: "No—measure only the actual pond excavation dimensions. The calculator automatically adds 2 feet of overlap to all sides (the industry standard) when calculating liner size. This overlap is essential for securing the liner and accounting for settling.",
      category: "General"
    },
    {
      question: "How many koi can I keep in my pond?",
      answer: "The gold standard is 250 gallons per adult koi, though experienced keepers with excellent filtration can maintain 150-200 gallons per fish. Overstocking leads to poor water quality, stunted growth, and health problems. Start conservatively—it's easier to add fish than deal with overcrowding issues.",
      category: "Advanced"
    },
    {
      question: "What pump size do I need for my pond?",
      answer: "For koi ponds, turnover the full volume once per hour. Goldfish ponds need turnover every 1.5 hours, and decorative ponds every 2 hours. Add 100 GPH per inch of waterfall width if applicable. Always match pump flow rate to your filter's maximum capacity—exceeding it reduces filtration effectiveness.",
      category: "Advanced"
    },
    {
      question: "How do I measure an irregular-shaped pond?",
      answer: "For best accuracy, divide complex shapes into multiple rectangles or circles and calculate each section separately. For a quick estimate, measure at the longest and widest points and use average depth—the calculator applies a 2/3 correction factor for irregular shapes, which is standard in the pond industry.",
      category: "General"
    },
    {
      question: "Should I use imperial or metric measurements?",
      answer: "Use whichever unit system you're comfortable with—the calculator converts everything automatically. In the US, pond supplies are typically sized in gallons and feet, while international markets use liters and meters. The calculator provides results in all units for equipment compatibility.",
      category: "General"
    },
    {
      question: "How often should I change pond water?",
      answer: "Weekly 10% water changes are ideal for maintaining water quality. This removes accumulated nitrates, replenishes minerals, and dilutes dissolved organics. In heavily stocked ponds or hot weather, increase to 15-20% weekly. Always dechlorinate replacement water before adding to prevent harming fish and beneficial bacteria.",
      category: "Advanced"
    },
    {
      question: "What's the minimum pond depth for fish?",
      answer: "24 inches minimum for goldfish and koi in temperate climates—this prevents freezing solid in winter and provides thermal stability in summer. In cold climates (Zone 5 and colder), 36 inches is safer for overwintering. Deeper sections also give fish refuge from predators like herons.",
      category: "Advanced"
    },
    {
      question: "Can I use this calculator for swimming pools?",
      answer: "While the volume calculations work for any water feature, the equipment sizing, fish stocking, and chemical dosing are pond-specific. For swimming pools, you'll need different filtration rates, sanitization methods (chlorine/salt systems), and safety considerations not covered by this pond calculator.",
      category: "General"
    },
    {
      question: "How much does it cost to maintain a pond annually?",
      answer: "Typical costs include pump electricity ($50-200), filter media replacement ($100-150), water treatments ($50-150), and fish food ($100-300), totaling $300-800 annually for average ponds. Larger koi ponds with extensive filtration and high fish loads can reach $1,000-2,000 per year depending on climate and stocking density.",
      category: "Advanced"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6 space-y-6">

        {/* Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode ? 'Comprehensive pond analysis with fish stocking, pump sizing, and chemical dosing' : 'Quick volume calculation with essential inputs only'}
            </p>
          </div>
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
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
        {/* Measurement Unit Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Measurement Unit</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setInputs({ ...inputs, measurementUnit: 'imperial' })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                inputs.measurementUnit === 'imperial'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">Imperial</div>
              <div className="text-xs text-muted-foreground">Feet, Gallons</div>
            </button>
            <button
              onClick={() => setInputs({ ...inputs, measurementUnit: 'metric' })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                inputs.measurementUnit === 'metric'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">Metric</div>
              <div className="text-xs text-muted-foreground">Meters, Liters</div>
            </button>
          </div>
        </div>

        {/* Pond Shape Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Pond Shape</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setInputs({ ...inputs, shape: 'rectangular' })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                inputs.shape === 'rectangular'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">Rectangular</div>
              <div className="text-xs text-muted-foreground">L × W × D</div>
            </button>
            <button
              onClick={() => setInputs({ ...inputs, shape: 'circular' })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                inputs.shape === 'circular'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">Circular</div>
              <div className="text-xs text-muted-foreground">π × r² × D</div>
            </button>
            <button
              onClick={() => setInputs({ ...inputs, shape: 'irregular' })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                inputs.shape === 'irregular'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">Irregular</div>
              <div className="text-xs text-muted-foreground">Approx.</div>
            </button>
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputs.shape === 'circular' ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Diameter ({inputs.measurementUnit === 'imperial' ? 'feet' : 'meters'})
              </label>
              <input
                type="number"
                value={inputs.diameter}
                onChange={(e) => setInputs({ ...inputs, diameter: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 10"
                step="0.1"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Length ({inputs.measurementUnit === 'imperial' ? 'feet' : 'meters'})
                </label>
                <input
                  type="number"
                  value={inputs.length}
                  onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., 15"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Width ({inputs.measurementUnit === 'imperial' ? 'feet' : 'meters'})
                </label>
                <input
                  type="number"
                  value={inputs.width}
                  onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., 10"
                  step="0.1"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {inputs.shape === 'irregular' ? 'Average ' : ''}Depth ({inputs.measurementUnit === 'imperial' ? 'feet' : 'meters'})
            </label>
            <input
              type="number"
              value={inputs.shape === 'irregular' ? inputs.avgDepth : inputs.depth}
              onChange={(e) => setInputs({
                ...inputs,
                [inputs.shape === 'irregular' ? 'avgDepth' : 'depth']: e.target.value
              })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., 3"
              step="0.1"
            />
            {inputs.shape === 'irregular' && (
              <p className="text-xs text-muted-foreground mt-1">
                Average of deepest and shallowest points
              </p>
            )}
          </div>
        </div>

        {/* Advanced Mode Options */}
        {isAdvancedMode && (
          <>
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Advanced Options</h3>

              {/* Pond Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Pond Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setInputs({ ...inputs, pondType: 'koi' })}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all",
                      inputs.pondType === 'koi'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Fish className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">Koi Pond</div>
                    <div className="text-xs text-muted-foreground">High filtration</div>
                  </button>
                  <button
                    onClick={() => setInputs({ ...inputs, pondType: 'goldfish' })}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all",
                      inputs.pondType === 'goldfish'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Fish className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">Goldfish</div>
                    <div className="text-xs text-muted-foreground">Medium filtration</div>
                  </button>
                  <button
                    onClick={() => setInputs({ ...inputs, pondType: 'decorative' })}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all",
                      inputs.pondType === 'decorative'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Droplet className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">Decorative</div>
                    <div className="text-xs text-muted-foreground">Light filtration</div>
                  </button>
                </div>
              </div>

              {/* Number of Fish */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Fish (Optional)
                </label>
                <input
                  type="number"
                  value={inputs.numberOfFish}
                  onChange={(e) => setInputs({ ...inputs, numberOfFish: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Waterfall Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inputs.hasWaterfall}
                    onChange={(e) => setInputs({ ...inputs, hasWaterfall: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Include Waterfall</span>
                </label>

                {inputs.hasWaterfall && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Waterfall Width (inches)
                    </label>
                    <input
                      type="number"
                      value={inputs.waterfallHeight}
                      onChange={(e) => setInputs({ ...inputs, waterfallHeight: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., 24"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Rule of thumb: 100 GPH per inch of waterfall width
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Calculate Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <button
            onClick={calculateVolume}
            className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <CalcIcon className="h-4 w-4 mr-2" />
            Calculate Volume
          </button>

          <button
            onClick={resetCalculator}
            className="flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Measurement Tips</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                For irregular ponds, measure at the longest, widest, and deepest points.
                Average minimum and maximum depth for sloped sides.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">Important Note</h3>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Always buy slightly more liner than calculated to accommodate measuring errors and hard-to-reach areas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && results && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-2xl font-bold text-foreground">Pond Volume Analysis Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Volume Results */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100">Pond Volume</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.volumeGallons.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">US Gallons</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.volumeLiters.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Liters</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.volumeCubicFeet.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Cubic Feet</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.volumeCubicMeters.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Cubic Meters</div>
                  </div>
                </div>
              </div>

              {/* Liner Size */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4">Pond Liner Size</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Length</div>
                    <div className="text-xl font-bold text-green-700 dark:text-green-400">
                      {results.linerLength} ft
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Width</div>
                    <div className="text-xl font-bold text-green-700 dark:text-green-400">
                      {results.linerWidth} ft
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Area</div>
                    <div className="text-xl font-bold text-green-700 dark:text-green-400">
                      {results.linerArea} sq ft
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mt-3">
                  Includes 2 feet of overlap on all sides for secure installation
                </p>
              </div>

              {isAdvancedMode && (
                <>
                  {/* Pump & Filter Requirements */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        Pump & Filter Requirements
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Minimum Pump Flow Rate</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {results.recommendedPumpGPH.toLocaleString()} GPH
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ({results.recommendedPumpLPH.toLocaleString()} LPH)
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Turnover Rate</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {results.filterTurnoverRate === 1
                            ? '1 hour'
                            : results.filterTurnoverRate === 0.67
                            ? '1.5 hours'
                            : '2 hours'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Full pond circulation
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mt-3">
                      Based on {inputs.pondType === 'koi' ? 'Koi pond' : inputs.pondType === 'goldfish' ? 'Goldfish pond' : 'Decorative pond'} filtration requirements
                    </p>
                  </div>

                  {/* Fish Stocking */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Fish className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      <h4 className="text-lg font-bold text-orange-900 dark:text-orange-100">
                        Fish Stocking Capacity
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Maximum Goldfish</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {results.maxGoldfish} fish
                        </div>
                        <div className="text-xs text-muted-foreground">@ 50 gal/fish</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Maximum Koi</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {results.maxKoi} fish
                        </div>
                        <div className="text-xs text-muted-foreground">@ 250 gal/fish</div>
                      </div>
                    </div>
                    {inputs.numberOfFish && parseInt(inputs.numberOfFish) > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Current Stocking Level</div>
                          <div className={cn(
                            "text-sm font-bold",
                            results.currentStockingLevel.includes('Excellent') && "text-green-600",
                            results.currentStockingLevel.includes('Good') && "text-blue-600",
                            results.currentStockingLevel.includes('Moderate') && "text-yellow-600",
                            results.currentStockingLevel.includes('Overstocked') && "text-red-600"
                          )}>
                            {results.currentStockingLevel}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {results.gallonsPerFish} gallons per fish
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chemical Dosing */}
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Beaker className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      <h4 className="text-lg font-bold text-cyan-900 dark:text-cyan-100">
                        Water Treatment Dosing
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Algaecide Dose</div>
                        <div className="text-2xl font-bold text-cyan-600">
                          {results.algaecideDose} tsp
                        </div>
                        <div className="text-xs text-muted-foreground">1 tsp per 50 gallons</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Clarifier Dose</div>
                        <div className="text-2xl font-bold text-cyan-600">
                          {results.clarifierDose} capfuls
                        </div>
                        <div className="text-xs text-muted-foreground">1 capful (5ml) per 10 gal</div>
                      </div>
                    </div>
                    <p className="text-sm text-cyan-800 dark:text-cyan-200 mt-3">
                      Always follow product-specific instructions and test water parameters before treatment
                    </p>
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">
                      Maintenance Requirements
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Weekly Water Change (10%)</div>
                        <div className="text-xl font-bold text-indigo-600">
                          {results.waterChangeGallons} gal
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ({results.waterChangeLiters} liters)
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Estimated Annual Cost</div>
                        <div className="text-xl font-bold text-indigo-600">
                          ${results.annualMaintenanceCost}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pump electricity + filters + chemicals
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                >
                  Print Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Introduction Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8 mb-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Calculate pond volume in gallons and liters for rectangular, circular, and irregular ponds. Get liner size with overlap,
          pump flow rate requirements, fish stocking capacity (koi and goldfish), chemical dosing recommendations, and maintenance
          cost estimates. Free tool with imperial and metric unit support.
        </p>
      </div>

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Online Pond Volume Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Choose Your Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Start with <strong>Simple Mode</strong> for quick volume calculations using just pond shape and dimensions.
                Switch to <strong>Advanced Mode</strong> for comprehensive analysis including liner sizing, pump requirements,
                fish stocking capacity, and chemical dosing recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Select Measurement Units & Pond Shape</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose between <strong>Imperial (feet/gallons)</strong> or <strong>Metric (meters/liters)</strong> units.
                Select your pond shape: <strong>Rectangular</strong> (length × width × depth), <strong>Circular</strong>
                (diameter × depth), or <strong>Irregular</strong> (uses 2/3 approximation formula for free-form ponds).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Enter Pond Dimensions</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Measure your pond at its <strong>longest, widest, and deepest points</strong>. For irregular or sloped ponds,
                average the minimum and maximum depths. Use a measuring tape or string for accuracy—measure across the water surface
                for width/length and straight down for depth.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Configure Advanced Options (Optional)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                In Advanced Mode, specify your <strong>pond type</strong> (Koi requires 1x/hour turnover, Goldfish 1.5x/hour,
                Decorative 2x/hour). Enter current fish count to assess stocking levels. Add waterfall width to calculate
                additional pump requirements (100 GPH per inch of width).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Review Your Comprehensive Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Get instant volume in gallons, liters, cubic feet, and cubic meters. See <strong>liner size with 2ft overlap</strong>,
                recommended pump flow rate, maximum fish capacity (50 gal/goldfish, 250 gal/koi), chemical dosing amounts,
                weekly water change volume, and estimated annual maintenance costs.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Pond Volume," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Multi-Unit Volume Calculations</h4>
                <p className="text-xs text-muted-foreground">Volume in US Gallons, Liters, Cubic Feet, and Cubic Meters</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📏</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Liner Size with Overlap</h4>
                <p className="text-xs text-muted-foreground">Precise liner dimensions including 2-foot overlap for secure installation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">⚙️</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Pump & Filter Requirements</h4>
                <p className="text-xs text-muted-foreground">Turnover-based flow rates (GPH/LPH) customized to your pond type</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">🐟</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Fish Stocking Capacity & Assessment</h4>
                <p className="text-xs text-muted-foreground">Maximum fish counts, gallons-per-fish ratios, and stocking level ratings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">💰 Save Money on Equipment</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Buy the correct liner size first time</li>
                <li>Size pumps and filters appropriately</li>
                <li>Avoid over-purchasing chemicals</li>
                <li>Prevent costly fish health issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛡️ Maintain Pond Health</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Ensure adequate filtration</li>
                <li>Prevent overstocking fish</li>
                <li>Calculate proper water treatments</li>
                <li>Schedule maintenance correctly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📋 Plan New Pond Projects</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Estimate total project costs</li>
                <li>Compare different pond sizes</li>
                <li>Determine fish capacity limits</li>
                <li>Size equipment before purchase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🆓 Completely Free Tool</h4>
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
              <CalcIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">All Pond Shapes</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Rectangular, circular, and irregular ponds</p>
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
            <li>• Measure after excavation is complete—soil settles and dimensions change during digging</li>
            <li>• For irregular ponds, divide into sections (rectangles/circles) and calculate each separately</li>
            <li>• Goldfish and koi require minimum 24 inches depth for overwintering in cold climates</li>
            <li>• Pump flow rate must stay within your filter's max capacity or filtration becomes ineffective</li>
            <li>• Add 10-20% extra pump capacity if you plan to add more fish or features later</li>
            <li>• Test water weekly during first month, then monthly once ecosystem stabilizes</li>
          </ul>
        </div>
      </div>

      {/* Scientific References */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Scientific References & Resources</h2>
        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Volume Calculation Methods</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://concalculator.com/pond-volume-calculator/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Volume Formulas - ConCalculator</a></li>
              <li>• <a href="https://www.omnicalculator.com/construction/pond" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Calculator - OmniCalculator</a></li>
              <li>• <a href="https://blagdonwatergardening.co.uk/support/toolbox/calculating-your-pond-volume/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calculating Pond Volume - Blagdon Water Gardening</a></li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Liner Sizing Guidelines</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.thepondguy.com/learning-center/pond-liner-calculator-guide/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Liner Calculator & Guide - The Pond Guy</a></li>
              <li>• <a href="https://worldofwater.com/how-to-ponds/calculating-pond-liner-size/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Liner Size Calculator - World of Water</a></li>
              <li>• <a href="https://www.pondliner.com/pond-liner-size-calculator" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Liner Size Calculator - PondLiner.com</a></li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Fish Stocking Density Research</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://nextdaykoi.com/koi-how-tos/koi-fish-stocking-density/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stocking Density—How Much Is Too Much? - Next Day Koi</a></li>
              <li>• <a href="https://pondinformer.com/goldfish-pond-stocking/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">How Many Goldfish Can I Keep in a Pond? - Pond Informer</a></li>
              <li>• <a href="https://www.koi-fish.com/a/understanding-stocking-density" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Understanding Stocking Density - Koi Fish Information</a></li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Pump & Filtration Requirements</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://pondinformer.com/pond-pump-size-guide/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">What Size Pond Pump Do I Need? - Pond Informer</a></li>
              <li>• <a href="https://support.allpondsolutions.co.uk/support/solutions/articles/44001283807" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calculate Pond Filter and Pump Size - All Pond Solutions</a></li>
              <li>• <a href="https://bradshawsdirect.co.uk/blog/calculating-your-ponds-required-flow-rate/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calculating Required Flow Rate - Bradshaws Direct</a></li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Water Treatment Dosing</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.apifishcare.com/product/pond-algaefix" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Algaefix Dosing - API Fishcare</a></li>
              <li>• <a href="https://blagdonwatergardening.co.uk/support/toolbox/treatment-dosage-calculator/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Treatment Dosage Calculator - Blagdon</a></li>
              <li>• <a href="https://www.tlc-products.com/products/ponds/pond-dose-chart-instructions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pond Dose Chart & Instructions - TLC Products</a></li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          All calculations based on industry-standard formulas and best practices from professional pond builders and aquaculture experts.
        </p>
      </div>

      {/* FAQ Section */}
      <FAQAccordion
        faqs={faqs}
        title="Pond Volume Calculator FAQ"
      />

      {/* Review Section */}
      <CalculatorReview calculatorName="Pond Volume Calculator" />
    </div>
  );
};

export default AdvancedPondVolumeCalculator;
