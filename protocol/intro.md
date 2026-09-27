---
sidebar_position: 1
---

# Introduction

The **Blaeck protocol** is a lightweight binary protocol for streaming typed signal data from embedded devices to host applications. It supports device discovery, schema negotiation, timestamped data frames, and integrity checking — all within a compact, deterministic wire format.

## Protocol at a Glance

Every Blaeck message is wrapped in a fixed envelope:

```
<blaeck: MSGKEY(1B) : MSGID(4B) : FRAME />\r\n
```

- **Message Key** identifies the frame (e.g., `0xD3` for data with 8-byte timestamps).
- **Message ID** is a user-defined uint32.
- **Frame** carries the key-specific payload.

## Escaping

Between `<blaeck:` and `/>`, five bytes are sent as `\` followed by the byte XOR `0x20`:

| Byte | Sent as |
|------|---------|
| `<` `0x3C` | `0x5C 0x1C` |
| `/` `0x2F` | `0x5C 0x0F` |
| `\` `0x5C` | `0x5C 0x7C` |
| CR `0x0D` | `0x5C 0x2D` |
| LF `0x0A` | `0x5C 0x2A` |

A raw `<` therefore always starts a frame and a raw `/` always ends one, and each frame is one line.
A frame holding a raw `<` or LF was cut off and is discarded. Lengths, positions and the
[CRC32](crc32) refer to the unescaped bytes.

All multi-byte integers throughout the protocol are **little-endian**.

See [Frames](category/frames) for all frame definitions.