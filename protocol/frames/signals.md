---
sidebar_position: 1
---

# Signals

## B0 — Symbol List (`0xB0`)

Enumerates all signals the device exposes. Sent in response to a host request.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 11
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "SymbolName"
  9-10: "DTYPE"
```

Repeated per signal. See [Elements](../elements) for field details.
