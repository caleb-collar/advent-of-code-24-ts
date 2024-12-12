import { Position } from '../../util/types.ts';
import {
  ArrExt,
  bold,
  colors,
  reset,
  UndirectedGraph,
} from '../../util/util.ts';

const title = 'Hoof It 🦌';

const dayTen = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const topoMap = new UndirectedGraph(lines);
  const starts = findStarts(topoMap);
  const trails = getAllTrails(topoMap, starts);
  console.log('Num starts: ', starts.length);
  console.log(
    '❄ TRAIL SCORE SUM: ',
    ArrExt.sum(trails.map((t) => t.trailScore)),
  );
  console.log('❄ pt2: ');
};

const findStarts = (graph: UndirectedGraph) => {
  const positions: Position[] = [];
  graph.forEachNode((val, pos) => {
    if (val === '0') {
      positions.push(pos);
    }
  });
  return positions;
};

const validMovements = (graph: UndirectedGraph, position: Position) => {
  const moves: Position[] = [];
  const value = Number(graph.charAt(position));
  const adjacentPositions = graph.getCardinalAdjacentPositions(position);

  adjacentPositions.forEach((pos) => {
    if (graph.isInBounds(pos)) {
      const adjValue = Number(graph.charAt(pos));
      if (
        !isNaN(adjValue) && (adjValue === value + 1)
      ) {
        moves.push(pos);
      }
    }
  });

  return moves;
};

const findPaths = (graph: UndirectedGraph, start: Position) => {
  const paths: Position[][] = [];
  const stack: { pos: Position; path: Position[] }[] = [{
    pos: start,
    path: [start],
  }];

  while (stack.length > 0) {
    const { pos, path } = stack.pop()!;
    const value = graph.charAt(pos);

    if (value === '9') {
      paths.push(path);
      continue;
    }

    const moves = validMovements(graph, pos);
    moves.forEach((move) => {
      if (!path.some((p) => p.row === move.row && p.col === move.col)) {
        stack.push({ pos: move, path: [...path, move] });
      }
    });
  }

  const terminuses = paths.map((path) => path[path.length - 1]);
  const trailScore = graph.sumUniquePositions(terminuses);

  return { paths, trailScore };
};

const getAllTrails = (graph: UndirectedGraph, starts: Position[]) => {
  const trails: ReturnType<typeof findPaths>[] = [];
  starts.forEach((start) => {
    trails.push(findPaths(graph, start));
  });
  return trails;
};

export default dayTen;
