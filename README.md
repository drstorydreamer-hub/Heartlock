# Heartlock

![LoveEscape : un escape game romantique BL](assets/love-escape.jpg)

## ▶ [Jouer à la démo](https://drstorydreamer-hub.github.io/Heartlock/)

### Premier dossier : Qui a embrassé qui ? L'affaire de l'escalier C

Un petit jeu narratif romantique, entièrement en français, jouable directement dans le navigateur, sur ordinateur comme sur téléphone.

À Bangkok, six amis fêtent les 25 ans d'Ayaan. Le lendemain matin, une vidéo de huit secondes apparaît dans l'album partagé de la soirée : deux silhouettes s'embrassent sous la pluie. Personne ne se dénonce. Tu es la seule personne qui peut démêler l'affaire.

**Durée :** 20 à 30 minutes · **Énigmes :** 5 · **Difficulté :** facile à intermédiaire

## Jouer

- **En ligne :** https://drstorydreamer-hub.github.io/Heartlock/
- **Sur ton ordinateur :** ouvre `index.html` dans un navigateur. Aucune installation n'est nécessaire.

Sur téléphone, « Ajouter à l'écran d'accueil » lance le jeu en plein écran, comme une application.

## La playlist d'Ayaan

Le jeu contient un vrai lecteur de musique avec les sept chansons de la soirée (bouton **Playlist**). Pour y mettre tes chansons, dépose-les dans `theme/musique/playlist/` sous les noms `piste-01.mp3` à `piste-07.mp3`. Les pistes suivantes (`piste-08.mp3`, `piste-09.mp3`…) sont ajoutées automatiquement. Le détail est dans [`theme/LISEZ-MOI.md`](theme/LISEZ-MOI.md#la-playlist-dayaan).

## Changer le design, les personnages ou la musique

Tout le visuel et le son sont des fichiers séparés dans le dossier [`theme/`](theme/). On les remplace sans toucher au jeu. Le mode d'emploi est dans [`theme/LISEZ-MOI.md`](theme/LISEZ-MOI.md).

## Structure

```
index.html                  Page du jeu
theme/                      TOUT LE DESIGN
  theme.js                  La liste des images et des sons utilisés (chemins, volumes, zones de fouille)
  couleurs.css              Couleurs et polices de l'interface
  style.css                 Mise en forme détaillée
  personnages/<prénom>/     6 expressions par personnage
  decors/                   Décors plein écran
  fouilles/                 Images à fouiller
  illustrations/            Photo du chaton, carnet d'Ayaan
  video/                    Calques de la vidéo de KN-01 et de la scène du baiser
  musique/                  Musique de fond, pluie, chanson, bruitages
  musique/playlist/         Les chansons du lecteur : piste-01.mp3, piste-02.mp3…
jeu/
  histoire.js               Le scénario : scènes, répliques, données des énigmes
  lecteur.js                Le lecteur de la playlist
  moteur.js                 Le fonctionnement du jeu
outils/
  generer-design.js         Régénère les images d'origine
  generer-musique.py        Régénère la musique de fond, la pluie et les bruitages
  generer-playlist.py       Régénère les 7 chansons de démonstration
  synthe.py                 Outils de synthèse audio communs
  fichier-unique.js         Assemble tout le jeu en un seul fichier HTML (dist/)
  dessins.js                Les dessins d'origine, en code
tests/partie-complete.js    Joue toute l'enquête automatiquement
tests/playlist.js           Vérifie le lecteur de la playlist
assets/                     Visuel de couverture
```

## Mettre la démo à jour

La démo est servie directement depuis la branche `main` par GitHub Pages : **Settings → Pages → Deploy from a branch → main, / (root)**.
Chaque modification envoyée sur `main` est en ligne une à deux minutes après.

## Un seul fichier à partager

```bash
node outils/fichier-unique.js
```

Ce script crée `dist/heartlock.html` : le jeu complet avec ses images et ses musiques dans un seul fichier, qu'on peut envoyer et ouvrir sans connexion (sauf pour les polices).

## Tester

Ce test joue toute l'enquête au format ordinateur puis au format téléphone, et enregistre des captures dans `tests/captures/` :

```bash
npm install playwright
npx playwright install chromium
node tests/partie-complete.js
node tests/playlist.js
```
