---
sidebar_position: 9
---

# Client Identity

**Client Identity** allows TCP clients to identify themselves to the server. This information is used for server-side logging and management — it is **not** transmitted in any outbound Blaeck frames.

## Mechanism

Client identity is sent via the `GET_DEVICES` command. The 5th and 6th parameters carry the client's name and type:

```
<BLAECK.GET_DEVICES,P0,P1,P2,P3,ClientName,ClientType>
```

| Field | Description |
|-------|-------------|
| ClientName | Human-readable name of the client application |
| ClientType | Type of client (e.g., `"desktop"`, `"web"`, `"script"`) |

## Storage

The server stores the client identity per TCP connection. It is available for:
- Server-side logging
- Device management UIs
- Diagnostics

## Wire Format

Client identity does **not** appear in any Blaeck frame. The [B6](frames/devices#b6--devices-0xb6) message includes `ClientNo` and `ClientDataEnabled` fields, but these are server-assigned values — not the client's self-reported identity.

## See Also

- [Frames](category/frames) — B6 device message layout
- [Elements](elements) — ClientNo and ClientDataEnabled fields
