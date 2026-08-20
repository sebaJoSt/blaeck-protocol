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

## Prefix Section

Zero or more sigil-tagged items may precede the command name, each closed by `:`:

```
<SET_AMP,0.9>          typed by hand — no prefix
<#42:SET_AMP,0.9>      give the command a message id
```

A reader consumes prefix items while the leading character is a sigil it knows, then treats the
remainder exactly as it would a frame with no prefix at all. Each item names itself, so order
carries no meaning and a later concern can be added without renegotiating this one. An item a
device does not recognise is left unconsumed, which makes it part of the name — so the command
fails to match and is reported, rather than being silently discarded.

**A command name may not begin with a sigil.** A device should refuse to register such a name
rather than create one it can never receive. Two sigils are spoken for: `#` below, and `@` for
routing a command through a hub to the device behind it.

### `#` — Message Id

Every command carries its message id here, built-ins included. A device echoes it in the header of
whatever it sends back, so a host knows which request an answer belongs to. The prefix is where it
goes because a command frame has nowhere else to put one: every parameter belongs to the handler.

| Rule | Value |
|------|-------|
| Range | `1`–`65535`; `0` means "no id" and must not be sent |
| Format | decimal, unpadded, at most five digits |
| Reuse | a sender must not reuse an id while an acknowledgement for it is outstanding |
| Issuer | only the host that waits for the acknowledgement; a relay forwards ids and mints none |

Five digits rather than ten, because the id is paid for in characters of a receive buffer small
enough to be counted. Five digits and two delimiters are a bearable share of it.

The device echoes the id in the [Command Ack](frames/commands) header's Message ID field, and
echoes `0` for a command that carried none. Nothing is added to the frame.

The id pairs; the hashes verify. Without one, a host matching an acknowledgement by hash cannot
tell which of two same-named commands is being answered — dragging a slider sends a burst of
`SET_AMP`, and pairing the wrong one reports bytes that differ when nothing was corrupted.

**The acknowledgement's `CmdHash` covers the payload after the prefix section**, not the received
bytes. A prefix is addressing rather than content: a routing item may be consumed before the
frame reaches the device that answers it, so a hash over what arrived would cover different
characters depending on the path taken, and would never match what the sender hashed.

## Built-in Commands

| Command | Parameters | Description | Response |
|---------|-----------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | — | Request signal schema | [Signals](frames/signals) |
| `BLAECK.GET_DEVICES` | — | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_SIGNAL_CONFIG` | — | Request signal presentation metadata | [Signal Config](frames/signals) |
| `BLAECK.WRITE_DATA` | — | Request single data frame | [Data frame](frames/data) |
| `BLAECK.WRITE_COMMANDS` | — | Request command catalog | [Command List](frames/commands) |
| `BLAECK.WRITE_STATE_CHANNELS` | — | Request state channel catalog | [State Channel List](frames/states) |
| `BLAECK.WRITE_EVENT_CHANNELS` | — | Request event channel catalog | [Event Channel List](frames/events) |
| `BLAECK.ACTIVATE` | <small>Interval</small> | Start timed data streaming | [Data frame](frames/data) (in intervals) |
| `BLAECK.DEACTIVATE` | — | Stop timed data streaming | n/a |

`ACTIVATE` takes one parameter: the interval in milliseconds, as a plain decimal.

```
<BLAECK.ACTIVATE,1000>     one second
```

No built-in takes a message id as a parameter. The `#` prefix carries it, the same way it does for
a custom command.

The `BLAECK.` prefix is reserved for built-in commands.

## Custom Commands

Any command name without the `BLAECK.` prefix is user-defined. Parameters are delivered as string tokens; the device handler decides how to interpret them (e.g. convert to integer, use as text, or apply a default when empty).

```
<SwitchLED,1>        → turn LED on
<Print,Hello,1>      → string parameter with mode
<MyCmd,10,,20>       → skip second parameter
```

## Response with Message ID

Every built-in that answers with a frame echoes the id from the prefix in that frame's header. For
example, requesting the signal schema with message id 1:

```
Command:  <#1:BLAECK.WRITE_SYMBOLS>
Response: <BLAECK: B0 : 01 00 00 00 : …………… /BLAECK>\r\n
                   Key  Message ID    Frame
```

A request that carried no prefix is answered with `0` in that field.

See [Frames](category/frames) for all frame types.
