export type Module = boolean | null;

export class QrMatrix {
  readonly size: number;
  readonly modules: Module[][];

  constructor(size: number) {
    this.size = size;

    this.modules = Array.from({ length: size }, () =>
      Array<Module>(size).fill(null),
    );
  }

  get(row: number, column: number): Module {
    return this.modules[row][column];
  }

  set(row: number, column: number, value: boolean): void {
    this.modules[row][column] = value;
  }

  placeFinderPattern(row: number, column: number): void {
    const pattern = [
      [true, true, true, true, true, true, true],
      [true, false, false, false, false, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, false, false, false, false, true],
      [true, true, true, true, true, true, true],
    ];

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        this.set(row + r, column + c, pattern[r][c]);
      }
    }
  }

  placeSeparator(row: number, column: number): void {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const targetRow = row + r;
        const targetColumn = column + c;

        if (
          targetRow < 0 ||
          targetRow >= this.size ||
          targetColumn < 0 ||
          targetColumn >= this.size
        ) {
          continue;
        }

        if (r === -1 || r === 7 || c === -1 || c === 7) {
          this.set(targetRow, targetColumn, false);
        }
      }
    }
  }

  placeTimingPatterns(): void {
    for (let i = 8; i < this.size - 8; i++) {
      const value = i % 2 === 0;

      if (this.get(6, i) === null) {
        this.set(6, i, value);
      }

      if (this.get(i, 6) === null) {
        this.set(i, 6, value);
      }
    }
  }

  placeDarkModule(): void {
    this.set(13, 8, true);
  }
}
