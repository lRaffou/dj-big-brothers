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
