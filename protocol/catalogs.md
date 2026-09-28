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

**Sent on request**, with `BLAECK.GET_DEVICES`, and **when the firmware replaces its signals while
running**. A device never sends it on its own otherwise; a restart or a sub-device going missing is
reported by the [Device Notification](frames/control), and a host that wants the list again asks
for it.

Its signals are what a host stores, one column per signal, fixed when logging began. A device list
whose signals differ from those a session started with ends that session: a host that adopted it
would go on writing into a table whose columns no longer describe the data.

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

Flags keep reserved bits, sent clear. A new entry kind, a new field or a new meaning for a
reserved bit comes with a new major version of the library, and a host accepts only the versions
it knows.
