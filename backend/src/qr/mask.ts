import { QrMatrix } from "./matrix.js";

export function shouldMask(mask: number, row: number, column: number): boolean {
  switch (mask) {
    case 0:
      return (row + column) % 2 === 0;
    case 1:
      return row % 2 === 0;
    case 2:
      return column % 3 === 0;
    case 3:
      return (row + column) % 3 === 0;
    case 4:
      return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
    case 5:
      return ((row * column) % 2) + ((row * column) % 3) === 0;
    case 6:
      return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0;
    case 7:
      return (((row * column) % 3) + ((row + column) % 2)) % 2 === 0;
    default:
      throw new Error(`Unsupported mask: ${mask}`);
  }
}

export function applyMask(matrix: QrMatrix, mask: number): void {
  for (let row = 0; row < matrix.size; row++) {
    for (let column = 0; column < matrix.size; column++) {
      if (!matrix.isDataModule(row, column)) {
        continue;
      }

      if (shouldMask(mask, row, column)) {
        const value = matrix.get(row, column);

        if (value !== null) {
          matrix.set(row, column, !value);
        }
      }
    }
  }
}
