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

export function calculatePenaltyN2(matrix: QrMatrix): number {
  let penalty = 0;

  for (let row = 0; row < matrix.size - 1; row++) {
    for (let column = 0; column < matrix.size - 1; column++) {
      const topLeft = matrix.get(row, column);
      const topRight = matrix.get(row, column + 1);
      const bottomLeft = matrix.get(row + 1, column);
      const bottomRight = matrix.get(row + 1, column + 1);

      if (
        topLeft !== null &&
        topLeft === topRight &&
        topLeft === bottomLeft &&
        topLeft === bottomRight
      ) {
        penalty += 3;
      }
    }
  }

  return penalty;
}

export function calculatePenaltyN3(matrix: QrMatrix): number {
  let penalty = 0;

  const isWhite = (value: boolean | null): boolean => {
    return value === false;
  };

  const isPattern = (cells: Array<boolean | null>): boolean => {
    const beforePattern =
      isWhite(cells[0]) &&
      isWhite(cells[1]) &&
      isWhite(cells[2]) &&
      isWhite(cells[3]) &&
      cells[4] === true &&
      cells[5] === false &&
      cells[6] === true &&
      cells[7] === true &&
      cells[8] === true &&
      cells[9] === false &&
      cells[10] === true;

    const afterPattern =
      cells[0] === true &&
      cells[1] === false &&
      cells[2] === true &&
      cells[3] === true &&
      cells[4] === true &&
      cells[5] === false &&
      cells[6] === true &&
      isWhite(cells[7]) &&
      isWhite(cells[8]) &&
      isWhite(cells[9]) &&
      isWhite(cells[10]);

    return beforePattern || afterPattern;
  };

  // 横方向
  for (let row = 0; row < matrix.size; row++) {
    for (let column = 0; column <= matrix.size - 11; column++) {
      const cells: Array<boolean | null> = [];

      for (let i = 0; i < 11; i++) {
        cells.push(matrix.get(row, column + i));
      }

      if (isPattern(cells)) {
        penalty += 40;
        column += 10;
      }
    }
  }

  // 縦方向
  for (let column = 0; column < matrix.size; column++) {
    for (let row = 0; row <= matrix.size - 11; row++) {
      const cells: Array<boolean | null> = [];

      for (let i = 0; i < 11; i++) {
        cells.push(matrix.get(row + i, column));
      }

      if (isPattern(cells)) {
        penalty += 40;
        row += 10;
      }
    }
  }

  return penalty;
}

export function calculatePenaltyN4(matrix: QrMatrix): number {
  let darkCount = 0;
  let totalCount = matrix.size * matrix.size;

  for (let row = 0; row < matrix.size; row++) {
    for (let column = 0; column < matrix.size; column++) {
      if (matrix.get(row, column) === true) {
        darkCount++;
      }
    }
  }

  const darkPercentage = (darkCount / totalCount) * 100;

  const deviation = Math.floor(Math.abs(darkPercentage - 50) / 5);

  return deviation * 10;
}

export function calculateMaskPenalty(matrix: QrMatrix): number {
  return (
    calculatePenaltyN1(matrix) +
    calculatePenaltyN2(matrix) +
    calculatePenaltyN3(matrix) +
    calculatePenaltyN4(matrix)
  );
}
