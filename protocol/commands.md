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

A reader consumes prefix items while the leading character is a sigil it knows, then reads the
remainder as it would a frame with no prefix. Items are self-naming, so their order carries no
meaning. An unrecognised item is left unconsumed and so becomes part of the command name, which
then matches nothing and is reported as unknown.

**A command name may not begin with a sigil**, and a device refuses to register one that does. Two
sigils are defined: `#` below, and `@` for routing a command through a hub to the device behind it.

### `#` — Message Id

Every command carries its message id here, built-ins included. The device echoes it in the header
of whatever it sends back — a response frame, or the [Command Ack](frames/commands) Message ID
field — and echoes `0` for a command that carried none.

| Rule | Value |
|------|-------|
| Range | `1`–`65535`; `0` means "no id" and must not be sent |
| Format | decimal, unpadded, at most five digits |
| Reuse | a sender must not reuse an id while an acknowledgement for it is outstanding |
| Issuer | only the host that waits for the acknowledgement; a relay forwards ids and mints none |

The id pairs an answer with its command; the hashes say whether the bytes arrived as sent. Without
an id, same-named commands in flight together cannot be told apart.

**The acknowledgement's `CmdHash` covers the payload after the prefix section**, not the received
bytes — a prefix is addressing rather than content, and a routing item may be consumed before the
frame reaches the device that answers it.

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

No built-in takes a message id as a parameter; the `#` prefix carries it, as for any command. The
`BLAECK.` prefix is reserved for built-ins.

## Custom Commands

Any command name without the `BLAECK.` prefix is user-defined. Parameters are delivered as string tokens; the device handler decides how to interpret them (e.g. convert to integer, use as text, or apply a default when empty).

```
<SwitchLED,1>        → turn LED on
<Print,Hello,1>      → string parameter with mode
<MyCmd,10,,20>       → skip second parameter
```

## Response with Message ID

A built-in that answers with a frame echoes the id from the prefix in that frame's header:

```
Command:  <#1:BLAECK.WRITE_SYMBOLS>
Response: <BLAECK: B0 : 01 00 00 00 : …………… /BLAECK>\r\n
                   Key  Message ID    Frame
```

A request that carried no prefix is answered with `0` in that field.

See [Frames](category/frames) for all frame types.
