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
  SALES_MARKETING_CONFIG,
  SalesMarketingVariant,
} from '@/lib/sales-marketing-suite-config';
import {
  buildSalesMarketingResult,
  DEFAULT_INPUTS,
  Inputs,
  Result,
  ResultMetric,
} from '@/lib/sales-marketing-suite-math';

interface Props {
  variant: SalesMarketingVariant;
}

interface FieldDef {
  key: keyof Inputs;
  label: string;
  step?: string;
}

const usd = (value: number, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const formatMetric = (metric: ResultMetric) => {
  const decimals = metric.decimals ?? (metric.currency ? 0 : 2);
  if (metric.currency) return usd(metric.value, decimals);
  if (metric.suffix) return `${metric.value.toFixed(decimals)}${metric.suffix}`;
  return metric.value.toFixed(decimals);
};

const formatPrimary = (result: Result) => {
  const decimals = result.primaryDecimals ?? (result.primaryCurrency ? 0 : 2);
  if (result.primaryCurrency) return usd(result.primaryValue, decimals);
  if (result.primarySuffix) return `${result.primaryValue.toFixed(decimals)}${result.primarySuffix}`;
  return result.primaryValue.toFixed(decimals);
};

const fieldsForVariant = (variant: SalesMarketingVariant): FieldDef[] => {
  switch (variant) {
    case 'sales-commission':
      return [
        { key: 'salesAmount', label: 'Sales booked', step: '0.01' },
        { key: 'baseCommissionRate', label: 'Base commission (%)', step: '0.01' },
        { key: 'quotaAmount', label: 'Quota amount', step: '0.01' },
        { key: 'acceleratorRate', label: 'Accelerator rate (%)', step: '0.01' },
        { key: 'commissionBonus', label: 'Commission bonus', step: '0.01' },
      ];
    case 'sales-tax':
      return [
        { key: 'subtotal', label: 'Order subtotal', step: '0.01' },
        { key: 'salesTaxRate', label: 'Sales tax rate (%)', step: '0.01' },
        { key: 'discountPercent', label: 'Discount (%)', step: '0.01' },
        { key: 'couponAmount', label: 'Coupon amount', step: '0.01' },
        { key: 'shippingFees', label: 'Shipping fees', step: '0.01' },
      ];
    case 'discount':
      return [
        { key: 'originalPrice', label: 'Original price', step: '0.01' },
        { key: 'discountPercent', label: 'Discount (%)', step: '0.01' },
        { key: 'couponAmount', label: 'Coupon amount', step: '0.01' },
        { key: 'salesTaxRate', label: 'Tax rate (%)', step: '0.01' },
      ];
    case 'price-increase':
      return [
        { key: 'originalPrice', label: 'Current price', step: '0.01' },
        { key: 'newPrice', label: 'New price', step: '0.01' },
        { key: 'currentUnits', label: 'Current units sold', step: '0.1' },
        { key: 'expectedUnits', label: 'Expected units after increase', step: '0.1' },
      ];
    case 'conversion-rate':
      return [
        { key: 'visitors', label: 'Visitors', step: '1' },
        { key: 'conversions', label: 'Conversions', step: '1' },
        { key: 'revenue', label: 'Revenue', step: '0.01' },
      ];
    case 'lead-generation-roi':
      return [
        { key: 'marketingSpend', label: 'Marketing spend', step: '0.01' },
        { key: 'leads', label: 'Leads', step: '1' },
        { key: 'leadToCustomerPercent', label: 'Lead-to-customer (%)', step: '0.01' },
        { key: 'averageDealValue', label: 'Average deal value', step: '0.01' },
        { key: 'grossMarginPercent', label: 'Gross margin (%)', step: '0.01' },
      ];
    case 'marketing-roi':
      return [
        { key: 'marketingSpend', label: 'Marketing spend', step: '0.01' },
        { key: 'revenue', label: 'Attributed revenue', step: '0.01' },
        { key: 'grossMarginPercent', label: 'Gross margin (%)', step: '0.01' },
        { key: 'leads', label: 'Leads', step: '1' },
        { key: 'acquisitions', label: 'Acquisitions', step: '1' },
      ];
    case 'email-marketing-roi':
      return [
        { key: 'sends', label: 'Emails sent', step: '1' },
        { key: 'opens', label: 'Opens', step: '1' },
        { key: 'clicks', label: 'Clicks', step: '1' },
        { key: 'conversions', label: 'Conversions', step: '1' },
        { key: 'marketingSpend', label: 'Campaign cost', step: '0.01' },
        { key: 'revenue', label: 'Revenue', step: '0.01' },
        { key: 'grossMarginPercent', label: 'Gross margin (%)', step: '0.01' },
      ];
    case 'cost-per-click':
      return [
        { key: 'adSpend', label: 'Ad spend', step: '0.01' },
        { key: 'clicks', label: 'Clicks', step: '1' },
        { key: 'impressions', label: 'Impressions', step: '1' },
        { key: 'conversions', label: 'Conversions', step: '1' },
      ];
    case 'cost-per-acquisition':
      return [
        { key: 'adSpend', label: 'Ad spend', step: '0.01' },
        { key: 'acquisitions', label: 'Acquisitions', step: '1' },
        { key: 'revenue', label: 'Revenue', step: '0.01' },
        { key: 'grossMarginPercent', label: 'Gross margin (%)', step: '0.01' },
      ];
    case 'click-through-rate':
      return [
        { key: 'impressions', label: 'Impressions', step: '1' },
        { key: 'clicks', label: 'Clicks', step: '1' },
        { key: 'adSpend', label: 'Ad spend', step: '0.01' },
        { key: 'conversions', label: 'Conversions', step: '1' },
      ];
    case 'engagement-rate':
      return [
        { key: 'engagements', label: 'Engagements', step: '1' },
        { key: 'impressions', label: 'Impressions', step: '1' },
        { key: 'followers', label: 'Followers', step: '1' },
        { key: 'clicks', label: 'Clicks', step: '1' },
      ];
    case 'ab-test':
      return [
        { key: 'controlVisitors', label: 'Control visitors', step: '1' },
        { key: 'controlConversions', label: 'Control conversions', step: '1' },
        { key: 'variantVisitors', label: 'Variant visitors', step: '1' },
        { key: 'variantConversions', label: 'Variant conversions', step: '1' },
      ];
    case 'sample-size':
      return [
        { key: 'confidenceLevel', label: 'Confidence level (%)', step: '1' },
        { key: 'marginOfErrorPercent', label: 'Margin of error (%)', step: '0.1' },
        { key: 'populationSize', label: 'Population size', step: '1' },
        { key: 'responseDistributionPercent', label: 'Response distribution (%)', step: '0.1' },
      ];
    case 'market-share':
      return [
        { key: 'companyRevenue', label: 'Company revenue', step: '0.01' },
        { key: 'totalMarketRevenue', label: 'Total market revenue', step: '0.01' },
        { key: 'targetSharePercent', label: 'Target market share (%)', step: '0.1' },
      ];
  }
};

export default function AdvancedSalesMarketingSuiteCalculator({ variant }: Props) {
  const config = SALES_MARKETING_CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>({ ...DEFAULT_INPUTS[variant] });
  const [showResults, setShowResults] = useState(false);
  const result = useMemo(() => buildSalesMarketingResult(variant, inputs), [inputs, variant]);

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
              <input
                type="number"
                step={field.step ?? 'any'}
                value={inputs[field.key]}
                onChange={(event) => setField(field.key, event.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-3 text-foreground"
              />
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
            This page is designed to make {config.concept} easier to interpret than a bare formula output.
          </div>
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Better Result Context
            </div>
            Primary metrics, supporting diagnostics, and warnings stay attached to the same run.
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
          These links were selected to support the formulas, definitions, and interpretation patterns used in this calculator.
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
