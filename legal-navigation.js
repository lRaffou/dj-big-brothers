/* Shared enhancement for the public legal pages and their working drafts. */
(() => {
  'use strict';
  const toolbar = document.querySelector('.legal-toolbar');
  if (!toolbar) return;
  const navigation = toolbar.querySelector('.legal-page-nav');
  const activeLink = navigation?.querySelector('[aria-current="page"]');
  const previous = toolbar.querySelector('.nav-arrow-previous');
  const next = toolbar.querySelector('.nav-arrow-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateOffset() {
    document.documentElement.style.setProperty('--navigation-offset',
      (toolbar.getBoundingClientRect().height + 16) + 'px');
  }

  function updateEdges() {
    if (!navigation || !previous || !next) return;
    const overflow = navigation.classList.contains('is-scrollable');
    previous.hidden = next.hidden = !overflow;
    previous.disabled = navigation.scrollLeft <= 2;
    next.disabled = navigation.scrollWidth - navigation.clientWidth - navigation.scrollLeft <= 2;
  }

  function updateNavigation() {
    if (!navigation) return;
    navigation.classList.remove('is-scrollable');
    navigation.classList.toggle('is-scrollable', navigation.scrollWidth > navigation.clientWidth + 1);
    if (activeLink) {
      const link = activeLink.getBoundingClientRect();
      const nav = navigation.getBoundingClientRect();
      navigation.scrollLeft += link.left - nav.left - (nav.width - link.width) / 2;
    }
    updateEdges();
  }

  [previous, next].forEach((button, index) => button?.addEventListener('click', () => {
    navigation.scrollBy({left: (index ? 1 : -1) * Math.max(120, navigation.clientWidth - 104),
      behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }));
  navigation?.addEventListener('scroll', updateEdges, {passive:true});
  navigation?.addEventListener('focusin', event => {
    const link = event.target.closest('a');
    if (!link || !navigation.classList.contains('is-scrollable')) return;
    const bounds = link.getBoundingClientRect();
    const nav = navigation.getBoundingClientRect();
    if (bounds.left < nav.left + 52 || bounds.right > nav.right - 52) {
      navigation.scrollLeft += bounds.left - nav.left - (nav.width - bounds.width) / 2;
    }
  });
  window.addEventListener('resize', updateNavigation);
  updateOffset();
  updateNavigation();
  if ('ResizeObserver' in window) new ResizeObserver(updateOffset).observe(toolbar);
  else window.addEventListener('resize', updateOffset);
  if (document.fonts) document.fonts.ready.then(updateNavigation);
})();
