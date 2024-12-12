import Kia from 'https://deno.land/x/kia@0.4.1/mod.ts';
import spinners from '../../util/spinners.ts';
import { bold, colors, reset } from '../../util/util.ts';
const title = 'Disk Fragmenter 📀';

type FileEntry = {
  id: number;
  blockSpan: number;
  margin: number;
};

const dayNine = async (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const diskMap = lines[0].split('');
  const fileEntries = generateFileEntries(diskMap);
  const diskRepresentationA = generateRepresentation(fileEntries);
  const diskRepresentationB = [...diskRepresentationA];
  const spinner = new Kia({ text: 'Defragmenting...', spinner: spinners.arc });
  spinner.start();
  await fragmentSort(diskRepresentationA);
  spinner.stop();
  const checksumA = getChecksum(diskRepresentationA);
  console.log('❄ FILESYSTEM FRAGMENTED CHECKSUM: ', checksumA);

  spinner.start();
  await defragmentSort(diskRepresentationB);
  spinner.stop();
  const checksumB = getChecksum(diskRepresentationB);
  console.log('❄ FILESYSTEM DEFRAGMENTED CHECKSUM: ', checksumB);
};

const generateFileEntries = (diskMap: string[]) => {
  const fileEntries: FileEntry[] = [];
  let id = 0;
  diskMap.forEach((file, i) => {
    if (i % 2 === 0) {
      fileEntries.push({
        id,
        blockSpan: parseInt(file),
        margin: parseInt(diskMap[i + 1]),
      });
      id++;
    }
  });
  return fileEntries;
};

const generateRepresentation = (fileEntries: FileEntry[]) => {
  const representation: string[] = [];
  fileEntries.forEach((file) => {
    const { id, blockSpan, margin } = file;
    for (let i = 0; i < blockSpan; i++) {
      representation.push(`${id}`);
    }
    for (let i = 0; i < margin; i++) {
      representation.push('.');
    }
  });
  return representation;
};

const fragmentSort = async (diskRepresentation: string[]) => {
  const n = diskRepresentation.length;
  let left = 0;
  let i = n - 1;

  while (i >= 0 && diskRepresentation[i] === '.') i--;
  if (i < 0) return;

  // Release thread before main processing
  await new Promise((resolve) => setTimeout(resolve, 0));

  while (i >= 0) {
    const val = diskRepresentation[i];
    if (val !== '.') {
      while (left < i && diskRepresentation[left] !== '.') left++;
      if (left >= i) break;

      diskRepresentation[i] = '.';
      diskRepresentation[left++] = val;

      // Release every few swaps
      if (i % 1000 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    i--;
  }
};

const defragmentSort = async (diskRepresentation: string[]) => {
  const seen = new Set();
  const fileIds: string[] = [];
  for (const x of diskRepresentation) {
    if (x !== '.' && !seen.has(x)) {
      seen.add(x);
      fileIds.push(x);
    }
  }
  fileIds.sort((a, b) => +b - +a);

  // Release after setup
  await new Promise((resolve) => setTimeout(resolve, 0));

  for (const fileId of fileIds) {
    const blocks: number[] = [];
    let i = 0;

    while (i < diskRepresentation.length) {
      if (diskRepresentation[i] === fileId) {
        const start = i;
        while (diskRepresentation[++i] === fileId);
        blocks.push(start, i - start);
      } else {
        i++;
      }
    }

    if (!blocks.length) continue;

    // Release after block finding
    await new Promise((resolve) => setTimeout(resolve, 0));

    const totalSize = blocks.reduce((sum, _, i) => i % 2 ? sum + _ : sum, 0);
    const leftmostPos = blocks[0];
    let left = 0, bestStart = -1;

    while (left < leftmostPos) {
      if (diskRepresentation[left] === '.') {
        let pos = left;
        while (pos < leftmostPos && diskRepresentation[pos] === '.') pos++;
        if (pos - left >= totalSize) {
          bestStart = left;
          break;
        }
        left = pos;
      }
      left++;
    }

    if (bestStart !== -1) {
      // Release before move operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      let currentPos = bestStart;
      for (let i = 0; i < blocks.length; i += 2) {
        const start = blocks[i];
        const len = blocks[i + 1];
        diskRepresentation.fill(fileId, currentPos, currentPos + len);
        diskRepresentation.fill('.', start, start + len);
        currentPos += len;
      }
    }
  }
};

const getChecksum = (diskRepresentation: string[]) => {
  return diskRepresentation.reduce((acc, val, i) => {
    return acc + (isNaN(parseInt(val)) ? 0 : parseInt(val) * i);
  }, 0);
};

export default dayNine;
