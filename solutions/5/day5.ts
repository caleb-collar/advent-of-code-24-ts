import { bold, colors, reset } from '../../util/util.ts';

const title = 'Print Queue 🖨️';

const dayFive = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  console.log(getRulesAndPages(lines));

  console.log('❄ PAGE ORDER SUM: ');
  console.log('❄ : ');
};

const getRulesAndPages = (
  lines: string[],
): { rules: string[]; pages: string[] } => {
  const splitIndex = lines.findIndex((line) => line === '');
  return {
    rules: lines.slice(0, splitIndex),
    pages: lines.slice(splitIndex + 1).flatMap((p) => p.split(',')),
  };
};

export default dayFive;
