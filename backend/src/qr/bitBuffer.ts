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

  toBytes(): Uint8Array {
    if (this.bits.length % 8 !== 0) {
      throw new Error("Bit length must be a multiple of 8");
    }

    const bytes = new Uint8Array(this.bits.length / 8);

    for (let i = 0; i < bytes.length; i++) {
      let value = 0;

      for (let j = 0; j < 8; j++) {
        value = (value << 1) | this.bits[i * 8 + j];
      }

      bytes[i] = value;
    }

    return bytes;
  }
}
