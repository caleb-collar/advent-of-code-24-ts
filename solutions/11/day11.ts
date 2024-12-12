import { bold, colors, reset } from '../../util/util.ts';

const title = 'Plutonian Pebbles ♇';

const dayEleven = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  let stones = lines[0].split(' ');
  let count = transformStones(stones, 25);
  console.log('❄ NUMBER OF STONES (25 BLINKS): ', count);
  stones = lines[0].split(' '); // Reset stones
  count = transformStones(stones, 75);
  console.log('❄ NUMBER OF STONES (75 BLINKS): ', count);
};

const applyRules = (stone: string): string[] => {
  const stoneNum = parseInt(stone);

  if (stoneNum === 0) {
    return ['1'];
  }

  const stoneStr = stoneNum.toString();
  if (stoneStr.length % 2 === 0) {
    const mid = stoneStr.length / 2;
    const leftStone = stoneStr.slice(0, mid);
    const rightStone = stoneStr.slice(mid);
    return [leftStone, rightStone];
  }

  const result = BigInt(stoneNum) * BigInt(2024);
  return [result.toString()];
};

const transformStones = (stones: string[], blinks: number): number => {
  let stoneMap = new Map<string, number>();
  
  stones.forEach(stone => {
    stoneMap.set(stone, (stoneMap.get(stone) || 0) + 1);
  });
  
  for (let i = 0; i < blinks; i++) {
    const newStoneMap = new Map<string, number>();
    
    for (const [stone, count] of stoneMap.entries()) {
      const newStones = applyRules(stone);
      newStones.forEach(newStone => {
        newStoneMap.set(newStone, (newStoneMap.get(newStone) || 0) + count);
      });
    }
    
    stoneMap = newStoneMap;
  }
  
  return Array.from(stoneMap.values()).reduce((sum, count) => sum + count, 0);
};

export default dayEleven;