import Kia from 'https://deno.land/x/kia@0.4.1/mod.ts';
import spinners from '../../util/spinners.ts';
import { Direction, Position } from '../../util/types.ts';
import { bold, colors, reset, UndirectedGraph } from '../../util/util.ts';

type Guard = { pos: Position; dir: Direction };

const title = 'Guard Gallivant 💂‍';

const daySix = async (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const graph = new UndirectedGraph(lines);
  const referenceGraph = new UndirectedGraph(lines);
  const initialPosition = getStartPos(graph);
  const solution = findPath(graph, initialPosition);
  //console.log(graph.printHighlighted(solution.path));
  //console.log(graph.printHighlighted(loopObstaclePositions));

  console.log(
    '❄ DISTINCT POSITIONS ON PATH: ',
    sumUniquePositions(solution.path),
  );
  const spinner = new Kia({ text: 'Computing...', spinner: spinners.arc });
  spinner.start();
  const result = await calculateObstaclePositionsForLoop(
    referenceGraph,
    initialPosition,
    solution.path,
  );
  spinner.stop();
  console.log(
    '❄ POSSIBLE NEW OBSTACLE POSITIONS FOR LOOPS: ',
    sumUniquePositions(result),
  );
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
  const seen = new Map<string, Set<Direction>>();

  while (true) {
    const pos = updatePos(graph, guard);
    path.push(pos);

    const key = graph.toString(pos);
    const dirs = seen.get(key) ?? seen.set(key, new Set()).get(key)!;
    if (dirs.has(guard.dir)) return { path, loop: true };
    dirs.add(guard.dir);

    graph.setNode(
      pos,
      '^v<>'[['up', 'down', 'left', 'right'].indexOf(guard.dir)],
    );

    const [dx, dy] = guard.dir === 'down'
      ? [1, 0]
      : guard.dir === 'up'
      ? [-1, 0]
      : guard.dir === 'right'
      ? [0, 1]
      : [0, -1];

    if (!graph.isInBounds({ row: pos.row + dx, col: pos.col + dy })) {
      return { path, loop: false };
    }

    if (
      graph.toString(pos) === graph.toString(startGuard.pos) &&
      guard.dir === startGuard.dir &&
      path.length > 1
    ) {
      return { path, loop: true };
    }
  }
};

const calculateObstaclePositionsForLoop = async (
  graph: UndirectedGraph,
  start: Guard,
  path: Position[],
): Promise<Position[]> => {
  const positions = path.filter(
    (pos) => !(pos.row === start.pos.row && pos.col === start.pos.col),
  );
  const results: (Position | null)[] = [];
  for (const pos of positions) {
    // Add small delay to prevent blocking
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      const newGraph = new UndirectedGraph(
        graph.data.map((row) => row.join('')),
      );
      newGraph.setNode(pos, '#');
      const result = findPath(newGraph, start).loop ? pos : null;
      results.push(result);
    } catch {
      results.push(null);
    }
  }
  return results.filter((pos): pos is Position => pos !== null);
};

const sumUniquePositions = (path: Position[]) =>
  new Set(path.map((pos) => `${pos.row},${pos.col}`)).size;

export default daySix;
