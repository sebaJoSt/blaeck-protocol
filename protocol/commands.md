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
| `BLAECK.WRITE_SYMBOLS` | Request signal schema | [B0](frames/signals#b0--symbol-list-0xb0) |
| `BLAECK.GET_DEVICES` | Request device identity | [B2](frames/devices#b2--devices-0xb2)–[B6](frames/devices#b6--devices-0xb6) |
| `BLAECK.WRITE_DATA` | Request single data frame | [B1](frames/data#b1--data-0xb1)–[D2](frames/data#d2--data-0xd2) |
| `BLAECK.ACTIVATE` | Start timed data streaming | Continuous data frames |
| `BLAECK.DEACTIVATE` | Stop timed data streaming | — |

## Custom Commands

Libraries may support user-defined commands using the same `<COMMAND,params>` format. The `BLAECK.` prefix is reserved for built-in commands.
