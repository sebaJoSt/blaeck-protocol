---
sidebar_position: 1
---

# Introduction

The **Blaeck protocol** is a lightweight binary protocol for streaming typed signal data from embedded devices to host applications. It supports device discovery, schema negotiation, timestamped data frames, and integrity checking — all within a compact, deterministic wire format.

## Libraries

Three libraries implement the Blaeck protocol:

| Library | Language | Transport | Repository |
|---------|----------|-----------|------------|
| **BlaeckSerial** | C++ (Arduino) | UART / Serial | [GitHub](https://github.com/sebluo/BlaeckSerial) |
| **BlaeckTCP** | C++ (Arduino) | TCP / Ethernet | [GitHub](https://github.com/sebluo/BlaeckTCP) |
| **blaecktcpy** | Python | TCP | [GitHub](https://github.com/sebluo/blaecktcpy) |

## Compatibility Matrix

Current versions and the message keys they emit:

| Library | Current Data Key | Current Devices Key | Other Keys |
|---------|-----------------|--------------------| -----------|
| BlaeckSerial 6.0.0 | D2 (`0xD2`) | B3 (`0xB3`) | B0, C0 |
| BlaeckTCP 6.0.0 | D2 (`0xD2`) | B6 (`0xB6`) | B0 |
| blaecktcpy 3.0 | D2 (`0xD2`) | B6 (`0xB6`) | B0, C0 (hub) |

:::note
B3 and B6 are **not** sequential replacements — they coexist. BlaeckSerial uses B3 (serial devices), while BlaeckTCP and blaecktcpy use B6 (networked devices with additional fields like `DeviceType` and `Parent`).
:::

## Protocol at a Glance

Every Blaeck message is wrapped in a fixed binary envelope:

```
<BLAECK: MSGKEY(1B) : MSGID(4B) : <ELEMENTS> /BLAECK>\r\n
```

- **Header** (`<BLAECK:`) and **footer** (`/BLAECK>\r\n`) are ASCII delimiters.
- **Message Key** identifies the payload type (e.g., `0xD2` for data with 8-byte timestamps).
- **Message ID** is a monotonically increasing uint32, little-endian.
- **Elements** carry the key-specific payload.

See [Frame Format](frame-format) for the full binary layout, and [Message Keys](message-keys) for all key definitions.

## Typical Session Flow

1. Host connects and requests device info → device replies with a **B3/B6** (Devices) frame.
2. Host requests signal list → device replies with a **B0** (Symbol List) frame.
3. Device streams **D2** (Data) frames at the configured interval.
4. If the device restarts, it sends a **C0** (Restart Notification) frame.
