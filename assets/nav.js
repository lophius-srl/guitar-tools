// Navigation du site : 4 familles, puis les onglets de la famille ouverte.
// Ajouter un outil = ajouter une ligne dans la bonne famille.
(function(){
  var GROUPS=[
    {label:'Analyser',tools:[
      {href:'index.html',label:'Tab → Gamme'},
      {href:'analyse.html',label:'Analyse'},
      {href:'accords.html',label:'Accords'}]},
    {label:'Théorie',tools:[
      {href:'gammes.html',label:'Gammes'},
      {href:'caged.html',label:'CAGED'},
      {href:'cercle.html',label:'Cercle'}]},
    {label:'Pratiquer',tools:[
      {href:'improviser.html',label:'Improviser'},
      {href:'manche.html',label:'Manche'},
      {href:'oreille.html',label:'Oreille'}]},
    {label:'Outils',tools:[
      {href:'accordeur.html',label:'Accordeur'},
      {href:'metronome.html',label:'Métronome'}]}
  ];
  var nav=document.getElementById('tabs');if(!nav)return;
  // GitHub Pages / Cloudflare servent /gammes comme /gammes.html : on compare sans l'extension
  var norm=function(p){p=(p.split('/').pop()||'index').replace(/\.html$/,'');return p||'index';};
  var url=function(h){return h==='index.html'?'./':h.replace(/\.html$/,'');};
  var here=norm(location.pathname),cur=0;
  GROUPS.forEach(function(g,i){g.tools.forEach(function(t){if(norm(t.href)===here)cur=i;});});
  // Chaque famille rouvre le dernier onglet visité dans cette famille
  var last={};try{last=JSON.parse(localStorage.getItem('gt.navLast')||'{}')||{};}catch(e){}
  last[cur]=here;try{localStorage.setItem('gt.navLast',JSON.stringify(last));}catch(e){}
  var target=function(g,i){var l=last[i];var t=g.tools.filter(function(x){return norm(x.href)===l;})[0]||g.tools[0];return url(t.href);};
  nav.innerHTML='<div class="groups">'+GROUPS.map(function(g,i){return '<a href="'+target(g,i)+'"'+(i===cur?' class="on"':'')+'>'+g.label+'</a>';}).join('')+'</div>'+
    '<div class="subtabs">'+GROUPS[cur].tools.map(function(t){return '<a href="'+url(t.href)+'"'+(norm(t.href)===here?' aria-current="page"':'')+'>'+t.label+'</a>';}).join('')+
    '<label class="voice" title="Son de guitare utilisé partout sur le site"><span>Son</span><select id="voiceSel" aria-label="Son de guitare"></select></label></div>';
  // Choix du son de guitare (commun à tous les onglets)
  window.addEventListener('DOMContentLoaded',function(){var sel=document.getElementById('voiceSel');if(!sel||!window.M)return;
    sel.innerHTML=M.VOICES.map(function(v){return '<option value="'+v[0]+'">'+v[1]+'</option>';}).join('');sel.value=M.voice();
    sel.onchange=function(){M.setVoice(sel.value);M.warmVoice();var t=M.now()+.05;M.strum(t,[45,52,57,61,64],{vol:.18,spread:.025,dur:1.6});};
    M.warmVoice();});

  // Application installable (écran d'accueil) et utilisable hors ligne
  if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
  var standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  var prompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();prompt=e;});
  var foot=document.querySelector('footer');
  if(foot&&!standalone){
    var a=document.createElement('a');a.href='#';a.textContent='Installer l\'app sur ton téléphone';a.style.marginLeft='6px';
    var tip=document.createElement('div');tip.hidden=true;tip.style.cssText='margin-top:8px;font-size:13px;color:var(--fg);background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px';
    var ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    tip.innerHTML=ios?'Sur iPhone / iPad, dans <b>Safari</b> : touche <b>Partager</b> (le carré avec une flèche), puis <b>« Sur l\'écran d\'accueil »</b>. Guitar tools s\'ouvrira en plein écran, comme une app, et marchera même sans réseau.':
      'Dans le menu du navigateur (⋮), choisis <b>« Installer l\'application »</b> ou <b>« Ajouter à l\'écran d\'accueil »</b>. Guitar tools s\'ouvrira en plein écran, comme une app, et marchera même sans réseau.';
    a.onclick=function(e){e.preventDefault();if(prompt){prompt.prompt();prompt=null;}else tip.hidden=!tip.hidden;};
    foot.appendChild(document.createTextNode(' ·'));foot.appendChild(a);foot.appendChild(tip);
  }
})();
