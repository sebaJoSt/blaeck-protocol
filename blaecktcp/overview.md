---
sidebar_position: 1
---

# BlaeckTCP 6.0.0

## Active message keys

| Key  | Direction | Purpose                    | CRC |
| ---- | --------- | -------------------------- | --- |
| `B0` | Out       | Signal metadata            | No  |
| `D2` | Out       | Signal data + timestamp    | Yes |
| `B6` | Out       | Device identity            | No  |

## Key field layouts

### B0 — Signal metadata *(per signal)*

| Field        | Size       | Encoding        |
| ------------ | ---------- | --------------- |
| SlaveID_hi   | 1 byte     | `0x00`          |
| SlaveID_lo   | 1 byte     | `0x00`          |
| SymbolName   | variable   | null-terminated |
| DataType     | 1 byte     | type enum       |

### D2 — Signal data *(repeats per signal)*

| Field         | Size       | Encoding                                |
| ------------- | ---------- | --------------------------------------- |
| RestartFlag   | 1 byte     | boolean                                 |
| SchemaHash    | 2 bytes    | uint16 LE                               |
| TimestampMode | 1 byte     | `0`=none, `1`=micros, `2`=UNIX          |
| Timestamp     | 8 bytes    | uint64 LE *(only if TimestampMode > 0)* |
| SignalIndex   | 2 bytes    | int16 LE *(per signal)*                 |
| Value         | variable   | type-dependent *(per signal)*           |
| StatusByte    | 1 byte     | status code                             |
| StatusPayload | 4 bytes    | status-dependent                        |
| CRC32         | 4 bytes    | uint32 LE                               |

> **CRC scope:** MsgKey through StatusPayload.

### B6 — Device identity

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
| ServerRestarted   | variable | null-terminated |
| DeviceType        | variable | null-terminated (`"server"`) |
| Parent            | variable | null-terminated (`"0"`)      |

> **Client identity:** parsed from `GET_DEVICES` 6th/7th params (Name, Type). NOT in outbound frames.

## Status codes

| Code   | Meaning |
| ------ | ------- |
| `0x00` | Normal  |

## Changes from v5.0.0

- `D1` → `D2`: added **SchemaHash** (2 B uint16 LE), expanded **Timestamp** to 8 bytes (uint64 LE), added **StatusPayload** (4 B).
- `B5` → `B6`: added **DeviceType** and **Parent** fields.
- Client identity parsed from `GET_DEVICES`; not present in outbound frames.

See [Protocol Spec](/protocol/intro) for full element definitions.
