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
  KITCHEN_MEASUREMENTS_CONFIG,
  KitchenMeasurementsVariant,
} from '@/lib/kitchen-measurements-suite-config';
import {
  buildKitchenMeasurementsResult,
  DEFAULT_INPUTS,
  Inputs,
  Result,
  ResultMetric,
} from '@/lib/kitchen-measurements-suite-math';

interface Props {
  variant: KitchenMeasurementsVariant;
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

const ingredientOptions: Option[] = [
  { value: 'all-purpose-flour', label: 'All-purpose flour' },
  { value: 'bread-flour', label: 'Bread flour' },
  { value: 'whole-wheat-flour', label: 'Whole wheat flour' },
  { value: 'granulated-sugar', label: 'Granulated sugar' },
  { value: 'brown-sugar', label: 'Brown sugar' },
  { value: 'butter', label: 'Butter' },
  { value: 'water', label: 'Water' },
  { value: 'milk', label: 'Milk' },
  { value: 'honey', label: 'Honey' },
];

const flourOptions: Option[] = [
  { value: 'all-purpose', label: 'All-purpose flour' },
  { value: 'bread', label: 'Bread flour' },
  { value: 'whole-wheat', label: 'Whole wheat flour' },
  { value: 'rye', label: 'Rye flour' },
  { value: 'cake', label: 'Cake flour' },
  { value: 'almond', label: 'Almond flour' },
];

const unitOptions: Option[] = [
  { value: 'tsp', label: 'Teaspoons' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'cup', label: 'Cups' },
  { value: 'floz', label: 'Fluid ounces' },
  { value: 'pint', label: 'Pints' },
  { value: 'quart', label: 'Quarts' },
  { value: 'liter', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
];

const eggSizeOptions: Option[] = [
  { value: 'peewee', label: 'Peewee' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra large' },
  { value: 'jumbo', label: 'Jumbo' },
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

const fieldsForVariant = (variant: KitchenMeasurementsVariant): FieldDef[] => {
  switch (variant) {
    case 'cups-to-grams':
      return [
        { key: 'cups', label: 'Cups', step: '0.01' },
        { key: 'ingredient', label: 'Ingredient', type: 'select', options: ingredientOptions },
      ];
    case 'ounces-to-grams':
      return [{ key: 'ounces', label: 'Ounces', step: '0.01' }];
    case 'tablespoon-to-cup':
      return [{ key: 'tablespoons', label: 'Tablespoons', step: '0.1' }];
    case 'metric-to-imperial-converter':
      return [
        { key: 'amount', label: 'Metric amount', step: '0.1' },
        {
          key: 'metricMode',
          label: 'Metric type',
          type: 'select',
          options: [
            { value: 'ml', label: 'Milliliters to U.S. volume' },
            { value: 'g', label: 'Grams to ounces' },
            { value: 'c', label: 'Celsius to Fahrenheit' },
          ],
        },
      ];
    case 'temperature-conversion':
      return [
        { key: 'tempValue', label: 'Temperature', step: '0.1' },
        {
          key: 'tempUnit',
          label: 'Input unit',
          type: 'select',
          options: [
            { value: 'f', label: 'Fahrenheit' },
            { value: 'c', label: 'Celsius' },
          ],
        },
      ];
    case 'baking-pan-conversion':
      return [
        { key: 'sourceLengthInches', label: 'Source pan length (in)', step: '0.1' },
        { key: 'sourceWidthInches', label: 'Source pan width (in)', step: '0.1' },
        { key: 'targetLengthInches', label: 'Target pan length (in)', step: '0.1' },
        { key: 'targetWidthInches', label: 'Target pan width (in)', step: '0.1' },
      ];
    case 'egg-size-substitution':
      return [
        { key: 'eggCount', label: 'Source egg count', step: '1' },
        { key: 'sourceEggSize', label: 'Source egg size', type: 'select', options: eggSizeOptions },
        { key: 'targetEggSize', label: 'Target egg size', type: 'select', options: eggSizeOptions },
      ];
    case 'butter-conversion':
      return [
        { key: 'butterAmount', label: 'Butter amount', step: '0.1' },
        {
          key: 'butterUnit',
          label: 'Input unit',
          type: 'select',
          options: [
            { value: 'stick', label: 'Sticks' },
            { value: 'tbsp', label: 'Tablespoons' },
            { value: 'cup', label: 'Cups' },
            { value: 'gram', label: 'Grams' },
          ],
        },
      ];
    case 'sugar-substitution':
      return [
        { key: 'sugarCups', label: 'Original sugar (cups)', step: '0.01' },
        {
          key: 'sugarSubstitute',
          label: 'Substitute',
          type: 'select',
          options: [
            { value: 'honey', label: 'Honey' },
            { value: 'maple', label: 'Maple syrup' },
            { value: 'coconut', label: 'Coconut sugar' },
            { value: 'brown-sugar', label: 'Brown sugar' },
          ],
        },
      ];
    case 'flour-weight':
      return [
        { key: 'flourCups', label: 'Flour cups', step: '0.01' },
        { key: 'flourType', label: 'Flour type', type: 'select', options: flourOptions },
      ];
    case 'liquid-measurement':
    case 'dry-measurement':
      return [
        { key: 'amount', label: 'Amount', step: '0.01' },
        { key: 'fromUnit', label: 'Input unit', type: 'select', options: unitOptions },
      ];
    case 'kitchen-timer':
      return [
        { key: 'timerHours', label: 'Hours', step: '1' },
        { key: 'timerMinutes', label: 'Minutes', step: '1' },
        { key: 'timerSeconds', label: 'Seconds', step: '1' },
      ];
    case 'proof-time':
      return [
        { key: 'baseProofMinutes', label: 'Base proof time (min)', step: '1' },
        { key: 'proofTempF', label: 'Proof temperature (F)', step: '0.1' },
        { key: 'doughStyleFactor', label: 'Dough style factor', step: '0.1' },
      ];
    case 'fermentation':
      return [
        { key: 'waterWeightGrams', label: 'Water weight (g)', step: '1' },
        { key: 'brinePercent', label: 'Brine percentage (%)', step: '0.1' },
      ];
  }
};

export default function AdvancedKitchenMeasurementsSuiteCalculator({ variant }: Props) {
  const config = KITCHEN_MEASUREMENTS_CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>({ ...DEFAULT_INPUTS[variant] });
  const [showResults, setShowResults] = useState(false);
  const result = useMemo(() => buildKitchenMeasurementsResult(variant, inputs), [inputs, variant]);

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
            This page is designed to make {config.concept} easier to interpret than a bare conversion answer.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Better Result Context
            </div>
            Primary metrics, companion units, and project watchouts stay attached to the same run.
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
          These links were selected to support the formulas, kitchen assumptions, and conversion patterns used in this calculator.
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
