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
    '<div class="subtabs">'+GROUPS[cur].tools.map(function(t){return '<a href="'+url(t.href)+'"'+(norm(t.href)===here?' aria-current="page"':'')+'>'+t.label+'</a>';}).join('')+'</div>';
})();
