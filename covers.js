(function(){
  var cards=document.querySelectorAll(".bk-card");
  if(!cards.length || !window.fetch) return;
  var KEY=document.documentElement.getAttribute("data-books-key")||"";
  var cache={};
  try { cache=JSON.parse(localStorage.getItem("lh-covers3")||"{}")||{}; } catch(e) {}
  function save(){ try { localStorage.setItem("lh-covers3", JSON.stringify(cache)); } catch(e) {} }
  function apply(card, info){
    if(!info || !info.thumb) return;
    var img=document.createElement("img"); img.alt="Cover of "+card.dataset.title; img.loading="lazy";
    img.onload=function(){ if(img.naturalWidth<20) return; var c=card.querySelector(".cover"); c.innerHTML="";
      var a=document.createElement("a"); a.href=info.link||"#"; a.target="_blank"; a.rel="noopener"; a.appendChild(img); c.appendChild(a); };
    img.src=info.thumb;
  }
  function openlib(t,au){
    var u="https://openlibrary.org/search.json?limit=3&fields=cover_i,key,title&title="+encodeURIComponent(t)+"&author="+encodeURIComponent(au);
    return fetch(u).then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
      if(!d||!d.docs) return null;
      for (var i=0;i<d.docs.length;i++){ var doc=d.docs[i]; if(doc.cover_i) return {thumb:"https://covers.openlibrary.org/b/id/"+doc.cover_i+"-M.jpg", link:"https://openlibrary.org"+doc.key}; }
      return null; });
  }
  function google(t,au){
    if(!KEY) return Promise.resolve(null);
    var q='intitle:"'+t+'" inauthor:"'+au+'"';
    return fetch("https://www.googleapis.com/books/v1/volumes?maxResults=1&key="+KEY+"&q="+encodeURIComponent(q))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){ var v=d&&d.items&&d.items[0]&&d.items[0].volumeInfo; if(!v||!v.imageLinks) return null;
        var th=(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail||"").replace(/^http:/,"https:").replace("&edge=curl","");
        return th ? {thumb:th, link:v.infoLink} : null; });
  }
  var queue=[].slice.call(cards).filter(function(c){ var k=c.dataset.title+"|"+c.dataset.author; if(cache[k]){ apply(c, cache[k]); return false; } return true; });
  (function next(i){
    if(i>=queue.length) return;
    var card=queue[i], t=card.dataset.title, au=card.dataset.author, k=t+"|"+au;
    openlib(t,au).catch(function(){ return null; })
      .then(function(info){ return info || google(t,au).catch(function(){ return null; }); })
      .then(function(info){ if(info){ cache[k]=info; save(); apply(card, info); } })
      .then(function(){ setTimeout(function(){ next(i+1); }, 350); });
  })(0);
})();
