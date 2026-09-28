---
sidebar_position: 3
---

# Message Keys

The **Message Key** is the single byte after `<blaeck:` that identifies a frame (see the envelope in the
[Introduction](intro)).

A key fully determines the layout of the payload that follows. Decoders therefore switch on the key
alone and never need prior state to know how to read a frame.

## Assigned Keys

Each frame owns a small block of keys. Keys within a block are taken in ascending order as the frame
is revised.

| Block | Current | Frame |
| --- | --- | --- |
| `85`–`88` | `85` | [Event](frames/events) |
| `90`–`94` | `90` | [Entity List](frames/entities) |
| `95`–`98` | `95` | [Property](frames/properties) |
| `A5`–`A8` | `A5` | [Command Ack](frames/commands) |
| `B2`–`BF` | `B7` | [Device List](frames/devices) |
| `C0`–`C3` | `C1` | [Device Notification](frames/control) |
| `D1`–`D7` | `D3` | [Data](frames/data) |

`80`–`84`, `A0`–`A4`, `E0`–`E3` and `F0`–`F3` are unassigned.

## Allocating a Key

When a modification violates the payload's structure — such as replacing, reordering, or deleting a
field — a new key must be assigned from the next available slot in the assigned keys list. However,
utilizing reserved bytes to add additional capabilities is preferred when it allows the existing key
to be retained.
