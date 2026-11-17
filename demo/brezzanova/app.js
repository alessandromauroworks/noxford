/* Base comune: menu, comparse, scorrimento, prima/dopo, modulo preventivo (nessun dato inviato). */
(function () {
  "use strict";
  var root = document.documentElement;
  var NX = (window.NX = {});
  var KEY = "nx-no-anim";
  try { if (localStorage.getItem(KEY) === "1") root.classList.add("no-anim"); } catch (e) {}
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("no-anim");
  NX.ridotto = function () {
    return root.classList.contains("no-anim") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  /* avanzamento 0-1 di un elemento mentre attraversa lo schermo */
  NX.progress = function (el, start, end) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var s = start == null ? 0.85 : start, e = end == null ? 0.2 : end;
    var a = vh * s, b = vh * e - r.height;
    var p = (a - r.top) / (a - b);
    return Math.max(0, Math.min(1, p));
  };
  var subs = [], tick = false;
  NX.onScroll = function (fn) { subs.push(fn); fn(); };
  function run() { tick = false; for (var i = 0; i < subs.length; i++) subs[i](); }
  function ask() { if (!tick) { tick = true; requestAnimationFrame(run); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);

  document.addEventListener("DOMContentLoaded", function () {
    /* menu telefono */
    var burger = document.querySelector(".burger"), menu = document.getElementById("menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", String(!open));
        burger.setAttribute("aria-label", open ? "Apri il menu" : "Chiudi il menu");
        menu.classList.toggle("open", !open);
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) { burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Apri il menu"); menu.classList.remove("open"); }
      });
    }
    /* altezza della striscia demo, per le testate fisse */
    var strip = document.querySelector(".demo-strip");
    if (strip) { var sh = function () { root.style.setProperty("--strip-h", strip.offsetHeight + "px"); }; sh(); window.addEventListener("resize", sh); }
    /* testata che cambia allo scorrimento */
    var head = document.querySelector(".hd");
    if (head) NX.onScroll(function () { head.classList.toggle("scrolled", window.scrollY > 40); });

    /* comparse */
    var rv = document.querySelectorAll(".rv");
    if ("IntersectionObserver" in window && !NX.ridotto()) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      rv.forEach(function (el) { io.observe(el); });
    } else rv.forEach(function (el) { el.classList.add("in"); });

    /* barra fissa su telefono */
    var mbar = document.querySelector(".mbar"), hero = document.querySelector("[data-hero]");
    if (mbar && hero) NX.onScroll(function () {
      var r = hero.getBoundingClientRect();
      var form = document.getElementById("preventivo"), fr = form ? form.getBoundingClientRect() : null;
      var inForm = fr && fr.top < window.innerHeight && fr.bottom > 0;
      mbar.classList.toggle("on", r.bottom < 0 && !inForm);
    });

    /* prima e dopo */
    document.querySelectorAll(".ba input").forEach(function (inp) {
      var box = inp.closest(".ba");
      function set() { box.style.setProperty("--x", inp.value + "%"); }
      inp.addEventListener("input", set); set();
    });

    /* interruttore animazioni */
    document.querySelectorAll(".anim-toggle").forEach(function (b) {
      function label() { b.textContent = root.classList.contains("no-anim") ? "Riattiva le animazioni" : "Disattiva le animazioni"; }
      label();
      b.addEventListener("click", function () {
        root.classList.toggle("no-anim");
        try { localStorage.setItem(KEY, root.classList.contains("no-anim") ? "1" : "0"); } catch (e) {}
        label(); ask();
      });
    });
    document.querySelectorAll("[data-anno]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* modulo preventivo: controlla i campi e prepara il messaggio, non invia nulla */
    document.querySelectorAll("form[data-preventivo]").forEach(initForm);
    ask();
  });

  var RE = {
    tel: /^[+]?[0-9 ()./-]{8,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    cap: /^[0-9]{5}$/,
    mq: /^[0-9]{1,4}([.,][0-9]+)?$/
  };
  function errOf(f) { return document.getElementById(f.id + "-err"); }
  function setErr(f, msg) {
    var e = errOf(f);
    if (e) e.textContent = msg || "";
    if (msg) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid");
  }
  function check(f, form) {
    var v = (f.type === "checkbox" ? (f.checked ? "1" : "") : f.value.trim());
    if (f.hasAttribute("data-req") && !v) return f.getAttribute("data-req");
    var t = f.getAttribute("data-tipo");
    if (v && t && RE[t] && !RE[t].test(v)) return f.getAttribute("data-msg") || "Controlla questo campo.";
    if (f.hasAttribute("data-min") && v && v.length < +f.getAttribute("data-min")) return f.getAttribute("data-msg-min");
    if (f.hasAttribute("data-uno")) {
      var group = form.querySelectorAll('[data-uno="' + f.getAttribute("data-uno") + '"]'), any = false;
      group.forEach(function (g) { if (g.value.trim()) any = true; });
      if (!any) return f.getAttribute("data-msg-uno");
    }
    return "";
  }
  function initForm(form) {
    var fields = form.querySelectorAll("input,select,textarea");
    var esito = document.getElementById(form.getAttribute("data-esito"));
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value || f.getAttribute("aria-invalid")) setErr(f, check(f, form)); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid")) setErr(f, check(f, form)); });
      f.addEventListener("change", function () { if (f.type === "checkbox" || f.tagName === "SELECT") setErr(f, check(f, form)); });
    });
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var first = null;
      fields.forEach(function (f) {
        if (f.type === "hidden") return;
        var m = check(f, form); setErr(f, m);
        if (m && !first) first = f;
      });
      if (first) { first.focus(); return; }
      var az = form.getAttribute("data-azienda");
      var righe = [form.getAttribute("data-intro") || ("Buongiorno " + az + ", vorrei un preventivo.")];
      fields.forEach(function (f) {
        var lab = f.getAttribute("data-label");
        if (!lab) return;
        var v = f.type === "checkbox" ? null : f.value.trim();
        if (v) righe.push(lab + ": " + v);
      });
      var extra = form.getAttribute("data-extra");
      if (extra && window.NX[extra]) { var x = window.NX[extra](); if (x) righe.push(x); }
      var testo = righe.join("\n");
      if (!esito) return;
      esito.hidden = false;
      esito.querySelector("pre").textContent = testo;
      esito.querySelector("[data-wa]").href = "https://wa.me/?text=" + encodeURIComponent(testo);
      esito.querySelector("[data-mail]").href = "mailto:?subject=" + encodeURIComponent("Richiesta di preventivo - " + az) + "&body=" + encodeURIComponent(testo);
      var cp = esito.querySelector("[data-copia]");
      if (cp) cp.onclick = function () {
        if (navigator.clipboard) navigator.clipboard.writeText(testo).then(function () { cp.textContent = "Testo copiato"; }, function () {});
      };
      esito.setAttribute("tabindex", "-1");
      esito.focus();
      esito.scrollIntoView({ behavior: NX.ridotto() ? "auto" : "smooth", block: "center" });
    });
  }
})();


(function(){
  var lista=document.getElementById("lista"), ris=document.getElementById("ris"), n=0;
  var TAGLIE=[7000,9000,12000,18000,24000];
  function taglia(b){ for(var i=0;i<TAGLIE.length;i++) if(TAGLIE[i]>=b*0.95) return TAGLIE[i]; return 24000; }
  function aggiungi(nome,mq,sole){
    n++; var id="s"+n, li=document.createElement("li");
    li.innerHTML='<div><label for="'+id+'n">Stanza</label><input type="text" id="'+id+'n" value="'+nome+'"></div>'+
      '<div><label for="'+id+'m">m²</label><input type="number" id="'+id+'m" min="5" max="80" value="'+mq+'" inputmode="numeric"></div>'+
      '<label class="sole"><input type="checkbox" '+(sole?"checked":"")+'> Molto sole</label>'+
      '<button type="button" class="via" aria-label="Togli questa stanza">×</button><p class="btu"></p>';
    lista.appendChild(li);
    li.querySelectorAll("input").forEach(function(i){i.addEventListener("input",calcola);});
    li.querySelector(".via").addEventListener("click",function(){ li.remove(); calcola(); });
    calcola();
  }
  var testo="";
  function calcola(){
    var tot=0, k=0, righe=[];
    lista.querySelectorAll("li").forEach(function(li){
      var mq=Math.max(0,Math.min(80,+li.querySelector('input[type=number]').value||0));
      var sole=li.querySelector('.sole input').checked;
      var b=mq*340*(sole?1.15:1), t=taglia(b);
      li.querySelector(".btu").innerHTML= mq? "Fabbisogno circa <b>"+(Math.round(b/100)*100).toLocaleString("it-IT")+" BTU/h</b>: split da "+t.toLocaleString("it-IT")+" BTU." : "Scrivi i metri quadri.";
      if(mq){ tot+=t; k++; righe.push(li.querySelector('input[type=text]').value+" "+mq+" m²"+(sole?" (molto sole)":"")+": split "+t.toLocaleString("it-IT")+" BTU"); }
    });
    var cons = k===0 ? "Aggiungi almeno una stanza." : k===1 ? "Basta un climatizzatore singolo con il suo motore esterno." : k<=4 ? "Conviene un multisplit: "+k+" unità interne su un solo motore esterno." : "Con più di quattro stanze valutiamo due motori o un canalizzato.";
    ris.innerHTML = k ? "<b>"+k+(k===1?" stanza":" stanze")+", "+tot.toLocaleString("it-IT")+" BTU in totale</b><p>"+cons+"</p>" : "<p>"+cons+"</p>";
    testo = k ? "Stanze dal calcolo del sito: "+righe.join("; ")+"." : "";
  }
  document.getElementById("add").addEventListener("click",function(){ aggiungi("Stanza",14,false); lista.lastChild.querySelector("input").focus(); });
  aggiungi("Soggiorno",28,true); aggiungi("Camera",14,false);
  var usata=false;
  window.NX.brezzaStanze=function(){ return usata?testo:""; };
  document.getElementById("usa").addEventListener("click",function(){ usata=true; var k=lista.children.length; document.getElementById("f-lavoro").value= k>1?"Più stanze (multisplit)":"Climatizzatore nuovo"; });
  var come=document.getElementById("come"), li=come.querySelectorAll(".passi li"), num=document.getElementById("t-num"), liv=document.getElementById("t-liv");
  function mix(a,b,t){ var pa=a.match(/\w\w/g).map(function(v){return parseInt(v,16)}), pb=b.match(/\w\w/g).map(function(v){return parseInt(v,16)}); return "#"+pa.map(function(v,i){return Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,"0")}).join(""); }
  NX.onScroll(function(){
    var p=NX.ridotto()?1:NX.progress(come.querySelector(".passi"),0.7,0.45);
    var t=31-p*7; num.textContent=Math.round(t);
    liv.style.setProperty("--h",(90-p*55)+"%"); liv.style.setProperty("--tc",mix("d9553b","2f6fa8",p));
    come.style.setProperty("--sfondo",mix("f6e7df","e4eef7",p));
    li.forEach(function(x,i){ x.classList.toggle("on", p>=i/(li.length-1)-0.02); });
  });
})();
