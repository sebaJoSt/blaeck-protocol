---
sidebar_position: 4
---

# Elements

Every field that can appear in the elements section of a Blaeck [frame](intro#protocol-at-a-glance). See [Frames](frames) for per-frame layouts.

| Element | Size | Type | Description |
|---------|------|------|-------------|
| ClientDataEnabled | variable | string | Data streaming enabled (`"true"` / `"false"`) |
| ClientNo | variable | string | Client number |
| CRC32 | 4 bytes | uint32 | Integrity checksum. See [CRC32](crc32) |
| DATA | variable | raw bytes | Signal value, size per [DTYPE](datatypes) |
| DeviceName | variable | string | User-defined device name |
| DeviceType | variable | string | `"server"` or `"hub"` |
| DTYPE | 1 byte | uint8 | Datatype code (`0x00`–`0x09`). See [Datatypes](datatypes) |
| FWVersion | variable | string | Firmware version |
| HWVersion | variable | string | Hardware version |
| LibName | variable | string | Library name |
| LibVersion | variable | string | Library version (e.g., `"6.0.0"`) |
| MasterSlaveConfig | 1 byte | uint8 | `0x01` = master, `0x02` = slave |
| Parent | variable | string | Parent device in topology |
| RestartFlag | 1 byte | uint8 | `0x00` = normal, `0x01` = first frame after restart |
| SchemaHash | 2 bytes | uint16 | CRC16-CCITT over signal schema. See [Schema Hash](schema-hash) |
| ServerRestarted | variable | string | Whether server restarted since client connected |
| SlaveID | 1 byte | uint8 | `0x00` for master; device-specific for slaves |
| StatusByte | 1 byte | uint8 | Device/hub status. See [Status Codes](status-codes) |
| StatusPayload | 4 bytes | raw bytes | Status-specific data |
| SymbolID | 2 bytes | uint16 | Zero-based signal index (matches B0 order) |
| SymbolName | variable | string | Signal name |
| Timestamp | 4 or 8 bytes | uint32/uint64 | Conditional: only if TimestampMode > 0. See [Timestamps](timestamps) |
| TimestampMode | 1 byte | uint8 | `0` = none, `1` = micros, `2` = UNIX. See [Timestamps](timestamps) |

All string fields are null-terminated.
