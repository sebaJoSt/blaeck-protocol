import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useAllDocsData, useActivePluginAndVersion } from '@docusaurus/plugin-content-docs/client';
import { libraries, useLibrary } from '@site/src/components/useProtocol';
import { libraryNames } from '@site/src/components/libraryNames';

// One library in the mobile menu, like a sidebar category with a page of its own: the name
// opens the library's page, the arrow opens or closes the list of its versions.
function Library({ id, active, open: initiallyOpen, onNavigate, children }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <li className={clsx('menu__list-item site-sidebar__libraries', { 'menu__list-item--collapsed': !open })}>
      <div className="menu__list-item-collapsible">
        <Link
          to={`/libraries/${id}`}
          className={clsx('menu__link menu__link--sublist', { 'menu__link--active': active })}
          onClick={onNavigate}>
          {libraryNames[id]}
        </Link>
        <button
          type="button"
          className="clean-btn menu__caret"
          aria-expanded={open}
          aria-label={open ? 'Collapse' : 'Expand'}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && <ul className="menu__list">{children}</ul>}
    </li>
  );
}

// The mobile menu's libraries: those speaking the given protocol version, each with its
// versions, so a version is reached without a page change on the way.
export default function LibrariesMenuTree({ protocol, onClick }) {
  const docs = useAllDocsData();
  const active = useActivePluginAndVersion();
  const library = useLibrary();
  const onLibraryPage = active?.activePlugin?.pluginId !== library;
  const versionName = active?.activeVersion?.name;
  const main = (v) => v.docs.find((d) => d.id === v.mainDocId)?.path ?? v.path;

  return Object.keys(libraryNames)
    .filter((id) => libraries[id] === protocol)
    .map((id) => (
      <Library key={id} id={id} active={library === id && onLibraryPage} open={library === id} onNavigate={onClick}>
        {docs[id].versions.map((v) => (
          <li key={v.name} className="menu__list-item">
            <Link
              to={main(v)}
              className={clsx('menu__link', {
                'menu__link--active': library === id && !onLibraryPage && versionName === v.name,
              })}
              onClick={onClick}>
              {v.label}
            </Link>
          </li>
        ))}
      </Library>
    ));
}
