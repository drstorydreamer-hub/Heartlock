// Vérifie le lecteur de la playlist : détection des fichiers, lecture, piste suivante, pause de la musique de fond.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const RACINE=path.join(__dirname,'..');const TYPES={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.mp3':'audio/mpeg','.jpg':'image/jpeg'};
(async()=>{
const srv=http.createServer((q,r)=>{const f=path.join(RACINE,decodeURIComponent(q.url.split('?')[0]).replace(/\/$/,'/index.html'));
 if(!f.startsWith(RACINE)||!fs.existsSync(f)){r.statusCode=404;return r.end()}
 const st=fs.statSync(f),t=TYPES[path.extname(f)]||'application/octet-stream',rg=q.headers.range;
 if(rg){const[a,b]=rg.replace('bytes=','').split('-');const s=+a,e=b?+b:st.size-1;r.writeHead(206,{'content-type':t,'content-range':`bytes ${s}-${e}/${st.size}`,'accept-ranges':'bytes','content-length':e-s+1});return fs.createReadStream(f,{start:s,end:e}).pipe(r)}
 r.writeHead(200,{'content-type':t,'content-length':st.size,'accept-ranges':'bytes'});fs.createReadStream(f).pipe(r)}).listen(0);
const out=process.env.CAPTURES||path.join(__dirname,'captures')+'/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});let ok=true;
for(const [nom,vp] of [['pc',{width:1280,height:760}],['tel',{width:390,height:780}]]){
 const p=await b.newPage({viewport:vp});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route(/fonts\./,r=>r.abort());await p.goto('http://127.0.0.1:'+srv.address().port+'/');
 await p.click('#tb .btn');await p.waitForTimeout(800);
 await p.click('#tb .bPlaylist').catch(async()=>{await p.evaluate(()=>lecteur())});
 await p.waitForFunction(()=>LECT.pistes.length>=7&&LECT.pistes.every(x=>x.ok!==null),null,{timeout:20000});await p.waitForTimeout(1500);
 const r1=await p.evaluate(()=>LECT.pistes.map(x=>[x.n,x.titre,x.ok,Math.round(x.duree||0)]));
 await p.click('#lpPlay');await p.waitForTimeout(1200);
 const r2=await p.evaluate(()=>({joue:lectJoue(),t:+LECT.a.currentTime.toFixed(1),fondPause:fondA?fondA.a.paused:'pas de fond',titre:$('#lpTitre').textContent}));
 await p.screenshot({path:out+nom+'-lecteur.png'});
 await p.click('#lpNext');await p.waitForTimeout(800);
 const r3=await p.evaluate(()=>({i:LECT.i,titre:$('#lpTitre').textContent,joue:lectJoue()}));
 await p.click('#lpPlay');await p.waitForTimeout(600);
 const r4=await p.evaluate(()=>({joue:lectJoue(),fondPause:fondA?fondA.a.paused:null}));
 console.log(nom,JSON.stringify({pistes:r1.length,liste:r1,lecture:r2,suivante:r3,pause:r4}),errs);
 ok=ok&&r1.length>=7&&r1.slice(0,7).every(x=>x[2])&&r2.joue&&r2.fondPause===true&&r3.i===1&&!r4.joue&&r4.fondPause===false&&!errs.length;
 await p.close()}
await b.close();srv.close();console.log(ok?'PLAYLIST OK':'PLAYLIST ÉCHEC');process.exit(ok?0:1)})();
