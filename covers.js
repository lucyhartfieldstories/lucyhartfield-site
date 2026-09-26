(function(){
  var cards=document.querySelectorAll(".bk-card");
  if(!cards.length || !window.fetch) return;
  var cache={};
  try { cache=JSON.parse(sessionStorage.getItem("lh-covers2")||"{}")||{}; } catch(e) {}
  function apply(card, info){
    if(!info || !info.thumb) return;
    var img=document.createElement("img"); img.alt="Cover of "+card.dataset.title; img.loading="lazy";
    img.onload=function(){ var c=card.querySelector(".cover"); c.innerHTML="";
      if(info.link){ var a=document.createElement("a"); a.href=info.link; a.target="_blank"; a.rel="noopener"; a.appendChild(img); c.appendChild(a); } else { c.appendChild(img); } };
    img.src=info.thumb;
  }
  function google(t,au){
    var q='intitle:"'+t+'" inauthor:"'+au+'"';
    return fetch("https://www.googleapis.com/books/v1/volumes?maxResults=1&q="+encodeURIComponent(q))
      .then(function(r){ return r.json(); })
      .then(function(d){ var v=d.items&&d.items[0]&&d.items[0].volumeInfo; if(!v||!v.imageLinks) return null;
        var th=(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail||"").replace(/^http:/,"https:").replace("&edge=curl","");
        return th ? {thumb:th, link:v.infoLink} : null; });
  }
  function openlib(t,au){
    return fetch("https://openlibrary.org/search.json?limit=1&fields=cover_i,key&title="+encodeURIComponent(t)+"&author="+encodeURIComponent(au))
      .then(function(r){ return r.json(); })
      .then(function(d){ var doc=d.docs&&d.docs[0]; if(!doc||!doc.cover_i) return null;
        return {thumb:"https://covers.openlibrary.org/b/id/"+doc.cover_i+"-M.jpg", link:"https://openlibrary.org"+doc.key}; });
  }
  cards.forEach(function(card, i){
    var t=card.dataset.title, au=card.dataset.author, key=t+"|"+au;
    if(cache[key]){ apply(card, cache[key]); return; }
    setTimeout(function(){
      google(t,au).catch(function(){ return null; }).then(function(info){ return info || openlib(t,au); })
      .then(function(info){ if(!info) return; cache[key]=info; try { sessionStorage.setItem("lh-covers2", JSON.stringify(cache)); } catch(e) {} apply(card, info); })
      .catch(function(){});
    }, i*150);
  });
})();
