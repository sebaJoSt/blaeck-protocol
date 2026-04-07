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
        id: 'blaeckserial',
        path: 'blaeckserial',
        routeBasePath: 'blaeckserial',
        sidebarPath: './sidebars-blaeckserial.js',
        lastVersion: 'current',
        versions: {
          current: { label: '6.0.0', path: '' },
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blaecktcp',
        path: 'blaecktcp',
        routeBasePath: 'blaecktcp',
        sidebarPath: './sidebars-blaecktcp.js',
        lastVersion: 'current',
        versions: {
          current: { label: '6.0.0', path: '' },
        },
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
        title: 'Blaeck Protocol',
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
            activeBaseRegex: 'blaeckserial|blaecktcp|blaecktcpy',
            items: [
              { label: 'BlaeckSerial', to: '/blaeckserial/overview' },
              { label: 'BlaeckTCP', to: '/blaecktcp/overview' },
              { label: 'blaecktcpy', to: '/blaecktcpy/overview' },
            ],
          },
          {
            type: 'custom-libraryLabel',
            position: 'left',
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
