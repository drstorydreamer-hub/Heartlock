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

## Revenir aux images et sons d'origine

Ils sont dessinés et composés par du code. Pour les régénérer :

```bash
node outils/generer-design.js      # images
python3 outils/generer-musique.py  # musiques (nécessite numpy et ffmpeg)
```

Ces commandes écrasent les fichiers de même nom : mets d'abord tes propres fichiers ailleurs, ou sous un autre nom.
