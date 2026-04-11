/**
 * Single source of truth for all Blaeck protocol elements.
 *
 * Used by:
 *   - protocol/elements.mdx  (canonical element reference)
 *   - src/components/Frame.js (element table under each frame)
 *   - library overview pages  (element details per version)
 */

const elements = {
  MasterSlaveConfig: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: '`0x01` = master, `0x02` = slave',
  },
  SlaveID: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: '`0x00` for master; device-specific for slaves',
  },
  SymbolName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Signal name',
  },
  DTYPE: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: 'Datatype code (`0x00`–`0x09`). See [Datatypes](datatypes)',
  },
  SymbolID: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Zero-based signal index (matches B0 order)',
  },
  DATA: {
    size: 'variable',
    type: 'raw bytes',
    span: 2,
    description: 'Signal value, size per [DTYPE](datatypes)',
  },
  StatusByte: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Device/hub status. See [Status Codes](status-codes)',
  },
  CRC32: {
    size: '4 bytes',
    type: 'uint32',
    span: 2,
    description: 'Integrity checksum. See [CRC32](crc32)',
  },
  RestartFlag: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0x00` = normal, `0x01` = first frame after restart',
  },
  TimestampMode: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: '`0` = none, `1` = micros, `2` = UNIX',
  },
  Timestamp32: {
    size: '4 bytes',
    type: 'uint32',
    span: 3,
    description: 'Conditional: only if TimestampMode > 0',
  },
  Timestamp64: {
    size: '8 bytes',
    type: 'uint64',
    span: 3,
    description: 'Conditional: only if TimestampMode > 0',
  },
  SchemaHash: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'CRC16-CCITT over signal schema. See [Schema Hash](schema-hash)',
  },
  StatusPayload: {
    size: '4 bytes',
    type: 'raw bytes',
    span: 4,
    description: 'Status-specific data',
  },
  DeviceName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'User-defined device name',
  },
  HWVersion: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Hardware version',
  },
  FWVersion: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Firmware version',
  },
  LibVersion: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Library version (e.g., `"6.0.0"`)',
  },
  LibName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Library name',
  },
  ClientNo: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Client number',
  },
  ClientDataEnabled: {
    size: 'variable',
    type: 'string',
    span: 4,
    description: 'Data streaming enabled (`"true"` / `"false"`)',
  },
  ServerRestarted: {
    size: 'variable',
    type: 'string',
    span: 4,
    description: 'Whether server restarted since client connected',
  },
  DeviceType: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: '`"server"` or `"hub"`',
  },
  Parent: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Parent device in topology',
  },
  ClientName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Name of the connected client (from `GET_DEVICES` identity)',
  },
  ClientType: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Type of the connected client (e.g., `"app"`, `"hub"`)',
  },
  DeviceCount: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Number of device entries in the frame',
  },
};

/**
 * Generate a Mermaid packet-beta diagram from a frame's elements and bitsPerRow.
 */
function generateMermaid(frameElements, bitsPerRow, repeat) {
  const header = `---\nconfig:\n  packet:\n    showBits: false\n    bitsPerRow: ${bitsPerRow}\n---\npacket-beta`;
  const repeatSet = new Set(repeat || []);
  let pos = 0;
  const lines = [];
  frameElements.forEach((key) => {
    const el = elements[key];
    if (!el) return;
    const raw = el.label || key;
    const label = repeatSet.has(key) ? `[${raw}]` : raw;
    const start = pos;
    const end = pos + el.span - 1;
    pos += el.span;
    lines.push(`  ${start}-${end}: "${label}"`);
  });
  return header + '\n' + lines.join('\n');
}

module.exports = { elements, generateMermaid };
