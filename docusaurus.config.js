// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
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
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaecktcp',
        path: 'blaecktcp',
        routeBasePath: 'blaecktcp',
        includeCurrentVersion: false,
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
            to: '/protocol/intro',
            label: 'Protocol Spec',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Libraries',
            position: 'left',
            activeBaseRegex: '/blaeck/|blaeckserial|blaecktcp|blaecktcpy',
            items: [
              { label: 'blaeck', to: '/blaeck/overview' },
              { label: 'blaecktcpy', to: '/blaecktcpy/overview' },
              { label: 'BlaeckSerial (until 6.0.0)', to: '/blaeckserial/overview' },
              { label: 'BlaeckTCP (until 6.0.0)', to: '/blaecktcp/overview' },
            ],
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
