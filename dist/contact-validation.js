// Browser-side checks for a mailto draft, not a server security boundary.
const enquiryValidation = (() => {
  const limits = { prenom: 80, lieu: 160, message: 1000 };
  const namePattern = /^\p{L}[\p{L}\p{M} '\u2019\u02BC.\-\u2010\u2011\u200C\u200D]*$/u;
  const singleLinePattern = /^[^\p{Cc}\p{Cs}\u2028\u2029]*$/u;
  // Allow ordinary line breaks and tabs in the message, but no other controls.
  const messagePattern = /^[^\p{Cs}\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]*$/u;
  const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const prepare = (raw, now = new Date()) => {
    const errors = {};
    const values = {};
    for (const [field, maximum] of Object.entries(limits)) {
      const value = typeof raw[field] === 'string' ? raw[field] : '';
      // Bound input before normalization or regular-expression matching.
      if (value.length > maximum) {
        errors[field] = `Limitez ce champ à ${maximum} caractères.`;
        values[field] = '';
      } else {
        values[field] = value.normalize('NFC').trim();
      }
    }
    if (!errors.prenom && (!values.prenom || !namePattern.test(values.prenom))) {
      errors.prenom = 'Indiquez votre prénom avec des lettres, des espaces, des apostrophes ou des traits d’union.';
    }
    if (!errors.lieu && (!values.lieu || !singleLinePattern.test(values.lieu))) {
      errors.lieu = 'Indiquez un lieu ou une ville, sans caractère de contrôle.';
    }
    if (!errors.message && !messagePattern.test(values.message)) {
      errors.message = 'Retirez les caractères de contrôle du message. Les retours à la ligne sont acceptés.';
    }
    values.date = typeof raw.date === 'string' ? raw.date : '';
    const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(values.date);
    const date = validFormat ? new Date(`${values.date}T12:00:00`) : new Date(NaN);
    if (!validFormat || !Number.isFinite(date.getTime()) || localDate(date) !== values.date || values.date < localDate(now)) {
      errors.date = 'Choisissez une date valide, à partir d’aujourd’hui.';
    }
    if (Object.keys(errors).length) return { errors, href: '', values };

    const formattedDate = date.toLocaleDateString('fr-FR');
    const body = `Bonjour l’équipe Big Brothers,\n\nJe m'appelle ${values.prenom}. Nous préparons un événement le ${formattedDate}, à ${values.lieu}.\n\n${values.message}\n\nVotre équipe est-elle disponible à cette date ? Pourrions-nous échanger sur votre prestation et un devis ?\n\nMerci !`;
    // The recipient is fixed. Encode each parameter once; never interpret input as HTML.
    const href = `mailto:djbigbrothers.music@gmail.com?subject=${encodeURIComponent(`Événement du ${formattedDate} — demande de devis`)}&body=${encodeURIComponent(body)}`;
    return { errors, href, values };
  };
  return Object.freeze({ prepare, localDate });
})();

// Reuse the same validation in Node's regression tests, without browser dependencies.
if (typeof module !== 'undefined' && module.exports) module.exports = enquiryValidation;
