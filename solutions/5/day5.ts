import { bold, colors, reset } from '../../util/util.ts';

const title = 'Print Queue 🖨️';

const dayFive = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  const validRulesAndUpdates = checkUpdatesValid(getRulesAndUpdates(lines));
  const updateMidSum = sumValidMiddleValues(validRulesAndUpdates);

  console.log('❄ VALID UPDATES MIDDLE SUM: ', updateMidSum);
  console.log('❄ P2: ');
};

const getRulesAndUpdates = (
  lines: string[],
) => {
  const splitIndex = lines.findIndex((line) => line === '');
  return {
    rules: lines.slice(0, splitIndex).map((r) => r.split('|').map(Number)),
    updates: lines.slice(splitIndex + 1).map((u) => u.split(',').map(Number)),
  };
};

const checkUpdatesValid = ({
  rules,
  updates,
}: ReturnType<typeof getRulesAndUpdates>) =>
  updates.map((update) => ({
    valid: rules
      .filter(([a, b]) => update.includes(a) && update.includes(b))
      .every(([a, b]) => update.indexOf(a) < update.indexOf(b)),
    update,
  }));

const sumValidMiddleValues = (entries: ReturnType<typeof checkUpdatesValid>) =>
  entries
    .filter(({ valid }) => valid)
    .reduce((sum, { update }) => sum + update[~~(update.length / 2)], 0);

export default dayFive;
