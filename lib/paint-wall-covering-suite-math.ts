import type { PaintWallCoveringVariant } from '@/lib/paint-wall-covering-suite-config';

export interface Inputs {
  roomLengthFeet: string;
  roomWidthFeet: string;
  wallHeightFeet: string;
  doorCount: string;
  doorAreaSqft: string;
  windowCount: string;
  windowAreaSqft: string;
  coats: string;
  coverageSqftPerGallon: string;
  primerCoverageSqftPerGallon: string;
  rollCoverageSqft: string;
  repeatWastePercent: string;
  textureBagCoverageSqft: string;
  trimLinearFeet: string;
  trimWidthInches: string;
  sprayCanCoverageSqft: string;
  oversprayPercent: string;
  deckLengthFeet: string;
  deckWidthFeet: string;
  stainCoverageSqftPerGallon: string;
  cabinetDoorCount: string;
  cabinetDoorHeightInches: string;
  cabinetDoorWidthInches: string;
  drawerCount: string;
  drawerHeightInches: string;
  drawerWidthInches: string;
  cabinetFrameAreaSqft: string;
  epoxyKitCoverageSqft: string;
  touchUpSpotCount: string;
  touchUpSpotWidthInches: string;
  touchUpSpotHeightInches: string;
  touchUpCoats: string;
  contrastFactor: string;
  porousFactor: string;
  paintVolumeGallons: string;
  mixPartPaint: string;
  mixPartThinner: string;
  mixPartHardener: string;
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

const ceil = (value: number) => Math.ceil(Math.max(value, 0));

const BASE_INPUTS: Inputs = {
  roomLengthFeet: '14',
  roomWidthFeet: '12',
  wallHeightFeet: '8',
  doorCount: '1',
  doorAreaSqft: '20',
  windowCount: '2',
  windowAreaSqft: '15',
  coats: '2',
  coverageSqftPerGallon: '375',
  primerCoverageSqftPerGallon: '250',
  rollCoverageSqft: '25',
  repeatWastePercent: '10',
  textureBagCoverageSqft: '100',
  trimLinearFeet: '80',
  trimWidthInches: '4',
  sprayCanCoverageSqft: '20',
  oversprayPercent: '25',
  deckLengthFeet: '20',
  deckWidthFeet: '12',
  stainCoverageSqftPerGallon: '250',
  cabinetDoorCount: '12',
  cabinetDoorHeightInches: '30',
  cabinetDoorWidthInches: '15',
  drawerCount: '6',
  drawerHeightInches: '6',
  drawerWidthInches: '15',
  cabinetFrameAreaSqft: '18',
  epoxyKitCoverageSqft: '250',
  touchUpSpotCount: '6',
  touchUpSpotWidthInches: '8',
  touchUpSpotHeightInches: '8',
  touchUpCoats: '2',
  contrastFactor: '1',
  porousFactor: '0',
  paintVolumeGallons: '1',
  mixPartPaint: '4',
  mixPartThinner: '1',
  mixPartHardener: '1',
};

export const DEFAULT_INPUTS: Record<PaintWallCoveringVariant, Inputs> = {
  paint: { ...BASE_INPUTS },
  'ceiling-paint': { ...BASE_INPUTS },
  primer: { ...BASE_INPUTS },
  wallpaper: { ...BASE_INPUTS, rollCoverageSqft: '25', repeatWastePercent: '12' },
  'wall-area': { ...BASE_INPUTS },
  texture: { ...BASE_INPUTS, textureBagCoverageSqft: '125' },
  stain: { ...BASE_INPUTS, roomLengthFeet: '16', roomWidthFeet: '10', stainCoverageSqftPerGallon: '300' },
  'deck-stain': { ...BASE_INPUTS, deckLengthFeet: '16', deckWidthFeet: '20', stainCoverageSqftPerGallon: '250' },
  'spray-paint-coverage': { ...BASE_INPUTS, sprayCanCoverageSqft: '20', oversprayPercent: '30' },
  'paint-mixing-ratio': { ...BASE_INPUTS, paintVolumeGallons: '1', mixPartPaint: '4', mixPartThinner: '1', mixPartHardener: '1' },
  'number-of-coats': { ...BASE_INPUTS, contrastFactor: '1', porousFactor: '0' },
  'trim-paint': { ...BASE_INPUTS, trimLinearFeet: '120', trimWidthInches: '4' },
  'cabinet-paint': { ...BASE_INPUTS, cabinetFrameAreaSqft: '22' },
  'epoxy-coverage': { ...BASE_INPUTS, roomLengthFeet: '24', roomWidthFeet: '24', epoxyKitCoverageSqft: '250' },
  'touch-up-paint': { ...BASE_INPUTS, touchUpSpotCount: '8', touchUpSpotWidthInches: '6', touchUpSpotHeightInches: '6', touchUpCoats: '2' },
};

export function buildPaintWallCoveringResult(
  variant: PaintWallCoveringVariant,
  inputs: Inputs
): Result {
  const roomLengthFeet = parse(inputs.roomLengthFeet);
  const roomWidthFeet = parse(inputs.roomWidthFeet);
  const wallHeightFeet = parse(inputs.wallHeightFeet);
  const doorCount = parse(inputs.doorCount);
  const doorAreaSqft = parse(inputs.doorAreaSqft);
  const windowCount = parse(inputs.windowCount);
  const windowAreaSqft = parse(inputs.windowAreaSqft);
  const coats = parse(inputs.coats);
  const coverageSqftPerGallon = parse(inputs.coverageSqftPerGallon);
  const primerCoverageSqftPerGallon = parse(inputs.primerCoverageSqftPerGallon);
  const rollCoverageSqft = parse(inputs.rollCoverageSqft);
  const repeatWastePercent = parse(inputs.repeatWastePercent);
  const textureBagCoverageSqft = parse(inputs.textureBagCoverageSqft);
  const trimLinearFeet = parse(inputs.trimLinearFeet);
  const trimWidthInches = parse(inputs.trimWidthInches);
  const sprayCanCoverageSqft = parse(inputs.sprayCanCoverageSqft);
  const oversprayPercent = parse(inputs.oversprayPercent);
  const deckLengthFeet = parse(inputs.deckLengthFeet);
  const deckWidthFeet = parse(inputs.deckWidthFeet);
  const stainCoverageSqftPerGallon = parse(inputs.stainCoverageSqftPerGallon);
  const cabinetDoorCount = parse(inputs.cabinetDoorCount);
  const cabinetDoorHeightInches = parse(inputs.cabinetDoorHeightInches);
  const cabinetDoorWidthInches = parse(inputs.cabinetDoorWidthInches);
  const drawerCount = parse(inputs.drawerCount);
  const drawerHeightInches = parse(inputs.drawerHeightInches);
  const drawerWidthInches = parse(inputs.drawerWidthInches);
  const cabinetFrameAreaSqft = parse(inputs.cabinetFrameAreaSqft);
  const epoxyKitCoverageSqft = parse(inputs.epoxyKitCoverageSqft);
  const touchUpSpotCount = parse(inputs.touchUpSpotCount);
  const touchUpSpotWidthInches = parse(inputs.touchUpSpotWidthInches);
  const touchUpSpotHeightInches = parse(inputs.touchUpSpotHeightInches);
  const touchUpCoats = parse(inputs.touchUpCoats);
  const contrastFactor = parse(inputs.contrastFactor);
  const porousFactor = parse(inputs.porousFactor);
  const paintVolumeGallons = parse(inputs.paintVolumeGallons);
  const mixPartPaint = parse(inputs.mixPartPaint);
  const mixPartThinner = parse(inputs.mixPartThinner);
  const mixPartHardener = parse(inputs.mixPartHardener);

  const perimeterFeet = 2 * (roomLengthFeet + roomWidthFeet);
  const wallAreaSqft = perimeterFeet * wallHeightFeet;
  const openingsSqft = doorCount * doorAreaSqft + windowCount * windowAreaSqft;
  const netWallAreaSqft = Math.max(wallAreaSqft - openingsSqft, 0);
  const ceilingAreaSqft = roomLengthFeet * roomWidthFeet;
  const trimAreaSqft = trimLinearFeet * (trimWidthInches / 12);
  const deckAreaSqft = deckLengthFeet * deckWidthFeet;
  const cabinetDoorAreaSqft = (cabinetDoorCount * cabinetDoorHeightInches * cabinetDoorWidthInches) / 144;
  const drawerAreaSqft = (drawerCount * drawerHeightInches * drawerWidthInches) / 144;
  const cabinetPaintableAreaSqft = cabinetDoorAreaSqft * 2.1 + drawerAreaSqft * 1.6 + cabinetFrameAreaSqft;
  const touchUpAreaSqft = (touchUpSpotCount * touchUpSpotWidthInches * touchUpSpotHeightInches) / 144;

  if (variant === 'paint') {
    const gallons = coverageSqftPerGallon > 0 ? (netWallAreaSqft * coats) / coverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Wall Paint Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Openings Deducted', value: openingsSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'The estimate starts with full wall area, deducts doors and windows, and then applies your selected coat count.',
        'Coverage is kept explicit so premium paint, rough texture, or darker color changes can be evaluated honestly.',
        'Rounded gallons help with buying decisions, while the decimal value keeps budgeting and comparison work more precise.',
      ],
      warnings:
        netWallAreaSqft <= 0 || coverageSqftPerGallon <= 0
          ? ['Room dimensions and coverage per gallon must be above zero to estimate wall paint.']
          : [],
    };
  }

  if (variant === 'ceiling-paint') {
    const gallons = coverageSqftPerGallon > 0 ? (ceilingAreaSqft * coats) / coverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Ceiling Paint Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Ceiling Area', value: ceilingAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Coverage Rate', value: coverageSqftPerGallon, suffix: ' sq ft/gal', decimals: 0 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'Ceiling paint uses the plan-view room area rather than wall perimeter, which makes it easier to isolate ceiling material from the rest of the room.',
        'Keeping coat count visible matters because ceiling repaint work can vary between refresh coats and full coverage changes.',
        'Rounded gallons are shown so the result is immediately useful for store ordering.',
      ],
      warnings:
        ceilingAreaSqft <= 0 || coverageSqftPerGallon <= 0
          ? ['Room dimensions and coverage per gallon must be above zero to estimate ceiling paint.']
          : [],
    };
  }

  if (variant === 'primer') {
    const gallons = primerCoverageSqftPerGallon > 0 ? (netWallAreaSqft * coats) / primerCoverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Primer Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Primer Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Primer Coverage', value: primerCoverageSqftPerGallon, suffix: ' sq ft/gal', decimals: 0 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'Primer typically covers less area than finish paint, which is why the coverage assumption is separated here instead of reusing finish-paint numbers.',
        'This run is useful when bare drywall, strong color changes, repairs, or stain-blocking work need their own material estimate.',
        'Keeping primer separate from finish coats helps prevent under-ordering on prep-heavy jobs.',
      ],
      warnings:
        netWallAreaSqft <= 0 || primerCoverageSqftPerGallon <= 0
          ? ['Room dimensions and primer coverage must be above zero to estimate primer quantity.']
          : [],
    };
  }

  if (variant === 'wallpaper') {
    const adjustedArea = netWallAreaSqft * (1 + repeatWastePercent / 100);
    const rolls = rollCoverageSqft > 0 ? adjustedArea / rollCoverageSqft : 0;
    return {
      primaryLabel: 'Wallpaper Rolls Needed',
      primaryValue: ceil(rolls),
      primarySuffix: ' rolls',
      primaryDecimals: 0,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Pattern Waste', value: repeatWastePercent, suffix: '%', decimals: 1 },
        { label: 'Adjusted Area', value: adjustedArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Usable Roll Coverage', value: rollCoverageSqft, suffix: ' sq ft/roll', decimals: 1 },
      ],
      notes: [
        'Wallpaper planning uses wall area after deducting openings, then adds repeat and matching waste before converting to roll count.',
        'Pattern waste is separated because straight-match, drop-match, and patching risk can all change the final order.',
        'The rolled-up result is rounded to whole rolls so the output matches how wallpaper is actually bought.',
      ],
      warnings:
        netWallAreaSqft <= 0 || rollCoverageSqft <= 0
          ? ['Wall area and usable roll coverage must be above zero to estimate wallpaper quantity.']
          : [],
    };
  }

  if (variant === 'wall-area') {
    return {
      primaryLabel: 'Paintable Wall Area',
      primaryValue: netWallAreaSqft,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Gross Wall Area', value: wallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Doors Deducted', value: doorCount * doorAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Windows Deducted', value: windowCount * windowAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Room Perimeter', value: perimeterFeet, suffix: ' ft', decimals: 1 },
      ],
      notes: [
        'This result isolates the wall area available for paint, primer, wallpaper, or texture after openings are removed.',
        'Keeping gross area and deductions visible makes it easier to audit measuring mistakes before material is purchased.',
        'The result can be reused across multiple finish decisions without recalculating the room from scratch.',
      ],
      warnings:
        wallAreaSqft <= 0
          ? ['Room perimeter and wall height must be above zero to calculate wall area.']
          : [],
    };
  }

  if (variant === 'texture') {
    const bags = textureBagCoverageSqft > 0 ? (netWallAreaSqft * coats) / textureBagCoverageSqft : 0;
    return {
      primaryLabel: 'Texture Material Needed',
      primaryValue: bags,
      primarySuffix: ' bags',
      primaryDecimals: 2,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Texture Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Bag Coverage', value: textureBagCoverageSqft, suffix: ' sq ft/bag', decimals: 0 },
        { label: 'Rounded Bags', value: ceil(bags), suffix: ' bags', decimals: 0 },
      ],
      notes: [
        'Texture quantity is separated from paint because texture coverage and waste behave differently from finish coats.',
        'A heavier knockdown, orange peel, or repair blend can lower actual coverage compared with a smooth-surface assumption.',
        'Rounded bags make the result more useful for supply pickup and quote comparisons.',
      ],
      warnings:
        netWallAreaSqft <= 0 || textureBagCoverageSqft <= 0
          ? ['Wall area and bag coverage must be above zero to estimate texture material.']
          : [],
    };
  }

  if (variant === 'stain') {
    const projectArea = roomLengthFeet * roomWidthFeet;
    const gallons = stainCoverageSqftPerGallon > 0 ? (projectArea * coats) / stainCoverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Stain Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Surface Area', value: projectArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Coverage Rate', value: stainCoverageSqftPerGallon, suffix: ' sq ft/gal', decimals: 0 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'General stain planning works best when the surface area is estimated first and then converted with the actual product coverage rate.',
        'Keeping coat count visible matters because sealers, transparent stains, and solid-color products can behave very differently.',
        'The result is useful for fences, panels, millwork, and similar flat-surface staining jobs.',
      ],
      warnings:
        roomLengthFeet <= 0 || roomWidthFeet <= 0 || stainCoverageSqftPerGallon <= 0
          ? ['Surface dimensions and coverage per gallon must be above zero to estimate stain.']
          : [],
    };
  }

  if (variant === 'deck-stain') {
    const gallons = stainCoverageSqftPerGallon > 0 ? (deckAreaSqft * coats) / stainCoverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Deck Stain Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Deck Area', value: deckAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Coverage Rate', value: stainCoverageSqftPerGallon, suffix: ' sq ft/gal', decimals: 0 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'Deck stain estimates use the horizontal deck surface as the base planning area, which keeps the math simple and auditable.',
        'Actual material use can rise when boards are weathered, grooved, or highly absorbent, so coverage stays visible as an assumption.',
        'Rounded gallons help you convert the estimate into a practical store order quickly.',
      ],
      warnings:
        deckAreaSqft <= 0 || stainCoverageSqftPerGallon <= 0
          ? ['Deck dimensions and stain coverage must be above zero to estimate deck stain.']
          : [],
    };
  }

  if (variant === 'spray-paint-coverage') {
    const adjustedArea = netWallAreaSqft * coats * (1 + oversprayPercent / 100);
    const cans = sprayCanCoverageSqft > 0 ? adjustedArea / sprayCanCoverageSqft : 0;
    return {
      primaryLabel: 'Spray Cans Needed',
      primaryValue: ceil(cans),
      primarySuffix: ' cans',
      primaryDecimals: 0,
      metrics: [
        { label: 'Net Surface Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Overspray Allowance', value: oversprayPercent, suffix: '%', decimals: 1 },
        { label: 'Adjusted Spray Area', value: adjustedArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Coverage per Can', value: sprayCanCoverageSqft, suffix: ' sq ft/can', decimals: 0 },
      ],
      notes: [
        'Spray paint planning needs an overspray margin because aerosol and sprayed applications usually lose more material than brush-and-roll work.',
        'Coverage per can is kept explicit so different can sizes and product lines can be compared accurately.',
        'Rounded cans make the output immediately useful for a real purchase decision.',
      ],
      warnings:
        netWallAreaSqft <= 0 || sprayCanCoverageSqft <= 0
          ? ['Surface area and coverage per can must be above zero to estimate spray paint quantity.']
          : [],
    };
  }

  if (variant === 'paint-mixing-ratio') {
    const thinnerGallons = mixPartPaint > 0 ? (paintVolumeGallons * mixPartThinner) / mixPartPaint : 0;
    const hardenerGallons = mixPartPaint > 0 ? (paintVolumeGallons * mixPartHardener) / mixPartPaint : 0;
    const totalGallons = paintVolumeGallons + thinnerGallons + hardenerGallons;
    const totalParts = mixPartPaint + mixPartThinner + mixPartHardener;
    return {
      primaryLabel: 'Total Mixed Volume',
      primaryValue: totalGallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Paint Volume', value: paintVolumeGallons, suffix: ' gal', decimals: 2 },
        { label: 'Thinner Needed', value: thinnerGallons, suffix: ' gal', decimals: 2 },
        { label: 'Hardener Needed', value: hardenerGallons, suffix: ' gal', decimals: 2 },
        { label: 'Total Parts', value: totalParts, suffix: ' parts', decimals: 0 },
      ],
      notes: [
        'This run treats the paint amount as the anchor volume and then scales thinner and hardener from the ratio parts you entered.',
        'Keeping each component visible helps with batch planning, especially when you are mixing less than a full kit or scaling down for touch-up work.',
        'The total mixed volume makes it easier to compare the batch against spray-gun cups, rollers, or tray capacity.',
      ],
      warnings:
        paintVolumeGallons <= 0 || mixPartPaint <= 0 || totalParts <= 0
          ? ['Paint volume and ratio parts must be above zero to calculate a mixing ratio.']
          : [],
    };
  }

  if (variant === 'number-of-coats') {
    const recommendedCoats = Math.max(1, Math.min(4, 1 + Math.round(contrastFactor + porousFactor)));
    const gallons = coverageSqftPerGallon > 0 ? (netWallAreaSqft * recommendedCoats) / coverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Recommended Coats',
      primaryValue: recommendedCoats,
      primarySuffix: ' coats',
      primaryDecimals: 0,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Color-Change Factor', value: contrastFactor, suffix: ' pts', decimals: 0 },
        { label: 'Porosity Factor', value: porousFactor, suffix: ' pts', decimals: 0 },
        { label: 'Estimated Paint at Recommendation', value: gallons, suffix: ' gal', decimals: 2 },
      ],
      notes: [
        'This calculator turns contrast and surface absorbency into a practical coat recommendation rather than assuming every project needs the same number of coats.',
        'The resulting gallon estimate helps connect the recommendation to a material order right away.',
        'It is still a planning tool, so product-specific hide characteristics and site conditions should be considered before final purchase.',
      ],
      warnings:
        netWallAreaSqft <= 0 || coverageSqftPerGallon <= 0
          ? ['Wall area and coverage per gallon must be above zero to estimate recommended coats.']
          : [],
    };
  }

  if (variant === 'trim-paint') {
    const gallons = coverageSqftPerGallon > 0 ? (trimAreaSqft * coats) / coverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Trim Paint Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Trim Linear Feet', value: trimLinearFeet, suffix: ' ft', decimals: 1 },
        { label: 'Trim Width', value: trimWidthInches, suffix: ' in', decimals: 1 },
        { label: 'Approximate Trim Area', value: trimAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'Trim paint is estimated from linear footage and average trim width so moulding and baseboard work can be separated from wall paint.',
        'This makes it easier to budget enamel or trim-specific paints without blending them into the wall-paint order.',
        'Rounded gallons help when deciding between quarts and gallons for a trim package.',
      ],
      warnings:
        trimAreaSqft <= 0 || coverageSqftPerGallon <= 0
          ? ['Trim dimensions and coverage per gallon must be above zero to estimate trim paint.']
          : [],
    };
  }

  if (variant === 'cabinet-paint') {
    const gallons = coverageSqftPerGallon > 0 ? (cabinetPaintableAreaSqft * coats) / coverageSqftPerGallon : 0;
    return {
      primaryLabel: 'Cabinet Paint Needed',
      primaryValue: gallons,
      primarySuffix: ' gal',
      primaryDecimals: 2,
      metrics: [
        { label: 'Door Area', value: cabinetDoorAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Drawer Area', value: drawerAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Frame and Box Faces', value: cabinetFrameAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Rounded Gallons', value: ceil(gallons), suffix: ' gal', decimals: 0 },
      ],
      notes: [
        'Cabinet painting is treated differently from wall painting because both sides of many doors, drawer fronts, and exposed frames have to be accounted for.',
        'The paintable area multiplier helps make the estimate more realistic than a simple face-only calculation.',
        'Rounded gallons are shown for ordering, while the decimal value helps budget specialty cabinet coatings more precisely.',
      ],
      warnings:
        cabinetPaintableAreaSqft <= 0 || coverageSqftPerGallon <= 0
          ? ['Cabinet dimensions and coverage per gallon must be above zero to estimate cabinet paint.']
          : [],
    };
  }

  if (variant === 'epoxy-coverage') {
    const projectArea = roomLengthFeet * roomWidthFeet;
    const kits = epoxyKitCoverageSqft > 0 ? (projectArea * coats) / epoxyKitCoverageSqft : 0;
    return {
      primaryLabel: 'Epoxy Kits Needed',
      primaryValue: kits,
      primarySuffix: ' kits',
      primaryDecimals: 2,
      metrics: [
        { label: 'Floor Area', value: projectArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Coats', value: coats, suffix: ' coats', decimals: 0 },
        { label: 'Coverage per Kit', value: epoxyKitCoverageSqft, suffix: ' sq ft/kit', decimals: 0 },
        { label: 'Rounded Kits', value: ceil(kits), suffix: ' kits', decimals: 0 },
      ],
      notes: [
        'Epoxy planning is kept separate because kit coverage, film build, and loss assumptions behave differently from standard wall paint.',
        'Coverage per kit is visible so clear and pigmented systems can be compared without hiding the product assumption.',
        'Rounded kits make the result easier to use when comparing packaged floor-coating systems.',
      ],
      warnings:
        roomLengthFeet <= 0 || roomWidthFeet <= 0 || epoxyKitCoverageSqft <= 0
          ? ['Floor dimensions and kit coverage must be above zero to estimate epoxy coverage.']
          : [],
    };
  }

  const gallons = coverageSqftPerGallon > 0 ? (touchUpAreaSqft * touchUpCoats) / coverageSqftPerGallon : 0;
  return {
    primaryLabel: 'Touch-Up Paint Needed',
    primaryValue: gallons * 4,
    primarySuffix: ' qt',
    primaryDecimals: 2,
    metrics: [
      { label: 'Total Patch Area', value: touchUpAreaSqft, suffix: ' sq ft', decimals: 2 },
      { label: 'Touch-Up Coats', value: touchUpCoats, suffix: ' coats', decimals: 0 },
      { label: 'Equivalent Gallons', value: gallons, suffix: ' gal', decimals: 3 },
      { label: 'Spots Counted', value: touchUpSpotCount, suffix: ' spots', decimals: 0 },
    ],
    notes: [
      'Touch-up planning is usually small enough that quarts are more useful than full gallons, which is why the main result is shown in quart equivalents.',
      'The estimate treats each repair spot as its own patch area and then applies the selected touch-up coat count.',
      'Keeping the equivalent gallons visible helps if the product is only sold in gallon units.',
    ],
    warnings:
      touchUpAreaSqft <= 0 || coverageSqftPerGallon <= 0
        ? ['Patch dimensions, spot count, and coverage per gallon must be above zero to estimate touch-up paint.']
        : [],
  };
}
