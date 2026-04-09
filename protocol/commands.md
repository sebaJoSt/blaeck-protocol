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

| Command | Parameters | Description | Response |
|---------|-----------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | <small>MsgID[0], MsgID[1], MsgID[2], MsgID[3]</small> | Request signal schema | [Signals](frames/signals) |
| `BLAECK.GET_DEVICES` | <small>MsgID[0], MsgID[1], MsgID[2], MsgID[3], ClientName, ClientType</small> | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_DATA` | <small>MsgID[0], MsgID[1], MsgID[2], MsgID[3]</small> | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | <small>Interval[0], Interval[1], Interval[2], Interval[3]</small> | Start timed data streaming | [Data frame](frames/data) (in intervals) |
| `BLAECK.DEACTIVATE` | — | Stop timed data streaming | n/a |

Bracketed parameters encode a uint32 in little-endian byte order as four comma-separated bytes.

The `BLAECK.` prefix is reserved for built-in commands.

## Response with Message ID

`WRITE_SYMBOLS`, `GET_DEVICES` and `WRITE_DATA`: `MsgID[0]`–`MsgID[3]` sends the Message ID to the device, and the response echoes it back to the sender. For example, requesting signal schema with Message ID 1:

```
Command:  <BLAECK.WRITE_SYMBOLS,1,0,0,0>
Response: <BLAECK: B0 : 01 00 00 00 : …………… /BLAECK>\r\n
                   Key  Message ID    Frame
```

See [Frames](category/frames) for all frame types.

## Client Identity

`GET_DEVICES` has two parameters — `ClientName` and `ClientType` — that let TCP clients identify themselves to the server:

| Field | Description |
|-------|-------------|
| ClientName | Human-readable name of the client application |
| ClientType | Type of client (e.g., `"desktop"`, `"web"`, `"script"`) |

The server stores this identity per TCP connection for logging, management UIs, and diagnostics. The [B6](frames/devices#b6--devices-0xb6) response echoes these values back as `ClientName` and `ClientType`, alongside the server-assigned `ClientNo` and `ClientDataEnabled` fields.
