import { sumArray } from "../../util.ts";

const dayOne = (lines: string[]) => {
    console.log("Day 1 challenge");
    const arrays = getArrays(lines);
    console.log("SUM: ", sumArray(getDiff(arrays)));
    console.log("SIMILARITY: ", sumArray(getSimilarityScore(arrays)));
};

const getSimilarityScore = ([left, right]: number[][]) => {
    return left.map((num) => right.filter((x) => x === num).length * num);
};

const getDiff = ([left, right]: number[][]) => {
    return left.map((num, i) => Math.abs(num - right[i]));
};

const getArrays = (lines: string[]) => {
    const leftNumbers: number[] = [];
    const rightNumbers: number[] = [];

    lines.forEach((line) => {
        const [left, right] = line.split(/\s+/);
        if (left && right) {
            leftNumbers.push(parseInt(left));
            rightNumbers.push(parseInt(right));
        }
    });

    leftNumbers.sort((a, b) => a - b);
    rightNumbers.sort((a, b) => a - b);

    return [leftNumbers, rightNumbers];
};

export default dayOne;
