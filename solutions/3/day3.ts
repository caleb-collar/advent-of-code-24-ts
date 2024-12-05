import { bold, colors, reset } from '../../util/util.ts';

type Instruction = {
  operation: 'mul' | 'do' | "don't";
  values?: [number, number];
  index: number;
};

const title = 'Mull It Over 🧮';

const dayThree = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const input = lines.join();
  const mulInstructions = matchMul(input);
  const doDontInstructions = matchDoDont(input);
  const allInstructions = mulInstructions.concat(doDontInstructions).sort((
    a,
    b,
  ) => a.index - b.index);

  console.log('❄ INSTRUCTION RESULTS: ', getTotal(mulInstructions));
  console.log('❄ CONDITIONAL INSTRUCTION RESULTS: ', getTotal(allInstructions));
};

const matchMul = (input: string) => {
  const mulRegex = /mul\((\d+),(\d+)\)/g;
  return [...input.matchAll(mulRegex)].map((
    m,
  ) => ({
    operation: m[0].split('(')[0] as 'mul',
    values: [Number(m[1]), Number(m[2])],
    index: m.index!,
  })) as Instruction[];
};

const matchDoDont = (input: string) => {
  const doDontOperatorRegex = /do\(\)|don't\(\)/g;
  return [...input.matchAll(doDontOperatorRegex)].map((
    m,
  ) => ({
    operation: m[0].split('(')[0] as 'do' | "don't",
    index: m.index!,
  })) as Instruction[];
};

const getTotal = (instructions: Instruction[]): number => {
  let enabled = true;
  const total = instructions.reduce((acc, instruction) => {
    enabled = instruction.operation === 'do' ||
      (instruction.operation !== "don't" && enabled);
    return instruction.operation === 'mul' && enabled && instruction.values
      ? acc + instruction.values[0] * instruction.values[1]
      : acc;
  }, 0);
  return total;
};

export default dayThree;
