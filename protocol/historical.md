---
sidebar_position: 12
---

# Historical Keys

This appendix documents earlier message keys. These keys may be encountered when working with older firmware or log files.

All keys are defined in the [Message Keys](message-keys) summary table.

---

## B1 — Data, No Timestamps (`0xB1`)

The original data message format. Carries signal values without timestamps.

### Element Layout

#### Without CRC (early versions)

| Field | Size | Type |
|-------|------|------|
| *Per signal:* | | |
| SymbolID | 2 bytes | uint16 LE |
| DATA | variable | Per [DTYPE](datatypes) |

#### With CRC (later versions)

| Field | Size | Type | Notes |
|-------|------|------|-------|
| *Per signal:* | | | |
| SymbolID | 2 bytes | uint16 LE | |
| DATA | variable | Per [DTYPE](datatypes) | |
| StatusByte | 1 byte | uint8 | |
| CRC32 | 4 bytes | uint32 LE | Scope: MsgKey through last DATA byte (StatusByte **excluded**) |

**Replaced by:** [D1](historical#d1--data-with-4-byte-timestamps-0xd1), then [D2](message-keys#d2--data-0xd2)

---

## B2 — Devices, Legacy (`0xB2`)

Early device identity message.

### Element Layout

| Field | Size | Type |
|-------|------|------|
| MasterSlaveConfig | 1 byte | uint8 |
| SlaveID | 1 byte | uint8 |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |

**Replaced by:** [B3](message-keys#b3--devices-0xb3) (adds LibName)

---

## B4 — Devices, TCP Early (`0xB4`)

First TCP-specific device message.

### Element Layout

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

**Replaced by:** [B5](#b5--devices-tcp-extended-0xb5) (adds ServerRestarted)

---

## B5 — Devices, TCP Extended (`0xB5`)

Extended TCP device message (without DeviceType/Parent).

### Element Layout

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

**Replaced by:** [B6](message-keys#b6--devices-0xb6) (adds DeviceType, Parent)

---

## D1 — Data with 4-Byte Timestamps (`0xD1`)

Intermediate data format that introduced timestamps but used only 4 bytes.

### Element Layout

| Field | Size | Type | Notes |
|-------|------|------|-------|
| RestartFlag | 1 byte | uint8 | `0x01` on first frame after restart |
| TimestampMode | 1 byte | uint8 | `0` = none, `1` = micros, `2` = RTC/UNIX |
| Timestamp | 4 bytes | uint32 LE | **Conditional:** only if TimestampMode > 0 |
| *Per signal:* | | | |
| SymbolID | 2 bytes | uint16 LE | |
| DATA | variable | Per [DTYPE](datatypes) | |
| StatusByte | 1 byte | uint8 | |
| CRC32 | 4 bytes | uint32 LE | Scope: MsgKey through last DATA byte (StatusByte **excluded**) |

### Key Differences from D2

| Feature | D1 | [D2](message-keys#d2--data-0xd2) |
|---------|-----|-----|
| Timestamp size | 4 bytes (uint32) | 8 bytes (uint64) |
| SchemaHash | ❌ Not present | ✅ 2 bytes |
| StatusPayload | ❌ Not present | ✅ 4 bytes |
| CRC scope | MsgKey → last DATA byte | MsgKey → StatusPayload |

**Replaced by:** [D2](message-keys#d2--data-0xd2) (8-byte timestamps, schema hash, status payload, expanded CRC scope)

---

## Evolution Timeline

```
Data messages:       B1 → D1 → D2
                     no timestamps   4B timestamps   8B timestamps + SchemaHash

Serial devices:      B2 → B3
                     no LibName   + LibName

TCP devices:         B4 → B5 → B6
                     base TCP   + ServerRestarted   + DeviceType, Parent
```

## See Also

- [Message Keys](message-keys) — Active key definitions
- [CRC32](crc32) — CRC scope differences between versions
- [Timestamps](timestamps) — D1 vs D2 timestamp sizes
