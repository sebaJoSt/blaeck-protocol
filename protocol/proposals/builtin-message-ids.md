---
sidebar_position: 3
---

# Built-ins, message ids and the trigger flag (proposal)

**Status:** proposed on 2026-08-19, nothing built. Targets BlaeckSerial 7.0.0 while it is still
unreleased and the wire can be changed without a migration. It follows
[Command correlation](./command-correlation), which gave typed commands a `#42:` message id;
this one asks what the built-ins should do now that such a thing exists.

The short version: the `MessageID` header field is doing three unrelated jobs, two of them with
magic numbers a host has to be told about. This proposes it do one job, that the facts the magic
numbers were carrying move somewhere they can be read without a lookup table, and that one of
those facts stop needing to be carried at all.

## What goes wrong now

`MessageID` is four bytes in every frame header. Today it means:

| job | who chooses | example |
|---|---|---|
| echo | the host, in parameters | `<BLAECK.WRITE_SYMBOLS,0,0,0,0>` comes back with `0` |
| tag | the *device*, from thin air | timed data carries `185273099`, or `185273100` |
| pairing | the host, in a `#` prefix | `<#42:SET_AMP,0.9>` is acked with `42` |

The first two are the problem. A field that a host fills in sometimes and a device invents at
other times cannot be read by a rule; it can only be read by a table of constants, and the table
is not written down anywhere on the wire.

### The constants are a private language

`185273099` is `0x0B0B0B0B`. `185273100` is `0x0B0B0B0C`. `252645135` is `0x0F0F0F0F` — which is
why Loggbok asks for data by sending `<BLAECK.WRITE_DATA,15,15,15,15>`. These are not identifiers.
They are four repeated bytes chosen to be recognisable in a hex dump, sent as four little-endian
decimals because an older parser read parameters one byte at a time.

Nothing about `15,15,15,15` tells a reader it means "please send data now". Nothing about
`185273100` tells a reader it means "this device's interval was fixed by its sketch". Both facts
are real and worth knowing; neither is discoverable.

And `185273100` does not mean only that. Shipped `blaecktcpy` sends the same number for a
hub-overridden interval — a different fact, about a different device, on the same wire. One
constant, two meanings, written down in neither implementation. That is what a private language
does once it has more than one speaker. The hub goes away in `blaecktcpy` 3 and takes its meaning
with it, which is the same cure this page prescribes throughout: remove the feature and the
reporting problem goes with it.

### One constant works only because nobody decodes it

A device sends `185273100` instead of `185273099` when the sketch pinned the interval with
`setIntervalMs()`, added in 6.0.0. Loggbok defines only `185273099` and compares with `==`, so the
sketch-fixed value matches nothing.

That is deliberate, and it is worth being precise about why, because it looks like a bug. Loggbok
is never told what interval the sketch chose. Recognising the frame as timed would arm its
timed-log timer with `LoggingIntervalUsed` — *its own* configured interval — and draw a progress
bar counting down to a moment the device has no intention of sending at. Failing to recognise the
value suppresses the indicator instead of drawing a wrong one.

So the constant carries a real fact: *this frame was timed, but not at the rate you think*. The
objection is not to the fact but to the means, which survives only as long as exactly one host
exists and its ignorance of one constant holds. A second implementation that reasonably decoded
`185273100` as "timed" would draw a confidently wrong countdown — and so would a maintainer of
this one who noticed the asymmetry and "fixed" it by adding the value to the table.

It also only ever says what the rate *is not*. The effective interval is nowhere on the wire;
`getIntervalMs()` exists only on the device, and returns the mode rather than the rate in force.
So a host cannot draw the right bar even in principle.

Everything above is downstream of one feature: the **interval lock**. Proposal 6 removes it in both
its forms, which is why this page proposes no frame for reporting a rate. See there for why.

### A host counts when it should correlate

"Log now" sends `<BLAECK.WRITE_DATA,15,15,15,15>`, then watches a counter of frames whose
`MessageID` equals `252645135`, and gives up after three seconds.

Any such frame ends the wait — including a late reply to an earlier request, and including a frame
requested by somebody else on the same link. The request cannot recognise its own answer, because
every requested frame in the world carries the same number.

The three-second timeout also covers two situations a user would want told apart: the device never
heard the request, and the device heard it and is busy. Waiting cannot distinguish them.

### `ACTIVATE` can refuse without saying so

```cpp
else if (equalsFlash(_parsedCommand, F(BLAECK_BUILTIN_ACTIVATE)))
{
  if (_fixedInterval_ms == BLAECK_INTERVAL_CLIENT)
  {
    unsigned long timedInterval_ms = _parsedMsgId();
    this->_setTimedDataState(true, timedInterval_ms);
  }
}
```

There is no `else`. When the sketch has locked the interval — pinned or off — `ACTIVATE` and
`DEACTIVATE` do nothing and send nothing. A host asks for data every 500 ms and receives neither a
rate change nor a refusal, which it cannot tell apart from a dead link.

Proposal 6 removes the lock in both its forms, which removes this case at the root: nothing on the
device can decline an `ACTIVATE` any more. What remains is the other half of the silence — a host
still has no way to know its request arrived at all, whatever the answer:

```cpp
if (sendAck && strncmp(_parsedCommand, "BLAECK.", 7) != 0)
  _writeCommandAck(receivedChars, ackStatus, ackReason);
```

Anything beginning with `BLAECK.` is exempt from acks. That is right for a built-in whose response
frame *is* its answer, and leaves nothing at all for `ACTIVATE` and `DEACTIVATE`, which have no
answer to give.

## Proposal

### 1. Built-ins take a message id in the prefix, not in parameters

Every built-in accepts the same `#id:` prefix a typed command accepts, and none of them take
`MsgID[0..3]` parameters any more.

```
<BLAECK.WRITE_SYMBOLS>            no id wanted
<#7:BLAECK.WRITE_SYMBOLS>         id 7, echoed in the response header
```

One spelling for one concept, on every command in the protocol. The parameter form goes away
entirely — it exists because of a parser that no longer exists.

**An id is 1 to 65535.** That is what the prefix parser accepts, and it is narrower than the four
bytes it is echoed into: `0` is not a value a sender may use, because `0` in the header is how a
frame says it answers no request. Worth writing into the spec, since the parameter form it
replaces could carry any 32-bit number and nothing said otherwise.

**The handshake needs no compatibility machinery.** A bare `<BLAECK.GET_DEVICES>` parses
identically on every version ever shipped, so a host can open with it before it knows the version
and start sending ids only once the catalog has answered. See
[Ordering](#ordering-one-frame-decides-everything-after-it-is-conditional) for what that constrains.

### 2. `ACTIVATE` takes a plain decimal interval

```
<BLAECK.ACTIVATE,1000>            one second
```

instead of four little-endian bytes. The interval was never a message id; it borrowed the
parameter decoder because that decoder was what existed.

Implementation note: on AVR `atoi` is 16-bit, so an interval above 32767 ms needs `strtoul`. The
current byte-wise decode sidesteps this by never parsing a number above 255.

### 3. A trigger flag in the data frame, replacing the device-invented tags

The data frame already carries a one-byte flag, currently written as `0` or `1` for the restart
flag, with seven bits unused:

```cpp
bool restartFlagSnapshot = _sendRestartFlag;
_bufByte(restartFlagSnapshot ? 1 : 0);
```

Bit 1 becomes **requested**: set when this frame answers a `WRITE_DATA`, clear when it is a timed
frame. That is the whole question a host has to answer about an arriving frame, and one bit
answers it.

**The element gets renamed with it: `RestartFlag` becomes `FrameFlags`** — bit 0 restart, bit 1
requested, bits 2-7 reserved. A byte holding two facts should not be named after one of them, and
this is a documentation change: the byte is where it always was. Not to be confused with the
[StatusByte](../status-codes), which is a different element carrying a value rather than bits, and
already spends `0x01`, `0x80` and `0x81`. Naming the new one anything with "status" in it would
rebuild that confusion on purpose.

**One bit is enough because the host owns the rate.** A timed frame is timed at the interval the
host set with `ACTIVATE`, and after proposal 6 nothing on the device can outrank it. A sketch that
drives `writeAllData()` from its own loop is not doing timed data and is not what this bit
describes — the frame carries no id and no requested bit, and a host that never sent `ACTIVATE` is
not drawing a countdown to arm wrongly.

This is the fact `185273099` and `252645135` were encoding, moved somewhere self-describing. A
second client, a sniffer, or a replayed log can read it without knowing anybody's constants. The
device stops inventing identifiers, and `MessageID` on a data frame becomes free to mean what it
means everywhere else: the id of the request being answered, or `0`.

Both are worth keeping, because they answer different questions. The **id** tells *you* which of
*your* requests this frame answers. The **flag** tells *anyone* how the frame came to be sent.
Deriving one from the other — reading `id == 0` as "timed" — would reintroduce exactly the
overloading this proposal removes.

**Who owns the rate needs no bit of its own.** With the interval lock removed by proposal 6, there
is one situation left: the host sets the rate. Nothing on the device can pin it, refuse it, or
outrank it, so there is nothing left for a frame to announce.

That is the whole reason this proposal adds one bit and not three, and adds no frame for reporting
an interval. Remove the feature and the reporting problem goes with it.

### 4. Every command is acked, including built-ins

Delete the `strncmp(..., "BLAECK.", 7)` carve-out. One rule replaces a per-command table of which
frame counts as an answer:

> Every command produces exactly one ack. Commands that also have an answer send the ack first,
> then the response frame.

Ack-first matters: it is what lets a host tell a refusal from an answer that has not arrived yet.
It is also a reordering, not only an addition: today the ack is written after the handler has run,
so a typed command whose handler pushes a state frame already puts that frame on the wire first.
Commands that are acked today change order too.

An ack costs 35 bytes on the wire — frame markers, header, two hashes, status, reason — against a
data frame carrying real signals. Only *requested* data pays it; timed data is not a command and is
never acked.

This is what finally gives `ACTIVATE` a voice. Not to refuse — after proposal 6 it has nothing to
refuse with — but to say it arrived. A host that sends a rate and hears nothing back cannot tell a
device that took it from a link that dropped it.

### 5. `GET_DEVICES` drops `ClientName` / `ClientType`

BlaeckSerial ignores both. They exist for a `blaecktcpy` hub feature that was never publicly
advertised, has no users, and is itself being removed in `blaecktcpy` 3. With them and the id
parameters gone, no built-in except `ACTIVATE` takes positional parameters at all, so no old frame
can be silently reinterpreted as a new one — the parameter counts do not overlap.

The `B6` device frame drops the two fields with them. Nothing would set them once the command
stops carrying them, and a field nobody fills is worse than no field: a reader cannot tell an
empty name from a client that declined to give one.

### 6. Drop the interval lock

`setIntervalMs()` currently takes three kinds of value: a fixed rate in milliseconds,
`BLAECK_INTERVAL_OFF`, and `BLAECK_INTERVAL_CLIENT`. All three go, and the setter with them. The
host sets the rate; the device has no say to express.

The fixed-rate lock is the origin of nearly everything this page has had to work around. It is the
only reason `185273100` exists, the only reason a host must be told a rate it did not choose, and
the only reason a rate would have to be reported on the wire at all — which would have cost a new
catalog frame, a new built-in to request it, a new host poll, and a re-announce rule to keep it
from going stale. That is a substantial amount of protocol for one setting.

Against which: it appears in two examples, **both commented out**; it is documented in the README
and nowhere in this specification; and it was added in 6.0.0 to mirror `blaecktcpy`, not to answer
a need on a microcontroller. A sketch that wants its own cadence already has one — drive
`writeAllData()` from its own timer and never depend on the library's.

**The off lock goes too.** An earlier draft kept it: "this board must not be made to send timed
data" costs nothing to express, and with acks it could be refused out loud rather than in silence.
But it buys a policy no sketch has asked for, at the price of a device that can decline a host —
and a refusal needs a reason code the wire does not have, a ninth value defined for one setting.
A sketch that does not want a stream can decline to call `tick()`, which needs no protocol at all.

Removing it also settles proposal 4: with nothing left to refuse, an ack on a built-in means the
device heard the request, and only that.

**On diverging from `blaecktcpy`.** Its `local_interval_ms` keeps all three modes and should. A
Python server fronting several clients has reason to pin a rate; a board with one host does not.
That is a property of the server itself and survives everything below.

The hub does not. It is being removed in `blaecktcpy` 3, and with it the only code in the ecosystem
that *sends* `ACTIVATE` rather than receiving it — so there is nothing here to stay compatible
with. What remains is the receiving side: the server decodes a client's `ACTIVATE`, and proposal 2
makes that a decimal rather than four bytes.

**A 6.x sketch calling `setIntervalMs()` stops compiling.** That is the right failure. An earlier
draft dropped only the fixed rate, which left the call valid and the value refused at runtime on a
debug stream nobody may have attached — a sketch could quietly become host-controlled and never say
so. Taking the whole method away puts the break where the author sees it, without the enum-typed
parameter that partial removal would have needed.

**What the removal leaves behind: a getter that no longer says anything.** `getIntervalMs()`
returns `_fixedInterval_ms`, the field the lock lived in — so once the lock is gone it has nothing
left to report. It is a mode getter wearing a duration's name, and its own
documentation already admits the mismatch — "in client-controlled mode this reports the mode, not
whatever a host has since asked for". A board sending timed data every 1000 ms answers `-1`.
No sketch calls it: not an example, not this specification, and nowhere in the library itself. Its
one caller is the `@code` block in its own documentation, which CI extracts and compiles — so the
rename below costs a doc rewrite rather than a broken build.

Meanwhile the two values a sketch might actually want are private: the rate in force
(`_timedInterval_ms`) and whether anything is being sent (`_timedActivated`). So a sketch cannot
read back what a host asked for — it cannot print the cadence on a status channel, cannot drive its
own logic from it, and cannot persist it to EEPROM to come back at the same rate after a power cut.

Since the old name has no callers to break, give it to the value that deserves it:
`getIntervalMs()` reports the rate in force, and `isTimedDataActive()` reports whether timed data
is being sent at all — the name the library already uses internally, and the state `ACTIVATE` and
`DEACTIVATE` switch. Two getters and no setter, which is the shape of a value the host owns and the
sketch may read.

This is a library surface, not a wire change — nothing new is transmitted. A host does not need to
be told the rate: after proposal 6 nothing can outrank its `ACTIVATE`, and a device that reboots
says so with the restart flag already in the data frame, which is enough for a host to re-send the
interval it chose. The getter exists for the sketch, which today has no way to observe a setting
made on its behalf.

## Ordering: one frame decides, everything after it is conditional

This is the load-bearing constraint of the whole migration, so it is worth stating as a rule
rather than leaving it implied.

A host learns which library and version it is talking to from the **device frame** — the answer to
`GET_DEVICES`. Nothing else carries it. So there is a window at the start of every session in
which the host must speak without knowing who is listening, and every frame sent in that window
must parse identically on 6.x and 7.x.

Today that window contains exactly two frames, in this order:

| frame | sent before version known | new form parses on pre-7? |
|---|---|---|
| `<BLAECK.DEACTIVATE>` | yes | yes — takes no parameters, unchanged |
| `<BLAECK.GET_DEVICES>` | yes | yes — the parameter loop finds nothing and yields `0` |

Both are safe, and neither needs a conditional. `DEACTIVATE` already takes nothing. `GET_DEVICES`
is sent today as `<BLAECK.GET_DEVICES,0,0,0,0,Loggbok,app>`, and the bare form is what a pre-7
device already computes from those zeros — so a host may simply send the bare form from the very
first session and never branch.

Everything sent *after* the device frame arrives is conditional on it:

| frame | conditional on version because |
|---|---|
| `<BLAECK.WRITE_SYMBOLS>` | only if a `#id:` prefix is attached |
| `<BLAECK.WRITE_COMMANDS>` | same |
| `<BLAECK.WRITE_DATA>` | id prefix, and whether the requested bit can be trusted |
| `<BLAECK.ACTIVATE>` | decimal interval on 7.x, four LE bytes on 6.x |
| any typed command | id prefix, as already gated today |

`ACTIVATE` is the only one whose *parameters* change, and therefore the only one a host must build
two ways rather than merely decorate. The pattern is already in place for it: the host builds this
command through a call that takes the library name and version, and already branches inside it —
BlaeckSerial older than 4.0.0 is sent the interval in seconds rather than four bytes, with a
warning when that form cannot hold the value. The 7.x form is a third case in a function that
exists.

**Why this ordering has to be got right.** A pre-7 device receiving a 7.x built-in does not
recognise the name and, because built-ins are unacked on 6.x, answers nothing at all. There is no
error to observe — the session simply stalls waiting for a frame that will never come. That is
precisely the failure this proposal removes for 7.x onward, and precisely the one that still
applies while talking to anything older. Keeping the neutral set to those two frames is what makes
the stall unreachable.

## What a host can do afterwards

"Log now" stops counting and starts correlating:

```
send    <#7:BLAECK.WRITE_DATA>
ack     id 7                      -> the device heard me
data    id 7, requested bit set   -> this frame is mine
```

The counter, the magic constant and the 30 ms polling timer are all replaced by a wait keyed on
the id. A frame requested by somebody else no longer satisfies it. And a missing ack fails in
milliseconds with a real reason, instead of three seconds ending in a shrug.

The same simplification applies to the constant's other reader: the CLI, which uses it for its
log-now key and for the final log it requests before stopping.

## Alternatives that do not work

**Add `185273100` to the host's table.** Not a fix but a regression: the host would draw a
countdown at its own rate against a board running the sketch's. The asymmetry is load-bearing,
which is why the answer is to remove what it was compensating for.

**Keep the tags but let the host choose them.** Host-chosen ids that encode "timed" or "requested"
are the same overloading in nicer clothes, and worse for a third party: only the author of the id
knows what it means.

**Keep the fixed-rate lock and report the rate on the wire.** Workable, and costed out before it
was dropped: a new catalog frame carrying interval and state, a new built-in to request it, a new
host poll, and a re-announce rule — because a value sent once at handshake goes stale the moment a
sketch calls `setIntervalMs()` again. All of it in service of a feature no example uses.

**Keep the fixed-rate lock and widen the device frame instead.** Cheaper-looking, and worse. The
shipped device parser reads devices until the bytes run out, so appended fields are read as the
start of another device rather than skipped; it would need a new frame key. And the value would
still go stale, which is the actual problem.

**Give `ACTIVATE` a dedicated response frame instead of an ack.** Self-describing, but it is a new
frame type for something the ack fields already express, and it leaves the general rule — which
`BLAECK.*` commands can report a failure — still a table rather than a sentence.

## Compatibility

- **Nothing on the wire grows.** The id rides in a header field that exists; the flag rides in a
  byte that exists, renamed but not moved.
- **No shipped host sees any of this.** Loggbok gates on a version range and refused anything above
  `6.99.99` until the day 7.0.0 was started; an out-of-range device is rejected at the catalog with
  "Only devices with BlaeckSerial Version from v3 to v6 are supported". So a released Loggbok never
  reaches a 7.x data frame, ack or `FrameFlags` byte. The 7.x changes need no host-side migration —
  only the unreleased Loggbok has to keep up.
- **The same Loggbok release raises the `blaecktcpy` floor to 3.** So the host that learns to read
  ids and the flag never meets a hub, never meets the four-byte `ACTIVATE` it sends, and never sees
  `185273100` meaning "hub-overridden". The two removals land in the same release and cover for
  each other.
- **Readers should test bit 0 of `FrameFlags`** rather than comparing the whole byte to `1`, since
  more bits are now defined. That is a rule for what gets written next, not a fix for anything
  already shipped. It says nothing about the StatusByte, which is a separate element and stays a
  value.
- **A pre-7 device receiving `<#7:BLAECK.WRITE_DATA>`** does not find the name and answers nothing,
  since built-ins are unacked there. This is the direction that does need care: a host gates ids by
  version, exactly as it already gates the command prefix, and opens with the bare form, which
  works everywhere.
- **A 6.x sketch calling `setIntervalMs()`** stops compiling, the method being gone. That is a
  source break, not a wire one, and it is the failure worth having. See proposal 6.

## What it touches

BlaeckSerial (prefix on built-ins, decimal interval, trigger bit, ack for every command, the
interval lock removed along with `setIntervalMs()`, the getters reporting the live state, `ACTIVATE` answering out
loud, and `getIntervalMs()`'s doc example rewritten with it), this spec (built-in parameter tables,
`MessageID` semantics and range, `RestartFlag` renamed to `FrameFlags` in the element and frame
tables), Loggbok (emit ids, correlate the
requested frame, read the flag, keep the old readings behind a version gate), and `blaecktcpy`'s
`ACTIVATE` decoder — though its own `local_interval_ms` keeps all three modes, and its hub, the one
piece that sent commands rather than answering them, is gone in 3. BlaeckTCP needs the same in the
September pass.

## Until then

Nothing. The earlier draft of this page recommended that a host accept `185273100` alongside
`185273099`, having read the asymmetry as an oversight. That would arm the timed-log timer with
the host's own interval against a board running someone else's, replacing a missing progress bar
with a wrong one. It is recorded here because it is the mistake this design invites: a constant
whose meaning lives in one reader's absence of knowledge looks exactly like a constant somebody
forgot to add.
