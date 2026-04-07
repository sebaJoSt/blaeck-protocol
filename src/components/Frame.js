import React from 'react';
import Mermaid from '@theme/Mermaid';
import Link from '@docusaurus/Link';
import { frames } from '@site/src/data/frames';
import { elements, generateMermaid } from '@site/src/data/elements';

function renderDescription(text) {
  // Split on markdown links [label](url) and inline code `code`
  const parts = text.split(/(\[.*?\]\(.*?\)|`[^`]+`)/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const href = linkMatch[2].startsWith('/') ? linkMatch[2] : `/protocol/${linkMatch[2]}`;
      return <Link key={i} to={href}>{linkMatch[1]}</Link>;
    }
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return <code key={i}>{codeMatch[1]}</code>;
    }
    return part;
  });
}

export default function Frame({ id, showElements = false }) {
  const f = frames[id];
  if (!f) return null;

  const mermaidValue = generateMermaid(f.elements, f.bitsPerRow);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 id={f.anchor}>
        {f.key} — {f.name} (<code>{f.hex}</code>)
      </h2>
      <p>{f.description}</p>
      <Mermaid value={mermaidValue} />
      {showElements && f.elements && (
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
            {f.elements.map((key) => {
              const el = elements[key];
              if (!el) return null;
              return (
                <tr key={key}>
                  <td>{el.label || key}</td>
                  <td>{el.size}</td>
                  <td><code>{el.type}</code></td>
                  <td>{renderDescription(el.description)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
