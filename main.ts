import asciiArt from "./util/ascii.ts";
import { bold, colors, FileHandler, reset } from "./util/util.ts";

// Main function with cli, file reading, solution execution, and error handling
const main = async () => {
  try {
    // Display ASCII art
    console.log(asciiArt + reset);

    // Get the day and input file path from command line arguments
    const { day, inputFile } = await FileHandler.getFilePathFromArgs();

    // Read lines from the input file
    const lines = await FileHandler.getFileLines(inputFile);

    // Get the list of solution files for the specified day
    const solutionFiles = Array.from(Deno.readDirSync(`./solutions/${day}`))
      .filter((entry) => entry.isFile && entry.name.endsWith(".ts"))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Throw an error if no solution files are found
    if (!solutionFiles.length) {
      throw new Error(`No solution files found for day ${day}`);
    }

    // Import the first solution file found
    const { default: solution } = await import(
      `./solutions/${day}/${solutionFiles[0].name}`
    );

    // Display a message indicating the solution is running
    console.log(
      `${bold}${colors[0]}🎄🎁 Running Solution for Day ${day} 🎁🎄${reset} \n`,
    );

    // Execute the solution with the input lines
    await solution(lines);
  } catch (error) {
    // Handle any errors that occur during execution
    console.log(`\n${bold}${colors[0]}An error occurred! ${reset}\n${error}\n`);
  } finally {
    // Prompt the user to press any key to exit
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
