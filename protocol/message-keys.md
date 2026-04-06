---
sidebar_position: 3
---

# Message Keys

The message key is a single byte in the [frame envelope](frame-format) that identifies the payload type. Keys are grouped by function:

- **B-series** — Configuration messages (symbol lists, device info)
- **C-series** — Control messages (restart notification)
- **D-series** — Data messages (signal values)

## Summary Table

| Key | Hex | Purpose |
|-----|-----|---------|
| B0 | `0xB0` | Symbol List |
| B3 | `0xB3` | Devices (serial) |
| B6 | `0xB6` | Devices (TCP) |
| C0 | `0xC0` | Restart Notification |
| D2 | `0xD2` | Data (timestamped, with schema hash) |

For deprecated keys (B1, B2, B4, B5, D1), see [Historical Keys](historical).

---

## Active Key Definitions

### B0 — Symbol List (`0xB0`)

Enumerates all signals the device exposes. Sent in response to a host request.

**Element layout** (repeated per signal):

| Field | Size | Type | Notes |
|-------|------|------|-------|
| MasterSlaveConfig | 1 byte | uint8 | `0x01` = master/local, `0x02` = slave/upstream |
| SlaveID | 1 byte | uint8 | `0x00` for master |
| SymbolName | variable | null-terminated string | Signal name |
| DTYPE | 1 byte | uint8 | [Datatype code](datatypes) |

:::note
Early protocol versions used a different B0 layout with a 2-byte `SymbolID` instead of `MasterSlaveConfig`/`SlaveID`. All current versions use the layout shown above.
:::

Some implementations label these bytes `SlaveID_hi` and `SlaveID_lo`. The wire format is identical.

---

### B3 — Devices, Serial (`0xB3`)

Reports device identity for serial-connected devices.

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| MasterSlaveConfig | 1 byte | uint8 |
| SlaveID | 1 byte | uint8 |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |

See [Elements](elements) for field definitions.

---

### B6 — Devices, TCP (`0xB6`)

Reports device identity for network-connected devices. Extends B3 with TCP-specific fields.

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| SlaveID_hi | 1 byte | uint8 (always `0x00`) |
| SlaveID_lo | 1 byte | uint8 (always `0x00`) |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |
| ClientNo | variable | null-terminated string |
| ClientDataEnabled | variable | null-terminated string |
| ServerRestarted | variable | null-terminated string |
| DeviceType | variable | null-terminated string (`"server"` or `"hub"`) |
| Parent | variable | null-terminated string |

---

### C0 — Restart Notification (`0xC0`)

Sent when a device restarts. Allows the host to re-request the symbol list and reset state.

**Serial implementations** — Same payload as [B3](#b3--devices-serial-0xb3):

| Field | Size | Type |
|-------|------|------|
| MasterSlaveConfig | 1 byte | uint8 |
| SlaveID | 1 byte | uint8 |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |

**Hub mode** — Same fields with fixed values:
- `MasterSlaveConfig` = `0x02` (slave/upstream)
- `SlaveID` = `0x01`
- Fixed Message ID = `0x00000001`

---

### D2 — Data (`0xD2`)

Current data message with 8-byte timestamps, schema hash, and status payload.

**Element layout:**

| Field | Size | Type | Notes |
|-------|------|------|-------|
| RestartFlag | 1 byte | uint8 | `0x01` on first frame after restart |
| SchemaHash | 2 bytes | uint16 LE | [CRC16-CCITT](schema-hash) over signal schema |
| TimestampMode | 1 byte | uint8 | `0` = none, `1` = micros, `2` = UNIX |
| Timestamp | 8 bytes | uint64 LE | **Conditional:** only present if TimestampMode > 0 |
| *Per signal:* | | | |
| SymbolID | 2 bytes | uint16 LE | Signal index |
| DATA | variable | — | Value bytes, size per [datatype](datatypes) |
| StatusByte | 1 byte | uint8 | [Status code](status-codes) |
| StatusPayload | 4 bytes | — | Status-specific data |
| CRC32 | 4 bytes | uint32 LE | [CRC32](crc32) over MsgKey through StatusPayload |

See [Timestamps](timestamps) for timestamp modes, [Status Codes](status-codes) for status values, and [CRC32](crc32) for the checksum algorithm.
