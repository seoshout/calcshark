"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  Leaf,
  MessageSquare,
  PiggyBank,
  RefreshCw,
  Route,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import CalculatorReview from "@/components/ui/calculator-review";
import FAQAccordion, { FAQItem } from "@/components/ui/faq-accordion";

export type RetirementVariant =
  | "retirement-savings"
  | "401k"
  | "ira"
  | "roth-ira-conversion"
  | "social-security-estimator"
  | "retirement-income"
  | "catch-up-contribution"
  | "required-minimum-distribution"
  | "pension"
  | "annuity"
  | "early-retirement"
  | "fire"
  | "retirement-withdrawal"
  | "life-expectancy"
  | "retirement-gap";

interface Props {
  variant: RetirementVariant;
}

interface Inputs {
  currentAge: string;
  retirementAge: string;
  currentBalance: string;
  annualContribution: string;
  monthlyContribution: string;
  annualReturn: string;
  inflation: string;
  salary: string;
  employeeContributionPercent: string;
  employerMatchPercent: string;
  employerMatchCapPercent: string;
  annualSpending: string;
  withdrawalRate: string;
  taxRateNow: string;
  taxRateRetirement: string;
  claimAge: string;
  socialSecurityMonthly: string;
  pensionMonthly: string;
  annuityPrincipal: string;
  annuityRate: string;
  annuityYears: string;
  finalAverageSalary: string;
  yearsOfService: string;
  pensionMultiplier: string;
  catchUpPlanType: string;
  healthRating: string;
  gender: string;
  familyHistoryAdjustment: string;
  smoker: string;
  yearsInRetirement: string;
  expectedOtherIncome: string;
}

interface ResultMetric {
  label: string;
  value: number;
  currency?: boolean;
  suffix?: string;
}

interface Result {
  primaryLabel: string;
  primaryValue: number;
  primaryCurrency?: boolean;
  metrics: ResultMetric[];
  notes: string[];
  warnings: string[];
}

interface QuickRow {
  category: string;
  range: string;
  notes: string;
}

interface Config {
  title: string;
  subtitle: string;
  reviewName: string;
  focus: string;
  researchFocus: string;
  quickRows: QuickRow[];
  faqs: FAQItem[];
}

const quick = (category: string, range: string, notes: string): QuickRow => ({
  category,
  range,
  notes,
});

const faq = (question: string, answer: string, category: string): FAQItem => ({
  question,
  answer,
  category,
});

const CONFIG: Record<RetirementVariant, Config> = {
  "retirement-savings": {
    title: "Retirement Savings Calculator",
    subtitle: "Project nest egg growth, real value, and retirement-income support",
    reviewName: "Retirement Savings Calculator",
    focus: "long-range retirement accumulation",
    researchFocus: "balance, savings pace, inflation, and spending support",
    quickRows: [
      quick("Working horizon", "Years to retirement", "Longer saving windows usually matter as much as return assumptions."),
      quick("Withdrawal lens", "Around 3% to 5%", "Retirement readiness is easier to read when framed as income support."),
      quick("Inflation drag", "Persistent", "Nominal balances can overstate future spending power."),
    ],
    faqs: [
      faq("Why does inflation matter?", "Because a future balance can look large while buying much less in real spending terms.", "Basics"),
      faq("Why show income support and not just a balance?", "Because most retirement decisions are really spending decisions, not account-size contests.", "Planning"),
    ],
  },
  "401k": {
    title: "401(k) Calculator",
    subtitle: "Estimate deferrals, employer match, projected balance, and income support",
    reviewName: "401(k) Calculator",
    focus: "workplace-plan accumulation and employer match value",
    researchFocus: "salary deferrals, employer match, 2026 limits, and compounding",
    quickRows: [
      quick("2026 employee limit", "$24,500", "Standard elective deferral limit announced by the IRS for 2026."),
      quick("2026 catch-up", "$8,000 or $11,250", "Higher age-based catch-up room can materially change late-career saving."),
      quick("Employer match", "Plan-specific", "Missing available match dollars usually weakens the plan immediately."),
    ],
    faqs: [
      faq("Why is the employer match so important?", "Because it raises the effective savings rate immediately and compounds for years.", "Basics"),
      faq("Why compare deferral rate with the annual cap?", "Because many savers want to know whether they are using only part of the available tax-advantaged room.", "Planning"),
    ],
  },
  "ira": {
    title: "IRA Calculator",
    subtitle: "Project IRA growth, contribution use, and retirement-income support",
    reviewName: "IRA Calculator",
    focus: "individual retirement account accumulation",
    researchFocus: "IRA contribution caps, compounding, and income support",
    quickRows: [
      quick("2026 IRA limit", "$7,500", "IRS raised the annual IRA contribution limit for 2026."),
      quick("2026 catch-up", "$1,100", "Age 50+ savers may have additional IRA room in 2026."),
      quick("Tax wrapper", "Traditional or Roth context", "Tax timing can matter even when the investment math looks similar."),
    ],
    faqs: [
      faq("Why does the annual contribution cap matter?", "Because each year of tax-advantaged saving room is valuable over a long compounding horizon.", "Basics"),
      faq("Can an IRA still matter if I have a 401(k)?", "Often yes, depending on plan quality, eligibility, and tax strategy.", "Planning"),
    ],
  },
  "roth-ira-conversion": {
    title: "Roth IRA Conversion Calculator",
    subtitle: "Compare conversion tax now with possible after-tax value later",
    reviewName: "Roth IRA Conversion Calculator",
    focus: "pay-tax-now versus pay-tax-later retirement planning",
    researchFocus: "current tax rate, future tax rate, conversion tax, and after-tax value",
    quickRows: [
      quick("Conversion tax", "Due now", "A pretax-to-Roth conversion generally creates current-year taxable income."),
      quick("Future tax tradeoff", "Case by case", "The key question is whether paying tax now improves the after-tax outcome later."),
      quick("Holding period", "Important", "Longer post-conversion periods give tax-free growth more time to matter."),
    ],
    faqs: [
      faq("Why can a Roth conversion help?", "Because future qualified Roth growth and withdrawals may avoid federal income tax.", "Basics"),
      faq("When can a conversion look weaker?", "When the current tax rate is meaningfully above the expected future tax rate or the tax bill would strain liquidity.", "Strategy"),
    ],
  },
  "social-security-estimator": {
    title: "Social Security Estimator Calculator",
    subtitle: "Estimate a planning-range monthly benefit using earnings and claim age",
    reviewName: "Social Security Estimator Calculator",
    focus: "benefit timing and retirement-income planning",
    researchFocus: "earnings, claim age, full retirement age, and replacement effects",
    quickRows: [
      quick("Earliest claim age", "62", "Claiming early generally reduces monthly retirement benefits."),
      quick("Full retirement age", "Around 66 to 67", "The exact age depends on birth year under current rules."),
      quick("Delayed credits", "Up to age 70", "Delaying can raise monthly benefits under current law."),
    ],
    faqs: [
      faq("Why is this only an estimator?", "Because official Social Security calculations depend on your actual earnings record and SSA formulas.", "Basics"),
      faq("Why does claim age matter so much?", "Because claiming before full retirement age usually lowers monthly benefits, while delaying can increase them.", "Timing"),
    ],
  },
  "retirement-income": {
    title: "Retirement Income Calculator",
    subtitle: "Blend portfolio withdrawals with Social Security, pension, and other income",
    reviewName: "Retirement Income Calculator",
    focus: "turning assets into spendable retirement cash flow",
    researchFocus: "withdrawal rate, guaranteed income, and spending gaps",
    quickRows: [
      quick("Income sources", "Multiple", "Retirement cash flow often depends on more than one source."),
      quick("Withdrawal lens", "Around 3% to 5%", "Portfolio withdrawals are often screened using a sustainability range."),
      quick("Income gap", "Critical", "The shortfall or cushion against spending is often the clearest summary."),
    ],
    faqs: [
      faq("Why combine portfolio withdrawals with Social Security and pension income?", "Because retirement spending is usually funded by a mix of sources, not a single stream.", "Basics"),
      faq("Why is the income gap more useful than the account balance alone?", "Because the real question is whether the combined income sources can support your spending target.", "Planning"),
    ],
  },
  "catch-up-contribution": {
    title: "Catch-up Contribution Calculator",
    subtitle: "Estimate additional 2026 retirement contribution room by age and account type",
    reviewName: "Catch-up Contribution Calculator",
    focus: "age-based additional retirement saving capacity",
    researchFocus: "2026 limits, catch-up rules, and remaining contribution room",
    quickRows: [
      quick("401(k) catch-up", "$8,000", "General 2026 catch-up amount for many age 50+ workplace-plan participants."),
      quick("Age 60-63 catch-up", "$11,250", "Some participants may have a higher catch-up band under current law."),
      quick("IRA catch-up", "$1,100", "The 2026 IRA catch-up amount is indexed under current rules."),
    ],
    faqs: [
      faq("Why are catch-up contributions important?", "Because they raise tax-advantaged saving capacity during the years when retirement is closer.", "Basics"),
      faq("Does extra catch-up room mean I am automatically on track?", "No. It improves capacity, but the broader retirement target still matters.", "Planning"),
    ],
  },
  "required-minimum-distribution": {
    title: "Required Minimum Distribution Calculator",
    subtitle: "Estimate annual RMD, monthly equivalent, and distribution percentage",
    reviewName: "Required Minimum Distribution Calculator",
    focus: "age-based required withdrawals from retirement accounts",
    researchFocus: "account balance, IRS lifetime divisors, and annual distribution planning",
    quickRows: [
      quick("RMD age", "Current-law dependent", "Required beginning age depends on current IRS retirement rules."),
      quick("Uniform Lifetime Table", "IRS basis", "Many RMD estimates use the Uniform Lifetime Table."),
      quick("Balance date", "Prior year end", "Actual RMDs often start from the prior year-end account value."),
    ],
    faqs: [
      faq("Why does the RMD amount rise with age?", "Because the IRS divisor generally falls as age increases, so a larger percentage of the account must be distributed.", "Basics"),
      faq("Why is this still an estimate?", "Because account type, beneficiaries, and other IRS rules can change real-world RMD obligations.", "Limits"),
    ],
  },
  pension: {
    title: "Pension Calculator",
    subtitle: "Estimate pension income from salary, service years, and multiplier assumptions",
    reviewName: "Pension Calculator",
    focus: "defined-benefit income planning",
    researchFocus: "final average salary, years of service, multiplier, and replacement value",
    quickRows: [
      quick("Core formula", "Salary x service x multiplier", "A common pension estimate starts with these three inputs."),
      quick("Replacement ratio", "Monthly or annual", "Many workers compare pension income to salary or retirement spending."),
      quick("Plan rules", "Specific", "Actual plans can include reductions, caps, or survivor options."),
    ],
    faqs: [
      faq("Why use final average salary?", "Because many defined-benefit plans base the benefit on final or highest average salary over a stated period.", "Basics"),
      faq("Why can my estimate differ from a plan statement?", "Because actual pension plans may use different averaging periods, vesting rules, or early-retirement adjustments.", "Limits"),
    ],
  },
  annuity: {
    title: "Annuity Calculator",
    subtitle: "Estimate monthly annuity income from principal, rate, and payout horizon",
    reviewName: "Annuity Calculator",
    focus: "turning a lump sum into a retirement paycheck estimate",
    researchFocus: "principal, payout rate, horizon, and monthly-income conversion",
    quickRows: [
      quick("Income focus", "Monthly", "Annuity planning often starts with the retirement paycheck question."),
      quick("Payout horizon", "Years or lifetime", "Longer payout periods generally lower the monthly amount for the same principal."),
      quick("Guarantee tradeoff", "Case by case", "More guaranteed income can reduce liquidity."),
    ],
    faqs: [
      faq("Why does the payout horizon change the monthly income so much?", "Because the same principal must be spread across a different number of payments when the horizon changes.", "Basics"),
      faq("Is this a quote for a real annuity contract?", "No. It is a planning estimate, not an insurer quote.", "Limits"),
    ],
  },
  "early-retirement": {
    title: "Early Retirement Calculator",
    subtitle: "Test whether the current savings pace can support an earlier retirement date",
    reviewName: "Early Retirement Calculator",
    focus: "retiring before a traditional timeline",
    researchFocus: "retirement age, spending target, withdrawal rate, and savings pace",
    quickRows: [
      quick("Earlier stop-work date", "Higher burden", "Retiring earlier usually means fewer saving years and more years to fund."),
      quick("Withdrawal sensitivity", "High", "A small change in the withdrawal-rate assumption can materially change the target portfolio."),
      quick("Bridge income", "Relevant", "Delays in Social Security or other income sources can matter more for early retirees."),
    ],
    faqs: [
      faq("Why is early retirement harder than standard retirement math?", "Because the plan usually has to support more years of spending with fewer years left for saving.", "Basics"),
      faq("Why does a conservative withdrawal rate matter more here?", "Because longer retirement horizons usually leave less room for aggressive spending assumptions.", "Planning"),
    ],
  },
  fire: {
    title: "FIRE Calculator",
    subtitle: "Estimate the financial-independence target, timeline, and current progress",
    reviewName: "FIRE Calculator",
    focus: "financial independence math and years-to-goal planning",
    researchFocus: "annual spending, savings pace, withdrawal rate, and timeline to independence",
    quickRows: [
      quick("FIRE number", "Spending / withdrawal rate", "The target portfolio is often based on annual spending divided by the chosen withdrawal rate."),
      quick("Savings rate", "Powerful", "FIRE timelines are often highly sensitive to annual savings pace."),
      quick("Lifestyle alignment", "Essential", "The spending target directly determines the required portfolio size."),
    ],
    faqs: [
      faq("What is the FIRE number?", "It is the portfolio size that may support annual spending based on the withdrawal rate you choose for planning.", "Basics"),
      faq("Is FIRE only about retiring extremely early?", "Not necessarily. Many people use FIRE math as a framework for flexibility and optional work.", "Strategy"),
    ],
  },
  "retirement-withdrawal": {
    title: "Retirement Withdrawal Calculator",
    subtitle: "Project withdrawal sustainability, depletion timing, and inflation pressure",
    reviewName: "Retirement Withdrawal Calculator",
    focus: "how long retirement assets may last once withdrawals begin",
    researchFocus: "starting balance, annual withdrawals, inflation, return assumptions, and depletion timing",
    quickRows: [
      quick("Sequence risk", "High", "Poor early returns can alter withdrawal sustainability more than long-run averages suggest."),
      quick("Inflation adjustment", "Critical", "Rising withdrawals can stress a portfolio faster than flat nominal withdrawals."),
      quick("Retirement length", "Important", "Longer retirement horizons increase the pressure on the withdrawal plan."),
    ],
    faqs: [
      faq("Why can a portfolio run out even with a decent average return?", "Because withdrawal timing and poor early returns can damage sustainability even when long-run averages look acceptable.", "Basics"),
      faq("Why show years to depletion?", "Because retirees often want to know how long the plan may hold together, not just the first-year withdrawal amount.", "Planning"),
    ],
  },
  "life-expectancy": {
    title: "Life Expectancy Calculator",
    subtitle: "Create a retirement-planning horizon estimate using age and simple lifestyle adjustments",
    reviewName: "Life Expectancy Calculator",
    focus: "retirement-horizon planning rather than medical prediction",
    researchFocus: "age, actuarial baseline life expectancy, and rough planning adjustments",
    quickRows: [
      quick("Planning horizon", "Years remaining", "Retirement projections often need a plausible horizon even when the future is uncertain."),
      quick("Actuarial baseline", "Population average", "Public life tables describe population averages, not personal certainty."),
      quick("Use case", "Retirement planning", "The goal is to support longevity planning, not provide medical advice."),
    ],
    faqs: [
      faq("Is this a medical prediction?", "No. It is a retirement-planning estimate built from broad actuarial-style baselines and simple lifestyle adjustments.", "Basics"),
      faq("Why include this in retirement planning?", "Because longevity assumptions can materially change how much income a retirement plan may need to support.", "Planning"),
    ],
  },
  "retirement-gap": {
    title: "Retirement Gap Calculator",
    subtitle: "Compare projected retirement assets with the portfolio your spending goal may require",
    reviewName: "Retirement Gap Calculator",
    focus: "the difference between retirement progress and retirement needs",
    researchFocus: "projected nest egg, desired spending, withdrawal rate, and gap-to-goal analysis",
    quickRows: [
      quick("Gap view", "Shortfall or surplus", "Retirement readiness is easier to interpret when you can see the cushion or deficit directly."),
      quick("Goal size", "Spending-driven", "The target portfolio depends heavily on the retirement spending assumption."),
      quick("Action levers", "Age, savings, spending", "Most retirement gaps close through some mix of those three levers."),
    ],
    faqs: [
      faq("What is a retirement gap?", "It is the difference between what your retirement plan is projected to produce and what your spending target may require.", "Basics"),
      faq("Does a zero gap mean the plan is guaranteed?", "No. It means the current assumptions line up, but returns, inflation, taxes, and longevity can still differ.", "Risk"),
    ],
  },
};

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const pct = (value: number, digits = 2) => `${value.toFixed(digits)}%`;

const formatMetric = (metric: ResultMetric) => {
  if (metric.currency) return usd(metric.value);
  if (metric.suffix) return `${metric.value.toFixed(2)}${metric.suffix}`;
  return pct(metric.value);
};

const futureValue = (
  currentBalance: number,
  annualContribution: number,
  years: number,
  annualReturn: number
) => {
  let balance = currentBalance;
  const growth = 1 + annualReturn / 100;
  for (let year = 0; year < years; year += 1) {
    balance = balance * growth + annualContribution;
  }
  return balance;
};

const realValue = (value: number, inflation: number, years: number) =>
  value / Math.pow(1 + inflation / 100, years);

const payment = (principal: number, annualRate: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  const rate = annualRate / 100 / 12;
  if (rate === 0) return principal / months;
  const factor = Math.pow(1 + rate, months);
  return (principal * rate * factor) / (factor - 1);
};

const simulateWithdrawal = (
  startBalance: number,
  annualReturn: number,
  annualWithdrawal: number,
  inflation: number,
  years: number
) => {
  let balance = startBalance;
  let withdrawal = annualWithdrawal;
  let yearsLasted = 0;
  for (let year = 0; year < years; year += 1) {
    balance *= 1 + annualReturn / 100;
    balance -= withdrawal;
    if (balance <= 0) return { endingBalance: 0, yearsLasted: year + 1 };
    withdrawal *= 1 + inflation / 100;
    yearsLasted = year + 1;
  }
  return { endingBalance: balance, yearsLasted };
};

const findYearsToGoal = (
  currentBalance: number,
  annualContribution: number,
  annualReturn: number,
  goal: number,
  maxYears = 60
) => {
  let balance = currentBalance;
  for (let year = 0; year <= maxYears; year += 1) {
    if (balance >= goal) return year;
    balance = balance * (1 + annualReturn / 100) + annualContribution;
  }
  return maxYears + 1;
};

const getRmdDivisor = (age: number) => {
  const table: Record<number, number> = {
    72: 27.4,
    73: 26.5,
    74: 25.5,
    75: 24.6,
    76: 23.7,
    77: 22.9,
    78: 22.0,
    79: 21.1,
    80: 20.2,
    81: 19.4,
    82: 18.5,
    83: 17.7,
    84: 16.8,
    85: 16.0,
    86: 15.2,
    87: 14.4,
    88: 13.7,
    89: 12.9,
    90: 12.2,
    91: 11.5,
    92: 10.8,
    93: 10.1,
    94: 9.5,
    95: 8.9,
    96: 8.4,
    97: 7.8,
    98: 7.3,
    99: 6.8,
    100: 6.4,
  };
  return table[Math.min(Math.max(Math.round(age), 72), 100)] ?? 27.4;
};

const getLifeExpectancyYears = (
  age: number,
  gender: string,
  healthRating: string,
  familyHistoryAdjustment: number,
  smoker: string
) => {
  const targetAge = gender === "female" ? 87 : 84;
  let adjustment = 0;
  if (healthRating === "excellent") adjustment += 3;
  if (healthRating === "good") adjustment += 1;
  if (healthRating === "fair") adjustment -= 2;
  if (healthRating === "poor") adjustment -= 5;
  if (smoker === "yes") adjustment -= 5;
  adjustment += familyHistoryAdjustment;
  return Math.max(targetAge + adjustment - age, 2);
};

function buildResult(variant: RetirementVariant, inputs: Inputs): Result {
  const currentAge = parse(inputs.currentAge);
  const retirementAge = parse(inputs.retirementAge);
  const currentBalance = parse(inputs.currentBalance);
  const annualContribution = parse(inputs.annualContribution);
  const monthlyContribution = parse(inputs.monthlyContribution);
  const annualReturn = parse(inputs.annualReturn);
  const inflation = parse(inputs.inflation);
  const salary = parse(inputs.salary);
  const employeeContributionPercent = parse(inputs.employeeContributionPercent);
  const employerMatchPercent = parse(inputs.employerMatchPercent);
  const employerMatchCapPercent = parse(inputs.employerMatchCapPercent);
  const annualSpending = parse(inputs.annualSpending);
  const withdrawalRate = parse(inputs.withdrawalRate) || 4;
  const taxRateNow = parse(inputs.taxRateNow);
  const taxRateRetirement = parse(inputs.taxRateRetirement);
  const claimAge = parse(inputs.claimAge);
  const socialSecurityMonthly = parse(inputs.socialSecurityMonthly);
  const pensionMonthly = parse(inputs.pensionMonthly);
  const annuityPrincipal = parse(inputs.annuityPrincipal);
  const annuityRate = parse(inputs.annuityRate);
  const annuityYears = Math.max(parse(inputs.annuityYears), 1);
  const finalAverageSalary = parse(inputs.finalAverageSalary);
  const yearsOfService = parse(inputs.yearsOfService);
  const pensionMultiplier = parse(inputs.pensionMultiplier);
  const yearsInRetirement = Math.max(parse(inputs.yearsInRetirement), 1);
  const expectedOtherIncome = parse(inputs.expectedOtherIncome);
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const totalAnnualContribution = annualContribution + monthlyContribution * 12;

  if (variant === "retirement-savings") {
    const nestEgg = futureValue(
      currentBalance,
      totalAnnualContribution,
      yearsToRetirement,
      annualReturn
    );
    const realNestEgg = realValue(nestEgg, inflation, yearsToRetirement);
    const annualIncomeSupport = nestEgg * (withdrawalRate / 100);
    const spendingGap = annualIncomeSupport - annualSpending;
    const warnings: string[] = [];
    if (annualIncomeSupport < annualSpending) {
      warnings.push(
        "The projected portfolio income support does not fully cover the modeled annual spending target."
      );
    }
    if (annualReturn > 9) {
      warnings.push(
        "The expected return assumption is aggressive for long-range retirement planning."
      );
    }
    return {
      primaryLabel: "Projected Retirement Nest Egg",
      primaryValue: nestEgg,
      primaryCurrency: true,
      metrics: [
        { label: "Inflation-Adjusted Nest Egg", value: realNestEgg, currency: true },
        { label: "Annual Income Support", value: annualIncomeSupport, currency: true },
        { label: "Monthly Income Support", value: annualIncomeSupport / 12, currency: true },
        { label: "Spending Gap", value: spendingGap, currency: true },
      ],
      notes: [
        "This run turns saving and return assumptions into both a projected balance and a spending-support estimate.",
        "The real-value output matters because retirement targets are easier to misread when they are shown only in future nominal dollars.",
        "Use the spending-gap output to decide whether to adjust savings pace, retirement age, or lifestyle assumptions.",
      ],
      warnings,
    };
  }

  if (variant === "401k") {
    const maxEmployeeLimit =
      currentAge >= 60 && currentAge <= 63
        ? 35750
        : currentAge >= 50
          ? 32500
          : 24500;
    const employeeContribution = Math.min(
      (salary * employeeContributionPercent) / 100,
      maxEmployeeLimit
    );
    const matchedPercent = Math.min(
      employeeContributionPercent,
      employerMatchCapPercent
    );
    const employerMatch =
      (salary * matchedPercent * employerMatchPercent) / 10000;
    const annualPlanContribution = employeeContribution + employerMatch;
    const projectedBalance = futureValue(
      currentBalance,
      annualPlanContribution,
      yearsToRetirement,
      annualReturn
    );
    const projectedIncome = projectedBalance * (withdrawalRate / 100);
    const warnings: string[] = [];
    if (employeeContributionPercent < employerMatchCapPercent) {
      warnings.push(
        "The employee deferral rate is below the full employer-match cap under the current assumptions."
      );
    }
    if (employeeContribution >= maxEmployeeLimit) {
      warnings.push(
        "The employee contribution has reached the modeled 2026 plan-limit ceiling."
      );
    }
    return {
      primaryLabel: "Projected 401(k) Balance",
      primaryValue: projectedBalance,
      primaryCurrency: true,
      metrics: [
        { label: "Employee Contribution / Year", value: employeeContribution, currency: true },
        { label: "Employer Match / Year", value: employerMatch, currency: true },
        { label: "Total Plan Contribution / Year", value: annualPlanContribution, currency: true },
        { label: "Modeled 2026 Limit", value: maxEmployeeLimit, currency: true },
        { label: "Income Support at Withdrawal Rate", value: projectedIncome, currency: true },
      ],
      notes: [
        "This run keeps the employer match visible because it can materially improve long-run retirement accumulation.",
        "The annual employee contribution is screened against current 2026 IRS contribution-limit levels.",
        "Use the result to judge whether the deferral rate is merely active or genuinely aligned with the retirement target.",
      ],
      warnings,
    };
  }

  if (variant === "ira") {
    const annualIraCap = currentAge >= 50 ? 8600 : 7500;
    const effectiveContribution = Math.min(totalAnnualContribution, annualIraCap);
    const projectedBalance = futureValue(
      currentBalance,
      effectiveContribution,
      yearsToRetirement,
      annualReturn
    );
    const warnings: string[] = [];
    if (totalAnnualContribution > annualIraCap) {
      warnings.push(
        "The entered annual contribution is above the modeled 2026 IRA contribution limit."
      );
    }
    return {
      primaryLabel: "Projected IRA Balance",
      primaryValue: projectedBalance,
      primaryCurrency: true,
      metrics: [
        { label: "Modeled Annual IRA Cap", value: annualIraCap, currency: true },
        { label: "Effective Annual Contribution", value: effectiveContribution, currency: true },
        { label: "Inflation-Adjusted Balance", value: realValue(projectedBalance, inflation, yearsToRetirement), currency: true },
        { label: "Income Support at Withdrawal Rate", value: projectedBalance * (withdrawalRate / 100), currency: true },
      ],
      notes: [
        "The IRA cap matters because each year of tax-advantaged contribution room can be valuable over a long compounding horizon.",
        "This estimate keeps the contribution limit visible so the growth result is grounded in realistic annual account capacity.",
        "Use it to compare the current IRA funding pace with the level needed to support the broader retirement target.",
      ],
      warnings,
    };
  }

  if (variant === "roth-ira-conversion") {
    const years = Math.max(yearsToRetirement, 1);
    const futureRothValue = currentBalance * Math.pow(1 + annualReturn / 100, years);
    const futureTraditionalAfterTax = futureRothValue * (1 - taxRateRetirement / 100);
    const conversionTaxCost = currentBalance * (taxRateNow / 100);
    const warnings: string[] = [];
    if (taxRateNow > taxRateRetirement) {
      warnings.push(
        "The current tax rate is above the expected retirement tax rate, which can make a full conversion look weaker."
      );
    }
    return {
      primaryLabel: "Estimated Roth Conversion Tax Cost",
      primaryValue: conversionTaxCost,
      primaryCurrency: true,
      metrics: [
        { label: "Future Roth Value", value: futureRothValue, currency: true },
        { label: "Future Traditional After-Tax Value", value: futureTraditionalAfterTax, currency: true },
        { label: "Net Roth Advantage", value: futureRothValue - futureTraditionalAfterTax, currency: true },
        { label: "Break-Even Future Tax Rate", value: taxRateNow },
      ],
      notes: [
        "This estimate assumes the conversion tax is paid from outside the IRA for a cleaner comparison.",
        "The key tradeoff is whether today's tax cost creates a stronger after-tax outcome by retirement.",
        "Use the result as a screening tool before making a bracket-sensitive conversion decision.",
      ],
      warnings,
    };
  }

  if (variant === "social-security-estimator") {
    const monthlyEarnings = salary / 12;
    const fraBenefit = Math.min(monthlyEarnings * 0.4, 4500);
    const ageFactor =
      claimAge < 67
        ? Math.max(0.7, 1 - (67 - claimAge) * 0.06)
        : Math.min(1.24, 1 + (claimAge - 67) * 0.08);
    const estimatedMonthlyBenefit = fraBenefit * ageFactor;
    const warnings: string[] = [];
    if (claimAge < 67) {
      warnings.push(
        "Claiming before full retirement age generally reduces monthly benefits under current Social Security rules."
      );
    }
    return {
      primaryLabel: "Estimated Monthly Social Security Benefit",
      primaryValue: estimatedMonthlyBenefit,
      primaryCurrency: true,
      metrics: [
        { label: "Estimated Annual Benefit", value: estimatedMonthlyBenefit * 12, currency: true },
        { label: "Estimated FRA Benefit", value: fraBenefit, currency: true },
        { label: "Claiming Age Factor", value: ageFactor * 100 },
        { label: "Replacement Ratio", value: salary > 0 ? ((estimatedMonthlyBenefit * 12) / salary) * 100 : 0 },
      ],
      notes: [
        "This is a planning-range estimate that uses income and claim-age assumptions rather than an official SSA earnings record.",
        "Claim age materially affects the monthly benefit, which is why the estimator keeps timing visible.",
        "Use it to compare claiming scenarios before checking the official benefit estimate directly with SSA.",
      ],
      warnings,
    };
  }

  if (variant === "retirement-income") {
    const portfolioIncome = currentBalance * (withdrawalRate / 100);
    const annualGuaranteedIncome =
      socialSecurityMonthly * 12 + pensionMonthly * 12 + expectedOtherIncome;
    const totalIncome = portfolioIncome + annualGuaranteedIncome;
    const gap = totalIncome - annualSpending;
    const warnings: string[] = [];
    if (gap < 0) {
      warnings.push(
        "The combined modeled retirement income does not cover the current annual spending target."
      );
    }
    return {
      primaryLabel: "Estimated Annual Retirement Income",
      primaryValue: totalIncome,
      primaryCurrency: true,
      metrics: [
        { label: "Portfolio Income", value: portfolioIncome, currency: true },
        { label: "Guaranteed Income Sources", value: annualGuaranteedIncome, currency: true },
        { label: "Estimated Monthly Income", value: totalIncome / 12, currency: true },
        { label: "Income Gap", value: gap, currency: true },
      ],
      notes: [
        "This run blends withdrawal-based portfolio income with guaranteed or semi-guaranteed sources such as Social Security and pension income.",
        "The income gap is often the clearest summary of whether the retirement cash-flow plan currently looks tight or workable.",
        "Use it to test whether the portfolio must carry too much of the income burden alone.",
      ],
      warnings,
    };
  }

  if (variant === "catch-up-contribution") {
    const is401k = inputs.catchUpPlanType === "401k";
    const baseLimit = is401k ? 24500 : 7500;
    const catchUpAmount = is401k
      ? currentAge >= 60 && currentAge <= 63
        ? 11250
        : currentAge >= 50
          ? 8000
          : 0
      : currentAge >= 50
        ? 1100
        : 0;
    const totalLimit = baseLimit + catchUpAmount;
    const currentContribution = totalAnnualContribution;
    return {
      primaryLabel: "Total Modeled 2026 Contribution Limit",
      primaryValue: totalLimit,
      primaryCurrency: true,
      metrics: [
        { label: "Base Limit", value: baseLimit, currency: true },
        { label: "Catch-Up Amount", value: catchUpAmount, currency: true },
        { label: "Current Annual Contribution", value: currentContribution, currency: true },
        { label: "Remaining Room", value: Math.max(totalLimit - currentContribution, 0), currency: true },
      ],
      notes: [
        "Catch-up rules can materially increase late-career saving capacity, especially in workplace plans.",
        "This result is designed to show both the total 2026 room and the part that exists specifically because of catch-up eligibility.",
        "Use it to decide whether the current savings pace is fully using the higher contribution window available at older ages.",
      ],
      warnings: catchUpAmount === 0 ? ["Under the current age and plan-type assumptions, no catch-up contribution amount is available."] : [],
    };
  }

  if (variant === "required-minimum-distribution") {
    const divisor = getRmdDivisor(currentAge);
    const rmd = currentBalance / divisor;
    return {
      primaryLabel: "Estimated Annual RMD",
      primaryValue: rmd,
      primaryCurrency: true,
      metrics: [
        { label: "Monthly Equivalent", value: rmd / 12, currency: true },
        { label: "IRS Divisor Used", value: divisor, suffix: "x" },
        { label: "Distribution Rate", value: currentBalance > 0 ? (rmd / currentBalance) * 100 : 0 },
        { label: "Modeled Account Balance", value: currentBalance, currency: true },
      ],
      notes: [
        "This estimate uses the Uniform Lifetime Table for a common RMD planning baseline.",
        "The divisor falls with age, which increases the required distribution as a percentage of the account.",
        "Use the result to plan taxes and cash flow rather than waiting for the required withdrawal to surprise the rest of the plan.",
      ],
      warnings: currentAge < 73 ? ["The age entered is below the common current-law RMD starting point used for many planning scenarios."] : [],
    };
  }

  if (variant === "pension") {
    const annualPension =
      finalAverageSalary * yearsOfService * (pensionMultiplier / 100);
    const monthlyPensionEstimate = annualPension / 12;
    return {
      primaryLabel: "Estimated Monthly Pension",
      primaryValue: monthlyPensionEstimate,
      primaryCurrency: true,
      metrics: [
        { label: "Estimated Annual Pension", value: annualPension, currency: true },
        { label: "Replacement Ratio", value: finalAverageSalary > 0 ? (annualPension / finalAverageSalary) * 100 : 0 },
        { label: "Final Average Salary", value: finalAverageSalary, currency: true },
        { label: "Years of Service", value: yearsOfService, suffix: " yr" },
      ],
      notes: [
        "This estimate uses a standard pension-planning formula based on final average salary, years of service, and the benefit multiplier.",
        "It is designed to help you see the size of the pension relative to both salary and retirement spending.",
        "Use it as a screening tool before relying on a plan statement or administrator estimate.",
      ],
      warnings:
        yearsOfService <= 0 || pensionMultiplier <= 0
          ? ["Service years and pension multiplier must be meaningful for a pension estimate to be useful."]
          : [],
    };
  }

  if (variant === "annuity") {
    const monthlyIncome = payment(annuityPrincipal, annuityRate, annuityYears * 12);
    return {
      primaryLabel: "Estimated Monthly Annuity Income",
      primaryValue: monthlyIncome,
      primaryCurrency: true,
      metrics: [
        { label: "Estimated Annual Income", value: monthlyIncome * 12, currency: true },
        { label: "Annuity Principal", value: annuityPrincipal, currency: true },
        { label: "Payout Horizon", value: annuityYears, suffix: " yr" },
        { label: "Annual Income / Principal", value: annuityPrincipal > 0 ? ((monthlyIncome * 12) / annuityPrincipal) * 100 : 0 },
      ],
      notes: [
        "This estimate treats the annuity like a payout stream built from principal, a rate assumption, and a payout horizon.",
        "It is useful for retirement-paycheck comparisons even though it is not a live insurer quote.",
        "Use it to compare guaranteed-income tradeoffs against keeping more of the capital liquid.",
      ],
      warnings:
        annuityYears < 5
          ? ["A short payout horizon can make the monthly payment look stronger than a longer retirement-income plan would support."]
          : [],
    };
  }

  if (variant === "early-retirement") {
    const requiredPortfolio = annualSpending / (withdrawalRate / 100);
    const yearsToGoal = findYearsToGoal(
      currentBalance,
      totalAnnualContribution,
      annualReturn,
      requiredPortfolio,
      50
    );
    const projectedAge = currentAge + yearsToGoal;
    return {
      primaryLabel: "Estimated Financial Independence Age",
      primaryValue: projectedAge,
      metrics: [
        { label: "Required Portfolio", value: requiredPortfolio, currency: true },
        { label: "Years to Goal", value: yearsToGoal, suffix: " yr" },
        { label: "Desired Retirement Age", value: retirementAge, suffix: " yr" },
        { label: "Gap at Target Age", value: requiredPortfolio - futureValue(currentBalance, totalAnnualContribution, yearsToRetirement, annualReturn), currency: true },
      ],
      notes: [
        "Early retirement planning is mostly about the gap between the desired stop-work date and the portfolio size needed to support spending for longer.",
        "This estimate uses a withdrawal-rate framework to keep the target visible in spending terms, not just account-balance terms.",
        "Use it to decide whether to move savings pace, spending assumptions, or the retirement date itself.",
      ],
      warnings:
        projectedAge > retirementAge
          ? ["The current savings and return assumptions do not reach the modeled early-retirement target by the desired retirement age."]
          : [],
    };
  }

  if (variant === "fire") {
    const fireNumber = annualSpending / (withdrawalRate / 100);
    const annualSavings = totalAnnualContribution;
    const yearsToGoal = findYearsToGoal(
      currentBalance,
      annualSavings,
      annualReturn,
      fireNumber,
      60
    );
    return {
      primaryLabel: "Estimated FIRE Number",
      primaryValue: fireNumber,
      primaryCurrency: true,
      metrics: [
        { label: "Annual Savings", value: annualSavings, currency: true },
        { label: "Savings Rate", value: salary > 0 ? (annualSavings / salary) * 100 : 0 },
        { label: "Years to FIRE", value: yearsToGoal, suffix: " yr" },
        { label: "Projected FIRE Age", value: currentAge + yearsToGoal, suffix: " yr" },
      ],
      notes: [
        "FIRE planning usually becomes clearer when the target is expressed as a spending-supported portfolio size rather than just a vague wealth number.",
        "The savings rate is visible here because FIRE timelines are often highly sensitive to how much you save each year.",
        "Use the years-to-goal result as a planning range, not a guaranteed calendar date.",
      ],
      warnings:
        salary > 0 && annualSavings / salary < 0.15
          ? ["A low savings rate can make the modeled FIRE timeline very long under typical return assumptions."]
          : [],
    };
  }

  if (variant === "retirement-withdrawal") {
    const annualWithdrawal = annualSpending > 0 ? annualSpending : annualContribution;
    const simulation = simulateWithdrawal(
      currentBalance,
      annualReturn,
      annualWithdrawal,
      inflation,
      yearsInRetirement
    );
    return {
      primaryLabel: "Portfolio Years Lasted",
      primaryValue: simulation.yearsLasted,
      metrics: [
        { label: "Ending Balance", value: simulation.endingBalance, currency: true },
        { label: "Modeled Annual Withdrawal", value: annualWithdrawal, currency: true },
        { label: "Sustainable 4% Starting Withdrawal", value: currentBalance * 0.04, currency: true },
        { label: "Retirement Horizon", value: yearsInRetirement, suffix: " yr" },
      ],
      notes: [
        "This model simulates annual withdrawals that rise with inflation, which is usually a more realistic stress test than a flat nominal withdrawal amount.",
        "The years-to-depletion result helps show whether the current withdrawal plan is merely manageable at the start or durable over the full horizon.",
        "Use it to compare spending flexibility with longevity risk before finalizing a retirement-income plan.",
      ],
      warnings:
        simulation.yearsLasted < yearsInRetirement
          ? ["The modeled withdrawal plan depletes the portfolio before the full retirement horizon ends."]
          : [],
    };
  }

  if (variant === "life-expectancy") {
    const planningYears = getLifeExpectancyYears(
      currentAge,
      inputs.gender,
      inputs.healthRating,
      parse(inputs.familyHistoryAdjustment),
      inputs.smoker
    );
    return {
      primaryLabel: "Estimated Planning Horizon Age",
      primaryValue: currentAge + planningYears,
      metrics: [
        { label: "Estimated Years Remaining", value: planningYears, suffix: " yr" },
        { label: "Current Age", value: currentAge, suffix: " yr" },
        { label: "Family History Adjustment", value: parse(inputs.familyHistoryAdjustment), suffix: " yr" },
        { label: "Long-Horizon Spending Need", value: annualSpending * planningYears, currency: true },
      ],
      notes: [
        "This tool is a retirement-planning horizon estimate, not a clinical prediction or a statement of personal life expectancy.",
        "It begins with a broad actuarial-style baseline and applies simple lifestyle adjustments so the rest of the retirement plan has a working horizon.",
        "Use it to stress-test how much income a plan may need to support, not to make health conclusions.",
      ],
      warnings: [
        "This estimate is for educational retirement planning only and should not be used as medical advice.",
      ],
    };
  }

  const projectedBalance = futureValue(
    currentBalance,
    totalAnnualContribution,
    yearsToRetirement,
    annualReturn
  );
  const requiredPortfolio = annualSpending / (withdrawalRate / 100);
  return {
    primaryLabel: "Estimated Retirement Gap",
    primaryValue: projectedBalance - requiredPortfolio,
    primaryCurrency: true,
    metrics: [
      { label: "Projected Portfolio", value: projectedBalance, currency: true },
      { label: "Required Portfolio", value: requiredPortfolio, currency: true },
      { label: "Years to Retirement", value: yearsToRetirement, suffix: " yr" },
      { label: "Inflation-Adjusted Portfolio", value: realValue(projectedBalance, inflation, yearsToRetirement), currency: true },
    ],
    notes: [
      "The retirement gap compares what the current plan may produce with the portfolio size the spending goal suggests you may need.",
      "This framing can be easier to act on than a raw future-value result because it shows the cushion or shortfall directly.",
      "Use it to choose whether to move the savings rate, the retirement age, or the spending goal.",
    ],
    warnings:
      projectedBalance < requiredPortfolio
        ? ["The projected retirement assets fall short of the portfolio target implied by the current spending goal and withdrawal rate."]
        : [],
  };
}

function InputField({
  label,
  value,
  onChange,
  min = "0",
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AdvancedRetirementSuiteCalculator({ variant }: Props) {
  const config = CONFIG[variant];
  const [inputs, setInputs] = useState<Inputs>({
    currentAge: "40",
    retirementAge: "67",
    currentBalance: "150000",
    annualContribution: "12000",
    monthlyContribution: "500",
    annualReturn: "7",
    inflation: "2.5",
    salary: "110000",
    employeeContributionPercent: "10",
    employerMatchPercent: "100",
    employerMatchCapPercent: "4",
    annualSpending: "80000",
    withdrawalRate: "4",
    taxRateNow: "24",
    taxRateRetirement: "18",
    claimAge: "67",
    socialSecurityMonthly: "2400",
    pensionMonthly: "1800",
    annuityPrincipal: "250000",
    annuityRate: "5",
    annuityYears: "25",
    finalAverageSalary: "95000",
    yearsOfService: "25",
    pensionMultiplier: "1.75",
    catchUpPlanType: "401k",
    healthRating: "good",
    gender: "male",
    familyHistoryAdjustment: "0",
    smoker: "no",
    yearsInRetirement: "30",
    expectedOtherIncome: "12000",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [showModal, setShowModal] = useState(false);

  const setField = (field: keyof Inputs, value: string) => {
    setInputs((previous) => ({ ...previous, [field]: value }));
  };

  const quickStats = useMemo(
    () => [
      { label: "Current Age", value: `${parse(inputs.currentAge).toFixed(0)} yr` },
      { label: "Current Balance", value: usd(parse(inputs.currentBalance)) },
      { label: "Expected Return", value: pct(parse(inputs.annualReturn), 2) },
      { label: "Retirement Age", value: `${parse(inputs.retirementAge).toFixed(0)} yr` },
    ],
    [inputs]
  );

  const onCalculate = () => {
    if (parse(inputs.currentAge) <= 0) {
      alert("Please enter a valid current age greater than zero.");
      return;
    }
    setResult(buildResult(variant, inputs));
    setShowModal(true);
  };

  const onReset = () => {
    setShowModal(false);
    setResult(null);
    setInputs({
      currentAge: "40",
      retirementAge: "67",
      currentBalance: "150000",
      annualContribution: "12000",
      monthlyContribution: "500",
      annualReturn: "7",
      inflation: "2.5",
      salary: "110000",
      employeeContributionPercent: "10",
      employerMatchPercent: "100",
      employerMatchCapPercent: "4",
      annualSpending: "80000",
      withdrawalRate: "4",
      taxRateNow: "24",
      taxRateRetirement: "18",
      claimAge: "67",
      socialSecurityMonthly: "2400",
      pensionMonthly: "1800",
      annuityPrincipal: "250000",
      annuityRate: "5",
      annuityYears: "25",
      finalAverageSalary: "95000",
      yearsOfService: "25",
      pensionMultiplier: "1.75",
      catchUpPlanType: "401k",
      healthRating: "good",
      gender: "male",
      familyHistoryAdjustment: "0",
      smoker: "no",
      yearsInRetirement: "30",
      expectedOtherIncome: "12000",
    });
  };

  const renderFields = () => {
    switch (variant) {
      case "retirement-savings":
      case "retirement-gap":
      case "early-retirement":
      case "fire":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <InputField label="Retirement Age" value={inputs.retirementAge} onChange={(value) => setField("retirementAge", value)} min="30" />
            <InputField label="Current Retirement Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Annual Contribution ($)" value={inputs.annualContribution} onChange={(value) => setField("annualContribution", value)} />
            <InputField label="Monthly Contribution ($)" value={inputs.monthlyContribution} onChange={(value) => setField("monthlyContribution", value)} />
            <InputField label="Expected Annual Return (%)" value={inputs.annualReturn} onChange={(value) => setField("annualReturn", value)} step="0.1" />
            <InputField label="Inflation (%)" value={inputs.inflation} onChange={(value) => setField("inflation", value)} step="0.1" />
            <InputField label="Annual Spending Goal ($)" value={inputs.annualSpending} onChange={(value) => setField("annualSpending", value)} />
            <InputField label="Withdrawal Rate (%)" value={inputs.withdrawalRate} onChange={(value) => setField("withdrawalRate", value)} step="0.1" />
            <InputField label="Salary / Income ($)" value={inputs.salary} onChange={(value) => setField("salary", value)} />
          </>
        );
      case "401k":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <InputField label="Retirement Age" value={inputs.retirementAge} onChange={(value) => setField("retirementAge", value)} min="30" />
            <InputField label="Current 401(k) Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Salary ($)" value={inputs.salary} onChange={(value) => setField("salary", value)} />
            <InputField label="Employee Contribution Rate (%)" value={inputs.employeeContributionPercent} onChange={(value) => setField("employeeContributionPercent", value)} step="0.1" />
            <InputField label="Employer Match (%)" value={inputs.employerMatchPercent} onChange={(value) => setField("employerMatchPercent", value)} step="0.1" />
            <InputField label="Employer Match Cap (% of pay)" value={inputs.employerMatchCapPercent} onChange={(value) => setField("employerMatchCapPercent", value)} step="0.1" />
            <InputField label="Expected Annual Return (%)" value={inputs.annualReturn} onChange={(value) => setField("annualReturn", value)} step="0.1" />
            <InputField label="Withdrawal Rate (%)" value={inputs.withdrawalRate} onChange={(value) => setField("withdrawalRate", value)} step="0.1" />
          </>
        );
      case "ira":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <InputField label="Retirement Age" value={inputs.retirementAge} onChange={(value) => setField("retirementAge", value)} min="30" />
            <InputField label="Current IRA Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Annual IRA Contribution ($)" value={inputs.annualContribution} onChange={(value) => setField("annualContribution", value)} />
            <InputField label="Expected Annual Return (%)" value={inputs.annualReturn} onChange={(value) => setField("annualReturn", value)} step="0.1" />
            <InputField label="Inflation (%)" value={inputs.inflation} onChange={(value) => setField("inflation", value)} step="0.1" />
            <InputField label="Withdrawal Rate (%)" value={inputs.withdrawalRate} onChange={(value) => setField("withdrawalRate", value)} step="0.1" />
          </>
        );
      case "roth-ira-conversion":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <InputField label="Retirement Age" value={inputs.retirementAge} onChange={(value) => setField("retirementAge", value)} min="30" />
            <InputField label="Traditional IRA Balance to Convert ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Current Marginal Tax Rate (%)" value={inputs.taxRateNow} onChange={(value) => setField("taxRateNow", value)} step="0.1" />
            <InputField label="Expected Retirement Tax Rate (%)" value={inputs.taxRateRetirement} onChange={(value) => setField("taxRateRetirement", value)} step="0.1" />
            <InputField label="Expected Annual Return (%)" value={inputs.annualReturn} onChange={(value) => setField("annualReturn", value)} step="0.1" />
          </>
        );
      case "social-security-estimator":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <InputField label="Claiming Age" value={inputs.claimAge} onChange={(value) => setField("claimAge", value)} min="62" />
            <InputField label="Current Annual Earnings ($)" value={inputs.salary} onChange={(value) => setField("salary", value)} />
            <InputField label="Other Expected Retirement Income ($ / year)" value={inputs.expectedOtherIncome} onChange={(value) => setField("expectedOtherIncome", value)} />
          </>
        );
      case "retirement-income":
        return (
          <>
            <InputField label="Retirement Portfolio Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Withdrawal Rate (%)" value={inputs.withdrawalRate} onChange={(value) => setField("withdrawalRate", value)} step="0.1" />
            <InputField label="Social Security / Month ($)" value={inputs.socialSecurityMonthly} onChange={(value) => setField("socialSecurityMonthly", value)} />
            <InputField label="Pension / Month ($)" value={inputs.pensionMonthly} onChange={(value) => setField("pensionMonthly", value)} />
            <InputField label="Other Annual Income ($)" value={inputs.expectedOtherIncome} onChange={(value) => setField("expectedOtherIncome", value)} />
            <InputField label="Annual Spending Target ($)" value={inputs.annualSpending} onChange={(value) => setField("annualSpending", value)} />
          </>
        );
      case "catch-up-contribution":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <SelectField label="Account Type" value={inputs.catchUpPlanType} onChange={(value) => setField("catchUpPlanType", value)} options={[{ value: "401k", label: "401(k) / 403(b) / similar workplace plan" }, { value: "ira", label: "IRA" }]} />
            <InputField label="Current Annual Contribution ($)" value={inputs.annualContribution} onChange={(value) => setField("annualContribution", value)} />
            <InputField label="Current Monthly Contribution ($)" value={inputs.monthlyContribution} onChange={(value) => setField("monthlyContribution", value)} />
          </>
        );
      case "required-minimum-distribution":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="60" />
            <InputField label="Prior Year-End Account Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
          </>
        );
      case "pension":
        return (
          <>
            <InputField label="Final Average Salary ($)" value={inputs.finalAverageSalary} onChange={(value) => setField("finalAverageSalary", value)} />
            <InputField label="Years of Service" value={inputs.yearsOfService} onChange={(value) => setField("yearsOfService", value)} />
            <InputField label="Pension Multiplier (%)" value={inputs.pensionMultiplier} onChange={(value) => setField("pensionMultiplier", value)} step="0.01" />
          </>
        );
      case "annuity":
        return (
          <>
            <InputField label="Annuity Principal ($)" value={inputs.annuityPrincipal} onChange={(value) => setField("annuityPrincipal", value)} />
            <InputField label="Payout Rate (%)" value={inputs.annuityRate} onChange={(value) => setField("annuityRate", value)} step="0.1" />
            <InputField label="Payout Horizon (years)" value={inputs.annuityYears} onChange={(value) => setField("annuityYears", value)} min="1" />
          </>
        );
      case "retirement-withdrawal":
        return (
          <>
            <InputField label="Retirement Portfolio Balance ($)" value={inputs.currentBalance} onChange={(value) => setField("currentBalance", value)} />
            <InputField label="Annual Withdrawal ($)" value={inputs.annualSpending} onChange={(value) => setField("annualSpending", value)} />
            <InputField label="Expected Annual Return (%)" value={inputs.annualReturn} onChange={(value) => setField("annualReturn", value)} step="0.1" />
            <InputField label="Inflation (%)" value={inputs.inflation} onChange={(value) => setField("inflation", value)} step="0.1" />
            <InputField label="Retirement Horizon (years)" value={inputs.yearsInRetirement} onChange={(value) => setField("yearsInRetirement", value)} min="1" />
          </>
        );
      case "life-expectancy":
        return (
          <>
            <InputField label="Current Age" value={inputs.currentAge} onChange={(value) => setField("currentAge", value)} min="18" />
            <SelectField label="Sex" value={inputs.gender} onChange={(value) => setField("gender", value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
            <SelectField label="Health Rating" value={inputs.healthRating} onChange={(value) => setField("healthRating", value)} options={[{ value: "excellent", label: "Excellent" }, { value: "good", label: "Good" }, { value: "fair", label: "Fair" }, { value: "poor", label: "Poor" }]} />
            <SelectField label="Smoker" value={inputs.smoker} onChange={(value) => setField("smoker", value)} options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
            <InputField label="Family Longevity Adjustment (years)" value={inputs.familyHistoryAdjustment} onChange={(value) => setField("familyHistoryAdjustment", value)} min="-10" step="1" />
            <InputField label="Annual Spending Goal ($)" value={inputs.annualSpending} onChange={(value) => setField("annualSpending", value)} />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((item) => (
            <div key={item.label} className="border rounded-xl p-4">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-lg font-semibold mt-1">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">{renderFields()}</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCalculate} className="inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Calculator className="h-4 w-4 mr-2" />
            Analyze {config.title}
          </button>
          <button onClick={onReset} className="inline-flex items-center justify-center px-5 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Inputs
          </button>
        </div>
      </div>

      {showModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-label={`${config.title} results`}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-background">
              <div>
                <h3 className="text-xl font-bold text-foreground">{config.title} Results Dashboard</h3>
                <p className="text-sm text-muted-foreground">Popup-only results, matching the approved tool-page pattern.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Close results">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{result.primaryLabel}</div>
                    <div className="text-3xl font-bold">{result.primaryCurrency ? usd(result.primaryValue) : result.primaryValue.toFixed(2)}</div>
                  </div>
                  {result.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                      <div className="text-2xl font-semibold">{formatMetric(metric)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {result.metrics.map((metric) => (
                  <div key={metric.label} className="border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="text-xl font-bold mt-1">{formatMetric(metric)}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    What This Run Tells You
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.notes.map((item, index) => (
                      <li key={index}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-xl p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Planning Flags
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.warnings.length ? result.warnings.map((item, index) => <li key={index}>- {item}</li>) : <li>- No major planning flags were triggered by the current assumptions, but tax, longevity, and market conditions still matter.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          About This Calculator
        </h2>
        <p className="text-base text-foreground leading-relaxed mb-4">
          This calculator is designed for {config.focus}. Instead of showing a single isolated figure, it connects the headline number to the wider retirement decision so the output is easier to use in the real world.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-4">
          That matters because retirement planning is rarely just one formula. Savings pace, withdrawal pressure, tax timing, claiming choices, and longevity assumptions can all change the answer at the same time.
        </p>
        <p className="text-base text-foreground leading-relaxed mb-6">
          This version follows the same longer, decision-oriented structure used on the site's more advanced finance tools so the page works like an interactive planning guide, not just a calculator widget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="border rounded-xl p-4">Variant-specific retirement math instead of a generic savings output</div>
          <div className="border rounded-xl p-4">Popup dashboard with interpretation notes and risk flags</div>
          <div className="border rounded-xl p-4">Retirement-focused content written around actual planning decisions</div>
          <div className="border rounded-xl p-4">Reference links to official retirement and investing resources</div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          How to Use This Free Online {config.title}
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Route className="h-5 w-5" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">1. Start with realistic ages, balances, and contribution or withdrawal assumptions so the result reflects an actual planning case.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">2. Add the retirement-specific details that matter for this variant, such as match rules, tax rates, claiming age, annuity inputs, or service years.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">3. Review both the headline result and the supporting metrics to understand how the math changes the retirement plan, not just the account balance.</div>
              <div className="p-3 rounded-lg bg-background border border-blue-200 dark:border-blue-700">4. Use the warnings and gap outputs to decide whether the strongest lever is saving more, spending less, retiring later, or changing the tax-and-income mix.</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Results Dashboard (Popup Only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Primary output centered on the retirement decision this variant is designed to answer</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Supporting metrics for contribution room, income support, tax cost, or longevity pressure</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Interpretive notes that explain why the result matters in planning terms</div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">Warnings when the assumptions create obvious stress points or modeling limits</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why Use This Calculator?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800 dark:text-purple-200">
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Translate retirement math into a practical planning answer instead of a disconnected number.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Keep taxes, timing, savings pace, and income mix visible where they change the result most.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Compare current trajectory with a target portfolio or target income, not just a balance projection.</div>
              <div className="bg-background p-3 rounded-lg border border-purple-200 dark:border-purple-700">Use one structured page that matches the rest of the site's approved advanced pattern.</div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {config.title} Advanced Features
            </h3>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
              <p>This version is built to support actual retirement-planning conversations, not just formula demonstrations.</p>
              <ul className="space-y-2">
                <li>- Variant-specific logic for savings accumulation, income conversion, contribution limits, claiming decisions, or withdrawal pressure.</li>
                <li>- A popup dashboard that keeps supporting metrics, context, and warnings together instead of burying them under the form.</li>
                <li>- Car-payment-style long-form content sections so the page still feels consistent with the site's approved advanced pattern.</li>
                <li>- Official references for tax rules, Social Security planning, or investor education where relevant.</li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/40 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Retirement Planning Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="border rounded-lg p-4 bg-background">If the result only works under an optimistic return assumption, the plan may be more fragile than it first appears.</div>
              <div className="border rounded-lg p-4 bg-background">If the income gap stays negative, the strongest lever is often some mix of spending, savings, and timing rather than a single heroic assumption.</div>
              <div className="border rounded-lg p-4 bg-background">If a tax or claiming decision drives the result, confirm the assumptions with the official provider before acting.</div>
              <div className="border rounded-lg p-4 bg-background">If the plan looks strong, pressure-test it with inflation, longevity, and lower-return scenarios before calling it finished.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding {config.title}
        </h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 mb-3">
              Retirement planning decisions are tightly connected. The same input that improves one output, such as a higher contribution rate or later claiming age, can change taxes, flexibility, withdrawal pressure, or cash-flow needs elsewhere in the plan.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              That is why this calculator keeps the wider planning context visible instead of isolating one formula from the rest of the retirement decision.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              What Strong Retirement Planning Usually Includes
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>- Realistic return and inflation assumptions rather than best-case averages.</li>
              <li>- A clear view of how savings accumulation translates into retirement income.</li>
              <li>- Awareness of tax timing, claiming rules, and contribution limits where they matter.</li>
              <li>- A willingness to test the plan against longevity and withdrawal pressure instead of only the best-looking case.</li>
            </ul>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Common Retirement Planning Mistakes
            </h3>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li>- Focusing on the account balance while ignoring the spending it actually needs to support.</li>
              <li>- Treating optimistic returns as if they were guaranteed instead of as one planning scenario.</li>
              <li>- Ignoring taxes, Social Security timing, or required withdrawals until late in the process.</li>
              <li>- Assuming that contribution limits or catch-up rules will not materially affect long-run accumulation.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Quick Reference: Retirement Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Planning Area</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Common Range</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Decision Notes</th>
              </tr>
            </thead>
            <tbody>
              {config.quickRows.map((row) => (
                <tr key={row.category} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{row.category}</td>
                  <td className="py-3 px-4">{row.range}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          Scientific References & Resources
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Official tax and retirement sources
            </h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS: 2026 retirement plan and IRA contribution limits</a> - contribution-limit reference for 401(k), IRA, and catch-up calculations.</li>
              <li>- <a href="https://www.irs.gov/publications/p590b" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IRS Publication 590-B</a> - official background for retirement distributions and RMD planning.</li>
              <li>- <a href="https://www.investor.gov/index.php/tools" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Investor.gov financial planning tools</a> - public investor-education reference for compound growth, RMD, and retirement calculators.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Social Security and income planning sources
            </h3>
            <ul className="space-y-1">
              <li>- <a href="https://www.ssa.gov/retirement/plan-for-retirement" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">SSA: Plan for Retirement</a> - official claim-age and retirement-benefit planning guidance.</li>
              <li>- <a href="https://www.ssa.gov/benefits/retirement/planner/stopwork.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">SSA Benefits Planner</a> - how earnings history and claim age affect retirement benefits.</li>
              <li>- <a href="https://www.fidelity.com/calculators-tools/retirement/living-on-retirement-income" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Fidelity retirement income planning</a> - live-calculator feature reference for income-source blending and retirement cash-flow planning.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              Research focus for this calculator
            </h3>
            <p>Prioritize {config.researchFocus}. Those inputs usually determine whether a retirement plan is genuinely workable or only looks strong under narrow assumptions.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">This calculator is for educational planning and screening. It does not replace official account statements, tax advice, or a personalized retirement plan.</p>
      </div>

      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={config.faqs} showTitle={false} />
      </div>

      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName={config.reviewName} />
      </div>
    </div>
  );
}
