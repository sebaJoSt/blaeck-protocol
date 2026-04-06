---
sidebar_position: 1
---

# BlaeckTCP 2.0.0

## Active message keys

| Key  | Direction | Purpose            | CRC |
| ---- | --------- | ------------------ | --- |
| `B0` | Out       | Signal metadata    | No  |
| `B1` | Out       | Signal data        | Yes |
| `B4` | Out       | Device identity    | No  |

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

### B4 — Device identity

| Field             | Size     | Encoding        |
| ----------------- | -------- | --------------- |
| SlaveID_hi        | 1 byte   | uint8           |
| SlaveID_lo        | 1 byte   | uint8           |
| DeviceName        | variable | null-terminated |
| HWVersion         | variable | null-terminated |
| FWVersion         | variable | null-terminated |
| LibVersion        | variable | null-terminated |
| LibName           | variable | null-terminated |
| ClientNo          | variable | null-terminated |
| ClientDataEnabled | variable | null-terminated |

## Status codes

| Code   | Meaning |
| ------ | ------- |
| `0x00` | Normal  |

## Changes from v1.0.0

- `B3` → `B4`: added **ClientNo** and **ClientDataEnabled** fields for multi-client support.

See [Protocol Spec](/protocol/intro) for full element definitions.
