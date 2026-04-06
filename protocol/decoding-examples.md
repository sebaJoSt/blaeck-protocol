---
sidebar_position: 11
---

# Decoding Examples

This page walks through two complete Blaeck frames byte-by-byte: a **B0 (Symbol List)** frame and a **D2 (Data)** frame.

## Example 1: B0 Frame — Symbol List

A device with two signals: `temperature` (float, DTYPE 8) and `humidity` (unsigned short, DTYPE 3).

### Hex Dump

```
3C 42 4C 41 45 43 4B 3A  B0 3A 01 00 00 00 3A
01 00 74 65 6D 70 65 72  61 74 75 72 65 00 08
01 00 68 75 6D 69 64 69  74 79 00 03
2F 42 4C 41 45 43 4B 3E  0D 0A
```

### Byte-by-Byte Annotation

| Offset | Bytes | Field | Value |
|--------|-------|-------|-------|
| `0x00` | `3C 42 4C 41 45 43 4B 3A` | Header | `<BLAECK:` |
| `0x08` | `B0` | Message Key | `0xB0` — Symbol List |
| `0x09` | `3A` | Separator | `:` |
| `0x0A` | `01 00 00 00` | Message ID | `1` (uint32 LE) |
| `0x0E` | `3A` | Separator | `:` |
| | | **Signal 1** | |
| `0x0F` | `01` | MasterSlaveConfig | `0x01` — master |
| `0x10` | `00` | SlaveID | `0x00` |
| `0x11` | `74 65 6D 70 65 72 61 74 75 72 65 00` | SymbolName | `"temperature\0"` |
| `0x1D` | `08` | DTYPE | `8` — float (4 bytes) |
| | | **Signal 2** | |
| `0x1E` | `01` | MasterSlaveConfig | `0x01` — master |
| `0x1F` | `00` | SlaveID | `0x00` |
| `0x20` | `68 75 6D 69 64 69 74 79 00` | SymbolName | `"humidity\0"` |
| `0x29` | `03` | DTYPE | `3` — unsigned short (2 bytes) |
| | | **Footer** | |
| `0x2A` | `2F 42 4C 41 45 43 4B 3E` | Footer | `/BLAECK>` |
| `0x32` | `0D 0A` | EOT | `\r\n` |

### Parsing Notes

- Signals are enumerated sequentially. The first signal has SymbolID `0`, the second `1`, etc.
- The DTYPE code determines how many bytes to read per signal in subsequent data frames.
- Null-terminated strings are read until `0x00` is encountered.

---

## Example 2: D2 Frame — Data with Timestamp

Using the schema from Example 1 (two signals: float + unsigned short). Timestamp mode is MICROS, the device has been running for ~1 second (1,000,000 µs).

### Hex Dump

```
3C 42 4C 41 45 43 4B 3A  D2 3A 02 00 00 00 3A
00 A1 B2 01 40 42 0F 00  00 00 00 00
00 00 00 00 42 28 C0 41
01 00 E8 03
00 00 00 00 00 XX XX XX  XX
2F 42 4C 41 45 43 4B 3E  0D 0A
```

*(XX XX XX XX = CRC32 placeholder — actual value depends on full byte sequence)*

### Byte-by-Byte Annotation

| Offset | Bytes | Field | Value |
|--------|-------|-------|-------|
| `0x00` | `3C 42 4C 41 45 43 4B 3A` | Header | `<BLAECK:` |
| `0x08` | `D2` | Message Key | `0xD2` — Data (8B timestamps) |
| `0x09` | `3A` | Separator | `:` |
| `0x0A` | `02 00 00 00` | Message ID | `2` (uint32 LE) |
| `0x0E` | `3A` | Separator | `:` |
| | | **Control Fields** | |
| `0x0F` | `00` | RestartFlag | `0x00` — not a restart |
| `0x10` | `A1 B2` | SchemaHash | `0xB2A1` (uint16 LE) |
| `0x12` | `01` | TimestampMode | `1` — MICROS |
| `0x13` | `40 42 0F 00 00 00 00 00` | Timestamp | `1,000,000` µs (uint64 LE) |
| | | **Signal 1: temperature (float)** | |
| `0x1B` | `00 00` | SymbolID | `0` (uint16 LE) |
| `0x1D` | `00 00 C0 41` | DATA | `24.0` (float LE, `0x41C00000`) |
| | | **Signal 2: humidity (unsigned short)** | |
| `0x21` | `01 00` | SymbolID | `1` (uint16 LE) |
| `0x23` | `E8 03` | DATA | `1000` (uint16 LE) |
| | | **Integrity** | |
| `0x25` | `00` | StatusByte | `0x00` — Normal |
| `0x26` | `00 00 00 00` | StatusPayload | No additional status data |
| `0x2A` | `XX XX XX XX` | CRC32 | [CRC32](crc32) over `0x08`–`0x29` |
| | | **Footer** | |
| `0x2E` | `2F 42 4C 41 45 43 4B 3E` | Footer | `/BLAECK>` |
| `0x36` | `0D 0A` | EOT | `\r\n` |

### Parsing Notes

- **TimestampMode = 1** means the 8-byte timestamp is present. If it were `0`, the timestamp bytes would be absent entirely.
- **SchemaHash** `0xB2A1` can be cached and compared against future frames. If it changes, request a new B0.
- **CRC32 scope** covers bytes from the Message Key (`0xD2`) through the StatusPayload — that's offsets `0x08` through `0x29`.
- **Signal data sizes** are determined from the B0: float = 4 bytes, unsigned short = 2 bytes.

## See Also

- [Frame Format](frame-format) — Envelope structure
- [Message Keys](message-keys) — B0 and D2 definitions
- [Datatypes](datatypes) — DTYPE size lookup
- [CRC32](crc32) — Checksum algorithm
