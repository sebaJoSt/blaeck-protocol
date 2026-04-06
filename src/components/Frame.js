import React from 'react';
import Mermaid from '@theme/Mermaid';
import { frames } from '@site/src/data/frames';

export default function Frame({ id }) {
  const f = frames[id];
  if (!f) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 id={f.anchor}>
        {f.key} — {f.name} (<code>{f.hex}</code>)
      </h2>
      <p>{f.description}</p>
      <Mermaid value={f.mermaid} />
    </div>
  );
}
