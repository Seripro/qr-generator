import { describe, expect, it } from "vitest";
import { encodeByteMode, encodeUtf8 } from "./encoder.js";
import { VERSION_1 } from "./version.js";

describe("encodeUtf8", () => {
  it("ASCII文字列をUTF-8に変換できる", () => {
    const result = encodeUtf8("Hello");

    expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]);
  });

  it("日本語をUTF-8に変換できる", () => {
    const result = encodeUtf8("こ");

    expect(Array.from(result)).toEqual([0xe3, 0x81, 0x93]);
  });
});

describe("Version 1-L", () => {
  it("データ容量が19 codewordsである", () => {
    expect(VERSION_1.dataCodewords).toBe(19);
  });

  it("誤り訂正容量が7 codewordsである", () => {
    expect(VERSION_1.errorCorrectionCodewords).toBe(7);
  });

  it("21x21である", () => {
    expect(VERSION_1.size).toBe(21);
  });
});

describe("encodeByteMode", () => {
  it("Byte Modeのデータを生成できる", () => {
    const result = encodeByteMode("A");

    expect(result.length).toBe(24);
  });
});
