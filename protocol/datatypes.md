---
sidebar_position: 6
---

# Datatypes

The DTYPE code in the [Device List](frames/devices) identifies each signal's data type, and in the [Entity List](frames/entities) each property's. The same codes determine how many bytes to read per signal in [data frames](frames/data), except DTYPE 10, which carries its own length.

## Type Table

| User Type | AVR | 32-bit Platform |
|-----------|-----|-----------------|
| `bool` | DTYPE 0 (1 byte) | DTYPE 0 (1 byte) |
| `byte` | DTYPE 1 (1 byte) | DTYPE 1 (1 byte) |
| `short` | DTYPE 2 (2 bytes) | DTYPE 2 (2 bytes) |
| `unsigned short` | DTYPE 3 (2 bytes) | DTYPE 3 (2 bytes) |
| `int` | DTYPE 4 (2 bytes) | DTYPE 6 (4 bytes) |
| `unsigned int` | DTYPE 5 (2 bytes) | DTYPE 7 (4 bytes) |
| `long` | DTYPE 6 (4 bytes) | DTYPE 6 (4 bytes) |
| `unsigned long` | DTYPE 7 (4 bytes) | DTYPE 7 (4 bytes) |
| `float` | DTYPE 8 (4 bytes) | DTYPE 8 (4 bytes) |
| `double` | DTYPE 8 (4 bytes) | DTYPE 9 (8 bytes) |
| `char *` | DTYPE 10 (variable) | DTYPE 10 (variable) |
| `long long` | DTYPE 11 (8 bytes) | DTYPE 11 (8 bytes) |

DTYPE 11 is signed and 8 bytes on every platform. `unsigned long long` has no DTYPE.

blaecktcpy uses the same mapping as 32-bit platforms.

## Strings (DTYPE 10)

DTYPE 10 is the only variable-width type. In [data frames](frames/data) its value is a 1-byte
length followed by that many UTF-8 bytes, **not** null-terminated:

```
LEN(1B) BYTES(LEN)
```

An empty string is a single `0x00` length byte with no bytes after it. Values longer than 255 bytes
are truncated to 255 by the sender, so `LEN` needs no escaping.

Because the width is not implied by the type, a decoder cannot compute signal offsets from the
[Device List](frames/devices) alone: it must read each value in order and consume `LEN` before
advancing. The length byte is inside the [CRC32](crc32) scope, like the bytes it prefixes.

The protocol automatically handles platform differences in data type sizes:

**AVR** (Arduino Uno, Nano, Mega, etc.):
- `int` and `unsigned int` are 2 bytes
- `double` has no precision advantage over `float` (both 4 bytes)

**32-bit Platforms** (ESP32, ESP8266, Arduino Due, etc.):
- `int` and `unsigned int` are 4 bytes and get automatically mapped to `long`/`unsigned long` protocol types
- `double` provides true 8-byte double precision

## See Also

- [Elements](elements) — DTYPE field definition
- [Frames](category/frames) — Device List and data frame layouts
