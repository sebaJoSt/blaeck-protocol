---
sidebar_position: 7
---

# Timestamps

Data frames can optionally include a timestamp. The presence and interpretation of the timestamp is controlled by the **TimestampMode** byte.

## TimestampMode Values

| Value | Name | Description |
|-------|------|-------------|
| `0` | NONE | No timestamp field present |
| `1` | MICROS | Microseconds since device boot |
| `2` | UNIX | Unix epoch seconds (requires RTC) |

When `TimestampMode = 0`, the timestamp field is **omitted entirely** — no bytes are allocated for it.

## Timestamp Size by Message Key

| Message Key | Timestamp Size | Type |
|-------------|---------------|------|
| [D1](message-keys#d1--data-0xd1) | 4 bytes | uint32, little-endian |
| [D2](message-keys#d2--data-0xd2) | 8 bytes | uint64, little-endian |

D2 doubled the timestamp field to 8 bytes to support high-resolution microsecond counters on 32-bit platforms without overflow.

## Position in Frame

In a D2 frame, the timestamp appears after the [SchemaHash](schema-hash) and TimestampMode byte:

```
RestartFlag(1B) : SchemaHash(2B) : TimestampMode(1B) [Timestamp(8B)] : signals... : StatusByte(1B) : StatusPayload(4B) : CRC32(4B)
```

The timestamp is **conditional** — only present when TimestampMode > 0.

## Mode 1 — MICROS

Returns the value of `micros()` (Arduino) or an equivalent microsecond counter.

**Overflow behavior:**
- D1 (uint32): wraps every ~71.6 minutes
- D2 (uint64): wraps every ~584,942 years (effectively never)

Receivers should handle uint32 wraparound when processing D1 frames from older library versions.

## Mode 2 — UNIX

Returns Unix epoch seconds. Requires a Real-Time Clock (RTC) or NTP time source on the device.

## See Also

- [Elements](elements) — TimestampMode and Timestamp field definitions
- [Message Keys](message-keys) — D2 payload layout
- [Message Keys](message-keys) — D1 payload layout
