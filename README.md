# DJ Big Brothers

Site vitrine de Thao, DJ Big Brothers, pour les mariages à Toulouse, Montauban et dans les environs.

[Consulter le site](https://dj-big-brothers.raffou2.chatgpt.site) · [Sources des contenus](SOURCES.md)

Le site est actuellement hébergé sur Sites avec un accès privé. La visibilité du dépôt GitHub et celle du site sont indépendantes.

## Fonctionnalités

- Présentation du DJ et des prestations : cérémonie laïque, vin d’honneur et soirée dansante.
- Formules Fiesta et Festival, tarifs et options détaillées.
- Avis clients et lien vers la fiche Mariages.net.
- Questions fréquentes et détails dépliables.
- Formulaire préparant une demande de devis par e-mail.
- Bannière défilante avec pause/reprise et bouton de retour en haut.
- Mise en page mobile first, avec adaptation progressive aux tablettes et ordinateurs.

## Technologies

HTML, CSS et JavaScript natif, sans framework, installation de dépendances ni étape de compilation. Le dossier `dist/` contient directement les fichiers à modifier et à héberger.

Les photos sont au format WebP. Les polices **Barlow Condensed** et **DM Sans** sont servies localement en WOFF2 : leur affichage ne dépend pas de Google Fonts. Leurs licences sont conservées dans `dist/assets/fonts/`.

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

Le site utilise Sites. Le fichier `.openai/hosting.json` référence le projet existant et déclare `dist/` comme dossier statique à publier.

Le dépôt GitHub conserve les sources et leur historique. Aucun workflow GitHub Actions de déploiement n’est configuré : un envoi sur GitHub ne met pas automatiquement à jour le site hébergé. La publication se fait séparément via Sites.

Le contenu de `dist/` peut également être servi par un hébergeur de sites statiques, en conservant les chemins relatifs des fichiers.

## Contenus et droits

Consulter [SOURCES.md](SOURCES.md) pour la provenance des informations et des images. Vérifier les tarifs, conditions commerciales et mentions légales avant l’ouverture au public.

Les licences des polices figurent dans leurs fichiers OFL. Aucune licence générale de réutilisation du code, des photos ou des contenus n’est accordée par ce dépôt.
