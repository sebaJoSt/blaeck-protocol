---
sidebar_position: 3
---

# Frames

Each frame type is identified by its message key — a single byte in the [frame envelope](../intro#protocol-at-a-glance). Frames are grouped by function:

## Signals

| Key | Hex | Description |
|-----|-----|-------------|
| [B0](signals#b0--symbol-list-0xb0) | `0xB0` | Signal schema: names, types, master/slave config |

## Devices

| Key | Hex | Description |
|-----|-----|-------------|
| [B2](devices#b2--devices-0xb2) | `0xB2` | Device identity: name, hardware, firmware, and library version |
| [B3](devices#b3--devices-0xb3) | `0xB3` | Device identity with LibName |
| [B4](devices#b4--devices-0xb4) | `0xB4` | Device identity with LibName, ClientNo, and ClientDataEnabled |
| [B5](devices#b5--devices-0xb5) | `0xB5` | Device identity with LibName, ClientNo, ClientDataEnabled, and ServerRestarted |
| [B6](devices#b6--devices-0xb6) | `0xB6` | Device identity with LibName, ClientNo, ClientDataEnabled, ServerRestarted, DeviceType, and Parent |

## Data

| Key | Hex | Description |
|-----|-----|-------------|
| [B1](data#b1--data-0xb1) | `0xB1` | Signal values with StatusByte and CRC32 |
| [D1](data#d1--data-0xd1) | `0xD1` | Signal values with RestartFlag, 4-byte Timestamp, StatusByte, and CRC32 |
| [D2](data#d2--data-0xd2) | `0xD2` | Signal values with SchemaHash, 8-byte Timestamp, StatusByte, StatusPayload, and CRC32 |

## Control

| Key | Hex | Description |
|-----|-----|-------------|
| [C0](control#c0--restart-notification-0xc0) | `0xC0` | Notifies that a device restarted |
