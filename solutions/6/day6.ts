import { Direction, Position } from '../../util/types.ts';
import { bold, colors, reset, UndirectedGraph } from '../../util/util.ts';

type Guard = { pos: Position; dir: Direction };

const title = 'Guard Gallivant 💂‍';

const daySix = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const graph = new UndirectedGraph(lines);
  const initialPosition = getStartPos(graph);
  const path = findPath(graph, initialPosition);
  console.log(graph.printHighlighted(path));

  console.log('❄ DISTINCT POSITIONS: ', sumUniquePositions(path));
  console.log('❄ pt2: ');
};

const getStartPos = (graph: UndirectedGraph): Guard => {
  const guard = new Map([['<', 'left'], ['>', 'right'], ['^', 'up'], [
    'v',
    'down',
  ]]);
  const [row, col] = graph.data.reduce((acc, r, i) => {
    const j = r.findIndex((c) => guard.has(c));
    return j >= 0 ? [i, j] : acc;
  }, [0, 0]);

  return {
    pos: { row, col },
    dir: guard.get(graph.data[row][col]) as Direction ?? 'up',
  };
};

const updatePos = (graph: UndirectedGraph, guard: Guard): Position => {
  const deltas = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  const nextPos = {
    row: guard.pos.row + deltas[guard.dir][0],
    col: guard.pos.col + deltas[guard.dir][1],
  };

  if (!graph.isInBounds(nextPos) || graph.charAt(nextPos) === '#') {
    guard.dir = {
      up: 'right',
      right: 'down',
      down: 'left',
      left: 'up',
    }[guard.dir] as Direction;
    return guard.pos;
  }

  return (guard.pos = nextPos);
};

const findPath = (graph: UndirectedGraph, startGuard: Guard) => {
  const path = [startGuard.pos];
  const guard = { ...startGuard };

  while (true) {
    const pos = updatePos(graph, guard);
    path.push(pos);

    graph.setNode(
      pos,
      '^v<>'[['up', 'down', 'left', 'right'].indexOf(guard.dir)],
    );

    const { row, col, dir } = { ...pos, dir: guard.dir };
    const next = {
      row: row + (dir === 'down' ? 1 : dir === 'up' ? -1 : 0),
      col: col + (dir === 'right' ? 1 : dir === 'left' ? -1 : 0),
    };

    if (
      !graph.isInBounds(next) ||
      (graph.toString(pos) === graph.toString(startGuard.pos) &&
        dir === startGuard.dir && path.length > 1)
    ) break;
  }

  return path;
};

const sumUniquePositions = (path: Position[]) => {
  const uniquePositions = new Set(path.map((pos) => `${pos.row},${pos.col}`));
  return uniquePositions.size;
};

export default daySix;
