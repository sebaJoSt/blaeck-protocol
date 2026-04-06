/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  librarySidebar: [
    'overview',
    {
      type: 'category',
      label: 'Protocol Spec',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'link', label: 'Introduction', href: '/blaeck-protocol/protocol/intro' },
        { type: 'link', label: 'Commands', href: '/blaeck-protocol/protocol/commands' },
        { type: 'link', label: 'Frames', href: '/blaeck-protocol/protocol/frames' },
        { type: 'link', label: 'Elements', href: '/blaeck-protocol/protocol/elements' },
        { type: 'link', label: 'Status Codes', href: '/blaeck-protocol/protocol/status-codes' },
        { type: 'link', label: 'Data Types', href: '/blaeck-protocol/protocol/datatypes' },
        { type: 'link', label: 'Timestamps', href: '/blaeck-protocol/protocol/timestamps' },
        { type: 'link', label: 'Schema Hash', href: '/blaeck-protocol/protocol/schema-hash' },
        { type: 'link', label: 'Client Identity', href: '/blaeck-protocol/protocol/client-identity' },
        { type: 'link', label: 'CRC32', href: '/blaeck-protocol/protocol/crc32' },
        { type: 'link', label: 'Decoding Examples', href: '/blaeck-protocol/protocol/decoding-examples' },
      ],
    },
  ],
};

module.exports = sidebars;
