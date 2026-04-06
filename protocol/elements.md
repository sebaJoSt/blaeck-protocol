---
sidebar_position: 4
---

# Elements

This page defines every field that can appear in the elements section of a Blaeck [frame](frame-format). Fields are grouped by function.

## Device Identity Fields

### MasterSlaveConfig

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x01` = master (local device), `0x02` = slave (upstream device) |
| Used in | B0, B3, B6 (as SlaveID_hi), C0 |

### SlaveID

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00` for master; device-specific for slaves |
| Used in | B0, B3, B6 (as SlaveID_lo), C0 |

:::note
In B6 messages, these bytes are named `SlaveID_hi` and `SlaveID_lo`. Both are always `0x00`.
:::

### DeviceName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B6, C0 |

User-defined name identifying the device.

### HWVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B6, C0 |

Hardware version string.

### FWVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B6, C0 |

Firmware version string.

### LibVersion

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B6, C0 |

Library version string (e.g., `"6.0.0"`).

### LibName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B3, B6, C0 |

Library name string.

---

## TCP-Specific Fields

These fields appear only in TCP device messages (B6).

### ClientNo

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B6 |

Client number as a string.

### ClientDataEnabled

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B6 |

Whether data streaming is enabled for this client (`"true"` / `"false"`).

### ServerRestarted

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B6 |

Whether the server has restarted since the client connected.

### DeviceType

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Values | `"server"` or `"hub"` |
| Used in | B6 |

Indicates the device's role in the network topology.

### Parent

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B6 |

Identifier of the parent device in the topology.

---

## Signal Definition Fields

These fields appear in B0 (Symbol List) messages.

### SymbolName / SignalName

| Property | Value |
|----------|-------|
| Size | Variable |
| Type | Null-terminated string |
| Used in | B0 |

Human-readable name of the signal. Also referred to as "SignalName"; the wire format is identical.

### DTYPE / DatatypeCode

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00`–`0x09` |
| Used in | B0 |

Numeric code identifying the signal's data type. See [Datatypes](datatypes) for the full table.

---

## Signal Data Fields

These fields appear in data messages (D2, and earlier B1/D1).

### SymbolID / SignalIndex

| Property | Value |
|----------|-------|
| Size | 2 bytes |
| Type | uint16, little-endian |
| Used in | D2 |

Zero-based index of the signal, matching the order in the B0 symbol list.

### DATA

| Property | Value |
|----------|-------|
| Size | Variable (determined by [DTYPE](datatypes)) |
| Type | Raw bytes, little-endian |
| Used in | D2 |

The signal's current value. Size is determined by the signal's datatype: 1 byte for `bool`/`byte`, up to 8 bytes for `double`.

---

## Data Frame Control Fields

### RestartFlag

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0x00` = normal, `0x01` = first frame after restart |
| Used in | D2 |

Signals to the receiver that this is the first data frame after a device restart.

### SchemaHash

| Property | Value |
|----------|-------|
| Size | 2 bytes |
| Type | uint16, little-endian |
| Algorithm | CRC16-CCITT |
| Used in | D2 |

Hash of the signal schema (names + types). Allows the receiver to detect schema changes without requiring a full B0 retransmission. See [Schema Hash](schema-hash).

### TimestampMode

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Values | `0` = none, `1` = micros, `2` = UNIX |
| Used in | D2 |

Determines whether a timestamp field follows and how to interpret it. See [Timestamps](timestamps).

### Timestamp

| Property | Value |
|----------|-------|
| Size | 8 bytes (D2) or 4 bytes (D1) |
| Type | uint64 LE (D2) or uint32 LE (D1) |
| Conditional | Only present if TimestampMode > 0 |
| Used in | D2 |

The timestamp value. Interpretation depends on [TimestampMode](timestamps).

---

## Integrity Fields

### StatusByte

| Property | Value |
|----------|-------|
| Size | 1 byte |
| Type | uint8 |
| Used in | D2 |

Indicates the device or hub status at the time of transmission. See [Status Codes](status-codes).

### StatusPayload

| Property | Value |
|----------|-------|
| Size | 4 bytes |
| Type | Raw bytes |
| Used in | D2 |

Additional data associated with the [StatusByte](status-codes). Content depends on the status code.

### CRC32

| Property | Value |
|----------|-------|
| Size | 4 bytes |
| Type | uint32, little-endian |
| Algorithm | CRC-32/ISO-HDLC |
| Used in | D2 |

Integrity checksum over the frame payload. See [CRC32](crc32) for the algorithm and scope details.
