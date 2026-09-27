---
sidebar_position: 9
---

# Escaping

Between `<blaeck:` and `/>`, four bytes are sent as `\` followed by the byte XOR `0x20`:

| Byte | Sent as |
|------|---------|
| `<` `0x3C` | `0x5C 0x1C` |
| `\` `0x5C` | `0x5C 0x7C` |
| CR `0x0D` | `0x5C 0x2D` |
| LF `0x0A` | `0x5C 0x2A` |

A raw LF therefore always ends a frame, right after `/>`, and each frame is one line. A frame
holding a raw `<` was cut off and is discarded. Lengths, positions and the [CRC32](crc32) refer to
the unescaped bytes.
