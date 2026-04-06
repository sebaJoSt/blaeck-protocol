/**
 * Single source of truth for all Blaeck protocol frames.
 *
 * Used by:
 *   - protocol/frames/*.mdx  (canonical frame pages)
 *   - library overview pages  (active frames per version)
 *   - src/components/FrameTable.js
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
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 11
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "SymbolName"
  9-10: "DTYPE"`,
  },

  B1: {
    key: 'B1',
    hex: '0xB1',
    category: 'data',
    name: 'Data',
    description: 'Basic data: SymbolID, DATA, StatusByte, and CRC32.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'b1--data-0xb1',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 10
---
packet-beta
  0-1: "SymbolID"
  2-3: "DATA"
  4-6: "StatusByte"
  7-8: "CRC32"`,
  },

  D1: {
    key: 'D1',
    hex: '0xD1',
    category: 'data',
    name: 'Data',
    description: 'Adds RestartFlag, TimestampMode, and Timestamp (4 bytes).',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd1--data-0xd1',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 10
---
packet-beta
  0-2: "RestartFlag"
  3-6: "TimestampMode"
  7-9: "Timestamp"
  10-11: "SymbolID"
  12-13: "DATA"
  14-16: "StatusByte"
  17-18: "CRC32"`,
  },

  D2: {
    key: 'D2',
    hex: '0xD2',
    category: 'data',
    name: 'Data',
    description: 'Adds SchemaHash and StatusPayload. Timestamp grows to 8 bytes.',
    page: '/blaeck-protocol/protocol/frames/data',
    anchor: 'd2--data-0xd2',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 13
---
packet-beta
  0-2: "RestartFlag"
  3-5: "SchemaHash"
  6-9: "TimestampMode"
  10-12: "Timestamp"
  13-14: "SymbolID"
  15-16: "DATA"
  17-19: "StatusByte"
  20-23: "StatusPayload"
  24-25: "CRC32"`,
  },

  B2: {
    key: 'B2',
    hex: '0xB2',
    category: 'devices',
    name: 'Devices',
    description: 'Basic device identity: name, hardware, firmware, and library version.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b2--devices-0xb2',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 18
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"`,
  },

  B3: {
    key: 'B3',
    hex: '0xB3',
    category: 'devices',
    name: 'Devices',
    description: 'Adds LibName.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b3--devices-0xb3',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"`,
  },

  B4: {
    key: 'B4',
    hex: '0xB4',
    category: 'devices',
    name: 'Devices',
    description: 'Adds ClientNo and ClientDataEnabled.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b4--devices-0xb4',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"`,
  },

  B5: {
    key: 'B5',
    hex: '0xB5',
    category: 'devices',
    name: 'Devices',
    description: 'Adds ServerRestarted.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b5--devices-0xb5',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
  26-29: "ServerRestarted"`,
  },

  B6: {
    key: 'B6',
    hex: '0xB6',
    category: 'devices',
    name: 'Devices',
    description: 'Adds DeviceType and Parent.',
    page: '/blaeck-protocol/protocol/frames/devices',
    anchor: 'b6--devices-0xb6',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"
  20-21: "ClientNo"
  22-25: "ClientDataEnabled"
  26-29: "ServerRestarted"
  30-32: "DeviceType"
  33-34: "Parent"`,
  },

  C0: {
    key: 'C0',
    hex: '0xC0',
    category: 'control',
    name: 'Restart Notification',
    description: 'Notifies that a device restarted. Same layout as B3.',
    page: '/blaeck-protocol/protocol/frames/control',
    anchor: 'c0--restart-notification-0xc0',
    mermaid: `---
config:
  packet:
    showBits: false
    bitsPerRow: 20
---
packet-beta
  0-3: "MasterSlaveConfig"
  4-5: "SlaveID"
  6-8: "DeviceName"
  9-11: "HWVersion"
  12-14: "FWVersion"
  15-17: "LibVersion"
  18-19: "LibName"`,
  },
};

module.exports = { frames };
