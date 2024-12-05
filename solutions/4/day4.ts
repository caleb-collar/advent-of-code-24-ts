import { Position } from '../../util/types.ts';
import { colors, Graph, reset } from '../../util/util.ts';

const title = 'Ceres Search 🛰️';

const dayFour = (lines: string[]) => {
  console.log(`${colors[3]}${title}${reset}`);
  const graph = new Graph(lines);
  const foundWordsXmas = wordSearch(graph, 'XMAS');
  const foundWordsMas = wordSearch(graph, 'MAS');
  const intersections = identifyXIntersections(foundWordsMas);

  console.log('❄ WORD SEARCH RESULTS: ', foundWordsXmas.length);
  console.log('❄ "X" INTERSECTION COUNT: ', intersections.length);
};

// This function is nice to visualize the graph with matches.
// deno-lint-ignore no-unused-vars
const printHighlightedGraph = (graph: Graph, positions: Position[]) =>
  console.log(
    graph.data.map((row, i) =>
      row.map((char, j) =>
        positions.some((p) => p.row === i && p.col === j)
          ? `${colors[1]}${char}${reset}`
          : char
      ).join('')
    ).join('\n'),
  );

const identifyXIntersections = (foundWords: Position[][]): Position[][] => {
  const isDiagonal = (p: Position[]) =>
    p.length > 1 &&
    Math.abs((p[1].row - p[0].row) / (p[1].col - p[0].col)) === 1;

  return foundWords.flatMap((seq1, i) =>
    foundWords.slice(i + 1)
      .filter((seq2) =>
        seq1.length === seq2.length &&
        isDiagonal(seq1) &&
        isDiagonal(seq2) &&
        ((seq1[1].row - seq1[0].row) / (seq1[1].col - seq1[0].col)) !==
          ((seq2[1].row - seq2[0].row) / (seq2[1].col - seq2[0].col)) &&
        seq1[Math.floor(seq1.length / 2)].row ===
          seq2[Math.floor(seq2.length / 2)].row &&
        seq1[Math.floor(seq1.length / 2)].col ===
          seq2[Math.floor(seq2.length / 2)].col
      )
      .map((seq2) => [...seq1, ...seq2])
  );
};

const identifyWord = (
  graph: Graph,
  word: string,
  startPos: Position,
): Position[][] =>
  Graph.directions.flatMap(([dx, dy]) =>
    [-1, 1].flatMap((direction) => {
      const positions = [...Array(word.length)].map((_, i) => ({
        row: startPos.row + i * dx * direction,
        col: startPos.col + i * dy * direction,
      }));

      const isValid = positions.every((pos, i) =>
        graph.isInBounds(pos) &&
        graph.charAt(pos) === word[direction === 1 ? i : word.length - 1 - i]
      );

      return isValid ? [positions] : [];
    })
  );

const wordSearch = (graph: Graph, word: string): Position[][] =>
  [...Array(graph.data.length)].flatMap((_, row) =>
    [...Array(graph.data[0].length)].map((_, col) => ({ row, col }))
  )
    .filter((pos) => graph.charAt(pos) === word[0])
    .flatMap((pos) => identifyWord(graph, word, pos));

export default dayFour;
