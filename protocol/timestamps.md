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
| [D1](frames/data#d1--data-0xd1) | 4 bytes | uint32 |
| [D2](frames/data#d2--data-0xd2) | 8 bytes | uint64 |

## See Also

- [Elements](elements) — TimestampMode and Timestamp field definitions
- [Frames](frames) — D2 payload layout
- [Frames](frames) — D1 payload layout
