import { QrMatrix } from "./matrix.js";

export function placeData(matrix: QrMatrix, codewords: Uint8Array): void {
  const bits: boolean[] = [];

  for (const codeword of codewords) {
    for (let i = 7; i >= 0; i--) {
      bits.push(((codeword >> i) & 1) === 1);
    }
  }

  let bitIndex = 0;
  let row = matrix.size - 1;
  let column = matrix.size - 1;
  let upward = true;

  while (column > 0) {
    // 縦方向のTiming Patternを飛ばす
    if (column === 6) {
      column--;
    }

    while (true) {
      for (let offset = 0; offset < 2; offset++) {
        const currentColumn = column - offset;

        if (matrix.isAvailableForData(row, currentColumn)) {
          if (bitIndex >= bits.length) {
            return;
          }

          matrix.placeDataBit(row, currentColumn, bits[bitIndex]);

          bitIndex++;
        }
      }

      if (upward) {
        if (row === 0) {
          break;
        }

        row--;
      } else {
        if (row === matrix.size - 1) {
          break;
        }

        row++;
      }
    }

    column -= 2;
    upward = !upward;
  }

  if (bitIndex !== bits.length) {
    throw new Error(
      `Could not place all data bits: ${bitIndex}/${bits.length}`,
    );
  }
}
