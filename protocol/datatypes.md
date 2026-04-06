---
sidebar_position: 6
---

# Datatypes

The DTYPE code in [B0 (Symbol List)](message-keys#b0--symbol-list-0xb0) messages identifies each signal's data type. The same codes determine how many bytes to read per signal in [data frames](message-keys#d2--data-0xd2).

## Type Table

| Code | Name | Size | Arduino Type | Python `struct` Format |
|------|------|------|-------------|----------------------|
| `0` | bool | 1 byte | `bool` | `<?` |
| `1` | byte | 1 byte | `byte` / `uint8_t` | `<B` |
| `2` | short | 2 bytes | `short` / `int16_t` | `<h` |
| `3` | unsigned short | 2 bytes | `unsigned short` / `uint16_t` | `<H` |
| `4` | int | 2 bytes | `int` (AVR) | `<h` |
| `5` | unsigned int | 2 bytes | `unsigned int` (AVR) | `<H` |
| `6` | long / int32 | 4 bytes | `long` / `int32_t` | `<l` |
| `7` | unsigned long / uint32 | 4 bytes | `unsigned long` / `uint32_t` | `<L` |
| `8` | float | 4 bytes | `float` | `<f` |
| `9` | double | 8 bytes | `double` | `<d` |

## Size Lookup

For quick programmatic use:

```python
DTYPE_SIZE = {0: 1, 1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 4, 7: 4, 8: 4, 9: 8}
```

## AVR vs 32-bit Platform Notes

On **AVR** (Arduino Uno, Mega, etc.):
- `int` is 16-bit (2 bytes) → DTYPE `4`
- `unsigned int` is 16-bit (2 bytes) → DTYPE `5`

On **32-bit platforms** (Arduino Due, ESP32, Teensy, etc.):
- `int` is 32-bit (4 bytes) — mapped to DTYPE `6` (same as `long`)
- `unsigned int` is 32-bit (4 bytes) — mapped to DTYPE `7` (same as `unsigned long`)

:::tip
When decoding, always use the DTYPE code and the size table above — never assume `int` size based on platform. The sender's library handles the platform-specific mapping at registration time.
:::

## double Support

DTYPE `9` (`double`, 8 bytes) was added in **BlaeckSerial v4.0.0**. Earlier library versions do not support it.

On AVR platforms, `double` is actually 4 bytes (identical to `float`). The 8-byte DTYPE `9` is intended for 32-bit platforms where `double` is a true IEEE 754 double-precision value.

## See Also

- [Elements](elements) — DTYPE field definition
- [Message Keys](message-keys) — B0 and D2 payload layouts
