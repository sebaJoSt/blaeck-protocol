---
sidebar_position: 8
---

# Schema Hash

The **SchemaHash** is a 2-byte field in data frames that allows receivers to detect signal schema changes without requiring a full [B0](frames/signals) retransmission.

## Purpose

When a device's signal schema changes (signals added, removed, renamed, or retyped), the SchemaHash changes. The receiver can compare the incoming hash against a stored value and request a fresh B0 only when they differ. This avoids unnecessary B0 requests on every data frame.

## Algorithm

| Property | Value |
|----------|-------|
| Algorithm | CRC16-CCITT |
| Size | 2 bytes |
| Type | uint16 |

The hash is computed over the **signal names and datatype codes** that make up the schema.

## Position in Frame

```
RestartFlag(1B) : SchemaHash(2B) : TimestampMode(1B) ...
```

## Usage Pattern

1. On first connection, the receiver requests a B0 frame and stores the schema along with the SchemaHash from subsequent data frames.
2. On each data frame, the receiver compares the SchemaHash against the stored value.
3. If the hash differs, the receiver requests a new B0 frame to update its signal definitions.



## See Also

- [Elements](elements) — SchemaHash field definition
- [Frames](category/frames) — Data frame layouts
- [CRC32](crc32) — Frame integrity checksum (separate from SchemaHash)
