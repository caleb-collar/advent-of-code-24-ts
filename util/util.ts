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

/** Graph class for characters with utility methods */
export class Graph {
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
    return Graph.directions.map(([dx, dy]) => ({
      row: pos.row + dx,
      col: pos.col + dy,
    }));
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

  stats(): string {
    const c = { warning: colors[0], info: colors[3], reset: colors[5] };
    
    if (!this.data?.length || !this.data[0]?.length) 
      return `${c.warning}Empty graph${c.reset}`;
      
    const [rows, cols] = [this.data.length, this.data[0].length];
    const totalCells = rows * cols;
    
    if (this.data.some(row => row.length !== cols))
      return `${c.warning}Invalid graph: inconsistent row lengths${c.reset}`;
  
    const counts = this.data.flat().reduce((acc, char) => ({
      digits: acc.digits + Number(this.isDigit(char)),
      symbols: acc.symbols + Number(this.isSymbol(char))
    }), { digits: 0, symbols: 0 });
  
    const formatPercent = (count: number): string => 
      `${count} ${c.info}(${((count/totalCells)*100).toFixed(2)}%)${c.reset}`;
    
    return [
      `  ❄ ${c.info}Dimensions: ${c.reset}${rows}x${cols}`,
      `  ❄ ${c.info}Total cells: ${c.reset}${totalCells}`,
      `  ❄ ${c.info}Digits: ${c.reset}${formatPercent(counts.digits)}`,
      `  ❄ ${c.info}Symbols: ${c.reset}${formatPercent(counts.symbols)}`
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
