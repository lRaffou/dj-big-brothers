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
  ribbonToggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
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

// Native horizontal navigation keeps touch scrolling and keyboard links intact.
const mobileNavigation = document.querySelector('.header nav');
const navigationHint = document.querySelector('.nav-scroll-hint');
if (mobileNavigation && navigationHint) {
  const mobileNavigationQuery = window.matchMedia('(max-width: 63.999rem)');
  const updateNavigationOverflow = () => {
    const remaining = mobileNavigation.scrollWidth - mobileNavigation.clientWidth;
    const overflows = mobileNavigationQuery.matches && remaining > 2;
    navigationHint.hidden = !overflows;
    mobileNavigation.classList.toggle('can-scroll-back', overflows && mobileNavigation.scrollLeft > 2);
    mobileNavigation.classList.toggle('can-scroll-forward', overflows && mobileNavigation.scrollLeft < remaining - 2);
  };
  mobileNavigation.addEventListener('scroll', updateNavigationOverflow, { passive: true });
  mobileNavigationQuery.addEventListener('change', updateNavigationOverflow);
  new ResizeObserver(updateNavigationOverflow).observe(mobileNavigation);
  document.fonts.ready.then(updateNavigationOverflow);
  updateNavigationOverflow();
}
