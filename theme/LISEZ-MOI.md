# Changer le design du jeu

Tout ce qui se voit et s'entend est dans ce dossier `theme/`. L'histoire et les énigmes sont dans `jeu/` et ne bougent pas quand tu changes le design.

| Ce que tu veux changer | Où |
| --- | --- |
| Couleurs de l'interface et polices | `couleurs.css` |
| Personnages (6 expressions chacun) | `personnages/<prénom>/` et `theme.js` |
| Décors plein écran | `decors/` et `theme.js` |
| Images à fouiller et zones cliquables | `fouilles/` et `theme.js` |
| Photo du chaton, carnet d'Ayaan | `illustrations/` |
| Vidéo de KN-01 et scène du baiser | `video/` et `theme.js` |
| Musique de fond, pluie, chanson, bruitages | `musique/` et `theme.js` |
| Chansons de la playlist d'Ayaan (le lecteur) | `musique/playlist/` |
| Mise en forme détaillée (marges, arrondis, tailles) | `style.css` |

## Méthode 1 : remplacer un fichier

Remplace le fichier par le tien, **avec exactement le même nom**, puis recharge la page.

Exemple : pour changer le visage de Rayn quand il rit, remplace `personnages/rayn/rire.svg`.

Le format doit rester le même (`.svg` remplace `.svg`). Pour utiliser un autre format, passe par la méthode 2.

## Méthode 2 : indiquer ton fichier dans `theme.js`

Ouvre `theme.js` avec un éditeur de texte et change le chemin. Les formats acceptés sont `.png`, `.jpg`, `.webp`, `.gif` et `.svg` pour les images, et `.mp3` pour les sons.

```js
rayn: {
  couleur: '#f4c430',
  expressions: {
    neutre: 'theme/personnages/rayn/neutre.png',
    rire:   'theme/personnages/rayn/rire.png',
    ...
```

Les chemins partent du dossier qui contient `index.html`. Ne supprime ni les virgules ni les guillemets.

## Conseils pour les images

- **Personnages :** portrait en hauteur, fond transparent (PNG), par exemple 600 × 720 px. Le bas de l'image est posé au-dessus de la boîte de dialogue. Garde le même cadrage pour les 6 expressions d'un personnage, sinon il « saute » quand il change d'expression.
- **Décors :** paysage 16:9, par exemple 1920 × 1080 px. Sur téléphone, les côtés sont coupés : garde l'essentiel au centre.
- **Fouilles :** si tu changes l'image, ajuste les zones dans `theme.js`. Chaque zone est un rectangle en pourcentage de l'image : `x` et `y` pour le coin en haut à gauche, `l` pour la largeur, `h` pour la hauteur.
- **Vidéo :** quatre calques de même format 16:9 : le fond, la silhouette de gauche, celle de droite, et la main (fond transparent pour les trois derniers). Tu peux aussi mettre une vraie vidéo `.mp4` dans `fichier`, qui remplace alors les calques.

## Conseils pour la musique

- `fond.defaut` joue en boucle pendant tout le jeu. Pour une musique différente selon le lieu, ajoute une ligne avec le nom du décor, par exemple `escalier: 'theme/musique/escalier.mp3'`.
- Pour une boucle sans coupure, choisis un morceau dont la fin s'enchaîne avec le début.
- Les volumes se règlent dans `musique.volumes`, entre 0 (muet) et 1 (fort).
- Si un fichier manque ou ne se lit pas, le jeu joue un petit son de secours à la place.

## La playlist d'Ayaan

Le jeu contient un vrai lecteur de musique, avec les sept chansons de l'énigme 1. On l'ouvre avec le bouton **Playlist** : sur l'écran titre, dans la barre du haut pendant la partie, ou depuis l'énigme 1.

Pour mettre tes chansons, **dépose les fichiers dans `musique/playlist/`** avec ces noms :

| Fichier | Chanson |
| --- | --- |
| `piste-01.mp3` | Minuit à Silom |
| `piste-02.mp3` | Mon ex est mon voisin |
| `piste-03.mp3` | Bruit du riz qui cuit (version longue) |
| `piste-04.mp3` | Drame sur Sukhumvit |
| `piste-05.mp3` | Je ne te regarde pas (je te regarde) |
| `piste-06.mp3` | Tuk-tuk de mon cœur |
| `piste-07.mp3` | Sous mon parapluie |

- Les fichiers fournis sont des maquettes instrumentales d'environ 40 secondes : remplace-les par les tiens, avec le même nom.
- **Pour ajouter d'autres chansons**, continue la numérotation : `piste-08.mp3`, `piste-09.mp3`… Elles apparaissent toutes seules dans le lecteur. Pour leur donner un titre, remplis `playlist.titres` dans `theme.js`, par exemple `8: 'Ma chanson préférée'`. Sans titre, elles s'appellent « Piste 8 », « Piste 9 »… La numérotation doit se suivre : s'il manque `piste-09.mp3`, les suivantes ne sont pas lues.
- Si une des sept premières manque, elle reste dans la liste avec la mention « Fichier à ajouter ».
- Pendant que la playlist joue, la musique de fond du jeu se met en pause. Elle reprend quand tu arrêtes la playlist.
- Les titres et les noms « Ajouté par » des sept premières chansons viennent de l'histoire (énigme 1) : ils ne changent pas avec les fichiers.

## Revenir aux images et sons d'origine

Ils sont dessinés et composés par du code. Pour les régénérer :

```bash
node outils/generer-design.js      # images
python3 outils/generer-musique.py  # musique de fond, pluie, bruitages (nécessite numpy et ffmpeg)
python3 outils/generer-playlist.py # les 7 chansons de démonstration de la playlist
```

Ces commandes écrasent les fichiers de même nom : mets d'abord tes propres fichiers ailleurs, ou sous un autre nom.
