/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  protocolSidebar: [
    'intro',
    'commands',
    'connections',
    'message-keys',
    {
      type: 'category',
      label: 'Frames',
      link: { type: 'generated-index', description: 'All frame types by category.' },
      items: [
        {
          type: 'category',
          label: 'Logging',
          items: ['frames/devices', 'frames/data', 'frames/control', 'frames/commands'],
        },
        {
          type: 'category',
          label: 'IoT',
          items: ['frames/entities', 'frames/properties', 'frames/events'],
        },
      ],
    },
    'catalogs',
    'elements',
    'ack-reasons',
    'datatypes',
    'schema-hash',
    'escaping',
    'crc32',
  ],
};

module.exports = sidebars;
