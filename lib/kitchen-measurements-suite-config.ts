import type { FAQItem } from '@/components/ui/faq-accordion';

export interface CardItem {
  title: string;
  description: string;
}

export interface QuickRow {
  label: string;
  formula: string;
  notes: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export type KitchenMeasurementsVariant =
  | 'baking-pan-conversion'
  | 'butter-conversion'
  | 'cups-to-grams'
  | 'dry-measurement'
  | 'egg-size-substitution'
  | 'fermentation'
  | 'flour-weight'
  | 'kitchen-timer'
  | 'liquid-measurement'
  | 'metric-to-imperial-converter'
  | 'ounces-to-grams'
  | 'proof-time'
  | 'sugar-substitution'
  | 'tablespoon-to-cup'
  | 'temperature-conversion';

export interface VariantConfig {
  title: string;
  subtitle: string;
  cta: string;
  reviewName: string;
  focus: string;
  concept: string;
  researchFocus: string;
  aboutParagraphs: string[];
  stepTips: string[];
  dashboardTips: string[];
  features: string[];
  decisionCards: CardItem[];
  quickRows: QuickRow[];
  references: LinkItem[];
  understanding: CardItem[];
  faqs: FAQItem[];
  whyUse: CardItem[];
}

const faq = (question: string, answer: string, category: string): FAQItem => ({
  question,
  answer,
  category,
});

const card = (title: string, description: string): CardItem => ({ title, description });
const row = (label: string, formula: string, notes: string): QuickRow => ({ label, formula, notes });
const link = (label: string, url: string): LinkItem => ({ label, url });

const REF = {
  kingArthurWeights: link('King Arthur Ingredient Weight Chart', 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart'),
  kingArthurFlour: link('King Arthur How to Measure Flour', 'https://www.kingarthurbaking.com/blog/2023/10/13/how-to-measure-flour'),
  kingArthurPan: link('King Arthur Complete Guide to Baking Pans', 'https://www.kingarthurbaking.com/blog/2023/06/05/your-complete-guide-to-baking-pans'),
  kingArthurProof: link('King Arthur Desired Dough Temperature', 'https://www.kingarthurbaking.com/pro/reference/dough-temperature'),
  nistKitchen: link('NIST Metric Kitchen: Cooking Measurement Equivalencies', 'https://www.nist.gov/pml/owm/metric-kitchen-cooking-measurement-equivalencies'),
  usdaEggs: link('USDA Shell Eggs From Farm to Table', 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/shell-eggs-farm-table'),
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Kitchen-ready outputs', `The result is organized around ${focus}, not just one isolated conversion number.`),
  card('Popup-only advanced dashboard', 'The calculator keeps the approved modal pattern so equivalents, assumptions, and watchouts stay together.'),
  card('Recipe-friendly context', 'Companion units and practical kitchen equivalents stay visible in the same run.'),
  card('Live feature research', 'Inputs and outputs were selected after reviewing public baking, conversion, and food-safety resources online.'),
];

const baseUnderstanding = (concept: string, focus: string): CardItem[] => [
  card('Kitchen math is context-sensitive', `Most ${concept} work looks simple until ingredient density, package units, or recipe style changes the meaning of the number.`),
  card('Volume and weight are not interchangeable', `The final ${focus} interpretation changes when a recipe shifts between cups, grams, ounces, or ingredient-specific weights.`),
  card('Small differences can change results', 'Pan size, egg size, proof temperature, and measuring unit choice can all shift recipe outcomes more than many cooks expect.'),
  card('Better conversions reduce guesswork', 'A useful kitchen calculator keeps practical companion units visible so the cook can act on the result immediately.'),
];

const baseFaqs = (title: string, concept: string): FAQItem[] => [
  faq(`How does this ${title.toLowerCase()} work?`, `It converts your kitchen inputs into a base ${concept} result and then keeps the practical companion units visible for real recipe use.`, 'Method'),
  faq('Why are companion units shown?', 'Because kitchen work often moves between cups, grams, ounces, tablespoons, and package sizes during the same recipe.', 'Planning'),
  faq('Can I use this as an exact recipe guarantee?', 'It is best used as a high-quality planning and conversion tool, while the specific recipe and product details still guide the final result.', 'Usage'),
];

interface VariantSeed {
  title: string;
  subtitle: string;
  focus: string;
  concept: string;
  researchFocus: string;
  intro: string;
  stepTips: string[];
  dashboardTips: string[];
  features: string[];
  decisionCards: CardItem[];
  quickRows: QuickRow[];
  references: LinkItem[];
}

const cfg = (seed: VariantSeed): VariantConfig => ({
  title: seed.title,
  subtitle: seed.subtitle,
  cta: `Calculate ${seed.title.replace(' Calculator', '')}`,
  reviewName: seed.title,
  focus: seed.focus,
  concept: seed.concept,
  researchFocus: seed.researchFocus,
  aboutParagraphs: [
    seed.intro,
    `A basic ${seed.title.toLowerCase()} usually stops at one converted number, but real kitchen planning usually needs companion units, ingredient context, or recipe-specific assumptions as well.`,
    `This advanced version keeps those linked details visible so ${seed.concept} is easier to review the way bakers, cooks, and meal planners actually use the result.`,
  ],
  stepTips: seed.stepTips,
  dashboardTips: seed.dashboardTips,
  features: seed.features,
  decisionCards: seed.decisionCards,
  quickRows: seed.quickRows,
  references: seed.references,
  understanding: baseUnderstanding(seed.concept, seed.focus),
  faqs: baseFaqs(seed.title, seed.concept),
  whyUse: baseWhyUse(seed.focus),
});

const conversionConfig = (
  title: string,
  focus: string,
  concept: string,
  intro: string,
  refs: LinkItem[],
  extraFeature: string
): VariantConfig =>
  cfg({
    title,
    subtitle: `Estimate ${focus} with recipe-ready conversion context and practical kitchen equivalents`,
    focus,
    concept,
    researchFocus: 'recipe conversion logic, unit equivalencies, ingredient context, and kitchen-ready output',
    intro,
    stepTips: ['Enter the source quantity first so the base conversion is clear.', 'Choose the ingredient or unit carefully when the conversion depends on more than raw math.', 'Use the popup to compare the main result with companion units instead of converting again by hand.', 'Treat the output as a recipe-planning tool, not just a one-line converter.'],
    dashboardTips: ['Primary converted result stays front and center.', 'Companion units remain visible for real kitchen use.', 'Assumptions stay attached to the same run.', 'Notes explain where conversions are ingredient-specific or only approximate.'],
    features: ['Kitchen-friendly companion units shown together', 'Popup-only advanced dashboard consistent with the approved structure', 'Original content tailored to recipe use instead of generic unit conversion', 'Useful for both U.S. and metric recipe styles', 'Designed to reduce manual fraction and package math during prep', extraFeature],
    decisionCards: [card('If the converted value feels off', 'Check whether the conversion depends on the ingredient rather than just the unit name.'), card('If the recipe uses another format', 'Use the companion units to move from the main result into the format your recipe or tool actually needs.'), card('If scaling is involved', 'Convert first, then scale the recipe, so the working number stays easier to audit.'), card('If density matters', 'Volume-to-weight conversions are strongest when the ingredient-specific assumption is visible.')],
    quickRows: [row('Base quantity', 'User input amount', 'Defines the number the conversion starts from.'), row('Primary conversion', 'Quantity x unit or ingredient factor', 'Creates the main result shown in the dashboard.'), row('Companion units', 'Derived from the same base quantity', 'Helps match measuring cups, spoons, scales, or package labels.'), row('Recipe-ready interpretation', 'Round only after checking the recipe context', 'Keeps the output practical instead of overly abstract.')],
    references: refs,
  });

export const KITCHEN_MEASUREMENTS_CONFIG: Record<KitchenMeasurementsVariant, VariantConfig> = {
  'cups-to-grams': conversionConfig(
    'Cups to Grams Calculator',
    'ingredient-specific weight conversion',
    'cups-to-grams planning',
    'This calculator is built for bakers and cooks who need a cup-based ingredient amount translated into grams without pretending every ingredient weighs the same.',
    [REF.kingArthurWeights, REF.kingArthurFlour, REF.nistKitchen],
    'Ingredient-specific cup weights keep flour, sugar, butter, and liquids from being treated like identical volumes'
  ),
  'ounces-to-grams': conversionConfig(
    'Ounces to Grams Calculator',
    'weight conversion for recipe prep and packaging',
    'ounces-to-grams planning',
    'This calculator is designed for recipes and product labels that move between ounces and grams during prep or scaling.',
    [REF.nistKitchen, REF.kingArthurWeights],
    'Companion outputs in pounds and kilograms add batch-scaling context'
  ),
  'tablespoon-to-cup': conversionConfig(
    'Tablespoon to Cup Calculator',
    'small-volume kitchen conversion',
    'tablespoon-to-cup planning',
    'This calculator is built for recipe steps where spoon measures need to be translated into cups, ounces, and milliliters quickly.',
    [REF.nistKitchen],
    'Companion teaspoon and fluid-ounce outputs reduce fraction math during prep'
  ),
  'metric-to-imperial-converter': conversionConfig(
    'Metric to Imperial Converter Calculator',
    'kitchen metric-to-U.S. conversion',
    'metric-to-imperial kitchen planning',
    'This calculator is designed for recipes that mix milliliters, grams, and Celsius with cups, ounces, and Fahrenheit.',
    [REF.nistKitchen, REF.kingArthurWeights],
    'The tool keeps the conversion kitchen-focused instead of drifting into generic engineering units'
  ),
  'temperature-conversion': conversionConfig(
    'Temperature Conversion Calculator',
    'oven and cooking temperature conversion',
    'temperature-conversion planning',
    'This calculator is built for oven and cooking temperatures when recipes and appliances use different temperature scales.',
    [REF.nistKitchen],
    'Extra temperature context helps with oven sanity checks during recipe conversion'
  ),
  'baking-pan-conversion': conversionConfig(
    'Baking Pan Conversion Calculator',
    'pan-size scaling and recipe resizing',
    'baking-pan conversion planning',
    'This calculator is designed for moving a recipe between different pan sizes without guessing how much the batter or dough should change.',
    [REF.kingArthurPan],
    'Area-based scaling helps keep the ingredient multiplier grounded in pan geometry'
  ),
  'egg-size-substitution': conversionConfig(
    'Egg Size Substitution Calculator',
    'egg-size mass substitution for baking',
    'egg-size substitution planning',
    'This calculator is built for recipes where the egg size you have does not match the egg size the recipe expects.',
    [REF.usdaEggs, REF.kingArthurWeights],
    'Using egg mass instead of shell count makes the substitution more reliable'
  ),
  'butter-conversion': conversionConfig(
    'Butter Conversion Calculator',
    'butter sticks, cups, tablespoons, and grams conversion',
    'butter conversion planning',
    'This calculator is designed for recipes that switch between sticks, cups, tablespoons, ounces, and grams of butter.',
    [REF.kingArthurWeights, REF.nistKitchen],
    'All common butter formats stay visible together so the result is ready for recipe use'
  ),
  'sugar-substitution': conversionConfig(
    'Sugar Substitution Calculator',
    'sweetener substitution planning',
    'sugar-substitution planning',
    'This calculator is built for cooks and bakers who want a practical starting point when swapping granulated sugar for a different sweetener.',
    [REF.kingArthurWeights, REF.nistKitchen],
    'The result stays positioned as a recipe-planning starting point, not a one-size-fits-all sweetness guarantee'
  ),
  'flour-weight': conversionConfig(
    'Flour Weight Calculator',
    'flour-specific cup-to-weight planning',
    'flour-weight planning',
    'This calculator is designed for bakers who want to convert flour by type rather than relying on one generic flour weight.',
    [REF.kingArthurWeights, REF.kingArthurFlour],
    'Flour-type selection keeps bread, cake, whole wheat, and alternative flours from being treated identically'
  ),
  'liquid-measurement': conversionConfig(
    'Liquid Measurement Calculator',
    'liquid volume conversion for kitchen prep',
    'liquid-measurement planning',
    'This calculator is built for liquids that need to move between milliliters, cups, fluid ounces, tablespoons, and teaspoons during prep.',
    [REF.nistKitchen],
    'The output is tuned for common kitchen measuring tools rather than generic lab units'
  ),
  'dry-measurement': conversionConfig(
    'Dry Measurement Calculator',
    'dry volume conversion for kitchen prep',
    'dry-measurement planning',
    'This calculator is designed for dry volume conversions when recipes bounce between cups, tablespoons, teaspoons, and milliliters.',
    [REF.nistKitchen],
    'Companion units are kept kitchen-focused so the result is immediately usable at the counter'
  ),
  'kitchen-timer': conversionConfig(
    'Kitchen Timer Calculator',
    'timer duration planning for prep and bake schedules',
    'kitchen-timer planning',
    'This calculator is built for translating recipe durations into clear total time values when prep, proofing, or bake steps need to be coordinated.',
    [REF.kingArthurProof],
    'Useful when several timed steps need to be compared on one timeline'
  ),
  'proof-time': conversionConfig(
    'Proof Time Calculator',
    'proof timing and dough-temperature planning',
    'proof-time planning',
    'This calculator is designed for bread and enriched dough work where room temperature can push proofing faster or slower than the recipe baseline.',
    [REF.kingArthurProof],
    'Temperature-sensitive timing stays visible so bakers can treat the clock as a guide rather than the only signal'
  ),
  fermentation: conversionConfig(
    'Fermentation Calculator',
    'brine salt planning for fermentation prep',
    'fermentation-brine planning',
    'This calculator is built for quick kitchen fermentation prep when a target salt percentage needs to be turned into an actual salt weight.',
    [REF.kingArthurProof, REF.nistKitchen],
    'Brine percentage stays explicit so the result is easier to compare across jars and batch sizes'
  ),
};
