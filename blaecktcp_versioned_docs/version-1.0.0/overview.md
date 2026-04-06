---
sidebar_position: 1
---

# BlaeckTCP 1.0.0

## Active message keys

| Key  | Direction | Purpose            | CRC |
| ---- | --------- | ------------------ | --- |
| `B0` | Out       | Signal metadata    | No  |
| `B1` | Out       | Signal data        | Yes |
| `B3` | Out       | Device identity    | No  |

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

### B3 — Device identity

| Field      | Size     | Encoding        |
| ---------- | -------- | --------------- |
| SlaveID_hi | 1 byte   | uint8           |
| SlaveID_lo | 1 byte   | uint8           |
| DeviceName | variable | null-terminated |
| HWVersion  | variable | null-terminated |
| FWVersion  | variable | null-terminated |
| LibVersion | variable | null-terminated |
| LibName    | variable | null-terminated |

## Status codes

| Code   | Meaning |
| ------ | ------- |
| `0x00` | Normal  |

## First release

Initial BlaeckTCP release. Started at BlaeckSerial v4 protocol level.

See [Protocol Spec](/protocol/intro) for full element definitions.
