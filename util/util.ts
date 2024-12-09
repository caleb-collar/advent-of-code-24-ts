import { AdventOfCodeDay, NumberInfo, Position } from './types.ts';

export const colors = [
  '\x1b[38;5;160m', // Deep Red 0
  '\x1b[38;5;196m', // Bright Red 1
  '\x1b[38;5;22m', // Dark Green 2
  '\x1b[38;5;157m', // Light Green 3
  '\x1b[33m', // Gold 4
  '\x1b[37m', // White 5
] as const;
export const bold = '\x1b[1m' as const;
export const reset = '\x1b[0m' as const;

export const safeRegexPatternFrom = (input: string | string[]): string => {
  // Escape special regex characters
  const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Convert input to array if it's a string
  const terms = Array.isArray(input) ? input : [input];

  // Escape each term and join with |
  return terms.map(escapeRegExp).join('|');
};

export class ArrExt<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
  }

  /**
   * Checks if the array is sorted in ascending order.
   * @param {T[]} arr - The array to check.
   * @returns {boolean} True if the array is sorted in ascending order, otherwise false.
   */
  static isAscending<T>(arr: T[]): boolean {
    return arr.every((value, index) => index === 0 || value >= arr[index - 1]);
  }

  /**
   * Checks if the array is sorted in descending order.
   * @param {T[]} arr - The array to check.
   * @returns {boolean} True if the array is sorted in descending order, otherwise false.
   */
  static isDescending<T>(arr: T[]): boolean {
    return arr.every((value, index) => index === 0 || value <= arr[index - 1]);
  }

  /**
   * Calculates the sum of the array elements.
   * @param {Array<number | string>} arr - The array to sum.
   * @returns {number} The sum of the array elements.
   */
  static sum(arr: Array<number | string>): number {
    return arr.reduce<number>(
      (sum, num) =>
        sum +
        (typeof num === 'string'
          ? parseInt(num, 10)
          : num as unknown as number),
      0,
    );
  }
}

//TODO: Make this similar to DirectedGraph<T>
/** Graph class for characters with utility methods */
export class UndirectedGraph {
  public data: string[][];

  /** Eight possible directions for adjacent positions (diagonals included) */
  static directions = [
    [-1, -1], // top-left
    [-1, 0], // top
    [-1, 1], // top-right
    [0, -1], // left
    [0, 1], // right
    [1, -1], // bottom-left
    [1, 0], // bottom
    [1, 1], // bottom-right
  ] as const;

  /** Creates a graph from an array of strings */
  constructor(lines: string[]) {
    this.data = lines.map((line) => line.trim().split(''));
  }

  /** Converts position to string format "row,col" */
  toString(pos: Position): string {
    return `${pos.row},${pos.col}`;
  }

  /** Returns all eight adjacent positions (including diagonals) */
  getAdjacentPositions(pos: Position): Position[] {
    return UndirectedGraph.directions.map(([dx, dy]) => ({
      row: pos.row + dx,
      col: pos.col + dy,
    }));
  }

  sumUniquePositions = (path: Position[]) =>
    new Set(path.map((pos) => `${pos.row},${pos.col}`)).size;

  getDimensions(): { rows: number; cols: number } {
    return { rows: this.data.length, cols: this.data[0].length };
  }

  /** Checks if a position is within grid boundaries */
  isInBounds(pos: Position): boolean {
    return pos.row >= 0 && pos.row < this.data.length &&
      pos.col >= 0 && pos.col < this.data[0].length;
  }

  /** Returns character at given position */
  charAt(pos: Position): string {
    return this.data[pos.row][pos.col];
  }

  /**
   * Sets the character/unicode at given position
   * @param pos Position to update
   * @param value Character or unicode to set
   * @returns this (for method chaining)
   * @throws Error if position is out of bounds or invalid character
   */
  setNode(pos: Position, value: string): UndirectedGraph {
    if (!this.isInBounds(pos)) {
      throw new Error(`Position ${this.toString(pos)} is out of bounds`);
    }

    // Allow emoji/unicode or require single char
    if (!/^\p{Extended_Pictographic}$|^.$|^\p{Emoji}$/u.test(value)) {
      throw new Error('Value must be a single character or emoji');
    }

    this.data[pos.row][pos.col] = value;
    return this;
  }

  /** Checks if position has any adjacent symbol */
  hasAdjacentSymbol(pos: Position): boolean {
    return this.getAdjacentPositions(pos)
      .some((adjPos) =>
        this.isInBounds(adjPos) && this.isSymbol(this.charAt(adjPos))
      );
  }

  /** Checks if character is a symbol (not a digit or period) */
  isSymbol(char: string): boolean {
    return char !== '.' && !this.isDigit(char);
  }

  /** Checks if character is a digit */
  isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  /**
   * Finds complete number at given position and its occupied positions
   * Returns null if position doesn't contain a digit
   */
  getNumberAt(start: Position): NumberInfo | null {
    if (!this.isInBounds(start) || !this.isDigit(this.charAt(start))) {
      return null;
    }

    // Find leftmost digit of the number
    let col = start.col;
    while (col > 0 && this.isDigit(this.data[start.row][col - 1])) col--;

    let num = '';
    const positions = new Set<string>();

    // Collect all digits and their positions
    while (
      col < this.data[0].length && this.isDigit(this.data[start.row][col])
    ) {
      num += this.data[start.row][col];
      positions.add(this.toString({ row: start.row, col }));
      col++;
    }

    return { value: parseInt(num), positions };
  }

  printHighlighted(
    positions: Position[],
    color: number = 1,
    padding: number = 1,
  ): void {
    console.log(
      this.data.map((row, i) =>
        row.map((char, j) => {
          const cell = positions.some((p) => p.row === i && p.col === j)
            ? `${colors[color]}${char}${reset}`
            : char;
          return cell.padEnd(padding);
        }).join('')
      ).join('\n'),
    );
  }

  stats(): string {
    const c = { warning: colors[0], info: colors[3], reset: colors[5] };

    if (!this.data?.length || !this.data[0]?.length) {
      return `${c.warning}Empty graph${c.reset}`;
    }

    const [rows, cols] = [this.data.length, this.data[0].length];
    const totalCells = rows * cols;

    if (this.data.some((row) => row.length !== cols)) {
      return `${c.warning}Invalid graph: inconsistent row lengths${c.reset}`;
    }

    const counts = this.data.flat().reduce((acc, char) => ({
      digits: acc.digits + Number(this.isDigit(char)),
      symbols: acc.symbols + Number(this.isSymbol(char)),
    }), { digits: 0, symbols: 0 });

    const formatPercent = (count: number): string =>
      `${count} ${c.info}(${
        ((count / totalCells) * 100).toFixed(2)
      }%)${c.reset}`;

    return [
      `  ❄ ${c.info}Dimensions: ${c.reset}${rows}x${cols}`,
      `  ❄ ${c.info}Total cells: ${c.reset}${totalCells}`,
      `  ❄ ${c.info}Digits: ${c.reset}${formatPercent(counts.digits)}`,
      `  ❄ ${c.info}Symbols: ${c.reset}${formatPercent(counts.symbols)}`,
    ].join('\n');
  }
}

export class DirectedGraph<T> {
  private nodes = new Map<string, T>();
  private edges = new Map<string, Set<string>>();

  addNode(key: string, value: T): this {
    this.nodes.set(key, value);
    if (!this.edges.has(key)) {
      this.edges.set(key, new Set());
    }
    return this;
  }

  addEdge(from: string, to: string): this {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error('Cannot add edge between non-existent nodes');
    }
    if (!this.edges.has(from)) {
      this.edges.set(from, new Set());
    }
    this.edges.get(from)!.add(to);
    return this;
  }

  getValue(key: string): T | undefined {
    return this.nodes.get(key);
  }

  hasNode(key: string): boolean {
    return this.nodes.has(key);
  }

  getSuccessors(key: string): Set<string> {
    return this.edges.get(key) || new Set();
  }

  tap(fn: (graph: this) => void): this {
    fn(this);
    return this;
  }

  topologicalSort(
    startNodes: string[],
  ): { sorted: string[]; visited: Set<string> } {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (node: string) => {
      if (temp.has(node)) throw new Error('Circular dependency');
      if (visited.has(node)) return;

      temp.add(node);
      this.edges.get(node)?.forEach(visit);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };

    startNodes.forEach((node) => {
      if (!visited.has(node)) visit(node);
    });

    return { sorted: result.reverse(), visited };
  }

  stats(): string {
    const nodeCount = this.nodes.size;
    const edgeCount = Array.from(this.edges.values())
      .reduce((sum, edges) => sum + edges.size, 0);
    return [
      `Nodes: ${nodeCount}`,
      `Edges: ${edgeCount}`,
      `Average out-degree: ${(edgeCount / nodeCount).toFixed(2)}`,
    ].join('\n');
  }
}

export class FileHandler {
  static async getFilePathFromArgs(): Promise<AdventOfCodeDay> {
    const args = Deno.args;
    let input: string | null = null;
    let day: number | null = null;

    if (!args.length) {
      const numberInput = prompt(
        "Please enter AoC day (1 - 25) or 'p' for file path: ",
      );
      day = Number(numberInput);

      if (day >= 1 && day <= 25) {
        const dirPath = `./inputs/${day}`;
        for await (const dirEntry of Deno.readDir(dirPath)) {
          if (dirEntry.isFile) {
            input = `${dirPath}/${dirEntry.name}`;
            console.log(`Reading file: ${input}`);
            break;
          }
        }
      }

      while (!input) {
        input = prompt('Please enter the file path:');
        if (!input) {
          console.log('No input provided. Please try again.');
        }
      }

      if (input) {
        const match = input.match(/\d+/);
        if (match) {
          day = Number(match[0]);
        }
      }
    } else {
      input = args[0];
      const match = input.match(/\d+/);
      if (match) {
        day = Number(match[0]);
      }
    }

    return { day: day ?? 0, inputFile: input };
  }

  static async getFileLines(filePath: string): Promise<string[]> {
    return (await Deno.readTextFile(filePath)).split('\n').map((line) =>
      line.trim()
    );
  }
}
