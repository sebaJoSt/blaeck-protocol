---
sidebar_position: 1
---

# BlaeckSerial 1.0.0

## Active message keys

| Key | Type | Description |
|-----|------|-------------|
| `B0` | Symbol List | Signal metadata (name, type) |
| `B1` | Data | Signal values (no integrity check) |

## Key field layouts

### B0 — Symbol List

| Field | Type | Size |
|-------|------|------|
| SymbolID | `uint16` LE | 2 B |
| SymbolName | `string` + `\0` | variable |
| DTYPE | `uint8` | 1 B |

Repeated per signal.

### B1 — Data

| Field | Type | Size | Notes |
|-------|------|------|-------|
| SymbolID | `uint16` LE | 2 B | Per signal |
| DATA | variable | variable | Per signal |

No CRC. No StatusByte.

## Status codes

None defined in this version.

## First release

- Initial BlaeckSerial implementation
- Symbol list (`B0`) and raw data (`B1`) frames only
- Single-device operation; no multi-device support

See [Protocol Spec](/protocol/intro) for full element definitions.
