if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const link = document.querySelector('link[type="image/svg+xml"]');
    if (link) {
      const href = link.getAttribute('href');
      link.setAttribute('href', '');
      link.setAttribute('href', href);
    }
  });
}
