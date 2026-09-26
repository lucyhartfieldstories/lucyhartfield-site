(function(){
  var cards=document.querySelectorAll(".bk-card");
  if(!cards.length || !window.fetch) return;
  var cache={};
  try { cache=JSON.parse(sessionStorage.getItem("lh-covers")||"{}")||{}; } catch(e) {}
  function apply(card, info){
    if(!info || !info.thumb) return;
    var a=document.createElement("a"); a.href=info.link||"#"; a.target="_blank"; a.rel="noopener";
    var img=document.createElement("img"); img.src=info.thumb; img.alt="Cover of "+card.dataset.title; img.loading="lazy";
    a.appendChild(img); var c=card.querySelector(".cover"); c.innerHTML=""; c.appendChild(a);
  }
  cards.forEach(function(card, i){
    var key=card.dataset.title+"|"+card.dataset.author;
    if(cache[key]){ apply(card, cache[key]); return; }
    var q='intitle:"'+card.dataset.title+'" inauthor:"'+card.dataset.author+'"';
    setTimeout(function(){
      fetch("https://www.googleapis.com/books/v1/volumes?maxResults=1&fields=items(volumeInfo(imageLinks,infoLink))&q="+encodeURIComponent(q))
      .then(function(r){ return r.json(); })
      .then(function(d){
        var v=d.items&&d.items[0]&&d.items[0].volumeInfo; if(!v||!v.imageLinks) return;
        var t=(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail||"").replace(/^http:/,"https:").replace(/&edge=curl/,"");
        var info={thumb:t, link:v.infoLink};
        cache[key]=info; try { sessionStorage.setItem("lh-covers", JSON.stringify(cache)); } catch(e) {}
        apply(card, info);
      }).catch(function(){});
    }, i*120);
  });
})();
