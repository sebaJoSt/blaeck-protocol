import React from 'react';
import Link from '@docusaurus/Link';
import { elements } from '@site/src/data/elements';

const defined = {
  datatypes: '/blaeck-protocol/protocol/datatypes',
  'status-codes': '/blaeck-protocol/protocol/status-codes',
  crc32: '/blaeck-protocol/protocol/crc32',
  timestamps: '/blaeck-protocol/protocol/timestamps',
  'schema-hash': '/blaeck-protocol/protocol/schema-hash',
};

function renderDescription(desc) {
  // Convert markdown links [text](key) to <Link> components
  const parts = desc.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      const href = defined[m[2]] || m[2];
      return <Link key={i} to={href}>{m[1]}</Link>;
    }
    // Convert inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return <code key={`${i}-${j}`}>{cp.slice(1, -1)}</code>;
      }
      return cp;
    });
  });
}

// Sort alphabetically by element name
const sorted = Object.entries(elements).sort(([a], [b]) => a.localeCompare(b));

export function ElementsTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Size</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(([name, el]) => (
          <tr key={name}>
            <td>{el.label || name}</td>
            <td>{el.size}</td>
            <td><code>{el.type}</code></td>
            <td>{renderDescription(el.description)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
