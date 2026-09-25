import { describe, expect, it } from "vitest";
import { calculateFormatInfo } from "./formatInfo.js";

describe("Format Information", () => {
  it("Version 1-L / Mask 0 のFormat Informationを計算できる", () => {
    const result = calculateFormatInfo("L", 0);

    expect(result).toBe(0x77c4);
  });
});
