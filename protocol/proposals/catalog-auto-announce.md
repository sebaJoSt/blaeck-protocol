---
sidebar_position: 2
---

# Catalog auto-announce (proposal)

**Status:** implemented in BlaeckSerial on 2026-08-17, the day it was written. BlaeckTCP still
to follow. The rule itself now lives in [Control](../frames/control); this page keeps the
reasoning, and the two approaches that were rejected on the way.

A device that changes a declaration while running has to tell the host, and today that is the
sketch's job. This proposes the library take it over, and settles which declarations may change
at all while a session is running.

## What goes wrong now

Catalogs are sent at startup and on request. A change made after that is announced only if the
sketch calls `writeStateChannels()`, `writeEventChannels()`, `writeCommands()` or
`writeSignalConfig()` itself, and nothing detects the call that never came.

The consequence is not a dropped frame. Every catalog addresses its entries by position, so a host
resolving against a stale list files values under the wrong names - and, as the
[Events](../frames/events) page puts it, with nothing in the frame to notice it by.

The host half of this is already built. A catalog arriving mid-session is re-read, the device tree
is rebuilt from it, and discovery is re-published, so entities that disappeared are reconciled away
and new ones arrive. Detection is solved. **Delivery is the gap**, and it is the only gap.

## Why not a hash

The obvious instinct is to extend [SchemaHash](../schema-hash) to cover the catalogs, or to add a
second one. Both fail on the same point: **a hash needs a carrier, and the catalogs have none.**

SchemaHash works because it rides in every data frame, and data flows continuously. The catalogs
feed a host's entity discovery, which can be running while **no data flows at all** - a host may
bring its bridge up before logging is activated and sit there waiting for a user to confirm, with
controls live and not one data frame on the wire. An epoch carried in a data frame is blind exactly
where the catalogs are being used.

A catalog hash also has to answer a question SchemaHash never faced. `90` carries each channel's
current value, so a hash over the frame as sent would change every time a value changed, and the
mechanism would invert into a permanent refetch. It would have to be defined over a selection of
bytes - declaration fields yes, `StateValue` no - and every implementation would have to agree on
that selection exactly, where a mismatch shows up as a refetch loop rather than an error.
SchemaHash stays interoperable because it is trivially simple: names and datatype codes.

An announce needs no carrier and no agreement. It travels on the same channel as the thing that
changed.

## What may change while running

Not every declaration is equally safe to change, and the rule falls on a line the implementations
already draw.

| catalog | announce | why |
|---|---|---|
| `90` state channels | yes | feeds discovery, never storage layout |
| `80` event channels | yes | same |
| `A0` commands | yes | same |
| `F0` signal config | yes | metadata only - unit, icon, device class, state class, precision, display name |
| `B0` symbols | **never** | a signal list change mid-session is not a legal change |

**`B0` is excluded on purpose, and it is the important half of this proposal.** A host fixes its
storage layout when logging starts - one column per signal - so a changed signal list has no
correct interpretation, and the right behaviour is to stop with an error. Auto-announcing would
work against that: a host that re-reads a symbol list may adopt the hash that came with it, which
suppresses the mismatch it was supposed to raise and lets data keep flowing into a table whose
columns no longer describe it. A loud, correct failure would become silent corruption. An announce
must never repair a rule violation into silence.

So `deleteSignals()` keeps its warning, and its scope stays what it always was: between sessions,
not during one.

The three announced catalogs can each be emptied and re-declared the same way, and each carries
the same warning today - follow it with the matching write, or values are filed against the wrong
entries. Those warnings describe a step the library can take itself, and this proposal is what
lets them go. The signal one stays, because there the manual step is not a chore but the point at
which a device declares it has left the schema the session was built on.

`F0` is the other side of that line. Changing a signal's unit or icon touches no column and does
not move the schema hash, so it is legal while logging - and today it is invisible until something
polls `F0` or the device restarts, leaving a wrong unit on an entity indefinitely.

The rule, stated once: **any declaration change a device is permitted to make while running
announces itself.**

## Mechanism

Four dirty flags, one per announced catalog.

**Marked on change, not on assignment.** A setter is idempotent today, so a sketch may reasonably
call one every iteration:

```cpp
OutputSignal.withIcon(running ? F("mdi:play") : F("mdi:pause"));
```

A flag set blindly would re-announce the whole catalog every loop, so the mark must compare first
and set only when the value actually differs. Without that, this proposal makes previously free
code expensive - and not only on the link: a host re-publishes its whole entity discovery bundle
when a catalog arrives, not a delta, so an announce is dearer at the far end than the frame
itself suggests.

**Hooked on the setters as well as on registration.** A handle stores its owner and index and can
be kept and used later, so an existing entry can be re-styled long after it was declared - which
needs no free table slot and is the likelier runtime change of the two. Each family funnels its
writes through one accessor, which is where that mark belongs. Registering an entry and clearing
a table whole are declaration changes too, and mark the same flag.

The boundary this lands on is already correct: the two mutators that change a signal's *name*
recompute the schema hash and do not go through the metadata accessor, so they cannot be marked as
a safe metadata change even by accident.

**Cleared by any send of that catalog** - a host poll, the startup announce, or a flush. "Dirty"
means the host has not seen the current catalog, so whatever satisfies that clears it. This is also
what keeps startup quiet: declarations made in `setup()` mark their catalogs, and the restart
announce clears them without sending anything twice.

**Flushed before a push, and at the end of `read()`.** The second is the ordinary case. The first
is for a command handler, which runs *inside* `read()` and may declare a channel and report on it
before returning, and it is not a nicety. A catalog can be emptied and re-declared whole, which
renumbers it: after that, position 3 still exists and names something else, so a push sent before
the announce is filed against the wrong channel rather than dropped. That is the silent case, the
same one that makes a stale catalog dangerous in the first place. Flushing on the push turns *a
host never receives a push against a catalog it has not seen* into an invariant.

Unsolicited announces carry `MessageID` 1, the convention already used for "nobody asked".

## What it asks of a host

That a catalog may arrive at any time and must be re-read when it does. A host that only reads
catalogs at connect time is no worse off than today - it ignores frames it did not request, exactly
as it ignores the startup announce.

## What it requires of a device

**The values in `90` must be read when the frame is built, never from a copy kept for the
purpose.** A host applies an arriving catalog over what it holds, which is only safe while the
catalog cannot be older than a push it already sent. That is true today because the device reads
the live variable - or calls the getter - as it writes the entry. Announcing on every declaration
change makes it load-bearing rather than incidental: a device that cached its values would begin
rolling them back on the host each time something unrelated was re-styled.

A channel that declared no value at all is unaffected. It carries none in the catalog, so there
is nothing to replay and nothing to roll back - which is also why a re-announce cannot resurrect
a status line that has long since scrolled past.

## Compatibility

- **Nothing on the wire changes.** No new frame, no new field, no new message key. Unsolicited
  catalogs are already sent at startup, so this changes only how often one arrives.
- **Older hosts are unaffected**, beyond seeing catalogs more often.
- **Cost on the device** is four flags and a comparison in each setter.

## What it touches

BlaeckSerial and BlaeckTCP (the flags, the accessors, the flush points), and this spec - the
device's obligation to announce belongs here, not in a header comment. No host change is required
for a host that already re-reads catalogs on arrival.

## Open

Whether a sketch should be able to switch it off. Deliberately not proposed: it is API surface for
a case nobody has, and a sketch that truly wants silence can already stop calling the writers - it
just cannot stop the library from being correct by default.
