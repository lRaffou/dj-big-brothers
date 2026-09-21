const form = document.querySelector('#enquiry');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const date = new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('fr-FR');
  const body = `Bonjour Thao,\n\nJe m'appelle ${data.get('prenom')}. Nous préparons notre mariage le ${date}, à ${data.get('lieu')}.\n\n${data.get('message') || ''}\n\nÊtes-vous disponible à cette date ? Pourrions-nous échanger sur votre prestation et un devis ?\n\nMerci !`;
  window.location.href = `mailto:djbigbrothers.music@gmail.com?subject=${encodeURIComponent(`Mariage du ${date} — demande de devis`)}&body=${encodeURIComponent(body)}`;
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
