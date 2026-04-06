---
sidebar_position: 2
---

# Devices

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

| Element | Size | Type |
|-------|------|------|
| MasterSlaveConfig | 1 byte | uint8 |
| SlaveID | 1 byte | uint8 |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |

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

| Element | Size | Type |
|-------|------|------|
| MasterSlaveConfig | 1 byte | uint8 |
| SlaveID | 1 byte | uint8 |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |

See [Elements](../elements) for field definitions.

---

## B4 — Devices (`0xB4`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 18
---
packet-beta
  0-2: "SlaveID_hi"
  3-5: "SlaveID_lo"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
```

| Element | Size | Type |
|-------|------|------|
| SlaveID_hi | 1 byte | uint8 (always `0x00`) |
| SlaveID_lo | 1 byte | uint8 (always `0x00`) |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |
| ClientNo | variable | null-terminated string |
| ClientDataEnabled | variable | null-terminated string |

---

## B5 — Devices (`0xB5`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 18
---
packet-beta
  0-2: "SlaveID_hi"
  3-5: "SlaveID_lo"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
  26-29: "ServerRestarted"
```

| Element | Size | Type |
|-------|------|------|
| SlaveID_hi | 1 byte | uint8 (always `0x00`) |
| SlaveID_lo | 1 byte | uint8 (always `0x00`) |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |
| ClientNo | variable | null-terminated string |
| ClientDataEnabled | variable | null-terminated string |
| ServerRestarted | variable | null-terminated string |

---

## B6 — Devices (`0xB6`)

Device identity message.

```mermaid
---
config:
  packet:
    showBits: false
    bitsPerRow: 18
---
packet-beta
  0-2: "SlaveID_hi"
  3-5: "SlaveID_lo"
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

| Element | Size | Type |
|-------|------|------|
| SlaveID_hi | 1 byte | uint8 (always `0x00`) |
| SlaveID_lo | 1 byte | uint8 (always `0x00`) |
| DeviceName | variable | null-terminated string |
| HWVersion | variable | null-terminated string |
| FWVersion | variable | null-terminated string |
| LibVersion | variable | null-terminated string |
| LibName | variable | null-terminated string |
| ClientNo | variable | null-terminated string |
| ClientDataEnabled | variable | null-terminated string |
| ServerRestarted | variable | null-terminated string |
| DeviceType | variable | null-terminated string (`"server"` or `"hub"`) |
| Parent | variable | null-terminated string |
