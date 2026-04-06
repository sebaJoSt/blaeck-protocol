---
sidebar_position: 1
---

# BlaeckTCP 3.0.0

## Active message keys

| Key  | Direction | Purpose            | CRC |
| ---- | --------- | ------------------ | --- |
| `B0` | Out       | Signal metadata    | No  |
| `B1` | Out       | Signal data        | Yes |
| `B5` | Out       | Device identity    | No  |

## Key field layouts

### B0 — Signal metadata *(per signal)*

| Field      | Size     | Encoding        |
| ---------- | -------- | --------------- |
| SlaveID_hi | 1 byte   | `0x00`          |
| SlaveID_lo | 1 byte   | `0x00`          |
| SymbolName | variable | null-terminated |
| DataType   | 1 byte   | type enum       |

### B1 — Signal data *(repeats per signal)*

| Field       | Size     | Encoding                      |
| ----------- | -------- | ----------------------------- |
| SignalIndex | 2 bytes  | int16 LE *(per signal)*       |
| Value       | variable | type-dependent *(per signal)* |
| StatusByte  | 1 byte   | `0x00`                        |
| CRC32       | 4 bytes  | uint32 LE                     |

> **CRC scope:** MsgKey through last data byte.

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

## Changes from v2.0.0

- `B4` → `B5`: added **ServerRestarted** flag (`"true"` on first call per boot, then `"false"`).

See [Protocol Spec](/protocol/intro) for full element definitions.
