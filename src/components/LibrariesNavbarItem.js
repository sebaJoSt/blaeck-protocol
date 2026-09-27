import React from 'react';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import useProtocol, { libraries } from '@site/src/components/useProtocol';

const entries = [
  { id: 'blaeck', label: 'blaeck', activeBaseRegex: '/blaeck/' },
  { id: 'blaecktcpy', label: 'blaecktcpy', activeBaseRegex: '/blaecktcpy/' },
  { id: 'blaeckserial', label: 'BlaeckSerial', activeBaseRegex: '/blaeckserial/' },
  { id: 'blaecktcp', label: 'BlaeckTCP', activeBaseRegex: '/blaecktcp/' },
];

// The libraries that speak the protocol version the page belongs to.
export default function LibrariesNavbarItem(props) {
  // The mobile menu shows the libraries in its sidebar (src/components/SiteSidebar.js).
  if (props.mobile) return null;
  return <DesktopLibrariesNavbarItem {...props} />;
}

function DesktopLibrariesNavbarItem(props) {
  const { version } = useProtocol();
  const items = entries
    .filter((e) => libraries[e.id] === version)
    .map(({ label, id, activeBaseRegex }) => ({ label, to: `/${id}/overview`, activeBaseRegex }));
  return <DropdownNavbarItem {...props} label="Libraries" items={items} />;
}
