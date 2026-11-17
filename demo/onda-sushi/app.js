/* Onda Sushi · app dimostrativa sul kit Noxford.
   Nessun dato viene inviato: carrello e ordini restano nel browser. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace(".", ",") + " €"; };
  var ridotto = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("ondasushi-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("ondasushi-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- icone (tratto) e disegni dei piatti senza foto ---------- */
  var I = {
    opzioni: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    indietro: '<path d="M15 5l-7 7 7 7"/>', piu: '<path d="M12 5v14M5 12h14"/>', meno: '<path d="M5 12h14"/>',
    orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', ripeti: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>', onda: '<path d="M3 14c3-5 6-5 9 0s6 5 9 0"/>', cestino: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    bici: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M9 9h3"/>'
  };
  function ic(k) { return '<svg class="a-i" viewBox="0 0 24 24" aria-hidden="true">' + (I[k] || "") + "</svg>"; }
  var ILL = {
    nigiri: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="9" fill="#fff" stroke="#D8CFBF"/><path d="M12 36c4-10 36-10 40 0-8 5-32 5-40 0z" fill="#F08A5D"/><path d="M20 31l4 6M30 29l3 7M40 30l2 6" stroke="#FBD2BC" stroke-width="2"/></svg>',
    maki: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#1F2A24"/><circle cx="32" cy="32" r="15" fill="#fff"/><circle cx="29" cy="30" r="5" fill="#F08A5D"/><circle cx="36" cy="35" r="4" fill="#8DBF6A"/></svg>',
    tempura: '<svg viewBox="0 0 64 64"><path d="M14 46c6-20 22-30 38-30-4 18-18 30-38 30z" fill="#E9B65C"/><path d="M20 40l6-4M26 34l7-5M33 28l7-4" stroke="#C98E33" stroke-width="2"/><path d="M50 18l6-6" stroke="#E2603F" stroke-width="3" stroke-linecap="round"/></svg>',
    bowl: '<svg viewBox="0 0 64 64"><path d="M10 30h44c0 14-10 22-22 22S10 44 10 30z" fill="#23305A"/><ellipse cx="32" cy="30" rx="22" ry="6" fill="#fff"/><circle cx="25" cy="29" r="4" fill="#F08A5D"/><circle cx="37" cy="28" r="4" fill="#8DBF6A"/></svg>',
    drink: '<svg viewBox="0 0 64 64"><path d="M22 14h20l-3 38H25z" fill="#CFE3D8" stroke="#8FB3A1" stroke-width="2"/><path d="M24 26h16" stroke="#8FB3A1" stroke-width="2"/></svg>',
    dolce: '<svg viewBox="0 0 64 64"><circle cx="24" cy="36" r="10" fill="#F3B9C6"/><circle cx="40" cy="36" r="10" fill="#B8D99B"/><circle cx="32" cy="26" r="10" fill="#FFF3D6"/></svg>'
  };

  /* ---------- dati (inventati) ---------- */
  var CATS = [["barche", "Barche"], ["nigiri", "Nigiri"], ["roll", "Roll"], ["caldi", "Piatti caldi"], ["bowl", "Poke"], ["bevande", "Bevande"], ["dolci", "Dolci"]];
  var MENU = [
    { id: "barca", c: "barche", n: "Barca Onda per due", d: "8 nigiri, 16 uramaki, 12 hosomaki, sashimi di salmone e tonno.", p: 34, was: 42, img: "img/tagliere.webp", pz: [["36 pezzi", 0]], all: ["Pesce", "Sesamo", "Soia"] },
    { id: "barca1", c: "barche", n: "Barca piccola", d: "4 nigiri, 8 uramaki, 6 hosomaki.", p: 19, ico: "maki", pz: [["18 pezzi", 0]], all: ["Pesce", "Sesamo", "Soia"] },
    { id: "flambe", c: "nigiri", n: "Nigiri salmone scottato", d: "Salmone passato alla fiamma, lime e salsa teriyaki.", p: 6, img: "img/nigiri.webp", all: ["Pesce", "Soia", "Glutine"], chef: 1 },
    { id: "nsake", c: "nigiri", n: "Nigiri salmone", d: "Salmone norvegese su riso.", p: 4.5, ico: "nigiri", all: ["Pesce"] },
    { id: "nmaguro", c: "nigiri", n: "Nigiri tonno", d: "Tonno pinna gialla su riso.", p: 5.5, ico: "nigiri", all: ["Pesce"] },
    { id: "ura", c: "roll", n: "Uramaki salmone e avocado", d: "Riso fuori, sesamo tostato.", p: 9, ico: "maki", all: ["Pesce", "Sesamo"], roll: 1, chef: 1 },
    { id: "crunch", c: "roll", n: "Crunch roll", d: "Gambero in tempura, maionese piccante, briciole croccanti.", p: 11, ico: "tempura", all: ["Crostacei", "Glutine", "Uova"], roll: 1, chef: 1 },
    { id: "veg", c: "roll", n: "Roll vegetale", d: "Cetriolo, avocado, mango e germogli.", p: 8, ico: "maki", all: ["Sesamo"], roll: 1, veg: 1 },
    { id: "tempura", c: "caldi", n: "Tempura di gamberi", d: "Cinque gamberi in pastella leggera.", p: 10, ico: "tempura", all: ["Crostacei", "Glutine"] },
    { id: "gyoza", c: "caldi", n: "Gyoza alla piastra", d: "Ravioli di maiale e verza, sei pezzi.", p: 7, ico: "tempura", all: ["Glutine", "Soia"] },
    { id: "poke", c: "bowl", n: "Poke salmone", d: "Riso, salmone, avocado, edamame, mango e alga wakame.", p: 13, img: "img/poke.webp", all: ["Pesce", "Soia", "Sesamo"], chef: 1 },
    { id: "pokeveg", c: "bowl", n: "Poke tofu", d: "Riso integrale, tofu marinato, verdure croccanti.", p: 11, ico: "bowl", all: ["Soia", "Sesamo"], veg: 1 },
    { id: "te", c: "bevande", n: "Tè verde freddo", d: "Preparato da noi, poco zucchero.", p: 3, ico: "drink", all: [] },
    { id: "acqua", c: "bevande", n: "Acqua 50 cl", d: "Naturale o frizzante.", p: 1.5, ico: "drink", all: [] },
    { id: "mochi", c: "dolci", n: "Mochi misti", d: "Tre pezzi: tè matcha, fragola, sesamo nero.", p: 6, ico: "dolce", all: ["Latte", "Sesamo"] }
  ];
  var EXTRA = [["Salsa teriyaki", 0.5], ["Maionese piccante", 0.5], ["Zenzero in più", 0.5], ["Bacchette in più", 0]];
  var CODICI = { ONDA5: 5 };
  var ORARI = ["Prima possibile", "20:00", "20:30", "21:00", "21:30"];
  var ESEMPIO = { n: 2207, tot: 41, data: "3 novembre", voci: [{ id: "barca", n: "Barca Onda per due", unit: 34, nota: "", q: 1 }, { id: "mochi", n: "Mochi misti", unit: 3.5, nota: "", q: 2 }] };
  ESEMPIO.voci[1].unit = 6; ESEMPIO.tot = 46;
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var nomeCat = function (c) { return CATS.filter(function (x) { return x[0] === c; })[0][1]; };
  var porzioni = function (m) { return m.pz || (m.roll ? [["8 pezzi", 0], ["12 pezzi", 4]] : m.c === "nigiri" ? [["2 pezzi", 0], ["4 pezzi", m.p]] : [["Porzione normale", 0]]); };
  function thumb(m, cls) {
    return m.img ? '<img class="a-th ' + (cls || "") + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">' : '<span class="a-th ill ' + (cls || "") + '" aria-hidden="true">' + ILL[m.ico] + "</span>";
  }

  /* ---------- stato ---------- */
  var cart = mem.get("carrello", []);
  var st = mem.get("stato", null) || {};
  ["mancia", "orario", "codice", "ordini"].forEach(function (k) { if (st[k] === undefined) st[k] = { mancia: 0, orario: "Prima possibile", codice: "", ordini: [] }[k]; });
  var cat = "barche", ricerca = "", menuPronto = false, timer = null;
  function salva() { mem.set("carrello", cart); mem.set("stato", st); badge(); }
  function nPezzi() { return cart.reduce(function (a, r) { return a + r.q; }, 0); }
  function aperto() { var h = new Date().getHours(), m = new Date().getMinutes(); return (h >= 12 && h < 15) || (h >= 19 && (h < 23 || (h === 23 && m < 30))); }
  function pillAperto() { return aperto() ? '<span class="nx-pill ok">Aperto · consegna 35-45 min</span>' : '<span class="nx-pill wait">Chiuso ora · ordina per stasera</span>'; }

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
  function marchio() { return '<a class="a-marchio" href="#/home" aria-label="Onda Sushi, oggi"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#23305A"/><path d="M6 19c4-6 8-6 10 0s6 6 10 0" fill="none" stroke="#F4EFE6" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="10" r="3" fill="#D9412B"/></svg></a>'; }
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
  function tag(m) { return m.veg ? ' <span class="nx-pill ok a-tag">Veg</span>' : ""; }
  function prezzo(m) { return (m.was ? '<s class="a-was">' + euro(m.was) + "</s> " : "") + euro(m.p); }
  function contoAlla() { var x = new Date(), f = new Date(x); f.setHours(23, 59, 59, 0); var s = Math.max(0, Math.floor((f - x) / 1000)), p = function (n) { return (n < 10 ? "0" : "") + n; }; return p(Math.floor(s / 3600)) + ":" + p(Math.floor(s % 3600 / 60)) + ":" + p(s % 60); }

  /* ---------- OGGI ---------- */
  function home() {
    var chef = MENU.filter(function (m) { return m.chef; }), barca = byId("barca");
    if (stile === "b") {
      return nav({ titolo: "Onda Sushi", fissa: 1 }) +
        '<div class="a-ed-hero"><img src="img/tagliere.webp" width="1200" height="896" alt="Piatto nero con nigiri di salmone e tonno, uramaki al sesamo e hosomaki" fetchpriority="high"><span class="a-ed-bollo">−8 €</span></div>' +
        '<div class="a-pad a-ed-apre"><p class="a-occhiello">Offerta di stasera · finisce tra <b class="nx-num a-cd">' + contoAlla() + "</b></p>" +
        '<h1 class="a-display">La barca per due, a 34 € invece di 42.</h1>' +
        '<p class="a-lead">Trentasei pezzi tra nigiri, uramaki, hosomaki e sashimi. La prepariamo quando ordini, il pesce crudo è abbattuto come vuole la legge.</p>' +
        '<a class="nx-btn p a-cta" href="#/piatto/barca">Vedi la barca</a></div>' +
        '<section class="a-pad a-sez"><h2 class="a-sez-t a-display-s">Scelti dallo chef</h2>' +
        chef.filter(function (m) { return m.img; }).map(function (m) {
          return '<a class="a-card-ed" href="#/piatto/' + m.id + '" data-nx-premi><img src="' + m.img + '" alt="" loading="lazy" width="1024" height="1024"><span class="a-card-ed-tx"><b>' + esc(m.n) + "</b><span>" + esc(m.d) + '</span><em class="nx-num">' + euro(m.p) + "</em></span></a>";
        }).join("") + "</section>" +
        '<section class="a-pad a-sez"><h2 class="a-sez-t a-display-s">Il menu</h2><ul class="a-indice">' +
        CATS.map(function (c) { return '<li><a href="#/menu/' + c[0] + '"><span>' + c[1] + "</span><small>" + MENU.filter(function (m) { return m.c === c[0]; }).length + "</small>" + ic("freccia") + "</a></li>"; }).join("") + "</ul></section>";
    }
    if (stile === "c") {
      var ult = st.ordini[0] && st.ordini[0].voci ? st.ordini[0] : ESEMPIO;
      return nav({ titolo: "Onda Sushi" }) + titolo("Onda Sushi") +
        '<div class="a-pad"><div class="a-righello">' + pillAperto() + "</div>" +
        '<section class="a-sez"><div class="a-offerta-c"><img src="img/tagliere.webp" alt="" width="1200" height="896"><div><small>Offerta · finisce tra <b class="nx-num a-cd">' + contoAlla() + "</b></small><b>" + esc(barca.n) + '</b><span class="nx-num">' + prezzo(barca) + '</span></div><button class="nx-btn ico p" type="button" data-agg="barca" aria-label="Aggiungi la barca al carrello">' + ic("piu") + "</button></div></section>" +
        '<section class="a-sez"><div class="a-ripeti"><div><small>Ripeti · ordine N. ' + ult.n + "</small><b>" + esc(ult.voci.map(function (v) { return v.q + "× " + v.n; }).join(", ")) + '</b></div><button class="nx-btn p" type="button" data-a="ripeti">' + ic("ripeti") + " " + euro(ult.tot) + "</button></div></section>" +
        '<section class="a-sez"><h2 class="a-sez-t">Scelti dallo chef</h2><div class="a-griglia">' + chef.map(tessera).join("") + "</div></section>" +
        '<section class="a-sez"><h2 class="a-sez-t">Categorie</h2><div class="a-cat-c">' + CATS.slice(0, 6).map(function (c) { var m = MENU.filter(function (x) { return x.c === c[0]; })[0]; return '<a href="#/menu/' + c[0] + '" data-nx-premi><span class="a-cat-ill" aria-hidden="true">' + ILL[m.ico || (c[0] === "barche" ? "maki" : c[0] === "nigiri" ? "nigiri" : "bowl")] + "</span><span>" + c[1] + "</span></a>"; }).join("") + "</div></section></div>";
    }
    return nav({ titolo: "Oggi" }) + titolo("Onda Sushi", pillAperto()) + '<div class="a-pad">' +
      '<a class="a-hero" href="#/piatto/barca" data-nx-premi><img src="img/tagliere.webp" width="1200" height="896" alt="Piatto nero con nigiri di salmone e tonno, uramaki al sesamo e hosomaki" fetchpriority="high"><span class="a-hero-tx"><small>Offerta di oggi · finisce tra <b class="nx-num a-cd">' + contoAlla() + "</b></small><b>Barca Onda per due</b><span>34 € invece di 42 €</span></span></a>" +
      '<section class="a-sez"><h2 class="nx-gruppo-t">Categorie</h2><ul class="nx-lista">' +
      CATS.map(function (c) { return '<li><a class="nx-cella" href="#/menu/' + c[0] + '"><span class="nx-c-tx"><b>' + c[1] + '</b></span><span class="nx-c-dx">' + MENU.filter(function (m) { return m.c === c[0]; }).length + '</span><i class="nx-chev"></i></a></li>'; }).join("") + "</ul></section>" +
      '<section class="a-sez"><h2 class="nx-gruppo-t">Scelti dallo chef</h2><ul class="nx-lista">' + chef.map(cella).join("") + "</ul></section>" +
      '<p class="a-nota">Consegna gratis da 30 €. Il pesce crudo è abbattuto a −20 °C come richiesto dalla legge.</p></div>';
  }
  function cella(m) {
    return '<li><a class="nx-cella a-voce" href="#/piatto/' + m.id + '">' + thumb(m) + '<span class="nx-c-tx"><b>' + esc(m.n) + tag(m) + "</b><small>" + esc(porzioni(m)[0][0]) + " · " + esc(m.d) + '</small></span><span class="nx-c-dx a-prezzo nx-num">' + prezzo(m) + "</span></a></li>";
  }
  function tessera(m) {
    return '<div class="a-tile"><a class="a-tile-l" href="#/piatto/' + m.id + '" data-nx-premi>' + thumb(m, "q") + "<b>" + esc(m.n) + '</b><span class="nx-num">' + euro(m.p) + "</span></a>" +
      '<button class="nx-btn ico p a-tile-piu" type="button" data-agg="' + m.id + '" aria-label="Aggiungi ' + esc(m.n) + '">' + ic("piu") + "</button></div>";
  }

  /* ---------- MENU ---------- */
  function menu(c) {
    if (CATS.some(function (x) { return x[0] === c; })) cat = c;
    return nav({ titolo: "Menu" }) + titolo("Il menu") +
      '<div class="a-filtri"><label class="nx-cerca"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg><span class="nx-sr">Cerca un piatto</span><input id="a-cerca" type="search" placeholder="Cerca: salmone, tempura, veg" autocomplete="off" value="' + esc(ricerca) + '"></label>' +
      '<div class="nx-chips" role="group" aria-label="Categorie">' + CATS.map(function (x) { return '<button class="nx-chip" type="button" data-cat="' + x[0] + '" aria-pressed="' + (!ricerca && x[0] === cat) + '">' + x[1] + "</button>"; }).join("") + "</div></div>" +
      '<div class="a-pad" id="a-lista" aria-live="polite">' + (menuPronto ? listaHtml() : NX.stato.caricamento(5)) + "</div>";
  }
  function listaHtml() {
    var qq = ricerca.trim().toLowerCase();
    var voci = MENU.filter(function (m) { return qq ? (m.n + " " + m.d + (m.veg ? " veg vegetariano" : "")).toLowerCase().indexOf(qq) > -1 : m.c === cat; });
    if (!voci.length) return NX.stato.vuoto("Nessun piatto trovato", "Prova con salmone, tonno, tempura o veg.", ["Mostra tutto il menu", "svuota"]);
    var testa = '<h2 class="nx-gruppo-t a-lista-t">' + (qq ? voci.length + (voci.length === 1 ? " risultato" : " risultati") : esc(nomeCat(cat))) + "</h2>";
    if (stile === "c") return testa + '<div class="a-griglia">' + voci.map(tessera).join("") + "</div>";
    if (stile === "b") return testa + voci.map(function (m) {
      return '<a class="a-card-b' + (m.img ? " foto" : "") + '" href="#/piatto/' + m.id + '" data-nx-premi>' + (m.img ? '<img src="' + m.img + '" alt="" loading="lazy" width="1024" height="1024">' : thumb(m)) +
        '<span class="a-card-b-tx"><b>' + esc(m.n) + tag(m) + "</b><span>" + esc(porzioni(m)[0][0]) + " · " + esc(m.d) + '</span><em class="nx-num">' + prezzo(m) + "</em></span></a>";
    }).join("");
    return testa + '<ul class="nx-lista">' + voci.map(cella).join("") + "</ul>";
  }
  function disegnaLista() {
    var box = $("#a-lista"); if (!box) return;
    box.innerHTML = listaHtml();
    $$(".a-filtri .nx-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(!ricerca.trim() && b.getAttribute("data-cat") === cat)); });
  }

  /* ---------- PIATTO ---------- */
  function riga(tipo, nome, val, p, on, dx) {
    return '<li><label class="nx-cella a-opz"><input type="' + tipo + '" name="' + nome + '" value="' + esc(val) + '" data-p="' + p + '"' + (on ? " checked" : "") + '><span class="nx-c-tx"><b>' + esc(val) + "</b></span>" +
      '<span class="nx-c-dx nx-num">' + dx + '</span><i class="a-segno" aria-hidden="true"></i></label></li>';
  }
  function formHtml(m) {
    var pz = porzioni(m), h = "";
    if (pz.length > 1) h += '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t">Porzione</legend><ul class="nx-lista">' + pz.map(function (o, i) { return riga("radio", "pz", o[0], o[1], !i, o[1] ? "+" + euro(o[1]) : ""); }).join("") + "</ul></fieldset>";
    if (m.c !== "bevande" && m.c !== "dolci") h += '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t">Aggiungi</legend><ul class="nx-lista">' + EXTRA.map(function (e) { return riga("checkbox", "ex", e[0], e[1], false, e[1] ? "+" + euro(e[1]) : "gratis"); }).join("") + "</ul></fieldset>";
    h += '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Allergeni</h2><div class="a-allergeni">' + (m.all.length ? m.all.map(function (a) { return '<span class="nx-pill info">' + a + "</span>"; }).join("") : '<span class="nx-pill ok">Nessuno dei 14 principali</span>') + '</div><p class="a-nota">Per intolleranze gravi scrivici nelle note dell\'ordine o chiamaci prima.</p></section>';
    return '<form class="a-pform" data-id="' + m.id + '" data-n="1" novalidate>' + h +
      '<div class="a-aggiungi nx-vetro">' + passo("data-q", null, 1) + '<button class="nx-btn p" type="submit">Aggiungi · <span class="a-tot nx-num">' + euro(m.p) + "</span></button></div></form>";
  }
  function piatto(id) {
    var m = byId(id) || MENU[0];
    var media = m.img ? '<img src="' + m.img + '" alt="' + esc(m.n) + '" width="1200" height="896">' : '<span class="a-media-ill" aria-hidden="true">' + ILL[m.ico] + "</span>";
    return nav({ titolo: m.n, sx: indietro(nomeCat(m.c), "#/menu/" + m.c) }) +
      '<div class="a-prod"><div class="a-prod-media' + (m.img ? "" : " senza") + '">' + media + (m.was ? '<span class="a-ed-bollo">Offerta</span>' : "") + "</div>" +
      '<div class="a-pad"><h1 class="nx-tit-grande a-tit">' + esc(m.n) + '</h1><p class="a-desc">' + esc(m.d) + "</p>" +
      '<p class="a-prod-meta">' + tag(m) + ' <span class="nx-num">' + prezzo(m) + '</span> <span class="a-pz">' + esc(porzioni(m)[0][0]) + "</span></p>" + formHtml(m) + "</div></div>";
  }
  function scelte(f) {
    var m = byId(f.getAttribute("data-id")), add = 0, nota = [], pz = porzioni(m);
    $$("input:checked", f).forEach(function (i) { add += +i.getAttribute("data-p"); if (i.name === "ex" || pz.length > 1) nota.push(i.value); });
    return { m: m, unit: m.p + add, nota: nota.join(", ") };
  }
  function aggiornaForm(f) { var s = scelte(f), qn = +f.getAttribute("data-n"); $(".a-tot", f).textContent = euro(s.unit * qn); $(".a-passo output", f).textContent = qn; }
  function aggiungi(s, qn) {
    var ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
    if (ex) ex.q += qn; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: qn });
    salva(); var b = $("#a-badge"); b.classList.remove("a-pop"); void b.offsetWidth; b.classList.add("a-pop");
  }

  /* ---------- CARRELLO ---------- */
  function conti() {
    var sub = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0), sc = st.codice && sub >= 25 ? CODICI[st.codice] || 0 : 0;
    var cons = sub && sub < 30 ? 2.5 : 0, man = sub ? st.mancia : 0;
    return { sub: sub, sc: sc, cons: cons, mancia: man, tot: sub - sc + cons + man };
  }
  function carrello() {
    var h = nav({ titolo: "Carrello" }) + titolo("Carrello");
    if (!cart.length) return h + '<div class="a-pad">' + NX.stato.vuoto("Il carrello è vuoto", "Stasera la barca per due costa 8 € in meno.", ["Guarda l'offerta", "home"]) + "</div>";
    var c = conti();
    return h + '<div class="a-pad">' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">' + nPezzi() + (nPezzi() === 1 ? " piatto" : " piatti") + '</h2><ul class="nx-lista a-righe">' + cart.map(function (r, i) {
        return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(r.n) + "</b><small>" + (esc(r.nota) || "Porzione standard") + '</small></span><span class="a-riga-dx"><b class="nx-num">' + euro(r.unit * r.q) + "</b>" + passo("data-cq", i, r.q, r.n) + "</span></div></li>";
      }).join("") + "</ul></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Quando lo vuoi</h2><div class="nx-chips a-chips-a" role="group" aria-label="Orario di consegna">' + ORARI.map(function (o) { return '<button class="nx-chip" type="button" data-ora="' + o + '" aria-pressed="' + (st.orario === o) + '">' + o + "</button>"; }).join("") + "</div></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Mancia al rider</h2><div class="nx-seg pieno a-mancia" role="group" aria-label="Mancia al rider">' + [0, 1, 2, 3].map(function (m) { return '<button type="button" data-v="' + m + '" aria-pressed="' + (st.mancia === m) + '">' + (m ? m + " €" : "No") + "</button>"; }).join("") + '</div><p class="a-nota">Va tutta al rider.</p></section>' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Codice sconto</h2><form class="a-codice" id="a-f-codice" novalidate><label class="nx-sr" for="a-codice">Codice sconto</label><input id="a-codice" placeholder="Es. ONDA5" value="' + esc(st.codice) + '" autocomplete="off"><button class="nx-btn" type="submit">Applica</button></form>' +
      '<p class="a-msg' + (c.sc ? " ok" : "") + '" id="a-codice-msg" role="status">' + (c.sc ? "ONDA5 applicato: 5 € in meno." : st.codice ? "ONDA5 vale da 25 € di spesa: mancano " + euro(25 - c.sub) + "." : "Codice di prova: ONDA5, da 25 € in su.") + "</p></section>" +
      '<section class="a-conti nx-num"><p><span>Piatti</span><span>' + euro(c.sub) + "</span></p>" + (c.sc ? '<p class="ok"><span>Sconto</span><span>−' + euro(c.sc) + "</span></p>" : "") + "<p><span>Consegna</span><span>" + (c.cons ? euro(c.cons) : "Gratis") + "</span></p>" + (c.mancia ? "<p><span>Mancia</span><span>" + euro(c.mancia) + "</span></p>" : "") + '<p class="g"><span>Totale</span><span>' + euro(c.tot) + "</span></p></section>" +
      '<button class="nx-btn p pieno a-invia" type="button" data-a="ordina">Conferma l\'ordine · ' + esc(st.orario === "Prima possibile" ? "prima possibile" : "alle " + st.orario) + '</button><p class="a-nota">Demo: nessun ordine parte e non si paga niente. Consegna gratis da 30 €.</p></div>';
  }
  function ordina(btn) {
    btn.disabled = true; btn.innerHTML = '<span class="a-gira" aria-hidden="true"></span> Invio in corso';
    setTimeout(function () {
      var c = conti();
      st.ordini.unshift({ n: 2231 + st.ordini.length, tot: c.tot, orario: st.orario, voci: cart.slice(), quando: Date.now(), data: "oggi" });
      st.ordini = st.ordini.slice(0, 6); cart = []; st.codice = ""; salva();
      NX.toast("Ordine ricevuto"); location.hash = "#/ordini";
    }, ridotto() ? 150 : 850);
  }

  /* ---------- ORDINI ---------- */
  var FASI = ["Confermato", "Lo chef prepara", "In consegna", "Consegnato"];
  function ordini() {
    var o = st.ordini[0] && st.ordini[0].quando ? st.ordini[0] : null, h = nav({ titolo: "Ordini" }) + titolo("I tuoi ordini") + '<div class="a-pad">';
    if (o) {
      h += '<section class="a-conf"><div class="a-conf-t"><div><small>Ordine N. ' + o.n + '</small><b id="a-fase">Confermato</b></div><span class="a-conf-ora">' + ic("orologio") + esc(o.orario === "Prima possibile" ? "tra circa 40 min" : "alle " + o.orario) + "</span></div>" +
        '<div class="a-prog" aria-hidden="true">' + FASI.map(function () { return "<i></i>"; }).join("") + '</div><ol class="a-prog-l">' + FASI.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ol>" +
        '<p class="a-conf-righe">' + esc(o.voci.map(function (v) { return v.q + "× " + v.n; }).join(", ")) + ' · <span class="nx-num">' + euro(o.tot) + "</span></p></section>" +
        '<p class="a-nota">Simulazione: le fasi avanzano da sole ogni pochi secondi.</p>';
    } else h += NX.stato.vuoto("Nessun ordine in corso", "Quando ordini lo segui da qui, e lo puoi ripetere con un tocco.", ["Guarda l'offerta", "home"]);
    var vecchi = st.ordini.slice(o ? 1 : 0, 4).concat([ESEMPIO]);
    h += '<section class="nx-gruppo a-sez"><h2 class="nx-gruppo-t">Ordini passati</h2><ul class="nx-lista">' + vecchi.map(function (x, i) {
      return '<li><div class="nx-cella"><span class="nx-c-tx"><b>N. ' + x.n + " · " + esc(x.data || "") + "</b><small>" + esc(x.voci.map(function (v) { return v.q + "× " + v.n; }).join(", ")) + '</small></span><span class="nx-c-dx nx-num">' + euro(x.tot) + '</span></div></li>';
    }).join("") + '</ul></section><button class="nx-btn pieno" type="button" data-a="ripeti">' + ic("ripeti") + " Ripeti l'ultimo ordine</button>" +
      '<p class="a-nota">Storico di esempio: resta solo in questo browser.</p></div>';
    return h;
  }
  function avviaFasi() {
    var o = st.ordini[0]; if (!o || !o.quando || !$("#a-fase")) return;
    function tick() {
      if (!$("#a-fase")) { clearInterval(timer); return; }
      var f = Math.min(3, Math.floor((Date.now() - o.quando) / 7000));
      $("#a-fase").textContent = FASI[f];
      $$(".a-prog i").forEach(function (x, i) { x.classList.toggle("on", i <= f); });
      $$(".a-prog-l li").forEach(function (x, i) { x.classList.toggle("on", i === f); });
      if (f === 3) clearInterval(timer);
    }
    tick(); timer = setInterval(tick, 1000);
  }

  /* ---------- barra carrello (Veloce), badge ---------- */
  function barraC() {
    var b = $("#a-barra-c"), n = nPezzi(), mostra = stile === "c" && n > 0 && ["home", "menu", "piatto"].indexOf(corrente) >= 0;
    b.hidden = !mostra; d.body.classList.toggle("a-con-barra", mostra);
    if (mostra) b.innerHTML = '<span class="a-barra-n nx-num">' + n + '</span><span class="a-barra-t">' + (n === 1 ? "1 piatto" : n + " piatti") + '</span><b class="nx-num">' + euro(conti().tot) + "</b>" + ic("freccia");
  }
  function badge() { var b = $("#a-badge"), n = nPezzi(); b.hidden = !n; b.textContent = n; $('#a-tab [data-t="carrello"]').setAttribute("aria-label", "Carrello, " + n + (n === 1 ? " piatto" : " piatti")); }

  /* ---------- router ---------- */
  var V = { home: home, menu: menu, piatto: piatto, carrello: carrello, ordini: ordini };
  var ORD = ["home", "menu", "piatto", "carrello", "ordini"];
  var TITOLI = { home: "Offerta di oggi", menu: "Menu", carrello: "Carrello", ordini: "I tuoi ordini" };
  var vista = $("#a-vista"), corrente = null;
  function route(anima) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), nome = V[p[0]] ? p[0] : "home";
    clearInterval(timer);
    var html = V[nome](p[1] ? decodeURIComponent(p[1]) : "");
    if (anima === false || !corrente || ridotto()) vista.innerHTML = html;
    else NX.vista(vista, html, ORD.indexOf(nome) >= ORD.indexOf(corrente) ? "dx" : "sx");
    var cambio = nome !== corrente; corrente = nome;
    var tab = nome === "piatto" ? "menu" : nome;
    $$("#a-tab a").forEach(function (a) { if (a.getAttribute("data-t") === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (nome === "piatto" ? (byId(p[1]) || MENU[0]).n : TITOLI[nome]) + " · Onda Sushi (app dimostrativa)";
    if (nome === "home") timer = setInterval(function () { $$(".a-cd").forEach(function (x) { x.textContent = contoAlla(); }); }, 1000);
    if (nome === "ordini") avviaFasi();
    if (nome === "piatto") { var f = $("form.a-pform", vista); if (f) aggiornaForm(f); }
    if (nome === "menu" && !menuPronto) setTimeout(function () { menuPronto = true; disegnaLista(); }, ridotto() ? 0 : 420);
    var s = $(".nx-seg.a-mancia", vista); if (s) NX.seg(s, function (v) { st.mancia = +v; salva(); route(false); });
    barraC();
    if (cambio && anima !== false) window.scrollTo(0, 0);
    nav$();
  }
  function nav$() { var n = $(".a-nav", vista); if (n) n.classList.toggle("nx-compatta", (window.scrollY || root.scrollTop) > 40); }
  window.addEventListener("scroll", nav$, { passive: true });

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a],[data-nx-azione],[data-agg],[data-cq],[data-cat],[data-ora],button[data-q]");
    if (!a) return;
    var az = a.getAttribute("data-a") || a.getAttribute("data-nx-azione");
    if (az === "opzioni") opzioni();
    else if (az === "home") location.hash = "#/home";
    else if (az === "svuota") { ricerca = ""; var c = $("#a-cerca"); if (c) c.value = ""; disegnaLista(); }
    else if (az === "ordina") ordina(a);
    else if (az === "ripeti") {
      var ult = st.ordini[0] && st.ordini[0].voci ? st.ordini[0] : ESEMPIO;
      ult.voci.forEach(function (v) { aggiungi({ m: byId(v.id), unit: v.unit, nota: v.nota }, v.q); });
      NX.toast("Ordine N. " + ult.n + " di nuovo nel carrello"); barraC();
    } else if (a.hasAttribute("data-agg")) { var m = byId(a.getAttribute("data-agg")); aggiungi({ m: m, unit: m.p, nota: "" }, 1); NX.toast(m.n + " nel carrello"); barraC(); }
    else if (a.hasAttribute("data-cat")) { cat = a.getAttribute("data-cat"); ricerca = ""; var ce = $("#a-cerca"); if (ce) ce.value = ""; try { history.replaceState(null, "", location.pathname + location.search + "#/menu/" + cat); } catch (x) {} disegnaLista(); }
    else if (a.hasAttribute("data-ora")) { st.orario = a.getAttribute("data-ora"); salva(); route(false); }
    else if (a.hasAttribute("data-cq")) {
      var i = +a.getAttribute("data-i"), r = cart[i]; if (!r) return;
      r.q += +a.getAttribute("data-cq"); if (r.q < 1) { cart.splice(i, 1); NX.toast(r.n + " tolto dal carrello"); }
      salva(); route(false);
    } else if (a.hasAttribute("data-q")) {
      var fm = a.closest("form.a-pform"); if (!fm) return;
      fm.setAttribute("data-n", Math.max(1, Math.min(9, +fm.getAttribute("data-n") + +a.getAttribute("data-q")))); aggiornaForm(fm);
    }
  });
  d.addEventListener("change", function (e) { var f = e.target.closest("form.a-pform"); if (f) aggiornaForm(f); });
  d.addEventListener("input", function (e) { if (e.target.id === "a-cerca") { ricerca = e.target.value; menuPronto = true; disegnaLista(); } });
  d.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.matches("form.a-pform")) {
      e.preventDefault();
      var s = scelte(f), qn = +f.getAttribute("data-n");
      aggiungi(s, qn); NX.toast((qn > 1 ? qn + " × " : "") + s.m.n + " nel carrello");
      location.hash = "#/menu/" + s.m.c;
    } else if (f.id === "a-f-codice") {
      e.preventDefault();
      var v = $("#a-codice").value.trim().toUpperCase(), m = $("#a-codice-msg");
      if (CODICI[v]) { st.codice = v; salva(); route(false); if (conti().sc) NX.toast("5 € di sconto applicati"); }
      else { m.className = "a-msg no"; m.textContent = v ? "Il codice " + v + " non vale. Prova ONDA5." : "Scrivi un codice."; $("#a-codice").focus(); }
    }
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); route(true); });

  badge(); route(false);
})();
