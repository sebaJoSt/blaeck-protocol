import React from 'react';
import { useLocation } from '@docusaurus/router';

const libraries = {
  blaeckserial: 'BlaeckSerial',
  blaecktcp: 'BlaeckTCP',
  blaecktcpy: 'blaecktcpy',
};

export default function LibraryLabel() {
  const { pathname } = useLocation();
  const match = pathname.match(/\/blaeck-protocol\/(blaeckserial|blaecktcp|blaecktcpy)\//);
  if (!match) return null;
  return (
    <span className="navbar__item" style={{ fontWeight: 'bold' }}>
      {libraries[match[1]]}
    </span>
  );
}
