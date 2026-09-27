/**
 * The frames of protocol 2, the current one; protocol 1 has its own in ./v1/.
 *
 * Used by:
 *   - protocol/frames/*.mdx  (canonical frame pages)
 *   - library overview pages  (active frames per version)
 *   - src/components/FrameTable.js
 *
 * Mermaid diagrams are generated from the elements by generateMermaid() in elements.js,
 * which also picks the row width.
 */

const frames = {
  E0: {
    key: 'E0',
    hex: '0xE0',
    category: 'signals',
    name: 'Symbol List',
    description: 'Signal schema: names and types, each with its DeviceID.',
    page: '/blaeck-protocol/protocol/frames/signals',
    anchor: 'e0--symbol-list-0xe0',
    elements: ['DeviceID', 'SymbolName', 'DTYPE'],
  },

  D3: {
    key: 'D3',
    hex: '0xD3',
    category: 'data',
    name: 'Data',
    description: 'Signal values with SchemaHash, 8-byte Timestamp, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd3--data-0xd3',
    elements: ['FrameFlags', 'SchemaHash', 'TimestampMode', 'Timestamp64', 'SymbolID', 'DATA', 'CRC32'],
    repeat: ['SymbolID', 'DATA'],
  },

  B7: {
    key: 'B7',
    hex: '0xB7',
    category: 'devices',
    name: 'Device List',
    description: 'The board and its sub-devices: library, then per device its ID, parent, flags, state and names.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b7--device-list-0xb7',
    elements: ['LibName', 'LibVersion', 'DeviceCount', 'DeviceID', 'ParentID', 'DeviceFlags', 'DeviceState', 'DeviceName', 'HWVersion', 'FWVersion', 'DeviceOptionalFields'],
    repeat: ['DeviceID', 'ParentID', 'DeviceFlags', 'DeviceState', 'DeviceName', 'HWVersion', 'FWVersion', 'DeviceOptionalFields'],
  },

  C1: {
    key: 'C1',
    hex: '0xC1',
    category: 'control',
    name: 'Device Notification',
    description: 'A device restarted, stopped responding, or responds again.',
    page: '/blaeck-protocol/protocol/frames/control',
    anchor: 'c1--device-notification-0xc1',
    elements: ['DeviceID', 'DeviceEvent'],
  },

  '80': {
    key: '80',
    hex: '0x80',
    category: 'events',
    name: 'Event Channel List',
    description: 'Event channel catalog: name, flags, optional icon, and the closed list of event types each channel may emit.',
    page: '/blaeck-protocol/protocol/frames/events',
    anchor: '80--event-channel-list-0x80',
    elements: ['DeviceID', 'ChannelName', 'EventChannelFlags', 'Icon', 'EventDeviceClass', 'EventTypeCount', 'EventType'],
    repeat: ['EventType'],
  },

  '85': {
    key: '85',
    hex: '0x85',
    category: 'events',
    name: 'Event',
    description: 'A single occurrence on an event channel, identified by its index in the declared event type list.',
    page: '/blaeck-protocol/protocol/frames/events',
    anchor: '85--event-0x85',
    elements: ['DeviceID', 'ChannelIndex', 'EventIndex'],
  },

  '90': {
    key: '90',
    hex: '0x90',
    category: 'state',
    name: 'State Channel List',
    description: 'State channel catalog: name, flags, datatype, optional icon, optional current value, and optional numeric metadata.',
    page: '/blaeck-protocol/protocol/frames/states',
    anchor: '90--state-channel-list-0x90',
    elements: ['DeviceID', 'ChannelName', 'StateChannelFlags', 'StateValueType', 'Icon', 'StateValue', 'StateDeviceClass', 'StateOptions', 'StateUnit', 'StateDisplayPrecision'],
  },

  '95': {
    key: '95',
    hex: '0x95',
    category: 'state',
    name: 'State',
    description: 'Current value of a declared state channel, typed. Pushed when it changes; not telemetry and not stored.',
    page: '/blaeck-protocol/protocol/frames/states',
    anchor: '95--state-0x95',
    elements: ['DeviceID', 'ChannelIndex', 'StateValueType', 'StateChannelValue'],
  },

  A0: {
    key: 'A0',
    hex: '0xA0',
    category: 'commands',
    name: 'Command List',
    description: 'Command catalog: every command the device accepts, with kind, flags, how long a command the device can receive, and optional metadata.',
    page: '/blaeck-protocol/protocol/frames/commands',
    anchor: 'a0--command-list-0xa0',
    elements: ['DeviceID', 'CommandPayloadMax', 'CommandName', 'CommandKind', 'CommandFlags', 'RangeMin', 'RangeMax', 'Unit', 'SelectOptions', 'StateSignal', 'StateSource', 'TextMaxLen', 'RangeStep', 'CommandDisplayName', 'CommandDeviceClass', 'CommandIcon', 'CommandPressPayload'],
    repeat: ['DeviceID', 'CommandPayloadMax', 'CommandName', 'CommandKind', 'CommandFlags', 'RangeMin', 'RangeMax', 'Unit', 'SelectOptions', 'StateSignal', 'StateSource', 'TextMaxLen', 'RangeStep', 'CommandDisplayName', 'CommandDeviceClass', 'CommandIcon', 'CommandPressPayload'],
  },

  A5: {
    key: 'A5',
    hex: '0xA5',
    category: 'commands',
    name: 'Command Ack',
    description: 'Outcome of a dispatched command. The header MessageID echoes the message id the command carried in its # prefix, or 0 when it carried none; the hashes then say whether the bytes arrived as written.',
    page: '/blaeck-protocol/protocol/frames/commands',
    anchor: 'a5--command-ack-0xa5',
    elements: ['CmdHash', 'CmdNameHash', 'AckStatus', 'AckReason'],
  },

  F0: {
    key: 'F0',
    hex: '0xF0',
    category: 'signals',
    name: 'Signal Config',
    description: 'Presentation metadata for signals that declare any: unit, device class, icon, state class, display precision, and the label to show in place of the name.',
    page: '/blaeck-protocol/protocol/frames/signals',
    anchor: 'f0--signal-config-0xf0',
    elements: ['SymbolID', 'SignalMetaFlags', 'SignalUnit', 'SignalDeviceClass', 'SignalIcon', 'DisplayPrecision', 'SignalOptions', 'SignalDisplayName'],
    repeat: ['SymbolID', 'SignalMetaFlags', 'SignalUnit', 'SignalDeviceClass', 'SignalIcon', 'DisplayPrecision', 'SignalOptions', 'SignalDisplayName'],
  },
};

module.exports = { frames };
