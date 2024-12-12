import { bold, colors, reset } from '../../util/util.ts';

const title = 'Disk Fragmenter 📀';

type FileEntry = {
  id: number;
  blockSpan: number;
  margin: number;
};

const dayNine = (lines: string[]) => {
  console.log(`${bold}${colors[3]}${title}${reset}`);
  const diskMap = lines[0].split('');
  const fileEntries = generateFileEntries(diskMap);
  const diskRepresentation = generateRepresentation(fileEntries);
  defrag(diskRepresentation);
  const checksum = getChecksum(diskRepresentation);
  console.log('❄ FILESYSTEM CHECKSUM: ', checksum);
  console.log('❄ pt2: ');
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

const defrag = (diskRepresentation: string[]) => {
  let left = 0;
  const n = diskRepresentation.length;
  for (let i = n - 1; i >= 0; i--) {
    if (diskRepresentation[i] !== '.') {
      while (left < n && diskRepresentation[left] !== '.') {
        left++;
      }
      if (left < i) {
        [diskRepresentation[i], diskRepresentation[left]] = [
          diskRepresentation[left],
          diskRepresentation[i],
        ];
        left++;
      } else {
        break;
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
