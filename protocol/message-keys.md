---
sidebar_position: 3
---

# Message Keys

The **Message Key** is the single byte after `<BLAECK:` that identifies a frame:

```
<BLAECK: MSGKEY(1B) : MSGID(4B) : FRAME /BLAECK>\r\n
```

A key fully determines the layout of the payload that follows. Decoders therefore switch on the key
alone and never need prior state to know how to read a frame.

## Assigned Keys

Each frame owns a small block of keys. Keys within a block are taken in ascending order as the frame
is revised, so the **highest assigned key in a block is the current version** and the lower ones are
superseded revisions still in the field.

| Block | Current | Frame |
| --- | --- | --- |
| `80`–`84` | `80` | [Event Channel List](frames/events) |
| `85`–`88` | `85` | [Event](frames/events) |
| `90`–`94` | `90` | [Message Channel List](frames/messages) |
| `95`–`98` | `95` | [Message](frames/messages) |
| `A0`–`A4` | `A0` | [Command List](frames/commands) |
| `A5`–`A8` | `A5` | [Command Ack](frames/commands) |
| `B2`–`B7` | `B6` | [Devices](frames/devices) |
| `C0`–`C3` | `C0` | [Restart Notification](frames/control) |
| `D1`–`D7` | `D2` | [Data](frames/data) |
| `E0`–`E3` | `B0` † | [Symbol List](frames/signals) |
| `F0`–`F3` | `F0` | [Signal Config](frames/signals) |

† The Symbol List's current key `B0` predates the block scheme and cannot move. `E0`–`E3` is reserved
for its future revisions.

## Legacy Keys

These predate the block scheme and cannot be moved without breaking released libraries.

| Key | Frame | Moved to |
| --- | --- | --- |
| `B0` | [Symbol List](frames/signals) | `E0`–`E3` — still current on `B0`; the **next revision changes the letter** to `E0` |
| `B1` | [Data](frames/data) | `D1`–`D7` — the letter **has already changed**; superseded by `D2` |

## Allocating a Key

When a modification violates the payload's structure — such as replacing, reordering, or deleting a
field — a new key must be assigned from the next available slot in the assigned keys list. However,
utilizing reserved bytes to add additional capabilities is preferred when it allows the existing key
to be retained.
