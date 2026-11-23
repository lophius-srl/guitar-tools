// Guitar tools — bibliothèque commune aux onglets Accords, Improviser, Manche et Oreille.
// Noms de notes, gammes, accords, tonalité d'une grille, son (guitare et batterie de synthèse),
// dessin du manche et des diagrammes d'accords. Tout est exposé dans l'objet global M.
(function(){
const M={};
M.SH=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
M.FLT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
M.FRS=['Do','Do#','Ré','Ré#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
M.FRF=['Do','Réb','Ré','Mib','Mi','Fa','Solb','Sol','Lab','La','Sib','Si'];
M.IV=['1','b2','2','b3','3','4','b5','5','b6','6','b7','7'];
M.INTERVALS=['unisson','seconde mineure','seconde majeure','tierce mineure','tierce majeure','quarte juste','triton','quinte juste','sixte mineure','sixte majeure','septième mineure','septième majeure','octave'];
M.OPEN=[64,59,55,50,45,40];M.SN=['e','B','G','D','A','E'];
M.MAJ=[0,2,4,5,7,9,11];M.MIN=[0,2,3,5,7,8,10];
M.SCALES={
  maj:{n:'Majeure',i:M.MAJ},min:{n:'Mineure naturelle',i:M.MIN},
  pmaj:{n:'Penta majeure',i:[0,2,4,7,9]},pmin:{n:'Penta mineure',i:[0,3,5,7,10]},
  blues:{n:'Blues',i:[0,3,5,6,7,10]},dor:{n:'Dorien',i:[0,2,3,5,7,9,10]},
  mix:{n:'Mixolydien',i:[0,2,4,5,7,9,10]},harm:{n:'Mineure harmonique',i:[0,2,3,5,7,8,11]}
};
// Noms de notes : bémols pour les tonalités qui en demandent, français ou anglais
M.names=(root,minor,fr)=>{const fl=[5,10,3,8,1].includes(root)||minor&&[2,7,0,5].includes(root);return fr?(fl?M.FRF:M.FRS):(fl?M.FLT:M.SH);};
M.fr=()=>{try{return (localStorage.getItem('gt.nom')||'fr')==='fr';}catch(e){return true;}};

// ---------- Accords ----------
// q : '' majeur, m, 7, maj7, m7, dim, m7b5, sus2, sus4, 5, aug, 6, add9
M.QUALS={'':[0,4,7],m:[0,3,7],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],dim:[0,3,6],m7b5:[0,3,6,10],sus2:[0,2,7],sus4:[0,5,7],'5':[0,7],aug:[0,4,8],'6':[0,4,7,9],add9:[0,2,4,7]};
M.QSHOW={'':'',m:'m','7':'7',maj7:'maj7',m7:'m7',dim:'°',m7b5:'ø',sus2:'sus2',sus4:'sus4','5':'5',aug:'+','6':'6',add9:'add9'};
M.QNAME={'':'majeur',m:'mineur','7':'septième',maj7:'majeur 7',m7:'mineur 7',dim:'diminué',m7b5:'demi-diminué',sus2:'sus2',sus4:'sus4','5':'quinte (power chord)',aug:'augmenté','6':'sixte',add9:'add9'};
const ROOTS=[['sol',7],['do',0],['ré',2],['re',2],['mi',4],['fa',5],['la',9],['si',11],['c',0],['d',2],['e',4],['f',5],['g',7],['a',9],['b',11]];
const QALIAS=[['maj7','maj7'],['m7b5','m7b5'],['m7-5','m7b5'],['min7','m7'],['m7','m7'],['-7','m7'],['7m','maj7'],['7M','maj7'],['maj',''],['m7','m7'],['ma7','maj7'],['Δ','maj7'],['M7','maj7'],['dim','dim'],['°','dim'],['o','dim'],['ø','m7b5'],['sus2','sus2'],['sus4','sus4'],['sus','sus4'],['add9','add9'],['aug','aug'],['+','aug'],['min','m'],['m','m'],['-','m'],['7','7'],['5','5'],['6','6'],['','']];
// Lit un symbole d'accord : « Lam », « Am7 », « F#m », « Sib », « D/F# », « Mi7 »…
M.parseChord=tok=>{
  let t=tok.trim().replace(/♯/g,'#').replace(/♭/g,'b');if(!t)return null;
  let bass=null;const sl=t.indexOf('/');if(sl>0){const b=M.parseChord(t.slice(sl+1));if(!b)return null;bass=b.r;t=t.slice(0,sl);}
  const low=t.toLowerCase();let r=null,rest='';
  for(const[n,pc]of ROOTS){if(low.startsWith(n)){r=pc;rest=t.slice(n.length);break;}}
  if(r===null)return null;
  if(rest[0]==='#'){r=(r+1)%12;rest=rest.slice(1);}else if(rest[0]==='b'){r=(r+11)%12;rest=rest.slice(1);}
  for(const[a,q]of QALIAS){if(rest===a)return {r,q,bass};}
  // « M » majuscule seule = majeur (ex. « CM »)
  if(rest==='M')return {r,q:'',bass};
  return null;
};
// Une grille : on garde tous les mots qui sont des accords (on peut coller une grille avec paroles)
M.parseGrid=txt=>txt.split(/[\s|,;()\[\]]+/).filter(t=>/^[A-GLMRS]/.test(t)).map(M.parseChord).filter(Boolean);
M.chordTones=c=>M.QUALS[c.q].map(i=>(c.r+i)%12);
M.chordName=(c,nm)=>nm[c.r]+M.QSHOW[c.q]+(c.bass!=null&&c.bass!==c.r?'/'+nm[c.bass]:'');

// Tonalités : k<12 majeur sur k, k>=12 mineur sur k-12
M.kRoot=k=>k%12;M.kMin=k=>k>=12;M.kScale=k=>k>=12?M.MIN:M.MAJ;
M.kName=(k,fr)=>{const nm=M.names(M.kRoot(k),M.kMin(k),fr);return nm[M.kRoot(k)]+(M.kMin(k)?(fr?' mineur':' minor'):(fr?' majeur':' major'));};
const isMinQ=q=>q==='m'||q==='m7'||q==='dim'||q==='m7b5';
// Tonalité d'une grille d'accords : accords dans la gamme, accord de tonique (surtout au début et à la fin),
// dominante (V) et enchaînements V → I.
M.keysFromChords=chords=>{
  if(!chords.length)return [];
  const sc=[];
  for(let k=0;k<24;k++){
    const r=M.kRoot(k),scale=M.kScale(k),minor=M.kMin(k);let s=0;
    const tonic=c=>c.r===r&&(minor?isMinQ(c.q):!isMinQ(c.q)&&c.q!=='aug');
    const dom=c=>(c.r-r+12)%12===7&&!isMinQ(c.q);
    chords.forEach((c,i)=>{const t=M.chordTones(c),inS=t.filter(x=>scale.includes((x-r+12)%12)).length/t.length;
      s+=inS===1?1.5:inS*.4;
      if(tonic(c))s+=1;else if(dom(c))s+=.6;else if((c.r-r+12)%12===5)s+=.25;
      if(i&&dom(chords[i-1])&&tonic(c))s+=.6;});
    s/=chords.length;
    if(tonic(chords[0]))s+=.35;if(tonic(chords[chords.length-1]))s+=.45;
    sc.push(s);
  }
  const mx=Math.max(...sc),ex=sc.map(v=>Math.exp((v-mx)*6)),tot=ex.reduce((a,b)=>a+b,0);
  return sc.map((v,k)=>({k,p:ex[k]/tot})).sort((a,b)=>b.p-a.p);
};
// Degré d'un accord dans une tonalité (chiffres romains), et s'il est emprunté
const NUM=['I','II','III','IV','V','VI','VII'],MAJREF=['I','bII','II','bIII','III','IV','#IV','V','bVI','VI','bVII','VII'];
M.roman=(c,k)=>{
  const sc=M.kScale(k),iv=(c.r-M.kRoot(k)+12)%12,step=sc.indexOf(iv);
  let n=step>=0?NUM[step]:MAJREF[iv];
  if(isMinQ(c.q))n=n.replace(/[IV]+/,x=>x.toLowerCase());
  n+=({dim:'°',m7b5:'ø7','7':'7',maj7:'maj7',m7:'7',aug:'+'})[c.q]||'';
  const borrowed=!M.chordTones(c).every(t=>sc.includes((t-M.kRoot(k)+12)%12));
  return {n,borrowed};
};
// Accords de la gamme (I ii iii IV V vi vii° en majeur, i ii° III iv v VI VII en mineur)
M.diatonic=k=>{const sc=M.kScale(k),r=M.kRoot(k);return sc.map((iv,i)=>{const third=(sc[(i+2)%7]-iv+12)%12,fifth=(sc[(i+4)%7]-iv+12)%12;
  const q=third===4?'':fifth===6?'dim':'m';return {r:(r+iv)%12,q};});};

// ---------- Doigtés d'accords ----------
// Cases de la corde grave (Mi) à la corde aiguë (mi) ; null = corde non jouée
const ESH={'':[0,2,2,1,0,0],m:[0,2,2,0,0,0],'7':[0,2,0,1,0,0],m7:[0,2,0,0,0,0],maj7:[0,null,1,1,0,null],sus4:[0,2,2,2,0,0],sus2:[0,2,4,4,0,0],'5':[0,2,2,null,null,null],dim:[0,1,2,0,null,null],aug:[0,3,2,1,1,0],'6':[0,2,2,1,2,0],add9:[0,2,2,1,0,2],m7b5:[0,1,0,0,null,null]};
const ASH={'':[null,0,2,2,2,0],m:[null,0,2,2,1,0],'7':[null,0,2,0,2,0],m7:[null,0,2,0,1,0],maj7:[null,0,2,1,2,0],sus2:[null,0,2,2,0,0],sus4:[null,0,2,2,3,0],'5':[null,0,2,2,null,null],dim:[null,0,1,2,1,null],m7b5:[null,0,1,0,1,null],aug:[null,0,3,2,2,1],'6':[null,0,2,2,2,2],add9:[null,0,2,4,2,0]};
const OPENV={'0|':[null,3,2,0,1,0],'0|7':[null,3,2,3,1,0],'0|maj7':[null,3,2,0,0,0],'0|add9':[null,3,2,0,3,0],
  '2|':[null,null,0,2,3,2],'2|m':[null,null,0,2,3,1],'2|7':[null,null,0,2,1,2],'2|m7':[null,null,0,2,1,1],'2|maj7':[null,null,0,2,2,2],'2|sus2':[null,null,0,2,3,0],'2|sus4':[null,null,0,2,3,3],
  '5|maj7':[null,null,3,2,1,0],'7|':[3,2,0,0,0,3],'7|7':[3,2,0,0,0,1],'11|7':[null,2,1,2,0,2]};
M.voicings=c=>{
  const out=[],add=(fr,label)=>{const key=fr.join(',');if(!out.some(v=>v.key===key))out.push({fr,label,key});};
  if(OPENV[c.r+'|'+c.q])add(OPENV[c.r+'|'+c.q],'ouvert');
  const e=(c.r-4+12)%12,a=(c.r-9+12)%12;
  if(ESH[c.q]){add(ESH[c.q].map(x=>x==null?null:x+e),e?`barré, forme de Mi, case ${e}`:'ouvert');}
  if(ASH[c.q]){add(ASH[c.q].map(x=>x==null?null:x+a),a?`barré, forme de La, case ${a}`:'ouvert');}
  return out.filter(v=>Math.max(...v.fr.filter(x=>x!=null))<=15).sort((x,y)=>(x.label==='ouvert'?-1:0)-(y.label==='ouvert'?-1:0)||Math.min(...x.fr.filter(v=>v!=null))-Math.min(...y.fr.filter(v=>v!=null)));
};
const LOWHI=[40,45,50,55,59,64];// hauteur à vide de la corde grave à la corde aiguë
M.voicingMidis=fr=>fr.map((f,i)=>f==null?null:LOWHI[i]+f).filter(v=>v!=null);

// Diagramme d'accord vertical (comme sur une grille d'accords) ; points = degré dans l'accord
M.chordBox=(v,c,nm)=>{
  const fr=v.fr,played=fr.filter(f=>f!=null&&f>0),min=played.length?Math.min(...played):1,max=played.length?Math.max(...played):1;
  const base=max<=4?1:min,rows=Math.max(4,max-base+1);
  const W=160,sw=22,fh=26,x0=30,y0=34,H=y0+rows*fh+26;
  const x=i=>x0+i*sw,y=f=>y0+(f-base+.5)*fh;
  let g='';
  g+=base===1?`<rect x="${x0-1}" y="${y0-5}" width="${5*sw+2}" height="5" fill="var(--str)"/>`:`<text x="${x0-13}" y="${y0+fh*.6}" font-size="11" text-anchor="end" fill="var(--mut)">${base}</text>`;
  for(let k=0;k<=rows;k++)g+=`<line x1="${x0}" y1="${y0+k*fh}" x2="${x0+5*sw}" y2="${y0+k*fh}" stroke="var(--line2)" stroke-width="1.3"/>`;
  for(let i=0;i<6;i++)g+=`<line x1="${x(i)}" y1="${y0}" x2="${x(i)}" y2="${y0+rows*fh}" stroke="var(--str)" stroke-width="${2.2-i*.25}"/>`;
  fr.forEach((f,i)=>{
    if(f==null){g+=`<text x="${x(i)}" y="${y0-12}" font-size="12" text-anchor="middle" fill="var(--mut)">×</text>`;return;}
    const pc=(LOWHI[i]+f)%12,d=(pc-c.r+12)%12,lab=M.IV[d],isR=d===0;
    if(f===0){g+=`<circle cx="${x(i)}" cy="${y0-15}" r="6" fill="none" stroke="${isR?'var(--root)':'var(--str)'}" stroke-width="1.6"/>`;}
    else g+=`<circle cx="${x(i)}" cy="${y(f)}" r="9.5" fill="${isR?'var(--root)':'var(--acc)'}"/><text x="${x(i)}" y="${y(f)+3.6}" font-size="9.5" font-weight="700" text-anchor="middle" fill="#fff">${lab}</text>`;
    g+=`<text x="${x(i)}" y="${y0+rows*fh+16}" font-size="9.5" text-anchor="middle" fill="var(--mut)">${nm[pc]}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="system-ui,sans-serif" style="max-width:100%;height:auto">${g}</svg>`;
};

// ---------- Manche ----------
// dots : [{s,f,txt,fill,stroke,tc,sw,op,cls,data}] ; box : {lo,hi} position surlignée ; hit : zones cliquables sur chaque case
M.neck=o=>{
  const lo=o.lo||0,hi=o.hi||12,vert=!!o.vert,first=Math.max(lo,1),nCols=hi-first+1;
  const fw=vert?(o.fw||42):(o.fw||50),sh=vert?(o.sh||44):(o.sh||30),r=o.r||(vert?13:11),openW=lo===0?(vert?34:36):0,lab=vert?24:22,top=vert?24:16;
  const head=lab+openW,A=f=>f===0?head-openW/2-2:head+(f-first+0.5)*fw,B=s=>vert?top+(5-s)*sh:top+s*sh;
  const XY=(a,b)=>vert?[b,a]:[a,b];
  const aEnd=head+nCols*fw,bEnd=top+5*sh,W=vert?bEnd+40:aEnd+10,H=vert?aEnd+10:bEnd+30+(o.bands&&o.bands.some(b=>b.label)?18:0);
  const line=(a1,b1,a2,b2,at)=>{const[x1,y1]=XY(a1,b1),[x2,y2]=XY(a2,b2);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${at}/>`;};
  let g='';
  (o.bands||[]).forEach(b=>{const a0=b.lo===0&&lo===0?head-openW:A(Math.max(b.lo,first))-fw/2,a1=A(Math.min(b.hi,hi))+fw/2,[x,y]=XY(a0,top-14),[w,h]=vert?[5*sh+28,a1-a0]:[a1-a0,5*sh+28];
    g+=`<g class="band ${b.cls||''}" ${b.data||''}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${b.fill}" fill-opacity="${b.op==null?.16:b.op}" stroke="${b.stroke||b.fill}" stroke-opacity=".7" stroke-width="${b.sw||1.5}"/>`+
      (b.label?(()=>{const[lx,ly]=vert?[x-0,(a0+a1)/2]:[(a0+a1)/2,top+5*sh+40];return vert?'':`<text x="${lx}" y="${ly}" font-size="12" font-weight="700" text-anchor="middle" fill="${b.stroke||b.fill}">${b.label}</text>`;})():'')+`</g>`;});
  if(o.box){const a0=o.box.lo===0?head-openW:A(Math.max(o.box.lo,first))-fw/2,a1=A(o.box.hi)+fw/2,[x,y]=XY(a0,top-14),[w,h]=vert?[5*sh+28,a1-a0]:[a1-a0,5*sh+28];
    g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--accL)" stroke="var(--acc)" stroke-opacity=".55" stroke-width="1.5"/>`;}
  [3,5,7,9,15].filter(f=>f>=first&&f<=hi).forEach(f=>{const[x,y]=XY(A(f),top+2.5*sh);g+=`<circle cx="${x}" cy="${y}" r="4" fill="var(--line2)"/>`;});
  if(hi>=12&&first<=12)[1.5,3.5].forEach(k=>{const[x,y]=XY(A(12),top+k*sh);g+=`<circle cx="${x}" cy="${y}" r="4" fill="var(--line2)"/>`;});
  for(let k=0;k<=nCols;k++){const aa=head+k*fw;g+=line(aa,top,aa,bEnd,`stroke="${k===0&&first===1?'var(--str)':'var(--line2)'}" stroke-width="${k===0&&first===1?5:1.5}"`);}
  for(let s=0;s<6;s++){g+=line(head,B(s),aEnd,B(s),`stroke="var(--str)" stroke-width="${0.8+s*0.3}"`);const[x,y]=vert?[B(s),12]:[4,B(s)+4];g+=`<text x="${x}" y="${y}" font-size="11" text-anchor="${vert?'middle':'start'}" fill="var(--mut)">${M.SN[s]}</text>`;}
  for(let f=first;f<=hi;f++)if([3,5,7,9,12,15].includes(f)){const[x,y]=vert?[bEnd+24,A(f)+4]:[A(f),bEnd+24];g+=`<text x="${x}" y="${y}" font-size="11" text-anchor="middle" fill="${f===12?'var(--fg)':'var(--mut)'}">${f}</text>`;}
  if(o.hit)for(let s=0;s<6;s++)for(let f=lo;f<=hi;f++){const a0=f===0?head-openW:head+(f-first)*fw,w=f===0?openW:fw,[x,y]=XY(a0,B(s)-sh/2),[ww,hh]=vert?[sh,w]:[w,sh];
    g+=`<rect class="hit" data-s="${s}" data-f="${f}" x="${x}" y="${y}" width="${ww}" height="${hh}" fill="transparent"/>`;}
  (o.dots||[]).forEach(d=>{const[cx,cy]=XY(A(d.f),B(d.s)),t=d.txt==null?'':String(d.txt),fs=(t.length>3?7.5:t.length>2?8.5:9.5)*(vert?1.15:1);
    g+=`<g class="dotg ${d.cls||''}" ${d.data||''} opacity="${d.op==null?1:d.op}" style="pointer-events:none"><circle class="dot" cx="${cx}" cy="${cy}" r="${d.r||r}" fill="${d.fill||'var(--card)'}" stroke="${d.stroke||'var(--str)'}" stroke-width="${d.sw||1}"/>${t?`<text x="${cx}" y="${cy+fs*.36}" font-size="${fs}" text-anchor="middle" fill="${d.tc||'var(--fg)'}" font-weight="${d.fw||500}">${t}</text>`:''}</g>`;});
  return `<svg viewBox="0 0 ${W} ${H}" font-family="system-ui,sans-serif" style="width:100%;height:auto;display:block;margin:auto;max-width:${Math.round(W*(vert?1.15:1.45))}px">${g}</svg>`;
};

// ---------- Son ----------
let ctx=null,master=null,noise=null;
M.audio=()=>{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;ctx=new C();master=ctx.createGain();master.gain.value=.9;master.connect(ctx.destination);}
  if(ctx.state!=='running')ctx.resume();return ctx;};
M.now=()=>M.audio().currentTime;
// Corde pincée : triangle + octave, filtre qui se ferme, extinction naturelle
M.pluck=(t,midi,vol=.3,dur=1.6)=>{const c=M.audio(),f=440*Math.pow(2,(midi-69)/12),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain(),lp=c.createBiquadFilter();
  o.type='triangle';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2;g2.gain.value=.22;
  lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(f*8,12000),t);lp.frequency.exponentialRampToValueAtTime(f*1.5,t+.6);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o2.connect(g2).connect(lp);o.connect(lp);lp.connect(g).connect(master);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05);};
M.strum=(t,midis,{down=true,spread=.014,vol=.18,dur=1.8}={})=>{const ns=down?midis.slice().sort((a,b)=>a-b):midis.slice().sort((a,b)=>b-a);ns.forEach((m,i)=>M.pluck(t+i*spread,m,vol,dur));};
M.bass=(t,midi,dur=.5,vol=.45)=>{const c=M.audio(),o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=440*Math.pow(2,(midi-69)/12);
  lp.type='lowpass';lp.frequency.value=380;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(lp).connect(g).connect(master);o.start(t);o.stop(t+dur+.05);};
const noiseBuf=()=>{if(noise)return noise;const c=M.audio(),b=c.createBuffer(1,c.sampleRate*.5,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noise=b;return b;};
M.kick=(t,vol=.9)=>{const c=M.audio(),o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(master);o.start(t);o.stop(t+.32);};
M.snare=(t,vol=.35)=>{const c=M.audio(),n=c.createBufferSource(),g=c.createGain(),hp=c.createBiquadFilter();n.buffer=noiseBuf();hp.type='highpass';hp.frequency.value=1200;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);n.connect(hp).connect(g).connect(master);n.start(t);n.stop(t+.2);};
M.hat=(t,vol=.12)=>{const c=M.audio(),n=c.createBufferSource(),g=c.createGain(),hp=c.createBiquadFilter();n.buffer=noiseBuf();hp.type='highpass';hp.frequency.value=7000;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);n.connect(hp).connect(g).connect(master);n.start(t);n.stop(t+.06);};

// Clic de métronome : accent = plus aigu et plus fort
M.click=(t,accent,vol=.5,f)=>{const c=M.audio(),o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=f||(accent?1760:1175);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol*(accent?1:.6),t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.045);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5000;o.connect(lp).connect(g).connect(master);o.start(t);o.stop(t+.06);};

// ---------- Micro : reconnaissance de la note jouée ----------
// Algorithme YIN sur le signal du micro. M.mic.start(cb) appelle cb({f,midi,cents,rms,clar}) ~30 fois par seconde
// (f=0 quand rien n'est joué). Option onNote(midi) : appelée une fois par note tenue (attaque détectée).
M.A4=()=>M.get('gt.a4',440);
M.freqToMidi=f=>69+12*Math.log2(f/M.A4());
M.midiName=(m,nm)=>(nm||M.FRS)[((m%12)+12)%12]+(Math.floor(m/12)-1);
function yin(x,sr){
  const N=x.length,W=Math.floor(N/2),tMin=Math.floor(sr/1400),tMax=Math.min(W-1,Math.floor(sr/60)),d=new Float32Array(tMax+2);
  for(let t=1;t<=tMax+1;t++){let s=0;for(let i=0;i<W;i++){const v=x[i]-x[i+t];s+=v*v;}d[t]=s;}
  let run=0;d[0]=1;for(let t=1;t<=tMax+1;t++){run+=d[t];d[t]=run?d[t]*t/run:1;}
  let tau=-1;for(let t=tMin;t<=tMax;t++){if(d[t]<.15){while(t+1<=tMax&&d[t+1]<d[t])t++;tau=t;break;}}
  if(tau<0){let b=tMin;for(let t=tMin;t<=tMax;t++)if(d[t]<d[b])b=t;if(d[b]>.35)return null;tau=b;}
  const a=d[tau-1],b=d[tau],c=d[tau+1],den=a-2*b+c,sh=den?(a-c)/(2*den):0;
  return {f:sr/(tau+(Math.abs(sh)<1?sh:0)),clar:1-b};
}
M.mic={on:false,stream:null,src:null,an:null,timer:null,
  async start(cb,opt={}){
    if(this.on){this.cb=cb;this.opt=opt;return true;}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('nomic');
    try{if(navigator.audioSession)navigator.audioSession.type='play-and-record';}catch(e){}
    const c=M.audio();
    this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    this.src=c.createMediaStreamSource(this.stream);this.an=c.createAnalyser();this.an.fftSize=4096;this.src.connect(this.an);
    this.on=true;this.cb=cb;this.opt=opt;const buf=new Float32Array(this.an.fftSize),hist=[];let held=null,cnt=0,silent=0,armed=true,lastRms=0;
    this.timer=setInterval(()=>{
      this.an.getFloatTimeDomainData(buf);let rms=0;for(let i=0;i<buf.length;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/buf.length);
      const thr=this.opt.thr||.008;let out={f:0,midi:null,cents:0,rms,clar:0};
      // attaque : le volume remonte nettement → on réarme la détection de note
      if(rms>lastRms*1.8&&rms>thr*2)armed=true;lastRms=rms*.6+lastRms*.4;
      if(rms>thr){const r=yin(buf.subarray(0,2048),c.sampleRate);
        if(r){let f=r.f;hist.push(f);if(hist.length>5)hist.shift();const med=hist.slice().sort((a,b)=>a-b)[hist.length>>1];
          // une seule valeur aberrante (souvent l'octave) est remplacée par la médiane
          if(Math.abs(1200*Math.log2(f/med))>80)f=med;
          const mf=M.freqToMidi(f),midi=Math.round(mf);out={f,midi,cents:(mf-midi)*100,rms,clar:r.clar};}}
      if(out.midi==null){silent++;if(silent>4){held=null;cnt=0;armed=true;hist.length=0;}}else silent=0;
      if(out.midi!=null){if(out.midi===held)cnt++;else{held=out.midi;cnt=1;armed=true;}
        if(cnt>=3&&armed&&this.opt.onNote){armed=false;this.opt.onNote(out.midi,out);}}
      try{this.cb&&this.cb(out);}catch(e){console.error(e);}
    },33);
    return true;},
  stop(){if(!this.on)return;clearInterval(this.timer);try{this.src.disconnect();}catch(e){}this.stream.getTracks().forEach(t=>t.stop());
    this.on=false;this.cb=null;try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}}
};
// Petit bouton micro réutilisable : M.micButton(btn,{onFrame,onNote,onStart,onStop})
M.micButton=(btn,h)=>{btn.classList.add('mic');const base=btn.dataset.label||btn.textContent;btn.innerHTML=`${base} <span class="lvl"><i></i></span>`;
  const lvl=btn.querySelector('.lvl i');
  btn.addEventListener('click',async()=>{
    if(M.mic.on){M.mic.stop();btn.classList.remove('on');lvl.style.width=0;h.onStop&&h.onStop();return;}
    M.mic.err=false;
    try{await M.mic.start(o=>{lvl.style.width=Math.min(100,o.rms*900)+'%';h.onFrame&&h.onFrame(o);},{onNote:h.onNote,thr:h.thr});btn.classList.add('on');h.onStart&&h.onStart();}
    catch(e){M.mic.err=true;h.onError?h.onError(e):alert('Impossible d\'utiliser le micro. Autorise-le dans les réglages du navigateur (le site doit être ouvert en https).');}
  });
};

// ---------- Déblocage du son sur iPhone / iPad ----------
// 1) Safari ne démarre le son qu'après un geste de l'utilisateur : au premier toucher, on crée et relance le contexte audio.
// 2) Le bouton « silencieux » de l'iPhone coupe le son Web Audio : on passe la session en mode « lecture »
//    (navigator.audioSession, iOS 16.4+) et on joue un court son muet en boucle via <audio>, ce qui a le même effet
//    sur les versions plus anciennes. Ça vaut aussi pour les onglets qui ont leur propre moteur audio.
let unlocked=false;
function silentWavURL(){const n=800,b=new ArrayBuffer(44+n),v=new DataView(b),w=(o,t)=>[...t].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
  w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
  v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);
  for(let i=0;i<n;i++)v.setUint8(44+i,128);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}));}
M.unlock=()=>{
  try{if(navigator.audioSession&&!(M.mic&&M.mic.on))navigator.audioSession.type='playback';}catch(e){}
  try{const c=M.audio(),src=c.createBufferSource();src.buffer=c.createBuffer(1,1,22050);src.connect(c.destination);src.start(0);}catch(e){}
  if(unlocked)return;unlocked=true;
  try{const a=document.createElement('audio');a.src=silentWavURL();a.loop=true;a.setAttribute('playsinline','');a.volume=.01;const p=a.play();if(p&&p.catch)p.catch(()=>{unlocked=false;});}catch(e){unlocked=false;}
};
['touchend','pointerup','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>M.unlock(),{capture:true,passive:true}));
// Au retour dans l'onglet, Safari suspend parfois le son : on le relance au prochain toucher
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ctx&&ctx.state!=='running')ctx.resume();});

// Mémoire du navigateur (sans erreur si elle est indisponible)
M.get=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
M.set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
window.M=M;
})();
