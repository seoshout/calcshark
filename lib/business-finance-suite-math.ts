import type { BusinessFinanceVariant } from '@/lib/business-finance-suite-config';

export interface Inputs {
  fixedCosts: string;
  pricePerUnit: string;
  variableCostPerUnit: string;
  plannedUnits: string;
  targetProfit: string;

  revenue: string;
  cogs: string;
  operatingExpenses: string;
  otherExpenses: string;
  unitsSold: string;
  costPerUnit: string;
  sellingPrice: string;

  initialInvestment: string;
  discountRate: string;
  cashFlowSeries: string;
  hurdleRate: string;

  currentAssets: string;
  inventory: string;
  currentLiabilities: string;
  annualRevenue: string;

  cashBalance: string;
  monthlyRevenue: string;
  monthlyExpenses: string;

  marketingSpend: string;
  salesSpend: string;
  onboardingSpend: string;
  newCustomers: string;
  arpa: string;
  grossMarginPercent: string;
  monthlyChurnPercent: string;

  annualEbitda: string;
  annualSde: string;
  revenueMultiple: string;
  ebitdaMultiple: string;
  sdeMultiple: string;
  debt: string;
  cash: string;
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

const BASE_INPUTS: Inputs = {
  fixedCosts: '18000',
  pricePerUnit: '85',
  variableCostPerUnit: '32',
  plannedUnits: '420',
  targetProfit: '12000',
  revenue: '250000',
  cogs: '125000',
  operatingExpenses: '65000',
  otherExpenses: '10000',
  unitsSold: '5000',
  costPerUnit: '24',
  sellingPrice: '45',
  initialInvestment: '150000',
  discountRate: '10',
  cashFlowSeries: '35000,42000,50000,55000,60000',
  hurdleRate: '12',
  currentAssets: '420000',
  inventory: '95000',
  currentLiabilities: '260000',
  annualRevenue: '1800000',
  cashBalance: '600000',
  monthlyRevenue: '80000',
  monthlyExpenses: '125000',
  marketingSpend: '40000',
  salesSpend: '30000',
  onboardingSpend: '5000',
  newCustomers: '50',
  arpa: '220',
  grossMarginPercent: '78',
  monthlyChurnPercent: '4',
  annualEbitda: '420000',
  annualSde: '500000',
  revenueMultiple: '1.4',
  ebitdaMultiple: '5.5',
  sdeMultiple: '2.8',
  debt: '300000',
  cash: '180000',
};

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pct = (numerator: number, denominator: number) => {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
};

const series = (value: string) =>
  value
    .split(',')
    .map((item) => Number.parseFloat(item.trim()))
    .filter((item) => Number.isFinite(item));

const annualNpv = (ratePercent: number, initialInvestment: number, cashFlows: number[]) => {
  const rate = ratePercent / 100;
  return cashFlows.reduce((sum, cashFlow, index) => {
    return sum + cashFlow / Math.pow(1 + rate, index + 1);
  }, -initialInvestment);
};

const simplePayback = (initialInvestment: number, cashFlows: number[]) => {
  let cumulative = 0;

  for (let index = 0; index < cashFlows.length; index += 1) {
    const cashFlow = cashFlows[index];
    const previous = cumulative;
    cumulative += cashFlow;

    if (cumulative >= initialInvestment && cashFlow !== 0) {
      const remaining = initialInvestment - previous;
      return index + remaining / cashFlow + 1;
    }
  }

  return null;
};

const discountedPayback = (initialInvestment: number, ratePercent: number, cashFlows: number[]) => {
  const rate = ratePercent / 100;
  let cumulative = 0;

  for (let index = 0; index < cashFlows.length; index += 1) {
    const discounted = cashFlows[index] / Math.pow(1 + rate, index + 1);
    const previous = cumulative;
    cumulative += discounted;

    if (cumulative >= initialInvestment && discounted !== 0) {
      const remaining = initialInvestment - previous;
      return index + remaining / discounted + 1;
    }
  }

  return null;
};

const irr = (initialInvestment: number, cashFlows: number[]) => {
  const npvAt = (rate: number) =>
    cashFlows.reduce((sum, cashFlow, index) => {
      return sum + cashFlow / Math.pow(1 + rate, index + 1);
    }, -initialInvestment);

  let low = -0.99;
  let high = 1;
  let lowValue = npvAt(low);
  let highValue = npvAt(high);

  for (let tries = 0; tries < 20 && lowValue * highValue > 0; tries += 1) {
    high *= 2;
    highValue = npvAt(high);
  }

  if (lowValue * highValue > 0) {
    return null;
  }

  for (let iteration = 0; iteration < 120; iteration += 1) {
    const midpoint = (low + high) / 2;
    const midValue = npvAt(midpoint);

    if (Math.abs(midValue) < 0.0000001) {
      return midpoint * 100;
    }

    if (lowValue * midValue <= 0) {
      high = midpoint;
      highValue = midValue;
    } else {
      low = midpoint;
      lowValue = midValue;
    }
  }

  return ((low + high) / 2) * 100;
};

export const DEFAULT_INPUTS: Record<BusinessFinanceVariant, Inputs> = {
  'break-even': {
    ...BASE_INPUTS,
  },
  'profit-margin': {
    ...BASE_INPUTS,
  },
  'markup': {
    ...BASE_INPUTS,
  },
  'gross-profit': {
    ...BASE_INPUTS,
  },
  'net-profit': {
    ...BASE_INPUTS,
  },
  'payback-period': {
    ...BASE_INPUTS,
  },
  npv: {
    ...BASE_INPUTS,
  },
  irr: {
    ...BASE_INPUTS,
  },
  'working-capital': {
    ...BASE_INPUTS,
  },
  'burn-rate': {
    ...BASE_INPUTS,
  },
  'customer-acquisition-cost': {
    ...BASE_INPUTS,
  },
  'customer-lifetime-value': {
    ...BASE_INPUTS,
  },
  'business-valuation': {
    ...BASE_INPUTS,
  },
};

function marginResult(
  revenue: number,
  cogs: number,
  operatingExpenses: number,
  otherExpenses: number,
  unitsSold: number
) {
  const grossProfit = revenue - cogs;
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfit = operatingProfit - otherExpenses;
  const grossMargin = pct(grossProfit, revenue);
  const operatingMargin = pct(operatingProfit, revenue);
  const netMargin = pct(netProfit, revenue);
  const profitPerUnit = unitsSold > 0 ? netProfit / unitsSold : 0;

  return {
    grossProfit,
    operatingProfit,
    netProfit,
    grossMargin,
    operatingMargin,
    netMargin,
    profitPerUnit,
  };
}

export function buildBusinessFinanceResult(variant: BusinessFinanceVariant, inputs: Inputs): Result {
  const fixedCosts = parse(inputs.fixedCosts);
  const pricePerUnit = parse(inputs.pricePerUnit);
  const variableCostPerUnit = parse(inputs.variableCostPerUnit);
  const plannedUnits = parse(inputs.plannedUnits);
  const targetProfit = parse(inputs.targetProfit);

  const revenue = parse(inputs.revenue);
  const cogs = parse(inputs.cogs);
  const operatingExpenses = parse(inputs.operatingExpenses);
  const otherExpenses = parse(inputs.otherExpenses);
  const unitsSold = parse(inputs.unitsSold);
  const costPerUnit = parse(inputs.costPerUnit);
  const sellingPrice = parse(inputs.sellingPrice);

  const initialInvestment = parse(inputs.initialInvestment);
  const discountRate = parse(inputs.discountRate);
  const cashFlows = series(inputs.cashFlowSeries);
  const hurdleRate = parse(inputs.hurdleRate);

  const currentAssets = parse(inputs.currentAssets);
  const inventory = parse(inputs.inventory);
  const currentLiabilities = parse(inputs.currentLiabilities);
  const annualRevenue = parse(inputs.annualRevenue);

  const cashBalance = parse(inputs.cashBalance);
  const monthlyRevenue = parse(inputs.monthlyRevenue);
  const monthlyExpenses = parse(inputs.monthlyExpenses);

  const marketingSpend = parse(inputs.marketingSpend);
  const salesSpend = parse(inputs.salesSpend);
  const onboardingSpend = parse(inputs.onboardingSpend);
  const newCustomers = parse(inputs.newCustomers);
  const arpa = parse(inputs.arpa);
  const grossMarginPercent = parse(inputs.grossMarginPercent);
  const monthlyChurnPercent = parse(inputs.monthlyChurnPercent);

  const annualEbitda = parse(inputs.annualEbitda);
  const annualSde = parse(inputs.annualSde);
  const revenueMultiple = parse(inputs.revenueMultiple);
  const ebitdaMultiple = parse(inputs.ebitdaMultiple);
  const sdeMultiple = parse(inputs.sdeMultiple);
  const debt = parse(inputs.debt);
  const cash = parse(inputs.cash);

  if (variant === 'break-even') {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const contributionMarginRatio = pct(contributionMargin, pricePerUnit);
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;
    const plannedProfit = plannedUnits * contributionMargin - fixedCosts;
    const targetUnits = contributionMargin > 0 ? (fixedCosts + targetProfit) / contributionMargin : 0;

    return {
      primaryLabel: 'Break-Even Units',
      primaryValue: breakEvenUnits,
      primaryDecimals: 1,
      metrics: [
        { label: 'Break-Even Revenue', value: breakEvenRevenue, currency: true },
        { label: 'Contribution Margin per Unit', value: contributionMargin, currency: true },
        { label: 'Contribution Margin Ratio', value: contributionMarginRatio, suffix: '%', decimals: 1 },
        { label: 'Planned Profit at Current Volume', value: plannedProfit, currency: true },
        { label: 'Units Needed for Target Profit', value: targetUnits, decimals: 1 },
      ],
      notes: [
        'Break-even happens where contribution from each unit fully covers fixed operating costs.',
        'The contribution margin ratio shows how much of each sales dollar is available to absorb overhead and profit.',
        'Planned volume only works if your current pricing can hold and your variable-cost assumptions are realistic.',
      ],
      warnings: contributionMargin <= 0
        ? ['Your current price does not exceed variable cost, so the business cannot break even under these assumptions.']
        : plannedProfit < 0
          ? ['Current planned volume still leaves the model below break-even.']
          : [],
    };
  }

  if (variant === 'profit-margin') {
    const values = marginResult(revenue, cogs, operatingExpenses, otherExpenses, unitsSold);
    return {
      primaryLabel: 'Net Profit Margin',
      primaryValue: values.netMargin,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Gross Profit', value: values.grossProfit, currency: true },
        { label: 'Gross Margin', value: values.grossMargin, suffix: '%', decimals: 2 },
        { label: 'Operating Margin', value: values.operatingMargin, suffix: '%', decimals: 2 },
        { label: 'Net Profit', value: values.netProfit, currency: true },
        { label: 'Net Profit per Unit', value: values.profitPerUnit, currency: true, decimals: 2 },
      ],
      notes: [
        'Profit margin matters because sales growth only creates owner value if enough of each sales dollar survives costs.',
        'Gross, operating, and net margin tell different stories about pricing strength, cost control, and overhead discipline.',
        'A healthy top line can still hide a weak net margin if operating expenses are expanding faster than revenue.',
      ],
      warnings: revenue <= 0 ? ['Revenue must be above zero to produce a meaningful margin result.'] : [],
    };
  }

  if (variant === 'markup') {
    const unitProfit = sellingPrice - costPerUnit;
    const markup = pct(unitProfit, costPerUnit);
    const margin = pct(unitProfit, sellingPrice);
    const monthlyGrossProfit = unitProfit * unitsSold;
    const monthlyRevenue = sellingPrice * unitsSold;

    return {
      primaryLabel: 'Markup',
      primaryValue: markup,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'Gross Margin', value: margin, suffix: '%', decimals: 2 },
        { label: 'Unit Profit', value: unitProfit, currency: true, decimals: 2 },
        { label: 'Projected Revenue', value: monthlyRevenue, currency: true },
        { label: 'Projected Gross Profit', value: monthlyGrossProfit, currency: true },
      ],
      notes: [
        'Markup is based on cost, while margin is based on selling price, which is why the two percentages are never interchangeable.',
        'Unit economics look stronger when markup and margin both remain healthy after fees, shipping, and channel costs.',
        'Pricing decisions should be checked against both unit profit and total monthly gross profit, not markup alone.',
      ],
      warnings: costPerUnit <= 0 || sellingPrice <= 0
        ? ['Cost and selling price both need positive values for a usable pricing result.']
        : unitProfit <= 0
          ? ['Selling price is not covering unit cost under the current assumptions.']
          : [],
    };
  }

  if (variant === 'gross-profit') {
    const grossProfit = revenue - cogs;
    const grossMargin = pct(grossProfit, revenue);
    const grossProfitPerUnit = unitsSold > 0 ? grossProfit / unitsSold : 0;
    const cogsRatio = pct(cogs, revenue);

    return {
      primaryLabel: 'Gross Profit',
      primaryValue: grossProfit,
      primaryCurrency: true,
      metrics: [
        { label: 'Gross Margin', value: grossMargin, suffix: '%', decimals: 2 },
        { label: 'COGS Ratio', value: cogsRatio, suffix: '%', decimals: 2 },
        { label: 'Gross Profit per Unit', value: grossProfitPerUnit, currency: true, decimals: 2 },
        { label: 'Revenue', value: revenue, currency: true },
      ],
      notes: [
        'Gross profit isolates the earnings left after direct production or fulfillment costs are covered.',
        'It is often the clearest early signal for pricing pressure, sourcing inefficiency, or discount-heavy selling.',
        'If gross margin is thin, operating improvements alone may not be enough to rescue overall profitability.',
      ],
      warnings: revenue <= 0 ? ['Revenue must be positive before gross profit can be interpreted meaningfully.'] : [],
    };
  }

  if (variant === 'net-profit') {
    const values = marginResult(revenue, cogs, operatingExpenses, otherExpenses, unitsSold);
    const expenseLoad = pct(cogs + operatingExpenses + otherExpenses, revenue);

    return {
      primaryLabel: 'Net Profit',
      primaryValue: values.netProfit,
      primaryCurrency: true,
      metrics: [
        { label: 'Net Margin', value: values.netMargin, suffix: '%', decimals: 2 },
        { label: 'Operating Profit', value: values.operatingProfit, currency: true },
        { label: 'Total Expense Load', value: expenseLoad, suffix: '%', decimals: 2 },
        { label: 'Net Profit per Unit', value: values.profitPerUnit, currency: true, decimals: 2 },
      ],
      notes: [
        'Net profit is what remains after direct costs, operating overhead, and other business expenses are absorbed.',
        'It is the number most owners and lenders ultimately care about because it reflects the full operating model.',
        'Watching both net profit dollars and net margin protects you from being misled by sales growth without earnings quality.',
      ],
      warnings: values.netProfit < 0 ? ['The business is currently operating at a net loss under these assumptions.'] : [],
    };
  }

  if (variant === 'payback-period') {
    const payback = simplePayback(initialInvestment, cashFlows);
    const discounted = discountedPayback(initialInvestment, discountRate, cashFlows);
    const totalInflow = cashFlows.reduce((sum, cashFlow) => sum + cashFlow, 0);
    const surplus = totalInflow - initialInvestment;

    return {
      primaryLabel: 'Simple Payback Period',
      primaryValue: payback ?? 0,
      primarySuffix: ' years',
      primaryDecimals: 2,
      metrics: [
        { label: 'Discounted Payback', value: discounted ?? 0, suffix: ' years', decimals: 2 },
        { label: 'Initial Investment', value: initialInvestment, currency: true },
        { label: 'Total Project Inflow', value: totalInflow, currency: true },
        { label: 'Cumulative Surplus', value: surplus, currency: true },
      ],
      notes: [
        'Payback highlights how long it takes to recover the original cash outlay from projected project inflows.',
        'Discounted payback is stricter because it recognizes that later cash flows are worth less than near-term cash flows.',
        'Short payback can still hide a weak long-term return, so it should be read with NPV or IRR rather than in isolation.',
      ],
      warnings: payback === null
        ? ['Projected cash flows do not recover the initial investment within the entered time horizon.']
        : [],
    };
  }

  if (variant === 'npv') {
    const npv = annualNpv(discountRate, initialInvestment, cashFlows);
    const pvInflows = npv + initialInvestment;
    const profitabilityIndex = initialInvestment > 0 ? pvInflows / initialInvestment : 0;

    return {
      primaryLabel: 'Net Present Value',
      primaryValue: npv,
      primaryCurrency: true,
      metrics: [
        { label: 'Present Value of Inflows', value: pvInflows, currency: true },
        { label: 'Initial Investment', value: initialInvestment, currency: true },
        { label: 'Profitability Index', value: profitabilityIndex, suffix: 'x', decimals: 2 },
        { label: 'Discount Rate', value: discountRate, suffix: '%', decimals: 2 },
      ],
      notes: [
        'NPV converts future project cash flows into today-value dollars so projects can be judged on a consistent basis.',
        'A positive NPV means the project is expected to create value above the required return assumption.',
        'NPV becomes much more decision-ready when the discount rate reflects real risk and opportunity cost instead of a placeholder guess.',
      ],
      warnings: cashFlows.length === 0
        ? ['Enter at least one future cash flow to evaluate project value.']
        : npv < 0
          ? ['This project does not clear the required return under the current discount-rate assumption.']
          : [],
    };
  }

  if (variant === 'irr') {
    const internalRate = irr(initialInvestment, cashFlows);
    const npvAtHurdle = annualNpv(hurdleRate, initialInvestment, cashFlows);

    return {
      primaryLabel: 'Internal Rate of Return',
      primaryValue: internalRate ?? 0,
      primarySuffix: '%',
      primaryDecimals: 2,
      metrics: [
        { label: 'NPV at Hurdle Rate', value: npvAtHurdle, currency: true },
        { label: 'Hurdle Rate', value: hurdleRate, suffix: '%', decimals: 2 },
        { label: 'Initial Investment', value: initialInvestment, currency: true },
        { label: 'Total Future Cash Flow', value: cashFlows.reduce((sum, item) => sum + item, 0), currency: true },
      ],
      notes: [
        'IRR is the discount rate that drives project NPV to zero, which makes it a useful shorthand for comparing expected return to a hurdle rate.',
        'It is strongest when cash-flow timing is realistic and the project has one clear sign change from outflow to inflows.',
        'IRR can become misleading when cash flows are unconventional or when multiple sign changes exist across the timeline.',
      ],
      warnings: internalRate === null
        ? ['The cash-flow pattern does not produce a clear IRR inside the tested range.']
        : internalRate < hurdleRate
          ? ['The project IRR is below the entered hurdle rate.']
          : [],
    };
  }

  if (variant === 'working-capital') {
    const workingCapital = currentAssets - currentLiabilities;
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const quickRatio = currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0;
    const workingCapitalDays = annualRevenue > 0 ? (workingCapital / annualRevenue) * 365 : 0;

    return {
      primaryLabel: 'Working Capital',
      primaryValue: workingCapital,
      primaryCurrency: true,
      metrics: [
        { label: 'Current Ratio', value: currentRatio, suffix: 'x', decimals: 2 },
        { label: 'Quick Ratio', value: quickRatio, suffix: 'x', decimals: 2 },
        { label: 'Inventory Share of Current Assets', value: pct(inventory, currentAssets), suffix: '%', decimals: 1 },
        { label: 'Working Capital Days', value: workingCapitalDays, suffix: ' days', decimals: 1 },
      ],
      notes: [
        'Working capital shows how much short-term liquidity remains after current liabilities are covered by current assets.',
        'The quick ratio strips inventory out to test how much near-cash liquidity the business really has.',
        'Working-capital days help tie balance-sheet liquidity back to the scale of the revenue engine it supports.',
      ],
      warnings: workingCapital < 0
        ? ['Current liabilities exceed current assets, which signals short-term liquidity pressure.']
        : currentRatio < 1
          ? ['A current ratio below 1 can indicate a thin working-capital cushion.']
          : [],
    };
  }

  if (variant === 'burn-rate') {
    const grossBurn = monthlyExpenses;
    const netBurn = monthlyExpenses - monthlyRevenue;
    const runwayMonths = netBurn > 0 ? cashBalance / netBurn : 0;

    return {
      primaryLabel: 'Net Burn Rate',
      primaryValue: netBurn,
      primaryCurrency: true,
      metrics: [
        { label: 'Gross Burn Rate', value: grossBurn, currency: true },
        { label: 'Current Cash Balance', value: cashBalance, currency: true },
        { label: 'Estimated Runway', value: runwayMonths, suffix: ' months', decimals: 1 },
        { label: 'Monthly Revenue Coverage', value: pct(monthlyRevenue, monthlyExpenses), suffix: '%', decimals: 1 },
      ],
      notes: [
        'Gross burn tracks total monthly cash outflow, while net burn shows how much cash the business is actually losing after revenue.',
        'Runway converts that burn profile into time, which makes funding pressure easier to see and plan around.',
        'Revenue coverage is useful because a modest burn rate can still be risky if revenue is volatile or highly concentrated.',
      ],
      warnings: netBurn <= 0
        ? ['The model is cash-flow positive or break-even on a monthly basis, so traditional burn-rate runway is not the limiting factor.']
        : runwayMonths < 6
          ? ['Runway is below six months under the current assumptions, which can create urgent financing pressure.']
          : [],
    };
  }

  if (variant === 'customer-acquisition-cost') {
    const totalAcquisitionSpend = marketingSpend + salesSpend + onboardingSpend;
    const cac = newCustomers > 0 ? totalAcquisitionSpend / newCustomers : 0;
    const grossProfitPerCustomerPerMonth = arpa * (grossMarginPercent / 100);
    const paybackMonths = grossProfitPerCustomerPerMonth > 0 ? cac / grossProfitPerCustomerPerMonth : 0;
    const lifetimeMonths = monthlyChurnPercent > 0 ? 1 / (monthlyChurnPercent / 100) : 0;
    const clv = grossProfitPerCustomerPerMonth * lifetimeMonths;
    const ltvToCac = cac > 0 ? clv / cac : 0;

    return {
      primaryLabel: 'Customer Acquisition Cost',
      primaryValue: cac,
      primaryCurrency: true,
      metrics: [
        { label: 'Total Acquisition Spend', value: totalAcquisitionSpend, currency: true },
        { label: 'Gross-Margin Payback', value: paybackMonths, suffix: ' months', decimals: 1 },
        { label: 'Estimated CLV', value: clv, currency: true },
        { label: 'LTV:CAC Ratio', value: ltvToCac, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'CAC is only useful when the cost window and the customer-count window describe the same period and channel mix.',
        'Payback months matter because fast acquisition growth can still destroy cash if recovery takes too long.',
        'Looking at CAC alone is never enough; it becomes strategic only when paired with margin, churn, and lifetime value.',
      ],
      warnings: newCustomers <= 0
        ? ['New customers must be above zero to calculate acquisition cost.']
        : ltvToCac > 0 && ltvToCac < 3
          ? ['The current LTV:CAC ratio is thin relative to the common 3x planning benchmark.']
          : [],
    };
  }

  if (variant === 'customer-lifetime-value') {
    const grossProfitPerCustomerPerMonth = arpa * (grossMarginPercent / 100);
    const lifetimeMonths = monthlyChurnPercent > 0 ? 1 / (monthlyChurnPercent / 100) : 0;
    const clv = grossProfitPerCustomerPerMonth * lifetimeMonths;
    const totalAcquisitionSpend = marketingSpend + salesSpend + onboardingSpend;
    const cac = newCustomers > 0 ? totalAcquisitionSpend / newCustomers : 0;
    const ltvToCac = cac > 0 ? clv / cac : 0;

    return {
      primaryLabel: 'Customer Lifetime Value',
      primaryValue: clv,
      primaryCurrency: true,
      metrics: [
        { label: 'Average Customer Lifespan', value: lifetimeMonths, suffix: ' months', decimals: 1 },
        { label: 'Gross Profit per Customer per Month', value: grossProfitPerCustomerPerMonth, currency: true, decimals: 2 },
        { label: 'Customer Acquisition Cost', value: cac, currency: true },
        { label: 'LTV:CAC Ratio', value: ltvToCac, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'CLV becomes more decision-ready when it is built from gross-profit contribution instead of top-line revenue alone.',
        'Churn has a nonlinear impact because a small improvement in retention can extend customer lifespan meaningfully.',
        'CLV is most useful when you compare it to CAC and payback time rather than treating it as a vanity number.',
      ],
      warnings: monthlyChurnPercent <= 0
        ? ['Monthly churn must be above zero to estimate customer lifespan with this simplified model.']
        : [],
    };
  }

  const revenueValue = annualRevenue * revenueMultiple;
  const ebitdaValue = annualEbitda > 0 ? annualEbitda * ebitdaMultiple : 0;
  const sdeValue = annualSde > 0 ? annualSde * sdeMultiple : 0;
  const availableValues = [revenueValue, ebitdaValue, sdeValue].filter((value) => value > 0);
  const blendedEnterpriseValue = availableValues.length
    ? availableValues.reduce((sum, value) => sum + value, 0) / availableValues.length
    : 0;
  const impliedEquityValue = blendedEnterpriseValue - debt + cash;

  return {
    primaryLabel: 'Blended Enterprise Value',
    primaryValue: blendedEnterpriseValue,
    primaryCurrency: true,
    metrics: [
      { label: 'Revenue-Multiple Value', value: revenueValue, currency: true },
      { label: 'EBITDA-Multiple Value', value: ebitdaValue, currency: true },
      { label: 'SDE-Multiple Value', value: sdeValue, currency: true },
      { label: 'Implied Equity Value', value: impliedEquityValue, currency: true },
    ],
    notes: [
      'Business valuation is a range exercise, so showing multiple methods side by side is usually more honest than pretending one number is exact.',
      'Revenue multiples reward scale, EBITDA multiples reward operating profitability, and SDE multiples are common in smaller owner-operated businesses.',
      'Debt and excess cash matter because enterprise value is not the same as the equity value an owner would actually keep.',
    ],
    warnings: availableValues.length < 2
      ? ['This run relies on limited valuation methods, so the blended estimate should be treated as a rough screen only.']
      : [],
  };
}

DEFAULT_INPUTS['profit-margin'] = {
  ...BASE_INPUTS,
  revenue: '250000',
  cogs: '125000',
  operatingExpenses: '65000',
  otherExpenses: '10000',
  unitsSold: '5000',
};

DEFAULT_INPUTS.markup = {
  ...BASE_INPUTS,
  costPerUnit: '24',
  sellingPrice: '45',
  unitsSold: '1000',
};

DEFAULT_INPUTS['gross-profit'] = {
  ...BASE_INPUTS,
  revenue: '180000',
  cogs: '95000',
  unitsSold: '3200',
};

DEFAULT_INPUTS['net-profit'] = {
  ...BASE_INPUTS,
  revenue: '180000',
  cogs: '95000',
  operatingExpenses: '55000',
  otherExpenses: '8000',
  unitsSold: '3200',
};

DEFAULT_INPUTS['payback-period'] = {
  ...BASE_INPUTS,
  initialInvestment: '150000',
  discountRate: '10',
  cashFlowSeries: '35000,42000,50000,55000,60000',
};

DEFAULT_INPUTS.npv = {
  ...BASE_INPUTS,
  initialInvestment: '150000',
  discountRate: '10',
  cashFlowSeries: '35000,42000,50000,55000,60000',
};

DEFAULT_INPUTS.irr = {
  ...BASE_INPUTS,
  initialInvestment: '150000',
  hurdleRate: '12',
  cashFlowSeries: '35000,42000,50000,55000,60000',
};

DEFAULT_INPUTS['working-capital'] = {
  ...BASE_INPUTS,
  currentAssets: '420000',
  inventory: '95000',
  currentLiabilities: '260000',
  annualRevenue: '1800000',
};

DEFAULT_INPUTS['burn-rate'] = {
  ...BASE_INPUTS,
  cashBalance: '600000',
  monthlyRevenue: '80000',
  monthlyExpenses: '125000',
};

DEFAULT_INPUTS['customer-acquisition-cost'] = {
  ...BASE_INPUTS,
  marketingSpend: '40000',
  salesSpend: '30000',
  onboardingSpend: '5000',
  newCustomers: '50',
  arpa: '220',
  grossMarginPercent: '78',
  monthlyChurnPercent: '4',
};

DEFAULT_INPUTS['customer-lifetime-value'] = {
  ...BASE_INPUTS,
  marketingSpend: '40000',
  salesSpend: '30000',
  onboardingSpend: '5000',
  newCustomers: '50',
  arpa: '220',
  grossMarginPercent: '78',
  monthlyChurnPercent: '4',
};

DEFAULT_INPUTS['business-valuation'] = {
  ...BASE_INPUTS,
  annualRevenue: '2500000',
  annualEbitda: '420000',
  annualSde: '500000',
  revenueMultiple: '1.4',
  ebitdaMultiple: '5.5',
  sdeMultiple: '2.8',
  debt: '300000',
  cash: '180000',
};
