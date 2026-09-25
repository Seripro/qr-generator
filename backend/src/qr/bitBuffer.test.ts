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
});
