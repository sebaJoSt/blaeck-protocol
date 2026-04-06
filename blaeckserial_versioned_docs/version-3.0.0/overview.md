---
sidebar_position: 1
---

# BlaeckSerial 3.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type, device) |
| `B1` | Data | Signal values with CRC32 and status |
| `B2` | Devices | Device information |

## Key field layouts

### B0 — Symbol List

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| SymbolName | `string` + `\0` | variable |
| DTYPE | `uint8` | 1 B |

Repeated per signal.

### B1 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |
| StatusByte | `uint8` | 1 B | 0x00 = Normal, 0x01 = I2C CRC error |
| CRC32 | `uint32` LE | 4 B | MsgKey through last data byte |

### B2 — Devices

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| DeviceName | `string` + `\0` | variable |
| HWVersion | `string` + `\0` | variable |
| FWVersion | `string` + `\0` | variable |
| LibVersion | `string` + `\0` | variable |

## Status codes

| Code | Name | Description |
|------|------|-------------|
| `0x00` | Normal | No errors |
| `0x01` | I2C CRC Error | CRC mismatch on I2C bus |

## Changes from v2.0.0

- Added **CRC32** (4 B) to B1 data frame for integrity checking
- Added **StatusByte** (1 B) to B1 data frame
- CRC scope: MsgKey through last data byte

See [Protocol Spec](/protocol/intro) for full element definitions.
