---
sidebar_position: 1
---

# BlaeckSerial 5.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type, device) |
| `D1` | Data | Timestamped signal values with CRC32 and status |
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

### D1 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| RestartFlag | `uint8` | 1 B | |
| TimestampMode | `uint8` | 1 B | 0 = none, 1 = micros, 2 = RTC |
| Timestamp | `uint32` LE | 4 B | Only present if TimestampMode > 0 |
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |
| StatusByte | `uint8` | 1 B | 0x00 = Normal, 0x01 = I2C CRC error |
| CRC32 | `uint32` LE | 4 B | MsgKey through last data byte (before StatusByte) |

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
| `0x01` | I2C CRC Error | CRC mismatch on I2C bus |

## Changes from v4.3.0

- B1 → D1: added **RestartFlag** and **TimestampMode** header fields
- Conditional **Timestamp** (4 B `uint32`): only present when TimestampMode > 0
- TimestampMode values: `0` = none, `1` = micros, `2` = RTC
- Introduced conditional writes (fields omitted based on mode)

See [Protocol Spec](/protocol/intro) for full element definitions.
