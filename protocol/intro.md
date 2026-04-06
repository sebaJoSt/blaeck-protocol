---
sidebar_position: 1
---

# Introduction

The **Blaeck protocol** is a lightweight binary protocol for streaming typed signal data from embedded devices to host applications. It supports device discovery, schema negotiation, timestamped data frames, and integrity checking — all within a compact, deterministic wire format.

## Protocol at a Glance

Every Blaeck message is wrapped in a fixed binary envelope:

```
<BLAECK: MSGKEY(1B) : MSGID(4B) : FRAME /BLAECK>\r\n
```

- **Message Key** identifies the frame (e.g., `0xD2` for data with 8-byte timestamps).
- **Message ID** is a user-defined uint32.
- **Frame** carries the key-specific payload.

All multi-byte integers throughout the protocol are **little-endian**.

See [Frames](category/frames) for all frame definitions.