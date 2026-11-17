/* Spiedo Nero · app dimostrativa sul kit Noxford.
   Nessun dato viene inviato: carrello, ordini e punti restano nel browser. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace(".", ",") + " €"; };
  var ridotto = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("spiedonero-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("spiedonero-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- icone (tratto, 24x24) ---------- */
  var I = {
    kebab: '<path d="M12 2.5v19"/><path d="M7.5 6.5h9l-1.4 3.2H8.9zM6.5 12h11l-1.6 4H8.1z"/>',
    box: '<path d="M3.5 8.5h17l-1.8 11H5.3z"/><path d="M3.5 8.5l3-4h11l3 4"/>',
    veg: '<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
    contorni: '<path d="M6 10h12l-1.5 10h-9z"/><path d="M8 10 7 3.5M11 10V3M14 10l1-6.5M17 10l1.8-5.5"/>',
    bevande: '<path d="M7 4h10l-1.5 17h-7z"/><path d="M7.5 9h9"/>',
    dolci: '<path d="M4 14h16l-2 6H6z"/><path d="M6 14c0-4 3-7 6-7s6 3 6 7M12 7V4"/>',
    opzioni: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    indietro: '<path d="M15 5l-7 7 7 7"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    meno: '<path d="M5 12h14"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    ripeti: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    stella: '<path d="M12 3.5l2.5 5.2 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8z"/>',
    cestino: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    fiamma: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.6-8.3.4 2 1.6 3 2.6 3.4.2-2.6 1.4-5 3.4-6.4-.2 2.6 1 4.4 2.3 6 1 1.3 1.6 2.6 1.6 4.4 0 4-2.9 7.1-7 7.1z"/>'
  };
  function ic(k, c) { return '<svg class="a-i' + (c ? " " + c : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (I[k] || "") + "</svg>"; }

  /* ---------- dati del locale (inventati) ---------- */
  var CATS = [["kebab", "Kebab"], ["box", "Box e piatti"], ["veg", "Vegetariano"], ["contorni", "Contorni"], ["bevande", "Bevande"], ["dolci", "Dolci"]];
  var MENU = [
    { id: "classico", c: "kebab", n: "Kebab classico", d: "Piadina calda, carne dallo spiedo, insalata, pomodoro, cipolla e salsa a scelta.", p: 6.5, opt: 1, img: "img/spiedo.webp", pop: 1 },
    { id: "durum", c: "kebab", n: "Dürüm", d: "Arrotolato nella piadina sottile e ripassato sulla piastra.", p: 7.5, opt: 1, img: "img/wrap.webp", pop: 1 },
    { id: "pollo", c: "kebab", n: "Kebab di pollo", d: "Pollo marinato al limone e paprica dolce.", p: 6.5, opt: 1 },
    { id: "piccante", c: "kebab", n: "Kebab del diavolo", d: "Carne mista, jalapeños, cipolla rossa e salsa piccante della casa.", p: 7.5, opt: 1, hot: 1 },
    { id: "box", c: "box", n: "Box kebab", d: "Carne, patatine speziate, insalata, cavolo rosso e due salse.", p: 9.5, opt: 1, img: "img/box.webp", pop: 1 },
    { id: "menubox", c: "box", n: "Menu Box", d: "Box kebab, patatine e una bibita in lattina.", p: 11, opt: 1, img: "img/box.webp" },
    { id: "piatto", c: "box", n: "Piatto misto", d: "Carne, riso al burro, hummus, insalata e pane caldo.", p: 11 },
    { id: "falafel", c: "veg", n: "Wrap falafel", d: "Falafel di ceci, hummus, verdure e tahina.", p: 6, opt: 1, veg: 1, pop: 1 },
    { id: "hummus", c: "veg", n: "Hummus e pane", d: "Crema di ceci con olio, paprica e pane caldo.", p: 4.5, veg: 1 },
    { id: "patatine", c: "contorni", n: "Patatine", d: "Fritte al momento.", p: 3 },
    { id: "patspez", c: "contorni", n: "Patatine speziate", d: "Con paprica affumicata e origano.", p: 3.5, pop: 1 },
    { id: "insalata", c: "contorni", n: "Insalata di stagione", d: "Lattuga, pomodoro, cetriolo e limone.", p: 4, veg: 1 },
    { id: "ayran", c: "bevande", n: "Ayran", d: "Bevanda allo yogurt, fresca e salata.", p: 2 },
    { id: "bibita", c: "bevande", n: "Bibita in lattina", d: "Cola, aranciata o limonata.", p: 2.5 },
    { id: "acqua", c: "bevande", n: "Acqua 50 cl", d: "Naturale o frizzante.", p: 1 },
    { id: "baklava", c: "dolci", n: "Baklava", d: "Tre pezzi di sfoglia con pistacchi e miele.", p: 3.5 }
  ];
  var OPZ = {
    carne: [["Vitello", 0], ["Pollo", 0], ["Misto", 0]],
    taglia: [["Normale", 0], ["Maxi", 2]],
    togli: ["Insalata", "Pomodoro", "Cipolla", "Cavolo rosso"],
    salse: ["Yogurt e aglio", "Piccante", "Tahina", "Barbecue"],
    extra: [["Formaggio fuso", 1], ["Doppia carne", 2.5], ["Jalapeños", 0.8], ["Patatine dentro", 1]]
  };
  var CODICI = { NERO10: 0.1 };
  var INDIRIZZI = [{ id: "casa", n: "Casa", v: "Via dei Mille 12", x: "2° piano, citofono Ferri" }, { id: "ufficio", n: "Ufficio", v: "Corso Italia 48", x: "Scala B" }];
  var ESEMPIO = { n: 1031, tot: 15.5, quando: "sabato", voci: [{ id: "durum", n: "Dürüm", unit: 7.5, nota: "Vitello, salse: yogurt e aglio", q: 1 }, { id: "patspez", n: "Patatine speziate", unit: 3.5, nota: "", q: 1 }, { id: "ayran", n: "Ayran", unit: 2, nota: "", q: 1 }] };
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var nomeCat = function (c) { return CATS.filter(function (x) { return x[0] === c; })[0][1]; };
  function thumb(m, cls) {
    return m.img ? '<img class="a-th ' + (cls || "") + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">'
      : '<span class="a-th ic ' + (cls || "") + '" aria-hidden="true">' + ic(m.c) + "</span>";
  }

  /* ---------- stato ---------- */
  var cart = mem.get("carrello", []);
  var stato = mem.get("stato", null) || {};
  ["modo", "codice", "punti", "ordini", "attivo", "ind"].forEach(function (k) {
    if (stato[k] === undefined) stato[k] = { modo: "consegna", codice: "", punti: 6, ordini: [], attivo: null, ind: "casa" }[k];
  });
  var menuCat = "kebab", ricerca = "", menuPronto = false, timer = null;
  function salva() { mem.set("carrello", cart); mem.set("stato", stato); badge(); }
  function nPezzi() { return cart.reduce(function (a, r) { return a + r.q; }, 0); }
  function indirizzo() { return INDIRIZZI.filter(function (x) { return x.id === stato.ind; })[0] || INDIRIZZI[0]; }
  function aperto() { var h = new Date().getHours(); return h >= 18 || h < 2; }
  function pillAperto() { return aperto() ? '<span class="nx-pill ok">Aperto fino alle 2</span>' : '<span class="nx-pill wait">Apre alle 18</span>'; }

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
  function marchio() {
    return '<a class="a-marchio" href="#/home" aria-label="Spiedo Nero, home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#141110"/><path d="M16 5v22" stroke="#FFC23D" stroke-width="2.4" stroke-linecap="round"/><path d="M10 10h12l-2 4h-8zM9 16h14l-2 5H11z" fill="#E2581C"/></svg></a>';
  }
  function indietro(t, h) { return '<a class="nx-btn t a-indietro" href="' + h + '">' + ic("indietro") + "<span>" + esc(t) + "</span></a>"; }
  function nav(o) {
    return '<header class="nx-navbar a-nav' + (o.fissa ? " a-nav-fissa" : "") + '"><div class="nx-nb-riga"><div class="a-nb-sx">' + (o.sx || marchio()) + '</div><span class="nx-nb-pic">' + esc(o.titolo) +
      '</span><div class="a-nb-dx">' + (o.dx || "") + '<button class="nx-btn ico t" type="button" data-a="opzioni" aria-label="Stile, tema e vetro">' + ic("opzioni") + "</button></div></div></header>";
  }
  function titolo(t, sotto) { return '<div class="a-pad a-testa"><h1 class="nx-tit-grande a-tit">' + esc(t) + "</h1>" + (sotto ? '<p class="a-sotto">' + sotto + "</p>" : "") + "</div>"; }
  function passo(attr, i, n, nome) {
    return '<span class="a-passo"><button type="button" ' + attr + '="-1"' + (i != null ? ' data-i="' + i + '"' : "") + ' aria-label="Uno in meno' + (nome ? ": " + esc(nome) : "") + '">' + ic("meno") + '</button><output class="nx-num">' + n +
      '</output><button type="button" ' + attr + '="1"' + (i != null ? ' data-i="' + i + '"' : "") + ' aria-label="Uno in più' + (nome ? ": " + esc(nome) : "") + '">' + ic("piu") + "</button></span>";
  }
  function tag(m) { return (m.veg ? ' <span class="nx-pill ok a-tag">Veg</span>' : "") + (m.hot ? ' <span class="nx-pill no a-tag">Piccante</span>' : ""); }

  /* ---------- HOME ---------- */
  function home() {
    var pop = MENU.filter(function (m) { return m.pop; });
    if (stile === "b") {
      return nav({ titolo: "Spiedo Nero", fissa: 1 }) +
        '<div class="a-ed-hero"><img src="img/spiedo.webp" width="896" height="1200" alt="Lo spiedo verticale che gira davanti alla piastra, con il coltello che taglia la carne" fetchpriority="high"></div>' +
        '<div class="a-pad a-ed-apre"><p class="a-occhiello">' + (aperto() ? "Aperto fino alle 2 di notte" : "Apriamo alle 18") + " · consegna in circa 30 minuti</p>" +
        '<h1 class="a-display">Lo spiedo gira fino alle due di notte.</h1>' +
        '<p class="a-lead">La carne la mariniamo dalla sera prima con yogurt, paprica e cumino. La piadina va sulla piastra quando ordini.</p>' +
        '<a class="nx-btn p a-cta" href="#/menu">Ordina adesso</a></div>' +
        '<section class="a-pad a-sez"><h2 class="a-sez-t a-display-s">Da provare</h2>' +
        ["durum", "menubox"].map(function (id) {
          var m = byId(id);
          return '<a class="a-card-ed" href="#/prodotto/' + m.id + '" data-nx-premi><img src="' + m.img + '" alt="" loading="lazy" width="1200" height="896"><span class="a-card-ed-tx"><b>' + esc(m.n) + "</b><span>" + esc(m.d) + '</span><em class="nx-num">' + euro(m.p) + "</em></span></a>";
        }).join("") + "</section>" +
        '<section class="a-pad a-sez"><h2 class="a-sez-t a-display-s">Il menu</h2><ul class="a-indice">' +
        CATS.map(function (c) { return '<li><a href="#/menu/' + c[0] + '"><span>' + c[1] + '</span><small>' + MENU.filter(function (m) { return m.c === c[0]; }).length + " piatti</small>" + ic("freccia") + "</a></li>"; }).join("") + "</ul></section>";
    }
    if (stile === "c") {
      var ult = stato.ordini[0] && stato.ordini[0].voci ? stato.ordini[0] : ESEMPIO;
      return nav({ titolo: "Spiedo Nero" }) + titolo("Spiedo Nero") +
        '<div class="a-pad"><div class="a-righello">' + pillAperto() + '<span class="nx-pill a-pill-i">' + ic("orologio") + "circa 30 min</span>" +
        '<button class="nx-pill acc a-pill-btn a-pill-i" type="button" data-a="indirizzo">' + ic("pin") + esc(indirizzo().v) + "</button></div>" +
        '<section class="a-sez"><div class="a-ripeti"><div><small>Ordina di nuovo · #' + ult.n + "</small><b>" + esc(ult.voci.map(function (v) { return v.q + "× " + v.n; }).join(", ")) + '</b></div><button class="nx-btn p" type="button" data-a="ripeti">' + ic("ripeti") + " " + euro(ult.tot) + "</button></div></section>" +
        '<section class="a-sez"><h2 class="a-sez-t">I più ordinati</h2><div class="a-griglia">' + pop.slice(0, 4).map(tessera).join("") + "</div></section>" +
        '<section class="a-sez"><h2 class="a-sez-t">Categorie</h2><div class="a-cat-c">' +
        CATS.map(function (c) { return '<a href="#/menu/' + c[0] + '" data-nx-premi>' + ic(c[0]) + "<span>" + c[1] + "</span></a>"; }).join("") + "</div></section></div>";
    }
    return nav({ titolo: "Spiedo Nero" }) + titolo("Spiedo Nero", pillAperto() + " <span>Consegna a " + esc(indirizzo().v) + "</span>") +
      '<div class="a-pad">' +
      '<a class="a-hero" href="#/menu" data-nx-premi><img src="img/wrap.webp" width="1200" height="896" alt="Un dürüm tagliato a metà con carne alla piastra, insalata, pomodoro e salsa yogurt" fetchpriority="high"><span class="a-hero-tx"><b>Il kebab come lo vuoi tu</b><span>A casa in circa 30 minuti</span></span></a>' +
      '<section class="a-sez"><ul class="nx-lista"><li><a class="nx-cella ic" href="#/prodotto/menubox"><span class="nx-c-ic">' + ic("box") + '</span><span class="nx-c-tx"><b>Menu Box a 11 €</b><small>Box kebab, patatine e bibita in lattina</small></span><i class="nx-chev"></i></a></li></ul></section>' +
      '<section class="a-sez"><h2 class="nx-gruppo-t">Cosa ti va?</h2><ul class="nx-lista">' +
      CATS.map(function (c) { return '<li><a class="nx-cella ic" href="#/menu/' + c[0] + '"><span class="nx-c-ic">' + ic(c[0]) + '</span><span class="nx-c-tx"><b>' + c[1] + '</b></span><span class="nx-c-dx">' + MENU.filter(function (m) { return m.c === c[0]; }).length + '</span><i class="nx-chev"></i></a></li>'; }).join("") + "</ul></section>" +
      '<section class="a-sez"><h2 class="nx-gruppo-t">I più ordinati</h2><ul class="nx-lista">' + pop.map(cella).join("") + "</ul></section>" +
      '<section class="a-sez a-storia"><img src="img/spiedo.webp" width="896" height="1200" alt="Lo spiedo verticale davanti alla piastra" loading="lazy"><div><h2>Lo spiedo lo montiamo noi, ogni mattina</h2><p>Carne marinata dalla sera prima con yogurt, paprica e cumino. La piadina la cuociamo al momento sulla piastra.</p></div></section></div>';
  }
  function cella(m) {
    return '<li><a class="nx-cella a-voce" href="#/prodotto/' + m.id + '">' + thumb(m) + '<span class="nx-c-tx"><b>' + esc(m.n) + tag(m) + "</b><small>" + esc(m.d) + '</small></span><span class="nx-c-dx a-prezzo nx-num">' + euro(m.p) + "</span></a></li>";
  }
  function tessera(m) {
    return '<div class="a-tile"><a class="a-tile-l" href="#/prodotto/' + m.id + '" data-nx-premi>' + thumb(m, "q") + "<b>" + esc(m.n) + '</b><span class="nx-num">' + euro(m.p) + "</span></a>" +
      '<button class="nx-btn ico p a-tile-piu" type="button" data-agg="' + m.id + '" aria-label="Aggiungi ' + esc(m.n) + '">' + ic("piu") + "</button></div>";
  }

  /* ---------- MENU ---------- */
  function menu(c) {
    if (CATS.some(function (x) { return x[0] === c; })) menuCat = c;
    return nav({ titolo: "Menu" }) + titolo("Menu") +
      '<div class="a-filtri"><label class="nx-cerca"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg><span class="nx-sr">Cerca nel menu</span><input id="a-cerca" type="search" placeholder="Cerca: pollo, falafel, piccante" autocomplete="off" value="' + esc(ricerca) + '"></label>' +
      '<div class="nx-chips" role="group" aria-label="Categorie">' + CATS.map(function (x) { return '<button class="nx-chip" type="button" data-cat="' + x[0] + '" aria-pressed="' + (!ricerca && x[0] === menuCat) + '">' + x[1] + "</button>"; }).join("") + "</div></div>" +
      '<div class="a-pad" id="a-lista" aria-live="polite">' + (menuPronto ? listaHtml() : NX.stato.caricamento(5)) + "</div>";
  }
  function listaHtml() {
    var qq = ricerca.trim().toLowerCase();
    var voci = MENU.filter(function (m) { return qq ? (m.n + " " + m.d + (m.veg ? " veg vegetariano" : "") + (m.hot ? " piccante" : "")).toLowerCase().indexOf(qq) > -1 : m.c === menuCat; });
    if (!voci.length) return NX.stato.vuoto("Niente con questo nome", "Prova con un'altra parola, per esempio pollo o falafel.", ["Mostra tutto il menu", "svuota"]);
    var testa = '<h2 class="nx-gruppo-t a-lista-t">' + (qq ? voci.length + (voci.length === 1 ? " risultato" : " risultati") : esc(nomeCat(menuCat))) + "</h2>";
    if (stile === "c") return testa + '<div class="a-griglia">' + voci.map(tessera).join("") + "</div>";
    if (stile === "b") return testa + voci.map(function (m) {
      return '<a class="a-card-b' + (m.img ? " foto" : "") + '" href="#/prodotto/' + m.id + '" data-nx-premi>' + (m.img ? '<img src="' + m.img + '" alt="" loading="lazy" width="1200" height="896">' : '<span class="a-th ic" aria-hidden="true">' + ic(m.c) + "</span>") +
        '<span class="a-card-b-tx"><b>' + esc(m.n) + tag(m) + "</b><span>" + esc(m.d) + '</span><em class="nx-num">' + euro(m.p) + "</em></span></a>";
    }).join("");
    return testa + '<ul class="nx-lista">' + voci.map(cella).join("") + "</ul>";
  }
  function disegnaLista() {
    var box = $("#a-lista"); if (!box) return;
    box.innerHTML = listaHtml();
    $$(".a-filtri .nx-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(!ricerca.trim() && b.getAttribute("data-cat") === menuCat)); });
  }

  /* ---------- PRODOTTO ---------- */
  function formHtml(m) {
    var h = "";
    function gruppo(t, nota, righe) { return '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t">' + t + "</legend>" + (nota ? '<p class="a-nota-g" id="a-n-' + t.replace(/\W/g, "") + '">' + nota + "</p>" : "") + '<ul class="nx-lista">' + righe.join("") + "</ul></fieldset>"; }
    function riga(tipo, nome, val, prezzo, on) {
      return '<li><label class="nx-cella a-opz"><input type="' + tipo + '" name="' + nome + '" value="' + esc(val) + '" data-p="' + (prezzo || 0) + '"' + (on ? " checked" : "") + '><span class="nx-c-tx"><b>' + esc(tipo === "checkbox" && nome === "togli" ? "Senza " + val.toLowerCase() : val) + "</b></span>" +
        (prezzo ? '<span class="nx-c-dx nx-num">+' + euro(prezzo) + "</span>" : "") + '<i class="a-segno" aria-hidden="true"></i></label></li>';
    }
    if (m.opt && m.c !== "veg") h += gruppo("Carne", "", OPZ.carne.map(function (o, i) { return riga("radio", "carne", o[0], o[1], i === (m.id === "pollo" ? 1 : 0)); }));
    if (m.opt) {
      h += gruppo("Taglia", "", OPZ.taglia.map(function (o, i) { return riga("radio", "taglia", o[0], o[1], !i); }));
      h += gruppo("Salse", "Fino a 2, comprese nel prezzo.", OPZ.salse.map(function (o, i) { return riga("checkbox", "salse", o, 0, !i); }));
      h += gruppo("Togli qualcosa", "", OPZ.togli.map(function (o) { return riga("checkbox", "togli", o, 0, false); }));
      h += gruppo("Extra", "", OPZ.extra.map(function (o) { return riga("checkbox", "extra", o[0], o[1], false); }));
    }
    return '<form class="a-pform" data-id="' + m.id + '" data-n="1" novalidate>' + h +
      '<div class="a-aggiungi nx-vetro">' + passo("data-q", null, 1) + '<button class="nx-btn p" type="submit">Aggiungi · <span class="a-tot nx-num">' + euro(m.p) + "</span></button></div></form>";
  }
  function prodotto(id) {
    var m = byId(id) || MENU[0];
    var media = m.img ? '<img src="' + m.img + '" alt="' + esc(m.n) + '" width="1200" height="896">' : '<span class="a-media-ic" aria-hidden="true">' + ic(m.c) + "</span>";
    return nav({ titolo: m.n, sx: indietro(nomeCat(m.c), "#/menu/" + m.c) }) +
      '<div class="a-prod"><div class="a-prod-media' + (m.img ? "" : " senza") + '">' + media + "</div>" +
      '<div class="a-pad"><h1 class="nx-tit-grande a-tit">' + esc(m.n) + "</h1><p class=\"a-desc\">" + esc(m.d) + "</p>" +
      '<p class="a-prod-meta">' + tag(m) + ' <span class="nx-num">' + euro(m.p) + "</span></p>" + formHtml(m) + "</div></div>";
  }
  function scelte(f) {
    var m = byId(f.getAttribute("data-id")), extra = 0, nota = [];
    $$("input:checked", f).forEach(function (i) { extra += +(i.getAttribute("data-p") || 0); });
    var c = $("input[name=carne]:checked", f); if (c) nota.push(c.value);
    var t = $("input[name=taglia]:checked", f); if (t && t.value !== "Normale") nota.push(t.value);
    var s = $$("input[name=salse]:checked", f).map(function (i) { return i.value.toLowerCase(); }); if (s.length) nota.push("salse: " + s.join(" e "));
    $$("input[name=togli]:checked", f).forEach(function (i) { nota.push("senza " + i.value.toLowerCase()); });
    $$("input[name=extra]:checked", f).forEach(function (i) { nota.push("+ " + i.value.toLowerCase()); });
    return { m: m, unit: m.p + extra, nota: nota.join(", ") };
  }
  function aggiornaForm(f) {
    var s = scelte(f), qn = +f.getAttribute("data-n");
    $(".a-tot", f).textContent = euro(s.unit * qn);
    $(".a-passo output", f).textContent = qn;
    var salse = $$("input[name=salse]", f), prese = salse.filter(function (i) { return i.checked; }).length;
    salse.forEach(function (i) { i.disabled = !i.checked && prese >= 2; });
  }
  function aggiungi(s, qn) {
    var ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
    if (ex) ex.q += qn; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: qn });
    salva(); scatta();
  }
  function scatta() {
    var b = $("#a-badge"); b.classList.remove("a-pop"); void b.offsetWidth; b.classList.add("a-pop");
  }
  function aggiungiVeloce(id) {
    var m = byId(id);
    if (!m.opt) { aggiungi({ m: m, unit: m.p, nota: "" }, 1); NX.toast(m.n + " nel carrello"); barraC(); return; }
    var f = NX.foglio.apri({ titolo: m.n, html: '<p class="a-desc">' + esc(m.d) + "</p>" + formHtml(m), classe: "a-foglio-prod" });
    aggiornaForm($("form", f));
  }

  /* ---------- CARRELLO ---------- */
  function conti() {
    var sub = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0);
    var sconto = stato.codice && CODICI[stato.codice] ? Math.round(sub * CODICI[stato.codice] * 100) / 100 : 0;
    var cons = stato.modo === "consegna" && sub > 0 && sub - sconto < 20 ? 2 : 0;
    return { sub: sub, sconto: sconto, cons: cons, tot: sub - sconto + cons };
  }
  function carrello() {
    var h = nav({ titolo: "Carrello" }) + titolo("Il tuo ordine");
    if (!cart.length) return h + '<div class="a-pad">' + NX.stato.vuoto("Il carrello è vuoto", "Un dürüm caldo è a due tocchi.", ["Vai al menu", "menu"]) + "</div>";
    var c = conti(), ind = indirizzo();
    return h + '<div class="a-pad">' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">' + nPezzi() + (nPezzi() === 1 ? " prodotto" : " prodotti") + '</h2><ul class="nx-lista a-righe">' + cart.map(function (r, i) {
        return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(r.n) + "</b><small>" + (esc(r.nota) || "Come da menu") + '</small></span><span class="a-riga-dx"><b class="nx-num">' + euro(r.unit * r.q) + "</b>" + passo("data-cq", i, r.q, r.n) + "</span></div></li>";
      }).join("") + "</ul></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Come lo vuoi</h2><div class="nx-seg pieno a-modo" role="group" aria-label="Come lo vuoi"><button type="button" data-v="consegna" aria-pressed="' + (stato.modo === "consegna") + '">Consegna</button><button type="button" data-v="ritiro" aria-pressed="' + (stato.modo === "ritiro") + '">Ritiro al locale</button></div>' +
      (stato.modo === "consegna" ? '<ul class="nx-lista a-spazio"><li><button class="nx-cella ic" type="button" data-a="indirizzo"><span class="nx-c-ic">' + ic("pin") + '</span><span class="nx-c-tx"><b>' + esc(ind.n) + " · " + esc(ind.v) + "</b><small>" + esc(ind.x) + '</small></span><span class="nx-c-dx">Cambia</span><i class="nx-chev"></i></button></li></ul><p class="a-nota">Consegna gratis sopra i 20 €, altrimenti 2 €.</p>' : '<p class="a-nota">Pronto in circa 15 minuti al banco, in via Garibaldi 3.</p>') + "</section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Codice sconto</h2><form class="a-codice" id="a-f-codice" novalidate><label class="nx-sr" for="a-codice">Codice sconto</label><input id="a-codice" placeholder="Codice sconto" value="' + esc(stato.codice) + '" autocomplete="off" autocapitalize="characters"><button class="nx-btn" type="submit">Applica</button></form>' +
      '<p class="a-msg' + (c.sconto ? " ok" : "") + '" id="a-codice-msg" role="status">' + (c.sconto ? "Codice " + esc(stato.codice) + " applicato: 10% in meno." : "Codice di prova: NERO10") + "</p></section>" +
      '<section class="a-conti nx-num"><p><span>Prodotti</span><span>' + euro(c.sub) + "</span></p>" + (c.sconto ? '<p class="ok"><span>Sconto</span><span>−' + euro(c.sconto) + "</span></p>" : "") + (stato.modo === "consegna" ? "<p><span>Consegna</span><span>" + (c.cons ? euro(c.cons) : "Gratis") + "</span></p>" : "") + '<p class="g"><span>Totale</span><span>' + euro(c.tot) + "</span></p></section>" +
      '<button class="nx-btn p pieno a-invia" type="button" data-a="invia">Invia l\'ordine</button><p class="a-nota">È una demo: l\'ordine non parte davvero e non si paga niente.</p></div>';
  }
  function invia(btn) {
    btn.disabled = true; btn.innerHTML = '<span class="a-gira" aria-hidden="true"></span> Invio in corso';
    setTimeout(function () {
      var c = conti(), timbri = Math.max(1, Math.floor(c.tot / 10));
      var ord = { n: 1048 + stato.ordini.length, quando: Date.now(), tot: c.tot, voci: cart.slice(), modo: stato.modo, timbri: timbri, ind: indirizzo().v };
      stato.ordini.unshift(ord); stato.ordini = stato.ordini.slice(0, 8); stato.attivo = ord; stato.punti = Math.min(10, stato.punti + timbri);
      cart = []; stato.codice = ""; salva();
      NX.toast("Ordine inviato");
      location.hash = "#/ordine";
    }, ridotto() ? 150 : 850);
  }

  /* ---------- ORDINE (rider) ---------- */
  var FASI = [["Ordine ricevuto", "Il locale ha confermato."], ["In preparazione", "Lo spiedo gira, la piadina è sulla piastra."], ["In consegna", "Il rider è partito."], ["Consegnato", "Buon appetito."]];
  function ordine() {
    var o = stato.attivo, h = nav({ titolo: "Rider" }) + titolo("Segui l'ordine");
    if (!o) return h + '<div class="a-pad">' + NX.stato.vuoto("Nessun ordine in corso", "Quando ordini, qui vedi il rider che arriva.", ["Ordina qualcosa", "menu"]) + "</div>";
    var rit = o.modo === "ritiro";
    return h + '<div class="a-pad">' +
      '<div class="a-eta"><div><span>' + (rit ? "Pronto tra" : "Arriva tra") + '</span><b class="nx-num"><span id="a-eta-min">--</span> min</b></div><p>Ordine #' + o.n + "<br><span class=\"nx-num\">" + euro(o.tot) + "</span></p></div>" +
      (rit ? "" : '<div class="a-mappa"><svg viewBox="0 0 400 220" role="img" aria-label="Mappa: il rider va dal locale verso ' + esc(o.ind || "casa tua") + '"><rect class="m-f" width="400" height="220"/><g class="m-s"><path d="M0 60h400M0 160h400M90 0v220M230 0v220M330 0v220"/></g><g class="m-l"><path d="M0 60h400M0 160h400M90 0v220M230 0v220M330 0v220"/></g>' +
        '<path id="a-rotta" class="m-r" d="M60 60H230V160H330"/><g transform="translate(60 60)"><circle r="13" class="m-loc"/><path d="M0-6v12M-4-3h8M-4.5 1h9" class="m-loc-i"/></g><g transform="translate(330 160)"><circle r="13" class="m-casa"/><path d="M-6 2 0-5 6 2v5h-12z" class="m-casa-i"/></g><circle id="a-moto" r="9" cx="60" cy="60" class="m-moto"/></svg></div>') +
      '<ol class="a-fasi" id="a-fasi">' + FASI.map(function (f, i) {
        return '<li><i aria-hidden="true"></i><div><b>' + (rit && i === 2 ? "Pronto al banco" : f[0]) + "</b><small>" + (rit && i === 2 ? "Ti aspettiamo al locale." : rit && i === 3 ? "Ritirato. Buon appetito." : f[1]) + "</small></div></li>";
      }).join("") + "</ol>" +
      (rit ? "" : '<ul class="nx-lista a-spazio"><li><div class="nx-cella"><span class="nx-av" aria-hidden="true">MB</span><span class="nx-c-tx"><b>Marco, il tuo rider</b><small>Scooter elettrico · nome di esempio</small></span></div></li></ul>') +
      '<p class="a-nota">Simulazione: le fasi avanzano da sole per mostrare come lo vede il cliente. Con questo ordine hai preso ' + o.timbri + (o.timbri === 1 ? " timbro" : " timbri") + " sulla tessera.</p></div>";
  }
  function avviaTracking() {
    var o = stato.attivo; if (!o) return;
    var tot = 32, start = o.quando, rotta = $("#a-rotta");
    function tick() {
      if (!$("#a-fasi")) { clearInterval(timer); return; }
      var sec = (Date.now() - start) / 1000, fase = Math.min(3, Math.floor(sec / 6));
      $$("#a-fasi li").forEach(function (li, i) { li.classList.toggle("fatto", i < fase || fase === 3); li.classList.toggle("ora", i === fase && fase < 3); });
      var min = fase === 3 ? 0 : Math.max(1, Math.round(tot - sec * 1.3));
      $("#a-eta-min").textContent = min;
      if (rotta) {
        var k = fase < 2 ? 0 : fase === 3 ? 1 : Math.min(1, (sec - 12) / 6);
        var pt = rotta.getPointAtLength(rotta.getTotalLength() * k), moto = $("#a-moto");
        if (moto) { moto.setAttribute("cx", pt.x); moto.setAttribute("cy", pt.y); }
      }
      if (fase === 3) clearInterval(timer);
    }
    tick(); timer = setInterval(tick, 500);
  }

  /* ---------- PROFILO ---------- */
  function profilo() {
    var p = stato.punti, t = "";
    for (var i = 1; i <= 10; i++) t += '<i class="' + (i <= p ? "on" : "") + '" aria-hidden="true">' + (i === 10 ? ic("stella") : i) + "</i>";
    var ord = stato.ordini.slice(0, 4).map(function (o) { return [o.n, o.tot, o.voci ? o.voci.map(function (v) { return v.q + "× " + v.n; }).join(", ") : o.righe]; });
    if (!ord.length) ord = [[1031, 15.5, "1× Dürüm, 1× Patatine speziate, 1× Ayran"], [1019, 19, "2× Kebab classico, 2× Bibita in lattina"]];
    return nav({ titolo: "Profilo" }) + titolo("Ciao, Giulia") + '<div class="a-pad">' +
      '<section class="a-tessera"><div class="a-tessera-t"><b>Tessera Spiedo</b><span class="nx-num">' + p + "/10</span></div><p>" + (p >= 10 ? "Tessera piena: il prossimo kebab lo offriamo noi." : "Un timbro ogni 10 € di spesa. Ti mancano " + (10 - p) + (10 - p === 1 ? " timbro" : " timbri") + " per un kebab offerto.") + '</p><div class="a-timbri" role="img" aria-label="' + p + ' timbri su 10">' + t + "</div></section>" +
      '<section class="nx-gruppo a-spazio"><h2 class="nx-gruppo-t">I tuoi ordini</h2><ul class="nx-lista">' + ord.map(function (o) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>Ordine #' + o[0] + '</b><small>' + esc(o[2]) + '</small></span><span class="nx-c-dx nx-num">' + euro(o[1]) + "</span></div></li>"; }).join("") + "</ul></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Indirizzi salvati</h2><ul class="nx-lista">' + INDIRIZZI.map(function (x) { return '<li><button class="nx-cella ic" type="button" data-ind="' + x.id + '"><span class="nx-c-ic">' + ic("pin") + '</span><span class="nx-c-tx"><b>' + x.n + "</b><small>" + esc(x.v + ", " + x.x) + "</small></span>" + (x.id === stato.ind ? '<span class="nx-pill acc">In uso</span>' : "") + "</button></li>"; }).join("") + "</ul></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">App</h2><ul class="nx-lista"><li><button class="nx-cella ic" type="button" data-a="opzioni"><span class="nx-c-ic">' + ic("opzioni") + '</span><span class="nx-c-tx"><b>Stile, tema e vetro</b></span><i class="nx-chev"></i></button></li>' +
      '<li><button class="nx-cella ic" type="button" data-a="azzera"><span class="nx-c-ic a-rosso">' + ic("cestino") + '</span><span class="nx-c-tx"><b>Azzera i dati della demo</b><small>Carrello, ordini e timbri</small></span></button></li></ul></section>' +
      '<p class="a-nota">Profilo di esempio: nome, indirizzi e ordini sono inventati e restano solo in questo browser.</p></div>';
  }
  function scegliIndirizzo() {
    var f = NX.foglio.apri({ titolo: "Consegna a", html: '<ul class="nx-lista">' + INDIRIZZI.map(function (x) { return '<li><label class="nx-cella a-opz"><input type="radio" name="a-ind" value="' + x.id + '"' + (x.id === stato.ind ? " checked" : "") + '><span class="nx-c-tx"><b>' + x.n + " · " + esc(x.v) + "</b><small>" + esc(x.x) + '</small></span><i class="a-segno" aria-hidden="true"></i></label></li>'; }).join("") + '</ul><p class="a-nota">Indirizzi di esempio.</p>' });
    f.addEventListener("change", function (e) { if (e.target.name === "a-ind") { stato.ind = e.target.value; salva(); NX.foglio.chiudi(f); NX.toast("Consegna a " + indirizzo().v); route(false); } });
  }

  /* ---------- barra del carrello (stile Veloce) ---------- */
  function barraC() {
    var b = $("#a-barra-c"), n = nPezzi(), mostra = stile === "c" && n > 0 && ["home", "menu", "prodotto"].indexOf(corrente) >= 0;
    b.hidden = !mostra; d.body.classList.toggle("a-con-barra", mostra);
    if (mostra) b.innerHTML = '<span class="a-barra-n nx-num">' + n + '</span><span class="a-barra-t">' + (n === 1 ? "1 prodotto" : n + " prodotti") + '</span><b class="nx-num">' + euro(conti().tot) + "</b>" + ic("freccia");
  }
  function badge() { var b = $("#a-badge"), n = nPezzi(); b.hidden = !n; b.textContent = n; $('#a-tab [data-t="carrello"]').setAttribute("aria-label", "Carrello, " + n + (n === 1 ? " prodotto" : " prodotti")); }

  /* ---------- router ---------- */
  var V = { home: home, menu: menu, prodotto: prodotto, carrello: carrello, ordine: ordine, profilo: profilo };
  var ORD = ["home", "menu", "prodotto", "carrello", "ordine", "profilo"];
  var TITOLI = { home: "Home", menu: "Menu", prodotto: "Prodotto", carrello: "Carrello", ordine: "Segui l'ordine", profilo: "Profilo" };
  var vista = $("#a-vista"), corrente = null;
  function route(anima) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), nome = V[p[0]] ? p[0] : "home";
    clearInterval(timer);
    var html = V[nome](p[1] ? decodeURIComponent(p[1]) : "");
    if (anima === false || !corrente || ridotto()) vista.innerHTML = html;
    else NX.vista(vista, html, ORD.indexOf(nome) >= ORD.indexOf(corrente) ? "dx" : "sx");
    var cambio = nome !== corrente; corrente = nome;
    var tab = nome === "prodotto" ? "menu" : nome;
    $$("#a-tab a").forEach(function (a) { if (a.getAttribute("data-t") === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (nome === "prodotto" ? (byId(p[1]) || MENU[0]).n : TITOLI[nome]) + " · Spiedo Nero (app dimostrativa)";
    if (nome === "ordine") avviaTracking();
    if (nome === "prodotto") { var f = $("form.a-pform", vista); if (f) aggiornaForm(f); }
    if (nome === "menu" && !menuPronto) setTimeout(function () { menuPronto = true; disegnaLista(); }, ridotto() ? 0 : 420);
    var s = $(".nx-seg.a-modo", vista); if (s) NX.seg(s, function (v) { stato.modo = v; salva(); route(false); });
    barraC();
    if (cambio && anima !== false) { window.scrollTo(0, 0); }
    nav$();
  }
  /* barra in alto: titolo piccolo e vetro quando si scorre */
  function nav$() { var n = $(".a-nav", vista); if (n) n.classList.toggle("nx-compatta", (window.scrollY || root.scrollTop) > 40); }
  window.addEventListener("scroll", nav$, { passive: true });

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a],[data-nx-azione],[data-agg],[data-cq],[data-cat],[data-ind],[data-q]");
    if (!a) return;
    var az = a.getAttribute("data-a") || a.getAttribute("data-nx-azione");
    if (az === "opzioni") opzioni();
    else if (az === "menu") location.hash = "#/menu";
    else if (az === "svuota") { ricerca = ""; var c = $("#a-cerca"); if (c) c.value = ""; disegnaLista(); }
    else if (az === "indirizzo") scegliIndirizzo();
    else if (az === "invia") invia(a);
    else if (az === "ripeti") {
      var ult = stato.ordini[0] && stato.ordini[0].voci ? stato.ordini[0] : ESEMPIO;
      ult.voci.forEach(function (v) { aggiungi({ m: byId(v.id), unit: v.unit, nota: v.nota }, v.q); });
      NX.toast("Ordine #" + ult.n + " di nuovo nel carrello"); barraC();
    } else if (az === "azzera") {
      var f = NX.foglio.apri({ titolo: "Azzerare la demo?", html: '<p class="a-desc">Togliamo carrello, ordini e timbri salvati in questo browser. Non si può annullare.</p>', piede: '<button class="nx-btn" type="button" data-a="chiudi-f">Annulla</button><button class="nx-btn p a-btn-rosso" type="button" data-a="azzera-ok">Azzera</button>' });
      f.setAttribute("data-conferma", "1");
    } else if (az === "azzera-ok") {
      cart = []; stato = { modo: "consegna", codice: "", punti: 6, ordini: [], attivo: null, ind: "casa" }; salva(); NX.foglio.chiudi(); NX.toast("Dati della demo azzerati"); route(false);
    } else if (az === "chiudi-f") NX.foglio.chiudi();
    else if (a.hasAttribute("data-agg")) aggiungiVeloce(a.getAttribute("data-agg"));
    else if (a.hasAttribute("data-cat")) { menuCat = a.getAttribute("data-cat"); ricerca = ""; var ce = $("#a-cerca"); if (ce) ce.value = ""; try { history.replaceState(null, "", location.pathname + location.search + "#/menu/" + menuCat); } catch (x) {} disegnaLista(); }
    else if (a.hasAttribute("data-ind")) { stato.ind = a.getAttribute("data-ind"); salva(); NX.toast("Consegna a " + indirizzo().v); route(false); }
    else if (a.hasAttribute("data-cq")) {
      var i = +a.getAttribute("data-i"), r = cart[i]; if (!r) return;
      r.q += +a.getAttribute("data-cq");
      if (r.q < 1) { cart.splice(i, 1); NX.toast(r.n + " tolto dal carrello"); }
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
      if (f.closest(".nx-foglio")) { NX.foglio.chiudi(); barraC(); } else location.hash = "#/menu/" + s.m.c;
    } else if (f.id === "a-f-codice") {
      e.preventDefault();
      var v = $("#a-codice").value.trim().toUpperCase(), m = $("#a-codice-msg");
      if (CODICI[v]) { stato.codice = v; salva(); route(false); NX.toast("Sconto del 10% applicato"); }
      else { m.className = "a-msg no"; m.textContent = v ? "Il codice " + v + " non esiste. Prova NERO10." : "Scrivi un codice."; $("#a-codice").focus(); }
    }
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); route(true); });

  badge(); route(false);
})();
