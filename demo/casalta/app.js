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
  var g=document.getElementById("gantt"), li=g.querySelectorAll("li"), st=document.getElementById("g-stato");
  NX.onScroll(function(){
    var p=NX.ridotto()?1:NX.progress(g,0.85,0.25), sett=p*12;
    li.forEach(function(x){ var s=+x.style.getPropertyValue("--s"), l=+x.style.getPropertyValue("--l");
      var f=Math.max(0,Math.min(1,(sett-s)/l)); x.querySelector("i").style.setProperty("--f",f.toFixed(3)); x.classList.toggle("fatto",f>=1); });
    var w=Math.min(12,Math.max(1,Math.ceil(sett)));
    st.textContent = p>=1 ? "Settimana 12: consegna delle chiavi." : "Settimana "+w+": "+(function(){ var a=[]; li.forEach(function(x){ var s=+x.style.getPropertyValue("--s"), l=+x.style.getPropertyValue("--l"); if(w-1>=s&&w-1<s+l) a.push(x.querySelector(".g-n").textContent.toLowerCase()); }); return a.join(" e ")||"preparazione"; })()+".";
  });
})();
