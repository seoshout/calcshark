import type { RecipeCalculationsVariant } from '@/lib/recipe-calculations-suite-config';

export interface Inputs {
  baseServings: string;
  targetServings: string;
  ingredientAmount: string;
  ingredientUnit: string;
  ingredientCost: string;
  yieldPortions: string;
  totalRecipeCost: string;
  targetFoodCostPercent: string;
  caloriesPerIngredient: string;
  proteinPerIngredient: string;
  carbsPerIngredient: string;
  fatPerIngredient: string;
  ingredientCount: string;
  wastePurchasedWeight: string;
  wasteEdibleWeight: string;
  prepMinutes: string;
  cookMinutes: string;
  weightPounds: string;
  thicknessInches: string;
  ovenTempF: string;
  yeastAmount: string;
  yeastFromType: string;
  yeastToType: string;
  flourWeightGrams: string;
  waterWeightGrams: string;
  starterPercent: string;
  freezerPortions: string;
  portionWeightOz: string;
  freezerMonths: string;
  onHandUnits: string;
  weeklyUseUnits: string;
  targetParUnits: string;
}

export interface ResultMetric {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

export interface Result {
  primaryLabel: string;
  primaryValue: number;
  primarySuffix?: string;
  primaryDecimals?: number;
  metrics: ResultMetric[];
  notes: string[];
  warnings: string[];
}

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const YIELD_MULTIPLIER: Record<string, number> = {
  gram: 1,
  ounce: 28.3495,
  cup: 240,
  tbsp: 15,
  tsp: 5,
};

const YEAST_FACTOR_TO_FRESH: Record<string, number> = {
  fresh: 1,
  'active-dry': 1 / 0.4,
  instant: 1 / 0.33,
};

export const DEFAULT_INPUTS: Record<RecipeCalculationsVariant, Inputs> = {
  'recipe-converter': {
    baseServings: '4',
    targetServings: '8',
    ingredientAmount: '2',
    ingredientUnit: 'cup',
    ingredientCost: '3.50',
    yieldPortions: '8',
    totalRecipeCost: '18',
    targetFoodCostPercent: '30',
    caloriesPerIngredient: '250',
    proteinPerIngredient: '8',
    carbsPerIngredient: '32',
    fatPerIngredient: '9',
    ingredientCount: '6',
    wastePurchasedWeight: '5',
    wasteEdibleWeight: '4',
    prepMinutes: '20',
    cookMinutes: '40',
    weightPounds: '4',
    thicknessInches: '2',
    ovenTempF: '350',
    yeastAmount: '7',
    yeastFromType: 'instant',
    yeastToType: 'active-dry',
    flourWeightGrams: '500',
    waterWeightGrams: '350',
    starterPercent: '20',
    freezerPortions: '10',
    portionWeightOz: '8',
    freezerMonths: '3',
    onHandUnits: '12',
    weeklyUseUnits: '6',
    targetParUnits: '18',
  },
  'serving-size': {} as Inputs,
  'recipe-scaling': {} as Inputs,
  'ingredient-substitution': {} as Inputs,
  'cooking-time': {} as Inputs,
  'meat-cooking': {} as Inputs,
  'baking-ratio': {} as Inputs,
  'yeast-conversion': {} as Inputs,
  'recipe-cost': {} as Inputs,
  'nutrition-label': {} as Inputs,
  'menu-pricing': {} as Inputs,
  'food-waste': {} as Inputs,
  'batch-cooking': {} as Inputs,
  'freezer-storage': {} as Inputs,
  'pantry-inventory': {} as Inputs,
};

for (const key of Object.keys(DEFAULT_INPUTS) as RecipeCalculationsVariant[]) {
  DEFAULT_INPUTS[key] = { ...DEFAULT_INPUTS['recipe-converter'] };
}

export function buildRecipeCalculationsResult(
  variant: RecipeCalculationsVariant,
  inputs: Inputs
): Result {
  const baseServings = parse(inputs.baseServings);
  const targetServings = parse(inputs.targetServings);
  const ingredientAmount = parse(inputs.ingredientAmount);
  const ingredientCost = parse(inputs.ingredientCost);
  const yieldPortions = parse(inputs.yieldPortions);
  const totalRecipeCost = parse(inputs.totalRecipeCost);
  const targetFoodCostPercent = parse(inputs.targetFoodCostPercent);
  const caloriesPerIngredient = parse(inputs.caloriesPerIngredient);
  const proteinPerIngredient = parse(inputs.proteinPerIngredient);
  const carbsPerIngredient = parse(inputs.carbsPerIngredient);
  const fatPerIngredient = parse(inputs.fatPerIngredient);
  const ingredientCount = parse(inputs.ingredientCount);
  const wastePurchasedWeight = parse(inputs.wastePurchasedWeight);
  const wasteEdibleWeight = parse(inputs.wasteEdibleWeight);
  const prepMinutes = parse(inputs.prepMinutes);
  const cookMinutes = parse(inputs.cookMinutes);
  const weightPounds = parse(inputs.weightPounds);
  const thicknessInches = parse(inputs.thicknessInches);
  const ovenTempF = parse(inputs.ovenTempF);
  const yeastAmount = parse(inputs.yeastAmount);
  const flourWeightGrams = parse(inputs.flourWeightGrams);
  const waterWeightGrams = parse(inputs.waterWeightGrams);
  const starterPercent = parse(inputs.starterPercent);
  const freezerPortions = parse(inputs.freezerPortions);
  const portionWeightOz = parse(inputs.portionWeightOz);
  const freezerMonths = parse(inputs.freezerMonths);
  const onHandUnits = parse(inputs.onHandUnits);
  const weeklyUseUnits = parse(inputs.weeklyUseUnits);
  const targetParUnits = parse(inputs.targetParUnits);

  const scaleFactor = baseServings > 0 ? targetServings / baseServings : 0;

  if (variant === 'recipe-converter' || variant === 'recipe-scaling') {
    const scaled = ingredientAmount * scaleFactor;
    return {
      primaryLabel: variant === 'recipe-converter' ? 'Converted Ingredient Amount' : 'Scaled Ingredient Amount',
      primaryValue: scaled,
      primarySuffix: ` ${inputs.ingredientUnit}`,
      primaryDecimals: 2,
      metrics: [
        { label: 'Base Servings', value: baseServings, suffix: ' servings', decimals: 0 },
        { label: 'Target Servings', value: targetServings, suffix: ' servings', decimals: 0 },
        { label: 'Scale Factor', value: scaleFactor, suffix: 'x', decimals: 2 },
        { label: 'Original Amount', value: ingredientAmount, suffix: ` ${inputs.ingredientUnit}`, decimals: 2 },
      ],
      notes: [
        'The scaling result is anchored to servings first, then applied to the ingredient amount so the ratio stays consistent.',
        'Keeping the scale factor visible makes it easier to resize a whole recipe instead of recalculating every line by hand.',
        'This is especially useful when home-size recipes need to become batch-size or half-batch prep plans.',
      ],
      warnings: baseServings <= 0 || targetServings <= 0 ? ['Base and target servings must be above zero to scale a recipe.'] : [],
    };
  }

  if (variant === 'serving-size') {
    const servingWeight = targetServings > 0 ? (ingredientAmount * (YIELD_MULTIPLIER[inputs.ingredientUnit] ?? 1)) / targetServings : 0;
    return {
      primaryLabel: 'Estimated Serving Weight',
      primaryValue: servingWeight,
      primarySuffix: ' g',
      primaryDecimals: 1,
      metrics: [
        { label: 'Total Recipe Yield Input', value: ingredientAmount, suffix: ` ${inputs.ingredientUnit}`, decimals: 2 },
        { label: 'Servings Planned', value: targetServings, suffix: ' servings', decimals: 0 },
        { label: 'Equivalent Portion Ounces', value: servingWeight / 28.3495, suffix: ' oz', decimals: 2 },
        { label: 'Scale Factor', value: scaleFactor, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'Serving size is estimated by taking the total prepared yield and dividing it by the number of servings you want to produce.',
        'That makes it easier to plan plating, meal prep containers, and batch consistency before cooking begins.',
        'The gram-based serving output is helpful even if the original yield was entered in cups or spoons.',
      ],
      warnings: ingredientAmount <= 0 || targetServings <= 0 ? ['Recipe yield and servings must be above zero to estimate serving size.'] : [],
    };
  }

  if (variant === 'ingredient-substitution') {
    const substituteAmount = ingredientAmount * (inputs.ingredientUnit === 'cup' ? 0.75 : 1);
    return {
      primaryLabel: 'Suggested Substitute Amount',
      primaryValue: substituteAmount,
      primarySuffix: ` ${inputs.ingredientUnit}`,
      primaryDecimals: 2,
      metrics: [
        { label: 'Original Amount', value: ingredientAmount, suffix: ` ${inputs.ingredientUnit}`, decimals: 2 },
        { label: 'Starting Ratio', value: inputs.ingredientUnit === 'cup' ? 0.75 : 1, suffix: 'x', decimals: 2 },
        { label: 'Equivalent in Grams (Approx.)', value: substituteAmount * (YIELD_MULTIPLIER[inputs.ingredientUnit] ?? 1), suffix: ' g/mL', decimals: 1 },
        { label: 'Scale Factor', value: scaleFactor, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'Ingredient substitutions are best treated as starting ratios rather than guaranteed one-to-one replacements.',
        'That is why the calculator keeps the substitute amount connected to the original recipe quantity instead of pretending every swap behaves identically.',
        'The result is most useful when you need a practical first-pass replacement and will still watch texture, sweetness, or hydration in the actual recipe.',
      ],
      warnings: ingredientAmount <= 0 ? ['Enter an ingredient amount above zero to estimate a substitution.'] : [],
    };
  }

  if (variant === 'cooking-time') {
    const adjustedMinutes = prepMinutes + cookMinutes * Math.max(weightPounds / 4, 0.5) * Math.max(thicknessInches / 2, 0.5);
    return {
      primaryLabel: 'Estimated Total Cooking Time',
      primaryValue: adjustedMinutes,
      primarySuffix: ' min',
      primaryDecimals: 0,
      metrics: [
        { label: 'Prep Time', value: prepMinutes, suffix: ' min', decimals: 0 },
        { label: 'Base Cook Time', value: cookMinutes, suffix: ' min', decimals: 0 },
        { label: 'Weight Input', value: weightPounds, suffix: ' lb', decimals: 2 },
        { label: 'Thickness Input', value: thicknessInches, suffix: ' in', decimals: 2 },
      ],
      notes: [
        'This estimate treats cooking time as a function of both weight and thickness rather than only one of those variables.',
        'That makes it more useful for recipe-planning than a fixed single-time assumption.',
        'The result is still a planning guide, so final doneness should be confirmed with temperature or visual cues when appropriate.',
      ],
      warnings: cookMinutes <= 0 ? ['Enter a base cooking time above zero to estimate total cooking time.'] : [],
    };
  }

  if (variant === 'meat-cooking') {
    const roastMinutes = weightPounds * 20 + thicknessInches * 10;
    const restMinutes = 10 + Math.max(weightPounds - 2, 0) * 2;
    return {
      primaryLabel: 'Estimated Roast Time',
      primaryValue: roastMinutes,
      primarySuffix: ' min',
      primaryDecimals: 0,
      metrics: [
        { label: 'Recommended Rest Time', value: restMinutes, suffix: ' min', decimals: 0 },
        { label: 'Weight Input', value: weightPounds, suffix: ' lb', decimals: 2 },
        { label: 'Thickness Input', value: thicknessInches, suffix: ' in', decimals: 2 },
        { label: 'Oven Temperature', value: ovenTempF, suffix: ' F', decimals: 0 },
      ],
      notes: [
        'Meat cooking planning works best when weight, thickness, and oven temperature are all kept visible at the same time.',
        'A separate rest-time metric is included because the final serving schedule often depends on more than the oven time alone.',
        'The estimate is meant to support planning; final doneness should still be checked with a thermometer.',
      ],
      warnings: weightPounds <= 0 || ovenTempF <= 0 ? ['Enter meat weight and oven temperature above zero to estimate cooking time.'] : [],
    };
  }

  if (variant === 'baking-ratio') {
    const hydration = flourWeightGrams > 0 ? (waterWeightGrams / flourWeightGrams) * 100 : 0;
    const preferment = flourWeightGrams > 0 ? starterPercent : 0;
    return {
      primaryLabel: 'Hydration',
      primaryValue: hydration,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Flour Weight', value: flourWeightGrams, suffix: ' g', decimals: 0 },
        { label: 'Water Weight', value: waterWeightGrams, suffix: ' g', decimals: 0 },
        { label: 'Starter or Preferment', value: preferment, suffix: '%', decimals: 1 },
        { label: 'Total Dough Weight', value: flourWeightGrams + waterWeightGrams, suffix: ' g', decimals: 0 },
      ],
      notes: [
        'Baking-ratio planning is built around baker’s percentage, which makes flour the reference point for all the other ingredients.',
        'Hydration is kept as the lead output because it is one of the fastest ways to understand how a dough is likely to behave.',
        'Starter or preferment percentage stays visible so the result remains useful for fermentation planning as well as scaling.',
      ],
      warnings: flourWeightGrams <= 0 ? ['Enter flour weight above zero to calculate baking ratios.'] : [],
    };
  }

  if (variant === 'yeast-conversion') {
    const fromToFresh = YEAST_FACTOR_TO_FRESH[inputs.yeastFromType] ?? 1;
    const targetFactor = YEAST_FACTOR_TO_FRESH[inputs.yeastToType] ?? 1;
    const freshEquivalent = yeastAmount * fromToFresh;
    const converted = targetFactor > 0 ? freshEquivalent / targetFactor : 0;
    return {
      primaryLabel: 'Equivalent Yeast Amount',
      primaryValue: converted,
      primarySuffix: ' g',
      primaryDecimals: 2,
      metrics: [
        { label: 'Input Yeast', value: yeastAmount, suffix: ' g', decimals: 2 },
        { label: 'Fresh Yeast Equivalent', value: freshEquivalent, suffix: ' g', decimals: 2 },
        { label: 'From Type', value: inputs.yeastFromType === 'instant' ? 1 : inputs.yeastFromType === 'active-dry' ? 2 : 3, suffix: '', decimals: 0 },
        { label: 'To Type', value: inputs.yeastToType === 'instant' ? 1 : inputs.yeastToType === 'active-dry' ? 2 : 3, suffix: '', decimals: 0 },
      ],
      notes: [
        'This conversion uses a fresh-yeast equivalent as the bridge so common dry and fresh yeast forms can be compared from one base.',
        'That makes the result easier to audit than chaining one ad hoc ratio directly into another.',
        'The output is a strong planning conversion, but the product label and recipe method should still guide the final yeast choice.',
      ],
      warnings: yeastAmount <= 0 ? ['Enter a yeast amount above zero to convert between yeast types.'] : [],
    };
  }

  if (variant === 'recipe-cost') {
    const ingredientTotal = ingredientCost * ingredientCount;
    const costPerServing = yieldPortions > 0 ? ingredientTotal / yieldPortions : 0;
    return {
      primaryLabel: 'Cost Per Serving',
      primaryValue: costPerServing,
      primarySuffix: '',
      primaryDecimals: 2,
      metrics: [
        { label: 'Ingredient Line Cost', value: ingredientTotal, suffix: ' USD', decimals: 2 },
        { label: 'Yield Portions', value: yieldPortions, suffix: ' servings', decimals: 0 },
        { label: 'Batch Cost', value: ingredientTotal, suffix: ' USD', decimals: 2 },
        { label: 'Cost Per Portion x10', value: costPerServing * 10, suffix: ' USD/10', decimals: 2 },
      ],
      notes: [
        'Recipe costing starts with the ingredient line total and then pushes that against the actual yield of the recipe.',
        'That makes the per-serving number more useful for menu planning or meal prep than a raw ingredient bill alone.',
        'The result works best when ingredient cost and actual yield are updated together.',
      ],
      warnings: ingredientCost <= 0 || ingredientCount <= 0 || yieldPortions <= 0 ? ['Ingredient cost, ingredient count, and yield portions must be above zero to calculate recipe cost.'] : [],
    };
  }

  if (variant === 'nutrition-label') {
    const totalCalories = caloriesPerIngredient * ingredientCount;
    const perServing = targetServings > 0 ? totalCalories / targetServings : 0;
    return {
      primaryLabel: 'Calories Per Serving',
      primaryValue: perServing,
      primarySuffix: ' kcal',
      primaryDecimals: 0,
      metrics: [
        { label: 'Total Recipe Calories', value: totalCalories, suffix: ' kcal', decimals: 0 },
        { label: 'Protein Per Serving', value: targetServings > 0 ? (proteinPerIngredient * ingredientCount) / targetServings : 0, suffix: ' g', decimals: 1 },
        { label: 'Carbs Per Serving', value: targetServings > 0 ? (carbsPerIngredient * ingredientCount) / targetServings : 0, suffix: ' g', decimals: 1 },
        { label: 'Fat Per Serving', value: targetServings > 0 ? (fatPerIngredient * ingredientCount) / targetServings : 0, suffix: ' g', decimals: 1 },
      ],
      notes: [
        'This nutrition-label estimate treats the ingredient set as a recipe total and then divides that total across the servings you plan to declare or serve.',
        'That makes it useful for quick recipe-level nutrition planning before a formal label buildout.',
        'Serving count remains visible because it often drives more label differences than the ingredient totals themselves.',
      ],
      warnings: ingredientCount <= 0 || targetServings <= 0 ? ['Ingredient count and servings must be above zero to estimate a nutrition label.'] : [],
    };
  }

  if (variant === 'menu-pricing') {
    const menuPrice = targetFoodCostPercent > 0 ? totalRecipeCost / (targetFoodCostPercent / 100) : 0;
    return {
      primaryLabel: 'Suggested Menu Price',
      primaryValue: menuPrice,
      primarySuffix: ' USD',
      primaryDecimals: 2,
      metrics: [
        { label: 'Total Recipe Cost', value: totalRecipeCost, suffix: ' USD', decimals: 2 },
        { label: 'Target Food Cost', value: targetFoodCostPercent, suffix: '%', decimals: 1 },
        { label: 'Gross Margin', value: menuPrice - totalRecipeCost, suffix: ' USD', decimals: 2 },
        { label: 'Portion Yield', value: yieldPortions, suffix: ' servings', decimals: 0 },
      ],
      notes: [
        'Menu pricing starts from the cost of the dish and then backs into a selling price using the target food-cost percentage.',
        'That makes the output more useful than simply marking up the ingredient total by an arbitrary factor.',
        'Gross margin is shown alongside the menu price so the pricing logic is easier to review.',
      ],
      warnings: totalRecipeCost <= 0 || targetFoodCostPercent <= 0 ? ['Recipe cost and target food-cost percentage must be above zero to suggest a menu price.'] : [],
    };
  }

  if (variant === 'food-waste') {
    const wastePercent = wastePurchasedWeight > 0 ? ((wastePurchasedWeight - wasteEdibleWeight) / wastePurchasedWeight) * 100 : 0;
    return {
      primaryLabel: 'Food Waste',
      primaryValue: wastePercent,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Purchased Weight', value: wastePurchasedWeight, suffix: ' lb', decimals: 2 },
        { label: 'Edible Weight', value: wasteEdibleWeight, suffix: ' lb', decimals: 2 },
        { label: 'Waste Weight', value: wastePurchasedWeight - wasteEdibleWeight, suffix: ' lb', decimals: 2 },
        { label: 'Yield Percentage', value: 100 - wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Food waste is framed as the difference between purchased weight and edible yield so prep loss becomes easy to see.',
        'That makes the output useful for trimming, peeling, and production-efficiency review instead of only for disposal reporting.',
        'Yield percentage stays visible because many kitchens plan purchasing and pricing from the edible side of the equation.',
      ],
      warnings: wastePurchasedWeight <= 0 || wasteEdibleWeight < 0 ? ['Purchased weight must be above zero and edible weight cannot be negative.'] : [],
    };
  }

  if (variant === 'batch-cooking') {
    const scaledTotal = totalRecipeCost * scaleFactor;
    return {
      primaryLabel: 'Scaled Batch Cost',
      primaryValue: scaledTotal,
      primarySuffix: ' USD',
      primaryDecimals: 2,
      metrics: [
        { label: 'Scale Factor', value: scaleFactor, suffix: 'x', decimals: 2 },
        { label: 'Base Batch Cost', value: totalRecipeCost, suffix: ' USD', decimals: 2 },
        { label: 'Target Servings', value: targetServings, suffix: ' servings', decimals: 0 },
        { label: 'Base Servings', value: baseServings, suffix: ' servings', decimals: 0 },
      ],
      notes: [
        'Batch cooking planning keeps the scaling factor and total batch cost tied together so prep volume is easier to review.',
        'That helps when moving from a small recipe into multi-portion meal prep or catering-style quantities.',
        'The result is most useful when serving assumptions are stable and the ingredient pricing is current.',
      ],
      warnings: baseServings <= 0 || targetServings <= 0 || totalRecipeCost <= 0 ? ['Base servings, target servings, and batch cost must be above zero to plan batch cooking.'] : [],
    };
  }

  if (variant === 'freezer-storage') {
    const totalWeight = freezerPortions * portionWeightOz;
    return {
      primaryLabel: 'Total Freezer Weight',
      primaryValue: totalWeight,
      primarySuffix: ' oz',
      primaryDecimals: 1,
      metrics: [
        { label: 'Portions', value: freezerPortions, suffix: ' portions', decimals: 0 },
        { label: 'Portion Weight', value: portionWeightOz, suffix: ' oz', decimals: 1 },
        { label: 'Equivalent Pounds', value: totalWeight / 16, suffix: ' lb', decimals: 2 },
        { label: 'Planned Storage Time', value: freezerMonths, suffix: ' months', decimals: 1 },
      ],
      notes: [
        'Freezer planning works best when the number of portions and the weight of each portion are kept visible together.',
        'That helps with container planning, freezer space, and meal-prep expectations.',
        'Storage months are shown as a quality-planning reminder rather than a safety guarantee.',
      ],
      warnings: freezerPortions <= 0 || portionWeightOz <= 0 ? ['Portions and portion weight must be above zero to estimate freezer storage volume.'] : [],
    };
  }

  const weeksOfSupply = weeklyUseUnits > 0 ? onHandUnits / weeklyUseUnits : 0;
  const reorderGap = Math.max(targetParUnits - onHandUnits, 0);
  return {
    primaryLabel: 'Reorder Quantity',
    primaryValue: reorderGap,
    primarySuffix: ' units',
    primaryDecimals: 0,
    metrics: [
      { label: 'On Hand', value: onHandUnits, suffix: ' units', decimals: 0 },
      { label: 'Target Par', value: targetParUnits, suffix: ' units', decimals: 0 },
      { label: 'Weekly Use', value: weeklyUseUnits, suffix: ' units/week', decimals: 1 },
      { label: 'Weeks of Supply', value: weeksOfSupply, suffix: ' weeks', decimals: 2 },
    ],
    notes: [
      'Pantry inventory planning compares what is on hand against both the target par level and the current usage rate.',
      'That makes the reorder result more useful than simply checking stock against one static target.',
      'Weeks of supply adds context so the pantry can be reviewed in time as well as in units.',
    ],
    warnings: targetParUnits <= 0 || weeklyUseUnits <= 0 ? ['Target par and weekly use must be above zero to calculate pantry inventory needs.'] : [],
  };
}
