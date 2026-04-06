---
sidebar_position: 1
---

# Introduction

The **Blaeck protocol** is a lightweight binary protocol for streaming typed signal data from embedded devices to host applications. It supports device discovery, schema negotiation, timestamped data frames, and integrity checking — all within a compact, deterministic wire format.

## Protocol at a Glance

Every Blaeck message is wrapped in a fixed binary envelope:

```
<BLAECK: MSGKEY(1B) : MSGID(4B) : <ELEMENTS> /BLAECK>\r\n
```

- **Header** (`<BLAECK:`) and **footer** (`/BLAECK>\r\n`) are ASCII delimiters.
- **Message Key** identifies the payload type (e.g., `0xD2` for data with 8-byte timestamps).
- **Message ID** is a uint32 (little-endian) echoed from the host request or set by the application.
- **Elements** carry the key-specific payload.

See [Frame Format](frame-format) for the full binary layout, and [Message Keys](message-keys) for all key definitions.

## Typical Session Flow

1. Host connects and requests device info → device replies with a **Devices** frame.
2. Host requests signal list → device replies with a **Symbol List** frame.
3. Device streams **Data** frames at the configured interval.
