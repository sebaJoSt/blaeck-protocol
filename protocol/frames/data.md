---
sidebar_position: 3
---

# Data

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

| Element | Size | Type |
|-------|------|------|
| **SymbolID** | 2 bytes | uint16 |
| **DATA** | variable | per [DTYPE](../datatypes) |
| StatusByte | 1 byte | uint8 |
| CRC32 | 4 bytes | uint32 |

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

| Element | Size | Type |
|-------|------|------|
| RestartFlag | 1 byte | uint8 |
| TimestampMode | 1 byte | uint8 |
| Timestamp | 4 bytes | uint32 |
| **SymbolID** | 2 bytes | uint16 |
| **DATA** | variable | per [DTYPE](../datatypes) |
| StatusByte | 1 byte | uint8 |
| CRC32 | 4 bytes | uint32 |

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

| Element | Size | Type |
|-------|------|------|
| RestartFlag | 1 byte | uint8 |
| SchemaHash | 2 bytes | uint16 |
| TimestampMode | 1 byte | uint8 |
| Timestamp | 8 bytes | uint64 |
| **SymbolID** | 2 bytes | uint16 |
| **DATA** | variable | per [DTYPE](../datatypes) |
| StatusByte | 1 byte | uint8 |
| StatusPayload | 4 bytes | raw bytes |
| CRC32 | 4 bytes | uint32 |

See [Timestamps](../timestamps) for timestamp modes, [Status Codes](../status-codes) for status values, and [CRC32](../crc32) for the checksum algorithm.
