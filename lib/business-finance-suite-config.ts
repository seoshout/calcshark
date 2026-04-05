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

export type BusinessFinanceVariant =
  | 'break-even'
  | 'profit-margin'
  | 'markup'
  | 'gross-profit'
  | 'net-profit'
  | 'payback-period'
  | 'npv'
  | 'irr'
  | 'working-capital'
  | 'burn-rate'
  | 'customer-acquisition-cost'
  | 'customer-lifetime-value'
  | 'business-valuation';

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

const REF = {
  cfiBreakEven: {
    label: 'CFI: Break-Even Analysis',
    url: 'https://corporatefinanceinstitute.com/resources/accounting/break-even-analysis/',
  },
  cfiPayback: {
    label: 'CFI: Payback Period',
    url: 'https://corporatefinanceinstitute.com/resources/financial-modeling/payback-period/',
  },
  cfiDiscountedPayback: {
    label: 'CFI: Discounted Payback Period',
    url: 'https://corporatefinanceinstitute.com/resources/knowledge/finance/discounted-payback-period/',
  },
  cfiNpv: {
    label: 'CFI: Net Present Value (NPV)',
    url: 'https://corporatefinanceinstitute.com/resources/valuation/net-present-value-npv/',
  },
  cfiIrr: {
    label: 'CFI: Internal Rate of Return (IRR)',
    url: 'https://corporatefinanceinstitute.com/resources/valuation/internal-rate-return-irr/',
  },
  cfiCapitalMetrics: {
    label: 'CFI: Capital Planning Metrics',
    url: 'https://corporatefinanceinstitute.com/resources/valuation/capital-planning-metrics-guide/',
  },
  cfiWorkingCapital: {
    label: 'CFI: Working Capital Formula',
    url: 'https://corporatefinanceinstitute.com/resources/financial-modeling/working-capital-formula/',
  },
  cfiWorkingCapitalCycle: {
    label: 'CFI: Working Capital Cycle',
    url: 'https://corporatefinanceinstitute.com/resources/accounting/working-capital-cycle/',
  },
  cfiValuationMethods: {
    label: 'CFI: Valuation Methods',
    url: 'https://corporatefinanceinstitute.com/resources/valuation/valuation-methods/',
  },
  cfiEbitdaMultiple: {
    label: 'CFI: EBITDA Multiple',
    url: 'https://corporatefinanceinstitute.com/resources/capital_markets/ebitda-multiple/',
  },
  cfiCacPayback: {
    label: 'CFI: CAC Payback Period',
    url: 'https://corporatefinanceinstitute.com/resources/valuation/cac-payback-period/',
  },
  shopifyProfitMargin: {
    label: 'Shopify: What Is Profit Margin?',
    url: 'https://www.shopify.com/blog/what-is-profit-margin',
  },
  shopifyGrossMargin: {
    label: 'Shopify: Gross Margin and Gross Profit',
    url: 'https://www.shopify.com/blog/gross-margin',
  },
  shopifyGrossProfit: {
    label: 'Shopify: What Is Gross Profit?',
    url: 'https://www.shopify.com/blog/what-is-gross-profit',
  },
  shopifyNetMargin: {
    label: 'Shopify: Net Profit Margin',
    url: 'https://www.shopify.com/blog/net-profit-margin',
  },
  shopifyPricing: {
    label: 'Shopify: Wholesale and Retail Pricing',
    url: 'https://www.shopify.com/blog/product-pricing-for-wholesale-and-retail',
  },
  hubspotAcquisition: {
    label: 'HubSpot: Customer Acquisition Cost Basics',
    url: 'https://blog.hubspot.com/service/customer-acquisition',
  },
  hubspotLtvCac: {
    label: 'HubSpot: LTV:CAC Ratio',
    url: 'https://blog.hubspot.com/service/ltv-cac-ratio',
  },
  stripeBurnRate: {
    label: 'Stripe: Burn Rate Basics',
    url: 'https://stripe.com/us/resources/more/what-is-burn-rate-what-startups-need-to-know-about-this-key-metric',
  },
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Decision-ready outputs', `The result set is designed around ${focus}, not just a one-line formula answer.`),
  card('Popup-only results', 'The calculator keeps the approved advanced-popup result flow instead of pushing a thin inline answer.'),
  card('Better context for tradeoffs', 'Primary metrics, diagnostics, and watchouts stay together so the business decision is easier to read.'),
  card('Built from live research patterns', 'Inputs and outputs were chosen after reviewing public business calculators and finance explainers.'),
];

const cfg = (config: Omit<VariantConfig, 'whyUse'>): VariantConfig => ({
  ...config,
  whyUse: baseWhyUse(config.focus),
});

export const BUSINESS_FINANCE_CONFIG: Record<BusinessFinanceVariant, VariantConfig> = {
  'break-even': cfg({
    title: 'Break-Even Calculator',
    subtitle: 'Estimate break-even units, revenue, contribution margin, and target-profit volume in one screen',
    cta: 'Calculate Break-Even Point',
    reviewName: 'Break-Even Calculator',
    focus: 'volume, pricing, and contribution economics',
    concept: 'break-even analysis',
    researchFocus: 'contribution margin, break-even volume, target-profit volume, and sensitivity to pricing or variable cost changes',
    aboutParagraphs: [
      'This calculator is built for one of the most practical business-finance questions: how much volume it takes before a product, line, or business stops losing money and starts contributing real profit.',
      'Instead of only showing the break-even point, this version keeps the surrounding economics visible as well, including contribution margin, break-even revenue, target-profit units, and planned profit at your current sales level.',
      'That matters because owners rarely change only one lever. Pricing, variable cost, and fixed-cost pressure often move together, so a useful break-even tool has to show the relationship between all three.',
    ],
    stepTips: [
      'Enter fixed costs that will exist whether you sell one unit or one thousand units during the planning window.',
      'Use a realistic average selling price and variable cost per unit so contribution margin is grounded in current operations.',
      'Add a planned sales volume and optional target profit if you want the calculator to move beyond simple break-even into goal-setting.',
      'Read the popup result as a planning screen for pricing, cost control, and sales targets rather than a static accounting exercise.',
    ],
    dashboardTips: [
      'Break-even units and break-even revenue for the current pricing structure.',
      'Contribution margin in dollars and as a percentage of selling price.',
      'Planned-profit readout so you can compare current sales assumptions against the no-profit line.',
      'Target-profit volume so budget goals can be turned into a usable sales target.',
    ],
    features: [
      'Break-even units and revenue in the same run',
      'Contribution margin per unit and contribution margin ratio',
      'Planned-profit screening at current sales volume',
      'Target-profit unit calculation',
      'Warnings when pricing fails to clear variable cost',
      'Long-form guidance that stays consistent with the approved advanced calculator structure',
    ],
    decisionCards: [
      card('If the break-even volume feels unrealistic', 'The problem may be pricing, variable cost, or overhead structure rather than sales execution alone.'),
      card('If contribution margin is thin', 'A small discount or cost increase can push the business below break-even faster than expected.'),
      card('If target-profit volume is far above current throughput', 'Treat the result as a signal to revisit price, channel mix, or fixed-cost discipline.'),
      card('If planned profit is barely above zero', 'The business may still be fragile even though it technically clears break-even.'),
    ],
    quickRows: [
      row('Break-even units', 'Fixed Costs / (Price - Variable Cost)', 'Shows the unit volume needed to cover fixed cost.'),
      row('Break-even revenue', 'Break-Even Units x Price', 'Translates the volume threshold into sales dollars.'),
      row('Contribution margin ratio', '(Price - Variable Cost) / Price', 'Shows how much of each sales dollar covers fixed costs and profit.'),
      row('Target-profit units', '(Fixed Costs + Target Profit) / Contribution Margin', 'Turns profit goals into a sales-volume target.'),
    ],
    references: [REF.cfiBreakEven, REF.shopifyPricing, REF.shopifyProfitMargin],
    understanding: [
      card('Why contribution margin matters', 'Break-even analysis only works if the unit contribution is positive. A higher selling price or lower variable cost widens the amount each sale contributes to fixed costs and profit.'),
      card('Fixed cost versus variable cost', 'Break-even is a structure problem. Fixed costs create the hurdle, while variable costs determine how much each sale helps clear it.'),
      card('Break-even is not a comfort line', 'Clearing break-even does not automatically mean the business is healthy. It only means the model is no longer losing money at that volume.'),
      card('Use it for sensitivity, not certainty', 'A strong operator usually checks how break-even changes if prices soften, input costs rise, or demand falls below plan.'),
    ],
    faqs: [
      faq('What is a good break-even point?', 'There is no universal number. A stronger break-even point is one that your business can realistically reach with room to spare under normal operating conditions.', 'Planning'),
      faq('Why does the calculator show contribution margin too?', 'Because break-even volume only makes sense when you understand how much each unit contributes toward fixed costs and profit.', 'Method'),
      faq('Can break-even analysis be used for services too?', 'Yes. The same logic applies if you can estimate average selling price, direct service cost, and fixed overhead for the planning period.', 'Use Cases'),
    ],
  }),
  'profit-margin': cfg({
    title: 'Profit Margin Calculator',
    subtitle: 'Measure gross, operating, and net margin so profitability is easier to read than topline revenue alone',
    cta: 'Calculate Profit Margin',
    reviewName: 'Profit Margin Calculator',
    focus: 'earnings quality and cost absorption',
    concept: 'profit margins',
    researchFocus: 'gross margin, operating margin, net margin, and the difference between profit dollars and profit percentages',
    aboutParagraphs: [
      'This page is designed to answer a question many growing businesses struggle with: are sales actually turning into usable profit, or are costs rising just as quickly as revenue?',
      'The calculator keeps gross profit, operating profit, net profit, and their related margins together so you can see where pressure is entering the income statement rather than relying on one percentage in isolation.',
      'That makes it more useful than a simple margin widget because margin decisions are rarely about one formula. Pricing, cost control, overhead, and sales mix all show up in the result together.',
    ],
    stepTips: [
      'Enter revenue and direct cost of goods sold for the same period so the gross-profit layer is coherent.',
      'Add operating expenses and other costs to push the model from a shallow gross-margin read into a full profitability screen.',
      'Use unit volume when you want profit per unit, which helps connect income-statement results back to commercial reality.',
      'Read the popup result as a margin stack: gross first, then operating, then net.',
    ],
    dashboardTips: [
      'Net margin as the headline profitability percentage.',
      'Gross, operating, and net profit in dollar terms for the same period.',
      'Supporting margin percentages so you can see where profitability changes between layers.',
      'Profit-per-unit context for teams that need product or service-level interpretation.',
    ],
    features: [
      'Gross, operating, and net margin in one run',
      'Profit dollars and profit percentages together',
      'Net profit per unit support',
      'Warning states when revenue is missing or margin collapses',
      'Original long-form educational content',
      'Look and feel aligned with the approved advanced calculator pattern',
    ],
    decisionCards: [
      card('If gross margin is healthy but net margin is weak', 'The problem is usually overhead load, not pricing alone.'),
      card('If net margin is improving slower than revenue', 'Scale may be pulling additional operating expense behind it.'),
      card('If gross margin is already thin', 'Operational efficiency helps, but pricing or sourcing may need deeper attention.'),
      card('If profit per unit is small', 'Small pricing or cost shifts can have an outsized effect on total earnings.'),
    ],
    quickRows: [
      row('Gross margin', '(Revenue - COGS) / Revenue', 'Shows how much sales remain after direct production or fulfillment cost.'),
      row('Operating margin', '(Gross Profit - Operating Expenses) / Revenue', 'Adds overhead discipline to the read.'),
      row('Net margin', 'Net Profit / Revenue', 'Measures what the business keeps after all modeled expenses.'),
      row('Profit per unit', 'Net Profit / Units Sold', 'Useful when percentage results need a unit-level lens.'),
    ],
    references: [REF.shopifyProfitMargin, REF.shopifyGrossMargin, REF.shopifyNetMargin],
    understanding: [
      card('Profit dollars versus margin percent', 'A business can grow profit dollars while still seeing weaker margin if costs are expanding faster than revenue.'),
      card('Why margin stacks matter', 'Gross, operating, and net margins describe different failure points in the business model. Seeing all three together gives the result more diagnostic value.'),
      card('Margin is not the same as markup', 'Margin is based on sales price, while markup is based on cost. Mixing the two often creates pricing mistakes.'),
      card('Use margin as a trend tool', 'Single-period margin matters, but margin movement over time often tells the stronger strategic story.'),
    ],
    faqs: [
      faq('What is the difference between gross margin and net margin?', 'Gross margin only removes direct cost of goods sold. Net margin removes all modeled business expenses and shows what is left at the bottom line.', 'Basics'),
      faq('Why can revenue grow while profit margin falls?', 'Because costs can rise faster than sales. Revenue growth without cost discipline does not guarantee stronger margins.', 'Interpretation'),
      faq('Is a higher margin always better?', 'Usually yes, but margin should still be read alongside scale, reinvestment needs, and competitive context.', 'Strategy'),
    ],
  }),
  markup: cfg({
    title: 'Markup Calculator',
    subtitle: 'Compare markup, margin, unit profit, and projected gross profit before you set or change prices',
    cta: 'Calculate Markup',
    reviewName: 'Markup Calculator',
    focus: 'pricing discipline and unit economics',
    concept: 'markup and margin pricing',
    researchFocus: 'markup, gross margin, unit profit, and the pricing spread between wholesale cost and selling price',
    aboutParagraphs: [
      'This calculator focuses on one of the most common pricing mistakes in business: confusing markup with margin and then setting a price that looks profitable on paper but underperforms in reality.',
      'The advanced version keeps markup, margin, unit profit, projected revenue, and projected gross profit together so you can see the pricing relationship from more than one angle.',
      'That makes it useful for wholesale pricing, retail pricing, and internal product reviews where a price change needs to be tested against both percentage logic and actual dollars.',
    ],
    stepTips: [
      'Enter your cost per unit first, including the direct product cost you want the selling price to recover.',
      'Add the proposed selling price so the page can compare markup and margin without forcing you to translate between them manually.',
      'Use expected unit volume if you want projected revenue and gross-profit context rather than a unit-only answer.',
      'Review margin and markup together before making pricing decisions, especially for wholesale or discount-heavy channels.',
    ],
    dashboardTips: [
      'Markup percentage based on cost as the headline read.',
      'Gross margin percentage so price decisions are easier to compare with margin targets.',
      'Unit profit in dollars to show what one sale actually contributes.',
      'Projected gross profit at the entered unit volume.',
    ],
    features: [
      'Markup and margin shown side by side',
      'Unit profit and projected gross profit',
      'Projected revenue from sales volume',
      'Warnings when price does not fully cover cost',
      'Wholesale and retail pricing context',
      'Original copy with the same advanced content structure used across new tools',
    ],
    decisionCards: [
      card('If markup looks strong but margin still feels thin', 'That is usually a sign you are thinking in cost-based terms while selling in revenue-based reality.'),
      card('If unit profit is low', 'The business may need higher volume just to cover overhead that is not included in direct cost.'),
      card('If projected gross profit looks healthy', 'Make sure fees, shipping, and operating overhead do not erase the advantage later.'),
      card('If pricing is channel-dependent', 'Check separate wholesale and retail scenarios instead of relying on one blended price.'),
    ],
    quickRows: [
      row('Markup', '(Selling Price - Cost) / Cost', 'Shows how much the price is above cost as a percentage of cost.'),
      row('Margin', '(Selling Price - Cost) / Selling Price', 'Shows what share of the selling price remains as gross profit.'),
      row('Unit profit', 'Selling Price - Cost', 'Measures the dollar contribution from one sale before overhead.'),
      row('Projected gross profit', 'Unit Profit x Units', 'Connects pricing to expected sales volume.'),
    ],
    references: [REF.shopifyPricing, REF.shopifyProfitMargin, REF.shopifyGrossMargin],
    understanding: [
      card('Markup and margin are different tools', 'Markup answers a cost-based pricing question, while margin answers a revenue-based profitability question.'),
      card('Why pricing mistakes happen', 'Many businesses set a target markup and then assume it means the same thing as their desired margin. It does not.'),
      card('Use unit profit to stay grounded', 'Even when percentages look good, unit profit tells you whether the price is meaningful enough to support the model.'),
      card('Volume does not fix bad pricing forever', 'Higher volume can increase total gross profit, but thin unit economics still create fragile operations.'),
    ],
    faqs: [
      faq('What is the difference between markup and margin?', 'Markup is measured against cost. Margin is measured against selling price. They are related, but they are not interchangeable.', 'Basics'),
      faq('Why does my margin look lower than my markup?', 'Because margin uses selling price as the denominator, which is always larger than cost when the product is profitable.', 'Method'),
      faq('Should I price from markup or margin?', 'Many teams track both. Markup is useful for cost-based pricing, while margin is often the stronger management and reporting lens.', 'Strategy'),
    ],
  }),
  'gross-profit': cfg({
    title: 'Gross Profit Calculator',
    subtitle: 'Calculate gross profit, gross margin, and gross profit per unit before overhead enters the picture',
    cta: 'Calculate Gross Profit',
    reviewName: 'Gross Profit Calculator',
    focus: 'direct profitability before overhead',
    concept: 'gross profit and gross margin',
    researchFocus: 'gross profit dollars, gross margin percentage, direct cost pressure, and sales-quality screening',
    aboutParagraphs: [
      'Gross profit is one of the fastest ways to see whether a business is creating enough room between revenue and direct cost before overhead, financing, and taxes enter the picture.',
      'This calculator keeps gross profit and gross margin together because the dollar amount and the percentage answer different management questions.',
      'Used properly, it is not just a reporting metric. It is a signal for pricing strength, sourcing efficiency, and whether the business has enough room to absorb operating expenses later.',
    ],
    stepTips: [
      'Enter revenue and cost of goods sold for the same time window so the comparison stays valid.',
      'Add unit volume if you want gross profit per unit and not just the total period result.',
      'Use the result to screen the quality of sales before moving into full net-profit analysis.',
      'Treat a shrinking gross margin as an operational signal, not only an accounting outcome.',
    ],
    dashboardTips: [
      'Gross profit dollars as the headline result.',
      'Gross margin percentage for comparability across periods or products.',
      'COGS ratio so direct cost pressure is easy to read.',
      'Gross profit per unit for a more commercial interpretation.',
    ],
    features: [
      'Gross profit and gross margin together',
      'COGS ratio support',
      'Gross profit per unit',
      'Revenue context instead of a percentage-only answer',
      'Educational interpretation blocks',
      'Consistent advanced design and section structure',
    ],
    decisionCards: [
      card('If gross margin is shrinking', 'Direct cost inflation, discounting, or sales-mix changes may be eroding the revenue base.'),
      card('If gross profit is rising but margin is flat', 'Scale is helping, but pricing power may not actually be improving.'),
      card('If gross profit per unit is low', 'The business may need either better pricing or lower direct cost before overhead can be carried safely.'),
      card('If COGS ratio is high', 'Direct cost management may be a stronger lever than top-line growth.'),
    ],
    quickRows: [
      row('Gross profit', 'Revenue - COGS', 'Measures the dollars left after direct production or fulfillment cost.'),
      row('Gross margin', 'Gross Profit / Revenue', 'Shows the percentage of sales left after direct cost.'),
      row('COGS ratio', 'COGS / Revenue', 'A direct-cost lens that complements gross margin.'),
      row('Gross profit per unit', 'Gross Profit / Units Sold', 'Helps translate totals into unit economics.'),
    ],
    references: [REF.shopifyGrossProfit, REF.shopifyGrossMargin, REF.shopifyProfitMargin],
    understanding: [
      card('Gross profit is an early operating signal', 'It sits high in the income statement and helps show whether the core offer still has pricing room.'),
      card('Why gross profit is not enough by itself', 'A strong gross margin can still produce weak net profit if overhead is too heavy.'),
      card('Use both dollars and percent', 'Gross profit dollars show scale. Gross margin shows efficiency. The stronger read uses both.'),
      card('What usually changes gross margin', 'Pricing, product mix, input cost, and discounting are the most common drivers.'),
    ],
    faqs: [
      faq('What is gross profit?', 'Gross profit is revenue minus cost of goods sold. It shows what remains before operating overhead and other expenses are deducted.', 'Basics'),
      faq('What is the difference between gross profit and gross margin?', 'Gross profit is a dollar amount. Gross margin expresses the same idea as a percentage of revenue.', 'Method'),
      faq('Why track gross profit per unit?', 'It helps connect financial reporting back to product-level economics and pricing decisions.', 'Use Cases'),
    ],
  }),
  'net-profit': cfg({
    title: 'Net Profit Calculator',
    subtitle: 'Measure bottom-line profit, net margin, and operating drag after all modeled costs are counted',
    cta: 'Calculate Net Profit',
    reviewName: 'Net Profit Calculator',
    focus: 'bottom-line profitability after full cost load',
    concept: 'net profit',
    researchFocus: 'net income, net margin, expense load, and the difference between gross success and bottom-line success',
    aboutParagraphs: [
      'Net profit is the number many owners, operators, and lenders ultimately care about because it shows what remains after the business has carried its full modeled cost load.',
      'This version goes beyond the simple subtraction formula by keeping net profit, net margin, operating profit, and expense load visible in the same run.',
      'That makes it more useful for planning because bottom-line performance is where revenue discipline, gross economics, and overhead management all finally meet.',
    ],
    stepTips: [
      'Enter revenue, direct costs, operating expenses, and other expenses for the same reporting window.',
      'Add units sold if you want to connect net profit back to a per-unit read.',
      'Use the result to see whether the business is actually keeping enough after all modeled cost layers are absorbed.',
      'If the result is weak, compare gross-profit strength with net-profit weakness to locate where the pressure is coming from.',
    ],
    dashboardTips: [
      'Net profit as the headline bottom-line result.',
      'Net margin for period-over-period or peer comparison.',
      'Operating profit so you can see what happens before other expense pressure is layered in.',
      'Expense-load percentage and profit per unit for better interpretation.',
    ],
    features: [
      'Bottom-line profit in dollars and percent',
      'Operating profit support',
      'Expense-load readout',
      'Net profit per unit',
      'Loss-state warnings',
      'Full advanced educational content pattern',
    ],
    decisionCards: [
      card('If gross profit is fine but net profit is poor', 'Overhead, non-operating expense, or cost creep may be the real issue.'),
      card('If net margin is negative', 'The business is not yet converting revenue into sustainable earnings under the current assumptions.'),
      card('If expense load is high', 'Operational simplification can matter as much as new sales.'),
      card('If net profit per unit is tiny', 'Small cost inflation or discounting can flip the model into loss territory quickly.'),
    ],
    quickRows: [
      row('Net profit', 'Revenue - COGS - Operating Expenses - Other Expenses', 'Measures what remains after the modeled cost stack is absorbed.'),
      row('Net margin', 'Net Profit / Revenue', 'Shows how much of each sales dollar the business keeps.'),
      row('Expense load', '(COGS + OpEx + Other) / Revenue', 'Useful for seeing how much of revenue is consumed by costs.'),
      row('Net profit per unit', 'Net Profit / Units Sold', 'Connects bottom-line performance to the unit model.'),
    ],
    references: [REF.shopifyNetMargin, REF.shopifyProfitMargin, REF.shopifyGrossMargin],
    understanding: [
      card('Net profit is the full-cost lens', 'It captures what is left after direct cost, operating overhead, and other modeled expense layers are all considered.'),
      card('Why net margin matters', 'A business can show impressive sales and still be structurally weak if very little reaches the bottom line.'),
      card('Gross profit still matters', 'Net profit is stronger when it is read as the result of earlier margin layers, not as a standalone surprise number.'),
      card('Improving net profit', 'Levers usually include better pricing, better gross margin, lower overhead, or a sharper sales mix.'),
    ],
    faqs: [
      faq('What is net profit?', 'Net profit is the amount left after all modeled business expenses are subtracted from revenue.', 'Basics'),
      faq('Why is net margin useful?', 'It makes profitability easier to compare across time, products, and companies than profit dollars alone.', 'Method'),
      faq('Can a business have strong gross profit and weak net profit?', 'Yes. That usually means operating expenses or other costs are absorbing too much of the gross-profit base.', 'Interpretation'),
    ],
  }),
  'payback-period': cfg({
    title: 'Payback Period Calculator',
    subtitle: 'Compare simple and discounted payback so investment recovery timing is easier to judge',
    cta: 'Calculate Payback Period',
    reviewName: 'Payback Period Calculator',
    focus: 'investment recovery timing',
    concept: 'payback period analysis',
    researchFocus: 'simple payback, discounted payback, cumulative cash recovery, and where timing risk enters a project decision',
    aboutParagraphs: [
      'This calculator is designed for capital-allocation questions where timing matters just as much as total return. It shows how long it takes to recover an initial investment from projected future cash flows.',
      'The advanced version includes both simple payback and discounted payback because recovery timing looks different once the time value of money is acknowledged.',
      'That is why the result works best as a screening metric, not a complete verdict. Payback can be helpful, but it does not replace NPV or IRR when value creation is the core question.',
    ],
    stepTips: [
      'Enter the full initial investment as a positive number representing upfront cash committed today.',
      'Add future period cash flows in chronological order, separated by commas, so cumulative recovery can be measured correctly.',
      'Use a discount rate when you want to compare simple payback against a time-value-aware version of the same project.',
      'Read the result as a timing screen first, then confirm value with NPV or IRR if the project remains interesting.',
    ],
    dashboardTips: [
      'Simple payback period as the headline recovery measure.',
      'Discounted payback to show how recovery timing changes after discounting.',
      'Total project inflow and cumulative surplus over the entered horizon.',
      'Warnings if the project never recovers its initial outlay inside the modeled timeline.',
    ],
    features: [
      'Simple payback and discounted payback together',
      'Comma-separated cash-flow input for practical project screening',
      'Cumulative-surplus support',
      'Discount-rate-aware recovery timing',
      'Warnings when recovery never occurs in the entered horizon',
      'Deeper content than a basic one-number capital-budgeting widget',
    ],
    decisionCards: [
      card('If simple payback looks fine but discounted payback stretches out', 'The project may be depending too heavily on later cash flows.'),
      card('If payback never occurs', 'The project may still have strategic value, but it is not self-recovering inside the modeled timeline.'),
      card('If payback is short but NPV would likely be weak', 'A fast recovery does not automatically mean strong long-term value creation.'),
      card('If the project is liquidity-sensitive', 'Payback can be especially useful because cash recovery timing can matter more than total accounting profit.'),
    ],
    quickRows: [
      row('Simple payback', 'Initial Investment / Annual Recovery Pattern', 'A timing-focused measure that ignores discounting.'),
      row('Discounted payback', 'Recover investment using discounted cash flows', 'Accounts for the time value of money.'),
      row('Cumulative cash flow', 'Running total of project inflows', 'Shows when the initial outlay is fully recovered.'),
      row('Use with other metrics', 'Pair with NPV or IRR', 'Payback alone does not tell the full value story.'),
    ],
    references: [REF.cfiPayback, REF.cfiDiscountedPayback, REF.cfiCapitalMetrics],
    understanding: [
      card('Why payback is popular', 'It is intuitive. Many operators want to know how fast their money comes back before they worry about more advanced valuation metrics.'),
      card('Its biggest limitation', 'Payback does not measure all value created after the recovery point, so it can under-reward longer-lived projects.'),
      card('Discounted payback is stricter', 'A dollar received later is worth less than a dollar received sooner, which is why discounting often pushes payback farther out.'),
      card('Best use case', 'Payback is often strongest as a first-pass screen for liquidity-sensitive projects or capital constraints.'),
    ],
    faqs: [
      faq('What is the payback period?', 'It is the amount of time required for a project to recover its initial investment from future cash inflows.', 'Basics'),
      faq('Why show discounted payback too?', 'Because a time-value-aware version of payback is often more realistic than a simple undiscounted recovery read.', 'Method'),
      faq('Is a shorter payback always better?', 'Not always. Shorter payback improves liquidity, but it does not guarantee the highest total value creation.', 'Strategy'),
    ],
  }),
  npv: cfg({
    title: 'NPV Calculator',
    subtitle: 'Evaluate project value creation with discount-rate-aware present value math',
    cta: 'Calculate NPV',
    reviewName: 'NPV Calculator',
    focus: 'value creation after discounting future cash flows',
    concept: 'net present value',
    researchFocus: 'present value of inflows, hurdle-rate thinking, profitability index, and whether a project creates value above its required return',
    aboutParagraphs: [
      'Net present value is one of the clearest ways to test whether a project or investment creates value once future cash flows are translated into today-value dollars.',
      'This calculator keeps NPV, present value of inflows, discount rate, and profitability index in the same result so the meaning of the project is clearer than a single positive-or-negative label.',
      'That matters because the right discount rate is not just a math detail. It is the assumption that connects project risk, required return, and capital-allocation discipline.',
    ],
    stepTips: [
      'Enter the initial investment as the upfront outflow you need to recover and exceed.',
      'List projected future cash flows in chronological order using commas between periods.',
      'Use a discount rate that reflects the required return or opportunity cost relevant to the project.',
      'Read a positive NPV as value creation above the discount-rate hurdle, not merely accounting profit.',
    ],
    dashboardTips: [
      'Net present value as the headline decision output.',
      'Present value of inflows so you can see what the discounted future stream is worth today.',
      'Profitability index to compare value created per unit of initial investment.',
      'Warnings when the project fails to clear the discount-rate hurdle.',
    ],
    features: [
      'Discount-rate-aware NPV result',
      'Present value of inflows and profitability index',
      'Comma-separated cash-flow input',
      'Support for project screening and capital allocation',
      'Interpretation notes about hurdle-rate logic',
      'Advanced long-form content matching the site reference structure',
    ],
    decisionCards: [
      card('If NPV is positive', 'The project is expected to create value above the required return under the current assumptions.'),
      card('If NPV is negative', 'The project may still make accounting profit, but it is not clearing the return threshold you entered.'),
      card('If NPV is highly sensitive to discount rate', 'The project decision may be more assumption-dependent than it first appears.'),
      card('If two projects both look attractive', 'Profitability index and strategic fit can help sort projects when capital is limited.'),
    ],
    quickRows: [
      row('Net present value', 'PV of Inflows - Initial Investment', 'Measures value created after discounting future cash flows.'),
      row('Discount rate', 'Required return or hurdle rate', 'The key assumption that converts future money into present value.'),
      row('Profitability index', 'PV of Inflows / Initial Investment', 'Helpful when comparing projects with limited capital.'),
      row('Decision rule', 'Positive NPV is generally favorable', 'Signals value creation above the required return.'),
    ],
    references: [REF.cfiNpv, REF.cfiCapitalMetrics, REF.cfiPayback],
    understanding: [
      card('Why NPV is widely used', 'It directly measures value creation in current dollars rather than relying only on timing or percentages.'),
      card('Discount rate discipline', 'A weak discount-rate assumption can make a weak project look attractive, so the hurdle input deserves serious attention.'),
      card('NPV versus profit', 'A project can show accounting profit and still have a negative NPV if returns arrive too slowly or below the required rate.'),
      card('Pairing NPV with other metrics', 'IRR and payback can add perspective, but NPV often remains the strongest total-value screen.'),
    ],
    faqs: [
      faq('What does a positive NPV mean?', 'It means the project is expected to create value above the required return assumption you entered.', 'Basics'),
      faq('Why is the discount rate so important?', 'Because it determines how aggressively future cash flows are discounted into present value.', 'Method'),
      faq('Can two projects have the same NPV but different risk?', 'Yes. NPV depends on the cash flows and discount rate you assume, so risk still has to be judged through the assumptions behind the model.', 'Interpretation'),
    ],
  }),
  irr: cfg({
    title: 'IRR Calculator',
    subtitle: 'Estimate the break-even rate of return for a project and compare it with your hurdle rate',
    cta: 'Calculate IRR',
    reviewName: 'IRR Calculator',
    focus: 'investment efficiency as a rate of return',
    concept: 'internal rate of return',
    researchFocus: 'IRR, hurdle-rate comparison, NPV-at-hurdle, and the limits of percentage-only project analysis',
    aboutParagraphs: [
      'This calculator is built for decision-makers who want to know the implied return rate embedded in a project cash-flow pattern, not just its total dollar value.',
      'The advanced version estimates IRR, compares it with a hurdle rate, and keeps NPV-at-hurdle visible so the project can be read both as a percentage and as a value-creation problem.',
      'That matters because IRR is useful, but it is not perfect. It can hide scale differences, unusual cash-flow patterns, and reinvestment assumptions if you use it alone.',
    ],
    stepTips: [
      'Enter the full initial investment and then the expected future cash flows in order by period.',
      'Add a hurdle rate so the page can compare the project return with your minimum acceptable return.',
      'Read the IRR as the discount rate that would drive NPV to zero for the entered pattern.',
      'Use the supporting NPV-at-hurdle output to avoid making a percentage-only decision.',
    ],
    dashboardTips: [
      'IRR as the headline return estimate.',
      'NPV at the entered hurdle rate for a value-creation cross-check.',
      'Hurdle-rate comparison so accept or reject logic is easier to interpret.',
      'Warnings when the cash-flow pattern does not support a clean IRR estimate.',
    ],
    features: [
      'IRR estimate from project cash flows',
      'Hurdle-rate comparison',
      'NPV-at-hurdle cross-check',
      'Support for projects with standard periodic cash flows',
      'Warnings when no clear IRR is available',
      'Original content aligned with the approved advanced calculator layout',
    ],
    decisionCards: [
      card('If IRR is above the hurdle rate', 'The project clears the minimum return screen under the current assumptions, but you should still review NPV and scale.'),
      card('If IRR is below the hurdle rate', 'The project is not compensating enough for the required return standard you entered.'),
      card('If IRR looks high but NPV is modest', 'The project may be efficient in percentage terms but small in total dollar value.'),
      card('If no stable IRR appears', 'The cash-flow pattern may be unconventional, and NPV may be the cleaner decision metric.'),
    ],
    quickRows: [
      row('IRR', 'Discount rate where NPV = 0', 'Shows the project break-even rate of return.'),
      row('Hurdle test', 'IRR compared with required return', 'Helps screen whether the project clears your minimum standard.'),
      row('NPV cross-check', 'Use NPV at hurdle rate', 'Prevents a percentage-only read from hiding scale or timing issues.'),
      row('Caution', 'IRR can mislead with unusual cash flows', 'Multiple sign changes can distort the result.'),
    ],
    references: [REF.cfiIrr, REF.cfiCapitalMetrics, REF.cfiNpv],
    understanding: [
      card('Why managers like IRR', 'It expresses project attractiveness as a percentage, which makes it intuitive to compare with a hurdle rate or cost of capital.'),
      card('What IRR does not tell you', 'It does not directly show how many dollars of value are created, which is why NPV still matters.'),
      card('When IRR can break down', 'Projects with unconventional cash-flow patterns can produce unstable, missing, or multiple IRR interpretations.'),
      card('Best practice', 'Use IRR as part of a capital-planning stack with NPV, payback, and strategic context.'),
    ],
    faqs: [
      faq('What is IRR?', 'IRR is the discount rate that makes the net present value of a project equal to zero.', 'Basics'),
      faq('Why compare IRR with a hurdle rate?', 'Because the hurdle rate represents the minimum acceptable return for taking on the project.', 'Method'),
      faq('Is a higher IRR always better?', 'Not always. A very high IRR on a tiny project can still create less total value than a larger project with a slightly lower IRR.', 'Strategy'),
    ],
  }),
  'working-capital': cfg({
    title: 'Working Capital Calculator',
    subtitle: 'Measure short-term liquidity with working capital, current ratio, quick ratio, and working-capital days',
    cta: 'Calculate Working Capital',
    reviewName: 'Working Capital Calculator',
    focus: 'short-term liquidity and operating cushion',
    concept: 'working capital',
    researchFocus: 'current assets, current liabilities, working capital, quick ratio, and how liquidity supports daily operations',
    aboutParagraphs: [
      'Working capital is one of the clearest ways to understand whether a business has enough short-term resources to keep operating smoothly without immediate financing stress.',
      'This calculator keeps working capital, current ratio, quick ratio, inventory share, and working-capital days together so the liquidity story is not reduced to one balance-sheet subtraction.',
      'That broader view matters because positive working capital alone does not always mean healthy liquidity, especially when inventory is heavy or receivables are slow.',
    ],
    stepTips: [
      'Enter current assets and current liabilities from the same balance-sheet date or management reporting period.',
      'Add inventory separately so the quick-ratio read can strip out less-liquid current assets.',
      'Use annual revenue if you want to translate the balance-sheet result into working-capital days.',
      'Read the result as an operating-cushion screen, not as a substitute for full cash-flow forecasting.',
    ],
    dashboardTips: [
      'Working capital in dollars as the primary liquidity cushion.',
      'Current ratio and quick ratio for balance-sheet efficiency.',
      'Inventory share of current assets to show how much liquidity is tied up in stock.',
      'Working-capital days to connect liquidity with business scale.',
    ],
    features: [
      'Working capital, current ratio, and quick ratio in one run',
      'Inventory-adjusted liquidity screening',
      'Working-capital days support',
      'Warnings for negative or thin liquidity',
      'Operational interpretation instead of a bare accounting answer',
      'Long-form content built to the approved advanced-tool standard',
    ],
    decisionCards: [
      card('If working capital is negative', 'The business may be relying on supplier terms, short-term financing, or unusually fast cash conversion to stay liquid.'),
      card('If current ratio looks fine but quick ratio is weak', 'Inventory may be doing too much of the liquidity work.'),
      card('If working-capital days are high', 'The business may have too much cash tied up in receivables or inventory.'),
      card('If working capital is strong', 'Use that cushion deliberately rather than assuming all of it is free growth capital.'),
    ],
    quickRows: [
      row('Working capital', 'Current Assets - Current Liabilities', 'Shows the short-term dollar cushion available after near-term obligations.'),
      row('Current ratio', 'Current Assets / Current Liabilities', 'A broad liquidity ratio.'),
      row('Quick ratio', '(Current Assets - Inventory) / Current Liabilities', 'A tighter liquidity test that excludes inventory.'),
      row('Working-capital days', 'Working Capital / Annual Revenue x 365', 'Connects liquidity with operating scale.'),
    ],
    references: [REF.cfiWorkingCapital, REF.cfiWorkingCapitalCycle, REF.cfiValuationMethods],
    understanding: [
      card('Why working capital matters', 'Short-term liquidity problems can damage a healthy business faster than many long-term strategic problems.'),
      card('Positive is not always enough', 'A business can show positive working capital and still struggle if inventory is stale or receivables are slow.'),
      card('Quick ratio adds discipline', 'Removing inventory helps reveal whether the business has enough near-cash assets to meet short-term obligations.'),
      card('Use with cash-flow forecasting', 'Working capital is a snapshot. Cash-flow planning shows how liquidity may evolve over time.'),
    ],
    faqs: [
      faq('What is working capital?', 'Working capital is current assets minus current liabilities. It measures the short-term resources available after near-term obligations are covered.', 'Basics'),
      faq('Why show the quick ratio?', 'Because inventory is not always as liquid as cash or receivables, so quick ratio gives a stricter liquidity check.', 'Method'),
      faq('Can negative working capital ever be acceptable?', 'In some fast-cash, negative-cycle business models it can be manageable, but it still deserves close monitoring.', 'Interpretation'),
    ],
  }),
  'burn-rate': cfg({
    title: 'Burn Rate Calculator',
    subtitle: 'Estimate gross burn, net burn, revenue coverage, and runway from cash balance and monthly spend',
    cta: 'Calculate Burn Rate',
    reviewName: 'Burn Rate Calculator',
    focus: 'cash burn and runway pressure',
    concept: 'burn rate and runway',
    researchFocus: 'gross burn, net burn, runway months, and how revenue coverage changes financing urgency',
    aboutParagraphs: [
      'This calculator is built for cash-management questions where time matters. It helps founders and operators translate monthly spending and revenue into a more useful runway conversation.',
      'The advanced version keeps gross burn, net burn, revenue coverage, and estimated runway together because a business can look very different depending on whether you focus on spending alone or spending net of revenue.',
      'That makes the result more practical for budgeting, fundraising timing, and scenario planning than a thin runway-only widget.',
    ],
    stepTips: [
      'Enter current cash balance as the amount of liquidity available to support operations right now.',
      'Use average monthly revenue and monthly expenses from the same operating period so burn is not distorted.',
      'Read gross burn and net burn together before focusing on runway months.',
      'If the business is already cash-flow positive, treat the result as a liquidity snapshot rather than a classic burn-rate stress test.',
    ],
    dashboardTips: [
      'Net burn rate as the headline cash-loss measure.',
      'Gross burn rate to show total monthly spending before revenue offsets it.',
      'Estimated runway in months while cash remains available.',
      'Revenue-coverage percentage so recovery progress is easier to judge.',
    ],
    features: [
      'Gross burn and net burn together',
      'Runway estimate from live cash balance',
      'Revenue-coverage support',
      'Cash-positive warning state',
      'Original strategic content and planning guidance',
      'Visual structure aligned with the car-payment-style reference pages',
    ],
    decisionCards: [
      card('If runway is below six months', 'Financing urgency, cost control, or revenue acceleration may need immediate attention.'),
      card('If gross burn is high but net burn is improving', 'Commercial progress may be real even if cash pressure is still present.'),
      card('If the business is cash-flow positive', 'Focus shifts from survival runway to durability, reserve policy, and disciplined reinvestment.'),
      card('If revenue coverage is weak', 'Cutting discretionary spend may create more runway faster than waiting for growth alone.'),
    ],
    quickRows: [
      row('Gross burn', 'Monthly Expenses', 'Measures total monthly cash outflow before revenue.'),
      row('Net burn', 'Monthly Expenses - Monthly Revenue', 'Shows actual monthly cash loss.'),
      row('Runway', 'Cash Balance / Net Burn', 'Estimates how many months current cash can support operations.'),
      row('Revenue coverage', 'Monthly Revenue / Monthly Expenses', 'Shows how much of the cost base is already being absorbed by revenue.'),
    ],
    references: [REF.stripeBurnRate, REF.hubspotAcquisition, REF.hubspotLtvCac],
    understanding: [
      card('Gross versus net burn', 'Gross burn tells you how expensive the machine is. Net burn tells you how much cash the machine is actually consuming after revenue.'),
      card('Runway is a planning signal', 'It is not a promise. Real runway depends on volatility, collections, seasonality, and how quickly you can change cost.'),
      card('Revenue coverage matters', 'A business with strong revenue coverage often has more strategic options than one with similar burn but weaker commercial traction.'),
      card('Why timing matters', 'Burn rate is not just about cost control. It affects fundraising leverage, negotiation power, and the ability to choose rather than react.'),
    ],
    faqs: [
      faq('What is burn rate?', 'Burn rate measures how quickly a business is spending cash, usually on a monthly basis.', 'Basics'),
      faq('What is the difference between gross burn and net burn?', 'Gross burn is total monthly spend. Net burn subtracts monthly revenue to show the actual cash loss.', 'Method'),
      faq('How much runway is enough?', 'There is no universal rule, but shorter runway generally means less flexibility and more financing pressure.', 'Planning'),
    ],
  }),
  'customer-acquisition-cost': cfg({
    title: 'Customer Acquisition Cost Calculator',
    subtitle: 'Measure CAC, payback months, and LTV:CAC context from sales and marketing spend',
    cta: 'Calculate CAC',
    reviewName: 'Customer Acquisition Cost Calculator',
    focus: 'acquisition efficiency and payback speed',
    concept: 'customer acquisition cost',
    researchFocus: 'CAC, payback months, gross-margin recovery, and the relationship between acquisition efficiency and lifetime value',
    aboutParagraphs: [
      'This calculator is designed for growth teams that need more than a spend-divided-by-customers answer. It connects CAC to payback and lifetime value so acquisition quality is easier to judge.',
      'The advanced version keeps total acquisition spend, CAC, gross-margin payback, CLV estimate, and LTV:CAC ratio together because growth efficiency depends on all of them, not only on cost per new customer.',
      'That makes the page more useful for SaaS, subscription, and recurring-revenue teams where acquisition efficiency and retention are tightly connected.',
    ],
    stepTips: [
      'Enter sales, marketing, and onboarding costs from the same acquisition window you are evaluating.',
      'Use the matching count of newly acquired customers for that same period so CAC is not distorted.',
      'Add ARPA, gross margin, and churn if you want payback and lifetime-value context instead of a basic CAC-only read.',
      'Read the popup results as a growth-efficiency screen, not just a cost accounting figure.',
    ],
    dashboardTips: [
      'CAC as the headline acquisition-cost result.',
      'Total acquisition spend so the scale of the spending window is visible.',
      'Gross-margin payback months for recovery timing.',
      'Estimated CLV and LTV:CAC ratio for broader commercial health.',
    ],
    features: [
      'CAC and total acquisition spend together',
      'Gross-margin payback months',
      'Estimated CLV and LTV:CAC ratio',
      'Churn-sensitive growth interpretation',
      'Warnings when acquisition efficiency is thin',
      'Same approved advanced structure used across the newer site tools',
    ],
    decisionCards: [
      card('If CAC is high but payback is still acceptable', 'The business may support premium acquisition if retention and margin are strong enough.'),
      card('If CAC is moderate but LTV:CAC is weak', 'Retention or gross margin may be the real bottleneck.'),
      card('If payback is long', 'Growth may still be possible, but it can create heavier cash pressure.'),
      card('If CAC drops suddenly', 'Validate whether acquisition quality also changed before assuming efficiency truly improved.'),
    ],
    quickRows: [
      row('CAC', '(Marketing + Sales + Onboarding Spend) / New Customers', 'Measures average acquisition cost per new customer.'),
      row('Payback period', 'CAC / Gross Profit per Customer per Month', 'Shows how long it takes to recover acquisition cost.'),
      row('CLV estimate', 'Monthly Gross Profit x Customer Lifespan', 'Adds retention and margin context to CAC.'),
      row('LTV:CAC ratio', 'CLV / CAC', 'Common efficiency screen for recurring-revenue businesses.'),
    ],
    references: [REF.hubspotAcquisition, REF.hubspotLtvCac, REF.cfiCacPayback],
    understanding: [
      card('Why CAC alone is incomplete', 'A business can tolerate higher CAC if margin, retention, and payback are still healthy.'),
      card('Payback matters for cash', 'Long payback periods can make otherwise attractive growth difficult to finance.'),
      card('LTV:CAC is a relationship metric', 'It helps frame whether acquisition spending is being supported by customer value over time.'),
      card('Use consistent time windows', 'CAC breaks quickly when spend and customer counts come from mismatched periods.'),
    ],
    faqs: [
      faq('What is CAC?', 'Customer acquisition cost is the average amount spent to acquire one new customer during a defined period or campaign.', 'Basics'),
      faq('Why does this calculator show payback months too?', 'Because acquisition cost becomes much more useful once you know how quickly the business earns it back through gross profit.', 'Method'),
      faq('What is a common LTV:CAC benchmark?', 'Many teams use roughly 3x as a starting reference point, but acceptable ratios vary by business model and stage.', 'Benchmarks'),
    ],
  }),
  'customer-lifetime-value': cfg({
    title: 'Customer Lifetime Value Calculator',
    subtitle: 'Estimate CLV, customer lifespan, gross profit per customer, and LTV:CAC ratio',
    cta: 'Calculate CLV',
    reviewName: 'Customer Lifetime Value Calculator',
    focus: 'retention-driven customer economics',
    concept: 'customer lifetime value',
    researchFocus: 'customer lifespan, gross-profit contribution, churn sensitivity, and the relationship between CLV and acquisition spending',
    aboutParagraphs: [
      'Customer lifetime value matters because acquisition efficiency is only half the story. The longer and more profitably a customer stays, the more room the business has to grow well.',
      'This calculator estimates CLV using average revenue per account, gross margin, and churn assumptions, then connects that value back to CAC when acquisition inputs are available.',
      'That makes the result useful for subscription, SaaS, membership, and service businesses where retention and contribution margin are central to the operating model.',
    ],
    stepTips: [
      'Enter ARPA and gross margin first so the calculator can estimate monthly gross profit per customer.',
      'Use a realistic monthly churn rate because CLV is highly sensitive to retention assumptions.',
      'Add sales, marketing, onboarding spend, and new customers if you want the LTV:CAC comparison too.',
      'Treat the result as a planning estimate rather than a perfect forecast, especially if retention patterns vary across cohorts.',
    ],
    dashboardTips: [
      'Customer lifetime value as the headline result.',
      'Average customer lifespan based on churn.',
      'Gross profit per customer per month for contribution clarity.',
      'Customer acquisition cost and LTV:CAC ratio when acquisition inputs are provided.',
    ],
    features: [
      'CLV estimate from ARPA, margin, and churn',
      'Customer lifespan calculation',
      'Gross-profit contribution per customer',
      'LTV:CAC ratio when CAC inputs are present',
      'Churn-aware warnings and interpretation',
      'Same long-form advanced structure used for the newest calculators',
    ],
    decisionCards: [
      card('If CLV is high but payback still feels slow', 'The business may be profitable over the long run but still cash-hungry in the short run.'),
      card('If CLV changes sharply with small churn changes', 'Retention is likely the highest-value growth lever available.'),
      card('If LTV:CAC is weak', 'The business may need stronger retention, higher margin, or lower acquisition cost.'),
      card('If CLV looks very high', 'Validate whether churn and gross-margin assumptions are realistic and cohort-consistent.'),
    ],
    quickRows: [
      row('Monthly gross profit', 'ARPA x Gross Margin', 'Converts revenue into contribution rather than topline only.'),
      row('Customer lifespan', '1 / Churn Rate', 'A simplified retention-based estimate of how long customers stay.'),
      row('CLV', 'Monthly Gross Profit x Customer Lifespan', 'Estimates total contribution over the relationship.'),
      row('LTV:CAC', 'CLV / CAC', 'Pairs customer value with acquisition cost discipline.'),
    ],
    references: [REF.hubspotLtvCac, REF.hubspotAcquisition, REF.cfiCacPayback],
    understanding: [
      card('Why gross margin belongs in CLV', 'Revenue is not the same as value retained by the business. Gross margin makes the estimate more realistic.'),
      card('Retention is often the biggest lever', 'Small churn improvements can extend customer lifespan and expand value dramatically.'),
      card('CLV is cohort-sensitive', 'Different customer segments often have very different churn, ARPA, and gross margin behavior.'),
      card('Use CLV with CAC', 'Customer value is most strategic when it is paired with what it costs to acquire that value in the first place.'),
    ],
    faqs: [
      faq('What is customer lifetime value?', 'Customer lifetime value estimates how much gross-profit contribution a customer generates over the full relationship.', 'Basics'),
      faq('Why is churn used in the formula?', 'Because churn is a practical way to estimate how long customers remain active in a recurring-revenue model.', 'Method'),
      faq('Can CLV be too optimistic?', 'Yes. If churn, ARPA, or gross-margin assumptions are unrealistic, CLV can quickly become overstated.', 'Risk'),
    ],
  }),
  'business-valuation': cfg({
    title: 'Business Valuation Calculator',
    subtitle: 'Screen a business with revenue, EBITDA, and SDE multiple methods plus implied equity value',
    cta: 'Calculate Business Value',
    reviewName: 'Business Valuation Calculator',
    focus: 'multi-method business-value screening',
    concept: 'business valuation',
    researchFocus: 'revenue multiples, EBITDA multiples, SDE multiples, enterprise value, and the difference between enterprise and equity value',
    aboutParagraphs: [
      'This calculator is built as a screening tool for business value, not as a replacement for a full valuation model, quality-of-earnings review, or transaction process.',
      'The advanced version compares revenue-multiple, EBITDA-multiple, and SDE-multiple approaches, then shows a blended enterprise value and implied equity value after debt and cash adjustments.',
      'That matters because valuation is rarely a one-number exercise. Different methods highlight different strengths, and the gap between enterprise value and equity value is often where deal expectations get reshaped.',
    ],
    stepTips: [
      'Enter annual revenue, EBITDA, and SDE only where those figures are meaningful for the business you are screening.',
      'Use market-consistent multiples that match company size, industry, growth, margin profile, and risk level.',
      'Add debt and excess cash so the calculator can move from enterprise-value thinking into implied equity value.',
      'Treat the blended result as a directional screen and not as a substitute for comps, diligence, or a full DCF model.',
    ],
    dashboardTips: [
      'Blended enterprise value as the headline screen.',
      'Revenue, EBITDA, and SDE valuation methods shown separately.',
      'Implied equity value after debt and cash adjustments.',
      'Warnings when the valuation relies on too few methods to be robust.',
    ],
    features: [
      'Revenue-multiple, EBITDA-multiple, and SDE-multiple views',
      'Blended enterprise value output',
      'Implied equity value after cash and debt',
      'Support for smaller owner-operated businesses and more formal EBITDA reads',
      'Interpretation of method differences rather than a single opaque number',
      'Original advanced content and verified resources section',
    ],
    decisionCards: [
      card('If revenue value is high but EBITDA value is weaker', 'Growth may be strong, but profitability quality may not yet support richer earnings-based valuation.'),
      card('If SDE value is much stronger than EBITDA value', 'Owner-operated businesses may still be attractive even if formal EBITDA is modest.'),
      card('If debt meaningfully reduces equity value', 'Headline enterprise value may overstate what an owner would actually keep.'),
      card('If the methods diverge widely', 'The business may need deeper comps work, normalization, and quality-of-earnings review.'),
    ],
    quickRows: [
      row('Revenue method', 'Annual Revenue x Revenue Multiple', 'Often used for smaller or high-growth businesses where margin is still evolving.'),
      row('EBITDA method', 'Annual EBITDA x EBITDA Multiple', 'Common in middle-market and more institutional valuation work.'),
      row('SDE method', 'Annual SDE x SDE Multiple', 'Useful for smaller owner-operated businesses.'),
      row('Equity value', 'Enterprise Value - Debt + Cash', 'Translates enterprise value into owner value after capital-structure adjustments.'),
    ],
    references: [REF.cfiValuationMethods, REF.cfiEbitdaMultiple, REF.cfiWorkingCapital],
    understanding: [
      card('Why multiple methods are useful', 'Different businesses are better explained by different valuation lenses, especially across size, growth, and owner-dependence differences.'),
      card('Enterprise value is not equity value', 'Debt and cash adjustments matter because the value of the operating business is not the same as the value left for equity holders.'),
      card('Revenue multiples are not margin-blind by accident', 'They are often used when margin is unstable, but they should still be interpreted with caution.'),
      card('Use screening tools honestly', 'A calculator like this is strong for first-pass framing. Serious transactions still need comps, diligence, normalization, and negotiation context.'),
    ],
    faqs: [
      faq('What is the difference between enterprise value and equity value?', 'Enterprise value reflects the value of the operating business. Equity value adjusts that amount for debt and cash to estimate what belongs to owners.', 'Basics'),
      faq('Why show multiple valuation methods?', 'Because one method rarely tells the full story. Revenue, EBITDA, and SDE approaches often emphasize different aspects of the same business.', 'Method'),
      faq('Can this replace a formal valuation?', 'No. It is a screening tool for fast scenario work, not a full transaction-grade valuation process.', 'Use Cases'),
    ],
  }),
};
