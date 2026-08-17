---
sidebar_position: 1
---

# Command correlation and routing (proposal)

**Status:** proposed, not implemented. Written 2026-08-17, for the pass that brings BlaeckTCP
level with BlaeckSerial 7.

A host cannot reliably tell which command a [Command Ack](../frames/commands) answers. This
proposes an optional identifier the device echoes, and settles how it composes with the routing
prefix so the two do not have to be reconciled later.

## What goes wrong now

An ack carries two hashes: one over the whole frame the device received, one over the command
name alone. A host matches an ack to an outstanding command by the frame hash, and falls back to
the name when that fails - reporting, when it falls back, that the command arrived with different
bytes than were sent.

That report is right when a frame was corrupted in transit, which is what it was built for. It is
wrong whenever two commands of the same name are outstanding at once. Dragging a slider sends a
burst of `SET_AMP`; one ack fails to find its own frame hash - its pending entry was already
consumed, or its grace expired first - falls back to the name, pairs with a *different* `SET_AMP`,
and the hashes differ because the values differ. Nothing was corrupted. Observed on a live device
on 2026-08-16.

The hash is doing two jobs: identifying which command is being answered, and verifying that it
arrived intact. It cannot do the first when names repeat.

## Alternatives that do not work

**Serialise - one command outstanding per device.** Removes the ambiguity between *our* commands,
and nothing else. The link is not exclusive: another host, a second Loggbok, or someone typing
into a serial monitor can send commands to the same device, and a hub relaying several boards
returns acks interleaved. Pairing by arrival order attributes a stranger's ack to our command,
which is worse than today - a confident wrong verdict instead of a suspicious one. Matching on the
hash is what currently rejects foreign acks, and order-based pairing throws that away.

**Coalesce - keep only the newest value of a repeated command.** Assumes the command means "be
this" rather than "do this". True for a number, switch, select or text control, which declare a
value and report their state; false for a button, where three presses must fire three times, and
false for a plain `onCommand()`, whose meaning a host cannot know. A host can read the kind from
the catalog and coalesce only the value kinds - but that follows the declared contract, not the
implementation, and a sketch is free to make a number command mean "add this much".

Neither removes the need for an identifier. An id assumes neither exclusivity nor idempotence.

## Proposal

### A prefix section

Zero or more sigil-tagged items, each closed by `:`, before the command name:

```
<SET_AMP,0.9>                  typed by hand - unchanged
<#42:SET_AMP,0.9>              correlate the ack
<@1:SET_AMP,0.9>               route to a device behind the receiver
<@1:#42:SET_AMP,0.9>           both
```

A parser reads prefixes in a loop while the leading character is a known sigil, then treats the
remainder exactly as it does today. Each item names itself, so order carries no meaning; a host
should emit routing first by convention - delivery before correlation - and a device must not
require it.

This is what makes the two composable rather than competing, and leaves room for a third concern
later without renegotiating either.

**A command name may not begin with a sigil.** No built-in or example does today. A device should
refuse to register such a name rather than create one it can never receive.

### `#` - correlation id

- **Range 1..65535.** Zero means "no id" and must not be sent.
- Decimal, no padding, at most five digits.
- A host chooses ids however it likes, but must not reuse one while an ack for it is still
  outstanding.

**The device echoes it in the ack's existing `MessageID` header field**, which is four bytes and
today carries a per-ack counter of no use to a host. Nothing is added to the frame. An ack for a
command that carried no id echoes **0**.

Sixteen bits because the cost is characters in the receive buffer, not bytes in the header: that
buffer is 128 characters on a Mega and 48 on a small AVR, and three of them are allocated. Five
digits plus two delimiters is a bearable share of 48; ten digits is not. It is also what Modbus TCP
and MQTT both chose for the same job.

### How a host should then read an ack

| id echoed | hashes | meaning |
|---|---|---|
| matches an outstanding id | frame hash agrees | delivered intact, verdict applies to that command |
| matches an outstanding id | frame hash differs | **genuinely different bytes** - corrupted in transit |
| 0, or an id never issued | - | not ours; ignore |

The id pairs, the hash verifies. Neither is asked to do the other's job, and "different bytes"
becomes a statement a host can trust.

## Open question: how deep can routing address?

The routing token is not a path. A host resolves it as a single slave ID:

```
token = device is a slave ? device.SlaveID : none
```

So it addresses exactly one hop - a slave directly behind the device the host is connected to. A
three-level tree has nowhere to put the middle hop, and two boards behind different hubs may share
a slave ID with nothing to tell them apart.

This is already asymmetric: device paths for topics and Home Assistant identities are built by
walking the parent chain, so a deep tree is addressable for reading and not for writing.

Two ways out, both parsing unchanged under the grammar above:

1. **A path token** - `@1/3:` or `@hub/board:`, each hop consuming its own leading segment and
   forwarding the remainder. Costs characters in the same tight buffer.
2. **Leave it at one hop** and state the limit in the spec, so a host does not offer controls it
   cannot deliver.

This wants deciding before the September pass, because it changes what a relay does with a frame
it forwards - and a relay must forward `#42:` untouched either way, or the ack cannot find its way
home.

## Compatibility

- **Hand-written commands are unaffected.** No prefix, no change.
- **Firmware that predates this** reads `#42:SET_AMP` as a command name, fails to find it, and
  answers `UNKNOWN_COMMAND`. So a host must send ids only to versions that support them - a
  capability gate, which hosts already keep for state channels and events.
- **Nothing on the wire grows.** The id rides in a header field that exists.

## What it touches

BlaeckSerial and BlaeckTCP (prefix parsing, echoing the id), this spec (grammar, `MessageID`
semantics on `A5`), Loggbok (emit ids, pair on them, gate by version), and `blaecktcpy`'s encoder.

## Until then

A host should not claim "different bytes" when more than one outstanding command shares the name
the ack reports - that pairing is a guess. Resolving the ack as accepted or rejected without the
byte claim keeps the useful half and drops the false alarm.
