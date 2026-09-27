---
sidebar_position: 10
---

# CRC32

[D3](frames/data) frames end with a CRC-32/ISO-HDLC, the one Ethernet and ZIP use (`zlib.crc32` in Python).

| Parameter | Value |
|-----------|-------|
| Polynomial | `0x04C11DB7` |
| Initial value | `0xFFFFFFFF` |
| XOR out | `0xFFFFFFFF` |
| Reflect input/output | `true` |
| Size, byte order | 4 bytes, little-endian |
| Check (`"123456789"`) | `0xCBF43926` |

The CRC is the last 4 bytes before `/>`. It covers the unescaped bytes from the message key through
the last data byte.

A frame whose CRC doesn't match is discarded.
