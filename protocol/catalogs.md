---
sidebar_position: 7
---

# Catalogs

A **catalog** is a frame carrying a device's whole declared set of something: read in order, from
the first entry to the last, and addressed afterwards by position. Five frames are catalogs.

| catalog | declares | addressed afterwards by |
|---|---|---|
| [`B0` Symbol List](frames/signals) | the signals a device samples | `SymbolId` in [`F0`](frames/signals) and [data frames](frames/data) |
| [`F0` Signal Config](frames/signals) | what each signal says about itself | — |
| [`90` State Channel List](frames/states) | the channels a device reports values on | `ChannelIndex` in a [`95` push](frames/states) |
| [`80` Event Channel List](frames/events) | the channels and the occurrences each may report | `ChannelIndex` and `EventIndex` in an [`85`](frames/events) |
| [`A0` Command List](frames/commands) | the commands a device accepts | nothing - a command is matched by name |

`F0` is named for its contents rather than as a list, but it is one: an entry per signal that
declared something, in the order the symbol list gives them, sent whole.

Addressing is positional, so a host reading a value against a catalog the device has moved on from
does not fail - it files the value under whatever now sits at that position. Nothing in the later
frame says otherwise.

## When a catalog is sent

**On request.** Each has a built-in command, listed under [Commands](commands).

**At startup.** All five go out behind the [restart notice](frames/control), unasked.

**When it changes while running.** A device that alters what it declares sends the affected
catalog, unasked, with the one exception below. The announce carries `MessageID` `0`, the value
every frame nobody asked for carries, and precedes any [state](frames/states) or
[event](frames/events) push that would otherwise arrive before the catalog explaining it. An event
filed against a stale list cannot be repaired afterwards, since an occurrence appears in no
catalog of its own.

## The symbol list is not announced

**A changed `B0` is never sent unasked.** The other four describe how a device presents itself;
`B0` describes what a host stores, one column per signal, fixed when logging began. A signal list
that moves mid-session has no correct reading, and a host that adopted a fresh one would go on
writing into a table whose columns no longer describe the data. The mismatch is meant to stop the
session, so the protocol offers no way to paper over it.

`F0` *is* announced: a unit or an icon changes no column and moves no
[schema hash](schema-hash).

## What this asks of a host

A catalog may arrive at any time and must be re-read, and anything addressed by position
re-resolved against it. A host that reads catalogs only on connect ignores the announce, as it
ignores the startup one.
