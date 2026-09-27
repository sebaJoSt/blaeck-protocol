---
sidebar_position: 10
---

# CRC32

Data frames end with a CRC-32/ISO-HDLC, the one Ethernet and ZIP use (`zlib.crc32` in Python).

| Parameter | Value |
|-----------|-------|
| Polynomial | `0x04C11DB7` |
| Initial value | `0xFFFFFFFF` |
| XOR out | `0xFFFFFFFF` |
| Reflect input/output | `true` |
| Size, byte order | 4 bytes, little-endian |
| Check (`"123456789"`) | `0xCBF43926` |

The CRC is the last 4 bytes before `/BLAECK>`. It covers everything from the message key onward:

| Frame | Covered | Not covered |
|-------|---------|-------------|
| D2 | key → StatusPayload | — |
| B1, D1 | key → last data byte | StatusByte |

A frame whose CRC doesn't match is discarded.
