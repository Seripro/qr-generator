import { QrMatrix } from "./matrix.js";

export function calculatePenaltyN1(matrix: QrMatrix): number {
  let penalty = 0;

  // 横方向
  for (let row = 0; row < matrix.size; row++) {
    let runColor: boolean | null = null;
    let runLength = 0;

    for (let column = 0; column < matrix.size; column++) {
      const color = matrix.get(row, column);

      if (color === null) {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }

        runColor = null;
        runLength = 0;
        continue;
      }

      if (color === runColor) {
        runLength++;
      } else {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }

        runColor = color;
        runLength = 1;
      }
    }

    if (runLength >= 5) {
      penalty += 3 + (runLength - 5);
    }
  }

  // 縦方向
  for (let column = 0; column < matrix.size; column++) {
    let runColor: boolean | null = null;
    let runLength = 0;

    for (let row = 0; row < matrix.size; row++) {
      const color = matrix.get(row, column);

      if (color === null) {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }

        runColor = null;
        runLength = 0;
        continue;
      }

      if (color === runColor) {
        runLength++;
      } else {
        if (runLength >= 5) {
          penalty += 3 + (runLength - 5);
        }

        runColor = color;
        runLength = 1;
      }
    }

    if (runLength >= 5) {
      penalty += 3 + (runLength - 5);
    }
  }

  return penalty;
}
