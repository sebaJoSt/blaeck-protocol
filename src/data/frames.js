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
    bitsPerRow: 7,
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
  },

  B1_noCRC: {
    key: 'B1',
    hex: '0xB1',
    category: 'data',
    name: 'Data',
    description: 'Signal values without integrity check.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'b1--data-0xb1',
    bitsPerRow: 4,
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
  },

  D2: {
    key: 'D2',
    hex: '0xD2',
    category: 'data',
    name: 'Data',
    description: 'Signal values with SchemaHash, 8-byte Timestamp, StatusByte, StatusPayload, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd2--data-0xd2',
    bitsPerRow: 13,
    elements: ['RestartFlag', 'SchemaHash', 'TimestampMode', 'Timestamp64', 'SymbolID', 'DATA', 'StatusByte', 'StatusPayload', 'CRC32'],
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
    bitsPerRow: 20,
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
    bitsPerRow: 20,
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
    bitsPerRow: 20,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ClientNo', 'ClientDataEnabled', 'ServerRestarted'],
  },

  B6: {
    key: 'B6',
    hex: '0xB6',
    category: 'devices',
    name: 'Devices',
    description: 'Device identity with LibName, ClientNo, ClientDataEnabled, ServerRestarted, DeviceType, and Parent.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b6--devices-0xb6',
    bitsPerRow: 20,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName', 'ClientNo', 'ClientDataEnabled', 'ServerRestarted', 'DeviceType', 'Parent'],
  },

  C0: {
    key: 'C0',
    hex: '0xC0',
    category: 'control',
    name: 'Restart Notification',
    description: 'Notifies that a device restarted. Same layout as B3.',
    page: '/blaeck-protocol/protocol/frames/control',
    anchor: 'c0--restart-notification-0xc0',
    bitsPerRow: 20,
    elements: ['MasterSlaveConfig', 'SlaveID', 'DeviceName', 'HWVersion', 'FWVersion', 'LibVersion', 'LibName'],
  },
};

module.exports = { frames };
