---
sidebar_position: 1
---

# Introduction

The **Blaeck protocol** is a lightweight binary protocol for streaming typed signal data from embedded devices to host applications. It supports device discovery, schema negotiation, timestamped data frames, and integrity checking — all within a compact, deterministic wire format.

## Protocol at a Glance

Every frame has the same envelope:

```
<blaeck: KEY(1B) : MSGID(4B) : FRAME CRC32(4B) /> LF
```

- **KEY** says which frame follows, and so how to read it.
- **MSGID** is the message id of the command this frame answers, or `0` if no command asked for it.
- **CRC32** covers everything from KEY to the end of FRAME, before escaping.

All multi-byte numbers are little-endian.

See [Frames](category/frames) for all frame definitions.