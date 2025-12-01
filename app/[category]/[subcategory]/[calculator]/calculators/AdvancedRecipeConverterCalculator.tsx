'use client';

import React, { useState, useRef } from 'react';
import { Calculator, Scale, Beaker, ChefHat, ArrowRightLeft, Info, Lightbulb, CheckCircle, RefreshCw, X, Check, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Calculator as CalcIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type ConversionMode = 'volume-to-volume' | 'weight-to-weight' | 'volume-to-weight' | 'weight-to-volume' | 'recipe-scaling';
type VolumeUnit = 'cups' | 'tbsp' | 'tsp' | 'ml' | 'fl-oz' | 'liters' | 'gallons' | 'pints' | 'quarts';
type WeightUnit = 'grams' | 'ounces' | 'pounds' | 'kg';

// Ingredient density data (grams per cup)
const ingredientDensities: { [key: string]: number } = {
  'all-purpose-flour': 125,
  'bread-flour': 127,
  'cake-flour': 114,
  'whole-wheat-flour': 120,
  'granulated-sugar': 200,
  'brown-sugar': 220,
  'powdered-sugar': 120,
  'butter': 227,
  'oil': 224,
  'water': 237,
  'milk': 245,
  'honey': 340,
  'corn-syrup': 312,
  'cocoa-powder': 85,
  'rolled-oats': 90,
  'rice-uncooked': 185,
  'chocolate-chips': 170,
  'nuts-chopped': 120,
  'peanut-butter': 258,
  'yogurt': 245,
  'sour-cream': 230,
  'cream-cheese': 232,
  'almond-flour': 96,
  'coconut-flour': 112,
  'baking-powder': 192,
  'baking-soda': 220,
  'salt': 292,
  'yeast-active-dry': 128,
};

const ingredientLabels: { [key: string]: string } = {
  'all-purpose-flour': 'All-Purpose Flour',
  'bread-flour': 'Bread Flour',
  'cake-flour': 'Cake Flour',
  'whole-wheat-flour': 'Whole Wheat Flour',
  'granulated-sugar': 'Granulated Sugar',
  'brown-sugar': 'Brown Sugar (packed)',
  'powdered-sugar': 'Powdered Sugar',
  'butter': 'Butter',
  'oil': 'Vegetable/Canola Oil',
  'water': 'Water',
  'milk': 'Milk',
  'honey': 'Honey',
  'corn-syrup': 'Corn Syrup',
  'cocoa-powder': 'Cocoa Powder',
  'rolled-oats': 'Rolled Oats',
  'rice-uncooked': 'Rice (Uncooked)',
  'chocolate-chips': 'Chocolate Chips',
  'nuts-chopped': 'Nuts (Chopped)',
  'peanut-butter': 'Peanut Butter',
  'yogurt': 'Yogurt',
  'sour-cream': 'Sour Cream',
  'cream-cheese': 'Cream Cheese',
  'almond-flour': 'Almond Flour',
  'coconut-flour': 'Coconut Flour',
  'baking-powder': 'Baking Powder',
  'baking-soda': 'Baking Soda',
  'salt': 'Salt',
  'yeast-active-dry': 'Active Dry Yeast',
};

interface ConversionInputs {
  conversionMode: ConversionMode;
  inputValue: string;
  fromUnit: VolumeUnit;
  toUnit: VolumeUnit;
  fromWeightUnit: WeightUnit;
  toWeightUnit: WeightUnit;
  selectedIngredient: string;
  originalServings: string;
  desiredServings: string;

  // Advanced options
  measurementSystem: 'metric' | 'imperial';
  precision: 'low' | 'medium' | 'high';
  roundingPreference: 'exact' | 'practical' | 'fractional';
}

interface ConversionResult {
  value: number;
  unit: string;
  formula: string;
  conversionType: string;
  quickReference: { from: string; to: string; value: string }[];
  tips: string[];
  alternativeConversions?: { unit: string; value: number }[];
  scalingFactor?: number;
  originalServings?: number;
  desiredServings?: number;
}

export default function AdvancedRecipeConverterCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [inputs, setInputs] = useState<ConversionInputs>({
    conversionMode: 'volume-to-volume',
    inputValue: '1',
    fromUnit: 'cups',
    toUnit: 'ml',
    fromWeightUnit: 'grams',
    toWeightUnit: 'ounces',
    selectedIngredient: 'all-purpose-flour',
    originalServings: '4',
    desiredServings: '8',
    measurementSystem: 'imperial',
    precision: 'medium',
    roundingPreference: 'practical',
  });

  const [result, setResult] = useState<ConversionResult | null>(null);

  // Volume conversion factors (to milliliters)
  const volumeToMl: { [key in VolumeUnit]: number } = {
    'cups': 236.588,
    'tbsp': 14.787,
    'tsp': 4.929,
    'ml': 1,
    'fl-oz': 29.574,
    'liters': 1000,
    'gallons': 3785.41,
    'pints': 473.176,
    'quarts': 946.353,
  };

  // Weight conversion factors (to grams)
  const weightToGrams: { [key in WeightUnit]: number } = {
    'grams': 1,
    'ounces': 28.3495,
    'pounds': 453.592,
    'kg': 1000,
  };

  const getUnitLabel = (unit: VolumeUnit | WeightUnit): string => {
    const labels: { [key: string]: string } = {
      'cups': 'Cups',
      'tbsp': 'Tablespoons',
      'tsp': 'Teaspoons',
      'ml': 'Milliliters',
      'fl-oz': 'Fluid Ounces',
      'liters': 'Liters',
      'gallons': 'Gallons',
      'pints': 'Pints',
      'quarts': 'Quarts',
      'grams': 'Grams',
      'ounces': 'Ounces',
      'pounds': 'Pounds',
      'kg': 'Kilograms',
    };
    return labels[unit] || unit;
  };

  const formatValue = (value: number, rounding: string): string => {
    if (rounding === 'exact') {
      return value.toFixed(4);
    } else if (rounding === 'practical') {
      if (value >= 100) return value.toFixed(0);
      if (value >= 10) return value.toFixed(1);
      if (value >= 1) return value.toFixed(2);
      return value.toFixed(3);
    } else {
      // fractional - convert to common fractions
      const wholeNumber = Math.floor(value);
      const decimal = value - wholeNumber;

      if (decimal < 0.03) return wholeNumber.toString();
      if (Math.abs(decimal - 0.125) < 0.03) return `${wholeNumber} ⅛`;
      if (Math.abs(decimal - 0.25) < 0.03) return `${wholeNumber} ¼`;
      if (Math.abs(decimal - 0.333) < 0.03) return `${wholeNumber} ⅓`;
      if (Math.abs(decimal - 0.5) < 0.03) return `${wholeNumber} ½`;
      if (Math.abs(decimal - 0.666) < 0.03) return `${wholeNumber} ⅔`;
      if (Math.abs(decimal - 0.75) < 0.03) return `${wholeNumber} ¾`;

      return value.toFixed(2);
    }
  };

  const convertVolume = (value: number, from: VolumeUnit, to: VolumeUnit): ConversionResult => {
    const mlValue = value * volumeToMl[from];
    const convertedValue = mlValue / volumeToMl[to];

    const tips: string[] = [];
    tips.push('Volume measurements work for liquids and can vary for dry ingredients');
    tips.push('For precision baking, consider using weight measurements');
    tips.push('1 cup = 16 tablespoons = 48 teaspoons (US measurements)');

    const quickReference = [
      { from: '1 cup', to: '16 tbsp', value: '16 tablespoons' },
      { from: '1 cup', to: '237 ml', value: '~237 milliliters' },
      { from: '1 tbsp', to: '3 tsp', value: '3 teaspoons' },
      { from: '1 cup', to: '8 fl oz', value: '8 fluid ounces' },
    ];

    const alternativeConversions = [
      { unit: 'Tablespoons', value: mlValue / volumeToMl['tbsp'] },
      { unit: 'Teaspoons', value: mlValue / volumeToMl['tsp'] },
      { unit: 'Milliliters', value: mlValue },
      { unit: 'Fluid Ounces', value: mlValue / volumeToMl['fl-oz'] },
    ].filter(alt => alt.unit !== getUnitLabel(to));

    return {
      value: convertedValue,
      unit: getUnitLabel(to),
      formula: `${value} ${getUnitLabel(from)} = ${mlValue.toFixed(2)} ml = ${convertedValue.toFixed(4)} ${getUnitLabel(to)}`,
      conversionType: 'Volume to Volume',
      quickReference,
      tips,
      alternativeConversions,
    };
  };

  const convertWeight = (value: number, from: WeightUnit, to: WeightUnit): ConversionResult => {
    const gramsValue = value * weightToGrams[from];
    const convertedValue = gramsValue / weightToGrams[to];

    const tips: string[] = [];
    tips.push('Weight measurements provide the most accuracy for baking');
    tips.push('Use a digital kitchen scale for best results');
    tips.push('Professional bakers measure ingredients by weight, not volume');

    const quickReference = [
      { from: '1 oz', to: '28.35 g', value: '28.35 grams' },
      { from: '1 lb', to: '454 g', value: '454 grams' },
      { from: '1 kg', to: '2.2 lb', value: '2.2 pounds' },
      { from: '100 g', to: '3.5 oz', value: '3.5 ounces' },
    ];

    const alternativeConversions = [
      { unit: 'Grams', value: gramsValue },
      { unit: 'Ounces', value: gramsValue / weightToGrams['ounces'] },
      { unit: 'Pounds', value: gramsValue / weightToGrams['pounds'] },
      { unit: 'Kilograms', value: gramsValue / weightToGrams['kg'] },
    ].filter(alt => alt.unit !== getUnitLabel(to));

    return {
      value: convertedValue,
      unit: getUnitLabel(to),
      formula: `${value} ${getUnitLabel(from)} = ${gramsValue.toFixed(2)} g = ${convertedValue.toFixed(4)} ${getUnitLabel(to)}`,
      conversionType: 'Weight to Weight',
      quickReference,
      tips,
      alternativeConversions,
    };
  };

  const convertVolumeToWeight = (value: number, volumeUnit: VolumeUnit, weightUnit: WeightUnit, ingredient: string): ConversionResult => {
    const mlValue = value * volumeToMl[volumeUnit];
    const cupsValue = mlValue / volumeToMl['cups'];
    const densityPerCup = ingredientDensities[ingredient];
    const gramsValue = cupsValue * densityPerCup;
    const convertedValue = gramsValue / weightToGrams[weightUnit];

    const tips: string[] = [];
    tips.push(`Conversion based on ${ingredientLabels[ingredient]} density: ${densityPerCup}g per cup`);
    tips.push('Different brands and conditions may slightly affect density');
    tips.push('For flour, use the "spoon and level" method for volume measurements');

    const quickReference = [
      { from: '1 cup flour', to: '125 g', value: '125 grams (all-purpose)' },
      { from: '1 cup sugar', to: '200 g', value: '200 grams (granulated)' },
      { from: '1 cup butter', to: '227 g', value: '227 grams (2 sticks)' },
      { from: '1 cup water', to: '237 g', value: '237 grams' },
    ];

    return {
      value: convertedValue,
      unit: getUnitLabel(weightUnit),
      formula: `${value} ${getUnitLabel(volumeUnit)} → ${cupsValue.toFixed(4)} cups × ${densityPerCup}g/cup = ${gramsValue.toFixed(2)}g = ${convertedValue.toFixed(4)} ${getUnitLabel(weightUnit)}`,
      conversionType: `Volume to Weight (${ingredientLabels[ingredient]})`,
      quickReference,
      tips,
    };
  };

  const convertWeightToVolume = (value: number, weightUnit: WeightUnit, volumeUnit: VolumeUnit, ingredient: string): ConversionResult => {
    const gramsValue = value * weightToGrams[weightUnit];
    const densityPerCup = ingredientDensities[ingredient];
    const cupsValue = gramsValue / densityPerCup;
    const mlValue = cupsValue * volumeToMl['cups'];
    const convertedValue = mlValue / volumeToMl[volumeUnit];

    const tips: string[] = [];
    tips.push(`Conversion based on ${ingredientLabels[ingredient]} density: ${densityPerCup}g per cup`);
    tips.push('Weight to volume conversions are ingredient-specific');
    tips.push('Use proper measuring technique when measuring by volume');

    const quickReference = [
      { from: '125 g flour', to: '1 cup', value: '1 cup (all-purpose)' },
      { from: '200 g sugar', to: '1 cup', value: '1 cup (granulated)' },
      { from: '227 g butter', to: '1 cup', value: '1 cup (2 sticks)' },
      { from: '237 g water', to: '1 cup', value: '1 cup' },
    ];

    return {
      value: convertedValue,
      unit: getUnitLabel(volumeUnit),
      formula: `${value} ${getUnitLabel(weightUnit)} = ${gramsValue.toFixed(2)}g ÷ ${densityPerCup}g/cup = ${cupsValue.toFixed(4)} cups = ${convertedValue.toFixed(4)} ${getUnitLabel(volumeUnit)}`,
      conversionType: `Weight to Volume (${ingredientLabels[ingredient]})`,
      quickReference,
      tips,
    };
  };

  const scaleRecipe = (originalServings: number, desiredServings: number): ConversionResult => {
    const scalingFactor = desiredServings / originalServings;

    const tips: string[] = [];
    tips.push(`Multiply all ingredient amounts by ${scalingFactor.toFixed(4)}`);
    tips.push('Baking times may need adjustment for different quantities');
    tips.push('Pan size matters - double batches may need two pans');
    tips.push('Seasonings may not need to scale proportionally - adjust to taste');

    const quickReference = [
      { from: '2 cups flour', to: `${(2 * scalingFactor).toFixed(2)} cups`, value: `${(2 * scalingFactor).toFixed(2)} cups flour` },
      { from: '1 tsp salt', to: `${(1 * scalingFactor).toFixed(2)} tsp`, value: `${(1 * scalingFactor).toFixed(2)} tsp salt` },
      { from: '3 eggs', to: `${Math.round(3 * scalingFactor)} eggs`, value: `${Math.round(3 * scalingFactor)} eggs` },
    ];

    return {
      value: scalingFactor,
      unit: 'x multiplier',
      formula: `${desiredServings} servings ÷ ${originalServings} servings = ${scalingFactor.toFixed(4)}× scaling factor`,
      conversionType: 'Recipe Scaling',
      quickReference,
      tips,
      scalingFactor,
      originalServings,
      desiredServings,
    };
  };

  const calculateConversion = () => {
    const value = parseFloat(inputs.inputValue);

    if (inputs.conversionMode !== 'recipe-scaling' && (isNaN(value) || value <= 0)) {
      alert('Please enter a valid positive number');
      return;
    }

    let calculatedResult: ConversionResult | null = null;

    switch (inputs.conversionMode) {
      case 'volume-to-volume':
        calculatedResult = convertVolume(value, inputs.fromUnit, inputs.toUnit);
        break;
      case 'weight-to-weight':
        calculatedResult = convertWeight(value, inputs.fromWeightUnit, inputs.toWeightUnit);
        break;
      case 'volume-to-weight':
        calculatedResult = convertVolumeToWeight(value, inputs.fromUnit, inputs.toWeightUnit, inputs.selectedIngredient);
        break;
      case 'weight-to-volume':
        calculatedResult = convertWeightToVolume(value, inputs.fromWeightUnit, inputs.toUnit, inputs.selectedIngredient);
        break;
      case 'recipe-scaling':
        const origServings = parseFloat(inputs.originalServings);
        const desServings = parseFloat(inputs.desiredServings);

        if (isNaN(origServings) || isNaN(desServings) || origServings <= 0 || desServings <= 0) {
          alert('Please enter valid positive numbers for servings');
          return;
        }

        calculatedResult = scaleRecipe(origServings, desServings);
        break;
    }

    setResult(calculatedResult);
    setShowModal(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleInputChange = (field: keyof ConversionInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const resetCalculator = () => {
    setInputs({
      conversionMode: 'volume-to-volume',
      inputValue: '1',
      fromUnit: 'cups',
      toUnit: 'ml',
      fromWeightUnit: 'grams',
      toWeightUnit: 'ounces',
      selectedIngredient: 'all-purpose-flour',
      originalServings: '4',
      desiredServings: '8',
      measurementSystem: 'imperial',
      precision: 'medium',
      roundingPreference: 'practical',
    });
    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: "How many tablespoons are in a cup?",
      answer: "There are 16 tablespoons in 1 cup. This is a standard conversion in US cooking measurements. To convert cups to tablespoons, multiply by 16. For example, 1/2 cup = 8 tablespoons, 1/4 cup = 4 tablespoons."
    },
    {
      question: "How many grams are in a cup of flour?",
      answer: "1 cup of all-purpose flour weighs approximately 125 grams. However, this can vary depending on the type of flour: bread flour is about 127g per cup, cake flour is about 114g per cup, and whole wheat flour is about 120g per cup. For the most accurate results, it's best to weigh flour rather than measure by volume."
    },
    {
      question: "Why do ingredient conversions vary by type?",
      answer: "Different ingredients have different densities, which means they weigh different amounts even when measured in the same volume. For example, 1 cup of granulated sugar weighs 200g, while 1 cup of flour weighs only 125g. This is why professional bakers often prefer weight measurements over volume measurements for consistency."
    },
    {
      question: "How do I convert a recipe from metric to imperial measurements?",
      answer: "To convert from metric to imperial: 1) For liquids, remember that 240ml ≈ 1 cup, 15ml ≈ 1 tablespoon. 2) For weights, 28.35g ≈ 1 ounce, 454g ≈ 1 pound. 3) Use our calculator's conversion modes to get precise conversions for your specific ingredients and measurements."
    },
    {
      question: "How accurate are volume-to-weight conversions for baking?",
      answer: "Volume-to-weight conversions provide good estimates but can vary by 5-10% depending on how ingredients are measured (scooped vs. spooned, packed vs. loose). For professional or precise baking, use a kitchen scale and measure by weight. Our calculator uses standard conversion factors from reputable culinary sources."
    },
    {
      question: "What's the difference between fluid ounces and weight ounces?",
      answer: "Fluid ounces (fl oz) measure volume, while ounces (oz) measure weight. They are only equal for water (1 fl oz of water weighs approximately 1 oz). For other ingredients, the relationship varies by density. For example, 1 fl oz of honey weighs about 1.5 oz because honey is denser than water."
    },
    {
      question: "How do I scale a recipe for more or fewer servings?",
      answer: "Use our Recipe Scaling mode: enter the original number of servings and your desired number of servings. The calculator provides a scaling factor. Multiply all ingredient amounts in the recipe by this factor. For example, if scaling from 4 to 6 servings, the factor is 1.5, so 2 cups of flour becomes 3 cups."
    },
    {
      question: "Can I convert between different flour types using the same measurements?",
      answer: "Different flour types have different weights per cup, so direct substitution may not work for all recipes. All-purpose flour: 125g/cup, bread flour: 127g/cup, cake flour: 114g/cup, almond flour: 96g/cup. When substituting, it's best to convert by weight rather than volume for consistent results."
    },
    {
      question: "How many teaspoons are in a tablespoon?",
      answer: "There are 3 teaspoons in 1 tablespoon. This is a standard conversion: 1 tbsp = 3 tsp = 15ml (approximately). This conversion is useful when a recipe calls for a measurement you don't have a measuring spoon for."
    },
    {
      question: "Why do some recipes use weight measurements instead of volume?",
      answer: "Weight measurements are more accurate and consistent than volume measurements, especially for baking. Factors like how you scoop flour or pack brown sugar can significantly affect volume measurements but not weight. Professional bakers and many international recipes use weight (grams) for precision and repeatability."
    },
    {
      question: "How do I measure sticky ingredients like honey or peanut butter?",
      answer: "For sticky ingredients, spray your measuring cup with cooking spray or coat with a little oil first - the ingredient will slide out more easily. Our calculator can convert both volume and weight measurements for sticky ingredients. 1 cup of honey weighs about 340g, and 1 cup of peanut butter weighs about 258g."
    },
    {
      question: "What's the best way to measure flour accurately?",
      answer: "The most accurate method is to weigh flour using a kitchen scale (125g = 1 cup all-purpose flour). If measuring by volume, use the 'spoon and level' method: stir the flour, spoon it into the measuring cup without packing, and level off with a straight edge. Never scoop directly from the bag as this compacts the flour and can add 25-30% more than intended."
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recipe Converter Calculator</h2>
            <p className="text-muted-foreground">Convert measurements and scale recipes with precision</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode ? 'Advanced options including measurement systems, precision control, and rounding preferences' : 'Quick conversions with essential inputs only'}
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

        <div className="space-y-6">
          {/* Conversion Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Conversion Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => handleInputChange('conversionMode', 'volume-to-volume')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  inputs.conversionMode === 'volume-to-volume'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Beaker className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Volume to Volume</span>
                </div>
                <p className="text-xs text-muted-foreground">Cups, tbsp, ml, etc.</p>
              </button>

              <button
                onClick={() => handleInputChange('conversionMode', 'weight-to-weight')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  inputs.conversionMode === 'weight-to-weight'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Weight to Weight</span>
                </div>
                <p className="text-xs text-muted-foreground">Grams, ounces, pounds</p>
              </button>

              <button
                onClick={() => handleInputChange('conversionMode', 'volume-to-weight')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  inputs.conversionMode === 'volume-to-weight'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Volume to Weight</span>
                </div>
                <p className="text-xs text-muted-foreground">Cups to grams, etc.</p>
              </button>

              <button
                onClick={() => handleInputChange('conversionMode', 'weight-to-volume')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  inputs.conversionMode === 'weight-to-volume'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Weight to Volume</span>
                </div>
                <p className="text-xs text-muted-foreground">Grams to cups, etc.</p>
              </button>

              <button
                onClick={() => handleInputChange('conversionMode', 'recipe-scaling')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  inputs.conversionMode === 'recipe-scaling'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ChefHat className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Recipe Scaling</span>
                </div>
                <p className="text-xs text-muted-foreground">Adjust serving sizes</p>
              </button>
            </div>
          </div>

          {/* Input Fields Based on Mode */}
          {inputs.conversionMode === 'volume-to-volume' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  value={inputs.inputValue}
                  onChange={(e) => handleInputChange('inputValue', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Unit *
                </label>
                <select
                  value={inputs.fromUnit}
                  onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cups">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="fl-oz">Fluid Ounces</option>
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                  <option value="pints">Pints</option>
                  <option value="quarts">Quarts</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Unit *
                </label>
                <select
                  value={inputs.toUnit}
                  onChange={(e) => handleInputChange('toUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cups">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="fl-oz">Fluid Ounces</option>
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                  <option value="pints">Pints</option>
                  <option value="quarts">Quarts</option>
                </select>
              </div>
            </div>
          )}

          {inputs.conversionMode === 'weight-to-weight' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  value={inputs.inputValue}
                  onChange={(e) => handleInputChange('inputValue', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Unit *
                </label>
                <select
                  value={inputs.fromWeightUnit}
                  onChange={(e) => handleInputChange('fromWeightUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="grams">Grams (g)</option>
                  <option value="ounces">Ounces (oz)</option>
                  <option value="pounds">Pounds (lb)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Unit *
                </label>
                <select
                  value={inputs.toWeightUnit}
                  onChange={(e) => handleInputChange('toWeightUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="grams">Grams (g)</option>
                  <option value="ounces">Ounces (oz)</option>
                  <option value="pounds">Pounds (lb)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>
            </div>
          )}

          {inputs.conversionMode === 'volume-to-weight' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={inputs.inputValue}
                    onChange={(e) => handleInputChange('inputValue', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Volume Unit *
                  </label>
                  <select
                    value={inputs.fromUnit}
                    onChange={(e) => handleInputChange('fromUnit', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="cups">Cups</option>
                    <option value="tbsp">Tablespoons</option>
                    <option value="tsp">Teaspoons</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="fl-oz">Fluid Ounces</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ingredient Type *
                </label>
                <select
                  value={inputs.selectedIngredient}
                  onChange={(e) => handleInputChange('selectedIngredient', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <optgroup label="Flours">
                    <option value="all-purpose-flour">{ingredientLabels['all-purpose-flour']}</option>
                    <option value="bread-flour">{ingredientLabels['bread-flour']}</option>
                    <option value="cake-flour">{ingredientLabels['cake-flour']}</option>
                    <option value="whole-wheat-flour">{ingredientLabels['whole-wheat-flour']}</option>
                    <option value="almond-flour">{ingredientLabels['almond-flour']}</option>
                    <option value="coconut-flour">{ingredientLabels['coconut-flour']}</option>
                  </optgroup>
                  <optgroup label="Sugars & Sweeteners">
                    <option value="granulated-sugar">{ingredientLabels['granulated-sugar']}</option>
                    <option value="brown-sugar">{ingredientLabels['brown-sugar']}</option>
                    <option value="powdered-sugar">{ingredientLabels['powdered-sugar']}</option>
                    <option value="honey">{ingredientLabels['honey']}</option>
                    <option value="corn-syrup">{ingredientLabels['corn-syrup']}</option>
                  </optgroup>
                  <optgroup label="Fats & Oils">
                    <option value="butter">{ingredientLabels['butter']}</option>
                    <option value="oil">{ingredientLabels['oil']}</option>
                    <option value="peanut-butter">{ingredientLabels['peanut-butter']}</option>
                  </optgroup>
                  <optgroup label="Liquids">
                    <option value="water">{ingredientLabels['water']}</option>
                    <option value="milk">{ingredientLabels['milk']}</option>
                  </optgroup>
                  <optgroup label="Dairy">
                    <option value="yogurt">{ingredientLabels['yogurt']}</option>
                    <option value="sour-cream">{ingredientLabels['sour-cream']}</option>
                    <option value="cream-cheese">{ingredientLabels['cream-cheese']}</option>
                  </optgroup>
                  <optgroup label="Baking Ingredients">
                    <option value="cocoa-powder">{ingredientLabels['cocoa-powder']}</option>
                    <option value="baking-powder">{ingredientLabels['baking-powder']}</option>
                    <option value="baking-soda">{ingredientLabels['baking-soda']}</option>
                    <option value="yeast-active-dry">{ingredientLabels['yeast-active-dry']}</option>
                  </optgroup>
                  <optgroup label="Other Ingredients">
                    <option value="rolled-oats">{ingredientLabels['rolled-oats']}</option>
                    <option value="rice-uncooked">{ingredientLabels['rice-uncooked']}</option>
                    <option value="chocolate-chips">{ingredientLabels['chocolate-chips']}</option>
                    <option value="nuts-chopped">{ingredientLabels['nuts-chopped']}</option>
                    <option value="salt">{ingredientLabels['salt']}</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Weight Unit *
                </label>
                <select
                  value={inputs.toWeightUnit}
                  onChange={(e) => handleInputChange('toWeightUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="grams">Grams (g)</option>
                  <option value="ounces">Ounces (oz)</option>
                  <option value="pounds">Pounds (lb)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>
            </div>
          )}

          {inputs.conversionMode === 'weight-to-volume' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={inputs.inputValue}
                    onChange={(e) => handleInputChange('inputValue', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Weight Unit *
                  </label>
                  <select
                    value={inputs.fromWeightUnit}
                    onChange={(e) => handleInputChange('fromWeightUnit', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="grams">Grams (g)</option>
                    <option value="ounces">Ounces (oz)</option>
                    <option value="pounds">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ingredient Type *
                </label>
                <select
                  value={inputs.selectedIngredient}
                  onChange={(e) => handleInputChange('selectedIngredient', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <optgroup label="Flours">
                    <option value="all-purpose-flour">{ingredientLabels['all-purpose-flour']}</option>
                    <option value="bread-flour">{ingredientLabels['bread-flour']}</option>
                    <option value="cake-flour">{ingredientLabels['cake-flour']}</option>
                    <option value="whole-wheat-flour">{ingredientLabels['whole-wheat-flour']}</option>
                    <option value="almond-flour">{ingredientLabels['almond-flour']}</option>
                    <option value="coconut-flour">{ingredientLabels['coconut-flour']}</option>
                  </optgroup>
                  <optgroup label="Sugars & Sweeteners">
                    <option value="granulated-sugar">{ingredientLabels['granulated-sugar']}</option>
                    <option value="brown-sugar">{ingredientLabels['brown-sugar']}</option>
                    <option value="powdered-sugar">{ingredientLabels['powdered-sugar']}</option>
                    <option value="honey">{ingredientLabels['honey']}</option>
                    <option value="corn-syrup">{ingredientLabels['corn-syrup']}</option>
                  </optgroup>
                  <optgroup label="Fats & Oils">
                    <option value="butter">{ingredientLabels['butter']}</option>
                    <option value="oil">{ingredientLabels['oil']}</option>
                    <option value="peanut-butter">{ingredientLabels['peanut-butter']}</option>
                  </optgroup>
                  <optgroup label="Liquids">
                    <option value="water">{ingredientLabels['water']}</option>
                    <option value="milk">{ingredientLabels['milk']}</option>
                  </optgroup>
                  <optgroup label="Dairy">
                    <option value="yogurt">{ingredientLabels['yogurt']}</option>
                    <option value="sour-cream">{ingredientLabels['sour-cream']}</option>
                    <option value="cream-cheese">{ingredientLabels['cream-cheese']}</option>
                  </optgroup>
                  <optgroup label="Baking Ingredients">
                    <option value="cocoa-powder">{ingredientLabels['cocoa-powder']}</option>
                    <option value="baking-powder">{ingredientLabels['baking-powder']}</option>
                    <option value="baking-soda">{ingredientLabels['baking-soda']}</option>
                    <option value="yeast-active-dry">{ingredientLabels['yeast-active-dry']}</option>
                  </optgroup>
                  <optgroup label="Other Ingredients">
                    <option value="rolled-oats">{ingredientLabels['rolled-oats']}</option>
                    <option value="rice-uncooked">{ingredientLabels['rice-uncooked']}</option>
                    <option value="chocolate-chips">{ingredientLabels['chocolate-chips']}</option>
                    <option value="nuts-chopped">{ingredientLabels['nuts-chopped']}</option>
                    <option value="salt">{ingredientLabels['salt']}</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Volume Unit *
                </label>
                <select
                  value={inputs.toUnit}
                  onChange={(e) => handleInputChange('toUnit', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cups">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="fl-oz">Fluid Ounces</option>
                </select>
              </div>
            </div>
          )}

          {inputs.conversionMode === 'recipe-scaling' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Original Servings *
                </label>
                <input
                  type="number"
                  value={inputs.originalServings}
                  onChange={(e) => handleInputChange('originalServings', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter original servings"
                  min="1"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Desired Servings *
                </label>
                <input
                  type="number"
                  value={inputs.desiredServings}
                  onChange={(e) => handleInputChange('desiredServings', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter desired servings"
                  min="1"
                  step="1"
                />
              </div>
            </div>
          )}

          {/* Advanced Mode Fields */}
          {isAdvancedMode && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Measurement System
                  </label>
                  <select
                    value={inputs.measurementSystem}
                    onChange={(e) => handleInputChange('measurementSystem', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="imperial">Imperial (US)</option>
                    <option value="metric">Metric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precision Level
                  </label>
                  <select
                    value={inputs.precision}
                    onChange={(e) => handleInputChange('precision', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low (1 decimal)</option>
                    <option value="medium">Medium (2-3 decimals)</option>
                    <option value="high">High (4 decimals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rounding Preference
                  </label>
                  <select
                    value={inputs.roundingPreference}
                    onChange={(e) => handleInputChange('roundingPreference', e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="exact">Exact (4 decimals)</option>
                    <option value="practical">Practical (smart rounding)</option>
                    <option value="fractional">Fractional (½, ¼, ⅓)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={calculateConversion}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
          >
            <Calculator className="h-5 w-5" />
            Convert
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Conversion Results
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Main Result */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h4 className="text-xl font-bold text-foreground">{result.conversionType}</h4>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Converted Value</div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {formatValue(result.value, inputs.roundingPreference)}
                  </div>
                  <div className="text-lg text-muted-foreground">{result.unit}</div>
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <div className="text-sm font-medium text-foreground mb-2">Conversion Formula:</div>
                    <div className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded">
                      {result.formula}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Conversions */}
              {result.alternativeConversions && result.alternativeConversions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">Alternative Conversions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {result.alternativeConversions.map((alt, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">{alt.unit}</div>
                        <div className="text-lg font-bold text-blue-600">{formatValue(alt.value, inputs.roundingPreference)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">Quick Reference Conversions</h4>
                <div className="space-y-2">
                  {result.quickReference.map((ref, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{ref.from} = {ref.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">Pro Tips</h4>
                <div className="space-y-2">
                  {result.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

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

      {/* Full Results Section */}
      {result && (
        <div ref={resultsRef} className="bg-background border rounded-xl p-6 shadow-sm border-green-500">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-2xl font-bold text-foreground">Complete Conversion Analysis</h3>
              <p className="text-muted-foreground">{result.conversionType}</p>
            </div>
          </div>

          {/* Main Result Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Converted Value</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{formatValue(result.value, inputs.roundingPreference)}</p>
              <p className="text-lg text-muted-foreground">{result.unit}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Conversion Formula</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {result.formula}
              </p>
            </div>
          </div>

          {/* Alternative Conversions */}
          {result.alternativeConversions && result.alternativeConversions.length > 0 && (
            <div className="bg-muted/30 p-5 rounded-lg mb-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Alternative Conversions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.alternativeConversions.map((alt, index) => (
                  <div key={index} className="bg-background p-3 rounded border">
                    <p className="text-xs text-muted-foreground mb-1">{alt.unit}</p>
                    <p className="text-lg font-bold text-foreground">{formatValue(alt.value, inputs.roundingPreference)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Reference */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Quick Reference Conversions
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.quickReference.map((ref, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{ref.from} = {ref.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Pro Tips for Accurate Measurements
            </h4>
            <ul className="space-y-2">
              {result.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Reference Guide */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Reference Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">From</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">To</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">1 Cup</td>
                <td className="py-3 px-4 text-muted-foreground">Tablespoons</td>
                <td className="py-3 px-4">16 tbsp</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">1 Cup</td>
                <td className="py-3 px-4 text-muted-foreground">Milliliters</td>
                <td className="py-3 px-4">237 ml (approx)</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">1 Tablespoon</td>
                <td className="py-3 px-4 text-muted-foreground">Teaspoons</td>
                <td className="py-3 px-4">3 tsp</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">1 Ounce (weight)</td>
                <td className="py-3 px-4 text-muted-foreground">Grams</td>
                <td className="py-3 px-4">28.35 g</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">1 Cup Flour</td>
                <td className="py-3 px-4 text-muted-foreground">Grams</td>
                <td className="py-3 px-4">125 g (all-purpose)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8 mb-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Convert recipe measurements between cups, tablespoons, grams, ounces, and more with precision.
          Scale recipes for different serving sizes using ingredient-specific densities for 28+ common cooking ingredients.
          Perfect for international recipes, baking conversions, and precise cooking measurements. Free recipe conversion tool
          with volume-to-weight conversions, weight-to-volume conversions, and recipe scaling calculator.
        </p>
      </div>

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Online Recipe Converter Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Choose Your Conversion Type</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Select from <strong>Volume to Volume</strong> (cups to ml), <strong>Weight to Weight</strong> (grams to ounces),
                <strong>Volume to Weight</strong> (cups to grams), <strong>Weight to Volume</strong> (grams to cups), or
                <strong>Recipe Scaling</strong> (adjust serving sizes). Each mode provides specialized conversions for your cooking needs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Your Measurement Values</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input the <strong>amount you want to convert</strong> and select the source and target units. For volume-weight conversions,
                choose the specific ingredient type from 28+ options including flours, sugars, fats, liquids, dairy, and baking ingredients.
                Each ingredient has its own density for accurate conversions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Select Advanced Options (Optional)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Switch to <strong>Advanced Mode</strong> for additional control: choose measurement system (imperial/metric),
                set precision level (low/medium/high), and select rounding preference (exact/practical/fractional).
                These options help match your recipe's format and your kitchen's measuring tools.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Calculate and Review Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click <strong>"Convert"</strong> to see instant results including the converted value, conversion formula,
                alternative conversions, quick reference guide, and pro tips. Results appear in both a popup modal and
                a detailed analysis section below for printing or reference.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Convert," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Precise Converted Value</h4>
                <p className="text-xs text-muted-foreground">Exact conversion with your chosen rounding preference (exact, practical, or fractional)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">🔢</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Conversion Formula</h4>
                <p className="text-xs text-muted-foreground">Step-by-step calculation showing how the conversion was performed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">📐</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Alternative Conversions</h4>
                <p className="text-xs text-muted-foreground">Same amount converted to multiple units for flexible recipe use</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Pro Tips & Quick Reference</h4>
                <p className="text-xs text-muted-foreground">Measurement best practices and common conversion quick reference</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">🍰 Precision Baking</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Ingredient-specific density conversions</li>
                <li>Weight measurements for consistency</li>
                <li>28+ common baking ingredients supported</li>
                <li>Professional baker accuracy standards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌍 International Recipes</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Convert between US and metric systems</li>
                <li>Handle European recipe formats</li>
                <li>Support for imperial measurements</li>
                <li>Multi-unit alternative conversions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">👨‍🍳 Recipe Scaling</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Adjust servings up or down precisely</li>
                <li>Maintain ingredient proportions</li>
                <li>Handle fractional scaling factors</li>
                <li>Guidance for pan size adjustments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🆓 Completely Free Tool</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>No registration or account required</li>
                <li>Unlimited conversions and calculations</li>
                <li>No ads or premium paywalls</li>
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
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">28+ Ingredients</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Accurate density-based conversions</p>
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
            Pro Tips for Accurate Conversions
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• For baking, use weight measurements (grams, ounces) instead of volume for better precision and consistency</li>
            <li>• Measure flour using the "spoon and level" method—never scoop directly from the bag as it compacts the flour</li>
            <li>• Different brands and humidity levels can affect ingredient density by 5-10%, so adjust as needed</li>
            <li>• When scaling recipes, baking times may need adjustment—double batches take longer, half batches cook faster</li>
            <li>• Seasonings often don't scale proportionally—when doubling a recipe, start with 1.5x the spices and adjust to taste</li>
            <li>• Use liquid measuring cups for liquids (with spout) and dry measuring cups for dry ingredients (flat rim for leveling)</li>
          </ul>
        </div>
      </div>

      {/* Understanding Recipe Conversions */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Recipe Conversions</h2>

        <div className="space-y-6">
          {/* Volume Measurements in Cooking */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📏 Volume Measurements in Cooking</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Volume measurements (cups, tablespoons, teaspoons, milliliters) are the most common way to measure ingredients
              in home cooking, especially in American recipes.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>US Customary System:</strong> Uses cups (8 fl oz), tablespoons (½ fl oz), and teaspoons (⅙ fl oz) as standard units
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Metric System:</strong> Uses milliliters (ml) and liters (L). One US cup equals approximately 236.588ml, often rounded to 240ml
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Volume Variability:</strong> Volume measurements are convenient for liquids but can vary significantly for dry ingredients
                  depending on how they're measured (scooped vs. spooned, packed vs. loose)—this is why professional bakers prefer weight
                </p>
              </div>
            </div>
          </div>

          {/* Weight Measurements and Their Importance */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">⚖️ Weight Measurements and Their Importance</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Weight measurements provide the most accurate and consistent way to measure ingredients, particularly for baking.
              Unlike volume, which varies based on packing, weight is always precise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Key Conversions</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 1 ounce = 28.3495 grams</li>
                  <li>• 1 pound = 453.592 grams</li>
                  <li>• 1 kilogram = 1,000 grams = 2.20462 pounds</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Why It Matters</h4>
                <p className="text-xs text-muted-foreground">
                  A cup of flour can vary from 110g to 155g depending on measuring technique—a 40% difference that dramatically affects baking results
                </p>
              </div>
            </div>
          </div>

          {/* Why Ingredient Density Matters */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">🎯 Why Ingredient Density Matters</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
              Different ingredients have vastly different densities. Converting between volume and weight requires knowing
              what ingredient you're measuring to ensure recipe success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">125g</div>
                <div className="text-xs text-muted-foreground">1 cup all-purpose flour</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">200g</div>
                <div className="text-xs text-muted-foreground">1 cup granulated sugar</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">340g</div>
                <div className="text-xs text-muted-foreground">1 cup honey</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Our Calculator Supports 28+ Ingredients</h4>
              <p className="text-xs text-muted-foreground">
                Established density values for flours (all-purpose, bread, cake, whole wheat, almond, coconut), sugars (granulated, brown, powdered),
                fats (butter, oil, peanut butter), liquids (water, milk), dairy products (yogurt, sour cream, cream cheese), and baking essentials
                (cocoa powder, baking powder, baking soda, yeast, salt)
              </p>
            </div>
          </div>

          {/* Common Volume Conversion Ratios */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">🔄 Common Volume Conversion Ratios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100 mb-3">US Customary System</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 cup</strong> = 16 tablespoons = 48 teaspoons
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 tablespoon</strong> = 3 teaspoons
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 fluid ounce</strong> = 2 tablespoons
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 quart</strong> = 4 cups (2 pints)
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100 mb-3">Metric & International</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 liter</strong> = 1,000 milliliters
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 cup US</strong> = 236.588ml (≈240ml)
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 imperial cup (UK)</strong> = 284ml (vs. 237ml US)
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
                    <strong>1 Australian tablespoon</strong> = 20ml (vs. 15ml US/UK)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Scaling Principles */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4">📊 Recipe Scaling Principles</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-4">
              Scaling involves multiplying all ingredient amounts by a scaling factor: <strong>desired servings ÷ original servings</strong>
            </p>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">⚠️ Special Considerations</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Yeast:</strong> Doesn't scale linearly—use slightly less than scaled amount (yeast multiplies exponentially)</li>
                  <li>• <strong>Baking Times:</strong> Larger quantities take longer, smaller quantities cook faster—check doneness visually</li>
                  <li>• <strong>Pan Size:</strong> Doubling a cake? Use two pans of original size, not one larger pan (maintains depth/time)</li>
                  <li>• <strong>Seasonings:</strong> Don't scale proportionally—when doubling, start with 1.5x spices and adjust to taste</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Flour Types and Their Conversions */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">🌾 Flour Types and Their Conversions</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
              Different flour types have different weights per cup due to protein content, particle size, and milling process.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">All-Purpose Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">125g/cup</div>
                <p className="text-xs text-muted-foreground">10-12% protein. Versatile for breads, cakes, pastries</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Bread Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">127g/cup</div>
                <p className="text-xs text-muted-foreground">12-14% protein. Chewier texture, better gluten</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Cake Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">114g/cup</div>
                <p className="text-xs text-muted-foreground">7-9% protein. Tender, delicate baked goods</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Whole Wheat Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">120g/cup</div>
                <p className="text-xs text-muted-foreground">Includes bran/germ. Nuttier flavor, needs more liquid</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Almond Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">96g/cup</div>
                <p className="text-xs text-muted-foreground">Lighter. Adds moisture and richness</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Coconut Flour</h4>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">112g/cup</div>
                <p className="text-xs text-muted-foreground">Very absorbent. Needs 2x liquid/eggs</p>
              </div>
            </div>
          </div>

          {/* Sugar and Sweetener Conversions */}
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4">🍯 Sugar and Sweetener Conversions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-sm text-pink-900 dark:text-pink-100 mb-3">Dry Sugars</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Granulated Sugar</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">200g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Baseline sweetness & structure</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Brown Sugar (packed)</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">220g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">3.5-6.5% molasses. Chewy texture</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Powdered Sugar</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">120g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Fine texture + 3-5% cornstarch</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-pink-900 dark:text-pink-100 mb-3">Liquid Sweeteners</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Honey</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">340g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">1.25x sweeter. Add ¼ tsp baking soda/cup</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Corn Syrup</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">312g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Doesn't crystallize. Ideal for candies</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Maple Syrup</span>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">322g/cup</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Distinct flavor. Best in dedicated recipes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">💡 Substitution Tips</h4>
              <p className="text-xs text-muted-foreground">
                When substituting liquid sweeteners for granulated sugar: reduce recipe liquid by 3-4 tbsp per cup of sweetener,
                and reduce oven temperature by 25°F to prevent over-browning
              </p>
            </div>
          </div>

          {/* Fats and Oils in Cooking Measurements */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">🧈 Fats and Oils in Cooking Measurements</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
              Fats are crucial for texture, moisture, and flavor. Accurate measurements and understanding substitutions are essential.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Butter</h4>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">227g/cup (113.5g/stick)</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 80% fat, 15-18% water, 1-2% milk solids</li>
                  <li>• US stick = ½ cup (8 tbsp)</li>
                  <li>• Softened = 65°F (pliable but cool)</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Vegetable/Canola Oil</h4>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">224g/cup</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 100% fat (no water content)</li>
                  <li>• Substitute: ¾ cup oil = 1 cup butter</li>
                  <li>• Better for moist cakes than cookies</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Peanut Butter</h4>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">258g/cup</div>
                <p className="text-xs text-muted-foreground">
                  Density varies: natural (oil separation) vs. commercial (emulsifiers)
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Coconut Oil</h4>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">218g/cup</div>
                <p className="text-xs text-muted-foreground">
                  Solid below 76°F. Behaves like butter when solid, oil when liquid
                </p>
              </div>
            </div>
          </div>

          {/* Liquid Measurements and Conversions */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4">💧 Liquid Measurements and Conversions</h3>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">Water</h4>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">237g/cup</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  At room temp (68-72°F). Very close to 240ml metric conversion (1ml water ≈ 1g at 4°C)
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">Milk (Whole)</h4>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">245g/cup</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  3.25% fat content, 8g protein/cup. Slightly denser than water due to fat, protein, lactose
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">Heavy Cream</h4>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">238g/cup</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  36-40% fat. Similar weight to water despite higher fat (less water content)
                </p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-800/30 p-3 rounded-lg border border-indigo-300 dark:border-indigo-700">
                <h4 className="font-medium text-sm mb-2">⚖️ Fluid Ounces vs. Weight Ounces</h4>
                <p className="text-xs text-muted-foreground">
                  <strong>Critical distinction:</strong> 8 fluid ounces of water weighs ~8 ounces, but 8 fluid ounces of honey weighs
                  ~12 ounces (1.4-1.5x denser). Always clarify whether recipes mean fluid oz (volume) or oz (weight)
                </p>
              </div>
            </div>
          </div>

          {/* Dairy Products and Their Measurements */}
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
            <h3 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-4">🥛 Dairy Products and Their Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Yogurt (Regular)</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">245g/cup</div>
                <p className="text-xs text-muted-foreground">Greek yogurt: 250-255g (thicker, strained whey)</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Sour Cream</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">230g/cup</div>
                <p className="text-xs text-muted-foreground">18-20% fat. Thick, tangy from fermentation</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Cream Cheese</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">232g/cup</div>
                <p className="text-xs text-muted-foreground">1 package = 8oz/227g (slightly less than cup)</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Ricotta Cheese</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">246g/cup</div>
                <p className="text-xs text-muted-foreground">Moist, soft, fine grainy texture</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Buttermilk</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">242g/cup</div>
                <p className="text-xs text-muted-foreground">Acidic. Activates baking soda in recipes</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Half-and-Half</h4>
                <div className="text-lg font-bold text-teal-600 dark:text-teal-400">242g/cup</div>
                <p className="text-xs text-muted-foreground">10-18% fat. Between milk and cream</p>
              </div>
            </div>
          </div>

          {/* Measuring Dry Ingredients Accurately */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">📐 Measuring Dry Ingredients Accurately</h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              Proper technique dramatically affects recipe success—the difference between a light, tender cake and a dense, dry one.
            </p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-sm mb-3">✅ The "Spoon and Level" Method (for flour)</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">1.</span>
                  <p className="text-xs text-muted-foreground">
                    <strong>Fluff:</strong> Stir flour with spoon to aerate it (flour settles and compacts during storage)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">2.</span>
                  <p className="text-xs text-muted-foreground">
                    <strong>Spoon:</strong> Gently spoon flour into measuring cup without packing or tapping
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">3.</span>
                  <p className="text-xs text-muted-foreground">
                    <strong>Level:</strong> Use straight edge (back of knife) to level off the top
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-lg border border-red-300 dark:border-red-700">
                <h4 className="font-medium text-sm mb-2">❌ Never Scoop Directly</h4>
                <p className="text-xs text-muted-foreground">
                  Scooping flour from bag with measuring cup compacts it, adding 25-30% more flour (30-40g extra per cup)—resulting in dry, tough baked goods
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-lg border border-green-300 dark:border-green-700">
                <h4 className="font-medium text-sm mb-2">✅ Exception: Brown Sugar</h4>
                <p className="text-xs text-muted-foreground">
                  "Packed" brown sugar means press firmly into cup until level—it should hold its shape when turned out (ensures consistent sweetness/moisture)
                </p>
              </div>
            </div>
          </div>

          {/* International Recipe Conversions */}
          <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-lg border border-violet-200 dark:border-violet-800">
            <h3 className="text-xl font-semibold text-violet-900 dark:text-violet-100 mb-4">🌍 International Recipe Conversions</h3>
            <p className="text-sm text-violet-800 dark:text-violet-200 mb-4">
              Cooking internationally means navigating different measurement systems and regional variations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-sm text-violet-900 dark:text-violet-100 mb-3">Cup Size Variations</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">US Cup</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">236ml (237ml)</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">Metric Cup</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">250ml</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">Imperial Cup (UK)</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">284ml</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">Japanese Cup</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">200ml</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-violet-900 dark:text-violet-100 mb-3">Tablespoon Variations</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">US/UK Tablespoon</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">15ml</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">Australian Tablespoon</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">20ml (33% more!)</span>
                  </div>
                </div>
                <h4 className="font-medium text-sm text-violet-900 dark:text-violet-100 mb-3 mt-4">Temperature Conversions</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">180°C</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">350°F</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-between">
                    <span className="text-xs font-medium">200°C</span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">400°F</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">🔤 Ingredient Naming Differences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>• Confectioners' sugar (US) = Icing sugar (UK)</div>
                <div>• Heavy cream (US) = Double cream (UK)</div>
                <div>• All-purpose flour (US) ≈ Plain flour (UK)</div>
                <div>• Cornstarch (US) = Cornflour (UK)</div>
                <div>• Cilantro (US) = Coriander (UK/AU)</div>
                <div>• Eggplant (US) = Aubergine (UK)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific References & Resources */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Scientific References & Resources</h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Culinary Standards Organizations</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.nist.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">National Institute of Standards and Technology (NIST)</a> - Official US measurement standards</li>
              <li>• <a href="https://www.fda.gov/food/nutrition-education-resources-materials/food-labeling-nutrition" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">FDA Food Labeling Standards</a> - Standard serving sizes and measurements</li>
              <li>• <a href="https://www.bipm.org/en/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">International Bureau of Weights and Measures</a> - International measurement standards (SI units)</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Professional Culinary Resources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">King Arthur Baking Company Ingredient Weight Chart</a> - Comprehensive ingredient densities</li>
              <li>• <a href="https://www.ift.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Institute of Food Technologists</a> - Food science research and standards</li>
              <li>• <a href="https://www.culinology.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Research Chefs Association</a> - Professional culinary science standards</li>
              <li>• <a href="https://www.seriouseats.com/how-to-measure-wet-dry-ingredients-for-baking-accurately-best-method" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Serious Eats Measurement Guide</a> - Evidence-based cooking techniques</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Academic and Scientific Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.sciencedirect.com/topics/food-science" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Food Science Research - ScienceDirect</a> - Peer-reviewed food science studies</li>
              <li>• <a href="https://www.usda.gov/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">USDA Food Composition Databases</a> - Official ingredient data and measurements</li>
              <li>• "On Food and Cooking" by Harold McGee - Definitive reference on food science and ingredient properties</li>
              <li>• "Ratio: The Simple Codes Behind the Craft of Everyday Cooking" by Michael Ruhlman - Professional ratio-based cooking</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Measurement Standards References</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.convert-me.com/en/convert/cooking/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Professional Cooking Conversion Standards</a> - Industry-standard conversion factors</li>
              <li>• "The Professional Chef" (Culinary Institute of America) - Professional culinary measurements and techniques</li>
              <li>• "Professional Cooking" by Wayne Gisslen - Comprehensive culinary textbook with precise measurements</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator uses conversion factors and ingredient densities from established culinary sources including King Arthur Baking,
          USDA standards, and professional culinary textbooks. While we strive for accuracy, minor variations may occur based on ingredient
          brand, freshness, and measuring technique. For professional or competition baking, always verify critical measurements with multiple sources.
        </p>
      </div>

      {/* FAQ Section */}
      <FAQAccordion faqs={faqItems} />

      {/* Review Section */}
      <div id="calculator-review-section">
        <CalculatorReview calculatorName="Recipe Converter Calculator" />
      </div>
    </div>
  );
}
