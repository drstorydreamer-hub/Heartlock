/*
  Assemble tout le jeu (thème compris : images, musiques) en un seul fichier HTML autonome,
  pratique pour l'envoyer à quelqu'un ou le publier ailleurs qu'en ligne.

  Usage :  node outils/fichier-unique.js            -> dist/heartlock.html (page complète)
           node outils/fichier-unique.js --fragment -> sans <!doctype>/<head> (pour un hébergeur qui ajoute son propre squelette)
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.join(__dirname, '..');
const lire = f => fs.readFileSync(path.join(R, f), 'utf8');
const TYPES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.webm': 'video/webm' };

// 1. Charger le thème et remplacer chaque chemin de fichier par son contenu (data URI)
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(lire('theme/theme.js'), ctx);
let n = 0, octets = 0;
const integrer = v => {
  if (typeof v === 'string') {
    const f = path.join(R, v), t = TYPES[path.extname(v).toLowerCase()];
    if (t && fs.existsSync(f)) { const b = fs.readFileSync(f); n++; octets += b.length; return `data:${t};base64,${b.toString('base64')}`; }
    return v;
  }
  if (Array.isArray(v)) return v.map(integrer);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, integrer(x)]));
  return v;
};
const theme = integrer(ctx.window.THEME);

// 2. Assembler
const css = lire('theme/couleurs.css') + '\n' + lire('theme/style.css');
const corps = `<style>${css}</style>\n<div id="app"></div>\n<script>window.THEME=${JSON.stringify(theme)};</script>\n<script>${lire('jeu/histoire.js')}</script>\n<script>${lire('jeu/moteur.js')}</script>\n`;
const fragment = process.argv.includes('--fragment');
const titre = 'Qui a embrassé qui ?';
const html = fragment
  ? `<title>${titre}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>[hidden]{display:none!important}</style>\n${corps}`
  : lire('index.html').replace(/<link rel="stylesheet" href="theme\/[^"]+">\n?/g, '').replace(/<script src="[^"]+"><\/script>\n?/g, '').replace('<div id="app"></div>', corps);
fs.mkdirSync(path.join(R, 'dist'), { recursive: true });
const sortie = path.join(R, 'dist', fragment ? 'heartlock-fragment.html' : 'heartlock.html');
fs.writeFileSync(sortie, html);
console.log(`${path.relative(R, sortie)} : ${n} fichiers intégrés, ${(fs.statSync(sortie).size / 1024 / 1024).toFixed(2)} Mo`);
