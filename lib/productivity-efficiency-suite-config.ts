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

export type ProductivityEfficiencyVariant =
  | 'time-tracking'
  | 'billable-hours'
  | 'utilization-rate'
  | 'productivity'
  | 'efficiency'
  | 'oee'
  | 'cycle-time'
  | 'takt-time'
  | 'lead-time'
  | 'throughput'
  | 'capacity-planning'
  | 'resource-allocation'
  | 'project-roi'
  | 'meeting-cost'
  | 'deadline';

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
  clockifyBillable: {
    label: 'Clockify Billable Hours Calculator',
    url: 'https://clockify.me/billable-hours-calculator',
  },
  clockifyTimeTracking: {
    label: 'Clockify Time Tracking Benefits',
    url: 'https://clockify.me/time-tracking-benefits',
  },
  teamworkUtilization: {
    label: 'Teamwork Utilization Rate Calculator',
    url: 'https://www.teamwork.com/resources/calculators/billable-utilization-rate/',
  },
  asanaResourcePlanning: {
    label: 'Asana Resource Planning Guide',
    url: 'https://asana.com/resources/resource-management-plan',
  },
  asanaProjectRoi: {
    label: 'Asana ROI Calculator',
    url: 'https://asana.com/roi-calculator',
  },
  oeeCalc: {
    label: 'OEE.com: Calculating OEE',
    url: 'https://www.oee.com/calculating-oee/',
  },
  oeeCycle: {
    label: 'OEE.com: Cycle Time',
    url: 'https://www.oee.com/takt-time/cycle-time/',
  },
  oeeTakt: {
    label: 'OEE.com: What Is Takt Time?',
    url: 'https://www.oee.com/takt-time/what-is-takt-time/',
  },
  oeeLead: {
    label: 'OEE.com: Lead Time',
    url: 'https://www.oee.com/takt-time/lead-time/',
  },
  oeeThroughput: {
    label: 'OEE.com: Throughput',
    url: 'https://www.oee.com/takt-time/throughput/',
  },
  oeeCapacity: {
    label: 'OEE.com: Capacity',
    url: 'https://www.oee.com/takt-time/capacity/',
  },
  hubstaffProductivity: {
    label: 'Hubstaff Productivity Metrics Guide',
    url: 'https://hubstaff.com/workforce-management/calculate-productivity',
  },
  fellowMeetingCost: {
    label: 'Fellow Meeting Cost Calculator Guide',
    url: 'https://help.fellow.app/en/articles/8194519-the-meeting-cost-calculator',
  },
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Decision-ready outputs', `The result set is designed around ${focus}, not just a single benchmark number.`),
  card('Popup-only results', 'The calculator keeps the approved advanced popup result flow instead of switching to an inline mini-summary.'),
  card('Operational context', 'Primary metrics, supporting diagnostics, and watchouts stay together so the decision is easier to read.'),
  card('Research-led feature set', 'Inputs and outputs were selected after reviewing live public calculators and productivity guides online.'),
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
    `A thin ${seed.title.toLowerCase()} usually stops at one formula answer, but real planning decisions usually depend on surrounding context such as pace, capacity, cost, or target gaps.`,
    `This advanced version keeps those related metrics visible so ${seed.concept} is easier to interpret in the same way teams actually review work, staffing, and delivery performance.`,
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

export const PRODUCTIVITY_EFFICIENCY_CONFIG: Record<ProductivityEfficiencyVariant, VariantConfig> = {
  'time-tracking': cfg({
    title: 'Time Tracking Calculator',
    subtitle: 'Compare logged time, productive time, billable time, overtime share, and billable value in one run',
    focus: 'tracked-time quality and recoverable effort',
    concept: 'time tracking',
    researchFocus: 'logged hours, productive hours, billable hours, overtime share, and time-capture quality',
    intro: 'This calculator is built for teams and independent professionals who need to understand whether tracked time is turning into productive and recoverable work, not just whether a timer ran.',
    stepTips: [
      'Enter total logged hours first so the rest of the run has a real time base.',
      'Add productive hours, billable hours, and any overtime separately instead of treating all tracked time as equal.',
      'Use the billing rate if you want the result to show the financial value of the recorded time.',
      'Read the popup as a tracking-quality dashboard, not just a total-hours report.',
    ],
    dashboardTips: [
      'Tracked hours as the anchor metric.',
      'Productive rate and billable rate to show time quality.',
      'Overtime share for workload pressure.',
      'Billable value from the tracked time block.',
    ],
    features: [
      'Tracked, productive, and billable hours in one result',
      'Overtime share visibility',
      'Billable value tied to the tracked work block',
      'Popup-only advanced results matching the approved structure',
      'Original long-form content for time-operations decisions',
      'Feature coverage informed by live tracking and billing tools',
    ],
    decisionCards: [
      card('If logged time is high but billable share is weak', 'The issue may be workflow design, internal load, or inaccurate task coding rather than a lack of effort.'),
      card('If productive time is much higher than billable time', 'The team may be doing valuable work that is not being recovered commercially.'),
      card('If overtime is rising', 'Tracking data may be exposing a workload or staffing problem before it shows up elsewhere.'),
      card('If billable value feels low', 'The rate, billable mix, or time-capture discipline may all deserve a closer look.'),
    ],
    quickRows: [
      row('Productive rate', 'Productive Hours / Logged Hours', 'Shows how much tracked time was spent in productive work.'),
      row('Billable rate', 'Billable Hours / Logged Hours', 'Shows how much tracked time was commercially recoverable.'),
      row('Overtime share', 'Overtime Hours / Logged Hours', 'Flags how much of the work block came from extended time.'),
      row('Billable value', 'Billable Hours x Hourly Rate', 'Converts recorded billable time into revenue value.'),
    ],
    references: [REF.clockifyTimeTracking, REF.clockifyBillable, REF.teamworkUtilization],
    understanding: [
      card('Tracked time is not all equal', 'A team can log many hours without creating the same level of productive or billable value.'),
      card('Recoverability matters', 'The gap between productive and billable time often explains why a busy team still feels commercially constrained.'),
      card('Overtime changes the picture', 'A time-tracking result can look strong until workload sustainability is factored in.'),
      card('Quality of capture matters', 'Poor tagging or inconsistent logging can make otherwise useful data hard to trust.'),
    ],
    faqs: [
      faq('What is the difference between logged hours and billable hours?', 'Logged hours are all recorded work hours. Billable hours are the subset that can be charged to a client or customer.', 'Basics'),
      faq('Why show productive hours separately?', 'Because productive work is not always billable, and both categories help explain the real value of the time block.', 'Method'),
      faq('Can overtime distort time-tracking metrics?', 'Yes. High overtime can make output look better in the short term while hiding sustainability issues.', 'Interpretation'),
    ],
  }),
  'billable-hours': cfg({
    title: 'Billable Hours Calculator',
    subtitle: 'Estimate billable revenue, non-billable time, billable mix, and realized rate from one work block',
    focus: 'billable mix and realized rate on logged work',
    concept: 'billable hours',
    researchFocus: 'billable share, realized rate, recoverable time, and non-billable drag',
    intro: 'This calculator is built for consultants, agencies, freelancers, and service teams that need to understand how many logged hours are actually converting into billable revenue.',
    stepTips: [
      'Enter total logged hours and billable hours as separate values instead of assuming all worked time is chargeable.',
      'Add the hourly rate you want to test so the result can translate billable time into revenue.',
      'Use the popup to compare billable revenue against the non-billable share of the work block.',
      'If you are reviewing a project portfolio, rerun the tool by client or work type so the billable mix stays clean.',
    ],
    dashboardTips: [
      'Billable revenue as the headline output.',
      'Billable and non-billable hours side by side.',
      'Billable percentage of the logged time block.',
      'Realized rate across all logged time.',
    ],
    features: [
      'Billable revenue and billable share in one screen',
      'Realized rate on total logged time',
      'Non-billable drag made visible',
      'Popup-only advanced dashboard aligned with the reference design',
      'Original content for service-delivery decision making',
      'Useful for pricing, staffing, and client portfolio reviews',
    ],
    decisionCards: [
      card('If billable revenue looks good but realized rate does not', 'Too much non-billable support work may be attached to the client or period.'),
      card('If non-billable time is heavy', 'The process may need better scope control, internal handoffs, or pricing support.'),
      card('If billable percentage is rising but margins are not', 'Rate design or labor mix may be a bigger issue than time capture.'),
      card('If one client shows a weaker billable mix', 'The account may be absorbing more unpriced work than the rest of the portfolio.'),
    ],
    quickRows: [
      row('Billable revenue', 'Billable Hours x Hourly Rate', 'Shows the recoverable value of the billed time.'),
      row('Non-billable hours', 'Logged Hours - Billable Hours', 'Shows the time that did not turn into direct billable revenue.'),
      row('Billable percentage', 'Billable Hours / Logged Hours', 'Useful for comparing projects or clients.'),
      row('Realized rate', 'Billable Revenue / Logged Hours', 'Shows the effective rate across the full time block.'),
    ],
    references: [REF.clockifyBillable, REF.clockifyTimeTracking, REF.teamworkUtilization],
    understanding: [
      card('Billable hours are a mix problem', 'The result depends on how much of the logged work block is actually chargeable.'),
      card('Revenue and rate are different lenses', 'A strong revenue result can still hide a weak realized rate if non-billable work is too high.'),
      card('Non-billable time is not always bad', 'Internal planning, training, and account support can be necessary, but the cost should still be visible.'),
      card('This metric is best used comparatively', 'Billable percentage becomes more powerful when compared across clients, teams, or project types.'),
    ],
    faqs: [
      faq('What are billable hours?', 'Billable hours are the hours worked that can be invoiced directly to a client or customer.', 'Basics'),
      faq('Why does realized rate matter?', 'Because it shows what each logged hour was effectively worth after non-billable time is included.', 'Interpretation'),
      faq('Can I use this for fixed-fee work?', 'Yes, but the interpretation changes. It becomes a way to compare actual effort against the value of the fixed-fee work delivered.', 'Use Cases'),
    ],
  }),
  'utilization-rate': cfg({
    title: 'Utilization Rate Calculator',
    subtitle: 'Compare billable hours with available capacity, target utilization, revenue at current utilization, and target gap',
    focus: 'available-capacity conversion into billable work',
    concept: 'utilization rate',
    researchFocus: 'available hours, billable hours, target utilization, and gap-to-target performance',
    intro: 'This calculator is built for service teams that need to know how much of available capacity is actually converting into billable work rather than sitting idle or being consumed by internal demands.',
    stepTips: [
      'Enter available hours first because utilization is a capacity measure, not just a logged-time measure.',
      'Add current billable hours and a target utilization percentage so the result can show both current performance and the target gap.',
      'Use the billing rate if you want current utilization translated into a revenue readout.',
      'Review the popup as a capacity-conversion dashboard instead of a simple percentage check.',
    ],
    dashboardTips: [
      'Current utilization rate as the headline metric.',
      'Target billable hours based on the utilization target you entered.',
      'Hour gap versus target.',
      'Revenue at current utilization.',
    ],
    features: [
      'Current utilization and target utilization in one run',
      'Gap-to-target hours made visible',
      'Revenue context tied to current billable performance',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Useful for workforce planning and service delivery reviews',
      'Original utilization content with live research patterns',
    ],
    decisionCards: [
      card('If utilization is below target', 'The issue may be pipeline, scope, staffing, or internal support load rather than effort alone.'),
      card('If utilization is above target for too long', 'Delivery quality or burnout risk may deserve attention alongside the strong percentage.'),
      card('If revenue lags despite healthy utilization', 'Average rate or work mix may be the bigger constraint.'),
      card('If one team misses target consistently', 'Capacity or workflow design may need a different solution than across-the-board utilization pressure.'),
    ],
    quickRows: [
      row('Utilization rate', 'Billable Hours / Available Hours', 'Measures how much capacity turned into billable work.'),
      row('Target billable hours', 'Available Hours x Target Utilization', 'Converts the goal percentage into real hours.'),
      row('Gap to target', 'Current Billable Hours - Target Billable Hours', 'Shows how far above or below plan the team is operating.'),
      row('Revenue at current utilization', 'Billable Hours x Hourly Rate', 'Adds a financial lens to the capacity result.'),
    ],
    references: [REF.teamworkUtilization, REF.clockifyBillable, REF.asanaResourcePlanning],
    understanding: [
      card('Utilization starts with capacity', 'A utilization rate is only meaningful if the available-hours assumption reflects the real working period.'),
      card('Targets should still be realistic', 'A higher target is not automatically better if it eliminates slack needed for management, QA, or business development.'),
      card('Revenue is a second-order effect', 'High utilization can still underperform financially if the rate mix or delivery mix is weak.'),
      card('This is a planning metric, not a moral score', 'The best use is diagnosing capacity conversion, not pressuring teams with a single percentage.'),
    ],
    faqs: [
      faq('What is utilization rate?', 'Utilization rate measures how much of the available capacity was spent on billable work.', 'Basics'),
      faq('Why compare current utilization with a target?', 'Because the gap helps turn a percentage into an operational planning decision.', 'Method'),
      faq('Is a higher utilization rate always better?', 'No. Extremely high utilization can reduce resilience, internal support capacity, and delivery quality.', 'Interpretation'),
    ],
  }),
  productivity: cfg({
    title: 'Productivity Calculator',
    subtitle: 'Measure output per hour, output per person, expected output, and the gap between actual and planned pace',
    focus: 'labor productivity and output pace',
    concept: 'productivity',
    researchFocus: 'output per hour, output per person, expected pace, and output variance',
    intro: 'This calculator is designed for teams that need to translate hours worked into actual output so productivity can be judged against a stated operating expectation rather than by activity alone.',
    stepTips: [
      'Enter output units and actual hours first so the base productivity rate is grounded in real work completed.',
      'Add team size and a benchmark output-per-hour assumption if you want the result to show expected output and output gap.',
      'Use the popup to compare current pace with expected pace instead of looking only at total units.',
      'If one run covers multiple product types, convert output into a comparable unit before reading the result.',
    ],
    dashboardTips: [
      'Output per hour as the lead metric.',
      'Output per person for team-level interpretation.',
      'Expected output based on the benchmark you entered.',
      'Output gap to show whether the run is ahead of or behind plan.',
    ],
    features: [
      'Output-per-hour productivity in one run',
      'Per-person and expected-output context',
      'Output gap versus benchmark',
      'Popup-only advanced dashboard aligned with the reference structure',
      'Useful for staffing, operations, and performance reviews',
      'Original content built for real delivery analysis',
    ],
    decisionCards: [
      card('If output per hour looks strong but output gap is negative', 'The benchmark may reflect a more aggressive plan than the current run actually supported.'),
      card('If output per person varies sharply', 'Work mix or staffing balance may be affecting the team more than total hours imply.'),
      card('If total output looks fine but productivity does not', 'The team may be using too many hours to reach the final volume.'),
      card('If productivity is high but quality is weak', 'The pace may not be sustainable or valuable unless quality metrics hold.'),
    ],
    quickRows: [
      row('Productivity rate', 'Output Units / Actual Hours', 'Shows how much output was produced for each labor hour.'),
      row('Output per person', 'Output Units / Team Members', 'Useful for team-normalized comparisons.'),
      row('Expected output', 'Actual Hours x Benchmark Units per Hour', 'Turns a pace target into an output expectation.'),
      row('Output gap', 'Actual Output - Expected Output', 'Shows how far the run moved from the benchmark pace.'),
    ],
    references: [REF.hubstaffProductivity, REF.asanaResourcePlanning, REF.teamworkUtilization],
    understanding: [
      card('Productivity is output-relative', 'Hours worked matter only because they are the denominator behind the output result.'),
      card('Benchmarks create context', 'A productivity figure becomes much more useful when it is compared with an expected pace.'),
      card('Team-normalized views can reveal balance issues', 'Per-person output can highlight problems that total output hides.'),
      card('Productivity is not the same as quality', 'A faster pace only helps if the output still meets the standard required.'),
    ],
    faqs: [
      faq('How is productivity usually measured?', 'A common method is output produced divided by the hours used to produce it.', 'Basics'),
      faq('Why include expected output?', 'Because a productivity number is easier to interpret when it can be compared against a known target or benchmark.', 'Method'),
      faq('Can this be used outside manufacturing?', 'Yes. Any workflow with a measurable output unit and labor time can use this framework.', 'Use Cases'),
    ],
  }),
  efficiency: cfg({
    title: 'Efficiency Calculator',
    subtitle: 'Compare standard hours with actual hours to measure efficiency rate, hour variance, and cost variance',
    focus: 'time efficiency versus standard work expectations',
    concept: 'efficiency',
    researchFocus: 'standard hours, actual hours, variance to standard, and cost impact of time deviation',
    intro: 'This calculator is built for workflows that already have a standard time expectation and need a clean way to compare actual effort with that benchmark.',
    stepTips: [
      'Enter standard hours first so the efficiency result has a benchmark to compare against.',
      'Add actual hours to show whether the work consumed more or less time than expected.',
      'Use the hourly rate if you want the variance translated into a rough cost effect.',
      'Read the popup as a variance dashboard rather than only as a percentage output.',
    ],
    dashboardTips: [
      'Efficiency rate from standard versus actual time.',
      'Hour variance showing overrun or savings.',
      'Cost variance linked to the time gap.',
      'Both standard and actual hours kept visible.',
    ],
    features: [
      'Standard-versus-actual efficiency in one run',
      'Hour variance and cost variance',
      'Useful for task analysis and standard work reviews',
      'Popup-only advanced results aligned with the site pattern',
      'Original interpretation guidance for teams and managers',
      'Simple structure that still supports operational review',
    ],
    decisionCards: [
      card('If efficiency is weak but quality is high', 'The standard may be unrealistic or the task may have become more complex than the benchmark assumes.'),
      card('If hour variance is small but cost variance is meaningful', 'Labor rate may be magnifying even modest inefficiency.'),
      card('If efficiency is strong across many runs', 'The standard may be outdated and worth resetting.'),
      card('If actual time is consistently above standard', 'The issue may be process friction, resourcing, or benchmark quality rather than individual effort.'),
    ],
    quickRows: [
      row('Efficiency rate', 'Standard Hours / Actual Hours', 'Shows how closely actual effort matched the benchmark.'),
      row('Hour variance', 'Actual Hours - Standard Hours', 'Shows whether the work ran over or under the standard.'),
      row('Cost variance', 'Hour Variance x Hourly Rate', 'Turns the time gap into an approximate labor-cost effect.'),
      row('Saved hours', 'Standard Hours - Actual Hours', 'Useful when the run finished under the benchmark.'),
    ],
    references: [REF.hubstaffProductivity, REF.asanaResourcePlanning, REF.teamworkUtilization],
    understanding: [
      card('Standards define the result', 'An efficiency rate only makes sense if the standard time is credible for the work being measured.'),
      card('Variance is often easier to act on than a percentage', 'Managers usually find the actual hour overrun or savings more actionable than the efficiency ratio alone.'),
      card('Cost puts time in business context', 'A small time gap can still matter if labor cost is high.'),
      card('Efficiency is not a full system metric', 'It is strongest when paired with workload, quality, or pace measures instead of being used alone.'),
    ],
    faqs: [
      faq('What is an efficiency rate?', 'Here it means standard hours divided by actual hours, expressed as a percentage.', 'Basics'),
      faq('Why compare standard and actual hours?', 'Because efficiency is fundamentally a benchmark comparison, not just a raw time total.', 'Method'),
      faq('Can efficiency be above 100 percent?', 'Yes. That usually means the work was completed in less time than the standard allowed.', 'Interpretation'),
    ],
  }),
  oee: cfg({
    title: 'OEE Calculator',
    subtitle: 'Measure availability, performance, quality, and total OEE from one production run',
    focus: 'availability, performance, and quality losses in one production metric',
    concept: 'overall equipment effectiveness',
    researchFocus: 'planned time, downtime, ideal cycle, total count, good count, and compounding loss categories',
    intro: 'This calculator is built for operations teams that need one result tying together equipment uptime, run speed, and good-output quality instead of looking at those loss categories separately.',
    stepTips: [
      'Enter planned production time and downtime first so the availability layer is grounded in the real operating window.',
      'Add ideal cycle time, total units, and good units so performance and quality can be calculated in the same run.',
      'Use the popup to read availability, performance, and quality before focusing on the combined OEE number.',
      'If one loss category dominates, rerun the tool after an improvement scenario to see how much the total could move.',
    ],
    dashboardTips: [
      'Overall OEE as the headline metric.',
      'Availability, performance, and quality split into separate components.',
      'Operating time kept visible for context.',
      'A cleaner loss review than a single production percentage.',
    ],
    features: [
      'Availability, performance, quality, and OEE in one model',
      'Operating-time context and loss separation',
      'Useful for manufacturing and equipment review',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on interpretation, not just formula output',
      'Supported by direct OEE reference material',
    ],
    decisionCards: [
      card('If OEE is weak but quality is strong', 'Downtime or performance drag may be the real opportunity rather than defect reduction.'),
      card('If availability is healthy but OEE still lags', 'Performance or quality loss may be doing most of the damage.'),
      card('If performance is weak', 'The run may be slow even when the equipment stays available.'),
      card('If quality loss is the main problem', 'More output alone may not help if a large share is not saleable.'),
    ],
    quickRows: [
      row('Availability', 'Operating Time / Planned Production Time', 'Measures the share of planned time the asset was actually running.'),
      row('Performance', 'Ideal Run Time / Operating Time', 'Shows whether the run speed matched the ideal pace.'),
      row('Quality', 'Good Count / Total Count', 'Shows what share of total output was good output.'),
      row('OEE', 'Availability x Performance x Quality', 'Combines the three major loss categories into one metric.'),
    ],
    references: [REF.oeeCalc, REF.oeeCycle, REF.oeeThroughput],
    understanding: [
      card('OEE is multiplicative', 'A weakness in one loss category compresses the total even if the other two look strong.'),
      card('Loss separation matters', 'The combined number is useful only when availability, performance, and quality are also visible.'),
      card('Operating time is the bridge metric', 'It connects planned time with the time actually available for good output.'),
      card('Use OEE to diagnose, not only to grade', 'Its best value is showing where improvement work should go first.'),
    ],
    faqs: [
      faq('What does OEE measure?', 'OEE measures how effectively a production asset turns planned time into good output at the intended pace.', 'Basics'),
      faq('Why not just use output volume?', 'Because output alone can hide downtime, slow running, and quality loss.', 'Method'),
      faq('Is a single OEE target enough?', 'Not usually. The component metrics still matter because they show where the real constraint sits.', 'Interpretation'),
    ],
  }),
  'cycle-time': cfg({
    title: 'Cycle Time Calculator',
    subtitle: 'Estimate minutes per unit, hourly throughput, and output capacity from one completed run',
    focus: 'time consumed for each completed unit',
    concept: 'cycle time',
    researchFocus: 'time per unit, hourly rate of completion, and pace relative to available time',
    intro: 'This calculator is designed for teams that want to understand how long one completed unit actually takes on average, not just how many units were completed by the end of a shift or sprint.',
    stepTips: [
      'Enter actual hours used and completed units so the run has a real pace measurement behind it.',
      'Add available hours if you want the result to show what the same pace implies for capacity.',
      'Read minutes per unit together with hourly throughput rather than picking only one view.',
      'If the run includes rework or mixed outputs, normalize the unit definition before interpreting the result.',
    ],
    dashboardTips: [
      'Cycle time in minutes per unit as the lead metric.',
      'Hourly throughput derived from the cycle result.',
      'Available-hours capacity estimate.',
      'Actual hours and output kept visible for auditability.',
    ],
    features: [
      'Cycle time and throughput in the same result',
      'Capacity estimate from available hours',
      'Useful for operations, service, and workflow pacing',
      'Popup-only advanced dashboard consistent with the reference flow',
      'Original content built around pace interpretation',
      'Direct cycle-time reference support',
    ],
    decisionCards: [
      card('If cycle time is improving but throughput is flat', 'Available hours, downtime, or output definition may be limiting the realized gain.'),
      card('If cycle time looks strong but demand is still missed', 'Capacity or takt alignment may still be the real issue.'),
      card('If average cycle time hides variation', 'The process may need additional review by product type or step.'),
      card('If capacity looks high on paper', 'Check whether the cycle result is sustainable at current quality and staffing levels.'),
    ],
    quickRows: [
      row('Cycle time', '(Actual Hours x 60) / Output Units', 'Shows average minutes required for one unit.'),
      row('Hourly throughput', '60 / Cycle Time', 'Converts pace into units completed each hour.'),
      row('Capacity at current pace', 'Available Hours x Hourly Throughput', 'Shows what the current pace could deliver within the available time.'),
      row('Time block', 'Actual Hours', 'Keeps the pace anchored to the run duration that produced it.'),
    ],
    references: [REF.oeeCycle, REF.oeeTakt, REF.oeeThroughput],
    understanding: [
      card('Cycle time is a pace metric', 'It answers how long each unit took on average, not how much output was produced in total.'),
      card('Throughput is the mirror image', 'One describes time per unit while the other describes units per unit of time.'),
      card('Capacity depends on available time too', 'A strong cycle time still needs enough available hours behind it to hit delivery goals.'),
      card('This metric works beyond factory lines', 'Any repeatable unit of work can use cycle time if the unit definition is consistent.'),
    ],
    faqs: [
      faq('What is cycle time?', 'Cycle time is the average time required to complete one unit of work or output.', 'Basics'),
      faq('Why show throughput too?', 'Because pace is easier to interpret when it can also be seen as units completed per hour.', 'Method'),
      faq('Can cycle time be used for service work?', 'Yes. It works anywhere a repeatable unit and the time to complete it can be measured.', 'Use Cases'),
    ],
  }),
  'takt-time': cfg({
    title: 'Takt Time Calculator',
    subtitle: 'Compare required pace from demand with your current cycle pace and the gap between the two',
    focus: 'required delivery pace from available time and customer demand',
    concept: 'takt time',
    researchFocus: 'available time, demand volume, required pace, and comparison with current cycle time',
    intro: 'This calculator is built for teams that need to translate customer demand into the production or delivery pace the process must sustain if it is going to keep up.',
    stepTips: [
      'Enter available hours and demand units for the same planning period so takt time is calculated on a consistent base.',
      'Add actual hours and output if you want to compare current cycle time with the required demand pace.',
      'Use the popup to read takt time and pace gap together instead of treating takt as a standalone number.',
      'If demand shifts through the week or month, rerun multiple scenarios rather than averaging away the pressure points.',
    ],
    dashboardTips: [
      'Takt time in minutes per unit.',
      'Demand rate per hour.',
      'Current cycle time for comparison.',
      'Pace gap showing whether the current process is ahead of or behind demand.',
    ],
    features: [
      'Demand-driven takt time and current cycle comparison',
      'Pace gap made visible instead of implied',
      'Useful for staffing, line balancing, and workflow pacing',
      'Popup-only advanced dashboard matching the approved structure',
      'Original long-form content on demand pacing',
      'Backed by direct takt-time references',
    ],
    decisionCards: [
      card('If cycle time is slower than takt time', 'The process is not keeping up with demand at the current pace.'),
      card('If takt time is very tight', 'Demand may be asking for a pace the current staffing or process cannot absorb without change.'),
      card('If demand rate looks manageable but the gap remains', 'Bottlenecks or quality loss may be interfering with the process pace.'),
      card('If takt and cycle are close', 'Small disruptions can still push the process behind demand, so slack may matter.'),
    ],
    quickRows: [
      row('Takt time', 'Available Time / Demand Units', 'Shows the pace required to satisfy demand.'),
      row('Demand rate', 'Demand Units / Available Hours', 'Shows how much output the period is asking for each hour.'),
      row('Cycle time', '(Actual Hours x 60) / Output Units', 'Used to compare current pace with the takt requirement.'),
      row('Pace gap', 'Cycle Time - Takt Time', 'Shows whether the current process is ahead of or behind demand pace.'),
    ],
    references: [REF.oeeTakt, REF.oeeCycle, REF.oeeCapacity],
    understanding: [
      card('Takt time comes from demand', 'It is not a performance score by itself. It is the pace the system needs to hit.'),
      card('Cycle time gives it meaning', 'Takt becomes actionable when you compare it with what the process is actually doing now.'),
      card('Tight takt times increase system sensitivity', 'When the required pace is aggressive, even small losses can create misses quickly.'),
      card('This is a pacing tool', 'It is best used to structure capacity and process conversations, not just to label performance.'),
    ],
    faqs: [
      faq('What is takt time?', 'Takt time is the amount of available time divided by customer demand, which gives the pace required to meet demand.', 'Basics'),
      faq('Why compare takt time with cycle time?', 'Because the gap between them shows whether the current process pace can actually keep up.', 'Method'),
      faq('Does a lower takt time mean better performance?', 'Not necessarily. A lower takt time usually means demand is asking for a faster pace.', 'Interpretation'),
    ],
  }),
  'lead-time': cfg({
    title: 'Lead Time Calculator',
    subtitle: 'Combine processing, queue, move, and inspection time to estimate total lead time and value-added ratio',
    focus: 'total elapsed time from start to finish',
    concept: 'lead time',
    researchFocus: 'processing time, waiting time, transfer time, inspection time, and value-added share',
    intro: 'This calculator is designed for teams that need to understand the full elapsed time a unit or order experiences, not just the time spent actively working on it.',
    stepTips: [
      'Enter processing time first, then add queue, move, and inspection time so the non-value-added layers stay visible.',
      'Use minutes consistently across all steps so the lead-time total can be compared cleanly.',
      'Read total lead time together with the value-added ratio to see how much of the elapsed time was actually productive work.',
      'If the process has multiple waiting stages, group them thoughtfully instead of hiding them inside one processing estimate.',
    ],
    dashboardTips: [
      'Total lead time across all modeled stages.',
      'Value-added ratio showing how much of the elapsed time was actual processing.',
      'Non-value-added time highlighted separately.',
      'Lead time converted into 8-hour-day equivalents for planning.',
    ],
    features: [
      'Processing, queue, move, and inspection time in one result',
      'Value-added ratio and non-value-added time',
      'Useful for workflow and fulfillment diagnosis',
      'Popup-only advanced dashboard consistent with the reference pattern',
      'Original content built around elapsed-time interpretation',
      'Supported by direct lead-time resources',
    ],
    decisionCards: [
      card('If queue time dominates', 'The issue may be handoffs, approvals, or capacity imbalance rather than processing speed.'),
      card('If value-added ratio is weak', 'Most elapsed time may be spent waiting rather than doing useful work.'),
      card('If lead time is acceptable but customers still complain', 'Variability, predictability, or communication may be the problem rather than the average total alone.'),
      card('If processing time is already lean', 'Further gains may come faster from attacking queue or transfer delay.'),
    ],
    quickRows: [
      row('Lead time', 'Processing + Queue + Move + Inspection', 'Measures total elapsed time through the modeled workflow.'),
      row('Value-added ratio', 'Processing Time / Lead Time', 'Shows how much of the elapsed time created direct value.'),
      row('Non-value-added time', 'Lead Time - Processing Time', 'Shows how much time was spent waiting or being handled outside processing.'),
      row('Lead days', 'Lead Time / 480', 'Converts minutes into 8-hour-day equivalents for planning.'),
    ],
    references: [REF.oeeLead, REF.oeeCycle, REF.oeeTakt],
    understanding: [
      card('Lead time is an elapsed-time lens', 'It tracks the full journey of the work item, not just the active work portion.'),
      card('Waiting usually shapes the total', 'Queue and transfer delays often affect lead time more than direct processing effort.'),
      card('Value-added ratio clarifies the waste profile', 'It helps show whether the workflow mostly works or mostly waits.'),
      card('Average lead time is only one layer', 'Predictability and spread can still matter even when the mean looks acceptable.'),
    ],
    faqs: [
      faq('What is lead time?', 'Lead time is the total elapsed time from the beginning of the process to completion or delivery.', 'Basics'),
      faq('Why separate processing from waiting time?', 'Because reducing waiting often improves lead time faster than trying to optimize already-efficient processing steps.', 'Method'),
      faq('Can lead time be used outside manufacturing?', 'Yes. Any workflow with handoffs, waiting, and completion can use this framework.', 'Use Cases'),
    ],
  }),
  throughput: cfg({
    title: 'Throughput Calculator',
    subtitle: 'Measure units per hour, daily output, good-output rate, and time per unit from one run',
    focus: 'output flow through the system over time',
    concept: 'throughput',
    researchFocus: 'units per hour, daily output, good-output rate, and pace relative to time consumed',
    intro: 'This calculator is built for teams that want to know how much output a process produces per unit of time so flow can be reviewed more directly than with end-of-period totals alone.',
    stepTips: [
      'Enter output units and actual hours for the same run or period to establish the flow rate.',
      'Add good units if you want the result to keep quality context attached to throughput instead of treating all output as equally valuable.',
      'Use the popup to compare throughput rate with time per unit before making capacity decisions.',
      'If the process mixes several product types, normalize output first so the throughput result remains comparable.',
    ],
    dashboardTips: [
      'Throughput rate in units per hour.',
      'Daily output equivalent.',
      'Good-output rate to keep quality visible.',
      'Time per unit as the inverse pace check.',
    ],
    features: [
      'Units-per-hour throughput with quality context',
      'Daily output and time-per-unit support',
      'Useful for flow, pacing, and operations reviews',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on flow interpretation',
      'Backed by direct throughput references',
    ],
    decisionCards: [
      card('If throughput looks strong but good-output rate is weak', 'The process may be moving volume without creating enough usable output.'),
      card('If daily output still misses plan', 'The available hours behind the throughput rate may be too limited.'),
      card('If throughput rises while cycle time also worsens', 'The output definition or quality mix may need to be checked.'),
      card('If throughput is stable but demand grows', 'Capacity expansion or pace improvement may be needed before the gap widens.'),
    ],
    quickRows: [
      row('Throughput rate', 'Output Units / Actual Hours', 'Shows the amount of output produced each hour.'),
      row('Daily output', 'Throughput x 8', 'Converts hourly flow into an 8-hour-day equivalent.'),
      row('Good-output rate', 'Good Units / Output Units', 'Keeps quality attached to the flow result.'),
      row('Time per unit', '(Actual Hours x 60) / Output Units', 'Gives the inverse pace lens in minutes per unit.'),
    ],
    references: [REF.oeeThroughput, REF.oeeCycle, REF.oeeCapacity],
    understanding: [
      card('Throughput is a flow metric', 'It tells you how quickly usable output is moving through the system.'),
      card('Quality still matters', 'A higher throughput number loses meaning if a weaker share of the output is acceptable or sellable.'),
      card('Time and output belong together', 'Output totals are more useful when tied directly to the time consumed to produce them.'),
      card('This metric works best with related pace tools', 'Cycle time and takt time help explain whether throughput is good enough for the demand profile.'),
    ],
    faqs: [
      faq('What is throughput?', 'Throughput is the amount of output a system produces over a given period of time.', 'Basics'),
      faq('Why include good-output rate?', 'Because high volume can be misleading if a meaningful share of that volume is not usable output.', 'Method'),
      faq('Is throughput the same as productivity?', 'Not exactly. Throughput emphasizes output flow over time, while productivity often frames output relative to labor or another input.', 'Interpretation'),
    ],
  }),
  'capacity-planning': cfg({
    title: 'Capacity Planning Calculator',
    subtitle: 'Compare gross capacity, target productive capacity, required hours, unit capacity, and the gap between demand and plan',
    focus: 'team capacity versus required delivery load',
    concept: 'capacity planning',
    researchFocus: 'team size, hours per person, productive target, required work hours, and implied output capacity',
    intro: 'This calculator is built for teams that need to convert staffing assumptions into a realistic productive-capacity number before taking on or scheduling work.',
    stepTips: [
      'Enter team size and hours per person first so gross capacity is defined before any productivity target is applied.',
      'Add the productive utilization target you want the team to operate at rather than assuming all gross hours are available for direct delivery.',
      'Enter required project hours and, if useful, a units-per-hour benchmark to translate hours into output capacity.',
      'Use the popup to compare target capacity with required hours before committing to dates or scope.',
    ],
    dashboardTips: [
      'Gross team capacity and target productive capacity.',
      'Required project hours against the planned productive capacity.',
      'Capacity gap in hours.',
      'Implied unit capacity based on the pace assumption you entered.',
    ],
    features: [
      'Gross capacity and productive target capacity in one result',
      'Capacity gap visibility before scheduling decisions are made',
      'Unit-capacity view for output-based planning',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original planning content for workload and staffing decisions',
      'Supported by live resource-planning references',
    ],
    decisionCards: [
      card('If productive capacity is below required hours', 'The plan is overloaded before execution starts and may need more people, more time, or less scope.'),
      card('If gross capacity looks healthy but target capacity does not', 'Meetings, coordination, and support work may be consuming more of the schedule than expected.'),
      card('If unit capacity is weaker than planned', 'The pace assumption may be too optimistic for the current team design.'),
      card('If the gap is small', 'Even modest disruption could push the plan into overload, so some buffer may still be warranted.'),
    ],
    quickRows: [
      row('Gross capacity', 'Team Members x Hours per Person', 'Shows the total available hours before productivity targets are applied.'),
      row('Target capacity', 'Gross Capacity x Utilization Target', 'Shows the productive share you expect to use for delivery.'),
      row('Capacity gap', 'Target Capacity - Required Hours', 'Shows whether the current plan is underloaded or overloaded.'),
      row('Unit capacity', 'Target Capacity x Units per Hour per Person', 'Translates the hours plan into an output estimate.'),
    ],
    references: [REF.asanaResourcePlanning, REF.teamworkUtilization, REF.oeeCapacity],
    understanding: [
      card('Gross hours are not the same as delivery capacity', 'A team usually cannot spend every available hour on direct productive work.'),
      card('Capacity planning works best before work starts', 'It is most useful when it is used to prevent overload rather than explain it after the fact.'),
      card('Output assumptions still matter', 'Even a balanced hours plan can fail if the expected pace per hour is unrealistic.'),
      card('Buffer is part of real planning', 'A small positive gap is often healthier than running the plan exactly at the edge.'),
    ],
    faqs: [
      faq('What is capacity planning?', 'Capacity planning compares the work that needs to be done with the time and resources available to do it.', 'Basics'),
      faq('Why use a utilization target instead of gross hours?', 'Because teams usually need some of their total time for coordination, admin, QA, and other non-direct-delivery work.', 'Method'),
      faq('Can this be used for non-manufacturing teams?', 'Yes. Any team that plans work against available hours can use the same framework.', 'Use Cases'),
    ],
  }),
  'resource-allocation': cfg({
    title: 'Resource Allocation Calculator',
    subtitle: 'Compare allocated hours with team capacity, remaining hours, overload, and people needed at the current load',
    focus: 'committed work versus available team capacity',
    concept: 'resource allocation',
    researchFocus: 'allocated hours, total capacity, overload risk, and staffing need at the current work level',
    intro: 'This calculator is designed for managers who need a fast read on whether current commitments fit inside the team they have, or whether overload is already building in the plan.',
    stepTips: [
      'Enter team size and hours per person to define the total capacity available for the planning window.',
      'Add allocated hours to show how much of that capacity is already committed.',
      'Use project hours required if you want the result to estimate the people needed at the current workload.',
      'Review remaining capacity and overload together so the plan is not judged by allocation rate alone.',
    ],
    dashboardTips: [
      'Allocation rate against full team capacity.',
      'Remaining capacity still available.',
      'Overload hours if the demand exceeds team capacity.',
      'People needed at current hours to cover the work cleanly.',
    ],
    features: [
      'Allocation rate and remaining capacity in one run',
      'Overload hours visible instead of hidden inside utilization',
      'People-needed estimate for staffing conversations',
      'Popup-only advanced dashboard consistent with the site pattern',
      'Original content focused on portfolio and staffing tradeoffs',
      'Useful for managers balancing multiple concurrent commitments',
    ],
    decisionCards: [
      card('If allocation rate is high but overload is zero', 'The team may still be workable, but there is limited room for surprise work or urgent requests.'),
      card('If remaining capacity disappears quickly', 'The portfolio may need stronger intake control even before true overload begins.'),
      card('If overload hours are large', 'The plan likely needs more people, more time, or less committed scope.'),
      card('If people needed exceeds current staffing only slightly', 'Small reprioritization may solve the problem faster than adding headcount.'),
    ],
    quickRows: [
      row('Allocation rate', 'Allocated Hours / Total Capacity', 'Shows how much of team capacity is already committed.'),
      row('Remaining capacity', 'Total Capacity - Allocated Hours', 'Shows how much usable capacity is still open.'),
      row('Overload hours', 'Required Hours - Total Capacity', 'Shows the excess hours beyond what the current team can absorb.'),
      row('People needed', 'Required Hours / Hours per Person', 'Turns the hours requirement into a staffing estimate.'),
    ],
    references: [REF.asanaResourcePlanning, REF.teamworkUtilization, REF.clockifyTimeTracking],
    understanding: [
      card('Allocation is a commitment view', 'It shows how much of the team is already spoken for before new work is accepted.'),
      card('Slack matters operationally', 'A plan with no remaining capacity can still be fragile even if it is not technically overloaded yet.'),
      card('Hours gaps become staffing decisions', 'People-needed estimates help move from diagnosis to action.'),
      card('This metric is strongest in portfolio planning', 'It becomes especially useful when several projects compete for the same people.'),
    ],
    faqs: [
      faq('What is resource allocation?', 'Resource allocation is the process of assigning available people or capacity to the work that needs to be done.', 'Basics'),
      faq('Why show remaining capacity and overload separately?', 'Because a team can have very little slack before it becomes formally overloaded, and both states matter.', 'Method'),
      faq('Can this help with portfolio planning?', 'Yes. It is useful for comparing the committed workload across projects against the same shared team capacity.', 'Use Cases'),
    ],
  }),
  'project-roi': cfg({
    title: 'Project ROI Calculator',
    subtitle: 'Estimate ROI percentage, net benefit, payback period, and benefit-cost ratio for a project investment',
    focus: 'project value relative to cost and payback timing',
    concept: 'project ROI',
    researchFocus: 'project cost, projected benefit, net value, ROI percentage, and payback timing',
    intro: 'This calculator is built for project leads and operators who need a quick way to compare the expected value of a project against its cost before it moves forward.',
    stepTips: [
      'Enter total project cost first so the investment base is explicit.',
      'Add the projected benefit you expect the project to create in savings, revenue, or avoided loss.',
      'Use the popup to compare ROI percentage with net benefit and payback period rather than relying on one number alone.',
      'If the expected benefit is uncertain, rerun multiple cases so the decision is not anchored to one optimistic assumption.',
    ],
    dashboardTips: [
      'Project ROI as the lead output.',
      'Net benefit after cost is removed from the value estimate.',
      'Payback period to show how quickly the benefit recovers the cost.',
      'Benefit-cost ratio as a second decision lens.',
    ],
    features: [
      'ROI, net benefit, payback, and benefit-cost ratio in one result',
      'Useful for project screening and prioritization',
      'Simple enough for quick portfolio review but richer than a one-line ROI formula',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content centered on practical project decisions',
      'Supported by live ROI planning references',
    ],
    decisionCards: [
      card('If ROI is healthy but payback is slow', 'The project may still be attractive, but capital timing and risk tolerance need attention.'),
      card('If benefit-cost ratio is only marginally above 1x', 'The project may not leave much room for estimation error.'),
      card('If net benefit is strong but confidence is weak', 'Scenario testing may matter more than precision in the headline ROI number.'),
      card('If two projects have similar ROI', 'Payback speed and execution complexity may be the tiebreakers.'),
    ],
    quickRows: [
      row('ROI', '(Benefit - Cost) / Cost', 'Measures return relative to the project investment.'),
      row('Net benefit', 'Projected Benefit - Project Cost', 'Shows the expected surplus value after cost is covered.'),
      row('Payback period', '(Project Cost / Project Benefit) x 12', 'Converts recovery timing into months using the modeled benefit.'),
      row('Benefit-cost ratio', 'Projected Benefit / Project Cost', 'Shows how much value is expected for each cost dollar.'),
    ],
    references: [REF.asanaProjectRoi, REF.asanaResourcePlanning, REF.teamworkUtilization],
    understanding: [
      card('ROI is only one lens', 'A project can look good on ROI and still be unattractive if the payback is slow or the assumptions are fragile.'),
      card('Net benefit helps ground the percentage', 'Decision-makers often find the value created after cost easier to understand than the ratio alone.'),
      card('Payback timing changes the conversation', 'Faster recovery can matter even when total ROI is similar.'),
      card('Scenario ranges are often smarter than single-point certainty', 'Project benefit estimates are usually strongest when they are pressure-tested.'),
    ],
    faqs: [
      faq('What is project ROI?', 'Project ROI compares the value a project is expected to create against the cost required to deliver it.', 'Basics'),
      faq('Why show benefit-cost ratio too?', 'Because some teams prefer a multiplier-style value lens in addition to a percentage return.', 'Method'),
      faq('Can a project with lower ROI still win?', 'Yes. Faster payback, lower risk, or strategic importance can still make it the better choice.', 'Interpretation'),
    ],
  }),
  'meeting-cost': cfg({
    title: 'Meeting Cost Calculator',
    subtitle: 'Estimate cost per meeting, monthly meeting cost, cost per minute, and the effect of attendee count and prep time',
    focus: 'opportunity cost of recurring meetings',
    concept: 'meeting cost',
    researchFocus: 'participant cost, meeting duration, prep time, recurrence, and opportunity-cost visibility',
    intro: 'This calculator is built for leaders who need to make meeting time visible as a real operating cost instead of treating it as a free coordination channel.',
    stepTips: [
      'Enter attendee count, average hourly cost, and meeting duration first so the base meeting cost is grounded in real labor economics.',
      'Add prep minutes if you want the result to capture work created before the meeting begins.',
      'Use the monthly frequency input for recurring meetings so the total cost reflects repetition, not just one occurrence.',
      'Read the popup as an opportunity-cost screen for meeting design, not a verdict that all meetings are bad.',
    ],
    dashboardTips: [
      'Cost per meeting as the lead output.',
      'Monthly meeting cost for recurring sessions.',
      'Cost per minute to show how quickly value needs to be created.',
      'Total participant time included in the economics.',
    ],
    features: [
      'Cost per meeting and monthly recurrence cost in one run',
      'Prep-time cost included',
      'Cost-per-minute visibility for discussion discipline',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content written for practical collaboration design',
      'Useful for recurring meeting reviews and team operations',
    ],
    decisionCards: [
      card('If cost per meeting is high', 'The attendance list, duration, or cadence may need a closer look.'),
      card('If monthly cost is far above expectations', 'Repetition may be a bigger issue than the individual meeting itself.'),
      card('If cost per minute is steep', 'The meeting may need a tighter agenda, smaller group, or a different format.'),
      card('If prep time is a large share of the total', 'The hidden work around the meeting may be as important as the live session.'),
    ],
    quickRows: [
      row('Cost per meeting', 'Participants x Hourly Cost x Total Meeting Hours', 'Measures the labor cost of one full meeting occurrence.'),
      row('Monthly cost', 'Cost per Meeting x Meetings per Month', 'Shows how recurring meetings accumulate cost over time.'),
      row('Cost per minute', 'Cost per Meeting / Meeting Minutes', 'Makes the opportunity cost easier to feel in real time.'),
      row('Total meeting minutes', 'Duration + Prep Minutes', 'Keeps hidden prep work attached to the meeting economics.'),
    ],
    references: [REF.fellowMeetingCost, REF.clockifyTimeTracking, REF.asanaResourcePlanning],
    understanding: [
      card('Meetings consume labor, not just time slots', 'The same meeting becomes much more expensive as participant count or salary mix rises.'),
      card('Recurrence changes the economics quickly', 'A tolerable single meeting can become costly when it repeats every week.'),
      card('Prep work is real cost too', 'The time required to get ready for the meeting often matters more than teams expect.'),
      card('The goal is better meeting design', 'The strongest use is improving attendance, agenda quality, and cadence rather than eliminating all collaboration time.'),
    ],
    faqs: [
      faq('How do you calculate meeting cost?', 'A common estimate multiplies participant count by labor cost and the time consumed, including prep if you want a fuller picture.', 'Basics'),
      faq('Why show monthly cost?', 'Because recurring meetings often look harmless one session at a time while becoming expensive in aggregate.', 'Method'),
      faq('Does a high meeting cost mean the meeting is bad?', 'Not automatically. It means the meeting should create enough value to justify the time it consumes.', 'Interpretation'),
    ],
  }),
  deadline: cfg({
    title: 'Deadline Calculator',
    subtitle: 'Estimate required team hours per day, effective capacity, schedule gap, and per-person pace needed to hit a deadline',
    focus: 'delivery pace required to finish the work on time',
    concept: 'deadline planning',
    researchFocus: 'work remaining, days available, effective capacity, required daily pace, and schedule feasibility',
    intro: 'This calculator is designed for delivery teams that need to translate remaining work into the pace the team must sustain each day if it is going to finish by the target deadline.',
    stepTips: [
      'Enter total work hours remaining and the number of workdays available for the same planning window.',
      'Add team size, hours per person, and an efficiency factor if you want the result to reflect usable capacity rather than idealized hours.',
      'Use the popup to compare required daily pace with current daily team capacity before committing to the deadline.',
      'If uncertainty is high, rerun the tool with more conservative efficiency or fewer available days to stress-test feasibility.',
    ],
    dashboardTips: [
      'Required team hours per day as the lead metric.',
      'Daily team capacity from current staffing and efficiency assumptions.',
      'Total effective capacity for the full window.',
      'Schedule gap and required hours per person per day.',
    ],
    features: [
      'Required pace and current capacity in one run',
      'Schedule gap visibility before execution starts',
      'Per-person daily pace to make workload concrete',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on realistic deadline planning',
      'Useful for project leads, managers, and delivery teams',
    ],
    decisionCards: [
      card('If required pace is above current daily capacity', 'The current team cannot hit the deadline without more people, more time, or less work.'),
      card('If the schedule gap is only slightly negative', 'Small scope changes or modest efficiency gains may be enough to recover the deadline.'),
      card('If required hours per person per day look unrealistic', 'The headline date may need to change even if the math technically closes.'),
      card('If efficiency assumptions are optimistic', 'The current deadline may be more fragile than it appears.'),
    ],
    quickRows: [
      row('Required team hours per day', 'Work Remaining / Workdays Available', 'Shows the daily pace the team must deliver.'),
      row('Daily team capacity', '(Team Members x Hours per Person x Efficiency) / Workdays', 'Shows the usable pace the current team can sustain.'),
      row('Schedule gap', 'Effective Capacity - Work Remaining', 'Shows whether the current plan is under or over capacity.'),
      row('Per-person daily pace', 'Required Team Hours per Day / Team Members', 'Turns the deadline into an individual daily workload expectation.'),
    ],
    references: [REF.asanaResourcePlanning, REF.asanaProjectRoi, REF.teamworkUtilization],
    understanding: [
      card('Deadlines are pace problems', 'They become much easier to judge when work remaining is converted into the daily pace required.'),
      card('Capacity needs an efficiency lens', 'Nominal hours can overstate what the team can really deliver if interruptions and coordination load are high.'),
      card('A small gap can still be risky', 'Low buffer leaves little room for rework, blocker time, or unexpected requests.'),
      card('This is a planning tool, not a guarantee', 'It helps teams surface feasibility early so they can renegotiate scope, staffing, or timing while there is still time to react.'),
    ],
    faqs: [
      faq('What does a deadline calculator show?', 'It shows the pace a team needs to maintain to finish the remaining work within the available time.', 'Basics'),
      faq('Why include efficiency?', 'Because the team rarely converts every nominal hour into focused delivery time.', 'Method'),
      faq('Can this help with deadline negotiations?', 'Yes. It turns a date discussion into explicit tradeoffs between time, scope, and capacity.', 'Use Cases'),
    ],
  }),
};
