---
sidebar_position: 4
---

# Elements

This page defines every field that can appear in the elements section of a Blaeck [frame](frame-format). See each frame's sub-page under [Frames](frames) for the exact layout.

### ClientDataEnabled

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B4, B5, B6 |

Whether data streaming is enabled for this client (`"true"` / `"false"`).

### ClientNo

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B4, B5, B6 |

Client number as a string.

### CRC32

| Property | Value |
|----------|-------|
| Size | 4 bytes |
| Type | uint32, little-endian |
| Algorithm | CRC-32/ISO-HDLC |
| Used in | B1, D1, D2 |

Integrity checksum over the frame payload. See [CRC32](crc32) for the algorithm and scope details.

### DATA

| Property | Value |
|----------|-------|
| Size | Variable (determined by [DTYPE](datatypes)) |
| Type | Raw bytes, little-endian |
| Used in | B1, D1, D2 |

The signal's current value. Size is determined by the signal's datatype: 1 byte for `bool`/`byte`, up to 8 bytes for `double`.

### DeviceName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B2, B3, B4, B5, B6, C0 |

User-defined name identifying the device.

### DeviceType

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Values | `"server"` or `"hub"` |
| Used in | B6 |

Indicates the device's role in the network topology.

### DTYPE

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00`–`0x09` |
| Used in | B0 |

Numeric code identifying the signal's data type. See [Datatypes](datatypes) for the full table.

### FWVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B2, B3, B4, B5, B6, C0 |

Firmware version string.

### HWVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B2, B3, B4, B5, B6, C0 |

Hardware version string.

### LibName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B4, B5, B6, C0 |

Library name string.

### LibVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B2, B3, B4, B5, B6, C0 |

Library version string (e.g., `"6.0.0"`).

### MasterSlaveConfig

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x01` = master (local device), `0x02` = slave (upstream device) |
| Used in | B0, B2, B3, C0 |

:::note
In B4, B5, and B6 messages, this field is replaced by `SlaveID_hi` and `SlaveID_lo` (both always `0x00`).
:::

### Parent

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B6 |

Identifier of the parent device in the topology.

### RestartFlag

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00` = normal, `0x01` = first frame after restart |
| Used in | D1, D2 |

Signals to the receiver that this is the first data frame after a device restart.

### SchemaHash

| Property | Value |
|----------|-------|
| Size | 2 bytes |
| Type | uint16, little-endian |
| Algorithm | CRC16-CCITT |
| Used in | D2 |

Hash of the signal schema (names + types). Allows the receiver to detect schema changes without requiring a full B0 retransmission. See [Schema Hash](schema-hash).

### ServerRestarted

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B5, B6 |

Whether the server has restarted since the client connected.

### SlaveID

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00` for master; device-specific for slaves |
| Used in | B0, B2, B3, C0 |

### StatusByte

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Used in | B1, D1, D2 |

Indicates the device or hub status at the time of transmission. See [Status Codes](status-codes).

### StatusPayload

| Property | Value |
|----------|-------|
| Size | 4 bytes |
| Type | Raw bytes |
| Used in | D2 |

Additional data associated with the [StatusByte](status-codes). Content depends on the status code.

### SymbolID

| Property | Value |
|----------|-------|
| Size | 2 bytes |
| Type | uint16, little-endian |
| Used in | B1, D1, D2 |

Zero-based index of the signal, matching the order in the B0 symbol list.

### SymbolName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B0 |

Human-readable name of the signal.

### Timestamp

| Property | Value |
|----------|-------|
| Size | 4 bytes (D1) or 8 bytes (D2) |
| Type | uint32 LE (D1) or uint64 LE (D2) |
| Conditional | Only present if TimestampMode > 0 |
| Used in | D1, D2 |

The timestamp value. Interpretation depends on [TimestampMode](timestamps).

### TimestampMode

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0` = none, `1` = micros, `2` = UNIX |
| Used in | D1, D2 |

Determines whether a timestamp field follows and how to interpret it. See [Timestamps](timestamps).
