---
sidebar_position: 8
---

# Schema Hash

The **SchemaHash** is a 2-byte field in [data frames](frames/data). It identifies the signal list a
data frame was written with, and equals the hash of the [Device List](frames/devices) the device
sends. A different hash means the device's signals have changed since that list.

## Algorithm

| Property | Value |
|----------|-------|
| Algorithm | CRC-16/XMODEM |
| Polynomial | `0x1021` |
| Initial value | `0x0000` |
| Reflect input/output | `false` |
| XOR out | `0x0000` |
| Size, byte order | 2 bytes, little-endian |
| Check (`"123456789"`) | `0x31C3` |

## What is hashed

The signals in Device List order: the board's first, then each sub-device's. For each signal, the
bytes the Device List sends for it, preceded by its sub-device's name for a sub-device:

| Signal of | Bytes hashed |
|-----------|--------------|
| the board | `SignalName`, `0x00`, `SignalUnit`, `0x00`, `DTYPE` |
| a sub-device | `DeviceName`, `0x00`, `SignalName`, `0x00`, `SignalUnit`, `0x00`, `DTYPE` |

A device without signals has the hash `0x0000`. A signal without a unit still adds the `0x00`
that ends its empty `SignalUnit`.

### Example

The board logs `Temperature` in `°C` (`float`, DTYPE `0x08`) and its sub-device `Zone A` logs
`Flow` in `L/min` (`unsigned long`, DTYPE `0x07`). The hash is taken over:

```
54 65 6D 70 65 72 61 74 75 72 65 00 C2 B0 43 00 08         Temperature, 0x00, °C, 0x00, DTYPE
5A 6F 6E 65 20 41 00 46 6C 6F 77 00 4C 2F 6D 69 6E 00 07   Zone A, 0x00, Flow, 0x00, L/min, 0x00, DTYPE
```

The SchemaHash is `0x5166`, sent as `66 51`.

## See Also

- [Elements](elements) — SchemaHash field definition
- [Frames](category/frames) — Data frame layouts
- [CRC32](crc32) — Frame integrity checksum (separate from SchemaHash)
