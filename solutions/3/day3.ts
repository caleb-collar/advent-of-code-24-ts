import { colors, reset } from '../../util/util.ts';

const dayThree = (lines: string[]) => {
  console.log(`${colors[3]}Mull It Over 🧮${reset}`);

  const total = getTotal(getMulMatches(lines.join()));

  console.log('❄ INSTRUCTION RESULTS: ', total);
  console.log('❄ CONDITIONAL INSTRUCTION RESULTS: ');
};

const getMulMatches = (input: string) => {
  const mulRegex = /mul\((\d+),(\d+)\)/g;
  return input.matchAll(mulRegex);
};

const getTotal = (matches: RegExpStringIterator<RegExpExecArray>) => {
  return matches.reduce(
    (acc, match) => acc + (Number(match[1]) * Number(match[2])),
    0,
  );
};

export default dayThree;
