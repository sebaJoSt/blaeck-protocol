import React from 'react';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';
import ProtocolNavbarItem from '@site/src/components/ProtocolNavbarItem';

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}>
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  );
}

// Docusaurus's header of the mobile menu, with the protocol version next to the logo and the
// GitHub link next to the theme button, as in the top bar on wide screens.
export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <ProtocolNavbarItem className="navbar-sidebar__protocol" onClick={() => mobileSidebar.toggle()} />
      <a
        href="https://github.com/sebaJoSt/blaeck-protocol"
        target="_blank"
        rel="noopener noreferrer"
        className="header-icon header-icon-github navbar-sidebar__github"
        aria-label="GitHub repository"
      />
      <NavbarColorModeToggle className="margin-right--md" />
      <CloseButton />
    </div>
  );
}
