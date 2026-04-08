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

export type HumanResourcesVariant =
  | 'salary'
  | 'hourly-wage'
  | 'overtime'
  | 'payroll'
  | 'employee-cost'
  | 'pto'
  | 'sick-leave'
  | 'holiday-pay'
  | 'severance-pay'
  | 'employee-turnover-cost'
  | 'recruitment-cost'
  | 'training-roi'
  | 'benefits-cost'
  | 'workers-comp'
  | 'fte';

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
  irsPub15: {
    label: "IRS Publication 15 (Employer's Tax Guide)",
    url: 'https://www.irs.gov/publications/p15',
  },
  irsPub15B: {
    label: "IRS Publication 15-B (Fringe Benefits)",
    url: 'https://www.irs.gov/publications/p15b',
  },
  irsEmploymentTaxes: {
    label: 'IRS Employment Tax Publications',
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-publications',
  },
  irsAle: {
    label: 'IRS ALE and Full-Time Equivalent Guidance',
    url: 'https://www.irs.gov/affordable-care-act/employers/determining-if-an-employer-is-an-applicable-large-employer',
  },
  dolOvertime: {
    label: 'U.S. Department of Labor: Overtime Pay',
    url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay',
  },
  dolRegularRate: {
    label: 'U.S. Department of Labor: Regular Rate Basics',
    url: 'https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate',
  },
  dolHoliday: {
    label: 'U.S. Department of Labor: Holidays',
    url: 'https://www.dol.gov/general/topic/workhours/holidays',
  },
  dolPaidLeave: {
    label: 'U.S. Department of Labor: Paid Leave',
    url: 'https://www.dol.gov/agencies/wb/featured-paid-leave',
  },
  dolFmla: {
    label: 'U.S. Department of Labor: Family and Medical Leave',
    url: 'https://www.dol.gov/whd/fmla/index.htm',
  },
  dolSeverance: {
    label: 'U.S. Department of Labor: Severance Pay',
    url: 'https://www.dol.gov/general/topic/wages/severancepay',
  },
  blsEcec: {
    label: 'BLS Employer Costs for Employee Compensation',
    url: 'https://www.bls.gov/news.release/ecec.nr0.htm',
  },
  blsBenefits: {
    label: 'BLS Employee Benefits in the United States',
    url: 'https://www.bls.gov/ebs/',
  },
  waWorkersComp: {
    label: "Washington L&I: Calculating Workers' Comp Premium Rates",
    url: 'https://www.lni.wa.gov/insurance/rates-risk-classes/rates-for-workers-compensation/calculating-premium-rates',
  },
  linkedInMetrics: {
    label: 'LinkedIn Recruiting Metrics Cheat Sheet',
    url: 'https://business.linkedin.com/content/dam/me/business/en-us/talent-solutions/resources/pdfs/cheatsheet-recruiting-metrics-for-smbs_v2.pdf',
  },
  panoptoTrainingRoi: {
    label: 'Panopto: How to Calculate Training ROI',
    url: 'https://www.panopto.com/blog/how-to-measure-the-roi-of-training/',
  },
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Decision-ready outputs', `The result set is organized around ${focus}, not just a single formula answer.`),
  card('Popup-only results', 'The calculator keeps the approved advanced popup result pattern instead of switching to a thin inline summary.'),
  card('Operational context', 'Primary metrics, supporting diagnostics, and warning states stay together so managers can make a cleaner decision.'),
  card('Research-led inputs', 'Inputs and feature coverage were chosen after reviewing public payroll, HR, and staffing calculators online.'),
];

const cfg = (config: Omit<VariantConfig, 'whyUse'>): VariantConfig => ({
  ...config,
  whyUse: baseWhyUse(config.focus),
});

export const HUMAN_RESOURCES_CONFIG: Record<HumanResourcesVariant, VariantConfig> = {
  salary: cfg({
    title: 'Salary Calculator',
    subtitle: 'Convert hourly pay into annual, monthly, biweekly, semimonthly, weekly, and daily compensation views',
    cta: 'Calculate Salary',
    reviewName: 'Salary Calculator',
    focus: 'annualized compensation planning and pay-period comparisons',
    concept: 'salary annualization',
    researchFocus: 'hourly-to-salary conversion, work-year assumptions, and payroll-period budgeting',
    aboutParagraphs: [
      'This calculator is built for one of the most common compensation questions in human resources and recruiting: what an hourly rate actually means once it is translated into annual pay and common payroll periods.',
      'A simple hourly-to-annual multiplication often misses the real planning issue, which is that pay comparisons usually happen across weekly, biweekly, semimonthly, and monthly budgets at the same time.',
      'This advanced version keeps those views together so an offer, raise, or staffing scenario can be interpreted in the same rhythm that employees and employers actually use to plan cash flow.',
    ],
    stepTips: [
      'Enter the hourly rate you want to annualize, then add a realistic weekly-hours assumption instead of relying on a generic 40-hour default if the role differs.',
      'Use the weeks-per-year field carefully because unpaid time off, school-year schedules, or seasonal roles can materially change annualized compensation.',
      'Open the popup results and compare annual pay with the period-by-period outputs so compensation decisions are not based on only one lens.',
      'If you are comparing multiple roles, rerun the calculator with each schedule assumption rather than changing only the rate.',
    ],
    dashboardTips: [
      'Annual salary estimate built from hourly pay and scheduled work time.',
      'Monthly, biweekly, semimonthly, and weekly pay views for payroll planning.',
      'Daily earnings context for leave payout, day-rate conversations, or shift planning.',
      'Warning states when work-year assumptions make the annualized figure unreliable.',
    ],
    features: [
      'Hourly-to-annual conversion with editable work-year assumptions',
      'Monthly, biweekly, semimonthly, weekly, and daily pay outputs',
      'A stronger budgeting lens than a one-line salary converter',
      'Popup-only advanced results that preserve the approved UX pattern',
      'Original long-form guidance that matches the site structure',
      'Feature coverage informed by public compensation calculators and payroll tools',
    ],
    decisionCards: [
      card('If annual pay looks high but monthly cash flow feels tight', 'Semimonthly and biweekly payroll timing may be affecting how the compensation package feels in practice.'),
      card('If the role is seasonal or term-based', 'Weeks worked per year can matter as much as the hourly rate itself when comparing offers.'),
      card('If you are evaluating overtime-heavy jobs', 'Base annualization may understate real earnings unless overtime is modeled separately.'),
      card('If leave or unpaid breaks reduce hours', 'A reduced annual-hours assumption gives a more honest salary comparison than a 52-week default.'),
    ],
    quickRows: [
      row('Annual salary', 'Hourly Rate x Weekly Hours x Weeks Per Year', 'Converts a wage into a full-year pay estimate using your schedule assumption.'),
      row('Biweekly pay', 'Annual Salary / 26', 'Useful for payroll planning when checks are issued every two weeks.'),
      row('Semimonthly pay', 'Annual Salary / 24', 'Useful when payroll is processed twice each month.'),
      row('Daily pay', 'Weekly Pay / Workdays', 'Helpful for day-rate comparisons and paid-leave estimates.'),
    ],
    references: [REF.irsPub15, REF.blsEcec, REF.blsBenefits],
    understanding: [
      card('Annualized pay is only as good as the schedule behind it', 'A salary estimate can be overstated or understated quickly if weekly hours or weeks worked per year do not match the real job.'),
      card('Payroll timing affects employee experience', 'Two roles with the same annual pay can feel different if one pays biweekly and another semimonthly.'),
      card('Budgeting usually happens below the annual level', 'Housing, commuting, childcare, and debt decisions are often made monthly, which is why period views matter.'),
      card('Pay comparisons should be schedule-aware', 'A higher hourly rate is not automatically the better offer if the role includes fewer hours or fewer paid weeks.'),
    ],
    faqs: [
      faq('How do you convert hourly pay to salary?', 'A common estimate is hourly rate times weekly hours times weeks worked per year. The strongest comparison also checks how that pay looks monthly, biweekly, and weekly.', 'Method'),
      faq('Why does weeks per year matter?', 'Not every role pays across all 52 weeks. Seasonal work, unpaid time off, and school-year schedules can lower the annualized result.', 'Inputs'),
      faq('Is this the same as take-home pay?', 'No. This calculator annualizes gross compensation before taxes and deductions. Use payroll-focused tools for net pay analysis.', 'Scope'),
    ],
  }),
  'hourly-wage': cfg({
    title: 'Hourly Wage Calculator',
    subtitle: 'Turn annual salary into an hourly equivalent using your real schedule instead of a generic rule of thumb',
    cta: 'Calculate Hourly Wage',
    reviewName: 'Hourly Wage Calculator',
    focus: 'salary-to-hourly comparisons and staffing-rate benchmarking',
    concept: 'hourly wage equivalency',
    researchFocus: 'salary conversion, annual-hours assumptions, and fair comparisons across compensation structures',
    aboutParagraphs: [
      'This calculator reverses the salary-conversion question by translating annual pay into an hourly equivalent based on the schedule you actually expect to work.',
      'That matters because salary comparisons are often misleading when roles carry very different weekly hours, unpaid leave structures, or annual availability requirements.',
      'The advanced version keeps the hourly figure connected to weekly, monthly, and annual-hours context so pay benchmarking is more useful for recruiting, budgeting, and side-by-side offer review.',
    ],
    stepTips: [
      'Enter the annual salary first, then define the weekly-hours assumption that reflects the real role rather than an idealized schedule.',
      'Use weeks worked per year to account for unpaid breaks, academic calendars, seasonal shutdowns, or reduced-year contracts.',
      'Open the popup and read the hourly equivalent alongside weekly and monthly salary views to make the comparison more practical.',
      'If you are comparing exempt and nonexempt roles, rerun the calculator with multiple schedule assumptions to pressure-test the rate.',
    ],
    dashboardTips: [
      'Derived hourly wage based on salary and annual hours worked.',
      'Weekly, monthly, and daily pay equivalents for context.',
      'Annual-hours assumption so the derived rate can be checked, not guessed.',
      'Warnings when the schedule inputs make the hourly equivalent unstable.',
    ],
    features: [
      'Salary-to-hourly conversion using editable work assumptions',
      'Weekly, monthly, and daily pay equivalents',
      'Annual-hours transparency instead of a hidden divisor',
      'Popup-only advanced results that match the approved flow',
      'Useful for recruiting, compensation bands, and staffing comparisons',
      'Original content and HR-oriented interpretation guidance',
    ],
    decisionCards: [
      card('If the hourly equivalent feels low', 'The role may involve more hours than its headline salary suggests.'),
      card('If two salaries look similar but one converts better', 'Weekly-hour expectations may be doing more work than the salary figure alone.'),
      card('If you are comparing salary to contract work', 'Hourly equivalence helps normalize the first pass before benefits and taxes are layered in.'),
      card('If annual hours are uncertain', 'Run best-case and worst-case schedules so the pay comparison is not anchored to one optimistic assumption.'),
    ],
    quickRows: [
      row('Hourly wage', 'Annual Salary / Annual Hours Worked', 'Converts salary into a schedule-aware hourly equivalent.'),
      row('Annual hours', 'Weekly Hours x Weeks Per Year', 'This divisor determines how aggressive or conservative the hourly result is.'),
      row('Weekly equivalent', 'Annual Salary / Weeks Per Year', 'Translates salary into a period view for easier comparison.'),
      row('Monthly equivalent', 'Annual Salary / 12', 'Useful when employees think in monthly budgets rather than annual totals.'),
    ],
    references: [REF.irsPub15, REF.blsEcec, REF.blsBenefits],
    understanding: [
      card('The divisor is the story', 'Hourly wage equivalence depends less on math complexity and more on whether the annual-hours assumption reflects reality.'),
      card('Salaried roles still imply an hourly value', 'Even exempt jobs often need hourly benchmarking for budgeting, overtime comparisons, or contractor alternatives.'),
      card('Schedule intensity changes effective pay', 'More required hours can compress the hourly value of an otherwise attractive salary.'),
      card('Comparable roles need comparable assumptions', 'A clean pay comparison means normalizing work schedules before comparing compensation figures.'),
    ],
    faqs: [
      faq('How do you convert salary to hourly pay?', 'Divide annual salary by the total hours worked in the year. The hours assumption is what makes the result meaningful.', 'Method'),
      faq('What annual-hours number should I use?', 'Use the schedule you truly expect to work, not just a generic 2,080 hours if the role differs from a standard 40-hour, 52-week pattern.', 'Inputs'),
      faq('Why is my derived hourly rate lower than expected?', 'The schedule may include more weekly hours or more working weeks than you initially assumed.', 'Interpretation'),
    ],
  }),
  overtime: cfg({
    title: 'Overtime Calculator',
    subtitle: 'Estimate regular pay, overtime pay, premium rate, and blended weekly earnings in one run',
    cta: 'Calculate Overtime Pay',
    reviewName: 'Overtime Calculator',
    focus: 'premium-pay planning and weekly earnings visibility',
    concept: 'overtime pay',
    researchFocus: 'regular rate, overtime multiplier, weekly earnings, and schedule-sensitive premium pay',
    aboutParagraphs: [
      'This calculator is designed for one of the most common payroll questions: how overtime changes weekly pay once premium hours are separated from regular hours.',
      'A basic overtime tool often stops at multiplying hours by 1.5, but that leaves out the broader planning value of comparing regular pay, overtime premium, and the blended earnings rate in the same view.',
      'This version keeps those pieces together so workers, managers, and payroll teams can read the result as a practical weekly pay screen rather than a single premium number.',
    ],
    stepTips: [
      'Enter the base hourly rate first, then separate regular hours from overtime hours instead of combining them into one total.',
      'Use the overtime multiplier that matches policy, contract, or law for the scenario you are testing.',
      'Open the results popup and compare the regular-pay layer with the overtime-premium layer to see how much the extra hours are really changing earnings.',
      'If schedules vary, rerun the calculator with multiple overtime hour assumptions to see how quickly weekly compensation can move.',
    ],
    dashboardTips: [
      'Regular pay and overtime pay split into separate components.',
      'Overtime rate shown clearly instead of buried in the total.',
      'Blended hourly earnings rate across the full week.',
      'Warning states if assumptions undercut or distort the premium pay read.',
    ],
    features: [
      'Regular pay, overtime pay, and total weekly pay in one result',
      'Editable overtime multiplier for different policy scenarios',
      'Blended effective hourly rate for cleaner interpretation',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original explanatory content around premium-pay planning',
      'References grounded in official U.S. labor guidance',
    ],
    decisionCards: [
      card('If overtime is carrying a large share of weekly earnings', 'Staffing coverage or base-pay design may deserve a closer look because the team is leaning on premium hours.'),
      card('If the overtime rate feels lower than expected', 'The multiplier or regular-rate assumption may need to be checked against policy or labor rules.'),
      card('If blended earnings improve sharply with a few extra hours', 'Small schedule changes can have a meaningful budget impact for managers and employees alike.'),
      card('If overtime is routine rather than exceptional', 'The conversation may shift from weekly payroll math to broader workforce planning.'),
    ],
    quickRows: [
      row('Regular pay', 'Hourly Rate x Regular Hours', 'Shows the base weekly earnings before overtime is added.'),
      row('Overtime rate', 'Hourly Rate x Overtime Multiplier', 'Converts base pay into the premium hourly rate.'),
      row('Overtime pay', 'Overtime Rate x Overtime Hours', 'Measures the added weekly earnings from premium hours.'),
      row('Blended rate', 'Total Weekly Pay / Total Hours', 'Useful for understanding the real earnings rate across the whole schedule.'),
    ],
    references: [REF.dolOvertime, REF.dolRegularRate, REF.irsPub15],
    understanding: [
      card('The regular rate drives the whole calculation', 'If the underlying regular rate is wrong, every overtime estimate built on top of it will also be off.'),
      card('Overtime changes more than the total', 'It also changes how valuable each additional hour becomes at the margin.'),
      card('Weekly context matters', "The same premium hours can feel very different depending on the base schedule and the employee's normal earnings pattern."),
      card('Policy still matters', 'This calculator is strongest as a planning tool. Final payroll treatment can depend on role classification, local rules, and employer policy.'),
    ],
    faqs: [
      faq('How is overtime pay usually calculated?', 'A common approach is regular hourly rate times an overtime multiplier, multiplied again by overtime hours worked.', 'Method'),
      faq('Is overtime always time and a half?', 'Not always. Time-and-a-half is common, but policy, contracts, or special circumstances can change the multiplier.', 'Rules'),
      faq('Why show blended hourly earnings?', 'Because it gives a more realistic picture of what the week paid on average once regular and premium hours are combined.', 'Interpretation'),
    ],
  }),
  payroll: cfg({
    title: 'Payroll Calculator',
    subtitle: 'Estimate taxable wages, employee taxes, employer taxes, deductions, and net pay from one payroll run',
    cta: 'Calculate Payroll',
    reviewName: 'Payroll Calculator',
    focus: 'gross-to-net pay flow and employer payroll cost visibility',
    concept: 'payroll calculation',
    researchFocus: 'gross pay, pretax deductions, payroll-tax load, net pay, and employer outlay',
    aboutParagraphs: [
      'This calculator is built to turn one payroll run into a cleaner financial picture by showing how gross pay, deductions, employee taxes, employer taxes, and net pay connect.',
      'Many basic payroll calculators only emphasize take-home pay, but employers also need to see the total payroll burden and employees often need to understand how pretax and post-tax deductions change the outcome.',
      'The advanced version keeps the full payroll path visible so one result can support budgeting, communication, and payroll quality checks at the same time.',
    ],
    stepTips: [
      'Start with gross pay for the payroll period you are modeling, then add pretax deductions before applying tax assumptions.',
      'Use employee and employer tax rates that match the level of approximation you want. This is a planning tool, not a filing engine.',
      'Add post-tax deductions only after the pretax layer is defined so the net-pay result reads in the right order.',
      'Use the popup results to compare employee take-home pay with total employer outlay in the same run.',
    ],
    dashboardTips: [
      'Taxable wages after pretax deductions are removed.',
      'Employee payroll-tax estimate and post-tax deduction impact.',
      'Net pay for the period.',
      'Employer payroll-tax burden and total employer payroll cost.',
    ],
    features: [
      'Gross-to-net pay modeling in one screen',
      'Pretax and post-tax deduction support',
      'Employer payroll-tax visibility, not just employee net pay',
      'Popup-only advanced dashboard consistent with the site pattern',
      'Useful for budgeting, internal checks, and offer modeling',
      'Original HR/payroll content with official tax references',
    ],
    decisionCards: [
      card('If net pay falls more than expected', 'Pretax deductions, tax assumptions, or post-tax withholdings may be doing more work than gross pay alone suggests.'),
      card('If employer outlay feels high relative to take-home pay', 'Payroll taxes and benefit deductions may be creating a larger spread than teams realize.'),
      card('If the same raise barely changes net pay', 'Tax brackets, payroll deductions, or benefit elections may be absorbing part of the increase.'),
      card('If you are comparing candidate offers', 'Gross pay and employer payroll cost should be read together, not as separate decisions.'),
    ],
    quickRows: [
      row('Taxable wages', 'Gross Pay - Pretax Deductions', 'Shows the payroll base before employee tax assumptions are applied.'),
      row('Employee taxes', 'Taxable Wages x Employee Tax Rate', 'A planning estimate for payroll withholdings.'),
      row('Net pay', 'Gross Pay - Pretax Deductions - Employee Taxes - Post-Tax Deductions', 'Shows what remains after modeled deductions.'),
      row('Employer outlay', 'Gross Pay + Employer Payroll Taxes', 'Measures payroll cost from the employer side of the transaction.'),
    ],
    references: [REF.irsPub15, REF.irsEmploymentTaxes, REF.blsEcec],
    understanding: [
      card('Payroll is a flow, not one number', 'Gross pay, taxable wages, deductions, taxes, and net pay each answer a different question.'),
      card('Pretax deductions matter early', 'Moving deductions ahead of the tax calculation changes both taxable wages and final take-home pay.'),
      card('Employer cost and employee pay are not the same number', 'A business can spend meaningfully more than the employee receives once payroll taxes are included.'),
      card('Planning estimates still need final payroll controls', 'This calculator helps frame payroll economics, but official processing still depends on precise withholding rules and employer setup.'),
    ],
    faqs: [
      faq('What is the difference between gross pay and net pay?', 'Gross pay is earnings before deductions and taxes. Net pay is what remains after the modeled payroll deductions are applied.', 'Basics'),
      faq('Why include employer payroll taxes?', 'Because payroll decisions affect both employee take-home pay and the employer cost of the payroll run.', 'Employer View'),
      faq('Is this a tax filing calculator?', 'No. It is a planning and estimation tool. Final payroll processing should use your payroll system and official tax tables.', 'Scope'),
    ],
  }),
  'employee-cost': cfg({
    title: 'Employee Cost Calculator',
    subtitle: 'Estimate loaded annual employee cost by layering salary, payroll taxes, benefits, bonus, equipment, and training',
    cta: 'Calculate Employee Cost',
    reviewName: 'Employee Cost Calculator',
    focus: 'fully loaded headcount budgeting and offer-cost planning',
    concept: 'loaded employee cost',
    researchFocus: 'salary load, payroll-tax burden, benefits cost, and non-salary headcount expenses',
    aboutParagraphs: [
      'This calculator is built for the budgeting question that base salary alone cannot answer: what a role actually costs once taxes, benefits, tools, and other employer-funded items are included.',
      'A strong employee-cost model needs to move beyond compensation headlines and show the full loaded commitment tied to one hire or existing role.',
      'That is why this version keeps base salary, employer payroll taxes, benefits, bonus, equipment, training, and loaded-cost ratio in the same result instead of hiding everything behind one total.',
    ],
    stepTips: [
      'Enter base salary first, then add the employer payroll-tax rate that best fits your planning assumption.',
      'Layer in benefits, bonus, equipment, and training as separate inputs so the cost stack stays visible.',
      'Open the popup dashboard and compare total annual cost with the loaded-cost ratio to see how far the role extends beyond salary.',
      'If you are evaluating multiple hiring options, rerun the calculator with different benefit or bonus structures instead of changing salary alone.',
    ],
    dashboardTips: [
      'Total annual employee cost as the headline figure.',
      'Employer payroll-tax estimate as a distinct cost layer.',
      'Benefits, bonus, equipment, and training kept visible rather than blended away.',
      'Loaded-cost ratio showing total employer spend relative to base salary.',
    ],
    features: [
      'Loaded annual employee cost in one run',
      'Employer payroll taxes, benefits, bonus, equipment, and training support',
      'Loaded-cost ratio for fast budgeting interpretation',
      'Popup-only advanced dashboard consistent with the reference design',
      'Useful for workforce planning, offers, and staffing model comparisons',
      'Original content built around real HR cost decisions',
    ],
    decisionCards: [
      card('If loaded cost is much higher than base salary', 'Benefits, payroll taxes, and support spend may deserve more attention in budgeting conversations.'),
      card('If two roles have similar salary but very different loaded cost', 'Benefit design, equipment, or onboarding investment may be driving the gap.'),
      card('If headcount plans feel affordable on salary alone', 'The loaded-cost result is often the more realistic budgeting number.'),
      card('If you are comparing employee and contractor options', 'Loaded employee cost provides a better first-pass comparison point than salary alone.'),
    ],
    quickRows: [
      row('Employer payroll taxes', 'Base Salary x Employer Payroll Tax Rate', 'Captures the employer tax layer attached to compensation.'),
      row('Loaded employee cost', 'Salary + Payroll Taxes + Benefits + Bonus + Equipment + Training', 'Shows the full modeled annual commitment.'),
      row('Loaded-cost ratio', 'Loaded Cost / Base Salary', 'Measures how much total spend sits behind each salary dollar.'),
      row('Non-salary load', 'Loaded Cost - Base Salary', 'Helps isolate the budget share coming from support costs.'),
    ],
    references: [REF.blsEcec, REF.blsBenefits, REF.irsPub15],
    understanding: [
      card('Base salary is rarely the full budget number', 'Headcount cost expands quickly once payroll taxes, benefits, tools, and onboarding investment are included.'),
      card('Different roles carry different load profiles', 'Sales, technical, field, and people-facing roles often require very different support spend even at similar salaries.'),
      card('Loaded-cost ratio helps compare roles', 'It makes it easier to see whether a headcount plan is salary-heavy or support-heavy.'),
      card('This is strongest as a planning screen', 'Exact cost accounting can vary, but this structure is useful for deciding whether a role is affordable before hiring.'),
    ],
    faqs: [
      faq('What is loaded employee cost?', 'Loaded employee cost is the full employer cost of a role after salary, payroll taxes, benefits, and other employer-funded items are included.', 'Basics'),
      faq('Why include equipment and training?', 'Because those costs are real headcount costs even if they do not appear in the salary line item.', 'Method'),
      faq('Is a higher loaded-cost ratio always bad?', 'Not necessarily. Some roles justify a heavier support investment if they create enough value or reduce risk elsewhere in the business.', 'Interpretation'),
    ],
  }),
  pto: cfg({
    title: 'PTO Calculator',
    subtitle: 'Estimate accrual per pay period, accrued hours, used time, remaining balance, and remaining days',
    cta: 'Calculate PTO Balance',
    reviewName: 'PTO Calculator',
    focus: 'leave accrual visibility and remaining time-off planning',
    concept: 'paid time off accrual',
    researchFocus: 'annual leave banks, accrual cadence, used hours, and remaining leave balance',
    aboutParagraphs: [
      'This calculator is designed to answer a practical leave-management question: how much paid time off has actually accrued so far, how much has been used, and what balance remains.',
      'A strong PTO calculator needs to keep accrual cadence and used time visible together because balances are not just about the annual allowance. They depend on where the employee is in the accrual cycle.',
      'This version turns that into a more usable planning screen by showing accrual per period, hours accrued, remaining hours, remaining days, and usage rate in one result.',
    ],
    stepTips: [
      'Enter the annual PTO bank and the number of pay periods in the accrual year first so the accrual-per-period assumption is clear.',
      'Add the number of completed pay periods and the hours already used to estimate the current earned balance.',
      'Use hours per day so the popup can convert remaining hours into remaining days for a more human planning view.',
      'If policy uses monthly or anniversary-based accrual, match the periods-per-year input to that structure before reading the result.',
    ],
    dashboardTips: [
      'Accrual per pay period so policy cadence stays visible.',
      'Accrued hours to date based on completed periods.',
      'Remaining hours and remaining days for practical scheduling.',
      'Usage rate to show how aggressively the current balance has been consumed.',
    ],
    features: [
      'Accrual-per-period calculation with editable policy cadence',
      'Accrued, used, and remaining PTO in one result',
      'Remaining days conversion for planning conversations',
      'Usage-rate visibility for managers and employees',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original PTO content and HR planning guidance',
    ],
    decisionCards: [
      card('If remaining hours are lower than expected', 'The issue may be the completed-period count or a faster usage rate rather than the annual PTO policy itself.'),
      card('If the employee is still early in the year', 'Balances may appear tight simply because not enough accrual periods have passed yet.'),
      card('If managers think in days but payroll tracks hours', 'The days conversion can make scheduling decisions easier without losing precision.'),
      card('If used time already exceeds accrued time', 'The team may be operating ahead of earned accrual under the current assumptions.'),
    ],
    quickRows: [
      row('Accrual per period', 'Annual PTO Hours / Periods Per Year', 'Shows how much leave is earned in each accrual cycle.'),
      row('Accrued hours', 'Accrual Per Period x Periods Completed', 'Estimates how much PTO has been earned so far.'),
      row('Remaining balance', 'Accrued Hours - Used Hours', 'Shows the estimated current PTO balance.'),
      row('Remaining days', 'Remaining Hours / Hours Per Day', 'Converts leave into a planning-friendly day count.'),
    ],
    references: [REF.dolPaidLeave, REF.dolFmla, REF.blsBenefits],
    understanding: [
      card('PTO balance is a timing question', 'The annual PTO bank alone does not tell you how much time is actually available today.'),
      card('Hours and days answer different questions', 'Payroll often tracks hours, while employees and managers usually schedule in days.'),
      card('Usage rate adds context', 'A lower balance can be completely normal if usage is front-loaded early in the year.'),
      card('Policy details still matter', 'Carryover rules, front-loading, and anniversary resets can change the real balance outside a simple accrual model.'),
    ],
    faqs: [
      faq('How is PTO usually accrued?', 'Many policies accrue PTO evenly across pay periods, such as each payroll cycle or month.', 'Method'),
      faq('Why does this calculator ask for completed periods?', 'Because current balance depends on how far through the accrual year the employee has progressed.', 'Inputs'),
      faq('Can this replace the official balance in my HRIS?', 'No. It is a planning tool. The official balance should still come from your employer system and policy rules.', 'Scope'),
    ],
  }),
  'sick-leave': cfg({
    title: 'Sick Leave Calculator',
    subtitle: 'Estimate sick leave accrual, current earned balance, used time, remaining hours, and remaining days',
    cta: 'Calculate Sick Leave',
    reviewName: 'Sick Leave Calculator',
    focus: 'sick leave accrual tracking and remaining protected time',
    concept: 'sick leave accrual',
    researchFocus: 'leave bank accrual, used hours, remaining balance, and planning around health-related absences',
    aboutParagraphs: [
      'This calculator applies the same balance logic used in PTO planning to sick leave, where policy timing and used hours matter as much as the annual allowance.',
      'A basic sick-leave estimate can be misleading if it ignores the number of completed accrual periods or the difference between hours and days.',
      'The advanced version keeps accrual pace, used leave, remaining hours, remaining days, and usage rate in one dashboard so the balance is easier to interpret for both employees and managers.',
    ],
    stepTips: [
      'Enter the annual sick-leave bank and the number of accrual periods in the year before adding any usage.',
      'Use completed periods to estimate the earned balance at the current point in the year.',
      'Add hours already used so the calculator can translate earned accrual into an estimated available balance.',
      'Check remaining hours and remaining days together because scheduling conversations often happen in days while payroll keeps time in hours.',
    ],
    dashboardTips: [
      'Accrual per period and accrued hours to date.',
      'Used sick leave, remaining hours, and remaining days.',
      'Usage rate to show how much of the earned bank has already been consumed.',
      'Warning states if leave used exceeds accrued leave under the current assumptions.',
    ],
    features: [
      'Accrual-per-period sick leave estimation',
      'Earned, used, and remaining balance in one run',
      'Remaining days conversion for easier schedule planning',
      'Usage-rate visibility for policy and attendance reviews',
      'Popup-only advanced dashboard aligned with the approved design',
      'Original leave content written specifically for this tool',
    ],
    decisionCards: [
      card('If sick leave is already heavily used', 'The usage-rate metric can help frame attendance planning or policy conversations before the balance is exhausted.'),
      card('If remaining days look lower than expected', 'The completed-period count or annual leave bank may need to be checked.'),
      card('If managers only look at annual allowance', 'The current earned balance may be the more relevant number for day-to-day planning.'),
      card('If policy allows front-loading or carryover', 'The calculator result should be compared with actual policy treatment before making decisions.'),
    ],
    quickRows: [
      row('Accrual per period', 'Annual Sick Hours / Periods Per Year', 'Shows how quickly the sick-leave bank grows.'),
      row('Accrued leave', 'Accrual Per Period x Periods Completed', 'Estimates leave earned so far this year.'),
      row('Remaining hours', 'Accrued Hours - Used Hours', 'Shows the current modeled sick-leave balance.'),
      row('Remaining days', 'Remaining Hours / Hours Per Day', 'Translates the balance into a more intuitive planning unit.'),
    ],
    references: [REF.dolPaidLeave, REF.dolFmla, REF.blsBenefits],
    understanding: [
      card('Sick leave is usually a protected balance', 'That often makes accurate accrual timing more important than it is in informal leave planning.'),
      card('Current balance depends on earned time', 'The annual allowance is not the same as what has already accrued.'),
      card('Hours create administrative precision', 'Days help with planning, but hours usually align better with payroll and attendance systems.'),
      card('Policy design can vary widely', 'State law, employer rules, carryover, and front-loading can all change how an official balance is maintained.'),
    ],
    faqs: [
      faq('Is sick leave the same as PTO?', 'Not always. Some employers combine leave into one bank, while others maintain separate PTO and sick-leave policies.', 'Policy'),
      faq('Why show remaining days and remaining hours?', 'Because days are easier for planning while hours are usually how leave is tracked operationally.', 'Interpretation'),
      faq('Can this handle state-specific leave laws?', 'It is a general planning tool. State and employer rules may change accrual, carryover, and usage limits.', 'Scope'),
    ],
  }),
  'holiday-pay': cfg({
    title: 'Holiday Pay Calculator',
    subtitle: 'Compare base holiday pay, worked-holiday premium pay, effective holiday rate, and total compensation',
    cta: 'Calculate Holiday Pay',
    reviewName: 'Holiday Pay Calculator',
    focus: 'holiday compensation planning and premium-shift visibility',
    concept: 'holiday pay',
    researchFocus: 'base holiday pay, worked-holiday premiums, and policy-driven holiday compensation',
    aboutParagraphs: [
      'This calculator is built for the practical payroll question of how holiday compensation changes when a worker receives base holiday pay, worked-holiday premium pay, or both.',
      'Holiday pay often depends more on employer policy, contract terms, or local rules than on one universal federal formula, which is why a useful calculator needs to separate each layer instead of blending them together.',
      'The advanced version keeps base holiday pay, worked-holiday compensation, total holiday pay, and effective holiday rate in the same result so the premium effect is easier to understand.',
    ],
    stepTips: [
      'Enter the base hourly rate first, then add any hours that will be paid as standard holiday time even if no work is performed.',
      'Add worked-holiday hours separately so the premium portion of the shift does not get buried inside the total.',
      'Use the holiday multiplier that reflects your employer policy, contract, or scenario assumption.',
      'Open the popup and compare the base holiday layer with the work-performed layer before reading the total compensation number.',
    ],
    dashboardTips: [
      'Base holiday compensation separate from worked-holiday pay.',
      'Worked-holiday premium pay based on the multiplier you entered.',
      'Effective holiday hourly rate for the worked hours.',
      'Total holiday compensation for the full scenario.',
    ],
    features: [
      'Base holiday pay and worked-holiday pay in one screen',
      'Editable premium multiplier for policy or contract scenarios',
      'Effective holiday hourly rate for easier interpretation',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on holiday-pay interpretation, not just arithmetic',
      'References tied to labor guidance and policy context',
    ],
    decisionCards: [
      card('If holiday work pay dominates the result', 'The premium shift itself may be the major budget driver, not the base holiday allowance.'),
      card('If the total seems higher than expected', 'Check whether the scenario includes both base holiday time and worked-holiday premium hours.'),
      card('If the policy differs by department or union status', 'Use separate runs so each rule set is evaluated cleanly.'),
      card('If employees are comparing holiday assignments', 'The effective holiday rate helps show the true value of taking the shift.'),
    ],
    quickRows: [
      row('Base holiday pay', 'Hourly Rate x Base Holiday Hours', 'Shows the non-worked holiday compensation layer.'),
      row('Holiday work pay', 'Hourly Rate x Holiday Hours Worked x Multiplier', 'Measures the premium portion of a worked holiday shift.'),
      row('Total holiday compensation', 'Base Holiday Pay + Holiday Work Pay', 'Combines both layers into one scenario total.'),
      row('Effective holiday rate', 'Holiday Work Pay / Holiday Hours Worked', 'Shows what the worked hours effectively paid.'),
    ],
    references: [REF.dolHoliday, REF.dolOvertime, REF.irsPub15],
    understanding: [
      card('Holiday pay is often policy-driven', 'Federal law does not generally require paid holidays or premium holiday rates, so employer rules matter.'),
      card('Worked holidays and paid holidays are different concepts', 'One can exist without the other, and some scenarios combine both.'),
      card('The multiplier is the real lever', 'Once hours are defined, the premium rate determines how quickly holiday cost rises.'),
      card('Separate layers make audits easier', 'Breaking the result into base and premium components makes payroll checks more practical.'),
    ],
    faqs: [
      faq('Is holiday pay required under federal law?', 'Not generally. Holiday pay is often determined by employer policy, collective bargaining, or state and local rules.', 'Rules'),
      faq('Why separate base holiday hours and worked-holiday hours?', 'Because they represent different compensation layers and may be paid under different rules.', 'Method'),
      faq('Can I use this for double time or custom premiums?', 'Yes. Change the holiday multiplier to fit the scenario you want to test.', 'Use Cases'),
    ],
  }),
  'severance-pay': cfg({
    title: 'Severance Pay Calculator',
    subtitle: 'Estimate weeks of severance pay, PTO payout, weekly salary equivalent, and total separation package',
    cta: 'Calculate Severance Pay',
    reviewName: 'Severance Pay Calculator',
    focus: 'separation-package planning and length-of-service modeling',
    concept: 'severance pay',
    researchFocus: 'weeks-per-year-of-service formulas, PTO payout, and separation package structure',
    aboutParagraphs: [
      'This calculator is built for a common HR scenario: estimating what a severance package may look like when it is based on years of service and a weeks-of-pay formula.',
      'A useful severance tool has to move beyond one total number and show the pieces that typically drive the package, especially weekly salary equivalent, severance weeks, severance pay, and any PTO payout layer.',
      'That makes the result easier to use for policy design, offboarding planning, and employee communication while still staying transparent about the assumptions behind the estimate.',
    ],
    stepTips: [
      'Enter annual salary and the work-year assumptions first so the weekly pay equivalent is grounded in the compensation structure you actually use.',
      'Add years of service and the severance-weeks-per-year formula that reflects policy, contract, or scenario planning.',
      'Include unused PTO hours if you want the result to show a broader separation package instead of severance alone.',
      'Open the popup dashboard and read severance pay separately from PTO payout before interpreting the total package.',
    ],
    dashboardTips: [
      'Weekly salary equivalent used for the severance formula.',
      'Total severance weeks driven by service and policy assumptions.',
      'Severance pay and PTO payout displayed as separate layers.',
      'Total separation package shown as the combined result.',
    ],
    features: [
      'Weeks-of-pay severance modeling tied to years of service',
      'Optional PTO payout layer for fuller package planning',
      'Weekly salary equivalent shown clearly, not hidden',
      'Popup-only advanced dashboard consistent with the site standard',
      'Useful for policy review, scenario planning, and employee communication',
      'Original severance content with official labor references',
    ],
    decisionCards: [
      card('If the package grows sharply with tenure', 'The weeks-per-year rule may be generous and worth stress-testing across long-service cases.'),
      card('If PTO payout materially changes the total', 'Final-pay policy may be doing more work than severance policy alone.'),
      card('If leaders focus only on total package', 'Reviewing severance and PTO separately usually leads to clearer decisions.'),
      card('If the scenario is legally sensitive', 'Treat this tool as a planning estimate, then confirm final package terms through policy and counsel.'),
    ],
    quickRows: [
      row('Weekly salary equivalent', 'Annual Salary / Weeks Per Year', 'Creates the weekly pay baseline used in the severance formula.'),
      row('Severance weeks', 'Years of Service x Weeks per Year of Service', 'Shows the policy-driven duration of severance pay.'),
      row('Severance pay', 'Weekly Salary x Severance Weeks', 'Estimates the main cash portion of the package.'),
      row('Total package', 'Severance Pay + PTO Payout', 'Combines severance and unused leave into one total estimate.'),
    ],
    references: [REF.dolSeverance, REF.dolPaidLeave, REF.irsPub15],
    understanding: [
      card('Severance is usually a policy or agreement issue', 'Federal law does not generally require severance pay, which is why package terms vary widely by employer.'),
      card('Service formulas shape cost quickly', 'A small increase in weeks per year of service can materially change employer exposure across a workforce.'),
      card('PTO payout can change the conversation', 'In some cases, the leave payout is a major part of the total separation economics.'),
      card('Separation planning needs transparency', 'Breaking the package into clear components is usually more useful than presenting one combined total.'),
    ],
    faqs: [
      faq('Is severance pay required by federal law?', 'No. Severance is generally a matter of employer policy, contract, or agreement rather than a universal federal requirement.', 'Rules'),
      faq('Why include PTO payout in a severance calculator?', 'Because many separation discussions are really about the total package, not severance cash alone.', 'Method'),
      faq('Can this replace legal or policy review?', 'No. It is a planning tool. Final severance terms should still be confirmed against policy, agreements, and applicable law.', 'Scope'),
    ],
  }),
  'employee-turnover-cost': cfg({
    title: 'Employee Turnover Cost Calculator',
    subtitle: 'Estimate recruiting, onboarding, ramp-loss, and transition costs tied to replacing one employee',
    cta: 'Calculate Turnover Cost',
    reviewName: 'Employee Turnover Cost Calculator',
    focus: 'replacement-cost visibility and retention-priority planning',
    concept: 'employee turnover cost',
    researchFocus: 'replacement spend, onboarding cost, ramp-to-productivity loss, and transition drag on management time',
    aboutParagraphs: [
      'This calculator is designed for a question that often gets underestimated: how much one employee departure really costs once replacement and ramp-up friction are counted.',
      'A shallow turnover-cost estimate usually stops at recruiting spend, but in many teams the bigger losses come from onboarding cost, productivity drag, manager time, and the delay before a replacement reaches full output.',
      'This advanced version keeps those cost layers separate so retention discussions can be grounded in visible economics instead of vague statements about attrition being expensive.',
    ],
    stepTips: [
      'Start with the recruiting-cost inputs so the external and internal replacement spend is visible from the beginning.',
      'Add onboarding and training cost next, then estimate the productivity ramp period for the replacement employee.',
      'Use manager transition hours to capture real internal time lost to interviewing, handoff, coaching, and issue resolution.',
      'Open the popup dashboard and compare the total turnover cost with the cost-as-a-share-of-salary metric before drawing conclusions.',
    ],
    dashboardTips: [
      'Recruiting cost, onboarding cost, and manager transition cost separated clearly.',
      'Productivity-ramp loss shown as a direct economic layer.',
      'Total turnover cost for the employee replacement scenario.',
      'Cost as a percentage of salary so the number is easier to benchmark.',
    ],
    features: [
      'Recruiting, onboarding, ramp-loss, and manager-transition cost in one model',
      'Cost-as-a-share-of-salary benchmark',
      'Better replacement-cost visibility than a single turnover guess',
      'Popup-only advanced dashboard matching the approved structure',
      'Useful for retention planning, headcount budgeting, and leadership reviews',
      'Original long-form content tailored to turnover decisions',
    ],
    decisionCards: [
      card('If productivity-ramp loss is the largest cost', 'Retention or onboarding improvements may create a bigger return than negotiating cheaper recruiting vendors.'),
      card('If manager transition cost keeps rising', 'Process friction around interviewing and ramping may be amplifying the cost of each departure.'),
      card('If turnover cost approaches a large share of salary', 'Even a modest retention improvement could create a meaningful savings opportunity.'),
      card('If leaders only track recruiting invoices', 'The result helps show why replacement cost is usually wider than external spend alone.'),
    ],
    quickRows: [
      row('Recruiting cost', 'Fees + Boards + Checks + Travel', 'Captures direct replacement spend.'),
      row('Onboarding and training', 'Onboarding Cost + Training Cost', 'Shows the cost of preparing the replacement employee.'),
      row('Ramp loss', 'Productivity Ramp Days x Daily Productivity Cost', 'Approximates lost value while the new hire ramps.'),
      row('Turnover cost', 'Recruiting + Onboarding + Ramp Loss + Manager Transition', 'Shows the full modeled replacement cost.'),
    ],
    references: [REF.blsEcec, REF.blsBenefits, REF.linkedInMetrics],
    understanding: [
      card('Turnover cost usually extends beyond recruiting', 'Replacement is expensive because productivity and internal time are often the largest hidden layers.'),
      card('Ramp assumptions matter a lot', 'A longer productivity ramp can change turnover economics more than modest shifts in recruiting cost.'),
      card('Salary context helps benchmark the result', 'Expressing turnover cost as a share of pay makes it easier to compare across roles and teams.'),
      card('Retention math becomes clearer with visible components', 'When leaders can see which layer is largest, retention strategy becomes more targeted.'),
    ],
    faqs: [
      faq('What costs are usually included in employee turnover cost?', 'Common layers include recruiting spend, onboarding and training cost, lost productivity during ramp-up, and manager transition time.', 'Method'),
      faq('Why compare turnover cost to salary?', 'Because it gives leaders a simple way to benchmark whether replacement friction is modest or strategically significant.', 'Interpretation'),
      faq('Is this an exact accounting measure?', 'No. It is a structured planning model that helps quantify replacement economics before deeper financial review.', 'Scope'),
    ],
  }),
  'recruitment-cost': cfg({
    title: 'Recruitment Cost Calculator',
    subtitle: 'Estimate direct recruiting spend, interview-time cost, total hiring spend, and cost per hire',
    cta: 'Calculate Recruitment Cost',
    reviewName: 'Recruitment Cost Calculator',
    focus: 'cost-per-hire visibility and hiring-efficiency planning',
    concept: 'recruitment cost',
    researchFocus: 'direct sourcing spend, interviewer time cost, total hiring cost, and cost per hire',
    aboutParagraphs: [
      'This calculator is designed to measure what a hiring effort really costs once both external spend and internal interview time are counted.',
      'A basic cost-per-hire estimate often misses the internal labor side of recruiting, which can materially change the economics of a search even when vendor invoices look manageable.',
      'The advanced version keeps direct spend, interview-time cost, total recruiting cost, and cost per hire together so teams can judge efficiency with more confidence.',
    ],
    stepTips: [
      'Add direct recruiting spend first, including recruiter fees, job boards, checks, and travel costs if they apply.',
      'Estimate internal interview hours and the blended hourly cost of the people involved so internal labor is not omitted.',
      'Enter the number of hires you expect from the campaign or period being analyzed.',
      'Open the popup dashboard and read total recruitment spend alongside cost per hire before comparing channels or vendors.',
    ],
    dashboardTips: [
      'Direct external recruiting spend kept visible as its own layer.',
      'Interview-time cost calculated from hours and interviewer cost.',
      'Total hiring spend for the campaign or period.',
      'Cost per hire for cleaner vendor and channel comparison.',
    ],
    features: [
      'Direct spend and internal interview-time cost in one model',
      'Cost per hire built from planned hires, not just spend',
      'Useful for budget planning, vendor review, and channel analysis',
      'Popup-only advanced dashboard aligned with the approved pattern',
      'Original long-form content tuned for recruiting operations',
      'References grounded in public recruiting-metrics guidance',
    ],
    decisionCards: [
      card('If cost per hire looks high', 'The issue may be low hiring volume, not just high spend. Fixed recruiting effort can weigh heavily on small hiring plans.'),
      card('If internal interview time rivals external spend', 'Process design and interviewer load may deserve as much attention as vendor pricing.'),
      card('If direct spend looks efficient but total cost does not', 'Internal labor is likely doing more work in the model than leadership sees.'),
      card('If channels are hard to compare', 'Use separate runs for each recruiting mix so the cost-per-hire result remains clean.'),
    ],
    quickRows: [
      row('Direct recruiting spend', 'Fees + Boards + Checks + Travel', 'Captures the external cash spend tied to hiring.'),
      row('Interview-time cost', 'Interview Hours x Interviewer Hourly Cost', 'Shows internal labor consumed by the recruiting process.'),
      row('Total recruitment cost', 'Direct Spend + Interview-Time Cost', 'Measures total modeled recruiting effort.'),
      row('Cost per hire', 'Total Recruitment Cost / Hires', 'Useful for comparing hiring efficiency across campaigns.'),
    ],
    references: [REF.linkedInMetrics, REF.blsEcec, REF.irsPub15],
    understanding: [
      card('Cost per hire is a denominator game too', 'Even modest spend can look expensive when hiring volume is low.'),
      card('Internal labor is often invisible', 'Interview coordination and manager time can be a major part of recruiting cost without showing up in vendor invoices.'),
      card('Channel comparisons need a common frame', 'Cost per hire is more useful when each sourcing approach is measured the same way.'),
      card('A clean cost view supports better recruiting choices', 'When total hiring cost is visible, teams can judge whether speed or efficiency is driving the process.'),
    ],
    faqs: [
      faq('What is cost per hire?', 'Cost per hire is the total recruiting cost for a period or campaign divided by the number of hires made from that effort.', 'Basics'),
      faq('Why include interviewer time cost?', 'Because hiring consumes internal labor, and ignoring it can make recruiting look cheaper than it really is.', 'Method'),
      faq('Can this be used for one role or many roles?', 'Yes. It works for either, as long as the spend and hire count belong to the same hiring scope.', 'Use Cases'),
    ],
  }),
  'training-roi': cfg({
    title: 'Training ROI Calculator',
    subtitle: 'Estimate total training cost, total annual benefit, net benefit, ROI percentage, and payback period',
    cta: 'Calculate Training ROI',
    reviewName: 'Training ROI Calculator',
    focus: 'learning-investment evaluation and payback visibility',
    concept: 'training ROI',
    researchFocus: 'program cost, employee time cost, productivity benefit, quality savings, retention savings, and payback timing',
    aboutParagraphs: [
      'This calculator is built for one of the hardest L&D conversations: whether a training program is creating enough measurable value to justify its cost.',
      'A useful training ROI model has to count more than the vendor invoice. Employee time spent in training is also a cost, while productivity, error reduction, and retention gains often form the benefit side of the equation.',
      'The advanced version keeps those pieces visible so the result can support budgeting and prioritization rather than acting like a black-box ROI percentage.',
    ],
    stepTips: [
      'Enter the direct program cost first, then add employee training hours and a realistic hourly labor cost so time in training is priced in.',
      'Estimate the annual benefits you expect from improved productivity, fewer errors, and better retention.',
      'Open the popup dashboard and compare total training cost, annual benefit, net benefit, and payback period before focusing on the ROI percentage alone.',
      'If benefits are uncertain, run multiple scenarios so you can see what level of improvement is required to justify the investment.',
    ],
    dashboardTips: [
      'Total training cost including direct spend and employee time cost.',
      'Total annual benefit from productivity, quality, and retention assumptions.',
      'Net benefit shown separately from ROI percentage.',
      'Payback period to show how quickly the modeled gains recover the investment.',
    ],
    features: [
      'Training program cost and employee time cost in one model',
      'Multiple benefit categories instead of one vague gain assumption',
      'Net benefit and payback period in addition to ROI percentage',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Useful for L&D budgeting and business-case conversations',
      'Original content with verified reference links',
    ],
    decisionCards: [
      card('If ROI looks strong but payback is slow', 'The program may still be attractive, but cash timing should be part of the decision.'),
      card('If employee time cost is larger than expected', 'Operational disruption may matter almost as much as the vendor fee.'),
      card('If retention savings drive most of the value', 'The training case may depend on whether it actually improves stay rates in the target group.'),
      card('If benefits are hard to estimate', 'Scenario testing is usually more honest than pretending one exact ROI figure is certain.'),
    ],
    quickRows: [
      row('Employee time cost', 'Training Hours x Employee Hourly Rate', 'Captures the labor cost of time spent in training.'),
      row('Total training cost', 'Program Cost + Employee Time Cost', 'Shows the full modeled investment.'),
      row('Training ROI', '(Net Benefit / Total Training Cost) x 100', 'Measures the return on the modeled training investment.'),
      row('Payback period', '(Total Training Cost / Annual Benefit) x 12', 'Converts the recovery period into months.'),
    ],
    references: [REF.panoptoTrainingRoi, REF.blsEcec, REF.blsBenefits],
    understanding: [
      card('ROI depends on what you count as benefit', 'Training becomes easier to defend when benefits are tied to specific outcomes such as productivity, quality, or retention.'),
      card('Employee time is part of the investment', 'Ignoring time away from normal work can materially overstate training ROI.'),
      card('Payback gives management a different lens', 'A program can have a positive ROI while still taking longer than leadership wants to recover its cost.'),
      card('This is a planning model, not a proof engine', 'The strongest use is prioritizing which programs merit rollout and measurement.'),
    ],
    faqs: [
      faq('How do you calculate training ROI?', 'A common approach is total quantified benefits minus total training cost, divided by total training cost, expressed as a percentage.', 'Method'),
      faq('Why include employee time cost?', 'Because employees are not free to train. Time in training usually replaces productive work or requires backfill.', 'Inputs'),
      faq('Is retention savings too speculative to use?', 'It can be uncertain, but it is still worth modeling if training is expected to improve retention meaningfully.', 'Interpretation'),
    ],
  }),
  'benefits-cost': cfg({
    title: 'Benefits Cost Calculator',
    subtitle: 'Estimate annual benefit spend, retirement match, payroll-tax load, and loaded compensation in one view',
    cta: 'Calculate Benefits Cost',
    reviewName: 'Benefits Cost Calculator',
    focus: 'benefits-package budgeting and loaded compensation planning',
    concept: 'benefits cost',
    researchFocus: 'health coverage, retirement match, payroll taxes, and total employer compensation',
    aboutParagraphs: [
      'This calculator is built for the budgeting question behind almost every compensation discussion: how much the benefits package adds on top of salary.',
      'A salary figure alone rarely reflects the true employer commitment because health coverage, retirement match, payroll taxes, and other benefits can create a large additional cost layer.',
      'The advanced version keeps those components visible so loaded compensation is easier to understand for offers, renewals, budgeting, and workforce planning.',
    ],
    stepTips: [
      'Enter annual salary first so the calculator can size payroll-tax and retirement-match assumptions correctly.',
      'Add health insurance cost, retirement match percentage, payroll-tax rate, and any other annual benefit spend you want to include.',
      'Open the popup dashboard and compare annual benefits cost with total loaded compensation before making package changes.',
      'If you are comparing multiple benefit designs, rerun the calculator with the same salary and different benefit assumptions so the tradeoff is clear.',
    ],
    dashboardTips: [
      'Annual benefits cost as the headline output.',
      'Health, retirement, payroll-tax, and other benefits shown separately.',
      'Loaded compensation for a full employer-cost view.',
      'Cleaner package comparison than a salary-only screen.',
    ],
    features: [
      'Benefits package cost layered by major component',
      'Retirement match and employer payroll taxes included',
      'Loaded compensation output for better budgeting',
      'Popup-only advanced dashboard that matches the approved design',
      'Useful for offer planning, renewals, and workforce modeling',
      'Original benefits content tied to labor-cost data',
    ],
    decisionCards: [
      card('If benefits cost is close to a third of salary', 'The package may still be normal, but it deserves explicit budgeting rather than being treated as background overhead.'),
      card('If retirement match is a small share of total benefits', 'Health coverage or payroll taxes may be the dominant cost drivers.'),
      card('If loaded compensation surprises leaders', 'The result can help reset expectations before salary bands or hiring plans are finalized.'),
      card('If you are comparing cash versus benefits-heavy offers', 'Loaded compensation gives a more complete side-by-side view of employer spend.'),
    ],
    quickRows: [
      row('Retirement match', 'Annual Salary x Match Percent', 'Converts a match rate into an annual employer cost.'),
      row('Employer payroll taxes', 'Annual Salary x Employer Payroll Tax Rate', 'Adds payroll taxes to the benefits stack.'),
      row('Total benefits cost', 'Health + Retirement Match + Payroll Taxes + Other Benefits', 'Measures total annual benefits spend.'),
      row('Loaded compensation', 'Salary + Total Benefits Cost', 'Shows the combined annual employer commitment.'),
    ],
    references: [REF.blsEcec, REF.blsBenefits, REF.irsPub15B],
    understanding: [
      card('Benefits are a major share of compensation', 'In many organizations, benefits and payroll taxes add a substantial layer beyond base pay.'),
      card('Loaded compensation is the better budget number', 'It is often more useful than salary when forecasting headcount affordability.'),
      card('Benefit design changes package economics quickly', 'A richer health plan or match policy can move employer cost materially even when salary is unchanged.'),
      card('The mix matters as much as the total', 'Knowing whether health, retirement, or taxes drive the package helps leaders make smarter changes.'),
    ],
    faqs: [
      faq('What is loaded compensation?', 'Loaded compensation is salary plus the employer cost of benefits and payroll taxes tied to that role.', 'Basics'),
      faq('Why include payroll taxes in a benefits calculator?', 'Because employers often think about the full non-salary cost stack together when budgeting compensation.', 'Method'),
      faq('Can this compare two benefits packages?', 'Yes. Run the calculator with the same salary and change the benefit assumptions to compare package cost.', 'Use Cases'),
    ],
  }),
  'workers-comp': cfg({
    title: "Workers' Comp Calculator",
    subtitle: "Estimate manual premium, experience-modified premium, discount effect, and final workers' comp premium",
    cta: "Calculate Workers' Comp",
    reviewName: "Workers' Comp Calculator",
    focus: "workers' compensation premium planning and experience-mod visibility",
    concept: "workers' compensation premium",
    researchFocus: 'payroll exposure, rate per $100, experience modification, and premium adjustments',
    aboutParagraphs: [
      "This calculator is built for the premium-planning side of workers' compensation, where payroll exposure, class rates, claims history, and discounts all shape the final insurance cost.",
      "A useful workers' comp screen should separate the manual premium from the experience-modified premium so employers can see how claims history and pricing adjustments change the total.",
      "The advanced version keeps payroll exposure, manual premium, experience modification, discount effect, and final premium in one result so policy cost is easier to explain and budget.",
    ],
    stepTips: [
      "Enter total annual payroll first, then the applicable rate per $100 of payroll for the class or blended scenario you want to test.",
      "Add the experience modification factor to show how claims history moves the premium above or below the manual baseline.",
      "Use the discount field for any premium discount assumption you want to model after the experience mod is applied.",
      "Open the popup dashboard and compare manual premium with the modified premium before reading the final discounted result.",
    ],
    dashboardTips: [
      'Manual premium from payroll exposure and rate per $100.',
      'Experience-modified premium shown as a separate layer.',
      'Discount effect visible rather than baked into one final total.',
      'Final premium for budgeting and renewal conversations.',
    ],
    features: [
      'Manual premium, experience mod, and final premium in one run',
      'Rate-per-$100 payroll structure consistent with real premium framing',
      'Discount layer visible for cleaner interpretation',
      'Popup-only advanced dashboard that matches the approved pattern',
      'Useful for budgeting, broker conversations, and renewal screening',
      'Original content supported by verified premium references',
    ],
    decisionCards: [
      card('If the experience mod is pushing cost materially higher', 'Claims history may be a bigger lever than payroll growth in the next renewal cycle.'),
      card('If the discount is doing a lot of work', 'The pre-discount premium structure still deserves attention because discounts can change at renewal.'),
      card('If payroll exposure is rising faster than expected', 'Headcount growth or wage increases may be affecting premium more than rate movement alone.'),
      card('If the manual premium seems low but final premium does not', 'Modification and policy adjustments may be driving the difference.'),
    ],
    quickRows: [
      row('Manual premium', '(Annual Payroll / 100) x Rate per 100', 'Creates the baseline premium before experience modification.'),
      row('Modified premium', 'Manual Premium x Experience Mod', 'Shows how claims history changes the premium.'),
      row('Final premium', 'Modified Premium x (1 - Discount Percent)', 'Applies the modeled discount to the modified premium.'),
      row('Experience mod', 'Modified Premium / Manual Premium', "Shows how much claims history is shifting workers' comp cost."),
    ],
    references: [REF.waWorkersComp, REF.blsEcec, REF.blsBenefits],
    understanding: [
      card("Workers' comp pricing starts with payroll exposure", 'Premium math usually begins with payroll and a rate that reflects the risk profile of the work.'),
      card('Experience modification is often the key swing factor', 'Claims history can move premium significantly even when payroll and base rates stay stable.'),
      card('Discounts should not hide underlying cost', 'It is useful to know what the premium looks like before credits or discounts are layered in.'),
      card('This is a planning screen, not a quote engine', "Actual workers' comp premiums can change with class codes, audits, minimums, and state-specific rules."),
    ],
    faqs: [
      faq("How is workers' comp premium commonly estimated?", "A common first-pass method uses payroll divided by 100, multiplied by a class rate, then adjusted by the experience mod and any discounts.", 'Method'),
      faq('What is an experience mod?', 'It is a factor that adjusts premium based on loss experience relative to expected experience for similar employers.', 'Basics'),
      faq('Can this replace an insurer quote?', 'No. It is a planning estimate. Actual premium can vary based on class-code splits, audits, state rules, and policy structure.', 'Scope'),
    ],
  }),
  fte: cfg({
    title: 'FTE Calculator',
    subtitle: 'Convert total hours worked into full-time equivalents using your chosen full-time hours standard',
    cta: 'Calculate FTE',
    reviewName: 'FTE Calculator',
    focus: 'staffing-capacity measurement and full-time-equivalent planning',
    concept: 'full-time equivalent staffing',
    researchFocus: 'hours-based staffing capacity, full-time hours standards, and FTE interpretation for planning and compliance',
    aboutParagraphs: [
      'This calculator is built for workforce planning teams that need to translate hours worked into full-time equivalents instead of relying on raw headcount alone.',
      'FTE is useful because headcount can be misleading when schedules vary. A team of part-time workers can represent fewer or more full-time equivalents than the number of names on the roster suggests.',
      'The advanced version keeps the chosen hours standard visible and connects total hours worked with FTE count and a 30-hours-per-week benchmark so staffing capacity can be interpreted more clearly.',
    ],
    stepTips: [
      'Enter the total hours worked for the period or annual horizon you want to analyze, then make sure the full-time hours standard matches that same period.',
      'Use a standard such as annual hours for budgeting or a policy-specific standard if your organization defines full-time work differently.',
      'Open the popup dashboard and read FTE count alongside the hours-standard inputs so the result is not interpreted as simple headcount.',
      'If you are using the calculator for threshold planning, rerun it with different hours assumptions to see how sensitive the team is to schedule changes.',
    ],
    dashboardTips: [
      'Estimated FTE count based on total hours and the chosen standard.',
      'Hours standard shown clearly so the FTE divisor stays transparent.',
      'Hours-worked context kept visible in the same run.',
      '30-hours-per-week benchmark included as a secondary staffing lens.',
    ],
    features: [
      'Hours-to-FTE conversion with an editable full-time standard',
      'Useful for staffing plans, budgeting, and workload normalization',
      '30-hours-per-week benchmark shown as a secondary reference point',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on staffing capacity rather than generic headcount',
      'Official ACA reference support for FTE interpretation',
    ],
    decisionCards: [
      card('If headcount feels high but FTE count feels low', 'The workforce may rely more heavily on part-time capacity than the roster suggests.'),
      card('If FTE count is close to a planning threshold', 'Small shifts in hours or schedule design can materially change staffing classification or budget assumptions.'),
      card('If leaders are mixing headcount and FTE in the same discussion', 'Use this result to reset the conversation around capacity rather than names on payroll.'),
      card('If the period standard is inconsistent', 'Match total hours and full-time hours to the same period before trusting the output.'),
    ],
    quickRows: [
      row('FTE count', 'Total Hours Worked / Full-Time Hours Standard', 'Measures staffing capacity in full-time-equivalent units.'),
      row('Hours standard', 'Organization or policy-defined full-time hours', 'This divisor determines what one FTE means in your model.'),
      row('ACA-style monthly FTE proxy', 'Monthly Non-Full-Time Hours / 120', 'A common compliance-oriented benchmark for certain ACA determinations.'),
      row('30-hour annual benchmark', 'Total Hours Worked / 1,560', 'Provides a secondary reference point based on 30 hours per week across 52 weeks.'),
    ],
    references: [REF.irsAle, REF.blsEcec, REF.blsBenefits],
    understanding: [
      card('FTE is a capacity measure', 'It is meant to describe labor capacity, not simply how many employees are on payroll.'),
      card('The hours standard defines the answer', 'Different organizations can produce different FTE counts from the same hours if they use different full-time definitions.'),
      card('Compliance and budgeting use FTE differently', 'The same concept can support workload planning, ACA-style thresholds, and labor-cost forecasting, but the divisor may change.'),
      card('Headcount and FTE should not be treated as interchangeable', 'A team of 10 people is not necessarily 10 FTE, which is why hours-based normalization is useful.'),
    ],
    faqs: [
      faq('What does FTE mean?', 'FTE stands for full-time equivalent. It expresses labor capacity in units of one full-time workload.', 'Basics'),
      faq('Why can FTE be lower than headcount?', 'Because multiple part-time employees may combine into fewer whole full-time equivalents.', 'Interpretation'),
      faq('Does this calculator determine ACA status by itself?', 'No. It is a planning tool. Formal ACA determinations still depend on the official rules and monthly measurement approach.', 'Scope'),
    ],
  }),
};
