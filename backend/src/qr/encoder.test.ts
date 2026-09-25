import { describe, expect, it } from "vitest";
import { encodeByteMode, encodeDataCodewords, encodeUtf8 } from "./encoder.js";
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

  it("Version 1-Lのデータ領域を19 codewordsまで埋める", () => {
    const result = encodeByteMode("A");

    expect(result.length).toBe(152);
  });

  it("Pad BytesがECと11で埋められる", () => {
    const result = encodeByteMode("A");

    const bits = result.toArray();

    // 最後の16bit
    const last16Bits = bits.slice(-16).join("");

    expect(last16Bits).toBe("11101100" + "00010001");
  });
});

describe("encodeByteMode", () => {
  it("Byte Modeのデータを生成できる", () => {
    const result = encodeByteMode("A");

    expect(result.length).toBe(152);
  });
});

describe("encodeDataCodewords", () => {
  it("Version 1-Lの19個のData Codewordを生成できる", () => {
    const result = encodeDataCodewords("A");

    expect(result.length).toBe(19);
  });

  it("Pad Byteが正しく入っている", () => {
    const result = encodeDataCodewords("A");

    expect(result[0]).toBe(0x40);
    expect(result[1]).toBe(0x14);
    expect(result[2]).toBe(0x10);
    expect(result[3]).toBe(0xec);
    expect(result[4]).toBe(0x11);
  });
});
