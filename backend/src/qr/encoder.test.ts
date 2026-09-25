import { describe, expect, it } from "vitest";
import { encodeByteMode, encodeUtf8 } from "./encoder.js";

describe("encodeUtf8", () => {
  it("ASCII文字列をUTF-8に変換できる", () => {
    const result = encodeUtf8("Hello");

    expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]);
  });

  it("日本語をUTF-8に変換できる", () => {
    const result = encodeUtf8("こ");

    expect(Array.from(result)).toEqual([0xe3, 0x81, 0x93]);
  });

  it("空文字を処理できる", () => {
    const result = encodeUtf8("");

    expect(result.length).toBe(0);
  });
});

describe("encodeByteMode", () => {
  it("Byte Modeのビット列を作れる", () => {
    const result = encodeByteMode("A");

    expect(result.toString()).toBe("0100" + "00000001" + "01000001" + "0000");
  });
});
