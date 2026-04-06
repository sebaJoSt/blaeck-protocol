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
| B1 | `0xB1` | Data (no timestamps) |
| B2 | `0xB2` | Devices (without LibName) |
| B3 | `0xB3` | Devices (with LibName) |
| B4 | `0xB4` | Devices (with ClientNo, ClientDataEnabled) |
| B5 | `0xB5` | Devices (with ServerRestarted) |
| B6 | `0xB6` | Devices (with DeviceType, Parent) |
| C0 | `0xC0` | Restart Notification |
| D1 | `0xD1` | Data (4-byte timestamps) |
| D2 | `0xD2` | Data (8-byte timestamps, schema hash, status payload) |

## Key Definitions

### B0 — Symbol List (`0xB0`)

Enumerates all signals the device exposes. Sent in response to a host request.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-12: "SymbolName"
  13-15: "DTYPE"
```

**Element layout** (repeated per signal):

| Field | Size | Type | Notes |
|-------|------|------|-------|
| **MasterSlaveConfig** | 1 byte | uint8 | `0x01` = master/local, `0x02` = slave/upstream |
| **SlaveID** | 1 byte | uint8 | `0x00` for master |
| **SymbolName** | variable | null-terminated string | Signal name |
| **DTYPE** | 1 byte | uint8 | [Datatype code](datatypes) |



---

### B1 — Data (`0xB1`)

Data message without timestamps.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "SymbolID"
  3-8: "DATA (var)"
  9-11: "Status"
  12-15: "CRC32"
```

**Element layout (without CRC):**

| Field | Size | Type |
|-------|------|------|
| **SymbolID** | 2 bytes | uint16 LE |
| **DATA** | variable | Per [DTYPE](datatypes) |

**Element layout (with CRC):**

| Field | Size | Type | Notes |
|-------|------|------|-------|
| **SymbolID** | 2 bytes | uint16 LE | |
| **DATA** | variable | Per [DTYPE](datatypes) | |
| StatusByte | 1 byte | uint8 | |
| CRC32 | 4 bytes | uint32 LE | Scope: MsgKey through last DATA byte (StatusByte **excluded**) |

---

### B2 — Devices (`0xB2`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-9: "DeviceName"
  10-11: "HWVer"
  12-13: "FWVer"
  14-15: "LibVer"
```

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| **MasterSlaveConfig** | 1 byte | uint8 |
| **SlaveID** | 1 byte | uint8 |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |

---

### B3 — Devices (`0xB3`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-9: "DeviceName"
  10-11: "HWVer"
  12-13: "FWVer"
  14-15: "LibVer"
  16-19: "LibName"
```

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| **MasterSlaveConfig** | 1 byte | uint8 |
| **SlaveID** | 1 byte | uint8 |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |
| **LibName** | variable | null-terminated string |

See [Elements](elements) for field definitions.

---

### B4 — Devices (`0xB4`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-25: "DataEnabled"
```

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| **SlaveID_hi** | 1 byte | uint8 (always `0x00`) |
| **SlaveID_lo** | 1 byte | uint8 (always `0x00`) |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |
| **LibName** | variable | null-terminated string |
| **ClientNo** | variable | null-terminated string |
| **ClientDataEnabled** | variable | null-terminated string |

---

### B5 — Devices (`0xB5`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-23: "DataEnabled"
  24-31: "ServerRestarted"
```

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| **SlaveID_hi** | 1 byte | uint8 (always `0x00`) |
| **SlaveID_lo** | 1 byte | uint8 (always `0x00`) |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |
| **LibName** | variable | null-terminated string |
| **ClientNo** | variable | null-terminated string |
| **ClientDataEnabled** | variable | null-terminated string |
| **ServerRestarted** | variable | null-terminated string |

---

### B6 — Devices (`0xB6`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-23: "DataEnabled"
  24-27: "ServerRestarted"
  28-31: "DeviceType"
  32-35: "Parent"
```

**Element layout** (repeated per device):

| Field | Size | Type |
|-------|------|------|
| **SlaveID_hi** | 1 byte | uint8 (always `0x00`) |
| **SlaveID_lo** | 1 byte | uint8 (always `0x00`) |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |
| **LibName** | variable | null-terminated string |
| **ClientNo** | variable | null-terminated string |
| **ClientDataEnabled** | variable | null-terminated string |
| **ServerRestarted** | variable | null-terminated string |
| **DeviceType** | variable | null-terminated string (`"server"` or `"hub"`) |
| **Parent** | variable | null-terminated string |

---

### C0 — Restart Notification (`0xC0`)

Sent when a device restarts. Allows the host to re-request the symbol list and reset state. Payload follows the same layout as [B3](#b3--devices-0xb3):

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-9: "DeviceName"
  10-11: "HWVer"
  12-13: "FWVer"
  14-15: "LibVer"
  16-19: "LibName"
```

| Field | Size | Type |
|-------|------|------|
| **MasterSlaveConfig** | 1 byte | uint8 |
| **SlaveID** | 1 byte | uint8 |
| **DeviceName** | variable | null-terminated string |
| **HWVersion** | variable | null-terminated string |
| **FWVersion** | variable | null-terminated string |
| **LibVersion** | variable | null-terminated string |
| **LibName** | variable | null-terminated string |

---

### D1 — Data (`0xD1`)

Data message with 4-byte timestamps.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "Restart"
  3-5: "TsMode"
  6-9: "Timestamp (4B)"
  10-12: "SymbolID"
  13-15: "DATA (var)"
  16-18: "Status"
  19-22: "CRC32"
```

**Element layout:**

| Field | Size | Type | Notes |
|-------|------|------|-------|
| RestartFlag | 1 byte | uint8 | `0x01` on first frame after restart |
| TimestampMode | 1 byte | uint8 | `0` = none, `1` = micros, `2` = RTC/UNIX |
| Timestamp | 4 bytes | uint32 LE | **Conditional:** only if TimestampMode > 0 |
| **SymbolID** | 2 bytes | uint16 LE | |
| **DATA** | variable | Per [DTYPE](datatypes) | |
| StatusByte | 1 byte | uint8 | |
| CRC32 | 4 bytes | uint32 LE | Scope: MsgKey through last DATA byte (StatusByte **excluded**) |

---

### D2 — Data (`0xD2`)

Data message with 8-byte timestamps, schema hash, and status payload.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 16
---
packet-beta
  0-2: "Restart"
  3-5: "SchemaHash"
  6-8: "TsMode"
  9-12: "Timestamp (8B)"
  13-15: "SymbolID"
  16-19: "DATA (var)"
  20-22: "Status"
  23-26: "StatusPayload"
  27-30: "CRC32"
```

**Element layout:**

| Field | Size | Type | Notes |
|-------|------|------|-------|
| RestartFlag | 1 byte | uint8 | `0x01` on first frame after restart |
| SchemaHash | 2 bytes | uint16 LE | [CRC16-CCITT](schema-hash) over signal schema |
| TimestampMode | 1 byte | uint8 | `0` = none, `1` = micros, `2` = UNIX |
| Timestamp | 8 bytes | uint64 LE | **Conditional:** only present if TimestampMode > 0 |
| **SymbolID** | 2 bytes | uint16 LE | Signal index |
| **DATA** | variable | — | Value bytes, size per [datatype](datatypes) |
| StatusByte | 1 byte | uint8 | [Status code](status-codes) |
| StatusPayload | 4 bytes | — | Status-specific data |
| CRC32 | 4 bytes | uint32 LE | [CRC32](crc32) over MsgKey through StatusPayload |

See [Timestamps](timestamps) for timestamp modes, [Status Codes](status-codes) for status values, and [CRC32](crc32) for the checksum algorithm.
