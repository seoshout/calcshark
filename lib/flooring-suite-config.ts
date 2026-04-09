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

export type FlooringVariant =
  | 'baseboard'
  | 'carpet'
  | 'floor-heating'
  | 'floor-joist'
  | 'floor-leveling'
  | 'flooring'
  | 'grout'
  | 'hardwood'
  | 'laminate'
  | 'subfloor'
  | 'thinset'
  | 'tile'
  | 'transition-strip'
  | 'underlayment'
  | 'vinyl';

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
  lowesFlooringEstimator: {
    label: "Lowe's Solid Wood Flooring Installation PDF",
    url: 'https://pdf.lowes.com/installationguides/000988001136_install.pdf',
  },
  lowesTileCalc: {
    label: "Lowe's Floor Tile Installation PDF",
    url: 'https://pdf.lowes.com/installationguides/081516685813_install.pdf',
  },
  lowesCarpetCalc: {
    label: "Lowe's Carpet Measurement Planning Guide",
    url: 'https://pdf.lowes.com/howtoguides/086093494124_how.pdf',
  },
  lowesHardwoodGuide: {
    label: "Lowe's Engineered Wood Flooring Installation PDF",
    url: 'https://pdf.lowes.com/installationguides/042369517614_install.pdf',
  },
  lowesLaminateGuide: {
    label: "Lowe's Laminate Flooring Installation PDF",
    url: 'https://pdf.lowes.com/productdocuments/b41ba325-97a2-4051-8806-08dd19123dae/64585761.pdf',
  },
  lowesVinylGuide: {
    label: "Lowe's Sheet Vinyl Flooring Installation PDF",
    url: 'https://pdf.lowes.com/installationguides/842374873220_install.pdf',
  },
  lowesTileGuide: {
    label: "Lowe's Tile Installation Guide PDF",
    url: 'https://pdf.lowes.com/productdocuments/8cea63bc-8934-44cb-abd4-9de8052d98b1/66602875.pdf',
  },
  schluterDitra: {
    label: 'Schluter Ditra Product Overview',
    url: 'https://www.schluter.com/schluter-us/en_US/Floor-Warming/c/FW',
  },
  lowesEngineeredWoodPdf: {
    label: 'Lowe\'s Engineered Wood Construction Guide PDF',
    url: 'https://pdf.lowes.com/productdocuments/a38bfc36-f0dc-4aba-ad6c-002f52311aba/04777619.pdf',
  },
  warmlyYoursCost: {
    label: 'QuietWarmth Floor Heat Installation and Owner Guide PDF',
    url: 'https://pdf.lowes.com/installationguides/696087045296_install.pdf',
  },
  lowesUnderlaymentPdf: {
    label: 'Lowe\'s Underlayment Product Guide PDF',
    url: 'https://pdf.lowes.com/productdocuments/68fda8b4-b557-45df-b4ac-db7e45ab82f0/71250139.pdf',
  },
  lowesMortarChart: {
    label: 'Lowe\'s Mortar Selection Chart PDF',
    url: 'https://pdf.lowes.com/productdocuments/4756316d-fe65-401f-ac91-9a595b1cca91/07712167.pdf',
  },
  lowesTransitionGuide: {
    label: 'Trim and Mouldings Installation Handbook PDF',
    url: 'https://pdf.lowes.com/productdocuments/07ce47f2-beff-4c30-9b5e-c81cd4490ec6/71574385.pdf',
  },
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Decision-ready quantities', `The result is built around ${focus}, not just one isolated area number.`),
  card('Popup-only results', 'The calculator keeps the approved advanced popup dashboard instead of switching to an inline summary.'),
  card('Project context', 'Primary takeoff numbers, supporting material counts, and watchouts stay together in one run.'),
  card('Live feature research', 'Inputs and outputs were selected after reviewing public flooring takeoff tools and installation guides online.'),
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
    `A thin ${seed.title.toLowerCase()} usually stops at one quantity, but real flooring planning usually depends on supporting context like waste, stock length, coverage assumptions, or layout constraints.`,
    `This advanced version keeps those linked details visible so ${seed.concept} is easier to review the way installers, estimators, and homeowners actually make purchase decisions.`,
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

export const FLOORING_CONFIG: Record<FlooringVariant, VariantConfig> = {
  flooring: cfg({
    title: 'Flooring Calculator',
    subtitle: 'Estimate room area, waste allowance, and carton count for a flooring project in one run',
    focus: 'finished flooring quantity and purchase-ready carton planning',
    concept: 'general flooring takeoff',
    researchFocus: 'room area, waste allowance, carton coverage, and purchase quantity',
    intro: 'This calculator is built for homeowners and estimators who need a reliable first-pass flooring takeoff before shopping, comparing products, or requesting installation quotes.',
    stepTips: [
      'Enter room length and width first so the base floor area is clear.',
      'Add a waste percentage that reflects your layout complexity instead of assuming every room can be purchased at exact square footage.',
      'Use carton coverage if you want a purchase-ready result rather than just an area estimate.',
      'Review the popup as a material-planning dashboard, not only as a square-foot answer.',
    ],
    dashboardTips: [
      'Total flooring needed as the lead metric.',
      'Room area kept separate from purchase area.',
      'Waste allowance shown in square feet.',
      'Cartons needed rounded up for ordering.',
    ],
    features: [
      'Square footage, waste, and carton count in one run',
      'Purchase-ready output instead of a bare room-area number',
      'Useful for planning hardwood, laminate, vinyl, and hybrid products',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on quantity planning and ordering risk',
      'Feature pattern informed by live flooring estimator tools',
    ],
    decisionCards: [
      card('If waste area feels high', 'The room shape, install direction, or pattern layout may be driving more material than a simple rectangle suggests.'),
      card('If carton count jumps sharply', 'A small increase in waste or a product with low box coverage can change the purchase plan quickly.'),
      card('If room area and purchase area are close', 'The layout may be straightforward, but you still need enough allowance for cuts and damaged pieces.'),
      card('If comparing multiple products', 'Carton coverage is often the fastest way to see how packaging differences affect the order.'),
    ],
    quickRows: [
      row('Room area', 'Length x Width', 'Shows the finished floor footprint before waste is added.'),
      row('Waste area', 'Room Area x Waste %', 'Captures extra material for cuts, pattern matching, and breakage.'),
      row('Total flooring needed', 'Room Area + Waste Area', 'Builds the purchase quantity used for ordering.'),
      row('Cartons needed', 'Total Flooring Needed / Coverage per Carton', 'Translates area into a box-count estimate.'),
    ],
    references: [REF.lowesFlooringEstimator, REF.lowesHardwoodGuide, REF.lowesLaminateGuide],
    understanding: [
      card('Flooring takeoff is not just room area', 'Install direction, offcuts, and packaging all affect what you actually need to buy.'),
      card('Waste is a planning tool, not a mistake', 'A realistic waste factor reduces the risk of under-ordering once cuts and edge work start.'),
      card('Carton coverage changes product comparisons', 'Two materials may cover the same room but require different box counts because packaging differs.'),
      card('The best result is purchase-ready', 'A practical flooring estimate should help you move straight into ordering and budget planning.'),
    ],
    faqs: [
      faq('How do you calculate flooring square footage?', 'A simple rectangular estimate multiplies room length by room width, then adds waste for ordering.', 'Basics'),
      faq('Why include carton coverage?', 'Because most flooring products are purchased by box or carton, not by exact square foot.', 'Method'),
      faq('How much waste should I add?', 'It depends on layout complexity, plank size, room shape, and pattern direction, which is why waste should be treated as an explicit choice.', 'Planning'),
    ],
  }),
  hardwood: cfg({
    title: 'Hardwood Flooring Calculator',
    subtitle: 'Estimate hardwood square footage, waste, and carton count for a wood-flooring layout',
    focus: 'hardwood purchase quantity and wood-specific waste planning',
    concept: 'hardwood flooring takeoff',
    researchFocus: 'board coverage, waste allowance, carton planning, and install-direction sensitivity',
    intro: 'This calculator is designed for hardwood projects where board direction, trim cuts, and carton coverage can materially affect how much material should be ordered.',
    stepTips: [
      'Measure room length and width first to establish the finished hardwood footprint.',
      'Use a realistic waste percentage because wood installs often create offcuts around walls, closets, and transitions.',
      'Enter carton coverage from the product you are considering so the result matches the stock you will actually buy.',
      'Review the popup as an ordering tool, not only as an area estimate.',
    ],
    dashboardTips: [
      'Total hardwood needed after waste.',
      'Room area versus purchase area.',
      'Waste area shown in square feet.',
      'Carton count rounded for real ordering.',
    ],
    features: [
      'Hardwood square footage and cartons in one run',
      'Explicit waste visibility for cut-heavy layouts',
      'Useful for comparing engineered and solid wood packaging',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content centered on wood-floor ordering decisions',
      'Feature mix informed by live hardwood planning guides',
    ],
    decisionCards: [
      card('If waste climbs on a simple room', 'Board direction or short-carton coverage may be driving the takeoff more than room shape.'),
      card('If carton count feels high', 'Check the product coverage per box before assuming the square footage math is wrong.'),
      card('If comparing engineered and solid wood', 'Packaging differences can change the order even when the installed footprint stays identical.'),
      card('If matching an existing floor', 'Ordering extra material may matter more because future dye-lot matching is harder.'),
    ],
    quickRows: [
      row('Finished area', 'Length x Width', 'Shows the floor area that will actually be covered.'),
      row('Waste allowance', 'Finished Area x Waste %', 'Reflects extra wood needed for cuts and fitting.'),
      row('Order quantity', 'Finished Area + Waste', 'Creates the purchase-ready area target.'),
      row('Carton count', 'Order Quantity / Carton Coverage', 'Converts area into the product units you buy.'),
    ],
    references: [REF.lowesHardwoodGuide, REF.lowesFlooringEstimator, REF.lowesEngineeredWoodPdf],
    understanding: [
      card('Hardwood waste is often layout-sensitive', 'Install direction, starter rows, and end cuts can materially change how much wood is needed.'),
      card('Carton coverage matters for budgeting', 'Wood products are rarely purchased by exact square foot, so packaging affects both order count and price.'),
      card('Extra wood can protect the project later', 'A modest overage can help with repairs or board replacement after the original product is discontinued.'),
      card('Takeoff and finish selection should stay linked', 'Species, board width, and install method all influence how practical the final order will be.'),
    ],
    faqs: [
      faq('How is hardwood flooring estimated?', 'Hardwood quantity is usually planned from room area, then increased by a waste factor and translated into carton count.', 'Basics'),
      faq('Why is waste important for hardwood?', 'Wood layouts create end cuts, starter waste, and trim losses that are not captured by room area alone.', 'Method'),
      faq('Should I order extra beyond calculated waste?', 'Many projects do, especially if future board matching may be difficult.', 'Planning'),
    ],
  }),
  laminate: cfg({
    title: 'Laminate Calculator',
    subtitle: 'Estimate laminate flooring area, waste, and cartons for a floating-floor installation',
    focus: 'laminate coverage planning and box-count ordering',
    concept: 'laminate flooring takeoff',
    researchFocus: 'room area, floating-floor waste, and carton coverage planning',
    intro: 'This calculator is built for laminate flooring projects where coverage is usually purchased by box and even simple rooms still need a realistic allowance for cuts and fitting.',
    stepTips: [
      'Enter room dimensions first to define the finished laminate footprint.',
      'Use waste explicitly because floating-floor installs still create cut loss around walls, rows, and obstacles.',
      'Enter carton coverage from the laminate product listing so the result is purchase-ready.',
      'Use the popup to compare finished area with order area before placing the order.',
    ],
    dashboardTips: [
      'Total laminate needed after waste.',
      'Room area and waste area shown separately.',
      'Carton coverage and cartons needed.',
      'A cleaner read on how box packaging affects the order.',
    ],
    features: [
      'Laminate area and cartons in one result',
      'Useful for floating-floor product comparisons',
      'Waste allowance kept visible instead of buried in the total',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on ordering accuracy and install planning',
      'Feature set informed by live laminate-buying guides',
    ],
    decisionCards: [
      card('If carton count is higher than expected', 'The product may have lower box coverage than the alternatives you are comparing.'),
      card('If waste feels large', 'The room may have more cut points or direction changes than a simple area estimate suggests.'),
      card('If comparing several laminate styles', 'Carton coverage is often the fastest way to spot the ordering difference between products.'),
      card('If the install includes many closets or jogs', 'A higher waste allowance may be safer than a minimal one.'),
    ],
    quickRows: [
      row('Laminate area', 'Length x Width', 'Shows the clean room footprint.'),
      row('Waste area', 'Laminate Area x Waste %', 'Captures extra material for cuts and adjustments.'),
      row('Order area', 'Laminate Area + Waste Area', 'Creates the area that should be purchased.'),
      row('Boxes needed', 'Order Area / Carton Coverage', 'Converts square footage into actual product units.'),
    ],
    references: [REF.lowesLaminateGuide, REF.lowesFlooringEstimator, REF.lowesUnderlaymentPdf],
    understanding: [
      card('Laminate is still packaging-driven', 'Even when the math looks simple, the order is usually controlled by box coverage and whole-carton rounding.'),
      card('Floating floors still need waste', 'Offcuts, end joints, and edge trimming can consume more material than the base room area implies.'),
      card('Transitions and underlayment still matter', 'Laminate projects often involve additional layers and trim pieces beyond the plank order itself.'),
      card('Planning accuracy reduces return trips', 'A clean order up front is often cheaper than interrupting the project to buy a few missing boxes.'),
    ],
    faqs: [
      faq('How do you estimate laminate flooring?', 'Laminate is usually estimated from room area, then adjusted for waste and converted to boxes using carton coverage.', 'Basics'),
      faq('Does laminate need waste allowance?', 'Yes. Even floating-floor systems create cutoffs and fitting losses around room edges and obstacles.', 'Method'),
      faq('Should underlayment be estimated separately?', 'Usually yes, because underlayment often has different roll coverage and packaging than the laminate itself.', 'Planning'),
    ],
  }),
  vinyl: cfg({
    title: 'Vinyl Flooring Calculator',
    subtitle: 'Estimate vinyl flooring area, waste, and cartons or packages for a resilient-flooring project',
    focus: 'vinyl flooring purchase quantity and layout-ready order planning',
    concept: 'vinyl flooring takeoff',
    researchFocus: 'coverage area, waste, package coverage, and resilient-floor ordering',
    intro: 'This calculator is designed for vinyl plank and sheet-style flooring projects where the finished area must still be translated into a realistic purchase quantity before installation begins.',
    stepTips: [
      'Enter room dimensions to establish the base vinyl coverage area.',
      'Add waste because cuts, pattern layout, and edge trimming still matter on resilient flooring installs.',
      'Use package coverage from the product listing if you want an order-ready result.',
      'Read the popup as a quantity-planning tool before comparing prices across products.',
    ],
    dashboardTips: [
      'Total vinyl needed after waste.',
      'Room area versus purchase area.',
      'Package coverage used for ordering.',
      'Rounded package count for practical buying.',
    ],
    features: [
      'Vinyl coverage and package count in one run',
      'Useful for LVP, LVT, and other resilient flooring products',
      'Waste made explicit for cleaner ordering decisions',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content centered on resilient-floor takeoffs',
      'Feature set informed by live vinyl installation guides',
    ],
    decisionCards: [
      card('If package count rises quickly', 'Check the product coverage per box because resilient flooring packaging varies more than many buyers expect.'),
      card('If waste looks modest', 'That can be correct for a simple room, but transitions, closets, and diagonal installs may still justify more allowance.'),
      card('If comparing click-lock and glue-down products', 'The area math may look similar while packaging and install accessories still differ.'),
      card('If the order is very tight', 'An extra package can still be worth considering to avoid mid-project shortages.'),
    ],
    quickRows: [
      row('Vinyl area', 'Length x Width', 'Shows the finished floor footprint.'),
      row('Waste area', 'Vinyl Area x Waste %', 'Adds a cushion for cuts and install waste.'),
      row('Order area', 'Vinyl Area + Waste Area', 'Creates the quantity used for purchasing.'),
      row('Packages needed', 'Order Area / Coverage per Package', 'Turns area into an order-ready package count.'),
    ],
    references: [REF.lowesVinylGuide, REF.lowesFlooringEstimator, REF.lowesTransitionGuide],
    understanding: [
      card('Resilient flooring still needs a real takeoff', 'Even products marketed as easy installs can produce shortages if the order ignores waste and packaging.'),
      card('Package coverage drives the order', 'The same room can require different purchase counts depending on how the product is boxed.'),
      card('Trim pieces are part of the project too', 'Transitions, reducers, and edge profiles often matter alongside the floor field itself.'),
      card('A cleaner estimate makes product comparison easier', 'When area, waste, and package count are all visible, pricing options become easier to judge fairly.'),
    ],
    faqs: [
      faq('How do you estimate vinyl flooring?', 'A common approach measures room area, adds waste, and then converts the total into packages based on product coverage.', 'Basics'),
      faq('Does vinyl plank need waste allowance?', 'Yes. Cuts at walls, end joints, and complex room layouts still create material loss.', 'Method'),
      faq('Can the same calculator be used for LVP and LVT?', 'Yes for basic takeoff planning, as long as you enter the correct package coverage for the product you are buying.', 'Use Cases'),
    ],
  }),
  tile: cfg({
    title: 'Tile Calculator',
    subtitle: 'Estimate tile count, coverage area, waste, and carton count for a floor-tile installation',
    focus: 'tile count and coverage planning before purchase',
    concept: 'tile flooring takeoff',
    researchFocus: 'tile size, room area, waste, tile count, and box planning',
    intro: 'This calculator is built for tile projects where both total area and individual tile size matter because ordering usually has to work at the level of pieces and boxes at the same time.',
    stepTips: [
      'Enter room dimensions first so the installation footprint is clear.',
      'Add tile length and width so the calculator can convert area into estimated piece count.',
      'Use waste explicitly because tile layouts often create cuts, breakage, and layout loss.',
      'Enter carton coverage if the product is sold by box and you want an ordering result instead of piece count only.',
    ],
    dashboardTips: [
      'Estimated tile count as the lead output.',
      'Total tile coverage needed after waste.',
      'Single-tile coverage shown for context.',
      'Cartons needed for practical ordering.',
    ],
    features: [
      'Tile count and carton count in one run',
      'Tile-size-aware quantity planning',
      'Waste built in for cut and breakage risk',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on tile takeoff and ordering accuracy',
      'Feature pattern informed by live tile-estimator tools and install guides',
    ],
    decisionCards: [
      card('If piece count looks high', 'Smaller tile formats naturally drive more pieces even at the same room square footage.'),
      card('If cartons feel expensive', 'Check both the waste allowance and box coverage before judging the room area itself.'),
      card('If layout includes diagonals or herringbone', 'A higher waste factor may be more realistic than the default install pattern.'),
      card('If matching dye lots matters', 'Ordering enough tile up front is usually safer than relying on a later small restock.'),
    ],
    quickRows: [
      row('Tile area', '(Tile Length x Tile Width) / 144', 'Converts one tile into square-foot coverage.'),
      row('Total tile coverage needed', 'Room Area + Waste Area', 'Shows the full area that the tile order must cover.'),
      row('Estimated tile count', 'Total Coverage Needed / Single Tile Coverage', 'Translates area into approximate pieces.'),
      row('Cartons needed', 'Total Coverage Needed / Coverage per Carton', 'Converts area into order units if the tile is sold by box.'),
    ],
    references: [REF.lowesTileCalc, REF.lowesTileGuide, REF.lowesFlooringEstimator],
    understanding: [
      card('Tile orders depend on both area and format', 'The room square footage tells only part of the story until tile size is considered.'),
      card('Waste matters more on patterned layouts', 'Complex layouts and border conditions can increase material demand beyond simple rectangular installs.'),
      card('Piece count helps with labor planning too', 'Smaller formats can increase handling, cuts, and setting time even if total area stays constant.'),
      card('Carton planning reduces ordering friction', 'It is often the easiest bridge from takeoff math to the product listing you actually buy from.'),
    ],
    faqs: [
      faq('How do you calculate how many floor tiles are needed?', 'A common method divides total coverage area by the area of one tile, then rounds up and adds waste.', 'Basics'),
      faq('Why show both tile count and cartons?', 'Because tile is often discussed by piece on site but purchased by box or carton from the supplier.', 'Method'),
      faq('Should tile waste be higher for diagonal layouts?', 'Usually yes, because diagonal and patterned installs create more cuts and offcuts than straight layouts.', 'Planning'),
    ],
  }),
  grout: cfg({
    title: 'Grout Calculator',
    subtitle: 'Estimate grout bags, joint volume, and coverage area from tile size and grout-joint assumptions',
    focus: 'grout quantity tied to tile geometry and joint volume',
    concept: 'grout planning',
    researchFocus: 'tile size, joint width, joint depth, grout volume, and bag count',
    intro: 'This calculator is built for tile projects where grout quantity depends on joint geometry, not just on floor area, making it easy to underestimate if you rely on square footage alone.',
    stepTips: [
      'Enter room dimensions and waste so the coverage area reflects the full install quantity.',
      'Add tile size because smaller formats create more total joint length across the same room.',
      'Use joint width and depth explicitly so the calculator can estimate grout volume rather than guessing from area alone.',
      'Enter bag yield if you want a purchase-ready bag estimate from the volume calculation.',
    ],
    dashboardTips: [
      'Estimated grout bags as the lead output.',
      'Total grout volume in cubic inches.',
      'Joint width and joint depth kept visible.',
      'Coverage area used in the takeoff.',
    ],
    features: [
      'Tile-size-aware grout estimation',
      'Joint-volume math instead of area-only guesswork',
      'Bag count based on an explicit yield assumption',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on grout quantity and install planning',
      'Feature mix informed by live tile and mortar reference guides',
    ],
    decisionCards: [
      card('If grout bags jump after changing tile size', 'Smaller tile formats likely increased total joint length across the room.'),
      card('If the volume looks high', 'Check whether joint depth and width assumptions match the actual tile profile and spacer choice.'),
      card('If bag count feels low', 'Bag yield assumptions may be optimistic for textured tile or cleanup-heavy installs.'),
      card('If ordering is tight', 'A modest grout overage can still be safer than stopping mid-project for an exact color match.'),
    ],
    quickRows: [
      row('Joint length per square foot', '144 / Tile Length + 144 / Tile Width', 'Approximates how much grout line exists across one square foot of tile.'),
      row('Grout volume per square foot', 'Joint Length x Joint Width x Joint Depth', 'Turns joint geometry into grout volume.'),
      row('Total grout volume', 'Volume per Sq Ft x Total Coverage Area', 'Builds the full install grout demand.'),
      row('Bags needed', 'Total Grout Volume / Bag Yield', 'Converts grout volume into product units.'),
    ],
    references: [REF.lowesTileGuide, REF.lowesMortarChart, REF.lowesTileCalc],
    understanding: [
      card('Grout demand is a geometry problem', 'Joint width, depth, and tile size all affect grout quantity in ways that room area alone cannot show.'),
      card('Smaller tile usually means more grout', 'More pieces create more joints and therefore more total grout volume across the same floor.'),
      card('Bag yield is only an assumption', 'Actual field use can move with tile surface, cleanup habits, and how the product is mixed.'),
      card('Planning by volume is stronger than planning by guess', 'It creates a clearer path from tile layout to realistic material ordering.'),
    ],
    faqs: [
      faq('How do you estimate grout quantity?', 'A more useful method estimates total grout-joint volume from tile size, joint width, and joint depth, then compares that with bag yield.', 'Basics'),
      faq('Why does smaller tile require more grout?', 'Because smaller pieces create more total joint length across the same finished area.', 'Method'),
      faq('Is bag yield exact?', 'No. Product yield is a planning assumption and actual field performance can vary.', 'Planning'),
    ],
  }),
  thinset: cfg({
    title: 'Thinset Calculator',
    subtitle: 'Estimate thinset bags, coverage area, and waste-adjusted material demand for a tile-floor installation',
    focus: 'thinset quantity based on install area and coverage assumptions',
    concept: 'thinset planning',
    researchFocus: 'install area, waste, bag coverage, and tile-related mortar demand',
    intro: 'This calculator is designed for tile installations where mortar quantity depends on the covered area plus a realistic allowance for waste, substrate variation, and install practice.',
    stepTips: [
      'Enter room dimensions and waste so the coverage area reflects the real install plan.',
      'Use a bag coverage figure that matches the mortar and trowel expectation you plan to use.',
      'Keep tile size visible because larger or more heavily patterned tile can affect mortar usage in practice.',
      'Review the popup as a planning estimate before final product selection and trowel sizing are locked in.',
    ],
    dashboardTips: [
      'Estimated thinset bags as the lead output.',
      'Coverage area used in the takeoff.',
      'Bag coverage assumption shown explicitly.',
      'Waste area separated from finished area.',
    ],
    features: [
      'Thinset bag count and coverage area in one run',
      'Bag-coverage assumption kept explicit for sanity checks',
      'Useful for purchase planning before tile setting begins',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on mortar planning and install risk',
      'Feature set informed by live mortar and tile-install references',
    ],
    decisionCards: [
      card('If bag count feels high', 'The coverage assumption may be conservative, or the install area may have more waste than expected.'),
      card('If bag count feels low', 'Check whether the bag coverage you entered is realistic for the tile format and substrate condition.'),
      card('If comparing mortars', 'Product coverage can differ enough to change the order even if room area stays constant.'),
      card('If the project has uneven substrate', 'Actual mortar use may exceed the clean estimate because flattening work consumes extra material.'),
    ],
    quickRows: [
      row('Coverage area used', 'Room Area + Waste Area', 'Defines the area the mortar estimate is based on.'),
      row('Waste area', 'Room Area x Waste %', 'Captures install overage beyond the finished footprint.'),
      row('Bag count', 'Coverage Area Used / Bag Coverage', 'Converts total area into purchase quantity.'),
      row('Coverage assumption', 'Bag Coverage at Planned Trowel and Tile Setup', 'Keeps the critical yield assumption visible.'),
    ],
    references: [REF.lowesMortarChart, REF.lowesTileGuide, REF.lowesTileCalc],
    understanding: [
      card('Thinset planning depends on coverage assumptions', 'Mortar quantity changes with product type, trowel selection, substrate flatness, and tile profile.'),
      card('Area alone is not enough', 'The same room can require different mortar quantities under different install conditions.'),
      card('Waste should still be explicit', 'A clean area estimate can understate the real material needed once cuts and field conditions are considered.'),
      card('Planning estimates help avoid mid-job shortages', 'Ordering the right number of bags up front keeps the tile install moving more smoothly.'),
    ],
    faqs: [
      faq('How do you estimate thinset quantity?', 'A practical method divides the total install area by the expected coverage per bag, then rounds up to whole bags.', 'Basics'),
      faq('Why include waste on a thinset calculator?', 'Because the covered area used for setting tile usually exceeds the clean room footprint once cuts and field realities are considered.', 'Method'),
      faq('Does tile size affect thinset use?', 'Often yes, because larger formats and substrate issues can change the real coverage achieved per bag.', 'Planning'),
    ],
  }),
  underlayment: cfg({
    title: 'Underlayment Calculator',
    subtitle: 'Estimate underlayment square footage, waste, and roll count for a floating-floor installation',
    focus: 'underlayment quantity and roll-count planning',
    concept: 'underlayment takeoff',
    researchFocus: 'coverage area, waste, roll coverage, and subfloor-prep planning',
    intro: 'This calculator is built for flooring projects that need a separate underlayment layer before the finished surface is installed, making it easier to estimate rolls and total coverage before shopping.',
    stepTips: [
      'Enter room dimensions first so the underlayment footprint matches the finished floor area.',
      'Add waste because trimming, seams, and overlap details can increase what must be purchased.',
      'Use roll coverage from the specific underlayment product so the result is order-ready.',
      'Review the popup as an accessory-planning dashboard rather than only a square-foot estimate.',
    ],
    dashboardTips: [
      'Total underlayment needed as the lead metric.',
      'Roll count rounded for actual ordering.',
      'Waste shown in square feet.',
      'Roll coverage kept visible for comparison shopping.',
    ],
    features: [
      'Area, waste, and roll count in one result',
      'Useful for laminate, engineered wood, and some vinyl systems',
      'Roll coverage explicit for supplier comparisons',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content focused on sublayer material planning',
      'Feature pattern informed by live underlayment product guides',
    ],
    decisionCards: [
      card('If roll count feels high', 'The product may simply have lower roll coverage than the alternatives you are comparing.'),
      card('If waste rises quickly', 'Seams, trim work, and direction changes may be consuming more material than expected.'),
      card('If the flooring product includes a pad already', 'Separate underlayment may need to be reconsidered before ordering.'),
      card('If using underlayment for sound or moisture control', 'Performance requirements may matter as much as coverage quantity.'),
    ],
    quickRows: [
      row('Underlayment area', 'Room Area + Waste Area', 'Builds the total area that the underlayment order should cover.'),
      row('Waste area', 'Room Area x Waste %', 'Captures extra material for trimming and seam management.'),
      row('Roll count', 'Underlayment Area / Roll Coverage', 'Converts area into purchase units.'),
      row('Roll coverage', 'Manufacturer-stated Coverage per Roll', 'Keeps the product packaging assumption visible.'),
    ],
    references: [REF.lowesUnderlaymentPdf, REF.lowesLaminateGuide, REF.lowesFlooringEstimator],
    understanding: [
      card('Underlayment is its own takeoff', 'It should not be assumed to match the finished floor order perfectly once roll coverage and waste are considered.'),
      card('Performance and quantity both matter', 'Sound control, moisture control, and cushion can all influence the product choice beyond simple coverage.'),
      card('Roll coverage drives ordering efficiency', 'Two underlayments can cover the same room but require different roll counts because packaging varies.'),
      card('A clean subfloor plan reduces surprises later', 'Estimating the underlayer early helps avoid gaps once the finished floor arrives.'),
    ],
    faqs: [
      faq('How do you estimate underlayment?', 'A common method uses room area plus waste, then converts the total into rolls based on product coverage.', 'Basics'),
      faq('Does underlayment need waste too?', 'Yes. Seams, trimming, and fit adjustments can all raise the amount required above clean room area.', 'Method'),
      faq('Can one underlayment calculator work for all floor types?', 'For basic quantity planning, yes, but product compatibility still depends on the finished flooring system and performance needs.', 'Planning'),
    ],
  }),
  subfloor: cfg({
    title: 'Subfloor Calculator',
    subtitle: 'Estimate subfloor sheet count, coverage area, and waste-adjusted panel needs for a floor project',
    focus: 'subfloor sheet count and panel-order planning',
    concept: 'subfloor takeoff',
    researchFocus: 'panel coverage, waste, sheet dimensions, and structural deck planning',
    intro: 'This calculator is designed for framing and renovation work where the floor deck has to be converted from square footage into panel count before material is ordered.',
    stepTips: [
      'Measure the floor area first so the total subfloor footprint is clear.',
      'Add waste to account for cuts, edges, openings, and layout loss.',
      'Use the actual sheet dimensions you plan to buy so the result matches your panel order.',
      'Read the popup as a sheathing takeoff, not as an engineering approval for structural design.',
    ],
    dashboardTips: [
      'Estimated subfloor sheets as the lead output.',
      'Coverage area used after waste.',
      'Single-sheet area kept visible.',
      'Waste allowance shown separately from finished area.',
    ],
    features: [
      'Subfloor sheet count and area in one run',
      'Panel-size-aware takeoff instead of area-only math',
      'Useful for remodels, additions, and replacement sections',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on panel ordering and waste control',
      'Feature pattern informed by live framing and construction guides',
    ],
    decisionCards: [
      card('If sheet count feels high', 'Check whether the waste allowance or chosen panel size is driving the jump.'),
      card('If the project includes many cutouts', 'Openings, stairs, and irregular edges can justify more waste than a simple rectangle.'),
      card('If switching panel sizes is possible', 'Changing sheet dimensions can materially change both count and seam layout.'),
      card('If this is part of structural work', 'Panel quantity is only one decision; code requirements and fastening details still matter separately.'),
    ],
    quickRows: [
      row('Coverage area used', 'Room Area + Waste Area', 'Defines the square footage the sheet order must cover.'),
      row('Sheet area', 'Sheet Length x Sheet Width', 'Shows the coverage contributed by one panel.'),
      row('Sheet count', 'Coverage Area Used / Sheet Area', 'Translates floor area into panels.'),
      row('Waste area', 'Room Area x Waste %', 'Captures extra sheathing for cuts and fit adjustments.'),
    ],
    references: [REF.lowesEngineeredWoodPdf, REF.lowesFlooringEstimator],
    understanding: [
      card('Panel count depends on panel size', 'The same floor footprint can require very different sheet counts depending on the product dimensions used.'),
      card('Waste matters more than many expect', 'Cutups and irregular edges can quickly add extra panel demand beyond the clean room area.'),
      card('Takeoff is not the same as structural design', 'Quantity planning still needs to be paired with code and engineering requirements for thickness, spacing, and fastening.'),
      card('Panel-based planning makes purchasing easier', 'A good subfloor estimate should help you move directly into ordering without reworking the layout manually.'),
    ],
    faqs: [
      faq('How do you calculate subfloor sheets?', 'A common method divides the total floor area, including waste, by the area covered by one sheet.', 'Basics'),
      faq('Why show sheet area separately?', 'Because it makes panel-size comparisons much easier before ordering.', 'Method'),
      faq('Does this calculator size the structure?', 'No. It estimates quantity only and should not replace local code or engineering guidance.', 'Limits'),
    ],
  }),
  baseboard: cfg({
    title: 'Baseboard Calculator',
    subtitle: 'Estimate linear feet, adjusted perimeter, and stock pieces needed for baseboard trim',
    focus: 'trim length and stock-piece planning',
    concept: 'baseboard takeoff',
    researchFocus: 'room perimeter, opening allowance, waste, and stock trim length',
    intro: 'This calculator is built for trim work where the key question is not floor area but how much wall perimeter needs to be covered once doors and openings are considered.',
    stepTips: [
      'Enter room length and width to establish the full perimeter.',
      'Subtract doorway or opening allowance if you do not plan to run baseboard through those sections.',
      'Use stock piece length so the result can show the number of boards needed, not just linear footage.',
      'Keep waste explicit because corners and miter cuts can increase trim demand quickly.',
    ],
    dashboardTips: [
      'Estimated baseboard needed in linear feet.',
      'Room perimeter and adjusted perimeter kept separate.',
      'Opening allowance shown explicitly.',
      'Piece count rounded up for ordering.',
    ],
    features: [
      'Linear footage and stock-piece count in one run',
      'Door opening allowance built into the estimate',
      'Useful for trim packages and room-by-room remodeling',
      'Popup-only advanced dashboard matched to the approved structure',
      'Original content centered on trim takeoffs and cut planning',
      'Feature mix informed by live flooring and trim buying guides',
    ],
    decisionCards: [
      card('If adjusted perimeter is much lower than the full perimeter', 'Openings are doing a lot of work in reducing the trim order, so double-check the allowance.'),
      card('If piece count feels high', 'Shorter stock lengths and higher waste can drive more visible joints and extra material.'),
      card('If the room has many corners', 'A slightly higher waste allowance may be safer because miter and cope cuts can consume more stock.'),
      card('If several rooms are being combined', 'Piece-length strategy can matter as much as total linear footage for both cost and finish quality.'),
    ],
    quickRows: [
      row('Room perimeter', '2 x (Length + Width)', 'Shows the full trim path around the room.'),
      row('Adjusted perimeter', 'Room Perimeter - Opening Allowance', 'Removes sections where baseboard is not needed.'),
      row('Total trim needed', 'Adjusted Perimeter + Waste', 'Creates the purchase-ready linear footage.'),
      row('Pieces needed', 'Total Trim Needed / Stock Piece Length', 'Converts linear footage into order units.'),
    ],
    references: [REF.lowesTransitionGuide, REF.lowesFlooringEstimator],
    understanding: [
      card('Baseboard is a perimeter problem', 'It is estimated from wall length and openings, not from floor area.'),
      card('Stock length changes the finish result', 'Longer trim pieces can reduce joints while shorter stock can increase cuts and visible seams.'),
      card('Waste deserves its own line item', 'Corner cuts and trim fitting can consume more material than many buyers expect.'),
      card('A trim estimate should be purchase-ready', 'Linear feet alone are useful, but stock-piece count is what usually drives the shopping list.'),
    ],
    faqs: [
      faq('How do you estimate baseboard?', 'A common method starts with room perimeter, subtracts openings, adds waste, and converts the result into stock pieces.', 'Basics'),
      faq('Why subtract opening allowance?', 'Because baseboard is often not installed through doorways or similar gaps.', 'Method'),
      faq('Why show both linear feet and pieces?', 'Because trim is priced and purchased by stock length, not by custom-cut exact footage.', 'Planning'),
    ],
  }),
  'transition-strip': cfg({
    title: 'Transition Strip Calculator',
    subtitle: 'Estimate transition-strip length, waste, and stock pieces for flooring changes between surfaces',
    focus: 'transition-trim length and stock-piece ordering',
    concept: 'transition strip planning',
    researchFocus: 'transition length, stock length, waste, and trim breaks between surfaces',
    intro: 'This calculator is designed for projects that need reducers, thresholds, T-moldings, or other transition pieces where the relevant measurement is the break line between flooring surfaces.',
    stepTips: [
      'Enter the total transition length rather than the full room perimeter, because only the break lines between surfaces matter here.',
      'Use stock piece length so the result can convert linear footage into real trim pieces.',
      'Add waste for cuts around door frames and finish details.',
      'Review the popup as a trim-ordering tool before purchasing transitions separately from the floor itself.',
    ],
    dashboardTips: [
      'Total transition-strip length needed.',
      'Transition length versus waste.',
      'Piece length used for ordering.',
      'Rounded stock-piece count.',
    ],
    features: [
      'Transition length and pieces in one run',
      'Useful for reducers, thresholds, T-moldings, and similar profiles',
      'Waste kept explicit for cut-heavy finish details',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on trim details that are easy to miss in flooring budgets',
      'Feature set informed by live flooring buying guides',
    ],
    decisionCards: [
      card('If piece count feels high', 'Short stock lengths may be creating more seams than the project really needs.'),
      card('If the transition route is irregular', 'A slightly higher waste allowance may be safer than a tight exact-length estimate.'),
      card('If multiple flooring types meet in one zone', 'Transition selection and quantity should be planned together so the order stays consistent.'),
      card('If this trim is being color-matched', 'Ordering enough at once can avoid finish mismatches later if stock changes.'),
    ],
    quickRows: [
      row('Transition length', 'Measured Break Line Between Surfaces', 'Shows the actual route the trim must cover.'),
      row('Waste length', 'Transition Length x Waste %', 'Adds allowance for fit and cut adjustments.'),
      row('Total trim needed', 'Transition Length + Waste Length', 'Creates the purchase-ready linear footage.'),
      row('Piece count', 'Total Trim Needed / Stock Piece Length', 'Translates footage into order units.'),
    ],
    references: [REF.lowesTransitionGuide, REF.lowesVinylGuide, REF.lowesLaminateGuide],
    understanding: [
      card('Transition strips are measured on break lines', 'The relevant quantity is the changeover length between surfaces, not the full room footprint.'),
      card('Stock length controls seam count', 'Longer pieces can reduce visible joints and create a cleaner finish.'),
      card('Waste matters even on small trims', 'Door jamb cuts and exact edge fitting can consume more material than expected.'),
      card('Transitions deserve their own budget line', 'They are often forgotten until late in the project, even though they affect both finish quality and total cost.'),
    ],
    faqs: [
      faq('How do you estimate transition strips?', 'Measure the total break length between floor surfaces, add waste, and divide by stock piece length for an order count.', 'Basics'),
      faq('Why not use room perimeter?', 'Because transition trim only covers the lines where one surface changes to another.', 'Method'),
      faq('Should waste still be added for transition trim?', 'Yes. Fit adjustments and cuts at jambs or corners can still create extra material demand.', 'Planning'),
    ],
  }),
  'floor-joist': cfg({
    title: 'Floor Joist Calculator',
    subtitle: 'Estimate joist count, linear footage, and actual average spacing for a framed floor layout',
    focus: 'joist quantity and framing-material planning',
    concept: 'floor joist takeoff',
    researchFocus: 'room width, joist spacing, span length, and lumber quantity',
    intro: 'This calculator is built for layout planning where the goal is to estimate how many joists and how much lumber a framed floor might require before materials are ordered.',
    stepTips: [
      'Enter the floor width perpendicular to the joists so the spacing logic can work correctly.',
      'Use the joist span length as the linear footage for each joist in the layout.',
      'Enter target spacing in inches to estimate how many joist lines fit across the floor width.',
      'Treat the result as a material-planning estimate, not as structural engineering approval.',
    ],
    dashboardTips: [
      'Estimated joist count as the lead metric.',
      'Total linear footage of joists.',
      'Span length per joist.',
      'Actual average spacing created by the layout.',
    ],
    features: [
      'Joist count and total linear footage in one run',
      'Spacing-aware material planning',
      'Actual achieved spacing shown alongside target spacing',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on framing takeoffs, not engineering shortcuts',
      'Feature pattern informed by live framing and construction guides',
    ],
    decisionCards: [
      card('If joist count rises sharply', 'A tighter spacing choice or a wider floor width is usually the main driver.'),
      card('If actual spacing differs from target', 'That is normal at the final bay and is why the achieved spacing is shown separately.'),
      card('If total linear footage feels high', 'The span length may be long enough that lumber takeoff matters more than joist count alone.'),
      card('If this is a structural design decision', 'Use local code, span tables, and engineering guidance before finalizing member sizes or layout.'),
    ],
    quickRows: [
      row('Joist count', 'Floor Width / Joist Spacing, then rounded into layout lines', 'Estimates how many framing members are needed across the floor.'),
      row('Total linear feet', 'Joist Count x Span Length', 'Shows the total lumber length represented by the joist layout.'),
      row('Target spacing', 'Chosen On-center Spacing', 'Keeps the design assumption visible.'),
      row('Actual average spacing', 'Floor Width / (Joist Count - 1)', 'Shows the average spacing created by the estimated layout.'),
    ],
    references: [REF.lowesEngineeredWoodPdf],
    understanding: [
      card('This tool is for quantity planning', 'It helps estimate joists and lumber length, but it does not replace code tables or engineering for structural design.'),
      card('Spacing is a layout driver', 'Changing spacing can significantly affect both joist count and the cost of the floor frame.'),
      card('Linear footage matters too', 'A layout with only a few more joists can still add a meaningful amount of lumber if the span is long.'),
      card('Real framing layouts rarely land perfectly', 'That is why average achieved spacing is shown next to the target spacing.'),
    ],
    faqs: [
      faq('How do you estimate floor joists?', 'A practical takeoff divides floor width by the planned joist spacing, adds edge lines, and then multiplies by joist length for lumber footage.', 'Basics'),
      faq('Does this calculator size the joists structurally?', 'No. It estimates quantity only and should not replace code, span tables, or engineering review.', 'Limits'),
      faq('Why show actual average spacing?', 'Because a framed layout often ends with a final bay that is not exactly equal to the target spacing.', 'Method'),
    ],
  }),
  'floor-leveling': cfg({
    title: 'Floor Leveling Calculator',
    subtitle: 'Estimate leveling-compound bags, adjusted coverage, and pour depth requirements for an uneven floor',
    focus: 'self-leveling compound quantity and depth-sensitive coverage',
    concept: 'floor leveling planning',
    researchFocus: 'coverage area, pour depth, reference coverage, and bag count',
    intro: 'This calculator is designed for floor-prep work where self-leveling compound coverage changes quickly with depth, making it easy to underestimate material if you plan from area alone.',
    stepTips: [
      'Enter room dimensions and waste so the prep area reflects the real pour footprint.',
      'Use the product reference coverage at 1/8 inch because many leveling compounds publish yield at that depth.',
      'Enter average pour depth so the calculator can adjust actual bag coverage for your scenario.',
      'Review the popup as a prep-material estimate before final substrate mapping is completed.',
    ],
    dashboardTips: [
      'Estimated bags needed as the lead output.',
      'Adjusted bag coverage at the chosen depth.',
      'Coverage area used after waste.',
      'Reference coverage at 1/8 inch shown for comparison.',
    ],
    features: [
      'Depth-adjusted bag count in one run',
      'Reference and adjusted coverage shown together',
      'Useful for floor prep before tile, wood, vinyl, or laminate installs',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on prep-layer quantity planning',
      'Feature set informed by live underlayment and leveling product references',
    ],
    decisionCards: [
      card('If bag count feels high', 'Average pour depth is usually the first place to check because depth changes coverage quickly.'),
      card('If adjusted coverage is much lower than the bag label', 'That is normal when the average depth is meaningfully thicker than the reference depth.'),
      card('If the project has many low spots', 'A simple average depth may still understate actual material use.'),
      card('If ordering is tight', 'Leveling products often deserve some cushion because field conditions can change once mixing begins.'),
    ],
    quickRows: [
      row('Reference coverage', 'Manufacturer Coverage at 1/8 in', 'Shows the yield starting point from the product assumption.'),
      row('Depth factor', 'Pour Depth / 1/8 in', 'Shows how much the planned depth changes yield.'),
      row('Adjusted coverage', 'Reference Coverage / Depth Factor', 'Converts the labeled yield into the planned field condition.'),
      row('Bags needed', 'Coverage Area Used / Adjusted Coverage', 'Translates area and depth into purchase quantity.'),
    ],
    references: [REF.lowesUnderlaymentPdf, REF.lowesFlooringEstimator],
    understanding: [
      card('Leveling coverage is depth-sensitive', 'Bag yield falls rapidly as average pour depth increases beyond the thin reference layer.'),
      card('Prep area is still area-based', 'Room size and waste define the footprint, but depth determines how much product that footprint will consume.'),
      card('Average depth is only an estimate', 'Projects with severe low spots can use more compound than a clean average suggests.'),
      card('Planning the prep layer early reduces risk later', 'A strong leveling estimate helps avoid delays once floor installation is ready to begin.'),
    ],
    faqs: [
      faq('How do you estimate floor leveling compound?', 'A practical method starts with the prep area, then adjusts the product coverage for the average pour depth before calculating bag count.', 'Basics'),
      faq('Why use reference coverage at 1/8 inch?', 'Because many products publish their yield from that baseline depth, which can then be adjusted for thicker pours.', 'Method'),
      faq('Is average pour depth enough?', 'It is a planning estimate, but heavily uneven floors can still require more material than the average suggests.', 'Planning'),
    ],
  }),
  'floor-heating': cfg({
    title: 'Floor Heating Calculator',
    subtitle: 'Estimate heated area, system wattage, daily energy use, and monthly operating cost for radiant floor heat',
    focus: 'heated-floor coverage and operating-cost planning',
    concept: 'radiant floor heating planning',
    researchFocus: 'heated coverage, watt density, daily use, and operating cost',
    intro: 'This calculator is built for radiant floor heating projects where the important questions are how much floor will actually be heated, how much power that requires, and what the system may cost to run.',
    stepTips: [
      'Enter room dimensions to define the full floor area before deciding what share will actually be heated.',
      'Use heated coverage percent rather than assuming fixed cabinets and fixtures receive heat too.',
      'Add watts per square foot and expected daily runtime to estimate power demand and energy use.',
      'Enter electricity rate if you want the dashboard to estimate monthly operating cost.',
    ],
    dashboardTips: [
      'Heated floor coverage as the lead output.',
      'System wattage for load planning.',
      'Estimated kWh per day from runtime assumptions.',
      'Monthly operating cost from your energy-rate input.',
    ],
    features: [
      'Heated area, wattage, and energy cost in one run',
      'Coverage ratio kept separate from full room area',
      'Useful for sizing expectations and operating-cost discussions',
      'Popup-only advanced dashboard consistent with the approved structure',
      'Original content focused on coverage and run-cost planning',
      'Feature pattern informed by live radiant-floor heating resources',
    ],
    decisionCards: [
      card('If monthly cost feels high', 'Daily runtime and heated coverage are usually the first assumptions to revisit.'),
      card('If system wattage climbs quickly', 'A high watt density or large heated footprint may be driving more load than expected.'),
      card('If full-room heating is not necessary', 'Reducing the heated coverage ratio can materially improve both power demand and operating cost.'),
      card('If comparing systems', 'Coverage area and operating assumptions should be held constant so the comparison stays fair.'),
    ],
    quickRows: [
      row('Heated area', 'Room Area x Heated Coverage %', 'Shows the part of the room that will actually receive heat.'),
      row('System wattage', 'Heated Area x Watts per Sq Ft', 'Estimates the electrical load of the system.'),
      row('Daily energy use', '(System Watts x Daily Hours) / 1,000', 'Converts watt load into kilowatt-hours per day.'),
      row('Monthly cost', 'Daily kWh x Rate x 30', 'Estimates what the system may cost to operate in a typical month.'),
    ],
    references: [REF.warmlyYoursCost, REF.schluterDitra],
    understanding: [
      card('Radiant-floor planning starts with heated area', 'Most systems heat only the open floor area that actually contributes to comfort.'),
      card('Watt density drives electrical load', 'The same room can place very different demands on the circuit depending on the system selected.'),
      card('Operating cost depends on runtime assumptions', 'Comfort, climate, thermostat strategy, and schedule all affect what the system will actually consume.'),
      card('Coverage and cost should be reviewed together', 'A system that looks attractive on comfort can still need adjustment if the operating assumptions are too aggressive.'),
    ],
    faqs: [
      faq('How do you estimate radiant floor heating?', 'A useful approach multiplies the heated floor area by watt density, then converts the result into energy use and operating cost.', 'Basics'),
      faq('Why not heat the full room area?', 'Fixed cabinets, tubs, islands, and other permanent fixtures are often excluded from heated coverage.', 'Method'),
      faq('Is the monthly cost exact?', 'No. It is a planning estimate based on the runtime and energy-rate assumptions you enter.', 'Planning'),
    ],
  }),
  carpet: cfg({
    title: 'Carpet Calculator',
    subtitle: 'Estimate carpet square footage, square yards, strip runs, and seam count from room size and roll width',
    focus: 'carpet ordering based on roll width and purchased area',
    concept: 'carpet takeoff',
    researchFocus: 'roll width, purchased area, square yards, and seam planning',
    intro: 'This calculator is built for carpet projects where the quantity purchased depends on roll width and seam layout, not only on the floor area itself.',
    stepTips: [
      'Enter room length and width to establish the finished carpet footprint.',
      'Use the carpet roll width you plan to buy because that determines how many strips are required.',
      'Add waste so the estimate reflects trimming and layout loss instead of only the clean room footprint.',
      'Review the popup as both an ordering and seam-planning tool.',
    ],
    dashboardTips: [
      'Estimated carpet needed as the lead output.',
      'Square yards shown for carpet-style ordering.',
      'Strip runs needed based on roll width.',
      'Estimated seam count for installation context.',
    ],
    features: [
      'Purchased area and square yards in one run',
      'Roll-width-aware strip planning',
      'Seam count made visible for install context',
      'Popup-only advanced dashboard aligned with the approved structure',
      'Original content focused on carpet measurement and ordering',
      'Feature set informed by live carpet measurement tools',
    ],
    decisionCards: [
      card('If purchased area is much larger than room area', 'Roll width and strip layout are probably driving more waste than the room footprint suggests.'),
      card('If seam count rises', 'A narrower roll width or wider room may be forcing more joined sections.'),
      card('If square yards feel high', 'Remember carpet is often discussed and priced in yards even when the room was measured in feet.'),
      card('If comparing carpet products', 'Roll width can matter as much as the room area when estimating what to buy.'),
    ],
    quickRows: [
      row('Room area', 'Length x Width', 'Shows the finished carpet footprint before roll-width effects.'),
      row('Square yards', 'Total Carpet Area / 9', 'Converts coverage into a common carpet ordering unit.'),
      row('Strip runs', 'Room Width / Roll Width', 'Shows how many widths of carpet are needed across the room.'),
      row('Seam count', 'Strip Runs - 1', 'Gives a quick read on how many carpet seams the layout may create.'),
    ],
    references: [REF.lowesCarpetCalc, REF.lowesFlooringEstimator],
    understanding: [
      card('Carpet buying is roll-width driven', 'Purchased quantity often changes because of roll width and seam layout, not because the room area changed.'),
      card('Square yards are still common', 'That unit remains useful for pricing and comparing carpet products.'),
      card('Seams affect more than material', 'They also influence labor, appearance, and layout strategy.'),
      card('A room can look simple and still need extra carpet', 'Orientation and strip planning often explain why purchased area exceeds the clean floor footprint.'),
    ],
    faqs: [
      faq('How do you estimate carpet?', 'A useful method starts with room size, then considers roll width, purchased area, and square-yard conversion.', 'Basics'),
      faq('Why show seam count?', 'Because seam planning often affects installation quality and how much carpet is actually purchased.', 'Method'),
      faq('Why is purchased area sometimes larger than room area?', 'Carpet comes in roll widths, so the layout can force extra material even in simple rooms.', 'Interpretation'),
    ],
  }),
};
