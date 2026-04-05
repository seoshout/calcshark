import { AlgebraVariant } from '@/lib/algebra-suite-config';

export interface Inputs {
  a: string; b: string; c: string; d: string;
  x1: string; y1: string; x2: string; y2: string;
  a1: string; b1: string; c1: string; a2: string; b2: string; c2: string;
  base: string; exponent: string; logValue: string;
  radicand: string; index: string; absoluteInput: string;
  polynomialCoefficients: string; xValue: string;
  decimalInput: string; mantissa: string; sciExponent: string;
  notationMode: 'decimal-to-scientific' | 'scientific-to-decimal';
}

export interface Metric { label: string; value: string; }

export interface Result {
  status: 'exact' | 'approximate' | 'special-case' | 'invalid';
  primaryLabel: string;
  primaryValue: string;
  exactLabel?: string;
  exactValue?: string;
  metrics: Metric[];
  notes: string[];
  warnings: string[];
}

const parse = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const gcd = (a: number, b: number) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
};

export const formatNumber = (value: number, digits = 6) => {
  if (!Number.isFinite(value)) return 'undefined';
  if (Math.abs(value) < 1e-10) return '0';
  if (Number.isInteger(value)) return value.toString();
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
};

const isIntegerLike = (value: number) => Math.abs(value - Math.round(value)) < 1e-10;

const simplifyFraction = (numerator: number, denominator: number) => {
  if (denominator === 0) return { text: 'undefined', decimal: 'undefined' };
  if (numerator === 0) return { text: '0', decimal: '0' };
  const sign = denominator < 0 ? -1 : 1;
  const n = numerator * sign;
  const d = denominator * sign;
  const divisor = gcd(n, d);
  const simpleN = n / divisor;
  const simpleD = d / divisor;
  return { text: simpleD === 1 ? `${simpleN}` : `${simpleN}/${simpleD}`, decimal: formatNumber(simpleN / simpleD) };
};

const polynomialToString = (coefficients: number[]) => {
  const text = coefficients
    .map((coefficient, index) => {
      if (Math.abs(coefficient) < 1e-10) return '';
      const power = coefficients.length - index - 1;
      const sign = coefficient < 0 ? '-' : '+';
      const absValue = Math.abs(coefficient);
      const coeffText = power > 0 && absValue === 1 ? '' : formatNumber(absValue);
      const variableText = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`;
      return `${sign} ${coeffText}${variableText}`.trim();
    })
    .filter(Boolean)
    .join(' ')
    .replace(/^\+\s*/, '');
  return text || '0';
};

const derivativeCoefficients = (coefficients: number[]) =>
  coefficients.slice(0, -1).map((coefficient, index) => coefficient * (coefficients.length - index - 1));

const evaluatePolynomial = (coefficients: number[], x: number) =>
  coefficients.reduce((acc, coefficient) => acc * x + coefficient, 0);

const simplifySquareRoot = (value: number) => {
  const n = Math.round(Math.abs(value));
  if (n === 0) return { exact: '0', decimal: '0' };
  let outside = 1;
  let inside = n;
  for (let factor = 2; factor * factor <= inside; factor += 1) {
    const square = factor * factor;
    while (inside % square === 0) {
      outside *= factor;
      inside /= square;
    }
  }
  if (inside === 1) {
    return { exact: value < 0 ? `${outside}i` : `${outside}`, decimal: value < 0 ? `${formatNumber(Math.sqrt(n))}i` : formatNumber(Math.sqrt(n)) };
  }
  const core = outside === 1 ? `sqrt(${inside})` : `${outside}sqrt(${inside})`;
  return { exact: value < 0 ? `${core}i` : core, decimal: value < 0 ? `${formatNumber(Math.sqrt(n))}i` : formatNumber(Math.sqrt(n)) };
};

const simplifyCubeRoot = (value: number) => {
  const sign = value < 0 ? -1 : 1;
  let inside = Math.round(Math.abs(value));
  if (inside === 0) return { exact: '0', decimal: '0' };
  let outside = 1;
  for (let factor = 2; factor * factor * factor <= inside; factor += 1) {
    const cube = factor ** 3;
    while (inside % cube === 0) {
      outside *= factor;
      inside /= cube;
    }
  }
  const prefix = sign < 0 ? '-' : '';
  return {
    exact: inside === 1 ? `${prefix}${outside}` : `${prefix}${outside === 1 ? '' : outside}cbrt(${inside})`,
    decimal: formatNumber(Math.cbrt(value)),
  };
};

const simplifyNthRoot = (value: number, index: number) => {
  if (index < 2) return { exact: 'invalid', decimal: 'invalid' };
  if (value < 0 && index % 2 === 0) return { exact: 'not a real value', decimal: 'not a real value' };
  if (value === 0) return { exact: '0', decimal: '0' };
  const sign = value < 0 ? -1 : 1;
  let inside = Math.round(Math.abs(value));
  let outside = 1;
  for (let factor = 2; factor ** index <= inside; factor += 1) {
    const power = factor ** index;
    while (inside % power === 0) {
      outside *= factor;
      inside /= power;
    }
  }
  const decimal = sign < 0 ? -Math.pow(Math.abs(value), 1 / index) : Math.pow(value, 1 / index);
  const prefix = sign < 0 ? '-' : '';
  return {
    exact: inside === 1 ? `${prefix}${outside}` : `${prefix}${outside === 1 ? '' : outside}root(${index}, ${inside})`,
    decimal: formatNumber(decimal),
  };
};

const scientificNotation = (value: number) => {
  if (value === 0) return { mantissa: 0, exponent: 0, text: '0 x 10^0' };
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / (10 ** exponent);
  return { mantissa, exponent, text: `${formatNumber(mantissa)} x 10^${exponent}` };
};

const integerFactors = (value: number) => {
  const n = Math.abs(Math.round(value));
  if (n === 0) return ['0'];
  const factors = new Set<number>();
  for (let i = 1; i <= Math.sqrt(n); i += 1) {
    if (n % i === 0) {
      factors.add(i);
      factors.add(n / i);
    }
  }
  return Array.from(factors).sort((a, b) => a - b).flatMap((factor) => [-factor, factor]).map((factor) => factor.toString());
};

export function buildAlgebraResult(variant: AlgebraVariant, inputs: Inputs): Result {
  const a = parse(inputs.a); const b = parse(inputs.b); const c = parse(inputs.c); const d = parse(inputs.d);
  const x1 = parse(inputs.x1); const y1 = parse(inputs.y1); const x2 = parse(inputs.x2); const y2 = parse(inputs.y2);
  const a1 = parse(inputs.a1); const b1 = parse(inputs.b1); const c1 = parse(inputs.c1); const a2 = parse(inputs.a2); const b2 = parse(inputs.b2); const c2 = parse(inputs.c2);
  const base = parse(inputs.base); const exponent = parse(inputs.exponent); const logValue = parse(inputs.logValue); const radicand = parse(inputs.radicand); const index = Math.round(parse(inputs.index));
  const absoluteInput = parse(inputs.absoluteInput); const xValue = parse(inputs.xValue);

  if (variant === 'quadratic-formula') {
    if (a === 0) return { status: 'invalid', primaryLabel: 'Roots', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['Coefficient a cannot be zero for a quadratic equation.'] };
    const discriminant = b ** 2 - 4 * a * c; const axis = -b / (2 * a); const vertexY = a * axis ** 2 + b * axis + c; const exactRoot = simplifySquareRoot(discriminant);
    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a); const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { status: isIntegerLike(Math.sqrt(discriminant)) ? 'exact' : 'approximate', primaryLabel: 'Roots', primaryValue: `${formatNumber(root1)} and ${formatNumber(root2)}`, exactLabel: 'Exact Root Form', exactValue: isIntegerLike(Math.sqrt(discriminant)) ? `${formatNumber(root1)} and ${formatNumber(root2)}` : `(-${formatNumber(b)} +/- ${exactRoot.exact}) / ${formatNumber(2 * a)}`, metrics: [{ label: 'Discriminant', value: formatNumber(discriminant) }, { label: 'Axis', value: `x = ${formatNumber(axis)}` }, { label: 'Vertex', value: `(${formatNumber(axis)}, ${formatNumber(vertexY)})` }, { label: 'Root Type', value: 'two real roots' }], notes: ['The discriminant classifies the roots before solving finishes.', 'The axis and vertex link the solution to the parabola.'], warnings: [] };
    }
    if (discriminant === 0) {
      const root = -b / (2 * a);
      return { status: 'special-case', primaryLabel: 'Roots', primaryValue: formatNumber(root), exactLabel: 'Exact Root Form', exactValue: formatNumber(root), metrics: [{ label: 'Discriminant', value: '0' }, { label: 'Axis', value: `x = ${formatNumber(axis)}` }, { label: 'Vertex', value: `(${formatNumber(axis)}, ${formatNumber(vertexY)})` }, { label: 'Root Type', value: 'one repeated real root' }], notes: ['A zero discriminant means the parabola touches the x-axis at one repeated root.'], warnings: [] };
    }
    return { status: 'special-case', primaryLabel: 'Roots', primaryValue: `${formatNumber(-b / (2 * a))} +/- ${formatNumber(Math.sqrt(Math.abs(discriminant)) / Math.abs(2 * a))}i`, exactLabel: 'Exact Root Form', exactValue: `(-${formatNumber(b)} +/- ${exactRoot.exact}) / ${formatNumber(2 * a)}`, metrics: [{ label: 'Discriminant', value: formatNumber(discriminant) }, { label: 'Axis', value: `x = ${formatNumber(axis)}` }, { label: 'Vertex', value: `(${formatNumber(axis)}, ${formatNumber(vertexY)})` }, { label: 'Root Type', value: 'two complex roots' }], notes: ['Complex roots appear when the discriminant is negative.'], warnings: ['The quadratic does not have real x-intercepts under the current coefficients.'] };
  }

  if (variant === 'slope') {
    const dx = x2 - x1; const dy = y2 - y1;
    if (dx === 0 && dy === 0) return { status: 'invalid', primaryLabel: 'Slope', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['The two points are identical, so they do not define a unique line.'] };
    if (dx === 0) return { status: 'special-case', primaryLabel: 'Slope', primaryValue: 'undefined', exactLabel: 'Line Equation', exactValue: `x = ${formatNumber(x1)}`, metrics: [{ label: 'Rise', value: formatNumber(dy) }, { label: 'Run', value: '0' }, { label: 'Line Type', value: 'vertical' }, { label: 'Angle', value: '90 deg' }], notes: ['A vertical line has zero run, so the slope is undefined.'], warnings: ['Undefined slope is expected for vertical lines.'] };
    const slope = simplifyFraction(dy, dx); const intercept = y1 - (dy / dx) * x1;
    return { status: slope.text === slope.decimal ? 'exact' : 'approximate', primaryLabel: 'Slope', primaryValue: slope.text, exactLabel: 'Line Equation', exactValue: `y = ${slope.text}x ${intercept < 0 ? '-' : '+'} ${formatNumber(Math.abs(intercept))}`, metrics: [{ label: 'Slope (decimal)', value: slope.decimal }, { label: 'Rise', value: formatNumber(dy) }, { label: 'Run', value: formatNumber(dx) }, { label: 'Angle', value: `${formatNumber(Math.atan2(dy, dx) * (180 / Math.PI), 3)} deg` }], notes: ['The slope is rise divided by run.', 'The line equation gives the result more context.'], warnings: [] };
  }

  if (variant === 'distance-formula') {
    const dx = x2 - x1; const dy = y2 - y1; const squared = dx ** 2 + dy ** 2; const exact = simplifySquareRoot(squared);
    return { status: exact.exact === exact.decimal ? 'exact' : 'approximate', primaryLabel: 'Distance', primaryValue: exact.decimal, exactLabel: 'Exact Distance', exactValue: exact.exact, metrics: [{ label: 'dx', value: formatNumber(dx) }, { label: 'dy', value: formatNumber(dy) }, { label: 'Squared Distance', value: formatNumber(squared) }], notes: ['The formula comes from the Pythagorean theorem.', 'Squared distance is a useful arithmetic checkpoint.'], warnings: [] };
  }

  if (variant === 'midpoint') {
    const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2; const dx = x2 - x1; const dy = y2 - y1;
    return { status: 'exact', primaryLabel: 'Midpoint', primaryValue: `(${formatNumber(mx)}, ${formatNumber(my)})`, metrics: [{ label: 'Segment Length', value: formatNumber(Math.sqrt(dx ** 2 + dy ** 2)) }, { label: 'Slope', value: dx === 0 ? 'undefined' : simplifyFraction(dy, dx).text }, { label: 'Average of x-values', value: formatNumber(mx) }, { label: 'Average of y-values', value: formatNumber(my) }], notes: ['Midpoint averages x-values and y-values separately.'], warnings: [] };
  }

  if (variant === 'linear-equation') {
    const coeff = a - c; const constant = d - b;
    if (coeff === 0 && constant === 0) return { status: 'special-case', primaryLabel: 'Solution', primaryValue: 'infinitely many solutions', metrics: [{ label: 'Reduced Form', value: '0 = 0' }, { label: 'Classification', value: 'dependent equation' }], notes: ['Both sides reduce to the same statement.'], warnings: [] };
    if (coeff === 0) return { status: 'special-case', primaryLabel: 'Solution', primaryValue: 'no solution', metrics: [{ label: 'Reduced Form', value: `${formatNumber(constant)} = 0` }, { label: 'Classification', value: 'inconsistent equation' }], notes: ['The variable terms cancel, but the constants do not match.'], warnings: ['This equation becomes a false statement after simplifying.'] };
    const solution = simplifyFraction(constant, coeff);
    return { status: solution.text === solution.decimal ? 'exact' : 'approximate', primaryLabel: 'Solution', primaryValue: solution.decimal, exactLabel: 'Exact Solution', exactValue: solution.text, metrics: [{ label: 'Reduced Coefficient', value: formatNumber(coeff) }, { label: 'Reduced Constant', value: formatNumber(constant) }, { label: 'Reduced Equation', value: `${formatNumber(coeff)}x = ${formatNumber(constant)}` }], notes: ['Solving becomes a one-step comparison after terms are grouped.'], warnings: [] };
  }

  if (variant === 'system-of-equations') {
    const det = a1 * b2 - a2 * b1;
    if (det === 0) {
      const dependent = a1 * c2 === a2 * c1 && b1 * c2 === b2 * c1;
      return { status: 'special-case', primaryLabel: 'Solution Pair', primaryValue: dependent ? 'infinitely many solutions' : 'no solution', metrics: [{ label: 'Determinant', value: '0' }, { label: 'Classification', value: dependent ? 'dependent system' : 'inconsistent system' }], notes: [dependent ? 'Both equations describe the same line.' : 'The equations describe parallel lines.'], warnings: dependent ? [] : ['Zero determinant with mismatched constants means no intersection.'] };
    }
    const x = simplifyFraction(c1 * b2 - c2 * b1, det); const y = simplifyFraction(a1 * c2 - a2 * c1, det);
    return { status: x.text === x.decimal && y.text === y.decimal ? 'exact' : 'approximate', primaryLabel: 'Solution Pair', primaryValue: `(${x.decimal}, ${y.decimal})`, exactLabel: 'Exact Pair', exactValue: `(${x.text}, ${y.text})`, metrics: [{ label: 'Determinant', value: formatNumber(det) }, { label: 'x', value: x.text }, { label: 'y', value: y.text }, { label: 'Classification', value: 'unique solution' }], notes: ['A nonzero determinant indicates one unique intersection.'], warnings: [] };
  }

  if (variant === 'polynomial') {
    const coefficients = inputs.polynomialCoefficients.split(',').map((part) => Number.parseFloat(part.trim())).filter((value) => Number.isFinite(value));
    if (coefficients.length < 2) return { status: 'invalid', primaryLabel: 'P(x)', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['Enter at least two coefficients, separated by commas, to define a polynomial.'] };
    const derivative = derivativeCoefficients(coefficients); const constant = coefficients[coefficients.length - 1];
    return { status: 'exact', primaryLabel: 'P(x)', primaryValue: formatNumber(evaluatePolynomial(coefficients, xValue)), exactLabel: 'Polynomial', exactValue: polynomialToString(coefficients), metrics: [{ label: 'Degree', value: `${coefficients.length - 1}` }, { label: 'Derivative', value: polynomialToString(derivative) }, { label: `P'(${formatNumber(xValue)})`, value: formatNumber(derivative.length ? evaluatePolynomial(derivative, xValue) : 0) }, { label: 'Possible Integer Roots', value: isIntegerLike(constant) ? integerFactors(constant).join(', ') : 'screening skipped' }], notes: ['Coefficient order matters.', 'Possible integer roots still need testing in the polynomial.'], warnings: [] };
  }

  if (variant === 'factoring') {
    if (a === 0) return { status: 'invalid', primaryLabel: 'Factored Form', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['This factoring calculator expects a quadratic expression with a nonzero x^2 coefficient.'] };
    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) return { status: 'special-case', primaryLabel: 'Factored Form', primaryValue: 'not factorable over the reals', metrics: [{ label: 'Discriminant', value: formatNumber(discriminant) }, { label: 'Classification', value: 'complex roots' }], notes: ['A negative discriminant means there is no real linear factorization.'], warnings: ['The expression has complex roots rather than real linear factors.'] };
    const sqrtDisc = Math.sqrt(discriminant); const r1 = simplifyFraction(-b + sqrtDisc, 2 * a); const r2 = simplifyFraction(-b - sqrtDisc, 2 * a);
    return { status: isIntegerLike(sqrtDisc) ? 'exact' : 'special-case', primaryLabel: 'Factored Form', primaryValue: isIntegerLike(sqrtDisc) ? `${formatNumber(a)}(x - ${r1.text})(x - ${r2.text})` : 'not factorable cleanly over the integers', exactLabel: 'Roots', exactValue: `${r1.text} and ${r2.text}`, metrics: [{ label: 'Discriminant', value: formatNumber(discriminant) }, { label: 'Root 1', value: r1.text }, { label: 'Root 2', value: r2.text }, { label: 'Integer-Friendly?', value: isIntegerLike(sqrtDisc) ? 'yes' : 'no' }], notes: ['Roots and factors are two views of the same quadratic structure.'], warnings: isIntegerLike(sqrtDisc) ? [] : ['This quadratic may be irreducible over the integers even though real roots exist.'] };
  }

  if (variant === 'exponent') {
    if (base < 0 && !isIntegerLike(exponent)) return { status: 'invalid', primaryLabel: 'Power Result', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['A negative base with a non-integer exponent may not produce a real-valued result.'] };
    const value = base ** exponent; const sci = scientificNotation(value);
    return { status: isIntegerLike(exponent) ? 'exact' : 'approximate', primaryLabel: 'Power Result', primaryValue: formatNumber(value), exactLabel: 'Scientific Notation', exactValue: sci.text, metrics: [{ label: 'Base', value: formatNumber(base) }, { label: 'Exponent', value: formatNumber(exponent) }, { label: 'Reciprocal Lens', value: exponent < 0 ? `1 / ${formatNumber(base ** Math.abs(exponent))}` : 'not needed' }, { label: 'Result Type', value: isIntegerLike(exponent) ? 'integer-exponent power' : 'fractional-exponent power' }], notes: ['Negative exponents create reciprocals.', 'Fractional exponents connect directly to roots.'], warnings: [] };
  }

  if (variant === 'logarithm') {
    if (base <= 0 || base === 1 || logValue <= 0) return { status: 'invalid', primaryLabel: 'Logarithm Value', primaryValue: 'undefined', metrics: [], notes: [], warnings: ['A real logarithm needs a positive argument and a positive base that is not 1.'] };
    const value = Math.log(logValue) / Math.log(base);
    return { status: isIntegerLike(value) ? 'exact' : 'approximate', primaryLabel: 'Logarithm Value', primaryValue: formatNumber(value), exactLabel: 'Exponential Check', exactValue: `${formatNumber(base)}^${formatNumber(value)} = ${formatNumber(logValue)}`, metrics: [{ label: 'ln(value)', value: formatNumber(Math.log(logValue)) }, { label: 'log10(value)', value: formatNumber(Math.log10(logValue)) }, { label: 'Change of Base', value: `ln(${formatNumber(logValue)}) / ln(${formatNumber(base)})` }], notes: ['A logarithm is the exponent needed on the base to produce the argument.'], warnings: [] };
  }

  if (variant === 'scientific-notation') {
    if (inputs.notationMode === 'decimal-to-scientific') {
      const value = parse(inputs.decimalInput); const sci = scientificNotation(value);
      return { status: 'exact', primaryLabel: 'Converted Value', primaryValue: sci.text, metrics: [{ label: 'Mantissa', value: formatNumber(sci.mantissa) }, { label: 'Exponent', value: `${sci.exponent}` }, { label: 'Original Decimal', value: formatNumber(value, 12) }], notes: ['Positive exponents usually come from moving the decimal left.', 'Negative exponents usually come from moving the decimal right.'], warnings: [] };
    }
    const value = parse(inputs.mantissa) * (10 ** parse(inputs.sciExponent));
    return { status: 'exact', primaryLabel: 'Converted Value', primaryValue: formatNumber(value, 12), exactLabel: 'Scientific Form', exactValue: `${formatNumber(parse(inputs.mantissa))} x 10^${formatNumber(parse(inputs.sciExponent))}`, metrics: [{ label: 'Mantissa', value: formatNumber(parse(inputs.mantissa)) }, { label: 'Exponent', value: formatNumber(parse(inputs.sciExponent)) }, { label: 'Expanded Decimal', value: formatNumber(value, 12) }], notes: ['Normalization usually keeps the mantissa between 1 and 10 in absolute value.'], warnings: [] };
  }

  if (variant === 'square-root') {
    if (radicand < 0) return { status: 'invalid', primaryLabel: 'Square Root', primaryValue: 'not a real value', metrics: [], notes: [], warnings: ['Negative radicands do not produce real square roots.'] };
    const exact = simplifySquareRoot(radicand);
    return { status: exact.exact === exact.decimal ? 'exact' : 'approximate', primaryLabel: 'Square Root', primaryValue: exact.decimal, exactLabel: 'Exact Radical', exactValue: exact.exact, metrics: [{ label: 'Nearest Lower Perfect Square', value: formatNumber(Math.floor(Math.sqrt(radicand)) ** 2) }, { label: 'Nearest Upper Perfect Square', value: formatNumber(Math.ceil(Math.sqrt(radicand)) ** 2) }, { label: 'Radicand', value: formatNumber(radicand) }], notes: ['If the radicand is not a perfect square, the exact answer stays in radical form.'], warnings: [] };
  }

  if (variant === 'cube-root') {
    const exact = simplifyCubeRoot(radicand);
    return { status: exact.exact === exact.decimal ? 'exact' : 'approximate', primaryLabel: 'Cube Root', primaryValue: exact.decimal, exactLabel: 'Exact Radical', exactValue: exact.exact, metrics: [{ label: 'Radicand', value: formatNumber(radicand) }, { label: 'Perfect Cube?', value: isIntegerLike(Math.cbrt(radicand)) ? 'yes' : 'no' }], notes: ['Negative radicands are allowed because odd roots remain real.'], warnings: [] };
  }

  if (variant === 'nth-root') {
    const exact = simplifyNthRoot(radicand, index);
    if (exact.exact === 'not a real value' || exact.exact === 'invalid') return { status: 'invalid', primaryLabel: 'Nth Root', primaryValue: 'not a real value', metrics: [], notes: [], warnings: ['Even roots of negative radicands are not real, and the index must be at least 2.'] };
    return { status: exact.exact === exact.decimal ? 'exact' : 'approximate', primaryLabel: 'Nth Root', primaryValue: exact.decimal, exactLabel: 'Exact Radical', exactValue: exact.exact, metrics: [{ label: 'Index', value: `${index}` }, { label: 'Radicand', value: formatNumber(radicand) }, { label: 'Odd or Even Index', value: index % 2 === 0 ? 'even' : 'odd' }], notes: ['Higher-order roots follow the same inverse-power idea as square and cube roots, but the index changes the domain rules.'], warnings: [] };
  }

  return { status: 'exact', primaryLabel: 'Absolute Value', primaryValue: formatNumber(Math.abs(absoluteInput)), metrics: [{ label: 'Distance from Zero', value: formatNumber(Math.abs(absoluteInput)) }, { label: 'Original Sign', value: absoluteInput < 0 ? 'negative' : absoluteInput > 0 ? 'positive' : 'zero' }, { label: 'Opposite Value', value: formatNumber(-absoluteInput) }, { label: 'Piecewise Lens', value: absoluteInput >= 0 ? '|x| = x' : '|x| = -x' }], notes: ['Absolute value keeps magnitude while removing direction on the number line.'], warnings: [] };
}
