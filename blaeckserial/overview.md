---
sidebar_position: 1
slug: overview
---

# BlaeckSerial 6.0.0

## Active Frames

| Key | Hex | Frame |
|-----|-----|-------|
| B0 | `0xB0` | [Signal frame](/blaeck-protocol/protocol/frames/signals#b0--symbol-list-0xb0) |
| D2 | `0xD2` | [Data frame](/blaeck-protocol/protocol/frames/data#d2--data-0xd2) |
| B3 | `0xB3` | [Device frame](/blaeck-protocol/protocol/frames/devices#b3--devices-0xb3) |
| C0 | `0xC0` | [Control frame](/blaeck-protocol/protocol/frames/control#c0--restart-notification-0xc0) |

## Status Codes

| Code | Name | Description |
|------|------|-------------|
| `0x00` | Normal | No errors |
| `0x01` | I2C Slave Skip | An I2C slave was skipped |
