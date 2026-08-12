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
    description: 'Datatype code (`0x00`–`0x0A`). See [Datatypes](datatypes)',
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
    description: 'Signal value, size per [DTYPE](datatypes). Fixed width except DTYPE `0x0A`, which is length-prefixed',
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
  CommandPayloadMax: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Longest command the device can receive, in characters between the delimiters and excluding the terminator. `0` = not advertised',
  },
  ChannelName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Channel name, unique per device',
  },
  // Both catalogs call this field ChannelFlags on the wire and share bits 0-1, but
  // diverge from bit 2, so each frame documents its own.
  MessageChannelFlags: {
    label: 'ChannelFlags',
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Bit 0 = hasIcon, bit 1 = isDiagnostic, bit 2 = hasStateText, bit 3 = hasDeviceClass, bit 4 = disabledByDefault, bit 5 = forceUpdate, bit 6 = hasOptions. Bits 7–15 reserved',
  },
  EventChannelFlags: {
    label: 'ChannelFlags',
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Bit 0 = hasIcon, bit 1 = isDiagnostic, bit 2 = hasDeviceClass, bit 3 = disabledByDefault. Bits 4–15 reserved',
  },
  SignalOptions: {
    label: 'Options',
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `SignalMetaFlags` bit 9. Comma-separated closed set of values the signal reports',
  },
  MessageOptions: {
    label: 'Options',
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `ChannelFlags` bit 6. Comma-separated closed set of values the channel reports',
  },
  MessageDeviceClass: {
    label: 'DeviceClass',
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `ChannelFlags` bit 3. What the text is, for a host that renders it (`"timestamp"`, `"date"`)',
  },
  EventDeviceClass: {
    label: 'DeviceClass',
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `ChannelFlags` bit 2. What the channel reports (`"button"`, `"doorbell"`, `"motion"`)',
  },
  Icon: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `ChannelFlags` bit 0. Material Design Icons name (e.g. `"mdi:script-text"`)',
  },
  StateText: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `ChannelFlags` bit 2. The channel\'s value when the frame was built',
  },
  TextLength: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Byte length of `Text`',
  },
  Text: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'UTF-8 text, not NUL-terminated. Length given by `TextLength`',
  },
  EventTypeCount: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: 'Number of `EventType` entries that follow',
  },
  EventType: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Declared event type. Repeated `EventTypeCount` times; position defines its index',
  },
  ChannelIndex: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: 'Zero-based index of the channel in the catalog frame',
  },
  EventIndex: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: 'Zero-based index into the channel\'s `EventType` list',
  },
  CommandName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Command name as accepted in `<COMMAND,…>`',
  },
  CommandKind: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0` plain, `1` button, `2` switch, `3` number, `4` select, `5` text',
  },
  CommandFlags: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Bit 0 = hasRange, 1 = hasUnit, 2 = hasOptions, 3 = hasStateSignal, 4 = isText, 5–6 = entity category (`0` none, `1` config, `2` diagnostic, `3` reserved). Bit 7 reserved',
  },
  RangeMin: {
    size: '4 bytes',
    type: 'float32',
    span: 2,
    description: 'Conditional: only if `CommandFlags` bit 0',
  },
  RangeMax: {
    size: '4 bytes',
    type: 'float32',
    span: 2,
    description: 'Conditional: only if `CommandFlags` bit 0',
  },
  RangeStep: {
    size: '4 bytes',
    type: 'float32',
    span: 2,
    description: 'Conditional: only if `CommandFlags` bit 0',
  },
  Unit: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `CommandFlags` bit 1',
  },
  OptionsCsv: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `CommandFlags` bit 2. Comma-separated select options',
  },
  StateSignal: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `CommandFlags` bit 3. Name of the signal or message channel reflecting this command\'s state; which of the two is given by `StateSource`',
  },
  StateSource: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Conditional: only if `CommandFlags` bit 3. What `StateSignal` names: `0` a signal, `1` a message channel',
  },
  TextMaxLen: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Conditional: only if `CommandFlags` bit 4. Maximum accepted text length',
  },
  CmdHash: {
    size: '4 bytes',
    type: 'uint32',
    span: 3,
    description: 'FNV-1a 32 hash of the command string as received, identifying which command is acknowledged',
  },
  CmdNameHash: {
    size: '4 bytes',
    type: 'uint32',
    span: 3,
    description: 'FNV-1a 32 hash of the command name alone (up to the first comma), or `0` if no name was parsed',
  },
  AckStatus: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: '`0` = accepted, `1` = rejected',
  },
  AckReason: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: 'Reason code. See [Status Codes](status-codes)',
  },
  SignalMetaFlags: {
    size: '2 bytes',
    type: 'uint16',
    span: 4,
    description: 'Bit 0 = hasUnit, 1 = hasDeviceClass, 2 = hasIcon, 3–4 = state class (`0` none, `1` measurement, `2` total, `3` total\\_increasing), 5 = isDiagnostic, 6 = disabledByDefault, 7 = forceUpdate, 8 = hasDisplayPrecision. Bits 9–15 reserved',
  },
  SignalUnit: {
    label: 'Unit',
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `SignalMetaFlags` bit 0',
  },
  SignalDeviceClass: {
    label: 'DeviceClass',
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if `SignalMetaFlags` bit 1',
  },
  SignalIcon: {
    label: 'Icon',
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `SignalMetaFlags` bit 2. Material Design Icons name (e.g. `"mdi:sine-wave"`)',
  },
  OffDelay: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Conditional: only if `SignalMetaFlags` bit 10. Seconds after which a host returns a bool signal to off by itself, for a value pushed true and never pushed false',
  },
  DisplayPrecision: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: 'Conditional: only if `SignalMetaFlags` bit 8. Decimal places to display',
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
