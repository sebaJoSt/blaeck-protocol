---
sidebar_position: 4
---

# Control

## C0 — Restart Notification (`0xC0`)

Sent when a device restarts. Allows the host to re-request the symbol list and reset state. Payload follows the same layout as [B3](devices#b3--devices-0xb3):

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
```
