# Pages juridiques YO Production — brouillons

Préparés le 22 septembre 2026 à la demande du propriétaire, au nom commercial de YO Production. Ces fichiers sont volontairement hors de `dist/` : ils ne sont pas publiés par GitHub Pages et ne constituent pas des CGV applicables ni une validation de conformité.

Ouvrir [`preview.html`](preview.html) pour voir l’accueil avec les liens en pied de page et la mention sous le formulaire. Les pages juridiques sont liées à cet aperçu. Ils réutilisent les polices locales et les styles du site. Tous les champs non confirmés sont visibles entre crochets ; les remarques de rédaction doivent être supprimées après résolution.

## Informations à obtenir

- Identité légale et statut de YO Production, SIREN/SIRET, immatriculation, adresse officielle, régime de TVA et capital si applicable.
- Jessica Nadim est désignée comme éditrice et directrice de publication dans le PDF fourni ; cette référence est reprise. Le document ne permet pas d’identifier la structure qui facture les prestations.
- Médiateur auquel le professionnel adhère : nom, adresse et site.
- Conditions contractuelles réellement appliquées : réservation, avance (acompte/arrhes), solde, paiement, annulation/report, inexécution et rétractation. La page de présentation mentionne 50 % et un solde dans la semaine après le mariage ; la rubrique paiement des anciennes CGV contient une erreur de copier-coller.
- Durées de conservation réellement appliquées, prestataires de messagerie/gestion et garanties des éventuels transferts internationaux. Ne pas conserver l’affirmation de durée illimitée de l’ancien site.
- Téléphone officiel de l’hébergeur à vérifier ; ne pas reprendre O2switch pour GitHub Pages.

## Intégration prête à effectuer après résolution

1. Copier les trois pages et `legal.css` dans `dist/`, supprimer les avertissements/champs de rédaction et adapter `../../dist/` en chemins relatifs (`index.html`, `fonts.css`, `style.css`). Fixer la date et retirer `noindex,nofollow`.
2. Ajouter dans le footer de l’accueil la navigation `.legal-links` présente dans les brouillons, avec les trois liens et la mention YO Production. Charger `legal.css` sur l’accueil pour ce footer.
3. Ajouter sous le formulaire une mention courte : « Les informations envoyées par e-mail sont utilisées par YO Production pour répondre à votre demande et préparer votre devis. Consultez notre politique de confidentialité pour connaître vos droits. » Lier le texte à `politique-de-confidentialite.html`. Ne pas ajouter de case de consentement obligatoire pour une simple demande précontractuelle.
4. Recontrôler les liens et le rendu mobile, puis publier. Les pages légales n’utilisent pas `script.js`, qui dépend des éléments propres à l’accueil.

## Vérification des PDF fournis

Les six pages ont été lues et vérifiées visuellement. Les PDF originaux ne sont ni modifiés ni ajoutés au dépôt.

| Document fourni | Informations confirmées | Limites |
| --- | --- | --- |
| conditions de vente Yo Production.pdf | Coordonnées, devis signé, virement pour la vidéo | Cadrage/montage uniquement. Les 40 % concernent les clients entreprises. Ces conditions ne confirment pas celles des mariages DJ. |
| mentions légales.pdf | Jessica Nadim, contact YO Production | Le SIRET 510 909 807 00032 appartient à O2switch, pas à YO Production. Hébergement différent de GitHub Pages. Conservation illimitée non reprise. |
| Politique de Confidentialité de Yo Production.pdf | Équipe : Van Hieu Dao, Thao Dao, Jessica Nadim ; demandes de devis/contrats | Les cookies décrits concernent l’ancien site. Le brouillon décrit le formulaire mailto et GitHub Pages. |

Aucun PDF ne fournit le SIRET de YO Production ni son médiateur. Les conditions DJ et les durées de conservation restent à confirmer.

## Sources consultées

- https://www.yoproduction.fr/conditions-de-vente-yo-production/ (vérifiée : cadrage/montage vidéo, virement, acompte de 40 % pour les clients entreprises)
- https://www.yoproduction.fr/mentions-legales/
- https://www.yoproduction.fr/conditions-de-vente-dj-big-brothers/
- https://www.yoproduction.fr/dj-mariage-toulouse/
- https://www.yoproduction.fr/politique-de-confidentialite-yo-production/
- https://entreprendre.service-public.gouv.fr/vosdroits/F31228
- https://entreprendre.service-public.gouv.fr/vosdroits/F33527
- https://www.cnil.fr/fr/informer-les-personnes
- https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
