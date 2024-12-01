type Position = { row: number; col: number };
type NumberInfo = { value: number; positions: Set<string> };
type Graph = string[][];

// File handling
const getFileNameFromArgs = (): string => {
    const args = Deno.args;
    if (!args.length) {
        let input: string | null = null;
        while (!input) {
            input = prompt("Please enter the file path:");
            if (!input) {
                console.log("No input provided. Please try again.");
            }
        }
        return input;
    }
    return args[0];
};

const getFileLines = async (filePath: string): Promise<string[]> => {
    const text = await Deno.readTextFile(filePath);
    return text.split("\n");
};

const getGraph = (lines: string[]): Graph =>
    lines.map((line) => line.trim().split(""));

// Utility functions & constants
const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
] as const;

const colors = [
    "\x1b[31m", // Red
    "\x1b[32m", // Green
    "\x1b[33m", // Yellow
    "\x1b[34m", // Blue
    "\x1b[35m", // Magenta
    "\x1b[36m", // Cyan
    "\x1b[37m", // White
];
const bold = "\x1b[1m";
const reset = "\x1b[0m";

const asciiArt = `
${colors[0]}_______      _________   ______________
${colors[1]}___    |_______  ____/   __|__ \\_|__  /
${colors[2]}__  /| |  __ \\  /        ____/ /__/_ < 
${colors[3]}_  ___ / /_/ / /___      _  __/____/ / 
${colors[4]}/_/  |_\\____/\\____/      /____//____/  
${colors[5]}                                       
`;

const title = `${bold}${
    colors[0]
}🎄🎁 Counting part numbers and gear ratios... ❄⚙${reset}`;

const isInBounds = (pos: Position, graph: Graph): boolean =>
    pos.row >= 0 && pos.row < graph.length &&
    pos.col >= 0 && pos.col < graph[0].length;

const isDigit = (char: string): boolean => /\d/.test(char);

const posToString = (pos: Position): string => `${pos.row},${pos.col}`;

const getAdjacentPositions = (pos: Position): Position[] =>
    directions.map(([dx, dy]) => ({
        row: pos.row + dx,
        col: pos.col + dy,
    }));

const getNumberAt = (start: Position, graph: Graph): NumberInfo | null => {
    if (!isInBounds(start, graph) || !isDigit(graph[start.row][start.col])) {
        return null;
    }

    let col = start.col;
    while (col > 0 && isDigit(graph[start.row][col - 1])) col--;

    let num = "";
    const positions = new Set<string>();

    while (col < graph[0].length && isDigit(graph[start.row][col])) {
        num += graph[start.row][col];
        positions.add(posToString({ row: start.row, col }));
        col++;
    }

    return { value: parseInt(num), positions };
};

// Part number validation
const isSymbol = (char: string): boolean => char !== "." && !isDigit(char);

const hasAdjacentSymbol = (pos: Position, graph: Graph): boolean =>
    getAdjacentPositions(pos)
        .some((adjPos) =>
            isInBounds(adjPos, graph) && isSymbol(graph[adjPos.row][adjPos.col])
        );

const getValidPartNums = (graph: Graph): string[] =>
    graph.flatMap((row, rowIndex) => {
        const numbers: string[] = [];
        const regex = /\d+/g;
        let match;

        while ((match = regex.exec(row.join(""))) !== null) {
            const startPos = { row: rowIndex, col: match.index };
            const endPos = {
                row: rowIndex,
                col: match.index + match[0].length - 1,
            };

            if (
                hasAdjacentSymbol(startPos, graph) ||
                hasAdjacentSymbol(endPos, graph)
            ) {
                numbers.push(match[0]);
            }
        }
        return numbers;
    });

// Gear ratio calculation
const getValidGearRatios = (graph: Graph): string[] => {
    const findAdjacentNumbers = (pos: Position): Set<string> => {
        const numbers = new Set<string>();
        const seenPositions = new Set<string>();

        getAdjacentPositions(pos).forEach((adjPos) => {
            if (!isInBounds(adjPos, graph)) return;

            const posKey = posToString(adjPos);
            if (
                isDigit(graph[adjPos.row][adjPos.col]) &&
                !seenPositions.has(posKey)
            ) {
                const numberInfo = getNumberAt(adjPos, graph);
                if (numberInfo) {
                    numbers.add(`${numberInfo.value}:${posKey}`);
                    numberInfo.positions.forEach((pos) =>
                        seenPositions.add(pos)
                    );
                }
            }
        });
        return numbers;
    };

    return graph.flatMap((row, rowIndex) =>
        row.flatMap((cell, colIndex) => {
            if (cell === "*") {
                const numbers = findAdjacentNumbers({
                    row: rowIndex,
                    col: colIndex,
                });
                if (numbers.size === 2) {
                    return [
                        [...numbers]
                            .map((n) => parseInt(n.split(":")[0]))
                            .reduce((a, b) => a * b)
                            .toString(),
                    ];
                }
            }
            return [];
        })
    );
};

// Array operations
const sumArray = (numbers: string[]): number =>
    numbers.reduce((sum, num) => sum + parseInt(num, 10), 0);

// Main function
const gearRatios = async () => {
    try {
        console.log(asciiArt + reset);
        const filePath = getFileNameFromArgs();
        const lines = await getFileLines(filePath);
        console.log(title + reset + "\n");
        console.log(
            `The dimensions of the graph are: ${lines.length} x ${
                lines[0].length
            }`,
        );

        const graph = getGraph(lines);
        const partNumbersSum = sumArray(getValidPartNums(graph));
        const gearRatioSum = sumArray(getValidGearRatios(graph));

        console.log(`Part Numbers Sum: ${colors[3]}${partNumbersSum}${reset}`);
        console.log(`Gear Ratios Sum: ${colors[3]}${gearRatioSum}${reset}`);
        console.log(`\n${bold}${colors[0]}OK${reset}\n`);
    } catch (error) {
        console.log(
            `\n${bold}${colors[0]}An error occured! ${reset}\n${error}\n`,
        );
    } finally {
        console.log("Press any key to exit...");
        Deno.stdin.setRaw(true);
        await Deno.stdin.read(new Uint8Array(1));
        Deno.stdin.setRaw(false);
        Deno.exit();
    }
};

// Wrap main execution
if (import.meta.main) {
    await gearRatios();
}
