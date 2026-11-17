/* =====================================================================
   Kit Noxford · JS (v1, 17/11/2026) - vanilla, nessuna libreria.
   window.NX: preferenze (tema, vetro), toast, foglio dal basso,
   segmented control, titolo grande, CSV (leggi, scrivi, scarica),
   Fogli Google, importazione guidata, modulo CRM.
   Niente viene inviato a server nostri: tutto resta nel browser.
   L'unica richiesta esterna possibile è il link di Fogli Google
   incollato dall'utente (solo docs.google.com).
   ===================================================================== */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var NX = window.NX = window.NX || {};

  /* ---------- utilità ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function leggi(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function el(html) { var t = d.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  var ridotto = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };
  NX.esc = esc; NX.leggi = leggi; NX.scrivi = scrivi; NX.el = el;

  var IC = {
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/>',
    foglio: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
    esempio: '<path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.6-.8z"/>',
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    cerca: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>',
    vuoto: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 10.5h5"/>',
    errore: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.1"/>',
    persone: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c1.9.7 3 2.4 3.5 5.2"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    giu: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    su: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
    tel: '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 005.5 5.5L15 13l4 1.5V18a2 2 0 01-2 2A14 14 0 013 6a2 2 0 012-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[k] || "") + "</svg>"; }
  NX.icona = svg;

  /* ---------- 1. Preferenze: tema chiaro/scuro e vetro ---------- */
  NX.pref = {
    tema: function (v, opz) {
      if (v !== "chiaro" && v !== "scuro") v = (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "scuro" : "chiaro";
      root.setAttribute("data-nx-tema", v);
      if (!opz || opz.salva !== false) scrivi("nx-tema", v);
      var m = d.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", v === "scuro" ? "#000000" : "#F2F2F7");
      d.dispatchEvent(new CustomEvent("nx:pref", { detail: { tema: v, vetro: NX.pref.vetroAttivo() } }));
      return v;
    },
    vetro: function (on, opz) {
      root.setAttribute("data-nx-vetro", on ? "si" : "no");
      if (!opz || opz.salva !== false) scrivi("nx-vetro", on ? "si" : "no");
      d.dispatchEvent(new CustomEvent("nx:pref", { detail: { tema: NX.pref.temaAttivo(), vetro: !!on } }));
      return !!on;
    },
    temaAttivo: function () { return root.getAttribute("data-nx-tema") || "chiaro"; },
    vetroAttivo: function () { return root.getAttribute("data-nx-vetro") !== "no"; },
    /* al primo avvio rispetta il sistema; poi vale la scelta salvata */
    init: function () {
      var t = leggi("nx-tema"), v = leggi("nx-vetro");
      NX.pref.tema(t || null, { salva: false });
      NX.pref.vetro(v !== "no", { salva: false });
      if (!t && window.matchMedia) {
        try {
          matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) { if (!leggi("nx-tema")) NX.pref.tema(e.matches ? "scuro" : "chiaro", { salva: false }); });
        } catch (e) {}
      }
    },
    /* collega un interruttore <input type=checkbox> */
    collega: function (input, tipo) {
      if (!input) return;
      function sync() { input.checked = tipo === "tema" ? NX.pref.temaAttivo() === "scuro" : NX.pref.vetroAttivo(); }
      sync();
      input.addEventListener("change", function () {
        if (tipo === "tema") NX.pref.tema(input.checked ? "scuro" : "chiaro"); else NX.pref.vetro(input.checked);
      });
      d.addEventListener("nx:pref", sync);
    }
  };

  /* ---------- 2. Toast ---------- */
  var toastEl = null, toastT = null;
  NX.toast = function (msg, tipo) {
    if (!toastEl) { toastEl = el('<p class="nx-toast nx-vetro" role="status" aria-live="polite"></p>'); d.body.appendChild(toastEl); }
    toastEl.className = "nx-toast nx-vetro" + (tipo ? " " + tipo : "");
    toastEl.textContent = msg;
    void toastEl.offsetWidth;
    toastEl.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 3200);
  };

  /* ---------- 3. Foglio dal basso, con maniglia e trascinamento ---------- */
  var aperti = [];
  NX.foglio = {
    /* opz: {titolo, html, piede (html), classe, onChiudi, chiudiTesto} -> elemento del foglio */
    apri: function (opz) {
      opz = opz || {};
      var prima = d.activeElement;
      var velo = el('<div class="nx-velo"></div>');
      var f = el('<section class="nx-foglio nx' + (opz.classe ? " " + opz.classe : "") + '" role="dialog" aria-modal="true" tabindex="-1">' +
        '<header class="nx-foglio-testa"><span class="nx-maniglia" aria-hidden="true"></span><div class="nx-foglio-riga"><h2></h2>' +
        '<button type="button" class="nx-btn ico nx-chiudi" aria-label="' + esc(opz.chiudiTesto || "Chiudi") + '">' + svg("x") + "</button></div></header>" +
        '<div class="nx-foglio-corpo"></div>' + (opz.piede ? '<footer class="nx-foglio-piede"></footer>' : "") + "</section>");
      var id = "nxf" + Date.now().toString(36) + aperti.length;
      f.querySelector("h2").id = id; f.setAttribute("aria-labelledby", id);
      f.querySelector("h2").textContent = opz.titolo || "";
      f.querySelector(".nx-foglio-corpo").innerHTML = opz.html || "";
      if (opz.piede) f.querySelector(".nx-foglio-piede").innerHTML = opz.piede;
      d.body.appendChild(velo); d.body.appendChild(f);
      var rec = { f: f, velo: velo, prima: prima, onChiudi: opz.onChiudi };
      aperti.push(rec);
      d.body.style.overflow = "hidden";
      requestAnimationFrame(function () { velo.classList.add("on"); f.classList.add("on"); });
      setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }, 30);
      velo.addEventListener("click", function () { NX.foglio.chiudi(f); });
      f.querySelector(".nx-chiudi").addEventListener("click", function () { NX.foglio.chiudi(f); });
      trascina(f);
      return f;
    },
    chiudi: function (f) {
      var i = -1;
      aperti.forEach(function (r, k) { if (!f || r.f === f) i = k; });
      if (i < 0) return;
      var r = aperti.splice(i, 1)[0];
      r.f.classList.remove("on"); r.velo.classList.remove("on");
      r.f.style.transform = "";
      var via = function () { r.f.remove(); r.velo.remove(); };
      if (ridotto()) via(); else setTimeout(via, 420);
      if (!aperti.length) d.body.style.overflow = "";
      if (r.prima && r.prima.focus) { try { r.prima.focus({ preventScroll: true }); } catch (e) {} }
      if (r.onChiudi) r.onChiudi();
    },
    aperto: function () { return aperti.length ? aperti[aperti.length - 1].f : null; }
  };
  function trascina(f) {
    var testa = f.querySelector(".nx-foglio-testa"), y0 = 0, dy = 0, t0 = 0, attivo = false;
    testa.addEventListener("pointerdown", function (e) {
      if (window.innerWidth >= 760 || e.target.closest("button")) return;
      attivo = true; y0 = e.clientY; dy = 0; t0 = Date.now(); f.classList.add("trascina");
      try { testa.setPointerCapture(e.pointerId); } catch (x) {}
    });
    testa.addEventListener("pointermove", function (e) {
      if (!attivo) return;
      dy = Math.max(0, e.clientY - y0);
      if (e.clientY - y0 < 0) dy = (e.clientY - y0) / 6; /* resistenza verso l'alto */
      f.style.transform = "translateY(" + dy + "px)";
    });
    function fine() {
      if (!attivo) return;
      attivo = false; f.classList.remove("trascina");
      var vel = dy / Math.max(1, Date.now() - t0);
      if (dy > f.offsetHeight * 0.28 || vel > 0.6) NX.foglio.chiudi(f); else f.style.transform = "";
    }
    testa.addEventListener("pointerup", fine); testa.addEventListener("pointercancel", fine);
  }
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && aperti.length) { NX.foglio.chiudi(); return; }
    if (e.key === "Tab" && aperti.length) { /* il fuoco resta dentro il foglio */
      var f = aperti[aperti.length - 1].f, fs = f.querySelectorAll('button:not([disabled]),[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!fs.length) return;
      var a = fs[0], z = fs[fs.length - 1];
      if (e.shiftKey && (d.activeElement === a || d.activeElement === f)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- 4. Segmented control con indicatore a molla ---------- */
  /* markup: <div class="nx-seg" role="group"><button aria-pressed="true" data-v="a">A</button>...</div> */
  NX.seg = function (box, onCambio) {
    if (!box) return;
    var ind = box.querySelector(".nx-seg-ind");
    if (!ind) { ind = d.createElement("span"); ind.className = "nx-seg-ind"; ind.setAttribute("aria-hidden", "true"); box.insertBefore(ind, box.firstChild); }
    function muovi() {
      var b = box.querySelector('button[aria-pressed="true"]');
      if (!b || !b.offsetWidth) { ind.style.width = "0"; return; }
      ind.style.width = b.offsetWidth + "px";
      ind.style.transform = "translateX(" + b.offsetLeft + "px)";
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || !box.contains(b)) return;
      box.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      muovi();
      if (onCambio) onCambio(b.getAttribute("data-v"), b);
    });
    muovi();
    if (window.ResizeObserver) new ResizeObserver(muovi).observe(box); else window.addEventListener("resize", muovi);
    box._nxMuovi = muovi;
    return { aggiorna: muovi, scegli: function (v) { box.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-v") === v ? "true" : "false"); }); muovi(); } };
  };

  /* ---------- 5. Titolo grande che si rimpicciolisce ---------- */
  NX.titoloGrande = function (barra, soglia) {
    if (!barra) return;
    var s = soglia || 34, su = false;
    function f() {
      var giu = (window.scrollY || root.scrollTop) > s;
      if (giu !== su) { su = giu; barra.classList.toggle("nx-compatta", giu); }
    }
    window.addEventListener("scroll", f, { passive: true }); f();
    return f;
  };

  /* ---------- 6. Pressione che affonda anche su elementi non .nx-btn ---------- */
  d.addEventListener("pointerdown", function (e) { var b = e.target.closest && e.target.closest("[data-nx-premi]"); if (b) b.classList.add("nx-giu"); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) { d.addEventListener(t, function () { d.querySelectorAll(".nx-giu").forEach(function (b) { b.classList.remove("nx-giu"); }); }, true); });

  /* ---------- 7. Stati: vuoto, caricamento, errore ---------- */
  NX.stato = {
    vuoto: function (tit, testo, azione) { return '<div class="nx-stato">' + '<span class="nx-st-ic">' + svg("vuoto") + "</span><b>" + esc(tit) + "</b><p>" + esc(testo || "") + "</p>" + (azione ? '<button type="button" class="nx-btn" data-nx-azione="' + esc(azione[1]) + '">' + esc(azione[0]) + "</button>" : "") + "</div>"; },
    errore: function (tit, testo, azione) { return '<div class="nx-stato errore" role="alert">' + '<span class="nx-st-ic">' + svg("errore") + "</span><b>" + esc(tit) + "</b><p>" + esc(testo || "") + "</p>" + (azione ? '<button type="button" class="nx-btn" data-nx-azione="' + esc(azione[1]) + '">' + esc(azione[0]) + "</button>" : "") + "</div>"; },
    caricamento: function (n) { var h = '<div class="nx-skel-lista" aria-busy="true" aria-label="Caricamento">'; for (var i = 0; i < (n || 4); i++) h += '<div class="nx-skel-riga"><span class="nx-skel a"></span><span class="nx-skel b" style="max-width:' + (60 + (i * 13) % 35) + '%"></span><span class="nx-skel c"></span></div>'; return h + "</div>"; }
  };

  /* ---------- 8. Transizione tra viste ---------- */
  NX.vista = function (box, html, verso) {
    box.innerHTML = html;
    var c = verso === "dx" ? "nx-entra-dx" : verso === "sx" ? "nx-entra-sx" : "nx-entra";
    box.classList.remove("nx-entra", "nx-entra-dx", "nx-entra-sx"); void box.offsetWidth; box.classList.add(c);
  };

  /* ---------- 9. CSV ---------- */
  NX.csv = {
    /* legge testo CSV (virgola, punto e virgola o tab, riconosciuti da soli) -> array di righe */
    leggi: function (testo) {
      testo = String(testo || "").replace(/^﻿/, "");
      var prima = testo.split(/\r?\n/)[0] || "", sep = ",";
      var conta = function (c) { return prima.split(c).length - 1; };
      if (conta(";") > conta(sep)) sep = ";";
      if (conta("\t") > conta(sep)) sep = "\t";
      var righe = [], riga = [], campo = "", q = false;
      for (var i = 0; i < testo.length; i++) {
        var c = testo[i];
        if (q) {
          if (c === '"') { if (testo[i + 1] === '"') { campo += '"'; i++; } else q = false; }
          else campo += c;
        } else if (c === '"') q = true;
        else if (c === sep) { riga.push(campo); campo = ""; }
        else if (c === "\n" || c === "\r") { if (c === "\r" && testo[i + 1] === "\n") i++; riga.push(campo); righe.push(riga); riga = []; campo = ""; }
        else campo += c;
      }
      if (campo !== "" || riga.length) { riga.push(campo); righe.push(riga); }
      return righe.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); }).map(function (r) { return r.map(function (x) { return String(x).trim(); }); });
    },
    /* righe -> testo CSV con punto e virgola (si apre bene in Excel italiano) */
    scrivi: function (righe) {
      return righe.map(function (r) {
        return r.map(function (x) { x = String(x == null ? "" : x); return /[";\n\r]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }).join(";");
      }).join("\r\n");
    },
    scarica: function (nome, righe) {
      var blob = new Blob(["﻿" + NX.csv.scrivi(righe)], { type: "text/csv;charset=utf-8" });
      var a = d.createElement("a"), u = URL.createObjectURL(blob);
      a.href = u; a.download = nome; a.style.display = "none"; d.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 800);
    }
  };

  /* ---------- 10. Fogli Google: link pubblicato -> CSV letto nel browser ---------- */
  NX.fogli = {
    /* accetta il link "Pubblica sul web" (CSV o pagina) o il link del foglio; restituisce l'indirizzo CSV oppure null */
    urlCSV: function (link) {
      var u;
      try { u = new URL(String(link || "").trim()); } catch (e) { return null; }
      if (u.protocol !== "https:" || u.hostname !== "docs.google.com" || u.pathname.indexOf("/spreadsheets/") !== 0) return null;
      var p = u.pathname;
      if (/\/pub(html)?$/.test(p) || /\/pub$/.test(p)) {
        var gid = u.searchParams.get("gid");
        return "https://docs.google.com" + p.replace(/\/pubhtml$/, "/pub") + "?output=csv" + (gid ? "&gid=" + encodeURIComponent(gid) : "");
      }
      var m = /^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/.exec(p);
      if (m && m[1] !== "e") {
        var g = u.searchParams.get("gid") || (/gid=(\d+)/.exec(u.hash) || [])[1];
        return "https://docs.google.com/spreadsheets/d/" + m[1] + "/export?format=csv" + (g ? "&gid=" + g : "");
      }
      return null;
    },
    carica: function (link) {
      var url = NX.fogli.urlCSV(link);
      if (!url) return Promise.reject(new Error("link"));
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
      return fetch(url, { credentials: "omit", referrerPolicy: "no-referrer", signal: ctl ? ctl.signal : undefined }).then(function (r) {
        clearTimeout(t);
        if (!r.ok) throw new Error("rete");
        return r.text();
      }).then(function (tx) {
        if (/^\s*<(!doctype|html)/i.test(tx)) throw new Error("privato");
        return tx;
      }, function (e) { clearTimeout(t); throw e.message === "rete" || e.message === "privato" ? e : new Error("rete"); });
    }
  };

  /* ---------- 11. Importazione guidata (file, Fogli Google, esempio) ---------- */
  /* opz: {titolo, cosa:"contatti", campi:[{k,l,obbl,alias:[]}], esempio:"testo csv", onConferma(oggetti)} */
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, ""); }
  NX.importa = function (opz) {
    var campi = opz.campi, cosa = opz.cosa || "righe", dati = null, fonte = "";
    var f = NX.foglio.apri({ titolo: opz.titolo || "Importa", html: "", classe: "nx-imp" });
    var corpo = f.querySelector(".nx-foglio-corpo");
    function passi(n) { return '<div class="nx-imp-passi" aria-hidden="true"><i class="on"></i><i' + (n > 1 ? ' class="on"' : "") + "></i><i" + (n > 2 ? ' class="on"' : "") + "></i></div>"; }
    function mostra(html) { corpo.innerHTML = html; corpo.classList.remove("nx-entra-dx"); void corpo.offsetWidth; corpo.classList.add("nx-entra-dx"); corpo.scrollTop = 0; }

    function passo1() {
      mostra(passi(1) +
        '<div class="nx-imp-fonti">' +
        '<label class="nx-imp-fonte" data-nx-premi><span class="nx-c-ic">' + svg("file") + '</span><span><b>File CSV dal computer</b><small>Esportato da Excel, Fogli Google o dal vecchio programma</small></span><input type="file" accept=".csv,text/csv,text/plain" class="nx-sr nx-imp-file"></label>' +
        '<button type="button" class="nx-imp-fonte nx-imp-g" data-nx-premi><span class="nx-c-ic">' + svg("foglio") + '</span><span><b>Fogli Google</b><small>Incolla il link di un foglio pubblicato come CSV</small></span></button>' +
        (opz.esempio ? '<button type="button" class="nx-imp-fonte nx-imp-es" data-nx-premi><span class="nx-c-ic">' + svg("esempio") + '</span><span><b>Usa un foglio di esempio</b><small>Per provare subito, con dati inventati</small></span></button>' : "") +
        "</div>" +
        '<p class="nx-imp-nota">Il file resta nel tuo browser: non viene caricato su nessun server.</p>');
      corpo.querySelector(".nx-imp-file").addEventListener("change", function () {
        var file = this.files && this.files[0]; if (!file) return;
        if (file.size > 5 * 1024 * 1024) { errore("File troppo grande", "Il limite è 5 MB. Prova a dividere il file in due."); return; }
        corpo.innerHTML = passi(2) + NX.stato.caricamento(5);
        var r = new FileReader();
        r.onload = function () { analizza(String(r.result), file.name); };
        r.onerror = function () { errore("Non riesco a leggere il file", "Controlla che sia un file CSV e riprova."); };
        r.readAsText(file);
      });
      corpo.querySelector(".nx-imp-g").addEventListener("click", passoGoogle);
      var es = corpo.querySelector(".nx-imp-es");
      if (es) es.addEventListener("click", function () { corpo.innerHTML = passi(2) + NX.stato.caricamento(5); setTimeout(function () { analizza(opz.esempio, "Foglio di esempio"); }, 450); });
    }

    function passoGoogle() {
      mostra(passi(1) +
        '<label class="nx-campo"><span>Link del foglio</span><input type="url" class="nx-imp-link" inputmode="url" autocomplete="off" placeholder="https://docs.google.com/spreadsheets/…"><small>In Fogli Google: File → Condividi → Pubblica sul web → scegli CSV, poi copia il link.</small></label>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="nx-btn p nx-imp-leggi">Leggi il foglio</button>' +
        (opz.esempio ? '<button type="button" class="nx-btn nx-imp-es2">Non ho un link: usa un foglio di esempio</button>' : "") +
        '<button type="button" class="nx-btn t nx-imp-indietro">Indietro</button></div>' +
        '<p class="nx-imp-nota">Il foglio viene letto direttamente dal tuo browser da Google: noi non riceviamo niente.</p>');
      var inp = corpo.querySelector(".nx-imp-link");
      setTimeout(function () { inp.focus(); }, 60);
      corpo.querySelector(".nx-imp-indietro").addEventListener("click", passo1);
      var e2 = corpo.querySelector(".nx-imp-es2");
      if (e2) e2.addEventListener("click", function () { corpo.innerHTML = passi(2) + NX.stato.caricamento(5); setTimeout(function () { analizza(opz.esempio, "Foglio di esempio"); }, 450); });
      function vai() {
        var link = inp.value;
        if (!NX.fogli.urlCSV(link)) { inp.setAttribute("aria-invalid", "true"); NX.toast("Il link deve essere di un foglio Google (docs.google.com).", "no"); inp.focus(); return; }
        corpo.innerHTML = passi(2) + NX.stato.caricamento(5);
        NX.fogli.carica(link).then(function (tx) { analizza(tx, "Fogli Google"); }, function (e) {
          if (e.message === "privato") errore("Il foglio non è pubblicato", "Apri il foglio, poi File → Condividi → Pubblica sul web → CSV, e incolla il nuovo link.", passoGoogle);
          else errore("Non riesco a leggere il foglio", "Controlla il link e la connessione, poi riprova.", passoGoogle);
        });
      }
      corpo.querySelector(".nx-imp-leggi").addEventListener("click", vai);
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); vai(); } });
    }

    function errore(t, p, riprova) {
      mostra(passi(1) + NX.stato.errore(t, p, ["Riprova", "riprova"]));
      corpo.querySelector('[data-nx-azione="riprova"]').addEventListener("click", riprova || passo1);
    }

    function analizza(testo, nome) {
      var righe = NX.csv.leggi(testo);
      if (righe.length < 2) { errore("Il foglio è vuoto", "Servono una riga di intestazione e almeno una riga di dati."); return; }
      fonte = nome;
      var testa = righe[0], corpoR = righe.slice(1, 501);
      dati = { testa: testa, righe: corpoR, tot: righe.length - 1 };
      /* abbinamento automatico per nome della colonna */
      var map = {};
      campi.forEach(function (c) {
        var nomi = [c.k, c.l].concat(c.alias || []).map(norm);
        testa.forEach(function (h, i) { if (map[c.k] == null && nomi.indexOf(norm(h)) >= 0) map[c.k] = i; });
        if (map[c.k] == null) testa.forEach(function (h, i) { if (map[c.k] == null && nomi.some(function (n) { return n && norm(h).indexOf(n) >= 0; })) map[c.k] = i; });
      });
      var ante = '<div class="nx-imp-ante"><table><thead><tr>' + testa.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        corpoR.slice(0, 5).map(function (r) { return "<tr>" + testa.map(function (_, i) { return "<td>" + esc(r[i] || "") + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
      var sel = '<div class="nx-imp-map">' + campi.map(function (c) {
        return '<label><span>' + esc(c.l) + (c.obbl ? '<em aria-hidden="true">*</em>' : "") + '</span><select data-k="' + esc(c.k) + '"><option value="">Non importare</option>' +
          testa.map(function (h, i) { return '<option value="' + i + '"' + (map[c.k] === i ? " selected" : "") + ">" + esc(h || "Colonna " + (i + 1)) + "</option>"; }).join("") + "</select></label>";
      }).join("") + "</div>";
      mostra(passi(2) +
        '<p style="margin:0 0 10px;color:var(--nx-tx2);font-size:15px"><b style="color:var(--nx-tx)">' + esc(nome) + "</b> · " + dati.tot + " righe, " + testa.length + " colonne. Ecco le prime righe:</p>" + ante +
        '<h3 style="margin:0 0 8px;font-size:17px;font-weight:600">Abbina le colonne</h3><p style="margin:0 0 10px;color:var(--nx-tx2);font-size:15px">Le abbiamo abbinate da sole dove i nomi corrispondono: controlla e correggi.</p>' + sel +
        '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"><button type="button" class="nx-btn p nx-imp-conf">Importa ' + dati.tot + " " + esc(cosa) + '</button><button type="button" class="nx-btn t nx-imp-indietro">Scegli un altro file</button></div>');
      corpo.querySelector(".nx-imp-indietro").addEventListener("click", passo1);
      corpo.querySelector(".nx-imp-conf").addEventListener("click", conferma);
    }

    function conferma() {
      var m = {};
      corpo.querySelectorAll(".nx-imp-map select").forEach(function (s) { if (s.value !== "") m[s.getAttribute("data-k")] = +s.value; });
      var manca = campi.filter(function (c) { return c.obbl && m[c.k] == null; });
      if (manca.length) { NX.toast("Abbina almeno: " + manca.map(function (c) { return c.l; }).join(", ") + ".", "no"); return; }
      var ogg = dati.righe.map(function (r) { var o = {}; Object.keys(m).forEach(function (k) { o[k] = r[m[k]] || ""; }); return o; })
        .filter(function (o) { return campi.every(function (c) { return !c.obbl || String(o[c.k] || "").trim(); }); });
      var n = opz.onConferma ? opz.onConferma(ogg, fonte) : ogg.length;
      if (typeof n !== "number") n = ogg.length;
      mostra(passi(3) + '<div class="nx-stato"><span class="nx-imp-ok">' + svg("ok") + "</span><b>Importati " + n + " " + esc(cosa) + "</b><p>Da " + esc(fonte) + ". Li trovi già nell'elenco, segnati come nuovi.</p>" +
        '<button type="button" class="nx-btn p nx-imp-fine">Fatto</button></div>');
      corpo.querySelector(".nx-imp-fine").addEventListener("click", function () { NX.foglio.chiudi(f); });
      NX.toast("Importati " + n + " " + cosa + ".");
    }
    passo1();
    return f;
  };

  /* ---------- 12. Modulo CRM ---------- */
  /* cfg: {nome:"Clienti", sing:"cliente", plur:"clienti", fasi:["Nuovo",...], toniFasi:["info","acc","ok","wait","no"],
           campi:[{k,l}] (extra, mostrati in tabella e scheda), dati:[{nome,tel,email,fase,ultimo(Date|giorni),valore,note:[]}],
           chiave:"nx-crm-x" (localStorage), nomeFile:"clienti.csv", esempio:"csv", oggi:Date} */
  var GG = 864e5;
  function giorno(dt) { var x = new Date(dt); x.setHours(0, 0, 0, 0); return x; }
  function quando(dt, oggi) {
    if (!dt) return "mai";
    var n = Math.round((giorno(oggi) - giorno(dt)) / GG);
    if (n <= 0) return "oggi"; if (n === 1) return "ieri"; if (n < 7) return n + " giorni fa";
    if (n < 30) { var s = Math.round(n / 7); return s === 1 ? "1 settimana fa" : s + " settimane fa"; }
    var m = Math.round(n / 30); return m <= 1 ? "1 mese fa" : m + " mesi fa";
  }
  function iniz(n) { return String(n || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase(); }
  NX.quando = quando;

  NX.crm = function (box, cfg) {
    var oggi = cfg.oggi || new Date();
    var fasi = cfg.fasi, toni = cfg.toniFasi || ["info", "acc", "ok", "wait", "no", ""];
    var extra = cfg.campi || [];
    var sing = cfg.sing || "contatto", plur = cfg.plur || "contatti";
    function tono(f) { var i = fasi.indexOf(f); return i < 0 ? "" : toni[i % toni.length]; }
    function prepara(arr) {
      return arr.map(function (c, i) {
        var o = {}; for (var k in c) o[k] = c[k];
        o.id = o.id || "c" + i + "-" + Math.random().toString(36).slice(2, 7);
        if (typeof o.ultimo === "number") o.ultimo = new Date(giorno(oggi).getTime() - o.ultimo * GG + 10 * 36e5).toISOString();
        o.note = (o.note || []).map(function (n) { return typeof n === "string" ? { t: n, d: o.ultimo } : n; });
        if (fasi.indexOf(o.fase) < 0) o.fase = fasi[0];
        return o;
      });
    }
    var lista = null, salvati = cfg.chiave ? leggi(cfg.chiave) : null;
    if (salvati) { try { lista = JSON.parse(salvati); } catch (e) { lista = null; } }
    if (!Array.isArray(lista)) lista = prepara(cfg.dati || []);
    function salva() { if (cfg.chiave) scrivi(cfg.chiave, JSON.stringify(lista)); if (cfg.onCambio) cfg.onCambio(lista); }

    var filtro = "tutti", testo = "", modo = cfg.modo || "lista";
    box.classList.add("nx-crm");
    box.innerHTML =
      '<div class="nx-crm-barra">' +
      '<label class="nx-cerca">' + svg("cerca") + '<input type="search" class="nx-crm-q" placeholder="Cerca ' + esc(plur) + ', telefono, note" aria-label="Cerca tra i ' + esc(plur) + '"></label>' +
      '<div class="nx-seg nx-crm-modo" role="group" aria-label="Vista"><button type="button" data-v="lista" aria-pressed="' + (modo === "lista") + '">Elenco</button><button type="button" data-v="pipe" aria-pressed="' + (modo === "pipe") + '">Fasi</button></div>' +
      '<div class="nx-crm-azioni"><button type="button" class="nx-btn p nx-crm-nuovo">' + svg("piu") + "Nuovo</button>" +
      '<button type="button" class="nx-btn nx-crm-imp" aria-label="Importa ' + esc(plur) + ' da CSV o Fogli Google">' + svg("giu") + '<span>Importa</span></button>' +
      '<button type="button" class="nx-btn nx-crm-esp" aria-label="Esporta ' + esc(plur) + ' in CSV">' + svg("su") + "<span>Esporta</span></button></div></div>" +
      '<div class="nx-chips nx-crm-fasi" role="group" aria-label="Filtra per fase"></div>' +
      '<div class="nx-crm-corpo" aria-live="polite"></div>';
    var corpo = box.querySelector(".nx-crm-corpo"), chips = box.querySelector(".nx-crm-fasi");
    NX.seg(box.querySelector(".nx-crm-modo"), function (v) { modo = v; disegna(true); });

    function filtrati() {
      var q = norm(testo);
      return lista.filter(function (c) {
        if (filtro !== "tutti" && c.fase !== filtro) return false;
        if (!q) return true;
        var h = norm([c.nome, c.tel, c.email, c.fase].concat(extra.map(function (e) { return c[e.k]; })).concat(c.note.map(function (n) { return n.t; })).join(" "));
        return h.indexOf(q) >= 0;
      }).sort(function (a, b) { return String(b.ultimo || "").localeCompare(String(a.ultimo || "")); });
    }
    function disegnaChips() {
      var cnt = { tutti: lista.length }; fasi.forEach(function (f) { cnt[f] = 0; }); lista.forEach(function (c) { cnt[c.fase] = (cnt[c.fase] || 0) + 1; });
      chips.innerHTML = ['tutti'].concat(fasi).map(function (f) {
        return '<button type="button" class="nx-chip" data-f="' + esc(f) + '" aria-pressed="' + (filtro === f) + '">' + (f === "tutti" ? "Tutti" : esc(f)) + "<em>" + (cnt[f] || 0) + "</em></button>";
      }).join("");
      chips.hidden = modo === "pipe";
    }
    function riga(c) {
      return '<tr data-id="' + esc(c.id) + '" tabindex="0"><td><span class="nx-crm-nome"><span class="nx-av" aria-hidden="true">' + esc(iniz(c.nome)) + "</span>" + esc(c.nome) + "</span></td>" +
        "<td>" + esc(c.tel || "—") + "</td>" + extra.map(function (e) { return "<td>" + esc(c[e.k] || "—") + "</td>"; }).join("") +
        '<td>' + esc(quando(c.ultimo, oggi)) + '</td><td><span class="nx-pill ' + tono(c.fase) + '">' + esc(c.fase) + "</span></td></tr>";
    }
    function cella(c) {
      var sotto = [quando(c.ultimo, oggi)].concat(extra.slice(0, 1).map(function (e) { return c[e.k]; }).filter(Boolean)).join(" · ");
      return '<li><button type="button" class="nx-cella" data-id="' + esc(c.id) + '"><span class="nx-av" aria-hidden="true">' + esc(iniz(c.nome)) + '</span><span class="nx-c-tx"><b>' + esc(c.nome) + "</b><small>" + esc(sotto) + '</small></span><span class="nx-c-dx"><span class="nx-pill ' + tono(c.fase) + '">' + esc(c.fase) + '</span><i class="nx-chev"></i></span></button></li>';
    }
    function disegna(anim) {
      disegnaChips();
      var v = filtrati(), h;
      if (!lista.length) h = NX.stato.vuoto("Ancora nessun " + sing, "Aggiungine uno a mano oppure importa l'elenco da un file o da Fogli Google.", ["Importa " + plur, "importa"]);
      else if (modo === "pipe") {
        var fx = filtro; filtro = "tutti"; var tutti = filtrati(); filtro = fx;
        h = '<div class="nx-pipe">' + fasi.map(function (f) {
          var cs = tutti.filter(function (c) { return c.fase === f; });
          return '<section class="nx-pipe-col"><h3>' + esc(f) + "<em>" + cs.length + "</em></h3>" + (cs.length ? cs.map(function (c) {
            return '<button type="button" class="nx-pipe-card" data-id="' + esc(c.id) + '"><b>' + esc(c.nome) + "</b><small>" + esc([extra[0] ? c[extra[0].k] : "", quando(c.ultimo, oggi)].filter(Boolean).join(" · ")) + "</small></button>";
          }).join("") : '<p class="nx-pipe-vuota">Nessuno in questa fase</p>') + "</section>";
        }).join("") + "</div>";
      } else if (!v.length) h = NX.stato.vuoto("Nessun risultato", "Nessun " + sing + " corrisponde alla ricerca o al filtro.", ["Azzera i filtri", "azzera"]);
      else {
        h = '<div class="nx-crm-tw nx-solo-largo"><table class="nx-crm-tab"><thead><tr><th>' + esc(cfg.nomeCol || "Nome") + "</th><th>Telefono</th>" + extra.map(function (e) { return "<th>" + esc(e.l) + "</th>"; }).join("") + "<th>Ultimo contatto</th><th>Fase</th></tr></thead><tbody>" + v.map(riga).join("") + "</tbody></table></div>" +
          '<ul class="nx-lista nx-crm-lista nx-solo-stretto">' + v.map(cella).join("") + "</ul>";
      }
      h += '<p class="nx-crm-conta">' + (modo === "pipe" ? lista.length + " " + plur + " in " + fasi.length + " fasi" : v.length + " di " + lista.length + " " + plur) + "</p>";
      if (anim) NX.vista(corpo, h); else corpo.innerHTML = h;
    }
    function trova(id) { var r = null; lista.forEach(function (c) { if (c.id === id) r = c; }); return r; }

    function scheda(c, nuovo) {
      var f = NX.foglio.apri({
        titolo: nuovo ? "Nuovo " + sing : c.nome,
        html: (nuovo ? "" : '<div class="nx-scheda-testa"><span class="nx-av" aria-hidden="true">' + esc(iniz(c.nome)) + '</span><span><b>' + esc(c.nome) + "</b><small>Ultimo contatto: " + esc(quando(c.ultimo, oggi)) + "</small></span></div>" +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px">' + (c.tel ? '<a class="nx-btn" href="tel:' + esc(String(c.tel).replace(/[^\d+]/g, "")) + '">' + svg("tel") + "Chiama</a>" : "") + (c.email ? '<a class="nx-btn" href="mailto:' + esc(c.email) + '">' + svg("mail") + "Email</a>" : "") + '<button type="button" class="nx-btn nx-s-oggi">' + svg("ok") + "Contattato oggi</button></div>") +
          '<label class="nx-campo"><span>Nome e cognome</span><input class="nx-s-nome" autocomplete="off" value="' + esc(c.nome || "") + '"></label>' +
          '<label class="nx-campo"><span>Telefono</span><input class="nx-s-tel" type="tel" autocomplete="off" value="' + esc(c.tel || "") + '"></label>' +
          '<label class="nx-campo"><span>Email</span><input class="nx-s-mail" type="email" autocomplete="off" value="' + esc(c.email || "") + '"></label>' +
          extra.map(function (e) { return '<label class="nx-campo"><span>' + esc(e.l) + '</span><input data-k="' + esc(e.k) + '" autocomplete="off" value="' + esc(c[e.k] || "") + '"></label>'; }).join("") +
          '<div class="nx-campo"><span>Fase</span><div class="nx-chips nx-s-fasi" role="group" aria-label="Fase">' + fasi.map(function (x) { return '<button type="button" class="nx-chip" data-f="' + esc(x) + '" aria-pressed="' + (x === c.fase) + '">' + esc(x) + "</button>"; }).join("") + "</div></div>" +
          (nuovo ? "" : '<div class="nx-campo"><span>Note</span><ul class="nx-note">' + (c.note.length ? c.note.slice().reverse().map(function (n) { return "<li><time>" + esc(quando(n.d, oggi)) + "</time>" + esc(n.t) + "</li>"; }).join("") : '<li style="background:none;padding:0;color:var(--nx-tx2)">Ancora nessuna nota.</li>') + "</ul>" +
            '<textarea class="nx-s-nota" rows="2" placeholder="Scrivi una nota (es. richiamare giovedì)" aria-label="Nuova nota" style="width:100%;min-height:72px;padding:10px 12px;border:0;border-radius:12px;background:var(--nx-fill)"></textarea></div>'),
        piede: (nuovo ? "" : '<button type="button" class="nx-btn r nx-s-del">Elimina</button>') + '<button type="button" class="nx-btn p nx-s-salva">' + (nuovo ? "Aggiungi" : "Salva") + "</button>"
      });
      var fase = c.fase;
      f.querySelector(".nx-s-fasi").addEventListener("click", function (e) {
        var b = e.target.closest(".nx-chip"); if (!b) return; fase = b.getAttribute("data-f");
        f.querySelectorAll(".nx-s-fasi .nx-chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
      var ok = f.querySelector(".nx-s-oggi");
      if (ok) ok.addEventListener("click", function () { c.ultimo = new Date(oggi).toISOString(); c.note.push({ t: "Contattato", d: c.ultimo }); salva(); disegna(); NX.toast(c.nome + ": contatto segnato oggi."); NX.foglio.chiudi(f); });
      var del = f.querySelector(".nx-s-del");
      if (del) del.addEventListener("click", function () {
        if (del.getAttribute("data-conf")) { lista = lista.filter(function (x) { return x !== c; }); salva(); disegna(); NX.foglio.chiudi(f); NX.toast(c.nome + " eliminato.", "info"); }
        else { del.setAttribute("data-conf", "1"); del.textContent = "Tocca ancora per eliminare"; }
      });
      f.querySelector(".nx-s-salva").addEventListener("click", function () {
        var nome = f.querySelector(".nx-s-nome").value.trim();
        if (!nome) { f.querySelector(".nx-s-nome").setAttribute("aria-invalid", "true"); f.querySelector(".nx-s-nome").focus(); NX.toast("Scrivi almeno il nome.", "no"); return; }
        c.nome = nome; c.tel = f.querySelector(".nx-s-tel").value.trim(); c.email = f.querySelector(".nx-s-mail").value.trim(); c.fase = fase;
        f.querySelectorAll("input[data-k]").forEach(function (i) { c[i.getAttribute("data-k")] = i.value.trim(); });
        var nota = f.querySelector(".nx-s-nota");
        if (nota && nota.value.trim()) { c.note.push({ t: nota.value.trim(), d: new Date(oggi).toISOString() }); c.ultimo = new Date(oggi).toISOString(); }
        if (nuovo) { c.ultimo = new Date(oggi).toISOString(); lista.unshift(c); }
        salva(); filtro = "tutti"; disegna(); NX.foglio.chiudi(f);
        NX.toast(nuovo ? c.nome + " aggiunto." : "Modifiche salvate.");
      });
    }

    box.addEventListener("click", function (e) {
      var t = e.target;
      var ch = t.closest(".nx-crm-fasi .nx-chip"); if (ch) { filtro = ch.getAttribute("data-f"); disegna(true); return; }
      var r = t.closest("[data-id]"); if (r && box.contains(r)) { var c = trova(r.getAttribute("data-id")); if (c) scheda(c, false); return; }
      if (t.closest(".nx-crm-nuovo")) { scheda({ nome: "", tel: "", email: "", fase: fasi[0], note: [], id: "n" + Date.now().toString(36) }, true); return; }
      if (t.closest(".nx-crm-imp") || t.closest('[data-nx-azione="importa"]')) { api.importa(); return; }
      if (t.closest(".nx-crm-esp")) { api.esporta(); return; }
      if (t.closest('[data-nx-azione="azzera"]')) { filtro = "tutti"; testo = ""; box.querySelector(".nx-crm-q").value = ""; disegna(true); }
    });
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.matches("tr[data-id]")) { var c = trova(e.target.getAttribute("data-id")); if (c) scheda(c, false); } });
    var qt = null;
    box.querySelector(".nx-crm-q").addEventListener("input", function () { var v = this.value; clearTimeout(qt); qt = setTimeout(function () { testo = v; disegna(); }, 90); });

    var api = {
      lista: function () { return lista; },
      disegna: disegna,
      importa: function () {
        NX.importa({
          titolo: "Importa " + plur, cosa: plur, esempio: cfg.esempio,
          campi: [{ k: "nome", l: "Nome", obbl: true, alias: ["nominativo", "cliente", "nome e cognome", "ragione sociale", sing] }, { k: "tel", l: "Telefono", alias: ["cellulare", "cell", "tel", "numero"] }, { k: "email", l: "Email", alias: ["mail", "e-mail", "posta"] }]
            .concat(extra.map(function (e) { return { k: e.k, l: e.l, alias: e.alias || [] }; })).concat([{ k: "fase", l: "Fase", alias: ["stato", "pipeline"] }, { k: "nota", l: "Note", alias: ["note", "commento"] }]),
          onConferma: function (rows) {
            var nuovi = rows.map(function (r, i) {
              var c = { id: "i" + Date.now().toString(36) + i, nome: r.nome, tel: r.tel || "", email: r.email || "", fase: fasi.indexOf(r.fase) >= 0 ? r.fase : fasi[0], ultimo: new Date(oggi).toISOString(), note: r.nota ? [{ t: r.nota, d: new Date(oggi).toISOString() }] : [] };
              extra.forEach(function (e) { c[e.k] = r[e.k] || ""; });
              return c;
            });
            lista = nuovi.concat(lista); salva(); filtro = "tutti"; disegna(true);
            return nuovi.length;
          }
        });
      },
      esporta: function () {
        var testa = ["Nome", "Telefono", "Email"].concat(extra.map(function (e) { return e.l; })).concat(["Fase", "Ultimo contatto", "Note"]);
        var righe = lista.map(function (c) {
          return [c.nome, c.tel, c.email].concat(extra.map(function (e) { return c[e.k] || ""; })).concat([c.fase, c.ultimo ? new Date(c.ultimo).toLocaleDateString("it-IT") : "", c.note.map(function (n) { return n.t; }).join(" | ")]);
        });
        NX.csv.scarica(cfg.nomeFile || plur + ".csv", [testa].concat(righe));
        NX.toast("Esportati " + lista.length + " " + plur + " in CSV.");
      },
      ripristina: function () { lista = prepara(cfg.dati || []); salva(); disegna(true); }
    };
    disegna();
    return api;
  };

  /* avvio automatico delle preferenze se la pagina lo chiede */
  if (root.hasAttribute("data-nx-auto")) NX.pref.init();
})();
