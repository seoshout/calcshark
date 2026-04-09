import type { SalesMarketingVariant } from '@/lib/sales-marketing-suite-config';

export interface Inputs {
  salesAmount: string;
  baseCommissionRate: string;
  quotaAmount: string;
  acceleratorRate: string;
  commissionBonus: string;
  subtotal: string;
  salesTaxRate: string;
  discountPercent: string;
  couponAmount: string;
  shippingFees: string;
  originalPrice: string;
  newPrice: string;
  currentUnits: string;
  expectedUnits: string;
  visitors: string;
  conversions: string;
  clicks: string;
  impressions: string;
  adSpend: string;
  acquisitions: string;
  marketingSpend: string;
  revenue: string;
  grossMarginPercent: string;
  leads: string;
  leadToCustomerPercent: string;
  averageDealValue: string;
  sends: string;
  opens: string;
  engagements: string;
  followers: string;
  controlVisitors: string;
  controlConversions: string;
  variantVisitors: string;
  variantConversions: string;
  confidenceLevel: string;
  marginOfErrorPercent: string;
  populationSize: string;
  responseDistributionPercent: string;
  companyRevenue: string;
  totalMarketRevenue: string;
  targetSharePercent: string;
}

export interface ResultMetric {
  label: string;
  value: number;
  currency?: boolean;
  suffix?: string;
  decimals?: number;
}

export interface Result {
  primaryLabel: string;
  primaryValue: number;
  primaryCurrency?: boolean;
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

const pct = (value: number, total: number) => (total === 0 ? 0 : (value / total) * 100);

const zScore = (confidenceLevel: number) => {
  if (confidenceLevel >= 99) return 2.576;
  if (confidenceLevel >= 95) return 1.96;
  if (confidenceLevel >= 90) return 1.645;
  return 1.96;
};

const BASE_INPUTS: Inputs = {
  salesAmount: '125000',
  baseCommissionRate: '8',
  quotaAmount: '100000',
  acceleratorRate: '12',
  commissionBonus: '1500',
  subtotal: '250',
  salesTaxRate: '8.25',
  discountPercent: '15',
  couponAmount: '10',
  shippingFees: '12',
  originalPrice: '99',
  newPrice: '109',
  currentUnits: '1200',
  expectedUnits: '1125',
  visitors: '18000',
  conversions: '540',
  clicks: '960',
  impressions: '48000',
  adSpend: '3200',
  acquisitions: '80',
  marketingSpend: '15000',
  revenue: '64000',
  grossMarginPercent: '68',
  leads: '420',
  leadToCustomerPercent: '12',
  averageDealValue: '1800',
  sends: '25000',
  opens: '9200',
  engagements: '1350',
  followers: '18000',
  controlVisitors: '12000',
  controlConversions: '420',
  variantVisitors: '12100',
  variantConversions: '470',
  confidenceLevel: '95',
  marginOfErrorPercent: '5',
  populationSize: '50000',
  responseDistributionPercent: '50',
  companyRevenue: '4200000',
  totalMarketRevenue: '18500000',
  targetSharePercent: '25',
};

export const DEFAULT_INPUTS: Record<SalesMarketingVariant, Inputs> = {
  'sales-commission': { ...BASE_INPUTS },
  'sales-tax': { ...BASE_INPUTS },
  discount: { ...BASE_INPUTS },
  'price-increase': { ...BASE_INPUTS },
  'conversion-rate': { ...BASE_INPUTS },
  'lead-generation-roi': { ...BASE_INPUTS },
  'marketing-roi': { ...BASE_INPUTS },
  'email-marketing-roi': { ...BASE_INPUTS },
  'cost-per-click': { ...BASE_INPUTS },
  'cost-per-acquisition': { ...BASE_INPUTS },
  'click-through-rate': { ...BASE_INPUTS },
  'engagement-rate': { ...BASE_INPUTS },
  'ab-test': { ...BASE_INPUTS },
  'sample-size': { ...BASE_INPUTS },
  'market-share': { ...BASE_INPUTS },
};

export function buildSalesMarketingResult(
  variant: SalesMarketingVariant,
  inputs: Inputs
): Result {
  const salesAmount = parse(inputs.salesAmount);
  const baseCommissionRate = parse(inputs.baseCommissionRate);
  const quotaAmount = parse(inputs.quotaAmount);
  const acceleratorRate = parse(inputs.acceleratorRate);
  const commissionBonus = parse(inputs.commissionBonus);
  const subtotal = parse(inputs.subtotal);
  const salesTaxRate = parse(inputs.salesTaxRate);
  const discountPercent = parse(inputs.discountPercent);
  const couponAmount = parse(inputs.couponAmount);
  const shippingFees = parse(inputs.shippingFees);
  const originalPrice = parse(inputs.originalPrice);
  const newPrice = parse(inputs.newPrice);
  const currentUnits = parse(inputs.currentUnits);
  const expectedUnits = parse(inputs.expectedUnits);
  const visitors = parse(inputs.visitors);
  const conversions = parse(inputs.conversions);
  const clicks = parse(inputs.clicks);
  const impressions = parse(inputs.impressions);
  const adSpend = parse(inputs.adSpend);
  const acquisitions = parse(inputs.acquisitions);
  const marketingSpend = parse(inputs.marketingSpend);
  const revenue = parse(inputs.revenue);
  const grossMarginPercent = parse(inputs.grossMarginPercent);
  const leads = parse(inputs.leads);
  const leadToCustomerPercent = parse(inputs.leadToCustomerPercent);
  const averageDealValue = parse(inputs.averageDealValue);
  const sends = parse(inputs.sends);
  const opens = parse(inputs.opens);
  const engagements = parse(inputs.engagements);
  const followers = parse(inputs.followers);
  const controlVisitors = parse(inputs.controlVisitors);
  const controlConversions = parse(inputs.controlConversions);
  const variantVisitors = parse(inputs.variantVisitors);
  const variantConversions = parse(inputs.variantConversions);
  const confidenceLevel = parse(inputs.confidenceLevel);
  const marginOfErrorPercent = parse(inputs.marginOfErrorPercent);
  const populationSize = parse(inputs.populationSize);
  const responseDistributionPercent = parse(inputs.responseDistributionPercent);
  const companyRevenue = parse(inputs.companyRevenue);
  const totalMarketRevenue = parse(inputs.totalMarketRevenue);
  const targetSharePercent = parse(inputs.targetSharePercent);

  if (variant === 'sales-commission') {
    const baseEligible = Math.min(salesAmount, quotaAmount);
    const acceleratedEligible = Math.max(salesAmount - quotaAmount, 0);
    const baseCommission = baseEligible * (baseCommissionRate / 100);
    const acceleratedCommission = acceleratedEligible * (acceleratorRate / 100);
    const totalCommission = baseCommission + acceleratedCommission + commissionBonus;
    const attainment = pct(salesAmount, quotaAmount);
    const blendedRate = salesAmount > 0 ? (totalCommission / salesAmount) * 100 : 0;
    return {
      primaryLabel: 'Total Commission',
      primaryValue: totalCommission,
      primaryCurrency: true,
      metrics: [
        { label: 'Quota Attainment', value: attainment, suffix: '%', decimals: 1 },
        { label: 'Base Commission', value: baseCommission, currency: true },
        { label: 'Accelerator Commission', value: acceleratedCommission, currency: true },
        { label: 'Blended Commission Rate', value: blendedRate, suffix: '%', decimals: 2 },
      ],
      notes: [
        'This run separates quota-rate earnings from above-quota accelerator earnings so the payout logic stays visible.',
        'The blended rate helps show what the full payout represented relative to the sales booked.',
        'Bonus is kept separate so the impact of plan design is easier to read than in a single payout total.',
      ],
      warnings: quotaAmount <= 0 ? ['Quota amount should be above zero if you want a meaningful attainment read.'] : [],
    };
  }

  if (variant === 'sales-tax') {
    const discountAmount = subtotal * (discountPercent / 100);
    const taxableSubtotal = Math.max(subtotal - discountAmount - couponAmount, 0);
    const taxAmount = taxableSubtotal * (salesTaxRate / 100);
    const total = taxableSubtotal + taxAmount + shippingFees;
    const effectiveTaxRate = pct(taxAmount, taxableSubtotal);
    return {
      primaryLabel: 'Order Total',
      primaryValue: total,
      primaryCurrency: true,
      metrics: [
        { label: 'Taxable Subtotal', value: taxableSubtotal, currency: true },
        { label: 'Sales Tax Amount', value: taxAmount, currency: true },
        { label: 'Discount Savings', value: discountAmount + couponAmount, currency: true },
        { label: 'Effective Tax Rate', value: effectiveTaxRate, suffix: '%', decimals: 2 },
      ],
      notes: [
        'This run applies percentage and flat discounting before the tax calculation so the taxable base stays explicit.',
        'Shipping is kept separate because teams often need to see merchandise total, tax, and fees as distinct layers.',
        'The effective tax rate is useful for checking whether the result looks reasonable against the entered tax assumption.',
      ],
      warnings: subtotal <= 0 ? ['Subtotal must be above zero to estimate an order total.'] : [],
    };
  }

  if (variant === 'discount') {
    const percentDiscount = originalPrice * (discountPercent / 100);
    const discountedSubtotal = Math.max(originalPrice - percentDiscount - couponAmount, 0);
    const taxAmount = discountedSubtotal * (salesTaxRate / 100);
    const finalPrice = discountedSubtotal + taxAmount;
    const totalSavings = originalPrice - discountedSubtotal;
    const effectiveDiscount = pct(totalSavings, originalPrice);
    return {
      primaryLabel: 'Final Price After Discount',
      primaryValue: finalPrice,
      primaryCurrency: true,
      metrics: [
        { label: 'Discounted Subtotal', value: discountedSubtotal, currency: true },
        { label: 'Total Savings', value: totalSavings, currency: true },
        { label: 'Effective Discount', value: effectiveDiscount, suffix: '%', decimals: 2 },
        { label: 'Tax on Discounted Price', value: taxAmount, currency: true },
      ],
      notes: [
        'The calculator separates percentage discounting, flat coupon value, and tax so the shopper or marketer can see each pricing layer.',
        'Effective discount often differs from the headline discount once coupons and tax are considered together.',
        'This result is useful for promotion planning because it shows what the price actually becomes, not just what the markdown looked like.',
      ],
      warnings: originalPrice <= 0 ? ['Original price must be above zero to calculate a discount scenario.'] : [],
    };
  }

  if (variant === 'price-increase') {
    const oldRevenue = originalPrice * currentUnits;
    const newRevenue = newPrice * expectedUnits;
    const priceLift = pct(newPrice - originalPrice, originalPrice);
    const revenueChange = newRevenue - oldRevenue;
    const breakEvenUnits = newPrice > 0 ? oldRevenue / newPrice : 0;
    return {
      primaryLabel: 'Revenue Change After Price Increase',
      primaryValue: revenueChange,
      primaryCurrency: true,
      metrics: [
        { label: 'Price Increase', value: priceLift, suffix: '%', decimals: 2 },
        { label: 'Current Revenue', value: oldRevenue, currency: true },
        { label: 'Projected Revenue', value: newRevenue, currency: true },
        { label: 'Break-Even Unit Volume', value: breakEvenUnits, suffix: ' units', decimals: 1 },
      ],
      notes: [
        'This run compares current revenue with projected revenue after the price change and expected unit response are both considered.',
        'Break-even unit volume is useful because it shows how much demand can fall before revenue returns to the old baseline.',
        'A higher price does not automatically improve revenue if unit decline is steeper than the price lift compensates for.',
      ],
      warnings: originalPrice <= 0 || newPrice <= 0 ? ['Both current and new price should be above zero to compare the pricing scenario.'] : [],
    };
  }

  if (variant === 'conversion-rate') {
    const conversionRate = pct(conversions, visitors);
    const conversionsPerThousand = visitors > 0 ? (conversions / visitors) * 1000 : 0;
    const revenuePerVisitor = visitors > 0 ? revenue / visitors : 0;
    const valuePerConversion = conversions > 0 ? revenue / conversions : 0;
    return {
      primaryLabel: 'Conversion Rate',
      primaryValue: conversionRate,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Conversions per 1,000 Visitors', value: conversionsPerThousand, decimals: 1 },
        { label: 'Revenue per Visitor', value: revenuePerVisitor, currency: true, decimals: 2 },
        { label: 'Value per Conversion', value: valuePerConversion, currency: true, decimals: 2 },
        { label: 'Total Conversions', value: conversions, decimals: 0 },
      ],
      notes: [
        'Conversion rate shows how much of the incoming traffic completed the desired action.',
        'Revenue per visitor helps translate the rate into value instead of leaving it as only a percentage.',
        'The value per conversion metric can reveal whether a modest conversion rate still drives attractive economics.',
      ],
      warnings: visitors <= 0 ? ['Visitors must be above zero to calculate conversion rate.'] : [],
    };
  }

  if (variant === 'lead-generation-roi') {
    const customers = leads * (leadToCustomerPercent / 100);
    const leadRevenue = customers * averageDealValue;
    const grossProfit = leadRevenue * (grossMarginPercent / 100);
    const roi = marketingSpend > 0 ? ((grossProfit - marketingSpend) / marketingSpend) * 100 : 0;
    const cpl = leads > 0 ? marketingSpend / leads : 0;
    return {
      primaryLabel: 'Lead Generation ROI',
      primaryValue: roi,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Cost per Lead', value: cpl, currency: true, decimals: 2 },
        { label: 'Estimated Customers', value: customers, decimals: 1 },
        { label: 'Estimated Revenue', value: leadRevenue, currency: true },
        { label: 'Estimated Gross Profit', value: grossProfit, currency: true },
      ],
      notes: [
        'Lead generation ROI becomes more useful when leads are connected to close rate and deal value rather than reported as top-of-funnel volume only.',
        'Gross-profit framing is helpful because it avoids treating revenue as if it were fully available return.',
        'Cost per lead helps compare efficiency while ROI helps compare overall economic value.',
      ],
      warnings: marketingSpend <= 0 ? ['Marketing spend must be above zero to calculate ROI.'] : [],
    };
  }

  if (variant === 'marketing-roi') {
    const grossProfit = revenue * (grossMarginPercent / 100);
    const roi = marketingSpend > 0 ? ((grossProfit - marketingSpend) / marketingSpend) * 100 : 0;
    const roas = marketingSpend > 0 ? revenue / marketingSpend : 0;
    const cpl = leads > 0 ? marketingSpend / leads : 0;
    const cac = acquisitions > 0 ? marketingSpend / acquisitions : 0;
    return {
      primaryLabel: 'Marketing ROI',
      primaryValue: roi,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'ROAS', value: roas, suffix: 'x', decimals: 2 },
        { label: 'Gross Profit', value: grossProfit, currency: true },
        { label: 'Cost per Lead', value: cpl, currency: true, decimals: 2 },
        { label: 'Cost per Acquisition', value: cac, currency: true, decimals: 2 },
      ],
      notes: [
        'This run keeps ROAS and ROI separate so revenue efficiency is not confused with profit efficiency.',
        'Gross margin matters because a campaign can look strong on revenue while underperforming on actual contribution.',
        'Lead and acquisition cost help connect channel economics to both funnel stages and end outcomes.',
      ],
      warnings: marketingSpend <= 0 ? ['Marketing spend must be above zero to calculate marketing ROI.'] : [],
    };
  }

  if (variant === 'email-marketing-roi') {
    const openRate = pct(opens, sends);
    const clickRate = pct(clicks, sends);
    const clickToOpen = pct(clicks, opens);
    const conversionRate = pct(conversions, clicks);
    const grossProfit = revenue * (grossMarginPercent / 100);
    const roi = marketingSpend > 0 ? ((grossProfit - marketingSpend) / marketingSpend) * 100 : 0;
    return {
      primaryLabel: 'Email Marketing ROI',
      primaryValue: roi,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Open Rate', value: openRate, suffix: '%', decimals: 2 },
        { label: 'Click Rate', value: clickRate, suffix: '%', decimals: 2 },
        { label: 'Click-to-Open Rate', value: clickToOpen, suffix: '%', decimals: 2 },
        { label: 'Post-Click Conversion Rate', value: conversionRate, suffix: '%', decimals: 2 },
      ],
      notes: [
        'This run keeps email funnel stages visible from sends through conversions, which helps explain why the ROI landed where it did.',
        'Click-to-open rate is useful because it separates email body performance from subject-line and delivery performance.',
        'Gross-profit ROI is generally more decision-useful than revenue alone when comparing channels.',
      ],
      warnings: sends <= 0 ? ['Email sends must be above zero to evaluate campaign performance.'] : [],
    };
  }

  if (variant === 'cost-per-click') {
    const cpc = clicks > 0 ? adSpend / clicks : 0;
    const ctr = pct(clicks, impressions);
    const cpa = conversions > 0 ? adSpend / conversions : 0;
    const cpm = impressions > 0 ? (adSpend / impressions) * 1000 : 0;
    return {
      primaryLabel: 'Cost Per Click',
      primaryValue: cpc,
      primaryCurrency: true,
      primaryDecimals: 2,
      metrics: [
        { label: 'Click-Through Rate', value: ctr, suffix: '%', decimals: 2 },
        { label: 'Cost per Acquisition', value: cpa, currency: true, decimals: 2 },
        { label: 'CPM', value: cpm, currency: true, decimals: 2 },
        { label: 'Total Clicks', value: clicks, decimals: 0 },
      ],
      notes: [
        'CPC is most useful when paired with CTR and CPA because a cheap click is not automatically a valuable click.',
        'CPM gives another lens on pricing by showing the cost of reaching the audience, not just the cost of earning the click.',
        'The relationship between CPC and CPA often reveals whether the bigger issue is media buying or post-click conversion.',
      ],
      warnings: clicks <= 0 ? ['Clicks must be above zero to calculate CPC.'] : [],
    };
  }

  if (variant === 'cost-per-acquisition') {
    const cpa = acquisitions > 0 ? adSpend / acquisitions : 0;
    const roas = adSpend > 0 ? revenue / adSpend : 0;
    const valuePerAcquisition = acquisitions > 0 ? revenue / acquisitions : 0;
    const profitPerAcquisition = acquisitions > 0 ? (revenue * (grossMarginPercent / 100)) / acquisitions : 0;
    return {
      primaryLabel: 'Cost Per Acquisition',
      primaryValue: cpa,
      primaryCurrency: true,
      primaryDecimals: 2,
      metrics: [
        { label: 'ROAS', value: roas, suffix: 'x', decimals: 2 },
        { label: 'Value per Acquisition', value: valuePerAcquisition, currency: true, decimals: 2 },
        { label: 'Gross Profit per Acquisition', value: profitPerAcquisition, currency: true, decimals: 2 },
        { label: 'Acquisitions', value: acquisitions, decimals: 0 },
      ],
      notes: [
        'CPA becomes more actionable when it is judged against the value and gross profit created by each acquisition.',
        'A low CPA is not enough by itself if the acquired customer or order is low value.',
        'ROAS helps connect acquisition efficiency back to the broader revenue picture.',
      ],
      warnings: acquisitions <= 0 ? ['Acquisitions must be above zero to calculate CPA.'] : [],
    };
  }

  if (variant === 'click-through-rate') {
    const ctr = pct(clicks, impressions);
    const cpc = clicks > 0 ? adSpend / clicks : 0;
    const cvr = pct(conversions, clicks);
    const cpm = impressions > 0 ? (adSpend / impressions) * 1000 : 0;
    return {
      primaryLabel: 'Click-Through Rate',
      primaryValue: ctr,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Clicks', value: clicks, decimals: 0 },
        { label: 'Cost Per Click', value: cpc, currency: true, decimals: 2 },
        { label: 'Post-Click Conversion Rate', value: cvr, suffix: '%', decimals: 2 },
        { label: 'CPM', value: cpm, currency: true, decimals: 2 },
      ],
      notes: [
        'CTR measures how often impressions turned into clicks, which makes it a top-of-funnel response metric.',
        'CPC and post-click conversion rate help show whether weak performance is happening before or after the click.',
        'CTR should be interpreted in context with placement, audience, and creative quality rather than in isolation.',
      ],
      warnings: impressions <= 0 ? ['Impressions must be above zero to calculate CTR.'] : [],
    };
  }

  if (variant === 'engagement-rate') {
    const engagementByImpression = pct(engagements, impressions);
    const engagementByFollower = pct(engagements, followers);
    const engagementsPerThousand = impressions > 0 ? (engagements / impressions) * 1000 : 0;
    const clickShare = pct(clicks, engagements);
    return {
      primaryLabel: 'Engagement Rate by Impressions',
      primaryValue: engagementByImpression,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Engagement Rate by Followers', value: engagementByFollower, suffix: '%', decimals: 2 },
        { label: 'Engagements per 1,000 Impressions', value: engagementsPerThousand, decimals: 1 },
        { label: 'Click Share of Engagements', value: clickShare, suffix: '%', decimals: 2 },
        { label: 'Total Engagements', value: engagements, decimals: 0 },
      ],
      notes: [
        'Engagement rate can be calculated against impressions or followers, and each lens answers a slightly different question.',
        'Engagements per thousand impressions help make the response level easier to compare across larger media volumes.',
        'Click share gives a useful read on how much of the engagement activity moved beyond passive reactions.',
      ],
      warnings: impressions <= 0 ? ['Impressions must be above zero to calculate engagement rate by impressions.'] : [],
    };
  }

  if (variant === 'ab-test') {
    const controlRate = pct(controlConversions, controlVisitors);
    const variantRate = pct(variantConversions, variantVisitors);
    const uplift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;
    const pooledRate =
      controlVisitors + variantVisitors > 0
        ? (controlConversions + variantConversions) / (controlVisitors + variantVisitors)
        : 0;
    const se =
      controlVisitors > 0 && variantVisitors > 0
        ? Math.sqrt(pooledRate * (1 - pooledRate) * (1 / controlVisitors + 1 / variantVisitors))
        : 0;
    const z = se > 0 ? ((variantConversions / variantVisitors) - (controlConversions / controlVisitors)) / se : 0;
    const confidenceApprox = Math.min(Math.abs(z) / 3 * 100, 99.9);
    return {
      primaryLabel: 'Relative Uplift',
      primaryValue: uplift,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Control Conversion Rate', value: controlRate, suffix: '%', decimals: 2 },
        { label: 'Variant Conversion Rate', value: variantRate, suffix: '%', decimals: 2 },
        { label: 'Absolute Lift', value: variantRate - controlRate, suffix: ' pts', decimals: 2 },
        { label: 'Confidence Approximation', value: confidenceApprox, suffix: '%', decimals: 1 },
      ],
      notes: [
        'This run compares control and variant conversion rates and frames the difference as both absolute lift and relative uplift.',
        'The confidence figure is a planning-oriented approximation based on a pooled-rate z-test rather than a full experimentation platform result.',
        'A/B results are easier to trust when the rate difference is paired with enough traffic volume to stabilize the estimate.',
      ],
      warnings:
        controlVisitors <= 0 || variantVisitors <= 0
          ? ['Both control and variant visitor counts must be above zero to compare the test.']
          : [],
    };
  }

  if (variant === 'sample-size') {
    const z = zScore(confidenceLevel);
    const p = responseDistributionPercent / 100;
    const e = marginOfErrorPercent / 100;
    const infiniteSample = e > 0 ? (z * z * p * (1 - p)) / (e * e) : 0;
    const adjustedSample =
      populationSize > 0 ? infiniteSample / (1 + (infiniteSample - 1) / populationSize) : infiniteSample;
    const finitePopulationCorrection =
      populationSize > 0 ? Math.sqrt((populationSize - adjustedSample) / Math.max(populationSize - 1, 1)) : 1;
    return {
      primaryLabel: 'Recommended Sample Size',
      primaryValue: adjustedSample,
      primaryDecimals: 0,
      metrics: [
        { label: 'Infinite Population Sample', value: infiniteSample, decimals: 0 },
        { label: 'Confidence Z-Score', value: z, decimals: 3 },
        { label: 'Margin of Error', value: marginOfErrorPercent, suffix: '%', decimals: 1 },
        { label: 'Finite Population Correction', value: finitePopulationCorrection, decimals: 3 },
      ],
      notes: [
        'This sample-size estimate uses confidence level, margin of error, and response distribution to build the underlying requirement.',
        'Finite population adjustment matters more as the sample becomes a larger share of the total population.',
        'A more conservative response distribution near 50 percent tends to produce the largest required sample.',
      ],
      warnings: e <= 0 ? ['Margin of error must be above zero to calculate sample size.'] : [],
    };
  }

  const currentShare = pct(companyRevenue, totalMarketRevenue);
  const targetRevenue = totalMarketRevenue * (targetSharePercent / 100);
  const revenueGap = targetRevenue - companyRevenue;
  const remainingMarket = Math.max(totalMarketRevenue - companyRevenue, 0);
  return {
    primaryLabel: 'Current Market Share',
    primaryValue: currentShare,
    primarySuffix: '%',
    primaryDecimals: 2,
    metrics: [
      { label: 'Target Revenue at Target Share', value: targetRevenue, currency: true },
      { label: 'Revenue Gap to Target Share', value: revenueGap, currency: true },
      { label: 'Remaining Market Revenue', value: remainingMarket, currency: true },
      { label: 'Target Share', value: targetSharePercent, suffix: '%', decimals: 1 },
    ],
    notes: [
      'Market share compares company revenue with the total market revenue available in the same measurement frame.',
      'The revenue gap to target share helps translate a share goal into a practical commercial target.',
      'Remaining market revenue shows how much of the market is still outside the company’s current capture.',
    ],
    warnings: totalMarketRevenue <= 0 ? ['Total market revenue must be above zero to calculate market share.'] : [],
  };
}
