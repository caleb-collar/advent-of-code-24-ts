type AdventOfCodeDay = {
  day: number;
  inputFile: string;
};

const getFilePathFromArgs = async (): Promise<AdventOfCodeDay> => {
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
      input = prompt("Please enter the file path:");
      if (!input) {
        console.log("No input provided. Please try again.");
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
};

const getFileLines = async (filePath: string): Promise<string[]> =>
  (await Deno.readTextFile(filePath)).split("\n").map((line) => line.trim());

const colors = [
  "\x1b[38;5;160m", // Deep Red
  "\x1b[38;5;196m", // Bright Red
  "\x1b[38;5;22m", // Dark Green
  "\x1b[38;5;157m", // Light Green
  "\x1b[33m", // Gold
  "\x1b[37m", // White
];
const bold = "\x1b[1m";
const reset = "\x1b[0m";

// deno-fmt-ignore-start
const asciiArt = `
${bold}${colors[0]}\u0020\u0020\u0020\u005f\u005f\u005f\u005f\u005f\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u0020\u0020\u0020\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u0020\u0020\u0020\u0020\u005f\u005f\u005f\u005f\u005f\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020${bold}${colors[4]}\u002a
${bold}${colors[1]}\u0020\u0020\u002f\u0020\u0020\u005f\u0020\u0020\u005c\u0020\u0020\u0020\u005f\u005f\u005f\u005f\u0020\u005c\u005f\u0020\u0020\u0020\u005f\u005f\u005f\u0020\u005c\u0020\u0020\u005c\u005f\u005f\u005f\u005f\u005f\u0020\u0020\u005c\u0020\u0020\u002f\u0020\u0020\u007c\u0020\u0020\u007c\u0020\u0020\u0020\u0020\u0020\u0020\u0020${bold}${colors[3]}\u002f\u0023\u005c
${bold}${colors[2]}\u0020\u002f\u0020\u0020\u002f\u005f\u005c\u0020\u0020\u005c\u0020\u002f\u0020\u0020\u005f\u0020\u005c\u002f\u0020\u0020\u0020\u0020\u005c\u0020\u0020\u005c\u002f\u0020\u0020\u0020\u002f\u0020\u0020\u005f\u005f\u005f\u005f\u002f\u0020\u002f\u0020\u0020\u0020\u007c\u0020\u0020\u007c\u005f\u0020\u0020\u0020\u0020\u0020${bold}${colors[3]}\u002f\u0023\u0023\u0023\u005c
${bold}${colors[3]}\u002f\u0020\u0020\u0020\u0020\u007c\u0020\u0020\u0020\u0020\u0028\u0020\u0020\u003c\u005f\u003e\u0020\u0029\u0020\u0020\u0020\u0020\u0020\u005c\u005f\u005f\u005f\u005f\u0020\u002f\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u005c\u002f\u0020\u0020\u0020\u0020\u005e\u0020\u0020\u0020\u002f\u0020\u0020\u0020\u0020${bold}${colors[3]}\u002f\u0023\u0023\u0023\u0023\u0023\u005c
${bold}${colors[4]}\u005c\u005f\u005f\u005f\u005f\u007c\u005f\u005f\u0020\u0020\u002f\u005c\u005f\u005f\u005f\u005f\u002f\u0020\u005c\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u0020\u002f\u0020\u005c\u005f\u005f\u005f\u005f\u005f\u005f\u005f\u0020\u005c\u005f\u005f\u005f\u005f\u0020\u0020\u0020\u007c\u0020\u0020\u0020\u0020${bold}${colors[3]}\u002f\u0023\u0023\u0023\u0023\u0023\u0023\u0023\u005c
${bold}${colors[5]}\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u005c\u002f\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u005c\u002f\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u005c\u002f\u0020\u0020\u0020\u0020\u007c\u005f\u005f\u007c\u0020\u0020\u0020\u0020\u0020${bold}${colors[2]}\u0020\u0020\u007c\u007c\u007c
`;
// deno-fmt-ignore-end

// Main function
const main = async () => {
    try {
        console.log(asciiArt + reset);
        const aocDay = await getFilePathFromArgs();
        const lines = await getFileLines(aocDay.inputFile);

        // Day Challenge function dynamic import
        const solutionFiles = Array.from(Deno.readDirSync(`./solutions/${aocDay.day}`))
            .filter(entry => entry.isFile && entry.name.endsWith('.ts'))
            .sort((a, b) => a.name.localeCompare(b.name));

        if (solutionFiles.length === 0) {
            throw new Error(`No solution files found for day ${aocDay.day}`);
        }

        const solutionModule = await import(
            `./solutions/${aocDay.day}/${solutionFiles[0].name}`
        );
        const solution = solutionModule.default;
        
        // Execute solution
        console.log(`${bold}${colors[0]}🎄🎁 Running Solution for Day ${aocDay.day} 🎁🎄${reset} \n`);
        await solution(lines);
        
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
  await main();
}
