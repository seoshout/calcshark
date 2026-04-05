# Calculator Content Template (Based on `/automotive-transportation/vehicle-costs/car-payment-calculator/`)

Use this template for every new advanced calculator page after the tool/input section.

## Scope
This template starts immediately below the calculator tool section (inputs + calculate/reset buttons).

## Core Baseline
The car payment calculator is implemented through the shared suite pattern in:
- `app/[category]/[subcategory]/[calculator]/calculators/AdvancedCarPaymentCalculator.tsx`
- `app/[category]/[subcategory]/[calculator]/calculators/AdvancedVehicleCostsSuiteCalculator.tsx`

For all new calculators, follow this structure order and content density unless there is a strong calculator-specific reason to deviate.

## Mandatory Rules
1. Keep detailed calculation output in a modal/popup only.
2. Do not render a duplicate full results panel below the calculator.
3. Every major section and key subsection must include an icon-led heading.
4. Use colored panels/cards to separate content groups.
5. Keep the tone practical, decision-oriented, and non-generic.
6. Use specific numbers, thresholds, examples, and action guidance where possible.
7. End with FAQ and `CalculatorReview`.

## Required Section Order (Below Tool)

## 1) About This Calculator
Required structure:
- `H2`: `About This Calculator`
- 2-4 intro paragraphs that explain:
  - what the calculator covers
  - what decision it helps with
  - what risk or planning problem it solves
- Feature card grid with 4 cards minimum:
  - layered calculation depth
  - scenario/projection capability
  - sensitivity/comparison coverage
  - risk/decision framing
- Badge/tag row with at least 4 short highlights.

This section should feel like a short product overview for the tool.

## 2) Results Modal (UI Rule)
Required structure:
- modal header with icon + result title
- primary decision metric
- supporting KPI cards
- breakdown section
- scenario deltas / comparison section
- recommendations
- warnings / considerations
- next steps
- optional projection table where relevant

Hard rule:
- No full duplicate result block below the calculator body.

## 3) How to Use This Free Online [Calculator Name]
Required structure:
- `H2`: `How to Use This Free Online [Calculator Name]`
- 4 recurring `H3` groups in this order:
  1. `Step-by-Step Guide`
  2. `Your [Topic] Results Dashboard (Popup Only)`
  3. `Why Use This [Topic] Calculator?`
  4. `[Topic] Advanced Features`
- Final `H3` block for practical planning guidance / action rules.

### Step-by-Step Guide
- Exactly 6 steps
- Each step should be an `H4`
- Each step needs a real explanatory paragraph, not just a label
- The 6 steps should move from inputs -> assumptions -> outputs -> decisions

### Results Dashboard
- Minimum 4 dashboard interpretation items:
  - primary decision metric
  - supporting KPIs
  - scenario deltas
  - projections / planning rows

### Why Use This Calculator?
- Minimum 4 reason cards
- Focus on depth beyond basic calculators:
  - better modeling
  - risk visibility
  - cash-flow clarity
  - actionable planning

### Advanced Features
- Minimum 3 feature cards
- Explain what the advanced logic adds and why it matters

### Practical Planning Guidance
- Add a final short action section with 4 planning prompts such as:
  - set approval limits
  - stress-test weak points
  - connect results to budget policy
  - set recheck triggers

## 4) Understanding [Topic] Planning
Required structure:
- `H2`: `Understanding [Topic] Planning` or calculator-equivalent
- Exactly 6 themed `H3` subsections modeled after the car-payment pattern:
  1. `Core Concept and Decision Context`
  2. `Major Factors Affecting Results`
  3. `Advanced Comparison Framework`
  4. `Threshold and Timing Guidance`
  5. `Financial Optimization and Assistance Options`
  6. `Practical Benefits, Risks, and Impact Summary`

Each subsection should include:
- icon-led subheading
- a context paragraph
- structured bullets/cards/grids
- practical interpretation, not just definitions

## 5) Quick Reference Table
Required structure:
- `H3`: `Quick Reference: ...`
- one compact benchmark/planning table
- minimum 5 rows
- rows should use practical ranges, thresholds, or benchmark views
- include a short caveat note below the table

This section should help users quickly sense-check results.

## 6) Scientific References & Resources
Required structure:
- `H2`: `Scientific References & Resources`
- minimum 5 grouped source blocks in this preferred order:
  1. `Official Sources`
  2. `Research and Technical Sources`
  3. `Cost and Market Data Sources`
  4. `Educational and Consumer Resources`
  5. `Tool-Specific Research Focus`
- end with a short methodology/disclaimer paragraph

Each source group should have multiple references or bullets.

## 7) Frequently Asked Questions
Required structure:
- `H2`: `Frequently Asked Questions`
- FAQ accordion rendered with `showTitle={false}` if the section heading is already present
- minimum 10 FAQs for advanced tools

FAQ topics should include:
- calculation meaning
- assumptions
- edge cases
- planning thresholds
- user misconceptions

## 8) Review Section
Required structure:
- `CalculatorReview` block at the very end

## Heading Hierarchy
- `H1`: handled by shared calculator layout
- `H2`: major sections only
- `H3`: grouped sub-sections
- `H4`: individual cards, steps, and planning blocks

## Design Requirements
- use icon-led headings across all major sections
- use grids/cards instead of long walls of text
- use blue/green/orange/purple/cyan panel variations to separate groups
- keep sections scannable and visually modular
- keep paragraph lengths moderate

## SEO / Structured-Data Alignment Checklist
- breadcrumb schema present
- software / web application schema present
- FAQ section present and aligned with page content
- tool route included in sitemap discovery

## Authoring Checklist
- [ ] Uses the car-payment section order
- [ ] About section includes intro + 4 feature cards + tags
- [ ] Results stay in popup/modal only
- [ ] How-to section includes 6 detailed steps
- [ ] Results dashboard has at least 4 interpretation items
- [ ] Why-use section has at least 4 reason cards
- [ ] Advanced-features section has at least 3 feature cards
- [ ] Practical planning guidance block is present
- [ ] Understanding section contains all 6 deep subsections
- [ ] Quick reference benchmark table is included
- [ ] References section contains 5 grouped source blocks
- [ ] FAQ count is at least 10
- [ ] Review section is last
