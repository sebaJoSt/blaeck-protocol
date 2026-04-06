---
sidebar_position: 3
---

# Commands

Commands are sent from the host to the device as ASCII text, delimited by angle brackets:

```
<COMMAND,Param0,Param1,Param2,Param3>
```

Parameters are comma-separated integers. The number and meaning of parameters is library-defined.

## Built-in Commands

| Command | Description | Response |
|---------|-------------|----------|
| `BLAECK.WRITE_SYMBOLS` | Request signal schema | [Signal frame](frames/signals) |
| `BLAECK.GET_DEVICES` | Request device identity | [Device frames](frames/devices) |
| `BLAECK.WRITE_DATA` | Request single data frame | [Data frame](frames/data) |
| `BLAECK.ACTIVATE` | Start timed data streaming | [Data frames](frames/data) (continuous) |
| `BLAECK.DEACTIVATE` | Stop timed data streaming | — |

The `BLAECK.` prefix is reserved for built-in commands.
