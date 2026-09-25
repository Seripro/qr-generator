import { BitBuffer } from "./bitBuffer.js";
import { VERSION_1 } from "./version.js";

export function encodeUtf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function encodeByteMode(text: string): BitBuffer {
  const bytes = encodeUtf8(text);
  const buffer = new BitBuffer();

  const capacityBits = VERSION_1.dataCodewords * 8;

  // Mode Indicator
  buffer.appendBits(0b0100, 4);

  // Character Count
  buffer.appendBits(bytes.length, 8);

  // Data
  for (const byte of bytes) {
    buffer.appendBits(byte, 8);
  }

  // データが容量を超えている
  if (buffer.length > capacityBits) {
    throw new Error("Data too long");
  }

  // Terminator
  const remainingBits = capacityBits - buffer.length;
  const terminatorLength = Math.min(4, remainingBits);

  buffer.appendBits(0, terminatorLength);

  // 8bit境界まで0で埋める
  // 8bit境界まで0で埋める
  const alignmentBits = Math.min(
    (8 - (buffer.length % 8)) % 8,
    capacityBits - buffer.length,
  );

  buffer.appendBits(0, alignmentBits);

  // Pad Bytes
  const padBytes = [0xec, 0x11];
  let padIndex = 0;

  while (buffer.length < capacityBits) {
    const remainingBits = capacityBits - buffer.length;

    if (remainingBits < 8) {
      throw new Error("Unexpected remaining bits");
    }

    buffer.appendBits(padBytes[padIndex], 8);
    padIndex = (padIndex + 1) % padBytes.length;
  }

  return buffer;
}

export function encodeDataCodewords(text: string): Uint8Array {
  const buffer = encodeByteMode(text);

  return buffer.toBytes();
}
