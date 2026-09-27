// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

// Protocol v1 libraries are no longer maintained in any version, so none of their versions
// carries Docusaurus's "no longer actively maintained" banner.
const withoutBanner = (versionsFile) =>
  Object.fromEntries(require(versionsFile).map((version) => [version, { banner: 'none' }]));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Blaeck Protocol',
  tagline: 'Binary protocol specification for the Blaeck ecosystem',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://sebajost.github.io',
  baseUrl: '/blaeck-protocol/',

  organizationName: 'sebaJoSt',
  projectName: 'blaeck-protocol',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: 'protocol',
          path: 'protocol',
          routeBasePath: 'protocol',
          sidebarPath: './sidebars-protocol.js',
          lastVersion: 'current',
          versions: {
            current: { label: 'v2', path: '', badge: false },
            1: { label: 'v1', path: '1', banner: 'none', badge: false },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    './plugins/spec-sidebars.js',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaeck',
        path: 'blaeck',
        routeBasePath: 'blaeck',
        sidebarPath: './sidebars-blaeck.js',
        lastVersion: 'current',
        versions: {
          current: { label: '7.0.0', path: '' },
        },
      },
    ],
    // BlaeckSerial and BlaeckTCP end at 6.0.0; version 7 is the unified blaeck library.
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaeckserial',
        path: 'blaeckserial',
        routeBasePath: 'blaeckserial',
        includeCurrentVersion: false,
        versions: withoutBanner('./blaeckserial_versions.json'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaecktcp',
        path: 'blaecktcp',
        routeBasePath: 'blaecktcp',
        includeCurrentVersion: false,
        versions: withoutBanner('./blaecktcp_versions.json'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaecktcpy',
        path: 'blaecktcpy',
        routeBasePath: 'blaecktcpy',
        sidebarPath: './sidebars-blaecktcpy.js',
        lastVersion: 'current',
        versions: {
          current: { label: '2.0.0', path: '' },
          ...withoutBanner('./blaecktcpy_versions.json'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Blaeck Protocol Logo',
          src: 'img/blaeckProtocol-light.svg',
          srcDark: 'img/blaeckProtocol-dark.svg',
        },
        items: [
          {
            type: 'custom-protocol',
            position: 'left',
          },
          {
            type: 'custom-libraries',
            position: 'left',
          },
          {
            type: 'custom-libraryLabel',
            position: 'left',
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'blaeck',
            position: 'left',
            className: 'version-blaeck',
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'blaeckserial',
            position: 'left',
            className: 'version-blaeckserial',
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'blaecktcp',
            position: 'left',
            className: 'version-blaecktcp',
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'blaecktcpy',
            position: 'left',
            className: 'version-blaecktcpy',
          },
          {
            href: 'https://github.com/sebaJoSt/blaeck-protocol',
            position: 'right',
            className: 'header-icon header-icon-github',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {},
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: { light: 'base', dark: 'base' },
      },
    }),
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
