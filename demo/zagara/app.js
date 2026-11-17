/* Zagara · app dimostrativa sul kit Noxford.
   Nessun dato viene inviato: vassoio e ordini restano nel browser. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace(".", ",") + " €"; };
  var ridotto = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("zagara-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("zagara-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  var I = {
    opzioni: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    indietro: '<path d="M15 5l-7 7 7 7"/>', piu: '<path d="M12 5v14M5 12h14"/>', meno: '<path d="M5 12h14"/>',
    orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    torta: '<path d="M4 20h16M5 20v-7h14v7"/><path d="M5 15.5c2 1.5 3.5-1 5 0s3.5-1.5 5 0 3 1 4 0"/><path d="M12 13V9.5M12 7.5v.01"/>',
    tazza: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M11 3v2.5"/>',
    calendario: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>'
  };
  function ic(k) { return '<svg class="a-i" viewBox="0 0 24 24" aria-hidden="true">' + (I[k] || "") + "</svg>"; }
  var ILL = {
    cornetto: '<svg viewBox="0 0 64 64"><path d="M8 40c6-16 42-16 48 0-6 6-42 6-48 0z" fill="#E5A65A"/><path d="M20 30l3 12M32 27v15M44 30l-3 12" stroke="#B9772F" stroke-width="2"/></svg>',
    tazza: '<svg viewBox="0 0 64 64"><path d="M14 26h30v10a15 15 0 0 1-30 0z" fill="#fff" stroke="#4A2C22" stroke-width="2"/><path d="M44 29h4a5 5 0 0 1 0 10h-5" fill="none" stroke="#4A2C22" stroke-width="2"/><ellipse cx="29" cy="26" rx="15" ry="3" fill="#B27B52"/></svg>',
    torta: '<svg viewBox="0 0 64 64"><rect x="12" y="28" width="40" height="20" rx="3" fill="#F6E1DF" stroke="#4A2C22" stroke-width="2"/><path d="M12 34c5 4 9-4 14 0s9-4 14 0 9-4 12 0" fill="none" stroke="#9DB46C" stroke-width="3"/><circle cx="32" cy="22" r="4" fill="#C9473A"/></svg>',
    mignon: '<svg viewBox="0 0 64 64"><circle cx="22" cy="36" r="10" fill="#F2D19B"/><circle cx="42" cy="36" r="10" fill="#E9B9B3"/><circle cx="32" cy="24" r="9" fill="#9DB46C"/></svg>',
    bicchiere: '<svg viewBox="0 0 64 64"><path d="M20 14h24l-4 38H24z" fill="#FFE3A3" stroke="#4A2C22" stroke-width="2"/></svg>'
  };

  /* ---------- dati (inventati) ---------- */
  var CAT = [["colazione", "Colazione"], ["pasticceria", "Pasticceria"], ["torte", "Torte"], ["bar", "Caffetteria"]];
  var MENU = [
    { id: "cornetto", c: "colazione", n: "Cornetto vuoto", d: "Burro, lievitazione di 18 ore.", p: 1.2, ill: "cornetto", fresco: 1 },
    { id: "cornpist", c: "colazione", n: "Cornetto al pistacchio", d: "Crema al pistacchio di Sicilia e granella.", p: 1.8, img: "img/vetrina.webp", fresco: 1 },
    { id: "cornmarm", c: "colazione", n: "Cornetto all'albicocca", d: "Confettura fatta da noi.", p: 1.4, ill: "cornetto" },
    { id: "colaz", c: "colazione", n: "Colazione al banco", d: "Cappuccino e cornetto a scelta.", p: 3, img: "img/colazione.webp", fresco: 1 },
    { id: "cannolo", c: "pasticceria", n: "Cannolo siciliano", d: "Ricotta di pecora, riempito al momento.", p: 3, img: "img/cannoli.webp", fresco: 1 },
    { id: "mignon", c: "pasticceria", n: "Vassoio di mignon", d: "Bignè, crostatine, cannolicchi: scegli quanti pezzi.", p: 1.3, ill: "mignon", unita: "al pezzo" },
    { id: "crostata", c: "pasticceria", n: "Crostatina ai frutti di bosco", d: "Frolla al burro e crema pasticcera.", p: 2.5, ill: "mignon" },
    { id: "torta", c: "torte", n: "Torta su ordinazione", d: "Pan di Spagna, crema e frutta, con la tua scritta. Pronta in 48 ore.", p: 0, ill: "torta", torta: 1 },
    { id: "cassata", c: "torte", n: "Cassata", d: "Ricotta, pan di Spagna, pasta reale e frutta candita.", p: 0, ill: "torta", torta: 1, gusto: "Classica" },
    { id: "caffe", c: "bar", n: "Caffè", d: "Miscela 80% arabica.", p: 1.1, ill: "tazza" },
    { id: "cappuccino", c: "bar", n: "Cappuccino", d: "Anche con latte di avena.", p: 1.6, ill: "tazza" },
    { id: "spremuta", c: "bar", n: "Spremuta d'arancia", d: "Arance di stagione.", p: 3.5, ill: "bicchiere" }
  ];
  var MISURE = [["6", "6 persone", 24], ["10", "10 persone", 38], ["16", "16 persone", 58]];
  var GUSTI = [["Crema e frutti di bosco", 0], ["Chantilly e cioccolato", 0], ["Pistacchio", 4], ["Ricotta e pere", 2]];
  var STATI = ["Ricevuto", "In preparazione", "Pronto"];
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var nomeCat = function (c) { return CAT.filter(function (x) { return x[0] === c; })[0][1]; };
  function th(m, cls) { return m.img ? '<img class="a-th ' + (cls || "") + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">' : '<span class="a-th ill ' + (cls || "") + '" aria-hidden="true">' + ILL[m.ill] + "</span>"; }
  var prezzoDa = function (m) { return m.torta ? "da " + euro(MISURE[0][2]) : euro(m.p) + (m.unita ? " " + m.unita : ""); };
  var dataMin = function () { var x = new Date(); x.setDate(x.getDate() + 2); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); };
  var giornoBello = function (g) { return new Date(g + "T12:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }); };

  /* ---------- stato ---------- */
  var st = mem.get("stato", null) || {};
  ["modo", "slot", "ordini"].forEach(function (k) { if (st[k] === undefined) st[k] = { modo: "asporto", slot: null, ordini: [] }[k]; });
  var cart = mem.get("vassoio", []);
  var cat = "colazione", timer = null;
  function salva() { mem.set("vassoio", cart); mem.set("stato", st); badge(); }
  function nPezzi() { return cart.reduce(function (a, r) { return a + (r.unita ? 1 : r.q); }, 0); }
  function aperto() { var h = new Date().getHours(); return h >= 6 && h < 20; }
  function pillAperto() { return aperto() ? '<span class="nx-pill ok">Aperto fino alle 20</span>' : '<span class="nx-pill wait">Chiuso · apre alle 6:00</span>'; }
  function slotOrari() {
    var out = [], x = new Date(); x.setMinutes(x.getMinutes() + 20); x.setMinutes(Math.ceil(x.getMinutes() / 15) * 15, 0, 0);
    for (var i = 0; i < 8; i++) { var h = x.getHours(); if (h >= 6 && h < 20) out.push(h + ":" + ("0" + x.getMinutes()).slice(-2)); x.setMinutes(x.getMinutes() + 15); }
    return out.length ? out : ["7:00", "7:15", "7:30", "7:45", "8:00", "8:15"];
  }

  /* ---------- stile, tema e vetro ---------- */
  var q = new URLSearchParams(location.search);
  var stile = /^[abc]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var STILI = { a: ["Classico", "Liste raggruppate, come le app di sistema."], b: ["Editoriale", "Foto grandi e titoli importanti."], c: ["Veloce", "Griglia fitta e aggiunta con un tocco."] };
  NX.pref.init();
  if (q.get("tema")) NX.pref.tema(q.get("tema"), { salva: false });
  if (q.get("vetro")) NX.pref.vetro(q.get("vetro") !== "no", { salva: false });
  root.setAttribute("data-stile", stile);
  function scriviUrl() {
    var p = new URLSearchParams(location.search);
    p.set("stile", stile); p.set("tema", NX.pref.temaAttivo()); p.set("vetro", NX.pref.vetroAttivo() ? "si" : "no");
    try { history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash); } catch (e) {}
  }
  d.addEventListener("nx:pref", scriviUrl);
  function impostaStile(v) { stile = v; root.setAttribute("data-stile", v); scriviUrl(); route(false); }
  function opzioni() {
    var f = NX.foglio.apri({
      titolo: "Stile, tema e vetro",
      html: '<div class="nx-campo"><span>Stile dell\'app</span><div class="nx-seg pieno a-f-s" role="group" aria-label="Stile dell\'app">' +
        ["a", "b", "c"].map(function (v) { return '<button type="button" data-v="' + v + '" aria-pressed="' + (v === stile) + '">' + STILI[v][0] + "</button>"; }).join("") +
        '</div><small class="a-f-d">' + STILI[stile][1] + "</small></div>" +
        '<ul class="nx-lista"><li><label class="nx-cella nx-toggle a-tg"><span class="nx-c-tx"><b>Tema scuro</b></span><input type="checkbox" class="a-f-t"><i></i></label></li>' +
        '<li><label class="nx-cella nx-toggle a-tg"><span class="nx-c-tx"><b>Effetto vetro</b></span><input type="checkbox" class="a-f-v"><i></i></label></li></ul>' +
        '<p class="a-nota">Attività inventata, dati di esempio. Le scelte restano in questo browser.</p>'
    });
    NX.seg(f.querySelector(".a-f-s"), function (v) { f.querySelector(".a-f-d").textContent = STILI[v][1]; impostaStile(v); });
    NX.pref.collega(f.querySelector(".a-f-t"), "tema");
    NX.pref.collega(f.querySelector(".a-f-v"), "vetro");
  }

  /* ---------- pezzi comuni ---------- */
  function marchio() { return '<a class="a-marchio" href="#/home" aria-label="Zagara, home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#F6E1DF"/><g fill="#fff" stroke="#4A2C22" stroke-width="1.1"><ellipse cx="16" cy="8.5" rx="3.2" ry="5.5"/><ellipse cx="16" cy="23.5" rx="3.2" ry="5.5"/><ellipse cx="8.5" cy="16" rx="5.5" ry="3.2"/><ellipse cx="23.5" cy="16" rx="5.5" ry="3.2"/></g><circle cx="16" cy="16" r="2.8" fill="#9DB46C"/></svg></a>'; }
  function indietro(t, h) { return '<a class="nx-btn t a-indietro" href="' + h + '">' + ic("indietro") + "<span>" + esc(t) + "</span></a>"; }
  function nav(o) {
    return '<header class="nx-navbar a-nav' + (o.fissa ? " a-nav-fissa" : "") + '"><div class="nx-nb-riga"><div class="a-nb-sx">' + (o.sx || marchio()) + '</div><span class="nx-nb-pic">' + esc(o.titolo) +
      '</span><div class="a-nb-dx"><button class="nx-btn ico t" type="button" data-a="opzioni" aria-label="Stile, tema e vetro">' + ic("opzioni") + "</button></div></div></header>";
  }
  function titolo(t, sotto) { return '<div class="a-pad a-testa"><h1 class="nx-tit-grande a-tit">' + esc(t) + "</h1>" + (sotto ? '<p class="a-sotto">' + sotto + "</p>" : "") + "</div>"; }
  function passo(attr, i, n, nome) {
    return '<span class="a-passo"><button type="button" ' + attr + '="-1"' + (i != null ? ' data-i="' + i + '"' : "") + ' aria-label="Uno in meno' + (nome ? ": " + esc(nome) : "") + '">' + ic("meno") + '</button><output class="nx-num">' + n +
      '</output><button type="button" ' + attr + '="1"' + (i != null ? ' data-i="' + i + '"' : "") + ' aria-label="Uno in più' + (nome ? ": " + esc(nome) : "") + '">' + ic("piu") + "</button></span>";
  }
  function cella(m) {
    return '<li><a class="nx-cella a-voce" href="#/dolce/' + m.id + '">' + th(m) + '<span class="nx-c-tx"><b>' + esc(m.n) + "</b><small>" + esc(m.d) + '</small></span><span class="nx-c-dx a-prezzo nx-num">' + prezzoDa(m) + "</span></a></li>";
  }
  function tessera(m) {
    return '<div class="a-tile"><a class="a-tile-l" href="#/dolce/' + m.id + '" data-nx-premi>' + th(m, "q") + "<b>" + esc(m.n) + '</b><span class="nx-num">' + prezzoDa(m) + "</span></a>" +
      (m.torta ? "" : '<button class="nx-btn ico p a-tile-piu" type="button" data-agg="' + m.id + '" aria-label="Aggiungi ' + esc(m.n) + '">' + ic("piu") + "</button>") + "</div>";
  }

  /* ---------- HOME ---------- */
  function home() {
    var fre = MENU.filter(function (m) { return m.fresco; });
    if (stile === "b") {
      return nav({ titolo: "Zagara", fissa: 1 }) +
        '<div class="a-ed-hero"><img src="img/vetrina.webp" width="1200" height="896" alt="Il banco della pasticceria con cornetti, cornetti al pistacchio, cannoli, crostatine e bignè" fetchpriority="high"></div>' +
        '<div class="a-pad a-ed-apre"><p class="a-occhiello">' + (aperto() ? "Aperto fino alle 20" : "Apriamo alle 6:00") + " · ritiro senza fila</p>" +
        '<h1 class="a-display">Ordina prima, <em>ritira senza fila.</em></h1>' +
        '<p class="a-lead">Scegli dal banco, dicci a che ora passi e trovi il vassoio pronto alla cassa col tuo numero.</p>' +
        '<a class="nx-btn p a-cta" href="#/banco">Guarda il banco</a></div>' +
        '<section class="a-pad a-sez"><a class="a-card-ed" href="#/dolce/cannolo" data-nx-premi><img src="img/cannoli.webp" alt="" loading="lazy" width="1024" height="1024"><span class="a-card-ed-tx"><b>Il cannolo si riempie al momento</b><span>La cialda resta croccante: la ricotta la mettiamo quando arrivi a ritirarlo.</span><em class="nx-num">' + euro(3) + "</em></span></a>" +
        '<a class="a-card-ed" href="#/dolce/colaz" data-nx-premi><img src="img/colazione.webp" alt="" loading="lazy" width="1024" height="1024"><span class="a-card-ed-tx"><b>Colazione al banco</b><span>Cappuccino e cornetto a scelta, pronti all\'ora che dici tu.</span><em class="nx-num">' + euro(3) + "</em></span></a></section>" +
        '<section class="a-pad a-sez"><a class="a-torta-b" href="#/dolce/torta" data-nx-premi><span class="a-torta-ill" aria-hidden="true">' + ILL.torta + '</span><span><small>Su ordinazione, 48 ore prima</small><b>La torta con la tua scritta</b><span>Da 6 a 16 persone, da ' + euro(24) + "</span></span>" + ic("freccia") + "</a></section>";
    }
    if (stile === "c") {
      return nav({ titolo: "Zagara" }) + titolo("Zagara") +
        '<div class="a-pad"><div class="a-righello">' + pillAperto() + '<span class="nx-pill a-pill-i">' + ic("orologio") + "Pronto alle " + slotOrari()[0] + "</span></div>" +
        '<section class="a-sez"><h2 class="a-sez-t">Colazione veloce</h2><div class="a-griglia">' + ["cornetto", "cornpist", "colaz", "cappuccino"].map(function (id) { return tessera(byId(id)); }).join("") + "</div></section>" +
        '<section class="a-sez"><a class="a-torta-c" href="#/dolce/torta" data-nx-premi><span class="nx-c-ic">' + ic("torta") + '</span><span><b>Torta su ordinazione</b><small>Scegli grandezza, farcitura e scritta</small></span><i class="nx-chev"></i></a></section>' +
        '<section class="a-sez"><h2 class="a-sez-t">Il banco</h2><div class="a-cat-c a-cat-4">' + CAT.map(function (c) { return '<a href="#/banco/' + c[0] + '" data-nx-premi><span class="a-cat-ill" aria-hidden="true">' + ILL[{ colazione: "cornetto", pasticceria: "mignon", torte: "torta", bar: "tazza" }[c[0]]] + "</span><span>" + c[1] + "</span></a>"; }).join("") + "</div></section></div>";
    }
    return nav({ titolo: "Zagara" }) + titolo("Zagara", pillAperto() + " <span>Via Roma 21 · ritiro senza fila</span>") + '<div class="a-pad">' +
      '<a class="a-hero" href="#/banco" data-nx-premi><img src="img/vetrina.webp" width="1200" height="896" alt="Il banco della pasticceria con cornetti, cannoli, crostatine e bignè" fetchpriority="high"><span class="a-hero-tx"><b>Ordina prima, ritira senza fila</b><span>Il vassoio ti aspetta alla cassa</span></span></a>' +
      '<section class="a-sez"><ul class="nx-lista"><li><a class="nx-cella ic" href="#/banco/colazione"><span class="nx-c-ic">' + ic("tazza") + '</span><span class="nx-c-tx"><b>Colazione</b><small>Al banco o da portare via</small></span><i class="nx-chev"></i></a></li>' +
      '<li><a class="nx-cella ic" href="#/dolce/torta"><span class="nx-c-ic">' + ic("torta") + '</span><span class="nx-c-tx"><b>Torte</b><small>Su ordinazione, con la tua scritta</small></span><i class="nx-chev"></i></a></li></ul></section>' +
      '<section class="a-sez"><h2 class="nx-gruppo-t">Appena sfornati</h2><ul class="nx-lista">' + fre.map(cella).join("") + "</ul></section>" +
      '<section class="a-sez a-storia"><img src="img/cannoli.webp" width="1024" height="1024" alt="Tre cannoli con ricotta, granella di pistacchio e scorza d\'arancia candita" loading="lazy"><div><h2>Il cannolo si riempie al momento</h2><p>La cialda resta croccante: la ricotta la mettiamo quando arrivi a ritirarlo.</p></div></section></div>';
  }

  /* ---------- BANCO ---------- */
  function banco(c) {
    if (CAT.some(function (x) { return x[0] === c; })) cat = c;
    return nav({ titolo: "Il banco" }) + titolo("Il banco") +
      '<div class="a-filtri"><div class="nx-chips" role="group" aria-label="Categorie">' + CAT.map(function (x) { return '<button class="nx-chip" type="button" data-cat="' + x[0] + '" aria-pressed="' + (x[0] === cat) + '">' + x[1] + "</button>"; }).join("") + "</div></div>" +
      '<div class="a-pad" id="a-lista" aria-live="polite">' + listaHtml() + "</div>";
  }
  function listaHtml() {
    var voci = MENU.filter(function (m) { return m.c === cat; });
    var testa = '<h2 class="nx-gruppo-t a-lista-t">' + esc(nomeCat(cat)) + "</h2>";
    if (stile === "c") return testa + '<div class="a-griglia">' + voci.map(tessera).join("") + "</div>";
    if (stile === "b") return testa + voci.map(function (m) {
      return '<a class="a-card-b' + (m.img ? " foto" : "") + '" href="#/dolce/' + m.id + '" data-nx-premi>' + (m.img ? '<img src="' + m.img + '" alt="" loading="lazy" width="1024" height="1024">' : th(m)) +
        '<span class="a-card-b-tx"><b>' + esc(m.n) + "</b><span>" + esc(m.d) + '</span><em class="nx-num">' + prezzoDa(m) + "</em></span></a>";
    }).join("");
    return testa + '<ul class="nx-lista">' + voci.map(cella).join("") + "</ul>";
  }

  /* ---------- DOLCE ---------- */
  function riga(tipo, nome, val, testo, on, dx) {
    return '<li><label class="nx-cella a-opz"><input type="' + tipo + '" name="' + nome + '" value="' + esc(val) + '"' + (on ? " checked" : "") + '><span class="nx-c-tx"><b>' + esc(testo) + "</b></span>" +
      '<span class="nx-c-dx nx-num">' + dx + '</span><i class="a-segno" aria-hidden="true"></i></label></li>';
  }
  function formHtml(m) {
    var h = "";
    if (m.torta) {
      h += '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t">Grandezza</legend><ul class="nx-lista">' + MISURE.map(function (x, i) { return riga("radio", "mis", x[0], x[1], i === 1, euro(x[2])); }).join("") + "</ul></fieldset>";
      if (!m.gusto) h += '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t">Farcitura</legend><ul class="nx-lista">' + GUSTI.map(function (g, i) { return riga("radio", "gusto", g[0], g[0], !i, g[1] ? "+" + euro(g[1]) : "compresa"); }).join("") + "</ul></fieldset>";
      h += '<div class="nx-gruppo"><div class="a-anteprima" aria-hidden="true"><div class="a-ant-in"><svg viewBox="0 0 320 150"><ellipse cx="160" cy="118" rx="140" ry="22" class="t-piatto"/><path d="M40 60v52c0 12 54 22 120 22s120-10 120-22V60" class="t-lato"/><ellipse cx="160" cy="60" rx="120" ry="30" class="t-sopra"/><path d="M40 78c14 10 26-6 40 2s26-8 40 0 26-8 40 0 26-8 40 0 26-8 40 0 18 4 20 0" class="t-crema"/></svg><span id="a-scritta-v" class="vuota">La tua scritta</span></div></div>' +
        '<label class="nx-campo"><span>Scritta sulla torta (facoltativa)</span><input id="a-scritta" maxlength="28" placeholder="Es. Auguri nonna Rosa" autocomplete="off"><small id="a-cont">0 di 28 caratteri</small></label>' +
        '<label class="nx-campo"><span>Giorno di ritiro</span><input type="date" id="a-giorno" min="' + dataMin() + '" value="' + dataMin() + '" required><small id="a-giorno-n">Almeno 48 ore prima: dal ' + giornoBello(dataMin()) + " in poi.</small></label></div>";
    }
    return '<form class="a-pform" data-id="' + m.id + '" data-n="' + (m.unita ? 12 : 1) + '" novalidate>' + h +
      '<div class="a-aggiungi nx-vetro">' + (m.torta ? "" : passo("data-q", null, m.unita ? 12 : 1)) + '<button class="nx-btn p" type="submit">' + (m.torta ? "Prenota · " : "Aggiungi · ") + '<span class="a-tot nx-num"></span></button></div></form>';
  }
  function dolce(id) {
    var m = byId(id) || MENU[0];
    var media = m.img ? '<img src="' + m.img + '" alt="' + esc(m.n) + '" width="1024" height="1024">' : '<span class="a-media-ill" aria-hidden="true">' + ILL[m.ill] + "</span>";
    return nav({ titolo: m.n, sx: indietro(nomeCat(m.c), "#/banco/" + m.c) }) +
      '<div class="a-prod"><div class="a-prod-media' + (m.img ? "" : " senza") + '">' + media + "</div>" +
      '<div class="a-pad"><h1 class="nx-tit-grande a-tit">' + esc(m.n) + '</h1><p class="a-desc">' + esc(m.d) + "</p>" +
      '<p class="a-prod-meta"><span class="nx-num">' + prezzoDa(m) + "</span>" + (m.unita ? ' <span class="a-pz">minimo 6 pezzi</span>' : "") + "</p>" + formHtml(m) + "</div></div>";
  }
  function scelta(f) {
    var m = byId(f.getAttribute("data-id"));
    if (!m.torta) return { m: m, unit: m.p, nota: m.unita ? "pezzi misti" : "" };
    var mv = ($("input[name=mis]:checked", f) || {}).value, mis = MISURE.filter(function (x) { return x[0] === mv; })[0] || MISURE[1];
    var g = $("input[name=gusto]:checked", f), gp = g ? GUSTI.filter(function (x) { return x[0] === g.value; })[0][1] : 0;
    var scr = ($("#a-scritta", f).value || "").trim(), gi = $("#a-giorno", f).value;
    return { m: m, unit: mis[2] + gp, giorno: gi, nota: mis[1] + ", " + (g ? g.value.toLowerCase() : m.gusto.toLowerCase()) + (scr ? ", scritta «" + scr + "»" : "") + (gi ? ", ritiro " + giornoBello(gi) : "") };
  }
  function aggiornaForm(f) {
    var s = scelta(f), qn = +f.getAttribute("data-n");
    $(".a-tot", f).textContent = euro(s.unit * qn);
    var o = $(".a-passo output", f); if (o) o.textContent = qn;
    var sc = $("#a-scritta", f);
    if (sc) { $("#a-cont", f).textContent = sc.value.length + " di 28 caratteri"; $("#a-scritta-v", f).textContent = sc.value.trim() || "La tua scritta"; $("#a-scritta-v", f).classList.toggle("vuota", !sc.value.trim()); }
  }
  function aggiungi(s, qn) {
    var ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
    if (ex) ex.q += qn; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: qn, torta: !!s.m.torta, unita: !!s.m.unita });
    salva(); var b = $("#a-badge"); b.classList.remove("a-pop"); void b.offsetWidth; b.classList.add("a-pop");
  }

  /* ---------- VASSOIO ---------- */
  function totale() { return cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0); }
  function vassoio() {
    var h = nav({ titolo: "Vassoio" }) + titolo("Il tuo vassoio");
    if (!cart.length) return h + '<div class="a-pad">' + NX.stato.vuoto("Il vassoio è vuoto", "I cornetti al pistacchio escono adesso dal forno.", ["Guarda il banco", "banco"]) + "</div>";
    var orari = slotOrari(), solotorte = cart.every(function (r) { return r.torta; });
    if (!st.slot || orari.indexOf(st.slot) < 0) st.slot = orari[0];
    return h + '<div class="a-pad">' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Nel vassoio</h2><ul class="nx-lista a-righe">' + cart.map(function (r, i) {
        return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(r.n) + (r.unita ? " · " + r.q + " pezzi" : "") + "</b><small>" + (esc(r.nota) || "Dal banco") + '</small></span><span class="a-riga-dx"><b class="nx-num">' + euro(r.unit * r.q) + "</b>" + (r.torta ? '<button class="nx-btn t a-togli" type="button" data-cq="-1" data-i="' + i + '">Togli</button>' : passo("data-cq", i, r.q, r.n)) + "</span></div></li>";
      }).join("") + "</ul></section>" +
      (solotorte ? '<p class="a-nota">La torta la ritiri nel giorno che hai scelto, dalle 7 alle 20.</p>' :
        '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Come lo vuoi</h2><div class="nx-seg pieno a-modo" role="group" aria-label="Come lo vuoi"><button type="button" data-v="asporto" aria-pressed="' + (st.modo === "asporto") + '">Da portare via</button><button type="button" data-v="tavolo" aria-pressed="' + (st.modo === "tavolo") + '">Al tavolo</button></div></section>' +
        '<section class="nx-gruppo"><h2 class="nx-gruppo-t">' + (st.modo === "tavolo" ? "Arrivo alle" : "Ritiro alle") + '</h2><div class="a-slot" role="group" aria-label="Orario">' + orari.map(function (o) { return '<button class="nx-chip" type="button" data-slot="' + o + '" aria-pressed="' + (st.slot === o) + '">' + o + "</button>"; }).join("") + "</div></section>") +
      '<section class="a-conti nx-num"><p class="g"><span>Da pagare in cassa</span><span>' + euro(totale()) + "</span></p></section>" +
      '<button class="nx-btn p pieno a-invia" type="button" data-a="ordina">Invia l\'ordine</button><p class="a-nota">Demo: l\'ordine non arriva a nessuno e non si paga online.</p></div>';
  }
  function ordina(btn) {
    btn.disabled = true; btn.innerHTML = '<span class="a-gira" aria-hidden="true"></span> Invio in corso';
    setTimeout(function () {
      var solo = cart.every(function (x) { return x.torta; });
      st.ordini.unshift({ n: 42 + st.ordini.length, tot: totale(), creato: Date.now(), righe: cart.map(function (x) { return (x.unita ? x.q + " pz " : x.q + "× ") + x.n; }).join(", "), quando: solo ? "Torta: ritiro nel giorno scelto" : (st.modo === "tavolo" ? "Al tavolo, arrivo alle " : "Ritiro alle ") + st.slot });
      st.ordini = st.ordini.slice(0, 6); cart = []; salva(); NX.toast("Ordine ricevuto"); location.hash = "#/ritiro";
    }, ridotto() ? 150 : 850);
  }

  /* ---------- RITIRO ---------- */
  function ritiro() {
    var o = st.ordini[0] && st.ordini[0].creato ? st.ordini[0] : null, h = nav({ titolo: "Ritiro" }) + titolo("Ritiro") + '<div class="a-pad">';
    if (o) h += '<section class="a-ticket"><small>Il tuo numero</small><div class="a-num nx-num">' + o.n + '</div><p class="a-quando">' + esc(o.quando) + '</p><div class="a-stati" id="a-stati">' + STATI.map(function (s) { return "<span>" + s + "</span>"; }).join("") + '</div><p class="a-righe-t">' + esc(o.righe) + ' · <span class="nx-num">' + euro(o.tot) + '</span></p></section><p class="a-nota">Mostra il numero alla cassa. Nella demo lo stato avanza da solo.</p>';
    else h += NX.stato.vuoto("Nessun ordine da ritirare", "Ordina dal banco e qui trovi il tuo numero.", ["Guarda il banco", "banco"]);
    var vecchi = st.ordini.slice(o ? 1 : 0, 4).concat([{ n: 37, righe: "2× Cornetto al pistacchio, 2× Cappuccino", tot: 6.8, quando: "sabato, ritiro alle 8:30" }]);
    return h + '<section class="nx-gruppo a-sez"><h2 class="nx-gruppo-t">Ordini di prima</h2><ul class="nx-lista">' + vecchi.map(function (x) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>N. ' + x.n + "</b><small>" + esc(x.righe) + " · " + esc(x.quando) + '</small></span><span class="nx-c-dx nx-num">' + euro(x.tot) + "</span></div></li>"; }).join("") + "</ul></section></div>";
  }
  function avviaStati() {
    var o = st.ordini[0]; if (!o || !o.creato || !$("#a-stati")) return;
    function tick() {
      if (!$("#a-stati")) { clearInterval(timer); return; }
      var f = Math.min(2, Math.floor((Date.now() - o.creato) / 8000));
      $$("#a-stati span").forEach(function (x, i) { x.className = i < f ? "fatto" : i === f ? "on" : ""; });
      if (f === 2) clearInterval(timer);
    }
    tick(); timer = setInterval(tick, 1000);
  }

  function barraC() {
    var b = $("#a-barra-c"), n = nPezzi(), mostra = stile === "c" && n > 0 && ["home", "banco", "dolce"].indexOf(corrente) >= 0;
    b.hidden = !mostra; d.body.classList.toggle("a-con-barra", mostra);
    if (mostra) b.innerHTML = '<span class="a-barra-n nx-num">' + n + '</span><span class="a-barra-t">Vassoio</span><b class="nx-num">' + euro(totale()) + "</b>" + ic("freccia");
  }
  function badge() { var b = $("#a-badge"), n = nPezzi(); b.hidden = !n; b.textContent = n; $('#a-tab [data-t="vassoio"]').setAttribute("aria-label", "Vassoio, " + n + (n === 1 ? " voce" : " voci")); }

  /* ---------- router ---------- */
  var V = { home: home, banco: banco, dolce: dolce, vassoio: vassoio, ritiro: ritiro };
  var ORD = ["home", "banco", "dolce", "vassoio", "ritiro"];
  var TITOLI = { home: "Home", banco: "Il banco", vassoio: "Vassoio", ritiro: "Ritiro" };
  var vista = $("#a-vista"), corrente = null;
  function route(anima) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), nome = V[p[0]] ? p[0] : "home";
    clearInterval(timer);
    var html = V[nome](p[1] ? decodeURIComponent(p[1]) : "");
    if (anima === false || !corrente || ridotto()) vista.innerHTML = html;
    else NX.vista(vista, html, ORD.indexOf(nome) >= ORD.indexOf(corrente) ? "dx" : "sx");
    var cambio = nome !== corrente; corrente = nome;
    var tab = nome === "dolce" ? "banco" : nome;
    $$("#a-tab a").forEach(function (a) { if (a.getAttribute("data-t") === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (nome === "dolce" ? (byId(p[1]) || MENU[0]).n : TITOLI[nome]) + " · Zagara (app dimostrativa)";
    if (nome === "ritiro") avviaStati();
    if (nome === "dolce") { var f = $("form.a-pform", vista); if (f) aggiornaForm(f); }
    var s = $(".nx-seg.a-modo", vista); if (s) NX.seg(s, function (v) { st.modo = v; salva(); route(false); });
    barraC();
    if (cambio && anima !== false) window.scrollTo(0, 0);
    nav$();
  }
  function nav$() { var n = $(".a-nav", vista); if (n) n.classList.toggle("nx-compatta", (window.scrollY || root.scrollTop) > 40); }
  window.addEventListener("scroll", nav$, { passive: true });

  d.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a],[data-nx-azione],[data-agg],[data-cq],[data-cat],[data-slot],button[data-q]");
    if (!a) return;
    var az = a.getAttribute("data-a") || a.getAttribute("data-nx-azione");
    if (az === "opzioni") opzioni();
    else if (az === "banco") location.hash = "#/banco";
    else if (az === "ordina") ordina(a);
    else if (a.hasAttribute("data-agg")) { var m = byId(a.getAttribute("data-agg")); aggiungi({ m: m, unit: m.p, nota: m.unita ? "pezzi misti" : "" }, m.unita ? 12 : 1); NX.toast(m.n + " nel vassoio"); barraC(); }
    else if (a.hasAttribute("data-cat")) { cat = a.getAttribute("data-cat"); try { history.replaceState(null, "", location.pathname + location.search + "#/banco/" + cat); } catch (x) {} $("#a-lista").innerHTML = listaHtml(); $$(".a-filtri .nx-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === cat)); }); }
    else if (a.hasAttribute("data-slot")) { st.slot = a.getAttribute("data-slot"); salva(); route(false); }
    else if (a.hasAttribute("data-cq")) {
      var i = +a.getAttribute("data-i"), r = cart[i]; if (!r) return;
      r.q += +a.getAttribute("data-cq") * (r.unita ? 6 : 1);
      if (r.q < (r.unita ? 6 : 1) || r.torta) { cart.splice(i, 1); NX.toast(r.n + " tolto dal vassoio"); }
      salva(); route(false);
    } else if (a.hasAttribute("data-q")) {
      var fm = a.closest("form.a-pform"); if (!fm) return;
      var mm = byId(fm.getAttribute("data-id")), passoQ = mm.unita ? 6 : 1;
      fm.setAttribute("data-n", Math.max(mm.unita ? 6 : 1, Math.min(mm.unita ? 60 : 12, +fm.getAttribute("data-n") + passoQ * +a.getAttribute("data-q")))); aggiornaForm(fm);
    }
  });
  d.addEventListener("input", function (e) { var f = e.target.closest("form.a-pform"); if (f) aggiornaForm(f); });
  d.addEventListener("change", function (e) { var f = e.target.closest("form.a-pform"); if (f) aggiornaForm(f); });
  d.addEventListener("submit", function (e) {
    var f = e.target; if (!f.matches("form.a-pform")) return;
    e.preventDefault();
    var s = scelta(f), qn = +f.getAttribute("data-n");
    if (s.m.torta) {
      var campo = $("#a-giorno", f), nota = $("#a-giorno-n", f);
      if (!s.giorno || s.giorno < dataMin()) {
        nota.textContent = "Per le torte servono almeno 48 ore: scegli dal " + giornoBello(dataMin()) + " in poi.";
        nota.classList.add("a-err"); campo.setAttribute("aria-invalid", "true"); campo.focus(); return;
      }
      nota.classList.remove("a-err"); campo.removeAttribute("aria-invalid");
    }
    aggiungi(s, qn); NX.toast((s.m.unita ? qn + " pezzi · " : qn > 1 ? qn + " × " : "") + s.m.n + " nel vassoio");
    location.hash = "#/banco/" + s.m.c;
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); route(true); });

  badge(); route(false);
})();
