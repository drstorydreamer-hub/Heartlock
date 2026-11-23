/* ---------- Illustrations : tout est dessiné en SVG, rien n'est chargé de l'extérieur ---------- */
function prng(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
const svgS=(w,h,c,pa='xMidYMid slice')=>`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${pa}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c}</svg>`;

const PERS={
 kinnat:{nom:'Kinnat',c:'#9fd3e6',peau:'#e9c19b',ch:'#141a26',iris:'#3a2a20',info:'Stagiaire avocat, maniaque, sarcastique.'},
 rayn:{nom:'Rayn',c:'#f4c430',peau:'#d9a273',ch:'#5a3320',iris:'#4a2a14',info:'Solaire, bavard, gaffeur. Oublie toujours son parapluie.'},
 vega:{nom:'Vega',c:'#c3b4e8',peau:'#e5bb93',ch:'#1b1c33',iris:'#2b2438',info:'Ténébreux. Parle de sa vie comme d’une tragédie.'},
 ayaan:{nom:'Ayaan',c:'#f3a6a2',peau:'#c48a5c',ch:'#20130f',iris:'#2e1a0e',info:'La star de la fête. Possède un micro-jouet et s’en sert.'},
 sarawin:{nom:'Sarawin',c:'#86b86b',peau:'#dcae83',ch:'#10161c',iris:'#201a16',info:'Guitariste. Trois mots par heure, un sourcil.'},
 tinn:{nom:'Tinn',c:'#f2b77a',peau:'#efcba6',ch:'#7a4a2b',iris:'#6a4022',info:'Nerveux, adorable, incapable de mentir.'}
};

function oeil(x,y,p,e,side,big){
 const r=big?13:10.5;
 if(e==='h')return `<path d="M${x-13} ${y+3}q13 -14 26 0" fill="none" stroke="#1a1414" stroke-width="4" stroke-linecap="round"/>`;
 if(e==='a')return `<path d="M${x-14} ${y-2}h28" stroke="#1a1414" stroke-width="4" stroke-linecap="round"/><path d="M${x-10} ${y-1}a10 8 0 0 0 20 0z" fill="${p.iris}"/>`;
 const dx=e==='b'?(side<0?5:5):0, pu=e==='s'?4.5:r;
 return `<ellipse cx="${x}" cy="${y}" rx="14" ry="${big?14:12}" fill="#fbf7f2"/>`+
  `<circle cx="${x+dx}" cy="${y+1}" r="${pu}" fill="${p.iris}"/>`+(e==='s'?'':`<circle cx="${x+dx}" cy="${y+1}" r="${pu*.55}" fill="#120c0a"/><circle cx="${x+dx+3.5}" cy="${y-3.5}" r="3.2" fill="#fff"/>`)+
  `<path d="M${x-15} ${y-3}Q${x} ${y-(big?20:17)} ${x+15} ${y-3}" fill="none" stroke="#1a1414" stroke-width="4.5" stroke-linecap="round"/>`;
}
const SOURC={n:[-2,2],h:[-3,3],s:[-7,7],b:[3,-1],a:[6,-6],p:[5,-5]};
function portrait(id,e='n'){
 const p=PERS[id];let[bg,bd]=SOURC[e]||SOURC.n;
 const big=id==='tinn',ey=152;
 let bro1=`M${106} ${130-bg*.3}L${140} ${130+bg}`, bro2=`M${160} ${130+bd*-1}L${194} ${130-bd*.3*-1}`;
 if(id==='sarawin'&&e==='n')bro2='M160 124Q176 108 194 118';
 const bouche={n:'<path d="M138 196q12 5 24 0" fill="none" stroke="#6a2f25" stroke-width="3.5" stroke-linecap="round"/>',
  h:'<path d="M128 188q22 26 44 0z" fill="#7c2a24"/><path d="M131 189h38l-3 5h-32z" fill="#fff"/>',
  s:'<ellipse cx="150" cy="197" rx="10" ry="13" fill="#7c2a24"/>',
  b:'<path d="M142 196q8 -3 16 1" fill="none" stroke="#6a2f25" stroke-width="3.5" stroke-linecap="round"/>',
  a:'<path d="M136 197q14 -6 28 0" fill="none" stroke="#6a2f25" stroke-width="3.5" stroke-linecap="round"/>',
  p:'<path d="M134 200q16 -14 32 0z" fill="#7c2a24"/>'}[e]||'';
 const blush=(e==='b'||e==='p'||id==='tinn')?`<ellipse cx="112" cy="174" rx="15" ry="7" fill="#ea7a72" opacity="${e==='b'?.6:.32}"/><ellipse cx="188" cy="174" rx="15" ry="7" fill="#ea7a72" opacity="${e==='b'?.6:.32}"/>`:'';
 const larme=e==='p'?'<path d="M108 164q-7 14 0 20q7 -6 0 -20zM192 164q-7 14 0 20q7 -6 0 -20z" fill="#9fd7ee"/>':'';
 const FOND={
  kinnat:'<path d="M90 140C84 76 118 52 150 52s66 24 60 88l4 26h-128z" fill="CH"/>',
  rayn:'<path d="M84 150C70 70 120 44 150 46s86 22 66 104z" fill="CH"/>',
  vega:'<path d="M82 136C76 64 120 44 152 46s72 24 66 90l6 92c-20 14-34 8-34 8V150H110v86s-20 6-36-10z" fill="CH"/>',
  ayaan:'<path d="M90 140C86 88 116 62 150 62s64 26 60 78z" fill="CH"/>',
  sarawin:'<path d="M84 140C78 66 120 42 150 44s72 24 66 96l6 70c-14 12-30 8-30 8V150H108v68s-16 4-30-8z" fill="CH"/><circle cx="150" cy="38" r="22" fill="CH"/>',
  tinn:'<path d="M78 158C66 72 116 42 150 42s84 30 72 116c-8 16-22 14-22 14H100s-14 2-22-14z" fill="CH"/>'
 }[id].replaceAll('CH',p.ch);
 const AVANT={
  kinnat:'<path d="M90 142C82 62 150 40 196 60c24 12 20 56 14 84-6-24-18-40-34-48-34 12-58 8-72 14-8 8-12 18-14 32z" fill="CH"/><path d="M122 66C150 56 178 58 196 72" fill="none" stroke="#39506a" stroke-width="4" stroke-linecap="round"/>',
  rayn:'<path d="M86 150c-14-30-6-52 6-58-4-22 18-44 36-34 8-18 40-18 50-2 20-8 40 16 30 34 14 10 16 40 4 62-4-16-10-26-18-34-8 10-22 4-26-2-8 12-30 12-36 2-8 10-24 6-28-2-10 8-16 20-18 34z" fill="CH"/><path d="M114 74c10-8 24-8 32-2M170 68c10 0 20 6 24 16" fill="none" stroke="#8a5533" stroke-width="4" stroke-linecap="round"/>',
  vega:'<path d="M84 150C74 66 136 36 186 54c30 14 34 56 28 92-4-22-10-36-22-46-12 34-34 62-74 76 12-18 20-40 22-64-18 2-34 10-42 24-6 4-14 8-18 14z" fill="CH"/><path d="M134 72c24-14 50-8 62 10" fill="none" stroke="#454a7d" stroke-width="4" stroke-linecap="round"/>',
  ayaan:'<path d="M92 148c-8-26-2-46 8-52-10-22 2-46 22-44 10-22 50-22 62-6 24-4 34 22 26 44 8 12 6 38-2 56-4-18-10-30-22-36-28 8-60 8-78 4-10 8-14 20-16 34z" fill="CH"/><path d="M128 52c18-14 44-12 58 0" fill="none" stroke="#e39a3c" stroke-width="7" stroke-linecap="round"/>',
  sarawin:'<path d="M84 150C78 72 124 44 156 48c-6 18-30 38-50 48-10 12-14 30-14 44-4 2-6 6-8 10zM156 48c36 2 66 30 60 102-4-20-8-40-22-52-20-6-40-26-38-50z" fill="CH"/><path d="M196 214l0 14" stroke="#d8dde2" stroke-width="3"/><circle cx="212" cy="196" r="4" fill="#d8dde2"/>',
  tinn:'<path d="M78 160C66 82 112 42 150 42s84 40 72 118c-6-14-12-26-20-36-14-8-14-14-20-20-20 10-44 10-62 2-8 8-12 14-22 18-8 10-16 22-20 36z" fill="CH"/><path d="M112 66c20-12 54-12 76 2" fill="none" stroke="#b07a4e" stroke-width="5" stroke-linecap="round"/>'
 }[id].replaceAll('CH',p.ch);
 const extra={kinnat:`<g fill="rgba(200,230,240,.1)" stroke="#27313f" stroke-width="3.5"><rect x="104" y="136" width="42" height="32" rx="5"/><rect x="154" y="136" width="42" height="32" rx="5"/></g><path d="M146 148h8" stroke="#27313f" stroke-width="3.5"/>`,
  ayaan:`<path d="M112 62l6-30 16 18 16-24 16 24 16-18 6 30z" fill="#f4c430" stroke="#a97c10" stroke-width="2"/><text x="150" y="58" text-anchor="middle" font-size="16" font-weight="800" fill="#7a5608" font-family="sans-serif">25</text>`,
  vega:`<circle cx="92" cy="196" r="4" fill="#c3b4e8"/>`}[id]||'';
 return svgS(300,360,`
 ${FOND}
 <path d="M18 360c4-70 44-110 96-120h72c52 10 92 50 96 120z" fill="#1d2432"/>
 <path d="M18 360c4-70 44-110 96-120h72c52 10 92 50 96 120" fill="none" stroke="#54708a" stroke-width="3"/>
 <path d="M84 262c-14-30 8-56 30-60h72c22 4 44 30 30 60-34 34-98 34-132 0z" fill="#2a3346"/>
 <path d="M122 214h56v30c-20 26-36 26-56 0z" fill="${p.peau}"/><path d="M122 222q28 22 56 0v8q-28 18-56 0z" fill="#000" opacity=".14"/>
 <path d="M130 268v34M170 268v34" stroke="#c9d6dd" stroke-width="3" stroke-linecap="round"/>
 <path d="M104 150C104 88 196 88 196 150" fill="${p.peau}"/>
 <ellipse cx="90" cy="156" rx="10" ry="16" fill="${p.peau}"/><ellipse cx="210" cy="156" rx="10" ry="16" fill="${p.peau}"/>
 <path d="M90 130C90 66 210 66 210 130c0 56-34 96-60 98-26-2-60-42-60-98z" fill="${p.peau}"/>
 ${blush}${oeil(122,ey,p,e,-1,big)}${oeil(178,ey,p,e,1,big)}
 <path d="${bro1}" stroke="${id==='rayn'||id==='tinn'?p.ch:'#17120f'}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
 <path d="${bro2}" stroke="${id==='rayn'||id==='tinn'?p.ch:'#17120f'}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
 <path d="M150 170l-4 12h7" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2.5" stroke-linecap="round"/>
 ${bouche}${larme}${AVANT}${extra}`,'xMidYMax meet');
}

function ville(cls=''){const r=prng(77);let b='',x=0;
 while(x<1600){const w=50+r()*90,h=170+r()*380,y=640-h;b+=`<rect x="${x}" y="${y}" width="${w}" height="${h+10}" fill="#10283a"/>`;
  for(let i=x+10;i<x+w-10;i+=15)for(let j=y+12;j<620;j+=20)if(r()>.66)b+=`<rect x="${i}" y="${j}" width="7" height="10" fill="${r()>.3?'#f0c56c':'#7fc2d9'}" opacity="${.35+r()*.5}"/>`;
  x+=w+r()*14}
 return b}
function pluieVitre(x,y,w,h,n=26){const r=prng(11);let s='';for(let i=0;i<n;i++){const a=x+r()*w,b=y+r()*h;s+=`<path d="M${a} ${b}l-5 ${20+r()*20}" stroke="#a9cbd6" stroke-width="1.5" opacity=".35"/>`}return s}
const guirl=(x1,x2,y)=>{let s=`<path d="M${x1} ${y}Q${(x1+x2)/2} ${y+70} ${x2} ${y}" fill="none" stroke="#2b1f1a" stroke-width="3"/>`;for(let t=.06;t<1;t+=.09){const a=(1-t)*(1-t)*x1+2*t*(1-t)*(x1+x2)/2+t*t*x2,b=(1-t)*(1-t)*y+2*t*(1-t)*(y+70)+t*t*y;s+=`<circle cx="${a}" cy="${b+7}" r="7" fill="#f6d78a"/><circle cx="${a}" cy="${b+7}" r="20" fill="#f6d78a" opacity=".18"/>`}return s};

const SCENES={
 ville(){return svgS(1600,900,`<defs><linearGradient id="vc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2030"/><stop offset=".7" stop-color="#1f4a5e"/><stop offset="1" stop-color="#2e6673"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#vc)"/>${ville()}
  <rect y="540" width="1600" height="26" fill="#0a1a26"/><g fill="#0a1a26">${[120,520,920,1320].map(x=>`<rect x="${x}" y="560" width="40" height="90"/>`).join('')}</g>
  <rect x="660" y="505" width="240" height="30" rx="6" fill="#1b3f4f"/><g fill="#f0c56c">${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${672+i*28}" y="512" width="18" height="12"/>`).join('')}</g>
  <rect y="640" width="1600" height="260" fill="#0b1c29"/>
  <g transform="matrix(1 0 0 -.55 0 993)" opacity=".5">${ville()}</g>
  <g fill="#f4c430" opacity=".14">${[200,700,1250].map(x=>`<ellipse cx="${x}" cy="760" rx="150" ry="16"/>`).join('')}</g>
  <text x="1290" y="210" font-size="64" fill="#f3a6a2" opacity=".9" font-family="Sarabun,sans-serif" font-weight="700">ซอย 24</text>
  <rect x="1270" y="148" width="240" height="86" fill="none" stroke="#f3a6a2" stroke-width="4" opacity=".7"/>`)},
 salon(o={}){const j=o.jour;return svgS(1600,900,`<defs><linearGradient id="sm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${j?'#3d6170':'#1e3644'}"/><stop offset="1" stop-color="${j?'#54808a':'#2a4c56'}"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#sm)"/>
  <rect x="470" y="110" width="660" height="470" fill="${j?'#a9c7cf':'#10283a'}"/><svg x="470" y="110" width="660" height="470" viewBox="500 250 660 470" preserveAspectRatio="xMidYMid slice"><g opacity="${j?.2:1}">${ville()}</g></svg>${pluieVitre(470,110,660,470,50)}
  <path d="M800 110v470M470 110h660v470H470z" fill="none" stroke="#0c1c28" stroke-width="16"/>
  <rect x="330" y="90" width="120" height="510" fill="#a2523d"/><rect x="1150" y="90" width="120" height="510" fill="#a2523d"/>
  <path d="M360 90v510M410 90v510M1180 90v510M1230 90v510" stroke="#7c3b2c" stroke-width="5"/>
  ${j?'':guirl(120,800,70)+guirl(800,1500,70)}
  <path d="M640 120h320l-20 34 20 34H640l20-34z" fill="#a2523d"/><text x="800" y="170" text-anchor="middle" font-size="42" fill="#ffffff" font-family="Chonburi,Georgia,serif">25 ans !</text>
  <rect y="690" width="1600" height="210" fill="#3a3540"/><path d="M0 690h1600" stroke="#21222c" stroke-width="8"/>
  <g transform="translate(180 500)"><rect x="-40" y="110" width="520" height="110" rx="20" fill="#2f7b7d"/><rect x="-40" y="10" width="520" height="130" rx="24" fill="#3b9193"/><rect x="-74" y="60" width="74" height="150" rx="22" fill="#2f7b7d"/><rect x="480" y="60" width="74" height="150" rx="22" fill="#2f7b7d"/></g>
  <g transform="translate(1180 570)"><path d="M-30 200l60-200" stroke="#6d4726" stroke-width="20"/><ellipse cx="-30" cy="190" rx="60" ry="46" fill="#a86a34" transform="rotate(16 -30 190)"/><circle cx="-34" cy="186" r="15" fill="#2a1a10"/></g>
  <g transform="translate(610 640)"><rect width="380" height="24" rx="6" fill="#6d4726"/><rect x="24" y="24" width="14" height="110" fill="#533517"/><rect x="342" y="24" width="14" height="110" fill="#533517"/><ellipse cx="110" cy="-6" rx="56" ry="13" fill="#e9eef0"/><ellipse cx="270" cy="-6" rx="56" ry="13" fill="#e9eef0"/><ellipse cx="270" cy="-14" rx="34" ry="14" fill="#efe5c6"/></g>`)},
 cuisine(){return svgS(1600,900,`<rect width="1600" height="900" fill="#2c5456"/>
  <g stroke="#3a6a6a" stroke-width="3">${[...Array(16)].map((_,i)=>`<path d="M${i*107} 300V640"/>`).join('')}${[0,1,2,3].map(i=>`<path d="M0 ${300+i*85}H1600"/>`).join('')}</g>
  <rect y="0" width="1600" height="270" fill="#264a50"/><rect x="330" y="30" width="520" height="220" fill="#3f7c79"/><path d="M590 30v220" stroke="#264a50" stroke-width="6"/>
  <rect y="640" width="1600" height="260" fill="#6d4726"/><rect y="622" width="1600" height="26" fill="#d5dde0"/>
  <g transform="translate(360 500)"><rect width="210" height="124" rx="60" fill="#e9eef0"/><rect x="24" y="-18" width="162" height="40" rx="20" fill="#cdd9dd"/><rect x="72" y="62" width="66" height="26" fill="#17293a"/><text x="105" y="82" text-anchor="middle" font-size="20" fill="#e8735f" font-family="monospace">!!</text></g>
  <path d="M430 470q20-34 0-68M490 470q-20-34 0-68" fill="none" stroke="#e9eef0" stroke-width="7" opacity=".32"/>
  <g transform="translate(640 560)"><rect width="190" height="66" rx="6" fill="#20282e"/><rect x="24" y="-44" width="140" height="48" rx="6" fill="#74838c"/><rect x="164" y="-30" width="74" height="10" fill="#20282e"/></g>
  <g transform="translate(1000 150)"><rect width="270" height="510" rx="14" fill="#cfdde0"/><path d="M0 170h270" stroke="#92a6ad" stroke-width="5"/><rect x="24" y="210" width="10" height="90" fill="#92a6ad"/>
   ${[0,1,2,3,4,5,6].map(i=>`<rect x="70" y="${206+i*40}" width="130" height="34" fill="#fbe26b" transform="rotate(${i%2?1.6:-1.6} 130 ${220+i*40})"/>`).join('')}</g>
  <g transform="translate(1320 180)"><rect width="230" height="460" fill="#17344a"/><rect x="12" y="12" width="206" height="460" fill="#4a6a7c"/><circle cx="36" cy="260" r="11" fill="#f4c430"/><rect x="60" y="70" width="110" height="90" fill="#10283a"/><text x="115" y="134" text-anchor="middle" font-size="66" fill="#f4c430" font-family="Chonburi,Georgia,serif">C</text></g>`)},
 entree(){return svgS(1600,900,`<rect width="1600" height="900" fill="#34424f"/>
  <rect y="720" width="1600" height="180" fill="#232b33"/><rect y="280" width="1600" height="16" fill="#28333e"/>
  <rect x="150" y="150" width="280" height="570" fill="#5a3a24"/><circle cx="400" cy="450" r="12" fill="#f4c430"/>
  <rect x="620" y="210" width="460" height="18" fill="#6d4726"/>${[700,860,1000].map(x=>`<circle cx="${x}" cy="232" r="10" fill="#c9d6dd"/>`).join('')}
  <g transform="translate(860 240)"><path d="M-90 30C-120 40-130 110-136 300-138 390-126 450-120 480H120C126 450 138 390 136 300 130 110 120 40 90 30 60 10-60 10-90 30z" fill="#f4c430"/><path d="M-60 26c30 26 90 26 120 0l-14-30h-92z" fill="#d9a915"/><path d="M0 40V480" stroke="#b98e10" stroke-width="5"/><rect x="-104" y="290" width="84" height="74" fill="#e2b41d" stroke="#b98e10" stroke-width="4"/><rect x="24" y="290" width="84" height="74" fill="#e2b41d" stroke="#b98e10" stroke-width="4"/></g>
  <g transform="translate(1180 620)" fill="#1b2730"><rect width="240" height="100" fill="#4a5966"/><ellipse cx="56" cy="40" rx="42" ry="17" fill="#e8735f"/><ellipse cx="170" cy="40" rx="42" ry="17" fill="#e9eef0"/></g>`)},
 escalier(o={}){const st=[...Array(8)].map((_,i)=>`<rect x="${380+i*30}" y="${760-i*62}" width="${900-i*50}" height="${70}" fill="${i%2?'#61717a':'#6d7d86'}"/><rect x="${380+i*30}" y="${760-i*62}" width="${900-i*50}" height="9" fill="#8fa2aa"/>`).join('');
  return svgS(1600,900,`<rect width="1600" height="900" fill="#14303f"/>
  ${o.orage?'<rect width="1600" height="900" fill="#3c5f77"/><path d="M1240 0l-60 170 50-14-80 200" fill="none" stroke="#f2f6d8" stroke-width="7"/>':''}
  <g opacity=".55">${ville()}</g>
  <rect y="760" width="1600" height="140" fill="#46555e"/>${st}
  <path d="M0 0H1600V90L1500 130H100L0 90z" fill="#5d3f2c"/><path d="M100 130h1400" stroke="#2c1d14" stroke-width="10"/>
  <path d="M340 770L620 330M1400 770L1120 330" stroke="#c2ced2" stroke-width="10"/><path d="M340 700L620 260M1400 700L1120 260" stroke="#c2ced2" stroke-width="8"/>
  <g transform="translate(800 130)"><path d="M0 0v50" stroke="#20282e" stroke-width="7"/><path d="M-50 50h100l-20-20h-60z" fill="#20282e"/><circle cy="60" r="16" fill="#f5da8a"/></g>
  <path d="M800 190L420 800H1180z" fill="#f5da8a" opacity=".11"/>
  <rect x="110" y="330" width="210" height="440" fill="#1c3b4d"/><rect x="124" y="344" width="182" height="426" fill="#3a5a6a"/><text x="215" y="310" text-anchor="middle" font-size="26" fill="#d6e2e5" font-family="Sarabun,sans-serif">บันได C</text>
  ${pluieVitre(0,120,1600,700,90)}`)},
 magasin(){return svgS(1600,900,`<rect width="1600" height="900" fill="#0f2634"/><rect y="700" width="1600" height="200" fill="#16232d"/>
  <rect x="220" y="170" width="1160" height="530" fill="#d9eef0"/><rect x="220" y="120" width="1160" height="80" fill="#2b8a7c"/><rect x="220" y="196" width="1160" height="14" fill="#e8735f"/>
  <text x="800" y="178" text-anchor="middle" font-size="48" fill="#fff" font-family="Sarabun,sans-serif" font-weight="800">SUPÉRETTE · SOI 24 · ซอย 24</text>
  ${[0,1,2].map(i=>`<g transform="translate(${270+i*370} 260)"><rect width="310" height="340" fill="#b9d3d6"/>${[0,1,2].map(r=>`<rect y="${100+r*112}" width="310" height="10" fill="#71919a"/>`+[...Array(9)].map((_,k)=>`<rect x="${10+k*33}" y="${54+r*112}" width="25" height="46" fill="${['#e8735f','#f4c430','#86b86b','#4a97e6','#f3a6a2'][(k*3+r+i)%5]}"/>`).join('')).join('')}</g>`).join('')}
  <path d="M220 170H1380V700H220zM800 170V700" fill="none" stroke="#1c3440" stroke-width="12"/>
  <g transform="matrix(1 0 0 -.3 0 910)" opacity=".28"><rect x="220" y="170" width="1160" height="530" fill="#d9eef0"/></g>${pluieVitre(0,0,1600,900,70)}`)},
 noir(){return svgS(1600,900,`<rect width="1600" height="900" fill="#08141d"/>`)}
};

function silhouettes(couleur=false){
 const c1=couleur?'#2c3a52':'#141c20',c2=couleur?'#212c40':'#101619',sk=couleur?'#e9c19b':'#3c4240',sk2=couleur?'#d9a273':'#343a38';
 const fig=(c,p)=>`<path d="M262 372C262 300 258 240 282 214 300 198 340 198 356 214 376 240 384 300 386 372z" fill="${c}"/><path d="M290 205C272 165 284 112 328 106 368 102 392 130 394 160L390 206C372 222 316 226 290 205z" fill="${c}"/><path d="M366 124C382 130 392 146 392 158L402 170 392 174C394 186 390 198 378 202 364 204 352 198 348 184 344 160 352 136 366 124z" fill="${p}"/>`;
 return `<g class="sil-a">${fig(c1,sk)}</g><g class="sil-b"><g transform="translate(800 6) scale(-1 1)">${fig(c2,sk2)}</g><path class="mainj" d="M476 244Q414 236 372 180" fill="none" stroke="${c2}" stroke-width="22" stroke-linecap="round"/><circle class="mainj" cx="370" cy="174" r="12" fill="${sk2}"/></g>`;
}
function plan(mode,opts={}){ // vue au ras du sol : vidéo et révélation
 const clair=mode==='clair';
 return svgS(800,450,`<defs><radialGradient id="lp" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="${clair?'#f5da8a':'#6b7a6e'}" stop-opacity="${clair?.55:.5}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
 <rect width="800" height="450" fill="${clair?'#14303f':'#0b1214'}"/>
 <path d="M0 300h800v150H0z" fill="${clair?'#46555e':'#1a2122'}"/><path d="M0 240h800v14H0zM60 180h680v14H60z" fill="${clair?'#61717a':'#181f20'}"/>
 <rect width="800" height="450" fill="url(#lp)"/>
 ${silhouettes(clair)}
 <g transform="translate(150 372)"><path d="M0 14L120 0" stroke="${clair?'#8f9ba3':'#3a4042'}" stroke-width="7" stroke-linecap="round"/><path d="M116 2q16 -4 16 10" fill="none" stroke="${clair?'#a2703c':'#50402c'}" stroke-width="8" stroke-linecap="round"/><path d="M0 14C14-20 74-24 92 4z" fill="${clair?'#8f9ba3':'#2a2f30'}"/></g>
 <g transform="translate(620 382)"><ellipse rx="46" ry="16" fill="${clair?'#4a97e6':'#1f4066'}"/><ellipse cy="-5" rx="36" ry="10" fill="${clair?'#2c6cb0':'#132a44'}"/>${clair?'<g transform="translate(0 -36)"><ellipse rx="24" ry="20" fill="#f5f4ee"/><circle cx="-1" cy="-20" r="17" fill="#f5f4ee"/><path d="M-15-30l2-16 11 9zM14-28q10-8 2-14l-9 5z" fill="#f5f4ee"/><path d="M-8-22q3-3 5 0M4-22q3-3 5 0" stroke="#333" stroke-width="2" fill="none"/></g>':''}</g>
 ${pluieVitre(0,0,800,330,44)}`,'xMidYMid meet');
}
let SC_MANTEAU=()=>`<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><title>Imperméable jaune</title><rect width="800" height="560" fill="#34424f"/><rect y="30" width="800" height="12" fill="#6d4726"/>
 <g transform="translate(400 40)"><path d="M-160 30C-200 44-214 150-222 360-224 440-210 500-204 520H204C210 500 224 440 222 360 214 150 200 44 160 30 110 4-110 4-160 30z" fill="#f4c430"/><path d="M-96 26c50 40 142 40 192 0l-22-30H-74z" fill="#d9a915"/><path d="M0 40V520" stroke="#b98e10" stroke-width="6"/>${[110,210,310,410].map(y=>`<circle cx="-14" cy="${y}" r="8" fill="#7a5608"/>`).join('')}</g>
 <g class="spot" data-s="gauche" tabindex="0" role="button" aria-label="Poche gauche"><rect x="220" y="330" width="150" height="130" fill="#e2b41d" stroke="#b98e10" stroke-width="5"/><path d="M220 330h150v26H220z" fill="#c99d15"/><rect class="halo" x="212" y="322" width="166" height="146"/></g>
 <g class="spot" data-s="droite" tabindex="0" role="button" aria-label="Poche droite"><rect x="430" y="330" width="150" height="130" fill="#e2b41d" stroke="#b98e10" stroke-width="5"/><path d="M430 330h150v26H430z" fill="#c99d15"/><rect class="halo" x="422" y="322" width="166" height="146"/></g>
 <g class="spot" data-s="interieur" tabindex="0" role="button" aria-label="Poche intérieure"><path d="M420 150h96v70h-96z" fill="#d9a915" stroke="#b98e10" stroke-width="4"/><path d="M420 150h96" stroke="#7a5608" stroke-width="7"/><rect class="halo" x="412" y="142" width="112" height="86"/></g></svg>`;
let SC_MARCHES=()=>`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg"><title>Escalier C</title><rect width="800" height="520" fill="#14303f"/><rect y="400" width="800" height="120" fill="#46555e"/>
 ${[0,1,2,3,4].map(i=>`<rect x="${130+i*18}" y="${400-i*60}" width="${540-i*36}" height="62" fill="${i%2?'#61717a':'#6d7d86'}"/><rect x="${130+i*18}" y="${400-i*60}" width="${540-i*36}" height="8" fill="#8fa2aa"/>`).join('')}
 <path d="M0 0H800V40L740 70H60L0 40z" fill="#5d3f2c"/>
 <g class="spot" data-s="seau" tabindex="0" role="button" aria-label="Seau"><path d="M60 410h86l-10 86H70z" fill="#a2523d"/><ellipse cx="103" cy="410" rx="43" ry="10" fill="#7c3b2c"/><rect class="halo" x="50" y="394" width="106" height="110"/></g>
 <g class="spot" data-s="carton" tabindex="0" role="button" aria-label="Carton"><rect x="620" y="400" width="130" height="92" fill="#b5905e"/><path d="M620 400l-20-22h130l20 22z" fill="#cda875"/><rect class="halo" x="600" y="374" width="154" height="122"/></g>
 <g class="spot" data-s="gamelle" tabindex="0" role="button" aria-label="Sous la marche"><path d="M330 470h140v28H330z" fill="#2e3b42"/><ellipse cx="400" cy="480" rx="52" ry="17" fill="#4a97e6"/><ellipse cx="400" cy="475" rx="40" ry="11" fill="#2c6cb0"/><rect class="halo" x="330" y="452" width="140" height="56"/></g>
 ${pluieVitre(0,60,800,380,36)}</svg>`;
let SC_CHATON=()=>`<svg viewBox="0 0 460 340" xmlns="http://www.w3.org/2000/svg"><title>Khao Niao</title><rect width="460" height="340" fill="#61717a"/><rect y="250" width="460" height="90" fill="#46555e"/>
 <ellipse cx="230" cy="274" rx="130" ry="42" fill="#4a97e6"/><ellipse cx="230" cy="260" rx="104" ry="28" fill="#2c6cb0"/>
 <ellipse cx="230" cy="226" rx="66" ry="52" fill="#f7f5ef"/><circle cx="230" cy="142" r="56" fill="#f7f5ef"/><path d="M186 112l4-54 38 32zM274 112q40-28 14-50l-34 24z" fill="#f7f5ef"/><path d="M196 102l3-28 19 17z" fill="#efb5ae"/>
 <circle cx="208" cy="142" r="11" fill="#1d2a33"/><circle cx="252" cy="142" r="11" fill="#1d2a33"/><circle cx="212" cy="138" r="4" fill="#fff"/><circle cx="256" cy="138" r="4" fill="#fff"/>
 <path d="M224 160l6 6 6-6zM230 166q-8 10-16 4M230 166q8 10 16 4" fill="#efb5ae" stroke="#a0756f" stroke-width="2"/><path d="M162 158l-34-6M162 170l-36 6M298 158l34-6M298 170l36 6" stroke="#c3c8c8" stroke-width="2.5"/></svg>`;
let SC_CARNET=()=>`<svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg"><title>Carnet d’Ayaan</title><rect width="460" height="300" fill="#3a3540"/><g transform="rotate(-3 230 150)"><rect x="60" y="40" width="340" height="220" fill="#7c3b2c"/><rect x="72" y="50" width="316" height="200" fill="#efe5c6"/><path d="M230 50v200" stroke="#c7b98f" stroke-width="3"/><text x="88" y="96" font-size="19" font-family="'Patrick Hand',cursive" fill="#26303a">Paris en cours</text><text x="88" y="136" font-size="17" font-family="'Patrick Hand',cursive" fill="#26303a">Kinnat et Rayn</text><text x="88" y="162" font-size="17" font-family="'Patrick Hand',cursive" fill="#26303a">avant mes 25 ans.</text><text x="88" y="200" font-size="17" font-family="'Patrick Hand',cursive" fill="#a2312a">Mise : 500 bahts.</text></g></svg>`;

/* ---------- Palette claire : Bangkok au crépuscule, en pastel ---------- */
const TEINTE={
 // ciel, ville, rue
 '#0d2030':'#cdbdf2','#1f4a5e':'#f2c4dd','#2e6673':'#ffe1ea','#10283a':'#ad9bdc','#0a1a26':'#9988cc','#1b3f4f':'#bfaeea','#0b1c29':'#efe2f8',
 '#f0c56c':'#fff5c4','#7fc2d9':'#ffd2e4','#f3a6a2':'#ec5f97',
 // salon
 '#1e3644':'#fde4ee','#2a4c56':'#f9d3e3','#3d6170':'#fff0f5','#54808a':'#fcdfea','#a9c7cf':'#d6ecfa','#0c1c28':'#f3bcd3',
 '#a2523d':'#f6a3c0','#7c3b2c':'#e786a8','#3a3540':'#efdcea','#21222c':'#dfc1d6','#2f7b7d':'#9edcc7','#3b9193':'#bdeadb',
 '#6d4726':'#e3b49a','#533517':'#c99683','#a86a34':'#f5c2a0','#2a1a10':'#9a6a84','#2b1f1a':'#c99ab8','#f6d78a':'#fff2b8',
 // cuisine
 '#2c5456':'#e4f5ef','#3a6a6a':'#cdeee2','#264a50':'#d7efe7','#3f7c79':'#c4e4f5','#d5dde0':'#ffffff','#17293a':'#7b4d77',
 '#20282e':'#b79bbd','#74838c':'#d8c4dc','#cfdde0':'#ffffff','#92a6ad':'#e8c9dc','#17344a':'#c7a9dc','#4a6a7c':'#e7d6f2',
 // entrée
 '#34424f':'#fde6ef','#232b33':'#f2cfdd','#28333e':'#efc3d5','#5a3a24':'#e9b6a5','#4a5966':'#d9c4e8','#1b2730':'#d9c4e8',
 // escalier
 '#14303f':'#dccff4','#46555e':'#dccfe6','#61717a':'#ede2f4','#6d7d86':'#f7eff9','#8fa2aa':'#ffffff','#5d3f2c':'#f6a3c0','#2c1d14':'#dd7ca2',
 '#c2ced2':'#ffffff','#1c3b4d':'#bba7e0','#3a5a6a':'#ddd0f2','#3c5f77':'#c1b5ec','#d6e2e5':'#8a62a8','#f5da8a':'#fff1c0','#2e3b42':'#c9b3d4',
 // supérette
 '#0f2634':'#fde4ee','#16232d':'#f1d0df','#d9eef0':'#fffafc','#2b8a7c':'#ec5f97','#b9d3d6':'#f5e7f4','#71919a':'#d6b8da','#1c3440':'#cf9fbe',
 // pluie, carnet d'Ayaan
 '#a9cbd6':'#a688d8'
};
function teinte(s){return s.replace(/#[0-9a-fA-F]{6}\b/g,c=>TEINTE[c.toLowerCase()]||c).replaceAll('Chonburi,Georgia,serif','Fredoka,sans-serif').replaceAll("Chonburi,Georgia,serif","Fredoka,sans-serif")}
for(const k of Object.keys(SCENES)){const f=SCENES[k];SCENES[k]=o=>teinte(f(o))}
{const p0=plan;plan=(m,o)=>m==='clair'?teinte(p0(m,o)):p0(m,o)}
{const a=SC_MANTEAU,b=SC_MARCHES,c=SC_CHATON,d=SC_CARNET;
 SC_MANTEAU=()=>teinte(a());SC_MARCHES=()=>teinte(b());SC_CHATON=()=>teinte(c());SC_CARNET=()=>teinte(d())}
