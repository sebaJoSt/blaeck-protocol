---
sidebar_position: 1
---

# blaecktcpy 3.0

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

### Additional message keys

| Key  | Hex    | MsgID        | Direction | Description                    |
| ---- | ------ | ------------ | --------- | ------------------------------ |
| C0   | `0xC0` | `0x00000001` | Response  | Upstream restart notification  |

#### C0 — Upstream Restart

Fixed MsgID `0x00000001`.

| Field             | Size     | Description                        |
| ----------------- | -------- | ---------------------------------- |
| MasterSlaveConfig | 1 B      | `0x02` (slave / upstream)          |
| SlaveID           | 1 B      | `0x01`                             |
| DeviceName        | str + \0 | Null-terminated device name        |
| HWVersion         | str + \0 | Hardware version                   |
| FWVersion         | str + \0 | Firmware version                   |
| LibVersion        | str + \0 | Library version                    |
| LibName           | str + \0 | Library name                       |

### Hub status codes

| Code   | Name                  | Description                                  | StatusPayload                                                                                      |
| ------ | --------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `0x80` | UPSTREAM_LOST         | Upstream server disconnected                 | byte\[0\]: `0x01` = auto-reconnect enabled, `0x00` = off; bytes\[1–3\]: `0x00`                    |
| `0x81` | UPSTREAM_RECONNECTED  | Upstream server reconnected                  | `0x00000000`                                                                                       |

### Differences from server mode

- **B0**: Master signals listed first, then slave signals with `MasterSlaveConfig = 0x02` and remapped SlaveIDs.
- **B6**: Contains multiple device entries — the hub device itself plus each upstream device.
- **C0**: New key for upstream restart notification (not present in server mode).
- **Status codes**: Additional hub-specific codes (`0x80`, `0x81`) for upstream connection events.
- **Schema hash validation**: Hub validates the schema hash across aggregated upstream devices.
- **Auto-reconnect**: Hub can automatically reconnect to lost upstream servers.

## Changes from v2.0.0

- Added **hub mode** with multi-device aggregation of upstream BlaeckTCP servers.
- New message key **C0** (Upstream Restart) for hub-to-client restart notification.
- Hub status codes **0x80** (UPSTREAM_LOST) and **0x81** (UPSTREAM_RECONNECTED).
- Auto-reconnect support for lost upstream connections.

See [Protocol Spec](/protocol/intro) for full element definitions.
