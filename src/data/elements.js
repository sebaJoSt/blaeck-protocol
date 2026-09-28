/**
 * The elements of protocol 2, the current one; protocol 1 has its own in ./v1/.
 *
 * Used by:
 *   - protocol/elements.mdx  (canonical element reference)
 *   - src/components/Frame.js (element table under each frame and entry)
 *   - library overview pages  (element details per version)
 */

const elements = {
  // ----- Device List (B7) -----
  LibName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Library name',
  },
  LibVersion: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Library version (e.g., `"7.0.0"`)',
  },
  CommandPayloadMax: {
    size: '2 bytes',
    type: 'uint16',
    span: 5,
    description: 'Longest command the device can receive, in characters between the delimiters and excluding the terminator. `0` = not advertised',
  },
  DeviceCount: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Number of device entries in the frame: `1`–`255`, the board plus its sub-devices',
  },
  DeviceID: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0` = the board; `1`–`254` = a sub-device. `255` is reserved',
  },
  ParentID: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`DeviceID` of the device it sits below. `0` for the board itself and for every sub-device (one level)',
  },
  DeviceFlags: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Which optional fields follow the versions, one bit each. All bits reserved and sent as `0`',
  },
  DeviceState: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Bit 0 NotResponding (marked missing now); bit 1 Restarted (a restart not yet reported to a host). Bits 2–7 reserved, `0`',
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
  DeviceOptionalFields: {
    label: 'OptionalFields',
    size: 'variable',
    type: 'string',
    span: 4,
    description: 'One null-terminated string per bit set in `DeviceFlags`, in bit order. None are defined yet',
  },
  SignalCount: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Number of signals the device logs; that many `SignalName` and `DTYPE` pairs follow',
  },
  SignalName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Signal name, unique within its device',
  },
  DTYPE: {
    size: '1 byte',
    type: 'uint8',
    span: 2,
    description: 'Datatype code (`0x00`–`0x0B`). See [Datatypes](datatypes)',
  },
  DeviceEvent: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0x01` restarted, `0x02` not responding, `0x03` responding again. `0x00` and `0x04`–`0xFF` reserved',
  },

  // ----- Data (D3) -----
  FrameFlags: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Bit 0 = first frame after restart. Bit 1 = answers `BLAECK.WRITE_DATA`. Bit 2 = includes a host-interval report, also when mixed with change reports. Bits 1 and 2 never both set; explicit writes and change reports leave both clear. Bits 3-7 reserved, sent clear. Test the bits; do not compare the byte',
  },
  SchemaHash: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'CRC16-CCITT over the signal schema. See [Schema Hash](schema-hash)',
  },
  TimestampMode: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: '`0` = none, `1` = micros, `2` = UNIX',
  },
  Timestamp64: {
    size: '8 bytes',
    type: 'uint64',
    span: 3,
    description: 'Conditional: only if TimestampMode > 0',
  },
  SignalIndex: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Zero-based signal index, counted across all devices in [Device List](frames/devices) order',
  },
  DATA: {
    size: 'variable',
    type: 'raw bytes',
    span: 2,
    description: 'Signal value, size per [DTYPE](datatypes). Fixed width except DTYPE `0x0A`, which is length-prefixed',
  },
  CRC32: {
    size: '4 bytes',
    type: 'uint32',
    span: 2,
    description: 'Integrity checksum. See [CRC32](crc32)',
  },

  // ----- Command Ack (A5) -----
  CmdHash: {
    size: '4 bytes',
    type: 'uint32',
    span: 3,
    description: 'FNV-1a 32 hash of the command after its message id, identifying which command is acknowledged',
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
    span: 3,
    description: '`0` = accepted, `1` = rejected',
  },
  AckReason: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: 'Reason code. See [Ack Reasons](ack-reasons)',
  },

  // ----- Entity List (90) -----
  EntryKind: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0` property, `1` event, `2` button. `3`–`255` reserved',
  },
  EntryFields: {
    size: 'variable',
    type: 'raw bytes',
    span: 4,
    description: 'The fields of the entry\'s kind. See [Entities](frames/entities)',
  },
  PropertyName: {
    label: 'Name',
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Property name, as a host sends it in `<Name,value>`. Unique on the board among properties, buttons and plain commands',
  },
  ValueKind: {
    size: '1 byte',
    type: 'uint8',
    span: 3,
    description: '`0` number, `1` bool, `2` enum, `3` text. `4`–`255` reserved. With the access, it is what the sketch declared: a READ number is a sensor, a READWRITE one a number input, a READ bool an on/off indicator, a READWRITE one a switch, a READ enum an enum sensor, a READWRITE one a select, a READ text a text sensor, a READWRITE one a text input',
  },
  PropertyFlags: {
    label: 'Flags',
    size: '4 bytes',
    type: 'uint32',
    span: 3,
    description: 'Bits 0–1 = access: `01` READ, `11` READWRITE; `10` (write only) and `00` reserved. Bit 2 = hasRange, 3 = hasStep, 4 = hasUnit, 5 = hasDisplayName, 6 = hasIcon, 7 = hasDeviceClass, 8–10 = state class (`0` none, `1` measurement, `2` total, `3` total\\_increasing, `4` measurement\\_angle), 11 = hasDisplayPrecision, 12–13 = entity category (`0` none, `1` config, `2` diagnostic, `3` reserved), 14 = disabledByDefault, 15 = forceUpdate, 16–17 = input mode (number: `0` auto, `1` box, `2` slider; text: `0` plain, `1` password; `3` reserved). Bits 18–31 reserved, sent clear',
  },
  Value: {
    size: 'variable',
    type: 'raw bytes',
    span: 2,
    description: 'The property\'s value, size per `DTYPE`. Fixed width except `0x0A`, which is a 1-byte length followed by that many UTF-8 bytes, as in [DATA](datatypes). An enum\'s value is its index',
  },
  Options: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Enum only, always present. Comma-separated options in index order; at least one, none blank. An input accepts an index or an option name, matched exactly with case',
  },
  TextMaxLen: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Text only, always present. Longest value, in bytes. Keep it at `255` or below: Home Assistant caps any entity state at 255 characters',
  },
  RangeMin: {
    size: '4 bytes',
    type: 'float32',
    span: 3,
    description: 'Conditional: only if `Flags` bit 2. Lowest value an input accepts, inclusive. Without bit 2 both limits are absent; do not read them as `0`',
  },
  RangeMax: {
    size: '4 bytes',
    type: 'float32',
    span: 3,
    description: 'Conditional: only if `Flags` bit 2. Highest value an input accepts, inclusive, and above `RangeMin`',
  },
  RangeStep: {
    size: '4 bytes',
    type: 'float32',
    span: 3,
    description: 'Conditional: only if `Flags` bit 3. The step a number input stores on, counted from `RangeMin`. A value within a thousandth of a step of one is snapped to it; a value further off is kept as sent',
  },
  Unit: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if `Flags` bit 4',
  },
  DisplayName: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if the entry\'s display-name bit is set. Label a host shows in place of the name. Presentation only: the name stays what a host sends and what any identity it derives is built from',
  },
  Icon: {
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Conditional: only if the entry\'s icon bit is set. Material Design Icons name (e.g. `"mdi:tune"`)',
  },
  DeviceClass: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Conditional: only if the entry\'s device-class bit is set. What the value, event or button is, in the host\'s vocabulary (`"temperature"`, `"door"`, `"restart"`). A name the host does not know costs that one entity, so a device declares nothing rather than guessing',
  },
  DisplayPrecision: {
    size: '1 byte',
    type: 'uint8',
    span: 4,
    description: 'Conditional: only if `Flags` bit 11. Decimal places to display',
  },
  EventName: {
    label: 'Name',
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Event name, unique among the events of its device',
  },
  EventFlags: {
    label: 'Flags',
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Bit 0 = hasIcon, 1 = isDiagnostic, 2 = hasDeviceClass, 3 = disabledByDefault. Bits 4–15 reserved',
  },
  EventTypeCount: {
    size: '2 bytes',
    type: 'uint16',
    span: 4,
    description: 'Number of `EventType` entries that follow; at least one',
  },
  EventType: {
    size: 'variable',
    type: 'string',
    span: 3,
    description: 'Declared event type, not blank. Position defines its index',
  },
  ButtonName: {
    label: 'Name',
    size: 'variable',
    type: 'string',
    span: 2,
    description: 'Button name, as a host sends it in `<Name>`. Unique on the board among properties, buttons and plain commands',
  },
  ButtonFlags: {
    label: 'Flags',
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Bit 0 = hasDisplayName, 1 = hasIcon, 2 = hasDeviceClass, 3–4 = entity category (`0` none, `1` config, `2` diagnostic, `3` reserved), 5 = disabledByDefault. Bits 6–15 reserved',
  },

  // ----- Property (95) and Event (85) -----
  PropertyIndex: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Zero-based position of the property among the properties of the [Entity List](frames/entities)',
  },
  EventIndex: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Zero-based position of the event among the events of the [Entity List](frames/entities)',
  },
  EventTypeIndex: {
    size: '2 bytes',
    type: 'uint16',
    span: 3,
    description: 'Zero-based index into the event\'s `EventType` list',
  },
};

// Widest row, in spans. A frame up to this wide is drawn in one row. PacketDiagram lowers it
// to what the page has room for.
const MAX_ROW = 34;

/**
 * The row width for these spans: all of them if they fit in maxRow, otherwise the widest row
 * up to maxRow that ends every row at an element boundary, so no element is split. If no such
 * row fits, the narrowest wider one; Mermaid then scales that diagram down to the page.
 */
function rowWidth(spans, maxRow) {
  const total = spans.reduce((a, b) => a + b, 0);
  if (total <= maxRow) return total;
  const whole = (width) => {
    let start = 0;
    return spans.every((span) => {
      const fits = Math.floor(start / width) === Math.floor((start + span - 1) / width);
      start += span;
      return fits;
    });
  };
  for (let width = maxRow; width > 0; width--)
    if (whole(width)) return width;
  for (let width = maxRow + 1; width < total; width++)
    if (whole(width)) return width;
  return total;
}

/**
 * Generate a Mermaid packet-beta diagram from a frame's elements.
 */
function generateMermaid(frameElements, repeat, maxRow = MAX_ROW, elementMap = elements, repeatNested = []) {
  const known = frameElements.filter((key) => elementMap[key]);
  const bitsPerRow = rowWidth(known.map((key) => elementMap[key].span), maxRow);
  const header = `---\nconfig:\n  packet:\n    showBits: false\n    bitsPerRow: ${bitsPerRow}\n---\npacket-beta`;
  const repeatSet = new Set(repeat || []);
  const nestedSet = new Set(repeatNested || []);
  let pos = 0;
  const lines = [];
  known.forEach((key) => {
    const el = elementMap[key];
    const raw = el.label || key;
    const label = nestedSet.has(key) ? `[[${raw}]]` : repeatSet.has(key) ? `[${raw}]` : raw;
    const start = pos;
    const end = pos + el.span - 1;
    pos += el.span;
    lines.push(`  ${start}-${end}: "${label}"`);
  });
  return header + '\n' + lines.join('\n');
}

module.exports = { elements, generateMermaid, MAX_ROW };
