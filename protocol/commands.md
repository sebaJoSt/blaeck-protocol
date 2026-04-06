---
sidebar_position: 3
---

# Commands

Commands are sent from the host to the device as ASCII text, delimited by angle brackets:

```
<COMMAND,Param0,Param1,Param2,Param3>
```

Parameters are comma-separated integers.

## Built-in Commands

| Command | Parameters | P0–P3 | Description | Response |
|---------|------------|-------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request signal schema | [Signal frame](frames/signals) |
| `BLAECK.GET_DEVICES` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_DATA` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | **P0**, **P1**, **P2**, **P3**, … | Interval (ms) | Start timed data streaming | [Data frames](frames/data) in intervals |
| `BLAECK.DEACTIVATE` | … | — | Stop timed data streaming | — |

**Bold** parameters encode a uint32 in little-endian byte order as four comma-separated bytes. The device echoes the [Message ID](frame-format#message-id) in the response frame.

The `BLAECK.` prefix is reserved for built-in commands.

For example, `ACTIVATE` with 1000 ms:

```
<BLAECK.ACTIVATE,232,3,0,0>
```
