import React from 'react';
import Mermaid from '@theme/Mermaid';
import { frames } from '@site/src/data/frames';
import { generateMermaid } from '@site/src/data/elements';

export default function FrameTable({ keys, showDiagrams = false }) {
  const selected = keys
    ? keys.map((k) => frames[k]).filter(Boolean)
    : Object.values(frames);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Hex</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((f) => (
            <tr key={f.key}>
              <td>
                <a href={`${f.page}#${f.anchor}`}>{f.key}</a>
              </td>
              <td><code>{f.hex}</code></td>
              <td>{f.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDiagrams &&
        selected.map((f) => (
          <div key={f.key} style={{ marginTop: '2rem' }}>
            <h3>
              {f.key} — {f.name} (<code>{f.hex}</code>)
            </h3>
            <p>{f.description}</p>
            <Mermaid value={generateMermaid(f.elements, f.bitsPerRow, f.repeat)} />
          </div>
        ))}
    </>
  );
}
