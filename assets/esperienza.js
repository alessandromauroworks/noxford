/* Noxford Agency - movimento e interazioni (16/11/2026). Nessuna libreria esterna.
   Tutto si ferma con "Disattiva animazioni" o se il telefono/PC chiede meno movimento. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, W = window;
  var mq = W.matchMedia ? W.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var fine = W.matchMedia ? W.matchMedia("(hover: hover) and (pointer: fine)").matches : false;
  var prova = /[?&]movimento=1/.test(location.search); /* solo per il collaudo: ignora "riduci animazioni" */
  /* spento: l'utente ha premuto "Disattiva le animazioni" -> niente si muove.
     piano: il sistema chiede meno movimento -> restano dissolvenze e luci, niente rotazioni o spostamenti grandi. */
  function spento() { return root.classList.contains("no-anim"); }
  function piano() { return spento() || (mq.matches && !prova); }
  var ferme = piano;

  /* ---------- interruttore animazioni (ricordato su questo dispositivo) ---------- */
  try { if (localStorage.getItem("nox-anim") === "off") root.classList.add("no-anim"); } catch (e) {}
  var tb = d.querySelector(".anim");
  function etichetta() { if (tb) tb.textContent = root.classList.contains("no-anim") ? "Riattiva le animazioni" : "Disattiva le animazioni"; }
  if (tb) {
    etichetta();
    tb.addEventListener("click", function () {
      root.classList.toggle("no-anim");
      try { localStorage.setItem("nox-anim", root.classList.contains("no-anim") ? "off" : "on"); } catch (e) {}
      etichetta();
      d.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
      azzera();
      tick();
    });
  }

  /* ---------- titoli parola per parola ---------- */
  d.querySelectorAll("h1, .sh h2, .pronto h2, .two h2, .ct h2, #chi h2").forEach(function (h) {
    var i = 0;
    (function spezza(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parti = c.textContent.split(/(\s+)/), frag = d.createDocumentFragment();
          parti.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(" ")); return; }
            var w = d.createElement("span"), s = d.createElement("span");
            w.className = "w"; s.textContent = p; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1) { spezza(c); }
      });
    })(h);
    h.classList.add("parole");
  });

  /* ---------- barra di avanzamento ---------- */
  var av = d.createElement("div");
  av.className = "avanz"; av.setAttribute("aria-hidden", "true");
  d.body.appendChild(av);

  /* ---------- schermi che cambiano da soli nei telefoni della prima schermata ---------- */
  d.querySelectorAll(".tel .phone.scr").forEach(function (ph, k) {
    var img = ph.querySelector("img");
    if (!img) return;
    var m = img.getAttribute("src").match(/^(.*-)1(\.webp)$/);
    if (!m) return;
    var lista = [img];
    [2, 3].forEach(function (n) {
      var x = d.createElement("img");
      x.src = m[1] + n + m[2]; x.alt = ""; x.width = 540; x.height = 1080;
      x.decoding = "async"; x.className = "dopo";
      ph.appendChild(x);
      lista.push(x);
    });
    /* la schermata nuova entra sopra la vecchia: il telefono non resta mai scuro */
    var cur = 0, z = 1;
    lista.forEach(function (x, j) { x.style.transition = "opacity .9s ease"; x.style.opacity = j ? "0" : "1"; x.style.zIndex = j ? "0" : "1"; });
    setTimeout(function () {
      setInterval(function () {
        if (spento() || d.hidden) return;
        var dopo = lista[(cur + 1) % lista.length], prima = lista[cur];
        if (!dopo.complete || !dopo.naturalWidth) return;
        dopo.style.zIndex = String(++z);
        dopo.style.opacity = "1";
        setTimeout(function () { prima.style.opacity = "0"; }, 950);
        cur = (cur + 1) % lista.length;
      }, 3400);
    }, 1200 + k * 1700);
  });

  /* ---------- conversazione di esempio: i messaggi arrivano uno alla volta, con "sta scrivendo" ---------- */
  var chatDaAvviare = [];
  d.querySelectorAll(".chatp").forEach(function (c) {
    var ms = c.querySelectorAll(".m"), dots = c.querySelector(".scrive"), partita = false;
    function mostraTutto() { ms.forEach(function (m) { m.classList.add("on"); }); if (dots) dots.classList.remove("on"); }
    function parti() {
      if (partita) return; partita = true;
      if (spento()) { mostraTutto(); return; }
      var i = 0;
      (function prossimo() {
        if (i >= ms.length) { if (dots) dots.classList.remove("on"); return; }
        var m = ms[i], loro = !m.classList.contains("io");
        if (loro && dots) { m.parentNode.insertBefore(dots, m); dots.classList.add("on"); }
        setTimeout(function () {
          if (dots) dots.classList.remove("on");
          m.classList.add("on"); i++;
          setTimeout(prossimo, loro ? 700 : 900);
        }, loro && dots ? 1100 : 500);
      })();
    }
    chatDaAvviare.push({ el: c, parti: parti });
  });

  /* ---------- luce e inclinazione sulle schede, telefoni che seguono il mouse ---------- */
  if (fine) {
    d.querySelectorAll(".card, .prog, .tile, .rec a, .box, .g").forEach(function (el) {
      el.classList.add("spot");
      var inclina = false; /* schede ferme: solo bordo dorato e piccolo sollevamento dal CSS */
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
        if (inclina && !ferme()) {
          var ry = (x / r.width - 0.5) * 7, rx = (0.5 - y / r.height) * 6;
          el.style.transform = "perspective(1000px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-5px)";
        }
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
    d.querySelectorAll(".vid .iph, .schermi .iph").forEach(function (t) {
      t.addEventListener("pointermove", function (e) {
        if (ferme()) return;
        var r = t.getBoundingClientRect();
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 18, rx = (0.5 - (e.clientY - r.top) / r.height) * 12;
        t.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) scale(1.03)";
      });
      t.addEventListener("pointerleave", function () { t.style.transform = ""; });
    });
  }

  /* ---------- prima schermata: telefoni e lupo che reagiscono a mouse e scorrimento ---------- */
  var hero = d.querySelector(".hero"), tel = d.querySelectorAll(".tel .iph"), stemma = d.querySelector(".hero .stemma");
  var mouse = { x: 0, y: 0 }, liscio = { x: 0, y: 0 };
  if (hero && fine) {
    hero.addEventListener("pointermove", function (e) {
      mouse.x = e.clientX / W.innerWidth - 0.5; mouse.y = e.clientY / W.innerHeight - 0.5;
      /* la griglia si accende dove passa il mouse */
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      hero.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
    hero.addEventListener("pointerleave", function () { mouse.x = 0; mouse.y = 0; });
  }
  var base = [{ r: -7, tx: 16, ty: -5 }, { r: 6, tx: -12, ty: 7 }];

  /* ---------- elementi legati allo scorrimento ---------- */
  var passi = d.querySelectorAll(".steps"), schermi = d.querySelectorAll(".ph-img .pc");
  var barra = d.querySelector(".barra"), fondo = d.querySelector("#contatti") || d.querySelector("footer");

  function azzera() {
    tel.forEach(function (t, i) { var b = base[i] || base[0]; t.style.setProperty("--r", b.r + "deg"); t.style.setProperty("--tx", b.tx + "%"); t.style.setProperty("--ty", b.ty + "%"); t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); });
    if (stemma) { stemma.style.setProperty("--sx", "0px"); stemma.style.setProperty("--sy", "0px"); stemma.style.setProperty("--ss", "1"); }
    schermi.forEach(function (s) { s.style.setProperty("--rx", "0deg"); s.style.setProperty("--sc", "1"); });
  }

  function tick() {
    var y = W.pageYOffset || 0, vh = W.innerHeight, fermo = spento();
    var tot = root.scrollHeight - vh;
    av.style.setProperty("--a", tot > 0 ? (y / tot).toFixed(4) : "0");

    /* riserva: le sezioni compaiono e la chat parte anche se il browser non segnala l'ingresso nello schermo */
    d.querySelectorAll(".rv:not(.in)").forEach(function (el) { if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add("in"); });
    chatDaAvviare = chatDaAvviare.filter(function (c) {
      var r = c.el.getBoundingClientRect();
      if (r.top < vh * 0.7 && r.bottom > 0) { c.parti(); return false; }
      return true;
    });

    passi.forEach(function (ol) {
      /* in colonna (telefono) la linea scende con lo scorrimento; in riga (computer) si riempie in un tratto di 35% di schermo */
      var r = ol.getBoundingClientRect(), lim = vh * 0.68, colonna = r.height > r.width;
      var p = fermo ? 1 : Math.min(1, Math.max(0, (lim - r.top) / Math.max(1, colonna ? r.height : vh * 0.35)));
      ol.style.setProperty("--p", p.toFixed(3));
      var li = ol.children, n = li.length;
      for (var i = 0; i < n; i++) {
        var on = fermo || (colonna ? li[i].getBoundingClientRect().top < lim : p >= (i + 0.5) / n);
        li[i].classList.toggle("on", on);
      }
    });

    if (barra && fondo) {
      var fr = fondo.getBoundingClientRect();
      barra.classList.toggle("via", fr.top < vh * 0.85 || d.body.style.overflow === "hidden");
    }

    if (piano()) { azzera(); return; }

    schermi.forEach(function (s) {
      var r = s.getBoundingClientRect(), q = Math.min(1, Math.max(0, (vh * 1.1 - r.top) / (vh * 0.9)));
      s.style.setProperty("--rx", (10 * (1 - q)).toFixed(2) + "deg");
      s.style.setProperty("--sc", (0.92 + 0.08 * q).toFixed(3));
    });

    if (hero) {
      var h = hero.offsetHeight || vh, p2 = Math.min(1, Math.max(0, y / h));
      liscio.x += (mouse.x - liscio.x) * 0.08; liscio.y += (mouse.y - liscio.y) * 0.08;
      tel.forEach(function (t, i) {
        var b = base[i] || base[0], dir = i ? 1 : -1;
        t.style.setProperty("--r", (b.r + dir * 7 * p2).toFixed(2) + "deg");
        t.style.setProperty("--tx", (b.tx + dir * 26 * p2).toFixed(2) + "%");
        t.style.setProperty("--ty", (b.ty - 10 * p2 * (i ? 0.4 : 1)).toFixed(2) + "%");
        t.style.setProperty("--ry", (liscio.x * (i ? 16 : 12)).toFixed(2) + "deg");
        t.style.setProperty("--rx", (-liscio.y * 10).toFixed(2) + "deg");
      });
      if (stemma) {
        stemma.style.setProperty("--sx", (-liscio.x * 30).toFixed(1) + "px");
        stemma.style.setProperty("--sy", (-liscio.y * 22 + y * 0.18).toFixed(1) + "px");
        stemma.style.setProperty("--ss", (1 + p2 * 0.12).toFixed(3));
      }
    }
  }

  var corre = false;
  function ciclo() {
    tick();
    var muove = hero && (Math.abs(mouse.x - liscio.x) > 0.001 || Math.abs(mouse.y - liscio.y) > 0.001);
    if (muove && !ferme()) { requestAnimationFrame(ciclo); } else { corre = false; }
  }
  function sveglia() { if (!corre) { corre = true; requestAnimationFrame(ciclo); } }
  W.addEventListener("scroll", sveglia, { passive: true });
  W.addEventListener("resize", sveglia);
  if (hero) hero.addEventListener("pointermove", sveglia);
  if (mq.addEventListener) mq.addEventListener("change", sveglia);
  tick();

  /* ---------- modulo "Nuovo progetto": controlla i campi e apre WhatsApp con il messaggio pronto ---------- */
  var fp = d.getElementById("progetto");
  if (fp) {
    var controlla = function (el) {
      var v = (el.value || "").trim(), err = "";
      if (el.required && !v) err = el.tagName === "SELECT" ? "Scegli un'opzione." : "Campo obbligatorio.";
      else if (el.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) err = "Controlla l'email, ad esempio nome@dominio.it.";
      var box = el.parentNode.querySelector(".er");
      if (box) box.textContent = err;
      if (err) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      return !err;
    };
    fp.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.addEventListener("input", function () { if (el.hasAttribute("aria-invalid")) controlla(el); });
      el.addEventListener("change", function () { if (el.hasAttribute("aria-invalid")) controlla(el); });
    });
    fp.addEventListener("submit", function (e) {
      e.preventDefault();
      var campi = fp.querySelectorAll("input,select,textarea"), primo = null;
      campi.forEach(function (el) { if (!controlla(el) && !primo) primo = el; });
      if (primo) { primo.focus(); return; }
      var f = fp.elements, nome = (f.nome.value + " " + f.cognome.value).trim();
      var testo = "Ciao Noxford, sono " + nome + ".\nEmail: " + f.email.value.trim() + "\nProgetto: " + f.tipo.value + "\n\n" + f.msg.value.trim();
      var url = "https://wa.me/393394052935?text=" + encodeURIComponent(testo);
      var w = W.open(url, "_blank", "noopener");
      if (!w) location.href = url;
    });
  }

  /* ---------- menu del telefono: il tasto Tab resta dentro il menu aperto ---------- */
  var burger = d.querySelector(".burger"), mob = d.getElementById("mob");
  if (burger && mob) {
    d.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !mob.classList.contains("open")) return;
      var el = [burger].concat(Array.prototype.slice.call(mob.querySelectorAll("a")));
      var i = el.indexOf(d.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); el[el.length - 1].focus(); }
      else if (!e.shiftKey && i === el.length - 1) { e.preventDefault(); el[0].focus(); }
    });
    burger.addEventListener("click", function () { setTimeout(sveglia, 30); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setTimeout(sveglia, 30); });
    mob.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setTimeout(sveglia, 30); }); });
  }
})();
