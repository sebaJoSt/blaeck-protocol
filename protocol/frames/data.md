---
sidebar_position: 3
---

# Data

SymbolID + DATA repeat per signal. See [Elements](../elements) for field details.

## B1 — Data (`0xB1`)

Data message without timestamps.

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

Data message with 4-byte timestamps.

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

Data message with 8-byte timestamps, schema hash, and status payload.

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
