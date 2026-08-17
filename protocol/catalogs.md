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

Addressing by position is what makes a catalog's timing matter. A host reading a value against a
catalog the device has moved on from does not fail - it files the value under whatever now sits at
that position. Nothing in the later frame says otherwise, which is why the rules below are about
making sure a host always holds the current one.

## When a catalog is sent

**On request.** Each has a built-in command, listed under [Commands](commands). A host asks when
it connects, and whenever it has reason to believe what it holds is stale.

**At startup.** All five go out behind the [restart notice](frames/control), unasked, because a
host that stayed connected has no reason to ask - nothing has told it anything changed. That page
carries the reasoning for each.

**When it changes while running.** A device that alters what it declares sends the affected
catalog, unasked, with one exception described below. The announce carries `MessageID` 1, the
value used for a frame nobody asked for, and goes out ahead of any [state](frames/states) or
[event](frames/events) push that would otherwise arrive before the catalog explaining it. An event
matters most there: an occurrence appears in no catalog, so one filed against a stale list cannot
be repaired from the announce that follows, the way a state value can.

## The symbol list is not announced

**A changed `B0` is never sent unasked**, and this is deliberate rather than an omission.

The other four describe how a device presents itself. `B0` describes what a host *stores*: a host
fixes its storage layout around the signals it was given when logging began - one column per
signal - so a signal list that moves mid-session has no correct reading. The right behaviour is to
stop and say so.

Announcing it would work against that. A host that takes a fresh symbol list may adopt the schema
that came with it, which silences the mismatch it was supposed to raise and lets it go on writing
into a table whose columns no longer describe the data. A loud, correct failure becomes a quiet
wrong one. A device that changes its signal list mid-session is outside what a host can honour, and
the protocol does not offer it a way to look otherwise.

`F0` is on the other side of that line and *is* announced: a unit or an icon changes no column and
moves no [schema hash](schema-hash), so it is an ordinary change to how a signal is presented.

## What this asks of a host

That a catalog may arrive at any time, and must be re-read and re-resolved against when it does. A
host that reads catalogs only when it connects is no worse off than it was before: it ignores a
frame it did not request, exactly as it ignores the startup announce.
