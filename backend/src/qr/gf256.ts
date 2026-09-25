const EXP_TABLE = new Array<number>(512);
const LOG_TABLE = new Array<number>(256);

function initializeTables(): void {
  let value = 1;

  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = value;
    LOG_TABLE[value] = i;

    value <<= 1;

    if (value & 0x100) {
      value ^= 0x11d;
    }
  }

  // 255を超える指数を扱いやすくする
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
}

initializeTables();

export function add(a: number, b: number): number {
  return a ^ b;
}

export function multiply(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }

  const logA = LOG_TABLE[a];
  const logB = LOG_TABLE[b];

  return EXP_TABLE[logA + logB];
}

export function exp(power: number): number {
  return EXP_TABLE[power];
}
