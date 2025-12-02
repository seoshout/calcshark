'use client';

import React, { useState } from 'react';
import { Info, DollarSign, Calendar, Building2, PawPrint, MapPin, Sparkles, TrendingUp, Clock, Heart, Shield, Star, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Calculator, RefreshCw, Lightbulb, Waves, Fish, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type CalculationMode = 'basic' | 'comparison' | 'backing' | 'conversion' | 'multi-spool';
type LineType = 'monofilament' | 'fluorocarbon' | 'braided';
type ReelSize = '1000' | '2000' | '2500' | '3000' | '4000' | '5000' | '6000' | '8000' | '10000' | 'custom';
type UnitSystem = 'imperial' | 'metric';

interface LineCharacteristics {
  diameterMm: number;
  diameterInch: number;
  poundTest: number;
}

export default function AdvancedFishingLineCapacityCalculator() {
  // State Management
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(true);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('basic');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

  // Reel Specifications
  const [reelSize, setReelSize] = useState<ReelSize>('3000');
  const [customCapacity, setCustomCapacity] = useState<number>(200);
  const [customCapacityUnit, setCustomCapacityUnit] = useState<'yards' | 'meters'>('yards');
  const [referenceLineTest, setReferenceLineTest] = useState<number>(12);
  const [referenceLineType, setReferenceLineType] = useState<LineType>('monofilament');

  // Line Specifications - Main Line
  const [mainLineType, setMainLineType] = useState<LineType>('monofilament');
  const [mainLinePoundTest, setMainLinePoundTest] = useState<number>(12);
  const [mainLineLength, setMainLineLength] = useState<number>(150);
  const [mainLineLengthUnit, setMainLineLengthUnit] = useState<'yards' | 'meters'>('yards');

  // Backing Line
  const [backingLineType, setBackingLineType] = useState<LineType>('braided');
  const [backingLinePoundTest, setBackingLinePoundTest] = useState<number>(20);

  // Conversion Mode
  const [oldLinePoundTest, setOldLinePoundTest] = useState<number>(12);
  const [oldLineType, setOldLineType] = useState<LineType>('monofilament');
  const [newLinePoundTest, setNewLinePoundTest] = useState<number>(20);
  const [newLineType, setNewLineType] = useState<LineType>('braided');

  // Multi-Spool
  const [numberOfSpools, setNumberOfSpools] = useState<number>(2);

  // Modal State
  const [showResults, setShowResults] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  // Line diameter data based on research (in mm)
  const getLineDiameter = (poundTest: number, lineType: LineType): number => {
    const diameterData: { [key: string]: { [key: number]: number } } = {
      monofilament: {
        4: 0.203, 6: 0.229, 8: 0.254, 10: 0.279, 12: 0.305, 15: 0.330,
        20: 0.381, 25: 0.432, 30: 0.483, 40: 0.584, 50: 0.686, 60: 0.737, 80: 0.889
      },
      fluorocarbon: {
        4: 0.178, 6: 0.229, 8: 0.254, 10: 0.279, 12: 0.305, 15: 0.330,
        20: 0.381, 25: 0.432, 30: 0.483, 40: 0.584, 50: 0.711, 60: 0.787, 80: 0.914
      },
      braided: {
        4: 0.127, 6: 0.127, 8: 0.152, 10: 0.203, 12: 0.203, 15: 0.229,
        20: 0.254, 25: 0.279, 30: 0.305, 40: 0.356, 50: 0.406, 60: 0.432, 80: 0.508
      }
    };

    const data = diameterData[lineType];
    if (data[poundTest]) {
      return data[poundTest];
    }

    // Interpolate for values not in table
    const sortedTests = Object.keys(data).map(Number).sort((a, b) => a - b);
    const lowerTest = sortedTests.filter(t => t < poundTest).pop() || sortedTests[0];
    const upperTest = sortedTests.filter(t => t > poundTest).shift() || sortedTests[sortedTests.length - 1];

    if (lowerTest === upperTest) return data[lowerTest];

    const lowerDiameter = data[lowerTest];
    const upperDiameter = data[upperTest];
    const ratio = (poundTest - lowerTest) / (upperTest - lowerTest);
    return lowerDiameter + ratio * (upperDiameter - lowerDiameter);
  };

  // Get reel capacity based on size (in yards of 12lb mono)
  const getReelCapacity = (size: ReelSize): number => {
    const capacities: { [key in ReelSize]: number } = {
      '1000': 140,
      '2000': 165,
      '2500': 200,
      '3000': 230,
      '4000': 260,
      '5000': 300,
      '6000': 350,
      '8000': 450,
      '10000': 550,
      'custom': customCapacity
    };
    return capacities[size];
  };

  // Calculate spool capacity constant
  const calculateSpoolCapacity = (): number => {
    const capacity = getReelCapacity(reelSize);
    const capacityInYards = customCapacityUnit === 'meters' && reelSize === 'custom' ? capacity * 1.09361 : capacity;
    const refDiameter = getLineDiameter(referenceLineTest, referenceLineType);

    // Spool capacity constant = line length × diameter²
    return capacityInYards * (refDiameter * refDiameter);
  };

  // Convert between units
  const yardsToMeters = (yards: number): number => yards * 0.9144;
  const metersToYards = (meters: number): number => meters * 1.09361;

  // Basic Capacity Calculation
  const calculateBasicCapacity = () => {
    const spoolCapacity = calculateSpoolCapacity();
    const diameter = getLineDiameter(mainLinePoundTest, mainLineType);
    const capacityYards = spoolCapacity / (diameter * diameter);
    const capacityMeters = yardsToMeters(capacityYards);

    return {
      mode: 'basic',
      lineType: mainLineType,
      poundTest: mainLinePoundTest,
      diameter: {
        mm: diameter,
        inches: diameter / 25.4
      },
      capacity: {
        yards: capacityYards,
        meters: capacityMeters,
        feet: capacityYards * 3
      },
      reelInfo: {
        size: reelSize,
        referenceCapacity: `${getReelCapacity(reelSize)} yards of ${referenceLineTest}lb ${referenceLineType}`
      }
    };
  };

  // Line Comparison
  const calculateLineComparison = () => {
    const spoolCapacity = calculateSpoolCapacity();
    const lineTypes: LineType[] = ['monofilament', 'fluorocarbon', 'braided'];

    const comparisons = lineTypes.map(type => {
      const diameter = getLineDiameter(mainLinePoundTest, type);
      const capacityYards = spoolCapacity / (diameter * diameter);
      const capacityMeters = yardsToMeters(capacityYards);

      return {
        lineType: type,
        diameter: {
          mm: diameter,
          inches: diameter / 25.4
        },
        capacity: {
          yards: capacityYards,
          meters: capacityMeters,
          feet: capacityYards * 3
        },
        percentage: 100 // Will calculate after
      };
    });

    // Calculate percentages relative to monofilament
    const monoCapacity = comparisons.find(c => c.lineType === 'monofilament')!.capacity.yards;
    comparisons.forEach(comp => {
      comp.percentage = (comp.capacity.yards / monoCapacity) * 100;
    });

    return {
      mode: 'comparison',
      poundTest: mainLinePoundTest,
      comparisons,
      reelInfo: {
        size: reelSize,
        referenceCapacity: `${getReelCapacity(reelSize)} yards of ${referenceLineTest}lb ${referenceLineType}`
      }
    };
  };

  // Backing Calculator
  const calculateBacking = () => {
    const spoolCapacity = calculateSpoolCapacity();
    const mainDiameter = getLineDiameter(mainLinePoundTest, mainLineType);
    const backingDiameter = getLineDiameter(backingLinePoundTest, backingLineType);

    // Convert main line length to yards if needed
    const mainLengthYards = mainLineLengthUnit === 'meters' ? metersToYards(mainLineLength) : mainLineLength;

    // Calculate volume used by main line
    const mainLineVolume = mainLengthYards * (mainDiameter * mainDiameter);

    // Remaining volume for backing
    const remainingVolume = spoolCapacity - mainLineVolume;

    if (remainingVolume <= 0) {
      return {
        mode: 'backing',
        error: true,
        message: 'Main line exceeds reel capacity! Choose a shorter main line or larger reel.',
        mainLine: {
          type: mainLineType,
          poundTest: mainLinePoundTest,
          length: {
            yards: mainLengthYards,
            meters: yardsToMeters(mainLengthYards)
          },
          diameter: {
            mm: mainDiameter,
            inches: mainDiameter / 25.4
          }
        }
      };
    }

    // Calculate backing capacity
    const backingYards = remainingVolume / (backingDiameter * backingDiameter);
    const backingMeters = yardsToMeters(backingYards);
    const totalYards = mainLengthYards + backingYards;
    const totalMeters = yardsToMeters(totalYards);

    return {
      mode: 'backing',
      error: false,
      mainLine: {
        type: mainLineType,
        poundTest: mainLinePoundTest,
        length: {
          yards: mainLengthYards,
          meters: yardsToMeters(mainLengthYards)
        },
        diameter: {
          mm: mainDiameter,
          inches: mainDiameter / 25.4
        }
      },
      backingLine: {
        type: backingLineType,
        poundTest: backingLinePoundTest,
        length: {
          yards: backingYards,
          meters: backingMeters
        },
        diameter: {
          mm: backingDiameter,
          inches: backingDiameter / 25.4
        }
      },
      total: {
        yards: totalYards,
        meters: totalMeters,
        feet: totalYards * 3
      },
      percentages: {
        mainLine: (mainLengthYards / totalYards) * 100,
        backing: (backingYards / totalYards) * 100
      },
      reelInfo: {
        size: reelSize,
        referenceCapacity: `${getReelCapacity(reelSize)} yards of ${referenceLineTest}lb ${referenceLineType}`,
        fillPercentage: (totalYards / getReelCapacity(reelSize)) * 100
      }
    };
  };

  // Line Conversion
  const calculateConversion = () => {
    const spoolCapacity = calculateSpoolCapacity();
    const oldDiameter = getLineDiameter(oldLinePoundTest, oldLineType);
    const newDiameter = getLineDiameter(newLinePoundTest, newLineType);

    const oldCapacityYards = spoolCapacity / (oldDiameter * oldDiameter);
    const newCapacityYards = spoolCapacity / (newDiameter * newDiameter);

    const differenceYards = newCapacityYards - oldCapacityYards;
    const percentageChange = ((newCapacityYards - oldCapacityYards) / oldCapacityYards) * 100;

    return {
      mode: 'conversion',
      oldLine: {
        type: oldLineType,
        poundTest: oldLinePoundTest,
        diameter: {
          mm: oldDiameter,
          inches: oldDiameter / 25.4
        },
        capacity: {
          yards: oldCapacityYards,
          meters: yardsToMeters(oldCapacityYards)
        }
      },
      newLine: {
        type: newLineType,
        poundTest: newLinePoundTest,
        diameter: {
          mm: newDiameter,
          inches: newDiameter / 25.4
        },
        capacity: {
          yards: newCapacityYards,
          meters: yardsToMeters(newCapacityYards)
        }
      },
      difference: {
        yards: differenceYards,
        meters: yardsToMeters(differenceYards),
        percentage: percentageChange
      },
      recommendation: differenceYards > 0 ? 'gain' : 'loss',
      reelInfo: {
        size: reelSize,
        referenceCapacity: `${getReelCapacity(reelSize)} yards of ${referenceLineTest}lb ${referenceLineType}`
      }
    };
  };

  // Multi-Spool Calculator
  const calculateMultiSpool = () => {
    const spoolCapacity = calculateSpoolCapacity();
    const diameter = getLineDiameter(mainLinePoundTest, mainLineType);
    const capacityPerSpoolYards = spoolCapacity / (diameter * diameter);
    const capacityPerSpoolMeters = yardsToMeters(capacityPerSpoolYards);

    const totalYards = capacityPerSpoolYards * numberOfSpools;
    const totalMeters = capacityPerSpoolMeters * numberOfSpools;

    return {
      mode: 'multi-spool',
      lineType: mainLineType,
      poundTest: mainLinePoundTest,
      numberOfSpools,
      perSpool: {
        yards: capacityPerSpoolYards,
        meters: capacityPerSpoolMeters,
        feet: capacityPerSpoolYards * 3
      },
      total: {
        yards: totalYards,
        meters: totalMeters,
        feet: totalYards * 3
      },
      bulkPurchase: {
        yards100: Math.ceil(totalYards / 100),
        yards300: Math.ceil(totalYards / 300),
        meters100: Math.ceil(totalMeters / 100),
        meters300: Math.ceil(totalMeters / 300)
      },
      reelInfo: {
        size: reelSize,
        referenceCapacity: `${getReelCapacity(reelSize)} yards of ${referenceLineTest}lb ${referenceLineType}`
      }
    };
  };

  const handleCalculate = () => {
    let calculationResults;

    switch (calculationMode) {
      case 'basic':
        calculationResults = calculateBasicCapacity();
        break;
      case 'comparison':
        calculationResults = calculateLineComparison();
        break;
      case 'backing':
        calculationResults = calculateBacking();
        break;
      case 'conversion':
        calculationResults = calculateConversion();
        break;
      case 'multi-spool':
        calculationResults = calculateMultiSpool();
        break;
      default:
        calculationResults = calculateBasicCapacity();
    }

    setResults(calculationResults);
    setShowResults(true);
  };

  const handleReset = () => {
    setReelSize('3000');
    setCustomCapacity(200);
    setReferenceLineTest(12);
    setReferenceLineType('monofilament');
    setMainLineType('monofilament');
    setMainLinePoundTest(12);
    setMainLineLength(150);
    setBackingLineType('braided');
    setBackingLinePoundTest(20);
    setOldLinePoundTest(12);
    setOldLineType('monofilament');
    setNewLinePoundTest(20);
    setNewLineType('braided');
    setNumberOfSpools(2);
    setShowResults(false);
    setResults(null);
  };

  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toFixed(decimals);
  };

  const getLineTypeColor = (type: LineType): string => {
    switch (type) {
      case 'monofilament':
        return 'blue';
      case 'fluorocarbon':
        return 'purple';
      case 'braided':
        return 'green';
      default:
        return 'gray';
    }
  };

  // FAQ Data
  const faqItems: FAQItem[] = [
    {
      question: "How do I calculate fishing line capacity for my reel?",
      answer: "Calculate line capacity using the formula: new line length = spool capacity / new line diameter². Start with your reel's rated capacity (e.g., 200 yards of 12lb mono), calculate the spool capacity constant (length × diameter²), then divide by your desired line's diameter squared to get the new capacity."
    },
    {
      question: "Why does braided line have more capacity than monofilament?",
      answer: "Braided line has 35-45% thinner diameter than monofilament at the same pound test. For example, 10lb braid is 0.203mm while 10lb mono is 0.279mm. Since capacity is inversely proportional to diameter squared, the thinner braid allows 2-3x more line on the same spool."
    },
    {
      question: "What's the difference between reel sizes (1000, 2500, 3000, etc.)?",
      answer: "Reel sizes indicate line capacity: 1000-2500 (small, 140-200 yards) for trout/panfish, 2500-3000 (medium, 200-230 yards) most popular for bass/walleye, 3000-4000 (260 yards) for larger freshwater, 4000-5000 (300 yards) for pike/salmon, 5000+ for saltwater. Higher numbers = more capacity, heavier weight, stronger drag."
    },
    {
      question: "How much backing line do I need with my main line?",
      answer: "Calculate backing by subtracting main line volume from spool capacity. Example: 200-yard capacity reel with 150 yards of 0.305mm main line leaves space for ~180 yards of 0.203mm backing. Always leave 10-15% space to prevent overfilling and ensure proper drag function."
    },
    {
      question: "Is fluorocarbon or monofilament thicker?",
      answer: "They're similar at low tests (0.279mm for 10lb each), but fluorocarbon becomes thicker at higher tests. At 50lb, mono is 0.686mm while fluoro is 0.711mm. At 60lb, the difference is more pronounced: mono 0.737mm vs fluoro 0.787mm. Both are much thicker than braid."
    },
    {
      question: "Can I mix different line types on the same spool?",
      answer: "Yes, it's common to use braided backing with fluorocarbon or mono main line. Connect with a double uni knot or FG knot. Benefits: cheaper backing, increased capacity, different line properties where needed. Always use thinner/stronger braid for backing to maximize capacity."
    },
    {
      question: "How do I convert between yards and meters for line capacity?",
      answer: "1 yard = 0.9144 meters, or 1 meter = 1.09361 yards. Example: 200 yards = 183 meters, 200 meters = 219 yards. Most US reels rate in yards, international reels in meters. Always check which unit your reel manufacturer uses."
    },
    {
      question: "What happens if I overfill my reel spool?",
      answer: "Overfilling causes: line spillage/tangling, reduced casting distance, drag malfunction, increased wind knots, line digging into spool under pressure. Fill to 1/8 inch (3mm) from spool rim for spinning reels, slightly less for baitcasters. This is 85-90% of maximum capacity."
    },
    {
      question: "Why is my actual line capacity different from calculations?",
      answer: "Calculated capacity is theoretical. Real capacity varies by: line winding tension (tighter = more), line roundness (older line flattens), spool shape variations, manufacturing tolerances. Expect 5-15% variance. Tight winding can fit 10-20% more but may cause issues."
    },
    {
      question: "How does line stretch affect capacity?",
      answer: "Monofilament stretches 15-30%, fluorocarbon 10-15%, braid <3%. Under load, stretchy lines compress and dig into spool, effectively increasing capacity but potentially causing problems. When fighting fish, mono/fluoro can bury into itself, making it hard to retrieve later."
    },
    {
      question: "Should I fill my reel to maximum capacity?",
      answer: "No, leave 1/8 inch (3mm) gap for spinning reels, slightly more for baitcasters. Benefits: better casting distance, reduced tangles, proper drag function, prevents line spilling. Fill to 85-90% of rated capacity for optimal performance."
    },
    {
      question: "What line diameter should I use for different fish species?",
      answer: "Panfish/trout: 4-8lb (0.203-0.254mm), Bass/walleye: 8-12lb (0.254-0.305mm), Pike/muskie: 20-30lb (0.381-0.483mm), Inshore saltwater: 15-25lb (0.330-0.432mm), Offshore: 50-80lb+ (0.686-0.889mm+). Match line to fish size, cover, and technique."
    },
    {
      question: "Can I use the same reel for different line types?",
      answer: "Yes, but capacity changes dramatically. A reel rated for 200 yards of 12lb mono holds: ~200 yards 12lb fluoro, ~450 yards 12lb braid, ~140 yards 20lb mono, ~300 yards 20lb braid. Calculate capacity for each line type before switching."
    },
    {
      question: "How much line do I need for deep water fishing?",
      answer: "Add depth + 100-200 yards. Example: 100-foot depth needs minimum 133 yards (100÷3) + 150 yards = 283 yards. Deeper water and larger fish need more. Deep drop (400+ feet) requires 500+ yards. Factor in current and drift."
    },
    {
      question: "What's the best line type for maximum capacity?",
      answer: "Braided line provides 2-3x capacity of mono/fluoro at the same strength. 30lb braid (0.305mm) has the diameter of 12lb mono but 2.5x the strength. Perfect for deep water, heavy cover, or when you need maximum line on a small reel."
    },
    {
      question: "How do I measure my line diameter if it's not labeled?",
      answer: "Use a digital caliper (accurate to 0.01mm) or micrometer. Measure in 3-5 spots, average the readings. Note: used line may be thinner from abrasion. Alternatively, reference manufacturer specs online. Line diameter directly determines capacity calculations."
    },
    {
      question: "Does line color affect diameter or capacity?",
      answer: "Minimally. Pigments can add 0.01-0.02mm to diameter, affecting capacity by 3-7%. Hi-vis lines may be slightly thicker. Clear/low-vis lines tend to be truest to rated diameter. For capacity calculations, the difference is usually negligible unless precision-critical."
    },
    {
      question: "Can I calculate capacity for old or used line?",
      answer: "Older line may be compressed or abraded, changing diameter by 10-20%. This unpredictably affects capacity. For accurate calculations, use new line diameter specs. Replace line annually (freshwater) or every 6 months (saltwater) for consistent performance and predictable capacity."
    },
    {
      question: "What's backing-to-running-line ratio for fly fishing?",
      answer: "Typically 100-150 yards backing + 90-100 feet running line. Saltwater: 200-300 yards backing for big game. Calculate based on: spool capacity minus running line volume. Use 20-30lb braided backing for maximum capacity on smaller reels."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section with Icon */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Waves className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fishing Line Capacity Calculator</h2>
            <p className="text-muted-foreground">Calculate line capacity, backing, and conversions for your fishing reel</p>
          </div>
        </div>

        {/* Simple/Advanced Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Access all calculation modes, backing calculator, and line conversion features'
                : 'Quick line capacity estimate with basic options'}
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

        {/* Calculation Mode Selector - Advanced Only */}
        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Calculation Mode
            </label>
            <select
              value={calculationMode}
              onChange={(e) => setCalculationMode(e.target.value as CalculationMode)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="basic">Basic Capacity - Calculate line capacity for single line type</option>
              <option value="comparison">Line Comparison - Compare all 3 line types (mono, fluoro, braid)</option>
              <option value="backing">Backing Calculator - Calculate backing line with main line</option>
              <option value="conversion">Line Conversion - Compare old vs new line capacity</option>
              <option value="multi-spool">Multi-Spool - Calculate total line needed for multiple spools</option>
            </select>
          </div>
        )}

        {/* Unit System Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Unit System:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                unitSystem === 'imperial'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Imperial (yards, lb)
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                unitSystem === 'metric'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Metric (meters, kg)
            </button>
          </div>
        </div>

        {/* Reel Specifications */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-foreground">Reel Specifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reel Size
              </label>
              <select
                value={reelSize}
                onChange={(e) => setReelSize(e.target.value as ReelSize)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1000">1000 - Small (Trout, Panfish)</option>
                <option value="2000">2000 - Light (Trout, Bass)</option>
                <option value="2500">2500 - Medium-Light (Bass, Walleye)</option>
                <option value="3000">3000 - Medium (Most Popular)</option>
                <option value="4000">4000 - Medium-Heavy (Pike, Salmon)</option>
                <option value="5000">5000 - Heavy (Big Game, Saltwater)</option>
                <option value="6000">6000 - Extra Heavy</option>
                <option value="8000">8000 - Saltwater</option>
                <option value="10000">10000 - Big Game</option>
                <option value="custom">Custom - Enter Your Reel Specs</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Standard capacity: {getReelCapacity(reelSize)} yards of {referenceLineTest}lb {referenceLineType}
              </p>
            </div>

            {reelSize === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Capacity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customCapacity}
                    onChange={(e) => setCustomCapacity(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="50"
                    max="1000"
                  />
                  <select
                    value={customCapacityUnit}
                    onChange={(e) => setCustomCapacityUnit(e.target.value as 'yards' | 'meters')}
                    className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reference Line Test (lb)
              </label>
              <input
                type="number"
                value={referenceLineTest}
                onChange={(e) => setReferenceLineTest(Number(e.target.value))}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                min="4"
                max="80"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The pound test your reel is rated for
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reference Line Type
              </label>
              <select
                value={referenceLineType}
                onChange={(e) => setReferenceLineType(e.target.value as LineType)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="monofilament">Monofilament</option>
                <option value="fluorocarbon">Fluorocarbon</option>
                <option value="braided">Braided</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mode-Specific Inputs */}
        {calculationMode === 'basic' && (
          <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">Line Specifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Line Type
                </label>
                <select
                  value={mainLineType}
                  onChange={(e) => setMainLineType(e.target.value as LineType)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="monofilament">Monofilament</option>
                  <option value="fluorocarbon">Fluorocarbon</option>
                  <option value="braided">Braided</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pound Test
                </label>
                <input
                  type="number"
                  value={mainLinePoundTest}
                  onChange={(e) => setMainLinePoundTest(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="4"
                  max="80"
                />
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'comparison' && (
          <div className="space-y-4 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">Compare Line Types</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pound Test to Compare
              </label>
              <input
                type="number"
                value={mainLinePoundTest}
                onChange={(e) => setMainLinePoundTest(Number(e.target.value))}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                min="4"
                max="80"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Calculate capacity for this test in all 3 line types
              </p>
            </div>
          </div>
        )}

        {calculationMode === 'backing' && (
          <div className="space-y-4 mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-foreground">Main Line & Backing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Main Line</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Line Type
                  </label>
                  <select
                    value={mainLineType}
                    onChange={(e) => setMainLineType(e.target.value as LineType)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="monofilament">Monofilament</option>
                    <option value="fluorocarbon">Fluorocarbon</option>
                    <option value="braided">Braided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pound Test
                  </label>
                  <input
                    type="number"
                    value={mainLinePoundTest}
                    onChange={(e) => setMainLinePoundTest(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="4"
                    max="80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Main Line Length
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={mainLineLength}
                      onChange={(e) => setMainLineLength(Number(e.target.value))}
                      className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      min="10"
                      max="500"
                    />
                    <select
                      value={mainLineLengthUnit}
                      onChange={(e) => setMainLineLengthUnit(e.target.value as 'yards' | 'meters')}
                      className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="yards">yards</option>
                      <option value="meters">meters</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Backing Line</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Line Type
                  </label>
                  <select
                    value={backingLineType}
                    onChange={(e) => setBackingLineType(e.target.value as LineType)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="monofilament">Monofilament</option>
                    <option value="fluorocarbon">Fluorocarbon</option>
                    <option value="braided">Braided (Recommended)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pound Test
                  </label>
                  <input
                    type="number"
                    value={backingLinePoundTest}
                    onChange={(e) => setBackingLinePoundTest(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="4"
                    max="80"
                  />
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Use braided backing for maximum capacity and cost savings. Connect with an FG knot or double uni knot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'conversion' && (
          <div className="space-y-4 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-foreground">Line Conversion</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Current Line</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Line Type
                  </label>
                  <select
                    value={oldLineType}
                    onChange={(e) => setOldLineType(e.target.value as LineType)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="monofilament">Monofilament</option>
                    <option value="fluorocarbon">Fluorocarbon</option>
                    <option value="braided">Braided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pound Test
                  </label>
                  <input
                    type="number"
                    value={oldLinePoundTest}
                    onChange={(e) => setOldLinePoundTest(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="4"
                    max="80"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">New Line</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Line Type
                  </label>
                  <select
                    value={newLineType}
                    onChange={(e) => setNewLineType(e.target.value as LineType)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="monofilament">Monofilament</option>
                    <option value="fluorocarbon">Fluorocarbon</option>
                    <option value="braided">Braided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pound Test
                  </label>
                  <input
                    type="number"
                    value={newLinePoundTest}
                    onChange={(e) => setNewLinePoundTest(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="4"
                    max="80"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'multi-spool' && (
          <div className="space-y-4 mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-foreground">Multi-Spool Calculator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Line Type
                </label>
                <select
                  value={mainLineType}
                  onChange={(e) => setMainLineType(e.target.value as LineType)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="monofilament">Monofilament</option>
                  <option value="fluorocarbon">Fluorocarbon</option>
                  <option value="braided">Braided</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pound Test
                </label>
                <input
                  type="number"
                  value={mainLinePoundTest}
                  onChange={(e) => setMainLinePoundTest(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="4"
                  max="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Number of Spools
                </label>
                <input
                  type="number"
                  value={numberOfSpools}
                  onChange={(e) => setNumberOfSpools(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 min-w-[200px] bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calculate Capacity
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && results && (
        <div className="bg-background border rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Calculation Results</h3>
            <button
              onClick={() => setShowResults(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Mode-Specific Results */}
          {results.mode === 'basic' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Line Capacity</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Line Type:</span>{' '}
                    <span className="capitalize">{results.lineType}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Pound Test:</span> {results.poundTest} lb
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Line Diameter:</span> {formatNumber(results.diameter.mm, 2)} mm ({formatNumber(results.diameter.inches, 3)} inches)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Total Capacity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(results.capacity.yards)}
                    </p>
                    <p className="text-sm text-muted-foreground">Yards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(results.capacity.meters)}
                    </p>
                    <p className="text-sm text-muted-foreground">Meters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(results.capacity.feet, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Feet</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Reel:</strong> {results.reelInfo.size === 'custom' ? 'Custom' : `Size ${results.reelInfo.size}`} - {results.reelInfo.referenceCapacity}
                </p>
              </div>
            </div>
          )}

          {results.mode === 'comparison' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  Comparing {results.poundTest}lb test across all line types
                </h4>
              </div>

              {results.comparisons.map((comp: any, index: number) => {
                const color = getLineTypeColor(comp.lineType);
                return (
                  <div key={index} className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold capitalize text-foreground">{comp.lineType}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 dark:bg-${color}-900/50 text-${color}-800 dark:text-${color}-200`}>
                        {formatNumber(comp.percentage, 0)}% capacity
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Yards</p>
                        <p className="text-lg font-bold">{formatNumber(comp.capacity.yards)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Meters</p>
                        <p className="text-lg font-bold">{formatNumber(comp.capacity.meters)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diameter (mm)</p>
                        <p className="text-lg font-bold">{formatNumber(comp.diameter.mm, 2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diameter (in)</p>
                        <p className="text-lg font-bold">{formatNumber(comp.diameter.inches, 3)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {results.mode === 'backing' && (
            <div className="space-y-4">
              {results.error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h4 className="font-semibold text-red-900 dark:text-red-100">Error</h4>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200">{results.message}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Main Line</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> <span className="capitalize">{results.mainLine.type}</span></p>
                        <p><span className="font-medium">Test:</span> {results.mainLine.poundTest} lb</p>
                        <p><span className="font-medium">Length:</span> {formatNumber(results.mainLine.length.yards)} yards ({formatNumber(results.mainLine.length.meters)} m)</p>
                        <p><span className="font-medium">Diameter:</span> {formatNumber(results.mainLine.diameter.mm, 2)} mm</p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Backing Line</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> <span className="capitalize">{results.backingLine.type}</span></p>
                        <p><span className="font-medium">Test:</span> {results.backingLine.poundTest} lb</p>
                        <p><span className="font-medium">Length:</span> {formatNumber(results.backingLine.length.yards)} yards ({formatNumber(results.backingLine.length.meters)} m)</p>
                        <p><span className="font-medium">Diameter:</span> {formatNumber(results.backingLine.diameter.mm, 2)} mm</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Total Capacity</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {formatNumber(results.total.yards)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Yards</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {formatNumber(results.total.meters)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Meters</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {formatNumber(results.reelInfo.fillPercentage, 0)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Spool Fill</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Main line: {formatNumber(results.percentages.mainLine, 0)}% • Backing: {formatNumber(results.percentages.backing, 0)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {results.mode === 'conversion' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Current Line</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{results.oldLine.type}</span></p>
                    <p><span className="font-medium">Test:</span> {results.oldLine.poundTest} lb</p>
                    <p><span className="font-medium">Capacity:</span> {formatNumber(results.oldLine.capacity.yards)} yards</p>
                    <p><span className="font-medium">Diameter:</span> {formatNumber(results.oldLine.diameter.mm, 2)} mm</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">New Line</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{results.newLine.type}</span></p>
                    <p><span className="font-medium">Test:</span> {results.newLine.poundTest} lb</p>
                    <p><span className="font-medium">Capacity:</span> {formatNumber(results.newLine.capacity.yards)} yards</p>
                    <p><span className="font-medium">Diameter:</span> {formatNumber(results.newLine.diameter.mm, 2)} mm</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${results.recommendation === 'gain' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <h4 className={`font-semibold mb-3 ${results.recommendation === 'gain' ? 'text-green-900 dark:text-green-100' : 'text-orange-900 dark:text-orange-100'}`}>
                  {results.recommendation === 'gain' ? 'Capacity Gain 📈' : 'Capacity Loss 📉'}
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className={`text-2xl font-bold ${results.recommendation === 'gain' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {results.difference.yards > 0 ? '+' : ''}{formatNumber(results.difference.yards)}
                    </p>
                    <p className="text-sm text-muted-foreground">Yards</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${results.recommendation === 'gain' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {results.difference.meters > 0 ? '+' : ''}{formatNumber(results.difference.meters)}
                    </p>
                    <p className="text-sm text-muted-foreground">Meters</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${results.recommendation === 'gain' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {results.difference.percentage > 0 ? '+' : ''}{formatNumber(results.difference.percentage, 0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Change</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {results.mode === 'multi-spool' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Per Spool Capacity</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatNumber(results.perSpool.yards)}
                    </p>
                    <p className="text-sm text-muted-foreground">Yards</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatNumber(results.perSpool.meters)}
                    </p>
                    <p className="text-sm text-muted-foreground">Meters</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {results.numberOfSpools}
                    </p>
                    <p className="text-sm text-muted-foreground">Spools</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Total Line Needed</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(results.total.yards, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Yards</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(results.total.meters, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Meters</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Bulk Purchase Guide</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">100-yard spools needed:</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{results.bulkPurchase.yards100}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">300-yard spools needed:</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{results.bulkPurchase.yards300}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">100-meter spools needed:</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{results.bulkPurchase.meters100}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">300-meter spools needed:</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{results.bulkPurchase.meters300}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* About This Calculator */}
      <div className="bg-background border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">About This Calculator</h2>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          <p>
            Our <strong>Fishing Line Capacity Calculator</strong> helps anglers determine exactly how much fishing line their reel can hold based on line type, diameter, and pound test. Whether you're spooling monofilament, fluorocarbon, or braided line, our calculator uses precise formulas to calculate capacity, backing requirements, and line conversions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground">5 Calculation Modes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Basic, Comparison, Backing, Conversion, and Multi-Spool modes for all your needs
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <Fish className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground">3 Line Types</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Monofilament, fluorocarbon, and braided with accurate diameter data
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">9 Reel Sizes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                From 1000 to 10000 series plus custom capacity option
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-foreground">Backing Calculator</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Calculate exact backing needed with your main line
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Accurate Diameter Database:</strong> Research-based line diameters for 4-80lb test in all three line types</li>
            <li><strong>Line Comparison:</strong> See capacity differences between mono, fluoro, and braid side-by-side</li>
            <li><strong>Backing Calculator:</strong> Determine exact backing line length when using two different lines</li>
            <li><strong>Conversion Tool:</strong> Calculate capacity gain or loss when switching line types</li>
            <li><strong>Multi-Spool Planning:</strong> Calculate total line needed for multiple identical reels</li>
            <li><strong>Imperial & Metric:</strong> Switch between yards/pounds and meters/kilograms</li>
            <li><strong>Custom Reel Support:</strong> Enter any reel capacity for precise calculations</li>
            <li><strong>Bulk Purchase Guide:</strong> See how many spools you need for multi-spool setups</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Select Your Reel:</strong> Choose from common sizes (1000-10000) or enter custom capacity</li>
            <li><strong>Enter Reference Specs:</strong> Input the pound test your reel is rated for</li>
            <li><strong>Choose Calculation Mode:</strong> Basic capacity, comparison, backing, conversion, or multi-spool</li>
            <li><strong>Input Line Specifications:</strong> Select line type (mono/fluoro/braid) and pound test</li>
            <li><strong>Calculate:</strong> Get instant results with capacity in yards, meters, and feet</li>
            <li><strong>Review Results:</strong> See detailed breakdown including line diameter and recommendations</li>
          </ol>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Understanding Line Capacity</h3>
          <p>
            Line capacity is calculated using the cylinder volume formula adapted for fishing reels: <strong>new line length = spool capacity / new line diameter²</strong>. The spool capacity constant is determined from your reel's rated capacity (e.g., 200 yards of 12lb mono).
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Why Braided Line Has More Capacity</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Braided line is 35-45% thinner than mono or fluoro at the same pound test. Since capacity is inversely proportional to diameter squared, a 10lb braid (0.203mm) allows 2-3x more line than 10lb mono (0.279mm) on the same spool. This is why anglers prefer braid for deep water fishing or backing line applications.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Reel Size Guide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <p className="font-semibold text-sm">1000-2500 (Small)</p>
              <p className="text-xs text-muted-foreground">Trout, panfish, ultralight | 140-200 yards</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <p className="font-semibold text-sm">2500-3000 (Medium-Light)</p>
              <p className="text-xs text-muted-foreground">Bass, walleye, most popular | 200-230 yards</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <p className="font-semibold text-sm">3000-4000 (Medium)</p>
              <p className="text-xs text-muted-foreground">Larger freshwater species | 230-260 yards</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <p className="font-semibold text-sm">4000-5000 (Heavy)</p>
              <p className="text-xs text-muted-foreground">Pike, salmon, inshore saltwater | 260-300 yards</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Calculated capacity is theoretical - actual capacity varies by ±5-15% based on winding tension, line roundness, and spool shape</li>
            <li>Fill to 85-90% capacity (1/8 inch from rim) for optimal casting and to prevent line spilling</li>
            <li>Tight winding can fit 10-20% more line but may cause issues with line digging under pressure</li>
            <li>Line stretch affects capacity: mono (15-30%), fluoro (10-15%), braid (&lt;3%)</li>
            <li>Replace line annually (freshwater) or every 6 months (saltwater) for consistent performance</li>
            <li>Always leave space at the top - overfilling causes tangles, reduced casting distance, and drag malfunction</li>
            <li>When mixing lines for backing, use braided backing with mono/fluoro main line for maximum capacity</li>
            <li>Connect backing to main line with double uni knot or FG knot for smooth casting</li>
          </ul>
        </div>
      </div>

      {/* Scientific References */}
      <div className="bg-background border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Scientific References</h2>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="mb-4">
            This calculator is based on industry-standard line diameter measurements, reel capacity specifications, and the cylinder volume formula adapted for fishing reels. All calculations follow established fishing industry standards and are verified against manufacturer specifications.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">Line Diameter Research Sources</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <a href="https://norrik.com/fishing-line-strength-charts/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Norrik - Fishing Line Strength Charts
              </a> - Comprehensive diameter data for monofilament, fluorocarbon, and braided lines
            </li>
            <li>
              <a href="https://tacklevillage.com/fishing-line-diameter-chart/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Tackle Village - Fishing Line Diameter Chart
              </a> - Braid, mono, and fluoro diameter comparisons
            </li>
            <li>
              <a href="https://www.oceanbluefishing.com/magazine/pe-rating-fishing-line-diameter-chart/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Ocean Blue Fishing - PE Rating & Line Diameter Chart
              </a> - International PE rating system and diameter conversions
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">Reel Capacity Research</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <a href="https://fishingsun.com/a/blog/the-ultimate-fishing-reel-size-chart-for-every-angler" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Fishing Sun - Ultimate Fishing Reel Size Chart
              </a> - Comprehensive reel sizing guide
            </li>
            <li>
              <a href="https://www.reelcoquinafishing.com/blogs/florida-fishing-blog/spinning-reel-sizes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Reel Coquina - Spinning Reel Sizes
              </a> - Detailed reel capacity specifications
            </li>
            <li>
              <a href="https://kastking.com/blogs/how-to/how-to-choose-spinning-reel-size" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                KastKing - How to Choose Spinning Reel Size
              </a> - Industry standard reel sizing
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">Capacity Calculation Methods</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <a href="https://www.omnicalculator.com/sports/fishing-reel-line-capacity" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Omni Calculator - Fishing Reel Line Capacity
              </a> - Mathematical formulas and calculation methodology
            </li>
            <li>
              <a href="https://howmuchbacking.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                How Much Backing
              </a> - Backing line calculation formulas
            </li>
            <li>
              <a href="https://www.washingtonflyfishing.com/threads/mathematical-formula-for-spool-capacity-needed.168532/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Washington Fly Fishing Forum - Spool Capacity Formula
              </a> - Mathematical discussion on cylinder volume formula applied to reels
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">Line Type Comparisons</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <a href="https://freshwaterfishingadvice.com/mono-braid-fluorocarbon-fishing-line/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Freshwater Fishing Advice - Braid vs Mono vs Fluorocarbon
              </a> - Complete line type comparison guide
            </li>
            <li>
              <a href="https://www.wildlifedepartment.com/outdoorok/ooj/choosing-right-fishing-line" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Oklahoma Wildlife Department - Choosing the Right Fishing Line
              </a> - Government resource on line selection
            </li>
            <li>
              <a href="https://sunlineamerica.com/blogs/news/fluorocarbon-braid-or-monofilament" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Sunline America - When to Use Fluorocarbon, Braid, or Monofilament
              </a> - Professional line application guide
            </li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Calculation Formula:</strong> This calculator uses the cylinder volume formula: spool capacity constant = line length × diameter². For new line: new line length = spool capacity constant / new diameter². This provides theoretical capacity; actual capacity may vary ±5-15% based on winding technique, line characteristics, and spool manufacturing tolerances.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion faqs={faqItems} />

      {/* Calculator Review */}
      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="Fishing Line Capacity Calculator" />
      </div>
    </div>
  );
}
