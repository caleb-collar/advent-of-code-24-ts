import { ArrExt, bold, colors, reset } from '../../util/util.ts';

const title = 'Bridge Repair 🌉';

type Calibration = {
  outcome: number;
  operands: string[];
  valid?: boolean;
  expressions?: string[];
};

type Operator = '+' | '*';

type Token = number | Operator;

const operatorPrecedence: Record<Operator, number> = {
  '*': 2,
  '+': 1,
};

const operations: Record<Operator, (a: number, b: number) => number> = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b,
};

const daySeven = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  const calibrations = lines.map(getOutcomeAndOperands);
  const testResults = testAllOperators(calibrations);
  const sumValid = ArrExt.sum(testResults.map((c) => c.valid ? c.outcome : 0));
  console.log('❄ SUM OF VALID CALIBRATION RESULTS: ', sumValid);
  console.log('❄ pt2: ');
};

const getOutcomeAndOperands = (line: string): Calibration => {
  const [outcome, RawOperands] = line.split(':');
  const operands = RawOperands.trim().split(' ');
  return { outcome: Number(outcome), operands };
};

const tokenize = (expression: string): Token[] => {
  const tokens = expression.match(/(\d+|[\+\-\*\/])/g);
  if (!tokens) throw new Error('Invalid expression format');

  return tokens.map((token) =>
    /\d+/.test(token) ? Number(token) : token as Operator
  );
};

const evaluateOperations = (
  tokens: Token[],
  precedence?: number,
): Token[] => {
  if (tokens.length <= 1) return tokens;

  // Find first valid operator position
  const opIndex = tokens.findIndex((_, i) =>
    i % 2 === 1 && (!precedence ||
      operatorPrecedence[tokens[i] as Operator] === precedence)
  );

  if (opIndex === -1) return tokens;

  const op = tokens[opIndex] as Operator;
  const left = tokens[opIndex - 1] as number;
  const right = tokens[opIndex + 1] as number;
  const result = operations[op](left, right);

  return [
    ...tokens.slice(0, opIndex - 1),
    result,
    ...tokens.slice(opIndex + 2),
  ];
};

const evaluateExpression = (expression: string): number => {
  let tokens = tokenize(expression);
  while (tokens.length > 1) {
    tokens = evaluateOperations(tokens);
  }
  return tokens[0] as number;
};

const buildExpressions = (operands: string[]): string[] => {
  const buffer: (string | Operator)[] = new Array(operands.length * 2 - 1);
  const expressions: string[] = [];

  const build = (pos = 0, depth = 0) => {
    buffer[pos] = operands[depth];
    if (depth === operands.length - 1) {
      return expressions.push(buffer.slice(0, pos + 1).join(' '));
    }
    (Object.keys(operations) as Operator[]).forEach(
      (op) => (buffer[pos + 1] = op, build(pos + 2, depth + 1)),
    );
  };

  build();
  return expressions;
};

const testAllOperators = (calibrations: Calibration[]) => {
  return calibrations.filter((c) => !c.valid).map((calibration) => {
    const { outcome, operands } = calibration;
    const expressions = buildExpressions(operands);
    const results = expressions.map(evaluateExpression);
    calibration.valid = results.includes(outcome);
    calibration.expressions = expressions.filter((_, i) =>
      results[i] === outcome
    );
    return calibration;
  });
};

export default daySeven;
