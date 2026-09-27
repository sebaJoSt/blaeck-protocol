import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import DocSidebarItems from '@theme-original/DocSidebarItems';
import useProtocol from '@site/src/components/useProtocol';
import LibrariesMenuTree from '@site/src/components/LibrariesMenuTree';

// The sidebar of every page of a protocol version, spec page or library page alike: the
// libraries speaking it, then the spec's entries. Wide screens leave the libraries out, as the
// navbar has them there (custom.css).
export default function SiteSidebar({ activePath, onItemClick }) {
  const { version } = useProtocol();
  const spec = usePluginData('spec-sidebars')[version === '1' ? '1' : 'current'];
  return (
    <>
      <li className="menu__list-item navbar-sidebar__heading site-sidebar__libraries">Libraries</li>
      <LibrariesMenuTree protocol={version} onClick={onItemClick} />
      <li className="menu__list-item site-sidebar__divider site-sidebar__libraries" role="separator" />
      <DocSidebarItems items={spec} activePath={activePath} level={1} onItemClick={onItemClick} />
    </>
  );
}
