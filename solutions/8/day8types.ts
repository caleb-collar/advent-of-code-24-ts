import { Position } from '../../util/types.ts';

type UpperCase =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

type LowerCase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type NodeType = UpperCase | LowerCase | Digit;

export type AntinodeType =
  | '\u{1F31F}'
  | '\u{1F319}'
  | '\u{1F320}'
  | '\u{1F321}'
  | '\u{1F30D}'
  | '\u{1F308}'
  | '\u{1F30A}'
  | '\u{1F525}'
  | '\u{1F328}'
  | '\u{1F340}'
  | '\u{1F338}'
  | '\u{1F33A}'
  | '\u{1F339}'
  | '\u{1F337}'
  | '\u{1F33B}'
  | '\u{1F341}'
  | '\u{1F342}'
  | '\u{1F343}'
  | '\u{1F334}'
  | '\u{1F335}'
  | '\u{1F33E}'
  | '\u{1F33F}'
  | '\u{2618}'
  | '\u{1F344}'
  | '\u{1F330}'
  | '\u{1F98B}'
  | '\u{1F41D}'
  | '\u{1F41E}'
  | '\u{1F40C}'
  | '\u{1F422}'
  | '\u{1F992}'
  | '\u{1F98A}'
  | '\u{1F981}'
  | '\u{1F42F}'
  | '\u{1F42E}'
  | '\u{1F437}'
  | '\u{1F438}'
  | '\u{1F419}'
  | '\u{1F991}'
  | '\u{1F988}'
  | '\u{1F420}'
  | '\u{1F421}'
  | '\u{1F41F}'
  | '\u{1F990}'
  | '\u{1F980}'
  | '\u{1F41A}'
  | '\u{1F33A}'
  | '\u{1F38B}'
  | '\u{1F38D}'
  | '\u{1F3AD}'
  | '\u{2B50}'
  | '\u{2728}'
  | '\u{1F4AB}'
  | '\u{26A1}'
  | '\u{2604}'
  | '\u{1F320}'
  | '\u{1F387}'
  | '\u{1F386}'
  | '\u{1F30C}'
  | '\u{1F309}'
  | '\u{1F304}'
  | '\u{1F305}';

type NodeAntinodeMap = Record<NodeType, AntinodeType>;

export type Node = Record<NodeType, Position[]>;

export const nodeAntinodeMap: NodeAntinodeMap = {
  A: '\u{1F31F}',
  B: '\u{1F319}',
  C: '\u{1F320}',
  D: '\u{1F321}',
  E: '\u{1F30D}',
  F: '\u{1F308}',
  G: '\u{1F30A}',
  H: '\u{1F525}',
  I: '\u{1F328}',
  J: '\u{1F340}',
  K: '\u{1F338}',
  L: '\u{1F33A}',
  M: '\u{1F339}',
  N: '\u{1F337}',
  O: '\u{1F33B}',
  P: '\u{1F341}',
  Q: '\u{1F342}',
  R: '\u{1F343}',
  S: '\u{1F334}',
  T: '\u{1F335}',
  U: '\u{1F33E}',
  V: '\u{1F33F}',
  W: '\u{2618}',
  X: '\u{1F344}',
  Y: '\u{1F330}',
  Z: '\u{1F98B}',
  a: '\u{1F41D}',
  b: '\u{1F41E}',
  c: '\u{1F40C}',
  d: '\u{1F422}',
  e: '\u{1F992}',
  f: '\u{1F98A}',
  g: '\u{1F981}',
  h: '\u{1F42F}',
  i: '\u{1F42E}',
  j: '\u{1F437}',
  k: '\u{1F438}',
  l: '\u{1F419}',
  m: '\u{1F991}',
  n: '\u{1F988}',
  o: '\u{1F420}',
  p: '\u{1F421}',
  q: '\u{1F41F}',
  r: '\u{1F990}',
  s: '\u{1F980}',
  t: '\u{1F41A}',
  u: '\u{1F33A}',
  v: '\u{1F38B}',
  w: '\u{1F38D}',
  x: '\u{1F3AD}',
  y: '\u{2B50}',
  z: '\u{2728}',
  0: '\u{1F4AB}',
  1: '\u{26A1}',
  2: '\u{2604}',
  3: '\u{1F320}',
  4: '\u{1F387}',
  5: '\u{1F386}',
  6: '\u{1F30C}',
  7: '\u{1F309}',
  8: '\u{1F304}',
  9: '\u{1F305}',
};
