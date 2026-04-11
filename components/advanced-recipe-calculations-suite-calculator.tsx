'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  Info,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Route,
  Shield,
  Target,
  X,
} from 'lucide-react';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion from '@/components/ui/faq-accordion';
import {
  RECIPE_CALCULATIONS_CONFIG,
  RecipeCalculationsVariant,
} from '@/lib/recipe-calculations-suite-config';
import {
  buildRecipeCalculationsResult,
  DEFAULT_INPUTS,
  Inputs,
  Result,
  ResultMetric,
} from '@/lib/recipe-calculations-suite-math';

interface Props {
  variant: RecipeCalculationsVariant;
}

interface Option {
  value: string;
  label: string;
}

interface FieldDef {
  key: keyof Inputs;
  label: string;
  step?: string;
  type?: 'number' | 'select';
  options?: Option[];
}

const ingredientUnitOptions: Option[] = [
  { value: 'gram', label: 'Grams' },
  { value: 'ounce', label: 'Ounces' },
  { value: 'cup', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'tsp', label: 'Teaspoons' },
];

const yeastTypeOptions: Option[] = [
  { value: 'instant', label: 'Instant yeast' },
  { value: 'active-dry', label: 'Active dry yeast' },
  { value: 'fresh', label: 'Fresh yeast' },
];

const formatMetric = (metric: ResultMetric) => {
  const decimals = metric.decimals ?? 2;
  if (metric.suffix) return `${metric.value.toFixed(decimals)}${metric.suffix}`;
  return metric.value.toFixed(decimals);
};

const formatPrimary = (result: Result) => {
  const decimals = result.primaryDecimals ?? 2;
  if (result.primarySuffix) return `${result.primaryValue.toFixed(decimals)}${result.primarySuffix}`;
  return result.primaryValue.toFixed(decimals);
};

const fieldsForVariant = (variant: RecipeCalculationsVariant): FieldDef[] => {
  switch (variant) {
    case 'recipe-converter':
    case 'recipe-scaling':
      return [
        { key: 'baseServings', label: 'Base servings', step: '1' },
        { key: 'targetServings', label: 'Target servings', step: '1' },
        { key: 'ingredientAmount', label: 'Ingredient amount', step: '0.01' },
        { key: 'ingredientUnit', label: 'Ingredient unit', type: 'select', options: ingredientUnitOptions },
      ];
    case 'serving-size':
      return [
        { key: 'ingredientAmount', label: 'Total recipe yield', step: '0.01' },
        { key: 'ingredientUnit', label: 'Yield unit', type: 'select', options: ingredientUnitOptions },
        { key: 'targetServings', label: 'Servings planned', step: '1' },
      ];
    case 'ingredient-substitution':
      return [
        { key: 'ingredientAmount', label: 'Original amount', step: '0.01' },
        { key: 'ingredientUnit', label: 'Original unit', type: 'select', options: ingredientUnitOptions },
      ];
    case 'cooking-time':
      return [
        { key: 'prepMinutes', label: 'Prep minutes', step: '1' },
        { key: 'cookMinutes', label: 'Base cook minutes', step: '1' },
        { key: 'weightPounds', label: 'Weight (lb)', step: '0.1' },
        { key: 'thicknessInches', label: 'Thickness (in)', step: '0.1' },
      ];
    case 'meat-cooking':
      return [
        { key: 'weightPounds', label: 'Meat weight (lb)', step: '0.1' },
        { key: 'thicknessInches', label: 'Thickness (in)', step: '0.1' },
        { key: 'ovenTempF', label: 'Oven temperature (F)', step: '1' },
      ];
    case 'baking-ratio':
      return [
        { key: 'flourWeightGrams', label: 'Flour weight (g)', step: '1' },
        { key: 'waterWeightGrams', label: 'Water weight (g)', step: '1' },
        { key: 'starterPercent', label: 'Starter or preferment (%)', step: '0.1' },
      ];
    case 'yeast-conversion':
      return [
        { key: 'yeastAmount', label: 'Yeast amount (g)', step: '0.1' },
        { key: 'yeastFromType', label: 'Convert from', type: 'select', options: yeastTypeOptions },
        { key: 'yeastToType', label: 'Convert to', type: 'select', options: yeastTypeOptions },
      ];
    case 'recipe-cost':
      return [
        { key: 'ingredientCost', label: 'Average ingredient line cost', step: '0.01' },
        { key: 'ingredientCount', label: 'Ingredient count', step: '1' },
        { key: 'yieldPortions', label: 'Yield portions', step: '1' },
      ];
    case 'nutrition-label':
      return [
        { key: 'caloriesPerIngredient', label: 'Calories per ingredient', step: '1' },
        { key: 'proteinPerIngredient', label: 'Protein per ingredient (g)', step: '0.1' },
        { key: 'carbsPerIngredient', label: 'Carbs per ingredient (g)', step: '0.1' },
        { key: 'fatPerIngredient', label: 'Fat per ingredient (g)', step: '0.1' },
        { key: 'ingredientCount', label: 'Ingredient count', step: '1' },
        { key: 'targetServings', label: 'Servings', step: '1' },
      ];
    case 'menu-pricing':
      return [
        { key: 'totalRecipeCost', label: 'Total recipe cost', step: '0.01' },
        { key: 'targetFoodCostPercent', label: 'Target food cost (%)', step: '0.1' },
        { key: 'yieldPortions', label: 'Yield portions', step: '1' },
      ];
    case 'food-waste':
      return [
        { key: 'wastePurchasedWeight', label: 'Purchased weight (lb)', step: '0.1' },
        { key: 'wasteEdibleWeight', label: 'Edible weight (lb)', step: '0.1' },
      ];
    case 'batch-cooking':
      return [
        { key: 'baseServings', label: 'Base servings', step: '1' },
        { key: 'targetServings', label: 'Target servings', step: '1' },
        { key: 'totalRecipeCost', label: 'Base batch cost', step: '0.01' },
      ];
    case 'freezer-storage':
      return [
        { key: 'freezerPortions', label: 'Portions', step: '1' },
        { key: 'portionWeightOz', label: 'Portion weight (oz)', step: '0.1' },
        { key: 'freezerMonths', label: 'Storage months', step: '0.1' },
      ];
    case 'pantry-inventory':
      return [
        { key: 'onHandUnits', label: 'On-hand units', step: '1' },
        { key: 'weeklyUseUnits', label: 'Weekly use', step: '0.1' },
        { key: 'targetParUnits', label: 'Target par units', step: '1' },
      ];
  }
};

export default function AdvancedRecipeCalculationsSuiteCalculator({ variant }: Props) {
  const config = RECIPE_CALCULATIONS_CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>({ ...DEFAULT_INPUTS[variant] });
  const [showResults, setShowResults] = useState(false);
  const result = useMemo(() => buildRecipeCalculationsResult(variant, inputs), [inputs, variant]);

  const setField = (key: keyof Inputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setInputs({ ...DEFAULT_INPUTS[variant] })}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fieldsForVariant(variant).map((field) => (
            <div key={field.key}>
              <label className="mb-2 block text-sm font-medium text-foreground">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={inputs[field.key]}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-foreground"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  step={field.step ?? 'any'}
                  value={inputs[field.key]}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-foreground"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            <Calculator className="h-4 w-4" />
            {config.cta}
          </button>
          <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            Results open in the approved popup-only advanced dashboard pattern.
          </div>
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Advanced Results Dashboard</div>
                <h3 className="text-2xl font-bold text-foreground">{config.title}</h3>
              </div>
              <button type="button" onClick={() => setShowResults(false)} className="rounded-lg border p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 rounded-xl border bg-muted/40 p-5">
              <div className="text-sm text-muted-foreground">{result.primaryLabel}</div>
              <div className="mt-2 text-4xl font-bold text-foreground">{formatPrimary(result)}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {result.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <div className="mt-1 text-xl font-bold text-foreground">{formatMetric(metric)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-xl border p-5">
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  What This Run Tells You
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.notes.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border p-5">
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Watchouts and Edge Cases
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.warnings.length ? (
                    result.warnings.map((item) => <li key={item}>- {item}</li>)
                  ) : (
                    <li>- No major warnings were triggered by the current assumptions.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <Calculator className="h-6 w-6 text-primary" />
          About This Calculator
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-foreground">
          {config.aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Primary Focus
            </div>
            {config.focus}
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Info className="h-4 w-4 text-primary" />
              Concept Lens
            </div>
            This page is designed to make {config.concept} easier to interpret than a bare single-number answer.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Better Result Context
            </div>
            Yield, cost, storage, or timing context stays attached to the same run instead of being split across disconnected tools.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Research Focus
            </div>
            {config.researchFocus}
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-muted p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            What This Advanced Version Adds
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {config.features.map((feature) => (
              <div key={feature} className="flex items-start gap-2 rounded-lg border bg-background p-3">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online {config.title}
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-blue-900 dark:text-blue-100">
              <Route className="h-5 w-5" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              {config.stepTips.map((tip, index) => (
                <div key={tip} className="rounded-lg border border-blue-200 bg-background p-3 dark:border-blue-700">
                  {index + 1}. {tip}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-900 dark:text-green-100">
              <BarChart3 className="h-5 w-5" />
              Your Results Dashboard (Popup Only)
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground md:grid-cols-2">
              {config.dashboardTips.map((tip) => (
                <div key={tip} className="rounded-lg bg-white p-3 dark:bg-gray-800">
                  {tip}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-900 dark:text-orange-100">
              <Info className="h-5 w-5" />
              Why Use This Version?
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {config.whyUse.map((item) => (
                <div key={item.title} className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <h4 className="mb-2 font-medium text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-amber-900 dark:text-amber-100">
              <Lightbulb className="h-5 w-5" />
              {config.title} Advanced Features
            </h3>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              {config.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-muted/40 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Target className="h-5 w-5 text-primary" />
              Planning Decision Playbook
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {config.decisionCards.map((item) => (
                <div key={item.title} className="rounded-lg border bg-background p-4">
                  <h4 className="mb-2 font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          Understanding {config.concept}
        </h2>
        <div className="space-y-4">
          {config.understanding.map((item) => (
            <div key={item.title} className="rounded-xl border p-5">
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <BarChart3 className="h-6 w-6 text-primary" />
          Quick Reference Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 pr-4 text-left font-semibold text-foreground">Reference Point</th>
                <th className="py-3 pr-4 text-left font-semibold text-foreground">Formula or Rule</th>
                <th className="py-3 text-left font-semibold text-foreground">Why It Matters</th>
              </tr>
            </thead>
            <tbody>
              {config.quickRows.map((item) => (
                <tr key={item.label} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 text-foreground">{item.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.formula}</td>
                  <td className="py-3 text-muted-foreground">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          References & Resources
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {config.references.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border p-4 transition-colors hover:border-primary"
            >
              <div className="font-medium text-foreground">{item.label}</div>
              <div className="mt-2 break-all text-sm text-muted-foreground">{item.url}</div>
            </a>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          These links were selected to support the formulas, food-safety assumptions, storage guidance, and recipe-planning logic used in this calculator.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <MessageSquare className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={config.faqs} showTitle={false} />
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <CalculatorReview calculatorName={config.reviewName} />
      </div>
    </div>
  );
}
