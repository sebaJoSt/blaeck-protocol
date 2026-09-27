---
sidebar_position: 5
---

# Ack Reasons

The [AckReason](elements) byte in an [A5](frames/commands) frame explains the [AckStatus](elements).

| Code | Name | Status | Description |
|------|------|--------|-------------|
| `0` | OK | accepted | Delivered to a handler; validation passed. |
| `1` | UNKNOWN | rejected | No handler registered for the command. |
| `2` | OUT_OF_RANGE | rejected | Number outside the advertised `[RangeMin, RangeMax]`. Never sent by a command that advertised no range — see [Command Frames](frames/commands). |
| `3` | BAD_SWITCH | rejected | Switch value was not `0` or `1`. |
| `4` | BAD_SELECT | rejected | Select value was neither a valid index nor an option name. |
| `5` | TOO_LONG | rejected | Text value exceeded the advertised `TextMaxLen`. |
| `6` | MISSING_VALUE | rejected | Command carries a value but the frame supplied none. |
| `7` | TRUNCATED | rejected | Frame did not fit: more parameters than the device accepts, or longer than its receive buffer. |
| `8` | DEVICE_NOT_RESPONDING | rejected | The command's sub-device is marked missing. |

Codes `2`–`6` are only produced for commands the device advertises with a
[CommandKind](elements) other than plain, since validation is driven by the metadata in the
[A0](frames/commands) catalog.

Code `7` applies to every command, plain included: it reports that what the device parsed is
not what was sent, so no handler runs.

An empty parameter and an absent one are different. `<NAME,>` carries one empty value, which
only a text command accepts (it clears the field); `<NAME>` carries none and yields
MISSING_VALUE.

