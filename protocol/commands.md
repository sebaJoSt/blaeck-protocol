---
sidebar_position: 2
---

# Commands

Commands are sent from the host to the device as ASCII text, delimited by angle brackets:

```
<COMMAND,Param0,Param1,…>
```

Parameters are comma-separated tokens. An empty field between commas preserves its position and is delivered as an empty string, allowing callers to skip parameters without shifting subsequent values:

```
<MYCMD,10,,20>   → Param0="10", Param1="", Param2="20"
```

## Message Id

A command may start with `#<id>:`. A command name may not begin with `#`.

```
<Amplitude,0.9>          no message id
<#42:Amplitude,0.9>      message id 42
```

The device echoes the id in the header of whatever it sends back — a response frame, or the
[Command Ack](frames/commands) Message ID field — and echoes `0` for a command that carried none.

| Rule | Value |
|------|-------|
| Range | `1`–`65535`; `0` means "no id" and must not be sent |
| Format | decimal, unpadded, at most five digits |
| Reuse | a sender must not reuse an id while an acknowledgement for it is outstanding |
| Issuer | only the host that waits for the acknowledgement; a relay forwards ids and mints none |

The id pairs an answer with its command; the hashes say whether the bytes arrived as sent. Without
an id, same-named commands in flight together cannot be told apart.

**The acknowledgement's `CmdHash` covers the command after the message id.**

## Acknowledgement

Every command produces exactly one acknowledgement, `BLAECK.*` included. A command that also has an
answer sends the acknowledgement first, then the response frame. A name the device does not have is
answered `UNKNOWN_COMMAND`.

`CmdHash` covers the command as written — the payload after any [message id](#message-id)
— so it matches only when those are the bytes the sender wrote. `CmdNameHash` covers the name
alone, which sits before the first comma and so survives a frame the device could not take in full.

The header's Message ID carries back the [message id](#message-id) the command was
sent with, or `0` when it carried none. An id present decides which command is being answered; the
hashes then say only how it arrived:

| Message ID | CmdHash | Meaning |
|------------|---------|---------|
| a command still outstanding | match | Acknowledged that command, received intact |
| a command still outstanding | no match | That command, different bytes: it did not arrive as sent |
| not one this sender issued | — | Not ours; ignore |

Without an id there is nothing to pair on but the hashes, and a burst of same-named commands
cannot be told apart:

| CmdHash | CmdNameHash | Meaning |
|---------|-------------|---------|
| match | match | Acknowledged command received intact |
| no match | match | Same command, different bytes: it did not arrive as sent |
| no match | no match | Not a command this sender issued |

## Built-in Commands

| Command | Parameters | Description | Response |
|---------|-----------|-------------|----------|
| `BLAECK.GET_DEVICES` | — | Request the board, its sub-devices and their signals | [Device List](frames/devices) |
| `BLAECK.WRITE_ENTITIES` | — | Request the properties, events and buttons | [Entity List](frames/entities) |
| `BLAECK.WRITE_DATA` | — | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | <small>Interval</small> | Start timed data streaming | [Data frame](frames/data) (in intervals) |
| `BLAECK.DEACTIVATE` | — | Stop timed data streaming | n/a |
| `BLAECK.PAUSE_WRITES` | <small>Duration or `FOREVER`</small> | Send no frames for a period | n/a |
| `BLAECK.RESUME_WRITES` | — | End a pause early | n/a |

`ACTIVATE` takes one parameter: the interval in milliseconds, as a plain decimal.

```
<BLAECK.ACTIVATE,1000>     one second
```

## Pausing Writes

`PAUSE_WRITES` stops every frame leaving the device — data, properties, events, catalogs and
acknowledgements alike — for a duration in milliseconds.

```
<BLAECK.PAUSE_WRITES,1000>        one second of silence
<BLAECK.PAUSE_WRITES>             the device's default duration
<BLAECK.PAUSE_WRITES,FOREVER>     until resumed or reset
<BLAECK.RESUME_WRITES>            end it now
```

Without a duration, or with `0`, the device uses its own default. Each device also has a
maximum, and a longer duration is shortened to it, so a timed pause always ends on its own.
Use `FOREVER` if you want the pause unlimited.

`DEACTIVATE` stops timed streaming only. A device that writes frames on its own schedule keeps
writing through it, and `PAUSE_WRITES` is what stops that.

The pause takes effect after the device has read the command, and frames already in flight still
arrive. A host that pauses in order to close the connection safely must wait for the link to fall
silent rather than close on the command alone.

The acknowledgement of `PAUSE_WRITES` is sent before the pause begins. Commands received during a
pause are executed but not acknowledged.

No built-in takes a message id as a parameter; the `#` prefix carries it, as for any command. The
`BLAECK.` prefix is reserved for built-ins.

## Device Commands

Any command name without the `BLAECK.` prefix belongs to the device. One name reaches exactly one
target on the board, sub-devices included; names compare case-sensitively.

| Target | Listed in | Sent as | Accepted when |
|---|---|---|---|
| Input (READWRITE property) | [Entity List](frames/entities) | `<Name,value>` | the value fits the property, see below |
| Sensor (READ property) | [Entity List](frames/entities) | — | never: `READ_ONLY` |
| Button | [Entity List](frames/entities) | `<Name>` | always |
| Plain command | nowhere | `<Name,Param0,…>` | always; the device's handler reads the parameters |

A value for an input is checked against its entry before it is stored, so an invalid one is
refused and changes nothing:

| Value kind | Accepts |
|---|---|
| number | a decimal within `RangeMin`–`RangeMax`, if declared; for an integer type, no fraction. Stored on its `RangeStep`, if declared |
| bool | `0` or `1` |
| enum | an index into `Options`, or an option name matched exactly with case |
| text | up to `TextMaxLen` bytes; `<Name,>` clears it |

An accepted value is acknowledged, then written as a [Property](frames/properties) frame. See
[Ack Reasons](ack-reasons) for what a refusal says.

```
<Setpoint,21.5>      → input: number
<OutputEnabled,1>    → input: bool
<Mode,Heat>          → input: enum, by name
<STATUS>             → button
<SET_RANGE,1,40>     → plain command, parameters for its handler
```

## Response with Message ID

A built-in that answers with a frame echoes the id from the prefix in that frame's header:

```
Command:  <#1:BLAECK.GET_DEVICES>
Response: <blaeck: B7 : 01 00 00 00 : …………… /> LF
                   Key  Message ID    Frame
```

A request that carried no prefix is answered with `0` in that field.

See [Frames](category/frames) for all frame types.
