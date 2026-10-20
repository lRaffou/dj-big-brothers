/* Shared enhancement for the public legal pages and their working drafts. */
(() => {
  'use strict';
  const toolbar = document.querySelector('.legal-toolbar');
  if (!toolbar) return;
  const navigation = toolbar.querySelector('.legal-page-nav');
  const activeLink = navigation?.querySelector('[aria-current="page"]');

  // Match the actual height, including wrapping, text zoom and safe-area insets.
  function updateOffset() {
    document.documentElement.style.setProperty('--navigation-offset',
      (toolbar.getBoundingClientRect().height + 16) + 'px');
  }

  // Show the current document on arrival without scrolling the page vertically.
  function revealCurrentPage() {
    if (!activeLink) return;
    const link = activeLink.getBoundingClientRect();
    const nav = navigation.getBoundingClientRect();
    navigation.scrollLeft += link.left - nav.left - (nav.width - link.width) / 2;
  }

  updateOffset();
  if ('ResizeObserver' in window) new ResizeObserver(updateOffset).observe(toolbar);
  else window.addEventListener('resize', updateOffset);
  if (document.fonts) document.fonts.ready.then(revealCurrentPage);
  else revealCurrentPage();
})();
