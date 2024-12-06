import { bold, colors, DirectedGraph, reset } from '../../util/util.ts';

const title = 'Print Queue 🖨️';

const dayFive = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  const { rules, updates } = getRulesAndUpdates(lines);
  const validUpdates = checkUpdatesValid({ rules, updates });
  const updateMidSum = sumValidMiddleValues(validUpdates);
  const reorderedUpdates = reorderUpdates(rules, validUpdates);
  const reorderedUpdateMidSum = sumValidMiddleValues(reorderedUpdates);
  console.log('❄ VALID UPDATES MIDDLE SUM: ', updateMidSum);
  console.log('❄ REORDERED UPDATES MIDDLE SUM: ', reorderedUpdateMidSum);
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

const reorderUpdates = (
  rules: number[][],
  entries: ReturnType<typeof checkUpdatesValid>,
) =>
  entries
    .filter(({ valid }) => !valid)
    .map(({ update }) => {
      const graph = new DirectedGraph<number>()
        .tap((g) => update.forEach((n) => g.addNode(n.toString(), n)))
        .tap((g) =>
          rules
            .filter(([a, b]) => update.includes(a) && update.includes(b))
            .forEach(([a, b]) => g.addEdge(a.toString(), b.toString()))
        );

      const { sorted } = graph.topologicalSort(update.map((n) => n.toString()));

      return {
        valid: true,
        update: sorted.map((key) => graph.getValue(key)!),
      };
    });

const sumValidMiddleValues = (entries: ReturnType<typeof checkUpdatesValid>) =>
  entries
    .filter(({ valid }) => valid)
    .reduce((sum, { update }) => sum + update[~~(update.length / 2)], 0);

export default dayFive;
