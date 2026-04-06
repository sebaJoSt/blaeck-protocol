---
sidebar_position: 1
slug: overview
---

# BlaeckSerial 6.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type, device) |
| `D2` | Data | Timestamped signal values with schema hash, status, and CRC32 |
| `B3` | Devices | Device information (polled) |
| `C0` | Restart Notification | Device info sent once on boot |

## Key field layouts

### B0 — Symbol List

| Field | Type | Size |
|-------|------|------|
| MasterSlaveConfig | `uint8` | 1 B |
| SlaveID | `uint8` | 1 B |
| SymbolName | `string` + `\0` | variable |
| DTYPE | `uint8` | 1 B |

Repeated per signal.

### D2 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| RestartFlag | `uint8` | 1 B | |
| SchemaHash | `uint16` LE | 2 B | Hash of signal schema |
| TimestampMode | `uint8` | 1 B | 0 = none, 1 = micros, 2 = UNIX |
| Timestamp | `uint64` LE | 8 B | Only present if TimestampMode > 0 |
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |
| StatusByte | `uint8` | 1 B | 0x00 = Normal, 0x01 = I2C slave skip |
| StatusPayload | `bytes` | 4 B | Additional status data |
| CRC32 | `uint32` LE | 4 B | MsgKey through StatusPayload |

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

### C0 — Restart Notification

Same payload as B3, sent once on boot.

## Status codes

| Code | Name | Description |
|------|------|-------------|
| `0x00` | Normal | No errors |
| `0x01` | I2C Slave Skip | An I2C slave was skipped |

## Changes from v5.0.0

- D1 → D2: added **SchemaHash** (2 B `uint16`)
- Timestamp widened from 4 B (`uint32`) to 8 B (`uint64`)
- Added **StatusPayload** (4 B) after StatusByte
- CRC32 scope expanded to include StatusByte + StatusPayload
- TimestampMode value `2` changed from RTC to UNIX

See [Protocol Spec](/protocol/intro) for full element definitions.
