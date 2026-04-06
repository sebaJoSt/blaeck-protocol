#!/usr/bin/env node
/**
 * Generates versioned sidebar JSON files for all library doc plugins.
 *
 * Each versioned sidebar mirrors the current sidebar so that older
 * versions also show the Protocol Spec links. Run this after adding
 * a new version snapshot:
 *
 *   node scripts/sync-versioned-sidebars.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PROTOCOL_ITEMS = [
  { type: 'link', label: 'Introduction', href: '/blaeck-protocol/protocol/intro' },
  { type: 'link', label: 'Frame Format', href: '/blaeck-protocol/protocol/frame-format' },
  { type: 'link', label: 'Message Keys', href: '/blaeck-protocol/protocol/message-keys' },
  { type: 'link', label: 'Elements', href: '/blaeck-protocol/protocol/elements' },
  { type: 'link', label: 'Status Codes', href: '/blaeck-protocol/protocol/status-codes' },
  { type: 'link', label: 'Data Types', href: '/blaeck-protocol/protocol/datatypes' },
  { type: 'link', label: 'Timestamps', href: '/blaeck-protocol/protocol/timestamps' },
  { type: 'link', label: 'Schema Hash', href: '/blaeck-protocol/protocol/schema-hash' },
  { type: 'link', label: 'Client Identity', href: '/blaeck-protocol/protocol/client-identity' },
  { type: 'link', label: 'CRC32', href: '/blaeck-protocol/protocol/crc32' },
  { type: 'link', label: 'Decoding Examples', href: '/blaeck-protocol/protocol/decoding-examples' },
  { type: 'link', label: 'Historical', href: '/blaeck-protocol/protocol/historical' },
];

const sidebar = {
  librarySidebar: [
    'overview',
    {
      type: 'category',
      label: 'Protocol Spec',
      collapsible: true,
      collapsed: false,
      items: PROTOCOL_ITEMS,
    },
  ],
};

const json = JSON.stringify(sidebar, null, 2) + '\n';

const plugins = ['blaeckserial', 'blaecktcp', 'blaecktcpy'];
let total = 0;

for (const plugin of plugins) {
  const versionsFile = path.join(ROOT, `${plugin}_versions.json`);
  if (!fs.existsSync(versionsFile)) continue;

  const versions = JSON.parse(fs.readFileSync(versionsFile, 'utf8'));
  const dir = path.join(ROOT, `${plugin}_versioned_sidebars`);
  fs.mkdirSync(dir, { recursive: true });

  for (const ver of versions) {
    const file = path.join(dir, `version-${ver}-sidebars.json`);
    fs.writeFileSync(file, json, 'utf8');
    total++;
  }
}

console.log(`Synced ${total} versioned sidebar files.`);
