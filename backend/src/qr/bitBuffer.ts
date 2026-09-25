export class BitBuffer {
  private bits: number[] = [];

  get length(): number {
    return this.bits.length;
  }

  appendBits(value: number, length: number): void {
    if (length < 0 || length > 32) {
      throw new Error("length must be between 0 and 32");
    }

    for (let i = length - 1; i >= 0; i--) {
      this.bits.push((value >>> i) & 1);
    }
  }

  toArray(): number[] {
    return [...this.bits];
  }

  toString(): string {
    return this.bits.join("");
  }
}
