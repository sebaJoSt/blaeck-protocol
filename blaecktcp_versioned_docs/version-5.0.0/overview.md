---
sidebar_position: 1
---

# BlaeckTCP 5.0.0

## Active message keys

| Key  | Direction | Purpose                 | CRC |
| ---- | --------- | ----------------------- | --- |
| `B0` | Out       | Signal metadata         | No  |
| `D1` | Out       | Signal data + timestamp | Yes |
| `B5` | Out       | Device identity         | No  |

## Key field layouts

### B0 — Signal metadata *(per signal)*

| Field      | Size     | Encoding        |
| ---------- | -------- | --------------- |
| SlaveID_hi | 1 byte   | `0x00`          |
| SlaveID_lo | 1 byte   | `0x00`          |
| SymbolName | variable | null-terminated |
| DataType   | 1 byte   | type enum       |

### D1 — Signal data *(repeats per signal)*

| Field         | Size     | Encoding                                |
| ------------- | -------- | --------------------------------------- |
| RestartFlag   | 1 byte   | boolean                                 |
| TimestampMode | 1 byte   | mode selector                           |
| Timestamp     | 4 bytes  | uint32 LE *(only if TimestampMode > 0)* |
| SignalIndex   | 2 bytes  | int16 LE *(per signal)*                 |
| Value         | variable | type-dependent *(per signal)*           |
| StatusByte    | 1 byte   | status code                             |
| CRC32         | 4 bytes  | uint32 LE                               |

> **CRC scope:** MsgKey through last data byte (before StatusByte).

### B5 — Device identity

| Field             | Size     | Encoding                                           |
| ----------------- | -------- | -------------------------------------------------- |
| SlaveID_hi        | 1 byte   | uint8                                              |
| SlaveID_lo        | 1 byte   | uint8                                              |
| DeviceName        | variable | null-terminated                                    |
| HWVersion         | variable | null-terminated                                    |
| FWVersion         | variable | null-terminated                                    |
| LibVersion        | variable | null-terminated                                    |
| LibName           | variable | null-terminated                                    |
| ClientNo          | variable | null-terminated                                    |
| ClientDataEnabled | variable | null-terminated                                    |
| ServerRestarted   | variable | null-terminated (`"true"` on first call, then `"false"`) |

## Status codes

| Code   | Meaning |
| ------ | ------- |
| `0x00` | Normal  |

## Changes from v3.0.0

- `B1` → `D1`: added **RestartFlag** and conditional **Timestamp** (4 B uint32 LE).
- No v4 release was published.

See [Protocol Spec](/protocol/intro) for full element definitions.
