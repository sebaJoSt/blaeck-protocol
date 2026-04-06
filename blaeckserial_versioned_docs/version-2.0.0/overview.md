---
sidebar_position: 1
---

# BlaeckSerial 2.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type, device) |
| `B1` | Data | Signal values (no integrity check) |
| `B2` | Devices | Device information |

## Key field layouts

### B0 — Symbol List

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| SymbolName | `string` + `\0` | variable |
| DTYPE | `uint8` | 1 B |

Repeated per signal. SymbolID removed; devices identified by MSC + SlaveID.

### B1 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |

No CRC. No StatusByte.

### B2 — Devices

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| DeviceName | `string` + `\0` | variable |
| HWVersion | `string` + `\0` | variable |
| FWVersion | `string` + `\0` | variable |
| LibVersion | `string` + `\0` | variable |

## MasterSlaveConfig values

| Value | Meaning |
|-------|---------|
| `0` | Single |
| `1` | Master |
| `2` | Slave |

## Status codes

None defined in this version.

## Changes from v1.0.0

- Added I2C multi-device support (MasterSlaveConfig + SlaveID)
- Removed SymbolID from B0; replaced with MSC + SlaveID fields
- Added `B2` devices frame and `GET_DEVICES` command

See [Protocol Spec](/protocol/intro) for full element definitions.
