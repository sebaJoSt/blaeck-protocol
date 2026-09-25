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

A TCP device accepts several connections at once, but it has one host at a time, as on a serial
port. The **host** speaks the protocol; every other connection is a **terminal**, which a person
uses to watch and type.

| | Host | Terminal |
|---|---|---|
| How many | at most one | the remaining connections |
| Becomes one | by sending a built-in command | on connecting |
| Receives frames | yes | never |
| Receives text | no | the device's diagnostic output |
| Its commands | executed and acknowledged | executed, not acknowledged |

### Becoming the host

Every connection starts as a terminal. It becomes the host when it sends any command whose name
starts with `BLAECK.` — known or not, with or without a [prefix](commands#prefix-section).
It stays the host until it disconnects or another connection takes over. A host that
reconnects starts as a terminal again.

A host should therefore open every connection with a built-in, typically
`<BLAECK.GET_DEVICES>`. Until it does, it receives nothing: not the answers to other commands,
not data, and not the restart notice.

### Taking over

When a terminal sends a built-in while another connection is the host, the newest wins: the
sender becomes the host, and the device closes the previous host's connection. The previous
host sees an ordinary close, and the device reports it as a disconnect.

Takeover requires an accepted connection. A new connection needs a free connection slot;
if the device's connection limit is reached, it cannot send the built-in that would take
over. With a one-connection limit, the existing connection must close and its slot be
released first. An already connected terminal can take over without another slot.

When a slot is available, a reconnecting host can replace its own dead connection without
waiting for the network stack to notice the dropped link. Two hosts that both reconnect
on their own can take the device from each other in turn. A host should
report a closed connection rather than treat it as an error to hide, and only one host should
be pointed at a device.

### Device state

All frames go to the host: data, state values, events, catalogs, the device frame and every
acknowledgement. State set by `ACTIVATE`, `DEACTIVATE` and `PAUSE_WRITES` belongs to the device,
not to a connection, so it outlasts a change of host. A new host should set what it needs rather
than assume the defaults.

The [restart notice](frames/control) is sent once per boot. A device writes no frames while
no host is connected, so the notice waits for the first host.

### Terminals

A terminal receives the device's diagnostic text, such as its record of commands received and
what it refused, and never a frame. The commands it sends are executed like any other, but not
acknowledged. A terminal that sends a built-in becomes the host and receives frames from then
on.
