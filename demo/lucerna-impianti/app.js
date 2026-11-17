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
  var ora=document.getElementById("ora"); if(!ora) return;
  var bol=document.getElementById("bol"), bat=document.getElementById("bat");
  var astro=document.getElementById("astro"), pannelli=document.querySelectorAll("#pannelli rect");
  var c1=document.getElementById("c1"), c2=document.getElementById("c2");
  var curva=document.getElementById("curva"), bg=document.getElementById("curva-bg");
  var toccato=false, kwp=4;
  function esp(){return +document.querySelector('input[name=esp]:checked').value;}
  function prodOra(h){ var x=(h-6)/14; if(x<=0||x>=1) return 0; return Math.pow(Math.sin(Math.PI*x),1.6); }
  function mix(a,b,t){ var pa=a.match(/\w\w/g).map(function(v){return parseInt(v,16)}), pb=b.match(/\w\w/g).map(function(v){return parseInt(v,16)});
    return "#"+pa.map(function(v,i){return Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,"0")}).join(""); }
  function curvaPath(fino){ var d="M0 50", W=520, i, h;
    for(i=0;i<=56;i++){ h=6+i/4; if(h>fino) break; d+=" L"+(i/56*W).toFixed(1)+" "+(50-prodOra(h)*38*esp()).toFixed(1); }
    return d+" L"+(Math.min(1,(fino-6)/14)*W).toFixed(1)+" 50Z"; }
  function sole(h){
    var x=(h-6)/14, cx=60+x*480, cy=300-Math.sin(Math.PI*x)*262;
    astro.setAttribute("cx",cx.toFixed(1)); astro.setAttribute("cy",cy.toFixed(1));
    var alto=Math.sin(Math.PI*x);
    c1.setAttribute("stop-color", mix("e9a77a","8fbbe6",Math.min(1,alto*1.4)));
    c2.setAttribute("stop-color", mix("f6d6b0","eaf2fa",Math.min(1,alto*1.4)));
    var p=prodOra(h)*esp();
    pannelli.forEach(function(r){ r.setAttribute("fill", mix("1b2c48","3f6fae",p)); r.setAttribute("stroke","#c9d6e6"); r.setAttribute("stroke-width","1.2"); });
    bg.setAttribute("d",curvaPath(20)); curva.setAttribute("d",curvaPath(h));
    var hh=Math.floor(h), mm=Math.round((h-hh)*60);
    document.getElementById("ora-out").textContent=hh+":"+String(mm).padStart(2,"0");
    document.getElementById("ora-kw").textContent= p>0.02 ? "In quest'ora un impianto da "+fmt1(kwp)+" kW produce circa "+fmt1(kwp*0.82*p)+" kW." : "Il sole è troppo basso: i pannelli producono poco o niente.";
  }
  function fmt1(n){return n.toLocaleString("it-IT",{minimumFractionDigits:1,maximumFractionDigits:1});}
  function fmt0(n){return Math.round(n).toLocaleString("it-IT");}
  var stima="";
  function calcola(){
    var euro=+bol.value, e=esp();
    document.getElementById("bol-out").textContent=euro+" €";
    var consumo=euro*12/0.30;
    kwp=Math.min(12,Math.max(3,Math.round(consumo/1400*2)/2));
    var prod=kwp*1400*e;
    var quota=bat.checked?0.68:0.36;
    var usata=Math.min(prod*quota,consumo*0.85);
    var ceduta=prod-usata;
    var risp=usata*0.30+ceduta*0.09;
    document.getElementById("o-kw").textContent=fmt1(kwp)+" kW";
    document.getElementById("o-prod").textContent=fmt0(prod)+" kWh";
    document.getElementById("o-auto").textContent=Math.round(usata/prod*100)+"%";
    document.getElementById("o-eur").textContent=fmt0(risp*0.9)+"-"+fmt0(risp*1.1)+" € l'anno";
    stima="Stima dal sito: impianto da circa "+fmt1(kwp)+" kW"+(bat.checked?" con batteria":"")+", bolletta "+euro+" € al mese, tetto "+document.querySelector('input[name=esp]:checked').parentNode.textContent.trim().toLowerCase()+".";
    sole(+ora.value);
  }
  window.NX.lucernaStima=function(){ return window.NX._lucernaUsata ? stima : ""; };
  document.getElementById("usa").addEventListener("click",function(){
    window.NX._lucernaUsata=true;
    var sel=document.getElementById("f-lavoro"); sel.value=bat.checked?"Fotovoltaico con batteria":"Impianto fotovoltaico";
    var d=document.getElementById("f-desc"); if(!d.value) d.value=stima;
  });
  ora.addEventListener("input",function(){toccato=true; sole(+ora.value);});
  [bol,bat].forEach(function(x){x.addEventListener("input",calcola);});
  document.querySelectorAll('input[name=esp]').forEach(function(x){x.addEventListener("change",calcola);});
  calcola();
  var scena=document.querySelector(".scena");
  NX.onScroll(function(){ if(toccato||NX.ridotto()) return; var p=NX.progress(scena,1,0.1); var h=7+p*12; ora.value=h; sole(h); });
  var linea=document.getElementById("linea"), li=linea.querySelectorAll("li");
  NX.onScroll(function(){ var p=NX.ridotto()?1:NX.progress(linea,0.8,0.45); linea.style.setProperty("--p",p.toFixed(3));
    li.forEach(function(x,i){ x.classList.toggle("on", p>=i/(li.length-1)-0.02); }); });
})();
