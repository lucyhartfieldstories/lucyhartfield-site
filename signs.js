(function(){
  var KEY="lh-signs", TOTAL=5, found={};
  try { found=JSON.parse(localStorage.getItem(KEY)||"{}")||{}; } catch(e) { found={}; }
  function count(){ return Object.keys(found).length; }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(found)); } catch(e) {} }
  function toast(html){
    var t=document.createElement("div"); t.className="lh-toast"; t.setAttribute("role","status"); t.innerHTML=html;
    document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 6000);
  }
  var signs=document.querySelectorAll(".lh-sign");
  for (var i=0;i<signs.length;i++){ (function(el){
    var id=el.getAttribute("data-sign");
    if (found[id]) el.classList.add("found");
    el.addEventListener("click", function(){
      if (!found[id]) { found[id]=true; save(); el.classList.add("found"); }
      var n=count();
      if (n>=TOTAL) toast('You found all five signs! <a href="/signs/">Claim your reward</a>');
      else toast('Sign '+n+' of '+TOTAL+' found. There are signs along the way... <a href="/signs/">Keep looking</a>');
    });
  })(signs[i]); }
  var prog=document.getElementById("hunt-progress");
  if (prog){
    var n=count();
    for (var k=1;k<=TOTAL;k++){ var sp=document.createElement("span"); sp.textContent=k; if (found[k]) sp.className="on"; prog.appendChild(sp); }
    var r=document.getElementById("hunt-reward"), h=document.getElementById("hunt-hint");
    if (n>=TOTAL && r){ r.classList.add("open"); if (h) h.style.display="none"; }
  }
  var reset=document.getElementById("hunt-reset");
  if (reset) reset.addEventListener("click", function(){ found={}; save(); location.reload(); });
})();
