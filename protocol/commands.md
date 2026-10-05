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

## Names

A name a host sends (an input, a sensor, a button or a plain command) uses ASCII letters, digits,
`_`, `-` and `.` only. It may not start with `BLAECK.`, which is reserved for the built-ins. A
label with spaces or other characters belongs in the entry's display name.

## Encoding

Any parameter may be percent-encoded: a byte written as `%` and two hex digits. The device decodes
every parameter before it uses it. A host must encode `,` `<` `>` `%`, bytes below `0x20` and bytes
from `0x80` up; anything else it may send as it is. A `%` not followed by two hex digits is kept as
it is.

```
<Label,hello%2C world>   → Param0="hello, world"
<Label,Gr%C3%BC%C3%9Fe>  → Param0="Grüße"
```

Lengths are counted in two ways: a text input's `TextMaxLen` counts the bytes after decoding, and
the device's `CommandPayloadMax` counts the characters as sent.

## Numbers

A number is written as in JSON ([RFC 8259, section 6](https://www.rfc-editor.org/rfc/rfc8259#section-6)),
with an optional leading `+`: an optional sign, digits without leading zeros, an optional fraction
and an optional exponent. No spaces, no hex, no `NaN` or `Infinity`.

```
21.5   -3   +3   0.25   1e3   2.5E-2       numbers
.5   5.   007   0x1A   " 3"   nan          not numbers
```

A number input bound to an integer type accepts a whole value in any of these forms, so `1e3` and
`12.0` are accepted. An input bound to a 64-bit integer accepts only a sign and digits.

## Message Id

A command may start with one `#<id>:`. A command name may not begin with `#`, so a second prefix
makes the command unknown.

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

The host gets exactly one acknowledgement for each command it sends, built-ins included. There is
one exception: commands from a terminal are never acknowledged. A command that also has an
answer sends the acknowledgement first, then the response frame. A name the device does not have is
answered `UNKNOWN`.

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
| `BLAECK.DATA_START` | — | Send data frames on its own again, and every on-change value anew | n/a |
| `BLAECK.DATA_STOP` | — | Stop the interval, then send no data frames on its own | n/a |
| `BLAECK.ENTITIES_START` | — | Send property values and events on its own | n/a |
| `BLAECK.ENTITIES_STOP` | — | Send no property values or events on its own | n/a |
| `BLAECK.INTERVAL_START` | <small>Interval</small> | Start timed data streaming | [Data frame](frames/data) (in intervals) |
| `BLAECK.INTERVAL_STOP` | — | Stop timed data streaming | n/a |

`INTERVAL_START` takes one parameter: the interval in milliseconds, as a plain decimal.

```
<BLAECK.INTERVAL_START,1000>     one second
```

## Data, Entities and Interval

A host controls what a device sends on its own in two parts: data frames, and property values and
events (entities). The interval is the timed data among the data frames.

```
<BLAECK.ENTITIES_START>           send property values and events on your own
<BLAECK.DATA_START>               send data on your own; every on-change value is sent again
<BLAECK.INTERVAL_START,1000>      plus timed data every second
<BLAECK.INTERVAL_STOP>            no more timed data; on-change data continues
<BLAECK.DATA_STOP>                stop the interval, then no data on your own
<BLAECK.ENTITIES_STOP>            no property values or events on your own
```

After a restart a device sends both, without an interval. `DATA_START` also makes every signal
that reports on change send its current value, changed or not, so a host that starts logging
learns all of them.

While data is stopped, the device sends no data frames on its own. While entities are stopped, it
sends no property values or events on its own; changed property values wait for `ENTITIES_START`,
events are lost. Device notices and catalog updates are not affected. Answers to commands always go
out: every acknowledgement, the device and entity lists, the data frame for `WRITE_DATA`, the new
value of a property the host sets, and whatever the device sends while carrying out a command.

A stop takes effect after the device has read the command, and frames already in flight still
arrive. A host that sends `DATA_STOP` and `ENTITIES_STOP` in order to close the connection safely
must wait for the link to fall silent rather than close on the commands alone.

No built-in takes a message id as a parameter; the `#` prefix carries it, as for any command. The
`BLAECK.` prefix is reserved for built-ins.

## Device Commands

Any command name without the `BLAECK.` prefix belongs to the device. One name reaches exactly one
target on the board, sub-devices included; names compare case-sensitively.

| Target | Listed in | Sent as | Accepted when |
|---|---|---|---|
| Input (READWRITE property) | [Entity List](frames/entities) | `<Name,value>` | the value fits the property, see below |
| Sensor (READ property) | [Entity List](frames/entities) | — | never: `READ_ONLY` |
| Button | [Entity List](frames/entities) | `<Name>` | always; parameters, if any, are ignored |
| Plain command | nowhere | `<Name,Param0,…>` | always; the device's handler reads the parameters |

A device may also have a catch-all handler, which sees every command, built-ins and refused ones
included. When no target has the name, the catch-all may take the command, which is then
accepted; otherwise it is answered `UNKNOWN`.

A value for an input is checked against its entry before it is stored, so an invalid one is
refused and changes nothing:

| Value kind | Accepts |
|---|---|
| number | a [number](#numbers) within `RangeMin`–`RangeMax`, if declared, and within what its variable holds; for an integer type, no fraction. Stored on its `RangeStep`, if declared |
| bool | `0` or `1` |
| enum | an index into `Options`, or an option name matched exactly with case |
| text | up to `TextMaxLen` bytes after decoding; `<Name,>` clears it |

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
