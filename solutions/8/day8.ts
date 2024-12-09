import { Position } from '../../util/types.ts';
import { bold, colors, reset, UndirectedGraph } from '../../util/util.ts';
import { AntinodeType, Node, nodeAntinodeMap, NodeType } from './day8types.ts';

const title = 'Resonant Collinearity 📡';

const dayEight = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);

  const graph = new UndirectedGraph(lines);
  const nodes = getNodes(graph);
  const antinodes = calculateAntinodes(graph, nodes);
  const uniqueCount = graph.sumUniquePositions(Object.values(antinodes).flat());
  const antinodeHarmonics = calculateAntinodes(graph, nodes, true);
  const uniqueHarmonicsCount = graph.sumUniquePositions(
    Object.values(antinodeHarmonics).flat(),
  );

  console.log('❄ UNIQUE ANTINODE LOCATIONS: ', uniqueCount);
  console.log('❄ UNIQUE ANTINODE HARMONICS LOCATIONS: ', uniqueHarmonicsCount);
};

const getNodes = (graph: UndirectedGraph) => {
  const { rows, cols } = graph.getDimensions();
  const nodes: Record<string, Position[]> = {};

  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      const pos = { col: x, row: y };
      const char = graph.charAt(pos);

      if (/^[A-Za-z0-9]$/.test(char)) {
        (nodes[char] ??= []).push(pos);
      }
    }
  }

  return nodes as Record<NodeType, Position[]>;
};

const isValidPosition = (
  pos: Position,
  rows: number,
  cols: number,
): boolean => {
  const { col, row } = pos;
  return col >= 0 && col < cols && row >= 0 && row < rows;
};

const addAntinode = (
  antinodes: Record<AntinodeType, Position[]>,
  antinode: AntinodeType,
  pos: Position,
  rows: number,
  cols: number,
): void => {
  if (isValidPosition(pos, rows, cols)) {
    (antinodes[antinode] ??= []).push(pos);
  }
};

const calculateAntinodes = (
  graph: UndirectedGraph,
  nodes: Node,
  harmonics = false,
) => {
  const antinodes = {} as Record<AntinodeType, Position[]>;
  const { rows, cols } = graph.getDimensions();

  Object.entries(nodes).forEach(([node, positions]) => {
    const antinode = nodeAntinodeMap[node as NodeType];

    if (harmonics) {
      positions.forEach((pos) =>
        addAntinode(antinodes, antinode, pos, rows, cols)
      );
    }

    positions.forEach((pos1, i) => {
      positions.slice(i + 1).forEach((pos2) => {
        const dx = pos2.col - pos1.col;
        const dy = pos2.row - pos1.row;

        if (harmonics) {
          for (let scale = -1;; scale--) {
            const pos = {
              col: pos1.col + (dx * scale),
              row: pos1.row + (dy * scale),
            };
            if (!isValidPosition(pos, rows, cols)) break;
            addAntinode(antinodes, antinode, pos, rows, cols);
          }
          for (let scale = 1;; scale++) {
            const pos = {
              col: pos2.col + (dx * scale),
              row: pos2.row + (dy * scale),
            };
            if (!isValidPosition(pos, rows, cols)) break;
            addAntinode(antinodes, antinode, pos, rows, cols);
          }
        } else {
          addAntinode(
            antinodes,
            antinode,
            {
              col: pos1.col - dx,
              row: pos1.row - dy,
            },
            rows,
            cols,
          );
          addAntinode(
            antinodes,
            antinode,
            {
              col: pos2.col + dx,
              row: pos2.row + dy,
            },
            rows,
            cols,
          );
        }
      });
    });
  });

  return antinodes;
};

export default dayEight;
