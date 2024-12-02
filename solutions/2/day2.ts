import { ArrExt } from "../../util.ts";

const dayTwo = (lines: string[]) => {
  console.log("Red-Nosed Reports ☢ 🦌");
  const numSafe = lines.filter(strictReportAnalyzer).length;
  const numFlexSafe = lines.filter(flexibleReportAnalyzer).length;
  console.log("❄ STRICTLY SAFE REPORTS: ", numSafe);
  console.log("❄ FLEXIBLY SAFE REPORTS: ", numFlexSafe);
};

const strictReportAnalyzer = (input: string | number[]) => {
  const report = typeof input === "string"
    ? input.split(" ").map(Number)
    : input;
  const order = ArrExt.isAscending(report) || ArrExt.isDescending(report);
  const adj = report.every((value, index, array) => {
    if (index === array.length - 1) return true;
    const diff = Math.abs(value - array[index + 1]);
    return diff >= 1 && diff <= 3;
  });
  return order && adj;
};

const flexibleReportAnalyzer = (line: string) => {
  const report = line.split(" ").map(Number);
  const strictlySafe = strictReportAnalyzer(report);
  const flexiblySafe = report.some((_, i) =>
    strictReportAnalyzer(report.filter((_, j) => i !== j))
  );
  return strictlySafe || flexiblySafe;
};

export default dayTwo;
