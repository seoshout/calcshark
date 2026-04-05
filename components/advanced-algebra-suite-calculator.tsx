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
  RefreshCw,
  Route,
  Shield,
  Target,
  X,
} from 'lucide-react';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion from '@/components/ui/faq-accordion';
import { ALGEBRA_CONFIG, AlgebraVariant, DEFAULT_INPUTS } from '@/lib/algebra-suite-config';
import { buildAlgebraResult, Inputs, Result } from '@/lib/algebra-suite-math';

interface Props {
  variant: AlgebraVariant;
}

const statusLabels: Record<Result['status'], string> = {
  exact: 'Exact or Complete Read',
  approximate: 'Approximate Numeric Read',
  'special-case': 'Special-Case Read',
  invalid: 'Check Inputs',
};

function InputGrid({
  variant,
  inputs,
  onChange,
}: {
  variant: AlgebraVariant;
  inputs: Inputs;
  onChange: (field: keyof Inputs, value: string) => void;
}) {
  const inputClassName = 'w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground';
  const labelClassName = 'block text-sm font-medium text-foreground mb-2';

  const renderNumber = (field: keyof Inputs, label: string) => (
    <div key={field}>
      <label className={labelClassName}>{label}</label>
      <input
        type="number"
        step="any"
        value={inputs[field]}
        onChange={(e) => onChange(field, e.target.value)}
        className={inputClassName}
      />
    </div>
  );

  switch (variant) {
    case 'quadratic-formula':
    case 'factoring':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['a', 'b', 'c'] as const).map((field) => renderNumber(field, `Coefficient ${field}`))}
        </div>
      );
    case 'slope':
    case 'distance-formula':
    case 'midpoint':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {(['x1', 'y1', 'x2', 'y2'] as const).map((field) => renderNumber(field, field.toUpperCase()))}
        </div>
      );
    case 'linear-equation':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {(['a', 'b', 'c', 'd'] as const).map((field) => renderNumber(field, `Equation coefficient ${field}`))}
        </div>
      );
    case 'system-of-equations':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['a1', 'b1', 'c1', 'a2', 'b2', 'c2'] as const).map((field) => renderNumber(field, field.toUpperCase()))}
        </div>
      );
    case 'polynomial':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClassName}>Coefficients (highest degree to constant)</label>
            <input
              type="text"
              value={inputs.polynomialCoefficients}
              onChange={(e) => onChange('polynomialCoefficients', e.target.value)}
              className={inputClassName}
            />
          </div>
          {renderNumber('xValue', 'x-value')}
        </div>
      );
    case 'exponent':
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{renderNumber('base', 'Base')}{renderNumber('exponent', 'Exponent')}</div>;
    case 'logarithm':
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{renderNumber('base', 'Base')}{renderNumber('logValue', 'Value')}</div>;
    case 'scientific-notation':
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <label className={labelClassName}>Mode</label>
            <select
              value={inputs.notationMode}
              onChange={(e) => onChange('notationMode', e.target.value as Inputs['notationMode'])}
              className={inputClassName}
            >
              <option value="decimal-to-scientific">Decimal to scientific notation</option>
              <option value="scientific-to-decimal">Scientific notation to decimal</option>
            </select>
          </div>
          {inputs.notationMode === 'decimal-to-scientific' ? (
            <div className="md:col-span-3">{renderNumber('decimalInput', 'Decimal input')}</div>
          ) : (
            <>
              <div>{renderNumber('mantissa', 'Mantissa')}</div>
              <div>{renderNumber('sciExponent', 'Exponent')}</div>
            </>
          )}
        </div>
      );
    case 'square-root':
    case 'cube-root':
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{renderNumber('radicand', 'Radicand')}</div>;
    case 'nth-root':
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{renderNumber('index', 'Index')}{renderNumber('radicand', 'Radicand')}</div>;
    default:
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{renderNumber('absoluteInput', 'Input value')}</div>;
  }
}

export default function AdvancedAlgebraSuiteCalculator({ variant }: Props) {
  const config = ALGEBRA_CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<Result | null>(null);
  const [showModal, setShowModal] = useState(false);
  const resultTitle = useMemo(() => `${config.title} Results Dashboard`, [config.title]);

  const onChange = (field: keyof Inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onReset = () => {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
    setShowModal(false);
  };

  const onCalculate = () => {
    const nextResult = buildAlgebraResult(variant, inputs);
    if (nextResult.status === 'invalid') {
      alert(nextResult.warnings[0] || 'Please review your inputs and try again.');
      return;
    }
    setResult(nextResult);
    setShowModal(true);
  };

  const aboutParagraphs = [
    `This advanced ${config.title.toLowerCase()} is built to do more than print a bare answer. It keeps ${config.focus} tied to the supporting math so the result feels usable, not disconnected.`,
    `The strongest live ${config.concept} tools usually surface exact form, decimal form, or classification together. This version follows that same stronger pattern while keeping the site's approved styling and popup-results flow intact.`,
    `Use it when you want a faster homework check, a clearer conceptual read on ${config.concept}, or a calculator page that still teaches while it computes.`,
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Advanced Mode</h3>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            This version keeps exact math, decimal output, and result classification together so the tool is more useful than a basic answer-only widget.
          </p>
        </div>

        <InputGrid variant={variant} inputs={inputs} onChange={onChange} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCalculate}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {config.cta}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-lg border border-input px-5 py-3 font-medium transition-colors hover:bg-muted"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Inputs
          </button>
        </div>
      </div>

      {showModal && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${config.title} results dashboard`}
        >
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-background shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-background px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{resultTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  Popup-only results, aligned to the approved advanced calculator pattern.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                aria-label="Close results"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-xl border p-6">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    result.status === 'exact'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : result.status === 'approximate'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                  }`}
                >
                  {statusLabels[result.status]}
                </span>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{result.primaryLabel}</div>
                    <div className="break-words text-3xl font-bold">{result.primaryValue}</div>
                  </div>
                  {result.exactValue && (
                    <div className="md:col-span-2">
                      <div className="text-xs text-muted-foreground">{result.exactLabel || 'Exact Form'}</div>
                      <div className="break-words text-2xl font-semibold">{result.exactValue}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {result.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="mt-1 break-words text-xl font-bold">{metric.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-xl border p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    What This Run Tells You
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.notes.map((item, index) => (
                      <li key={index}>- {item}</li>
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
                      result.warnings.map((item, index) => <li key={index}>- {item}</li>)
                    ) : (
                      <li>- No major warnings were triggered by the current inputs.</li>
                    )}
                  </ul>
                </div>
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
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Primary Focus
            </div>
            This version is centered on {config.focus} while still showing the surrounding math that keeps the result honest.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Info className="h-4 w-4 text-primary" />
              Concept Lens
            </div>
            The page is designed to make {config.concept} easier to read, not just faster to compute.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Better Result Context
            </div>
            Exact values, decimal output, and classification live together so the result is easier to verify and reuse.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Edge-Case Protection
            </div>
            Warnings help catch undefined slopes, invalid logarithms, even-root issues, and other special cases before they become hidden mistakes.
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
              <Target className="h-5 w-5" />
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
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <Lightbulb className="h-6 w-6 text-primary" />
          Problem-Solving Playbook
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <h3 className="mb-2 font-semibold text-foreground">Start with clean input meaning</h3>
            <p className="text-sm text-muted-foreground">
              Know which field is a coefficient, which field is a coordinate, and which field is a base, exponent, or radicand before you calculate.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="mb-2 font-semibold text-foreground">Read the classification first</h3>
            <p className="text-sm text-muted-foreground">
              The exact number matters, but the classification usually tells you what kind of algebra problem you are actually solving.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="mb-2 font-semibold text-foreground">Use exact forms when teaching or checking work</h3>
            <p className="text-sm text-muted-foreground">
              Radicals, fractions, and symbolic forms are usually better for homework checks and derivations than rounded decimals.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="mb-2 font-semibold text-foreground">Use decimals when estimating or graphing</h3>
            <p className="text-sm text-muted-foreground">
              Rounded values are often the fastest way to compare size, reasonableness, or whether a plotted answer makes sense.
            </p>
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
              {config.quickRows.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 text-foreground">{row.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.formula}</td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
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
              key={`${item.label}-${item.url}`}
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
          These references support the formulas, definitions, and interpretation patterns used by this page.
        </p>
      </div>

      <FAQAccordion faqs={config.faqs} />
      <CalculatorReview calculatorName={config.reviewName} />
    </div>
  );
}
