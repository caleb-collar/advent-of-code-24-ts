import { bold, colors, reset, FileHandler } from "./util/util.ts";
import asciiArt from "./util/ascii.ts";

// Main function with cli, file reading, solution execution, and error handling
const main = async () => {
  try {
    console.log(asciiArt + reset);
    const aocDay = await FileHandler.getFilePathFromArgs();
    const lines = await FileHandler.getFileLines(aocDay.inputFile);

    // Day Challenge function dynamic import
    const solutionFiles = Array.from(
      Deno.readDirSync(`./solutions/${aocDay.day}`),
    )
      .filter((entry) => entry.isFile && entry.name.endsWith(".ts"))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (solutionFiles.length === 0) {
      throw new Error(`No solution files found for day ${aocDay.day}`);
    }

    const solutionModule = await import(
      `./solutions/${aocDay.day}/${solutionFiles[0].name}`
    );
    const solution = solutionModule.default;

    // Execute solution
    console.log(
      `${bold}${
        colors[0]
      }🎄🎁 Running Solution for Day ${aocDay.day} 🎁🎄${reset} \n`,
    );
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
