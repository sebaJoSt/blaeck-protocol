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
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-9: "DeviceName"
  10-11: "HWVer"
  12-13: "FWVer"
  14-15: "LibVer"
```

**Element layout** (repeated per device):

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
    bitsPerRow: 16
---
packet-beta
  0-2: "MSC"
  3-5: "SlaveID"
  6-9: "DeviceName"
  10-11: "HWVer"
  12-13: "FWVer"
  14-15: "LibVer"
  16-19: "LibName"
```

**Element layout** (repeated per device):

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
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-25: "DataEnabled"
```

**Element layout** (repeated per device):

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
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-23: "DataEnabled"
  24-31: "ServerRestarted"
```

**Element layout** (repeated per device):

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
    bitsPerRow: 16
---
packet-beta
  0-1: "ID_hi"
  2-3: "ID_lo"
  4-7: "DeviceName"
  8-9: "HWVer"
  10-11: "FWVer"
  12-13: "LibVer"
  14-15: "LibName"
  16-19: "ClientNo"
  20-23: "DataEnabled"
  24-27: "ServerRestarted"
  28-31: "DeviceType"
  32-35: "Parent"
```

**Element layout** (repeated per device):

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
