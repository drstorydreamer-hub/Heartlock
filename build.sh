#!/bin/bash
# Assemble le jeu en un seul fichier HTML autonome.
#   src/style.css + src/art.js + src/story.js + src/engine.js  ->  index.html
set -e
cd "$(dirname "$0")"
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:ital,wght@0,500;0,600;0,700;0,800;1,500&family=Pacifico&family=Patrick+Hand&display=swap">'
corps(){
  echo '<style>'; cat src/style.css; echo '</style>'
  echo '<div id="app"></div><script>'
  cat src/art.js src/story.js src/engine.js
  echo '</script>'
}
{
  cat <<'H'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#fdeef5">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="description" content="Enquête romantique jouable : six amis à Bangkok, une vidéo de huit secondes, cinq énigmes et une révélation sous la pluie.">
<title>Qui a embrassé qui ? L’affaire de l’escalier C</title>
<meta property="og:title" content="Qui a embrassé qui ? L’affaire de l’escalier C">
<meta property="og:description" content="Un escape game romantique BL, entièrement en français, jouable dans le navigateur.">
<meta property="og:image" content="https://drstorydreamer-hub.github.io/Heartlock/assets/love-escape.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%8C%3C/text%3E%3C/svg%3E">
H
  echo "$FONTS"
  echo '<style>html{padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  echo '</head><body>'; corps; echo '</body></html>'
} > index.html
echo "OK : $(wc -c < index.html) octets"
