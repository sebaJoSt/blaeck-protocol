/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  protocolSidebar: [
    'intro',
    'commands',
    'message-keys',
    {
      type: 'category',
      label: 'Frames',
      link: { type: 'generated-index', description: 'All frame types by category.' },
      items: [
        'frames/signals',
        'frames/devices',
        'frames/data',
        'frames/control',
        'frames/states',
        'frames/events',
        'frames/commands',
      ],
    },
    'catalogs',
    'elements',
    'status-codes',
    'datatypes',
    'schema-hash',
    'crc32',
  ],
};

module.exports = sidebars;
