import { Position } from '../../util/types.ts';
import { bold, colors, reset, UndirectedGraph } from '../../util/util.ts';

const title = 'Garden Groups 🌻';

type Region = {
  char: string;
  positions: Position[];
  area: number;
  perimeter: number;
  price: number;
};

// Flood fill algorithm to find all regions in the graph
const findRegions = (graph: UndirectedGraph): Region[] => {
  const visited = new Set<string>();
  const regions: Region[] = [];

  const exploreRegion = (start: Position, char: string): Position[] => {
    const positions: Position[] = [];
    const queue: Position[] = [start];

    while (queue.length > 0) {
      const pos = queue.shift()!;
      const key = graph.toString(pos);

      if (visited.has(key)) continue;
      visited.add(key);
      positions.push(pos);

      // Check only cardinal directions (not diagonals)
      graph.getCardinalAdjacentPositions(pos)
        .filter((adj) =>
          graph.isInBounds(adj) &&
          graph.charAt(adj) === char &&
          !visited.has(`${adj.row},${adj.col}`)
        )
        .forEach((adj) => queue.push(adj));
    }

    return positions;
  };

  const calculatePerimeter = (positions: Position[]): number => {
    let perimeter = 0;
    const posSet = new Set(positions.map((p) => graph.toString(p)));

    for (const pos of positions) {
      // Check each cardinal direction
      graph.getCardinalAdjacentPositions(pos).forEach((adj) => {
        // If adjacent position is out of bounds or different char, count as perimeter
        if (!graph.isInBounds(adj) || !posSet.has(`${adj.row},${adj.col}`)) {
          perimeter++;
        }
      });
    }

    return perimeter;
  };

  // Find all regions
  graph.forEachNode((char, pos) => {
    const key = graph.toString(pos);
    if (!visited.has(key)) {
      const positions = exploreRegion(pos, char);
      const area = positions.length;
      const perimeter = calculatePerimeter(positions);
      regions.push({
        char,
        positions,
        area,
        perimeter,
        price: area * perimeter,
      });
    }
  });

  return regions;
};

const dayTwelve = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  const graph = new UndirectedGraph(lines);
  const regions = findRegions(graph);
  const totalPrice = regions.reduce((sum, region) => sum + region.price, 0);
  console.log('❄ TOTAL FENCING PRICE:', totalPrice);
  console.log('❄ pt2: ');
};

export default dayTwelve;
