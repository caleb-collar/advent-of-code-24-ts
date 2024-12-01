/** Represents a number and its positions in the grid */
export type NumberInfo = { value: number; positions: Set<string> };

/** Sums an array of numbers or numeric strings */
export const sumArray = (numbers: (string | number)[]): number =>
    numbers.reduce<number>(
        (sum, num) => sum + (typeof num === "string" ? parseInt(num, 10) : num),
        0,
    );

/** Eight possible directions for adjacent positions (diagonals included) */
export const directions = [
    [-1, -1], // top-left
    [-1, 0], // top
    [-1, 1], // top-right
    [0, -1], // left
    [0, 1], // right
    [1, -1], // bottom-left
    [1, 0], // bottom
    [1, 1], // bottom-right
] as const;

/** Represents a position in a 2D grid */
export class Position {
    constructor(public row: number, public col: number) {}

    /** Converts position to string format "row,col" */
    toString(): string {
        return `${this.row},${this.col}`;
    }

    /** Returns all eight adjacent positions (including diagonals) */
    getAdjacentPositions(): Position[] {
        return directions.map(([dx, dy]) =>
            new Position(
                this.row + dx,
                this.col + dy,
            )
        );
    }
}

/** Represents a 2D grid of characters with utility methods */
export class Graph {
    private data: string[][];

    /** Creates a graph from an array of strings */
    constructor(lines: string[]) {
        this.data = lines.map((line) => line.trim().split(""));
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
        return pos.getAdjacentPositions()
            .some((adjPos) =>
                this.isInBounds(adjPos) && this.isSymbol(this.charAt(adjPos))
            );
    }

    /** Checks if character is a symbol (not a digit or period) */
    isSymbol(char: string): boolean {
        return char !== "." && !this.isDigit(char);
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

        let num = "";
        const positions = new Set<string>();

        // Collect all digits and their positions
        while (
            col < this.data[0].length && this.isDigit(this.data[start.row][col])
        ) {
            num += this.data[start.row][col];
            positions.add(new Position(start.row, col).toString());
            col++;
        }

        return { value: parseInt(num), positions };
    }
}
