# QR Code Generator

React + Hono + TypeScriptで実装したQRコードジェネレーターです。

QRコードのデータエンコード、誤り訂正、Matrix生成、Mask処理、SVG描画までの一連の生成処理を実装しています。

生成したQRコードはiPhoneのカメラで読み取れることを確認しています。

## Features

現在は以下の仕様に対応しています。

- QR Code Version 1
- Error Correction Level L
- Byte Mode
- UTF-8
- Reed-Solomon Error Correction
- 8種類のMask Pattern
- Mask PenaltyによるMask選択
- Format Information
- QR Matrixへのデータ配置
- SVGによるQRコード描画
- Hono API
- React UI

## Architecture

```text
React
  │
  │ POST /qr
  │ { text: "Hello" }
  ↓
Hono API
  │
  ├── QR Encoder
  │     ├── UTF-8 / Byte Mode
  │     ├── Data Codewords
  │     └── Reed-Solomon
  │
  ├── QR Matrix
  │     ├── Finder Pattern
  │     ├── Separator
  │     ├── Timing Pattern
  │     ├── Dark Module
  │     ├── Data Placement
  │     └── Format Information
  │
  ├── Mask
  │     └── 8種類からPenaltyが最小のものを選択
  │
  └── SVG Renderer
        │
        ↓
      SVG
        │
        ↓
     React表示
```

## Tech Stack

- React
- TypeScript
- Vite
- Hono
- Vitest

## Project Structure

```text
backend/
└── src/
    └── qr/
        ├── bitBuffer.ts
        ├── encoder.ts
        ├── version.ts
        ├── gf256.ts
        ├── polynomial.ts
        ├── reedSolomon.ts
        ├── matrix.ts
        ├── formatInfo.ts
        ├── mask.ts
        ├── maskPenalty.ts
        ├── dataPlacement.ts
        ├── qrCode.ts
        └── renderer.ts
```

## QR Code Generation Flow

入力された文字列は、以下の流れでQRコードになります。

### 1. UTF-8へ変換

入力文字列をUTF-8のバイト列へ変換します。

### 2. Byte Modeへエンコード

QRコードのMode Indicator、Character Count、データ本体、Terminator、Paddingを組み立てます。

Version 1-Lではデータ領域が19 Codewordsのため、容量を超えたデータはエラーとして扱います。

### 3. Reed-Solomon Error Correction

GF(256)上でReed-Solomon符号を計算し、Error Correction Codewordsを生成します。

### 4. QR Matrixを構築

21×21のMatrixを作成し、

- Finder Pattern
- Separator
- Timing Pattern
- Dark Module
- Format Information領域

を配置します。

その後、データCodewordsをQRコードの配置規則に従ってMatrixへ配置します。

### 5. Maskを選択

Mask Patternを0〜7まで適用し、それぞれのPenaltyを計算します。

Penaltyが最も小さいMaskを採用します。

### 6. Format Informationを配置

Error Correction LevelとMask PatternからFormat Informationを生成し、Matrixへ配置します。

### 7. SVGへ変換

完成したMatrixをSVGへ変換し、Reactで表示します。

## API

### `POST /qr`

QRコードを生成します。

Request:

```json
{
  "text": "Hello"
}
```

Response:

```json
{
  "svg": "<svg ...></svg>"
}
```

現在はVersion 1-Lに対応しているため、入力できるデータ量には制限があります。

## Testing

Vitestを使用して各処理をテストしています。

```bash
npm test
```

エンコード、GF(256)、Reed-Solomon、Matrix、Mask、データ配置などの各処理を個別にテストしています。

また、最終的に生成したQRコードをiPhoneのカメラで読み取り、実際のQRコードとして認識できることを確認しています。

## Current Limitations

現在は以下の制限があります。

- Version 1のみ
- Error Correction Level Lのみ
- Byte Modeのみ
- 大きなデータには対応していない
- UTF-8データはVersion 1-Lの容量に収まる範囲のみ対応

## Purpose

QRコードの仕様を理解することを目的として、以下の処理を実装しています。

- データのエンコード
- GF(256)による演算
- Reed-Solomon誤り訂正
- QR Matrixの構築
- データ配置
- Mask Pattern
- Format Information
- SVGへの変換

QRコードの内部処理から最終的なWeb表示までを一通り扱う構成になっています。

## Future Work

必要に応じて以下の拡張を検討しています。

- Version 2〜10への対応
- Error Correction Level M/Q/Hへの対応
- 数字モード・英数字モードへの対応
- 日本語データへの対応
- QRコードのダウンロード
- UIの改善
