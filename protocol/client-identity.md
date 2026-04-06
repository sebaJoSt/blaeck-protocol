---
sidebar_position: 9
---

# Client Identity

**Client Identity** is a BlaeckTCP v6+ feature that allows TCP clients to identify themselves to the server. This information is used for server-side logging and management — it is **not** transmitted in any outbound Blaeck frames.

## Mechanism

Client identity is parsed from the `GET_DEVICES` command. The 6th and 7th comma-separated parameters carry the client's name and type:

```
GET_DEVICES,param1,param2,param3,param4,param5,ClientName,ClientType
```

| Parameter Position | Field | Description |
|-------------------|-------|-------------|
| 6 | ClientName | Human-readable name of the client application |
| 7 | ClientType | Type of client (e.g., `"desktop"`, `"web"`, `"script"`) |

## Storage

The server stores the client identity per TCP connection. It is available for:
- Server-side logging
- Device management UIs
- Diagnostics

## Wire Format

Client identity does **not** appear in any Blaeck frame. The B6 [Devices](message-keys#b6--devices-0xb6-blaecktcp--blaecktcpy) message includes `ClientNo` and `ClientDataEnabled` fields, but these are server-assigned values — not the client's self-reported identity.

## Availability

| Library | Version | Support |
|---------|---------|---------|
| BlaeckTCP | v6+ | ✅ |
| BlaeckSerial | — | N/A (no TCP) |
| blaecktcpy | — | N/A (Python hub, not a TCP server) |

## See Also

- [Message Keys](message-keys) — B6 device message layout
- [Elements](elements) — ClientNo and ClientDataEnabled fields
