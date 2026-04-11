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

export type PaintWallCoveringVariant =
  | 'cabinet-paint'
  | 'ceiling-paint'
  | 'deck-stain'
  | 'epoxy-coverage'
  | 'number-of-coats'
  | 'paint'
  | 'paint-mixing-ratio'
  | 'primer'
  | 'spray-paint-coverage'
  | 'stain'
  | 'texture'
  | 'touch-up-paint'
  | 'trim-paint'
  | 'wall-area'
  | 'wallpaper';

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
  swPaintCalc: link('Sherwin-Williams Paint Calculator', 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator'),
  swEstimateWallpaper: link('Sherwin-Williams How to Estimate Wallpaper', 'https://www.sherwin-williams.com/homeowners/how-to/wallpapering-how-tos/sw-article-dir-howtoestimate'),
  swHandbook: link("Sherwin-Williams DIY Painter's Handbook", 'https://blog.sherwin-williams.com/projects/project-product-advice/the-diy-painters-handbook/'),
  rustOleumEpoxy: link('Rust-Oleum Water-Based Epoxy Technical Data Sheet PDF', 'https://www.rustoleum.com/~/media/DigitalEncyclopedia/Documents/RustoleumUSA/TDS/English/IBG/Sierra/Sierra_S60_Water-Based_Epoxy_Maintenance_Coating_SP25_ARJ1678.ashx'),
  hdWallpaperPdf: link('Home Depot How to Hang Prepasted Wallpaper PDF', 'https://www.homedepot.com/catalog/pdfImages/56/564ec874-280d-4d4c-80e0-e214706bdee0.pdf'),
};

const baseWhyUse = (focus: string): CardItem[] => [
  card('Project-ready quantities', `The result is framed around ${focus}, not just a stripped-down square-foot number.`),
  card('Popup-only advanced dashboard', 'The calculator keeps the approved modal pattern so quantity, assumptions, and watchouts stay together.'),
  card('Better finish planning', 'Area, coats, coverage, and purchase-ready units remain attached to the same run.'),
  card('Live feature research', 'Inputs and outputs were selected after reviewing public paint, wallpaper, and coating tools online.'),
];

const baseUnderstanding = (concept: string, focus: string): CardItem[] => [
  card('Area drives the first estimate', `Most ${concept} decisions still begin with the actual surface area behind the project.`),
  card('Coverage is an assumption, not a guarantee', `The final ${focus} requirement can move when texture, porosity, color shift, or application method changes.`),
  card('Coats matter more than many people expect', 'A second or third coat changes both the material order and the project timeline, so it should stay visible in the estimate.'),
  card('Purchase units change planning', 'Gallons, quarts, rolls, cans, and kits each shape how much overage is practical to buy.'),
];

const baseFaqs = (title: string, concept: string): FAQItem[] => [
  faq(`How does this ${title.toLowerCase()} work?`, `It converts your project measurements into a base ${concept} estimate, then layers on the purchase and coverage assumptions that matter for planning.`, 'Method'),
  faq('Why are coverage assumptions shown separately?', 'Coverage can shift with product line, surface prep, porosity, texture, and application method, so it should stay visible instead of hidden.', 'Planning'),
  faq('Can I use this as my final order?', 'It works best as a planning takeoff before product-specific label coverage, site prep, and finish expectations are finalized.', 'Usage'),
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
    `A basic ${seed.title.toLowerCase()} usually stops at one quantity, but real finish planning usually depends on supporting context like openings, coats, coverage, waste, and package size.`,
    `This advanced version keeps those linked details visible so ${seed.concept} is easier to review the way painters, contractors, and homeowners actually make purchasing decisions.`,
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

const areaFinishConfig = (
  title: string,
  focus: string,
  concept: string,
  intro: string,
  refs: LinkItem[],
  extraFeature: string
): VariantConfig =>
  cfg({
    title,
    subtitle: `Estimate ${focus} from surface area, coats, and product coverage in one run`,
    focus,
    concept,
    researchFocus: 'surface area measurement, coat count, product coverage, and purchase-ready ordering',
    intro,
    stepTips: ['Enter the project dimensions first so the base area is clear.', 'Deduct openings where relevant instead of assuming the full room gets coated.', 'Keep coat count visible so the material plan matches the actual finish goal.', 'Review the popup as a purchase-planning dashboard, not only as an area estimate.'],
    dashboardTips: ['Primary material quantity stays front and center.', 'Base area and assumptions remain visible for auditability.', 'Rounded purchase units help with store planning.', 'Notes call out the assumptions most likely to move the final order.'],
    features: ['Area, coverage, and purchase units in one run', 'Coat count handled explicitly instead of hidden inside one output', 'Popup-only advanced dashboard consistent with the approved structure', 'Original content tailored to finishing and coatings work', 'Designed to support real paint-store or supplier ordering decisions', extraFeature],
    decisionCards: [card('If the estimate feels high', 'Check whether coat count, coverage, or deducted openings are driving the result.'), card('If rounded purchase units jump', 'A small change in area or coverage can push the order into the next can, gallon, or kit.'), card('If surface texture is rough', 'Real-world coverage often drops when surfaces are highly absorbent or irregular.'), card('If comparing products', 'Keeping the coverage assumption visible makes label-to-label comparisons easier.')],
    quickRows: [row('Surface area', 'Measured area minus deductions when needed', 'Creates the real finish area before material is estimated.'), row('Total coated area', 'Surface Area x Coats', 'Shows how much actual finish coverage the project requires.'), row('Material quantity', 'Total Coated Area / Coverage Rate', 'Converts the project into gallons, kits, cans, or rolls.'), row('Rounded purchase unit', 'Round up to the nearest package size', 'Helps translate the estimate into a practical order.')],
    references: refs,
  });

export const PAINT_WALL_COVERING_CONFIG: Record<PaintWallCoveringVariant, VariantConfig> = {
  paint: areaFinishConfig(
    'Paint Calculator',
    'wall paint quantity and gallon planning',
    'interior wall paint planning',
    'This calculator is built for room-paint planning where wall area, deductions, coat count, and gallon coverage need to be translated into a realistic paint order.',
    [REF.swPaintCalc, REF.swHandbook],
    'Feature pattern informed by live paint-estimating tools from major coating brands'
  ),
  'ceiling-paint': areaFinishConfig(
    'Ceiling Paint Calculator',
    'ceiling paint quantity and gallon planning',
    'ceiling paint planning',
    'This calculator is designed for ceiling work where room footprint, coat count, and finish coverage need to be separated cleanly from the wall-paint order.',
    [REF.swPaintCalc, REF.swHandbook],
    'Useful for isolating ceiling material from the rest of the room package'
  ),
  primer: areaFinishConfig(
    'Primer Calculator',
    'primer quantity and gallon planning',
    'primer planning',
    'This calculator is built for prep-heavy projects where primer deserves its own material takeoff instead of being bundled into finish paint assumptions.',
    [REF.swPaintCalc, REF.swHandbook],
    'Useful when strong color changes, bare drywall, or repairs require separate prep material'
  ),
  wallpaper: cfg({
    title: 'Wallpaper Calculator',
    subtitle: 'Estimate wallpaper rolls from wall area, opening deductions, and repeat-waste assumptions',
    focus: 'wallpaper roll quantity and waste-aware ordering',
    concept: 'wallpaper quantity planning',
    researchFocus: 'usable wall area, roll coverage, repeat waste, and purchase-ready wallpaper ordering',
    intro: 'This calculator is built for wallpaper planning where wall area, roll yield, and pattern waste all influence how many rolls should actually be purchased.',
    stepTips: ['Measure the wall dimensions and deduct large openings first.', 'Enter usable roll coverage rather than relying only on package length.', 'Keep repeat waste visible if the pattern requires matching.', 'Review the popup to see both clean wall area and adjusted order area.'],
    dashboardTips: ['Estimated wallpaper rolls as the lead output.', 'Net wall area stays visible beside adjusted area.', 'Pattern waste is separated for easier comparison.', 'Notes explain where wallpaper orders typically grow.'],
    features: ['Wall area, repeat waste, and roll count in one run', 'Useful for feature walls and full-room wallpaper jobs', 'Popup-only advanced dashboard consistent with the approved pattern', 'Original content focused on wallpaper purchasing decisions', 'Deducted openings keep the estimate grounded in the actual wall surface', 'Feature pattern informed by live wallpaper estimating resources'],
    decisionCards: [card('If roll count feels high', 'Pattern repeat waste may be carrying more of the order than the wall area itself.'), card('If openings are large', 'Deducting doors and windows can materially change the final wallpaper count.'), card('If matching is complex', 'A cautious waste allowance is usually safer than ordering too tightly.'), card('If a feature wall is the goal', 'Use the clean wall area to separate one-wall jobs from full-room orders.')],
    quickRows: [row('Net wall area', 'Gross Wall Area - Openings', 'Defines the usable wallpaper surface.'), row('Adjusted wall area', 'Net Area x (1 + Pattern Waste %)', 'Adds the practical overage needed for matching and cuts.'), row('Roll count', 'Adjusted Area / Coverage per Roll', 'Converts wall area into how wallpaper is purchased.'), row('Rounded order', 'Round up to whole rolls', 'Keeps the result purchase-ready.')],
    references: [REF.swEstimateWallpaper, REF.hdWallpaperPdf, REF.swHandbook],
  }),
  'wall-area': areaFinishConfig(
    'Wall Area Calculator',
    'paintable wall area planning',
    'wall-area measurement planning',
    'This calculator is built for estimating wall surface before paint, wallpaper, primer, or texture decisions are made.',
    [REF.swPaintCalc, REF.swEstimateWallpaper],
    'Useful as a reusable measuring baseline for multiple finish options'
  ),
  texture: areaFinishConfig(
    'Texture Calculator',
    'texture material quantity and bag planning',
    'wall texture planning',
    'This calculator is designed for texture jobs where wall area, coat count, and bag yield need to be translated into a practical material order.',
    [REF.swHandbook, REF.swPaintCalc],
    'Useful for orange-peel, knockdown, and repair-blend planning before materials are purchased'
  ),
  stain: areaFinishConfig(
    'Stain Calculator',
    'stain quantity and gallon planning',
    'general stain planning',
    'This calculator is built for stain projects where flat-surface area, coat count, and product coverage need to be turned into a realistic material estimate.',
    [REF.swHandbook, REF.swPaintCalc],
    'Useful for wood panels, furniture sections, and general stain-covered surfaces'
  ),
  'deck-stain': areaFinishConfig(
    'Deck Stain Calculator',
    'deck stain quantity and gallon planning',
    'deck stain planning',
    'This calculator is designed for deck finishing where deck footprint, coat count, and stain coverage need to be converted into a purchase-ready order.',
    [REF.swHandbook, REF.swPaintCalc],
    'Useful for estimating deck surface coating separately from fences or rail systems'
  ),
  'spray-paint-coverage': areaFinishConfig(
    'Spray Paint Coverage Calculator',
    'spray paint can count and overspray-aware planning',
    'spray paint coverage planning',
    'This calculator is built for aerosol and spray-applied coatings where overspray and can coverage can change the final order quickly.',
    [REF.swHandbook, REF.swPaintCalc],
    'Overspray is kept explicit so the order reflects spray application rather than brush-and-roll assumptions'
  ),
  'paint-mixing-ratio': cfg({
    title: 'Paint Mixing Ratio Calculator',
    subtitle: 'Scale paint, thinner, and hardener volumes from a batch ratio without doing manual conversions',
    focus: 'paint batch planning and mix-component scaling',
    concept: 'paint mixing-ratio planning',
    researchFocus: 'ratio-based batch scaling, thinner volume, hardener volume, and total mixed output',
    intro: 'This calculator is built for mixed coating systems where paint, thinner, and hardener need to be scaled accurately from a chosen batch size.',
    stepTips: ['Enter the amount of paint you want to start with.', 'Use the exact part ratio listed on the product system you are mixing.', 'Keep thinner and hardener as separate parts rather than rolling them into one combined number.', 'Review the popup to see both component volumes and total mixed volume.'],
    dashboardTips: ['Total mixed volume as the lead output.', 'Each component volume stays visible.', 'Part counts are shown for fast cross-checking.', 'Notes explain how the ratio is being scaled.'],
    features: ['Paint, thinner, and hardener scaling in one run', 'Useful for partial-batch planning and spray-gun prep', 'Popup-only advanced dashboard consistent with the approved structure', 'Original content focused on ratio-based coating prep', 'Component-by-component output reduces batch-mixing mistakes', 'Feature pattern informed by live coating prep guidance and product docs'],
    decisionCards: [card('If total volume is larger than expected', 'The thinner and hardener parts may be contributing more volume than you anticipated.'), card('If scaling a partial batch', 'Using paint as the anchor value makes it easier to size a smaller mix accurately.'), card('If components are measured differently', 'Convert all parts to the same unit before mixing so the ratio stays valid.'), card('If product instructions differ', 'Always follow the product system label if its mix rules conflict with a generic ratio assumption.')],
    quickRows: [row('Paint anchor volume', 'Chosen starting paint amount', 'Defines the batch size you want to build around.'), row('Component scaling', 'Paint Volume x Component Parts / Paint Parts', 'Turns ratio parts into actual liquid volumes.'), row('Total mixed volume', 'Paint + Thinner + Hardener', 'Shows the total batch you will have available.'), row('Part validation', 'Sum of all ratio parts', 'Helps verify that the entered ratio is being read correctly.')],
    references: [REF.rustOleumEpoxy, REF.swHandbook],
  }),
  'number-of-coats': areaFinishConfig(
    'Number of Coats Calculator',
    'coat recommendation and material-planning support',
    'paint coat planning',
    'This calculator is designed for deciding how many coats a project is likely to need before the paint order is finalized.',
    [REF.swPaintCalc, REF.swHandbook],
    'Color-change and porosity factors are kept visible instead of hiding the recommendation inside one guess'
  ),
  'trim-paint': areaFinishConfig(
    'Trim Paint Calculator',
    'trim paint quantity and gallon planning',
    'trim-paint planning',
    'This calculator is built for trim packages where linear footage and trim width need to be translated into a more realistic enamel or trim-paint order.',
    [REF.swPaintCalc, REF.swHandbook],
    'Useful for separating trim paint from wall paint on the same room or whole-home job'
  ),
  'cabinet-paint': areaFinishConfig(
    'Cabinet Paint Calculator',
    'cabinet paint quantity and gallon planning',
    'cabinet paint planning',
    'This calculator is designed for cabinet refinishing where doors, drawers, and exposed frame area need to be translated into a dedicated coating order.',
    [REF.swHandbook, REF.swPaintCalc],
    'Door and drawer geometry stay visible so cabinet-paint estimates are less guessy than a room-area shortcut'
  ),
  'epoxy-coverage': areaFinishConfig(
    'Epoxy Coverage Calculator',
    'epoxy kit quantity and floor-coating planning',
    'epoxy floor-coating planning',
    'This calculator is built for epoxy systems where floor area, coats, and kit coverage need to be turned into a realistic package count before purchase.',
    [REF.rustOleumEpoxy, REF.swHandbook],
    'Useful for garage floors, workshop floors, and other packaged coating systems'
  ),
  'touch-up-paint': areaFinishConfig(
    'Touch-up Paint Calculator',
    'touch-up paint quantity and quart planning',
    'touch-up paint planning',
    'This calculator is designed for patch-and-touch-up work where small repair spots need to be turned into a sensible quart- or gallon-based material estimate.',
    [REF.swHandbook, REF.swPaintCalc],
    'The result is shown in quart-equivalent terms so small repairs are easier to plan realistically'
  ),
};
