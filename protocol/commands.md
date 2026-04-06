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

| Command | Parameters | Description | Response |
|---------|------------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | Message ID (uint32) | Request signal schema | [Signal frame](frames/signals) |
| `BLAECK.GET_DEVICES` | Message ID (uint32) | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_DATA` | Message ID (uint32) | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | Interval in ms (uint32) | Start timed data streaming | [Data frames](frames/data) in intervals |
| `BLAECK.DEACTIVATE` | — | Stop timed data streaming | — |

The `BLAECK.` prefix is reserved for built-in commands.

## Parameter Encoding

Built-in commands encode their uint32 parameter as four comma-separated bytes in little-endian order:

```
<BLAECK.COMMAND,Byte0,Byte1,Byte2,Byte3>
```

## Message ID

Commands that take a Message ID allow the host to correlate requests with responses. The device echoes the Message ID in the response [frame](frame-format).

For example, Message ID `1` (`0x00000001`):

```
<BLAECK.WRITE_SYMBOLS,1,0,0,0>
```

For `BLAECK.ACTIVATE`, the parameter is the streaming interval in milliseconds. For example, 1000 ms (`0x000003E8`):

```
<BLAECK.ACTIVATE,232,3,0,0>
```
