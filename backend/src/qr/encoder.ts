import { BitBuffer } from "./bitBuffer.js";

export function encodeUtf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function encodeByteMode(text: string): BitBuffer {
  const bytes = encodeUtf8(text);
  const buffer = new BitBuffer();

  // Mode Indicator: Byte Mode = 0100
  buffer.appendBits(0b0100, 4);

  // Character Count: Version 1〜9 / Byte Mode = 8 bits
  buffer.appendBits(bytes.length, 8);

  // Data
  for (const byte of bytes) {
    buffer.appendBits(byte, 8);
  }

  // Terminator
  buffer.appendBits(0, 4);

  // 8bit境界に合わせる
  const remainder = buffer.length % 8;

  if (remainder !== 0) {
    buffer.appendBits(0, 8 - remainder);
  }

  return buffer;
}
