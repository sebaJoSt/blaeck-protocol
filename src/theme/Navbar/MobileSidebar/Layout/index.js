import React from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { ThemeClassNames } from '@docusaurus/theme-common';
import SiteSidebar from '@site/src/components/SiteSidebar';

// One panel instead of Docusaurus's two, holding the same sidebar as the pages beside it, so
// nothing hides behind a "Back to main menu" button. The navbar entries live in the header.
export default function NavbarMobileSidebarLayout({ header }) {
  const { pathname } = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className={clsx(ThemeClassNames.layout.navbar.mobileSidebar.container, 'navbar-sidebar')}>
      {header}
      <div className="navbar-sidebar__items">
        <div className={clsx(ThemeClassNames.layout.navbar.mobileSidebar.panel, 'navbar-sidebar__item menu')}>
          <ul className="menu__list">
            <SiteSidebar activePath={pathname} onItemClick={() => mobileSidebar.toggle()} />
          </ul>
        </div>
      </div>
    </div>
  );
}
