---
sidebar_position: 2
---

# Devices

Repeated per device. See [Elements](../elements) for field details.

## B2 — Devices (`0xB2`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 18
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
```

---

## B3 — Devices (`0xB3`)

Device identity message.

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

---

## B4 — Devices (`0xB4`)

Device identity message.

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
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
```

---

## B5 — Devices (`0xB5`)

Device identity message.

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
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
  26-29: "ServerRestarted"
```

---

## B6 — Devices (`0xB6`)

Device identity message.

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
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
  26-29: "ServerRestarted"
  30-32: "DeviceType"
  33-34: "Parent"
```
