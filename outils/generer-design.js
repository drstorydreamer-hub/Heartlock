/*
  Génère les images par défaut du thème (personnages, décors, fouilles, illustrations, vidéo)
  à partir des dessins vectoriels de outils/dessins.js.

  Usage :  node outils/generer-design.js
  Attention : cette commande écrase les fichiers .svg de theme/ portant les mêmes noms.
  Si tu as remplacé des images par les tiennes, ne la lance pas (ou change d'abord les chemins dans theme/theme.js).
*/
const fs = require('fs'), path = require('path'), vm = require('vm');
const racine = path.join(__dirname, '..');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'dessins.js'), 'utf8') +
  ';this.api={PERS,portrait,SCENES,plan,silhouettes:()=>silhouettes,setSil:f=>{silhouettes=f},SC_MANTEAU,SC_MARCHES,SC_CHATON,SC_CARNET,teinte};', ctx);
const A = ctx.api;

// Les SVG affichés en <img> n'ont pas accès aux polices du site : on donne des polices de secours.
const polices = s => s
  .replaceAll('Fredoka,sans-serif', "Fredoka,'Arial Rounded MT Bold','Trebuchet MS',Arial,sans-serif")
  .replaceAll("'Patrick Hand',cursive", "'Patrick Hand','Comic Sans MS','Segoe Print',cursive")
  .replaceAll('Sarabun,sans-serif', "Sarabun,Tahoma,Arial,sans-serif");
const ecrire = (rel, svg) => {
  const f = path.join(racine, 'theme', rel); fs.mkdirSync(path.dirname(f), { recursive: true });
  svg = polices(svg).replace('<svg ', '<svg ').replace(/^<svg(?![^>]*xmlns=)/, '<svg xmlns="http://www.w3.org/2000/svg"');
  // Taille intrinsèque (largeur/hauteur) d'après la viewBox, pour un affichage correct en <img>
  svg = svg.replace(/^<svg([^>]*)>/, (m, at) => /\swidth=/.test(at) ? m : (() => { const v = at.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return v ? `<svg width="${v[1]}" height="${v[2]}"${at}>` : m })());
  fs.writeFileSync(f, '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + '\n'); return rel;
};
const out = [];

// 1. Personnages : 6 expressions chacun
const EXPR = { n: 'neutre', h: 'rire', s: 'surpris', b: 'timide', a: 'agace', p: 'emu' };
for (const id of Object.keys(A.PERS)) for (const [c, nom] of Object.entries(EXPR))
  out.push(ecrire(`personnages/${id}/${nom}.svg`, A.portrait(id, c)));

// 2. Décors (plein écran, recadrés pour remplir l'écran)
const DECORS = { ville: ['ville', {}], salon: ['salon', {}], salon_jour: ['salon', { jour: 1 }], cuisine: ['cuisine', {}],
  entree: ['entree', {}], escalier: ['escalier', {}], escalier_orage: ['escalier', { orage: 1 }], magasin: ['magasin', {}] };
for (const [nom, [k, o]] of Object.entries(DECORS)) out.push(ecrire(`decors/${nom.replace('_', '-')}.svg`, A.SCENES[k](o)));

// 3. Fouilles : l'image seule, sans les zones cliquables (elles sont définies dans theme.js)
const sansZones = s => s.replace(/<rect class="halo"[^>]*\/>/g, '').replace(/<g class="spot"[^>]*>/g, '<g>');
out.push(ecrire('fouilles/impermeable.svg', sansZones(A.SC_MANTEAU())));
out.push(ecrire('fouilles/escalier.svg', sansZones(A.SC_MARCHES())));

// 4. Illustrations des cartes
out.push(ecrire('illustrations/chaton.svg', A.SC_CHATON()));
out.push(ecrire('illustrations/carnet-ayaan.svg', A.SC_CARNET()));

// 5. Vidéo de KN-01 (nuit) et scène du baiser : un fond + trois calques animés
const sil0 = A.silhouettes();
for (const [mode, nom] of [['sombre', 'nuit'], ['clair', 'baiser']]) {
  A.setSil(() => ''); const fond = A.plan(mode); A.setSil(sil0);
  const s = A.plan(mode);
  const a = s.match(/<g class="sil-a">[\s\S]*?<\/g>/)[0];
  const bAll = s.match(/<g class="sil-b">[\s\S]*<\/g>(?=\s*<g transform="translate\(150)/)[0];
  const mains = (bAll.match(/<(path|circle) class="mainj"[^>]*\/>/g) || []).join('');
  const b = bAll.replace(/<(path|circle) class="mainj"[^>]*\/>/g, '');
  const calque = c => `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.replace(/ class="[^"]*"/g, '')}</svg>`;
  out.push(ecrire(`video/${nom}-fond.svg`, fond));
  out.push(ecrire(`video/${nom}-gauche.svg`, calque(a)));
  out.push(ecrire(`video/${nom}-droite.svg`, calque(b)));
  out.push(ecrire(`video/${nom}-main.svg`, calque(mains)));
}
console.log(out.length + ' images écrites dans theme/');
