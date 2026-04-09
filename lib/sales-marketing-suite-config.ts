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

export type SalesMarketingVariant =
  | 'sales-commission'
  | 'sales-tax'
  | 'discount'
  | 'price-increase'
  | 'conversion-rate'
  | 'lead-generation-roi'
  | 'marketing-roi'
  | 'email-marketing-roi'
  | 'cost-per-click'
  | 'cost-per-acquisition'
  | 'click-through-rate'
  | 'engagement-rate'
  | 'ab-test'
  | 'sample-size'
  | 'market-share';

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
  hubspotSalesComp: {
    label: 'HubSpot: Sales Compensation Plans',
    url: 'https://blog.hubspot.com/sales/sales-compensation',
  },
  shopifyTax: {
    label: 'Shopify Tax',
    url: 'https://www.shopify.com/tax',
  },
  shopifyTaxReports: {
    label: 'Shopify Tax Reporting Guide',
    url: 'https://www.shopify.com/blog/shopify-tax-reports',
  },
  shopifyDiscounts: {
    label: 'Shopify Discounts',
    url: 'https://www.shopify.com/discounts',
  },
  shopifyCouponStrategy: {
    label: 'Shopify Coupon Marketing Strategy',
    url: 'https://www.shopify.com/blog/coupon-marketing-strategy',
  },
  shopifyPricing: {
    label: 'Shopify Pricing Strategies Guide',
    url: 'https://www.shopify.com/blog/pricing-strategies',
  },
  shopifySplitTestingPricing: {
    label: 'Shopify Split Testing for Pricing',
    url: 'https://www.shopify.com/blog/split-testing-pricing',
  },
  hubspotMarketingRoi: {
    label: 'HubSpot: Marketing ROI Formula and Examples',
    url: 'https://blog.hubspot.com/marketing/measure-content-marketing-roi',
  },
  hubspotPerformanceMetrics: {
    label: 'HubSpot: Performance Metrics and ROMI',
    url: 'https://blog.hubspot.com/marketing/optimizing-performance-metrics',
  },
  mailchimpEmailRoiCalculator: {
    label: 'Mailchimp Email Marketing ROI Calculator',
    url: 'https://mailchimp.com/resources/email-marketing-roi-calculator/',
  },
  mailchimpEmailMetrics: {
    label: 'Mailchimp Email Marketing Success Metrics',
    url: 'https://mailchimp.com/resources/how-to-measure-your-email-marketing-success/',
  },
  googleAdsAvgCpc: {
    label: 'Google Ads Help: Average CPC',
    url: 'https://support.google.com/google-ads/answer/14074',
  },
  wordstreamBenchmarks: {
    label: 'WordStream PPC Benchmarks',
    url: 'https://www.wordstream.com/ppc-benchmarks',
  },
  wordstreamConversionRate: {
    label: 'WordStream Conversion Rate Guide',
    url: 'https://www.wordstream.com/blog/ws/2014/03/17/what-is-a-good-conversion-rate',
  },
  hootsuiteEngagementRate: {
    label: 'Hootsuite Engagement Rate Formulas',
    url: 'https://blog.hootsuite.com/calculate-engagement-rate/',
  },
  optimizelyAbTesting: {
    label: 'Optimizely A/B Testing Guide',
    url: 'https://www.optimizely.com/optimization-glossary/ab-testing/',
  },
  optimizelySampleSize: {
    label: 'Optimizely Sample Size Calculator',
    url: 'https://www.optimizely.com/sample-size-calculator/',
  },
  surveyMonkeySampleSize: {
    label: 'SurveyMonkey Sample Size Guide',
    url: 'https://www.surveymonkey.com/learn/survey-best-practices/sample-size/',
  },
  similarwebMarketShare: {
    label: 'Similarweb Market Share Guide',
    url: 'https://www.similarweb.com/blog/research/market-research/what-is-market-share/',
  },
  shopifyBrandTracking: {
    label: 'Shopify Brand Tracking and Market Share',
    url: 'https://www.shopify.com/ph/blog/brand-tracking',
  },
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Decision-ready outputs', `The result set is built around ${focus}, not just a single marketing ratio or rate.`),
  card('Popup-only results', 'The calculator keeps the approved advanced popup dashboard instead of collapsing into a thin inline answer block.'),
  card('Commercial context', 'Primary outputs, supporting ratios, and watchouts stay together so pricing, media, or campaign decisions are easier to interpret.'),
  card('Live feature research', 'Inputs and outputs were chosen after reviewing public live calculators, marketing guides, and reference tools online.'),
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
  understanding: CardItem[];
  faqs: FAQItem[];
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
    `A thin ${seed.title.toLowerCase()} often stops at one formula, but real sales and marketing decisions usually depend on what surrounds that result: volume, efficiency, cost quality, conversion quality, or target gap.`,
    `This advanced version keeps those linked signals visible so ${seed.concept} is easier to evaluate in the same way operators, analysts, and growth teams actually review performance.`,
  ],
  stepTips: seed.stepTips,
  dashboardTips: seed.dashboardTips,
  features: seed.features,
  decisionCards: seed.decisionCards,
  quickRows: seed.quickRows,
  references: seed.references,
  understanding: seed.understanding,
  faqs: seed.faqs,
  whyUse: baseWhyUse(seed.focus),
});

export const SALES_MARKETING_CONFIG: Record<SalesMarketingVariant, VariantConfig> = {
  'sales-commission': cfg({
    title: 'Sales Commission Calculator',
    subtitle: 'Estimate base commission, accelerator payout, quota attainment, and blended commission rate in one run',
    focus: 'sales payout quality and quota-linked earning structure',
    concept: 'sales commission planning',
    researchFocus: 'quota attainment, commission tiers, accelerator logic, and blended payout rate',
    intro: 'This calculator is built for sales teams, managers, and operators who need to turn booked revenue into a commission payout while still keeping the structure of the plan visible.',
    stepTips: [
      'Enter total sales booked first so the payout run has a real revenue base.',
      'Add the base commission rate and quota amount separately instead of assuming one flat payout rate applies to the entire deal volume.',
      'Use the accelerator rate if your plan pays a higher commission above quota.',
      'Add any flat commission bonus only after the rate logic is clear so the dashboard can separate plan design from pure sales volume.',
    ],
    dashboardTips: [
      'Total commission as the headline output.',
      'Quota attainment so the payout can be read against performance, not just dollars.',
      'Base and accelerator commission broken apart.',
      'Blended commission rate for a cleaner profitability read.',
    ],
    features: [
      'Base-rate and above-quota accelerator payouts in one run',
      'Quota attainment and blended commission context',
      'Bonus support without hiding plan mechanics',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original long-form content built for compensation and sales-ops decisions',
      'Feature mix informed by live commission-planning resources online',
    ],
    decisionCards: [
      card('If total commission feels high', 'Check whether the result is coming from strong attainment, aggressive accelerators, or a large flat bonus instead of assuming the plan itself is broken.'),
      card('If attainment is low but commission still looks large', 'Bonus structure or rate design may be doing more work than quota performance.'),
      card('If the blended commission rate rises sharply after quota', 'The plan may strongly reward stretch performance, which can be useful or costly depending on margin structure.'),
      card('If payout volatility feels uncomfortable', 'Tier thresholds, bonus timing, or quota design may deserve a closer review before changing the base rate alone.'),
    ],
    quickRows: [
      row('Base commission', 'Base-eligible Sales x Base Rate', 'Shows payout earned before accelerator tiers are triggered.'),
      row('Accelerator commission', 'Above-quota Sales x Accelerator Rate', 'Measures the extra payout tied to over-quota performance.'),
      row('Quota attainment', 'Sales Booked / Quota', 'Shows how far the rep or team progressed toward plan.'),
      row('Blended commission rate', 'Total Commission / Sales Booked', 'Useful for comparing payout economics across plans or periods.'),
    ],
    references: [REF.hubspotSalesComp, REF.hubspotPerformanceMetrics],
    understanding: [
      card('Commission plans are structure problems as much as math problems', 'The same revenue total can create very different payouts depending on thresholds, accelerators, and bonus design.'),
      card('Quota attainment adds crucial context', 'A commission number without attainment can hide whether the payout came from exceptional production or a generous plan curve.'),
      card('Blended rate matters for profitability', 'Looking only at the payout total can miss what the compensation really represented as a share of booked revenue.'),
      card('Commission should be judged against margin and strategy', 'A plan can be motivational and still become expensive if it is not aligned to contribution economics.'),
    ],
    faqs: [
      faq('How do you calculate sales commission?', 'A common structure applies a commission rate to eligible sales and may add accelerators or bonuses when quota thresholds are reached.', 'Basics'),
      faq('What is a blended commission rate?', 'It shows total commission as a percentage of total sales booked, making it easier to compare payout efficiency across different runs.', 'Method'),
      faq('Why separate base and accelerator commission?', 'Because it makes the impact of over-quota performance visible instead of hiding it inside one payout total.', 'Interpretation'),
    ],
  }),
  'sales-tax': cfg({
    title: 'Sales Tax Calculator',
    subtitle: 'Estimate taxable subtotal, tax amount, discount-adjusted order total, and effective tax rate in one run',
    focus: 'taxable order value and final checkout cost',
    concept: 'sales tax estimation',
    researchFocus: 'taxable subtotal, discount handling, tax amount, and total order cost',
    intro: 'This calculator is designed for merchants, shoppers, and operators who need a fast estimate of total order cost after discounts, coupon reductions, tax, and shipping are all considered together.',
    stepTips: [
      'Start with the merchandise subtotal before tax so the order economics are clear.',
      'Add any percentage discount and flat coupon separately because those often affect the taxable base differently in planning conversations.',
      'Enter the sales tax rate as a local estimate, not a legal filing answer.',
      'Use shipping only if you want the final checkout figure rather than the tax-only result.',
    ],
    dashboardTips: [
      'Final order total as the lead output.',
      'Taxable subtotal after discounts are applied.',
      'Sales tax amount kept separate from fees.',
      'Effective tax rate for a reasonableness check.',
    ],
    features: [
      'Discount-aware taxable subtotal and tax amount in one run',
      'Shipping layered separately from tax math',
      'Effective tax rate visibility',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on checkout planning and tax visibility',
      'Reference set informed by live sales-tax and commerce resources',
    ],
    decisionCards: [
      card('If the final total is higher than expected', 'Check whether shipping and discount assumptions, not just the tax rate, are driving the difference.'),
      card('If taxable subtotal falls sharply after discounting', 'The promotion may be moving the order more than the tax itself.'),
      card('If tax appears unusually high', 'Confirm the entered rate and whether your planning scenario should include taxes on the discounted subtotal only.'),
      card('If you are using this for filing decisions', 'Treat the result as a planning estimate and verify jurisdiction-specific rules separately.'),
    ],
    quickRows: [
      row('Taxable subtotal', 'Subtotal - Percentage Discount - Coupon', 'Defines the base that tax is applied to in this planning model.'),
      row('Sales tax amount', 'Taxable Subtotal x Tax Rate', 'Shows the tax portion of the order separately from product and shipping value.'),
      row('Order total', 'Taxable Subtotal + Tax + Shipping', 'Builds the full checkout estimate.'),
      row('Effective tax rate', 'Tax Amount / Taxable Subtotal', 'Useful for checking whether the entered assumptions look reasonable.'),
    ],
    references: [REF.shopifyTax, REF.shopifyTaxReports],
    understanding: [
      card('Sales tax starts with the taxable base', 'A tax estimate is only as useful as the subtotal it is applied to, especially once promotions are involved.'),
      card('Discounts change the order picture', 'A shopper often experiences tax through the discounted basket, not through the original list price.'),
      card('Shipping is a separate checkout layer', 'Even when the tax amount is moderate, shipping can materially change the final out-of-pocket total.'),
      card('Planning estimates are not filing instructions', 'Actual tax treatment can vary by location, product type, and administrative setup.'),
    ],
    faqs: [
      faq('How do you calculate sales tax on an order?', 'A common planning approach multiplies the taxable subtotal by the tax rate, then adds any shipping or other order-level fees.', 'Basics'),
      faq('Should discounts be applied before tax?', 'Many planning models do, but actual treatment can vary by jurisdiction and setup, so this tool should be treated as an estimate.', 'Method'),
      faq('Why show effective tax rate?', 'It helps confirm that the tax result is sensible relative to the adjusted order value.', 'Interpretation'),
    ],
  }),
  discount: cfg({
    title: 'Discount Calculator',
    subtitle: 'Estimate discounted subtotal, total savings, tax on the discounted amount, and final customer price in one run',
    focus: 'promotion-adjusted price and savings visibility',
    concept: 'discount pricing',
    researchFocus: 'headline discount, coupon stacking, final price, and effective savings rate',
    intro: 'This calculator is built for merchants and shoppers who want to know what a discount really does to the checkout price after percentage markdowns, coupon value, and tax are considered together.',
    stepTips: [
      'Enter the original selling price first so the baseline stays visible.',
      'Add the percentage discount and flat coupon separately if your offer includes both.',
      'Use the tax rate only if you want a full customer-paid estimate rather than a pre-tax promotional price.',
      'Read the popup as a promotion impact dashboard, not just a markdown answer.',
    ],
    dashboardTips: [
      'Final price after discount as the lead output.',
      'Discounted subtotal before tax.',
      'Total savings in currency terms.',
      'Effective discount rate after stacked offers.',
    ],
    features: [
      'Percentage and flat discount support in one run',
      'Tax-aware final price estimate',
      'Effective discount visibility beyond the headline markdown',
      'Popup-only advanced results matched to the approved page structure',
      'Original content focused on promotion design and customer price clarity',
      'Feature mix informed by live retail discount and pricing guides',
    ],
    decisionCards: [
      card('If savings look smaller than expected', 'Tax and coupon structure may be creating a smaller real-world discount than the headline percentage implies.'),
      card('If the final price is still above the buyer target', 'The promotion may need a different structure, threshold, or basket strategy rather than a larger flat markdown alone.'),
      card('If effective discount is much higher than planned', 'Stacked offers may be pulling more value out of the order than the promotion team intended.'),
      card('If the promotion looks attractive but margin risk rises', 'Discount planning should be reviewed alongside markup, contribution, and inventory goals.'),
    ],
    quickRows: [
      row('Percentage discount', 'Original Price x Discount %', 'Shows the savings created by the headline markdown alone.'),
      row('Discounted subtotal', 'Original Price - Percentage Discount - Coupon', 'Shows the adjusted product price before tax.'),
      row('Total savings', 'Original Price - Discounted Subtotal', 'Captures the combined value of both discount layers.'),
      row('Effective discount', 'Total Savings / Original Price', 'Shows the real discount rate after all savings are combined.'),
    ],
    references: [REF.shopifyDiscounts, REF.shopifyCouponStrategy, REF.shopifyPricing],
    understanding: [
      card('Headline discount and real discount are not always identical', 'Coupons, stacked offers, and tax assumptions can change what the customer actually experiences.'),
      card('Currency savings often matter more than the percentage alone', 'A large-looking rate can still create a modest absolute reduction on a small-ticket item.'),
      card('Promotion design affects order economics', 'The same budget can behave differently when structured as a percent off, a dollar-off coupon, or a threshold-based offer.'),
      card('Discounting should be interpreted alongside pricing strategy', 'A good discount answer is more useful when it sits inside a broader margin and demand conversation.'),
    ],
    faqs: [
      faq('How do you calculate a discount price?', 'A common approach subtracts the percentage discount and any flat coupon from the original price, then adds tax if you want a final checkout estimate.', 'Basics'),
      faq('What is an effective discount rate?', 'It is the total savings divided by the original price, showing what the full promotion actually delivered.', 'Method'),
      faq('Why include tax in a discount calculator?', 'Because customers and merchants often care about the final price paid, not just the pre-tax markdown.', 'Use Cases'),
    ],
  }),
  'price-increase': cfg({
    title: 'Price Increase Calculator',
    subtitle: 'Compare old revenue, projected revenue, revenue change, and break-even unit volume after a pricing move',
    focus: 'revenue impact of a pricing change after volume response',
    concept: 'price increase planning',
    researchFocus: 'price lift, unit response, revenue change, and break-even volume after repricing',
    intro: 'This calculator is built for operators and marketers who need to test whether a higher price still improves revenue once expected unit decline is taken into account.',
    stepTips: [
      'Enter the current price and unit volume so the baseline revenue is explicit.',
      'Add the proposed new price and the expected post-change unit volume rather than assuming demand stays flat.',
      'Use the popup to compare current revenue, projected revenue, and break-even volume together.',
      'If demand sensitivity is uncertain, rerun multiple cases instead of relying on a single expected-units assumption.',
    ],
    dashboardTips: [
      'Revenue change as the headline output.',
      'Price increase percentage alongside current and projected revenue.',
      'Break-even unit volume at the new price.',
      'A cleaner read on how much demand can fall before revenue is back to baseline.',
    ],
    features: [
      'Current versus projected revenue in one run',
      'Price-lift and break-even volume context',
      'Useful for scenario planning before repricing launches',
      'Popup-only advanced dashboard matching the approved structure',
      'Original content focused on pricing decisions, not just arithmetic',
      'Feature set shaped by live pricing-strategy resources online',
    ],
    decisionCards: [
      card('If projected revenue rises even with fewer units', 'The pricing move may be viable, but margin, retention, and brand effects still deserve a separate review.'),
      card('If break-even units are very close to expected units', 'The plan may be fragile and vulnerable to even a modest demand miss.'),
      card('If the revenue change is negative', 'The proposed price increase may be too large for the expected demand response.'),
      card('If the price increase looks good on revenue only', 'Consider testing contribution, conversion, and retention before rolling it out widely.'),
    ],
    quickRows: [
      row('Current revenue', 'Current Price x Current Units', 'Shows the baseline commercial result before repricing.'),
      row('Projected revenue', 'New Price x Expected Units', 'Shows the modeled post-change revenue outcome.'),
      row('Revenue change', 'Projected Revenue - Current Revenue', 'Measures the direct revenue impact of the pricing scenario.'),
      row('Break-even units', 'Current Revenue / New Price', 'Shows how many units are needed at the new price to match old revenue.'),
    ],
    references: [REF.shopifyPricing, REF.shopifySplitTestingPricing],
    understanding: [
      card('Price increases are demand-response decisions', 'The commercial effect depends on how buyers respond, not only on the higher unit price.'),
      card('Break-even volume is a useful planning threshold', 'It shows how much unit decline the business can absorb before revenue falls back to baseline.'),
      card('Revenue is only one part of the story', 'Higher price can improve or damage customer quality, lifetime value, and brand perception depending on context.'),
      card('Scenario testing is usually smarter than certainty', 'Pricing decisions are often more reliable when they are evaluated across multiple demand cases.'),
    ],
    faqs: [
      faq('How do you calculate the impact of a price increase?', 'A common approach compares old revenue with projected revenue at the new price after estimating how unit volume may change.', 'Basics'),
      faq('What is break-even unit volume?', 'It is the number of units you must sell at the new price to match the old revenue level.', 'Method'),
      faq('Does a price increase always improve revenue?', 'No. If volume falls enough, revenue can flatten or decline even when the unit price is higher.', 'Interpretation'),
    ],
  }),
  'conversion-rate': cfg({
    title: 'Conversion Rate Calculator',
    subtitle: 'Estimate conversion rate, conversions per 1,000 visitors, revenue per visitor, and value per conversion in one run',
    focus: 'visitor-to-conversion efficiency and economic value per visit',
    concept: 'conversion rate analysis',
    researchFocus: 'visitor volume, conversions, revenue per visitor, and value per conversion',
    intro: 'This calculator is built for marketers and growth teams who need to understand how efficiently traffic turns into actions and what those conversions are worth economically.',
    stepTips: [
      'Enter visitor volume and conversions first so the base rate is grounded in real traffic.',
      'Add revenue if you want the dashboard to translate the rate into commercial value instead of leaving it as a percentage only.',
      'Use the popup to compare conversion rate with revenue per visitor and value per conversion together.',
      'Rerun by campaign, landing page, or channel if you want cleaner operational insight than a blended sitewide average.',
    ],
    dashboardTips: [
      'Conversion rate as the headline output.',
      'Conversions per 1,000 visitors for traffic-normalized planning.',
      'Revenue per visitor for media-efficiency discussions.',
      'Value per conversion to connect rate to economics.',
    ],
    features: [
      'Conversion percentage and commercial value in one run',
      'Traffic-normalized and revenue-normalized supporting metrics',
      'Useful for funnel reviews, media buying, and landing-page analysis',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on interpretation, not only formula output',
      'Feature coverage informed by live conversion and PPC references',
    ],
    decisionCards: [
      card('If conversion rate is modest but revenue per visitor is strong', 'The funnel may still be healthy because each conversion carries high economic value.'),
      card('If conversion rate is high but revenue per visitor is weak', 'Offer mix or average order value may deserve as much attention as the landing page.'),
      card('If conversions per 1,000 visitors drop suddenly', 'Traffic quality, intent, or post-click experience may have changed.'),
      card('If value per conversion varies sharply by channel', 'Budget decisions should consider both conversion efficiency and conversion quality.'),
    ],
    quickRows: [
      row('Conversion rate', 'Conversions / Visitors', 'Measures the share of traffic that completed the desired action.'),
      row('Conversions per 1,000 visitors', '(Conversions / Visitors) x 1,000', 'Makes traffic performance easier to compare across scaled volumes.'),
      row('Revenue per visitor', 'Revenue / Visitors', 'Shows what each visit was worth on average.'),
      row('Value per conversion', 'Revenue / Conversions', 'Shows the average economic value of each converted action.'),
    ],
    references: [REF.wordstreamConversionRate, REF.wordstreamBenchmarks, REF.hubspotPerformanceMetrics],
    understanding: [
      card('Conversion rate is a funnel metric, not a whole-business metric', 'It tells you how efficiently traffic converts, but not by itself whether those conversions are profitable or high quality.'),
      card('Traffic quality matters as much as page quality', 'A lower-intent audience can depress conversion rate even if the page experience remains unchanged.'),
      card('Revenue per visitor adds commercial meaning', 'That metric helps a team judge whether the traffic is valuable enough even before the final sale count is reviewed.'),
      card('Best interpretation usually comes from segmentation', 'Channel, device, campaign, and landing-page splits often explain more than a blended average.'),
    ],
    faqs: [
      faq('How do you calculate conversion rate?', 'A standard formula divides total conversions by total visitors and multiplies by 100 for a percentage.', 'Basics'),
      faq('Why include revenue per visitor?', 'It helps connect conversion efficiency to actual commercial value instead of leaving the result as a standalone rate.', 'Method'),
      faq('What counts as a conversion?', 'That depends on the goal: it could be a sale, form submission, booking, signup, or another measurable completed action.', 'Use Cases'),
    ],
  }),
  'lead-generation-roi': cfg({
    title: 'Lead Generation ROI Calculator',
    subtitle: 'Estimate cost per lead, estimated customers, revenue, gross profit, and ROI from a lead funnel in one run',
    focus: 'top-of-funnel spend translated into closed-customer value',
    concept: 'lead generation ROI',
    researchFocus: 'lead volume, lead-to-customer rate, deal value, gross profit, and spend efficiency',
    intro: 'This calculator is designed for teams that want to know whether lead generation is creating value after lead quality and close rate are considered, not just whether the campaign produced volume.',
    stepTips: [
      'Enter total leads and marketing spend first so the top-of-funnel economics are visible.',
      'Add lead-to-customer conversion rate and average deal value instead of treating every lead as equal value.',
      'Use gross margin percent if you want the ROI view to reflect contribution rather than raw revenue only.',
      'Review the popup as a lead-quality dashboard as much as a spend-efficiency dashboard.',
    ],
    dashboardTips: [
      'Lead generation ROI as the headline metric.',
      'Cost per lead for acquisition-efficiency comparisons.',
      'Estimated customers from the lead pool.',
      'Estimated revenue and gross profit from the modeled close rate.',
    ],
    features: [
      'Cost per lead, modeled customers, and ROI in one run',
      'Gross-profit framing instead of revenue-only hype',
      'Useful for campaign reviews and channel comparisons',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on lead quality and spend quality together',
      'Feature set informed by live marketing-ROI and performance guides',
    ],
    decisionCards: [
      card('If lead count looks good but ROI is weak', 'Lead quality or close rate may be the real issue rather than top-of-funnel volume.'),
      card('If cost per lead is high but ROI is still attractive', 'The channel may be expensive upfront but valuable because the downstream customer quality is stronger.'),
      card('If estimated customers are low', 'Targeting, lead qualification, or handoff quality may deserve more attention than budget size alone.'),
      card('If revenue looks strong but gross-profit ROI does not', 'Margin structure may be too thin for the campaign to be truly efficient.'),
    ],
    quickRows: [
      row('Cost per lead', 'Marketing Spend / Leads', 'Measures the average cost of generating one lead.'),
      row('Estimated customers', 'Leads x Lead-to-customer Rate', 'Translates top-of-funnel volume into likely customer count.'),
      row('Estimated gross profit', 'Estimated Revenue x Gross Margin %', 'Creates a more useful base for ROI than revenue alone.'),
      row('Lead gen ROI', '(Gross Profit - Spend) / Spend', 'Measures return relative to the campaign investment.'),
    ],
    references: [REF.hubspotMarketingRoi, REF.hubspotPerformanceMetrics],
    understanding: [
      card('Lead generation ROI depends on lead quality', 'A campaign can create many leads and still perform poorly if too few of them ever become paying customers.'),
      card('Revenue is not the same as return', 'Gross-profit framing usually produces a more realistic decision lens than topline revenue alone.'),
      card('Cost per lead is only part of the story', 'Low CPL can still underperform if the channel sends weak-fit leads into sales.'),
      card('The strongest use is comparative', 'This kind of result is especially useful when comparing channels, campaigns, or audience segments using the same model.'),
    ],
    faqs: [
      faq('How do you calculate lead generation ROI?', 'A practical approach estimates customers and value from the lead pool, then compares gross profit or revenue with campaign cost.', 'Basics'),
      faq('Why use lead-to-customer rate?', 'Because lead volume alone is not a reliable measure of campaign quality if close rates differ across channels.', 'Method'),
      faq('Should ROI be based on revenue or profit?', 'Profit is usually more decision-useful because it reflects how much value is actually left after cost of delivery.', 'Interpretation'),
    ],
  }),
  'marketing-roi': cfg({
    title: 'Marketing ROI Calculator',
    subtitle: 'Estimate ROI, ROAS, gross profit, cost per lead, and cost per acquisition from one campaign run',
    focus: 'campaign profitability and spend efficiency',
    concept: 'marketing ROI',
    researchFocus: 'spend, revenue, gross margin, lead cost, acquisition cost, and return quality',
    intro: 'This calculator is built for marketers who need to compare spend with commercial outcome while keeping both revenue efficiency and profit efficiency visible in the same result.',
    stepTips: [
      'Enter marketing spend and campaign-attributed revenue first so the base financial picture is clear.',
      'Add gross margin percent if you want the result to go beyond revenue-only ROAS.',
      'Use leads and acquisitions if you want cost-per-lead and cost-per-acquisition context in the same run.',
      'Read the popup as a return-quality screen, not just a headline ROI number.',
    ],
    dashboardTips: [
      'Marketing ROI as the lead output.',
      'ROAS shown separately from ROI.',
      'Gross profit used as the return base.',
      'CPL and CAC kept visible for funnel context.',
    ],
    features: [
      'ROI and ROAS in one run instead of treating them as the same metric',
      'Gross-profit framing for better decision quality',
      'Lead and acquisition cost context for funnel diagnostics',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content designed for budget reviews and optimization work',
      'Feature pattern informed by live marketing ROI guidance',
    ],
    decisionCards: [
      card('If ROAS looks healthy but ROI is weak', 'The campaign may be generating revenue without leaving enough margin after spend.'),
      card('If CAC is rising faster than CPL', 'The issue may be lower lead quality or weaker conversion through the lower funnel.'),
      card('If ROI is positive but slim', 'The campaign may still be viable, but there may be little room for creative fatigue, attribution drift, or cost inflation.'),
      card('If spend is efficient but revenue quality is mixed', 'AOV, retention, or product margin may need to be reviewed alongside the media result.'),
    ],
    quickRows: [
      row('ROAS', 'Revenue / Marketing Spend', 'Shows revenue generated for each dollar of spend.'),
      row('Gross profit', 'Revenue x Gross Margin %', 'Creates a better return base for profitability analysis.'),
      row('Marketing ROI', '(Gross Profit - Spend) / Spend', 'Measures return after considering contribution rather than revenue only.'),
      row('CAC', 'Marketing Spend / Acquisitions', 'Shows how much one acquired customer cost under the modeled campaign.'),
    ],
    references: [REF.hubspotMarketingRoi, REF.hubspotPerformanceMetrics, REF.wordstreamBenchmarks],
    understanding: [
      card('ROAS and ROI are not interchangeable', 'ROAS describes revenue efficiency, while ROI is closer to the profitability question most operators care about.'),
      card('Margin changes the story', 'The same revenue result can create very different ROI outcomes depending on the margin structure behind it.'),
      card('Channel quality often shows up in downstream metrics', 'CPL and CAC can reveal whether the issue lives at the top of the funnel or deeper in the customer journey.'),
      card('Return should be interpreted over a clear time frame', 'Campaigns with longer payoff windows can look weak in the short term and stronger over a broader revenue window.'),
    ],
    faqs: [
      faq('How do you calculate marketing ROI?', 'A practical formula compares profit generated by the campaign with the marketing spend used to create it.', 'Basics'),
      faq('What is the difference between ROAS and ROI?', 'ROAS measures revenue relative to spend, while ROI measures net return relative to spend.', 'Method'),
      faq('Why include CAC and CPL in a marketing ROI calculator?', 'They help explain where efficiency is breaking down or improving across the funnel.', 'Interpretation'),
    ],
  }),
  'email-marketing-roi': cfg({
    title: 'Email Marketing ROI Calculator',
    subtitle: 'Estimate open rate, click rate, click-to-open rate, post-click conversion rate, and ROI from one email run',
    focus: 'email funnel efficiency and commercial return',
    concept: 'email marketing ROI',
    researchFocus: 'open rate, click rate, conversion rate, gross-profit return, and campaign efficiency',
    intro: 'This calculator is designed for email teams that want to measure performance across the full email funnel instead of judging a campaign by opens or clicks alone.',
    stepTips: [
      'Enter total sends first so the full campaign volume is anchored in real delivery scale.',
      'Add opens, clicks, and conversions separately to keep each funnel stage visible.',
      'Use campaign spend, revenue, and gross margin if you want a return estimate, not just engagement percentages.',
      'Read the popup as a funnel story from send to profit, not as a single vanity metric.',
    ],
    dashboardTips: [
      'Email ROI as the lead output.',
      'Open rate and click rate kept separate.',
      'Click-to-open rate for message-body quality.',
      'Post-click conversion rate for landing-page and offer quality.',
    ],
    features: [
      'Funnel-stage rates and ROI in one run',
      'Gross-profit return instead of revenue-only framing',
      'Useful for campaign reviews, lifecycle programs, and segmentation tests',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on interpreting email performance holistically',
      'Feature set informed by live Mailchimp and email-performance resources',
    ],
    decisionCards: [
      card('If open rate is healthy but click rate is weak', 'Subject line and delivery may be working while the message or offer is underperforming.'),
      card('If click-to-open is strong but conversions are weak', 'The friction may live on the landing page or in the offer rather than in the email itself.'),
      card('If ROI is weak despite good engagement', 'Audience quality, average order value, or attribution window may deserve attention.'),
      card('If clicks are low but ROI is still strong', 'The list may be small but highly qualified, which can still justify the campaign.'),
    ],
    quickRows: [
      row('Open rate', 'Opens / Sends', 'Measures how many delivered emails were opened.'),
      row('Click rate', 'Clicks / Sends', 'Shows how much of total send volume generated clicks.'),
      row('Click-to-open rate', 'Clicks / Opens', 'Measures how effectively the email content turned opens into clicks.'),
      row('Email ROI', '(Gross Profit - Campaign Cost) / Campaign Cost', 'Measures return after comparing contribution with campaign spend.'),
    ],
    references: [REF.mailchimpEmailRoiCalculator, REF.mailchimpEmailMetrics, REF.hubspotPerformanceMetrics],
    understanding: [
      card('Open rate is only the start of the story', 'An email can earn opens and still fail to produce meaningful downstream action.'),
      card('Click-to-open rate adds message-quality context', 'It helps separate creative and offer performance from subject-line and inbox placement performance.'),
      card('ROI depends on both engagement and value', 'Even modest click volume can still create strong return if the list quality and conversion value are high.'),
      card('Segmentation often changes the economics', 'Lifecycle stage, list hygiene, and audience intent can shift performance far more than broad benchmark comparisons.'),
    ],
    faqs: [
      faq('How do you calculate email marketing ROI?', 'A common approach compares profit generated by the email campaign with the cost of producing and sending it.', 'Basics'),
      faq('What is click-to-open rate?', 'It is the percentage of opens that turned into clicks, often used to evaluate email content quality after the open happens.', 'Method'),
      faq('Why track post-click conversion rate too?', 'Because the email may do its job well while the landing page or offer still underperforms.', 'Interpretation'),
    ],
  }),
  'cost-per-click': cfg({
    title: 'Cost Per Click Calculator',
    subtitle: 'Estimate CPC, CTR, CPA, and CPM from one ad-spend scenario',
    focus: 'click-cost efficiency and its relationship to broader ad performance',
    concept: 'cost per click analysis',
    researchFocus: 'ad spend, clicks, impressions, CPA, and media buying efficiency',
    intro: 'This calculator is built for advertisers who want to know what each click is costing while still keeping top-of-funnel and downstream efficiency visible in the same run.',
    stepTips: [
      'Enter total ad spend and total clicks first so the CPC calculation has a clean base.',
      'Add impressions if you want CTR and CPM context alongside the click cost.',
      'Include conversions if you want the dashboard to relate click buying to acquisition cost.',
      'Use the popup to judge click cost in context, not by itself.',
    ],
    dashboardTips: [
      'Average CPC as the headline output.',
      'CTR to show response quality.',
      'CPA to connect click buying with downstream outcome.',
      'CPM to show the cost of audience exposure.',
    ],
    features: [
      'CPC, CTR, CPA, and CPM in one result',
      'Top-of-funnel and downstream metrics shown together',
      'Useful for campaign optimization and channel benchmarking',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on ad efficiency interpretation',
      'Feature set informed by Google Ads Help and PPC benchmark sources',
    ],
    decisionCards: [
      card('If CPC is low but CPA is high', 'The media may be cheap while the post-click experience or audience quality is weak.'),
      card('If CPC is high but CTR is strong', 'The market may be competitive, but the creative or targeting could still be performing well.'),
      card('If CPM is low but CTR is weak', 'The campaign may be buying reach efficiently without earning enough attention.'),
      card('If CPC trends up over time', 'Auction pressure, audience saturation, or creative fatigue may be affecting the campaign.'),
    ],
    quickRows: [
      row('CPC', 'Ad Spend / Clicks', 'Measures the average amount paid for each click.'),
      row('CTR', 'Clicks / Impressions', 'Shows how often impressions turned into clicks.'),
      row('CPA', 'Ad Spend / Conversions', 'Adds a downstream efficiency lens to the click-buying result.'),
      row('CPM', '(Ad Spend / Impressions) x 1,000', 'Shows the cost of reaching one thousand impressions.'),
    ],
    references: [REF.googleAdsAvgCpc, REF.wordstreamBenchmarks],
    understanding: [
      card('CPC is a media-buying metric, not a profit metric', 'It tells you what a click costs, but not whether that click turned into a valuable outcome.'),
      card('CTR gives useful creative and targeting context', 'When paired with CPC, it helps show whether the campaign is paying more because the market is competitive or because the ad is not resonating.'),
      card('CPA closes the loop further down the funnel', 'A campaign with a good CPC can still be commercially weak if click quality is poor.'),
      card('CPM adds another buying lens', 'That measure helps explain whether your economics are being driven by response rate or exposure cost.'),
    ],
    faqs: [
      faq('How do you calculate cost per click?', 'Average CPC is typically calculated by dividing total ad spend by total clicks.', 'Basics'),
      faq('Why include CTR and CPA too?', 'Because click cost means more when you can compare it with ad response and acquisition efficiency.', 'Method'),
      faq('Is a lower CPC always better?', 'Not automatically. Cheap clicks can still be low quality if they do not lead to meaningful conversions.', 'Interpretation'),
    ],
  }),
  'cost-per-acquisition': cfg({
    title: 'Cost Per Acquisition Calculator',
    subtitle: 'Estimate CPA, ROAS, value per acquisition, and gross profit per acquisition in one run',
    focus: 'acquisition efficiency relative to customer value',
    concept: 'cost per acquisition analysis',
    researchFocus: 'ad spend, acquired customers, value per acquisition, and return quality',
    intro: 'This calculator is built for marketers who need to know not just what an acquisition costs, but whether that cost still makes sense against the value being created.',
    stepTips: [
      'Enter ad spend and acquisitions first so the base CPA is grounded in real campaign output.',
      'Add revenue if you want the result to translate acquisitions into value and ROAS.',
      'Use gross margin percent if you want a stronger profitability lens than revenue alone.',
      'Review the popup as a customer-value screen, not just a cost screen.',
    ],
    dashboardTips: [
      'CPA as the lead output.',
      'ROAS to show revenue efficiency.',
      'Value per acquisition for quality interpretation.',
      'Gross profit per acquisition for a stronger return lens.',
    ],
    features: [
      'CPA and customer value context in one run',
      'ROAS plus gross-profit-per-acquisition support',
      'Useful for channel comparison and bid strategy reviews',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on acquisition economics, not just cost math',
      'Feature pattern informed by live PPC and marketing ROI resources',
    ],
    decisionCards: [
      card('If CPA is high but value per acquisition is higher', 'The channel may still be attractive if customer quality and retention justify the cost.'),
      card('If CPA is low but gross profit per acquisition is weak', 'The campaign may be pulling in low-value customers or low-margin orders.'),
      card('If ROAS is acceptable but CPA feels uncomfortable', 'The team may need a clearer customer payback target or LTV view.'),
      card('If acquisition count rises while value per acquisition falls', 'Scaling may be trading off quality for volume.'),
    ],
    quickRows: [
      row('CPA', 'Ad Spend / Acquisitions', 'Measures the average cost to acquire one customer or completed acquisition event.'),
      row('Value per acquisition', 'Revenue / Acquisitions', 'Shows the average revenue created by each acquired customer.'),
      row('Gross profit per acquisition', '(Revenue x Margin %) / Acquisitions', 'Helps judge whether each acquired customer is economically attractive.'),
      row('ROAS', 'Revenue / Ad Spend', 'Shows revenue returned for each dollar of spend.'),
    ],
    references: [REF.wordstreamBenchmarks, REF.hubspotPerformanceMetrics],
    understanding: [
      card('CPA should always be judged against value', 'A standalone acquisition cost says very little until it is compared with what that acquired customer is worth.'),
      card('Revenue quality changes the interpretation', 'The same CPA can be excellent or weak depending on order value, retention, and margin.'),
      card('ROAS can help but does not replace CPA', 'Both metrics answer different questions and often work best together.'),
      card('Acquisition cost usually shifts as you scale', 'As channels saturate, CPA can rise or customer quality can soften, so trend monitoring matters.'),
    ],
    faqs: [
      faq('How do you calculate cost per acquisition?', 'A standard formula divides total spend by the number of acquired customers or completed acquisition events.', 'Basics'),
      faq('Why include value per acquisition?', 'Because cost makes more sense once it is compared with the revenue or profit each acquisition produced.', 'Method'),
      faq('Is CPA the same as CAC?', 'They are closely related, but teams sometimes define CAC more broadly by including additional overhead or multi-channel costs.', 'Interpretation'),
    ],
  }),
  'click-through-rate': cfg({
    title: 'Click-Through Rate Calculator',
    subtitle: 'Estimate CTR, clicks, CPC, post-click conversion rate, and CPM from one campaign run',
    focus: 'ad response rate and its relationship to traffic quality',
    concept: 'click-through rate analysis',
    researchFocus: 'impressions, clicks, CPC, and post-click conversion behavior',
    intro: 'This calculator is designed for marketers who need to understand how often impressions are earning clicks and whether those clicks are part of a healthy campaign pattern.',
    stepTips: [
      'Enter impressions and clicks first because CTR is fundamentally a response-to-exposure metric.',
      'Add spend if you want CPC and CPM context attached to the response rate.',
      'Include conversions if you want the result to extend beyond the click and into post-click quality.',
      'Use the popup to compare top-of-funnel attention with downstream intent.',
    ],
    dashboardTips: [
      'CTR as the headline metric.',
      'Clicks kept visible as the underlying response count.',
      'CPC and CPM to explain media cost quality.',
      'Post-click conversion rate to connect attention with action.',
    ],
    features: [
      'CTR plus cost and post-click context in one result',
      'Useful for creative testing, audience tuning, and media reviews',
      'CPC, CPM, and conversion-rate context included',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on how to read CTR well',
      'Feature set informed by live ad-platform and benchmark resources',
    ],
    decisionCards: [
      card('If CTR is strong but post-click conversion is weak', 'The creative may be earning attention without sending sufficiently qualified traffic.'),
      card('If CTR is weak but conversion after click is strong', 'The campaign may need more compelling messaging rather than a new landing page.'),
      card('If CTR drops while CPC rises', 'Auction pressure and creative fatigue may be compounding at the same time.'),
      card('If clicks are high but volume is still disappointing', 'Impression scale may be the bottleneck even if response rate is healthy.'),
    ],
    quickRows: [
      row('CTR', 'Clicks / Impressions', 'Measures how often impressions produced clicks.'),
      row('CPC', 'Ad Spend / Clicks', 'Shows what those clicks cost on average.'),
      row('Post-click conversion rate', 'Conversions / Clicks', 'Shows how much of the clicked traffic completed the desired action.'),
      row('CPM', '(Ad Spend / Impressions) x 1,000', 'Shows the cost of audience exposure at scale.'),
    ],
    references: [REF.googleAdsAvgCpc, REF.wordstreamBenchmarks],
    understanding: [
      card('CTR is a response signal', 'It helps show whether the audience found the message relevant enough to click.'),
      card('Strong CTR does not guarantee strong economics', 'A campaign can attract clicks without attracting the right clicks.'),
      card('Cost context matters', 'The same CTR can imply very different outcomes depending on what the traffic cost to earn.'),
      card('The best interpretation usually includes the next funnel step', 'Post-click conversion behavior often explains whether CTR is genuinely useful or mostly superficial.'),
    ],
    faqs: [
      faq('How do you calculate click-through rate?', 'CTR is calculated by dividing clicks by impressions and multiplying by 100 for a percentage.', 'Basics'),
      faq('Why pair CTR with post-click conversion rate?', 'Because CTR alone cannot tell you whether the clicks turned into meaningful business outcomes.', 'Method'),
      faq('What is a good CTR?', 'It depends on channel, audience, and ad format, so the most useful comparison is often against your own historical or channel benchmark context.', 'Interpretation'),
    ],
  }),
  'engagement-rate': cfg({
    title: 'Engagement Rate Calculator',
    subtitle: 'Estimate engagement rate by impressions, engagement rate by followers, engagement intensity, and click share in one run',
    focus: 'social response quality relative to reach and audience size',
    concept: 'engagement rate analysis',
    researchFocus: 'engagements, impressions, follower-based response, and engagement mix',
    intro: 'This calculator is built for social teams who need to understand how much real interaction content is generating and how that answer changes depending on whether impressions or followers are used as the base.',
    stepTips: [
      'Enter total engagements first, then add impressions so the impression-based rate can be calculated cleanly.',
      'Add follower count if you want the audience-size version of the metric as well.',
      'Include clicks if you want to see how much of the engagement activity turned into higher-intent interaction.',
      'Use the popup to compare multiple engagement lenses rather than debating one formula in isolation.',
    ],
    dashboardTips: [
      'Engagement rate by impressions as the headline output.',
      'Follower-based engagement rate as a second lens.',
      'Engagements per 1,000 impressions for scale-normalized reading.',
      'Click share of engagements to separate lighter interactions from stronger response.',
    ],
    features: [
      'Impression-based and follower-based engagement views in one run',
      'Engagement intensity and click-share context',
      'Useful for social reporting and content quality reviews',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on choosing the right engagement lens',
      'Feature pattern informed by current Hootsuite engagement guidance',
    ],
    decisionCards: [
      card('If engagement by impressions is healthy but follower-based engagement is weaker', 'The content may be resonating well with the people who actually saw it, even if the overall audience is large.'),
      card('If engagement is high but click share is low', 'The content may be driving reactions without generating much deeper traffic intent.'),
      card('If follower-based engagement is strong but impressions are low', 'The content may be resonating with a loyal audience but not reaching broadly.'),
      card('If engagement rate changes sharply by platform', 'Platform mechanics and content format may matter more than the broad brand average.'),
    ],
    quickRows: [
      row('Engagement rate by impressions', 'Engagements / Impressions', 'A useful formula when you want to judge response against actual exposure.'),
      row('Engagement rate by followers', 'Engagements / Followers', 'Useful for audience-size-normalized comparisons across accounts.'),
      row('Engagements per 1,000 impressions', '(Engagements / Impressions) x 1,000', 'Makes response volume easier to compare at larger media scales.'),
      row('Click share of engagements', 'Clicks / Engagements', 'Shows how much engagement moved into stronger interaction.'),
    ],
    references: [REF.hootsuiteEngagementRate, REF.mailchimpEmailMetrics],
    understanding: [
      card('Engagement rate has more than one formula', 'Different teams use impressions, reach, followers, or posts as the denominator depending on the question they are answering.'),
      card('Impressions often create a cleaner campaign lens', 'That denominator reflects the audience that actually had a chance to engage with the content.'),
      card('Follower-based rates can still be useful', 'They help compare how responsive a full audience is over time, especially in account-level reporting.'),
      card('Not all engagement carries equal intent', 'Likes, shares, comments, saves, and clicks can contribute very different kinds of value.'),
    ],
    faqs: [
      faq('How do you calculate engagement rate?', 'A common formula divides total engagements by impressions or followers and multiplies by 100.', 'Basics'),
      faq('Which engagement-rate formula is best?', 'It depends on the question. Impression-based formulas are often strong for campaign analysis, while follower-based formulas can help with account-level comparisons.', 'Method'),
      faq('Why show click share of engagements?', 'Because it helps distinguish lighter social interaction from stronger intent-driven behavior.', 'Interpretation'),
    ],
  }),
  'ab-test': cfg({
    title: 'A/B Test Calculator',
    subtitle: 'Compare control and variant conversion rates, absolute lift, relative uplift, and confidence approximation in one run',
    focus: 'experiment result quality and lift interpretation',
    concept: 'A/B test analysis',
    researchFocus: 'control versus variant conversion, lift, and planning-level confidence interpretation',
    intro: 'This calculator is designed for teams running experiments who want to compare control and variant performance without losing sight of traffic volume and result confidence.',
    stepTips: [
      'Enter control and variant visitor counts and conversions separately so the test arms stay clean.',
      'Use the popup to compare absolute lift and relative uplift together instead of focusing only on one framing.',
      'Read the confidence result as a planning approximation, not as a replacement for a full experimentation platform.',
      'If the result is close, rerun with expected additional traffic in mind before treating the winner as settled.',
    ],
    dashboardTips: [
      'Relative uplift as the headline output.',
      'Control and variant conversion rates side by side.',
      'Absolute lift in percentage points.',
      'Confidence approximation to frame result stability.',
    ],
    features: [
      'Control-versus-variant comparison in one run',
      'Absolute and relative lift shown together',
      'Traffic-sensitive confidence approximation',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on practical experiment interpretation',
      'Feature set informed by live Optimizely experimentation resources',
    ],
    decisionCards: [
      card('If uplift is positive but confidence is soft', 'The variant may be promising, but the team may need more traffic before calling it a stable winner.'),
      card('If absolute lift is small but commercial value is high', 'Even modest conversion improvement can be worth acting on at large traffic scales.'),
      card('If relative uplift looks large on low traffic', 'The result may be more volatile than the headline percentage suggests.'),
      card('If variant wins on conversion but creates secondary tradeoffs', 'Experiment decisions should still consider downstream quality, revenue, and user experience.'),
    ],
    quickRows: [
      row('Control conversion rate', 'Control Conversions / Control Visitors', 'Shows the baseline performance of the original experience.'),
      row('Variant conversion rate', 'Variant Conversions / Variant Visitors', 'Shows performance of the tested variant.'),
      row('Absolute lift', 'Variant Rate - Control Rate', 'Measures the raw percentage-point difference between the two versions.'),
      row('Relative uplift', '(Variant Rate - Control Rate) / Control Rate', 'Measures how much the variant improved relative to baseline.'),
    ],
    references: [REF.optimizelyAbTesting, REF.optimizelySampleSize],
    understanding: [
      card('Absolute lift and relative uplift answer different questions', 'One tells you the raw rate change, while the other tells you how large that change was relative to the baseline.'),
      card('Traffic volume shapes result trust', 'A promising improvement can still be unstable if the experiment has not accumulated enough observations.'),
      card('Statistical confidence is not business confidence', 'A test can be statistically strong and still commercially unimportant if the effect size is too small to matter.'),
      card('Experiment quality is broader than the headline winner', 'Proper tracking, clean segmentation, and clearly defined outcomes all shape whether a test result should be trusted.'),
    ],
    faqs: [
      faq('How do you compare A/B test results?', 'A practical starting point is to compare control and variant conversion rates, then measure both absolute lift and relative uplift.', 'Basics'),
      faq('What is the difference between absolute and relative lift?', 'Absolute lift is the raw point difference between rates, while relative lift compares that change to the control rate.', 'Method'),
      faq('Is the confidence result exact?', 'No. This calculator provides a planning-level approximation and not the full output of a dedicated experimentation platform.', 'Interpretation'),
    ],
  }),
  'sample-size': cfg({
    title: 'Sample Size Calculator',
    subtitle: 'Estimate recommended sample size, infinite-population sample, z-score, and finite-population adjustment in one run',
    focus: 'survey and experiment sample planning',
    concept: 'sample size planning',
    researchFocus: 'confidence level, margin of error, population size, and finite population correction',
    intro: 'This calculator is built for teams planning surveys, research, and experiments who need a fast estimate of how many observations are required before the result is likely to be decision-useful.',
    stepTips: [
      'Start with the confidence level and margin of error because those two assumptions drive the size requirement the most.',
      'Enter population size if you are sampling from a clearly finite group and want the adjustment included.',
      'Use response distribution at 50% if you want a conservative default when no better estimate is available.',
      'Read the popup as a planning guide rather than an immutable statistical command.',
    ],
    dashboardTips: [
      'Recommended sample size as the lead output.',
      'Infinite-population sample shown for comparison.',
      'Confidence z-score made explicit.',
      'Finite population correction kept visible when relevant.',
    ],
    features: [
      'Confidence, error tolerance, and population size in one run',
      'Finite-population adjustment included',
      'Useful for survey planning and experiment sizing',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on what changes sample requirements',
      'Feature set informed by live sample-size guides and calculators',
    ],
    decisionCards: [
      card('If recommended sample is larger than expected', 'A tighter margin of error or higher confidence level may be driving the increase more than population size alone.'),
      card('If population is small', 'Finite population correction can materially reduce the required sample compared with a large-population assumption.'),
      card('If collection capacity is limited', 'You may need to relax confidence or margin goals rather than pretending a smaller sample answers the same question.'),
      card('If the sample will be sliced into segments', 'Each segment may need enough observations on its own for the findings to remain useful.'),
    ],
    quickRows: [
      row('Infinite-population sample', 'z^2 x p x (1-p) / e^2', 'Shows the baseline sample requirement before finite-population adjustment.'),
      row('Adjusted sample', 'Infinite Sample / (1 + (Infinite Sample - 1) / Population)', 'Applies the finite-population correction.'),
      row('Response distribution', 'Expected proportion of one outcome', 'Higher uncertainty near 50% usually requires a larger sample.'),
      row('Finite population correction', 'sqrt((N - n) / (N - 1))', 'Shows the scale of the adjustment when sampling from a bounded population.'),
    ],
    references: [REF.optimizelySampleSize, REF.surveyMonkeySampleSize],
    understanding: [
      card('Sample size is a precision decision', 'It is mainly shaped by how much uncertainty and risk the team is willing to tolerate.'),
      card('Margin of error has a strong effect', 'Small improvements in desired precision can require much larger increases in sample size.'),
      card('Finite populations change the math', 'If you are sampling a meaningful share of a bounded group, the required sample often shrinks.'),
      card('A sample target does not guarantee a good study', 'Sampling method, data quality, and measurement design still matter even when the numeric target is met.'),
    ],
    faqs: [
      faq('How do you calculate sample size?', 'A common planning formula uses confidence level, margin of error, expected response distribution, and optionally population size.', 'Basics'),
      faq('Why does 50% response distribution create a larger sample?', 'Because it represents maximum uncertainty, which typically requires a larger sample to estimate reliably.', 'Method'),
      faq('When does population size matter?', 'It matters most when the sample is a meaningful share of a finite population and finite-population correction becomes relevant.', 'Interpretation'),
    ],
  }),
  'market-share': cfg({
    title: 'Market Share Calculator',
    subtitle: 'Estimate current market share, target-share revenue, revenue gap, and remaining market opportunity in one run',
    focus: 'company position relative to total market revenue',
    concept: 'market share analysis',
    researchFocus: 'company revenue, market revenue, share target, and revenue gap to target',
    intro: 'This calculator is built for operators and marketers who need to translate company revenue into market position and then turn a target share into a practical revenue goal.',
    stepTips: [
      'Enter your company revenue and total market revenue for the same period and market definition.',
      'Add a target share percentage if you want the dashboard to translate ambition into a revenue target.',
      'Use the popup to compare current share with the gap to target rather than stopping at the share figure alone.',
      'If market size is uncertain, rerun multiple scenarios because the share result depends on the quality of the market estimate.',
    ],
    dashboardTips: [
      'Current market share as the headline output.',
      'Target revenue at the target share you entered.',
      'Revenue gap to reach that target.',
      'Remaining market revenue outside your current capture.',
    ],
    features: [
      'Current share and target-share planning in one run',
      'Revenue-gap translation for practical planning',
      'Useful for strategy, budgeting, and growth reviews',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on turning share into action',
      'Feature pattern informed by live market-share references',
    ],
    decisionCards: [
      card('If current share is low but the revenue gap is manageable', 'The opportunity may still be practical if the target market definition is tight and attainable.'),
      card('If share is healthy but the market is expanding quickly', 'Holding share may still require growth because the denominator is changing.'),
      card('If the gap to target is very large', 'The share target may need to be phased into more realistic revenue milestones.'),
      card('If market size is uncertain', 'The share result should be treated as a scenario tool, not as absolute truth.'),
    ],
    quickRows: [
      row('Market share', 'Company Revenue / Total Market Revenue', 'Measures what share of the defined market your business currently holds.'),
      row('Target revenue', 'Total Market Revenue x Target Share', 'Converts a target share goal into a practical revenue figure.'),
      row('Revenue gap', 'Target Revenue - Company Revenue', 'Shows how much additional revenue is needed to hit the target share.'),
      row('Remaining market revenue', 'Total Market Revenue - Company Revenue', 'Shows how much revenue still sits outside current capture.'),
    ],
    references: [REF.similarwebMarketShare, REF.shopifyBrandTracking],
    understanding: [
      card('Market share is a relative measure', 'It compares your business with the size of the market, not just with your own internal growth rate.'),
      card('Definition quality matters', 'The answer changes materially depending on how the market is scoped by geography, category, and time period.'),
      card('Share goals work better when translated into revenue', 'That conversion turns a strategic ambition into an operational planning target.'),
      card('Growth and share are related but not identical', 'A company can grow in revenue and still lose share if the overall market grows faster.'),
    ],
    faqs: [
      faq('How do you calculate market share?', 'A common formula divides company sales or revenue by total market sales or revenue for the same market and time period.', 'Basics'),
      faq('Why show target revenue from target share?', 'Because strategy teams often need to turn a share goal into a revenue target that can be planned against.', 'Method'),
      faq('Can market share be measured by units instead of revenue?', 'Yes. Some teams use units, customers, or traffic, but the metric should stay consistent with the market definition being analyzed.', 'Use Cases'),
    ],
  }),
};
