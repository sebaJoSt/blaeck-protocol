// Hands the spec's sidebar of each protocol version to every page, so a library's pages can
// show the spec entries of the version the library speaks (src/components/SiteSidebar.js).
module.exports = function specSidebars() {
  return {
    name: 'spec-sidebars',
    async allContentLoaded({ allContent, actions }) {
      const versions = allContent['docusaurus-plugin-content-docs'].protocol.loadedVersions;
      const sidebars = {};
      for (const version of versions) {
        const docs = Object.fromEntries(version.docs.map((doc) => [doc.id, doc]));
        const convert = (item) => {
          if (item.type === 'doc') {
            const doc = docs[item.id];
            return {
              type: 'link',
              label: item.label ?? doc.frontMatter.sidebar_label ?? doc.title,
              href: doc.permalink,
            };
          }
          if (item.type === 'category') {
            return {
              type: 'category',
              label: item.label,
              href: item.link?.permalink,
              collapsible: item.collapsible ?? true,
              collapsed: item.collapsed ?? true,
              items: item.items.map(convert),
            };
          }
          return item;
        };
        sidebars[version.versionName] = Object.values(version.sidebars)[0].map(convert);
      }
      actions.setGlobalData(sidebars);
    },
  };
};
