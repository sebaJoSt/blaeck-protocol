---
sidebar_position: 3
---

# Data

SymbolID + DATA repeat per signal. See [Elements](../elements) for field details.

## B1 — Data (`0xB1`)

Basic data: SymbolID, DATA, StatusByte, and CRC32.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 10
---
packet-beta
  0-1: "SymbolID"
  2-3: "DATA"
  4-6: "StatusByte"
  7-8: "CRC32"
```

---

## D1 — Data (`0xD1`)

Adds RestartFlag, TimestampMode, and Timestamp (4 bytes).

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 10
---
packet-beta
  0-2: "RestartFlag"
  3-6: "TimestampMode"
  7-9: "Timestamp"
  10-11: "SymbolID"
  12-13: "DATA"
  14-16: "StatusByte"
  17-18: "CRC32"
```

---

## D2 — Data (`0xD2`)

Adds SchemaHash and StatusPayload. Timestamp grows to 8 bytes.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 13
---
packet-beta
  0-2: "RestartFlag"
  3-5: "SchemaHash"
  6-9: "TimestampMode"
  10-12: "Timestamp"
  13-14: "SymbolID"
  15-16: "DATA"
  17-19: "StatusByte"
  20-23: "StatusPayload"
  24-25: "CRC32"
```
