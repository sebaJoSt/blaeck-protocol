---
sidebar_position: 2.5
---

# Connections

Frames and commands are the same on every transport. What differs is how many connections a
device has, and which of them receive frames.

## Serial

One port, one host. Everything the device sends goes to that port, and every command arrives
through it.

## TCP

A TCP device accepts several connections at once. Each one is either a **host**, which speaks
the protocol, or a **terminal**, which a person uses to watch and type.

| | Host | Terminal |
|---|---|---|
| Becomes one | by sending a built-in command | on connecting |
| Receives frames | yes | never |
| Receives text | no | the device's diagnostic output |
| Its commands | executed and acknowledged | executed, not acknowledged |

### Becoming a host

Every connection starts as a terminal. It becomes a host when it sends any command whose name
starts with `BLAECK.` — known or not, with or without a [prefix](commands#prefix-section) —
and stays one until it disconnects. A host that reconnects starts as a terminal again.

A host should therefore open every connection with a built-in, typically
`<BLAECK.GET_DEVICES>`. Until it does, it receives nothing: not the answers to other commands,
not data, and not the restart notice.

### What hosts share

The device has one state, as on a serial port, and every host sees it:

- `ACTIVATE` and `DEACTIVATE` start and stop timed data for all hosts, at one interval;
- `PAUSE_WRITES` holds back frames to all hosts;
- the [restart notice](frames/control) is sent once per boot, to the hosts connected when it
  goes out. A device writes no frames while no host is connected, so the notice waits for the
  first host.

Data frames, state values, events and catalogs the device sends on its own go to every host.

### Answers go to the requester

The acknowledgement of a command, and the answer to a built-in — a catalog, the device frame, a
data frame for `WRITE_DATA` — go only to the host that sent it. Other hosts see the effect of a
command, not its answer.

### Terminals

A terminal receives the device's diagnostic text, such as its record of commands received and
what it refused, and never a frame. The commands it sends are executed like any other, but not
acknowledged. A terminal that sends a built-in becomes a host and receives frames from then on.
