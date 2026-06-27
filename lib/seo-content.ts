// SEO body content for category and subcategory hub pages.
// Keyed by category slug and by "categorySlug/subcategorySlug".
// Driven by the June 2026 keyword clusters (GSC + SEMrush). Rendered by
// components/seo-content-section.tsx. Keep copy unique per page.

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoContentBlock {
  intro?: string[];
  whyHeading?: string;
  why?: string[];
  faqs?: SeoFaq[];
}

export const categoryContent: Record<string, SeoContentBlock> = {
  'finance-personal-finance': {
    intro: [
      'Calcshark’s finance calculators turn big money questions into clear numbers in seconds. Whether you are sizing up a mortgage payment, comparing loan offers, projecting compound interest, or planning for retirement, every tool is free, runs in your browser, and needs no sign-up.',
      'Personal finance is mostly arithmetic you do not want to do by hand. These calculators handle the formulas — amortization, interest accrual, future value, payoff timelines — so you can focus on the decision instead of the spreadsheet.',
    ],
    whyHeading: 'Why use a finance calculator?',
    why: [
      'Small rate and term differences compound into large amounts over the life of a loan or investment. A mortgage payment calculator shows how an extra payment shortens your term; a compound interest calculator shows how starting a year earlier changes the final balance.',
      'Running the numbers before you commit helps you compare options on the same terms, avoid costly surprises, and walk into a bank or broker already knowing what the figures should look like.',
    ],
    faqs: [
      { q: 'Are these finance calculators free?', a: 'Yes. Every finance and personal-finance calculator on Calcshark is completely free, with no account, no login, and no limits on how often you use it.' },
      { q: 'How accurate are the results?', a: 'Calculators use standard financial formulas (amortization, compound interest, present and future value). Results are estimates for planning and should be confirmed with your lender or advisor before you sign anything.' },
      { q: 'Is my financial information stored?', a: 'No. The numbers you enter are processed in your browser and are not sent to or stored on our servers.' },
      { q: 'Which calculator should I start with?', a: 'For borrowing, start with the mortgage or loan payment calculator. For growing money, use the compound interest or retirement calculator. Browse the subcategories below to find the right tool.' },
    ],
  },

  'education-academic': {
    intro: [
      'Calcshark’s education calculators help students and parents stay on top of grades and goals. Work out your GPA, the score you need on a final, a weighted average, or a pass/fail threshold — all free and instant.',
      'No more guessing what grade you need or manually averaging a semester of marks. Enter your numbers and get a clear answer you can act on.',
    ],
    whyHeading: 'Why use an academic calculator?',
    why: [
      'Grading systems mix weights, credit hours, and scales that are easy to get wrong by hand. A GPA or grade calculator applies the correct weighting so you know exactly where you stand.',
      'Knowing the score you need before an exam lets you prioritise your study time and set realistic targets for the term.',
    ],
    faqs: [
      { q: 'Can I calculate both weighted and unweighted GPA?', a: 'Yes. Our GPA tools support unweighted 4.0 scales and weighted scales that account for honors or AP credit, plus cumulative GPA across terms.' },
      { q: 'What grade do I need on my final?', a: 'Use the final grade calculator: enter your current grade, the final’s weight, and your target, and it returns the score you need to hit that goal.' },
      { q: 'Are these tools free for students?', a: 'Completely free, with no sign-up. Use them as often as you need throughout the school year.' },
    ],
  },

  'health-fitness': {
    intro: [
      'Calcshark’s health and fitness calculators help you track the numbers that matter — BMI, body-fat estimates, daily calories, macros, and recipe nutrition. Every tool is free, instant, and private.',
      'From checking a body metric to scaling a recipe to your calorie goal, these calculators translate health guidelines into specific, personal numbers you can use today.',
    ],
    whyHeading: 'Why use a health calculator?',
    why: [
      'General advice like “eat less” or “maintain a healthy weight” is hard to act on. A calorie or BMI calculator turns it into a concrete target based on your height, weight, age, and activity.',
      'Tracking the same metric over time — with consistent inputs — is the most reliable way to see whether a plan is working, far better than judging by eye.',
    ],
    faqs: [
      { q: 'Are these health calculators a substitute for medical advice?', a: 'No. They are educational tools that use standard formulas. For medical decisions, always consult a qualified healthcare professional.' },
      { q: 'How is BMI calculated?', a: 'BMI is your weight in kilograms divided by your height in metres squared (kg/m²). Our BMI calculator handles both metric and imperial units automatically.' },
      { q: 'Can I scale a recipe to my calorie target?', a: 'Yes. The recipe converter and serving-size tools rescale ingredient quantities and nutrition so a recipe fits the number of servings or calories you need.' },
      { q: 'Is my data private?', a: 'Yes. Your inputs are processed in your browser and never stored on our servers.' },
    ],
  },

  'real-estate-property': {
    intro: [
      'Calcshark’s real-estate calculators support every stage of a property decision — buying, selling, renting, and investing. Estimate days on market, home value, closing and title costs, rental yield, cap rate, and more, all free.',
      'Property is the largest transaction most people make. These tools let you pressure-test the numbers before you make an offer, list a home, or buy a rental.',
    ],
    whyHeading: 'Why use a real-estate calculator?',
    why: [
      'Returns and costs in real estate hinge on figures that are tedious to compute — amortised payments, cap rate, cash-on-cash return, closing costs. A calculator gets them right in seconds so you can compare deals fairly.',
      'For sellers, an estimate of days on market and net proceeds sets realistic expectations; for investors, accurate yield and return figures separate a good deal from a bad one.',
    ],
    faqs: [
      { q: 'What is a days on market calculator?', a: 'It estimates how long a home is likely to take to sell based on local market conditions and comparable activity, helping sellers and agents set expectations and pricing.' },
      { q: 'Can I estimate my home’s value for free?', a: 'Yes. The home value estimator gives a free, instant ballpark figure. For a precise valuation, confirm with a local agent or appraiser.' },
      { q: 'Which tools help real-estate investors?', a: 'Use the cap rate, cash-on-cash return, rental yield, and BRRRR calculators to evaluate rental and investment properties.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no sign-up, and unlimited use.' },
    ],
  },

  'construction-home-improvement': {
    intro: [
      'Calcshark’s construction calculators take the guesswork out of buying materials. Work out concrete volume, paint coverage, flooring area, roofing squares, and quantities of brick, gravel, tile, and more — free and instant.',
      'Order too little and the job stalls; order too much and you waste money. These tools give you accurate quantities, including sensible waste allowances, before you head to the supplier.',
    ],
    whyHeading: 'Why use a construction calculator?',
    why: [
      'Material estimating involves area, volume, and coverage maths that is easy to fumble on site. A dedicated calculator converts dimensions into the exact bags, gallons, boxes, or squares you need.',
      'Getting the quantity right the first time saves return trips, reduces waste, and keeps a project on schedule and on budget.',
    ],
    faqs: [
      { q: 'How much concrete do I need?', a: 'Enter your slab or footing dimensions into the concrete calculator and it returns the volume in cubic yards or metres, plus the number of bags for smaller pours.' },
      { q: 'How much paint will I need?', a: 'The paint calculator uses your wall area, number of coats, and typical coverage per gallon or litre to estimate how much paint to buy.' },
      { q: 'Do these include a waste allowance?', a: 'Where it matters — flooring, tile, roofing — the tools let you add a waste percentage so your order accounts for cuts and breakage.' },
      { q: 'Are the calculators free?', a: 'Yes, all construction and home-improvement calculators are free with no sign-up.' },
    ],
  },

  'automotive-transportation': {
    intro: [
      'Calcshark’s automotive calculators help you understand the true cost of driving and owning a vehicle. Compare fuel economy, estimate fuel cost and MPG, project depreciation and total cost of ownership, and plan maintenance — all free.',
      'From a single trip’s fuel cost to a five-year ownership budget, these tools turn vehicle decisions into clear numbers so you can buy, drive, and maintain smarter.',
    ],
    whyHeading: 'Why use an automotive calculator?',
    why: [
      'Fuel, depreciation, financing, and maintenance add up in ways that are hard to see up front. A fuel-cost or total-cost-of-ownership calculator reveals what a vehicle really costs beyond the sticker price.',
      'Comparing two cars, fuels, or commutes on the same basis helps you pick the option that actually saves money over time.',
    ],
    faqs: [
      { q: 'How do I calculate fuel cost for a trip?', a: 'Enter the distance, your vehicle’s fuel economy, and the fuel price into the fuel cost calculator; it returns the cost for the trip and per mile or kilometre.' },
      { q: 'How is MPG calculated?', a: 'MPG is miles driven divided by gallons used. The MPG calculator works it out from your odometer and fill-up figures, in both US and metric units.' },
      { q: 'Can I compare two vehicles or fuel types?', a: 'Yes. Use the fuel economy comparison, diesel-vs-gas, E85-vs-regular, and hybrid/EV savings calculators to compare options side by side.' },
      { q: 'Are these tools free?', a: 'Yes — every automotive and transportation calculator is free and needs no account.' },
    ],
  },

  'pregnancy-parenting': {
    intro: [
      'Calcshark’s pregnancy and parenting calculators support families from conception through the early years. Estimate due dates, track baby development, plan breastmilk storage, and budget for leave — all free and private.',
      'These tools turn medical guidelines and storage rules into clear, personal answers so you can plan with confidence during a busy and important time.',
    ],
    whyHeading: 'Why use a pregnancy or parenting calculator?',
    why: [
      'Dates, milestones, and storage windows are easy to lose track of. A due-date or breastmilk-storage calculator applies the right rule of thumb so you are not relying on memory.',
      'Clear timelines and budgets reduce stress and help you prepare practically — from appointments to feeding to time off work.',
    ],
    faqs: [
      { q: 'How is my due date calculated?', a: 'The due-date calculator typically counts 280 days (40 weeks) from the first day of your last menstrual period, or adjusts from a known conception or ultrasound date.' },
      { q: 'How long can I store breastmilk?', a: 'The breastmilk storage calculator gives safe storage times for room temperature, fridge, and freezer based on widely used guidelines. Always follow your provider’s advice.' },
      { q: 'Are these tools a substitute for medical care?', a: 'No. They are planning aids based on standard guidance. Consult your healthcare provider for medical decisions.' },
      { q: 'Is my information kept private?', a: 'Yes. Inputs are processed in your browser and are not stored on our servers.' },
    ],
  },

  'business-professional': {
    intro: [
      'Calcshark’s business calculators help owners, managers, and professionals make faster decisions. Work out ROI, profit margin, break-even, payroll, billable hours, productivity, and marketing returns — all free and instant.',
      'Whether you are pricing a product, evaluating a campaign, or planning headcount, these tools replace ad-hoc spreadsheets with quick, reliable answers.',
    ],
    whyHeading: 'Why use a business calculator?',
    why: [
      'Margins, returns, and break-even points drive profitability but are easy to miscalculate under pressure. A dedicated calculator applies the right formula so your decisions rest on solid numbers.',
      'Running scenarios quickly — different prices, costs, or budgets — helps you find the option that protects margin and grows the business.',
    ],
    faqs: [
      { q: 'How do I calculate ROI?', a: 'ROI is net gain divided by cost, expressed as a percentage. The ROI calculator computes it from your investment and return figures, and several tools cover marketing and project ROI specifically.' },
      { q: 'What is the difference between margin and markup?', a: 'Markup is profit as a percentage of cost; margin is profit as a percentage of selling price. Our profit margin and markup calculators handle both so you do not mix them up.' },
      { q: 'Can I calculate payroll and labour costs?', a: 'Yes. Use the payroll, hourly wage, overtime, and employee-cost calculators to estimate take-home pay and the fully loaded cost of staff.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no login, and unlimited use.' },
    ],
  },

  'mathematics-science': {
    intro: [
      'Calcshark’s math and science calculators cover the everyday and the technical — percentages, fractions, algebra, geometry, and statistics. Every tool is free, shows clear results, and runs instantly in your browser.',
      'From a quick percentage to solving a quadratic or finding the area of a shape, these calculators give accurate answers and help you check your own work.',
    ],
    whyHeading: 'Why use a math calculator?',
    why: [
      'Even simple operations are error-prone when done in a hurry. A percentage, fraction, or equation calculator removes the slip-ups and gives you a result you can trust.',
      'For students, working through the inputs reinforces the method; for everyone else, it is the fastest way to a correct answer.',
    ],
    faqs: [
      { q: 'What can I calculate here?', a: 'Percentages, ratios, fractions, exponents and roots, algebra (linear and quadratic equations), geometry (area, volume, slope, distance), and core statistics.' },
      { q: 'Do the calculators show the steps?', a: 'Many tools display the key result and the values used so you can follow the calculation, which is helpful for checking homework.' },
      { q: 'Are these free to use?', a: 'Yes — all mathematics and science calculators are free with no sign-up.' },
    ],
  },

  // pet-care intentionally omitted here: the category page already renders a
  // bespoke, in-depth pet-care content block. Subcategory entries below still apply.

  'gaming-entertainment': {
    intro: [
      'Calcshark’s gaming calculators help players optimise builds and performance. Work out DPS (damage per second), cooldown reduction and ability haste, attack speed, win rate, and more — all free and instant.',
      'Whether you are theory-crafting a build or comparing two items, these tools do the maths so you can make the choice that actually improves your output.',
    ],
    whyHeading: 'Why use a gaming calculator?',
    why: [
      'In-game numbers interact in non-obvious ways — attack speed, crit, and ability haste combine into effective DPS that is hard to estimate by feel. A DPS or cooldown calculator gives you the real figure.',
      'Comparing items, runes, or stat allocations on the same basis lets you spend gold and points where they actually move the needle.',
    ],
    faqs: [
      { q: 'How do I calculate DPS (damage per second)?', a: 'DPS is damage per hit multiplied by attacks per second (factoring crit and modifiers). The DPS calculator works it out from your damage, attack speed, and crit inputs — for example, 15 damage every 0.09 seconds is about 167 DPS.' },
      { q: 'How does cooldown reduction or ability haste work?', a: 'Ability haste scales cooldowns non-linearly: each point gives diminishing percentage reduction. The cooldown reduction calculator converts haste into effective cooldown and casts per fight.' },
      { q: 'Which games do these work for?', a: 'The formulas are general — DPS, attack speed, crit, and cooldown maths apply across most RPGs, MOBAs, and shooters. Enter your game’s stats to get a result.' },
      { q: 'Are the calculators free?', a: 'Yes — free, no account, and unlimited use.' },
    ],
  },

  'lifestyle-daily-life': {
    intro: [
      'Calcshark’s lifestyle calculators handle the small maths of everyday life — shopping savings, price-per-unit comparisons, tips, dates and times, and travel planning. All free, all instant.',
      'These are the quick tools you reach for at the shop, on a trip, or while splitting a bill — fast answers with no fuss.',
    ],
    whyHeading: 'Why use a lifestyle calculator?',
    why: [
      'Everyday decisions — which pack is cheaper, how much to tip, how many days until an event — are easy to get slightly wrong. A quick calculator gives you the exact figure in seconds.',
      'Comparing unit prices and discounts on the spot helps you spot the genuine deal rather than the one that just looks cheaper.',
    ],
    faqs: [
      { q: 'How do I compare prices by unit?', a: 'The price comparison calculator divides price by quantity so you can compare cost per unit across different pack sizes and find the better value.' },
      { q: 'Can I work out days between dates?', a: 'Yes. The time and date tools count days, weeks, or business days between two dates and add or subtract time from a start date.' },
      { q: 'Are these tools free?', a: 'Yes — every lifestyle and daily-life calculator is free and needs no sign-up.' },
    ],
  },

  'cooking-food': {
    intro: [
      'Calcshark’s cooking calculators make recipes flexible. Scale servings up or down, convert between cups, grams, and ounces, adjust baking ratios, and work out cooking times — all free and instant.',
      'Doubling a recipe or switching between metric and US measures usually means error-prone mental maths. These tools rescale ingredients and conversions accurately so dishes turn out right.',
    ],
    whyHeading: 'Why use a cooking calculator?',
    why: [
      'Recipe maths is unforgiving in baking, where ratios matter. A recipe converter or scaling calculator keeps proportions correct when you change the number of servings.',
      'Reliable conversions between weight and volume — and between metric and imperial — mean you can cook any recipe regardless of how it was written.',
    ],
    faqs: [
      { q: 'How do I scale a recipe up or down?', a: 'Enter the original servings and your target servings into the recipe scaling or converter calculator; it multiplies every ingredient by the correct factor.' },
      { q: 'How do I convert cups to grams?', a: 'The cups-to-grams and ingredient conversion tools convert by ingredient, since density differs — a cup of flour and a cup of sugar weigh different amounts.' },
      { q: 'Are these calculators free?', a: 'Yes — all cooking and food calculators are free with no account.' },
    ],
  },

  'environmental-sustainability': {
    intro: [
      'Calcshark’s environmental calculators help you measure and reduce your impact. Estimate your carbon footprint, energy and utility costs, smart-thermostat and EV savings, and waste — all free and instant.',
      'Sustainability decisions are easier when you can see the numbers. These tools turn habits and upgrades into concrete figures for emissions, energy, and money saved.',
    ],
    whyHeading: 'Why use an environmental calculator?',
    why: [
      'Impact and savings from changes like a smart thermostat or an EV are hard to judge without maths. A footprint or savings calculator quantifies them so you can prioritise what helps most.',
      'Seeing the payback and emissions reduction of an upgrade makes it easier to decide and to track progress over time.',
    ],
    faqs: [
      { q: 'How is a carbon footprint calculated?', a: 'The carbon footprint calculator converts your energy use, travel, and consumption into estimated CO2-equivalent emissions using standard emission factors.' },
      { q: 'Can I estimate savings from a smart thermostat or EV?', a: 'Yes. The smart-thermostat and EV savings calculators estimate annual energy and cost savings, plus a simple payback period, from your usage figures.' },
      { q: 'Are these tools free?', a: 'Yes — free, no login, and unlimited use.' },
    ],
  },

  'sports-recreation': {
    intro: [
      'Calcshark’s sports and recreation calculators cover performance and the outdoors. Work out passer (quarterback) rating, pace and splits, fishing-line capacity, and other sport-specific figures — all free and instant.',
      'From analysing a quarterback’s rating to spooling a reel correctly, these tools apply the exact formulas so enthusiasts and athletes get precise numbers.',
    ],
    whyHeading: 'Why use a sports calculator?',
    why: [
      'Sports stats often rely on specific formulas — passer rating, for example, combines four components with caps. A dedicated calculator applies them correctly so your numbers are right.',
      'For outdoor activities, accurate figures like line capacity or pace improve both safety and results.',
    ],
    faqs: [
      { q: 'How is quarterback (passer) rating calculated?', a: 'It combines completion percentage, yards per attempt, touchdown percentage, and interception percentage, each capped, into a single rating. The quarterback rating calculator does it from a stat line.' },
      { q: 'What is a fishing line capacity calculator?', a: 'It estimates how much line of a given diameter or pound-test a reel can hold, so you spool the right amount without overfilling.' },
      { q: 'Are these calculators free?', a: 'Yes — every sports and recreation calculator is free with no sign-up.' },
    ],
  },

  'gardening-landscaping': {
    intro: [
      'Calcshark’s gardening and landscaping calculators help you plan and buy correctly. Work out crop rotation, pond volume, mulch, soil, and lawn quantities — all free and instant.',
      'Whether you are rotating beds, lining a pond, or topping up mulch, these tools convert your measurements into the volumes and quantities you actually need.',
    ],
    whyHeading: 'Why use a gardening calculator?',
    why: [
      'Garden and landscape maths — volume of mulch or soil, pond capacity, bed rotation — is easy to underestimate. A calculator turns area and depth into the right amount to order.',
      'Planning rotations and quantities ahead of time means healthier plantings and fewer trips to the garden centre.',
    ],
    faqs: [
      { q: 'What is a crop rotation calculator?', a: 'It helps you plan which plant families to grow in each bed across seasons to protect soil health and reduce pests and disease.' },
      { q: 'How do I calculate pond volume?', a: 'Enter your pond’s dimensions into the pond volume calculator; it returns capacity in gallons or litres, useful for liners, pumps, and treatments.' },
      { q: 'Are these tools free?', a: 'Yes — all gardening and landscaping calculators are free and need no account.' },
    ],
  },

  'wedding-events': {
    intro: [
      'Calcshark’s wedding and event calculators take the stress out of planning logistics. Work out how much alcohol to buy, guest and catering quantities, budgets, and timelines — all free and instant.',
      'Events live and die by quantities and budgets. These tools turn your guest count into the bottles, portions, and pounds you need, so you neither run short nor overspend.',
    ],
    whyHeading: 'Why use a wedding or event calculator?',
    why: [
      'Estimating drinks and food for a crowd is genuinely hard — a small error per guest multiplies across a long event. A wedding alcohol calculator gets the quantities right based on guests, duration, and preferences.',
      'Clear quantities and budgets prevent last-minute shortages and overspending, and make supplier conversations much easier.',
    ],
    faqs: [
      { q: 'How much alcohol do I need for a wedding?', a: 'The wedding alcohol calculator estimates bottles of wine, beer, and spirits from your guest count, event length, and drink preferences, with a sensible buffer.' },
      { q: 'Can it help with budgets and other quantities?', a: 'Yes — event tools help with catering portions, budgets, and timelines so the whole event is planned to scale.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no sign-up, and unlimited use.' },
    ],
  },
};

export const subcategoryContent: Record<string, SeoContentBlock> = {
  'finance-personal-finance/loans-debt': {
    intro: [
      'Compare loan offers and plan your way out of debt with free loan and debt calculators. Work out a monthly loan payment, total interest, compound interest growth, and how fast extra payments clear a balance.',
      'Enter your principal, rate, and term to see the real cost of borrowing — and how small changes in rate or payment reshape the payoff.',
    ],
    faqs: [
      { q: 'How is a loan payment calculated?', a: 'The loan payment calculator uses standard amortization: your principal, interest rate, and term produce a fixed monthly payment, with each payment split between interest and principal.' },
      { q: 'How does compound interest work?', a: 'Compound interest earns interest on both your principal and previously accrued interest. The compound interest calculator shows the future balance for any rate and compounding frequency.' },
      { q: 'Will extra payments save me money?', a: 'Yes — extra principal payments cut the balance faster and reduce total interest. Use the early-payoff calculator to see the months and money saved.' },
    ],
  },
  'finance-personal-finance/mortgages': {
    intro: [
      'Plan a home loan with free mortgage calculators. Estimate your monthly mortgage payment, what you can afford, refinance savings, amortization, PMI, points, and the difference between a 15- and 30-year term.',
      'Mortgages are the largest loans most people take on, and small rate or term changes move the numbers a lot. These tools let you compare scenarios before you talk to a lender.',
    ],
    faqs: [
      { q: 'How is a monthly mortgage payment calculated?', a: 'The mortgage payment calculator combines principal and interest (from your loan amount, rate, and term) and can add taxes, insurance, and PMI for a full monthly figure.' },
      { q: 'Should I choose a 15- or 30-year mortgage?', a: 'A 15-year term has higher payments but far less total interest; a 30-year term lowers the payment but costs more overall. The 15-vs-30 comparison calculator shows both side by side.' },
      { q: 'When does refinancing make sense?', a: 'Refinancing helps when the interest saved outweighs the closing costs within your break-even period. The refinance calculator estimates the new payment and break-even point.' },
    ],
  },
  'finance-personal-finance/investments': {
    intro: [
      'Project the growth of your money with free investment calculators. Estimate returns with compound interest, ROI, annuities, net present value (NPV), and internal rate of return (IRR).',
      'Whether you are comparing opportunities or planning a long-term portfolio, these tools turn rates and time horizons into clear future values and returns.',
    ],
    faqs: [
      { q: 'How do I calculate investment ROI?', a: 'ROI is net gain divided by cost, as a percentage. The ROI calculator computes it from your invested amount and final value.' },
      { q: 'What is the difference between NPV and IRR?', a: 'NPV is the present value of future cash flows minus the investment; IRR is the discount rate that makes NPV zero. Both help compare projects on a like-for-like basis.' },
      { q: 'How much will my investment grow?', a: 'Enter your principal, expected rate, contributions, and time into the compound interest calculator to project the future balance.' },
    ],
  },
  'finance-personal-finance/retirement': {
    intro: [
      'Plan for life after work with free retirement calculators. Project a 401(k) or IRA balance, estimate retirement savings and income, model withdrawals, and work out required minimum distributions (RMDs).',
      'Retirement planning rewards starting early, and these tools show exactly how contributions, returns, and time combine into your future nest egg.',
    ],
    faqs: [
      { q: 'How much will my 401(k) be worth?', a: 'The 401(k) calculator projects your balance from current savings, contributions, employer match, expected return, and years to retirement.' },
      { q: 'What is a required minimum distribution (RMD)?', a: 'An RMD is the minimum you must withdraw from certain retirement accounts each year once you reach the required age. The RMD calculator estimates the amount from your balance and age.' },
      { q: 'How much retirement income will my savings provide?', a: 'The retirement income and withdrawal calculators estimate sustainable annual income from your savings using common withdrawal-rate assumptions.' },
    ],
  },
  'finance-personal-finance/budgeting-savings': {
    intro: [
      'Take control of your money with free budgeting and savings calculators. Set a savings goal, size an emergency fund, and plan how monthly contributions reach a target by a chosen date.',
      'Budgeting is mostly about turning intentions into numbers. These tools show how much to set aside and how long a goal will take.',
    ],
    faqs: [
      { q: 'How much should I save for an emergency fund?', a: 'A common guideline is three to six months of essential expenses. The emergency fund calculator personalises the target to your monthly costs.' },
      { q: 'How long will it take to reach my savings goal?', a: 'Enter your goal, starting amount, monthly contribution, and interest rate into the savings goal calculator to see the timeline.' },
      { q: 'Are these tools free?', a: 'Yes — every budgeting and savings calculator is free with no sign-up.' },
    ],
  },

  'education-academic/gpa-grades': {
    intro: [
      'Track your academic standing with free GPA and grade calculators. Work out a weighted or unweighted GPA, a cumulative GPA across terms, a weighted course average, or the grade you need on a final.',
      'Grading rules mix weights and credit hours that are easy to miscalculate. These tools apply them correctly so you always know where you stand.',
    ],
    faqs: [
      { q: 'How do I calculate my GPA?', a: 'Multiply each course grade point by its credit hours, sum them, and divide by total credits. The GPA calculator does this for unweighted, weighted, and cumulative GPA.' },
      { q: 'What grade do I need on my final exam?', a: 'The final grade calculator takes your current grade, the final’s weight, and your target, and returns the score you need.' },
      { q: 'What is the difference between weighted and unweighted GPA?', a: 'Unweighted GPA uses a flat 4.0 scale; weighted GPA gives extra points for honors or AP courses. Our tools support both.' },
    ],
  },
  'education-academic/test-preparation': {
    intro: [
      'Prepare smarter with free test calculators. Convert raw scores to percentages, work out pass/fail thresholds, and score true/false and multiple-choice tests instantly.',
      'Knowing the marks you need — and converting scores accurately — helps you set targets and check results with confidence.',
    ],
    faqs: [
      { q: 'How do I work out a test percentage?', a: 'Divide correct answers by total questions and multiply by 100. The test score calculator also handles weighted sections and pass marks.' },
      { q: 'What score do I need to pass?', a: 'The pass/fail calculator returns the number of correct answers required to reach a given passing percentage.' },
      { q: 'Are these tools free?', a: 'Yes — all test-preparation calculators are free and need no account.' },
    ],
  },
  'education-academic/college-planning': {
    intro: [
      'Plan and pay for higher education with free college calculators. Estimate college costs, student-loan payments, and savings needed to fund a degree.',
      'College is a major financial commitment. These tools turn tuition, aid, and loan terms into clear numbers so families can plan ahead.',
    ],
    faqs: [
      { q: 'How do I estimate the total cost of college?', a: 'The college cost calculator combines tuition, fees, living costs, and inflation across the years of study, less any expected aid.' },
      { q: 'What will my student loan payments be?', a: 'Enter the loan amount, interest rate, and repayment term into the student loan calculator to estimate the monthly payment and total interest.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no login, and unlimited use.' },
    ],
  },

  'health-fitness/body-metrics': {
    intro: [
      'Track your body composition with free body-metric calculators. Work out BMI, body-fat percentage, ideal weight, frame size, and lean muscle mass.',
      'Body metrics are most useful when measured consistently over time. These tools apply standard formulas so your figures stay comparable from week to week.',
    ],
    faqs: [
      { q: 'How is BMI calculated?', a: 'BMI is weight in kilograms divided by height in metres squared (kg/m²). The BMI calculator accepts both metric and imperial inputs.' },
      { q: 'Is BMI accurate for athletes?', a: 'BMI does not distinguish muscle from fat, so very muscular people may read as overweight. Pair it with the body-fat or muscle-mass calculator for a fuller picture.' },
      { q: 'Are these tools a substitute for a medical assessment?', a: 'No. They are educational estimates. Consult a healthcare professional for medical advice.' },
    ],
  },
  'health-fitness/nutrition-diet': {
    intro: [
      'Hit your nutrition goals with free diet calculators. Estimate daily calories and TDEE, plan macros, set a calorie deficit, and convert or scale recipes to the right number of servings.',
      'These are some of Calcshark’s most-used tools. From a recipe converter that rescales ingredients to a calorie calculator that sets a daily target, they turn diet guidance into specific numbers.',
    ],
    faqs: [
      { q: 'How many calories do I need per day?', a: 'The calorie and TDEE calculators estimate your daily needs from your age, sex, weight, height, and activity level, then adjust for weight-loss or gain goals.' },
      { q: 'How do I scale or convert a recipe?', a: 'The recipe converter and scaling calculators multiply every ingredient to match your target servings, and convert between cups, grams, and ounces.' },
      { q: 'What is a calorie deficit?', a: 'A calorie deficit means eating fewer calories than you burn, which drives weight loss. The deficit calculator sets a daily target for a chosen rate of loss.' },
    ],
  },
  'health-fitness/exercise-performance': {
    intro: [
      'Train with data using free exercise and performance calculators. Work out training load, running pace and splits, one-rep max, and heart-rate zones.',
      'Performance gains come from managing intensity and load. These tools quantify effort so you can progress safely and track improvement.',
    ],
    faqs: [
      { q: 'What is training load?', a: 'Training load combines the volume and intensity of your sessions into a single figure that helps you balance hard work with recovery. The training load calculator estimates it from your workouts.' },
      { q: 'How do I calculate running pace?', a: 'Enter distance and time into the pace calculator to get pace per mile or kilometre, plus projected split times.' },
      { q: 'Are these calculators free?', a: 'Yes — all exercise and performance calculators are free with no sign-up.' },
    ],
  },

  'real-estate-property/property-investment': {
    intro: [
      'Evaluate rental and investment property with free calculators. Work out cap rate, cash-on-cash return, net operating income (NOI), rental yield, and the BRRRR strategy numbers.',
      'A good deal lives in the figures. These tools let you screen properties quickly and compare them on the same metrics before you commit capital.',
    ],
    faqs: [
      { q: 'What is a good cap rate?', a: 'Cap rate is NOI divided by property price. What counts as “good” varies by market and risk, but the cap rate calculator lets you compare properties consistently.' },
      { q: 'What is cash-on-cash return?', a: 'It is annual pre-tax cash flow divided by the cash you invested, expressed as a percentage — a key measure for financed rentals.' },
      { q: 'What does BRRRR stand for?', a: 'Buy, Rehab, Rent, Refinance, Repeat. The BRRRR calculator models the capital you recover at refinance and the return on the deal.' },
    ],
  },
  'real-estate-property/property-management': {
    intro: [
      'Manage rentals with free property-management calculators. Work out rent increases, late fees, occupancy rate, and property depreciation.',
      'Day-to-day management involves recurring calculations that must be correct and consistent. These tools handle them so your numbers and notices are accurate.',
    ],
    faqs: [
      { q: 'How do I calculate a rent increase?', a: 'The rent increase calculator applies a percentage or fixed amount to the current rent and shows the new figure and the annual difference.' },
      { q: 'How is occupancy rate calculated?', a: 'Occupancy rate is occupied units (or nights) divided by total available, as a percentage. The occupancy calculator works it out for any period.' },
      { q: 'Are these tools free?', a: 'Yes — every property-management calculator is free and needs no account.' },
    ],
  },
  'real-estate-property/home-buying-selling': {
    intro: [
      'Buy or sell a home with confidence using free calculators. Estimate days on market, home value, closing costs, title insurance, earnest money, and agent commission.',
      'Our days-on-market and home-value tools are among the most popular here. Together these calculators help buyers budget and sellers price and net out a sale.',
    ],
    faqs: [
      { q: 'What is a days on market calculator?', a: 'It estimates how long a home is likely to take to sell, based on market conditions and comparable activity — useful for pricing and planning.' },
      { q: 'How can I estimate my home’s value for free?', a: 'The home value estimator gives a free, instant ballpark. For a precise figure, confirm with a local agent or appraiser.' },
      { q: 'What are closing costs?', a: 'Closing costs are the fees paid to finalise a purchase — title, lender, and government charges. The closing cost calculator estimates them as a share of the price.' },
    ],
  },
  'construction-home-improvement/materials-quantities': {
    intro: [
      'Order the right amount of material with free quantity calculators. Work out concrete, gravel, sand, brick, rebar, and topsoil from your project dimensions.',
      'Buying materials by guesswork wastes money and time. These tools convert length, width, and depth into the exact volumes and counts you need, with room for a waste allowance.',
    ],
    faqs: [
      { q: 'How much concrete do I need?', a: 'Enter slab or footing dimensions into the concrete calculator to get the volume in cubic yards or metres, plus bag counts for small pours.' },
      { q: 'How do I calculate gravel or topsoil?', a: 'The gravel and topsoil calculators multiply area by depth and convert to cubic yards, tonnes, or bags so you order the correct amount.' },
      { q: 'Are these calculators free?', a: 'Yes — every materials calculator is free with no sign-up.' },
    ],
  },
  'construction-home-improvement/flooring': {
    intro: [
      'Plan a flooring project with free calculators for hardwood, laminate, vinyl, tile, and carpet. Work out the area, boxes or square footage, underlayment, and waste allowance.',
      'Flooring is sold by the box or square, and cuts create waste. These tools turn room dimensions into the right order quantity so you do not run short mid-install.',
    ],
    faqs: [
      { q: 'How much flooring do I need?', a: 'Enter room dimensions into the flooring calculator; it returns the area and the number of boxes for your product, with an adjustable waste percentage.' },
      { q: 'How much waste should I allow?', a: 'A 5–10% waste allowance is typical, more for diagonal or patterned layouts. The calculators let you set the percentage.' },
      { q: 'Do you cover underlayment?', a: 'Yes — the underlayment calculator estimates how much you need for the same area.' },
    ],
  },
  'construction-home-improvement/roofing-siding': {
    intro: [
      'Estimate roofing and siding materials with free calculators. Work out roof area and squares, shingles, metal panels, siding, soffit, fascia, and gutters.',
      'Roof and exterior work depends on accurate area and pitch. These tools convert your measurements into squares and panels so quotes and orders line up.',
    ],
    faqs: [
      { q: 'What is a roofing square?', a: 'A square equals 100 square feet of roof area. The roofing calculator converts your roof dimensions and pitch into squares and the bundles of shingles needed.' },
      { q: 'How does roof pitch affect materials?', a: 'Steeper pitches increase the actual surface area over the footprint. The roof pitch and area calculators account for this so estimates are accurate.' },
      { q: 'Are these tools free?', a: 'Yes — all roofing and siding calculators are free and need no account.' },
    ],
  },
  'construction-home-improvement/paint-wall-covering': {
    intro: [
      'Buy the right amount of paint and wall covering with free calculators. Work out wall area, paint needed by coats, primer, ceiling and trim paint, and wallpaper rolls.',
      'Paint coverage varies by product and number of coats. These tools turn your wall measurements into gallons or litres so you avoid extra trips or leftover cans.',
    ],
    faqs: [
      { q: 'How much paint do I need?', a: 'The paint calculator uses wall area, number of coats, and coverage per gallon or litre to estimate how much to buy, with allowance for doors and windows.' },
      { q: 'How many wallpaper rolls will I need?', a: 'The wallpaper calculator uses wall area and roll size, accounting for pattern repeat, to estimate the number of rolls.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no sign-up, and unlimited use.' },
    ],
  },

  'automotive-transportation/vehicle-costs': {
    intro: [
      'Understand the full cost of a vehicle with free calculators. Work out auto-loan payments, depreciation, total cost of ownership, lease-vs-buy, insurance, and trade-in value.',
      'The sticker price is only the start. These tools reveal financing, depreciation, and running costs so you can compare vehicles on what they really cost to own.',
    ],
    faqs: [
      { q: 'How do I calculate a car loan payment?', a: 'The auto-loan calculator uses the loan amount, interest rate, and term to produce a monthly payment and total interest.' },
      { q: 'How fast does a car depreciate?', a: 'Most cars lose value quickest in the first few years. The car depreciation calculator estimates value over time so you can plan resale and ownership costs.' },
      { q: 'Should I lease or buy?', a: 'The lease-vs-buy calculator compares the total cost of each option over your expected ownership period.' },
    ],
  },
  'automotive-transportation/fuel-efficiency': {
    intro: [
      'Cut fuel costs with free efficiency calculators. Work out fuel cost per trip, MPG, fuel economy comparisons, gas savings, and diesel-, E85-, hybrid- and EV-versus-petrol scenarios.',
      'Fuel is a major running cost, and small efficiency differences add up over a year. These tools compare vehicles, fuels, and commutes so you can choose the cheaper option.',
    ],
    faqs: [
      { q: 'How do I calculate fuel cost?', a: 'Enter distance, fuel economy, and fuel price into the fuel cost calculator to get the trip cost and the cost per mile or kilometre.' },
      { q: 'How is MPG calculated?', a: 'MPG is miles driven divided by gallons used. The MPG calculator works it out from odometer and fill-up data in US or metric units.' },
      { q: 'Can I compare two fuels or vehicles?', a: 'Yes — the fuel economy comparison, diesel-vs-gas, E85-vs-regular, and hybrid/EV savings calculators compare options directly.' },
    ],
  },
  'automotive-transportation/maintenance-parts': {
    intro: [
      'Stay on top of upkeep with free maintenance calculators. Plan oil-change intervals, tyre life and pressure, brake-pad life, maintenance schedules, and repair-versus-replace decisions.',
      'Maintenance is cheaper than repair. These tools help you time services correctly and decide when fixing makes more sense than replacing.',
    ],
    faqs: [
      { q: 'How often should I change my oil?', a: 'The oil change interval calculator suggests a mileage or time interval based on your vehicle, oil type, and driving conditions.' },
      { q: 'How long do tyres last?', a: 'The tyre life calculator estimates remaining mileage from tread wear and driving habits so you can plan replacement.' },
      { q: 'Should I repair or replace?', a: 'The repair-vs-replace calculator weighs the repair cost against the vehicle’s value and likely future costs.' },
    ],
  },

  'pregnancy-parenting/pregnancy': {
    intro: [
      'Plan your pregnancy with free calculators. Estimate your due date, track your week of pregnancy, and plan key milestones and appointments.',
      'Pregnancy is full of dates to keep track of. These tools apply standard timing so you can plan with confidence — always alongside your provider’s advice.',
    ],
    faqs: [
      { q: 'How is my due date calculated?', a: 'The due date calculator counts 280 days (40 weeks) from the first day of your last period, or adjusts from a conception or ultrasound date.' },
      { q: 'How accurate are due-date estimates?', a: 'They are estimates; only about 1 in 20 babies arrives exactly on the due date. Treat it as a guide and follow your provider’s assessment.' },
      { q: 'Are these tools a substitute for medical care?', a: 'No. They are planning aids based on standard guidance. Consult your healthcare provider for medical decisions.' },
    ],
  },
  'pregnancy-parenting/baby-child-development': {
    intro: [
      'Support your baby’s early months with free calculators. Plan safe breastmilk storage, track growth and feeding, and follow development milestones.',
      'New parenthood comes with a lot to remember. These tools turn storage rules and growth charts into clear, personal answers.',
    ],
    faqs: [
      { q: 'How long can I store breastmilk?', a: 'The breastmilk storage calculator gives safe times for room temperature, fridge, and freezer based on widely used guidelines. Follow your provider’s advice for your situation.' },
      { q: 'How do I track my baby’s growth?', a: 'Growth tools compare weight, length, and head circumference against standard percentiles for age.' },
      { q: 'Is my information kept private?', a: 'Yes — inputs are processed in your browser and are not stored on our servers.' },
    ],
  },
  'pregnancy-parenting/family-planning': {
    intro: [
      'Plan ahead for a growing family with free calculators. Budget for maternity or paternity leave, estimate the cost of a child, and plan childcare and savings.',
      'Family decisions have real financial weight. These tools translate leave, childcare, and one-off costs into a clear budget.',
    ],
    faqs: [
      { q: 'How do I budget for parental leave?', a: 'The maternity/paternity leave budget calculator compares your reduced leave income against expenses to show the shortfall to plan for.' },
      { q: 'How much does a child cost?', a: 'Child-cost tools estimate ongoing expenses by age, helping you plan savings and budgets.' },
      { q: 'Are these calculators free?', a: 'Yes — free, no login, and unlimited use.' },
    ],
  },

  'business-professional/business-finance': {
    intro: [
      'Run the numbers behind your business with free finance calculators. Work out profit margin and markup, break-even, ROI, cash flow, gross and net profit, and business valuation.',
      'Profitability hinges on a handful of figures that must be right. These tools apply the correct formulas so pricing and planning decisions rest on solid ground.',
    ],
    faqs: [
      { q: 'What is the difference between margin and markup?', a: 'Markup is profit as a percentage of cost; margin is profit as a percentage of selling price. Our calculators handle both so you do not confuse them.' },
      { q: 'How do I calculate break-even?', a: 'The break-even calculator divides fixed costs by the contribution margin per unit to show how many units you must sell to cover costs.' },
      { q: 'Are these tools free?', a: 'Yes — every business finance calculator is free with no sign-up.' },
    ],
  },
  'business-professional/sales-marketing': {
    intro: [
      'Measure and improve campaigns with free sales and marketing calculators. Work out marketing ROI, conversion rate, customer acquisition cost (CAC), lifetime value (LTV), CPC, CPM, and A/B test significance.',
      'Marketing decisions should be evidence-led. These tools turn spend and results into the ratios that show what is actually working.',
    ],
    faqs: [
      { q: 'How do I calculate marketing ROI?', a: 'Marketing ROI is profit from a campaign divided by its cost, as a percentage. The marketing ROI calculator computes it from spend and revenue.' },
      { q: 'What is a good CAC-to-LTV ratio?', a: 'A common benchmark is an LTV at least three times CAC. Use the CAC and customer lifetime value calculators to check your ratio.' },
      { q: 'How do I know if an A/B test is significant?', a: 'The A/B test calculator computes statistical significance from your variant conversions and sample sizes.' },
    ],
  },
  'business-professional/human-resources': {
    intro: [
      'Handle people costs with free HR calculators. Work out payroll, hourly wage and overtime, PTO, the fully loaded cost of an employee, turnover cost, and severance.',
      'Staffing is most organisations’ biggest expense. These tools estimate pay and the true cost of hiring, holding, and losing employees.',
    ],
    faqs: [
      { q: 'How do I calculate the true cost of an employee?', a: 'The employee cost calculator adds taxes, benefits, and overhead to base salary for a fully loaded figure.' },
      { q: 'How is overtime pay calculated?', a: 'Overtime is typically the standard rate multiplied by an overtime factor (often 1.5×) for hours beyond the threshold. The overtime calculator works it out.' },
      { q: 'Are these calculators free?', a: 'Yes — all HR calculators are free and need no account.' },
    ],
  },
  'business-professional/productivity-efficiency': {
    intro: [
      'Improve operations with free productivity and efficiency calculators. Work out OEE, takt time, cycle time, throughput, capacity, utilisation, meeting cost, and billable hours.',
      'Efficiency lives in the numbers. These tools quantify how well time and resources are used so you can find and fix bottlenecks.',
    ],
    faqs: [
      { q: 'What is OEE?', a: 'Overall Equipment Effectiveness multiplies availability, performance, and quality into a single percentage. The OEE calculator computes it from your production data.' },
      { q: 'What is takt time?', a: 'Takt time is available production time divided by customer demand — the pace you must produce to meet demand. The takt time calculator works it out.' },
      { q: 'How much do meetings cost?', a: 'The meeting cost calculator multiplies attendee hourly rates by duration to reveal the real cost of a meeting.' },
    ],
  },

  'mathematics-science/basic-math': {
    intro: [
      'Handle everyday maths with free basic calculators. Work out percentages, fractions, ratios, exponents, square and cube roots, and scientific notation.',
      'Quick calculations are easy to fumble by hand. These tools give accurate answers and help you check your own working.',
    ],
    faqs: [
      { q: 'How do I calculate a percentage?', a: 'The percentage calculator handles “X% of Y”, percentage change, and what percentage one number is of another.' },
      { q: 'Can I work with fractions?', a: 'Yes — the fraction tools add, subtract, multiply, divide, and simplify fractions, and convert between fractions and decimals.' },
      { q: 'Are these calculators free?', a: 'Yes — every basic math calculator is free with no sign-up.' },
    ],
  },
  'mathematics-science/algebra': {
    intro: [
      'Solve equations with free algebra calculators. Work out linear and quadratic equations, systems of equations, polynomials, and logarithms.',
      'Algebra is methodical but error-prone. These tools return the solution and the values used, which is ideal for checking homework.',
    ],
    faqs: [
      { q: 'Can I solve quadratic equations?', a: 'Yes — the quadratic formula calculator returns the roots for any ax² + bx + c, including complex solutions.' },
      { q: 'Can I solve a system of equations?', a: 'The system of equations calculator solves two or more linear equations for their common solution.' },
      { q: 'Are these tools free?', a: 'Yes — all algebra calculators are free and need no account.' },
    ],
  },
  'mathematics-science/geometry': {
    intro: [
      'Work with shapes using free geometry calculators. Find area, perimeter, volume, slope, distance, and midpoint for common 2D and 3D figures.',
      'Geometry maths underpins everything from DIY to design. These tools apply the right formula so your measurements turn into accurate results.',
    ],
    faqs: [
      { q: 'How do I calculate the area of a shape?', a: 'Choose your shape in the area calculator and enter its dimensions; it applies the correct formula for circles, triangles, rectangles, and more.' },
      { q: 'How do I find slope or distance between two points?', a: 'The slope and distance calculators use coordinate geometry to compute slope, distance, and midpoint from two points.' },
      { q: 'Are these calculators free?', a: 'Yes — every geometry calculator is free with no sign-up.' },
    ],
  },
  'mathematics-science/statistics': {
    intro: [
      'Analyse data with free statistics calculators. Work out mean, median, mode, standard deviation, sample size, and more.',
      'Statistics turns raw numbers into insight. These tools handle the formulas so you get correct results for study, work, or research.',
    ],
    faqs: [
      { q: 'How do I calculate standard deviation?', a: 'The standard deviation calculator computes both population and sample standard deviation from your data set.' },
      { q: 'What sample size do I need?', a: 'The sample size calculator estimates the responses needed for a target confidence level and margin of error.' },
      { q: 'Are these tools free?', a: 'Yes — all statistics calculators are free and need no account.' },
    ],
  },

  'pet-care/pet-health-nutrition': {
    intro: [
      'Care for your pet with free health and nutrition calculators. Work out dog and cat age in human years, daily calories and feeding amounts, and pet BMI.',
      'Pet care guidance is easier to follow as specific numbers. These tools convert veterinary rules of thumb into clear, personalised answers.',
    ],
    faqs: [
      { q: 'How old is my dog or cat in human years?', a: 'The dog age and cat age calculators use modern, breed- and size-aware formulas rather than the outdated “multiply by seven” rule.' },
      { q: 'How much should I feed my pet?', a: 'Feeding calculators estimate daily calories and portions from your pet’s weight, age, and activity. Confirm with your vet for medical conditions.' },
      { q: 'Are these tools a substitute for veterinary advice?', a: 'No. They are educational estimates; always consult your veterinarian for health decisions.' },
    ],
  },
  'pet-care/pet-care-costs': {
    intro: [
      'Budget for your pet with free cost calculators. Estimate spay/neuter cost, boarding, lifetime cost of ownership, and pet insurance value.',
      'Pets are a long-term financial commitment. These tools turn one-off and recurring costs into a clear budget so there are no surprises.',
    ],
    faqs: [
      { q: 'How much does spaying or neutering cost?', a: 'The spay/neuter cost calculator estimates a range based on your pet’s species, size, and typical clinic pricing.' },
      { q: 'How much does pet boarding cost?', a: 'The boarding cost calculator multiplies nightly rates by your stay and adds common extras for a total estimate.' },
      { q: 'Are these calculators free?', a: 'Yes — every pet care cost calculator is free with no sign-up.' },
    ],
  },

  'gaming-entertainment/gaming-performance': {
    intro: [
      'Optimise your gameplay with free performance calculators. Work out DPS (damage per second), cooldown reduction and ability haste, attack speed, win rate, and FPS.',
      'These are Calcshark’s most-used gaming tools. DPS and cooldown maths interact in non-obvious ways, so a calculator gives you the real effective numbers behind a build.',
    ],
    faqs: [
      { q: 'How do I calculate DPS?', a: 'DPS is damage per hit times attacks per second, adjusted for crit and modifiers. For example, 15 damage every 0.09 seconds is about 167 DPS — the DPS calculator does the maths for you.' },
      { q: 'How does ability haste or cooldown reduction work?', a: 'Ability haste reduces cooldowns with diminishing returns per point. The cooldown reduction calculator converts haste into effective cooldown and extra casts.' },
      { q: 'Do these work for my game?', a: 'The formulas are general and apply across most RPGs, MOBAs, and shooters. Enter your in-game stats to get a result.' },
    ],
  },
  'gaming-entertainment/character-build-planning': {
    intro: [
      'Plan stronger characters with free build calculators. Work out power level, stat allocation, experience (XP) to the next level, and build comparisons.',
      'Smart builds come from comparing options on the same basis. These tools quantify the impact of stats and items so you invest points where they matter.',
    ],
    faqs: [
      { q: 'How do I calculate power level?', a: 'The power level calculator combines your character’s key stats into a single comparable figure so you can gauge progress and compare builds.' },
      { q: 'How much XP do I need to level up?', a: 'The XP calculator estimates the experience required to reach a target level from your current progress.' },
      { q: 'Are these tools free?', a: 'Yes — every build-planning calculator is free with no account.' },
    ],
  },

  'lifestyle-daily-life/time-date': {
    intro: [
      'Handle dates and times with free calculators. Count days between dates, add or subtract time, work out age, and find deadlines and business days.',
      'Date maths is fiddly — months and leap years trip people up. These tools give exact answers for planning, deadlines, and anniversaries.',
    ],
    faqs: [
      { q: 'How do I count days between two dates?', a: 'The date difference calculator returns the number of days, weeks, or business days between any two dates.' },
      { q: 'Can I add or subtract time from a date?', a: 'Yes — enter a start date and a duration to get the resulting date, accounting for months and leap years.' },
      { q: 'Are these calculators free?', a: 'Yes — all time and date calculators are free with no sign-up.' },
    ],
  },
  'lifestyle-daily-life/shopping-savings': {
    intro: [
      'Shop smarter with free savings calculators. Compare unit prices, work out discounts and sale prices, split bills, and calculate tips.',
      'The cheapest-looking option is not always the best value. These tools reveal the real cost per unit and the true saving so you spend wisely.',
    ],
    faqs: [
      { q: 'How do I compare prices by unit?', a: 'The price comparison calculator divides price by quantity to show cost per unit across pack sizes, so you can find genuine value.' },
      { q: 'How do I calculate a discount?', a: 'The discount calculator applies a percentage off to show the sale price and the amount saved.' },
      { q: 'Are these tools free?', a: 'Yes — every shopping and savings calculator is free and needs no account.' },
    ],
  },
  'lifestyle-daily-life/travel': {
    intro: [
      'Plan trips with free travel calculators. Estimate trip fuel and cost, commute costs, currency conversions, and travel budgets.',
      'Travel costs add up across fuel, time, and spending money. These tools turn your route and plans into a clear budget.',
    ],
    faqs: [
      { q: 'How do I estimate fuel cost for a trip?', a: 'The trip fuel calculator uses distance, your vehicle’s economy, and fuel price to estimate the fuel cost for the journey.' },
      { q: 'Can I work out my commute cost?', a: 'Yes — the commute cost calculator totals fuel, tolls, and time over a week, month, or year.' },
      { q: 'Are these calculators free?', a: 'Yes — all travel calculators are free with no sign-up.' },
    ],
  },

  'cooking-food/recipe-calculations': {
    intro: [
      'Adjust any recipe with free calculation tools. Scale servings up or down, convert recipes, adjust baking ratios, and resize for the pan you have.',
      'Recipe maths matters most in baking, where ratios are unforgiving. These tools rescale ingredients accurately so dishes come out right every time.',
    ],
    faqs: [
      { q: 'How do I scale a recipe?', a: 'Enter the original and target servings into the recipe scaling or converter calculator; every ingredient is multiplied by the correct factor.' },
      { q: 'How do I adjust for a different pan size?', a: 'The baking pan conversion calculator rescales quantities based on pan area so depth and bake time stay sensible.' },
      { q: 'Are these calculators free?', a: 'Yes — every recipe calculator is free with no account.' },
    ],
  },
  'cooking-food/kitchen-measurements': {
    intro: [
      'Convert kitchen measurements with free tools. Switch between cups, grams, ounces, tablespoons, and millilitres, and convert by ingredient.',
      'Recipes are written in different units around the world. These tools convert accurately — including by ingredient, since a cup of flour and a cup of sugar weigh differently.',
    ],
    faqs: [
      { q: 'How do I convert cups to grams?', a: 'The cups-to-grams calculator converts by ingredient because density varies, giving accurate weights for flour, sugar, butter, and more.' },
      { q: 'Can I convert between metric and imperial?', a: 'Yes — the measurement tools convert volume and weight between US, imperial, and metric units.' },
      { q: 'Are these tools free?', a: 'Yes — all kitchen measurement calculators are free with no sign-up.' },
    ],
  },

  'environmental-sustainability/energy-utilities': {
    intro: [
      'Cut energy use and bills with free calculators. Estimate smart-thermostat savings, EV charging savings, electricity costs, and appliance running costs.',
      'Energy upgrades pay off in ways that are hard to judge by eye. These tools quantify savings and payback so you can prioritise the changes that help most.',
    ],
    faqs: [
      { q: 'How much can a smart thermostat save?', a: 'The smart thermostat savings calculator estimates annual energy and cost savings, plus a simple payback period, from your heating and cooling use.' },
      { q: 'How much does it cost to charge an EV?', a: 'The EV savings calculator compares charging costs against petrol to estimate your savings per mile and per year.' },
      { q: 'Are these calculators free?', a: 'Yes — every energy calculator is free with no account.' },
    ],
  },
  'environmental-sustainability/carbon-waste': {
    intro: [
      'Measure and reduce your impact with free calculators. Estimate your carbon footprint, food waste, and recycling impact.',
      'Reducing impact starts with measuring it. These tools convert your habits into emissions and waste figures so you can target the biggest wins.',
    ],
    faqs: [
      { q: 'How is a carbon footprint calculated?', a: 'The carbon footprint calculator converts your energy, travel, and consumption into estimated CO2-equivalent emissions using standard factors.' },
      { q: 'Can I measure food waste?', a: 'Yes — the food waste calculator estimates the cost and emissions of wasted food so you can cut both.' },
      { q: 'Are these tools free?', a: 'Yes — all carbon and waste calculators are free with no sign-up.' },
    ],
  },

  'sports-recreation/sports-performance': {
    intro: [
      'Analyse performance with free sports calculators. Work out quarterback (passer) rating, pace and splits, and other sport-specific metrics.',
      'Sports stats often rely on exact formulas. These tools apply them correctly so your numbers stand up to scrutiny.',
    ],
    faqs: [
      { q: 'How is quarterback (passer) rating calculated?', a: 'It combines completion percentage, yards per attempt, touchdown percentage, and interception percentage — each capped — into one rating. The quarterback rating calculator does it from a stat line.' },
      { q: 'How do I calculate running pace?', a: 'Enter distance and time into the pace calculator for pace per mile or kilometre and projected splits.' },
      { q: 'Are these calculators free?', a: 'Yes — every sports performance calculator is free with no account.' },
    ],
  },
  'sports-recreation/outdoor-activities': {
    intro: [
      'Gear up for the outdoors with free calculators. Work out fishing-line capacity, ski and snowboard sizing, and other activity-specific figures.',
      'The right numbers make outdoor gear safer and more effective. These tools size equipment correctly from your inputs.',
    ],
    faqs: [
      { q: 'What is a fishing line capacity calculator?', a: 'It estimates how much line of a given diameter or pound-test a reel holds, so you spool the right amount without overfilling.' },
      { q: 'How do I choose ski or snowboard size?', a: 'The sizing calculator suggests a length range from your height, weight, and ability level.' },
      { q: 'Are these tools free?', a: 'Yes — all outdoor activity calculators are free with no sign-up.' },
    ],
  },

  'gardening-landscaping/garden-planning': {
    intro: [
      'Plan productive beds with free gardening calculators. Work out crop rotation, plant spacing, and seed or planting quantities.',
      'Good planning means healthier plants and less waste. These tools turn your garden layout into rotations and quantities that work.',
    ],
    faqs: [
      { q: 'What is a crop rotation calculator?', a: 'It helps you plan which plant families to grow in each bed across seasons to protect soil health and reduce pests and disease.' },
      { q: 'How far apart should I space plants?', a: 'Spacing tools recommend distances by plant type so roots and foliage have room, improving yield.' },
      { q: 'Are these calculators free?', a: 'Yes — every garden planning calculator is free with no account.' },
    ],
  },
  'gardening-landscaping/lawn-landscaping': {
    intro: [
      'Buy the right amount for your yard with free calculators. Work out pond volume, mulch, soil, grass seed, and fertiliser quantities.',
      'Landscaping materials are sold by volume and area, and it is easy to under-order. These tools convert your measurements into the bags, yards, and litres you need.',
    ],
    faqs: [
      { q: 'How do I calculate pond volume?', a: 'Enter your pond’s dimensions into the pond volume calculator for capacity in gallons or litres — useful for liners, pumps, and treatments.' },
      { q: 'How much mulch or soil do I need?', a: 'The mulch and soil calculators multiply area by depth and convert to cubic yards or bags so you order the correct amount.' },
      { q: 'Are these tools free?', a: 'Yes — all lawn and landscaping calculators are free with no sign-up.' },
    ],
  },

  'wedding-events/wedding-planning': {
    intro: [
      'Plan your big day with free wedding calculators. Work out how much alcohol to buy, catering quantities, and budget allocations.',
      'Weddings hinge on getting quantities and budgets right for a crowd. These tools turn your guest count into the bottles, portions, and spend you need.',
    ],
    faqs: [
      { q: 'How much alcohol do I need for a wedding?', a: 'The wedding alcohol calculator estimates wine, beer, and spirits from your guest count, event length, and drink preferences, with a sensible buffer.' },
      { q: 'How do I budget for a wedding?', a: 'Wedding budget tools allocate your total across venue, catering, and other categories using typical percentages you can adjust.' },
      { q: 'Are these calculators free?', a: 'Yes — every wedding planning calculator is free with no account.' },
    ],
  },
  'wedding-events/party-event-planning': {
    intro: [
      'Host with confidence using free event calculators. Work out drinks, food portions, guest counts, and budgets for parties and gatherings.',
      'Events succeed on quantities and budgets. These tools scale your plan to the number of guests so you neither run short nor overspend.',
    ],
    faqs: [
      { q: 'How much food and drink do I need for a party?', a: 'Event calculators estimate portions and drinks from your guest count and event length, with a buffer for heavier consumption.' },
      { q: 'Can these help with a budget?', a: 'Yes — event budget tools split your total across categories so you can plan and track spending.' },
      { q: 'Are these tools free?', a: 'Yes — all party and event calculators are free with no sign-up.' },
    ],
  },

};

export function getCategoryContent(slug: string): SeoContentBlock | undefined {
  return categoryContent[slug];
}

export function getSubcategoryContent(
  categorySlug: string,
  subcategorySlug: string
): SeoContentBlock | undefined {
  return subcategoryContent[`${categorySlug}/${subcategorySlug}`];
}
