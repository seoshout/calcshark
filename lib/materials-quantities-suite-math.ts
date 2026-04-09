import type { MaterialsQuantitiesVariant } from '@/lib/materials-quantities-suite-config';

export interface Inputs {
  lengthFeet: string;
  widthFeet: string;
  depthInches: string;
  wastePercent: string;
  densityTonsPerCubicYard: string;
  bagYieldCubicFeet: string;
  bagSizeCubicFeet: string;
  wallLengthFeet: string;
  wallHeightFeet: string;
  blockLengthInches: string;
  blockHeightInches: string;
  brickLengthInches: string;
  brickHeightInches: string;
  mortarJointInches: string;
  paverLengthInches: string;
  paverWidthInches: string;
  columnDiameterInches: string;
  columnHeightFeet: string;
  slabThicknessInches: string;
  stairWidthFeet: string;
  stairTreadInches: string;
  stairRiseInches: string;
  stairStepCount: string;
  rebarSpacingInches: string;
  rebarStockLengthFeet: string;
  barOverlapFeet: string;
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

const areaSqft = (lengthFeet: number, widthFeet: number) => lengthFeet * widthFeet;
const volumeCubicFeet = (lengthFeet: number, widthFeet: number, depthInches: number) =>
  areaSqft(lengthFeet, widthFeet) * (depthInches / 12);
const cubicYards = (cubicFeet: number) => cubicFeet / 27;

const BASE_INPUTS: Inputs = {
  lengthFeet: '20',
  widthFeet: '12',
  depthInches: '4',
  wastePercent: '10',
  densityTonsPerCubicYard: '1.4',
  bagYieldCubicFeet: '0.6',
  bagSizeCubicFeet: '2',
  wallLengthFeet: '24',
  wallHeightFeet: '8',
  blockLengthInches: '16',
  blockHeightInches: '8',
  brickLengthInches: '8',
  brickHeightInches: '2.25',
  mortarJointInches: '0.375',
  paverLengthInches: '8',
  paverWidthInches: '4',
  columnDiameterInches: '18',
  columnHeightFeet: '10',
  slabThicknessInches: '4',
  stairWidthFeet: '4',
  stairTreadInches: '11',
  stairRiseInches: '7',
  stairStepCount: '6',
  rebarSpacingInches: '12',
  rebarStockLengthFeet: '20',
  barOverlapFeet: '1.5',
};

export const DEFAULT_INPUTS: Record<MaterialsQuantitiesVariant, Inputs> = {
  concrete: { ...BASE_INPUTS, densityTonsPerCubicYard: '2', bagYieldCubicFeet: '0.6' },
  'concrete-block': { ...BASE_INPUTS },
  'concrete-column': { ...BASE_INPUTS, densityTonsPerCubicYard: '2', bagYieldCubicFeet: '0.6' },
  'concrete-slab': { ...BASE_INPUTS, densityTonsPerCubicYard: '2', bagYieldCubicFeet: '0.6' },
  'concrete-stairs': { ...BASE_INPUTS, densityTonsPerCubicYard: '2', bagYieldCubicFeet: '0.6' },
  gravel: { ...BASE_INPUTS, densityTonsPerCubicYard: '1.35' },
  sand: { ...BASE_INPUTS, densityTonsPerCubicYard: '1.3' },
  topsoil: { ...BASE_INPUTS, densityTonsPerCubicYard: '0.85', bagSizeCubicFeet: '1.5' },
  mulch: { ...BASE_INPUTS, densityTonsPerCubicYard: '0.2', bagSizeCubicFeet: '2' },
  aggregate: { ...BASE_INPUTS, densityTonsPerCubicYard: '1.4' },
  asphalt: { ...BASE_INPUTS, densityTonsPerCubicYard: '2.025' },
  rebar: { ...BASE_INPUTS },
  brick: { ...BASE_INPUTS, brickLengthInches: '8', brickHeightInches: '2.25' },
  paver: { ...BASE_INPUTS, paverLengthInches: '8', paverWidthInches: '4' },
  stone: { ...BASE_INPUTS, densityTonsPerCubicYard: '1.5' },
};

export function buildMaterialsQuantitiesResult(
  variant: MaterialsQuantitiesVariant,
  inputs: Inputs
): Result {
  const lengthFeet = parse(inputs.lengthFeet);
  const widthFeet = parse(inputs.widthFeet);
  const depthInches = parse(inputs.depthInches);
  const wastePercent = parse(inputs.wastePercent);
  const densityTonsPerCubicYard = parse(inputs.densityTonsPerCubicYard);
  const bagYieldCubicFeet = parse(inputs.bagYieldCubicFeet);
  const bagSizeCubicFeet = parse(inputs.bagSizeCubicFeet);
  const wallLengthFeet = parse(inputs.wallLengthFeet);
  const wallHeightFeet = parse(inputs.wallHeightFeet);
  const blockLengthInches = parse(inputs.blockLengthInches);
  const blockHeightInches = parse(inputs.blockHeightInches);
  const brickLengthInches = parse(inputs.brickLengthInches);
  const brickHeightInches = parse(inputs.brickHeightInches);
  const mortarJointInches = parse(inputs.mortarJointInches);
  const paverLengthInches = parse(inputs.paverLengthInches);
  const paverWidthInches = parse(inputs.paverWidthInches);
  const columnDiameterInches = parse(inputs.columnDiameterInches);
  const columnHeightFeet = parse(inputs.columnHeightFeet);
  const slabThicknessInches = parse(inputs.slabThicknessInches);
  const stairWidthFeet = parse(inputs.stairWidthFeet);
  const stairTreadInches = parse(inputs.stairTreadInches);
  const stairRiseInches = parse(inputs.stairRiseInches);
  const stairStepCount = parse(inputs.stairStepCount);
  const rebarSpacingInches = parse(inputs.rebarSpacingInches);
  const rebarStockLengthFeet = parse(inputs.rebarStockLengthFeet);
  const barOverlapFeet = parse(inputs.barOverlapFeet);

  const baseArea = areaSqft(lengthFeet, widthFeet);
  const baseVolumeCubicFeet = volumeCubicFeet(lengthFeet, widthFeet, depthInches);
  const adjustedVolumeCubicFeet = baseVolumeCubicFeet * (1 + wastePercent / 100);
  const adjustedVolumeCubicYards = cubicYards(adjustedVolumeCubicFeet);

  if (
    variant === 'concrete' ||
    variant === 'gravel' ||
    variant === 'sand' ||
    variant === 'topsoil' ||
    variant === 'mulch' ||
    variant === 'aggregate' ||
    variant === 'asphalt' ||
    variant === 'stone'
  ) {
    const tons = adjustedVolumeCubicYards * densityTonsPerCubicYard;
    const bags = bagSizeCubicFeet > 0 ? adjustedVolumeCubicFeet / bagSizeCubicFeet : 0;
    const primaryLabel =
      variant === 'mulch' || variant === 'topsoil'
        ? 'Material Needed'
        : variant === 'asphalt'
          ? 'Asphalt Needed'
          : `${variant.charAt(0).toUpperCase() + variant.slice(1)} Needed`;

    return {
      primaryLabel,
      primaryValue: adjustedVolumeCubicYards,
      primarySuffix: ' cu yd',
      primaryDecimals: 2,
      metrics: [
        { label: 'Volume in Cubic Feet', value: adjustedVolumeCubicFeet, suffix: ' cu ft', decimals: 1 },
        { label: 'Base Area', value: baseArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Depth', value: depthInches, suffix: ' in', decimals: 1 },
        {
          label: variant === 'mulch' || variant === 'topsoil' ? 'Estimated Bags' : 'Estimated Tons',
          value: variant === 'mulch' || variant === 'topsoil' ? ceil(bags) : tons,
          suffix: variant === 'mulch' || variant === 'topsoil' ? ' bags' : ' tons',
          decimals: variant === 'mulch' || variant === 'topsoil' ? 0 : 2,
        },
      ],
      notes: [
        'This run converts area and depth into volume first so the material estimate stays grounded in the actual footprint of the project.',
        'Waste is included separately so uneven grade, compaction loss, and clean-up overage do not disappear inside one final number.',
        variant === 'mulch' || variant === 'topsoil'
          ? 'Bag count is shown because these materials are often purchased in packaged cubic-foot bags as well as in bulk.'
          : 'Tonnage is shown because bulk aggregates and paving materials are often sold or delivered by the ton.',
      ],
      warnings:
        baseArea <= 0 || depthInches <= 0
          ? ['Length, width, and depth must be above zero to estimate material quantity.']
          : [],
    };
  }

  if (variant === 'concrete-slab') {
    const cubicFeet = volumeCubicFeet(lengthFeet, widthFeet, slabThicknessInches) * (1 + wastePercent / 100);
    const cubicYardsValue = cubicYards(cubicFeet);
    const bags = bagYieldCubicFeet > 0 ? cubicFeet / bagYieldCubicFeet : 0;
    return {
      primaryLabel: 'Concrete Needed for Slab',
      primaryValue: cubicYardsValue,
      primarySuffix: ' cu yd',
      primaryDecimals: 2,
      metrics: [
        { label: 'Slab Area', value: baseArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Thickness', value: slabThicknessInches, suffix: ' in', decimals: 1 },
        { label: 'Volume in Cubic Feet', value: cubicFeet, suffix: ' cu ft', decimals: 1 },
        { label: '80-lb Bag Equivalent', value: ceil(bags), suffix: ' bags', decimals: 0 },
      ],
      notes: [
        'The slab estimate converts finished area and slab thickness into volume, then layers waste on top for spills, uneven grade, and edge variation.',
        'Cubic yards are shown for ready-mix planning while bag count stays visible for smaller projects using bagged concrete.',
        'This result is best treated as a planning takeoff before reinforcement, base prep, and final pour details are finalized.',
      ],
      warnings:
        baseArea <= 0 || slabThicknessInches <= 0
          ? ['Length, width, and slab thickness must be above zero to estimate concrete quantity.']
          : [],
    };
  }

  if (variant === 'concrete-column') {
    const radiusFeet = columnDiameterInches / 24;
    const cubicFeet = Math.PI * radiusFeet * radiusFeet * columnHeightFeet * (1 + wastePercent / 100);
    const cubicYardsValue = cubicYards(cubicFeet);
    const bags = bagYieldCubicFeet > 0 ? cubicFeet / bagYieldCubicFeet : 0;
    return {
      primaryLabel: 'Concrete Needed for Column',
      primaryValue: cubicYardsValue,
      primarySuffix: ' cu yd',
      primaryDecimals: 2,
      metrics: [
        { label: 'Column Diameter', value: columnDiameterInches, suffix: ' in', decimals: 1 },
        { label: 'Column Height', value: columnHeightFeet, suffix: ' ft', decimals: 1 },
        { label: 'Volume in Cubic Feet', value: cubicFeet, suffix: ' cu ft', decimals: 1 },
        { label: '80-lb Bag Equivalent', value: ceil(bags), suffix: ' bags', decimals: 0 },
      ],
      notes: [
        'This run treats the column as a cylinder and then adds waste so the estimate remains practical for ordering.',
        'Diameter and height stay visible because small changes in round forms can change total concrete volume faster than many installers expect.',
        'Bag count is useful for smaller formed pours, while cubic yards help if the column is part of a larger ready-mix order.',
      ],
      warnings:
        columnDiameterInches <= 0 || columnHeightFeet <= 0
          ? ['Column diameter and height must be above zero to estimate a concrete column.']
          : [],
    };
  }

  if (variant === 'concrete-stairs') {
    const treadFeet = stairTreadInches / 12;
    const riseFeet = stairRiseInches / 12;
    const cubicFeet =
      stairWidthFeet * treadFeet * riseFeet * (stairStepCount * (stairStepCount + 1) / 2) * (1 + wastePercent / 100);
    const cubicYardsValue = cubicYards(cubicFeet);
    const bags = bagYieldCubicFeet > 0 ? cubicFeet / bagYieldCubicFeet : 0;
    return {
      primaryLabel: 'Concrete Needed for Stairs',
      primaryValue: cubicYardsValue,
      primarySuffix: ' cu yd',
      primaryDecimals: 2,
      metrics: [
        { label: 'Step Count', value: stairStepCount, suffix: ' steps', decimals: 0 },
        { label: 'Stair Width', value: stairWidthFeet, suffix: ' ft', decimals: 1 },
        { label: 'Volume in Cubic Feet', value: cubicFeet, suffix: ' cu ft', decimals: 1 },
        { label: '80-lb Bag Equivalent', value: ceil(bags), suffix: ' bags', decimals: 0 },
      ],
      notes: [
        'The stair estimate treats the run as a stacked stepped volume so step count, tread, and rise all contribute to the final concrete quantity.',
        'Waste is included because stair forms often create a little more placement and clean-up loss than a simple slab pour.',
        'This estimate helps with project planning, but form design and reinforcement still need to be checked separately for the actual build.',
      ],
      warnings:
        stairWidthFeet <= 0 || stairTreadInches <= 0 || stairRiseInches <= 0 || stairStepCount <= 0
          ? ['Stair width, tread, rise, and step count must be above zero to estimate stair concrete volume.']
          : [],
    };
  }

  if (variant === 'concrete-block') {
    const wallArea = wallLengthFeet * wallHeightFeet;
    const blockFaceArea = ((blockLengthInches + mortarJointInches) * (blockHeightInches + mortarJointInches)) / 144;
    const blocks = blockFaceArea > 0 ? wallArea / blockFaceArea : 0;
    const adjustedBlocks = blocks * (1 + wastePercent / 100);
    return {
      primaryLabel: 'Estimated Concrete Blocks Needed',
      primaryValue: ceil(adjustedBlocks),
      primarySuffix: ' blocks',
      primaryDecimals: 0,
      metrics: [
        { label: 'Wall Area', value: wallArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Single Block Face Area', value: blockFaceArea, suffix: ' sq ft', decimals: 2 },
        { label: 'Base Block Count', value: ceil(blocks), suffix: ' blocks', decimals: 0 },
        { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Block quantity is estimated from wall face area and the effective module size created by block dimensions plus mortar joints.',
        'Waste is shown explicitly because cuts, damaged units, and corner details can push the practical block order above the clean count.',
        'This result is most useful as a takeoff tool before footing design, reinforcement, and local code checks are finalized.',
      ],
      warnings:
        wallArea <= 0 || blockFaceArea <= 0
          ? ['Wall dimensions and block size must be above zero to estimate concrete block quantity.']
          : [],
    };
  }

  if (variant === 'brick') {
    const wallArea = wallLengthFeet * wallHeightFeet;
    const brickFaceArea = ((brickLengthInches + mortarJointInches) * (brickHeightInches + mortarJointInches)) / 144;
    const bricks = brickFaceArea > 0 ? wallArea / brickFaceArea : 0;
    const adjustedBricks = bricks * (1 + wastePercent / 100);
    return {
      primaryLabel: 'Estimated Bricks Needed',
      primaryValue: ceil(adjustedBricks),
      primarySuffix: ' bricks',
      primaryDecimals: 0,
      metrics: [
        { label: 'Wall Area', value: wallArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Brick Module Area', value: brickFaceArea, suffix: ' sq ft', decimals: 3 },
        { label: 'Base Brick Count', value: ceil(bricks), suffix: ' bricks', decimals: 0 },
        { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Brick quantity is based on wall face area and the module created by the brick dimensions plus mortar joint allowance.',
        'Mortar joints are kept visible because small joint changes can shift total brick count across a larger wall.',
        'Waste is included for cuts, pattern alignment, and damaged units so the result stays closer to a purchase-ready estimate.',
      ],
      warnings:
        wallArea <= 0 || brickFaceArea <= 0
          ? ['Wall dimensions and brick size must be above zero to estimate brick quantity.']
          : [],
    };
  }

  if (variant === 'paver') {
    const projectArea = areaSqft(lengthFeet, widthFeet);
    const paverArea = (paverLengthInches * paverWidthInches) / 144;
    const pavers = paverArea > 0 ? projectArea / paverArea : 0;
    const adjustedPavers = pavers * (1 + wastePercent / 100);
    return {
      primaryLabel: 'Estimated Pavers Needed',
      primaryValue: ceil(adjustedPavers),
      primarySuffix: ' pavers',
      primaryDecimals: 0,
      metrics: [
        { label: 'Project Area', value: projectArea, suffix: ' sq ft', decimals: 1 },
        { label: 'Single Paver Area', value: paverArea, suffix: ' sq ft', decimals: 2 },
        { label: 'Base Paver Count', value: ceil(pavers), suffix: ' pavers', decimals: 0 },
        { label: 'Waste Allowance', value: wastePercent, suffix: '%', decimals: 1 },
      ],
      notes: [
        'Paver quantity is calculated from project area and the face area of one paver, then adjusted upward for cuts and layout waste.',
        'Single-paver area is shown because changing format size can alter both piece count and installation labor even when the total patio area is unchanged.',
        'The result is useful for order planning, but base material, bedding sand, and joint sand should still be planned separately.',
      ],
      warnings:
        projectArea <= 0 || paverArea <= 0
          ? ['Project dimensions and paver size must be above zero to estimate paver quantity.']
          : [],
    };
  }

  if (variant === 'rebar') {
    const clearLength = Math.max(lengthFeet - 0.5, 0);
    const clearWidth = Math.max(widthFeet - 0.5, 0);
    const barsAlongLength = rebarSpacingInches > 0 ? Math.floor((widthFeet * 12) / rebarSpacingInches) + 1 : 0;
    const barsAlongWidth = rebarSpacingInches > 0 ? Math.floor((lengthFeet * 12) / rebarSpacingInches) + 1 : 0;
    const totalLinearFeet =
      barsAlongLength * (clearLength + barOverlapFeet) + barsAlongWidth * (clearWidth + barOverlapFeet);
    const sticks = rebarStockLengthFeet > 0 ? totalLinearFeet / rebarStockLengthFeet : 0;
    return {
      primaryLabel: 'Estimated Rebar Sticks Needed',
      primaryValue: ceil(sticks * (1 + wastePercent / 100)),
      primarySuffix: ' sticks',
      primaryDecimals: 0,
      metrics: [
        { label: 'Bars Along Length Direction', value: barsAlongLength, suffix: ' bars', decimals: 0 },
        { label: 'Bars Along Width Direction', value: barsAlongWidth, suffix: ' bars', decimals: 0 },
        { label: 'Total Linear Feet', value: totalLinearFeet, suffix: ' ft', decimals: 1 },
        { label: 'Stock Length', value: rebarStockLengthFeet, suffix: ' ft', decimals: 1 },
      ],
      notes: [
        'This slab-style estimate creates a simple two-direction grid based on the spacing and slab dimensions you entered.',
        'Total linear footage helps show how much reinforcement the slab layout represents before it is converted into stock lengths.',
        'Overlap and waste are included because field cuts and lapped joints can materially change the stick count required.',
      ],
      warnings:
        lengthFeet <= 0 || widthFeet <= 0 || rebarSpacingInches <= 0 || rebarStockLengthFeet <= 0
          ? ['Slab dimensions, spacing, and stock length must be above zero to estimate rebar quantity.']
          : ['Use local structural guidance for bar size, cover, placement, and reinforcement design requirements.'],
    };
  }

  const cubicFeet = adjustedVolumeCubicFeet;
  const cubicYardsValue = adjustedVolumeCubicYards;
  const bags = bagYieldCubicFeet > 0 ? cubicFeet / bagYieldCubicFeet : 0;
  return {
    primaryLabel: 'Concrete Needed',
    primaryValue: cubicYardsValue,
    primarySuffix: ' cu yd',
    primaryDecimals: 2,
    metrics: [
      { label: 'Volume in Cubic Feet', value: cubicFeet, suffix: ' cu ft', decimals: 1 },
      { label: 'Base Area', value: baseArea, suffix: ' sq ft', decimals: 1 },
      { label: 'Depth', value: depthInches, suffix: ' in', decimals: 1 },
      { label: '80-lb Bag Equivalent', value: ceil(bags), suffix: ' bags', decimals: 0 },
    ],
    notes: [
      'This general concrete estimate converts area and depth into total volume, then adds waste to keep the takeoff practical.',
      'Cubic yards are shown for ready-mix planning while bag count remains visible for smaller projects using bagged mix.',
      'The result is best treated as a planning estimate before reinforcement, forms, and final pour conditions are finalized.',
    ],
    warnings:
      baseArea <= 0 || depthInches <= 0
        ? ['Length, width, and depth must be above zero to estimate concrete volume.']
        : [],
  };
}
