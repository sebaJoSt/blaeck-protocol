---
sidebar_position: 5
---

# Status Codes

The [StatusByte](elements) in [D2](frames/data) data frames indicates the device or hub status at the time of transmission. Status codes are split into two ranges.
## Device-Level Codes (0x00–0x7F)

These codes originate from the physical device.

| Code | Name | Description |
|------|------|-------------|
| `0x00` | Normal | No error; nominal operation. |
| `0x01` | I2C Slave Skipped | An I2C slave device did not respond. |

### 0x01 — I2C Slave Skipped

When a slave device fails to respond over I2C, the master sets `StatusByte = 0x01` and encodes diagnostic information in the [StatusPayload](elements):

| Byte | Content | Description |
|------|---------|-------------|
| 0 | `0x00` | Reserved (always zero) |
| 1 | SymbolID low byte | Low byte of the first skipped signal's SymbolID |
| 2 | SymbolID high byte | High byte of the first skipped signal's SymbolID |
| 3 | SlaveID | ID of the unresponsive slave |

Data values for signals belonging to the skipped slave should be considered **invalid** in this frame.

---

## Hub-Level Codes (0x80–0xFF)

These codes are emitted by hubs when upstream device connectivity changes.

| Code | Name | Description |
|------|------|-------------|
| `0x80` | UPSTREAM_LOST | Upstream device disconnected. |
| `0x81` | UPSTREAM_RECONNECTED | Upstream device reconnected. |

### 0x80 — UPSTREAM_LOST

The hub lost its connection to the upstream device.

**StatusPayload:**

| Byte | Content | Description |
|------|---------|-------------|
| 0 | Auto-reconnect flag | `0x01` = auto-reconnect enabled, `0x00` = disabled |
| 1–3 | `0x00` | Reserved |

When this status is active, signal data from the upstream device should be considered **stale**.

### 0x81 — UPSTREAM_RECONNECTED

The hub successfully reconnected to the upstream device.

**StatusPayload:**

| Byte | Content | Description |
|------|---------|-------------|
| 0–3 | `0x00 0x00 0x00 0x00` | Reserved (all zeros) |

After receiving this status, the host should re-request the symbol list (B0) to account for possible schema changes during the disconnection.

---

# Command Ack Reasons (A5)

The [AckReason](elements) byte in an [A5](frames/commands) frame explains the [AckStatus](elements).
These are a separate namespace from the StatusByte codes above.

| Code | Name | Status | Description |
|------|------|--------|-------------|
| `0` | OK | accepted | Delivered to a handler; validation passed. |
| `1` | UNKNOWN | rejected | No handler registered for the command. |
| `2` | OUT_OF_RANGE | rejected | Number outside the advertised `[RangeMin, RangeMax]`. |
| `3` | BAD_SWITCH | rejected | Switch value was not `0` or `1`. |
| `4` | BAD_SELECT | rejected | Select value was neither a valid index nor an option name. |
| `5` | TOO_LONG | rejected | Text value exceeded the advertised `TextMaxLen`. |
| `6` | MISSING_VALUE | rejected | Command carries a value but the frame supplied none. |
| `7` | TRUNCATED | rejected | Frame did not fit: more parameters than the device accepts, or longer than its receive buffer. |

Codes `2`–`6` are only produced for commands the device advertises with a
[CommandKind](elements) other than plain, since validation is driven by the metadata in the
[A0](frames/commands) catalog.

Code `7` applies to every command, plain included: it reports that what the device parsed is
not what was sent, so no handler runs.

An empty parameter and an absent one are different. `<NAME,>` carries one empty value, which
only a text command accepts (it clears the field); `<NAME>` carries none and yields
MISSING_VALUE.

---

## See Also

- [Elements](elements) — StatusByte and StatusPayload field definitions
- [CRC32](crc32) — In D2 frames, StatusByte and StatusPayload are included in the CRC scope
