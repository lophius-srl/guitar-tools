// Liste des onglets du site. Ajouter un outil = ajouter une ligne ici.
(function(){
  var TOOLS=[
    {href:'index.html',label:'Tab → Gamme'},
    {href:'gammes.html',label:'Gammes'},
    {href:'analyse.html',label:'Analyse (bêta)'}
  ];
  var nav=document.getElementById('tabs');if(!nav)return;
  // Cloudflare sert /gammes au lieu de /gammes.html : on compare sans l'extension
  var norm=function(p){p=(p.split('/').pop()||'index').replace(/\.html$/,'');return p||'index';};
  var here=norm(location.pathname);
  nav.innerHTML=TOOLS.map(function(t){return '<a href="'+t.href.replace(/\.html$/,'').replace(/^index$/,'./')+'"'+(norm(t.href)===here?' aria-current="page"':'')+'>'+t.label+'</a>';}).join('');
})();
