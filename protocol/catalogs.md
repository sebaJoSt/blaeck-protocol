---
sidebar_position: 7
---

# Catalogs

A **catalog** is a frame carrying a device's whole declared set of something: read in order, from
the first entry to the last, and addressed afterwards by position. Two frames are catalogs.

| catalog | declares | addressed afterwards by |
|---|---|---|
| [`B7` Device List](frames/devices) | the board, its sub-devices and the signals each logs | `SignalIndex` in [data frames](frames/data), counted across all devices in list order |
| [`90` Entity List](frames/entities) | the properties, events and buttons a host shows and controls | `PropertyIndex` in a [`95`](frames/properties); `EventIndex` and `EventTypeIndex` in an [`85`](frames/events); a button by its name |

Addressing is positional, so a host reading a value against a catalog the device has moved on from
does not fail - it files the value under whatever now sits at that position. Nothing in the later
frame says otherwise.

## The device list

**Sent on request only**, with `BLAECK.GET_DEVICES`. A device never sends it on its own: a restart
or a sub-device going missing is reported by the [Device Notification](frames/control), a changed
signal list shows in the [SchemaHash](schema-hash) of the next data frame, and a host that wants
the list again asks for it.

Its signals are what data frames carry, numbered by their position in this list. A data frame's
[SchemaHash](schema-hash) says which signal list it was written with, so a host can tell when the
signals have changed.

## The entity list

**Sent on request**, with `BLAECK.WRITE_ENTITIES`, **after a restart**, behind the restart notice,
since every property is back at its default, and **whenever an entry changes**. The unasked ones
carry `MessageID` `0`, the value every frame nobody asked for carries, and precede any
[property](frames/properties) or [event](frames/events) that would otherwise arrive before the list
explaining it. An event filed against a stale list cannot be repaired afterwards, since an
occurrence appears in no catalog of its own.

A device without entities answers with an empty list. A changed entity list moves no column and no
[schema hash](schema-hash).

## What this asks of a host

A catalog may arrive at any time and must be re-read, and anything addressed by position
re-resolved against it. A host that reads catalogs only on connect ignores the announce, as it
ignores the one after a restart.

## Changing a catalog

Every entry of the entity list carries its length, so a host can step over what it does not know.
A newer device can therefore add to the entity list without breaking an older host:

- **A new entry kind.** A host skips an entry whose `EntryKind` it does not know.
- **A new optional field.** It gets a reserved flag bit and goes at the end of the entry, after
  every existing field. A host reads the fields it knows and skips the rest by the length.
- **A new flag bit without a field.** A host ignores a bit it does not know.
- **A new value in an existing field**, such as a new state class. A host treats a value it does
  not know as "not set".

Anything else, such as changing, reordering or removing a field, or giving an existing value a new
meaning, needs a new message key (see [Message Keys](message-keys)).

The same holds for the fixed frames [`95`](frames/properties), [`85`](frames/events),
[`A5`](frames/commands) and [`C1`](frames/control): a host ignores any bytes after the fields it
knows, before the CRC32, so a field can be added at their end. [Data frames](frames/data) cannot
grow that way, since their values run up to the CRC32; `FrameFlags` keeps reserved bits for them.
Flags keep reserved bits, sent clear.
