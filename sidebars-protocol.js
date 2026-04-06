/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  protocolSidebar: [
    'intro',
    'commands',
    {
      type: 'category',
      label: 'Frames',
      link: { type: 'generated-index', description: 'All frame types by category.' },
      items: [
        'frames/signals',
        'frames/devices',
        'frames/data',
        'frames/control',
      ],
    },
    'elements',
    'status-codes',
    'datatypes',
    'timestamps',
    'schema-hash',
    'client-identity',
    'crc32',
    'decoding-examples',
  ],
};

module.exports = sidebars;
