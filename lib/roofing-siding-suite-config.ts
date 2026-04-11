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

export type RoofingSidingVariant =
  | 'board-and-batten'
  | 'downspout'
  | 'fascia'
  | 'gutter'
  | 'house-wrap'
  | 'metal-roofing'
  | 'rafter-length'
  | 'ridge-cap'
  | 'roof-area'
  | 'roof-pitch'
  | 'roof-ventilation'
  | 'shingle'
  | 'siding'
  | 'soffit'
  | 'vinyl-siding';

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
const link = (label: string, url: string): LinkItem => ({ label, url });

const REF = {
  gafShingle: link(
    'GAF Timberline HDZ Installation Instructions PDF',
    'https://www.gaf.com/en-us/document-library/documents/productdocuments/residentialroofingdocuments/shinglesdocuments/timberlineroofingshinglesdocuments/architecturalshinglesdocuments/timberlinehdzdocuments/Installation_Instructions__Timberline_HDZ_High_Definition_Lifetime_Shingles_.pdf'
  ),
  gafVentCalc: link('GAF Attic Ventilation Calculator', 'https://www.gaf.com/en-us/for-professionals/tools/ventilation-calculator'),
  gafRidgeVent: link(
    'GAF Cobra Exhaust Vent Installation Instructions PDF',
    'https://www.gaf.com/en-us/document-library/documents/installation-instructions-%26-guides/installation_instructions__cobra_exhaust_vent_hand_nail_092_trilingual.pdf'
  ),
  hdMetalRoof: link('Home Depot Classic Rib Install Guide PDF', 'https://www.homedepot.com/catalog/pdfImages/71/71b536d5-7179-4b4b-82e2-bd8e755c9e00.pdf'),
  lowesVinylSiding: link('Lowe’s Vinyl Siding Installation Guide PDF', 'https://pdf.lowes.com/productdocuments/c6e6792c-cabd-4cb1-91e6-41e647628288/10825771.pdf'),
  lowesHouseWrap: link('Lowe’s House Wrap Installation Instructions PDF', 'https://pdf.lowes.com/productdocuments/dac7a5da-5d99-454e-b875-f361aa9de7dc/05392876.pdf'),
  lowesSidingGuide: link('Vinyl Siding Institute Installation Manual PDF', 'https://vinylsiding.org/wp-content/uploads/2020/06/2020-VSI-Installation-Manual.pdf'),
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Quantity-first planning', `The result is organized around ${focus}, not just one stripped-down measurement.`),
  card('Popup-only advanced dashboard', 'The calculator keeps the approved modal result pattern so takeoff numbers and watchouts stay together.'),
  card('Trade-friendly context', 'Squares, linear feet, panels, bundles, and ventilation assumptions stay visible in the same run.'),
  card('Live feature research', 'Inputs and outputs were selected after reviewing public roofing, siding, and manufacturer guidance online.'),
];

const baseUnderstanding = (concept: string, focus: string): CardItem[] => [
  card('Geometry drives exterior takeoffs', `Most ${concept} decisions still begin with the roof slope, wall area, or edge length behind the material order.`),
  card('Waste and detailing matter', `The final ${focus} quantity changes when cuts, overlaps, trim, starter pieces, or accessory details are included.`),
  card('Ordering units shape the plan', 'Roofing and exterior materials are purchased in bundles, panels, rolls, pieces, or squares, so the output should reflect those units.'),
  card('Planning and code review are different', 'A good takeoff helps you estimate quantity, but local code, manufacturer specs, and structural details still need separate confirmation.'),
];

const baseFaqs = (title: string, concept: string): FAQItem[] => [
  faq(`How does this ${title.toLowerCase()} work?`, `It converts your project dimensions into a base ${concept} estimate and then layers on purchase-ready units like bundles, panels, pieces, or rolls.`, 'Method'),
  faq('Why are waste and companion metrics shown separately?', 'They make it easier to see whether the order is being driven by raw geometry, slope, overlaps, or accessory assumptions.', 'Planning'),
  faq('Can I use this as a final material order?', 'It is best used as a planning takeoff before manufacturer-specific details, local code, and field conditions are finalized.', 'Usage'),
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
    `A basic ${seed.title.toLowerCase()} usually stops at one number, but real roofing and exterior planning usually depends on related units like squares, linear feet, bundles, panels, and waste allowances.`,
    `This advanced version keeps those linked details visible so ${seed.concept} is easier to review the way contractors, suppliers, and homeowners actually plan an order.`,
  ],
  stepTips: seed.stepTips,
  dashboardTips: seed.dashboardTips,
  features: seed.features,
  decisionCards: seed.decisionCards,
  quickRows: seed.quickRows,
  references: seed.references,
  understanding: baseUnderstanding(seed.concept, seed.focus),
  faqs: baseFaqs(seed.title, seed.concept),
  whyUse: baseWhyUse(seed.focus),
});

const roofConfig = (
  title: string,
  focus: string,
  concept: string,
  intro: string,
  refs: LinkItem[],
  extraFeature: string
): VariantConfig =>
  cfg({
    title,
    subtitle: `Estimate ${focus} from roof dimensions, pitch, and order-ready roofing units`,
    focus,
    concept,
    researchFocus: 'roof footprint, roof pitch, slope multiplier, waste allowance, and purchase-ready roof units',
    intro,
    stepTips: ['Start with the roof footprint dimensions so the base geometry is correct.', 'Use the actual pitch assumption rather than guessing the slope effect.', 'Keep waste visible so the order is separated from the raw roof area.', 'Review the popup as a roofing takeoff dashboard, not only as an area estimate.'],
    dashboardTips: ['Primary roofing quantity stays front and center.', 'Pitch metrics remain visible for auditability.', 'Companion ordering units make supplier planning easier.', 'Notes call out the assumptions that usually move the order.'],
    features: ['Roof geometry and ordering units in one run', 'Pitch-driven takeoff rather than footprint-only estimating', 'Popup-only advanced dashboard consistent with the approved structure', 'Original content tailored to roofing planning', 'Useful for comparing raw area against order quantity', extraFeature],
    decisionCards: [card('If the estimate feels high', 'Check the pitch multiplier and waste allowance before changing the footprint dimensions.'), card('If ordering units jump quickly', 'A small roof-area change can push the project into the next bundle, square, or panel count.'), card('If the roof is complex', 'Valleys, hips, penetrations, and layout details often justify a stronger waste allowance.'), card('If comparing roofing systems', 'Keeping both area and order units visible makes material-system comparisons easier.')],
    quickRows: [row('Roof footprint', 'Length x Width', 'Creates the plan-view roof base before slope is applied.'), row('Slope-adjusted area', 'Footprint x Pitch Multiplier', 'Converts flat area into actual roof surface area.'), row('Order quantity', 'Adjusted Area converted into bundles, panels, or related units', 'Translates geometry into how roofing materials are purchased.'), row('Waste-adjusted planning', 'Base Quantity x (1 + Waste %)', 'Shows the practical order target instead of only the clean takeoff.')],
    references: refs,
  });

const exteriorWallConfig = (
  title: string,
  focus: string,
  concept: string,
  intro: string,
  refs: LinkItem[],
  extraFeature: string
): VariantConfig =>
  cfg({
    title,
    subtitle: `Estimate ${focus} from wall area, linear footage, and purchase-ready exterior units`,
    focus,
    concept,
    researchFocus: 'exterior wall area, opening deductions, linear footage, waste allowance, and order-ready siding or trim units',
    intro,
    stepTips: ['Measure the full exterior dimensions first so the base wall or edge area is clear.', 'Deduct openings where the material will not be installed.', 'Keep waste visible so cuts, overlaps, and trim details stay separated from the clean takeoff.', 'Review the popup to compare raw wall area with the purchase-ready quantity.'],
    dashboardTips: ['Primary wall or edge quantity stays front and center.', 'Gross and net area context remains visible.', 'Companion units such as squares, panels, or rolls are shown for ordering.', 'Notes explain where the estimate usually drifts in the field.'],
    features: ['Wall area and purchase units in one run', 'Opening deductions handled explicitly', 'Popup-only advanced dashboard consistent with the approved structure', 'Original content tailored to exterior-envelope planning', 'Useful for comparing clean area against real order quantity', extraFeature],
    decisionCards: [card('If the quantity feels high', 'Openings, waste, and packaging assumptions may need a closer review.'), card('If the wall package is complex', 'Corners, starter strips, trim, and layout details often justify extra material.'), card('If multiple stories are involved', 'Story count changes wall area quickly, so keeping it visible is helpful.'), card('If comparing products', 'Panel or roll coverage can shift the order even when wall area stays the same.')],
    quickRows: [row('Gross wall area', 'Perimeter x Height x Stories', 'Creates the base exterior surface area before deductions.'), row('Net wall area', 'Gross Area - Openings', 'Shows the actual field to be covered.'), row('Purchase quantity', 'Net Area converted into panels, rolls, or pieces', 'Translates the takeoff into the units typically ordered.'), row('Waste-adjusted target', 'Base Quantity x (1 + Waste %)', 'Keeps overage visible instead of hidden.')],
    references: refs,
  });

export const ROOFING_SIDING_CONFIG: Record<RoofingSidingVariant, VariantConfig> = {
  'roof-area': roofConfig(
    'Roof Area Calculator',
    'roof area and squares planning',
    'roof-area planning',
    'This calculator is built for roof takeoffs where a flat building footprint needs to be converted into actual sloped roof area before materials are ordered.',
    [REF.gafShingle, REF.hdMetalRoof],
    'Squares are kept visible because roofing estimates are still often discussed in 100-square-foot units'
  ),
  shingle: roofConfig(
    'Shingle Calculator',
    'shingle bundle planning',
    'shingle quantity planning',
    'This calculator is designed for asphalt roof planning where slope-adjusted area and bundle coverage need to be translated into a realistic shingle order.',
    [REF.gafShingle, REF.gafVentCalc],
    'Bundle coverage and roof squares stay visible so distributor orders are easier to review'
  ),
  'metal-roofing': roofConfig(
    'Metal Roofing Calculator',
    'metal panel and roof-area planning',
    'metal roofing quantity planning',
    'This calculator is built for metal roof projects where roof area, panel coverage width, and panel length need to be translated into a practical panel count.',
    [REF.hdMetalRoof, REF.gafShingle],
    'Covered panel width is used so the output reflects installed coverage more closely than raw sheet width'
  ),
  'roof-pitch': roofConfig(
    'Roof Pitch Calculator',
    'roof pitch and slope multiplier planning',
    'roof-pitch interpretation',
    'This calculator is designed for pitch review where rise and run need to be translated into both slope multiplier and angle before framing or roofing quantities are estimated.',
    [REF.gafShingle, REF.gafVentCalc],
    'Angle and multiplier stay visible together so the pitch can be used in both framing and roofing conversations'
  ),
  'rafter-length': roofConfig(
    'Rafter Length Calculator',
    'rafter length and pitch-based framing planning',
    'rafter-length planning',
    'This calculator is built for simple gable-style framing takeoffs where house span and pitch need to be translated into an approximate rafter run.',
    [REF.gafShingle, REF.hdMetalRoof],
    'The result keeps half span, pitch multiplier, and angle connected so the framing assumptions are easier to audit'
  ),
  'ridge-cap': roofConfig(
    'Ridge Cap Calculator',
    'ridge-cap bundle and ridge-line planning',
    'ridge-cap quantity planning',
    'This calculator is designed for ridge-detail takeoffs where ridge-line length and bundle coverage need to be turned into a purchase-ready cap order.',
    [REF.gafShingle, REF.gafRidgeVent],
    'Linear ridge footage stays separated from roof area because cap material is ordered from the ridge itself'
  ),
  'roof-ventilation': roofConfig(
    'Roof Ventilation Calculator',
    'ridge vent footage and net-free-area planning',
    'roof ventilation planning',
    'This calculator is built for attic ventilation planning where attic floor area and ventilation ratio need to be translated into required exhaust vent length.',
    [REF.gafVentCalc, REF.gafRidgeVent],
    'Balanced intake and exhaust context stays visible so the result is more useful than a single raw vent-footage number'
  ),
  gutter: exteriorWallConfig(
    'Gutter Calculator',
    'gutter section and roof-drainage planning',
    'gutter quantity planning',
    'This calculator is designed for roof-edge drainage planning where total eave run and section length need to be converted into a practical gutter order.',
    [REF.gafRidgeVent, REF.lowesSidingGuide],
    'Section count stays paired with downspout context so the drainage package can be reviewed together'
  ),
  downspout: exteriorWallConfig(
    'Downspout Calculator',
    'downspout count and drainage-area planning',
    'downspout quantity planning',
    'This calculator is built for drainage planning where total roof area is compared against a simplified drainage area per downspout assumption.',
    [REF.gafVentCalc, REF.lowesSidingGuide],
    'Roof drainage area stays visible so the result is grounded in the roof being served'
  ),
  fascia: exteriorWallConfig(
    'Fascia Calculator',
    'fascia piece and roof-edge planning',
    'fascia quantity planning',
    'This calculator is designed for fascia takeoffs where roof-edge length and stock-piece length need to be translated into a practical trim order.',
    [REF.lowesSidingGuide, REF.lowesVinylSiding],
    'Linear roof-edge footage stays front and center because fascia is an edge-driven trim item, not an area-driven finish'
  ),
  soffit: exteriorWallConfig(
    'Soffit Calculator',
    'soffit area and panel planning',
    'soffit quantity planning',
    'This calculator is built for soffit projects where eave run and soffit width need to be translated into a vented or solid soffit material estimate.',
    [REF.lowesVinylSiding, REF.gafVentCalc],
    'Soffit area stays linked to ventilation context so intake planning is easier to review'
  ),
  siding: exteriorWallConfig(
    'Siding Calculator',
    'siding panel and squares planning',
    'siding quantity planning',
    'This calculator is designed for general siding takeoffs where exterior wall area, opening deductions, and panel coverage need to become a practical order.',
    [REF.lowesSidingGuide, REF.lowesVinylSiding],
    'Net wall area and siding squares stay visible together for easier contractor and supplier comparisons'
  ),
  'vinyl-siding': exteriorWallConfig(
    'Vinyl Siding Calculator',
    'vinyl siding panel and squares planning',
    'vinyl siding quantity planning',
    'This calculator is built for vinyl siding jobs where wall area, product coverage, and waste need to be translated into a more realistic order.',
    [REF.lowesVinylSiding, REF.lowesSidingGuide],
    'Useful for comparing net wall area to package-based panel counts before ordering vinyl siding'
  ),
  'board-and-batten': exteriorWallConfig(
    'Board and Batten Calculator',
    'board-and-batten module and batten planning',
    'board-and-batten quantity planning',
    'This calculator is designed for board-and-batten layouts where repeating board modules and batten spacing need to be reflected in the material estimate.',
    [REF.lowesSidingGuide, REF.lowesVinylSiding],
    'Module-based estimating keeps the layout pattern visible instead of treating the wall like generic flat siding'
  ),
  'house-wrap': exteriorWallConfig(
    'House Wrap Calculator',
    'house-wrap roll and envelope-area planning',
    'house-wrap quantity planning',
    'This calculator is built for weather-resistive barrier planning where exterior wall area, overlaps, and roll coverage need to be turned into a practical wrap order.',
    [REF.lowesHouseWrap, REF.lowesSidingGuide],
    'Wrap rolls stay connected to adjusted wall area so overlap-driven waste is easier to review'
  ),
};
