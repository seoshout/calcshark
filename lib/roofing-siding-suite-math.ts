import type { RoofingSidingVariant } from '@/lib/roofing-siding-suite-config';

export interface Inputs {
  houseLengthFeet: string;
  houseWidthFeet: string;
  roofPitchRise: string;
  roofPitchRun: string;
  wastePercent: string;
  shingleCoverageSqftPerBundle: string;
  metalPanelCoverageWidthInches: string;
  panelLengthFeet: string;
  ridgeLengthFeet: string;
  ridgeCapCoverageLinearFeet: string;
  atticFloorAreaSqft: string;
  ventilationRatioDenominator: string;
  ridgeVentNfaSqInPerLinearFoot: string;
  gutterRunFeet: string;
  gutterSectionLengthFeet: string;
  downspoutDrainageSqft: string;
  fasciaLengthFeet: string;
  fasciaPieceLengthFeet: string;
  soffitWidthFeet: string;
  wallHeightFeet: string;
  storyCount: string;
  openingAreaSqft: string;
  sidingPanelCoverageSqft: string;
  boardWidthInches: string;
  battenWidthInches: string;
  boardGapInches: string;
  wrapRollCoverageSqft: string;
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
const radToDeg = (radians: number) => (radians * 180) / Math.PI;

const BASE_INPUTS: Inputs = {
  houseLengthFeet: '40',
  houseWidthFeet: '28',
  roofPitchRise: '6',
  roofPitchRun: '12',
  wastePercent: '10',
  shingleCoverageSqftPerBundle: '33.3',
  metalPanelCoverageWidthInches: '36',
  panelLengthFeet: '16',
  ridgeLengthFeet: '40',
  ridgeCapCoverageLinearFeet: '20',
  atticFloorAreaSqft: '1120',
  ventilationRatioDenominator: '150',
  ridgeVentNfaSqInPerLinearFoot: '18',
  gutterRunFeet: '80',
  gutterSectionLengthFeet: '10',
  downspoutDrainageSqft: '600',
  fasciaLengthFeet: '80',
  fasciaPieceLengthFeet: '12',
  soffitWidthFeet: '1.5',
  wallHeightFeet: '9',
  storyCount: '1',
  openingAreaSqft: '180',
  sidingPanelCoverageSqft: '100',
  boardWidthInches: '10',
  battenWidthInches: '2.5',
  boardGapInches: '0.5',
  wrapRollCoverageSqft: '900',
};

export const DEFAULT_INPUTS: Record<RoofingSidingVariant, Inputs> = {
  'roof-area': { ...BASE_INPUTS },
  shingle: { ...BASE_INPUTS },
  'metal-roofing': { ...BASE_INPUTS, wastePercent: '7' },
  'roof-pitch': { ...BASE_INPUTS },
  'rafter-length': { ...BASE_INPUTS },
  'ridge-cap': { ...BASE_INPUTS },
  'roof-ventilation': { ...BASE_INPUTS },
  gutter: { ...BASE_INPUTS },
  downspout: { ...BASE_INPUTS },
  fascia: { ...BASE_INPUTS },
  soffit: { ...BASE_INPUTS },
  siding: { ...BASE_INPUTS, wastePercent: '10' },
  'vinyl-siding': { ...BASE_INPUTS, wastePercent: '12' },
  'board-and-batten': { ...BASE_INPUTS, wastePercent: '12' },
  'house-wrap': { ...BASE_INPUTS, wastePercent: '10' },
};

export function buildRoofingSidingResult(variant: RoofingSidingVariant, inputs: Inputs): Result {
  const houseLengthFeet = parse(inputs.houseLengthFeet);
  const houseWidthFeet = parse(inputs.houseWidthFeet);
  const roofPitchRise = parse(inputs.roofPitchRise);
  const roofPitchRun = parse(inputs.roofPitchRun);
  const wastePercent = parse(inputs.wastePercent);
  const shingleCoverageSqftPerBundle = parse(inputs.shingleCoverageSqftPerBundle);
  const metalPanelCoverageWidthInches = parse(inputs.metalPanelCoverageWidthInches);
  const panelLengthFeet = parse(inputs.panelLengthFeet);
  const ridgeLengthFeet = parse(inputs.ridgeLengthFeet);
  const ridgeCapCoverageLinearFeet = parse(inputs.ridgeCapCoverageLinearFeet);
  const atticFloorAreaSqft = parse(inputs.atticFloorAreaSqft);
  const ventilationRatioDenominator = parse(inputs.ventilationRatioDenominator);
  const ridgeVentNfaSqInPerLinearFoot = parse(inputs.ridgeVentNfaSqInPerLinearFoot);
  const gutterRunFeet = parse(inputs.gutterRunFeet);
  const gutterSectionLengthFeet = parse(inputs.gutterSectionLengthFeet);
  const downspoutDrainageSqft = parse(inputs.downspoutDrainageSqft);
  const fasciaLengthFeet = parse(inputs.fasciaLengthFeet);
  const fasciaPieceLengthFeet = parse(inputs.fasciaPieceLengthFeet);
  const soffitWidthFeet = parse(inputs.soffitWidthFeet);
  const wallHeightFeet = parse(inputs.wallHeightFeet);
  const storyCount = parse(inputs.storyCount);
  const openingAreaSqft = parse(inputs.openingAreaSqft);
  const sidingPanelCoverageSqft = parse(inputs.sidingPanelCoverageSqft);
  const boardWidthInches = parse(inputs.boardWidthInches);
  const battenWidthInches = parse(inputs.battenWidthInches);
  const boardGapInches = parse(inputs.boardGapInches);
  const wrapRollCoverageSqft = parse(inputs.wrapRollCoverageSqft);

  const pitchMultiplier =
    roofPitchRun > 0 ? Math.sqrt(roofPitchRise * roofPitchRise + roofPitchRun * roofPitchRun) / roofPitchRun : 0;
  const pitchAngle = roofPitchRun > 0 ? radToDeg(Math.atan(roofPitchRise / roofPitchRun)) : 0;
  const roofFootprintAreaSqft = houseLengthFeet * houseWidthFeet;
  const roofAreaSqft = roofFootprintAreaSqft * pitchMultiplier;
  const adjustedRoofAreaSqft = roofAreaSqft * (1 + wastePercent / 100);
  const roofSquares = roofAreaSqft / 100;
  const halfSpanFeet = houseWidthFeet / 2;
  const rafterLengthFeet = halfSpanFeet * pitchMultiplier;
  const perimeterFeet = 2 * (houseLengthFeet + houseWidthFeet);
  const grossWallAreaSqft = perimeterFeet * wallHeightFeet * storyCount;
  const netWallAreaSqft = Math.max(grossWallAreaSqft - openingAreaSqft, 0);
  const adjustedWallAreaSqft = netWallAreaSqft * (1 + wastePercent / 100);

  if (variant === 'roof-area') {
    return {
      primaryLabel: 'Roof Area',
      primaryValue: roofAreaSqft,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Roof Squares', value: roofSquares, suffix: ' squares', decimals: 2 },
        { label: 'Footprint Area', value: roofFootprintAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Pitch Multiplier', value: pitchMultiplier, suffix: 'x', decimals: 3 },
        { label: 'Waste-Adjusted Area', value: adjustedRoofAreaSqft, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'The roof area estimate starts from the building footprint and then applies a slope multiplier so the sloped surface is reflected correctly.',
        'Squares are shown because many roofing material orders and contractor quotes are still framed in 100-square-foot units.',
        'Keeping the waste-adjusted area visible helps separate raw geometry from the order quantity you may actually purchase.',
      ],
      warnings:
        roofFootprintAreaSqft <= 0 || pitchMultiplier <= 0
          ? ['House dimensions and roof pitch must be above zero to calculate roof area.']
          : [],
    };
  }

  if (variant === 'shingle') {
    const bundles = shingleCoverageSqftPerBundle > 0 ? adjustedRoofAreaSqft / shingleCoverageSqftPerBundle : 0;
    return {
      primaryLabel: 'Shingle Bundles Needed',
      primaryValue: ceil(bundles),
      primarySuffix: ' bundles',
      primaryDecimals: 0,
      metrics: [
        { label: 'Roof Area', value: roofAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste-Adjusted Area', value: adjustedRoofAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Coverage per Bundle', value: shingleCoverageSqftPerBundle, suffix: ' sq ft', decimals: 1 },
        { label: 'Roof Squares', value: adjustedRoofAreaSqft / 100, suffix: ' squares', decimals: 2 },
      ],
      notes: [
        'Bundle count is driven by the roof surface area after the slope multiplier and waste allowance are both applied.',
        'This keeps the estimate closer to how shingle orders are actually placed for cut loss, starter work, and trim details.',
        'Rounded bundles make the result directly useful for store pickup or distributor ordering.',
      ],
      warnings:
        adjustedRoofAreaSqft <= 0 || shingleCoverageSqftPerBundle <= 0
          ? ['Roof area and bundle coverage must be above zero to estimate shingles.']
          : [],
    };
  }

  if (variant === 'metal-roofing') {
    const panelAreaSqft = (metalPanelCoverageWidthInches / 12) * panelLengthFeet;
    const panels = panelAreaSqft > 0 ? adjustedRoofAreaSqft / panelAreaSqft : 0;
    return {
      primaryLabel: 'Metal Panels Needed',
      primaryValue: ceil(panels),
      primarySuffix: ' panels',
      primaryDecimals: 0,
      metrics: [
        { label: 'Roof Area', value: roofAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste-Adjusted Area', value: adjustedRoofAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Panel Coverage Area', value: panelAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Pitch Multiplier', value: pitchMultiplier, suffix: 'x', decimals: 3 },
      ],
      notes: [
        'The panel count uses covered panel width instead of raw metal width so the result stays closer to real installed coverage.',
        'Waste is separated because metal layouts still lose material around ridge details, cut edges, and penetrations.',
        'Panel count is best treated as a planning estimate before trim packages, laps, and manufacturer details are finalized.',
      ],
      warnings:
        adjustedRoofAreaSqft <= 0 || panelAreaSqft <= 0
          ? ['Roof area, panel width, and panel length must be above zero to estimate metal roofing.']
          : [],
    };
  }

  if (variant === 'roof-pitch') {
    return {
      primaryLabel: 'Roof Pitch',
      primaryValue: roofPitchRise,
      primarySuffix: ` / ${roofPitchRun}`,
      primaryDecimals: 0,
      metrics: [
        { label: 'Pitch Multiplier', value: pitchMultiplier, suffix: 'x', decimals: 3 },
        { label: 'Pitch Angle', value: pitchAngle, suffix: ' deg', decimals: 1 },
        { label: 'Rise', value: roofPitchRise, suffix: ' in', decimals: 1 },
        { label: 'Run', value: roofPitchRun, suffix: ' in', decimals: 1 },
      ],
      notes: [
        'Roof pitch is shown in rise-over-run form because that remains the common jobsite shorthand for framing and roofing work.',
        'The pitch multiplier is included because it connects roof slope directly to surface-area takeoffs.',
        'Pitch angle adds another interpretation layer when comparing product minimums or discussing roof steepness.',
      ],
      warnings:
        roofPitchRun <= 0
          ? ['Roof run must be above zero to calculate pitch and angle.']
          : [],
    };
  }

  if (variant === 'rafter-length') {
    return {
      primaryLabel: 'Rafter Length',
      primaryValue: rafterLengthFeet,
      primarySuffix: ' ft',
      primaryDecimals: 2,
      metrics: [
        { label: 'Half Span', value: halfSpanFeet, suffix: ' ft', decimals: 2 },
        { label: 'Pitch Multiplier', value: pitchMultiplier, suffix: 'x', decimals: 3 },
        { label: 'Pitch Angle', value: pitchAngle, suffix: ' deg', decimals: 1 },
        { label: 'Approximate Roof Area', value: roofAreaSqft, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'Rafter length is estimated from half span and roof pitch, which is the core geometry behind a simple gable-style run.',
        'This helps connect framing dimensions to the same pitch assumptions used in roofing takeoffs.',
        'The result is most useful as a planning length before overhang, birdsmouth, and structural design details are added.',
      ],
      warnings:
        halfSpanFeet <= 0 || pitchMultiplier <= 0
          ? ['House span and roof pitch must be above zero to estimate rafter length.']
          : [],
    };
  }

  if (variant === 'ridge-cap') {
    const adjustedRidgeLength = ridgeLengthFeet * (1 + wastePercent / 100);
    const bundles = ridgeCapCoverageLinearFeet > 0 ? adjustedRidgeLength / ridgeCapCoverageLinearFeet : 0;
    return {
      primaryLabel: 'Ridge Cap Bundles Needed',
      primaryValue: ceil(bundles),
      primarySuffix: ' bundles',
      primaryDecimals: 0,
      metrics: [
        { label: 'Ridge Length', value: ridgeLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Waste-Adjusted Ridge', value: adjustedRidgeLength, suffix: ' ft', decimals: 1 },
        { label: 'Coverage per Bundle', value: ridgeCapCoverageLinearFeet, suffix: ' lf', decimals: 1 },
        { label: 'Roof Squares', value: roofSquares, suffix: ' squares', decimals: 2 },
      ],
      notes: [
        'Ridge cap planning uses linear ridge footage rather than roof area because the accessory is ordered off the ridge line itself.',
        'Waste is kept separate because cuts, hips, and detail work can increase the final bundle need.',
        'This estimate is especially useful when the main shingle order and the cap order are purchased separately.',
      ],
      warnings:
        ridgeLengthFeet <= 0 || ridgeCapCoverageLinearFeet <= 0
          ? ['Ridge length and bundle coverage must be above zero to estimate ridge cap quantity.']
          : [],
    };
  }

  if (variant === 'roof-ventilation') {
    const totalRequiredNfaSqIn =
      ventilationRatioDenominator > 0 ? (atticFloorAreaSqft * 144) / ventilationRatioDenominator : 0;
    const exhaustNfaSqIn = totalRequiredNfaSqIn / 2;
    const ridgeVentLengthFeet = ridgeVentNfaSqInPerLinearFoot > 0 ? exhaustNfaSqIn / ridgeVentNfaSqInPerLinearFoot : 0;
    return {
      primaryLabel: 'Required Ridge Vent Length',
      primaryValue: ridgeVentLengthFeet,
      primarySuffix: ' ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Attic Floor Area', value: atticFloorAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Total Required NFA', value: totalRequiredNfaSqIn, suffix: ' sq in', decimals: 1 },
        { label: 'Exhaust NFA Target', value: exhaustNfaSqIn, suffix: ' sq in', decimals: 1 },
        { label: 'Ridge Vent Capacity', value: ridgeVentNfaSqInPerLinearFoot, suffix: ' sq in/ft', decimals: 1 },
      ],
      notes: [
        'The ventilation estimate starts from attic floor area, converts that to total required net free area, and then splits the target between intake and exhaust.',
        'Showing the exhaust target separately makes it easier to size ridge vent footage while still respecting a balanced system concept.',
        'This is a planning tool, so local code and manufacturer ventilation rules should be confirmed before final installation.',
      ],
      warnings:
        atticFloorAreaSqft <= 0 || ventilationRatioDenominator <= 0 || ridgeVentNfaSqInPerLinearFoot <= 0
          ? ['Attic area, ventilation ratio, and ridge vent capacity must be above zero to estimate roof ventilation.']
          : [],
    };
  }

  if (variant === 'gutter') {
    const sections = gutterSectionLengthFeet > 0 ? gutterRunFeet / gutterSectionLengthFeet : 0;
    return {
      primaryLabel: 'Gutter Sections Needed',
      primaryValue: ceil(sections),
      primarySuffix: ' sections',
      primaryDecimals: 0,
      metrics: [
        { label: 'Total Gutter Run', value: gutterRunFeet, suffix: ' ft', decimals: 1 },
        { label: 'Section Length', value: gutterSectionLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Rounded Sections', value: ceil(sections), suffix: ' sections', decimals: 0 },
        { label: 'Approximate Downspouts', value: ceil(roofAreaSqft / Math.max(downspoutDrainageSqft, 1)), suffix: ' spouts', decimals: 0 },
      ],
      notes: [
        'Gutter quantity is usually driven by total eave run and the section length being purchased or fabricated.',
        'Keeping section length explicit makes it easier to compare stock 10-foot sections against seamless planning assumptions.',
        'The downspout companion metric helps tie the gutter takeoff back to the roof drainage area it serves.',
      ],
      warnings:
        gutterRunFeet <= 0 || gutterSectionLengthFeet <= 0
          ? ['Gutter run and section length must be above zero to estimate gutter quantity.']
          : [],
    };
  }

  if (variant === 'downspout') {
    const spouts = downspoutDrainageSqft > 0 ? roofAreaSqft / downspoutDrainageSqft : 0;
    return {
      primaryLabel: 'Downspouts Needed',
      primaryValue: ceil(spouts),
      primarySuffix: ' downspouts',
      primaryDecimals: 0,
      metrics: [
        { label: 'Roof Drainage Area', value: roofAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Drainage Capacity per Spout', value: downspoutDrainageSqft, suffix: ' sq ft', decimals: 0 },
        { label: 'Rounded Downspouts', value: ceil(spouts), suffix: ' spouts', decimals: 0 },
        { label: 'Gutter Run', value: gutterRunFeet, suffix: ' ft', decimals: 1 },
      ],
      notes: [
        'The downspout estimate compares total roof drainage area against a simplified drainage area per downspout assumption.',
        'This keeps the result connected to the roof size rather than only to gutter length.',
        'Real projects should still account for rainfall intensity, gutter size, and local practice before final layout is set.',
      ],
      warnings:
        roofAreaSqft <= 0 || downspoutDrainageSqft <= 0
          ? ['Roof area and drainage capacity per downspout must be above zero to estimate downspouts.']
          : [],
    };
  }

  if (variant === 'fascia') {
    const pieces = fasciaPieceLengthFeet > 0 ? fasciaLengthFeet / fasciaPieceLengthFeet : 0;
    return {
      primaryLabel: 'Fascia Pieces Needed',
      primaryValue: ceil(pieces),
      primarySuffix: ' pieces',
      primaryDecimals: 0,
      metrics: [
        { label: 'Fascia Length', value: fasciaLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Piece Length', value: fasciaPieceLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Rounded Pieces', value: ceil(pieces), suffix: ' pieces', decimals: 0 },
        { label: 'Related Gutter Run', value: gutterRunFeet, suffix: ' ft', decimals: 1 },
      ],
      notes: [
        'Fascia quantity is driven by the linear edge length that needs trim or board coverage rather than by roof area.',
        'Showing the related gutter run helps align fascia planning with adjacent roof-edge components.',
        'Rounded pieces make the estimate easier to compare with stock trim lengths or board purchases.',
      ],
      warnings:
        fasciaLengthFeet <= 0 || fasciaPieceLengthFeet <= 0
          ? ['Fascia length and piece length must be above zero to estimate fascia quantity.']
          : [],
    };
  }

  if (variant === 'soffit') {
    const soffitAreaSqft = fasciaLengthFeet * soffitWidthFeet;
    return {
      primaryLabel: 'Soffit Area',
      primaryValue: soffitAreaSqft,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Soffit Run', value: fasciaLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Average Soffit Width', value: soffitWidthFeet, suffix: ' ft', decimals: 2 },
        { label: 'Rounded Panels at 12 sq ft', value: ceil(soffitAreaSqft / 12), suffix: ' panels', decimals: 0 },
        { label: 'Ventilation Companion Run', value: ridgeLengthFeet, suffix: ' ft', decimals: 1 },
      ],
      notes: [
        'Soffit quantity uses the linear run and average soffit width because the underside of the eave is an area-based finish, not a simple linear trim item.',
        'Keeping the area visible makes it easier to compare vented and solid soffit products by panel coverage.',
        'This estimate also supports balanced ventilation planning when soffit intake is part of the roof system design.',
      ],
      warnings:
        fasciaLengthFeet <= 0 || soffitWidthFeet <= 0
          ? ['Soffit run and width must be above zero to estimate soffit area.']
          : [],
    };
  }

  if (variant === 'siding' || variant === 'vinyl-siding') {
    const panels = sidingPanelCoverageSqft > 0 ? adjustedWallAreaSqft / sidingPanelCoverageSqft : 0;
    return {
      primaryLabel: variant === 'vinyl-siding' ? 'Vinyl Siding Panels Needed' : 'Siding Panels Needed',
      primaryValue: ceil(panels),
      primarySuffix: ' panels',
      primaryDecimals: 0,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste-Adjusted Area', value: adjustedWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Siding Squares', value: adjustedWallAreaSqft / 100, suffix: ' squares', decimals: 2 },
        { label: 'Panel Coverage', value: sidingPanelCoverageSqft, suffix: ' sq ft/panel', decimals: 1 },
      ],
      notes: [
        'Siding planning starts with gross wall area, deducts major openings, and then applies waste so the order aligns better with real cut loss.',
        'Squares are shown because siding takeoffs are often compared in the same 100-square-foot language used in many contractor estimates.',
        'Panel count makes the result easier to translate into supplier packaging and quote comparisons.',
      ],
      warnings:
        adjustedWallAreaSqft <= 0 || sidingPanelCoverageSqft <= 0
          ? ['Wall area and panel coverage must be above zero to estimate siding quantity.']
          : [],
    };
  }

  if (variant === 'board-and-batten') {
    const moduleWidthFeet = (boardWidthInches + boardGapInches) / 12;
    const boardRuns = moduleWidthFeet > 0 ? perimeterFeet / moduleWidthFeet : 0;
    const battens = boardRuns;
    const boardFaceArea = boardRuns * (boardWidthInches / 12) * wallHeightFeet * storyCount;
    return {
      primaryLabel: 'Battens Needed',
      primaryValue: ceil(battens),
      primarySuffix: ' battens',
      primaryDecimals: 0,
      metrics: [
        { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Board Runs', value: ceil(boardRuns), suffix: ' boards', decimals: 0 },
        { label: 'Approximate Board Face Area', value: boardFaceArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Batten Width', value: battenWidthInches, suffix: ' in', decimals: 1 },
      ],
      notes: [
        'Board-and-batten planning uses a repeating module so the spacing pattern is reflected instead of treating the wall as a generic siding field.',
        'This makes board count and batten count easier to estimate together in one run.',
        'The result is a planning takeoff, so starter trims, corners, and specific layout preferences should still be reviewed separately.',
      ],
      warnings:
        perimeterFeet <= 0 || wallHeightFeet <= 0 || moduleWidthFeet <= 0
          ? ['Wall dimensions and board module width must be above zero to estimate board-and-batten materials.']
          : [],
    };
  }

  const rolls = wrapRollCoverageSqft > 0 ? adjustedWallAreaSqft / wrapRollCoverageSqft : 0;
  return {
    primaryLabel: 'House Wrap Rolls Needed',
    primaryValue: ceil(rolls),
    primarySuffix: ' rolls',
    primaryDecimals: 0,
    metrics: [
      { label: 'Net Wall Area', value: netWallAreaSqft, suffix: ' sq ft', decimals: 1 },
      { label: 'Waste-Adjusted Area', value: adjustedWallAreaSqft, suffix: ' sq ft', decimals: 1 },
      { label: 'Roll Coverage', value: wrapRollCoverageSqft, suffix: ' sq ft/roll', decimals: 0 },
      { label: 'Stories Counted', value: storyCount, suffix: ' stories', decimals: 0 },
    ],
    notes: [
      'House wrap is estimated from net exterior wall area rather than from roof footprint or floor area, because the wrap follows the building envelope.',
      'Waste is kept visible so overlaps, openings, and site handling do not get buried inside the base wall area.',
      'Rounded rolls make the result easier to use for supplier orders and jobsite delivery planning.',
    ],
    warnings:
      adjustedWallAreaSqft <= 0 || wrapRollCoverageSqft <= 0
        ? ['Wall area and roll coverage must be above zero to estimate house wrap quantity.']
        : [],
  };
}
