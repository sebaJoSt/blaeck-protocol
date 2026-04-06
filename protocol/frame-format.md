---
sidebar_position: 2
---

# Frame Format

Every Blaeck message is wrapped in a fixed binary envelope. The envelope is identical across all [message keys](message-keys) and all library versions.

## Structure

```
<BLAECK: MSGKEY : MSGID : <ELEMENTS> /BLAECK>\r\n
```

### Parts Table

| Part | Content | Size | Encoding |
|------|---------|------|----------|
| Header | `<BLAECK:` | 8 bytes | ASCII `3C 42 4C 41 45 43 4B 3A` |
| Message Key | Single byte (e.g. `0xD2`) | 1 byte | Binary |
| Separator | `:` | 1 byte | ASCII `0x3A` |
| Message ID | Monotonic counter | 4 bytes | uint32, little-endian |
| Separator | `:` | 1 byte | ASCII `0x3A` |
| Elements | Key-specific payload | variable | See [Message Keys](message-keys) |
| Footer | `/BLAECK>` | 8 bytes | ASCII `2F 42 4C 41 45 43 4B 3E` |
| EOT | `\r\n` | 2 bytes | ASCII `0x0D 0x0A` |

**Total overhead:** 25 bytes + elements.

## Byte Order

All multi-byte integers throughout the protocol are **little-endian**.

## Message ID

The Message ID is a uint32 counter that increments with each transmitted frame. It starts at `0x00000001` on boot and wraps at `0xFFFFFFFF`. Receivers can use it to detect dropped frames.

:::note
The C0 (Restart Notification) message in blaecktcpy always uses a fixed Message ID of `0x00000001`.
:::

## Example

A minimal frame with message key `0xD2`, Message ID `1`, and a 20-byte elements payload:

```
Offset  Hex                                          ASCII
------  -------------------------------------------  --------
0x00    3C 42 4C 41 45 43 4B 3A                      <BLAECK:
0x08    D2                                           .
0x09    3A                                           :
0x0A    01 00 00 00                                  ....
0x0E    3A                                           :
0x0F    [20 bytes of elements]                       ........
0x23    2F 42 4C 41 45 43 4B 3E                      /BLAECK>
0x2B    0D 0A                                        \r\n
```

See [Elements](elements) for the payload definitions and [Decoding Examples](decoding-examples) for fully annotated hex dumps.
