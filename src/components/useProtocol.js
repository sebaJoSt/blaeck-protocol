import { useLocation } from '@docusaurus/router';
import { useActivePluginAndVersion } from '@docusaurus/plugin-content-docs/client';
import { frames, entries } from '@site/src/data/frames';
import { elements } from '@site/src/data/elements';
import { frames as framesV1 } from '@site/src/data/v1/frames';
import { elements as elementsV1 } from '@site/src/data/v1/elements';

const protocols = {
  1: { version: '1', frames: framesV1, entries: {}, elements: elementsV1, base: '/protocol/1' },
  2: { version: '2', frames, entries, elements, base: '/protocol' },
};

// The protocol each library speaks. blaecktcpy moves to 2 with its next release.
export const libraries = {
  blaeck: '2',
  blaeckserial: '1',
  blaecktcp: '1',
  blaecktcpy: '1',
};

// The library a page belongs to: its docs, or its page under /libraries/.
export function useLibrary() {
  const active = useActivePluginAndVersion();
  const { pathname } = useLocation();
  const pluginId = active?.activePlugin?.pluginId;
  if (pluginId in libraries) return pluginId;
  return pathname.match(/\/libraries\/([a-z]+)\/?$/)?.[1];
}

// The protocol a page shows: the version of the protocol docs it belongs to, or the one its
// library speaks.
export default function useProtocol() {
  const active = useActivePluginAndVersion();
  const library = useLibrary();
  const pluginId = active?.activePlugin?.pluginId;
  if (pluginId === 'protocol')
    return protocols[active.activeVersion?.name === '1' ? 1 : 2];
  return protocols[libraries[library] ?? '2'];
}
