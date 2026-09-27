import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import useProtocol from '@site/src/components/useProtocol';

// The protocol version of the page: the one being read in the spec, or the one the library
// speaks. The menu opens the same page in the other version where it exists, else its
// introduction.
export default function ProtocolNavbarItem(props) {
  // The mobile menu shows it in its header instead (src/theme/Navbar/MobileSidebar/Header).
  if (props.mobile) return null;
  const { version } = useProtocol();
  const { pathname } = useLocation();
  const { versions } = useAllDocsData().protocol;

  const target = (name) => {
    const docs = versions.find((v) => v.name === name).docs;
    const home = docs.find((d) => d.id === 'intro').path;
    const page = pathname.match(/\/protocol\/(?:1\/)?(.+?)\/?$/);
    if (!page) return home;
    return docs.find((d) => d.path.endsWith(`/protocol/${name === '1' ? '1/' : ''}${page[1]}`))?.path ?? home;
  };

  return (
    <DropdownNavbarItem
      {...props}
      label={`v${version}`}
      items={[
        { label: 'v2', to: target('current'), autoAddBaseUrl: false },
        { label: 'v1', to: target('1'), autoAddBaseUrl: false },
      ]}
    />
  );
}
