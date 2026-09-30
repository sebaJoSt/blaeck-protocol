---
sidebar_position: 5
---

# Ack Reasons

The [AckReason](elements) byte in an [A5](frames/commands) frame explains the [AckStatus](elements).

| Code | Name | Status | Description |
|------|------|--------|-------------|
| `0` | OK | accepted | Delivered to a handler; validation passed. |
| `1` | UNKNOWN | rejected | No input, sensor, button or plain command has that name, and no catch-all handler took it. |
| `2` | OUT_OF_RANGE | rejected | Number outside the input's `[RangeMin, RangeMax]`, or outside what its variable holds. |
| `3` | BAD_SWITCH | rejected | Bool value was not `0` or `1`. |
| `4` | BAD_SELECT | rejected | Enum value was neither a valid index nor an option name. |
| `5` | TOO_LONG | rejected | Text value, after percent-decoding, exceeded the input's `TextMaxLen`. |
| `6` | MISSING_VALUE | rejected | An input received no value. |
| `7` | TRUNCATED | rejected | Frame did not fit: more parameters than the device accepts, or longer than its receive buffer. |
| `8` | DEVICE_NOT_RESPONDING | rejected | The command's sub-device is marked missing. |
| `9` | NOT_AN_INTEGER | rejected | Number with a fraction for an input bound to an integer type. |
| `10` | READ_ONLY | rejected | The name is a sensor, which a host cannot set. |
| `11` | NOT_A_NUMBER | rejected | A number input received a value that is not a [number](commands#numbers). |

Codes `2`–`6`, `9` and `11` are only produced for inputs, since validation is driven by their
entries in the [Entity List](frames/entities).

Code `7` applies to every command, plain included: it reports that what the device parsed is
not what was sent, so no handler runs.

An empty parameter and an absent one are different. `<NAME,>` carries one empty value, which
only a text input accepts (it clears the field); `<NAME>` carries none and yields
MISSING_VALUE.

