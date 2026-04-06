---
sidebar_position: 6
---

# Datatypes

The DTYPE code in [B0](frames/signals#b0--symbol-list-0xb0) messages identifies each signal's data type. The same codes determine how many bytes to read per signal in [data frames](frames/data#d2--data-0xd2).

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

blaecktcpy uses the same mapping as 32-bit platforms.

The protocol automatically handles platform differences in data type sizes:

**AVR** (Arduino Uno, Nano, Mega, etc.):
- `int` and `unsigned int` are 2 bytes
- `double` has no precision advantage over `float` (both 4 bytes)

**32-bit Platforms** (ESP32, ESP8266, Arduino Due, etc.):
- `int` and `unsigned int` are 4 bytes and get automatically mapped to `long`/`unsigned long` protocol types
- `double` provides true 8-byte double precision

## See Also

- [Elements](elements) — DTYPE field definition
- [Frames](category/frames) — B0 and D2 payload layouts
