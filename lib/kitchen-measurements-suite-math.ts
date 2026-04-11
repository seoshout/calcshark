import type { KitchenMeasurementsVariant } from '@/lib/kitchen-measurements-suite-config';

export interface Inputs {
  amount: string;
  cups: string;
  ounces: string;
  tablespoons: string;
  ingredient: string;
  fromUnit: string;
  metricMode: string;
  tempValue: string;
  tempUnit: string;
  sourceLengthInches: string;
  sourceWidthInches: string;
  targetLengthInches: string;
  targetWidthInches: string;
  eggCount: string;
  sourceEggSize: string;
  targetEggSize: string;
  butterAmount: string;
  butterUnit: string;
  sugarCups: string;
  sugarSubstitute: string;
  flourCups: string;
  flourType: string;
  timerHours: string;
  timerMinutes: string;
  timerSeconds: string;
  baseProofMinutes: string;
  proofTempF: string;
  doughStyleFactor: string;
  waterWeightGrams: string;
  brinePercent: string;
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

const GRAMS_PER_CUP: Record<string, number> = {
  'all-purpose-flour': 120,
  'bread-flour': 120,
  'whole-wheat-flour': 113,
  'granulated-sugar': 198,
  'brown-sugar': 213,
  butter: 227,
  water: 227,
  milk: 227,
  honey: 340,
};

const FLOUR_GRAMS_PER_CUP: Record<string, number> = {
  'all-purpose': 120,
  bread: 120,
  'whole-wheat': 113,
  rye: 102,
  cake: 100,
  almond: 96,
};

const EGG_GRAMS: Record<string, number> = {
  peewee: 35,
  small: 42,
  medium: 49,
  large: 56,
  'extra-large': 63,
  jumbo: 70,
};

const SUGAR_SUB_RATIO: Record<string, { amount: number; notes: string }> = {
  honey: { amount: 0.75, notes: 'Common starting point is 3/4 cup honey for each 1 cup sugar.' },
  maple: { amount: 0.75, notes: 'Maple syrup often starts near 3/4 cup for each 1 cup sugar.' },
  coconut: { amount: 1, notes: 'Coconut sugar often substitutes cup-for-cup in many recipes.' },
  'brown-sugar': { amount: 1, notes: 'Brown sugar often substitutes cup-for-cup when molasses flavor is acceptable.' },
};

const toMl = (amount: number, unit: string) => {
  switch (unit) {
    case 'tsp':
      return amount * 5;
    case 'tbsp':
      return amount * 15;
    case 'cup':
      return amount * 240;
    case 'floz':
      return amount * 30;
    case 'pint':
      return amount * 473.176;
    case 'quart':
      return amount * 946.353;
    case 'liter':
      return amount * 1000;
    case 'ml':
    default:
      return amount;
  }
};

const fromMl = (ml: number) => ({
  tsp: ml / 5,
  tbsp: ml / 15,
  cups: ml / 240,
  floz: ml / 30,
});

const secondsFromTimer = (hours: number, minutes: number, seconds: number) => hours * 3600 + minutes * 60 + seconds;

export const DEFAULT_INPUTS: Record<KitchenMeasurementsVariant, Inputs> = {
  'cups-to-grams': {
    amount: '1',
    cups: '1',
    ounces: '8',
    tablespoons: '16',
    ingredient: 'all-purpose-flour',
    fromUnit: 'cup',
    metricMode: 'ml',
    tempValue: '350',
    tempUnit: 'f',
    sourceLengthInches: '9',
    sourceWidthInches: '13',
    targetLengthInches: '8',
    targetWidthInches: '8',
    eggCount: '2',
    sourceEggSize: 'large',
    targetEggSize: 'medium',
    butterAmount: '1',
    butterUnit: 'stick',
    sugarCups: '1',
    sugarSubstitute: 'honey',
    flourCups: '2',
    flourType: 'all-purpose',
    timerHours: '0',
    timerMinutes: '45',
    timerSeconds: '0',
    baseProofMinutes: '75',
    proofTempF: '72',
    doughStyleFactor: '1',
    waterWeightGrams: '1000',
    brinePercent: '2.5',
  },
  'ounces-to-grams': {} as Inputs,
  'tablespoon-to-cup': {} as Inputs,
  'metric-to-imperial-converter': {} as Inputs,
  'temperature-conversion': {} as Inputs,
  'baking-pan-conversion': {} as Inputs,
  'egg-size-substitution': {} as Inputs,
  'butter-conversion': {} as Inputs,
  'sugar-substitution': {} as Inputs,
  'flour-weight': {} as Inputs,
  'liquid-measurement': {} as Inputs,
  'dry-measurement': {} as Inputs,
  'kitchen-timer': {} as Inputs,
  'proof-time': {} as Inputs,
  fermentation: {} as Inputs,
};

for (const key of Object.keys(DEFAULT_INPUTS) as KitchenMeasurementsVariant[]) {
  DEFAULT_INPUTS[key] = { ...DEFAULT_INPUTS['cups-to-grams'] };
}

export function buildKitchenMeasurementsResult(
  variant: KitchenMeasurementsVariant,
  inputs: Inputs
): Result {
  const amount = parse(inputs.amount);
  const cups = parse(inputs.cups);
  const ounces = parse(inputs.ounces);
  const tablespoons = parse(inputs.tablespoons);
  const tempValue = parse(inputs.tempValue);
  const sourceLengthInches = parse(inputs.sourceLengthInches);
  const sourceWidthInches = parse(inputs.sourceWidthInches);
  const targetLengthInches = parse(inputs.targetLengthInches);
  const targetWidthInches = parse(inputs.targetWidthInches);
  const eggCount = parse(inputs.eggCount);
  const butterAmount = parse(inputs.butterAmount);
  const sugarCups = parse(inputs.sugarCups);
  const flourCups = parse(inputs.flourCups);
  const timerHours = parse(inputs.timerHours);
  const timerMinutes = parse(inputs.timerMinutes);
  const timerSeconds = parse(inputs.timerSeconds);
  const baseProofMinutes = parse(inputs.baseProofMinutes);
  const proofTempF = parse(inputs.proofTempF);
  const doughStyleFactor = parse(inputs.doughStyleFactor);
  const waterWeightGrams = parse(inputs.waterWeightGrams);
  const brinePercent = parse(inputs.brinePercent);

  if (variant === 'cups-to-grams') {
    const gramsPerCup = GRAMS_PER_CUP[inputs.ingredient] ?? 0;
    const grams = cups * gramsPerCup;
    return {
      primaryLabel: 'Equivalent Weight',
      primaryValue: grams,
      primarySuffix: ' g',
      primaryDecimals: 0,
      metrics: [
        { label: 'Ingredient', value: gramsPerCup, suffix: ' g/cup', decimals: 0 },
        { label: 'Cups Entered', value: cups, suffix: ' cups', decimals: 2 },
        { label: 'Equivalent Ounces', value: grams / 28.3495, suffix: ' oz', decimals: 2 },
        { label: 'Rounded Grams', value: Math.round(grams), suffix: ' g', decimals: 0 },
      ],
      notes: [
        'This conversion uses ingredient-specific cup weights rather than treating every cup as the same mass.',
        'That matters because flour, sugar, butter, and liquids all weigh differently for the same volume.',
        'Keeping ounces visible alongside grams helps when switching between U.S. and metric-style recipes.',
      ],
      warnings: gramsPerCup <= 0 || cups <= 0 ? ['Choose an ingredient and enter cups above zero to convert volume to weight.'] : [],
    };
  }

  if (variant === 'ounces-to-grams') {
    const grams = ounces * 28.3495;
    return {
      primaryLabel: 'Equivalent Weight',
      primaryValue: grams,
      primarySuffix: ' g',
      primaryDecimals: 1,
      metrics: [
        { label: 'Input Ounces', value: ounces, suffix: ' oz', decimals: 2 },
        { label: 'Equivalent Pounds', value: ounces / 16, suffix: ' lb', decimals: 3 },
        { label: 'Equivalent Kilograms', value: grams / 1000, suffix: ' kg', decimals: 3 },
        { label: 'Rounded Grams', value: Math.round(grams), suffix: ' g', decimals: 0 },
      ],
      notes: [
        'This is a straight mass conversion using the standard ounce-to-gram relationship.',
        'It is especially useful when recipes flip between U.S. package weights and metric ingredient lists.',
        'Keeping pounds and kilograms visible adds extra context for larger batch scaling.',
      ],
      warnings: ounces <= 0 ? ['Enter ounces above zero to convert weight.'] : [],
    };
  }

  if (variant === 'tablespoon-to-cup') {
    const cupsValue = tablespoons / 16;
    return {
      primaryLabel: 'Equivalent Cups',
      primaryValue: cupsValue,
      primarySuffix: ' cups',
      primaryDecimals: 3,
      metrics: [
        { label: 'Tablespoons', value: tablespoons, suffix: ' tbsp', decimals: 1 },
        { label: 'Equivalent Teaspoons', value: tablespoons * 3, suffix: ' tsp', decimals: 1 },
        { label: 'Equivalent Fluid Ounces', value: tablespoons / 2, suffix: ' fl oz', decimals: 2 },
        { label: 'Equivalent Milliliters', value: tablespoons * 15, suffix: ' mL', decimals: 0 },
      ],
      notes: [
        'The tablespoon-to-cup conversion is useful when scaling sauces, dressings, or small-batch baking formulas.',
        'Showing teaspoons and fluid ounces alongside cups helps match different recipe styles quickly.',
        'This keeps small-volume adjustments from becoming manual fraction math.',
      ],
      warnings: tablespoons <= 0 ? ['Enter tablespoons above zero to convert volume.'] : [],
    };
  }

  if (variant === 'metric-to-imperial-converter') {
    if (inputs.metricMode === 'ml') {
      const converted = fromMl(amount);
      return {
        primaryLabel: 'Equivalent Cups',
        primaryValue: converted.cups,
        primarySuffix: ' cups',
        primaryDecimals: 3,
        metrics: [
          { label: 'Milliliters', value: amount, suffix: ' mL', decimals: 1 },
          { label: 'Fluid Ounces', value: converted.floz, suffix: ' fl oz', decimals: 2 },
          { label: 'Tablespoons', value: converted.tbsp, suffix: ' tbsp', decimals: 2 },
          { label: 'Teaspoons', value: converted.tsp, suffix: ' tsp', decimals: 1 },
        ],
        notes: [
          'This conversion uses common kitchen equivalencies so metric recipe volumes can be translated into familiar U.S. kitchen units.',
          'Showing several U.S. units together makes it easier to choose the measuring tool you actually have on hand.',
          'This is especially helpful when recipes are written in milliliters but the kitchen is stocked with cups and spoons.',
        ],
        warnings: amount <= 0 ? ['Enter a metric value above zero to convert.'] : [],
      };
    }
    if (inputs.metricMode === 'g') {
      return {
        primaryLabel: 'Equivalent Ounces',
        primaryValue: amount / 28.3495,
        primarySuffix: ' oz',
        primaryDecimals: 2,
        metrics: [
          { label: 'Grams', value: amount, suffix: ' g', decimals: 0 },
          { label: 'Pounds', value: amount / 453.592, suffix: ' lb', decimals: 3 },
          { label: 'Kilograms', value: amount / 1000, suffix: ' kg', decimals: 3 },
          { label: 'Rounded Ounces', value: Math.round((amount / 28.3495) * 100) / 100, suffix: ' oz', decimals: 2 },
        ],
        notes: [
          'This weight conversion is useful when ingredient labels, imported recipes, or kitchen scales switch between grams and ounces.',
          'Keeping pounds visible helps when larger batch quantities are involved.',
          'The output stays focused on kitchen-useful units rather than general-purpose measurement systems.',
        ],
        warnings: amount <= 0 ? ['Enter grams above zero to convert weight.'] : [],
      };
    }
    const fahrenheit = amount * (9 / 5) + 32;
    return {
      primaryLabel: 'Equivalent Fahrenheit',
      primaryValue: fahrenheit,
      primarySuffix: ' F',
      primaryDecimals: 1,
      metrics: [
        { label: 'Celsius', value: amount, suffix: ' C', decimals: 1 },
        { label: 'Equivalent Fahrenheit', value: fahrenheit, suffix: ' F', decimals: 1 },
        { label: 'Boiling Offset', value: 100 - amount, suffix: ' C below boil', decimals: 1 },
        { label: 'Freezing Offset', value: amount, suffix: ' C above freeze', decimals: 1 },
      ],
      notes: [
        'Temperature is included because many international baking and roasting recipes switch between Celsius and Fahrenheit.',
        'Showing kitchen-relevant temperature context can help sanity-check oven settings more quickly.',
        'The main result stays focused on the converted oven or cooking temperature.',
      ],
      warnings: [],
    };
  }

  if (variant === 'temperature-conversion') {
    const c = inputs.tempUnit === 'f' ? (tempValue - 32) * (5 / 9) : tempValue;
    const f = inputs.tempUnit === 'c' ? tempValue * (9 / 5) + 32 : tempValue;
    return {
      primaryLabel: inputs.tempUnit === 'f' ? 'Equivalent Celsius' : 'Equivalent Fahrenheit',
      primaryValue: inputs.tempUnit === 'f' ? c : f,
      primarySuffix: inputs.tempUnit === 'f' ? ' C' : ' F',
      primaryDecimals: 1,
      metrics: [
        { label: 'Celsius', value: c, suffix: ' C', decimals: 1 },
        { label: 'Fahrenheit', value: f, suffix: ' F', decimals: 1 },
        { label: 'Gas Mark (Approx.)', value: (f - 250) / 25 + 1, suffix: '', decimals: 1 },
        { label: 'Kelvin', value: c + 273.15, suffix: ' K', decimals: 1 },
      ],
      notes: [
        'This tool converts cooking temperatures between Fahrenheit and Celsius so oven instructions are easier to follow across recipe styles.',
        'Extra temperature context helps with quick recipe interpretation when additional unit systems appear.',
        'The result is especially helpful when appliance displays and recipe authors use different scales.',
      ],
      warnings: [],
    };
  }

  if (variant === 'baking-pan-conversion') {
    const sourceArea = sourceLengthInches * sourceWidthInches;
    const targetArea = targetLengthInches * targetWidthInches;
    const scaleFactor = sourceArea > 0 ? targetArea / sourceArea : 0;
    return {
      primaryLabel: 'Recipe Scale Factor',
      primaryValue: scaleFactor,
      primarySuffix: 'x',
      primaryDecimals: 2,
      metrics: [
        { label: 'Source Pan Area', value: sourceArea, suffix: ' sq in', decimals: 1 },
        { label: 'Target Pan Area', value: targetArea, suffix: ' sq in', decimals: 1 },
        { label: 'Increase or Reduction', value: (scaleFactor - 1) * 100, suffix: '%', decimals: 1 },
        { label: 'Suggested Batter Multiplier', value: scaleFactor, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'This conversion compares pan surface area so batter or dough quantity can be scaled more rationally between pans.',
        'It is most useful when pan depth is similar and the recipe is area-driven rather than highly shape-sensitive.',
        'The scale factor makes it easier to resize the ingredient list instead of guessing based on pan names alone.',
      ],
      warnings: sourceArea <= 0 || targetArea <= 0 ? ['Source and target pan dimensions must be above zero to compare baking pans.'] : [],
    };
  }

  if (variant === 'egg-size-substitution') {
    const sourceWeight = eggCount * (EGG_GRAMS[inputs.sourceEggSize] ?? 0);
    const targetWeightEach = EGG_GRAMS[inputs.targetEggSize] ?? 0;
    const targetCount = targetWeightEach > 0 ? sourceWeight / targetWeightEach : 0;
    return {
      primaryLabel: 'Equivalent Target Eggs',
      primaryValue: targetCount,
      primarySuffix: ' eggs',
      primaryDecimals: 2,
      metrics: [
        { label: 'Source Egg Weight Total', value: sourceWeight, suffix: ' g', decimals: 0 },
        { label: 'Target Egg Weight Each', value: targetWeightEach, suffix: ' g', decimals: 0 },
        { label: 'Rounded Target Eggs', value: Math.round(targetCount * 4) / 4, suffix: ' eggs', decimals: 2 },
        { label: 'Source Count', value: eggCount, suffix: ' eggs', decimals: 0 },
      ],
      notes: [
        'Egg substitutions work best when they are based on total egg mass rather than shell count alone.',
        'This makes it easier to move between large, medium, extra-large, and jumbo eggs with less guesswork.',
        'Rounded fractional eggs help when scaling recipes or using beaten egg by weight.',
      ],
      warnings: sourceWeight <= 0 || targetWeightEach <= 0 ? ['Choose source and target egg sizes and enter a count above zero.'] : [],
    };
  }

  if (variant === 'butter-conversion') {
    const grams =
      inputs.butterUnit === 'stick'
        ? butterAmount * 113
        : inputs.butterUnit === 'tbsp'
          ? butterAmount * 14.125
          : inputs.butterUnit === 'cup'
            ? butterAmount * 227
            : butterAmount;
    return {
      primaryLabel: 'Equivalent Butter Weight',
      primaryValue: grams,
      primarySuffix: ' g',
      primaryDecimals: 0,
      metrics: [
        { label: 'Sticks', value: grams / 113, suffix: ' sticks', decimals: 2 },
        { label: 'Cups', value: grams / 227, suffix: ' cups', decimals: 2 },
        { label: 'Tablespoons', value: grams / 14.125, suffix: ' tbsp', decimals: 1 },
        { label: 'Ounces', value: grams / 28.3495, suffix: ' oz', decimals: 2 },
      ],
      notes: [
        'Butter conversions are especially useful because recipes often alternate between sticks, cups, tablespoons, and grams.',
        'Keeping all the common formats visible helps when adapting U.S. and metric baking formulas.',
        'The result is grounded in the standard U.S. stick-to-weight relationship used in most home baking references.',
      ],
      warnings: butterAmount <= 0 ? ['Enter a butter amount above zero to convert.'] : [],
    };
  }

  if (variant === 'sugar-substitution') {
    const rule = SUGAR_SUB_RATIO[inputs.sugarSubstitute] ?? SUGAR_SUB_RATIO.honey;
    const substituteAmount = sugarCups * rule.amount;
    return {
      primaryLabel: 'Suggested Substitute Amount',
      primaryValue: substituteAmount,
      primarySuffix: ' cups',
      primaryDecimals: 2,
      metrics: [
        { label: 'Original Sugar', value: sugarCups, suffix: ' cups', decimals: 2 },
        { label: 'Substitution Ratio', value: rule.amount, suffix: 'x', decimals: 2 },
        { label: 'Equivalent Tablespoons', value: substituteAmount * 16, suffix: ' tbsp', decimals: 1 },
        { label: 'Equivalent Milliliters', value: substituteAmount * 240, suffix: ' mL', decimals: 0 },
      ],
      notes: [
        rule.notes,
        'Sweetener substitutions can also change moisture, browning, and texture, so the amount is best treated as a strong starting point rather than a universal guarantee.',
        'Keeping tablespoons and milliliters visible makes it easier to translate the substitution into measuring tools on hand.',
      ],
      warnings: sugarCups <= 0 ? ['Enter an original sugar amount above zero to calculate a substitution.'] : [],
    };
  }

  if (variant === 'flour-weight') {
    const gramsPerCup = FLOUR_GRAMS_PER_CUP[inputs.flourType] ?? 0;
    const grams = flourCups * gramsPerCup;
    return {
      primaryLabel: 'Flour Weight',
      primaryValue: grams,
      primarySuffix: ' g',
      primaryDecimals: 0,
      metrics: [
        { label: 'Flour Type Weight', value: gramsPerCup, suffix: ' g/cup', decimals: 0 },
        { label: 'Cups Entered', value: flourCups, suffix: ' cups', decimals: 2 },
        { label: 'Equivalent Ounces', value: grams / 28.3495, suffix: ' oz', decimals: 2 },
        { label: 'Rounded Grams', value: Math.round(grams), suffix: ' g', decimals: 0 },
      ],
      notes: [
        'Different flours weigh differently by volume, so this conversion uses flour-specific cup weights rather than one generic multiplier.',
        'That is especially useful when adapting formulas between bread flour, all-purpose flour, whole wheat flour, and lower-density alternatives.',
        'The result makes it easier to switch from scoop-based baking to scale-based baking without rewriting the recipe by hand.',
      ],
      warnings: flourCups <= 0 || gramsPerCup <= 0 ? ['Choose a flour type and enter cups above zero to calculate flour weight.'] : [],
    };
  }

  if (variant === 'liquid-measurement' || variant === 'dry-measurement') {
    const ml = toMl(amount, inputs.fromUnit);
    const converted = fromMl(ml);
    return {
      primaryLabel: 'Equivalent Cups',
      primaryValue: converted.cups,
      primarySuffix: ' cups',
      primaryDecimals: 3,
      metrics: [
        { label: 'Milliliters', value: ml, suffix: ' mL', decimals: 1 },
        { label: 'Fluid Ounces', value: converted.floz, suffix: ' fl oz', decimals: 2 },
        { label: 'Tablespoons', value: converted.tbsp, suffix: ' tbsp', decimals: 2 },
        { label: 'Teaspoons', value: converted.tsp, suffix: ' tsp', decimals: 1 },
      ],
      notes: [
        variant === 'liquid-measurement'
          ? 'This liquid conversion keeps common kitchen volume units visible so recipes can move between cups, spoons, and milliliters quickly.'
          : 'This dry-measure conversion is most useful for volume-based kitchen planning when a recipe shifts between cups and spoon measures.',
        'The result is intentionally kitchen-focused rather than a general-purpose unit converter.',
        'Showing several companion units at once reduces fraction math during prep.',
      ],
      warnings: amount <= 0 ? ['Enter an amount above zero to convert kitchen volume.'] : [],
    };
  }

  if (variant === 'kitchen-timer') {
    const totalSeconds = secondsFromTimer(timerHours, timerMinutes, timerSeconds);
    return {
      primaryLabel: 'Total Time',
      primaryValue: totalSeconds / 60,
      primarySuffix: ' min',
      primaryDecimals: 1,
      metrics: [
        { label: 'Total Seconds', value: totalSeconds, suffix: ' sec', decimals: 0 },
        { label: 'Total Minutes', value: totalSeconds / 60, suffix: ' min', decimals: 1 },
        { label: 'Total Hours', value: totalSeconds / 3600, suffix: ' hr', decimals: 2 },
        { label: 'HH:MM:SS', value: totalSeconds, suffix: '', decimals: 0 },
      ],
      notes: [
        'This timer calculator converts a cooking duration into total seconds, minutes, and hours so prep and bake schedules are easier to compare.',
        'It is useful when recipe instructions mix minutes and hours or when multiple timed steps have to be coordinated.',
        'The core goal is clarity around total elapsed time rather than appliance countdown control.',
      ],
      warnings: totalSeconds <= 0 ? ['Enter hours, minutes, or seconds above zero to calculate a timer duration.'] : [],
    };
  }

  if (variant === 'proof-time') {
    const tempFactor = Math.pow(2, (75 - proofTempF) / 18);
    const adjusted = baseProofMinutes * tempFactor * Math.max(doughStyleFactor, 0.5);
    return {
      primaryLabel: 'Estimated Proof Time',
      primaryValue: adjusted,
      primarySuffix: ' min',
      primaryDecimals: 0,
      metrics: [
        { label: 'Base Proof Time', value: baseProofMinutes, suffix: ' min', decimals: 0 },
        { label: 'Proof Temperature', value: proofTempF, suffix: ' F', decimals: 1 },
        { label: 'Temperature Factor', value: tempFactor, suffix: 'x', decimals: 2 },
        { label: 'Approximate Hours', value: adjusted / 60, suffix: ' hr', decimals: 2 },
      ],
      notes: [
        'This estimate treats proof time as temperature-sensitive, using a practical multiplier anchored near a typical room-temperature proof target.',
        'The dough-style factor gives you a simple way to nudge the timing for richer or slower-moving doughs.',
        'It is meant as a planning guide, so the dough itself should still be the final cue, not the clock alone.',
      ],
      warnings: baseProofMinutes <= 0 ? ['Enter a base proof time above zero to estimate adjusted proof time.'] : [],
    };
  }

  const saltGrams = waterWeightGrams * (brinePercent / 100);
  return {
    primaryLabel: 'Salt Needed for Brine',
    primaryValue: saltGrams,
    primarySuffix: ' g',
    primaryDecimals: 1,
    metrics: [
      { label: 'Water Weight', value: waterWeightGrams, suffix: ' g', decimals: 0 },
      { label: 'Brine Strength', value: brinePercent, suffix: '%', decimals: 2 },
      { label: 'Equivalent Salt Ounces', value: saltGrams / 28.3495, suffix: ' oz', decimals: 2 },
      { label: 'Equivalent Water Liters', value: waterWeightGrams / 1000, suffix: ' L', decimals: 2 },
    ],
    notes: [
      'This fermentation calculator uses water weight and desired salinity to estimate the salt needed for a brine.',
      'That makes it useful for quick kitchen fermentation planning when salt percentage matters more than rough spoon measures.',
      'The result is best treated as a brine-planning tool rather than a full fermentation recipe generator.',
    ],
    warnings: waterWeightGrams <= 0 || brinePercent <= 0 ? ['Enter water weight and brine percentage above zero to calculate fermentation salt.'] : [],
  };
}
