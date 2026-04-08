import type { HumanResourcesVariant } from '@/lib/human-resources-suite-config';

export interface Inputs {
  hourlyRate: string;
  annualSalary: string;
  weeklyHours: string;
  weeksPerYear: string;

  overtimeHours: string;
  overtimeMultiplier: string;
  regularHoursWorked: string;

  grossPay: string;
  pretaxDeductions: string;
  employeeTaxRate: string;
  employerPayrollTaxRate: string;
  postTaxDeductions: string;

  annualPtoHours: string;
  annualSickHours: string;
  periodsPerYear: string;
  periodsCompleted: string;
  leaveUsedHours: string;
  hoursPerDay: string;

  holidayHoursWorked: string;
  holidayMultiplier: string;
  holidayBaseHours: string;

  yearsOfService: string;
  severanceWeeksPerYear: string;
  unusedPtoHours: string;

  annualBenefitsCost: string;
  annualBonus: string;
  annualEquipmentCost: string;
  annualTrainingCost: string;
  otherBenefitsAnnual: string;
  healthInsuranceAnnual: string;
  retirementMatchPercent: string;

  annualPayroll: string;
  workersCompRatePer100: string;
  experienceMod: string;
  premiumDiscountPercent: string;

  recruiterFees: string;
  jobBoardCost: string;
  backgroundCheckCost: string;
  travelCost: string;
  interviewHours: string;
  interviewerHourlyCost: string;
  hires: string;

  onboardingCost: string;
  productivityRampDays: string;
  dailyProductivityCost: string;
  managerTransitionHours: string;
  managerHourlyCost: string;

  trainingProgramCost: string;
  employeeTrainingHours: string;
  employeeHourlyRate: string;
  annualProductivityGain: string;
  annualErrorSavings: string;
  annualRetentionSavings: string;

  totalHoursWorked: string;
  fullTimeHoursStandard: string;
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

const BASE_INPUTS: Inputs = {
  hourlyRate: '28',
  annualSalary: '72000',
  weeklyHours: '40',
  weeksPerYear: '52',

  overtimeHours: '8',
  overtimeMultiplier: '1.5',
  regularHoursWorked: '40',

  grossPay: '3000',
  pretaxDeductions: '250',
  employeeTaxRate: '22',
  employerPayrollTaxRate: '7.65',
  postTaxDeductions: '75',

  annualPtoHours: '120',
  annualSickHours: '64',
  periodsPerYear: '26',
  periodsCompleted: '10',
  leaveUsedHours: '24',
  hoursPerDay: '8',

  holidayHoursWorked: '8',
  holidayMultiplier: '1.5',
  holidayBaseHours: '8',

  yearsOfService: '4',
  severanceWeeksPerYear: '2',
  unusedPtoHours: '36',

  annualBenefitsCost: '14000',
  annualBonus: '5000',
  annualEquipmentCost: '2000',
  annualTrainingCost: '1500',
  otherBenefitsAnnual: '2500',
  healthInsuranceAnnual: '9000',
  retirementMatchPercent: '4',

  annualPayroll: '850000',
  workersCompRatePer100: '1.25',
  experienceMod: '1.1',
  premiumDiscountPercent: '5',

  recruiterFees: '4500',
  jobBoardCost: '1200',
  backgroundCheckCost: '350',
  travelCost: '800',
  interviewHours: '24',
  interviewerHourlyCost: '45',
  hires: '3',

  onboardingCost: '3000',
  productivityRampDays: '45',
  dailyProductivityCost: '250',
  managerTransitionHours: '18',
  managerHourlyCost: '65',

  trainingProgramCost: '12000',
  employeeTrainingHours: '80',
  employeeHourlyRate: '32',
  annualProductivityGain: '18000',
  annualErrorSavings: '6000',
  annualRetentionSavings: '10000',

  totalHoursWorked: '5200',
  fullTimeHoursStandard: '2080',
};

export const DEFAULT_INPUTS: Record<HumanResourcesVariant, Inputs> = {
  salary: { ...BASE_INPUTS },
  'hourly-wage': { ...BASE_INPUTS },
  overtime: { ...BASE_INPUTS },
  payroll: { ...BASE_INPUTS },
  'employee-cost': { ...BASE_INPUTS },
  pto: { ...BASE_INPUTS },
  'sick-leave': { ...BASE_INPUTS },
  'holiday-pay': { ...BASE_INPUTS },
  'severance-pay': { ...BASE_INPUTS },
  'employee-turnover-cost': { ...BASE_INPUTS },
  'recruitment-cost': { ...BASE_INPUTS },
  'training-roi': { ...BASE_INPUTS },
  'benefits-cost': { ...BASE_INPUTS },
  'workers-comp': { ...BASE_INPUTS },
  fte: { ...BASE_INPUTS },
};

export function buildHumanResourcesResult(
  variant: HumanResourcesVariant,
  inputs: Inputs
): Result {
  const hourlyRate = parse(inputs.hourlyRate);
  const annualSalary = parse(inputs.annualSalary);
  const weeklyHours = parse(inputs.weeklyHours);
  const weeksPerYear = parse(inputs.weeksPerYear);

  const overtimeHours = parse(inputs.overtimeHours);
  const overtimeMultiplier = parse(inputs.overtimeMultiplier);
  const regularHoursWorked = parse(inputs.regularHoursWorked);

  const grossPay = parse(inputs.grossPay);
  const pretaxDeductions = parse(inputs.pretaxDeductions);
  const employeeTaxRate = parse(inputs.employeeTaxRate);
  const employerPayrollTaxRate = parse(inputs.employerPayrollTaxRate);
  const postTaxDeductions = parse(inputs.postTaxDeductions);

  const annualPtoHours = parse(inputs.annualPtoHours);
  const annualSickHours = parse(inputs.annualSickHours);
  const periodsPerYear = parse(inputs.periodsPerYear);
  const periodsCompleted = parse(inputs.periodsCompleted);
  const leaveUsedHours = parse(inputs.leaveUsedHours);
  const hoursPerDay = parse(inputs.hoursPerDay);

  const holidayHoursWorked = parse(inputs.holidayHoursWorked);
  const holidayMultiplier = parse(inputs.holidayMultiplier);
  const holidayBaseHours = parse(inputs.holidayBaseHours);

  const yearsOfService = parse(inputs.yearsOfService);
  const severanceWeeksPerYear = parse(inputs.severanceWeeksPerYear);
  const unusedPtoHours = parse(inputs.unusedPtoHours);

  const annualBenefitsCost = parse(inputs.annualBenefitsCost);
  const annualBonus = parse(inputs.annualBonus);
  const annualEquipmentCost = parse(inputs.annualEquipmentCost);
  const annualTrainingCost = parse(inputs.annualTrainingCost);
  const otherBenefitsAnnual = parse(inputs.otherBenefitsAnnual);
  const healthInsuranceAnnual = parse(inputs.healthInsuranceAnnual);
  const retirementMatchPercent = parse(inputs.retirementMatchPercent);

  const annualPayroll = parse(inputs.annualPayroll);
  const workersCompRatePer100 = parse(inputs.workersCompRatePer100);
  const experienceMod = parse(inputs.experienceMod);
  const premiumDiscountPercent = parse(inputs.premiumDiscountPercent);

  const recruiterFees = parse(inputs.recruiterFees);
  const jobBoardCost = parse(inputs.jobBoardCost);
  const backgroundCheckCost = parse(inputs.backgroundCheckCost);
  const travelCost = parse(inputs.travelCost);
  const interviewHours = parse(inputs.interviewHours);
  const interviewerHourlyCost = parse(inputs.interviewerHourlyCost);
  const hires = parse(inputs.hires);

  const onboardingCost = parse(inputs.onboardingCost);
  const productivityRampDays = parse(inputs.productivityRampDays);
  const dailyProductivityCost = parse(inputs.dailyProductivityCost);
  const managerTransitionHours = parse(inputs.managerTransitionHours);
  const managerHourlyCost = parse(inputs.managerHourlyCost);

  const trainingProgramCost = parse(inputs.trainingProgramCost);
  const employeeTrainingHours = parse(inputs.employeeTrainingHours);
  const employeeHourlyRate = parse(inputs.employeeHourlyRate);
  const annualProductivityGain = parse(inputs.annualProductivityGain);
  const annualErrorSavings = parse(inputs.annualErrorSavings);
  const annualRetentionSavings = parse(inputs.annualRetentionSavings);

  const totalHoursWorked = parse(inputs.totalHoursWorked);
  const fullTimeHoursStandard = parse(inputs.fullTimeHoursStandard);

  const annualHours = weeklyHours * weeksPerYear;
  const weeklyPay = hourlyRate * weeklyHours;
  const annualPayFromHourly = weeklyPay * weeksPerYear;
  const monthlyPay = annualPayFromHourly / 12;
  const biweeklyPay = annualPayFromHourly / 26;
  const semimonthlyPay = annualPayFromHourly / 24;
  const dailyPay = weeklyHours > 0 ? weeklyPay / 5 : 0;

  if (variant === 'salary') {
    return {
      primaryLabel: 'Estimated Annual Salary',
      primaryValue: annualPayFromHourly,
      primaryCurrency: true,
      metrics: [
        { label: 'Monthly Pay', value: monthlyPay, currency: true },
        { label: 'Biweekly Pay', value: biweeklyPay, currency: true },
        { label: 'Semi-Monthly Pay', value: semimonthlyPay, currency: true },
        { label: 'Weekly Pay', value: weeklyPay, currency: true },
        { label: 'Daily Pay', value: dailyPay, currency: true, decimals: 2 },
      ],
      notes: [
        'This run converts an hourly rate into longer payroll periods using your weekly schedule and weeks-worked assumption.',
        'The weeks-per-year input matters because unpaid time off, school calendars, or seasonal work can materially change annualized pay.',
        'Use the period outputs together rather than relying only on annual salary when budgeting or comparing offers.',
      ],
      warnings: annualHours <= 0 ? ['Weekly hours and weeks per year must both be above zero to annualize pay.'] : [],
    };
  }

  if (variant === 'hourly-wage') {
    const derivedHourly = annualHours > 0 ? annualSalary / annualHours : 0;
    return {
      primaryLabel: 'Estimated Hourly Wage',
      primaryValue: derivedHourly,
      primaryCurrency: true,
      primaryDecimals: 2,
      metrics: [
        { label: 'Weekly Salary Equivalent', value: annualSalary / weeksPerYear, currency: true, decimals: 2 },
        { label: 'Monthly Salary Equivalent', value: annualSalary / 12, currency: true },
        { label: 'Daily Wage Equivalent', value: weeklyHours > 0 ? annualSalary / weeksPerYear / 5 : 0, currency: true, decimals: 2 },
        { label: 'Annual Hours Assumed', value: annualHours, decimals: 0 },
      ],
      notes: [
        'Hourly wage is derived by spreading the annual salary across the working hours you expect in a year.',
        'Changing weekly hours or weeks worked can change the result just as much as changing salary itself.',
        'This is most useful for comparing salary offers against hourly roles, side work, overtime value, or contract quotes.',
      ],
      warnings: annualHours <= 0 ? ['Weekly hours and weeks per year must both be above zero to convert salary to an hourly rate.'] : [],
    };
  }

  if (variant === 'overtime') {
    const regularPay = hourlyRate * regularHoursWorked;
    const overtimeRate = hourlyRate * overtimeMultiplier;
    const overtimePay = overtimeRate * overtimeHours;
    const totalPay = regularPay + overtimePay;
    const totalHours = regularHoursWorked + overtimeHours;

    return {
      primaryLabel: 'Total Weekly Pay with Overtime',
      primaryValue: totalPay,
      primaryCurrency: true,
      metrics: [
        { label: 'Regular Pay', value: regularPay, currency: true },
        { label: 'Overtime Rate', value: overtimeRate, currency: true, decimals: 2 },
        { label: 'Overtime Pay', value: overtimePay, currency: true },
        { label: 'Total Hours', value: totalHours, decimals: 1 },
        { label: 'Blended Hourly Earnings', value: totalHours > 0 ? totalPay / totalHours : 0, currency: true, decimals: 2 },
      ],
      notes: [
        'Federal overtime pay is generally tied to hours worked over 40 in a workweek for covered nonexempt employees.',
        'The overtime multiplier matters because the premium portion can materially change real earnings even when the hourly base rate stays fixed.',
        'This screen is strongest for weekly pay planning and compliance checks, not for determining exemption status.',
      ],
      warnings: totalHours <= 40 ? ['This run does not actually exceed a 40-hour workweek, so the overtime scenario may not match a standard FLSA overtime case.'] : [],
    };
  }

  if (variant === 'payroll') {
    const taxableWages = Math.max(grossPay - pretaxDeductions, 0);
    const employeeTaxes = taxableWages * (employeeTaxRate / 100);
    const netPay = Math.max(taxableWages - employeeTaxes - postTaxDeductions, 0);
    const employerTaxes = grossPay * (employerPayrollTaxRate / 100);
    const totalEmployerOutlay = grossPay + employerTaxes;

    return {
      primaryLabel: 'Estimated Net Pay',
      primaryValue: netPay,
      primaryCurrency: true,
      metrics: [
        { label: 'Gross Pay', value: grossPay, currency: true },
        { label: 'Taxable Wages After Pretax Deductions', value: taxableWages, currency: true },
        { label: 'Estimated Employee Taxes', value: employeeTaxes, currency: true },
        { label: 'Estimated Employer Payroll Taxes', value: employerTaxes, currency: true },
        { label: 'Total Employer Outlay', value: totalEmployerOutlay, currency: true },
      ],
      notes: [
        'This payroll estimate uses a simplified tax-rate approach so the result is useful for screening and planning rather than exact withholding compliance.',
        'Pretax deductions reduce the wages exposed to the modeled employee tax rate, while post-tax deductions reduce take-home pay after taxes.',
        'Employer payroll taxes matter because the total cost of a paycheck is usually higher than the employee sees on a pay stub.',
      ],
      warnings: employeeTaxRate <= 0 ? ['A zero or missing employee tax rate will overstate take-home pay in most real payroll situations.'] : [],
    };
  }

  if (variant === 'employee-cost') {
    const payrollTaxes = annualSalary * (employerPayrollTaxRate / 100);
    const totalCost =
      annualSalary + payrollTaxes + annualBenefitsCost + annualBonus + annualEquipmentCost + annualTrainingCost;
    const loadedCostRatio = annualSalary > 0 ? totalCost / annualSalary : 0;

    return {
      primaryLabel: 'Estimated Total Annual Employee Cost',
      primaryValue: totalCost,
      primaryCurrency: true,
      metrics: [
        { label: 'Base Salary', value: annualSalary, currency: true },
        { label: 'Employer Payroll Taxes', value: payrollTaxes, currency: true },
        { label: 'Benefits Cost', value: annualBenefitsCost, currency: true },
        { label: 'Cash and Setup Add-Ons', value: annualBonus + annualEquipmentCost + annualTrainingCost, currency: true },
        { label: 'Loaded Cost Ratio', value: loadedCostRatio, suffix: 'x', decimals: 2 },
      ],
      notes: [
        'Hiring cost is rarely just salary. Payroll taxes, benefits, bonus, equipment, and training often move the real annual cost materially higher.',
        'Loaded cost ratio is useful because it shows how much the employer spends for each dollar of base salary.',
        'This model is strongest for budgeting and offer planning, especially when comparing full-time hiring against contracting or automation alternatives.',
      ],
      warnings: annualSalary <= 0 ? ['Base salary must be above zero for a meaningful employee-cost screen.'] : [],
    };
  }

  if (variant === 'pto' || variant === 'sick-leave') {
    const annualHoursBank = variant === 'pto' ? annualPtoHours : annualSickHours;
    const accrualPerPeriod = periodsPerYear > 0 ? annualHoursBank / periodsPerYear : 0;
    const accruedHours = accrualPerPeriod * periodsCompleted;
    const remainingHours = Math.max(accruedHours - leaveUsedHours, 0);
    const remainingDays = hoursPerDay > 0 ? remainingHours / hoursPerDay : 0;
    const usedPct = pct(leaveUsedHours, Math.max(accruedHours, 0));

    return {
      primaryLabel: variant === 'pto' ? 'Estimated PTO Balance' : 'Estimated Sick Leave Balance',
      primaryValue: remainingHours,
      primarySuffix: ' hours',
      primaryDecimals: 1,
      metrics: [
        { label: 'Accrual per Period', value: accrualPerPeriod, suffix: ' hrs', decimals: 2 },
        { label: 'Accrued Hours', value: accruedHours, suffix: ' hrs', decimals: 1 },
        { label: 'Used Hours', value: leaveUsedHours, suffix: ' hrs', decimals: 1 },
        { label: 'Remaining Days', value: remainingDays, suffix: ' days', decimals: 1 },
        { label: 'Usage Rate', value: usedPct, suffix: '%', decimals: 1 },
      ],
      notes: [
        'This model uses a simple accrual-per-period method, which is a practical way to estimate leave balances when policy details are known.',
        'Balance is driven by the annual leave bank, pay-period cadence, and how far through the accrual year the employee is.',
        'Use remaining hours and remaining days together because policy administration often happens in hours while employees think in days.',
      ],
      warnings: periodsPerYear <= 0 ? ['Pay periods per year must be above zero to calculate leave accrual.'] : remainingHours === 0 && leaveUsedHours > accruedHours ? ['Used leave exceeds accrued leave under the current assumptions.'] : [],
    };
  }

  if (variant === 'holiday-pay') {
    const standardHolidayPay = hourlyRate * holidayBaseHours;
    const holidayWorkPay = hourlyRate * holidayHoursWorked * holidayMultiplier;
    const totalHolidayComp = standardHolidayPay + holidayWorkPay;
    const effectiveRate = holidayHoursWorked > 0 ? holidayWorkPay / holidayHoursWorked : 0;

    return {
      primaryLabel: 'Estimated Total Holiday Compensation',
      primaryValue: totalHolidayComp,
      primaryCurrency: true,
      metrics: [
        { label: 'Base Holiday Pay', value: standardHolidayPay, currency: true },
        { label: 'Holiday Work Pay', value: holidayWorkPay, currency: true },
        { label: 'Effective Holiday Hourly Rate', value: effectiveRate, currency: true, decimals: 2 },
        { label: 'Holiday Hours Worked', value: holidayHoursWorked, decimals: 1 },
      ],
      notes: [
        'Federal law does not generally require holiday premium pay, so holiday compensation is often driven by employer policy, contract terms, or state-specific rules.',
        'This screen separates base holiday compensation from work-performed compensation so the premium portion stays visible.',
        'That makes it useful for budgeting premium shifts, union holiday rules, or internal payroll checks.',
      ],
      warnings: holidayMultiplier < 1 ? ['A holiday multiplier below 1 understates worked-holiday compensation relative to the base hourly rate.'] : [],
    };
  }

  if (variant === 'severance-pay') {
    const weeklySalary = weeksPerYear > 0 ? annualSalary / weeksPerYear : 0;
    const severanceWeeks = yearsOfService * severanceWeeksPerYear;
    const severancePay = weeklySalary * severanceWeeks;
    const hourlyEquivalent = annualHours > 0 ? annualSalary / annualHours : 0;
    const ptoPayout = unusedPtoHours * hourlyEquivalent;
    const totalPackage = severancePay + ptoPayout;

    return {
      primaryLabel: 'Estimated Total Severance Package',
      primaryValue: totalPackage,
      primaryCurrency: true,
      metrics: [
        { label: 'Weekly Salary Equivalent', value: weeklySalary, currency: true, decimals: 2 },
        { label: 'Severance Weeks', value: severanceWeeks, decimals: 1 },
        { label: 'Severance Pay', value: severancePay, currency: true },
        { label: 'Unused PTO Payout', value: ptoPayout, currency: true },
      ],
      notes: [
        'Severance policy usually depends on employer practice, contract terms, years of service, and sometimes role level.',
        'This model treats severance as weeks of pay per year of service and adds optional PTO payout so separation economics are easier to frame.',
        'Use it as a scenario tool rather than a legal entitlement calculator because final-pay and PTO rules vary by state and policy.',
      ],
      warnings: yearsOfService <= 0 ? ['Years of service must be above zero to generate a severance estimate.'] : [],
    };
  }

  if (variant === 'employee-turnover-cost') {
    const recruitingCost = recruiterFees + jobBoardCost + backgroundCheckCost + travelCost;
    const onboardingAndTraining = onboardingCost + annualTrainingCost;
    const productivityLoss = productivityRampDays * dailyProductivityCost;
    const managerCost = managerTransitionHours * managerHourlyCost;
    const totalTurnoverCost = recruitingCost + onboardingAndTraining + productivityLoss + managerCost;
    const turnoverVsSalary = annualSalary > 0 ? pct(totalTurnoverCost, annualSalary) : 0;

    return {
      primaryLabel: 'Estimated Turnover Cost per Employee',
      primaryValue: totalTurnoverCost,
      primaryCurrency: true,
      metrics: [
        { label: 'Recruiting Cost', value: recruitingCost, currency: true },
        { label: 'Onboarding and Training', value: onboardingAndTraining, currency: true },
        { label: 'Productivity Ramp Loss', value: productivityLoss, currency: true },
        { label: 'Manager Transition Cost', value: managerCost, currency: true },
        { label: 'Cost as % of Salary', value: turnoverVsSalary, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Turnover cost is usually larger than recruiting spend alone because vacancy time, onboarding, and ramp-to-productivity can dominate the total.',
        'The productivity-ramp assumption often determines whether turnover feels manageable or strategically expensive.',
        'This screen is strongest when paired with retention planning because even small reductions in avoidable exits can create meaningful savings.',
      ],
      warnings: annualSalary <= 0 ? ['Adding an annual salary baseline makes it easier to benchmark turnover cost against compensation.'] : [],
    };
  }

  if (variant === 'recruitment-cost') {
    const interviewCost = interviewHours * interviewerHourlyCost;
    const directSpend = recruiterFees + jobBoardCost + backgroundCheckCost + travelCost;
    const totalRecruitmentCost = directSpend + interviewCost;
    const costPerHire = hires > 0 ? totalRecruitmentCost / hires : 0;

    return {
      primaryLabel: 'Estimated Cost per Hire',
      primaryValue: costPerHire,
      primaryCurrency: true,
      metrics: [
        { label: 'Total Recruitment Spend', value: totalRecruitmentCost, currency: true },
        { label: 'Direct Vendor Spend', value: directSpend, currency: true },
        { label: 'Interview Time Cost', value: interviewCost, currency: true },
        { label: 'Planned Hires', value: hires, decimals: 0 },
      ],
      notes: [
        'Cost per hire becomes much more useful when interviewer time is included alongside direct recruiting spend.',
        'This model is meant for budget planning, vendor comparison, and hiring-efficiency tracking across campaigns or departments.',
        'The result is highly sensitive to the number of hires, so small-volume hiring plans often show much higher cost per hire.',
      ],
      warnings: hires <= 0 ? ['Planned hires must be above zero to calculate cost per hire.'] : [],
    };
  }

  if (variant === 'training-roi') {
    const employeeTimeCost = employeeTrainingHours * employeeHourlyRate;
    const totalTrainingCost = trainingProgramCost + employeeTimeCost;
    const totalAnnualBenefit = annualProductivityGain + annualErrorSavings + annualRetentionSavings;
    const netBenefit = totalAnnualBenefit - totalTrainingCost;
    const roi = totalTrainingCost > 0 ? (netBenefit / totalTrainingCost) * 100 : 0;
    const paybackMonths = totalAnnualBenefit > 0 ? (totalTrainingCost / totalAnnualBenefit) * 12 : 0;

    return {
      primaryLabel: 'Estimated Training ROI',
      primaryValue: roi,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Total Training Cost', value: totalTrainingCost, currency: true },
        { label: 'Total Annual Benefit', value: totalAnnualBenefit, currency: true },
        { label: 'Net Benefit', value: netBenefit, currency: true },
        { label: 'Payback Period', value: paybackMonths, suffix: ' months', decimals: 1 },
      ],
      notes: [
        'Training ROI improves when both program expense and employee time cost are counted, not just vendor or platform spend.',
        'The strongest models tie training to measurable benefits such as productivity, error reduction, retention, or faster ramp time.',
        'This result works best as a management estimate that supports prioritization and follow-up measurement rather than a perfect proof of causality.',
      ],
      warnings: totalTrainingCost <= 0 ? ['Training cost must be above zero to calculate ROI.'] : [],
    };
  }

  if (variant === 'benefits-cost') {
    const retirementMatch = annualSalary * (retirementMatchPercent / 100);
    const payrollTaxes = annualSalary * (employerPayrollTaxRate / 100);
    const totalBenefits = healthInsuranceAnnual + retirementMatch + payrollTaxes + otherBenefitsAnnual;
    const loadedCompensation = annualSalary + totalBenefits;

    return {
      primaryLabel: 'Estimated Annual Benefits Cost',
      primaryValue: totalBenefits,
      primaryCurrency: true,
      metrics: [
        { label: 'Health Insurance', value: healthInsuranceAnnual, currency: true },
        { label: 'Retirement Match', value: retirementMatch, currency: true },
        { label: 'Employer Payroll Taxes', value: payrollTaxes, currency: true },
        { label: 'Other Benefits', value: otherBenefitsAnnual, currency: true },
        { label: 'Loaded Compensation', value: loadedCompensation, currency: true },
      ],
      notes: [
        'Benefits cost is often the biggest reason total employer compensation differs from base salary alone.',
        'This screen blends health, retirement, payroll-tax, and other benefits so the annual package cost is easier to budget.',
        'Loaded compensation is useful for headcount planning because it shows the all-in cash commitment behind the role.',
      ],
      warnings: annualSalary <= 0 ? ['Base salary should be above zero if you want the benefits package to reflect a real compensation mix.'] : [],
    };
  }

  if (variant === 'workers-comp') {
    const manualPremium = (annualPayroll / 100) * workersCompRatePer100;
    const modifiedPremium = manualPremium * experienceMod;
    const finalPremium = modifiedPremium * (1 - premiumDiscountPercent / 100);

    return {
      primaryLabel: "Estimated Final Workers' Comp Premium",
      primaryValue: finalPremium,
      primaryCurrency: true,
      metrics: [
        { label: 'Manual Premium', value: manualPremium, currency: true },
        { label: 'Experience-Modified Premium', value: modifiedPremium, currency: true },
        { label: 'Experience Mod', value: experienceMod, suffix: 'x', decimals: 2 },
        { label: 'Premium Discount', value: premiumDiscountPercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        "Workers' comp premiums are commonly framed around payroll exposure, a rate per $100 of payroll, and experience modification.",
        'The experience mod matters because claims history can change premium materially even when payroll and base rates stay constant.',
        'This screen is best used for rough planning because class-code splits, audits, minimum premiums, and state rules can change the final policy cost.',
      ],
      warnings: annualPayroll <= 0 ? ["Payroll exposure must be above zero to estimate workers' comp premium."] : [],
    };
  }

  const fteCount = fullTimeHoursStandard > 0 ? totalHoursWorked / fullTimeHoursStandard : 0;
  const thirtyHourEquivalent = totalHoursWorked / (30 * 52);

  return {
    primaryLabel: 'Estimated FTE Count',
    primaryValue: fteCount,
    primaryDecimals: 2,
    metrics: [
      { label: 'Total Hours Worked', value: totalHoursWorked, decimals: 1 },
      { label: 'Full-Time Standard', value: fullTimeHoursStandard, suffix: ' hrs', decimals: 1 },
      { label: 'Hours per FTE Used', value: fullTimeHoursStandard, suffix: ' hrs', decimals: 1 },
      { label: '30-Hour Annual Benchmark', value: thirtyHourEquivalent, decimals: 2 },
    ],
    notes: [
      'FTE is a workload measure, not a headcount measure, which is why part-time staff can combine into whole full-time equivalents.',
      'The result is only as good as the full-time hours standard you choose for the period you are analyzing.',
      'That makes the tool useful for staffing plans, ACA-style thresholds, budgeting, and workload benchmarking.',
    ],
    warnings: fullTimeHoursStandard <= 0 ? ['Full-time hours standard must be above zero to calculate FTE.'] : [],
  };
}
