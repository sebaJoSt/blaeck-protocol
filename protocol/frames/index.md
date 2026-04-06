---
sidebar_position: 3
---

# Frames

Each frame type is identified by its message key — a single byte in the [frame envelope](../frame-format). Frames are grouped by function:

## Signals

| Key | Hex | Purpose |
|-----|-----|---------|
| [B0](signals#b0--symbol-list-0xb0) | `0xB0` | Symbol List |

## Devices

| Key | Hex | Purpose |
|-----|-----|---------|
| [B2](devices#b2--devices-0xb2) | `0xB2` | Devices (without LibName) |
| [B3](devices#b3--devices-0xb3) | `0xB3` | Devices (with LibName) |
| [B4](devices#b4--devices-0xb4) | `0xB4` | Devices (with ClientNo, ClientDataEnabled) |
| [B5](devices#b5--devices-0xb5) | `0xB5` | Devices (with ServerRestarted) |
| [B6](devices#b6--devices-0xb6) | `0xB6` | Devices (with DeviceType, Parent) |

## Data

| Key | Hex | Purpose |
|-----|-----|---------|
| [B1](data#b1--data-0xb1) | `0xB1` | Data (no timestamps) |
| [D1](data#d1--data-0xd1) | `0xD1` | Data (4-byte timestamps) |
| [D2](data#d2--data-0xd2) | `0xD2` | Data (8-byte timestamps, schema hash, status payload) |

## Control

| Key | Hex | Purpose |
|-----|-----|---------|
| [C0](control#c0--restart-notification-0xc0) | `0xC0` | Restart Notification |
