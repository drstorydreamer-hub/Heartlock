/* ---------- Lecteur de la playlist d'Ayaan ----------
   Les chansons sont des fichiers numérotés dans le dossier indiqué par theme.js
   (par défaut theme/musique/playlist/) : piste-01.mp3, piste-02.mp3, etc.
   Les sept premières correspondent aux titres de l'énigme 1 (PLAYLIST dans histoire.js).
   Toute piste supplémentaire (piste-08.mp3, piste-09.mp3…) est détectée toute seule. */
const LECT={pistes:[],i:0,a:null,pret:false,vol:1};
function lectCfg(){const P=(window.THEME||{}).playlist||{};return{fichiers:P.fichiers||null,dossier:P.dossier??'theme/musique/playlist/',prefixe:P.prefixe??'piste-',extension:P.extension??'.mp3',volume:P.volume??.85,titres:P.titres||{},max:P.maximum??60}}
const deux=n=>String(n).padStart(2,'0');
const mmss=s=>!isFinite(s)||s<0?'–:––':Math.floor(s/60)+':'+deux(Math.floor(s%60));
function lectSrc(n){const c=lectCfg();if(c.fichiers)return c.fichiers[n-1]||null;return c.dossier+c.prefixe+deux(n)+c.extension}
const lectNom=n=>{const c=lectCfg();return c.prefixe+deux(n)+c.extension}
function lectSonde(src){if(!src)return Promise.resolve(null);return new Promise(ok=>{const a=new Audio();let fini=false;const f=v=>{if(fini)return;fini=true;a.removeAttribute('src');ok(v)};
 a.preload='metadata';a.onloadedmetadata=()=>f(a.duration);a.onerror=()=>f(null);setTimeout(()=>f(undefined),8000);a.src=src})}
async function lectInit(){if(LECT.pret)return;LECT.pret=true;const c=lectCfg();LECT.vol=c.volume;
 LECT.pistes=PLAYLIST.map((p,k)=>({n:k+1,titre:p[0],par:p[2],src:lectSrc(k+1),duree:undefined,ok:null}));
 LECT.a=new Audio();LECT.a.preload='auto';
 LECT.a.addEventListener('timeupdate',lectTemps);LECT.a.addEventListener('ended',()=>lectSuivante(true));
 LECT.a.addEventListener('play',lectEtat);LECT.a.addEventListener('pause',lectEtat);
 LECT.a.addEventListener('error',()=>{const p=LECT.pistes[LECT.i];if(p&&LECT.a.getAttribute('src')){p.ok=false;lectRendu();lectSuivante(true)}});
 await Promise.all(LECT.pistes.map(async p=>{const d=await lectSonde(p.src);p.ok=d!==null;p.duree=d||undefined}));
 for(let n=LECT.pistes.length+1;n<=(c.fichiers?c.fichiers.length:c.max);n++){const src=lectSrc(n);const d=await lectSonde(src);if(d===null||d===undefined)break;
  LECT.pistes.push({n,titre:c.titres[n]||c.titres[deux(n)]||'Piste '+n,par:'',src,duree:d,ok:true})}
 lectRendu()}
const lectJoue=()=>!!(LECT.a&&!LECT.a.paused&&!LECT.a.ended);
function lectVolume(){if(LECT.a)LECT.a.volume=Math.min(1,LECT.vol*(typeof VOL!=='undefined'?VOL.general:1))}
function lectJouer(i){const p=LECT.pistes[i];if(!p)return;if(p.ok===false){lectMessage(`Ajoute le fichier ${lectNom(p.n)} dans ${lectCfg().dossier} pour écouter « ${p.titre} ».`);return}
 if(typeof G!=='undefined'&&!G.son){bascSon()}
 if(LECT.i!==i||!LECT.a.getAttribute('src')){LECT.i=i;LECT.a.src=p.src}
 lectVolume();lectMessage('');if(typeof chansonA!=='undefined'&&chansonA)chansonA.a.pause();
 LECT.a.play().then(()=>{volFond()}).catch(()=>lectMessage('Touche ▶ pour lancer la lecture.'));lectMedia();lectRendu()}
function lectPause(){if(LECT.a){LECT.a.pause();volFond()}}
function lectBascule(){lectJoue()?lectPause():lectJouer(LECT.i)}
function lectSuivante(auto){const L=LECT.pistes;for(let k=1;k<=L.length;k++){const j=(LECT.i+k)%L.length;if(L[j].ok!==false)return lectJouer(j)}lectPause()}
function lectPrecedente(){if(LECT.a&&LECT.a.currentTime>3){LECT.a.currentTime=0;return}const L=LECT.pistes;for(let k=1;k<=L.length;k++){const j=(LECT.i-k+L.length)%L.length;if(L[j].ok!==false)return lectJouer(j)}}
function lectEtat(){document.querySelectorAll('.bPlaylist').forEach(b=>b.classList.toggle('enjeu',lectJoue()));const pp=$('#lpPlay');if(pp){pp.textContent=lectJoue()?'❚❚':'▶';pp.setAttribute('aria-label',lectJoue()?'Pause':'Lecture')}
 document.querySelectorAll('#lpListe .lp-piste').forEach((r,k)=>r.classList.toggle('joue',k===LECT.i&&lectJoue()));if(typeof volFond==='function')volFond()}
function lectTemps(){const a=LECT.a,r=$('#lpBarre');if(!r||!a)return;const d=a.duration;if(!r.dataset.glisse){r.max=isFinite(d)?d:0;r.value=a.currentTime}
 $('#lpT1').textContent=mmss(a.currentTime);$('#lpT2').textContent=mmss(d)}
function lectMessage(t){const m=$('#lpMsg');if(m){m.textContent=t;m.hidden=!t}}
function lectMedia(){const p=LECT.pistes[LECT.i];if(!p||!('mediaSession' in navigator))return;try{
 navigator.mediaSession.metadata=new MediaMetadata({title:p.titre,artist:p.par?'Ajouté par '+p.par:'Club des Six',album:'Ayaan a 25 ans et il est magnifique'});
 navigator.mediaSession.setActionHandler('play',()=>lectJouer(LECT.i));navigator.mediaSession.setActionHandler('pause',lectPause);
 navigator.mediaSession.setActionHandler('nexttrack',()=>lectSuivante());navigator.mediaSession.setActionHandler('previoustrack',lectPrecedente)}catch(e){}}

function lecteur(){lectInit();const L=$('#lecteur');L.hidden=false;lectRendu()}
function lectRendu(){const L=$('#lecteur');if(!L||L.hidden)return;const p=LECT.pistes[LECT.i]||{};
 $('#lpNum').textContent=p.n?deux(p.n):'';$('#lpTitre').textContent=p.titre||'Chargement…';$('#lpPar').textContent=p.par?'Ajouté par '+p.par:(p.n?'Piste ajoutée au dossier':'');
 const Li=$('#lpListe');Li.innerHTML='';LECT.pistes.forEach((q,k)=>{const b=el('button','lp-piste'+(k===LECT.i?' cour':'')+(q.ok===false?' absente':'')+(k===LECT.i&&lectJoue()?' joue':''),
  `<span class="lp-n">${deux(q.n)}<i class="eq"><b></b><b></b><b></b></i></span><span class="lp-t">${q.titre}<small>${q.ok===false?'Fichier à ajouter : '+lectNom(q.n):(q.par?'Ajouté par '+q.par:'Ajoutée au dossier')}</small></span><span class="lp-d">${q.ok===false?'—':mmss(q.duree)}</span>`);
  b.type='button';b.onclick=()=>k===LECT.i&&LECT.a.getAttribute('src')?lectBascule():lectJouer(k);Li.append(b)});
 if(!LECT.pistes.length)Li.append(el('p','jl','Recherche des chansons…'));
 $('#lpVol').value=LECT.vol;lectEtat();lectTemps()}
function lectInstaller(){const L=el('aside','',`<header><div><small class="sur">Playlist de la soirée</small><h2>Ayaan a 25 ans et il est magnifique</h2></div><button class="indice" id="lpF" type="button">Fermer</button></header>
 <div class="lp-cour"><div class="lp-pochette" aria-hidden="true"><span id="lpNum"></span></div><div class="lp-infos"><b id="lpTitre"></b><small id="lpPar"></small></div></div>
 <div class="lp-temps"><span id="lpT1">0:00</span><input id="lpBarre" type="range" min="0" max="0" step="0.1" value="0" aria-label="Position dans la chanson"><span id="lpT2">–:––</span></div>
 <div class="lp-cmd"><button type="button" id="lpPrev" aria-label="Chanson précédente">⏮</button><button type="button" id="lpPlay" class="lp-play" aria-label="Lecture">▶</button><button type="button" id="lpNext" aria-label="Chanson suivante">⏭</button>
 <label class="lp-vol"><span aria-hidden="true">♪</span><input id="lpVol" type="range" min="0" max="1" step="0.05" aria-label="Volume de la playlist"></label></div>
 <p class="lp-msg" id="lpMsg" hidden role="status"></p><div id="lpListe" class="lp-liste"></div>
 <p class="lp-aide">Pour écouter tes propres chansons, dépose-les dans le dossier <code>${lectCfg().dossier}</code> sous les noms <code>${lectCfg().prefixe}01${lectCfg().extension}</code>, <code>${lectCfg().prefixe}02${lectCfg().extension}</code>…</p>`);
 L.id='lecteur';L.hidden=true;L.setAttribute('aria-label','Lecteur de la playlist');$('#app').append(L);
 $('#lpF').onclick=()=>L.hidden=true;$('#lpPlay').onclick=lectBascule;$('#lpNext').onclick=()=>lectSuivante();$('#lpPrev').onclick=lectPrecedente;
 const r=$('#lpBarre');r.oninput=()=>{r.dataset.glisse=1;$('#lpT1').textContent=mmss(+r.value)};r.onchange=()=>{delete r.dataset.glisse;if(LECT.a&&isFinite(LECT.a.duration))LECT.a.currentTime=+r.value};
 $('#lpVol').oninput=e=>{LECT.vol=+e.target.value;lectVolume()};
 addEventListener('keydown',e=>{if(e.key==='Escape')L.hidden=true})}
function boutonPlaylist(classe){const b=bouton('<i class="eq" aria-hidden="true"><b></b><b></b><b></b></i><span>Playlist</span>',lecteur,classe+' bPlaylist');b.setAttribute('aria-label','Ouvrir la playlist');return b}
