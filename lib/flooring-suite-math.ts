import type { FlooringVariant } from '@/lib/flooring-suite-config';

export interface Inputs {
  roomLengthFeet: string;
  roomWidthFeet: string;
  wastePercent: string;
  coveragePerCartonSqft: string;
  tileLengthInches: string;
  tileWidthInches: string;
  tileThicknessInches: string;
  groutJointInches: string;
  groutDepthInches: string;
  groutBagYieldCubicInches: string;
  thinsetBagCoverageSqft: string;
  rollWidthFeet: string;
  openingAllowanceFeet: string;
  pieceLengthFeet: string;
  joistSpacingInches: string;
  selfLevelCoverageSqftAtEighth: string;
  pourDepthInches: string;
  heatedCoveragePercent: string;
  wattsPerSqft: string;
  dailyUsageHours: string;
  electricityRatePerKwh: string;
  subfloorSheetLengthFeet: string;
  subfloorSheetWidthFeet: string;
  underlaymentRollCoverageSqft: string;
  transitionLengthFeet: string;
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
  roomLengthFeet: '12',
  roomWidthFeet: '10',
  wastePercent: '10',
  coveragePerCartonSqft: '22',
  tileLengthInches: '12',
  tileWidthInches: '24',
  tileThicknessInches: '0.375',
  groutJointInches: '0.125',
  groutDepthInches: '0.25',
  groutBagYieldCubicInches: '120',
  thinsetBagCoverageSqft: '60',
  rollWidthFeet: '12',
  openingAllowanceFeet: '3',
  pieceLengthFeet: '8',
  joistSpacingInches: '16',
  selfLevelCoverageSqftAtEighth: '50',
  pourDepthInches: '0.25',
  heatedCoveragePercent: '85',
  wattsPerSqft: '12',
  dailyUsageHours: '4',
  electricityRatePerKwh: '0.16',
  subfloorSheetLengthFeet: '8',
  subfloorSheetWidthFeet: '4',
  underlaymentRollCoverageSqft: '100',
  transitionLengthFeet: '18',
};

export const DEFAULT_INPUTS: Record<FlooringVariant, Inputs> = {
  baseboard: { ...BASE_INPUTS },
  carpet: { ...BASE_INPUTS },
  'floor-heating': { ...BASE_INPUTS },
  'floor-joist': { ...BASE_INPUTS },
  'floor-leveling': { ...BASE_INPUTS },
  flooring: { ...BASE_INPUTS },
  grout: { ...BASE_INPUTS },
  hardwood: { ...BASE_INPUTS },
  laminate: { ...BASE_INPUTS },
  subfloor: { ...BASE_INPUTS },
  thinset: { ...BASE_INPUTS },
  tile: { ...BASE_INPUTS },
  'transition-strip': { ...BASE_INPUTS },
  underlayment: { ...BASE_INPUTS },
  vinyl: { ...BASE_INPUTS },
};

export function buildFlooringResult(variant: FlooringVariant, inputs: Inputs): Result {
  const roomLengthFeet = parse(inputs.roomLengthFeet);
  const roomWidthFeet = parse(inputs.roomWidthFeet);
  const wastePercent = parse(inputs.wastePercent);
  const coveragePerCartonSqft = parse(inputs.coveragePerCartonSqft);
  const tileLengthInches = parse(inputs.tileLengthInches);
  const tileWidthInches = parse(inputs.tileWidthInches);
  const groutJointInches = parse(inputs.groutJointInches);
  const groutDepthInches = parse(inputs.groutDepthInches);
  const groutBagYieldCubicInches = parse(inputs.groutBagYieldCubicInches);
  const thinsetBagCoverageSqft = parse(inputs.thinsetBagCoverageSqft);
  const rollWidthFeet = parse(inputs.rollWidthFeet);
  const openingAllowanceFeet = parse(inputs.openingAllowanceFeet);
  const pieceLengthFeet = parse(inputs.pieceLengthFeet);
  const joistSpacingInches = parse(inputs.joistSpacingInches);
  const selfLevelCoverageSqftAtEighth = parse(inputs.selfLevelCoverageSqftAtEighth);
  const pourDepthInches = parse(inputs.pourDepthInches);
  const heatedCoveragePercent = parse(inputs.heatedCoveragePercent);
  const wattsPerSqft = parse(inputs.wattsPerSqft);
  const dailyUsageHours = parse(inputs.dailyUsageHours);
  const electricityRatePerKwh = parse(inputs.electricityRatePerKwh);
  const subfloorSheetLengthFeet = parse(inputs.subfloorSheetLengthFeet);
  const subfloorSheetWidthFeet = parse(inputs.subfloorSheetWidthFeet);
  const underlaymentRollCoverageSqft = parse(inputs.underlaymentRollCoverageSqft);
  const transitionLengthFeet = parse(inputs.transitionLengthFeet);

  const areaSqft = roomLengthFeet * roomWidthFeet;
  const totalWithWasteSqft = areaSqft * (1 + wastePercent / 100);
  const perimeterFeet = (roomLengthFeet + roomWidthFeet) * 2;

  if (variant === 'flooring' || variant === 'hardwood' || variant === 'laminate' || variant === 'vinyl') {
    const cartons = coveragePerCartonSqft > 0 ? totalWithWasteSqft / coveragePerCartonSqft : 0;
    const extraSqft = totalWithWasteSqft - areaSqft;
    return {
      primaryLabel: 'Total Flooring Needed',
      primaryValue: totalWithWasteSqft,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Room Area', value: areaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste Allowance', value: extraSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Cartons Needed', value: ceil(cartons), suffix: ' cartons', decimals: 0 },
        { label: 'Carton Coverage Used', value: coveragePerCartonSqft, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'This run separates usable room area from purchase area so trim loss, cuts, and pattern waste stay visible.',
        'Carton count is rounded up because flooring is usually purchased in whole boxes rather than by exact square foot.',
        'The waste allowance becomes especially important when plank direction, diagonal layouts, or irregular cuts increase offcuts.',
      ],
      warnings:
        areaSqft <= 0 || coveragePerCartonSqft <= 0
          ? ['Room dimensions and carton coverage must be above zero to estimate flooring quantities.']
          : [],
    };
  }

  if (variant === 'tile') {
    const tileAreaSqft = (tileLengthInches * tileWidthInches) / 144;
    const tileCount = tileAreaSqft > 0 ? totalWithWasteSqft / tileAreaSqft : 0;
    const cartons = coveragePerCartonSqft > 0 ? totalWithWasteSqft / coveragePerCartonSqft : 0;
    return {
      primaryLabel: 'Estimated Tile Count',
      primaryValue: ceil(tileCount),
      primarySuffix: ' tiles',
      primaryDecimals: 0,
      metrics: [
        { label: 'Total Tile Coverage Needed', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Single Tile Coverage', value: tileAreaSqft, suffix: ' sq ft', decimals: 2 },
        { label: 'Cartons Needed', value: ceil(cartons), suffix: ' cartons', decimals: 0 },
        { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Tile count is based on the finished area plus waste so edge cuts and breakage are not ignored.',
        'Single-tile coverage helps explain why smaller format tile usually drives a higher piece count even when room area stays the same.',
        'Carton count remains useful even when tile is discussed by piece because many products are sold by box coverage.',
      ],
      warnings:
        areaSqft <= 0 || tileAreaSqft <= 0
          ? ['Room dimensions and tile size must be above zero to calculate tile count.']
          : [],
    };
  }

  if (variant === 'grout') {
    const groutLengthPerSqft = tileLengthInches > 0 && tileWidthInches > 0 ? 144 / tileLengthInches + 144 / tileWidthInches : 0;
    const groutVolumePerSqft = groutLengthPerSqft * groutJointInches * groutDepthInches;
    const totalVolume = groutVolumePerSqft * totalWithWasteSqft;
    const bags = groutBagYieldCubicInches > 0 ? totalVolume / groutBagYieldCubicInches : 0;
    return {
      primaryLabel: 'Estimated Grout Bags Needed',
      primaryValue: ceil(bags),
      primarySuffix: ' bags',
      primaryDecimals: 0,
      metrics: [
        { label: 'Total Grout Volume', value: totalVolume, suffix: ' cu in', decimals: 1 },
        { label: 'Joint Width', value: groutJointInches, suffix: ' in', decimals: 3 },
        { label: 'Joint Depth', value: groutDepthInches, suffix: ' in', decimals: 3 },
        { label: 'Coverage Area Used', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'This estimate uses tile size, joint width, and joint depth so the grout quantity reflects the pattern rather than room area alone.',
        'Smaller tiles increase total joint length, which usually raises grout demand even if the floor area is unchanged.',
        'Bag count is rounded up because grout is usually purchased in whole units and field waste can vary by tile texture and cleanup method.',
      ],
      warnings:
        totalWithWasteSqft <= 0 || groutBagYieldCubicInches <= 0
          ? ['Room area and grout bag yield must be above zero to estimate grout quantity.']
          : [],
    };
  }

  if (variant === 'thinset') {
    const bags = thinsetBagCoverageSqft > 0 ? totalWithWasteSqft / thinsetBagCoverageSqft : 0;
    const extraArea = totalWithWasteSqft - areaSqft;
    return {
      primaryLabel: 'Estimated Thinset Bags Needed',
      primaryValue: ceil(bags),
      primarySuffix: ' bags',
      primaryDecimals: 0,
      metrics: [
        { label: 'Coverage Area Used', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Bag Coverage Assumption', value: thinsetBagCoverageSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste Area Included', value: extraArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Tile Size', value: (tileLengthInches * tileWidthInches) / 144, suffix: ' sq ft', decimals: 2 },
      ],
      notes: [
        'Thinset quantity is based on total install area plus waste, then compared against the bag coverage assumption you entered.',
        'Real-world coverage can shift with trowel size, tile back pattern, and substrate flatness, so bag coverage is intentionally kept explicit.',
        'The result is best used as a planning estimate before product-specific coverage tables are finalized.',
      ],
      warnings:
        totalWithWasteSqft <= 0 || thinsetBagCoverageSqft <= 0
          ? ['Install area and bag coverage must be above zero to estimate thinset quantity.']
          : [],
    };
  }

  if (variant === 'carpet') {
    const squareYards = totalWithWasteSqft / 9;
    const strips = rollWidthFeet > 0 ? Math.ceil(roomWidthFeet / rollWidthFeet) : 0;
    const purchasedArea = strips * rollWidthFeet * roomLengthFeet;
    const seamCount = Math.max(strips - 1, 0);
    return {
      primaryLabel: 'Estimated Carpet Needed',
      primaryValue: purchasedArea,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Square Yards', value: squareYards, suffix: ' sq yd', decimals: 1 },
        { label: 'Roll Width Used', value: rollWidthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Strip Runs Needed', value: strips, suffix: ' runs', decimals: 0 },
        { label: 'Estimated Seams', value: seamCount, suffix: ' seams', decimals: 0 },
      ],
      notes: [
        'Carpet planning is driven by roll width, not just by room square footage, so purchased area can exceed the simple room-area estimate.',
        'Strip count matters because seams, pattern alignment, and orientation can change both waste and labor effort.',
        'Square yards are shown because carpet pricing and ordering are often discussed in that unit even when rooms are measured in square feet.',
      ],
      warnings:
        roomLengthFeet <= 0 || roomWidthFeet <= 0 || rollWidthFeet <= 0
          ? ['Room dimensions and carpet roll width must be above zero to estimate carpet quantity.']
          : [],
    };
  }

  if (variant === 'baseboard') {
    const adjustedPerimeter = Math.max(perimeterFeet - openingAllowanceFeet, 0);
    const totalWithWaste = adjustedPerimeter * (1 + wastePercent / 100);
    const pieces = pieceLengthFeet > 0 ? totalWithWaste / pieceLengthFeet : 0;
    return {
      primaryLabel: 'Estimated Baseboard Needed',
      primaryValue: totalWithWaste,
      primarySuffix: ' linear ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Room Perimeter', value: perimeterFeet, suffix: ' ft', decimals: 1 },
        { label: 'Opening Allowance', value: openingAllowanceFeet, suffix: ' ft', decimals: 1 },
        { label: 'Adjusted Perimeter', value: adjustedPerimeter, suffix: ' ft', decimals: 1 },
        { label: 'Pieces Needed', value: ceil(pieces), suffix: ' pieces', decimals: 0 },
      ],
      notes: [
        'Baseboard is planned from perimeter, then reduced by doorway or opening allowances before waste is added back for cuts.',
        'Piece count matters because trim is bought by stock length, and miter cuts can quickly increase waste on smaller rooms.',
        'This result is especially useful when deciding whether shorter stock lengths will increase joints and visible trim breaks.',
      ],
      warnings:
        perimeterFeet <= 0 || pieceLengthFeet <= 0
          ? ['Room dimensions and baseboard piece length must be above zero to estimate trim quantities.']
          : [],
    };
  }

  if (variant === 'underlayment') {
    const rolls = underlaymentRollCoverageSqft > 0 ? totalWithWasteSqft / underlaymentRollCoverageSqft : 0;
    return {
      primaryLabel: 'Estimated Underlayment Needed',
      primaryValue: totalWithWasteSqft,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Rolls Needed', value: ceil(rolls), suffix: ' rolls', decimals: 0 },
        { label: 'Room Area', value: areaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste Area', value: totalWithWasteSqft - areaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Roll Coverage Used', value: underlaymentRollCoverageSqft, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'Underlayment is typically planned from the same footprint as the finished floor but still needs waste for trimming, seams, and layout adjustments.',
        'Roll count is rounded up because underlayment is usually purchased in full rolls or cartons.',
        'The result is most useful when paired with the final flooring layout because direction changes can affect seam count and overlap waste.',
      ],
      warnings:
        totalWithWasteSqft <= 0 || underlaymentRollCoverageSqft <= 0
          ? ['Install area and underlayment roll coverage must be above zero to estimate quantity.']
          : [],
    };
  }

  if (variant === 'subfloor') {
    const sheetArea = subfloorSheetLengthFeet * subfloorSheetWidthFeet;
    const sheets = sheetArea > 0 ? totalWithWasteSqft / sheetArea : 0;
    return {
      primaryLabel: 'Estimated Subfloor Sheets Needed',
      primaryValue: ceil(sheets),
      primarySuffix: ' sheets',
      primaryDecimals: 0,
      metrics: [
        { label: 'Coverage Area Used', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Single Sheet Area', value: sheetArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Room Area', value: areaSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Subfloor planning uses full-sheet coverage because sheathing is purchased by panel, not by exact installed square footage.',
        'Waste matters more around cutups, stair openings, and irregular room geometry than in a clean rectangle.',
        'Sheet area is shown separately so you can quickly see how alternative panel sizes would change the purchase plan.',
      ],
      warnings:
        totalWithWasteSqft <= 0 || sheetArea <= 0
          ? ['Room area and sheet dimensions must be above zero to estimate subfloor sheets.']
          : [],
    };
  }

  if (variant === 'transition-strip') {
    const totalWithWaste = transitionLengthFeet * (1 + wastePercent / 100);
    const pieces = pieceLengthFeet > 0 ? totalWithWaste / pieceLengthFeet : 0;
    return {
      primaryLabel: 'Estimated Transition Strip Needed',
      primaryValue: totalWithWaste,
      primarySuffix: ' linear ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'Transition Length', value: transitionLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Waste Included', value: totalWithWaste - transitionLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Piece Length', value: pieceLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Pieces Needed', value: ceil(pieces), suffix: ' pieces', decimals: 0 },
      ],
      notes: [
        'Transition-strip planning is based on the actual break lines between surfaces, not on the full room perimeter.',
        'Waste is still useful because metal or wood transitions are commonly cut around jambs and edge details.',
        'Piece count is kept separate so stock length decisions can be made before shopping or ordering trim kits.',
      ],
      warnings:
        transitionLengthFeet <= 0 || pieceLengthFeet <= 0
          ? ['Transition length and stock piece length must be above zero to estimate trim quantity.']
          : [],
    };
  }

  if (variant === 'floor-joist') {
    const spacingFeet = joistSpacingInches / 12;
    const joistCount = spacingFeet > 0 ? Math.floor(roomWidthFeet / spacingFeet) + 1 : 0;
    const linearFeet = joistCount * roomLengthFeet;
    const spacingCoverage = joistCount > 1 ? roomWidthFeet / (joistCount - 1) : 0;
    return {
      primaryLabel: 'Estimated Joists Needed',
      primaryValue: joistCount,
      primarySuffix: ' joists',
      primaryDecimals: 0,
      metrics: [
        { label: 'Total Linear Feet', value: linearFeet, suffix: ' ft', decimals: 1 },
        { label: 'Span Length per Joist', value: roomLengthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Target Spacing', value: joistSpacingInches, suffix: ' in', decimals: 1 },
        { label: 'Actual Average Spacing', value: spacingCoverage * 12, suffix: ' in', decimals: 1 },
      ],
      notes: [
        'This result estimates joist count from floor width and target spacing and is useful for material planning, not structural engineering approval.',
        'Average achieved spacing is shown because real layouts rarely land on the spacing target with perfect exactness at the final bay.',
        'Linear footage stays visible so lumber takeoff and cost planning can be done without reworking the geometry by hand.',
      ],
      warnings:
        roomLengthFeet <= 0 || roomWidthFeet <= 0 || joistSpacingInches <= 0
          ? ['Floor dimensions and joist spacing must be above zero to estimate joist count.']
          : ['Use local code, span tables, and engineering guidance for structural sizing and compliance decisions.'],
    };
  }

  if (variant === 'floor-leveling') {
    const depthFactor = pourDepthInches / 0.125;
    const adjustedCoverage = depthFactor > 0 ? selfLevelCoverageSqftAtEighth / depthFactor : 0;
    const bags = adjustedCoverage > 0 ? totalWithWasteSqft / adjustedCoverage : 0;
    return {
      primaryLabel: 'Estimated Leveler Bags Needed',
      primaryValue: ceil(bags),
      primarySuffix: ' bags',
      primaryDecimals: 0,
      metrics: [
        { label: 'Coverage Area Used', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
        { label: 'Pour Depth', value: pourDepthInches, suffix: ' in', decimals: 3 },
        { label: 'Adjusted Bag Coverage', value: adjustedCoverage, suffix: ' sq ft', decimals: 1 },
        { label: 'Reference Coverage at 1/8 in', value: selfLevelCoverageSqftAtEighth, suffix: ' sq ft', decimals: 1 },
      ],
      notes: [
        'Self-leveler coverage changes quickly with depth, so the product coverage assumption is adjusted from the 1/8-inch reference depth you entered.',
        'Waste is included because spillage, edge tapering, and uneven low spots can increase material use beyond the clean average.',
        'This is best used as a planning estimate before final substrate prep and depth mapping are confirmed on site.',
      ],
      warnings:
        totalWithWasteSqft <= 0 || selfLevelCoverageSqftAtEighth <= 0 || pourDepthInches <= 0
          ? ['Area, reference coverage, and pour depth must be above zero to estimate leveling compound.']
          : [],
    };
  }

  if (variant === 'floor-heating') {
    const heatedArea = areaSqft * (heatedCoveragePercent / 100);
    const systemWatts = heatedArea * wattsPerSqft;
    const kwhPerDay = (systemWatts * dailyUsageHours) / 1000;
    const monthlyCost = kwhPerDay * electricityRatePerKwh * 30;
    return {
      primaryLabel: 'Heated Floor Coverage',
      primaryValue: heatedArea,
      primarySuffix: ' sq ft',
      primaryDecimals: 1,
      metrics: [
        { label: 'System Wattage', value: systemWatts, suffix: ' W', decimals: 0 },
        { label: 'Energy Use per Day', value: kwhPerDay, suffix: ' kWh', decimals: 2 },
        { label: 'Estimated Monthly Energy Cost', value: monthlyCost, currency: true, decimals: 2 },
        { label: 'Coverage Ratio', value: heatedCoveragePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Heated area is based on the share of the room you actually plan to warm, which is often smaller than the full room footprint once fixed cabinets and fixtures are excluded.',
        'System wattage and daily energy use stay visible so comfort planning and operating-cost planning can be read together.',
        'Monthly energy cost is an estimate based on your usage hours and power rate assumptions, not a guaranteed utility bill outcome.',
      ],
      warnings:
        areaSqft <= 0 || heatedCoveragePercent <= 0 || wattsPerSqft <= 0
          ? ['Room area, heated coverage, and watt density must be above zero to estimate floor-heating requirements.']
          : [],
    };
  }

  const pieces = pieceLengthFeet > 0 ? totalWithWasteSqft / pieceLengthFeet : 0;
  return {
    primaryLabel: 'Estimated Pieces Needed',
    primaryValue: ceil(pieces),
    primarySuffix: ' pieces',
    primaryDecimals: 0,
    metrics: [
      { label: 'Coverage Area Used', value: totalWithWasteSqft, suffix: ' sq ft', decimals: 1 },
      { label: 'Piece Length', value: pieceLengthFeet, suffix: ' ft', decimals: 1 },
      { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      { label: 'Room Area', value: areaSqft, suffix: ' sq ft', decimals: 1 },
    ],
    notes: [
      'This fallback result estimates pieces from the total covered area and stock length assumptions.',
      'Area and waste are kept visible so the takeoff remains easy to sanity-check before ordering.',
      'Stock length choices can materially change the final count even when room area remains the same.',
    ],
    warnings:
      totalWithWasteSqft <= 0 || pieceLengthFeet <= 0
        ? ['Area and stock dimensions must be above zero to estimate quantity.']
        : [],
  };
}
