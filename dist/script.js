const form = document.querySelector('#enquiry');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const date = new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('fr-FR');
  const body = `Bonjour l’équipe Big Brothers,\n\nJe m'appelle ${data.get('prenom')}. Nous préparons un événement le ${date}, à ${data.get('lieu')}.\n\n${data.get('message') || ''}\n\nVotre équipe est-elle disponible à cette date ? Pourrions-nous échanger sur votre prestation et un devis ?\n\nMerci !`;
  window.location.href = `mailto:djbigbrothers.music@gmail.com?subject=${encodeURIComponent(`Événement du ${date} — demande de devis`)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent = 'Votre brouillon est prêt dans votre messagerie. Si elle ne s’ouvre pas, écrivez à djbigbrothers.music@gmail.com ou appelez le 06 98 96 46 79.';
});

const ribbon = document.querySelector('.ribbon');
const ribbonToggle = document.querySelector('.ribbon-toggle');
ribbonToggle.addEventListener('click', () => {
  const paused = ribbon.classList.toggle('is-paused');
  ribbonToggle.setAttribute('aria-pressed', String(paused));
  ribbonToggle.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
  ribbonToggle.querySelector('.icon-pause').toggleAttribute('hidden', paused);
  ribbonToggle.querySelector('.icon-play').toggleAttribute('hidden', !paused);
});

const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = () => { backToTop.hidden = window.scrollY < 400; };
window.addEventListener('scroll', updateBackToTop, { passive: true });
window.addEventListener('pageshow', updateBackToTop);
updateBackToTop();
backToTop.addEventListener('click', () => {
  document.querySelector('#haut').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

// Keep the award label and destination available if the image fails.
const awardImage = document.querySelector('.review-award-image');
if (awardImage) {
  const hideUnavailableAwardImage = () => { awardImage.hidden = true; };
  awardImage.addEventListener('error', hideUnavailableAwardImage);
  if (awardImage.complete && awardImage.naturalWidth === 0) hideUnavailableAwardImage();
}

// Preserve the header layout while the compact navigation pins to the viewport.
const navigationBar = document.querySelector('.header-navigation');
const navigationSlot = document.querySelector('.navigation-slot');
if (navigationBar && navigationSlot) {
  let stickyFrame = 0;
  const updateStickyNavigation = () => {
    stickyFrame = 0;
    const pinned = navigationSlot.getBoundingClientRect().top <= 0;
    navigationBar.classList.toggle('is-fixed', pinned);
  };
  const scheduleStickyNavigation = () => {
    if (!stickyFrame) stickyFrame = requestAnimationFrame(updateStickyNavigation);
  };
  const measureStickyNavigation = () => {
    navigationBar.classList.remove('is-fixed');
    navigationSlot.style.height = '';
    navigationSlot.style.height = navigationBar.getBoundingClientRect().height + 'px';
    navigationBar.classList.add('is-fixed');
    document.documentElement.style.setProperty('--navigation-offset', Math.ceil(navigationBar.getBoundingClientRect().height + 16) + 'px');
    updateStickyNavigation();
  };
  window.addEventListener('scroll', scheduleStickyNavigation, { passive: true });
  window.addEventListener('resize', measureStickyNavigation);
  window.addEventListener('pageshow', measureStickyNavigation);
  window.addEventListener('load', measureStickyNavigation);
  document.fonts.ready.then(measureStickyNavigation);
  measureStickyNavigation();
}

// Native horizontal navigation keeps touch scrolling and keyboard links intact.
const mobileNavigation = document.querySelector('.header nav');
const previousNavigation = document.querySelector('.nav-arrow-previous');
const nextNavigation = document.querySelector('.nav-arrow-next');
if (mobileNavigation && previousNavigation && nextNavigation) {
  const mobileNavigationQuery = window.matchMedia('(max-width: 63.999rem)');
  const updateNavigationOverflow = () => {
    const remaining = mobileNavigation.scrollWidth - mobileNavigation.clientWidth;
    const overflows = mobileNavigationQuery.matches && remaining > 2;
    previousNavigation.hidden = nextNavigation.hidden = !overflows;
    previousNavigation.disabled = !overflows || mobileNavigation.scrollLeft <= 2;
    nextNavigation.disabled = !overflows || mobileNavigation.scrollLeft >= remaining - 2;
    mobileNavigation.classList.toggle('can-scroll-back', overflows && mobileNavigation.scrollLeft > 2);
    mobileNavigation.classList.toggle('can-scroll-forward', overflows && mobileNavigation.scrollLeft < remaining - 2);
  };
  const moveNavigation = (direction) => mobileNavigation.scrollBy({
    left: direction * Math.max(120, mobileNavigation.clientWidth - 104),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
  previousNavigation.addEventListener('click', () => moveNavigation(-1));
  nextNavigation.addEventListener('click', () => moveNavigation(1));
  mobileNavigation.addEventListener('focusin', (event) => {
    const link = event.target.closest('a');
    if (!link || !link.matches(':focus-visible') || !mobileNavigationQuery.matches) return;
    const bounds = mobileNavigation.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.left < bounds.left + 52 || item.right > bounds.right - 52) {
      mobileNavigation.scrollTo({ left: mobileNavigation.scrollLeft + item.left - bounds.left - (bounds.width - item.width) / 2, behavior: 'instant' });
    }
  });
  mobileNavigation.addEventListener('scroll', updateNavigationOverflow, { passive: true });
  mobileNavigationQuery.addEventListener('change', updateNavigationOverflow);
  const navigationSizeObserver = new ResizeObserver(updateNavigationOverflow);
  navigationSizeObserver.observe(mobileNavigation);
  mobileNavigation.querySelectorAll('a').forEach(link => navigationSizeObserver.observe(link));
  document.fonts.ready.then(updateNavigationOverflow);
  updateNavigationOverflow();
}

// Reflect the section currently in view without moving the document vertically.
if (mobileNavigation) {
  const sectionLinks = [...mobileNavigation.querySelectorAll('a[href^="#"]')].map(link => ({
    link,
    section: document.querySelector(link.getAttribute('href'))
  })).filter(entry => entry.section);
  let activeLink = null;
  let beforeSections = true;
  let previousPageScroll = window.scrollY;
  let navigationFrame = 0;
  const updateCurrentSection = () => {
    navigationFrame = 0;
    const pinnedHeight = navigationBar?.classList.contains('is-fixed') ? navigationBar.getBoundingClientRect().height : 0;
    const marker = Math.max(pinnedHeight + 24, Math.min(window.innerHeight * 0.28, 180));
    const current = sectionLinks.find(({ section }) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= marker && bounds.bottom > marker;
    })?.link || null;
    const atStart = sectionLinks.every(({ section }) => section.getBoundingClientRect().top > marker);
    const returningToStart = (atStart && !beforeSections) || (window.scrollY <= 0 && previousPageScroll > 0);
    beforeSections = atStart;
    previousPageScroll = window.scrollY;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (returningToStart) requestAnimationFrame(() => {
      if (beforeSections) mobileNavigation.scrollTo({ left: 0, behavior });
    });
    if (current === activeLink) return;
    sectionLinks.forEach(({ link }) => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    activeLink = current;
    if (current && window.matchMedia('(max-width: 63.999rem)').matches) requestAnimationFrame(() => {
      if (current !== activeLink) return;
      const bounds = mobileNavigation.getBoundingClientRect();
      const linkBounds = current.getBoundingClientRect();
      if (linkBounds.left < bounds.left + 52 || linkBounds.right > bounds.right - 52) {
        const left = mobileNavigation.scrollLeft + linkBounds.left - bounds.left - (bounds.width - linkBounds.width) / 2;
        mobileNavigation.scrollTo({ left, behavior });
      }
    });
  };
  const scheduleCurrentSection = () => {
    if (!navigationFrame) navigationFrame = requestAnimationFrame(updateCurrentSection);
  };
  window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
  window.addEventListener('resize', scheduleCurrentSection);
  window.addEventListener('hashchange', scheduleCurrentSection);
  window.addEventListener('pageshow', scheduleCurrentSection);
  window.addEventListener('load', scheduleCurrentSection);
  document.fonts.ready.then(scheduleCurrentSection);
  scheduleCurrentSection();
}
