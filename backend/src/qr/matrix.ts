export type Module = boolean | null;

export class QrMatrix {
  readonly size: number;
  readonly modules: Module[][];
  private dataModules: boolean[][];

  private reserved: boolean[][];

  constructor(size: number) {
    this.size = size;

    this.modules = Array.from({ length: size }, () =>
      Array<Module>(size).fill(null),
    );

    this.reserved = Array.from({ length: size }, () =>
      Array<boolean>(size).fill(false),
    );

    this.dataModules = Array.from({ length: size }, () =>
      Array<boolean>(size).fill(false),
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

  reserve(row: number, column: number): void {
    this.reserved[row][column] = true;
  }

  isReserved(row: number, column: number): boolean {
    return this.reserved[row][column];
  }

  reserveFormatInformation(): void {
    // 左上：縦
    for (let row = 0; row <= 5; row++) {
      this.reserve(row, 8);
    }

    this.reserve(7, 8);
    this.reserve(8, 8);
    this.reserve(8, 7);

    // 左上：横
    for (let column = 0; column <= 5; column++) {
      this.reserve(8, column);
    }

    // 右上
    for (let column = 13; column <= 20; column++) {
      this.reserve(8, column);
    }

    // 左下
    for (let row = 14; row <= 20; row++) {
      this.reserve(row, 8);
    }
  }

  placeFormatInformation(formatInfo: number): void {
    // 左上：縦方向
    for (let i = 0; i <= 5; i++) {
      this.set(i, 8, ((formatInfo >>> i) & 1) === 1);
    }

    this.set(7, 8, ((formatInfo >>> 6) & 1) === 1);
    this.set(8, 8, ((formatInfo >>> 7) & 1) === 1);
    this.set(8, 7, ((formatInfo >>> 8) & 1) === 1);

    // 左上：横方向
    for (let i = 9; i <= 14; i++) {
      this.set(8, 14 - i, ((formatInfo >>> i) & 1) === 1);
    }

    // 右上
    for (let i = 0; i <= 7; i++) {
      this.set(8, this.size - 1 - i, ((formatInfo >>> i) & 1) === 1);
    }

    // 左下
    for (let i = 8; i <= 14; i++) {
      this.set(this.size - 15 + i, 8, ((formatInfo >>> i) & 1) === 1);
    }
  }

  placeDataBit(row: number, column: number, bit: boolean): void {
    if (this.get(row, column) !== null) {
      throw new Error("Cannot place data on an occupied module");
    }

    if (this.isReserved(row, column)) {
      throw new Error("Cannot place data on a reserved module");
    }

    this.set(row, column, bit);
    this.dataModules[row][column] = true;
  }

  isAvailableForData(row: number, column: number): boolean {
    return this.get(row, column) === null && !this.isReserved(row, column);
  }

  getDataCoordinates(): Array<[number, number]> {
    const coordinates: Array<[number, number]> = [];

    let upward = true;

    for (let column = this.size - 1; column > 0; column -= 2) {
      // Timing Patternの列を飛ばす
      if (column === 6) {
        column--;
      }

      if (upward) {
        for (let row = this.size - 1; row >= 0; row--) {
          if (this.isAvailableForData(row, column)) {
            coordinates.push([row, column]);
          }

          if (this.isAvailableForData(row, column - 1)) {
            coordinates.push([row, column - 1]);
          }
        }
      } else {
        for (let row = 0; row < this.size; row++) {
          if (this.isAvailableForData(row, column)) {
            coordinates.push([row, column]);
          }

          if (this.isAvailableForData(row, column - 1)) {
            coordinates.push([row, column - 1]);
          }
        }
      }

      upward = !upward;
    }

    return coordinates;
  }

  placeData(codewords: Uint8Array): void {
    const coordinates = this.getDataCoordinates();

    const bits: boolean[] = [];

    for (const byte of codewords) {
      for (let i = 7; i >= 0; i--) {
        bits.push(((byte >>> i) & 1) === 1);
      }
    }

    if (bits.length > coordinates.length) {
      throw new Error("Data does not fit in matrix");
    }

    for (let i = 0; i < bits.length; i++) {
      const [row, column] = coordinates[i];

      this.placeDataBit(row, column, bits[i]);
    }
  }

  isDataModule(row: number, column: number): boolean {
    return this.dataModules[row][column];
  }
}
