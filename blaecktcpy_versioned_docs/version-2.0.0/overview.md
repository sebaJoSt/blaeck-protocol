---
sidebar_position: 1
---

# blaecktcpy 2.0.0

## Server Mode

### Active message keys

| Key  | Hex    | Direction | Description                          |
| ---- | ------ | --------- | ------------------------------------ |
| B0   | `0xB0` | Response  | Signal list (name, datatype, source) |
| B6   | `0xB6` | Response  | Device information                   |
| D2   | `0xD2` | Response  | Data frame with signals and status   |

### Key field layouts

#### B0 — Signal List

Repeated once per signal:

| Field             | Size     | Description                                            |
| ----------------- | -------- | ------------------------------------------------------ |
| MasterSlaveConfig | 1 B      | `0x01` = master (local device)                         |
| SlaveID           | 1 B      | Slave identifier                                       |
| SignalName        | str + \0 | Null-terminated signal name                            |
| DatatypeCode      | 1 B      | Signal datatype code                                   |

#### B6 — Device Information

| Field            | Size     | Description                  |
| ---------------- | -------- | ---------------------------- |
| MasterSlaveConfig| 1 B      | `0x01` = master              |
| SlaveID          | 1 B      | Slave identifier             |
| DeviceName       | str + \0 | Null-terminated device name  |
| HWVersion        | str + \0 | Hardware version             |
| FWVersion        | str + \0 | Firmware version             |
| LibVersion       | str + \0 | Library version              |
| LibName          | str + \0 | Library name                 |
| AssignedClientID | str + \0 | Assigned client ID           |
| DataEnabled      | str + \0 | Data enabled flag            |
| ServerRestarted  | str + \0 | Server restarted flag        |
| DeviceType       | str + \0 | Device type (default `"server"`) |
| Parent           | str + \0 | Parent identifier (default `"0"`) |

#### D2 — Data Frame

| Field          | Size                | Description                                              |
| -------------- | ------------------- | -------------------------------------------------------- |
| RestartFlag    | 1 B                 | Restart indicator                                        |
| SchemaHash     | 2 B uint16 LE       | CRC16-CCITT schema hash                                  |
| TimestampMode  | 1 B                 | Timestamp mode selector                                  |
| Timestamp      | 8 B uint64 LE       | Timestamp value (only present if TimestampMode&nbsp;>&nbsp;0) |
| *Per signal:*  |                     |                                                          |
| SymbolID       | 2 B                 | Signal symbol identifier                                 |
| DATA           | variable            | Signal data                                              |
| StatusByte     | 1 B                 | Status code                                              |
| StatusPayload  | 4 B                 | Status payload                                           |
| CRC32          | 4 B LE              | CRC-32 checksum                                          |

### Status codes

| Code   | Name   | Description    |
| ------ | ------ | -------------- |
| `0x00` | Normal | Normal status  |

## Hub Mode

Hub mode is not available in this version.

See [Protocol Spec](/protocol/intro) for full element definitions.
