---
sidebar_position: 2
---

# Commands

Commands are sent from the host to the device as ASCII text, delimited by angle brackets:

```
<BLAECK.COMMAND,Param0,Param1,Param2,Param3>
```

Parameters are comma-separated integers.

## Built-in Commands

| Command | Parameters | P0–P3 | Description | Response |
|---------|------------|-------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request signal schema | [Signal frame](frames/signals) |
| `BLAECK.GET_DEVICES` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_DATA` | **P0**, **P1**, **P2**, **P3**, … | Message ID | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | **P0**, **P1**, **P2**, **P3**, … | Interval (ms) | Start timed data streaming | [Data frame](frames/data) (in intervals) |
| `BLAECK.DEACTIVATE` |  | n/a | Stop timed data streaming | n/a |

**Bold** parameters encode a uint32 in little-endian byte order as four comma-separated bytes. 

The `BLAECK.` prefix is reserved for built-in commands.

## Response with Message ID

`WRITE_SYMBOLS`, `GET_DEVICES` and `WRITE:DATA`: **P1-P4** sends the Message ID to the device, and the response echoes it back to the sender. For example, requesting signal schema with Message ID 1:

```
Command:  <BLAECK.WRITE_SYMBOLS,1,0,0,0>
Response: <BLAECK: B0 : 01 00 00 00 : …………… /BLAECK>\r\n
                   Key  Message ID    Frame
```

See [Frames](frames) for all frame types.
