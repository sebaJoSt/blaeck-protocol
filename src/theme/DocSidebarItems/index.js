import React from 'react';
import DocSidebarItems from '@theme-original/DocSidebarItems';
import SiteSidebar from '@site/src/components/SiteSidebar';

// Every docs sidebar, the spec's and the libraries', is the same one: see SiteSidebar.
export default function DocSidebarItemsWrapper(props) {
  if (props.level !== 1) return <DocSidebarItems {...props} />;
  return <SiteSidebar activePath={props.activePath} onItemClick={props.onItemClick} />;
}
