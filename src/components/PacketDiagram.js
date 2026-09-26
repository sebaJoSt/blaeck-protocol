import React, { useEffect, useRef, useState } from 'react';
import Mermaid from '@theme/Mermaid';
import { generateMermaid, MAX_ROW } from '@site/src/data/elements';

// Mermaid draws each span 32 px wide.
const SPAN_PX = 32;

// A frame's packet diagram, wrapped to the width it has on the page.
export default function PacketDiagram({ elements, repeat }) {
  const ref = useRef(null);
  const [maxRow, setMaxRow] = useState(MAX_ROW);

  useEffect(() => {
    const box = ref.current;
    if (!box || typeof ResizeObserver === 'undefined') return undefined;
    const update = () => {
      const fits = Math.floor(box.clientWidth / SPAN_PX);
      if (fits > 0) setMaxRow(Math.min(MAX_ROW, fits));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Mermaid value={generateMermaid(elements, repeat, maxRow)} />
    </div>
  );
}
