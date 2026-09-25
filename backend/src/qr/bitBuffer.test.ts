import { describe, expect, it } from "vitest";
import { BitBuffer } from "./bitBuffer.js";

describe("BitBuffer", () => {
  it("ビットを追加できる", () => {
    const buffer = new BitBuffer();

    buffer.appendBits(0b0100, 4);
    buffer.appendBits(0b0010, 4);

    expect(buffer.toString()).toBe("01000010");
  });

  it("ビット数を取得できる", () => {
    const buffer = new BitBuffer();

    buffer.appendBits(0b0100, 4);
    buffer.appendBits(0b0010, 4);

    expect(buffer.length).toBe(8);
  });

  it("配列として取得できる", () => {
    const buffer = new BitBuffer();

    buffer.appendBits(0b0100, 4);

    expect(buffer.toArray()).toEqual([0, 1, 0, 0]);
  });

  it("ビット列をバイト列に変換できる", () => {
    const buffer = new BitBuffer();

    buffer.appendBits(0b01000010, 8);
    buffer.appendBits(0b11101100, 8);

    expect(buffer.toBytes()).toEqual(new Uint8Array([0x42, 0xec]));
  });
});
