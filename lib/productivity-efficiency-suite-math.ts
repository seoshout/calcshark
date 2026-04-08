import type { ProductivityEfficiencyVariant } from '@/lib/productivity-efficiency-suite-config';

export interface Inputs {
  availableHours: string;
  loggedHours: string;
  productiveHours: string;
  billableHours: string;
  overtimeHours: string;
  hourlyRate: string;
  outputUnits: string;
  goodUnits: string;
  totalUnits: string;
  plannedProductionMinutes: string;
  downtimeMinutes: string;
  idealCycleSeconds: string;
  customerDemandUnits: string;
  processingMinutes: string;
  queueMinutes: string;
  moveMinutes: string;
  inspectionMinutes: string;
  teamMembers: string;
  hoursPerPerson: string;
  utilizationTargetPercent: string;
  unitsPerHourPerPerson: string;
  allocatedHours: string;
  projectHoursRequired: string;
  projectBenefit: string;
  projectCost: string;
  meetingAttendees: string;
  meetingDurationMinutes: string;
  prepMinutes: string;
  meetingFrequencyPerMonth: string;
  avgHourlyCost: string;
  targetHours: string;
  workdaysAvailable: string;
  efficiencyPercent: string;
  standardHours: string;
  actualHours: string;
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
  availableHours: '160',
  loggedHours: '148',
  productiveHours: '126',
  billableHours: '112',
  overtimeHours: '6',
  hourlyRate: '95',
  outputUnits: '420',
  goodUnits: '402',
  totalUnits: '420',
  plannedProductionMinutes: '2400',
  downtimeMinutes: '210',
  idealCycleSeconds: '18',
  customerDemandUnits: '360',
  processingMinutes: '720',
  queueMinutes: '1080',
  moveMinutes: '90',
  inspectionMinutes: '60',
  teamMembers: '6',
  hoursPerPerson: '140',
  utilizationTargetPercent: '75',
  unitsPerHourPerPerson: '8',
  allocatedHours: '510',
  projectHoursRequired: '560',
  projectBenefit: '185000',
  projectCost: '92000',
  meetingAttendees: '8',
  meetingDurationMinutes: '60',
  prepMinutes: '15',
  meetingFrequencyPerMonth: '10',
  avgHourlyCost: '58',
  targetHours: '420',
  workdaysAvailable: '22',
  efficiencyPercent: '88',
  standardHours: '120',
  actualHours: '136',
};

export const DEFAULT_INPUTS: Record<ProductivityEfficiencyVariant, Inputs> = {
  'time-tracking': { ...BASE_INPUTS },
  'billable-hours': { ...BASE_INPUTS },
  'utilization-rate': { ...BASE_INPUTS },
  productivity: { ...BASE_INPUTS },
  efficiency: { ...BASE_INPUTS },
  oee: { ...BASE_INPUTS },
  'cycle-time': { ...BASE_INPUTS },
  'takt-time': { ...BASE_INPUTS },
  'lead-time': { ...BASE_INPUTS },
  throughput: { ...BASE_INPUTS },
  'capacity-planning': { ...BASE_INPUTS },
  'resource-allocation': { ...BASE_INPUTS },
  'project-roi': { ...BASE_INPUTS },
  'meeting-cost': { ...BASE_INPUTS },
  deadline: { ...BASE_INPUTS },
};

export function buildProductivityEfficiencyResult(
  variant: ProductivityEfficiencyVariant,
  inputs: Inputs
): Result {
  const availableHours = parse(inputs.availableHours);
  const loggedHours = parse(inputs.loggedHours);
  const productiveHours = parse(inputs.productiveHours);
  const billableHours = parse(inputs.billableHours);
  const overtimeHours = parse(inputs.overtimeHours);
  const hourlyRate = parse(inputs.hourlyRate);
  const outputUnits = parse(inputs.outputUnits);
  const goodUnits = parse(inputs.goodUnits);
  const totalUnits = parse(inputs.totalUnits);
  const plannedProductionMinutes = parse(inputs.plannedProductionMinutes);
  const downtimeMinutes = parse(inputs.downtimeMinutes);
  const idealCycleSeconds = parse(inputs.idealCycleSeconds);
  const customerDemandUnits = parse(inputs.customerDemandUnits);
  const processingMinutes = parse(inputs.processingMinutes);
  const queueMinutes = parse(inputs.queueMinutes);
  const moveMinutes = parse(inputs.moveMinutes);
  const inspectionMinutes = parse(inputs.inspectionMinutes);
  const teamMembers = parse(inputs.teamMembers);
  const hoursPerPerson = parse(inputs.hoursPerPerson);
  const utilizationTargetPercent = parse(inputs.utilizationTargetPercent);
  const unitsPerHourPerPerson = parse(inputs.unitsPerHourPerPerson);
  const allocatedHours = parse(inputs.allocatedHours);
  const projectHoursRequired = parse(inputs.projectHoursRequired);
  const projectBenefit = parse(inputs.projectBenefit);
  const projectCost = parse(inputs.projectCost);
  const meetingAttendees = parse(inputs.meetingAttendees);
  const meetingDurationMinutes = parse(inputs.meetingDurationMinutes);
  const prepMinutes = parse(inputs.prepMinutes);
  const meetingFrequencyPerMonth = parse(inputs.meetingFrequencyPerMonth);
  const avgHourlyCost = parse(inputs.avgHourlyCost);
  const targetHours = parse(inputs.targetHours);
  const workdaysAvailable = parse(inputs.workdaysAvailable);
  const efficiencyPercent = parse(inputs.efficiencyPercent);
  const standardHours = parse(inputs.standardHours);
  const actualHours = parse(inputs.actualHours);

  if (variant === 'time-tracking') {
    const productiveRate = pct(productiveHours, loggedHours);
    const billableRate = pct(billableHours, loggedHours);
    const overtimeShare = pct(overtimeHours, loggedHours);
    const billableValue = billableHours * hourlyRate;
    return {
      primaryLabel: 'Tracked Hours',
      primaryValue: loggedHours,
      primarySuffix: ' hrs',
      primaryDecimals: 1,
      metrics: [
        { label: 'Productive Rate', value: productiveRate, suffix: '%', decimals: 1 },
        { label: 'Billable Rate', value: billableRate, suffix: '%', decimals: 1 },
        { label: 'Overtime Share', value: overtimeShare, suffix: '%', decimals: 1 },
        { label: 'Billable Value', value: billableValue, currency: true },
      ],
      notes: [
        'This run separates logged time from productive time and billable time so tracking quality is easier to judge.',
        'The gap between productive and billable hours matters because it shows how much logged effort is not directly recoverable.',
        'Overtime share helps teams spot whether schedule pressure is creeping into normal execution.',
      ],
      warnings: loggedHours <= 0 ? ['Logged hours must be above zero to evaluate tracking quality.'] : [],
    };
  }

  if (variant === 'billable-hours') {
    const nonBillableHours = Math.max(loggedHours - billableHours, 0);
    const billableRate = pct(billableHours, loggedHours);
    const billableRevenue = billableHours * hourlyRate;
    const realizedRate = loggedHours > 0 ? billableRevenue / loggedHours : 0;
    return {
      primaryLabel: 'Billable Revenue',
      primaryValue: billableRevenue,
      primaryCurrency: true,
      metrics: [
        { label: 'Billable Hours', value: billableHours, suffix: ' hrs', decimals: 1 },
        { label: 'Non-Billable Hours', value: nonBillableHours, suffix: ' hrs', decimals: 1 },
        { label: 'Billable Percentage', value: billableRate, suffix: '%', decimals: 1 },
        { label: 'Realized Rate on Logged Time', value: realizedRate, currency: true, decimals: 2 },
      ],
      notes: [
        'Billable revenue depends on both chargeable hours and the rate attached to those hours.',
        'Non-billable time is not automatically bad, but it does affect the realized rate on the full time block you logged.',
        'This result is useful for agencies, freelancers, and teams that need pricing and workload decisions in one view.',
      ],
      warnings: loggedHours <= 0 ? ['Logged hours must be above zero to estimate billable share.'] : [],
    };
  }

  if (variant === 'utilization-rate') {
    const utilization = pct(billableHours, availableHours);
    const targetBillable = availableHours * (utilizationTargetPercent / 100);
    const hourGap = billableHours - targetBillable;
    const revenueAtCurrent = billableHours * hourlyRate;
    return {
      primaryLabel: 'Utilization Rate',
      primaryValue: utilization,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Target Billable Hours', value: targetBillable, suffix: ' hrs', decimals: 1 },
        { label: 'Hour Gap vs Target', value: hourGap, suffix: ' hrs', decimals: 1 },
        { label: 'Available Hours', value: availableHours, suffix: ' hrs', decimals: 1 },
        { label: 'Revenue at Current Utilization', value: revenueAtCurrent, currency: true },
      ],
      notes: [
        'Utilization compares billable time against total available capacity rather than against only logged time.',
        'The target gap helps show whether the issue is scheduling, pricing, staffing, or simply idle capacity.',
        'A strong utilization result is useful only if the workload remains sustainable for the team delivering it.',
      ],
      warnings: availableHours <= 0 ? ['Available hours must be above zero to calculate utilization.'] : [],
    };
  }

  if (variant === 'productivity') {
    const outputPerHour = actualHours > 0 ? outputUnits / actualHours : 0;
    const outputPerPerson = teamMembers > 0 ? outputUnits / teamMembers : 0;
    const expectedOutput = actualHours * unitsPerHourPerPerson;
    const outputGap = outputUnits - expectedOutput;
    return {
      primaryLabel: 'Output per Hour',
      primaryValue: outputPerHour,
      primarySuffix: ' units/hr',
      primaryDecimals: 2,
      metrics: [
        { label: 'Total Output', value: outputUnits, decimals: 1 },
        { label: 'Output per Person', value: outputPerPerson, suffix: ' units', decimals: 1 },
        { label: 'Expected Output', value: expectedOutput, suffix: ' units', decimals: 1 },
        { label: 'Output Gap', value: outputGap, suffix: ' units', decimals: 1 },
      ],
      notes: [
        'Productivity is framed here as output produced for each hour of labor consumed.',
        'Expected output acts as a benchmark so the result can be compared against a stated operating standard.',
        'The output gap helps move the conversation from raw volume to whether the team is pacing ahead of or behind plan.',
      ],
      warnings: actualHours <= 0 ? ['Actual hours must be above zero to measure productivity.'] : [],
    };
  }

  if (variant === 'efficiency') {
    const efficiency = actualHours > 0 ? (standardHours / actualHours) * 100 : 0;
    const hourVariance = actualHours - standardHours;
    const costVariance = hourVariance * hourlyRate;
    return {
      primaryLabel: 'Efficiency Rate',
      primaryValue: efficiency,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Standard Hours', value: standardHours, suffix: ' hrs', decimals: 1 },
        { label: 'Actual Hours', value: actualHours, suffix: ' hrs', decimals: 1 },
        { label: 'Hour Variance', value: hourVariance, suffix: ' hrs', decimals: 1 },
        { label: 'Cost Variance', value: costVariance, currency: true },
      ],
      notes: [
        'Efficiency measures how closely actual time aligns with the standard time expected for the same work.',
        'A positive hour variance means the task consumed more time than the benchmark allowed.',
        'This screen is useful when teams need a simple performance indicator without jumping directly into OEE-style manufacturing math.',
      ],
      warnings: actualHours <= 0 ? ['Actual hours must be above zero to calculate efficiency.'] : [],
    };
  }

  if (variant === 'oee') {
    const operatingMinutes = Math.max(plannedProductionMinutes - downtimeMinutes, 0);
    const availability = pct(operatingMinutes, plannedProductionMinutes);
    const idealRunMinutes = (idealCycleSeconds * totalUnits) / 60;
    const performance = operatingMinutes > 0 ? (idealRunMinutes / operatingMinutes) * 100 : 0;
    const quality = pct(goodUnits, totalUnits);
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;
    return {
      primaryLabel: 'Overall Equipment Effectiveness',
      primaryValue: oee,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Availability', value: availability, suffix: '%', decimals: 1 },
        { label: 'Performance', value: performance, suffix: '%', decimals: 1 },
        { label: 'Quality', value: quality, suffix: '%', decimals: 1 },
        { label: 'Operating Time', value: operatingMinutes, suffix: ' min', decimals: 1 },
      ],
      notes: [
        'OEE combines availability, performance, and quality so loss categories are not hidden inside one production number.',
        'The operating-time step is important because downtime directly reduces the window in which good output can be produced.',
        'If any one component collapses, the overall OEE result will compress quickly even when the other two look healthy.',
      ],
      warnings: plannedProductionMinutes <= 0 ? ['Planned production time must be above zero to calculate OEE.'] : [],
    };
  }

  if (variant === 'cycle-time') {
    const cycleMinutes = outputUnits > 0 ? (actualHours * 60) / outputUnits : 0;
    const hourlyThroughput = cycleMinutes > 0 ? 60 / cycleMinutes : 0;
    const availableUnitCapacity = availableHours > 0 ? availableHours * hourlyThroughput : 0;
    return {
      primaryLabel: 'Cycle Time',
      primaryValue: cycleMinutes,
      primarySuffix: ' min/unit',
      primaryDecimals: 2,
      metrics: [
        { label: 'Hourly Throughput', value: hourlyThroughput, suffix: ' units/hr', decimals: 2 },
        { label: 'Total Output', value: outputUnits, decimals: 1 },
        { label: 'Actual Hours', value: actualHours, suffix: ' hrs', decimals: 1 },
        { label: 'Available-Hours Capacity', value: availableUnitCapacity, suffix: ' units', decimals: 1 },
      ],
      notes: [
        'Cycle time measures how long one unit takes on average across the full time consumed in the run.',
        'A lower cycle time generally means the process can produce more units per hour if quality and staffing remain stable.',
        'This metric is most useful when paired with takt time or throughput so the pace can be benchmarked against demand.',
      ],
      warnings: outputUnits <= 0 ? ['Output units must be above zero to calculate cycle time.'] : [],
    };
  }

  if (variant === 'takt-time') {
    const availableMinutes = availableHours * 60;
    const taktMinutes = customerDemandUnits > 0 ? availableMinutes / customerDemandUnits : 0;
    const hourlyDemandRate = availableHours > 0 ? customerDemandUnits / availableHours : 0;
    const cycleMinutes = outputUnits > 0 ? (actualHours * 60) / outputUnits : 0;
    const paceGap = cycleMinutes - taktMinutes;
    return {
      primaryLabel: 'Takt Time',
      primaryValue: taktMinutes,
      primarySuffix: ' min/unit',
      primaryDecimals: 2,
      metrics: [
        { label: 'Demand Rate', value: hourlyDemandRate, suffix: ' units/hr', decimals: 2 },
        { label: 'Cycle Time', value: cycleMinutes, suffix: ' min/unit', decimals: 2 },
        { label: 'Pace Gap', value: paceGap, suffix: ' min/unit', decimals: 2 },
        { label: 'Demand Units', value: customerDemandUnits, decimals: 1 },
      ],
      notes: [
        'Takt time represents the production pace required to meet customer demand with the time available.',
        'Comparing cycle time with takt time is usually more informative than looking at either number in isolation.',
        'A positive pace gap means the current process is slower than demand is asking it to be.',
      ],
      warnings: customerDemandUnits <= 0 ? ['Demand units must be above zero to calculate takt time.'] : [],
    };
  }

  if (variant === 'lead-time') {
    const leadMinutes = processingMinutes + queueMinutes + moveMinutes + inspectionMinutes;
    const valueAddedRatio = pct(processingMinutes, leadMinutes);
    const nonValueAdded = leadMinutes - processingMinutes;
    const leadDays = leadMinutes / (8 * 60);
    return {
      primaryLabel: 'Lead Time',
      primaryValue: leadMinutes,
      primarySuffix: ' min',
      primaryDecimals: 1,
      metrics: [
        { label: 'Value-Added Ratio', value: valueAddedRatio, suffix: '%', decimals: 1 },
        { label: 'Non-Value-Added Time', value: nonValueAdded, suffix: ' min', decimals: 1 },
        { label: 'Lead Time in 8-Hour Days', value: leadDays, suffix: ' days', decimals: 2 },
        { label: 'Processing Time', value: processingMinutes, suffix: ' min', decimals: 1 },
      ],
      notes: [
        'Lead time includes waiting, moving, inspection, and processing, not just the time spent actively working on the unit.',
        'The value-added ratio helps show whether the process spends most of its time doing work or waiting between steps.',
        'Reducing queue time often changes lead time faster than shaving small amounts off processing time.',
      ],
      warnings: leadMinutes <= 0 ? ['At least one lead-time component must be above zero to calculate total lead time.'] : [],
    };
  }

  if (variant === 'throughput') {
    const unitsPerHour = actualHours > 0 ? outputUnits / actualHours : 0;
    const unitsPerDay = unitsPerHour * 8;
    const goodRate = pct(goodUnits, Math.max(outputUnits, totalUnits));
    const timePerUnit = outputUnits > 0 ? (actualHours * 60) / outputUnits : 0;
    return {
      primaryLabel: 'Throughput Rate',
      primaryValue: unitsPerHour,
      primarySuffix: ' units/hr',
      primaryDecimals: 2,
      metrics: [
        { label: 'Daily Throughput (8h)', value: unitsPerDay, suffix: ' units', decimals: 1 },
        { label: 'Output Units', value: outputUnits, decimals: 1 },
        { label: 'Good Output Rate', value: goodRate, suffix: '%', decimals: 1 },
        { label: 'Time per Unit', value: timePerUnit, suffix: ' min', decimals: 2 },
      ],
      notes: [
        'Throughput measures how much output the system produces over time, not how much effort it consumed to get there.',
        'It pairs well with cycle time because one describes pace and the other describes output flow.',
        'Good-output rate matters because high throughput with weak quality can create a misleadingly strong result.',
      ],
      warnings: actualHours <= 0 ? ['Actual hours must be above zero to calculate throughput.'] : [],
    };
  }

  if (variant === 'capacity-planning') {
    const grossCapacity = teamMembers * hoursPerPerson;
    const targetCapacity = grossCapacity * (utilizationTargetPercent / 100);
    const demandGap = targetCapacity - projectHoursRequired;
    const unitCapacity = targetCapacity * unitsPerHourPerPerson;
    return {
      primaryLabel: 'Target Productive Capacity',
      primaryValue: targetCapacity,
      primarySuffix: ' hrs',
      primaryDecimals: 1,
      metrics: [
        { label: 'Gross Team Capacity', value: grossCapacity, suffix: ' hrs', decimals: 1 },
        { label: 'Project Hours Required', value: projectHoursRequired, suffix: ' hrs', decimals: 1 },
        { label: 'Capacity Gap', value: demandGap, suffix: ' hrs', decimals: 1 },
        { label: 'Implied Unit Capacity', value: unitCapacity, suffix: ' units', decimals: 1 },
      ],
      notes: [
        'Capacity planning is strongest when it separates gross available hours from the productive share you actually intend to use.',
        'The capacity gap shows whether the plan is underloaded, balanced, or overloaded at the target utilization level.',
        'Implied unit capacity adds an output lens so leaders can convert hours into delivery expectations.',
      ],
      warnings: teamMembers <= 0 || hoursPerPerson <= 0 ? ['Team size and hours per person must both be above zero to estimate capacity.'] : [],
    };
  }

  if (variant === 'resource-allocation') {
    const totalCapacity = teamMembers * hoursPerPerson;
    const allocationRate = pct(allocatedHours, totalCapacity);
    const remainingHours = totalCapacity - allocatedHours;
    const overloadHours = Math.max(projectHoursRequired - totalCapacity, 0);
    const peopleNeeded = hoursPerPerson > 0 ? projectHoursRequired / hoursPerPerson : 0;
    return {
      primaryLabel: 'Allocation Rate',
      primaryValue: allocationRate,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Total Capacity', value: totalCapacity, suffix: ' hrs', decimals: 1 },
        { label: 'Remaining Capacity', value: remainingHours, suffix: ' hrs', decimals: 1 },
        { label: 'Overload Hours', value: overloadHours, suffix: ' hrs', decimals: 1 },
        { label: 'People Needed at Current Hours', value: peopleNeeded, suffix: ' FTE', decimals: 2 },
      ],
      notes: [
        'Allocation rate compares committed hours against the real capacity available in the team or resource pool.',
        'Remaining capacity matters because low slack can create delivery risk even before the allocation rate reaches 100 percent.',
        'People needed turns the hours gap into a resourcing conversation rather than leaving it as an abstract deficit.',
      ],
      warnings: totalCapacity <= 0 ? ['Team capacity must be above zero to calculate allocation rate.'] : [],
    };
  }

  if (variant === 'project-roi') {
    const netBenefit = projectBenefit - projectCost;
    const roi = projectCost > 0 ? (netBenefit / projectCost) * 100 : 0;
    const paybackMonths = projectBenefit > 0 ? (projectCost / projectBenefit) * 12 : 0;
    const benefitCostRatio = projectCost > 0 ? projectBenefit / projectCost : 0;
    return {
      primaryLabel: 'Project ROI',
      primaryValue: roi,
      primarySuffix: '%',
      primaryDecimals: 1,
      metrics: [
        { label: 'Net Benefit', value: netBenefit, currency: true },
        { label: 'Payback Period', value: paybackMonths, suffix: ' months', decimals: 1 },
        { label: 'Benefit-Cost Ratio', value: benefitCostRatio, suffix: 'x', decimals: 2 },
        { label: 'Project Cost', value: projectCost, currency: true },
      ],
      notes: [
        'Project ROI works best when the expected benefit is tied to real savings, revenue lift, or risk reduction rather than vague optimism.',
        'The benefit-cost ratio gives a simple second lens when percentages alone feel too abstract for decision-makers.',
        'Payback timing matters because two projects with similar ROI can create very different cash or execution pressure.',
      ],
      warnings: projectCost <= 0 ? ['Project cost must be above zero to calculate ROI.'] : [],
    };
  }

  if (variant === 'meeting-cost') {
    const totalMeetingMinutes = meetingDurationMinutes + prepMinutes;
    const costPerMeeting = meetingAttendees * avgHourlyCost * (totalMeetingMinutes / 60);
    const monthlyCost = costPerMeeting * meetingFrequencyPerMonth;
    const costPerMinute = meetingDurationMinutes > 0 ? costPerMeeting / meetingDurationMinutes : 0;
    return {
      primaryLabel: 'Cost per Meeting',
      primaryValue: costPerMeeting,
      primaryCurrency: true,
      metrics: [
        { label: 'Monthly Meeting Cost', value: monthlyCost, currency: true },
        { label: 'Cost per Minute', value: costPerMinute, currency: true, decimals: 2 },
        { label: 'Total Meeting Minutes', value: totalMeetingMinutes, suffix: ' min', decimals: 1 },
        { label: 'Participants', value: meetingAttendees, decimals: 0 },
      ],
      notes: [
        'Meeting cost rises with participant count and duration, but prep time can quietly add another meaningful cost layer.',
        'Cost per minute helps make the opportunity cost of long meetings easier to visualize.',
        'Monthly cost is useful for recurring meetings because one acceptable meeting can become expensive when repeated often.',
      ],
      warnings: meetingAttendees <= 0 ? ['Participant count must be above zero to estimate meeting cost.'] : [],
    };
  }

  const requiredHoursPerDay = workdaysAvailable > 0 ? targetHours / workdaysAvailable : 0;
  const dailyTeamCapacity = workdaysAvailable > 0 ? (teamMembers * hoursPerPerson * (efficiencyPercent / 100)) / workdaysAvailable : 0;
  const totalEffectiveCapacity = teamMembers * hoursPerPerson * (efficiencyPercent / 100);
  const scheduleGap = totalEffectiveCapacity - targetHours;
  const requiredPerPersonPerDay = teamMembers > 0 ? requiredHoursPerDay / teamMembers : 0;
  return {
    primaryLabel: 'Required Team Hours per Day',
    primaryValue: requiredHoursPerDay,
    primarySuffix: ' hrs/day',
    primaryDecimals: 2,
    metrics: [
      { label: 'Daily Team Capacity', value: dailyTeamCapacity, suffix: ' hrs/day', decimals: 2 },
      { label: 'Total Effective Capacity', value: totalEffectiveCapacity, suffix: ' hrs', decimals: 1 },
      { label: 'Schedule Gap', value: scheduleGap, suffix: ' hrs', decimals: 1 },
      { label: 'Required Hours per Person per Day', value: requiredPerPersonPerDay, suffix: ' hrs', decimals: 2 },
    ],
    notes: [
      'Deadline planning works best when total work remaining is translated into the pace the team must sustain each day.',
      'Efficiency adjustment matters because nominal team hours are not always fully usable for focused delivery.',
      'The schedule gap shows whether the current staffing and pace can realistically absorb the work before the target deadline.',
    ],
    warnings: workdaysAvailable <= 0 ? ['Workdays available must be above zero to calculate deadline pace.'] : [],
  };
}
