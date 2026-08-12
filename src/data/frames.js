/**
 * Single source of truth for all Blaeck protocol frames.
 *
 * Used by:
 *   - protocol/frames/*.mdx  (canonical frame pages)
 *   - library overview pages  (active frames per version)
 *   - src/components/FrameTable.js
 *
 * Mermaid diagrams are generated dynamically from elements + bitsPerRow
 * via generateMermaid() in elements.js.
 */

const frames = {
  B0: {
    key: 'B0',
    hex: '0xB0',
    category: 'signals',
    name: 'Symbol List',
    description: 'Signal schema: names, types, master/slave config.',
    page: '/blaeck-protocol/protocol/frames/signals',
    anchor: 'b0--symbol-list-0xb0',
    bitsPerRow: 11,
    elements: ['MasterSlaveConfig', 'SlaveID', 'SymbolName', 'DTYPE'],
  },

  B0_v1: {
    key: 'B0',
    hex: '0xB0',
    category: 'signals',
    name: 'Symbol List',
    description: 'Signal schema: ID, name, and type. No multi-device support.',
    page: '/blaeck-protocol/protocol/frames/signals',
    anchor: 'b0--symbol-list-0xb0',
    bitsPerRow: 8,
    elements: ['SymbolID', 'SymbolName', 'DTYPE'],
  },

  B1: {
    key: 'B1',
    hex: '0xB1',
    category: 'data',
    name: 'Data',
    description: 'Signal values with StatusByte and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'b1--data-0xb1',
    bitsPerRow: 10,
    elements: ['SymbolID', 'DATA', 'StatusByte', 'CRC32'],
    repeat: ['SymbolID', 'DATA'],
  },

  B1_noCRC: {
    key: 'B1',
    hex: '0xB1',
    category: 'data',
    name: 'Data',
    description: 'Signal values without integrity check.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'b1--data-0xb1',
    bitsPerRow: 5,
    elements: ['SymbolID', 'DATA'],
  },

  D1: {
    key: 'D1',
    hex: '0xD1',
    category: 'data',
    name: 'Data',
    description: 'Signal values with RestartFlag, 4-byte Timestamp, StatusByte, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd1--data-0xd1',
    bitsPerRow: 10,
    elements: ['RestartFlag', 'TimestampMode', 'Timestamp32', 'SymbolID', 'DATA', 'StatusByte', 'CRC32'],
    repeat: ['SymbolID', 'DATA'],
  },

  D2: {
    key: 'D2',
    hex: '0xD2',
    category: 'data',
    name: 'Data',
    description: 'Signal values with SchemaHash, 8-byte Timestamp, StatusByte, StatusPayload, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd2--data-0xd2',
    bitsPerRow: 16,
    elements: ['RestartFlag', 'SchemaHash', 'TimestampMode', 'Timestamp64', 'SymbolID', 'DATA', 'StatusByte', 'StatusPayload', 'CRC32'],
    repeat: ['SymbolID', 'DATA'],
  },

  B2: {
    key: 'B2',
    hex: '0xB2',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity: name, hardware, firmware, and library version.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b2--devices-0xb2',
    bitsPerRow: 18,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion'],
  },

  B3: {
    key: 'B3',
    hex: '0xB3',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity with LibName.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b3--devices-0xb3',
    bitsPerRow: 21,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName'],
  },

  B4: {
    key: 'B4',
    hex: '0xB4',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity with LibName, ClientNo, and ClientDataEnabled.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b4--devices-0xb4',
    bitsPerRow: 27,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ClientNo', 'ClientDataEnabled'],
  },

  B5: {
    key: 'B5',
    hex: '0xB5',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity with LibName, ClientNo, ClientDataEnabled, and ServerRestarted.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b5--devices-0xb5',
    bitsPerRow: 31,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ClientNo', 'ClientDataEnabled', 'ServerRestarted'],
  },

  B6: {
    key: 'B6',
    hex: '0xB6',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity with DeviceCount, per-device fields, and client trailer (ClientNo, ClientDataEnabled, ClientName, ClientType).',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b6--devices-0xb6',
    bitsPerRow: 33,
    elements: ['DeviceCount', 'MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ServerRestarted', 'DeviceType', 'Parent', 'ClientNo', 'ClientDataEnabled', 'ClientName', 'ClientType'],
    repeat: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ServerRestarted', 'DeviceType', 'Parent'],
  },

  C0: {
    key: 'C0',
    hex: '0xC0',
    category: 'control',
    name: 'Restart Notification',
    description: 'Notifies that a device restarted. Same layout as B3.',
    page: '/blaeck-protocol/protocol/frames/control',
    anchor: 'c0--restart-notification-0xc0',
    bitsPerRow: 21,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName'],
  },

  '80': {
    key: '80',
    hex: '0x80',
    category: 'events',
    name: 'Event Channel List',
    description: 'Event channel catalog: name, flags, optional icon, and the closed list of event types each channel may emit.',
    page: '/blaeck-protocol/protocol/frames/events',
    anchor: '80--event-channel-list-0x80',
    bitsPerRow: 18,
    elements: ['MasterSlaveConfig', 'SlaveID', 'ChannelName', 'EventChannelFlags', 'Icon', 'EventDeviceClass', 'EventTypeCount', 'EventType'],
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
    bitsPerRow: 4,
    elements: ['ChannelIndex', 'EventIndex'],
  },

  '90': {
    key: '90',
    hex: '0x90',
    category: 'messages',
    name: 'Message Channel List',
    description: 'Message channel catalog: name, flags, optional icon, and optional current value.',
    page: '/blaeck-protocol/protocol/frames/messages',
    anchor: '90--message-channel-list-0x90',
    bitsPerRow: 13,
    elements: ['MasterSlaveConfig', 'SlaveID', 'ChannelName', 'MessageChannelFlags', 'Icon', 'StateText', 'MessageDeviceClass'],
  },

  '95': {
    key: '95',
    hex: '0x95',
    category: 'messages',
    name: 'Message',
    description: 'Free-text line on a declared message channel. Composed at runtime; not telemetry and not stored.',
    page: '/blaeck-protocol/protocol/frames/messages',
    anchor: '95--message-0x95',
    bitsPerRow: 7,
    elements: ['ChannelIndex', 'TextLength', 'Text'],
  },

  A0: {
    key: 'A0',
    hex: '0xA0',
    category: 'commands',
    name: 'Command List',
    description: 'Command catalog: every command the device accepts, with kind, flags, how long a command the device can receive, and optional metadata.',
    page: '/blaeck-protocol/protocol/frames/commands',
    anchor: 'a0--command-list-0xa0',
    bitsPerRow: 32,
    elements: ['MasterSlaveConfig', 'SlaveID', 'CommandPayloadMax', 'CommandName', 'CommandKind', 'CommandFlags', 'RangeMin', 'RangeMax', 'RangeStep', 'Unit', 'OptionsCsv', 'StateSignal', 'StateSource', 'TextMaxLen'],
    repeat: ['MasterSlaveConfig', 'SlaveID', 'CommandPayloadMax', 'CommandName', 'CommandKind', 'CommandFlags', 'RangeMin', 'RangeMax', 'RangeStep', 'Unit', 'OptionsCsv', 'StateSignal', 'StateSource', 'TextMaxLen'],
  },

  A5: {
    key: 'A5',
    hex: '0xA5',
    category: 'commands',
    name: 'Command Ack',
    description: 'Outcome of a dispatched command, matched to the request by command hash, or by name hash when the bytes differ.',
    page: '/blaeck-protocol/protocol/frames/commands',
    anchor: 'a5--command-ack-0xa5',
    bitsPerRow: 7,
    elements: ['CmdHash', 'CmdNameHash', 'AckStatus', 'AckReason'],
  },

  F0: {
    key: 'F0',
    hex: '0xF0',
    category: 'signals',
    name: 'Signal Config',
    description: 'Presentation metadata for signals that declare any: unit, device class, icon, state class, and display precision.',
    page: '/blaeck-protocol/protocol/frames/signals',
    anchor: 'f0--signal-config-0xf0',
    bitsPerRow: 18,
    elements: ['SymbolID', 'SignalMetaFlags', 'SignalUnit', 'SignalDeviceClass', 'SignalIcon', 'DisplayPrecision'],
    repeat: ['SymbolID', 'SignalMetaFlags', 'SignalUnit', 'SignalDeviceClass', 'SignalIcon', 'DisplayPrecision'],
  },
};

module.exports = { frames };
