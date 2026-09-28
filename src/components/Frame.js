import React from 'react';
import Link from '@docusaurus/Link';
import PacketDiagram from '@site/src/components/PacketDiagram';
import useProtocol from '@site/src/components/useProtocol';

function renderDescription(text, base) {
  // Split on markdown links [label](url) and inline code `code`
  const parts = text.split(/(\[.*?\]\(.*?\)|`[^`]+`)/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const href = linkMatch[2].startsWith('/') ? linkMatch[2] : `${base}/${linkMatch[2]}`;
      return <Link key={i} to={href}>{linkMatch[1]}</Link>;
    }
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return <code key={i}>{codeMatch[1]}</code>;
    }
    return part;
  });
}

function ElementRows({ keys, elements, base }) {
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
        {keys.map((key) => {
          const el = elements[key];
          if (!el) return null;
          return (
            <tr key={key}>
              <td>{el.label || key}</td>
              <td>{el.size}</td>
              <td><code>{el.type}</code></td>
              <td>{renderDescription(el.description, base)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Frame({ id, showElements = false }) {
  const { frames, elements, base } = useProtocol();
  const f = frames[id];
  if (!f) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 id={f.anchor}>
        {f.key} — {f.name} (<code>{f.hex}</code>)
      </h2>
      <p>{f.description}</p>
      <PacketDiagram elements={f.elements} repeat={f.repeat} repeatNested={f.repeatNested} />
      {showElements && f.elements && <ElementRows keys={f.elements} elements={elements} base={base} />}
    </div>
  );
}

// One entry kind of the Entity List: what follows DeviceID and EntryKind.
export function Entry({ id, showElements = false }) {
  const { entries, elements, base } = useProtocol();
  const e = entries[id];
  if (!e) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 id={`${id}-entry`}>
        {e.name} (<code>EntryKind</code> {e.kind})
      </h3>
      <p>{e.description}</p>
      <PacketDiagram elements={e.elements} repeat={e.repeat} />
      {showElements && <ElementRows keys={e.elements} elements={elements} base={base} />}
    </div>
  );
}
