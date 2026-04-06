/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  protocolSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Frames',
      link: { type: 'doc', id: 'frames/index' },
      items: [
        'frames/signals',
        'frames/devices',
        'frames/data',
        'frames/control',
      ],
    },
    'commands',
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
