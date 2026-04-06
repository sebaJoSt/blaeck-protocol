---
sidebar_position: 3
---

# Frames

Each frame type is identified by its message key — a single byte in the [frame envelope](../intro#protocol-at-a-glance). Frames are grouped by function:

## Signals

| Key | Hex |
|-----|-----|
| [B0](signals#b0--symbol-list-0xb0) | `0xB0` |

## Devices

| Key | Hex |
|-----|-----|
| [B2](devices#b2--devices-0xb2) | `0xB2` |
| [B3](devices#b3--devices-0xb3) | `0xB3` |
| [B4](devices#b4--devices-0xb4) | `0xB4` |
| [B5](devices#b5--devices-0xb5) | `0xB5` |
| [B6](devices#b6--devices-0xb6) | `0xB6` |

## Data

| Key | Hex |
|-----|-----|
| [B1](data#b1--data-0xb1) | `0xB1` |
| [D1](data#d1--data-0xd1) | `0xD1` |
| [D2](data#d2--data-0xd2) | `0xD2` |

## Control

| Key | Hex |
|-----|-----|
| [C0](control#c0--restart-notification-0xc0) | `0xC0` |
