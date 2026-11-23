const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const RACINE=path.join(__dirname,'..');const TYPES={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.mp3':'audio/mpeg','.jpg':'image/jpeg','.png':'image/png'};
(async()=>{
const manquants=[];
const srv=http.createServer((q,r)=>{const f=path.join(RACINE,decodeURIComponent(q.url.split('?')[0]).replace(/\/$/,'/index.html'));
 if(!f.startsWith(RACINE)||!fs.existsSync(f)){manquants.push(q.url);r.statusCode=404;return r.end()}
 r.setHeader('content-type',TYPES[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)}).listen(0);
const URL_JEU='http://127.0.0.1:'+srv.address().port+'/';
const b=await chromium.launch();
const out=process.env.CAPTURES||path.join(__dirname,'captures')+'/';fs.mkdirSync(out,{recursive:true});
for(const [nom,vp] of [['pc',{width:1280,height:760}],['tel',{width:390,height:780}]]){
 const c=await b.newContext({viewport:vp,hasTouch:nom=='tel'});
 const p=await c.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{window.__rapide=true});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto(URL_JEU);
 await p.waitForTimeout(300);
 const shot=async n=>{await p.waitForTimeout(250);await p.screenshot({path:out+nom+'-'+n+'.png'})};
 await shot('titre');
 await p.click('#tb .btn');
 const shots=new Set();let steps=0;
 const wantShot={ };
 const solve=async()=>{
  const t=await p.evaluate(()=>{const h=document.querySelector('#ov .feuille h2');return h?h.textContent:null});
  return t};
 const clickT=async(txt)=>{await p.getByRole('button',{name:txt,exact:true}).first().click()};
 while(steps++<900){
  const st=await p.evaluate(()=>{const q=s=>document.querySelector(s);
   return {i:G.i,type:Object.keys(S[G.i]||{})[0],pz:S[G.i]?.puzzle,se:S[G.i]?.search,ov:!q('#ov').hidden,chap:!q('#chap').hidden,fin:!q('#fin').hidden,bai:!!q('[data-baiser]'),dlg:!q('#dlg').hidden}});
  const w=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(w)errs.push('overflow '+st.i);
  if(st.fin){await shot('fin');break}
  if(st.bai){if(!shots.has('b')){shots.add('b');await p.waitForTimeout(2600);await shot('baiser')}await p.click('[data-baiser]');continue}
  if(st.chap){if(!shots.has('c')){shots.add('c');await shot('chapitre')}await p.click('#chap');continue}
  if(st.ov){
   if(st.pz=='p1'){await p.locator('[data-indice]').click();await clickT('Vérifier l’heure');const w1=await p.locator('.fb').textContent();if(!w1)errs.push('p1 fb');await shot('p1');for(let i=0;i<3;i++)await p.click('[data-a="10"]');await p.click('[data-a="1"]');await p.click('[data-a="1"]');await p.click('[data-a="1"]');await p.click('[data-a="1"]');await clickT('Vérifier l’heure');await p.waitForTimeout(100);await shot('p1ok');await clickT('Continuer');continue}
   if(st.pz=='p2'){await shot('p2');for(const l of 'LECHATONAFAIMESCALIERC'){await p.keyboard.press(l.toLowerCase());}
     await p.waitForTimeout(100);await shot('p2ok');
     const ok=await p.evaluate(()=>document.querySelector('.fb').className);if(!ok.includes('ok'))errs.push('p2 '+ok);await clickT('Continuer');continue}
   if(st.pz=='p3'){await shot('p3');const M={ayaan:'La vidéo du balcon',vega:'Le mot de Mme Somchai',kinnat:'L’application du cuiseur à riz',rayn:'Le plan de l’appartement',sarawin:'Les récits de Sarawin et de Tinn',tinn:'Le plan de l’appartement'};
     let i=0;for(const k of Object.keys(M)){await p.locator('.mini').nth(i++).click();await p.locator('.preuve',{hasText:M[k]}).first().click();if(i==3)await shot('p3b')}
     await p.locator('.six[data-id=ayaan]').click();await p.locator('.six[data-id=vega]').click();await shot('p3c');await clickT('Innocenter');await clickT('Continuer');continue}
   if(st.pz=='p4'){await shot('p4');for(const k of 'CEADFB')await p.locator(`.pile [data-m=${k}]`).click();await clickT('Vérifier l’ordre');await shot('p4ok');await clickT('Continuer');continue}
   if(st.pz=='p4b'){await shot('p4b');await p.locator('.preuve',{hasText:'23 h 57'}).click();await clickT('Continuer');continue}
   if(st.pz=='p5'){await shot('p5');for(let i=0;i<7;i++){await p.locator('.pi').nth(i).locator('.l').first().click()}await p.waitForTimeout(100);await shot('p5ok');await clickT('Continuer');continue}
   if(st.pz=='acc'){await shot('acc');await p.locator('.six[data-id=kinnat]').click();await p.locator('.six[data-id=rayn]').click();await p.locator('[data-p=parapluie]').click();await p.locator('[data-p=frigo]').click();await clickT('Accuser');continue}
   if(st.se){await p.waitForFunction(()=>{const i=document.querySelector('.fouille img');return i&&i.complete&&i.naturalWidth>0});await shot('s-'+st.se);for(const s of await p.locator('.spot').all())await s.click({force:true});await shot('s2-'+st.se);await clickT('Continuer');continue}
   if(S_vid=await p.locator('.tel').count()){if(!shots.has('t')){shots.add('t');await shot('tel')}await p.click('.tel');continue}
   if(await p.locator('.video').count()&&await p.getByRole('button',{name:'Lire la vidéo'}).count()){await clickT('Lire la vidéo');await p.waitForTimeout(150);await shot('video');await clickT('Continuer');continue}
   await shot('carte'+st.i);await clickT('Continuer');continue}
  if(st.dlg){if(st.i==60&&!shots.has('r')){shots.add('r');await p.click('#bCarnet');await p.locator('.onglets button').nth(1).click();await shot('carnet');await p.click('#cF');const av=await p.evaluate(()=>G.i);await p.evaluate(()=>{window.__rapide=true});}if([6,7,17].includes(st.i)||st.i==60||st.i==190)await shot('dlg'+st.i);await p.click('#dlg');continue}
  await p.waitForTimeout(50);
 }
 if(nom=='pc'){}
 await shot('final');
 const casses=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));if(casses.length)errs.push('images cassées '+casses);
 console.log(nom,'étapes',steps,'erreurs',errs.slice(0,8));
 await p.close();
}
await b.close();srv.close();
if(manquants.length)console.log('Fichiers introuvables :',[...new Set(manquants)]);})();
var S_vid;
