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

export type RecipeCalculationsVariant =
  | 'recipe-converter'
  | 'serving-size'
  | 'recipe-scaling'
  | 'ingredient-substitution'
  | 'cooking-time'
  | 'meat-cooking'
  | 'baking-ratio'
  | 'yeast-conversion'
  | 'recipe-cost'
  | 'nutrition-label'
  | 'menu-pricing'
  | 'food-waste'
  | 'batch-cooking'
  | 'freezer-storage'
  | 'pantry-inventory';

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
  kingArthurWeights: link(
    'King Arthur Ingredient Weight Chart',
    'https://www.kingarthurbaking.com/learn/ingredient-weight-chart'
  ),
  kingArthurMeasureFlour: link(
    'King Arthur: How to Measure Flour',
    'https://www.kingarthurbaking.com/blog/2023/10/13/how-to-measure-flour'
  ),
  kingArthurBakersPct: link(
    "King Arthur: Baker's Percentage",
    'https://www.kingarthurbaking.com/pro/reference/bakers-percentage'
  ),
  kingArthurYeast: link(
    'King Arthur: Active Dry vs. Instant Yeast',
    'https://www.kingarthurbaking.com/blog/2022/08/15/why-instant-yeast-is-superior-to-active-dry-yeast'
  ),
  nistKitchen: link(
    'NIST Metric Kitchen Equivalencies',
    'https://www.nist.gov/pml/owm/metric-kitchen-cooking-measurement-equivalencies'
  ),
  usdaFoodSafe: link(
    'FoodSafety.gov Safe Minimum Internal Temperatures',
    'https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures'
  ),
  usdaLeftovers: link(
    'FoodSafety.gov Cold Food Storage Chart',
    'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts'
  ),
  fdaNutrition: link(
    'FDA Nutrition Facts and Serving Size Guidance',
    'https://www.fda.gov/media/98712/download'
  ),
};

const baseWhyUse = (focus: string): CardItem[] => [
  card(
    'Planning-first outputs',
    `The result is organized around ${focus}, not just a single detached answer that still needs interpretation.`
  ),
  card(
    'Popup-only advanced dashboard',
    'The approved modal pattern keeps the headline result, supporting metrics, notes, and warnings together in one view.'
  ),
  card(
    'Recipe workflow context',
    'Serving, costing, storage, and kitchen-safety considerations stay attached to the same run instead of being split across multiple tools.'
  ),
  card(
    'Feature set shaped by live research',
    'Inputs and outputs were chosen after reviewing public recipe calculators, food-service tools, and kitchen-reference resources online.'
  ),
];

const baseUnderstanding = (concept: string, focus: string): CardItem[] => [
  card(
    'Recipe math rarely stays one-dimensional',
    `Most ${concept} work looks simple until yield, ingredient density, portioning, timing, or storage limits change what the answer actually means.`
  ),
  card(
    'Scaling without context creates hidden errors',
    `A useful ${focus} workflow shows the companion metrics that affect whether the number still works in prep, costing, or service.`
  ),
  card(
    'Weight, volume, and servings solve different problems',
    'Recipe planning gets stronger when the calculator makes it obvious whether you are converting amount, yield, cost, or operational timing.'
  ),
  card(
    'Kitchen decisions usually need guardrails',
    'Food safety, waste, freezer time, and portion assumptions often matter just as much as the raw arithmetic.'
  ),
  card(
    'Operational use matters',
    'The best recipe calculators support home cooks, batch prep, and food-service workflows without forcing every scenario into the same output style.'
  ),
  card(
    'Better visibility reduces rework',
    'When scale factors, serving counts, cost targets, and storage assumptions stay visible, it is easier to catch mistakes before ingredients or labor are wasted.'
  ),
];

const baseFaqs = (title: string, concept: string): FAQItem[] => [
  faq(
    `How does this ${title.toLowerCase()} work?`,
    `It starts with your recipe-planning inputs, calculates a core ${concept} output, and then keeps the supporting metrics visible so you can act on the result more confidently.`,
    'Method'
  ),
  faq(
    'Why does the popup show extra metrics?',
    'Because recipe work usually depends on more than one number. Yield, cost, timing, storage, or portion context often changes how useful the main result is.',
    'Results'
  ),
  faq(
    'Can I treat this as an exact kitchen guarantee?',
    'It is best used as a strong planning tool. Actual ingredients, cookware, appliances, and handling practices still shape the real-world outcome.',
    'Usage'
  ),
  faq(
    'Why are official and technical references included?',
    'They support the conversion logic, food-safety assumptions, and nutrition or storage context behind the tool so the page is more than a generic calculator shell.',
    'References'
  ),
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
    `A thin ${seed.title.toLowerCase()} usually gives one answer and leaves the real kitchen judgment to the user. That is not enough when servings, menu price, freezer space, ingredient swaps, or safe handling all change how the answer should be used.`,
    `This advanced version keeps the approved content structure while adding the practical context people usually have to gather from separate conversion charts, costing spreadsheets, and recipe notes.`,
    `The goal is to make ${seed.concept} easier to review as a decision, not just as arithmetic.`,
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

export const RECIPE_CALCULATIONS_CONFIG: Record<RecipeCalculationsVariant, VariantConfig> = {
  'recipe-converter': cfg({
    title: 'Recipe Converter Calculator',
    subtitle: 'Convert recipe quantities with serving-based scaling, ingredient units, and kitchen-ready context',
    focus: 'recipe quantity conversion with serving context',
    concept: 'recipe conversion planning',
    researchFocus: 'serving-based recipe scaling, kitchen measurement equivalencies, and ingredient handling context',
    intro:
      'This calculator is designed for cooks and bakers who need to convert ingredient quantities without losing sight of servings, units, and recipe workflow.',
    stepTips: [
      'Start with the original serving count so the base recipe has a clear reference point.',
      'Enter the target servings before changing ingredient amounts by hand.',
      'Choose the ingredient unit that best reflects how the recipe is actually measured during prep.',
      'Use the popup dashboard to review the scaled amount, scale factor, and supporting notes together.',
    ],
    dashboardTips: [
      'The converted ingredient amount stays prominent.',
      'Original and target serving counts remain visible for auditability.',
      'The scale factor shows how aggressively the recipe is being resized.',
      'Notes help frame the output as recipe planning rather than blind multiplication.',
    ],
    features: [
      'Serving-based scaling instead of a detached one-off conversion',
      'Ingredient amount and unit stay tied to the same run',
      'Scale factor is visible for whole-recipe auditing',
      'Popup-only advanced dashboard matches the approved layout pattern',
      'Original page content written for recipe workflow instead of generic converter copy',
      'Works well for doubling, halving, or resizing for events and meal prep',
    ],
    decisionCards: [
      card('If you are scaling the whole recipe', 'Use the scale factor as the master check before adjusting every ingredient line.'),
      card('If one ingredient looks off', 'Confirm that the unit and original amount match the actual recipe card or package label.'),
      card('If the recipe becomes very large', 'Review pan size, batch size, and cook time separately because not every recipe scales perfectly linearly.'),
      card('If precision matters', 'Switch from volume assumptions to weighed ingredients whenever possible to reduce variation.'),
    ],
    quickRows: [
      row('Scale factor', 'Target servings / base servings', 'This is the core multiplier that drives whole-recipe resizing.'),
      row('Scaled ingredient amount', 'Original amount x scale factor', 'Shows the new ingredient quantity in the same unit family.'),
      row('Serving anchor', 'Original vs. target portions', 'Keeps the conversion tied to actual yield expectations.'),
      row('Kitchen review', 'Check pan, timing, and texture after scaling', 'Large size changes often affect more than the ingredient math.'),
    ],
    references: [REF.nistKitchen, REF.kingArthurWeights, REF.kingArthurMeasureFlour],
  }),
  'serving-size': cfg({
    title: 'Serving Size Calculator',
    subtitle: 'Estimate portion size from total yield, servings, and recipe volume assumptions',
    focus: 'portion-planning and serving consistency',
    concept: 'serving-size planning',
    researchFocus: 'serving declarations, practical portioning, and recipe-yield interpretation',
    intro:
      'This calculator is built for recipes where the real question is not the total batch size, but how much each serving should actually be once the yield is divided.',
    stepTips: [
      'Enter the total prepared yield in the unit that best matches your recipe notes.',
      'Set the number of servings you want to portion or label.',
      'Use the gram-based output as the operational checkpoint for plating or meal prep containers.',
      'Review the companion ounce value before finalizing portion assumptions.',
    ],
    dashboardTips: [
      'Estimated serving weight is the lead output.',
      'Equivalent ounces make packaging and meal prep easier.',
      'Servings planned stay visible to support label or menu decisions.',
      'Scale factor helps compare the portion plan against the base recipe.',
    ],
    features: [
      'Portion planning from total yield and serving count',
      'Gram and ounce context for practical kitchen use',
      'Useful for meal prep, recipe cards, and menu portions',
      'Keeps yield assumptions visible in the advanced dashboard',
      'Helps bridge home-style recipes and more standardized servings',
      'Original content focused on portion consistency rather than abstract fractions',
    ],
    decisionCards: [
      card('If portions feel too small', 'Increase serving weight or reduce declared servings rather than ignoring the output later.'),
      card('If plating matters', 'Treat the gram result as the stronger operational checkpoint than a visual estimate.'),
      card('If labeling matters', 'Keep declared servings aligned with the nutrition or menu context you intend to use.'),
      card('If the recipe has high moisture loss', 'Expect final cooked portion size to differ from a raw or pre-cook estimate.'),
    ],
    quickRows: [
      row('Serving weight', 'Total yield / servings', 'Turns total batch output into a per-portion planning number.'),
      row('Equivalent ounces', 'Grams / 28.3495', 'Useful for containers, prep, and quick kitchen checks.'),
      row('Serving count', 'User input assumption', 'The declared serving number often shapes the final output most strongly.'),
      row('Portion review', 'Compare output to how the dish is actually served', 'Helps prevent unrealistic label or menu portions.'),
    ],
    references: [REF.fdaNutrition, REF.nistKitchen, REF.kingArthurWeights],
  }),
  'recipe-scaling': cfg({
    title: 'Recipe Scaling Calculator',
    subtitle: 'Scale recipes up or down with serving multipliers and batch-planning context',
    focus: 'whole-recipe scaling for larger or smaller batches',
    concept: 'recipe scaling planning',
    researchFocus: 'recipe upscaling, downscaling, and practical batch-planning workflow',
    intro:
      'This calculator is built for resizing a recipe while keeping the relationship between original servings, target servings, and ingredient amounts easy to review.',
    stepTips: [
      'Use the original yield as the anchor instead of guessing the multiplier first.',
      'Set the target servings to match the real event, meal-prep run, or half-batch plan.',
      'Enter one ingredient amount to see how the multiplier affects the recipe line by line.',
      'Carry the same scale factor across the rest of the recipe after reviewing the popup output.',
    ],
    dashboardTips: [
      'The scaled ingredient amount is the fastest audit point.',
      'The scale factor makes doubling, halving, or custom resizing easy to explain.',
      'Base and target servings remain visible to reduce transcription errors.',
      'Notes remind you that pan size and bake time may still need adjustment.',
    ],
    features: [
      'Clear scale-factor workflow',
      'Good for both upscaling and downscaling',
      'Supports batch cooking, event prep, and smaller test runs',
      'Keeps servings and ingredient amounts tied together',
      'Matches the approved popup dashboard design',
      'Adds practical scaling guidance beyond raw multiplication',
    ],
    decisionCards: [
      card('If you are scaling down', 'Watch small amounts closely because seasoning, leavening, and finishing ingredients may not scale perfectly.'),
      card('If you are scaling up', 'Check vessel size, oven space, and cook time rather than assuming the multiplier solves everything.'),
      card('If the recipe is delicate', 'Use the scale factor as a guide and then sanity-check texture and hydration during mixing.'),
      card('If the batch is for service', 'Lock the target servings first so labor, storage, and ingredient purchasing align with the final plan.'),
    ],
    quickRows: [
      row('Scale factor', 'Target servings / base servings', 'The main multiplier for resizing the recipe.'),
      row('Scaled amount', 'Ingredient amount x scale factor', 'Creates the new ingredient quantity for each line item.'),
      row('Batch review', 'Check equipment and timing after scaling', 'Operational limits often matter more on larger batches.'),
      row('Consistency check', 'Keep ratios stable across all ingredients', 'The whole recipe should be scaled from the same anchor.'),
    ],
    references: [REF.kingArthurWeights, REF.kingArthurBakersPct, REF.nistKitchen],
  }),
  'ingredient-substitution': cfg({
    title: 'Ingredient Substitution Calculator',
    subtitle: 'Estimate substitute starting amounts with unit context and recipe-planning notes',
    focus: 'ingredient swap planning',
    concept: 'ingredient substitution planning',
    researchFocus: 'substitution starting ratios, texture risk, and kitchen workflow context',
    intro:
      'This calculator is designed for moments when you do not have the exact ingredient a recipe calls for and need a practical substitution starting point.',
    stepTips: [
      'Enter the original ingredient amount before choosing a substitute strategy.',
      'Use the same unit the recipe actually references so the starting ratio stays easier to audit.',
      'Treat the popup result as a first-pass substitute amount, not a guaranteed perfect swap.',
      'Adjust after checking sweetness, hydration, fat content, or structure in the actual recipe.',
    ],
    dashboardTips: [
      'Suggested substitute amount stays central.',
      'Approximate equivalent weight helps compare volume-based swaps.',
      'The starting ratio shows how aggressive the substitution is.',
      'Notes keep the result framed as a planning tool, not a promise of identical behavior.',
    ],
    features: [
      'Substitution estimate that keeps the original quantity visible',
      'Useful for sweetener and ingredient-swap starting points',
      'Approximate equivalent weight or volume context',
      'Designed for kitchen decision support rather than one-size-fits-all promises',
      'Pairs arithmetic with recipe judgment reminders',
      'Original copy focused on substitutions that affect real cooking outcomes',
    ],
    decisionCards: [
      card('If texture matters', 'Expect hydration and structure to shift even when sweetness or quantity seems close.'),
      card('If flavor matters', 'Use the calculator for quantity planning, then adjust for intensity or sweetness separately.'),
      card('If baking chemistry matters', 'Remember that sugar, fat, and liquid swaps can change browning and rise.'),
      card('If the recipe is high stakes', 'Test a smaller batch first instead of relying on a direct swap in a large production run.'),
    ],
    quickRows: [
      row('Original amount', 'User-entered ingredient quantity', 'Keeps the substitution grounded in the actual recipe.'),
      row('Starting ratio', 'Rule-of-thumb swap factor', 'Creates a practical first-pass substitute amount.'),
      row('Equivalent grams or mL', 'Substitute x approximate unit factor', 'Helps compare volume-based substitutions more realistically.'),
      row('Kitchen review', 'Adjust after checking moisture, sweetness, or structure', 'Substitutions nearly always need some judgment beyond the number.'),
    ],
    references: [REF.kingArthurWeights, REF.kingArthurMeasureFlour, REF.nistKitchen],
  }),
  'cooking-time': cfg({
    title: 'Cooking Time Calculator',
    subtitle: 'Estimate total cook time from prep, base cook duration, weight, and thickness',
    focus: 'time-planning for recipe execution',
    concept: 'cooking-time planning',
    researchFocus: 'cook-time estimation, thickness effects, and practical schedule planning',
    intro:
      'This calculator is built for recipe timing when you want more than a flat cook-time estimate and need weight and thickness context in the same run.',
    stepTips: [
      'Enter prep time separately so the total schedule does not hide labor time.',
      'Use the recipe or package as the base cook-time starting point.',
      'Add weight and thickness to reflect how the dish differs from the baseline.',
      'Use the result as a planning guide, then confirm doneness with the right visual or temperature cue.',
    ],
    dashboardTips: [
      'Estimated total time blends prep and cook phases.',
      'Weight and thickness stay visible so the timing logic is easier to review.',
      'Base cook time remains available as the comparison anchor.',
      'Notes reinforce that final doneness still needs real kitchen confirmation.',
    ],
    features: [
      'Prep and cook time in the same planning flow',
      'Weight and thickness inputs for better time estimates',
      'Useful for meal coordination and prep scheduling',
      'Helps explain why one batch takes longer than another',
      'Matches the approved advanced dashboard pattern',
      'Built for practical timing decisions, not stopwatch-level promises',
    ],
    decisionCards: [
      card('If the result seems long', 'Check whether the weight or thickness differs a lot from the base recipe assumption.'),
      card('If dinner timing matters', 'Use total time for schedule planning, not just the oven or stovetop phase.'),
      card('If the dish is dense', 'Expect internal doneness to lag behind exterior appearance.'),
      card('If precision matters', 'Use a thermometer or recipe-specific cue to finish the job, especially for proteins.'),
    ],
    quickRows: [
      row('Total time', 'Prep minutes + adjusted cook minutes', 'Builds a schedule-friendly result instead of only a cook-phase answer.'),
      row('Weight effect', 'Cook time x weight factor', 'Larger pieces often need more time.'),
      row('Thickness effect', 'Cook time x thickness factor', 'Thickness can matter as much as total weight.'),
      row('Kitchen check', 'Confirm doneness before serving', 'The estimate supports planning, not final certification.'),
    ],
    references: [REF.usdaFoodSafe, REF.usdaLeftovers],
  }),
  'meat-cooking': cfg({
    title: 'Meat Cooking Calculator',
    subtitle: 'Estimate roast time, rest time, and planning checkpoints for meat cookery',
    focus: 'meat-cooking schedule and doneness planning',
    concept: 'meat-cooking planning',
    researchFocus: 'roast-time estimation, safe handling, and rest-time context',
    intro:
      'This calculator is designed for cooks who want a stronger meat-cooking estimate that keeps roast time, rest time, thickness, and oven temperature visible together.',
    stepTips: [
      'Enter the meat weight so the timing has a realistic volume anchor.',
      'Use thickness to reflect how the cut actually cooks in practice.',
      'Keep the oven temperature consistent with the real recipe or method.',
      'Use the result for schedule planning, then verify doneness with a thermometer before serving.',
    ],
    dashboardTips: [
      'Roast time is the lead output for planning.',
      'Rest time is shown separately because carving and serving schedules depend on it.',
      'Weight, thickness, and oven temperature stay visible in the same run.',
      'Warnings remind you that safe doneness should be verified, not assumed.',
    ],
    features: [
      'Roast-time estimate with thickness context',
      'Rest-time guidance for serving workflow',
      'Useful for holiday meals and larger cuts',
      'Supports schedule planning rather than guesswork',
      'Keeps safety context attached to the result',
      'Original content built around real cooking decisions instead of a thin timer widget',
    ],
    decisionCards: [
      card('If service timing matters', 'Plan around both oven time and resting time, not just the point when the meat leaves the oven.'),
      card('If the cut is unusually thick', 'Expect thickness to influence timing even when the total weight looks ordinary.'),
      card('If the oven runs hot or cool', 'Use the estimate as a guide and verify with a thermometer instead of trusting the clock alone.'),
      card('If leftovers are expected', 'Cool and store cooked meat safely so the plan covers post-meal handling too.'),
    ],
    quickRows: [
      row('Roast time', 'Weight-based minutes + thickness adjustment', 'Creates the main cooking estimate.'),
      row('Rest time', 'Base rest + extra time for larger cuts', 'Supports carving and serving quality.'),
      row('Oven anchor', 'User-entered oven temperature', 'Keeps the estimate connected to the actual cooking method.'),
      row('Food-safety check', 'Verify with thermometer before serving', 'Timing is a planning tool, not a doneness certificate.'),
    ],
    references: [REF.usdaFoodSafe, REF.usdaLeftovers],
  }),
  'baking-ratio': cfg({
    title: 'Baking Ratio Calculator',
    subtitle: "Estimate hydration, dough weight, and starter context using baker's percentage logic",
    focus: "baker's-percentage and dough planning",
    concept: 'baking-ratio planning',
    researchFocus: "baker's percentage, hydration, and formula scaling",
    intro:
      'This calculator is built for bakers who want a quick way to interpret hydration and preferment context using the same baker’s-percentage logic used in formula planning.',
    stepTips: [
      'Enter flour weight first because baker’s percentage treats flour as the 100 percent reference point.',
      'Add water weight to calculate hydration directly from the formula.',
      'Use starter or preferment percentage when you want more fermentation context in the same run.',
      'Review total dough weight and hydration together before scaling or mixing.',
    ],
    dashboardTips: [
      'Hydration is the lead output because it shapes dough feel quickly.',
      'Flour and water weights remain visible for easy auditing.',
      'Starter percentage stays attached to the same run.',
      'Total dough weight helps translate the ratio into practical batch planning.',
    ],
    features: [
      "Baker's-percentage workflow for home or pro-style scaling",
      'Hydration and total dough weight in one dashboard',
      'Preferment context included',
      'Useful for comparing recipes with different dough styles',
      'Supports both recipe interpretation and batch planning',
      'Original explanatory content tailored to baking formulas and scaling',
    ],
    decisionCards: [
      card('If the dough feels too dry', 'Review hydration before changing flour blindly, especially if the flour type changed.'),
      card('If the dough feels too slack', 'Check whether water, preferment, or flour assumptions differ from the intended formula.'),
      card('If you are scaling up', 'Use the formula percentages as the stronger reference point than cups or spoons.'),
      card('If fermentation is changing', 'Keep starter percentage visible because it affects dough behavior as well as flavor.'),
    ],
    quickRows: [
      row('Hydration', 'Water weight / flour weight x 100', 'One of the fastest ways to compare dough styles.'),
      row('Flour anchor', 'Flour = 100%', 'This is the base logic behind baker’s percentage.'),
      row('Starter context', 'User-entered preferment percentage', 'Adds fermentation meaning to the formula.'),
      row('Total dough weight', 'Flour + water', 'Useful for sizing batches and dough pieces quickly.'),
    ],
    references: [REF.kingArthurBakersPct, REF.kingArthurWeights, REF.kingArthurMeasureFlour],
  }),
  'yeast-conversion': cfg({
    title: 'Yeast Conversion Calculator',
    subtitle: 'Convert between instant, active dry, and fresh yeast with recipe-planning context',
    focus: 'yeast-type conversion and substitution planning',
    concept: 'yeast conversion planning',
    researchFocus: 'instant vs. active dry vs. fresh yeast behavior and substitution logic',
    intro:
      'This calculator is designed for bakers who need to move between instant, active dry, and fresh yeast while keeping the conversion logic easy to follow.',
    stepTips: [
      'Enter the yeast amount you actually have on hand.',
      'Set the starting yeast type so the conversion anchor is correct.',
      'Choose the target yeast type you want to bake with.',
      'Use the popup output as the quantity starting point, then follow the method instructions for proofing or mixing.',
    ],
    dashboardTips: [
      'Equivalent yeast amount is the primary output.',
      'Fresh-yeast equivalent is shown as a bridge value for transparency.',
      'From and to yeast types stay visible for auditability.',
      'Notes keep the result grounded in recipe planning, not brand-level guarantees.',
    ],
    features: [
      'Converts among instant, active dry, and fresh yeast',
      'Bridge-value logic keeps the math easy to review',
      'Useful when recipe wording and pantry inventory do not match',
      'Supports both home baking and larger formula scaling',
      'Pairs the conversion with method reminders',
      'Original content shaped by baking reference material rather than generic substitution tables',
    ],
    decisionCards: [
      card('If the recipe names a different yeast type', 'Use the converted amount as the quantity anchor, then adapt the method to the yeast form you are using.'),
      card('If proofing behavior changes', 'Remember that fermentation speed and handling can still shift even when the amount is converted well.'),
      card('If you are scaling bread formulas', 'Keep yeast conversion tied to the formula scale instead of mixing unit changes with size changes.'),
      card('If the dough schedule is tight', 'Treat yeast choice and proof time together because quantity is only part of the story.'),
    ],
    quickRows: [
      row('Input yeast', 'User-entered amount', 'The quantity you are starting from.'),
      row('Fresh equivalent', 'Amount converted to a common bridge form', 'Makes the cross-type comparison easier to audit.'),
      row('Target yeast amount', 'Fresh equivalent / target factor', 'Creates the final converted result.'),
      row('Method check', 'Adjust proofing workflow for yeast type', 'The quantity alone does not cover handling differences.'),
    ],
    references: [REF.kingArthurYeast, REF.kingArthurBakersPct],
  }),
  'recipe-cost': cfg({
    title: 'Recipe Cost Calculator',
    subtitle: 'Estimate batch cost and cost per serving from ingredient cost and recipe yield',
    focus: 'recipe costing and per-serving economics',
    concept: 'recipe cost planning',
    researchFocus: 'batch cost, cost per serving, and yield-aware kitchen costing',
    intro:
      'This calculator is built for cooks, meal preppers, and food-service teams who need a fast read on what a recipe actually costs per serving.',
    stepTips: [
      'Enter the cost of an average ingredient line item as your starting cost assumption.',
      'Set the ingredient count so the batch cost reflects the real recipe complexity.',
      'Use actual yield portions instead of a rough guess whenever possible.',
      'Review the popup to compare line cost, batch cost, and per-serving cost together.',
    ],
    dashboardTips: [
      'Cost per serving is the lead metric.',
      'Ingredient line cost and total batch cost stay visible together.',
      'Yield assumptions remain in the same run so the result is easier to trust.',
      'Notes highlight why yield accuracy matters as much as ingredient pricing.',
    ],
    features: [
      'Cost per serving and batch cost in one tool',
      'Yield-aware recipe costing',
      'Useful for home budgeting, catering, and food-service prep',
      'Makes cost assumptions visible instead of hidden in a spreadsheet',
      'Helps connect purchasing and portioning decisions',
      'Original content built around practical recipe economics',
    ],
    decisionCards: [
      card('If the per-serving cost looks high', 'Check ingredient pricing and actual yield before changing the recipe itself.'),
      card('If menu pricing is the goal', 'Use this cost view first, then move into the target food-cost percentage decision.'),
      card('If prep waste is material', 'Pair the recipe cost result with a food-waste review so the edible yield matches the budget.'),
      card('If the recipe is scaled', 'Update both yield and ingredient cost assumptions so the cost per serving stays realistic.'),
    ],
    quickRows: [
      row('Ingredient line cost', 'Average ingredient cost x ingredient count', 'Builds the recipe batch cost base.'),
      row('Cost per serving', 'Batch cost / yield portions', 'Turns total spend into a usable portion metric.'),
      row('Yield anchor', 'Actual servings produced', 'Yield quality drives costing quality.'),
      row('Budget review', 'Update costs when prices or yield change', 'Stale inputs make recipe costing drift quickly.'),
    ],
    references: [REF.nistKitchen, REF.fdaNutrition],
  }),
  'nutrition-label': cfg({
    title: 'Nutrition Label Calculator',
    subtitle: 'Estimate calories and macros per serving from recipe-level ingredient totals',
    focus: 'recipe-level nutrition estimate per serving',
    concept: 'nutrition-label planning',
    researchFocus: 'serving-size guidance, calories per serving, and recipe-level macro estimation',
    intro:
      'This calculator is designed for recipe builders who want a quick nutrition estimate before taking the dish into a more formal labeling workflow.',
    stepTips: [
      'Enter the average calories and macros contributed per ingredient line or unit you are using in the recipe model.',
      'Set the ingredient count so the recipe total is built from a realistic ingredient set.',
      'Choose the serving count carefully because declared servings strongly affect the result.',
      'Use the popup to compare calories, protein, carbs, and fat per serving together.',
    ],
    dashboardTips: [
      'Calories per serving lead the result view.',
      'Protein, carbs, and fat stay visible in the same dashboard.',
      'Serving count remains attached to the nutrition estimate.',
      'Notes keep the result framed as recipe planning rather than a regulatory filing by itself.',
    ],
    features: [
      'Calories and macro estimates per serving',
      'Recipe-total to serving-level workflow',
      'Useful for meal prep, recipe development, and menu planning',
      'Keeps serving assumptions visible',
      'Supports early-stage label planning before a full compliance workflow',
      'Original page content grounded in serving-size context and label interpretation',
    ],
    decisionCards: [
      card('If calories seem low or high', 'Check the serving count first because that assumption often drives the result more than the ingredient list itself.'),
      card('If packaging matters', 'Align servings with how the product or meal is actually portioned in real life.'),
      card('If labeling is formal', 'Treat this as a planning estimate and move to a full compliance workflow if required.'),
      card('If recipes change often', 'Update ingredient count and serving assumptions together so the nutrition estimate stays aligned.'),
    ],
    quickRows: [
      row('Recipe total calories', 'Calories per ingredient x ingredient count', 'Creates the batch-level nutrition base.'),
      row('Calories per serving', 'Total calories / servings', 'Turns the recipe total into a label-style planning number.'),
      row('Macros per serving', 'Total macro grams / servings', 'Keeps protein, carbs, and fat visible together.'),
      row('Serving review', 'Declared servings shape the final label', 'Realistic portions matter as much as ingredient totals.'),
    ],
    references: [REF.fdaNutrition, REF.kingArthurWeights],
  }),
  'menu-pricing': cfg({
    title: 'Menu Pricing Calculator',
    subtitle: 'Estimate menu price from recipe cost, yield, and target food-cost percentage',
    focus: 'menu-pricing and food-cost decision support',
    concept: 'menu pricing planning',
    researchFocus: 'cost-based pricing, food-cost percentage, and yield-aware pricing strategy',
    intro:
      'This calculator is built for recipe developers and operators who need to back into a menu price using the cost of the dish and a target food-cost percentage.',
    stepTips: [
      'Enter the total recipe cost using the best batch-cost assumption you have.',
      'Set a target food-cost percentage that reflects how you want the item to perform.',
      'Keep the recipe yield visible because portion count affects both perceived value and actual economics.',
      'Review the suggested menu price together with gross margin before using it in planning.',
    ],
    dashboardTips: [
      'Suggested menu price is the lead result.',
      'Gross margin stays visible for quick sanity checks.',
      'Target food-cost percentage remains attached to the same run.',
      'Yield portions add context so price is not detached from serving reality.',
    ],
    features: [
      'Cost-based menu pricing workflow',
      'Target food-cost percentage built into the logic',
      'Gross margin shown next to the suggested price',
      'Useful for recipe development and restaurant planning',
      'Helps connect yield, cost, and selling price',
      'Original content focused on pricing decisions rather than only markup math',
    ],
    decisionCards: [
      card('If the suggested price feels too high', 'Review recipe cost and yield first before forcing the item into a weaker margin.'),
      card('If the market limits price', 'Use the result to identify where the recipe cost or portion size may need redesign.'),
      card('If the dish is premium', 'The calculator gives a cost anchor, but your concept and guest expectation still influence final pricing.'),
      card('If margins are tight', 'Keep gross margin and food-cost target visible at the same time when evaluating the item.'),
    ],
    quickRows: [
      row('Suggested price', 'Recipe cost / target food-cost percentage', 'Backs into a selling price from the cost structure.'),
      row('Gross margin', 'Suggested price - recipe cost', 'Shows how much price remains after direct recipe cost.'),
      row('Food-cost target', 'User-entered percentage', 'This assumption shapes the pricing outcome strongly.'),
      row('Yield context', 'Portion count affects item economics', 'Pricing gets stronger when yield and cost stay linked.'),
    ],
    references: [REF.fdaNutrition, REF.nistKitchen],
  }),
  'food-waste': cfg({
    title: 'Food Waste Calculator',
    subtitle: 'Estimate waste percentage and edible yield from purchased and usable weight',
    focus: 'waste tracking and edible-yield planning',
    concept: 'food-waste planning',
    researchFocus: 'yield percentage, trim loss, and production-efficiency review',
    intro:
      'This calculator is designed for kitchens that want a clearer view of waste percentage and edible yield when trimming, peeling, or prep loss matters.',
    stepTips: [
      'Enter purchased weight before trimming or prep loss occurs.',
      'Enter edible weight after the prep process is complete.',
      'Review both waste percentage and edible yield together in the popup.',
      'Use the result to improve purchasing, recipe cost, or prep expectations over time.',
    ],
    dashboardTips: [
      'Food waste percentage is the lead output.',
      'Edible yield remains visible because it matters operationally.',
      'Waste weight helps quantify actual loss in pounds.',
      'Notes frame the result as a purchasing and prep-efficiency tool.',
    ],
    features: [
      'Waste percentage and yield percentage in one run',
      'Useful for trimming, peeling, and production-loss review',
      'Pairs waste weight with the higher-level percentage',
      'Supports recipe costing and purchasing decisions',
      'Turns prep loss into something easier to track and improve',
      'Original content written for kitchen operations rather than sustainability slogans alone',
    ],
    decisionCards: [
      card('If waste is high', 'Review whether purchasing specs, trimming standards, or prep methods need adjustment.'),
      card('If edible yield is low', 'Expect costing and menu pricing to shift unless the recipe or purchasing plan changes.'),
      card('If results vary a lot', 'Track several runs because one prep session may not represent the normal range.'),
      card('If storage matters', 'Yield planning becomes more useful when paired with batch size and freezer or holding decisions.'),
    ],
    quickRows: [
      row('Waste percentage', '(Purchased - edible) / purchased x 100', 'Shows how much of the purchased weight was not usable.'),
      row('Yield percentage', '100 - waste percentage', 'Helps connect prep loss to usable output.'),
      row('Waste weight', 'Purchased weight - edible weight', 'Quantifies actual trim or loss.'),
      row('Operational review', 'Use yield for costing and prep planning', 'Waste becomes more actionable when tied to decisions.'),
    ],
    references: [REF.usdaLeftovers, REF.usdaFoodSafe],
  }),
  'batch-cooking': cfg({
    title: 'Batch Cooking Calculator',
    subtitle: 'Scale batch size, servings, and cost together for meal prep or production planning',
    focus: 'batch-size and meal-prep planning',
    concept: 'batch-cooking planning',
    researchFocus: 'batch scaling, portion planning, and production-friendly recipe resizing',
    intro:
      'This calculator is built for batch cooking, where the recipe needs to be resized and the cost impact of that scale change needs to stay visible.',
    stepTips: [
      'Start with the base servings from the original recipe.',
      'Enter the target servings for the batch you actually need to produce.',
      'Add the base batch cost so the economic effect of scaling stays visible too.',
      'Use the popup to review scale factor, base assumptions, and scaled cost before purchasing or prep begins.',
    ],
    dashboardTips: [
      'Scaled batch cost is the lead output.',
      'Scale factor remains visible for recipe auditing.',
      'Base and target servings stay side by side.',
      'Notes emphasize the difference between mathematical scale and operational feasibility.',
    ],
    features: [
      'Batch cost and scaling factor together',
      'Useful for meal prep, events, and production runs',
      'Ties serving count directly to cost expansion',
      'Helps compare base and target batch size quickly',
      'Popup-only dashboard follows the approved advanced pattern',
      'Original page content focused on real batch execution decisions',
    ],
    decisionCards: [
      card('If the batch is much larger', 'Check container size, cooling space, and storage capacity instead of trusting the scale factor alone.'),
      card('If the batch is much smaller', 'Pay extra attention to seasoning and small measured ingredients that may not scale perfectly.'),
      card('If cost jumps quickly', 'Use the scaled batch cost to plan purchasing before prep starts.'),
      card('If service is spread out', 'Pair batch planning with freezer or holding assumptions so production volume stays practical.'),
    ],
    quickRows: [
      row('Scale factor', 'Target servings / base servings', 'The core multiplier for the batch change.'),
      row('Scaled batch cost', 'Base batch cost x scale factor', 'Shows the cost impact of resizing.'),
      row('Serving comparison', 'Base vs. target output', 'Keeps the batch decision tied to actual yield.'),
      row('Production review', 'Check space, equipment, and holding', 'Large batch math still needs operational sanity checks.'),
    ],
    references: [REF.kingArthurBakersPct, REF.usdaLeftovers],
  }),
  'freezer-storage': cfg({
    title: 'Freezer Storage Calculator',
    subtitle: 'Estimate total freezer weight, portion volume, and storage-time planning checkpoints',
    focus: 'freezer portioning and storage planning',
    concept: 'freezer-storage planning',
    researchFocus: 'portion weight, freezer volume, and quality-oriented storage timing',
    intro:
      'This calculator is designed for meal prep and leftovers planning when the important question is how much food is going into the freezer and how long it is meant to stay there.',
    stepTips: [
      'Enter the number of portions you plan to freeze.',
      'Add the weight of each portion to estimate the total freezer load.',
      'Set the planned storage months so timing stays visible in the same run.',
      'Use the result for container and space planning, then follow safe handling and storage practices in real life.',
    ],
    dashboardTips: [
      'Total freezer weight is the lead output.',
      'Equivalent pounds help with larger-batch planning.',
      'Portion count and portion weight remain visible together.',
      'Storage months are shown as a planning cue, not a guarantee of quality or safety on their own.',
    ],
    features: [
      'Total freezer load from portions and portion weight',
      'Useful for meal prep and leftovers planning',
      'Storage months kept visible in the same workflow',
      'Supports container, shelf, and space decisions',
      'Brings portioning and storage into one calculator run',
      'Original content centered on freezer planning instead of generic storage advice',
    ],
    decisionCards: [
      card('If freezer space is tight', 'Use the total weight result as a quick sanity check before cooking more than you can store well.'),
      card('If portions vary', 'Standardize portion weight first so your storage plan is more realistic.'),
      card('If the storage time is long', 'Treat the month count as a quality-planning reminder and rely on safe handling practices for the actual storage workflow.'),
      card('If you are batch cooking', 'Use freezer planning alongside batch scaling so cooking volume and storage volume stay aligned.'),
    ],
    quickRows: [
      row('Total freezer weight', 'Portions x portion weight', 'Shows the overall load entering storage.'),
      row('Equivalent pounds', 'Total ounces / 16', 'Helps with larger-batch planning and space estimates.'),
      row('Portion anchor', 'Number of portions planned', 'Keeps the storage result tied to actual meals.'),
      row('Storage reminder', 'Months planned in freezer', 'A quality cue that supports better meal-prep timing.'),
    ],
    references: [REF.usdaLeftovers, REF.usdaFoodSafe],
  }),
  'pantry-inventory': cfg({
    title: 'Pantry Inventory Calculator',
    subtitle: 'Estimate reorder quantity and weeks of supply from on-hand stock and usage rate',
    focus: 'inventory control and pantry replenishment planning',
    concept: 'pantry-inventory planning',
    researchFocus: 'par levels, weeks of supply, and pantry replenishment decisions',
    intro:
      'This calculator is built for pantry and dry-storage planning when you want to know not just what you have on hand, but whether it is enough for your target stock level and usage pace.',
    stepTips: [
      'Enter the units currently on hand.',
      'Add the weekly usage rate based on actual consumption when possible.',
      'Set the target par level you want the pantry to return to.',
      'Review reorder quantity and weeks of supply together before restocking.',
    ],
    dashboardTips: [
      'Reorder quantity is the main operational output.',
      'Weeks of supply adds time-based context to the stock count.',
      'On-hand and target par levels stay visible together.',
      'Notes explain why reorder timing matters as much as unit totals.',
    ],
    features: [
      'Reorder quantity from par-level logic',
      'Weeks-of-supply view for better timing',
      'Useful for home pantries and small production stockrooms',
      'Connects current stock, usage rate, and target inventory',
      'Helps reduce last-minute shortages or overbuying',
      'Original content focused on inventory decisions rather than static stock counts',
    ],
    decisionCards: [
      card('If weeks of supply are low', 'Reorder timing matters more than the raw on-hand number suggests.'),
      card('If reorder quantity is zero or negative', 'Your current stock may already exceed the target par level, so the next decision may be usage planning instead of purchasing.'),
      card('If usage swings seasonally', 'Refresh the weekly-use assumption instead of relying on a stale average forever.'),
      card('If storage is limited', 'Keep target par grounded in what you can store well, not just what feels safe to buy.'),
    ],
    quickRows: [
      row('Reorder quantity', 'Target par - on hand', 'Shows how many units are needed to restore the target level.'),
      row('Weeks of supply', 'On hand / weekly use', 'Adds time-based visibility to the stock decision.'),
      row('Par level', 'Target units to keep available', 'Acts as the inventory anchor for restocking.'),
      row('Inventory review', 'Adjust usage and par as reality changes', 'The best pantry plans stay current instead of static.'),
    ],
    references: [REF.usdaLeftovers, REF.nistKitchen],
  }),
};
