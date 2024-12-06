import { Position } from '../../util/types.ts';
import { bold, colors, reset, UndirectedGraph } from '../../util/util.ts';

const title = 'Guard Gallivant 💂‍';

const daySix = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const graph = new UndirectedGraph(lines);
  console.log(getStartPos(graph));

  console.log('❄ DISTINCT POSITIONS: ');
  console.log('❄ pt2: ');
};

const getStartPos = (graph: UndirectedGraph): Position => {
  const guard = new Set(['<', '>', '^', 'v']);
  const row = graph.data.findIndex(r => r.some(c => guard.has(c)));
  const col = graph.data[row]?.findIndex(c => guard.has(c)) ?? -1;
  return row >= 0 && col >= 0 ? { row, col } : { row: 0, col: 0 };
}

export default daySix;
