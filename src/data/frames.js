/**
 * The frames of protocol 2, the current one; protocol 1 has its own in ./v1/.
 *
 * Used by:
 *   - protocol/frames/*.mdx  (canonical frame pages)
 *   - library overview pages  (active frames per version)
 *   - src/components/FrameTable.js
 *
 * Mermaid diagrams are generated from the elements by generateMermaid() in elements.js,
 * which also picks the row width. `repeat` marks what repeats once, `repeatNested` what
 * repeats inside it.
 */

const frames = {
  B7: {
    key: 'B7',
    hex: '0xB7',
    category: 'devices',
    name: 'Device List',
    description: 'The board and its sub-devices: library, command length, then per device its ID, parent, flags, state, names and signals.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b7--device-list-0xb7',
    elements: ['LibName', 'LibVersion', 'CommandPayloadMax', 'DeviceCount', 'DeviceID', 'ParentID', 'DeviceFlags', 'DeviceState', 'DeviceName', 'HWVersion', 'FWVersion', 'DeviceOptionalFields', 'SignalCount', 'SignalName', 'DTYPE'],
    repeat: ['DeviceID', 'ParentID', 'DeviceFlags', 'DeviceState', 'DeviceName', 'HWVersion', 'FWVersion', 'DeviceOptionalFields', 'SignalCount'],
    repeatNested: ['SignalName', 'DTYPE'],
  },

  D3: {
    key: 'D3',
    hex: '0xD3',
    category: 'data',
    name: 'Data',
    description: 'Signal values with SchemaHash, 8-byte Timestamp, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd3--data-0xd3',
    elements: ['FrameFlags', 'SchemaHash', 'TimestampMode', 'Timestamp64', 'SignalIndex', 'DATA', 'CRC32'],
    repeat: ['SignalIndex', 'DATA'],
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

  '90': {
    key: '90',
    hex: '0x90',
    category: 'entities',
    name: 'Entity List',
    description: 'What a host shows and controls: properties, events and buttons, each entry with its DeviceID and kind.',
    page: '/blaeck-protocol/protocol/frames/entities',
    anchor: '90--entity-list-0x90',
    elements: ['DeviceID', 'EntryKind', 'EntryFields'],
    repeat: ['DeviceID', 'EntryKind', 'EntryFields'],
  },

  '95': {
    key: '95',
    hex: '0x95',
    category: 'properties',
    name: 'Property',
    description: 'Current value of a property, written when it changes and after a host sets it. Not logged.',
    page: '/blaeck-protocol/protocol/frames/properties',
    anchor: '95--property-0x95',
    elements: ['PropertyIndex', 'DTYPE', 'Value'],
  },

  '85': {
    key: '85',
    hex: '0x85',
    category: 'events',
    name: 'Event',
    description: 'One occurrence of an event, identified by its index among the events and the index of its type.',
    page: '/blaeck-protocol/protocol/frames/events',
    anchor: '85--event-0x85',
    elements: ['EventIndex', 'EventTypeIndex'],
  },
};

/**
 * The entry kinds of the 90 Entity List. Not frames: each is what follows DeviceID and
 * EntryKind in one entry.
 */
const entries = {
  property: {
    kind: 0,
    name: 'Property entry',
    description: 'A value a host shows (a sensor) or shows and sets (an input). Kind-bound fields follow the value; optional fields follow in flag-bit order.',
    elements: ['PropertyName', 'ValueKind', 'PropertyFlags', 'DTYPE', 'Value', 'Options', 'TextMaxLen', 'RangeMin', 'RangeMax', 'RangeStep', 'Unit', 'DisplayName', 'Icon', 'DeviceClass', 'DisplayPrecision'],
  },
  event: {
    kind: 1,
    name: 'Event entry',
    description: 'A moment the device reports, with the closed list of its types.',
    elements: ['EventName', 'EventFlags', 'Icon', 'DeviceClass', 'EventTypeCount', 'EventType'],
    repeat: ['EventType'],
  },
  button: {
    kind: 2,
    name: 'Button entry',
    description: 'A moment a host triggers by sending the button\'s name.',
    elements: ['ButtonName', 'ButtonFlags', 'DisplayName', 'Icon', 'DeviceClass'],
  },
};

module.exports = { frames, entries };
