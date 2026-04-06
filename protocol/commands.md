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

| Command | Description | Response |
|---------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | Request signal schema | [B0](frames/signals#b0--symbol-list-0xb0) |
| `BLAECK.GET_DEVICES` | Request device identity | [B2](frames/devices#b2--devices-0xb2)–[B6](frames/devices#b6--devices-0xb6) |
| `BLAECK.WRITE_DATA` | Request single data frame | [B1](frames/data#b1--data-0xb1)–[D2](frames/data#d2--data-0xd2) |
| `BLAECK.ACTIVATE` | Start timed data streaming | Continuous data frames at the requested interval |
| `BLAECK.DEACTIVATE` | Stop timed data streaming | — |

## Message ID Encoding

The Message ID is a uint32 split across four parameters as individual bytes:

```
<BLAECK.WRITE_SYMBOLS,Byte0,Byte1,Byte2,Byte3>
```

For example, Message ID `1` (`0x00000001`):

```
<BLAECK.WRITE_SYMBOLS,1,0,0,0>
```

The device echoes this Message ID in the response [frame](frame-format), allowing the host to correlate requests with responses.

## ACTIVATE Parameters

`BLAECK.ACTIVATE` encodes the streaming interval in milliseconds as a uint32 across the four parameters, using the same byte layout as the Message ID:

```
<BLAECK.ACTIVATE,Byte0,Byte1,Byte2,Byte3>
```

For example, 1000 ms (`0x000003E8`):

```
<BLAECK.ACTIVATE,232,3,0,0>
```

## Custom Commands

Libraries may support user-defined commands using the same `<COMMAND,params>` format. The `BLAECK.` prefix is reserved for built-in commands.
