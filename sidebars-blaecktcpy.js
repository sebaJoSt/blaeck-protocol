/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  librarySidebar: [
    'overview',
    {
      type: 'html',
      value: '<small class="sidebar-version-title">Versions</small>',
      defaultStyle: true,
    },
    { type: 'link', label: '3.0 (latest)', href: '/blaeck-protocol/blaecktcpy/overview' },
    { type: 'link', label: '2.0.0', href: '/blaeck-protocol/blaecktcpy/2.0.0/overview' },
  ],
};

module.exports = sidebars;
