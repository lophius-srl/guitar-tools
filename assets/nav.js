// Liste des onglets du site. Ajouter un outil = ajouter une ligne ici.
(function(){
  var TOOLS=[
    {href:'index.html',label:'Tab → Gamme'},
    {href:'gammes.html',label:'Gammes'}
  ];
  var nav=document.getElementById('tabs');if(!nav)return;
  var here=location.pathname.split('/').pop()||'index.html';
  nav.innerHTML=TOOLS.map(function(t){return '<a href="'+t.href+'"'+(t.href===here?' aria-current="page"':'')+'>'+t.label+'</a>';}).join('');
})();
