import Kia from 'https://deno.land/x/kia@0.4.1/mod.ts';
import spinners from '../../util/spinners.ts';
import { ArrExt, bold, colors, reset } from '../../util/util.ts';

const title = 'Bridge Repair 🌉';

type Calibration = {
  outcome: number;
  operands: number[];
  valid?: boolean;
  expressions?: string[];
};

type Operator = string;

type OperatorConfig = Record<Operator, (a: number, b: number) => number>;

const operationCache = new Map<string, number>();

const partOneOperators: OperatorConfig = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b,
};

const partTwoOperators: OperatorConfig = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b,
  '||': (a, b) => Number(`${a}${b}`),
};

const daySeven = async (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const calibrationsPartOne = lines.map(getOutcomeAndOperands);
  const calibrationsPartTwo = [...calibrationsPartOne]; // Create copy for part two
  const spinner = new Kia({ text: 'Computing...', spinner: spinners.arc });

  spinner.start();
  const partOneTestResults = await testAllOperators(
    calibrationsPartOne,
    partOneOperators,
  );
  const sumValidPartOne = ArrExt.sum(
    partOneTestResults.map((c) => c.valid ? c.outcome : 0),
  );
  spinner.stop();
  console.log('❄ SUM OF VALID CALIBRATION RESULTS: ', sumValidPartOne);

  spinner.start();
  const partTwoTestResults = await testAllOperators(
    calibrationsPartTwo,
    partTwoOperators,
  );
  const sumValidPartTwo = ArrExt.sum(
    partTwoTestResults.map((c) => c.valid ? c.outcome : 0),
  );
  spinner.stop();
  console.log('❄ SUM OF VALID CALIBRATION RESULTS WITH: ', sumValidPartTwo);
};

const getOutcomeAndOperands = (line: string): Calibration => {
  const [outcome, rawOperands] = line.split(':');
  const operands = rawOperands.trim().split(' ').map(Number);
  return { outcome: Number(outcome), operands };
};

const evaluateExpression = (
  operands: number[],
  ops: Operator[],
  operators: OperatorConfig,
): number => {
  const cacheKey = operands.join(',') + ops.join(',');
  const cached = operationCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let result = operands[0];
  for (let i = 0; i < ops.length; i++) {
    result = operators[ops[i]](result, operands[i + 1]);
  }

  operationCache.set(cacheKey, result);
  return result;
};

const buildAndTestExpression = (
  operands: number[],
  target: number,
  operators: OperatorConfig,
): [boolean, string[]] => {
  const ops = Object.keys(operators);
  const n = operands.length;
  const stack = new Array(n - 1).fill(0);
  const currentOps: Operator[] = new Array(n - 1);
  let i = 0;

  while (i >= 0) {
    if (stack[i] < ops.length) {
      if (i === n - 2) {
        for (let j = 0; j < n - 1; j++) {
          currentOps[j] = ops[stack[j]];
        }

        const result = evaluateExpression(operands, currentOps, operators);
        if (result === target) {
          const expr = operands.reduce(
            (acc, op, idx) =>
              idx === 0 ? String(op) : `${acc} ${currentOps[idx - 1]} ${op}`,
            '',
          );
          return [true, [expr]];
        }
        stack[i]++;
      } else {
        i++;
        stack[i] = 0;
      }
    } else {
      stack[i] = 0;
      i--;
      if (i >= 0) stack[i]++;
    }
  }

  return [false, []];
};

const testAllOperators = async (
  calibrations: Calibration[],
  operators: OperatorConfig = partTwoOperators,
): Promise<Calibration[]> => {
  const results = new Array<Calibration>(calibrations.length);

  for (let i = 0; i < calibrations.length; i++) {
    // Add small delay to prevent blocking
    await new Promise((resolve) => setTimeout(resolve, 0));
    const calibration = calibrations[i];
    if (calibration.valid) {
      results[i] = calibration;
      continue;
    }

    const [valid, expressions] = buildAndTestExpression(
      calibration.operands,
      calibration.outcome,
      operators,
    );

    calibration.valid = valid;
    calibration.expressions = expressions;
    results[i] = calibration;
  }

  return Promise.resolve(results);
};

export default daySeven;
