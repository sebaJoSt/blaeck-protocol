---
sidebar_position: 3
---

# Built-ins, message ids and the trigger flag (proposal)

**Status:** proposed on 2026-08-19, nothing built. Targets BlaeckSerial 7.0.0 while it is still
unreleased and the wire can be changed without a migration. It follows
[Command correlation](./command-correlation), which gave typed commands a `#42:` message id;
this one asks what the built-ins should do now that such a thing exists.

The short version: the `MessageID` header field is doing three unrelated jobs, two of them with
magic numbers a host has to be told about. This proposes it do one job, and that the facts the
magic numbers were carrying move somewhere they can be read without a lookup table.

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

### One of the constants works only because nobody decodes it

A device sends `185273100` instead of `185273099` when the sketch pinned the interval with
`setIntervalMs()`, added in 6.0.0. Loggbok defines only `185273099` and compares with `==`, so the
sketch-fixed value matches nothing.

That is deliberate, and it is worth being precise about why, because it looks like a bug. Loggbok
is never told what interval the sketch chose. Recognising the frame as timed would arm its
timed-log timer with `LoggingIntervalUsed` — *its own* configured interval — and draw a progress
bar counting down to a moment the device has no intention of sending at. Failing to recognise the
value suppresses the indicator instead of drawing a wrong one.

So the constant is carrying a real and useful fact: *this frame was timed, but not at the rate you
think*. The objection is not to the fact. It is to the means. The fact survives only as long as
exactly one host exists and its ignorance of one constant holds; a second implementation that
reasonably decoded `185273100` as "timed" would produce a confidently wrong countdown, and so
would a maintainer of this one who noticed the asymmetry and "fixed" it by adding the value to the
table. A protocol should not depend on a reader not knowing something.

It also only ever says what the rate *is not*. Loggbok suppresses the indicator because it cannot
draw it — the effective interval is not on the wire anywhere, and `getIntervalMs()` exists only on
the device. The honest expression of this is a frame that says which rate is in force, so a host
can draw the right bar rather than none.

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

There is no `else`. When the sketch has pinned the interval — or locked streaming off — `ACTIVATE`
and `DEACTIVATE` do nothing and send nothing. A host asks for 500 ms streaming and receives
neither a rate change nor a refusal, which it cannot tell apart from a dead link.

This is not a host bug that better code would avoid. It is two sides legitimately disagreeing
about who owns the rate, and only the device knows the answer.

Built-ins cannot report this because both ack sites are guarded:

```cpp
if (sendAck && strncmp(_parsedCommand, "BLAECK.", 7) != 0)
  _writeCommandAck(receivedChars, ackStatus, ackReason);
```

Anything beginning with `BLAECK.` is exempt from acks. That is right for a built-in whose response
frame *is* its answer, and leaves no channel at all for one that has no answer to give.

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

The data frame already carries a status byte, currently written as `0` or `1` for the restart
flag, with seven bits unused:

```cpp
bool restartFlagSnapshot = _sendRestartFlag;
_bufByte(restartFlagSnapshot ? 1 : 0);
```

Bit 1 becomes **requested**: set when this frame answers a `WRITE_DATA`, clear when the device
sent it on its own schedule.

This is the fact `185273099` and `252645135` were encoding, moved somewhere self-describing. A
second client, a sniffer, or a replayed log can read it without knowing anybody's constants. The
device stops inventing identifiers, and `MessageID` on a data frame becomes free to mean what it
means everywhere else: the id of the request being answered, or `0`.

Both are worth keeping, because they answer different questions. The **id** tells *you* which of
*your* requests this frame answers. The **flag** tells *anyone* how the frame came to be sent.
Deriving one from the other — reading `id == 0` as "timed" — would reintroduce exactly the
overloading this proposal removes.

**Who owns the interval belongs on the flag, not in the catalog.** `setIntervalMs()` is a plain
public setter a sketch may call at any time, from `loop()`, a button or an interlock. A fact
advertised once in the device frame would go stale the moment a sketch changed its mind; a bit
sampled as each frame is built cannot.

Bit 2 therefore becomes **rate fixed by the device**: set when the sketch pinned the interval or
locked streaming off, clear when the host is free to set it. This is what `185273100` was saying,
said in a way a reader can decode rather than one it must fail to decode.

**And the effective interval should be readable — but where is an open question.** A host that
knows only "not your rate" can suppress an indicator; it cannot draw a correct one. The device
knows the number, it is what `getIntervalMs()` returns, and it is nowhere on the wire.

The obvious home is the device frame, except that runs into the same staleness the paragraph above
just used to reject it: a sketch can change the interval at any time. Three ways out, none free —
put it in every data frame (four bytes on the chattiest frame there is, to answer a question that
rarely changes); put it in the device frame and have a device that changes its rate re-announce,
reusing the mechanism from [Catalog auto-announce](./catalog-auto-announce); or leave it out and
accept that a fixed-rate board shows no countdown, as today. The middle one looks right, and it is
the one thing in this proposal that is not yet settled.

### 4. Every command is acked, including built-ins

Delete the `strncmp(..., "BLAECK.", 7)` carve-out. One rule replaces a per-command table of which
frame counts as an answer:

> Every command produces exactly one ack. Commands that also have an answer send the ack first,
> then the response frame.

Ack-first matters: it is what lets a host tell a refusal from an answer that has not arrived yet.

An ack costs about 27 bytes — header, two hashes, status, reason — against a data frame carrying
real signals. Only *requested* data pays it; timed streaming is not a command and is never acked.

This is what finally gives `ACTIVATE` a voice. When the sketch has pinned the interval, it can
refuse with a reason instead of falling silent.

### 5. `GET_DEVICES` drops `ClientName` / `ClientType`

BlaeckSerial ignores both. They exist for a `blaecktcpy` hub feature that was never publicly
advertised and has no users. With them and the id parameters gone, no built-in except `ACTIVATE`
takes positional parameters at all, so no old frame can be silently reinterpreted as a new one —
the parameter counts do not overlap.

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
two ways rather than merely decorate. The pattern is already in place for it: interval recovery
after a restart already resolves through a call that takes the library name and version, so the
branch has somewhere to live.

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

The same simplification applies wherever the constant is used today — an initial value fetch after
MQTT discovery, and the CLI's log-now key.

## Alternatives that do not work

**Add `185273100` to the host's table.** Not a fix but a regression, for the reasons above: the
host would draw a countdown at its own rate against a board running the sketch's. The asymmetry is
load-bearing, which is the strongest argument for replacing it with something that says the same
thing out loud.

**Keep the tags but let the host choose them.** Host-chosen ids that encode "timed" or "requested"
are the same overloading in nicer clothes, and worse for a third party: only the author of the id
knows what it means.

**Advertise interval ownership in the device frame.** Sent once, and `setIntervalMs()` can be
called at any time afterwards, so a host's copy goes stale with no way to notice.

**Give `ACTIVATE` a dedicated response frame instead of an ack.** Self-describing, but it is a new
frame type for something the ack fields already express, and it leaves the general rule — which
`BLAECK.*` commands can report a failure — still a table rather than a sentence.

## Compatibility

- **Nothing on the wire grows.** The id rides in a header field that exists; the flag rides in a
  status byte that exists.
- **A pre-7 host reading a new data frame** parses the status byte as `restart_flag == 1`, so a
  frame that is both a restart and requested (`0b11`) would be read as *not* a restart, losing a
  warning. It only affects a frame that is both at once, and only for hosts already shipped, but
  it is a real regression and the reason the spec should state that readers test **bit 0**, not
  equality.
- **A pre-7 device receiving `<#7:BLAECK.WRITE_DATA>`** does not find the name and answers
  nothing, since built-ins are unacked there. So a host gates ids by version, exactly as it
  already gates the command prefix — and opens with the bare form, which works everywhere.
- **A pre-7 host receiving acks for built-ins** will fail to pair them and log them as unpaired.
  Worth checking it does nothing louder than that.

## What it touches

BlaeckSerial (prefix on built-ins, decimal interval, trigger bit, ack for every command,
`ACTIVATE` refusing out loud), this spec (built-in parameter tables, `MessageID` semantics, the
status byte), Loggbok (emit ids, correlate the requested frame, read the flag, keep the old
readings behind a version gate), and `blaecktcpy`'s encoder. BlaeckTCP needs the same in the
September pass.

## Until then

Nothing. The earlier draft of this page recommended that a host accept `185273100` alongside
`185273099`, having read the asymmetry as an oversight. That would arm the timed-log timer with
the host's own interval against a board running someone else's, replacing a missing progress bar
with a wrong one. It is recorded here because it is the mistake this design invites: a constant
whose meaning lives in one reader's absence of knowledge looks exactly like a constant somebody
forgot to add.
