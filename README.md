# DJ Big Brothers

Site vitrine de Big Brothers, agence de DJs et de solutions musicales pour les mariages, soirées privées et événements professionnels à Toulouse, Montauban et dans les environs. Équipe : Sophie, Yoan, Thao et Yo.

[Consulter le site](https://lraffou.github.io/dj-big-brothers/) · [Déploiements](https://github.com/lRaffou/dj-big-brothers/actions/workflows/pages.yml) · [Sources des contenus](SOURCES.md)

Le site est publié sur GitHub Pages depuis ce dépôt public. Une copie privée existe aussi sur [Sites](https://dj-big-brothers.raffou2.chatgpt.site) ; sa publication est indépendante.

## Fonctionnalités

- Présentation de l’agence, de ses quatre DJs et de ses prestations musicales, techniques et scénographiques.
- Formules mariage Fiesta et Festival, tarifs et options détaillées ; autres événements sur devis.
- Extraits d’avis et résumé compact cliquable : cinq étoiles dorées, 30 avis, note 5.0 sur 5. Valeurs renseignées manuellement à partir de la capture fournie ; aucune synchronisation automatique ni aucun script Mariages.net intégré.
- Questions fréquentes et détails dépliables.
- Formulaire préparant une demande de devis par e-mail.
- Bannière défilante avec pause/reprise et bouton de retour en haut.
- Mise en page mobile first, avec adaptation progressive aux tablettes et ordinateurs.

## Technologies

HTML, CSS et JavaScript natif, sans framework, installation de dépendances ni étape de compilation. Le dossier `dist/` contient directement les fichiers à modifier et à héberger.

Les photos sont au format WebP. Les polices **Barlow Condensed** et **DM Sans** sont servies localement en WOFF2 : leur affichage ne dépend pas de Google Fonts. Leurs licences sont conservées dans `dist/assets/fonts/`.

### Typographie validée

Conserver **Barlow Condensed** pour les titres et **DM Sans** pour les textes et les boutons, sur mobile comme sur ordinateur. Ce choix a été validé par le propriétaire : ne pas remplacer ces polices ni leurs fichiers locaux lors des prochaines modifications, sauf demande explicite de sa part. Préserver également les graisses et la casse actuelles.

## Lancer le site en local

Pour un aperçu rapide, ouvrir `dist/index.html` dans un navigateur.

Pour utiliser un serveur local, depuis la racine du dépôt et avec Python 3 installé :

```sh
python -m http.server 8080 --directory dist
```

Ouvrir ensuite [http://localhost:8080](http://localhost:8080). Sur Windows, utiliser `py` à la place de `python` si nécessaire. Arrêter le serveur avec `Ctrl+C`.

## Organisation du dépôt

```text
.
├── README.md
├── SOURCES.md             # Provenance des textes, tarifs et photos
├── .github/workflows/
│   └── pages.yml         # Publication automatique sur GitHub Pages
├── .openai/hosting.json   # Identifiant Sites et dossier statique
└── dist/
    ├── index.html        # Structure, textes, tarifs et coordonnées
    ├── style.css         # Apparence, responsive et animations
    ├── script.js         # Formulaire, bannière et retour en haut
    ├── fonts.css         # Déclarations des polices locales
    ├── robots.txt
    └── assets/
        ├── dj-mariage.webp
        ├── thao.webp
        └── fonts/        # Polices WOFF2 et licences
```

Le dossier `.sites-runtime/` et les archives `*.tar.gz` sont des fichiers de travail locaux exclus de Git.

## Modifier le contenu

| Modification | Fichier |
| --- | --- |
| Textes, prestations, prix, avis et liens | `dist/index.html` |
| Couleurs, espacements, tailles et mise en page | `dist/style.css` |
| Comportement du formulaire et des boutons | `dist/script.js` |
| Polices | `dist/fonts.css` et `dist/assets/fonts/` |
| Photos | `dist/assets/` |

Les variables CSS de `:root` définissent la palette. Les styles de base ciblent le mobile ; les règles `min-width` ajoutent les dispositions pour les écrans plus larges.

Pour changer l’adresse de réception des demandes, modifier les liens de contact dans `dist/index.html` **et** l’adresse utilisée dans `dist/script.js`.

## Fonctionnement du contact

Les trois pages juridiques sont accessibles depuis le footer dans `dist/`, sous une forme provisoire explicitement signalée. Les versions de travail détaillées restent dans [`drafts/legal/`](drafts/legal/README.md), et les informations manquantes dans [`A_COMPLETER.md`](drafts/legal/A_COMPLETER.md). La présence des liens ne signifie pas que les documents sont complets ou validés.

Le formulaire crée un lien `mailto:` à partir du prénom, de la date, du lieu et du message saisis. Il ouvre un brouillon dans la messagerie du visiteur, qui doit ensuite l’envoyer lui-même.

Aucun serveur n’envoie les messages et aucune base de données ne stocke les demandes. Une messagerie configurée est nécessaire ; l’adresse e-mail et le numéro de téléphone restent accessibles directement sur la page.

## Accessibilité et vérifications

Le site prévoit des libellés de formulaire, des indicateurs de focus, un lien d’évitement et des commandes utilisables au clavier. Les animations respectent la préférence `prefers-reduced-motion`.

Lors des dernières modifications, des contrôles locaux ont couvert les largeurs de 320 à 1 440 px, l’agrandissement du texte à 200 %, le chargement des polices locales et les interactions principales. Ces contrôles ne constituent pas un audit complet d’accessibilité ni une validation sur tous les appareils.

Après une modification, vérifier notamment le titre sur petit écran, l’absence de défilement horizontal, les liens de navigation, la pause de la bannière et le retour en haut. Pour contrôler la syntaxe JavaScript avec Node.js installé :

```sh
node --check dist/script.js
```

## Hébergement

Le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publie uniquement le contenu de `dist/` sur GitHub Pages, sans compilation.

- Une modification de `dist/` ou du workflow envoyée sur `main` déclenche une publication.
- Une modification du README seul ne déclenche pas de publication du site.
- Pour republier manuellement : **Actions → Publish website to GitHub Pages → Run workflow**, puis sélectionner `main`.
- Dans **Settings → Pages**, la source de publication est **GitHub Actions**.

Suivre le résultat et les erreurs éventuelles dans les [exécutions du workflow](https://github.com/lRaffou/dj-big-brothers/actions/workflows/pages.yml). Le site est accessible à [lraffou.github.io/dj-big-brothers](https://lraffou.github.io/dj-big-brothers/) après une exécution réussie.

Conserver les chemins relatifs des styles, scripts, images et polices pour que le site fonctionne sous `/dj-big-brothers/`.

Le fichier `.openai/hosting.json` référence la copie Sites existante. Un envoi sur GitHub ne met pas à jour cette copie : sa publication se fait séparément via Sites. Ce fichier n’est pas inclus dans le site GitHub Pages.

## Contenus et droits

Consulter [SOURCES.md](SOURCES.md) pour la provenance des informations et des images. Les tarifs, conditions commerciales et mentions légales doivent être validés et tenus à jour par le propriétaire du site.

Les licences des polices figurent dans leurs fichiers OFL. Aucune licence générale de réutilisation du code, des photos ou des contenus n’est accordée par ce dépôt.
