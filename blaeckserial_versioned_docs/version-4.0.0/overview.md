---
sidebar_position: 1
---

# BlaeckSerial 4.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type, device) |
| `B1` | Data | Signal values with CRC32 and status |
| `B3` | Devices | Device information (replaces B2) |

## Key field layouts

### B0 — Symbol List

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| SymbolName | `string` + `\0` | variable |
| DTYPE | `uint8` | 1 B |

Repeated per signal. DTYPE `0x9` (double) added.

### B1 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |
| StatusByte | `uint8` | 1 B | 0x00 = Normal, 0x01 = I2C CRC error |
| CRC32 | `uint32` LE | 4 B | MsgKey through last data byte |

### B3 — Devices

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| DeviceName | `string` + `\0` | variable |
| HWVersion | `string` + `\0` | variable |
| FWVersion | `string` + `\0` | variable |
| LibVersion | `string` + `\0` | variable |
| LibraryName | `string` + `\0` | variable |

## Status codes

| Code | Name | Description |
|------|------|-------------|
| `0x00` | Normal | No errors |
| `0x01` | I2C CRC Error | CRC mismatch on I2C bus |

## Changes from v3.0.0

- B2 → B3: added **LibraryName** field to devices frame
- Added `double` datatype (DTYPE `0x9`)
- Introduced Stream* API

See [Protocol Spec](/protocol/intro) for full element definitions.
