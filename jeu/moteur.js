/* ---------- Moteur du jeu ---------- */
const $=s=>document.querySelector(s), el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const CLE='escalier-c-v1', calme=matchMedia('(prefers-reduced-motion: reduce)').matches;
const neuf=()=>({i:0,clues:[],struck:[],ans:{},hints:0,log:[],son:true});
let G=neuf(), bgCour=null, tapeFin=null, attendre=null, actifs={g:null,d:null}, bout='g';
const sauve=()=>{try{localStorage.setItem(CLE,JSON.stringify(G))}catch(e){}};
const charge=()=>{try{const v=JSON.parse(localStorage.getItem(CLE));return v&&v.i>0?v:null}catch(e){return null}};
const nomde=id=>PERS[id].nom;

/* --- Thème : images et sons viennent de theme/theme.js --- */
const T=window.THEME||{};
const EXPR={n:'neutre',h:'rire',s:'surpris',b:'timide',a:'agace',p:'emu'};
const echap=x=>String(x??'').replace(/"/g,'&quot;');
const imgTag=(src,c='')=>src?`<img${c?` class="${c}"`:''} src="${echap(src)}" alt="" draggable="false">`:'';
function portrait(id,e='n'){const p=T.personnages?.[id];const ex=p?.expressions||{};return imgTag(ex[EXPR[e]]||ex.neutre,'pimg')}
function precharge(){const l=[];Object.values(T.personnages||{}).forEach(p=>l.push(...Object.values(p.expressions||{})));l.push(...Object.values(T.decors||{}),...Object.values(T.illustrations||{}));
 ['nuit','baiser'].forEach(k=>{const v=T.video?.[k]||{};l.push(v.fond,v.gauche,v.droite,v.main)});Object.values(T.fouilles||{}).forEach(f=>l.push(f.image));
 l.filter(Boolean).forEach(src=>{const i=new Image();i.src=src})}

/* --- Son : fichiers du thème, avec des sons de secours synthétisés si un fichier manque --- */
let sonPret=false,ac,maitre,fondA=null,pluieA=null,chansonA=null,fondSrc=null,baisse=0;
const MU=T.musique||{}, VOL=Object.assign({general:1,fond:.5,pluie:.45,chanson:.9,effets:.8},MU.volumes||{});
const casse=new Set();
function piste(src,boucle){if(!src||casse.has(src))return null;const a=new Audio();a.preload='auto';a.loop=!!boucle;a.src=src;
 const p={a,g:null,vol(v){v=Math.max(0,v*VOL.general);if(p.g&&ac)p.g.gain.setTargetAtTime(v,ac.currentTime,.4);else a.volume=Math.min(1,v)}};
 a.addEventListener('error',()=>casse.add(src));
 if(ac&&location.protocol!=='file:'){try{const n=ac.createMediaElementSource(a);p.g=ac.createGain();p.g.gain.value=0;n.connect(p.g);p.g.connect(maitre)}catch(e){p.g=null}}
 return p}
function initSon(){if(sonPret||!G.son)return;sonPret=true;try{ac=new(window.AudioContext||window.webkitAudioContext)();maitre=ac.createGain();maitre.connect(ac.destination)}catch(e){ac=null}
 pluieA=piste(MU.pluie,true);if(pluieA){pluieA.vol(0);pluieA.a.play().catch(()=>{})}
 musiqueFond(bgCour);volPluie()}
function volPluie(){if(!pluieA)return;if(!G.son){pluieA.a.pause();return}if(pluieA.a.paused)pluieA.a.play().catch(()=>{});pluieA.vol(VOL.pluie*(.2+rainV*.8))}
function musiqueFond(cle){if(!sonPret)return;const F=MU.fond||{};const base=(cle||'').replace(/(j|o)+$/,'');
 const src=F[cleDecor(cle)]??F[base]??F.defaut??null;
 if(src!==fondSrc){const ancien=fondA;fondSrc=src;fondA=src?piste(src,true):null;
  if(ancien){ancien.vol(0);setTimeout(()=>ancien.a.pause(),900)}
  if(fondA){fondA.vol(0);if(G.son)fondA.a.play().catch(()=>{})}}
 volFond()}
function volFond(){if(!fondA)return;if(!G.son||lectJoue()){fondA.a.pause();return}if(fondA.a.paused)fondA.a.play().catch(()=>{});fondA.vol(VOL.fond*(baisse>Date.now()?.2:1))}
function chanson(){if(!G.son)return;if(lectJoue())lectPause();baisse=Date.now()+8500;volFond();setTimeout(volFond,8600);
 if(MU.chanson&&!casse.has(MU.chanson)){if(chansonA){chansonA.a.pause()}chansonA=piste(MU.chanson,false);if(chansonA){chansonA.vol(VOL.chanson);chansonA.a.currentTime=0;chansonA.a.play().catch(()=>motifSynth(true));return}}
 motifSynth(true)}
function son(cle){if(!G.son)return;const src=MU.sons?.[cle];
 if(src&&!casse.has(src)){const a=new Audio(src);a.volume=Math.min(1,VOL.effets*VOL.general);a.play().catch(()=>{casse.add(src);SECOURS[cle]?.()});return}
 SECOURS[cle]?.()}
function note(fr,t,du=.9,v=.09){if(!ac||!G.son)return;const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=fr;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*VOL.effets,t+.02);g.gain.exponentialRampToValueAtTime(.0008,t+du);o.connect(g);g.connect(maitre||ac.destination);o.start(t);o.stop(t+du+.05)}
function motifSynth(fin){if(!ac)return;let t=ac.currentTime+.1;[523,659,784,659,587,523,440,392].forEach((f,i)=>note(f,t+i*.42,i==7?2.6:.9,fin?.05:.08))}
const SECOURS={bonneReponse:()=>ac&&[659,880,1047].forEach((f,i)=>note(f,ac.currentTime+i*.11,.5,.08)),mauvaiseReponse:()=>ac&&[233,196].forEach((f,i)=>note(f,ac.currentTime+i*.11,.5,.08)),
 message:()=>ac&&note(880,ac.currentTime,.1,.03),fouille:()=>ac&&note(660,ac.currentTime,.25,.05),trait:()=>ac&&note(300,ac.currentTime,.2,.05),victoire:()=>motifSynth(false)};
const ding=ok=>son(ok?'bonneReponse':'mauvaiseReponse');

/* --- Pluie sur canvas --- */
let rainV=.4,gouttes=[];
function pluie(){const c=$('#rain'),x=c.getContext('2d');function rs(){c.width=innerWidth;c.height=innerHeight}rs();addEventListener('resize',rs);
 for(let i=0;i<(T.pluie?.gouttes??340);i++)gouttes.push({x:Math.random(),y:Math.random(),l:10+Math.random()*22,v:.6+Math.random()*.8});
 function f(){x.clearRect(0,0,c.width,c.height);const nb=Math.floor(gouttes.length*rainV);x.strokeStyle=T.pluie?.couleur||'rgba(150,112,196,.36)';x.lineWidth=1.2;x.beginPath();
  for(let i=0;i<nb;i++){const g=gouttes[i],a=g.x*c.width,b=g.y*c.height;x.moveTo(a,b);x.lineTo(a-g.l*.16,b+g.l);if(!calme){g.y+=.016*g.v;g.x-=.0022*g.v;if(g.y>1){g.y=-.05;g.x=Math.random()*1.1}if(g.x<0)g.x+=1}}
  x.stroke();if(!calme)requestAnimationFrame(f)}f()}

function cleDecor(k){return k?k.replace(/j$/,'_jour').replace(/o$/,'_orage'):k}
function decor(st){const k=st.bg+(st.jour?'j':'')+(st.orage?'o':'');rainV=st.rain??.3;volPluie();if(k===bgCour)return;bgCour=k;musiqueFond(k);
 const D=T.decors||{},src=D[cleDecor(k)]||D[st.bg];
 const a=$('#scene'),b=$('#scene2');b.innerHTML=a.innerHTML;b.style.opacity=1;a.style.transition='none';a.style.opacity=0;a.innerHTML=imgTag(src);
 a.offsetWidth;a.style.transition='';a.style.opacity=1;setTimeout(()=>{b.style.opacity=0},40);videCast()}
function videCast(){$('#cast').innerHTML='';actifs={g:null,d:null}}
function poser(id,e){const c=$('#cast');let cote=actifs.g===id?'g':actifs.d===id?'d':null;
 if(!cote){bout=bout==='g'?'d':'g';cote=bout;c.querySelector('.'+cote)?.remove();actifs[cote]=id;const p=el('div','perso entre '+cote,portrait(id,e));p.dataset.id=id;c.append(p)}
 else{const p=c.querySelector('.'+cote);p.innerHTML=portrait(id,e);p.classList.remove('hop');p.offsetWidth;if(e==='s')p.classList.add('hop')}
 c.querySelectorAll('.perso').forEach(p=>p.classList.toggle('actif',p.dataset.id===id))}
function eteins(){$('#cast').querySelectorAll('.perso').forEach(p=>p.classList.remove('actif'))}

/* --- Déroulé --- */
function tape(html,cb){const t=$('#txt');t.innerHTML=html;$('#suite').hidden=true;
 const w=document.createTreeWalker(t,NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);const cs=[];
 ns.forEach(nd=>{const fr=document.createDocumentFragment();for(const ch of nd.textContent.split(/(\s+)/)){if(!ch)continue;if(/^\s+$/.test(ch)){fr.append(ch);continue}const mot=el('span');mot.style.whiteSpace='nowrap';for(const c of ch){const s=el('span','c',c==='<'?'&lt;':c);cs.push(s);mot.append(s)}fr.append(mot)}nd.replaceWith(fr)});
 let i=0,to;const fin=()=>{clearInterval(to);cs.forEach(c=>c.classList.add('v'));tapeFin=null;$('#suite').hidden=false};
 if(calme||window.__rapide)return fin();to=setInterval(()=>{for(let k=0;k<2&&i<cs.length;k++)cs[i++].classList.add('v');if(i>=cs.length)fin()},20);tapeFin=fin}
function ligne(nom,couleur,txt,recit){const D=$('#dlg');D.hidden=false;const N=$('#nom');N.textContent=nom||'';N.style.setProperty('--c',couleur||'');$('#txt').className=recit?'recit':'';tape(txt);G.log.push([nom||'',txt]);if(G.log.length>400)G.log.shift();ajusteDlg()}
function ajusteDlg(){requestAnimationFrame(()=>document.documentElement.style.setProperty('--dlg',$('#dlg').offsetHeight+'px'))}
function suivant(){G.i++;joue()}
function joue(){sauve();const st=S[G.i];if(!st)return;attendre=null;
 if(st.bg){decor(st);$('#dlg').hidden=true;return suivant()}
 if(st.ch){$('#dlg').hidden=true;const c=$('#chap');c.hidden=false;c.innerHTML=`<small>${st.sur||''}</small><h2>${st.ch}</h2>${st.p?`<p>${st.p}</p>`:''}`;attendre=()=>{c.hidden=true;suivant()};return}
 if(st.n){eteins();ligne('','',st.n,true);attendre=suivant;return}
 if(st.s){poser(st.s,st.e);ligne(nomde(st.s),PERS[st.s].c,st.t,false);attendre=suivant;return}
 if(st.hud){$('#hud').hidden=false;return suivant()}
 if(st.clue){if(!G.clues.find(c=>c.id===st.clue.id))G.clues.push(st.clue);toast('Noté dans le carnet',st.clue.t);$('#bCarnet').classList.add('neuf');return suivant()}
 if(st.ans){G.ans[st.ans]=st.v;majQ();ding(true);return suivant()}
 $('#dlg').hidden=true;
 if(st.chat)return tel(st);
 if(st.video)return vuVideo();
 if(st.puzzle)return PUZ[st.puzzle]();
 if(st.search)return FOU[st.search]();
 if(st.strike)return barre(st);
 if(st.card)return CARTES[st.card]();
 if(st.fin)return ecranFin();
}
function avance(){if($('.mod')||!$('#carnet').hidden||!$('#lecteur').hidden)return;if(tapeFin)return tapeFin();if(attendre){ac&&ac.resume();const f=attendre;attendre=null;f()}}
let toTo;function toast(a,b){let t=$('#toast');clearTimeout(toTo);if(t){t.append(el('p','',b));t.getAnimations().forEach(x=>x.currentTime=500)}else{t=el('div','',`<small>${a}</small><p>${b}</p>`);t.id='toast';$('#app').append(t)}toTo=setTimeout(()=>t.remove(),4400)}
function majQ(){const Q={quand:'Quand',ou:'Où',qui:'Qui',pourquoi:'Pourquoi'};$('#quatre').innerHTML=Object.keys(Q).map(k=>`<div class="q ${G.ans[k]?'ok':''}">${Q[k]}<b>${G.ans[k]||'?'}</b></div>`).join('')}
function ouvre(f){$('#toast')?.remove();const o=$('#ov');o.hidden=false;o.innerHTML='';o.scrollTop=0;o.append(f)}
function ferme(){const o=$('#ov');o.hidden=true;o.innerHTML=''}
function bouton(t,fn,c='btn'){const b=el('button',c,t);b.type='button';b.onclick=e=>{e.stopPropagation();fn()};return b}

/* --- Téléphone --- */
function tel(st){const T=el('div','tel',`<header>${st.chat}<small>${st.h}</small></header><div class="fils" aria-live="polite"></div><footer>Touche pour lire la suite</footer>`);ouvre(T);
 let i=0;const F=T.querySelector('.fils');
 const pas=()=>{if(i>=st.l.length){ferme();return suivant()}const[w,x]=st.l[i++];const b=el('div','bul',`<small>${nomde(w)}</small>${x}`);b.style.setProperty('--c',PERS[w].c);F.append(b);F.scrollTop=F.scrollHeight;G.log.push([nomde(w),x]);son('message');
  if(i>=st.l.length)T.querySelector('footer').textContent='Touche pour continuer'};
 T.onclick=pas;pas();pas();pas()}

/* --- Vidéo --- */
function calques(k){const V=T.video?.[k]||{};if(V.fichier)return`<video src="${echap(V.fichier)}" playsinline preload="auto"></video>`;
 return imgTag(V.fond)+imgTag(V.gauche,'sil-a')+imgTag(V.droite,'sil-b')+imgTag(V.main,'mainj')}
function blocVideo(){const v=el('div','video',calques('nuit')+'<div class="osd">KN-01 · 01/01/2000</div><div class="osd b" id="tc">00:00 / 00:08</div>');let to;
 v.lance=()=>{clearInterval(to);v.classList.remove('joue');v.offsetWidth;v.classList.add('joue');const vid=v.querySelector('video');if(vid){vid.currentTime=0;vid.muted=!G.son;vid.play().catch(()=>{})}else chanson();let s=0;const tc=v.querySelector('#tc');tc.textContent='00:00 / 00:08';to=setInterval(()=>{s++;tc.textContent=`00:0${s} / 00:08`;if(s>=8)clearInterval(to)},window.__rapide?30:1000)};return v}
function feuille(sur,titre,recit){const f=el('div','feuille');f.innerHTML=`<div><div class="sur">${sur}</div><h2>${titre}</h2></div>`+(recit?`<p class="recitp">${recit}</p>`:'');return f}
function vuVideo(){const f=feuille('Album partagé « Anniv d’Ayaan »','Vidéo ajoutée par KN-01','Huit secondes, filmées presque au ras du sol. Monte le son : quelque chose se joue tout à la fin.');const v=blocVideo();f.append(v);
 const a=el('div','actions');let vu=false;const c=bouton('Continuer',()=>{ferme();suivant()});c.disabled=true;
 a.append(bouton('Lire la vidéo',()=>{v.lance();vu=true;setTimeout(()=>{c.disabled=false},window.__rapide?60:2500)}),c);f.append(a);ouvre(f)}

/* --- Aide commune aux énigmes --- */
function aide(f,lst){const b=el('div','indices'),z=el('div','indices');let k=0;const btn=bouton(`Demander un indice (${lst.length})`,()=>{z.append(el('p','',lst[k++]));G.hints++;sauve();if(k>=lst.length)btn.remove();else btn.textContent=`Indice suivant (${lst.length-k})`},'indice');btn.dataset.indice=1;b.append(z);f.append(b);return btn}
function retour(f){const m=el('p','fb');m.setAttribute('role','status');f.append(m);return(t,ok)=>{m.textContent=t;m.className='fb '+(ok?'ok':'non');ding(!!ok);if(!ok){f.animate&&!calme&&f.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:180})}}}
function reussi(f,dit,titre,txt){dit(titre,true);son('victoire');f.querySelectorAll('.actions').forEach(a=>a.remove());const a=el('div','actions');a.innerHTML=txt?`<p style="flex-basis:100%;line-height:1.5;background:var(--papier)">${txt}</p>`:'';a.append(bouton('Continuer',()=>{ferme();suivant()}));f.append(a);f.parentElement.scrollTop=f.parentElement.scrollHeight}

/* --- Saisie lettre par lettre (énigmes 2 et 5) --- */
function lettres(modele,chiffres,check){let act=0;const cases=[];const W=el('div','slots');
 modele.forEach((mot,mi)=>{const m=el('div','mot');[...mot].forEach((ch,ci)=>{if(ch==='’'){m.append(el('span','sl apos','’'));return}const b=el('button','sl',`<i>${chiffres?chiffres[mi][ci-0]:''}</i><b></b>`);b.type='button';b.setAttribute('aria-label','Case '+(cases.length+1));const idx=cases.length;b.onclick=()=>{act=idx;maj()};cases.push({b,v:'',n:chiffres?chiffres[mi][ci]:null});m.append(b)});W.append(m)});
 function maj(){cases.forEach((c,i)=>{c.b.querySelector('b').textContent=c.v;c.b.classList.toggle('act',i===act)})}
 function pose(l){const c=cases[act];c.v=l;if(c.n!=null)cases.forEach(o=>{if(o.n===c.n)o.v=l});act=Math.min(act+1,cases.length-1);maj();check&&check()}
 function efface(){const c=cases[act];if(c.v){c.v='';if(c.n!=null)cases.forEach(o=>{if(o.n===c.n)o.v=''})}else{act=Math.max(0,act-1);cases[act].v=''}maj()}
 const K=el('div','clavier');'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l=>{const b=el('button','',l);b.type='button';b.setAttribute('aria-label','Lettre '+l);b.onclick=()=>pose(l);K.append(b)});const E=bouton('Effacer',efface,'eff');K.append(E);
 const kb=e=>{if(!document.body.contains(W))return removeEventListener('keydown',kb);if(/^[a-zA-Z]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey){pose(e.key.toUpperCase());e.preventDefault()}if(e.key==='Backspace'){efface();e.preventDefault()}};addEventListener('keydown',kb);
 maj();return{W,K,val:()=>cases.map(c=>c.v).join(''),pose}}

/* --- Énigmes --- */
const PUZ={
 p1(){const f=feuille('Énigme 1','La dernière note');
  f.append(el('p','consigne','La playlist a démarré à 23 h 12. Les chansons se sont enchaînées sans pause, et après la dernière, la musique s’est arrêtée. À quelle heure exacte le baiser a-t-il eu lieu ?'));
  const T=el('div','table-doc');PLAYLIST.forEach((p,i)=>{const l=el('button','ligne',`<span>${i+1}</span><span>${p[0]}<small>${p[2]}</small></span><span class="d">${p[1]}</span>`);l.type='button';l.title='Cocher pendant que tu comptes';l.onclick=()=>l.classList.toggle('coche');T.append(l)});
  f.append(el('p','sur','Playlist « Ayaan a 25 ans et il est magnifique »'),T);const ec=el('div','actions');ec.append(bouton('▶ Écouter cette playlist',lecteur,'indice'));f.append(ec);
  let h=23,m=12;const C=el('div','horloge','<div class="cad"><div class="pm"><button type="button" data-a="h" aria-label="Changer l’heure">±</button></div><output id="oh">23</output></div><span class="sep">:</span><div class="cad"><div class="pm"><button type="button" data-a="-10">-10</button><button type="button" data-a="-1">-1</button><button type="button" data-a="1">+1</button><button type="button" data-a="10">+10</button></div><output id="om">12</output></div>');
  C.onclick=e=>{const a=e.target.dataset?.a;if(!a)return;if(a==='h')h=h===23?0:23;else m=(m+ +a+60)%60;C.querySelector('#oh').textContent=String(h).padStart(2,'0');C.querySelector('#om').textContent=String(m).padStart(2,'0')};f.append(C);
  const a=el('div','actions');const ind=aide(f,["Le baiser arrive juste après la toute dernière note. Il te faut donc la durée totale de la playlist.","Additionne d’abord les minutes, puis les secondes. Les secondes font plusieurs minutes de plus.","32 minutes + 120 secondes. Ajoute ce total à 23 h 12."]);
  const dit=retour(f);a.append(bouton('Vérifier l’heure',()=>{const v=h*60+m;
   if(h===23&&m===46)return reussi(f,dit,'23 h 46. La dernière note, puis le silence.',null);
   if(h===23&&m===44)return dit('Presque. Tu as compté les minutes, pas les secondes.');
   if(h===23&&m===42)return dit('C’est l’heure où la dernière chanson commence, pas celle où elle finit.');
   dit('Ce n’est pas cette heure-là. Le total des sept durées te donnera la réponse.')}),ind);f.append(a);ouvre(f)},
 p2(){const f=feuille('Énigme 2','Le mot dans l’imperméable','Personne ne reconnaît ces chiffres, soi-disant.');
  f.append(el('p','consigne','Chaque nombre cache une lettre et chaque barre sépare deux mots. Déchiffre le message. Coup de pouce : A = 1, B = 2, C = 3…'));
  const ms=['LE','CHATON','A','FAIM','ESCALIER','C'],nb=[[12,5],[3,8,1,20,15,14],[1],[6,1,9,13],[5,19,3,1,12,9,5,18],[3]];
  const dit0={f:null};const L=lettres(ms,nb,()=>{if(L&&L.val().length===ms.join('').length)verif()});f.append(L.W,L.K);
  const ind=aide(f,["Commence par le mot d’une seule lettre : 1.","12 = L et 5 = E. Quand tu trouves une lettre, elle se remplit partout où son nombre revient.","Le deuxième mot est un petit animal. Il a très faim."]);
  const dit=retour(f);function verif(){L.val()===ms.join('')?reussi(f,dit,'LE CHATON A FAIM. ESCALIER C.','Quelqu’un a donné rendez-vous à quelqu’un d’autre, avec une phrase codée.'):dit('Ce message ne veut encore rien dire. Vérifie les lettres.')}
  const a=el('div','actions');a.append(bouton('Vérifier le message',verif),ind);f.append(a);ouvre(f)},
 p3(){const f=feuille('Énigme 3','Six alibis pour une seule vérité');
  f.append(el('p','consigne','Choisis un suspect, écoute sa déclaration, puis présente la preuve qui la confirme ou la démolit.'));
  const ids=Object.keys(ALIBIS),fait={};let cur=ids[0];const bar=el('div','susp-bar'),dec=el('div'),pv=el('div','preuves');f.append(bar,dec,pv);
  const ind=aide(f,["Commence par ceux qui étaient sur le balcon : deux sources extérieures les confirment.","L’alerte du cuiseur montre que quelqu’un n’a pas surveillé son riz.","Rayn et Tinn revendiquent la même pièce, seuls. Le plan règle la question. Et Sarawin dit l’inverse de Tinn."]);
  const dit=retour(f);const a=el('div','actions');a.append(ind);f.append(a);
  function rend(){bar.innerHTML='';ids.forEach(id=>{const b=el('button','mini'+(id===cur?' sel':'')+(fait[id]?(ALIBIS[id][2]==='c'?' fait':' fait non-ok'):''),portrait(id,'n')+nomde(id));b.type='button';b.onclick=()=>{cur=id;dit0();rend()};bar.append(b)});
   const A=ALIBIS[cur];dec.className='decl';dec.innerHTML=portrait(cur,fait[cur]?(A[2]==='c'?'h':'s'):'n')+`<div><b>${nomde(cur)}</b><br><q>${A[0]}</q>${fait[cur]?`<p style="margin-top:6px">${A[3]}</p>`:''}</div>`+(fait[cur]?`<span class="stamp ${A[2]}">${A[2]==='c'?'CONFIRMÉ':'DÉMENTI'}</span>`:'');
   pv.innerHTML='';Object.entries(PREUVES).forEach(([k,p])=>{const b=el('button','preuve',`<b>${p[0]}</b>${p[1]}`);b.type='button';b.disabled=!!fait[cur];b.onclick=()=>{if(A[1].includes(k)){fait[cur]=1;ding(true);const nx=ids.find(i=>!fait[i]);if(nx){dit(A[3],true)}rend();if(!nx)phase2()}else dit(`Cette preuve ne dit rien de décisif sur ${nomde(cur)}.`)};pv.append(b)})}
  function dit0(){const m=f.querySelector('.fb');if(m)m.textContent=''}
  function phase2(){[bar,pv].forEach(e=>e.remove());dec.remove();a.remove();const sel=new Set(),G6=el('div','choix-six');f.querySelector('.consigne').textContent='Toutes les déclarations sont passées au crible. Qui a un alibi prouvé ? Sélectionne les innocents.';
   ids.forEach(id=>{const b=el('button','six',portrait(id,'n')+nomde(id));b.type='button';b.dataset.id=id;b.onclick=()=>{sel.has(id)?sel.delete(id):sel.add(id);b.classList.toggle('ch')};G6.append(b)});
   f.querySelector('.consigne').after(G6);const c=el('div','actions');c.append(bouton('Innocenter',()=>{const ok=sel.size===2&&sel.has('ayaan')&&sel.has('vega');ok?reussi(f,dit,'Ayaan et Vega sont hors de cause.','Il reste quatre suspects : Kinnat, Rayn, Sarawin et Tinn. Sarawin et Tinn deviennent très suspects : ils sont partis ensemble, et leurs versions sont incompatibles.'):dit('Seuls ceux dont la déclaration a été confirmée sont innocentés.')}));f.append(c)}
  rend();ouvre(f)},
 p4(){const f=feuille('Énigme 4','Les messages effacés');f.append(el('p','consigne','Remets les six messages dans l’ordre. Touche un message pour l’ajouter au fil, touche-le dans le fil pour le retirer.'));
  const fil=el('div','fil'),pile=el('div','pile');let ord=[];const rest=()=>'ABCDEF'.split('').filter(k=>!ord.includes(k)).sort((a,b)=>'DACFEB'.indexOf(a)-'DACFEB'.indexOf(b));
  const bul=k=>{const b=el('button','bul'+(MSG[k][0]==='sarawin'?' moi':''),`<small>${nomde(MSG[k][0])}</small>${MSG[k][1]}`);b.type='button';b.dataset.m=k;return b};
  function rend(){fil.innerHTML=ord.length?'':'<p class="vide">Le fil reconstitué apparaîtra ici.</p>';ord.forEach(k=>{const b=bul(k);b.onclick=()=>{ord=ord.filter(x=>x!==k);rend()};fil.append(b)});pile.innerHTML='';rest().forEach(k=>{const b=bul(k);b.onclick=()=>{ord.push(k);rend()};pile.append(b)})}
  f.append(fil,pile);const ind=aide(f,["Une conversation commence par une demande de parler.","Avant de répondre « Prends-le », Sarawin a dû apprendre qu’il ne restait qu’un seul modèle.","Le premier message est « Il faut que je te parle ». Tinn avoue ce qu’il a fait juste après la question de Sarawin."]);
  const dit=retour(f);const a=el('div','actions');a.append(bouton('Vérifier l’ordre',()=>{if(ord.length<6)return dit('Il manque encore des messages dans le fil.');const bon='CEADFB';const nb=ord.filter((k,i)=>bon[i]===k).length;nb===6?reussi(f,dit,'Le fil se lit enfin. Ils parlent d’un gâteau.','Tinn s’est assis sur le gâteau d’anniversaire d’Ayaan, et ils sont partis en remplacer un.'):dit(`${nb} message${nb>1?'s':''} sur 6 à la bonne place.`)}),ind);f.append(a);rend();ouvre(f)},
 p4b(){const f=feuille('Énigme 4, suite','Sarawin et Tinn ont-ils pu être dans l’escalier ?');
  const T=el('div','table-doc');[['Ticket de supérette, Soi 24','1 gâteau pandan, 1 bougie, 2 croque-monsieur. Paiement à 23 h 44.'],['Selfie à la caisse','Daté de 23 h 45 sur le téléphone.'],['Application de cartes','Le magasin est à 12 minutes à pied de la résidence.']].forEach(l=>T.append(el('div','ligne',`<span></span><span><b>${l[0]}</b><small>${l[1]}</small></span><span></span>`)));f.append(T);
  f.append(el('p','consigne','Le selfie prouve qu’ils étaient encore en caisse à 23 h 45. À quelle heure, au plus tôt, ont-ils pu revenir ?'));
  const P=el('div','preuves');const ind=aide(f,["Pars de l’heure la plus tardive où on les voit au magasin.","23 h 45 + 12 minutes."]);const dit=retour(f);
  ['23 h 46','23 h 56','23 h 57','00 h 00'].forEach(v=>{const b=el('button','preuve',`<b>${v}</b>`);b.type='button';b.onclick=()=>{v==='23 h 57'?reussi(f,dit,'23 h 57. Onze minutes trop tard pour un baiser.','Sarawin et Tinn sont innocents. Le couple qu’ils semblaient former n’existe pas, du moins pas ce soir-là.'):dit(v==='23 h 56'?'Le selfie est plus tardif que le ticket. Pars de 23 h 45.':'Reprends l’heure du selfie et ajoute le trajet.')};P.append(b)});
  f.querySelector('.consigne').after(P);const a=el('div','actions');a.append(ind);f.append(a);ouvre(f)},
 p5(){const f=feuille('Énigme 5','Sept avertissements','Ces post-its disent une chose à voix haute et une autre à voix basse.');
  f.append(el('p','consigne','Lis-les de haut en bas, autrement. Touche les lettres qui comptent, ou utilise le clavier. Quel message Kinnat cache-t-il ?'));
  const Fr=el('div','frigo');const L=lettres(['JE','T’AIME'],null,()=>{if(L.val().length===7)verif()});
  POSTITS.forEach((t,i)=>{const p=el('div','pi');p.innerHTML=`<sup>${i+1}</sup>`;[...t].forEach(c=>{if(/[A-Za-zÀ-ÿ]/.test(c)){const s=el('span','l',c);s.onclick=()=>{s.classList.add('ch');L.pose(c.toUpperCase().normalize('NFD')[0])};p.append(s)}else p.append(c)});Fr.append(p)});
  f.append(Fr,L.W,L.K);const ind=aide(f,["Ne lis pas les phrases. Regarde comment elles commencent.","Prends la toute première lettre de chaque post-it, du n° 1 au n° 7.","J, E, T… Quelqu’un écrit à son colocataire depuis des mois."]);
  const dit=retour(f);function verif(){L.val()==='JETAIME'?reussi(f,dit,'JE T’AIME.','Kinnat déclare son amour à Rayn sur le frigo depuis des mois. Et le post-it n° 7 apporte la dernière preuve : le parapluie gris de la vidéo est celui de Kinnat, dans le sac de Rayn.'):dit('Ces lettres ne forment pas encore un message.')}
  const a=el('div','actions');a.append(bouton('Lire le message',verif),ind);f.append(a);ouvre(f)},
 acc(){const f=feuille('Accusation finale','Qui étaient les deux silhouettes ?');f.append(el('p','consigne','Désigne les deux garçons de l’escalier C.'));
  const sel=new Set(),pr=new Set(),G6=el('div','choix-six');Object.keys(PERS).forEach(id=>{const b=el('button','six',portrait(id,'n')+nomde(id));b.type='button';b.dataset.id=id;b.onclick=()=>{sel.has(id)?sel.delete(id):sel.add(id);b.classList.toggle('ch')};G6.append(b)});f.append(G6,el('p','consigne','Puis donne au moins deux preuves.'));
  const P=el('div','preuves');ACC.forEach(([k,t])=>{const b=el('button','preuve',t);b.type='button';b.dataset.p=k;b.onclick=()=>{pr.has(k)?pr.delete(k):pr.add(k);b.classList.toggle('ch')};P.append(b)});f.append(P);
  const dit=retour(f);const a=el('div','actions');a.append(bouton('Accuser',()=>{if(sel.size!==2)return dit('Désigne exactement deux garçons.');if(!(sel.has('kinnat')&&sel.has('rayn')))return dit('Ton carnet dit le contraire. Regarde les prénoms que tu as barrés.');if(pr.size<2)return dit('Le groupe veut au moins deux preuves.');if(ACC.some(x=>pr.has(x[0])&&!x[2]))return dit('L’une de ces preuves concerne quelqu’un d’autre. Retire-la.');ding(true);ferme();suivant()}));f.append(a);ouvre(f)}
};

/* --- Fouilles --- */
function sceneFouille(k){const F=T.fouilles?.[k]||{zones:{}};const c=el('div','cadre',imgTag(F.image));
 Object.entries(F.zones||{}).forEach(([n,z])=>{const s=el('span','spot','<span class="halo"></span>');s.dataset.s=n;s.tabIndex=0;s.setAttribute('role','button');s.setAttribute('aria-label','Fouiller : '+n);Object.assign(s.style,{left:z.x+'%',top:z.y+'%',width:z.l+'%',height:z.h+'%'});c.append(s)});return c}
function fouille(titre,rec,k,objs,fin){const f=feuille('Fouille',titre,rec);const w=el('div','fouille'),tr=el('div','trouve');w.append(sceneFouille(k));f.append(w,tr);
 const a=el('div','actions'),c=bouton('Continuer',()=>{ferme();suivant()});let vus=0;
 w.querySelectorAll('.spot').forEach(s=>{const go=()=>{if(s.classList.contains('vu'))return;s.classList.add('vu');const o=objs[s.dataset.s];tr.append(el('div','',o[0]));son('fouille');vus+=o[1]?1:0;if(vus>=fin){a.append(c);f.append(a);ding(true);f.parentElement.scrollTop=f.parentElement.scrollHeight}};s.onclick=go;s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();go()}}});ouvre(f)}
const FOU={
 manteau(){fouille('L’imperméable jaune','Touche les poches pour les fouiller.','manteau',{gauche:['Un chewing-gum antique. Il a survécu à plusieurs saisons des pluies.',0],droite:['Trois tickets de bus, trop délavés pour dire quoi que ce soit.',0],interieur:['<b>Un petit papier plié en quatre.</b> Des nombres séparés par des barres : 12-5 / 3-8-1-20-15-14 / 1 / 6-1-9-13 / 5-19-3-1-12-9-5-18 / 3',1]},1)},
 marches(){fouille('L’escalier C','La pluie tombe juste au bord des marches. Regarde bien en bas.','marches',{seau:['Un seau de ménage. Rien dedans, à part de la pluie.',0],carton:['Un carton garni d’une vieille serviette, posé à l’abri. Il y a des poils blancs dessus.',0],gamelle:['<b>Le petit objet bleu de la vidéo.</b> Une gamelle pour chat, parfaitement propre.',1]},1)}
};

/* --- Barrer des prénoms --- */
function barre(st){const f=feuille('Ton carnet','Deux prénoms à barrer',st.x);const L=el('div','conf');f.append(L);ouvre(f);
 Object.keys(PERS).forEach(id=>{const dej=G.struck.includes(id);L.append(nomSus(id,dej))});
 setTimeout(()=>{st.strike.forEach(id=>{if(!G.struck.includes(id))G.struck.push(id);L.querySelector(`[data-sus=${id}]`).classList.add('barre')});son('trait')},450);
 const a=el('div','actions');a.append(bouton('Continuer',()=>{ferme();suivant()}));f.append(a)}
function nomSus(id,b){const e=el('div','nomsus'+(b?' barre':''),portrait(id,b?'n':'n')+`<span><b>${nomde(id)}</b><small>${PERS[id].info}</small></span>`);e.dataset.sus=id;return e}

/* --- Cartes de la révélation --- */
function carte(sur,t,corps,lab='Continuer',cb){const f=feuille(sur,t);f.append(corps);const a=el('div','actions');a.append(bouton(lab,()=>{ferme();cb?cb():suivant()}));f.append(a);ouvre(f);return f}
const CARTES={
 bilan(){const T=el('div','tab-ind');BILAN.forEach(b=>T.append(el('div','',`<b>${b[0]}</b><span>${b[1]}</span>`)));carte('Tous les indices réunis','Tout s’emboîte',T)},
 chaton(){const b=el('div','conf');b.append(el('div','art',imgTag(T.illustrations?.chaton)),el('p','recitp','« Je vous présente Khao Niao. » <span lang="th">ข้าวเหนียว</span>, le riz gluant.'));carte('Sur le téléphone de Rayn','KN-01',b)},
 carnet(){const b=el('div','art',imgTag(T.illustrations?.carnet));carte('Le carnet d’Ayaan','Première page',b)},
 baiser(){decorBaiser()},
 billets(){const b=el('div','conf');const D=el('div','bil');for(let i=0;i<13;i++){const s=el('span','',`Billet ${i+1}<br>Bangkok<br>Chiang Mai`);s.style.animationDelay=i*70+'ms';D.append(s)}b.append(el('p','recitp','Treize billets de train de nuit, un vendredi sur deux, de janvier à juin.'),D);carte('L’enveloppe de Kinnat','Une pièce au dossier',b)},
 huit(){const b=el('div','conf');b.append(el('div','bignote','Avertissement n° 8 :<br>Recommence.'));carte('Sur le front de Rayn','Le dernier post-it',b)}
};
function decorBaiser(){$('#cast').innerHTML='';actifs={g:null,d:null};const o=el('div','baiser');
 const v=el('div','video joue',calques('baiser'));const p=el('p','','La musique s’est arrêtée. Il n’est plus resté que la pluie.');o.append(v,p);$('#app').append(o);
 const vid=v.querySelector('video');if(vid){vid.muted=!G.son;vid.play().catch(()=>{})}
 rainV=.5;volPluie();chanson();
 const ph=["Kinnat a posé sa main sur la joue de Rayn, avec la prudence de quelqu’un qui touche enfin une chose qu’il s’est interdite pendant des mois.","Et il l’a embrassé."];let i=0;o.dataset.baiser=1;
 o.onclick=e=>{e.stopPropagation();if(i<ph.length){p.textContent=ph[i++];if(i===2)p.classList.add('fort')}else{o.remove();suivant()}}}

/* --- Fin --- */
function ecranFin(){const h=G.hints,m=h===0?'Aucun indice demandé. Sarawin l’avait vu : tu l’as su avant tout le monde.':h<4?`${h} indice${h>1?'s':''} demandé${h>1?'s':''}. Le Club des Six garde ton numéro pour ses prochaines catastrophes.`:`${h} indices demandés. Ayaan garde ton nom dans son carnet : dernier pari gagné.`;
 videCast();$('#dlg').hidden=true;const z=$('#fin');z.hidden=false;z.innerHTML=`<p class="sur" style="color:var(--rose)">Affaire classée</p><h2>Tu le savais.</h2><p>${m}</p>`;const b=bouton('Rejouer l’enquête',()=>demande('Recommencer l’enquête depuis le début ?',reset));z.append(b);son('victoire');sauve()}

/* --- Carnet --- */
let onglet='sus';
function carnet(){const C=$('#carnet');C.hidden=false;$('#bCarnet').classList.remove('neuf');rendC()}
function rendC(){document.querySelectorAll('.onglets button').forEach(b=>b.setAttribute('aria-selected',b.dataset.o===onglet));const c=$('#cc');c.innerHTML='';
 if(onglet==='sus'){c.append(el('p','jl','Touche un prénom pour le barrer ou le rétablir.'));Object.keys(PERS).forEach(id=>{const e=el('button','nomsus'+(G.struck.includes(id)?' barre':''),portrait(id,'n')+`<span><b>${nomde(id)}</b><small>${PERS[id].info}</small></span>`);e.type='button';e.onclick=()=>{G.struck=G.struck.includes(id)?G.struck.filter(x=>x!==id):[...G.struck,id];sauve();rendC()};c.append(e)})}
 if(onglet==='ind'){if(!G.clues.length)c.append(el('p','jl','Aucun indice pour le moment.'));G.clues.forEach(k=>{const e=el('div','ind',`<b>${k.t}</b>${k.x}`);if(k.id==='video'){const v=blocVideo();e.append(v,bouton('Revoir la vidéo',()=>v.lance(),'indice'))}c.append(e)})}
 if(onglet==='log'){G.log.slice(-120).forEach(l=>c.append(el('p','jl',(l[0]?`<b>${l[0]} :</b> `:'')+l[1])));requestAnimationFrame(()=>c.scrollTop=c.scrollHeight)}}
function demande(q,oui){const m=el('div','mod',`<div><p>${q}</p><div class="actions" id="mact"></div></div>`);$('#app').append(m);m.querySelector('#mact').append(bouton('Oui',()=>{m.remove();oui()}),bouton('Non',()=>m.remove(),'btn sec'))}
function reset(){try{localStorage.removeItem(CLE)}catch(e){}const son=G.son;G=neuf();G.son=son;bgCour=null;$('#fin').hidden=true;ferme();document.querySelectorAll('[data-baiser]').forEach(e=>e.remove());$('#hud').hidden=true;$('#dlg').hidden=true;videCast();accueil()}
function majSon(){const B=$('#bSon');B.innerHTML=(G.son?'♪':'♪̸')+`<span>${G.son?'Son : oui':'Son : non'}</span>`;B.setAttribute('aria-label',G.son?'Couper le son':'Activer le son');$('#bSon2')&&($('#bSon2').textContent=G.son?'Son activé':'Son coupé')}
function bascSon(){G.son=!G.son;if(G.son)initSon();else lectPause();volPluie();volFond();if(!G.son&&chansonA)chansonA.a.pause();majSon();sauve()}

/* --- Écran titre --- */
function accueil(){const r=charge();decor({bg:'ville',rain:.75});const Tt=$('#titre');Tt.hidden=false;
 Tt.innerHTML=`<div class="tcol"><div class="tampon">Dossier ouvert, heure du baiser inconnue</div><h1>Qui a embrassé <em>qui ?</em></h1><p class="st">L’affaire de l’escalier C</p>
 <p class="res">Six amis, une soirée d’anniversaire à Bangkok, et une vidéo de huit secondes que personne n’aurait dû voir. Tout le monde ment. Toi seul·e peux démêler l’affaire.</p>
 <div class="rangee" id="tb"></div><p class="meta">Enquête narrative · 5 énigmes · 20 à 30 minutes · Mets le son si tu peux</p></div>`;
 const b=$('#tb');const go=(sv)=>{Tt.hidden=true;initSon();ac&&ac.resume();if(sv){G=sv;majQ();$('#hud').hidden=!S.slice(0,G.i).some(s=>s.hud);const prev=[...S.slice(0,G.i+1)].reverse().find(s=>s.bg);if(prev)decor(prev);majSon();joue()}else{const so=G.son;G=neuf();G.son=so;majQ();joue()}};
 if(r)b.append(bouton('Reprendre l’enquête',()=>go(r)));b.append(bouton(r?'Nouvelle enquête':'Ouvrir l’enquête',()=>r?demande('Effacer ta partie en cours ?',()=>{try{localStorage.removeItem(CLE)}catch(e){}go(null)}):go(null),r?'btn sec':'btn'));
 const s=bouton('',bascSon,'btn sec');s.id='bSon2';b.append(s,boutonPlaylist('btn sec'));majSon()}

function start(data){
 $('#app').innerHTML=`<div id="scene2"></div><div id="scene"></div><div id="vignette"></div><div id="cast"></div><canvas id="rain" aria-hidden="true"></canvas>
 <div id="dlg" hidden role="button" tabindex="0" aria-label="Continuer"><div id="nom"></div><p id="txt" aria-live="polite"></p><span id="suite" hidden>Continuer ▸</span></div>
 <div id="ov" hidden></div><div id="chap" hidden></div>
 <div id="hud" hidden><button class="hbtn" id="bCarnet" type="button">Carnet</button><div id="quatre"></div><span id="hPl"></span><button class="hbtn" id="bSon" type="button">Son</button><button class="hbtn" id="bMenu" type="button" aria-label="Menu">Menu</button></div>
 <aside id="carnet" hidden aria-label="Carnet du détective"><header><h2>Mon carnet</h2><button class="indice" id="cF" type="button">Fermer</button></header><div class="onglets"><button type="button" data-o="sus">Suspects</button><button type="button" data-o="ind">Indices</button><button type="button" data-o="log">Répliques</button></div><div id="cc"></div></aside>
 <div id="titre" hidden></div><div id="fin" hidden></div>`;
 Object.keys(PERS).forEach(id=>{PERS[id].c=T.personnages?.[id]?.couleur||'#f8a8c6'});precharge();
 pluie();majQ();lectInstaller();$('#hPl').replaceWith(boutonPlaylist('hbtn'));
 $('#dlg').onclick=avance;$('#chap').onclick=avance;$('#scene').onclick=avance;
 addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&e.target.tagName!=='BUTTON'&&!e.target.classList?.contains('spot')){const zz=$('.tel')||$('[data-baiser]');if(zz&&$('#carnet').hidden){e.preventDefault();return zz.click()}if(!$('#ov').hidden||!$('#titre').hidden)return;e.preventDefault();avance()}if(e.key==='Escape'){$('#carnet').hidden=true}});
 $('#bCarnet').onclick=carnet;$('#cF').onclick=()=>$('#carnet').hidden=true;$('#bSon').onclick=bascSon;
 $('#bMenu').onclick=()=>demande('Revenir à l’écran titre ? Ta partie reste enregistrée dans ce navigateur.',()=>{sauve();ferme();document.querySelectorAll('[data-baiser]').forEach(e=>e.remove());$('#hud').hidden=true;$('#dlg').hidden=true;$('#chap').hidden=true;videCast();bgCour=null;accueil()});
 document.querySelectorAll('.onglets button').forEach(b=>b.onclick=()=>{onglet=b.dataset.o;rendC()});
 addEventListener('resize',ajusteDlg);
 if(data&&data.G)G=data.G;
 accueil()}
try{window.claude?.hot?.snapshot?.(()=>({G}))}catch(e){}
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
