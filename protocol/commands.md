---
sidebar_position: 3
---

# Commands

Commands are sent from the host to the device as ASCII text, delimited by angle brackets:

```
<COMMAND,Param0,Param1,Param2,Param3>
```

Parameters are comma-separated integers. All built-in commands use a 4-byte Message ID split across the first four parameters (little-endian byte order).

## Built-in Commands

| Command | Parameters | Description | Response |
|---------|------------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | Message ID (uint32) | Request signal schema | [B0](frames/signals#b0--symbol-list-0xb0) |
| `BLAECK.GET_DEVICES` | Message ID (uint32) | Request device identity | [B2](frames/devices#b2--devices-0xb2)–[B6](frames/devices#b6--devices-0xb6) |
| `BLAECK.WRITE_DATA` | Message ID (uint32) | Request single data frame | [B1](frames/data#b1--data-0xb1)–[D2](frames/data#d2--data-0xd2) |
| `BLAECK.ACTIVATE` | Interval in ms (uint32) | Start timed data streaming | Continuous data frames at the requested interval |
| `BLAECK.DEACTIVATE` | — | Stop timed data streaming | — |

## Parameter Encoding

All built-in commands encode their uint32 parameter as four comma-separated bytes in little-endian order:

```
<BLAECK.COMMAND,Byte0,Byte1,Byte2,Byte3>
```

For commands that take a Message ID, the device echoes it back in the response [frame](frame-format), allowing the host to correlate requests with responses.

For example, Message ID `1` (`0x00000001`):

```
<BLAECK.WRITE_SYMBOLS,1,0,0,0>
```

For `BLAECK.ACTIVATE`, the parameter is the streaming interval in milliseconds. For example, 1000 ms (`0x000003E8`):

```
<BLAECK.ACTIVATE,232,3,0,0>
```

## Custom Commands

Libraries may support user-defined commands using the same `<COMMAND,params>` format. The `BLAECK.` prefix is reserved for built-in commands.
