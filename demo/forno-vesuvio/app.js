/* Forno Vesuvio · app dimostrativa sul kit Noxford.
   Dati e regole in data.js (condivisi col pannello del titolare), pizza disegnata in pizza.js.
   Nessun dato viene inviato: carrello e ordini restano nel browser. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, esc = NX.esc, K = FV.COMPONI, euro = FV.euro;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var ridotto = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };

  var I = {
    opzioni: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    indietro: '<path d="M15 5l-7 7 7 7"/>', piu: '<path d="M12 5v14M5 12h14"/>', meno: '<path d="M5 12h14"/>',
    freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>', orologio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pizza: '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1.3"/><circle cx="14.5" cy="9" r="1.3"/><circle cx="13" cy="14.5" r="1.3"/>',
    lista: '<path d="M5 6h14M5 12h14M5 18h9"/>', pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    filtro: '<path d="M4 6h16l-6 7v5l-4 2v-7z"/>', banco: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    fiamma: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.6-8.3.4 2 1.6 3 2.6 3.4.2-2.6 1.4-5 3.4-6.4-.2 2.6 1 4.4 2.3 6 1 1.3 1.6 2.6 1.6 4.4 0 4-2.9 7.1-7 7.1z"/>',
    ripeti: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>'
  };
  function ic(k) { return '<svg class="a-i" viewBox="0 0 24 24" aria-hidden="true">' + (I[k] || "") + "</svg>"; }

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
        '<li><label class="nx-cella nx-toggle a-tg"><span class="nx-c-tx"><b>Effetto vetro</b></span><input type="checkbox" class="a-f-v"><i></i></label></li>' +
        '<li><a class="nx-cella" href="admin.html"><span class="nx-c-tx"><b>Pannello del titolare</b><small>Ordini in arrivo e ingredienti finiti</small></span><i class="nx-chev"></i></a></li></ul>' +
        '<p class="a-nota">Attività inventata, dati di esempio. Le scelte restano in questo browser.</p>'
    });
    NX.seg(f.querySelector(".a-f-s"), function (v) { f.querySelector(".a-f-d").textContent = STILI[v][1]; impostaStile(v); });
    NX.pref.collega(f.querySelector(".a-f-t"), "tema");
    NX.pref.collega(f.querySelector(".a-f-v"), "vetro");
  }

  /* ---------- pezzi comuni ---------- */
  function marchio() { return '<a class="a-marchio" href="#/home" aria-label="Forno Vesuvio, home"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#B8321F"/><path d="M8 28h24L23.5 15.5c-.9-1.3-2.1-1.3-3 0l-1.6 2.3-1.2-1.4c-.8-1-1.8-1-2.6.1Z" fill="#F7E9D2"/></svg></a>'; }
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
  function pillStato() { var s = FV.statoLocale(); return '<span class="nx-pill ' + (s.aperto ? "ok" : "wait") + '">' + esc(s.testo) + "</span>"; }
  function disegnata(p, cls) { return FVPizza.statica(Object.assign({ impasto: "classico", misura: "maxi", cottura: "classica" }, p.pz), p.nome + ", anteprima disegnata"); }
  function foto(p, cls) {
    if (p.foto) return '<img class="a-th ' + (cls || "") + '" src="' + p.foto + '" alt="" loading="lazy" width="800" height="800">';
    if (p.pz) return '<span class="a-th pz ' + (cls || "") + '" aria-hidden="true">' + disegnata(p) + "</span>";
    return '<span class="a-th ic ' + (cls || "") + '" aria-hidden="true">' + esc(p.nome.charAt(0)) + "</span>";
  }

  /* ---------- pizza del giorno ---------- */
  var GIRO = ["friarielli", "bufalina", "gialla", "calabrese", "ortolana", "diavola", "capricciosa"];
  var giorno = FV.trova(FV.MENU, GIRO[new Date().getDay()]);
  function prezzoMenu(p) { return p.id === giorno.id ? p.prezzo - 1 : p.prezzo; }
  function prezzoHtml(p) { return (p.id === giorno.id ? '<s class="a-was">' + euro(p.prezzo) + "</s> " : "") + euro(prezzoMenu(p)); }
  function isPizza(p) { return p.cat === "classiche" || p.cat === "speciali"; }
  var oggiNome = new Date().toLocaleDateString("it-IT", { weekday: "long" });

  /* ---------- HOME ---------- */
  var PASSI = [["img/ingredienti.webp", "Ricevuto", "L'ordine arriva sul tablet del banco con l'orario che hai scelto. Se manca un ingrediente ti scriviamo subito."],
    ["img/impasto.webp", "In preparazione", "L'impasto ha riposato 24 ore. Lo stendiamo a mano e mettiamo gli ingredienti nell'ordine giusto."],
    ["img/forno.webp", "In forno", "Circa 90 secondi vicino alla fiamma. Il bordo si gonfia, la mozzarella resta morbida."],
    ["img/sala.webp", "Pronta o in consegna", "Al banco col tuo numero, oppure in borsa termica verso casa tua."]];
  function cartaGiorno(classe) {
    return '<section class="f-giorno ' + (classe || "") + '"><div class="f-giorno-m">' + (giorno.foto ? '<img src="' + giorno.foto + '" alt="' + esc(giorno.nome) + ', vista dall\'alto" width="800" height="800" loading="lazy">' : disegnata(giorno)) + "</div>" +
      '<div class="f-giorno-t"><small>La pizza di ' + oggiNome + "</small><b>" + esc(giorno.nome) + "</b><span>" + esc(giorno.ingr) + '</span><p class="nx-num">' + prezzoHtml(giorno) + ' <em>un euro in meno, solo oggi</em></p>' +
      '<button class="nx-btn p" type="button" data-sch="' + giorno.id + '">Aggiungi</button></div></section>';
  }
  function home() {
    if (stile === "b") {
      return nav({ titolo: "Forno Vesuvio", fissa: 1 }) +
        '<div class="a-ed-hero"><img src="img/forno.webp" width="896" height="1200" alt="Una margherita appena sfornata sulla pala, davanti al forno a legna acceso" fetchpriority="high"></div>' +
        '<div class="a-pad a-ed-apre"><p class="a-occhiello">' + esc(FV.statoLocale().testo) + "</p>" +
        '<h1 class="a-display">Pizza napoletana cotta a legna. <em>Da ritirare o a casa tua.</em></h1>' +
        '<p class="a-lead">Scegli dal menu o componi la tua pizza ingrediente per ingrediente. Vedi il prezzo mentre scegli e segui l\'ordine fino alla porta.</p>' +
        '<div class="f-cta2"><a class="nx-btn p a-cta" href="#/componi">Componi la tua pizza</a><a class="nx-btn a-cta" href="#/menu">Il menu</a></div></div>' +
        '<div class="a-pad a-sez">' + cartaGiorno("ed") + "</div>" +
        '<section class="a-pad a-sez"><h2 class="a-display-s">Dal tuo ordine al cartone</h2><ol class="f-passi-b">' + PASSI.map(function (x, i) {
          return '<li><img src="' + x[0] + '" alt="" loading="lazy" width="800" height="600"><div><small>' + (i + 1) + " di 4</small><b>" + x[1] + "</b><p>" + x[2] + "</p></div></li>";
        }).join("") + "</ol></section>" +
        '<div class="a-pad a-sez"><a class="f-locale-b" href="#/locale" data-nx-premi><span><b>Orari, zone e domande</b><small>Vico del Forno Vecchio 12 · lunedì chiuso</small></span>' + ic("freccia") + "</a></div>";
    }
    if (stile === "c") {
      var ult = FV.leggi("ordini", []).filter(function (o) { return o.numero === FV.leggi("ultimo", null); })[0];
      return nav({ titolo: "Forno Vesuvio" }) + titolo("Forno Vesuvio") +
        '<div class="a-pad"><div class="a-righello">' + pillStato() + '<span class="nx-pill a-pill-i">' + ic("orologio") + "Ritiro in 30 min</span></div>" +
        '<section class="a-sez f-azioni-c"><a href="#/componi" data-nx-premi>' + ic("pizza") + "<b>Componi</b><small>Da " + euro(K.misure[0].prezzo) + "</small></a>" +
        '<a href="#/menu" data-nx-premi>' + ic("lista") + "<b>Menu</b><small>" + FV.MENU.length + " piatti</small></a>" +
        (ult ? '<a href="#/ordine" data-nx-premi>' + ic("banco") + "<b>Ordine " + esc(ult.numero) + "</b><small>" + esc(FV.nomeStato(ult.stato, ult.modo)) + "</small></a>" : '<a href="#/locale" data-nx-premi>' + ic("pin") + "<b>Orari e zone</b><small>Lunedì chiuso</small></a>") + "</section>" +
        '<section class="a-sez">' + cartaGiorno("c") + "</section>" +
        '<section class="a-sez"><h2 class="a-sez-t">Le più ordinate</h2><div class="a-griglia">' + ["margherita", "diavola", "friarielli", "frittatina"].map(function (id) { return tessera(FV.trova(FV.MENU, id)); }).join("") + "</div></section></div>";
    }
    return nav({ titolo: "Forno Vesuvio" }) + titolo("Forno Vesuvio", pillStato()) + '<div class="a-pad">' +
      '<a class="a-hero" href="#/componi" data-nx-premi><img src="img/forno.webp" width="896" height="1200" alt="Una margherita appena sfornata sulla pala, davanti al forno a legna acceso" fetchpriority="high"><span class="a-hero-tx"><b>Pizza napoletana cotta a legna</b><span>Da ritirare o a casa tua</span></span></a>' +
      '<section class="a-sez"><ul class="nx-lista"><li><a class="nx-cella ic" href="#/componi"><span class="nx-c-ic">' + ic("pizza") + '</span><span class="nx-c-tx"><b>Componi la tua pizza</b><small>La vedi prendere forma, il prezzo cambia subito</small></span><i class="nx-chev"></i></a></li>' +
      '<li><a class="nx-cella ic" href="#/menu"><span class="nx-c-ic">' + ic("lista") + '</span><span class="nx-c-tx"><b>Sfoglia il menu</b><small>Con allergeni e filtri</small></span><i class="nx-chev"></i></a></li></ul></section>' +
      '<section class="a-sez">' + cartaGiorno() + "</section>" +
      '<section class="a-sez"><h2 class="nx-gruppo-t">Dal tuo ordine al cartone</h2><ul class="nx-lista">' + PASSI.map(function (x) { return '<li><div class="nx-cella a-voce"><img class="a-th" src="' + x[0] + '" alt="" loading="lazy" width="300" height="300"><span class="nx-c-tx"><b>' + x[1] + '</b><small class="a-wrap">' + x[2] + "</small></span></div></li>"; }).join("") + "</ul></section>" +
      '<section class="a-sez"><ul class="nx-lista"><li><a class="nx-cella ic" href="#/locale"><span class="nx-c-ic">' + ic("pin") + '</span><span class="nx-c-tx"><b>Orari, zone e domande</b><small>Vico del Forno Vecchio 12</small></span><i class="nx-chev"></i></a></li></ul></section></div>';
  }

  /* ---------- LOCALE ---------- */
  function locale() {
    return nav({ titolo: "Il locale", sx: indietro("Home", "#/home") }) + titolo("Orari, zone e domande") + '<div class="a-pad">' +
      '<img class="f-sala" src="img/sala.webp" alt="La sala della pizzeria con tavoli in legno e maioliche" width="1200" height="896" loading="lazy">' +
      '<p class="a-nota"><b>Vico del Forno Vecchio 12, Napoli.</b> Indirizzo di esempio: l\'attività non esiste.</p>' +
      '<section class="nx-gruppo a-sez"><h2 class="nx-gruppo-t">Orari</h2><ul class="nx-lista"><li><div class="nx-cella"><span class="nx-c-tx"><b>Lunedì</b></span><span class="nx-c-dx">Chiuso</span></div></li><li><div class="nx-cella"><span class="nx-c-tx"><b>Da martedì a domenica</b></span><span class="nx-c-dx nx-num f-dx-2">12:00 – 15:00<br>19:00 – 23:30</span></div></li></ul></section>' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Zone di consegna</h2><ul class="nx-lista">' + FV.ZONE.map(function (z) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + z.nome + '</b></span><span class="nx-c-dx nx-num">' + euro(z.costo) + "</span></div></li>"; }).join("") + '</ul><p class="a-nota">Ordine minimo per la consegna ' + euro(FV.MINIMO_CONSEGNA) + ". Il ritiro al banco non ha minimo.</p></section>" +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Domande frequenti</h2><div class="f-faq">' +
      [["Fate pizze senza glutine?", "Sì, con un impasto preparato a parte e cotte su una teglia dedicata. In una cucina con farina non possiamo escludere ogni traccia: se sei celiaco scrivilo nelle note."],
        ["Come pago?", "Al ritiro o alla consegna, in contanti o con carta. L'app non chiede dati di pagamento."],
        ["Posso cambiare l'orario dopo aver ordinato?", "Finché l'ordine è \"Ricevuto\" sì: chiamaci e lo spostiamo. Quando entra in forno non si può più cambiare."]].map(function (x) { return "<details><summary>" + x[0] + "</summary><p>" + x[1] + "</p></details>"; }).join("") + "</div></section></div>";
  }

  /* ---------- MENU ---------- */
  var filtro = { cat: "tutte", testo: "", via: [], veg: false }, menuPronto = false;
  function vegetariano(p) { return p.veg || (p.pz && p.pz.top.every(function (t) { return ["salame", "prosciutto", "salsiccia", "nduja", "acciughe"].indexOf(t) < 0; }) && p.cat !== "fritti") || p.cat === "bevande"; }
  function menu() {
    var n = filtro.via.length + (filtro.veg ? 1 : 0);
    return nav({ titolo: "Menu" }) + titolo("Il menu") +
      '<div class="a-filtri"><div class="f-cerca-riga"><label class="nx-cerca"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg><span class="nx-sr">Cerca nel menu</span><input id="a-cerca" type="search" placeholder="Cerca: bufala, salsiccia, fritti" autocomplete="off" value="' + esc(filtro.testo) + '"></label>' +
      '<button class="nx-btn f-allergie' + (n ? " on" : "") + '" type="button" data-a="allergie">' + ic("filtro") + "<span>" + (n ? "Filtri · " + n : "Allergie") + "</span></button></div>" +
      '<div class="nx-chips" role="group" aria-label="Categorie"><button class="nx-chip" type="button" data-cat="tutte" aria-pressed="' + (filtro.cat === "tutte") + '">Tutto</button>' + FV.CATEGORIE.map(function (c) { return '<button class="nx-chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (filtro.cat === c.id) + '">' + c.nome + "</button>"; }).join("") + "</div></div>" +
      '<div class="a-pad" id="a-lista" aria-live="polite">' + (menuPronto ? listaHtml() : NX.stato.caricamento(6)) + "</div>";
  }
  function voci(c) {
    return FV.MENU.filter(function (p) {
      if (p.cat !== c.id) return false;
      if (filtro.testo && (p.nome + " " + p.ingr).toLowerCase().indexOf(filtro.testo) < 0) return false;
      if (filtro.veg && !vegetariano(p)) return false;
      return filtro.via.every(function (a) { return p.all.indexOf(a) < 0 || (a === "glu" && isPizza(p)); });
    });
  }
  function nota(p) {
    var sg = filtro.via.indexOf("glu") >= 0 && isPizza(p);
    return (sg ? "Con impasto senza glutine (+ € 2,50) · " : "") + (p.all.length ? "Allergeni: " + p.all.map(function (a) { return FV.ALLERGENI[a]; }).join(", ") : "Senza allergeni principali");
  }
  function cella(p) {
    return '<li><button class="nx-cella a-voce" type="button" data-sch="' + p.id + '">' + foto(p) + '<span class="nx-c-tx"><b>' + esc(p.nome) + (p.id === giorno.id ? ' <span class="nx-pill acc a-tag">Di oggi</span>' : "") + "</b><small>" + esc(p.ingr) + '</small><small class="f-all-s">' + esc(nota(p)) + '</small></span><span class="nx-c-dx a-prezzo nx-num f-dx-2">' + prezzoHtml(p) + "</span></button></li>";
  }
  function tessera(p) {
    return '<div class="a-tile"><button class="a-tile-l" type="button" data-sch="' + p.id + '" data-nx-premi>' + foto(p, "q") + "<b>" + esc(p.nome) + '</b><span class="nx-num">' + euro(prezzoMenu(p)) + "</span></button>" +
      '<button class="nx-btn ico p a-tile-piu" type="button" data-agg="' + p.id + '" aria-label="Aggiungi ' + esc(p.nome) + '">' + ic("piu") + "</button></div>";
  }
  function listaHtml() {
    var out = "", tot = 0;
    FV.CATEGORIE.forEach(function (c) {
      if (filtro.cat !== "tutte" && filtro.cat !== c.id) return;
      var v = voci(c); if (!v.length) return; tot += v.length;
      out += '<h2 class="nx-gruppo-t a-lista-t">' + c.nome + "</h2>";
      if (stile === "c") out += '<div class="a-griglia">' + v.map(tessera).join("") + "</div>";
      else if (stile === "b") out += v.map(function (p) {
        return '<button class="a-card-b' + (p.foto ? " foto" : "") + '" type="button" data-sch="' + p.id + '" data-nx-premi>' + (p.foto ? '<img src="' + p.foto + '" alt="" loading="lazy" width="800" height="800">' : foto(p)) +
          '<span class="a-card-b-tx"><b>' + esc(p.nome) + "</b><span>" + esc(p.ingr) + '</span><small class="f-all-s">' + esc(nota(p)) + '</small><em class="nx-num">' + prezzoHtml(p) + "</em></span></button>";
      }).join("");
      else out += '<ul class="nx-lista">' + v.map(cella).join("") + "</ul>";
    });
    return out || NX.stato.vuoto("Nessun piatto con questi filtri", "Prova a togliere un filtro o a cercare un'altra parola.", ["Togli i filtri", "togli-filtri"]);
  }
  function disegnaLista() { var b = $("#a-lista"); if (b) b.innerHTML = listaHtml(); }
  function allergie() {
    var f = NX.foglio.apri({
      titolo: "Allergie e preferenze",
      html: '<p class="a-desc">Nascondi i piatti che contengono:</p><ul class="nx-lista a-spazio">' + ["glu", "lat", "uov", "pes", "fru", "sed", "sol"].map(function (k) {
        return '<li><label class="nx-cella a-opz"><input type="checkbox" name="via" value="' + k + '"' + (filtro.via.indexOf(k) >= 0 ? " checked" : "") + '><span class="nx-c-tx"><b>' + FV.ALLERGENI[k] + '</b></span><i class="a-segno" aria-hidden="true"></i></label></li>';
      }).join("") + '</ul><ul class="nx-lista a-spazio"><li><label class="nx-cella a-opz"><input type="checkbox" name="veg"' + (filtro.veg ? " checked" : "") + '><span class="nx-c-tx"><b>Solo vegetariani</b></span><i class="a-segno" aria-hidden="true"></i></label></li></ul>' +
        '<p class="a-nota">Con "Glutine" le pizze restano visibili: si possono fare con l\'impasto senza glutine, preparato a parte (+ € 2,50).</p>',
      piede: '<button class="nx-btn" type="button" data-a="togli-filtri">Togli tutti</button><button class="nx-btn p" type="button" data-a="chiudi-f">Mostra i piatti</button>'
    });
    f.addEventListener("change", function () {
      filtro.via = $$('input[name="via"]:checked', f).map(function (i) { return i.value; });
      filtro.veg = !!$('input[name="veg"]:checked', f);
      route(false);
    });
  }

  /* ---------- scheda prodotto (foglio) ---------- */
  var sch = { p: null, q: 1 };
  function opzioniScheda(p) {
    if (!isPizza(p)) return [];
    var o = [{ id: "integrale", nome: "Impasto integrale", prezzo: 1 }, { id: "senzaglutine", nome: "Impasto senza glutine", prezzo: 2.5 }];
    if (p.pz.formaggio !== "nessuno") o.push({ id: "bufala", nome: "Bufala al posto del fior di latte", prezzo: 2 }, { id: "doppia", nome: "Doppia mozzarella", prezzo: 1.5 });
    o.push({ id: "bencotta", nome: "Ben cotta", prezzo: 0 }, { id: "tagliata", nome: "Tagliata a spicchi", prezzo: 0 });
    return o;
  }
  function apriScheda(id) {
    var p = FV.trova(FV.MENU, id); sch = { p: p, q: 1 };
    var o = opzioniScheda(p);
    var media = p.foto ? '<img src="' + p.foto + '" alt="' + esc(p.nome) + '" width="800" height="800">' : p.pz ? disegnata(p) + "<small>Anteprima disegnata, prima della cottura</small>" : '<span class="f-iniz" aria-hidden="true">' + esc(p.nome.charAt(0)) + "</span>";
    var f = NX.foglio.apri({
      titolo: p.nome, classe: "f-scheda",
      html: '<div class="f-sch-media' + (p.foto ? "" : p.pz ? " disegno" : " vuota") + '">' + media + "</div>" +
        '<p class="a-desc">' + esc(p.ingr) + '</p><p class="f-all"><b>Allergeni</b> ' + (p.all.length ? p.all.map(function (a) { return FV.ALLERGENI[a]; }).join(" · ") : "nessuno dei 14 principali") + "</p>" +
        (o.length ? '<fieldset class="nx-gruppo a-scelta a-spazio"><legend class="nx-gruppo-t">Varianti</legend><ul class="nx-lista">' + o.map(function (x) {
          return '<li><label class="nx-cella a-opz"><input type="checkbox" name="var" value="' + x.id + '"><span class="nx-c-tx"><b>' + x.nome + '</b></span><span class="nx-c-dx nx-num">' + (x.prezzo ? "+ " + euro(x.prezzo) : "gratis") + '</span><i class="a-segno" aria-hidden="true"></i></label></li>';
        }).join("") + "</ul></fieldset>" : "") +
        (p.pz ? '<button class="nx-btn t f-pers" type="button" data-a="personalizza">' + ic("pizza") + " Personalizzala in Componi</button>" : ""),
      piede: passo("data-sq", null, 1) + '<button class="nx-btn p" type="button" data-a="sch-agg">Aggiungi · <span class="f-sch-tot nx-num"></span></button>'
    });
    f.addEventListener("change", function (e) {
      if (e.target.checked && (e.target.value === "integrale" || e.target.value === "senzaglutine")) {
        var altro = $('input[value="' + (e.target.value === "integrale" ? "senzaglutine" : "integrale") + '"]', f); if (altro) altro.checked = false;
      }
      totScheda();
    });
    totScheda();
  }
  function sceltaScheda() {
    var f = NX.foglio.aperto(), o = opzioniScheda(sch.p), sel = f ? $$('input[name="var"]:checked', f).map(function (i) { return i.value; }) : [];
    var extra = 0, nomi = [];
    o.forEach(function (x) { if (sel.indexOf(x.id) >= 0) { extra += x.prezzo; nomi.push(x.nome); } });
    return { extra: extra, nomi: nomi };
  }
  function totScheda() {
    var f = NX.foglio.aperto(); if (!f) return;
    var s = sceltaScheda();
    $(".a-passo output", f).textContent = sch.q;
    $(".f-sch-tot", f).textContent = euro((prezzoMenu(sch.p) + s.extra) * sch.q);
  }

  /* ---------- COMPONI ---------- */
  var stato = { impasto: "classico", misura: "normale", salsa: "rossa", formaggio: "fiordilatte", top: ["basilico"], cottura: "classica" };
  var bozza = FV.leggi("bozza", null);
  if (bozza && bozza.misura && FV.trova(K.misure, bozza.misura)) stato = bozza;
  function finiti() { return FV.leggi("finiti", []); }
  stato.top = stato.top.filter(function (t) { return finiti().indexOf(t) < 0 && FV.trova(K.ingredienti, t); });
  var viva = null, mostrato = 0, rafPrezzo;

  function gruppoRadio(t, lista, chiave, assoluto) {
    return '<fieldset class="nx-gruppo a-scelta f-gr"><legend class="nx-gruppo-t">' + t + '</legend><ul class="nx-lista">' + lista.map(function (x) {
      var pr = assoluto ? euro(x.prezzo) : x.prezzo ? "+ " + euro(x.prezzo) : "";
      return '<li><label class="nx-cella a-opz"><input type="radio" name="' + chiave + '" value="' + x.id + '"' + (stato[chiave] === x.id ? " checked" : "") + '><span class="nx-c-tx"><b>' + x.nome + "</b>" + (x.nota ? "<small>" + x.nota + "</small>" : "") + "</span>" +
        (pr ? '<span class="nx-c-dx nx-num">' + pr + "</span>" : "") + '<i class="a-segno" aria-hidden="true"></i></label></li>';
    }).join("") + "</ul></fieldset>";
  }
  function tessereHtml() {
    var fin = finiti();
    return K.ingredienti.map(function (x) {
      var no = fin.indexOf(x.id) >= 0, on = stato.top.indexOf(x.id) >= 0;
      return '<label class="f-tess' + (no ? " finito" : "") + '"><input type="checkbox" name="top" value="' + x.id + '"' + (on ? " checked" : "") + (no ? " disabled" : "") + ">" + FVPizza.icona(x.id) +
        '<span><b>' + x.nome + "</b><small>" + (no ? "Finito per oggi" : "+ " + euro(x.prezzo)) + '</small></span><i class="a-segno" aria-hidden="true"></i></label>';
    }).join("");
  }
  function componi() {
    var m = FV.trova(K.misure, stato.misura);
    return nav({ titolo: "Componi" }) + titolo("Componi la tua pizza", stile === "c" ? "" : "Parti dall'impasto e aggiungi quello che vuoi: ogni ingrediente lo vedi cadere sulla pizza.") +
      '<div class="f-palco" id="f-palco"><div class="f-palco-in"><div class="f-tavolo" aria-hidden="true"></div><div id="f-viva" class="pizza-viva"></div>' +
      '<p class="f-cartellino" aria-live="polite"><span id="f-misura">' + m.nome + " · " + m.nota + '</span><b id="f-prezzo" class="nx-num">' + euro(FV.prezzoPizza(stato)) + "</b></p></div></div>" +
      '<div class="a-pad"><div class="f-parti"><span>Parti da</span><div class="nx-chips">' + [["margherita", "Margherita"], ["diavola", "Diavola"], ["ortolana", "Ortolana"], ["vuota", "Vuota"]].map(function (x) { return '<button class="nx-chip" type="button" data-parti="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div></div>" +
      '<form id="f-componi" novalidate>' +
      gruppoRadio("Impasto", K.impasti, "impasto") + gruppoRadio("Misura", K.misure, "misura", true) + gruppoRadio("Base", K.salse, "salsa") + gruppoRadio("Formaggio", K.formaggi, "formaggio") +
      '<fieldset class="nx-gruppo a-scelta"><legend class="nx-gruppo-t f-leg">Ingredienti <span class="nx-pill acc" id="f-quanti">0 di ' + K.massimo + '</span></legend><div class="f-tessere" id="f-tessere">' + tessereHtml() + "</div></fieldset>" +
      gruppoRadio("Cottura", K.cotture, "cottura") +
      '<section class="f-riep"><h2>La tua pizza</h2><ul id="f-riep"></ul><p class="f-riep-tot"><span>Totale</span><b class="nx-num" id="f-riep-tot"></b></p></section>' +
      '<div class="a-aggiungi nx-vetro"><button class="nx-btn" type="button" data-a="ricomincia">Ricomincia</button><button class="nx-btn p" type="submit">Aggiungi · <span class="a-tot nx-num" id="f-tot"></span></button></div></form></div>';
  }
  function riepilogo() {
    var m = FV.trova(K.misure, stato.misura), righe = [];
    righe.push([m.nome + " " + m.nota + ", impasto " + FV.trova(K.impasti, stato.impasto).nome.toLowerCase(), m.prezzo + FV.trova(K.impasti, stato.impasto).prezzo, null]);
    var sa = FV.trova(K.salse, stato.salsa); righe.push([sa.nome, sa.prezzo, null]);
    var fo = FV.trova(K.formaggi, stato.formaggio); righe.push([fo.nome, fo.prezzo, null]);
    stato.top.forEach(function (id) { var x = FV.trova(K.ingredienti, id); righe.push([x.nome, x.prezzo, id]); });
    righe.push(["Cottura: " + FV.trova(K.cotture, stato.cottura).nome.toLowerCase(), 0, null]);
    $("#f-riep").innerHTML = righe.map(function (r) {
      return "<li><span>" + esc(r[0]) + '</span><span class="nx-num">' + (r[1] ? euro(r[1]) : "incluso") + "</span>" + (r[2] ? '<button type="button" class="f-togli" data-togli="' + r[2] + '" aria-label="Togli ' + esc(r[0]) + '">×</button>' : "") + "</li>";
    }).join("");
    $("#f-quanti").textContent = stato.top.length + " di " + K.massimo;
    $("#f-misura").textContent = m.nome + " · " + m.nota;
    $$("#f-tessere input").forEach(function (i) { i.closest(".f-tess").classList.toggle("bloccata", stato.top.length >= K.massimo && !i.checked && !i.disabled); });
  }
  function animaPrezzo(fino) {
    cancelAnimationFrame(rafPrezzo);
    var da = mostrato, t0 = performance.now(), dur = ridotto() ? 0 : 380;
    function passoP(t) {
      var k = dur ? Math.min(1, (t - t0) / dur) : 1, v = da + (fino - da) * (1 - Math.pow(1 - k, 3)), s = euro(v);
      mostrato = v; ["#f-prezzo", "#f-riep-tot", "#f-tot"].forEach(function (x) { var e = $(x); if (e) e.textContent = s; });
      if (k < 1) rafPrezzo = requestAnimationFrame(passoP); else mostrato = fino;
    }
    rafPrezzo = requestAnimationFrame(passoP);
    var c = $(".f-cartellino"); if (c) { c.classList.remove("batti"); void c.offsetWidth; c.classList.add("batti"); }
  }
  function applica(anima) {
    if (!viva || !$("#f-viva")) return;
    viva.aggiorna(stato, anima && !ridotto());
    riepilogo(); animaPrezzo(FV.prezzoPizza(stato)); FV.scrivi("bozza", stato);
  }
  function avviaComponi() {
    viva = FVPizza.crea($("#f-viva")); mostrato = FV.prezzoPizza(stato) - 0.01; applica(false);
    var palco = $("#f-palco");
    palco.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || ridotto()) return;
      var r = palco.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      palco.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg"); palco.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
    });
    palco.addEventListener("pointerleave", function () { palco.style.setProperty("--rx", "0deg"); palco.style.setProperty("--ry", "0deg"); });
  }
  function carica(pz) {
    stato.salsa = pz.salsa; stato.formaggio = pz.formaggio;
    stato.top = pz.top.filter(function (t) { return finiti().indexOf(t) < 0; });
    $$("#f-componi input[type=radio]").forEach(function (i) { i.checked = stato[i.name] === i.value; });
    $("#f-tessere").innerHTML = tessereHtml(); applica(true);
  }

  /* ---------- CARRELLO ---------- */
  var carrello = FV.leggi("carrello", []), modo = "ritiro", errori = "";
  function salvaCarrello() { FV.scrivi("carrello", carrello); badge(); }
  function badge() {
    var n = carrello.reduce(function (a, r) { return a + r.q; }, 0), b = $("#a-badge");
    b.hidden = !n; b.textContent = n; b.classList.remove("a-pop"); void b.offsetWidth; if (n) b.classList.add("a-pop");
    $('#a-tab [data-t="carrello"]').setAttribute("aria-label", "Carrello, " + n + (n === 1 ? " prodotto" : " prodotti"));
  }
  function aggiungi(r) {
    var uguale = carrello.filter(function (x) { return x.tipo === "menu" && r.tipo === "menu" && x.id === r.id && JSON.stringify(x.extra) === JSON.stringify(r.extra); })[0];
    if (uguale) uguale.q += r.q; else { r.chiave = Date.now() + "-" + Math.random().toString(36).slice(2, 6); carrello.push(r); }
    salvaCarrello();
  }
  function subtotale() { return carrello.reduce(function (a, r) { return a + r.prezzo * r.q; }, 0); }
  function miniatura(r) {
    if (r.tipo === "composta") return '<span class="a-th pz" aria-hidden="true">' + FVPizza.statica(r.composta, "La tua pizza") + "</span>";
    var p = FV.trova(FV.MENU, r.id) || {}; return foto(p.nome ? p : { nome: r.nome });
  }
  function carrelloV() {
    var h = nav({ titolo: "Carrello" }) + titolo("Il tuo carrello");
    if (!carrello.length) return h + '<div class="a-pad">' + NX.stato.vuoto("Il carrello è vuoto", "Scegli dal menu o componi una pizza tutta tua.", ["Componi una pizza", "vai-componi"]) + "</div>";
    var cli = FV.leggi("cliente", {}) || {}, sub = subtotale();
    var zonaSel = FV.ZONE[0];
    return h + '<div class="a-pad">' +
      '<section class="nx-gruppo"><ul class="nx-lista a-righe">' + carrello.map(function (r, i) {
        return '<li><div class="nx-cella">' + miniatura(r) + '<span class="nx-c-tx"><b>' + esc(r.nome) + "</b><small>" + (esc(FV.descriviRiga(r)) || "Come da menu") + '</small></span><span class="a-riga-dx"><b class="nx-num">' + euro(r.prezzo * r.q) + "</b>" + passo("data-cq", i, r.q, r.nome) + "</span></div></li>";
      }).join("") + "</ul></section>" +
      '<form id="f-ordine" novalidate>' +
      '<section class="nx-gruppo"><h2 class="nx-gruppo-t">Come lo vuoi</h2><div class="nx-seg pieno a-modo" role="group" aria-label="Come lo vuoi"><button type="button" data-v="ritiro" aria-pressed="' + (modo === "ritiro") + '">Ritiro al banco</button><button type="button" data-v="consegna" aria-pressed="' + (modo === "consegna") + '">Consegna</button></div>' +
      '<p class="a-nota">' + (modo === "consegna" ? "Da 45 minuti. Minimo " + euro(FV.MINIMO_CONSEGNA) + " di prodotti." : "Pronto in 30 minuti, senza minimo.") + "</p></section>" +
      '<section class="nx-gruppo f-campi"><label class="nx-campo"><span>Orario</span><select id="f-orario" required>' + FV.fasce(modo).map(function (x) { return '<option value="' + x.valore + '">' + x.etichetta + "</option>"; }).join("") + "</select></label>" +
      (modo === "consegna" ? '<label class="nx-campo"><span>Zona</span><select id="f-zona">' + FV.ZONE.map(function (z) { return '<option value="' + z.id + '">' + z.nome + " · " + euro(z.costo) + "</option>"; }).join("") + "</select></label>" +
        '<label class="nx-campo"><span>Indirizzo e numero civico</span><input id="f-indirizzo" autocomplete="street-address" placeholder="Es. Via Esempio 4"></label>' +
        '<label class="nx-campo"><span>Citofono e piano</span><input id="f-citofono" placeholder="Es. Esposito, 2° piano"></label>' : "") +
      '<label class="nx-campo"><span>Nome</span><input id="f-nome" autocomplete="given-name" required placeholder="Come ti chiamiamo al banco" value="' + esc(cli.nome || "") + '"></label>' +
      '<label class="nx-campo"><span>Telefono</span><input id="f-tel" type="tel" inputmode="tel" autocomplete="tel" required placeholder="Per avvisarti se c\'è un problema" value="' + esc(cli.telefono || "") + '"></label>' +
      '<label class="nx-campo"><span>Note per la cucina (facoltative)</span><textarea id="f-note" rows="2" placeholder="Allergie, citofono rotto, pizza ben tagliata"></textarea></label></section>' +
      '<section class="a-conti nx-num" id="f-conti"></section>' +
      '<p class="a-msg no" id="f-err" role="alert">' + esc(errori) + "</p>" +
      '<button class="nx-btn p pieno a-invia" type="submit">Conferma l\'ordine</button><p class="a-nota">Paghi al ritiro o alla consegna, in contanti o con carta. Demo: nessun dato esce dal tuo browser.</p></form></div>';
  }
  function costoConsegna() { var z = $("#f-zona"); return modo === "consegna" && z ? FV.trova(FV.ZONE, z.value).costo : 0; }
  function conti() {
    var b = $("#f-conti"); if (!b) return;
    var sub = subtotale(), c = costoConsegna();
    b.innerHTML = "<p><span>Prodotti</span><span>" + euro(sub) + "</span></p>" + (modo === "consegna" ? "<p><span>Consegna</span><span>" + euro(c) + "</span></p>" : "") + '<p class="g"><span>Totale</span><span>' + euro(sub + c) + "</span></p>";
  }
  function inviaOrdine(form) {
    var err = [], sub = subtotale(), nome = $("#f-nome").value.trim(), tel = $("#f-tel").value.replace(/[^\d+]/g, "");
    $$(".nx-campo", form).forEach(function (c) { c.classList.remove("f-sbagliato"); });
    function no(sel, t) { err.push(t); $(sel).closest(".nx-campo").classList.add("f-sbagliato"); }
    if (!$("#f-orario").value) no("#f-orario", "scegli un orario");
    if (nome.length < 2) no("#f-nome", "scrivi il tuo nome");
    if (tel.replace("+", "").length < 8) no("#f-tel", "controlla il telefono");
    if (modo === "consegna") {
      if ($("#f-indirizzo").value.trim().length < 5) no("#f-indirizzo", "scrivi l'indirizzo");
      if (sub < FV.MINIMO_CONSEGNA) err.push("per la consegna servono almeno " + euro(FV.MINIMO_CONSEGNA) + " di prodotti (mancano " + euro(FV.MINIMO_CONSEGNA - sub) + ")");
    }
    if (err.length) { $("#f-err").textContent = "Manca qualcosa: " + err.join(", ") + "."; var p = $(".f-sbagliato input, .f-sbagliato select", form); if (p) p.focus(); return; }
    $("#f-err").textContent = "";
    var btn = $(".a-invia", form); btn.disabled = true; btn.innerHTML = '<span class="a-gira" aria-hidden="true"></span> Invio in corso';
    setTimeout(function () {
      var f = FV.fasce(modo).filter(function (x) { return x.valore === $("#f-orario").value; })[0];
      var o = {
        numero: FV.nuovoNumero(), creato: Date.now(), modo: modo, per: f ? f.etichetta : $("#f-orario").value, perOra: f ? f.ora : "", perValore: f ? f.valore : "",
        nome: nome, telefono: $("#f-tel").value.trim(), note: $("#f-note").value.trim(),
        zona: modo === "consegna" ? FV.trova(FV.ZONE, $("#f-zona").value).nome : "", indirizzo: modo === "consegna" ? ($("#f-indirizzo").value.trim() + ($("#f-citofono").value.trim() ? " · " + $("#f-citofono").value.trim() : "")) : "",
        righe: carrello, consegna: costoConsegna(), totale: sub + costoConsegna(), stato: "ricevuto", auto: true, storia: [{ stato: "ricevuto", t: Date.now() }]
      };
      var ordini = FV.leggi("ordini", []); ordini.push(o); FV.scrivi("ordini", ordini);
      FV.scrivi("ultimo", o.numero); FV.scrivi("cliente", { nome: nome, telefono: o.telefono });
      carrello = []; salvaCarrello(); appena = true;
      NX.toast("Ordine " + o.numero + " confermato"); location.hash = "#/ordine";
    }, ridotto() ? 150 : 850);
  }

  /* ---------- ORDINE ---------- */
  var appena = false;
  function ordineMio() { var n = FV.leggi("ultimo", null); return n ? FV.leggi("ordini", []).filter(function (o) { return o.numero === n; })[0] : null; }
  function ordineV() {
    var o = ordineMio(), h = nav({ titolo: "Ordine" });
    if (!o) return h + titolo("Il tuo ordine") + '<div class="a-pad">' + NX.stato.vuoto("Nessun ordine in corso", "Quando ordini, qui vedi la pizza passare dal banco al forno fino a te.", ["Vai al menu", "vai-menu"]) + "</div>";
    return h + titolo("Ordine " + o.numero, (o.modo === "consegna" ? "Consegna" : "Ritiro al banco") + " · " + esc(o.per)) + '<div class="a-pad" id="f-ordine-box">' + ordineHtml(o) + "</div>";
  }
  function ordineHtml(o) {
    var passi = ["ricevuto", "preparazione", "forno", "uscita", "chiuso"], idx = passi.indexOf(o.stato);
    var spieg = {
      ricevuto: "Il banco ha il tuo ordine. Tra poco lo prepariamo.", preparazione: "Stiamo stendendo l'impasto e mettendo gli ingredienti.", forno: "È nel forno a legna: circa 90 secondi.",
      uscita: o.modo === "consegna" ? "Il fattorino è partito verso " + (o.indirizzo.split(" · ")[0] || "casa tua") + "." : "È pronta al banco. Di' il numero " + o.numero + ".",
      chiuso: o.modo === "consegna" ? "Consegnato. Buon appetito." : "Ritirato. Buon appetito.", annullato: "Ordine annullato dal locale. Nella realtà ti avremmo chiamato."
    };
    var quando = function (s) { var x = o.storia.filter(function (h) { return h.stato === s; })[0]; return x ? new Date(x.t).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : ""; };
    return (appena ? '<p class="f-ok">Ordine confermato</p>' : "") +
      '<section class="f-ora ' + (o.stato === "annullato" ? "no" : "") + '" aria-live="polite"><b>' + FV.nomeStato(o.stato, o.modo) + "</b><span>" + spieg[o.stato] + "</span></section>" +
      (o.stato === "annullato" ? "" : '<ol class="a-fasi">' + passi.map(function (s, i) { return '<li class="' + (i < idx || o.stato === "chiuso" ? "fatto" : i === idx ? "ora" : "") + '"><i aria-hidden="true"></i><div><b>' + FV.nomeStato(s, o.modo) + "</b>" + (quando(s) ? "<small>alle " + quando(s) + "</small>" : "") + "</div></li>"; }).join("") + "</ol>") +
      '<section class="nx-gruppo a-sez"><h2 class="nx-gruppo-t">Riepilogo</h2><ul class="nx-lista">' + o.righe.map(function (r) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + r.q + " × " + esc(r.nome) + "</b>" + (FV.descriviRiga(r) ? '<small class="a-wrap">' + esc(FV.descriviRiga(r)) + "</small>" : "") + '</span><span class="nx-c-dx nx-num">' + euro(r.prezzo * r.q) + "</span></div></li>"; }).join("") +
      (o.consegna ? '<li><div class="nx-cella"><span class="nx-c-tx"><b>Consegna</b></span><span class="nx-c-dx nx-num">' + euro(o.consegna) + "</span></div></li>" : "") +
      '<li><div class="nx-cella"><span class="nx-c-tx"><b>Totale da pagare</b></span><span class="nx-c-dx nx-num f-forte">' + euro(o.totale) + "</span></div></li></ul></section>" +
      '<a class="nx-btn pieno" href="admin.html" target="_blank" rel="noopener">' + ic("banco") + ' Apri il pannello del titolare<span class="nx-sr"> (si apre in una nuova scheda)</span></a>' +
      '<p class="a-nota">In questa demo lo stato avanza da solo ogni mezzo minuto circa. Dal pannello del titolare puoi cambiarlo tu e vederlo aggiornarsi qui.</p>';
  }

  /* ---------- controllo periodico degli ordini ---------- */
  var ultimoStato = "";
  function giro() {
    FV.avanzaAuto();
    var o = ordineMio(), p = $("#a-punto");
    p.hidden = !o || o.stato === "chiuso" || o.stato === "annullato";
    if (!o) return;
    var firma = o.numero + o.stato;
    if (firma !== ultimoStato) {
      if (ultimoStato && ultimoStato.indexOf(o.numero) === 0) NX.toast("Ordine " + o.numero + ": " + FV.nomeStato(o.stato, o.modo).toLowerCase(), o.stato === "annullato" ? "no" : "");
      ultimoStato = firma;
      var box = $("#f-ordine-box"); if (box) box.innerHTML = ordineHtml(o);
    }
  }
  window.addEventListener("storage", function (e) {
    if (e.key === "fv_ordini") giro();
    if (e.key === "fv_finiti" && corrente === "componi") { stato.top = stato.top.filter(function (t) { return finiti().indexOf(t) < 0; }); $("#f-tessere").innerHTML = tessereHtml(); applica(false); }
  });

  /* ---------- router ---------- */
  var V = { home: home, locale: locale, menu: menu, componi: componi, carrello: carrelloV, ordine: ordineV };
  var ORD = ["home", "locale", "menu", "componi", "carrello", "ordine"];
  var TITOLI = { home: "Home", locale: "Orari e zone", menu: "Menu", componi: "Componi la tua pizza", carrello: "Carrello", ordine: "Il tuo ordine" };
  var vista = $("#a-vista"), corrente = null;
  function route(anima) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), nome = V[p[0]] ? p[0] : "home";
    var html = V[nome]();
    if (anima === false || !corrente || ridotto()) vista.innerHTML = html;
    else NX.vista(vista, html, ORD.indexOf(nome) >= ORD.indexOf(corrente) ? "dx" : "sx");
    var cambio = nome !== corrente; corrente = nome;
    if (nome !== "ordine") appena = false;
    var tab = nome === "locale" ? "home" : nome;
    $$("#a-tab a").forEach(function (a) { if (a.getAttribute("data-t") === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = TITOLI[nome] + " · Forno Vesuvio (app dimostrativa)";
    d.body.setAttribute("data-vista", nome);
    if (nome === "componi") avviaComponi();
    if (nome === "carrello") conti();
    if (nome === "menu" && !menuPronto) setTimeout(function () { menuPronto = true; disegnaLista(); }, ridotto() ? 0 : 420);
    var s = $(".nx-seg.a-modo", vista); if (s) NX.seg(s, function (v) { modo = v; errori = ""; route(false); });
    if (cambio && anima !== false) window.scrollTo(0, 0);
    nav$();
  }
  function nav$() { var n = $(".a-nav", vista); if (n) n.classList.toggle("nx-compatta", (window.scrollY || root.scrollTop) > 40); }
  window.addEventListener("scroll", nav$, { passive: true });

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a],[data-nx-azione],[data-sch],[data-agg],[data-cq],[data-cat],[data-parti],[data-togli],button[data-sq]");
    if (!a) return;
    var az = a.getAttribute("data-a") || a.getAttribute("data-nx-azione");
    if (az === "opzioni") opzioni();
    else if (az === "allergie") allergie();
    else if (az === "togli-filtri") { filtro.via = []; filtro.veg = false; filtro.testo = ""; filtro.cat = "tutte"; NX.foglio.chiudi(); route(false); }
    else if (az === "chiudi-f") NX.foglio.chiudi();
    else if (az === "vai-componi") location.hash = "#/componi";
    else if (az === "vai-menu") location.hash = "#/menu";
    else if (az === "sch-agg") {
      var s = sceltaScheda();
      aggiungi({ tipo: "menu", id: sch.p.id, nome: sch.p.nome, prezzo: prezzoMenu(sch.p) + s.extra, q: sch.q, extra: s.nomi, pizza: isPizza(sch.p) });
      NX.foglio.chiudi(); NX.toast(sch.q + " × " + sch.p.nome + " nel carrello");
    } else if (az === "personalizza") {
      var pz = sch.p.pz; NX.foglio.chiudi();
      stato.salsa = pz.salsa; stato.formaggio = pz.formaggio; stato.top = pz.top.filter(function (t) { return finiti().indexOf(t) < 0; }); FV.scrivi("bozza", stato);
      location.hash = "#/componi";
    } else if (az === "ricomincia") {
      stato = { impasto: "classico", misura: "normale", salsa: "rossa", formaggio: "fiordilatte", top: [], cottura: "classica" };
      $$("#f-componi input[type=radio]").forEach(function (i) { i.checked = stato[i.name] === i.value; });
      $("#f-tessere").innerHTML = tessereHtml(); applica(true);
    } else if (a.hasAttribute("data-sch")) apriScheda(a.getAttribute("data-sch"));
    else if (a.hasAttribute("data-agg")) {
      var p = FV.trova(FV.MENU, a.getAttribute("data-agg"));
      aggiungi({ tipo: "menu", id: p.id, nome: p.nome, prezzo: prezzoMenu(p), q: 1, extra: [], pizza: isPizza(p) }); NX.toast(p.nome + " nel carrello");
    } else if (a.hasAttribute("data-cat")) { filtro.cat = a.getAttribute("data-cat"); $$(".a-filtri .nx-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b === a)); }); disegnaLista(); }
    else if (a.hasAttribute("data-parti")) { var k = a.getAttribute("data-parti"); carica(k === "vuota" ? { salsa: "rossa", formaggio: "fiordilatte", top: [] } : FV.trova(FV.MENU, k).pz); NX.toast("Parti da " + a.textContent.toLowerCase()); }
    else if (a.hasAttribute("data-togli")) { var id = a.getAttribute("data-togli"); stato.top = stato.top.filter(function (x) { return x !== id; }); var i0 = $('#f-tessere input[value="' + id + '"]'); if (i0) i0.checked = false; applica(true); }
    else if (a.hasAttribute("data-cq")) {
      var i = +a.getAttribute("data-i"), r = carrello[i]; if (!r) return;
      r.q += +a.getAttribute("data-cq"); if (r.q < 1) { carrello.splice(i, 1); NX.toast(r.nome + " tolto dal carrello"); }
      salvaCarrello(); route(false);
    } else if (a.hasAttribute("data-sq")) { sch.q = Math.max(1, Math.min(20, sch.q + +a.getAttribute("data-sq"))); totScheda(); }
  });
  d.addEventListener("change", function (e) {
    var t = e.target;
    if (t.closest("#f-componi")) {
      if (t.type === "radio") stato[t.name] = t.value;
      if (t.name === "top") {
        if (t.checked) {
          if (stato.top.length >= K.massimo) { t.checked = false; NX.toast("Massimo " + K.massimo + " ingredienti: togline uno per aggiungerne un altro.", "info"); return; }
          stato.top.push(t.value);
        } else stato.top = stato.top.filter(function (x) { return x !== t.value; });
      }
      applica(true);
    }
    if (t.id === "f-zona") conti();
  });
  d.addEventListener("input", function (e) { if (e.target.id === "a-cerca") { filtro.testo = e.target.value.trim().toLowerCase(); menuPronto = true; disegnaLista(); } });
  d.addEventListener("submit", function (e) {
    if (e.target.id === "f-componi") {
      e.preventDefault();
      var copia = JSON.parse(JSON.stringify(stato));
      aggiungi({ tipo: "composta", nome: "La tua pizza", composta: copia, prezzo: FV.prezzoPizza(copia), q: 1, pizza: true });
      var palco = $("#f-palco"); palco.classList.remove("parte"); void palco.offsetWidth; palco.classList.add("parte");
      NX.toast("La tua pizza è nel carrello");
    } else if (e.target.id === "f-ordine") { e.preventDefault(); inviaOrdine(e.target); }
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); route(true); });

  badge(); route(false); giro(); setInterval(giro, 3000);
})();
