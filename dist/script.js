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

// Load the third-party module only at the visitor's request; no stored preference.
const reviewsSection = document.querySelector('.live-reviews');
if (reviewsSection) {
  const toggle = reviewsSection.querySelector('.reviews-toggle');
  const embed = reviewsSection.querySelector('#reviews-embed');
  let frame = null;
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    if (frame) {
      frame.remove();
      frame = null;
      embed.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Afficher les avis Mariages.net';
      return;
    }
    frame = document.createElement('iframe');
    frame.title = 'Avis Big Brothers — module officiel Mariages.net';
    frame.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
    frame.referrerPolicy = 'no-referrer';
    frame.src = reviewsSection.dataset.reviewsSrc;
    embed.hidden = false;
    embed.append(frame);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = 'Masquer les avis Mariages.net';
  });
  window.addEventListener('message', (event) => {
    if (!frame || event.source !== frame.contentWindow || event.data?.type !== 'big-brothers-reviews-height') return;
    const height = event.data.height;
    if (Number.isFinite(height)) frame.style.height = Math.min(2400, Math.max(180, height)) + 'px';
  });
}
