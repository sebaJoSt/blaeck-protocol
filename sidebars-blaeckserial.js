/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  librarySidebar: [
    'overview',
    {
      type: 'html',
      value: '<small class="sidebar-version-title">Versions</small>',
      defaultStyle: true,
    },
    { type: 'link', label: '6.0.0 (latest)', href: '/blaeck-protocol/blaeckserial/overview' },
    { type: 'link', label: '5.0.0', href: '/blaeck-protocol/blaeckserial/5.0.0/overview' },
    { type: 'link', label: '4.3.0', href: '/blaeck-protocol/blaeckserial/4.3.0/overview' },
    { type: 'link', label: '4.0.0', href: '/blaeck-protocol/blaeckserial/4.0.0/overview' },
    { type: 'link', label: '3.0.0', href: '/blaeck-protocol/blaeckserial/3.0.0/overview' },
    { type: 'link', label: '2.0.0', href: '/blaeck-protocol/blaeckserial/2.0.0/overview' },
    { type: 'link', label: '1.0.0', href: '/blaeck-protocol/blaeckserial/1.0.0/overview' },
  ],
};

module.exports = sidebars;
